# Practice Area Architecture

Practice sessions use a `practice:<owner>:<time>` namespace, synthetic records, 5–120-minute expiry, zero production writes and the persistent Practice Mode notice. Production submits/messages/rooms/reports/grades/service hours/Help Credits/notifications are hard-blocked. Passwords are rejected; tokens/microphone text are stripped; camera is denied; STT requires explicit start. Reset and removal clear events/files. This is a memory isolation model, not a production sandbox.
