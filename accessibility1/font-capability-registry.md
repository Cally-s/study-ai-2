# Font Capability Registry

| Code | Display name | Source/licensing | Script support | Fallback | Status |
|---|---|---|---|---|---|
| SYSTEM | Device system font | System-provided | Device-dependent; registry includes Latin, Arabic, Hebrew, CJK, Devanagari | System stack | Available, manually unverified |
| STUDYSPARK_DEFAULT | StudySpark default | Project Google Fonts plus system fallback | Latin; fallback by `lang` | System stack | Available, manually unverified |
| HUMANIST_SANS | Humanist sans serif | System-provided stack | Latin | System stack for other scripts | Available, manually unverified |
| READABLE_SERIF | Readable serif | System-provided stack | Latin | System stack for other scripts | Available, manually unverified |

No special dyslexia font is exposed because the workspace contains no bundled/licensed/tested asset for one. No raw font paths, user fonts, external URLs, or CSS-family input are accepted. Code and math always keep their configured safe fonts. Mixed-language blocks rely on language-aware system fallback. Zoom, glyph coverage, weight availability, font loading, RTL, code/math, and missing-glyph behavior require manual/browser verification.
