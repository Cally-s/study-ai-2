# User-Journey Retention Tests

UJ-044 verifies deletion of a private unsubmitted receipt without deleting submitted evidence. UJ-045 verifies expiry selection deletes session data while preserving required evidence and version references. The repository has no durable database or retention worker, so transaction, migration, legal-hold, backup, and production deletion proof remain unavailable.
