# Student Data Taxonomy

`StudentDataCategory` contains 31 controlled values; unknown categories fail closed. `DataSensitivity` is PUBLIC, PRIVATE, SENSITIVE, or HIGHLY_RESTRICTED. Only `PUBLIC_PROFILE` is public by classification. Accessibility/language/voice/transcript data is sensitive; diagnosis, learning-difficulty disclosure, accommodation records/documents, authorized-adult relationships, and exports are highly restricted.

Public output uses `displayName`, `avatar`, `academicInterests`, and `publicContributionBadges` as an explicit allowlist. Lineage transformations are controlled for transcription, translation, summarization, audio generation, embedding, indexing, export, and offline copies. This static project has local browser/session storage and no verified processor registry.
