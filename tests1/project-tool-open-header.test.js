'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = file => fs.readFileSync(path.join(root, file), 'utf8');
const css = source('project-feature-hero.css');
const renderer = source('project-tool-header.js');
const html = source('index (2).html');

const pages = [
  {
    file: 'problem-scope-experience.js',
    pageClass: "pageClass: 'ps-hero'",
    titleId: "titleId: 'problem-scope-title'",
    title: 'Problem Scope',
    eyebrow: 'RESPONSIBLE PROJECT DESIGN',
    description: 'Define the real problem, understand who is affected, and decide whether AI is an appropriate solution before building your project.',
    guidance: 'Begin with the community need, not with the technology you want to use.',
    actions: ['Start Problem Scoping', 'Continue Draft', 'Try an Example', 'Import Project Idea']
  },
  {
    file: 'system-card-experience.js',
    pageClass: "pageClass: 'sc-hero'",
    titleId: "titleId: 'system-card-title'",
    title: 'System Card',
    eyebrow: 'RESPONSIBLE SYSTEM DOCUMENTATION',
    description: 'Explain what your AI system does, who it is designed for, how it works, what its limitations are, and how people remain in control.',
    guidance: 'A System Card should explain both what the system can do and when it should not be used.',
    actions: ['Create System Card', 'Continue Draft', 'Import from Problem Scope', 'View an Example']
  },
  {
    file: 'project-architecture-experience.js',
    pageClass: "pageClass:'ar-hero'",
    titleId: "titleId:'project-architecture-title'",
    title: 'Project Architecture',
    eyebrow: 'RESPONSIBLE PROJECT DESIGN',
    description: 'Design how your project’s interface, AI services, data, security, human review, and external tools work together.',
    guidance: 'Good architecture explains not only how the system works, but also what happens when a component fails.',
    actions: ['Build My Architecture', 'Continue Draft', 'Import from Problem Scope', 'Import from System Card', 'View an Example'],
    context: 'Selected Project'
  },
  {
    file: 'data-responsibility-experience.js',
    pageClass: "pageClass:'dr-hero'",
    titleId: "titleId:'data-responsibility-title'",
    title: 'Data Responsibility',
    eyebrow: 'RESPONSIBLE PROJECT DATA',
    description: 'Plan what data your project needs, where it comes from, who can access it, how it is protected, and when it should be deleted.',
    guidance: 'Collecting more data does not automatically make an AI system better. Use only the data the project genuinely needs.',
    actions: ['Build My Data Plan', 'Continue Draft', 'Import from System Card', 'Import from Architecture', 'View an Example'],
    context: 'Current Project'
  }
];

for (const page of pages) {
  const js = source(page.file);
  assert(js.includes('root.ProjectToolHeader.render'), `${page.title} uses the shared ProjectToolHeader renderer`);
  assert(js.includes(page.pageClass), `${page.title} passes its page class to the shared renderer`);
  assert(js.includes(page.titleId), `${page.title} passes its title id to the shared renderer`);
  assert(js.includes(page.eyebrow), `${page.title} keeps the required eyebrow`);
  assert(js.includes(page.description), `${page.title} keeps the required description`);
  assert(js.includes(page.guidance), `${page.title} keeps the required guidance`);
  assert(js.includes('backLabel') && js.includes('Return to Projects'), `${page.title} back button remains accessible`);
  assert(!js.includes('project-tool-header__top'), `${page.title} no longer uses the broken nested top grid`);
  assert(!js.includes('project-tool-header__supporting'), `${page.title} no longer uses the broken supporting grid`);
  assert(!js.includes('hero-actions-column'), `${page.title} does not use the old action column`);
  assert(!js.includes('hero-visual-column'), `${page.title} does not use the old visual column`);
  for (const action of page.actions) {
    assert(js.includes(action), `${page.title} keeps action: ${action}`);
  }
  if (page.context) {
    assert(js.includes(page.context), `${page.title} keeps the required project context label`);
    assert(js.includes('Choose or create a project'), `${page.title} keeps the project-selector fallback`);
  }
}

for (const snippet of [
  'project-feature-hero project-tool-header',
  'project-tool-header__main',
  'project-tool-header__identity',
  'project-tool-header__actions',
  'project-tool-header__context',
  'project-guidance-note',
  'aria-labelledby=',
  'type="button"'
]) {
  assert(renderer.includes(snippet), `Shared renderer emits ${snippet}`);
}

for (const requiredRule of [
  '.project-tool-header.project-feature-hero {',
  'display: grid !important',
  'grid-template-columns: 58px minmax(0, 1fr) minmax(280px, 390px) !important',
  'grid-template-areas: "back main actions" !important',
  'grid-area: back !important',
  'grid-area: main !important',
  'grid-area: actions !important',
  'border: 0 !important',
  'border-radius: 0 !important',
  'background: transparent !important',
  'box-shadow: none !important',
  'border-bottom: 1px solid var(--border-subtle, var(--project-tool-border-subtle)) !important',
  'position: static !important',
  'max-width: 62ch !important',
  'content: none !important',
  '@media (max-width: 1500px)',
  '@media (max-width: 720px)',
  '@media (max-width: 430px)',
  '@media (forced-colors: active)',
  '@media (prefers-reduced-motion: reduce)',
  '[dir="rtl"] .project-guidance-note::before'
]) {
  assert(css.includes(requiredRule), `Shared repaired header CSS includes ${requiredRule}`);
}

for (const forbidden of [
  '.project-tool-header__top',
  '.project-tool-header__supporting',
  'width: 100vw',
  'inline-size: min-content',
  'word-break: break-all',
  'position: absolute;\n  left',
  'background: radial-gradient',
  'min-height: 600px'
]) {
  assert(!css.includes(forbidden), `Shared repaired header CSS avoids ${forbidden}`);
}

assert(html.includes('project-tool-header.js?v=project-tool-header-emergency-20260830'), 'Shared project header renderer is loaded before the four project pages');
assert(html.includes('project-feature-hero.css?v=project-feature-hero-emergency-20260830'), 'Shared project header CSS is loaded');

console.log('project-tool-open-header tests passed');
