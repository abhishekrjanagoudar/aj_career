# Mode: tracker — Application Tracker

Read and display `data/applications.md`.

Tracker format:

```markdown
| # | Date | Company | Role | Score | Status | PDF | Report |
```

Canonical statuses:
`Evaluated` → `Applied` → `Responded` → `Interview` → `Offer` / `Rejected` / `Discarded` / `SKIP`

If user asks for status updates, edit the matching row.

Also show:
- Total applications
- Counts by status
- Average score
- % with generated PDF
- % with report link
