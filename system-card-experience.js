(function (root) {
  'use strict';

  const STEPS = Object.freeze([
    'System Overview',
    'Intended Users',
    'Inputs and Outputs',
    'Data and AI Components',
    'Capabilities',
    'Limitations',
    'Privacy and Safety',
    'Fairness and Accessibility',
    'Human Oversight',
    'Testing and Monitoring',
    'Review and Publish'
  ]);
  const STATUSES = Object.freeze(['Draft', 'Needs Testing', 'Needs Safety Review', 'Ready for Review', 'Approved', 'Archived']);
  const REVIEW_STATUSES = Object.freeze(['Not Submitted', 'Submitted', 'Under Review', 'Changes Requested', 'Safety Review Required', 'Approved']);
  const RISK_CATEGORIES = Object.freeze(['Personal information', 'Inaccurate information', 'Unsafe advice', 'Academic-integrity misuse', 'Bias', 'Harassment', 'Unauthorized access', 'AI overdependence']);
  const TEST_CATEGORIES = Object.freeze(['Accuracy', 'Privacy', 'Safety', 'Bias', 'Accessibility', 'Reliability', 'Weak internet', 'Incorrect input', 'Missing information', 'Misuse']);
  const ACCESSIBILITY_CHECKS = Object.freeze(['Keyboard navigation', 'Screen readers', 'Text-to-speech', 'Speech-to-text', 'Captions', 'Adjustable text', 'High contrast', 'Reduced motion', 'Plain language', 'Bilingual support', 'Low-bandwidth mode']);
  const DATA_MODELS = Object.freeze({
    SystemCard: ['id','projectId','userId','systemName','version','description','purpose','developmentStatus','intendedUsers','intendedUses','unsupportedUses','capabilities','limitations','humanOversight','status','completionStep','submittedAt','approvedAt','createdAt','updatedAt'],
    SystemComponent: ['id','systemCardId','componentType','name','purpose','inputData','outputData','limitations','responsibleUserId','displayOrder','createdAt','updatedAt'],
    SystemDataRecord: ['id','systemCardId','dataType','purpose','containsPersonalData','accessRoles','retentionPeriod','deletionMethod','consentRequired','createdAt','updatedAt'],
    SystemRisk: ['id','systemCardId','category','description','affectedUsers','impactLevel','prevention','detectionMethod','humanResponse','status','createdAt','updatedAt'],
    SystemTestCase: ['id','systemCardId','category','name','scenario','expectedResult','actualResult','status','problemFound','changeMade','retestResult','evidenceUrl','testedAt','createdAt','updatedAt'],
    SystemCardReview: ['id','systemCardId','reviewerId','status','feedback','requestedChanges','reviewedAt','createdAt','updatedAt'],
    SystemCardVersion: ['id','systemCardId','version','changeSummary','changedSections','newRisks','resolvedRisks','testingSummary','createdBy','createdAt']
  });
  const now = () => new Date().toISOString();
  const uid = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const accountId = () => root.localStorage?.getItem('studyspark_session_v1') || 'signed-out';
  const storageKey = () => `studyspark_system_cards_v1:${accountId()}`;
  let activeId = null;
  let step = 0;
  let message = '';
  let loadError = false;
  let sharePreview = false;

  function blankCard(seed = {}) {
    const stamp = now();
    return {
      id: uid('system-card'), projectId: seed.projectId || uid('project'), userId: accountId(), systemName: seed.systemName || '', projectName: seed.projectName || '', version: seed.version || '0.1', shortDescription: seed.shortDescription || '', problemAddressed: seed.problemAddressed || '', purpose: seed.purpose || '', developmentStatus: 'Idea', responsibleTeam: '', whyAI: '', nonAiAlternative: '',
      primaryUsers: '', secondaryUsers: '', ageRange: '', languages: '', locations: '', accessibilityNeeds: '', expectedKnowledge: '', intendedUses: '', unsupportedUses: '', inputs: [], outputs: [], components: [], capabilities: '', limitations: [],
      dataCollected: '', dataPurpose: '', accessPermissions: '', retentionPeriod: '', deletionProcess: '', consent: '', privacyChecks: '', safetyControls: '', reportingTools: '', humanEscalation: '', risks: [],
      fairnessGroupsTested: '', fairnessGroupsMissing: '', languageDifferences: '', possibleStereotypes: '', unequalErrors: '', fairnessMitigation: '', fairnessConcerns: '', accessibility: Object.fromEntries(ACCESSIBILITY_CHECKS.map(item => [item, 'Not Tested'])),
      importantOutputReviewer: '', aiStopConditions: '', reportRecipient: '', errorCorrector: '', changeApprover: '', accountablePerson: '', escalationFlows: {lowRisk:'',uncertain:'',highRisk:'',safetyReport:'',privacyConcern:''}, tests: [], monitoringPlan: '', openIssues: '',
      status: 'Draft', reviewStatus: 'Not Submitted', completionStep: 0, createdAt: stamp, updatedAt: stamp, submittedAt: null, approvedAt: null, privateByDefault: true, importedFromProblemScope: false, importReviewed: false, sharingPreference: 'Private', reviews: [], versions: [], languageMode: 'English'
    };
  }
  function readAll() {
    try {
      const parsed = JSON.parse(root.localStorage?.getItem(storageKey()) || '[]');
      loadError = false;
      return Array.isArray(parsed) ? parsed.filter(card => card && card.userId === accountId()) : [];
    } catch (_) { loadError = true; return []; }
  }
  function writeAll(cards) {
    try { root.localStorage?.setItem(storageKey(), JSON.stringify(cards)); loadError = false; return true; }
    catch (_) { loadError = true; return false; }
  }
  function getCard() { return readAll().find(card => card.id === activeId) || null; }
  function saveCard(card, notice = 'Draft saved') {
    const cards = readAll(), index = cards.findIndex(item => item.id === card.id);
    card.userId = accountId(); card.updatedAt = now(); card.completionStep = Math.max(card.completionStep || 0, step);
    if (index >= 0) cards[index] = card; else cards.unshift(card);
    const saved = writeAll(cards); message = saved ? notice : 'Unable to save System Card'; return saved;
  }
  function createCard(seed = {}) { const card=blankCard(seed); activeId=card.id; step=0; sharePreview=false; saveCard(card,'Private System Card draft created'); render(); }
  function importProblemScope() {
    let scope = null;
    try { const scopes=JSON.parse(root.localStorage?.getItem(`studyspark_problem_scopes_v1:${accountId()}`)||'[]'); scope=Array.isArray(scopes)?scopes[0]:null; } catch (_) {}
    createCard(scope ? {projectId:scope.projectId,projectName:scope.title,systemName:scope.title,problemAddressed:scope.problemStatement||scope.initialIdea,purpose:scope.impactStatement,whyAI:scope.aiFitReason,nonAiAlternative:scope.nonAiAlternative} : {projectName:'Imported Problem Scope',shortDescription:'Review every imported field before saving.'});
    const card=getCard(); if(card){card.importedFromProblemScope=true;card.importReviewed=false;saveCard(card,'Problem Scope imported. Review every field before saving.');render();}
  }

  const field = (label, name, value, type='textarea', help='') => `<label>${label}${type==='input'?`<input data-sc-field="${name}" value="${esc(value)}">`:`<textarea data-sc-field="${name}">${esc(value)}</textarea>`}${help?`<small>${help}</small>`:''}</label>`;
  const select = (label, name, value, options) => `<label>${label}<select data-sc-field="${name}">${options.map(option=>`<option ${value===option?'selected':''}>${option}</option>`).join('')}</select></label>`;
  const val = id => root.document.getElementById(id)?.value?.trim() || '';
  const list = (items, kind, titleKey='name', detailKey='description') => items.length ? `<div class="sc-record-list">${items.map(item=>`<article><h3>${esc(item[titleKey]||item.name||item.category||kind)}</h3><p>${esc(item[detailKey]||item.purpose||item.scenario||item.description||'Details saved')}</p><small>${esc(item.status||item.type||item.category||'Draft')}</small></article>`).join('')}</div>` : `<p class="sc-inline-empty">No ${kind.toLowerCase()} added yet.</p>`;

  function header() {
    return root.ProjectToolHeader.render({
      pageClass: 'sc-hero',
      titleId: 'system-card-title',
      backAttributes: { 'data-sc-action': 'projects' },
      backLabel: 'Return to Projects',
      mainClass: 'sc-hero-content',
      iconClass: 'sc-hero-icon',
      icon: '▦',
      eyebrowClass: 'sc-kicker sc-hero-eyebrow',
      eyebrow: 'RESPONSIBLE SYSTEM DOCUMENTATION',
      titleClass: 'sc-hero-title',
      title: 'System Card',
      descriptionClass: 'sc-hero-description',
      description: 'Explain what your AI system does, who it is designed for, how it works, what its limitations are, and how people remain in control.',
      guidanceClass: 'sc-reminder sc-hero-reminder',
      guidance: 'A System Card should explain both what the system can do and when it should not be used.',
      actionsClass: 'sc-hero-actions',
      actionsLabel: 'System Card actions',
      actions: [
        { label: 'Create System Card', variant: 'primary', attributes: { 'data-sc-action': 'start' } },
        { label: 'Continue Draft', variant: 'secondary', attributes: { 'data-sc-action': 'continue' } },
        { label: 'Import from Problem Scope', variant: 'secondary', attributes: { 'data-sc-action': 'import' } },
        { label: 'View an Example', variant: 'tertiary', attributes: { 'data-sc-action': 'example' } }
      ]
    });
  }
  function summary(cards) {
    if (!cards.length) return '';
    const card=cards[0], completed=Math.min(11,(card.completionStep||0)+1), openRisks=(card.risks||[]).filter(r=>!['Resolved','Closed'].includes(r.status)).length, passed=(card.tests||[]).filter(t=>t.status==='Passed').length;
    return `<section class="sc-section" aria-labelledby="sc-summary-title"><div class="sc-section-head"><div><span class="sc-kicker">CURRENT CARD</span><h2 id="sc-summary-title">System Card Overview</h2><p>Progress and review status for your most recently updated private card.</p></div><span class="sc-status"><span aria-hidden="true">●</span> ${esc(card.status)}</span></div><div class="sc-summary-grid"><article><span aria-hidden="true">◔</span><h3>Card Completion</h3><strong>${completed} of 11 steps</strong></article><article><span aria-hidden="true">△</span><h3>Open Risks</h3><strong>${openRisks}</strong></article><article><span aria-hidden="true">✓</span><h3>Testing Completed</h3><strong>${passed} of ${(card.tests||[]).length}</strong></article><article><span aria-hidden="true">↻</span><h3>Last Updated</h3><strong>${new Date(card.updatedAt).toLocaleDateString()}</strong></article></div></section>`;
  }
  function emptyOrHistory(cards) {
    if (!cards.length) return `<section class="sc-empty" aria-labelledby="sc-empty-title"><span aria-hidden="true">▦</span><h2 id="sc-empty-title">Document how your AI system works before you release it.</h2><p>Explain its purpose, users, limitations, risks, testing, and human oversight.</p><div><button class="btn btn-primary" data-sc-action="start" type="button">Create My First System Card</button><button class="btn btn-secondary" data-sc-action="import" type="button">Import from Problem Scope</button><button class="btn btn-secondary" data-sc-action="example" type="button">Try an Example</button><button class="btn btn-quiet" data-sc-action="learn" type="button">Learn What a System Card Includes</button></div></section>`;
    return `<section class="sc-section" aria-labelledby="sc-history-title"><div class="sc-section-head"><div><span class="sc-kicker">PRIVATE HISTORY</span><h2 id="sc-history-title">System Card History</h2></div></div><div class="sc-history-grid">${cards.map(card=>`<article><div><span class="sc-status"><span aria-hidden="true">●</span> ${esc(card.status)}</span><h3>${esc(card.systemName||'Untitled System Card')}</h3><p>${esc(card.projectName||'Project not named')} · Version ${esc(card.version)}</p><small>Step ${Math.min((card.completionStep||0)+1,11)} of 11 · Review: ${esc(card.reviewStatus)}</small></div><div class="sc-card-actions"><button class="btn btn-primary" data-sc-open="${card.id}" type="button">Continue Draft</button><button class="btn btn-secondary" data-sc-action="duplicate" data-id="${card.id}" type="button">Duplicate</button><button class="btn btn-quiet" data-sc-action="export" data-id="${card.id}" type="button">Export</button><button class="btn btn-danger" data-sc-action="delete" data-id="${card.id}" type="button">Delete Draft</button></div></article>`).join('')}</div></section>`;
  }
  function overview() { const cards=readAll(); return `${header()}${message?`<p class="sc-live" role="status">${esc(message)}</p>`:''}${summary(cards)}${emptyOrHistory(cards)}`; }

  function stepOverview(card) {
    return `<div class="sc-form-grid">${field('System name','systemName',card.systemName,'input')}${field('Project name','projectName',card.projectName,'input')}${field('Version','version',card.version,'input')}${field('Short description','shortDescription',card.shortDescription)}${field('Problem being addressed','problemAddressed',card.problemAddressed)}${field('Purpose','purpose',card.purpose)}${select('Development status','developmentStatus',card.developmentStatus,['Idea','Planned','Prototype','Testing','Limited Release','Paused'])}${field('Responsible student or team','responsibleTeam',card.responsibleTeam,'input')}${field('Reason AI is being used','whyAI',card.whyAI)}${field('Non-AI alternative considered','nonAiAlternative',card.nonAiAlternative)}</div>${card.importedFromProblemScope&&!card.importReviewed?'<div class="sc-notice" role="note"><strong>Imported content needs your review.</strong><p>Check every field. Imported content will not be treated as confirmed until you select “I Reviewed the Import.”</p><button class="btn btn-secondary" data-sc-action="confirm-import" type="button">I Reviewed the Import</button></div>':''}`;
  }
  function stepUsers(card) {
    return `<div class="sc-form-grid">${field('Primary users','primaryUsers',card.primaryUsers)}${field('Secondary users','secondaryUsers',card.secondaryUsers)}${field('Age or grade range','ageRange',card.ageRange,'input')}${field('Languages','languages',card.languages,'input')}${field('Locations','locations',card.locations,'input')}${field('Accessibility needs','accessibilityNeeds',card.accessibilityNeeds)}${field('Expected user knowledge','expectedKnowledge',card.expectedKnowledge)}</div><div class="sc-balanced"><section><span class="sc-kicker">INTENDED USES</span><h3>Uses the system is designed to support</h3>${field('Intended uses','intendedUses',card.intendedUses)}</section><section class="sc-not-for"><span class="sc-kicker">NOT DESIGNED FOR</span><h3>Uses the system should not perform</h3>${field('Unsupported uses','unsupportedUses',card.unsupportedUses)}</section></div>`;
  }
  function ioForm(kind) { const prefix=kind==='Input'?'sc-input':'sc-output'; return `<section><h3>Add ${kind}</h3><div class="sc-form-grid compact"><label>Name<input id="${prefix}-name"></label><label>Type<input id="${prefix}-type"></label><label>Description<textarea id="${prefix}-description"></textarea></label><label>Personal information involved<select id="${prefix}-personal"><option>No</option><option>Possibly</option><option>Yes</option><option>Unknown</option></select></label><label>Storage requirement<input id="${prefix}-storage"></label><label>Who can access it<input id="${prefix}-access"></label><label>Possible error<textarea id="${prefix}-error"></textarea></label><label>Human review requirement<textarea id="${prefix}-review"></textarea></label></div><button class="btn btn-secondary" data-sc-action="add-${kind.toLowerCase()}" type="button">Add ${kind}</button></section>`; }
  function stepIO(card) {
    return `<div class="sc-system-flow" aria-label="System flow diagram"><span>User Input</span><b aria-hidden="true">→</b><span>Privacy Check</span><b aria-hidden="true">→</b><span>AI Processing</span><b aria-hidden="true">→</b><span>Verification</span><b aria-hidden="true">→</b><span>Human Review</span><b aria-hidden="true">→</b><span>Output</span></div><ol class="sc-flow-list"><li>User Input</li><li>Privacy Check</li><li>AI Processing</li><li>Verification</li><li>Human Review</li><li>Output</li></ol><div class="sc-balanced">${ioForm('Input')}${ioForm('Output')}</div><h3>Saved inputs</h3>${list(card.inputs,'Inputs')}<h3>Saved outputs</h3>${list(card.outputs,'Outputs')}`;
  }
  function stepComponents(card) {
    return `<p class="sc-guidance">Document AI models, external services, APIs, databases, retrieval systems, datasets, moderation rules, verification tools, and human-review steps. Never enter secret keys.</p><div class="sc-form-grid compact"><label>Component type<select id="sc-component-type"><option>AI model</option><option>External service</option><option>API</option><option>Database</option><option>Search or retrieval system</option><option>Dataset</option><option>Moderation rule</option><option>Verification tool</option><option>Human-review step</option></select></label><label>Component name<input id="sc-component-name"></label><label>Purpose<textarea id="sc-component-purpose"></textarea></label><label>Data received<textarea id="sc-component-input"></textarea></label><label>Output produced<textarea id="sc-component-output"></textarea></label><label>Limitations<textarea id="sc-component-limitations"></textarea></label><label>Responsible person<input id="sc-component-responsible"></label></div><button class="btn btn-secondary" data-sc-action="add-component" type="button">Add Component</button>${list(card.components,'Components')}`;
  }
  function stepCapabilities(card) { return `<section class="sc-capability"><span class="sc-kicker">WHAT THE SYSTEM CAN DO</span><h3>Capabilities supported by the current version</h3>${field('Capabilities','capabilities',card.capabilities,'textarea','Describe current behavior and evidence. Do not present planned features as tested.')}</section>`; }
  function stepLimitations(card) {
    return `<section class="sc-limitations"><span class="sc-kicker">WHAT THE SYSTEM CANNOT RELIABLY DO</span><h3>Visible limitations and support needs</h3><div class="sc-form-grid compact"><label>Limitation<textarea id="sc-limitation"></textarea></label><label>Possible effect<textarea id="sc-limitation-effect"></textarea></label><label>Users affected<input id="sc-limitation-users"></label><label>Warning shown<textarea id="sc-limitation-warning"></textarea></label><label>Mitigation<textarea id="sc-limitation-mitigation"></textarea></label><label>Human-support requirement<textarea id="sc-limitation-support"></textarea></label></div><button class="btn btn-secondary" data-sc-action="add-limitation" type="button">Add Limitation</button>${list(card.limitations,'Limitations','limitation','possibleEffect')}</section>`;
  }
  function stepSafety(card) {
    return `<div class="sc-form-grid">${field('Data collected','dataCollected',card.dataCollected)}${field('Purpose for collection','dataPurpose',card.dataPurpose)}${field('Access permissions','accessPermissions',card.accessPermissions)}${field('Retention period','retentionPeriod',card.retentionPeriod,'input')}${field('Deletion process','deletionProcess',card.deletionProcess)}${field('Consent','consent',card.consent)}${field('Privacy checks','privacyChecks',card.privacyChecks)}${field('Safety controls','safetyControls',card.safetyControls)}${field('Reporting tools','reportingTools',card.reportingTools)}${field('Human escalation','humanEscalation',card.humanEscalation)}</div><section class="sc-risk-builder"><h3>Risk Register</h3><div class="sc-form-grid compact"><label>Risk category<select id="sc-risk-category">${RISK_CATEGORIES.map(x=>`<option>${x}</option>`).join('')}</select></label><label>Description<textarea id="sc-risk-description"></textarea></label><label>Affected users<input id="sc-risk-users"></label><label>Impact<select id="sc-risk-impact"><option>Low</option><option>Medium</option><option>High</option><option>Unknown</option></select></label><label>Prevention<textarea id="sc-risk-prevention"></textarea></label><label>Detection<textarea id="sc-risk-detection"></textarea></label><label>Human response<textarea id="sc-risk-response"></textarea></label><label>Status<select id="sc-risk-status"><option>Open</option><option>Monitoring</option><option>Mitigated</option><option>Resolved</option></select></label></div><button class="btn btn-secondary" data-sc-action="add-risk" type="button">Add Risk</button>${list(card.risks,'Risks')}</section>`;
  }
  function stepFairness(card) {
    return `<div class="sc-balanced"><section><span class="sc-kicker">FAIRNESS</span><h3>Who has and has not been tested?</h3>${field('User groups tested','fairnessGroupsTested',card.fairnessGroupsTested)}${field('Groups missing from testing','fairnessGroupsMissing',card.fairnessGroupsMissing)}${field('Language differences','languageDifferences',card.languageDifferences)}${field('Possible stereotypes','possibleStereotypes',card.possibleStereotypes)}${field('Unequal errors','unequalErrors',card.unequalErrors)}${field('Mitigation','fairnessMitigation',card.fairnessMitigation)}${field('Remaining concerns','fairnessConcerns',card.fairnessConcerns)}</section><section><span class="sc-kicker">ACCESSIBILITY</span><h3>Accessibility review</h3><div class="sc-a11y-list">${ACCESSIBILITY_CHECKS.map(item=>`<label><span>${item}</span><select data-sc-access="${esc(item)}"><option ${card.accessibility[item]==='Not Tested'?'selected':''}>Not Tested</option><option ${card.accessibility[item]==='Testing'?'selected':''}>Testing</option><option ${card.accessibility[item]==='Issue Found'?'selected':''}>Issue Found</option><option ${card.accessibility[item]==='Improved'?'selected':''}>Improved</option><option ${card.accessibility[item]==='Passed Review'?'selected':''}>Passed Review</option><option ${card.accessibility[item]==='Needs Human Review'?'selected':''}>Needs Human Review</option></select></label>`).join('')}</div></section></div>`;
  }
  function stepOversight(card) {
    return `<div class="sc-form-grid">${field('Who reviews important outputs?','importantOutputReviewer',card.importantOutputReviewer)}${field('When must AI stop?','aiStopConditions',card.aiStopConditions)}${field('Who receives reports?','reportRecipient',card.reportRecipient)}${field('Who corrects errors?','errorCorrector',card.errorCorrector)}${field('Who approves changes?','changeApprover',card.changeApprover)}${field('Who is accountable?','accountablePerson',card.accountablePerson)}</div><h3>Escalation flows</h3><div class="sc-form-grid compact">${field('Low-risk output','flowLowRisk',card.escalationFlows.lowRisk)}${field('Uncertain output','flowUncertain',card.escalationFlows.uncertain)}${field('High-risk decision','flowHighRisk',card.escalationFlows.highRisk)}${field('Safety report','flowSafetyReport',card.escalationFlows.safetyReport)}${field('Privacy concern','flowPrivacyConcern',card.escalationFlows.privacyConcern)}</div>`;
  }
  function stepTesting(card) {
    const passed=card.tests.filter(t=>t.status==='Passed').length,failed=card.tests.filter(t=>t.status==='Failed').length,notRun=card.tests.filter(t=>t.status==='Not Run').length;
    return `<div class="sc-summary-grid small"><article><h3>Total Tests</h3><strong>${card.tests.length}</strong></article><article><h3>Passed</h3><strong>${passed}</strong></article><article><h3>Failed</h3><strong>${failed}</strong></article><article><h3>Not Run</h3><strong>${notRun}</strong></article></div><div class="sc-form-grid compact"><label>Category<select id="sc-test-category">${TEST_CATEGORIES.map(x=>`<option>${x}</option>`).join('')}</select></label><label>Test name<input id="sc-test-name"></label><label>Scenario<textarea id="sc-test-scenario"></textarea></label><label>Expected result<textarea id="sc-test-expected"></textarea></label><label>Actual result<textarea id="sc-test-actual"></textarea></label><label>Pass or fail<select id="sc-test-status"><option>Not Run</option><option>Passed</option><option>Failed</option><option>Blocked</option></select></label><label>Problem found<textarea id="sc-test-problem"></textarea></label><label>Change made<textarea id="sc-test-change"></textarea></label><label>Retest result<textarea id="sc-test-retest"></textarea></label><label>Evidence link<input id="sc-test-evidence"></label></div><button class="btn btn-secondary" data-sc-action="add-test" type="button">Add Test Case</button>${field('Monitoring plan','monitoringPlan',card.monitoringPlan)}${list(card.tests,'Tests')}`;
  }
  function finalRows(card) {
    return [['System Name',card.systemName],['Purpose',card.purpose],['Intended Users',card.primaryUsers],['Intended Uses',card.intendedUses],['Unsupported Uses',card.unsupportedUses],['Inputs',card.inputs.map(x=>x.name).join(', ')],['Outputs',card.outputs.map(x=>x.name).join(', ')],['Components',card.components.map(x=>x.name).join(', ')],['Data Sources',card.dataCollected],['Capabilities',card.capabilities],['Limitations',card.limitations.map(x=>x.limitation).join(', ')],['Privacy Controls',card.privacyChecks],['Safety Controls',card.safetyControls],['Fairness Findings',card.fairnessConcerns],['Accessibility',Object.entries(card.accessibility).map(([k,v])=>`${k}: ${v}`).join('; ')],['Human Oversight',card.accountablePerson],['Testing Results',`${card.tests.filter(x=>x.status==='Passed').length} passed; ${card.tests.filter(x=>x.status==='Failed').length} failed`],['Open Issues',card.openIssues],['Version',card.version],['Last Updated',new Date(card.updatedAt).toLocaleDateString()]];
  }
  function stepReview(card) {
    return `<article class="sc-final-card"><div><span class="sc-kicker">FINAL SYSTEM CARD</span><h2>${esc(card.systemName||'Untitled System Card')}</h2><span class="sc-status"><span aria-hidden="true">●</span> ${esc(card.status)}</span></div><dl>${finalRows(card).map(([name,value])=>`<div><dt>${name}</dt><dd>${value?esc(value):'Not documented yet.'}</dd></div>`).join('')}</dl></article>${field('Open issues','openIssues',card.openIssues)}<section class="sc-review"><h3>Teacher Review</h3><p>Status: <strong>${esc(card.reviewStatus)}</strong>. A human reviewer must approve this card; AI cannot approve it.</p>${card.reviews.length?list(card.reviews,'Reviews','status','feedback'):'<p>No review has been submitted.</p>'}</section>${sharePreview?`<section class="sc-share-preview" role="region" aria-label="Sharing preview"><h3>Sharing Preview</h3><p>This preview excludes private notes, personal information, secret keys, security details, and private AI conversations.</p><ul><li>System name and purpose</li><li>Intended and unsupported uses</li><li>Capabilities, visible limitations, and testing summary</li><li>Human oversight and current review status</li></ul><button class="btn btn-secondary" data-sc-action="close-preview" type="button">Close Preview</button></section>`:''}<div class="sc-final-actions"><button class="btn btn-secondary" data-sc-action="edit" type="button">Edit Card</button><button class="btn btn-secondary" data-sc-action="save" type="button">Save Draft</button><button class="btn btn-primary" data-sc-action="submit" type="button">Request Teacher Review</button><button class="btn btn-secondary" data-sc-action="preview" type="button">Preview Sharing</button><button class="btn btn-secondary" data-sc-action="export-current" type="button">Export System Card</button><button class="btn btn-secondary" data-sc-action="public-summary" type="button">Create Public Summary</button><button class="btn btn-secondary" data-sc-action="team-share" type="button">Share with Team</button><button class="btn btn-secondary" data-sc-action="portfolio" type="button">Add to Competency Portfolio</button><button class="btn btn-secondary" data-sc-action="attach" type="button">Attach to Project Submission</button><button class="btn btn-primary" data-sc-action="prototype" type="button">Continue to Prototype Testing</button></div><section class="sc-version-history"><h3>Version History</h3>${card.versions.length?`<ol>${card.versions.map(version=>`<li><strong>Version ${esc(version.version)}</strong> · ${new Date(version.createdAt).toLocaleDateString()} · ${esc(version.createdBy)}<p>${esc(version.changeSummary)}</p><small>Sections: ${esc(version.changedSections)} · New risks: ${esc(version.newRisks)} · Resolved risks: ${esc(version.resolvedRisks)} · Tests: ${esc(version.testingSummary)}</small></li>`).join('')}</ol>`:'<p>No preserved versions yet.</p>'}<button class="btn btn-secondary" data-sc-action="version" type="button">Preserve Current Version</button><button class="btn btn-quiet" data-sc-action="compare" type="button">Compare Versions</button></section>`;
  }
  const renderStep = card => [stepOverview,stepUsers,stepIO,stepComponents,stepCapabilities,stepLimitations,stepSafety,stepFairness,stepOversight,stepTesting,stepReview][step](card);

  function wizard(card) {
    return `<header class="sc-workspace-head"><button class="study-page-back" data-sc-action="overview" type="button" aria-label="Return to System Card overview"><span aria-hidden="true">←</span></button><div><span class="sc-kicker">PRIVATE PROJECT RECORD</span><h1>System Card</h1><p>${esc(card.systemName||'Untitled System Card')} · ${esc(card.status)}</p></div><div class="sc-access-actions"><label>Card language<select data-sc-field="languageMode"><option ${card.languageMode==='English'?'selected':''}>English</option><option ${card.languageMode==='Bilingual'?'selected':''}>Bilingual</option></select></label><button class="btn btn-quiet" data-sc-action="listen" type="button">Listen</button><button class="btn btn-quiet" data-sc-action="speech" type="button">Speech-to-Text</button></div></header><nav class="sc-stepper" aria-label="System Card steps"><ol>${STEPS.map((name,index)=>`<li ${index===step?'aria-current="step"':''}><button data-sc-step="${index}" type="button"><span>${index+1}</span>${name}</button></li>`).join('')}</ol></nav><section class="sc-wizard-card" aria-labelledby="sc-current-step"><div class="sc-progress"><div><span>Step ${step+1} of 11</span><strong id="sc-current-step">${STEPS[step]}</strong></div><progress max="11" value="${step+1}">${step+1} of 11</progress></div>${message?`<p class="sc-live" role="status">${esc(message)}</p>`:''}<div class="sc-step-content">${renderStep(card)}</div><footer class="sc-wizard-actions"><button class="btn btn-secondary" data-sc-action="save" type="button">Save Draft</button><button class="btn btn-quiet" data-sc-action="overview" type="button">Exit and Return Later</button><span></span><button class="btn btn-secondary" data-sc-action="back" type="button" ${step===0?'disabled':''}>Back</button><button class="btn btn-primary" data-sc-action="next" type="button">${step===10?'Review System Card':'Continue'}</button></footer></section>`;
  }
  function sync(card) {
    root.document.querySelectorAll('#systemCardContent [data-sc-field]').forEach(control=>card[control.dataset.scField]=control.value);
    root.document.querySelectorAll('#systemCardContent [data-sc-access]').forEach(control=>card.accessibility[control.dataset.scAccess]=control.value);
    card.escalationFlows={lowRisk:card.flowLowRisk||card.escalationFlows.lowRisk,uncertain:card.flowUncertain||card.escalationFlows.uncertain,highRisk:card.flowHighRisk||card.escalationFlows.highRisk,safetyReport:card.flowSafetyReport||card.escalationFlows.safetyReport,privacyConcern:card.flowPrivacyConcern||card.escalationFlows.privacyConcern};
    return card;
  }
  function addRecord(collection, record, notice) { const card=sync(getCard()); if(!card)return; card[collection].push({id:uid(collection),systemCardId:card.id,createdAt:now(),updatedAt:now(),...record}); saveCard(card,notice); render(); }
  function addIO(kind) { const prefix=kind==='inputs'?'sc-input':'sc-output'; addRecord(kind,{name:val(`${prefix}-name`)||`Untitled ${kind==='inputs'?'input':'output'}`,type:val(`${prefix}-type`),description:val(`${prefix}-description`),personalInformationInvolved:val(`${prefix}-personal`),storageRequirement:val(`${prefix}-storage`),accessRoles:val(`${prefix}-access`),possibleError:val(`${prefix}-error`),humanReviewRequirement:val(`${prefix}-review`)},`${kind==='inputs'?'Input':'Output'} added`); }
  function makeVersion(card) { const snapshot={id:uid('system-card-version'),systemCardId:card.id,version:card.version,changeSummary:'Student preserved the current System Card version.',changedSections:STEPS.slice(0,(card.completionStep||0)+1).join(', '),newRisks:String(card.risks.filter(x=>x.status==='Open').length),resolvedRisks:String(card.risks.filter(x=>x.status==='Resolved').length),testingSummary:`${card.tests.filter(x=>x.status==='Passed').length} passed, ${card.tests.filter(x=>x.status==='Failed').length} failed`,createdBy:accountId(),createdAt:now()}; card.versions.push(snapshot); return snapshot; }
  function exportCard(card) { const blob=new Blob([JSON.stringify(card,null,2)],{type:'application/json'}), link=root.document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`${(card.systemName||'system-card').replace(/[^a-z0-9]+/gi,'-').toLowerCase()}.json`;link.click();URL.revokeObjectURL(link.href); }
  function handle(action,id) {
    const cards=readAll(); let card=getCard();
    if(action==='retry')return retry();
    if(action==='projects')return root.showView?.('communityAIProject');
    if(action==='start')return createCard();
    if(action==='continue'){const draft=cards.find(x=>x.status!=='Approved'&&x.status!=='Archived')||cards[0];return draft?(activeId=draft.id,step=Math.min(draft.completionStep||0,10),message='Draft restored',render()):createCard();}
    if(action==='import')return importProblemScope();
    if(action==='example')return createCard({systemName:'Accessible School Vocabulary Guide',projectName:'Vocabulary Access Project',shortDescription:'A limited classroom tool that explains approved academic terms.',purpose:'Help students understand academic vocabulary while teachers remain responsible for policy meaning.',problemAddressed:'Students may face language and accessibility barriers when reading school vocabulary.',whyAI:'AI may offer alternative explanations, but only after approved definitions are retrieved.',nonAiAlternative:'A searchable, teacher-maintained glossary.'});
    if(action==='learn'){message='A System Card explains purpose, users, data, components, capabilities, limitations, risks, testing, and human oversight. It is not a safety certificate.';return render();}
    if(action==='overview'){if(card)saveCard(sync(card),'Draft saved');activeId=null;message='';sharePreview=false;return render();}
    if(action==='save'&&card){saveCard(sync(card),'Draft saved');return render();}
    if(action==='back'&&card){saveCard(sync(card),'Draft saved');step=Math.max(0,step-1);return render();}
    if(action==='next'&&card){saveCard(sync(card),'Draft saved');step=Math.min(10,step+1);return render();}
    if(action==='edit'){step=0;return render();}
    if(action==='confirm-import'&&card){card.importReviewed=true;saveCard(sync(card),'Imported fields reviewed');return render();}
    if(action==='add-input')return addIO('inputs'); if(action==='add-output')return addIO('outputs');
    if(action==='add-component')return addRecord('components',{componentType:val('sc-component-type'),name:val('sc-component-name')||'Untitled component',purpose:val('sc-component-purpose'),inputData:val('sc-component-input'),outputData:val('sc-component-output'),limitations:val('sc-component-limitations'),responsibleUserId:val('sc-component-responsible')},'Component added');
    if(action==='add-limitation')return addRecord('limitations',{limitation:val('sc-limitation')||'Limitation needs a description',possibleEffect:val('sc-limitation-effect'),usersAffected:val('sc-limitation-users'),warningShown:val('sc-limitation-warning'),mitigation:val('sc-limitation-mitigation'),humanSupportRequirement:val('sc-limitation-support'),status:'Open'},'Limitation added');
    if(action==='add-risk')return addRecord('risks',{category:val('sc-risk-category'),description:val('sc-risk-description')||'Risk needs a description',affectedUsers:val('sc-risk-users'),impactLevel:val('sc-risk-impact'),prevention:val('sc-risk-prevention'),detectionMethod:val('sc-risk-detection'),humanResponse:val('sc-risk-response'),status:val('sc-risk-status')},'Risk added');
    if(action==='add-test')return addRecord('tests',{category:val('sc-test-category'),name:val('sc-test-name')||'Untitled test',scenario:val('sc-test-scenario'),expectedResult:val('sc-test-expected'),actualResult:val('sc-test-actual'),status:val('sc-test-status'),problemFound:val('sc-test-problem'),changeMade:val('sc-test-change'),retestResult:val('sc-test-retest'),evidenceUrl:val('sc-test-evidence'),testedAt:val('sc-test-status')==='Not Run'?null:now()},'Test case added');
    if(action==='version'&&card){sync(card);makeVersion(card);saveCard(card,'Current version preserved');return render();}
    if(action==='compare'&&card){message=card.versions.length>1?'Version comparison is ready in the history list. Earlier versions remain unchanged.':'Preserve at least two versions before comparing.';return render();}
    if(action==='submit'&&card){sync(card);if(!card.systemName||!card.purpose||!card.unsupportedUses||!card.accountablePerson){message='Add the system name, purpose, unsupported uses, and accountable human before requesting review.';return render();}if(!card.tests.length){card.status='Needs Testing';message='Add at least one test case before requesting review.';saveCard(card,message);return render();}card.status=card.risks.some(x=>x.status==='Open'&&x.impactLevel==='High')?'Needs Safety Review':'Ready for Review';card.reviewStatus=card.status==='Needs Safety Review'?'Safety Review Required':'Submitted';card.submittedAt=now();makeVersion(card);saveCard(card,'System Card submitted for authorized human review');return render();}
    if(action==='preview'&&card){sync(card);sharePreview=true;message='Review the exact safe fields below. Nothing has been shared.';saveCard(card,message);return render();}
    if(action==='close-preview'){sharePreview=false;return render();}
    if(['public-summary','team-share','attach'].includes(action)&&card){sharePreview=true;message='A privacy-safe preview is required before this action. Nothing was shared automatically.';return render();}
    if(action==='export-current'&&card){exportCard(sync(card));return;}
    if(action==='portfolio')return root.showView?.('competencyPortfolio');
    if(action==='prototype')return root.showView?.('aiArchitectureDesignStudio');
    if(action==='listen'){const text=root.document.querySelector('#systemCardContent .sc-step-content')?.innerText||'';if(root.speechSynthesis&&root.SpeechSynthesisUtterance){root.speechSynthesis.cancel();root.speechSynthesis.speak(new SpeechSynthesisUtterance(text));}else{message='Listening is not available in this browser.';render();}return;}
    if(action==='speech'){const Recognition=root.SpeechRecognition||root.webkitSpeechRecognition,target=root.document.activeElement;if(!Recognition||!target||!['INPUT','TEXTAREA'].includes(target.tagName)){message='Select a text field first. Speech-to-Text is not available in every browser.';return render();}const recognition=new Recognition();recognition.onresult=event=>{target.value=`${target.value} ${event.results[0][0].transcript}`.trim();target.dispatchEvent(new Event('input',{bubbles:true}));};recognition.start();return;}
    if(action==='duplicate'){const original=cards.find(x=>x.id===id);if(!original)return;const copy=JSON.parse(JSON.stringify(original));copy.id=uid('system-card');copy.systemName=`${copy.systemName||'Untitled System Card'} — Copy`;copy.status='Draft';copy.reviewStatus='Not Submitted';copy.versions=[];copy.reviews=[];copy.createdAt=copy.updatedAt=now();copy.submittedAt=copy.approvedAt=null;cards.unshift(copy);writeAll(cards);message='Draft duplicated';return render();}
    if(action==='delete'){const original=cards.find(x=>x.id===id);if(!original||original.status==='Approved'){message='Approved versions are preserved and cannot be deleted here.';return render();}if(root.confirm?.('Delete this private System Card draft?')){writeAll(cards.filter(x=>x.id!==id));message='Draft deleted';render();}return;}
    if(action==='export'){const original=cards.find(x=>x.id===id);if(original)exportCard(original);}
  }
  function bind() {
    const host=root.document.getElementById('systemCardContent');
    host?.querySelectorAll('[data-sc-open]').forEach(button=>button.addEventListener('click',()=>{activeId=button.dataset.scOpen;const card=getCard();step=Math.min(card?.completionStep||0,10);message='Draft restored';render();}));
    host?.querySelectorAll('[data-sc-step]').forEach(button=>button.addEventListener('click',()=>{const card=sync(getCard());saveCard(card,'Draft saved');step=Number(button.dataset.scStep);render();}));
    host?.querySelectorAll('[data-sc-action]').forEach(button=>button.addEventListener('click',()=>handle(button.dataset.scAction,button.dataset.id)));
  }
  function errorView() { return `<section class="sc-error" role="alert"><h1>System Card</h1><p>We could not open the System Card. Your project information has not been deleted.</p><div><button class="btn btn-primary" data-sc-action="retry" type="button">Try Again</button><button class="btn btn-secondary" data-sc-action="projects" type="button">Return to Projects</button><button class="btn btn-secondary" data-sc-action="start" type="button">Create a System Card Manually</button></div></section>`; }
  function render() {
    const host=root.document?.getElementById('systemCardContent'); if(!host)return false; readAll(); host.innerHTML=loadError?errorView():(activeId&&getCard()?wizard(getCard()):overview()); bind(); host.querySelector('h1')?.focus?.(); return true;
  }
  function retry(){loadError=false;render();}
  root.SystemCardExperience=Object.freeze({STEPS,STATUSES,REVIEW_STATUSES,RISK_CATEGORIES,TEST_CATEGORIES,ACCESSIBILITY_CHECKS,DATA_MODELS,render,listCards:readAll,getActiveCard:getCard,retry,_test:{blankCard,storageKey}});
  if(root.document?.getElementById('aiSystemCardStudioView')?.classList.contains('active'))render();
})(typeof window!=='undefined'?window:globalThis);
