(function(root){
  'use strict';

  const d = typeof document !== 'undefined' ? document : null;
  const HELP_HOME_ROUTE = '/help';
  const HELP_PAGE_STATES = Object.freeze([
    'No search results',
    'Guide unavailable',
    'Content loading',
    'Offline',
    'Reconnecting',
    'Old step redirected',
    'Unexpected error',
  ]);
  const REQUIRED_GUIDE_IDS = Object.freeze([
    'getting-started',
    'personalize',
    'ai-coach',
    'responsible-ai',
    'learning',
    'assignments',
    'peer-tutoring',
    'projects',
    'progress',
    'privacy-and-troubleshooting',
  ]);

  const route = value => `${HELP_HOME_ROUTE}/${value}`;
  const feature = (label, view, path) => ({ label, view, path });
  const details = (label, text) => ({ label, text });

  const POPULAR_HELP = Object.freeze([
    { label:'Ask the AI Coach', guideId:'ai-coach', anchor:'ask-a-question', icon:'C' },
    { label:'Change Language or Accessibility Settings', guideId:'personalize', anchor:'language-accessibility', icon:'Aa' },
    { label:'Catch Up on Missing Work', guideId:'assignments', anchor:'catch-up', icon:'!' },
    { label:'Verify an AI Answer', guideId:'responsible-ai', anchor:'verify-an-answer', icon:'✓' },
    { label:'Start a Community AI Project', guideId:'projects', anchor:'start-project', icon:'P' },
    { label:'Restore Unsaved Work', guideId:'privacy-and-troubleshooting', anchor:'restore-work', icon:'↺' },
  ]);

  const HELP_SEARCH_STOPWORDS = new Set([
    'a','an','and','are','do','does','for','how','i','in','is','me','my','of','on','or','the','to','with',
  ]);

  const HELP_GUIDES = Object.freeze([
    {
      id:'getting-started',
      route:route('getting-started'),
      icon:'H',
      title:'Getting Started',
      description:'Open StudySpark, find your way around, save your work, and return to what you were doing.',
      readingTime:'About 3 minutes',
      quickQuestion:'How do I start using StudySpark?',
      quickAnswer:'Use the sidebar to choose a workspace, add your courses in Settings, and start with one useful action such as AI Coach, Learn, Assignments, or Projects.',
      keywords:['start','account','guest','sidebar','navigation','saving','return','course','login'],
      actions:[feature('Open Home','dashboard','/home'),feature('Open Settings','settings','/settings')],
      steps:[
        {
          anchor:'open-studyspark',
          title:'Open StudySpark and choose a workspace',
          body:'Use the sidebar for the main areas: Home, AI Coach, Learn, Assignments, Projects, Progress, Settings, and Help.',
          actions:[feature('Open Home','dashboard','/home')],
          details:[details('Learn More','Home is a quick overview. Dedicated workspaces keep major features on their own pages so you are not forced through one long tutorial.')],
        },
        {
          anchor:'guest-or-account',
          title:'Use Guest Mode or create an account',
          body:'Guest Mode lets you try StudySpark right away. Create an account when you want eligible work to transfer and be easier to keep.',
          actions:[feature('Open Account Settings','settings','/settings')],
          details:[details('Common Problems','Guest progress is temporary and may be lost if browser data is cleared. Exit Guest Mode only after reviewing the existing confirmation.')],
        },
        {
          anchor:'set-courses',
          title:'Choose your courses',
          body:'Open Settings, select current courses, or add a custom course. Course choices appear across notes, quizzes, plans, Learning Checks, and progress.',
          actions:[feature('Update Courses','settings','/settings')],
        },
        {
          anchor:'save-and-return',
          title:'Save work and return later',
          body:'StudySpark keeps notes, plans, drafts, checks, and progress records in the existing storage for your account or guest session.',
          actions:[feature('View Progress','progress','/progress')],
          details:[details('Advanced Settings','Offline and local storage controls live in Privacy, Offline Access, and Technical Help.')],
        },
        {
          anchor:'use-back-button',
          title:'Use the arrow button for child pages',
          body:'Detailed pages include an arrow-only return button near the title. Browser Back and Forward also work for Help guide navigation.',
          actions:[feature('Back to Help Centre','instructions','/help')],
        },
      ],
      related:['personalize','ai-coach','privacy-and-troubleshooting'],
    },
    {
      id:'personalize',
      route:route('personalize'),
      icon:'Aa',
      title:'Personalize StudySpark',
      description:'Adjust profile, language, reading, audio, display, accessibility, region, units, and low-bandwidth preferences.',
      readingTime:'About 4 minutes',
      quickQuestion:'How do I change language or accessibility settings?',
      quickAnswer:'Open Settings, then choose Accessibility & Language to adjust reading level, text size, contrast, motion, speech, bilingual support, and low-bandwidth options.',
      keywords:['language','accessibility','text size','contrast','reduced motion','speech','listen','bilingual','low bandwidth','settings','units','region'],
      actions:[feature('Open Accessibility & Language','accessibilityLanguage','/settings/accessibility-language'),feature('Open Settings','settings','/settings')],
      steps:[
        {
          anchor:'profile-settings',
          title:'Open your profile settings',
          body:'Use Account Settings to update your name, grade, courses, and saved course list when your account permits it.',
          actions:[feature('Open Settings','settings','/settings')],
        },
        {
          anchor:'language-accessibility',
          title:'Choose language and accessibility preferences',
          body:'Use Accessibility & Language for interface language, home language, reading level, bilingual explanations, text-to-speech, and speech-to-text.',
          actions:[feature('Open Accessibility & Language','accessibilityLanguage','/settings/accessibility-language')],
        },
        {
          anchor:'display-support',
          title:'Make the display comfortable',
          body:'Increase text size, enable high contrast, reduce motion, and use layouts that remain readable at high zoom.',
          details:[details('View an Example','If text feels crowded, increase text size first, then turn on reduced motion or high contrast if those help you focus.')],
        },
        {
          anchor:'language-support-row',
          title:'Use compact help support inside guides',
          body:'Help guides show a small support row instead of repeating a large Language and Explanation section under every instruction.',
          details:[details('Learn More','Use Listen for audio. Use Help Me Understand to simplify, show English plus your language, or explain key words.')],
        },
        {
          anchor:'low-bandwidth',
          title:'Choose low-bandwidth and offline options',
          body:'Low-bandwidth mode keeps essential learning workflows available when the connection is slow, unstable, or temporarily offline.',
          actions:[feature('Open Offline and Storage','privacyData','/settings/privacy-offline-data')],
        },
      ],
      related:['getting-started','ai-coach','privacy-and-troubleshooting'],
    },
    {
      id:'ai-coach',
      route:route('ai-coach'),
      icon:'C',
      title:'Learn With the AI Coach',
      description:'Choose a learning mode, ask a question, use Prompt Coach, and review AI responses without giving up ownership of your work.',
      readingTime:'About 4 minutes',
      quickQuestion:'How do I ask the AI Coach for help?',
      quickAnswer:'Choose a learning mode, describe what you understand, type the specific help you need, and review the response before using it.',
      keywords:['coach','prompt','hint','guiding questions','similar example','reasoning','quiz me','final answer','learning mode','simpler'],
      actions:[feature('Open AI Coach','coach','/ai-coach'),feature('Open Prompt Coach','promptWithPurpose','/ai-coach/prompt-coach')],
      steps:[
        {
          anchor:'learning-modes',
          title:'Choose a learning mode',
          body:'Pick the kind of help you want, such as a hint, guiding questions, simpler language, a similar example, reasoning feedback, or a quiz.',
          actions:[feature('Open AI Coach','coach','/ai-coach')],
          details:[details('Common Problems','If final answers are restricted by an assignment or active test, StudySpark keeps the lock in place and guides you with questions instead.')],
        },
        {
          anchor:'ask-a-question',
          title:'Type your own question',
          body:'Use the Ask StudySpark Coach text box. Starter prompts can fill the box, but you can edit them before pressing Send.',
          actions:[feature('Ask StudySpark Coach','coach','/ai-coach')],
        },
        {
          anchor:'read-response',
          title:'Read and improve the response',
          body:'Response tools can make the answer simpler, add detail, translate, define key words, show steps, or give another example while keeping the original visible.',
          details:[details('Learn More','Response tools belong beneath the relevant AI response or in the Response Tools section, not mixed into the message composer.')],
        },
        {
          anchor:'prompt-coach',
          title:'Use Prompt Coach when you need a better request',
          body:'Prompt Coach helps you build, improve, save, and reuse prompts without sending anything automatically.',
          actions:[feature('Open Prompt Coach','promptWithPurpose','/ai-coach/prompt-coach'),feature('Browse Prompt Templates','promptTemplates','/ai-coach/prompt-coach/templates')],
        },
        {
          anchor:'student-ownership',
          title:'Keep ownership of your learning',
          body:'Use hints, checks, examples, and questions to improve your own work. Do not ask the AI Coach to replace your thinking or submit work for you.',
          details:[details('Advanced Settings','Assignment policies, active-test restrictions, privacy checks, and final-answer locks remain enforced by the existing StudySpark safeguards.')],
        },
      ],
      related:['responsible-ai','learning','personalize'],
    },
    {
      id:'responsible-ai',
      route:route('responsible-ai'),
      icon:'✓',
      title:'Check AI Answers and Use AI Responsibly',
      description:'Verify answers, compare sources, map claims to evidence, create receipts, and follow academic-integrity expectations.',
      readingTime:'About 5 minutes',
      quickQuestion:'How do I check whether an AI answer is safe to use?',
      quickAnswer:'Break the answer into claims, check sources and assumptions, note uncertainty, revise the answer, and create an AI Use Receipt when disclosure is needed.',
      keywords:['verify','answer','source','claim','evidence','receipt','disclosure','confidence','assumptions','privacy','integrity','citation'],
      actions:[feature('Verify an Answer','answerVerification','/ai-coach/verify-answer'),feature('Create AI Use Receipt','aiUseReceipt','/ai-coach/receipts')],
      steps:[
        {
          anchor:'verify-an-answer',
          title:'Identify the claims',
          body:'Paste an AI answer, explanation, calculation, or source-supported response into Verify an Answer, then identify what needs checking.',
          actions:[feature('Open Verify an Answer','answerVerification','/ai-coach/verify-answer')],
        },
        {
          anchor:'check-sources',
          title:'Check the sources',
          body:'Use source comparison to inspect relevance, accuracy, currency, bias, missing context, and whether a citation actually supports the claim.',
          actions:[feature('Open Source Comparison','sourceComparison','/ai-coach/source-comparison')],
          details:[details('Common Problems','A confident tone is not proof. If a source cannot be found or does not support the statement, mark the claim as unresolved.')],
        },
        {
          anchor:'map-claims',
          title:'Connect claims to evidence',
          body:'Use Claim–Evidence Map to pair each claim with evidence, reasoning, assumptions, and limits.',
          actions:[feature('Open Claim–Evidence Map','claimEvidenceMap','/ai-coach/claim-evidence-map')],
        },
        {
          anchor:'record-use',
          title:'Record what was confirmed or unresolved',
          body:'Create an AI Use Receipt to document AI assistance, your contribution, verification steps, and disclosure notes.',
          actions:[feature('Open AI Use Receipts','aiUseReceipt','/ai-coach/receipts')],
        },
        {
          anchor:'integrity-privacy',
          title:'Follow integrity and privacy rules',
          body:'Do not paste private information, active-test questions, confidential records, or another student’s private data. Follow assignment policy before using AI help.',
          details:[details('Advanced Settings','Policy warnings require review. StudySpark does not let the client mark answers correct, bypass final-answer locks, or invent citations.')],
        },
      ],
      related:['ai-coach','privacy-and-troubleshooting','progress'],
    },
    {
      id:'learning',
      route:route('learning'),
      icon:'L',
      title:'Learn, Practise, and Check Understanding',
      description:'Use lessons, practice questions, Learning Checks, study rooms, Teach It Back, retries, vocabulary, and audio summaries.',
      readingTime:'About 4 minutes',
      quickQuestion:'How do I practise without getting overwhelmed?',
      quickAnswer:'Start with the next recommended lesson or a short Learning Check, then review mistakes and choose one focused practice action.',
      keywords:['learn','practice','learning check','quiz','flashcards','teach it back','retry','mistakes','vocabulary','audio'],
      actions:[feature('Open Learn','aiLiteracy','/learn'),feature('Start Learning Check','aiDiagnostic','/learn/learning-check')],
      steps:[
        {
          anchor:'choose-pathway',
          title:'Choose a learning pathway',
          body:'Open Learn to choose Understand, Apply, or Create, then pick a module or continue the next lesson.',
          actions:[feature('Open Learn','aiLiteracy','/learn')],
        },
        {
          anchor:'learning-check',
          title:'Start a short Learning Check',
          body:'Choose the subject, grade, topic, difficulty, question count, and question type. Confirm setup before questions begin.',
          actions:[feature('Open Learning Check','aiDiagnostic','/learn/learning-check')],
        },
        {
          anchor:'one-question',
          title:'Answer one question at a time',
          body:'Use hints, explanations, “I’m Not Sure,” Previous, Next, and Submit Answer without revealing the correct answer too early.',
        },
        {
          anchor:'review-mistakes',
          title:'Review results and next steps',
          body:'After submitting, review your score, time, skills understood, skills needing practice, explanations, recommended lessons, and support options.',
          details:[details('View an Example','If a skill is developing, choose similar questions or create a practice plan before moving to a harder topic.')],
        },
        {
          anchor:'extra-practice',
          title:'Use practice and study supports',
          body:'Flashcards, quizzes, Teach It Back, Independent Retry, audio summaries, vocabulary support, and study rooms can help reinforce learning.',
          actions:[feature('Open Quiz Generator','quiz','/quiz'),feature('Open Flashcards','flashcards','/flashcards')],
        },
      ],
      related:['ai-coach','progress','assignments'],
    },
    {
      id:'assignments',
      route:route('assignments'),
      icon:'A',
      title:'Assignments and Catch-Up Support',
      description:'Track deadlines, build realistic catch-up plans, break work into actions, and prepare teacher or parent summaries.',
      readingTime:'About 5 minutes',
      quickQuestion:'How do I catch up on missing work?',
      quickAnswer:'Open Assignments, choose Help Me Catch Up or Recovery Plan, confirm what is due, then build a realistic plan that preserves your existing progress.',
      keywords:['assignment','catch up','recovery','deadline','test tomorrow','missed week','missed month','teacher message','parent summary','workload'],
      actions:[feature('Open Assignments','planner','/assignments'),feature('Open Recovery Plan','academicRecovery','/assignments/recovery-plan')],
      steps:[
        {
          anchor:'review-assignments',
          title:'Review the assignment and deadline',
          body:'Open Assignments to check what is due, what is missing, and what progress has already been saved.',
          actions:[feature('Open Assignments','planner','/assignments')],
        },
        {
          anchor:'catch-up',
          title:'Choose catch-up support',
          body:'Use Help Me Catch Up, Recovery Plan, Test Tomorrow, Missed Week, or Missed Month based on your situation.',
          actions:[feature('Open Recovery Plan','academicRecovery','/assignments/recovery-plan')],
        },
        {
          anchor:'build-plan',
          title:'Build a realistic recovery plan',
          body:'StudySpark separates confirmed facts, estimates, unknowns, conflicts, and capacity so the plan does not pretend everything can be done at once.',
          details:[details('Learn More','Recovery plans remain private until you choose to share, submit, or export something. The system does not delete your old progress.')],
        },
        {
          anchor:'break-work',
          title:'Break work into smaller actions',
          body:'Use task decomposition to turn a big assignment into clear next actions with definitions of done.',
        },
        {
          anchor:'ask-for-help',
          title:'Prepare messages and summaries',
          body:'Teacher-message drafts and parent-friendly summaries remain drafts until you review and choose what to do with them.',
        },
      ],
      related:['learning','peer-tutoring','privacy-and-troubleshooting'],
    },
    {
      id:'peer-tutoring',
      route:route('peer-tutoring'),
      icon:'T',
      title:'Peer Tutoring and Community Service',
      description:'Request tutoring, become a verified peer tutor, book safe sessions, and keep credits separate from approved service hours.',
      readingTime:'About 5 minutes',
      quickQuestion:'How does peer tutoring work?',
      quickAnswer:'Students request help, verified tutors offer approved subject support, sessions stay inside StudySpark, and service hours require authorized review.',
      keywords:['tutor','peer tutoring','service hours','booking','session','help credits','community service','verification','safety'],
      actions:[feature('Open Peer Tutoring','peerTutoring','/peer-tutoring'),feature('Open Bookings & Sessions','bookingSessions','/peer-tutoring/sessions')],
      steps:[
        {
          anchor:'request-help',
          title:'Request academic help',
          body:'Choose the subject, topic, grade level, and kind of help you need. Keep communication and booking inside StudySpark.',
          actions:[feature('Open Tutoring Requests','tutoringRequests','/peer-tutoring/requests')],
        },
        {
          anchor:'become-tutor',
          title:'Become a verified peer tutor',
          body:'Tutors list subjects and grade levels, submit qualifications, and wait for authorized verification before tutoring as a verified tutor.',
          actions:[feature('Open Peer Tutoring','peerTutoring','/peer-tutoring')],
        },
        {
          anchor:'book-session',
          title:'Book and document a session',
          body:'Use booking, attendance, pre-session coaching, and post-session records to keep sessions safe and documented.',
          actions:[feature('Open Bookings & Sessions','bookingSessions','/peer-tutoring/sessions')],
        },
        {
          anchor:'service-hours',
          title:'Keep service hours and credits separate',
          body:'Internal Help Credits are not official community-service hours. Official hours belong only to the tutor who completed the service and require approval.',
          actions:[feature('Open Help Credits','helpCredits','/peer-tutoring/sessions')],
          details:[details('Advanced Settings','Schools or authorized organizations approve or reject completed service-hour records and may add comments when rejecting a record.')],
        },
        {
          anchor:'safety-reporting',
          title:'Use safety and reporting tools',
          body:'Parents, guardians, school verifiers, and administrators have separate review or safety responsibilities. Reports do not replace emergency support.',
        },
      ],
      related:['assignments','progress','privacy-and-troubleshooting'],
    },
    {
      id:'projects',
      route:route('projects'),
      icon:'P',
      title:'Build a Community AI Project',
      description:'Move from community need to responsible AI design with problem scope, system card, architecture, data responsibility, testing, feedback, and reflection.',
      readingTime:'About 5 minutes',
      quickQuestion:'How do I start a Community AI Project?',
      quickAnswer:'Start by understanding the need, define the problem, document the system, design the architecture, plan responsible data use, then build, test, revise, and reflect.',
      keywords:['project','community ai project','problem scope','system card','architecture','data responsibility','prototype','fairness','accessibility','stakeholders'],
      actions:[feature('Open Projects','communityAIProject','/projects'),feature('Open Problem Scope','problemScopingStudio','/projects/problem-scope')],
      steps:[
        {
          anchor:'start-project',
          title:'Understand the need',
          body:'Identify a real community need, speak with stakeholders where appropriate, and decide whether AI is actually suitable for the problem.',
          actions:[feature('Open Projects','communityAIProject','/projects')],
        },
        {
          anchor:'problem-scope',
          title:'Define the problem',
          body:'Use Problem Scope to clarify users, constraints, evidence, success measures, and when a non-AI approach would be better.',
          actions:[feature('Open Problem Scope','problemScopingStudio','/projects/problem-scope')],
        },
        {
          anchor:'system-card',
          title:'Document the proposed system',
          body:'Use System Card to describe intended users, purpose, limits, risks, testing, human oversight, and what the system should not do.',
          actions:[feature('Open System Card','aiSystemCardStudio','/projects/system-card')],
        },
        {
          anchor:'architecture',
          title:'Design how the system works',
          body:'Use Architecture to show interfaces, data flows, AI components, human review, external tools, and failure points.',
          actions:[feature('Open Architecture','aiArchitectureDesignStudio','/projects/architecture')],
        },
        {
          anchor:'data-responsibility',
          title:'Plan responsible data use',
          body:'Use Data Responsibility to plan purpose, permission, classification, retention, privacy, consent, access, and review.',
          actions:[feature('Open Data Responsibility','dataResponsibilityStudio','/projects/data-responsibility')],
        },
        {
          anchor:'build-test-revise',
          title:'Build, test, revise, and reflect',
          body:'Prototype carefully, test accuracy and safety, evaluate fairness and accessibility, collect feedback, revise, and reflect on impact.',
          details:[details('Common Problems','Do not skip testing because a prototype looks polished. Responsible projects need evidence, feedback, and human review.')],
        },
      ],
      related:['responsible-ai','progress','personalize'],
    },
    {
      id:'progress',
      route:route('progress'),
      icon:'G',
      title:'Track and Show Your Progress',
      description:'Review competencies, add evidence, write reflections, request review, create selected portfolio reports, and request corrections.',
      readingTime:'About 5 minutes',
      quickQuestion:'How do I show what I have learned?',
      quickAnswer:'Review Competency Progress, add evidence to your Portfolio, reflect in your own words, request teacher review when ready, and create a selected report only after privacy review.',
      keywords:['progress','portfolio','competency','evidence','reflection','teacher verified','report','share','correction','milestones'],
      actions:[feature('Open Progress','progress','/progress'),feature('Open Competency Portfolio','competencyPortfolio','/progress/portfolio')],
      steps:[
        {
          anchor:'review-progress',
          title:'Review your current progress',
          body:'Open Progress to see saved learning activity, Learning Checks, skill trends, and competency areas that are developing.',
          actions:[feature('Open Progress','progress','/progress')],
        },
        {
          anchor:'competency-progress',
          title:'Check competency progress',
          body:'Competency Progress organizes Understand, Apply, and Create skills without relying on colour alone.',
          actions:[feature('Open Competency Progress','aiCompetencyProgress','/learn/competency-progress')],
        },
        {
          anchor:'add-evidence',
          title:'Add evidence to your Portfolio',
          body:'Choose evidence intentionally from StudySpark work, files, links, projects, reflections, or learning results. Drafts stay private by default.',
          actions:[feature('Open Competency Portfolio','competencyPortfolio','/progress/portfolio'),feature('Add Evidence','portfolioAddEvidence','/progress/portfolio/add-evidence')],
        },
        {
          anchor:'student-reflection',
          title:'Reflect in your own words',
          body:'Every submitted evidence item needs a student-created reflection. AI can help organize or clarify, but it must not invent your experience.',
        },
        {
          anchor:'teacher-review',
          title:'Submit for review when ready',
          body:'Authorized reviewers can leave feedback, request more evidence, or verify a skill. Students must see why evidence needs revision or is not enough.',
        },
        {
          anchor:'portfolio-report',
          title:'Build a selected portfolio report',
          body:'Choose exactly which sections and evidence items to include. Nothing is printed, exported, shared, or published automatically.',
          actions:[feature('Create Portfolio Report','portfolioReportBuilder','/progress/portfolio/report'),feature('Request a Correction','metricCorrectionRequest','/progress/responsible-ai-measures/correction')],
        },
      ],
      related:['learning','projects','responsible-ai'],
    },
    {
      id:'privacy-and-troubleshooting',
      route:route('privacy-and-troubleshooting'),
      icon:'🔒',
      title:'Privacy, Offline Access, and Technical Help',
      description:'Protect private information, manage local data, restore drafts, use offline options, recover from loading problems, and contact support.',
      readingTime:'About 4 minutes',
      quickQuestion:'What should I do if something is private, offline, or not loading?',
      quickAnswer:'Keep private information out of prompts, use Offline and Storage controls for local work, retry failed loads without deleting drafts, and contact support when a workflow cannot recover.',
      keywords:['privacy','offline','storage','restore','draft','connection','reconnecting','technical','troubleshooting','notifications','delete','support'],
      actions:[feature('Open Privacy and Offline Settings','privacyData','/settings/privacy-offline-data'),feature('Open Notifications','notifications','/settings/notifications')],
      steps:[
        {
          anchor:'privacy-checks',
          title:'Protect private information',
          body:'Do not paste full names, student numbers, home addresses, phone numbers, passwords, medical details, financial information, immigration information, or private information about another student.',
          actions:[feature('Open Privacy Settings','privacyData','/settings/privacy-offline-data')],
        },
        {
          anchor:'restore-work',
          title:'Restore drafts and unsaved work',
          body:'If a draft exists locally or is waiting to synchronize, StudySpark should show a recovery option instead of treating missing data as empty.',
          actions:[feature('Open Offline and Storage','privacyData','/settings/privacy-offline-data')],
          details:[details('Common Problems','A loading failure is not the same as an empty state. Retry first so existing records are not hidden by a temporary error.')],
        },
        {
          anchor:'offline-reconnecting',
          title:'Use offline and low-bandwidth states',
          body:'When offline, continue only supported local work. When reconnecting, wait for synchronization before assuming a save failed.',
        },
        {
          anchor:'notifications',
          title:'Manage notifications',
          body:'Temporary toast popups disappear quickly, but saved notifications remain available until you intentionally delete or archive them.',
          actions:[feature('Open Notifications','notifications','/settings/notifications')],
        },
        {
          anchor:'technical-help',
          title:'Recover from page or connection problems',
          body:'Use retry actions, return to the Help Centre, or contact support. A released feature should never leave you on a blank or generic unavailable page.',
          actions:[feature('Contact Support','wellBeingHelpSafety','/help/safety')],
        },
      ],
      related:['personalize','getting-started','responsible-ai'],
    },
  ]);

  const GUIDE_MAP = Object.freeze(Object.fromEntries(HELP_GUIDES.map(guide => [guide.id, guide])));
  const HELP_STEP_REDIRECT_OVERRIDES = Object.freeze({
    14:{ guideId:'ai-coach', anchor:'learning-modes' },
    29:{ guideId:'responsible-ai', anchor:'verify-an-answer' },
    51:{ guideId:'projects', anchor:'system-card' },
  });

  const LEGACY_RANGE_MAP = Object.freeze([
    { start:1, end:10, guideId:'getting-started', anchor:'open-studyspark' },
    { start:11, end:18, guideId:'progress', anchor:'review-progress' },
    { start:19, end:23, guideId:'peer-tutoring', anchor:'request-help' },
    { start:24, end:28, guideId:'progress', anchor:'review-progress' },
    { start:29, end:36, guideId:'responsible-ai', anchor:'verify-an-answer' },
    { start:37, end:44, guideId:'assignments', anchor:'catch-up' },
    { start:45, end:50, guideId:'privacy-and-troubleshooting', anchor:'restore-work' },
    { start:51, end:58, guideId:'projects', anchor:'system-card' },
    { start:59, end:63, guideId:'privacy-and-troubleshooting', anchor:'offline-reconnecting' },
    { start:64, end:73, guideId:'personalize', anchor:'language-accessibility' },
  ]);

  const CONTEXTUAL_HELP_LINKS = Object.freeze([
    { viewId:'answerVerificationView', id:'verify-answer-context-help', label:'How verification works', guideId:'responsible-ai', anchor:'verify-an-answer' },
    { viewId:'problemScopingStudioView', id:'problem-scope-context-help', label:'How to define a problem', guideId:'projects', anchor:'problem-scope' },
    { viewId:'aiUseReceiptView', id:'ai-use-receipt-context-help', label:'When disclosure may be needed', guideId:'responsible-ai', anchor:'record-use' },
    { viewId:'competencyPortfolioView', id:'portfolio-context-help', label:'What counts as evidence', guideId:'progress', anchor:'add-evidence' },
  ]);

  const state = {
    initialized:false,
    legacyAudit:[],
    migrationMap:null,
    currentGuideId:null,
    searchQuery:'',
  };

  function esc(value){
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#39;',
    }[char]));
  }

  function clean(value){
    return String(value ?? '').replace(/\s+/g,' ').trim();
  }

  function currentRoute(){
    if(!d || !root.location) return { path:HELP_HOME_ROUTE, anchor:'' };
    if(root.location.hash && root.location.hash.startsWith('#/')){
      const raw = root.location.hash.slice(1);
      const hashIndex = raw.indexOf('#');
      return {
        path:hashIndex >= 0 ? raw.slice(0, hashIndex) : raw,
        anchor:hashIndex >= 0 ? raw.slice(hashIndex + 1) : '',
      };
    }
    return {
      path:root.location.pathname || HELP_HOME_ROUTE,
      anchor:(root.location.hash || '').replace(/^#/,''),
    };
  }

  function shouldUseHashRoutes(){
    if(!root.location) return false;
    return root.location.protocol === 'file:' ||
      /index(?:%20|\s)?\(?2\)?\.html$/i.test(root.location.pathname || '') ||
      root.location.hostname === '127.0.0.1' ||
      root.location.hostname === 'localhost';
  }

  function routeHref(path, anchor=''){
    const suffix = anchor ? `#${anchor}` : '';
    return shouldUseHashRoutes() ? `#${path}${suffix}` : `${path}${suffix}`;
  }

  function pushHelpRoute(path, anchor='', replace=false){
    if(!root.history || !root.location) return;
    const target = routeHref(path, anchor);
    const current = shouldUseHashRoutes()
      ? root.location.hash
      : `${root.location.pathname}${root.location.hash}`;
    if(current === target) return;
    root.history[replace ? 'replaceState' : 'pushState']({ studySparkHelp:path, anchor }, '', target);
  }

  function guideHref(guideId, anchor=''){
    const guide = GUIDE_MAP[guideId] || GUIDE_MAP['getting-started'];
    return routeHref(guide.route, anchor);
  }

  function featureHref(path){
    return routeHref(path || HELP_HOME_ROUTE);
  }

  function setAppChrome(title, breadcrumb='HELP'){
    if(!d) return;
    const crumb = d.getElementById('breadcrumb');
    const viewTitle = d.getElementById('viewTitle');
    if(crumb) crumb.textContent = breadcrumb;
    if(viewTitle) viewTitle.textContent = title;
    if(d.title !== `${title} · StudySpark AI Coach`) d.title = `${title} · StudySpark AI Coach`;
    root.StudySparkNavigation?.syncActive?.('instructions');
  }

  function helpCentreIsActive(){
    return !!(
      d?.getElementById('instructionsView')?.classList.contains('active') ||
      d?.getElementById('helpCentreGuideView')?.classList.contains('active')
    );
  }

  function collectLegacySteps(){
    if(!d) return state.legacyAudit;
    const articles = Array.from(d.querySelectorAll('#instructionsView .instruction-grid article'));
    if(!articles.length) return state.legacyAudit;
    const seen = new Map();
    state.legacyAudit = articles.map((article, index) => {
      const visibleNumber = clean(article.querySelector(':scope > span')?.textContent || '');
      const numericNumber = Number.parseInt(visibleNumber, 10);
      const title = clean(article.querySelector('h3,h2')?.textContent || `Help item ${index + 1}`);
      const text = clean(Array.from(article.querySelectorAll('p,li')).map(node => node.textContent).join(' ') || article.textContent);
      const classification = classifyLegacyStep(title, text);
      const normalTitle = title.toLowerCase().replace(/^how (to|your)\s+/,'').replace(/^understanding\s+/,'').replace(/\s+/g,' ').trim();
      const duplicateOf = seen.get(normalTitle) || null;
      seen.set(normalTitle, visibleNumber || String(index + 1));
      return Object.freeze({
        currentStepNumber:Number.isFinite(numericNumber) ? numericNumber : index + 1,
        sourceOrder:index + 1,
        currentTitle:title,
        mainPurpose:classification.purpose,
        relatedFeature:classification.feature,
        unique:!duplicateOf,
        duplicatesAnotherStep:duplicateOf,
        recommendedAction:duplicateOf ? 'Remove Duplicate' : classification.action,
        newDestinationGuide:classification.guideId,
        newDestinationAnchor:classification.anchor,
        sourceText:text,
      });
    });
    state.migrationMap = buildMigrationMap(state.legacyAudit);
    return state.legacyAudit;
  }

  function classifyLegacyStep(title, text){
    const haystack = `${title} ${text}`.toLowerCase();
    const pick = (guideId, anchor, featureName, purpose, action='Combine') => ({ guideId, anchor, feature:featureName, purpose, action });
    if(/problem scope|system card|architecture|data responsibility|community ai project|prototype|fairness|stakeholder|project/i.test(haystack)) return pick('projects', /system card/.test(haystack)?'system-card':/architecture/.test(haystack)?'architecture':/data responsibility/.test(haystack)?'data-responsibility':'start-project', 'Community AI Project', 'Guide students through responsible project design');
    if(/verify|source|claim|evidence map|receipt|disclosure|citation|confidence|assumption|integrity|final answer|active test|ai use/i.test(haystack)) return pick('responsible-ai', /receipt|disclosure/.test(haystack)?'record-use':/source/.test(haystack)?'check-sources':/claim|evidence map/.test(haystack)?'map-claims':'verify-an-answer', 'Responsible AI tools', 'Check AI outputs and document appropriate use');
    if(/coach|prompt|learning mode|hint|guiding|similar example|reasoning|quiz me|simpler/i.test(haystack)) return pick('ai-coach', /prompt/.test(haystack)?'prompt-coach':'learning-modes', 'AI Coach', 'Ask focused questions and review AI support safely');
    if(/learning check|quiz|flashcard|practice|teach it back|retry|vocabulary|audio lesson|lesson|module|pathway/i.test(haystack)) return pick('learning', /learning check/.test(haystack)?'learning-check':'choose-pathway', 'Learn workspace', 'Practise and check understanding');
    if(/assignment|recovery|catch up|deadline|missed|test tomorrow|seven-day|teacher message|parent summary|workload|study plan/i.test(haystack)) return pick('assignments', /recovery|catch|missed|seven|workload/.test(haystack)?'catch-up':'review-assignments', 'Assignments and recovery', 'Manage deadlines and build realistic recovery plans');
    if(/tutor|tutoring|service hour|help credit|booking|session|community service|study match|friend|presence|study room|group/i.test(haystack)) return pick('peer-tutoring', /service|credit/.test(haystack)?'service-hours':/booking|session/.test(haystack)?'book-session':'request-help', 'Peer tutoring and collaboration', 'Use safe peer learning and service workflows');
    if(/progress|portfolio|competenc|evidence|reflection|verified|milestone|exam readiness|prediction|profile|well-being/i.test(haystack)) return pick('progress', /portfolio|evidence|reflection/.test(haystack)?'add-evidence':'review-progress', 'Progress and portfolio', 'Track progress and curate evidence');
    if(/privacy|offline|storage|connection|notification|restore|delete|student id|support|safety|data|guest data|browser/i.test(haystack)) return pick('privacy-and-troubleshooting', /offline|restore|connection/.test(haystack)?'restore-work':'privacy-checks', 'Privacy and troubleshooting', 'Protect data and recover from technical issues');
    if(/settings|language|accessibility|contrast|motion|speech|text-to-speech|speech-to-text|bilingual|low-bandwidth|course|region|unit/i.test(haystack)) return pick('personalize', 'language-accessibility', 'Settings', 'Personalize language, accessibility, and courses');
    if(/account|guest|folder|notes|upload|save|sidebar|navigation|create your account/i.test(haystack)) return pick('getting-started', /guest/.test(haystack)?'guest-or-account':/course/.test(haystack)?'set-courses':'open-studyspark', 'Getting started', 'Start using StudySpark and save work');
    return pick('getting-started', 'open-studyspark', 'General Help', 'Move general setup guidance into the Help Centre', 'Shorten');
  }

  function fallbackDestinationForStep(number){
    const range = LEGACY_RANGE_MAP.find(item => number >= item.start && number <= item.end) || LEGACY_RANGE_MAP[0];
    return { guideId:range.guideId, anchor:range.anchor };
  }

  function destinationPath(destination){
    const guide = GUIDE_MAP[destination.guideId] || GUIDE_MAP['getting-started'];
    return `${guide.route}${destination.anchor ? `#${destination.anchor}` : ''}`;
  }

  function buildMigrationMap(audit){
    const map = {};
    const maxStep = Math.max(73, ...audit.map(item => Number(item.currentStepNumber) || 0));
    for(let number = 1; number <= maxStep; number += 1){
      const matching = audit.find(item => item.currentStepNumber === number);
      const destination = matching
        ? { guideId:matching.newDestinationGuide, anchor:matching.newDestinationAnchor }
        : fallbackDestinationForStep(number);
      map[number] = destinationPath(destination);
    }
    Object.keys(HELP_STEP_REDIRECT_OVERRIDES).forEach(key => {
      map[key] = destinationPath(HELP_STEP_REDIRECT_OVERRIDES[key]);
    });
    return Object.freeze(map);
  }

  function ensureMigrationMap(){
    if(!state.migrationMap) state.migrationMap = buildMigrationMap(state.legacyAudit);
    return state.migrationMap;
  }

  function guideCardMarkup(guide){
    return `<article class="help-topic-card" data-help-card="${esc(guide.id)}">
      <div class="help-card-icon" aria-hidden="true">${esc(guide.icon)}</div>
      <div class="help-topic-card-body">
        <h2>${esc(guide.title)}</h2>
        <p>${esc(guide.description)}</p>
        <span class="help-reading-time">${esc(guide.readingTime)}</span>
      </div>
      <a class="btn btn-secondary help-open-guide" href="${esc(guideHref(guide.id))}" data-help-guide="${esc(guide.id)}">Open Guide <span aria-hidden="true">→</span></a>
    </article>`;
  }

  function popularMarkup(item){
    return `<a class="help-popular-link" href="${esc(guideHref(item.guideId, item.anchor))}" data-help-guide="${esc(item.guideId)}" data-help-anchor="${esc(item.anchor)}">
      <span aria-hidden="true">${esc(item.icon)}</span>
      <span>${esc(item.label)}</span>
    </a>`;
  }

  function connectionStatusMarkup(){
    return `<div class="help-centre-status-stack" aria-live="polite">
      <p class="help-page-state help-page-state--offline" data-help-state="offline" ${d && navigator.onLine ? 'hidden' : ''}><strong>Offline</strong> — Help guides remain readable. Some feature links may need a connection.</p>
      <p class="help-page-state help-page-state--reconnecting" data-help-state="reconnecting" hidden><strong>Reconnecting</strong> — StudySpark is checking the connection. Saved work has not been deleted.</p>
    </div>`;
  }

  function renderHome(){
    if(!d) return;
    const view = d.getElementById('instructionsView');
    if(!view) return;
    collectLegacySteps();
    view.dataset.firstScreenReady = 'true';
    view.setAttribute('aria-labelledby','helpCentreTitle');
    view.classList.add('help-centre-view');
    view.innerHTML = `<main class="help-centre-shell">
      <p class="help-page-state help-page-state--loading" data-help-state="content-loading" hidden><strong>Content loading</strong> — Help Centre is preparing your guides.</p>
      ${connectionStatusMarkup()}
      <header class="help-centre-hero">
        <div>
          <span class="kicker">HELP CENTRE</span>
          <h1 id="helpCentreTitle" tabindex="-1">Help Centre</h1>
          <p class="help-centre-subtitle">What do you need help with?</p>
        </div>
        <a class="help-contact-pill" href="${esc(guideHref('privacy-and-troubleshooting','technical-help'))}" data-help-guide="privacy-and-troubleshooting" data-help-anchor="technical-help">Contact Support</a>
      </header>
      <section class="help-search-card" aria-labelledby="helpSearchTitle">
        <label id="helpSearchTitle" for="studySparkHelpSearch">Search StudySpark Help</label>
        <div class="help-search-field">
          <span aria-hidden="true">⌕</span>
          <input id="studySparkHelpSearch" type="search" autocomplete="off" value="${esc(state.searchQuery)}" placeholder="How do I change the language?">
        </div>
        <p class="help-search-hint">Try: verify an AI answer, catch up on missing work, start a project, restore unsaved work.</p>
        <div id="helpSearchResults" class="help-search-results" aria-live="polite"></div>
      </section>
      <section class="help-popular-section" aria-labelledby="popularHelpTitle">
        <div class="help-section-heading">
          <h2 id="popularHelpTitle">Popular Help</h2>
          <p>Open the guide section that matches what you need right now.</p>
        </div>
        <div class="help-popular-grid">${POPULAR_HELP.map(popularMarkup).join('')}</div>
      </section>
      <section class="help-topic-section" aria-labelledby="helpGuideCardsTitle">
        <div class="help-section-heading">
          <h2 id="helpGuideCardsTitle">Choose a Help Guide</h2>
          <p>Each guide is short, focused, and opens only when you choose it.</p>
        </div>
        <div class="help-topic-grid">${HELP_GUIDES.map(guideCardMarkup).join('')}</div>
      </section>
    </main>`;
    bindHome(view);
    if(helpCentreIsActive()) setAppChrome('Help Centre');
  }

  function bindHome(view){
    const search = view.querySelector('#studySparkHelpSearch');
    if(search){
      search.addEventListener('input', event => {
        state.searchQuery = event.target.value;
        renderSearchResults(view, state.searchQuery);
      });
      renderSearchResults(view, state.searchQuery);
    }
  }

  function guideSearchText(guide){
    return clean([
      guide.title,
      guide.description,
      guide.quickQuestion,
      guide.quickAnswer,
      ...(guide.keywords || []),
      ...guide.steps.flatMap(step => [step.title, step.body]),
    ].join(' ')).toLowerCase();
  }

  function searchTokens(query){
    return clean(query)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g,' ')
      .split(' ')
      .filter(token => token.length > 1 && !HELP_SEARCH_STOPWORDS.has(token));
  }

  function renderSearchResults(view, query){
    const box = view.querySelector('#helpSearchResults');
    if(!box) return;
    const term = clean(query).toLowerCase();
    if(!term){
      box.innerHTML = '';
      return;
    }
    const tokens = searchTokens(term);
    const matches = HELP_GUIDES.filter(guide => {
      const searchText = guideSearchText(guide);
      return searchText.includes(term) || (tokens.length > 0 && tokens.every(token => searchText.includes(token)));
    });
    if(!matches.length){
      box.innerHTML = `<section class="help-empty-state" role="status">
        <h2>No search results</h2>
        <p>We could not find a guide matching that search.</p>
        <p>Try:</p>
        <div class="help-suggestion-row">
          <a href="${esc(guideHref('ai-coach'))}" data-help-guide="ai-coach">AI Coach</a>
          <a href="${esc(guideHref('assignments'))}" data-help-guide="assignments">Assignments</a>
          <a href="${esc(guideHref('personalize','language-accessibility'))}" data-help-guide="personalize" data-help-anchor="language-accessibility">Language Settings</a>
          <a href="${esc(guideHref('projects'))}" data-help-guide="projects">Project Help</a>
        </div>
      </section>`;
      return;
    }
    box.innerHTML = `<div class="help-search-result-list" role="list">
      ${matches.map(guide => `<a role="listitem" class="help-search-result" href="${esc(guideHref(guide.id))}" data-help-guide="${esc(guide.id)}">
        <strong>${esc(guide.title)}</strong>
        <span>${esc(guide.description)}</span>
      </a>`).join('')}
    </div>`;
  }

  function ensureGuideView(){
    if(!d) return null;
    let view = d.getElementById('helpCentreGuideView');
    if(view) return view;
    view = d.createElement('section');
    view.id = 'helpCentreGuideView';
    view.className = 'app-view help-centre-guide-view';
    view.dataset.firstScreenReady = 'true';
    view.setAttribute('aria-labelledby','helpGuideTitle');
    const host = d.getElementById('viewContainer') || d.querySelector('.main-content') || d.body;
    host.appendChild(view);
    return view;
  }

  function activateGuideView(){
    const view = ensureGuideView();
    if(!view) return null;
    d.querySelectorAll('.app-view').forEach(panel => panel.classList.remove('active'));
    view.classList.add('active');
    root.StudySparkNavigation?.syncActive?.('instructions');
    const sidebarButton = d.querySelector('#appNav [data-view="instructions"]');
    if(sidebarButton){
      sidebarButton.classList.add('active');
      sidebarButton.setAttribute('aria-current','page');
    }
    return view;
  }

  function featureButtonMarkup(action){
    return `<a class="btn btn-secondary help-feature-link" href="${esc(featureHref(action.path))}" data-help-feature-view="${esc(action.view || '')}">${esc(action.label)} <span aria-hidden="true">→</span></a>`;
  }

  function stepDetailsMarkup(step){
    const entries = step.details || [];
    if(!entries.length) return '';
    return `<div class="help-step-details">${entries.map(item => `<details><summary>${esc(item.label)}</summary><p>${esc(item.text)}</p></details>`).join('')}</div>`;
  }

  function guideStepMarkup(step, index, total){
    return `<li>
      <article id="${esc(step.anchor)}" class="help-guide-step" tabindex="-1" data-help-anchor="${esc(step.anchor)}" data-learning-objective="${esc(step.title)}">
        <span class="help-step-count">Step ${index + 1} of ${total}</span>
        <h2>${esc(step.title)}</h2>
        <p>${esc(step.body)}</p>
        ${(step.actions || []).length ? `<div class="help-step-actions">${step.actions.map(featureButtonMarkup).join('')}</div>` : ''}
        ${stepDetailsMarkup(step)}
      </article>
    </li>`;
  }

  function relatedMarkup(guide){
    const related = (guide.related || []).map(id => GUIDE_MAP[id]).filter(Boolean);
    if(!related.length) return '';
    return `<section class="help-related-guides" aria-labelledby="relatedGuidesTitle">
      <h2 id="relatedGuidesTitle">Related Guides</h2>
      <div class="help-related-grid">${related.map(item => `<a href="${esc(guideHref(item.id))}" data-help-guide="${esc(item.id)}">
        <span aria-hidden="true">${esc(item.icon)}</span>
        <strong>${esc(item.title)}</strong>
        <small>${esc(item.readingTime)}</small>
      </a>`).join('')}</div>
    </section>`;
  }

  function renderGuide(guideId, options={}){
    if(!d) return;
    collectLegacySteps();
    const guide = GUIDE_MAP[guideId];
    if(!guide){
      renderUnavailableGuide(guideId);
      return;
    }
    const view = activateGuideView();
    if(!view) return;
    state.currentGuideId = guide.id;
    setAppChrome(guide.title);
    const total = Math.min(guide.steps.length, 6);
    view.innerHTML = `<main class="help-centre-guide-shell">
      ${connectionStatusMarkup()}
      ${options.redirected ? `<p class="help-page-state help-page-state--redirect" role="status"><strong>Old step redirected</strong> — This old Help link now opens the most relevant short guide.</p>` : ''}
      <header class="help-guide-header">
        <button class="study-page-back help-guide-back" type="button" data-help-home aria-label="Back to Help Centre" title="Back"><span aria-hidden="true">←</span></button>
        <div>
          <span class="kicker">HELP GUIDE</span>
          <h1 id="helpGuideTitle" tabindex="-1">${esc(guide.title)}</h1>
          <p>${esc(guide.description)}</p>
          <span class="help-guide-meta">${esc(guide.readingTime)} · ${total} steps</span>
        </div>
      </header>
      <section class="help-quick-answer" aria-labelledby="quickAnswerTitle">
        <div>
          <span class="help-quick-label">Quick Answer</span>
          <h2 id="quickAnswerTitle">${esc(guide.quickQuestion)}</h2>
          <p>${esc(guide.quickAnswer)}</p>
        </div>
        <div class="help-quick-actions">${(guide.actions || []).slice(0,2).map(featureButtonMarkup).join('')}</div>
      </section>
      <ol class="help-guide-steps">${guide.steps.slice(0,6).map((step,index) => guideStepMarkup(step,index,total)).join('')}</ol>
      <footer class="help-guide-footer">
        <section class="help-feedback" aria-labelledby="helpFeedbackTitle">
          <h2 id="helpFeedbackTitle">Was this helpful?</h2>
          <div class="help-feedback-actions">
            <button type="button" class="btn btn-secondary" data-help-feedback="yes">Yes</button>
            <button type="button" class="btn btn-secondary" data-help-feedback="not-yet">Not Yet</button>
          </div>
          <p class="help-feedback-status" role="status" aria-live="polite"></p>
        </section>
        ${relatedMarkup(guide)}
        <nav class="help-guide-bottom-actions" aria-label="Help guide actions">
          <a class="btn btn-primary" href="${esc(routeHref(HELP_HOME_ROUTE))}" data-help-home>Back to Help Centre</a>
          <a class="btn btn-secondary" href="${esc(guideHref('privacy-and-troubleshooting','technical-help'))}" data-help-guide="privacy-and-troubleshooting" data-help-anchor="technical-help">Contact Support</a>
        </nav>
      </footer>
    </main>`;
    bindGuide(view);
    updateConnectionStates();
    setTimeout(() => {
      if(options.anchor) scrollToAnchor(options.anchor);
      else view.querySelector('#helpGuideTitle')?.focus?.({ preventScroll:true });
      injectGuideSupportRows();
    }, 60);
  }

  function bindGuide(view){
    view.querySelectorAll('[data-help-feedback]').forEach(button => {
      button.addEventListener('click', () => {
        const status = view.querySelector('.help-feedback-status');
        if(status) status.textContent = button.dataset.helpFeedback === 'yes'
          ? 'Thanks — your feedback was noted on this device.'
          : 'Thanks — try a related guide or contact support if the problem continues.';
      });
    });
  }

  function renderUnavailableGuide(guideId){
    const view = activateGuideView();
    if(!view) return;
    setAppChrome('Guide unavailable');
    view.innerHTML = `<main class="help-centre-guide-shell">
      <header class="help-guide-header">
        <button class="study-page-back help-guide-back" type="button" data-help-home aria-label="Back to Help Centre" title="Back"><span aria-hidden="true">←</span></button>
        <div>
          <span class="kicker">HELP GUIDE</span>
          <h1 id="helpGuideTitle" tabindex="-1">Guide unavailable</h1>
          <p>We could not open that Help guide. Your StudySpark work has not been changed.</p>
        </div>
      </header>
      <section class="help-empty-state" role="status">
        <h2>Unexpected error</h2>
        <p>The guide ${esc(guideId || 'requested')} is not available from this Help Centre.</p>
        <div class="help-suggestion-row">
          <a href="${esc(routeHref(HELP_HOME_ROUTE))}" data-help-home>Back to Help Centre</a>
          <a href="${esc(guideHref('privacy-and-troubleshooting','technical-help'))}" data-help-guide="privacy-and-troubleshooting" data-help-anchor="technical-help">Contact Support</a>
        </div>
      </section>
    </main>`;
    setTimeout(() => view.querySelector('#helpGuideTitle')?.focus?.({ preventScroll:true }), 30);
  }

  function scrollToAnchor(anchor){
    if(!anchor || !d) return;
    const target = d.getElementById(anchor) || d.querySelector(`[data-help-anchor="${CSS.escape(anchor)}"]`);
    if(!target) return;
    target.scrollIntoView({ block:'start', behavior:root.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    target.focus?.({ preventScroll:true });
  }

  function injectGuideSupportRows(){
    if(!d) return;
    const guideView = d.getElementById('helpCentreGuideView');
    if(!guideView?.classList.contains('active')) return;
    guideView.querySelectorAll('.help-guide-step').forEach(step => {
      if(step.querySelector('.ai-coach-language-tools')) return;
      root.AICoachLanguageTools?.ensureToolbar?.(step);
    });
  }

  function openHome(push=false){
    renderHome();
    if(push) pushHelpRoute(HELP_HOME_ROUTE);
    d.querySelectorAll('.app-view').forEach(panel => panel.classList.remove('active'));
    d.getElementById('instructionsView')?.classList.add('active');
    root.StudySparkNavigation?.syncActive?.('instructions');
    setAppChrome('Help Centre');
    setTimeout(() => d.getElementById('helpCentreTitle')?.focus?.({ preventScroll:true }), 30);
  }

  function openGuide(guideId, anchor='', push=true, options={}){
    const guide = GUIDE_MAP[guideId];
    if(push && guide) pushHelpRoute(guide.route, anchor);
    renderGuide(guideId, { ...options, anchor });
  }

  function handleRoute(){
    if(!d) return false;
    const info = currentRoute();
    if(info.path === HELP_HOME_ROUTE || info.path === `${HELP_HOME_ROUTE}/`){
      openHome(false);
      return true;
    }
    const stepMatch = info.path.match(/^\/help\/step\/(\d+)$/);
    if(stepMatch){
      const map = ensureMigrationMap();
      const oldStep = Number(stepMatch[1]);
      const target = map[oldStep] || map[1] || HELP_HOME_ROUTE;
      const [path, anchor=''] = target.split('#');
      const guide = HELP_GUIDES.find(item => item.route === path);
      if(guide){
        pushHelpRoute(guide.route, anchor, true);
        renderGuide(guide.id, { redirected:true, anchor });
        return true;
      }
    }
    if(info.path.startsWith(`${HELP_HOME_ROUTE}/`)){
      const guide = HELP_GUIDES.find(item => item.route === info.path);
      if(guide){
        renderGuide(guide.id, { anchor:info.anchor });
        return true;
      }
      renderUnavailableGuide(info.path.replace(`${HELP_HOME_ROUTE}/`,''));
      return true;
    }
    return false;
  }

  function handleClick(event){
    const home = event.target.closest?.('[data-help-home]');
    if(home){
      event.preventDefault();
      openHome(true);
      return;
    }
    const guideLink = event.target.closest?.('[data-help-guide]');
    if(guideLink){
      event.preventDefault();
      openGuide(guideLink.dataset.helpGuide, guideLink.dataset.helpAnchor || '');
      return;
    }
    const featureLink = event.target.closest?.('[data-help-feature-view]');
    if(featureLink){
      const view = featureLink.dataset.helpFeatureView;
      if(view && typeof root.showView === 'function'){
        event.preventDefault();
        root.showView(view);
      }
    }
  }

  function updateConnectionStates(){
    if(!d || typeof navigator === 'undefined') return;
    d.querySelectorAll('[data-help-state="offline"]').forEach(item => {
      item.hidden = navigator.onLine;
    });
    d.querySelectorAll('[data-help-state="reconnecting"]').forEach(item => {
      item.hidden = true;
    });
  }

  function markReconnecting(){
    if(!d) return;
    d.querySelectorAll('[data-help-state="reconnecting"]').forEach(item => {
      item.hidden = false;
    });
    setTimeout(updateConnectionStates, 2000);
  }

  function addContextualHelpLinks(){
    if(!d) return;
    CONTEXTUAL_HELP_LINKS.forEach(link => {
      const view = d.getElementById(link.viewId);
      if(!view || d.getElementById(link.id)) return;
      const target = view.querySelector('.header-actions,.portfolio-main-actions,.view-intro,main > header,header') || view;
      const anchor = d.createElement('a');
      anchor.id = link.id;
      anchor.className = 'btn btn-secondary contextual-help-link';
      anchor.href = guideHref(link.guideId, link.anchor);
      anchor.dataset.helpGuide = link.guideId;
      anchor.dataset.helpAnchor = link.anchor;
      anchor.textContent = link.label;
      target.appendChild(anchor);
    });
  }

  function init(){
    if(!d || state.initialized) return;
    state.initialized = true;
    d.addEventListener('click', handleClick);
    root.addEventListener?.('popstate', () => setTimeout(handleRoute, 0));
    root.addEventListener?.('hashchange', () => setTimeout(handleRoute, 0));
    root.addEventListener?.('offline', updateConnectionStates);
    root.addEventListener?.('online', markReconnecting);
    const prepare = () => {
      try{
        collectLegacySteps();
        renderHome();
        ensureGuideView();
        addContextualHelpLinks();
        handleRoute();
      }catch(error){
        const view = d.getElementById('instructionsView');
        if(view){
          view.innerHTML = `<main class="help-centre-shell"><section class="help-empty-state" role="alert"><h1>Unexpected error</h1><p>Help Centre could not load. Your StudySpark work has not been changed.</p><button class="btn btn-primary" type="button" data-help-retry>Retry Help Centre</button></section></main>`;
          view.querySelector('[data-help-retry]')?.addEventListener('click', () => {
            state.initialized = false;
            init();
          });
        }
        root.console?.error?.('Help Centre failed to initialize', error);
      }
    };
    setTimeout(prepare, 500);
    setTimeout(() => {
      addContextualHelpLinks();
      injectGuideSupportRows();
    }, 1400);
    const host = d.getElementById('viewContainer');
    if(host && typeof MutationObserver !== 'undefined'){
      new MutationObserver(() => {
        addContextualHelpLinks();
        const needsGuideSupport = Array.from(d.querySelectorAll('#helpCentreGuideView.active .help-guide-step')).some(step => !step.querySelector('.ai-coach-language-tools'));
        if(needsGuideSupport) injectGuideSupportRows();
      }).observe(host, { childList:true, subtree:true });
    }
  }

  if(d) d.readyState === 'loading' ? d.addEventListener('DOMContentLoaded', init) : init();

  const api = Object.freeze({
    HELP_HOME_ROUTE,
    HELP_PAGE_STATES,
    REQUIRED_GUIDE_IDS,
    HELP_GUIDES,
    POPULAR_HELP,
    HELP_STEP_REDIRECT_OVERRIDES,
    getLegacyHelpAudit:() => state.legacyAudit.slice(),
    getStepMigrationMap:() => ensureMigrationMap(),
    classifyLegacyStep,
    buildMigrationMap,
    routeHref,
    openGuide,
    openHome,
    _test:{ guideSearchText, searchTokens, fallbackDestinationForStep, destinationPath },
  });
  if(typeof module !== 'undefined' && module.exports) module.exports = api;
  root.StudySparkHelpCentre = api;
})(typeof window !== 'undefined' ? window : globalThis);
