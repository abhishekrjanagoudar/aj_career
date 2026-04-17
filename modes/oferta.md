# Mode: oferta — Full A-F Evaluation

When the candidate shares a job post (text or URL), always deliver all 6 blocks.

## Step 0 — Archetype Detection

Classify the role into one of the 6 archetypes in `_shared.md`. If hybrid, list top 2. Use this to decide:
- Which proof points to prioritize in block B
- How to rewrite the summary in block E
- Which STAR stories to prepare in block F

## Block A — Role Summary

Create a table with:
- Detected archetype
- Domain (platform/agentic/LLMOps/ML/enterprise)
- Function (build/consult/manage/deploy)
- Seniority
- Remote setup (full/hybrid/onsite)
- Team size (if mentioned)
- One-line TL;DR

## Block B — CV Match

Read `cv.md`. Map each JD requirement to exact CV evidence.

Archetype focus:
- FDE → speed and client-facing delivery
- SA → architecture and integrations
- PM → product discovery and metrics
- LLMOps → evals, observability, pipelines
- Agentic → orchestration, HITL, multi-agent
- Transformation → adoption and change management

Include a **gaps** section for each gap:
1. Hard blocker or nice-to-have?
2. Adjacent experience available?
3. Portfolio project covers it?
4. Concrete mitigation plan

## Block C — Level & Strategy

1. JD level vs candidate natural level for that archetype
2. "Sell senior without lying" plan: specific achievements and framing
3. "If down-leveled" plan: compensation guardrails, 6-month review ask, promotion criteria

## Block D — Compensation & Demand

Use WebSearch for:
- Current salary data (Glassdoor, Levels.fyi, Blind)
- Company compensation reputation
- Role demand trend

Cite sources. If data is missing, say so explicitly.

## Block E — Personalization Plan

| # | Section | Current state | Proposed change | Why |
|---|---------|---------------|-----------------|-----|

Top 5 CV changes + top 5 LinkedIn changes to maximize fit.

## Block F — Interview Plan

Create 6-10 STAR+R stories mapped to JD requirements:

| # | JD Requirement | STAR+R Story | S | T | A | R | Reflection |
|---|----------------|--------------|---|---|---|---|------------|

Use `interview-prep/story-bank.md` when available. Reuse existing stories or append new ones.

Also include:
- 1 recommended case study to present
- Red-flag questions and answer strategy

---

## Post-evaluation

After blocks A-F:

### 1) Save report `.md`

Save full evaluation to `reports/{###}-{company-slug}-{YYYY-MM-DD}.md`.

### 2) Register in tracker

Always register in tracker workflow with:
- Sequential number
- Current date
- Company
- Role
- Score
- Status
- PDF indicator
- Relative report link
