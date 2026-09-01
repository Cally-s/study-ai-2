const assert = require('assert');
const fs = require('fs');
const path = require('path');
const P = require('../prompt-writing-coach');

const source = fs.readFileSync(path.join(__dirname, '..', 'prompt-writing-coach.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '..', 'prompt-writing-coach.css'), 'utf8');
const states = Object.values(P.PromptCoachPageState);

assert.deepStrictEqual(states, [
  'Loading', 'No prompts yet', 'Prompt being built', 'Prompt ready', 'Prompt saved', 'Privacy warning',
  'Policy warning', 'Unable to load templates', 'Unable to save prompt', 'Offline', 'Reconnecting'
]);
assert.ok(source.includes('We could not load Prompt Coach. Your work has not been deleted.'));
assert.match(source, /function renderPromptCoachLoadError[\s\S]*?data-prompt-state-retry/);
assert.match(source, /data-prompt-page-state="No prompts yet"/);
assert.match(source, /function promptBuilderPageState[\s\S]*?PRIVACY_WARNING[\s\S]*?POLICY_WARNING[\s\S]*?SAVED[\s\S]*?READY[\s\S]*?BUILDING/);
assert.match(source, /PROMPT_PAGE_STATES\.TEMPLATE_ERROR/);
assert.match(source, /state\.saveError = true/);
assert.match(source, /root\.addEventListener\('offline'/);
assert.match(source, /root\.addEventListener\('online'/);
assert.match(source, /PROMPT_PAGE_STATES\.RECONNECTING/);
assert.match(source, /Your current work remains on this device/);
assert.match(source, /target\.innerHTML = promptPageStateHTML\(PROMPT_PAGE_STATES\.LOADING/);
assert.match(source, /catch \{ renderPromptCoachLoadError\(target\); \}/);
assert.match(css, /\.prompt-page-state\{/);
assert.match(css, /@media\(max-width:36rem\)\{\.prompt-page-state\{grid-template-columns:1fr\}/);
assert.match(css, /@media\(forced-colors:active\)\{\.prompt-page-state/);
assert.doesNotMatch(css.match(/\.prompt-page-state[\s\S]*$/)?.[0] || '', /position:fixed/);

console.log('Prompt Coach page states tests passed');
