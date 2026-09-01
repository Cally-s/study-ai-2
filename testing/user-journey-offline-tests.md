# User-Journey Offline Tests

UJ-034, UJ-035, UJ-048, and UJ-049 cover local progress, reconnect validation, source-pending status, idempotent synchronization, and conflict preservation. Both local and online versions survive a conflict and the student receives Keep Local, Keep Online, Combine, and Keep Both choices. Silent last-write-wins is prohibited.

The existing Low-Bandwidth/Offline validator is called directly. A real browser service worker and network emulator are not present.
