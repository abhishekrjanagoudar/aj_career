# Mode: scan — Portal Scanner

Scan configured portals, filter relevant roles, and add new offers to pipeline.

## Configuration source

Read `portals.yml`:
- `search_queries`
- `tracked_companies`
- `title_filter` (positive/negative/seniority_boost)

## Discovery strategy (3 layers)

1. Playwright direct scan of each `careers_url` (primary)
2. Greenhouse API where available (complementary)
3. WebSearch `site:` queries (broad discovery)

## Workflow

1. Read config and dedup sources (`scan-history.tsv`, `applications.md`, `pipeline.md`)
2. Run layer 1 + 2 + 3 and collect candidates
3. Filter by title rules
4. Deduplicate by URL and normalized company+role
5. For new offers:
   - Append to `pipeline.md` pending list
   - Record in `scan-history.tsv` with `added`
6. Record filtered and duplicate entries with `skipped_title`/`skipped_dup`

## Output summary

Return:
- Queries run
- Total found
- Relevant after filter
- Duplicates skipped
- New entries added

Then prompt user to run `/career-ops pipeline`.
