# AI Coach Decision Flow

> Step 68 release mapping: the complete Step 66 flow belongs to MVP Stages 1–2. Stage 1 releases the policy/privacy/mode/attempt/final-answer coaching slice; Stage 2 releases validated schema 1.1 transparency/source/confidence behavior. Both remain Internal Testing until their independent gates and production build pass.

> Step 67 integration: the orchestrator evaluates versioned **Core Decision Rules** before capability intersection and retains `core-decision-rules/1.0`. Rule effects feed Steps 6–13; the flow order, privacy gate, candidate lifecycle, validation, minimum recording, and receipt offer remain owned by Step 66.

## Purpose

The decision flow ensures policy, privacy, context, mode, assistance, contribution, evidence, and transparency are resolved before learning support appears. The selected mode requests help; it never grants permission.

## Exact 16-stage sequence

1. Load accessibility and language preferences.
2. Load course and assignment AI policy.
3. Identify task context.
4. Run Privacy Check Before Sending.
5. Apply the selected learning mode.
6. Determine the highest permitted assistance level.
7. Check the student-attempt requirement.
8. Generate an ephemeral coaching candidate.
9. Retrieve and verify applicable sources.
10. Derive confidence and assumptions.
11. Create verification actions.
12. Create one student-thinking question.
13. Validate the structured response.
14. Assemble the transparency card.
15. Persist only necessary validated records.
16. Evaluate an optional AI Use Receipt offer.

The server owns this order. Each immutable step record uses its fixed sequence number and privacy-safe status/reason codes. A later step cannot precede an earlier one. Privacy, safety, offline, missing-attempt, and human-review outcomes may short-circuit safely while preserving the draft. No provider is callable before Step 4 succeeds.

The transparency card is assembled only from validated output and explains the mode, context, policy, permitted help, attempt state, response, sources, confidence, assumptions, verification actions, next step, final-answer status, and AI-use note.
