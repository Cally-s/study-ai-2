# Core Decision Rule Data Models

`AICoreDecisionRuleDefinition` is the immutable published version for a stable rule ID, trigger configuration, capability effects, actions, precedence, dates, reasons, and scope. A published rule set identifies the exact definition versions compatible with Step 66 and response schema 1.1.

`AICoreDecisionEvaluationContext` is assembled by the server from versioned policy, task/assessment, mode/lock, attempt, source, confidence, accessibility, provider, and connection state—never raw content or hidden scores. Immutable evaluations store applicability, codes, effect references, actions, and neutral reason. `AICoreDecisionResult` combines every applicable evaluation through deny-overrides precedence and feeds Steps 6–13. Teacher-question drafts and after-assessment review requests remain separate private, student-controlled records.
