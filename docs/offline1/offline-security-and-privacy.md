# Offline Security and Privacy

Step 22 explicitly distinguishes removable app caches from operating-system Downloads, printouts, email, and other applications. Production must verify account isolation, token exclusion, sign-out cleanup, cache invalidation, and pending-outbox ownership.

Offline records are private by default and user/device keyed. Never cache tokens, credentials, hidden answers, scoring keys, teacher/admin/safety data or other users. Every cached private object needs authorization scope/version/expiry; offline cache cannot grant authorization. Account switch/sign-out must isolate or clear records according to shared-device policy.

The prototype exposes Remove offline StudySpark data and clears local drafts/outbox/download metadata irrecoverably while retaining preferences. localStorage is neither encrypted nor adequate production isolation. No connection history, provider/billing/location/device fingerprint, financial inference or detailed ordinary analytics is recorded.
