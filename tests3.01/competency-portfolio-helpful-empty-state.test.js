'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const source=fs.readFileSync(path.join(__dirname,'..','competency-portfolio-runtime.js'),'utf8');

assert.match(source,/Your competency portfolio is ready to begin\./,'The exact empty-state heading must be visible');
assert.match(source,/Add work that shows what you understand, what you can apply, and what you have created\./,'The exact empty-state guidance must be visible');
assert.match(source,/selectedEvidence\.length===0&&submittedEvidence\.length===0/,'Empty state must require no selected and no submitted evidence');
assert.match(source,/selectedEvidence=\[\.\.\.items\.values\(\)\].*subjectUserId===a\.userId/,'Selected evidence check must be student-owned');
assert.match(source,/submittedEvidence=\[\.\.\.evidenceSubmissions\.values\(\)\].*subjectUserId===a\.userId/,'Submitted evidence check must be student-owned');
assert.match(source,/draftsExcluded:true,loadingFailure:false/,'Private drafts and loading failures must not be misrepresented as submitted evidence');
assert.match(source,/else if\(!state\.selectedEvidenceCount&&region\.querySelector\('\.portfolio-empty-state'\)\)region\.innerHTML=''/,'A submitted evidence record must remove the first-time empty state even before it is selected into the Portfolio');
assert.match(source,/d\.querySelector\('#portfolioOverviewGrid \.portfolio-overview-error'\)/,'The empty-state decorator must not replace a loading failure with first-time messaging');

console.log('competency portfolio helpful empty-state tests passed');
