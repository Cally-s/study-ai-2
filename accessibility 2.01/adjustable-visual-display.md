# Adjustable Visual Display

Step 23 reuses display presets for read-only author previews. Authorized learner preview exposes functional fields only and never changes learner settings.

## Architecture

StudySpark is a browser-local vanilla HTML/CSS/JavaScript application. Step 5 extends the existing `AccessibilityLanguage` profile and the existing `studyspark.accessibilityToolbar.v1` device snapshot. It creates no overlay, second profile, second storage key, backend model, or database migration.

## Supported options

- Text: System, Small (90%), Medium (100%), Large (125%), Extra Large (150%), and validated Custom (100–200%).
- Line height: System, Default, Relaxed, Expanded, Extra Expanded.
- Letter spacing: System, Default, Relaxed, Expanded, with language/code/math exclusions.
- Reading width: System, Short, Comfortable, Wide, Full.
- Reading alignment: System or logical reading-direction start.
- Paragraph spacing: System, Default, Relaxed, Expanded.
- Contrast: System, Standard, High-Contrast Light, High-Contrast Dark.
- Motion: System, Standard, Reduced Motion, Animation Free.
- Simplified page layout and an on-demand distraction-reduced reading view.

All controls apply immediately. Signed-out use remains device-only. Registered users reuse the optimistic-version account update. Unrelated language, caption, speech, Study Room, and bandwidth fields are preserved.

## Design tokens and first paint

Centralized `--studyspark-*` typography, colour, motion, and layout tokens are selected by validated root data attributes. The existing head boot validates and migrates the existing snapshot before body paint. High contrast uses semantic tokens, never blanket inversion. Images are not filtered.

## Content and academic preservation

Visual settings change presentation only. They do not rewrite or omit course content, objectives, reasoning, terminology, assessment, deadlines, safety, consent, integrity notices, or actions. Source-ID and action-inventory comparison is defined in `visual-content-preservation-contract.md`.

## Simplified and reading modes

Simplified layout uses single-column grids, removes named decorative/promotional panels, and keeps application content and actions in the DOM. Reading view keeps the active content and toolbar available, adds an explicit Exit action, restores scroll position, and is not applied to Study Rooms.

## RTL and language behavior

Reading alignment uses `text-align: start`. Added letter spacing is suppressed for Arabic, Hebrew, CJK, Devanagari, code, math, identifiers, and passwords. Full Arabic interface translation is not implemented.

## Reflow and wide content

Buttons wrap, targets retain a 44-pixel minimum block size, dialogs use viewport bounds and internal scrolling, action groups wrap, core grids collapse, and code/tables use internal overflow. Browser and pinch zoom are not disabled.

## Known limitations

Automated source tests pass, but no controlled browser zoom, contrast measurement, forced-colours, screen-reader, mobile orientation, screenshot comparison, or end-to-end visual journey ran. Colour-independent repair currently covers shared status rendering and quiz correct/incorrect states; the full application-wide status/chart audit remains partial. Step 5 must not be described as fully visually verified.

## Step 6 extension

The same visual profile and root-token architecture now includes independent word spacing, font stacks, reduced decorative italics/fonts, reduced clutter, focus highlighting and ruler attributes. These additions reuse the Step 5 content contract. Overlays never mutate content; code/math/tables/forms remain excluded. See `dyslexia-friendly-display.md` for capability boundaries.

Step 7 sentence highlighting uses a separate non-interactive overlay and never changes or hides the source. The player wraps, scrolls, respects safe areas, and is excluded from print; real collision/zoom verification remains pending.

Step 8 dictation controls use wrapping layouts, minimum control sizes, safe-area placement, scroll containment, text states, forced-colors rules, and print exclusion. No waveform or animation is required. 200%/400% zoom and physical permission UI remain pending manual verification.

Step 9 adds independent Small–Extra Large caption text, four caption backgrounds, top/bottom/detached position metadata, wrapping controls, bounded scroll history, safe areas, forced-colors support and print exclusion. Captions remain text-based and non-animated. Collision and 200%/400% zoom testing remain pending.

Step 10 comparison stacks to one column on narrow screens, uses minimum-size wrapping controls, bounded scrolling, safe-area placement, forced-color borders and no required animation. Original access remains present in simplified/distraction-reduced layouts.
# Step 11 explanation panel

The explanation panel inherits display tokens, supports wrapped controls and a single-column comparison below 700px, uses 44px minimum controls and safe-area offsets. 200%/400% zoom and theme combinations remain PENDING.
# Step 12 bilingual layout

Semantic bilingual pairs use logical properties, wrapped controls, safe-area offsets and one column on narrow/high-density displays. Formula/code direction is isolated. Actual 200%/400% zoom, themes and orientation testing remains PENDING.
# Step 13 vocabulary card

The card uses safe-area fixed positioning, internal scrolling, wrapped actions, logical properties, 44px controls and single-column narrow reflow. Forced-colour borders exist. Measured 200%/400% zoom, 320px and theme combinations remain PENDING.
# Step 14 bilingual response layout

Semantic bilingual blocks stack narrowly/high-density, use logical properties, safe areas, wrapping and 44px controls. Formula/code direction is isolated and forced-colour borders exist. Actual 200%/400% zoom/theme/mobile testing remains PENDING.
# Step 15 status display

The fixed status uses logical safe-area offsets, internal scrolling, narrow reflow, forced-colour border and 44px controls. Low-bandwidth removes decorative animation only via explicit hooks. Collision/mobile/zoom/theme testing remains PENDING.

Room modes and structured tools use reflowing grids, logical sizing, 44px targets, forced-colour borders and reduced-motion hooks. They do not depend on video or a canvas; zoom testing remains PENDING.
Step 18 Large Text and Extra Writing Space are print settings independent of digital visual preferences. Compact never intentionally removes content; physical scaling/clipping tests remain pending.
Step 20 guide/practice CSS supports responsive layout, forced colours, reduced motion and printable text. Zoom/theme/manual rendering remains pending.
