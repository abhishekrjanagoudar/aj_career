#!/usr/bin/env node

/**
 * generate-pdf-latex.mjs — LaTeX (.tex) -> PDF
 *
 * Usage:
 *   node generate-pdf-latex.mjs <input.tex> <output.pdf> [options]
 *
 * Options:
 *   --format=letter|a4
 *   --keywords="kw1,kw2,kw3"
 *   --job-title="Role Name"
 *   --company="Company Name"
 *   --engine=pdflatex|xelatex|lualatex
 *
 * Notes:
 * - Uses the user's LaTeX template directly (e.g. AJ CV/resume.tex).
 * - Injects a Skills block from JD keywords without inventing experience.
 * - Preserves the original source file and compiles from a temp working directory.
 */

import { mkdtemp, readFile, writeFile, copyFile, readdir, mkdir, chmod } from 'fs/promises';
import { existsSync } from 'fs';
import { tmpdir, homedir } from 'os';
import { join, resolve, basename, dirname } from 'path';
import { spawnSync } from 'child_process';

const TECTONIC_VERSION = '0.16.8';
const TECTONIC_RELEASE_BASE = `https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic@${TECTONIC_VERSION}`;
const TECTONIC_CACHE_DIR = join(homedir(), '.cache', 'career-ops', 'tectonic', TECTONIC_VERSION);

function parseArgs(argv) {
  let inputPath;
  let outputPath;
  let format = 'a4';
  let keywords = [];
  let jobTitle = '';
  let company = '';
  let engine = '';

  for (const arg of argv) {
    if (arg.startsWith('--format=')) {
      format = arg.split('=')[1].toLowerCase();
    } else if (arg.startsWith('--keywords=')) {
      const raw = arg.split('=')[1] || '';
      keywords = raw.split(',').map((k) => k.trim()).filter(Boolean);
    } else if (arg.startsWith('--job-title=')) {
      jobTitle = arg.slice('--job-title='.length).trim();
    } else if (arg.startsWith('--company=')) {
      company = arg.slice('--company='.length).trim();
    } else if (arg.startsWith('--engine=')) {
      engine = arg.split('=')[1].toLowerCase();
    } else if (!inputPath) {
      inputPath = arg;
    } else if (!outputPath) {
      outputPath = arg;
    }
  }

  return { inputPath, outputPath, format, keywords, jobTitle, company, engine };
}

function latexEscape(text) {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([#$%&_^{}])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/</g, '\\textless{}')
    .replace(/>/g, '\\textgreater{}');
}

function applyPaperFormat(tex, format) {
  if (!['a4', 'letter'].includes(format)) return tex;

  const paperToken = format === 'letter' ? 'letterpaper' : 'a4paper';

  if (/\\geometry\s*\{[^}]*\}/m.test(tex)) {
    return tex.replace(/\\geometry\s*\{([^}]*)\}/m, (_match, content) => {
      let updated = content
        .replace(/\ba4paper\b/g, '')
        .replace(/\bletterpaper\b/g, '')
        .replace(/\s+,/g, ',')
        .replace(/,,+/g, ',')
        .replace(/^\s*,\s*/g, '')
        .replace(/\s*,\s*$/g, '');

      if (updated.trim().length === 0) {
        updated = paperToken;
      } else {
        updated = `${paperToken}, ${updated}`;
      }
      return `\\geometry{${updated}}`;
    });
  }

  return tex;
}

function buildKeywordItems(keywords, company, jobTitle) {
  const cleaned = [...new Set(keywords.map((k) => k.trim()).filter(Boolean))].slice(0, 10);
  if (cleaned.length === 0) return '';

  const bullets = cleaned.map((k) => `\\textbf{${latexEscape(k)}}`).join(' \\textbf{·} ');
  const contextBits = [];
  if (jobTitle) contextBits.push(`Role: ${latexEscape(jobTitle)}`);
  if (company) contextBits.push(`Company: ${latexEscape(company)}`);
  const lines = [`\\item ${bullets}`];
  if (contextBits.length) {
    lines.push(`\\item ${contextBits.join(' \\textbf{·} ')}`);
  }

  return lines.join('\n        ');
}

