# Recovery Priority Scoring Policy

Default internal calculation:

`urgency × 3 + academic impact × 2 + prerequisite importance × 2 + recoverability + student importance + immediate usefulness`

The configured maximum is 41. Factor ranges, weights, thresholds, tie-breaking, policy version and algorithm version are validated configuration. Hard gates precede score bands. Stable ties use verified due time, dependency unlock value, stable inventory order and work-item identifier—never a protected characteristic or behavior proxy.

The raw score supports consistency but is not a final decision and is not exposed to any role. Configuration changes invalidate prior decisions and require deterministic recalculation against the same source snapshot.
