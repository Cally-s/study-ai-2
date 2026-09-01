# MVP Offline Architecture

Stage 4 reuses Step 15 connection/sync status, local drafts, explicit outbox and idempotency; Step 16 Text-Only rooms; Step 17 packages; Step 18 print; and Step 19 audio summaries. No autoplay, automatic download, print, submission or message occurs. Unsynced drafts block broad shared-device cleanup.

The static prototype lacks a service worker, secure user-scoped IndexedDB, server idempotency, cross-device sync, private object storage and verified recovery. Offline actions remain explicit and honest about unsubmitted state.
