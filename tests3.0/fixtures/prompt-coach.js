'use strict';

let sequence = 0;
const unique = (label) => `${label}-${Date.now()}-${++sequence}`;

function student(overrides = {}) {
  return {
    userId: unique('prompt-coach-student'),
    tenantId: unique('prompt-coach-school'),
    role: 'student',
    ...overrides
  };
}

const policies = Object.freeze({
  known: { academicWorkType: 'HOMEWORK', aiAssistancePermission: 'HINTS_OR_QUESTIONS_ONLY', academicIntegrityStatus: 'READY', policyState: 'AI_ALLOWED_FOR_LIMITED_TASKS', assignmentPolicyRevalidated: true },
  unknown: { academicWorkType: 'NOT_SURE', aiAssistancePermission: 'NOT_SURE', academicIntegrityStatus: 'REVIEW_REQUIRED', policyState: 'POLICY_UNKNOWN', assignmentPolicyRevalidated: false },
  prohibited: { academicWorkType: 'HOMEWORK', aiAssistancePermission: 'AI_NOT_PERMITTED', academicIntegrityStatus: 'BLOCKED', policyState: 'AI_NOT_ALLOWED', assignmentPolicyRevalidated: true },
  disclosureRequired: { academicWorkType: 'DRAFT_ASSIGNMENT', aiAssistancePermission: 'GENERAL_LEARNING_SUPPORT', academicIntegrityStatus: 'READY', policyState: 'AI_ALLOWED_WITH_DISCLOSURE', assignmentPolicyRevalidated: true },
  activeTest: { academicWorkType: 'QUIZ_OR_TEST', aiAssistancePermission: 'NOT_SURE', academicIntegrityStatus: 'REVIEW_REQUIRED', policyState: 'ACTIVE_ASSESSMENT_RESTRICTED', assignmentPolicyRevalidated: false }
});

const preferences = Object.freeze({
  bilingual: { explanationMode: 'BILINGUAL_SIDE_BY_SIDE', primaryExplanationLanguageCode: 'en', secondaryExplanationLanguageCode: 'fr-CA' },
  highContrast: { highContrastMode: 'ENABLED' },
  reducedMotion: { reducedMotionPreference: 'ENABLED' },
  lowBandwidth: { lowBandwidthPreference: 'ENABLED' }
});

function draftInput(sessionId, overrides = {}) {
  return {
    idempotencyKey: unique('prompt-draft'),
    promptCoachSessionId: sessionId,
    title: 'Factoring help prompt',
    subject: 'Mathematics',
    courseLevel: 'Grade 10',
    goal: 'Understand how the middle term helps me factor a quadratic.',
    context: 'Grade 10 Mathematics',
    currentUnderstanding: 'I can list factor pairs for the constant term.',
    confusionOrGap: 'I am unsure which pair creates the middle term.',
    difficultyDescription: 'I am unsure which pair creates the middle term.',
    constraints: ['Do not give me the final answer.', 'Ask one question at a time.'],
    avoidInstructions: 'Do not give me the final answer.',
    helpMode: 'GUIDING_QUESTIONS',
    selectedLearningMode: 'GUIDING_QUESTIONS',
    learningModeInstruction: 'Ask me one guiding question at a time and wait for my response.',
    desiredFormats: ['ONE_STEP_AT_A_TIME'],
    academicTermsToPreserve: [],
    sourceRequirements: ['NO_EXTERNAL_SOURCE_NEEDED'],
    verificationRequirements: ['CHECK_AGAINST_COURSE_NOTES'],
    privacyStatus: 'NO_OBVIOUS_SENSITIVE_INFORMATION_DETECTED',
    studentAttemptRule: 'WAIT_FOR_STUDENT_RESPONSE',
    successCriteria: 'I can explain why a factor pair works.',
    ...policies.known,
    ...overrides
  };
}

function sessionInput(overrides = {}) {
  return { idempotencyKey: unique('prompt-session'), fictionalTask: false, ...overrides };
}

const records = Object.freeze({
  noPrompts: { sessions: [], drafts: [], recentPrompts: [], savedPrompts: [] },
  activeDraft: { status: 'SAVED', currentPromptVersionId: 'fixture-active-draft' },
  savedPrompts: [{ id: 'fixture-saved-prompt', status: 'SAVED', favourite: true }],
  recentPrompts: [{ id: 'fixture-recent-prompt', status: 'SENT', lastUsedAt: '2026-08-24T12:00:00.000Z' }],
  improvementSession: { original: 'do my math', suggestionsReviewed: true, approved: false },
  offlineDraft: { id: 'fixture-offline-draft', pendingSync: true, generatedPrompt: 'Help me understand factoring.' },
  synchronizationConflict: { id: 'fixture-conflict-draft', localVersion: 2, remoteVersion: 2, resolution: 'STUDENT_REVIEW_REQUIRED' }
});

module.exports = { unique, student, policies, preferences, draftInput, sessionInput, records };
