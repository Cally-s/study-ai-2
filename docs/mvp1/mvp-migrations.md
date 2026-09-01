# MVP Migration Strategy

For each stage: inventory existing data; add tables/fields additively; add nullable references; run idempotent tenant-scoped backfills; validate ownership; dual-read where needed; cut over writes; reconcile counts/relationships; deprecate legacy fields; and remove only after the rollback window.

No destructive first migration is allowed. Compatibility views are read-only, derived fields remain server controlled, migration logs contain no private content, and rollback never destroys later-stage drafts or immutable policy/evidence/review history. Every database change requires rollback or forward-fix instructions.

Current workspace result: **no migrations run**. There is no database, ORM, or migration tool, so the staged migration plan is documentation rather than executed evidence.
