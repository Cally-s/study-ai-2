(function(root){
  'use strict';

  const CONTROL_SELECTOR='button,a[href],[role="button"],input[type="button"],input[type="submit"],input[type="reset"],summary';
  const ACTION_DATA=/^(auth|guest|premium|view|route|tab|close|action|open|toggle|save|edit|delete|remove|retry|submit|cancel|back|next|previous|start|continue|select|choose|download|print|copy|use|feature|firstScreen|studyPage)/i;
  const records=[];
  const pending=new WeakMap();
  const listeners=new WeakMap();
  if(root.EventTarget&&!root.EventTarget.prototype.__studySparkAuditWrapped){
    const original=root.EventTarget.prototype.addEventListener;
    Object.defineProperty(root.EventTarget.prototype,'__studySparkAuditWrapped',{value:true});
    root.EventTarget.prototype.addEventListener=function(type,listener,options){
      if(listener){const types=listeners.get(this)||new Set();types.add(type);listeners.set(this,types)}
      return original.call(this,type,listener,options);
    };
  }

  function clean(value){return String(value||'').replace(/\s+/g,' ').trim()}
  function labelFor(control){
    if(control.getAttribute('aria-label'))return clean(control.getAttribute('aria-label'));
    if(control.id){const label=[...document.querySelectorAll('label[for]')].find(item=>item.htmlFor===control.id);if(label)return clean(label.textContent)}
    return clean(control.textContent||control.value||control.title||control.getAttribute('aria-labelledby'));
  }
  function routeFor(control){
    const view=control.closest('.app-view');
    if(view)return view.id.replace(/View$/,'');
    return root.location?.hash||root.location?.pathname||'public';
  }
  function hasActionData(control){return Object.keys(control.dataset||{}).some(key=>ACTION_DATA.test(key))}
  function isFormSubmit(control){
    if(control.tagName!=='BUTTON'&&control.type!=='submit')return false;
    const type=(control.getAttribute('type')||'submit').toLowerCase();
    return Boolean(control.closest('form'))&&type==='submit';
  }
  function validAnchor(control){
    if(control.tagName!=='A')return false;
    const href=clean(control.getAttribute('href'));
    if(!href||href==='#')return hasActionData(control)||typeof control.onclick==='function';
    if(href.startsWith('#'))return Boolean(document.getElementById(href.slice(1)))||hasActionData(control);
    return true;
  }
  function hasContract(control){
    if(control.disabled||control.getAttribute('aria-disabled')==='true')return true;
    if(control.tagName==='SUMMARY')return Boolean(control.closest('details'));
    if(validAnchor(control)||isFormSubmit(control)||hasActionData(control))return true;
    if(typeof control.onclick==='function'||listeners.get(control)?.has('click')||control.getAttribute('form'))return true;
    return false;
  }
  function isReleased(control){return !control.closest('template,[data-development-only],[hidden],.hidden')}
  function accessible(control){
    if(control.tagName==='BUTTON'||control.tagName==='A'||control.tagName==='SUMMARY'||/^(button|submit|reset)$/i.test(control.type||''))return true;
    return control.getAttribute('role')!=='button'||control.tabIndex>=0;
  }
  function normalize(control){
    if(control.tagName==='BUTTON'&&!control.hasAttribute('type')&&!control.closest('form'))control.type='button';
  }
  function makeRecord(control,status,reason){
    const destination=control.dataset?.view||control.dataset?.firstScreenView||control.dataset?.canonicalRoute||control.getAttribute('href')||control.getAttribute('form')||control.id||'—';
    return {
      route:routeFor(control),controlLabel:labelFor(control)||'(unlabelled)',accessibleName:labelFor(control)||'MISSING',controlType:(control.getAttribute('role')||control.tagName).toLowerCase(),expectedAction:hasActionData(control)?'Declared route or action':isFormSubmit(control)?'Submit form':validAnchor(control)?'Navigate':'No released action declared',currentAction:hasContract(control)?'Action contract present':'No route, form, identifier, data action, or handler',destinationOrHandler:destination,permissionRequired:control.dataset?.permission||'Inherited route authorization',featureFlag:control.dataset?.featureFlag||'None declared',loadingState:control.dataset?.loadingState||'Handled by destination',successState:control.dataset?.successState||'Handled by destination',errorState:control.dataset?.errorState||'Recoverable destination state required',mobileResult:'Native responsive control',keyboardResult:accessible(control)?'Pass':'Fail',status,reason
    };
  }
  function hideUnreleased(control,reason){
    control.hidden=true;
    control.setAttribute('aria-hidden','true');
    control.dataset.releaseControlHidden='true';
    records.push(makeRecord(control,'HIDDEN_UNTIL_USABLE',reason));
  }
  function inspect(control){
    if(!control.isConnected||control.dataset.releaseAuditChecked)return;
    normalize(control);
    control.dataset.releaseAuditChecked='true';
    if(!isReleased(control))return;
    const name=labelFor(control);
    if(!name){hideUnreleased(control,'Missing an accessible name');return}
    if(!accessible(control)){hideUnreleased(control,'Custom interactive element is not keyboard reachable');return}
    if(!hasContract(control)){hideUnreleased(control,'No actionable contract is attached');return}
    records.push(makeRecord(control,'PASS','Actionable control'));
  }
  function schedule(container){
    if(!container||pending.has(container))return;
    const timer=setTimeout(()=>{pending.delete(container);if(container.matches?.(CONTROL_SELECTOR))inspect(container);container.querySelectorAll?.(CONTROL_SELECTOR).forEach(inspect)},0);
    pending.set(container,timer);
  }
  function audit(rootNode=document){schedule(rootNode);return records}
  function table(){return records.map(row=>({...row}))}
  function start(){
    audit(document);
    new MutationObserver(changes=>changes.forEach(change=>change.addedNodes.forEach(node=>{if(node.nodeType===1)schedule(node)}))).observe(document.body,{childList:true,subtree:true});
  }

  root.StudySparkInteractionAudit=Object.freeze({audit,getTable:table,hasContract,labelFor});
  if(typeof module!=='undefined'&&module.exports)module.exports={hasContract,labelFor};
  if(root.document)root.document.readyState==='loading'?root.document.addEventListener('DOMContentLoaded',start):start();
})(typeof window!=='undefined'?window:globalThis);
