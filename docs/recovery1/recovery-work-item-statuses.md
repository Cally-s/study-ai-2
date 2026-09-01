# Recovery Work Item Statuses

## Controlled statuses

- `NOT_STARTED` — believed required; work has not begun.
- `STARTED` — some work has begun and substantial work remains.
- `ALMOST_FINISHED` — most work appears complete; no percentage is inferred.
- `BLOCKED` — the student cannot currently continue; this is not refusal or diagnosis.
- `WAITING_FOR_TEACHER` — progress depends on information, feedback, approval or clarification.
- `SUBMITTED` — the student/source says submission occurred; acceptance is not established.
- `ACCEPTED` — an authorized source or explicit student confirmation says no further action is currently required for this item.
- `RETURNED_FOR_REVISION` — submitted work requires correction, revision or resubmission.
- `NO_LONGER_REQUIRED` — a teacher/system/source confirmed the item is no longer required.
- `STATUS_UNKNOWN` — the official status is not currently known.

Status Unknown is selectable, visible, reviewable and distinct from Not Started. It may create a draft clarification option and never implies late acceptance, failure or low motivation. Submitted never automatically becomes Accepted; an uploaded file alone never establishes Submitted.

## Source, confidence and history

Sources: platform, teacher, school system, application system, student report, imported-unverified or unknown. Confidence: verified, student-confirmed, needs confirmation or unknown. Source version and confirmation time remain separate. History records previous/new controlled states without sensitive notes in ordinary metadata.

## Transitions

The contract records explicit transitions, including Not Started → Started → Almost Finished → Submitted, Submitted → Accepted or Returned for Revision, Returned for Revision → Started, active states ↔ Blocked/Waiting for Teacher and Status Unknown → a confirmed state. It never automatically changes Submitted to Accepted, Past Due to No Longer Required, Uploaded to Submitted or Waiting for Teacher to Accepted.
## Extracted status phrases

Parser/OCR/AI status mappings are provisional. “Barely started” may suggest Started; “uploaded” does not establish Submitted; Submitted never establishes Accepted. Candidate status must be student-confirmed or explicitly unknown before conversion.

## Step 7 feasibility

Accepted and No Longer Required are excluded. Submitted is excluded only when no confirmed follow-up remains. Returned for Revision and Blocked retain remaining work. Status Unknown is provisional and cannot create a false Manageable result.

Step 8 treats Status Unknown as a blocking unknown, Submitted separately from Accepted, and official Accepted/No Longer Required as source-authorized facts. Student progress confirmation cannot confirm official acceptance or policy.
