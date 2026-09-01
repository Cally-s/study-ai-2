const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index (2).html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'style.css'), 'utf8');

assert(!html.includes('id="guestBanner"'), 'Home page should not render the old large Guest Mode banner.');
assert(!html.includes('homeGuestModeTitle'), 'Home page should not keep hidden Guest Mode banner heading markup.');
assert(!script.includes("$('#guestBanner')?.classList.toggle"), 'Home render should not toggle a removed guest banner.');

assert(html.includes('id="accountModeBadges"'), 'Home welcome header should include a compact account mode badge target.');
assert(script.includes('function renderAccountModeBadge()'), 'Account mode badge should be rendered from real account state.');
assert(script.includes("Mode: Guest"), 'Guest mode label should be available for the compact Home badge and sidebar.');
assert(script.includes("Mode: Member"), 'Member mode label should be available for signed-in users.');
assert(styles.includes('.account-mode-badge'), 'Compact account mode badge styles should exist.');

assert(html.includes('id="accountMenu"'), 'Top-right profile control should own the account menu.');
assert(html.includes('aria-haspopup="menu"'), 'Profile button should expose menu semantics.');
assert(script.includes('function renderAccountMenu()'), 'Account menu should be rendered from real account state.');
assert(script.includes('data-account-action="signup"'), 'Guest profile menu should include Create Account.');
assert(script.includes('data-account-action="login"'), 'Guest profile menu should include Log In.');
assert(script.includes('data-account-action="logout"'), 'Profile menu should preserve Exit Guest Mode / Log Out.');
assert(styles.includes('.guest-account-menu__create'), 'Create Account should have primary menu styling.');
assert(styles.includes('.guest-account-menu__login'), 'Log In should have secondary menu styling.');
assert(styles.includes('.guest-account-menu__exit'), 'Exit Guest Mode should have separate caution styling.');

const dashboardMatch = html.match(/<section class="app-view active home-page" id="dashboardView"[\s\S]*?<section class="card home-continue-card"/);
assert(dashboardMatch, 'Expected to inspect Home header before Continue card.');
assert(!dashboardMatch[0].includes('data-auth="signup"'), 'Create Account should not appear in the Home welcome/header content.');
assert(!dashboardMatch[0].includes('data-auth="login"'), 'Log In should not appear in the Home welcome/header content.');

console.log('Compact Home guest mode checks passed.');
