# Core Rule: Teacher Judgement

`TEACHER_JUDGEMENT_REQUIRES_QUESTION` covers assignment exceptions, rubric interpretation, deadline/extension, accepted format, collaboration, source approval, AI disclosure, grading, and other teacher/school discretion. The runtime redirects rather than predicting a likely answer.

The generated question is private, editable, and unsent. The student reviews it, Privacy Check runs, and intentional confirmation is required in the existing teacher-message workflow. The rule never grants `SEND_TEACHER_MESSAGE`, creates an alert, or records a predicted teacher decision.
