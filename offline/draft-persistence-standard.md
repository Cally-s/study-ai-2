# Draft Persistence Standard

Supported prototype types: quiz answer, study note, AI Coach, reflection, discussion, tutoring request, Study Room message and general form draft. Eligible visible text/search/email/number fields save on input with source/field/version, selection and owner key. Draft save means **Saved on this device**, never Submitted.

Production IndexedDB rows require local/server versions, update time, retention/expiry, authorization scope and conflict handling. Exclude passwords, files, tokens, hidden answers, safety/admin fields and other users. Storage failure must preserve the live field and show an error. Removal/sign-out/shared-device workflows must be explicit. Final action is a separate outbox record only after activation.
# Step 16 Study Room drafts

Unsent messages, personal notes and unsynced shared-note edits remain distinct device-local drafts. Mode transitions preserve them and never select a final action. Local edits are not described as shared before server confirmation.
Step 17 answer drafts retain package/source/question versions and submitted=false. Conflicts preserve old work; production must reuse Step 15 user-scoped storage.
