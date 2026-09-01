# Reading Focus Engine

The engine registers prose blocks in the active route and stores a session-only logical block index. It excludes code, math, tables, forms, editors, and the controller. Current Line uses a DOM Range rectangle for the first text range; unreliable or unavailable geometry falls back to the block rectangle and is marked as a fallback.

Overlays are presentation-only: `aria-hidden="true"`, `tabindex="-1"`, and `pointer-events:none`. They do not wrap words, alter source text, accessible names, DOM order, copying, selection, links, or Tab order.

Geometry is scheduled with requestAnimationFrame after resize, scroll, font readiness, content mutation, and setting updates. Font/spacing/width changes keep the block anchor and recalculate physical geometry. Movement uses instant scrolling to respect motion preferences.

Manual tests remain pending for browser zoom, line wrapping, mixed direction, transformed ancestors, nested scrolling, selection/copy, dynamic AI responses, and performance. Until verified, Current Line is PARTIAL and Current Paragraph is the documented fallback.

Step 7 supplies sentence anchors from semantic SpeechDocument blocks. TTS highlighting shares no focus and announces no individual word; unsupported word tracking falls back to sentence. Source text and reading order remain unchanged.
