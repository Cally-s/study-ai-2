const assert = require('assert');
const fs = require('fs');
const path = require('path');
const P = require('../prompt-writing-coach');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'prompt-writing-coach.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'prompt-writing-coach.css'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const navigation = fs.readFileSync(path.join(root, 'first-screen-navigation.js'), 'utf8');

assert.deepStrictEqual(P._test.promptComparisonExamples.map((item) => item.subject), ['Mathematics', 'Science', 'Writing', 'Research', 'Coding', 'Test Preparation']);
for (const example of P._test.promptComparisonExamples) {
  for (const field of ['weakPrompt', 'strongPrompt', 'whatChanged', 'whyBetter', 'verification', 'starterTemplateId']) assert.ok(example[field], `${example.subject} requires ${field}`);
  assert.strictEqual(example.automaticallySaved, false);
  assert.strictEqual(example.automaticallySent, false);
}

for (const label of ['Weak Prompt vs. Strong Prompt', 'Weak Prompt', 'Strong Prompt', 'What Changed', 'Why the Strong Prompt Is Better', 'What Still Requires Verification', 'Use Strong Prompt', 'Improve the Weak Prompt']) assert.ok(source.includes(label), `missing ${label}`);
assert.ok(source.includes('not automatically better because it is longer'));
assert.doesNotMatch(source, /Prompt Quality:\s*\d+%/);
assert.match(script, /promptLearn:'\/ai-coach\/prompt-coach\/learn'/);
assert.match(script, /promptLearn:'promptWithPurpose'/);
assert.match(navigation, /promptLearn:\{title:'Weak Prompt vs\. Strong Prompt'/);
assert.match(source, /data-prompt-examples>View Examples/);
assert.match(source, /data-template-examples>View Examples/);
assert.match(source, /function useStrongPromptExample[\s\S]*?saved = false[\s\S]*?has not been saved or sent/);
assert.match(source, /function improveWeakPromptExample[\s\S]*?newImprovePromptState\(\)[\s\S]*?has not been replaced, saved, or sent/);
assert.doesNotMatch(source.match(/function useStrongPromptExample[\s\S]*?\n  \}/)?.[0] || '', /createPromptDraftVersion|saveGuidedPromptDraft|sendApprovedPromptDraft/);
assert.doesNotMatch(source.match(/function improveWeakPromptExample[\s\S]*?\n  \}/)?.[0] || '', /createPromptDraftVersion|saveImprovedPrompt|sendApprovedPromptDraft/);
assert.match(css, /\.prompt-example-pair\{display:grid/);
assert.match(css, /@media\(max-width:52rem\)\{\.prompt-example-pair,\.prompt-example-explanation\{grid-template-columns:1fr\}/);
assert.doesNotMatch(css.match(/\.prompt-examples-shell[\s\S]*$/)?.[0] || '', /position:fixed/);

console.log('prompt-coach-helpful-examples: all assertions passed');
