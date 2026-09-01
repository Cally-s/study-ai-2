# Keyboard Route Matrix

| `/recovery/[sessionId]/tasks/[workItemId]/actions` | Next/full lists; start/edit/split/combine/move/complete/block/restore; save/accept/return/continue/print | Native buttons, non-drag movement, alert/status focus | SOURCE_VERIFIED; MANUAL_NOT_RUN |

Status uses `STATIC PASS`, `AUTOMATED PASS`, or `MANUAL PENDING`. No route is labelled manually verified.

| Route family | Entry and navigation | Primary actions | Composite widgets | Focus after route change | Status |
|---|---|---|---|---|---|
| Authentication | Native buttons and fields | Submit, guest, close | Modal focus lifecycle | Not applicable | AUTOMATED PASS; MANUAL PENDING |
| Dashboard and Progress | Sidebar/quick-action buttons | Open cards and reports | None identified | Active heading receives focus | AUTOMATED PASS; MANUAL PENDING |
| Notes and Files | Sidebar, tabs, skip link | Add, save, upload, contextual actions | Arrow-key tabs; note action menu; PDF dialog | Notes heading receives focus | AUTOMATED PASS; MANUAL PENDING |
| Flashcards and Quizzes | Sidebar, tabs | Generate, flip, grade, submit | Flashcard Enter/Space; quiz tabs | Active heading receives focus | AUTOMATED PASS; MANUAL PENDING |
| Planner | Sidebar and subnavigation | Create, save, continue | Confirmation dialogs | Planner heading receives focus | STATIC PASS; MANUAL PENDING |
| AI Coach | Sidebar | Prompt suggestions and send | Chat output remains readable text | Coach heading receives focus | STATIC PASS; MANUAL PENDING |
| Peer tutoring and matching | Sidebar | Apply, request, approve, book | Shared dialogs and dynamic cards | Route heading receives focus | STATIC PASS; MANUAL PENDING |
| Study Rooms and Groups | Sidebar | Create, join, chat, report, leave | Dialogs and text chat | Route heading receives focus | STATIC PASS; MANUAL PENDING |
| Settings and Accessibility | Sidebar and persistent toolbar | Save preferences and reset | Toolbar disclosure and form controls | Route heading receives focus | AUTOMATED PASS; MANUAL PENDING |
| Safety, integrity, service and role dashboards | Sidebar | Filters, review and exports | Dynamic tables/cards | Route heading receives focus | STATIC PASS; MANUAL PENDING |
| Academic Recovery prioritization | Verification continuation | Build, disclose, importance, override, move up/down, release review, pause | Native details and category sections; no drag requirement | “Choose What Matters First” or category heading receives focus | AUTOMATED PASS; MANUAL PENDING |
| Academic Recovery priority explanations | Priority card/detail entry | Reasons, facts/sources, depth, change preview, restore, feedback, pause | Native details, captioned factor table/card reflow, change dialog contract | “Why This Priority?” heading; dialog trigger on cancel | AUTOMATED PASS; MANUAL PENDING |
| Academic Recovery prerequisite review | Priority explanation continuation | Answer, show all, save/pause, diagnostic, bridge, teacher/tutor draft | Native fieldsets and ordered question flow; no drag requirement | “What Is Blocking This Task?” heading | AUTOMATED PASS; MANUAL PENDING |
| Academic Recovery prerequisite repair | Prerequisite decision continuation | Five stages, hints, responses, readiness, extension, human help, pause/resume | Ordered stages and native controls; no drag, hover or timer | “Repair the Minimum Concept You Need” heading | AUTOMATED PASS; MANUAL PENDING |
| Academic Recovery Minimum Plan | Current recovery outputs | Accept/edit, separate completion, block/skip, impact preview, move up/down/top/bottom, finish/pause | Semantic Minimum/Stretch lists and native controls; no drag requirement | “Your Minimum Recovery Plan” heading | AUTOMATED PASS; MANUAL PENDING |
| Academic Recovery seven-day plan | Reviewed Minimum/Stretch plan | Day review, block progress, edit/shorten, dependency, reserve, move up/down/top/bottom, calendar preview, pause | Semantic day/block lists with compact/list alternative; no drag requirement | “Your Seven-Day Recovery Plan” heading | AUTOMATED PASS; MANUAL PENDING |

Manual completion requires browser testing from first Tab through completion and reverse traversal, at narrow viewport and 200% zoom where applicable.
