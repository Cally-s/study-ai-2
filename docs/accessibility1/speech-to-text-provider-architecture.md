# Speech-to-Text Provider Architecture

`BrowserSpeechToTextProvider` is guarded by runtime capability detection and exposes language, permission, interim/final, network, duration, retention, fallback, and verification metadata. It requests one constrained audio track only after confirmed user intent, passes no audio to StudySpark storage/AI/Study Room, and stops tracks on every normal and error exit.

No approved server provider, credentials, audio upload, WebSocket, database, or retention service exists. Server and offline capabilities are therefore NOT_AVAILABLE. Device-native operating-system dictation remains compatible because the normal fields are unmodified. Browser/vendor privacy and network behavior remain a disclosed limitation.
