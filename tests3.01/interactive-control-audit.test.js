const assert=require('assert');
const fs=require('fs');
const path=require('path');

const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'interactive-control-audit.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index (2).html'),'utf8');

assert.doesNotMatch(html,/interactive-control-audit\.js/,'the diagnostic audit must not run as a global visibility gate');
assert.doesNotMatch(source,/summary,\[tabindex\]/,'focusable page containers must never be treated as action controls');
assert.match(source,/prototype\.addEventListener=function/,'direct event listeners must be recorded for the release contract');
assert.doesNotMatch(source,/control\.id\|\|control\.getAttribute\('form'\)/,'an element ID alone must not be mistaken for a working action');
assert.match(source,/No actionable contract is attached/,'dead controls must be identified explicitly');
assert.match(source,/control\.hidden=true/,'unfinished controls must be removed from the released interface');
assert.match(source,/aria-hidden/,'hidden controls must also be removed from the accessibility tree');
assert.match(source,/!control\.hasAttribute\('type'\)&&!control\.closest\('form'\)/,'non-form buttons must be normalized without changing intentional form submissions');
assert.match(source,/Missing an accessible name/,'unlabelled controls must fail the release audit');
assert.match(source,/Custom interactive element is not keyboard reachable/,'custom controls must be keyboard reachable');
assert.match(source,/MutationObserver/,'controls added by lazy feature modules must also be audited');
assert.match(source,/getTable:table/,'the internal audit inventory must remain inspectable');

console.log('interactive control release audit tests passed');
