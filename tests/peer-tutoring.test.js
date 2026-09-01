const fs=require('fs');
const vm=require('vm');
const assert=require('assert');

const db={users:{},tutoringOrganizations:[{id:'org-a',name:'Demo A'},{id:'org-b',name:'Demo B'}]};
let currentAccount=null;
const document={querySelector:()=>null,querySelectorAll:()=>[]};
const context={console,db,document,window:{},viewNames:{},showView:async()=>{},user:()=>currentAccount,saveDB:()=>{},toast:()=>{},FormData:class{}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(require('path').join(__dirname,'..','peer-tutoring.js'),'utf8'),context);
const P=context.window.PeerTutoring;

function account(id,roles,status='ACTIVE'){
  const row={id,email:`${id}@demo.invalid`,name:id,studentId:`STU-${String(Object.keys(db.users).length+1).padStart(6,'0')}`,peerTutoring:{accountStatus:status,roles:[...roles],activeRole:roles[0],isMinor:false,guardianConsentStatus:'NOT_REQUIRED',learnerProfile:{profileCompletionPercentage:20},tutorProfile:null,organizationMemberships:[],qualifications:[]}};
  db.users[row.email]=row;return row;
}
function expectThrow(fn,pattern){assert.throws(fn,pattern);}

const learner=account('learner',[P.ROLES.LEARNER]);
const pending=account('pending',[P.ROLES.PEER_TUTOR]);pending.peerTutoring.tutorProfile={verificationStatus:P.TUTOR_STATUS.PENDING};
const approved=account('approved',[P.ROLES.PEER_TUTOR]);approved.peerTutoring.tutorProfile={verificationStatus:P.TUTOR_STATUS.APPROVED};
const suspended=account('suspended',[P.ROLES.PEER_TUTOR],'SUSPENDED');suspended.peerTutoring.tutorProfile={verificationStatus:P.TUTOR_STATUS.APPROVED};
const parent=account('parent',[P.ROLES.PARENT_GUARDIAN]);
const unrelated=account('unrelated',[P.ROLES.LEARNER]);
const verifier=account('verifier',[P.ROLES.ORGANIZATION_VERIFIER]);verifier.peerTutoring.organizationMemberships=[{organizationId:'org-a',authorizationStatus:P.VERIFIER_STATUS.ACTIVE}];
const admin=account('admin',[P.ROLES.PLATFORM_ADMIN]);
const multi=account('multi',[P.ROLES.LEARNER,P.ROLES.PEER_TUTOR]);multi.peerTutoring.tutorProfile={verificationStatus:P.TUTOR_STATUS.NOT_SUBMITTED};

const tests=[];
function test(name,fn){tests.push([name,fn]);}

test('learner cannot access admin dashboard',()=>assert.equal(P.canAccessDashboard(learner,P.ROLES.PLATFORM_ADMIN),false));
test('learner cannot self-assign PLATFORM_ADMIN',()=>{currentAccount=learner;expectThrow(()=>P.actions.addSelfRole(P.ROLES.PLATFORM_ADMIN),/cannot be self-assigned/);assert.equal(P.hasRole(learner,P.ROLES.PLATFORM_ADMIN),false)});
test('learner can request PEER_TUTOR role',()=>{currentAccount=learner;P.actions.requestTutor();assert(P.hasRole(learner,P.ROLES.PEER_TUTOR))});
test('pending tutor is not approved',()=>assert.equal(P.isApprovedTutor(pending),false));
test('approved tutor passes approval helper',()=>assert.equal(P.isApprovedTutor(approved),true));
test('suspended tutor cannot use protected tutor action',()=>{currentAccount=suspended;expectThrow(()=>P.actions.saveTutor({}),/cannot access/);assert.equal(P.isApprovedTutor(suspended),false)});
test('parent cannot view unrelated learner',()=>assert.equal(P.canViewLearner(parent,unrelated.id),false));
test('verifier cannot access another organization',()=>{assert.equal(P.canManageOrganization(verifier,'org-a'),true);assert.equal(P.canManageOrganization(verifier,'org-b'),false)});
test('minor cannot approve own guardian consent',()=>expectThrow(()=>P._test.denyOwnConsent(learner,{studentUserId:learner.id}),/cannot approve/));
test('admin can assign verifier access',()=>{currentAccount=admin;P.actions.adminAssignRole(unrelated.id,P.ROLES.ORGANIZATION_VERIFIER,'org-a');assert(P.isActiveVerifier(unrelated))});
test('sensitive role change creates audit log',()=>assert(db.peerTutoringAuditLogs.some(row=>row.action==='PRIVILEGED_ROLE_ASSIGNED'&&row.targetId===unrelated.id)));
test('multi-role user can switch dashboards',()=>{currentAccount=multi;P.actions.changeActiveRole(P.ROLES.PEER_TUTOR);assert.equal(multi.peerTutoring.activeRole,P.ROLES.PEER_TUTOR);assert(P.hasRole(multi,P.ROLES.LEARNER))});
test('official service hours are not represented as transferable credits',()=>{const source=fs.readFileSync(require('path').join(__dirname,'..','peer-tutoring.js'),'utf8');assert(!/serviceHoursBalance|transferServiceHours|communityServiceCreditBalance/.test(source));assert(/Official community-service hours are separate from platform tutoring credits/.test(source))});

let passed=0;
for(const [name,fn] of tests){try{fn();passed++;console.log(`PASS ${name}`)}catch(error){console.error(`FAIL ${name}\n${error.stack}`);process.exitCode=1}}
console.log(`${passed}/${tests.length} tests passed`);
