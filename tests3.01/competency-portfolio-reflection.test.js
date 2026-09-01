'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
global.AILiteracyCompetencyProgress=require('../ai-literacy-competency-progress.js');
const Runtime=require('../competency-portfolio-runtime.js');
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'competency-portfolio-runtime.js'),'utf8');
const css=fs.readFileSync(path.join(root,'competency-portfolio-runtime.css'),'utf8');

for(const step of ['Step 1 — Choose Evidence Type','Step 2 — Add Basic Details','Step 3 — Describe Your Work','Step 4 — Student Reflection','Step 5 — Add a File or Link','Step 6 — Connect the Competency','Step 7 — Choose Sharing and Review']) assert.ok(source.includes(step),`${step} must exist exactly`);
for(const question of ['What did you learn?','What was difficult?','How did you solve the problem?','What would you change next time?','What part did you complete independently?','What support did you use?','Where could you apply this skill again?']) assert.ok(source.includes(question),`${question} must be available`);
for(const method of ['Written reflection','Speech-to-text reflection','Audio reflection','Bilingual reflection']) assert.ok(source.includes(method),`${method} must be available exactly`);
assert.match(source,/SpeechRecognition\|\|root\.webkitSpeechRecognition/,'Speech-to-text must use the browser speech API when available');
assert.match(source,/Speech-to-text is unavailable in this browser\. You can type your reflection instead\./,'Speech-to-text must have a text fallback');
assert.match(source,/must not invent an experience, action, difficulty, decision, result, or personal feeling/,'AI Coach notice must prohibit invented first-person experiences');
assert.match(source,/aiGeneratedFirstPersonReflection:false/,'Stored drafts must explicitly reject AI-generated first-person reflection');
assert.match(source,/studentCreatedReflectionRequired:true/,'Submission review must require a student-created reflection');
assert.match(source,/readyForSubmission:hasReflection/,'Reflection readiness must derive from actual student content');
assert.match(css,/\.portfolio-form-step\[hidden\]\{display:none\}/,'Only one focused form step must be shown at a time');
assert.match(source,/aria-valuemax="7"/,'The seven-step workflow must expose accessible progress');

const student={userId:'reflection-student',tenantId:'reflection-school',role:'STUDENT'};
const incomplete=Runtime.savePortfolioEvidenceDraft({evidenceType:'PROJECT',reflectionMethod:'WRITTEN_REFLECTION',reflectionResponses:{'What did you learn?':''}},student);
assert.strictEqual(incomplete.incompleteAllowed,true,'A missing reflection may remain an incomplete private draft');
let review=Runtime.reviewPortfolioEvidenceDraftForSubmission({draftId:incomplete.draft.id},student);
assert.strictEqual(review.readyForSubmission,false,'A draft without student reflection must not be submission-ready');
assert.deepStrictEqual(review.missing,['Student Reflection'],'The missing reflection must be explained');
assert.strictEqual(review.submitted,false,'Reviewing readiness must not submit the draft');

const written=Runtime.savePortfolioEvidenceDraft({draftId:incomplete.draft.id,expectedVersion:1,evidenceType:'PROJECT',reflectionMethod:'WRITTEN_REFLECTION',reflectionResponses:{'What did you learn?':'I learned to test each source before relying on it.'}},student);
assert.strictEqual(written.draft.reflectionStudentCreated,true,'The record must identify student-created reflection');
assert.strictEqual(written.draft.aiGeneratedFirstPersonReflection,false,'The record must not claim AI-authored first-person reflection');
review=Runtime.reviewPortfolioEvidenceDraftForSubmission({draftId:written.draft.id},student);
assert.strictEqual(review.readyForSubmission,true,'A genuine written reflection may pass reflection readiness');
assert.strictEqual(review.submitted,false,'Passing reflection readiness must still not submit automatically');

const bilingual=Runtime.savePortfolioEvidenceDraft({evidenceType:'WRITTEN_REFLECTION',reflectionMethod:'BILINGUAL_REFLECTION',bilingualReflection:{primaryLanguage:'English',secondaryLanguage:'French',primaryText:'I learned to compare the evidence.',secondaryText:'J’ai appris à comparer les preuves.'}},student);
assert.strictEqual(Runtime.reviewPortfolioEvidenceDraftForSubmission({draftId:bilingual.draft.id},student).readyForSubmission,true,'A student-created bilingual reflection must be supported');
const audio=Runtime.savePortfolioEvidenceDraft({evidenceType:'AUDIO_REFLECTION',reflectionMethod:'AUDIO_REFLECTION',audioReflectionMetadata:{name:'reflection.m4a',type:'audio/mp4',size:128}},student);
assert.strictEqual(Runtime.reviewPortfolioEvidenceDraftForSubmission({draftId:audio.draft.id},student).readyForSubmission,true,'A student audio reflection must be supported without invented text');

console.log('competency portfolio reflection tests passed');
