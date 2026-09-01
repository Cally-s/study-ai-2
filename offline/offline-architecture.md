# Offline Architecture

Step 22 adds an app-managed cleanup contract and idempotent, unsubmitted privacy-request drafts. Broad cleanup stops when unsynced work exists unless it is exported or explicitly confirmed; account/server namespaces remain future work.

Current architecture has no service worker/PWA, Cache Storage or IndexedDB. Application HTML/CSS/JS must already be open; permanent offline availability is not claimed. The Step 15 prototype uses user/device-keyed localStorage for preferences, drafts, outbox and download metadata only.

Production requires one versioned service worker, application-shell cache, user-scoped Cache Storage/IndexedDB namespaces, authenticated lesson manifests, content hashes/expiry/authorization, storage quotas, cache migrations and sign-out/account-switch cleanup. Cache text/objectives/instructions/essential small media/transcripts, never hidden answers, scoring keys, teacher/admin/safety content, tokens or another user’s data. Offline status must say Ready, Partial or Requires Connection based on manifest completeness.
Step 17 reuses Step 15 download/outbox interfaces. Artifact/manifest models are memory-only; service worker, IndexedDB, object storage and durable authorization remain unavailable.
