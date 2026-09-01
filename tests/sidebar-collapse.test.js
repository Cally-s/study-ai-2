const assert=require('assert'),fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index (2).html'),'utf8');
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
const script=fs.readFileSync(path.join(root,'script.js'),'utf8');
const nav=fs.readFileSync(path.join(root,'sidebar-navigation.js'),'utf8');

assert.match(html,/id="app" class="app-shell hidden" data-sidebar-state="expanded"/,'app shell should expose one sidebar state attribute');
assert.match(html,/aside id="studyspark-sidebar" class="sidebar app-sidebar"/,'sidebar should have one controlled target id');
assert.match(html,/id="sidebarToggle"[\s\S]*aria-label="Collapse sidebar"[\s\S]*aria-expanded="true"[\s\S]*aria-controls="studyspark-sidebar"/,'sidebar toggle should start with accessible expanded-state metadata');
assert.match(html,/sidebar-toggle-icon-collapse/,'collapse icon should be present');
assert.match(html,/sidebar-toggle-icon-expand/,'expand icon should be present');
assert.match(html,/script\.js\?v=study-together-account-gate-v2-20260831/,'shell behavior script should be cache-busted');
assert.match(html,/sidebar-navigation\.js\?v=sidebar-label-fix-20260831/,'sidebar navigation renderer should be cache-busted');
assert.doesNotMatch(html,/id="sidebarToggle"[\s\S]*>[<>]\s*</,'sidebar toggle should not use bare text chevrons');

assert.match(css, /--sidebar-expanded-width:250px/, 'expanded sidebar width should be centralized');
assert.match(css, /--sidebar-collapsed-width:76px/, 'collapsed sidebar width should be centralized');
assert.match(css, /\.app-shell\[data-sidebar-state="collapsed"\]\{[\s\S]*--active-sidebar-width:var\(--sidebar-collapsed-width\)/, 'collapsed shell state should set the active width');
assert.match(css, /\.sidebar\{[\s\S]*width:var\(--active-sidebar-width\)/, 'sidebar should use the active width variable');
assert.match(css, /\.app-content\{[\s\S]*margin-left:var\(--active-sidebar-width\)/, 'main content should expand with the active sidebar width');
assert.match(css, /\.sidebar-nav button\{[\s\S]*grid-template-columns:24px minmax\(0,1fr\)/, 'expanded sidebar items should reserve a stable icon column and full label column');
assert.match(css, /\.sidebar-nav button \.sidebar-nav-label\{[\s\S]*width:100%[\s\S]*max-width:none[\s\S]*overflow:visible[\s\S]*text-overflow:clip/, 'expanded labels should override old 24px span clipping');
assert.match(css, /\.app-shell\[data-sidebar-state="collapsed"\] \.brand-text/, 'collapsed sidebar should hide the full brand text');
assert.match(css, /\.app-shell\[data-sidebar-state="collapsed"\] \.sidebar-nav \.sidebar-nav-label/, 'collapsed sidebar should visually hide nav labels');
assert.match(css, /\.app-shell\[data-sidebar-state="collapsed"\] \.sidebar-nav \.sidebar-nav-label\{display:none\}/, 'collapsed labels should be fully hidden rather than clipped to partial words');
assert.match(css, /content:attr\(data-sidebar-tooltip\)/, 'collapsed controls should expose visual tooltips from data attributes');
assert.match(css, /@media\(prefers-reduced-motion:reduce\)/, 'sidebar transition should respect reduced motion');
assert.match(css, /@media\(forced-colors:active\).*\.sidebar-toggle/s, 'sidebar toggle should support forced colours');
assert.match(css, /@media\(max-width:1000px\)[\s\S]*\.app-shell\[data-sidebar-state="collapsed"\] \.sidebar\{[\s\S]*width:min\(280px,85vw\)/, 'mobile drawer should stay full-width even when desktop state is collapsed');

assert.match(script, /const SIDEBAR_STATE_KEY = 'studyspark-sidebar-state'/, 'sidebar preference key should be stable');
assert.match(script, /function readSidebarState\(\)/, 'sidebar should read the saved preference');
assert.match(script, /function applySidebarState\(state=readSidebarState\(\)\)/, 'sidebar should have one apply function');
assert.match(script, /function toggleSidebar\(\)/, 'sidebar should have one toggle function');
assert.match(script, /localStorage\.setItem\(SIDEBAR_STATE_KEY/, 'sidebar state should persist locally');
assert.match(script, /toggle\.setAttribute\('aria-label',label\)/, 'toggle label should update dynamically');
assert.match(script, /toggle\.setAttribute\('aria-expanded',String\(!collapsed\)\)/, 'expanded state should update dynamically');
assert.match(script, /initializeSidebarToggle\(\);[\s\S]*#menuBtn/, 'sidebar toggle should initialize without replacing the mobile menu');

assert.match(nav, /sidebar-nav-label/, 'navigation labels should be wrapped for safe visual hiding');
assert.match(nav, /aria-label="\$\{x\.label\}"/, 'navigation buttons should retain accessible names');
assert.match(nav, /data-sidebar-tooltip="\$\{x\.label\}"/, 'collapsed navigation buttons should have tooltip text');
assert.doesNotMatch(nav, /title="\$\{x\.label\}"/, 'expanded navigation should not show native hover tooltips');
assert.doesNotMatch(nav, /item\('student-home','Home','dashboard','H'/, 'student nav should not rely on isolated letter icons');
assert.match(nav, /navIconSVG\('home'\)/, 'Home should use a real inline icon');
assert.match(nav, /navIconSVG\('usersRound'\)/, 'Study Together should keep its people icon');

console.log('sidebar collapse tests passed');
