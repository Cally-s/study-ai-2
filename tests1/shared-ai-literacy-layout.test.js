const assert=require('assert'),fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index (2).html'),'utf8');
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
const aiCss=fs.readFileSync(path.join(root,'ai-literacy-academic-integrity-coach.css'),'utf8');
const measuresCss=fs.readFileSync(path.join(root,'responsible-ai-learning-success-measures.css'),'utf8');

const appContentStart=html.indexOf('<div class="app-content">');
const appShellEnd=html.indexOf('<div class="modal" id="premiumModal"');
const aiHostIndex=html.indexOf('id="ai-literacy-integrated-coach-summary"');
const measuresHostIndex=html.indexOf('id="responsible-ai-learning-success-measures"');
const dividerIndex=html.indexOf('class="responsible-ai-section-divider"');

assert.ok(appContentStart>0,'App content wrapper must exist');
assert.ok(appShellEnd>appContentStart,'App shell should end before modal markup');
assert.strictEqual((html.match(/id="ai-literacy-integrated-coach-summary"/g)||[]).length,1,'AI Literacy host should render from one source of truth');
assert.strictEqual((html.match(/id="responsible-ai-learning-success-measures"/g)||[]).length,1,'Success Measures host should render from one source of truth');
assert.strictEqual((html.match(/class="responsible-ai-section-divider"/g)||[]).length,1,'Responsible AI shared learning content should have one divider');
assert.ok(aiHostIndex>appContentStart&&aiHostIndex<appShellEnd,'AI Literacy host must live inside the offset app content column');
assert.ok(measuresHostIndex>appContentStart&&measuresHostIndex<appShellEnd,'Success Measures host must live inside the offset app content column');
assert.ok(dividerIndex>appContentStart&&dividerIndex<aiHostIndex&&dividerIndex<measuresHostIndex,'Divider must appear inside app content immediately before shared Responsible AI learning sections');
assert.match(html,/class="app-shared-learning-summary"/,'Shared learning hosts must use the common content-shell class');
assert.doesNotMatch(html,/<hr class="responsible-ai-section-divider"[^>]*(aria-label|tabindex)=/,'Divider must not create a noisy or focusable accessibility-tree duplicate');

assert.match(css,/\.app-shared-learning-summary\{[\s\S]*?width:100%[\s\S]*?min-width:0[\s\S]*?padding-inline:clamp\(18px,2\.5vw,34px\)/,'Shared learning shell must provide full width, shrink safety, and page padding');
assert.match(css,/\.responsible-ai-section-divider\{[\s\S]*?width:calc\(100% - clamp\(36px,5vw,68px\)\)[\s\S]*?margin:clamp\(30px,4vw,48px\) auto clamp\(26px,3vw,40px\)[\s\S]*?border-top:1px solid var\(--border-subtle,#d9dee8\)/,'Divider must be subtle, centered, and aligned with the shared content width');
assert.doesNotMatch(css.match(/\.responsible-ai-section-divider\{[\s\S]*?\}/)?.[0]||'',/100vw|left:-|right:-|margin-left:-|margin-right:-|translateX\(/,'Divider must not use viewport-width or left-shifting layout hacks');
assert.match(css,/\.app-content\{[\s\S]*?margin-left:var\(--active-sidebar-width\)[\s\S]*?min-width:0[\s\S]*?max-width:100%/,'Fixed-sidebar layout must keep app content beside the active sidebar width');
assert.match(css,/@media\(max-width:1000px\)\{[\s\S]*?\.app-content\{[\s\S]*?margin-left:0/,'Mobile drawer layout must remove the desktop sidebar offset');

assert.match(aiCss,/\.ai-integrated-coach\{[\s\S]*?width:100%[\s\S]*?max-width:72rem[\s\S]*?min-width:0/,'AI Literacy section must stay within its parent content shell');
assert.match(aiCss,/\.ai-integrated-paths\{[\s\S]*?grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/,'AI Literacy competency grid must use safe columns');
assert.match(aiCss,/@media\(max-width:1050px\)\{[\s\S]*?grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/,'AI Literacy grid must use two columns at tablet widths');
assert.match(aiCss,/@media\(max-width:680px\)\{[\s\S]*?grid-template-columns:1fr/,'AI Literacy grid must stack on mobile');
assert.doesNotMatch(aiCss,/width:100vw|calc\(100% \+|translateX\(|margin-left:-|left:-/,'AI Literacy section must not use left-shifting or oversized-width hacks');

assert.match(measuresCss,/\.railm-workspace\{[\s\S]*?width:100%[\s\S]*?min-width:0[\s\S]*?max-width:72rem/,'Success Measures section must stay within the shared content shell');
assert.doesNotMatch(measuresCss,/100vw - 250px|calc\(250px|margin-left:-|translateX\(|left:-/,'Success Measures section must not manually compensate for the fixed sidebar');

console.log('shared AI Literacy layout tests passed');
