# Mode: apply — Live Application Assistant

Interactive mode while candidate fills an application form.

## Workflow

1. Detect active tab/page (screenshot/URL/title)
2. Identify company + role
3. Find matching report in `reports/`
4. Load report and section G if present
5. Check role mismatch and warn if changed
6. Extract all visible form questions
7. Generate tailored answers for each question
8. Present clean copy-paste output

## If Playwright is unavailable

Ask candidate to provide:
- Form screenshots
- Or pasted questions
- Or company + role details

## Role change handling

If current role differs from evaluated role:
- Offer adaptation to new title
- Or re-run full evaluation
- Update tracker role title when needed

## Answer generation rules

Use:
- Block B proof points
- Block F STAR stories
- Existing section G drafts
- Specific JD details

Output template:

## Answers for [Company] — [Role]

Based on: Report #NNN | Score X.X/5 | Archetype [type]

### 1. [Exact question]
> [Copy-ready answer]

## Post-apply (optional)

If candidate confirms submission:
1. Update tracker status `Evaluated` → `Applied`
2. Update section G with final answers
3. Suggest `/career-ops contacto` for outreach
