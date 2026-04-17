#!/usr/bin/env node

/**
 * generate-pdf.mjs — Unified PDF entrypoint
 *
 * Usage:
 *   node career-ops/generate-pdf.mjs <input.html|input.tex> <output.pdf> [--format=letter|a4]
 *
 * Behavior:
 * - If input is .html → render via Playwright (existing path).
 * - If input is .tex  → delegate to generate-pdf-latex.mjs (uses resume.tex + resume.cls).
 * - If no input is provided and AJ CV/resume.tex exists → default to LaTeX template path.
 *
 * Requires: @playwright/test (or playwright) installed.
 * Uses Chromium headless to render the HTML and produce a clean, ATS-parseable PDF.
 */

import { chromium } from 'playwright';
import { existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { readFile } from 'fs/promises';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Normalize text for ATS compatibility by converting problematic Unicode.
 *
 * ATS parsers and legacy systems often fail on em-dashes, smart quotes,
 * zero-width characters, and non-breaking spaces. These cause mojibake,
 * parsing errors, or display issues. See issue #1.
 *
 * Only touches body text — preserves CSS, JS, tag attributes, and URLs.
 * Returns { html, replacements } so the caller can log what was changed.
 */
function normalizeTextForATS(html) {
  const replacements = {};
  const bump = (key, n) => { replacements[key] = (replacements[key] || 0) + n; };

  const masks = [];
  const masked = html.replace(
    /<(style|script)\b[^>]*>[\s\S]*?<\/\1>/gi,
    (match) => {
      const token = `\u0000MASK${masks.length}\u0000`;
      masks.push(match);
      return token;
    }
  );

  let out = '';
  let i = 0;
  while (i < masked.length) {
    const lt = masked.indexOf('<', i);
    if (lt === -1) { out += sanitizeText(masked.slice(i)); break; }
    out += sanitizeText(masked.slice(i, lt));
    const gt = masked.indexOf('>', lt);
    if (gt === -1) { out += masked.slice(lt); break; }
    out += masked.slice(lt, gt + 1);
    i = gt + 1;
  }

  const restored = out.replace(/\u0000MASK(\d+)\u0000/g, (_, n) => masks[Number(n)]);
  return { html: restored, replacements };

  function sanitizeText(text) {
    if (!text) return text;
    let t = text;
    t = t.replace(/\u2014/g, () => { bump('em-dash', 1); return '-'; });
    t = t.replace(/\u2013/g, () => { bump('en-dash', 1); return '-'; });
    t = t.replace(/[\u201C\u201D\u201E\u201F]/g, () => { bump('smart-double-quote', 1); return '"'; });
    t = t.replace(/[\u2018\u2019\u201A\u201B]/g, () => { bump('smart-single-quote', 1); return "'"; });
    t = t.replace(/\u2026/g, () => { bump('ellipsis', 1); return '...'; });
    t = t.replace(/[\u200B\u200C\u200D\u2060\uFEFF]/g, () => { bump('zero-width', 1); return ''; });
    t = t.replace(/\u00A0/g, () => { bump('nbsp', 1); return ' '; });
    return t;
  }
}

async function generatePDF() {
  const args = process.argv.slice(2);

  // Parse arguments
  let inputPath;
  let outputPath;
  let format = 'a4';
  const optionArgs = [];

  for (const arg of args) {
    if (arg.startsWith('--format=')) {
      format = arg.split('=')[1].toLowerCase();
      optionArgs.push(arg);
    } else if (arg.startsWith('--')) {
      optionArgs.push(arg);
    } else if (!inputPath) {
      inputPath = arg;
    } else if (!outputPath) {
      outputPath = arg;
    }
  }

  // If no explicit input is passed, default to user's LaTeX template when present.
  const defaultLatexInput = resolve(__dirname, 'AJ CV/resume.tex');
  const hasDefaultLatex = existsSync(defaultLatexInput);
  const usingDefaultLatex = !inputPath && hasDefaultLatex;

  if (usingDefaultLatex) {
    inputPath = defaultLatexInput;
    if (!outputPath) {
      const date = new Date().toISOString().slice(0, 10);
      outputPath = resolve(__dirname, `output/cv-candidate-default-${date}-latex.pdf`);
    }
  }

  if (!inputPath || !outputPath) {
    console.error('Usage: node generate-pdf.mjs <input.html|input.tex> <output.pdf> [--format=letter|a4] [--keywords="..."] [--job-title="..."] [--company="..."] [--engine=...]');
    process.exit(1);
  }

  const resolvedInput = resolve(inputPath);
  const resolvedOutput = resolve(outputPath);
  const isLatexInput = /\.tex$/i.test(resolvedInput);

  // Delegate LaTeX builds to the dedicated generator so resume.tex/resume.cls are honored.
  if (isLatexInput) {
    const latexScript = resolve(__dirname, 'generate-pdf-latex.mjs');
    const latexArgs = [latexScript, resolvedInput, resolvedOutput, ...optionArgs];
    const run = spawnSync(process.execPath, latexArgs, { stdio: 'inherit' });
    if (run.status !== 0) {
      process.exit(run.status ?? 1);
    }
    return;
  }

  inputPath = resolvedInput;
  outputPath = resolvedOutput;

  // Validate format
  const validFormats = ['a4', 'letter'];
  if (!validFormats.includes(format)) {
    console.error(`Invalid format "${format}". Use: ${validFormats.join(', ')}`);
    process.exit(1);
  }

  console.log(`📄 Input:  ${inputPath}`);
  console.log(`📁 Output: ${outputPath}`);
  console.log(`📏 Format: ${format.toUpperCase()}`);

  // Read HTML to inject font paths as absolute file:// URLs
  let html = await readFile(inputPath, 'utf-8');

  // Resolve font paths relative to career-ops/fonts/
  const fontsDir = resolve(__dirname, 'fonts');
  html = html.replace(
    /url\(['"]?\.\/fonts\//g,
    `url('file://${fontsDir}/`
  );
  // Close any unclosed quotes from the replacement
  html = html.replace(
    /file:\/\/([^'")]+)\.woff2['"]\)/g,
    `file://$1.woff2')`
  );

  // Normalize text for ATS compatibility (issue #1)
  const normalized = normalizeTextForATS(html);
  html = normalized.html;
  const totalReplacements = Object.values(normalized.replacements).reduce((a, b) => a + b, 0);
  if (totalReplacements > 0) {
    const breakdown = Object.entries(normalized.replacements).map(([k, v]) => `${k}=${v}`).join(', ');
    console.log(`🧹 ATS normalization: ${totalReplacements} replacements (${breakdown})`);
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set content with file base URL for any relative resources
  await page.setContent(html, {
    waitUntil: 'networkidle',
    baseURL: `file://${dirname(inputPath)}/`,
  });

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);

  // Generate PDF
  const pdfBuffer = await page.pdf({
    format: format,
    printBackground: true,
    margin: {
      top: '0.6in',
      right: '0.6in',
      bottom: '0.6in',
      left: '0.6in',
    },
    preferCSSPageSize: false,
  });

  // Write PDF
  const { writeFile } = await import('fs/promises');
  await writeFile(outputPath, pdfBuffer);

  // Count pages (approximate from PDF structure)
  const pdfString = pdfBuffer.toString('latin1');
  const pageCount = (pdfString.match(/\/Type\s*\/Page[^s]/g) || []).length;

  await browser.close();

  console.log(`✅ PDF generated: ${outputPath}`);
  console.log(`📊 Pages: ${pageCount}`);
  console.log(`📦 Size: ${(pdfBuffer.length / 1024).toFixed(1)} KB`);

  return { outputPath, pageCount, size: pdfBuffer.length };
}

generatePDF().catch((err) => {
  console.error('❌ PDF generation failed:', err.message);
  process.exit(1);
});
