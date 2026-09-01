(function(root){
  'use strict';
  const roles=Object.freeze({STUDENT:'student',TEACHER:'teacher',PARENT:'parent',TUTOR:'tutor',ADMIN:'admin'});
  const navIconSVG=name=>{
    const paths={
      home:'<path d="m3 10.5 9-7 9 7"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>',
      sparkles:'<path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6Z"/><path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8Z"/><path d="m5 15 .7 1.8L7.5 17.5l-1.8.7L5 20l-.7-1.8-1.8-.7 1.8-.7Z"/>',
      bookOpen:'<path d="M12 7v14"/><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v19H7.5A3.5 3.5 0 0 0 4 24Z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H12v19h4.5A3.5 3.5 0 0 1 20 24Z"/>',
      clipboard:'<path d="M9 4h6l1 2h3v15H5V6h3Z"/><path d="M9 10h6"/><path d="M9 14h6"/><path d="M9 18h4"/>',
      usersRound:'<path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"/><path d="M4 21a8 8 0 0 1 16 0"/><path d="M19 8.5a3 3 0 0 1 2 2.8"/><path d="M3 11.3a3 3 0 0 1 2-2.8"/>',
      folderKanban:'<path d="M3 6h6l2 2h10v12H3Z"/><path d="M8 12v5"/><path d="M12 11v6"/><path d="M16 13v4"/>',
      chart:'<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-5"/><path d="M12 16V8"/><path d="M16 16v-7"/>',
      settings:'<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1-2 3.4-.2-.1a1.7 1.7 0 0 0-1.8.1 8.6 8.6 0 0 1-1.6.9 1.7 1.7 0 0 0-1.1 1.4v.2H9v-.2a1.7 1.7 0 0 0-1.1-1.4 8.6 8.6 0 0 1-1.6-.9 1.7 1.7 0 0 0-1.8-.1l-.2.1-2-3.4.1-.1A1.7 1.7 0 0 0 2.6 15a8.6 8.6 0 0 1 0-1.8 1.7 1.7 0 0 0-.3-1.8l-.1-.1 2-3.4.2.1a1.7 1.7 0 0 0 1.8-.1 8.6 8.6 0 0 1 1.6-.9A1.7 1.7 0 0 0 9 5.6v-.2h6v.2A1.7 1.7 0 0 0 16.1 7a8.6 8.6 0 0 1 1.6.9 1.7 1.7 0 0 0 1.8.1l.2-.1 2 3.4-.1.1a1.7 1.7 0 0 0-.3 1.8 8.6 8.6 0 0 1 .1 1.8Z"/>',
      helpCircle:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.8 2.8 0 0 1 5 1.7c0 1.9-2.5 2.2-2.5 4"/><path d="M12 18h.01"/>'
    };
    return `<svg class="sidebar-nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name]||paths.usersRound}</svg>`;
  };
  const item=(id,label,view,icon,allowedRoles,order,primary=true,parentId=null)=>Object.freeze({id,label,href:`#${view}`,view,icon,allowedRoles,requiredPermissions:[],featureFlag:null,parentId,order,primary,ready:true});
  const navigationItems=Object.freeze([
    item('student-home','Home','dashboard',navIconSVG('home'),[roles.STUDENT],10),item('student-coach','AI Coach','coach',navIconSVG('sparkles'),[roles.STUDENT],20),item('student-learn','Learn','aiLiteracy',navIconSVG('bookOpen'),[roles.STUDENT],30),item('student-assignments','Assignments','planner',navIconSVG('clipboard'),[roles.STUDENT],40),item('student-study-together','Study Together','studyTogether',navIconSVG('usersRound'),[roles.STUDENT],45),item('student-projects','Projects','communityAIProject',navIconSVG('folderKanban'),[roles.STUDENT],50),item('student-progress','Progress','progress',navIconSVG('chart'),[roles.STUDENT],60),
    item('teacher-home','Home','roleDashboards',navIconSVG('home'),[roles.TEACHER],10),item('teacher-courses','Courses','resourceStudio',navIconSVG('bookOpen'),[roles.TEACHER],20),item('teacher-assignments','Assignments','assignmentPolicyBuilder',navIconSVG('clipboard'),[roles.TEACHER],30),item('teacher-progress','Students & Progress','roleDashboards',navIconSVG('chart'),[roles.TEACHER],40),item('teacher-reviews','Reviews','integrityReview',navIconSVG('sparkles'),[roles.TEACHER],50),item('teacher-projects','Projects','communityAIProject',navIconSVG('folderKanban'),[roles.TEACHER],60),
    item('parent-home','Home','peerTutoring',navIconSVG('home'),[roles.PARENT],10),item('parent-reports','Progress Reports','serviceDocuments',navIconSVG('chart'),[roles.PARENT],20),item('parent-achievements','Shared Achievements','communityImpact',navIconSVG('sparkles'),[roles.PARENT],30),
    item('tutor-home','Home','peerTutoring',navIconSVG('home'),[roles.TUTOR],10),item('tutor-sessions','My Sessions','bookingSessions',navIconSVG('clipboard'),[roles.TUTOR],20),item('tutor-students','Students','tutoringRequests',navIconSVG('usersRound'),[roles.TUTOR],30),item('tutor-resources','Learning Resources','resourceStudio',navIconSVG('bookOpen'),[roles.TUTOR],40),
    item('admin-home','Home','roleDashboards',navIconSVG('home'),[roles.ADMIN],10),item('admin-reviews','Reviews','integrityReview',navIconSVG('clipboard'),[roles.ADMIN],20),item('admin-safety','Safety','safeguarding',navIconSVG('sparkles'),[roles.ADMIN],30),item('admin-reports','Reports','serviceDocuments',navIconSVG('chart'),[roles.ADMIN],40),
    item('settings','Settings','settings',navIconSVG('settings'),Object.values(roles),90,false),item('help','Help','instructions',navIconSVG('helpCircle'),Object.values(roles),100,false)
  ]);
  const sectionViews=Object.freeze({
    'student-home':['dashboard','today'],
    'student-coach':['coach','promptWithPurpose','promptBuilder','promptImprove','promptTemplates','promptLearn','answerVerification','sourceComparison','claimEvidenceMap','reasoningCheck'],
    'student-learn':['aiLiteracy','aiLiteracyLesson','aiCompetencyProgress','whatAIIs','humanAgency','privacyBeforePrompting','ownershipSpectrum','policyAwareness'],
    'student-assignments':['planner','planDetail','recoveryDashboard','recoveryTaskDecomposition'],
    'student-study-together':['studyTogether','friends','friendsList','friendProfile','friendRequests','studyMatch','studyPartnerResults','studyPartnerProfile','studyRequests','studyRooms','studyRoomLobby','studyRoomDeviceTest','studyGroups','studyGroupCreate','studyGroupDetail','safetyPrivacy'],
    'student-projects':['communityAIProject','problemScopingStudio','aiSystemCardStudio','aiArchitectureDesignStudio','dataResponsibilityStudio','fairnessEvaluationLab','iterationFeedbackStudio','ethicalSocialReflectionStudio'],
    'student-progress':['progress','activity','learningProfile','examReadiness','futureSuccess','predictionDashboard','wellBeing','wellBeingDashboard','competencyPortfolio'],
    settings:['settings','accessibilityLanguage','privacyData','wellBeingReminderSettings','notifications'],help:['instructions','wellBeingHelpSafety','safetyPrivacy']
  });
  function activeRole(){const u=typeof root.user==='function'?root.user():null,peer=u?.peerTutoring?.activeRole,raw=String(peer||u?.role||'student').toUpperCase();if(raw==='PEER_TUTOR'||raw==='VERIFIED_TUTOR')return roles.TUTOR;if(raw==='PARENT_GUARDIAN'||raw==='PARENT')return roles.PARENT;if(raw==='ORGANIZATION_VERIFIER'||raw==='PLATFORM_ADMIN'||raw==='ADMINISTRATOR')return roles.ADMIN;if(raw==='TEACHER')return roles.TEACHER;return roles.STUDENT}
  function visible(role=activeRole()){return navigationItems.filter(x=>x.allowedRoles.includes(role)&&x.ready).sort((a,b)=>a.order-b.order)}
  function render(){const nav=document.getElementById('appNav');if(!nav)return;const items=visible(),primary=items.filter(x=>x.primary),utility=items.filter(x=>!x.primary);nav.innerHTML=primary.map(buttonHTML).join('')+'<div class="nav-separator" role="separator"></div>'+utility.map(buttonHTML).join('');nav.querySelectorAll('button[data-view]').forEach(button=>button.addEventListener('click',async event=>{event.preventDefault();await root.showView?.(button.dataset.view);if(button.dataset.view==='aiLiteracy')root.AILiteracyLab?.render?.('HOME');if(button.dataset.view==='communityAIProject')root.CommunityAIProjectPathway?.render?.()}));syncFromDocument();root.AccessibilityLanguage?.applyInterfaceTranslations?.()}
  function buttonHTML(x){return `<button type="button" data-nav-id="${x.id}" data-view="${x.view}" aria-label="${x.label}" data-sidebar-tooltip="${x.label}"><span class="sidebar-nav-icon-wrap" aria-hidden="true">${x.icon}</span><span class="sidebar-nav-label">${x.label}</span></button>`}
  function syncActive(view){const role=activeRole();document.querySelectorAll('#appNav [data-nav-id]').forEach(button=>{const id=button.dataset.navId,match=button.dataset.view===view||(sectionViews[id]||[]).includes(view),allowed=navigationItems.find(x=>x.id===id)?.allowedRoles.includes(role);button.classList.toggle('active',Boolean(match&&allowed));if(match&&allowed)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current')})}
  function syncFromDocument(){const active=document.querySelector('.app-view.active')?.id?.replace(/View$/,'')||'dashboard';syncActive(active)}
  if(typeof root.viewNames==='object')Object.assign(root.viewNames,{aiLiteracy:['LEARN','Learn'],communityAIProject:['PROJECTS','Projects']});
  root.StudySparkNavigation=Object.freeze({roles,navigationItems,getVisibleNavigation:visible,getActiveRole:activeRole,render,syncActive});
  function protectPrimaryNavigation(){const nav=document.getElementById('appNav');if(!nav)return;new MutationObserver(()=>{const expected=visible().length,configured=nav.querySelectorAll('[data-nav-id]').length,allButtons=nav.querySelectorAll('button').length;if(configured!==expected||allButtons!==expected)render()}).observe(nav,{childList:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{render();protectPrimaryNavigation()});else{render();protectPrimaryNavigation()}
})(typeof window!=='undefined'?window:globalThis);
