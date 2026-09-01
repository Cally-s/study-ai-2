# Complete User Journey Test Matrix

All 25 journeys are registered as `UJ-01` through `UJ-25`. The current environment is Node contract testing on the local development machine; it is not a browser, device, AT, weak-network or participant test.

| Journey group | Role | Functional need/input | Planned environments | Languages/levels | Automated | Manual AT | User testing | Issues |
|---|---|---|---|---|---|---|---|---|
| UJ-01–03 registration/display | Synthetic student | Keyboard, zoom, contrast | Browser/OS/device matrix | English/all levels | Contract coverage only | NOT_RUN | NOT_RUN | A11Y-056 |
| UJ-04–07 lesson/TTS/STT | Synthetic student | Screen reader, keyboard, voice | Browser + NVDA/JAWS/VoiceOver/voice input | English | Contract coverage only | NOT_RUN | NOT_RUN | A11Y-056 |
| UJ-08–09 Study Rooms | Synthetic student | Captions Only/Text Only | Browser/device/network matrix | English | Contract coverage only | NOT_RUN | NOT_RUN | A11Y-056 |
| UJ-10–12 language/levels | Synthetic student | Bilingual, reading levels | Browser/zoom matrix | English/Mandarin | Contract coverage only | NOT_RUN | NOT_RUN | A11Y-056 |
| UJ-13–18 offline/print/audio | Synthetic student | Weak/offline, keyboard | Network/device/download/print matrix | English | Contract coverage only | NOT_RUN | NOT_RUN | A11Y-056 |
| UJ-19–20 authoring/privacy | Synthetic teacher/student | Keyboard | Browser/server/provider matrix | English | Contract coverage only | NOT_RUN | NOT_RUN | A11Y-056 |
| UJ-21–25 cross-feature | Synthetic student | Keyboard, AT, newcomer | Full environment matrix | English/Mandarin/French/Arabic | Contract coverage only | NOT_RUN | NOT_RUN | A11Y-056/A11Y-057 |
