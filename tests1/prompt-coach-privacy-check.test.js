'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const Coach=require('../prompt-writing-coach.js');
const source=fs.readFileSync(path.join(root,'prompt-writing-coach.js'),'utf8');
const css=fs.readFileSync(path.join(root,'prompt-writing-coach.css'),'utf8');

const examples={
  'full-name':'My full name is Jordan Bennett.',
  'student-number':'My student number is 12345678.',
  'home-address':'My home address is 42 Maple Street.',
  'phone-number':'Call me at 416-555-0198.',
  password:'My password is secret123.',
  medical:'I was diagnosed with asthma last year.',
  financial:'My bank account is 00123456789.',
  immigration:'My immigration status is permanent resident.',
  'other-student':'Another student name is Taylor and their student number is 7654321.'
};
for(const [type,text] of Object.entries(examples)) assert.ok(Coach._test.scanPromptPrivacy(text).some(finding=>finding.type===type),`scanner detects ${type}`);
assert.deepEqual(Coach._test.scanPromptPrivacy('Explain photosynthesis using a similar example.'),[],'ordinary learning content is not flagged');
const findings=Coach._test.scanPromptPrivacy('My student number is 12345678 and my phone is 416-555-0198.');
assert.ok(findings.some(finding=>finding.label==='Possible student number detected.'));
assert.ok(findings.some(finding=>finding.label==='Possible phone number detected.'));
const redacted=Coach._test.redactPromptPrivacy('My password is secret123 and my phone is 416-555-0198.');
assert.doesNotMatch(redacted,/secret123|416-555-0198/,'Remove It redacts detected values');
assert.match(redacted,/\[removed private information\]/);

assert.match(source,/This prompt may contain private information\./,'warning uses the required wording');
assert.match(source,/Possible student number detected\./,'warning supports the requested example finding');
for(const action of ['Remove It','Edit Prompt','Cancel','Continue Only If Appropriate']) assert.match(source,new RegExp(`>${action}<`),`warning includes ${action}`);
assert.match(source,/const findings = scanPromptPrivacy\(prompt\)/,'final selected prompt is scanned at AI Coach handoff');
assert.match(source,/if \(findings\.length && !state\.privacyOverrideApproved\)/,'handoff pauses for privacy review');
assert.match(source,/redactPromptPrivacy\(guidedLivePrompt\(state\)\)/,'Remove It uses the shared scanner redaction');
assert.match(source,/state\.confirmed = false/,'removing or editing private information requires review and confirmation again');
assert.match(source,/state\.privacyOverrideApproved = true/,'Continue Only If Appropriate records an explicit one-prompt decision');
assert.match(source,/state\.privacyOverrideApproved = false; state\.editedPrompt/,'editing builder content invalidates the prior privacy decision');
assert.match(source,/enforceBoundary\(\{ \.\.\.draft, helpMode: draft\.requestedHelpMode \}\)/,'external-provider send path retains the server privacy boundary');
assert.doesNotMatch(source,/scanPromptPrivacy\(prompt\)[\s\S]{0,400}composer\.(?:submit|click)\(/,'privacy continuation never submits the AI Coach composer automatically');

assert.throws(()=>Coach._test.enforceBoundary({goal:'Explain algebra',generatedPromptText:'My student number is 12345678.',helpMode:'HINT',policyState:'AI_ALLOWED',privacyStatus:'NO_OBVIOUS_SENSITIVE_INFORMATION_DETECTED'}),error=>error.code==='BLOCKED_BY_PRIVACY','server boundary blocks detected private information even when client status claims it is clear');
assert.match(css,/\.prompt-privacy-warning/,'privacy warning has a clear inline panel');
assert.match(css,/\.prompt-privacy-actions/,'warning actions have an organized responsive layout');
assert.doesNotMatch(css,/\.prompt-privacy-warning[^}]*position:(?:fixed|absolute)/,'privacy warning does not float over content');
console.log('Prompt Coach privacy check tests passed');
