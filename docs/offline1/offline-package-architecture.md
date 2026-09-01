# Offline Study Package Architecture

Step 17 extends Step 15 rather than creating new storage, downloads, or submission queues. The package module owns controlled schemas, validation, printable semantic HTML, immutable in-memory manifests and version conflict models. Step 15 owns large-file decisions, Download Later and explicit outbox operations. Authenticated APIs, database/jobs, object storage, accessible PDF/audio generation, licensing, scanning, OCR and durable download infrastructure are unavailable.
