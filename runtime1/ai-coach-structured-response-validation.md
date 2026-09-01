# AI Coach Structured Response Validation

The strict `ai-coach-decision/1.0` schema contains only the public response, policy/assistance/attempt summaries, sources, confidence, assumptions, actions, thinking question, warnings, presentation metadata, and receipt-offer state. Unknown fields and internal prompts, credentials, privacy findings, teacher notes, or chain of thought are rejected.

Server validation covers schema, mode, assistance, policy, attempt, final-answer leakage, source/citation integrity, confidence, assumptions, action specificity, thinking question, privacy, safety, terminology, translation, accessibility, and prompt/retrieved/tool injection. Critical failure blocks display and ordinary response persistence; regeneration never relaxes policy.
