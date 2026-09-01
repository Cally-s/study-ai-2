# Core Decision Rules

> Step 68 release mapping: all ten Step 67 rules are non-disableable safety/integrity dependencies of MVP Stages 1–2. Feature flags cannot bypass them, and their client prototypes do not make either stage Released.

Step 67 is the deterministic rule layer inside the Step 66 orchestrator. It does not create another decision flow. Its ten stable IDs cover AI Not Allowed, active tests, unknown policy, student final-answer lock, graded-task attempts, externally verifiable claims, no-source reasoning, citation metadata, low confidence, and teacher judgement.

Published definitions and rule sets are immutable and versioned. Every run retains `core-decision-rules/1.0`; validated responses use `ai-coach-decision/1.1`. All applicable rules evaluate in explicit precedence order. Deny overrides allow, human review overrides generation, and later rules may add safeguards even after a stronger rule applies. Only decision codes, capability effects, version references, and neutral reasons are retained.
