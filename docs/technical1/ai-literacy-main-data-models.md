# AI Literacy Main Data Models

> Step 68 release mapping: the six stages reuse the Step 65 aggregates rather than stage-specific duplicates. Production release requires additive migrations, tenant/relationship validation, rollback/forward-fix instructions, and durable authorization evidence; none is claimed in this workspace.

> Step 67 integration: versioned rule definitions, sets, evaluations, capability effects, and effective results are supporting Step 66 records rather than new public student aggregates. They reference the decision run and preserve immutable rule history without adding a compliance score.

> Step 66 integration: `AICoachDecisionRun` and its immutable step/decision records orchestrate the Step 65 aggregates by reference. Only a validated Step 66 response becomes an `AIResponseRecord`; source, claim, receipt, profile, policy, and session truth remain in their Step 65 models.

Step 65 defines one canonical model layer for AI-literacy learning records. The browser prototype implements it in `ai-literacy-main-data-models.js` as a deterministic in-memory reference architecture; it does not claim a physical database, ORM, or deployed migration.

The only public aggregate names are `AILiteracyProfile`, `AICompetencyProgress`, `AILessonProgress`, `AIAssignmentPolicy`, `AICoachSession`, `AIResponseRecord`, `AISourceRecord`, `AIClaimCheck`, `AIUseReceipt`, and `AICapstoneProject`. Stable aggregate identities point to immutable definitions, versions, attempts, evidence, source links, receipt versions, and prototype versions. Mutable preferences use optimistic row versions. Retryable creates use tenant-and-user-scoped idempotency keys.

All reads and writes require an authenticated user and organization. Ownership checks protect student records; role checks protect publication and review. Submitted, published, approved, and reviewed records are immutable. Competency progress is a rebuildable projection from eligible evidence, never a client-authored score. Pending offline verification is excluded from demonstrated competency.

Compatibility projections preserve existing Step 1–64 UI contracts without introducing duplicate sources of truth. Outbox and audit records contain identifiers, status, action, and version only—never private response content, secrets, raw safety content, or hidden reasoning.
## Step 70 metric projections

Responsible AI Learning Success Measures reuse canonical Step 65 evidence, response, claim/source, receipt, retry, review, and capstone records through versioned references. Definitions, computation runs, immutable snapshots, cohorts, suppression policies, and corrections are projections—not a second competency, source, receipt, or project-review system.
