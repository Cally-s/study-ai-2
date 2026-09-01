const assert = require('assert');
const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, '..', 'prompt-writing-coach.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '..', 'prompt-writing-coach.css'), 'utf8');

assert.match(css, /\.guided-prompt-workspace\{display:grid;grid-template-columns:minmax\(0,1\.05fr\) minmax\(18rem,\.95fr\)/, 'desktop keeps builder left and preview right');
assert.match(css, /\.guided-prompt-workspace\{grid-template-areas:"builder preview"\}/);
assert.match(css, /\.guided-prompt-builder-column\{grid-area:builder\}/);
assert.match(css, /\.guided-prompt-preview\{grid-area:preview\}/);
assert.match(css, /@media\(max-width:56rem\)[\s\S]*?grid-template-areas:"builder" "preview"/, 'mobile stacks builder before preview');
assert.match(source, /aria-label="Prompt Builder sections"/);
assert.match(source, />Prompt Builder<\/a><a href="#guidedPromptPreviewPanel">Live Prompt Preview/);
assert.match(source, /destination\?\.scrollIntoView/);
assert.match(source, /destination\?\.focus/);
assert.match(css, /@media\(max-width:32rem\)/);
assert.match(css, /max-inline-size:100%/);
assert.match(css, /overflow-wrap:anywhere/);
assert.match(css, /min-height:44px/);
assert.match(css, /\.prompt-mobile-workspace-nav\{grid-template-columns:1fr\}/);
assert.doesNotMatch(css.match(/\.guided-prompt-preview\{grid-area:preview\}[\s\S]*$/)?.[0] || '', /position:(?:fixed|absolute)/);
assert.doesNotMatch(source, /window\.innerWidth|screen\.width/, 'responsive behavior must stay CSS-driven');

console.log('Prompt Coach mobile design tests passed');
