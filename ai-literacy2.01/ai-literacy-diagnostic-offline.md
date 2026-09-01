# Diagnostic Offline Behaviour

The offline contract caches the versioned definition and student-safe items, stores owner-bound local responses, labels them unsynchronized, and shares nothing. Synchronization revalidates owner, tenant, definition, item versions, and idempotency before marking data synchronized.

Changed versions require student review; local responses are preserved. Cross-account access, duplicate responses/completion, stale automatic recommendations, and offline sharing are rejected. The static prototype exposes this deterministic contract but has no service worker or real reconnecting server.
