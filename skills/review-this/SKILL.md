---
name: review-this
description: >-
  Produces a structured code review or documentation review with category
  ratings, an overall score, a checklist, and actionable improvement
  suggestions. Use when the task involves code review, documentation review,
  PR review, feedback, or critique.
license: Apache-2.0
metadata:
  version: "1.0.0"
  author: Benjamin Cane
  repository: review-this
---

# Review This

Use this skill to review code or documentation with a clear structure, direct
judgment, and actionable guidance.

The goal is not to be polite for its own sake. The goal is to be accurate,
useful, and specific about what is good, what is weak, and what should change.

## When to Use

Use this skill when:

- the user asks for a review, critique, or feedback
- you need to assess code quality before merge or release
- you need to evaluate documentation quality and usefulness
- you need a concise scorecard plus concrete follow-up actions

Do not use this skill as a substitute for implementation or bug fixing when the
user already wants changes rather than a review.

## Working Rules

- Inspect the actual material before scoring it.
- Prefer evidence over vibes. Point to real files, behavior, gaps, or examples.
- Be direct. Do not soften important criticism into ambiguity.
- Keep the review structured and concise.
- Separate findings from suggestions.
- If the material is too incomplete to rate confidently, say so.

## Review Modes

Choose the mode that matches the user's request:

- Code review:
  assess quality, correctness, design, maintainability, testing, performance,
  security, and resiliency.
- Documentation review:
  assess substance, packaging, accuracy, effectiveness, clarity, and polish.

If the request spans both code and docs, say which areas you reviewed and score
them accordingly.

## Review Workflow

Work in this order:

1. Read the target material and any nearby context that changes interpretation.
2. Decide whether this is primarily code, docs, or a mixed review.
3. Identify the strongest positives and the most important weaknesses.
4. Score the relevant categories with short rationale.
5. Produce the overall rating, checklist, and actionable improvements.

## Rating Guidance

Score each category from 0 to 10:

- `9-10`: excellent, only minor improvements
- `7-8`: solid, with notable but non-fundamental gaps
- `5-6`: mixed quality, important weaknesses to address
- `3-4`: weak, substantial revision needed
- `0-2`: broken, misleading, or not fit for purpose

Use emoji only for the overall rating line:

- `9-10`: `✅`
- `7-8`: `🙂`
- `5-6`: `⚠️`
- `0-4`: `❌`

## Category Sets

For code, rate:

- code quality
- architecture and design
- maintainability
- performance and efficiency
- security
- resiliency

For documentation, rate:

- substance
- packaging
- accuracy
- effectiveness
- clarity
- quality

For the detailed dimensions behind each category, load:

- `references/CODE-CRITERIA.md` for code reviews
- `references/DOCS-CRITERIA.md` for documentation reviews

## Output

Produce the review in this shape:

1. Category Ratings
2. Overall Rating
3. Checklist Summary
4. Suggestions for Improvement

Use `assets/review-template.md` when you want a fill-in structure for the final
response.

For output specifics, load:

- `references/OUTPUT.md` for section expectations and tone
- `assets/review-template.md` for the review template

## Loading Guidance

Do not load every supporting file by default.

- Load `references/CODE-CRITERIA.md` when reviewing code.
- Load `references/DOCS-CRITERIA.md` when reviewing docs.
- Load `references/OUTPUT.md` and `assets/review-template.md` when writing the
  final review.

## Success Criteria

The review is successful when it:

- reflects the actual material reviewed
- gives honest category scores with short rationale
- surfaces the most important strengths and weaknesses
- provides concrete improvements instead of vague advice
- stays concise and easy to scan
