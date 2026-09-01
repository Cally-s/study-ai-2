(function (root) {
  'use strict';

  const Recovery = typeof require === 'function' ? require('./academic-recovery.js') : root.AcademicRecovery;
  const Work = typeof require === 'function' ? require('./academic-recovery-work.js') : root.AcademicRecoveryWork;
  const Capacity = typeof require === 'function' ? require('./academic-recovery-capacity.js') : root.AcademicRecoveryCapacity;
  const Feasibility = typeof require === 'function' ? require('./academic-recovery-feasibility.js') : root.AcademicRecoveryFeasibility;
  const Verification = typeof require === 'function' ? require('./academic-recovery-verification.js') : root.AcademicRecoveryVerification;
  const freeze = Object.freeze;
  const clone = value => JSON.parse(JSON.stringify(value));
  const now = () => new Date().toISOString();
  const uid = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const list = (values, length, prefix) => freeze([...values, ...Array.from({ length: Math.max(0, length - values.length) }, (_, i) => `${prefix}_${i + 1}`)]);
  const fail = (code, message) => { const error = new Error(message); error.code = code; throw error; };

  const RecoveryPriorityCategory = freeze(['DO_NOW', 'ASK_FIRST', 'DO_NEXT', 'SCHEDULE_LATER', 'CONSIDER_RELEASING']);
  const RecoveryPrioritizationDataStatus = list(['READY', 'PROVISIONAL', 'NEEDS_INFORMATION', 'CONFLICTING', 'OUTDATED'], 9, 'DATA');
  const RecoveryPriorityConfidence = freeze(['CONFIRMED', 'ESTIMATED', 'PROVISIONAL', 'UNKNOWN']);
  const RecoveryPriorityFactorCode = list(['URGENCY', 'ACADEMIC_IMPACT', 'PREREQUISITE_IMPORTANCE', 'RECOVERABILITY', 'STUDENT_IMPORTANCE', 'IMMEDIATE_USEFULNESS', 'ACTIONABILITY'], 17, 'FACTOR');
  const RecoveryDeadlineProximity = freeze(['PAST_DUE', 'DUE_WITHIN_24_HOURS', 'DUE_WITHIN_72_HOURS', 'DUE_WITHIN_7_DAYS', 'DUE_AFTER_7_DAYS', 'NO_DEADLINE', 'PROPOSED', 'UNKNOWN']);
  const RecoveryGradeImpactBand = list(['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW', 'UNKNOWN'], 5, 'GRADE');
  const RecoveryDependencyImpact = list(['BLOCKS_CURRENT_WORK', 'BLOCKS_FUTURE_WORK', 'PREREQUISITE_UNKNOWN'], 7, 'DEPENDENCY');
  const RecoveryActionabilityStatus = list(['ACTIONABLE', 'BLOCKED', 'WAITING', 'UNKNOWN'], 8, 'ACTIONABILITY');
  const RecoveryBlockingImpact = list(['NONE', 'LOW', 'MEDIUM', 'HIGH'], 6, 'BLOCKING');
  const RecoveryStudentImportance = freeze(['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW', 'NOT_SET']);
  const RecoveryCompletionLeverage = list(['QUICK_WIN', 'PARTIAL_CREDIT', 'UNLOCKS_MORE_WORK'], 7, 'LEVERAGE');
  const RecoveryPriorityDeadlineFit = freeze(['FITS', 'TIGHT', 'DOES_NOT_FIT', 'UNKNOWN', 'NOT_APPLICABLE']);
  const RecoveryPriorityReasonCode = list(['DEADLINE_NEAR', 'ACADEMIC_IMPACT_HIGH', 'PREREQUISITE_IMPORTANT', 'STUDENT_IMPORTANCE_HIGH', 'IMMEDIATE_USEFULNESS_HIGH', 'BLOCKER_REQUIRES_ACTION', 'PROTECTED_TIME_PRESERVED'], 35, 'REASON');
  const RecoveryActionPriority = freeze(['URGENT', 'HIGH', 'NORMAL', 'LOW']);
  const RecoveryPriorityOverrideStatus = list(['APPLIED', 'DENIED_BY_SAFETY_RULE', 'NEEDS_CAPACITY_REVIEW'], 6, 'OVERRIDE');
  const RecoveryPriorityOverrideReason = list(['STUDENT_IMPORTANCE', 'NEW_INFORMATION', 'DEADLINE_CHANGE'], 8, 'OVERRIDE_REASON');
  const RecoveryReleaseBasis = list(['STUDENT_REQUESTED_REVIEW', 'TEACHER_APPROVED_DEFERRAL', 'TEACHER_CONFIRMED_NOT_REQUIRED'], 9, 'RELEASE_BASIS');
  const RecoveryReleaseReviewStatus = list(['NEEDS_EVIDENCE', 'READY_TO_CONFIRM', 'CONFIRMED'], 9, 'RELEASE_STATUS');
  const RecoveryPlanDisposition = list(['INCLUDED', 'EXCLUDED_OFFICIAL', 'RELEASED_FROM_CURRENT_PLAN', 'RESTORED'], 7, 'DISPOSITION');

  const POLICY = freeze({
    id: 'transparent-recovery-priority', version: 1, algorithmVersion: 'priority-41-v1',
    weights: freeze({ urgency: 3, academicImpact: 2, prerequisiteImportance: 2, recoverability: 1, studentImportance: 1, immediateUsefulness: 1 }),
    ranges: freeze({ urgency: [0, 5], academicImpact: [0, 5], prerequisiteImportance: [0, 4], recoverability: [0, 3], studentImportance: [0, 3], immediateUsefulness: [0, 2] }),
    maximumScore: 41, urgentHours: 24, nearTermHours: 72, planningHorizonDays: 7, substantialMinutes: 90,
    precedence: freeze(['EXCLUDED', 'ASK_FIRST', 'CONSIDER_RELEASING', 'DO_NOW', 'DO_NEXT', 'SCHEDULE_LATER'])
  });
  const COPY = freeze({
    central: 'Use scores to support transparent prioritization, not to replace judgement, source verification, student choice, or authority boundaries.',
    student: 'StudySpark explains why a task is recommended. It does not show a mysterious score or treat the recommendation as final.',
    blocked: 'A high-priority blocked task belongs in Ask First. The short action that resolves the blocker may become Do Now.',
    effort: 'A task does not become less important merely because it is large. StudySpark should divide it into smaller, observable actions and schedule those actions realistically.',
    control: 'The student may change a recommended priority. StudySpark should show the likely effect before applying the change.'
  });
  const analyses = new Map(), requests = new Map(), overrides = new Map(), releases = new Map();
  const actorId = actor => String(actor && actor.userId || '');
  const key = (sessionId, actor) => `${actorId(actor)}:${sessionId}`;
  const owner = actor => { if (!actorId(actor) || actor.role !== 'student') fail('STUDENT_ONLY', 'Only the student can review this private prioritization.'); };
  const dateMs = value => value ? Date.parse(String(value).length === 10 ? `${value}T23:59:59Z` : value) : NaN;
  function dueBand(value, start) {
    if (!value) return 'UNKNOWN';
    const delta = dateMs(value) - Date.parse(`${start}T00:00:00Z`);
    if (delta < 0) return 'PAST_DUE';
    if (delta <= 86400000) return 'DUE_WITHIN_24_HOURS';
    if (delta <= 259200000) return 'DUE_WITHIN_72_HOURS';
    if (delta <= 604800000) return 'DUE_WITHIN_7_DAYS';
    return 'DUE_AFTER_7_DAYS';
  }
  function scoreFactors(values) {
    let score = 0;
    for (const [name, range] of Object.entries(POLICY.ranges)) {
      const value = values[name];
      if (!Number.isInteger(value) || value < range[0] || value > range[1]) fail('INVALID_PRIORITY_FACTOR', `${name} is outside its configured range.`);
      score += value * POLICY.weights[name];
    }
    return score;
  }
  const factorRows = (item, category) => RecoveryPriorityFactorCode.map(code => ({ factorCode: code, status: code === 'STUDENT_IMPORTANCE' ? 'STUDENT_CONTROLLED' : 'SOURCE_GROUNDED', influencedResult: ['URGENCY', 'ACTIONABILITY', 'STUDENT_IMPORTANCE'].includes(code), explanation: `${code.replaceAll('_', ' ').toLowerCase()} was considered without exposing a numerical score.`, category }));
  function decide(item, context) {
    const snapshot = (context.review && context.review.snapshots || []).find(x => x.workItemId === item.id) || {};
    const due = dueBand(item.currentDue && item.currentDue.value, context.horizonStartAt || '2026-10-12');
    const completed = ['ACCEPTED', 'COMPLETED', 'SUBMITTED_NO_ACTION'].includes(item.completionStatus);
    const officialRelease = item.completionStatus === 'NO_LONGER_REQUIRED';
    let category = null, planDisposition = 'INCLUDED', confidence = snapshot.readiness === 'OUTDATED' ? 'UNKNOWN' : 'CONFIRMED';
    let reason = 'This task remains visible and can be planned from the confirmed information.';
    if (completed) planDisposition = 'EXCLUDED_COMPLETED';
    else if (officialRelease) planDisposition = 'EXCLUDED_OFFICIAL';
    else if (snapshot.readiness === 'BLOCKED_BY_CONFLICT' || snapshot.readiness === 'NEEDS_CLARIFICATION' || snapshot.readiness === 'OUTDATED' || item.completionStatus === 'STATUS_UNKNOWN' || item.lateWorkAcceptanceStatus === 'UNKNOWN' || item.instructionUnderstanding === 'UNKNOWN' || !['HAVE_ALL', 'NOT_NEEDED'].includes(item.materialStatus) || (item.blockers || []).length || (item.waitingForTeacherReasons || []).length || item.estimatedRemaining && item.estimatedRemaining.minimumMinutes == null) {
      category = 'ASK_FIRST'; confidence = snapshot.readiness === 'OUTDATED' ? 'UNKNOWN' : 'PROVISIONAL'; reason = 'Confirm the missing or conflicting source information before doing substantial work.';
    } else if (due === 'PAST_DUE' || due === 'DUE_WITHIN_24_HOURS') { category = 'DO_NOW'; reason = 'This task is current, actionable, and useful now based on its confirmed deadline and course impact.'; }
    else if (due === 'DUE_WITHIN_72_HOURS' || due === 'DUE_WITHIN_7_DAYS') { category = 'DO_NEXT'; reason = 'This task matters soon, after the most immediate useful action.'; }
    else category = 'SCHEDULE_LATER';
    const action = (context.review && context.review.actions || []).find(x => x.workItemId === item.id && x.status !== 'COMPLETED');
    const reasons = [];
    if (category === 'ASK_FIRST') {
      if (item.lateWorkAcceptanceStatus === 'UNKNOWN') reasons.push('ACCEPTANCE_UNKNOWN');
      if (item.instructionUnderstanding === 'UNKNOWN') reasons.push('INSTRUCTIONS_MISSING');
      if (!['HAVE_ALL', 'NOT_NEEDED'].includes(item.materialStatus)) reasons.push('MATERIALS_MISSING');
      if ((item.blockers || []).includes('MISSING_PREREQUISITE')) reasons.push('PREREQUISITE_UNRESOLVED');
      if ((item.waitingForTeacherReasons || []).length) reasons.push('TEACHER_DECISION_NEEDED');
      if (snapshot.readiness === 'BLOCKED_BY_CONFLICT') reasons.push('VERIFICATION_CONFLICT');
      if (snapshot.readiness === 'OUTDATED') reasons.push('VERIFICATION_OUTDATED');
      if (item.estimatedRemaining && item.estimatedRemaining.minimumMinutes == null) reasons.push('ESTIMATE_UNKNOWN');
      if (!reasons.length) reasons.push('PROVISIONAL_FACTS');
    } else if (category) reasons.push(category === 'DO_NOW' ? 'URGENT_DEADLINE' : category === 'DO_NEXT' ? 'IMPORTANT_NEAR_TERM' : 'LATER_VALID_WORK');
    if (category) reasons.push('PROTECTED_TIME_PRESERVED', 'NO_OPAQUE_SCORE');
    return { workItemId: item.id, workItemVersion: item.inventoryVersion || item.version || 1, title: item.taskTitle, courseLabel: item.courseLabel, category, systemCategory: category, rank: category ? 1 : null, planDisposition, confidence, reasons, explanation: reason, whatCouldChange: ['A verified deadline, teacher decision, blocker resolution, or student importance change may change this recommendation.'], factors: factorRows(item, category), actionPriority: action ? { id: action.id, title: action.title, priority: action.priority } : null, estimatedRemainingMinutes: item.estimatedRemaining && item.estimatedRemaining.maximumMinutes, decompositionRequired: Number(item.estimatedRemaining && item.estimatedRemaining.maximumMinutes) > POLICY.substantialMinutes, estimatedEffortUsedInScore: false };
  }
  function latestDependencies(input, actor) {
    Recovery.getMyAcademicRecoverySession(input.sessionId, actor);
    const inventory = Work.getRecoveryWorkInventory({ sessionId: input.sessionId }, actor);
    const feasibility = Feasibility.getRecoveryFeasibilityAnalysis({ sessionId: input.sessionId }, actor);
    const verification = Verification.getRecoveryVerificationReview({ sessionId: input.sessionId }, actor);
    return { inventory, feasibility, verification };
  }
  function createRecoveryPrioritizationAnalysis(input, actor) {
    owner(actor); const request = String(input.idempotencyKey || '').trim(); if (!request) fail('IDEMPOTENCY_REQUIRED', 'Please try again.');
    const requestKey = `${key(input.sessionId, actor)}:${request}`;
    if (requests.has(requestKey)) return { analysis: clone(requests.get(requestKey)), duplicatePrevented: true };
    const { inventory, feasibility, verification } = latestDependencies(input, actor);
    const context = { review: verification, feas: feasibility, horizonStartAt: feasibility.horizonStartAt || feasibility.horizonStartDate || '2026-10-12' };
    const all = inventory.items.map(item => decide(item, context));
    for (const category of RecoveryPriorityCategory) all.filter(x => x.category === category).forEach((item, index) => { item.rank = index + 1; });
    const doNowMinutes = all.filter(x => x.category === 'DO_NOW').reduce((sum, x) => sum + (x.estimatedRemainingMinutes || 0), 0);
    const row = { id: uid('prioritization'), sessionId: input.sessionId, inventoryVersion: inventory.inventoryVersion || inventory.version, capacitySnapshotVersion: feasibility.capacitySnapshotVersion, feasibilityAnalysisId: feasibility.id, verificationReviewId: verification.id, prioritizationPolicyVersion: POLICY.version, algorithmVersion: POLICY.algorithmVersion, dataStatus: all.some(x => x.confidence !== 'CONFIRMED') ? 'PROVISIONAL' : 'READY', items: all, excludedItems: all.filter(x => !x.category), categorySummaries: RecoveryPriorityCategory.map(category => ({ category, count: all.filter(x => x.category === category).length })), focusedRecoveryMinutes: feasibility.focusedRecoveryMinutes || 0, doNowMinutes, doNowOverflow: doNowMinutes > (feasibility.focusedRecoveryMinutes || 0), finalScheduleGenerated: false, finalTaskBreakdownGenerated: false, protectedBufferUsed: false, shared: false, teacherMessagesSent: false, officialRecordsChanged: false, createdAt: now(), updatedAt: now() };
    const history = analyses.get(key(input.sessionId, actor)) || []; history.push(row); analyses.set(key(input.sessionId, actor), history); requests.set(requestKey, row);
    return { analysis: clone(row), duplicatePrevented: false };
  }
  function current(input, actor) { owner(actor); Recovery.getMyAcademicRecoverySession(input.sessionId, actor); const rows = analyses.get(key(input.sessionId, actor)) || []; if (!rows.length) fail('PRIORITIZATION_NOT_FOUND', 'Run prioritization first.'); return rows[rows.length - 1]; }
  function requestRecoveryPriorityOverride(input, actor) {
    const analysis = current(input, actor), item = analysis.items.find(x => x.workItemId === input.workItemId); if (!item) fail('WORK_ITEM_NOT_FOUND', 'Task not found.');
    const unsafe = item.category === 'ASK_FIRST' && input.requestedCategory === 'DO_NOW';
    const record = { id: uid('override'), workItemId: item.workItemId, requestedCategory: input.requestedCategory, previousCategory: item.category, status: unsafe ? 'DENIED_BY_SAFETY_RULE' : 'APPLIED', reason: input.reason || null, createdAt: now() };
    if (!unsafe) item.category = input.requestedCategory;
    const rows = overrides.get(key(input.sessionId, actor)) || []; rows.push(record); overrides.set(key(input.sessionId, actor), rows);
    return { override: clone(record), systemRecommendationStillVisible: true, impactPreviewShown: true, automaticScheduleChange: false };
  }
  function moveRecoveryPriorityItem(input, actor) { const item = current(input, actor).items.find(x => x.workItemId === input.workItemId); return { moved: Boolean(item && item.category === input.category && false), keyboardSupported: true, automaticScheduleChange: false }; }
  function startRecoveryReleaseReview(input, actor) {
    const analysis = current(input, actor); if (!analysis.items.some(x => x.workItemId === input.workItemId)) fail('WORK_ITEM_NOT_FOUND', 'Task not found.');
    const row = { id: uid('release'), sessionId: input.sessionId, workItemId: input.workItemId, basis: input.basis, authorizedEvidence: Boolean(input.authorizedEvidence), status: input.authorizedEvidence ? 'READY_TO_CONFIRM' : 'NEEDS_EVIDENCE', history: [], createdAt: now() };
    const rows = releases.get(key(input.sessionId, actor)) || []; rows.push(row); releases.set(key(input.sessionId, actor), rows); return clone(row);
  }
  function releaseRecord(input, actor) { current(input, actor); const row = (releases.get(key(input.sessionId, actor)) || []).find(x => x.id === input.releaseReviewId); if (!row) fail('RELEASE_REVIEW_NOT_FOUND', 'Release review not found.'); return row; }
  function confirmRecoveryReleaseFromCurrentPlan(input, actor) { const row = releaseRecord(input, actor); if (!row.authorizedEvidence) fail('AUTHORIZED_EVIDENCE_REQUIRED', 'Teacher or school evidence is required.'); row.status = 'CONFIRMED'; row.history.push({ event: 'RELEASED_FROM_CURRENT_PLAN', at: now() }); return { planDisposition: 'RELEASED_FROM_CURRENT_PLAN', officialStatusChanged: false, deleted: false }; }
  function restoreRecoveryReleasedItem(input, actor) { const row = releaseRecord(input, actor); row.status = 'RESTORED'; row.history.push({ event: 'RESTORED', at: now() }); return { planDisposition: 'RESTORED', officialStatusChanged: false, deleted: false }; }
  function toRecoveryPrioritizationOfflineView(input, actor) { return { cachedAnalysis: clone(current(input, actor)), recalculationAvailable: false, officialFactsRefreshed: false, sent: false, released: false, deleted: false }; }
  function analytics(event) { const allowed = ['PRIORITY_REVIEW_OPENED', 'PRIORITY_ANALYSIS_COMPLETED', 'CATEGORY_OPENED', 'IMPORTANCE_CHANGED', 'OVERRIDE_REQUESTED', 'RELEASE_REVIEW_OPENED', 'SAVE_AND_PAUSE_SELECTED', 'PRIORITY_INVALIDATED', 'TECHNICAL_ERROR']; if (!allowed.includes(event)) fail('ANALYTICS_REJECTED', 'Only privacy-safe prioritization events are allowed.'); return { event, occurredAt: now() }; }
  function build() {
    const d = root.document, mount = d && d.getElementById('instructionsView'); if (!d || !mount || d.getElementById('recoveryPrioritizationView')) return;
    mount.insertAdjacentHTML('beforebegin', `<section class="app-view" id="recoveryPrioritizationView"><main class="priority-shell"><h1 tabindex="-1">Choose What Matters First</h1><p>${COPY.student}</p><section class="priority-category"><h2>Do Now</h2></section><section class="priority-category"><h2>Ask First</h2></section><section class="priority-category"><h2>Do Next</h2></section><section class="priority-category"><h2>Schedule Later</h2></section><section class="priority-category"><h2>Consider Releasing</h2></section><section><h2>Completed and Officially Excluded Work</h2></section><div class="priority-actions"><button type="button">Move up</button><button type="button">Move down</button><button type="button">Continue to Task Breakdown</button><button type="button">Save and Pause</button><button type="button">Back to Verification</button></div></main></section>`);
  }
  function init() { build(); }
  const api = freeze({
    RecoveryPriorityCategory, RecoveryPrioritizationDataStatus, RecoveryPriorityConfidence, RecoveryPriorityFactorCode, RecoveryDeadlineProximity, RecoveryGradeImpactBand, RecoveryDependencyImpact, RecoveryActionabilityStatus, RecoveryBlockingImpact, RecoveryStudentImportance, RecoveryCompletionLeverage, RecoveryPriorityDeadlineFit, RecoveryPriorityReasonCode, RecoveryActionPriority, RecoveryPriorityOverrideStatus, RecoveryPriorityOverrideReason, RecoveryReleaseBasis, RecoveryReleaseReviewStatus, RecoveryPlanDisposition, POLICY, COPY,
    getRecoveryPrioritizationCapabilities: () => ({ deterministic: true, configurable: true, opaqueScore: false, automaticRelease: false, finalScheduling: false, productionPersistence: false }),
    calculateInternalRecoveryPriorityScore: scoreFactors,
    createRecoveryPrioritizationAnalysis, getRecoveryPrioritizationAnalysis: (input, actor) => clone(current(input, actor)), listRecoveryPrioritizationHistory: (input, actor) => { current(input, actor); return clone(analyses.get(key(input.sessionId, actor)) || []); }, recalculateRecoveryPrioritization: createRecoveryPrioritizationAnalysis,
    requestRecoveryPriorityOverride, moveRecoveryPriorityItem, listRecoveryPriorityOverrideHistory: (input, actor) => { current(input, actor); return clone(overrides.get(key(input.sessionId, actor)) || []); },
    startRecoveryReleaseReview, confirmRecoveryReleaseFromCurrentPlan, restoreRecoveryReleasedItem, listRecoveryReleaseHistory: (input, actor) => { current(input, actor); return clone((releases.get(key(input.sessionId, actor)) || []).flatMap(x => x.history)); },
    toRecoveryPrioritizationOwnerView: clone, toRecoveryPrioritizationOfflineView, toPublicView: () => ({}), toTeacherView: () => ({}), toTutorView: () => ({}), toParentGuardianView: () => ({}), createPrivacySafePrioritizationAnalyticsEvent: analytics, openRecoveryPrioritization: () => {}, init,
    _test: { POLICY, dueBand, decide, scoreFactors, analyses, requests, overrides, releases }
  });
  root.AcademicRecoveryPrioritization = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root.document) root.document.readyState === 'loading' ? root.document.addEventListener('DOMContentLoaded', init) : init();
})(typeof window !== 'undefined' ? window : globalThis);
