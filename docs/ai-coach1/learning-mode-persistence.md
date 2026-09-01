# Learning Mode Persistence

One server-owned active state is stored per conversation. An optional separately confirmed account default initializes new conversations; ordinary conversation changes never alter it. Reload, navigation, and reconnect restore the conversation state. Server-created immutable message snapshots preserve the selected mode and policy version for history and link each response to its initiating message. Cross-account and cross-tenant reads are denied.
