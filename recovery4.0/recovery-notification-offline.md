# Notification Offline Behaviour

Offline mode may show a cached notification centre and locally created reminders only. Authoritative notifications require reconnect source/version/expiry/quiet-hour/cap/privacy revalidation. Stale items are cancelled; dedupe prevents repeated delivery/import; suppressed items are bundled or discarded to prevent floods. Provider delivery, token registration, email digest, and authoritative timezone scheduling are unavailable offline.