function buildSkillsSection(items) {
  if (!items) return '';

  return `

\\noindent\\csection{Skills}{\\footnotesize
    \\begin{itemize}[itemsep=0pt,parsep=0pt,topsep=2pt]
        ${items}
    \\end{itemize}
}
`;
}

function injectKeywordSection(tex, items) {
  if (!items) return tex;

  const normalizedTex = tex.replace(/\\csection\{Core Competencies\}/g, '\\csection{Skills}');

  const skillsSectionPattern = /(\\noindent\\csection\{Skills\}\{\\footnotesize[\s\S]*?\\begin\{itemize\}\[[^\]]*\]\s*)([\s\S]*?)(\s*\\end\{itemize\}\s*\})/m;
  if (skillsSectionPattern.test(normalizedTex)) {
    return normalizedTex.replace(skillsSectionPattern, (_match, start, existingItems, end) => {
      const trimmedExisting = existingItems.trimEnd();
      const separator = trimmedExisting ? '\n        ' : '';
      return `${start}${trimmedExisting}${separator}${items}${end}`;
    });
  }

  const section = buildSkillsSection(items);
  const beforeLanguages = /\n\\noindent\\csection\{Languages\}/m;
  if (beforeLanguages.test(tex)) {
    return normalizedTex.replace(beforeLanguages, `${section}\n\\noindent\\csection{Languages}`);
  }

  return normalizedTex.replace(/\n\\end\{document\}\s*$/m, `${section}\n\\end{document}\n`);
}

function disableMissingGraphics(tex, sourceDir) {
  return tex.replace(/\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}/g, (full, relPath) => {
    const candidate = join(sourceDir, relPath);
    if (existsSync(candidate)) return full;
    return `% Missing graphic disabled by career-ops: ${relPath}`;
  });
}

async function copyLocalLatexDependencies(inputPath, workingDir) {
  const srcDir = dirname(inputPath);
  const files = await readdir(srcDir);
  const depExts = new Set(['.cls', '.sty', '.bib', '.bst', '.png', '.jpg', '.jpeg', '.pdf']);

  for (const file of files) {
    const lower = file.toLowerCase();
    const ext = lower.slice(lower.lastIndexOf('.'));
    if (depExts.has(ext)) {
      await copyFile(join(srcDir, file), join(workingDir, file));
    }
  }
}

function tectonicAssetName() {
  const key = `${process.platform}-${process.arch}`;
  if (key === 'linux-x64') return `tectonic-${TECTONIC_VERSION}-x86_64-unknown-linux-gnu.tar.gz`;
  if (key === 'linux-arm64') return `tectonic-${TECTONIC_VERSION}-aarch64-unknown-linux-musl.tar.gz`;
  return '';
}

async function downloadFile(url, destinationPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(destinationPath, buffer);
}

async function findExecutable(rootDir, fileName) {
  const entries = await readdir(rootDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(rootDir, entry.name);
    if (entry.isDirectory()) {
      const nested = await findExecutable(fullPath, fileName);
      if (nested) return nested;
    } else if (entry.isFile() && entry.name === fileName) {
      return fullPath;
    }
  }

  return '';
}

async function ensureLocalTectonic() {
  const assetName = tectonicAssetName();
  if (!assetName) return '';

  await mkdir(TECTONIC_CACHE_DIR, { recursive: true });
  const installedBinary = join(TECTONIC_CACHE_DIR, 'tectonic');
  if (existsSync(installedBinary)) {
    return installedBinary;
  }

  const archivePath = join(TECTONIC_CACHE_DIR, assetName);
  if (!existsSync(archivePath)) {
    console.log(`⬇️  Installing Tectonic ${TECTONIC_VERSION} locally...`);
    await downloadFile(`${TECTONIC_RELEASE_BASE}/${assetName}`, archivePath);
  }

  const extractDir = join(TECTONIC_CACHE_DIR, 'extract');
  await mkdir(extractDir, { recursive: true });

  const unpack = spawnSync('tar', ['-xzf', archivePath, '-C', extractDir], { encoding: 'utf-8' });
  if (unpack.status !== 0) {
    throw new Error(`Failed to unpack Tectonic archive: ${unpack.stderr || unpack.stdout || 'unknown error'}`);
  }

  const extractedBinary = await findExecutable(extractDir, 'tectonic');
  if (!extractedBinary) {
    throw new Error('Tectonic archive did not contain a tectonic binary.');
  }

  await copyFile(extractedBinary, installedBinary);
  await chmod(installedBinary, 0o755);
  return installedBinary;
}

