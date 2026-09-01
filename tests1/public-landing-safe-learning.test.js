'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index (2).html'),'utf8');
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
const flow=fs.readFileSync(path.join(root,'ai-coach-decision-flow-runtime.js'),'utf8');
const rules=fs.readFileSync(path.join(root,'core-decision-rules-runtime.js'),'utf8');
let count=0;
const ok=(value,message)=>{assert.ok(value,message);count++};

const landing=html.match(/<main id="landing"[\s\S]*?<\/main>/)?.[0]||'';
const technical=[
  'VERSIONED · DENY OVERRIDES ALLOW',
  'Core Decision Rules',
  'ASSIGNMENT_AI_NOT_ALLOWED',
  'ACTIVE_TEST_NO_ANSWERS',
  'POLICY_UNKNOWN_GUIDED_SUPPORT',
  'STUDENT_FINAL_ANSWER_LOCK',
  'AI Coach Decision Flow',
  'AI Coach Decision Flow started.',
  'load assignment ai policy',
  '&#x20;'
];

ok(Boolean(landing),'public landing page exists');
for(const text of technical)ok(!landing.includes(text),`public landing excludes ${text}`);
ok(landing.includes('SAFE, STUDENT-LED LEARNING'),'friendly safeguard section has a clear label');
ok(landing.includes('Helpful support, with you in control'),'friendly safeguard section has a welcoming heading');
ok(landing.includes('Your work stays private by default'),'privacy is explained in student language');
ok(landing.includes('Help adapts to your learning task'),'task-aware help is explained in student language');
ok(landing.includes('Sources and uncertainty are made clear'),'verification is explained in student language');
ok(css.includes('.safe-learning-section{display:grid'),'replacement section has a complete responsive layout');
ok(css.includes('@media(max-width:760px){.safe-learning-section{grid-template-columns:1fr'),'replacement section reflows on mobile');
ok(!flow.includes("root.document.querySelector('main')?.append(host)"),'decision-flow runtime never appends technical UI to the first main element');
ok(flow.includes("const host=root.document.getElementById('aiCoachDecisionFlowContent');if(!host)return null"),'technical workspace requires an explicit protected host');
ok(rules.includes("const host=root.document.getElementById('aiCoachDecisionFlowContent');if(!host)return null"),'core rules render only inside the protected workspace');
ok(flow.includes('executeAICoachDecisionFlow:execute'),'decision safeguards remain active');
ok(rules.includes('evaluateCoreDecisionRules:evaluate'),'core policy engine remains active');
ok((landing.match(/safe-learning-section/g)||[]).length===1,'friendly safeguard section appears once');

console.log(`public landing safe learning: ${count}/${count} assertions passed`);
