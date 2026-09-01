# Recovery Feasibility Policy

The server-controlled contract is `recovery-feasibility-default`, version 1. It stores ratios as scaled integers: Manageable maximum 8,500/10,000 (0.85); Tight maximum 10,000/10,000 (1.00). Clients cannot supply thresholds.

Manageable requires current sufficient data, positive focused capacity, an upper load no greater than 0.85, no material unknown estimates, and no deadline bottleneck. Tight covers 0.85–1.00, ranges crossing capacity, low margin, or material uncertainty. Work beyond capacity or a hard deadline bottleneck is Not currently possible without changes. Zero capacity never produces Infinity or NaN. Zero work and zero capacity needs information rather than receiving a false Manageable label.

Deadline windows use cumulative confirmed remaining work and confirmed focused capacity before the deadline. Date-only deadlines stay date-only and are treated conservatively; production timezone/DST authority remains required. Analyses reference inventory, capacity snapshot, policy, algorithm, horizon, and timezone versions.
