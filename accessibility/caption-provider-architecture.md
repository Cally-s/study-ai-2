# Caption Provider Architecture

The shared provider contract covers capability discovery, live session start, audio-track registration, interim/final segments, stopping, recorded-media captions, translation, transcript finalization, and disposal. Only `SOURCE_TEXT_SYNCHRONIZATION` is configured locally. It accepts authorized scripted media metadata and timed source text; audio-track, mixed-audio, recorded transcription, translation, human feed, and webhook paths fail closed.

Future providers require authenticated source/participant metadata, idempotent signed webhooks, policy/consent validation, bounded ephemeral audio, stable provider segment IDs, ordered timing, retry-safe finalization, and cleanup after completion/error. Speaker labels may use authenticated track metadata, provider participant metadata, author labels, or neutral labels—never voiceprints.
