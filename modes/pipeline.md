# Mode: pipeline — URL Inbox Processor

Process pending offers from `data/pipeline.md`.

## Workflow

1. Read `data/pipeline.md` and find `- [ ]` entries in `Pending`.
2. For each pending URL:
   - Compute next sequential report number
   - Extract JD (Playwright → WebFetch → WebSearch)
   - If inaccessible, mark as `- [!]` with reason and continue
   - Run full auto-pipeline (A-F evaluation, report, PDF if eligible, tracker)
   - Move entry to `Processed` as:
     `- [x] #NNN | URL | Company | Role | Score/5 | PDF ✅/❌`
3. If 3+ pending URLs, process in parallel agents when available.
4. Return summary table:

| # | Company | Role | Score | PDF | Recommended action |

## Extraction Strategy

1. Playwright (preferred)
2. WebFetch fallback
3. WebSearch last resort

Special cases:
- LinkedIn login wall → mark `[!]` and ask user for pasted text
- PDF URL → read directly
- `local:` prefix → read local file under `jds/`

## Numbering

- Scan `reports/`
- Parse highest numeric prefix
- Next number = max + 1

## Source Sync

Run before processing:

```bash
node cv-sync-check.mjs
```

If warnings exist, notify user before continuing.
