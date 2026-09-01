# Accessibility MVP Plan

The consolidated codebase audit, target architecture, canonical preference model, Language Bridge and speech approach, offline strategy, component/API inventories, privacy matrix, implementation sequence and testing plan are recorded in `accessibility-language-bridge-architecture.md`.

## Purpose and stages

The MVP organizes existing StudySpark accessibility work into five dependencies: Basic Accessibility; Accessible Content; Language Bridge; Digital-Divide Support; and Quality/Administration. Independent implementation may continue, but broad rollout waits for the preceding stage to be COMPLETE. Stage 5 publication controls wait for stable, versioned Stages 1–4.

## Gates and capabilities

Capabilities are `accessibility.basic`, `.content`, `.languageBridge`, `.digitalDivide`, and `.qualityAndAdmin`, each Disabled, Internal Testing, Limited Rollout, or Enabled. They are rollout controls, never authorization or privacy controls. Only a trusted server administrator may change production state.

No stage is COMPLETE in this static prototype because migrations, complete essential journeys, privacy/security review, browser/AT manual evidence and server enforcement are unavailable. Advanced providers, production publishing, full media/PDF validation and cross-device persistence remain post-MVP.
