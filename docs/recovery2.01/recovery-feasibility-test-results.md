# Recovery Feasibility Test Results

## Automated result

`tests/academic-recovery-feasibility.test.js`: **113/113 assertions passed** on 2026-08-10.

Coverage includes exact/scaled formula cases (0.75, 0.9375 internal, 1.00, 1.75), safe display rounding, negative/zero handling, remaining-time inclusion, accepted/no-longer-required/submitted exclusions, blocked/status-unknown behavior, ranges, unknown estimates, source deduplication, grade-weight independence, focused-capacity denominator, break/setup/buffer exclusion, deadline windows, pre-deadline capacity, classifications, policy versioning, analysis history/invalidation, work views, teacher flags, privacy serializers, offline review, idempotency, safe analytics, UI copy, responsive CSS, and loader order.

Step 6 focused regression remains **130/130**.

Full project regression: **3,791/3,791 checks passed across 54 suites**. All seven recovery JavaScript modules passed syntax validation; the 73-record accessibility registry parsed with 32 Critical, 37 High, and 4 Medium findings.

## Manual and infrastructure result

Keyboard, screen reader, dialog focus, 200% zoom, 320px reflow, extra-large text, contrast themes, forced colours, Language Bridge, RTL, low bandwidth, offline/reconnection, and representative-student journeys are **NOT RUN**. Database migrations, formatting, lint, type checking, production build, real server authorization, trusted time/DST, durable cross-device conflicts, and rate limiting are **NOT AVAILABLE** in this static project. Automated contracts are not a substitute for those results.
