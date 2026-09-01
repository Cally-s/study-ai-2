(function(){
  'use strict';

  const SEARCH_DEBOUNCE_MS=180;
  const RECENT_SEARCH_LIMIT=8;
  const GLOBAL_SEARCH_RECENT_KEY_PREFIX='studyspark.globalSearch.recent.v1';
  const SEARCH_RESULT_GROUP_ORDER=['Suggested','Recent Searches','Pages and Tools','Your Assignments','Your Notes','Your Flashcards','Your Projects','Study Together','Recent Work','Help Guides'];
  const SUGGESTED_FEATURE_IDS=Object.freeze(['ai-coach','assignments','flashcards','notes','study-together','help-me-catch-up','projects','progress']);
  const ACCOUNT_REQUIRED_VIEWS=new Set(['friends','friendsList','friendProfile','friendRequests','studyMatch','studyPartnerResults','studyPartnerProfile','studyRequests','studyRooms','studyRoomLobby','studyRoomDeviceTest','studyGroups','studyGroupCreate','studyGroupDetail','peerTutoring','studentOnboarding','tutorApplication','tutorVerification','tutoringRequests','tutorRecommendations','bookingSessions','preSessionCoach','sessionAttendance','postSessionLearning','communityService','helpCredits','serviceDocuments','communityImpact']);
  const FEATURE_ALIASES=Object.freeze({
    'ai-coach':'coach chatbot tutor study help explanation ask question artificial intelligence AI A I',
    learn:'ai literacy lab pathway pathways modules lessons course learning check current topic understand apply create artificial intelligence AI A I',
    assignments:'homework task tasks due due dates planner study plan study plans saved plans recovery catch up behind late assignment',
    flashcards:'cards study cards memorize memorise review deck decks active recall recall card cards',
    notes:'write notes notebook class notes study notes upload files saved notes knowledge base',
    'study-together':'study buddy partner find classmate study with someone friends requests connections group study live room study session collaboration',
    'find-study-partner':'study buddy partner find classmate study with someone classmates match matching compatible',
    'friends-study-partners':'friends requests connections classmates student id search connections',
    'my-friends':'friends requests connections accepted people classmates presence',
    'study-rooms':'group study live room study session rooms video audio shared notes captions',
    'study-groups':'group study study session team collaboration members plan',
    'help-me-catch-up':'catch up behind missing work overwhelmed late assignments recovery rescue plan academic recovery',
    'verify-answer':'check answer fact check is this correct verify response calculation citation claims supported',
    'source-comparison':'compare websites compare articles compare sources source comparison reliability research evidence bias',
    'claim-evidence-map':'claims evidence argument map reasoning assumptions limitations claim evidence map',
    'ai-use-receipts':'AI disclosure ai disclosure A I disclosure how i used ai receipt receipts artificial intelligence disclosure student contribution verification',
    'prompt-coach':'prompt builder improve prompt prompt templates learning mode privacy check integrity check do not give final answer',
    'problem-scope':'project planning define problem community need problem scoping scope users context',
    'system-card':'system documentation limitations intended users system card oversight risks ai system',
    'project-architecture':'workflow system diagram components data flow architecture design technical plan',
    'data-responsibility':'privacy data collection retention consent minimization fairness handling responsibility',
    projects:'community ai project project hub problem scope system card architecture data responsibility prototype testing impact reflection artificial intelligence',
    progress:'progress tracker competency reports teacher feedback learning profile exam readiness predictions recent activity',
    'competency-progress':'competency progress ai literacy understand apply create standards mastered developing needs review',
    'competency-portfolio':'portfolio evidence reflection teacher verified skills competency import export report',
    notifications:'notifications bell updates reminders unread settings',
    settings:'settings account profile courses privacy language notifications display accessibility',
    'accessibility-language':'accessibility language dyslexia high contrast text size reading level multilingual bilingual low bandwidth',
    help:'help centre guide support instructions faq safety learn how'
  });
  const EXTRA_FEATURES=Object.freeze([
    {id:'home',view:'dashboard',category:'Pages and Tools',title:'Home',description:'Return to your main StudySpark launch hub.',keywords:'dashboard start home today continue learning',iconName:'sparkles',actionLabel:'Open Home'},
    {id:'study-plans',view:'savedPlans',category:'Assignments',title:'Study Plans',description:'Open, continue, or review saved study plans.',keywords:'planner study plan saved plans schedule assignments',iconName:'calendar-days',actionLabel:'Open Study Plans'},
    {id:'friend-requests',view:'friendRequests',category:'Collaboration and Support',title:'Friend Requests',description:'Review incoming and sent study connection requests.',keywords:'friends requests connections invites invitations classmates',iconName:'user-round-plus',actionLabel:'Open Requests'},
    {id:'prototype-testing',view:'communityAIProject',category:'Projects',title:'Prototype Testing',description:'Open Projects and choose testing tasks for your current community AI project.',keywords:'prototype testing test usability feedback project',iconName:'badge-question',actionLabel:'Open Projects'},
    {id:'fairness-accessibility-review',view:'communityAIProject',category:'Projects',title:'Fairness and Accessibility Review',description:'Open Projects and review fairness, accessibility, and inclusion for your AI project.',keywords:'fairness accessibility review bias inclusive project',iconName:'shield-check',actionLabel:'Open Projects'},
    {id:'impact-reflection',view:'communityAIProject',category:'Projects',title:'Impact Reflection',description:'Open Projects and reflect on community impact, risks, and next improvements.',keywords:'impact reflection community effects ethics project',iconName:'globe',actionLabel:'Open Projects'},
    {id:'reports',view:'progress',category:'Progress',title:'Reports',description:'Review learning summaries and progress evidence from the Progress workspace.',keywords:'reports progress summary learning teacher parent',iconName:'file-text',actionLabel:'Open Progress'},
    {id:'teacher-feedback',view:'progress',category:'Progress',title:'Teacher Feedback',description:'Find progress feedback, review notes, and correction workflows when available.',keywords:'teacher feedback review comments correction progress',iconName:'messages-square',actionLabel:'Open Progress'},
    {id:'help-guides',view:'instructions',category:'Support',title:'Help Guides',description:'Open StudySpark help guides and feature instructions.',keywords:'help guide support instructions how to faq',iconName:'circle-help',actionLabel:'Open Help'}
  ]);

  const state={
    bound:false,
    pageBound:false,
    open:false,
    query:'',
    activeIndex:0,
    results:[],
    resultMap:new Map(),
    previousFocus:null,
    debounceId:null,
    focusReturnTimer:null,
    suppressFocusOpen:false,
    searching:false,
    userError:null
  };

  function byId(id){return document.getElementById(id)}
  function all(selector,root=document){return Array.from(root.querySelectorAll(selector))}
  function html(value){if(typeof escapeHTML==='function')return escapeHTML(value);return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
  function currentUser(){try{return typeof user==='function'?user():null}catch{return null}}
  function guestMode(){try{return typeof isGuestMode==='function'&&isGuestMode()}catch{return false}}
  function routeForView(view){try{return typeof studySparkCanonicalRoutes!=='undefined'?(studySparkCanonicalRoutes[view]||''):''}catch{return''}}
  function viewLabel(view){try{return typeof viewNames!=='undefined'?viewNames[view]:null}catch{return null}}
  function requirementForView(view){try{return (window.PageContentRequirement||{})[view]||null}catch{return null}}
  function canOpenView(view){const requirement=requirementForView(view);return Boolean(view&&viewLabel(view)&&routeForView(view)&&requirement?.minimumContentReady!==false)}
  function routeHref(route){if(!route)return'#';try{return typeof shouldUseHashViewRoutes==='function'&&shouldUseHashViewRoutes()?`#${route}`:route}catch{return route}}
  function viewHref(view){return routeHref(routeForView(view))}
  function iconSVG(name){try{return typeof homeIconSVG==='function'?homeIconSVG(name||'sparkles'):''}catch{return''}}
  function featureIconName(feature){try{if(feature.iconName)return feature.iconName;return typeof homeFeatureIconName==='function'?homeFeatureIconName(feature):'sparkles'}catch{return feature.iconName||'sparkles'}}
  function normalize(value){return String(value??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/\ba\s+i\b/gi,'ai').replace(/\bartificial\s+inteligence\b/gi,'artificial intelligence').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
  function tokens(query){return normalize(query).split(/\s+/).filter(Boolean)}
  function sentence(value,fallback='Open this StudySpark feature.'){const text=String(value||fallback).trim();return text.length>180?`${text.slice(0,177)}…`:text}
  function dateValue(value){const date=new Date(value||0);return Number.isNaN(date.getTime())?0:date.getTime()}
  function relative(value){try{return typeof homeRelativeTime==='function'?homeRelativeTime(value,'Recently updated'):new Date(value).toLocaleDateString()}catch{return'Recently updated'}}
  function dueLabel(value){try{return typeof homeDueInfo==='function'?homeDueInfo(value).label:''}catch{return''}}
  function selectedCoursesSafe(){try{return typeof selectedCourses==='function'?selectedCourses():currentUser()?.courses||[]}catch{return currentUser()?.courses||[]}}
  function searchText(record){return normalize([record.title,record.description,record.category,record.group,record.meta,record.keywords,record.permission].filter(Boolean).join(' '))}
  function editDistanceWithinOne(a,b){if(Math.abs(a.length-b.length)>1)return false;let edits=0,i=0,j=0;while(i<a.length&&j<b.length){if(a[i]===b[j]){i++;j++;continue}edits++;if(edits>1)return false;if(a.length>b.length)i++;else if(a.length<b.length)j++;else{i++;j++}}return edits+(a.length-i)+(b.length-j)<=1}
  function fuzzyTokenMatch(haystack,token){if(token.length<4)return false;return haystack.split(' ').some(word=>word.length>=3&&(word.startsWith(token.slice(0,3))||editDistanceWithinOne(word,token)))}
  function resultScore(record,query){const q=normalize(query),parts=tokens(query);if(!q)return record.suggested?50:0;const title=normalize(record.title),keywords=normalize(record.keywords),description=normalize(record.description),haystack=searchText(record);let score=0;if(title===q)score+=1400;else if(title.startsWith(q))score+=1150;else if(title.includes(q))score+=900;if(keywords.includes(q))score+=650;if(haystack.includes(q))score+=300;for(const token of parts){if(title.split(' ').some(word=>word===token))score+=210;else if(title.split(' ').some(word=>word.startsWith(token)))score+=170;else if(title.includes(token))score+=130;if(keywords.includes(token))score+=115;if(description.includes(token))score+=70;if(fuzzyTokenMatch(haystack,token))score+=35}if(record.recent)score+=60;if(record.updatedAt)score+=Math.max(0,30-Math.floor((Date.now()-dateValue(record.updatedAt))/86400000));return score}
  function groupForFeature(feature){if(feature.group)return feature.group;if(feature.category==='Collaboration and Support')return'Study Together';if(feature.category==='Support'&&/help|guide|safety|privacy/i.test(`${feature.id} ${feature.title}`))return'Help Guides';return'Pages and Tools'}
  function featureStatus(feature){if(feature.requiresAccount&&guestMode())return'Account needed';const requirement=requirementForView(feature.view);if(requirement?.requiredServerOperation)return'Saves private work';return'Available'}
  function featureRecords(){let registry=[];try{registry=Array.isArray(STUDYSPARK_FEATURE_REGISTRY)?STUDYSPARK_FEATURE_REGISTRY:[]}catch{registry=[]}const rows=[...EXTRA_FEATURES,...registry].filter(feature=>canOpenView(feature.view)).map(feature=>{const aliases=FEATURE_ALIASES[feature.id]||FEATURE_ALIASES[feature.view]||'';const requiresAccount=ACCOUNT_REQUIRED_VIEWS.has(feature.view);return {
      id:`feature:${feature.id}`,
      type:'feature',
      group:groupForFeature(feature),
      title:feature.title,
      description:sentence(feature.description),
      category:feature.category||viewLabel(feature.view)?.[0]||'Pages and Tools',
      keywords:[feature.keywords,aliases,feature.title,feature.category].filter(Boolean).join(' '),
      iconName:featureIconName(feature),
      view:feature.view,
      route:routeForView(feature.view),
      actionLabel:requiresAccount&&guestMode()?'Create Account':'Open',
      permission:requiresAccount?'Requires a StudySpark account':'Available to this account',
      requiresAccount,
      status:featureStatus({...feature,requiresAccount}),
      suggested:SUGGESTED_FEATURE_IDS.includes(feature.id)
    }});const seen=new Set();return rows.filter(row=>{const key=`${row.view}:${normalize(row.title)}`;if(seen.has(key))return false;seen.add(key);return true})}
  function safeRows(label,fn){try{return fn()||[]}catch(error){console.warn(`${label} search failed:`,error);state.userError='StudySpark tools are available, but your saved-work results could not be loaded.';return[]}}
  function noteRecords(){return safeRows('Notes',()=>{const u=currentUser();return (u?.notes||[]).map(note=>({
    id:`note:${note.id}`,
    type:'note',
    group:'Your Notes',
    title:note.title||'Untitled note',
    description:`Note · ${note.subject||'Study notes'}`,
    meta:`Edited ${note.lastEdited||note.created||'recently'}`,
    category:'Notes',
    keywords:[note.title,note.text,note.subject,typeof displayFolderName==='function'?displayFolderName(note.folderId):''].join(' '),
    iconName:'notebook-pen',
    view:'noteDetail',
    route:routeForView('noteDetail')||routeForView('notes'),
    recordId:note.id,
    actionLabel:'Open Note',
    updatedAt:note.lastEdited||note.created
  }))})}
  function fileRecords(){return safeRows('Uploaded files',()=>{const u=currentUser();return (u?.files||[]).map(file=>({
    id:`file:${file.id||file.name}`,
    type:'note',
    group:'Your Notes',
    title:file.title||file.name||'Uploaded file',
    description:`Uploaded file · ${file.subject||file.course||'Study file'}`,
    meta:file.created?`Saved ${file.created}`:'Saved file',
    category:'Notes',
    keywords:[file.title,file.name,file.subject,file.text,file.summary].join(' '),
    iconName:'file-text',
    view:'notes',
    route:routeForView('notes'),
    actionLabel:'Open Notes',
    updatedAt:file.updatedAt||file.created
  }))})}
  function flashcardRecords(){return safeRows('Flashcards',()=>{const u=currentUser(),cards=u?.flashcards||[],groups=new Map();for(const card of cards){const key=`${card.subject||'Study'}:${card.topic||card.question||'Flashcards'}`;const row=groups.get(key)||{count:0,cards:[],subject:card.subject||'Study',topic:card.topic||'Flashcards',updatedAt:card.updatedAt||card.created||''};row.count++;row.cards.push(card);row.updatedAt=card.updatedAt||card.created||row.updatedAt;groups.set(key,row)}return Array.from(groups.values()).map(row=>({
    id:`flashcards:${row.subject}:${row.topic}`,
    type:'flashcard',
    group:'Your Flashcards',
    title:`${row.topic} Flashcards`,
    description:`Flashcard deck · ${row.subject}`,
    meta:`${row.count} card${row.count===1?'':'s'}`,
    category:'Flashcards',
    keywords:[row.subject,row.topic,row.cards.map(card=>`${card.question} ${card.answer}`).join(' ')].join(' '),
    iconName:'layers',
    view:'flashcards',
    route:routeForView('flashcards'),
    actionLabel:'Open Flashcards',
    updatedAt:row.updatedAt
  }))})}
  function planRecords(){return safeRows('Assignments and study plans',()=>{const u=currentUser();return (u?.plans||[]).map(plan=>({
    id:`plan:${plan.id}`,
    type:'assignment',
    group:'Your Assignments',
    title:plan.title||`${plan.course||'Study'} Plan`,
    description:`Study plan · ${plan.course||'Assignments'}`,
    meta:[dueLabel(plan.testDate||plan.dueDate),plan.status].filter(Boolean).join(' · ')||'Saved study plan',
    category:'Assignments',
    keywords:[plan.title,plan.course,plan.topic,plan.testName,plan.days?.map?.(day=>`${day.mainTopic} ${day.taskType}`).join(' ')].join(' '),
    iconName:'calendar-days',
    view:'planDetail',
    route:routeForView('planDetail')||routeForView('savedPlans'),
    recordId:plan.id,
    actionLabel:'Open Plan',
    dueAt:plan.testDate||plan.dueDate,
    updatedAt:plan.updatedAt||plan.createdAt||plan.created
  }))})}
  function learningCheckRecords(){return safeRows('Learning checks',()=>{const results=typeof homeLearningCheckResults==='function'?homeLearningCheckResults():window.StudySparkLearningCheckResults?.listMine?.()||[],attempts=window.StudySparkLearningCheckAttempt?.listMine?.()||[];return [...results.map(result=>({
    id:`learning-check-result:${result.id}`,
    type:'progress',
    group:'Recent Work',
    title:`${result.topic||result.configuration?.topic||'Learning Check'} Results`,
    description:`Learning Check · ${result.subject||result.configuration?.subject||'StudySpark'}`,
    meta:[result.scoreLabel,result.confidenceLabel,result.submittedAt?relative(result.submittedAt):'Results ready'].filter(Boolean).join(' · '),
    category:'Progress',
    keywords:JSON.stringify(result),
    iconName:'circle-check',
    view:'aiDiagnostic',
    route:routeForView('aiDiagnostic'),
    actionLabel:'Open Learning Check',
    updatedAt:result.submittedAt||result.createdAt
  })),...attempts.filter(row=>/draft|progress|started|setup/i.test(row.status||'')).map(row=>({
    id:`learning-check-attempt:${row.id}`,
    type:'progress',
    group:'Recent Work',
    title:`${row.topic||row.configuration?.topic||'Learning Check'} in Progress`,
    description:`Learning Check · ${row.subject||row.configuration?.subject||'StudySpark'}`,
    meta:'Check in progress',
    category:'Progress',
    keywords:JSON.stringify(row),
    iconName:'circle-check',
    view:'aiDiagnostic',
    route:routeForView('aiDiagnostic'),
    actionLabel:'Continue Check',
    updatedAt:row.updatedAt||row.startedAt||row.createdAt
  }))]})}
  function projectRecords(){return safeRows('Projects',()=>{const source=window.CommunityAIProjectPathway?._test?.projects;if(!source||typeof source.values!=='function')return[];let currentId='';try{currentId=localStorage.getItem(SESSION_KEY)||GUEST_SESSION||''}catch{}return Array.from(source.values()).filter(project=>!project.archivedAt&&(!project.subjectUserId||project.subjectUserId===currentId)).map(project=>({
    id:`project:${project.id}`,
    type:'project',
    group:'Your Projects',
    title:project.title||project.projectName||'Community AI Project',
    description:`Project · ${project.status||'In progress'}`,
    meta:project.updatedAt?`Updated ${relative(project.updatedAt)}`:'Community AI Project',
    category:'Projects',
    keywords:JSON.stringify(project),
    iconName:'blocks',
    view:'communityAIProject',
    route:routeForView('communityAIProject'),
    recordId:project.id,
    actionLabel:'Open Project',
    updatedAt:project.updatedAt||project.createdAt
  }))})}
  function collaborationRecords(){return safeRows('Study Together',()=>{if(guestMode())return[];const requests=typeof currentUserStudyRequests==='function'?currentUserStudyRequests():[],groups=typeof visibleStudyGroups==='function'?visibleStudyGroups():[],rooms=typeof loadStudyRooms==='function'?loadStudyRooms():[];return [
    ...requests.map(request=>({
      id:`study-request:${request.requestId||request.id}`,
      type:'study-together',
      group:'Study Together',
      title:request.partnerName?`Study request with ${request.partnerName}`:'Study Request',
      description:`${request.course||request.subject||'Study request'} · ${request.status||'Pending'}`,
      meta:request.sentAt?`Sent ${relative(request.sentAt)}`:'Saved request',
      category:'Study Together',
      keywords:JSON.stringify(request),
      iconName:'clipboard-list',
      view:'studyRequests',
      route:routeForView('studyRequests'),
      actionLabel:'Open Requests',
      updatedAt:request.updatedAt||request.sentAt
    })),
    ...groups.map(group=>({
      id:`study-group:${group.id}`,
      type:'study-together',
      group:'Study Together',
      title:group.name||'Study Group',
      description:`Study group · ${group.course||group.subject||group.status||'Active'}`,
      meta:group.meeting?.date?dueLabel(group.meeting.date):`${group.members?.length||0} members`,
      category:'Study Together',
      keywords:JSON.stringify(group),
      iconName:'users-round',
      view:'studyGroupDetail',
      route:routeForView('studyGroupDetail')||routeForView('studyGroups'),
      recordId:group.id,
      actionLabel:'Open Group',
      updatedAt:group.updatedAt||group.createdAt||group.meeting?.date
    })),
    ...rooms.filter(room=>!room.privateRoom||room.participantIds?.includes?.(currentUser()?.id)).map(room=>({
      id:`study-room:${room.roomId||room.id}`,
      type:'study-together',
      group:'Study Together',
      title:room.title||room.topic||'Study Room',
      description:`Study room · ${room.course||room.subject||room.status||'Scheduled'}`,
      meta:room.startAt?dueLabel(room.startAt):room.status||'Study room',
      category:'Study Together',
      keywords:JSON.stringify(room),
      iconName:'door-open',
      view:'studyRooms',
      route:routeForView('studyRooms'),
      recordId:room.roomId||room.id,
      actionLabel:'Open Rooms',
      updatedAt:room.updatedAt||room.startAt||room.createdAt
    }))
  ]})}
  function promptRecords(){return safeRows('Prompt Coach drafts',()=>{const u=currentUser();return (u?.promptCoachDrafts||[]).filter(draft=>draft.status!=='DELETED'&&!draft.deletedAt).map(draft=>({
    id:`prompt:${draft.id}`,
    type:'prompt',
    group:'Recent Work',
    title:draft.title||draft.goal||'Prompt Coach Draft',
    description:`Prompt Coach · ${draft.subject||draft.selectedLearningMode||'Saved prompt'}`,
    meta:draft.updatedAt?`Updated ${relative(draft.updatedAt)}`:'Private prompt draft',
    category:'AI Tools',
    keywords:JSON.stringify(draft),
    iconName:'message-square-text',
    view:'promptHistory',
    route:routeForView('promptHistory')||routeForView('promptWithPurpose'),
    recordId:draft.id,
    actionLabel:'Open Prompts',
    updatedAt:draft.updatedAt||draft.createdAt
  }))})}
  function activityRecords(){return safeRows('Recent activity',()=>{const rows=typeof homeActivityRows==='function'?homeActivityRows(24):currentUser()?.activity||[];return rows.map((row,index)=>({
    id:`activity:${index}:${row.time||row.title}`,
    type:'activity',
    group:'Recent Work',
    title:row.title||row.text||'Recent StudySpark activity',
    description:row.detail||row.type||'Recent work',
    meta:row.time||'Recent',
    category:'Recent Work',
    keywords:[row.title,row.text,row.detail,row.type,row.view].join(' '),
    iconName:'history',
    view:row.view&&canOpenView(row.view)?row.view:'activity',
    route:routeForView(row.view&&canOpenView(row.view)?row.view:'activity'),
    actionLabel:'Open Activity',
    updatedAt:row.updatedAt||row.date||row.time
  }))})}
  function userContentRecords(){if(!currentUser())return[];state.userError=null;return [...noteRecords(),...fileRecords(),...flashcardRecords(),...planRecords(),...learningCheckRecords(),...projectRecords(),...collaborationRecords(),...promptRecords(),...activityRecords()]}
  function allSearchRecords({includeUser=true}={}){const records=[...featureRecords()];if(includeUser)records.push(...userContentRecords());return records}
  function matchSearch(query,{includeUser=true,limit=36}={}){const normalized=normalize(query);if(!normalized){const suggested=featureRecords().filter(row=>row.suggested).slice(0,8).map(row=>({...row,group:'Suggested',score:50}));return suggested}return allSearchRecords({includeUser}).map(record=>({...record,score:resultScore(record,query)})).filter(record=>record.score>0).sort((a,b)=>b.score-a.score||String(a.title).localeCompare(String(b.title))).slice(0,limit)}
  function resultFilter(result,filter){if(!filter||filter==='all')return true;if(filter==='tools')return result.type==='feature';if(filter==='assignments')return result.type==='assignment'||/assignment|plan/i.test(result.category);if(filter==='notes')return result.type==='note';if(filter==='flashcards')return result.type==='flashcard';if(filter==='projects')return result.type==='project'||/project/i.test(result.category);if(filter==='study-together')return result.type==='study-together'||result.group==='Study Together';if(filter==='progress')return result.type==='progress'||/progress/i.test(result.category);if(filter==='help')return result.group==='Help Guides'||/help|support/i.test(result.category);return true}
  function sortResults(rows,sort){const copy=[...rows];if(sort==='recent')return copy.sort((a,b)=>dateValue(b.updatedAt)-dateValue(a.updatedAt)||b.score-a.score);if(sort==='alpha')return copy.sort((a,b)=>String(a.title).localeCompare(String(b.title)));if(sort==='due')return copy.sort((a,b)=>(dateValue(a.dueAt)||Number.MAX_SAFE_INTEGER)-(dateValue(b.dueAt)||Number.MAX_SAFE_INTEGER)||b.score-a.score);return copy.sort((a,b)=>b.score-a.score||String(a.title).localeCompare(String(b.title)))}
  function registerResult(result){state.resultMap.set(result.id,result);return result.id}
  function resultButtonHTML(result,index,{listbox=false}={}){registerResult(result);const active=listbox&&index===state.activeIndex;const status=result.status||result.permission||result.category;return `<button class="global-search-result" type="button" data-search-result="${html(result.id)}" data-active="${active?'true':'false'}" ${listbox?'role="option" aria-selected="'+(active?'true':'false')+'"':''}><span class="global-search-result-icon" aria-hidden="true">${iconSVG(result.iconName||'sparkles')}</span><span class="global-search-result-main"><b>${html(result.title)}</b><small>${html(result.description)}</small>${result.meta?`<em>${html(result.meta)}</em>`:''}</span><span class="global-search-result-side"><span>${html(status)}</span><i>${html(result.actionLabel||'Open')} <span aria-hidden="true">→</span></i></span></button>`}
  function groupedResultsHTML(rows,{listbox=false}={}){state.resultMap.clear();const groups=new Map();for(const row of rows){const group=row.group||'Pages and Tools';if(!groups.has(group))groups.set(group,[]);groups.get(group).push(row)}const ordered=[...SEARCH_RESULT_GROUP_ORDER.filter(group=>groups.has(group)),...[...groups.keys()].filter(group=>!SEARCH_RESULT_GROUP_ORDER.includes(group)).sort((a,b)=>a.localeCompare(b))];let resultIndex=0;return ordered.map(group=>{const items=groups.get(group)||[];return `<section class="global-search-result-group" aria-labelledby="global-search-group-${normalize(group).replace(/\s+/g,'-')||'results'}"><h3 id="global-search-group-${normalize(group).replace(/\s+/g,'-')||'results'}">${html(group)}</h3>${items.map(result=>resultButtonHTML(result,resultIndex++,{listbox})).join('')}</section>`}).join('')}
  function sensitiveQuery(query){const q=String(query||'').trim();return /password|passcode|student\s*number|medical|financial|immigration|address|phone|ssn|sin|\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b|@/.test(q.toLowerCase())}
  function recentKey(){const u=currentUser(),id=guestMode()?'guest':(u?.id||u?.email||'anonymous');return `${GLOBAL_SEARCH_RECENT_KEY_PREFIX}:${id}`}
  function readRecentSearches(){try{return JSON.parse(localStorage.getItem(recentKey())||'[]').filter(Boolean).slice(0,RECENT_SEARCH_LIMIT)}catch{return[]}}
  function writeRecentSearches(rows){try{localStorage.setItem(recentKey(),JSON.stringify(rows.slice(0,RECENT_SEARCH_LIMIT)))}catch{}}
  function rememberSearch(query){const q=String(query||'').trim();if(q.length<2||sensitiveQuery(q))return;const existing=readRecentSearches().filter(item=>normalize(item)!==normalize(q));writeRecentSearches([q,...existing])}
  function removeRecentSearch(query){writeRecentSearches(readRecentSearches().filter(item=>normalize(item)!==normalize(query)));renderOverlay();renderSearchPage()}
  function clearRecentSearches(){writeRecentSearches([]);renderOverlay();renderSearchPage()}
  function recentSearchesHTML({page=false}={}){const rows=readRecentSearches();if(!rows.length)return'';return `<section class="${page?'global-search-page-recent-card card':'global-search-recent'}" aria-labelledby="${page?'globalSearchPageRecentTitle':'globalSearchRecentTitle'}"><div class="global-search-recent-head"><h3 id="${page?'globalSearchPageRecentTitle':'globalSearchRecentTitle'}">Recent Searches</h3><button type="button" data-global-search-clear-history>Clear search history</button></div><div class="global-search-recent-list">${rows.map(item=>`<span class="global-search-recent-item"><button type="button" data-global-search-recent="${html(item)}">${html(item)}</button><button type="button" data-global-search-remove-recent="${html(item)}" aria-label="Remove recent search ${html(item)}">×</button></span>`).join('')}</div></section>`}
  function noResultsHTML(query){const features=featureRecords(),correction=features.map(feature=>({title:feature.title,score:resultScore(feature,query)})).sort((a,b)=>b.score-a.score)[0];const hint=correction&&correction.score>20?`<p>Did you mean “${html(correction.title)}”?</p>`:'';return `<div class="global-search-empty"><span aria-hidden="true">${iconSVG('search')}</span><h3>No results for “${html(query)}”</h3>${hint}<p>Try a different keyword, browse every tool, or open the Help Centre.</p><div class="global-search-empty-actions"><button class="btn btn-secondary" type="button" data-global-search-browse-tools>Browse All Tools</button><button class="btn btn-secondary" type="button" data-global-search-open-help>Open Help Centre</button></div></div>`}
  function searchErrorHTML(){return state.userError?`<div class="global-search-source-error" role="status"><p>${html(state.userError)}</p><button type="button" data-global-search-retry>Try Again</button></div>`:''}
  function updateSpinners(searching){state.searching=searching;['globalSearchHeaderSpinner','globalSearchPanelSpinner'].forEach(id=>byId(id)?.classList.toggle('hidden',!searching));}
  function bindResultActions(root=document){all('[data-search-result]',root).forEach(button=>{button.onclick=()=>openResult(button.dataset.searchResult)});all('[data-global-search-recent]',root).forEach(button=>{button.onclick=()=>{setQuery(button.dataset.globalSearchRecent||'',{focus:true});renderOverlay()}});all('[data-global-search-remove-recent]',root).forEach(button=>{button.onclick=event=>{event.stopPropagation();removeRecentSearch(button.dataset.globalSearchRemoveRecent||'')}});all('[data-global-search-clear-history]',root).forEach(button=>{button.onclick=clearRecentSearches});all('[data-global-search-browse-tools]',root).forEach(button=>{button.onclick=()=>navigateToView('tools')});all('[data-global-search-open-help]',root).forEach(button=>{button.onclick=()=>navigateToView('instructions')});all('[data-global-search-retry]',root).forEach(button=>{button.onclick=()=>{renderOverlay();renderSearchPage()}})}
  function renderOverlay(){const resultsRoot=byId('globalSearchResults'),status=byId('globalSearchStatus'),panelInput=byId('globalSearchPanelInput'),query=(panelInput?.value||state.query||'').trim();if(!resultsRoot)return;state.query=query;state.resultMap.clear();const includeUser=query.length>=2;let rows=matchSearch(query,{includeUser,limit:28});state.results=rows;state.activeIndex=Math.min(state.activeIndex,Math.max(rows.length-1,0));if(!query){resultsRoot.innerHTML=recentSearchesHTML()+groupedResultsHTML(rows,{listbox:true});if(status)status.textContent='Suggested tools and recent searches are available.'}else if(rows.length){resultsRoot.innerHTML=searchErrorHTML()+groupedResultsHTML(rows,{listbox:true});if(status)status.textContent=`${rows.length} result${rows.length===1?'':'s'} for ${query}.`}else{resultsRoot.innerHTML=searchErrorHTML()+noResultsHTML(query);if(status)status.textContent=`No results for ${query}.`}syncClearButtons();bindResultActions(resultsRoot)}
  function scheduleOverlayRender(){updateSpinners(true);clearTimeout(state.debounceId);state.debounceId=setTimeout(()=>{updateSpinners(false);renderOverlay()},SEARCH_DEBOUNCE_MS)}
  function syncClearButtons(){const hasQuery=Boolean((state.query||'').trim());['globalSearchHeaderClear','globalSearchPanelClear'].forEach(id=>byId(id)?.classList.toggle('hidden',!hasQuery));}
  function setQuery(query,{focus=false,render=true}={}){state.query=String(query||'');const header=byId('globalSearchHeaderInput'),panel=byId('globalSearchPanelInput'),page=byId('globalSearchPageInput');if(header)header.value=state.query;if(panel)panel.value=state.query;if(page&&document.activeElement!==page)page.value=state.query;syncClearButtons();if(focus)panel?.focus();if(render)renderOverlay()}
  function openOverlay(query='',trigger=null){if(!byId('globalSearchOverlay'))return;state.previousFocus=trigger||document.activeElement;state.open=true;state.activeIndex=0;byId('globalSearchOverlay').classList.remove('hidden');document.body.classList.add('global-search-open');setQuery(query||byId('globalSearchHeaderInput')?.value||'',{render:false});setTimeout(()=>{byId('globalSearchPanelInput')?.focus();renderOverlay()},0)}
  function restoreSearchTriggerFocus(){const target=state.previousFocus;if(!target||typeof target.focus!=='function')return;clearTimeout(state.focusReturnTimer);state.suppressFocusOpen=true;const restore=()=>{try{target.focus({preventScroll:true})}catch(_){target.focus()}state.focusReturnTimer=setTimeout(()=>{state.suppressFocusOpen=false;state.focusReturnTimer=null},120)};if(typeof requestAnimationFrame==='function')requestAnimationFrame(restore);else setTimeout(restore,0)}
  function closeOverlay({returnFocus=true}={}){if(!state.open)return;state.open=false;byId('globalSearchOverlay')?.classList.add('hidden');document.body.classList.remove('global-search-open');updateSpinners(false);if(returnFocus)restoreSearchTriggerFocus()}
  async function navigateToView(view){closeOverlay({returnFocus:false});if(typeof showView==='function'){await showView(view)}}
  async function openSearchPage(query=state.query){const q=String(query||'').trim();rememberSearch(q);closeOverlay({returnFocus:false});if(typeof showView==='function'){const result=await showView('search');if(result===false)return}const route=`/search${q?`?q=${encodeURIComponent(q)}`:''}`,href=routeHref(route);try{history.replaceState({studySparkView:'search'},'',href)}catch{}renderSearchPage(q);byId('globalSearchPageInput')?.focus()}
  async function openResult(resultId){const result=state.resultMap.get(resultId);if(!result)return;rememberSearch(state.query);closeOverlay({returnFocus:false});if(result.requiresAccount&&guestMode()){if(typeof openAuth==='function')openAuth('signup');return}if(result.type==='note'&&result.recordId&&typeof openNoteDetail==='function'){openNoteDetail(result.recordId);return}if(result.type==='assignment'&&result.recordId&&typeof openPlanDetail==='function'){openPlanDetail(result.recordId);return}if(result.type==='study-together'&&result.recordId&&result.view==='studyGroupDetail'&&typeof openStudyGroup==='function'){openStudyGroup(result.recordId);return}if(typeof showView==='function')await showView(result.view||'dashboard')}
  function currentSearchQueryFromLocation(){let route='';try{route=typeof shouldUseHashViewRoutes==='function'&&shouldUseHashViewRoutes()?(location.hash.startsWith('#/')?location.hash.slice(1):''):`${location.pathname}${location.search}`}catch{return''}const queryIndex=route.indexOf('?');if(queryIndex<0)return'';try{return new URLSearchParams(route.slice(queryIndex)).get('q')||''}catch{return''}}
  function renderSearchPage(forcedQuery){const root=byId('globalSearchPageResults');if(!root)return;const input=byId('globalSearchPageInput'),status=byId('globalSearchPageStatus'),recent=byId('globalSearchPageRecent'),filter=byId('globalSearchCategoryFilter'),sort=byId('globalSearchSort');const routeQuery=currentSearchQueryFromLocation();const query=String(forcedQuery!==undefined?forcedQuery:(routeQuery||input?.value||'')).trim();if(input&&document.activeElement!==input)input.value=query;state.query=query;const includeUser=query.length>=2;let rows=matchSearch(query,{includeUser,limit:120});rows=sortResults(rows.filter(row=>resultFilter(row,filter?.value||'all')),sort?.value||'best');state.results=rows;const label=query?`${rows.length} result${rows.length===1?'':'s'} for “${query}”`:`${rows.length} suggested tool${rows.length===1?'':'s'}`;if(status)status.textContent=label;if(recent)recent.innerHTML=recentSearchesHTML({page:true});root.innerHTML=(state.userError?searchErrorHTML():'')+(rows.length?`<section class="global-search-page-count"><h2>${html(label)}</h2><p>Open a result to move to its focused StudySpark page.</p></section>${groupedResultsHTML(rows,{listbox:false})}`:noResultsHTML(query));bindResultActions(document);byId('globalSearchPageInputIcon').innerHTML=iconSVG('search');}
  function bindPageControls(){if(state.pageBound)return;state.pageBound=true;byId('globalSearchPageInput')?.addEventListener('input',event=>{state.query=event.target.value;clearTimeout(state.debounceId);state.debounceId=setTimeout(()=>{const route=`/search${state.query.trim()?`?q=${encodeURIComponent(state.query.trim())}`:''}`;try{history.replaceState({studySparkView:'search'},'',routeHref(route))}catch{}renderSearchPage()},SEARCH_DEBOUNCE_MS)});byId('globalSearchCategoryFilter')?.addEventListener('change',()=>renderSearchPage());byId('globalSearchSort')?.addEventListener('change',()=>renderSearchPage());byId('globalSearchPageClear')?.addEventListener('click',()=>{state.query='';const input=byId('globalSearchPageInput');if(input)input.value='';try{history.replaceState({studySparkView:'search'},'',routeHref('/search'))}catch{}renderSearchPage('');input?.focus()})}
  function handleGlobalKeydown(event){const key=event.key;const shortcut=(event.ctrlKey||event.metaKey)&&key.toLowerCase()==='k';if(shortcut){const target=event.target;if(isEditable(target)&&!target.closest?.('#globalSearchOverlay')&&!target.closest?.('#globalSearchTrigger'))return;event.preventDefault();openOverlay('',target);return}if(!state.open)return;if(key==='Escape'){event.preventDefault();closeOverlay();return}if(key==='ArrowDown'){event.preventDefault();state.activeIndex=Math.min(state.activeIndex+1,Math.max(state.results.length-1,0));renderOverlay();scrollActiveResult();return}if(key==='ArrowUp'){event.preventDefault();state.activeIndex=Math.max(state.activeIndex-1,0);renderOverlay();scrollActiveResult();return}if(key==='Enter'){const active=state.results[state.activeIndex];if(active){event.preventDefault();openResult(active.id)}}}
  function isEditable(target){if(!target)return false;const tag=target.tagName;return target.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(tag)}
  function scrollActiveResult(){byId('globalSearchResults')?.querySelector('[data-active="true"]')?.scrollIntoView({block:'nearest'})}
  function setup(){if(state.bound)return;state.bound=true;const triggerIcon=byId('globalSearchTriggerIcon'),panelIcon=byId('globalSearchPanelIcon'),pageIcon=byId('globalSearchPageInputIcon');if(triggerIcon)triggerIcon.innerHTML=iconSVG('search');if(panelIcon)panelIcon.innerHTML=iconSVG('search');if(pageIcon)pageIcon.innerHTML=iconSVG('search');const shortcut=byId('globalSearchShortcutHint');if(shortcut)shortcut.textContent=/Mac|iPhone|iPad|iPod/.test(navigator.platform||'')?'⌘ K':'Ctrl K';const trigger=byId('globalSearchTrigger'),headerInput=byId('globalSearchHeaderInput');trigger?.addEventListener('submit',event=>{event.preventDefault();openSearchPage(headerInput?.value||'')});trigger?.addEventListener('click',event=>{if(event.target===trigger||event.target.closest?.('.global-search-trigger-icon,.global-search-mobile-label,.global-search-shortcut'))openOverlay(headerInput?.value||'',trigger)});headerInput?.addEventListener('focus',()=>{if(state.suppressFocusOpen)return;openOverlay(headerInput.value,headerInput)});headerInput?.addEventListener('click',()=>{if(state.suppressFocusOpen)return;if(!state.open)openOverlay(headerInput.value,headerInput)});headerInput?.addEventListener('input',()=>{openOverlay(headerInput.value,headerInput);scheduleOverlayRender()});byId('globalSearchHeaderClear')?.addEventListener('click',()=>{setQuery('',{focus:true});headerInput?.focus()});byId('globalSearchPanelInput')?.addEventListener('input',event=>{state.query=event.target.value;const header=byId('globalSearchHeaderInput');if(header)header.value=state.query;scheduleOverlayRender()});byId('globalSearchPanelClear')?.addEventListener('click',()=>{setQuery('',{focus:true})});byId('globalSearchClose')?.addEventListener('click',()=>closeOverlay());byId('globalSearchOverlay')?.addEventListener('click',event=>{if(event.target===byId('globalSearchOverlay'))closeOverlay()});byId('globalSearchViewAll')?.addEventListener('click',()=>openSearchPage(byId('globalSearchPanelInput')?.value||state.query));document.addEventListener('keydown',handleGlobalKeydown);window.addEventListener('popstate',()=>closeOverlay({returnFocus:false}));window.addEventListener('hashchange',()=>closeOverlay({returnFocus:false}));bindPageControls();renderSearchPage()}
  function init(){setup();if(currentSearchQueryFromLocation()&&byId('searchView')?.classList.contains('active'))renderSearchPage(currentSearchQueryFromLocation())}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

  window.StudySparkGlobalSearch=Object.freeze({
    setup,
    open:openOverlay,
    close:closeOverlay,
    search:(query,options)=>matchSearch(query,options),
    renderSearchPage,
    _test:{normalize,featureRecords,userContentRecords,matchSearch,readRecentSearches,rememberSearch,GLOBAL_SEARCH_RECENT_KEY_PREFIX,SEARCH_DEBOUNCE_MS}
  });
})();
