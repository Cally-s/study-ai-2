# Connection Status Standard

States: Online, Weak, Unstable, Offline, Server Unreachable, Captive/Blocked, Reconnecting and Unknown. Signals combine navigator online, optional Network Information hints and reported StudySpark request outcomes. The static prototype has no heartbeat/WebSocket/service-worker results, so status is a hint.

Connection and sync remain separate. Sync states distinguish local saving/saved, pending/syncing/synced, conflict/failed/expired/authentication required. The indicator uses text, native buttons, polite announcements only for meaningful transitions, no flashing/constant animation and no public/raw latency history. Production needs heartbeat, debouncing/hysteresis and real-browser flap testing.

