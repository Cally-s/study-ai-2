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
localStorage.setItem('studyspark_session_v1', 'student-system-card-test');
require('../system-card-experience.js');
const Experience = global.SystemCardExperience;

ok(Experience, 'System Card experience exports a browser API');
equal(Experience.STEPS, [
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
equal(Experience.STATUSES, ['Draft', 'Needs Testing', 'Needs Safety Review', 'Ready for Review', 'Approved', 'Archived']);
equal(Experience.REVIEW_STATUSES, ['Not Submitted', 'Submitted', 'Under Review', 'Changes Requested', 'Safety Review Required', 'Approved']);
equal(Experience.RISK_CATEGORIES, ['Personal information', 'Inaccurate information', 'Unsafe advice', 'Academic-integrity misuse', 'Bias', 'Harassment', 'Unauthorized access', 'AI overdependence']);
equal(Experience.TEST_CATEGORIES, ['Accuracy', 'Privacy', 'Safety', 'Bias', 'Accessibility', 'Reliability', 'Weak internet', 'Incorrect input', 'Missing information', 'Misuse']);

const card = Experience._test.blankCard({systemName:'Community Guide', projectName:'Access Project'});
equal(card.userId, 'student-system-card-test');
equal(card.privateByDefault, true);
equal(card.status, 'Draft');
equal(card.reviewStatus, 'Not Submitted');
equal(card.systemName, 'Community Guide');
equal(card.projectName, 'Access Project');
equal(card.version, '0.1');
ok(Array.isArray(card.inputs), 'Inputs are structured records');
ok(Array.isArray(card.outputs), 'Outputs are structured records');
ok(Array.isArray(card.components), 'Components are structured records');
ok(Array.isArray(card.limitations), 'Limitations are structured records');
ok(Array.isArray(card.risks), 'Risks are structured records');
ok(Array.isArray(card.tests), 'Tests are structured records');
ok(Array.isArray(card.reviews), 'Reviews are structured records');
ok(Array.isArray(card.versions), 'Versions are structured records');
ok(Experience._test.storageKey().endsWith(':student-system-card-test'), 'Storage is isolated by signed-in account');
equal(Experience.listCards(), []);

for (const model of ['SystemCard','SystemComponent','SystemDataRecord','SystemRisk','SystemTestCase','SystemCardReview','SystemCardVersion']) {
  ok(Array.isArray(Experience.DATA_MODELS[model]), `${model} model is defined`);
  ok(Experience.DATA_MODELS[model].includes('id'), `${model} includes an id`);
}
ok(Experience.DATA_MODELS.SystemCard.includes('projectId'), 'SystemCard links to a project');
ok(Experience.DATA_MODELS.SystemCard.includes('userId'), 'SystemCard includes ownership');
ok(Experience.DATA_MODELS.SystemCardReview.includes('reviewerId'), 'Reviews identify the authorized reviewer');
ok(Experience.DATA_MODELS.SystemCardVersion.includes('changedSections'), 'Versions preserve changed sections');

const experienceJs = source('system-card-experience.js');
const studioJs = source('ai-system-card-studio.js');
const css = source('system-card-experience.css');
const html = source('index (2).html');
const appJs = source('script.js');

for (const text of [
  'System Card',
  'Explain what your AI system does, who it is designed for, how it works, what its limitations are, and how people remain in control.',
  'Create System Card',
  'Continue Draft',
  'Import from Problem Scope',
  'View an Example',
  'A System Card should explain both what the system can do and when it should not be used.',
  'Card Completion',
  'Open Risks',
  'Testing Completed',
  'Last Updated',
  'Document how your AI system works before you release it.',
  'Create My First System Card',
  'Learn What a System Card Includes',
  'We could not open the System Card. Your project information has not been deleted.',
  'Create a System Card Manually'
]) ok(experienceJs.includes(text), `Experience includes ${text}`);

for (const text of [
  'System name',
  'Responsible student or team',
  'Non-AI alternative considered',
  'INTENDED USES',
  'NOT DESIGNED FOR',
  'User Input',
  'Privacy Check',
  'AI Processing',
  'Verification',
  'Human Review',
  'AI model',
  'External service',
  'WHAT THE SYSTEM CAN DO',
  'WHAT THE SYSTEM CANNOT RELIABLY DO',
  'Risk Register',
  'FAIRNESS',
  'ACCESSIBILITY',
  'Escalation flows',
  'Total Tests',
  'Retest result',
  'FINAL SYSTEM CARD',
  'Request Teacher Review',
  'Create Public Summary',
  'Add to Competency Portfolio',
  'Continue to Prototype Testing',
  'Version History',
  'Compare Versions',
  'Speech-to-Text',
  'Bilingual'
]) ok(experienceJs.includes(text), `Workflow includes ${text}`);

for (const text of Experience.ACCESSIBILITY_CHECKS) ok(experienceJs.includes(text), `Accessibility checklist includes ${text}`);

ok(studioJs.includes('data-first-screen-ready="true"'), 'The shared first-screen enhancer cannot inject a duplicate System Card header');
ok(studioJs.includes('SystemCardExperience?.render'), 'The canonical domain view delegates to the complete experience');
ok(studioJs.includes('aiSystemCardStudioView'), 'The canonical view is installed');
ok(appJs.includes("aiSystemCardStudio:'/projects/system-card'"), 'The canonical route is registered');
ok(appJs.includes("viewNames.aiSystemCardStudio=['PROJECTS','System Card']"), 'The canonical view title is registered');
ok(appJs.includes("if(view==='aiSystemCardStudio')window.AISystemCardStudio?.render?.()"), 'Canonical navigation renders the System Card');
ok(appJs.includes("if(view==='aiSystemCardStudio')ensureSystemCardStudioShell()"), 'Direct refresh installs the System Card shell before validation');
ok(appJs.includes("aiSystemCardStudio:{role:'student'"), 'Route metadata prevents Page unavailable');
ok(html.includes('system-card-experience.js?v=system-card-complete-20260829'), 'Versioned experience JavaScript is loaded');
ok(html.includes('system-card-experience.css?v=system-card-complete-20260829'), 'Versioned experience CSS is loaded');
ok(html.includes('script.js?v=data-responsibility-route-20260829'), 'The route registry is cache-versioned');
ok(html.indexOf('ai-system-card-studio.js') < html.indexOf('system-card-experience.js'), 'The protected domain module loads before its experience delegate');
ok(experienceJs.includes("classList.contains('active')"), 'Late bundle loading renders an already-active direct route');

for (const rule of [
  '.sc-hero',
  '.sc-summary-grid',
  '.sc-stepper',
  '.sc-wizard-card',
  '.sc-form-grid',
  '.sc-balanced',
  '.sc-system-flow',
  '.sc-flow-list',
  '.sc-wizard-actions',
  ':focus-visible',
  '@media(max-width:48rem)',
  '@media(max-width:32rem)',
  '@media(prefers-reduced-motion:reduce)',
  '@media(forced-colors:active)',
  '@media print',
  '[dir=rtl]',
  '.low-bandwidth'
]) ok(css.includes(rule), `Responsive/accessibility CSS includes ${rule}`);

ok(!css.includes('position:fixed'), 'The System Card does not use a floating overlay');
ok(experienceJs.includes('type="button"'), 'Generated controls do not accidentally submit forms');
ok(experienceJs.includes('aria-current="step"'), 'The current wizard step is announced');
ok(experienceJs.includes('role="status"'), 'Save and loading states are announced');
ok(experienceJs.includes('backLabel') && experienceJs.includes('Return to Projects') && headerRenderer.includes('aria-label="${escapeHtml(options.backLabel'), 'The overview Back arrow has an accessible name');
ok(experienceJs.includes('aria-label="Return to System Card overview"'), 'The wizard Back arrow has an accessible name');
ok(experienceJs.includes('card.userId === accountId()'), 'Stored cards are filtered by the active account');
ok(experienceJs.includes('Nothing has been shared.'), 'Sharing requires a student preview');
ok(experienceJs.includes('AI cannot approve it'), 'AI cannot approve a System Card');
ok(experienceJs.includes("original.status==='Approved'"), 'Approved versions cannot be deleted from the student UI');
ok(experienceJs.includes('Never enter secret keys'), 'The component workflow warns against secret keys');
ok(experienceJs.includes('private notes, personal information, secret keys, security details, and private AI conversations'), 'Share previews exclude protected information');

console.log(`${assertions}/${assertions} assertions passed`);
