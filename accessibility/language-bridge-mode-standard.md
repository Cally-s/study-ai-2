# Language Bridge Mode Standard

| Mode | Main display | Required English-term behavior |
|---|---|---|
| English only | Approved English explanation | Terms in English explanation/glossary |
| Home language only | Bridge-language explanation | English terms remain in glossary and may be inline |
| English first, then home language | English then bridge blocks | English block plus glossary |
| Home language first, then English | Bridge then complete English blocks | English block plus glossary |
| Side-by-side bilingual | Semantically paired blocks | English block plus glossary |
| English with translated keywords | Full English with selected term pairs | English remains primary |

All modes retain original English, source ancestry, objective, course/grade and one explanation level. Side-by-side becomes stacked without horizontal prose scrolling on narrow/high-density layouts. Each section has `lang`; RTL bridge sections have `dir="rtl"`, while English, formulas and code remain LTR-isolated.

