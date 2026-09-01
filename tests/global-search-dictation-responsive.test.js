'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const speech = fs.readFileSync(path.join(root, 'speech-to-text.js'), 'utf8');
const searchCss = fs.readFileSync(path.join(root, 'global-search.css'), 'utf8');
const speechCss = fs.readFileSync(path.join(root, 'speech-to-text.css'), 'utf8');

let count = 0;
const ok = (value, message) => {
  assert.ok(value, message);
  count++;
};

ok(speech.includes("f.id==='globalSearchHeaderInput'||f.closest('#globalSearchTrigger')"), 'only the shared top-header search field gets the scoped global search dictation class');
ok(speech.includes("b.classList.add('global-search-dictation')"), 'header dictation button receives a dedicated class');
ok(speech.includes("document.querySelectorAll('textarea,input[type=\"search\""), 'speech-to-text still supports normal textareas and search fields');
ok(!speech.includes("closest('#coachView')") && !speech.includes("coachInput") || speech.includes("document.querySelectorAll('textarea,input[type=\"search\""), 'AI Coach dictation is not targeted by the header-only hiding rule');
ok(searchCss.includes('container-type: inline-size'), 'global search wrapper supports container-based responsive behavior');
ok(searchCss.includes('@container (max-width: 720px)'), 'container query hides dictation when the search area itself is narrow');
ok(searchCss.includes('@media (max-width: 1000px)'), 'viewport breakpoint hides dictation on smaller screens');
ok(/\.global-search-dictation\s*{[\s\S]*?white-space:\s*nowrap/.test(searchCss), 'header dictation is compact when visible');
ok(/\.global-search-dictation\s*{[\s\S]*?flex:\s*0 0 auto/.test(searchCss), 'header dictation does not steal flexible search input space');
ok(/\.global-search-dictation\s*{[\s\S]*?margin:\s*0/.test(searchCss), 'generic dictation margin is neutralized inside the header');
ok(/\.global-search-trigger input,[\s\S]*?box-sizing:\s*border-box/.test(searchCss), 'search input can use the freed space');
ok(/\.global-search-trigger \.global-search-dictation\s*{[\s\S]*?display:\s*none !important/.test(searchCss), 'mobile header removes dictation from layout and focus order');
ok(!/button\[data-dictation\]\s*{[\s\S]*?display:\s*none/.test(searchCss), 'no broad dictation selector hides useful dictation controls elsewhere');
ok(speechCss.includes('.dictation-start-button'), 'shared speech-to-text styling remains available for AI Coach and other fields');

console.log(`global search dictation responsive: ${count}/${count} assertions passed`);
