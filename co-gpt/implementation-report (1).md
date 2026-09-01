# Implementation Report

StudySpark — Task-Based Help Centre Reorganization

## Goal

Replace the overwhelming linear Help page with a simple, task-based Help Centre.

The previous runtime Help page rendered 88 visible instruction cards during the audit, while the requested issue described the original experience as 73 separate steps. The new Help Centre no longer asks students to move through one long numbered tutorial. Instead, it shows ten focused guide topics, search, popular tasks, and short dedicated guide pages.

## What Changed

Added a new Help Centre runtime:

- `Help Centre`
- `What do you need help with?`
- `Search StudySpark Help`
- `Popular Help`
- ten task-based guide cards

Created the ten required Help guides:

- `Getting Started`
- `Personalize StudySpark`
- `Learn With the AI Coach`
- `Check AI Answers and Use AI Responsibly`
- `Learn, Practise, and Check Understanding`
- `Assignments and Catch-Up Support`
- `Peer Tutoring and Community Service`
- `Build a Community AI Project`
- `Track and Show Your Progress`
- `Privacy, Offline Access, and Technical Help`

Each guide includes:

- icon
- title
- one-sentence description
- estimated reading time
- `Open Guide` action
- `Quick Answer`
- three to six local steps
- optional details behind expandable controls
- feature links to the real StudySpark tools
- `Was this helpful?`
- `Related Guides`
- `Back to Help Centre`
- `Contact Support`

The Help page no longer displays:

- `Step 1 of 73`
- `Step 2 of 73`
- global Help completion pressure
- the old visible 73-step/88-card instruction sequence
- repeated full language-and-explanation blocks under every Help item

## Internal Help-Step Audit

Before replacing the interface, the runtime captures the legacy Help cards from `#instructionsView .instruction-grid article` and creates an internal audit record for each legacy item:

- current step number
- current title
- main purpose
- related feature
- uniqueness / duplicate marker
- recommended action
- new guide destination
- guide anchor

The audit classifies legacy content into actions such as:

- `Keep`
- `Combine`
- `Shorten`
- `Move`
- `Remove Duplicate`
- `Replace with Link`
- `Archive as Advanced Information`

Unique safety, privacy, accessibility, academic-integrity, source-verification, peer-tutoring, community-service, and human-support content was preserved by moving it into the most relevant guide.

## Old Link Preservation

Added a migration map for legacy Help step links.

The map covers at least steps 1–73 and expands to cover all audited runtime steps when more than 73 legacy cards exist. Explicit requested examples are preserved:

- `/help/step/14` → `/help/ai-coach#learning-modes`
- `/help/step/29` → `/help/responsible-ai#verify-an-answer`
- `/help/step/51` → `/help/projects#system-card`

Old step links show an `Old step redirected` state and open the closest short guide instead of a missing page.

## Route Fixes

The existing app router was updated so direct Help child routes are recognized as part of the Help workspace.

This prevents routes such as:

- `/help/responsible-ai`
- `/help/projects`
- `/help/step/51`

from being collapsed back to Home before the Help Centre runtime can render the guide or redirect.

For the local static `index (2).html` app, Help routes use hash-compatible navigation so browser Back and Forward can still work without a server-side fallback.

## Search and Popular Help

Added Popular Help entries:

- `Ask the AI Coach`
- `Change Language or Accessibility Settings`
- `Catch Up on Missing Work`
- `Verify an AI Answer`
- `Start a Community AI Project`
- `Restore Unsaved Work`

Search now supports natural student questions. For example:

- `verify an AI answer`

returns:

- `Check AI Answers and Use AI Responsibly`

No search results render a clear recovery state with suggested guide links instead of a blank page.

## Language Support

The compact Help support row now attaches to new guide steps:

- `Need help with this step?`
- `Listen`
- `Help Me Understand`

Updated shared language-support integrations so Help guide steps are eligible for:

- text-to-speech
- plain-language support
- explanation-level selection
- language bridge
- academic vocabulary lookup
- multilingual settings

The support row is injected idempotently and placed at the bottom of guide steps so it does not nest inside detail boxes.

## Page States

The Help Centre supports:

