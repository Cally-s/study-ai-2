# Recovery Dashboard

## Purpose
The dashboard is a private aggregation/navigation layer over existing Recovery sources, never a second source of truth. “The dashboard should make the next useful action clear without forcing the student to confront the entire backlog every time they sign in.”

## Five-area structure
Exactly five primary areas appear: Today, Ask for Help, Seven-Day Plan, Progress, and Recalculate. `/recovery/[sessionId]` is the conceptual primary route; opaque secondary routes drill into existing workflows.

## Student-facing principles
“You do not need to solve everything at once. Start with today’s smallest useful action.” No red overdue wall, guilt, comparison, score, rank, streak, points, unstable percentage, grade prediction, surveillance, automatic communication, or automatic plan change appears.

## Data sources and limitations
Views aggregate versioned plans/days/actions, capacity, blockers/waiting, teacher/tutor/support states, metrics, privacy, integrity, safety, and presentation preferences. This static prototype lacks authenticated server aggregation, subscriptions, durable snapshots, and production source-version enforcement.
## Step 36 Recovery Output integration
The Recovery Output aggregates this source into a private, reviewable, versioned student view. Confirmed/estimated/unknown/conflicting/stale status, five-category triage, feasibility, Minimum-before-Stretch, protected buffer, help, review and no-automatic-action rules remain authoritative.
## Step 37 canonical data-model integration
This feature reads canonical tenant/owner-scoped Recovery Case, versioned task/fact/blocker/prerequisite/action/capacity/plan/communication/event records. Its dashboard or snapshot remains derived, privacy safe and non-authoritative; source versions, grants, optimistic concurrency, idempotency, retention and audit rules apply.
## Step 38 layered state integration
Primary lifecycle, wait records, attention flags, system health, versioned priority, action execution/scheduling/review/validity remain separate. Consequential transitions require valid triggers, guards, evidence, actor, version, student control and audit; partial progress and history are preserved.

## Step 40 controlled MVP delivery

This workflow is exposed only when its Recovery stage, feature flag, tenant/account scope, earlier-stage dependencies and evidence gates permit it. Disabled later-stage controls are omitted and a safe earlier-stage alternative remains. Upgrades preserve source/version/history records; rollback blocks new later-stage writes without deleting student data. Privacy, accessibility, Academic Integrity, safety and human authority apply from Stage 1 rather than arriving as later features.
