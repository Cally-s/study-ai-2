'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'competency-portfolio-runtime.js'),'utf8');
const css=fs.readFileSync(path.join(root,'competency-portfolio-runtime.css'),'utf8');

for(const text of ['Add My First Evidence','Import from AI Literacy Lab','Import a Learning Check','View Competencies']) assert.ok(source.includes(text),`${text} must be available in the useful empty state`);
assert.match(source,/data-add-competency-evidence=/,'Every competency card must offer Add Evidence');
assert.match(source,/portfolio-competency-description/,'Every competency card must include a student-facing description');
for(const competency of ['Human agency','AI ethics','AI foundations','Problem scoping','Human accountability','Safe and responsible AI use','Prompt and application skills','AI workflow design','Citizenship in the age of AI','Ethics by design','Creating AI tools','Iteration and feedback']) assert.ok(source.includes(competency),`${competency} must have visible explanatory content`);
assert.ok(source.includes('We could not load your portfolio. Your saved work has not been deleted.'),'The exact recoverable portfolio error must be present');
for(const action of ['Try Again','Return to Progress Tracker','Add Evidence Manually']) assert.ok(source.includes(action),`${action} must be available during a full loading error`);
assert.match(source,/try\{initializePortfolioViews\(\);refreshReviewStatusUI\(\);renderHelpfulPortfolioEmptyState\(\)\}catch\{\}/,'Secondary rendering failures must not blank the Portfolio');
assert.match(css,/\.portfolio-empty-actions/,'Empty-state actions must use a responsive action group');
assert.match(css,/\.portfolio-competency-actions/,'Competency actions must use a responsive action group');
console.log('competency portfolio complete-page tests passed');
