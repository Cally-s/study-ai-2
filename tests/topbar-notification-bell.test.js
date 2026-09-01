'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path'),root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index (2).html'),'utf8'),css=fs.readFileSync(path.join(root,'style.css'),'utf8'),script=fs.readFileSync(path.join(root,'script.js'),'utf8');let passed=0;
function test(name,fn){try{fn();passed++}catch(error){console.error(`FAIL: ${name}\n${error.stack}`);process.exitCode=1}}
const topbar=html.match(/<header class="app-topbar">[\s\S]*?<\/header>/)?.[0]||'';
const button=topbar.match(/<button class="icon-button notification-top-button"[\s\S]*?<\/button>/)?.[0]||'';
test('notification button remains in topbar',()=>assert.ok(button));
test('placeholder N removed',()=>assert.ok(!/>\s*N\s*</.test(button)));
test('bell svg present',()=>assert.ok(button.includes('notification-bell-icon')&&button.includes('<svg')));
test('bell is decorative',()=>assert.ok(button.includes('aria-hidden="true"')&&button.includes('focusable="false"')));
test('button retains accessible name',()=>assert.ok(button.includes('aria-label="Notifications"')));
test('button retains destination',()=>assert.ok(button.includes('data-view="notifications"')));
test('button type remains compact icon control',()=>assert.ok(button.includes('icon-button notification-top-button')));
test('badge retained',()=>assert.ok(button.includes('id="topNotificationBadge"')&&button.includes('notification-badge hidden')));
test('badge update retained',()=>assert.ok(script.includes("['#notificationBadge','#topNotificationBadge']")));
test('unread accessible name retained',()=>assert.ok(script.includes('Notifications, ${count} unread')));
test('bell sizing',()=>assert.ok(css.includes('.notification-top-button .notification-bell-icon')&&css.includes('width:19px')&&css.includes('height:19px')));
test('pointer safety',()=>assert.ok(css.includes('pointer-events:none')));
test('visible focus',()=>assert.ok(css.includes('.notification-top-button:focus-visible')));
if(!process.exitCode)console.log(`topbar-notification-bell: ${passed}/${passed} assertions passed`);
