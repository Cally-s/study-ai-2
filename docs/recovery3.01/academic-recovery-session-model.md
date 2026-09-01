# Academic Recovery Session Model

## Data model

The minimal session contains an opaque ID, server-derived user ID, optional organization ID, status, optional selected mode, controlled entry source, sanitized source route/context IDs, timestamps and optional expiry. It contains no task list, emotional profile, diagnosis or scoring field.

## Enums

`AcademicRecoveryEntrySource` has eleven closed values documented in the feature specification. `AcademicRecoveryMode` is `QUICK_RESCUE_24_HOURS` or `FULL_RECOVERY_7_DAYS`. `AcademicRecoverySessionStatus` is `DRAFT`, `MODE_SELECTED`, `IN_PROGRESS`, `PAUSED`, `COMPLETED`, `ABANDONED`, `ARCHIVED` or `OUTDATED`. Unknown values are rejected.

## Entry-source and mode validation

Client source labels are operational context, never authorization or risk evidence. A production server must derive the actor, validate source access and resolve titles from authorized records. Raw titles and arbitrary URLs are not persisted.

## Idempotency

Creation requires a user-scoped idempotency key. Repeating a request returns the same draft. An equivalent unfinished draft may be reused. Focus, page open, radio focus/selection and screen-reader announcements never create a session.

## Source-context handling

The model accepts only sanitized opaque course, assignment, study-plan and conversation IDs, an ISO calendar date and context version. It does not store task titles in routes. The entry serializer exposes only controlled source and boolean context presence.

## Session status

Explicit creation after mode confirmation yields `MODE_SELECTED`, not `IN_PROGRESS` or `COMPLETED`. Resume, pause, abandon and archive are owner-only explicit transitions in the prototype contract.

## Outdated sessions

Production consumers should compare `sourceContextVersion` with current authorized assignment/calendar data and mark stale drafts `OUTDATED` with neutral wording. They must not call the old plan failed or merge it automatically.

## Step 2 relations

The Step 2 contract adds normalized need-selection rows, one optional versioned Other description and one current versioned answer per session/question. `planningHorizon` is the canonical Step 1 field; `selectedMode` remains a compatibility alias only. Removed-mode answers become inactive rather than silently affecting routing.
