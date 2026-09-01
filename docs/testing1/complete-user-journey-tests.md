# Complete User-Journey Tests

## Principle

The suite validates the strongest real cross-layer behaviour available in this repository. Each of UJ-001–UJ-050 records visible, server-state, persistence, privacy, accessibility, and prohibited-side-effect assertions. It never treats a label-only check as end-to-end evidence.

## Executable coverage

`tests/complete-user-journey-tests.test.js` exercises the versioned manifest, deterministic provider/source fixtures, tenant-scoped results, global invariants, hidden-answer surface scanner, privacy canaries, exact-claim source evaluation, and direct module boundaries in the Core Decision Rules, AI Coach Decision Flow validator, and Low-Bandwidth/Offline runtime.

## Honest boundary

The workspace has no browser E2E framework, API server, durable test database, migration harness, accessibility-tree driver, service-worker emulator, production provider gateway, formatter, linter, type checker, or production build. Those layers are `NOT_AVAILABLE`; documentation is not substituted for evidence. The production release gate is therefore blocked.
## Step 70 compatibility

The responsible-learning metric layer preserves UJ-001–UJ-050 invariants: final-answer and privacy controls, exact source support, accessibility equivalence, offline pending states, conflict/history preservation, no automatic discipline, teacher/parent privacy, tenant isolation, and no usage-based evidence.
