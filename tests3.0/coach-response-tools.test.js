const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index (2).html'), 'utf8');
const runtime = fs.readFileSync(path.join(root, 'ai-accessibility-commands.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'coach-response-tools.css'), 'utf8');

test('response tools have a labelled group and separated generated controls', () => {
  assert.match(runtime, /ai-response-tools-title/);
  assert.match(runtime, />Response Tools<\/h3>/);
  assert.match(runtime, />Explanation<\/h4>/);
  assert.match(runtime, />Language and Vocabulary<\/h4>/);
  assert.match(runtime, /ai-response-action-list/);
  assert.match(runtime, /\.join\(' '\)/);
  assert.match(runtime, /setAttribute\('aria-label','Response Tools for the latest StudySpark Coach message'\)/);
});

test('response tools sit directly after the composer and target the latest response', () => {
  assert.match(runtime, /function placeLatestResponseTools\(\)/);
  assert.match(runtime, /form\.after\(latest\)/);
  assert.match(runtime, /bar\.dataset\.sourceResponseId=responseId/);
  assert.match(runtime, /latest\.dataset\.coachResponseToolsActive='true'/);
  assert.match(runtime, /document\.getElementById\(src\.responseId\)/);
  assert.match(runtime, /if\(bar!==latest\)bar\.remove\(\)/);
});

test('all seven response actions remain available', () => {
  for (const label of [
    'Make Simpler',
    'Add More Detail',
    'Translate',
    'Show Bilingual',
    'Define Key Words',
    'Show Step by Step',
    'Give Another Example'
  ]) assert.ok(runtime.includes(label), `${label} remains available`);
});

test('final toolbar styles wrap cleanly on desktop and mobile', () => {
  assert.match(html, /coach-response-tools\.css\?v=separated-tools-20260827/);
  assert.match(css, /\.ai-response-action-list \{[\s\S]*flex-wrap: wrap !important/);
  assert.match(css, /gap: \.5rem !important/);
  assert.match(css, /\.ai-response-tools-groups \{[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 600px\)[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 360px\)[\s\S]*grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(css, /focus-visible/);
  assert.match(css, /forced-colors/);
});
