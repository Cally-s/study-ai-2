# Metric Computation

The pipeline resolves a published definition and authorized scope, fixes a window and source watermarks, validates versions, determines eligibility/exclusions/pending review, calculates numerator and denominator, applies uncertainty/data quality/suppression, validates, creates an immutable snapshot, then updates projections. Runs are idempotent. Late validated evidence enters a later snapshot; rebuilds never overwrite history.
