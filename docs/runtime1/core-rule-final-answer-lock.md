# Core Rule: Final-Answer Lock

`STUDENT_FINAL_ANSWER_LOCK` removes final/model-answer capabilities in orchestration, provider instructions, tool permissions, schema validation, leak validation, accessibility metadata, transcripts, print, and similar-example comparison. Hints, questions, genuinely changed examples, reasoning feedback, source verification, and reflection may remain if stronger rules permit them.

A leaked exact/near answer, tool output, metadata answer, transcript/alt-text answer, or answer-key mapping blocks and expires the candidate. Protected answer keys stay server-side and are not sent to providers. Turning off a student preference starts a new run and cannot override policy, assessment, or safeguard locks.
