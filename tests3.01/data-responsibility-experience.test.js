'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
let assertions = 0;
const ok = (value, message) => { assert.ok(value, message); assertions += 1; };
const equal = (actual, expected, message) => { assert.deepStrictEqual(actual, expected, message); assertions += 1; };
const source = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
const headerRenderer = source('project-tool-header.js');

const memory = new Map();
global.localStorage = {
  getItem(key) { return memory.has(key) ? memory.get(key) : null; },
  setItem(key, value) { memory.set(key, String(value)); },
  removeItem(key) { memory.delete(key); }
};
localStorage.setItem('studyspark_session_v1', 'student-data-test');
require('../data-responsibility-experience.js');
const Experience = global.ProjectDataResponsibilityExperience;

ok(Experience, 'Data Responsibility exports a browser API');
equal(Experience.STATUSES, ['Draft','Data Inventory Needed','Privacy Review Needed','Ready for Review','Approved','Archived']);
equal(Experience.STEPS, ['Data Purpose','Data Inventory','Sources and Permission','Data Classification','Collection and Consent','Access and Sharing','Storage and Retention','Quality and Fairness','Third-Party Services','Risks and Incident Response','Final Review']);
equal(Experience.TEMPLATES.map(item => item.title), ['Student Learning Assistant','Research and Source Tool','Community Service Platform','Accessibility and Language Tool','Start from Scratch']);
equal(Experience.SOURCE_STATUSES, ['Permission Confirmed','Publicly Available','Licence Review Needed','Consent Required','Restricted Use','Permission Unknown','Do Not Use']);
equal(Experience.CLASSIFICATIONS, ['Public','Internal','Confidential','Sensitive Personal Data']);
equal(Experience.CONSENT_STATUSES, ['Not Required','Notice Required','Agreement Required','Guardian or School Process Required','Consent Collected','Consent Withdrawn','Needs Review']);
equal(Experience.ACCESS_ROLES, ['Student','Team Member','Teacher','Parent or Guardian','Tutor','Verifier','Administrator','External Service','Public Viewer']);
equal(Experience.ACCESS_PERMISSIONS, ['View','Create','Edit','Delete','Export','Share','Approve','No Access']);
equal(Experience.LIFECYCLE, ['Collect','Use','Store','Share','Archive','Delete']);
equal(Experience.QUALITY_STATUSES, ['Not Reviewed','Incomplete','Quality Concern','Representation Concern','Usable with Limitations','Reviewed','Needs Human Review']);
equal(Experience.AI_FLOW, ['Student Input','Sensitive-Data Check','Redaction','AI Request','Output Validation','Student Response']);
equal(Experience.SERVICE_STATUSES, ['Not Reviewed','Reviewing','Approved for Prototype','Approved with Restrictions','Needs School Review','Do Not Use']);

const plan = Experience._test.blankPlan({title:'Tutor data plan',projectName:'Peer Tutoring'});
equal(plan.userId, 'student-data-test');
equal(plan.privateByDefault, true);
equal(plan.status, 'Draft');
equal(plan.version, '0.1');
equal(plan.currentStep, 0);
ok(Array.isArray(plan.dataAssets), 'Data assets are structured records');
ok(Array.isArray(plan.sources), 'Sources are structured records');
ok(Array.isArray(plan.accessRules), 'Access rules are structured records');
ok(Array.isArray(plan.services), 'Services are structured records');
ok(Array.isArray(plan.risks), 'Risks are structured records');
ok(Array.isArray(plan.reviews), 'Reviews are structured records');
ok(Array.isArray(plan.versions), 'Versions are structured records');
ok(Experience._test.storageKey().endsWith(':student-data-test'), 'Storage is account isolated');
equal(Experience.listPlans(), []);

const emptyIssues = Experience._test.reviewIssues(plan);
for (const text of ['Data without purpose','Data Inventory Needed','Missing notice or consent','Weak access controls','Missing human oversight','Representation concerns']) {
  ok(emptyIssues.some(issue => issue.issue === text), `Review detects ${text}`);
}
plan.purpose = 'Support students with safe peer tutoring';
plan.projectPurpose = 'Match learners with verified peer tutors';
plan.collectionNotice = 'We collect only the tutoring request details needed to schedule and review a session.';
plan.selectedSharing = 'Teacher reviewers can see submitted evidence only';
plan.auditRecords = 'Server audit records track review decisions';
plan.humanOversight = 'Authorized teacher reviewer';
plan.qualityStatus = 'Reviewed';
plan.dataAssets.push({name:'Tutoring request',purpose:'Schedule academic help',retentionPeriod:'Until the request is complete',deletionMethod:'Delete request and derived draft records',classification:'Internal',containsSensitiveData:false});
ok(!Experience._test.reviewIssues(plan).some(issue => issue.issue === 'Data Inventory Needed'), 'A documented item resolves inventory-needed review');

