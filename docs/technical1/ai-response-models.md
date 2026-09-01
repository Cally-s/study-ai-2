# AI Response Models

> Step 66 integration: the ephemeral coaching candidate is never a response record. Only the strict `ai-coach-decision/1.0` object that passes policy, assistance, source, confidence, privacy, language, terminology, accessibility, injection, and final-answer validation is persisted once by content reference.

`AIResponseRecord` is an immutable, ordered coaching-turn record. It stores a safe summary, confidence level and reason, student-thinking question, integrity status, final-answer-withheld flag, schema version, and optional content reference. Assumptions and verification steps are normalized ordered children. Internal reasoning and hidden final answers are never persisted. Idempotency prevents duplicate response sequences on retry.
