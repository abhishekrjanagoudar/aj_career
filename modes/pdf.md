# Mode: pdf — ATS-Optimized PDF Generation

## Engine selection (HTML / LaTeX / BOTH)

Supported engines:
- `latex` (default): `AJ CV/resume.tex` + `AJ CV/resume.cls`
- `html`: `templates/cv-template.html`
- `both`: generate both outputs

## End-to-end pipeline

1. Read `cv.md`
2. Request JD if missing
3. Extract 15-20 JD keywords
4. Detect JD language (English default)
5. Detect location for page format (`letter` for US/Canada, else `a4`)
6. Detect archetype and adapt framing
7. Rewrite summary with truthful keyword injection
8. Pick top relevant projects
9. Reorder bullets by relevance
10. Build competency grid
11. Inject keywords naturally (no fabrication)
12. Generate content for selected engine
13. Write temporary assets in `/tmp`
14. Run generator command(s)
15. Report output paths and keyword coverage

## ATS rules

- Single-column layout
- Standard section headers
- No critical content in images/SVG
- Selectable UTF-8 text
- No nested tables
- Distribute keywords across summary, top bullets, skills

## Truthfulness rule

Never invent achievements, years, technologies, or metrics.

## Post-generation

If offer already exists in tracker, update PDF status from ❌ to ✅.