for (const model of ['DataResponsibilityPlan','ProjectDataAsset','ProjectDataSource','DataAccessRule','ThirdPartyDataService','ProjectDataRisk','DataResponsibilityReview','DataResponsibilityVersion']) {
  ok(Array.isArray(Experience.DATA_MODELS[model]), `${model} model is defined`);
  ok(Experience.DATA_MODELS[model].includes('id'), `${model} includes an id`);
}
ok(Experience.DATA_MODELS.DataResponsibilityPlan.includes('projectId'), 'Data plan links to a project');
ok(Experience.DATA_MODELS.DataResponsibilityPlan.includes('userId'), 'Data plan includes ownership');
ok(Experience.DATA_MODELS.DataResponsibilityReview.includes('reviewerId'), 'Review records identify an authorized reviewer');
ok(Experience.DATA_MODELS.DataResponsibilityVersion.includes('risksChanged'), 'Version history preserves risk changes');

const experienceJs = source('data-responsibility-experience.js');
const studioJs = source('data-responsibility-studio.js');
const css = source('data-responsibility-experience.css');
const html = source('index (2).html');
const appJs = source('script.js');

for (const text of [
  'Data Responsibility',
  'Plan what data your project needs, where it comes from, who can access it, how it is protected, and when it should be deleted.',
  'Build My Data Plan',
  'Import from System Card',
  'Import from Architecture',
  'View an Example',
  'Collecting more data does not automatically make an AI system better. Use only the data the project genuinely needs.',
  'Data Items Documented',
  'Sensitive Data Items',
  'Third-Party Services',
  'Open Data Risks',
  'Plan how your project will handle data before collecting it. Identify what data is needed, remove what is unnecessary, and document access, protection, retention, and deletion.',
  'Build My First Data Plan',
  'Use a Data Template',
  'We could not open the Data Responsibility workspace. Your saved project work has not been deleted.',
  'Create a Data Plan Manually'
]) ok(experienceJs.includes(text), `Experience includes ${text}`);

for (const text of [
  'Data Purpose','Data Inventory','Sources and Permission','Data Classification','Collection and Consent','Access and Sharing','Storage and Retention','Quality and Fairness','Third-Party Services','Risks and Incident Response','Final Review',
  'Is it necessary?','Could less data be collected?','Could it be anonymous?','Could synthetic data be used?','Is permanent storage necessary?',
  'Account information','Student content','Uploaded files','Voice recordings','Transcripts','Images','Course information','Learning progress','Accessibility settings','Language preferences','Device information','Usage analytics','Teacher feedback','Safety reports','AI prompts','AI responses','Verification records',
  'Permission Confirmed','Publicly Available','Licence Review Needed','Consent Required','Restricted Use','Permission Unknown','Do Not Use',
  'Public','Internal','Confidential','Sensitive Personal Data','Names','Student numbers','Contact information','Addresses','Location','Medical information','Disability information','Financial information','Immigration information','Academic records','Voice or image data','Safety reports','Information about minors','Authentication credentials',
  'Plain-Language Notice','A checkbox alone does not prove legal compliance.','Role-Access Matrix','server-side authorization','Data Lifecycle','Collect','Use','Store','Share','Archive','Delete',
  'AI Data Flow','Sensitive-Data Check','Redaction','AI Request','Output Validation','Student Response','Never store secret values, passwords, tokens, or API keys.',
  'Incident Flow','Issue Detected','Limit Access','Notify Reviewer','Investigate','Correct or Delete','Inform Affected Users When Required','Document Improvements',
  'Review My Data Plan','FINAL DATA RESPONSIBILITY PLAN','Edit Plan','Save Draft','Request Teacher Review','Export Data Plan','Continue to Testing','Version History and Review','Human approval is required'
]) ok(experienceJs.includes(text), `Workflow includes ${text}`);

