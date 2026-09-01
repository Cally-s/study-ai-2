const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index (2).html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const studyRooms = fs.readFileSync(path.join(root, 'study-rooms.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');

function includes(source, needle, label = needle) {
  assert.ok(source.includes(needle), `missing ${label}`);
}

includes(script, 'Mode: Guest · All collaboration features require an account.', 'exact guest-mode account requirement');
assert.ok(!script.includes('Mode: Guest · Some collaboration features require an account.'), 'old partial-account wording must be removed');

for (const [view, name] of [
  ['friendRequests', 'Friend Requests'],
  ['studyMatch', 'Study Match'],
  ['studyPartnerResults', 'Find Study Partners'],
  ['studyRequests', 'My Study Requests'],
  ['studyRooms', 'Study Rooms'],
  ['studyGroups', 'Study Groups'],
]) {
  includes(script, `${view}:'${name}'`, `${name} protected route`);
}

includes(script, 'const STUDY_TOGETHER_ACCOUNT_REQUIRED_MESSAGE=', 'shared account-required message');
includes(script, 'function requireStudyTogetherAccount', 'shared account gate');
includes(script, 'window.requireStudyTogetherAccount=requireStudyTogetherAccount', 'account gate exported for shared Study Room actions');
includes(script, 'isStudyTogetherAccountRequiredView(view)&&studyTogetherNeedsSignedInAccount()', 'route-level guest guard');
includes(script, 'consumeStudyTogetherIntendedView()||canonicalViewFromLocation()', 'post-auth intended-route continuation');
includes(script, '[data-home-view],[data-first-screen-view],[data-view]', 'shared click interception for Study Together routes');
includes(script, "event.key==='Escape'&&modal.classList.contains('open')", 'Escape closes the shared account-required dialog');

includes(script, "status:'Account Required'", 'guest cards use Account Required status');
includes(script, "action:'Sign In to Continue'", 'guest cards use a safe sign-in action');
includes(script, 'STUDY_TOGETHER_ACCOUNT_REQUIRED_FEATURE_IDS', 'All Tools collaboration statuses share the account-required rule');
includes(script, "homeFeatureRequiresStudyTogetherAccount(feature))return'Account Required'", 'generic feature cards show Account Required for guest-only collaboration tools');
includes(script, "data-study-together-feature=\"${escapeHTML(card.title)}\"", 'cards carry feature names into the shared gate');
includes(script, "homeIconSVG('lock')", 'lock icon used for guest status and dialog');
includes(script, 'function updateStudyTogetherUpcomingHeaderAction', 'signed-in Study Rooms shortcut is hidden for guests');

for (const label of ['Account Required', 'Create Account', 'Log In', 'Cancel']) {
  includes(script, label, `dialog label: ${label}`);
}
includes(script, 'Study Together features involve connecting and communicating with other students. Sign in or create an account to use them safely.', 'exact dialog explanation');

includes(studyRooms, 'window.requireStudyTogetherAccount', 'Study Rooms creation uses shared account gate');
includes(studyRooms, "intendedRoute:'studyRooms'", 'Study Rooms gate preserves intended route');

includes(css, '.study-together-account-note', 'compact account note style');
includes(css, 'width:fit-content', 'account note fits content');
includes(css, '.study-together-status-chip--locked', 'locked status chip style');
includes(css, '.study-together-account-dialog-card', 'shared account dialog style');
includes(css, '@media(max-width:760px)', 'mobile layout remains covered');
includes(css, '@media(forced-colors:active)', 'forced-colors support remains covered');

includes(html, 'style.css?v=study-together-account-gate-v2-20260831', 'stylesheet cache bust');
includes(html, 'script.js?v=study-together-account-gate-v2-20260831', 'main script cache bust');
includes(html, 'study-rooms.js?v=study-together-account-gate-v2-20260831', 'Study Rooms script cache bust');

console.log('Study Together account-gate tests passed');
