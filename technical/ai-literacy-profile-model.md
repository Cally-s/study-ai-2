# AI Literacy Profile Model

`AILiteracyProfile` stores one active, tenant-scoped preference record per user. Language, reading presentation, learning mode, source display, confidence display, and final-answer-lock preferences are mutable through optimistic concurrency. Recommendation, status, safeguard snapshot, profile version, and timestamps are server controlled. The model excludes diagnoses, inferred age, reading-ability scores, privacy findings, and ranking fields.
