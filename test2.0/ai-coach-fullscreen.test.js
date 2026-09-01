'use strict';

const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index (2).html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'academic-coach-support.css'), 'utf8');
const alignmentStyles = fs.readFileSync(path.join(root, 'ai-coach-alignment.css'), 'utf8');

test('AI Coach exposes one visible chat-only full screen control', () => {
  assert.match(html, /id="coachFullScreenToggle"/);
  assert.match(html, />Full Screen Chat<\/span>/);
  assert.match(html, /aria-label="Open AI Coach chat in full screen"/);
  assert.match(html, /data-icon="Maximize2"/);
  assert.match(html, /coach-conversation-heading[\s\S]*id="coachFullScreenToggle"/);
  assert.match(html, /id="chatMessages" class="chat-messages" role="log" aria-live="polite" aria-relevant="additions"/);
  assert.equal((html.match(/coachFullScreenToggle/g) || []).length, 1);
});

test('full screen mode preserves the app route and exits through Escape', () => {
  const start = script.indexOf('function setCoachFullScreen(active');
  const end = script.indexOf('function keepCoachComposerVisible', start);
  const coachFullScreenCode = script.slice(start, end);

  assert.match(script, /function setCoachFullScreen\(active/);
  assert.match(script, /view\.dataset\.fullScreen=next\?'true':'false'/);
  assert.match(script, /ai-coach-fullscreen-active/);
  assert.match(script, /coachFullScreenScrollY=window\.scrollY/);
  assert.match(script, /coachFullScreenMessageScrollTop=messages\?\.scrollTop/);
  assert.match(script, /event\.key==='Escape'/);
  assert.match(script, /coachFullScreenNestedLayerOpen\(\)/);
  assert.match(script, /getComputedStyle\(layer\)/);
  assert.match(script, /rect\.width>0&&rect\.height>0/);
  assert.match(script, /coachFullScreenLastFocus\.focus/);
  assert.match(script, /Full Screen Chat/);
  assert.match(script, /Exit full-screen AI Coach chat/);
  assert.doesNotMatch(coachFullScreenCode, /requestFullscreen\(/);
});

test('full screen chat layout hides non-chat panels and keeps the composer visible', () => {
  assert.match(styles, /#coachView\[data-full-screen="true"\]/);
  assert.match(styles, /body\.ai-coach-fullscreen-active/);
  assert.match(styles, /z-index: 2000/);
  assert.match(styles, /#coachView\[data-full-screen="true"\] \.coach-side-panel,[\s\S]*#coachView\[data-full-screen="true"\] \.suggestions,[\s\S]*#coachView\[data-full-screen="true"\] \.ai-accessibility-commands/);
  assert.match(styles, /display: none !important/);
  assert.match(styles, /#coachView\[data-full-screen="true"\] \.chat-card \{[\s\S]*grid-template-rows: minmax\(0, 1fr\) auto/);
  assert.match(styles, /#coachView\[data-full-screen="true"\] #coachForm\.chat-input/);
  assert.match(alignmentStyles, /#coachView\[data-full-screen="true"\] > :not\(#coachFullScreenHeader\):not\(\.coach-layout\)/);
  assert.match(alignmentStyles, /#coachView\[data-full-screen="true"\] \.chat-card > :not\(#chatMessages\):not\(#coachForm\)/);
  assert.match(styles, /height: 100dvh/);
  assert.match(styles, /@media \(max-width: 760px\)/);
});
