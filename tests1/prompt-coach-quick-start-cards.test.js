'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const Coach=require('../prompt-writing-coach.js');
const source=fs.readFileSync(path.join(root,'prompt-writing-coach.js'),'utf8');
const css=fs.readFileSync(path.join(root,'prompt-writing-coach.css'),'utf8');

const titles=['Explain a Concept','Give Me a Hint','Ask Me Guiding Questions','Check My Reasoning','Create Practice Questions','Help Me Verify a Source','Give Feedback on My Draft','Show Me a Similar Example'];
const quick=Coach._test.starterTemplates;
assert.equal(quick.length,8,'Prompt Coach must expose exactly the eight requested quick starts');
assert.deepEqual(quick.map(item=>item.title),titles,'quick-start titles must use the exact requested wording and order');
for(const template of quick){
  assert.ok(template.description,'each template needs a one-sentence description');
  assert.ok(template.icon,'each template needs an icon');
  assert.ok(template.fields.goal,'each template needs a real editable starting goal');
  assert.ok(template.fields.help,'each template needs a real help request');
  assert.ok(template.fields.avoid,'each template needs an explicit learning boundary');
  assert.equal(template.editable,true,'templates remain editable');
  assert.equal(template.automaticallySent,false,'templates must never auto-send');
}
assert.equal(Coach._test.builderFields.length,14,'templates must fill the existing Prompt Builder rather than a duplicate form');
assert.match(source,/<h2 id="promptTemplateHeading">Start with a Template<\/h2>/,'template section has the required heading');
assert.match(source,/Choose the type of help you want\. You can edit every part of the prompt before using it\./,'template section has the required guidance');
assert.match(source,/Use This Template/,'every generated card exposes the required action');
assert.match(source,/aria-labelledby="prompt-template-\$\{template\.id\}-title prompt-template-\$\{template\.id\}-action"/,'template actions have programmatic names');
assert.match(source,/aria-describedby="prompt-template-\$\{template\.id\}-description"/,'template descriptions are associated with their actions');
assert.match(source,/role="status" aria-live="polite"/,'template changes are announced without interrupting the student');
assert.match(source,/data-prompt-field="\$\{field\.key\}"/,'templates target named fields in the existing builder');
assert.match(source,/field\.dispatchEvent\(new Event\('input', \{ bubbles: true \}\)\)/,'filled values notify the existing builder state');
const fillBody=source.match(/function fillPromptBuilder[\s\S]*?\n  \}/)?.[0]||'';
assert.doesNotMatch(fillBody,/sendApprovedPromptDraft|sendDraft|createPromptCoachSession|createPromptDraftVersion/,'selecting a template must not create or send records');
assert.match(css,/\.prompt-template-grid\{display:grid/,'cards use a responsive grid');
assert.match(css,/@media\(max-width:42rem\)\{\.prompt-template-grid\{grid-template-columns:1fr\}\}/,'cards stack on narrow screens');
assert.match(css,/\.prompt-coach-shell \.prompt-template-card button/,'template actions have a dedicated compact style');
assert.match(css,/:focus-visible/,'keyboard focus remains visible');
console.log('Prompt Coach quick-start card tests passed');
