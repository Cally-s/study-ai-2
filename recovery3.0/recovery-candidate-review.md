# Recovery Candidate Review

Candidate states are Extracted, Needs Review, Partially Confirmed, Confirmed, Rejected, Merged, Added to Inventory and Outdated. Field states are Extracted Unconfirmed, Source Confirmed Needs Student Review, Student Confirmed, Student Corrected, Conflicting Values, Confirmed Unknown, Not Applicable and Rejected. Confidence labels are Clear in Source, Possible Match, Unclear and Not Found.

The review shows source excerpt, extracted/normalized value, confidence and confirmation state in text. Students can confirm, correct, mark unknown, reject or split grouped drafts. Corrections preserve original values. “Three assignments” remains a grouped candidate; splitting creates title-unknown drafts rather than invented names.

All required Step 4 fields must be confirmed/unknown/not applicable before a candidate becomes Confirmed. No blind Accept Everything exists; ambiguous dates, AI estimates, vague statuses, late-work claims, grouped items and course conflicts cannot be batch confirmed. Partial conversion adds only confirmed candidates and preserves remaining drafts. Step 4 duplicate/idempotency checks run during conversion.
