'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const source = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
const experienceJs = source('data-responsibility-experience.js');
const renderer = source('project-tool-header.js');
const sharedCss = source('project-feature-hero.css');

let assertions = 0;
const ok = (value, message) => {
  assert.ok(value, message);
  assertions += 1;
};

for (const text of [
  'root.ProjectToolHeader.render',
  "pageClass:'dr-hero'",
  "titleId:'data-responsibility-title'",
  "mainClass:'dr-hero-content'",
  "iconClass:'dr-hero-icon'",
  "eyebrowClass:'dr-kicker dr-hero-eyebrow'",
  "titleClass:'dr-hero-title'",
  "descriptionClass:'dr-hero-description'",
  "projectContext:{className:'dr-project dr-hero-project'",
  "label:'Current Project'",
  "projectName:readAll()[0]?.projectName||'Choose or create a project'",
  "guidanceClass:'dr-reminder dr-hero-reminder'",
  "actionsClass:'dr-hero-actions'",
  "actionsLabel:'Data Responsibility actions'",
  "backLabel:'Return to Projects'",
  'Current Project',
  'Choose or create a project',
  'Build My Data Plan',
  'Continue Draft',
  'Import from System Card',
  'Import from Architecture',
  'View an Example'
]) {
  ok(experienceJs.includes(text), `Data Responsibility passes ${text} to the shared header`);
}

for (const text of [
  'project-feature-hero project-tool-header',
  'project-tool-header__main',
  'project-tool-header__identity',
  'project-tool-header__context',
  'project-tool-header__actions',
  'project-guidance-note'
]) {
  ok(renderer.includes(text), `Shared renderer includes ${text}`);
}

for (const text of [
  '.project-tool-header.project-feature-hero {',
  'display: grid !important',
  'grid-template-areas: "back main actions" !important',
  'border: 0 !important',
  'border-radius: 0 !important',
  'content: none !important',
  '.project-tool-header__description',
  '.project-tool-header__context',
  '.project-context-card',
  '.project-guidance-note',
  '@media (max-width: 1500px)',
  '@media (max-width: 720px)',
  '@media (forced-colors: active)'
]) {
  ok(sharedCss.includes(text), `Shared repaired header CSS includes ${text}`);
}

ok(!experienceJs.includes('project-tool-header__top'), 'Data Responsibility no longer uses the broken nested top grid');
ok(!experienceJs.includes('project-tool-header__supporting'), 'Data Responsibility no longer uses the broken supporting grid');
ok(!experienceJs.includes('class="dr-hero-visual-column"'), 'Data Responsibility no longer uses the old split visual column');

console.log(`data-responsibility-hero-layout tests passed (${assertions} assertions)`);
