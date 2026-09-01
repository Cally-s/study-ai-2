# Recovery Fact Verification

## Purpose

Step 8 separates facts that could change prioritization before any final order. It reuses Work Inventory fields, Step 5 provenance, Step 7 assessments, and the existing teacher-question queue.

## States

Source Confirmed, Confirmed by You, Extracted Unconfirmed, Estimated, Assumption, Unknown, Conflicting Information, Needs Recheck, Not Applicable, and Rejected are distinct. Confidence (High, Medium, Low, Unknown) is separate: high-confidence OCR or AI extraction remains unconfirmed.

Confirmed official facts require an authorized field-specific source. Student confirmation is authoritative for progress, instruction understanding, materials, and remaining-time estimates—not official deadlines, acceptance, or late policy. Estimates and assumptions remain labelled; Unknown is valid; conflicts show both records; stale records cannot authorize verified prioritization.

## Readiness

Items are Ready for Prioritization, Ready with Estimates, Needs Clarification, Blocked by Conflict, Outdated, or Excluded. A 90-minute past-due item with unknown required/late status receives the canonical safeguard and a private low-cost action.

## Known limitations

No production server, authorized school/teacher source, trusted clock/freshness service, database, message service, durable sync, rate limiter, or human accessibility evidence exists.
# Step 9 integration

Priority analysis records the verification review ID, update version, per-item readiness, confidence, unknowns, conflicts, and private actions. Stale, conflicting, or critically unknown facts gate work into Ask First.

Priority explanations reference the current review version and material fact records. Corrections and conflicts invalidate dependent explanations; student free text never promotes a fact to teacher-confirmed.
## Missed-week facts

Absence dates, class occurrence, attendance, lesson content, prerequisite links, materials and requirement policy are verified independently. Student-reported facts remain labelled; conflicts and stale records cannot silently authorize required work.
## Extended-gap decisions

Current unit, essential expectation, requirement/acceptance, replacement authority, assessment date/scope/support and material access are separate facts and decision gates. AI/extraction cannot resolve official gates.
## Teacher-message facts

Every course/teacher/task/date/acceptance/unit/assessment/support field retains verification and student approval. Unknown/conflicting/stale facts are not stated as confirmed teacher decisions.
# Step 25 recalculation integration

Requirement, acceptance, deadline, replacement, material, prerequisite, plan, and capacity facts retain source/version/status. Unknown/conflicting/stale substantial work moves to Ask First; AI/tutor/student input cannot silently become official authority.
