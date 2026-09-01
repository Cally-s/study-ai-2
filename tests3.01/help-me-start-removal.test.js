'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(['.git','.DS_Store'].includes(entry.name))continue;const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(/\.(?:html|js|css|md|json)$/.test(entry.name)&&!['implementation-report (1).md','help-me-start-removal.test.js'].includes(entry.name))files.push(full)}}
walk(root);
const source=files.map(file=>fs.readFileSync(file,'utf8')).join('\n');
for(const text of ['Help Me Start for 10 Minutes','Help me start for 10 minutes','Help Me Start','10-Minute Start','TenMinuteStart','TenMinutePlan','TenMinuteButton','QuickStart','StartPlan','HelpMeStart','GettingStartedCard'])assert.ok(!source.toLowerCase().includes(text.toLowerCase()),`removed phrase or identifier: ${text}`);
const html=fs.readFileSync(path.join(root,'index (2).html'),'utf8');
assert.ok(!html.includes('academic-recovery-start-ten.js'));
assert.ok(!html.includes('academic-recovery-start-ten.css'));
for(const file of ['academic-recovery-start-ten.js','academic-recovery-start-ten.css','tests/academic-recovery-start-ten.test.js'])assert.ok(!fs.existsSync(path.join(root,file)),`removed feature file: ${file}`);
console.log('help-me-start-removal: all assertions passed');
