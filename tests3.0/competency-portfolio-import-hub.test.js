'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
require('../competency-portfolio-runtime.js');
const I=global.CompetencyPortfolioImport;
const runtime=fs.readFileSync(path.join(root,'competency-portfolio-runtime.js'),'utf8');
const script=fs.readFileSync(path.join(root,'script.js'),'utf8');
const css=fs.readFileSync(path.join(root,'competency-portfolio-runtime.css'),'utf8');
const student={userId:'import-student',tenantId:'import-school',role:'STUDENT'};
const other={userId:'other-student',tenantId:'import-school',role:'STUDENT'};

assert.ok(I,'The central import API must be available');
assert.deepStrictEqual([...I.PortfolioImportSourceType],[
  'AI_LITERACY_LAB','LEARNING_CHECKS','PROMPT_COACH','ACADEMIC_RECOVERY_MODE',
  'VERIFIED_PEER_TUTORING','STUDY_PLANS','RESEARCH_SOURCE_VERIFICATION','AI_COMMUNITY_PROJECTS'
]);
for(const type of I.PortfolioImportSourceType){
  I.registerPortfolioImportSource(type,actor=>[{id:`${type}-work`,title:`${type} completed work`,version:1,completed:true,subjectUserId:actor.userId,organizationId:actor.tenantId,summary:'Student-owned completed work.'}]);
}
const candidates=I.listPortfolioImportCandidates({},student);
assert.strictEqual(candidates.length,8,'All eight existing feature families must be importable through adapters');
const candidate=candidates.find(item=>item.sourceType==='PROMPT_COACH');
assert.throws(()=>I.reviewPortfolioImportCandidate({sourceType:candidate.sourceType,candidateId:candidate.id},student),error=>error.code==='IMPORT_REVIEW_REQUIRED');
const reviewed=I.reviewPortfolioImportCandidate({sourceType:candidate.sourceType,candidateId:candidate.id,studentReviewed:true,studentReflection:'I selected this prompt because it shows how I revised my request.'},student);
assert.strictEqual(reviewed.addedToPortfolio,false);
assert.strictEqual(reviewed.shared,false);
assert.strictEqual(reviewed.verified,false);
assert.throws(()=>I.confirmPortfolioEvidenceImport({idempotencyKey:'no-confirm',importReviewId:reviewed.review.id},student),error=>error.code==='IMPORT_CONFIRMATION_REQUIRED');
assert.throws(()=>I.confirmPortfolioEvidenceImport({idempotencyKey:'wrong-owner',importReviewId:reviewed.review.id,confirmImport:true},other),error=>['RECORD_ACCESS_DENIED','OWNERSHIP_REQUIRED'].includes(error.code));
const imported=I.confirmPortfolioEvidenceImport({idempotencyKey:'confirm-prompt-import',importReviewId:reviewed.review.id,confirmImport:true},student);
assert.strictEqual(imported.addedToPortfolio,true);
assert.strictEqual(imported.privateByDefault,true);
assert.strictEqual(imported.sourceActivityChanged,false);
assert.strictEqual(imported.shared,false);
assert.strictEqual(imported.published,false);
assert.strictEqual(imported.submitted,false);
assert.strictEqual(imported.verified,false);
assert.strictEqual(I.listPortfolioImportCandidates({sourceType:'PROMPT_COACH'},student).length,0,'The same immutable source version must not be imported twice');

for(const label of ['AI Literacy Lab','Learning Checks','Prompt Coach','Academic Recovery Mode','Verified Peer Tutoring','Study Plans','Research and source-verification activities','AI community projects']) assert.ok(runtime.includes(label),`${label} source must be visible`);
assert.match(runtime,/Review Evidence Before Adding/);
assert.match(runtime,/Save Import Review/);
assert.match(runtime,/Add to My Portfolio/);
assert.match(script,/portfolioImportHub:'\/progress\/portfolio\/import'/);
assert.match(css,/\.portfolio-import-source-grid/);
console.log('competency portfolio import hub tests passed');
