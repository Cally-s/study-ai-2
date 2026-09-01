# MVP Stage 2: Transparent Responses

Stage 2 depends on Stage 1 and adds strict `ai-coach-decision/1.1` responses, transparency cards, explicit source state, confidence with reasons, material/correctable assumptions, concrete verification actions, one relevant thinking question, no-source reasoning, and citation metadata validation.

Every response must show Sources Used, Required, No External Source Used, Supplied Content Only, No Reliable Source Confirmed, or Verification Pending Internet Access. Search snippets and guessed metadata are rejected. Invalid/unverified candidates are not displayed or persisted as responses. No chain of thought or hidden answer is stored.

Release gate includes normalized claim/source relationships, screen-reader order, Stage 1 regression, Stage 2 tests, production build, and no Critical issue. Current result: **Blocked by Stage 1 and production infrastructure**.
