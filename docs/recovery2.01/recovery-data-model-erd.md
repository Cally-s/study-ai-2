# Recovery Data Model ERD

AcademicRecoveryCase owns Tasks, Capacity Entries, Actions, Check-Ins, Recalculations, Communications and Plan Versions. Tasks own Facts, Blockers and Prerequisite Gaps. Actions have Dependencies and versioned Allocations through Plan Days. Plan Versions own Triage Decisions. Communications own immutable Draft Versions and Delivery history. Domain, Progress and Audit Events reference aggregates. Sharing grants remain in the existing privacy domain.
