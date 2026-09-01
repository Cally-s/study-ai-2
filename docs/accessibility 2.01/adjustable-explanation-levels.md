# Adjustable Explanation Levels

Step 23 previews explanation level as a functional display preference only; it does not reveal why a learner chose it or authorize editing the learner profile.

Status: PARTIALLY_SUPPORTED. Manual verification: PENDING.

StudySpark exposes one presentation setting named **Explanation level**. It describes the explanation, never the student. The canonical values are Level 1: Beginner, Level 2: Simple, Level 3: Standard Academic, and Level 4: Advanced. Academic level, course/grade, curriculum expectation, learning objective, success criteria and assessment context remain separate and unchanged.

Every requested level is produced directly from the same authorized original source version and the same `AcademicContentContract`. It is never rewritten from another generated level. Valid generated versions remain cached in memory for comparison while that source version is current; the original is always retained. A source-version change invalidates the set.

`STANDARD`, `STEP_BY_STEP`, `GLOSSARY_FIRST`, and `EXAMPLE_FIRST` are structures, not levels. The static prototype supports the first three through the Step 10 deterministic English provider. Example-first fails safely because no reviewed example-generation provider exists. It does not invent examples. Advanced currently preserves the original through the detailed mode rather than claiming unsupported enrichment.

The panel provides the labelled selector, Make Simpler, Add More Detail, Show an Example, Show Original, Compare Levels, Listen to This Level, and an explicit confirmed default-save action. Temporary choices are private, do not save automatically, and do not affect grades, matching, ratings, safety, fraud, integrity, service, Help Credits or account restrictions. Detailed use history is not sent to analytics.

Exact-element validation must pass before display. Failure retains the original and gives an honest error. Passing means required strings and assessment rules passed; it is not a claim of semantic or teacher-reviewed equivalence.
# Step 12 Language Bridge integration

Every supported Language Bridge mode records exactly one Level 1–4 value for both blocks. English is generated from the original through this service; translated content never becomes a level source. Make Simpler/Add More Detail integration is architectural/API-level in this static prototype; combined interactive manual testing is PENDING.
# Step 13 vocabulary integration

Canonical term sense and academic definition remain fixed when explanation presentation changes. The card currently presents one approved plain definition plus the complete academic definition; level-specific card layouts are not separately generated.
# Step 14 split-level alignment

Same-level remains bilingual default. `SIMPLER_ENGLISH` is an explicit response-level exception: English moves down one bounded level, selected-language stays current, both derive from original/contract and labels show both levels. It never changes curriculum level.
# Step 15 offline levels

Previously generated in-memory levels remain switchable while the page/source stays current; no durable offline cache exists. Low-bandwidth generates only requested levels and preserves original/objective/contract.
Step 17 records an explicitly requested explanation level per package/source version and never changes assessment difficulty or generates all levels automatically.
Step 19 speaks only the explicitly selected validated explanation level and records its source version; duration cannot change assessment level.
Step 21 Make Simpler/Add More Detail select adjacent controlled levels without changing academic expectations or bypassing safety/integrity restrictions.
