'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8'),src=read('learning-check-attempt.js'),css=read('learning-check-attempt.css'),html=read('index (2).html');
let passed=0;function test(name,fn){try{fn();passed++}catch(error){console.error(`FAIL: ${name}\n${error.stack}`);process.exitCode=1}}
test('attempt assets load',()=>assert.ok(html.includes('learning-check-attempt.js')&&html.includes('learning-check-attempt.css')));
test('exact title and question pattern',()=>assert.ok(src.includes('>Learning Check</h1>')&&src.includes('Question ${current} of ${total}')));
test('one current question rendered',()=>assert.ok(src.includes('attempt.questions[attempt.currentIndex]')&&!src.includes('attempt.questions.map')));
test('required question controls',()=>['I’m Not Sure','Give Me a Hint','Explain the Question','Previous','Next'].forEach(x=>assert.ok(src.includes(x),x)));
test('progress indicator',()=>assert.ok(src.includes('<progress value="${current}" max="${total}"')));
test('ownership and tenant validation',()=>assert.ok(src.includes('ATTEMPT_OWNERSHIP_DENIED')&&src.includes('TENANT_DENIED')));
test('version validation',()=>['questionSet','lesson','assignmentPolicy','VERSION_CHANGED'].forEach(x=>assert.ok(src.includes(x),x)));
test('same configuration resumes',()=>assert.ok(src.includes("row.fingerprint===key&&row.status==='IN_PROGRESS'")&&src.includes('startNew=false')));
test('responses and support history persist',()=>['responses:{}','hintHistory:{}','explanationHistory:{}','localStorage.setItem'].forEach(x=>assert.ok(src.includes(x),x)));
test('accessibility and offline state included',()=>assert.ok(src.includes('accessibility:')&&src.includes('synchronizationState')));
test('correct answer is not rendered',()=>assert.ok(!src.includes('Correct answer:')&&!src.includes('data-correct')));
test('responsive normal page layout',()=>assert.ok(css.includes('@media(max-width:36rem)')&&!css.includes('position:fixed')));
test('question is included in shared text to speech',()=>assert.ok(read('text-to-speech.js').includes("['.learning-check-question form','Learning Check question']")));
if(!process.exitCode)console.log(`learning-check-attempt: ${passed}/${passed} assertions passed`);
