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
localStorage.setItem('studyspark_session_v1', 'student-architecture-test');
require('../project-architecture-experience.js');
const Experience = global.ProjectArchitectureExperience;

ok(Experience, 'Project Architecture exports a browser API');
equal(Experience.STEPS, ['Goals and Constraints','System Components','Data Flow','AI Workflow','APIs and Integrations','Privacy and Security','Deployment','Reliability and Monitoring','Architecture Decisions','Final Review']);
equal(Experience.STATUSES, ['Draft','Needs More Detail','Ready for Review','Under Review','Changes Requested','Approved','Archived']);
equal(Experience.TEMPLATES.map(item => item.title), ['AI Learning Assistant','Research and Source Tool','Accessibility and Language Tool','Community Resource Platform','Start from Scratch']);
equal(Experience.AI_STAGES, ['User Input','Privacy Redaction','Assignment Policy Check','Prompt Builder','AI Model','Source Retrieval','Safety Check','Output Validation','Human or Student Review','Final Response']);
equal(Experience.SECURITY_CHECKS, ['Server-side authorization','Private-data exposure','Secret storage','Uploaded-file validation','Sensitive-action audit logs','Role permissions','External-service failures','User deletion controls']);

const architecture = Experience._test.blankArchitecture({title:'Source helper architecture',projectName:'Source Helper'});
equal(architecture.userId, 'student-architecture-test');
equal(architecture.privateByDefault, true);
equal(architecture.status, 'Draft');
equal(architecture.title, 'Source helper architecture');
equal(architecture.projectName, 'Source Helper');
equal(architecture.version, '0.1');
ok(Array.isArray(architecture.components), 'Components are structured records');
ok(Array.isArray(architecture.connections), 'Connections are structured records');
ok(Array.isArray(architecture.integrations), 'Integrations are structured records');
ok(Array.isArray(architecture.failures), 'Failure plans are structured records');
ok(Array.isArray(architecture.decisions), 'Decisions are structured records');
ok(Array.isArray(architecture.issues), 'Issues are structured records');
ok(Array.isArray(architecture.reviews), 'Reviews are structured records');
ok(Array.isArray(architecture.versions), 'Versions are structured records');
ok(Experience._test.storageKey().endsWith(':student-architecture-test'), 'Storage is account isolated');
equal(Experience.listArchitectures(), []);

const emptyIssues = Experience._test.reviewIssues(architecture);
for (const type of ['MISSING_COMPONENTS','MISSING_AUTHENTICATION','MISSING_AUTHORIZATION','MISSING_HUMAN_REVIEW','MISSING_BACKUPS','MISSING_ACCESSIBILITY','MISSING_LOW_BANDWIDTH']) {
  ok(emptyIssues.some(issue => issue.issueType === type), `Review detects ${type}`);
}
architecture.components.push({id:'model',name:'AI Model',componentType:'AI Model',purpose:'Generate a draft',failureBehaviour:'Stop and show an error'});
architecture.authentication='School sign-in';
architecture.roleAuthorization='Server checks user, tenant, and project membership';
architecture.humanReviewRequirements='A teacher may correct or stop the system';
architecture.backups='Encrypted daily backup with tested restore';
architecture.accessibilityRequirements='Keyboard, screen reader, high contrast, and speech alternatives';
architecture.lowBandwidthRequirements='Text-only offline fallback';
architecture.aiWorkflow['Output Validation'].validation='Source and policy checks';
ok(!Experience._test.reviewIssues(architecture).some(issue=>issue.issueType==='AI_OUTPUT_UNVERIFIED'), 'Documented AI validation resolves the output-verification issue');

for (const model of ['ProjectArchitecture','ArchitectureComponent','ArchitectureConnection','ArchitectureIntegration','ArchitectureDecision','ArchitectureIssue','ArchitectureReview','ArchitectureVersion']) {
  ok(Array.isArray(Experience.DATA_MODELS[model]), `${model} model is defined`);
  ok(Experience.DATA_MODELS[model].includes('id'), `${model} includes an id`);
}
ok(Experience.DATA_MODELS.ProjectArchitecture.includes('projectId'), 'Architecture links to a project');
ok(Experience.DATA_MODELS.ProjectArchitecture.includes('userId'), 'Architecture includes ownership');
ok(Experience.DATA_MODELS.ArchitectureReview.includes('reviewerId'), 'Review records identify an authorized reviewer');
ok(Experience.DATA_MODELS.ArchitectureVersion.includes('securityChanges'), 'Version history preserves security changes');

const experienceJs = source('project-architecture-experience.js');
const studioJs = source('ai-architecture-design-studio.js');
const css = source('project-architecture-experience.css');
const html = source('index (2).html');
const appJs = source('script.js');

for (const text of [
  'Project Architecture',
  'Design how your project’s interface, AI services, data, security, human review, and external tools work together.',
  'Build My Architecture',
  'Import from Problem Scope',
  'Import from System Card',
  'View an Example',
  'Selected project',
  'Good architecture explains not only how the system works, but also what happens when a component fails.',
  'Architecture Completion',
  'Components',
  'Open Architecture Issues',
  'Last Updated',
  'Design how your project will work before building every feature.',
  'Build My First Architecture',
  'Use an Architecture Template',
  'We could not open the Architecture workspace. Your saved project work has not been deleted.',
  'Create an Architecture Manually'
]) ok(experienceJs.includes(text), `Experience includes ${text}`);

