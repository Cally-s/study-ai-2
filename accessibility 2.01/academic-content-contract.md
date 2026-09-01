# Academic Content Contract

Every adaptation references source type/ID/version and a versioned hash. The contract captures subject, course/grade, curriculum expectations, learning objectives, success criteria, exact academic terms and definitions, facts, reasoning/instruction order, numbers, dates, names, units, visible equations, code blocks, conditions, exceptions, warnings, citations, protected quotations, allowed examples, prohibited transformations and assessment context.

Numbers, dates, common units and equation-like text are also detected from visible source text. Stable IDs should be supplied by a future content service. A material source-version/hash change invalidates cached artifacts, stops stale TTS and requires regeneration; it never silently updates a historical adaptation.
# Step 11 reuse

One contract instance governs every level in an explanation set. `explanationLevel` and `explanationStructure` are presentation metadata only and never replace academic level, course/grade, curriculum expectation, objective or assessment context. Generated levels cannot become source input for another level.
# Step 12 English terminology

Bridge sources may add `requiredEnglishAcademicTerms`; the bridge artifact joins these with existing required academic terms and validates visible English across main content and glossary. Existing formula/value/unit requirements remain authoritative. Full proposed scientific/code/course-label metadata needs an authoritative source service.
# Step 13 vocabulary context

Lookup context records source type/ID/version, subject/course, language and assessment state. It never overrides contract formulas, scientific names, code, course codes, values or hidden-answer rules. Registry cards are supplemental and cannot replace authoritative source content.
# Step 14 multilingual response contract

Every response validates the original source contract before delegating to Language Bridge. Source/version/hash, required English terms, formulas/values and assessment context remain authoritative. Independent instruction/semantic equivalence is still unavailable.
