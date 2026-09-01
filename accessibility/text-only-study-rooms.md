# Text-Only Study Rooms

Step 22 preserves Text Only as a no-retaliation alternative when optional recording is declined where policy supports it. Recording indicators and notices remain visible if the overall session is recorded.

## Status

Step 16 supplies a client-side capability contract and structured collaboration model for five participation modes. This repository has no WebRTC provider, realtime server, authenticated policy service, collaborative merge engine, file scanner, or durable server sync. Those capabilities are explicitly reported as `NOT_AVAILABLE`; client flags are never described as authorization.

## Modes

The controlled `StudyRoomParticipationMode` enum is `VIDEO_AND_AUDIO`, `AUDIO_ONLY`, `TEXT_ONLY`, `CAPTIONS_ONLY`, and `LISTEN_ONLY`. All modes retain the same 17 text tools. Mode controls only receipt/publication of media. Camera and microphone default off and require separate explicit controls. Text Only and Captions Only initialize no media; Listen Only is receive-only; Audio Only differs because it may publish microphone audio after explicit activation.

## State preservation

Mode transitions preserve membership, attendance identity, session start time, chat history and drafts, shared-note position, structured-whiteboard context, questions, poll responses, raised hand, files, personal notes, accessibility/language settings, low-bandwidth preference, and transcript access. Transition failure preserves the previous working state or provides a Text Only fallback.

## Text collaboration

The domain layer provides private draft and explicit-send models, server-policy-gated private chat, version-aware shared-note conflicts, 24 semantic whiteboard block types with button-based ordering, and transcript allowlisting. Private messages, drafts, personal notes, and safety notes are excluded from the participant group transcript. A transcript never implies recording.

## Privacy and neutrality

Participation mode is not public and is excluded from attendance, academic privileges, participation credit, service hours, Help Credits, matching, grading, ratings, safety scoring, fraud scoring, and inferred personal traits. There are no repeat prompts, guilt wording, media badges, or mode-based engagement scores.

## Manual verification

Keyboard, screen-reader, 200% zoom, high contrast, real permission prompts, track indicators, throttled reconnection, realtime ordering, authorization, retention, and multi-user collaboration remain `PENDING` because no browser E2E/server/media environment is present.
Step 17 package activity is independent of Study Room mode and cannot alter attendance, membership, service hours or Help Credits.
Step 19 finalized Study Room summaries are eligible only after authorization/privacy filtering; raw chat, private channels and unreviewed transcripts are excluded.
Step 20 Study Room practice uses synthetic pre-join state and can never join a real room or send a real message.
