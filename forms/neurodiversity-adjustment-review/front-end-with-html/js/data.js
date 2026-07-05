// Sample review data for the neurodiversity adjustment review dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Rows span every effectiveness band (effective / partially-effective /
// ineffective / not-yet-assessed), wellbeing-risk band (ok / caution /
// high-risk), and next-step urgency (including the wellbeing-risk auto-escalation
// and an escalated case).

(function () {
'use strict';
window.NeurodiversityAdjustmentReviewDashboard =
  window.NeurodiversityAdjustmentReviewDashboard || {};

/** @type {import('./dashboard-types.js').ReviewRow[]} */
const sampleReviews = [
  {
    // Autistic developer whose quiet desk + noise-cancelling headphones are all
    // working well — effective, no wellbeing risk, next review scheduled.
    id: 'NDR-2026-0001',
    workerName: 'Jordan Lee',
    department: 'Engineering',
    reviewStatus: 'completed',
    reviewDate: '2026-06-02',
    effectivenessBand: 'effective',
    wellbeingRiskBand: 'ok',
    nextStepUrgency: 'review-scheduled',
    completenessPercent: 100,
    flagCount: 0
  },
  {
    // ADHD worker whose flexible hours are only partially working — a change is
    // agreed, worker partially satisfied, so caution + adjust-now.
    id: 'NDR-2026-0002',
    workerName: 'Priya Nair',
    department: 'Customer Support',
    reviewStatus: 'changes-agreed',
    reviewDate: '2026-06-03',
    effectivenessBand: 'partially-effective',
    wellbeingRiskBand: 'caution',
    nextStepUrgency: 'adjust-now',
    completenessPercent: 88,
    flagCount: 1
  },
  {
    // Dyslexic worker: the assistive-technology adjustment is not working and the
    // worker is dissatisfied — ineffective, high wellbeing risk, act now.
    id: 'NDR-2026-0003',
    workerName: 'Marcus Bright',
    department: 'Warehouse Operations',
    reviewStatus: 'changes-agreed',
    reviewDate: '2026-06-04',
    effectivenessBand: 'ineffective',
    wellbeingRiskBand: 'high-risk',
    nextStepUrgency: 'adjust-now',
    completenessPercent: 78,
    flagCount: 3
  },
  {
    // New review opened but the adjustments have not yet been rated and no next
    // review date is set — not-yet-assessed, incomplete.
    id: 'NDR-2026-0004',
    workerName: 'Sofia Rossi',
    department: 'Finance',
    reviewStatus: 'draft',
    reviewDate: '2026-06-05',
    effectivenessBand: 'not-yet-assessed',
    wellbeingRiskBand: 'ok',
    nextStepUrgency: 'none',
    completenessPercent: 41,
    flagCount: 2
  },
  {
    // Adjustments working but the worker reports a remaining barrier — effective
    // overall, caution on wellbeing, next review scheduled.
    id: 'NDR-2026-0005',
    workerName: 'Aiden Walsh',
    department: 'Sales',
    reviewStatus: 'completed',
    reviewDate: '2026-06-06',
    effectivenessBand: 'effective',
    wellbeingRiskBand: 'caution',
    nextStepUrgency: 'review-scheduled',
    completenessPercent: 94,
    flagCount: 1
  },
  {
    // Unresolved difficulty escalated to HR — ineffective, high risk, escalate.
    id: 'NDR-2026-0006',
    workerName: 'Grace Okafor',
    department: 'Facilities',
    reviewStatus: 'escalated',
    reviewDate: '2026-06-07',
    effectivenessBand: 'ineffective',
    wellbeingRiskBand: 'high-risk',
    nextStepUrgency: 'escalate',
    completenessPercent: 82,
    flagCount: 3
  }
];

window.NeurodiversityAdjustmentReviewDashboard.sampleReviews = sampleReviews;
})();
