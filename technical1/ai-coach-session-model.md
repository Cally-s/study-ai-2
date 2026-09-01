# AI Coach Session Model

> Step 66 integration: each request creates a versioned decision run under the owned session. The run validates the session row version, preserves its exact policy/safeguard snapshots, and cannot rewrite earlier responses when mode or policy changes.

`AICoachSession` captures user, course/assignment context, learning mode, published policy version, safeguard snapshot, optional accessibility snapshot, privacy-check state, and final-answer lock. Creation is idempotent. The model stores content references and safe task context, not credentials, raw safety content, hidden answers, or chain of thought. A session cannot begin from a draft policy.
