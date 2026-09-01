# Academic Recovery Mode — Step 1 Entry

## Purpose

Academic Recovery Mode gives students a compassionate way to answer: “What is the smallest useful thing I can do next?” It is private by default and does not generate a schedule, modify work, or contact anyone in Step 1.

## Entry sources

The controlled sources are student dashboard, assignment tracker, study plan, AI Coach, calendar, course page, mobile navigation, overdue-task notification, notification centre, help area and another approved source. The prototype maps assignment tracker, study plan and calendar controls into its existing Study Planner view rather than creating duplicate systems. Course actions are added to existing course cards.

## Canonical button label

The visible primary action is **Help Me Catch Up**. Its dashboard accessible name is “Help Me Catch Up — Build an academic recovery plan.” It is not conditional on an overdue count and uses no alarming animation or color-only meaning.

## Opening screen

The existing SPA adds the `academicRecovery` view with the title “Let’s Choose the Next Achievable Action,” required introduction, central message, privacy notice, late-work policy, mode selector, Not Now, Return and help actions. Return restores the prior view, focus target and scroll position where the prototype supports them.

## Quick Rescue

Quick Rescue is a short-term planning mode for the next 24 hours. It focuses on one or a few useful actions while protecting sleep, meals, medical care, attendance and essential responsibilities. It makes no completion, grade or deadline promise.

## Full Recovery

Full Recovery prepares a seven-day planning draft that can later review workload, available time, priorities, work that may wait, prerequisite gaps and possible help requests. It does not claim every task will fit.

## Session creation

Selecting a radio option changes presentation state only. Explicitly choosing Start Quick Rescue or Build My Seven-Day Recovery Plan creates one private `MODE_SELECTED` draft. A user-scoped idempotency key prevents duplicate activation. Viewing, focusing, selecting or leaving creates no session.

## Existing-session behavior

An active session produces Continue Recovery Plan, Start a New Recovery Plan and confirmed Discard Draft actions. Existing sessions are not silently merged, discarded or described as failures.

## Accessibility

The view uses semantic headings, native buttons, radio inputs, fieldset/legend, status announcements and visible focus. Layout stacks at narrow widths, wraps large text, has reduced-motion and forced-colors rules, and contains no icon-only primary action. Real keyboard, screen-reader, zoom, contrast, RTL and user testing remain pending.

## Offline behavior

The entry copy remains text-only. Offline mode may save a user-scoped mode choice locally after explicit action, but it does not fabricate assignments or create a cloud session. Reconnection requires another explicit continuation.

## Privacy

Opening or selecting a mode sends no teacher, tutor, parent, guardian or counsellor message. Public serialization is empty. Allowed analytics contain only an event name, controlled entry source and timestamp.

## Known limitations

This is a static-browser prototype. It has no trusted authentication, server authorization, database/migration, real task/course authorization, durable outbox, production route, multi-device sync, push service or server audit log. Later workload intake, priority analysis, scheduling, message drafting and sharing are intentionally out of scope.

Step 2 now opens after explicit horizon draft creation and asks the student to choose one or more recovery situations. The planning horizon remains separate; see `recovery-situation-modes.md`.

Step 3 follows with the calm three-question intake and one explicitly requested first action; see `calm-recovery-intake.md`.
## Step 4 continuation

After the explicit Step 3 action boundary, the same private session may enter `WORK_INVENTORY`. The work inventory accepts one item or an explicit no-known-item statement, preserves unknowns and never finalizes priority, changes official academic records or shares data.
