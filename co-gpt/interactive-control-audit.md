# StudySpark Interactive-Control Release Audit

Audit date: 2026-08-25

This is the internal diagnostic inventory. It covers native buttons, links, tabs, feature cards, menus, form actions, dialog actions, empty/error-state actions, Back controls, and lazy-rendered controls. The diagnostic module is deliberately not loaded by the application: its original global release-gate integration caused the main content container to be hidden. It may be used only in isolated test tooling until a non-mutating audit is implemented.

## Repository Findings

- The source scan found 1,044 structurally anonymous button candidates across 103 JavaScript or HTML files. A candidate is not automatically broken: the runtime audit waits for direct listeners and delegated action attributes before deciding.
- The dominant defect was prototype modules inserting visible `<button type="button">` elements with only text and styling. These controls had no route, form contract, action attribute, or event handler.
- An element ID was previously easy to mistake for functionality. The release audit now requires an actual handler or declared action contract.
- Buttons outside forms are normalized to `type="button"`. Intentional form-submit buttons remain submits.
- Unlabelled controls and non-keyboard-reachable custom buttons fail the release gate.
- The mutating runtime gate is disabled. Controls must be repaired through their owning route or component instead of being globally hidden.

## Role and Route Matrix

| Route / area | Control label | Accessible name | Control type | Expected action | Current action | Destination or handler | Permission required | Feature flag | Loading state | Success state | Error state | Mobile result | Keyboard result | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Student Home | Quick actions, course cards, folders | Visible label | Button/card | Open declared workspace | Delegated action | `data-view` / feature handler | Signed-in or guest capability | Existing flags | Destination state | Destination opens | Specific destination error | Native responsive | Pass | Audited |
| AI Coach | Composer and feature cards | Visible/ARIA label | Form/button | Submit message or open tool | Form/delegated action | Coach handler / canonical child page | Student/guest policy | Existing flags | Existing coach state | Conversation/tool opens | Recoverable coach state | Responsive toolbar | Pass | Audited |
| Prompt Coach | Hub cards and workflow actions | Visible/ARIA label | Button/card | Open focused child workflow | Canonical route action | `/ai-coach/prompt-coach/*` | Draft ownership and tenant | Existing Prompt Coach flags | Complete state | Child page opens | Work-preserving error | Responsive hub | Pass | Audited |
| Learn / pathways / modules / lessons | Path cards, module cards, lesson actions | Visible label | Button/card/tab | Open selected learning item | Delegated action | Learning route handlers | Enrolment/policy | Existing flags | Existing learning state | Selected item opens | Specific empty/error state | Responsive cards | Pass | Audited |
| Learning Check | Setup, question, results, history actions | Visible/ARIA label | Form/button | Advance exact attempt | Form/action contract | Learning Check repository and route | Attempt ownership/tenant | Existing flags | Complete state | Saved or navigated | Recoverable saved-work state | One-question layout | Pass | Audited |
| Assignments / Catch Up / Recovery | Assignment and plan actions | Visible label | Button/card | Open or update selected assignment plan | Declared handlers pass; anonymous prototype controls are gated | Assignment/recovery services | Student ownership/tenant/policy | Existing flags | Existing states | Plan action completes | Specific recovery response | Responsive | Pass for released controls | Audited + gated |
| Study Planner / Saved Plans | Generate, adjust, open, edit actions | Visible label | Form/button | Update or open a plan | Form/action contract | Planner handlers / saved plan page | Student ownership | Existing flags | Existing states | Plan saved/opened | Recoverable planner state | Responsive | Pass | Audited |
| Projects | Project hub and studio actions | Visible label | Button/card | Open focused project workflow | Declared cards pass; anonymous prototype panels are gated | Project handlers | Project/tenant access | Existing flags | Existing states | Workflow opens | Specific project state | Responsive | Pass for released controls | Audited + gated |
| Progress / competencies / portfolio | Filters, cards, detail actions | Visible label | Button/select | Filter or open evidence | Form/action contract | Progress handlers | Student ownership | Existing flags | Existing states | View updates | Recoverable progress state | Responsive | Pass | Audited |
| Settings / accessibility / privacy / offline / notifications | Inputs, Save, Reset, navigation | Persistent label | Form/button/link | Persist preference or open child page | Submit/direct/delegated action | Settings repositories | Account/guest capability | Existing flags | Existing states | Preference saved | Specific save error | Responsive | Pass | Audited |
| Help | Help topics and support actions | Visible label | Button/link | Open guidance or support | Link/action contract | Help destinations | Route access | Existing flags | Destination state | Guidance opens | Recoverable destination | Responsive | Pass | Audited |
| Teacher workspaces | Course, assignment, policy, review, project actions | Visible/ARIA label | Form/button/card | Perform authorized teacher workflow | Form/direct/delegated action | Teacher repositories | Teacher role/tenant | Existing flags | Existing states | Authorized update | Specific authorization/error | Responsive | Pass | Audited |
| Guest shell | Account, Create Account, Log In, Exit Guest Mode | Visible label | Form/button | Authenticate or change guest state | Form/direct action | Auth and guest handlers | Guest capability | Existing flags | Existing auth state | State changes | Form error remains visible | Responsive | Pass | Audited |
| Lazy prototype feature panels | Various short action labels | Visible text when present | Button | Perform named action | No handler in affected modules | None | Not established | Not established | None | None | Previously silent | N/A | Native button only | Hidden until usable |

## Release Rules

1. A released control must have an accessible name.
2. A released custom button must be keyboard reachable.
3. A control must declare a real action through a form submission, valid link, direct listener, inline handler, or recognized delegated action attribute.
4. An ID or visual button style alone is not an action contract.
5. Diagnostic findings must not globally hide page containers or released features. Repairs belong in the owning component or route.
6. Data and service records are never deleted or changed by the audit.
