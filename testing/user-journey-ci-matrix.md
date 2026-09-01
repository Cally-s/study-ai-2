# User-Journey CI Matrix

| Cadence | Scope | Current evidence |
|---|---|---|
| Per commit | UJ-001–UJ-050, scanners, module-boundary regressions | Runnable as one deterministic Node test |
| Nightly | Full repository Node regression | Runnable locally; no configured CI |
| Pre-release | Browser, API server, database, migrations, accessibility, offline device, security, production build | Blocked: infrastructure unavailable |

No critical test is skipped, retried, quarantined, or dependent on a live AI/search/network service. A passing Node run does not promote unavailable layers to passed.
