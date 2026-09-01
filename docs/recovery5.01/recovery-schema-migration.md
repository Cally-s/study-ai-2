# Recovery Schema Migration

The staged plan is non-destructive: create normalized tables; add nullable keys/row versions; backfill; convert sharing booleans to grants, blockers/priority/mastery/allocations/approvals/delivery to normalized records; add provenance, indexes and constraints; reconcile counts; switch reads; remove legacy fields only after production validation. No migration was executed because this project has no database, ORM, runner or records.
