# AI Coach Decision Security

The provider gateway checks the server-owned decision run and refuses every AI, retrieval, image, code, source-search, and tool call before successful privacy preflight. The tool allowlist comes from the immutable generation contract. Student, retrieved, model, and tool text is untrusted and cannot reorder steps, modify policy/context/assistance, or disable final-answer locks.

Every operation requires actor, tenant, session ownership, course/assignment access, exact policy/safeguard/profile/privacy/attempt/source/schema versions, optimistic concurrency, and scoped idempotency. Completed runs and step records are immutable. Errors disclose no unrelated record existence. Violations and audit records are content-free; no automatic discipline or alert is created.
