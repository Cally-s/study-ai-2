# Reading Ruler Standard

The reading ruler is independent from the preset, font, spacing, highlight, clutter, and simplified layout.

- Styles: Highlight Band, Focus Strip, Dim Surrounding Content.
- Sizes: Small, Medium, Large.
- Tracking: Manual and Follow Reading Focus. Follow TTS is unavailable until reliable tested boundary events exist.
- Controls: previous/next paragraph, up/down, smaller/larger, hide/show controls, and turn off.

The overlay is aria-hidden, non-focusable, pointer-transparent, non-animated, excluded from print/PDF, and never the only reading-location cue. It must not block text, selection, links, fields, buttons, captions, quiz submission, chat Send, Leave Room, or safety actions. Controller controls are native buttons in a named group and respect safe areas and wrapping.

Only enabled/style/size/tracking persist. Pixel coordinates, raw content, speed, and line history do not. Ruler movement creates no account write. Manual collision, contrast, zoom, selection, RTL, Study Room, and assistive-technology verification remains pending.

`FOLLOW_TEXT_TO_SPEECH` now accepts sentence geometry from the active TTS segment, but remains PARTIAL until real-browser synchronization and collision tests pass. If unavailable, manual ruler movement and visible source text remain usable.
