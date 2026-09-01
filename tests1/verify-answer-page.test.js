const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const runtime = fs.readFileSync(path.join(root, 'answer-verification.js'), 'utf8');

test('Verify an Answer uses one canonical route with safe legacy aliases', () => {
  assert.match(app, /answerVerification:'\/ai-coach\/verify-answer'/);
  for (const alias of ['/answer-verification', '/ai-coach/answer-verification', '/verify-answer']) {
    assert.ok(app.includes(`'${alias}':'answerVerification'`));
  }
  assert.match(app, /viewNames\.answerVerification=\['AI COACH','Verify an Answer'\]/);
  assert.match(app, /answerVerification:\{role:'student'[^}]*minimumContentReady:true/);
});

test('route installation is independent of legacy lesson anchors and never blank', () => {
  assert.match(runtime, /getElementById\('viewContainer'\)/);
  assert.doesNotMatch(runtime, /const anchor=d\.getElementById\('promptIterationView'\)/);
  assert.match(runtime, /container\.insertAdjacentHTML\('beforeend'/);
  assert.match(runtime, /render\(\)\}/);
});

test('workspace accepts answers and produces honest organized results', () => {
  for (const copy of [
    'Answer or claim to verify',
    'AI answer or explanation',
    'Calculation',
    'Sources or citation details',
    'Verify Answer',
    'Verification Results',
    'Claim-by-Claim Review',
    'Citations and Sources',
    'What to Do Next'
  ]) assert.ok(runtime.includes(copy), copy);
  assert.match(runtime, /StudySpark does not fabricate sources/);
  assert.match(runtime, /not proof that the answer is correct/);
  assert.match(runtime, /No verifiable source links were found/);
  assert.match(runtime, /certaintyPattern/);
  assert.match(runtime, /calculationPattern/);
  assert.match(runtime, /citationPattern/);
});
