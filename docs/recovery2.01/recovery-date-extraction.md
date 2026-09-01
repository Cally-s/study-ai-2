# Recovery Date Extraction

Date interpretations are Exact, Relative, Date Range, Ambiguous Numeric, Missing Year/Month/Day/Time, Conflicting and Unknown. “Thursday,” “tomorrow” and “next week” remain relative; `10/12` remains ambiguous; “October 12” remains missing-year. No value becomes confirmed until the student confirms/corrects it or explicitly chooses unknown/not applicable.

Relative resolution requires source creation/posting/capture context plus timezone. Upload date is not silently used for an older source. The interface must ask whether the displayed exact interpretation is intended. Original source text and student correction remain in provenance.

Date-only values stay date-only and never gain 11:59 p.m. Approximate/range wording remains approximate. The local prototype detects uncertainty but deliberately does not resolve relative dates automatically.
