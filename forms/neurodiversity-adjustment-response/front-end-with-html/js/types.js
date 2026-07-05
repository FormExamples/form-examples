// Plain-JavaScript / JSDoc type definitions for the Neurodiversity Adjustment
// Response form.
//
// Builds the canonical empty `NeurodiversityAdjustmentResponse` shape so
// newly-added fields default correctly when older saved state is rehydrated
// from localStorage. Property names are camelCase to match the front-end serde
// / examples convention. Wrapped in an IIFE; published via
// `window.NeurodiversityAdjustmentResponse`.

(function () {
'use strict';
window.NeurodiversityAdjustmentResponse =
  window.NeurodiversityAdjustmentResponse || {};

/**
 * Build a fresh, fully-blank neurodiversity reasonable-adjustments response.
 * Strings default to ''; numeric / date fields default to null; boolean
 * agreed-adjustment / sign-off fields default to false.
 *
 * The shape is grouped into front-end sections (manager, worker, response,
 * decision, adjustments, review, support, signOff) so the wizard can bind
 * `state[section][field]`. The flat engine model expected by the grader is
 * produced by `flatten(data)`.
 */
function emptyResponse() {
  return {
    manager: {
      name: '',
      role: '',
      jobTitle: '',
      department: '',
      email: '',
      phone: ''
    },
    worker: {
      name: '',
      jobTitle: '',
      department: '',
      employeeReference: '',
      email: '',
      phone: ''
    },
    response: {
      responseStatus: '',
      requestReference: '',
      handlingMethod: '',
      assessedDate: '',
      respondedDate: '',
      effectiveDate: ''
    },
    decision: {
      overallDecision: '',
      decisionRationale: '',
      declineReasonCategory: ''
    },
    adjustments: {
      agreedWorkingEnvironment: false,
      agreedEquipmentTechnology: false,
      agreedWorkingArrangements: false,
      agreedCommunication: false,
      agreedSupportMentoring: false,
      agreedRecruitmentProcess: false,
      agreedPolicyDress: false,
      agreedOther: false,
      agreedAdjustmentsDetail: '',
      alternativeAdjustmentsDetail: ''
    },
    review: {
      trialPeriod: false,
      trialPeriodWeeks: null,
      reviewScheduled: false,
      reviewDate: ''
    },
    support: {
      occupationalHealthReferred: false,
      accessToWorkReferred: false,
      supportResourcesDetail: '',
      responsibilitiesDetail: '',
      pointOfContact: ''
    },
    signOff: {
      escalated: false,
      escalationDetail: '',
      notes: ''
    }
  };
}

/**
 * Flatten the grouped wizard state into the single-level engine model the
 * grader and rule sets consume. `worker` and `manager` remain nested objects;
 * everything else is flat.
 */
function flatten(s) {
  return {
    worker: { ...s.worker },
    manager: { ...s.manager },

    responseStatus: s.response.responseStatus,
    requestReference: s.response.requestReference,
    handlingMethod: s.response.handlingMethod,
    assessedDate: s.response.assessedDate,
    respondedDate: s.response.respondedDate,
    effectiveDate: s.response.effectiveDate,

    overallDecision: s.decision.overallDecision,
    decisionRationale: s.decision.decisionRationale,
    declineReasonCategory: s.decision.declineReasonCategory,

    agreedWorkingEnvironment: s.adjustments.agreedWorkingEnvironment,
    agreedEquipmentTechnology: s.adjustments.agreedEquipmentTechnology,
    agreedWorkingArrangements: s.adjustments.agreedWorkingArrangements,
    agreedCommunication: s.adjustments.agreedCommunication,
    agreedSupportMentoring: s.adjustments.agreedSupportMentoring,
    agreedRecruitmentProcess: s.adjustments.agreedRecruitmentProcess,
    agreedPolicyDress: s.adjustments.agreedPolicyDress,
    agreedOther: s.adjustments.agreedOther,
    agreedAdjustmentsDetail: s.adjustments.agreedAdjustmentsDetail,
    alternativeAdjustmentsDetail: s.adjustments.alternativeAdjustmentsDetail,

    trialPeriod: s.review.trialPeriod,
    trialPeriodWeeks: s.review.trialPeriodWeeks,
    reviewScheduled: s.review.reviewScheduled,
    reviewDate: s.review.reviewDate,

    occupationalHealthReferred: s.support.occupationalHealthReferred,
    accessToWorkReferred: s.support.accessToWorkReferred,
    supportResourcesDetail: s.support.supportResourcesDetail,
    responsibilitiesDetail: s.support.responsibilitiesDetail,
    pointOfContact: s.support.pointOfContact,

    escalated: s.signOff.escalated,
    escalationDetail: s.signOff.escalationDetail,
    notes: s.signOff.notes
  };
}

// ----------------------------------------------------------------------
// Engine predicates (mirror engine/utils.ts)
// ----------------------------------------------------------------------

/** Whether any of the eight agreed-adjustment booleans is true. */
function anyAgreed(r) {
  return (
    r.agreedWorkingEnvironment === true ||
    r.agreedEquipmentTechnology === true ||
    r.agreedWorkingArrangements === true ||
    r.agreedCommunication === true ||
    r.agreedSupportMentoring === true ||
    r.agreedRecruitmentProcess === true ||
    r.agreedPolicyDress === true ||
    r.agreedOther === true
  );
}

/** Whether an alternative adjustment has been offered. */
function hasAlternative(r) {
  return String(r.alternativeAdjustmentsDetail || '').trim() !== '';
}

/**
 * Whether a decline is backed by a reasonableness justification: a rationale is
 * recorded AND the decline-reason category is neither empty nor 'not-reasonable'.
 */
function declineJustified(r) {
  const rationale = String(r.decisionRationale || '').trim() !== '';
  const cat = r.declineReasonCategory;
  return rationale && cat !== '' && cat !== 'not-reasonable';
}

/**
 * Whole days between two ISO 'YYYY-MM-DD' strings (b − a). Returns null if
 * either is empty or unparseable, so date-based rules simply do not fire.
 */
function daysBetween(a, b) {
  if (!a || !b) return null;
  const da = Date.parse(a + 'T00:00:00Z');
  const db = Date.parse(b + 'T00:00:00Z');
  if (isNaN(da) || isNaN(db)) return null;
  return Math.round((db - da) / 86400000);
}

// ----------------------------------------------------------------------
// Display labels (mirror engine/utils.ts)
// ----------------------------------------------------------------------

/** Axis A outcome-classification display label. */
function outcomeClassificationLabel(value) {
  switch (value) {
    case 'fully-agreed': return 'Fully agreed';
    case 'partially-agreed': return 'Partially agreed';
    case 'alternative-offered': return 'Alternative offered';
    case 'declined': return 'Declined';
    case 'deferred': return 'Deferred';
    default: return 'Not graded';
  }
}

/** Axis B legal / discrimination-risk display label. */
function legalRiskBandLabel(value) {
  switch (value) {
    case 'ok': return 'OK';
    case 'caution': return 'Caution';
    case 'high-risk': return 'High risk';
    default: return 'Not graded';
  }
}

/** Axis D follow-up / review-urgency display label. */
function followUpUrgencyLabel(value) {
  switch (value) {
    case 'none': return 'None';
    case 'review-scheduled': return 'Review scheduled';
    case 'urgent-review': return 'Urgent review';
    case 'escalation-needed': return 'Escalation needed';
    default: return 'Not graded';
  }
}

/** Human-readable overall-decision label. */
function overallDecisionLabel(value) {
  switch (value) {
    case 'agreed': return 'Agreed';
    case 'partially-agreed': return 'Partially agreed';
    case 'alternative-offered': return 'Alternative offered';
    case 'declined': return 'Declined';
    case 'deferred': return 'Deferred';
    default: return 'Unspecified';
  }
}

/** Human-readable response-status label. */
function responseStatusLabel(value) {
  switch (value) {
    case 'draft': return 'Draft';
    case 'agreed': return 'Agreed';
    case 'partially-agreed': return 'Partially agreed';
    case 'trial': return 'Trial';
    case 'declined': return 'Declined';
    case 'deferred': return 'Deferred';
    case 'cancelled': return 'Cancelled';
    default: return 'Unspecified';
  }
}

/** Human-readable handling-method label. */
function handlingMethodLabel(value) {
  switch (value) {
    case 'meeting': return 'Meeting';
    case 'occupational-health-referral': return 'Occupational-health referral';
    case 'email': return 'Email';
    case 'hr-review': return 'HR review';
    case 'other': return 'Other';
    default: return 'Unspecified';
  }
}

/** Human-readable decline-reason-category label. */
function declineReasonCategoryLabel(value) {
  switch (value) {
    case 'not-reasonable': return 'Not reasonable';
    case 'disproportionate-cost': return 'Disproportionate cost';
    case 'health-and-safety': return 'Health and safety';
    case 'operational-impact': return 'Operational impact';
    case 'alternative-provided': return 'Alternative provided';
    case 'insufficient-information': return 'Insufficient information';
    case 'none': return 'None';
    default: return 'Unspecified';
  }
}

/** Overall-recommendation display label. */
function recommendationLabel(value) {
  switch (value) {
    case 'implement': return 'Implement the agreed adjustments';
    case 'schedule-review': return 'Schedule a review';
    case 'seek-occupational-health': return 'Seek an occupational-health assessment';
    case 'reconsider-decision': return 'Reconsider the decision';
    case 'escalate-to-hr': return 'Escalate to HR';
    default: return 'Not graded';
  }
}

Object.assign(window.NeurodiversityAdjustmentResponse, {
  emptyResponse,
  flatten,
  anyAgreed,
  hasAlternative,
  declineJustified,
  daysBetween,
  outcomeClassificationLabel,
  legalRiskBandLabel,
  followUpUrgencyLabel,
  overallDecisionLabel,
  responseStatusLabel,
  handlingMethodLabel,
  declineReasonCategoryLabel,
  recommendationLabel
});
})();
