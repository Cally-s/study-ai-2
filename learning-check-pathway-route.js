(function(root){
  'use strict';
  const BUTTON_LABEL='Choose a Pathway Instead';
  const HEADING_LABEL='Choose a Learning Pathway';
  function exactButton(target){const button=target?.closest?.('[data-diag-exit]');return button&&button.textContent.trim()===BUTTON_LABEL?button:null}
  function focusSelector(){
    const content=root.document?.getElementById('aiLiteracyContent');if(!content)return false;
    const heading=[...content.querySelectorAll('h2')].find(node=>node.textContent.trim()==='Choose a pathway'||node.textContent.trim()===HEADING_LABEL);
    if(!heading)return false;
    heading.textContent=HEADING_LABEL;heading.id='chooseLearningPathway';heading.tabIndex=-1;
    const section=heading.closest('.ai-learn-section,section');section?.setAttribute('aria-labelledby',heading.id);
    root.history?.replaceState?.(null,'','#learn/overview/pathways');
    heading.focus({preventScroll:true});section?.scrollIntoView({block:'start',behavior:'auto'});
    return ['UNDERSTAND','APPLY','CREATE'].every(path=>content.querySelector(`[data-ai-path="${path}"]`));
  }
  function prepareSelector(){const content=root.document?.getElementById('aiLiteracyContent');if(!content)return false;content.querySelector('[data-ai-home]')?.click();return focusSelector()}
  function openPathwaySelector(){
    root.showView?.('aiLiteracy');
    if(!prepareSelector()){
      const entry=root.document?.querySelector('[data-ai-literacy-entry]');entry?.click();
      root.setTimeout?.(prepareSelector,0);
    }
    root.setTimeout?.(focusSelector,80);root.setTimeout?.(focusSelector,300);
  }
  function bind(){const doc=root.document;if(!doc||doc.documentElement.dataset.learningCheckPathwayRouteBound)return;doc.documentElement.dataset.learningCheckPathwayRouteBound='true';doc.addEventListener('click',event=>{if(!exactButton(event.target))return;event.preventDefault();event.stopImmediatePropagation();openPathwaySelector()},true)}
  root.StudySparkLearningCheckPathwayRoute=Object.freeze({openPathwaySelector,prepareSelector,focusSelector,BUTTON_LABEL,HEADING_LABEL});
  root.document?.readyState==='loading'?root.document.addEventListener('DOMContentLoaded',bind):bind();
})(typeof window!=='undefined'?window:globalThis);
