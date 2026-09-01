# Low-Bandwidth Mode

Step 22 loads privacy text before media, does not preload recordings/exports, preserves consent/deletion controls, shows sizes, and requires explicit confirmation before any offline export/deletion draft enters the Step 15 outbox.

Status: DEVICE_LOCAL_PROTOTYPE. Manual verification: PENDING.

Low-Bandwidth Mode is optional with Auto, Enabled and Disabled account values plus Follow Account, Enabled on This Device and Disabled on This Device overrides. Route/media overrides precede device/account; browser save-data/network/online signals are hints only and never become permanent profile facts or financial/background inferences.

Enabled behavior is text-first: media never autoplays/preloads, images are lazy/async and non-essential media has low priority, decorative animation can become static, transcripts/audio-only/sizes appear before large video, and loading requires explicit action. Academic content is not removed. Existing local live Study Room media still needs dedicated low-data verification.

The shared textual indicator separates connection, low-bandwidth, local draft and sync state; pending operations expose Sync Details and cancellation. Eight visible draft types save device-local snapshots without final actions/tokens. Outbox records exist only after explicit Submit/Send/Post/Search, use idempotency keys, remain visible/cancellable and require authentication, authorization, deadline and source-version reconciliation before SENT.

Trusted media metadata drives a configurable large-file warning. The 85 MB fixture offers Read Transcript, Play Audio Only (9 MB), Download Later, Continue to Video and Cancel. Download Later queues metadata only and never starts a hidden download.

No service worker, IndexedDB, Cache Storage, lesson cache, background sync, server heartbeat/retry endpoint, trusted production metadata or durable server sync exists. Remove offline StudySpark data clears drafts/outbox/downloads while preserving preferences. Device localStorage is not guaranteed durable, encrypted or shared-device safe enough for production.
# Step 16 Study Room integration

Text Only initializes no media and downloads no participant media. Captions Only loads text without local audio; Listen and Audio modes omit video. Every mode loads text tools first, retains connection/draft status, and never sends an unsent draft on reconnection.
Step 17 Low Data/Text Only variants omit optional media and show estimated sizes before action. Large trusted packages reuse Step 15 warning/Download Later; previews never download.
Step 18 printable HTML is text-first and can become a Step 17 Low Data component. Cached offline printing remains unavailable and is never claimed.
Step 19 shows matching text first and uses no preload. Download Later is unavailable until a trusted downloadable audio asset exists; no audio is fabricated offline.
Step 20 every guide has canonical Low-Bandwidth text first and never preloads unavailable media. Offline guide caching remains unavailable.
Step 21 toolbar is text-first; offline package action returns an explicit Step 17 intent and never starts downloading or caches a variant automatically.
