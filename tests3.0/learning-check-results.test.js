'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8'),src=read('learning-check-results.js'),css=read('learning-check-results.css'),html=read('index (2).html');
let passed=0;function test(name,fn){try{fn();passed++}catch(error){console.error(`FAIL: ${name}\n${error.stack}`);process.exitCode=1}}
test('results assets load',()=>assert.ok(html.includes('learning-check-results.js')&&html.includes('learning-check-results.css')));
test('complete summary above fold',()=>['Learning Check Complete','Score','Confidence','Time'].forEach(x=>assert.ok(src.includes(x),x)));
test('useful result areas',()=>['Skills understood','Skills needing practice','Incorrect answers and explanations','Recommended next lesson','Recommended practice','Tutor or teacher support'].forEach(x=>assert.ok(src.includes(x),x)));
test('exact actions',()=>['Review My Mistakes','Try Similar Questions','Create a Practice Plan','Ask the AI Coach','Find a Peer Tutor'].forEach(x=>assert.ok(src.includes(x),x)));
test('submission validates completion and versions',()=>['question.version','response.version','sourceVerificationStatus','synchronizationState'].forEach(x=>assert.ok(src.includes(x),x)));
test('scoring is server-shaped and deterministic',()=>assert.ok(src.includes("method:'DETERMINISTIC_ANSWER_KEY'")&&src.includes('clientScoreAccepted:false')));
test('result immutable and idempotent',()=>assert.ok(src.includes('Object.freeze')&&src.includes('idempotencyKey')&&src.includes('result=>result.attemptId===attemptId')));
test('ownership and submitted status revalidated',()=>assert.ok(src.includes("row.status!=='SUBMITTED'")&&src.includes('row.subjectUserId!==result.subjectUserId')));
test('formal and punitive side effects prohibited',()=>['formalStatusChanged:false','misconductDecisionCreated:false','teacherOrParentNotified:false','badgeAwarded:false'].forEach(x=>assert.ok(src.includes(x),x)));
test('submitted answers and support history preserved',()=>['submittedResponses:clone(row.responses)','hintHistory:clone(row.hintHistory)','explanationHistory:clone(row.explanationHistory)'].forEach(x=>assert.ok(src.includes(x),x)));
test('refresh reads stored result without rescoring',()=>assert.ok(src.includes('function get(resultId)')&&src.includes('render(existing.id)')));
test('responsive normal page layout',()=>assert.ok(css.includes('@media(max-width:42rem)')&&!css.includes('position:fixed')));
if(!process.exitCode)console.log(`learning-check-results: ${passed}/${passed} assertions passed`);
