# Recovery Metric Event Model

Each private event stores metric/source types, source entity/event and version, server-equivalent dedupe key, exact occurrence/local date/timezone, dimension, cumulative/current impact, and status. Only Valid/Counted events enter a snapshot. Corrections create compensating audit records rather than editing counts. Snapshot replay filters exact windows, current event status, and unique dimensions; changed watermarks invalidate cached results.
