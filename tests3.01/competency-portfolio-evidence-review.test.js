'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
global.AILiteracyCompetencyProgress=require('../ai-literacy-competency-progress.js');
const Runtime=require('../competency-portfolio-runtime.js');
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'competency-portfolio-runtime.js'),'utf8');
const script=fs.readFileSync(path.join(root,'script.js'),'utf8');
const css=fs.readFileSync(path.join(root,'competency-portfolio-runtime.css'),'utf8');

assert.deepStrictEqual(Runtime.PortfolioEvidenceReviewStatus,['DRAFT','SUBMITTED','NEEDS_REVISION','STUDENT_DEMONSTRATED','TEACHER_VERIFIED','NOT_ENOUGH_EVIDENCE','ARCHIVED'],'Evidence review statuses must be exact');
for(const label of ['Draft','Submitted','Needs Revision','Student Demonstrated','Teacher Verified','Not Enough Evidence','Archived']) assert.ok(source.includes(label),`${label} must be student-visible`);
for(const action of ['Leave feedback','Request more evidence','Approve the competency','Recommend a next activity','Return the evidence for revision']) assert.ok(source.includes(action),`${action} must be reviewer-visible`);
assert.match(script,/portfolioEvidenceReviews:'\/progress\/portfolio\/evidence-reviews'/,'Reviewer workflow must have a canonical route');
assert.match(script,/portfolioEvidenceReviews:'competencyPortfolio'/,'Reviewer route must have a safe Portfolio fallback');
assert.match(source,/id='portfolioEvidenceReviewsView'|id="portfolioEvidenceReviewsView"|view\.id='portfolioEvidenceReviewsView'/,'Reviewer workflow must be a dedicated page');
assert.match(source,/Explain exactly what the student should revise or add\./,'Revision decisions must require an exact reason');
assert.match(source,/studentCanSeeExactReason:true/,'Students must receive exact review reasons');
assert.match(source,/automaticGradeCreated:false/,'Review must not create an automatic grade');
assert.match(source,/automaticBadgeCreated:false/,'Review must not create an automatic badge');
assert.match(source,/competencyCreditAwarded:false/,'Review must not automatically award competency credit');
assert.match(css,/\.portfolio-review-card/,'Reviewer controls must use a responsive shared card');

const student={userId:'review-student',tenantId:'review-school',role:'STUDENT'};
const teacher={userId:'review-teacher',tenantId:'review-school',role:'COURSE_TEACHER'};
const otherTeacher={userId:'other-teacher',tenantId:'other-school',role:'COURSE_TEACHER'};
const draft=Runtime.savePortfolioEvidenceDraft({evidenceType:'PROJECT',title:'Fairness test project',competencyId:'competency-6',reflectionMethod:'WRITTEN_REFLECTION',reflectionResponses:{'What did you learn?':'I learned how to compare the results of two tests.'},sharingPreference:'ONLY_ME'},student).draft;
assert.throws(()=>Runtime.submitPortfolioEvidenceDraft({draftId:draft.id,idempotencyKey:'submit-no-confirm'},student),error=>error.code==='EVIDENCE_SUBMISSION_CONFIRMATION_REQUIRED','Submission must be intentional');
const submitted=Runtime.submitPortfolioEvidenceDraft({draftId:draft.id,idempotencyKey:'submit-confirmed',confirmSubmit:true},student);
assert.strictEqual(submitted.submission.status,'SUBMITTED','Intentional submission must enter Submitted status');
assert.strictEqual(submitted.submission.immutableStudentSnapshot,true,'Review must use an immutable student snapshot');
assert.strictEqual(submitted.shared,false,'Submission must not share evidence');
assert.strictEqual(submitted.competencyCreditAwarded,false,'Submission must not award credit');
assert.throws(()=>Runtime.reviewPortfolioEvidenceSubmission({submissionId:submitted.submission.id,idempotencyKey:'student-review',action:'APPROVE_COMPETENCY'},student),error=>error.code==='REVIEWER_ROLE_REQUIRED','Students must not review their own evidence');
assert.throws(()=>Runtime.reviewPortfolioEvidenceSubmission({submissionId:submitted.submission.id,idempotencyKey:'cross-tenant',action:'LEAVE_FEEDBACK',feedback:'x'},otherTeacher),error=>error.code==='RECORD_ACCESS_DENIED','Reviewers must not cross tenant boundaries');
assert.throws(()=>Runtime.reviewPortfolioEvidenceSubmission({submissionId:submitted.submission.id,idempotencyKey:'missing-reason',action:'RETURN_FOR_REVISION'},teacher),error=>error.code==='REVIEW_REASON_REQUIRED','Revision must require an exact reason');

const exactFeedback='Your reflection explains what you created, but it does not yet explain how you tested the AI tool for fairness.';
let reviewed=Runtime.reviewPortfolioEvidenceSubmission({submissionId:submitted.submission.id,idempotencyKey:'needs-revision',action:'RETURN_FOR_REVISION',feedback:exactFeedback,recommendedNextActivity:'Run one fairness test and explain the result.'},teacher);
assert.strictEqual(reviewed.submission.status,'NEEDS_REVISION','Return action must set Needs Revision');
assert.strictEqual(reviewed.review.feedback,exactFeedback,'Reviewer feedback must be preserved exactly for the student');
assert.strictEqual(reviewed.studentArtifactEdited,false,'Reviewer must not edit student work');
assert.strictEqual(reviewed.competencyCreditAwarded,false,'Review must not award credit automatically');
let studentView=Runtime.getStudentPortfolioEvidenceReviews(student)[0];
assert.strictEqual(studentView.studentCanSeeExactReason,true,'Student view must explicitly expose the exact reason');
assert.strictEqual(studentView.reviews[0].feedback,exactFeedback,'Student must see the exact revision explanation');
assert.strictEqual(studentView.reviews[0].recommendedNextActivity,'Run one fairness test and explain the result.','Student must see the recommended activity');

reviewed=Runtime.reviewPortfolioEvidenceSubmission({submissionId:submitted.submission.id,idempotencyKey:'verified',action:'APPROVE_COMPETENCY',feedback:'The added fairness test supports this competency.'},teacher);
assert.strictEqual(reviewed.submission.status,'TEACHER_VERIFIED','Approval must set Teacher Verified review status');
assert.strictEqual(reviewed.automaticGradeCreated,false,'Teacher verification must not create a grade');
assert.strictEqual(reviewed.automaticBadgeCreated,false,'Teacher verification must not create a badge');
assert.strictEqual(Runtime.getPortfolioEvidenceReviewQueue({},teacher).length,1,'Authorized same-tenant reviewer must see the queue');
assert.strictEqual(Runtime.getPortfolioEvidenceReviewQueue({},otherTeacher).length,0,'Other tenant queue must remain isolated');

console.log('competency portfolio evidence-review tests passed');
