# Recovery Question Routing

`I Have a Test Tomorrow` routes directly to the seven-question rapid intake, not the full backlog or seven-day questionnaire. Unknowns and Save/Pause remain valid.

## Router architecture

`AcademicRecoverySituations.routeRecoveryQuestions` is a deterministic registry-based router. It uses the owner-authorized recovery session, preserved planning horizon, active situation selections, current active answers and questionnaire version. It returns the next controlled question, a bounded initial group, section progress, combination notice and presentation mode. It marks output `serverControlled: true` and `generatedByAI: false`; production must run the same policy on a trusted server.

## Modules and priorities

Priority order is urgent test, overwhelmed presentation adaptation, prerequisite, recent/extended backlog, teacher-help output, parent-summary output, Other and review. Controlled modules and types reject arbitrary browser-generated codes.

## Shared-question deduplication

Stable dedupe keys cover primary course, backlog courses, available urgent time, fixed stop time, current topic and known deadlines. The first highest-priority applicable definition wins; one course answer can serve urgent, prerequisite and communication modules.

## Initial question budgets

Quick Rescue exposes at most six initial questions. Full Recovery exposes at most ten. Overwhelmed exposes at most three before a first useful action. Existing answers reduce the remaining group. Test Tomorrow never begins with monthly backlog inventory.

## Horizon behavior

Quick Rescue prioritizes an urgent event, one blocker, clarification and a small action without silently changing horizons. Full Recovery retains seven-day scope but still completes urgent test intake first and uses progressive disclosure.

## Offline behavior

Selections and answers save to a user/session-namespaced local draft. Offline state promises no automatic submission and never fabricates server assignments. Explicit synchronization requires idempotency in production.

## Source-version handling

The contract can invalidate active answers after authorized source context changes. Production must compare source/questionnaire versions, show the changed fact and request confirmation rather than silently overwrite.

Calm-intake answers use shared dedupe keys so confirmed concern, first due item and today’s available time suppress equivalent later questions.
## Work inventory routing boundary

The router hands the session to `WORK_INVENTORY` after the calm intake. Step 4 consumes selected situations and existing calm answers only to limit and contextualize collection. It does not add a second question registry, repeat completed calm questions, rank work or create a schedule.
## Step 5 entry-method routing

Workload-entry method is a controlled route choice after the Step 4 Add Item action. It creates a separate private import session/candidate review, not recovery questions or active work. Unavailable upload/connector routes fail closed and return to manual/paste alternatives.
## Step 6 capacity boundary

After work collection/import, the same session enters `CAPACITY_INTAKE`. Situation modes alter scope: Test Tomorrow/Quick Rescue start with urgent time; Full Recovery uses seven exact dates; Overwhelmed may show one day first. Capacity collection never finalizes priority or schedules tasks.

## Step 7 feasibility boundary

After capacity, the flow enters `FEASIBILITY_ANALYSIS`, then offers `PRIORITIZATION`. Quick Rescue stays within 24 hours; overwhelmed and teacher-help modes may shorten or reorder presentation without changing arithmetic.

Step 11 readiness uses exactly five task-specific questions. One-question-at-a-time display changes presentation only; it does not change routing, evidence or requiredness.
## Step 18 route

`I Have Missed One Week` routes to a calm absence-window, affected-course, lesson, new-work, materials and requirement review. Unknown/conflicting values branch to clarification; an imminent test may offer Step 17 without replacing the missed-week session.
## Step 19 route

`I Have Missed One Month` accepts extended/partial/course-specific/academic-work gaps and routes first to window, courses and First 48 Hours decisions. Test Tomorrow may open Step 17; a smaller course gap may reuse Step 18 without replacing the parent session.
## Step 20 route

`I Do Not Understand the Prerequisite` opens directly from recovery/task/specialized modes. It routes broad/unknown concepts to candidate review, verified narrow candidates to Step 11/12, other barriers back to their appropriate help, and repeated confusion to human support.
## Step 21 route

`I Am Overwhelmed` opens directly and delegates one choice to priority, Step 16, teacher queue, today-only Minimum or human support. Safety triage supersedes delegation when policy indicates an immediate concern.
