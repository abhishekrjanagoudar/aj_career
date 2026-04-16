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
 * - Injects a Core Competencies block from JD keywords without inventing experience.
 * - Preserves the original source file and compiles from a temp working directory.
 */

import { mkdtemp, readFile, writeFile, copyFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve, basename, dirname } from 'path';
import { spawnSync } from 'child_process';

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

function buildKeywordSection(keywords, company, jobTitle) {
  const cleaned = [...new Set(keywords.map((k) => k.trim()).filter(Boolean))].slice(0, 10);
  if (cleaned.length === 0) return '';

  const bullets = cleaned.map((k) => `\\textbf{${latexEscape(k)}}`).join(' \\textbf{·} ');
  const contextBits = [];
  if (jobTitle) contextBits.push(`Role: ${latexEscape(jobTitle)}`);
  if (company) contextBits.push(`Company: ${latexEscape(company)}`);
  const contextLine = contextBits.length ? `\\item ${contextBits.join(' \\textbf{·} ')}` : '';

  return `

\\noindent\\csection{Core Competencies}{\\footnotesize
    \\begin{itemize}[itemsep=0pt,parsep=0pt,topsep=2pt]
        \\item ${bullets}
        ${contextLine}
    \\end{itemize}
}
`;
}

function injectKeywordSection(tex, section) {
  if (!section) return tex;
  if (/\\csection\{Core Competencies\}/m.test(tex)) return tex;

  const beforeLanguages = /\n\\noindent\\csection\{Languages\}/m;
  if (beforeLanguages.test(tex)) {
    return tex.replace(beforeLanguages, `${section}\n\\noindent\\csection{Languages}`);
  }

  return tex.replace(/\n\\end\{document\}\s*$/m, `${section}\n\\end{document}\n`);
}

function disableMissingGraphics(tex, sourceDir) {
  return tex.replace(/\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}/g, (full, relPath) => {
    const candidate = join(sourceDir, relPath);
    if (existsSync(candidate)) return full;
    return `% Missing graphic disabled by career-ops: ${relPath}`;
  });
}

function resolveEngine(preferred) {
  const candidates = preferred
    ? [preferred]
    : ['pdflatex', 'xelatex', 'lualatex'];

  for (const cmd of candidates) {
    const probe = spawnSync('bash', ['-lc', `command -v ${cmd}`], { encoding: 'utf-8' });
    if (probe.status === 0 && probe.stdout.trim()) {
      return cmd;
    }
  }
  return '';
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
  const selectedEngine = resolveEngine(engine);

  if (!selectedEngine) {
    console.error('No LaTeX engine found. Install pdflatex, xelatex, or lualatex.');
    process.exit(1);
  }

  console.log(`📄 Input:  ${texInput}`);
  console.log(`📁 Output: ${pdfOutput}`);
  console.log(`📏 Format: ${format.toUpperCase()}`);
  console.log(`🛠️  Engine: ${selectedEngine}`);

  let tex = await readFile(texInput, 'utf-8');
  tex = applyPaperFormat(tex, format);
  tex = disableMissingGraphics(tex, dirname(texInput));

  const section = buildKeywordSection(keywords, company, jobTitle);
  tex = injectKeywordSection(tex, section);

  const workingDir = await mkdtemp(join(tmpdir(), 'career-ops-latex-'));
  const sourceName = basename(texInput);
  const sourceInTmp = join(workingDir, sourceName);

  await writeFile(sourceInTmp, tex, 'utf-8');
  await copyLocalLatexDependencies(texInput, workingDir);

  const compile = spawnSync(
    selectedEngine,
    ['-interaction=nonstopmode', '-halt-on-error', sourceName],
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
