'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'competency-portfolio-runtime.js'),'utf8');
const css=fs.readFileSync(path.join(root,'competency-portfolio-runtime.css'),'utf8');

for(const text of ['Portfolio View','Competency View','Timeline View','Search Portfolio','Sort by Newest','Sort by Competency','Show Drafts','Show Verified Evidence']){
  assert.ok(source.includes(text),`Portfolio must include the exact control: ${text}`);
}
for(const filter of ['competency','subject','area','status','evidenceType','date','teacherVerified']){
  assert.match(source,new RegExp(`data-portfolio-filter=["']${filter}["']`),`Portfolio must expose the ${filter} filter`);
}
assert.match(source,/if\(portfolioViewState\.view==='timeline'\)\{region\.innerHTML=renderTimeline\(records\);return\}/,'Timeline View must replace the primary view instead of stacking below it');
assert.match(source,/region\.innerHTML=areas\.length\?renderLearningAreas/,'Competency View must reuse the same primary view region');
assert.doesNotMatch(source,/mockPortfolio|fakeEvidence|sampleEvidence|demoPortfolio/i,'Production portfolio views must not use demo records');
assert.match(css,/@media\(max-width:36rem\).*portfolio-filter-grid\{grid-template-columns:1fr\}/,'Portfolio filters must collapse without horizontal scrolling');

global.AILiteracyCompetencyProgress=require('../ai-literacy-competency-progress.js');
const api=require('../competency-portfolio-runtime.js');
const student={userId:'portfolio-filter-student',tenantId:'portfolio-filter-school',role:'STUDENT'};
api.savePortfolioEvidenceDraft({
  evidenceType:'LEARNING_CHECK_RESULT',
  title:'Quadratic learning check',
  competencyId:'problem-scoping',
  courseOrSubject:'Mathematics',
  description:'My own learning-check evidence.',
  dateCompleted:'2026-08-24',
  sharingPreference:'ONLY_ME'
},student);
api.savePortfolioEvidenceDraft({
  evidenceType:'WRITTEN_REFLECTION',
  title:'Source reflection',
  competencyId:'human-agency',
  courseOrSubject:'English',
  description:'My own source reflection.',
  dateCompleted:'2026-08-20',
  sharingPreference:'ONLY_ME'
},student);
const records=api.getCompetencyPortfolioRecords(student);
assert.strictEqual(records.length,2,'Portfolio view data must come from the signed-in student records');
assert.deepStrictEqual(new Set(records.map(record=>record.subject)),new Set(['Mathematics','English']));
assert.ok(records.every(record=>record.status==='DRAFT'&&!record.teacherVerified),'Drafts must remain honestly labelled and unverified');
assert.throws(()=>api.getCompetencyPortfolioRecords({userId:'teacher',tenantId:student.tenantId,role:'COURSE_TEACHER'}),/Student role required/,'Portfolio records must preserve role authorization');
assert.deepStrictEqual(api.getCompetencyPortfolioRecords({userId:'other-student',tenantId:student.tenantId,role:'STUDENT'}),[],'Students must not see another student’s evidence');

console.log('competency portfolio filters and views tests passed');
