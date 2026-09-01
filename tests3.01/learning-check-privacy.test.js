'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8'),src=read('learning-check-privacy.js'),css=read('learning-check-privacy.css'),html=read('index (2).html');
let passed=0;function test(name,fn){try{fn();passed++}catch(error){console.error(`FAIL: ${name}\n${error.stack}`);process.exitCode=1}}
test('shared privacy assets load',()=>assert.ok(html.includes('learning-check-privacy.css')&&html.includes('learning-check-privacy.js')));
test('one shared panel covers every Learning Check state',()=>['data-diag-start','.learning-check-setup','.learning-check-setup-state','.learning-check-question','.learning-check-results','.learning-check-submit'].forEach(value=>assert.ok(src.includes(value),value)));
test('privacy check and reminder remain',()=>['PRIVACY CHECK','Protect Your Privacy','Leave out private information','Use safe learning details'].forEach(value=>assert.ok(src.includes(value),value)));
test('sensitive categories are prose rather than chips',()=>['full names','student numbers','home addresses','phone numbers','passwords','medical details'].forEach(value=>assert.ok(src.includes(value),value)));
test('redaction workflow remains available',()=>['Remove it, generalize it, or replace it with a placeholder.','Preview exactly what will be sent.','cancel without sending'].forEach(value=>assert.ok(src.includes(value),value)));
test('safety and secure channel rules remain',()=>assert.ok(src.includes('fictional or synthetic examples')&&src.includes('approved school or support channel')&&src.includes('High-risk secrets')));
test('full privacy lesson remains reachable',()=>assert.ok(src.includes('data-prompt-privacy')&&src.includes('Open the full privacy lesson')));
test('legacy notice is replaced without deleting privacy',()=>assert.ok(src.includes('learning-check-legacy-privacy')&&css.includes('.learning-check-legacy-privacy{display:none')));
test('panel is responsive and accessible',()=>assert.ok(src.includes('aria-labelledby')&&src.includes('<details')&&css.includes('@media(max-width:42rem)')&&css.includes(':focus-visible')&&css.includes('@media(forced-colors:active)')));
test('no privacy chip or pill styling exists',()=>assert.ok(!src.includes('PrivacyChip')&&!src.includes('PrivacyBadge')&&!css.includes('display:inline-block')));
if(!process.exitCode)console.log(`learning-check-privacy: ${passed}/${passed} assertions passed`);
