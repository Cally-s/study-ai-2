# Microphone Permission Standard

Permission follows a contextual Start Dictation action and a separate Continue confirmation containing the purpose and no-auto-submit notice. Page load, registration, toolbar opening, preference changes, and focus never request permission. Only audio is requested; camera, screen, system audio, background workers, hidden frames, and persistent device IDs are absent.

Tracks stop on Stop, Cancel, errors, timeout, offline loss, field removal, page hide, page exit, and unload. Recording never automatically restarts. A privacy-safe BroadcastChannel signal coordinates active/inactive state without audio or transcripts. StudySpark TTS stops before capture and never automatically resumes. The static artifact cannot set production HTTP Permissions-Policy; deployment must set `Permissions-Policy: microphone=(self)` and deny untrusted frames.

Viewing Step 9 captions never calls microphone APIs. Future caption providers may process only authorized speaker tracks under session policy; caption viewers receive text independently of local audio output and never grant microphone permission merely to read captions.
