# Privacy Check Before Sending

> Step 68 release mapping: Privacy Check is a Stage 1 baseline and remains mandatory across all six stages regardless of feature flags or release channel. A later-stage rollout cannot weaken provider gating or expose findings in analytics.

> Step 67 integration: rule evaluation stores codes and version references only. Teacher-question drafts remain private/editable and must pass the existing Privacy Check plus explicit confirmation before any separate sending workflow; Core Decision Rules never send them.

> Step 66 integration: Privacy Check is fixed at Stage 4 and gates every AI, retrieval, image, code, source-search, and tool provider. Only the final student-confirmed sanitized message reference passes forward; findings and removed text never enter provider context or decision records.

Step 61 adds a local-first preflight to every AI-bound message. The warning begins “This message may contain personal information:” and offers exactly **Remove Identifying Information**, **Edit My Message**, **Send Only When Permitted**, and **Cancel**. Findings are possibilities, not accusations. Students review each item, can mark reviewable findings **Not Personal Information**, see original and revised messages, undo changes, and confirm before anything is sent.

The destination and purpose are shown. High-risk secrets must be removed from general AI destinations. Medical, accessibility, school-record, and immediate-safety content can move only through the applicable protected workflow. Cancellation preserves the private draft and confirms “Nothing was sent.” No inactivity, default action, or policy outage sends or queues a message.

StudySpark should help students recognize and reduce unnecessary disclosure before a message is sent, while preserving student control and avoiding false-positive blocking.

Student description: “StudySpark checks for possible personal information before your message is sent. You remain in control of what is removed, edited, kept, or cancelled.”

Teacher notice: “Student privacy-check events are private by default. Teachers do not receive the student’s original message, detected values, or privacy decisions unless the student intentionally sends an authorized message through a relevant school workflow.”
# Step 62 safeguards

Step 61 remains mandatory. A trusted safeguard snapshot can select a shorter concrete explanation and stronger redaction suggestions, but cannot expose findings to guardians/teachers or weaken high-risk-secret rules. The request envelope references the safeguard snapshot and never includes raw birthdate. Accessibility, language, and reading preferences are not age signals.
# Step 63 accessible preflight

Privacy Check supports keyboard, screen readers, visible focus, TTS, reviewed STT, bilingual/plain-language approved notices, high contrast, Reduced Motion, Low-Bandwidth, and print where appropriate. Translations preserve exact actions, uncertainty, destination, secret-removal, protected-workflow, and consent meaning. Accessibility preferences and findings remain private and separate.
# Step 64 offline drafts

Deterministic Step 61 scans may run locally on offline drafts. High-risk secrets are excluded from storage/synchronization. Destination and current policy permission require reconnection; no prompt or message is queued for background send. Protected safety requests use only authorized channels and are not replaced by academic worksheets.
