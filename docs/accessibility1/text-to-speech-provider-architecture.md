# Text-to-Speech Provider Architecture

`TextToSpeech` creates a versioned `SpeechDocument` from allowlisted semantic blocks, segments it by sentence, then delegates playback to `BrowserSpeechProvider`. Provider capabilities are returned per feature with support level, language/source scope, boundary granularity, download/network flags, limitations, fallback, and automated/manual status.

The provider interface covers voice listing, preparation, playback lifecycle, seeking, and downloadable synthesis. The browser implementation does not generate files, preload audio, record a microphone, or clone voices. The document records source type/id/version, block language, display anchors, semantic math source, exclusion state, order, and a content hash.
