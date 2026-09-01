'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path'),root=path.join(__dirname,'..'),js=fs.readFileSync(path.join(root,'claim-evidence-map-experience.js'),'utf8'),css=fs.readFileSync(path.join(root,'claim-evidence-map-goal-fix.css'),'utf8');let passed=0;
function test(name,fn){try{fn();passed++}catch(error){console.error(`FAIL: ${name}\n${error.stack}`);process.exitCode=1}}
const goals={ESSAY_ARGUMENT:['Essay title','Essay question','Thesis','Course','Assignment instructions'],AI_ANSWER:['Original question','AI answer’s main claim','Claims needing evidence','Verification context'],RESEARCH_ARGUMENT:['Research question','Main position','Supporting claims','Source requirements'],SCIENCE_CONCLUSION:['Investigation question','Conclusion','Results','scientific evidence','limitations'],NEWS_ANALYSIS:['Article topic','Main claim','reported facts','opinions','named sources','missing perspectives'],CONFLICTING_EVIDENCE:['Disputed question','Main claim','supporting','contradicting evidence','reasons for disagreement']};
for(const [type,copy] of Object.entries(goals)){test(`${type} handler`,()=>assert.ok(js.includes(`type:'${type}'`)&&js.includes(type)));for(const text of copy)test(`${type} template ${text}`,()=>assert.ok(js.toLowerCase().includes(text.toLowerCase())))}
test('one reusable handler',()=>assert.ok(js.includes('function handleMappingGoalSelect(goalType')));
test('all buttons are non-submit',()=>assert.ok(js.includes('type="button" aria-pressed="false" data-cem-card')));
test('selection is explicit',()=>assert.ok(js.includes('is-selected')&&js.includes('✓ Selected')&&js.includes('aria-pressed')));
test('selection focuses builder',()=>assert.ok(js.includes("d.getElementById('cemBuilderTitle').focus()")));
test('reduced motion respected',()=>assert.ok(js.includes("prefers-reduced-motion: reduce")&&js.includes("reduced?'auto':'smooth'")));
test('overwrite confirmation',()=>assert.ok(js.includes('Changing the mapping goal will replace the current template guidance')));
test('working draft saved',()=>assert.ok(js.includes('DRAFT_KEY')&&js.includes('persistWorkingDraft')&&js.includes('restoreWorkingDraft')));
test('current goal and change action',()=>assert.ok(js.includes('Current Mapping Goal:')&&js.includes('cemChangeGoal')));
test('standard field helper',()=>assert.ok(js.includes('function field({id,name,label')));
test('proper controls',()=>assert.ok(js.includes("type:'input'")&&js.includes("rows:4")&&js.includes("rows:5")&&js.includes("rows:6")));
test('label associations',()=>assert.ok(js.includes('label for="${id}"')&&js.includes('aria-describedby="${id}Help ${id}Error"')));
test('validation state',()=>assert.ok(js.includes('aria-invalid')&&js.includes('To continue, add:')));
test('required actions',()=>assert.ok(['Save Draft','Preview Map','Continue to Evidence','Start Over'].every(x=>js.includes(x))));
test('preserved report action',()=>assert.ok(js.includes('Build Map and Report')));
test('desktop grid',()=>assert.ok(css.includes('grid-template-columns:repeat(2,minmax(0,1fr))')));
test('full width fields',()=>assert.ok(css.includes('.cem-full-width-field{grid-column:1/-1}')));
test('mobile stack',()=>assert.ok(css.includes('@media(max-width:560px)')&&css.includes('.cem-map-builder-grid{grid-template-columns:1fr}')));
test('mobile actions stack',()=>assert.ok(css.includes('.cem-builder-actions .btn')&&css.includes('width:100%')));
test('selected not color only',()=>assert.ok(css.includes('.cem-selected-label')&&css.includes('.is-selected')));
test('forced colors',()=>assert.ok(css.includes('@media(forced-colors:active)')));
test('reduced motion CSS',()=>assert.ok(css.includes('@media(prefers-reduced-motion:reduce)')));
if(!process.exitCode)console.log(`claim-evidence-map-goal-buttons-layout: ${passed}/${passed} assertions passed`);
