'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const source = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
const js = source('community-ai-project.js');
const css = source('community-ai-project.css');
const html = source('index (2).html');

let assertions = 0;
const ok = (value, message) => {
  assert.ok(value, message);
  assertions += 1;
};

for (const text of [
  'Community AI Project',
  'Project Pathway',
  'Responsible Project Design',
  'Start with a real need, not with AI.',
  'community-project-pathway-header',
  'community-project-pathway-header__progress',
  'Choose or create a project to begin tracking progress.',
  'Choose Project',
  'PHASE 1 — DISCOVER',
  'PHASE 2 — DESIGN AND BUILD',
  'PHASE 3 — TEST AND IMPROVE',
  'PHASE 4 — REFLECT',
  'No project is currently selected.',
  'Create a Project',
  'Currently Selected',
  'Coming Soon',
  'We could not open this project stage. Your saved work has not been deleted.',
  'Continue Current Step',
  'View Project Summary',
  'Review Progress',
  'View Example',
  'Save and Continue Later',
  'Choose Non-AI Path',
  'Stop for Safety Review'
]) {
  ok(js.includes(text), `Community pathway JavaScript includes ${text}`);
}

for (const text of [
  "view:'problemScopingStudio'",
  "view:'aiArchitectureDesignStudio'",
  "root.showView(item.view)",
  "root.showView?.('aiSystemCardStudio')",
  "root.showView?.('aiUseReceipt')"
]) {
  ok(js.includes(text), `Stage/action routing includes ${text}`);
}

for (const text of [
  '.project-pathway{',
  'margin-top:clamp(28px,4vw,52px)',
  '.community-project-pathway-header{',
  'border-bottom:1px solid var(--border-subtle,var(--project-line))',
  '.community-project-pathway-header__title{',
  'font-size:clamp(1.8rem,3vw,2.8rem)',
  '.community-project-pathway-header__progress{',
  'background:linear-gradient(135deg,rgba(246,244,255,.95),rgba(239,250,248,.92))',
  '.project-stage-grid{',
  'grid-template-columns:repeat(3,minmax(0,1fr))',
  '@media(max-width:800px)',
  'flex-direction:column',
  '@media(max-width:48rem)',
  '@media(prefers-reduced-motion:reduce)',
  '@media(forced-colors:active)',
  '[dir="rtl"] .community-project-shell'
]) {
  ok(css.includes(text), `Community pathway CSS includes ${text}`);
}

ok(!js.includes('DISPLAY.map(x=>`<li>${x}</li>`).join'), 'Plain text stage list is not rendered');
ok(!/Community A(?:\s|\u00a0)+I Project/.test(js), 'Community AI Project title does not contain split A I text');
ok(js.includes("const COMMUNITY_AI_PROJECT_TITLE='Community AI Project'"), 'Community AI Project title uses one complete source value');
ok(!js.includes('<span>A</span>') && !js.includes('<span>I</span>'), 'AI acronym is not split into separate spans');
ok(js.includes("if(view==='communityAIProject')render()"), 'Projects view renders when opened through normal route navigation');
ok(!js.includes('<h1 tabindex="-1">${lesson.workspace}</h1>'), 'Lower duplicate Community AI Project h1 is removed');
ok(!js.includes('id="community-project-pathway-title">${COMMUNITY_AI_PROJECT_TITLE}</h2>'), 'Pathway h2 no longer repeats Community AI Project');
ok(js.includes('class="community-project-pathway-header__title">Project Pathway</h2>'), 'Pathway title is Project Pathway');
ok(html.includes('community-ai-project.css?v=project-pathway-header-20260830'), 'Updated pathway stylesheet is cache-busted');
ok(html.includes('community-ai-project.js?v=project-pathway-header-20260830'), 'Updated pathway script is cache-busted');

console.log(`community-ai-project-pathway-layout tests passed (${assertions} assertions)`);
