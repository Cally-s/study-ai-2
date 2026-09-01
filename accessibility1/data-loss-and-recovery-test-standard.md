# Data-Loss and Recovery Test Standard

Recovery tests verify UI restoration plus browser storage, canonical server state, exact source version/hash, idempotency key, submission state and cross-user/account isolation. Draft, queued, submitted, accepted and unknown outcomes remain distinct. Refresh/reconnect/retry must not duplicate submissions.

Required artifacts include sanitized storage snapshots, request/server records and network traces. The static app has no canonical server/IndexedDB/service-worker test harness, so quiz, message, package and cross-device recovery cannot be declared end-to-end passed.
