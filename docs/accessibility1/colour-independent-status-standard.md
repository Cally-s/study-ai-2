# Colour-Independent Status Standard

Important states require visible text plus an icon, border/shape, or native/programmatic state. Colour is supplementary.

The shared `StatusIndicator` accepts SUCCESS, ERROR, WARNING, INFORMATION, PENDING, SELECTED, DISABLED, and OFFLINE. Success uses “✓”, error uses “✕”, warning uses “⚠”, pending uses “⏳”, selected uses “●”, and information/offline uses “ⓘ”. Icons adjacent to text are hidden from assistive technology; the combined accessible label is exposed. Updates use `status`; urgent errors may use `alert` sparingly.

Quiz correct and incorrect options receive visible “✓ Correct” or “✕ Try again” text. Native checked state plus “● Selected” identifies selection. Form errors must use text, `aria-invalid`, an associated description, and a summary; green/red outline alone is insufficient. Study Room microphone, camera, caption, and connection states must retain visible text. Tables require text status cells. Charts require direct labels, shapes/patterns, a summary, and an accessible data-table equivalent.

The shared component and quiz repair are implemented. Complete chart, table, form, download, upload, attendance, media, and Study Room state verification remains open and must not be claimed complete.
