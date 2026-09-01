(function(root){
  'use strict';

  const sessions=new Map();
  const pathwayViews=new Map();
  const actor={userId:'ui',role:'student',tenantId:'personal'};
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const slug=value=>String(value||'').toLowerCase().replaceAll('_','-');

  function lab(){return root.AILiteracyLab}
  function content(){return root.document?.getElementById('aiLiteracyContent')}
  function pathwayName(button){
    return button.closest('#aiLiteracyContent')?.querySelector('.ai-pathway-header h2')?.textContent?.trim()?.toUpperCase()||'';
  }
  function moduleRecord(pathway,moduleId){
    const path=lab()?.AILiteracyPathways?.[pathway];
    const module=path?.blocks?.find(item=>item.id===moduleId);
    if(!path||!module)return null;
    const index=path.blocks.indexOf(module);
    return {pathway,pathwayData:path,pathwayName:path.title,module,index,goal:path.goals?.[index]||'Practise this connected competency.'};
  }
  function setRoute(pathway,moduleId){
    const hash=`#learn/pathways/${slug(pathway)}/modules${moduleId?`/${slug(moduleId)}`:''}`;
    if(root.location?.hash!==hash)root.history?.replaceState?.(null,'',hash);
  }
  function focusAndReveal(element){
    element?.scrollIntoView?.({behavior:'smooth',block:'nearest'});
    root.setTimeout?.(()=>element?.focus?.(),80);
  }
  function selectModule(button){
    const pathway=pathwayName(button),moduleId=button.dataset.aiModule,record=moduleRecord(pathway,moduleId);
    if(!record)return;
    setRoute(pathway);
    const box=content();
    box.querySelectorAll('.ai-module-card').forEach(card=>card.removeAttribute('aria-current'));
    const card=button.closest('.ai-module-card');
    card?.setAttribute('aria-current','true');
    box.querySelectorAll('[data-ai-module]').forEach(control=>{
      control.textContent=control===button?'Selected ✓':'Choose module →';
      control.setAttribute('aria-pressed',String(control===button));
    });
    const existing=box.querySelector('#aiSelectedModulePanel');
    const panel=existing||root.document.createElement('section');
    panel.id='aiSelectedModulePanel';
    panel.className='ai-selected-module';
    panel.setAttribute('aria-labelledby','aiSelectedModuleTitle');
    const continuing=sessions.has(moduleId);
    panel.innerHTML=`<div class="ai-selected-module-copy"><span class="ai-eyebrow">SELECTED MODULE · ${record.index+1} OF ${record.pathwayData.blocks.length}</span><h2 id="aiSelectedModuleTitle" tabindex="-1">${esc(record.module.title)}</h2><p>${esc(record.goal)}</p><span class="ai-selected-module-status"><span aria-hidden="true">${continuing?'↻':'✓'}</span> ${continuing?'In progress':'Ready to start'}</span></div><div class="ai-selected-module-actions"><button class="ai-continue-button" type="button" data-start-selected-module="${esc(moduleId)}" data-selected-pathway="${esc(pathway)}">${continuing?'Continue Module':'Start Module'} <span aria-hidden="true">→</span></button><button class="ai-module-subtle-action" type="button" data-choose-another-module>Choose Another Module</button></div>`;
    if(!existing){
      const starter=box.querySelector('#aiPathwayStarter');
      if(starter)starter.before(panel);else box.appendChild(panel);
    }
    focusAndReveal(panel.querySelector('h2'));
  }
  function openModule(pathway,moduleId){
    const record=moduleRecord(pathway,moduleId);
    if(!record)return;
    let session=sessions.get(moduleId);
    if(!session){
      const response=lab().startAILiteracyModule({pathway,moduleId,idempotencyKey:`module-flow-${pathway}-${moduleId}`},actor);
      session=response.session;
      sessions.set(moduleId,session);
    }
    const box=content();
    pathwayViews.set(pathway,box.innerHTML);
    box.innerHTML=`<article class="ai-module-workspace"><button class="ai-module-back" type="button" data-back-to-pathway="${esc(pathway)}">← Back to ${esc(record.pathwayName)} modules</button><header class="ai-module-workspace-header ai-path-${slug(record.pathwayName)}"><span class="ai-card-icon" aria-hidden="true">${String(record.index+1).padStart(2,'0')}</span><div><span class="ai-eyebrow">${esc(record.pathwayName.toUpperCase())} PATHWAY · MODULE ${record.index+1} OF ${record.pathwayData.blocks.length}</span><h1 tabindex="-1">${esc(record.module.title)}</h1><p>${esc(record.goal)}</p></div></header><div class="ai-module-workspace-grid"><section class="ai-module-next-step"><span class="ai-eyebrow">CURRENT LEARNING STEP</span><h2>Student Attempt</h2><p>Begin with your own thinking. StudySpark will support you after you contribute an attempt.</p><div class="ai-module-session-status" role="status"><span aria-hidden="true">●</span> Module in progress</div></section><aside class="ai-module-cycle-summary"><h2>How this module works</h2><ol><li><strong>1. Student Attempt</strong><span>Share your current thinking.</span></li><li><strong>2. AI Coaching</strong><span>Get guidance without losing ownership.</span></li><li><strong>3. Verify and Revise</strong><span>Check evidence and improve your work.</span></li><li><strong>4. Explain and Reflect</strong><span>Show what you understand.</span></li></ol></aside></div></article>`;
    setRoute(pathway,moduleId);
    focusAndReveal(box.querySelector('h1'));
  }
  function backToPathway(pathway){
    const saved=pathwayViews.get(pathway),box=content();
    if(saved&&box){box.innerHTML=saved;setRoute(pathway);focusAndReveal(box.querySelector('.ai-pathway-header h2'));return}
    const tab=root.document?.querySelector(`[data-ai-path="${pathway}"]`);
    if(tab){tab.click();return}
    root.document?.querySelector('[data-ai-home]')?.click();
  }
  function handleClick(event){
    const moduleButton=event.target.closest?.('[data-ai-module]');
    if(moduleButton){event.preventDefault();event.stopImmediatePropagation();selectModule(moduleButton);return}
    const start=event.target.closest?.('[data-start-selected-module]');
    if(start){event.preventDefault();openModule(start.dataset.selectedPathway,start.dataset.startSelectedModule);return}
    const another=event.target.closest?.('[data-choose-another-module]');
    if(another){event.preventDefault();const heading=content()?.querySelector('.ai-module-grid');focusAndReveal(heading);return}
    const back=event.target.closest?.('[data-back-to-pathway]');
    if(back){event.preventDefault();backToPathway(back.dataset.backToPathway)}
  }
  function init(){root.document?.addEventListener('click',handleClick,true)}
  const API={init,selectModule,openModule,_test:{sessions,pathwayViews,moduleRecord,slug}};
  root.StudySparkPathwayModuleFlow=API;
  if(typeof module==='object'&&module.exports)module.exports=API;
  if(root.document)root.document.readyState==='loading'?root.document.addEventListener('DOMContentLoaded',init):init();
})(typeof window!=='undefined'?window:globalThis);
