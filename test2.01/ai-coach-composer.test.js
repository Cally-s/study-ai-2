const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index (2).html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const modes = fs.readFileSync(path.join(root, 'learning-mode-selector.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
const composerCss = fs.readFileSync(path.join(root, 'coach-composer.css'), 'utf8');
const composerRuntime = fs.readFileSync(path.join(root, 'coach-composer.js'), 'utf8');

test('AI Coach exposes a labelled, editable multiline composer with intentional send', () => {
  assert.match(html, /<label for="coachInput">Ask StudySpark Coach<\/label>/);
  assert.match(html, /<textarea id="coachInput"[^>]*rows="3"[^>]*maxlength="2000"/);
  assert.match(html, /<button class="btn btn-primary coach-send-button" type="submit" disabled>Send<\/button>/);
  assert.match(html, /id="coachComposerStatus"[^>]*role="status"[^>]*aria-live="polite"/);
});

test('quick starts prefill the composer and never auto-send', () => {
  assert.match(html, /Optional quick starts/);
  assert.match(html, /data-coach-suggestion/);
  assert.match(script, /input\.value=button\.textContent\.trim\(\)/);
  assert.doesNotMatch(script, /sendCoach\(b\.textContent\)/);
  assert.match(script, /Quick-start text added\. Edit it if you want, then press Send\./);
});

test('extension panels cannot push the composer away from the conversation', () => {
  assert.match(script, /function keepCoachComposerVisible\(\)/);
  assert.match(script, /Type your question, explain what you need help with, or describe what you are working on…/);
  assert.match(script, /messages\.after\(suggestions\)/);
  assert.match(script, /suggestions\.after\(form\)/);
  assert.match(script, /new MutationObserver\(keepCoachComposerVisible\)/);
});

test('last-loaded composer safeguard repairs missing or hidden controls', () => {
  assert.match(html, /coach-composer\.css\?v=visible-composer-20260827/);
  assert.match(html, /coach-composer\.js\?v=visible-composer-20260827/);
  assert.match(composerRuntime, /Type your question or ask for help here…/);
  assert.match(composerRuntime, /if \(!form\) \{/);
  assert.match(composerRuntime, /form = composerMarkup\(\)/);
  assert.match(composerRuntime, /input\.readOnly = false/);
  assert.match(composerRuntime, /input\.disabled = false/);
  assert.match(composerRuntime, /suggestions\.after\(form\)/);
  assert.match(composerCss, /#coachView #coachInput \{/);
  assert.match(composerCss, /display: block !important/);
  assert.match(composerCss, /visibility: visible !important/);
  assert.match(composerCss, /position: sticky !important/);
});

test('submission runs privacy and policy preflight before sending', () => {
  const privacyIndex = script.indexOf('const privacyFinding=coachPrivacyFinding(q)');
  const preflightIndex = script.indexOf("new CustomEvent('studyspark:coach-message-before-send'");
  const sendIndex = script.indexOf('sendCoach(q);', preflightIndex);
  assert.ok(privacyIndex >= 0 && preflightIndex > privacyIndex && sendIndex > preflightIndex);
  assert.match(script, /DO_NOT_GIVE_ME_THE_FINAL_ANSWER/);
  assert.match(script, /activeTest/);
});

test('learning mode placement and responsive composer remain usable', () => {
  assert.match(modes, /input\.closest\('\.coach-composer-field'\)\|\|input/);
  assert.match(css, /#coachView #coachInput\{[^}]*width:100%[^}]*min-height:6rem/);
  assert.match(css, /#coachView #coachForm\.chat-input\{[^}]*display:grid!important[^}]*visibility:visible!important[^}]*opacity:1!important/);
  assert.match(css, /#coachView \.coach-send-button\{[^}]*min-height:44px/);
  assert.match(css, /@media\(max-width:640px\)\{#coachView \.chat-input\{grid-template-columns:1fr\}/);
});
