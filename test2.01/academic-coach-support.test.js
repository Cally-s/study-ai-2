'use strict';
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const library = require('../academic-knowledge-library.js');
const coach = require('../academic-coach-support.js');
const html = fs.readFileSync(path.join(root, 'index (2).html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const commands = fs.readFileSync(path.join(root, 'ai-accessibility-commands.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'academic-coach-support.css'), 'utf8');

test('academic support defines the required subject areas and routing results', () => {
  assert.deepEqual(library.SUBJECT_AREAS.map(x => x.label), [
    'Mathematics',
    'Biology',
    'Chemistry',
    'Physics',
    'English and Language Arts',
    'Vocabulary and Academic Language',
    'General Study Skills'
  ]);

  for (const route of [
    'MATH',
    'BIOLOGY',
    'CHEMISTRY',
    'PHYSICS',
    'LANGUAGE_ARTS',
    'VOCABULARY',
    'MULTI_SUBJECT',
    'GENERAL_STUDY',
    'UNKNOWN'
  ]) assert.ok(coach.ROUTING_RESULTS.includes(route), `${route} is supported`);
});

test('subject router uses context and asks for clarification for ambiguous or incomplete questions', () => {
  assert.equal(coach.detectSubjectAndTopic({ question: 'Explain why dividing by a negative reverses an inequality.' }).subject, 'MATH');
  assert.equal(coach.detectSubjectAndTopic({ question: 'What is a cell?' }).clarificationRequired, true);
  assert.match(coach.detectSubjectAndTopic({ question: 'What is a cell?' }).clarificationQuestion, /biological cell/);
  assert.equal(coach.detectSubjectAndTopic({ question: 'Solve it.' }).clarificationRequired, true);
  assert.match(coach.detectSubjectAndTopic({ question: 'My answer is 12. Is it right?' }).clarificationQuestion, /original problem/);
  assert.equal(coach.detectSubjectAndTopic({ question: 'What is a cell?', context: { selectedSubject: 'BIOLOGY' } }).subject, 'BIOLOGY');
});

test('mathematics responses use deterministic support and preserve final-answer learning modes', () => {
  const inequality = coach.answerAcademicQuestion({ question: 'Explain why dividing by a negative reverses an inequality.' });
  assert.match(inequality.plainText, /number line/);
  assert.match(inequality.plainText, /Confidence\nHigh/);
  assert.match(inequality.html, /academic-trust-toggle/);
  assert.doesNotMatch(inequality.html, /academic-coach-summary/);

  const guided = coach.answerAcademicQuestion({ question: 'Factor x² + 5x + 6 using guiding questions.' });
  assert.match(guided.plainText, /What two numbers multiply to 6 and add to 5/);
  assert.doesNotMatch(guided.plainText, /\(x \+ 2\)\(x \+ 3\)/);
  assert.equal(guided.finalAnswerWithheld, true);

  const stats = coach.answerAcademicQuestion({ question: 'Find the mean and median of this dataset: 2, 4, 9.' });
  assert.match(stats.plainText, /Mean: 5/);
  assert.match(stats.plainText, /median: 4/);

  const derivative = coach.answerAcademicQuestion({ question: 'Differentiate 3x² + 4x.' });
  assert.match(derivative.plainText, /Derivative: 6x \+ 4/);
});

