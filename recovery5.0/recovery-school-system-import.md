# Recovery School-System Import

Only organization-approved connectors may appear. This prototype has none configured and states: “School-system import is not available for this organization.” It never requests or stores school passwords.

A production connector requires approved OAuth, minimum read-only scopes, encrypted token references, user/organization ownership, selected courses, bounded date range, preview, individual unselected items, field review and idempotent confirmation. Historical archives, hidden assessments, answer keys, private teacher notes and other students are excluded.

Provenance retains connector/source record/version/course and last sync without exposing tokens. Revocation removes usable tokens and stops future sync without deleting official school data or confirmed private recovery items. Source changes are reviewed, not silently applied.
