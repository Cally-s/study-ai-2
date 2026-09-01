# Complete Academic Recovery User-Journey Tests

## Purpose

Each journey must test the complete story across UI, server authorization, canonical data, state transitions, domain events, privacy, accessibility and visible outcome. An isolated unit pass never becomes a journey pass.

## Test levels

Node assert supplies unit/source integration contracts. Complete browser, API/database and network journeys are currently BLOCKED because the project has no runner or application server. Manual screen-reader, TTS quality, zoom, contrast, motion, RTL, shared-device, Low-Bandwidth and safety-usability tests are NOT RUN.

## Deterministic environment

The suite fixes Monday 2026-08-17 16:00 America/Toronto / 20:00 UTC, deterministic derived dates, synthetic tenants and fixed AI/fallback outputs. No sleep or external network/contact is used.

## Test actors

Jordan Test, Taylor Teacher, Casey Tutor, Morgan Guardian, setup administrator, safeguarding reviewer and cross-tenant actor are synthetic. Courses/tasks are synthetic fixtures.

## Release-gate rules

Allowed statuses remain PASSED, FAILED, BLOCKED, NOT_RUN and SKIPPED_WITH_APPROVED_REASON. Any automatic communication/sharing/booking/completion, privacy leak, cross-tenant access, unsafe safety response, keyboard trap, false deletion or failed build blocks release.

## How to run

`node tests/recovery-complete-journeys.test.js` validates the catalog/helpers and truthful blocked results. It does not execute browsers and must not be described as the 30 journeys passing.

