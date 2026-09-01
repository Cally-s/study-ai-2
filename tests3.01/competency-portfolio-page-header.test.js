'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const runtime=fs.readFileSync(path.join(root,'competency-portfolio-runtime.js'),'utf8');
const script=fs.readFileSync(path.join(root,'script.js'),'utf8');
const navigation=fs.readFileSync(path.join(root,'sidebar-navigation.js'),'utf8');
const firstScreen=fs.readFileSync(path.join(root,'first-screen-navigation.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index (2).html'),'utf8');

assert.match(runtime,/id='competencyPortfolioView'|id="competencyPortfolioView"|s\.id='competencyPortfolioView'/,'Portfolio must install as one canonical app view');
assert.match(runtime,/<h1 id="competencyPortfolioTitle"[^>]*>\$\{TITLE\}<\/h1>/,'Portfolio title must be a visible page heading');
assert.match(runtime,/Collect evidence of what you have learned, reflect on your progress, and show the skills you can apply independently\./,'Portfolio must show the required student-facing description');
assert.match(runtime,/data-study-page-back/,'Portfolio must use the shared Back control');
assert.match(runtime,/Your competency portfolio is ready to begin\./,'Portfolio must have the exact first-time empty-state heading');
assert.match(runtime,/Add work that shows what you understand, what you can apply, and what you have created\./,'Portfolio must have the exact first-time empty-state guidance');
assert.match(runtime,/Private by default/,'Portfolio must preserve a clear privacy summary');
assert.match(script,/competencyPortfolio:'\/progress\/portfolio'/,'Portfolio must use the canonical Progress route');
assert.match(script,/'\/learn\/portfolio':'competencyPortfolio'/,'Learn legacy route must resolve to the canonical view');
assert.match(script,/'\/competency-portfolio':'competencyPortfolio'/,'root legacy route must resolve to the canonical view');
assert.match(script,/competencyPortfolio:\{role:'student'.*minimumContentReady:true/,'Portfolio must be registered as non-blank released content');
assert.match(firstScreen,/competencyPortfolio:'\/progress\/portfolio'/,'Portfolio cards must advertise the canonical route');
assert.match(navigation,/'student-progress':\[[^\]]*'competencyPortfolio'/,'Portfolio must belong to Progress navigation');
assert.doesNotMatch(navigation,/'student-projects':\[[^\]]*'competencyPortfolio'/,'Portfolio must not remain duplicated under Projects');
assert.match(html,/competency-portfolio-runtime\.js\?v=portfolio-complete-20260825/,'Portfolio runtime changes must not be masked by a stale browser cache');

console.log('competency portfolio page header tests passed');
