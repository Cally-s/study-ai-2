# Prompt Iteration Security

Prompts, responses, assignments, source text, code, files, translations, comparisons, and tool output are untrusted data. They cannot mutate history, change privacy/policy/verification, expose system instructions or hidden reasoning, send automatically, or assign competency.

Production requires authenticated provider boundaries, server authorization, tenant/owner isolation, immutable tested/sent versions, parentage/version checks, optimistic concurrency, idempotency, rate limits, and redacted logs. Client-side prototype checks are contracts, not security controls.