test('science tools calculate, explain units, and block unsafe lab requests', () => {
  const balanced = coach.answerAcademicQuestion({ question: 'Balance H₂ + O₂ → H₂O.' });
  assert.match(balanced.plainText, /2H₂ \+ O₂ → 2H₂O/);
  assert.match(balanced.plainText, /conserved|conservation/);

  const molarMass = coach.answerAcademicQuestion({ question: 'Find the molar mass of CaCO₃.' });
  assert.match(molarMass.plainText, /100\.09 g\/mol/);
  assert.match(molarMass.plainText, /grams per mole/);

  const force = coach.answerAcademicQuestion({ question: 'Calculate force from mass 2 kg and acceleration 3 m/s².' });
  assert.match(force.plainText, /6 N/);
  assert.match(force.plainText, /kg·m\/s² = N/);

  const speed = coach.answerAcademicQuestion({ question: 'Explain velocity versus speed.' });
  assert.match(speed.plainText, /Velocity tells how fast and in what direction/);

  const unsafe = coach.answerAcademicQuestion({ question: 'Tell me how to make a dangerous chemistry experiment with toxic gas.' });
  assert.equal(unsafe.safetyRefusal, true);
  assert.match(unsafe.plainText, /teacher-approved procedures/);
});

test('biology, language arts, vocabulary, and multilingual terminology use approved library content', () => {
  const biology = coach.answerAcademicQuestion({ question: 'Compare mitosis and meiosis.' });
  assert.match(biology.plainText, /Mitosis/);
  assert.match(biology.plainText, /Meiosis/);
  assert.doesNotMatch(biology.plainText, /Osmosis is the movement/);
  assert.doesNotMatch(biology.html, /APPROVED_STUDYSPARK_CONTENT|knowledgeDocumentIds|version 2026/);
  assert.match(biology.html, /StudySpark Biology Library — Cell Division/);

  const thesis = coach.answerAcademicQuestion({ question: 'Help me improve my thesis without writing the essay.' });
  assert.match(thesis.plainText, /student’s voice|own wording/);

  const hypothesis = coach.answerAcademicQuestion({ question: 'Define hypothesis.' });
  assert.match(hypothesis.plainText, /possible explanation that can be tested/i);
  assert.match(hypothesis.html, /Define This Word/);

  const velocity = coach.answerAcademicQuestion({ question: 'Explain velocity in English and Chinese.' });
  assert.match(velocity.plainText, /速度/);
  assert.match(velocity.plainText, /English term preserved|Velocity/);

  const analyze = coach.answerAcademicQuestion({ question: 'Give the word family for analyze.' });
  assert.match(analyze.plainText, /analysis/);
  assert.match(analyze.plainText, /analytical/);
});

test('source and uncertainty handling avoid fabricated citations', () => {
  const sourced = coach.answerAcademicQuestion({ question: 'Explain the theme using evidence from this passage.' });
  assert.match(sourced.plainText, /available information is not enough/i);
  assert.match(sourced.plainText, /Insufficient Information/);
  assert.doesNotMatch(sourced.plainText, /page \d+/i);

  const math = coach.answerAcademicQuestion({ question: 'Differentiate 3x² + 4x.' });
  assert.match(math.plainText, /Checked using the stated formula and values/);
});

