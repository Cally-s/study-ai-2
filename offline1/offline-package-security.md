# Offline Package Security

Servers generate immutable manifests, content hashes, and signatures after answer/secret/private-data/rights/accessibility scans. Installation verifies tenant access, signature, hash, version, expiration/revocation, safe archive paths/sizes/types, decompression limits, malware scanning, and available storage. Packages cannot execute scripts, call providers offline, conceal answer assets, or expose tenant/provider secrets. Corrupt packages prompt trusted redownload; drafts remain separate. Synchronization reauthenticates and prevents cross-account/tenant replay.
