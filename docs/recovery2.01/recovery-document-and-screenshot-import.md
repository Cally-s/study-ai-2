# Recovery Document and Screenshot Import

The capability contract recognizes PDF, DOCX, TXT, PNG, JPEG and WEBP as intended formats, but production upload is unavailable. The repository lacks server MIME/size validation, malware scanning, private object storage, expiring links, PDF/DOCX extraction jobs, OCR/vision authorization and verified deletion. The UI therefore provides honest unavailable states and manual/paste alternatives.

A production implementation must validate bytes rather than client claims, hash/deduplicate, scan, store privately, strip EXIF/location metadata, enforce page/image limits and retain page/region provenance. OCR remains unconfirmed. Active assessment/answer-key content must be restricted to permitted planning metadata.

Calendar screenshots require crop-before-upload, keyboard crop coordinates or a full-image alternative with a privacy warning. Personal events, contacts and notifications must not be imported automatically; colour alone cannot establish academic meaning. Default retention deletes temporary raw sources after confirmed import while preserving privacy-safe provenance and confirmed items. Deletion status must distinguish local completion from provider/backups.
