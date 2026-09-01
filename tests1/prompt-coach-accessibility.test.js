const assert = require('assert');
const fs = require('fs');
const path = require('path');
const P = require('../prompt-writing-coach');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'prompt-writing-coach.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'prompt-writing-coach.css'), 'utf8');

for (const step of P._test.guidedBuilderSteps) {
  assert.ok(step.title, 'every guided field has a visible title');
  assert.ok(step.description, 'every guided field has persistent help');
}
assert.match(source, /<label id="guidedPromptStepTitle" for="guidedPromptField">/);
assert.match(source, /aria-describedby="guidedPromptHelp"/);
assert.match(source, /Speech-to-Text/);
assert.match(source, /Review Speech-to-Text Transcript/);
assert.match(source, /Use This Text/);
assert.match(source, /raw audio/i, 'Speech copy must explain that audio is not retained');
assert.match(source, /Listen to Completed Prompt/);
assert.match(source, /Stop Listening/);
assert.match(source, /speechSynthesis/);
assert.match(source, /Text-only presentation/);
assert.match(source, /Bilingual prompt/);
assert.match(source, /Primary language/);
assert.match(source, /Second language/);
assert.match(source, /Accessibility Settings/);
assert.match(source, /getMyEffectiveAccessibilityLanguagePreferences/);
assert.match(source, /lowBandwidthPreference/);
assert.match(source, /root\.showView\?\.\('accessibilityLanguage'\)/);
assert.match(source, /dir', 'auto'/);
assert.match(source, /event\.key === 'ArrowRight'/);
assert.match(source, /event\.key === 'Home'/);

assert.match(css, /--accessibility-text-scale/);
assert.match(css, /data-high-contrast="ENABLED"/);
assert.match(css, /data-reduced-motion="ENABLED"/);
assert.match(css, /data-low-bandwidth="ENABLED"/);
assert.match(css, /\[dir="rtl"\]/);
assert.match(css, /@media\(max-width:20rem\)/);
assert.match(css, /@media\(forced-colors:active\)/);
assert.match(css, /:focus-visible/);

const handoff = source.match(/function useGuidedPromptWithCoach[\s\S]*?\n  \}/)?.[0] || '';
assert.match(handoff, /academicIntegrityCheck/);
assert.match(handoff, /scanPromptPrivacy/);
assert.match(source, /NEVER_REVEAL_FINAL_ANSWER_IN_THIS_MODE/);
assert.match(source, /OPEN_AND_REVIEW_SOURCES/);
assert.doesNotMatch(source.match(/function startPromptSpeechInput[\s\S]*?\n  \}/)?.[0] || '', /sendApprovedPromptDraft|handoffGuidedPrompt|saveGuidedPromptDraft/);
assert.doesNotMatch(source.match(/function listenToGuidedPrompt[\s\S]*?\n  \}/)?.[0] || '', /sendApprovedPromptDraft|handoffGuidedPrompt/);

console.log('Prompt Coach accessibility tests passed');
