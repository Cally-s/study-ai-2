'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const js = fs.readFileSync(path.join(root, 'project-architecture-experience.js'), 'utf8');
const renderer = fs.readFileSync(path.join(root, 'project-tool-header.js'), 'utf8');
const sharedCss = fs.readFileSync(path.join(root, 'project-feature-hero.css'), 'utf8');

for (const snippet of [
  'root.ProjectToolHeader.render',
  "pageClass:'ar-hero'",
  "titleId:'project-architecture-title'",
  "mainClass:'ar-hero-content'",
  "iconClass:'ar-hero-icon'",
  "eyebrowClass:'ar-kicker ar-hero-eyebrow'",
  "titleClass:'ar-hero-title'",
  "descriptionClass:'ar-hero-description'",
  "projectContext:{className:'ar-project ar-hero-project'",
  "label:'Selected Project'",
  "projectName:readAll()[0]?.projectName||'Choose or create a project'",
  "guidanceClass:'ar-reminder ar-hero-reminder'",
  "actionsClass:'ar-hero-actions'",
  "actionsLabel:'Project Architecture actions'",
  "backLabel:'Return to Projects'",
  'Build My Architecture',
  'Continue Draft',
  'Import from Problem Scope',
  'Import from System Card',
  'View an Example'
]) {
  assert(js.includes(snippet), `Project Architecture passes ${snippet} to the shared header`);
}

for (const snippet of [
  'project-tool-header__main',
  'project-tool-header__identity',
  'project-tool-header__context',
  'project-tool-header__actions',
  'project-guidance-note'
]) {
  assert(renderer.includes(snippet), `Shared header renderer includes ${snippet}`);
}

for (const snippet of [
  'max-width: 1440px !important',
  'padding: clamp(22px, 3vw, 42px) clamp(16px, 4vw, 48px) 56px !important',
  'display: grid !important',
  'grid-template-areas: "back main actions" !important',
  'grid-template-columns: 58px minmax(0, 1fr) minmax(280px, 390px) !important',
  'border: 0 !important',
  'background: transparent !important',
  'content: none !important',
  '.project-tool-header__actions',
  '.project-context-card',
  '.project-guidance-note',
  '@media (max-width: 1500px)',
  '@media (max-width: 720px)'
]) {
  assert(sharedCss.includes(snippet), `Shared repaired header CSS should include ${snippet}`);
}

assert(!js.includes('project-tool-header__top'), 'Project Architecture no longer uses the broken nested top grid');
assert(!js.includes('project-tool-header__supporting'), 'Project Architecture no longer uses the broken supporting grid');
assert(!js.includes('class="ar-hero-actions-column"'), 'Project Architecture no longer uses the old split action column');
assert(!/\.project-tool-header\.project-feature-hero[\s\S]{0,700}box-shadow:\s*0 0\.9rem/.test(sharedCss), 'Project Architecture uses the repaired open header instead of the old giant card shadow');

console.log('project-architecture-hero-layout tests passed');
