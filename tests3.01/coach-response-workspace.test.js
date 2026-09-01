const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index (2).html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const workspaceRuntime = fs.readFileSync(path.join(root, 'coach-response-workspace.js'), 'utf8');
const workspaceCss = fs.readFileSync(path.join(root, 'coach-response-workspace.css'), 'utf8');
const standardRuntime = fs.readFileSync(path.join(root, 'standard-ai-response-card-runtime.js'), 'utf8');
const contributionRuntime = fs.readFileSync(path.join(root, 'student-contribution-checkpoint-runtime.js'), 'utf8');

const pageViews = [
  ['coachResponsePageView', '/ai-coach/response', 'AI Response', 'Open Response'],
  ['coachEvidencePageView', '/ai-coach/evidence', 'Evidence and Trust', 'Check Evidence'],
  ['coachVerificationPageView', '/ai-coach/verification', 'What to Verify', 'Start Verification'],
  ['coachReflectionPageView', '/ai-coach/reflection', 'Thinking and Reflection', 'Reflect on My Learning'],
  ['coachRetryPageView', '/ai-coach/retry', 'Independent Retry', 'Start Independent Retry'],
  ['coachContributionPageView', '/ai-coach/contribution', 'Student Contribution', 'View My Contribution'],
  ['coachAIUsePageView', '/ai-coach/ai-use', 'AI Use and Disclosure', 'Review AI Use'],
];

for (const [viewId, route, title, action] of pageViews) {
  assert(html.includes(`id="${viewId}"`), `${viewId} shell should exist in the app markup`);
  assert(script.includes(route), `${route} should be a canonical StudySpark route`);
  assert(workspaceRuntime.includes(title), `${title} should be rendered by the workspace runtime`);
  assert(workspaceRuntime.includes(action), `${action} should be available from the workspace`);
}

assert(html.includes('coach-response-workspace.css'), 'workspace stylesheet should be loaded');
assert(html.includes('coach-response-workspace.js'), 'workspace runtime should be loaded');

assert(workspaceRuntime.includes('Explore Your Response'), 'main dashboard should include Explore Your Response');
assert(workspaceRuntime.includes('Open one learning tool at a time so you can review the response, check its evidence, practise the skill, and document your own contribution.'), 'dashboard description should match the requested copy');
assert(workspaceRuntime.includes('Available after the AI creates a response.'), 'empty card state should use the requested unavailable message');
assert(workspaceRuntime.includes('We could not load this part of your AI Coach response. Your saved work has not been deleted.'), 'page error state should preserve saved-work reassurance');
assert(workspaceRuntime.includes('No substantive AI hints will be provided during this attempt. Accessibility support and approved resources remain available.'), 'independent retry notice should be present');
assert(workspaceRuntime.includes('Private by default. Checkpoints record intentional actions, not surveillance.'), 'student contribution privacy note should be present once in routed UI');

assert(!workspaceRuntime.includes('scrollIntoView'), 'major feature navigation must not use same-page scrolling');
assert(!workspaceRuntime.includes('window.scrollTo'), 'major feature navigation must not use manual scrolling');

assert(!standardRuntime.includes('SECTIONS.map((s,n)=>'), 'standard response runtime must not inject every response section into the coach page');
assert(!standardRuntime.includes('data-response-section="${n}"'), 'standard response runtime must not render repeated inline placeholders');
assert(contributionRuntime.includes('coachContributionPageView'), 'legacy contribution runtime should defer when routed contribution page exists');

assert(workspaceCss.includes('@media (max-width: 900px)'), 'workspace CSS should include responsive layout rules');
assert(workspaceCss.includes(':focus-visible'), 'workspace CSS should preserve visible keyboard focus');
assert(workspaceCss.includes('forced-colors'), 'workspace CSS should support forced-colours mode');
assert(workspaceCss.includes('prefers-reduced-motion'), 'workspace CSS should respect reduced motion');

console.log('coach-response-workspace tests passed');
