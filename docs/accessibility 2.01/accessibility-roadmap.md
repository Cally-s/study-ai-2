# Accessibility and Language Bridge Roadmap

## Critical

- Manually verify A11Y-001 dialog behavior with keyboard, VoiceOver, and NVDA; fix any modal variant that bypasses the shared lifecycle.

## High

- Complete accessible tabs across every tabbed route.
- Introduce i18n catalogues and translate/review one complete Essential flow.
- Add structured, single-announcement AI response rendering and failure recovery.
- Verify Study Room keyboard, screen-reader, text-only, reconnect, and no-camera/no-microphone paths.
- Add accessible alternatives for informative uploaded images and inaccessible source PDFs.

## Medium

- Add measured contrast coverage for every component state.
- Verify 200%/400% zoom and 320 CSS-pixel reflow.
- Add per-form error summaries, associations, focus, and draft recovery.
- Add feature-level offline/retry states and low-bandwidth loading policy.
- Audit math, code, tables, charts, tooltips, menus, and progress indicators.

## Low

- Refine heading hierarchy, grouping, help text, and optional animation.
- Add technology-guidance prompts without requiring a diagnosis.

## Dependencies and order

1. Browser E2E and axe tooling with mandatory CI.
2. Manual assistive-technology lab and evidence template.
3. Shared tabs/form/error/AI-response components.
4. i18n catalogue and one end-to-end locale.
5. Media metadata/caption/transcript workflow.
6. Real Study Room provider accessibility and resilience validation.
7. Continuous regression, performance budgets, and production monitoring.

## Step 2 capability follow-up

- Full user-activated text-to-speech with pause/stop and visible original text.
- Full user-activated speech-to-text with review-before-submit and no raw-audio retention.
- Expanded and validated caption languages, transcripts, and playback-rate integration.
- Additional complete interface locales and bilingual learning modes.
- Real Study Room provider with text-only participation and live captioning.
- Offline study packages, downloadable courses, and optional audio summaries.

## Step 3 toolbar follow-up

- Caption-language, speech-to-text, and Study Room communication quick controls after providers exist.
- Stronger offline queue and authenticated cross-device conflict-resolution interface.
- Additional explanation languages with reviewed translations.
- Optional browser-extension integration only if it preserves native semantics and privacy.
- Manual collision, forced-colours, zoom, mobile keyboard, and full-screen Study Room verification.

## Step 4 keyboard follow-up

- Complete the route matrix in supported desktop and mobile browsers with 200% zoom.
- Verify and, if needed, add mobile-sidebar focus containment and focus return.
- Add focused error summaries and field links to forms that currently report validation only through toasts.
- Verify PDF fallback controls and embedded browser PDF keyboard behavior.
- Run screen-reader keyboard combinations after keyboard-only completion passes.

## Step 5 visual-display follow-up

- Serve the application over HTTP and complete 200%/400% zoom, mobile orientation, forced-colours, and both high-contrast matrices.
- Measure semantic token pairs and every component state with a contrast tool.
- Finish colour-independent status conversion for forms, charts, tables, uploads/downloads, attendance, media, and Study Rooms.
- Add chart summaries/data tables and stacked narrow-screen table alternatives.
- Convert remaining fixed pixel reading text, fixed heights, truncation, and non-wrapping legacy layouts.
- Run source-ID content-equivalence journeys against representative lesson, quiz, safety, integrity, AI, and download records.

## Step 6 reading-comfort follow-up

- Validate Range line geometry across browsers, zoom, fonts, RTL, nested scroll containers and dynamic AI content; keep paragraph fallback until verified.
- Test ruler/highlight pointer pass-through, text selection/copy, controller collisions and forced-colours contrast on every reading route.
- Integrate Follow TTS only after a real provider exposes reliable tested boundary events.
- Add a bundled font only after licensing, glyph coverage, zoom, multilingual, code and math review.
- Complete screen-reader, performance, reflow, Study Room chat/caption and mobile safe-area matrices.
- Complete Step 7 TTS manual/provider verification, expand locale-specific math rules, and add a private expiring server-audio provider only after authorization, retention, deletion, and source-version controls exist.
- Complete Step 8 physical-microphone/browser/manual verification; deploy `Permissions-Policy: microphone=(self)`; integrate an approved ephemeral server provider only if needed; add authenticated cross-device preference fields; and keep offline/server/bilingual claims unavailable until verified.
- Integrate and verify a real authorized caption provider, signed webhook pipeline, durable private transcript/version/note/report storage, consent and retention enforcement, translation review, and synchronized recording navigation before advertising live/recorded caption coverage.
- Add an approved structured-output AI provider plus independent semantic/contradiction/qualification validation, authoritative content metadata, reviewed multilingual rules and teacher-review workflow before expanding Step 10 beyond limited deterministic English adaptations.
# Step 11 addition

