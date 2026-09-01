# Sidebar navigation audit

The previous student sidebar exposed 34 direct links across Overview, Study, Collaborate, Authoring, Insights, AI Tools, and Account, plus links inserted at runtime. Several were secondary utilities, settings controls, administrative surfaces, or closely related tools.

| Previous area | Examples | Decision | New workspace |
|---|---|---|---|
| Overview | Overview | Keep once | Home |
| Study | Notes, Flashcards, Quizzes, Planner, Folders | Move to contextual workspace actions | Assignments / AI Coach |
| Collaborate | Friends, requests, rooms, groups, tutoring | Remove from primary student navigation; preserve routes and contextual entry points | Home / contextual flows |
| Authoring | Accessible Resource Studio | Role-filter and keep contextual | Teacher Courses / Tutor Learning Resources |
| Insights | Progress, well-being, dashboards, reports, review tools | Group student metrics; restrict staff tools by role | Progress / role workspaces |
| AI Tools | Learning Profile, Exam Readiness, Future Success, Prediction Dashboard | Group | Progress |
| Account | Notifications, accessibility, privacy, reminders | Group | Settings |
| Runtime insertions | AI Literacy Lab, Prediction Dashboard, Help & Safety | Group and prevent duplicate primary links | Learn / Progress / Help |

All removed sidebar destinations remain in the application. The central configuration exposes only ready, role-authorized primary destinations. Internal testing, MVP, status, diagnostics, and feature-flag surfaces are not included in normal navigation.
