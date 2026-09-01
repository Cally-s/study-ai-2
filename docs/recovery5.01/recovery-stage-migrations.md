# Recovery Stage Migrations

Use one forward-compatible normalized model. Stage 1 establishes case, task, capacity and audit; Stages 2–5 add plan/action/triage, check-in/blocker/recalculation, sharing/support, and diagnostic/import/translation/offline/aggregate records.

Migration order is additive schema → backfill safe defaults → validate tenant/source/version/history counts → enable dual reads → release guarded writes → retire legacy fields only after evidence. Rollback disables writes without destructive down migration and preserves cases, plans, actions, messages and access audit. No database or migration runner exists here, so the migration is documented, not executed.
