# Mode: auto-pipeline — End-to-End Flow

When user pastes a JD (text or URL) without explicit sub-command, run full pipeline.

## Step 0 — Extract JD

If input is URL, use in order:
1. Playwright (preferred)
2. WebFetch fallback
3. WebSearch last resort

If extraction fails, ask user to paste JD text or share screenshot.

If input is JD text, use directly.

## Step 1 — A-F Evaluation

Run full `oferta` mode.

## Step 2 — Save report

Write `reports/{###}-{company-slug}-{YYYY-MM-DD}.md`.

## Step 3 — Generate PDF

Run full `pdf` mode.

## Step 4 — Draft application answers (only if score >= 4.5)

1. Try to extract actual form questions via Playwright
2. If unavailable, use generic questions
3. Save as `## G) Draft Application Answers` in report

Tone:
- Confident, specific, no fluff
- Evidence-first, quantified where possible
- Language follows JD (English default)

## Step 5 — Update tracker

Register evaluation with report link and PDF status.

If a step fails, continue remaining steps and mark failures clearly.
