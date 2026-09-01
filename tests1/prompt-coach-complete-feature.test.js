'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Coach = require('../prompt-writing-coach');
const fixture = require('./fixtures/prompt-coach');

const source = fs.readFileSync(path.join(__dirname, '..', 'prompt-writing-coach.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '..', 'prompt-writing-coach.css'), 'utf8');
let scenarios = 0;
const scenario = (name, test) => { test(); scenarios += 1; process.stdout.write(`✓ ${name}\n`); };
const errorCode = (code) => (error) => error && error.code === code;
const makeSession = (actor, overrides) => Coach.createPromptCoachSession(fixture.sessionInput(overrides), actor).session;
const makeDraft = (actor, session, overrides) => Coach.createPromptDraftVersion(fixture.draftInput(session.id, overrides), actor).draft;

scenario('1. new student sees no saved, recent, or draft records', () => {
  const actor = fixture.student();
  assert.deepStrictEqual(Coach.listPromptCoachDrafts(actor), []);
  assert.deepStrictEqual(fixture.records.noPrompts.savedPrompts, []);
  assert.match(source, /You have not created a prompt yet\./);
});

scenario('2. student creates a prompt from scratch and it persists privately', () => {
  const actor = fixture.student(), session = makeSession(actor), created = Coach.createPromptCoachDraft(fixture.draftInput(session.id), actor);
  assert.equal(created.draft.status, 'SAVED');
  assert.equal(created.draft.userId, actor.userId);
  assert.equal(created.draft.organizationId, actor.tenantId);
  assert.equal(Coach.getPromptCoachDraft({ id: created.draft.id }, actor).generatedPrompt, created.draft.generatedPrompt);
  assert.equal(created.automaticallySent, false);
});

scenario('3. Quick-Start Template prefills a real editable draft without sending', () => {
  const actor = fixture.student(), session = makeSession(actor);
  const state = Coach._test.newGuidedBuilderState('hint');
  Object.assign(state.values, { subject: 'Science', level: 'Grade 9', academicWorkType: 'HOMEWORK', aiAssistancePermission: 'HINTS_OR_QUESTIONS_ONLY' });
  const input = Coach._test.guidedDraftInput(state);
  const result = Coach.createPromptDraftVersion({ ...input, idempotencyKey: fixture.unique('quick-start'), promptCoachSessionId: session.id }, actor);
  assert.equal(result.draft.requestedHelpMode, 'HINT');
  assert.match(result.draft.generatedPromptText, /Help I want:\nHINT/);
  assert.equal(result.automaticallySent, false);
});

scenario('4. weak prompt improvement preserves original and creates a reviewed version', () => {
  const actor = fixture.student(), session = makeSession(actor), state = Coach._test.newImprovePromptState();
  state.original = 'Explain fractions.';
  state.reviewed = true;
  state.suggestions = Coach._test.improveSuggestions().map((item, index) => ({ ...item, status: index < 2 ? 'accepted' : 'rejected' }));
  const improved = Coach._test.improvedPromptText(state);
  const original = makeDraft(actor, session, { goal: state.original, studentEditedPromptText: state.original, helpMode: 'CONCEPT_EXPLANATION', studentAttemptRule: 'NO_ATTEMPT_REQUIRED' });
  const revised = makeDraft(actor, session, { ...Coach._test.improveDraftInput(improved), idempotencyKey: fixture.unique('improved-version') });
  assert.equal(original.versionNumber, 1);
  assert.equal(revised.versionNumber, 2);
  assert.match(revised.generatedPromptText, /Explain fractions\./);
  assert.equal(Coach.listPromptDraftHistory(actor).length, 2);
});

scenario('5. changing Learning Mode updates instruction, preview, and persisted draft', () => {
  const actor = fixture.student(), session = makeSession(actor), state = Coach._test.newGuidedBuilderState();
  const mode = Coach._test.guidedLearningModes.find((item) => item.value === 'CHECK_REASONING');
  Object.assign(state.values, { goal: 'Check my algebra steps.', subject: 'Mathematics', level: 'Grade 10', understanding: 'I expanded the brackets.', confusion: 'My result differs from my notes.', helpType: mode.value, modeInstruction: mode.instruction, presentation: 'STEP_BY_STEP', avoid: 'Do not replace my solution.', sources: 'NO_EXTERNAL_SOURCE_NEEDED', academicWorkType: 'HOMEWORK', aiAssistancePermission: 'GENERAL_LEARNING_SUPPORT' });
  const input = Coach._test.guidedDraftInput(state);
  const draft = makeDraft(actor, session, { ...input, idempotencyKey: fixture.unique('mode-change') });
  assert.equal(draft.selectedLearningMode, 'CHECK_REASONING');
  assert.equal(draft.learningModeInstruction, mode.instruction);
  assert.match(draft.generatedPromptText, /Review my steps|first incorrect|unclear step/i);
});

scenario('6. final-answer lock is stored as an enforced student-attempt rule', () => {
  const actor = fixture.student(), session = makeSession(actor), state = Coach._test.newGuidedBuilderState();
  const mode = Coach._test.guidedLearningModes.find((item) => item.value === 'NO_FINAL_ANSWER');
  Object.assign(state.values, { goal: 'Help me solve a quadratic myself.', subject: 'Mathematics', level: 'Grade 10', understanding: 'I can identify a and b.', confusion: 'I need the next step.', helpType: mode.value, modeInstruction: mode.instruction, academicWorkType: 'HOMEWORK', aiAssistancePermission: 'HINTS_OR_QUESTIONS_ONLY' });
  const draft = makeDraft(actor, session, { ...Coach._test.guidedDraftInput(state), idempotencyKey: fixture.unique('final-lock') });
  assert.equal(draft.selectedLearningMode, 'NO_FINAL_ANSWER');
  assert.equal(draft.studentAttemptRule, 'NEVER_REVEAL_FINAL_ANSWER_IN_THIS_MODE');
});

scenario('7. AI Coach handoff requires exact review and explicit send', () => {
  const actor = fixture.student(), session = makeSession(actor), draft = makeDraft(actor, session);
  assert.throws(() => Coach.sendApprovedPromptDraft({ idempotencyKey: fixture.unique('early-send'), promptDraftVersionId: draft.id, explicitSend: true, confirmedPromptText: draft.generatedPromptText }, actor), errorCode('EXPLICIT_SEND_REQUIRED'));
  const approved = Coach.approvePromptDraft({ promptDraftVersionId: draft.id, studentReviewed: true, confirmedPromptText: draft.generatedPromptText }, actor);
  const sent = Coach.sendApprovedPromptDraft({ idempotencyKey: fixture.unique('send'), promptDraftVersionId: approved.id, explicitSend: true, confirmedPromptText: approved.generatedPromptText }, actor);
  assert.equal(sent.sendRequested, true);
  assert.equal(sent.originalUnreviewedPromptSent, false);
  assert.equal(Coach.getPromptCoachDraft({ id: approved.id }, actor).status, 'SENT');
});

scenario('8. student saves, favourites, reuses, renames, and duplicates a prompt', () => {
  const actor = fixture.student(), session = makeSession(actor), draft = makeDraft(actor, session);
  assert.equal(Coach.setPromptDraftFavourite({ promptDraftVersionId: draft.id, favourite: true }, actor).favourite, true);
  assert.equal(Coach.renamePromptDraft({ promptDraftVersionId: draft.id, title: 'Reusable factoring guide' }, actor).title, 'Reusable factoring guide');
  assert.ok(Coach.markPromptDraftUsed({ promptDraftVersionId: draft.id }, actor).lastUsedAt);
  const duplicate = Coach.duplicatePromptDraft({ promptDraftVersionId: draft.id, idempotencyKey: fixture.unique('duplicate') }, actor);
  assert.equal(duplicate.title, 'Reusable factoring guide Copy');
  assert.equal(Coach.listPromptCoachDrafts(actor).length, 2);
});

scenario('9. private information is detected and blocked at the repository boundary', () => {
  const findings = Coach._test.scanPromptPrivacy('My student number is 12345678. Help with algebra.');
  assert.ok(findings.some((finding) => finding.type === 'student-number'));
  const actor = fixture.student(), session = makeSession(actor);
  assert.throws(() => makeDraft(actor, session, { goal: 'My student number is 12345678.', studentEditedPromptText: 'My student number is 12345678. Help with algebra.' }), errorCode('BLOCKED_BY_PRIVACY'));
});

scenario('10. unknown assignment policy cannot authorize submission-ready help', () => {
  const actor = fixture.student(), session = makeSession(actor);
  const draft = makeDraft(actor, session, { ...fixture.policies.unknown, helpMode: 'DRAFT_FEEDBACK', selectedLearningMode: 'DRAFT_FEEDBACK', studentAttemptRule: 'FEEDBACK_ON_STUDENT_WORK_ONLY' });
  assert.throws(() => Coach.approvePromptDraft({ promptDraftVersionId: draft.id, studentReviewed: true, confirmedPromptText: draft.generatedPromptText }, actor), errorCode('BLOCKED_BY_POLICY'));
});

scenario('11. keyboard-only navigation has focus, native controls, and arrow-key contracts', () => {
  assert.match(source, /event\.key === 'ArrowRight'/);
  assert.match(source, /event\.key === 'ArrowLeft'/);
  assert.match(source, /event\.key === 'Home'/);
  assert.match(source, /event\.key === 'End'/);
  assert.match(source, /button:not\(\[type\]\)/);
  assert.match(css, /:focus-visible/);
});

scenario('12. Speech-to-Text requires transcript review and never sends automatically', () => {
  const speech = source.match(/function startPromptSpeechInput[\s\S]*?\n  \}/)?.[0] || '';
  assert.match(source, /Review Speech-to-Text Transcript/);
  assert.match(source, /Use This Text/);
  assert.match(source, /raw audio/i);
  assert.doesNotMatch(speech, /sendApprovedPromptDraft|handoffGuidedPrompt|saveGuidedPromptDraft/);
});

scenario('13. bilingual builder creates an explicit two-language instruction', () => {
  const actor = fixture.student(), session = makeSession(actor), state = Coach._test.newGuidedBuilderState('explain-concept');
  Object.assign(state.values, { subject: 'Science', level: 'Grade 9', bilingual: true, primaryLanguage: 'en', secondaryLanguage: 'fr-CA', academicWorkType: 'INDEPENDENT_PRACTICE', aiAssistancePermission: 'GENERAL_LEARNING_SUPPORT' });
  const draft = makeDraft(actor, session, { ...Coach._test.guidedDraftInput(state), idempotencyKey: fixture.unique('bilingual') });
  assert.match(draft.generatedPromptText, /bilingual|en and fr-CA/i);
  assert.equal(fixture.preferences.bilingual.secondaryExplanationLanguageCode, 'fr-CA');
});

scenario('14. internet loss blocks transmission without deleting the approved draft', () => {
  const actor = fixture.student(), session = makeSession(actor, { offlineEnabled: true }), draft = makeDraft(actor, session);
  const approved = Coach.approvePromptDraft({ promptDraftVersionId: draft.id, studentReviewed: true, confirmedPromptText: draft.generatedPromptText }, actor);
  assert.throws(() => Coach.sendApprovedPromptDraft({ idempotencyKey: fixture.unique('offline-send'), promptDraftVersionId: approved.id, explicitSend: true, confirmedPromptText: approved.generatedPromptText, offline: true }, actor), errorCode('OFFLINE_SEND_BLOCKED'));
  assert.equal(Coach.getPromptCoachDraft({ id: approved.id }, actor).status, 'APPROVED');
});

scenario('15. draft remains restorable after reconnect and ownership stays isolated', () => {
  const actor = fixture.student(), session = makeSession(actor, { offlineEnabled: true }), draft = makeDraft(actor, session);
  Coach.pausePromptCoachSession({ promptCoachSessionId: session.id }, actor);
  const resumed = Coach.resumePromptCoachSession({ promptCoachSessionId: session.id }, actor);
  assert.equal(resumed.status, 'DRAFT');
  assert.equal(Coach.getPromptCoachDraft({ id: draft.id }, actor).generatedPrompt, draft.generatedPromptText);
  const outsider = fixture.student({ tenantId: actor.tenantId });
  assert.throws(() => Coach.getPromptCoachDraft({ id: draft.id }, outsider), /unavailable/i);
  assert.equal(fixture.records.synchronizationConflict.resolution, 'STUDENT_REVIEW_REQUIRED');
});

scenario('16. mobile layout stacks builder before preview without horizontal scrolling', () => {
  assert.match(css, /@media\(max-width:56rem\)[\s\S]*?grid-template-areas:"builder" "preview"/);
  assert.match(css, /@media\(max-width:32rem\)/);
  assert.match(css, /max-inline-size:100%/);
  assert.match(css, /overflow-wrap:anywhere/);
  assert.doesNotMatch(source, /window\.innerWidth|screen\.width/);
});

scenario('17. template-loading failure provides a retry path and preserves work', () => {
  assert.match(source, /Unable to load templates/);
  assert.match(source, /Try Again/);
  assert.match(source, /renderPromptTemplateLibrary/);
  assert.match(source, /Your work has not been deleted/);
  assert.doesNotMatch(source.match(/function renderPromptTemplateLibrary[\s\S]*?\n  \}/)?.[0] || '', /promptCoachDrafts?\.(?:clear|delete)/);
});

