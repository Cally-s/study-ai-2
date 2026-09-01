const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

const helper=read('ai-coach-language-tools.js');
const css=read('ai-coach-language-tools.css');
const html=read('index (2).html');
const modules=['plain-language.js','explanation-levels.js','language-bridge.js','academic-vocabulary.js','multilingual-ai.js'].map(read);

assert.match(helper,/Need help with this step\?/,'each instruction gets the compact support-row label');
assert.match(helper,/Help Me Understand/,'support row exposes one plain-language help action');
assert.match(helper,/data-language-tool-proxy="listen"/,'Listen remains a direct one-click proxy');
assert.match(helper,/Help Me Understand This Step/,'expanded panel uses the requested heading');
assert.match(helper,/Choose one way to make this instruction easier to use\./,'expanded panel has the requested description');
assert.match(helper,/MAKE IT SIMPLER/,'panel includes Make It Simpler');
assert.match(helper,/ENGLISH \+ MY LANGUAGE/,'panel includes English + My Language');
assert.match(helper,/EXPLAIN KEY WORDS/,'panel includes Explain Key Words');
assert.match(helper,/More Settings/,'advanced settings are hidden behind More Settings');
assert.match(helper,/Detail Level/,'More Settings includes Detail Level');
assert.match(helper,/Interface language/,'More Settings includes interface language');
assert.match(helper,/Explanation language/,'More Settings includes explanation language');
assert.match(helper,/Home language/,'More Settings includes home language');
assert.match(helper,/Apply Setting/,'More Settings includes Apply Setting');
assert.match(helper,/Apply to This Step/,'per-step settings are available');
assert.match(helper,/Apply to All Steps/,'apply-to-all settings are available');
assert.match(helper,/function openPanel\(toolbar,trigger\)\{[\s\S]*closePanel\(false\);/,'opening a panel closes any existing panel first');
assert.match(helper,/event\.key==='Escape'/,'Escape closes the panel');
assert.match(helper,/aria-expanded/,'Help Me Understand exposes expanded state');
assert.match(helper,/aria-controls="\$\{PANEL_ID\}"/,'Help Me Understand controls the inline panel');
assert.match(helper,/control\.hidden=true/,'original source controls stay hidden from the visible UI');
assert.match(helper,/control\.click\(\)/,'proxy controls preserve existing handlers');
assert.match(helper,/pauseTextToSpeech|resumeTextToSpeech/,'Listen proxy can pause and resume playback');
assert.match(helper,/__studySparkReturnFocusTarget/,'focus returns to the visible control instead of a hidden source button');
assert.match(helper,/oldCoachAdd/,'AI Coach side-panel compatibility path is preserved');
assert.match(helper,/container\.closest\?\.\(`\.\$\{TOOLBAR_CLASS\}`\)[\s\S]*control\.hidden=true/,'generated support results do not receive nested support rows');
assert.doesNotMatch(helper,/Language &amp; Explanation Tools/,'large technical language panel is no longer rendered by the shared helper');
assert.doesNotMatch(helper,/language-explanation-tools-layer[\s\S]*document\.body\.appendChild/,'the shared helper no longer appends a large fixed popup to the body');

assert.match(css,/\.ai-coach-language-tools\.step-support-row/,'support row has dedicated styling');
assert.match(css,/margin-top:16px/,'support row uses compact vertical spacing');
assert.match(css,/border-radius:15px/,'support row has compact rounded corners');
assert.match(css,/\.step-support-button/,'support buttons have dedicated styling');
assert.match(css,/min-height:42px/,'support buttons retain accessible touch targets');
assert.match(css,/\.help-understanding-panel/,'inline Help Me Understand panel is styled');
assert.match(css,/\.help-understanding-options\{[\s\S]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/,'desktop panel uses three option cards');
assert.match(css,/\.help-option-card/,'three primary choices are styled as cards');
assert.match(css,/\.help-more-settings/,'More Settings is styled separately');
assert.match(css,/\.help-understanding-result/,'selected support results render beneath the instruction');
assert.match(css,/@media\(max-width:900px\)/,'tablet layout adapts the option grid');
assert.match(css,/@media\(max-width:680px\)/,'mobile layout stacks the support row');
assert.match(css,/@media\(forced-colors:active\)/,'forced-colours mode is supported');
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/,'reduced-motion mode is supported');
assert.match(css,/:focus-visible/,'visible keyboard focus is preserved');
assert.match(css,/body \.plain-language-panel/,'existing sub-panels keep polished shared styling');
assert.match(css,/\.language-explanation-tools-layer\{[\s\S]*display:none!important/,'obsolete fixed popup layer is disabled');

assert.match(html,/ai-coach-language-tools\.css\?v=help-step-support-row-20260831/,'toolbar styles are cache-busted');
assert.match(html,/ai-coach-language-tools\.js\?v=help-guide-step-support-placement-20260831/,'updated toolbar helper is cache-busted');
assert.match(html,/plain-language\.js\?v=help-step-support-row-20260831/,'plain-language label update is cache-busted');
assert.match(html,/explanation-levels\.js\?v=help-step-support-row-20260831/,'detail-level label update is cache-busted');
assert.match(html,/language-bridge\.js\?v=help-step-support-row-20260831/,'language label update is cache-busted');
assert.match(html,/academic-vocabulary\.js\?v=help-step-support-row-20260831/,'vocabulary label update is cache-busted');
assert.match(html,/multilingual-ai\.js\?v=help-step-support-row-20260831/,'language settings label update is cache-busted');

assert.match(read('text-to-speech.js'),/<svg aria-hidden="true"[^>]*>[\s\S]*<span>Listen<\/span>/,'Listen fallback uses an SVG icon instead of emoji');
assert.doesNotMatch(read('text-to-speech.js'),/🔊/,'Listen fallback no longer uses an emoji icon');
assert.match(read('plain-language.js'),/\.ai-coach-language-tools/,'support row text is excluded from simplification source extraction');

for(const source of modules){
 assert.match(source,/AICoachLanguageTools\?\.add\(el,b\)/,'each language feature uses the shared toolbar');
 assert.doesNotMatch(source,/:scope > \.(?:plain-language|explanation-level|language-bridge|academic-vocabulary|multilingual-response)-button/,'nested toolbar controls do not trigger duplicate injection');
}

for(const label of ['Make It Simpler','Choose Detail Level','English + My Language','Explain Key Words','Language Settings']){
 assert.ok(modules.some(source=>source.includes(`b.textContent='${label}'`)),`${label} fallback handler remains available`);
}

console.log('ai-coach-language-tools tests passed');
