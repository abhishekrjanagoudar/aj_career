# Career-Ops Quick Guide (Claude CLI + Gemini CLI)

This is a simplified, practical guide to run career-ops with either Claude CLI or Gemini CLI.

## 1) Install

```bash
git clone https://github.com/santifer/career-ops.git
cd career-ops
npm install

# Browser runtime for scan/apply and HTML-based PDF flows
npx playwright install chromium
```

## 2) First-Time Setup

```bash
cp config/profile.example.yml config/profile.yml
cp templates/portals.example.yml portals.yml
```

Then:
- Create `cv.md` in the project root
- Edit `config/profile.yml` with your details
- Edit `portals.yml` with your target companies and queries

## 3) Choose Your Agent CLI

Use either CLI in this repository directory.

### Option A: Claude CLI

```bash
claude
```

### Option B: Gemini CLI

```bash
gemini
```

Tip: Use the same personalization prompts in either CLI.

## 4) Personalize Fast (copy/paste prompts)

Use prompts like:
- "Update my profile from this CV text"
- "Change archetypes to robotics + automation roles in Germany"
- "Add these companies to portals.yml"
- "Tune title_filter keywords for Electrical + AVEVA + E&I roles"

## 5) Daily Workflow

Inside your agent session:
- Paste a job URL for full auto pipeline, or
- Use `/career-ops` to see available commands

Common commands:
- `/career-ops scan`
- `/career-ops pipeline`
- `/career-ops pdf`
- `/career-ops tracker`
- `/career-ops batch`

## 6) Batch Mode with Claude or Gemini Workers

Run batch workers directly from shell:

```bash
# Claude workers
AGENT_CLI=claude batch/batch-runner.sh

# Gemini workers
AGENT_CLI=gemini batch/batch-runner.sh

# Custom worker command (advanced)
batch/batch-runner.sh --agent-cmd "gemini -p --system-instruction-file"
```

Useful options:

```bash
batch/batch-runner.sh --dry-run
batch/batch-runner.sh --retry-failed
batch/batch-runner.sh --parallel 2
```

## 7) Dashboard (optional)

```bash
cd dashboard
go build -o career-dashboard .
./career-dashboard
```

If your tracker data is in the repo root and you launch from `dashboard/`:

```bash
./career-dashboard --path ..
```

## 8) PDF Notes

Default npm PDF script uses LaTeX template (`AJ CV/resume.tex`).

```bash
npm run pdf
```

If LaTeX is missing, install one engine:
- `pdflatex`, or
- `xelatex`, or
- `lualatex`

The repo also bootstraps a local Tectonic engine automatically on Linux if no system LaTeX engine is available.

## 9) Quick Health Check

```bash
node test-all.mjs --quick
```

## 10) Minimal "Am I ready?" Checklist

- `cv.md` exists
- `config/profile.yml` is filled
- `portals.yml` is customized
- Playwright Chromium installed
- `node test-all.mjs --quick` passes

You are ready to evaluate URLs and generate tailored outputs.
