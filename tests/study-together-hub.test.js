const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index (2).html'),'utf8');
const script=fs.readFileSync(path.join(root,'script.js'),'utf8');
const sidebar=fs.readFileSync(path.join(root,'sidebar-navigation.js'),'utf8');
const firstScreen=fs.readFileSync(path.join(root,'first-screen-navigation.js'),'utf8');
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
const firstScreenCss=fs.readFileSync(path.join(root,'first-screen-navigation.css'),'utf8');

function includes(source,value,message=value){assert.ok(source.includes(value),`Expected ${message}`)}

includes(html,'id="studyTogetherView"','Study Together hub view');
includes(html,'aria-label="Study Together"','single accessible page label');
includes(firstScreen,"title:'Study Together'",'single hub title source');
includes(firstScreen,'Find study partners, manage requests, join rooms, and build study groups in one safe place.','exact hub description');
includes(firstScreen,"primaryLabel:'Find a Study Partner'",'primary action');
includes(firstScreen,"secondaryLabel:'Create Study Request'",'secondary action');
includes(firstScreen,"secondaryView:'studyRequests'",'secondary action route');
includes(firstScreen,'skipHubCards:true','generic hub cards are suppressed for Study Together');
assert.ok(!html.includes('id="studyTogetherTitle"'),'old duplicate Study Together h1 should be removed');
assert.ok(!html.includes('study-together-hero'),'old duplicate Study Together hero should be removed');
assert.ok(!html.includes('COLLABORATIVE LEARNING</span>\n              <h1 id="studyTogetherTitle"'),'old lower collaborative-learning hero should be removed');
includes(html,'id="studyTogetherCards"','feature card container');
includes(html,'study-together-content study-together-features','cards move directly below the hub');

for(const label of ['Friend Requests','Suggested Matches','Active Requests','Upcoming Rooms','Study Groups']){
  includes(script,label,`${label} summary card`);
}
for(const title of ['Friend Requests','Study Match','Find Study Partners','My Study Requests','Study Rooms','Study Groups']){
  includes(script,`title:'${title}'`,`${title} feature card`);
}

includes(script,"studyTogether:['COLLABORATE','Study Together']",'view metadata');
includes(script,"studyTogether:'/study-together'",'canonical hub route');
for(const route of [
  "friendRequests:'/study-together/friend-requests'",
  "studyMatch:'/study-together/matches'",
  "studyPartnerResults:'/study-together/find-partners'",
  "studyRequests:'/study-together/requests'",
  "studyRooms:'/study-together/rooms'",
  "studyGroups:'/study-together/groups'",
]){
  includes(script,route,`canonical child route ${route}`);
}
for(const alias of [
  "'/collaborate':'studyTogether'",
  "'/study-rooms':'studyRooms'",
  "'/study-match':'studyMatch'",
  "'/study-partners':'studyPartnerResults'",
  "'/study-requests':'studyRequests'",
  "'/study-groups':'studyGroups'",
]){
  includes(script,alias,`legacy alias ${alias}`);
}

includes(script,"studyTogether:'dashboard'",'hub back fallback');
for(const fallback of ["friends:'studyTogether'","friendRequests:'studyTogether'","studyMatch:'studyTogether'","studyPartnerResults:'studyTogether'","studyRequests:'studyTogether'","studyRooms:'studyTogether'","studyGroups:'studyTogether'"]){
  includes(script,fallback,`child fallback ${fallback}`);
}
includes(script,"if(view==='studyTogether')renderStudyTogetherPage();",'hub render hook');
includes(script,'renderStudyTogetherPage();renderFriendsListPage();','hub renderAll hook');
includes(script,"id:'study-together',view:'studyTogether'",'All Tools registry entry');
includes(script,"'study-together':'users-round'",'All Tools icon mapping');

includes(sidebar,"item('student-study-together','Study Together','studyTogether',navIconSVG('usersRound')",'sidebar item with icon helper');
includes(sidebar,"'student-study-together':['studyTogether','friends'",'sidebar active-section mapping');
assert.doesNotMatch(sidebar,/item\('student-study-together','Study Together','studyTogether','[A-Z ]+'/,'Study Together sidebar icon must not be a plain letter');

includes(firstScreen,'studyTogether:{hub:true','first-screen hub registration');
includes(firstScreen,"studyTogether:'/study-together'",'first-screen canonical route');
includes(css,'.study-together-card-grid{display:grid','hub cards grid layout');
includes(css,'.study-together-content{margin-top:clamp(28px,4vw,48px)}','clean post-hub spacing');
includes(css,'.study-together-mode-note','compact guest note styling');
includes(firstScreenCss,'.first-screen-actions','compact top action layout');
includes(firstScreenCss,'.study-together-primary-action','high contrast primary action');
includes(css,'@media(max-width:760px){.study-together-page','mobile Study Together layout');
includes(css,'.study-together-summary-card:focus-visible','visible keyboard focus');

console.log('Study Together hub tests passed');
