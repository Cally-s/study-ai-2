# Accessibility Audit Report — Step 1

> Current consolidated architecture and MVP record: `accessibility-language-bridge-architecture.md`. The original Step 1 snapshot below is retained for chronology. The live issue registry now contains 63 Critical, 68 High, 4 Medium and 0 Low findings; use `accessibility-issues.json` for current status rather than the six-finding count captured at Step 1.

## Scope and architecture

The platform is a large vanilla HTML/CSS/JavaScript single-page prototype using local browser storage and JSON files. There is no backend, authentication provider, database/ORM, component library, icon library, i18n system, AI SDK, service worker, analytics, performance monitoring, error monitoring, package manager, CI, browser-test framework, or accessibility scanner. PDF.js and Mammoth load from a CDN. Study Rooms use local browser media APIs and explicitly do not provide real multi-user calls.

WCAG 2.2 Level AA is the engineering baseline. Static source inspection covered all view IDs and shared patterns. Deterministic regression tests were executed. Manual screen-reader, keyboard-only end-to-end, zoom/reflow, contrast measurement, throttled-network, real device, and real browser assistive-technology matrices remain unexecuted and are not claimed.

## Findings

Six evidence-backed issues were registered: 1 Critical, 3 High, 2 Medium, 0 Low. The Critical shared-dialog focus blocker received a shared remediation and automated regression coverage, but remains `FIXED_PENDING_VERIFICATION` until manual keyboard and screen-reader verification is completed. The skip link and connection announcements were also added. No issue is marked `VERIFIED_FIXED`.

Positive evidence includes native form controls and labels in major forms, a native keyboard Browse action, text status labels, polite toast regions, manual attendance-code alternative to QR, optional Study Room camera/microphone, Study Room text chat, reduced-motion handling added globally, local persistence across many learning features, and no required autoplaying audio.

Remaining risks include incomplete tab semantics, no i18n catalogue/selector, unmeasured contrast, incomplete feature-specific recovery verification, embedded PDF accessibility, dynamically rendered control names, AI completion announcements, complex math/chart semantics, and lack of real-time Study Room infrastructure.

## Critical remediation

`accessibility-baseline.js` now applies a shared modal lifecycle: store invoking focus, make background siblings inert, move focus into the dialog, wrap Tab/Shift+Tab, close dismissible dialogs with Escape through their existing controls, remove inert state, and return focus. It also provides route accessible names/titles and online/offline announcements. The page now provides a visible-on-focus skip link and focusable main target.

Automated evidence: `tests/accessibility-baseline.test.js`. Manual verification is still required; therefore the audit does not claim the Critical barrier is fully verified fixed.

## Test truthfulness

Automated source/contract tests are not an accessibility certification. No screen reader was tested. No browser/device compatibility claim is made. No complete language is supported beyond the declared English document. Academic adaptation was not newly implemented, and no claim is made that simplified AI output was equivalence-tested.
