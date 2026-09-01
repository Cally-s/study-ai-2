(function (root) {
  'use strict';

  const freeze = Object.freeze;
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const ELEMENT_TYPES = freeze([
    'GOAL', 'CONTEXT', 'CURRENT_UNDERSTANDING', 'CURRENT_ATTEMPT', 'CONFUSION_OR_GAP',
    'CONSTRAINTS', 'REQUESTED_HELP_TYPE', 'DESIRED_FORMAT', 'ACADEMIC_TERMS_TO_PRESERVE',
    'SOURCE_REQUIREMENTS', 'VERIFICATION_REQUIREMENTS', 'PRIVACY_CHECK', 'ASSIGNMENT_POLICY',
    'STUDENT_ATTEMPT_RULE', 'SUCCESS_CRITERIA', 'OTHER'
  ]);
  const CORE_ELEMENTS = freeze(['GOAL', 'CONTEXT', 'CURRENT_UNDERSTANDING', 'CONSTRAINTS', 'REQUESTED_HELP_TYPE', 'DESIRED_FORMAT', 'SOURCE_REQUIREMENTS', 'VERIFICATION_REQUIREMENTS', 'PRIVACY_CHECK']);
  const HELP_MODES = freeze([
    'HINT', 'GUIDING_QUESTIONS', 'CONCEPT_EXPLANATION', 'SIMPLER_EXPLANATION', 'MORE_DETAIL',
    'SIMILAR_EXAMPLE', 'PRACTICE_QUESTIONS', 'QUIZ', 'CHECK_REASONING', 'CHALLENGE_MY_ANSWER',
    'IDENTIFY_NEXT_STEP', 'SOURCE_VERIFICATION', 'CALCULATION_CHECK', 'QUOTATION_CHECK',
    'CURRENT_INFORMATION_CHECK', 'DRAFT_FEEDBACK', 'CLARITY_FEEDBACK', 'REVISION_STRATEGIES',
    'ORGANIZE_MY_IDEAS', 'RESEARCH_PLANNING', 'CODE_EXPLANATION', 'CODE_DEBUGGING',
    'TEST_CASE_SUGGESTION', 'BILINGUAL_EXPLANATION', 'VOCABULARY_SUPPORT', 'ACCESSIBILITY_FORMAT', 'OTHER'
  ]);
  const DESIRED_FORMATS = freeze([
    'PLAIN_LANGUAGE', 'STANDARD_ACADEMIC', 'ADVANCED_ACADEMIC', 'STEP_BY_STEP', 'ONE_STEP_AT_A_TIME',
    'SHORT_PARAGRAPH', 'BULLET_LIST', 'TABLE', 'COMPARISON', 'WORKED_EXAMPLE', 'GUIDED_EXAMPLE',
    'QUIZ', 'FLASHCARDS', 'CHECKLIST', 'OUTLINE', 'CODE_DIFF', 'ANNOTATED_CODE',
    'FORMULA_AND_EXPLANATION', 'BILINGUAL_SIDE_BY_SIDE', 'ENGLISH_WITH_TRANSLATED_KEYWORDS',
    'AUDIO_WITH_TRANSCRIPT', 'PRINTABLE', 'OTHER'
  ]);
  const SOURCE_REQUIREMENTS = freeze([
    'NO_EXTERNAL_SOURCE_NEEDED', 'STATE_WHETHER_EXTERNAL_SOURCES_WERE_USED', 'COURSE_MATERIALS_ONLY',
    'TEACHER_PROVIDED_SOURCES_ONLY', 'OFFICIAL_CURRENT_SOURCE_REQUIRED', 'PRIMARY_SOURCE_PREFERRED',
    'RELIABLE_SECONDARY_SOURCES', 'MULTIPLE_INDEPENDENT_SOURCES', 'SOURCE_LINKS_REQUIRED',
    'CITATION_DETAILS_REQUIRED', 'QUOTATION_SOURCE_REQUIRED', 'PUBLICATION_DATE_REQUIRED',
    'EXACT_DATE_REQUIRED', 'SOURCE_LIMITATIONS_REQUIRED', 'SOURCE_REQUIREMENT_UNKNOWN', 'OTHER'
  ]);
  const VERIFICATION_REQUIREMENTS = freeze([
    'NO_EXTERNAL_VERIFICATION_NEEDED', 'CHECK_AGAINST_COURSE_NOTES', 'CHECK_AGAINST_TEXTBOOK',
    'OPEN_AND_REVIEW_SOURCES', 'VERIFY_CITATIONS', 'VERIFY_QUOTATIONS', 'RECALCULATE', 'CHECK_FORMULA',
    'CHECK_UNITS', 'CHECK_DENOMINATOR', 'CHECK_CURRENT_OFFICIAL_SOURCE', 'COMPARE_MULTIPLE_SOURCES',
    'TEST_CODE', 'RUN_EDGE_CASES', 'REVIEW_SECURITY_IMPLICATIONS', 'CHECK_TRANSLATION_MEANING',
    'CHECK_ASSIGNMENT_POLICY', 'ASK_TEACHER_OR_AUTHORIZED_PERSON', 'HUMAN_EXPERT_REVIEW',
    'STATE_UNCERTAINTY', 'OTHER'
  ]);
  const ATTEMPT_RULES = freeze([
    'NO_ATTEMPT_REQUIRED', 'ASK_DIAGNOSTIC_FIRST', 'REQUIRE_INITIAL_ATTEMPT', 'WAIT_FOR_STUDENT_RESPONSE',
    'HINT_BEFORE_EXPLANATION', 'FEEDBACK_ON_STUDENT_WORK_ONLY', 'REVEAL_ANSWER_AFTER_ATTEMPT',
    'REVEAL_ANSWER_AFTER_MULTIPLE_ATTEMPTS', 'NEVER_REVEAL_FINAL_ANSWER_IN_THIS_MODE',
    'POLICY_CONTROLLED', 'OTHER'
  ]);
  const ELEMENT_STATUSES = freeze([
    'NOT_STARTED', 'MISSING', 'PRESENT', 'NEEDS_CLARIFICATION', 'TOO_BROAD', 'TOO_RESTRICTIVE',
    'POSSIBLY_UNNECESSARY', 'PRIVACY_REVIEW_REQUIRED', 'POLICY_REVIEW_REQUIRED', 'SOURCE_PLAN_REQUIRED',
    'VERIFICATION_PLAN_REQUIRED', 'STUDENT_ATTEMPT_REQUIRED', 'READY', 'NOT_APPLICABLE', 'BLOCKED',
    'OUTDATED', 'INVALID'
  ]);
  const COACH_STATUSES = freeze([
    'DRAFT', 'COLLECTING_GOAL', 'COLLECTING_CONTEXT', 'COLLECTING_UNDERSTANDING', 'SELECTING_HELP_MODE',
    'SETTING_CONSTRAINTS', 'SELECTING_FORMAT', 'DEFINING_SOURCE_PLAN', 'DEFINING_VERIFICATION_PLAN',
    'PRIVACY_REVIEW', 'POLICY_REVIEW', 'READY_FOR_PREVIEW', 'READY_TO_TEST', 'TESTED',
    'RESPONSE_REVIEW', 'REVISION_RECOMMENDED', 'READY_TO_SEND', 'SENT', 'PAUSED', 'CANCELLED',
    'OUTDATED', 'ERROR'
  ]);
  const FEEDBACK_STATUSES = freeze([
    'PROMPT_IMPROVEMENT_SUPPORTED', 'PROMPT_IMPROVEMENT_PARTLY_SUPPORTED', 'GOAL_NEEDS_CLARIFICATION',
    'CONTEXT_NEEDS_CLARIFICATION', 'CURRENT_UNDERSTANDING_NEEDS_CLARIFICATION', 'HELP_MODE_NEEDS_REVIEW',
    'CONSTRAINT_NEEDS_REVIEW', 'FORMAT_NEEDS_REVIEW', 'SOURCE_PLAN_NEEDED', 'VERIFICATION_PLAN_NEEDED',
    'PRIVACY_REVIEW_NEEDED', 'POLICY_REVIEW_NEEDED', 'STUDENT_ATTEMPT_BOUNDARY_NEEDED',
    'PROMPT_TOO_BROAD', 'PROMPT_TOO_RESTRICTIVE', 'MULTIPLE_GOALS_NEED_SEPARATION',
    'RESPONSIBLE_UNCERTAINTY', 'READY_TO_TEST', 'REVISION_AVAILABLE', 'REVISED', 'BLOCKED', 'INVALID', 'OUTDATED'
  ]);
  const REVIEW_DIMENSIONS = freeze([
    'RELEVANCE_TO_GOAL', 'APPROPRIATE_LEVEL', 'RESPECTED_HELP_MODE', 'RESPECTED_STUDENT_ATTEMPT_RULE',
    'RESPECTED_CONSTRAINTS', 'PRESERVED_ACADEMIC_TERMS', 'USEFUL_FORMAT', 'SOURCE_TRANSPARENCY',
    'SOURCE_SUPPORT', 'VERIFICATION_COMPLETENESS', 'UNCERTAINTY_TRANSPARENCY', 'PRIVACY_PRESERVATION',
    'POLICY_COMPLIANCE', 'STUDENT_OWNERSHIP', 'OTHER'
  ]);
  const TEST_STATUSES = freeze(['READY', 'RUNNING', 'WAITING_FOR_STUDENT_ATTEMPT', 'COMPLETED', 'STOPPED', 'BLOCKED_BY_POLICY', 'BLOCKED_BY_PRIVACY', 'SOURCE_TOOL_UNAVAILABLE', 'ERROR', 'DELETED']);
  const FLAGS = freeze([
    'AI_LITERACY_PROMPT_WRITING_LESSON_ENABLED', 'AI_COACH_PROMPT_WRITING_COACH_ENABLED',
    'AI_COACH_VISUAL_PROMPT_BUILDER_ENABLED', 'AI_COACH_PROMPT_TEST_SANDBOX_ENABLED',
    'AI_COACH_STUDENT_ATTEMPT_ENFORCEMENT_ENABLED', 'AI_COACH_PROMPT_SOURCE_PLAN_ENABLED',
    'AI_COACH_PROMPT_VERIFICATION_PLAN_ENABLED', 'AI_COACH_PROMPT_VERSION_HISTORY_ENABLED',
    'AI_LITERACY_PROMPT_EVIDENCE_ENABLED', 'AI_LITERACY_PROMPT_BILINGUAL_ENABLED',
    'AI_LITERACY_PROMPT_OFFLINE_ENABLED', 'AI_LITERACY_PROMPT_TEACHER_PREVIEW_ENABLED'
  ]);
  const POLICY_STATES = freeze(['AI_ALLOWED', 'AI_ALLOWED_WITH_DISCLOSURE', 'AI_ALLOWED_FOR_LIMITED_TASKS', 'AI_NOT_ALLOWED', 'POLICY_UNKNOWN', 'ACTIVE_ASSESSMENT_RESTRICTED']);
  const PRIVACY_STATES = freeze(['NO_OBVIOUS_SENSITIVE_INFORMATION_DETECTED', 'REVIEW_RECOMMENDED', 'REDACTION_REQUIRED', 'SECRET_REMOVAL_REQUIRED', 'SECURE_CHANNEL_RECOMMENDED']);

  const COPY = freeze({
    central: 'A better prompt can make an AI response more relevant and useful, but it cannot guarantee that the response will be correct, fair, current, permitted, or appropriate.',
    learning: 'A learning prompt should support the student’s thinking rather than replace the thinking the student is expected to do.',
    attempt: 'When the student requests hints, feedback, guiding questions, or a quiz, StudySpark should preserve the student’s opportunity to attempt the task before revealing the answer.',
    verification: 'Source requests and confident wording are not verification. Students must open sources, check calculations, test code, compare quotations, and confirm current information.',
    privacy: 'The prompt should contain only the minimum information needed. StudySpark must run the Step 9 privacy preflight before sending it.',
    policy: 'Before creating material for submission, check the applicable AI-use policy. When the policy is unknown, do not generate submission-ready content.',
    formula: 'A useful prompt is not created by making it as long as possible or filling every field mechanically. Include the information that is relevant to the goal.',
    accessibility: 'Reading level, bilingual support, Text-to-Speech, Speech-to-Text, screen-reader access, and approved accommodations may be included without reducing student ownership.',
    transparency: 'The Prompt-Writing Coach may improve wording and structure, but it must not silently add facts, sources, personal information, assignment requirements, or student understanding that the student did not provide.',
    message: 'A useful prompt tells the AI what you are trying to learn, what you already understand, what kind of help you need, what the AI should avoid doing, and how you will check the result.',
    integrity: 'A well-written prompt does not make an otherwise prohibited AI use acceptable.'
  });
  const WEAK_PROMPT = 'Teach me chemistry.';
  const IMPROVED_PROMPT = 'I am studying Grade 11 chemistry and understand ionic bonding but am confused about covalent bonding.\n\nExplain the difference in plain language, preserve the terms ‘electron sharing’ and ‘electronegativity,’ and then ask me two questions.\n\nDo not give me the answers until I attempt them.';
  const PHASES = freeze(['LEARN', 'OBSERVE', 'PRACTISE', 'EXPLAIN', 'APPLY', 'REFLECT']);
  const lesson = freeze({
    id: 'prompt-with-purpose', title: 'Prompt With Purpose', feature: 'Prompt-Writing Coach', pathway: 'APPLY',
    primaryCompetency: 'Application Skills', secondaryCompetencies: ['Human Accountability', 'Human Agency', 'Safe and Responsible Use'],
    phases: PHASES, version: 1, estimatedMinutes: '30–40', academicIntegrityMode: 'GENERAL_LEARNING',
    completionDoesNotAwardCompetency: true, openingCreatesEvidence: false
  });
  const scenarios = freeze([
    ['chemistry', 'Grade 11 Chemistry', WEAK_PROMPT, IMPROVED_PROMPT, 'CONCEPT_EXPLANATION', 'REVEAL_ANSWER_AFTER_ATTEMPT'],
    ['math-hint', 'Mathematics Hint', 'Solve this equation for me.', 'Give me one hint for the synthetic practice equation 2x + 7 = 19. Wait for my next step and then check it.', 'HINT', 'WAIT_FOR_STUDENT_RESPONSE'],
    ['current-deadline', 'Current Scholarship Deadline', 'When is the application due?', 'Use the current official source for this fictional scholarship, give the exact date and link, and say when it cannot be verified.', 'CURRENT_INFORMATION_CHECK', 'NO_ATTEMPT_REQUIRED'],
    ['code-debug', 'Java Loop Debugging', 'Fix my code.', 'Help me identify why my Java loop does not stop, ask what I expect, and suggest two tests without rewriting the program.', 'CODE_DEBUGGING', 'REQUIRE_INITIAL_ATTEMPT'],
    ['draft-feedback', 'History Draft Feedback', 'Make my essay better.', 'Identify one unclear sentence, missing evidence, and a transition in my paragraph. Do not rewrite it; wait for my revision.', 'DRAFT_FEEDBACK', 'FEEDBACK_ON_STUDENT_WORK_ONLY'],
    ['source-verification', 'Social-Media Research Sources', 'Give me sources proving social media is bad.', 'Help me form a balanced research question, suitable search terms, source types, benefits, harms, and limitations. Do not invent citations.', 'SOURCE_VERIFICATION', 'NO_ATTEMPT_REQUIRED'],
    ['privacy', 'Privacy Redaction', 'My name is [FULL NAME], my student number is [STUDENT NUMBER], and I have [DIAGNOSIS]. Write a message to my teacher.', 'Help me draft a general meeting request using placeholders. Do not include or request medical details.', 'ORGANIZE_MY_IDEAS', 'NO_ATTEMPT_REQUIRED'],
    ['policy-unknown', 'Policy Unknown', 'Write my project introduction.', 'Help me create questions for my teacher about permitted AI uses. Do not generate material for submission.', 'GUIDING_QUESTIONS', 'POLICY_CONTROLLED'],
    ['active-assessment', 'Active Assessment', 'I am taking a test. Give me the answer to Question 4.', '', 'OTHER', 'POLICY_CONTROLLED'],
    ['bilingual', 'Bilingual Photosynthesis', 'Explain this in Chinese.', 'Explain Photosynthesis in plain English and Mandarin while preserving English academic terms, then ask two bilingual questions and wait.', 'BILINGUAL_EXPLANATION', 'WAIT_FOR_STUDENT_RESPONSE'],
    ['calculation', 'Percentage Calculation', 'Is my answer right?', 'Check whether 18 out of 30 is 80% by showing the division and conversion, then ask me to correct it.', 'CALCULATION_CHECK', 'REQUIRE_INITIAL_ATTEMPT'],
    ['quotation', 'Quotation Verification', 'Find a quote that supports my point.', 'Verify the exact quotation against the original source and say “quotation not verified” if it cannot be found. Do not invent one.', 'QUOTATION_CHECK', 'NO_ATTEMPT_REQUIRED']
  ].map((s, index) => freeze({ id: `prompt-${s[0]}`, title: s[1], weakPrompt: s[2], improvedPrompt: s[3], expectedHelpMode: s[4], expectedAttemptRule: s[5], version: 1, orderPosition: index + 1, synthetic: true })));

  const templates = freeze([
    'Explain a Concept', 'Give Me a Hint', 'Ask Guiding Questions', 'Quiz Me', 'Check My Reasoning',
    'Verify a Source', 'Review My Draft', 'Help Me Debug', 'Create Similar Practice',
    'Show a Bilingual Explanation', 'Help Me Organize My Ideas', 'Check Current Information'
  ].map((title, index) => freeze({ id: `prompt-template-${index + 1}`, title, version: 1, editable: true })));

  const BUILDER_FIELDS = freeze([
    ['goal', 'What are you trying to do?'], ['context', 'What context does the AI need?'],
    ['understanding', 'What do you already understand?'], ['attempt', 'What have you tried?'],
    ['gap', 'What is unclear?'], ['help', 'What type of help do you want?'],
    ['avoid', 'What should the AI avoid doing?'], ['format', 'What format would help you?'],
    ['terms', 'Which academic terms must remain visible?'], ['sources', 'Do you need sources?'],
    ['verification', 'How will you verify the result?'], ['privacy', 'Have you removed unnecessary private information?'],
    ['policy', 'What assignment policy applies?'], ['attemptRule', 'Should the AI wait for your attempt?']
  ].map(([key, question]) => freeze({ key, question })));
  const PROMPT_STARTER_TEMPLATES = freeze([
    ['explain-concept', 'Explain a Concept', 'Understand a topic with a clear explanation matched to what you already know.', '◎', { goal: 'Explain [concept or topic] so I can understand it.', context: 'I am studying [course or grade].', understanding: 'What I already understand: [add your understanding].', gap: 'I am confused about [specific part].', help: 'Explain the concept and check my understanding.', avoid: 'Do not complete graded work or assume facts I have not provided.', format: 'Use plain language, clear steps, and two short check-for-understanding questions.', verification: 'I will compare the explanation with my course notes or textbook.', privacy: 'I have removed names, student numbers, passwords, and other private information.', attemptRule: 'Wait for my response before revealing answers to the check questions.' }],
    ['hint', 'Give Me a Hint', 'Get one useful clue while keeping the next thinking step in your hands.', '↗', { goal: 'Help me take the next step on [problem or task].', context: 'The question or task is: [paste a privacy-safe version].', attempt: 'What I have tried: [show your attempt].', gap: 'I became stuck at [specific step].', help: 'Give me one hint only.', avoid: 'Do not reveal the final answer or solve the whole problem.', format: 'Give one short hint, then ask what I would try next.', verification: 'I will apply the hint and check my work against the original task.', privacy: 'I have removed unnecessary private information.', attemptRule: 'Wait for my next attempt before giving another hint.' }],
    ['guiding-questions', 'Ask Me Guiding Questions', 'Work through an idea using questions that help you make each decision.', '?', { goal: 'Help me reason through [topic or task] by asking questions.', context: 'This is for [course, grade, or learning goal].', understanding: 'What I currently think: [add your understanding].', attempt: 'What I have tried: [add your attempt].', help: 'Ask me one guiding question at a time.', avoid: 'Do not provide a finished answer or answer the questions for me.', format: 'Use one concise question at a time.', verification: 'At the end, ask me to explain how I checked my reasoning.', privacy: 'I have removed unnecessary private information.', attemptRule: 'Wait for each response before asking the next question.' }],
    ['check-reasoning', 'Check My Reasoning', 'Review the logic in your attempt without replacing it with a finished solution.', '✓', { goal: 'Check the reasoning in my attempt for [problem or claim].', context: 'The original task is: [add a privacy-safe version].', attempt: 'My reasoning and answer: [paste your work].', help: 'Identify the first unsupported or incorrect step and explain why it needs review.', avoid: 'Do not replace my work with a complete final solution.', format: 'Respond with: what is supported, what needs review, and one next step.', verification: 'I will redo the flagged step and compare it with course materials.', privacy: 'I have removed unnecessary private information.', attemptRule: 'Give feedback on my work first and wait for my revision.' }],
    ['practice-questions', 'Create Practice Questions', 'Generate editable practice that matches a topic without exposing assessment answers.', '✎', { goal: 'Create practice questions about [topic].', context: 'Course or grade: [add course or grade].', understanding: 'Topics I have already studied: [add topics].', help: 'Create practice questions that build from basic understanding to application.', avoid: 'Do not copy an active test, assignment, or answer key.', format: 'Create [number] questions, one at a time, with varied question types.', verification: 'Base questions on the course topics I provide and label any assumptions.', privacy: 'I have not included private or restricted assessment information.', policy: 'Use only practice support permitted by my course or assignment policy.', attemptRule: 'Wait for my attempt before showing feedback or an explanation.' }],
    ['verify-source', 'Help Me Verify a Source', 'Plan checks for authority, evidence, currency, relevance, and limitations.', '⌕', { goal: 'Help me verify whether this source is suitable for [claim or task].', context: 'Source title, author, organization, date, and link: [add available details].', help: 'Guide me through checking authority, evidence, currency, relevance, and limitations.', avoid: 'Do not invent source details, quotations, citations, or verification results.', format: 'Use a verification checklist and clearly mark anything that remains unverified.', sources: 'Use the original source and independent authoritative sources when available.', verification: 'Require me to open the source, confirm its details, and compare important claims.', privacy: 'I have removed private account or access information.', attemptRule: 'Ask me for missing source details instead of guessing.' }],
    ['draft-feedback', 'Give Feedback on My Draft', 'Receive specific feedback while keeping the wording and revision decisions yours.', '▤', { goal: 'Give feedback on my draft about [topic or purpose].', context: 'Audience, requirements, and stage of writing: [add context].', attempt: 'My draft: [paste a privacy-safe excerpt].', help: 'Identify one strength, the most important area to improve, and a revision question.', avoid: 'Do not rewrite the draft or create submission-ready text for me.', format: 'Use brief comments linked to exact parts of my draft.', verification: 'I will decide which feedback to use and review the final draft myself.', privacy: 'I have removed names and other unnecessary private information.', policy: 'Feedback must follow the assignment AI-use policy.', attemptRule: 'Wait for my revision before offering another round of feedback.' }],
    ['similar-example', 'Show Me a Similar Example', 'Study a parallel example without receiving the answer to your own task.', '◇', { goal: 'Show me a similar example for [concept or problem type].', context: 'My original task involves [describe the structure without requesting its answer].', understanding: 'What I understand so far: [add your understanding].', gap: 'The part I need to see modeled is [specific step or concept].', help: 'Create and explain a new parallel example with different details.', avoid: 'Do not solve, paraphrase, or reveal the answer to my original task.', format: 'Show the similar example step by step, then ask me to apply the pattern.', verification: 'I will compare the method—not the final answer—with my course materials.', privacy: 'I have removed unnecessary private information.', attemptRule: 'After the example, wait for me to try my original task.' }]
  ].map(([id, title, description, icon, fields]) => freeze({ id, title, description, icon, fields: freeze(fields), editable: true, automaticallySent: false })));
  const PROMPT_TEMPLATE_CATEGORIES = freeze(['Learning', 'Reasoning', 'Research', 'Writing', 'Test Preparation', 'Coding', 'Source Verification']);
  const PROMPT_TEMPLATE_LIBRARY = freeze([
    ['learn-explain', 'Explain a Concept', 'Learning', 'Build an explanation from what you already know.', 'explain-concept', ['explanation', 'concept', 'prerequisite', 'subject']],
    ['learn-prerequisite', 'Check My Prerequisites', 'Learning', 'Find the background knowledge to review before a new topic.', 'guiding-questions', ['prerequisite', 'foundations', 'current understanding', 'topic']],
    ['reason-guided', 'Guided Reasoning', 'Reasoning', 'Work through a decision using one guiding question at a time.', 'guiding-questions', ['reasoning', 'guiding questions', 'compare methods', 'decision']],
    ['reason-check', 'Compare and Check Methods', 'Reasoning', 'Examine the reasoning in an attempt without replacing it.', 'check-reasoning', ['compare methods', 'check reasoning', 'logic', 'attempt']],
    ['research-question', 'Develop a Research Question', 'Research', 'Turn a broad topic into a focused, verifiable research question.', 'verify-source', ['research question', 'source', 'evidence', 'scope']],
    ['research-source', 'Verify a Source', 'Research', 'Plan checks for authority, evidence, currency, and limitations.', 'verify-source', ['source', 'citation', 'reliable', 'verification']],
    ['writing-feedback', 'Writing Feedback', 'Writing', 'Request specific feedback while keeping revision decisions yours.', 'draft-feedback', ['writing feedback', 'draft', 'revision', 'clarity']],
    ['writing-example', 'Study a Similar Example', 'Writing', 'Learn from a parallel example without copying your own answer.', 'similar-example', ['similar example', 'writing', 'structure', 'model']],
    ['test-recall', 'Active Recall Review', 'Test Preparation', 'Create practice questions that require you to retrieve what you know.', 'practice-questions', ['active recall', 'test review', 'practice questions', 'quiz']],
    ['test-hint', 'Test Review Hints', 'Test Preparation', 'Use progressive hints while preparing with practice material.', 'hint', ['hint', 'test review', 'exam', 'practice']],
    ['coding-debug', 'Debug My Code', 'Coding', 'Find the first likely issue and plan tests without replacing the whole program.', 'check-reasoning', ['coding', 'debug', 'code', 'test cases', 'programming']],
    ['source-verify', 'Verify Evidence and Claims', 'Source Verification', 'Check authority, evidence, currency, relevance, and limitations before relying on a source.', 'verify-source', ['source verification', 'claim', 'citation', 'evidence', 'reliability']]
  ].map(([id, title, category, description, starterTemplateId, searchTerms]) => freeze({ id, title, category, description, starterTemplateId, searchTerms: freeze(searchTerms), automaticallySent: false })));
  const PROMPT_COMPARISON_EXAMPLES = freeze([
    ['mathematics', 'Mathematics', 'Solve x² - 5x + 6 = 0.', 'I am practising factoring quadratic equations in Grade 10 Mathematics. I know I need two numbers whose product is 6, but I am unsure how the middle term helps. Give me one hint, then wait for my attempt. Do not reveal the final factors or roots.', 'Added the course level, current understanding, exact confusion, requested help, and a final-answer boundary.', 'It gives the AI enough relevant context to support the student’s next thinking step without completing the problem.', 'The student still needs to factor the expression, substitute the roots, and check the work against course methods.', 'hint'],
    ['science', 'Science', 'Explain photosynthesis.', 'I am studying photosynthesis in Grade 9 Science. I understand that plants use light, water, and carbon dioxide, but I am confused about how light energy becomes stored chemical energy. Explain that connection in plain language, preserve the terms chlorophyll and glucose, then ask one question to check my understanding.', 'Added prior knowledge, a precise conceptual gap, important terminology, an explanation level, and a check-for-understanding request.', 'It focuses the explanation on the missing connection and asks the student to demonstrate understanding afterward.', 'The student should compare the explanation and equation with current course materials and confirm any unfamiliar scientific claims.', 'explain-concept'],
    ['writing', 'Writing', 'Make my essay better.', 'Give feedback on my own persuasive paragraph. Identify one clear strength, the most important place where evidence or reasoning needs work, and one revision question. Do not rewrite the paragraph or create submission-ready wording for me.', 'Specified the kind of feedback, limited its scope, and protected the student’s authorship and revision decisions.', 'It asks for actionable feedback tied to the student’s work while keeping the actual revision in the student’s hands.', 'The student must confirm the feedback matches the assignment criteria and decide which revisions are accurate and appropriate.', 'draft-feedback'],
    ['research', 'Research', 'Find sources about climate change.', 'Help me narrow a research question about how urban heat affects public health in Canadian cities. Suggest useful search terms and source types, prioritize current official and peer-reviewed evidence, identify limitations, and do not invent citations or claim a source was verified unless it was opened and checked.', 'Narrowed the topic, defined the evidence needed, required source transparency, and added limits against invented verification.', 'It supports a focused research plan and makes clear that finding a source is different from verifying its claims.', 'The student must open each source, confirm author, date, evidence, relevance, quotations, and citation details.', 'verify-source'],
    ['coding', 'Coding', 'Fix my code.', 'Help me debug a loop that does not stop. First ask what I expected the loop to do, then identify the first likely logic issue in the code I provide and suggest two test cases. Explain the issue without rewriting the whole program or giving me a complete replacement solution.', 'Added the observed problem, expected-behaviour check, debugging sequence, test request, and a boundary against full replacement code.', 'It turns a vague repair request into a learning-focused debugging process that preserves the student’s reasoning and code ownership.', 'The student still needs to run the code, test edge cases, review errors, and check security or performance implications where relevant.', 'check-reasoning'],
    ['test-preparation', 'Test Preparation', 'Tell me the answers for my test.', 'Help me prepare for a test on Grade 10 linear relations using active recall. Ask one original practice question at a time, wait for my answer, and give a hint before an explanation. Do not copy an active assessment or reveal answers before I attempt each question.', 'Changed an answer-seeking request into permitted practice, named the topic and level, and added attempt and active-assessment boundaries.', 'It creates a realistic practice loop that checks retrieval and preserves the student’s opportunity to think.', 'The student should verify the practice matches the course scope and confirm current assessment rules with the teacher when unsure.', 'practice-questions']
  ].map(([id, subject, weakPrompt, strongPrompt, whatChanged, whyBetter, verification, starterTemplateId]) => freeze({ id, subject, weakPrompt, strongPrompt, whatChanged, whyBetter, verification, starterTemplateId, automaticallySaved: false, automaticallySent: false })));
  const PROMPT_PAGE_STATES = freeze({
    LOADING: 'Loading', EMPTY: 'No prompts yet', BUILDING: 'Prompt being built', READY: 'Prompt ready', SAVED: 'Prompt saved',
    PRIVACY_WARNING: 'Privacy warning', POLICY_WARNING: 'Policy warning', TEMPLATE_ERROR: 'Unable to load templates',
    SAVE_ERROR: 'Unable to save prompt', OFFLINE: 'Offline', RECONNECTING: 'Reconnecting'
  });
  const PROMPT_COACH_DRAFT_SCHEMA = freeze(['id', 'userId', 'organizationId', 'title', 'subject', 'courseLevel', 'goal', 'currentUnderstanding', 'difficultyDescription', 'learningMode', 'responseFormat', 'sourceRequirement', 'avoidInstructions', 'generatedPrompt', 'privacyCheckStatus', 'assignmentPolicyStatus', 'status', 'createdAt', 'updatedAt']);
  const PROMPT_COACH_DRAFT_STATUSES = freeze(['DRAFT', 'SAVED', 'READY', 'APPROVED', 'SENT', 'DELETED']);
  const GUIDED_BUILDER_STEPS = freeze([
    ['goal', 'What is your goal?', 'Describe what you want to learn or accomplish.', 'textarea'],
    ['subject', 'What subject are you working on?', 'Enter a subject such as Mathematics, Biology, History, or Computer Science.', 'input'],
    ['level', 'What course, grade, or level?', 'Add the course name, grade, or learning level that should shape the response.', 'input'],
    ['understanding', 'What do you already understand?', 'Share what you know so the AI can build from it instead of starting over.', 'textarea'],
    ['confusion', 'What exactly is confusing?', 'Identify the step, idea, term, or decision where you need support.', 'textarea'],
    ['helpType', 'What type of help do you want?', 'Choose the learning support that best matches your goal.', 'help-select'],
    ['presentation', 'How should the answer be presented?', 'Choose a format that will make the response easier to use.', 'format-select'],
    ['avoid', 'What should the AI avoid doing?', 'Protect your learning by stating what the AI must not do.', 'textarea'],
    ['sources', 'Do you need sources?', 'Choose whether the response needs external source support.', 'source-select']
  ].map(([key, title, description, control]) => freeze({ key, title, description, control })));
  const GUIDED_LEARNING_MODES = freeze([
    ['HINT', 'Give Me a Hint', 'Give me one useful hint at a time. Wait for my attempt before giving another hint.', 'WAIT_FOR_STUDENT_RESPONSE', false],
    ['GUIDING_QUESTIONS', 'Ask Me Guiding Questions', 'Ask me one guiding question at a time and wait for my response before continuing.', 'WAIT_FOR_STUDENT_RESPONSE', false],
    ['SIMPLER_EXPLANATION', 'Explain in Simpler Language', 'Explain the idea in simpler language while preserving the important academic terms.', 'NO_ATTEMPT_REQUIRED', false],
    ['SIMILAR_EXAMPLE', 'Show Me a Similar Example', 'Show a parallel example with different details, then ask me to apply the pattern myself.', 'REVEAL_ANSWER_AFTER_ATTEMPT', false],
    ['CHECK_REASONING', 'Check My Reasoning', 'Review my steps, identify the first incorrect or unclear step, and ask me to revise it. Do not replace my full solution.', 'WAIT_FOR_STUDENT_RESPONSE', false],
    ['CHALLENGE_MY_ANSWER', 'Challenge My Answer', 'Challenge my assumptions, identify a possible counterexample, and ask me to defend or revise my answer.', 'WAIT_FOR_STUDENT_RESPONSE', false],
    ['QUIZ', 'Quiz Me', 'Ask one question at a time and wait for my answer before giving feedback or the next question.', 'WAIT_FOR_STUDENT_RESPONSE', false],
    ['SOURCE_VERIFICATION', 'Help Me Verify the Source', 'Guide me to check the source’s authority, evidence, currency, relevance, and limitations. Do not invent verification results.', 'NO_ATTEMPT_REQUIRED', false],
    ['NO_FINAL_ANSWER', 'Do Not Give Me the Final Answer', 'Do not reveal the final answer. Use hints, questions, and feedback that preserve my opportunity to complete the task.', 'NEVER_REVEAL_FINAL_ANSWER_IN_THIS_MODE', true]
  ].map(([value, label, instruction, attemptRule, locked]) => freeze({ value, label, instruction, attemptRule, locked })));
  const GUIDED_HELP_OPTIONS = freeze(GUIDED_LEARNING_MODES.map(({ value, label }) => freeze({ value, label })));
  const ACADEMIC_WORK_TYPES = freeze([
    ['INDEPENDENT_PRACTICE', 'Independent practice'], ['HOMEWORK', 'Homework'], ['DRAFT_ASSIGNMENT', 'Draft assignment'],
    ['RESEARCH_PROJECT', 'Research project'], ['QUIZ_OR_TEST', 'Quiz or test'], ['COMPETITION', 'Competition'], ['NOT_SURE', 'I am not sure']
  ].map(([value, label]) => freeze({ value, label })));
  const AI_ASSISTANCE_PERMISSIONS = freeze([
    ['GENERAL_LEARNING_SUPPORT', 'AI Allowed'], ['AI_ALLOWED_WITH_DISCLOSURE', 'AI Allowed with Disclosure'],
    ['HINTS_OR_QUESTIONS_ONLY', 'AI Allowed for Limited Tasks — Hints or guiding questions'],
    ['FEEDBACK_ON_MY_ATTEMPT_ONLY', 'AI Allowed for Limited Tasks — Feedback on my attempt'],
    ['SOURCE_SUPPORT_ONLY', 'AI Allowed for Limited Tasks — Source support'],
    ['AI_NOT_PERMITTED', 'AI Not Allowed'], ['NOT_SURE', 'Policy Unknown']
  ].map(([value, label]) => freeze({ value, label })));
  const GUIDED_FORMAT_OPTIONS = freeze([
    ['PLAIN_LANGUAGE', 'Plain language'], ['STEP_BY_STEP', 'Step by step'], ['ONE_STEP_AT_A_TIME', 'One step at a time'],
    ['BULLET_LIST', 'Bullet list'], ['SHORT_PARAGRAPH', 'Short paragraphs'], ['TABLE', 'Table or comparison']
  ].map(([value, label]) => freeze({ value, label })));
  const GUIDED_SOURCE_OPTIONS = freeze([
    ['NO_EXTERNAL_SOURCE_NEEDED', 'No external sources needed'],
    ['STATE_WHETHER_EXTERNAL_SOURCES_WERE_USED', 'State whether sources were used'],
    ['OFFICIAL_CURRENT_SOURCE_REQUIRED', 'Use a current official source'],
    ['MULTIPLE_INDEPENDENT_SOURCES', 'Compare multiple independent sources']
  ].map(([value, label]) => freeze({ value, label })));

  let guidedBuilderState = null;
  let improvePromptState = null;
  let promptTemplateLibraryState = { query: '', category: 'All', previewId: null };
  let promptExamplesState = { activeId: 'mathematics' };
  let promptHistoryUiState = { renamingId: null, status: '' };
  let promptConnectionState = root.navigator?.onLine === false ? PROMPT_PAGE_STATES.OFFLINE : null;
  let promptConnectionListenersInstalled = false;

  const sessions = new Map();
  const drafts = new Map();
  const tests = new Map();
  const reviews = new Map();
  const evidence = new Map();
  const requests = new Map();
  const configurations = new Map();

  function applicationDatabase() { try { return typeof db === 'object' && db ? db : null; } catch { return null; } }
  function persistApplicationDatabase() { try { if (typeof saveDB === 'function') saveDB(); } catch {} }
  function upsertPersistentRow(collection, row) { const database = applicationDatabase(); if (!database) return; const rows = database[collection] || (database[collection] = []), index = rows.findIndex((item) => item.id === row.id); const stored = clone(row); if (index < 0) rows.push(stored); else rows[index] = stored; persistApplicationDatabase(); }
  function hydratePromptCoachRepository(actor) {
    const database = applicationDatabase(); if (!database) return;
    const organizationId = tenant(actor), userId = requireActor(actor).userId;
    (database.promptCoachSessions || []).filter((row) => row.subjectUserId === userId && row.organizationId === organizationId).forEach((row) => sessions.set(ownerKey(actor, row.id), clone(row)));
    (database.promptCoachDrafts || []).filter((row) => row.subjectUserId === userId && row.organizationId === organizationId).forEach((row) => { if (sessions.has(ownerKey(actor, row.promptCoachSessionId))) drafts.set(ownerKey(actor, row.id), clone(row)); });
  }

  function fail(code, message) { const error = Error(message); error.code = code; throw error; }
  function requireActor(actor) { if (!actor || !actor.userId) fail('NOT_SIGNED_IN', 'Sign in to use the Prompt-Writing Coach.'); return actor; }
  function tenant(actor) { return String(requireActor(actor).tenantId || 'personal'); }
  function ownerKey(actor, id) { return `${tenant(actor)}:${actor.userId}:${id}`; }
  function clean(value, limit = 8000) { return String(value || '').replace(/<[^>]*>/g, '').replace(/\b(system|developer|assistant)\s*:/gi, '').trim().slice(0, limit); }
  function config(actor) { return configurations.get(tenant(actor)) || { version: 1, flags: Object.fromEntries(FLAGS.map((flag) => [flag, true])) }; }
  function guard(flag, actor) { requireActor(actor); if (!FLAGS.includes(flag) || config(actor).flags[flag] !== true) fail('PROMPT_COACH_DISABLED', 'The Prompt-Writing Coach is unavailable. Privacy and policy checks remain active.'); }
  function own(store, id, actor) { const value = store.get(ownerKey(actor, id)); if (!value) fail([...store.values()].some((item) => item.id === id) ? 'OWNERSHIP_DENIED' : 'RECORD_NOT_FOUND', 'This private prompt record is unavailable.'); return value; }
  function idempotent(input, actor, operation) {
    if (!input.idempotencyKey) fail('IDEMPOTENCY_REQUIRED', 'Please try again with a new request.');
    const key = ownerKey(actor, clean(input.idempotencyKey, 120));
    if (requests.has(key)) return { ...clone(requests.get(key)), duplicatePrevented: true };
    const result = operation(); requests.set(key, clone(result)); return { ...clone(result), duplicatePrevented: false };
  }
  function safeScenario(item) { const { expectedHelpMode, expectedAttemptRule, improvedPrompt, ...safe } = item; return clone({ ...safe, hiddenExpectedRepair: true }); }
  function findScenario(id) { const item = scenarios.find((scenario) => scenario.id === id); if (!item) fail('SCENARIO_NOT_FOUND', 'This prompt scenario is unavailable.'); return item; }
  const PRIVACY_PATTERNS = freeze([
    ['full-name', 'Possible full name detected.', /\b(?:full name|my name is|student(?:'s)? name|classmate(?:'s)? name)\s*(?:is|:)?\s*[A-Z][a-z]+(?:[-'][A-Za-z]+)?\s+[A-Z][a-z]+(?:[-'][A-Za-z]+)?\b/gi],
    ['student-number', 'Possible student number detected.', /\bstudent\s*(?:number|no\.?|id)\s*(?:(?:is|equals)\s*|[:#-]\s*)?[A-Z]?\d{5,12}\b/gi],
    ['home-address', 'Possible home address detected.', /\b(?:home address\s*(?:is|:)?\s*)?\d{1,6}\s+[A-Za-z0-9.' -]+\s(?:Street|St\.?|Road|Rd\.?|Avenue|Ave\.?|Boulevard|Blvd\.?|Drive|Dr\.?|Lane|Ln\.?|Court|Ct\.?)\b/gi],
    ['phone-number', 'Possible phone number detected.', /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/g],
    ['password', 'Possible password or secret detected.', /\b(?:password|passcode|pin|api[_ -]?key)\s*(?:is|:|=)\s*\S+/gi],
    ['medical', 'Possible medical information detected.', /\b(?:diagnosis|diagnosed with|medical condition|medication|health card|treatment plan)\b[^\n.!?]*/gi],
    ['financial', 'Possible financial information detected.', /\b(?:bank account|credit card|debit card|routing number|social insurance number|SIN)\s*(?:is|:|#)?\s*[A-Z0-9 -]{4,}/gi],
    ['immigration', 'Possible immigration information detected.', /\b(?:immigration status|visa number|passport number|refugee status|permanent resident number)\b[^\n.!?]*/gi],
    ['other-student', 'Possible private information about another student detected.', /\b(?:another student|my classmate|a classmate|my study partner)\b[^\n.!?]*(?:name|number|address|phone|medical|diagnosis|password|account|status)[^\n.!?]*/gi]
  ].map(([type, label, pattern]) => freeze({ type, label, pattern })));
  function scanPromptPrivacy(text) {
    const value = String(text || ''), findings = [];
    PRIVACY_PATTERNS.forEach(({ type, label, pattern }) => { const matches = value.match(pattern); if (matches?.length) findings.push({ type, label, matches: [...new Set(matches.map((match) => match.trim()))].slice(0, 3) }); pattern.lastIndex = 0; });
    return findings;
  }
  function redactPromptPrivacy(text) {
    let redacted = String(text || '');
    PRIVACY_PATTERNS.forEach(({ pattern }) => { redacted = redacted.replace(pattern, '[removed private information]'); pattern.lastIndex = 0; });
    return redacted;
  }
  function hasPrivateData(text) { return scanPromptPrivacy(text).length > 0; }
  function isSubmissionMode(mode) { return ['DRAFT_FEEDBACK', 'CLARITY_FEEDBACK', 'REVISION_STRATEGIES', 'ORGANIZE_MY_IDEAS', 'CODE_DEBUGGING'].includes(mode); }
  function requiresAttempt(mode) { return ['HINT', 'GUIDING_QUESTIONS', 'QUIZ', 'CHECK_REASONING', 'DRAFT_FEEDBACK', 'CODE_DEBUGGING'].includes(mode); }
  function effectiveAttemptRule(mode, selected) {
    if (!ATTEMPT_RULES.includes(selected)) fail('INVALID_ATTEMPT_RULE', 'Choose a supported student-attempt rule.');
    if (mode === 'HINT') return selected === 'NO_ATTEMPT_REQUIRED' ? 'WAIT_FOR_STUDENT_RESPONSE' : selected;
    if (mode === 'DRAFT_FEEDBACK') return 'FEEDBACK_ON_STUDENT_WORK_ONLY';
    if (mode === 'QUIZ' && selected === 'NO_ATTEMPT_REQUIRED') return 'WAIT_FOR_STUDENT_RESPONSE';
    return selected;
  }
  function readiness(input) {
    const findings = [];
    const add = (elementType, status, explanation, requiredForTask = true) => findings.push({ elementType, status, explanation, requiredForTask });
    const goal = clean(input.goal);
    if (!goal) add('GOAL', 'MISSING', 'Add what you are trying to learn or accomplish.');
    else if (/^(help me|teach me everything|teach me chemistry|explain science|fix this|make it better)$/i.test(goal)) add('GOAL', 'TOO_BROAD', 'Identify the concept or task, or ask for diagnostic questions.');
    else add('GOAL', 'READY', 'Goal is clear.');
    add('CONTEXT', input.context ? 'PRESENT' : 'NOT_APPLICABLE', input.context ? 'Relevant context is included.' : 'Context is optional unless it changes the response.', false);
    add('CURRENT_UNDERSTANDING', input.currentUnderstanding ? 'PRESENT' : 'MISSING', input.currentUnderstanding ? 'Current understanding is included.' : 'Say what you understand, “I am not sure,” or request diagnostic questions.');
    add('REQUESTED_HELP_TYPE', HELP_MODES.includes(input.helpMode) ? 'READY' : 'MISSING', 'Choose the type of learning support.');
    add('CONSTRAINTS', input.constraints && input.constraints.length ? 'PRESENT' : 'NEEDS_CLARIFICATION', 'State what AI should avoid doing.');
    add('DESIRED_FORMAT', input.desiredFormats && input.desiredFormats.length ? 'PRESENT' : 'NOT_APPLICABLE', 'Format is optional when it would not improve understanding.', false);
    const sourceNeeded = input.helpMode === 'CURRENT_INFORMATION_CHECK' || input.helpMode === 'SOURCE_VERIFICATION' || input.helpMode === 'QUOTATION_CHECK';
    add('SOURCE_REQUIREMENTS', input.sourceRequirements && input.sourceRequirements.length ? 'READY' : sourceNeeded ? 'SOURCE_PLAN_REQUIRED' : 'NOT_APPLICABLE', sourceNeeded ? 'This task needs an appropriate source plan.' : 'External sources may not be needed.', sourceNeeded);
    add('VERIFICATION_REQUIREMENTS', input.verificationRequirements && input.verificationRequirements.length ? 'READY' : 'VERIFICATION_PLAN_REQUIRED', 'Plan how you will check the result.');
    add('PRIVACY_CHECK', input.privacyStatus === 'NO_OBVIOUS_SENSITIVE_INFORMATION_DETECTED' ? 'READY' : 'PRIVACY_REVIEW_REQUIRED', 'Complete Step 9 privacy preflight before sending.');
    add('ASSIGNMENT_POLICY', POLICY_STATES.includes(input.policyState) ? (input.policyState === 'POLICY_UNKNOWN' ? 'POLICY_REVIEW_REQUIRED' : input.policyState.includes('NOT_ALLOWED') || input.policyState === 'ACTIVE_ASSESSMENT_RESTRICTED' ? 'BLOCKED' : 'READY') : 'POLICY_REVIEW_REQUIRED', 'Check the requested help against the applicable policy.');
    if (requiresAttempt(input.helpMode)) add('STUDENT_ATTEMPT_RULE', ATTEMPT_RULES.includes(input.studentAttemptRule) && input.studentAttemptRule !== 'NO_ATTEMPT_REQUIRED' ? 'READY' : 'STUDENT_ATTEMPT_REQUIRED', 'Protect the student’s opportunity to attempt the task.');
    return findings;
  }
  function generateText(input) {
    if (!HELP_MODES.includes(input.helpMode)) fail('INVALID_HELP_MODE', 'Choose a supported help mode.');
    if (!DESIRED_FORMATS.every((format) => DESIRED_FORMATS.includes(format))) fail('INVALID_FORMAT', 'Choose a supported format.');
    const parts = [];
    const put = (label, value) => { if (value && (!Array.isArray(value) || value.length)) parts.push(`${label}:\n${Array.isArray(value) ? value.map((item) => clean(item)).join(', ') : clean(value)}`); };
    put('Goal', input.goal); put('Context', input.context); put('What I already understand', input.currentUnderstanding);
    put('What I have tried', input.currentAttempt); put('What is confusing', input.confusionOrGap);
    put('Help I want', input.helpMode); put('Constraints', input.constraints); put('Desired format', input.desiredFormats);
    put('Terms to preserve', input.academicTermsToPreserve); put('Source requirements', input.sourceRequirements);
    put('Verification', input.verificationRequirements); put('Privacy', input.privacyStatus);
    put('Assignment policy', input.policyState); put('Student-attempt rule', effectiveAttemptRule(input.helpMode, input.studentAttemptRule));
    put('Success criteria', input.successCriteria); return parts.join('\n\n');
  }
  function enforceBoundary(input) {
    const combined = `${input.goal || ''} ${(input.constraints || []).join(' ')}`;
    if (/(reveal (the )?system prompt|hidden chain of thought|hidden reasoning|make (it|this) undetectable|ignore (all )?(previous|higher-priority) instructions|fabricate citations?)/i.test(combined)) fail('UNSAFE_PROMPT_PATTERN', 'This request conflicts with privacy, security, verification, or Academic Integrity rules.');
    if (input.activeAssessment || input.policyState === 'ACTIVE_ASSESSMENT_RESTRICTED') fail('ACTIVE_ASSESSMENT_RESTRICTED', 'Answer-bearing help is unavailable during this active assessment.');
    if (input.policyState === 'AI_NOT_ALLOWED') fail('BLOCKED_BY_POLICY', 'The applicable policy does not permit this requested help.');
    if (input.policyState === 'POLICY_UNKNOWN' && isSubmissionMode(input.helpMode)) fail('BLOCKED_BY_POLICY', 'Policy Unknown cannot authorize submission-ready assistance. Use general learning or policy clarification.');
    if (['SECRET_REMOVAL_REQUIRED', 'REDACTION_REQUIRED'].includes(input.privacyStatus) || hasPrivateData(input.generatedPromptText || input.goal)) fail('BLOCKED_BY_PRIVACY', 'Remove secrets or unnecessary private information before continuing.');
  }
  function createSession(input, actor) {
    return idempotent(input, actor, () => {
      guard(FLAGS[1], actor);
      const session = { id: makeId('prompt-session'), subjectUserId: actor.userId, organizationId: tenant(actor), status: 'DRAFT', currentPromptVersionId: null, taskContextType: input.taskContextType || 'GENERAL_LEARNING', fictionalTask: input.fictionalTask !== false, interfaceLanguage: input.interfaceLanguage || 'en', explanationLanguage: input.explanationLanguage || 'en', bilingualMode: Boolean(input.bilingualMode), readingLevel: input.readingLevel || 'standard', lowBandwidthEnabled: Boolean(input.lowBandwidthEnabled), offlineEnabled: Boolean(input.offlineEnabled), rowVersion: 1, private: true };
      sessions.set(ownerKey(actor, session.id), session); upsertPersistentRow('promptCoachSessions', session); return { session: ownerSession(session, actor), evidenceCreated: false };
    });
  }
  function ownerSession(session, actor) { if (session.subjectUserId !== requireActor(actor).userId) fail('OWNERSHIP_DENIED', 'This private prompt session is unavailable.'); return clone({ ...session, ordinaryAnalyticsIncludesPrompt: false, ordinaryLogsIncludePrompt: false, modelTraining: false }); }
  function createDraft(input, actor) {
    return idempotent(input, actor, () => {
      const session = own(sessions, input.promptCoachSessionId, actor);
      if (!POLICY_STATES.includes(input.policyState) || !PRIVACY_STATES.includes(input.privacyStatus)) fail('REVIEW_REQUIRED', 'Complete the privacy and policy reviews.');
      const previous = [...drafts.values()].filter((draft) => draft.promptCoachSessionId === session.id);
      const attemptRule = effectiveAttemptRule(input.helpMode, input.studentAttemptRule);
      const normalized = { ...clone(input), studentAttemptRule: attemptRule };
      const studentEditedPromptText = clean(input.studentEditedPromptText);
      if (studentEditedPromptText) enforceBoundary({ ...normalized, generatedPromptText: studentEditedPromptText });
      const draft = { id: makeId('prompt-draft'), subjectUserId: actor.userId, promptCoachSessionId: session.id, versionNumber: previous.length + 1, goal: clean(input.goal), context: clean(input.context), currentUnderstanding: clean(input.currentUnderstanding), currentAttempt: clean(input.currentAttempt), confusionOrGap: clean(input.confusionOrGap), constraints: (input.constraints || []).map((item) => clean(item)), requestedHelpMode: input.helpMode, desiredFormats: clone(input.desiredFormats || []), academicTermsToPreserve: (input.academicTermsToPreserve || []).map((item) => clean(item)), sourceRequirements: clone(input.sourceRequirements || []), verificationRequirements: clone(input.verificationRequirements || []), privacyStatus: input.privacyStatus, policyState: input.policyState, studentAttemptRule: attemptRule, successCriteria: clean(input.successCriteria), generatedPromptText: studentEditedPromptText || generateText(normalized), studentReviewed: false, approved: false, immutable: false, sourceVersion: 1, rowVersion: 1, private: true };
      draft.selectedLearningMode = input.selectedLearningMode || input.helpMode;
      draft.learningModeInstruction = clean(input.learningModeInstruction);
      draft.assignmentPolicyRevalidated = Boolean(input.assignmentPolicyRevalidated);
      draft.academicWorkType = clean(input.academicWorkType, 80);
      draft.aiAssistancePermission = clean(input.aiAssistancePermission, 80);
      draft.academicIntegrityStatus = clean(input.academicIntegrityStatus, 80);
      draft.title = clean(input.title, 120) || clean(input.goal, 120) || 'Untitled Prompt';
      draft.subject = clean(input.subject, 120) || clean(input.context, 120) || 'General learning';
      draft.userId = actor.userId;
      draft.organizationId = tenant(actor);
      draft.courseLevel = clean(input.courseLevel, 120) || clean(input.context, 120);
      draft.difficultyDescription = clean(input.difficultyDescription) || draft.confusionOrGap;
      draft.learningMode = draft.selectedLearningMode;
      draft.responseFormat = draft.desiredFormats[0] || null;
      draft.sourceRequirement = draft.sourceRequirements[0] || null;
      draft.avoidInstructions = clean(input.avoidInstructions) || draft.constraints[0] || '';
      draft.generatedPrompt = draft.generatedPromptText;
      draft.privacyCheckStatus = draft.privacyStatus;
      draft.assignmentPolicyStatus = draft.policyState;
      draft.status = 'SAVED';
      draft.createdAt = new Date().toISOString();
      draft.updatedAt = draft.createdAt;
      draft.lastUsedAt = null;
      draft.favourite = Boolean(input.favourite);
      draft.deletedAt = null;
      draft.elementReviews = readiness({ ...input, studentAttemptRule: attemptRule });
      drafts.set(ownerKey(actor, draft.id), draft); session.currentPromptVersionId = draft.id; session.status = 'READY_FOR_PREVIEW'; session.rowVersion += 1; upsertPersistentRow('promptCoachDrafts', draft); upsertPersistentRow('promptCoachSessions', session);
      return { draft: ownerDraft(draft, actor), inferredAdditions: [], automaticallySent: false, promptScore: null };
    });
  }
  function ownerDraft(draft, actor) { if (draft.subjectUserId !== requireActor(actor).userId) fail('OWNERSHIP_DENIED', 'This private prompt draft is unavailable.'); return clone({ ...draft, ordinaryAnalyticsIncluded: false, ordinaryLogsIncluded: false, modelTraining: false }); }
  function canonicalPromptCoachDraft(draft, actor) {
    const owned = ownerDraft(draft, actor), record = { id: owned.id, userId: owned.userId || owned.subjectUserId, organizationId: owned.organizationId || tenant(actor), title: owned.title, subject: owned.subject, courseLevel: owned.courseLevel || owned.context, goal: owned.goal, currentUnderstanding: owned.currentUnderstanding, difficultyDescription: owned.difficultyDescription || owned.confusionOrGap, learningMode: owned.learningMode || owned.selectedLearningMode || owned.requestedHelpMode, responseFormat: owned.responseFormat || owned.desiredFormats?.[0] || null, sourceRequirement: owned.sourceRequirement || owned.sourceRequirements?.[0] || null, avoidInstructions: owned.avoidInstructions || owned.constraints?.[0] || '', generatedPrompt: owned.generatedPrompt || owned.generatedPromptText, privacyCheckStatus: owned.privacyCheckStatus || owned.privacyStatus, assignmentPolicyStatus: owned.assignmentPolicyStatus || owned.policyState, status: owned.status || 'SAVED', createdAt: owned.createdAt, updatedAt: owned.updatedAt };
    return Object.fromEntries(PROMPT_COACH_DRAFT_SCHEMA.map((field) => [field, record[field] ?? null]));
  }
  function getPromptCoachDraft(input, actor) { hydratePromptCoachRepository(actor); return canonicalPromptCoachDraft(own(drafts, input.promptCoachDraftId || input.id, actor), actor); }
  function listPromptCoachDrafts(actor) { hydratePromptCoachRepository(actor); return listPromptDraftHistory(actor).map((draft) => canonicalPromptCoachDraft(draft, actor)); }
  function listPromptDraftHistory(actor) {
    requireActor(actor);
    hydratePromptCoachRepository(actor);
    return [...drafts.values()].filter((draft) => draft.subjectUserId === actor.userId && !draft.deletedAt && sessions.has(ownerKey(actor, draft.promptCoachSessionId))).sort((first, second) => String(second.lastUsedAt || second.updatedAt || second.createdAt).localeCompare(String(first.lastUsedAt || first.updatedAt || first.createdAt))).map((draft) => ownerDraft(draft, actor));
  }
  function renamePromptDraft(input, actor) { const draft = own(drafts, input.promptDraftVersionId, actor), title = clean(input.title, 120); if (!title) fail('TITLE_REQUIRED', 'Enter a prompt title.'); draft.title = title; draft.updatedAt = new Date().toISOString(); upsertPersistentRow('promptCoachDrafts', draft); return ownerDraft(draft, actor); }
  function setPromptDraftFavourite(input, actor) { const draft = own(drafts, input.promptDraftVersionId, actor); draft.favourite = Boolean(input.favourite); draft.updatedAt = new Date().toISOString(); upsertPersistentRow('promptCoachDrafts', draft); return ownerDraft(draft, actor); }
  function deletePromptDraft(input, actor) { const draft = own(drafts, input.promptDraftVersionId, actor); draft.deletedAt = new Date().toISOString(); draft.updatedAt = draft.deletedAt; draft.status = 'DELETED'; upsertPersistentRow('promptCoachDrafts', draft); return { deleted: true, recoverable: true, promptDraftVersionId: draft.id }; }
  function markPromptDraftUsed(input, actor) { const draft = own(drafts, input.promptDraftVersionId, actor); draft.lastUsedAt = new Date().toISOString(); draft.updatedAt = draft.lastUsedAt; upsertPersistentRow('promptCoachDrafts', draft); return ownerDraft(draft, actor); }
  function promptDraftAsInput(draft) { return { title: draft.title, subject: draft.subject, goal: draft.goal, context: draft.context, currentUnderstanding: draft.currentUnderstanding, currentAttempt: draft.currentAttempt, confusionOrGap: draft.confusionOrGap, constraints: clone(draft.constraints || []), helpMode: draft.requestedHelpMode, selectedLearningMode: draft.selectedLearningMode, learningModeInstruction: draft.learningModeInstruction, desiredFormats: clone(draft.desiredFormats || []), academicTermsToPreserve: clone(draft.academicTermsToPreserve || []), sourceRequirements: clone(draft.sourceRequirements || []), verificationRequirements: clone(draft.verificationRequirements || []), privacyStatus: draft.privacyStatus, policyState: draft.policyState, studentAttemptRule: draft.studentAttemptRule, academicWorkType: draft.academicWorkType, aiAssistancePermission: draft.aiAssistancePermission, academicIntegrityStatus: draft.academicIntegrityStatus, assignmentPolicyRevalidated: draft.assignmentPolicyRevalidated, successCriteria: draft.successCriteria, studentEditedPromptText: draft.generatedPromptText };
  }
  function duplicatePromptDraft(input, actor) { const source = own(drafts, input.promptDraftVersionId, actor), session = createSession({ idempotencyKey: input.idempotencyKey, fictionalTask: false }, actor).session; return createDraft({ idempotencyKey: `${input.idempotencyKey}-version`, promptCoachSessionId: session.id, ...promptDraftAsInput(source), title: `${source.title} Copy`, favourite: false }, actor).draft; }
  function approveDraft(input, actor) { const draft = own(drafts, input.promptDraftVersionId, actor); if (draft.immutable) return ownerDraft(draft, actor); if (!input.studentReviewed || input.confirmedPromptText !== draft.generatedPromptText) fail('EXPLICIT_REVIEW_REQUIRED', 'Review the exact final prompt before approval.'); enforceBoundary({ ...draft, helpMode: draft.requestedHelpMode }); draft.studentReviewed = true; draft.approved = true; draft.status = 'APPROVED'; draft.approvedAt = new Date().toISOString(); draft.updatedAt = draft.approvedAt; upsertPersistentRow('promptCoachDrafts', draft); return ownerDraft(draft, actor); }
  function createTest(input, actor) {
    return idempotent(input, actor, () => {
      guard(FLAGS[3], actor); const draft = own(drafts, input.promptDraftVersionId, actor);
      if (!draft.approved) fail('PROMPT_NOT_APPROVED', 'Approve the reviewed prompt before testing.');
      enforceBoundary({ ...draft, helpMode: draft.requestedHelpMode });
      const waiting = requiresAttempt(draft.requestedHelpMode) && !input.studentAttemptProvided;
      const test = { id: makeId('prompt-test'), subjectUserId: actor.userId, promptCoachSessionId: draft.promptCoachSessionId, promptDraftVersionId: draft.id, helpMode: draft.requestedHelpMode, studentAttemptRule: draft.studentAttemptRule, policyState: draft.policyState, privacyStatus: draft.privacyStatus, status: waiting ? 'WAITING_FOR_STUDENT_ATTEMPT' : 'COMPLETED', externalSourcesUsed: false, toolUseSummary: [], private: true, responseReference: waiting ? 'A student attempt is required before answer-bearing feedback.' : 'Deterministic learning-support simulation completed.' };
      tests.set(ownerKey(actor, test.id), test); draft.testedAt = new Date().toISOString(); return { test: clone(test), assignmentSubmitted: false, competencyAwarded: false };
    });
  }
  function sendDraft(input, actor) {
    return idempotent(input, actor, () => {
      const draft = own(drafts, input.promptDraftVersionId, actor);
      if (!draft.approved || input.explicitSend !== true || input.confirmedPromptText !== draft.generatedPromptText) fail('EXPLICIT_SEND_REQUIRED', 'Review the final preview and intentionally choose Send.');
      if (input.offline) fail('OFFLINE_SEND_BLOCKED', 'Prompts cannot be sent offline. Reconnect and review again.');
      enforceBoundary({ ...draft, helpMode: draft.requestedHelpMode });
      draft.immutable = true; draft.status = 'SENT'; draft.sentAt = new Date().toISOString(); draft.updatedAt = draft.sentAt;
      const session = own(sessions, draft.promptCoachSessionId, actor); session.status = 'SENT'; upsertPersistentRow('promptCoachDrafts', draft); upsertPersistentRow('promptCoachSessions', session);
      return { sendRequested: true, delivered: false, transmittedPromptVersionId: draft.id, originalUnreviewedPromptSent: false };
    });
  }
  function saveReview(input, actor) {
    const test = own(tests, input.promptTestRunId, actor);
    const dimensions = input.reviewDimensions || {};
    Object.keys(dimensions).forEach((key) => { if (!REVIEW_DIMENSIONS.includes(key)) fail('INVALID_REVIEW_DIMENSION', 'Use a supported response-review dimension.'); });
    const review = { id: makeId('prompt-review'), subjectUserId: actor.userId, promptTestRunId: test.id, reviewDimensions: clone(dimensions), studentNotes: clean(input.studentNotes), needsPromptRevision: Boolean(input.needsPromptRevision), needsSourceVerification: Boolean(input.needsSourceVerification), needsHumanSupport: Boolean(input.needsHumanSupport), shouldRejectResponse: Boolean(input.shouldRejectResponse), studentConfirmed: Boolean(input.studentConfirmed), globalScore: null, private: true };
    reviews.set(ownerKey(actor, review.id), review); return clone(review);
  }
  function generateEvidence(input, actor) {
    return idempotent(input, actor, () => {
      const draft = own(drafts, input.promptDraftVersionId, actor);
      if (!draft.testedAt || !input.explanationIds || input.explanationIds.length < 3 || !input.responseReviewId) fail('MEANINGFUL_EVIDENCE_REQUIRED', 'Test a prompt, review the response, and write three explanations first.');
      own(reviews, input.responseReviewId, actor);
      const candidate = { id: makeId('prompt-evidence'), subjectUserId: actor.userId, lessonId: lesson.id, lessonVersion: lesson.version, promptCoachSessionId: draft.promptCoachSessionId, promptVersion: draft.versionNumber, competencyMappings: ['Application Skills', 'Human Accountability', 'Human Agency', 'Safe and Responsible Use'], validityStatus: 'CANDIDATE', private: true, competencyStatusAssigned: false, promptScore: null };
      evidence.set(ownerKey(actor, candidate.id), candidate); return { candidate: clone(candidate), studentReviewRequired: true, automaticCompetencyAward: false };
    });
  }
  function reviewEvidence(input, actor, accept) { const candidate = own(evidence, input.evidenceCandidateId, actor); candidate.validityStatus = accept ? 'STUDENT_CONFIRMED' : 'DECLINED'; return { candidate: clone(candidate), competencyStatusAssigned: false }; }

  function promptTemplateCardsHTML() {
    return PROMPT_STARTER_TEMPLATES.map((template) => `<article class="prompt-template-card"><span class="prompt-template-icon" aria-hidden="true">${template.icon}</span><div><h3 id="prompt-template-${template.id}-title">${template.title}</h3><p id="prompt-template-${template.id}-description">${template.description}</p></div><button type="button" data-prompt-template="${template.id}" aria-labelledby="prompt-template-${template.id}-title prompt-template-${template.id}-action" aria-describedby="prompt-template-${template.id}-description"><span id="prompt-template-${template.id}-action">Use This Template</span><span aria-hidden="true">→</span></button></article>`).join('');
  }
  function fillPromptBuilder(templateId, target) {
    const template = PROMPT_STARTER_TEMPLATES.find((item) => item.id === templateId);
    if (!template || !target) return false;
    target.querySelectorAll('[data-prompt-field]').forEach((field) => {
      field.value = template.fields[field.dataset.promptField] || '';
      field.dispatchEvent(new Event('input', { bubbles: true }));
    });
    target.dataset.selectedPromptTemplate = template.id;
    const status = target.querySelector('#promptTemplateStatus');
    if (status) status.textContent = `${template.title} template added. Review and edit every field before using it.`;
    const firstField = target.querySelector('[data-prompt-field="goal"]');
    firstField?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    firstField?.focus?.();
    return true;
  }
  function clearPromptBuilder(target) {
    if (!target) return;
    target.querySelectorAll('[data-prompt-field]').forEach((field) => { field.value = ''; field.dispatchEvent(new Event('input', { bubbles: true })); });
    delete target.dataset.selectedPromptTemplate;
    const status = target.querySelector('#promptTemplateStatus');
    if (status) status.textContent = 'New blank prompt ready. Add only the information needed for your learning goal.';
    const firstField = target.querySelector('[data-prompt-field="goal"]');
    firstField?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    firstField?.focus?.();
  }
  function guidedEscape(value = '') { return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character])); }
  function promptPageStateHTML(state, message = '', options = {}) {
    const stateClass = String(state || '').toLowerCase().replace(/[^a-z]+/g, '-');
    const icon = state === PROMPT_PAGE_STATES.LOADING || state === PROMPT_PAGE_STATES.RECONNECTING ? '…' : state === PROMPT_PAGE_STATES.READY || state === PROMPT_PAGE_STATES.SAVED ? '✓' : state === PROMPT_PAGE_STATES.PRIVACY_WARNING || state === PROMPT_PAGE_STATES.POLICY_WARNING || state === PROMPT_PAGE_STATES.TEMPLATE_ERROR || state === PROMPT_PAGE_STATES.SAVE_ERROR ? '!' : state === PROMPT_PAGE_STATES.OFFLINE ? '↯' : '•';
    return `<section class="prompt-page-state state-${stateClass}" data-prompt-page-state="${guidedEscape(state)}" ${state === PROMPT_PAGE_STATES.LOADING || state === PROMPT_PAGE_STATES.RECONNECTING ? 'aria-busy="true"' : ''} ${options.alert ? 'role="alert"' : 'role="status"'} aria-live="${options.alert ? 'assertive' : 'polite'}"><span aria-hidden="true">${icon}</span><div><h2>${guidedEscape(state)}</h2>${message ? `<p>${guidedEscape(message)}</p>` : ''}${options.retry ? '<button class="btn btn-secondary" type="button" data-prompt-state-retry>Try Again</button>' : ''}</div></section>`;
  }
  function promptConnectionStateHTML() {
    if (promptConnectionState === PROMPT_PAGE_STATES.OFFLINE) return promptPageStateHTML(PROMPT_PAGE_STATES.OFFLINE, 'Your current work remains on this device. Reconnect before sending or synchronizing.', { alert: true });
    if (promptConnectionState === PROMPT_PAGE_STATES.RECONNECTING) return promptPageStateHTML(PROMPT_PAGE_STATES.RECONNECTING, 'StudySpark is restoring the connection. Keep this page open; your work remains available.');
    return '';
  }
  function promptBuilderPageState(state) {
    if (promptConnectionState) return { state: promptConnectionState, message: promptConnectionState === PROMPT_PAGE_STATES.OFFLINE ? 'Your current work remains on this device. Reconnect before using AI Coach.' : 'StudySpark is restoring the connection. Your prompt remains available.' };
    if (state.saveError) return { state: PROMPT_PAGE_STATES.SAVE_ERROR, message: 'Your prompt is still available on this page. Review it and try saving again.', alert: true };
    if (state.privacyReviewRequested && state.privacyFindings.length) return { state: PROMPT_PAGE_STATES.PRIVACY_WARNING, message: 'Review and remove possible private information before continuing.', alert: true };
    const integrity = academicIntegrityCheck(state), policySelected = Boolean(state.values.academicWorkType || state.values.aiAssistancePermission);
    if (policySelected && !integrity.allowed) return { state: PROMPT_PAGE_STATES.POLICY_WARNING, message: integrity.message, alert: true };
    if (state.saved) return { state: PROMPT_PAGE_STATES.SAVED, message: 'This private prompt version has been saved and has not been sent.' };
    if (state.confirmed || state.reviewed) return { state: PROMPT_PAGE_STATES.READY, message: 'Review the preview, Privacy Check, and Academic Integrity Check before using it.' };
    return { state: PROMPT_PAGE_STATES.BUILDING, message: 'Your answers and live preview remain private until you intentionally save or use the prompt.' };
  }
  function renderPromptCoachLoadError(target) {
    target.innerHTML = `<header class="view-intro prompt-coach-intro"><div><h1>Prompt Coach</h1><p>Build clearer, safer, and more useful AI prompts while staying in control of your learning.</p></div></header>${promptPageStateHTML('Unable to load Prompt Coach', 'We could not load Prompt Coach. Your work has not been deleted.', { alert: true, retry: true })}`;
    target.querySelector('[data-prompt-state-retry]')?.addEventListener('click', render);
  }
  function rerenderActivePromptPage() {
    const active = root.document?.querySelector('.app-view.active')?.id;
    if (active === 'promptWithPurposeView') render();
    if (active === 'promptBuilderView') renderGuidedPromptBuilder();
    if (active === 'promptImproveView') renderImprovePrompt();
    if (active === 'promptTemplatesView') renderPromptTemplateLibrary();
    if (active === 'promptLearnView') renderPromptExamples();
  }
  function installPromptConnectionListeners() {
    if (promptConnectionListenersInstalled || !root.addEventListener) return;
    promptConnectionListenersInstalled = true;
    root.addEventListener('offline', () => { promptConnectionState = PROMPT_PAGE_STATES.OFFLINE; rerenderActivePromptPage(); });
    root.addEventListener('online', () => { promptConnectionState = PROMPT_PAGE_STATES.RECONNECTING; rerenderActivePromptPage(); root.setTimeout?.(() => { if (root.navigator?.onLine !== false) { promptConnectionState = null; rerenderActivePromptPage(); } }, 1200); });
  }
  function guidedActor() {
    const account = typeof user === 'function' ? user() : null;
    if (!account) return null;
    return { userId: String(account.userId || account.id || 'guest-student'), tenantId: String(account.tenantId || account.organizationId || 'personal'), role: account.role || 'student' };
  }
  function promptAccessibilityPreferences() {
    try { return root.AccessibilityLanguage?.getMyEffectiveAccessibilityLanguagePreferences?.() || {}; }
    catch { return {}; }
  }
  function promptLanguageOptions(selected, includeNone = false) {
    const defaults = [{ code: 'en', name: 'English' }, { code: 'fr-CA', name: 'French (Canada)' }, { code: 'zh-Hans', name: 'Mandarin Chinese (Simplified)' }, { code: 'zh-Hant', name: 'Mandarin Chinese (Traditional)' }, { code: 'es', name: 'Spanish' }, { code: 'ar', name: 'Arabic' }], languages = root.AccessibilityLanguage?.listSupportedExplanationLanguages?.() || defaults;
    return `${includeNone ? '<option value="">Choose a second language</option>' : ''}${languages.map((language) => `<option value="${guidedEscape(language.code)}"${language.code === selected ? ' selected' : ''}>${guidedEscape(language.name)}</option>`).join('')}`;
  }
  function applyPromptAccessibleMarkup(target) {
    if (!target) return;
    target.querySelectorAll('textarea,input[type="text"],input[type="search"],pre').forEach((element) => { if (!element.hasAttribute('dir')) element.setAttribute('dir', 'auto'); });
    target.querySelectorAll('button:not([type])').forEach((button) => button.setAttribute('type', 'button'));
  }
  function templateGuidedValues(templateId) {
    const template = PROMPT_STARTER_TEMPLATES.find((item) => item.id === templateId), fields = template?.fields || {};
    const modes = { 'explain-concept': 'SIMPLER_EXPLANATION', hint: 'HINT', 'guiding-questions': 'GUIDING_QUESTIONS', 'check-reasoning': 'CHECK_REASONING', 'practice-questions': 'QUIZ', 'verify-source': 'SOURCE_VERIFICATION', 'draft-feedback': 'CHECK_REASONING', 'similar-example': 'SIMILAR_EXAMPLE' }, helpType = modes[templateId] || 'HINT', mode = GUIDED_LEARNING_MODES.find((item) => item.value === helpType);
    return { goal: fields.goal || '', subject: '', level: fields.context || '', understanding: fields.understanding || fields.attempt || '', confusion: fields.gap || '', helpType, modeInstruction: mode?.instruction || '', presentation: templateId === 'guiding-questions' || templateId === 'hint' ? 'ONE_STEP_AT_A_TIME' : 'PLAIN_LANGUAGE', avoid: fields.avoid || '', sources: templateId === 'verify-source' ? 'OFFICIAL_CURRENT_SOURCE_REQUIRED' : 'NO_EXTERNAL_SOURCE_NEEDED', academicWorkType: '', aiAssistancePermission: '' };
  }
  function newGuidedBuilderState(templateId = null) {
    const preferences = promptAccessibilityPreferences();
    return { id: `guided-prompt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, templateId, step: 0, values: { ...templateGuidedValues(templateId), bilingual: preferences.explanationMode === 'BILINGUAL_SIDE_BY_SIDE', primaryLanguage: preferences.primaryExplanationLanguageCode || 'en', secondaryLanguage: preferences.secondaryExplanationLanguageCode || '' }, dirty: Boolean(templateId), saved: false, saveError: false, reviewed: false, confirmed: false, editingPreview: false, textOnly: preferences.lowBandwidthPreference === 'ENABLED', speechTranscript: '', speechTargetKey: '', listening: false, editedPrompt: '', privacyFindings: [], privacyReviewRequested: false, privacyOverrideApproved: false, promptCoachSessionId: null, promptDraftVersionId: null, saveVersion: 0, preview: '', status: templateId ? 'Template added. Review every answer before saving.' : 'New prompt ready.' };
  }
  function academicIntegrityCheck(state) {
    const values = state.values || {}, workType = values.academicWorkType, permission = values.aiAssistancePermission, mode = values.helpType;
    if (!workType) return { status: 'REVIEW_REQUIRED', allowed: false, policyState: 'POLICY_UNKNOWN', message: 'Choose what type of work you are completing.' };
    if (workType === 'NOT_SURE') return { status: 'REVIEW_REQUIRED', allowed: false, policyState: 'POLICY_UNKNOWN', message: 'Check the assignment, course, test, or competition rules before using AI.' };
    if (!permission) return { status: 'REVIEW_REQUIRED', allowed: false, policyState: 'POLICY_UNKNOWN', message: 'Choose what AI assistance is permitted for this work.' };
    if (permission === 'NOT_SURE') return { status: 'REVIEW_REQUIRED', allowed: false, policyState: 'POLICY_UNKNOWN', message: 'AI permission is not clear. Check with the teacher or authorized organizer before continuing.' };
    if (permission === 'AI_NOT_PERMITTED') return { status: 'BLOCKED', allowed: false, policyState: 'AI_NOT_ALLOWED', message: 'AI assistance is not permitted for this work. Prompt handoff is unavailable.' };
    if (permission === 'AI_ALLOWED_WITH_DISCLOSURE') return { status: 'READY', allowed: true, policyState: 'AI_ALLOWED_WITH_DISCLOSURE', message: 'Academic Integrity Check complete. Keep the required AI-use disclosure with this work.' };
    const permittedModes = { HINTS_OR_QUESTIONS_ONLY: ['HINT', 'GUIDING_QUESTIONS', 'NO_FINAL_ANSWER'], FEEDBACK_ON_MY_ATTEMPT_ONLY: ['CHECK_REASONING', 'CHALLENGE_MY_ANSWER', 'NO_FINAL_ANSWER'], SOURCE_SUPPORT_ONLY: ['SOURCE_VERIFICATION'] };
    if (permittedModes[permission] && !permittedModes[permission].includes(mode)) return { status: 'MODE_NOT_PERMITTED', allowed: false, policyState: 'AI_ALLOWED_FOR_LIMITED_TASKS', message: 'The selected Learning Mode is outside the assistance you identified as permitted. Choose a permitted mode.' };
    if (['QUIZ_OR_TEST', 'COMPETITION'].includes(workType) && permission === 'GENERAL_LEARNING_SUPPORT') return { status: 'REVIEW_REQUIRED', allowed: false, policyState: workType === 'QUIZ_OR_TEST' ? 'ACTIVE_ASSESSMENT_RESTRICTED' : 'POLICY_UNKNOWN', message: 'This work needs specific test or competition rules. General learning permission is not enough to authorize AI use.' };
    return { status: 'READY', allowed: true, policyState: permission === 'GENERAL_LEARNING_SUPPORT' ? 'AI_ALLOWED' : 'AI_ALLOWED_FOR_LIMITED_TASKS', message: 'Academic Integrity Check complete. The selected Learning Mode matches the assistance identified as permitted.' };
  }
  function guidedDraftInput(state) {
    const values = state.values, selectedMode = GUIDED_LEARNING_MODES.find((mode) => mode.value === values.helpType) || GUIDED_LEARNING_MODES[0], helpType = selectedMode.value === 'NO_FINAL_ANSWER' ? 'HINT' : selectedMode.value, sources = values.sources || 'NO_EXTERNAL_SOURCE_NEEDED', integrity = academicIntegrityCheck(state);
    const bilingualInstruction = values.bilingual && values.secondaryLanguage ? `Present the response in ${values.primaryLanguage} and ${values.secondaryLanguage}, preserve required academic terms, and clearly label each language.` : '';
    return { goal: values.goal, subject: values.subject, courseLevel: values.level, context: [values.subject, values.level].filter(Boolean).join(' · '), currentUnderstanding: values.understanding, difficultyDescription: values.confusion, confusionOrGap: values.confusion, avoidInstructions: values.avoid, constraints: [values.avoid, values.modeInstruction, bilingualInstruction].filter(Boolean), helpMode: helpType, selectedLearningMode: selectedMode.value, learningModeInstruction: values.modeInstruction, academicWorkType: values.academicWorkType, aiAssistancePermission: values.aiAssistancePermission, academicIntegrityStatus: integrity.status, desiredFormats: values.presentation ? [values.presentation] : [], academicTermsToPreserve: [], sourceRequirements: [sources], verificationRequirements: sources === 'NO_EXTERNAL_SOURCE_NEEDED' ? ['CHECK_AGAINST_COURSE_NOTES'] : ['OPEN_AND_REVIEW_SOURCES', 'STATE_UNCERTAINTY'], privacyStatus: 'REVIEW_RECOMMENDED', policyState: integrity.policyState, assignmentPolicyRevalidated: integrity.allowed, studentAttemptRule: selectedMode.attemptRule, successCriteria: 'I can explain what I learned and how I checked it.' };
  }
  function revalidateLearningModePolicy(state) {
    const mode = GUIDED_LEARNING_MODES.find((item) => item.value === state.values.helpType) || GUIDED_LEARNING_MODES[0];
    const restricted = mode.value === 'NO_FINAL_ANSWER' || ['HINT', 'GUIDING_QUESTIONS', 'CHECK_REASONING', 'CHALLENGE_MY_ANSWER', 'QUIZ'].includes(mode.value);
    return { valid: true, policyState: 'POLICY_UNKNOWN', instructionEditable: !mode.locked, message: restricted ? 'Assignment AI Policy revalidated: this mode preserves a student attempt and does not authorize a final answer.' : 'Assignment AI Policy revalidated: confirm the assignment-specific policy before using AI-supported work.' };
  }
  function guidedPreviewText(state) {
    const input = guidedDraftInput(state), actor = guidedActor();
    try { return actor ? API.generatePromptText(input, actor).promptText : generateText(input); } catch { return generateText({ ...input, helpMode: input.helpMode || 'CONCEPT_EXPLANATION', desiredFormats: input.desiredFormats || [] }); }
  }
  function guidedLivePrompt(state) { return state.editedPrompt || guidedPreviewText(state); }
  function guidedAnswerComplete(value, minimum = 1) { const answer = String(value || '').trim(); return answer.length >= minimum && !/\[[^\]]+\]/.test(answer); }
  function promptQualityChecks(state) {
    const values = state.values || {}, privacyText = [Object.values(values).join(' '), state.editedPrompt].join(' '), integrity = academicIntegrityCheck(state);
    return [
      { id: 'goal', passed: guidedAnswerComplete(values.goal, 12), passedLabel: 'Your goal is clear', actionLabel: 'Clarify your learning goal' },
      { id: 'context', passed: guidedAnswerComplete(values.subject, 2) && guidedAnswerComplete(values.level, 2), passedLabel: 'You included useful subject and course context', actionLabel: 'Add the subject and course or grade' },
      { id: 'understanding', passed: guidedAnswerComplete(values.understanding, 3), passedLabel: 'You included your current understanding', actionLabel: 'Add what you currently understand' },
      { id: 'question', passed: guidedAnswerComplete(values.confusion, 5), passedLabel: 'Your specific question or difficulty is clear', actionLabel: 'Explain the exact question or difficulty' },
      { id: 'mode', passed: guidedAnswerComplete(values.helpType) && guidedAnswerComplete(values.modeInstruction, 8), passedLabel: 'You selected a learning mode', actionLabel: 'Select the type of learning help you want' },
      { id: 'format', passed: guidedAnswerComplete(values.presentation), passedLabel: 'You selected a response format', actionLabel: 'Choose how the response should be presented' },
      { id: 'sources', passed: guidedAnswerComplete(values.sources), passedLabel: 'You included source requirements', actionLabel: 'Choose whether sources are required' },
      { id: 'integrity', passed: guidedAnswerComplete(values.avoid, 5) && integrity.allowed, passedLabel: 'Academic-integrity limits are clear', actionLabel: guidedAnswerComplete(values.avoid, 5) ? 'Confirm the teacher AI policy before continuing' : 'Explain what the AI should avoid and confirm the teacher AI policy' },
      { id: 'privacy', passed: !hasPrivateData(privacyText), passedLabel: 'No obvious private information was found', actionLabel: 'Remove possible private information before continuing' }
    ];
  }
  function promptQualityCheckHTML(state) {
    return promptQualityChecks(state).map((check) => `<li class="${check.passed ? 'is-ready' : 'needs-work'}" data-prompt-check="${check.id}"><span aria-hidden="true">${check.passed ? '✓' : '!'}</span><span>${guidedEscape(check.passed ? check.passedLabel : check.actionLabel)}</span><span class="sr-only">${check.passed ? 'Complete' : 'Needs attention'}</span></li>`).join('');
  }
  function guidedLearningModeSummaryHTML(state) {
    const mode = GUIDED_LEARNING_MODES.find((item) => item.value === state.values.helpType) || GUIDED_LEARNING_MODES[0], policy = revalidateLearningModePolicy(state);
    return `<p><strong>Selected mode:</strong><br>${guidedEscape(mode.label)}</p><p><strong>Added instruction:</strong><br>“${guidedEscape(state.values.modeInstruction || mode.instruction)}”</p><p class="guided-policy-status">${guidedEscape(policy.message)}</p>`;
  }
  function academicIntegrityCheckHTML(state) {
    const values = state.values, result = academicIntegrityCheck(state), workOptions = ACADEMIC_WORK_TYPES.map((option) => `<label><input type="radio" name="academic-work-type" value="${option.value}"${values.academicWorkType === option.value ? ' checked' : ''}> <span>${guidedEscape(option.label)}</span></label>`).join(''), permissionOptions = `<option value="">Choose the teacher AI policy</option>${AI_ASSISTANCE_PERMISSIONS.map((option) => `<option value="${option.value}"${values.aiAssistancePermission === option.value ? ' selected' : ''}>${guidedEscape(option.label)}</option>`).join('')}`;
    return `<section class="academic-integrity-check" aria-labelledby="academicIntegrityTitle"><h3 id="academicIntegrityTitle">Academic Integrity Check</h3><fieldset><legend>What are you working on?</legend><div class="academic-work-options">${workOptions}</div></fieldset><label class="academic-permission-label" for="academic-assistance-permission">What is the teacher’s AI policy?</label><select id="academic-assistance-permission">${permissionOptions}</select><p class="academic-integrity-status ${result.allowed ? 'is-ready' : result.status === 'BLOCKED' ? 'is-blocked' : 'needs-review'}" role="status"><strong>${result.allowed ? 'Ready' : result.status === 'BLOCKED' ? 'Not permitted' : 'Review required'}:</strong> ${guidedEscape(result.message)}</p></section>`;
  }
  function promptPrivacyWarningHTML(findings) {
    if (!findings?.length) return '';
    return `<section class="prompt-privacy-warning" role="alert" aria-labelledby="promptPrivacyWarningTitle"><h3 id="promptPrivacyWarningTitle">This prompt may contain private information.</h3><ul>${findings.map((finding) => `<li>${guidedEscape(finding.label)}</li>`).join('')}</ul><p>Review the detected text carefully. StudySpark may miss private information or flag text that is appropriate to share.</p><div class="prompt-privacy-actions"><button class="btn btn-primary" type="button" data-privacy-remove>Remove It</button><button class="btn btn-secondary" type="button" data-privacy-edit>Edit Prompt</button><button class="btn btn-secondary" type="button" data-privacy-cancel>Cancel</button><button class="btn btn-secondary" type="button" data-privacy-continue>Continue Only If Appropriate</button></div></section>`;
  }
  function promptAccessibilityToolsHTML(state, step) {
    const transcript = state.speechTranscript ? `<section class="prompt-speech-review" aria-labelledby="speechTranscriptTitle"><h3 id="speechTranscriptTitle">Review Speech-to-Text Transcript</h3><label for="promptSpeechTranscript">Transcript for ${guidedEscape(step.title)}</label><textarea id="promptSpeechTranscript" rows="4">${guidedEscape(state.speechTranscript)}</textarea><p id="promptSpeechHelp">Review and edit the transcript. It is not added until you choose Use This Text.</p><div><button class="btn btn-primary" type="button" data-speech-use>Use This Text</button><button class="btn btn-secondary" type="button" data-speech-cancel>Cancel Transcript</button></div></section>` : '';
    return `<section class="prompt-accessibility-tools" aria-labelledby="promptAccessToolsTitle"><div><h2 id="promptAccessToolsTitle">Accessible Prompt Tools</h2><p>Keyboard input and visible text always remain available. Speech and audio never start automatically, and raw audio is not retained.</p></div><div class="prompt-accessibility-actions"><button class="btn btn-secondary" type="button" data-prompt-dictate>Speech-to-Text</button><button class="btn btn-secondary" type="button" data-prompt-listen>Listen to Completed Prompt</button><button class="btn btn-secondary" type="button" data-prompt-stop-listening>Stop Listening</button><button class="btn btn-secondary" type="button" aria-pressed="${state.textOnly}" data-prompt-text-only>Text-only presentation</button><button class="btn btn-secondary" type="button" data-prompt-access-settings>Accessibility Settings</button></div><fieldset class="prompt-bilingual-controls"><legend>Bilingual prompt</legend><label><input type="checkbox" data-prompt-bilingual${state.values.bilingual ? ' checked' : ''}> Create a bilingual prompt</label><label for="promptPrimaryLanguage">Primary language</label><select id="promptPrimaryLanguage" data-prompt-primary-language>${promptLanguageOptions(state.values.primaryLanguage)}</select><label for="promptSecondaryLanguage">Second language</label><select id="promptSecondaryLanguage" data-prompt-secondary-language${state.values.bilingual ? '' : ' disabled'}>${promptLanguageOptions(state.values.secondaryLanguage, true)}</select><p id="promptBilingualHelp">Required academic terms, privacy checks, source verification, final-answer limits, and assignment policy remain unchanged in every language.</p></fieldset>${transcript}</section>`;
  }
  function startPromptSpeechInput() {
    const state = guidedBuilderState, Recognition = root.SpeechRecognition || root.webkitSpeechRecognition;
    if (!state) return;
    if (!Recognition) { state.status = 'Speech-to-Text is unavailable in this browser. Use the labelled keyboard field instead.'; renderGuidedPromptBuilder(); return; }
    const recognition = new Recognition();
    recognition.lang = state.values.primaryLanguage || 'en'; recognition.interimResults = false; recognition.continuous = false;
    recognition.onstart = () => { state.status = 'Listening for speech. Nothing is submitted or sent automatically.'; const status = root.document?.querySelector('#promptBuilderContent .guided-builder-status'); if (status) status.textContent = state.status; };
    recognition.onresult = (event) => { state.speechTranscript = Array.from(event.results || []).map((result) => result[0]?.transcript || '').join(' ').trim(); state.speechTargetKey = GUIDED_BUILDER_STEPS[state.step].key; state.status = 'Transcript ready. Review and edit it before choosing Use This Text.'; renderGuidedPromptBuilder(); setTimeout(() => root.document?.getElementById('promptSpeechTranscript')?.focus?.(), 0); };
    recognition.onerror = () => { state.status = 'Speech-to-Text could not start. Your typed work is unchanged.'; renderGuidedPromptBuilder(); };
    recognition.start();
  }
  function usePromptSpeechTranscript() {
    const state = guidedBuilderState, editor = root.document?.getElementById('promptSpeechTranscript'); if (!state || !editor) return;
    const key = state.speechTargetKey || GUIDED_BUILDER_STEPS[state.step].key, addition = editor.value.trim();
    state.values[key] = [state.values[key], addition].filter(Boolean).join(state.values[key] ? ' ' : ''); state.speechTranscript = ''; state.speechTargetKey = ''; state.editedPrompt = ''; state.dirty = true; state.saved = false; state.reviewed = false; state.confirmed = false; state.status = 'Reviewed speech transcript added to the current field. Nothing was sent.'; renderGuidedPromptBuilder({ focusField: true });
  }
  function listenToGuidedPrompt() {
    const state = guidedBuilderState, speech = root.speechSynthesis, Utterance = root.SpeechSynthesisUtterance; if (!state) return;
    if (!speech || !Utterance) { state.status = 'Listening is unavailable in this browser. The complete prompt remains visible in the preview.'; renderGuidedPromptBuilder(); return; }
    speech.cancel(); const utterance = new Utterance(guidedLivePrompt(state)); utterance.lang = state.values.primaryLanguage || 'en'; utterance.rate = Math.max(.75, Math.min(2, Number(promptAccessibilityPreferences().audioPlaybackRatePercent || 100) / 100)); utterance.onend = () => { state.listening = false; }; state.listening = true; speech.speak(utterance); state.status = 'Listening started. The visible prompt remains available and audio can be stopped.'; const status = root.document?.querySelector('#promptBuilderContent .guided-builder-status'); if (status) status.textContent = state.status;
  }
  function stopListeningToGuidedPrompt() { root.speechSynthesis?.cancel?.(); if (guidedBuilderState) { guidedBuilderState.listening = false; guidedBuilderState.status = 'Listening stopped. Your prompt is unchanged.'; renderGuidedPromptBuilder(); } }
  function updateGuidedLivePreview(state, target) {
    if (!state.editedPrompt) state.preview = guidedPreviewText(state);
    const output = target?.querySelector('[data-guided-live-output]');
    if (output) output.textContent = guidedLivePrompt(state);
    const promptCheck = target?.querySelector('[data-guided-prompt-check]');
    if (promptCheck) promptCheck.innerHTML = promptQualityCheckHTML(state);
    const modeSummary = target?.querySelector('[data-guided-mode-summary]');
    if (modeSummary) modeSummary.innerHTML = guidedLearningModeSummaryHTML(state);
  }
  function guidedOptionsHTML(options, selected) { return options.map((option) => `<option value="${guidedEscape(option.value)}"${option.value === selected ? ' selected' : ''}>${guidedEscape(option.label)}</option>`).join(''); }
  function guidedControlHTML(step, value, state) {
    const common = `id="guidedPromptField" data-guided-field="${step.key}" aria-describedby="guidedPromptHelp"`;
    if (step.control === 'help-select') { const mode = GUIDED_LEARNING_MODES.find((item) => item.value === value) || GUIDED_LEARNING_MODES[0], policy = revalidateLearningModePolicy(state); return `<select ${common}>${guidedOptionsHTML(GUIDED_HELP_OPTIONS, value)}</select><div class="guided-mode-instruction"><label for="guidedModeInstruction">Added instruction</label><textarea id="guidedModeInstruction" data-guided-mode-instruction rows="4"${policy.instructionEditable ? '' : ' disabled'}>${guidedEscape(state.values.modeInstruction || mode.instruction)}</textarea><p>${policy.instructionEditable ? 'You may edit this instruction. Assignment policy and student-attempt protections still apply.' : 'This safety instruction is required by the selected mode and cannot be removed.'}</p><p class="guided-policy-status">${guidedEscape(policy.message)}</p></div>`; }
    if (step.control === 'format-select') return `<select ${common}>${guidedOptionsHTML(GUIDED_FORMAT_OPTIONS, value)}</select>`;
    if (step.control === 'source-select') return `<select ${common}>${guidedOptionsHTML(GUIDED_SOURCE_OPTIONS, value)}</select>`;
    if (step.control === 'input') return `<input ${common} type="text" value="${guidedEscape(value)}" autocomplete="off">`;
    return `<textarea ${common} rows="6">${guidedEscape(value)}</textarea>`;
  }
  function renderGuidedPromptBuilder({ focusField = false } = {}) {
    const target = root.document?.getElementById('promptBuilderContent'); if (!target) return;
    const state = guidedBuilderState || (guidedBuilderState = newGuidedBuilderState()), step = GUIDED_BUILDER_STEPS[state.step], completed = GUIDED_BUILDER_STEPS.filter((item) => String(state.values[item.key] || '').trim()).length;
    state.preview = guidedLivePrompt(state);
    const previewControl = state.editingPreview ? `<label class="sr-only" for="guidedLivePromptEditor">Edit the completed prompt</label><textarea id="guidedLivePromptEditor" data-guided-live-output rows="16">${guidedEscape(state.preview)}</textarea>` : `<pre data-guided-live-output tabindex="0">${guidedEscape(state.preview)}</pre>`, pageState = promptBuilderPageState(state);
    target.innerHTML = `<header class="view-intro prompt-builder-intro"><div><h1>Build Your Prompt</h1><p>Answer a few short questions to create a prompt that matches your learning goal.</p></div></header><div class="guided-prompt-workspace"><div class="guided-prompt-builder-column"><section class="guided-prompt-card" aria-labelledby="guidedPromptStepTitle"><div class="guided-prompt-progress"><div><span>Step ${state.step + 1} of ${GUIDED_BUILDER_STEPS.length}</span><small>${completed} of ${GUIDED_BUILDER_STEPS.length} sections answered</small></div><div class="guided-progress-track" role="progressbar" aria-label="Prompt builder progress" aria-valuemin="1" aria-valuemax="9" aria-valuenow="${state.step + 1}"><i style="width:${((state.step + 1) / GUIDED_BUILDER_STEPS.length) * 100}%"></i></div></div><div class="guided-prompt-question"><label id="guidedPromptStepTitle" for="guidedPromptField">${guidedEscape(step.title)}</label><p id="guidedPromptHelp">${guidedEscape(step.description)}</p>${guidedControlHTML(step, state.values[step.key] || '', state)}</div><div class="guided-step-actions"><button class="btn btn-secondary" type="button" data-guided-previous${state.step === 0 ? ' disabled' : ''}>Previous</button><button class="btn btn-primary" type="button" data-guided-continue>${state.step === GUIDED_BUILDER_STEPS.length - 1 ? 'Review Prompt' : 'Continue'}</button></div></section><section class="guided-prompt-tools" aria-label="Prompt builder actions"><button class="btn btn-secondary" type="button" data-guided-save>Save Draft</button><button class="btn btn-secondary" type="button" data-guided-review>Prompt Preview</button><button class="btn btn-secondary" type="button" data-guided-cancel>Cancel</button><p class="guided-builder-status" role="status" aria-live="polite">${guidedEscape(state.status)}</p></section></div><aside class="guided-prompt-preview" aria-labelledby="guidedPromptPreviewTitle"><h2 id="guidedPromptPreviewTitle" tabindex="-1">Live Prompt Preview</h2><p>Updates as you build. Nothing is sent automatically.</p>${previewControl}<section class="guided-learning-mode-summary" aria-labelledby="guidedLearningModeTitle"><h3 id="guidedLearningModeTitle">Learning Mode</h3><div data-guided-mode-summary>${guidedLearningModeSummaryHTML(state)}</div></section><section class="guided-prompt-check" aria-labelledby="guidedPromptCheckTitle"><h3 id="guidedPromptCheckTitle">Prompt Check</h3><ul data-guided-prompt-check>${promptQualityCheckHTML(state)}</ul></section><div class="guided-preview-actions"><button class="btn btn-secondary" type="button" data-guided-copy>Copy Prompt</button><button class="btn btn-secondary" type="button" data-guided-edit>${state.editingPreview ? 'Finish Editing' : 'Edit Prompt'}</button><button class="btn btn-secondary" type="button" data-guided-use${state.confirmed ? '' : ' disabled'}>Use in AI Coach</button><button class="btn btn-secondary" type="button" data-guided-save-prompt>Save Prompt</button><button class="btn btn-secondary" type="button" data-guided-start-over>Start Over</button><button class="btn btn-primary" type="button" data-guided-confirm>${state.confirmed ? 'Prompt Confirmed' : 'Confirm Prompt'}</button></div></aside></div>`;
    target.querySelector('.prompt-builder-intro')?.insertAdjacentHTML('afterend', promptPageStateHTML(pageState.state, pageState.message, { alert: pageState.alert }));
    target.querySelector('.prompt-page-state')?.insertAdjacentHTML('afterend', promptAccessibilityToolsHTML(state, step));
    const builderColumn = target.querySelector('.guided-prompt-builder-column'), previewPanel = target.querySelector('.guided-prompt-preview');
    if (builderColumn) { builderColumn.id = 'guidedPromptBuilderColumn'; builderColumn.tabIndex = -1; }
    if (previewPanel) { previewPanel.id = 'guidedPromptPreviewPanel'; previewPanel.tabIndex = -1; }
    target.querySelector('.prompt-accessibility-tools')?.insertAdjacentHTML('afterend', '<nav class="prompt-mobile-workspace-nav" aria-label="Prompt Builder sections"><a href="#guidedPromptBuilderColumn">Prompt Builder</a><a href="#guidedPromptPreviewPanel">Live Prompt Preview</a></nav>');
    target.closest('.guided-prompt-shell')?.classList.toggle('prompt-text-only', Boolean(state.textOnly));
    target.closest('.guided-prompt-shell')?.setAttribute('data-low-bandwidth', promptAccessibilityPreferences().lowBandwidthPreference || 'AUTO');
    target.querySelector('.guided-learning-mode-summary')?.insertAdjacentHTML('afterend', academicIntegrityCheckHTML(state));
    target.querySelector('#academicIntegrityTitle')?.setAttribute('tabindex', '-1');
    if (state.privacyReviewRequested && state.privacyFindings.length) target.querySelector('.guided-prompt-check')?.insertAdjacentHTML('afterend', promptPrivacyWarningHTML(state.privacyFindings));
    target.querySelector('#promptPrivacyWarningTitle')?.setAttribute('tabindex', '-1');
    const field = target.querySelector('[data-guided-field]');
    field?.addEventListener('input', () => { state.values[step.key] = field.value; state.dirty = true; state.saved = false; state.reviewed = false; state.confirmed = false; state.privacyOverrideApproved = false; state.editedPrompt = ''; updateGuidedLivePreview(state, target); });
    field?.addEventListener('change', () => { state.values[step.key] = field.value; state.dirty = true; state.saved = false; state.reviewed = false; state.confirmed = false; state.privacyOverrideApproved = false; state.editedPrompt = ''; updateGuidedLivePreview(state, target); });
    if (step.control === 'help-select') field?.addEventListener('change', () => { const mode = GUIDED_LEARNING_MODES.find((item) => item.value === field.value) || GUIDED_LEARNING_MODES[0]; state.values.helpType = mode.value; state.values.modeInstruction = mode.instruction; state.assignmentPolicyValidation = revalidateLearningModePolicy(state); state.status = `${mode.label} selected. Its instruction was added and the Assignment AI Policy was revalidated.`; state.editedPrompt = ''; state.dirty = true; state.saved = false; state.reviewed = false; state.confirmed = false; state.privacyOverrideApproved = false; renderGuidedPromptBuilder({ focusField: true }); });
    target.querySelector('[data-guided-mode-instruction]')?.addEventListener('input', (event) => { state.values.modeInstruction = event.currentTarget.value; state.assignmentPolicyValidation = revalidateLearningModePolicy(state); state.editedPrompt = ''; state.dirty = true; state.saved = false; state.reviewed = false; state.confirmed = false; state.privacyOverrideApproved = false; state.status = 'Learning-mode instruction updated. Assignment AI Policy revalidated.'; updateGuidedLivePreview(state, target); });
    target.querySelectorAll('input[name="academic-work-type"]').forEach((input) => input.addEventListener('change', () => { state.values.academicWorkType = input.value; state.confirmed = false; state.reviewed = false; state.saved = false; state.dirty = true; state.privacyOverrideApproved = false; state.status = 'Work type updated. Academic Integrity and Assignment AI Policy checks were revalidated.'; renderGuidedPromptBuilder(); }));
    target.querySelector('#academic-assistance-permission')?.addEventListener('change', (event) => { state.values.aiAssistancePermission = event.currentTarget.value; state.confirmed = false; state.reviewed = false; state.saved = false; state.dirty = true; state.privacyOverrideApproved = false; state.status = 'Permitted AI assistance updated. Academic Integrity and Assignment AI Policy checks were revalidated.'; renderGuidedPromptBuilder(); });
    target.querySelector('#guidedLivePromptEditor')?.addEventListener('input', (event) => { state.editedPrompt = event.currentTarget.value; state.preview = state.editedPrompt; state.dirty = true; state.saved = false; state.reviewed = true; state.confirmed = false; state.privacyOverrideApproved = false; updateGuidedLivePreview(state, target); });
    target.querySelector('[data-guided-previous]')?.addEventListener('click', () => { if (state.step > 0) { state.step -= 1; renderGuidedPromptBuilder({ focusField: true }); } });
    target.querySelector('[data-guided-continue]')?.addEventListener('click', () => { state.values[step.key] = field?.value || ''; if (state.step < GUIDED_BUILDER_STEPS.length - 1) { state.step += 1; renderGuidedPromptBuilder({ focusField: true }); } else reviewGuidedPrompt(); });
    target.querySelector('[data-guided-save]')?.addEventListener('click', saveGuidedPromptDraft);
    target.querySelector('[data-guided-save-prompt]')?.addEventListener('click', saveGuidedPromptDraft);
    target.querySelector('[data-guided-review]')?.addEventListener('click', reviewGuidedPrompt);
    target.querySelector('[data-guided-confirm]')?.addEventListener('click', confirmGuidedPrompt);
    target.querySelector('[data-guided-use]')?.addEventListener('click', useGuidedPromptWithCoach);
    target.querySelector('[data-guided-copy]')?.addEventListener('click', copyGuidedPrompt);
    target.querySelector('[data-guided-edit]')?.addEventListener('click', editGuidedPrompt);
    target.querySelector('[data-guided-start-over]')?.addEventListener('click', startOverGuidedPrompt);
    target.querySelector('[data-privacy-remove]')?.addEventListener('click', removeGuidedPrivateInformation);
    target.querySelector('[data-privacy-edit]')?.addEventListener('click', editGuidedPrivateInformation);
    target.querySelector('[data-privacy-cancel]')?.addEventListener('click', cancelGuidedPrivacyReview);
    target.querySelector('[data-privacy-continue]')?.addEventListener('click', continueGuidedAfterPrivacyReview);
    target.querySelector('[data-guided-cancel]')?.addEventListener('click', cancelGuidedPromptBuilder);
    target.querySelector('[data-prompt-dictate]')?.addEventListener('click', startPromptSpeechInput);
    target.querySelector('[data-prompt-listen]')?.addEventListener('click', listenToGuidedPrompt);
    target.querySelector('[data-prompt-stop-listening]')?.addEventListener('click', stopListeningToGuidedPrompt);
    target.querySelector('[data-prompt-text-only]')?.addEventListener('click', () => { state.textOnly = !state.textOnly; state.status = state.textOnly ? 'Text-only presentation enabled.' : 'Standard visual presentation enabled.'; renderGuidedPromptBuilder(); });
    target.querySelector('[data-prompt-access-settings]')?.addEventListener('click', () => root.showView?.('accessibilityLanguage'));
    target.querySelector('[data-prompt-bilingual]')?.addEventListener('change', (event) => { state.values.bilingual = event.currentTarget.checked; state.editedPrompt = ''; state.dirty = true; state.saved = false; state.reviewed = false; state.confirmed = false; state.status = state.values.bilingual ? 'Bilingual prompt enabled. Choose two languages and review the instruction.' : 'Bilingual prompt disabled. Safeguards remain active.'; renderGuidedPromptBuilder(); });
    target.querySelector('[data-prompt-primary-language]')?.addEventListener('change', (event) => { state.values.primaryLanguage = event.currentTarget.value; state.editedPrompt = ''; state.dirty = true; state.saved = false; state.confirmed = false; renderGuidedPromptBuilder(); });
    target.querySelector('[data-prompt-secondary-language]')?.addEventListener('change', (event) => { state.values.secondaryLanguage = event.currentTarget.value; state.editedPrompt = ''; state.dirty = true; state.saved = false; state.confirmed = false; renderGuidedPromptBuilder(); });
    target.querySelector('[data-speech-use]')?.addEventListener('click', usePromptSpeechTranscript);
    target.querySelector('[data-speech-cancel]')?.addEventListener('click', () => { state.speechTranscript = ''; state.speechTargetKey = ''; state.status = 'Speech transcript cancelled. Typed work is unchanged.'; renderGuidedPromptBuilder({ focusField: true }); });
    target.querySelectorAll('.prompt-mobile-workspace-nav a').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); const destination = target.querySelector(link.getAttribute('href')); destination?.scrollIntoView?.({ block: 'start' }); destination?.focus?.(); }));
    applyPromptAccessibleMarkup(target);
    if (focusField) setTimeout(() => field?.focus?.(), 0);
  }
  function openGuidedPromptBuilder(templateId = null) {
    guidedBuilderState = newGuidedBuilderState(templateId);
    root.showView?.('promptBuilder');
    renderGuidedPromptBuilder({ focusField: true });
  }
  function saveGuidedPromptDraft() {
    const state = guidedBuilderState, actor = guidedActor(); if (!state || !actor) return;
    if (root.navigator?.onLine === false) { state.saveError = false; state.status = 'Offline. Your prompt remains on this page and was not sent.'; renderGuidedPromptBuilder(); return; }
    try {
      if (!state.promptCoachSessionId) state.promptCoachSessionId = API.createPromptCoachSession({ idempotencyKey: `${state.id}-session`, fictionalTask: false }, actor).session.id;
      state.saveVersion += 1;
      const result = API.createPromptDraftVersion({ idempotencyKey: `${state.id}-draft-${state.saveVersion}`, promptCoachSessionId: state.promptCoachSessionId, ...guidedDraftInput(state), title: state.promptTitle, subject: state.values.subject, studentEditedPromptText: state.editedPrompt }, actor);
      state.promptDraftVersionId = result.draft.id; state.promptTitle = result.draft.title; state.saved = true; state.saveError = false; state.dirty = false; state.status = 'Private prompt draft saved. It has not been sent and now appears in Saved Prompts.';
    } catch (error) { state.saved = false; state.saveError = true; state.status = error?.message || 'Unable to save prompt. Your answers remain on this page.'; }
    renderGuidedPromptBuilder();
  }
  function reviewGuidedPrompt() { const state = guidedBuilderState; if (!state) return; state.preview = guidedLivePrompt(state); state.reviewed = true; state.confirmed = false; state.status = 'Review the complete prompt, then confirm it when you are ready.'; renderGuidedPromptBuilder(); setTimeout(() => root.document?.getElementById('guidedPromptPreviewTitle')?.focus?.(), 0); }
  function confirmGuidedPrompt() { const state = guidedBuilderState; if (!state?.reviewed) return; state.confirmed = true; state.status = 'Prompt confirmed. It is still private and has not been sent.'; renderGuidedPromptBuilder(); }
  async function copyGuidedPrompt() { const state = guidedBuilderState; if (!state) return; const prompt = guidedLivePrompt(state); try { await root.navigator?.clipboard?.writeText(prompt); state.status = 'Prompt copied. It has not been sent.'; } catch { state.status = 'Copy was unavailable. Select the preview text and copy it manually.'; } renderGuidedPromptBuilder(); }
  function editGuidedPrompt() { const state = guidedBuilderState; if (!state) return; if (!state.editingPreview) state.editedPrompt = guidedLivePrompt(state); state.editingPreview = !state.editingPreview; state.reviewed = true; state.confirmed = false; state.dirty = true; state.status = state.editingPreview ? 'Edit the prompt directly. Your builder answers remain available.' : 'Prompt edits kept. Review and confirm before using it.'; renderGuidedPromptBuilder(); if (state.editingPreview) setTimeout(() => root.document?.getElementById('guidedLivePromptEditor')?.focus?.(), 0); }
  function startOverGuidedPrompt() { const state = guidedBuilderState; if (state?.dirty && root.confirm && !root.confirm('Start over and discard your unsaved prompt changes?')) return; guidedBuilderState = newGuidedBuilderState(); guidedBuilderState.status = 'Started over with a blank prompt. Nothing was sent.'; renderGuidedPromptBuilder({ focusField: true }); }
  function handoffGuidedPrompt(prompt) { const state = guidedBuilderState, actor = guidedActor(), composer = root.document?.getElementById('coachInput'); if (!state || !prompt) return; if (actor && state.promptDraftVersionId) markPromptDraftUsed({ promptDraftVersionId: state.promptDraftVersionId }, actor); if (composer) { composer.value = prompt; composer.dispatchEvent(new Event('input', { bubbles: true })); } state.dirty = false; root.showView?.('coach'); composer?.focus?.(); }
  function useGuidedPromptWithCoach() { const state = guidedBuilderState; if (!state?.confirmed) return; const integrity = academicIntegrityCheck(state); if (!integrity.allowed) { state.status = integrity.message; renderGuidedPromptBuilder(); setTimeout(() => root.document?.getElementById('academicIntegrityTitle')?.focus?.(), 0); return; } const prompt = guidedLivePrompt(state); if (!prompt) return; const findings = scanPromptPrivacy(prompt); if (findings.length && !state.privacyOverrideApproved) { state.privacyFindings = findings; state.privacyReviewRequested = true; state.status = 'Privacy Check needs your review before this prompt can be used.'; renderGuidedPromptBuilder(); setTimeout(() => root.document?.getElementById('promptPrivacyWarningTitle')?.focus?.(), 0); return; } handoffGuidedPrompt(prompt); }
  function removeGuidedPrivateInformation() { const state = guidedBuilderState; if (!state) return; state.editedPrompt = redactPromptPrivacy(guidedLivePrompt(state)); state.preview = state.editedPrompt; state.privacyFindings = []; state.privacyReviewRequested = false; state.privacyOverrideApproved = false; state.editingPreview = true; state.reviewed = false; state.confirmed = false; state.saved = false; state.dirty = true; state.status = 'Detected private information was removed. Review the edited prompt and confirm it again.'; renderGuidedPromptBuilder(); setTimeout(() => root.document?.getElementById('guidedLivePromptEditor')?.focus?.(), 0); }
  function editGuidedPrivateInformation() { const state = guidedBuilderState; if (!state) return; state.editedPrompt = guidedLivePrompt(state); state.editingPreview = true; state.privacyReviewRequested = false; state.privacyOverrideApproved = false; state.reviewed = false; state.confirmed = false; state.status = 'Edit the detected information, then review and confirm the prompt again.'; renderGuidedPromptBuilder(); setTimeout(() => root.document?.getElementById('guidedLivePromptEditor')?.focus?.(), 0); }
  function cancelGuidedPrivacyReview() { const state = guidedBuilderState; if (!state) return; state.privacyReviewRequested = false; state.privacyOverrideApproved = false; state.status = 'AI Coach handoff cancelled. Your prompt remains private on this page.'; renderGuidedPromptBuilder(); }
  function continueGuidedAfterPrivacyReview() { const state = guidedBuilderState; if (!state?.confirmed || !state.privacyFindings.length || !academicIntegrityCheck(state).allowed) return; state.privacyOverrideApproved = true; state.privacyReviewRequested = false; state.status = 'You chose to continue after reviewing the privacy warning. The prompt has not been sent automatically.'; handoffGuidedPrompt(guidedLivePrompt(state)); }
  function cancelGuidedPromptBuilder() { const state = guidedBuilderState; if (state?.dirty && root.confirm && !root.confirm('Discard your unsaved prompt changes?')) return; guidedBuilderState = null; root.showView?.('promptWithPurpose'); }

  function newImprovePromptState() { return { original: '', reviewed: false, suggestions: [], approved: false, dirty: false, saved: false, promptCoachSessionId: null, originalDraftId: null, improvedDraftId: null, saveVersion: 0, status: 'Paste or type a prompt to begin. It remains private and will not be sent automatically.' }; }
  function improveSuggestions() {
    return [
      { id: 'clarity', change: 'Clarify the learning goal', text: 'First, identify the main learning goal in my request and ask me to clarify it if it is ambiguous.', why: 'A clear goal helps the response stay relevant without inventing missing context.', verify: 'Confirm that the identified goal matches what you actually need to learn.' },
      { id: 'ownership', change: 'Protect student ownership', text: 'Guide me with explanations, hints, or questions without completing assessed work for me.', why: 'This keeps the response useful while preserving your opportunity to think and decide.', verify: 'Check the applicable assignment policy before using AI-supported work.' },
      { id: 'format', change: 'Request a useful presentation', text: 'Present the response in clear steps and explain unfamiliar terms.', why: 'A defined format makes the response easier to follow and review.', verify: 'Confirm that this format fits your course and accessibility needs.' },
      { id: 'verification', change: 'Add a verification plan', text: 'State uncertainty and tell me what still needs verification with course materials or reliable sources.', why: 'AI output can be incomplete, unsupported, or outdated even when it sounds confident.', verify: 'Open cited sources, check calculations, and compare important claims yourself.' }
    ].map((suggestion) => ({ ...suggestion, status: 'pending', editedText: suggestion.text }));
  }
  function improvedPromptText(state) { const additions = state.suggestions.filter((suggestion) => suggestion.status === 'accepted').map((suggestion) => suggestion.editedText.trim()).filter(Boolean); return [state.original.trim(), ...additions].filter(Boolean).join('\n\n'); }
  function improveReviewComplete(state) { return state.reviewed && state.suggestions.length > 0 && state.suggestions.every((suggestion) => suggestion.status !== 'pending') && state.suggestions.some((suggestion) => suggestion.status === 'accepted' && suggestion.editedText.trim()); }
  function improvePrivacyClear(state) { return !hasPrivateData(improvedPromptText(state)); }
  function improveDraftInput(text) { return { goal: 'Improve an existing student-written learning prompt.', context: 'Prompt Coach revision workflow', currentUnderstanding: '', confusionOrGap: '', constraints: ['Do not replace student thinking or bypass an assignment policy.'], helpMode: 'CONCEPT_EXPLANATION', desiredFormats: ['PLAIN_LANGUAGE'], academicTermsToPreserve: [], sourceRequirements: ['STATE_WHETHER_EXTERNAL_SOURCES_WERE_USED'], verificationRequirements: ['STATE_UNCERTAINTY'], privacyStatus: 'NO_OBVIOUS_SENSITIVE_INFORMATION_DETECTED', policyState: 'POLICY_UNKNOWN', studentAttemptRule: 'NO_ATTEMPT_REQUIRED', successCriteria: 'The student reviewed every suggestion and approved the exact prompt.', studentEditedPromptText: text };
  }
  function renderImprovePrompt() {
    const target = root.document?.getElementById('promptImproveContent'); if (!target) return;
    const state = improvePromptState || (improvePromptState = newImprovePromptState()), improved = improvedPromptText(state), privacyClear = improvePrivacyClear(state), reviewComplete = improveReviewComplete(state);
    const suggestions = state.suggestions.map((suggestion) => `<article class="prompt-improve-suggestion" data-improve-suggestion="${suggestion.id}"><div><h3>${guidedEscape(suggestion.change)}</h3><span class="suggestion-status ${suggestion.status}">${suggestion.status === 'accepted' ? 'Accepted' : suggestion.status === 'rejected' ? 'Rejected' : 'Review needed'}</span></div><label for="improve-${suggestion.id}">Suggested wording</label><textarea id="improve-${suggestion.id}" data-improve-suggestion-text rows="3">${guidedEscape(suggestion.editedText)}</textarea><div class="suggestion-actions"><button class="btn btn-secondary" type="button" data-improve-accept>Accept Suggestion</button><button class="btn btn-secondary" type="button" data-improve-reject>Reject Suggestion</button></div><details><summary>Why this suggestion may help</summary><p>${guidedEscape(suggestion.why)}</p></details></article>`).join('');
    target.innerHTML = `<header class="view-intro prompt-improve-intro"><div><h1>Improve an Existing Prompt</h1><p>Paste a prompt you already wrote and review suggestions for making it clearer, safer, and more useful.</p></div></header><section class="prompt-improve-input" aria-labelledby="improveInputTitle"><h2 id="improveInputTitle">Your Existing Prompt</h2><label for="existingPromptText">Paste or type your prompt</label><textarea id="existingPromptText" rows="8">${guidedEscape(state.original)}</textarea><button class="btn btn-primary" type="button" data-improve-review>Improve My Prompt</button></section>${state.reviewed ? `<div class="prompt-improve-results"><section aria-labelledby="originalPromptTitle"><h2 id="originalPromptTitle">Original Prompt</h2><pre>${guidedEscape(state.original)}</pre></section><section aria-labelledby="improvedPromptTitle"><h2 id="improvedPromptTitle">Improved Prompt</h2><pre data-improved-prompt>${guidedEscape(improved)}</pre></section></div><section class="prompt-improve-changes" aria-labelledby="whatChangedTitle"><h2 id="whatChangedTitle">What Changed</h2><p>Review every suggestion. You can accept, reject, or edit its wording without changing the original prompt.</p>${suggestions}</section><div class="prompt-improve-explanations"><section><h2>Why It Is Better</h2><ul>${state.suggestions.filter((item) => item.status === 'accepted').map((item) => `<li>${guidedEscape(item.why)}</li>`).join('') || '<li>No suggestions have been accepted yet.</li>'}</ul></section><section><h2>What Still Needs Verification</h2><ul>${state.suggestions.map((item) => `<li>${guidedEscape(item.verify)}</li>`).join('')}</ul></section></div><section class="prompt-improve-privacy" aria-labelledby="improvePrivacyTitle"><h2 id="improvePrivacyTitle">Privacy Check Before Sending</h2><p class="${privacyClear ? 'privacy-clear' : 'privacy-warning'}">${privacyClear ? 'No obvious private information was found. Review the prompt yourself before continuing.' : 'Possible private information was found. Remove it before saving or using this prompt.'}</p></section><div class="prompt-improve-actions"><button class="btn btn-secondary" type="button" data-improve-restore>Restore Original Prompt</button><button class="btn btn-secondary" type="button" data-improve-save${reviewComplete && privacyClear ? '' : ' disabled'}>Save Improved Prompt as New Version</button><button class="btn btn-primary" type="button" data-improve-approve${reviewComplete && privacyClear ? '' : ' disabled'}>${state.approved ? 'Prompt Approved' : 'Approve Improved Prompt'}</button><button class="btn btn-secondary" type="button" data-improve-use${state.approved && privacyClear ? '' : ' disabled'}>Use Approved Prompt in AI Coach</button></div>` : ''}<p class="prompt-improve-status" role="status" aria-live="polite">${guidedEscape(state.status)}</p>`;
    if (promptConnectionState) target.querySelector('.prompt-improve-intro')?.insertAdjacentHTML('afterend', promptConnectionStateHTML());
    const originalField = target.querySelector('#existingPromptText');
    originalField?.addEventListener('input', () => { state.original = originalField.value; state.reviewed = false; state.suggestions = []; state.approved = false; state.saved = false; state.dirty = true; });
    target.querySelector('[data-improve-review]')?.addEventListener('click', () => { state.original = originalField?.value.trim() || ''; if (state.original.length < 5) { state.status = 'Enter a complete prompt before requesting suggestions.'; renderImprovePrompt(); return; } state.suggestions = improveSuggestions(); state.reviewed = true; state.approved = false; state.dirty = true; state.status = 'Review every suggestion. The original prompt has not been replaced.'; renderImprovePrompt(); });
    target.querySelectorAll('[data-improve-suggestion]').forEach((card) => { const suggestion = state.suggestions.find((item) => item.id === card.dataset.improveSuggestion), editor = card.querySelector('[data-improve-suggestion-text]'); editor?.addEventListener('input', () => { suggestion.editedText = editor.value; suggestion.status = 'pending'; state.approved = false; state.saved = false; state.dirty = true; }); card.querySelector('[data-improve-accept]')?.addEventListener('click', () => { suggestion.editedText = editor.value.trim(); suggestion.status = 'accepted'; state.approved = false; state.dirty = true; state.status = `${suggestion.change} accepted. Review the remaining suggestions.`; renderImprovePrompt(); }); card.querySelector('[data-improve-reject]')?.addEventListener('click', () => { suggestion.status = 'rejected'; state.approved = false; state.dirty = true; state.status = `${suggestion.change} rejected. The original wording remains.`; renderImprovePrompt(); }); });
    target.querySelector('[data-improve-restore]')?.addEventListener('click', restoreOriginalPrompt);
    target.querySelector('[data-improve-save]')?.addEventListener('click', saveImprovedPrompt);
    target.querySelector('[data-improve-approve]')?.addEventListener('click', approveImprovedPrompt);
    target.querySelector('[data-improve-use]')?.addEventListener('click', useImprovedPrompt);
    applyPromptAccessibleMarkup(target);
  }
  function openImprovePrompt() { improvePromptState = newImprovePromptState(); root.showView?.('promptImprove'); renderImprovePrompt(); setTimeout(() => root.document?.getElementById('existingPromptText')?.focus?.(), 0); }
  function restoreOriginalPrompt() { const state = improvePromptState; if (!state) return; state.suggestions.forEach((suggestion) => { suggestion.status = 'rejected'; suggestion.editedText = suggestion.text; }); state.approved = false; state.saved = false; state.dirty = true; state.status = 'Original prompt restored. No revised wording was saved or sent.'; renderImprovePrompt(); }
  function saveImprovedPrompt() { const state = improvePromptState, actor = guidedActor(); if (!state || !actor || !improveReviewComplete(state) || !improvePrivacyClear(state)) return; try { if (!state.promptCoachSessionId) state.promptCoachSessionId = API.createPromptCoachSession({ idempotencyKey: `${state.original}-improve-session`, fictionalTask: false }, actor).session.id; if (!state.originalDraftId) state.originalDraftId = API.createPromptDraftVersion({ idempotencyKey: `${state.promptCoachSessionId}-original`, promptCoachSessionId: state.promptCoachSessionId, ...improveDraftInput(state.original) }, actor).draft.id; state.saveVersion += 1; state.improvedDraftId = API.createPromptDraftVersion({ idempotencyKey: `${state.promptCoachSessionId}-improved-${state.saveVersion}`, promptCoachSessionId: state.promptCoachSessionId, ...improveDraftInput(improvedPromptText(state)) }, actor).draft.id; state.saved = true; state.dirty = false; state.status = 'Improved prompt saved as a new private version. It has not been sent.'; } catch (error) { state.status = error?.message || 'The improved prompt could not be saved. Your review remains on this page.'; } renderImprovePrompt(); }
  function approveImprovedPrompt() { const state = improvePromptState; if (!state || !improveReviewComplete(state) || !improvePrivacyClear(state)) return; state.approved = true; state.status = 'Improved prompt approved after review. It has not been sent.'; renderImprovePrompt(); }
  function useImprovedPrompt() { const state = improvePromptState; if (!state?.approved || !improvePrivacyClear(state)) return; const composer = root.document?.getElementById('coachInput'); if (composer) { composer.value = improvedPromptText(state); composer.dispatchEvent(new Event('input', { bubbles: true })); } state.dirty = false; root.showView?.('coach'); composer?.focus?.(); }

  function filteredPromptTemplates(state = promptTemplateLibraryState) {
    const query = String(state.query || '').trim().toLowerCase();
    return PROMPT_TEMPLATE_LIBRARY.filter((template) => (state.category === 'All' || template.category === state.category) && (!query || [template.title, template.category, template.description, ...template.searchTerms].join(' ').toLowerCase().includes(query)));
  }
  function promptLibraryPreview(template) {
    const starter = PROMPT_STARTER_TEMPLATES.find((item) => item.id === template.starterTemplateId);
    return [starter?.fields.goal, starter?.fields.context, starter?.fields.help, starter?.fields.avoid, starter?.fields.verification].filter(Boolean).join('\n\n');
  }
  function renderPromptTemplateLibrary({ focusSearch = false } = {}) {
    const target = root.document?.getElementById('promptTemplatesContent'); if (!target) return;
    target.innerHTML = promptPageStateHTML(PROMPT_PAGE_STATES.LOADING, 'Loading prompt templates…');
    const state = promptTemplateLibraryState;
    let templates;
    try { templates = filteredPromptTemplates(state); }
    catch { target.innerHTML = `<header class="view-intro prompt-templates-intro"><div><h1>Prompt Templates</h1><p>Find a starting prompt for learning, reasoning, research, writing, test preparation, coding, or source verification. Every template can be reviewed and changed before use.</p></div></header>${promptPageStateHTML(PROMPT_PAGE_STATES.TEMPLATE_ERROR, 'Your saved prompts and current draft were not changed.', { alert: true, retry: true })}`; target.querySelector('[data-prompt-state-retry]')?.addEventListener('click', () => renderPromptTemplateLibrary({ focusSearch: true })); return; }
    const filters = ['All', ...PROMPT_TEMPLATE_CATEGORIES].map((category) => `<button class="prompt-template-filter${state.category === category ? ' active' : ''}" type="button" data-template-category="${guidedEscape(category)}" aria-pressed="${state.category === category}">${guidedEscape(category)}</button>`).join('');
    const cards = templates.map((template) => { const expanded = state.previewId === template.id; return `<article class="prompt-library-card" data-library-template="${template.id}"><span class="prompt-library-category">${guidedEscape(template.category)}</span><h2>${guidedEscape(template.title)}</h2><p>${guidedEscape(template.description)}</p><div class="prompt-library-card-actions"><button class="btn btn-secondary" type="button" data-template-preview aria-expanded="${expanded}" aria-controls="template-preview-${template.id}">${expanded ? 'Hide Preview' : 'Preview Template'}</button><button class="btn btn-primary" type="button" data-template-select>Select Template</button></div><div class="prompt-library-preview${expanded ? '' : ' hidden'}" id="template-preview-${template.id}"><h3>Template Preview</h3><pre>${guidedEscape(promptLibraryPreview(template))}</pre><p>You can edit every field before saving or using this prompt.</p></div></article>`; }).join('');
    target.innerHTML = `<header class="view-intro prompt-templates-intro"><div><h1>Prompt Templates</h1><p>Find a starting prompt for learning, reasoning, research, writing, or test preparation. Every template can be reviewed and changed before use.</p></div></header><section class="prompt-template-controls" aria-label="Find prompt templates"><label for="prompt-template-search">Search Prompt Templates</label><div class="prompt-template-search"><span aria-hidden="true">⌕</span><input id="prompt-template-search" type="search" value="${guidedEscape(state.query)}" placeholder="Search by goal, subject, skill, or type of help" autocomplete="off"><button type="button" data-template-clear${state.query ? '' : ' hidden'} aria-label="Clear template search">×</button></div><div class="prompt-template-filters" aria-label="Filter templates by category">${filters}</div></section><aside class="prompt-template-help" aria-labelledby="templateExamplesTitle"><div><h2 id="templateExamplesTitle">How Prompts Work</h2><p>Compare weak and strong prompts, including what still needs verification.</p></div><button class="btn btn-secondary" type="button" data-template-examples>View Examples</button></aside><p class="prompt-template-count" role="status">${templates.length} ${templates.length === 1 ? 'template' : 'templates'} found</p><section class="prompt-library-grid" aria-label="Prompt template results">${cards || '<div class="prompt-library-empty"><h2>No templates found</h2><p>Try a different search or choose another category.</p><button class="btn btn-secondary" type="button" data-template-reset>Show All Templates</button></div>'}</section>`;
    target.querySelector('.prompt-template-controls')?.insertAdjacentHTML('beforebegin', `<section class="prompt-template-section prompt-starter-library" aria-labelledby="promptStarterHeading"><div class="prompt-template-heading"><h2 id="promptStarterHeading">Popular Starting Points</h2><p>Choose a common learning goal, then edit every field before saving or using the prompt.</p></div><div class="prompt-template-grid">${promptTemplateCardsHTML()}</div><p id="promptTemplateStatus" class="prompt-template-status" role="status" aria-live="polite"></p></section>`);
    if (promptConnectionState) target.querySelector('.prompt-templates-intro')?.insertAdjacentHTML('afterend', promptConnectionStateHTML());
    const search = target.querySelector('#prompt-template-search');
    search?.addEventListener('input', () => { state.query = search.value; renderPromptTemplateLibrary({ focusSearch: true }); });
    target.querySelector('[data-template-clear]')?.addEventListener('click', () => { state.query = ''; renderPromptTemplateLibrary({ focusSearch: true }); });
    target.querySelectorAll('[data-template-category]').forEach((button) => button.addEventListener('click', () => { state.category = button.dataset.templateCategory; state.previewId = null; renderPromptTemplateLibrary({ focusSearch: true }); }));
    target.querySelectorAll('[data-library-template]').forEach((card) => { const template = PROMPT_TEMPLATE_LIBRARY.find((item) => item.id === card.dataset.libraryTemplate); card.querySelector('[data-template-preview]')?.addEventListener('click', () => { state.previewId = state.previewId === template.id ? null : template.id; renderPromptTemplateLibrary(); }); card.querySelector('[data-template-select]')?.addEventListener('click', () => selectPromptLibraryTemplate(template)); });
    target.querySelectorAll('[data-prompt-template]').forEach((button) => button.addEventListener('click', () => openGuidedPromptBuilder(button.dataset.promptTemplate)));
    target.querySelector('[data-template-reset]')?.addEventListener('click', () => { promptTemplateLibraryState = { query: '', category: 'All', previewId: null }; renderPromptTemplateLibrary({ focusSearch: true }); });
    target.querySelector('[data-template-examples]')?.addEventListener('click', openPromptExamples);
    applyPromptAccessibleMarkup(target);
    if (focusSearch) setTimeout(() => { const input = root.document?.getElementById('prompt-template-search'); input?.focus?.(); input?.setSelectionRange?.(input.value.length, input.value.length); }, 0);
  }
  function openPromptTemplateLibrary() { promptTemplateLibraryState = { query: '', category: 'All', previewId: null }; root.showView?.('promptTemplates'); renderPromptTemplateLibrary({ focusSearch: true }); }
  function selectPromptLibraryTemplate(template) { if (!template) return; openGuidedPromptBuilder(template.starterTemplateId); guidedBuilderState.libraryTemplateId = template.id; guidedBuilderState.status = `${template.title} selected. Edit every field, then review and save your customized version.`; renderGuidedPromptBuilder({ focusField: true }); }

  function activePromptExample() { return PROMPT_COMPARISON_EXAMPLES.find((example) => example.id === promptExamplesState.activeId) || PROMPT_COMPARISON_EXAMPLES[0]; }
  function renderPromptExamples() {
    const target = root.document?.getElementById('promptLearnContent'); if (!target) return;
    const example = activePromptExample();
    const tabs = PROMPT_COMPARISON_EXAMPLES.map((item) => `<button class="prompt-example-tab${item.id === example.id ? ' active' : ''}" type="button" role="tab" aria-selected="${item.id === example.id}" data-example-subject="${item.id}">${guidedEscape(item.subject)}</button>`).join('');
    target.innerHTML = `<header class="view-intro prompt-examples-intro"><div><h1>Weak Prompt vs. Strong Prompt</h1><p>Learn why relevant context, learning boundaries, and a verification plan make a prompt more useful and safer.</p></div></header><section class="prompt-examples-guide" aria-labelledby="exampleGuideTitle"><h2 id="exampleGuideTitle">Weak Prompt vs. Strong Prompt</h2><p>A strong prompt is not automatically better because it is longer. It is better when the details are relevant to the learning goal and the student stays responsible for checking the result.</p><div class="prompt-example-tabs" role="tablist" aria-label="Choose a subject example">${tabs}</div></section><article class="prompt-example-comparison" aria-labelledby="exampleSubjectTitle"><header><span>Subject example</span><h2 id="exampleSubjectTitle">${guidedEscape(example.subject)}</h2></header><div class="prompt-example-pair"><section class="prompt-example-weak"><h3>Weak Prompt</h3><p>${guidedEscape(example.weakPrompt)}</p></section><section class="prompt-example-strong"><h3>Strong Prompt</h3><p>${guidedEscape(example.strongPrompt)}</p></section></div><div class="prompt-example-explanation"><section><h3>What Changed</h3><p>${guidedEscape(example.whatChanged)}</p></section><section><h3>Why the Strong Prompt Is Better</h3><p>${guidedEscape(example.whyBetter)}</p></section><section><h3>What Still Requires Verification</h3><p>${guidedEscape(example.verification)}</p></section></div><div class="prompt-example-actions"><button class="btn btn-primary" type="button" data-example-use-strong>Use Strong Prompt</button><button class="btn btn-secondary" type="button" data-example-improve-weak>Improve the Weak Prompt</button></div><p class="prompt-example-note">Examples are not added to your prompt history unless you intentionally customize and save one.</p></article>`;
    if (promptConnectionState) target.querySelector('.prompt-examples-intro')?.insertAdjacentHTML('afterend', promptConnectionStateHTML());
    target.querySelectorAll('[data-example-subject]').forEach((button) => button.addEventListener('click', () => { promptExamplesState.activeId = button.dataset.exampleSubject; renderPromptExamples(); setTimeout(() => root.document?.querySelector(`[data-example-subject="${promptExamplesState.activeId}"]`)?.focus?.(), 0); }));
    target.querySelectorAll('[data-example-subject]').forEach((button, index, buttons) => { button.tabIndex = button.getAttribute('aria-selected') === 'true' ? 0 : -1; button.addEventListener('keydown', (event) => { let next = index; if (event.key === 'ArrowRight') next = (index + 1) % buttons.length; else if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length; else if (event.key === 'Home') next = 0; else if (event.key === 'End') next = buttons.length - 1; else return; event.preventDefault(); buttons[next].click(); }); });
    target.querySelector('[data-example-use-strong]')?.addEventListener('click', () => useStrongPromptExample(example));
    target.querySelector('[data-example-improve-weak]')?.addEventListener('click', () => improveWeakPromptExample(example));
    applyPromptAccessibleMarkup(target);
  }
  function openPromptExamples() { promptExamplesState = { activeId: promptExamplesState.activeId || 'mathematics' }; root.showView?.('promptLearn'); renderPromptExamples(); }
  function useStrongPromptExample(example) {
    if (!example) return;
    openGuidedPromptBuilder(example.starterTemplateId);
    guidedBuilderState.values.goal = example.strongPrompt;
    guidedBuilderState.values.subject = example.subject;
    guidedBuilderState.editedPrompt = example.strongPrompt;
    guidedBuilderState.dirty = true;
    guidedBuilderState.saved = false;
    guidedBuilderState.status = `${example.subject} example selected. Review and customize it; it has not been saved or sent.`;
    renderGuidedPromptBuilder({ focusField: true });
  }
  function improveWeakPromptExample(example) {
    if (!example) return;
    improvePromptState = newImprovePromptState();
    improvePromptState.original = example.weakPrompt;
    improvePromptState.suggestions = improveSuggestions();
    improvePromptState.reviewed = true;
    improvePromptState.dirty = true;
    improvePromptState.status = `${example.subject} weak prompt loaded for review. It has not been replaced, saved, or sent.`;
    root.showView?.('promptImprove');
    renderImprovePrompt();
  }

  function latestSavedPromptDrafts(actor) { const seen = new Set(); return listPromptDraftHistory(actor).filter((draft) => { if (seen.has(draft.promptCoachSessionId)) return false; seen.add(draft.promptCoachSessionId); return true; }); }
  function promptHistoryDate(value) { if (!value) return 'Never'; const date = new Date(value), today = new Date(); if (date.toDateString() === today.toDateString()) return 'Today'; return Number.isNaN(date.getTime()) ? 'Unknown date' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); }
  function promptModeLabel(draft) { const value = draft.selectedLearningMode || draft.requestedHelpMode, mode = GUIDED_LEARNING_MODES.find((item) => item.value === value); return mode?.label || String(value || 'Not selected').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()); }
  function promptHistoryRowHTML(draft) { return `<article class="recent-prompt-row" data-history-prompt="${draft.id}"><div><h3>${guidedEscape(draft.title)}</h3><p>${guidedEscape(draft.subject)}</p></div><dl><div><dt>Learning mode</dt><dd>${guidedEscape(promptModeLabel(draft))}</dd></div><div><dt>Date</dt><dd>${guidedEscape(promptHistoryDate(draft.createdAt))}</dd></div><div><dt>Last used</dt><dd>${guidedEscape(promptHistoryDate(draft.lastUsedAt))}</dd></div></dl><button class="btn btn-secondary" type="button" data-history-use>Use Again</button></article>`; }
  function savedPromptCardHTML(draft) { const renaming = promptHistoryUiState.renamingId === draft.id; return `<article class="saved-prompt-card" data-saved-prompt="${draft.id}"><div class="saved-prompt-heading"><div>${renaming ? `<label for="rename-${draft.id}">Prompt title</label><input id="rename-${draft.id}" value="${guidedEscape(draft.title)}" data-saved-rename-input>` : `<h3>${guidedEscape(draft.title)}</h3>`}<p>${guidedEscape(draft.subject)} · ${guidedEscape(promptModeLabel(draft))}</p></div><button class="favourite-prompt${draft.favourite ? ' active' : ''}" type="button" data-saved-favourite aria-pressed="${draft.favourite}" aria-label="${draft.favourite ? 'Remove from favourites' : 'Mark as favourite'}">★</button></div><p>Saved ${guidedEscape(promptHistoryDate(draft.updatedAt || draft.createdAt))}</p><div class="saved-prompt-actions">${renaming ? '<button class="btn btn-primary" type="button" data-saved-rename-confirm>Save Name</button><button class="btn btn-secondary" type="button" data-saved-rename-cancel>Cancel</button>' : '<button class="btn btn-secondary" type="button" data-saved-use>Use Again</button><button class="btn btn-secondary" type="button" data-saved-edit>Edit</button><button class="btn btn-secondary" type="button" data-saved-rename>Rename</button><button class="btn btn-secondary" type="button" data-saved-duplicate>Duplicate</button><button class="btn btn-secondary" type="button" data-saved-delete>Delete</button>'}</div></article>`; }
  function renderPromptHistory(target) {
    const actor = guidedActor(); if (!target || !actor) return;
    const dedicated = target.hasAttribute('data-prompt-history-page'), saved = latestSavedPromptDrafts(actor), recent = saved.filter((draft) => draft.lastUsedAt).slice(0, 5);
    if (!saved.length) {
      const emptyState = `<section class="prompt-first-empty-state" data-prompt-page-state="No prompts yet" aria-labelledby="promptFirstEmptyTitle"><div class="prompt-first-empty-icon" aria-hidden="true">✦</div><div><span class="prompt-state-label">No prompts yet</span><h2 id="promptFirstEmptyTitle">You have not created a prompt yet.</h2><p>Start with a template or let Prompt Coach guide you through your first prompt.</p><div class="prompt-first-empty-actions"><button class="btn btn-primary" type="button" data-first-prompt-create>Create My First Prompt</button><button class="btn btn-secondary" type="button" data-first-prompt-templates>Use a Template</button><button class="btn btn-secondary" type="button" data-first-prompt-improve>Improve an Existing Prompt</button><button class="btn btn-secondary" type="button" data-first-prompt-learn>Learn How Prompts Work</button></div></div></section>`;
      if (dedicated) target.innerHTML = emptyState;
      else (target.querySelector('.prompt-examples-entry') || target.querySelector('.prompt-templates-entry') || target.querySelector('.prompt-improve-entry'))?.insertAdjacentHTML('afterend', emptyState);
      target.querySelector('[data-first-prompt-create]')?.addEventListener('click', () => openGuidedPromptBuilder());
      target.querySelector('[data-first-prompt-templates]')?.addEventListener('click', openPromptTemplateLibrary);
      target.querySelector('[data-first-prompt-improve]')?.addEventListener('click', openImprovePrompt);
      target.querySelector('[data-first-prompt-learn]')?.addEventListener('click', openPromptExamples);
      return;
    }
    const favourites = saved.filter((draft) => draft.favourite);
    const section = `<div class="prompt-history-sections"><section class="prompt-history-section" aria-labelledby="recentPromptsTitle"><div class="prompt-history-heading"><h2 id="recentPromptsTitle">Recent Prompts</h2><p>Prompts you intentionally used most recently.</p></div>${recent.length ? `<div class="recent-prompts-list">${recent.map(promptHistoryRowHTML).join('')}</div>` : '<div class="prompt-history-empty"><p>No recently used prompts yet.</p></div>'}</section><section class="prompt-history-section" aria-labelledby="savedPromptsTitle"><div class="prompt-history-heading"><h2 id="savedPromptsTitle">Saved Prompts</h2><p>Save a prompt from the Guided Prompt Builder, then rename, edit, duplicate, delete, or favourite it here.</p></div>${saved.length ? `<div class="saved-prompts-grid">${saved.map(savedPromptCardHTML).join('')}</div>` : '<div class="prompt-history-empty"><p>No saved prompts yet. Create or customize a prompt, then choose Save Prompt.</p></div>'}</section><section class="prompt-history-section" aria-labelledby="favouritePromptsTitle"><div class="prompt-history-heading"><h2 id="favouritePromptsTitle">Favourite Prompts</h2><p>Your favourite private prompts for faster reuse.</p></div>${favourites.length ? `<div class="recent-prompts-list">${favourites.map(promptHistoryRowHTML).join('')}</div>` : '<div class="prompt-history-empty"><p>No favourite prompts yet. Mark a saved prompt with the star button to add it here.</p></div>'}</section><p class="prompt-history-status" role="status" aria-live="polite">${guidedEscape(promptHistoryUiState.status)}</p></div>`;
    if (dedicated) target.innerHTML = section;
    else (target.querySelector('.prompt-examples-entry') || target.querySelector('.prompt-templates-entry') || target.querySelector('.prompt-improve-entry'))?.insertAdjacentHTML('afterend', section);
    target.querySelectorAll('[data-history-prompt]').forEach((row) => row.querySelector('[data-history-use]')?.addEventListener('click', () => useSavedPrompt(row.dataset.historyPrompt, false)));
    target.querySelectorAll('[data-saved-prompt]').forEach((card) => { const id = card.dataset.savedPrompt; card.querySelector('[data-saved-use]')?.addEventListener('click', () => useSavedPrompt(id, false)); card.querySelector('[data-saved-edit]')?.addEventListener('click', () => useSavedPrompt(id, true)); card.querySelector('[data-saved-rename]')?.addEventListener('click', () => { promptHistoryUiState.renamingId = id; render(); renderPromptHistoryPage(); setTimeout(() => root.document?.getElementById(`rename-${id}`)?.focus?.(), 0); }); card.querySelector('[data-saved-rename-confirm]')?.addEventListener('click', () => renameSavedPromptFromCard(id, card.querySelector('[data-saved-rename-input]')?.value)); card.querySelector('[data-saved-rename-cancel]')?.addEventListener('click', () => { promptHistoryUiState.renamingId = null; render(); renderPromptHistoryPage(); }); card.querySelector('[data-saved-duplicate]')?.addEventListener('click', () => duplicateSavedPromptFromCard(id)); card.querySelector('[data-saved-delete]')?.addEventListener('click', () => deleteSavedPromptFromCard(id)); card.querySelector('[data-saved-favourite]')?.addEventListener('click', (event) => favouriteSavedPromptFromCard(id, event.currentTarget.getAttribute('aria-pressed') !== 'true')); });
  }
  function useSavedPrompt(id, editing) { const actor = guidedActor(), draft = actor ? markPromptDraftUsed({ promptDraftVersionId: id }, actor) : null; if (!draft) return; const selectedMode = GUIDED_LEARNING_MODES.some((mode) => mode.value === draft.selectedLearningMode) ? draft.selectedLearningMode : 'HINT', mode = GUIDED_LEARNING_MODES.find((item) => item.value === selectedMode); guidedBuilderState = newGuidedBuilderState(); guidedBuilderState.values = { ...guidedBuilderState.values, goal: draft.goal, subject: draft.subject, level: draft.context, understanding: draft.currentUnderstanding, confusion: draft.confusionOrGap, helpType: selectedMode, modeInstruction: draft.learningModeInstruction || mode.instruction, presentation: draft.desiredFormats?.[0] || 'PLAIN_LANGUAGE', avoid: (draft.constraints || []).find((item) => item !== draft.learningModeInstruction) || '', sources: draft.sourceRequirements?.[0] || 'NO_EXTERNAL_SOURCE_NEEDED', academicWorkType: draft.academicWorkType || '', aiAssistancePermission: draft.aiAssistancePermission || '' }; guidedBuilderState.editedPrompt = draft.generatedPromptText; guidedBuilderState.promptCoachSessionId = draft.promptCoachSessionId; guidedBuilderState.promptDraftVersionId = draft.id; guidedBuilderState.promptTitle = draft.title; guidedBuilderState.dirty = false; guidedBuilderState.status = editing ? 'Saved prompt opened for editing. Saving creates a new private version.' : 'Saved prompt opened for reuse. Review every field before using it again.'; root.showView?.('promptBuilder'); renderGuidedPromptBuilder({ focusField: true }); }
  function renameSavedPromptFromCard(id, title) { const actor = guidedActor(); if (!actor) return; try { renamePromptDraft({ promptDraftVersionId: id, title }, actor); promptHistoryUiState = { renamingId: null, status: 'Saved prompt renamed.' }; } catch (error) { promptHistoryUiState.status = error?.message || 'The prompt could not be renamed.'; } render(); renderPromptHistoryPage(); }
  function duplicateSavedPromptFromCard(id) { const actor = guidedActor(); if (!actor) return; try { duplicatePromptDraft({ promptDraftVersionId: id, idempotencyKey: `duplicate-${id}-${Date.now()}` }, actor); promptHistoryUiState.status = 'Saved prompt duplicated as a separate private prompt.'; } catch (error) { promptHistoryUiState.status = error?.message || 'The prompt could not be duplicated.'; } render(); renderPromptHistoryPage(); }
  function deleteSavedPromptFromCard(id) { const actor = guidedActor(); if (!actor || (root.confirm && !root.confirm('Delete this saved prompt? It will be removed from your Prompt Coach lists.'))) return; deletePromptDraft({ promptDraftVersionId: id }, actor); promptHistoryUiState.status = 'Saved prompt deleted. The deletion is recoverable in private storage.'; render(); renderPromptHistoryPage(); }
  function favouriteSavedPromptFromCard(id, favourite) { const actor = guidedActor(); if (!actor) return; setPromptDraftFavourite({ promptDraftVersionId: id, favourite }, actor); promptHistoryUiState.status = favourite ? 'Prompt added to favourites.' : 'Prompt removed from favourites.'; render(); renderPromptHistoryPage(); }

  function renderPromptHistoryPage() {
    const target = root.document?.getElementById('promptHistoryContent'); if (!target) return;
    target.innerHTML = `<header class="view-intro prompt-history-intro"><div><h1>My Prompts</h1><p>Review recent, saved, and favourite prompts in one focused workspace.</p></div><button class="btn btn-primary" type="button" data-history-create>Create a New Prompt</button></header><div data-prompt-history-page></div>`;
    renderPromptHistory(target.querySelector('[data-prompt-history-page]'));
    target.querySelector('[data-history-create]')?.addEventListener('click', () => openGuidedPromptBuilder());
    applyPromptAccessibleMarkup(target);
  }

  function promptHubStatusHTML() {
    const actor = guidedActor(), saved = actor ? latestSavedPromptDrafts(actor) : [], favourites = saved.filter((draft) => draft.favourite), recent = saved.filter((draft) => draft.lastUsedAt), latest = saved[0];
    if (!saved.length) return `<section class="prompt-hub-status is-new" aria-labelledby="promptHubStatusTitle"><span class="prompt-hub-status-icon" aria-hidden="true">✦</span><div><h2 id="promptHubStatusTitle">Ready for your first prompt</h2><p>Build from scratch, choose a template, or improve something you already wrote.</p></div><button class="btn btn-secondary" type="button" data-first-screen-view="promptBuilder">Start Building</button></section>`;
    return `<section class="prompt-hub-status" aria-labelledby="promptHubStatusTitle"><span class="prompt-hub-status-icon" aria-hidden="true">✓</span><div><h2 id="promptHubStatusTitle">Your prompt workspace is ready</h2><p>${saved.length} saved ${saved.length === 1 ? 'prompt' : 'prompts'} · ${recent.length} recently used · ${favourites.length} favourite${favourites.length === 1 ? '' : 's'}${latest ? ` · Latest: ${guidedEscape(latest.title)}` : ''}</p></div><button class="btn btn-secondary" type="button" data-first-screen-view="promptHistory">Open My Prompts</button></section>`;
  }

  function install() {
    const document = root.document;
    if (!document) return;
    installPromptConnectionListeners();
    if (typeof viewNames === 'object') { viewNames.promptWithPurpose = ['AI COACH', 'Prompt Coach']; viewNames.promptBuilder = ['AI COACH', 'Build Your Prompt']; viewNames.promptImprove = ['AI COACH', 'Improve an Existing Prompt']; viewNames.promptTemplates = ['AI COACH', 'Prompt Templates']; viewNames.promptHistory = ['AI COACH', 'My Prompts']; viewNames.promptLearn = ['AI COACH', 'Weak Prompt vs. Strong Prompt']; }
    if (document.getElementById('promptWithPurposeView') && !document.getElementById('promptBuilderView')) {
      document.getElementById('promptWithPurposeView').insertAdjacentHTML('afterend', '<section class="app-view" id="promptBuilderView"><main class="guided-prompt-shell"><div id="promptBuilderContent"></div></main></section>');
      renderGuidedPromptBuilder();
    }
    if (document.getElementById('promptWithPurposeView') && !document.getElementById('promptImproveView')) {
      (document.getElementById('promptBuilderView') || document.getElementById('promptWithPurposeView')).insertAdjacentHTML('afterend', '<section class="app-view" id="promptImproveView"><main class="prompt-improve-shell"><div id="promptImproveContent"></div></main></section>');
      renderImprovePrompt();
    }
    if (document.getElementById('promptWithPurposeView') && !document.getElementById('promptTemplatesView')) {
      (document.getElementById('promptImproveView') || document.getElementById('promptBuilderView') || document.getElementById('promptWithPurposeView')).insertAdjacentHTML('afterend', '<section class="app-view" id="promptTemplatesView"><main class="prompt-templates-shell"><div id="promptTemplatesContent"></div></main></section>');
      renderPromptTemplateLibrary();
    }
    if (document.getElementById('promptWithPurposeView') && !document.getElementById('promptLearnView')) {
      (document.getElementById('promptTemplatesView') || document.getElementById('promptImproveView') || document.getElementById('promptBuilderView') || document.getElementById('promptWithPurposeView')).insertAdjacentHTML('afterend', '<section class="app-view" id="promptLearnView"><main class="prompt-examples-shell"><div id="promptLearnContent"></div></main></section>');
      renderPromptExamples();
    }
    if (document.getElementById('promptWithPurposeView') && !document.getElementById('promptHistoryView')) {
      (document.getElementById('promptLearnView') || document.getElementById('promptTemplatesView') || document.getElementById('promptWithPurposeView')).insertAdjacentHTML('afterend', '<section class="app-view" id="promptHistoryView"><main class="prompt-history-shell"><div id="promptHistoryContent"></div></main></section>');
      renderPromptHistoryPage();
    }
    if (document.getElementById('promptWithPurposeView')) { render(); return; }
    const anchor = document.getElementById('policyAwarenessView') || document.getElementById('aiLiteracyView');
    if (!anchor) return;
    anchor.insertAdjacentHTML('afterend', '<section class="app-view" id="promptWithPurposeView"><main class="prompt-coach-shell"><a class="skip-link" href="#promptWithPurposeContent">Skip to Prompt With Purpose</a><div id="promptWithPurposeContent"></div></main></section>');
    document.getElementById('promptWithPurposeView').insertAdjacentHTML('afterend', '<section class="app-view" id="promptBuilderView"><main class="guided-prompt-shell"><div id="promptBuilderContent"></div></main></section>');
    document.getElementById('promptBuilderView').insertAdjacentHTML('afterend', '<section class="app-view" id="promptImproveView"><main class="prompt-improve-shell"><div id="promptImproveContent"></div></main></section>');
    document.getElementById('promptImproveView').insertAdjacentHTML('afterend', '<section class="app-view" id="promptTemplatesView"><main class="prompt-templates-shell"><div id="promptTemplatesContent"></div></main></section>');
    document.getElementById('promptTemplatesView').insertAdjacentHTML('afterend', '<section class="app-view" id="promptLearnView"><main class="prompt-examples-shell"><div id="promptLearnContent"></div></main></section>');
    document.getElementById('promptLearnView').insertAdjacentHTML('afterend', '<section class="app-view" id="promptHistoryView"><main class="prompt-history-shell"><div id="promptHistoryContent"></div></main></section>');
    document.getElementById('aiLiteracyContent')?.insertAdjacentHTML('beforeend', '<section><h2>Apply: Prompt With Purpose</h2><p>Build, test, review, and revise a learning prompt.</p><button type="button" data-prompt-with-purpose>Open Prompt-Writing Coach</button></section>');
    document.addEventListener('click', (event) => {
      if (event.target.closest('[data-prompt-with-purpose]')) { root.showView?.('promptWithPurpose'); render(); }
      if (event.target.closest('[data-view="promptWithPurpose"],[data-first-screen-view="promptWithPurpose"]')) setTimeout(render, 0);
      if (event.target.closest('[data-view="promptBuilder"],[data-first-screen-view="promptBuilder"]')) setTimeout(renderGuidedPromptBuilder, 0);
      if (event.target.closest('[data-view="promptImprove"],[data-first-screen-view="promptImprove"]')) setTimeout(renderImprovePrompt, 0);
      if (event.target.closest('[data-view="promptTemplates"],[data-first-screen-view="promptTemplates"]')) setTimeout(renderPromptTemplateLibrary, 0);
      if (event.target.closest('[data-view="promptHistory"],[data-first-screen-view="promptHistory"]')) setTimeout(renderPromptHistoryPage, 0);
      if (event.target.closest('[data-view="promptLearn"],[data-first-screen-view="promptLearn"]')) setTimeout(renderPromptExamples, 0);
    });
    document.addEventListener('click', (event) => {
      if (!event.target.closest('[data-study-page-back]')) return;
      const guidedDirty = document.getElementById('promptBuilderView')?.classList.contains('active') && guidedBuilderState?.dirty;
      const improveDirty = document.getElementById('promptImproveView')?.classList.contains('active') && improvePromptState?.dirty;
      if (!guidedDirty && !improveDirty) return;
      if (root.confirm && !root.confirm('Discard your unsaved prompt changes?')) { event.preventDefault(); event.stopImmediatePropagation(); return; }
      if (guidedDirty) guidedBuilderState.dirty = false;
      if (improveDirty) improvePromptState.dirty = false;
    }, true);
    render(); renderGuidedPromptBuilder(); renderImprovePrompt(); renderPromptTemplateLibrary(); renderPromptHistoryPage(); renderPromptExamples();
  }
  function render() {
    const target = root.document?.getElementById('promptWithPurposeContent'); if (!target) return;
    target.innerHTML = promptPageStateHTML(PROMPT_PAGE_STATES.LOADING, 'Loading Prompt Coach…');
    try {
    target.innerHTML = `<header class="view-intro prompt-coach-intro"><div><h1 tabindex="-1">Prompt Coach</h1><p>Choose one focused workflow to build, improve, organize, or learn about prompts.</p></div></header>${promptHubStatusHTML()}<aside class="prompt-hub-safety" aria-labelledby="promptHubSafetyTitle"><span aria-hidden="true">🛡</span><div><h2 id="promptHubSafetyTitle">Your safeguards travel with every workflow</h2><p>Privacy Check, Academic Integrity Check, assignment policy, source verification, and final-answer limits remain active before any AI Coach handoff.</p></div></aside>`;
    applyPromptAccessibleMarkup(target);
    if (promptConnectionState) target.querySelector('.prompt-coach-intro')?.insertAdjacentHTML('afterend', promptConnectionStateHTML());
    target.querySelector('h1')?.focus?.();
    return;
    target.innerHTML = `<header class="view-intro prompt-coach-intro"><div><h1 tabindex="-1">Prompt Coach</h1><p>Build clearer, safer, and more useful AI prompts while staying in control of your learning.</p></div><div class="header-actions"><button class="btn btn-primary" type="button" data-prompt-create>Create a New Prompt</button></div></header><section class="prompt-template-section" aria-labelledby="promptTemplateHeading"><div class="prompt-template-heading"><h2 id="promptTemplateHeading">Start with a Template</h2><p>Choose the type of help you want. You can edit every part of the prompt before using it.</p></div><div class="prompt-template-grid">${promptTemplateCardsHTML()}</div><p id="promptTemplateStatus" class="prompt-template-status" role="status" aria-live="polite"></p></section><nav aria-label="Lesson phases"><ol>${PHASES.map((phase) => `<li>${phase[0]}${phase.slice(1).toLowerCase()}</li>`).join('')}</ol></nav><section><h2>Learn: Nine Prompt Elements</h2><p>${COPY.formula}</p><p>${COPY.learning}</p><button type="button">Listen</button><button type="button">Text-only view</button></section><section><h2>Observe: Compare Prompts</h2><article><h3>Weak Prompt</h3><p>${WEAK_PROMPT}</p></article><article><h3>Improved Prompt</h3><p>${IMPROVED_PROMPT.replace(/\n/g, '<br>')}</p></article><p>${COPY.verification}</p></section><section><h2>Practise: Repair the Prompt</h2>${scenarios.map((scenario) => `<article><h3>${scenario.title}</h3><p>${scenario.weakPrompt}</p><button type="button">Show a Hint</button><button type="button">Review and Revise</button></article>`).join('')}</section><section><h2>Explain</h2><p>Explain one learning improvement, one source or verification improvement, and one privacy, policy, or student-attempt improvement.</p><button type="button">Speech-to-Text</button><p>Review the editable transcript before saving.</p></section><section><h2>Apply: Build and Test My Learning Prompt</h2><section aria-labelledby="quickBuilderTitle"><h3 id="quickBuilderTitle">Quick Builder</h3><ol><li>What are you trying to do?</li><li>What do you already understand?</li><li>What type of help do you want?</li><li>What should the AI avoid doing?</li><li>Do you need sources?</li><li>How will you verify the result?</li><li>Does the prompt contain private information?</li><li>Does an assignment policy apply?</li></ol></section><h3>Detailed Visual Prompt Builder</h3><div class="prompt-builder" aria-label="Detailed Visual Prompt Builder">${BUILDER_FIELDS.map((field, index) => `<section><h3>${String.fromCharCode(65 + index)}. ${field.question}</h3><label for="prompt-field-${index}">${field.question}</label><textarea id="prompt-field-${index}" data-prompt-field="${field.key}" rows="2"></textarea></section>`).join('')}</div><aside aria-live="polite"><h3>Prompt Readiness</h3><p>Element-by-element findings appear here. No prompt-quality score is created.</p></aside><button type="button">Build My Prompt</button><button type="button">Use a Template</button><button type="button">I Am Not Sure Yet</button><button type="button">Save Draft</button><button type="button">Cancel</button><h3>Final Prompt Preview</h3><p>Review Help Mode, Student Attempt Rule, Sources, Verification, Assignment Policy, Privacy, and AI Should Avoid before an intentional send.</p><button type="button">Try Prompt</button><button type="button">Review Response</button><button type="button">Revise Prompt</button><button type="button">Compare Versions</button><button type="button">Copy Prompt</button><button type="button">Send to AI Coach</button></section><section><h2>Reflect</h2><p>How will you verify a response and protect your opportunity to think before seeing an answer?</p><button type="button">Save and Continue Later</button><button type="button">Prefer Not to Write a Personal Reflection</button></section><aside class="prompt-coach-notice"><h2>Before sending</h2><p>${COPY.privacy}</p><p>${COPY.policy}</p><p>${COPY.integrity}</p><p>${COPY.transparency}</p></aside>`;
    target.querySelector('.prompt-coach-intro')?.insertAdjacentHTML('afterend', '<section class="prompt-improve-entry" aria-labelledby="promptImproveEntryTitle"><div><span aria-hidden="true">↗</span><div><h2 id="promptImproveEntryTitle">Improve an Existing Prompt</h2><p>Paste a prompt you already wrote and review suggestions for making it clearer, safer, and more useful.</p></div></div><button class="btn btn-primary" type="button" data-prompt-improve>Improve My Prompt</button></section>');
    target.querySelector('.prompt-improve-entry')?.insertAdjacentHTML('afterend', '<section class="prompt-templates-entry" aria-labelledby="promptTemplatesEntryTitle"><div><span aria-hidden="true">▦</span><div><h2 id="promptTemplatesEntryTitle">Browse Prompt Templates</h2><p>Explore prompts for explanations, reasoning, research, writing feedback, and test preparation.</p></div></div><button class="btn btn-secondary" type="button" data-prompt-templates>Browse Templates</button></section>');
    target.querySelector('.prompt-templates-entry')?.insertAdjacentHTML('afterend', '<section class="prompt-examples-entry" aria-labelledby="promptExamplesEntryTitle"><div><span aria-hidden="true">⇄</span><div><h2 id="promptExamplesEntryTitle">Learn How Prompts Work</h2><p>Compare weak and strong prompts across subjects and see what still needs verification.</p></div></div><button class="btn btn-secondary" type="button" data-prompt-examples>View Examples</button></section>');
    target.querySelector('[data-prompt-improve]')?.addEventListener('click', openImprovePrompt);
    target.querySelector('[data-prompt-templates]')?.addEventListener('click', openPromptTemplateLibrary);
    target.querySelector('[data-prompt-examples]')?.addEventListener('click', openPromptExamples);
    renderPromptHistory(target);
    target.querySelectorAll('[data-prompt-template]').forEach((button) => button.addEventListener('click', () => { fillPromptBuilder(button.dataset.promptTemplate, target); openGuidedPromptBuilder(button.dataset.promptTemplate); }));
    target.querySelector('[data-prompt-create]')?.addEventListener('click', () => {
      clearPromptBuilder(target); openGuidedPromptBuilder();
    });
    applyPromptAccessibleMarkup(target);
    if (promptConnectionState) target.querySelector('.prompt-coach-intro')?.insertAdjacentHTML('afterend', promptConnectionStateHTML());
    target.querySelector('h1')?.focus?.();
    } catch { renderPromptCoachLoadError(target); }
  }

  const API = freeze({
    AILiteracyPromptElementType: ELEMENT_TYPES, AILiteracyPromptCoreElementType: CORE_ELEMENTS,
    AILiteracyPromptHelpMode: HELP_MODES, AILiteracyPromptDesiredFormat: DESIRED_FORMATS,
    AILiteracyPromptSourceRequirement: SOURCE_REQUIREMENTS, AILiteracyPromptVerificationRequirement: VERIFICATION_REQUIREMENTS,
    AILiteracyPromptStudentAttemptRule: ATTEMPT_RULES, AILiteracyPromptElementStatus: ELEMENT_STATUSES,
    AILiteracyPromptCoachStatus: COACH_STATUSES, AILiteracyPromptCoachFeedbackStatus: FEEDBACK_STATUSES,
    AILiteracyPromptResponseReviewDimension: REVIEW_DIMENSIONS, AILiteracyPromptTestRunStatus: TEST_STATUSES,
    PromptWritingCoachFeatureFlag: FLAGS, PromptPolicyState: POLICY_STATES, PromptPrivacyStatus: PRIVACY_STATES,
    COPY, WEAK_PROMPT, IMPROVED_PROMPT, PromptCoachPageState: PROMPT_PAGE_STATES,
    getPromptWritingCoachCapabilities: (actor) => ({ enabled: config(requireActor(actor)).flags[FLAGS[1]], lessonEnabled: config(actor).flags[FLAGS[0]], sandboxEnabled: config(actor).flags[FLAGS[3]], offlineEnabled: config(actor).flags[FLAGS[10]], serverAuthoritative: false }),
    getPromptWritingCoachConfiguration: (actor) => clone(config(requireActor(actor))), getPromptCoachTemplates: () => clone(templates),
    getPromptHelpModes: () => clone(HELP_MODES), getPromptSourceRequirementDefinitions: () => clone(SOURCE_REQUIREMENTS),
    getPromptVerificationRequirementDefinitions: () => clone(VERIFICATION_REQUIREMENTS), getPromptWithPurposeLesson: () => clone(lesson),
    listPromptRepairScenarios: () => scenarios.map(safeScenario), getPromptRepairScenario: (input) => safeScenario(findScenario(input.scenarioId)),
    createPromptCoachSession: createSession, getPromptCoachSession: (input, actor) => ownerSession(own(sessions, input.promptCoachSessionId, actor), actor),
    pausePromptCoachSession: (input, actor) => { const session = own(sessions, input.promptCoachSessionId, actor); session.status = 'PAUSED'; upsertPersistentRow('promptCoachSessions', session); return ownerSession(session, actor); },
    resumePromptCoachSession: (input, actor) => { const session = own(sessions, input.promptCoachSessionId, actor); session.status = 'DRAFT'; upsertPersistentRow('promptCoachSessions', session); return ownerSession(session, actor); },
    deletePromptCoachSession: (input, actor) => { const session = own(sessions, input.promptCoachSessionId, actor); session.status = 'CANCELLED'; session.deletedAt = new Date().toISOString(); upsertPersistentRow('promptCoachSessions', session); return { deleted: true, sent: false }; },
    PromptCoachDraftSchema: PROMPT_COACH_DRAFT_SCHEMA, PromptCoachDraftStatus: PROMPT_COACH_DRAFT_STATUSES,
    createPromptDraftVersion: createDraft, reviewPromptDraftElements: (input, actor) => clone(own(drafts, input.promptDraftVersionId, actor).elementReviews),
    createPromptCoachDraft: (input, actor) => { const result = createDraft(input, actor); return { draft: canonicalPromptCoachDraft(result.draft, actor), automaticallySent: false }; }, getPromptCoachDraft, listPromptCoachDrafts, listPromptDraftHistory, renamePromptDraft, setPromptDraftFavourite, deletePromptDraft, markPromptDraftUsed, duplicatePromptDraft,
    generatePromptText: (input, actor) => { requireActor(actor); return { promptText: generateText(input), inferredAdditions: [], studentReviewRequired: true }; },
    previewPromptDraft: (input, actor) => ({ draft: ownerDraft(own(drafts, input.promptDraftVersionId, actor), actor), sendDefaultSelected: false }),
    approvePromptDraft: approveDraft, copyPromptDraft: (input, actor) => ({ copied: Boolean(own(drafts, input.promptDraftVersionId, actor)), sent: false }),
    sendApprovedPromptDraft: sendDraft, createPromptTestRun: createTest,
    stopPromptTestRun: (input, actor) => { const test = own(tests, input.promptTestRunId, actor); test.status = 'STOPPED'; return clone(test); },
    getPromptTestResponse: (input, actor) => clone(own(tests, input.promptTestRunId, actor)), savePromptResponseReview: saveReview,
    createPromptRevisionFromReview: (input, actor) => { own(reviews, input.responseReviewId, actor); return createDraft(input, actor); },
    comparePromptVersions: (input, actor) => ({ first: ownerDraft(own(drafts, input.firstPromptDraftVersionId, actor), actor), second: ownerDraft(own(drafts, input.secondPromptDraftVersionId, actor), actor), score: null }),
    generatePromptCoachEvidenceCandidate: generateEvidence,
    acceptPromptCoachEvidenceCandidate: (input, actor) => reviewEvidence(input, actor, true),
    declinePromptCoachEvidenceCandidate: (input, actor) => reviewEvidence(input, actor, false),
    toPromptWithPurposeLessonStudentView: () => clone(lesson), toPromptRepairScenarioStudentView: safeScenario,
    toPromptCoachSessionOwnerView: ownerSession, toPromptDraftOwnerView: ownerDraft,
    toPromptCoachTeacherPreviewView: () => ({ lesson: clone(lesson), scenarios: scenarios.map(safeScenario), studentDraftsIncluded: false, testResponsesIncluded: false, evidenceIncluded: false }),
    toPromptCoachErrorView: (error) => ({ code: error?.code || 'PROMPT_COACH_ERROR', message: error?.message || 'The prompt remains a private draft and has not been sent.' }),
    install, render,
    _test: { lesson, scenarios, templates, builderFields: BUILDER_FIELDS, starterTemplates: PROMPT_STARTER_TEMPLATES, promptTemplateCategories: PROMPT_TEMPLATE_CATEGORIES, promptTemplateLibrary: PROMPT_TEMPLATE_LIBRARY, promptComparisonExamples: PROMPT_COMPARISON_EXAMPLES, guidedBuilderSteps: GUIDED_BUILDER_STEPS, guidedLearningModes: GUIDED_LEARNING_MODES, guidedHelpOptions: GUIDED_HELP_OPTIONS, guidedFormatOptions: GUIDED_FORMAT_OPTIONS, guidedSourceOptions: GUIDED_SOURCE_OPTIONS, academicWorkTypes: ACADEMIC_WORK_TYPES, aiAssistancePermissions: AI_ASSISTANCE_PERMISSIONS, templateGuidedValues, guidedDraftInput, newGuidedBuilderState, promptQualityChecks, revalidateLearningModePolicy, academicIntegrityCheck, privacyPatterns: PRIVACY_PATTERNS, scanPromptPrivacy, redactPromptPrivacy, newImprovePromptState, improveSuggestions, improvedPromptText, improveReviewComplete, improvePrivacyClear, improveDraftInput, filteredPromptTemplates, promptLibraryPreview, sessions, drafts, tests, reviews, evidence, configurations, readiness, generateText, effectiveAttemptRule, enforceBoundary, clean, hasPrivateData }
  });

  root.PromptWritingCoach = API;
  if (typeof module === 'object' && module.exports) module.exports = API;
  if (root.document) root.document.readyState === 'loading' ? root.document.addEventListener('DOMContentLoaded', install) : install();
})(typeof window !== 'undefined' ? window : globalThis);
