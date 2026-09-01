# Recovery Case State Machine

Primary states are Draft, Inventory In Progress, Needs Clarification, Plan Ready, Active, Waiting for Teacher, Waiting for Tutor, Recalculating, Stabilized, Completed, Paused and Archived. Explicit adjacency and guards reject invalid transitions. Precedence is Archived, Paused, Completed, Recalculating, Plan Ready, Needs Clarification, dominant waits, Stabilized, Active, Inventory, Draft. Pause records prior state; resume revalidates; archive differs from delete; restore/reopen are explicit.
