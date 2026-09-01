'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
global.AILiteracyCompetencyProgress=require('../ai-literacy-competency-progress.js');
const Runtime=require('../competency-portfolio-runtime.js');
const source=fs.readFileSync(path.join(root,'competency-portfolio-runtime.js'),'utf8');
const css=fs.readFileSync(path.join(root,'competency-portfolio-runtime.css'),'utf8');

for(const label of ['Competency Overview','Competencies Demonstrated','Competencies in Progress','Evidence Items','Teacher-Verified Skills','Overall Competency Progress']){
  assert.ok(source.includes(label),`Portfolio overview must display ${label}`);
}
assert.ok(source.includes('See the skills supported by your learning evidence and which areas are still developing.'),'Portfolio overview must display the required description');
assert.match(source,/role="progressbar"/,'Overall progress must use the progressbar role');
assert.match(source,/aria-valuemin="0"/,'Overall progress must expose its minimum');
assert.match(source,/aria-valuemax="\$\{data\.totalCompetencies\}"/,'Overall progress maximum must come from real competency data');
assert.match(source,/aria-valuenow="\$\{data\.competenciesDemonstrated\}"/,'Overall progress value must come from real competency data');
assert.doesNotMatch(source,/12 of 20 competencies demonstrated/,'Example counts must not become production fallback data');
assert.match(css,/\.portfolio-overview-grid/,'Overview cards must use a shared responsive layout');

const actor={userId:'portfolio-overview-student',tenantId:'portfolio-overview-school',role:'STUDENT'};
let overview=Runtime.getCompetencyPortfolioOverview(actor);
assert.strictEqual(overview.totalCompetencies,global.AILiteracyCompetencyProgress._test.BLOCKS.length,'Total competencies must come from the canonical competency model');
assert.strictEqual(overview.evidenceItems,0,'A student with no portfolio evidence must receive a real zero');
assert.strictEqual(overview.competenciesDemonstrated,0,'A student with no decisions must receive a real zero');

const created=Runtime.createCompetencyPortfolio({idempotencyKey:'overview-create'},actor);
Runtime.addPortfolioItem({portfolioId:created.portfolio.id,idempotencyKey:'overview-item',itemType:'OTHER',sourceSystem:'TEST_FIXTURE',sourceArtifactId:'reflection-1',sourceArtifactVersion:1,title:'My reflection',competencyLinkIds:[global.AILiteracyCompetencyProgress._test.BLOCKS[0].id],teacherReviewReferenceIds:['teacher-review-1']},actor);
overview=Runtime.getCompetencyPortfolioOverview(actor);
assert.strictEqual(overview.evidenceItems,1,'Evidence count must reflect authorized portfolio records');
assert.strictEqual(overview.teacherVerifiedSkills,1,'Teacher-verified skills must be counted uniquely from real review references');
assert.strictEqual(overview.score,null,'Portfolio overview must not invent a score');
assert.strictEqual(overview.ranking,null,'Portfolio overview must not rank students');

console.log('competency portfolio overview tests passed');
