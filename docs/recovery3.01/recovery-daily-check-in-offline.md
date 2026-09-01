# Daily Check-In Offline Behavior

Cached outcomes, barriers, waiting choices, next actions, notes, and partial progress may be saved offline. Plan changes remain provisional. No teacher message, tutor booking, parent-summary update, reminder, or other communication is queued.

One canonical student/session/local-date key plus idempotency prevents duplicate check-ins. Reconnection reviews plan-day/action/capacity versions and does not duplicate progress updates; conflicts preserve both the check-in and current authoritative plan for review.
