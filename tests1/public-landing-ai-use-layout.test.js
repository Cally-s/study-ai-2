const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('index (2).html');
const globalCss = read('style.css');
const mapJs = read('ai-use-map-runtime.js');
const mapCss = read('ai-use-map-runtime.css');
const receiptJs = read('ai-use-receipt-runtime.js');
const receiptCss = read('ai-use-receipt-runtime.css');
let assertions = 0;
const ok = (condition, message) => { assertions += 1; assert.ok(condition, message); };
const count = (text, value) => text.split(value).length - 1;

ok(count(html, 'class="public-ai-guidance-section"') === 1, 'one public AI guidance section');
ok(count(html, 'class="public-ai-guidance-container"') === 1, 'one shared centered container');
ok(count(html, 'id="publicAIUseMapHost"') === 1, 'one map host');
ok(count(html, 'id="publicAIUseReceiptHost"') === 1, 'one receipt host');
ok(html.indexOf('publicAIUseMapHost') < html.indexOf('publicAIUseReceiptHost'), 'map and receipt have stable order');
ok(html.includes('aria-label="Responsible AI learning tools"'), 'shared section is labelled');
ok(html.includes('ai-use-map-runtime.css?v=public-landing-ai-use-20260829'), 'map CSS cache versioned');
ok(html.includes('ai-use-map-runtime.js?v=public-landing-ai-use-20260829'), 'map runtime cache versioned');
ok(html.includes('ai-use-receipt-runtime.css?v=public-landing-ai-use-20260829'), 'receipt CSS cache versioned');
ok(html.includes('ai-use-receipt-runtime.js?v=public-landing-ai-use-20260829'), 'receipt runtime cache versioned');

ok(mapJs.includes("d.getElementById('publicAIUseMapHost')||d.getElementById('aiUseMapContent')"), 'map requires an explicit host');
ok(!mapJs.includes("d.querySelector('main')||d.body"), 'map never attaches to the first main');
ok(receiptJs.includes("d.getElementById('publicAIUseReceiptHost')||d.getElementById('aiUseReceiptContent')"), 'receipt requires an explicit host');
ok(!receiptJs.includes("d.getElementById('aiUseReceiptContent')||d.querySelector('main')"), 'receipt never attaches to the first main');
ok(receiptJs.includes('class="ai-use-receipt-actions"'), 'receipt actions use a grouped toolbar');
ok(receiptJs.includes('class="btn btn-primary"'), 'save receipt is the primary action');
ok(receiptJs.includes('class="btn btn-secondary"'), 'not now is the secondary action');
ok(receiptJs.includes('type="button"'), 'receipt controls cannot submit an unrelated form');

ok(globalCss.includes('max-width:1176px'), 'shared wrapper has a centered maximum width');
ok(globalCss.includes('margin-inline:auto'), 'shared wrapper is centered');
ok(globalCss.includes('padding-inline:clamp(1rem,3vw,1.75rem)'), 'shared wrapper has fluid side padding');
ok(globalCss.includes('env(safe-area-inset-left)'), 'mobile left safe area supported');
ok(globalCss.includes('env(safe-area-inset-right)'), 'mobile right safe area supported');
ok(globalCss.includes('.public-ai-guidance-host{min-width:0;width:100%}'), 'hosts cannot force viewport overflow');
ok(mapCss.includes('.public-ai-guidance-host>.ai-use-map{margin:0'), 'map card uses landing wrapper alignment');
ok(receiptCss.includes('.public-ai-guidance-host>.ai-use-receipt-offer{margin:0'), 'receipt card uses landing wrapper alignment');
ok(mapCss.includes('border-radius:1.25rem') && receiptCss.includes('border-radius:1.25rem'), 'cards share the same radius');
ok(mapCss.includes('box-shadow:0 18px 50px') && receiptCss.includes('box-shadow:0 18px 50px'), 'cards share the same elevation');
ok(receiptCss.includes('.ai-use-receipt-actions{display:flex'), 'receipt toolbar separates controls');
ok(receiptCss.includes('flex-direction:column'), 'receipt actions stack cleanly on narrow screens');
ok(receiptCss.includes('width:100%'), 'mobile receipt actions can use available width');
ok(receiptCss.includes('@media(forced-colors:active)'), 'receipt actions support forced colours');
ok(receiptCss.includes(':focus-visible'), 'receipt actions preserve visible keyboard focus');
ok(mapCss.includes('[dir="rtl"]') && receiptCss.includes('[dir=rtl]'), 'both cards retain RTL support');

console.log(`public landing AI use layout: ${assertions} assertions passed`);
