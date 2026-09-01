(function(){
  const ROOM_KEY = 'studyRooms';
  const GUEST_ROOM_KEY = 'guestStudyRooms';
  const INVITATION_KEY = 'studyRoomInvitations';
  const GUEST_INVITATION_KEY = 'guestStudyRoomInvitations';
  const PRESENCE_KEY = 'studyRoomPresence';
  const DEVICE_KEY = 'studyRoomDevicePreferences';
  const SESSION_KEY = 'studyRoomSessions';
  const REPORT_KEY = 'studyRoomReports';
  const CALL_TABS_KEY = 'studyRoomActiveCallTabs';
  const CALL_PREFS_KEY = 'studyRoomDevicePreferences';
  const SCREEN_SHARE_MIGRATION_KEY = 'screenShareMigrationVersion';
  const MESSAGE_KEY = 'studyRoomMessages';
  const CHAT_MIGRATION_KEY = 'studyRoomChatMigrationVersion';
  const GOAL_KEY = 'studyRoomGoals';
  const GOAL_MIGRATION_KEY = 'studyRoomGoalsMigrationVersion';
  const AI_CONSENT_KEY = 'studyRoomAIConsent';
  const AI_RESULT_KEY = 'studyRoomAIResults';
  const AI_MIGRATION_KEY = 'studyRoomAIMigrationVersion';
  const JOIN_REQUEST_KEY = 'studyRoomJoinRequests';
  const HOST_MIGRATION_KEY = 'studyRoomHostMigrationVersion';
  const SAFETY_MIGRATION_KEY = 'studyRoomSafetyMigrationVersion';
  const DISPLAY_NAME_KEY = 'studyRoomDisplayNames';
  const USER_BLOCKS_KEY = 'userBlocks';
  const SAFETY_REPORT_KEY = 'studyRoomSafetyReports';
  const ROOM_CODE_ATTEMPT_KEY = 'studyRoomCodeAttempts';
  const MIGRATION_KEY = 'studyRoomsMigrationVersion';
  const INVITATION_MIGRATION_KEY = 'studyRoomInvitationMigrationVersion';
  const LOBBY_MIGRATION_KEY = 'studyRoomLobbyMigrationVersion';
  const MIGRATION_VERSION = 1;
  const LOBBY_MIGRATION_VERSION = 1;
  const DRAFT_KEY = 'studyRoomDraft';
  const STATUSES = ['scheduled','waiting','active','completed','cancelled'];
  const INVITATION_STATUSES = ['pending','accepted','declined','cancelled','expired'];
  const JOIN_REQUEST_STATUSES = ['pending','approved','declined','cancelled'];
  const PRIVACY = ['private','friends-only','invite-only','verified-school-only'];
  const REPORT_CATEGORY_OPTIONS = [
    {value:'harassment',label:'Harassment'},
    {value:'inappropriate-content',label:'Inappropriate Content'},
    {value:'spam',label:'Spam'},
    {value:'impersonation',label:'Impersonation'},
    {value:'unsafe-behaviour',label:'Unsafe Behaviour'},
    {value:'other',label:'Other'}
  ];
  const REPORT_CATEGORY_VALUES = REPORT_CATEGORY_OPTIONS.map(row=>row.value);
  const REPORT_CATEGORY_LABELS = REPORT_CATEGORY_OPTIONS.reduce((map,row)=>({...map,[row.value]:row.label}),{});
  const REPORT_CATEGORIES = REPORT_CATEGORY_OPTIONS.map(row=>row.label);
  const DEFAULT_ROOM_SAFETY_SETTINGS = {
    privacy:'private',
    isLocked:false,
    requiresRoomCode:true,
    requiresPassword:false,
    friendInvitationsOnly:true,
    cameraAllowed:true,
    microphoneAllowed:true,
    screenSharingAllowed:true,
    recordingAllowed:false,
    chatEnabled:true,
    exactLocationSharingAllowed:false,
    contactSharingAllowed:false,
    schoolVerificationRequired:false
  };
  const SCREEN_SHARE_PERMISSIONS = ['host-only','all-participants'];
  const MESSAGE_TYPES = ['text','study-link','question','emoji','study-goal','system'];
  const USER_MESSAGE_TYPES = ['text','study-link','question','emoji','study-goal'];
  const MESSAGE_STATUSES = ['sending','sent','failed','deleted','delivered','read'];
  const AI_MODES = ['study-order','group-quiz','discussion-questions','topic-summary','study-agenda'];
  const AI_STEP_TYPES = ['peer-explanation','group-review','practice-questions','compare-answers','discuss-mistakes','summary','break','custom'];
  const TIMER_STATUSES = ['idle','running','paused','completed'];
  const TIMER_MODES = {
    focus:{mode:'focus',title:'Focus Period',durationSeconds:1500,shortTitle:'Focus'},
    break:{mode:'break',title:'Break Period',durationSeconds:300,shortTitle:'Break'},
    quiz:{mode:'quiz',title:'Practice Quiz',durationSeconds:900,shortTitle:'Practice Quiz'},
    discussion:{mode:'discussion',title:'Group Discussion',durationSeconds:600,shortTitle:'Discussion'},
    custom:{mode:'custom',title:'Custom Timer',durationSeconds:1500,shortTitle:'Custom'}
  };
  const DEFAULT_TIMER_SCHEDULE = [
    {mode:'focus',durationSeconds:1500},
    {mode:'break',durationSeconds:300},
    {mode:'quiz',durationSeconds:900},
    {mode:'discussion',durationSeconds:600}
  ];
  const DURATIONS = [30,45,60,90,120];
  const labels = {scheduled:'Scheduled',waiting:'Waiting for Members',active:'In Progress',completed:'Completed',cancelled:'Cancelled'};
  const invitationLabels = {pending:'Pending',accepted:'Accepted',declined:'Declined',cancelled:'Cancelled',expired:'Expired'};
  const CALL_STATES = ['idle','joining','waiting','connecting','connected','reconnecting','ending','ended','failed'];
  const studyRoomChatMode={mode:'local-prototype',backendConnected:false};

  function current(){return typeof getCurrentUser==='function'?getCurrentUser():user?.()}
  function isGuest(){return typeof isGuestMode==='function'?isGuestMode():false}
  function roomStorageKey(){return isGuest()?GUEST_ROOM_KEY:ROOM_KEY}
  function invitationStorageKey(){return isGuest()?GUEST_INVITATION_KEY:INVITATION_KEY}
  function safe(value){return typeof escapeHTML==='function'?escapeHTML(value):String(value||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
  function text(value){return String(value||'').trim()}
  function notify(type,message,extra={}){if(typeof showNotification==='function')showNotification({type,message,...extra});else if(typeof toast==='function')toast(message)}
  function privateInfo(value){return typeof containsPrivateContactInformation==='function'?containsPrivateContactInformation(value):/(https?:\/\/|www\.|@|\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b|\b\d+\s+\w+\s+(street|st|road|rd|avenue|ave|drive|dr|court|ct|lane|ln|boulevard|blvd)\b)/i.test(String(value||''))}
  function unique(values){return [...new Set((Array.isArray(values)?values:[]).map(String).filter(Boolean))]}
  function todayLocal(){return new Date().toISOString().slice(0,10)}
  function addDays(date,days){const next=new Date(date);next.setDate(next.getDate()+days);return next}
  function randomIndex(max){
    if(window.crypto&&typeof window.crypto.getRandomValues==='function'){
      const values=new Uint32Array(1);
      window.crypto.getRandomValues(values);
      return values[0]%max;
    }
    return Math.floor(Math.random()*max);
  }
  function createStudyRoomCode(){
    const allowedCharacters='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const createPart=length=>Array.from({length},()=>allowedCharacters[randomIndex(allowedCharacters.length)]).join('');
    return `${createPart(4)}-${createPart(4)}`;
  }
  function normalizeRoomCode(code){
    const raw=text(code).toUpperCase().replace(/[^A-Z0-9]/g,'');
    if(raw.length!==8)return '';
    return `${raw.slice(0,4)}-${raw.slice(4)}`;
  }
  function normalizeRoomPrivacy(value){
    const normalized=text(value).toLowerCase();
    if(normalized==='friends')return 'friends-only';
    if(normalized==='public'||normalized==='discoverable'||normalized==='open')return 'private';
    return PRIVACY.includes(normalized)?normalized:'private';
  }
  function privacyLabel(value){
    return ({private:'Private',['friends-only']:'Friends Only',['invite-only']:'Invite Only',['verified-school-only']:'Verified School Only'}[normalizeRoomPrivacy(value)]||'Private');
  }
  function isFriendsOnlyRoom(room){return normalizeRoomPrivacy(room?.privacy)==='friends-only'}
  function assignUniqueRoomCode(room,usedCodes=new Set()){
    let roomCode=normalizeRoomCode(room?.roomCode);
    if(!roomCode||usedCodes.has(roomCode)){
      do roomCode=createStudyRoomCode(); while(usedCodes.has(roomCode));
    }
    usedCodes.add(roomCode);
    return roomCode;
  }

  function createStudyRoomId(){
    if(window.crypto&&typeof window.crypto.randomUUID==='function')return `room-${window.crypto.randomUUID()}`;
    return 'room-'+Date.now()+'-'+Math.random().toString(36).slice(2,10);
  }

  function createScheduledStartAt({date,startTime}){
    const localDateTime=new Date(`${date}T${startTime}:00`);
    if(Number.isNaN(localDateTime.getTime()))return null;
    return localDateTime.toISOString();
  }

  function normalizeStudyRoomInput(input={}){
    return {
      roomName:text(input.roomName),
      course:text(input.course),
      topic:text(input.topic),
      description:text(input.description),
      date:text(input.date),
      startTime:text(input.startTime),
      durationMinutes:Number(input.durationMinutes||60),
      maximumMembers:Number(input.maximumMembers),
      cameraAllowed:input.cameraAllowed!==false,
      microphoneAllowed:input.microphoneAllowed!==false,
      screenSharePermission:normalizeScreenSharePermission(input.screenSharePermission),
      chatEnabled:input.chatEnabled!==false,
      privacy:normalizeRoomPrivacy(input.privacy),
      requiresPassword:input.requiresPassword===true,
      passwordValue:text(input.passwordValue),
      invitedUserIds:unique(input.invitedUserIds)
    };
  }

  function normalizeScreenSharePermission(value){
    const normalized=text(value);
    if(normalized==='host'||normalized==='host_only')return 'host-only';
    if(normalized==='everyone'||normalized==='all'||normalized==='participants')return 'all-participants';
    return SCREEN_SHARE_PERMISSIONS.includes(normalized)?normalized:'all-participants';
  }

  function normalizeStudyRoom(room){
    if(!room||typeof room!=='object')return null;
    const now=new Date().toISOString();
    const hostUserId=text(room.hostUserId);
    const participantIds=unique([hostUserId,...(room.participantIds||[])]).filter(Boolean);
    const maximumMembers=Math.min(100,Math.max(2,Number.isInteger(Number(room.maximumMembers))?Number(room.maximumMembers):5));
    const status=STATUSES.includes(room.status)?room.status:'scheduled';
    return {
      roomId:text(room.roomId)||createStudyRoomId(),
      roomCode:normalizeRoomCode(room.roomCode),
      roomName:text(room.roomName)||'Study Room',
      course:text(room.course),
      topic:text(room.topic),
      description:text(room.description).slice(0,500),
      hostUserId,
      participantIds:participantIds.slice(0,maximumMembers),
      invitedUserIds:unique(room.invitedUserIds).filter(id=>id!==hostUserId),
      declinedUserIds:unique(room.declinedUserIds),
      removedUserIds:unique(room.removedUserIds),
      isLocked:room.isLocked===true,
      mutedParticipants:(Array.isArray(room.mutedParticipants)?room.mutedParticipants:[]).map(row=>({userId:text(row.userId),muted:row.muted!==false,mutedBy:text(row.mutedBy),mutedAt:row.mutedAt||now})).filter(row=>row.userId),
      aiPermissions:room.aiPermissions&&typeof room.aiPermissions==='object'?{allowRoomAI:room.aiPermissions.allowRoomAI!==false}: {allowRoomAI:true},
      date:text(room.date),
      startTime:text(room.startTime),
      scheduledStartAt:room.scheduledStartAt||createScheduledStartAt({date:room.date,startTime:room.startTime}),
      durationMinutes:DURATIONS.includes(Number(room.durationMinutes))?Number(room.durationMinutes):60,
      maximumMembers,
      cameraAllowed:room.cameraAllowed!==false,
      microphoneAllowed:room.microphoneAllowed!==false,
      screenSharingAllowed:room.screenSharingAllowed!==false,
      recordingAllowed:false,
      requiresRoomCode:room.requiresRoomCode!==false,
      requiresPassword:room.requiresPassword===true,
      passwordUpdatedAt:room.requiresPassword===true?room.passwordUpdatedAt||room.updatedAt||now:null,
      friendInvitationsOnly:room.friendInvitationsOnly!==false,
      exactLocationSharingAllowed:false,
      contactSharingAllowed:false,
      schoolVerificationRequired:room.schoolVerificationRequired===true||normalizeRoomPrivacy(room.privacy)==='verified-school-only',
      screenSharePermission:normalizeScreenSharePermission(room.screenSharePermission),
      chatEnabled:room.chatEnabled!==false,
      privacy:normalizeRoomPrivacy(room.privacy),
      status,
      createdAt:room.createdAt||now,
      updatedAt:room.updatedAt||room.createdAt||now,
      startedAt:room.startedAt||null,
      endedAt:room.endedAt||null,
      cancelledAt:room.cancelledAt||null,
      completedAutomatically:room.completedAutomatically===true,
      prototypeOnly:true
    };
  }

  function validateStudyRoomCollection(rooms){
    const errors=[],ids=new Set();
    (rooms||[]).forEach(room=>{
      const normalized=normalizeStudyRoom(room);
      if(!normalized)errors.push('A study room record is invalid.');
      else if(ids.has(normalized.roomId))errors.push('Study room IDs must be unique.');
      else ids.add(normalized.roomId);
    });
    return {valid:errors.length===0,errors};
  }

  function loadStudyRooms(){
    try{
      const raw=localStorage.getItem(roomStorageKey());
      if(!raw)return [];
      const parsed=JSON.parse(raw);
      const rows=Array.isArray(parsed)?parsed:parsed.rooms;
      return Array.isArray(rows)?rows.map(normalizeStudyRoom).filter(Boolean):[];
    }catch(error){
      console.error('Could not load study rooms.',error);
      return [];
    }
  }

  function saveStudyRooms(rooms){
    const usedCodes=new Set();
    const normalized=(Array.isArray(rooms)?rooms:[]).map(normalizeStudyRoom).filter(Boolean).map(room=>({...room,roomCode:assignUniqueRoomCode(room,usedCodes)}));
    const validation=validateStudyRoomCollection(normalized);
    if(!validation.valid)return {success:false,error:validation.errors[0]};
    try{
      localStorage.setItem(roomStorageKey(),JSON.stringify({version:'1.0.0',rooms:normalized}));
      return {success:true};
    }catch(error){
      return {success:false,error:'The study room could not be saved.'};
    }
  }

  // Prototype limitation:
  // Study-room invitations are stored in localStorage.
  // They cannot reach another user on another device.
  // Production requires a backend, authenticated accounts,
  // a shared live database and real-time notifications.
  function createStudyRoomInvitationId(){
    if(window.crypto&&typeof window.crypto.randomUUID==='function')return 'room-invite-'+window.crypto.randomUUID();
    return 'room-invite-'+Date.now()+'-'+Math.random().toString(36).slice(2,10);
  }

  function normalizeStudyRoomInvitation(invitation){
    if(!invitation||typeof invitation!=='object')return null;
    const now=new Date().toISOString(),status=invitation.status==='join-later'?'pending':INVITATION_STATUSES.includes(invitation.status)?invitation.status:'expired';
    return {
      invitationId:text(invitation.invitationId||invitation.id)||createStudyRoomInvitationId(),
      roomId:text(invitation.roomId),
      fromUserId:text(invitation.fromUserId),
      toUserId:text(invitation.toUserId),
      status,
      sentAt:invitation.sentAt||invitation.createdAt||now,
      respondedAt:invitation.respondedAt||null,
      acceptedAt:invitation.acceptedAt||null,
      declinedAt:invitation.declinedAt||null,
      cancelledAt:invitation.cancelledAt||null,
      lastViewedAt:invitation.lastViewedAt||null,
      updatedAt:invitation.updatedAt||invitation.sentAt||now,
      prototypeOnly:true
    };
  }

  function validateStudyRoomInvitation(invitation){
    const errors=[];
    if(!invitation.invitationId)errors.push('Invitation ID is required.');
    if(!invitation.roomId)errors.push('Room ID is required.');
    if(!invitation.fromUserId||!invitation.toUserId)errors.push('Invitation sender and receiver are required.');
    if(invitation.fromUserId===invitation.toUserId)errors.push('The host cannot invite themselves.');
    if(!INVITATION_STATUSES.includes(invitation.status))errors.push('Invitation status is invalid.');
    if(!invitation.sentAt||Number.isNaN(new Date(invitation.sentAt).getTime()))errors.push('Invitation time is invalid.');
    return {valid:errors.length===0,errors};
  }

  function validateStudyRoomInvitationCollection(invitations){
    const errors=[],ids=new Set(),pendingPairs=new Set();
    (Array.isArray(invitations)?invitations:[]).forEach(invitation=>{
      const record=normalizeStudyRoomInvitation(invitation),validation=record?validateStudyRoomInvitation(record):{valid:false,errors:['A study-room invitation is invalid.']};
      if(!validation.valid)errors.push(validation.errors[0]);
      if(record){
        if(ids.has(record.invitationId))errors.push('Study-room invitation IDs must be unique.');
        ids.add(record.invitationId);
        const pair=`${record.roomId}:${record.toUserId}`;
        if(record.status==='pending'&&pendingPairs.has(pair))errors.push('Only one pending invitation is allowed for each room and friend.');
        if(record.status==='pending')pendingPairs.add(pair);
      }
    });
    return {valid:errors.length===0,errors};
  }

  function loadStudyRoomInvitations(){
    try{
      const raw=localStorage.getItem(invitationStorageKey());
      if(!raw)return [];
      const parsed=JSON.parse(raw),rows=Array.isArray(parsed)?parsed:parsed.invitations;
      return Array.isArray(rows)?dedupeStudyRoomInvitations(rows.map(normalizeStudyRoomInvitation).filter(Boolean)):[];
    }catch(error){
      console.error('Could not load study-room invitations.',error);
      return [];
    }
  }

  function saveStudyRoomInvitations(invitations){
    const normalized=dedupeStudyRoomInvitations((Array.isArray(invitations)?invitations:[]).map(normalizeStudyRoomInvitation).filter(Boolean));
    const validation=validateStudyRoomInvitationCollection(normalized);
    if(!validation.valid)return {success:false,error:validation.errors[0]};
    try{
      localStorage.setItem(invitationStorageKey(),JSON.stringify({version:'1.0.0',invitations:normalized}));
      updateStudyRoomInvitationBadge();
      return {success:true};
    }catch(error){
      return {success:false,error:'The study-room invitations could not be saved.'};
    }
  }

  function dedupeStudyRoomInvitations(invitations){
    const seenIds=new Set(),seenPending=new Set(),rooms=loadStudyRooms();
    const roomStatus=new Map(rooms.map(room=>[room.roomId,room.status]));
    return (invitations||[]).filter(invitation=>{
      if(seenIds.has(invitation.invitationId))return false;
      seenIds.add(invitation.invitationId);
      const status=roomStatus.get(invitation.roomId);
      if(status==='cancelled'&&invitation.status==='pending')invitation.status='cancelled';
      if(status==='completed'&&invitation.status==='pending')invitation.status='expired';
      const pair=`${invitation.roomId}:${invitation.toUserId}`;
      if(invitation.status==='pending'&&seenPending.has(pair))return false;
      if(invitation.status==='pending')seenPending.add(pair);
      return true;
    });
  }

  function isValidInvitationTransition({currentStatus,nextStatus}){
    const allowed={pending:['accepted','declined','cancelled','expired'],accepted:[],declined:[],cancelled:[],expired:[]};
    return (allowed[currentStatus]||[]).includes(nextStatus);
  }

  function getStudyRoomCapacity(room){
    const participantCount=Array.isArray(room?.participantIds)?new Set(room.participantIds).size:0;
    const pendingInvitationCount=loadStudyRoomInvitations().filter(invitation=>invitation.roomId===room?.roomId&&invitation.status==='pending').length;
    const reservedCount=participantCount+pendingInvitationCount;
    return {maximumMembers:room?.maximumMembers||0,participantCount,pendingInvitationCount,reservedCount,availableSpots:Math.max(0,(room?.maximumMembers||0)-reservedCount),isFull:reservedCount>=(room?.maximumMembers||0)};
  }

  function validateRoomInvitationRecipients({room,hostUserId,invitedUserIds,invitations}){
    const errors=[];
    for(const invitedUserId of invitedUserIds){
      const result=studyRoomSafetyService.validateInvitation({room,senderUserId:hostUserId,recipientUserId:invitedUserId,invitations});
      if(!result.valid)errors.push(result.errors[0]);
    }
    return {valid:errors.length===0,errors};
  }

  function updateRoomInvitedUserIds({roomId,userIds}){
    const rooms=loadStudyRooms(),room=rooms.find(item=>item.roomId===roomId);
    if(!room)return {success:false,error:'Study room not found.'};
    room.invitedUserIds=unique([...(room.invitedUserIds||[]),...userIds]);
    room.updatedAt=new Date().toISOString();
    return saveStudyRooms(rooms);
  }

  function createInvitationNotifications(invitations){
    const rooms=loadStudyRooms();
    invitations.forEach(invitation=>{
      const room=rooms.find(item=>item.roomId===invitation.roomId),hostName=studyRoomSafetyService.getSafeDisplayName(invitation.fromUserId);
      const message=`${hostName} invited you to ${room?.roomName||'a study room'}.`;
      notify('information',message,{category:'study-room-invitation',userId:invitation.toUserId,relatedRoomId:invitation.roomId,relatedInvitationId:invitation.invitationId,occurrenceKey:`study-room-invitation:${invitation.invitationId}`,actionLabel:'View Invitation',linkPage:'studyRooms'});
    });
  }

  function sendStudyRoomInvitations({roomId,invitedUserIds}){
    const currentUser=current();
    if(!currentUser||isGuest())return {success:false,error:'You must be signed in to send study-room invitations.'};
    const room=getStudyRoomById(roomId);
    if(!room)return {success:false,error:'Study room not found.'};
    if(room.hostUserId!==currentUser.id)return {success:false,error:'Only the room host can send invitations.'};
    if(['completed','cancelled'].includes(room.status))return {success:false,error:'Invitations cannot be sent for this room.'};
    const uniqueUserIds=unique(invitedUserIds);
    if(!uniqueUserIds.length)return {success:false,error:'Select at least one friend.'};
    const invitations=loadStudyRoomInvitations(),eligibility=validateRoomInvitationRecipients({room,hostUserId:currentUser.id,invitedUserIds:uniqueUserIds,invitations});
    if(!eligibility.valid)return {success:false,error:eligibility.errors[0]};
    const capacity=getStudyRoomCapacity(room);
    if(uniqueUserIds.length>capacity.availableSpots)return {success:false,error:`You can invite up to ${capacity.availableSpots} more ${capacity.availableSpots===1?'friend':'friends'}.`};
    const now=new Date().toISOString(),createdInvitations=uniqueUserIds.map(toUserId=>({invitationId:createStudyRoomInvitationId(),roomId:room.roomId,fromUserId:currentUser.id,toUserId,status:'pending',sentAt:now,respondedAt:null,acceptedAt:null,declinedAt:null,cancelledAt:null,lastViewedAt:null,updatedAt:now,prototypeOnly:true}));
    const previousInvitations=invitations.slice(),saved=saveStudyRoomInvitations([...invitations,...createdInvitations]);
    if(!saved.success)return saved;
    const roomUpdate=updateRoomInvitedUserIds({roomId:room.roomId,userIds:uniqueUserIds});
    if(!roomUpdate.success){saveStudyRoomInvitations(previousInvitations);return {success:false,error:'The study-room invitations could not be saved.'}}
    createInvitationNotifications(createdInvitations);
    return {success:true,invitations:createdInvitations};
  }

  function runStudyRoomMigration(){
    try{
      if(localStorage.getItem(MIGRATION_KEY)===String(MIGRATION_VERSION))return;
      [ROOM_KEY,GUEST_ROOM_KEY].forEach(key=>{
        const raw=localStorage.getItem(key);
        if(!raw)return;
        const parsed=JSON.parse(raw);
        const rows=Array.isArray(parsed)?parsed:parsed.rooms;
        const usedCodes=new Set();
        const normalized=(Array.isArray(rows)?rows:[]).map(normalizeStudyRoom).filter(Boolean).map(room=>({...room,roomCode:assignUniqueRoomCode(room,usedCodes)}));
        const validation=validateStudyRoomCollection(normalized);
        if(validation.valid)localStorage.setItem(key,JSON.stringify({version:'1.0.0',rooms:normalized}));
      });
      localStorage.setItem(MIGRATION_KEY,String(MIGRATION_VERSION));
    }catch(error){console.error('Study room migration failed.',error)}
  }

  function runStudyRoomInvitationMigration(){
    try{
      if(localStorage.getItem(INVITATION_MIGRATION_KEY)===String(MIGRATION_VERSION))return;
      [INVITATION_KEY,GUEST_INVITATION_KEY].forEach(key=>{
        const raw=localStorage.getItem(key);
        if(!raw)return;
        const parsed=JSON.parse(raw),rows=Array.isArray(parsed)?parsed:parsed.invitations;
        const normalized=dedupeStudyRoomInvitations((Array.isArray(rows)?rows:[]).map(normalizeStudyRoomInvitation).filter(Boolean));
        const validation=validateStudyRoomInvitationCollection(normalized);
        if(validation.valid)localStorage.setItem(key,JSON.stringify({version:'1.0.0',invitations:normalized}));
      });
      localStorage.setItem(INVITATION_MIGRATION_KEY,String(MIGRATION_VERSION));
    }catch(error){console.error('Study-room invitation migration failed.',error)}
  }

  function normalizeStudyRoomPresence(row){
    const state=['not-present','in-lobby','in-room','left'].includes(row?.state)?row.state:'left';
    return {roomId:text(row?.roomId),userId:text(row?.userId),state,joinedLobbyAt:row?.joinedLobbyAt||null,updatedAt:row?.updatedAt||new Date().toISOString(),prototypeOnly:true};
  }

  function loadStudyRoomPresence(){
    try{
      const rows=JSON.parse(localStorage.getItem(PRESENCE_KEY)||'[]');
      const seen=new Set();
      return (Array.isArray(rows)?rows:[]).map(normalizeStudyRoomPresence).filter(row=>row.roomId&&row.userId).filter(row=>{const key=`${row.roomId}:${row.userId}`;if(seen.has(key))return false;seen.add(key);return true});
    }catch(error){
      console.error('Could not load study-room presence.',error);
      return [];
    }
  }

  function saveStudyRoomPresence(rows){
    const seen=new Set();
    const normalized=(Array.isArray(rows)?rows:[]).map(normalizeStudyRoomPresence).filter(row=>row.roomId&&row.userId).filter(row=>{const key=`${row.roomId}:${row.userId}`;if(seen.has(key))return false;seen.add(key);return true});
    localStorage.setItem(PRESENCE_KEY,JSON.stringify(normalized));
    return normalized;
  }

  function updateStudyRoomPresence({roomId,userId,state}){
    if(!roomId||!userId)return {success:false,error:'Room presence could not be updated.'};
    const now=new Date().toISOString(),rows=loadStudyRoomPresence(),previous=rows.find(row=>row.roomId===roomId&&row.userId===userId);
    const record=normalizeStudyRoomPresence({roomId,userId,state,joinedLobbyAt:state==='in-lobby'?(previous?.joinedLobbyAt||now):previous?.joinedLobbyAt||null,updatedAt:now,prototypeOnly:true});
    saveStudyRoomPresence([...rows.filter(row=>!(row.roomId===roomId&&row.userId===userId)),record]);
    return {success:true,record};
  }

  function roomPresenceState(roomId,userId){
    return loadStudyRoomPresence().find(row=>row.roomId===roomId&&row.userId===userId)?.state||'not-present';
  }

  function removeStudyRoomPresence(roomId,userId=''){
    saveStudyRoomPresence(loadStudyRoomPresence().filter(row=>!(row.roomId===roomId&&(!userId||row.userId===userId))));
  }

  function devicePreferenceKey(roomId,userId){return `${roomId}:${userId}`}
  function loadDevicePreferences(){try{return JSON.parse(sessionStorage.getItem(DEVICE_KEY)||'{}')||{}}catch{return {}}}
  function saveDevicePreference({roomId,userId,cameraEnabled=false,microphoneEnabled=false}){
    const prefs=loadDevicePreferences();
    prefs[devicePreferenceKey(roomId,userId)]={roomId,userId,cameraEnabled:Boolean(cameraEnabled),microphoneEnabled:Boolean(microphoneEnabled),updatedAt:new Date().toISOString()};
    sessionStorage.setItem(DEVICE_KEY,JSON.stringify(prefs));
    return prefs[devicePreferenceKey(roomId,userId)];
  }
  function getDevicePreference(roomId,userId){return loadDevicePreferences()[devicePreferenceKey(roomId,userId)]||{roomId,userId,cameraEnabled:false,microphoneEnabled:false}}
  function clearDevicePreference(roomId,userId){const prefs=loadDevicePreferences();delete prefs[devicePreferenceKey(roomId,userId)];sessionStorage.setItem(DEVICE_KEY,JSON.stringify(prefs))}
  function saveCurrentRoomSession(record){
    let rows=[];
    try{rows=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'[]')}catch{rows=[]}
    const key=devicePreferenceKey(record.roomId,record.userId);
    rows=(Array.isArray(rows)?rows:[]).filter(row=>devicePreferenceKey(row.roomId,row.userId)!==key);
    rows.push({...record,prototypeOnly:true});
    sessionStorage.setItem(SESSION_KEY,JSON.stringify(rows));
    return record;
  }
  function loadActiveCallTabs(){try{return JSON.parse(localStorage.getItem(CALL_TABS_KEY)||'[]')}catch{return []}}
  function saveActiveCallTabs(rows){localStorage.setItem(CALL_TABS_KEY,JSON.stringify(Array.isArray(rows)?rows:[]))}
  function registerActiveCallTab(roomId,userId){
    const now=Date.now(),rows=loadActiveCallTabs().filter(row=>now-Number(row.updatedAt||0)<7200000&&row.tabId!==callRuntime.activeTabId);
    const otherTab=rows.find(row=>row.userId===userId&&row.roomId);
    rows.push({tabId:callRuntime.activeTabId,roomId,userId,updatedAt:now});
    saveActiveCallTabs(rows);
    if(otherTab)notificationManager.warning('This account has another study call open in a different tab.');
  }
  function unregisterActiveCallTab(){
    saveActiveCallTabs(loadActiveCallTabs().filter(row=>row.tabId!==callRuntime.activeTabId));
  }

  function createStudyRoomMessageId(){
    if(window.crypto&&typeof window.crypto.randomUUID==='function')return 'room-message-'+window.crypto.randomUUID();
    return 'room-message-'+Date.now()+'-'+Math.random().toString(36).slice(2,10);
  }
  function createStudyGoalId(){
    if(window.crypto&&typeof window.crypto.randomUUID==='function')return 'goal-'+window.crypto.randomUUID();
    return 'goal-'+Date.now()+'-'+Math.random().toString(36).slice(2,10);
  }
  function normalizeStudyRoomMessageInput({type='text',content='',linkUrl=null,goalData=null,replyToMessageId=null,clientRequestId=null}={}){
    return {type:text(type).toLowerCase()||'text',content:String(content||'').replace(/\r\n/g,'\n').trim(),linkUrl:linkUrl?text(linkUrl):null,goalData:goalData&&typeof goalData==='object'?goalData:null,replyToMessageId:replyToMessageId?text(replyToMessageId):null,clientRequestId:clientRequestId?text(clientRequestId):null};
  }
  function normalizeStudyRoomMessage(message){
    if(typeof message==='string')message={content:message,type:'text'};
    if(!message||typeof message!=='object')return null;
    const input=normalizeStudyRoomMessageInput(message),now=new Date().toISOString();
    const safeType=MESSAGE_TYPES.includes(input.type)?input.type:'text';
    const deletedAt=message.deletedAt||null;
    return {messageId:text(message.messageId)||createStudyRoomMessageId(),roomId:text(message.roomId),senderUserId:text(message.senderUserId),type:safeType,content:input.content.slice(0,1000),linkUrl:input.linkUrl,goalData:input.goalData,replyToMessageId:input.replyToMessageId,clientRequestId:input.clientRequestId,source:message.source==='demo'?'demo':'local',createdAt:message.createdAt||now,editedAt:message.editedAt||null,deletedAt,status:deletedAt?'deleted':MESSAGE_STATUSES.includes(message.status)?message.status:'sent',prototypeOnly:message.prototypeOnly!==false};
  }
  function containsUnsafeChatContent(value=''){
    const raw=String(value||'');
    if(privateInfo(raw))return true;
    return /(password|passcode|login code|recovery code|social security|sin number|credit card|bank account|health card|medical record)/i.test(raw);
  }
  function isAllowedStudyLink(value){
    if(!value)return false;
    try{
      const url=new URL(value);
      if(url.protocol==='https:')return true;
      return url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname);
    }catch(error){return false}
  }
  function validateStudyGoalData(goalData,room){
    const errors=[];
    if(!goalData||typeof goalData!=='object'){errors.push('Enter a study goal.');return {valid:false,errors}}
    const title=text(goalData.title||goalData.content);
    const details=text(goalData.details);
    const targetMinutes=Number(goalData.targetMinutes||0);
    if(!title)errors.push('Enter a study goal title.');
    if(title.length>120)errors.push('Goal title can contain up to 120 characters.');
    if(details.length>300)errors.push('Goal details can contain up to 300 characters.');
    if(goalData.targetMinutes&&(!Number.isFinite(targetMinutes)||targetMinutes<1||targetMinutes>180))errors.push('Goal target time must be between 1 and 180 minutes.');
    if(goalData.assignedUserId&&(!room?.participantIds?.includes(goalData.assignedUserId)||(room.removedUserIds||[]).includes(goalData.assignedUserId)))errors.push('Assign the goal to an active room participant.');
    if(containsUnsafeChatContent(`${title} ${details}`))errors.push('Remove private contact or location information before sending.');
    return {valid:errors.length===0,errors};
  }
  function validateNewStudyRoomMessage(message,room=getStudyRoomById(message?.roomId)){
    const errors=[];
    if(!USER_MESSAGE_TYPES.includes(message.type))errors.push('Message type is invalid.');
    if(['text','question','emoji'].includes(message.type)&&!message.content)errors.push('Enter a message.');
    if(message.content.length>1000)errors.push('Messages can contain up to 1000 characters.');
    if(containsUnsafeChatContent(message.content))errors.push('Remove private contact or location information before sending.');
    if(message.type==='study-link'&&!isAllowedStudyLink(message.linkUrl))errors.push('Enter a valid study link.');
    if(message.type==='study-goal')errors.push(...validateStudyGoalData(message.goalData,room).errors);
    return {valid:errors.length===0,errors};
  }
  function validateStudyRoomMessageCollection(messages){
    const errors=[],ids=new Set();
    (Array.isArray(messages)?messages:[]).forEach(message=>{
      const row=normalizeStudyRoomMessage(message);
      if(!row)errors.push('A room message is invalid.');
      else if(ids.has(row.messageId))errors.push('Room message IDs must be unique.');
      else ids.add(row.messageId);
      if(row&&row.linkUrl&&!isAllowedStudyLink(row.linkUrl))errors.push('A room message contains an invalid link.');
    });
    return {valid:errors.length===0,errors};
  }
  function loadStudyRoomMessages(){
    try{
      const raw=localStorage.getItem(MESSAGE_KEY);
      if(!raw)return [];
      const parsed=JSON.parse(raw),rows=Array.isArray(parsed)?parsed:parsed.messages;
      return Array.isArray(rows)?rows.map(normalizeStudyRoomMessage).filter(Boolean):[];
    }catch(error){console.error('Could not load study-room messages.',error);return []}
  }
  function saveStudyRoomMessages(messages){
    const normalized=(Array.isArray(messages)?messages:[]).map(normalizeStudyRoomMessage).filter(Boolean);
    const validation=validateStudyRoomMessageCollection(normalized);
    if(!validation.valid)return {success:false,error:validation.errors[0]};
    try{localStorage.setItem(MESSAGE_KEY,JSON.stringify({version:'1.0.0',messages:normalized}));return {success:true}}
    catch(error){return {success:false,error:'The room message could not be saved.'}}
  }
  function createJoinRequestId(){return 'join-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)}
  function normalizeJoinRequest(row={}){
    const now=new Date().toISOString(),status=JOIN_REQUEST_STATUSES.includes(row.status)?row.status:'pending';
    return {requestId:text(row.requestId||row.id)||createJoinRequestId(),roomId:text(row.roomId),userId:text(row.userId),status,requestedAt:row.requestedAt||now,respondedAt:row.respondedAt||null,updatedAt:row.updatedAt||row.respondedAt||row.requestedAt||now,prototypeOnly:true};
  }
  function loadStudyRoomJoinRequests(){
    try{
      const raw=localStorage.getItem(JOIN_REQUEST_KEY);
      if(!raw)return [];
      const parsed=JSON.parse(raw),rows=Array.isArray(parsed)?parsed:parsed.requests;
      return (Array.isArray(rows)?rows:[]).map(normalizeJoinRequest).filter(row=>row.roomId&&row.userId);
    }catch(error){console.error('Could not load study-room join requests.',error);return []}
  }
  function saveStudyRoomJoinRequests(rows){
    const seen=new Set(),normalized=(Array.isArray(rows)?rows:[]).map(normalizeJoinRequest).filter(row=>row.roomId&&row.userId).filter(row=>{const key=row.requestId;if(seen.has(key))return false;seen.add(key);return true});
    localStorage.setItem(JOIN_REQUEST_KEY,JSON.stringify({version:'1.0.0',requests:normalized}));
    return {success:true,requests:normalized};
  }
  function pendingJoinRequestsForRoom(roomId){return loadStudyRoomJoinRequests().filter(row=>row.roomId===roomId&&row.status==='pending')}
  function appendStudyRoomSystemMessage(roomId,content,senderUserId=current()?.id||'system'){
    const message=normalizeStudyRoomMessage({messageId:createStudyRoomMessageId(),roomId,senderUserId,type:'system',content,createdAt:new Date().toISOString(),status:'sent'});
    const saved=saveStudyRoomMessages([...loadStudyRoomMessages(),message]);
    if(saved.success&&typeof signalingService?.sendChatMessage==='function')signalingService.sendChatMessage(message);
    return saved.success?{success:true,message}:saved;
  }
  function isStudyRoomHost({room,userId}={}){return Boolean(room&&userId&&room.hostUserId===userId)}
  function isRoomUserMuted(room,userId){return Boolean((room?.mutedParticipants||[]).find(row=>row.userId===userId&&row.muted!==false))}
  function getMessagesForStudyRoom(roomId,{limit=50,offset=0}={}){
    return loadStudyRoomMessages().filter(message=>message.roomId===roomId).sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt)).slice(Math.max(0,offset),Math.max(0,offset)+limit);
  }
  function validateStudyRoomChatAccess({room,userId,allowCompletedRead=false}={}){
    const errors=[];
    if(!room){errors.push('Study room not found.');return {valid:false,errors}}
    if(!userId)errors.push('You must be signed in to use room chat.');
    if(room.status==='scheduled')errors.push('The room chat will open when the host opens the waiting room.');
    else if(room.status==='cancelled')errors.push('Room chat is not available.');
    else if(room.status==='completed'&&!allowCompletedRead)errors.push('Room chat is read-only because this study room is complete.');
    else if(!['waiting','active','completed'].includes(room.status))errors.push('Room chat is not available.');
    const isHost=room.hostUserId===userId,isParticipant=room.participantIds?.includes(userId);
    if(!isHost&&!isParticipant)errors.push('You do not have access to this room chat.');
    if((room.removedUserIds||[]).includes(userId))errors.push('You no longer have access to this room.');
    const interaction=userId?studyRoomBlockService.canSendMessage({senderUserId:userId,receiverUserId:room.hostUserId,room}):{allowed:true};
    if(!interaction.allowed)errors.push('Room chat is not available.');
    if(room.chatEnabled===false&&!isHost)errors.push('Room chat is currently turned off by the host.');
    if(!isHost&&isRoomUserMuted(room,userId))errors.push('You have been muted by the room host.');
    return {valid:errors.length===0,errors};
  }
  function chatRateLimitKey(roomId,userId){return `${roomId}:${userId}`}
  function checkChatRateLimit(roomId,userId){
    const key=chatRateLimitKey(roomId,userId),now=Date.now();
    callRuntime.chatRecentSends=callRuntime.chatRecentSends.filter(row=>now-row.time<10000);
    const count=callRuntime.chatRecentSends.filter(row=>row.key===key).length;
    if(count>=5)return false;
    callRuntime.chatRecentSends.push({key,time:now});
    return true;
  }
  function sendMessageThroughBackend(){return {success:false,error:'Study-room chat messages require a backend database and real-time connection for the full multi-user version.'}}
  function validateMessageMentions({room,content='',senderUserId}={}){
    const errors=[],body=text(content).toLowerCase();
    if(!room||!body||!senderUserId)return {valid:true,errors};
    (room.participantIds||[]).filter(id=>id!==senderUserId).forEach(id=>{
      const profile=publicStudentProfile(id),name=profile.name.toLowerCase();
      if((body.includes(`@${name}`)||body.includes(name))&&!studyRoomBlockService.canSendMessage({senderUserId,receiverUserId:id,room}).allowed)errors.push('Interaction unavailable.');
    });
    return {valid:errors.length===0,errors};
  }
  function sendStudyRoomMessage({roomId,type,content='',linkUrl=null,goalData=null,replyToMessageId=null,clientRequestId=null}={}){
    const currentUser=current();
    if(!currentUser)return {success:false,error:'You must be signed in to send a room message.'};
    const room=getStudyRoomById(roomId),access=validateStudyRoomChatAccess({room,userId:currentUser.id});
    if(!access.valid)return {success:false,error:access.errors[0]};
    if(room.chatEnabled===false)return {success:false,error:'Room chat is currently turned off by the host.'};
    const normalized=normalizeStudyRoomMessageInput({type,content,linkUrl,goalData,replyToMessageId,clientRequestId});
    const validation=validateNewStudyRoomMessage({...normalized,roomId},room);
    if(!validation.valid)return {success:false,error:validation.errors[0]};
    const mentionCheck=validateMessageMentions({room,content:normalized.content,senderUserId:currentUser.id});
    if(!mentionCheck.valid)return {success:false,error:mentionCheck.errors[0]};
    if(!checkChatRateLimit(roomId,currentUser.id))return {success:false,error:'You are sending messages too quickly.'};
    const messages=loadStudyRoomMessages();
    if(normalized.clientRequestId&&messages.some(message=>message.clientRequestId===normalized.clientRequestId&&message.roomId===roomId&&message.senderUserId===currentUser.id))return {success:true,message:messages.find(message=>message.clientRequestId===normalized.clientRequestId),duplicate:true,localPrototype:true};
    const now=new Date().toISOString(),message={messageId:createStudyRoomMessageId(),roomId:room.roomId,senderUserId:currentUser.id,type:normalized.type,content:normalized.content,linkUrl:normalized.linkUrl,goalData:normalized.goalData?{goalId:normalized.goalData.goalId||createStudyGoalId(),title:text(normalized.goalData.title||normalized.content),details:text(normalized.goalData.details),targetMinutes:Number(normalized.goalData.targetMinutes)||null,assignedUserId:normalized.goalData.assignedUserId||null,completed:false}:null,replyToMessageId:normalized.replyToMessageId,clientRequestId:normalized.clientRequestId,createdAt:now,editedAt:null,deletedAt:null,status:studyRoomChatMode.backendConnected?'sending':'sent',prototypeOnly:!studyRoomChatMode.backendConnected};
    if(studyRoomChatMode.backendConnected)return sendMessageThroughBackend(message);
    const saved=saveStudyRoomMessages([...messages,message]);
    if(!saved.success)return saved;
    return {success:true,message,localPrototype:true};
  }
  function sendStudyRoomTextMessage({roomId,content,clientRequestId}={}){return sendStudyRoomMessage({roomId,type:'text',content,clientRequestId})}
  function sendStudyRoomQuestion({roomId,content}={}){return sendStudyRoomMessage({roomId,type:'question',content})}
  function sendStudyRoomLink({roomId,content,linkUrl}={}){return sendStudyRoomMessage({roomId,type:'study-link',content,linkUrl})}
  function sendStudyRoomEmoji({roomId,content}={}){return sendStudyRoomMessage({roomId,type:'emoji',content})}
  function sendStudyRoomGoal({roomId,goalData}={}){return sendStudyRoomMessage({roomId,type:'study-goal',content:goalData?.title||'',goalData})}
  function editStudyRoomMessage({messageId,content}={}){
    const currentUser=current(),messages=loadStudyRoomMessages(),index=messages.findIndex(message=>message.messageId===messageId);
    if(index<0)return {success:false,error:'Room message not found.'};
    const message=messages[index],room=getStudyRoomById(message.roomId);
    if(message.senderUserId!==currentUser?.id)return {success:false,error:'You can edit only your own messages.'};
    if(!['text','question'].includes(message.type))return {success:false,error:'Only text and question messages can be edited.'};
    if(Date.now()-new Date(message.createdAt).getTime()>15*60000)return {success:false,error:'Message editing is limited.'};
    const normalized=normalizeStudyRoomMessageInput({type:message.type,content});
    const validation=validateNewStudyRoomMessage({...normalized,roomId:message.roomId},room);
    if(!validation.valid)return {success:false,error:validation.errors[0]};
    messages[index]={...message,content:normalized.content,editedAt:new Date().toISOString()};
    const saved=saveStudyRoomMessages(messages);
    return saved.success?{success:true,message:messages[index]}:saved;
  }
  function deleteStudyRoomMessage(messageId){
    const currentUser=current(),messages=loadStudyRoomMessages(),index=messages.findIndex(message=>message.messageId===messageId);
    if(index<0)return {success:false,error:'Room message not found.'};
    const message=messages[index];
    if(message.type==='system')return {success:false,error:'System messages cannot be deleted.'};
    if(message.senderUserId!==currentUser?.id)return {success:false,error:'You can delete only your own messages.'};
    messages[index]={...message,content:'Message deleted.',linkUrl:null,goalData:null,deletedAt:new Date().toISOString(),status:'deleted'};
    const saved=saveStudyRoomMessages(messages);
    return saved.success?{success:true,message:messages[index]}:saved;
  }
  function completeStudyRoomGoalMessage(messageId){
    const currentUser=current(),messages=loadStudyRoomMessages(),index=messages.findIndex(message=>message.messageId===messageId);
    if(index<0)return {success:false,error:'Room message not found.'};
    const message=messages[index],assigned=message.goalData?.assignedUserId;
    if(message.type!=='study-goal')return {success:false,error:'This message is not a study goal.'};
    if(message.senderUserId!==currentUser?.id&&assigned!==currentUser?.id)return {success:false,error:'You cannot complete this study goal.'};
    messages[index]={...message,goalData:{...message.goalData,completed:true,completedAt:new Date().toISOString(),completedByUserId:currentUser.id},editedAt:new Date().toISOString()};
    const saved=saveStudyRoomMessages(messages);
    return saved.success?{success:true,message:messages[index]}:saved;
  }
  function clearLocalRoomMessages(roomId){
    const messages=loadStudyRoomMessages().filter(message=>message.roomId!==roomId),saved=saveStudyRoomMessages(messages);
    return saved.success?{success:true}:saved;
  }
  function subscribeToStudyRoomMessages(roomId,callback){
    return {success:false,error:'Live chat subscriptions require a backend database and real-time connection.',unsubscribe(){callback&&callback(getMessagesForStudyRoom(roomId))}};
  }
  const studyRoomChatService={loadMessages:loadStudyRoomMessages,saveMessages:saveStudyRoomMessages,sendText:sendStudyRoomTextMessage,sendQuestion:sendStudyRoomQuestion,sendStudyLink:sendStudyRoomLink,sendEmoji:sendStudyRoomEmoji,sendStudyGoal:sendStudyRoomGoal,deleteMessage:deleteStudyRoomMessage,editMessage:editStudyRoomMessage,completeGoal:completeStudyRoomGoalMessage,clearLocalRoomMessages,getRoomMessages:getMessagesForStudyRoom,subscribe:subscribeToStudyRoomMessages,validateAccess:validateStudyRoomChatAccess,mode:studyRoomChatMode};

  function createSafetyId(prefix){
    if(window.crypto&&typeof window.crypto.randomUUID==='function')return `${prefix}-${window.crypto.randomUUID()}`;
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
  }
  function stripUnsafeNameParts(value){
    return text(value).replace(/<[^>]*>/g,' ').replace(/[^\w\s'.-]/g,' ').replace(/\s+/g,' ').trim();
  }
  function looksLikeContactInfo(value){return privateInfo(value)||/@|https?:|www\.|\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/i.test(String(value||''))}
  function validateDisplayName(value,{verified=false}={}){
    const displayName=stripUnsafeNameParts(value);
    const errors=[];
    if(displayName.length<2||displayName.length>30)errors.push('Display name must be between 2 and 30 characters.');
    if(looksLikeContactInfo(displayName))errors.push('Display name cannot include contact information or exact locations.');
    if(/script|<|>|official\s+admin|administrator|studyspark\s+staff/i.test(String(value||''))&&!verified)errors.push('Display name cannot impersonate StudySpark staff.');
    return {valid:errors.length===0,errors,displayName};
  }
  function loadDisplayNameRecords(){try{return JSON.parse(localStorage.getItem(DISPLAY_NAME_KEY)||'[]')}catch{return []}}
  function saveDisplayNameRecord(record){
    const validation=validateDisplayName(record?.displayName,{verified:record?.verified===true});
    if(!record?.userId||!validation.valid)return {success:false,error:validation.errors[0]||'Display name could not be saved.'};
    const rows=loadDisplayNameRecords().filter(row=>row.userId!==record.userId);
    const next={userId:text(record.userId),displayName:validation.displayName,displayNameUpdatedAt:new Date().toISOString(),prototypeOnly:true};
    localStorage.setItem(DISPLAY_NAME_KEY,JSON.stringify([next,...rows]));
    return {success:true,record:next};
  }
  function getStoredDisplayName(userId){return loadDisplayNameRecords().find(row=>row.userId===userId)?.displayName||''}
  function safeDisplayNameForUser(userOrId){
    const person=typeof userOrId==='string'?(typeof getUserById==='function'?getUserById(userOrId):{id:userOrId}):userOrId;
    const userId=text(person?.id||userOrId);
    const stored=getStoredDisplayName(userId);
    if(stored)return stored;
    const candidate=person?.displayName||person?.preferredName||String(person?.name||'').split(/\s+/)[0]||'Study Member';
    const validation=validateDisplayName(candidate,{verified:person?.verified===true});
    return validation.valid?validation.displayName:'Study Member';
  }
  function safeProfileInitials(name){
    const cleaned=stripUnsafeNameParts(name)||'S';
    return cleaned.split(/\s+/).map(part=>part[0]).join('').slice(0,2).toUpperCase()||'S';
  }
  function sanitizePublicProfile(userOrId){
    const person=typeof userOrId==='string'?(typeof getUserById==='function'?getUserById(userOrId):{id:userOrId}):userOrId;
    const id=text(person?.id||userOrId);
    const displayName=safeDisplayNameForUser(person||id);
    return {id,name:displayName,displayName,profilePhoto:'',initials:safeProfileInitials(displayName),prototypeOnly:true};
  }
  function normalizeBlockRecord(row={}){
    const now=new Date().toISOString();
    return {blockId:text(row.blockId||row.id)||createSafetyId('block'),blockedByUserId:text(row.blockedByUserId||row.blockedBy),blockedUserId:text(row.blockedUserId||row.blockedUser),roomId:text(row.roomId),reasonCategory:row.reasonCategory?text(row.reasonCategory):null,createdAt:row.createdAt||now,status:row.status==='removed'?'removed':'active',prototypeOnly:true};
  }
  function loadUserBlocks(){
    try{
      const rows=JSON.parse(localStorage.getItem(USER_BLOCKS_KEY)||'[]');
      return (Array.isArray(rows)?rows:[]).map(normalizeBlockRecord).filter(row=>row.blockedByUserId&&row.blockedUserId);
    }catch{return []}
  }
  function saveUserBlocks(rows){
    const normalized=(Array.isArray(rows)?rows:[]).map(normalizeBlockRecord).filter(row=>row.blockedByUserId&&row.blockedUserId);
    localStorage.setItem(USER_BLOCKS_KEY,JSON.stringify(normalized));
    return {success:true,blocks:normalized};
  }
  function getBlockState({viewerUserId=current()?.id,targetUserId,roomId=''}={}){
    const rows=loadUserBlocks().filter(row=>row.status==='active');
    const blocksTarget=rows.find(row=>row.blockedByUserId===viewerUserId&&row.blockedUserId===targetUserId&&(!roomId||!row.roomId||row.roomId===roomId));
    const blockedByTarget=rows.find(row=>row.blockedByUserId===targetUserId&&row.blockedUserId===viewerUserId&&(!roomId||!row.roomId||row.roomId===roomId));
    return {blocked:Boolean(blocksTarget||blockedByTarget),blocksTarget:Boolean(blocksTarget),blockedByTarget:Boolean(blockedByTarget),record:blocksTarget||blockedByTarget||null};
  }
  function blockUser({blockedUserId,roomId='',reasonCategory=null}={}){
    const u=current();
    if(!u||!blockedUserId||blockedUserId===u.id)return {success:false,error:'The selected user could not be blocked.'};
    const rows=loadUserBlocks();
    if(!rows.some(row=>row.blockedByUserId===u.id&&row.blockedUserId===blockedUserId&&row.status==='active'))rows.unshift(normalizeBlockRecord({blockedByUserId:u.id,blockedUserId,roomId,reasonCategory}));
    saveUserBlocks(rows);
    if(typeof removeFriend==='function')removeFriend(blockedUserId,{silent:true});
    return {success:true,blocks:rows};
  }
  function unblockUser({blockedUserId}={}){
    const u=current();
    if(!u||!blockedUserId)return {success:false,error:'The selected user could not be unblocked.'};
    return saveUserBlocks(loadUserBlocks().map(row=>row.blockedByUserId===u.id&&row.blockedUserId===blockedUserId?{...row,status:'removed'}:row));
  }
  function normalizeReportCategory(value){
    const raw=text(value).toLowerCase().trim();
    const map={'unsafe behavior':'unsafe-behaviour','unsafe behaviour':'unsafe-behaviour','inappropriate content':'inappropriate-content','private contact information':'other','misleading room information':'other'};
    if(REPORT_CATEGORY_VALUES.includes(raw))return raw;
    return map[raw]||'';
  }
  function reportCategoryOptionsHTML(selected=''){
    const normalized=normalizeReportCategory(selected)||'harassment';
    return REPORT_CATEGORY_OPTIONS.map(row=>`<option value="${safe(row.value)}" ${row.value===normalized?'selected':''}>${safe(row.label)}</option>`).join('');
  }
  function normalizeSafetyReport(row={}){
    const now=new Date().toISOString();
    const reportType=['room','user','message','link','content'].includes(row.reportType)?row.reportType:'room';
    const category=normalizeReportCategory(row.category||row.reason)||'other';
    const description=text(row.description||row.notes).slice(0,1000);
    return {reportId:text(row.reportId||row.id)||createSafetyId('safety-report'),reportType,reporterUserId:text(row.reporterUserId||row.reportedByUserId||row.reportedBy),reportedUserId:text(row.reportedUserId),roomId:text(row.roomId),messageId:text(row.messageId)||null,linkUrl:text(row.linkUrl),contentId:text(row.contentId),category,description,status:row.status||'submitted-local',createdAt:row.createdAt||now,prototypeOnly:true};
  }
  function loadSafetyReports(){
    try{
      const rows=JSON.parse(localStorage.getItem(SAFETY_REPORT_KEY)||'[]');
      return (Array.isArray(rows)?rows:[]).map(normalizeSafetyReport).filter(row=>row.roomId||row.reportedUserId||row.messageId||row.linkUrl||row.contentId);
    }catch{return []}
  }
  function saveSafetyReports(rows){localStorage.setItem(SAFETY_REPORT_KEY,JSON.stringify((Array.isArray(rows)?rows:[]).map(normalizeSafetyReport)));return {success:true}}
  function validateReport(input={}){
    const errors=[],category=normalizeReportCategory(input.category||input.reason),description=text(input.description||input.notes);
    if(!input)errors.push('Report details are required.');
    if(!category)errors.push('Choose a valid report category.');
    if(description.length>1000)errors.push('Report description must be 1000 characters or fewer.');
    if(!(input.roomId||input.reportedUserId||input.messageId||input.linkUrl||input.contentId))errors.push('Choose something to report.');
    return {valid:errors.length===0,errors,category,description};
  }
  function saveReport(input={}){
    const u=current();
    if(!u)return {success:false,error:'You must be signed in to submit a report.'};
    const validation=validateReport(input);
    if(!validation.valid)return {success:false,error:validation.errors[0]};
    if(looksLikeContactInfo(validation.description))return {success:false,error:'Please remove private contact information before continuing.'};
    const report=normalizeSafetyReport({...input,category:validation.category,description:validation.description,reporterUserId:u.id,status:'submitted-local'});
    const rows=loadSafetyReports();
    const duplicate=rows.some(row=>row.reportType===report.reportType&&row.roomId===report.roomId&&row.messageId===report.messageId&&row.linkUrl===report.linkUrl&&row.reportedUserId===report.reportedUserId&&row.reporterUserId===u.id&&row.category===report.category&&Date.now()-new Date(row.createdAt).getTime()<86400000);
    if(duplicate)return {success:false,error:'A matching report was already submitted locally.'};
    saveSafetyReports([report,...rows]);
    return {success:true,report,message:'Report saved locally for prototype testing.'};
  }
  function getReportState(filter={}){
    const rows=loadSafetyReports();
    return {reports:rows.filter(row=>(!filter.roomId||row.roomId===filter.roomId)&&(!filter.messageId||row.messageId===filter.messageId)&&(!filter.reportedUserId||row.reportedUserId===filter.reportedUserId)),status:'local-only'};
  }
  function blockCheckResult(blocked,error='Interaction unavailable.'){
    return blocked?{allowed:false,success:false,error}:{allowed:true,success:true};
  }
  function isBlocked({userIdA,userIdB,roomId=''}={}){
    if(!userIdA||!userIdB||userIdA===userIdB)return false;
    if(typeof areUsersBlocked==='function'&&areUsersBlocked({userIdA,userIdB}))return true;
    return getBlockState({viewerUserId:userIdA,targetUserId:userIdB,roomId}).blocked;
  }
  function canInteract({senderUserId,receiverUserId,room=null,roomId=''}={}){
    return blockCheckResult(isBlocked({userIdA:senderUserId,userIdB:receiverUserId,roomId:room?.roomId||roomId}),'Interaction unavailable.');
  }
  function canInvite({senderUserId,receiverUserId,room=null}={}){
    return blockCheckResult(isBlocked({userIdA:senderUserId,userIdB:receiverUserId,roomId:room?.roomId}),'Blocked user cannot be invited.');
  }
  function canSearch({viewerUserId,targetUserId}={}){
    return blockCheckResult(isBlocked({userIdA:viewerUserId,userIdB:targetUserId}),'Interaction unavailable.');
  }
  function canJoinRoom({userId,room}={}){
    return blockCheckResult(isBlocked({userIdA:room?.hostUserId,userIdB:userId,roomId:room?.roomId}),'Blocked user cannot join this room.');
  }
  function canSendFriendRequest({senderUserId,receiverUserId}={}){
    return blockCheckResult(isBlocked({userIdA:senderUserId,userIdB:receiverUserId}),'You cannot send a friend request.');
  }
  function canSendMessage({senderUserId,receiverUserId,room=null}={}){
    return blockCheckResult(isBlocked({userIdA:senderUserId,userIdB:receiverUserId,roomId:room?.roomId}),'Interaction unavailable.');
  }
  function filterBlockedUsers(users=[],{viewerUserId=current()?.id,idKey='id'}={}){
    return (Array.isArray(users)?users:[]).filter(row=>{
      const id=text(typeof idKey==='function'?idKey(row):row?.[idKey]||row?.userId||row?.friendUserId||row?.id);
      return id&&!isBlocked({userIdA:viewerUserId,userIdB:id});
    });
  }
  const studyRoomBlockService={blockUser,unblockUser,isBlocked,canInteract,canInvite,canSearch,canJoinRoom,canSendFriendRequest,canSendMessage,filterBlockedUsers,loadBlocks:loadUserBlocks};
  const studyRoomReportService={
    reportUser:input=>saveReport({...input,reportType:'user'}),
    reportRoom:input=>saveReport({...input,reportType:'room'}),
    reportMessage:input=>saveReport({...input,reportType:'message'}),
    reportLink:input=>saveReport({...input,reportType:'link'}),
    validateReport,
    saveReport,
    loadReports:loadSafetyReports
  };
  function loadRoomCodeAttempts(){
    try{return JSON.parse(localStorage.getItem(ROOM_CODE_ATTEMPT_KEY)||'{}')}catch{return {}}
  }
  function saveRoomCodeAttempts(data){localStorage.setItem(ROOM_CODE_ATTEMPT_KEY,JSON.stringify(data&&typeof data==='object'?data:{}))}
  function validateRoomCode({code,roomId='',userId=current()?.id}={}){
    const key=`${userId||'anonymous'}:${roomId||normalizeRoomCode(code)}`,now=Date.now(),attempts=loadRoomCodeAttempts();
    const recent=(attempts[key]||[]).filter(time=>now-time<600000);
    if(recent.length>=5){attempts[key]=recent;saveRoomCodeAttempts(attempts);return {valid:false,errors:['Too many room-code attempts. Try again later.']}}
    const normalized=normalizeRoomCode(code);
    if(!normalized){recent.push(now);attempts[key]=recent;saveRoomCodeAttempts(attempts);return {valid:false,errors:['Enter a valid room code.']}}
    attempts[key]=recent;saveRoomCodeAttempts(attempts);
    return {valid:true,errors:[],roomCode:normalized};
  }
  function validateRoomPrivacy(room){
    const errors=[];
    const privacy=normalizeRoomPrivacy(room?.privacy);
    if(!PRIVACY.includes(privacy))errors.push('Choose a valid study-room privacy option.');
    if(privacy==='verified-school-only'&&!room?.schoolVerificationRequired)errors.push('School verification must be enabled for verified-school-only rooms.');
    return {valid:errors.length===0,errors,privacy};
  }
  function validateRoomAccess({room,userId=current()?.id,roomCode='',password=''}={}){
    const errors=[];
    if(!room){errors.push('Study room not found.');return {valid:false,errors}}
    if(!userId)errors.push('You must be signed in to access this study room.');
    if(['cancelled','completed'].includes(room.status))errors.push('This study room is no longer available.');
    const isHost=room.hostUserId===userId,isParticipant=(room.participantIds||[]).includes(userId),isInvited=(room.invitedUserIds||[]).includes(userId);
    if((room.removedUserIds||[]).includes(userId))errors.push('You no longer have access to this study room.');
    const blockAccess=studyRoomBlockService.canJoinRoom({userId,room});
    if(userId&&!blockAccess.allowed)errors.push(blockAccess.error);
    if(room.isLocked&&!isHost&&!isParticipant)errors.push('This study room is locked. Ask the host to approve your join request.');
    if((room.participantIds||[]).length>=room.maximumMembers&&!isHost&&!isParticipant)errors.push('This study room is full.');
    if(room.requiresRoomCode&&roomCode){
      const codeCheck=validateRoomCode({code:roomCode,roomId:room.roomId,userId});
      if(!codeCheck.valid)errors.push(codeCheck.errors[0]);
      else if(codeCheck.roomCode!==room.roomCode)errors.push('Room code does not match this study room.');
    }
    if(room.requiresPassword&&password)errors.push('Room passwords are prototype-only and must be hashed and verified on a secure backend in production.');
    const privacy=normalizeRoomPrivacy(room.privacy);
    if(!isHost&&!isParticipant&&!isInvited){
      if(privacy==='private'||privacy==='invite-only')errors.push('You need an invitation to access this private study room.');
      if(privacy==='friends-only'&&!(typeof areUsersFriends==='function'&&areUsersFriends({userIdA:userId,userIdB:room.hostUserId})))errors.push('Only accepted friends can request to join this room.');
      if(privacy==='verified-school-only')errors.push('School verification requires a secure backend before joining.');
    }
    return {valid:errors.length===0,errors};
  }
  function validateInvitation({room,senderUserId,recipientUserId,invitations=[]}={}){
    const errors=[];
    if(!room)errors.push('Study room not found.');
    if(!senderUserId||senderUserId!==room?.hostUserId)errors.push('Only the room host can send invitations.');
    if(!recipientUserId||recipientUserId===senderUserId)errors.push('Choose a valid friend to invite.');
    if(room?.friendInvitationsOnly!==false&&typeof areUsersFriends==='function'&&!areUsersFriends({userIdA:senderUserId,userIdB:recipientUserId}))errors.push('Only accepted friends can be invited.');
    const inviteBlock=studyRoomBlockService.canInvite({senderUserId,receiverUserId:recipientUserId,room});
    if(!inviteBlock.allowed)errors.push(inviteBlock.error);
    if((room?.participantIds||[]).includes(recipientUserId))errors.push('One or more selected friends already joined this room.');
    if((room?.removedUserIds||[]).includes(recipientUserId))errors.push('One or more selected users cannot be invited.');
    if((invitations||[]).some(invitation=>invitation.roomId===room?.roomId&&invitation.toUserId===recipientUserId&&invitation.status==='pending'))errors.push('This friend already has a pending invitation.');
    return {valid:errors.length===0,errors};
  }
  function canShareContactInformation(){return false}
  function canActivateMedia({room,userId=current()?.id,type='camera'}={}){
    if(type==='camera'&&room&&!room.cameraAllowed)return {valid:false,errors:['Camera is not available in this room.']};
    if(type==='microphone'&&room&&!room.microphoneAllowed)return {valid:false,errors:['Microphone is not available in this room.']};
    if(type==='microphone'&&room&&isRoomUserMuted(room,userId))return {valid:false,errors:['You have been muted by the room host.']};
    return {valid:true,errors:[]};
  }
  function canStartScreenShare({room,userId=current()?.id}={}){
    if(room&&room.screenSharingAllowed===false)return {valid:false,errors:['Screen sharing is not available in this room.']};
    return validateStudyRoomScreenShareAccess({room,userId});
  }
  function canRecordSession(){return {valid:false,errors:['StudySpark does not record study-room audio, video or screen sharing by default.']}}
  function getSafetyWarnings(room){
    const warnings=['Camera, microphone and screen sharing never activate automatically.','StudySpark does not record study-room audio, video or screen sharing by default.'];
    if(normalizeRoomPrivacy(room?.privacy)==='verified-school-only')warnings.push('School verification must be confirmed through a secure backend.');
    warnings.push('Real deployment requires authenticated backend permissions, moderation tools and secure reporting.');
    return warnings;
  }
  const studyRoomSafetyService={getSafeDisplayName:safeDisplayNameForUser,validateDisplayName,saveDisplayName:saveDisplayNameRecord,validateRoomPrivacy,validateRoomAccess,validateInvitation,validateRoomCode,blockUser,unblockUser,reportUser:studyRoomReportService.reportUser,reportRoom:studyRoomReportService.reportRoom,reportMessage:studyRoomReportService.reportMessage,reportLink:studyRoomReportService.reportLink,getBlockState,getReportState,sanitizePublicProfile,canShareContactInformation,canActivateMedia,canStartScreenShare,canRecordSession,getSafetyWarnings,loadBlocks:loadUserBlocks,loadReports:loadSafetyReports,privacyLabel,blockService:studyRoomBlockService,reportService:studyRoomReportService};

  const studyRoomSharedGoalsMode={mode:'local-prototype',backendConnected:false};

  function createSharedGoalId(){return 'room-goal-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)}
  function createSharedTaskId(){return 'room-task-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)}
  function normalizeSharedGoal(input={}){
    const now=new Date().toISOString();
    const roomId=text(input.roomId);
    return {goalId:text(input.goalId)||createSharedGoalId(),roomId,title:text(input.title).slice(0,120)||"Today's Goal",createdByUserId:text(input.createdByUserId),createdAt:input.createdAt||now,updatedAt:input.updatedAt||input.createdAt||now,prototypeOnly:true};
  }
  function normalizeSharedTask(input={}){
    const now=new Date().toISOString();
    return {taskId:text(input.taskId)||createSharedTaskId(),goalId:text(input.goalId),roomId:text(input.roomId),title:text(input.title).slice(0,150),description:text(input.description).slice(0,500),completed:input.completed===true,completedByUserId:input.completed?text(input.completedByUserId):null,completedAt:input.completed?input.completedAt||now:null,order:Number.isFinite(Number(input.order))?Number(input.order):1,createdAt:input.createdAt||now,updatedAt:input.updatedAt||input.createdAt||now,prototypeOnly:true};
  }
  function validateSharedGoal(goal){
    const errors=[];
    if(!goal||!goal.roomId)errors.push('Study room not found.');
    if(!goal?.title||goal.title.length>120)errors.push('Goal title must be between 1 and 120 characters.');
    if(privateInfo(goal?.title))errors.push('Do not include private information in shared goal titles.');
    return {valid:errors.length===0,errors};
  }
  function validateSharedTask(task){
    const errors=[];
    if(!task||!task.roomId||!task.goalId)errors.push('Shared goal not found.');
    if(!task?.title||task.title.length>150)errors.push('Task title must be between 1 and 150 characters.');
    if(task?.description&&task.description.length>500)errors.push('Task description must be 500 characters or fewer.');
    if(privateInfo([task?.title,task?.description].join(' ')))errors.push('Do not include private information in shared tasks.');
    return {valid:errors.length===0,errors};
  }
  function defaultSharedGoal(roomId){
    const room=getStudyRoomById(roomId);
    return {goal:normalizeSharedGoal({roomId,title:"Today's Goal",createdByUserId:room?.hostUserId||current()?.id||''}),tasks:[]};
  }
  function normalizeSharedGoalRecord(record={}){
    const goal=normalizeSharedGoal(record.goal||record);
    const tasks=(Array.isArray(record.tasks)?record.tasks:[]).map(task=>normalizeSharedTask({...task,goalId:goal.goalId,roomId:goal.roomId})).filter(task=>validateSharedTask(task).valid).sort((a,b)=>a.order-b.order).map((task,index)=>({...task,order:index+1}));
    return {goal,tasks};
  }
  function loadAllStudyRoomGoals(){
    try{
      const parsed=JSON.parse(localStorage.getItem(GOAL_KEY)||'{}');
      return parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:{};
    }catch(error){console.error('Could not load study-room goals.',error);return {}}
  }
  function saveAllStudyRoomGoals(data){
    try{localStorage.setItem(GOAL_KEY,JSON.stringify({version:'1.0.0',rooms:data}));return {success:true}}
    catch(error){return {success:false,error:'The shared goals could not be saved.'}}
  }
  function unpackStudyRoomGoalStore(raw){
    if(raw?.rooms&&typeof raw.rooms==='object')return raw.rooms;
    if(raw&&typeof raw==='object'&&!Array.isArray(raw))return raw;
    return {};
  }
  function loadStudyRoomGoal(roomId){
    const parsed=loadAllStudyRoomGoals(),rooms=unpackStudyRoomGoalStore(parsed),record=rooms[roomId];
    return record?normalizeSharedGoalRecord(record):defaultSharedGoal(roomId);
  }
  function saveStudyRoomGoal(roomId,record){
    const normalized=normalizeSharedGoalRecord(record),goalValidation=validateSharedGoal(normalized.goal);
    if(!goalValidation.valid)return {success:false,error:goalValidation.errors[0]};
    const taskError=normalized.tasks.map(validateSharedTask).find(result=>!result.valid);
    if(taskError)return {success:false,error:taskError.errors[0]};
    const parsed=loadAllStudyRoomGoals(),rooms=unpackStudyRoomGoalStore(parsed);
    rooms[roomId]=normalized;
    const saved=saveAllStudyRoomGoals(rooms);
    return saved.success?{success:true,goal:normalized.goal,tasks:normalized.tasks}:saved;
  }
  function validateSharedGoalAccess(roomId,{hostOnly=false}={}){
    const room=getStudyRoomById(roomId),u=current();
    if(!room)return {success:false,error:'Study room not found.'};
    if(!u)return {success:false,error:'You must be signed in to use shared goals.'};
    const access=validateStudyRoomLobbyAccess({room,userId:u.id});
    if(!access.valid)return {success:false,error:access.errors[0]};
    if(hostOnly&&room.hostUserId!==u.id)return {success:false,error:'Only the room host can manage shared goals and tasks.'};
    return {success:true,room,user:u,isHost:room.hostUserId===u.id};
  }
  function sharedGoalSignal(type,roomId,extra={}){
    const payload={type,roomId,updatedAt:new Date().toISOString(),...extra};
    const method={['goal-created']:'sendGoalCreated',['task-added']:'sendTaskAdded',['task-updated']:'sendTaskUpdated',['task-completed']:'sendTaskCompleted',['task-deleted']:'sendTaskDeleted',['goal-updated']:'sendGoalUpdated'}[type];
    if(method&&typeof signalingService?.[method]==='function')signalingService[method](payload);
    return payload;
  }
  function calculateSharedGoalProgress(record){
    const tasks=record?.tasks||[],total=tasks.length,completed=tasks.filter(task=>task.completed).length,remaining=Math.max(0,total-completed),percentage=total?Math.round((completed/total)*100):0;
    return {completed,total,remaining,percentage,label:`${completed} of ${total} Tasks Completed`};
  }
  const studyRoomGoalService={
    mode:studyRoomSharedGoalsMode,
    load:loadStudyRoomGoal,
    save({roomId,record}={}){return saveStudyRoomGoal(roomId,record)},
    createGoal({roomId,title="Today's Goal"}={}){
      const access=validateSharedGoalAccess(roomId,{hostOnly:true});
      if(!access.success)return access;
      const goal=normalizeSharedGoal({roomId,title,createdByUserId:access.user.id}),validation=validateSharedGoal(goal);
      if(!validation.valid)return {success:false,error:validation.errors[0]};
      const result=saveStudyRoomGoal(roomId,{goal,tasks:[]});
      if(result.success)sharedGoalSignal('goal-created',roomId,{goalId:goal.goalId});
      return result;
    },
    renameGoal({roomId,title}={}){
      const access=validateSharedGoalAccess(roomId,{hostOnly:true});
      if(!access.success)return access;
      const record=loadStudyRoomGoal(roomId),goal=normalizeSharedGoal({...record.goal,title,updatedAt:new Date().toISOString()}),validation=validateSharedGoal(goal);
      if(!validation.valid)return {success:false,error:validation.errors[0]};
      const result=saveStudyRoomGoal(roomId,{goal,tasks:record.tasks});
      if(result.success)sharedGoalSignal('goal-updated',roomId,{goalId:goal.goalId});
      return result;
    },
    deleteGoal({roomId}={}){
      const access=validateSharedGoalAccess(roomId,{hostOnly:true});
      if(!access.success)return access;
      const parsed=loadAllStudyRoomGoals(),rooms=unpackStudyRoomGoalStore(parsed);
      delete rooms[roomId];
      const result=saveAllStudyRoomGoals(rooms);
      if(result.success)sharedGoalSignal('goal-updated',roomId,{deleted:true});
      return result.success?{success:true,record:defaultSharedGoal(roomId)}:result;
    },
    addTask({roomId,title,description=''}={}){
      const access=validateSharedGoalAccess(roomId,{hostOnly:true});
      if(!access.success)return access;
      let record=loadStudyRoomGoal(roomId);
      if(!record.goal.createdByUserId)record={...record,goal:{...record.goal,createdByUserId:access.user.id}};
      const task=normalizeSharedTask({roomId,goalId:record.goal.goalId,title,description,order:record.tasks.length+1}),validation=validateSharedTask(task);
      if(!validation.valid)return {success:false,error:validation.errors[0]};
      const result=saveStudyRoomGoal(roomId,{goal:{...record.goal,updatedAt:new Date().toISOString()},tasks:[...record.tasks,task]});
      if(result.success)sharedGoalSignal('task-added',roomId,{taskId:task.taskId});
      return result.success?{...result,task}:result;
    },
    editTask({roomId,taskId,title,description=''}={}){
      const access=validateSharedGoalAccess(roomId,{hostOnly:true});
      if(!access.success)return access;
      const record=loadStudyRoomGoal(roomId),index=record.tasks.findIndex(task=>task.taskId===taskId);
      if(index<0)return {success:false,error:'Task not found.'};
      const task=normalizeSharedTask({...record.tasks[index],title,description,updatedAt:new Date().toISOString()}),validation=validateSharedTask(task);
      if(!validation.valid)return {success:false,error:validation.errors[0]};
      const tasks=record.tasks.map(item=>item.taskId===taskId?task:item);
      const result=saveStudyRoomGoal(roomId,{goal:{...record.goal,updatedAt:new Date().toISOString()},tasks});
      if(result.success)sharedGoalSignal('task-updated',roomId,{taskId});
      return result.success?{...result,task}:result;
    },
    deleteTask({roomId,taskId}={}){
      const access=validateSharedGoalAccess(roomId,{hostOnly:true});
      if(!access.success)return access;
      const record=loadStudyRoomGoal(roomId);
      if(!record.tasks.some(task=>task.taskId===taskId))return {success:false,error:'Task not found.'};
      const tasks=record.tasks.filter(task=>task.taskId!==taskId).map((task,index)=>({...task,order:index+1,updatedAt:new Date().toISOString()}));
      const result=saveStudyRoomGoal(roomId,{goal:{...record.goal,updatedAt:new Date().toISOString()},tasks});
      if(result.success)sharedGoalSignal('task-deleted',roomId,{taskId});
      return result;
    },
    toggleTask({roomId,taskId,completed}={}){
      const access=validateSharedGoalAccess(roomId);
      if(!access.success)return access;
      const record=loadStudyRoomGoal(roomId),index=record.tasks.findIndex(task=>task.taskId===taskId);
      if(index<0)return {success:false,error:'Task not found.'};
      const now=new Date().toISOString(),tasks=record.tasks.map(task=>task.taskId===taskId?{...task,completed:completed!==undefined?Boolean(completed):!task.completed,completedByUserId:(completed!==undefined?Boolean(completed):!task.completed)?access.user.id:null,completedAt:(completed!==undefined?Boolean(completed):!task.completed)?now:null,updatedAt:now}:task);
      const result=saveStudyRoomGoal(roomId,{goal:{...record.goal,updatedAt:now},tasks});
      if(result.success)sharedGoalSignal(tasks[index]?.completed?'task-completed':'task-updated',roomId,{taskId,completed:tasks[index]?.completed});
      return result;
    },
    moveTask({roomId,taskId,direction='up'}={}){
      const access=validateSharedGoalAccess(roomId,{hostOnly:true});
      if(!access.success)return access;
      const record=loadStudyRoomGoal(roomId),tasks=[...record.tasks].sort((a,b)=>a.order-b.order),index=tasks.findIndex(task=>task.taskId===taskId),delta=direction==='down'?1:-1,next=index+delta;
      if(index<0)return {success:false,error:'Task not found.'};
      if(next<0||next>=tasks.length)return {success:true,goal:record.goal,tasks};
      [tasks[index],tasks[next]]=[tasks[next],tasks[index]];
      const reordered=tasks.map((task,i)=>({...task,order:i+1,updatedAt:new Date().toISOString()}));
      const result=saveStudyRoomGoal(roomId,{goal:{...record.goal,updatedAt:new Date().toISOString()},tasks:reordered});
      if(result.success)sharedGoalSignal('task-updated',roomId,{taskId,order:next+1});
      return result;
    },
    calculateProgress:calculateSharedGoalProgress,
    cleanup(){return {success:true}},
    sync({roomId}={}){return {success:false,error:'Group task synchronization requires the real-time backend in the full version.',record:loadStudyRoomGoal(roomId)}}
  };

  const studyRoomAIMode={mode:'rule-based-prototype',backendConnected:false};

  function createRoomAIRequestId(){return 'room-ai-request-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)}
  function createRoomAIResponseId(){return 'room-ai-response-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)}
  function createRoomAIStepId(){return 'ai-step-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)}
  function normalizeAIMode(mode){return AI_MODES.includes(mode)?mode:'study-order'}
  function normalizeAIConsent(input={}){
    return {roomId:text(input.roomId),userId:text(input.userId),allowSharedLearningData:input.allowSharedLearningData===true,explainPreference:['yes','sometimes','no'].includes(text(input.explainPreference).toLowerCase())?text(input.explainPreference).toLowerCase():'sometimes',updatedAt:input.updatedAt||new Date().toISOString(),prototypeOnly:true};
  }
  function loadAIConsentRows(){
    try{const parsed=JSON.parse(localStorage.getItem(AI_CONSENT_KEY)||'[]');return (Array.isArray(parsed)?parsed:parsed.rows||[]).map(normalizeAIConsent).filter(row=>row.roomId&&row.userId)}
    catch{return []}
  }
  function saveAIConsentRows(rows){
    try{localStorage.setItem(AI_CONSENT_KEY,JSON.stringify({version:'1.0.0',rows:(Array.isArray(rows)?rows:[]).map(normalizeAIConsent)}));return {success:true}}
    catch{return {success:false,error:'AI consent settings could not be saved.'}}
  }
  function getAIConsent(roomId,userId=current()?.id){
    return loadAIConsentRows().find(row=>row.roomId===roomId&&row.userId===userId)||normalizeAIConsent({roomId,userId});
  }
  function saveAIConsent({roomId,userId=current()?.id,allowSharedLearningData=false,explainPreference='sometimes'}={}){
    if(!roomId||!userId)return {success:false,error:'AI consent settings could not be saved.'};
    const rows=loadAIConsentRows().filter(row=>!(row.roomId===roomId&&row.userId===userId)),row=normalizeAIConsent({roomId,userId,allowSharedLearningData,explainPreference,updatedAt:new Date().toISOString()});
    const saved=saveAIConsentRows([...rows,row]);
    return saved.success?{success:true,consent:row}:saved;
  }
  function normalizeAIResult(result={}){
    const mode=normalizeAIMode(result.mode);
    return {responseId:text(result.responseId)||createRoomAIResponseId(),requestId:text(result.requestId)||createRoomAIRequestId(),roomId:text(result.roomId),mode,title:text(result.title)||({['study-order']:'Suggested Study Order',['group-quiz']:'Group Quiz',['discussion-questions']:'Discussion Questions',['topic-summary']:'Topic Summary',['study-agenda']:'Study Agenda'}[mode]||'AI Study Assistant Result'),content:result.content&&typeof result.content==='object'?result.content:{},sourceDataSummary:Array.isArray(result.sourceDataSummary)?result.sourceDataSummary.map(text).filter(Boolean):[],limitations:Array.isArray(result.limitations)?result.limitations.map(text).filter(Boolean):[],createdAt:result.createdAt||new Date().toISOString(),savedToRoom:result.savedToRoom===true,feedback:['helpful','needs-changes'].includes(result.feedback)?result.feedback:null,prototypeOnly:true};
  }
  function loadRoomAIResults(roomId=''){
    try{
      const parsed=JSON.parse(localStorage.getItem(AI_RESULT_KEY)||'[]'),rows=Array.isArray(parsed)?parsed:parsed.results||[];
      return rows.map(normalizeAIResult).filter(result=>result.roomId&&(roomId?result.roomId===roomId:true)&&AI_MODES.includes(result.mode));
    }catch{return []}
  }
  function saveRoomAIResults(results){
    const seen=new Set(),rows=(Array.isArray(results)?results:[]).map(normalizeAIResult).filter(result=>{if(!result.roomId||seen.has(result.responseId))return false;seen.add(result.responseId);return true});
    try{localStorage.setItem(AI_RESULT_KEY,JSON.stringify({version:'1.0.0',results:rows}));return {success:true}}
    catch{return {success:false,error:'AI result could not be saved.'}}
  }
  function validateStudyRoomAIAccess(roomId){
    const room=getStudyRoomById(roomId),u=current();
    if(!room)return {success:false,error:'Study room not found.'};
    if(!u)return {success:false,error:'You must be signed in to use Room AI.'};
    if(!['waiting','active'].includes(room.status))return {success:false,error:'Room AI is available only in waiting or active rooms.'};
    const access=validateStudyRoomLobbyAccess({room,userId:u.id});
    if(!access.valid)return {success:false,error:access.errors[0]};
    if(room.aiPermissions?.allowRoomAI===false)return {success:false,error:'Room AI is turned off by the host.'};
    return {success:true,room,user:u,isHost:room.hostUserId===u.id};
  }
  function checkAIRateLimit(roomId,userId){
    const now=Date.now();
    callRuntime.aiRecentRequests=callRuntime.aiRecentRequests.filter(row=>now-row.time<3600000);
    const roomCount=callRuntime.aiRecentRequests.filter(row=>row.roomId===roomId&&now-row.time<600000).length;
    const userCount=callRuntime.aiRecentRequests.filter(row=>row.userId===userId).length;
    if(roomCount>=10||userCount>=30)return false;
    callRuntime.aiRecentRequests.push({roomId,userId,time:now});
    return true;
  }
  function splitTopics(value){
    return unique(String(value||'').split(/[,;/|]|\band\b/gi).map(item=>text(item)).filter(Boolean)).slice(0,8);
  }
  function collectTopicPerformance(profile,topics){
    const quizzes=Array.isArray(profile?.quizzes)?profile.quizzes:[],topicRows=[];
    topics.forEach(topic=>{
      const matches=quizzes.filter(q=>String(q.topic||q.title||q.subject||'').toLowerCase().includes(topic.toLowerCase())||String(q.subject||'').toLowerCase().includes(topic.toLowerCase()));
      if(matches.length){
        const scores=matches.map(q=>Number(q.score)).filter(Number.isFinite),attempts=scores.length,average=attempts?Math.round(scores.reduce((a,b)=>a+b,0)/attempts):0;
        topicRows.push({topic,attempts,average});
      }
    });
    return topicRows;
  }
  function performanceLabel(row){
    if(!row||row.attempts<2)return 'not enough data';
    if(row.average>=85)return 'strong recorded performance';
    if(row.average>=70)return 'developing recorded performance';
    return 'needs more review based on recorded activity';
  }
  function buildParticipantTopicProfile({roomId,userId,approvedContext}={}){
    return {userId,displayName:approvedContext.displayName,role:approvedContext.role,sharedStrengths:approvedContext.sharedStrengths||[],sharedImprovementTopics:approvedContext.sharedImprovementTopics||[],topicPerformance:approvedContext.topicPerformance||[],preferredMethods:approvedContext.preferredMethods||[],explainPreference:approvedContext.explainPreference||'sometimes',dataCoverage:approvedContext.dataCoverage||'limited'};
  }
  function buildRoomContext({roomId,topic}={}){
    const access=validateStudyRoomAIAccess(roomId);
    if(!access.success)return {success:false,error:access.error};
    const room=access.room,goalRecord=studyRoomGoalService.load(roomId),schedule=getStudyRoomTimerSchedule(roomId),topics=splitTopics(topic||room.topic||goalRecord.goal.title),participants=(room.participantIds||[]).map(userId=>{
      const profile=publicStudentProfile(userId),account=typeof getUserById==='function'?getUserById(userId):null,consent=getAIConsent(roomId,userId),roomProfile=account?.studyMatchProfile||{},allowed=consent.allowSharedLearningData===true;
      const sharedStrengths=allowed?unique([...(roomProfile.strongTopics||[]),...(account?.learningProfile?.performance?.strongTopics||[])]).slice(0,8):[];
      const sharedImprovementTopics=allowed?unique([...(roomProfile.helpTopics||roomProfile.improvementTopics||[]),...(account?.learningProfile?.performance?.developingTopics||[]),...(account?.learningProfile?.performance?.weakTopics||[])]).slice(0,8):[];
      return buildParticipantTopicProfile({roomId,userId,approvedContext:{displayName:profile.name,role:userId===room.hostUserId?'Host':'Participant',sharedStrengths,sharedImprovementTopics,topicPerformance:allowed?collectTopicPerformance(account,topics):[],preferredMethods:allowed?unique([...(roomProfile.methods||roomProfile.studyMethods||[]),account?.learningProfile?.studyHabits?.preferredStudyTime].filter(Boolean)).slice(0,5):[],explainPreference:consent.explainPreference,dataCoverage:allowed?'shared learning data allowed':'limited'}});
    });
    return {success:true,room,topic:text(topic||room.topic),topics:topics.length?topics:[room.topic||room.course||'Study topic'],participants,sharedGoal:goalRecord.goal,sharedTasks:goalRecord.tasks,timerSchedule:schedule,currentTimer:getStudyRoomTimer(roomId),sourceDataSummary:createSourceDataSummary({room,topics,goalRecord,schedule,participants}),limitations:createAILimitations({participants})};
  }
  function createSourceDataSummary({room,topics,goalRecord,schedule,participants}={}){
    return [`Room course: ${room?.course||'Not set'}`,`Room topic: ${room?.topic||topics?.[0]||'Not set'}`,`Shared tasks: ${(goalRecord?.tasks||[]).length}`,`Timer schedule sessions: ${(schedule?.steps||[]).length}`,`Participants with learning-data consent: ${(participants||[]).filter(p=>p.dataCoverage==='shared learning data allowed').length}`];
  }
  function createAILimitations({participants}={}){
    const none=!(participants||[]).some(p=>p.dataCoverage==='shared learning data allowed');
    return ['This is a rule-based prototype, not a live AI service.','AI suggestions are estimates based on available recorded study activity.','They do not guarantee grades, exam results or future performance.',none?'Not enough shared performance data was available to assign topic leaders.':'Learning data is used only for participants who allowed it.','Private well-being, check-in, contact and hidden profile data are not used.'];
  }
  function validateAIStudyRequest({mode,context,settings={}}={}){
    const errors=[];
    if(!AI_MODES.includes(mode))errors.push('This AI mode is not available.');
    if(!context?.success)errors.push(context?.error||'You no longer have access to this room.');
    if(!text(context?.topic||context?.room?.topic))errors.push('Please choose a topic.');
    if(mode==='group-quiz'&&(Number(settings.questionCount)<1||Number(settings.questionCount)>30))errors.push('Choose 1 to 30 questions.');
    if(mode==='discussion-questions'&&(Number(settings.questionCount)<1||Number(settings.questionCount)>15))errors.push('Choose 1 to 15 discussion questions.');
    if(mode==='study-agenda'&&(Number(settings.durationMinutes)<10||Number(settings.durationMinutes)>240))errors.push('Choose a session duration from 10 to 240 minutes.');
    return {valid:errors.length===0,errors};
  }
  function topicLeader(topic,profiles,used=new Set()){
    const eligible=profiles.filter(p=>p.explainPreference!=='no'),scored=eligible.map(p=>({p,row:p.topicPerformance.find(row=>row.topic.toLowerCase()===topic.toLowerCase())})).filter(item=>item.row&&item.row.attempts>=2).sort((a,b)=>b.row.average-a.row.average);
    if(scored.length>=2&&scored[0].row.average-scored[1].row.average<5)return null;
    const best=scored.find(item=>!used.has(item.p.userId))||scored[0]||eligible.find(p=>!used.has(p.userId))||eligible[0];
    if(best?.p)used.add(best.p.userId);
    return best?.p||null;
  }
  function createParticipantInsights({participantProfiles,topics}={}){
    const insights=[];
    topics.forEach(topic=>{
      const rows=participantProfiles.map(p=>({p,row:p.topicPerformance.find(row=>row.topic.toLowerCase()===topic.toLowerCase())})).filter(item=>item.row&&item.row.attempts>=2);
      if(rows.length<1){insights.push(`There is limited shared recorded information for ${topic}.`);return}
      rows.sort((a,b)=>b.row.average-a.row.average);
      if(rows.length>1&&rows[0].row.average-rows[1].row.average<5)insights.push(`${rows[0].p.displayName} and ${rows[1].p.displayName} have similar recorded performance in ${topic}.`);
      else insights.push(`${rows[0].p.displayName} has the strongest recorded performance in ${topic} among the available shared data.`);
      rows.slice(0,2).forEach(({p,row})=>insights.push(`${p.displayName} has ${performanceLabel(row)} in ${topic}.`));
    });
    if(!insights.length)insights.push('Not enough shared performance data was available to assign topic leaders.');
    return unique(insights).slice(0,8);
  }
  function createSuggestedStudySteps({participantProfiles,topics,durationMinutes=45,sharedTasks=[]}={}){
    const used=new Set(),steps=[],topicMinutes=Math.max(5,Math.floor(Number(durationMinutes||45)*.18));
    topics.slice(0,3).forEach(topic=>{
      const leader=topicLeader(topic,participantProfiles,used);
      steps.push({stepId:createRoomAIStepId(),order:steps.length+1,type:leader?'peer-explanation':'group-review',title:`Review ${topic}`,description:leader?`${leader.displayName} may begin the ${topic} review based on available shared data.`:`Review ${topic} together because shared performance data is limited.`,assignedUserIds:leader?[leader.userId]:[],topic,durationMinutes:topicMinutes,completed:false});
    });
    const practice=Math.max(8,Math.floor(Number(durationMinutes||45)*.3)),compare=Math.max(6,Math.floor(Number(durationMinutes||45)*.2)),summary=Math.max(4,Number(durationMinutes||45)-steps.reduce((sum,step)=>sum+step.durationMinutes,0)-practice-compare);
    steps.push({stepId:createRoomAIStepId(),order:steps.length+1,type:'practice-questions',title:'Complete mixed practice questions',description:sharedTasks.filter(t=>!t.completed).length?'Use the incomplete shared tasks to choose practice questions.':'Complete mixed practice questions for the room topic.',assignedUserIds:[],topic:topics[0],durationMinutes:practice,completed:false});
    steps.push({stepId:createRoomAIStepId(),order:steps.length+1,type:'compare-answers',title:'Compare answers and mistakes',description:'Compare incorrect answers and explain the correction steps together.',assignedUserIds:[],topic:topics[0],durationMinutes:compare,completed:false});
    steps.push({stepId:createRoomAIStepId(),order:steps.length+1,type:'summary',title:'Record remaining questions',description:'Summarize key ideas and record any remaining questions for the next session.',assignedUserIds:[],topic:topics[0],durationMinutes:summary,completed:false});
    return steps.map((step,index)=>({...step,order:index+1,type:AI_STEP_TYPES.includes(step.type)?step.type:'custom'}));
  }
  function makeAIRequest({roomId,mode,topic,settings={}}={}){
    return {requestId:createRoomAIRequestId(),roomId,requestedByUserId:current()?.id||'',mode:normalizeAIMode(mode),topic:text(topic),settings:{questionCount:Number(settings.questionCount)||10,difficulty:text(settings.difficulty)||'mixed',durationMinutes:Number(settings.durationMinutes)||45,questionType:text(settings.questionType)||'mixed',includeAnswers:settings.includeAnswers!==false,includeExplanations:settings.includeExplanations!==false},createdAt:new Date().toISOString(),prototypeOnly:true};
  }
  function resultFor({request,context,title,content,extraLimitations=[]}){
    return {success:true,result:normalizeAIResult({responseId:createRoomAIResponseId(),requestId:request.requestId,roomId:request.roomId,mode:request.mode,title,content,sourceDataSummary:context.sourceDataSummary,limitations:[...context.limitations,...extraLimitations],createdAt:new Date().toISOString(),savedToRoom:false,prototypeOnly:true})};
  }
  function generateStudyOrder({roomId,topic,durationMinutes=45}={}){
    const context=buildRoomContext({roomId,topic}),request=makeAIRequest({roomId,mode:'study-order',topic:topic||context.room?.topic,settings:{durationMinutes}}),validation=validateAIStudyRequest({mode:'study-order',context,settings:request.settings});
    if(!validation.valid)return {success:false,error:validation.errors[0]};
    const insights=createParticipantInsights({participantProfiles:context.participants,topics:context.topics}),steps=createSuggestedStudySteps({participantProfiles:context.participants,insights,topics:context.topics,durationMinutes,sharedTasks:context.sharedTasks});
    return resultFor({request,context,title:'Suggested Study Order',content:{participantInsights:insights,steps,note:'This plan is based only on available shared study data.'}});
  }
  function generateStudyAgenda({roomId,topic,durationMinutes=45}={}){
    const base=generateStudyOrder({roomId,topic,durationMinutes});
    if(!base.success)return base;
    base.result.mode='study-agenda';
    base.result.title=`${durationMinutes}-Minute Study Agenda`;
    return base;
  }
  function generateDiscussionQuestions({roomId,topic,questionCount=5,difficulty='mixed',style='mixed'}={}){
    const context=buildRoomContext({roomId,topic}),request=makeAIRequest({roomId,mode:'discussion-questions',topic:topic||context.room?.topic,settings:{questionCount,difficulty}}),validation=validateAIStudyRequest({mode:'discussion-questions',context,settings:request.settings});
    if(!validation.valid)return {success:false,error:validation.errors[0]};
    const stems=['Explain the most important idea in','Compare two examples related to','Apply','Evaluate a common mistake in','Describe how you would teach'];
    const questions=Array.from({length:Math.min(15,Math.max(1,Number(questionCount)||5))},(_,index)=>`${stems[index%stems.length]} ${context.topics[index%context.topics.length]}.`);
    return resultFor({request,context,title:'Discussion Questions',content:{questions,difficulty,style}});
  }
  function generateTopicSummary({roomId,topic,summaryLength='standard'}={}){
    const context=buildRoomContext({roomId,topic}),request=makeAIRequest({roomId,mode:'topic-summary',topic:topic||context.room?.topic,settings:{summaryLength}}),validation=validateAIStudyRequest({mode:'topic-summary',context,settings:request.settings});
    if(!validation.valid)return {success:false,error:validation.errors[0]};
    const hasSource=context.sharedTasks.length||context.topics.length;
    if(!hasSource)return {success:false,error:'StudySpark does not have enough approved content to summarize this topic.'};
    return resultFor({request,context,title:'Topic Summary',content:{mainIdea:`Review the main ideas for ${context.topic||context.topics[0]}.`,importantTerms:context.topics,keyProcess:'Use approved room tasks and course material to identify the key process.',commonMistakes:'Compare mistakes from practice before the session ends.',reviewQuestions:context.topics.slice(0,4).map(item=>`What is the most important idea in ${item}?`),summaryLength},extraLimitations:['Review the original course material because generated summaries may omit details.']});
  }
  function generateGroupQuiz({roomId,topic,questionCount=10,difficulty='mixed',questionType='mixed',includeAnswers=true,includeExplanations=true}={}){
    const context=buildRoomContext({roomId,topic}),request=makeAIRequest({roomId,mode:'group-quiz',topic:topic||context.room?.topic,settings:{questionCount,difficulty,questionType,includeAnswers,includeExplanations}}),validation=validateAIStudyRequest({mode:'group-quiz',context,settings:request.settings});
    if(!validation.valid)return {success:false,error:validation.errors[0]};
    return resultFor({request,context,title:'Group Quiz',content:{questions:[],message:'No approved question source is available for this topic.',questionCount:Number(questionCount)||10,difficulty,questionType},extraLimitations:['Generated quiz questions require an approved question source.','Do not assume any generated question will appear on a real exam.']});
  }
  const studyRoomAIService={
    mode:studyRoomAIMode,
    generateStudyOrder,generateGroupQuiz,generateDiscussionQuestions,generateTopicSummary,generateStudyAgenda,buildParticipantTopicProfile,buildRoomContext,validateRequest:validateAIStudyRequest,getConsent:getAIConsent,saveConsent:saveAIConsent,loadResults:loadRoomAIResults,
    generate({roomId,mode,topic,settings={}}={}){
      const access=validateStudyRoomAIAccess(roomId);
      if(!access.success)return access;
      if(!checkAIRateLimit(roomId,access.user.id))return {success:false,error:'Please wait before generating another AI response.'};
      if(mode==='study-order')return generateStudyOrder({roomId,topic,durationMinutes:settings.durationMinutes});
      if(mode==='group-quiz')return generateGroupQuiz({roomId,topic,questionCount:settings.questionCount,difficulty:settings.difficulty,questionType:settings.questionType,includeAnswers:settings.includeAnswers,includeExplanations:settings.includeExplanations});
      if(mode==='discussion-questions')return generateDiscussionQuestions({roomId,topic,questionCount:settings.questionCount,difficulty:settings.difficulty,style:settings.style});
      if(mode==='topic-summary')return generateTopicSummary({roomId,topic,summaryLength:settings.summaryLength});
      if(mode==='study-agenda')return generateStudyAgenda({roomId,topic,durationMinutes:settings.durationMinutes});
      return {success:false,error:'This AI mode is not available.'};
    },
    saveResultToRoom(result){
      const normalized=normalizeAIResult({...result,savedToRoom:true});
      const access=validateStudyRoomAIAccess(normalized.roomId);
      if(!access.success)return access;
      const rows=loadRoomAIResults().filter(row=>row.responseId!==normalized.responseId),saved=saveRoomAIResults([normalized,...rows]);
      if(saved.success&&typeof signalingService?.sendAIResultSaved==='function')signalingService.sendAIResultSaved({roomId:normalized.roomId,responseId:normalized.responseId,updatedAt:new Date().toISOString()});
      return saved.success?{success:true,result:normalized}:saved;
    },
    clearResult(){callRuntime.aiCurrentResult=null;return {success:true}},
    addResultToTasks(result){
      const normalized=normalizeAIResult(result),access=validateSharedGoalAccess(normalized.roomId,{hostOnly:true});
      if(!access.success)return access;
      const steps=Array.isArray(normalized.content.steps)?normalized.content.steps:[],record=studyRoomGoalService.load(normalized.roomId),existing=new Set(record.tasks.map(task=>task.title.toLowerCase())),added=[];
      steps.filter(step=>!['break'].includes(step.type)).forEach(step=>{const title=text(step.title||step.description).slice(0,150);if(!title||existing.has(title.toLowerCase()))return;const add=studyRoomGoalService.addTask({roomId:normalized.roomId,title,description:step.description||''});if(add.success){added.push(add.task);existing.add(title.toLowerCase())}});
      return {success:true,added};
    },
    createTimerScheduleFromResult(result){
      const normalized=normalizeAIResult(result),access=validateStudyRoomTimerHost(normalized.roomId);
      if(!access.success)return access;
      const steps=(Array.isArray(normalized.content.steps)?normalized.content.steps:[]).filter(step=>Number(step.durationMinutes)>0).slice(0,12).map(step=>normalizeScheduleStep({mode:step.type==='break'?'break':step.type==='practice-questions'?'quiz':'focus',title:step.title,durationSeconds:Number(step.durationMinutes)*60}));
      if(!steps.length)return {success:false,error:'No timed steps are available for a timer schedule.'};
      return studyRoomTimerService.saveSchedule({roomId:normalized.roomId,schedule:{steps,stepIndex:0,autoAdvance:false}});
    },
    shareResultToChat(result){
      const normalized=normalizeAIResult(result),u=current(),room=getStudyRoomById(normalized.roomId),access=validateStudyRoomChatAccess({room,userId:u?.id});
      if(!access.valid)return {success:false,error:access.errors[0]};
      const message=normalizeStudyRoomMessage({messageId:createStudyRoomMessageId(),roomId:normalized.roomId,senderUserId:u.id,type:'system',content:`${u.name||'A participant'} shared an AI-generated ${normalized.title}. AI-Generated suggestions are estimates and do not guarantee grades, exam results or future performance.`,createdAt:new Date().toISOString(),status:'sent'});
      const rows=loadStudyRoomMessages();
      const saved=saveStudyRoomMessages([...rows,message]);
      if(saved.success&&typeof signalingService?.sendChatMessage==='function')signalingService.sendChatMessage(message);
      return saved.success?{success:true,message}:saved;
    },
    copyText(result){
      const lines=aiResultToText(normalizeAIResult(result));
      return lines;
    }
  };

  const studyRoomHostMode={mode:'local-host-controls-prototype',backendConnected:false};

  function validateStudyRoomHostAction(roomId){
    const room=getStudyRoomById(roomId),u=current();
    if(!room)return {success:false,error:'Study room not found.'};
    if(!u)return {success:false,error:'You must be signed in to manage this study room.'};
    if(!isStudyRoomHost({room,userId:u.id}))return {success:false,error:'Only the room host can perform management actions.'};
    return {success:true,room,user:u};
  }
  function hostSignal(type,roomId,extra={}){
    const payload={type,roomId,updatedAt:new Date().toISOString(),...extra};
    const method={['session-started']:'sendSessionStarted',['session-ended']:'sendSessionEnded',['room-locked']:'sendRoomLocked',['room-unlocked']:'sendRoomUnlocked',['participant-removed']:'sendParticipantRemoved',['participant-muted']:'sendParticipantMuted',['participant-unmuted']:'sendParticipantUnmuted',['host-transferred']:'sendHostTransferred',['topic-updated']:'sendTopicUpdated'}[type];
    if(method&&typeof signalingService?.[method]==='function')signalingService[method](payload);
    return payload;
  }
  function createOrUpdateJoinRequest(roomId,userId){
    const room=getStudyRoomById(roomId),u=userId||current()?.id;
    if(!room||!u)return {success:false,error:'Study room not found.'};
    if((room.removedUserIds||[]).includes(u))return {success:false,error:'You no longer have access to this study room.'};
    if(room.participantIds.includes(u))return {success:true,alreadyJoined:true,room};
    const rows=loadStudyRoomJoinRequests(),existing=rows.find(row=>row.roomId===roomId&&row.userId===u&&row.status==='pending');
    if(existing)return {success:true,request:existing,pending:true};
    const request=normalizeJoinRequest({requestId:createJoinRequestId(),roomId,userId:u,status:'pending',requestedAt:new Date().toISOString()});
    const saved=saveStudyRoomJoinRequests([request,...rows]);
    if(saved.success)notify('information',`${publicStudentProfile(u).name} requested to join ${room.roomName}.`,{category:'study-room',userId:room.hostUserId,relatedRoomId:roomId,occurrenceKey:`join-request:${request.requestId}`});
    return saved.success?{success:true,request,pending:true}:saved;
  }
  const studyRoomHostService={
    mode:studyRoomHostMode,
    isHost:isStudyRoomHost,
    validateHost:validateStudyRoomHostAction,
    loadJoinRequests:loadStudyRoomJoinRequests,
    createJoinRequest:createOrUpdateJoinRequest,
    startSession({roomId}={}){
      const access=validateStudyRoomHostAction(roomId);
      if(!access.success)return access;
      if(!['scheduled','waiting'].includes(access.room.status))return {success:false,error:'Only scheduled or waiting rooms can be started.'};
      const now=new Date().toISOString(),result=updateStudyRoom(roomId,{status:'active',startedAt:now});
      if(result.success){updateStudyRoomPresence({roomId,userId:access.user.id,state:'in-room'});appendStudyRoomSystemMessage(roomId,`${access.user.name||'The host'} started the study session.`,access.user.id);hostSignal('session-started',roomId,{startedAt:now});notify('success','Study session started.');notifyRoomParticipants(result.room,`${result.room.roomName} has started.`,access.user.id)}
      return result;
    },
    endSession({roomId}={}){
      const access=validateStudyRoomHostAction(roomId);
      if(!access.success)return access;
      if(!['waiting','active'].includes(access.room.status))return {success:false,error:'Only waiting or active sessions can be ended.'};
      const now=new Date().toISOString(),result=updateStudyRoom(roomId,{status:'completed',endedAt:now});
      if(result.success){saveStudyRoomPresence(loadStudyRoomPresence().map(row=>row.roomId===roomId?{...row,state:'left',updatedAt:now}:row));studyRoomTimerService.complete({roomId,silent:true});stopLobbyMedia();cleanupActiveCallMedia({silent:true});saveStudyRoomInvitations(loadStudyRoomInvitations().map(invite=>invite.roomId===roomId&&invite.status==='pending'?{...invite,status:'expired',updatedAt:now}:invite));appendStudyRoomSystemMessage(roomId,`${access.user.name||'The host'} ended the study session.`,access.user.id);hostSignal('session-ended',roomId,{endedAt:now});notify('success','Study session completed.');notifyRoomParticipants(result.room,'Study session ended.',access.user.id)}
      return result;
    },
    lockRoom({roomId}={}){
      const access=validateStudyRoomHostAction(roomId);
      if(!access.success)return access;
      const result=updateStudyRoom(roomId,{isLocked:true});
      if(result.success){appendStudyRoomSystemMessage(roomId,'The room host locked the study room.',access.user.id);hostSignal('room-locked',roomId);notify('success','Room locked.')}
      return result;
    },
    unlockRoom({roomId}={}){
      const access=validateStudyRoomHostAction(roomId);
      if(!access.success)return access;
      const result=updateStudyRoom(roomId,{isLocked:false});
      if(result.success){appendStudyRoomSystemMessage(roomId,'The room host unlocked the study room.',access.user.id);hostSignal('room-unlocked',roomId);notify('success','Room unlocked.')}
      return result;
    },
    approveJoinRequest({requestId}={}){
      const rows=loadStudyRoomJoinRequests(),request=rows.find(row=>row.requestId===requestId);
      if(!request)return {success:false,error:'Join request not found.'};
      const access=validateStudyRoomHostAction(request.roomId);
      if(!access.success)return access;
      if(request.status!=='pending')return {success:false,error:'This join request is no longer pending.'};
      if(access.room.participantIds.length>=access.room.maximumMembers)return {success:false,error:'This study room is full.'};
      const now=new Date().toISOString(),updatedRows=rows.map(row=>row.requestId===requestId?{...row,status:'approved',respondedAt:now,updatedAt:now}:row),roomUpdate=updateStudyRoom(request.roomId,{participantIds:unique([...access.room.participantIds,request.userId]),removedUserIds:(access.room.removedUserIds||[]).filter(id=>id!==request.userId)});
      if(!roomUpdate.success)return roomUpdate;
      saveStudyRoomJoinRequests(updatedRows);
      appendStudyRoomSystemMessage(request.roomId,`${publicStudentProfile(request.userId).name} joined the study room.`,access.user.id);
      notify('success','Join request approved.');
      return {success:true,room:roomUpdate.room,request:updatedRows.find(row=>row.requestId===requestId)};
    },
    declineJoinRequest({requestId}={}){
      const rows=loadStudyRoomJoinRequests(),request=rows.find(row=>row.requestId===requestId);
      if(!request)return {success:false,error:'Join request not found.'};
      const access=validateStudyRoomHostAction(request.roomId);
      if(!access.success)return access;
      const now=new Date().toISOString(),updatedRows=rows.map(row=>row.requestId===requestId?{...row,status:'declined',respondedAt:now,updatedAt:now}:row);
      const saved=saveStudyRoomJoinRequests(updatedRows);
      if(saved.success)notify('information','Join request declined.');
      return saved.success?{success:true,request:updatedRows.find(row=>row.requestId===requestId)}:saved;
    },
    removeParticipant({roomId,participantId}={}){
      const access=validateStudyRoomHostAction(roomId),target=publicStudentProfile(participantId);
      if(!access.success)return access;
      if(participantId===access.user.id)return {success:false,error:'You cannot remove yourself.'};
      if(!access.room.participantIds.includes(participantId))return {success:false,error:'This user is not a participant in this room.'};
      const now=new Date().toISOString(),result=updateStudyRoom(roomId,{participantIds:(access.room.participantIds||[]).filter(id=>id!==participantId),removedUserIds:unique([...(access.room.removedUserIds||[]),participantId]),mutedParticipants:(access.room.mutedParticipants||[]).filter(row=>row.userId!==participantId)});
      if(result.success){removeStudyRoomPresence(roomId,participantId);appendStudyRoomSystemMessage(roomId,`${target.name} was removed from the study room.`,access.user.id);hostSignal('participant-removed',roomId,{participantId});notify('success','Participant removed.')}
      return result;
    },
    muteParticipant({roomId,participantId,muted=true}={}){
      const access=validateStudyRoomHostAction(roomId),target=publicStudentProfile(participantId);
      if(!access.success)return access;
      if(participantId===access.user.id)return {success:false,error:'You cannot mute yourself.'};
      if(!access.room.participantIds.includes(participantId))return {success:false,error:'This user is not a participant in this room.'};
      const now=new Date().toISOString(),remaining=(access.room.mutedParticipants||[]).filter(row=>row.userId!==participantId),mutedParticipants=muted?[...remaining,{userId:participantId,muted:true,mutedBy:access.user.id,mutedAt:now}]:remaining;
      const result=updateStudyRoom(roomId,{mutedParticipants});
      if(result.success){appendStudyRoomSystemMessage(roomId,`${target.name} was ${muted?'muted':'unmuted'} by the room host.`,access.user.id);hostSignal(muted?'participant-muted':'participant-unmuted',roomId,{participantId});notify('success',muted?'Participant muted.':'Participant unmuted.')}
      return result;
    },
    changeTopic({roomId,course,topic,notes=''}={}){
      const access=validateStudyRoomHostAction(roomId);
      if(!access.success)return access;
      const cleanCourse=text(course||access.room.course),cleanTopic=text(topic);
      if(!cleanCourse||!cleanTopic)return {success:false,error:'Enter a course and study topic.'};
      if(cleanCourse.length>80||cleanTopic.length>100||privateInfo(`${cleanCourse} ${cleanTopic} ${notes}`))return {success:false,error:'Use a shorter topic without private information.'};
      const result=updateStudyRoom(roomId,{course:cleanCourse,topic:cleanTopic,description:notes?text(notes).slice(0,500):access.room.description});
      if(result.success){appendStudyRoomSystemMessage(roomId,`${access.user.name||'The host'} changed the study topic to ${cleanTopic}.`,access.user.id);hostSignal('topic-updated',roomId,{course:cleanCourse,topic:cleanTopic});notify('success','Study topic updated.')}
      return result;
    },
    updateRoomSettings({roomId,settings={}}={}){
      const access=validateStudyRoomHostAction(roomId);
      if(!access.success)return access;
      const next={};
      if(settings.roomName!==undefined)next.roomName=text(settings.roomName).slice(0,80);
      if(settings.topic!==undefined)next.topic=text(settings.topic).slice(0,100);
      if(settings.maximumMembers!==undefined)next.maximumMembers=Math.min(100,Math.max(2,Number(settings.maximumMembers)||access.room.maximumMembers));
      if(settings.screenSharePermission!==undefined)next.screenSharePermission=normalizeScreenSharePermission(settings.screenSharePermission);
      if(settings.chatEnabled!==undefined)next.chatEnabled=Boolean(settings.chatEnabled);
      if(settings.aiPermissions!==undefined)next.aiPermissions={allowRoomAI:settings.aiPermissions?.allowRoomAI!==false};
      if(!Object.keys(next).length)return {success:false,error:'No room settings were changed.'};
      const result=updateStudyRoom(roomId,next);
      if(result.success)notify('success','Room settings updated.');
      return result;
    },
    transferHost({roomId,newHostUserId}={}){
      const access=validateStudyRoomHostAction(roomId),target=publicStudentProfile(newHostUserId);
      if(!access.success)return access;
      if(newHostUserId===access.user.id)return {success:false,error:'You are already the host.'};
      if(!access.room.participantIds.includes(newHostUserId)||(access.room.removedUserIds||[]).includes(newHostUserId))return {success:false,error:'Host can be transferred only to an accepted participant.'};
      if(typeof areUsersBlocked==='function'&&areUsersBlocked({userIdA:access.user.id,userIdB:newHostUserId}))return {success:false,error:'Host can be transferred only to an available participant.'};
      const result=updateStudyRoom(roomId,{hostUserId:newHostUserId,participantIds:unique([newHostUserId,...access.room.participantIds])});
      if(result.success){appendStudyRoomSystemMessage(roomId,`${target.name} is now the room host.`,access.user.id);hostSignal('host-transferred',roomId,{fromUserId:access.user.id,toUserId:newHostUserId});notify('success','Host transferred.')}
      return result;
    }
  };

  function stopMediaStream(stream){
    if(!stream)return;
    stream.getTracks().forEach(track=>track.stop());
  }

  function stopLobbyMedia(){
    stopMediaStream(window.currentStudyRoomCameraStream);
    stopMediaStream(window.currentStudyRoomMicrophoneStream);
    window.currentStudyRoomCameraStream=null;
    window.currentStudyRoomMicrophoneStream=null;
  }

  const callRuntime={state:'idle',roomId:'',startedAt:null,timerId:null,elapsedSeconds:0,peerConnections:new Map(),remoteParticipants:new Map(),lastError:'',chatOpen:false,participantsOpen:false,aiOpen:false,aiLastFocus:null,aiCurrentMode:'study-order',aiCurrentResult:null,aiProcessing:false,aiRecentRequests:[],activeTabId:'call-tab-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),chatUnreadCounts:new Map(),chatLastSeen:new Map(),chatSendLocks:new Set(),chatRecentSends:[],timers:new Map(),timerSchedules:new Map(),timerHistory:new Map(),timerProcessing:new Set(),timerRenderId:null,timerCompletionSound:true};
  const callMediaState={cameraEnabled:false,microphoneEnabled:false,screenSharing:false,selectedCameraId:'',selectedMicrophoneId:'',selectedSpeakerId:'',cameraStream:null,microphoneStream:null,screenStream:null,screenTrack:null,screenShareStartedAt:null,currentScreenSharerUserId:null,previousOutgoingVideoTrack:null,remoteScreenStreams:new Map(),combinedLocalStream:null,activeSpeakerUserId:null,permissionRequestInProgress:false};

  const notificationManager={
    success(message){notify('success',message)},
    info(message){notify('information',message)},
    warning(message){notify('warning',message)},
    error(message){notify('error',message)}
  };

  const studyRoomTimerMode={mode:'local-prototype',backendConnected:false};

  function createStudyRoomScheduleId(){return 'schedule-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)}
  function normalizeTimerDuration(value,fallback=1500){
    const seconds=Number(value);
    if(!Number.isFinite(seconds))return fallback;
    return Math.min(10800,Math.max(60,Math.round(seconds)));
  }
  function normalizeTimerRemaining(value,fallback=1500){
    const seconds=Number(value);
    if(!Number.isFinite(seconds))return fallback;
    return Math.min(10800,Math.max(0,Math.round(seconds)));
  }
  function normalizeTimerMode(mode='focus'){
    const normalized=text(mode).toLowerCase();
    if(normalized==='practice'||normalized==='practice-quiz')return 'quiz';
    if(normalized==='group'||normalized==='group-discussion')return 'discussion';
    return TIMER_MODES[normalized]?normalized:'focus';
  }
  function normalizeTimerTitle(title,mode='focus'){
    const fallback=TIMER_MODES[normalizeTimerMode(mode)]?.title||'Focus Period';
    return text(title).slice(0,80)||fallback;
  }
  function normalizeScheduleStep(step={}){
    const mode=normalizeTimerMode(step.mode),preset=TIMER_MODES[mode]||TIMER_MODES.focus;
    return {mode,durationSeconds:normalizeTimerDuration(step.durationSeconds,preset.durationSeconds),title:normalizeTimerTitle(step.title,preset.mode)};
  }
  function normalizeTimerSchedule(schedule){
    const steps=(Array.isArray(schedule?.steps)&&schedule.steps.length?schedule.steps:DEFAULT_TIMER_SCHEDULE).map(normalizeScheduleStep).slice(0,12);
    return {scheduleId:text(schedule?.scheduleId)||createStudyRoomScheduleId(),steps,stepIndex:Math.min(Math.max(Number(schedule?.stepIndex)||0,0),Math.max(steps.length-1,0)),autoAdvance:schedule?.autoAdvance===true,updatedAt:schedule?.updatedAt||new Date().toISOString(),prototypeOnly:true};
  }
  function getStudyRoomTimerSchedule(roomId){
    if(!callRuntime.timerSchedules.has(roomId))callRuntime.timerSchedules.set(roomId,normalizeTimerSchedule({steps:DEFAULT_TIMER_SCHEDULE}));
    return callRuntime.timerSchedules.get(roomId);
  }
  function saveStudyRoomTimerSchedule(roomId,schedule){
    const normalized=normalizeTimerSchedule({...schedule,updatedAt:new Date().toISOString()});
    callRuntime.timerSchedules.set(roomId,normalized);
    return normalized;
  }
  function createStudyRoomTimerId(){return 'timer-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)}
  function getTimerPreset(mode='focus'){return TIMER_MODES[normalizeTimerMode(mode)]||TIMER_MODES.focus}
  function createStudyRoomTimerObject({room,mode='focus',title='',durationSeconds=null}={}){
    const preset=getTimerPreset(mode),duration=normalizeTimerDuration(durationSeconds,preset.durationSeconds),now=new Date().toISOString();
    return {timerId:createStudyRoomTimerId(),roomId:room?.roomId||'',mode:preset.mode,title:normalizeTimerTitle(title||preset.title,preset.mode),durationSeconds:duration,remainingSeconds:duration,status:'idle',startedAt:null,pausedAt:null,completedAt:null,hostUserId:room?.hostUserId||'',updatedAt:now,prototypeOnly:true};
  }
  function getStudyRoomTimer(roomId){
    const existing=callRuntime.timers.get(roomId);
    if(existing)return existing;
    const room=getStudyRoomById(roomId),schedule=getStudyRoomTimerSchedule(roomId),step=schedule.steps[schedule.stepIndex]||normalizeScheduleStep(DEFAULT_TIMER_SCHEDULE[0]),timer=createStudyRoomTimerObject({room,mode:step.mode,title:step.title,durationSeconds:step.durationSeconds});
    callRuntime.timers.set(roomId,timer);
    return timer;
  }
  function saveStudyRoomTimer(timer){
    const duration=normalizeTimerDuration(timer.durationSeconds);
    const normalized={...timer,remainingSeconds:normalizeTimerRemaining(timer.remainingSeconds,duration),durationSeconds:duration,status:TIMER_STATUSES.includes(timer.status)?timer.status:'idle',updatedAt:new Date().toISOString(),prototypeOnly:true};
    callRuntime.timers.set(normalized.roomId,normalized);
    return normalized;
  }
  function currentTimerRemainingSeconds(timer){
    if(!timer)return 0;
    if(timer.status!=='running'||!timer.startedAt)return Math.max(0,Math.round(timer.remainingSeconds));
    const elapsed=Math.floor((Date.now()-new Date(timer.startedAt).getTime())/1000);
    return Math.max(0,Math.round(timer.remainingSeconds-elapsed));
  }
  function formatStudyRoomTimer(seconds){
    const value=Math.max(0,Math.round(seconds||0)),minutes=Math.floor(value/60),remaining=value%60;
    return `${String(minutes).padStart(2,'0')}:${String(remaining).padStart(2,'0')}`;
  }
  function validateStudyRoomTimerHost(roomId){
    const room=getStudyRoomById(roomId),u=current();
    if(!room)return {success:false,error:'Study room not found.'};
    if(!u)return {success:false,error:'You must be signed in to control the study timer.'};
    if(room.hostUserId!==u.id)return {success:false,error:'Only the room host can control the study timer.'};
    if(room.status!=='active')return {success:false,error:'The study timer is available only during an active study session.'};
    return {success:true,room,user:u};
  }
  function timerSignal(type,timer,extra={}){
    const payload={type,roomId:timer.roomId,mode:timer.mode,startedAt:timer.startedAt,updatedAt:timer.updatedAt,...extra};
    const method={['timer-start']:'sendTimerStart',['timer-pause']:'sendTimerPause',['timer-reset']:'sendTimerReset',['timer-mode-change']:'sendTimerModeChange',['timer-complete']:'sendTimerComplete'}[type];
    if(method&&typeof signalingService?.[method]==='function')signalingService[method](payload);
    return payload;
  }
  function announceTimer(message){
    const live=$('#study-room-timer-announcement');
    if(live)live.textContent=message;
    notificationManager.info(message);
  }
  function playTimerCompletionSound(){
    if(!callRuntime.timerCompletionSound||typeof AudioContext==='undefined')return;
    try{
      const context=new AudioContext(),osc=context.createOscillator(),gain=context.createGain();
      osc.type='sine';
      osc.frequency.value=880;
      gain.gain.value=.04;
      osc.connect(gain);
      gain.connect(context.destination);
      osc.start();
      setTimeout(()=>{osc.stop();context.close?.()},180);
    }catch{}
  }
  function pushTimerHistory(timer,status='Completed'){
    const rows=callRuntime.timerHistory.get(timer.roomId)||[];
    rows.unshift({title:timer.title,durationSeconds:timer.durationSeconds,status,completedAt:new Date().toISOString()});
    callRuntime.timerHistory.set(timer.roomId,rows.slice(0,8));
  }
  function updateStudyRoomTimerDisplay(roomId=callRuntime.roomId){
    const timer=getStudyRoomTimer(roomId),remaining=currentTimerRemainingSeconds(timer),display=$('#study-room-timer-display'),bar=$('#study-room-timer-progress-bar'),status=$('#study-room-timer-status'),percent=timer.durationSeconds?Math.max(0,Math.min(100,(remaining/timer.durationSeconds)*100)):0;
    if(display)display.textContent=formatStudyRoomTimer(remaining);
    if(bar){bar.style.width=`${percent}%`;bar.setAttribute('aria-valuenow',String(Math.round(percent)))}
    if(status)status.textContent=timer.status==='completed'?`${timer.title} Complete`:timer.status.charAt(0).toUpperCase()+timer.status.slice(1);
    if(timer.status==='running'&&remaining<=0)studyRoomTimerService.complete({roomId,silent:false});
  }
  function startStudyRoomTimerRenderer(roomId){
    stopStudyRoomTimerRenderer();
    callRuntime.timerRenderId=window.setInterval(()=>updateStudyRoomTimerDisplay(roomId),500);
  }
  function stopStudyRoomTimerRenderer(){
    if(callRuntime.timerRenderId)window.clearInterval(callRuntime.timerRenderId);
    callRuntime.timerRenderId=null;
  }
  function setTimerProcessing(roomId,action){
    const key=`${roomId}:${action}`;
    if(callRuntime.timerProcessing.has(key))return false;
    callRuntime.timerProcessing.add(key);
    return true;
  }
  function clearTimerProcessing(roomId,action){callRuntime.timerProcessing.delete(`${roomId}:${action}`)}
  const studyRoomTimerService={
    mode:studyRoomTimerMode,
    createTimer({roomId,mode='focus',title='',durationSeconds=null}={}){
      const room=getStudyRoomById(roomId);
      if(!room)return {success:false,error:'Study room not found.'};
      const timer=createStudyRoomTimerObject({room,mode,title,durationSeconds});
      callRuntime.timers.set(roomId,timer);
      return {success:true,timer};
    },
    getTimer:getStudyRoomTimer,
    getSchedule:getStudyRoomTimerSchedule,
    saveSchedule({roomId,schedule}={}){
      const access=validateStudyRoomTimerHost(roomId);
      if(!access.success)return access;
      const saved=saveStudyRoomTimerSchedule(roomId,schedule);
      const step=saved.steps[saved.stepIndex]||saved.steps[0];
      this.changeMode({roomId,mode:step.mode,title:step.title,durationSeconds:step.durationSeconds,silent:true});
      renderActiveStudyCall(roomId);
      return {success:true,schedule:saved};
    },
    start({roomId}={}){
      const access=validateStudyRoomTimerHost(roomId);
      if(!access.success)return access;
      if(!setTimerProcessing(roomId,'start'))return {success:false,error:'Timer start is already processing.'};
      const timer=getStudyRoomTimer(roomId);
      if(timer.status==='running'){clearTimerProcessing(roomId,'start');return {success:true,timer}};
      const remaining=timer.status==='completed'?timer.durationSeconds:currentTimerRemainingSeconds(timer)||timer.durationSeconds,now=new Date().toISOString();
      const next=saveStudyRoomTimer({...timer,status:'running',remainingSeconds:remaining,startedAt:now,pausedAt:null,completedAt:null});
      timerSignal('timer-start',next,{startedAt:now});
      startStudyRoomTimerRenderer(roomId);
      renderActiveStudyCall(roomId);
      announceTimer(`${next.title} started.`);
      clearTimerProcessing(roomId,'start');
      return {success:true,timer:next};
    },
    pause({roomId}={}){
      const access=validateStudyRoomTimerHost(roomId);
      if(!access.success)return access;
      if(!setTimerProcessing(roomId,'pause'))return {success:false,error:'Timer pause is already processing.'};
      const timer=getStudyRoomTimer(roomId);
      if(timer.status!=='running'){clearTimerProcessing(roomId,'pause');return {success:true,timer}};
      const remaining=currentTimerRemainingSeconds(timer),now=new Date().toISOString(),next=saveStudyRoomTimer({...timer,status:'paused',remainingSeconds:remaining,startedAt:null,pausedAt:now});
      timerSignal('timer-pause',next,{pausedAt:now});
      renderActiveStudyCall(roomId);
      announceTimer('Timer paused.');
      clearTimerProcessing(roomId,'pause');
      return {success:true,timer:next};
    },
    reset({roomId}={}){
      const access=validateStudyRoomTimerHost(roomId);
      if(!access.success)return access;
      if(!setTimerProcessing(roomId,'reset'))return {success:false,error:'Timer reset is already processing.'};
      const timer=getStudyRoomTimer(roomId),next=saveStudyRoomTimer({...timer,status:'idle',remainingSeconds:timer.durationSeconds,startedAt:null,pausedAt:null,completedAt:null});
      timerSignal('timer-reset',next);
      renderActiveStudyCall(roomId);
      announceTimer('Timer reset.');
      clearTimerProcessing(roomId,'reset');
      return {success:true,timer:next};
    },
    changeMode({roomId,mode='focus',title='',durationSeconds=null,silent=false}={}){
      const access=validateStudyRoomTimerHost(roomId);
      if(!access.success)return access;
      if(!setTimerProcessing(roomId,'mode'))return {success:false,error:'Timer mode change is already processing.'};
      const preset=getTimerPreset(mode),timer=createStudyRoomTimerObject({room:access.room,mode:preset.mode,title:title||preset.title,durationSeconds:durationSeconds||preset.durationSeconds});
      callRuntime.timers.set(roomId,timer);
      timerSignal('timer-mode-change',timer,{mode:timer.mode});
      if(!silent){renderActiveStudyCall(roomId);announceTimer(`${timer.title} selected.`)}
      clearTimerProcessing(roomId,'mode');
      return {success:true,timer};
    },
    nextSession({roomId,autoStart=false}={}){
      const access=validateStudyRoomTimerHost(roomId);
      if(!access.success)return access;
      const schedule=getStudyRoomTimerSchedule(roomId),nextIndex=(schedule.stepIndex+1)%schedule.steps.length,nextSchedule=saveStudyRoomTimerSchedule(roomId,{...schedule,stepIndex:nextIndex}),step=nextSchedule.steps[nextIndex],changed=this.changeMode({roomId,mode:step.mode,title:step.title,durationSeconds:step.durationSeconds,silent:true});
      if(!changed.success)return changed;
      renderActiveStudyCall(roomId);
      announceTimer(`${changed.timer.title} started next.`);
      if(autoStart||nextSchedule.autoAdvance)return this.start({roomId});
      return {success:true,timer:changed.timer,schedule:nextSchedule};
    },
    tick({roomId}={}){updateStudyRoomTimerDisplay(roomId);return {success:true,timer:getStudyRoomTimer(roomId)}},
    complete({roomId,silent=false}={}){
      const timer=getStudyRoomTimer(roomId);
      if(timer.status==='completed')return {success:true,timer};
      const now=new Date().toISOString(),next=saveStudyRoomTimer({...timer,status:'completed',remainingSeconds:0,startedAt:null,pausedAt:null,completedAt:now});
      pushTimerHistory(next,'Completed');
      timerSignal('timer-complete',next,{completedAt:now});
      renderActiveStudyCall(roomId);
      if(!silent){playTimerCompletionSound();announceTimer(`${next.title} complete.`)}
      const schedule=getStudyRoomTimerSchedule(roomId);
      if(schedule.autoAdvance)window.setTimeout(()=>studyRoomTimerService.nextSession({roomId,autoStart:true}),800);
      return {success:true,timer:next};
    },
    sync({roomId}={}){return {success:false,error:'The Study Room Timer is synchronized through the real-time backend in the full version.',timer:getStudyRoomTimer(roomId)}},
    cleanup({roomId=callRuntime.roomId}={}){stopStudyRoomTimerRenderer();return {success:true,timer:roomId?getStudyRoomTimer(roomId):null}},
    setCompletionSound(enabled){callRuntime.timerCompletionSound=enabled!==false;return {success:true,enabled:callRuntime.timerCompletionSound}}
  };

  const callStateManager={
    getState(){return {...callRuntime}},
    setState(nextState,{roomId='',error=''}={}){
      if(!CALL_STATES.includes(nextState))return {success:false,error:'Call state is invalid.'};
      callRuntime.state=nextState;
      if(roomId)callRuntime.roomId=roomId;
      callRuntime.lastError=error;
      renderActiveStudyCall();
      return {success:true,state:nextState};
    },
    startTimer(){
      this.stopTimer();
      callRuntime.startedAt=Date.now();
      callRuntime.elapsedSeconds=0;
      callRuntime.timerId=window.setInterval(()=>{callRuntime.elapsedSeconds=Math.floor((Date.now()-callRuntime.startedAt)/1000);updateCallTimerDisplay()},1000);
    },
    stopTimer(){
      if(callRuntime.timerId)window.clearInterval(callRuntime.timerId);
      callRuntime.timerId=null;
    },
    reset(){
      this.stopTimer();
      callRuntime.state='idle';
      callRuntime.roomId='';
      callRuntime.startedAt=null;
      callRuntime.elapsedSeconds=0;
      callRuntime.lastError='';
      callRuntime.remoteParticipants.clear();
    }
  };

  function browserCallSupport(){
    const media=navigator.mediaDevices||{};
    return {
      peerConnection:typeof RTCPeerConnection==='function',
      getUserMedia:typeof media.getUserMedia==='function',
      getDisplayMedia:typeof media.getDisplayMedia==='function',
      screenSharing:typeof media.getDisplayMedia==='function',
      enumerateDevices:typeof media.enumerateDevices==='function',
      secureContext:window.isSecureContext===true||typeof location==='undefined'||location.protocol==='https:'||['localhost','127.0.0.1'].includes(location.hostname)
    };
  }

  function getMediaSupport(){return browserCallSupport()}

  function supportsScreenSharing(){
    return Boolean(navigator.mediaDevices&&typeof navigator.mediaDevices.getDisplayMedia==='function');
  }

  function callSupportWarnings(){
    const support=browserCallSupport(),messages=[];
    if(!support.secureContext)messages.push('Camera and microphone require HTTPS in production. Localhost remains allowed during development.');
    if(!support.getUserMedia)messages.push('This browser does not support camera or microphone access.');
    if(!support.screenSharing)messages.push('Screen sharing is not supported by this browser.');
    if(!support.peerConnection)messages.push('This browser does not support RTCPeerConnection.');
    if(!support.enumerateDevices)messages.push('This browser cannot list available media devices.');
    return messages;
  }

  function loadCallDevicePreferences(){
    try{return JSON.parse(localStorage.getItem(CALL_PREFS_KEY)||'{}')||{}}catch{return {}}
  }

  function saveCallDevicePreferencesForUser(userId,prefs){
    const all=loadCallDevicePreferences();
    all[userId]={selectedCameraId:text(prefs.selectedCameraId||prefs.cameraDeviceId),selectedMicrophoneId:text(prefs.selectedMicrophoneId||prefs.microphoneDeviceId),selectedSpeakerId:text(prefs.selectedSpeakerId||prefs.speakerDeviceId),updatedAt:new Date().toISOString()};
    localStorage.setItem(CALL_PREFS_KEY,JSON.stringify(all));
    return all[userId];
  }

  function getCallDevicePreferencesForUser(userId=current()?.id){
    const prefs=loadCallDevicePreferences()[userId]||{};
    const selectedCameraId=text(prefs.selectedCameraId||prefs.cameraDeviceId);
    const selectedMicrophoneId=text(prefs.selectedMicrophoneId||prefs.microphoneDeviceId);
    const selectedSpeakerId=text(prefs.selectedSpeakerId||prefs.speakerDeviceId);
    return {selectedCameraId,selectedMicrophoneId,selectedSpeakerId,cameraDeviceId:selectedCameraId,microphoneDeviceId:selectedMicrophoneId,speakerDeviceId:selectedSpeakerId};
  }

  async function enumerateCallDevices(){
    if(!navigator.mediaDevices?.enumerateDevices)return {success:false,error:'This browser cannot list available media devices.',devices:[]};
    try{
      const devices=await navigator.mediaDevices.enumerateDevices(),counts={videoinput:0,audioinput:0,audiooutput:0};
      return {success:true,devices:devices.map(device=>{
        counts[device.kind]=(counts[device.kind]||0)+1;
        const fallback=device.kind==='videoinput'?`Camera ${counts[device.kind]}`:device.kind==='audioinput'?`Microphone ${counts[device.kind]}`:device.kind==='audiooutput'?`Speaker ${counts[device.kind]}`:`Device ${counts[device.kind]}`;
        return {deviceId:device.deviceId,kind:device.kind,label:device.label||fallback,groupId:device.groupId||''};
      })};
    }catch(error){
      return {success:false,error:'Device list could not be loaded.',devices:[]};
    }
  }

  async function enumerateAvailableDevices(){
    const result=await enumerateCallDevices(),devices=result.devices||[];
    return {...result,cameras:devices.filter(device=>device.kind==='videoinput'),microphones:devices.filter(device=>device.kind==='audioinput'),speakers:devices.filter(device=>device.kind==='audiooutput')};
  }

  function mediaErrorMessage(error,kind='device'){
    const name=error?.name||'';
    if(name==='NotAllowedError'||name==='SecurityError')return `${kind} permission was denied.`;
    if(name==='NotFoundError'||name==='DevicesNotFoundError')return `No ${kind.toLowerCase()} was detected.`;
    if(name==='NotReadableError'||name==='TrackStartError')return `${kind} appears to be busy in another app.`;
    if(name==='OverconstrainedError')return `${kind} is no longer available. Choose another device.`;
    if(name==='AbortError')return `${kind} could not start. Please try again.`;
    if(!navigator.mediaDevices?.getUserMedia)return 'This browser does not support camera or microphone access.';
    return `${kind} could not be started.`;
  }

  async function requestMedia(constraints,kind){
    const support=getMediaSupport();
    if(!support.secureContext)return {success:false,error:'Camera and microphone require HTTPS in production. Localhost remains allowed during development.'};
    if(!support.getUserMedia)return {success:false,error:'This browser does not support camera or microphone access.'};
    const okay=await confirmDialog({title:`Turn On ${kind}?`,message:`StudySpark will ask your browser for ${kind.toLowerCase()} permission only after this click. ${kind} never activates automatically, and StudySpark does not record study-room audio, video or screen sharing by default.`,okText:`Turn On ${kind}`,cancelText:'Cancel'});
    if(!okay)return {success:false,error:'cancelled'};
    try{
      callMediaState.permissionRequestInProgress=true;
      const stream=await navigator.mediaDevices.getUserMedia(constraints);
      return {success:true,stream};
    }catch(error){
      return {success:false,error:mediaErrorMessage(error,kind)};
    }finally{
      callMediaState.permissionRequestInProgress=false;
    }
  }

  function getActiveCallRoom(){return callRuntime.roomId?getStudyRoomById(callRuntime.roomId):null}
  function currentVideoTrack(){return callMediaState.screenStream?.getVideoTracks?.()[0]||callMediaState.cameraStream?.getVideoTracks?.()[0]||null}
  function currentAudioTrack(){return callMediaState.microphoneStream?.getAudioTracks?.()[0]||null}
  function rebuildCombinedLocalStream(){
    const tracks=[currentVideoTrack(),currentAudioTrack()].filter(Boolean);
    callMediaState.combinedLocalStream=typeof MediaStream==='function'?new MediaStream(tracks):null;
    return callMediaState.combinedLocalStream;
  }
  function replaceOutgoingTrack(kind,track){
    callRuntime.peerConnections.forEach(connection=>{
      const sender=connection?.getSenders?.().find(row=>row.track?.kind===kind);
      if(sender&&typeof sender.replaceTrack==='function')sender.replaceTrack(track).catch?.(()=>{});
    });
  }
  function replaceOutgoingVideoTrack(track=currentVideoTrack()){replaceOutgoingTrack('video',track)}
  function replaceOutgoingAudioTrack(track=currentAudioTrack()){replaceOutgoingTrack('audio',track)}
  function getCurrentMediaState(){
    return {
      cameraEnabled:callMediaState.cameraEnabled,
      microphoneEnabled:callMediaState.microphoneEnabled,
      screenSharing:callMediaState.screenSharing,
      selectedCameraId:callMediaState.selectedCameraId,
      selectedMicrophoneId:callMediaState.selectedMicrophoneId,
      selectedSpeakerId:callMediaState.selectedSpeakerId,
      cameraStream:callMediaState.cameraStream,
      microphoneStream:callMediaState.microphoneStream,
      screenStream:callMediaState.screenStream,
      screenTrack:callMediaState.screenTrack,
      screenShareStartedAt:callMediaState.screenShareStartedAt,
      currentScreenSharerUserId:callMediaState.currentScreenSharerUserId,
      previousOutgoingVideoTrack:callMediaState.previousOutgoingVideoTrack,
      combinedLocalStream:callMediaState.combinedLocalStream,
      activeSpeakerUserId:callMediaState.activeSpeakerUserId,
      permissionRequestInProgress:callMediaState.permissionRequestInProgress
    };
  }
  function saveCurrentMediaPreferences(){
    if(current()?.id)saveCallDevicePreferencesForUser(current().id,{selectedCameraId:callMediaState.selectedCameraId,selectedMicrophoneId:callMediaState.selectedMicrophoneId,selectedSpeakerId:callMediaState.selectedSpeakerId});
  }
  function applyStoredMediaPreferences(){
    const prefs=getCallDevicePreferencesForUser();
    callMediaState.selectedCameraId=prefs.selectedCameraId;
    callMediaState.selectedMicrophoneId=prefs.selectedMicrophoneId;
    callMediaState.selectedSpeakerId=prefs.selectedSpeakerId;
  }

  const audioActivityService={
    cleanups:[],
    start(stream,userId){
      this.stop(userId);
      const AudioCtor=typeof AudioContext==='function'?AudioContext:typeof webkitAudioContext==='function'?webkitAudioContext:null;
      if(!AudioCtor||!stream?.getAudioTracks?.()[0])return;
      try{
        const context=new AudioCtor(),source=context.createMediaStreamSource(stream),analyser=context.createAnalyser(),data=new Uint8Array(analyser.fftSize);
        source.connect(analyser);
        let animationId=0,lastSpeaking=false,lastUpdate=0;
        const tick=()=>{
          analyser.getByteTimeDomainData(data);
          const volume=data.reduce((sum,value)=>sum+Math.abs(value-128),0)/data.length;
          const speaking=volume>8;
          if(speaking!==lastSpeaking&&Date.now()-lastUpdate>900){
            callMediaState.activeSpeakerUserId=speaking?userId:null;
            lastSpeaking=speaking;
            lastUpdate=Date.now();
            renderActiveStudyCall();
          }
          animationId=requestAnimationFrame(tick);
        };
        tick();
        this.cleanups.push({userId,stop:()=>{cancelAnimationFrame(animationId);source.disconnect?.();context.close?.()}});
      }catch(error){}
    },
    stop(userId=''){
      this.cleanups=this.cleanups.filter(item=>{if(userId&&item.userId!==userId)return true;item.stop();return false});
      if(!userId||callMediaState.activeSpeakerUserId===userId)callMediaState.activeSpeakerUserId=null;
    },
    stopAll(){this.stop('')}
  };

  function getCurrentOutgoingVideoTrack(){return currentVideoTrack()}

  function canUserShareScreen({room,userId}={}){
    if(!room||room.status!=='active')return false;
    if(!Array.isArray(room.participantIds)||!room.participantIds.includes(userId))return false;
    if(normalizeScreenSharePermission(room.screenSharePermission)==='host-only')return room.hostUserId===userId;
    return true;
  }

  function validateStudyRoomScreenShareAccess({room,userId}={}){
    const errors=[];
    if(!room){errors.push('Study room not found.');return {valid:false,errors}}
    if(!userId)errors.push('You must be signed in to share your screen.');
    if(room.status!=='active')errors.push('Screen sharing is available only during an active study session.');
    if(!Array.isArray(room.participantIds)||!room.participantIds.includes(userId))errors.push('You must be a room participant to share your screen.');
    if((room.removedUserIds||[]).includes(userId))errors.push('You no longer have access to this room.');
    if(userId&&typeof areUsersBlocked==='function'&&areUsersBlocked({userIdA:room.hostUserId,userIdB:userId}))errors.push('Screen sharing is not available.');
    if(userId&&!canUserShareScreen({room,userId}))errors.push('You do not have permission to share your screen in this room.');
    return {valid:errors.length===0,errors};
  }

  function getCurrentRoomScreenSharer(roomId=callRuntime.roomId){
    return callMediaState.currentScreenSharerUserId&&callRuntime.roomId===roomId?callMediaState.currentScreenSharerUserId:null;
  }

  function getScreenShareState(){
    return {screenSharing:callMediaState.screenSharing,screenStream:callMediaState.screenStream,screenTrack:callMediaState.screenTrack,screenShareStartedAt:callMediaState.screenShareStartedAt,currentScreenSharerUserId:callMediaState.currentScreenSharerUserId};
  }

  function screenSharerProfile(userId=callMediaState.currentScreenSharerUserId){
    return userId?publicStudentProfile(userId):null;
  }

  function screenShareStatusText(){
    const sharer=screenSharerProfile();
    if(!sharer)return '';
    return sharer.id===current()?.id?'You are sharing your screen.':`${sharer.name} is sharing their screen.`;
  }

  function updateLocalScreenShareIndicator({userId,active}={}){
    callMediaState.currentScreenSharerUserId=active?userId:null;
    renderActiveStudyCall();
  }

  function attachSharedScreenVideo(){
    const video=$('#shared-screen-video');
    if(!video)return;
    const isCurrent=callMediaState.currentScreenSharerUserId===current()?.id;
    const stream=isCurrent?callMediaState.screenStream:callMediaState.remoteScreenStreams.get(callMediaState.currentScreenSharerUserId);
    video.srcObject=stream||null;
    video.muted=true;
  }

  function removeLocalScreenPreview(){
    const video=$('#shared-screen-video');
    if(video)video.srcObject=null;
  }

  function hideScreenSharingBanner(){callMediaState.currentScreenSharerUserId=null;renderActiveStudyCall()}
  function attachLocalScreenPreview(stream){callMediaState.screenStream=stream;attachSharedScreenVideo()}
  function attachLocalCameraPreview(){attachLocalCallVideo()}
  function showLocalAvatarPlaceholder(){renderActiveStudyCall()}
  function attachRemoteScreenStream({userId,stream}){if(userId&&stream)callMediaState.remoteScreenStreams.set(userId,stream);attachSharedScreenVideo()}
  function removeRemoteScreenStream(userId){callMediaState.remoteScreenStreams.delete(userId);attachSharedScreenVideo()}
  function renderParticipantSharingState({userId,sharing}){callRuntime.remoteParticipants.set(userId,{...(callRuntime.remoteParticipants.get(userId)||{}),sharingScreen:Boolean(sharing),videoSource:sharing?'screen':'camera'});renderActiveStudyCall()}
  function restoreStandardParticipantGrid(){renderActiveStudyCall()}

  async function showScreenSharePrivacyDialog(){
    return confirmDialog({title:'Screen-Sharing Privacy',message:'Your browser will ask you to choose a tab, window or screen. StudySpark cannot choose it for you, and screen sharing never starts automatically. Other room members may see the tab, window, or screen you select. Close private messages, grades, passwords, notifications, contact information, and anything personal before continuing. StudySpark does not record study-room audio, video or screen sharing by default.',okText:'Continue to Browser Selection',cancelText:'Cancel'});
  }

  async function startScreenShare({roomId=callRuntime.roomId}={}){
    const currentUser=current();
    if(!currentUser)return {success:false,error:'You must be signed in to share your screen.'};
    const room=getStudyRoomById(roomId);
    if(!room)return {success:false,error:'Study room not found.'};
    const access=studyRoomSafetyService.canStartScreenShare({room,userId:currentUser.id});
    if(!access.valid)return {success:false,error:access.errors[0]};
    if(callMediaState.permissionRequestInProgress)return {success:false,error:'Another device permission request is already open.'};
    if(callMediaState.screenSharing)return {success:false,error:'You are already sharing your screen.'};
    if(getCurrentRoomScreenSharer(roomId))return {success:false,error:'Another participant is already sharing their screen.'};
    if(!supportsScreenSharing())return {success:false,error:'Screen sharing is not supported by this browser.'};
    if(!getMediaSupport().secureContext)return {success:false,error:'Screen sharing requires HTTPS outside localhost.'};
    const okay=await showScreenSharePrivacyDialog();
    if(!okay)return {success:false,error:'cancelled'};
    callMediaState.permissionRequestInProgress=true;
    try{
      const stream=await navigator.mediaDevices.getDisplayMedia({video:true,audio:false});
      const screenTrack=stream.getVideoTracks()[0];
      if(!screenTrack){stopMediaStream(stream);return {success:false,error:'No shared screen was selected.'}}
      callMediaState.screenStream=stream;
      callMediaState.screenTrack=screenTrack;
      callMediaState.screenSharing=true;
      callMediaState.screenShareStartedAt=new Date().toISOString();
      callMediaState.currentScreenSharerUserId=currentUser.id;
      callMediaState.previousOutgoingVideoTrack=getCurrentOutgoingVideoTrack();
      await replaceOutgoingVideoTrack(screenTrack);
      attachLocalScreenPreview(stream);
      signalingService.sendScreenShareStarted({roomId:room.roomId,userId:currentUser.id,startedAt:callMediaState.screenShareStartedAt});
      signalingService.sendParticipantVideoSource({roomId:room.roomId,userId:currentUser.id,source:'screen'});
      screenTrack.addEventListener?.('ended',()=>stopScreenShare({roomId:room.roomId,reason:'browser-ended'}),{once:true});
      notificationManager.success('Screen sharing started.');
      renderActiveStudyCall();
      return {success:true,stream};
    }catch(error){
      const message=(error?.name==='NotAllowedError'||error?.name==='AbortError')?'Screen-sharing permission was not granted.':error?.name==='NotReadableError'?'The selected screen could not be shared.':'Screen sharing could not be started.';
      notificationManager.warning(message);
      return {success:false,error:message};
    }finally{
      callMediaState.permissionRequestInProgress=false;
    }
  }

  async function stopScreenShare({roomId=callRuntime.roomId,reason='user-stopped',silent=false}={}){
    if(!callMediaState.screenSharing)return {success:true};
    const currentUser=current(),screenStream=callMediaState.screenStream;
    if(screenStream)screenStream.getTracks().forEach(track=>track.stop());
    const replacementTrack=callMediaState.cameraEnabled?callMediaState.cameraStream?.getVideoTracks?.()[0]||null:null;
    await replaceOutgoingVideoTrack(replacementTrack);
    callMediaState.screenStream=null;
    callMediaState.screenTrack=null;
    callMediaState.screenSharing=false;
    callMediaState.screenShareStartedAt=null;
    callMediaState.currentScreenSharerUserId=null;
    callMediaState.previousOutgoingVideoTrack=null;
    removeLocalScreenPreview();
    if(replacementTrack)attachLocalCameraPreview(callMediaState.cameraStream);else showLocalAvatarPlaceholder();
    if(currentUser&&roomId)signalingService.sendScreenShareStopped({roomId,userId:currentUser.id,stoppedAt:new Date().toISOString(),reason});
    if(currentUser&&roomId)signalingService.sendParticipantVideoSource({roomId,userId:currentUser.id,source:replacementTrack?'camera':'none'});
    if(!silent)notificationManager.info('Screen sharing stopped.');
    renderActiveStudyCall();
    return {success:true};
  }

  function handleRemoteScreenShareStart({roomId,userId,stream,startedAt=new Date().toISOString()}={}){
    const currentRoom=getActiveCallRoom();
    if(!currentRoom||currentRoom.roomId!==roomId)return;
    callMediaState.currentScreenSharerUserId=userId;
    callMediaState.screenShareStartedAt=startedAt;
    attachRemoteScreenStream({userId,stream});
    renderParticipantSharingState({userId,sharing:true});
    notificationManager.info(`${publicStudentProfile(userId).name} is sharing their screen.`);
  }

  function handleRemoteScreenShareStop({roomId,userId}={}){
    const currentRoom=getActiveCallRoom();
    if(!currentRoom||currentRoom.roomId!==roomId)return;
    if(callMediaState.currentScreenSharerUserId!==userId)return;
    callMediaState.currentScreenSharerUserId=null;
    callMediaState.screenShareStartedAt=null;
    removeRemoteScreenStream(userId);
    renderParticipantSharingState({userId,sharing:false});
    restoreStandardParticipantGrid();
  }

  function cleanupScreenShare(){
    return stopScreenShare({roomId:callRuntime.roomId,reason:'cleanup'});
  }

  const localMediaManager={
    async enableCamera({deviceId=callMediaState.selectedCameraId}={}){
      const room=getActiveCallRoom();
      const access=studyRoomSafetyService.canActivateMedia({room,userId:current()?.id,type:'camera'});
      if(!access.valid){notificationManager.warning(access.errors[0]);return {success:false,error:access.errors[0]}}
      const result=await requestMedia({video:deviceId?{deviceId:{exact:deviceId}}:true,audio:false},'Camera');
      if(result.success){
        const previous=callMediaState.cameraStream;
        callMediaState.cameraStream=result.stream;
        callMediaState.cameraEnabled=true;
        callMediaState.selectedCameraId=text(deviceId);
        rebuildCombinedLocalStream();
        if(!callMediaState.screenSharing)replaceOutgoingVideoTrack();
        stopMediaStream(previous);
        saveCurrentMediaPreferences();
        notificationManager.success('Camera enabled.');
      }else if(result.error!=='cancelled')notificationManager.warning(result.error);
      renderActiveStudyCall();
      return result;
    },
    disableCamera({silent=false}={}){
      stopMediaStream(callMediaState.cameraStream);
      callMediaState.cameraStream=null;
      callMediaState.cameraEnabled=false;
      if(!callMediaState.screenSharing)replaceOutgoingVideoTrack(null);
      rebuildCombinedLocalStream();
      if(!silent)notificationManager.info('Camera disabled.');
      renderActiveStudyCall();
      return {success:true};
    },
    async enableMicrophone({deviceId=callMediaState.selectedMicrophoneId}={}){
      const room=getActiveCallRoom();
      const access=studyRoomSafetyService.canActivateMedia({room,userId:current()?.id,type:'microphone'});
      if(!access.valid){notificationManager.warning(access.errors[0]);return {success:false,error:access.errors[0]}}
      const result=await requestMedia({video:false,audio:deviceId?{deviceId:{exact:deviceId},echoCancellation:true,noiseSuppression:true}:{echoCancellation:true,noiseSuppression:true}},'Microphone');
      if(result.success){
        const previous=callMediaState.microphoneStream;
        callMediaState.microphoneStream=result.stream;
        callMediaState.microphoneEnabled=true;
        callMediaState.selectedMicrophoneId=text(deviceId);
        rebuildCombinedLocalStream();
        replaceOutgoingAudioTrack();
        stopMediaStream(previous);
        audioActivityService.start(result.stream,current()?.id||'local-user');
        saveCurrentMediaPreferences();
        notificationManager.success('Microphone enabled.');
      }else if(result.error!=='cancelled')notificationManager.warning(result.error);
      renderActiveStudyCall();
      return result;
    },
    disableMicrophone({silent=false}={}){
      audioActivityService.stop(current()?.id||'local-user');
      stopMediaStream(callMediaState.microphoneStream);
      callMediaState.microphoneStream=null;
      callMediaState.microphoneEnabled=false;
      replaceOutgoingAudioTrack(null);
      rebuildCombinedLocalStream();
      if(!silent)notificationManager.info('Microphone disabled.');
      renderActiveStudyCall();
      return {success:true};
    },
    async switchCamera(deviceId=''){
      const previousId=callMediaState.selectedCameraId,wasEnabled=callMediaState.cameraEnabled;
      callMediaState.selectedCameraId=text(deviceId);
      if(!wasEnabled){saveCurrentMediaPreferences();renderActiveStudyCall();return {success:true}}
      const result=await this.enableCamera({deviceId});
      if(!result.success)callMediaState.selectedCameraId=previousId;
      return result;
    },
    async switchMicrophone(deviceId=''){
      const previousId=callMediaState.selectedMicrophoneId,wasEnabled=callMediaState.microphoneEnabled;
      callMediaState.selectedMicrophoneId=text(deviceId);
      if(!wasEnabled){saveCurrentMediaPreferences();renderActiveStudyCall();return {success:true}}
      const result=await this.enableMicrophone({deviceId});
      if(!result.success)callMediaState.selectedMicrophoneId=previousId;
      return result;
    },
    async startScreenShare(){
      return startScreenShare({roomId:callRuntime.roomId});
    },
    stopScreenShare({roomId=callRuntime.roomId,silent=false,reason='user-stopped'}={}){
      return stopScreenShare({roomId,reason:silent?'cleanup':reason,silent});
    },
    async startCameraAndMicrophone({cameraDeviceId='',microphoneDeviceId=''}={}){
      const camera=await this.enableCamera({deviceId:cameraDeviceId});
      const microphone=await this.enableMicrophone({deviceId:microphoneDeviceId});
      return camera.success||microphone.success?{success:true,stream:callMediaState.combinedLocalStream}:{success:false,error:camera.error||microphone.error||'Camera and microphone could not be started.'};
    },
    replaceTrack(peerConnection,kind,track){
      const sender=peerConnection?.getSenders?.().find(row=>row.track?.kind===kind);
      if(sender&&typeof sender.replaceTrack==='function')return sender.replaceTrack(track);
      return Promise.resolve();
    },
    stopAllLocalMedia({silent=false}={}){
      audioActivityService.stopAll();
      stopMediaStream(callMediaState.cameraStream);
      stopMediaStream(callMediaState.microphoneStream);
      if(callMediaState.screenSharing)stopScreenShare({roomId:callRuntime.roomId,reason:'cleanup',silent});
      else stopMediaStream(callMediaState.screenStream);
      callMediaState.cameraStream=null;
      callMediaState.microphoneStream=null;
      callMediaState.screenStream=null;
      callMediaState.screenTrack=null;
      callMediaState.combinedLocalStream=null;
      callMediaState.cameraEnabled=false;
      callMediaState.microphoneEnabled=false;
      callMediaState.screenSharing=false;
      callMediaState.screenShareStartedAt=null;
      callMediaState.currentScreenSharerUserId=null;
      callMediaState.previousOutgoingVideoTrack=null;
      callMediaState.remoteScreenStreams.clear();
      callMediaState.activeSpeakerUserId=null;
      replaceOutgoingVideoTrack(null);
      replaceOutgoingAudioTrack(null);
      if(!silent)notificationManager.info('Camera, microphone, and screen sharing are off.');
      renderActiveStudyCall();
      return {success:true};
    },
    getCurrentMediaState,
    enumerateAvailableDevices,
    startCamera(options){return this.enableCamera(options)},
    stopCamera(){return this.disableCamera()},
    startMicrophone(options){return this.enableMicrophone(options)},
    stopMicrophone(){return this.disableMicrophone()},
    stopAll(){return this.stopAllLocalMedia()}
  };
  const studyRoomMediaService=localMediaManager;

  const screenShareManager={
    start(){return studyRoomMediaService.startScreenShare()},
    stop(){return studyRoomMediaService.stopScreenShare()},
    handleRemoteStart:handleRemoteScreenShareStart,
    handleRemoteStop:handleRemoteScreenShareStop,
    getState:getScreenShareState,
    cleanup:cleanupScreenShare
  };

  function createPeerConnection(configuration={}){
    if(typeof RTCPeerConnection!=='function')return {success:false,error:'This browser does not support RTCPeerConnection.'};
    const iceServers=Array.isArray(configuration.iceServers)&&configuration.iceServers.length?configuration.iceServers:[{urls:'stun:stun.l.google.com:19302'}];
    return {success:true,peerConnection:new RTCPeerConnection({...configuration,iceServers})};
  }

  const peerConnectionService={
    createPeerConnection,
    getAllConnections(){return Array.from(callRuntime.peerConnections.values())},
    closeAll(){
      callRuntime.peerConnections.forEach(connection=>connection.close?.());
      callRuntime.peerConnections.clear();
      return {success:true};
    }
  };

  const signalingService={
    connected:false,
    connect(){return {success:false,error:'A signaling server is required before real calls can connect.'}},
    disconnect(){this.connected=false;return {success:true}},
    joinRoom(){return {success:false,error:'Room signaling is not configured yet.'}},
    leaveRoom(){return {success:true}},
    sendOffer(){return {success:false,error:'A signaling server is required to send WebRTC offers.'}},
    sendAnswer(){return {success:false,error:'A signaling server is required to send WebRTC answers.'}},
    sendIceCandidate(){return {success:false,error:'A signaling server is required to exchange ICE candidates.'}},
    sendScreenShareStarted(){return {success:false,error:'Real remote screen sharing requires the signaling backend.'}},
    sendScreenShareStopped(){return {success:false,error:'Real remote screen sharing requires the signaling backend.'}},
    sendParticipantVideoSource(){return {success:false,error:'Real remote screen sharing requires the signaling backend.'}},
    sendTimerStart(){return {success:false,error:'Real synchronized study timers require the signaling backend.'}},
    sendTimerPause(){return {success:false,error:'Real synchronized study timers require the signaling backend.'}},
    sendTimerReset(){return {success:false,error:'Real synchronized study timers require the signaling backend.'}},
    sendTimerModeChange(){return {success:false,error:'Real synchronized study timers require the signaling backend.'}},
    sendTimerComplete(){return {success:false,error:'Real synchronized study timers require the signaling backend.'}},
    sendGoalCreated(){return {success:false,error:'Real shared goals require the signaling backend.'}},
    sendTaskAdded(){return {success:false,error:'Real shared goals require the signaling backend.'}},
    sendTaskUpdated(){return {success:false,error:'Real shared goals require the signaling backend.'}},
    sendTaskCompleted(){return {success:false,error:'Real shared goals require the signaling backend.'}},
    sendTaskDeleted(){return {success:false,error:'Real shared goals require the signaling backend.'}},
    sendGoalUpdated(){return {success:false,error:'Real shared goals require the signaling backend.'}},
    sendAIResultSaved(){return {success:false,error:'Real Room AI sharing requires the signaling backend.'}},
    onScreenShareStarted(){return {success:false,error:'Real remote screen sharing requires the signaling backend.'}},
    onScreenShareStopped(){return {success:false,error:'Real remote screen sharing requires the signaling backend.'}},
    onParticipantVideoSource(){return {success:false,error:'Real remote screen sharing requires the signaling backend.'}},
    onTimerSync(){return {success:false,error:'Real synchronized study timers require the signaling backend.'}},
    onGoalSync(){return {success:false,error:'Real shared goals require the signaling backend.'}},
    onAIResultSync(){return {success:false,error:'Real Room AI sharing requires the signaling backend.'}}
  };

  const roomConnectionManager={
    joinRoom(roomId){return signalingService.joinRoom(roomId)},
    leaveRoom(roomId){return signalingService.leaveRoom(roomId)},
    currentParticipants(roomId){const room=getStudyRoomById(roomId);return room?(room.participantIds||[]).map(publicStudentProfile):[]},
    onParticipantUpdate(){return {success:false,error:'Live participant updates require a backend.'}},
    onHostUpdate(){return {success:false,error:'Live host updates require a backend.'}}
  };

  const remoteMediaManager={
    createRemoteVideoElement(participant){
      const video=document.createElement('video');
      video.autoplay=true;
      video.playsInline=true;
      video.dataset.remoteParticipantId=participant?.id||'';
      return video;
    },
    removeDisconnectedUser(userId){callRuntime.remoteParticipants.delete(userId);renderActiveStudyCall()},
    updateParticipantTile(userId,updates={}){callRuntime.remoteParticipants.set(userId,{...(callRuntime.remoteParticipants.get(userId)||{}),...updates});renderActiveStudyCall()},
    trackMuteState(userId,muted){this.updateParticipantTile(userId,{microphoneEnabled:!muted})},
    trackCameraState(userId,cameraEnabled){this.updateParticipantTile(userId,{cameraEnabled:Boolean(cameraEnabled)})}
  };

  function runStudyRoomLobbyMigration(){
    try{
      runStudyRoomMigration();
      [ROOM_KEY,GUEST_ROOM_KEY].forEach(key=>{
        const raw=localStorage.getItem(key);
        if(!raw)return;
        const parsed=JSON.parse(raw),rows=Array.isArray(parsed)?parsed:parsed.rooms,usedCodes=new Set();
        const normalized=(Array.isArray(rows)?rows:[]).map(normalizeStudyRoom).filter(Boolean).map(room=>({...room,roomCode:assignUniqueRoomCode(room,usedCodes)}));
        const validation=validateStudyRoomCollection(normalized);
        if(validation.valid)localStorage.setItem(key,JSON.stringify({version:'1.0.0',rooms:normalized}));
      });
      saveStudyRoomPresence(loadStudyRoomPresence());
      localStorage.setItem(LOBBY_MIGRATION_KEY,String(LOBBY_MIGRATION_VERSION));
    }catch(error){console.error('Study-room lobby migration failed.',error)}
  }

  function runScreenShareMigration(){
    try{
      if(Number(localStorage.getItem(SCREEN_SHARE_MIGRATION_KEY)||0)>=1)return;
      [ROOM_KEY,GUEST_ROOM_KEY].forEach(key=>{
        const raw=localStorage.getItem(key);
        if(!raw)return;
        const parsed=JSON.parse(raw),rows=Array.isArray(parsed)?parsed:parsed.rooms,usedCodes=new Set();
        const normalized=(Array.isArray(rows)?rows:[]).map(room=>normalizeStudyRoom({...room,screenSharePermission:normalizeScreenSharePermission(room.screenSharePermission)})).filter(Boolean).map(room=>({...room,roomCode:assignUniqueRoomCode(room,usedCodes)}));
        const validation=validateStudyRoomCollection(normalized);
        if(validation.valid)localStorage.setItem(key,JSON.stringify({version:'1.0.0',rooms:normalized}));
      });
      localStorage.removeItem('studyRoomScreenShareState');
      localStorage.removeItem('screenShareState');
      localStorage.setItem(SCREEN_SHARE_MIGRATION_KEY,'1');
    }catch(error){console.error('Screen-share migration failed.',error)}
  }

  function runStudyRoomChatMigration(){
    try{
      if(Number(localStorage.getItem(CHAT_MIGRATION_KEY)||0)>=1)return;
      [ROOM_KEY,GUEST_ROOM_KEY].forEach(key=>{
        const raw=localStorage.getItem(key);
        if(!raw)return;
        const parsed=JSON.parse(raw),rows=Array.isArray(parsed)?parsed:parsed.rooms,usedCodes=new Set();
        const normalized=(Array.isArray(rows)?rows:[]).map(room=>normalizeStudyRoom({...room,chatEnabled:room.chatEnabled!==false})).filter(Boolean).map(room=>({...room,roomCode:assignUniqueRoomCode(room,usedCodes)}));
        const validation=validateStudyRoomCollection(normalized);
        if(validation.valid)localStorage.setItem(key,JSON.stringify({version:'1.0.0',rooms:normalized}));
      });
      const messages=loadStudyRoomMessages(),seen=new Set(),migrated=[];
      messages.forEach(message=>{
        const normalized=normalizeStudyRoomMessage(message);
        if(!normalized||seen.has(normalized.messageId))return;
        seen.add(normalized.messageId);
        if(normalized.linkUrl&&!isAllowedStudyLink(normalized.linkUrl))migrated.push({...normalized,status:'deleted',deletedAt:new Date().toISOString(),content:'Message deleted.',linkUrl:null});
        else migrated.push(normalized);
      });
      saveStudyRoomMessages(migrated);
      localStorage.setItem(CHAT_MIGRATION_KEY,'1');
    }catch(error){console.error('Study-room chat migration failed.',error)}
  }

  function runStudyRoomGoalsMigration(){
    try{
      if(Number(localStorage.getItem(GOAL_MIGRATION_KEY)||0)>=1)return;
      const raw=localStorage.getItem(GOAL_KEY);
      if(raw){
        const parsed=JSON.parse(raw),rooms=unpackStudyRoomGoalStore(parsed),migrated={};
        Object.entries(rooms).forEach(([roomId,record])=>{
          const normalized=normalizeSharedGoalRecord(record);
          if(normalized.goal.roomId)migrated[roomId]=normalized;
        });
        saveAllStudyRoomGoals(migrated);
      }
      localStorage.setItem(GOAL_MIGRATION_KEY,'1');
    }catch(error){console.error('Study-room goals migration failed.',error)}
  }

  function runStudyRoomAIMigration(){
    try{
      if(Number(localStorage.getItem(AI_MIGRATION_KEY)||0)>=1)return;
      saveAIConsentRows(loadAIConsentRows());
      const seen=new Set(),results=loadRoomAIResults().map(result=>normalizeAIResult({...result,sourceDataSummary:result.sourceDataSummary?.length?result.sourceDataSummary:['Available room data'],limitations:result.limitations?.length?result.limitations:createAILimitations({participants:[]}),savedToRoom:result.savedToRoom===true,prototypeOnly:true})).filter(result=>{if(!AI_MODES.includes(result.mode)||seen.has(result.responseId))return false;seen.add(result.responseId);return true});
      saveRoomAIResults(results);
      localStorage.setItem(AI_MIGRATION_KEY,'1');
    }catch(error){console.error('Study-room AI migration failed.',error)}
  }
  function runStudyRoomHostMigration(){
    try{
      if(Number(localStorage.getItem(HOST_MIGRATION_KEY)||0)>=1)return;
      const requests=loadStudyRoomJoinRequests();
      saveStudyRoomJoinRequests(requests);
      [ROOM_KEY,GUEST_ROOM_KEY].forEach(key=>{
        const raw=localStorage.getItem(key);
        if(!raw)return;
        const parsed=JSON.parse(raw),rows=Array.isArray(parsed)?parsed:parsed.rooms;
        const usedCodes=new Set(),normalized=(Array.isArray(rows)?rows:[]).map(normalizeStudyRoom).filter(Boolean).map(room=>({...room,roomCode:assignUniqueRoomCode(room,usedCodes)}));
        localStorage.setItem(key,JSON.stringify({version:'1.0.0',rooms:normalized}));
      });
      localStorage.setItem(HOST_MIGRATION_KEY,'1');
    }catch(error){console.error('Study-room host migration failed.',error)}
  }

  function runStudyRoomSafetyMigration(){
    try{
      if(Number(localStorage.getItem(SAFETY_MIGRATION_KEY)||0)>=1)return;
      [ROOM_KEY,GUEST_ROOM_KEY].forEach(key=>{
        const raw=localStorage.getItem(key);
        if(!raw)return;
        const parsed=JSON.parse(raw),rows=Array.isArray(parsed)?parsed:parsed.rooms,usedCodes=new Set();
        const normalized=(Array.isArray(rows)?rows:[]).map(room=>{
          const next=normalizeStudyRoom({...DEFAULT_ROOM_SAFETY_SETTINGS,...room,privacy:normalizeRoomPrivacy(room.privacy),recordingAllowed:false,contactSharingAllowed:false,exactLocationSharingAllowed:false});
          delete next.email;
          delete next.phone;
          delete next.location;
          delete next.latitude;
          delete next.longitude;
          delete next.preciseAddress;
          delete next.password;
          delete next.passwordPlaintext;
          delete next.hostEmail;
          return next;
        }).filter(Boolean).map(room=>({...room,roomCode:assignUniqueRoomCode(room,usedCodes)}));
        localStorage.setItem(key,JSON.stringify({version:'1.0.0',rooms:normalized}));
      });
      saveSafetyReports([...loadSafetyReports(),...loadStudyRoomReports().map(row=>normalizeSafetyReport({...row,reportType:'room',category:row.reason||row.category,description:row.notes||row.description,status:'submitted-local'}))]);
      if(typeof loadFriendBlocks==='function'){
        const migrated=loadFriendBlocks().map(row=>normalizeBlockRecord({blockedByUserId:row.blockedBy,blockedUserId:row.blockedUser,createdAt:row.createdAt,status:'active',reasonCategory:null}));
        saveUserBlocks([...loadUserBlocks(),...migrated]);
      }else saveUserBlocks(loadUserBlocks());
      localStorage.setItem(SAFETY_MIGRATION_KEY,'1');
    }catch(error){console.error('Study-room safety migration failed.',error)}
  }

  function validateNewStudyRoom(room){
    const errors=[];
    const scheduled=createScheduledStartAt({date:room.date,startTime:room.startTime});
    const dateOnly=new Date(`${room.date}T00:00:00`);
    const maxDate=addDays(new Date(),365);
    if(room.roomName.length<3||room.roomName.length>80)errors.push('Room name must be between 3 and 80 characters.');
    if(!room.course||room.course.length>80)errors.push('Enter a valid course.');
    if(!room.topic||room.topic.length>100)errors.push('Enter a valid study topic.');
    if(room.description.length>500)errors.push('Room description must be 500 characters or fewer.');
    if([room.roomName,room.course,room.topic,room.description].some(privateInfo))errors.push('Do not include private contact or exact location information in room details.');
    if(!room.date||Number.isNaN(dateOnly.getTime())||dateOnly<new Date(`${todayLocal()}T00:00:00`)||dateOnly>maxDate)errors.push('Choose a valid study-room date.');
    if(!/^\d{2}:\d{2}$/.test(room.startTime)||!scheduled)errors.push('Choose a valid start time.');
    if(scheduled&&new Date(scheduled).getTime()<Date.now()-60000)errors.push('Choose a start time in the future.');
    if(!Number.isInteger(room.maximumMembers)||room.maximumMembers<2||room.maximumMembers>100)errors.push('Maximum members must be between 2 and 100.');
    if(!DURATIONS.includes(room.durationMinutes)||room.durationMinutes>180)errors.push('Choose a valid duration.');
    if(!PRIVACY.includes(room.privacy))errors.push('Choose a valid study-room privacy option.');
    errors.push(...studyRoomSafetyService.validateRoomPrivacy(room).errors);
    if(room.requiresPassword&&room.passwordValue&&(room.passwordValue.length<8||room.passwordValue.length>64))errors.push('Room password must be between 8 and 64 characters.');
    if(room.requiresPassword&&!room.passwordValue&&!room.passwordUpdatedAt)errors.push('Enter a prototype room password before saving this setting.');
    if(room.invitedUserIds.length>room.maximumMembers-1)errors.push(`You can invite up to ${room.maximumMembers-1} friends to this room.`);
    return {valid:errors.length===0,errors};
  }

  function acceptedFriendRows(){
    const u=current();
    if(!u||isGuest())return [];
    return typeof getFriendsForUser==='function'?getFriendsForUser(u.id):[];
  }

  function filterInvites(hostUserId,ids){
    const accepted=new Set(acceptedFriendRows().map(row=>row.friendUserId));
    return unique(ids).filter(id=>accepted.has(id)&&studyRoomBlockService.canInvite({senderUserId:hostUserId,receiverUserId:id}).allowed);
  }

  async function createStudyRoom(input){
    const currentUser=current();
    if(!currentUser||isGuest())return {success:false,error:'You must be signed in to create a study room.'};
    const normalizedInput=normalizeStudyRoomInput(input);
    normalizedInput.invitedUserIds=[];
    const validation=validateNewStudyRoom({...normalizedInput,hostUserId:currentUser.id});
    if(!validation.valid)return {success:false,error:validation.errors[0]};
    const rooms=loadStudyRooms(),now=new Date().toISOString();
    let roomId=createStudyRoomId();
    while(rooms.some(room=>room.roomId===roomId))roomId=createStudyRoomId();
    const room=normalizeStudyRoom({...DEFAULT_ROOM_SAFETY_SETTINGS,...normalizedInput,passwordUpdatedAt:normalizedInput.requiresPassword?now:null,roomId,hostUserId:currentUser.id,participantIds:[currentUser.id],declinedUserIds:[],removedUserIds:[],scheduledStartAt:createScheduledStartAt(normalizedInput),status:'scheduled',createdAt:now,updatedAt:now,startedAt:null,endedAt:null,cancelledAt:null,prototypeOnly:true});
    rooms.push(room);
    const saved=saveStudyRooms(rooms);
    if(!saved.success)return saved;
    const savedRoom=getStudyRoomById(roomId)||room;
    notify('success','Study room created.');
    sessionStorage.removeItem(DRAFT_KEY);
    return {success:true,room:savedRoom};
  }

  function getStudyRoomById(roomId){return loadStudyRooms().find(room=>room.roomId===roomId)||null}
  function canViewRoom(room,viewer=current()){
    if(!room||!viewer||isGuest())return false;
    if(room.hostUserId===viewer.id||room.participantIds.includes(viewer.id)||room.invitedUserIds.includes(viewer.id))return true;
    return isFriendsOnlyRoom(room)&&typeof areUsersFriends==='function'&&areUsersFriends({userIdA:viewer.id,userIdB:room.hostUserId});
  }
  function getStudyRoomsForUser(userId=current()?.id){
    if(!userId||isGuest())return [];
    return updateExpiredRooms(loadStudyRooms()).filter(room=>canViewRoom(room,{id:userId}));
  }
  function updateStudyRoom(roomId,updates={}){
    const rooms=loadStudyRooms(),index=rooms.findIndex(room=>room.roomId===roomId);
    if(index<0)return {success:false,error:'Study room not found.'};
    const next=normalizeStudyRoom({...rooms[index],...updates,updatedAt:new Date().toISOString()});
    const saved=saveStudyRooms(rooms.map(room=>room.roomId===roomId?next:room));
    if(saved.success)renderStudyRoomsPage();
    return saved.success?{success:true,room:next}:saved;
  }

  function updateRoomScreenSharePermission(roomId,permission){
    const room=getStudyRoomById(roomId),u=current();
    if(!room||!u||room.hostUserId!==u.id)return {success:false,error:'Only the room host can change screen-sharing permissions.'};
    const nextPermission=normalizeScreenSharePermission(permission);
    const result=updateStudyRoom(roomId,{screenSharePermission:nextPermission});
    if(result.success){
      notify('success',nextPermission==='host-only'?'Screen sharing is limited to the host.':'All participants may share their screen.');
      if(callMediaState.currentScreenSharerUserId&&callMediaState.currentScreenSharerUserId!==u.id&&nextPermission==='host-only')notify('information','The current share will continue until the participant stops.');
      renderActiveStudyCall(roomId);
    }
    return result;
  }

  function updateRoomChatEnabled(roomId,enabled){
    const room=getStudyRoomById(roomId),u=current();
    if(!room||!u||room.hostUserId!==u.id)return {success:false,error:'Only the room host can change chat settings.'};
    const result=updateStudyRoom(roomId,{chatEnabled:Boolean(enabled)});
    if(result.success){
      notify('success',enabled?'Room chat is on.':'Room chat is off.');
      renderActiveStudyCall(roomId);
    }
    return result;
  }

  function acceptRoomInvitation(roomId){
    const u=current(),invitation=loadStudyRoomInvitations().find(item=>item.roomId===roomId&&item.toUserId===u?.id&&item.status==='pending');
    return acceptStudyRoomInvitation({invitationId:invitation?.invitationId,currentUserId:u?.id});
  }

  function declineRoomInvitation(roomId){
    const u=current(),invitation=loadStudyRoomInvitations().find(item=>item.roomId===roomId&&item.toUserId===u?.id&&item.status==='pending');
    return declineStudyRoomInvitation({invitationId:invitation?.invitationId,currentUserId:u?.id});
  }

  function acceptStudyRoomInvitation({invitationId,currentUserId}){
    const invitations=loadStudyRoomInvitations(),invitation=invitations.find(item=>item.invitationId===invitationId);
    if(!invitation)return {success:false,error:'Study-room invitation not found.'};
    if(invitation.toUserId!==currentUserId)return {success:false,error:'You cannot respond to this invitation.'};
    if(invitation.status!=='pending')return {success:false,error:'This invitation is no longer pending.'};
    const rooms=loadStudyRooms(),room=rooms.find(item=>item.roomId===invitation.roomId);
    if(!room)return {success:false,error:'Study room not found.'};
    const access=studyRoomSafetyService.validateRoomAccess({room,userId:currentUserId});
    if(!access.valid&&!(room.isLocked&&access.errors[0]?.includes('locked')))return {success:false,error:access.errors[0]};
    if(room.participantIds.includes(currentUserId))return {success:true,room};
    if(room.isLocked)return createOrUpdateJoinRequest(room.roomId,currentUserId);
    if(room.participantIds.length>=room.maximumMembers){notify('warning','This study room is full.');return {success:false,error:'This study room is full.'}};
    const now=new Date().toISOString(),nextInvitations=invitations.map(item=>item.invitationId===invitationId?{...item,status:'accepted',respondedAt:now,acceptedAt:now,updatedAt:now}:item),nextRooms=rooms.map(item=>item.roomId===room.roomId?{...item,participantIds:unique([...item.participantIds,currentUserId]),updatedAt:now}:item);
    const savedInvites=saveStudyRoomInvitations(nextInvitations);
    if(!savedInvites.success)return {success:false,error:'The study-room invitation could not be accepted.'};
    const savedRooms=saveStudyRooms(nextRooms);
    if(!savedRooms.success){saveStudyRoomInvitations(invitations);return {success:false,error:'The study-room invitation could not be accepted.'}}
    const acceptedRoom=nextRooms.find(item=>item.roomId===room.roomId),student=current()?.name?.split(/\s+/)[0]||'A friend';
    notify('success',`You joined ${acceptedRoom.roomName}.`);
    notify('information',`${student} accepted your invitation to ${acceptedRoom.roomName}.`,{category:'study-room-invitation',userId:acceptedRoom.hostUserId,relatedRoomId:acceptedRoom.roomId,relatedInvitationId:invitationId,occurrenceKey:`study-room-accepted:${invitationId}`,saveToHistory:true});
    renderStudyRoomsPage();
    if(['waiting','active'].includes(acceptedRoom.status))openStudyRoomLobby(acceptedRoom.roomId);
    return {success:true,room:acceptedRoom};
  }

  async function declineStudyRoomInvitation({invitationId,currentUserId}){
    const invitations=loadStudyRoomInvitations(),invitation=invitations.find(item=>item.invitationId===invitationId);
    if(!invitation)return {success:false,error:'Study-room invitation not found.'};
    if(invitation.toUserId!==currentUserId)return {success:false,error:'You cannot respond to this invitation.'};
    if(invitation.status!=='pending')return {success:false,error:'This invitation is no longer pending.'};
    const ok=await confirmDialog({title:'Decline Study Room Invitation?',message:'Declining will release the reserved room spot.',okText:'Decline',cancelText:'Keep Invitation'});
    if(!ok)return {success:false,error:'cancelled'};
    const now=new Date().toISOString(),room=getStudyRoomById(invitation.roomId),next=invitations.map(item=>item.invitationId===invitationId?{...item,status:'declined',respondedAt:now,declinedAt:now,updatedAt:now}:item),saved=saveStudyRoomInvitations(next);
    if(!saved.success)return saved;
    if(room)updateStudyRoom(room.roomId,{declinedUserIds:unique([...(room.declinedUserIds||[]),currentUserId]),invitedUserIds:(room.invitedUserIds||[]).filter(id=>id!==currentUserId)});
    notify('information','Study-room invitation declined.');
    renderStudyRoomsPage();
    return {success:true};
  }

  function joinLaterStudyRoomInvitation({invitationId,currentUserId}){
    const invitations=loadStudyRoomInvitations(),invitation=invitations.find(item=>item.invitationId===invitationId);
    if(!invitation)return {success:false,error:'Study-room invitation not found.'};
    if(invitation.toUserId!==currentUserId)return {success:false,error:'You cannot respond to this invitation.'};
    if(invitation.status!=='pending')return {success:false,error:'This invitation is no longer pending.'};
    const now=new Date().toISOString(),saved=saveStudyRoomInvitations(invitations.map(item=>item.invitationId===invitationId?{...item,lastViewedAt:now,updatedAt:now}:item));
    if(saved.success)notify('information','Invitation saved for later.');
    renderStudyRoomsPage();
    return saved.success?{success:true}:saved;
  }

  function cancelStudyRoomInvitation({invitationId,currentUserId=current()?.id}={}){
    const invitations=loadStudyRoomInvitations(),invitation=invitations.find(item=>item.invitationId===invitationId),room=invitation?getStudyRoomById(invitation.roomId):null;
    if(!invitation||!room)return {success:false,error:'Study-room invitation not found.'};
    if(room.hostUserId!==currentUserId)return {success:false,error:'Only the room host can cancel invitations.'};
    if(invitation.status!=='pending')return {success:false,error:'Only pending invitations can be cancelled.'};
    const now=new Date().toISOString(),saved=saveStudyRoomInvitations(invitations.map(item=>item.invitationId===invitationId?{...item,status:'cancelled',cancelledAt:now,updatedAt:now}:item));
    if(saved.success){updateStudyRoom(room.roomId,{invitedUserIds:(room.invitedUserIds||[]).filter(id=>id!==invitation.toUserId)});notify('information','Study-room invitation cancelled.')}
    return saved.success?{success:true}:saved;
  }

  function joinFriendsRoom(roomId){
    const room=getStudyRoomById(roomId),u=current();
    if(!room||!u||!isFriendsOnlyRoom(room)||!areUsersFriends({userIdA:u.id,userIdB:room.hostUserId}))return {success:false,error:'You do not have access to join this room.'};
    const access=studyRoomSafetyService.validateRoomAccess({room,userId:u.id});
    if(!access.valid&&!(room.isLocked&&access.errors[0]?.includes('locked')))return {success:false,error:access.errors[0]};
    if(room.isLocked)return createOrUpdateJoinRequest(roomId,u.id);
    if(room.participantIds.length>=room.maximumMembers){notify('warning','This study room is full.');return {success:false,error:'This study room is full.'}};
    const result=updateStudyRoom(roomId,{participantIds:unique([...room.participantIds,u.id])});
    if(result.success){notify('success','Joined study room.');openStudyRoomLobby(result.room.roomId)}
    return result;
  }

  async function cancelStudyRoom(roomId){
    const room=getStudyRoomById(roomId),u=current();
    if(!room||!u||room.hostUserId!==u.id)return {success:false,error:'Only the host can cancel this room.'};
    const ok=await confirmDialog({title:'Cancel Study Room?',message:'This room will no longer be available to invited members.',okText:'Cancel Room',cancelText:'Keep Room',danger:true});
    if(!ok)return {success:false,error:'cancelled'};
    const now=new Date().toISOString(),result=updateStudyRoom(roomId,{status:'cancelled',cancelledAt:now,updatedAt:now});
    if(result.success&&callRuntime.roomId===roomId)cleanupActiveCallMedia({silent:true});
    if(result.success)saveStudyRoomInvitations(loadStudyRoomInvitations().map(invite=>invite.roomId===roomId&&invite.status==='pending'?{...invite,status:'cancelled',cancelledAt:now,updatedAt:now}:invite));
    if(result.success)notify('information','Study room cancelled.');
    return result;
  }

  function updateExpiredRooms(rooms){
    let changed=false;
    const now=Date.now();
    const next=rooms.map(room=>{
      if(room.status!=='scheduled'||!room.scheduledStartAt)return room;
      const expires=new Date(room.scheduledStartAt).getTime()+(Number(room.durationMinutes)||60)*60000+3600000;
      if(expires>now)return room;
      changed=true;
      saveStudyRoomInvitations(loadStudyRoomInvitations().map(invite=>invite.roomId===room.roomId&&invite.status==='pending'?{...invite,status:'expired',updatedAt:new Date().toISOString()}:invite));
      return {...room,status:'completed',completedAutomatically:true,updatedAt:new Date().toISOString()};
    });
    if(changed)saveStudyRooms(next);
    return next;
  }

  function formatRoomDate(room){
    const date=new Date(`${room.date}T${room.startTime||'00:00'}:00`);
    return Number.isNaN(date.getTime())?'Date not available':date.toLocaleString(undefined,{month:'long',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'});
  }
  function memberCount(room){return `${(room.participantIds||[]).length} of ${room.maximumMembers} members`}
  function roomStatusBadge(room){return `<span class="status-badge status-${safe(room.status)}">${safe(labels[room.status]||'Scheduled')}</span>`}
  function roomCard(room){
    const viewerId=current()?.id,pendingInvite=loadStudyRoomInvitations().find(invitation=>invitation.roomId===room.roomId&&invitation.toUserId===viewerId&&invitation.status==='pending'),host=viewerId===room.hostUserId,invited=Boolean(pendingInvite)&&!room.participantIds.includes(viewerId),participant=room.participantIds.includes(viewerId),friendJoin=!host&&!participant&&!invited&&isFriendsOnlyRoom(room)&&typeof areUsersFriends==='function'&&areUsersFriends({userIdA:viewerId,userIdB:room.hostUserId}),canCancel=host&&['scheduled','waiting'].includes(room.status);
    const inviteLabel=invited&&!room.participantIds.includes(current()?.id)?'<span class="pill purple-pill">INVITED</span>':'';
    return `<article class="study-room-card" aria-labelledby="room-${safe(room.roomId)}"><div class="study-room-card-header"><div>${inviteLabel}<h3 id="room-${safe(room.roomId)}">${safe(room.roomName)}</h3><p>${safe(room.course)} - ${safe(room.topic)}</p></div>${roomStatusBadge(room)}</div><div class="study-room-details"><div><span>Date</span><b>${safe(formatRoomDate(room))}</b></div><div><span>Members</span><b aria-label="${safe(memberCount(room))}">${safe(memberCount(room))}</b></div><div><span>Room Code</span><b>${host||participant?'Available in lobby':'Private'}</b></div><div><span>Duration</span><b>${room.durationMinutes} minutes</b></div><div><span>Privacy</span><b>${safe(privacyLabel(room.privacy))}</b></div><div><span>Camera</span><b>${room.cameraAllowed?'Allowed, optional':'Off'}</b></div><div><span>Microphone</span><b>${room.microphoneAllowed?'Allowed, optional':'Off'}</b></div></div>${room.description?`<p>${safe(room.description)}</p>`:''}<div class="study-room-actions"><button class="btn btn-secondary" data-room-open="${safe(room.roomId)}" type="button">Open Details</button>${(host||participant)&&!['completed','cancelled'].includes(room.status)?`<button class="btn btn-primary" data-room-lobby="${safe(room.roomId)}" type="button">${host&&room.status==='scheduled'?'Open Waiting Room':'Open Lobby'}</button>`:''}${invited?`<button class="btn btn-primary" data-room-accept="${safe(room.roomId)}" type="button">Accept Invitation</button><button class="btn btn-secondary" data-room-decline="${safe(room.roomId)}" type="button">Decline</button>`:''}${friendJoin?`<button class="btn btn-primary" data-room-join="${safe(room.roomId)}" type="button">Request to Join</button>`:''}${host&&['scheduled','waiting'].includes(room.status)?`<button class="btn btn-secondary" data-room-edit="${safe(room.roomId)}" type="button">Edit Room</button>`:''}${host&&room.status==='waiting'?`<button class="btn btn-primary" data-room-active="${safe(room.roomId)}" type="button">Start Session</button>`:''}${host&&room.status==='active'?`<button class="btn btn-secondary" data-room-complete="${safe(room.roomId)}" type="button">End Session</button>`:''}${canCancel?`<button class="btn btn-danger" data-room-cancel="${safe(room.roomId)}" type="button">Cancel Room</button>`:''}</div></article>`;
  }

  function listSection(title,id,rooms,empty){
    return `<section class="study-room-section" aria-labelledby="${id}-title"><div class="section-title-row"><div><h2 id="${id}-title">${safe(title)}</h2></div></div><div id="${id}" class="study-room-list">${rooms.length?rooms.map(roomCard).join(''):`<div class="empty-state card"><h2>${safe(empty)}</h2></div>`}</div></section>`;
  }

  function cameraLabel(allowed){return allowed?'Optional':'Not available in this room'}
  function hostPublicName(userId){return studyRoomSafetyService.getSafeDisplayName(userId)||'A friend'}
  function invitationCard(invitation){
    const room=getStudyRoomById(invitation.roomId);
    if(!room)return '';
    return `<article class="room-invitation-card" aria-labelledby="invite-${safe(invitation.invitationId)}"><header><h3 id="invite-${safe(invitation.invitationId)}">${safe(room.roomName)}</h3><span>${safe(invitationLabels[invitation.status]||'Pending')}</span></header><p>${safe(hostPublicName(invitation.fromUserId))} invited you to study.</p><dl><div><dt>Course</dt><dd>${safe(room.course)}</dd></div><div><dt>Topic</dt><dd>${safe(room.topic)}</dd></div><div><dt>Date</dt><dd>${safe(formatRoomDate(room))}</dd></div><div><dt>Members</dt><dd>${safe(memberCount(room))}</dd></div><div><dt>Camera</dt><dd>${safe(cameraLabel(room.cameraAllowed))}</dd></div><div><dt>Microphone</dt><dd>${safe(cameraLabel(room.microphoneAllowed))}</dd></div></dl><div class="room-invitation-actions">${invitation.status==='pending'?`<button class="btn btn-primary" data-invitation-accept="${safe(invitation.invitationId)}" type="button">Accept</button><button class="btn btn-secondary" data-invitation-decline="${safe(invitation.invitationId)}" type="button">Decline</button><button class="btn btn-secondary" data-invitation-later="${safe(invitation.invitationId)}" type="button">Join Later</button>`:''}<button class="btn btn-secondary" data-room-open="${safe(room.roomId)}" type="button">View Room</button></div></article>`;
  }

  function invitationSection(invitations){
    const rows=invitations.filter(invitation=>getStudyRoomById(invitation.roomId)).sort((a,b)=>{const pending=(b.status==='pending')-(a.status==='pending');return pending||new Date(b.sentAt)-new Date(a.sentAt)});
    return `<section class="study-room-section" aria-labelledby="room-invitations-title"><div class="section-title-row"><div><h2 id="room-invitations-title">Room Invitations</h2></div></div><div id="study-room-invitation-list" class="study-room-list room-invitation-list">${rows.length?rows.map(invitationCard).join(''):'<div class="empty-state card"><h2>No room invitations yet.</h2></div>'}</div></section>`;
  }

  function renderGuestStudyRooms(root){
    root.innerHTML='<div class="empty-state card study-room-guest"><h2>Create an account to create and join study rooms.</h2><p>Guest Mode can explore the rest of StudySpark, but account-based study rooms stay separate from guest data.</p><div class="study-room-actions"><button class="btn btn-primary" id="studyRoomsCreateAccount" type="button">Create Account</button><button class="btn btn-secondary" data-view="dashboard" type="button">Return to Dashboard</button></div></div>';
    $('#studyRoomsCreateAccount')?.addEventListener('click',()=>openAuth('signup'));
    $$('[data-view]',root).forEach(btn=>btn.onclick=()=>showView(btn.dataset.view));
  }

  function pendingReceivedInvitationCount(){
    const u=current();
    if(!u||isGuest())return 0;
    return loadStudyRoomInvitations().filter(invitation=>invitation.toUserId===u.id&&invitation.status==='pending').length;
  }

  function updateStudyRoomInvitationBadge(){
    const navButton=document.querySelector('#appNav [data-view="studyRooms"]');
    if(!navButton)return;
    let badge=navButton.querySelector('[data-study-room-badge]');
    if(!badge){
      badge=document.createElement('b');
      badge.className='notification-badge hidden';
      badge.dataset.studyRoomBadge='';
      navButton.appendChild(badge);
    }
    const count=pendingReceivedInvitationCount();
    badge.textContent=count>99?'99+':String(count);
    badge.classList.toggle('hidden',count===0);
    badge.setAttribute('aria-label',`${count} pending study-room invitation${count===1?'':'s'}`);
  }

  function renderStudyRoomsPage(){
    const root=$('#studyRoomsContent');
    if(!root||!current())return;
    if(isGuest())return renderGuestStudyRooms(root);
    const rooms=getStudyRoomsForUser();
    const receivedInvitations=loadStudyRoomInvitations().filter(invitation=>invitation.toUserId===current().id);
    const now=Date.now();
    const upcoming=rooms.filter(room=>['scheduled','waiting'].includes(room.status)&&(!room.scheduledStartAt||new Date(room.scheduledStartAt).getTime()+3600000>=now)).sort((a,b)=>new Date(a.scheduledStartAt)-new Date(b.scheduledStartAt));
    const created=rooms.filter(room=>room.hostUserId===current().id).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
    const past=rooms.filter(room=>['completed','cancelled'].includes(room.status)).sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt));
    root.innerHTML='<div class="prototype-banner card"><span class="pill blue-pill">Prototype Mode</span><h2>Study-room records are stored locally in this front-end prototype.</h2><p>They do not synchronize with other devices or users. Real online study rooms require a backend, live database and real-time communication service. Invitations are simulated in this front-end prototype and do not synchronize across devices.</p><div class="study-room-actions"><button class="btn btn-secondary" data-open-device-test type="button">Camera & Microphone Test</button></div></div>'+listSection('Upcoming Rooms','upcoming-study-room-list',upcoming,'No upcoming rooms yet.')+listSection('Rooms You Created','created-study-room-list',created,'You have not created a study room yet.')+invitationSection(receivedInvitations)+listSection('Past Rooms','past-study-room-list',past,'No past rooms yet.');
    bindStudyRoomActions(root);
  }

  function friendInviteHTML(selected=[]){
    const rows=studyRoomBlockService.filterBlockedUsers(acceptedFriendRows(),{idKey:'friendUserId'});
    if(!rows.length)return '<div class="empty-mini">No accepted friends available to invite yet.</div>';
    return rows.map(row=>{
      const label=typeof visiblePresenceLabel==='function'?visiblePresenceLabel(row.friendUserId):'Offline';
      const help=row.presence?.status==='offline'?`${row.profile.name} appears offline but can still receive the invitation later.`:row.presence?.status==='busy'?'This friend may not be available right now.':'';
      return `<label class="study-room-friend-option"><input type="checkbox" name="studyRoomInvite" value="${safe(row.friendUserId)}" ${selected.includes(row.friendUserId)?'checked':''}><span><b>${safe(row.profile.name)}</b><small>${safe(label)}</small>${help?`<small>${safe(help)}</small>`:''}</span></label>`;
    }).join('');
  }

  function roomInvitationStatus(room,userId){
    const invitation=loadStudyRoomInvitations().find(item=>item.roomId===room.roomId&&item.toUserId===userId&&['pending','accepted','declined','cancelled','expired'].includes(item.status));
    if((room.participantIds||[]).includes(userId))return 'Already joined';
    if(invitation?.status==='pending')return 'Invitation pending';
    if(invitation?.status==='accepted')return 'Accepted';
    if((room.removedUserIds||[]).includes(userId))return 'Unavailable';
    return '';
  }

  function inviteFriendRows(room,{selected=[],search='',presence='All Friends'}={}){
    const capacity=getStudyRoomCapacity(room),searchTerm=search.trim().toLowerCase(),presenceFilter=presence.toLowerCase().replace(/\s+/g,'-');
    let rows=studyRoomBlockService.filterBlockedUsers(acceptedFriendRows(),{viewerUserId:room.hostUserId,idKey:'friendUserId'}).filter(row=>{
      const name=row.profile.name.toLowerCase(),studentId=row.profile.studentId.toLowerCase();
      if(searchTerm&&!name.includes(searchTerm)&&!studentId.includes(searchTerm))return false;
      if(presenceFilter!=='all-friends'&&row.presence?.status!==presenceFilter)return false;
      return studyRoomBlockService.canInvite({senderUserId:room.hostUserId,receiverUserId:row.friendUserId,room}).allowed;
    });
    if(!rows.length)return '<div class="empty-state card"><h2>No friends are currently available to invite.</h2><p>You may have no accepted friends, or everyone may already be invited or joined.</p><button class="btn btn-secondary" data-view="friendsList" type="button">View My Friends</button><button class="btn btn-primary" data-view="studyPartnerResults" type="button">Find Study Partners</button></div>';
    return rows.map(row=>{
      const status=roomInvitationStatus(room,row.friendUserId),disabled=capacity.isFull||Boolean(status),checked=selected.includes(row.friendUserId)&&!disabled,label=typeof visiblePresenceLabel==='function'?visiblePresenceLabel(row.friendUserId):'Offline',course=row.profile.currentCourse||'No course selected',initials=safe(friendInitials?.(row.profile.name)||row.profile.name.slice(0,1)||'S');
      const reason=capacity.isFull?'This study room is full.':status;
      return `<label class="room-invite-friend ${disabled?'is-disabled':''}"><input type="checkbox" name="roomInviteFriend" value="${safe(row.friendUserId)}" ${checked?'checked':''} ${disabled?'disabled':''} aria-label="Invite ${safe(row.profile.name)}">${row.profile.profilePhoto?`<img class="room-invite-avatar" alt="" src="${safe(row.profile.profilePhoto)}">`:`<span class="room-invite-avatar">${initials}</span>`}<span class="room-invite-friend-details"><strong>${safe(row.profile.name)}</strong><span>${safe(row.profile.studentId)}</span><span>${safe(label)}</span><span>${safe(course)}</span>${reason?`<em>${safe(reason)}</em>`:''}</span></label>`;
    }).join('');
  }

  function invitePanelHTML(room,{selected=[],created=false}={}){
    const capacity=getStudyRoomCapacity(room);
    return `<div class="modal-overlay active" id="roomInviteDialog"><section class="modal-card room-invite-panel" role="dialog" aria-modal="true" aria-labelledby="invite-friends-title"><header><span class="pill blue-pill">${created?'Study Room Created':'Invite Friends'}</span><h2 id="invite-friends-title">${created?safe(room.roomName):'Invite Friends'}</h2><p id="room-invite-capacity" aria-live="polite">${capacity.isFull?'This study room is full.':`${capacity.availableSpots} invitation spot${capacity.availableSpots===1?'':'s'} available`}</p></header><label>Search Friends<input id="room-friend-search" type="search" placeholder="Search by name or Student ID"></label><label>Presence Filter<select id="room-presence-filter"><option>All Friends</option><option>Online</option><option>Studying</option><option>Busy</option><option>Offline</option></select></label><button class="btn btn-secondary" id="select-all-room-friends" type="button">Select All Available</button><div id="room-invite-friend-list" class="room-invite-friend-list">${inviteFriendRows(room,{selected})}</div><p id="room-invite-selected-count" aria-live="polite">0 friends selected</p><div class="study-room-form-actions"><button class="btn btn-primary" id="send-room-invitations" type="button">Send Invitations</button><button class="btn btn-secondary" id="skip-room-invitations" type="button">Skip for Now</button><button class="btn btn-secondary" id="view-created-room" type="button">View Room</button></div><p class="prototype-notice">Invited students become room participants only after accepting the invitation. Join Later keeps the invitation pending and does not add the student to the room.</p></section></div>`;
  }

  function openInviteFriendsPanel(roomId,{selected=[],created=false}={}){
    const room=getStudyRoomById(roomId),host=current();
    if(!room||!host||room.hostUserId!==host.id)return notify('warning','Only the room host can send invitations.');
    if(['completed','cancelled'].includes(room.status))return notify('warning','Invitations cannot be sent for this room.');
    $('#roomInviteDialog')?.remove();
    document.body.insertAdjacentHTML('beforeend',invitePanelHTML(room,{selected,created}));
    const dialog=$('#roomInviteDialog'),list=$('#room-invite-friend-list'),search=$('#room-friend-search'),filter=$('#room-presence-filter'),send=$('#send-room-invitations'),count=$('#room-invite-selected-count'),capacityText=$('#room-invite-capacity');
    let selection=new Set(selected);
    const selectedAvailable=()=>$$('input[name="roomInviteFriend"]:checked',list).map(input=>input.value);
    const updateCount=()=>{const values=selectedAvailable(),capacity=getStudyRoomCapacity(room);count.textContent=`${values.length} friend${values.length===1?'':'s'} selected`;capacityText.textContent=capacity.isFull?'This study room is full.':`${Math.max(0,capacity.availableSpots-values.length)} invitation spot${Math.max(0,capacity.availableSpots-values.length)===1?'':'s'} available`;send.disabled=!values.length};
    const rerender=()=>{list.innerHTML=inviteFriendRows(room,{selected:[...selection],search:search.value,presence:filter.value});bindList();updateCount()};
    const bindList=()=>{$$('input[name="roomInviteFriend"]',list).forEach(input=>input.onchange=()=>{const capacity=getStudyRoomCapacity(room),values=selectedAvailable();if(input.checked&&values.length>capacity.availableSpots){input.checked=false;notify('warning',`You can invite up to ${capacity.availableSpots} more ${capacity.availableSpots===1?'friend':'friends'}.`)}selection=new Set(selectedAvailable());updateCount()});$$('[data-view]',list).forEach(btn=>btn.onclick=()=>{dialog.remove();showView(btn.dataset.view)})};
    search.oninput=rerender;
    filter.onchange=rerender;
    $('#select-all-room-friends').onclick=()=>{const capacity=getStudyRoomCapacity(room);selection=new Set($$('input[name="roomInviteFriend"]:not(:disabled)',list).map(input=>input.value).slice(0,capacity.availableSpots));rerender();count.textContent=`${selection.size} of ${capacity.availableSpots} available spots selected.`};
    send.onclick=()=>{const values=selectedAvailable();if(!values.length){notify('warning','Select at least one friend.');return}send.disabled=true;$$('input,button,select',dialog).forEach(el=>{if(el!==send)el.disabled=true});send.textContent='Sending...';const result=sendStudyRoomInvitations({roomId:room.roomId,invitedUserIds:values});if(!result.success){send.disabled=false;$$('input,button,select',dialog).forEach(el=>el.disabled=false);send.textContent='Send Invitations';notify('error',result.error||'The study-room invitations could not be saved.');return}notify('success',result.invitations.length===1?'Study-room invitation sent.':'Study-room invitations sent.');dialog.remove();renderStudyRoomsPage()};
    $('#skip-room-invitations').onclick=()=>{dialog.remove();renderStudyRoomsPage();showView('studyRooms')};
    $('#view-created-room').onclick=()=>{dialog.remove();showView('studyRooms');setTimeout(()=>openStudyRoomDetails(room.roomId),0)};
    dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.remove()});
    bindList();
    updateCount();
    search.focus();
  }

  function courseListHTML(value=''){
    const courses=typeof selectedCourses==='function'?selectedCourses():[];
    return `<datalist id="studyRoomCourseOptions">${courses.map(course=>`<option value="${safe(course)}"></option>`).join('')}${value&&!courses.includes(value)?`<option value="${safe(value)}"></option>`:''}</datalist>`;
  }

  function roomFormHTML({room=null,preselectedFriendIds=[],preselectedCourse=''}={}){
    const draft=readDraft(),source=room||draft||{},selected=unique(preselectedFriendIds.length?preselectedFriendIds:source.invitedUserIds||[]);
    const course=preselectedCourse||source.course||selectedCourses?.()[0]||'';
    const currentPrivacy=normalizeRoomPrivacy(source.privacy);
    return `<div class="modal-overlay active" id="studyRoomDialog"><form id="create-study-room-form" class="modal-card study-room-form" role="dialog" aria-modal="true" aria-labelledby="studyRoomFormTitle" novalidate><h2 id="studyRoomFormTitle">${room?'Edit Study Room':'Create Study Room'}</h2><p>Do not include phone numbers, email addresses, home addresses or exact locations in room details.</p>${selected.length&&!room?`<p class="readiness-note">${safe(friendName(selected[0]))} will be invited after the room is created.</p>`:''}<label>Room Name <span class="required-marker">*</span><input id="study-room-name" name="roomName" minlength="3" maxlength="80" required value="${safe(source.roomName||'Biology Final Review')}" aria-describedby="study-room-name-error"><small id="study-room-name-error" data-error-for="roomName"></small></label><div class="form-row"><label>Course <span class="required-marker">*</span><input id="study-room-course" name="course" maxlength="80" required list="studyRoomCourseOptions" value="${safe(course)}" aria-describedby="study-room-course-error"><small id="study-room-course-error" data-error-for="course"></small></label><label>Topic <span class="required-marker">*</span><input id="study-room-topic" name="topic" maxlength="100" required value="${safe(source.topic||'Cell Respiration')}" aria-describedby="study-room-topic-error"><small id="study-room-topic-error" data-error-for="topic"></small></label></div>${courseListHTML(course)}<div class="form-row"><label>Date <span class="required-marker">*</span><input id="study-room-date" name="date" type="date" required min="${todayLocal()}" value="${safe(source.date||'')}" aria-describedby="study-room-date-error"><small id="study-room-date-error" data-error-for="date"></small></label><label>Start Time <span class="required-marker">*</span><input id="study-room-start-time" name="startTime" type="time" required value="${safe(source.startTime||'19:00')}" aria-describedby="study-room-start-time-error"><small id="study-room-start-time-error" data-error-for="startTime"></small></label></div><div class="form-row"><label>Maximum Members <span class="required-marker">*</span><input id="study-room-maximum-members" name="maximumMembers" type="number" min="2" max="100" step="1" required value="${safe(source.maximumMembers||5)}" aria-describedby="study-room-maximum-members-error"><small id="study-room-maximum-members-error" data-error-for="maximumMembers"></small></label><label>Duration<select id="study-room-duration" name="durationMinutes">${DURATIONS.map(value=>`<option value="${value}" ${Number(source.durationMinutes||60)===value?'selected':''}>${value} minutes</option>`).join('')}</select></label></div><label>Room Description<textarea id="study-room-description" name="description" maxlength="500" rows="3">${safe(source.description||'')}</textarea></label><label>Study Room Privacy<select id="study-room-privacy" name="privacy"><option value="private" ${currentPrivacy==='private'?'selected':''}>Private. Only members and invited users can access.</option><option value="invite-only" ${currentPrivacy==='invite-only'?'selected':''}>Invite Only. A host invitation is required.</option><option value="friends-only" ${currentPrivacy==='friends-only'?'selected':''}>Friends Only. Accepted friends can request to join.</option><option value="verified-school-only" ${currentPrivacy==='verified-school-only'?'selected':''}>Verified School Only. Requires backend verification.</option></select></label><label class="checkbox-row"><input id="study-room-requires-password" name="requiresPassword" type="checkbox" ${source.requiresPassword?'checked':''}> Require Room Password <small>Prototype only. Production passwords must be hashed and verified on a secure backend.</small></label><label id="study-room-password-row" ${source.requiresPassword?'':'hidden'}>Room Password<input id="study-room-password" name="roomPassword" type="password" minlength="8" maxlength="64" autocomplete="new-password" placeholder="8 to 64 characters"></label><label>Who Can Share Screen?<select id="study-room-screen-share-permission" name="screenSharePermission"><option value="all-participants" ${normalizeScreenSharePermission(source.screenSharePermission)==='all-participants'?'selected':''}>All Participants</option><option value="host-only" ${normalizeScreenSharePermission(source.screenSharePermission)==='host-only'?'selected':''}>Host Only</option></select></label><label class="checkbox-row"><input id="study-room-camera" name="cameraAllowed" type="checkbox" ${source.cameraAllowed!==false?'checked':''}> Allow Camera <small>Members may choose whether to turn on their camera.</small></label><label class="checkbox-row"><input id="study-room-microphone" name="microphoneAllowed" type="checkbox" ${source.microphoneAllowed!==false?'checked':''}> Allow Microphone <small>Members may choose whether to turn on their microphone.</small></label><fieldset class="study-room-invites"><legend>Invite Friends</legend>${friendInviteHTML(selected)}</fieldset><div id="study-room-form-errors" role="alert" aria-live="assertive"></div><div class="study-room-form-actions"><button class="btn btn-primary" id="study-room-submit" type="submit">${room?'Save Changes':'Create Room'}</button><button class="btn btn-secondary" id="study-room-clear-draft" type="button">Clear Draft</button><button class="btn btn-secondary" id="cancel-create-study-room" type="button">Cancel</button></div><p class="prototype-notice">New rooms are private by default. Camera, microphone, and screen sharing are optional and are never activated automatically.</p></form></div>`;
  }

  function readDraft(){try{return JSON.parse(sessionStorage.getItem(DRAFT_KEY)||'null')}catch{return null}}
  function saveDraftFromForm(form){const data=collectRoomForm(form);delete data.passwordValue;if(!privateInfo(Object.values(data).join(' ')))sessionStorage.setItem(DRAFT_KEY,JSON.stringify(data))}
  function clearDraft(){sessionStorage.removeItem(DRAFT_KEY)}
  function friendName(id){const row=acceptedFriendRows().find(item=>item.friendUserId===id);return row?.profile?.name||'This friend'}

  function collectRoomForm(form){
    return normalizeStudyRoomInput({roomName:$('#study-room-name',form)?.value,course:$('#study-room-course',form)?.value,topic:$('#study-room-topic',form)?.value,description:$('#study-room-description',form)?.value,date:$('#study-room-date',form)?.value,startTime:$('#study-room-start-time',form)?.value,durationMinutes:$('#study-room-duration',form)?.value,maximumMembers:$('#study-room-maximum-members',form)?.value,cameraAllowed:$('#study-room-camera',form)?.checked,microphoneAllowed:$('#study-room-microphone',form)?.checked,screenSharePermission:$('#study-room-screen-share-permission',form)?.value,privacy:$('#study-room-privacy',form)?.value,requiresPassword:$('#study-room-requires-password',form)?.checked,passwordValue:$('#study-room-password',form)?.value,invitedUserIds:$$('input[name="studyRoomInvite"]:checked',form).map(input=>input.value)});
  }

  function renderFormErrors(errors=[]){
    const box=$('#study-room-form-errors');
    if(box)box.innerHTML=errors.length?`<p>${safe(errors[0])}</p>`:'';
    const first=$('#create-study-room-form input:invalid')||$('#study-room-name');
    if(errors.length)first?.focus();
  }

  function openCreateStudyRoom(options={}){
    if(!current()||isGuest()){
      if(window.requireStudyTogetherAccount)window.requireStudyTogetherAccount({intendedRoute:'studyRooms',featureName:'Study Rooms',returnFocus:document.activeElement});
      else showView('studyRooms');
      return
    }
    document.body.insertAdjacentHTML('beforeend',roomFormHTML(options));
    const dialog=$('#studyRoomDialog'),form=$('#create-study-room-form'),submit=$('#study-room-submit');
    form.addEventListener('input',()=>saveDraftFromForm(form));
    form.addEventListener('change',()=>saveDraftFromForm(form));
    $('#study-room-requires-password',form)?.addEventListener('change',event=>{$('#study-room-password-row',form).hidden=!event.target.checked});
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      const data=collectRoomForm(form);
      if(options.room?.requiresPassword&&data.requiresPassword&&!data.passwordValue)data.passwordUpdatedAt=options.room.passwordUpdatedAt||new Date().toISOString();
      if(data.requiresPassword&&data.passwordValue)data.passwordUpdatedAt=new Date().toISOString();
      const validation=validateNewStudyRoom({...data,hostUserId:current().id});
      if(!validation.valid)return renderFormErrors(validation.errors);
      submit.disabled=true;
      submit.textContent=options.room?'Saving...':'Creating...';
      const result=options.room?updateStudyRoom(options.room.roomId,data):await createStudyRoom(data);
      if(!result.success){submit.disabled=false;submit.textContent=options.room?'Save Changes':'Create Room';renderFormErrors([result.error||'The study room could not be saved.']);notify('error',result.error||'The study room could not be saved.');return}
      dialog.remove();
      renderStudyRoomsPage();
      if(options.room)showView('studyRooms');
      else openInviteFriendsPanel(result.room.roomId,{selected:data.invitedUserIds,created:true});
    });
    $('#cancel-create-study-room',form).onclick=async()=>{const dirty=Boolean(sessionStorage.getItem(DRAFT_KEY));if(dirty){const ok=await confirmDialog({title:'Discard Study Room Draft?',message:'You have unsaved study-room details.',okText:'Discard Draft',cancelText:'Keep Editing'});if(!ok)return}dialog.remove()};
    $('#study-room-clear-draft',form).onclick=()=>{clearDraft();notify('information','Study room draft cleared.')};
    dialog.addEventListener('click',event=>{if(event.target===dialog)$('#cancel-create-study-room',form).click()});
    dialog.addEventListener('keydown',event=>{if(event.key==='Escape'&&!sessionStorage.getItem(DRAFT_KEY))dialog.remove()});
    $('#study-room-name',form)?.focus();
  }

  function publicStudentProfile(userId){
    return studyRoomSafetyService.sanitizePublicProfile(userId);
  }

  function validateStudyRoomLobbyAccess({room,userId}){
    const errors=[];
    if(!room){errors.push('Study room not found.');return {valid:false,errors}}
    const safety=studyRoomSafetyService.validateRoomAccess({room,userId});
    if(!safety.valid)errors.push(...safety.errors.filter(error=>!error.includes('locked')));
    const isHost=room.hostUserId===userId,isParticipant=Array.isArray(room.participantIds)&&room.participantIds.includes(userId);
    if(!isHost&&!isParticipant)errors.push('You do not have access to this study-room lobby.');
    if((room.removedUserIds||[]).includes(userId))errors.push('You no longer have access to this study room.');
    if(userId&&typeof areUsersBlocked==='function'&&areUsersBlocked({userIdA:room.hostUserId,userIdB:userId}))errors.push('This study room is not available.');
    return {valid:errors.length===0,errors};
  }

  function ensureStudyRoomLobbyView(){
    if($('#studyRoomLobbyView'))return;
    const anchor=$('#studyRoomsView');
    const html='<section class="app-view" id="studyRoomLobbyView"><main id="study-room-lobby-page" aria-labelledby="study-room-lobby-title"><div id="studyRoomLobbyContent"></div></main></section>';
    if(anchor)anchor.insertAdjacentHTML('afterend',html);
  }

  function formatDateOnly(room){
    const date=new Date(`${room.date}T00:00:00`);
    return Number.isNaN(date.getTime())?'Date not available':date.toLocaleDateString(undefined,{month:'long',day:'numeric',year:'numeric'});
  }

  function formatTimeOnly(room){
    const date=new Date(`${room.date}T${room.startTime||'00:00'}:00`);
    return Number.isNaN(date.getTime())?'Time not available':date.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'});
  }

  function lobbyMemberCards(room){
    return (room.participantIds||[]).map(userId=>{
      if(userId!==current()?.id&&typeof areUsersBlocked==='function'&&areUsersBlocked({userIdA:current()?.id,userIdB:userId}))return '';
      const profile=publicStudentProfile(userId),role=userId===room.hostUserId?'Host':'Participant',state=roomPresenceState(room.roomId,userId),muted=isRoomUserMuted(room,userId);
      const label={['in-lobby']:'In Lobby',['in-room']:'Joined',['left']:'Left',['not-present']:'Not Yet in Lobby'}[state]||'Not Yet in Lobby';
      const photo=profile.profilePhoto?`<img alt="" src="${safe(profile.profilePhoto)}">`:`<span>${safe(profile.initials)}</span>`;
      return `<article class="lobby-member-card"><div class="lobby-member-identity"><span class="lobby-avatar ${profile.profilePhoto?'has-photo':''}">${photo}</span><span><b>${safe(profile.name)} ${role==='Host'?'<span class="host-badge">Host</span>':''}</b><small>${safe(role)}${muted?' - Muted by Host':''}</small></span></div><strong>${safe(label)}</strong></article>`;
    }).join('');
  }

  function renderStudyRoomAccessError(message='You do not have access to this study-room lobby.'){
    ensureStudyRoomLobbyView();
    const root=$('#studyRoomLobbyContent');
    if(root)root.innerHTML=`<div class="empty-state card"><h2>${safe(message)}</h2><button class="btn btn-primary" data-view="studyRooms" type="button">Back to Study Rooms</button></div>`;
    $$('[data-view]',root).forEach(btn=>btn.onclick=()=>showView(btn.dataset.view));
    notify('warning',message);
  }

  function lobbyHTML(room){
    const currentUser=current(),host=publicStudentProfile(room.hostUserId),prefs=getDevicePreference(room.roomId,currentUser.id),isHost=room.hostUserId===currentUser.id,muted=isRoomUserMuted(room,currentUser.id),canJoin=['waiting','active'].includes(room.status),cameraDisabled=!room.cameraAllowed,micDisabled=!room.microphoneAllowed||muted;
    const joinMessage=room.isLocked&&!isHost?'This study room is currently locked.':canJoin?'':'The host has not opened the room yet.';
    return `<header class="study-room-lobby-header"><div><p class="eyebrow">Study Room Lobby</p><h1 id="study-room-lobby-title" tabindex="-1">${safe(room.roomName)}</h1><p>${safe(room.course)} - ${safe(room.topic)}</p></div>${roomStatusBadge(room)}</header><div class="study-room-lobby-layout"><section class="lobby-room-details card" aria-labelledby="lobby-details-title"><h2 id="lobby-details-title">Room Details</h2><dl><div><dt>Host</dt><dd>${safe(host.name)}</dd></div><div><dt>Members</dt><dd aria-label="${safe((room.participantIds||[]).length+' of '+room.maximumMembers+' members')}">${safe((room.participantIds||[]).length)} of ${safe(room.maximumMembers)}</dd></div><div><dt>Date</dt><dd>${safe(formatDateOnly(room))}</dd></div><div><dt>Start Time</dt><dd>${safe(formatTimeOnly(room))}</dd></div><div><dt>Duration</dt><dd>${safe(room.durationMinutes)} minutes</dd></div><div><dt>Room Code</dt><dd><code>${safe(room.roomCode)}</code></dd></div><div><dt>Camera</dt><dd>${room.cameraAllowed?'Optional':'Not available'}</dd></div><div><dt>Microphone</dt><dd>${room.microphoneAllowed?'Optional':'Not available'}</dd></div><div><dt>Privacy</dt><dd>${safe(privacyLabel(room.privacy))}</dd></div></dl><button class="btn btn-secondary" data-copy-room-code="${safe(room.roomCode)}" type="button">Copy Room Code</button><p class="prototype-notice">This front-end prototype does not provide a real multi-user audio or video call. Camera and microphone previews are local to this browser. Real online calls require a backend, live database and real-time communication service such as WebRTC.</p></section><section class="lobby-device-panel card" aria-labelledby="lobby-device-title"><h2 id="lobby-device-title">Camera and Microphone</h2><div id="lobby-device-alert" role="alert" aria-live="assertive"></div><div id="lobby-camera-preview" class="lobby-camera-preview" aria-label="Local camera preview">${prefs.cameraEnabled?'<video autoplay muted playsinline></video>':`<div class="camera-off-placeholder"><span>${safe(publicStudentProfile(currentUser.id).initials)}</span><b>Camera is off</b></div>`}</div><button class="btn btn-secondary" data-toggle-lobby-camera aria-pressed="${prefs.cameraEnabled?'true':'false'}" ${cameraDisabled?'disabled':''} type="button">${cameraDisabled?'Camera is not available in this room.':`Camera: ${prefs.cameraEnabled?'On':'Off'}`}</button><button class="btn btn-secondary" data-toggle-lobby-microphone aria-pressed="${prefs.microphoneEnabled?'true':'false'}" ${micDisabled?'disabled':''} type="button">${micDisabled?'Microphone is not available in this room.':`Microphone: ${prefs.microphoneEnabled?'On':'Off'}`}</button><p class="microphone-indicator">Microphone ${prefs.microphoneEnabled?'on':'off'}</p>${joinMessage?`<p class="readiness-note">${safe(joinMessage)}</p>`:''}<button class="btn btn-primary" data-join-lobby-room="${safe(room.roomId)}" ${canJoin?'':'disabled'} type="button">Join Study Room</button><button class="btn btn-secondary" data-leave-lobby-room="${safe(room.roomId)}" type="button">Leave Room</button></section></div>${studyRoomSafetySettingsHTML(room)}<section class="card lobby-members-section" aria-labelledby="lobby-members-title"><div class="card-head"><div><h2 id="lobby-members-title">Members</h2><p>${safe((room.participantIds||[]).length)} of ${safe(room.maximumMembers)} members</p></div></div><div class="lobby-member-list">${lobbyMemberCards(room)}</div></section>${isHost?hostControlsHTML(room):secondaryLobbyActionsHTML(room)}`;
  }

  function studyRoomSafetySettingsHTML(room){
    const warnings=studyRoomSafetyService.getSafetyWarnings(room);
    return `<section id="study-room-safety-settings" class="card study-room-safety-card" aria-labelledby="study-room-safety-title"><div class="card-head"><div><p class="eyebrow">Privacy and Safety</p><h2 id="study-room-safety-title">Study Room Safety</h2><p>Study rooms are private by default and use display names instead of full legal names.</p></div><span class="safety-badge">${safe(privacyLabel(room.privacy))}</span></div><div class="room-safety-summary"><span>Room code required</span><span>Contact sharing off</span><span>Recording off</span><span>${room.isLocked?'Room locked':'Room unlocked'}</span></div><div class="room-safety-warning">${warnings.map(warning=>`<p>${safe(warning)}</p>`).join('')}</div><div class="study-room-actions"><button class="btn btn-secondary" data-open-blocked-users type="button">Open Blocked Users</button><button class="btn btn-secondary" data-report-study-room="${safe(room.roomId)}" type="button">Report Room</button><button class="btn btn-danger" data-leave-lobby-room="${safe(room.roomId)}" type="button">Leave Room Now</button></div></section>`;
  }

  function hostControlsHTML(room){
    const participants=(room.participantIds||[]).filter(id=>id!==room.hostUserId);
    const requests=pendingJoinRequestsForRoom(room.roomId);
    const participantOptions=participants.map(id=>`<option value="${safe(id)}">${safe(publicStudentProfile(id).name)}</option>`).join('');
    const requestsHTML=requests.length?requests.map(request=>`<article class="join-request-row"><span><b>${safe(publicStudentProfile(request.userId).name)}</b><small>Requested ${safe(relativeTime(request.requestedAt))}</small></span><div><button class="btn btn-primary" data-host-approve-request="${safe(request.requestId)}" type="button">Approve</button><button class="btn btn-secondary" data-host-decline-request="${safe(request.requestId)}" type="button">Decline</button></div></article>`).join(''):'<p class="empty-mini">No pending join requests.</p>';
    return `<section id="host-controls-panel" class="card host-controls-card" aria-labelledby="host-controls-title"><div class="card-head"><div><p class="eyebrow">Local Host Controls Prototype</p><h2 id="host-controls-title">Host Controls</h2><p>Only the room host can perform management actions. Real host permissions require backend authorization.</p></div><span class="host-lock-status">${room.isLocked?'Locked':'Unlocked'}</span></div><div class="host-control-actions"><button class="btn btn-secondary" data-host-open-waiting="${safe(room.roomId)}" ${room.status==='scheduled'?'':'disabled'} type="button">Open Waiting Room</button><button class="btn btn-primary" data-host-start-session="${safe(room.roomId)}" ${['scheduled','waiting'].includes(room.status)?'':'disabled'} type="button">Start Session</button><button class="btn btn-danger" data-host-end-session="${safe(room.roomId)}" ${['waiting','active'].includes(room.status)?'':'disabled'} type="button">End Session</button><button class="btn btn-secondary" data-host-lock-room="${safe(room.roomId)}" ${room.isLocked?'disabled':''} type="button">Lock Room</button><button class="btn btn-secondary" data-host-unlock-room="${safe(room.roomId)}" ${room.isLocked?'':'disabled'} type="button">Unlock Room</button><button class="btn btn-secondary" data-open-room-invites="${safe(room.roomId)}" type="button">Invite Friends</button><button class="btn btn-secondary" data-host-manage-members="${safe(room.roomId)}" ${participants.length?'':'disabled'} type="button">Remove or Mute Participant</button><button class="btn btn-secondary" data-host-change-topic="${safe(room.roomId)}" type="button">Change Study Topic</button><button class="btn btn-secondary" data-host-room-settings="${safe(room.roomId)}" type="button">Room Settings</button><button class="btn btn-secondary" data-room-timer-start="${safe(room.roomId)}" type="button">Start Timer</button><button class="btn btn-secondary" data-room-timer-pause="${safe(room.roomId)}" type="button">Pause Timer</button><button class="btn btn-secondary" data-room-timer-reset="${safe(room.roomId)}" type="button">Reset Timer</button><button class="btn btn-secondary" data-copy-room-code="${safe(room.roomCode)}" type="button">Copy Room Code</button><button class="btn btn-danger" data-room-cancel="${safe(room.roomId)}" ${['scheduled','waiting'].includes(room.status)?'':'disabled'} type="button">Cancel Room</button></div><div class="host-setting-grid"><label>Screen Sharing Permissions<select data-host-screen-share-permission="${safe(room.roomId)}"><option value="all-participants" ${normalizeScreenSharePermission(room.screenSharePermission)==='all-participants'?'selected':''}>All Participants</option><option value="host-only" ${normalizeScreenSharePermission(room.screenSharePermission)==='host-only'?'selected':''}>Host Only</option></select></label><label>Room Chat<select data-host-chat-enabled="${safe(room.roomId)}"><option value="true" ${room.chatEnabled!==false?'selected':''}>On</option><option value="false" ${room.chatEnabled===false?'selected':''}>Off</option></select></label><label>Transfer Host<select data-host-transfer-select="${safe(room.roomId)}"><option value="">Choose participant</option>${participantOptions}</select></label><button class="btn btn-secondary" data-host-transfer-submit="${safe(room.roomId)}" ${participants.length?'':'disabled'} type="button">Transfer Host</button></div><section class="join-request-list" aria-labelledby="join-requests-title"><h3 id="join-requests-title">Approve Join Requests</h3>${requestsHTML}</section><p class="prototype-notice">In this front-end prototype, host controls are simulated locally. The full version requires authenticated backend permission checks.</p></section>`;
  }

  function secondaryLobbyActionsHTML(room){
    const permanent=current()?.id!==room.hostUserId?`<button class="btn btn-danger" data-leave-room-permanently="${safe(room.roomId)}" type="button">Leave Study Room Permanently</button>`:'';
    return `<div class="lobby-secondary-actions"><button class="btn btn-secondary" data-report-study-room="${safe(room.roomId)}" type="button">Report Room</button><button class="btn btn-danger" data-block-room-user="${safe(room.roomId)}" type="button">Block User</button>${permanent}</div>`;
  }

  async function renderStudyRoomLobby(roomId=sessionStorage.getItem('selectedStudyRoomLobbyId')){
    ensureStudyRoomLobbyView();
    const currentUser=current(),room=getStudyRoomById(roomId),access=validateStudyRoomLobbyAccess({room,userId:currentUser?.id});
    if(!access.valid)return renderStudyRoomAccessError(access.errors[0]);
    sessionStorage.setItem('selectedStudyRoomLobbyId',room.roomId);
    let effectiveRoom=room;
    if(room.hostUserId===currentUser.id&&room.status==='scheduled'){
      const opened=updateStudyRoom(room.roomId,{status:'waiting',startedAt:null});
      if(opened.success){
        effectiveRoom=opened.room;
        notify('success','Study-room lobby opened.');
        notifyRoomParticipants(effectiveRoom,`${effectiveRoom.roomName} is now open.`,currentUser.id);
      }
    }
    updateStudyRoomPresence({roomId:effectiveRoom.roomId,userId:currentUser.id,state:'in-lobby'});
    const root=$('#studyRoomLobbyContent');
    root.innerHTML=lobbyHTML(getStudyRoomById(effectiveRoom.roomId)||effectiveRoom);
    bindStudyRoomLobbyActions(root);
    requestAnimationFrame(()=>$('#study-room-lobby-title')?.focus());
  }

  async function openStudyRoomLobby(roomId){
    ensureStudyRoomLobbyView();
    sessionStorage.setItem('selectedStudyRoomLobbyId',roomId);
    await showView('studyRoomLobby',{roomId});
    renderStudyRoomLobby(roomId);
  }

  async function copyRoomCode(roomCode){
    const normalizedCode=normalizeRoomCode(roomCode);
    if(!normalizedCode)return {success:false,error:'Room code is unavailable.'};
    try{
      if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(normalizedCode);
      else{
        const temporaryInput=document.createElement('textarea');
        temporaryInput.value=normalizedCode;
        temporaryInput.setAttribute('readonly','');
        temporaryInput.style.position='fixed';
        temporaryInput.style.opacity='0';
        document.body.appendChild(temporaryInput);
        temporaryInput.select();
        const copied=document.execCommand('copy');
        temporaryInput.remove();
        if(!copied)throw new Error('Copy failed.');
      }
      return {success:true};
    }catch(error){
      return {success:false,error:'Room code could not be copied.'};
    }
  }

  function alertLobbyDevice(message){
    const alert=$('#lobby-device-alert');
    if(alert)alert.textContent=message||'';
    if(message)notify('warning',message);
  }

  async function setLobbyDevice({roomId,type,enabled}){
    const room=getStudyRoomById(roomId),u=current(),prefs=getDevicePreference(roomId,u?.id);
    if(!room||!u)return;
    const mediaAccess=studyRoomSafetyService.canActivateMedia({room,userId:u.id,type});
    if(!mediaAccess.valid)return alertLobbyDevice(mediaAccess.errors[0]);
    if(type==='microphone'&&isRoomUserMuted(room,u.id))return alertLobbyDevice('You have been muted by the room host.');
    if(!enabled){
      if(type==='camera')stopMediaStream(window.currentStudyRoomCameraStream),window.currentStudyRoomCameraStream=null;
      if(type==='microphone')stopMediaStream(window.currentStudyRoomMicrophoneStream),window.currentStudyRoomMicrophoneStream=null;
      saveDevicePreference({...prefs,roomId,userId:u.id,[type==='camera'?'cameraEnabled':'microphoneEnabled']:false});
      renderStudyRoomLobby(roomId);
      return;
    }
    try{
      if(!navigator.mediaDevices?.getUserMedia)throw new Error('Media devices are not supported.');
      const okay=await confirmDialog({title:`Turn On ${type==='camera'?'Camera':'Microphone'}?`,message:`StudySpark will ask your browser for ${type==='camera'?'camera':'microphone'} permission only after this click. Camera and microphone never activate automatically, and StudySpark does not record study-room audio, video or screen sharing by default.`,okText:`Turn On ${type==='camera'?'Camera':'Microphone'}`,cancelText:'Cancel'});
      if(!okay)return;
      const stream=await navigator.mediaDevices.getUserMedia(type==='camera'?{video:true,audio:false}:{video:false,audio:true});
      if(type==='camera'){
        stopMediaStream(window.currentStudyRoomCameraStream);
        window.currentStudyRoomCameraStream=stream;
        saveDevicePreference({...prefs,roomId,userId:u.id,cameraEnabled:true});
      }else{
        stopMediaStream(window.currentStudyRoomMicrophoneStream);
        window.currentStudyRoomMicrophoneStream=stream;
        saveDevicePreference({...prefs,roomId,userId:u.id,microphoneEnabled:true});
      }
      renderStudyRoomLobby(roomId);
      const video=$('#lobby-camera-preview video');
      if(video&&type==='camera')video.srcObject=stream;
    }catch(error){
      if(type==='camera')stopMediaStream(window.currentStudyRoomCameraStream),window.currentStudyRoomCameraStream=null;
      if(type==='microphone')stopMediaStream(window.currentStudyRoomMicrophoneStream),window.currentStudyRoomMicrophoneStream=null;
      saveDevicePreference({...prefs,roomId,userId:u.id,[type==='camera'?'cameraEnabled':'microphoneEnabled']:false});
      renderStudyRoomLobby(roomId);
      alertLobbyDevice(type==='camera'?'Camera permission was not granted.':'Microphone permission was not granted.');
    }
  }

  async function joinStudyRoomFromLobby({roomId,cameraEnabled=false,microphoneEnabled=false}){
    const currentUser=current(),room=getStudyRoomById(roomId);
    if(!currentUser)return {success:false,error:'You must be signed in to join this study room.'};
    if(!room)return {success:false,error:'Study room not found.'};
    const access=validateStudyRoomLobbyAccess({room,userId:currentUser.id});
    if(!access.valid)return {success:false,error:access.errors[0]};
    if(!['waiting','active'].includes(room.status))return {success:false,error:'The study room is not open yet.'};
    const finalCameraState=Boolean(cameraEnabled&&room.cameraAllowed),finalMicrophoneState=Boolean(microphoneEnabled&&room.microphoneAllowed);
    updateStudyRoomPresence({roomId:room.roomId,userId:currentUser.id,state:'in-room'});
    saveCurrentRoomSession({roomId:room.roomId,userId:currentUser.id,cameraEnabled:finalCameraState,microphoneEnabled:finalMicrophoneState,joinedAt:new Date().toISOString()});
    return {success:true,room,cameraEnabled:finalCameraState,microphoneEnabled:finalMicrophoneState};
  }

  function formatCallTimer(seconds=callRuntime.elapsedSeconds){
    const minutes=Math.floor(seconds/60),remaining=seconds%60;
    return `${String(minutes).padStart(2,'0')}:${String(remaining).padStart(2,'0')}`;
  }

  function updateCallTimerDisplay(){
    const timer=$('#study-call-timer');
    if(timer)timer.textContent=formatCallTimer();
  }

  function cleanupActiveCallMedia({silent=true}={}){
    studyRoomMediaService.stopAllLocalMedia({silent});
    peerConnectionService.closeAll();
    signalingService.disconnect();
    closeStudyRoomChat({silent:true});
    closeStudyRoomAI({silent:true});
    studyRoomTimerService.cleanup({roomId:callRuntime.roomId});
    studyRoomGoalService.cleanup({roomId:callRuntime.roomId});
    callRuntime.chatOpen=false;
    callRuntime.aiOpen=false;
    callRuntime.aiCurrentResult=null;
    callRuntime.participantsOpen=false;
    callStateManager.stopTimer();
    unregisterActiveCallTab();
  }

  function callConnectionLabel(){
    return ({idle:'Local Device Test Only',joining:'Joining...',waiting:'Waiting for host...',connecting:'Connecting...',connected:'Connected',reconnecting:'Reconnecting...',ending:'Ending...',ended:'Disconnected',failed:'Disconnected'}[callRuntime.state]||'Local Device Test Only');
  }

  function callParticipantTiles(room){
    const participants=roomConnectionManager.currentParticipants(room.roomId);
    return participants.map((participant,index)=>{
      const isCurrent=participant.id===current()?.id,remote=callRuntime.remoteParticipants.get(participant.id)||{};
      const isHost=participant.id===room.hostUserId,isMuted=isRoomUserMuted(room,participant.id);
      const cameraOn=isCurrent?Boolean(callMediaState.cameraStream||callMediaState.screenStream):Boolean(remote.cameraEnabled);
      const micOn=!isMuted&&(isCurrent?Boolean(callMediaState.microphoneStream):Boolean(remote.microphoneEnabled));
      const sharingScreen=callMediaState.currentScreenSharerUserId===participant.id||remote.sharingScreen===true;
      const isSpeaker=(callMediaState.activeSpeakerUserId&&callMediaState.activeSpeakerUserId===participant.id)||(!callMediaState.activeSpeakerUserId&&index===0);
      const connectionState=isCurrent?'Local device test':(remote.connectionState||'Waiting for backend');
      const media=isCurrent&&callMediaState.screenStream?'<div class="call-screen-placeholder">Your screen is being shared.</div>':isCurrent&&callMediaState.cameraStream?'<video autoplay muted playsinline data-local-call-video></video>':`<div class="call-avatar-placeholder"><span>${safe(participant.initials)}</span><b>${cameraOn?'Video unavailable':'Camera is off'}</b></div>`;
      return `<article class="call-participant-tile participant-tile ${isSpeaker?'active-speaker is-speaking':''} ${sharingScreen?'is-sharing-screen':''} ${isMuted?'is-muted':''}" aria-label="${safe(participant.name)} participant tile"><div class="call-media-frame participant-media">${media}</div><div class="call-tile-meta participant-tile-footer"><div><b>${safe(participant.name)}${isCurrent?' (You)':''} ${isHost?'<span class="host-badge">Host</span>':''}</b><small>${safe(participant.role||'Student')} - ${safe(connectionState)}</small></div><div class="participant-media-status">${sharingScreen?'<span>Sharing Screen</span>':''}<span>${cameraOn?'Camera On':'Camera Off'}</span><span>${micOn?'Microphone On':'Microphone Off'}</span>${isMuted?'<span>Muted by Host</span>':''}${isSpeaker&&!isMuted?'<span class="speaking-indicator">Speaking</span>':''}</div></div></article>`;
    }).join('');
  }

  function formatShareTimer(){
    if(!callMediaState.screenShareStartedAt)return '';
    const seconds=Math.max(0,Math.floor((Date.now()-new Date(callMediaState.screenShareStartedAt).getTime())/1000));
    return `Sharing for ${formatCallTimer(seconds)}`;
  }

  function screenShareBannerHTML(){
    const sharer=screenSharerProfile();
    if(!sharer)return '<div id="screen-sharing-banner" class="screen-sharing-banner" role="status" aria-live="polite" hidden><strong id="screen-sharing-user"></strong></div>';
    const currentUserSharing=sharer.id===current()?.id;
    return `<div id="screen-sharing-banner" class="screen-sharing-banner" role="status" aria-live="polite"><strong id="screen-sharing-user">${currentUserSharing?'You':safe(sharer.name)}</strong> ${currentUserSharing?'are sharing your screen.':'is sharing their screen.'} <span>${safe(formatShareTimer())}</span></div>`;
  }

  function screenShareStageHTML(){
    const sharer=screenSharerProfile(),active=Boolean(sharer),isCurrent=sharer?.id===current()?.id,fullscreenSupported=typeof document!=='undefined'&&typeof document.documentElement?.requestFullscreen==='function';
    return `<section id="screen-share-stage" class="screen-share-stage" aria-labelledby="screen-share-stage-title" ${active?'':'hidden'}><header class="screen-share-stage-header"><div><h2 id="screen-share-stage-title">Shared Screen</h2><p id="screen-share-stage-status" role="status">${active?safe(screenShareStatusText()):'No one is sharing a screen.'}</p><p class="prototype-notice">Local Screen-Share Test Only. Other students cannot see this share until the signaling backend is connected.</p></div><div class="screen-share-view-actions">${fullscreenSupported?'<button class="btn btn-secondary" id="open-screen-share-fullscreen" data-screen-fullscreen type="button">Full Screen</button>':''}${isCurrent?'<button class="btn btn-danger" id="stop-current-screen-share" data-call-toggle-screen type="button">Stop Sharing</button>':''}</div></header><div class="shared-screen-frame"><video id="shared-screen-video" autoplay muted playsinline aria-label="${active?safe(screenShareStatusText()):'Shared screen video'}"></video>${active&&!isCurrent&&!callMediaState.remoteScreenStreams.get(sharer.id)?'<div class="call-avatar-placeholder"><span>'+safe(sharer.initials)+'</span><b>Remote screen video requires the signaling backend.</b></div>':''}</div></section>`;
  }

  function activeScreenShareHostControlsHTML(room){
    if(room.hostUserId!==current()?.id)return '';
    return `<section class="card screen-share-host-controls" aria-labelledby="active-screen-share-controls-title"><div><h2 id="active-screen-share-controls-title">Room Controls</h2><p>Apply these rules to future screen-sharing and chat actions.</p></div><label>Who Can Share Screen?<select data-host-screen-share-permission="${safe(room.roomId)}"><option value="all-participants" ${normalizeScreenSharePermission(room.screenSharePermission)==='all-participants'?'selected':''}>All Participants</option><option value="host-only" ${normalizeScreenSharePermission(room.screenSharePermission)==='host-only'?'selected':''}>Host Only</option></select></label><label>Room Chat<select data-host-chat-enabled="${safe(room.roomId)}"><option value="true" ${room.chatEnabled!==false?'selected':''}>On</option><option value="false" ${room.chatEnabled===false?'selected':''}>Off</option></select></label><button class="btn btn-secondary" data-host-request-stop-share type="button">Request Stop Sharing</button></section>`;
  }

  function roomChatUnread(roomId){return callRuntime.chatUnreadCounts.get(roomId)||0}
  function markRoomChatSeen(roomId){
    callRuntime.chatUnreadCounts.set(roomId,0);
    callRuntime.chatLastSeen.set(roomId,new Date().toISOString());
  }
  function chatDraftKey(roomId,userId=current()?.id){return `studyRoomChatDraft:${userId||'anon'}:${roomId}`}
  function saveChatDraft(roomId,value){if(current()?.id)sessionStorage.setItem(chatDraftKey(roomId),value||'')}
  function loadChatDraft(roomId){return current()?.id?sessionStorage.getItem(chatDraftKey(roomId))||'':''}
  function clearChatDraft(roomId){if(current()?.id)sessionStorage.removeItem(chatDraftKey(roomId))}
  function chatAvailabilityMessage(room){
    if(!room)return 'Study room not found.';
    if(room.status==='scheduled')return 'The room chat will open when the host opens the waiting room.';
    if(room.status==='cancelled')return 'Room chat is not available.';
    if(room.status==='completed')return 'Room chat is read-only because this study room is complete.';
    if(room.chatEnabled===false)return 'Room chat is currently turned off by the host.';
    return '';
  }
  function chatPanelHTML(room){
    const access=validateStudyRoomChatAccess({room,userId:current()?.id,allowCompletedRead:true});
    const available=access.valid&&['waiting','active','completed'].includes(room.status);
    const readOnly=room.status==='completed'||room.chatEnabled===false;
    const disabledMessage=chatAvailabilityMessage(room)||access.errors[0]||'Room chat is not available.';
    return `<aside id="study-room-chat-panel" class="study-room-chat-panel" aria-labelledby="study-room-chat-title"><header class="study-room-chat-header"><div><h2 id="study-room-chat-title">Room Chat</h2><p id="study-room-chat-mode">Local Chat Prototype</p><small>Messages in this prototype are stored only in this browser.</small></div><button class="btn btn-secondary" id="close-study-room-chat" data-call-toggle-chat type="button">Close Chat</button></header><div class="chat-safety-note">Do not send passwords, addresses, phone numbers or other private information in room chat.</div><div id="study-room-chat-messages" class="study-room-chat-messages" role="log" aria-live="polite" aria-relevant="additions text"></div><button id="load-earlier-room-messages" class="btn btn-secondary" type="button" hidden>Load Earlier Messages</button><button id="jump-to-new-room-messages" class="btn btn-secondary" type="button" hidden>New Messages</button>${available?`<form id="study-room-chat-form" class="study-room-chat-form" data-chat-room-id="${safe(room.roomId)}"><label for="study-room-chat-input">Message Room</label><textarea id="study-room-chat-input" maxlength="1000" rows="3" placeholder="Write a message..." ${readOnly?'disabled':''}>${safe(loadChatDraft(room.roomId))}</textarea><div id="study-room-chat-error" class="call-error-text" role="alert"></div><div class="study-room-chat-tools"><button class="btn btn-secondary" id="open-room-emoji-picker" type="button" ${readOnly?'disabled':''}>Emoji</button><button class="btn btn-secondary" id="share-room-study-link" type="button" ${readOnly?'disabled':''}>Study Link</button><button class="btn btn-secondary" id="ask-room-question" type="button" ${readOnly?'disabled':''}>Ask Question</button><button class="btn btn-secondary" id="share-room-study-goal" type="button" ${readOnly?'disabled':''}>Study Goal</button><button class="btn btn-secondary" id="clear-local-room-chat" type="button">Clear Local Chat</button></div><div id="room-emoji-picker" class="room-emoji-picker" hidden></div><div class="study-room-chat-submit"><span id="study-room-chat-character-count">0 / 1000</span><button class="btn btn-primary" id="send-study-room-message" type="submit" ${readOnly?'disabled':''}>Send</button></div>${readOnly?`<p class="prototype-notice">${safe(disabledMessage)}</p>`:''}</form>`:`<div class="empty-mini">${safe(disabledMessage)}</div>`}</aside>`;
  }

  function aiModeLabel(mode){
    return ({['study-order']:'Suggest Study Order',['group-quiz']:'Generate Group Quiz',['discussion-questions']:'Discussion Questions',['topic-summary']:'Summarize Topic',['study-agenda']:'Build Study Agenda'}[mode]||'Suggest Study Order');
  }
  function aiRequestSettingsHTML(room){
    const mode=callRuntime.aiCurrentMode||'study-order',consent=getAIConsent(room.roomId,current()?.id);
    return `<section id="study-room-ai-request-form" aria-labelledby="study-room-ai-request-title"><h3 id="study-room-ai-request-title">Request Settings</h3><label>Topic<input id="study-room-ai-topic" maxlength="120" value="${safe(room.topic||'')}" placeholder="Room topic"></label><div class="form-row"><label>Questions<input id="study-room-ai-question-count" type="number" min="1" max="${mode==='discussion-questions'?15:30}" value="${mode==='discussion-questions'?5:10}"></label><label>Duration minutes<input id="study-room-ai-duration" type="number" min="10" max="240" value="45"></label></div><div class="form-row"><label>Difficulty<select id="study-room-ai-difficulty"><option value="mixed">Mixed</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></label><label>Question type<select id="study-room-ai-question-type"><option value="mixed">Mixed</option><option value="multiple-choice">Multiple choice</option><option value="short-answer">Short answer</option><option value="true-false">True or false</option></select></label></div><label>Share Learning Strengths with Room AI<select id="study-room-ai-consent"><option value="false" ${consent.allowSharedLearningData?'':'selected'}>Do not allow</option><option value="true" ${consent.allowSharedLearningData?'selected':''}>Allow for this room</option></select></label><label>I am comfortable explaining a topic<select id="study-room-ai-explain-pref"><option value="sometimes" ${consent.explainPreference==='sometimes'?'selected':''}>Sometimes</option><option value="yes" ${consent.explainPreference==='yes'?'selected':''}>Yes</option><option value="no" ${consent.explainPreference==='no'?'selected':''}>No</option></select></label><div id="study-room-ai-error" class="call-error-text" role="alert"></div><button class="btn btn-primary" id="generate-study-room-ai-result" data-ai-generate="${safe(mode)}" type="button">Generate</button><button class="btn btn-secondary hidden" id="cancel-study-room-ai-generation" type="button">Cancel Generation</button></section>`;
  }
  function aiPanelHTML(room){
    const access=validateStudyRoomAIAccess(room.roomId),disabled=!access.success;
    return `<aside id="study-room-ai-panel" class="study-room-ai-panel" aria-labelledby="study-room-ai-title"><header class="study-room-ai-header"><div><p class="eyebrow">Rule-Based AI Prototype</p><h2 id="study-room-ai-title">AI Study Assistant</h2></div><button class="btn btn-secondary" id="close-study-room-ai" data-call-toggle-ai type="button">Close AI Assistant</button></header><p class="ai-room-disclaimer">Room AI uses only information approved for this study room. Suggestions are generated from locally available study-room data. AI suggestions are estimates based on available recorded study activity. They do not guarantee grades, exam results or future performance.</p><nav class="study-room-ai-actions" aria-label="AI study tools">${AI_MODES.map(mode=>`<button class="btn ${callRuntime.aiCurrentMode===mode?'btn-primary':'btn-secondary'}" data-ai-mode="${safe(mode)}" aria-pressed="${callRuntime.aiCurrentMode===mode?'true':'false'}" ${disabled?'disabled':''} type="button">${safe(aiModeLabel(mode))}</button>`).join('')}</nav>${disabled?`<div class="empty-mini" role="alert">${safe(access.error)}</div>`:aiRequestSettingsHTML(room)}<section id="study-room-ai-result" aria-labelledby="study-room-ai-result-title" ${callRuntime.aiCurrentResult?'':'hidden'}><p class="ai-content-label">Rule-Based Suggestion</p><h3 id="study-room-ai-result-title"></h3><div id="study-room-ai-result-content" class="ai-study-result"></div><section><h4>Data Used</h4><ul id="study-room-ai-data-used"></ul></section><section><h4>Limitations</h4><ul id="study-room-ai-limitations"></ul></section><div class="study-room-ai-result-actions"><button class="btn btn-primary" id="save-study-room-ai-result" type="button">Save to Room</button><button class="btn btn-secondary" id="share-ai-result-to-chat" type="button">Share to Chat</button><button class="btn btn-secondary" id="add-ai-result-to-tasks" type="button">Add to Shared Tasks</button><button class="btn btn-secondary" id="create-ai-timer-schedule" type="button">Create Timer Schedule</button><button class="btn btn-secondary" id="copy-study-room-ai-result" type="button">Copy</button><button class="btn btn-secondary" id="regenerate-study-room-ai-result" type="button">Regenerate</button><button class="btn btn-danger" id="clear-study-room-ai-result" type="button">Clear</button></div></section><div id="study-room-ai-announcements" class="sr-only" aria-live="polite"></div></aside>`;
  }

  function timerStatusLabel(status){
    return ({idle:'Idle',running:'Running',paused:'Paused',completed:'Completed'}[status]||'Idle');
  }
  function studyRoomTimerHTML(room){
    const timer=getStudyRoomTimer(room.roomId),remaining=currentTimerRemainingSeconds(timer),percent=timer.durationSeconds?Math.max(0,Math.min(100,(remaining/timer.durationSeconds)*100)):0,isHost=room.hostUserId===current()?.id,schedule=getStudyRoomTimerSchedule(room.roomId),history=callRuntime.timerHistory.get(room.roomId)||[];
    const modeOptions=Object.values(TIMER_MODES).filter(item=>item.mode!=='custom').map(item=>`<option value="${safe(item.mode)}" ${timer.mode===item.mode?'selected':''}>${safe(item.shortTitle)}</option>`).join('');
    const scheduleList=schedule.steps.map((step,index)=>`<li class="${index===schedule.stepIndex?'is-current':''}"><span>${safe(index+1)}. ${safe(step.title||getTimerPreset(step.mode).title)}</span><b>${safe(Math.round(step.durationSeconds/60))} min</b></li>`).join('');
    const historyList=history.length?history.map(row=>`<li><span>${safe(row.title)}</span><b>${safe(Math.round(row.durationSeconds/60))} min - ${safe(row.status)}</b></li>`).join(''):'<li><span>No completed timer sessions yet.</span></li>';
    return `<section id="study-room-timer" class="study-room-timer card" aria-labelledby="study-room-timer-title"><div class="study-room-timer-main"><div><p class="eyebrow">Local Timer Prototype</p><h2 id="study-room-timer-title">Group Study Timer</h2><p class="prototype-notice">In this front-end prototype, timer synchronization is local only. The Study Room Timer is synchronized through the real-time backend in the full version.</p></div><div class="timer-display-wrap"><span id="study-room-timer-mode">${safe(timer.title)}</span><strong id="study-room-timer-display" aria-live="polite">${safe(formatStudyRoomTimer(remaining))}</strong><small id="study-room-timer-status">${safe(timer.status==='completed'?timer.title+' Complete':timerStatusLabel(timer.status))}</small></div></div><div class="timer-progress-track" role="progressbar" aria-label="Timer remaining percentage" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${safe(Math.round(percent))}"><i id="study-room-timer-progress-bar" style="width:${safe(percent)}%"></i></div>${isHost?`<div class="timer-host-controls" role="group" aria-label="Host timer controls"><label>Current Mode<select data-room-timer-mode="${safe(room.roomId)}">${modeOptions}</select></label><button class="btn btn-primary" data-room-timer-start="${safe(room.roomId)}" ${timer.status==='running'?'disabled':''} type="button">Start</button><button class="btn btn-secondary" data-room-timer-pause="${safe(room.roomId)}" ${timer.status==='running'?'':'disabled'} type="button">Pause</button><button class="btn btn-secondary" data-room-timer-reset="${safe(room.roomId)}" type="button">Reset</button><button class="btn btn-secondary" data-room-timer-next="${safe(room.roomId)}" type="button">Next Session</button><button class="btn btn-secondary" data-room-timer-custom="${safe(room.roomId)}" type="button">Custom Timer</button><button class="btn btn-secondary" data-room-timer-edit-schedule="${safe(room.roomId)}" type="button">Edit Schedule</button><label class="checkbox-row timer-sound-toggle"><input data-room-timer-sound="${safe(room.roomId)}" type="checkbox" ${callRuntime.timerCompletionSound?'checked':''}> Completion sound</label></div>`:`<p class="timer-viewer-note">Participants can view the current timer. Host controls require backend authorization in the full version.</p>`}<div class="timer-schedule-grid"><section><h3>Shared Schedule</h3><ol>${scheduleList}</ol><label class="checkbox-row timer-auto-advance"><input data-room-timer-auto-advance="${safe(room.roomId)}" type="checkbox" ${schedule.autoAdvance?'checked':''} ${isHost?'':'disabled'}> Automatically begin next timer</label></section><section><h3>Timer History</h3><ol>${historyList}</ol></section></div><div id="study-room-timer-announcement" class="sr-only" aria-live="polite"></div></section>`;
  }

  function relativeTime(value){
    const date=new Date(value);
    if(Number.isNaN(date.getTime()))return '';
    const seconds=Math.max(1,Math.floor((Date.now()-date.getTime())/1000));
    if(seconds<60)return 'just now';
    const minutes=Math.floor(seconds/60);
    if(minutes<60)return `${minutes} minute${minutes===1?'':'s'} ago`;
    const hours=Math.floor(minutes/60);
    if(hours<24)return `${hours} hour${hours===1?'':'s'} ago`;
    const days=Math.floor(hours/24);
    return `${days} day${days===1?'':'s'} ago`;
  }
  function sharedGoalTaskHTML(task,room,isHost){
    const completedBy=task.completed&&task.completedByUserId?publicStudentProfile(task.completedByUserId):null;
    const meta=task.completed?`<small>Completed${completedBy?` by ${safe(completedBy.name)}`:''}${task.completedAt?` ${safe(relativeTime(task.completedAt))}`:''}. Requires backend for real synchronization.</small>`:task.description?`<small>${safe(task.description)}</small>`:'';
    return `<li class="shared-goal-task ${task.completed?'is-complete':''}" data-shared-task-id="${safe(task.taskId)}"><label><input type="checkbox" data-shared-task-toggle="${safe(task.taskId)}" aria-checked="${task.completed?'true':'false'}" ${task.completed?'checked':''}> <span>${safe(task.title)}</span></label>${meta}<div class="shared-goal-task-actions">${isHost?`<button class="btn btn-secondary" data-shared-task-edit="${safe(task.taskId)}" type="button">Edit</button><button class="btn btn-secondary" data-shared-task-up="${safe(task.taskId)}" type="button">Move Up</button><button class="btn btn-secondary" data-shared-task-down="${safe(task.taskId)}" type="button">Move Down</button><button class="btn btn-danger" data-shared-task-delete="${safe(task.taskId)}" type="button">Delete</button>`:''}</div></li>`;
  }
  function studyRoomGoalsHTML(room){
    const record=studyRoomGoalService.load(room.roomId),progress=studyRoomGoalService.calculateProgress(record),isHost=room.hostUserId===current()?.id;
    const taskList=record.tasks.length?record.tasks.map(task=>sharedGoalTaskHTML(task,room,isHost)).join(''):'<li class="shared-goal-empty"><b>No shared tasks yet.</b><span>No tasks have been added.</span></li>';
    return `<section id="study-room-goals" class="study-room-goals card" aria-labelledby="study-room-goals-title"><div class="shared-goal-head"><div><p class="eyebrow">Local Shared Goals Prototype</p><h2 id="study-room-goals-title">${safe(record.goal.title)}</h2><p class="prototype-notice">In this front-end prototype, shared goals and tasks are stored locally and do not synchronize across devices. Group task synchronization requires the real-time backend in the full version.</p></div>${isHost?`<div class="shared-goal-header-actions"><button class="btn btn-secondary" data-shared-goal-rename="${safe(room.roomId)}" type="button">Rename Goal</button><button class="btn btn-danger" data-shared-goal-delete="${safe(room.roomId)}" type="button">Delete Goal</button></div>`:''}</div><div class="shared-goal-progress"><div><strong>Group Progress</strong><span>${safe(progress.label)}</span></div><b>${safe(progress.percentage)}%</b></div><div class="shared-goal-progress-bar" role="progressbar" aria-label="Shared task completion progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${safe(progress.percentage)}"><i style="width:${safe(progress.percentage)}%"></i></div><div class="shared-goal-summary"><span>Completed: ${safe(progress.completed)}</span><span>Remaining: ${safe(progress.remaining)}</span></div><ul id="goal-task-list" class="shared-goal-task-list">${taskList}</ul>${isHost?`<form id="shared-goal-task-form" class="shared-goal-task-form" data-shared-goal-room="${safe(room.roomId)}"><label>Task title<input id="shared-goal-task-title" maxlength="150" placeholder="Review Cell Respiration"></label><label>Optional description<textarea id="shared-goal-task-description" maxlength="500" rows="2" placeholder="Add helpful details for the group."></textarea></label><div id="shared-goal-error" class="call-error-text" role="alert"></div><button class="btn btn-primary" type="submit">Add Task</button></form>`:''}</section>`;
  }

  function callSupportNotice(){
    const warnings=callSupportWarnings();
    const items=['Signaling server','Live backend','STUN/TURN servers','HTTPS','Authenticated users'];
    return `<section class="card call-prototype-notice"><h3>Real Video and Audio Calls Require</h3><ul>${items.map(item=>`<li>${safe(item)}</li>`).join('')}</ul><p>This front-end prototype supports local device testing only. Real online calls require a signaling server, authenticated users, HTTPS, and WebRTC infrastructure.</p>${warnings.length?`<div class="call-warning-list">${warnings.map(warning=>`<p>${safe(warning)}</p>`).join('')}</div>`:''}</section>`;
  }

  function activeCallHTML(room){
    const participantCount=(room.participantIds||[]).length,support=getMediaSupport(),canJoinRealCall=signalingService.connected===true&&support.peerConnection;
    const currentUser=current(),screenSharer=getCurrentRoomScreenSharer(room.roomId),sharingByOther=Boolean(screenSharer&&screenSharer!==currentUser?.id),shareAccess=studyRoomSafetyService.canStartScreenShare({room,userId:currentUser?.id});
    const cameraDisabled=!room.cameraAllowed||!support.getUserMedia||callMediaState.permissionRequestInProgress;
    const micDisabled=!room.microphoneAllowed||!support.getUserMedia||callMediaState.permissionRequestInProgress;
    const screenDisabled=!callMediaState.screenSharing&&(!support.screenSharing||!support.secureContext||callMediaState.permissionRequestInProgress||!shareAccess.valid||sharingByOther);
    const screenHelp=!support.screenSharing?'Screen sharing is not supported by this browser.':!support.secureContext?'Screen sharing requires HTTPS outside localhost.':sharingByOther?`${publicStudentProfile(screenSharer).name} is sharing their screen. Wait until the current screen share ends.`:!shareAccess.valid?shareAccess.errors[0]:'Students can share notes, slides, practice questions, whiteboards and study plans.';
    const panels=[callRuntime.chatOpen?chatPanelHTML(room):'',callRuntime.aiOpen?aiPanelHTML(room):'',callRuntime.participantsOpen?`<aside class="study-room-side-panel" id="studyCallParticipantsPanel" aria-label="Participants"><header><h2>Participants</h2><button class="btn btn-secondary" data-call-toggle-participants type="button">Close Participants</button></header><div class="lobby-member-list">${roomConnectionManager.currentParticipants(room.roomId).map(profile=>`<article class="lobby-member-card"><div><b>${safe(profile.name)}${profile.id===current()?.id?' (You)':''}</b><small>${safe(room.hostUserId===profile.id?'Host':'Student')} - ${safe(profile.id===current()?.id?'Local device test':'Backend required for live status')}</small></div></article>`).join('')}</div></aside>`:''].join('');
    const unread=roomChatUnread(room.roomId),chatLabel=callRuntime.chatOpen?'Close Chat':`Open Chat${unread?` (${unread})`:''}`;
    return `<main id="active-study-room-page" class="study-call-page" aria-labelledby="studyCallTitle"><header class="study-call-header"><div><p class="eyebrow">Active Study Room Session</p><h1 id="studyCallTitle">${safe(room.roomName)}</h1><p>${safe(room.course)} - ${safe(room.topic)} - ${safe(labels[room.status]||room.status)} ${room.isLocked?' - Locked':''}</p></div><div class="call-status-panel"><span id="study-call-connection">${safe(callConnectionLabel())}</span><strong id="study-call-timer">${safe(formatCallTimer())}</strong><small id="active-room-participant-count">Participants ${safe(participantCount)} / ${safe(room.maximumMembers)}</small></div></header>${studyRoomSafetySettingsHTML(room)}${isStudyRoomHost({room,userId:currentUser?.id})?hostControlsHTML(room):''}${studyRoomTimerHTML(room)}${studyRoomGoalsHTML(room)}${screenShareBannerHTML()}${callSupportNotice()}${screenShareStageHTML()}${activeScreenShareHostControlsHTML(room)}<div class="call-panels-layout"><section class="call-main-stage" aria-label="Video call area"><div class="call-grid participant-video-grid call-grid-count-${Math.min(participantCount,5)}">${callParticipantTiles(room)}</div></section>${panels}</div><div id="call-control-announcements" class="sr-only" aria-live="polite"></div><div class="call-toolbar" role="toolbar" aria-label="Study call controls"><span class="call-control-group"><button class="btn btn-secondary" data-call-toggle-microphone="${safe(room.roomId)}" aria-pressed="${callMediaState.microphoneEnabled?'true':'false'}" ${micDisabled||isRoomUserMuted(room,currentUser?.id)?'disabled':''} type="button">[Mic] Microphone: ${callMediaState.microphoneEnabled?'On':'Off'}</button><button class="btn btn-secondary btn-icon" data-call-device-menu="microphone" aria-label="Microphone options" ${!support.enumerateDevices?'disabled':''} type="button">Options</button></span><span class="call-control-group"><button class="btn btn-secondary" data-call-toggle-camera="${safe(room.roomId)}" aria-pressed="${callMediaState.cameraEnabled?'true':'false'}" ${cameraDisabled?'disabled':''} type="button">[Cam] Camera: ${callMediaState.cameraEnabled?'On':'Off'}</button><button class="btn btn-secondary btn-icon" data-call-device-menu="camera" aria-label="Camera options" ${!support.enumerateDevices?'disabled':''} type="button">Options</button></span><button id="toggle-room-screen-share" class="btn btn-secondary" data-call-toggle-screen="${safe(room.roomId)}" aria-pressed="${callMediaState.screenSharing?'true':'false'}" aria-describedby="screen-share-helper" ${screenDisabled?'disabled':''} type="button">[Screen] ${callMediaState.screenSharing?'Stop Sharing':'Share Screen'}</button><button id="toggle-study-room-chat" class="btn btn-secondary" data-call-toggle-chat aria-expanded="${callRuntime.chatOpen?'true':'false'}" aria-controls="study-room-chat-panel" type="button">[Chat] ${safe(chatLabel)}</button><button id="toggle-study-room-ai" class="btn btn-secondary" data-call-toggle-ai aria-expanded="${callRuntime.aiOpen?'true':'false'}" aria-controls="study-room-ai-panel" type="button">[AI] AI Assistant</button><button class="btn btn-secondary" data-call-toggle-participants type="button">Participants</button><button class="btn btn-primary" data-real-join-call="${safe(room.roomId)}" ${canJoinRealCall?'':'disabled'} type="button">Join Call</button><button class="btn btn-danger" data-leave-study-call="${safe(room.roomId)}" type="button">Leave</button></div><p id="screen-share-helper" class="prototype-notice">${safe(screenHelp)}</p><p class="prototype-notice">Join Call remains disabled until signaling and room synchronization are configured. Local device controls are available for testing only.</p></main>`;
  }

  function attachLocalCallVideo(){
    const video=$('[data-local-call-video]');
    if(video&&callMediaState.cameraStream)video.srcObject=callMediaState.cameraStream;
  }

  function appendText(parent,tag,textValue,className=''){
    const el=document.createElement(tag);
    if(className)el.className=className;
    el.textContent=textValue||'';
    parent.appendChild(el);
    return el;
  }

  function appendList(parent,tag,items=[]){
    const list=document.createElement(tag);
    (Array.isArray(items)?items:[]).forEach(item=>appendText(list,'li',typeof item==='string'?item:item?.description||item?.title||''));
    parent.appendChild(list);
    return list;
  }

  function aiResultToText(result){
    const lines=[result.title,'Rule-Based Suggestion'];
    const content=result.content||{};
    if(content.participantInsights?.length)lines.push('Participant Insights',...content.participantInsights.map(item=>`- ${item}`));
    if(content.steps?.length)lines.push('Study Plan',...content.steps.map(step=>`${step.order}. ${step.title}: ${step.description}`));
    if(content.questions?.length)lines.push('Questions',...content.questions.map((item,index)=>`${index+1}. ${typeof item==='string'?item:item.prompt}`));
    if(content.message)lines.push(content.message);
    ['mainIdea','keyProcess','commonMistakes','note'].forEach(key=>{if(content[key])lines.push(content[key])});
    if(content.importantTerms?.length)lines.push('Important Terms',...content.importantTerms.map(item=>`- ${item}`));
    if(content.reviewQuestions?.length)lines.push('Review Questions',...content.reviewQuestions.map(item=>`- ${item}`));
    lines.push('Data Used',...result.sourceDataSummary.map(item=>`- ${item}`),'Limitations',...result.limitations.map(item=>`- ${item}`));
    return lines.filter(Boolean).join('\n');
  }

  function renderRoomAIResult(result=callRuntime.aiCurrentResult){
    const section=$('#study-room-ai-result'),title=$('#study-room-ai-result-title'),content=$('#study-room-ai-result-content'),data=$('#study-room-ai-data-used'),limits=$('#study-room-ai-limitations');
    if(!section||!result)return;
    section.hidden=false;
    title.textContent=result.title||'AI Study Assistant Result';
    content.replaceChildren();
    data.replaceChildren();
    limits.replaceChildren();
    const c=result.content||{};
    if(c.participantInsights?.length){appendText(content,'h4','Participant Insights');appendList(content,'ul',c.participantInsights)}
    if(c.steps?.length){appendText(content,'h4',result.mode==='study-agenda'?'Study Agenda':'Study Plan');const list=document.createElement('ol');c.steps.forEach(step=>appendText(list,'li',`${step.title}. ${step.description} (${step.durationMinutes} minutes)`));content.appendChild(list)}
    if(c.questions?.length){appendText(content,'h4','Questions');appendList(content,'ol',c.questions.map(item=>typeof item==='string'?item:item.prompt))}
    if(c.message)appendText(content,'p',c.message,'prototype-notice');
    if(c.mainIdea){appendText(content,'h4','Main Idea');appendText(content,'p',c.mainIdea)}
    if(c.importantTerms?.length){appendText(content,'h4','Important Terms');appendList(content,'ul',c.importantTerms)}
    if(c.keyProcess){appendText(content,'h4','Key Process');appendText(content,'p',c.keyProcess)}
    if(c.commonMistakes){appendText(content,'h4','Common Mistakes');appendText(content,'p',c.commonMistakes)}
    if(c.reviewQuestions?.length){appendText(content,'h4','Review Questions');appendList(content,'ul',c.reviewQuestions)}
    if(c.note)appendText(content,'p',c.note,'prototype-notice');
    result.sourceDataSummary.forEach(item=>appendText(data,'li',item));
    result.limitations.forEach(item=>appendText(limits,'li',item));
  }

  function formatMessageTime(value){
    const date=new Date(value);
    return Number.isNaN(date.getTime())?'':date.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'});
  }

  function renderChatMessage(container,message){
    if(message.status==='deleted'){
      const row=document.createElement('article');
      row.className='room-chat-message room-chat-deleted-message';
      row.dataset.messageId=message.messageId;
      appendText(row,'p','Message deleted.','room-chat-message-content');
      container.appendChild(row);
      return;
    }
    if(message.type==='system'){
      appendText(container,'p',message.content,'room-chat-system-message');
      return;
    }
    const currentUserId=current()?.id,profile=publicStudentProfile(message.senderUserId),article=document.createElement('article');
    article.className=`room-chat-message ${message.senderUserId===currentUserId?'is-current-user':''} room-chat-${message.type}-message`;
    article.dataset.messageId=message.messageId;
    const header=document.createElement('header');
    appendText(header,'strong',message.senderUserId===currentUserId?`${profile.name} - You`:profile.name);
    const time=document.createElement('time');
    time.dateTime=message.createdAt;
    time.textContent=formatMessageTime(message.createdAt);
    header.appendChild(time);
    if(message.type==='question')appendText(header,'span','Question');
    if(message.type==='emoji')appendText(header,'span','Emoji');
    if(message.type==='study-goal')appendText(header,'span','Study Goal');
    if(message.editedAt)appendText(header,'span','Edited');
    article.appendChild(header);
    if(message.type==='study-link'){
      appendText(article,'p',message.content||'Study link','room-chat-message-content');
      if(isAllowedStudyLink(message.linkUrl)){
        const link=document.createElement('a');
        link.href=message.linkUrl;
        link.target='_blank';
        link.rel='noopener noreferrer';
        link.textContent=`Open Study Link (${new URL(message.linkUrl).hostname})`;
        article.appendChild(link);
      }
    }else if(message.type==='study-goal'){
      const goal=message.goalData||{};
      appendText(article,'h3',goal.title||message.content);
      if(goal.details)appendText(article,'p',goal.details,'room-chat-message-content');
      if(goal.targetMinutes)appendText(article,'p',`Target: ${goal.targetMinutes} minutes`);
      const assigned=goal.assignedUserId?publicStudentProfile(goal.assignedUserId).name:'Anyone';
      appendText(article,'p',`Assigned to: ${assigned}`);
      appendText(article,'p',`Shared by: ${profile.name}`);
      if(goal.completed)appendText(article,'p','Completed','room-chat-goal-complete');
      else if(message.senderUserId===currentUserId||goal.assignedUserId===currentUserId){
        const btn=document.createElement('button');
        btn.type='button';
        btn.className='btn btn-secondary';
        btn.dataset.completeRoomGoal=message.messageId;
        btn.textContent='Mark Complete';
        article.appendChild(btn);
      }
    }else{
      appendText(article,'p',message.content,'room-chat-message-content');
    }
    if(message.senderUserId===currentUserId&&['text','question'].includes(message.type)&&message.status!=='deleted'){
      const actions=document.createElement('div');
      actions.className='room-chat-message-actions';
      const edit=document.createElement('button');
      edit.type='button';
      edit.className='btn btn-secondary';
      edit.dataset.editRoomMessage=message.messageId;
      edit.textContent='Edit';
      const del=document.createElement('button');
      del.type='button';
      del.className='btn btn-secondary';
      del.dataset.deleteRoomMessage=message.messageId;
      del.textContent='Delete';
      actions.appendChild(edit);
      actions.appendChild(del);
      article.appendChild(actions);
    }else if(message.senderUserId!==currentUserId&&message.status!=='deleted'){
      const actions=document.createElement('div');
      actions.className='room-chat-message-actions';
      const report=document.createElement('button');
      report.type='button';
      report.className='btn btn-secondary';
      report.dataset.reportRoomMessage=message.messageId;
      report.textContent='Report Message';
      actions.appendChild(report);
      if(message.type==='study-link'){
        const reportLink=document.createElement('button');
        reportLink.type='button';
        reportLink.className='btn btn-secondary';
        reportLink.dataset.reportRoomLink=message.messageId;
        reportLink.textContent='Report Link';
        actions.appendChild(reportLink);
      }
      article.appendChild(actions);
    }
    container.appendChild(article);
  }

  function renderStudyRoomChatMessages(roomId){
    const container=$('#study-room-chat-messages');
    if(!container)return;
    container.replaceChildren();
    const messages=getMessagesForStudyRoom(roomId,{limit:50});
    if(!messages.length){
      appendText(container,'p','No room messages yet.','empty-mini');
      return;
    }
    messages.forEach(message=>renderChatMessage(container,message));
    container.scrollTop=container.scrollHeight;
  }

  function updateChatCharacterCount(){
    const input=$('#study-room-chat-input'),counter=$('#study-room-chat-character-count');
    if(counter&&input)counter.textContent=`${input.value.length} / 1000`;
  }

  function announceChatError(message){
    const error=$('#study-room-chat-error');
    if(error)error.textContent=message||'';
    if(message)notificationManager.warning(message);
  }

  function closeStudyRoomChat({silent=false}={}){
    const roomId=callRuntime.roomId,input=$('#study-room-chat-input');
    if(input&&roomId)saveChatDraft(roomId,input.value);
    callRuntime.chatOpen=false;
    if(!silent)renderActiveStudyCall();
  }

  function openStudyRoomChat(roomId){
    const room=getStudyRoomById(roomId),access=validateStudyRoomChatAccess({room,userId:current()?.id,allowCompletedRead:true});
    if(!access.valid&&room?.status!=='completed'){notificationManager.warning(access.errors[0]);return}
    callRuntime.aiOpen=false;
    callRuntime.chatOpen=true;
    markRoomChatSeen(roomId);
    renderActiveStudyCall(roomId);
  }

  function closeStudyRoomAI({silent=false}={}){
    callRuntime.aiOpen=false;
    if(!silent)renderActiveStudyCall();
    window.setTimeout(()=>callRuntime.aiLastFocus?.focus?.(),0);
  }
  function openStudyRoomAI(roomId,trigger=null){
    const access=validateStudyRoomAIAccess(roomId);
    if(!access.success){notificationManager.warning(access.error);return}
    callRuntime.aiLastFocus=trigger||$('#toggle-study-room-ai');
    callRuntime.chatOpen=false;
    callRuntime.aiOpen=true;
    renderActiveStudyCall(roomId);
  }
  function aiAnnounce(message){
    const live=$('#study-room-ai-announcements');
    if(live)live.textContent=message;
  }
  function aiFormSettings(){
    return {questionCount:Number($('#study-room-ai-question-count')?.value)||10,durationMinutes:Number($('#study-room-ai-duration')?.value)||45,difficulty:$('#study-room-ai-difficulty')?.value||'mixed',questionType:$('#study-room-ai-question-type')?.value||'mixed',includeAnswers:true,includeExplanations:true};
  }
  function showAIError(message){
    const error=$('#study-room-ai-error');
    if(error)error.textContent=message||'';
    if(message)notificationManager.warning(message);
  }
  function generateRoomAIResult(mode=callRuntime.aiCurrentMode){
    if(callRuntime.aiProcessing)return;
    const roomId=callRuntime.roomId,topic=$('#study-room-ai-topic')?.value||getStudyRoomById(roomId)?.topic||'',settings=aiFormSettings(),button=$('#generate-study-room-ai-result');
    const consent=studyRoomAIService.saveConsent({roomId,allowSharedLearningData:$('#study-room-ai-consent')?.value==='true',explainPreference:$('#study-room-ai-explain-pref')?.value||'sometimes'});
    if(!consent.success)return showAIError(consent.error);
    callRuntime.aiProcessing=true;
    if(button){button.disabled=true;button.textContent='Generating...'}
    const result=studyRoomAIService.generate({roomId,mode,topic,settings});
    callRuntime.aiProcessing=false;
    if(button){button.disabled=false;button.textContent='Generate'}
    if(!result.success){showAIError(result.error||'The AI request could not be completed.');return}
    callRuntime.aiCurrentResult=result.result;
    renderRoomAIResult(result.result);
    const message={['study-order']:'Suggested study order created.',['group-quiz']:'Group quiz created.',['discussion-questions']:'Discussion questions created.',['topic-summary']:'Topic summary created.',['study-agenda']:'Study agenda created.'}[result.result.mode]||'AI result created.';
    notificationManager.success(message);
    aiAnnounce(message);
  }
  function bindStudyRoomAIActions(root=document){
    const panel=$('#study-room-ai-panel',root);
    if(!panel)return;
    renderRoomAIResult(callRuntime.aiCurrentResult);
    $$('[data-ai-mode]',panel).forEach(btn=>btn.onclick=()=>{callRuntime.aiCurrentMode=normalizeAIMode(btn.dataset.aiMode);renderActiveStudyCall(callRuntime.roomId)});
    $('#generate-study-room-ai-result',panel)?.addEventListener('click',()=>generateRoomAIResult(callRuntime.aiCurrentMode));
    $('#regenerate-study-room-ai-result',panel)?.addEventListener('click',()=>generateRoomAIResult(callRuntime.aiCurrentMode));
    $('#cancel-study-room-ai-generation',panel)?.addEventListener('click',()=>{callRuntime.aiProcessing=false;notificationManager.info('AI generation cancelled.');aiAnnounce('AI generation cancelled.')});
    $('#save-study-room-ai-result',panel)?.addEventListener('click',()=>{const result=studyRoomAIService.saveResultToRoom(callRuntime.aiCurrentResult);if(!result.success)return showAIError(result.error);callRuntime.aiCurrentResult=result.result;renderRoomAIResult(result.result);notificationManager.success('AI result saved to the room.')});
    $('#share-ai-result-to-chat',panel)?.addEventListener('click',async()=>{const ok=await confirmDialog({title:'Share AI Result?',message:'Share a labelled AI-generated note in the room chat?',okText:'Share to Chat',cancelText:'Cancel'});if(!ok)return;const result=studyRoomAIService.shareResultToChat(callRuntime.aiCurrentResult);if(!result.success)return showAIError(result.error);notificationManager.success('AI result shared to room chat.');aiAnnounce('AI result shared to room chat.')});
    $('#add-ai-result-to-tasks',panel)?.addEventListener('click',async()=>{const ok=await confirmDialog({title:'Add to Shared Tasks?',message:"Add suitable AI study steps to Today's Goal? Duplicate tasks will be skipped.",okText:'Add Tasks',cancelText:'Cancel'});if(!ok)return;const result=studyRoomAIService.addResultToTasks(callRuntime.aiCurrentResult);if(!result.success)return showAIError(result.error);rerenderSharedGoals(callRuntime.roomId);notificationManager.success(`Study steps added to shared tasks. Added ${result.added.length} task${result.added.length===1?'':'s'}.`)});
    $('#create-ai-timer-schedule',panel)?.addEventListener('click',async()=>{const ok=await confirmDialog({title:'Create Timer Schedule?',message:'Replace the current local timer schedule with this AI agenda?',okText:'Create Schedule',cancelText:'Cancel'});if(!ok)return;const result=studyRoomAIService.createTimerScheduleFromResult(callRuntime.aiCurrentResult);if(!result.success)return showAIError(result.error);notificationManager.success('Timer schedule created.');renderActiveStudyCall(callRuntime.roomId)});
    $('#copy-study-room-ai-result',panel)?.addEventListener('click',async()=>{const textValue=studyRoomAIService.copyText(callRuntime.aiCurrentResult);try{await navigator.clipboard?.writeText(textValue);notificationManager.success('AI result copied.');aiAnnounce('AI result copied.')}catch{showAIError('The AI result could not be copied.')}});
    $('#clear-study-room-ai-result',panel)?.addEventListener('click',async()=>{const ok=await confirmDialog({title:'Clear AI Result?',message:'Clear the unsaved AI result from this panel?',okText:'Clear',cancelText:'Cancel',danger:true});if(!ok)return;studyRoomAIService.clearResult();const section=$('#study-room-ai-result');if(section)section.hidden=true;notificationManager.info('AI result cleared.')});
    panel.addEventListener('keydown',event=>{if(event.key==='Escape')closeStudyRoomAI()});
  }

  function insertChatText(value){
    const input=$('#study-room-chat-input');
    if(!input)return;
    const start=input.selectionStart||input.value.length,end=input.selectionEnd||input.value.length;
    input.value=input.value.slice(0,start)+value+input.value.slice(end);
    input.selectionStart=input.selectionEnd=start+value.length;
    updateChatCharacterCount();
    input.focus();
  }

  function openEmojiPicker(){
    const picker=$('#room-emoji-picker');
    if(!picker)return;
    const options=[['Thumbs up',0x1F44D],['Check mark',0x2705],['Question mark',0x2753],['Target',0x1F3AF],['Book',0x1F4DA],['Brain',0x1F9E0],['Clapping',0x1F44F],['Idea',0x1F4A1],['Smile',0x1F60A]];
    picker.hidden=!picker.hidden;
    if(picker.hidden)return;
    picker.replaceChildren();
    options.forEach(([label,code])=>{
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='btn btn-secondary';
      btn.setAttribute('aria-label',`${label} emoji`);
      btn.textContent=String.fromCodePoint(code);
      btn.onclick=()=>insertChatText(btn.textContent);
      picker.appendChild(btn);
    });
  }

  function sendRoomChatFromInput(roomId,type='text'){
    const input=$('#study-room-chat-input');
    if(!input)return;
    const lock=`${roomId}:${current()?.id}`;
    if(callRuntime.chatSendLocks.has(lock))return;
    callRuntime.chatSendLocks.add(lock);
    const result=type==='question'?studyRoomChatService.sendQuestion({roomId,content:input.value}):studyRoomChatService.sendText({roomId,content:input.value,clientRequestId:'client-'+Date.now()});
    callRuntime.chatSendLocks.delete(lock);
    if(!result.success){announceChatError(result.error);return}
    input.value='';
    clearChatDraft(roomId);
    updateChatCharacterCount();
    renderStudyRoomChatMessages(roomId);
    notificationManager.success(type==='question'?'Question sent.':'Room message sent.');
    if(result.localPrototype)notificationManager.info('Message saved in this browser only.');
  }

  function openStudyLinkDialog(roomId){
    const url=window.prompt?.('Paste a valid HTTPS study link.');
    if(url===null||url===undefined)return;
    const description=window.prompt?.('Optional description for this study link.')||'Study link';
    const result=studyRoomChatService.sendStudyLink({roomId,content:description,linkUrl:url});
    if(!result.success)return announceChatError(result.error);
    renderStudyRoomChatMessages(roomId);
    notificationManager.success('Room message sent.');
  }

  function openReportRoomMessageDialog(messageId){
    const message=loadStudyRoomMessages().find(row=>row.messageId===messageId);
    if(!message)return announceChatError('Message not found.');
    document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay active" id="roomMessageReportDialog"><form class="modal-card support-modal-card" role="dialog" aria-modal="true" aria-labelledby="roomMessageReportTitle"><h2 id="roomMessageReportTitle">Report Message</h2><label>Reason<select id="roomMessageReportReason">${reportCategoryOptionsHTML()}</select></label><label>Optional description<textarea id="roomMessageReportNotes" maxlength="1000" rows="4"></textarea></label><p class="prototype-notice" role="status">This report is saved locally in this browser for prototype testing.</p><div class="study-room-form-actions"><button class="btn btn-secondary" data-message-report-cancel type="button">Cancel</button><button class="btn btn-primary" type="submit">Submit Report</button></div></form></div>`);
    const dialog=$('#roomMessageReportDialog'),form=$('form',dialog);
    $('[data-message-report-cancel]',dialog).onclick=()=>dialog.remove();
    form.onsubmit=event=>{
      event.preventDefault();
      const result=studyRoomReportService.reportMessage({roomId:message.roomId,messageId:message.messageId,reportedUserId:message.senderUserId,category:$('#roomMessageReportReason',dialog).value,description:$('#roomMessageReportNotes',dialog).value});
      if(!result.success)return announceChatError(result.error);
      dialog.remove();
      notificationManager.success('Report saved locally for prototype testing.');
      showPostReportDialog({roomId:message.roomId,reportedUserId:message.senderUserId});
    };
  }

  function openReportRoomLinkDialog(messageId){
    const message=loadStudyRoomMessages().find(row=>row.messageId===messageId&&row.type==='study-link');
    if(!message)return announceChatError('Study link not found.');
    document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay active" id="roomLinkReportDialog"><form class="modal-card support-modal-card" role="dialog" aria-modal="true" aria-labelledby="roomLinkReportTitle"><h2 id="roomLinkReportTitle">Report Link</h2><label>Reason<select id="roomLinkReportReason">${reportCategoryOptionsHTML('spam')}</select></label><label>Optional description<textarea id="roomLinkReportNotes" maxlength="1000" rows="4"></textarea></label><p class="prototype-notice" role="status">This report is saved locally in this browser for prototype testing.</p><div class="study-room-form-actions"><button class="btn btn-secondary" data-link-report-cancel type="button">Cancel</button><button class="btn btn-primary" type="submit">Submit Report</button></div></form></div>`);
    const dialog=$('#roomLinkReportDialog'),form=$('form',dialog);
    $('[data-link-report-cancel]',dialog).onclick=()=>dialog.remove();
    form.onsubmit=event=>{
      event.preventDefault();
      const result=studyRoomReportService.reportLink({roomId:message.roomId,messageId:message.messageId,reportedUserId:message.senderUserId,linkUrl:message.linkUrl,category:$('#roomLinkReportReason',dialog).value,description:$('#roomLinkReportNotes',dialog).value});
      if(!result.success)return announceChatError(result.error);
      dialog.remove();
      notificationManager.success('Report saved locally for prototype testing.');
      showPostReportDialog({roomId:message.roomId,reportedUserId:message.senderUserId});
    };
  }

  function openReportRoomUserDialog({roomId,reportedUserId}={}){
    const profile=publicStudentProfile(reportedUserId);
    document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay active" id="roomUserReportDialog"><form class="modal-card support-modal-card" role="dialog" aria-modal="true" aria-labelledby="roomUserReportTitle"><h2 id="roomUserReportTitle">Report User</h2><p>Report ${safe(profile.name)} for this study room.</p><label>Reason<select id="roomUserReportReason">${reportCategoryOptionsHTML()}</select></label><label>Optional description<textarea id="roomUserReportNotes" maxlength="1000" rows="4"></textarea></label><p class="prototype-notice" role="status">This report is saved locally in this browser for prototype testing.</p><div class="study-room-form-actions"><button class="btn btn-secondary" data-user-report-cancel type="button">Cancel</button><button class="btn btn-primary" type="submit">Submit Report</button></div></form></div>`);
    const dialog=$('#roomUserReportDialog'),form=$('form',dialog);
    $('[data-user-report-cancel]',dialog).onclick=()=>dialog.remove();
    form.onsubmit=event=>{
      event.preventDefault();
      const result=studyRoomReportService.reportUser({roomId,reportedUserId,category:$('#roomUserReportReason',dialog).value,description:$('#roomUserReportNotes',dialog).value});
      if(!result.success)return notify('warning',result.error);
      dialog.remove();
      notify('success','Report saved locally for prototype testing.');
      showPostReportDialog({roomId,reportedUserId});
    };
  }

  function openStudyGoalDialog(roomId){
    const title=window.prompt?.('Study goal title');
    if(!title)return announceChatError('Enter a study goal title.');
    const details=window.prompt?.('Optional goal details')||'';
    const minutes=window.prompt?.('Optional target time in minutes')||'';
    const result=studyRoomChatService.sendStudyGoal({roomId,goalData:{title,details,targetMinutes:minutes?Number(minutes):null,assignedUserId:null}});
    if(!result.success)return announceChatError(result.error);
    renderStudyRoomChatMessages(roomId);
    notificationManager.success('Study goal shared.');
  }

  function bindStudyRoomChatActions(root=document){
    const form=$('#study-room-chat-form',root),input=$('#study-room-chat-input',root),roomId=form?.dataset.chatRoomId;
    if(!form||!roomId)return;
    updateChatCharacterCount();
    renderStudyRoomChatMessages(roomId);
    input?.addEventListener('input',()=>{saveChatDraft(roomId,input.value);updateChatCharacterCount();announceChatError('')});
    input?.addEventListener('keydown',event=>{if(event.key==='Escape'){closeStudyRoomChat();return}if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendRoomChatFromInput(roomId)}});
    form.onsubmit=event=>{event.preventDefault();sendRoomChatFromInput(roomId)};
    $('#ask-room-question',root)?.addEventListener('click',()=>sendRoomChatFromInput(roomId,'question'));
    $('#open-room-emoji-picker',root)?.addEventListener('click',openEmojiPicker);
    $('#share-room-study-link',root)?.addEventListener('click',()=>openStudyLinkDialog(roomId));
    $('#share-room-study-goal',root)?.addEventListener('click',()=>openStudyGoalDialog(roomId));
    $('#clear-local-room-chat',root)?.addEventListener('click',async()=>{const ok=await confirmDialog({title:'Clear Local Chat?',message:'This removes room messages from this browser only.',okText:'Clear Messages',cancelText:'Cancel',danger:true});if(!ok)return;const result=studyRoomChatService.clearLocalRoomMessages(roomId);if(!result.success)return announceChatError(result.error);renderStudyRoomChatMessages(roomId);notificationManager.info('Local room messages cleared.')});
    root.addEventListener('click',event=>{
      const complete=event.target.closest('[data-complete-room-goal]');
      if(complete){const result=studyRoomChatService.completeGoal(complete.dataset.completeRoomGoal);if(!result.success)return announceChatError(result.error);renderStudyRoomChatMessages(roomId);notificationManager.success('Study goal marked complete.')}
      const del=event.target.closest('[data-delete-room-message]');
      if(del){const result=studyRoomChatService.deleteMessage(del.dataset.deleteRoomMessage);if(!result.success)return announceChatError(result.error);renderStudyRoomChatMessages(roomId)}
      const edit=event.target.closest('[data-edit-room-message]');
      if(edit){const existing=loadStudyRoomMessages().find(message=>message.messageId===edit.dataset.editRoomMessage);const next=window.prompt?.('Edit message',existing?.content||'');if(next===null||next===undefined)return;const result=studyRoomChatService.editMessage({messageId:edit.dataset.editRoomMessage,content:next});if(!result.success)return announceChatError(result.error);renderStudyRoomChatMessages(roomId)}
      const report=event.target.closest('[data-report-room-message]');
      if(report)openReportRoomMessageDialog(report.dataset.reportRoomMessage);
      const reportLink=event.target.closest('[data-report-room-link]');
      if(reportLink)openReportRoomLinkDialog(reportLink.dataset.reportRoomLink);
    });
  }

  function renderActiveStudyCall(roomId=callRuntime.roomId){
    if(!roomId)return;
    const room=getStudyRoomById(roomId),root=$('#studyRoomLobbyContent');
    if(!room||!root)return;
    root.innerHTML=activeCallHTML(room);
    bindStudyCallActions(root);
    bindStudyRoomGoalActions(root);
    if(callRuntime.aiOpen)bindStudyRoomAIActions(root);
    attachLocalCallVideo();
    attachSharedScreenVideo();
    if(callRuntime.chatOpen)bindStudyRoomChatActions(root);
    updateCallTimerDisplay();
    const timer=getStudyRoomTimer(roomId);
    updateStudyRoomTimerDisplay(roomId);
    if(timer.status==='running')startStudyRoomTimerRenderer(roomId);else stopStudyRoomTimerRenderer();
  }

  async function attemptRealCallJoin(roomId){
    callStateManager.setState('joining',{roomId});
    const signaling=signalingService.connect({roomId});
    if(!signaling.success){
      callStateManager.setState('failed',{roomId,error:signaling.error});
      notificationManager.warning(signaling.error);
      return signaling;
    }
    callStateManager.setState('connecting',{roomId});
    return {success:true};
  }

  async function leaveStudyCall(roomId){
    const room=getStudyRoomById(roomId),u=current();
    if(room&&u&&room.hostUserId===u.id&&['waiting','active'].includes(room.status)){
      const hasOtherParticipants=(room.participantIds||[]).some(id=>id!==u.id);
      if(hasOtherParticipants){
        const transfer=await confirmDialog({title:'Transfer Host?',message:'You are the host. Transfer host ownership before leaving?',okText:'Choose New Host',cancelText:'End Room'});
        if(transfer){openManageMembersDialog(roomId);return {success:false,error:'transfer-host-first'}}
      }
      const ended=await endStudyRoomSession(roomId);
      return ended;
    }
    const ok=await confirmDialog({title:'Leave Study Call?',message:'Leave this study call? Your camera, microphone, and screen sharing will turn off.',okText:'Leave',cancelText:'Stay',danger:true});
    if(!ok)return {success:false,error:'cancelled'};
    callStateManager.setState('ending',{roomId});
    cleanupActiveCallMedia({silent:true});
    signalingService.leaveRoom(roomId);
    callStateManager.setState('ended',{roomId});
    callStateManager.reset();
    updateStudyRoomPresence({roomId,userId:current()?.id,state:'left'});
    notificationManager.info('Call disconnected.');
    renderStudyRoomLobby(roomId);
    return {success:true};
  }

  function ensureDeviceTestView(){
    ensureStudyRoomLobbyView();
    if($('#studyRoomDeviceTestView'))return;
    const anchor=$('#studyRoomLobbyView')||$('#studyRoomsView');
    const html='<section class="app-view" id="studyRoomDeviceTestView"><main id="study-room-device-test-page" aria-labelledby="device-test-title"><div id="studyRoomDeviceTestContent"></div></main></section>';
    if(anchor)anchor.insertAdjacentHTML('afterend',html);
  }

  async function deviceSelectHTML(){
    const prefs=getCallDevicePreferencesForUser(),result=await enumerateCallDevices(),devices=result.devices||[];
    const options=(kind,selected)=>devices.filter(device=>device.kind===kind).map(device=>`<option value="${safe(device.deviceId)}" ${device.deviceId===selected?'selected':''}>${safe(device.label)}</option>`).join('');
    return `<div class="device-selector-grid"><label>Camera<select id="callCameraSelect"><option value="">Default camera</option>${options('videoinput',prefs.cameraDeviceId)}</select></label><label>Microphone<select id="callMicrophoneSelect"><option value="">Default microphone</option>${options('audioinput',prefs.microphoneDeviceId)}</select></label><label>Speakers<select id="callSpeakerSelect"><option value="">Default speakers</option>${options('audiooutput',prefs.speakerDeviceId)}</select><small>${typeof HTMLMediaElement!=='undefined'&&HTMLMediaElement.prototype.setSinkId?'Speaker selection is supported.':'Speaker selection depends on browser support.'}</small></label></div>${result.success?'':'<p class="call-error-text">'+safe(result.error)+'</p>'}`;
  }

  async function renderDeviceTestPage(){
    ensureDeviceTestView();
    const root=$('#studyRoomDeviceTestContent');
    if(!root)return;
    const warnings=callSupportWarnings();
    root.innerHTML=`<header class="study-call-header"><div><p class="eyebrow">Camera & Microphone Test</p><h1 id="device-test-title">Camera & Microphone Test</h1><p>Test your local devices before entering a study room.</p></div><button class="btn btn-secondary" data-return-lobby="${safe(callRuntime.roomId||sessionStorage.getItem('selectedStudyRoomLobbyId')||'')}" type="button">Back to Lobby</button></header><section class="card device-test-card"><div class="card-head"><div><h2>Device Selection</h2><p>Only device IDs are saved. Recordings, camera streams, and microphone audio are never stored.</p></div><span class="simulated-badge">Local Test Only</span></div>${await deviceSelectHTML()}<div class="device-test-preview" id="deviceTestPreview"><div class="call-avatar-placeholder"><span>${safe(publicStudentProfile(current()?.id).initials)}</span></div></div><div class="microphone-meter" aria-label="Microphone level"><i id="microphoneLevelBar"></i></div><p id="deviceTestStatus" class="prototype-notice">Connection status: Local Test Only</p><div class="study-room-actions"><button class="btn btn-secondary" data-test-camera type="button">Start Camera</button><button class="btn btn-secondary" data-test-microphone type="button">Test Microphone</button><button class="btn btn-primary" data-test-both type="button">Test Camera & Microphone</button><button class="btn btn-secondary" data-refresh-devices type="button">Refresh Devices</button><button class="btn btn-danger" data-stop-device-test type="button">Stop Devices</button></div>${warnings.length?`<div class="call-warning-list">${warnings.map(warning=>`<p>${safe(warning)}</p>`).join('')}</div>`:''}</section><section class="card call-prototype-notice"><h3>Video and Audio Calls</h3><p>StudySpark uses WebRTC for real audio and video communication. WebRTC cannot exchange offers and answers by itself. A signaling server is required, such as WebSocket, Socket.IO, Firebase, or Supabase Realtime.</p><p>This front-end prototype supports local device testing only. Real online calls require a signaling server, authenticated users, HTTPS, and WebRTC infrastructure.</p></section>`;
    bindDeviceTestActions(root);
    attachDevicePreview();
  }

  function selectedDevicePreferences(){
    return {selectedCameraId:$('#callCameraSelect')?.value||'',selectedMicrophoneId:$('#callMicrophoneSelect')?.value||'',selectedSpeakerId:$('#callSpeakerSelect')?.value||''};
  }

  function saveSelectedDevicePreferences(){
    if(current()?.id)saveCallDevicePreferencesForUser(current().id,selectedDevicePreferences());
  }

  function attachDevicePreview(){
    const preview=$('#deviceTestPreview');
    if(!preview)return;
    if(callMediaState.cameraStream){
      preview.innerHTML='<video autoplay muted playsinline></video>';
      const video=$('video',preview);
      if(video)video.srcObject=callMediaState.cameraStream;
    }else{
      preview.innerHTML=`<div class="call-avatar-placeholder"><span>${safe(publicStudentProfile(current()?.id).initials)}</span><b>Camera is off</b></div>`;
    }
  }

  function updateMicrophoneMeter(){
    const bar=$('#microphoneLevelBar');
    if(!bar)return;
    bar.style.width=callMediaState.microphoneStream?'38%':'0%';
  }

  async function runDeviceTest(mode){
    saveSelectedDevicePreferences();
    const prefs=getCallDevicePreferencesForUser();
    let result={success:false,error:'Unknown device test.'};
    if(mode==='camera')result=await localMediaManager.startCamera({deviceId:prefs.cameraDeviceId});
    if(mode==='microphone')result=await localMediaManager.startMicrophone({deviceId:prefs.microphoneDeviceId});
    if(mode==='both')result=await localMediaManager.startCameraAndMicrophone({cameraDeviceId:prefs.cameraDeviceId,microphoneDeviceId:prefs.microphoneDeviceId});
    const status=$('#deviceTestStatus');
    if(status)status.textContent=result.success?(mode==='microphone'?'Microphone detected. Connection status: Local Test Only':'Connection status: Local Test Only'):result.error;
    attachDevicePreview();
    updateMicrophoneMeter();
    return result;
  }

  function bindDeviceTestActions(root=document){
    $('#callCameraSelect',root)?.addEventListener('change',saveSelectedDevicePreferences);
    $('#callMicrophoneSelect',root)?.addEventListener('change',saveSelectedDevicePreferences);
    $('#callSpeakerSelect',root)?.addEventListener('change',saveSelectedDevicePreferences);
    $$('[data-test-camera]',root).forEach(btn=>btn.onclick=()=>runDeviceTest('camera'));
    $$('[data-test-microphone]',root).forEach(btn=>btn.onclick=()=>runDeviceTest('microphone'));
    $$('[data-test-both]',root).forEach(btn=>btn.onclick=()=>runDeviceTest('both'));
    $$('[data-refresh-devices]',root).forEach(btn=>btn.onclick=()=>renderDeviceTestPage());
    $$('[data-stop-device-test]',root).forEach(btn=>btn.onclick=()=>{localMediaManager.stopAll();const status=$('#deviceTestStatus');if(status)status.textContent='Connection status: Local Test Only';attachDevicePreview();updateMicrophoneMeter()});
    $$('[data-return-lobby]',root).forEach(btn=>btn.onclick=()=>{localMediaManager.stopAll();if(btn.dataset.returnLobby)openStudyRoomLobby(btn.dataset.returnLobby);else showView('studyRooms')});
  }

  async function openDeviceTestPage(){
    ensureDeviceTestView();
    await showView('studyRoomDeviceTest');
    renderDeviceTestPage();
  }

  function closeDeviceMenu(){
    $('#studyCallDeviceMenu')?.remove();
  }

  async function openDeviceMenu(kind,trigger){
    closeDeviceMenu();
    const result=await studyRoomMediaService.enumerateAvailableDevices(),devices=kind==='camera'?result.cameras:result.microphones;
    const selected=kind==='camera'?callMediaState.selectedCameraId:callMediaState.selectedMicrophoneId;
    const menu=document.createElement('div');
    menu.id='studyCallDeviceMenu';
    menu.className='device-menu-popover';
    menu.setAttribute('role','menu');
    menu.innerHTML=`<strong>${kind==='camera'?'Camera Options':'Microphone Options'}</strong>${result.success?'':'<p class="call-error-text">'+safe(result.error)+'</p>'}<button type="button" role="menuitem" data-device-choice="">Default ${kind==='camera'?'camera':'microphone'}</button>${devices.map(device=>`<button type="button" role="menuitem" data-device-choice="${safe(device.deviceId)}">${safe(device.label)}${device.deviceId===selected?' - Selected':''}</button>`).join('')}<button type="button" role="menuitem" data-device-off>${kind==='camera'?'Turn Camera Off':'Turn Microphone Off'}</button>`;
    document.body.appendChild(menu);
    const rect=trigger.getBoundingClientRect();
    menu.style.left=`${Math.min(rect.left,window.innerWidth-260)}px`;
    menu.style.top=`${rect.bottom+8}px`;
    $$('[data-device-choice]',menu).forEach(button=>button.onclick=async()=>{const id=button.dataset.deviceChoice||'';closeDeviceMenu();if(kind==='camera')await studyRoomMediaService.switchCamera(id);else await studyRoomMediaService.switchMicrophone(id)});
    $('[data-device-off]',menu).onclick=()=>{closeDeviceMenu();kind==='camera'?studyRoomMediaService.disableCamera():studyRoomMediaService.disableMicrophone()};
    const closeOnClick=event=>{if(!menu.contains(event.target)&&event.target!==trigger){closeDeviceMenu();document.removeEventListener('click',closeOnClick,true)}};
    setTimeout(()=>document.addEventListener('click',closeOnClick,true),0);
  }

  async function handleMediaDeviceChange(){
    const result=await enumerateAvailableDevices();
    if(!result.success)return;
    if(callMediaState.selectedCameraId&&callMediaState.cameraEnabled&&!result.cameras.some(device=>device.deviceId===callMediaState.selectedCameraId)){studyRoomMediaService.disableCamera({silent:true});notificationManager.warning('The selected camera disconnected. Camera was turned off.')}
    if(callMediaState.selectedMicrophoneId&&callMediaState.microphoneEnabled&&!result.microphones.some(device=>device.deviceId===callMediaState.selectedMicrophoneId)){studyRoomMediaService.disableMicrophone({silent:true});notificationManager.warning('The selected microphone disconnected. Microphone was turned off.')}
    renderActiveStudyCall();
    if($('#studyRoomDeviceTestView.active'))renderDeviceTestPage();
  }

  function openCustomTimerDialog(roomId){
    const title=text(window.prompt?.('Custom timer title', 'Mock Exam'));
    if(!title)return notificationManager.warning('Enter a timer title.');
    if(privateInfo(title))return notificationManager.warning('Do not include private information in timer titles.');
    const minutes=Number(window.prompt?.('Duration in minutes, from 1 to 180', '60'));
    if(!Number.isFinite(minutes)||minutes<1||minutes>180)return notificationManager.warning('Timer duration must be between 1 and 180 minutes.');
    const result=studyRoomTimerService.changeMode({roomId,mode:'custom',title,durationSeconds:Math.round(minutes*60)});
    if(!result.success)notificationManager.warning(result.error);
  }

  function timerScheduleEditorRow(step,index){
    const options=Object.values(TIMER_MODES).map(item=>`<option value="${safe(item.mode)}" ${step.mode===item.mode?'selected':''}>${safe(item.shortTitle)}</option>`).join('');
    return `<article class="timer-schedule-edit-row" data-timer-schedule-row="${safe(index)}"><label>Mode<select data-timer-schedule-mode>${options}</select></label><label>Title<input data-timer-schedule-title maxlength="80" value="${safe(step.title||getTimerPreset(step.mode).title)}"></label><label>Minutes<input data-timer-schedule-minutes type="number" min="1" max="180" step="1" value="${safe(Math.round(step.durationSeconds/60))}"></label><div class="timer-schedule-row-actions"><button class="btn btn-secondary" data-timer-schedule-up type="button">Move Up</button><button class="btn btn-secondary" data-timer-schedule-down type="button">Move Down</button><button class="btn btn-danger" data-timer-schedule-remove type="button">Remove</button></div></article>`;
  }

  function openTimerScheduleEditor(roomId){
    const access=validateStudyRoomTimerHost(roomId);
    if(!access.success){notificationManager.warning(access.error);return}
    const schedule=getStudyRoomTimerSchedule(roomId);
    document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay active" id="studyRoomTimerScheduleDialog"><form class="modal-card timer-schedule-editor" role="dialog" aria-modal="true" aria-labelledby="timerScheduleEditorTitle"><h2 id="timerScheduleEditorTitle">Edit Timer Schedule</h2><p>Build a local prototype schedule for this room. Real schedule synchronization requires the backend.</p><div id="timerScheduleEditRows">${schedule.steps.map(timerScheduleEditorRow).join('')}</div><div id="timerScheduleEditError" class="call-error-text" role="alert"></div><div class="study-room-form-actions"><button class="btn btn-secondary" data-timer-schedule-add type="button">Add Session</button><button class="btn btn-primary" type="submit">Save Schedule</button><button class="btn btn-secondary" data-timer-schedule-cancel type="button">Cancel</button></div></form></div>`);
    const dialog=$('#studyRoomTimerScheduleDialog'),form=$('form',dialog),rows=$('#timerScheduleEditRows',dialog),error=$('#timerScheduleEditError',dialog);
    function collect(){
      return $$('[data-timer-schedule-row]',rows).map(row=>{
        const mode=normalizeTimerMode($('[data-timer-schedule-mode]',row).value),minutes=Number($('[data-timer-schedule-minutes]',row).value),title=text($('[data-timer-schedule-title]',row).value);
        if(!Number.isFinite(minutes)||minutes<1||minutes>180)throw new Error('Each session must be between 1 and 180 minutes.');
        if(privateInfo(title))throw new Error('Do not include private information in timer session titles.');
        return normalizeScheduleStep({mode,title,durationSeconds:minutes*60});
      });
    }
    function rerender(steps){
      rows.innerHTML=steps.map(timerScheduleEditorRow).join('');
      bindRows();
    }
    function bindRows(){
      $$('[data-timer-schedule-mode]',rows).forEach(select=>select.onchange=()=>{const row=select.closest('[data-timer-schedule-row]'),title=$('[data-timer-schedule-title]',row),mode=normalizeTimerMode(select.value);if(title&&!title.value.trim())title.value=getTimerPreset(mode).title});
      $$('[data-timer-schedule-up]',rows).forEach(btn=>btn.onclick=()=>{try{const steps=collect(),index=Number(btn.closest('[data-timer-schedule-row]').dataset.timerScheduleRow);if(index>0){[steps[index-1],steps[index]]=[steps[index],steps[index-1]];rerender(steps)}}catch(err){error.textContent=err.message}});
      $$('[data-timer-schedule-down]',rows).forEach(btn=>btn.onclick=()=>{try{const steps=collect(),index=Number(btn.closest('[data-timer-schedule-row]').dataset.timerScheduleRow);if(index<steps.length-1){[steps[index+1],steps[index]]=[steps[index],steps[index+1]];rerender(steps)}}catch(err){error.textContent=err.message}});
      $$('[data-timer-schedule-remove]',rows).forEach(btn=>btn.onclick=()=>{try{const steps=collect(),index=Number(btn.closest('[data-timer-schedule-row]').dataset.timerScheduleRow);if(steps.length<=1){error.textContent='Keep at least one timer session.';return}steps.splice(index,1);rerender(steps)}catch(err){error.textContent=err.message}});
    }
    $('[data-timer-schedule-add]',dialog).onclick=()=>{try{const steps=collect();steps.push(normalizeScheduleStep({mode:'focus',title:'Focus Period',durationSeconds:1500}));rerender(steps)}catch(err){error.textContent=err.message}};
    $('[data-timer-schedule-cancel]',dialog).onclick=()=>dialog.remove();
    form.onsubmit=event=>{event.preventDefault();try{const steps=collect();const result=studyRoomTimerService.saveSchedule({roomId,schedule:{...schedule,steps,stepIndex:0,autoAdvance:$('[data-room-timer-auto-advance]')?.checked===true}});if(!result.success){error.textContent=result.error;return}dialog.remove();notificationManager.success('Timer schedule saved.')}catch(err){error.textContent=err.message}};
    dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.remove()});
    bindRows();
  }

  function announceSharedGoalError(message){
    const error=$('#shared-goal-error');
    if(error)error.textContent=message||'';
    if(message)notificationManager.warning(message);
  }
  function rerenderSharedGoals(roomId=callRuntime.roomId){
    const room=getStudyRoomById(roomId),panel=$('#study-room-goals');
    if(!room||!panel)return;
    panel.outerHTML=studyRoomGoalsHTML(room);
    bindStudyRoomGoalActions($('#study-room-goals')?.parentElement||document);
  }
  function openEditSharedTaskDialog(roomId,taskId){
    const record=studyRoomGoalService.load(roomId),task=record.tasks.find(item=>item.taskId===taskId);
    if(!task)return announceSharedGoalError('Task not found.');
    const title=window.prompt?.('Task title',task.title);
    if(title===null||title===undefined)return;
    const description=window.prompt?.('Optional task description',task.description||'')||'';
    const result=studyRoomGoalService.editTask({roomId,taskId,title,description});
    if(!result.success)return announceSharedGoalError(result.error);
    notificationManager.success('Task updated.');
    rerenderSharedGoals(roomId);
  }
  function renameSharedGoal(roomId){
    const record=studyRoomGoalService.load(roomId),title=window.prompt?.('Shared goal title',record.goal.title||"Today's Goal");
    if(title===null||title===undefined)return;
    const result=studyRoomGoalService.renameGoal({roomId,title});
    if(!result.success)return announceSharedGoalError(result.error);
    notificationManager.success('Goal updated.');
    rerenderSharedGoals(roomId);
  }
  async function deleteSharedGoal(roomId){
    const ok=await confirmDialog({title:'Delete Shared Goal?',message:'This removes the shared goal and all of its tasks from this browser.',okText:'Delete',cancelText:'Cancel',danger:true});
    if(!ok)return;
    const result=studyRoomGoalService.deleteGoal({roomId});
    if(!result.success)return announceSharedGoalError(result.error);
    notificationManager.info('Goal reset.');
    rerenderSharedGoals(roomId);
  }

  function bindStudyRoomGoalActions(root=document){
    const form=$('#shared-goal-task-form',root);
    if(form){
      form.onsubmit=event=>{
        event.preventDefault();
        const roomId=form.dataset.sharedGoalRoom,result=studyRoomGoalService.addTask({roomId,title:$('#shared-goal-task-title',form)?.value,description:$('#shared-goal-task-description',form)?.value});
        if(!result.success)return announceSharedGoalError(result.error);
        notificationManager.success('Task added.');
        rerenderSharedGoals(roomId);
      };
    }
    $$('[data-shared-task-toggle]',root).forEach(input=>input.onchange=()=>{const task=input.dataset.sharedTaskToggle,roomId=callRuntime.roomId,result=studyRoomGoalService.toggleTask({roomId,taskId:task,completed:input.checked});if(!result.success){input.checked=!input.checked;return announceSharedGoalError(result.error)}notificationManager.info(input.checked?'Task completed.':'Task marked incomplete.');rerenderSharedGoals(roomId)});
    $$('[data-shared-task-edit]',root).forEach(btn=>btn.onclick=()=>openEditSharedTaskDialog(callRuntime.roomId,btn.dataset.sharedTaskEdit));
    $$('[data-shared-task-up]',root).forEach(btn=>btn.onclick=()=>{const result=studyRoomGoalService.moveTask({roomId:callRuntime.roomId,taskId:btn.dataset.sharedTaskUp,direction:'up'});if(!result.success)return announceSharedGoalError(result.error);rerenderSharedGoals(callRuntime.roomId)});
    $$('[data-shared-task-down]',root).forEach(btn=>btn.onclick=()=>{const result=studyRoomGoalService.moveTask({roomId:callRuntime.roomId,taskId:btn.dataset.sharedTaskDown,direction:'down'});if(!result.success)return announceSharedGoalError(result.error);rerenderSharedGoals(callRuntime.roomId)});
    $$('[data-shared-task-delete]',root).forEach(btn=>btn.onclick=async()=>{const ok=await confirmDialog({title:'Delete Task?',message:'Delete this shared study task?',okText:'Delete',cancelText:'Cancel',danger:true});if(!ok)return;const result=studyRoomGoalService.deleteTask({roomId:callRuntime.roomId,taskId:btn.dataset.sharedTaskDelete});if(!result.success)return announceSharedGoalError(result.error);notificationManager.info('Task deleted.');rerenderSharedGoals(callRuntime.roomId)});
    $$('[data-shared-goal-rename]',root).forEach(btn=>btn.onclick=()=>renameSharedGoal(btn.dataset.sharedGoalRename));
    $$('[data-shared-goal-delete]',root).forEach(btn=>btn.onclick=()=>deleteSharedGoal(btn.dataset.sharedGoalDelete));
  }

  function bindStudyRoomHostControls(root=document){
    $$('[data-host-lock-room]',root).forEach(btn=>btn.onclick=()=>{const result=studyRoomHostService.lockRoom({roomId:btn.dataset.hostLockRoom});if(!result.success)return notify('warning',result.error);renderStudyRoomLobby(btn.dataset.hostLockRoom);renderActiveStudyCall(btn.dataset.hostLockRoom)});
    $$('[data-host-unlock-room]',root).forEach(btn=>btn.onclick=()=>{const result=studyRoomHostService.unlockRoom({roomId:btn.dataset.hostUnlockRoom});if(!result.success)return notify('warning',result.error);renderStudyRoomLobby(btn.dataset.hostUnlockRoom);renderActiveStudyCall(btn.dataset.hostUnlockRoom)});
    $$('[data-host-approve-request]',root).forEach(btn=>btn.onclick=()=>{const result=studyRoomHostService.approveJoinRequest({requestId:btn.dataset.hostApproveRequest});if(!result.success)return notify('warning',result.error);renderStudyRoomLobby(result.room.roomId);renderActiveStudyCall(result.room.roomId)});
    $$('[data-host-decline-request]',root).forEach(btn=>btn.onclick=()=>{const result=studyRoomHostService.declineJoinRequest({requestId:btn.dataset.hostDeclineRequest});if(!result.success)return notify('warning',result.error);renderStudyRoomLobby(callRuntime.roomId||sessionStorage.getItem('selectedStudyRoomLobbyId'))});
    $$('[data-host-change-topic]',root).forEach(btn=>btn.onclick=()=>openChangeStudyTopicDialog(btn.dataset.hostChangeTopic));
    $$('[data-host-room-settings]',root).forEach(btn=>btn.onclick=()=>openRoomSettingsDialog(btn.dataset.hostRoomSettings));
    $$('[data-host-transfer-submit]',root).forEach(btn=>btn.onclick=async()=>{const roomId=btn.dataset.hostTransferSubmit,select=$(`[data-host-transfer-select="${roomId}"]`,root),newHostUserId=select?.value;if(!newHostUserId)return notify('warning','Choose a participant to transfer host ownership.');const profile=publicStudentProfile(newHostUserId),ok=await confirmDialog({title:'Transfer Host?',message:`Transfer host to ${profile.name}?`,okText:'Transfer',cancelText:'Cancel'});if(!ok)return;const result=studyRoomHostService.transferHost({roomId,newHostUserId});if(!result.success)return notify('warning',result.error);renderStudyRoomLobby(roomId);renderActiveStudyCall(roomId)});
  }

  function bindStudyCallActions(root=document){
    $$('[data-call-toggle-camera]',root).forEach(btn=>btn.onclick=async()=>{if(callMediaState.cameraEnabled)studyRoomMediaService.disableCamera();else await studyRoomMediaService.enableCamera({deviceId:getCallDevicePreferencesForUser().selectedCameraId})});
    $$('[data-call-toggle-microphone]',root).forEach(btn=>btn.onclick=async()=>{if(callMediaState.microphoneEnabled)studyRoomMediaService.disableMicrophone();else await studyRoomMediaService.enableMicrophone({deviceId:getCallDevicePreferencesForUser().selectedMicrophoneId})});
    $$('[data-call-toggle-screen]',root).forEach(btn=>btn.onclick=async()=>{const result=callMediaState.screenSharing?await studyRoomMediaService.stopScreenShare({roomId:btn.dataset.callToggleScreen}):await startScreenShare({roomId:btn.dataset.callToggleScreen});if(result&&!result.success&&result.error!=='cancelled')notificationManager.warning(result.error)});
    $$('[data-screen-fullscreen]',root).forEach(btn=>btn.onclick=async()=>{const frame=$('.shared-screen-frame');if(frame?.requestFullscreen)await frame.requestFullscreen()});
    $$('[data-host-screen-share-permission]',root).forEach(select=>select.onchange=()=>updateRoomScreenSharePermission(select.dataset.hostScreenSharePermission,select.value));
    $$('[data-host-chat-enabled]',root).forEach(select=>select.onchange=()=>updateRoomChatEnabled(select.dataset.hostChatEnabled,select.value==='true'));
    $$('[data-host-request-stop-share]',root).forEach(btn=>btn.onclick=()=>notificationManager.info('Remote screen-share controls require the signaling backend and moderation rules.'));
    bindStudyRoomHostControls(root);
    $$('[data-call-device-menu]',root).forEach(btn=>btn.onclick=event=>{event.stopPropagation();openDeviceMenu(btn.dataset.callDeviceMenu,btn)});
    $$('[data-open-device-test]',root).forEach(btn=>btn.onclick=()=>openDeviceTestPage());
    $$('[data-call-toggle-chat]',root).forEach(btn=>btn.onclick=()=>{if(callRuntime.chatOpen)closeStudyRoomChat();else openStudyRoomChat(callRuntime.roomId)});
    $$('[data-call-toggle-ai]',root).forEach(btn=>btn.onclick=()=>{if(callRuntime.aiOpen)closeStudyRoomAI();else openStudyRoomAI(callRuntime.roomId,btn)});
    $$('[data-call-toggle-participants]',root).forEach(btn=>btn.onclick=()=>{callRuntime.participantsOpen=!callRuntime.participantsOpen;renderActiveStudyCall()});
    $$('[data-room-timer-start]',root).forEach(btn=>btn.onclick=()=>{const result=studyRoomTimerService.start({roomId:btn.dataset.roomTimerStart});if(!result.success)notificationManager.warning(result.error)});
    $$('[data-room-timer-pause]',root).forEach(btn=>btn.onclick=()=>{const result=studyRoomTimerService.pause({roomId:btn.dataset.roomTimerPause});if(!result.success)notificationManager.warning(result.error)});
    $$('[data-room-timer-reset]',root).forEach(btn=>btn.onclick=()=>{const result=studyRoomTimerService.reset({roomId:btn.dataset.roomTimerReset});if(!result.success)notificationManager.warning(result.error)});
    $$('[data-room-timer-next]',root).forEach(btn=>btn.onclick=()=>{const result=studyRoomTimerService.nextSession({roomId:btn.dataset.roomTimerNext});if(!result.success)notificationManager.warning(result.error)});
    $$('[data-room-timer-mode]',root).forEach(select=>select.onchange=()=>{const preset=getTimerPreset(select.value),result=studyRoomTimerService.changeMode({roomId:select.dataset.roomTimerMode,mode:preset.mode,title:preset.title,durationSeconds:preset.durationSeconds});if(!result.success)notificationManager.warning(result.error)});
    $$('[data-room-timer-custom]',root).forEach(btn=>btn.onclick=()=>openCustomTimerDialog(btn.dataset.roomTimerCustom));
    $$('[data-room-timer-edit-schedule]',root).forEach(btn=>btn.onclick=()=>openTimerScheduleEditor(btn.dataset.roomTimerEditSchedule));
    $$('[data-room-timer-sound]',root).forEach(input=>input.onchange=()=>studyRoomTimerService.setCompletionSound(input.checked));
    $$('[data-room-timer-auto-advance]',root).forEach(input=>input.onchange=()=>{const roomId=input.dataset.roomTimerAutoAdvance,schedule=getStudyRoomTimerSchedule(roomId),result=studyRoomTimerService.saveSchedule({roomId,schedule:{...schedule,autoAdvance:input.checked}});if(!result.success)notificationManager.warning(result.error);else notificationManager.info(input.checked?'Auto advance is on.':'Auto advance is off.')});
    $$('[data-real-join-call]',root).forEach(btn=>btn.onclick=()=>attemptRealCallJoin(btn.dataset.realJoinCall));
    $$('[data-leave-study-call]',root).forEach(btn=>btn.onclick=()=>leaveStudyCall(btn.dataset.leaveStudyCall));
    $$('[data-report-study-room]',root).forEach(btn=>btn.onclick=()=>openReportStudyRoomDialog(btn.dataset.reportStudyRoom));
    $$('[data-open-blocked-users]',root).forEach(btn=>btn.onclick=()=>openBlockedUsersDialog());
    $$('[data-leave-lobby-room]',root).forEach(btn=>btn.onclick=()=>leaveStudyCall(btn.dataset.leaveLobbyRoom));
  }

  function renderStudyRoomSessionPlaceholder(room){
    const root=$('#studyRoomLobbyContent');
    if(!root)return;
    callRuntime.roomId=room.roomId;
    applyStoredMediaPreferences();
    if(current()?.id)registerActiveCallTab(room.roomId,current().id);
    callStateManager.setState(signalingService.connected?'connecting':'waiting',{roomId:room.roomId});
    renderActiveStudyCall(room.roomId);
  }

  function leaveStudyRoomLobby(roomId,{permanent=false}={}){
    const u=current(),room=getStudyRoomById(roomId);
    if(!u||!room)return {success:false,error:'Study room not found.'};
    stopLobbyMedia();
    clearDevicePreference(roomId,u.id);
    updateStudyRoomPresence({roomId,userId:u.id,state:'left'});
    if(!permanent){
      notify('information',room.hostUserId===u.id?'Leaving the lobby will not cancel the study room.':'You left the study-room lobby.');
      showView('studyRooms');
      return {success:true};
    }
    if(room.hostUserId===u.id)return {success:false,error:'The host cannot permanently leave their own room.'};
    const now=new Date().toISOString(),rooms=loadStudyRooms().map(item=>item.roomId===roomId?{...item,participantIds:(item.participantIds||[]).filter(id=>id!==u.id),removedUserIds:unique([...(item.removedUserIds||[]),u.id]),updatedAt:now}:item);
    const saved=saveStudyRooms(rooms);
    if(saved.success){
      saveStudyRoomInvitations(loadStudyRoomInvitations().map(invite=>invite.roomId===roomId&&invite.toUserId===u.id&&invite.status==='pending'?{...invite,status:'cancelled',cancelledAt:now,updatedAt:now}:invite));
      notify('information','You left the study room.');
      showView('studyRooms');
    }
    return saved.success?{success:true}:saved;
  }

  async function confirmLeaveRoomPermanently(roomId){
    const ok=await confirmDialog({title:'Leave Study Room?',message:'You will be removed from this room and may need a new invitation to return.',okText:'Leave Room',cancelText:'Stay',danger:true});
    if(ok){
      const result=leaveStudyRoomLobby(roomId,{permanent:true});
      if(!result.success)notify('warning',result.error);
    }
  }

  function createStudyRoomReportId(){
    if(window.crypto&&typeof window.crypto.randomUUID==='function')return 'room-report-'+window.crypto.randomUUID();
    return 'room-report-'+Date.now()+'-'+Math.random().toString(36).slice(2,10);
  }

  function loadStudyRoomReports(){try{return JSON.parse(localStorage.getItem(REPORT_KEY)||'[]')}catch{return []}}
  function saveStudyRoomReports(rows){localStorage.setItem(REPORT_KEY,JSON.stringify(Array.isArray(rows)?rows:[]))}

  function submitStudyRoomReport({roomId,reason,notes=''}) {
    const room=getStudyRoomById(roomId);
    if(!room)return {success:false,error:'Study room not found.'};
    return studyRoomReportService.reportRoom({roomId,reportedUserId:room.hostUserId,category:reason,description:notes});
  }

  function openReportStudyRoomDialog(roomId){
    const room=getStudyRoomById(roomId);
    if(!room)return notify('warning','Study room not found.');
    document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay active" id="studyRoomReportDialog"><form class="modal-card support-modal-card" role="dialog" aria-modal="true" aria-labelledby="roomReportTitle"><h2 id="roomReportTitle">Report Study Room</h2><label>Reason<select id="roomReportReason">${reportCategoryOptionsHTML()}</select></label><label>Optional description<textarea id="roomReportNotes" maxlength="1000" rows="4"></textarea></label><p class="prototype-notice" role="status">This prototype stores reports locally with status submitted-local. Real deployment requires authenticated backend permissions, moderation tools and secure reporting.</p><div class="study-room-form-actions"><button class="btn btn-secondary" data-room-report-cancel type="button">Cancel</button><button class="btn btn-primary" type="submit">Submit Report</button></div></form></div>`);
    const dialog=$('#studyRoomReportDialog'),form=$('form',dialog);
    $('[data-room-report-cancel]',dialog).onclick=()=>dialog.remove();
    form.onsubmit=event=>{
      event.preventDefault();
      const result=submitStudyRoomReport({roomId,reason:$('#roomReportReason',dialog).value,notes:$('#roomReportNotes',dialog).value});
      if(!result.success)return notify('warning',result.error);
      dialog.remove();
      notify('success','Report saved locally for prototype testing.');
      showPostReportDialog({roomId,reportedUserId:room.hostUserId});
    };
  }

  function showPostReportDialog({roomId,reportedUserId=''}={}){
    $('#roomReportSavedDialog')?.remove();
    document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay active" id="roomReportSavedDialog"><section class="modal-card support-modal-card" role="dialog" aria-modal="true" aria-labelledby="roomReportSavedTitle"><h2 id="roomReportSavedTitle">Report Submitted</h2><p role="status">Report saved locally for prototype testing.</p><p class="prototype-notice">The production version requires authenticated backend enforcement and human moderation for reports.</p><div class="study-room-actions">${reportedUserId?`<button class="btn btn-danger" data-post-report-block="${safe(reportedUserId)}" type="button">Block User</button>`:''}<button class="btn btn-secondary" data-report-leave type="button">Leave Room</button><button class="btn btn-primary" data-report-dashboard type="button">Return to Dashboard</button></div></section></div>`);
    const dialog=$('#roomReportSavedDialog');
    $('[data-report-leave]',dialog).onclick=()=>{$('#roomReportSavedDialog')?.remove();leaveStudyRoomLobby(roomId)};
    $('[data-report-dashboard]',dialog).onclick=()=>{$('#roomReportSavedDialog')?.remove();showView('dashboard')};
    $('[data-post-report-block]',dialog)?.addEventListener('click',async event=>{const result=await blockUserFromStudyRoom({roomId,blockedUserId:event.currentTarget.dataset.postReportBlock});if(result.error&&result.error!=='cancelled')notify('warning',result.error);dialog.remove()});
  }

  function blockableLobbyMembers(room){
    const u=current();
    return (room.participantIds||[]).filter(id=>id!==u?.id).filter(id=>!studyRoomBlockService.isBlocked({userIdA:u?.id,userIdB:id,roomId:room?.roomId})).map(publicStudentProfile);
  }

  function createRoomBlockRecord(blockedUserId){
    const u=current(),now=new Date().toISOString();
    studyRoomBlockService.blockUser({blockedUserId,roomId:sessionStorage.getItem('selectedStudyRoomLobbyId')||callRuntime.roomId||'',reasonCategory:'study-room'});
    if(typeof loadFriendBlocks!=='function'||typeof saveFriendBlocks!=='function')return true;
    const blocks=loadFriendBlocks();
    if(!blocks.some(row=>row.blockedBy===u.id&&row.blockedUser===blockedUserId))blocks.unshift({blockId:'block-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),blockedBy:u.id,blockedUser:blockedUserId,createdAt:now,prototypeOnly:true});
    saveFriendBlocks(blocks);
    if(typeof removeFriend==='function')removeFriend(blockedUserId,{silent:true});
    if(typeof loadFriendRequests==='function'&&typeof saveFriendRequests==='function'){
      saveFriendRequests(loadFriendRequests().map(request=>request.status==='pending'&&((request.fromUserId===u.id&&request.toUserId===blockedUserId)||(request.fromUserId===blockedUserId&&request.toUserId===u.id))?{...request,status:'cancelled',cancelledAt:now,updatedAt:now}:request));
    }
    return true;
  }

  async function blockUserFromStudyRoom({roomId,blockedUserId}){
    const u=current(),room=getStudyRoomById(roomId),target=publicStudentProfile(blockedUserId);
    if(!u||!room||!blockedUserId)return {success:false,error:'The selected user could not be blocked.'};
    const ok=await confirmDialog({title:`Block ${target.name}?`,message:`${target.name} will be removed from your Friends list and you will not be able to interact in future study rooms.`,okText:'Block User',cancelText:'Cancel',danger:true});
    if(!ok)return {success:false,error:'cancelled'};
    createRoomBlockRecord(blockedUserId);
    if(u.id===room.hostUserId){
      await removeParticipantFromStudyRoom({roomId,participantId:blockedUserId,silent:true});
      notify('success','User blocked.');
      notify('information','Some interactions have been limited.');
      renderStudyRoomLobby(roomId);
      return {success:true};
    }
    leaveStudyRoomLobby(roomId,{permanent:true});
    notify('success','User blocked.');
    notify('information','Some interactions have been limited.');
    return {success:true};
  }

  function openBlockRoomUserDialog(roomId){
    const room=getStudyRoomById(roomId),members=room?blockableLobbyMembers(room):[];
    if(!members.length)return notify('warning','No room members are available to block.');
    document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay active" id="blockRoomUserDialog"><section class="modal-card support-modal-card" role="dialog" aria-modal="true" aria-labelledby="blockRoomUserTitle"><h2 id="blockRoomUserTitle">Block User</h2><label>Choose a room member<select id="blockRoomUserSelect">${members.map(member=>`<option value="${safe(member.id)}">${safe(member.name)}</option>`).join('')}</select></label><div class="study-room-form-actions"><button class="btn btn-secondary" data-block-room-cancel type="button">Cancel</button><button class="btn btn-danger" data-block-room-submit type="button">Block User</button></div></section></div>`);
    const dialog=$('#blockRoomUserDialog');
    $('[data-block-room-cancel]',dialog).onclick=()=>dialog.remove();
    $('[data-block-room-submit]',dialog).onclick=async()=>{const result=await blockUserFromStudyRoom({roomId,blockedUserId:$('#blockRoomUserSelect',dialog).value});if(result.success)dialog.remove();else if(result.error!=='cancelled')notify('warning',result.error)};
  }

  function openBlockedUsersDialog(){
    const u=current(),blocks=studyRoomSafetyService.loadBlocks().filter(row=>row.blockedByUserId===u?.id&&row.status==='active');
    document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay active" id="blockedUsersDialog"><section class="modal-card support-modal-card" role="dialog" aria-modal="true" aria-labelledby="blockedUsersTitle"><h2 id="blockedUsersTitle">Blocked Users</h2><div class="blocked-user-list">${blocks.length?blocks.map(row=>{const profile=publicStudentProfile(row.blockedUserId);return `<article class="blocked-user-row"><span><b>${safe(profile.name)}</b><small>Blocked ${safe(relativeTime(row.createdAt))}</small></span><button class="btn btn-secondary" data-unblock-room-user="${safe(row.blockedUserId)}" type="button">Unblock</button></article>`}).join(''):'<p class="empty-mini">No blocked users in this browser.</p>'}</div><p class="prototype-notice">Blocking is stored locally in this prototype. Production blocking must be enforced by the backend.</p><div class="study-room-form-actions"><button class="btn btn-secondary" data-blocked-users-close type="button">Close</button></div></section></div>`);
    const dialog=$('#blockedUsersDialog');
    $('[data-blocked-users-close]',dialog).onclick=()=>dialog.remove();
    $$('[data-unblock-room-user]',dialog).forEach(btn=>btn.onclick=()=>{const result=studyRoomSafetyService.unblockUser({blockedUserId:btn.dataset.unblockRoomUser});if(!result.success)return notify('warning',result.error);dialog.remove();notify('success','User unblocked.');openBlockedUsersDialog()});
  }

  function notifyRoomParticipants(room,message,excludeUserId=''){
    (room.participantIds||[]).filter(id=>id!==excludeUserId).forEach(userId=>notify('information',message,{category:'study-room',userId,relatedRoomId:room.roomId,occurrenceKey:`study-room:${room.roomId}:${message}:${userId}`,linkPage:'studyRooms'}));
  }

  function hostOnlyRoom(roomId){
    return studyRoomHostService.validateHost(roomId);
  }

  function openWaitingRoom(roomId){
    const access=hostOnlyRoom(roomId);
    if(!access.success)return access;
    if(access.room.status!=='scheduled')return {success:false,error:'Only scheduled rooms can be opened.'};
    const result=updateStudyRoom(roomId,{status:'waiting',startedAt:null});
    if(result.success){appendStudyRoomSystemMessage(roomId,`${access.user.name||'The host'} opened the waiting room.`,access.user.id);notify('success','Waiting room opened.');notifyRoomParticipants(result.room,`${result.room.roomName} is now open.`,current().id);renderStudyRoomLobby(roomId)}
    return result;
  }

  function startStudyRoomSession(roomId){
    const result=studyRoomHostService.startSession({roomId});
    if(result.success)renderStudyRoomSessionPlaceholder(result.room);
    return result;
  }

  async function endStudyRoomSession(roomId){
    const access=hostOnlyRoom(roomId);
    if(!access.success)return access;
    if(access.room.status!=='active')return {success:false,error:'Only active sessions can be ended.'};
    const ok=await confirmDialog({title:'End Study Session?',message:'All members will leave the active session.',okText:'End Session',cancelText:'Continue Studying',danger:true});
    if(!ok)return {success:false,error:'cancelled'};
    const result=studyRoomHostService.endSession({roomId});
    if(result.success)showView('studyRooms');
    return result;
  }

  async function removeParticipantFromStudyRoom({roomId,participantId,silent=false}){
    const access=hostOnlyRoom(roomId),target=publicStudentProfile(participantId);
    if(!access.success)return access;
    if(participantId===access.room.hostUserId||participantId===current()?.id)return {success:false,error:'You cannot remove yourself.'};
    if(!silent){
      const ok=await confirmDialog({title:`Remove ${target.name} from the room?`,message:`${target.name} will no longer be able to join this room.`,okText:'Remove Participant',cancelText:'Cancel',danger:true});
      if(!ok)return {success:false,error:'cancelled'};
    }
    const saved=studyRoomHostService.removeParticipant({roomId,participantId});
    if(saved.success){
      const now=new Date().toISOString();
      saveStudyRoomInvitations(loadStudyRoomInvitations().map(invite=>invite.roomId===roomId&&invite.toUserId===participantId&&invite.status==='pending'?{...invite,status:'cancelled',cancelledAt:now,updatedAt:now}:invite));
      if(participantId===current()?.id&&callRuntime.roomId===roomId)cleanupActiveCallMedia({silent:true});
      notify('information',`You were removed from ${access.room.roomName}.`,{category:'study-room',userId:participantId,relatedRoomId:roomId,linkPage:'studyRooms'});
      renderStudyRoomLobby(roomId);
    }
    return saved.success?{success:true}:saved;
  }

  function openManageMembersDialog(roomId){
    const access=hostOnlyRoom(roomId);
    if(!access.success)return notify('warning',access.error);
    const rows=(access.room.participantIds||[]).filter(id=>id!==access.room.hostUserId).map(id=>{const profile=publicStudentProfile(id),state=roomPresenceState(roomId,id),muted=isRoomUserMuted(access.room,id);return `<article class="lobby-member-card"><div><b>${safe(profile.name)}</b><small>Participant - ${safe(state==='in-room'?'Joined':state==='in-lobby'?'In Lobby':'Not Yet Joined')}${muted?' - Muted by Host':''}</small></div><div class="study-room-actions"><button class="btn btn-secondary" data-host-placeholder type="button">View Limited Profile</button><button class="btn btn-secondary" data-host-mute-participant="${safe(id)}" data-muted="${muted?'true':'false'}" type="button">${muted?'Unmute':'Mute'}</button><button class="btn btn-secondary" data-host-transfer-participant="${safe(id)}" type="button">Transfer Host</button><button class="btn btn-danger" data-host-remove-participant="${safe(id)}" type="button">Remove Participant</button><button class="btn btn-danger" data-host-block-participant="${safe(id)}" type="button">Block User</button><button class="btn btn-secondary" data-report-room-user="${safe(id)}" type="button">Report User</button></div></article>`}).join('');
    document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay active" id="manageRoomMembersDialog"><section class="modal-card room-invite-panel" role="dialog" aria-modal="true" aria-labelledby="manageMembersTitle"><h2 id="manageMembersTitle">Members</h2><div class="lobby-member-list">${rows||'<div class="empty-mini">No participants to manage.</div>'}</div><div class="study-room-form-actions"><button class="btn btn-secondary" data-manage-members-close type="button">Close</button></div></section></div>`);
    const dialog=$('#manageRoomMembersDialog');
    $('[data-manage-members-close]',dialog).onclick=()=>dialog.remove();
    $$('[data-host-placeholder]',dialog).forEach(btn=>btn.onclick=()=>notify('information','Limited profile viewing will be added in a future step.'));
    $$('[data-host-mute-participant]',dialog).forEach(btn=>btn.onclick=()=>{const result=studyRoomHostService.muteParticipant({roomId,participantId:btn.dataset.hostMuteParticipant,muted:btn.dataset.muted!=='true'});if(!result.success)return notify('warning',result.error);dialog.remove();renderStudyRoomLobby(roomId);renderActiveStudyCall(roomId)});
    $$('[data-host-transfer-participant]',dialog).forEach(btn=>btn.onclick=async()=>{const profile=publicStudentProfile(btn.dataset.hostTransferParticipant),ok=await confirmDialog({title:'Transfer Host?',message:`Transfer host to ${profile.name}?`,okText:'Transfer',cancelText:'Cancel'});if(!ok)return;const result=studyRoomHostService.transferHost({roomId,newHostUserId:btn.dataset.hostTransferParticipant});if(!result.success)return notify('warning',result.error);dialog.remove();renderStudyRoomLobby(roomId);renderActiveStudyCall(roomId)});
    $$('[data-host-remove-participant]',dialog).forEach(btn=>btn.onclick=async()=>{await removeParticipantFromStudyRoom({roomId,participantId:btn.dataset.hostRemoveParticipant});dialog.remove()});
    $$('[data-host-block-participant]',dialog).forEach(btn=>btn.onclick=async()=>{await blockUserFromStudyRoom({roomId,blockedUserId:btn.dataset.hostBlockParticipant});dialog.remove()});
    $$('[data-report-room-user]',dialog).forEach(btn=>btn.onclick=()=>openReportRoomUserDialog({roomId,reportedUserId:btn.dataset.reportRoomUser}));
  }

  function openChangeStudyTopicDialog(roomId){
    const access=studyRoomHostService.validateHost(roomId);
    if(!access.success)return notify('warning',access.error);
    document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay active" id="changeStudyTopicDialog"><form class="modal-card support-modal-card" role="dialog" aria-modal="true" aria-labelledby="changeStudyTopicTitle"><h2 id="changeStudyTopicTitle">Change Study Topic</h2><label>Course<input id="host-topic-course" maxlength="80" value="${safe(access.room.course)}"></label><label>Topic<input id="host-topic-topic" maxlength="100" value="${safe(access.room.topic)}"></label><label>Optional notes<textarea id="host-topic-notes" maxlength="500" rows="3">${safe(access.room.description||'')}</textarea></label><div id="host-topic-error" class="call-error-text" role="alert"></div><div class="study-room-form-actions"><button class="btn btn-primary" type="submit">Save Topic</button><button class="btn btn-secondary" data-topic-cancel type="button">Cancel</button></div></form></div>`);
    const dialog=$('#changeStudyTopicDialog'),form=$('form',dialog),error=$('#host-topic-error',dialog);
    $('[data-topic-cancel]',dialog).onclick=()=>dialog.remove();
    form.onsubmit=event=>{event.preventDefault();const result=studyRoomHostService.changeTopic({roomId,course:$('#host-topic-course',dialog).value,topic:$('#host-topic-topic',dialog).value,notes:$('#host-topic-notes',dialog).value});if(!result.success){error.textContent=result.error;return}dialog.remove();renderStudyRoomLobby(roomId);renderActiveStudyCall(roomId)};
  }

  function openRoomSettingsDialog(roomId){
    const access=studyRoomHostService.validateHost(roomId);
    if(!access.success)return notify('warning',access.error);
    const room=access.room;
    document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay active" id="roomSettingsDialog"><form class="modal-card support-modal-card" role="dialog" aria-modal="true" aria-labelledby="roomSettingsTitle"><h2 id="roomSettingsTitle">Room Settings</h2><label>Room name<input id="host-settings-name" maxlength="80" value="${safe(room.roomName)}"></label><label>Topic<input id="host-settings-topic" maxlength="100" value="${safe(room.topic)}"></label><label>Maximum participants<input id="host-settings-maximum" type="number" min="2" max="100" step="1" value="${safe(room.maximumMembers)}"></label><label>Screen sharing<select id="host-settings-screen"><option value="all-participants" ${room.screenSharePermission==='all-participants'?'selected':''}>All Participants</option><option value="host-only" ${room.screenSharePermission==='host-only'?'selected':''}>Host Only</option></select></label><label>Chat<select id="host-settings-chat"><option value="true" ${room.chatEnabled!==false?'selected':''}>On</option><option value="false" ${room.chatEnabled===false?'selected':''}>Off</option></select></label><label>AI assistance<select id="host-settings-ai"><option value="true" ${room.aiPermissions?.allowRoomAI!==false?'selected':''}>On</option><option value="false" ${room.aiPermissions?.allowRoomAI===false?'selected':''}>Off</option></select></label><div id="host-settings-error" class="call-error-text" role="alert"></div><div class="study-room-form-actions"><button class="btn btn-primary" type="submit">Save Settings</button><button class="btn btn-secondary" data-settings-cancel type="button">Cancel</button></div><p class="prototype-notice">Real permission enforcement requires backend authorization for every host action.</p></form></div>`);
    const dialog=$('#roomSettingsDialog'),form=$('form',dialog),error=$('#host-settings-error',dialog);
    $('[data-settings-cancel]',dialog).onclick=()=>dialog.remove();
    form.onsubmit=event=>{event.preventDefault();const result=studyRoomHostService.updateRoomSettings({roomId,settings:{roomName:$('#host-settings-name',dialog).value,topic:$('#host-settings-topic',dialog).value,maximumMembers:$('#host-settings-maximum',dialog).value,screenSharePermission:$('#host-settings-screen',dialog).value,chatEnabled:$('#host-settings-chat',dialog).value==='true',aiPermissions:{allowRoomAI:$('#host-settings-ai',dialog).value==='true'}}});if(!result.success){error.textContent=result.error;return}dialog.remove();renderStudyRoomLobby(roomId);renderActiveStudyCall(roomId)};
  }

  function bindStudyRoomLobbyActions(root=document){
    $$('[data-copy-room-code]',root).forEach(btn=>btn.onclick=async()=>{const result=await copyRoomCode(btn.dataset.copyRoomCode);notify(result.success?'success':'error',result.success?'Room code copied.':result.error)});
    $$('[data-toggle-lobby-camera]',root).forEach(btn=>btn.onclick=()=>{const roomId=sessionStorage.getItem('selectedStudyRoomLobbyId'),prefs=getDevicePreference(roomId,current()?.id);setLobbyDevice({roomId,type:'camera',enabled:!prefs.cameraEnabled})});
    $$('[data-toggle-lobby-microphone]',root).forEach(btn=>btn.onclick=()=>{const roomId=sessionStorage.getItem('selectedStudyRoomLobbyId'),prefs=getDevicePreference(roomId,current()?.id);setLobbyDevice({roomId,type:'microphone',enabled:!prefs.microphoneEnabled})});
    $$('[data-join-lobby-room]',root).forEach(btn=>btn.onclick=async()=>{if(btn.dataset.joining==='true')return;btn.dataset.joining='true';btn.disabled=true;btn.textContent='Joining...';const prefs=getDevicePreference(btn.dataset.joinLobbyRoom,current()?.id),result=await joinStudyRoomFromLobby({roomId:btn.dataset.joinLobbyRoom,cameraEnabled:prefs.cameraEnabled,microphoneEnabled:prefs.microphoneEnabled});if(!result.success){btn.dataset.joining='false';btn.disabled=false;btn.textContent='Join Study Room';return notify('warning',result.error)}notify('success','Joined study room.');renderStudyRoomSessionPlaceholder(result.room)});
    $$('[data-leave-lobby-room]',root).forEach(btn=>btn.onclick=()=>leaveStudyRoomLobby(btn.dataset.leaveLobbyRoom));
    $$('[data-leave-room-permanently]',root).forEach(btn=>btn.onclick=()=>confirmLeaveRoomPermanently(btn.dataset.leaveRoomPermanently));
    $$('[data-return-lobby]',root).forEach(btn=>btn.onclick=()=>renderStudyRoomLobby(btn.dataset.returnLobby));
    $$('[data-report-study-room]',root).forEach(btn=>btn.onclick=()=>openReportStudyRoomDialog(btn.dataset.reportStudyRoom));
    $$('[data-block-room-user]',root).forEach(btn=>btn.onclick=()=>openBlockRoomUserDialog(btn.dataset.blockRoomUser));
    $$('[data-open-blocked-users]',root).forEach(btn=>btn.onclick=()=>openBlockedUsersDialog());
    $$('[data-host-open-waiting]',root).forEach(btn=>btn.onclick=()=>{const result=openWaitingRoom(btn.dataset.hostOpenWaiting);if(!result.success)notify('warning',result.error)});
    $$('[data-host-start-session]',root).forEach(btn=>btn.onclick=()=>{const result=startStudyRoomSession(btn.dataset.hostStartSession);if(!result.success)notify('warning',result.error)});
    $$('[data-host-end-session]',root).forEach(btn=>btn.onclick=()=>endStudyRoomSession(btn.dataset.hostEndSession));
    $$('[data-host-manage-members]',root).forEach(btn=>btn.onclick=()=>openManageMembersDialog(btn.dataset.hostManageMembers));
    $$('[data-host-mute-placeholder]',root).forEach(btn=>btn.onclick=()=>notify('information','Participant audio controls require a real-time communication backend.'));
    $$('[data-host-camera-placeholder]',root).forEach(btn=>btn.onclick=()=>notify('information','Participant camera controls require a real-time communication backend.'));
    $$('[data-host-request-stop-share]',root).forEach(btn=>btn.onclick=()=>notify('information','Remote screen-share controls require the signaling backend and moderation rules.'));
    $$('[data-host-screen-share-permission]',root).forEach(select=>select.onchange=()=>updateRoomScreenSharePermission(select.dataset.hostScreenSharePermission,select.value));
    $$('[data-host-chat-enabled]',root).forEach(select=>select.onchange=()=>updateRoomChatEnabled(select.dataset.hostChatEnabled,select.value==='true'));
    bindStudyRoomHostControls(root);
    $$('[data-open-room-invites]',root).forEach(btn=>btn.onclick=()=>openInviteFriendsPanel(btn.dataset.openRoomInvites));
    $$('[data-room-cancel]',root).forEach(btn=>btn.onclick=()=>cancelStudyRoom(btn.dataset.roomCancel));
    $$('[data-view]',root).forEach(btn=>btn.onclick=()=>showView(btn.dataset.view));
  }

  function openStudyRoomDetails(roomId){
    const room=getStudyRoomById(roomId);
    if(!room||!canViewRoom(room))return notify('warning','You do not have access to this study room.');
    const host=room.hostUserId===current()?.id;
    const hostInvitations=host?loadStudyRoomInvitations().filter(invitation=>invitation.roomId===room.roomId):[];
    const invitationManagement=host&&hostInvitations.length?`<section class="room-host-invitations"><h3>Invitation Status</h3>${hostInvitations.map(invitation=>{const friend=getUserById?.(invitation.toUserId),name=friend?.name?.split(/\s+/)[0]||'Friend';return `<div><span><b>${safe(name)}</b><small>${safe(invitationLabels[invitation.status]||'Pending')}</small></span>${invitation.status==='pending'?`<button class="btn btn-secondary" data-cancel-room-invitation="${safe(invitation.invitationId)}" type="button">Cancel Invitation</button>`:''}</div>`}).join('')}</section>`:'';
    const inviteButton=host&&['scheduled','waiting','active'].includes(room.status)?`<button class="btn btn-primary" data-open-room-invites="${safe(room.roomId)}" type="button">Invite Friends</button>`:'';
    const content=`<div class="modal-overlay active" id="studyRoomDetailsDialog"><div class="modal-card study-room-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="studyRoomDetailTitle"><button class="modal-close" data-close-room-details type="button">&times;</button><h2 id="studyRoomDetailTitle">${safe(room.roomName)}</h2><p>${safe(room.course)} - ${safe(room.topic)}</p>${roomStatusBadge(room)}<div class="study-room-details">${['Date','Members','Duration','Camera','Microphone','Privacy'].map(label=>`<div><span>${label}</span><b>${safe(label==='Date'?formatRoomDate(room):label==='Members'?memberCount(room):label==='Duration'?room.durationMinutes+' minutes':label==='Camera'?cameraLabel(room.cameraAllowed):label==='Microphone'?cameraLabel(room.microphoneAllowed):privacyLabel(room.privacy))}</b></div>`).join('')}</div><p>${safe(room.description||'No description added.')}</p>${invitationManagement}<p class="prototype-notice">Do not build real video or audio calling yet. A real multi-user study room requires a backend, live database, user authentication, real-time room updates, WebRTC or another call service, and server-enforced privacy and permissions.</p><div class="study-room-actions">${inviteButton}<button class="btn btn-secondary" data-close-room-details type="button">Close</button></div></div></div>`;
    document.body.insertAdjacentHTML('beforeend',content);
    $$('[data-close-room-details]').forEach(btn=>btn.onclick=()=>$('#studyRoomDetailsDialog')?.remove());
    $$('[data-open-room-invites]').forEach(btn=>btn.onclick=()=>{$('#studyRoomDetailsDialog')?.remove();openInviteFriendsPanel(btn.dataset.openRoomInvites)});
    $$('[data-cancel-room-invitation]').forEach(btn=>btn.onclick=()=>{cancelStudyRoomInvitation({invitationId:btn.dataset.cancelRoomInvitation});$('#studyRoomDetailsDialog')?.remove();openStudyRoomDetails(room.roomId)});
  }

  function bindStudyRoomActions(root=document){
    $$('[data-room-open]',root).forEach(btn=>btn.onclick=()=>openStudyRoomDetails(btn.dataset.roomOpen));
    $$('[data-invitation-accept]',root).forEach(btn=>btn.onclick=()=>acceptStudyRoomInvitation({invitationId:btn.dataset.invitationAccept,currentUserId:current()?.id}));
    $$('[data-invitation-decline]',root).forEach(btn=>btn.onclick=()=>declineStudyRoomInvitation({invitationId:btn.dataset.invitationDecline,currentUserId:current()?.id}));
    $$('[data-invitation-later]',root).forEach(btn=>btn.onclick=()=>joinLaterStudyRoomInvitation({invitationId:btn.dataset.invitationLater,currentUserId:current()?.id}));
    $$('[data-room-accept]',root).forEach(btn=>btn.onclick=()=>acceptRoomInvitation(btn.dataset.roomAccept));
    $$('[data-room-decline]',root).forEach(btn=>btn.onclick=()=>declineRoomInvitation(btn.dataset.roomDecline));
    $$('[data-room-join]',root).forEach(btn=>btn.onclick=()=>joinFriendsRoom(btn.dataset.roomJoin));
    $$('[data-room-lobby]',root).forEach(btn=>btn.onclick=()=>openStudyRoomLobby(btn.dataset.roomLobby));
    $$('[data-room-edit]',root).forEach(btn=>btn.onclick=()=>openCreateStudyRoom({room:getStudyRoomById(btn.dataset.roomEdit)}));
    $$('[data-room-cancel]',root).forEach(btn=>btn.onclick=()=>cancelStudyRoom(btn.dataset.roomCancel));
    $$('[data-room-wait]',root).forEach(btn=>btn.onclick=()=>openStudyRoomLobby(btn.dataset.roomWait));
    $$('[data-room-active]',root).forEach(btn=>btn.onclick=()=>{const result=startStudyRoomSession(btn.dataset.roomActive);if(!result.success)notify('warning',result.error)});
    $$('[data-room-complete]',root).forEach(btn=>btn.onclick=()=>endStudyRoomSession(btn.dataset.roomComplete));
    $$('[data-open-device-test]',root).forEach(btn=>btn.onclick=()=>openDeviceTestPage());
  }

  function offerRoomPresence(room){
    if(typeof presenceService!=='object'||!room)return;
    confirmDialog({title:'Set status to Studying?',message:`Set your status to Studying ${room.course}?`,okText:'Set to Studying',cancelText:'Keep Current Status'}).then(ok=>{if(ok)presenceService.updateCurrentUser({status:'studying',studyCourse:room.course})});
  }

  function startFriendStudyRoom(friendUserId){openCreateStudyRoom({preselectedFriendIds:[friendUserId]})}

  function ensureCreatingStudyRoomsInstructions(){
    const grid=$('#instructionsView .instruction-grid');
    if(!grid)return;
    if(!$('#creatingStudyRoomsInstructions'))grid.insertAdjacentHTML('beforeend','<article class="folder-instructions" id="creatingStudyRoomsInstructions"><span>60</span><div><h3>Creating Study Rooms</h3><p>Registered users can create scheduled study rooms. The creator becomes the room host, and every room requires a name, course, topic, date, start time and maximum-member limit. Maximum members includes the host. The host may invite accepted friends, while pending connections and blocked users cannot be invited.</p><p>Camera and microphone access are optional and are never activated automatically. StudySpark does not request device permissions while creating a room. Invite-only rooms may be viewed only by permitted users, and the host may edit or cancel a scheduled room. Cancelling a room does not delete its history.</p><p>Room cards never display private contact information. Do not place phone numbers, email addresses, home addresses or exact locations in room details. Study-room records are stored locally in this front-end prototype and do not synchronize across devices. A real multi-user study-room system requires a backend, live database and real-time communication service.</p></div></article>');
    if(!$('#invitingFriendsToStudyRoomsInstructions'))grid.insertAdjacentHTML('beforeend','<article class="folder-instructions" id="invitingFriendsToStudyRoomsInstructions"><span>61</span><div><h3>Inviting Friends to Study Rooms</h3><p>After creating a room, the host can select accepted friends using checkboxes. Invitations are sent only after the host clicks Send Invitations. Only active accepted friends can be invited. Pending or removed connections cannot be invited, and blocked users cannot be invited.</p><p>Invited students may Accept, Decline or choose Join Later. Invited students become room participants only after accepting the invitation. Declining does not add the student. Join Later keeps the invitation pending and does not add the student to the room.</p><p>Pending invitations reserve room capacity, and the host counts toward the maximum-member limit. A room cannot exceed its maximum number of members. Offline and Busy friends may still be invited. Camera and microphone settings remain optional, and no device permission is requested when an invitation is sent. Private contact information is not shown in invitation cards. LocalStorage is used only for this front-end prototype, and real invitations require a shared backend and live database. Study-room invitations are simulated in this front-end prototype and do not synchronize across devices.</p></div></article>');
    if(!$('#studyRoomLobbyInstructions'))grid.insertAdjacentHTML('beforeend','<article class="folder-instructions" id="studyRoomLobbyInstructions"><span>62</span><div><h3>Study Room Lobby</h3><p>Hosts and accepted participants open a Study Room Lobby before entering a prototype session. The lobby shows the room name, host, course, topic, member count, date, start time, room code, participant list, and optional local camera and microphone controls.</p><p>Pending invitations do not grant lobby access. Join Later keeps the invitation pending until the student accepts. Cancelled and completed rooms cannot be entered, and blocked or removed users cannot access the lobby.</p><p>Camera and microphone controls are off by default. StudySpark only asks for the related browser permission after the student intentionally turns that device on, and the preview stays local to this browser. This prototype does not provide a real multi-user call, recording, or remote device control. Real online calls require a backend, live database, and real-time communication service.</p></div></article>');
    if(!$('#videoAudioCallsInstructions'))grid.insertAdjacentHTML('beforeend','<article class="folder-instructions" id="videoAudioCallsInstructions"><span>63</span><div><h3>Video and Audio Calls</h3><p>StudySpark is prepared to use WebRTC for live study calls. Camera, microphone, and screen sharing are optional and require browser permission. Users can test devices before joining a room and can join with camera off or microphone off.</p><p>This front-end prototype supports local device testing only. Real online calls require a signaling server, authenticated users, HTTPS, and WebRTC infrastructure. WebRTC also needs STUN servers and TURN servers when direct connections fail, plus room synchronization and live presence.</p><p>The recommended production path is HTML, CSS, and JavaScript on the frontend; Node.js, Express, and Socket.IO for signaling; Firebase, Supabase, or PostgreSQL for shared data; and Firebase Auth, Supabase Auth, Clerk, or Auth.js for authentication. Development phases are room interface, camera and microphone preview, signaling server, two-user connection, group calls, screen sharing, chat, and optional recording. Media is never recorded automatically.</p></div></article>');
    if(!$('#cameraMicrophoneControlsInstructions'))grid.insertAdjacentHTML('beforeend','<article class="folder-instructions" id="cameraMicrophoneControlsInstructions"><span>64</span><div><h3>Camera and Microphone Controls</h3><p>StudySpark asks for browser permission before accessing a camera, microphone or shared screen. Camera and microphone are never activated automatically.</p><p>Use the active study room toolbar to turn the microphone on or off, turn the camera on or off, choose a different local device, open chat, open the participant panel, share a screen, or leave the call. Screen sharing asks for separate browser permission and replaces the local camera view only while sharing.</p><p>Leaving a study call stops the current user\'s local media tracks. Device names and live streams are not saved. StudySpark stores only selected device IDs so the same browser can remember preferred camera, microphone and speaker choices.</p></div></article>');
    if(!$('#screenSharingInstructions'))grid.insertAdjacentHTML('beforeend','<article class="folder-instructions" id="screenSharingInstructions"><span>65</span><div><h3>Screen Sharing</h3><p>Students may share a browser tab, application window or screen after clicking Share Screen. Screen sharing never starts automatically. The browser controls the screen-selection prompt, and StudySpark cannot select a screen for the user.</p><p>Students may share notes, slides, practice questions, whiteboards and study plans. Close private messages, grades, passwords and personal information before sharing. Only one student can share at a time in this first version, and a clear banner identifies the current sharer.</p><p>The sharer may stop at any time, and stopping through browser controls also stops sharing in StudySpark. Camera does not need to be on before sharing, and the camera may be restored when sharing ends. Hosts may choose Host Only or All Participants.</p><p>Screen sharing requires browser support and HTTPS outside localhost. Real remote screen sharing requires the signaling and WebRTC backend. Local prototype mode can show only the current user\'s preview. StudySpark does not record or save shared-screen content, and leaving the call stops the screen-sharing track.</p></div></article>');
    if(!$('#studyRoomChatInstructions'))grid.insertAdjacentHTML('beforeend','<article class="folder-instructions" id="studyRoomChatInstructions"><span>66</span><div><h3>Study Room Chat</h3><p>Room chat is available in waiting and active rooms. Only the host and accepted participants can use chat. Pending invitations and Join Later invitations do not provide chat access.</p><p>Users may send text messages, ask questions, share approved HTTPS study links, use emojis, and share study goals with a title, description and target time. External links open only after user action, and StudySpark does not automatically share private profile information in chat.</p><p>Message editing is limited, and deleted messages remain as Message deleted. Hosts may turn chat on or off. Unread badges identify new room messages. Do not share passwords, addresses, phone numbers or other private information in room chat.</p><p>Study-room chat messages require a backend database and real-time connection for the full multi-user version. Messages stored in localStorage are visible only in this browser and do not synchronize across devices. Real chat requires authenticated users, server-side validation, server-side rate limiting, WebSockets or another live communication service, and server-confirmed timestamps and permissions.</p></div></article>');
    if(!$('#studyRoomTimerInstructions'))grid.insertAdjacentHTML('beforeend','<article class="folder-instructions" id="studyRoomTimerInstructions"><span>67</span><div><h3>Group Study Timer</h3><p>Hosts can control the shared study timer during an active study room. Participants automatically see the current timer view in the room. Timer modes include Focus, Break, Practice Quiz and Group Discussion, with default durations of 25, 5, 15 and 10 minutes.</p><p>Hosts may create custom timers, edit schedules with multiple study sessions, pause timers, reset timers, and move to the next session manually. Completion notifications are optional, and new participants see the current local timer state when they join the active room in this browser.</p><p>The Study Room Timer is synchronized through the real-time backend in the full version. In this front-end prototype, timer synchronization is local only.</p></div></article>');
    if(!$('#sharedGoalsTasksInstructions'))grid.insertAdjacentHTML('beforeend','<article class="folder-instructions" id="sharedGoalsTasksInstructions"><span>68</span><div><h3>Shared Goals and Tasks</h3><p>Every study room can have a shared goal. Hosts create the goal, organize tasks, reorder tasks, and delete tasks. Participants can mark tasks complete or incomplete, and group progress updates automatically as completed versus total tasks.</p><p>Tasks help organize study sessions. They are separate from grades, academic performance, productivity scores, analytics, and well-being data. StudySpark displays only public names, task titles, and completion status.</p><p>Group task synchronization requires the real-time backend in the full version. In this front-end prototype, shared goals and tasks are stored locally and do not synchronize across devices.</p></div></article>');
    if(!$('#roomAIInstructions'))grid.insertAdjacentHTML('beforeend','<article class="folder-instructions" id="roomAIInstructions"><span>69</span><div><h3>AI Assistance Inside Study Rooms</h3><p>The AI Assistant can suggest a study order, generate group quizzes, create discussion questions, summarize approved study content, and build a timed study agenda. Suggestions may use the room topic, shared tasks, timer schedule, and learning-performance data only when a participant gives permission.</p><p>Participants may choose not to share their learning data. Missing data is labelled clearly, the AI does not rank intelligence, and strength statements refer only to recorded study activity. AI suggestions may be added to shared tasks, AI agendas may be converted to timer schedules, generated quizzes require an approved question source, topic summaries list sources, and AI results include limitations.</p><p>AI suggestions are estimates based only on available and approved study information. AI assistance does not guarantee grades, exam results or future academic performance. Private well-being and contact information are never used. The front-end prototype uses rule-based suggestions. The full generative AI version requires a secure backend and must not expose API keys in the browser. All backend AI requests require authentication and room access verification.</p></div></article>');
    if(!$('#hostControlsInstructions'))grid.insertAdjacentHTML('beforeend','<article class="folder-instructions" id="hostControlsInstructions"><span>70</span><div><h3>Host Controls</h3><p>The room creator automatically becomes the host. Only the room host can perform management actions. Hosts can start and end study sessions, lock or unlock the room, approve or decline join requests, remove participants, mute or unmute participants, change the study topic, manage room settings, control the shared timer, and transfer host ownership.</p><p>Locked rooms require approval before joining. Regular study-room members cannot remove, mute or manage other participants. If the host leaves, ownership should be transferred or the room ends so the room is never left without a host.</p><p>In this front-end prototype, host controls are simulated locally. The full version requires authenticated backend permission checks for every protected action, including session changes, participant management, room settings, timer controls, AI permissions, and host transfers.</p></div></article>');
    if(!$('#studyRoomPrivacySafetyInstructions'))grid.insertAdjacentHTML('beforeend','<article class="folder-instructions" id="studyRoomPrivacySafetyInstructions"><span>71</span><div><h3>Study Room Privacy and Safety</h3><p>Study rooms are private by default and use display names instead of full legal names.</p><p>Camera, microphone and screen sharing never activate automatically.</p><p>StudySpark does not record study-room audio, video or screen sharing by default.</p><p>Real deployment requires authenticated backend permissions, moderation tools and secure reporting.</p><p>For school use, verification must be confirmed by the school or organization through a secure backend.</p></div></article>');
    if(!$('#blockingUsersInstructions'))grid.insertAdjacentHTML('beforeend','<article class="folder-instructions" id="blockingUsersInstructions"><span>72</span><div><h3>Blocking Users</h3><p>Blocked users cannot search for, contact, invite, or join the private study rooms of the user who blocked them.</p><p>Blocked users cannot send friend requests, send direct messages, invite you to study rooms, join your private rooms, join through room codes or links, view private profiles, appear in AI study partner recommendations, mention you in room chat, or receive invitations from you.</p><p>Blocking does not automatically remove past conversations. In this prototype, block records are stored locally in this browser. A production version must enforce block rules on the backend for every search, invitation, message, friend request, room join, and recommendation request.</p></div></article>');
    if(!$('#reportingUsersInstructions'))grid.insertAdjacentHTML('beforeend','<article class="folder-instructions" id="reportingUsersInstructions"><span>73</span><div><h3>Reporting Users</h3><p>Reports can be submitted for a user, room, message, study link, or shared uploaded content. Choose Harassment, Inappropriate Content, Spam, Impersonation, Unsafe Behaviour, or Other, then add an optional description.</p><p>Reports are stored locally in prototype testing. The production version requires authenticated backend enforcement and human moderation for reports.</p><p>Reporter identities are not shown to the reported user. Blocking and reporting are separate actions, and users can block someone after submitting a report.</p></div></article>');
  }

  function installStudyRoomFeature(){
    runStudyRoomMigration();
    runStudyRoomInvitationMigration();
    runStudyRoomLobbyMigration();
    runScreenShareMigration();
    runStudyRoomChatMigration();
    runStudyRoomGoalsMigration();
    runStudyRoomAIMigration();
    runStudyRoomHostMigration();
    runStudyRoomSafetyMigration();
    ensureStudyRoomLobbyView();
    ensureDeviceTestView();
    if(typeof viewNames==='object'){viewNames.studyRooms=['COLLABORATE','Study Rooms'];viewNames.studyRoomLobby=['COLLABORATE','Study Room Lobby'];viewNames.studyRoomDeviceTest=['COLLABORATE','Camera & Microphone Test']}
    const originalShowView=showView;
    showView=async function(view,options={}){ensureStudyRoomLobbyView();ensureDeviceTestView();if(callRuntime.roomId&&view!=='studyRoomLobby')cleanupActiveCallMedia({silent:true});const result=await originalShowView(view,options);if(view==='studyRooms')renderStudyRoomsPage();if(view==='studyRoomLobby')renderStudyRoomLobby(options.roomId);if(view==='studyRoomDeviceTest')renderDeviceTestPage();return result};
    const originalRenderAll=renderAll;
    renderAll=function(){originalRenderAll();ensureStudyRoomLobbyView();ensureDeviceTestView();ensureCreatingStudyRoomsInstructions();renderStudyRoomsPage();updateStudyRoomInvitationBadge()};
    const originalReset=typeof resetCollaborativeDemoData==='function'?resetCollaborativeDemoData:null;
    if(originalReset)resetCollaborativeDemoData=function(){originalReset();saveStudyRooms([]);saveStudyRoomInvitations([]);renderStudyRoomsPage();updateStudyRoomInvitationBadge()};
    const originalStart=typeof startFriendStudyRoom==='function'?window.startFriendStudyRoom:null;
    window.startFriendStudyRoom=startFriendStudyRoom;
    document.addEventListener('click',event=>{const btn=event.target.closest('[data-start-room]');if(!btn)return;event.preventDefault();event.stopPropagation();startFriendStudyRoom(btn.dataset.startRoom)},true);
    document.addEventListener('click',event=>{const btn=event.target.closest('[data-open-study-room]');if(!btn)return;event.preventDefault();event.stopPropagation();openCreateStudyRoom()});
    if(navigator.mediaDevices?.addEventListener)navigator.mediaDevices.addEventListener('devicechange',handleMediaDeviceChange);
    else if(navigator.mediaDevices)navigator.mediaDevices.ondevicechange=handleMediaDeviceChange;
    window.addEventListener('storage',event=>{if(event.key===MESSAGE_KEY&&callRuntime.roomId){if(callRuntime.chatOpen){renderStudyRoomChatMessages(callRuntime.roomId);markRoomChatSeen(callRuntime.roomId)}else{const latest=getMessagesForStudyRoom(callRuntime.roomId).filter(message=>message.senderUserId!==current()?.id).slice(-1)[0];if(latest){callRuntime.chatUnreadCounts.set(callRuntime.roomId,roomChatUnread(callRuntime.roomId)+1);notificationManager.info(`New room message from ${publicStudentProfile(latest.senderUserId).name}.`);renderActiveStudyCall()}}return}if(event.key===GOAL_KEY&&callRuntime.roomId){rerenderSharedGoals(callRuntime.roomId);return}if([ROOM_KEY,GUEST_ROOM_KEY,INVITATION_KEY,GUEST_INVITATION_KEY,PRESENCE_KEY,JOIN_REQUEST_KEY,REPORT_KEY,SAFETY_REPORT_KEY,USER_BLOCKS_KEY,DISPLAY_NAME_KEY,'friendships','blockedUsers','guestBlockedStudents'].includes(event.key)){const activeRoom=callRuntime.roomId?getStudyRoomById(callRuntime.roomId):null,activeUserId=current()?.id;const lostAccess=activeRoom&&activeUserId&&(!activeRoom.participantIds.includes(activeUserId)||(activeRoom.removedUserIds||[]).includes(activeUserId)||(typeof areUsersBlocked==='function'&&areUsersBlocked({userIdA:activeRoom.hostUserId,userIdB:activeUserId}))||studyRoomSafetyService.getBlockState({viewerUserId:activeRoom.hostUserId,targetUserId:activeUserId,roomId:activeRoom.roomId}).blocked);if(callRuntime.roomId&&(!activeRoom||['cancelled','completed'].includes(activeRoom.status)||lostAccess))cleanupActiveCallMedia({silent:true});document.querySelector('#roomInviteDialog')?.remove();renderStudyRoomsPage();renderStudyRoomLobby();updateStudyRoomInvitationBadge()}});
    window.addEventListener('pagehide',()=>{stopLobbyMedia();cleanupActiveCallMedia({silent:true})});
    window.addEventListener('beforeunload',()=>{stopLobbyMedia();cleanupActiveCallMedia({silent:true})});
    ensureCreatingStudyRoomsInstructions();
    renderStudyRoomsPage();
    updateStudyRoomInvitationBadge();
    if(originalStart&&originalStart!==startFriendStudyRoom)window.legacyStartFriendStudyRoom=originalStart;
  }

  window.studyRoomService={create:createStudyRoom,load:loadStudyRooms,save:saveStudyRooms,getById:getStudyRoomById,getForUser:getStudyRoomsForUser,cancel:cancelStudyRoom,update:updateStudyRoom,sendInvitations:sendStudyRoomInvitations,loadInvitations:loadStudyRoomInvitations,saveInvitations:saveStudyRoomInvitations,acceptInvitation:acceptStudyRoomInvitation,declineInvitation:declineStudyRoomInvitation,cancelInvitation:cancelStudyRoomInvitation,joinLater:joinLaterStudyRoomInvitation,capacity:getStudyRoomCapacity};
  window.studyRoomLobbyService={getRoom:getStudyRoomById,validateAccess:validateStudyRoomLobbyAccess,join:joinStudyRoomFromLobby,leave:leaveStudyRoomLobby,copyCode:copyRoomCode,updatePresence:updateStudyRoomPresence,report:submitStudyRoomReport,blockUser:blockUserFromStudyRoom};
  window.studyRoomCallService={deviceService:{enumerate:enumerateCallDevices,enumerateAvailableDevices,getPreferences:getCallDevicePreferencesForUser,savePreferences:saveCallDevicePreferencesForUser,checkSupport:browserCallSupport,getMediaSupport,warnings:callSupportWarnings},studyRoomMediaService,studyRoomChatService,studyRoomTimerService,studyRoomGoalService,studyRoomAIService,studyRoomHostService,studyRoomSafetyService,studyRoomBlockService,studyRoomReportService,callMediaState,peerConnectionService,localMediaManager,remoteMediaManager,screenShareManager,signalingService,roomConnectionManager,callStateManager,notificationManager,createPeerConnection,join:attemptRealCallJoin,leave:leaveStudyCall,render:renderActiveStudyCall};
  window.renderStudyRoomsPage=renderStudyRoomsPage;
  window.openCreateStudyRoom=openCreateStudyRoom;
  window.createStudyRoomId=createStudyRoomId;
  window.createScheduledStartAt=createScheduledStartAt;
  window.loadStudyRooms=loadStudyRooms;
  window.saveStudyRooms=saveStudyRooms;
  window.validateStudyRoomCollection=validateStudyRoomCollection;
  window.normalizeStudyRoomInput=normalizeStudyRoomInput;
  window.validateNewStudyRoom=validateNewStudyRoom;
  window.startFriendStudyRoom=startFriendStudyRoom;
  window.createStudyRoomInvitationId=createStudyRoomInvitationId;
  window.loadStudyRoomInvitations=loadStudyRoomInvitations;
  window.saveStudyRoomInvitations=saveStudyRoomInvitations;
  window.sendStudyRoomInvitations=sendStudyRoomInvitations;
  window.validateStudyRoomInvitation=validateStudyRoomInvitation;
  window.validateStudyRoomInvitationCollection=validateStudyRoomInvitationCollection;
  window.validateRoomInvitationRecipients=validateRoomInvitationRecipients;
  window.getStudyRoomCapacity=getStudyRoomCapacity;
  window.acceptStudyRoomInvitation=acceptStudyRoomInvitation;
  window.joinLaterStudyRoomInvitation=joinLaterStudyRoomInvitation;
  window.isValidInvitationTransition=isValidInvitationTransition;
  window.createStudyRoomCode=createStudyRoomCode;
  window.normalizeRoomCode=normalizeRoomCode;
  window.loadStudyRoomPresence=loadStudyRoomPresence;
  window.saveStudyRoomPresence=saveStudyRoomPresence;
  window.updateStudyRoomPresence=updateStudyRoomPresence;
  window.validateStudyRoomLobbyAccess=validateStudyRoomLobbyAccess;
  window.openStudyRoomLobby=openStudyRoomLobby;
  window.renderStudyRoomLobby=renderStudyRoomLobby;
  window.joinStudyRoomFromLobby=joinStudyRoomFromLobby;
  window.copyRoomCode=copyRoomCode;
  window.stopMediaStream=stopMediaStream;
  window.submitStudyRoomReport=submitStudyRoomReport;
  window.blockUserFromStudyRoom=blockUserFromStudyRoom;
  window.openDeviceTestPage=openDeviceTestPage;
  window.renderDeviceTestPage=renderDeviceTestPage;
  window.createPeerConnection=createPeerConnection;
  window.studyRoomMediaService=studyRoomMediaService;
  window.getMediaSupport=getMediaSupport;
  window.studyRoomChatService=studyRoomChatService;
  window.studyRoomTimerMode=studyRoomTimerMode;
  window.studyRoomTimerService=studyRoomTimerService;
  window.studyRoomSharedGoalsMode=studyRoomSharedGoalsMode;
  window.studyRoomGoalService=studyRoomGoalService;
  window.studyRoomAIMode=studyRoomAIMode;
  window.studyRoomAIService=studyRoomAIService;
  window.studyRoomHostMode=studyRoomHostMode;
  window.studyRoomHostService=studyRoomHostService;
  window.studyRoomSafetyService=studyRoomSafetyService;
  window.studyRoomBlockService=studyRoomBlockService;
  window.studyRoomReportService=studyRoomReportService;
  window.isStudyRoomHost=isStudyRoomHost;
  window.loadStudyRoomJoinRequests=loadStudyRoomJoinRequests;
  window.saveStudyRoomJoinRequests=saveStudyRoomJoinRequests;
  window.createStudyRoomMessageId=createStudyRoomMessageId;
  window.loadStudyRoomMessages=loadStudyRoomMessages;
  window.saveStudyRoomMessages=saveStudyRoomMessages;
  window.validateStudyRoomChatAccess=validateStudyRoomChatAccess;

  installStudyRoomFeature();
})();
