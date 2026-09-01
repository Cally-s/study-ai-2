# Accessibility and Language Bridge — Architecture and MVP Record

## Current codebase audit

StudySpark is a vanilla HTML, CSS and JavaScript single-page prototype. Feature modules attach to the shared page and use browser state/local storage plus static JSON fixtures. PDF.js and Mammoth are loaded from a CDN. There is no package manifest, component framework, backend, authentication provider, database/ORM, migration runner, service worker, server file store, production AI SDK, real-time Study Room service or browser E2E framework.

The current user/profile system is an in-browser demo account store. It is useful for UI contracts but is not trusted authentication. AI Coach behavior is client-side and rule/demo driven. Study Rooms use browser media capabilities and modeled state; they are not real multi-user sessions. Accessibility presentation uses shared CSS variables, semantic HTML patterns, native controls and the existing visual language rather than a separate simplified product.

Existing accessibility modules cover the requested MVP areas: `accessibility-baseline.js`, `keyboard-accessibility.js`, `accessibility-toolbar.js`, `visual-display.js`, `dyslexia-display.js`, `text-to-speech.js`, `plain-language.js`, `language-bridge.js`, `low-bandwidth.js`, `text-only-study-rooms.js` and `offline-study-packages.js`. The canonical functional-only preference contract is `accessibility-preferences-model.js`.

The issue registry currently contains 63 Critical, 68 High, 4 Medium and 0 Low findings. Critical findings primarily concern absent trusted server persistence/authorization, production providers, complete recovery infrastructure and unperformed human accessibility journeys. High findings primarily concern browser/assistive-technology verification, provider quality, UI integration and reviewed production services. Medium findings cover interruption announcements pending verification, contrast evidence, unsupported provider capabilities and toolbar zoom/collision evidence. The authoritative details and remediation state are in `accessibility-issues.json`.

No finding is closed merely because a source-level contract test passes. `FIXED_PENDING_VERIFICATION` remains distinct from `VERIFIED_FIXED`.

## Proposed architecture

Keep accessibility inside the main StudySpark shell. Use one canonical `AccessibilityPreferences` row per authenticated user, optional device overrides without identity, existing feature modules as consumers and a deterministic precedence resolver. A trusted server must own identity, versioned writes, grants, voice/transcript access, export/deletion and rollout gates.

The browser applies safe visual/device preferences early, then reconciles with the authenticated account record. Feature services request effective settings rather than reading unrelated storage keys. AI transformations return structured variants with the original response, academic invariants and language metadata. Media, microphone, downloads and generation remain explicit user actions.

Study Rooms negotiate participation mode without requiring camera or microphone. Offline work uses versioned manifests, integrity checks, local drafts, an outbox and idempotent server synchronization. All sensitive operations use short-lived authorization and auditable server policy; public serializers return no accessibility preferences.

## Accessibility preference data model

The executable canonical contract is documented in `accessibility-preferences-data-model.md`, `accessibility-preferences-api.md`, `accessibility-preferences-privacy.md` and `accessibility-preferences-migration.md`.

It stores only functional choices: languages, bilingual/explanation mode and level, text/spacing/width/font/contrast/motion/caption settings, TTS/STT preferences and rate, low-bandwidth/offline choices and Study Room participation. It rejects diagnoses, medical information, disability labels, accommodation documents/status, reasons, inferred needs and generic metadata. The production relation requires a unique user foreign key, version, timestamps and transactional optimistic concurrency.

Precedence is response override, task/lesson, conversation, account, device, operating system, then product default. Device data is user-namespaced where identity is available and removable at sign-out/account switch. A false text-only value never authorizes audio or video.

## Translation and Language Bridge architecture

Language Bridge supports English only, home language only, English then home language, home language then English, side-by-side bilingual and English with translated keywords. Structured responses keep source language, target language, mode, sections and an important-term registry separate.

The academic-content contract protects correct answers, formulas, scientific names, terminology, objectives and curriculum expectations. Important English academic terms remain visible with reviewed translations and definitions. Translation failure returns the preserved English source plus a clear status; it never invents a successful translation. RTL direction is applied per language block, not to the entire interface indiscriminately.

Production providers must be allowlisted, versioned and quality-reviewed by subject/language. Sensitive assessment translation follows the stricter assessment standard. User corrections and saved glossary terms remain private unless explicitly shared.

## Text-to-speech and speech-to-text approach

TTS is progressive enhancement over always-visible text. The player exposes play, pause, stop, forward/back, rate and language, with sentence highlighting and word highlighting only when supported. Math/science speech uses the documented expression contract. No preference starts playback automatically.

STT is draft-first. States are microphone off, listening, processing, transcript ready and unavailable. Permission is requested only after an explicit action. The transcript is editable and must be explicitly submitted; normal text input is always present. Production audio/transcripts require consent, purpose/recipient/retention notice, protected storage, deletion and provider minimization.

Browser speech APIs may provide optional local capability, but they are not treated as uniform or production-equivalent providers. Unsupported states must fail to the text alternative.

## Offline and low-bandwidth strategy

Low-bandwidth mode loads text first, prevents autoplay, defers decorative media, uses responsive/compressed images, offers static/transcript/audio alternatives, displays file sizes and asks before large transfers. Connection state is presented in text and announced without color-only meaning.

