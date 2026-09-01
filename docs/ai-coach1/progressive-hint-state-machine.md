# Progressive Hint State Machine

`NOT_STARTED → DIRECTION_GENERATING → WAITING_AFTER_DIRECTION → NEXT_STEP_GENERATING → WAITING_AFTER_NEXT_STEP → GUIDED_SETUP_GENERATING → WAITING_AFTER_GUIDED_SETUP → MAXIMUM_LEVEL_REACHED`. Every transition authenticates ownership, checks immutable mode/policy/boundary/disclosure state, uses idempotency and optimistic row versioning, and waits for explicit action. A new confirmed problem resets to NONE; rewording or an attempt preserves state; ambiguity asks “Is this a new problem?”

Legacy `SIX_LEVEL_V1` turns remain immutable. Active legacy sessions show the migration notice and require Start New Sequence, Continue Current Attempt, or Switch Mode before generating.
