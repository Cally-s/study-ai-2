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

assert.match(script,/portfolioAddEvidence:'\/progress\/portfolio\/add-evidence'/,'Add Evidence must use its canonical route');
assert.match(script,/portfolioAddEvidence:'competencyPortfolio'/,'Back fallback must return to the Portfolio');
assert.match(script,/portfolioAddEvidence:\{role:'student'.*minimumContentReady:true/,'Add Evidence must be registered as released non-blank content');
assert.match(source,/id='portfolioAddEvidenceView'|id="portfolioAddEvidenceView"|view\.id='portfolioAddEvidenceView'/,'Add Evidence must be a dedicated child view');
assert.match(source,/data-portfolio-add-evidence.*portfolioAddEvidence/,'Portfolio action must open the dedicated workflow');

for(const label of ['AI Literacy Lab activity','Prompt improvement','Source-verification activity','Corrected AI answer','Learning Check result','Peer-tutoring reflection','Project','Research workflow','Uploaded document','Image','Audio reflection','Video','External link','Written reflection']) assert.ok(source.includes(label),`Evidence type ${label} must be available`);
for(const field of ['Evidence title','Competency','Course or subject','Description','What I did','What I learned','Why this shows the competency','File or link','Date completed','Sharing preference']) assert.ok(source.includes(field),`Visible field ${field} must be present`);
assert.match(source,/Save Private Draft/,'Incomplete evidence must have an explicit private-draft action');
assert.match(source,/Saving does not submit, verify, share, publish, or award competency credit\./,'The form must explain all non-effects');
assert.match(source,/type="file"/,'The workflow must provide native file selection');
assert.match(source,/type="url"/,'The workflow must provide an external-link input');
assert.match(css,/\.portfolio-form-grid/,'The workflow must use a shared responsive form layout');

const student={userId:'draft-student',tenantId:'draft-school',role:'STUDENT'};
const other={userId:'other-student',tenantId:'draft-school',role:'STUDENT'};
const initialOverview=Runtime.getCompetencyPortfolioOverview(student);
const saved=Runtime.savePortfolioEvidenceDraft({evidenceType:'WRITTEN_REFLECTION',title:'',competencyId:'',courseOrSubject:'',description:'',whatIDid:'',whatILearned:'',whyThisShowsCompetency:'',sharingPreference:'ONLY_ME'},student);
assert.strictEqual(saved.draft.status,'DRAFT','Saved evidence must remain a draft');
assert.strictEqual(saved.draft.privateVisibility,'ONLY_ME','Drafts must be private');
assert.strictEqual(saved.incompleteAllowed,true,'Incomplete drafts must be accepted');
assert.strictEqual(saved.submitted,false,'Saving must not submit evidence');
assert.strictEqual(saved.verified,false,'Saving must not verify evidence');
assert.strictEqual(saved.shared,false,'Saving must not share evidence');
assert.strictEqual(saved.published,false,'Saving must not publish evidence');
assert.strictEqual(saved.competencyCreditAwarded,false,'Saving must not award competency credit');
assert.strictEqual(Runtime.getPortfolioEvidenceDrafts(student).length,1,'The owner must be able to reload the private draft');
assert.strictEqual(Runtime.getPortfolioEvidenceDrafts(other).length,0,'Another student must not see the draft');
assert.strictEqual(Runtime.getCompetencyPortfolioOverview(student).evidenceItems,initialOverview.evidenceItems,'A draft must not become Portfolio evidence automatically');
const updated=Runtime.savePortfolioEvidenceDraft({draftId:saved.draft.id,expectedVersion:1,evidenceType:'WRITTEN_REFLECTION',title:'My reflection',sharingPreference:'CHOOSE_LATER'},student);
assert.strictEqual(updated.draft.version,2,'Saving the same draft must create a new draft version rather than a duplicate');
assert.strictEqual(Runtime.getPortfolioEvidenceDrafts(student).length,1,'Updating a draft must not duplicate it');
assert.throws(()=>Runtime.savePortfolioEvidenceDraft({evidenceType:'EXTERNAL_LINK',externalLink:'javascript:alert(1)'},student),error=>error.code==='EVIDENCE_LINK_INVALID','Unsafe links must be rejected');

console.log('competency portfolio add-evidence tests passed');
