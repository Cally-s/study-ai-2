'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const js = fs.readFileSync(path.join(root, 'system-card-experience.js'), 'utf8');
const renderer = fs.readFileSync(path.join(root, 'project-tool-header.js'), 'utf8');
const sharedCss = fs.readFileSync(path.join(root, 'project-feature-hero.css'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index (2).html'), 'utf8');

for (const snippet of [
  'root.ProjectToolHeader.render',
  "pageClass: 'sc-hero'",
  "titleId: 'system-card-title'",
  "mainClass: 'sc-hero-content'",
  "iconClass: 'sc-hero-icon'",
  "eyebrowClass: 'sc-kicker sc-hero-eyebrow'",
  "titleClass: 'sc-hero-title'",
  "descriptionClass: 'sc-hero-description'",
  "guidanceClass: 'sc-reminder sc-hero-reminder'",
  "actionsClass: 'sc-hero-actions'",
  "actionsLabel: 'System Card actions'",
  "backLabel: 'Return to Projects'",
  'Create System Card',
  'Continue Draft',
  'Import from Problem Scope',
  'View an Example'
]) {
  assert(js.includes(snippet), `System Card passes ${snippet} to the shared header`);
}

for (const snippet of [
  'project-feature-hero project-tool-header',
  'project-tool-header__main',
  'project-tool-header__identity',
  'project-tool-header__actions',
  'project-tool-header__guidance',
  'project-guidance-note'
]) {
  assert(renderer.includes(snippet), `Shared header renderer includes ${snippet}`);
}

for (const snippet of [
  '.project-tool-header.project-feature-hero {',
  'display: grid !important',
  'grid-template-areas: "back main actions" !important',
  'grid-template-columns: 58px minmax(0, 1fr) minmax(280px, 390px) !important',
  'grid-area: main !important',
  'grid-area: actions !important',
  'border: 0 !important',
  'border-radius: 0 !important',
  'background: transparent !important',
  'box-shadow: none !important',
  'position: static !important',
  'max-width: 62ch !important',
  '@media (max-width: 1500px)',
  '@media (max-width: 720px)',
  '@media (max-width: 430px)',
  '@media (forced-colors: active)',
  '[dir="rtl"] .project-guidance-note::before'
]) {
  assert(sharedCss.includes(snippet), `Shared repaired header CSS should include ${snippet}`);
}

assert(html.includes('project-tool-header.js?v=project-tool-header-emergency-20260830'), 'Shared project header renderer is loaded');
assert(html.includes('project-feature-hero.css?v=project-feature-hero-emergency-20260830'), 'Shared project hero CSS is loaded');
assert(!js.includes('project-tool-header__top'), 'System Card no longer uses the broken nested top grid');
assert(!js.includes('project-tool-header__supporting'), 'System Card no longer uses the broken supporting grid');
assert(!js.includes('class="sc-hero-actions-column"'), 'System Card no longer uses the old split action column');
assert(!/\.project-tool-header\.project-feature-hero[\s\S]{0,700}border-radius:\s*clamp/.test(sharedCss), 'Shared header does not recreate a giant rounded hero card');

console.log('system-card-hero-layout tests passed');
