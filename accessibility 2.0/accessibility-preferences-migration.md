# AccessibilityPreferences Migration

Legacy mappings: `preferredLanguage`/`interfaceLanguage` → `interfaceLanguageCode`; `explanationLanguage` → `explanationLanguageCode`; `bridgeLanguage` → `bridgeLanguageCode`; `fontSize`/`textScale` → `textScalePercent`; `contrastMode` → `contrastTheme`; `reducedMotion` Boolean → ENABLED/DISABLED; `lowBandwidth` Boolean → ENABLED/DISABLED; `textOnlyStudyRooms=true` → TEXT_ONLY; captions/speech rate retain meaning.

`textOnlyStudyRooms=false` does not imply camera/audio and is left unset unless an explicit safe mode exists. Missing values remain defaults, not false user choices. Invalid old values are discarded safely. Existing created/updated time should be retained where available. Migrations require a unique user constraint, idempotent upsert, schema/version fields, duplicate detection and no preference-combination indexes.

Client storage migration namespaces by user/device, preserves educational drafts, validates each field and supports shared-device cleanup. Rollback retains the pre-migration snapshot or reversible mapped columns without restoring prohibited data. No database/client migration was created or run because the repository has no database/ORM/migration tooling.
