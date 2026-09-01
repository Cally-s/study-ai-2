(function(root){
  'use strict';

  const STORAGE_KEY = 'studyspark.coach.response.workspace.v1';
  const DRAFT_KEY = 'studyspark.coach.response.workspace.drafts.v1';
  const UNAVAILABLE = 'Available after the AI creates a response.';
  const LOAD_ERROR = 'We could not load this part of your AI Coach response. Your saved work has not been deleted.';

  const pages = [
    {view:'coachResponsePage',key:'response',title:'AI Response',description:"Review the AI Coach’s complete response and understand how it was produced.",button:'Open Response',cardTitle:'AI Response',cardDescription:'Read the full response and see which learning mode was used.',icon:'R'},
    {view:'coachEvidencePage',key:'evidence',title:'Evidence and Trust',description:'Examine the sources, confidence, and assumptions behind the AI response.',button:'Check Evidence',cardTitle:'Evidence and Trust',cardDescription:'Review sources, confidence, assumptions, and factual support.',icon:'E'},
    {view:'coachVerificationPage',key:'verification',title:'What to Verify',description:'Complete specific checks before relying on the AI response.',button:'Start Verification',cardTitle:'Verification Plan',cardDescription:'Complete specific checks and record what was confirmed or unresolved.',icon:'✓'},
    {view:'coachReflectionPage',key:'reflection',title:'Thinking and Reflection',description:'Apply the idea yourself instead of accepting the AI response automatically.',button:'Reflect on My Learning',cardTitle:'Thinking and Reflection',cardDescription:'Answer the thinking question and explain the idea in your own words.',icon:'?'},
    {view:'coachRetryPage',key:'retry',title:'Independent Retry',description:'Try a new equivalent question without substantive AI hints.',button:'Start Independent Retry',cardTitle:'Independent Retry',cardDescription:'Try a new equivalent question without substantive AI hints.',icon:'↻'},
    {view:'coachContributionPage',key:'contribution',title:'Student Contribution',description:'Record the parts of the work that came from your own thinking, evidence, decisions, writing, and revision.',button:'View My Contribution',cardTitle:'Student Contribution',cardDescription:'Record your ideas, decisions, evidence, writing, and revisions.',icon:'S'},
    {view:'coachAIUsePage',key:'ai-use',title:'AI Use and Disclosure',description:'Review how AI supported the work and decide what should be disclosed or saved.',button:'Review AI Use',cardTitle:'AI Use and Disclosure',cardDescription:'Review the AI contribution and create an AI Use Receipt when appropriate.',icon:'AI'}
  ];

  const verificationStatuses = ['Not Checked','Confirmed','Partly Confirmed','Contradicted','Still Unresolved','Not Applicable'];
  const contributionStatuses = ['Not Started','In Progress','Completed','Needs Review'];
  const contributionCheckpoints = [
    ['Task Understanding','What is the assignment or learning task asking you to do?'],
    ['Initial Thinking','What did you think before asking AI?'],
    ['Research Question or Goal','What question, goal, or success criterion guided your work?'],
    ['Evidence Selection','Which evidence, examples, or sources did you choose and why?'],
    ['Planning Decisions','What order, strategy, or design choices did you make?'],
    ['Student Draft or Solution','What did you write, calculate, build, or decide yourself?'],
    ['AI Feedback Considered','Which AI suggestions did you consider, reject, or revise?'],
    ['Student Revisions','What did you change after review or feedback?'],
    ['Final Verification and Reflection','How did you check the work and what did you learn?']
  ];

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function escapeHTML(value){
    return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }

  function sentence(value, limit = 260){
    const text = String(value || '').replace(/\s+/g,' ').trim();
    if(text.length <= limit)return text;
    return `${text.slice(0, limit - 1).trim()}…`;
  }

  function currentMode(){
    const select = $('#learningModeSelector');
    const label = select?.selectedOptions?.[0]?.textContent?.trim() || 'Guided Support';
    return {label, value: select?.value || 'GUIDED_SUPPORT'};
  }

  function latestCoachResponseFromDom(){
    const userMessages = $$('#chatMessages .message.user');
    if(userMessages.length === 0)return null;
    const aiMessages = $$('#chatMessages .message.ai');
    const latestAI = aiMessages[aiMessages.length - 1];
    if(!latestAI)return null;
    const responseText = latestAI.querySelector('p')?.textContent?.trim() || latestAI.textContent?.replace('StudySpark Coach','').trim() || '';
    const latestUser = userMessages[userMessages.length - 1];
    const studentQuestion = latestUser?.querySelector('p')?.textContent?.trim() || latestUser?.textContent?.trim() || '';
    if(!responseText)return null;
    return {responseText, studentQuestion};
  }

  function loadRecord(){
    try{return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')}catch{return null}
  }

  function saveRecord(record){
    try{localStorage.setItem(STORAGE_KEY, JSON.stringify(record))}catch{}
  }

  function loadDrafts(){
    try{return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}')}catch{return {}}
  }

  function saveDrafts(drafts){
    try{localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts))}catch{}
  }

  function buildRecord(){
    const domResponse = latestCoachResponseFromDom();
    const existing = loadRecord();
    if(!domResponse)return existing;
    if(existing && existing.responseText === domResponse.responseText && existing.studentQuestion === domResponse.studentQuestion)return existing;
    const mode = currentMode();
    const now = new Date().toISOString();
    const record = {
      sessionId: 'current-session',
      sessionTitle: 'Current AI Coach Session',
      assignmentName: 'No assignment selected',
      mode,
      responseStatus: 'Response ready',
      lastSaved: now,
      studentQuestion: domResponse.studentQuestion,
      responseText: domResponse.responseText,
      responseSummary: sentence(domResponse.responseText, 320),
      sources: [],
      sourceStatus: 'No external sources were attached to this response.',
      confidenceLevel: 'Not Applicable',
      confidenceReason: 'Confidence is not calculated until sources, assignment context, or verified evidence are connected.',
      assumptions: [
        {id:'course-context',text:'The response assumes the question is for regular learning support, not an active test.'},
        {id:'student-control',text:'The response assumes you will revise, verify, and explain the idea in your own words.'},
        {id:'source-limits',text:'The response assumes no external source is required unless the task asks for factual citation.'}
      ],
      verificationSteps: [
        {id:'instructions',text:'Compare the response with your teacher’s instructions or rubric.',status:'Not Checked'},
        {id:'facts',text:'Check any factual claim against a trusted class source or source-verification tool.',status:'Not Checked'},
        {id:'reasoning',text:'Find the first step you can explain independently without copying the AI wording.',status:'Not Checked'}
      ],
      studentThinkingQuestion: 'What is one part of this response you can test, explain, or improve in your own words?',
      disclosureSuggestion: 'Use an AI Use Receipt if this response influenced submitted school work.',
      finalAnswerWithheld: mode.value === 'NO_FINAL_ANSWER' || /final answer/i.test(mode.label),
      warnings: []
    };
    saveRecord(record);
    return record;
  }

  function updateRecord(updater){
    const record = buildRecord() || loadRecord();
    if(!record)return null;
    const next = updater(record) || record;
    next.lastSaved = new Date().toISOString();
    saveRecord(next);
    return next;
  }

  function formatDate(value){
    if(!value)return 'Not saved yet';
    try{return new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(value))}catch{return 'Saved'}
  }

  function statusState(status){
    if(!status || status === UNAVAILABLE)return 'unavailable';
    if(/waiting/i.test(status))return 'waiting';
    if(/needs/i.test(status))return 'needs-input';
    return 'ready';
  }

  function workspaceStatus(page, record){
    if(!record)return UNAVAILABLE;
    if(page.key === 'response')return 'Ready';
    if(page.key === 'evidence')return record.sources?.length ? `${record.sources.length} Sources Available` : 'No Sources Attached';
    if(page.key === 'verification'){
      const remaining = (record.verificationSteps || []).filter(step => step.status === 'Not Checked' || !step.status).length;
      return remaining ? `${remaining} Checks Remaining` : 'Completed';
    }
    if(page.key === 'reflection')return loadDrafts().reflectionSubmitted ? 'Completed' : 'Needs Your Input';
    if(page.key === 'retry')return 'Ready';
    if(page.key === 'contribution')return 'Needs Your Input';
    return 'Ready';
  }

  function showViewSafe(view){
    if(typeof root.showView === 'function')root.showView(view);
    else location.hash = `#/${view}`;
    setTimeout(renderAll, 0);
  }

  function ensureWorkspace(){
    const form = $('#coachForm');
    if(!form)return null;
    $$('#standardAIResponseCard,#studentContributionCheckpoints').forEach(node => node.remove());
    let host = $('#coachResponseWorkspace');
    if(!host){
      host = document.createElement('section');
      host.id = 'coachResponseWorkspace';
      host.className = 'coach-response-workspace';
      host.setAttribute('aria-labelledby','coachResponseWorkspaceTitle');
    }
    const responseTools = $('#coachView .ai-accessibility-commands[data-coach-response-tools-active]');
    const anchor = responseTools || form;
    if(anchor.nextElementSibling !== host)anchor.insertAdjacentElement('afterend', host);
    return host;
  }

  function renderWorkspace(){
    const host = ensureWorkspace();
    if(!host)return;
    const record = buildRecord();
    if(!record){
      host.innerHTML = `
        <div class="coach-response-workspace__empty">
          <span class="coach-mini-label">Response Workspace</span>
          <h3 id="coachResponseWorkspaceTitle">Explore Your Response</h3>
          <p>Open one learning tool at a time so you can review the response, check its evidence, practise the skill, and document your own contribution.</p>
          <p>${UNAVAILABLE}</p>
          <button class="btn btn-primary" type="button" data-coach-focus-composer>Ask StudySpark Coach</button>
        </div>`;
      return;
    }

    const cards = pages.map(page => {
      const status = workspaceStatus(page, record);
      return `
        <button class="coach-workspace-card" type="button" data-coach-view="${page.view}" aria-describedby="${page.view}-description ${page.view}-status">
          <span class="coach-workspace-card__icon" aria-hidden="true">${escapeHTML(page.icon)}</span>
          <span class="coach-workspace-card__title">${escapeHTML(page.cardTitle)}</span>
          <span id="${page.view}-description" class="coach-workspace-card__description">${escapeHTML(page.cardDescription)}</span>
          <span id="${page.view}-status" class="coach-status-pill" data-state="${statusState(status)}">${escapeHTML(status)}</span>
          <span class="btn btn-secondary" aria-hidden="true">${escapeHTML(page.button)} →</span>
        </button>`;
    }).join('');

    host.innerHTML = `
      <div class="coach-response-workspace__preview">
        <div class="coach-response-workspace__preview-head">
          <div>
            <span class="coach-mini-label">Quick Response Preview</span>
            <h3 id="coachResponseWorkspaceTitle">Quick Response Preview</h3>
            <p>Use the preview to decide which response workspace to open next.</p>
          </div>
          <button class="btn btn-primary" type="button" data-coach-view="coachResponsePage">Open Full Response</button>
        </div>
        <p class="coach-response-excerpt">${escapeHTML(record.responseSummary)}</p>
        <div class="coach-response-meta-grid" aria-label="Current response summary">
          <div class="coach-response-meta"><span>Learning Mode</span><strong>${escapeHTML(record.mode.label)}</strong></div>
          <div class="coach-response-meta"><span>Confidence</span><strong>${escapeHTML(record.confidenceLevel)}</strong></div>
          <div class="coach-response-meta"><span>Sources</span><strong>${record.sources.length} source${record.sources.length === 1 ? '' : 's'}</strong></div>
          <div class="coach-response-meta"><span>Verification</span><strong>${record.verificationSteps.length} step${record.verificationSteps.length === 1 ? '' : 's'}</strong></div>
        </div>
        <div class="coach-page-text-block"><strong>Next thinking question:</strong> ${escapeHTML(record.studentThinkingQuestion)}</div>
      </div>
      <div class="coach-response-workspace__explore">
        <div class="coach-response-workspace__section-head">
          <div>
            <span class="coach-mini-label">Response Workspace</span>
            <h3>Explore Your Response</h3>
            <p>Open one learning tool at a time so you can review the response, check its evidence, practise the skill, and document your own contribution.</p>
          </div>
        </div>
        <div class="coach-workspace-card-grid">${cards}</div>
      </div>`;
  }

  function pageByView(view){
    return pages.find(page => page.view === view);
  }

  function activeView(){
    const id = $('.app-view.active')?.id || '';
    return id.endsWith('View') ? id.slice(0,-4) : null;
  }

  function sharedHeader(page, record){
    const mode = record?.mode?.label || currentMode().label;
    const status = record?.responseStatus || 'Waiting for Response';
    return `
      <main class="coach-response-page__inner" aria-labelledby="${page.view}-title">
        <header class="coach-session-header">
          <div class="coach-session-crumbs" aria-label="Breadcrumb">AI Coach / ${escapeHTML(record?.sessionTitle || 'Current Session')} / ${escapeHTML(page.title)}</div>
          <div class="coach-session-title-row">
            <button class="btn btn-secondary coach-back-arrow" type="button" aria-label="Back to Coach" data-coach-view="coach">←</button>
            <div>
              <span class="coach-mini-label">AI Coach Workspace</span>
              <h1 id="${page.view}-title">${escapeHTML(page.title)}</h1>
              <p>${escapeHTML(page.description)}</p>
            </div>
          </div>
          <div class="coach-session-facts" aria-label="Session details">
            <span>AI Coach</span>
            <span>${escapeHTML(record?.assignmentName || 'No assignment selected')}</span>
            <span>${escapeHTML(mode)}</span>
            <span>${escapeHTML(status)}</span>
            <span>Last saved: ${escapeHTML(formatDate(record?.lastSaved))}</span>
          </div>
        </header>`;
  }

  function emptyPage(page){
    return `${sharedHeader(page, null)}
      <section class="coach-page-empty" role="status">
        <h2>${UNAVAILABLE}</h2>
        <p>Send a question in StudySpark Coach first, then return here to work with the response.</p>
        <button class="btn btn-primary" type="button" data-coach-view="coach">Back to Coach</button>
      </section>
    </main>`;
  }

  function bottomNav(view){
    const index = pages.findIndex(page => page.view === view);
    const prev = index > 0 ? pages[index - 1] : null;
    const next = index < pages.length - 1 ? pages[index + 1] : null;
    return `
      <nav class="coach-page-nav" aria-label="AI Coach response pages">
        <div>${prev ? `<button class="btn btn-secondary" type="button" data-coach-view="${prev.view}">← ${escapeHTML(prev.title)}</button>` : `<button class="btn btn-secondary" type="button" data-coach-view="coach">Back to Coach</button>`}</div>
        <div>${next ? `<button class="btn btn-primary" type="button" data-coach-view="${next.view}">${escapeHTML(next.title)} →</button>` : `<button class="btn btn-primary" type="button" data-coach-view="coach">Return to Coach</button>`}</div>
      </nav>`;
  }

  function renderResponse(record, page){
    return `${sharedHeader(page, record)}
      <div class="coach-page-grid coach-page-two-column">
        <section class="coach-response-page__card">
          <div class="coach-page-card-head"><div><span class="coach-page-icon" aria-hidden="true">R</span><h2>Full Response</h2></div></div>
          <div class="coach-page-text-block">${escapeHTML(record.responseText)}</div>
        </section>
        <aside class="coach-response-page__card">
          <h2>Learning Mode</h2>
          <p><strong>${escapeHTML(record.mode.label)}</strong></p>
          <p>This mode shapes the response so it supports learning without replacing your own thinking.</p>
          <h2>Response Basis</h2>
          <p>${escapeHTML(record.confidenceReason)}</p>
          <h2>Next Action</h2>
          <button class="btn btn-primary" type="button" data-coach-view="coachEvidencePage">Check Evidence</button>
        </aside>
      </div>${bottomNav(page.view)}</main>`;
  }

  function renderEvidence(record, page){
    const sources = record.sources.length ? record.sources.map(source => `<li><strong>${escapeHTML(source.title)}</strong><p>${escapeHTML(source.detail)}</p></li>`).join('') : `<li>No source was provided with this response.</li><li>Unverified source claims should be checked before you rely on them.</li>`;
    const assumptions = record.assumptions.map(item => `
      <article class="coach-assumption-card">
        <h3>${escapeHTML(item.text)}</h3>
        <div class="coach-action-row">
          <button class="btn btn-secondary" type="button" data-assumption="${item.id}" data-assumption-action="correct">This Is Correct</button>
          <button class="btn btn-secondary" type="button" data-assumption="${item.id}" data-assumption-action="incorrect">This Is Incorrect</button>
          <button class="btn btn-secondary" type="button" data-assumption="${item.id}" data-assumption-action="context">Add Missing Context</button>
          <button class="btn btn-primary" type="button" data-coach-view="coachResponsePage">Update Response</button>
        </div>
      </article>`).join('');
    return `${sharedHeader(page, record)}
      <div class="coach-page-grid">
        <section class="coach-response-page__card">
          <h2>Sources</h2>
          <ul class="coach-page-list">${sources}</ul>
        </section>
        <section class="coach-response-page__card">
          <h2>Confidence and Reason</h2>
          <p><strong>${escapeHTML(record.confidenceLevel)}</strong></p>
          <p>${escapeHTML(record.confidenceReason)}</p>
          <p class="coach-notice">Confidence describes the strength of the available support. It does not guarantee that the answer is correct.</p>
        </section>
        <section class="coach-response-page__card">
          <h2>Assumptions</h2>
          <div class="coach-page-grid">${assumptions}</div>
        </section>
        <div class="coach-page-actions">
          <button class="btn btn-secondary" type="button" data-coach-view="coachResponsePage">Back to Response</button>
          <button class="btn btn-primary" type="button" data-coach-view="coachVerificationPage">Start Verification</button>
        </div>
      </div>${bottomNav(page.view)}</main>`;
  }

  function renderVerification(record, page){
    const completed = (record.verificationSteps || []).filter(step => step.status && step.status !== 'Not Checked').length;
    const total = record.verificationSteps.length || 0;
    const checks = record.verificationSteps.map((step, index) => `
      <article class="coach-check-card">
        <span class="coach-mini-label">Check ${index + 1}</span>
        <h3>${escapeHTML(step.text)}</h3>
        <label>Status
          <select data-verification-step="${escapeHTML(step.id)}">
            ${verificationStatuses.map(status => `<option ${status === step.status ? 'selected' : ''}>${escapeHTML(status)}</option>`).join('')}
          </select>
        </label>
      </article>`).join('');
    return `${sharedHeader(page, record)}
      <section class="coach-response-page__card">
        <h2>What to Verify</h2>
        <p>${completed} of ${total} checks completed</p>
        <div class="coach-check-grid">${checks}</div>
        <div class="coach-page-actions">
          <button class="btn btn-secondary" type="button" data-view="answerVerification">Verify an Answer</button>
          <button class="btn btn-secondary" type="button" data-view="sourceComparison">Open Source Comparison</button>
          <button class="btn btn-secondary" type="button" data-view="claimEvidenceMap">Open Claim–Evidence Map</button>
          <button class="btn btn-secondary" type="button" data-coach-view="coachEvidencePage">Back to Evidence</button>
          <button class="btn btn-primary" type="button" data-coach-view="coachReflectionPage">Continue to Reflection</button>
        </div>
      </section>${bottomNav(page.view)}</main>`;
  }

  function renderReflection(record, page){
    const drafts = loadDrafts();
    return `${sharedHeader(page, record)}
      <div class="coach-page-grid coach-page-two-column">
        <section class="coach-response-page__card">
          <h2>Your Next Thinking Step</h2>
          <p>${escapeHTML(record.studentThinkingQuestion)}</p>
          <label for="coachReflectionText">Your reflection</label>
          <textarea id="coachReflectionText" class="coach-textarea" data-draft-field="reflection" placeholder="Explain your thinking in your own words.">${escapeHTML(drafts.reflection || '')}</textarea>
          <div class="coach-page-actions">
            <button class="btn btn-secondary" type="button" data-draft-save="reflection">Save draft</button>
            <button class="btn btn-primary" type="button" data-draft-submit="reflection">Submit reflection</button>
          </div>
          <p class="coach-feedback-panel" data-reflection-feedback ${drafts.reflectionSubmitted ? '' : 'hidden'}>Your reflection was saved. Review whether your explanation uses your own words and identifies what you still need to practise.</p>
        </section>
        <aside class="coach-response-page__card">
          <h2>Teach It Back</h2>
          <p>Teach It Back asks you to explain, apply, compare, test, or transfer an idea so you can check what you understand and what to practise next.</p>
          <p class="coach-notice">Explain the idea in your own words.<br><br>Do not copy the AI explanation.</p>
          <p>Written, audio, bilingual, and plain-language support remain available.</p>
          <div class="coach-page-actions">
            <button class="btn btn-secondary" type="button" data-coach-view="coachVerificationPage">Back to Verification</button>
            <button class="btn btn-primary" type="button" data-coach-view="coachRetryPage">Try Independently</button>
          </div>
        </aside>
      </div>${bottomNav(page.view)}</main>`;
  }

  function renderRetry(record, page){
    const drafts = loadDrafts();
    const available = Boolean(record.responseText);
    return `${sharedHeader(page, record)}
      <section class="coach-response-page__card">
        <h2>Independent Retry</h2>
        ${available ? `
          <div class="coach-response-meta-grid">
            <div class="coach-response-meta"><span>Skill Tested</span><strong>Apply the same idea independently</strong></div>
            <div class="coach-response-meta"><span>Expected Time</span><strong>5–8 minutes</strong></div>
            <div class="coach-response-meta"><span>Support</span><strong>Accessibility tools allowed</strong></div>
            <div class="coach-response-meta"><span>Final Answer Lock</span><strong>On</strong></div>
          </div>
          <p class="coach-notice">No substantive AI hints will be provided during this attempt. Accessibility support and approved resources remain available.</p>
          <h3>New equivalent question</h3>
          <p class="coach-page-text-block">Create a short answer that uses the same skill as your original question, then explain how you know your answer is reasonable.</p>
          <label for="coachRetryAnswer">Your independent answer</label>
          <textarea id="coachRetryAnswer" class="coach-answer-area" data-draft-field="retry">${escapeHTML(drafts.retry || '')}</textarea>
          <div class="coach-page-actions">
            <button class="btn btn-secondary" type="button" data-draft-save="retry">Pause and Save</button>
            <button class="btn btn-primary" type="button" data-draft-submit="retry">Submit Retry</button>
          </div>
          <div class="coach-feedback-panel" data-retry-feedback ${drafts.retrySubmitted ? '' : 'hidden'}>
            <h3>Retry Feedback</h3>
            <ul class="coach-page-list">
              <li>What appears correct: your independent attempt was recorded for review.</li>
              <li>First incorrect or unclear step: compare your explanation with the verification checklist.</li>
              <li>Skill demonstrated: applying the idea without substantive AI hints.</li>
              <li>Skill needing more practice: explaining the reasoning clearly.</li>
              <li>Recommended next activity: add this attempt to your Competency Portfolio.</li>
            </ul>
          </div>
          <div class="coach-page-actions">
            <button class="btn btn-secondary" type="button">Try Another</button>
            <button class="btn btn-secondary" type="button" data-coach-view="coachResponsePage">Review the Original Response</button>
            <button class="btn btn-primary" type="button" data-view="portfolioAddEvidence">Add to Competency Portfolio</button>
          </div>` : `<p>${UNAVAILABLE}</p><p>An independent retry will become available after the response passes the policy and equivalence checks.</p>`}
      </section>${bottomNav(page.view)}</main>`;
  }

  function renderContribution(record, page){
    const drafts = loadDrafts();
    const cards = contributionCheckpoints.map(([title, prompt], index) => {
      const id = `checkpoint-${index}`;
      const saved = drafts[id] || {};
      return `<article class="coach-contribution-card">
        <span class="coach-mini-label">${index + 1}</span>
        <h3>${escapeHTML(title)}</h3>
        <p>${escapeHTML(prompt)}</p>
        <label>Status
          <select data-checkpoint-status="${id}">
            ${contributionStatuses.map(status => `<option ${status === (saved.status || 'Not Started') ? 'selected' : ''}>${escapeHTML(status)}</option>`).join('')}
          </select>
        </label>
        <label>Student entry
          <textarea class="coach-textarea" data-checkpoint-entry="${id}">${escapeHTML(saved.entry || '')}</textarea>
        </label>
        <span class="coach-mini-label">Date: ${escapeHTML(saved.date ? formatDate(saved.date) : 'Not saved yet')}</span>
        <div class="coach-page-actions">
          <button class="btn btn-secondary" type="button" data-checkpoint-edit="${id}">Edit</button>
          <button class="btn btn-primary" type="button" data-checkpoint-save="${id}">Save</button>
        </div>
      </article>`;
    }).join('');
    return `${sharedHeader(page, record)}
      <section class="coach-response-page__card">
        <h2>Student Contribution Checkpoints</h2>
        <p class="coach-notice">Private by default. Checkpoints record intentional actions, not surveillance.</p>
        <div class="coach-contribution-grid">${cards}</div>
        <div class="coach-page-actions">
          <button class="btn btn-secondary" type="button" data-coach-view="coachReflectionPage">Back to Reflection</button>
          <button class="btn btn-primary" type="button" data-coach-view="coachAIUsePage">Review AI Use</button>
        </div>
      </section>${bottomNav(page.view)}</main>`;
  }

  function renderAIUse(record, page){
    const drafts = loadDrafts();
    const completed = contributionCheckpoints.filter((_, index) => drafts[`checkpoint-${index}`]?.status === 'Completed').length;
    return `${sharedHeader(page, record)}
      <div class="coach-page-grid coach-page-two-column">
        <section class="coach-response-page__card">
          <h2>AI Contribution</h2>
          <p class="coach-page-text-block">${escapeHTML(record.responseSummary)}</p>
          <h2>Student Contribution</h2>
          <p>${completed} checkpoint${completed === 1 ? '' : 's'} marked completed.</p>
          <h2>AI Use Note</h2>
          <textarea class="coach-textarea" data-draft-field="aiUseNote" placeholder="Write an editable disclosure note before sharing anything.">${escapeHTML(drafts.aiUseNote || record.disclosureSuggestion)}</textarea>
        </section>
        <aside class="coach-response-page__card">
          <h2>Disclosure Status</h2>
          <ul class="coach-page-list">
            <li>Recommended</li>
            <li>Policy Unknown</li>
            <li>Needs Teacher Clarification when the assignment rules are unclear</li>
          </ul>
          <div class="coach-page-actions">
            <button class="btn btn-primary" type="button" data-view="aiUseReceipt">Create AI Use Receipt</button>
            <button class="btn btn-secondary" type="button" data-draft-save="aiUseNote">Generate Editable Disclosure</button>
            <button class="btn btn-secondary" type="button" data-view="assignmentPolicyBuilder">Ask Teacher About AI Policy</button>
            <button class="btn btn-secondary" type="button" data-view="portfolioAddEvidence">Add to Competency Portfolio</button>
            <button class="btn btn-secondary" type="button" data-coach-view="coachContributionPage">Back to Contribution</button>
            <button class="btn btn-primary" type="button" data-coach-view="coach">Return to Coach</button>
          </div>
        </aside>
      </div>${bottomNav(page.view)}</main>`;
  }

  function renderPage(){
    const view = activeView();
    const page = pageByView(view);
    if(!page)return;
    const target = $(`#${view}View`);
    if(!target)return;
    let record;
    try{record = buildRecord()}catch(error){
      target.innerHTML = `<main class="coach-response-page__inner"><section class="coach-page-empty" role="alert"><h1>${escapeHTML(page.title)}</h1><p>${LOAD_ERROR}</p><button class="btn btn-primary" type="button" data-coach-view="coach">Back to Coach</button></section></main>`;
      return;
    }
    if(!record){
      target.innerHTML = emptyPage(page);
      return;
    }
    if(page.key === 'response')target.innerHTML = renderResponse(record, page);
    if(page.key === 'evidence')target.innerHTML = renderEvidence(record, page);
    if(page.key === 'verification')target.innerHTML = renderVerification(record, page);
    if(page.key === 'reflection')target.innerHTML = renderReflection(record, page);
    if(page.key === 'retry')target.innerHTML = renderRetry(record, page);
    if(page.key === 'contribution')target.innerHTML = renderContribution(record, page);
    if(page.key === 'ai-use')target.innerHTML = renderAIUse(record, page);
  }

  function renderAll(){
    renderWorkspace();
    renderPage();
  }

  function saveField(field){
    const drafts = loadDrafts();
    const node = document.querySelector(`[data-draft-field="${field}"]`);
    if(node)drafts[field] = node.value;
    saveDrafts(drafts);
  }

  function bindEvents(){
    document.addEventListener('click', event => {
      const viewButton = event.target.closest('[data-coach-view]');
      if(viewButton){
        event.preventDefault();
        showViewSafe(viewButton.getAttribute('data-coach-view'));
        return;
      }
      if(event.target.closest('[data-coach-focus-composer]')){
        event.preventDefault();
        $('#coachInput')?.focus();
        return;
      }
      const saveButton = event.target.closest('[data-draft-save]');
      if(saveButton){
        event.preventDefault();
        saveField(saveButton.getAttribute('data-draft-save'));
        renderAll();
        return;
      }
      const submitButton = event.target.closest('[data-draft-submit]');
      if(submitButton){
        event.preventDefault();
        const field = submitButton.getAttribute('data-draft-submit');
        const drafts = loadDrafts();
        const node = document.querySelector(`[data-draft-field="${field}"]`);
        if(node)drafts[field] = node.value;
        drafts[`${field}Submitted`] = true;
        saveDrafts(drafts);
        renderAll();
        return;
      }
      const checkpointSave = event.target.closest('[data-checkpoint-save]');
      if(checkpointSave){
        event.preventDefault();
        const id = checkpointSave.getAttribute('data-checkpoint-save');
        const drafts = loadDrafts();
        drafts[id] = {
          status: document.querySelector(`[data-checkpoint-status="${id}"]`)?.value || 'In Progress',
          entry: document.querySelector(`[data-checkpoint-entry="${id}"]`)?.value || '',
          date: new Date().toISOString()
        };
        saveDrafts(drafts);
        renderAll();
      }
    });

    document.addEventListener('change', event => {
      const step = event.target.closest('[data-verification-step]');
      if(!step)return;
      const id = step.getAttribute('data-verification-step');
      updateRecord(record => {
        record.verificationSteps = (record.verificationSteps || []).map(item => item.id === id ? {...item,status: step.value} : item);
        return record;
      });
      renderAll();
    });

    const chat = $('#chatMessages');
    if(chat && 'MutationObserver' in root){
      new MutationObserver(() => setTimeout(renderAll, 0)).observe(chat,{childList:true,subtree:true,characterData:true});
    }
    root.addEventListener('popstate', () => setTimeout(renderAll, 0));
    root.addEventListener('hashchange', () => setTimeout(renderAll, 0));
  }

  function init(){
    renderAll();
    bindEvents();
  }

  root.CoachResponseWorkspace = {renderAll, buildRecord, pages};

  if(document.readyState === 'loading')document.addEventListener('DOMContentLoaded', init);
  else init();
})(window);
