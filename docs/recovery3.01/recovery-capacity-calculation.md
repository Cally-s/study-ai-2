# Recovery Capacity Calculation

Step 17 clips confirmed focused time at the exact test start and protected stopping time while preserving sleep, commitments, setup, breaks and buffer.

Step 16 requires 5 or 10 confirmed focused minutes now, respects setup/break/stopping time and never uses uncertainty, blank calendar time or protected buffer.

`DEFAULT_RECOVERY_CAPACITY_UTILIZATION = 0.80`. For confirmed minutes, the raw planning envelope is `floor(minutes × ratio)` and protected buffer is the remainder. Standard/Extra/Tighter use 80%/70%/90%; tighter requires explicit confirmation and no ratio may exceed 100%.

Breaks, setup and transitions are inside the envelope. Estimated focused-task minutes equal envelope minus those values, never availability plus extras. Later practical blocks round down, preserving/increasing buffer. No-time days contribute zero; unsure/not-entered days are excluded from confirmed totals rather than treated as zero.

The 45/90/60/30/180/120-minute examples produce 36/72/48/24/144/96-minute envelopes. The seven-day 525-minute example yields a 420-minute envelope and 105-minute buffer. This is a limit, not a productivity target or guarantee.

Snapshots store profile/inventory versions, horizon/timezone, totals, ratio and algorithm version. Availability, commitment, preference, buffer, timezone or horizon changes invalidate snapshots; outdated results are not silently reused.

## Step 7 denominator

Feasibility uses `estimatedFocusedTaskMinutes`, not stated availability or the planning envelope. Snapshot/version changes invalidate the analysis; protected buffer, breaks, setup/transition, uncertain days, and post-deadline time remain excluded.

## Prerequisite repair

Quick Rescue repair is capped at twenty minutes and Full Recovery at one preferred focus block. Repair uses focused capacity after breaks/setup and never protected buffer or protected stopping time. Unknown or insufficient capacity cannot be presented as a confirmed fit.

Minimum and Stretch use only `estimatedFocusedTaskMinutes`; their maximum totals must fit together. Breaks/setup and protected buffer remain separate displayed quantities and are never advertised as Stretch capacity.
