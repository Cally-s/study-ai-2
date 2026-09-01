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
localStorage.setItem('studyspark_session_v1', 'student-problem-scope-test');
require('../problem-scope-experience.js');
const Experience = global.ProblemScopeExperience;

ok(Experience, 'Problem Scope experience exports a browser API');
equal(Experience.STEPS, [
  'Identify the Need',
  'Understand the People',
  'Investigate the Current Situation',
  'Define the Problem',
  'Decide Whether AI Is Appropriate',
  'Set Scope and Boundaries',
  'Plan Success Measures',
  'Review the Final Scope'
]);
equal(Experience.STATUSES, ['Draft', 'Research Needed', 'Stakeholder Feedback Needed', 'Ready for Review', 'Completed', 'Changes Requested', 'Archived']);
equal(Experience.TEMPLATES.map(item => item.title), ['School Challenge', 'Community Challenge', 'Accessibility Challenge', 'Environmental Challenge', 'Create My Own']);

const scope = Experience._test.emptyScope({ title: 'Transit information', category: 'Community' });
equal(scope.userId, 'student-problem-scope-test');
equal(scope.privateByDefault, true);
equal(scope.status, 'Draft');
equal(scope.title, 'Transit information');
equal(scope.category, 'Community');
ok(Array.isArray(scope.stakeholders), 'Stakeholders are structured records');
ok(Array.isArray(scope.evidence), 'Evidence is a structured record collection');
ok(Array.isArray(scope.existingSolutions), 'Existing solutions are a structured record collection');
ok(Array.isArray(scope.risks), 'Risks are a structured record collection');
ok(Array.isArray(scope.successMeasures), 'Success measures are a structured record collection');
ok(Experience._test.storageKey().endsWith(':student-problem-scope-test'), 'Storage is isolated by signed-in account');
equal(Experience.listScopes(), []);

const shortFeedback = Experience._test.statementFeedback(scope);
ok(shortFeedback.some(item => item.includes('too broad')), 'Problem statement feedback catches broad or missing statements');
scope.problemStatement = 'We will build an AI chatbot for students.';
const solutionFirstFeedback = Experience._test.statementFeedback(scope);
ok(solutionFirstFeedback.some(item => item.includes('proposed solution')), 'Problem statement feedback catches solution-first language');

for (const model of ['ProblemScope', 'ProblemStakeholder', 'ProblemEvidence', 'ExistingSolution', 'ProblemRisk', 'ProblemSuccessMeasure', 'ProblemScopeReview']) {
  ok(Array.isArray(Experience.DATA_MODELS[model]), `${model} model is defined`);
  ok(Experience.DATA_MODELS[model].includes('id'), `${model} includes an id`);
}
ok(Experience.DATA_MODELS.ProblemScope.includes('userId'), 'ProblemScope includes ownership');
ok(Experience.DATA_MODELS.ProblemScope.includes('projectId'), 'ProblemScope includes project linkage');
ok(Experience.DATA_MODELS.ProblemScopeReview.includes('reviewerId'), 'Reviews include the authorized reviewer');

const experienceJs = source('problem-scope-experience.js');
const studioJs = source('problem-scoping-studio.js');
const css = source('problem-scope-experience.css');
const html = source('index (2).html');
const appJs = source('script.js');

for (const text of [
  'Problem Scope',
  'Define the real problem, understand who is affected, and decide whether AI is an appropriate solution before building your project.',
  'Start Problem Scoping',
  'Continue Draft',
  'Try an Example',
  'Import Project Idea',
  'Begin with the community need, not with the technology you want to use.',
  'Create My First Problem Scope',
  'Your project starts with understanding the problem.',
  'We could not open Problem Scope. Your project work has not been deleted.',
  'Create a Problem Scope Manually',
  'Return to Projects'
]) ok(experienceJs.includes(text), `Experience includes ${text}`);

