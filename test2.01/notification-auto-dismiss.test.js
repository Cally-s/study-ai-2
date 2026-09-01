'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(root,'script.js'),'utf8');
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
const rules=JSON.parse(fs.readFileSync(path.join(root,'data','studyWellBeingRules.json'),'utf8')).notifications;
const responseTools=fs.readFileSync(path.join(root,'ai-accessibility-commands.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index (2).html'),'utf8');
const constants=require('../notification-constants.js');
let n=0;
const ok=(value,message)=>{assert.ok(value,message);n++};
const eq=(actual,expected,message)=>{assert.deepStrictEqual(actual,expected,message);n++};

eq(constants.NOTIFICATION_TOAST_DURATION_MS,2000,'one exported two-second toast lifetime is defined');
ok(js.includes('window.StudySparkNotificationConstants?.NOTIFICATION_TOAST_DURATION_MS ?? 2000'),'notification manager consumes the shared duration');
ok(html.indexOf('notification-constants.js')<html.indexOf('script.js'),'shared duration loads before the notification manager');
ok(js.includes('function notificationDuration(){return NOTIFICATION_TOAST_DURATION_MS}'),'temporary toast duration cannot drift by notification type');
for(const key of ['defaultDurationMilliseconds','successDurationMilliseconds','warningDurationMilliseconds','errorDurationMilliseconds','supportiveAlertDurationMilliseconds','quietModeDurationMilliseconds'])eq(rules[key],2000,`${key} is exactly two seconds`);
ok(js.includes("timer=setTimeout(()=>{if(!destroyed)dismissNotification(notification.id)},notificationDuration())"),'temporary toast starts one fixed dismissal timer');
ok(js.includes("const isPersistent=notification.persistent||notification.requiresAcknowledgement||notification.priority==='urgent'"),'persistent and acknowledgement-required notices do not auto-dismiss');

const dismissBody=js.match(/function dismissNotification\(id\)\{([\s\S]*?)\}\nfunction createNotification/)?.[1]||'';
ok(dismissBody.includes('removeNotificationElement(el)'),'toast dismissal removes only the visible toast element');
ok(!dismissBody.includes('saveNotifications'),'toast dismissal does not mutate saved notification records');
ok(!dismissBody.includes('markNotificationRead'),'toast dismissal does not mark the saved notification read');
ok(js.includes("if(store)recordNotificationOccurrence(notification,'shown','toast')"),'new saved notifications are recorded separately before their toast renders');
ok(js.includes("function toast(message,type='information'){return showNotification({type,message,saveToHistory:true})}"),'the shared toast helper saves ordinary notifications to the Notifications page');
ok(js.includes("category:'reminder-delayed',message:'Reminder delayed for about 15 active-study minutes.',saveToHistory:true"),'delayed-reminder feedback is saved before its temporary popup closes');
ok(js.includes("category:row.category||'friend-request',message:row.message,saveToHistory:true"),'connection notifications are saved in the canonical notification history');
eq((js.match(/saveToHistory:false/g)||[]).length,1,'only explicit fictional demo previews bypass saved notification history');
ok(js.includes("function notificationUnreadCount(){return getNotifications().filter(row=>!row.isRead&&!row.isArchived).length}"),'bell count comes from saved unread and unarchived records');
ok(js.includes("function markNotificationRead(id)"),'read state remains an explicit separate operation');
ok(js.includes("function archiveNotification(id)"),'archive remains an intentional saved-record operation');
ok(js.includes("function deleteNotification(id)"),'delete remains an intentional saved-record operation');
ok(js.includes('controller?.destroy()'),'manual removal cancels its timer controller');
ok(js.includes('notificationToastControllers.forEach(controller=>controller.destroy())'),'logout cleanup destroys every timer');
ok(js.includes("close.setAttribute('aria-label','Dismiss notification')"),'optional close remains accessible');
ok(js.includes("el.setAttribute('aria-atomic','true')"),'toast announcement remains atomic');
ok(css.includes('pointer-events:none')&&css.includes('pointer-events:auto'),'toast region does not block the page');

eq((responseTools.match(/>Response Tools<\/h3>/g)||[]).length,1,'Response Tools has one runtime rendering source');
ok(responseTools.includes("if(el.dataset.responseToolsInjected==='true'"),'response tools injection remains idempotent');
ok(responseTools.includes("bars.forEach(bar=>{bar.hidden=bar!==latest"),'only the latest response toolbar remains visible');
ok(responseTools.includes('if(form.nextElementSibling!==latest)form.after(latest)'),'the single active Response Tools section remains directly after the composer');

console.log(`${n}/${n} assertions passed`);
