# AI Coach Decision Data Models

`AICoachDecisionRun` is the tenant-scoped mutable orchestration identity with request-content reference, exact version pointers, current step, status, row version, and timestamps. Completed runs freeze. `AICoachDecisionStepRecord` is immutable and uniquely maps sequence 1–16 to a step, status, codes, version references, output reference, and safe reason.

`AICoachAssistanceDecision` stores capability sets, selected level, locks, reasons, and policy/safeguard versions. `AIStudentAttemptGate` stores only artifact/version/provenance references and the server decision. `AICoachSourcePlan` stores applicability and source constraints without claiming support. `AICoachTransparencySnapshot` is the reopenable validated display record. `AIUseReceiptOffer` stores private eligibility and student action state without auto-creating a receipt.
