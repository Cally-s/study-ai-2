# AI Response Accessibility Audit

StudySpark uses deterministic browser-generated coaching rather than an AI SDK or streaming provider. Responses appear through multiple feature-specific HTML renderers.

Audit requirements for Step 2:

- announce completion once in a polite region, never token by token
- preserve the learner prompt on failure and make retry idempotent
- render headings, lists, tables, code, and math with native/accessible semantics
- provide text equivalents for diagrams and charts
- identify response language and explain unfamiliar vocabulary on request
- allow presentation, pacing, modality, and language adaptation without changing learning objective, academic level, required reasoning, terminology, or success criteria
- test concise/original/bilingual versions side by side for academic equivalence
- never require disclosure of a diagnosis

Current evidence is insufficient to claim streaming accessibility, full screen-reader readability, accessible math, or academic equivalence of simplified output. These remain roadmap items rather than invented passes.
