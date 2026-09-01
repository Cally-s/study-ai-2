# Step 20 User-Journey Test Coverage

This static browser prototype uses deterministic Node/VM domain tests. All 15 required scenarios are mapped in `journey-testing.js` to a focused suite, canonical records, and six assertion layers. The connected runtime contract is checked by `tests/journey-testing.test.js`; focused suites remain the behavioral evidence.

| # | Scenario | Focused test | Primary records |
|---|---|---|---|
| 1 | Learner registration | student-onboarding.test.js | StudentProfile, GuardianConsent |
| 2 | Tutor application | tutor-application.test.js | TutorApplication, subjects |
| 3 | Partial verification | tutor-verification.test.js | Decisions, capabilities |
| 4 | Tutoring request | tutoring-requests.test.js | TutoringRequest |
| 5 | Recommendations | tutor-matching.test.js | MatchingRun, candidates |
| 6 | Session acceptance | safe-booking.test.js | Invitation, session, conversation |
| 7 | Dual attendance | session-attendance.test.js | Attendance, participants |
| 8 | Session reports | post-session-learning.test.js | LearningRecord, summary |
| 9 | Service approval | community-service.test.js | ServiceRecord, decision |
| 10 | Service download | service-documents.test.js | ServiceDocument |
| 11 | Behaviour report | safety-safeguarding.test.js | SafetyReport, case |
| 12 | Human suspension | safety-safeguarding.test.js | AccountRestriction |
| 13 | Suspicious warning | integrity-review.test.js | Indicator, review case |
| 14 | Sponsored support | help-credits.test.js | Authorization, settlement |
| 15 | Cancellation | safe-booking.test.js | Cancelled session |

State map: learner active → tutor application pending → mixed human subject decisions → request open → matching run → invitation confirmed → attendance verified → learning record jointly confirmed → service record human-approved → report issued. Safety reports remain separate from restrictions; warnings remain separate from findings; cancelled sessions cannot progress to attendance, settlement, service, or recognition.

No package manager, Playwright, backend, test database, mail adapter, storage adapter, migrations, CI, formatter, linter, type checker, or production build is configured. Those checks are unavailable and must not be reported as passing.
