'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'..','learning-check-data.js'),'utf8'),html=fs.readFileSync(path.join(__dirname,'..','index (2).html'),'utf8');
let passed=0;function test(name,fn){try{fn();passed++}catch(error){console.error(`FAIL: ${name}\n${error.stack}`);process.exitCode=1}}
test('data adapter loads before setup',()=>assert.ok(html.indexOf('learning-check-data.js')<html.indexOf('learning-check-setup.js')));
test('authorization requires account and scopes guest device session',()=>assert.ok(src.includes('if(!value)throw Error')&&src.includes("id:'guest-device-session'")));
test('tenant owner cache key',()=>assert.ok(src.includes("organizationId||value.schoolId||'personal'")));
test('courses come from account',()=>assert.ok(src.includes('value.courses||[]')));
test('topics come from learning profile evidence',()=>assert.ok(src.includes('profile.topicPerformance')&&src.includes('profile.subjects')));
test('attempts and results use authorized repositories',()=>assert.ok(src.includes('listMine')));
test('skills and recommendations derive from results',()=>assert.ok(src.includes('deriveSkills(results)')&&src.includes('deriveRecommendations(results)')));
test('demo fixture requires explicit internal switch',()=>assert.ok(src.includes("localStorage.getItem(DEMO_KEY)==='true'")&&src.includes('developmentOnly:true')));
test('complete load states',()=>['idle','loading','ready','error'].forEach(x=>assert.ok(src.includes(`'${x}'`),x)));
if(!process.exitCode)console.log(`learning-check-data: ${passed}/${passed} assertions passed`);
