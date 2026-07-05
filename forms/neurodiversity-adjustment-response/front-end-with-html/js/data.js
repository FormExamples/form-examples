// Sample response data for the neurodiversity adjustment response dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Rows span every outcome (fully-agreed / partially-agreed / alternative-offered
// / declined / deferred), legal-risk band (ok / caution / high-risk), and
// follow-up urgency (including the discrimination-risk auto-escalation and a
// declined case with no rationale that fires F-DISCRIMINATION-RISK-001).

(function () {
'use strict';
window.NeurodiversityAdjustmentResponseDashboard =
  window.NeurodiversityAdjustmentResponseDashboard || {};

/** @type {import('./dashboard-types.js').ResponseRow[]} */
const sampleResponses = [
  {
    // Fully agreed: noise-cancelling headphones + quiet desk on a 6-week trial
    // with a scheduled review — clean, low-risk, review scheduled.
    id: 'NAR-2026-0001',
    workerName: 'Jordan Lee',
    department: 'Engineering',
    responseStatus: 'trial',
    respondedDate: '2026-06-02',
    outcomeClassification: 'fully-agreed',
    legalRiskBand: 'ok',
    followUpUrgency: 'review-scheduled',
    completenessPercent: 100,
    flagCount: 0
  },
  {
    // Partially agreed with no explanation for the remainder — caution band.
    id: 'NAR-2026-0002',
    workerName: 'Priya Nair',
    department: 'Customer Support',
    responseStatus: 'partially-agreed',
    respondedDate: '2026-06-03',
    outcomeClassification: 'partially-agreed',
    legalRiskBand: 'caution',
    followUpUrgency: 'review-scheduled',
    completenessPercent: 88,
    flagCount: 1
  },
  {
    // Declined with NO rationale and no alternative — high discrimination risk,
    // fires F-DISCRIMINATION-RISK-001 and F-MISSING-RATIONALE-001.
    id: 'NAR-2026-0003',
    workerName: 'Marcus Bright',
    department: 'Warehouse Operations',
    responseStatus: 'declined',
    respondedDate: '2026-06-04',
    outcomeClassification: 'declined',
    legalRiskBand: 'high-risk',
    followUpUrgency: 'urgent-review',
    completenessPercent: 44,
    flagCount: 3
  },
  {
    // Alternative offered in place of the requested adjustment — agreed detail
    // recorded, review scheduled.
    id: 'NAR-2026-0004',
    workerName: 'Sofia Rossi',
    department: 'Finance',
    responseStatus: 'agreed',
    respondedDate: '2026-06-05',
    outcomeClassification: 'alternative-offered',
    legalRiskBand: 'ok',
    followUpUrgency: 'review-scheduled',
    completenessPercent: 94,
    flagCount: 0
  },
  {
    // Deferred pending occupational-health assessment.
    id: 'NAR-2026-0005',
    workerName: 'Aiden Walsh',
    department: 'Sales',
    responseStatus: 'deferred',
    respondedDate: '2026-06-06',
    outcomeClassification: 'deferred',
    legalRiskBand: 'ok',
    followUpUrgency: 'none',
    completenessPercent: 63,
    flagCount: 1
  },
  {
    // Declined but with a recorded reasonableness justification, and now
    // escalated to a grievance — high risk, escalation-needed.
    id: 'NAR-2026-0006',
    workerName: 'Grace Okafor',
    department: 'Facilities',
    responseStatus: 'declined',
    respondedDate: '2026-06-07',
    outcomeClassification: 'declined',
    legalRiskBand: 'high-risk',
    followUpUrgency: 'escalation-needed',
    completenessPercent: 81,
    flagCount: 2
  }
];

window.NeurodiversityAdjustmentResponseDashboard.sampleResponses = sampleResponses;
})();
