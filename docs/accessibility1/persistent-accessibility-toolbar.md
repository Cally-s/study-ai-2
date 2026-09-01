# Persistent Accessibility Toolbar

## Architecture and placement

Exactly one launcher is mounted dynamically at the document root, so it is present on the public landing/authentication experience and every state-driven signed-in view, including Study Rooms. It uses a fixed top-right safe-area position on desktop and a reserved bottom-right mobile position above the existing bottom utility area. Generated PDFs and downloads do not contain it.

The launcher is a labelled native button. The responsive side panel uses a named dialog, native fieldsets/selects/checkboxes, visible focus, status announcements, Escape/Close/outside dismissal, focus entry, and focus return. It does not rewrite semantics and is not an accessibility overlay.

## Controlled preferences

The toolbar reuses `AccessibilityLanguageProfile` and adds only `contentWidth`: System, Narrow, Comfortable, Wide, or Full. It controls text scale, line/letter spacing, content width, contrast, motion, reading-friendly display, reading presentation, TTS preference, explanation language, and bandwidth. Home language, captions, STT, playback speed, and Study Room communication remain in full settings.

Visual preferences apply immediately. Reading/language settings affect new AI explanation context; existing responses are not rewritten. Low bandwidth disables future media autoplay/preload and lazy-loads images. TTS remains a stored-only, unavailable capability and never autoplays. No microphone/camera API is called.

## Persistence and precedence

Device preferences use the allowlisted versioned key `studyspark.accessibilityToolbar.v1`; they contain no identity or authentication data. A compact allowlisted non-secret cookie stores early visual hints. An external head boot script validates and applies device values before the body renders. Memory is the fallback when storage fails.

Signed-in changes apply locally, persist to device, and patch only changed account fields with the current profile version. Signed-out changes remain device-only and never create a profile. Offline changes stay active, mark account sync pending, and retry on `online`. Version conflicts surface instead of overwriting. BroadcastChannel synchronizes tabs with the storage event as fallback and never sends authentication data or starts TTS.

When an account profile exists it is copied to the device on toolbar initialization. The current static prototype cannot observe a real authentication transition or provide a production conflict-resolution UI; these remain documented limitations.

## Reset, shared devices, and privacy

Reset to Default requires confirmation and resets only toolbar-controlled fields; it preserves home language and all unrelated account/learning data. Remove accessibility settings from this device clears local storage/cookie and does not delete the account profile.

Preferences are prohibited from public APIs, tutor cards, matching, advertising, safety/fraud/integrity scoring, grade prediction, restrictions, service approval, and Help Credit decisions. Audit metadata remains section/version based. No diagnosis, disability, immigration, or financial inference is collected.

## Known limitations

There is no backend, database migration, real asynchronous account API, user-scoped server cache, server-readable early cookie, service worker, real offline queue, real AI/translation/TTS provider, real Study Room provider, browser E2E, or completed assistive-technology manual test. Persistence and conflict rules are prototype models, not production security boundaries.

## Keyboard integration

The toolbar keeps its existing disclosure, Escape, focus-return, and native-control behavior. The Step 4 keyboard layer does not intercept toolbar arrow keys or global Tab behavior. Toolbar collision, 200% zoom, mobile on-screen keyboard, and Study Room full-screen placement remain manually pending.

## Step 5 visual controls

The existing toolbar now receives controls from the shared visual-display module for text size, line height, letter spacing, reading width, logical alignment, paragraph spacing, semantic contrast theme, motion mode, simplified layout, and on-demand reading view. The module reuses the same device key, cookie family, account profile, optimistic version, and live status architecture. It adds no second save queue or profile. Manual collision, high-zoom, contrast, forced-colours, and Study Room verification remain pending.

## Step 6 quick controls

The toolbar receives the same independent reading-comfort fieldset as full settings: suggested preset/undo, word spacing, font, reduced italics/decorative fonts/clutter, highlight, ruler, style, size, tracking and section reset. The legacy one-switch reading-friendly control is hidden after safe migration. Controls reuse the existing device key and account profile; exact ruler movement is session-only.

Step 7 reuses that device key for TTS rate, language, and highlight mode. Browser voice URI stays device-local and is never copied into the account profile. Saving a preference never starts audio; playback requires a contextual Listen action followed by Play.

Step 8 reuses the existing Speech-to-text Off/Available on Demand/Preferred preference. It never requests microphone access, starts recognition, or hides typing. Runtime-supported contextual field controls perform the separate permission workflow.

Step 9 keeps the existing caption preference non-activating. Caption display controls apply only inside an authorized caption viewer; changing size/background/position cannot start audio, video, recording, microphone capture or an unavailable caption provider.

Step 10 leaves toolbar reading-presentation behavior intact. Contextual generation does not change toolbar/account state. An explicit default save uses the same profile/device synchronization architecture and preserves unrelated fields.
# Step 11 integration

Explanation level is available contextually on eligible content and may be explicitly saved as the existing reading-presentation default. The toolbar/profile is not required for temporary use. The fixed comparison panel respects safe areas and responsive layout; collision and zoom checks remain PENDING.
# Step 12 integration

Language Bridge is a contextual explanation control; English remains immediately available without toolbar/profile setup. Confirmed device defaults use the existing accessibility snapshot. Account synchronization of the new canonical fields remains unavailable in this static prototype.
# Step 13 vocabulary lookup

Vocabulary lookup is a stable contextual action, not a forced toolbar/profile option. Source selection is read only after activation. Card/glossary use does not alter toolbar defaults. Placement, collisions and mobile/zoom behavior remain manually PENDING.
# Step 14 response controls

Multilingual controls are response-context actions and work without profile/toolbar setup. Confirmed defaults use the device snapshot; ordinary use never saves. Placement/collision/zoom manual verification remains PENDING.
# Step 15 low-bandwidth integration

The existing Low-bandwidth selector remains manual/account capable. Step 15 device preferences and connection/sync details are separate. Remove offline data clears work/queues/download metadata, while toolbar removal clears settings; production should explain both scopes together.

The toolbar remains available in every Step 16 mode. Mode changes preserve accessibility, language and low-bandwidth settings.
Step 20 accessibility guide explains the existing toolbar without modifying it. A future contextual Help entry should preserve the current page/focus/drafts.
Step 21 response actions are content-local and separate from the persistent toolbar. Saving defaults is not implicit when a quick action is selected.
