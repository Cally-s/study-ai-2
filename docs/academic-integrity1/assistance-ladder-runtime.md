# Assistance Ladder Runtime

Private sessions store context/policy versions, selected mode, resolved per-level states, current level, waiting, student-work references, and row version. Every message gets an immutable ladder snapshot. Trusted instructions and tool allowlists use the active permitted level only. Output and streaming validation block completed answers, extra levels, hidden solutions, automatic escalation, and untrusted policy overrides; safe fallbacks remain at or below the current level.
