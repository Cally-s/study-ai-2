# Zoom and Reflow Test Results

Date: 2026-08-10

## Automated and static evidence

Source regression verifies relative root text scaling, wrapping buttons, 44-pixel target minimums, flexible one-column breakpoints, bounded scrollable dialogs, wrapped dialog actions, internal table/code scrolling, logical alignment, persistent toolbar inclusion, and the absence of zoom-disabling viewport directives.

## Manual/browser evidence

Status: **PENDING — NOT RUN**.

No route is recorded as passing at 200% zoom, 400% zoom, a 320-CSS-pixel viewport, increased OS text size, mobile portrait, mobile landscape, tablet, forced colours, High-Contrast Light, or High-Contrast Dark. The available controlled browser blocks the local `file://` application under its security policy.

Routes awaiting testing include landing/authentication, dashboard, notes/lesson-like content, AI Coach, quiz, planner, settings, dialogs, downloads/PDF viewer, safety actions, tutoring, and Study Rooms. Required records are browser, OS, viewport, zoom, display mode, task, expected/actual result, content preservation, focus, tester, date, and issue IDs.

Remaining risks include fixed heights and absolute positioning in legacy components, toolbar/Study Room collisions, mobile sidebar focus, embedded PDF controls, charts without table alternatives, and long translated labels.
