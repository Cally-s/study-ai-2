# Language and Internationalization Audit

The document correctly declares English (`lang="en"`). There is no internationalization library, message catalogue, locale routing, language selector, translation workflow, or translation quality review. Interface strings, errors, safety policies, and AI-like outputs are embedded in HTML and JavaScript.

StudySpark must not advertise support for a language until one complete Essential flow—including controls, validation, errors, privacy/safety text, notifications, and help—is translated and reviewed. Browser translation is only a temporary user-controlled aid.

Step 2 should introduce locale catalogues, a keyboard/screen-reader accessible persistent language selector, per-response language metadata, text-expansion tests, locale-aware dates/times/numbers, bilingual terminology rules, and academic-equivalence tests. Language preference and accessibility preference must remain private and must not reduce subject level or assessment standards.
