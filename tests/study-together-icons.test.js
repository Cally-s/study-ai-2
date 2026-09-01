const assert = require('assert');
const fs = require('fs');

const html = fs.readFileSync('index (2).html', 'utf8');
const script = fs.readFileSync('script.js', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const firstScreen = fs.readFileSync('first-screen-navigation.js', 'utf8');

function includes(source, needle, label) {
  assert.ok(source.includes(needle), `missing ${label}`);
}

const requiredIconNames = [
  'user-round-plus',
  'sparkles',
  'user-search',
  'clipboard-list',
  'door-open',
  'users-round',
  'calendar-clock',
  'clipboard-plus',
  'shield-alert',
  'arrow-right'
];

for (const iconName of requiredIconNames) {
  assert.match(script, new RegExp(`['"]?${iconName}['"]?:`), `missing ${iconName} SVG path`);
}

includes(script, 'const STUDY_TOGETHER_FEATURES=Object.freeze', 'shared Study Together feature config');
for (const title of [
  'Friend Requests',
  'Study Match',
  'Find Study Partners',
  'My Study Requests',
  'Study Rooms',
  'Study Groups'
]) {
  includes(script, `title:'${title}'`, `${title} feature config`);
}

for (const description of [
  'Review incoming requests, sent requests, friends, and blocked accounts.',
  'View recommended partners based on your subjects, goals, availability, and preferences.',
  'Search for compatible students by course, language, schedule, and study style.',
  'Create, edit, pause, and review responses to your study requests.',
  'Join or create live study spaces with chat, shared notes, captions, and text-only options.',
  'Create or join ongoing groups for a subject, project, course, or recurring goal.'
]) {
  includes(script, description, `student-facing description: ${description}`);
}

includes(firstScreen, "primaryClass:'study-together-primary-action'", 'Study Together primary action styling hook');
includes(firstScreen, "secondaryClass:'study-together-secondary-action'", 'Study Together secondary action styling hook');
includes(firstScreen, "secondaryView:'studyRequests'", 'Create Study Request dedicated route');
includes(html, 'id="studyTogetherCards" class="study-together-card-grid"', 'Study Together rich card grid remains');
assert.ok(!html.includes('data-study-together-icon="users-round"'), 'removed duplicate lower hero icon placeholder');
assert.ok(!html.includes('study-together-hero-action'), 'removed duplicate lower hero actions');
includes(script, 'All collaboration features require an account.', 'compact guest mode note');

includes(css, '.study-together-icon-tile', 'shared Study Together icon tile class');
includes(css, 'width:52px', '52px icon tile width');
includes(css, 'height:52px', '52px icon tile height');
includes(css, '.study-together-status-chip', 'status chip with icon styling');
includes(css, '.study-together-accent-violet', 'accent class for Friend Requests');
includes(css, '.study-together-accent-teal', 'accent class for Study Rooms');
includes(css, '@media(max-width:760px)', 'mobile layout support');
includes(css, '@media(forced-colors:active)', 'forced-colours support');
includes(css, '@media(prefers-reduced-motion:reduce)', 'reduced-motion support');

const studyTogetherBlock = script.slice(
  script.indexOf('const STUDY_TOGETHER_FEATURES=Object.freeze'),
  script.indexOf('function accountRoleLabel')
);
assert.doesNotMatch(studyTogetherBlock, /icon:'(?:F|S|P|R|G|\?)'/, 'Study Together cards must not use plain letter placeholder icons');
assert.doesNotMatch(studyTogetherBlock, /<button[^>]*class="[^"]*study-together-feature-card/i, 'feature cards should not be fake card-buttons');
assert.doesNotMatch(studyTogetherBlock, /<article class="study-together-feature-card">/, 'feature cards should be semantic links, not inert articles with nested links');

for (const oldIcon of ["studyTogether:['ST'", "friendRequests:['FR'", "studyRooms:['SR'", "studyGroups:['SG'"]) {
  assert.ok(!firstScreen.includes(oldIcon), `first-screen hub should not use ${oldIcon}`);
}

console.log('Study Together icon and visual-detail tests passed');
