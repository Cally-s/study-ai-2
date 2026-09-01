const assert=require('assert'),fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index (2).html'),'utf8');
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');

const footer=html.match(/<div class="sidebar-footer">[\s\S]*?<\/aside>/)?.[0]||'';
assert.match(footer,/id="profileShortcut"[^>]*data-view="settings"/,'Account shortcut must retain its Settings navigation');
assert.match(footer,/id="logoutBtn"/,'Guest exit control must remain in the sidebar footer');
assert.ok(footer.indexOf('profileShortcut')<footer.indexOf('logoutBtn'),'Account shortcut must stay above Exit Guest Mode');

const guestAccountRule=css.match(/\.user-mini:has\(#logoutBtn:not\(\[title="Log out"\]\)\) \.user-mini-main\{[\s\S]*?\}/)?.[0]||'';
assert.match(guestAccountRule,/align-self:stretch/,'Guest Student card must stretch across the footer');
assert.match(guestAccountRule,/flex:0 0 auto/,'Guest Student card must keep a stable full-width row');
assert.match(guestAccountRule,/width:100%/,'Guest Student card must align to the Exit Guest Mode button width');
assert.match(guestAccountRule,/margin-left:0/,'Guest Student card must not be pushed right by inherited auto margins');
assert.match(guestAccountRule,/justify-content:flex-start/,'Guest Student profile content must remain left aligned');
assert.doesNotMatch(guestAccountRule,/position:(?:fixed|absolute)/,'Account shortcut must remain in normal sidebar flow');

const guestExitRule=css.match(/\.user-mini:has\(#logoutBtn:not\(\[title="Log out"\]\)\) #logoutBtn\{[\s\S]*?\}/)?.[0]||'';
assert.match(guestExitRule,/width:100%/,'Exit Guest Mode must remain a full-width footer action');
assert.match(guestExitRule,/margin-left:0/,'Exit Guest Mode must align with the Guest Student card');

const sidebarFooterRule=css.match(/\.sidebar-footer\{[\s\S]*?\}/)?.[0]||'';
assert.match(sidebarFooterRule,/width:100%/,'Sidebar footer must use the full sidebar content width');
assert.match(sidebarFooterRule,/min-width:0/,'Sidebar footer must avoid overflow in narrow layouts');
console.log('sidebar account footer tests passed');
