# Accessibility and Language Profile

The canonical Step 27 `AccessibilityPreferences` contract consolidates account-default functional fields. Optional profile narratives and diagnoses must not be copied into it; response/conversation overrides remain narrower scopes.

Step 22 classifies functional accessibility and language preferences as sensitive, excludes them from public serializers, and shares only selected functional fields after a narrow authorization. Diagnosis fields do not belong in this profile.

The profile is private, optional, and created lazily on first save. Skipping creates no record, warning, completion percentage, or access restriction. Every field is optional; partial profiles are valid. Deleting it preserves the account, learning data, sessions, credits, and service records.

Available preferences cover interface and explanation language, optional home languages, bilingual mode, academic terminology preservation, reading presentation, relative text scale, spacing, display/contrast/motion, reading-friendly display, TTS/STT preference, captions, playback rate, bandwidth, and Study Room communication.

Precedence is temporary override → current profile → browser/OS signals → accessible defaults. Temporary overrides are not saved unless explicitly saved as default. Updates use a unique user record and optimistic version checks.

Privacy rules prohibit public serialization, advertising, matching/ranking, safety/fraud/integrity scoring, grades, service decisions, Help Credits, suspension, or ability/disability inference. Audit metadata records only actor, user, section, version, action, and time—not preference values or home language.

AI receives only explanation language/mode, academic terminology language/preservation, reading presentation, and explicit temporary override. Academic-equivalence validation compares subject, course level, objective, terminology, reasoning, and success criteria. Visual, bandwidth, diagnosis, safety, guardian, and home-language data are excluded unless a language is explicitly selected for explanation.

Capability limits are explicit: only the English interface is implemented; bilingual output and reading presentation are deterministic preview/context support; TTS is operational on demand through device browser voices while STT remains stored-only; captions and text-only Study Rooms are partial/provider-dependent. TTS highlight/language and playback rate are portable preferences; an exact browser voice URI is device-only. Preferences never autoplay speech or request microphone/camera permission. Low-bandwidth mode applies a client hint and lazy-loads images, but is not offline support.

Step 8 makes the existing `speechToTextPreference` operational only when guarded browser recognition exists. Recognition language and interim-display choices use the same private device snapshot. Preference changes never request permission or start a session. Permission, microphone device ID, raw audio, transcript/dictation history, confidence, and voice characteristics are never profile fields.

Step 9 reuses existing caption preference, caption language and audio speed concepts. Caption size/background/position are functional display choices, not disability or diagnosis data. They never start media/recording or imply a language/provider exists. Transcript queries, notes, reports, recording access and caption history are not profile preferences.

Step 10 reuses `readingPresentationMode`. A single Explain more simply request is temporary and private; it does not update the profile. Only the explicit “Save this as my default” action persists the mapped existing mode. No diagnosis, ability label or detailed use history is stored.
# Step 11 explanation-level preference

`explanationLevel` is an optional presentation preference mapped to the existing reading-presentation mode; it is not an ability field. Temporary selection does not update the profile. “Save this explanation level as my default” requires confirmation. Detailed level-use history is not part of the profile.
# Step 12 Language Bridge preference

The device snapshot can store optional `languageBridgeEnabled`, `defaultLanguageBridgeMode`, `bridgeLanguageCode`, English academic terminology, term display mode and preservation flag only after explicit confirmation. Temporary bridge choices remain unsaved. Interface, caption, recognition and TTS languages stay separate. The current simulated account-profile model has related language fields but has not been migrated to the full Step 12 field set.
# Step 13 vocabulary separation

Vocabulary lookup language follows an explicit card/source bridge language and remains distinct from interface, caption, recognition and TTS voice languages. Glossary contents, terms, notes and activity results are not accessibility-profile fields and do not create completion requirements.
# Step 14 response language

`selectedResponseLanguageCode` and multilingual response mode are distinct from interface, source, bridge, terminology, caption, recognition and TTS voice languages. Response choices remain temporary unless the student confirms device-default save. Full canonical account synchronization is unavailable.
# Step 15 low-bandwidth preference

Existing account `lowBandwidthPreference` remains Auto/Enabled/Disabled. Device override and media/cache choices are separate device-only data. Automatic network observations are hints and never saved as permanent profile values or socioeconomic inferences.

`defaultStudyRoomParticipationMode` is optional and changes only after explicit save. It is private and never used to infer language proficiency, disability, motivation, attendance, credit or ability.
Offline package language/quality choices are request-specific private settings, not public traits. Bilingual packages preserve English academic terms and never infer proficiency or why offline access is wanted.
Printable-plan paper/layout/language choices are request-specific and private. They never infer disability, printer access, finances, proficiency or ability.
Audio-summary length/language/voice choices are temporary unless explicitly saved in a future authorized preference flow. They remain private and never infer ability, disability, identity or proficiency.
Guide use and practice behavior never update accessibility/language defaults or infer digital skill. Practice settings remain preview-only until a separate confirmed production save.
Step 21 works without a profile. Account defaults require explicit confirmation; response/conversation/lesson overrides never disclose or speculate about disability/language status.
