# Recovery Work Inventory

## Purpose

Step 4 privately collects work that may matter without deciding final priority or building a schedule. The dedicated `recoveryWorkInventory` SPA view represents `/recovery/[sessionId]/work` in this single-document prototype.

## Supported item types and fields

Controlled types are Test, Quiz, Assignment, Project, Presentation, Lab, Reading, Corrections, Missed Lesson, Application Deadline and Teacher Meeting. Every item has a private title, controlled course context, controlled completion status, separately structured original/current dates, remaining-time estimate, grade-weight state, late-work state, dependency knowledge, instruction understanding and material readiness. Unknown and Not Applicable are preserved rather than guessed.

## Quick Add and Full Details

Quick Add requires only course context, title, type and status and is a valid inventory item. Add More Details progressively reveals dates, effort, grade weight, late work, dependencies, instructions and materials. Students may add one item at a time, edit it, remove it without changing an official record and add more later.

## Suggested and manual items

Find Work in StudySpark uses authorized, versioned synthetic fixtures in this prototype. Nothing is selected automatically. Overwhelmed mode returns at most three initial suggestions; other modes return at most five. Manual entries remain student-reported and private. The full historical backlog is never loaded by default.

## Review by course and incomplete inventory

The contract computes neutral private counts and supports course/status/confirmation views. One relevant item, or an explicit statement that no item is known, is sufficient. `REVIEWED_WITH_UNKNOWNS` is a successful state. Step 4 records confirmation needs and blockers but does not rank, drop, schedule or share work.

## Privacy, accessibility and offline behavior

Owner views and explicit serializers expose only required fields. The public serializer is empty, ordinary analytics contain event name/time only and teacher questions are unsent drafts. Native controls, semantic headings, text statuses, visible focus, 320px reflow, forced colours, reduced motion and RTL contracts are included. Local offline views preserve cached/manual entries and explicitly forbid fabricated source updates, auto-submit and auto-send.

## Known limitations

The repository has no backend, database, migrations, trusted clock, authorized academic provider, service worker/outbox or real messaging service. Persistence and authorization are executable browser contracts, not production guarantees. Browser, AT, translation, low-bandwidth and real offline journeys remain not run.
## Step 5 entry methods

Step 5 adds a draft-candidate layer before Step 4. Manual entry reuses this inventory; pasted/imported sources require field review and idempotent conversion. No extracted candidate becomes active automatically, and confirmed inventory items remain independent of deletable raw sources.
## Capacity comparison

Step 6 may compare known inventory estimates with the confirmed planning envelope and show that work does not fit. It does not compress, remove, rank or schedule items; prioritization and teacher clarification remain later explicit steps.

Step 7 consumes the current inventory version, remaining-time ranges, statuses, dates, provenance, and dependencies. It separates confirmed, provisional, unknown-estimate, and excluded work; any mutation makes the feasibility analysis OUTDATED.

Step 8 creates field-level verification records from this same inventory. Student corrections preserve source history; verification changes invalidate Step 7 and never alter official assignment records automatically.
# Step 9 integration

Each recommendation references the inventory and work-item versions. Accepted, completed, inactive, and officially no-longer-required work is retained in a separate excluded history. Priority and private-plan release never change inventory school status.
## Missed-week extension

Step 18 references inventory work IDs and adds absence-discovered announcements, deadlines and lesson records with provenance. Confirmed accepted/required items may be planned; optional, replaced, no-longer-required and unknown items retain their distinct status.
## Extended-gap use

Step 19 references current and old work, preserves source/status history and prevents duplicates. Substantial unknown late work remains Ask First; only confirmed actionable work enters staged plans.
