'use strict';
const assert=require('assert');
const fs=require('fs');
global.AILiteracyCompetencyProgress=require('../ai-literacy-competency-progress.js');
const Runtime=require('../competency-portfolio-runtime.js');
const source=fs.readFileSync(require('path').join(__dirname,'..','competency-portfolio-runtime.js'),'utf8');
const css=fs.readFileSync(require('path').join(__dirname,'..','competency-portfolio-runtime.css'),'utf8');
const competencySource=fs.readFileSync(require('path').join(__dirname,'..','ai-literacy-competency-progress.js'),'utf8');

assert.ok(source.includes('Competencies by Learning Area'),'Required learning-area heading must be visible');
for(const area of ['Understand','Apply','Create']) assert.ok(source.includes(`${area}'`)||source.includes(`'${area}'`),`${area} learning area must exist`);
for(const name of ['Human agency','AI ethics','AI foundations','Problem scoping','Human accountability','Safe and responsible AI use','Prompt and application skills','AI workflow design','Citizenship in the age of AI','Ethics by design','Creating AI tools','Iteration and feedback']) assert.ok((source+competencySource).includes(name),`${name} must use the required student-facing label`);
for(const status of ['Not Started','Exploring','Practising','Demonstrated','Applied Independently','Teacher Verified','Needs Review']) assert.ok(source.includes(status),`${status} must be an available exact student-facing status`);
for(const field of ['Progress','Evidence','Most recent activity','View Evidence']) assert.ok(source.includes(field),`Competency cards must show ${field}`);
assert.match(source,/data-view-competency-evidence/,'View Evidence must have a working delegated action');
assert.match(source,/No activity yet/,'Missing activity must be stated honestly');
assert.match(source,/role="progressbar" aria-label="\$\{c\.name\} progress"/,'Every competency must expose semantic progress');
assert.doesNotMatch(source,/fakeProgress|placeholderEvidence|sampleVerification/,'Production cards must not use fake fallback data');
assert.match(css,/\.portfolio-competency-grid/,'Competency cards must use a responsive shared grid');
assert.match(css,/@media\(max-width:48rem\)\{\.portfolio-competency-grid\{grid-template-columns:1fr/,'Competency cards must become one column on narrow screens');

const actor={userId:'learning-area-student',tenantId:'learning-area-school',role:'STUDENT'};
const overview=Runtime.getCompetencyPortfolioOverview(actor);
assert.deepStrictEqual(overview.learningAreas.map(x=>x.label),['Understand','Apply','Create'],'Areas must follow the required order');
assert.deepStrictEqual(overview.learningAreas.map(x=>x.competencies.length),[4,4,4],'Each canonical learning area must contain four competencies');
const names=overview.learningAreas.flatMap(x=>x.competencies.map(c=>c.name));
assert.deepStrictEqual(names.slice(0,4),['Human agency','AI ethics','AI foundations','Problem scoping'],'Understand must use the required ordering and labels');
assert.deepStrictEqual(names.slice(4,8),['Human accountability','Safe and responsible AI use','Prompt and application skills','AI workflow design'],'Apply must use the required ordering and labels');
assert.deepStrictEqual(names.slice(8),['Citizenship in the age of AI','Ethics by design','Creating AI tools','Iteration and feedback loops'],'Create must use the required ordering and labels');
for(const competency of overview.learningAreas.flatMap(x=>x.competencies)){
  assert.strictEqual(competency.status,'Not Started','No evidence must produce the honest Not Started status');
  assert.strictEqual(competency.progressStep,0,'No evidence must produce a real zero progress stage');
  assert.strictEqual(competency.evidenceCount,0,'No evidence must produce a real zero evidence count');
  assert.strictEqual(competency.mostRecentActivity,null,'No evidence must not fabricate a date');
}

console.log('competency portfolio learning-area tests passed');
