const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index (2).html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'ai-coach-alignment.css'), 'utf8');
const commands = fs.readFileSync(path.join(root, 'ai-accessibility-commands.js'), 'utf8');

test('AI Coach loads a final local alignment stylesheet after composer and response tools CSS', () => {
  const composerIndex = html.indexOf('coach-composer.css');
  const toolsIndex = html.indexOf('coach-response-tools.css');
  const alignmentIndex = html.indexOf('ai-coach-alignment.css?v=coach-fullscreen-focus-20260831');
  assert.ok(composerIndex >= 0, 'composer CSS is loaded');
  assert.ok(toolsIndex > composerIndex, 'response tools CSS loads after composer CSS');
  assert.ok(alignmentIndex > toolsIndex, 'alignment CSS loads last');
});

test('AI Coach page shell uses equal gutters without viewport-width overflow', () => {
  assert.match(css, /\.ai-coach-page-shell,\n#coachView \{/);
  assert.match(css, /max-width: 1600px/);
  assert.match(css, /margin-inline: auto/);
  assert.match(css, /padding-inline: clamp\(16px, 2vw, 24px\)/);
  assert.doesNotMatch(css, /width:\s*100vw/);
});

test('two-column Coach layout can shrink without pushing the sidebar off-screen', () => {
  assert.match(css, /grid-template-columns: minmax\(0, 1fr\) minmax\(280px, 340px\)/);
  assert.match(css, /#coachView \.coach-layout > \*/);
  assert.match(css, /min-width: 0/);
  assert.match(css, /@media \(max-width: 1100px\)[\s\S]*grid-template-columns: 1fr/);
});

test('sidebar and cards stay inside the page shell', () => {
  for (const selector of ['.ai-coach-sidebar', '.ai-coach-card', '.response-tools-card', '.sidebar-card']) {
    assert.ok(css.includes(selector), `${selector} is covered by the shared containment rules`);
  }
  assert.match(css, /overflow-wrap: anywhere/);
  assert.match(css, /#coachView \.coach-side-panel,[\s\S]*position: static/);
});

test('Response Tools section keeps a clean inset and responsive two-card grid', () => {
  assert.match(commands, /response-tools-card response-tools-section/);
  assert.match(commands, /response-tools-heading/);
  assert.match(commands, /response-tools-grid/);
  assert.match(css, /#coachView \.response-tools-section,[\s\S]*padding: clamp\(16px, 2vw, 24px\)/);
  assert.match(css, /#coachView \.response-tools-heading,[\s\S]*margin: 0 0 14px/);
  assert.match(css, /#coachView \.response-tools-grid,[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*grid-template-columns: 1fr/);
});

test('composer and tool buttons wrap without widening their cards', () => {
  assert.match(css, /#coachView input,[\s\S]*max-width: 100%/);
  assert.match(css, /#coachView #coachInput,[\s\S]*width: 100%/);
  assert.match(css, /#coachView \.coach-composer-meta \{[\s\S]*flex-wrap: wrap/);
  assert.match(css, /#coachView \.tool-button,[\s\S]*white-space: normal/);
  assert.match(css, /#coachView \.tool-button,[\s\S]*overflow-wrap: anywhere/);
});
