# Recovery Privacy Security

The production architecture requires transport/at-rest encryption, managed rotating keys, private object storage, secret management, tenant/account/resource isolation, server-derived actor identity, role-plus-purpose-and-relationship checks, short-lived recipient-bound links, backup protection, deletion tombstones, restore-aware deletion, audit integrity, idempotency, concurrency, and rate limits.

URLs, public caches, client build output, logs, and analytics contain no private content or tokens. Deep links are opaque, authenticated where possible, unindexed, scope/expiry/revocation checked, and not consequential one-click actions. Incident response contains access, revokes links, preserves required evidence, routes authorized review/notice, remediates, and prevents recurrence.
