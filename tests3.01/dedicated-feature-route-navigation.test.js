'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const navigation=fs.readFileSync(path.join(root,'first-screen-navigation.js'),'utf8');
const router=fs.readFileSync(path.join(root,'script.js'),'utf8');

assert.match(navigation,/function routeHref\(destination\)/,'major feature controls expose real href destinations');
assert.match(navigation,/<a class="feature-hub-card" href="\$\{routeHref\(destination\)\}"/,'feature cards are links, not scroll buttons');
assert.match(navigation,/<a href="\$\{routeHref\(destination\)\}" data-feature-priority="SECONDARY"/,'secondary feature navigation uses links');
assert.match(navigation,/event\.preventDefault\(\);const view=route\.dataset\.firstScreenView/,'the SPA router owns feature-link activation without page reloads');
assert.doesNotMatch(navigation,/localFirst|localMore/,'automatic heading-to-scroll navigation is not rendered as page navigation');

const expectedRoutes={
  coach:'/ai-coach',aiLiteracy:'/learn',planner:'/assignments',communityAIProject:'/projects',progress:'/progress',settings:'/settings',instructions:'/help',
  answerVerification:'/ai-coach/verify-answer',claimEvidenceMap:'/ai-coach/claim-evidence-map',sourceComparison:'/ai-coach/source-comparison',aiUseReceipt:'/ai-coach/receipts',
  aiDiagnostic:'/learn/learning-check',savedPlans:'/assignments/study-plans',academicRecovery:'/assignments/recovery-plan',
  problemScopingStudio:'/projects/problem-scope',learningProfile:'/progress/learning-profile',examReadiness:'/progress/exam-readiness',wellBeingDashboard:'/progress/well-being/dashboard',
  accessibilityLanguage:'/settings/accessibility-language',privacyData:'/settings/privacy-offline-data',notifications:'/settings/notifications',wellBeingHelpSafety:'/help/safety',
  resourceStudio:'/teacher/courses',assignmentPolicyBuilder:'/teacher/assignments/ai-policy',integrityReview:'/teacher/reviews',bookingSessions:'/peer-tutoring/sessions'
};
for(const [view,route] of Object.entries(expectedRoutes)){
  assert.match(router,new RegExp(`${view}:'${route.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}'`),`${view} has a canonical browser route`);
  assert.match(navigation,new RegExp(`${view}:'${route.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}'`),`${view} cards advertise the same route`);
}
assert.match(router,/window\.addEventListener\('popstate',[\s\S]*showView\(view,\{fromBack:true\}\)/,'browser Back and Forward restore routed views');
assert.match(router,/history\[fromBack\?'replaceState':'pushState'\]/,'normal navigation pushes URL history while Back replaces it');
assert.match(navigation,/class="study-page-back"/,'dedicated pages keep the shared arrow-only Back control');

console.log('dedicated feature route navigation tests passed');
