# Plan Revision Versioning

Each proposal references recovery/session, source plan/version, proposed version, capacity snapshot, policy/algorithm, progress preservation, changes, deferred/urgent items, teacher/prerequisite actions, timestamps, and approval state.

Diff types cover progress, estimates, splits, moves, deferrals, unscheduled/Ask First/Stretch/removal/replacement, prerequisite/material/teacher/human actions, priority, capacity, and no change. Source/capacity changes invalidate approval. Activation requires explicit confirmation and trusted transactional storage. Rollback creates a reviewed new revision; history is never deleted. Idempotency prevents duplicate proposals.
