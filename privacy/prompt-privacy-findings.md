# Prompt Privacy Findings

`PromptPrivacyFindingType`, `PromptPrivacyFindingConfidence`, and `PromptPrivacyHandlingRequirement` are defined in `privacy-check-before-sending-runtime.js`. Findings are ephemeral and contain a category, offsets, contextual explanation, handling requirement, suggested replacement, disposition, and masked preview. They do not verify identity or infer protected traits. Material edits invalidate offsets and trigger a new scan. Audit records retain counts and categories only, never exact values or full prompts.
