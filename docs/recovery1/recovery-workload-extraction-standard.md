# Recovery Workload Extraction Standard

The pipeline authenticates the student, validates session/method/source, sanitizes private source text, parses bounded lines, generates schema-validated candidates/fields, applies integrity/privacy filters, stores field provenance and requires review before idempotent Step 4 conversion.

Every field keeps extracted, normalized and confirmed values; artifact, locator and excerpt; extraction method; high/medium/low/unknown confidence; confirmation status; extractor/model versions; and student edit metadata. Model claims never validate themselves. Source text is untrusted and cannot confirm fields, authorize connections, change policy, send messages, expose answers or execute actions.

Local rules identify controlled task types, common course matches, grouped quantities, relative/ambiguous dates and provisional status phrases. They never invent titles, dates, duration or late acceptance. Active/restricted assessment metadata may be planned, but protected questions/answers are excluded. External AI/OCR is unavailable; a production provider must receive only minimized relevant content with verified training/retention settings.

Step 8 maps imported, OCR and AI fields to Extracted Unconfirmed or Estimated regardless of extraction confidence. Only reviewed field-specific authorized evidence may become Source Confirmed.
