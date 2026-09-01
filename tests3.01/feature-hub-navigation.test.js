'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'first-screen-navigation.js'),'utf8');
const css=fs.readFileSync(path.join(root,'first-screen-navigation.css'),'utf8');
const sidebar=fs.readFileSync(path.join(root,'sidebar-navigation.js'),'utf8');
const router=fs.readFileSync(path.join(root,'script.js'),'utf8');

for(const page of ['dashboard','coach','aiLiteracy','planner','studyTogether','communityAIProject','progress','settings','instructions','roleDashboards','resourceStudio','peerTutoring']){
  assert.match(source,new RegExp(`${page}:\\{hub:true`),`${page} must render as a feature hub`);
}
assert.match(source,/<a class="feature-hub-card"/,'hub navigation uses real route links styled as compact feature cards');
assert.match(source,/data-first-screen-view="\$\{destination\}"/,'cards keep canonical in-app destinations');
assert.doesNotMatch(source,/localFirst|localMore/,'page headers must not generate same-page section navigation controls');
assert.match(source,/\['Saved Plans','savedPlans'\]/,'Saved Plans opens its dedicated page');
assert.match(source,/data-page-purpose="\$\{config\.hub\?'hub':'workflow'\}"/,'hub and workflow pages expose their purpose');
assert.match(source,/class="study-page-back"/,'dedicated feature pages keep the shared Back control');
assert.match(css,/\.feature-hub-grid\{display:grid/,'feature cards use a responsive grid');
assert.match(css,/@media\(max-width:42rem\)\{\.feature-hub-grid\{grid-template-columns:1fr\}\}/,'cards become one column on mobile');
assert.match(css,/\.feature-hub-card:focus-visible/,'feature cards have visible keyboard focus');
assert.doesNotMatch(css,/\.feature-hub-card\{[^}]*position:(?:fixed|absolute)/,'feature cards stay in normal page layout');
for(const [feature,hub] of [['promptWithPurpose','coach'],['aiDiagnostic','aiLiteracy'],['savedPlans','planner'],['studyRooms','studyTogether'],['studyPartnerResults','studyTogether'],['problemScopingStudio','communityAIProject'],['learningProfile','progress'],['privacyData','settings'],['assignmentPolicyBuilder','roleDashboards']]){
  assert.match(router,new RegExp(`${feature}:'${hub}'`),`${feature} must fall back to ${hub}`);
}

const primaryLabels=['Home','AI Coach','Learn','Assignments','Study Together','Projects','Progress'];
for(const label of primaryLabels)assert.match(sidebar,new RegExp(`'${label}'`),`sidebar must keep ${label}`);
assert.equal([...sidebar.matchAll(/item\('student-/g)].length,7,'student sidebar must remain limited to seven primary items');
console.log('feature hub navigation tests passed');
