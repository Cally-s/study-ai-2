# Calm Recovery Question Contracts

`RecoveryPrimaryConcern`: TEST, MISSING_ASSIGNMENTS, COURSE_CONFUSION, TOO_MANY_DEADLINES, DONT_KNOW, OTHER. Custom concern is optional, sanitized and limited to 300 characters.

Due context stores controlled kind, source type/ID/version, course ID, short title, ISO date/time, timezone, confidence, completion, late-acceptance status, verification time and authorization. Manual entries remain recovery context and never create assignments.

`RecoveryAvailableTimeType` contains no time, 5/10/15/30/45/60/90/120 minutes, more than two hours, multiple blocks, unknown and custom. Custom duration is bounded; block end must follow start; unlisted time is never inferred.

All eight calm codes reuse `AcademicRecoveryAnswer`, question version, response version, idempotency and owner authorization. Dedupe keys are PRIMARY_CONCERN_NOW, FIRST_DUE_ITEM and AVAILABLE_TIME_TODAY. Changed sources mark relevant intake OUTDATED rather than silently reuse.
