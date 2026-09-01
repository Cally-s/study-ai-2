const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const helpCentre = require('../help-centre.js');
const css = read('help-centre.css');
const html = read('index (2).html');
const languageTools = read('ai-coach-language-tools.js');
const tts = read('text-to-speech.js');
const plainLanguage = read('plain-language.js');
const script = read('script.js');

assert.equal(helpCentre.HELP_HOME_ROUTE, '/help', 'Help Centre keeps the canonical Help route');
assert.deepEqual(helpCentre.REQUIRED_GUIDE_IDS, [
  'getting-started',
  'personalize',
  'ai-coach',
  'responsible-ai',
  'learning',
  'assignments',
  'peer-tutoring',
  'projects',
  'progress',
  'privacy-and-troubleshooting',
], 'Help Centre exposes the ten required guide IDs in order');

assert.equal(helpCentre.HELP_GUIDES.length, 10, 'exactly ten main Help guides are available');
assert.equal(new Set(helpCentre.HELP_GUIDES.map(guide => guide.id)).size, 10, 'guide IDs are unique');

for (const guide of helpCentre.HELP_GUIDES) {
  assert.ok(guide.route.startsWith('/help/'), `${guide.title} uses a Help route`);
  assert.ok(guide.title, `${guide.id} has a title`);
  assert.ok(guide.description, `${guide.id} has a description`);
  assert.ok(guide.icon, `${guide.id} has an icon`);
  assert.match(guide.readingTime, /^About \d+ minutes$/, `${guide.id} has a reading time`);
  assert.ok(guide.quickQuestion, `${guide.id} has a quick-answer question`);
  assert.ok(guide.quickAnswer, `${guide.id} has a quick answer`);
  assert.ok(guide.steps.length >= 3, `${guide.id} has at least three guide steps`);
  assert.ok(guide.steps.length <= 6, `${guide.id} has no more than six guide steps`);
  guide.steps.forEach((step, index) => {
    assert.ok(step.anchor, `${guide.id} step ${index + 1} has a direct section anchor`);
    assert.ok(step.title, `${guide.id} step ${index + 1} has a title`);
    assert.ok(step.body, `${guide.id} step ${index + 1} has body copy`);
  });
}

const guideTitles = helpCentre.HELP_GUIDES.map(guide => guide.title);
assert.deepEqual(guideTitles, [
  'Getting Started',
  'Personalize StudySpark',
  'Learn With the AI Coach',
  'Check AI Answers and Use AI Responsibly',
  'Learn, Practise, and Check Understanding',
  'Assignments and Catch-Up Support',
  'Peer Tutoring and Community Service',
  'Build a Community AI Project',
  'Track and Show Your Progress',
  'Privacy, Offline Access, and Technical Help',
], 'student-facing guide titles match the requested topics');

assert.equal(helpCentre.POPULAR_HELP.length, 6, 'six popular Help entries are available');
for (const label of [
  'Ask the AI Coach',
  'Change Language or Accessibility Settings',
  'Catch Up on Missing Work',
  'Verify an AI Answer',
  'Start a Community AI Project',
  'Restore Unsaved Work',
]) {
  assert.ok(helpCentre.POPULAR_HELP.some(item => item.label === label), `${label} is a Popular Help entry`);
}

assert.match(helpCentre._test.guideSearchText(helpCentre.HELP_GUIDES.find(guide => guide.id === 'responsible-ai')), /verify.*answer|answer.*verify/i, 'responsible AI guide is searchable by verification terms');
assert.match(helpCentre._test.guideSearchText(helpCentre.HELP_GUIDES.find(guide => guide.id === 'assignments')), /catch up|missing work|recovery/i, 'assignments guide is searchable by catch-up terms');
assert.match(helpCentre._test.guideSearchText(helpCentre.HELP_GUIDES.find(guide => guide.id === 'personalize')), /language|accessibility|text size/i, 'personalization guide is searchable by language and accessibility terms');
const naturalSearchTokens = helpCentre._test.searchTokens('How do I verify an AI answer?');
const responsibleAISearchText = helpCentre._test.guideSearchText(helpCentre.HELP_GUIDES.find(guide => guide.id === 'responsible-ai'));
assert.ok(naturalSearchTokens.every(token => responsibleAISearchText.includes(token)), 'natural search for “verify an AI answer” finds the responsible AI guide');

