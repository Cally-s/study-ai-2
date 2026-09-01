(function(root){'use strict';
const TOOLBAR_CLASS='ai-coach-language-tools',POOL_CLASS='ai-coach-language-tools__source-actions',PANEL_ID='helpUnderstandingPanel',PREF_KEY='studyspark.accessibilityToolbar.v1',HELP_PREF_KEY='studyspark.helpStepSupport.v1';
const DETAIL_LEVELS=Object.freeze([
 {id:'short',label:'Short',explanationLevel:'LEVEL_2_SIMPLE',plainMode:'BEGINNER_FRIENDLY'},
 {id:'standard',label:'Standard',explanationLevel:'LEVEL_3_STANDARD_ACADEMIC',plainMode:'PLAIN_LANGUAGE'},
 {id:'more-detail',label:'More Detail',explanationLevel:'LEVEL_4_ADVANCED',plainMode:'STEP_BY_STEP_ACADEMIC'}
]);
const LANGUAGE_OPTIONS=Object.freeze([
 {code:'en',label:'English'},
 {code:'fr-CA',label:'French'},
 {code:'zh-Hans',label:'Mandarin Chinese'},
 {code:'zh-Hant',label:'Traditional Chinese'},
 {code:'es',label:'Spanish'},
 {code:'ar',label:'Arabic'}
]);
const TOOLS=Object.freeze([
 {id:'listen',match:'tts-listen-button',quickLabel:'Listen',activeLabel:'Pause',resumeLabel:'Resume',panelLabel:'Listen',icon:'speaker',description:'Hear only this instruction read aloud.'},
 {id:'explanation-level',match:'explanation-level-button',panelLabel:'Choose Detail Level',icon:'sliders',description:'Choose Short, Standard, or More Detail.'},
 {id:'simplify',match:'plain-language-button',panelLabel:'Make It Simpler',icon:'sparkles',description:'Rewrite this step using shorter and clearer sentences while keeping important school terms.'},
 {id:'vocabulary',match:'academic-vocabulary-button',panelLabel:'Explain Key Words',icon:'book',description:'Define and translate the important academic words in this step.'},
 {id:'language-bridge',match:'language-bridge-button',panelLabel:'English + My Language',icon:'languages',description:'Show the explanation in English and your selected language.'},
 {id:'multilingual',match:'multilingual-response-button',panelLabel:'Language Settings',icon:'globe',description:'Choose language and presentation preferences.'}
]);
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function uid(){return`help-support-${Date.now()}-${Math.random().toString(36).slice(2,7)}`}
function icon(name){const common='aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"';const paths={speaker:'<path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="M16 9.5a4 4 0 0 1 0 5"/><path d="M18.5 7a8 8 0 0 1 0 10"/>',pause:'<path d="M8 5v14"/><path d="M16 5v14"/>',play:'<path d="m8 5 11 7-11 7V5Z"/>',loading:'<path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 3v5"/><path d="M17 5.5 14.5 8"/>',warning:'<path d="m12 3 9 16H3L12 3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',sparkles:'<path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z"/><path d="m5 15 .8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15Z"/><path d="m19 13 .7 1.8 1.8.7-1.8.7L19 19l-.7-1.8-1.8-.7 1.8-.7L19 13Z"/>',languages:'<path d="M4 5h9"/><path d="M9 3v2"/><path d="M7 5c.8 3.3 2.8 5.8 6 7"/><path d="M12 5c-.9 3.8-3.2 6.3-7 7"/><path d="M14 19l4-9 4 9"/><path d="M15.2 16.5h5.6"/>',sliders:'<path d="M4 7h6"/><path d="M14 7h6"/><path d="M10 7a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/><path d="M4 17h10"/><path d="M18 17h2"/><path d="M14 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/>',book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H7a3 3 0 0 0-3 3V5.5Z"/><path d="M4 19a3 3 0 0 1 3-3h13"/><path d="M8 7h8"/><path d="M8 11h6"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 0 1 4.5 1.2c0 1.7-1.8 2-2.2 3.1"/><path d="M12 17h.01"/>',arrow:'<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',close:'<path d="M6 6l12 12"/><path d="M18 6 6 18"/>'};return`<svg ${common}>${paths[name]||paths.help}</svg>`}
function supportHost(container){if(container.matches?.('.help-guide-step'))return container;if(container.matches?.('.instruction-grid article,.folder-instructions'))return container.querySelector(':scope > div:last-of-type')||container;return container}
function sourceContainer(toolbar){return toolbar.closest('.message.ai,.instruction-grid article,.help-guide-step,.analysis-card,.quiz-result,.explanation,.schedule-card,.session-summary,.vocabulary-definition,.folder-instructions')}
function directTitle(container){return container.querySelector(':scope h2,:scope h3,:scope h4,:scope b,h2,h3,h4,b')?.textContent?.trim()||'this step'}
function readJson(key){try{return JSON.parse(root.localStorage?.getItem(key)||'{}')||{}}catch{return{}}}
function writeJson(key,value){try{root.localStorage?.setItem(key,JSON.stringify(value))}catch{}}
function readPrefs(){return{...readJson(PREF_KEY),...readJson(HELP_PREF_KEY)}}
function savePrefs(patch){const existing=readJson(HELP_PREF_KEY),next={...existing,...patch,updatedAt:new Date().toISOString()};writeJson(HELP_PREF_KEY,next);const shared=readJson(PREF_KEY),merged={...shared};if(patch.detailLevel){const level=DETAIL_LEVELS.find(x=>x.id===patch.detailLevel)?.explanationLevel;if(level)merged.explanationLevel=level}if(patch.interfaceLanguage)merged.interfaceLanguage=patch.interfaceLanguage;if(patch.explanationLanguage)merged.explanationLanguage=patch.explanationLanguage;if(patch.homeLanguage){merged.homeLanguageCode=patch.homeLanguage;merged.bridgeLanguageCode=patch.homeLanguage;merged.selectedResponseLanguageCode=patch.homeLanguage;merged.defaultLanguageBridgeMode='ENGLISH_WITH_TRANSLATED_KEYWORDS'}merged.updatedAt=next.updatedAt;writeJson(PREF_KEY,merged);return next}
function languageName(code){return LANGUAGE_OPTIONS.find(x=>x.code===code)?.label||code||'English'}
function detailFromPrefs(prefs=readPrefs()){if(prefs.detailLevel)return prefs.detailLevel;return({'LEVEL_1_BEGINNER':'short','LEVEL_2_SIMPLE':'short','LEVEL_3_STANDARD_ACADEMIC':'standard','LEVEL_4_ADVANCED':'more-detail'}[prefs.explanationLevel])||'standard'}
function detailConfig(){return DETAIL_LEVELS.find(x=>x.id===detailFromPrefs())||DETAIL_LEVELS[1]}
function helpLanguage(prefs=readPrefs()){return prefs.homeLanguage||prefs.bridgeLanguageCode||prefs.selectedResponseLanguageCode||prefs.explanationLanguage||'zh-Hans'}
function speechStatus(){const state=root.TextToSpeech?.getState?.();return state?.status||'IDLE'}
function getPool(toolbar){return toolbar.querySelector(`.${POOL_CLASS}`)}
function definitionFor(control){const classes=control?.classList?[...control.classList]:[];return TOOLS.find(tool=>classes.includes(tool.match))||null}
function toolControl(toolbar,id){return getPool(toolbar)?.querySelector(`[data-language-tool-id="${id}"]`)}
function ensureToolbar(container){
 const coachActions=document.getElementById('coachLanguageActions');
 if(container.matches?.('#coachView .message.ai')&&coachActions){
  const responseListen=container.querySelector(':scope > .tts-listen-button');
  if(responseListen)container.querySelector(':scope > div')?.appendChild(responseListen);
  return coachActions;
 }
 const host=supportHost(container);
 let toolbar=container.querySelector(`.${TOOLBAR_CLASS}`);
 if(!toolbar){
  toolbar=document.createElement('section');
  const id=uid();
  toolbar.className=`${TOOLBAR_CLASS} step-support-row`;
  toolbar.dataset.languageSupportTitle=directTitle(container);
  toolbar.setAttribute('aria-labelledby',`${id}-label`);
  toolbar.innerHTML=`<span class="step-support-row__label" id="${id}-label">Need help with this step?</span><div class="step-support-row__actions" role="group" aria-labelledby="${id}-label"><button type="button" class="step-support-button step-support-button--listen" data-language-tool-proxy="listen" disabled><span class="step-support-button__icon">${icon('speaker')}</span><span>Listen</span></button><button type="button" class="step-support-button step-support-button--understand" data-language-tools-open aria-expanded="false" aria-controls="${PANEL_ID}"><span class="step-support-button__icon">${icon('help')}</span><span>Help Me Understand</span></button></div><div class="${POOL_CLASS}" hidden aria-hidden="true"></div><div class="help-understanding-result" data-help-result hidden></div><p class="sr-only" role="status" aria-live="polite" data-language-tools-live></p>`;
  host.appendChild(toolbar);
  bindToolbar(toolbar);
 }else if(toolbar.parentElement!==host||toolbar.nextElementSibling){host.appendChild(toolbar)}
 const existingListen=container.querySelector(':scope > .tts-listen-button');
 if(existingListen)placeControl(toolbar,existingListen);
 renderToolbar(toolbar);
 return toolbar;
}
function bindToolbar(toolbar){if(toolbar.dataset.languageToolsBound)return;toolbar.dataset.languageToolsBound='true';toolbar.addEventListener('click',event=>{const listen=event.target.closest('[data-language-tool-proxy="listen"]');if(listen&&toolbar.contains(listen)){event.preventDefault();activateTool(toolbar,'listen',listen);return}const opener=event.target.closest('[data-language-tools-open]');if(opener&&toolbar.contains(opener)){event.preventDefault();document.getElementById(PANEL_ID)&&document.getElementById(PANEL_ID).closest(`.${TOOLBAR_CLASS}`)===toolbar?closePanel(true,opener):openPanel(toolbar,opener)}})}
function oldCoachAdd(container,control,coachActions){
 const identity=[...control.classList].find(name=>name.endsWith('-button'));
 if(identity&&!container.querySelector(`.ai-coach-tool-marker.${identity}`)){
  const marker=document.createElement('span');
  marker.className=`ai-coach-tool-marker ${identity}`;
  marker.hidden=true;
  marker.setAttribute('aria-hidden','true');
  container.appendChild(marker);
 }
 const duplicate=identity?coachActions.querySelector(`.${identity}`):null;
 duplicate?.remove();
 coachActions.appendChild(control);
 return control;
}
function add(container,control){
 if(container.closest?.(`.${TOOLBAR_CLASS}`)){
  control.hidden=true;
  control.setAttribute('aria-hidden','true');
  control.tabIndex=-1;
  return control;
 }
 const coachActions=document.getElementById('coachLanguageActions');
 if(container.matches?.('#coachView .message.ai')&&coachActions)return oldCoachAdd(container,control,coachActions);
 const toolbar=ensureToolbar(container);
 placeControl(toolbar,control);
 return control;
}
function placeControl(toolbar,control){
 const tool=definitionFor(control),pool=getPool(toolbar);
 if(!pool)return control;
 if(tool){
  const duplicate=pool.querySelector(`[data-language-tool-id="${tool.id}"]`);
  if(duplicate&&duplicate!==control)duplicate.remove();
  control.dataset.languageToolId=tool.id;
 }
 control.hidden=true;
 control.setAttribute('aria-hidden','true');
 control.tabIndex=-1;
 enhanceFocus(control,toolbar);
 pool.appendChild(control);
 renderToolbar(toolbar);
 return control;
}
function enhanceFocus(control,toolbar){if(control.__studySparkOriginalFocus)return;control.__studySparkOriginalFocus=control.focus.bind(control);control.focus=function(){const target=this.__studySparkReturnFocusTarget;if(target?.isConnected&&!target.hidden){target.focus();return}const fallback=toolbar.querySelector('[data-language-tools-open]');if(fallback){fallback.focus();return}this.__studySparkOriginalFocus()}}
function listenIconName(){const state=speechStatus();if(state==='PLAYING')return'pause';if(state==='PAUSED')return'play';if(state==='PREPARING'||state==='READY')return'loading';if(state==='ERROR')return'warning';return'speaker'}
function quickLabel(tool){if(tool.id==='listen'){const state=speechStatus();if(state==='PREPARING'||state==='READY')return'Preparing Audio';if(state==='PLAYING')return tool.activeLabel;if(state==='PAUSED')return tool.resumeLabel;if(state==='ERROR')return'Audio Unavailable'}return tool.quickLabel||tool.panelLabel}
function renderToolbar(toolbar){
 const title=toolbar.dataset.languageSupportTitle||'this step';
 const listenButton=toolbar.querySelector('[data-language-tool-proxy="listen"]'),listenTool=TOOLS.find(x=>x.id==='listen'),listenControl=toolControl(toolbar,'listen');
 if(listenButton&&listenTool){
  const label=quickLabel(listenTool);
  listenButton.disabled=!listenControl;
  listenButton.setAttribute('aria-label',`${label} to ${title}`);
  listenButton.innerHTML=`<span class="step-support-button__icon">${icon(listenIconName())}</span><span>${esc(label)}</span>`;
 }
 const opener=toolbar.querySelector('[data-language-tools-open]');
 if(opener){
  const open=document.getElementById(PANEL_ID)?.closest(`.${TOOLBAR_CLASS}`)===toolbar;
  opener.setAttribute('aria-expanded',String(open));
  opener.setAttribute('aria-label',`Help me understand ${title}`);
 }
}
function refreshAllToolbars(){document.querySelectorAll(`.${TOOLBAR_CLASS}`).forEach(renderToolbar)}
function setLive(toolbar,message){const live=toolbar.querySelector('[data-language-tools-live]');if(live)live.textContent=message}
function activateTool(toolbar,id,trigger){
 const control=toolControl(toolbar,id);
 if(!control){setLive(toolbar,`${TOOLS.find(x=>x.id===id)?.panelLabel||'Tool'} is unavailable for this step.`);return false}
 if(id==='listen'){
  const state=speechStatus();
  if(state==='PLAYING'){root.TextToSpeech?.pauseTextToSpeech?.();setLive(toolbar,'Reading paused.');setTimeout(refreshAllToolbars,80);return true}
  if(state==='PAUSED'){root.TextToSpeech?.resumeTextToSpeech?.();setLive(toolbar,'Reading resumed.');setTimeout(refreshAllToolbars,80);return true}
 }
 control.__studySparkReturnFocusTarget=trigger;
 setLive(toolbar,`${trigger.textContent.trim()} selected.`);
 control.click();
 setTimeout(refreshAllToolbars,120);
 setTimeout(refreshAllToolbars,700);
 return true;
}
function sourceFor(toolbar){const el=sourceContainer(toolbar);if(!el||!root.PlainLanguage?.createExplanationSourceFromElement)throw Error('This step is not available for adaptation.');return root.PlainLanguage.createExplanationSourceFromElement(el)}
function blocksHtml(blocks){return blocks?.[0]?.type==='STEP'?`<ol>${blocks.map(b=>`<li>${esc(b.text)}</li>`).join('')}</ol>`:blocks.map(b=>`<p>${esc(b.text)}</p>`).join('')}
function listenToText(toolbar,title,text,trigger){const d=root.TextToSpeech?.createSpeechDocument?.({sourceType:'HELP_ARTICLE',sourceId:`help-result-${Date.now()}`,sourceVersion:'1',title,defaultLanguageCode:'en',blocks:[{id:'help-result-speech',blockType:'PARAGRAPH',visibleText:text}],authorized:true});if(d){root.TextToSpeech.startTextToSpeech(d,toolbar);trigger?.focus?.();setLive(toolbar,'Reading this support result.')}else setLive(toolbar,'Audio is not available for this support result.')}
function showResult(toolbar,{status,title,body,meta='',actions=[]}){
 const result=toolbar.querySelector('[data-help-result]');
 if(!result)return;
 result.hidden=false;
 result.innerHTML=`<div class="help-result-status"><span>${esc(status)}</span><button type="button" data-help-change>Change</button></div><article class="help-result-card" aria-live="polite"><h4>${esc(title)}</h4>${body}${meta?`<p class="help-result-meta">${esc(meta)}</p>`:''}<div class="help-result-actions"><button type="button" data-help-original>Use Original</button><button type="button" data-help-listen-result>Listen</button>${actions.map(action=>`<button type="button" data-help-action="${esc(action.id)}">${esc(action.label)}</button>`).join('')}</div></article>`;
 result.querySelector('[data-help-original]').onclick=()=>{result.hidden=true;result.innerHTML='';setLive(toolbar,'Original instruction is still shown above.')};
 result.querySelector('[data-help-change]').onclick=event=>openPanel(toolbar,event.currentTarget);
 result.querySelector('[data-help-listen-result]').onclick=event=>listenToText(toolbar,title,result.querySelector('.help-result-card')?.innerText||'',event.currentTarget);
 result.querySelectorAll('[data-help-action]').forEach(button=>button.onclick=()=>{const action=actions.find(x=>x.id===button.dataset.helpAction);action?.handler?.(button)});
 setLive(toolbar,status);
}
function showError(toolbar,message){showResult(toolbar,{status:'Support unavailable',title:'This support is not available right now',body:`<p>${esc(message)} The original instruction remains visible.</p>`})}
function renderSimpler(toolbar){
 try{
  const detail=detailConfig(),view=root.PlainLanguage.generatePlainLanguageExplanation(sourceFor(toolbar),{mode:detail.plainMode});
  if(view.status!=='READY')throw Error('The simpler version could not be validated.');
  showResult(toolbar,{status:`Simplified · ${detail.label} detail`,title:'Simpler explanation',body:blocksHtml(view.structuredOutput.blocks),meta:'Important academic terms and required details were preserved where the source provided them.',actions:[{id:'language',label:'Show English + My Language',handler:()=>renderLanguage(toolbar)}]});
 }catch(error){showError(toolbar,error?.message||'Could not make this step simpler.')}
}
function renderLanguage(toolbar){
 try{
  const detail=detailConfig(),code=helpLanguage(),source=sourceFor(toolbar),view=root.LanguageBridge?.requestLanguageBridgeExplanation?.(source,{languageBridgeMode:'ENGLISH_WITH_TRANSLATED_KEYWORDS',bridgeLanguageCode:code,explanationLevel:detail.explanationLevel});
  if(!view)throw Error('Language support is not available.');
  const glossary=view.glossary?.filter(term=>term.bridgeTerm);
  const body=`<section lang="en" dir="ltr"><h5>English</h5><p>${esc(view.englishText)}</p></section>${glossary?.length?`<dl class="help-result-glossary">${glossary.map(term=>`<div><dt>${esc(term.englishTerm)}</dt><dd lang="${esc(code)}">${esc(term.bridgeTerm)}</dd><dd>${esc(term.englishDefinition)}</dd></div>`).join('')}</dl>`:'<p>No approved translated key words were found for this step yet. The original English remains visible.</p>'}`;
  showResult(toolbar,{status:`English + ${languageName(code)}`,title:'English + My Language',body,meta:'StudySpark keeps the English school terms visible and does not claim a certified translation.'});
 }catch(error){showError(toolbar,error?.message||'Could not open language support for this step.')}
}
function renderVocabulary(toolbar){
 try{
  const source=sourceFor(toolbar),registry=root.AcademicVocabulary?.ACADEMIC_VOCABULARY_REGISTRY||[],haystack=`${source.title||''} ${source.text||''}`.toLowerCase(),terms=registry.filter(term=>haystack.includes(String(term.term).toLowerCase())).slice(0,5);
  const body=terms.length?`<dl class="help-result-glossary">${terms.map(term=>{const sense=term.senses?.[0]||{};return`<div><dt>${esc(term.term)}</dt><dd>${esc(sense.plainDefinition||'Use the original instruction for the full academic meaning.')}</dd>${sense.example?`<dd>Example: ${esc(sense.example)}</dd>`:''}</div>`}).join('')}</dl>`:'<p>No approved key words were automatically found for this step yet. You can select a word in the instruction and open the word lookup.</p>';
  showResult(toolbar,{status:terms.length?`${terms.length} key words explained`:'No key words found yet',title:'Explain Key Words',body,actions:[{id:'lookup',label:'Open Word Lookup',handler:button=>activateTool(toolbar,'vocabulary',button)}]});
 }catch(error){showError(toolbar,error?.message||'Could not check key words for this step.')}
}
function optionCard(toolId,title,description){
 const tool=TOOLS.find(x=>x.id===toolId),available=toolId==='simplify'?Boolean(root.PlainLanguage):toolId==='language-bridge'?Boolean(root.LanguageBridge):toolId==='vocabulary'?Boolean(root.AcademicVocabulary):true;
 return`<button type="button" class="help-option-card help-option-card--${esc(toolId)}" data-help-option="${esc(toolId)}" ${available?'':'disabled aria-disabled="true"'}><span class="help-option-card__icon">${icon(tool?.icon||'help')}</span><strong>${esc(title)}</strong><span>${esc(description)}</span><span class="help-option-card__action">${available?'Select':'Unavailable'} ${available?icon('arrow'):''}</span></button>`
}
function settingsMarkup(){
 const prefs=readPrefs(),detail=detailFromPrefs(prefs),iface=prefs.interfaceLanguage||'en',explain=prefs.explanationLanguage||'en',home=helpLanguage(prefs),languageOptions=selected=>LANGUAGE_OPTIONS.map(lang=>`<option value="${esc(lang.code)}" ${lang.code===selected?'selected':''}>${esc(lang.label)}</option>`).join('');
 return`<details class="help-more-settings"><summary>More Settings</summary><div class="help-more-settings__grid"><fieldset><legend>Detail Level</legend>${DETAIL_LEVELS.map(row=>`<label><input type="radio" name="help-detail-level" value="${esc(row.id)}" ${row.id===detail?'checked':''}> ${esc(row.label)}</label>`).join('')}</fieldset><fieldset><legend>Language</legend><label>Interface language<select name="help-interface-language">${languageOptions(iface)}</select></label><label>Explanation language<select name="help-explanation-language">${languageOptions(explain)}</select></label><label>Home language<select name="help-home-language">${languageOptions(home)}</select></label></fieldset><fieldset><legend>Apply Setting</legend><label><input type="radio" name="help-apply-scope" value="step" checked> This step only</label><label><input type="radio" name="help-apply-scope" value="all"> All Help steps</label></fieldset></div><div class="help-more-settings__actions"><button type="button" class="languagePanelButton languagePanelButton--primary" data-panel-apply-step>Apply to This Step</button><button type="button" class="languagePanelButton languagePanelButton--secondary" data-panel-apply-all>Apply to All Steps</button></div></details>`
}
function panelMarkup(){return`<div class="help-understanding-panel__header"><div><h3 id="helpUnderstandingTitle" tabindex="-1">Help Me Understand This Step</h3><p id="helpUnderstandingDescription">Choose one way to make this instruction easier to use.</p></div><button type="button" class="help-understanding-panel__close" data-panel-close aria-label="Close Help Me Understand panel">${icon('close')}</button></div><div class="help-understanding-options" role="list" aria-label="Ways to understand this step">${optionCard('simplify','MAKE IT SIMPLER','Rewrite this step using shorter and clearer sentences while keeping important school terms.')}${optionCard('language-bridge','ENGLISH + MY LANGUAGE','Show the explanation in English and your selected language.')}${optionCard('vocabulary','EXPLAIN KEY WORDS','Define and translate the important academic words in this step.')}</div>${settingsMarkup()}<p class="language-tools-panel__status" role="status" aria-live="polite" data-panel-status></p>`}
function openPanel(toolbar,trigger){
 closePanel(false);
 const panel=document.createElement('section');
 panel.id=PANEL_ID;
 panel.className='help-understanding-panel';
 panel.setAttribute('aria-labelledby','helpUnderstandingTitle');
 panel.setAttribute('aria-describedby','helpUnderstandingDescription');
 panel.innerHTML=panelMarkup();
 toolbar.insertBefore(panel,toolbar.querySelector('[data-help-result]'));
 toolbar.querySelectorAll('[data-language-tools-open]').forEach(button=>button.setAttribute('aria-expanded','true'));
 bindPanel(panel,toolbar,trigger);
 panel.querySelector('#helpUnderstandingTitle')?.focus();
 setLive(toolbar,'Help Me Understand panel opened.');
}
function settingsFromPanel(panel){return{detailLevel:panel.querySelector('[name="help-detail-level"]:checked')?.value||'standard',interfaceLanguage:panel.querySelector('[name="help-interface-language"]')?.value||'en',explanationLanguage:panel.querySelector('[name="help-explanation-language"]')?.value||'en',homeLanguage:panel.querySelector('[name="help-home-language"]')?.value||'zh-Hans',applyScope:panel.querySelector('[name="help-apply-scope"]:checked')?.value||'step'}}
function applySettings(panel,toolbar,all=false){const prefs=settingsFromPanel(panel),scope=all?'all':prefs.applyScope;savePrefs({...prefs,applyScope:scope});if(scope==='all')writeJson('studyspark.languageTools.applyAll',{enabled:true,updatedAt:new Date().toISOString()});const detail=DETAIL_LEVELS.find(x=>x.id===prefs.detailLevel)?.label||'Standard';showResult(toolbar,{status:`${detail} detail · ${languageName(prefs.homeLanguage)}`,title:'Settings saved',body:`<p>These Help settings are ready for ${scope==='all'?'all Help steps':'this step'}.</p>`});closePanel(false)}
function bindPanel(panel,toolbar,trigger){
 panel.addEventListener('click',event=>{
  const option=event.target.closest('[data-help-option]');
  if(option&&panel.contains(option)){event.preventDefault();if(option.disabled)return;const status=panel.querySelector('[data-panel-status]');if(status)status.textContent=`${option.querySelector('strong')?.textContent||'Support'} selected.`;if(option.dataset.helpOption==='simplify')renderSimpler(toolbar);if(option.dataset.helpOption==='language-bridge')renderLanguage(toolbar);if(option.dataset.helpOption==='vocabulary')renderVocabulary(toolbar);closePanel(false);return}
  if(event.target.closest('[data-panel-close]')){event.preventDefault();closePanel(true,trigger);return}
  if(event.target.closest('[data-panel-apply-step]')){event.preventDefault();applySettings(panel,toolbar,false);return}
  if(event.target.closest('[data-panel-apply-all]')){event.preventDefault();applySettings(panel,toolbar,true)}
 });
 panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();closePanel(true,trigger)}})
}
function closePanel(returnFocus=true,trigger=null){const panel=document.getElementById(PANEL_ID);if(!panel)return;panel.remove();document.querySelectorAll('[data-language-tools-open]').forEach(button=>button.setAttribute('aria-expanded','false'));if(returnFocus)trigger?.focus?.();refreshAllToolbars()}
const api={ensureToolbar,add,openPanel,closePanel,TOOLBAR_CLASS,TOOLS,DETAIL_LEVELS,_test:{definitionFor,languageName,detailFromPrefs,helpLanguage,icon,renderSimpler,renderLanguage,renderVocabulary}};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.AICoachLanguageTools=api;
})(typeof window!=='undefined'?window:globalThis);
