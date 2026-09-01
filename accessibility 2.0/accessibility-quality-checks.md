# Accessibility Quality Checks

## Purpose and modes

Step 24 extends the Step 23 Studio and shared issue collection. Modes are Quick Draft, Full Pre-Publish, Targeted Recheck, Batch Resource, Platform Component, and Scheduled Recheck. Results distinguish PASS, FAIL, WARNING, REQUIRES_HUMAN_REVIEW, NOT_APPLICABLE, NOT_TESTED, UNABLE_TO_TEST, ERROR and OUTDATED.

## Review and limitations

Deterministic checks record observed failures. Heuristics say “Possible issue — human review required” and include confidence without percentages. Keyboard, screen-reader, caption, transcript, alt-text, language, cognitive, academic-equivalence, disabled-student, organization, print, RTL and Low-Bandwidth reviews remain separate human tasks.

Every record stores rule/scanner/policy versions and exact resource version/hash. Source changes invalidate runs, results, human reviews and publication records. The client has no production server gate, browser scanner, human-review service, media/PDF checker or publisher.
