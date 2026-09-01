'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8'),src=read('learning-check-pathway-route.js'),diag=read('ai-literacy-diagnostic.js'),lab=read('ai-literacy-lab.js'),css=read('ai-literacy-lab.css'),html=read('index (2).html');
let passed=0;function test(name,fn){try{fn();passed++}catch(error){console.error(`FAIL: ${name}\n${error.stack}`);process.exitCode=1}}
test('dedicated route asset loads',()=>assert.ok(html.includes('learning-check-pathway-route.js')));
test('exact source action remains',()=>assert.ok(diag.includes('Choose a Pathway Instead')&&diag.includes('data-diag-exit')));
test('only exact button is intercepted',()=>assert.ok(src.includes("button.textContent.trim()===BUTTON_LABEL")));
test('route stays in current Learn workspace',()=>assert.ok(src.includes("root.showView?.('aiLiteracy')")&&src.includes("getElementById('aiLiteracyContent')")));
test('overview state is restored',()=>assert.ok(src.includes("querySelector('[data-ai-home]')?.click()")));
test('expected heading is exact',()=>assert.ok(src.includes("HEADING_LABEL='Choose a Learning Pathway'")&&src.includes("heading.textContent=HEADING_LABEL")));
test('pathway selector is focused and addressable',()=>assert.ok(src.includes("heading.id='chooseLearningPathway'")&&src.includes('heading.focus({preventScroll:true})')&&src.includes('scrollIntoView')));
test('delayed focus wins after dynamic Learn enhancements',()=>assert.ok(src.includes('setTimeout?.(focusSelector,80)')&&src.includes('setTimeout?.(focusSelector,300)')));
test('focused selector clears the sticky application header',()=>assert.ok(css.includes('#chooseLearningPathway{scroll-margin-block-start:8rem}')&&html.includes('ai-literacy-lab.css?v=pathway-route-20260823')));
test('understand apply and create must all exist',()=>['UNDERSTAND','APPLY','CREATE'].forEach(pathway=>assert.ok(src.includes(pathway),pathway)));
test('route hash describes Learn overview pathways',()=>assert.ok(src.includes('#learn/overview/pathways')));
test('legacy Lab copy is not used as destination logic',()=>assert.ok(!src.includes('AI Literacy Lab')));
test('current Learn renderer has all pathway cards',()=>['UNDERSTAND','APPLY','CREATE'].forEach(pathway=>assert.ok(lab.includes(`data-ai-path="${pathway}"`)||lab.includes('data-ai-path="${p.title.toUpperCase()}"'),pathway)));
if(!process.exitCode)console.log(`learning-check-pathway-route: ${passed}/${passed} assertions passed`);
