# No Hidden Final Answer

The model generates the allowed scaffold directly. Never generate a full answer for redaction or place it in hidden DOM, ARIA, metadata, tool results, files, notifications, clipboard, print, exports, analytics, receipts, logs, or answer keys. Validation is defence in depth. A violating candidate is discarded, regenerated under a stricter contract, or replaced with a deterministic safe scaffold; its body is not retained.