Drafts and quiz answers are written locally before network submission. A versioned outbox retries idempotently after reconnection and exposes pending, conflict, failed and synchronized states. Offline study packages use a manifest, content version, size/type disclosure, integrity verification, expiry/revocation policy and answer-key authorization. Production caching requires a service worker or native equivalent, storage-quota handling, account-scoped encryption where appropriate and reliable cleanup on shared devices.

## Page and component list

- Shared shell: skip link, main landmark, route titles, connection status, accessible dialog/focus lifecycle and persistent accessibility toolbar.
- Accessibility & Language settings: canonical account/device settings, reset, conflict resolution, privacy and sharing controls.
- AI Coach: accessible response region, quick explanation actions, bilingual layouts, vocabulary cards, listen controls and editable dictation.
- Lessons/quizzes/plans: semantic instructions, reading presentation, listen controls, draft recovery, print and offline-package actions.
- Study Rooms: participation-mode selector, text chat, shared notes, structured whiteboard alternative, queue, polls, hand raising, captions/transcript and announcements.
- Offline centre: package manifest, size/type, progress, integrity, expiry, storage, pending work and synchronization/conflict states.
- Privacy centre: consent notices, grants, retention, recording/transcript deletion and export requests.
- Creator studio: descriptions, captions/transcripts, plain language, translations, academic terms, previews, warnings and publication gate.
- Digital skills/practice: plain text, captioned video, audio, print and safe synthetic practice tasks.

## API or server-action list

- `GET/PUT/PATCH/DELETE /me/accessibility-preferences` with version preconditions; account export/deletion integration.
- `POST/DELETE /me/accessibility-preference-grants` for narrowly scoped tutor/teacher access with expiry and revocation.
- `POST /ai/explanations` for structured original/plain/stepwise/bilingual variants with academic invariants.
- `POST /speech/synthesis` and `POST /speech/transcription`; explicit consent, provider policy, retention and deletion IDs.
- `GET/PATCH/DELETE /sessions/:id/transcript` with participant authorization and correction provenance.
- `GET /offline-packages/:id/manifest`, authorized download URLs and integrity metadata.
- `POST /sync/submissions` and `POST /sync/drafts` with idempotency keys, base versions and conflict responses.
- `POST /privacy/export`, `POST /privacy/deletion` and scoped recording/transcript deletion actions.
- Creator review, warning, exception and publication actions enforced on the server against an exact content version.

These routes are contracts for the production backend; they do not exist in this static prototype.

## Privacy and permission matrix

| Data/action | Owner | Tutor/teacher | Authorized adult | Public | Required control |
|---|---|---|---|---|---|
| Functional preferences | Read/write | Explicit field grant only | Policy/scoped grant only | Never | Owner auth, versioning, expiry/revocation |
| Diagnosis/medical data | Not collected by this feature | Never | Never | Never | Reject from schema and logs |
| Microphone | Explicit session action | Cannot activate | Cannot activate | Never | Runtime permission and visible state |
| Voice recording | Consent/create/delete | Session-purpose access only | Policy-limited | Never | Notice, retention, encryption, audit |
| Transcript | Read/correct/delete as permitted | Session-purpose access only | Policy-limited | Never | Consent, provenance, retention, deletion |
| Offline package/work | Account/device scope | Assignment scope only | Policy-limited | Never by default | Manifest auth, device cleanup, sync conflicts |
| Public profile/search | No accessibility fields | No accessibility fields | No accessibility fields | Empty serializer | Cache/search/social exclusion |

## Implementation sequence

1. Preserve the existing Stage 1 keyboard/focus/semantic baseline and complete manual verification.
2. Migrate toolbar and full settings consumers to the canonical server-backed preference API.
3. Connect TTS and STT to reviewed providers while retaining text and draft-first fallbacks.
4. Enforce structured plain-language and bilingual AI contracts server-side with academic invariants.
5. Add production low-bandwidth delivery, service-worker caching, durable draft/outbox synchronization and conflict recovery.
6. Connect text-only Study Rooms, captions/transcripts and participation negotiation to authenticated real-time infrastructure.
7. Implement authorized offline-package generation/download/synchronization and shared-device cleanup.
8. Add privacy/export/deletion services, creator publication gates, monitored rollout and incident procedures.

Each stage ships behind a capability flag only after its predecessor’s evidence gate. Flags do not replace authorization.

## Testing plan

Run unit/contract tests for enums, validation, academic invariants, serializers, authorization decisions, conflicts, retries, integrity and prohibited automatic actions. Add browser tests for keyboard-only journeys, focus, dialogs, validation, zoom/reflow, contrast, forced colors, reduced motion, responsive layouts, RTL and offline/reconnection behavior.

Execute manual AT coverage with supported combinations of NVDA, JAWS, VoiceOver, TalkBack, Narrator, magnification, voice input and switch access. Validate TTS/STT/captions/transcripts with actual providers and math/science content. Test stable, slow, unstable, offline, reconnecting, storage-full and provider-unavailable conditions without data loss.

Conduct voluntary, compensated representative-user testing by functional access need, language, device experience and connection context under the approved consent/privacy protocol. Keep automated, automated-scan, manual-AT and representative-user evidence separate. Release remains blocked by unresolved Blocker/Critical findings, incomplete required layers, privacy/security failure or unverified recovery.

## Current MVP status

The requested eight MVP capabilities are present as client-side modules and deterministic contracts in the main StudySpark experience. They are not a production backend implementation. Current automated coverage is recorded in the implementation report and feature-specific test-result documents. Real browser, assistive-technology, participant, server, database, provider, security, performance and deployment evidence remains explicitly NOT_RUN where unavailable.