async function resolveEngine(preferred) {
  const candidates = preferred ? [preferred] : ['pdflatex', 'xelatex', 'lualatex'];

  for (const cmd of candidates) {
    const probe = spawnSync('bash', ['-lc', `command -v ${cmd}`], { encoding: 'utf-8' });
    if (probe.status === 0 && probe.stdout.trim()) {
      return cmd;
    }
  }

  return ensureLocalTectonic();
}

async function main() {
  const { inputPath, outputPath, format, keywords, company, jobTitle, engine } = parseArgs(process.argv.slice(2));

  if (!inputPath || !outputPath) {
    console.error('Usage: node generate-pdf-latex.mjs <input.tex> <output.pdf> [--format=letter|a4] [--keywords="k1,k2"] [--job-title="..."] [--company="..."] [--engine=pdflatex|xelatex|lualatex]');
    process.exit(1);
  }

  if (!['a4', 'letter'].includes(format)) {
    console.error('Invalid --format. Use a4 or letter.');
    process.exit(1);
  }

  const texInput = resolve(inputPath);
  const pdfOutput = resolve(outputPath);
  const selectedEngine = await resolveEngine(engine);

  if (!selectedEngine) {
    console.error('No LaTeX engine found. Install pdflatex, xelatex, lualatex, or allow the repo-local Tectonic bootstrap to download a binary.');
    process.exit(1);
  }

  console.log(`📄 Input:  ${texInput}`);
  console.log(`📁 Output: ${pdfOutput}`);
  console.log(`📏 Format: ${format.toUpperCase()}`);
  console.log(`🛠️  Engine: ${selectedEngine}`);

  let tex = await readFile(texInput, 'utf-8');
  tex = applyPaperFormat(tex, format);
  tex = disableMissingGraphics(tex, dirname(texInput));

  const items = buildKeywordItems(keywords, company, jobTitle);
  tex = injectKeywordSection(tex, items);

  const workingDir = await mkdtemp(join(tmpdir(), 'career-ops-latex-'));
  const sourceName = basename(texInput);
  const sourceInTmp = join(workingDir, sourceName);

  await writeFile(sourceInTmp, tex, 'utf-8');
  await copyLocalLatexDependencies(texInput, workingDir);

  const compileArgs = basename(selectedEngine) === 'tectonic'
    ? ['--outdir', workingDir, sourceName]
    : ['-interaction=nonstopmode', '-halt-on-error', sourceName];

  const compile = spawnSync(
    selectedEngine,
    compileArgs,
    { cwd: workingDir, encoding: 'utf-8' }
  );

  if (compile.status !== 0) {
    const logPath = join(workingDir, sourceName.replace(/\.tex$/i, '.log'));
    console.error('❌ LaTeX compilation failed.');
    console.error(compile.stdout || '');
    console.error(compile.stderr || '');
    console.error(`🧾 Build log: ${logPath}`);
    process.exit(1);
  }

  const compiledPdf = join(workingDir, sourceName.replace(/\.tex$/i, '.pdf'));
  await copyFile(compiledPdf, pdfOutput);

  const stat = spawnSync('bash', ['-lc', `wc -c < "${pdfOutput}"`], { encoding: 'utf-8' });
  const sizeBytes = stat.status === 0 ? Number((stat.stdout || '0').trim()) : 0;

  console.log(`✅ PDF generated: ${pdfOutput}`);
  console.log(`📦 Size: ${(sizeBytes / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error(`❌ PDF generation failed: ${err.message}`);
  process.exit(1);
});
