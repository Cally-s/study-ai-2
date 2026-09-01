# Recovery Teacher Question Queue

Unknown test time/scope/material permission may create a reviewed question draft. The rescue never sends it or assumes a response.

Missing instructions, unclear requirements and uncertain policy create reviewed clarification actions linked to this queue. Generation never sends a message or assumes a response.

## Purpose and reasons

The private queue stores draft clarification items linked to a recovery session and optionally a work item/course. Controlled reasons cover whether work remains required, late-work acceptance, current due date, most important assignment, corrections, submission receipt, missed material, meeting arrangements and prerequisite review.

## Draft-only behavior

Students explicitly add, edit and remove each question. Idempotency prevents duplicate draft creation. Every owner view returns `sent: false`; saving, reconnection and inventory completion never send a message or invite a teacher.

## Recipient authorization and privacy

No recipient is selected in Step 4. A later messaging step must authorize teacher identity and show an exact editable preview with selected item/fields and explicit confirmation. Private notes, missing-material lists and the complete inventory are never included automatically. This prototype has no production teacher-message service.

Step 7 flags can be added only as private drafts. Feasibility never sends questions, selects recipients, predicts decisions, or promises flexibility.

Step 8 reuses this queue and groups verification questions by course/teacher/session/urgency. Questions remain editable/removable private drafts; recipient authorization and explicit sending remain later steps.
# Step 9 integration

Ask First reuses existing editable Teacher Question Queue drafts. Questions may be prioritized separately from tasks, but nothing is sent without explicit later review and authorization.

Prerequisite questions enter this queue as private, editable drafts. Readiness answers, full diagnostics and private notes are excluded, and nothing is sent automatically.

Step 13 may schedule review/copy/send-confirmation of an existing high-value draft as a bounded Minimum action. Draft, reviewed, copied, sent-confirmed, failed and waiting states remain distinct.

Seven-day plans target critical contact within the first two reasonable school-contact days and keep response-dependent work provisional.
## Missed-week questions

Draft questions may ask whether a class met, whether older work is accepted/replaced/optional, which deadline applies and where an authorized material is available. Drafting never sends; tutor input cannot resolve teacher policy.
## Extended-gap messages

The first course message selects three-to-five high-value current-unit, requirement/acceptance, priority, assessment and material/replacement questions. Gap reasons/private details are excluded and Draft/Copied/Sent/Waiting remain distinct.
## Overwhelmed contact

Expose one course/message/recipient/preview at a time. Drafting/copying never equals sending; another teacher requires explicit choice.
## Step 22 message assistant

Queue questions become source-linked fields in one course-specific editable Draft. Full review and explicit delivery choice are required; response decisions remain provisional until reviewed.
