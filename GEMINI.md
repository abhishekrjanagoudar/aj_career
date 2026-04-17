# Career-Ops Gemini CLI Guide

Use this repo with Gemini CLI when you want to evaluate jobs, customize your profile, scan portals, or run batch processing.

## Quick Start

```bash
git clone https://github.com/santifer/career-ops.git
cd career-ops
npm install
npx playwright install chromium
```

## First-Time Setup

```bash
cp config/profile.example.yml config/profile.yml
cp templates/portals.example.yml portals.yml
```

Then:
- Create `cv.md` in the project root
- Edit `config/profile.yml`
- Edit `portals.yml`

## Open Gemini CLI

```bash
gemini
```

Useful prompts:
- "Update my profile from this CV text"
- "Change the archetypes to backend engineering roles"
- "Add these companies to portals.yml"
- "Adjust title filters for electrical, E&I, and AVEVA roles"

## Common Career-Ops Commands

Inside Gemini CLI:
- `/career-ops` to see all commands
- `/career-ops scan` to find offers
- `/career-ops pipeline` to process inbox URLs
- `/career-ops pdf` to generate a CV
- `/career-ops batch` to process multiple offers

## Batch Mode with Gemini

```bash
AGENT_CLI=gemini batch/batch-runner.sh
```

Or use a custom command:

```bash
batch/batch-runner.sh --agent-cmd "gemini -p --system-instruction-file"
```

## Dashboard

If you launch the dashboard from inside `dashboard/`, use:

```bash
./career-dashboard --path ..
```

## PDF Notes

`npm run pdf` uses the LaTeX template in `AJ CV/resume.tex`.

If you want to verify the repo after changes:

```bash
node test-all.mjs --quick
```
