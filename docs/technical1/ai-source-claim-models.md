# AI Source and Claim Models

> Step 66 integration: the source plan precedes retrieval but cannot declare support. Verified `AISourceRecord` and `AIClaimCheck` links are created only after existence, identity, currentness, and exact claim support checks; search snippets and pending cached copies never become confirmed evidence.

`AISourceRecord` identifies a real source with bibliographic metadata, URL, accessed time, version, currentness, and verification state. Search snippets are rejected as sources. Offline creation is visibly `VERIFICATION_PENDING_INTERNET_ACCESS` and cannot count as verified evidence. `AIClaimCheck` stores the exact claim, type, evidence requirement, support state, and safe summary. A normalized claim-source join supports many-to-many evidence. Only an authorized human reviewer can set a verification outcome.
