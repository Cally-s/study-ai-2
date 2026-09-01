# Scenario Structured Data

Schema `scenario-assessment/1.0` contains tenant-scoped, versioned models for ScenarioAssessmentDefinition, ScenarioAssessmentAssignment, ScenarioAssessmentAttempt, ScenarioAssessmentResponse, ScenarioAssessmentEvaluationCriteria, ScenarioAssessmentEvidenceRecord, ScenarioAssessmentTeacherReview, and ScenarioAssessmentEvent.

Definitions keep protected answer and criteria references server-side. Assignments preserve mode, scope, resources, policy snapshot, reasoning, review, language, accessibility, and intentional state. Attempts and responses preserve separate decisions/reasoning, provenance, support condition, versions, and immutable submission. Evidence applies to one response. Reviews never overwrite automated evidence or student work. Events contain safe summaries and exclude private content and surveillance data.

