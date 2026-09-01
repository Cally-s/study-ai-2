# Visual Content Preservation Contract

Visual modes may change CSS, wrapping, grouping, decorative visibility, and optional-panel state. They must not change academic content or required actions.

The validator compares normalized source identifiers for lesson records, lesson blocks, learning objectives, required instructions, informative images, equations, code examples, quiz questions, answer options, feedback, downloads, safety notices, academic-integrity notices, and primary actions.

`validateVisualModeContentEquivalence(standard, visual)` returns invalid when any required source ID is missing or added. `compareVisualModeActionInventory` uses the same exact-ID comparison. Screenshot similarity alone is never accepted as content-equivalence evidence.

Covered route families are lessons/notes, AI explanations, quizzes, session summaries, help/instructions, downloads, safety/integrity views, and shared actions. Study Rooms retain the standard interface; distraction-reduced reading view is unsupported there.

Allowed differences: font/spacing/width/alignment, semantic theme tokens, motion removal, single-column placement, decorative imagery removal, and optional panel collapse. Prohibited differences: changed or missing questions, options, instructions, objectives, diagrams, equations, code, downloads, deadlines, timers, notices, help/report controls, save/submit actions, or curriculum metadata.

Step 6 comparisons add suggested preset, customized, ruler-only, highlight-only, reduced-clutter-only and font-only views. Highlight and ruler overlays are excluded from inventories because they are aria-hidden presentation layers. Required content/action IDs must remain identical in every comparison.
