# Public Profile Privacy Standard

Step 27 serializes AccessibilityPreferences as an empty public object; no preference field enters profile, search, social metadata, cache or tutor cards.

Public student serialization is allowlist-only: display name, avatar, academic interests, and safe public contribution badges. Accessibility/language/transcript/recording/accommodation/diagnosis/guardian/privacy/offline/participation fields are excluded. The same serializer must feed profiles, previews, search, metadata, and caches. The static project has no public profile route, GraphQL API, search engine, social metadata pipeline, or public cache to clean.
