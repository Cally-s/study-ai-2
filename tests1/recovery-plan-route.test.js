'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const navigation=read('first-screen-navigation.js');
const recovery=read('academic-recovery.js');
const html=read('index (2).html');

assert.match(navigation,/\['Recovery Plan','academicRecovery'\]/,'Recovery Plan targets the released workflow');
assert.doesNotMatch(navigation,/\['Recovery Plan','recoveryDashboard'\]/,'stale unavailable route is removed');
assert.match(navigation,/openAcademicRecovery\(\{entrySource:'ASSIGNMENT_TRACKER',sourceRouteKey:'planner',openAsRecoveryPlan:true\}/,'shortcut opens assignment-scoped recovery');
assert.match(recovery,/input\.openAsRecoveryPlan === true \? 'Recovery Plan' : COPY\.title/,'Recovery Plan entry receives the expected page title');
assert.match(recovery,/assignmentContext = input\.entrySource === 'ASSIGNMENT_TRACKER' \? resolveAssignment\(input\) : null/,'real saved assignment context is resolved');
assert.match(recovery,/data-recovery-resume/,'existing plans can be continued');
assert.match(recovery,/data-recovery-edit/,'existing plan setup can be edited');
assert.match(recovery,/getMySession\(resume\.dataset\.recoveryResume, currentActor\(\)\)/,'continue loads the authorized existing recovery session');
assert.match(recovery,/Existing recovery plan opened\. No new plan or assignment record was created\./,'continuing does not duplicate storage');
assert.match(recovery,/StudySpark will not invent an assignment, deadline, or progress record/,'missing assignment state is honest');
assert.match(html,/academic-recovery\.js\?v=recovery-plan-route-20260824/,'updated recovery workflow is cache-busted');
assert.match(html,/first-screen-navigation\.js\?v=study-together-routefix-20260831/,'updated shortcut is cache-busted');

console.log('recovery-plan route tests passed');
