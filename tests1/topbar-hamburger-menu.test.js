'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index (2).html'),'utf8');
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
const js=fs.readFileSync(path.join(root,'script.js'),'utf8');
let count=0;
const ok=(value,message)=>{assert.ok(value,message);count++};

const button=html.match(/<button id="menuBtn"[\s\S]*?<\/button>/)?.[0]||'';
ok(Boolean(button),'shared menu button exists');
ok(!/>\s*Menu\s*</.test(button),'visible Menu word is removed');
ok(button.includes('class="hamburger-menu-icon"'),'hamburger icon is rendered');
ok((button.match(/<path d="M4 (?:6|12|18)h16"><\/path>/g)||[]).length===3,'icon contains three horizontal lines');
ok(button.includes('aria-label="Open menu"'),'button keeps a clear accessible name');
ok(button.includes('aria-expanded="false"'),'button keeps its collapsed state');
ok(button.includes('aria-hidden="true"'),'decorative icon is hidden from assistive technology');
ok(button.includes('focusable="false"'),'decorative icon cannot receive focus');
ok(css.includes('.hamburger-menu-icon{display:block;width:20px;height:20px;pointer-events:none}'),'icon is compact and cannot intercept clicks');
ok(css.includes('@media(max-width:1000px){.menu-btn{display:inline-flex}}'),'responsive menu remains visible at its existing breakpoint');
ok(css.includes('.menu-btn:focus-visible'),'keyboard focus remains visible');
ok(css.includes('@media(forced-colors:active){.menu-btn:focus-visible'),'forced-colour focus is supported');
ok(js.includes("sidebar.classList.toggle('open')"),'existing menu open behavior is preserved');
ok(js.includes("$('#menuBtn').setAttribute('aria-expanded',String(open))"),'expanded state still follows menu state');
ok(js.includes("menu?.setAttribute('aria-expanded','false')"),'existing close behavior remains intact');

console.log(`topbar hamburger menu: ${count}/${count} assertions passed`);
