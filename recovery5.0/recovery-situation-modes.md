# Recovery Situation Modes

## Purpose and horizon separation

Step 1 selects one `RecoveryPlanHorizon`: Quick Rescue (24 hours) or Full Recovery (seven days). Step 2 selects one or more `RecoverySituationMode` values. Selecting a situation never overwrites or silently changes the horizon.

## Supported situations

The closed enum contains `TEST_TOMORROW`, `MISSED_ONE_WEEK`, `MISSED_ONE_MONTH`, `MISSING_PREREQUISITE`, `OVERWHELMED`, `NEED_TEACHER_HELP`, `NEED_PARENT_FRIENDLY_SUMMARY` and `OTHER`. Unknown values are rejected.

## Multi-select and summary

The SPA view uses a fieldset with eight native labelled checkboxes. A visible list and polite count status summarize selections; Clear All is explicit. Continue requires at least one selection. Duplicate values normalize to one active selection per session/type.

## Combination rules

Urgent tests route first. Overwhelmed changes presentation and question budget rather than becoming a deadline or diagnosis. Prerequisite questions connect to shared course/topic context. Monthly backlog uses course-level triage, while the recent week identifies current urgent work. Teacher and parent outputs stay separate. Selecting all modes never concatenates every definition.

## Mode editing

Students may add/remove situations. Removed-mode answers become inactive and are not routed. The history record remains private so a future retention UI can offer keep/delete rather than silently deleting substantial text.

## Privacy and accessibility

Selections are owner-only and public serialization is empty. Overwhelmed, teacher help, parent summary and Other are explicitly sensitive. The UI uses semantic controls, visible focus, text summaries, responsive layouts, forced-colors rules, RTL borders and no auto-advance.

## Known limitations

Persistence and routing are executable client/server contracts in a static prototype. Trusted authentication, relational constraints, server routing, production translations and manual browser/AT evidence are unavailable.

After selection, Step 3 collects three shared calm-intake answers before the broader routed questionnaire.
## Step 4 inventory adaptations

Test Tomorrow starts with the confirmed test and related preparation rather than monthly history. Missed One Week focuses on recent work; Missed One Month begins by course in small groups; Missing Prerequisite supports normalized links; Overwhelmed limits initial suggestions to three; Teacher Help surfaces confirmation drafts; Parent Summary keeps all inventory private pending a later exact preview. These adaptations change collection order and presentation, not final priority.
