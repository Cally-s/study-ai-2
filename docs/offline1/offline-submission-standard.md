# Offline Submission Standard

Only explicit Submit, Send, Post or Search may create an outbox record. Unsent drafts never become final operations on reconnection. Records require owner, action, source/version, authorization scope, idempotency key, bounded retry count and optional trusted server deadline. They are visible and cancellable.

Before SENT, the server must reauthenticate, authorize, check deadline/policy and source compatibility, then reconcile idempotently. Outcomes include conflict, expired, authentication required, failed and unknown result; unknown is reconciled, not blindly duplicated. Tokens are excluded. The static prototype models checks/outcomes but performs no automatic network retry or mutation.
# Step 16 live-session messages

Only a message whose author selected Send may enter the outbox. Reconciliation must revalidate identity, membership, policy, session activity and source version with an idempotency key. Ended sessions block delayed delivery unless server policy permits post-session messaging.
Step 17 uses explicit SUBMIT only after answer review. Reconciliation must validate destination, relationship, deadline and package/question versions; unknown results never duplicate.