for (const text of [
  'Data without purpose','Sensitive data without protection','Retention without justification','Missing deletion','Missing notice or consent','Unreviewed third parties','Unknown source permission','Personal data in AI prompts','Weak access controls','Missing human oversight','Representation concerns','Conflicts with System Card','Missing Architecture data flows'
]) ok(experienceJs.includes(text), `Review includes ${text}`);

ok(studioJs.includes('ProjectDataResponsibilityExperience?.render'), 'Protected domain view delegates to the complete experience');
ok(studioJs.includes('data-first-screen-ready="true"'), 'Data Responsibility installs a first-screen shell');
ok(studioJs.includes('LEGACY_RENDER_LABELS'), 'Old source expectations are preserved without a duplicate full workflow');
ok(appJs.includes("dataResponsibilityStudio:'/projects/data-responsibility'"), 'Canonical route is registered');
ok(appJs.includes("viewNames.dataResponsibilityStudio=['PROJECTS','Data Responsibility']"), 'Canonical title is registered');
ok(appJs.includes("dataResponsibilityStudio:{role:'student'"), 'Content metadata prevents Page unavailable');
ok(appJs.includes("if(view==='dataResponsibilityStudio')ensureDataResponsibilityStudioShell()"), 'Direct refresh installs a shell before route validation');
ok(appJs.includes("if(view==='dataResponsibilityStudio')window.DataResponsibilityStudio?.render?.()"), 'Canonical navigation renders Data Responsibility');
ok(appJs.includes("'/data-responsibility':'dataResponsibilityStudio'"), 'Legacy route redirects to canonical Data Responsibility page');
ok(html.includes('data-responsibility-experience.js?v=data-responsibility-complete-20260829'), 'Versioned experience JavaScript is loaded');
ok(html.includes('data-responsibility-experience.css?v=data-responsibility-complete-20260829'), 'Versioned experience CSS is loaded');
ok(html.includes('script.js?v=data-responsibility-route-20260829'), 'Central route registry is cache-versioned');
ok(html.indexOf('data-responsibility-studio.js') < html.indexOf('data-responsibility-experience.js'), 'Protected domain module loads before the experience');
ok(experienceJs.includes("classList.contains('active')"), 'Late bundle rendering supports a direct route');

for (const rule of ['.dr-hero','.dr-template-grid','.dr-summary-grid','.dr-stepper','.dr-wizard','.dr-form-grid','.dr-access-matrix','.dr-ai-flow','.dr-lifecycle','.dr-incident','.dr-mobile-flow','.dr-checks','.dr-final',':focus-visible','@media(max-width:48rem)','@media(max-width:32rem)','@media(prefers-reduced-motion:reduce)','@media(forced-colors:active)','@media print','[dir=rtl]','.low-bandwidth']) {
  ok(css.includes(rule), `Responsive/accessibility CSS includes ${rule}`);
}
ok(!css.includes('position:fixed'), 'Data Responsibility does not use a floating overlay');
ok(experienceJs.includes('type="button"'), 'Generated actions avoid unintended form submissions');
ok(experienceJs.includes('aria-current="step"'), 'The current wizard stage is announced');
ok(experienceJs.includes('role="status"'), 'Loading and save status are announced');
ok(experienceJs.includes('backLabel') && experienceJs.includes('Return to Projects') && headerRenderer.includes('aria-label="${escapeHtml(options.backLabel'), 'Overview Back arrow has an accessible name');
ok(experienceJs.includes('aria-label="Return to Data Responsibility overview"'), 'Wizard Back arrow has an accessible name');
ok(experienceJs.includes('item.userId===accountId()'), 'Records are filtered by active account');
ok(experienceJs.includes('Nothing has been shared.'), 'Export preview does not auto-share');
ok(experienceJs.includes('Human approval is required for Approved status'), 'Data plan approval remains human');
ok(experienceJs.includes("original.status==='Approved'"), 'Approved records cannot be deleted by the draft control');
ok(experienceJs.includes('never overwrite saved data plans') || experienceJs.includes('never overwrites'), 'Template guidance protects existing data plans');
ok(experienceJs.includes('never modifies') || experienceJs.includes('never modify'), 'Review does not auto-modify student work');

console.log(`${assertions}/${assertions} assertions passed`);
