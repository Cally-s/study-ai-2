# AccessibilityPreferences Data Model

## Purpose

`AccessibilityPreferences` stores functional presentation/participation choices only. It never stores disability, diagnosis, medical/accommodation/guardian documents, proficiency/status/ability/financial labels, selection reasons, inference, or unrestricted JSON metadata.

## Canonical relational contract

One row per User: unique `userId` foreign key; generated `id`; `schemaVersion` and optimistic `version`; language, reading/display, speech/caption, connectivity/participation fields; `createdAt` and `updatedAt`. Account deletion removes or anonymizes preferences according to policy without deleting unrelated education records.

Controlled enums cover bilingual mode, four explanation levels, five text scales (100–200), line/letter spacing, content width, approved fonts, contrast, system-aware motion, caption size, low bandwidth and five Study Room modes. Speech rate is 0.5–2.0 in 0.25 increments. Supported BCP-47-like language values use an approved capability list.

Defaults: English interface/explanation; no home/bridge/caption language; bilingual off; preserve English terms; Standard Academic; 100% text; standard spacing/width/system font/default contrast; motion SYSTEM; speech/captions off; rate 1.0; bandwidth AUTO; TEXT_ONLY Study Room (matching the current accessibility MVP decision); offline/audio summary availability true without automatic generation/download.

Precedence is response > task/lesson > conversation > account > device > OS > default. Narrow overrides do not persist. Production database/ORM, migrations and cross-device persistence do not exist in this repository.
## Recovery scheduling use

Step 6 may copy only student-previewed allowlisted functional settings into recovery-specific overrides. It does not copy diagnoses or the entire preference record and never changes account defaults. Teachers/tutors receive nothing without later field-level sharing confirmation.
