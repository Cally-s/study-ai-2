# AI Data Model Indexes

Recommended production constraints and indexes:

- unique active profile on `(organization_id, user_id)` where active;
- unique definition code/version and lesson code/version per organization;
- unique evidence idempotency key and exact artifact/definition references;
- unique lesson attempt `(organization_id, lesson_progress_id, attempt_number)`;
- unique policy version `(organization_id, policy_id, version_number)`;
- unique response sequence `(organization_id, session_id, response_sequence)`;
- unique receipt/prototype version by parent and version number;
- lookup indexes beginning with `organization_id` for every aggregate, owner, status, assignment, course, session, and updated timestamp;
- unique idempotency key scoped to organization, actor, and operation.

Foreign keys must not cross organizations. Partial indexes should exclude archived rows only where historical lookup remains available elsewhere.
