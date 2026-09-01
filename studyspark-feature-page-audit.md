# StudySpark Feature-Page Audit

Design rule: “One page should have one main purpose. Related features should be available through clearly labelled navigation cards rather than being stacked into one very long page.”

## Student routes

| Current route/view | Primary purpose retained | Dedicated feature destinations | Back fallback | Deep-link handling |
|---|---|---|---|---|
| `dashboard` | Today’s overview and next study action | `coach`, `aiLiteracy`, `planner`, `communityAIProject`, `progress` | Application root; no Back arrow | Existing view key remains canonical |
| `coach` | Active AI Coach conversation | `promptWithPurpose`, `answerVerification`, `claimEvidenceMap`, `sourceComparison`, `aiUseReceipt` | `dashboard` when no remembered route exists | Existing feature views and permissions retained |
| `aiLiteracy` | Choose and continue a learning pathway | `aiDiagnostic`, `aiCompetencyProgress`, `competencyPortfolio` | `dashboard`; detailed Learning Check falls back to `aiLiteracy` | Existing Learn/pathway state and deep links retained |
| `planner` | Current assignments and plan creation | `savedPlans`, `academicRecovery` | `dashboard`; detail routes use planner-specific fallbacks | Saved Plans no longer uses a same-page shortcut |
| `communityAIProject` | Project overview and continuation | `problemScopingStudio`, `aiSystemCardStudio`, `aiArchitectureDesignStudio`, `dataResponsibilityStudio`, `competencyPortfolio` | `dashboard` or remembered Projects page | Existing project IDs, evidence, and versions retained |
| `progress` | Current progress overview | `learningProfile`, `examReadiness`, `futureSuccess`, `wellBeingDashboard`, `competencyPortfolio` | `dashboard`; each detail returns to `progress` when opened from the hub | Existing progress records remain authoritative |
| `settings` | Account profile and course management | `accessibilityLanguage`, `privacyData`, `notifications`, `wellBeingReminderSettings` | `dashboard`; setting details return to `settings` | Existing Settings links remain valid |
| `instructions` | Main help guide | `wellBeingHelpSafety`, `safetyPrivacy`, `accessibilityLanguage` | `dashboard` | Existing Help deep links remain valid |

## Teacher routes

| Current route/view | Primary purpose retained | Dedicated feature destinations | Back fallback | Deep-link handling |
|---|---|---|---|---|
| `roleDashboards` | Teacher home or students-and-progress overview | `resourceStudio`, `assignmentPolicyBuilder`, `integrityReview`, `communityAIProject` | Previous valid StudySpark view, otherwise `dashboard` | Role and tenant checks remain in destination workflows |
| `resourceStudio` | Courses and accessible resource authoring | `assignmentPolicyBuilder`, `communityAIProject` | Previous teacher hub | Existing course/resource IDs remain unchanged |
| `assignmentPolicyBuilder` | One assignment-policy workflow | None; focused workflow page | Previous teacher hub | Existing assignment-policy deep link retained |
| `integrityReview` | One authorized review workflow | None; focused workflow page | Previous teacher hub | Existing authorization and review state retained |
| `communityAIProject` | Project overview | Project workflow destinations listed above | Previous teacher hub | Existing project permissions retained |
| `settings` | Teacher account settings | Shared dedicated preference pages | Previous teacher hub | Existing role-aware navigation retained |

## Parent, tutor, and shared entry routes

| Current route/view | Primary purpose retained | Dedicated feature destinations | Back fallback | Deep-link handling |
|---|---|---|---|---|
| `peerTutoring` | Role-aware tutoring/family overview | `bookingSessions`, `tutoringRequests`, `serviceDocuments`, `communityImpact` | Previous valid role home | Existing authorization remains in each destination |
| `accessibilityLanguage` | Accessibility and language preferences | None; focused workflow page | `settings` when opened there | Existing preference deep link retained |
| `privacyData` | Privacy, offline storage, and device data | None; focused workflow page | `settings` when opened there | Existing privacy route retained |

## Implementation decisions

- The global sidebar remains limited to the existing primary role destinations; no feature-level links were added.
- Major overview pages render a compact, responsive feature-card grid above their original current-content area.
- Feature cards navigate through the existing `showView` router, so unsaved-work dialogs, role navigation, permissions, data ownership, and history continue to apply.
- Hub pages no longer generate same-page section-scroll shortcuts. Non-hub workflow pages may still expose local areas when those areas belong to the same focused workflow.
- Every generated dedicated feature view receives the shared arrow-only Back control. The Dashboard remains the application root and intentionally omits it.
- No destination view, data model, feature flag, record, or route key was duplicated or removed.
