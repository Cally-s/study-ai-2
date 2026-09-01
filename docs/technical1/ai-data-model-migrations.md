# AI Data Model Migrations

This workspace has no physical database or migration runner. The production migration map is therefore specified, not falsely executed:

1. Create stable identity tables and tenant/owner foreign keys.
2. Backfill immutable version rows from current policy, lesson, receipt, definition, and prototype records.
3. Register existing response and portfolio artifacts with explicit provenance and version.
4. Backfill evidence links, then rebuild competency projections; never copy legacy scores.
5. Convert policy arrays into allowed-mode and restricted-action rows.
6. Convert claim/source arrays into join rows.
7. Add current-version pointers only after version validation.
8. Dual-read through compatibility projections, compare counts and ownership, then switch reads.

Rollback keeps legacy reads available and leaves new immutable ledgers intact. Destructive cleanup requires a later audited migration.