- `No search results`
- `Guide unavailable`
- `Content loading`
- `Offline`
- `Reconnecting`
- `Old step redirected`
- `Unexpected error`

The Help page should not render blank when a guide is missing or a search fails.

## Design and Accessibility

Added a dedicated Help Centre stylesheet with:

- centered page container
- compact hero area
- labelled search field
- Popular Help shortcuts
- guide cards in a responsive grid
- dedicated guide-page layout
- local step cards
- expandable optional details
- visible keyboard focus
- forced-colours support
- reduced-motion support
- print cleanup
- mobile stacking
- RTL-safe layout rules

Responsive guide-card grid:

- desktop: 3 cards per row
- tablet: 2 cards per row
- mobile: 1 card per row

The Help home was compacted after browser inspection so the first guide row is visible in the first viewport on the tested desktop layout.

## Chronicle Data Updated

No saved student, guest, account, course, note, assignment, plan, project, quiz, notification, portfolio, prompt, AI Coach, peer-tutoring, or Help data was changed.

The implementation changes only Help presentation, guide routing, legacy-link mapping, contextual Help links, and Help-language support rendering.

## Time Fragment Pages Updated

No dated history, progress timeline, session record, study plan history, portfolio history, correction history, project history, prompt history, or notification history was changed.

## Shared History Text Updated

No user-created records were modified.

Legacy Help text remains available to the runtime for audit/migration purposes, but it is no longer displayed as one long numbered sequence.

## Files Changed

- `help-centre.js`
- `help-centre.css`
- `index (2).html`
- `script.js`
- `ai-coach-language-tools.js`
- `text-to-speech.js`
- `plain-language.js`
- `explanation-levels.js`
- `language-bridge.js`
- `academic-vocabulary.js`
- `multilingual-ai.js`
- `tests/help-centre.test.js`
- `tests/ai-coach-language-tools.test.js`
- `co-gpt/implementation-report (1).md`

## Tests Run

Passed:

- `node --check help-centre.js`
- `node --check script.js`
- `node --check ai-coach-language-tools.js`
- `tests/help-centre.test.js`
- `tests/ai-coach-language-tools.test.js`
- `tests/text-to-speech.test.js` — 32/32 assertions passed
- `tests/plain-language.test.js` — 60/60 assertions passed
- `tests/explanation-levels.test.js` — 63/63 assertions passed
- `tests/language-bridge.test.js` — 80/80 assertions passed
- `tests/academic-vocabulary.test.js` — 101/101 assertions passed
- `tests/multilingual-ai.test.js` — 93/93 assertions passed

## Browser Verification

Started the local StudySpark preview server and verified the Help home in the in-app browser.

Confirmed in browser:

- Help opens as `Help Centre`.
- The active view is `instructionsView`.
- ten guide cards are present.
- `Popular Help` is visible.
- `Search StudySpark Help` is visible and labelled.
- the old `How StudySpark works` heading is not visible.
- no visible `Step X of 73` or `73 steps` text remains.
- no visible legacy instruction cards remain.
- the first guide card is visible in the first viewport after compacting the layout.
- there is no horizontal overflow at the tested desktop width.
- searching `verify an AI answer` returns `Check AI Answers and Use AI Responsibly`.

The browser tab list also confirmed direct guide tabs loaded with the title:

- `Check AI Answers and Use AI Responsibly · StudySpark AI Coach`

The in-app browser automation became unstable while reading guide-page DOM and mobile viewport state after several temporary tabs were opened. Those checks are covered by focused automated tests and CSS assertions, but the final browser DOM read for those two cases could not be completed cleanly in the tool session.

## Final Acceptance Notes

PASS — The Help page no longer shows 73 steps.

PASS — Ten main Help guides are visible.

PASS — Each guide contains no more than six main steps.

PASS — Repeated instructions are merged into focused guides.

PASS — Important safety, privacy, accessibility, academic-integrity, verification, and human-support details are preserved.

PASS — Old step-link redirects are implemented.

PASS — Search works for natural Help questions.

PASS — Mobile, forced-colours, reduced-motion, and focus-visible support are covered in CSS tests.

PASS — Existing language and accessibility support features remain functional.
