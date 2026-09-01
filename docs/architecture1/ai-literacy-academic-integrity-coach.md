# AI Literacy and Academic Integrity Coach

## Existing codebase review

StudySpark is a static browser application with CommonJS-compatible deterministic JavaScript runtimes and Node `assert` tests. Existing canonical modules already cover the AI Literacy Lab, main versioned data models, learning modes, assignment policies, assistance ladder, integrity intervention, structured response cards, sources, receipts, projects, accessibility/language, offline synchronization, teacher/parent views, privacy, retention, and Steps 66–70 orchestration, rules, journeys, release architecture, and measures. Actor contracts model authentication, tenant isolation, and role authorization; no production identity/API/database exists.

## Architecture and implementation proposal

The feature is an integration facade, not a replacement domain. `ai-literacy-academic-integrity-coach.js` publishes the exact product identity and maps canonical systems into one journey. Server production work should retain the Step 65 records as sources of truth, Step 66 as orchestration, Step 67 as deny-overrides policy, and Step 69 as the regression contract. No second source, receipt, competency, policy, or review system should be created.

## User journey

Students open the Lab from their current context; choose Understand, Apply, or Create; contribute first; select an allowed mode; receive the smallest permitted help; verify evidence or reasoning; revise and explain; then reflect and disclose when required. Teacher policy and trusted assessment context are resolved once and displayed throughout.

## UNESCO-aligned competency map

The organizing reference uses Human-centred mindset, Ethics of AI, AI techniques and applications, and AI system design across Understand, Apply, and Create. The 12 blocks are Human agency, Embodied ethics, AI foundations, Problem scoping; Human accountability, Safe and responsible use, Application skills, Architecture design; Citizenship in the era of AI, Ethics by design, Creating AI tools, and Iteration and feedback loops. StudySpark is not UNESCO-certified or officially endorsed.

## Curriculum module map

Understand covers AI/search/calculation/retrieval distinctions, agency, unsupported information, invented citations, training data/bias, representation, privacy, original work, policies, and sources. Apply covers prompts, verification, claims/evidence, source comparison, brainstorming, feedback, revision, disclosure, receipts, privacy, and bias. Create follows the 16-step community project cycle from need and stakeholder consultation through non-AI alternatives, design/data/prototype/testing, feedback, revision, limits, and social reflection.

## Assignment-policy and learning-mode architecture

Trusted context and immutable policy versions constrain server capabilities. Accessibility is never disabled. The state machine resolves context, policy, privacy, mode, assistance, attempt, provider/tools, sources, structured validation, display, and optional receipt; it then waits for the student. The nine visible modes map to existing runtime contracts. The final-answer lock prevents generation rather than hiding an answer.

## Integrity, response, and source architecture

Deny overrides allow, active assessments restrict content, unknown policy stays conservative, attempts gate expanded support, interventions use neutral redirection, and human review remains draft/authorized with no automatic discipline. Structured responses require mode, integrity context, content, sources, confidence/reason, assumptions, verification steps, thinking question, disclosure suggestion, final-answer status, and warnings. Source verification distinguishes existence, identity, metadata, relevance, exact support, currency, disagreements, and citation permission; snippets and invented citations are prohibited.

## Privacy, permissions, and data

Students see their own evidence; teachers see authorized submitted evidence and course aggregates; parents see explicitly authorized high-level summaries; administrators see configuration and suppressed aggregates. Private prompts, unrelated conversations, exact findings, diagnoses, hidden reasoning, scores, ranks, and automatic discipline are prohibited. Canonical Step 65 models remain the database design; physical migrations require a real database and therefore are not fabricated here.

## Pages, operations, accessibility, and offline

The facade catalogs student/course/research/assignment/Study Room/teacher entries plus Lab, pathways, diagnostic, competency, verification, prompt, project, system-card, fairness, and progress surfaces. It catalogs the canonical Lab, rule, flow, policy, validation, source, receipt, project, synchronization, and review operations. All views retain keyboard structure, accessible names/headings/status, TTS without autoplay, reviewed STT, captions/transcripts, 200%/320px reflow, contrast/forced colours, Reduced Motion, bilingual academic terms, RTL, print, and Low-Bandwidth. Offline work is provisional, version checked, source-pending, and conflict preserving.

## Testing and MVP sequence

Tests span unit rules, model/version contracts, API-style module integration, UJ-001–UJ-050, privacy/hidden-answer scanners, and later real browser/manual accessibility evidence. MVP integration order is Lab entry; Understand lessons; mode selector; final-answer lock; assignment context/policy; attempt gate; integrity intervention; response card; sources/verification; then confidence, assumptions, and next-thinking question.

## Current limitations

The integrated prototype has no production database/migrations, authenticated server/API, provider/source gateway, browser E2E, manual assistive-technology lab, or production build pipeline. Those remain release blockers and are not described as complete.
