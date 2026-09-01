# Recovery Feature Flags

The inventory contains one global flag plus 5 Stage 1, 6 Stage 2, 5 Stage 3, 5 Stage 4 and 8 Stage 5 flags. Flags default off beyond the released stage and are evaluated with tenant, environment, role, account type, stage status and prior-stage dependencies.

Changes require platform deployment/product authority, optimistic row version, policy/flag versions and audit. UI hiding is not authorization; every operation and route requires the same authoritative guard. Rollback disables the affected and later flags. This prototype exposes an executable guard contract but has no production server.
