# AccessibilityPreferences API

Conceptual owner operations are `getMyAccessibilityPreferences`, `createMyAccessibilityPreferences`, `patchMyAccessibilityPreferences`, `resetMyAccessibilityPreferences`, and `deleteMyAccessibilityPreferences`. Identity comes from the authenticated server session; browser `userId` is ignored. Missing records are optional and defaults keep the product usable.

PATCH is partial and requires `expectedVersion`. A matching update increments `version`; a stale update returns `VERSION_CONFLICT` with the current owner-safe representation and never overwrites silently. Reset accepts selected fields/scope. Delete removes preferences only, not educational records.

Validation errors identify safe codes/fields without echoing sensitive input. Public serialization is `{}`. Owner serialization excludes `userId` and internal keys. Tutor/teacher endpoints use separate active, recipient-, session-, field- and expiry-scoped grants; complete records are never returned. The executable implementation is an in-memory server-contract prototype, not a deployed API.
