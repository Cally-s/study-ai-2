const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index (2).html'), 'utf8');

function expectIncludes(source, value, message = value) {
  assert(source.includes(value), `Expected ${message}`);
}

expectIncludes(html, 'id="toolsView"', 'dedicated All StudySpark Tools view');
expectIncludes(html, 'Quick Access', 'Home Quick Access heading');
expectIncludes(html, 'Browse All Tools', 'Browse All Tools action');
expectIncludes(script, "tools:'/tools'", 'canonical /tools route');
expectIncludes(script, "notes:'/notes'", 'canonical /notes route');
expectIncludes(script, "flashcards:'/flashcards'", 'canonical /flashcards route');
expectIncludes(script, "quiz:'/quiz'", 'canonical /quiz route');
expectIncludes(script, "tools:['HOME','All StudySpark Tools']", 'tools view metadata');
expectIncludes(script, 'STUDYSPARK_FEATURE_REGISTRY', 'shared feature registry');
expectIncludes(script, 'STUDYSPARK_FEATURE_ICON_REGISTRY', 'shared feature icon registry');
expectIncludes(script, 'STUDYSPARK_HOME_ICON_PATHS', 'inline Home SVG icon set');
expectIncludes(script, 'homeFeatureIconMarkup(card)', 'Home feature cards render icons through shared icon helper');
expectIncludes(script, 'homeFeatureAccentClass(card.category)', 'Home feature cards use category accent styling');
expectIncludes(script, 'HOME_DEFAULT_FEATURE_IDS', 'default quick access registry');

const defaultMatch = script.match(/HOME_DEFAULT_FEATURE_IDS=Object\.freeze\(\[([^\]]+)\]\)/);
assert(defaultMatch, 'Expected HOME_DEFAULT_FEATURE_IDS array');
const defaults = Array.from(defaultMatch[1].matchAll(/'([^']+)'/g)).map(match => match[1]);
assert.deepStrictEqual(defaults, [
  'ai-coach',
  'learn',
  'assignments',
  'study-together',
  'flashcards',
  'notes',
  'projects',
  'progress',
]);

const registryIds = Array.from(script.matchAll(/\{id:'([^']+)',view:'([^']+)'/g)).map(match => ({
  id: match[1],
  view: match[2],
}));
for (const requiredId of defaults) {
  assert(
    registryIds.some(feature => feature.id === requiredId),
    `Expected registry feature for ${requiredId}`
  );
}

for (const requiredId of [
  'study-rooms',
  'study-together',
  'find-study-partner',
  'study-match-profile',
  'peer-tutoring',
  'tutor-application',
  'tutoring-requests',
  'upcoming-sessions',
  'help-credits',
  'community-service-hours',
  'problem-scope',
  'system-card',
  'project-architecture',
  'data-responsibility',
  'recent-activity',
]) {
  assert(
    registryIds.some(feature => feature.id === requiredId),
    `Expected restored collaboration registry feature for ${requiredId}`
  );
}

for (const route of [
  "studyTogether:'/study-together'",
  "studyRooms:'/study-together/rooms'",
  "studyPartnerResults:'/study-together/find-partners'",
  "peerTutoring:'/peer-tutoring'",
  "tutorApplication:'/peer-tutoring/apply'",
  "helpCredits:'/peer-tutoring/help-credits'",
]) {
  expectIncludes(script, route, `canonical route ${route}`);
}

expectIncludes(script, "category:'Collaboration and Support'", 'Collaboration and Support category');

const duplicateIds = registryIds
  .map(feature => feature.id)
  .filter((id, index, ids) => ids.indexOf(id) !== index);
assert.deepStrictEqual(duplicateIds, [], 'Feature registry IDs must be unique');

for (const feature of registryIds) {
  assert(
    script.includes(`${feature.view}:`) || script.includes(`${feature.view}:[`) || script.includes(`viewNames.${feature.view}=`),
    `Expected view metadata for ${feature.id} (${feature.view})`
  );
  assert(
    new RegExp(`['"]${feature.id}['"]:\\s*['"][a-z0-9-]+['"]`).test(script),
    `Expected shared icon mapping for ${feature.id}`
  );
}

console.log('Home feature registry checks passed.');
