# Mode: batch — Bulk Offer Processing

Two usage modes: **conductor --chrome** (live portal browsing) or **standalone script** (pre-collected URLs).

## Architecture

Conductor orchestrates navigation and dispatches each offer to clean worker agents (Claude or Gemini). Workers produce report, PDF, and tracker addition.

## Files

- `batch/batch-input.tsv` — input URLs
- `batch/batch-state.tsv` — resumable state
- `batch/batch-runner.sh` — orchestrator
- `batch/batch-prompt.md` — worker prompt
- `batch/logs/` — per-offer logs
- `batch/tracker-additions/` — tracker lines

## Conductor mode

1. Load `batch-state.tsv`
2. Navigate portal in Chrome
3. Extract URLs and append to input
4. For each pending offer:
   - Open listing, capture JD text
   - Save temporary JD file
   - Compute next report number
   - Run batch runner with selected CLI
   - Update state/logs
5. Handle pagination
6. Merge tracker additions into `applications.md`

## Standalone mode

```bash
batch/batch-runner.sh [OPTIONS]
```

Options include:
- `--dry-run`
- `--retry-failed`
- `--start-from N`
- `--parallel N`
- `--max-retries N`
- `--agent-cli claude|gemini`
- `--agent-cmd "..."`

## Reliability

- Resume from `batch-state.tsv`
- PID lock avoids double runs
- Offer-level isolation prevents global failure
