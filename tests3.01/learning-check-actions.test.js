'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8'),src=read('ai-literacy-diagnostic.js'),css=read('ai-literacy-diagnostic.css'),html=read('index (2).html');
let passed=0;function test(name,fn){try{fn();passed++}catch(error){console.error(`FAIL: ${name}\n${error.stack}`);process.exitCode=1}}
test('all action labels remain exact',()=>['Start Learning Check','Choose a Pathway Instead','Review Privacy Information','Review Accessibility Settings'].forEach(label=>assert.ok(src.includes(label),label)));
test('existing handlers remain attached',()=>['data-diag-start','data-diag-exit','data-diag-privacy','data-diag-access'].forEach(handler=>assert.ok(src.includes(handler),handler)));
test('accessibility support action opens its existing workspace',()=>assert.ok(src.includes("if(e.target.closest('[data-diag-access]'))root.showView?.('accessibilityLanguage')")));
test('actions have a labelled shared navigation group',()=>assert.ok(src.includes('class="learning-check-intro-actions"')&&src.includes('aria-label="Learning Check actions"')));
test('primary and secondary actions are separated',()=>assert.ok(src.includes('learning-check-start-action')&&src.includes('learning-check-pathway-action')&&css.includes('.learning-check-main-actions{display:grid')));
test('support controls use compact link-style presentation',()=>assert.ok(src.includes('learning-check-support-actions')&&css.includes('background:transparent')&&css.includes('text-decoration:underline')));
test('layout has explicit gaps',()=>assert.ok(css.includes('gap:.85rem')&&css.includes('gap:.75rem')&&css.includes('gap:.2rem')));
test('mobile layout stacks without joined labels',()=>assert.ok(css.includes('@media(max-width:32rem)')&&css.includes('.learning-check-main-actions button,.learning-check-support-actions button{width:100%}')));
test('keyboard and forced-colour states remain visible',()=>assert.ok(css.includes(':focus-visible')&&css.includes('@media(forced-colors:active)')));
test('action assets use updated cache keys',()=>assert.ok(html.includes('ai-literacy-diagnostic.css?v=learning-check-actions-20260823')&&html.includes('ai-literacy-diagnostic.js?v=learning-check-actions-20260823')));
if(!process.exitCode)console.log(`learning-check-actions: ${passed}/${passed} assertions passed`);
