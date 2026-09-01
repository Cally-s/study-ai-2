const fs=require('fs');
const path=require('path');
const vm=require('vm');
const assert=require('assert');

const db={users:{},tutoringOrganizations:[{id:'org-school',name:'Northstar Demo School',verificationStatus:'VERIFIED'}]};
let currentAccount=null;
const document={querySelector:()=>null,querySelectorAll:()=>[]};
const window={};
const context={console,db,document,window,Intl,Date,Math,Uint32Array,viewNames:{},showView:async()=>{},user:()=>currentAccount,saveDB:()=>{},toast:()=>{},FormData:class{},appData:{courses:['Biology','Math']}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'..','peer-tutoring.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'..','student-onboarding.js'),'utf8'),context);
const P=window.PeerTutoring,S=window.StudentOnboarding;

function account(id,roles=[P.ROLES.LEARNER],{verified=false,status=P.ACCOUNT_STATUS.ACTIVE,minor=false,tutorStatus=null}={}){
  const row={id,email:`${id}@demo.invalid`,name:`Demo ${id}`,studentId:`STU-${String(Object.keys(db.users).length+1).padStart(6,'0')}`,emailVerifiedAt:verified?new Date().toISOString():null,peerTutoring:{accountStatus:status,roles:[...roles],activeRole:roles[0],isMinor:minor,guardianConsentStatus:minor?'REQUIRED':'NOT_REQUIRED',learnerProfile:{},tutorProfile:tutorStatus?{verificationStatus:tutorStatus}:null,organizationMemberships:[],qualifications:[]}};
  db.users[row.email]=row;return row;
}
function completeProfile(a){const p=S.getStudentProfile(a);Object.assign(p,{firstName:'Demo',lastName:'Student',schoolOrganizationName:'Northstar Demo School',gradeLevel:'Grade 11',timeZone:'America/Toronto',preferredLanguage:'en',sessionModePreference:'ONLINE',subjectInterests:[{subjectId:'Biology',interestType:'HELP'}],availabilityWindows:[{dayOfWeek:'Monday',startTime:'16:00',endTime:'18:00',timeZone:'America/Toronto'}],onboardingStartedAt:new Date().toISOString(),onboardingCompletedAt:new Date().toISOString()});return p;}
function grantConsent(a){S._test.consentRecords().push({id:`consent-${a.id}`,learnerUserId:a.id,parentGuardianUserId:'guardian',status:'GRANTED',grantedAt:new Date().toISOString(),revokedAt:null});}
function expectThrow(fn,pattern){assert.throws(fn,pattern);}
const tests=[];function test(name,fn){tests.push([name,fn]);}

test('new student can save onboarding progress',()=>{const a=account('progress');currentAccount=a;S.actions.updateBasic({firstName:'Àda',lastName:'Lee',schoolOrganizationName:'Demo School',gradeLevel:'Grade 10'});assert(S.getStudentProfile(a).onboardingStartedAt)});
test('multi-role account shares one StudentProfile',()=>{const a=account('multi',[P.ROLES.LEARNER,P.ROLES.PEER_TUTOR]);assert.strictEqual(S.getStudentProfile(a),S.getStudentProfile(a))});
test('unverified learner cannot book',()=>{const a=account('unverified-book');completeProfile(a);assert.equal(S.canBookTutoring(a),false)});
test('unverified tutor cannot provide',()=>{const a=account('unverified-provide',[P.ROLES.PEER_TUTOR],{tutorStatus:P.TUTOR_STATUS.APPROVED});completeProfile(a);assert.equal(S.canProvideTutoring(a),false)});
test('unverified tutor cannot appear in search',()=>{const a=account('unverified-search',[P.ROLES.PEER_TUTOR],{tutorStatus:P.TUTOR_STATUS.APPROVED});completeProfile(a).availableForTutoring=true;assert.equal(S.canAppearInTutorSearch(a),false)});
test('verified complete learner passes email requirement',()=>{const a=account('verified-learner',[P.ROLES.LEARNER],{verified:true});completeProfile(a);assert.doesNotThrow(()=>S.requireVerifiedEmail(a));assert(S.canBookTutoring(a))});
test('verified unapproved tutor cannot provide',()=>{const a=account('unapproved',[P.ROLES.PEER_TUTOR],{verified:true,tutorStatus:P.TUTOR_STATUS.PENDING});completeProfile(a);assert.equal(S.canProvideTutoring(a),false)});
test('minor with pending consent cannot book',()=>{const a=account('minor-pending',[P.ROLES.LEARNER],{verified:true,minor:true});completeProfile(a);assert.equal(S.canBookTutoring(a),false)});
test('minor becomes eligible after valid consent',()=>{const a=account('minor-granted',[P.ROLES.LEARNER],{verified:true,minor:true});completeProfile(a);grantConsent(a);assert(S.canBookTutoring(a))});
test('student cannot approve own consent',()=>{const a=account('own-consent');expectThrow(()=>P._test.denyOwnConsent(a,{studentUserId:a.id}),/cannot approve/)});
test('student cannot update another profile',()=>{const a=account('actor'),other=account('other');currentAccount=a;S.actions.updateBasic({userId:other.id,firstName:'Actor',lastName:'Only',schoolOrganizationName:'Demo School',gradeLevel:'Grade 9'});assert.equal(S.getStudentProfile(other).firstName,'Demo');assert.equal(S.getStudentProfile(a).firstName,'Actor')});
test('client cannot set emailVerifiedAt',()=>{const a=account('email-bypass');currentAccount=a;S.actions.updateBasic({firstName:'Demo',lastName:'Student',schoolOrganizationName:'Demo School',gradeLevel:'Grade 9',emailVerifiedAt:new Date().toISOString()});assert.equal(a.emailVerifiedAt,null)});
test('client cannot grant guardian consent',()=>{const a=account('consent-bypass',[P.ROLES.LEARNER],{minor:true});currentAccount=a;S.actions.updateBasic({firstName:'Demo',lastName:'Student',schoolOrganizationName:'Demo School',gradeLevel:'Grade 9',guardianConsentStatus:'GRANTED'});assert.equal(S.hasActiveGuardianConsent(a),false)});
test('invalid time zone is rejected',()=>{const a=account('timezone');currentAccount=a;expectThrow(()=>S.actions.updateAvailability({timeZone:'Mars/Olympus',sessionModePreference:'ONLINE',windows:[{dayOfWeek:'Monday',startTime:'16:00',endTime:'18:00'}]}),/valid IANA/)});
test('invalid availability range is rejected',()=>expectThrow(()=>S.validateAvailability([{dayOfWeek:'Monday',startTime:'18:00',endTime:'16:00'}],'America/Toronto'),/end time after/));
test('public profile excludes email',()=>{const a=account('public-email');completeProfile(a);assert(!('email' in S.toPublicStudentProfile(a)))});
test('public profile excludes phone and address',()=>{const a=account('public-contact');completeProfile(a);const text=JSON.stringify(S.toPublicStudentProfile(a));assert(!/phone|address/i.test(text))});
test('public profile excludes school schedule',()=>{const a=account('public-schedule');completeProfile(a);const output=S.toPublicStudentProfile(a);assert(!('schoolTimetable' in output));assert(!('fullSchoolSchedule' in output));assert(!('classSchedule' in output))});
test('public profile excludes accessibility notes',()=>{const a=account('public-support');completeProfile(a).accessibilityPrivateNote='Private support';assert(!JSON.stringify(S.toPublicStudentProfile(a)).includes('Private support'))});
test('minor exact school is hidden publicly',()=>{const a=account('private-school',[P.ROLES.LEARNER],{minor:true});completeProfile(a);assert.equal(S.toPublicStudentProfile(a,{hideExactSchool:false}).schoolAffiliation,'Private')});
test('verification tokens expire',()=>{const a=account('expired');currentAccount=a;const result=S.verification.send(a),record=S._test.verificationStore().find(r=>r.userId===a.id);record.expiresAt=new Date(Date.now()-1000).toISOString();expectThrow(()=>S.verification.verify(result.developmentToken,a),/expired/)});
test('verification tokens cannot be reused',()=>{const a=account('reuse');currentAccount=a;const result=S.verification.send(a);S.verification.verify(result.developmentToken,a);expectThrow(()=>S.verification.verify(result.developmentToken,a),/already used/)});
test('verification resend is rate limited',()=>{const a=account('rate');currentAccount=a;S.verification.send(a);expectThrow(()=>S.verification.send(a),/wait/)});
test('changing email resets verification',()=>{const a=account('email-change',[P.ROLES.LEARNER],{verified:true});currentAccount=a;S.actions.updateAccountEmail('changed@demo.invalid');assert.equal(a.emailVerifiedAt,null)});
test('suspended student cannot use tutoring actions',()=>{const a=account('suspended',[P.ROLES.LEARNER],{verified:true,status:P.ACCOUNT_STATUS.SUSPENDED});completeProfile(a);assert.equal(S.canBookTutoring(a),false);expectThrow(()=>S.requireTutoringEligibility(a,'BOOK'),/not met/)});
test('optional accessibility does not block completion',()=>{const a=account('optional',[P.ROLES.LEARNER],{verified:true});completeProfile(a);S.getStudentProfile(a).accessibilitySupportPreferences=[];assert(S.isStudentProfileComplete(a))});
test('onboarding source does not require home address or phone',()=>{const source=fs.readFileSync(path.join(__dirname,'..','student-onboarding.js'),'utf8');assert(!/name="(?:homeAddress|phoneNumber|phone|address)"/.test(source))});
test('general availability is structured without timetable',()=>{const a=account('availability');currentAccount=a;S.actions.updateAvailability({timeZone:'America/Toronto',sessionModePreference:'EITHER',windows:[{dayOfWeek:'Saturday',startTime:'10:00',endTime:'13:00'}]});const p=S.getStudentProfile(a);assert.equal(p.availabilityWindows[0].dayOfWeek,'Saturday');assert(!('schoolTimetable' in p))});
test('onboarding status is derived from real conditions',()=>{const a=account('derived');completeProfile(a);assert.equal(S.getStudentOnboardingStatus(a),S.ONBOARDING_STATUS.PENDING_EMAIL_VERIFICATION);a.emailVerifiedAt=new Date().toISOString();assert.equal(S.getStudentOnboardingStatus(a),S.ONBOARDING_STATUS.COMPLETE)});
test('service hours and tutoring credits remain absent from StudentProfile',()=>{const a=account('separation');const p=S.getStudentProfile(a);assert(!('serviceHoursBalance' in p));assert(!('tutoringCreditBalance' in p))});

let passed=0;for(const [name,fn] of tests){try{fn();passed++;console.log(`PASS ${name}`)}catch(error){console.error(`FAIL ${name}\n${error.stack}`);process.exitCode=1}}
console.log(`${passed}/${tests.length} tests passed`);
