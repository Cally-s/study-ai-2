# Keyboard Component Contracts

## Native controls

Use `button`, `a`, `input`, `select`, and `textarea` for actions and input. Do not add positive `tabindex`. A custom control must document why a native element cannot be used and implement name, role, state, Enter/Space activation, focus visibility, and disabled behavior.

## Route navigation

After an in-app route changes, update the document title and move focus to the new route heading. Initial page load must not steal focus. The skip link focuses the active route heading.

## Tabs

The container is a `tablist`; each tab exposes `aria-selected`, roving `tabindex`, and `aria-controls`; each panel references its tab. Left/Right and Home/End move and activate within that tablist. Tab and Shift+Tab leave the widget normally.

## Menus

The trigger is a button with a contextual name, `aria-haspopup="menu"`, and synchronized `aria-expanded`. Escape closes only the active menu and returns focus to its trigger. Menu items have contextual names.

## Dialogs

Opening moves focus inside, the background becomes inert, Tab is contained, Escape closes dismissible dialogs, and closing returns focus to the invoker. Destructive confirmation remains explicit.

## Flashcards

The flashcard exposes button semantics and a state-dependent accessible name. Enter or Space produces exactly one flip through the normal click activation path.

## Dynamic controls and errors

Generated controls must receive the same semantics and contextual names as initial markup. Validation summaries should receive focus only after a failed submission and link to individual invalid fields; this remains a follow-up where forms currently use toast-only validation.
