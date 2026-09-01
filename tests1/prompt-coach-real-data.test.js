const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Coach = require('../prompt-writing-coach');

const actor = { userId: 'real-data-student', tenantId: 'real-data-school', role: 'student' };
const other = { userId: 'other-student', tenantId: 'real-data-school', role: 'student' };
const session = Coach.createPromptCoachSession({ idempotencyKey: 'real-data-session', fictionalTask: false }, actor).session;
const input = {
  idempotencyKey: 'real-data-draft', promptCoachSessionId: session.id, title: 'Quadratic reasoning prompt', subject: 'Mathematics', courseLevel: 'Grade 10',
  goal: 'Understand how the middle term guides factoring.', currentUnderstanding: 'I can find factor pairs.', difficultyDescription: 'I do not know which pair creates the middle term.', confusionOrGap: 'I do not know which pair creates the middle term.',
  constraints: ['Do not reveal the final answer.', 'Ask one guiding question at a time.'], avoidInstructions: 'Do not reveal the final answer.', helpMode: 'GUIDING_QUESTIONS', selectedLearningMode: 'GUIDING_QUESTIONS',
  desiredFormats: ['ONE_STEP_AT_A_TIME'], sourceRequirements: ['NO_EXTERNAL_SOURCE_NEEDED'], verificationRequirements: ['CHECK_AGAINST_COURSE_NOTES'], academicTermsToPreserve: [],
  privacyStatus: 'NO_OBVIOUS_SENSITIVE_INFORMATION_DETECTED', policyState: 'AI_ALLOWED_FOR_LIMITED_TASKS', studentAttemptRule: 'WAIT_FOR_STUDENT_RESPONSE', assignmentPolicyRevalidated: true,
  academicWorkType: 'HOMEWORK', aiAssistancePermission: 'HINTS_OR_QUESTIONS_ONLY', academicIntegrityStatus: 'READY', successCriteria: 'I can explain why the factor pair works.'
};

const created = Coach.createPromptCoachDraft(input, actor);
assert.deepStrictEqual(Object.keys(created.draft), Coach.PromptCoachDraftSchema);
assert.strictEqual(created.draft.userId, actor.userId);
assert.strictEqual(created.draft.organizationId, actor.tenantId);
assert.strictEqual(created.draft.courseLevel, 'Grade 10');
assert.strictEqual(created.draft.difficultyDescription, input.difficultyDescription);
assert.strictEqual(created.draft.learningMode, 'GUIDING_QUESTIONS');
assert.strictEqual(created.draft.responseFormat, 'ONE_STEP_AT_A_TIME');
assert.strictEqual(created.draft.sourceRequirement, 'NO_EXTERNAL_SOURCE_NEEDED');
assert.strictEqual(created.draft.avoidInstructions, 'Do not reveal the final answer.');
assert.strictEqual(created.draft.privacyCheckStatus, 'NO_OBVIOUS_SENSITIVE_INFORMATION_DETECTED');
assert.strictEqual(created.draft.assignmentPolicyStatus, 'AI_ALLOWED_FOR_LIMITED_TASKS');
assert.strictEqual(created.draft.status, 'SAVED');
assert.ok(created.draft.generatedPrompt);
assert.ok(created.draft.createdAt && created.draft.updatedAt);
assert.strictEqual(created.automaticallySent, false);
assert.strictEqual(Coach.listPromptCoachDrafts(actor).length, 1);
assert.strictEqual(Coach.listPromptCoachDrafts(other).length, 0);
assert.throws(() => Coach.getPromptCoachDraft({ id: created.draft.id }, other), /unavailable/i);

Coach.approvePromptDraft({ promptDraftVersionId: created.draft.id, studentReviewed: true, confirmedPromptText: created.draft.generatedPrompt }, actor);
assert.strictEqual(Coach.getPromptCoachDraft({ id: created.draft.id }, actor).status, 'APPROVED');
Coach.sendApprovedPromptDraft({ idempotencyKey: 'real-data-send', promptDraftVersionId: created.draft.id, explicitSend: true, confirmedPromptText: created.draft.generatedPrompt }, actor);
assert.strictEqual(Coach.getPromptCoachDraft({ id: created.draft.id }, actor).status, 'SENT');

const source = fs.readFileSync(path.join(__dirname, '..', 'prompt-writing-coach.js'), 'utf8');
assert.match(source, /promptCoachDrafts/);
assert.match(source, /promptCoachSessions/);
assert.match(source, /hydratePromptCoachRepository/);
assert.match(source, /upsertPersistentRow\('promptCoachDrafts'/);
assert.doesNotMatch(JSON.stringify(created.draft), /ordinaryLogs|modelTraining|promptScore/);

console.log('Prompt Coach real data tests passed');
