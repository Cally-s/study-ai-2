'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const src=read('learning-check-setup.js'),dataSrc=read('learning-check-data.js'),css=read('learning-check-setup.css'),html=read('index (2).html');
let passed=0;function test(name,fn){try{fn();passed++}catch(error){console.error(`FAIL: ${name}\n${error.stack}`);process.exitCode=1}}
test('setup assets load',()=>assert.ok(html.includes('learning-check-setup.js')&&html.includes('learning-check-setup.css')));
test('setup introduction exact',()=>assert.ok(src.includes('Set Up Your Learning Check')&&src.includes('Choose what you would like to practise. You can review the settings before the questions begin.')));
test('six fields ordered',()=>{let at=-1;for(const label of ['Subject','Course or Grade','Topic','Difficulty','Number of Questions','Question Type']){const next=src.indexOf(label,at+1);assert.ok(next>at,label);at=next}});
test('required example exists only in development fixture',()=>['Mathematics','Grade 10','Quadratic Relations'].forEach(x=>assert.ok(dataSrc.includes(x),x)));
test('production setup uses account courses and topics',()=>assert.ok(src.includes('productionSetupHTML')&&src.includes('source.courses')&&src.includes('source.topicsByCourse')));
test('quick starts exact',()=>['Check My Current Topic','Review My Weakest Skill','Prepare for a Test','Mixed Review'].forEach(x=>assert.ok(src.includes(x),x)));
test('live summary labels present',()=>['Your Learning Check','Subject:','Course:','Topic:','Difficulty:','Questions:','Question Type:'].forEach(x=>assert.ok(src.includes(x),x)));
test('review is separate from confirmation',()=>assert.ok(src.includes('Review Your Learning Check')&&src.includes('Confirm and Start')&&src.includes('[data-learning-check-confirm]')));
test('existing controller begins questions',()=>assert.ok(src.includes('AILiteracyDiagnostic?.showDiagnostic')&&src.includes("start.dataset.setupConfirmed='true'")&&src.includes('start.click()')));
test('normal responsive page layout',()=>assert.ok(css.includes('@media(max-width:32rem)')&&!css.includes('position:fixed')));
if(!process.exitCode)console.log(`learning-check-setup: ${passed}/${passed} assertions passed`);
