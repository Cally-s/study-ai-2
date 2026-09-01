# StudySpark First-Viewport Audit

Design principle: “The first screen should explain where the user is, show the most important next action, and provide visible access to the page’s major feature areas.”

Priority contract: PRIMARY actions appear in the page compass; SECONDARY areas appear as visible workspace shortcuts; ADVANCED history/version/archive/metadata areas use disclosure; INTERNAL-labelled areas are excluded from normal-user navigation.

| Audience | Page title | PRIMARY action | SECONDARY areas visible in first viewport | ADVANCED / below-fold organization | Prior first-screen issue addressed |
|---|---|---|---|---|---|
| Student | Home | Start the next eligible study action | AI Coach, Learn, Assignments, Progress | Activity history and detailed dashboards remain below/disclosed | Welcome, goal, streak, check-in, and tools previously formed a long stack |
| Student | AI Coach | Focus the current coach input / Send | Prompt Coach, Verify an Answer, Claim–Evidence Map, Source Comparison, AI Use Receipts | Detailed coach guidance remains below | Specialist tools were discoverable only after scrolling or navigation knowledge |
| Student | Learn | Continue / start Understand or learning check | Overview, Learning Check, Competency Progress, Portfolio | Lesson library and detailed competency material remain reachable below | Long lesson inventory obscured next action |
| Student | Assignments | Generate or open a study plan | Create Plan, Saved Plans, Recovery Plan | Saved/history sections may be disclosed | Form, preview, and saved plans competed vertically |
| Student | Projects | Continue project | Problem Scope, System Card, Architecture, Data Responsibility, Portfolio | Iteration history and detailed reflections remain below | Project studios appeared as a long sequence |
| Student | Progress | Review progress | Learning Profile, Exam Readiness, Predictions, Well-Being, Competency Portfolio | Historical and detailed evidence sections are disclosed | Multiple dashboards were separated by scrolling |
| Student | Settings | Save the current settings form | Accessibility & Language, Privacy & Data, Notifications, Offline & Storage | Technical storage/history details use disclosure | Long settings card stack hid accessibility and privacy areas |
| Student | Help | Open the first eligible help action | Help & Safety, Safety & Privacy, Accessibility | Detailed policies and limitations remain below | Support destinations were scattered vertically |
| Student | Prompt Coach | Start the prompt workflow | Automatically discovered prompt stages | Version/history details use disclosure | Long instructional sequence delayed the first action |
| Student | Source Verification | Start verification | Automatically discovered verification stages | Source metadata, limitations, and history use disclosure | Evidence tools were below long explanations |
| Student | Claim–Evidence Map | Begin mapping a claim | Automatically discovered map stages | Advanced metadata/details use disclosure | Major mapping areas required scrolling |
| Student | Source Comparison | Begin source comparison | Automatically discovered comparison stages | Detailed limitations and metadata use disclosure | Comparison workspace followed long lesson content |
| Student | AI Use Receipts | Create/review a receipt | Automatically discovered receipt areas | Receipt history/version details use disclosure | Current receipt actions and history competed vertically |
| Student | Competency Portfolio | Review current competency evidence | Automatically discovered portfolio areas | Complete evidence history uses disclosure | Current evidence was mixed with full history |
| Student | Accessibility and Language | Save preferences | Automatically discovered preference groups | Technical/device details remain below/disclosed | Large settings groups pushed Save and language controls down |
| Student | Offline and Storage | Open the current privacy/storage action | Privacy & Data workspace shortcut | Technical storage details use disclosure | Storage explanation and controls were deep in Settings |
| Teacher | Teacher Home | Open the first current teacher task | Courses, Assignments, Students & Progress, Reviews, Projects | Aggregate history/details remain below | Role dashboard sections were vertically stacked |
| Teacher | Courses | Create/review a resource | Assignments, Projects | Resource history/version details use disclosure | Authoring and review tools competed with history |
| Teacher | Assignments | Open the assignment-policy workflow | Courses, Students & Progress, Reviews | Policy version history uses disclosure | Policy stages and supporting detail formed a long page |
| Teacher | Students and Progress | Review current learner progress | Courses, Assignments, Reviews, Projects | Detailed learner history remains below | Current needs and historical records were mixed |
| Teacher | Reviews | Open the next eligible review | Role-aware dashboard shortcuts | Decision history/internal notes remain permission-gated and below | Review queues were separated from role navigation |
| Teacher | Projects | Continue project | Problem Scope, System Card, Architecture, Data Responsibility, Portfolio | Iteration/reflection history remains below | Project tools required extensive scrolling |
| Teacher | Teacher Settings | Save settings | Accessibility, Privacy, Notifications | Technical details use disclosure | Shared settings stack hid major preference areas |
| Parent / Guardian | Home | Open the first current family-support action | Sessions, Requests, Progress Reports, Shared Achievements | Detailed tutoring records remain below | Family destinations depended on sidebar knowledge |
| Parent / Guardian | Progress Reports | Open current report | Shared Achievements and Home remain role-visible | Complete report history remains below/disclosed | Current report and historical documents competed vertically |
| Parent / Guardian | Shared Achievements | Review shared achievements | Progress Reports and Home remain role-visible | Historical impact detail remains below | Current achievements were mixed with detailed impact information |
| Parent / Guardian | Settings | Save settings | Accessibility, Privacy, Notifications, Offline & Storage | Technical details use disclosure | Same long settings stack as student role |
| Parent / Guardian | Help | Open the first help action | Help & Safety, Safety & Privacy, Accessibility | Detailed policies remain below | Support categories required scrolling |

## Repeated-content and sizing findings

- Existing `.view-intro` title/description blocks duplicated the new compact orientation. Their text is now suppressed after enhancement while any original action controls remain available.
- Generated first-screen headings use a bounded responsive size instead of oversized hero typography.
- Up to six SECONDARY areas remain directly visible; additional areas use one “More areas” interaction.
- Recognized history, archive, version, limitation, metadata, and technical-storage sections use a shared ADVANCED disclosure instead of remaining permanently expanded.
- Existing detailed content is not deleted or moved to a different data workspace.

## Responsive verification

| Test viewport | Result |
|---|---|
| 1366 × 768 | Orientation, primary action, and workspace navigation visible; no horizontal overflow |
| 1024 × 768 | Orientation, primary action, and workspace navigation visible; no horizontal overflow |
| 390 × 844 | Header stacks, primary action becomes full width, tabs remain horizontally reachable; no document overflow |
| Approximately 320 CSS pixels | Compact padding and controls remain usable; no document overflow |
| 683 × 384 200%-equivalent | Orientation, primary action, and workspace navigation remain within the first screen |

The runtime applies the same structure to every detected `.app-view`, including pages created after startup.
