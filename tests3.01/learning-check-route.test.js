'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'..','script.js'),'utf8'),diag=fs.readFileSync(path.join(__dirname,'..','ai-literacy-diagnostic.js'),'utf8');
let passed=0;function test(name,fn){try{fn();passed++}catch(error){console.error(`FAIL: ${name}\n${error.stack}`);process.exitCode=1}}
test('router recognizes Learning Check view',()=>assert.ok(src.includes("aiDiagnostic:['LEARN','Learning Check']")));
test('content registry marks route ready',()=>assert.ok(src.includes("aiDiagnostic:{role:'student'")&&src.includes('minimumContentReady:true')));
test('diagnostic installer creates registered view',()=>assert.ok(diag.includes('id="aiDiagnosticView"')));
test('route controller renders after navigation',()=>assert.ok(diag.includes("showView('aiDiagnostic');render(view)")));
if(!process.exitCode)console.log(`learning-check-route: ${passed}/${passed} assertions passed`);
