(function (root) {
  'use strict';

  const STEPS = Object.freeze([
    'Identify the Need',
    'Understand the People',
    'Investigate the Current Situation',
    'Define the Problem',
    'Decide Whether AI Is Appropriate',
    'Set Scope and Boundaries',
    'Plan Success Measures',
    'Review the Final Scope'
  ]);
  const STATUSES = Object.freeze(['Draft', 'Research Needed', 'Stakeholder Feedback Needed', 'Ready for Review', 'Completed', 'Changes Requested', 'Archived']);
  const TEMPLATES = Object.freeze([
    { id: 'school', icon: 'S', title: 'School Challenge', category: 'School', description: 'Explore a learning, communication, or school-access need.', example: 'Students may miss important schedule changes when information is spread across several places.' },
    { id: 'community', icon: 'C', title: 'Community Challenge', category: 'Community', description: 'Investigate a need affecting a local group or service.', example: 'Residents may find it difficult to discover current community programs.' },
    { id: 'accessibility', icon: 'Aa', title: 'Accessibility Challenge', category: 'Accessibility', description: 'Identify a barrier that may exclude people from participating.', example: 'Some learning resources may be difficult to use with assistive technology.' },
    { id: 'environment', icon: 'E', title: 'Environmental Challenge', category: 'Environmental', description: 'Study a local sustainability or environmental-information need.', example: 'Students may be unsure how to sort common school waste correctly.' },
    { id: 'custom', icon: '+', title: 'Create My Own', category: 'Other', description: 'Start with a need you have observed yourself.', example: 'Describe the people, setting, and difficulty before choosing a tool.' }
  ]);
  const DATA_MODELS = Object.freeze({
    ProblemScope: ['id','userId','projectId','title','category','setting','initialIdea','problemStatement','impactStatement','knownFacts','assumptions','investigationQuestions','aiFitStatus','aiFitReason','nonAiAlternative','inScope','outOfScope','constraints','status','completionStep','createdAt','completedAt','updatedAt'],
    ProblemStakeholder: ['id','problemScopeId','stakeholderType','groupName','relationship','needs','difficulties','possibleBenefits','possibleRisks','consultationMethod','consultedAt','createdAt','updatedAt'],
    ProblemEvidence: ['id','problemScopeId','title','evidenceType','sourceTitle','sourceUrl','evidenceSummary','relevance','limitation','verificationStatus','sourceFeature','sourceRecordId','createdAt','updatedAt'],
    ExistingSolution: ['id','problemScopeId','name','provider','intendedUsers','strengths','limitations','accessBarriers','costNotes','remainingGap','createdAt','updatedAt'],
    ProblemRisk: ['id','problemScopeId','category','description','affectedUsers','likelihoodLevel','impactLevel','mitigation','humanOversight','status','createdAt','updatedAt'],
    ProblemSuccessMeasure: ['id','problemScopeId','measure','testingMethod','participantGroup','baseline','target','evidenceRequired','createdAt','updatedAt'],
    ProblemScopeReview: ['id','problemScopeId','reviewerId','status','feedback','requestedChanges','reviewedAt','createdAt','updatedAt']
  });
  const now = () => new Date().toISOString();
  const uid = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const split = value => String(value || '').split(/\n|,/).map(item => item.trim()).filter(Boolean);
  const accountId = () => root.localStorage?.getItem('studyspark_session_v1') || 'signed-out';
  const storageKey = () => `studyspark_problem_scopes_v1:${accountId()}`;
  let activeId = null;
  let step = 0;
  let message = '';
  let loadError = false;

  function emptyScope(seed = {}) {
    const stamp = now();
    return {
      id: uid('problem-scope'), userId: accountId(), projectId: seed.projectId || uid('project'), title: seed.title || '', category: seed.category || '', setting: '', initialIdea: seed.initialIdea || '', observed: '', whyMatters: '', learnedFrom: '', evidenceAvailable: '',
      knownFacts: '', assumptions: '', investigationQuestions: '', stakeholders: [], evidence: [], existingSolutions: [], problemStatement: '', problem: '', impactStatement: '', evidenceStatement: '', constraintStatement: '',
      aiSignals: {}, aiFitStatus: 'More Investigation Is Needed', aiFitReason: '', nonAiAlternative: '', inScope: '', outOfScope: '', targetUsers: '', ageRange: '', languages: '', devices: '', location: '', availableData: '', duration: '', teamSkills: '', budget: '', technologyLimits: '', constraints: '',
      risks: [], successMeasures: [], nextResearchStep: '', languageMode: 'English', sharingPreference: 'Private', status: 'Draft', completionStep: 0, createdAt: stamp, completedAt: null, updatedAt: stamp, reviews: [], privateByDefault: true
    };
  }

  function readAll() {
    try {
      const parsed = JSON.parse(root.localStorage?.getItem(storageKey()) || '[]');
      loadError = false;
      return Array.isArray(parsed) ? parsed.filter(scope => scope && scope.userId === accountId()) : [];
    } catch (_) {
      loadError = true;
      return [];
    }
  }
  function writeAll(scopes) {
    try {
      root.localStorage?.setItem(storageKey(), JSON.stringify(scopes));
      loadError = false;
      return true;
    } catch (_) {
      loadError = true;
      return false;
    }
  }
  function getScope() { return readAll().find(scope => scope.id === activeId) || null; }
  function saveScope(scope, notice = 'Draft saved') {
    const scopes = readAll();
    const index = scopes.findIndex(item => item.id === scope.id);
    scope.userId = accountId();
    scope.updatedAt = now();
    scope.completionStep = Math.max(scope.completionStep || 0, step);
    if (index >= 0) scopes[index] = scope; else scopes.unshift(scope);
    const saved = writeAll(scopes);
    message = saved ? notice : 'Unable to save scope';
    return saved;
  }
  function createScope(seed) {
    const scope = emptyScope(seed);
    activeId = scope.id;
    step = 0;
    saveScope(scope, 'Private draft created');
    render();
  }

  function header() {
    return root.ProjectToolHeader.render({
      pageClass: 'ps-hero',
      titleId: 'problem-scope-title',
      backClass: 'ps-overview-back',
      backAttributes: { 'data-ps-action': 'projects' },
      backLabel: 'Return to Projects',
      mainClass: 'ps-hero-content',
      iconClass: 'ps-target',
      icon: '◎',
      eyebrowClass: 'ps-kicker',
      eyebrow: 'RESPONSIBLE PROJECT DESIGN',
      titleClass: 'ps-hero-title',
      title: 'Problem Scope',
      descriptionClass: 'ps-hero-description',
      description: 'Define the real problem, understand who is affected, and decide whether AI is an appropriate solution before building your project.',
      guidanceClass: 'ps-reminder',
      guidance: 'Begin with the community need, not with the technology you want to use.',
      actionsClass: 'ps-hero-actions',
      actionsLabel: 'Problem Scope actions',
      actions: [
        { label: 'Start Problem Scoping', variant: 'primary', attributes: { 'data-ps-action': 'start' } },
        { label: 'Continue Draft', variant: 'secondary', attributes: { 'data-ps-action': 'continue' } },
        { label: 'Try an Example', variant: 'secondary', attributes: { 'data-ps-action': 'example' } },
        { label: 'Import Project Idea', variant: 'tertiary', attributes: { 'data-ps-action': 'import' } }
      ]
    });
  }
  function templates() {
    return `<section class="ps-section" aria-labelledby="ps-quick-title"><div class="ps-section-head"><div><span class="ps-kicker">QUICK START</span><h2 id="ps-quick-title">Choose a starting point</h2><p>Each option adds guidance that you can revise. It does not complete the scope for you.</p></div></div><div class="ps-template-grid">${TEMPLATES.map(item => `<article class="ps-template-card"><span class="ps-template-icon" aria-hidden="true">${item.icon}</span><h3>${item.title}</h3><p>${item.description}</p><small><strong>Example:</strong> ${item.example}</small><button class="btn btn-secondary" data-ps-template="${item.id}" type="button">Start</button></article>`).join('')}</div></section>`;
  }
  function history(scopes) {
    if (!scopes.length) return `<section class="ps-empty" aria-labelledby="ps-empty-title"><span aria-hidden="true">⌖</span><h2 id="ps-empty-title">Your project starts with understanding the problem.</h2><p>Identify who is affected, gather evidence, and decide whether AI is truly the right solution.</p><div><button class="btn btn-primary" data-ps-action="start" type="button">Create My First Problem Scope</button><button class="btn btn-secondary" data-ps-action="import" type="button">Import a Project Idea</button><button class="btn btn-secondary" data-ps-action="example" type="button">Try an Example</button><button class="btn btn-quiet" data-ps-action="learn" type="button">Learn About Problem Scoping</button></div></section>`;
    return `<section class="ps-section" aria-labelledby="ps-history-title"><div class="ps-section-head"><div><span class="ps-kicker">PRIVATE PROJECT HISTORY</span><h2 id="ps-history-title">Problem Scope History</h2></div></div><div class="ps-history-grid">${scopes.map(scope => `<article class="ps-history-card"><div><span class="ps-status" data-status="${esc(scope.status)}">${esc(scope.status)}</span><h3>${esc(scope.title || 'Untitled Problem Scope')}</h3><p>${esc(scope.category || 'Uncategorized')} · ${esc(scope.targetUsers || 'Target users not added')}</p><small>Step ${Math.min((scope.completionStep || 0) + 1, 8)} of 8 · Updated ${new Date(scope.updatedAt).toLocaleDateString()}</small></div><div class="ps-card-actions"><button class="btn btn-primary" data-ps-open="${scope.id}" type="button">Continue</button><button class="btn btn-secondary" data-ps-action="duplicate" data-id="${scope.id}" type="button">Duplicate</button><button class="btn btn-quiet" data-ps-action="export" data-id="${scope.id}" type="button">Export</button><button class="btn btn-danger" data-ps-action="delete" data-id="${scope.id}" type="button">Delete Draft</button></div></article>`).join('')}</div></section>`;
  }
  function overview() {
    const scopes = readAll();
    return `${header()}${message ? `<p class="ps-live" role="status">${esc(message)}</p>` : ''}${templates()}${history(scopes)}`;
  }

  const field = (label, name, value, type = 'textarea', help = '') => `<label>${label}${type === 'input' ? `<input data-ps-field="${name}" value="${esc(value)}">` : `<textarea data-ps-field="${name}">${esc(value)}</textarea>`}${help ? `<small>${help}</small>` : ''}</label>`;
  function listCards(items, kind) {
    if (!items.length) return `<p class="ps-inline-empty">No ${kind.toLowerCase()} added yet.</p>`;
    return `<div class="ps-item-list">${items.map(item => `<article><h3>${esc(item.groupName || item.title || item.name || item.description || item.measure)}</h3><p>${esc(item.needs || item.evidenceSummary || item.strengths || item.mitigation || item.testingMethod || '')}</p><small>${esc(item.stakeholderType || item.evidenceType || item.provider || item.category || item.verificationStatus || '')}</small></article>`).join('')}</div>`;
  }
  function stepOne(scope) {
    return `<div class="ps-form-grid">${field('Project title','title',scope.title,'input')}${field('Problem category','category',scope.category,'input')}${field('Community or setting','setting',scope.setting,'input')}${field('Initial idea','initialIdea',scope.initialIdea)}${field('What was observed?','observed',scope.observed)}${field('Why does it matter?','whyMatters',scope.whyMatters)}${field('How did you learn about it?','learnedFrom',scope.learnedFrom)}${field('Evidence currently available','evidenceAvailable',scope.evidenceAvailable)}</div><div class="ps-three-columns"><section><h3>What We Know</h3>${field('Evidence-supported facts','knownFacts',scope.knownFacts)}</section><section><h3>What We Assume</h3>${field('Assumptions to test','assumptions',scope.assumptions)}</section><section><h3>What We Still Need to Investigate</h3>${field('Open questions','investigationQuestions',scope.investigationQuestions)}</section></div>`;
  }
  function stepTwo(scope) {
    return `<p class="ps-guidance">Use groups or roles rather than personal names. Include people who may be excluded and people responsible for support.</p><div class="ps-form-grid compact"><label>Stakeholder type<select id="ps-stakeholder-type"><option>Primary users</option><option>People indirectly affected</option><option>Teachers or staff</option><option>Families</option><option>Community organizations</option><option>Decision-makers</option><option>People who may be excluded</option><option>People responsible for support</option></select></label><label>Group or role<input id="ps-stakeholder-group"></label><label>Relationship to the problem<input id="ps-stakeholder-relationship"></label><label>Needs<textarea id="ps-stakeholder-needs"></textarea></label><label>Current difficulties<textarea id="ps-stakeholder-difficulties"></textarea></label><label>Possible benefits<textarea id="ps-stakeholder-benefits"></textarea></label><label>Possible harms<textarea id="ps-stakeholder-harms"></textarea></label><label>Consultation method<input id="ps-stakeholder-consultation"></label></div><button class="btn btn-secondary" data-ps-action="add-stakeholder" type="button">Add Stakeholder</button><h3 class="ps-subtitle">Accessible stakeholder list</h3>${listCards(scope.stakeholders,'Stakeholders')}`;
  }
  function stepThree(scope) {
    return `<div class="ps-split"><section><h3>Research and Evidence</h3><div class="ps-form-grid compact"><label>Evidence type<select id="ps-evidence-type"><option>Interview</option><option>Survey</option><option>Observation</option><option>Statistics</option><option>Research study</option><option>School report</option><option>Community report</option><option>Source Comparison</option><option>Claim–Evidence Map</option><option>Verify an Answer</option></select></label><label>Title<input id="ps-evidence-title"></label><label>Source<input id="ps-evidence-source"></label><label>What it shows<textarea id="ps-evidence-summary"></textarea></label><label>Relevance<input id="ps-evidence-relevance"></label><label>Limitation<input id="ps-evidence-limitation"></label><label>Verification status<select id="ps-evidence-status"><option>Information Still Missing</option><option>Evidence Supporting the Problem</option><option>Evidence Challenging the Assumption</option><option>Verified</option></select></label></div><button class="btn btn-secondary" data-ps-action="add-evidence" type="button">Add Evidence</button>${listCards(scope.evidence,'Evidence')}</section><section><h3>Existing Solutions</h3><div class="ps-form-grid compact"><label>Existing solution<input id="ps-solution-name"></label><label>Provider<input id="ps-solution-provider"></label><label>Intended users<input id="ps-solution-users"></label><label>Strengths<textarea id="ps-solution-strengths"></textarea></label><label>Limitations<textarea id="ps-solution-limitations"></textarea></label><label>Access barriers<input id="ps-solution-barriers"></label><label>Cost<input id="ps-solution-cost"></label><label>Why the problem remains<textarea id="ps-solution-gap"></textarea></label></div><button class="btn btn-secondary" data-ps-action="add-solution" type="button">Add Existing Solution</button>${listCards(scope.existingSolutions,'Existing solutions')}</section></div><p class="ps-note">One opinion does not prove that an entire community has the same experience. Look for different perspectives and note limitations.</p>`;
  }
  function stepFour(scope) {
    return `<div class="ps-statement-pattern"><p><strong>Use this structure:</strong></p><p>“[User group] needs a way to [need] because [evidence-based reason], while considering [constraint].”</p></div><div class="ps-form-grid">${field('The Problem','problem',scope.problem)}${field('The Impact','impactStatement',scope.impactStatement)}${field('The Evidence','evidenceStatement',scope.evidenceStatement)}${field('The Constraint','constraintStatement',scope.constraintStatement)}${field('Problem statement','problemStatement',scope.problemStatement)}</div><button class="btn btn-secondary" data-ps-action="check-statement" type="button">Check My Problem Statement</button><div id="ps-statement-feedback" class="ps-feedback" aria-live="polite"></div>`;
  }
  function stepFive(scope) {
    const questions = ['Does this task involve language, prediction, classification, patterns, or personalization?','Could a simple form, website, search feature, database, or checklist solve it?','Is suitable data available?','Could errors cause harm?','Can a human review important outputs?','Does AI provide a meaningful advantage?','Would AI increase cost or complexity?'];
    return `<div class="ps-ai-check">${questions.map((question,index)=>`<fieldset><legend>${question}</legend><label><input type="radio" name="ai-${index}" data-ps-signal="q${index}" value="Yes" ${scope.aiSignals?.[`q${index}`]==='Yes'?'checked':''}> Yes</label><label><input type="radio" name="ai-${index}" data-ps-signal="q${index}" value="No" ${scope.aiSignals?.[`q${index}`]==='No'?'checked':''}> No</label><label><input type="radio" name="ai-${index}" data-ps-signal="q${index}" value="Not sure" ${scope.aiSignals?.[`q${index}`]==='Not sure'?'checked':''}> Not sure</label></fieldset>`).join('')}</div><div class="ps-form-grid"><label>AI appropriateness outcome<select data-ps-field="aiFitStatus"><option ${scope.aiFitStatus==='AI May Be Appropriate'?'selected':''}>AI May Be Appropriate</option><option ${scope.aiFitStatus==='AI Could Support Part of the Solution'?'selected':''}>AI Could Support Part of the Solution</option><option ${scope.aiFitStatus==='A Non-AI Solution May Be Better'?'selected':''}>A Non-AI Solution May Be Better</option><option ${scope.aiFitStatus==='More Investigation Is Needed'?'selected':''}>More Investigation Is Needed</option></select></label>${field('Explain your decision','aiFitReason',scope.aiFitReason)}${field('Required non-AI alternative','nonAiAlternative',scope.nonAiAlternative)}</div>`;
  }
  function stepSix(scope) {
    return `<div class="ps-boundaries"><section><h3>IN SCOPE</h3><p>What the current version will address.</p>${field('In-scope features','inScope',scope.inScope)}</section><section><h3>OUT OF SCOPE</h3><p>What the current version will not address.</p>${field('Out-of-scope items','outOfScope',scope.outOfScope)}</section></div><div class="ps-form-grid compact">${field('Target users','targetUsers',scope.targetUsers,'input')}${field('Age or grade range','ageRange',scope.ageRange,'input')}${field('Languages','languages',scope.languages,'input')}${field('Supported devices','devices',scope.devices,'input')}${field('Location','location',scope.location,'input')}${field('Available data','availableData',scope.availableData)}${field('Project duration','duration',scope.duration,'input')}${field('Team skills','teamSkills',scope.teamSkills)}${field('Budget','budget',scope.budget,'input')}${field('Technology limits','technologyLimits',scope.technologyLimits)}${field('Constraints','constraints',scope.constraints)}</div>`;
  }
  function stepSeven(scope) {
    return `<div class="ps-split"><section><h3>Assumptions, Constraints, and Risks</h3><div class="ps-form-grid compact"><label>Risk category<select id="ps-risk-category"><option>Accuracy</option><option>Privacy</option><option>Bias</option><option>Accessibility</option><option>Safety</option><option>Cost</option><option>Connectivity</option><option>Misuse</option><option>AI dependence</option><option>Missing stakeholder input</option></select></label><label>Risk<textarea id="ps-risk-description"></textarea></label><label>Affected users<input id="ps-risk-users"></label><label>Likelihood description<input id="ps-risk-likelihood"></label><label>Possible impact<textarea id="ps-risk-impact"></textarea></label><label>Prevention<textarea id="ps-risk-mitigation"></textarea></label><label>Human oversight<textarea id="ps-risk-oversight"></textarea></label></div><button class="btn btn-secondary" data-ps-action="add-risk" type="button">Add Risk</button>${listCards(scope.risks,'Risks')}</section><section><h3>Success Measures</h3><div class="ps-form-grid compact"><label>Success measure<input id="ps-measure"></label><label>Testing method<input id="ps-measure-method"></label><label>Participants<input id="ps-measure-participants"></label><label>Baseline<input id="ps-measure-baseline"></label><label>Desired improvement<input id="ps-measure-target"></label><label>Evidence required<textarea id="ps-measure-evidence"></textarea></label></div><button class="btn btn-secondary" data-ps-action="add-measure" type="button">Add Success Measure</button>${listCards(scope.successMeasures,'Success measures')}</section></div><p class="ps-note">Use specific descriptions such as task completion, clarity, accuracy, accessibility, source verification, understanding, or appropriate human escalation. Avoid unexplained percentages and vague goals such as “help everyone.”</p>`;
  }
  function summaryList(value) { const items = split(value); return items.length ? `<ul>${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : '<p>Not added yet.</p>'; }
  function stepEight(scope) {
    const rows = [['Project Title',scope.title],['Community Need',scope.whyMatters || scope.initialIdea],['Target Users',scope.targetUsers],['Problem Statement',scope.problemStatement],['Evidence',scope.evidence.map(item=>item.title).join(', ')],['Stakeholders',scope.stakeholders.map(item=>item.groupName).join(', ')],['Existing Solutions',scope.existingSolutions.map(item=>item.name).join(', ')],['AI Appropriateness',`${scope.aiFitStatus}: ${scope.aiFitReason}`],['Non-AI Alternative',scope.nonAiAlternative],['In-Scope Features',scope.inScope],['Out-of-Scope Items',scope.outOfScope],['Assumptions',scope.assumptions],['Constraints',scope.constraints],['Risks',scope.risks.map(item=>item.description).join(', ')],['Success Measures',scope.successMeasures.map(item=>item.measure).join(', ')],['Next Research Step',scope.nextResearchStep]];
    return `<article class="ps-canvas"><div class="ps-canvas-head"><div><span class="ps-kicker">FINAL PROBLEM SCOPE CANVAS</span><h2>${esc(scope.title || 'Untitled Problem Scope')}</h2></div><span class="ps-status">${esc(scope.status)}</span></div><dl>${rows.map(([label,value])=>`<div><dt>${label}</dt><dd>${value?esc(value):'Not added yet.'}</dd></div>`).join('')}</dl></article>${field('Next research step','nextResearchStep',scope.nextResearchStep)}<div class="ps-final-actions"><button class="btn btn-secondary" data-ps-action="edit-scope" type="button">Edit Scope</button><button class="btn btn-secondary" data-ps-action="save" type="button">Save Draft</button><button class="btn btn-primary" data-ps-action="complete" type="button">Mark Scope Complete</button><button class="btn btn-secondary" data-ps-action="share" type="button">Request Stakeholder Feedback</button><button class="btn btn-secondary" data-ps-action="portfolio" type="button">Add to Competency Portfolio</button><button class="btn btn-primary" data-ps-action="design" type="button">Continue to Solution Design</button><button class="btn btn-quiet" data-ps-action="print" type="button">Print Scope Canvas</button></div>`;
  }
  function stepContent(scope) { return [stepOne,stepTwo,stepThree,stepFour,stepFive,stepSix,stepSeven,stepEight][step](scope); }
  function wizard(scope) {
    return `<header class="ps-workspace-head"><button class="study-page-back" data-ps-action="overview" type="button" aria-label="Return to Problem Scope overview"><span aria-hidden="true">←</span></button><div><span class="ps-kicker">PRIVATE PROJECT DRAFT</span><h1>Problem Scope</h1><p>${esc(scope.title || 'Untitled Problem Scope')} · ${esc(scope.status)}</p></div><div class="ps-access-actions"><label>Scope language<select data-ps-field="languageMode"><option ${scope.languageMode==='English'?'selected':''}>English</option><option ${scope.languageMode==='Bilingual'?'selected':''}>Bilingual</option></select></label><button class="btn btn-quiet" data-ps-action="listen" type="button">Listen</button><button class="btn btn-quiet" data-ps-action="speech" type="button">Speech-to-Text</button></div></header><nav class="ps-stepper" aria-label="Problem Scope steps"><ol>${STEPS.map((name,index)=>`<li ${index===step?'aria-current="step"':''}><button data-ps-step="${index}" type="button"><span>${index+1}</span>${name}</button></li>`).join('')}</ol></nav><section class="ps-wizard-card" aria-labelledby="ps-current-step"><div class="ps-progress"><div><span>Step ${step+1} of 8</span><strong id="ps-current-step">${STEPS[step]}</strong></div><progress max="8" value="${step+1}">${step+1} of 8</progress></div>${message?`<p class="ps-live" role="status">${esc(message)}</p>`:''}<div class="ps-step-content">${stepContent(scope)}</div><footer class="ps-wizard-actions"><button class="btn btn-secondary" data-ps-action="save" type="button">Save Draft</button><button class="btn btn-quiet" data-ps-action="overview" type="button">Exit and Return Later</button><span></span><button class="btn btn-secondary" data-ps-action="back" type="button" ${step===0?'disabled':''}>Back</button><button class="btn btn-primary" data-ps-action="next" type="button">${step===7?'Review Scope':'Continue'}</button></footer></section>`;
  }

  function syncFields(scope) {
    root.document.querySelectorAll('#problemScopingContent [data-ps-field]').forEach(control => { scope[control.dataset.psField] = control.value; });
    root.document.querySelectorAll('#problemScopingContent [data-ps-signal]:checked').forEach(control => { scope.aiSignals[control.dataset.psSignal] = control.value; });
    return scope;
  }
  const value = id => root.document.getElementById(id)?.value?.trim() || '';
  function addRecord(type, record) {
    const scope = syncFields(getScope());
    if (!scope) return;
    scope[type].push({ id: uid(type), problemScopeId: scope.id, ...record, createdAt: now(), updatedAt: now() });
    saveScope(scope, `${type === 'stakeholders' ? 'Stakeholder' : type === 'evidence' ? 'Evidence' : type === 'existingSolutions' ? 'Existing solution' : type === 'risks' ? 'Risk' : 'Success measure'} added`);
    render();
  }
  function statementFeedback(scope) {
    const text = scope.problemStatement.trim();
    const notes = [];
    if (text.length < 45) notes.push('The statement may be too broad or missing detail.');
    if (!scope.targetUsers && !/student|teacher|family|user|community|people/i.test(text)) notes.push('Add the stakeholder or user group.');
    if (!scope.evidence.length && !scope.evidenceStatement) notes.push('Connect the statement to evidence instead of an assumption.');
    if (/\b(build|create|develop)\b.*\b(ai|app|chatbot|model)\b/i.test(text)) notes.push('This may describe a proposed solution rather than the underlying problem.');
    if (!scope.constraintStatement && !/while considering|constraint|without/i.test(text)) notes.push('Add an important constraint or boundary.');
    return notes.length ? notes : ['The statement has a user group, need, reason, and constraint. Review the wording yourself before confirming it.'];
  }
  function exportScope(scope) {
    const blob = new Blob([JSON.stringify(scope, null, 2)], {type:'application/json'});
    const link = root.document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${(scope.title || 'problem-scope').replace(/[^a-z0-9]+/gi,'-').toLowerCase()}.json`; link.click(); URL.revokeObjectURL(link.href);
  }
  function bind() {
    const rootEl = root.document.getElementById('problemScopingContent');
    rootEl?.querySelectorAll('[data-ps-template]').forEach(button => button.addEventListener('click', () => { const template=TEMPLATES.find(item=>item.id===button.dataset.psTemplate); createScope({title:template.id==='custom'?'':template.title,category:template.category,initialIdea:template.example}); }));
    rootEl?.querySelectorAll('[data-ps-open]').forEach(button => button.addEventListener('click', () => { activeId=button.dataset.psOpen; const scope=getScope(); step=Math.min(scope?.completionStep||0,7); message='Draft restored'; render(); }));
    rootEl?.querySelectorAll('[data-ps-step]').forEach(button => button.addEventListener('click', () => { const scope=syncFields(getScope()); saveScope(scope,'Draft saved'); step=Number(button.dataset.psStep); render(); }));
    rootEl?.querySelectorAll('[data-ps-action]').forEach(button => button.addEventListener('click', () => handle(button.dataset.psAction, button.dataset.id)));
  }
  function handle(action, id) {
    const scopes = readAll();
    let scope = getScope();
    if (action === 'retry') return retry();
    if (action === 'projects') return root.showView?.('communityAIProject');
    if (action === 'start') return createScope({});
    if (action === 'continue') { const draft=scopes.find(item=>item.status!=='Completed')||scopes[0]; return draft?(activeId=draft.id,step=Math.min(draft.completionStep||0,7),message='Draft restored',render()):createScope({}); }
    if (action === 'example') return createScope({title:'School Communication Challenge',category:'School',initialIdea:TEMPLATES[0].example});
    if (action === 'import') return createScope({title:'Imported Project Idea',initialIdea:'Review and rewrite the project idea here. Begin with the need rather than the proposed technology.'});
    if (action === 'learn') { message='Start with people, evidence, current solutions, and a clearly bounded need. AI is only one possible option.'; return render(); }
    if (action === 'overview') { if(scope) saveScope(syncFields(scope),'Draft saved'); activeId=null; message=''; return render(); }
    if (action === 'save' && scope) { saveScope(syncFields(scope),'Draft saved'); return render(); }
    if (action === 'back' && scope) { saveScope(syncFields(scope),'Draft saved'); step=Math.max(0,step-1); return render(); }
    if (action === 'next' && scope) { saveScope(syncFields(scope),'Draft saved'); step=Math.min(7,step+1); return render(); }
    if (action === 'edit-scope') { step=0; return render(); }
    if (action === 'add-stakeholder') return addRecord('stakeholders',{stakeholderType:value('ps-stakeholder-type'),groupName:value('ps-stakeholder-group')||'Unnamed stakeholder group',relationship:value('ps-stakeholder-relationship'),needs:value('ps-stakeholder-needs'),difficulties:value('ps-stakeholder-difficulties'),possibleBenefits:value('ps-stakeholder-benefits'),possibleRisks:value('ps-stakeholder-harms'),consultationMethod:value('ps-stakeholder-consultation')});
    if (action === 'add-evidence') return addRecord('evidence',{title:value('ps-evidence-title')||'Untitled evidence',evidenceType:value('ps-evidence-type'),sourceTitle:value('ps-evidence-source'),evidenceSummary:value('ps-evidence-summary'),relevance:value('ps-evidence-relevance'),limitation:value('ps-evidence-limitation'),verificationStatus:value('ps-evidence-status')});
    if (action === 'add-solution') return addRecord('existingSolutions',{name:value('ps-solution-name')||'Untitled solution',provider:value('ps-solution-provider'),intendedUsers:value('ps-solution-users'),strengths:value('ps-solution-strengths'),limitations:value('ps-solution-limitations'),accessBarriers:value('ps-solution-barriers'),costNotes:value('ps-solution-cost'),remainingGap:value('ps-solution-gap')});
    if (action === 'add-risk') return addRecord('risks',{category:value('ps-risk-category'),description:value('ps-risk-description')||'Risk needs description',affectedUsers:value('ps-risk-users'),likelihoodLevel:value('ps-risk-likelihood'),impactLevel:value('ps-risk-impact'),mitigation:value('ps-risk-mitigation'),humanOversight:value('ps-risk-oversight'),status:'Open'});
    if (action === 'add-measure') return addRecord('successMeasures',{measure:value('ps-measure')||'Measure needs description',testingMethod:value('ps-measure-method'),participantGroup:value('ps-measure-participants'),baseline:value('ps-measure-baseline'),target:value('ps-measure-target'),evidenceRequired:value('ps-measure-evidence')});
    if (action === 'check-statement' && scope) { syncFields(scope); saveScope(scope,'Problem statement reviewed'); const box=root.document.getElementById('ps-statement-feedback'); if(box)box.innerHTML=`<h3>Review suggestions</h3><ul>${statementFeedback(scope).map(note=>`<li>${esc(note)}</li>`).join('')}</ul><p>Your statement was not replaced.</p>`; return; }
    if (action === 'complete' && scope) { syncFields(scope); if(!scope.problemStatement||!scope.nonAiAlternative||!scope.inScope||!scope.outOfScope){message='Add a problem statement, a non-AI alternative, and both scope boundaries before completion.';return render();} scope.status='Completed';scope.completedAt=now();saveScope(scope,'Scope completed');return render(); }
    if (action === 'share' && scope) { scope.status='Stakeholder Feedback Needed';scope.sharingPreference='Feedback link requested';saveScope(scope,'Feedback request prepared. Nothing was shared automatically.');return render(); }
    if (action === 'portfolio') return root.showView?.('competencyPortfolio');
    if (action === 'design') return root.showView?.('aiSystemCardStudio');
    if (action === 'print') return root.print();
    if (action === 'listen') { const text=rootElText(); if(root.speechSynthesis&&root.SpeechSynthesisUtterance){root.speechSynthesis.cancel();root.speechSynthesis.speak(new SpeechSynthesisUtterance(text));} else {message='Listening is not available in this browser.';render();} return; }
    if (action === 'speech') { const Recognition=root.SpeechRecognition||root.webkitSpeechRecognition;const target=root.document.activeElement;if(!Recognition||!target||!['INPUT','TEXTAREA'].includes(target.tagName)){message='Select a text field first. Speech-to-Text is not available in every browser.';return render();}const recognition=new Recognition();recognition.onresult=event=>{target.value=`${target.value} ${event.results[0][0].transcript}`.trim();target.dispatchEvent(new Event('input',{bubbles:true}));};recognition.start();return; }
    if (action === 'duplicate') { const original=scopes.find(item=>item.id===id);if(!original)return;const copy=JSON.parse(JSON.stringify(original));copy.id=uid('problem-scope');copy.projectId=uid('project');copy.title=`${copy.title||'Untitled Problem Scope'} — Copy`;copy.status='Draft';copy.createdAt=copy.updatedAt=now();copy.completedAt=null;scopes.unshift(copy);writeAll(scopes);message='Draft duplicated';return render(); }
    if (action === 'delete') { const original=scopes.find(item=>item.id===id);if(!original||original.status==='Completed'){message='Only drafts can be deleted from this page.';return render();}if(root.confirm?.('Delete this private problem-scope draft?')){writeAll(scopes.filter(item=>item.id!==id));message='Draft deleted';render();}return; }
    if (action === 'export') { const original=scopes.find(item=>item.id===id);if(original)exportScope(original);return; }
  }
  function rootElText(){return root.document.querySelector('#problemScopingContent .ps-step-content')?.innerText||'';}
  function errorView() { return `<section class="problem-scope-error" role="alert"><h1>Problem Scope</h1><p>We could not open Problem Scope. Your project work has not been deleted.</p><div><button class="btn btn-primary" data-ps-action="retry" type="button">Try Again</button><button class="btn btn-secondary" data-ps-action="projects" type="button">Return to Projects</button><button class="btn btn-secondary" data-ps-action="start" type="button">Create a Problem Scope Manually</button></div></section>`; }
  function render() {
    const host = root.document?.getElementById('problemScopingContent');
    if (!host) return false;
    readAll();
    if (loadError) host.innerHTML=errorView(); else host.innerHTML=activeId&&getScope()?wizard(getScope()):overview();
    bind();
    host.querySelector('h1')?.focus?.();
    return true;
  }
  function retry(){loadError=false;render();}
  root.ProblemScopeExperience = Object.freeze({STEPS,STATUSES,TEMPLATES,DATA_MODELS,render,listScopes:readAll,getActiveScope:getScope,retry,_test:{emptyScope,statementFeedback,storageKey}});
  if (root.document?.getElementById('problemScopingStudioView')?.classList.contains('active')) render();
})(typeof window !== 'undefined' ? window : globalThis);