for (const text of [
  'Primary users',
  'People who may be excluded',
  'Research and Evidence',
  'Existing Solutions',
  'Check My Problem Statement',
  'AI May Be Appropriate',
  'A Non-AI Solution May Be Better',
  'IN SCOPE',
  'OUT OF SCOPE',
  'Human oversight',
  'Print Scope Canvas',
  'Request Stakeholder Feedback',
  'Add to Competency Portfolio',
  'Continue to Solution Design',
  'Speech-to-Text',
  'Scope language',
  'PRIVATE PROJECT DRAFT'
]) ok(experienceJs.includes(text), `Workflow includes ${text}`);

ok(studioJs.includes('data-first-screen-ready="true"'), 'The shared first-screen enhancer cannot inject a duplicate Problem Scope header');
ok(studioJs.includes('ProblemScopeExperience?.render'), 'The canonical view delegates to the complete experience');
ok(studioJs.includes('problemScopingStudioView'), 'The canonical view is installed');
ok(appJs.includes("'/projects/problem-scope'"), 'The canonical route is registered');
ok(appJs.includes("viewNames.problemScopingStudio=['PROJECTS','Problem Scope']"), 'The canonical view title is registered');
ok(appJs.includes("if(view==='problemScopingStudio')window.ProblemScopingStudio?.render?.()"), 'Direct route navigation renders the page');
ok(appJs.includes("if(view==='problemScopingStudio')ensureProblemScopingStudioShell()"), 'Direct refresh installs the route shell before validation');
ok(appJs.includes("problemScopingStudio:{role:'student'"), 'Route content metadata prevents Page unavailable');
ok(html.includes('problem-scope-experience.js?v=problem-scope-complete-20260829-2'), 'Versioned experience JavaScript is loaded');
ok(html.includes('problem-scope-experience.css?v=problem-scope-complete-20260829'), 'Versioned experience styles are loaded');
ok(html.includes('script.js?v=data-responsibility-route-20260829'), 'The route registry is cache-versioned with the fix');
ok(html.indexOf('problem-scoping-studio.js') < html.indexOf('problem-scope-experience.js'), 'The canonical domain module loads before the experience delegate');
ok(experienceJs.includes("classList.contains('active')"), 'The experience renders after late bundle loading');

for (const rule of [
  '.ps-hero',
  '.ps-template-grid',
  '.ps-stepper',
  '.ps-wizard-card',
  '.ps-form-grid',
  '.ps-wizard-actions',
  ':focus-visible',
  '@media (max-width: 48rem)',
  '@media (max-width: 25rem)',
  '@media (prefers-reduced-motion: reduce)',
  '@media (forced-colors: active)',
  '@media print',
  '[dir="rtl"]',
  '.low-bandwidth'
]) ok(css.includes(rule), `Responsive/accessibility CSS includes ${rule}`);
ok(!css.includes('position: fixed'), 'The workflow does not use a floating overlay');
ok(experienceJs.includes('type="button"'), 'Generated actions use non-submitting button types');
ok(experienceJs.includes('aria-current="step"'), 'The current wizard step is announced');
ok(experienceJs.includes('aria-live="polite"'), 'Save and review status is announced');
ok(experienceJs.includes('backLabel') && experienceJs.includes('Return to Projects') && headerRenderer.includes('aria-label="${escapeHtml(options.backLabel'), 'The overview back arrow has an accessible name');
ok(experienceJs.includes('aria-label="Return to Problem Scope overview"'), 'The wizard back arrow has an accessible name');
ok(experienceJs.includes("scope.userId === accountId()"), 'Stored scopes are filtered by the active user');
ok(experienceJs.includes('Nothing was shared automatically.'), 'Feedback requests do not auto-share');
ok(experienceJs.includes('automatic') === false || !/award.*automatic/i.test(experienceJs), 'The experience does not automatically award competency status');

console.log(`${assertions}/${assertions} assertions passed`);
