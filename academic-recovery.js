(function (root) {
  'use strict';

  const ENTRY_SOURCES = Object.freeze([
    'STUDENT_DASHBOARD', 'ASSIGNMENT_TRACKER', 'STUDY_PLAN', 'AI_COACH', 'CALENDAR',
    'COURSE_PAGE', 'MOBILE_NAVIGATION', 'OVERDUE_TASK_NOTIFICATION',
    'NOTIFICATION_CENTRE', 'HELP_AREA', 'OTHER_APPROVED_SOURCE'
  ]);
  const PLAN_HORIZONS = Object.freeze(['QUICK_RESCUE_24_HOURS', 'FULL_RECOVERY_7_DAYS']);
  const MODES = PLAN_HORIZONS;
  const STATUSES = Object.freeze(['DRAFT', 'MODE_SELECTED', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'ABANDONED', 'ARCHIVED', 'OUTDATED']);
  const CAPABILITY_STATES = Object.freeze(['DISABLED', 'INTERNAL_TESTING', 'LIMITED_ROLLOUT', 'ENABLED']);
  const COPY = Object.freeze({
    action: 'Help Me Catch Up',
    accessibleAction: 'Help Me Catch Up — Build an academic recovery plan',
    title: 'Let’s Choose the Next Achievable Action',
    intro: 'You do not have to solve everything at once. StudySpark will help you identify what matters most, what can wait, and who you may need to contact.',
    central: 'The plan can change. You have not failed. Let’s choose the next achievable action.',
    privacy: 'Nothing will be sent to a teacher, parent, guardian, tutor, or counsellor unless you review it and choose to send it.',
    policy: 'StudySpark cannot guarantee that late work will be accepted or that a deadline will be changed.',
    offline: 'You are offline. Your recovery-plan choice can be saved on this device, but StudySpark needs a connection to review current assignments and build the plan.',
    error: 'StudySpark could not start the recovery plan right now. Your assignments and current work were not changed.'
  });
  const PLANNER_WORKLOAD_ACTIONS = Object.freeze([
    Object.freeze({ id: 'catch-up', source: 'ASSIGNMENT_TRACKER', label: COPY.action, buttonId: 'recoveryAssignmentButton' }),
    Object.freeze({ id: 'adjust-plan', source: 'STUDY_PLAN', label: 'Adjust My Plan', buttonId: 'recoveryStudyPlanButton' })
  ]);
  const MODE_DETAILS = Object.freeze({
    QUICK_RESCUE_24_HOURS: Object.freeze({
      label: 'Quick Rescue', short: 'Help me with the next 24 hours.', action: 'Start Quick Rescue',
      description: 'Focus on the smallest useful action for today. Protect sleep, meals, medical care, school attendance, and essential responsibilities.',
      announcement: 'Quick Rescue selected. This option focuses on the next 24 hours.'
    }),
    FULL_RECOVERY_7_DAYS: Object.freeze({
      label: 'Full Recovery', short: 'Build me a seven-day plan.', action: 'Build My Seven-Day Recovery Plan',
      description: 'Review the next seven days, identify the most important work, decide what may need to wait, and prepare requests for help when needed. Protect sleep and fixed commitments.',
      announcement: 'Full Recovery selected. This option builds a realistic seven-day planning draft.'
    })
  });
  const capabilities = Object.freeze({
    'academicRecovery.enabled': 'ENABLED',
    'academicRecovery.quickRescue': 'ENABLED',
    'academicRecovery.fullRecovery': 'ENABLED',
    'academicRecovery.offlineEntry': 'LIMITED_ROLLOUT',
    'academicRecovery.contextualEntryPoints': 'ENABLED'
  });
  const forbiddenKeys = Object.freeze(['lazinessScore', 'studentFailureLevel', 'motivationScore', 'emotionalWeakness', 'riskOfFailure', 'irresponsibility', 'likelyToSucceed', 'diagnosis', 'depression', 'anxiety', 'burnout', 'homeConflict', 'parentSupportLevel']);
  const memory = new Map();
  const requests = new Map();
  let currentContext = null;
  let assignmentContext = null;
  let selectedMode = null;
  let returnState = null;

  function error(code, message) { const value = new Error(message); value.code = code; throw value; }
  function assertEnum(value, values, code) { if (!values.includes(value)) error(code, 'This recovery option is not available.'); return value; }
  function actorId(actor) { const id = String(actor && actor.userId || '').trim(); if (!id) error('NOT_SIGNED_IN', 'Sign in to use Academic Recovery Mode.'); if (actor.role && actor.role !== 'student') error('STUDENT_ACCESS_REQUIRED', 'Academic Recovery Mode is available from a student account.'); return id; }
  function safeId(value) { return value == null ? null : String(value).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 100) || null; }
  function safeRoute(value) { return value == null ? null : String(value).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80) || null; }
  function now() { return new Date().toISOString(); }
  function uuid(prefix) { return `${prefix}-${root.crypto && root.crypto.randomUUID ? root.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`}`; }
  function validateSource(source) { return assertEnum(source, ENTRY_SOURCES, 'INVALID_ENTRY_SOURCE'); }
  function validateMode(mode) { return assertEnum(mode, PLAN_HORIZONS, 'INVALID_RECOVERY_MODE'); }
  function validateStatus(status) { return assertEnum(status, STATUSES, 'INVALID_SESSION_STATUS'); }
  function validateCapabilityState(state) { return assertEnum(state, CAPABILITY_STATES, 'INVALID_CAPABILITY_STATE'); }
  function validateNoForbiddenFields(value) { const keys = value && typeof value === 'object' ? Object.keys(value) : []; const found = keys.find(key => forbiddenKeys.includes(key)); if (found) error('FORBIDDEN_RECOVERY_FIELD', 'Recovery sessions store academic planning state, not personal judgments or diagnoses.'); return true; }

  function normalizeContext(input) {
    validateNoForbiddenFields(input);
    return Object.freeze({
      entrySource: validateSource(input.entrySource),
      sourceRouteKey: safeRoute(input.sourceRouteKey),
      sourceEntityId: safeId(input.sourceEntityId),
      sourceCourseId: safeId(input.sourceCourseId),
      sourceAssignmentId: safeId(input.sourceAssignmentId),
      sourceStudyPlanId: safeId(input.sourceStudyPlanId),
      sourceConversationId: safeId(input.sourceConversationId),
      sourceCalendarDate: /^\d{4}-\d{2}-\d{2}$/.test(input.sourceCalendarDate || '') ? input.sourceCalendarDate : null,
      sourceContextVersion: safeId(input.sourceContextVersion)
    });
  }
  function sessionKey(userId) { return `studyspark.academicRecovery.v1.${userId}`; }
  function offlineKey(userId) { return `studyspark.academicRecovery.offlineChoice.v1.${userId}`; }
  function readSessions(actor) {
    const userId = actorId(actor);
    if (memory.has(userId)) return memory.get(userId).map(row => ({ ...row }));
    try { const rows = JSON.parse(root.localStorage.getItem(sessionKey(userId)) || '[]'); memory.set(userId, Array.isArray(rows) ? rows : []); } catch { memory.set(userId, []); }
    return memory.get(userId).map(row => ({ ...row }));
  }
  function writeSessions(actor, rows) {
    const userId = actorId(actor), safeRows = rows.map(row => ({ ...row, userId }));
    memory.set(userId, safeRows);
    try { root.localStorage.setItem(sessionKey(userId), JSON.stringify(safeRows)); } catch {}
    return safeRows;
  }
  function activeSessions(actor) { return readSessions(actor).filter(row => ['DRAFT', 'MODE_SELECTED', 'IN_PROGRESS', 'PAUSED', 'OUTDATED'].includes(row.status)); }
  function ownerView(row) { if (!row) return null; const allowed = ['id', 'status', 'planningHorizon', 'selectedMode', 'entrySource', 'sourceRouteKey', 'sourceCourseId', 'sourceAssignmentId', 'sourceStudyPlanId', 'sourceConversationId', 'sourceCalendarDate', 'sourceContextVersion', 'startedAt', 'modeSelectedAt', 'lastActiveAt', 'expiresAt', 'createdAt', 'updatedAt']; return Object.fromEntries(allowed.map(key => [key, row[key] == null ? null : row[key]])); }
  function entryView(context) { const c = normalizeContext(context); return { entrySource: c.entrySource, sourceRouteKey: c.sourceRouteKey, hasCourseContext: Boolean(c.sourceCourseId), hasAssignmentContext: Boolean(c.sourceAssignmentId), hasCalendarContext: Boolean(c.sourceCalendarDate) }; }
  function capabilityView() { return Object.fromEntries(Object.entries(capabilities).map(([key, state]) => [key, validateCapabilityState(state)])); }
  function errorView(value) { return { code: ['NOT_SIGNED_IN', 'STUDENT_ACCESS_REQUIRED', 'INVALID_ENTRY_SOURCE', 'INVALID_RECOVERY_MODE', 'FEATURE_DISABLED', 'OFFLINE'].includes(value && value.code) ? value.code : 'RECOVERY_ENTRY_ERROR', message: value && value.message ? value.message : COPY.error }; }
  function publicView() { return {}; }

  function createSessionDraft(input, actor) {
    const userId = actorId(actor), mode = validateMode(input.planningHorizon || input.selectedMode), context = normalizeContext(input), idempotencyKey = safeId(input.idempotencyKey);
    if (!idempotencyKey) error('IDEMPOTENCY_REQUIRED', 'Please try the action again.');
    const requestKey = `${userId}:${idempotencyKey}`;
    if (requests.has(requestKey)) return { session: ownerView(requests.get(requestKey)), duplicatePrevented: true };
    const existing = activeSessions(actor).find(row => row.selectedMode === mode && row.entrySource === context.entrySource && row.sourceAssignmentId === context.sourceAssignmentId && row.sourceStudyPlanId === context.sourceStudyPlanId);
    if (existing) { requests.set(requestKey, existing); return { session: ownerView(existing), duplicatePrevented: true, reusedExisting: true }; }
    const timestamp = now(), row = { id: uuid('recovery'), userId, organizationId: safeId(actor.organizationId), status: 'MODE_SELECTED', planningHorizon: mode, selectedMode: mode, ...context, startedAt: timestamp, modeSelectedAt: timestamp, lastActiveAt: timestamp, expiresAt: null, createdAt: timestamp, updatedAt: timestamp, prototypeOnly: true };
    writeSessions(actor, [...readSessions(actor), row]); requests.set(requestKey, row);
    return { session: ownerView(row), duplicatePrevented: false };
  }
  function getMySession(sessionId, actor) { const row = readSessions(actor).find(item => item.id === sessionId); if (!row) error('SESSION_NOT_FOUND', 'This recovery plan could not be found.'); return ownerView(row); }
  function updateStatus(sessionId, status, actor) { validateStatus(status); const rows = readSessions(actor), row = rows.find(item => item.id === sessionId); if (!row) error('SESSION_NOT_FOUND', 'This recovery plan could not be found.'); row.status = status; row.lastActiveAt = now(); row.updatedAt = row.lastActiveAt; writeSessions(actor, rows); return ownerView(row); }
  function saveOfflineChoice(mode, context, actor) { const userId = actorId(actor), value = { selectedMode: validateMode(mode), context: normalizeContext(context), savedAt: now(), pendingExplicitContinue: true }; try { root.localStorage.setItem(offlineKey(userId), JSON.stringify(value)); } catch { memory.set(`offline:${userId}`, value); } return { selectedMode: value.selectedMode, savedAt: value.savedAt, pendingExplicitContinue: true }; }
  function removeDeviceData(actor) { const userId = actorId(actor); memory.delete(userId); memory.delete(`offline:${userId}`); try { root.localStorage.removeItem(sessionKey(userId)); root.localStorage.removeItem(offlineKey(userId)); } catch {} return true; }
  function analyticsEvent(name, context) { const allowed = ['RECOVERY_ENTRY_DISPLAYED', 'RECOVERY_ENTRY_OPENED', 'QUICK_RESCUE_SELECTED', 'FULL_RECOVERY_SELECTED', 'ENTRY_SCREEN_EXITED', 'EXISTING_PLAN_RESUMED', 'TECHNICAL_ERROR']; if (!allowed.includes(name)) error('ANALYTICS_EVENT_REJECTED', 'This event is not allowed.'); return { event: name, entrySource: context && ENTRY_SOURCES.includes(context.entrySource) ? context.entrySource : null, occurredAt: now() }; }

  function currentActor() { const candidate = typeof root.user === 'function' ? root.user() : null; return { userId: candidate && candidate.id || '', organizationId: candidate && candidate.organizationId || null, role: 'student' }; }
  function assignmentRows() {
    const candidate = typeof root.user === 'function' ? root.user() : null, rows = [];
    (candidate && candidate.plans || []).forEach(plan => (plan.days || plan.plan || []).forEach((day, index) => rows.push({
      assignmentId: String(day.id || `${plan.id}:${day.dayNumber || index + 1}`), planId: String(plan.id || ''), title: String(day.mainTopic || day.taskType || plan.title || 'Study task'), course: String(plan.course || day.course || ''), dueAt: day.dueDate || day.isoDate || day.date || null, status: day.completed === true || day.status === 'completed' ? 'Completed' : day.status === 'skipped' ? 'Skipped' : 'Not completed', estimatedMinutes: Number(day.estimatedMinutes || 0) || null, completed: day.completed === true || day.status === 'completed', planTitle: String(plan.title || 'Study Plan'), planCompleted: (plan.days || []).filter(item => item.completed === true || item.status === 'completed').length, planTotal: (plan.days || []).length, sourceVersion: String(day.updatedAt || plan.updatedAt || plan.createdAt || 'local')
    })));
    return rows;
  }
  function resolveAssignment(input = {}) {
    const rows = assignmentRows(), exactId = safeId(input.sourceAssignmentId);
    if (exactId) return rows.find(row => safeId(row.assignmentId) === exactId) || null;
    if (safeId(input.sourceStudyPlanId)) return rows.find(row => safeId(row.planId) === safeId(input.sourceStudyPlanId) && !row.completed) || null;
    return rows.filter(row => !row.completed && row.status !== 'Skipped').sort((a, b) => String(a.dueAt || '9999').localeCompare(String(b.dueAt || '9999')))[0] || null;
  }
  function assignmentDate(value) { if (!value) return 'Not recorded'; const date = new Date(value); return Number.isNaN(date.getTime()) ? String(value).slice(0, 60) : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); }
  function safeHTML(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
  function renderAssignmentContext() {
    const node = root.document && root.document.getElementById('academicRecoveryAssignmentContext'); if (!node) return;
    const plan = root.document.getElementById('academicRecoveryAssignmentPlan'); if (plan) { plan.hidden = true; plan.innerHTML = ''; }
    if (!assignmentContext) { node.innerHTML = '<h2>Assignment details are not available</h2><p>Return to the assignment and try again. StudySpark will not invent an assignment, deadline, or progress record.</p>'; return; }
    node.innerHTML = `<div><span class="kicker">SELECTED ASSIGNMENT</span><h2>${safeHTML(assignmentContext.title)}</h2><p>${safeHTML(assignmentContext.course || assignmentContext.planTitle)}</p></div><dl class="recovery-assignment-facts"><div><dt>Due date</dt><dd>${safeHTML(assignmentDate(assignmentContext.dueAt))}</dd></div><div><dt>Status</dt><dd>${safeHTML(assignmentContext.status)}</dd></div><div><dt>Saved estimate</dt><dd>${assignmentContext.estimatedMinutes ? `${assignmentContext.estimatedMinutes} minutes` : 'Not recorded'}</dd></div><div><dt>Plan progress</dt><dd>${assignmentContext.planCompleted} of ${assignmentContext.planTotal} tasks completed</dd></div></dl>`;
  }
  function renderAssignmentRecoveryPlan(session) {
    const node = root.document && root.document.getElementById('academicRecoveryAssignmentPlan'); if (!node || !assignmentContext) return;
    const estimate = assignmentContext.estimatedMinutes ? `The saved estimate is ${assignmentContext.estimatedMinutes} minutes. Treat it as a guide and adjust if the work takes longer.` : 'No time estimate is saved. Review the assignment before deciding how much work fits today.';
    node.hidden = false;
    node.innerHTML = `<span class="kicker">${selectedMode === 'QUICK_RESCUE_24_HOURS' ? 'QUICK RESCUE' : 'SEVEN-DAY RECOVERY'}</span><h2>Your assignment recovery plan</h2><p>${safeHTML(estimate)}</p><ol><li><strong>Review the assignment requirements and materials.</strong><span>Confirm what is required before changing your plan.</span></li><li><strong>Continue the next unfinished part: ${safeHTML(assignmentContext.title)}.</strong><span>Use your own work and record what remains.</span></li><li><strong>Check progress before scheduling more.</strong><span>Your current record shows ${assignmentContext.planCompleted} of ${assignmentContext.planTotal} plan tasks completed.</span></li><li><strong>Ask for clarification when necessary.</strong><span>StudySpark will not promise a deadline change or contact anyone automatically.</span></li></ol><button class="btn btn-primary" type="button" data-recovery-start-assignment="${safeHTML(session.id)}">Start This Recovery Plan</button>`;
  }
  function activeViewKey() { const section = root.document && root.document.querySelector('.app-view.active'); return section ? section.id.replace(/View$/, '') : 'dashboard'; }
  function preserveReturnState(invoker) { returnState = { view: activeViewKey(), invokerId: invoker && invoker.id || null, scrollX: root.scrollX || 0, scrollY: root.scrollY || 0 }; }
  function returnToSource() { const target = returnState; if (target && typeof root.showView === 'function') root.showView(target.view); if (target) root.setTimeout(() => { const el = target.invokerId && root.document.getElementById(target.invokerId); if (el) el.focus(); root.scrollTo(target.scrollX, target.scrollY); }, 30); }
  function setStatus(message, errorState) { const node = root.document && root.document.getElementById('academicRecoveryStatus'); if (node) { node.textContent = message; node.classList.toggle('recovery-error', Boolean(errorState)); } }
  function renderExisting() { const node = root.document && root.document.getElementById('academicRecoveryExisting'); if (!node) return; let rows = []; try { rows = activeSessions(currentActor()).filter(row => !currentContext?.sourceAssignmentId || row.sourceAssignmentId === currentContext.sourceAssignmentId); } catch {} node.hidden = rows.length === 0; node.innerHTML = rows.length ? `<h2>Continue an existing recovery plan</h2><p>Your earlier plan for this assignment is still available. It has not been labelled a failure.</p><div class="recovery-actions"><button class="btn btn-primary" type="button" data-recovery-resume="${rows[0].id}">Continue Recovery Plan</button><button class="btn btn-secondary" type="button" data-recovery-edit="${rows[0].id}">Edit Plan Setup</button><button class="btn btn-secondary" type="button" data-recovery-new>Start a New Recovery Plan</button><button class="btn btn-secondary" type="button" data-recovery-discard="${rows[0].id}">Discard Draft</button></div>` : '';
  }
  function updateSelection(mode) { selectedMode = validateMode(mode); const details = MODE_DETAILS[selectedMode], button = root.document.getElementById('academicRecoveryContinue'); button.disabled = false; button.textContent = details.action; setStatus(details.announcement, false); }
  function startSelected() {
    if (!selectedMode) { setStatus('Choose Quick Rescue or Full Recovery before continuing.', true); root.document.getElementById('academicRecoveryModes').focus(); return; }
    if (root.navigator && root.navigator.onLine === false) { saveOfflineChoice(selectedMode, currentContext, currentActor()); setStatus('Your choice is saved on this device. Continue explicitly after reconnecting to create the private recovery session.', false); return; }
    try { const key = root.crypto && root.crypto.randomUUID ? root.crypto.randomUUID() : `${Date.now()}`; const result = createSessionDraft({ ...currentContext, planningHorizon: selectedMode, idempotencyKey: key }, currentActor()); setStatus(`${MODE_DETAILS[selectedMode].label} draft ready. Review the assignment recovery steps below. Nothing was sent.`, false); renderExisting(); renderAssignmentRecoveryPlan(result.session); root.dispatchEvent && root.dispatchEvent(new CustomEvent('academicrecovery:sessioncreated', { detail: { session: result.session } })); return result; } catch (value) { setStatus(errorView(value).message, true); }
  }
  function openEntry(input, invoker) { currentContext = normalizeContext(input); assignmentContext = input.entrySource === 'ASSIGNMENT_TRACKER' ? resolveAssignment(input) : null; selectedMode = null; preserveReturnState(invoker); if (typeof root.showView === 'function') root.showView('academicRecovery'); const heading = root.document.getElementById('academicRecoveryHeading'), recoveryTitle = input.openAsRecoveryPlan === true ? 'Recovery Plan' : COPY.title; if (heading) { heading.textContent = recoveryTitle; heading.focus(); } const pageTitle = root.document.getElementById('viewTitle'); if (pageTitle) pageTitle.textContent = recoveryTitle; const form = root.document.getElementById('academicRecoveryForm'); if (form) form.reset(); const continueButton = root.document.getElementById('academicRecoveryContinue'); if (continueButton) { continueButton.disabled = true; continueButton.textContent = 'Continue'; } setStatus('', false); renderAssignmentContext(); renderExisting(); return { ...entryView(currentContext), assignmentLoaded: Boolean(assignmentContext) }; }
  function buttonHTML(source, label, id) { const visibleLabel = label || COPY.action, accessibleLabel = visibleLabel === COPY.action ? COPY.accessibleAction : `${visibleLabel} — Review your current study plan`; return `<button class="btn btn-primary academic-recovery-entry" type="button" id="${id}" data-recovery-source="${source}" aria-label="${accessibleLabel}">${visibleLabel}</button>`; }
  function insertAfter(target, html) { if (!target || target.parentElement && target.parentElement.querySelector(':scope > .academic-recovery-entry-card')) return; target.insertAdjacentHTML('afterend', html); }
  function injectSurfaces() {
    const doc = root.document; if (!doc) return;
    const dashboard = doc.querySelector('#dashboardView .view-intro');
    insertAfter(dashboard, `<article class="card academic-recovery-entry-card recovery-prominent"><div><h2>${COPY.action}</h2><p>You do not have to solve everything at once. Build a realistic plan for the next step.</p></div>${buttonHTML('STUDENT_DASHBOARD', COPY.action, 'recoveryDashboardButton')}</article>`);
    const planner = doc.querySelector('#plannerView .view-intro');
    insertAfter(planner, `<article class="card academic-recovery-entry-card"><div><h2>Adjust your workload</h2><p>Review what matters most and choose what can realistically wait. Your current plan will not be overwritten.</p></div><div class="recovery-entry-row">${PLANNER_WORKLOAD_ACTIONS.map(action => buttonHTML(action.source, action.label, action.buttonId)).join('')}</div></article>`);
    const assignmentButton = doc.getElementById('recoveryAssignmentButton'), currentAssignment = resolveAssignment();
    if (assignmentButton && currentAssignment) { assignmentButton.dataset.assignmentId = currentAssignment.assignmentId; assignmentButton.dataset.studyPlanId = currentAssignment.planId; assignmentButton.dataset.courseId = currentAssignment.course; assignmentButton.dataset.contextVersion = currentAssignment.sourceVersion; }
    const coach = doc.querySelector('#coachView .view-intro');
    insertAfter(coach, `<article class="card academic-recovery-entry-card"><div><h2>Need help deciding where to start?</h2><p>Your current conversation and unsent draft will stay here.</p></div>${buttonHTML('AI_COACH', COPY.action, 'recoveryCoachButton')}</article>`);
    const notifications = doc.querySelector('#notificationsView .view-intro');
    insertAfter(notifications, `<article class="card academic-recovery-entry-card"><div><h2>A due date has passed</h2><p>You can review your options and choose the next achievable action. No assignment status will change.</p></div>${buttonHTML('OVERDUE_TASK_NOTIFICATION', COPY.action, 'recoveryNotificationButton')}</article>`);
    const sidebar = doc.querySelector('.app-sidebar .nav-scroll');
    if (sidebar && !doc.getElementById('recoveryMobileNavButton')) sidebar.querySelector('.nav-label')?.insertAdjacentHTML('beforebegin', `<button id="recoveryMobileNavButton" class="academic-recovery-mobile" type="button" data-recovery-source="MOBILE_NAVIGATION" aria-label="${COPY.action}"><span aria-hidden="true">C</span> Catch Up</button>`);
    doc.querySelectorAll('#courseCards .course-card').forEach((card, index) => { if (!card.querySelector('[data-recovery-source="COURSE_PAGE"]')) card.insertAdjacentHTML('beforeend', buttonHTML('COURSE_PAGE', 'Help Me Catch Up in This Course', `recoveryCourseButton${index}`)); });
  }
  function buildView() {
    const doc = root.document, marker = doc && doc.getElementById('instructionsView'); if (!doc || doc.getElementById('academicRecoveryView') || !marker) return;
    marker.insertAdjacentHTML('beforebegin', `<section class="app-view academic-recovery-view" id="academicRecoveryView"><div class="recovery-shell"><header><span class="kicker">ACADEMIC RECOVERY MODE</span><h1 id="academicRecoveryHeading" tabindex="-1">${COPY.title}</h1><p>${COPY.intro}</p></header><p class="recovery-central">${COPY.central}</p><aside class="recovery-notice"><h2>Private and in your control</h2><p>${COPY.privacy}</p></aside><aside class="recovery-notice"><h2>About due dates</h2><p>${COPY.policy}</p></aside><section id="academicRecoveryExisting" class="card" hidden></section><form id="academicRecoveryForm"><fieldset id="academicRecoveryModes" tabindex="-1"><legend>Choose the kind of help you need</legend><label class="recovery-option"><input type="radio" name="recoveryMode" value="QUICK_RESCUE_24_HOURS"><span><strong>Quick Rescue — Help me with the next 24 hours</strong><small>${MODE_DETAILS.QUICK_RESCUE_24_HOURS.description}</small></span></label><label class="recovery-option"><input type="radio" name="recoveryMode" value="FULL_RECOVERY_7_DAYS"><span><strong>Full Recovery — Build me a seven-day plan</strong><small>${MODE_DETAILS.FULL_RECOVERY_7_DAYS.description}</small></span></label></fieldset><div id="academicRecoveryOffline" class="recovery-notice" hidden><h2>Offline</h2><p>${COPY.offline}</p></div><p id="academicRecoveryStatus" class="recovery-status" role="status" aria-live="polite"></p><div class="recovery-actions"><button id="academicRecoveryContinue" class="btn btn-primary" type="submit" disabled>Continue</button><button class="btn btn-secondary" type="button" data-recovery-return>Not Now</button><button class="btn btn-secondary" type="button" data-recovery-return>Return to Previous Page</button><button class="btn btn-secondary" type="button" id="academicRecoveryHelp">Learn How Recovery Plans Work</button></div></form><section class="card recovery-help" id="academicRecoveryHelpPanel" tabindex="-1" hidden><h2>How recovery plans work</h2><p>Quick Rescue focuses on one or a few useful actions in the next 24 hours. Full Recovery prepares a realistic seven-day planning draft. Some work may need to wait, and asking a person for help may be the next useful action.</p><p>Neither option promises a grade change, deadline extension, or completion of every task.</p><button class="btn btn-secondary" id="academicRecoveryHelpClose" type="button">Close help</button></section></div></section>`);
    const shell = doc.querySelector('#academicRecoveryView .recovery-shell'), header = shell && shell.querySelector('header'), form = doc.getElementById('academicRecoveryForm');
    if (shell && header && !doc.getElementById('academicRecoveryAssignmentContext')) { const panel = doc.createElement('section'); panel.id = 'academicRecoveryAssignmentContext'; panel.className = 'card recovery-assignment-context'; panel.setAttribute('aria-live', 'polite'); header.after(panel); }
    if (shell && form && !doc.getElementById('academicRecoveryAssignmentPlan')) { const plan = doc.createElement('section'); plan.id = 'academicRecoveryAssignmentPlan'; plan.className = 'card recovery-assignment-plan'; plan.hidden = true; form.after(plan); }
  }
  function bindUI() {
    const doc = root.document; if (!doc) return;
    doc.addEventListener('click', event => { const button = event.target.closest('[data-recovery-source]'); if (!button) return; event.preventDefault(); openEntry({ entrySource: button.dataset.recoverySource, sourceRouteKey: activeViewKey(), sourceCourseId: button.dataset.courseId || null, sourceAssignmentId: button.dataset.assignmentId || null, sourceStudyPlanId: button.dataset.studyPlanId || null, sourceContextVersion: button.dataset.contextVersion || null }, button); });
    doc.getElementById('academicRecoveryForm')?.addEventListener('change', event => { if (event.target.name === 'recoveryMode') updateSelection(event.target.value); });
    doc.getElementById('academicRecoveryForm')?.addEventListener('submit', event => { event.preventDefault(); startSelected(); });
    doc.querySelectorAll('[data-recovery-return]').forEach(button => button.addEventListener('click', returnToSource));
    const help = doc.getElementById('academicRecoveryHelpPanel'), helpButton = doc.getElementById('academicRecoveryHelp'), helpClose = doc.getElementById('academicRecoveryHelpClose');
    helpButton?.addEventListener('click', () => { help.hidden = false; help.focus(); }); helpClose?.addEventListener('click', () => { help.hidden = true; helpButton.focus(); });
    doc.addEventListener('click', event => { const resume = event.target.closest('[data-recovery-resume]'); if (resume) { const session = getMySession(resume.dataset.recoveryResume, currentActor()); selectedMode = session.planningHorizon; const option = doc.querySelector(`[name="recoveryMode"][value="${selectedMode}"]`); if (option) option.checked = true; const continueButton = doc.getElementById('academicRecoveryContinue'); if (continueButton) { continueButton.disabled = false; continueButton.textContent = 'Update Recovery Plan'; } renderAssignmentRecoveryPlan(session); setStatus('Existing recovery plan opened. No new plan or assignment record was created.', false); analyticsEvent('EXISTING_PLAN_RESUMED', currentContext); } const edit = event.target.closest('[data-recovery-edit]'); if (edit) { const session = getMySession(edit.dataset.recoveryEdit, currentActor()); updateSelection(session.planningHorizon); doc.getElementById('academicRecoveryModes')?.focus(); setStatus('Review the plan type, then select Update Recovery Plan to save your choice.', false); } const fresh = event.target.closest('[data-recovery-new]'); if (fresh) { selectedMode = null; doc.getElementById('academicRecoveryForm').reset(); doc.getElementById('academicRecoveryContinue').disabled = true; setStatus('Choose a mode to start a separate recovery draft.', false); } const discard = event.target.closest('[data-recovery-discard]'); if (discard && root.confirm('Discard this recovery draft? Your assignments and other work will not change.')) { updateStatus(discard.dataset.recoveryDiscard, 'ABANDONED', currentActor()); renderExisting(); setStatus('Recovery draft discarded. Your other work was not changed.', false); } });
    doc.addEventListener('click', event => { const start = event.target.closest('[data-recovery-start-assignment]'); if (!start) return; const session = updateStatus(start.dataset.recoveryStartAssignment, 'IN_PROGRESS', currentActor()); start.disabled = true; start.textContent = 'Recovery Plan Started'; setStatus(`Recovery plan started for ${assignmentContext ? assignmentContext.title : 'the selected assignment'}. Your assignment status was not changed.`, false); root.dispatchEvent && root.dispatchEvent(new CustomEvent('academicrecovery:assignmentstarted', { detail: { sessionId: session.id, assignmentId: session.sourceAssignmentId } })); });
    root.addEventListener('online', () => { const offline = doc.getElementById('academicRecoveryOffline'); if (offline) offline.hidden = true; });
    root.addEventListener('offline', () => { const offline = doc.getElementById('academicRecoveryOffline'); if (offline) offline.hidden = false; });
  }
  function init() { buildView(); injectSurfaces(); bindUI(); const offline = root.document && root.document.getElementById('academicRecoveryOffline'); if (offline) offline.hidden = !(root.navigator && root.navigator.onLine === false); if (root.MutationObserver) new root.MutationObserver(injectSurfaces).observe(root.document.body, { childList: true, subtree: true }); }

  const api = Object.freeze({
    AcademicRecoveryEntrySource: ENTRY_SOURCES, RecoveryPlanHorizon: PLAN_HORIZONS, AcademicRecoveryMode: PLAN_HORIZONS, AcademicRecoverySessionStatus: STATUSES, AcademicRecoveryCapabilityState: CAPABILITY_STATES,
    COPY, MODE_DETAILS, PLANNER_WORKLOAD_ACTIONS, capabilities, validateRecoveryEntrySource: validateSource, validateRecoveryMode: validateMode, validateRecoverySessionStatus: validateStatus,
    getAcademicRecoveryCapabilities: capabilityView, getAcademicRecoveryEntryCapabilities: capabilityView, getAcademicRecoveryContextCapabilities: capabilityView,
    getAuthorizedRecoveryEntryContext: normalizeContext, validateRecoverySourceEntity: normalizeContext,
    createAcademicRecoverySessionDraft: createSessionDraft, getMyAcademicRecoverySession: getMySession, listMyActiveAcademicRecoverySessions: activeSessions,
    selectAcademicRecoveryMode: validateMode, resumeAcademicRecoverySession: (id, actor) => updateStatus(id, 'IN_PROGRESS', actor), pauseAcademicRecoverySession: (id, actor) => updateStatus(id, 'PAUSED', actor), abandonAcademicRecoverySession: (id, actor) => updateStatus(id, 'ABANDONED', actor), archiveAcademicRecoverySession: (id, actor) => updateStatus(id, 'ARCHIVED', actor),
    toAcademicRecoveryEntryView: entryView, toAcademicRecoverySessionOwnerView: ownerView, toAcademicRecoveryContextView: entryView, toAcademicRecoveryResumeView: ownerView, toAcademicRecoveryCapabilityView: capabilityView, toAcademicRecoveryErrorView: errorView, toPublicView: publicView,
    saveOfflineRecoveryChoice: saveOfflineChoice, removeRecoveryDataFromDevice: removeDeviceData, createPrivacySafeRecoveryAnalyticsEvent: analyticsEvent,
    openAcademicRecovery: openEntry, init, _test: { normalizeContext, validateNoForbiddenFields, readSessions, writeSessions, activeSessions, assignmentRows, resolveAssignment, memory, requests }
  });
  root.AcademicRecovery = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root.document) root.document.readyState === 'loading' ? root.document.addEventListener('DOMContentLoaded', init) : init();
})(typeof window !== 'undefined' ? window : globalThis);
