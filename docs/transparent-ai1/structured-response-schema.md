# Structured Response Schema

> Step 66 integration: the response schema is `ai-coach-decision/1.0`. Server validation must finish before transparency assembly, persistence, or display; unknown fields, hidden answers, invented citations, unverified factual drafts, private reasoning, and prompt/retrieved-content overrides block the response.

> Step 65 canonical mapping: each durable coaching turn is an immutable `AIResponseRecord`; ordered assumptions and verification steps are child records. Sources and claim checks reference the response ID, while private content remains behind content references. Internal chain of thought and hidden answers are never persistence fields.

> **Step 51 Teach-Back contract:** Teach It Back is one policy-controlled Step 47 final thinking activity with five varied types, explicit server-held criteria, immutable student-provenance attempts, response-level evidence and concise formative feedback. It preserves answer withholding, essential terms, multilingual/access formats, retry/human support, privacy, and no automatic grade, mastery/ability label, copying accusation, misconduct inference, scoring, surveillance, sharing, checkpoint completion, or full-response receipt disclosure.


> **Step 50 AI Use Receipt contract:** Meaningful validated events—not transcripts, clicks, timing, accessibility, safety, or model recollection—compose an immutable private receipt. A separate physically redacted shareable version preserves the exact eleven labels, policy/map snapshots, AI-versus-student provenance, preview and intentional recipient confirmation, immutable share history, and no automatic sharing, scoring, surveillance, or discipline.


> **Step 49 AI Use Map contract:** This feature now uses the immutable, tenant-scoped AIUseMapResolution. The exact global category remains educational guidance; verified versioned policy supplies the actual status and conditions, integrity boundaries fail closed, accessibility presentation supports remain available, and no view or planned-use choice creates sharing, discipline, profiling, or an AI Use Receipt.


## Purpose

Step 48 makes AIResponseRecord, not formatted model text, the source of truth for every renderer.

## Required core fields

Every record requires mode, assignmentContext, integrityPolicy, responseSummary, learningContent, finalAnswerWithheld, sources, confidenceLevel, confidenceReason, assumptions, verificationSteps, studentThinkingQuestion, disclosureSuggestion, warnings, and server-generated createdAt.

## Canonical AIResponseRecord

The record combines a restricted model draft with authenticated identity and trusted policy, source, confidence, assumption, verification, and disclosure state. It is strict, immutable, tenant scoped, and displayed only after complete validation.

## Strict validation

Unknown, missing, invalid, unsafe, untrusted, excessive, or cross-field-conflicting content fails closed.

## No formatted-text parsing

No renderer scrapes Markdown headings or exposes raw/partial model output.

## Versioning

Schema ai-response-record/1.0 is separate from card standard-response-card/4.0. Unknown versions show a safe message; corrections create new records.

## Step 52 — Independent Retry

After substantial guided support, StudySpark may offer one policy-validated, meaningfully novel task with the same skill and comparable demand. The attempt permits accessibility and approved resources but no substantive AI hints. Support requests and task reports preserve work without penalty; only a valid submitted attempt may produce descriptive transfer evidence. Expected answers and evaluation keys remain server-side. This integrates with AIResponseRecord 1.4, Step 47’s single final task, checkpoints, agency records, receipts, and human review without scores, ranks, surveillance, or permanent mastery claims.

## Step 53 — Assignment Policy Builder

Authorized educators configure versioned structured assignment capabilities through 12 exact presets or a validated custom policy. The builder compiles into the existing Step 38 policy engine; plain-language explanations cannot grant permission. Current-version student preflight precedes assignment-linked AI Coach access, while every substantive mode/tool operation remains server authorized. Higher-level restrictions and accessibility guarantees prevail. Viewing, clarification, and restricted requests create no agreement, misconduct inference, alert, score, or surveillance record.

## Step 54 — Teacher AI Literacy Dashboard

Authorized teachers receive a strict teacher-ai-literacy-dashboard/1.0 projection of intentionally submitted, server-validated learning evidence. Nine canonical sections preserve evidence source/version, guided or independent conditions, review status, privacy scope, and limitations. Private conversations, receipts, drafts, reflections, safety content, and accessibility diagnoses are excluded. Cohort patterns use small-group suppression; student order is alphabetical. Instructional needs come from explicit recurring criteria gaps—not AI-use frequency, rankings, detectors, hidden risk scores, or missing evidence.

## Step 55 — Teacher Review Instead of Automatic Discipline

Trusted structured policy mismatches extend Step 40 with an educational reminder, server-permitted alternatives, optional separately stored student context, explicit published-rule escalation, minimal review packages, authorized human outcomes, and neutral versioned resolutions. Simple reminders and changed requests do not escalate by default. StudySpark never infers intent or misconduct, sends full conversations/private artifacts, uses behavioral signals or frequency scores, applies consequences, changes grades, restricts accounts, notifies parents, or creates discipline. Accessibility and safety remain separate.

## Teacher lesson tools schema
`teacher-lesson-tools/1.0` uses strict role/course-scoped records and rejects unknown fields plus risk, probability, ranking, usage-proxy, diagnosis, sentiment, honesty, automatic-grade, and hidden-reasoning fields.
# Step 61 request-envelope extension

The trusted request envelope includes `privacyPreflightId`, server-controlled `privacyPreflightPassed`, `privacyAction`, `sanitizedMessageUsed`, and `destinationPolicyVersion`. Providers receive only the final confirmed message—not the original when sanitized, findings, removed text, or policy reasoning. `AIResponseRecord` may reference the preflight ID without duplicating sensitive details.
# Step 62 request-envelope extension

The trusted request envelope adds `safeguardProfileSnapshotId`, communication/lesson references, final-answer and source profiles, assessment support, human oversight, consent summary, current-action sharing permission, and protected-workflow requirement. All are server derived. Raw birthdate, guardian details, identity documents, inferred-age confidence, writing estimates, and sensitive consent evidence are absent. `AIResponseRecord` retains the immutable snapshot reference.
# AIResponseRecord 1.6

Version `ai-response-record/1.6` adds nullable `accessibilityPresentation` and `languageBridge` metadata: private profile snapshot, reading/chunking, TTS/transcript/captions, print/audio/text-only/math/code/diagram support, contrast/motion validation, independent languages, canonical term records, source languages, translation and server equivalence status. It contains no diagnosis, ability/reading/age score, raw audio, or hidden answer. Older response versions remain immutable.
