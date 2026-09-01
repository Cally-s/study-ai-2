# Recovery Work Suggestions

## Authorized sources and selection

Supported sources include platform assignments/assessments, course calendar, study plan, teacher announcements, submission records, returned work, student entry, imported-unverified data, external applications and teacher-meeting context. Every imported suggestion retains entity ID, source type/version and date confidence. Authorization and hidden-assessment checks fail closed.

Suggestions are never selected automatically. The initial set is at most three in Overwhelmed mode and at most five otherwise. The UI shows a small text-first batch; full history and private teacher notes are excluded. Student selection is explicit and idempotent.

## Deduplication and source updates

Official identity uses source type/entity ID. Manual candidates use a cautious session/course/type/normalized-title/original-date/source fingerprint. Possible duplicates show a review state; merging is never automatic and Keep Both remains available. Different attempts, revisions, milestones and meetings must remain separate.

Source updates stage previous/new values, source, version and discovery time. Accept Update, Keep My Recovery Entry, Merge Safe Fields and Review Later are explicit decisions. Original dates, student estimates and private notes remain preserved.

## Privacy and low bandwidth

Suggestion lists are owner-only, exclude raw titles/dates from analytics and use synthetic fixtures here. Low-Bandwidth mode uses small text-only pages, no media preloads and local-first saves without reducing essential status/source information.
## Imported candidates

Step 5 candidates are not Step 4 suggestions or inventory items. They preserve field provenance and require confirmation first. Conversion then reuses Step 4 duplicate checks; source IDs/hashes assist matching, but no merge is automatic.
