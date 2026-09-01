# Recovery Stage Observability

Allowlisted events cover capability errors, intake/plan/check-in milestones, recalculation conflicts, message/tutor failures, import/offline/translation conflicts, accessibility errors, authorization failures and cross-tenant attempts.

Events contain only event code, stage, error code, tenant and timestamp. Never log task descriptions, conversations, emotional/medical details, transcripts, message/summary bodies or files. Product measures are aggregate workflow events—not student scores—and require tenant isolation, purpose limitation, minimum groups and small-cell suppression. Incident response disables flags, preserves evidence and follows human review.