test('concise academic responses use detail levels, relevant sources, and collapsed trust details', () => {
  const route = coach.detectSubjectAndTopic({ question: 'Compare mitosis and meiosis.' });
  const retrieval = coach.retrieveKnowledge(route, { question: 'Compare mitosis and meiosis.', limit: 3 });
  assert.equal(retrieval.documents.length, 1);
  assert.equal(retrieval.documents[0].id, 'biology-cells-division-osmosis-2026-1');
  assert.doesNotMatch(retrieval.documents.map(document => document.title).join(' '), /Ecology|ELA|Writing/);

  const brief = coach.answerAcademicQuestion({
    question: 'Compare mitosis and meiosis.',
    context: { responseDetail: 'BRIEF' }
  });
  assert.equal(brief.answer.detail, 'BRIEF');
  assert.match(brief.html, /Detail: Brief/);
  assert.doesNotMatch(brief.html, /APPROVED_STUDYSPARK_CONTENT|embedding|knowledgeDocumentIds/);
  assert.match(brief.html, /class="academic-trust-panel" hidden/);

  const detailed = coach.answerAcademicQuestion({
    question: 'Explain osmosis.',
    context: { responseDetail: 'DETAILED' }
  });
  assert.equal(detailed.answer.detail, 'DETAILED');
  assert.match(detailed.plainText, /Osmosis is the movement of water/);
  assert.match(detailed.html, /aria-expanded="false"/);
  assert.match(detailed.html, /aria-controls="academic-trust-/);
});

test('approved academic documents can be managed without exposing drafts to students', () => {
  assert.throws(
    () => library.createAcademicKnowledgeDocument({ title: 'Student draft' }, { role: 'student' }),
    /Authorized teacher or administrator/
  );

  const unsafeQuality = library.runKnowledgeQualityChecks({
    id: 'unsafe-chemistry-check',
    title: 'Unsafe chemistry notes',
    subject: 'CHEMISTRY',
    courseLevel: 'Grade 10',
    topic: 'Lab Safety',
    learningObjectives: ['Recognize unsafe requests.'],
    content: 'Do not make explosive materials or bypass safety.',
    answerExplanations: ['Use teacher-approved safety procedures.'],
    sourceMetadata: { title: 'Teacher safety notes' }
  });
  assert.ok(unsafeQuality.issues.includes('Unsafe laboratory instructions'));

  const created = library.createAcademicKnowledgeDocument({
    id: 'teacher-reviewed-biology-enzymes',
    title: 'Biology: Enzyme Shape and Function',
    subject: 'BIOLOGY',
    courseLevel: 'Grade 10',
    gradeMin: 9,
    gradeMax: 10,
    topic: 'Enzymes',
    subtopic: 'Active sites',
    learningObjectives: ['Explain how enzyme shape affects reaction rate.'],
    content: 'Enzymes are proteins with active sites that fit specific reactants. Temperature and pH can change enzyme shape.',
    keyTerms: ['enzyme', 'active site', 'reactant', 'temperature', 'pH'],
    workedExamples: ['A changed active site may make the reactant fit less well.'],
    commonMisconceptions: ['Enzymes are not used up by the reaction they catalyze.'],
    practiceQuestions: ['What can happen to an enzyme if the temperature is too high?'],
    answerExplanations: ['Its shape can change, so the reactant may no longer fit the active site.'],
    sourceMetadata: {
      sourceType: 'APPROVED_TEACHER_CONTENT',
      title: 'Grade 10 biology enzyme notes',
      reviewedBy: 'Teacher reviewer',
      reviewedAt: '2026-08-31'
    },
    version: 'draft-enzymes-1'
  }, { role: 'teacher' });

  assert.equal(created.document.reviewStatus, 'Draft');
  assert.equal(library.listApprovedKnowledgeDocuments().some(document => document.id === created.document.id), false);

  const published = library.publishAcademicKnowledgeDocument(created.document.id, { role: 'teacher' });
  assert.equal(published.published, true);
  assert.equal(library.listApprovedKnowledgeDocuments().some(document => document.id === created.document.id), true);

  const retrieval = coach.retrieveKnowledge(
    { subject: 'BIOLOGY', topic: 'Enzymes', candidateSubjects: [] },
    { question: 'Explain enzyme active sites.', limit: 1 }
  );
  assert.equal(retrieval.documents[0].id, created.document.id);
});

test('Coach page loads the academic support modules and scoped UI styles', () => {
  assert.match(html, /academic-coach-support\.css\?v=academic-coach-20260831/);
  assert.match(html, /academic-knowledge-library\.js\?v=academic-coach-20260831/);
  assert.match(html, /academic-coach-support\.js\?v=academic-coach-20260831/);
  assert.match(script, /StudySparkAcademicCoach\?\.answerAcademicQuestion/);
  assert.match(script, /data-response-text/);
  assert.match(commands, /el\.dataset\.responseText/);
  assert.match(styles, /#coachView \.coach-academic-context/);
  assert.match(styles, /#coachView \.academic-coach-response/);
  assert.match(styles, /forced-colors/);
});