Adjustable explanation levels now reuse the Step 10 contract pipeline. Next gates are an independent semantic validator, approved examples/enrichment, authoritative metadata, durable private caching, multilingual rules and Critical manual/browser verification. See `adjustable-explanation-levels.md`.
# Step 12 addition

Language Bridge now provides a safe approved-fixture architecture. Production gates: authorized translation provider, terminology senses/review, semantic equivalence, server authorization/user-scoped storage, account-profile bridge fields, reviewed high-stakes workflow, real RTL, offline/cache and Critical manual/browser verification.
# Step 13 addition

Academic vocabulary now has safe fixture-backed cards and session-private formative data. Production gates: server authorization/ownership, durable glossary/migrations, reviewed dictionary/terminology/pronunciation sources, correction workflow, full activity UIs/exports, transcript integration and Critical browser/AT/zoom/RTL verification.
# Step 14 addition

Canonical multilingual response controls now reuse Steps 10–13. Production gates: approved structured translation/instruction provider, independent semantic validation, reviewed official school/jurisdiction registry, human-reviewed high-stakes workflow, safe example catalogue, server preferences/artifacts and Critical browser/AT/RTL/zoom verification.
# Step 15 addition

Low-bandwidth preference now has safe client models and local draft/outbox/media-warning prototypes. Production gates: IndexedDB/service worker/manifests, authenticated server sync/reconciliation/deadlines, trusted media variants/metadata, Study Room low-data transport, storage quota/shared-device lifecycle and Critical throttled-browser/AT verification.

Step 16 defines first-class Text Only participation and four other media modes without privilege differences. Production gates are authenticated realtime collaboration, server-enforced private/minor/file/transcript policy, a reviewed media adapter, accessible shared editing and permission/AT/network verification.
Step 17 provides validated versioned printable packages and safe answer-return contracts. Production gates: accessible PDF/audio, authenticated creator/download APIs, licensing, storage/hashes/scanning, durable uploads, and browser/PDF/AT verification.
Step 18 adds source-versioned semantic printable plan snapshots. Production gates: routed preview UI, browser/driver/AT matrix, verified tagged PDF, durable authorized artifacts and cached printing.
Step 19 adds source-grounded scripts, exact transcripts, voice policy and player state while reusing Step 7. Production gates: approved speech provider/assets/marks, download/offline service, bilingual validation and browser/AT testing.
Step 20 adds canonical public guides and safe in-memory practice contracts. Production gates: routed Help/search/context UI, reviewed media CMS/assets, authenticated training tenant/sandbox, durable expiring isolation and full AT/security verification.
Step 21 consolidates AI presentation actions and source-grounded variant contracts. Production gates: canonical server response/version model, validated adaptation orchestration, durable private preference scopes/cache and browser/AT testing.
# Step 22 — Protect Student Privacy

Client taxonomy, sensitivity classification, privacy centre, safe serializers, notice contracts, tutor preview, request drafts, and offline cleanup guard are implemented. Critical server privacy infrastructure and full manual accessibility evidence remain open as A11Y-048 and A11Y-049.

# Step 23 — Teacher and Tutor Controls

The Accessible Resource Studio client prototype adds controlled authoring contracts, batch advisory checks, unpublished drafts, functional preview allowlists and publication readiness. Trusted authoring/publishing infrastructure and manual browser evidence remain open as A11Y-050 and A11Y-051.

# Step 24 — Accessibility Quality Checks

Step 23 now has versioned check modes/results, a canonical rule registry, separate human-review tasks, privacy-safe evidence, reviewed exceptions and race-safe publication-gate contracts. Server enforcement and actual browser/human evidence remain open as A11Y-052 and A11Y-053.

# Step 25 — Accessibility MVP

The five-stage coordinator adds capability states, essential routes, conservative gates, a minimal private preference model, aggregate analytics allowlisting and unsubmitted barrier drafts. Production acceptance evidence and reviewed analytics/feedback services remain open as A11Y-054 and A11Y-055.

# Step 26 — Complete User Journeys

All 25 outcomes now have strict layered evidence/status/privacy/recovery contracts and a fail-closed release gate. Real browser/recovery execution and human AT/representative-user testing remain open as A11Y-056 and A11Y-057.

# Canonical AccessibilityPreferences

The functional-only, closed-schema model adds validation, defaults, precedence, owner/tutor/public serializers, optimistic concurrency, legacy/device migration and safe reset/deletion contracts. Production persistence/API and UI migration/manual evidence remain open as A11Y-058 and A11Y-059.