const migrationMap = helpCentre.getStepMigrationMap();
for (let step = 1; step <= 73; step += 1) {
  assert.ok(migrationMap[step], `legacy Help step ${step} has a redirect destination`);
  assert.match(migrationMap[step], /^\/help\//, `legacy Help step ${step} redirects to a Help guide`);
}
assert.equal(migrationMap[14], '/help/ai-coach#learning-modes', 'example legacy step 14 redirects to AI Coach learning modes');
assert.equal(migrationMap[29], '/help/responsible-ai#verify-an-answer', 'example legacy step 29 redirects to Verify an Answer');
assert.equal(migrationMap[51], '/help/projects#system-card', 'example legacy step 51 redirects to System Card');

for (const state of [
  'No search results',
  'Guide unavailable',
  'Content loading',
  'Offline',
  'Reconnecting',
  'Old step redirected',
  'Unexpected error',
]) {
  assert.ok(helpCentre.HELP_PAGE_STATES.includes(state), `${state} page state is supported`);
  assert.match(read('help-centre.js'), new RegExp(state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${state} message exists in Help Centre script`);
}

assert.match(html, /help-centre\.css\?v=task-help-centre-compact-search-20260831/, 'Help Centre CSS is loaded');
assert.match(html, /help-centre\.js\?v=task-help-centre-compact-search-20260831/, 'Help Centre script is loaded after existing app scripts');
assert.match(html, /script\.js\?v=help-centre-child-routes-20260831/, 'main app script cache tag includes Help child route fix');
assert.ok(html.indexOf('coach-response-workspace.js') < html.indexOf('help-centre.js'), 'Help Centre runs after existing route and workspace scripts');
assert.match(script, /\/\^\\\/help\(\?:\\\/\|\$\)\//, 'main app router recognizes Help child routes');
assert.match(script, /view==='instructions'&&\/\^\\\/help\(\?:\\\/\|\$\)\//, 'main app route sync preserves direct Help child routes');

assert.match(read('help-centre.js'), /Help Centre/, 'Help home title is present');
assert.match(read('help-centre.js'), /What do you need help with\?/, 'Help home subtitle is present');
assert.match(read('help-centre.js'), /Search StudySpark Help/, 'search field label is present');
assert.match(read('help-centre.js'), /Open Guide/, 'guide cards expose Open Guide actions');
assert.match(read('help-centre.js'), /Quick Answer/, 'each guide can render a Quick Answer block');
assert.match(read('help-centre.js'), /Was this helpful\?/, 'guide footer includes feedback prompt');
assert.match(read('help-centre.js'), /Back to Help Centre/, 'guide footer includes Back to Help Centre');
assert.match(read('help-centre.js'), /Contact Support/, 'guide footer includes Contact Support');

assert.doesNotMatch(read('help-centre.js'), /Step \d+ of 73/, 'Help Centre never renders Step X of 73');
assert.doesNotMatch(read('help-centre.js'), /73 steps completed|18 of 73/, 'Help Centre does not add completion pressure');
assert.doesNotMatch(read('help-centre.js'), /<details[\s\S]*73/i, 'old 73-step list is not hidden in one accordion');

assert.match(css, /\.help-topic-grid[\s\S]*repeat\(3,\s*minmax\(0,\s*1fr\)\)/, 'desktop Help cards use a three-column grid');
assert.match(css, /@media \(max-width: 1080px\)[\s\S]*repeat\(2,\s*minmax\(0,\s*1fr\)\)/, 'tablet Help cards use a two-column grid');
assert.match(css, /@media \(max-width: 680px\)[\s\S]*grid-template-columns: 1fr/, 'mobile Help cards stack into one column');
assert.match(css, /:focus-visible/, 'visible keyboard focus is styled');
assert.match(css, /@media \(forced-colors: active\)/, 'forced-colours mode is supported');
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/, 'reduced motion is supported');

assert.match(languageTools, /\.help-guide-step/, 'compact support row can attach to Help guide steps');
assert.match(tts, /\.instruction-grid article,\.help-guide-step/, 'text-to-speech supports Help guide steps');
assert.match(plainLanguage, /\.instruction-grid article,\.help-guide-step/, 'plain-language support treats Help guide steps as lesson instructions');

console.log('help-centre tests passed');