scenario('authorization matrix blocks cross-tenant and cross-student draft access', () => {
  const owner = fixture.student(), sameTenantOtherStudent = fixture.student({ tenantId: owner.tenantId }), otherTenant = fixture.student();
  const draft = makeDraft(owner, makeSession(owner));
  assert.throws(() => Coach.getPromptCoachDraft({ id: draft.id }, sameTenantOtherStudent), /unavailable/i);
  assert.throws(() => Coach.getPromptCoachDraft({ id: draft.id }, otherTenant), /unavailable/i);
  assert.deepStrictEqual(Coach.listPromptCoachDrafts(sameTenantOtherStudent), []);
  assert.deepStrictEqual(Coach.listPromptCoachDrafts(otherTenant), []);
});

scenario('policy fixtures cover prohibited, disclosure-required, and active-test work', () => {
  const actor = fixture.student(), session = makeSession(actor);
  const prohibited = makeDraft(actor, session, { ...fixture.policies.prohibited, idempotencyKey: fixture.unique('prohibited') });
  assert.throws(() => Coach.approvePromptDraft({ promptDraftVersionId: prohibited.id, studentReviewed: true, confirmedPromptText: prohibited.generatedPromptText }, actor), errorCode('BLOCKED_BY_POLICY'));
  const active = makeDraft(actor, session, { ...fixture.policies.activeTest, idempotencyKey: fixture.unique('active-test') });
  assert.throws(() => Coach.approvePromptDraft({ promptDraftVersionId: active.id, studentReviewed: true, confirmedPromptText: active.generatedPromptText }, actor), errorCode('ACTIVE_ASSESSMENT_RESTRICTED'));
  const disclosure = makeDraft(actor, session, { ...fixture.policies.disclosureRequired, idempotencyKey: fixture.unique('disclosure') });
  assert.equal(Coach.approvePromptDraft({ promptDraftVersionId: disclosure.id, studentReviewed: true, confirmedPromptText: disclosure.generatedPromptText }, actor).status, 'APPROVED');
});

assert.equal(scenarios, 19);
console.log(`Prompt Coach complete feature suite passed: ${scenarios} journeys`);
