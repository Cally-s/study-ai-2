# Media and Bandwidth Inventory

| Media/system | Current behaviour | Accessibility/bandwidth finding |
|---|---|---|
| Profile images | Optional, decorative empty alt in cards | Appropriate when adjacent name supplies identity; recheck standalone uses |
| Uploaded images | Stored as learning files | Informative alternative-text workflow is not implemented |
| Uploaded PDF | CDN PDF.js plus iframe/download fallback | PDF semantics depend on source; no accessible extraction guarantee |
| DOCX | CDN Mammoth parser | Network dependency can fail; safe text/error fallback requires testing |
| Local camera preview | Muted autoplay preview after user device choice | Camera is optional; preview conveys Camera off text |
| Study Room video/screen share | Prototype/local, muted | No real remote media, captions, transcripts, or signaling claim |
| Required educational video/audio | None identified in static essential flows | No caption/transcript pass can be claimed for future uploads |
| Google fonts | External request | System fallback should remain readable; offline verification pending |
| JSON rule/data files | Loaded at startup | Multiple startup requests; throttled-network behavior pending |

No service worker or offline-first cache exists. Much user data is local, but connection interruption, failed CDN resources, partial initialization, retry idempotency, and draft survival must be tested per feature. Non-essential video is not statically preloaded; local media begins only after user action.
