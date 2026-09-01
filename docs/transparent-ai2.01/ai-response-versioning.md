# AI Response Versioning

schemaVersion governs JSON; cardVersion governs presentation. Step 48 emits ai-response-record/1.0 and standard-response-card/4.0. Unsupported versions fail closed without raw JSON. Published records remain immutable. Corrections, source confirmations, outcomes, assumption/policy changes, and recalculation create linked new records while historical snapshots remain.