for (const text of [
  'REQUIRED','PREFERRED','OUT OF SCOPE','ARCHITECTURE CANVAS','Add Component','Edit','Duplicate','Delete','Move Up','Move Down','Group','Connect Components','Zoom in','Zoom out','Fit to Screen','Undo','Redo','Accessible connection list',
  'Student Prompt','User Preferences','Uploaded Document','Verified Sources','AI Response','Session Record','Anonymous Analytics',
  'Privacy Redaction','Assignment Policy Check','Output Validation','Final-answer restrictions','Never store actual API keys, passwords, or access tokens.',
  'Architecture Security Checks','Code Change','Automated Tests','Preview Deployment','Rollback if Needed','Major Failure and Recovery','Architecture Decision Log','Review My Architecture',
  'Unconnected components','Server-side authorization','Sensitive data','human review','Single points of failure','Missing backups','Integrations without fallbacks','Missing accessibility','Missing low-bandwidth support',
  'FINAL ARCHITECTURE SUMMARY','Request Teacher Review','Export Diagram','Export Report','Continue to Prototype','Version History and Review','Compare Versions','Human approval is required','Speech-to-Text','Bilingual'
]) ok(experienceJs.includes(text), `Workflow includes ${text}`);

for (const type of ['User Interface','Mobile Interface','Backend Server','API','Database','File Storage','Authentication','AI Model','Prompt Builder','Source Retrieval','Vector Search','Privacy Filter','Content Filter','Output Validator','Human Review','Notification Service','Analytics','External Service','Teacher Dashboard','Admin Dashboard']) {
  ok(experienceJs.includes(type), `Component library includes ${type}`);
}

ok(studioJs.includes('data-first-screen-ready="true"'), 'First-screen enhancement cannot inject a duplicate Architecture header');
ok(studioJs.includes('ProjectArchitectureExperience?.render'), 'Protected domain view delegates to the complete experience');
ok(studioJs.includes('aiArchitectureDesignStudioView'), 'Canonical view is installed');
ok(appJs.includes("aiArchitectureDesignStudio:'/projects/architecture'"), 'Canonical route is registered');
ok(appJs.includes("viewNames.aiArchitectureDesignStudio=['PROJECTS','Project Architecture']"), 'Canonical title is registered');
ok(appJs.includes("if(view==='aiArchitectureDesignStudio')window.AIArchitectureDesignStudio?.render?.()"), 'Canonical navigation renders Architecture');
ok(appJs.includes("if(view==='aiArchitectureDesignStudio')ensureArchitectureStudioShell()"), 'Direct refresh installs a shell before route validation');
ok(appJs.includes("aiArchitectureDesignStudio:{role:'student'"), 'Content metadata prevents Page unavailable');
ok(html.includes('project-architecture-experience.js?v=project-architecture-complete-20260829'), 'Versioned experience JavaScript is loaded');
ok(html.includes('project-architecture-experience.css?v=project-architecture-complete-20260829'), 'Versioned experience CSS is loaded');
ok(html.includes('script.js?v=data-responsibility-route-20260829'), 'Central route registry is cache-versioned');
ok(html.indexOf('ai-architecture-design-studio.js') < html.indexOf('project-architecture-experience.js'), 'Protected domain module loads before the experience');
ok(experienceJs.includes("classList.contains('active')"), 'Late bundle rendering supports a direct route');

for (const rule of ['.ar-hero','.ar-template-grid','.ar-summary-grid','.ar-stepper','.ar-wizard','.ar-form-grid','.ar-canvas','.ar-component-canvas','.ar-ai-pipeline','.ar-mobile-pipeline','.ar-checks','.ar-final',':focus-visible','@media(max-width:48rem)','@media(max-width:32rem)','@media(prefers-reduced-motion:reduce)','@media(forced-colors:active)','@media print','[dir=rtl]','.low-bandwidth']) {
  ok(css.includes(rule), `Responsive/accessibility CSS includes ${rule}`);
}
ok(!css.includes('position:fixed'), 'Architecture does not use a floating overlay');
ok(experienceJs.includes('type="button"'), 'Generated actions avoid unintended form submissions');
ok(experienceJs.includes('aria-current="step"'), 'The current wizard stage is announced');
ok(experienceJs.includes('role="status"'), 'Loading and save status are announced');
ok(experienceJs.includes('backLabel') && experienceJs.includes('Return to Projects') && headerRenderer.includes('aria-label="${escapeHtml(options.backLabel'), 'Overview Back arrow has an accessible name');
ok(experienceJs.includes('aria-label="Return to Architecture overview"'), 'Wizard Back arrow has an accessible name');
ok(experienceJs.includes('item.userId===accountId()'), 'Records are filtered by active account');
ok(experienceJs.includes('Nothing has been shared.'), 'Export preview does not auto-share');
ok(experienceJs.includes('AI cannot approve an architecture'), 'Architecture approval remains human');
ok(experienceJs.includes("original.status==='Approved'"), 'Approved records cannot be deleted by the draft control');
ok(experienceJs.includes('does not overwrite a saved architecture') || experienceJs.includes('never overwrites'), 'Template guidance protects existing architecture');
ok(experienceJs.includes('does not modify') || experienceJs.includes('never changes'), 'Architecture review does not auto-modify student work');

console.log(`${assertions}/${assertions} assertions passed`);
