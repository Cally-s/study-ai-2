'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const script=read('script.js');
const shell=read('first-screen-navigation.js');
const css=read('first-screen-navigation.css');
const html=read('index (2).html');

assert.match(shell,/class="study-page-back"/,'shared header renders the Back control');
assert.match(shell,/data-study-page-back/,'Back control has a stable action hook');
assert.match(shell,/aria-label="Go back to previous StudySpark page"/,'arrow-only control has an accessible name');
assert.match(shell,/title="Back"><span aria-hidden="true">←<\/span>/,'only the arrow is displayed visually');
assert.match(shell,/key==='dashboard'\?'':/,'Dashboard does not show a misleading Back control');
assert.match(shell,/StudySparkPageBack\?\.goBack\(\)/,'shared click handler uses StudySpark navigation');
assert.match(shell,/tabindex="-1"/,'destination page title can receive programmatic focus');

assert.match(script,/const studySparkViewHistory=\[\]/,'navigation maintains an internal view stack');
assert.match(script,/studySparkViewHistory\.length>60/,'history is bounded');
assert.match(script,/PageContentRequirement\[view\]\?\.minimumContentReady!==false/,'invalid and internal pages are excluded');
assert.match(script,/await showView\(destination,\{fromBack:true\}\)/,'Back reuses the protected central navigation function');
assert.match(script,/if\(!moved\)return false/,'cancelled navigation retains the current page');
assert.match(script,/if\(choice==='cancel'\)return false/,'unsaved Study Plan protection is preserved');
assert.match(script,/if\(!leave\)return false/,'unsaved editor protection is preserved');
assert.match(script,/academicRecovery:'planner'/,'Recovery Plan has a safe parent fallback');
assert.match(script,/planDetail:'savedPlans'/,'Study Plan detail has a safe parent fallback');
assert.match(script,/aiDiagnostic:'aiLiteracy'/,'Learning Check has a safe parent fallback');

assert.match(css,/\.study-page-back\{position:static/,'Back control remains in normal header layout');
assert.match(css,/inline-size:40px;block-size:40px/,'Back control is compact with an accessible target');
assert.match(css,/@media\(max-width:42rem\)[\s\S]*grid-template-columns:auto minmax\(0,1fr\)/,'mobile header keeps arrow beside the title');
assert.match(css,/:focus-visible/,'keyboard focus is visible');
assert.match(css,/@media\(forced-colors:active\)/,'forced-colour mode is supported');
assert.match(css,/@media print[\s\S]*\.study-page-back/,'Back control is excluded from print');

assert.match(html,/style\.css\?v=study-together-account-gate-v2-20260831/,'existing main stylesheet remains loaded and cache-busted');
assert.match(html,/first-screen-navigation\.css\?v=study-together-dedupe-20260831/,'Back styles are cache-busted');
assert.match(html,/script\.js\?v=study-together-account-gate-v2-20260831/,'central router is cache-busted');
assert.match(html,/first-screen-navigation\.js\?v=study-together-routefix-20260831/,'shared page shell is cache-busted');

console.log('page Back navigation tests passed');
