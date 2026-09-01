# MVP Feature Flags

The canonical manifest is `config/studyspark-mvp-capabilities.js`. It contains six stage records and 50 feature records with dependencies, server operation, route, flag, additive migration dependency, required tests, status, and limitation reference. Six stage flags plus 50 feature flags are currently false.

Flags are tenant-aware release outputs, not client permission. A feature route is exposed only after an administrator records passing evidence, the stage gate passes, all earlier gates pass, and a channel release is created. Disabling UI never disables authentication, tenant isolation, privacy, final-answer restrictions, accessibility baseline, or other safety. Channels are Development, Internal Review, Closed Pilot, School Pilot, General Release, Paused, and Rolled Back. Rollback disables availability while preserving student work and policy/evidence history.
