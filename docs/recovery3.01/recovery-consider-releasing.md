# Consider Releasing

Consider Releasing means review whether an item belongs in the student's current private recovery plan. It never deletes work, abandons it, changes a grade, or changes the official school record.

Allowed bases are officially no longer required, confirmed not accepted, replaced work, duplicate work, optional work, teacher-approved deferral, changed program requirement, student-requested review, or other authorized evidence. Student preference starts review but is not official evidence.

A release record moves from request/evidence review to either confirmed for the private plan or kept. “No Longer Required” needs authorized evidence and still cannot be written to the official record by this prototype. Released records retain basis and history and can be restored. Every operation is idempotent and returns `officialStatusChanged: false` and `deleted: false`.

Every Step 10 release explanation includes: “Releasing this item from the recovery plan does not delete the official assignment or change the school record.” Explanation review itself never releases anything.
