# Keyboard Accessibility Standard

Step 24 keeps static/browser keyboard scans separate from a person completing the full task journey. Automated results cannot complete the human keyboard task.

Step 23 requires keyboard-operable batch selection, issue filtering/review, draft approval and real focus-order diagnostics; the generic Studio preview is explicitly not browser proof.

StudySpark keyboard work targets WCAG 2.2 AA, especially 2.1.1 Keyboard, 2.1.2 No Keyboard Trap, 2.4.1 Bypass Blocks, 2.4.3 Focus Order, 2.4.7 Focus Visible, 2.4.11 Focus Not Obscured, 2.5.3 Label in Name, and 4.1.2 Name, Role, Value.

Acceptance requires every essential task to be completable with Tab, Shift+Tab, Enter, Space, Escape, and documented component keys. Focus must remain visible, follow a meaningful order, never enter hidden content, and return predictably after overlays. Arrow keys are reserved for the active composite widget and must not be intercepted globally.

Automated source tests are regression evidence, not proof of real keyboard completion. A route may be marked verified only after a named browser/OS combination is tested manually and the result is recorded with date, tester, viewport, zoom, and defects.

Step 5 visual modes must preserve this contract. Enlarged text, simplified layout, reading view, contrast modes, and motion modes may not remove focus indicators, skip links, menu/dialog focus return, required controls, or logical DOM order. Reading view includes an explicit keyboard-operable Exit action and is not a modal trap.

Step 6 highlights/rulers are never focusable and never intercept pointers. Their controller is a named native-button group. No global Arrow shortcut is installed and no dragging is required. Hiding controls does not disable the ruler; a labelled reopen button remains. Manual focus-obscuration and assistive-technology testing remains pending.

Step 7 Listen/player controls are native buttons and labelled selects in DOM order. Playback does not move focus. Sentence highlighting is aria-hidden, non-focusable, and pointer-transparent; status changes use a polite live region. Manual focus-obscuration testing remains pending.

Step 8 uses contextual native buttons, a labelled language select and editable review textarea. Escape stops listening and preserves text; it does not discard. Interim results do not move focus, global shortcuts/arrows are not intercepted, and normal OS dictation/input behavior is not filtered. Manual keyboard/provider testing remains pending.

Step 9 uses native close/select/summary/link controls, semantic ordered caption history and ordinary transcript tools. No global caption shortcut, focus stealing, audio dependency or fake timestamp button exists. Full viewer/search-result/note/report keyboard testing remains pending.

Step 10 uses contextual native buttons and a three-tab original/adapted/compare pattern with Left/Right/Home/End keys. Mode, Listen, explicit default-save and close actions remain native. Comparison text stays selectable and focus returns to the invoking control. Manual focus/reflow verification remains pending.
# Step 11 explanation controls

Level and structure use native labelled selects; actions use native buttons; results use a polite status region. Close returns focus to the invoking control. Keyboard-only and screen-reader manual verification is PENDING.
# Step 12 Language Bridge controls

Mode/language selectors are native labelled selects; glossary/original/compare/listen/save/report actions are native buttons; status is polite; close returns invocation focus. Full keyboard and screen-reader manual verification remains PENDING.
# Step 13 card and lookup

Manual input and section-term buttons avoid pointer-only lookup and per-word Tab stops. Lookup/card are labelled nonmodal dialogs; Escape closes and focus returns. Native buttons/input/details are used. Complete keyboard/screen-reader manual verification remains PENDING.
# Step 14 multilingual panel

Actions/select use native labelled controls and contextual names, status is polite, and close returns focus. Source remains present. Full keyboard, screen-reader language announcement and no-trap verification remains PENDING.
# Step 15 status and recovery

Connection/sync status uses text and native Details/Remove/Cancel buttons; no colour-only/flashing state. Draft capture does not intercept typing shortcuts. Full keyboard/screen-reader announcement, flapping and 200% zoom testing remains PENDING.

Step 16 uses native controls and button-based block ordering; no Essential action requires drag, hover, voice, precise pointing or a shortcut. Shortcut help, focus return and restrained announcements require browser verification.
Step 17 previews use native actions/44px targets; package HTML uses headings/contents links and no canvas. End-to-end keyboard/reader verification remains PENDING.
Step 18 Print Review Plan requires a native explicit action; preview headings/tasks/questions are semantic. Browser focus/print-dialog/AT verification remains pending.
Step 19 models nine native player actions, 44px controls and restrained status text. Actual audio focus, shortcuts and screen-reader output remain pending.
Step 20 canonical guides use headings/lists/native 44px actions; practices require no drag/hover/voice. Routed focus and full keyboard/AT verification remain pending.
