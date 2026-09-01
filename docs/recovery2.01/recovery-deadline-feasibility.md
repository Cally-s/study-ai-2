# Recovery Deadline Feasibility

For every known deadline, Step 7 totals confirmed work due by that point and confirmed focused capacity available before it. Capacity after the deadline, uncertain days, breaks, setup/transition, and protected buffer are excluded.

Dependency edges add the prerequisite once to the earliest dependent deadline that requires it. Source-linked items are deduplicated before calculation. The Step 4 graph rejects cycles; Step 7 fails closed when supplied dependency data is invalid or unknown. Unknown deadlines produce clarification rather than an invented end-of-week placement.

Results are FITS, TIGHT, DOES_NOT_FIT, NEEDS_INFORMATION, or NOT_APPLICABLE. A DOES_NOT_FIT deadline prevents an overall Manageable result and creates a negotiation candidate. Deadline, dependency, inventory, capacity, timezone, and source changes require recalculation. Trusted local-time/DST resolution is not available in this prototype.
