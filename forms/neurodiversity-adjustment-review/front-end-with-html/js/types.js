// Plain-JavaScript / JSDoc type definitions for the Neurodiversity Adjustment
// Review form.
//
// Builds the canonical empty `NeurodiversityAdjustmentReview` shape so
// newly-added fields default correctly when older saved state is rehydrated
// from localStorage. Property names are camelCase to match the front-end serde
// / examples convention.

/**
 * Build a fresh, fully-blank neurodiversity reasonable-adjustments review.
 * Strings default to ''; numeric / date fields default to null; boolean
 * changes-needed / occupational-health / escalation fields default to false.
 *
 * The shape is grouped into front-end sections (manager, worker, review,
 * effectiveness, experience, changes, meta) so the wizard can bind
 * `state[section][field]`. The flat engine model expected by the grader is
 * produced by `flatten(data)`.
 */
function emptyReview() {
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
    review: {
      reviewStatus: '',
      responseReference: '',
      reviewMethod: '',
      reviewDate: '',
      nextReviewDate: ''
    },
    effectiveness: {
      effectivenessWorkingEnvironment: '',
      effectivenessEquipmentTechnology: '',
      effectivenessWorkingArrangements: '',
      effectivenessCommunication: '',
      effectivenessSupportMentoring: '',
      effectivenessRecruitmentProcess: '',
      effectivenessPolicyDress: '',
      effectivenessOther: ''
    },
    experience: {
      workerFeedback: '',
      workerSatisfied: '',
      wellbeingChange: '',
      barriersDetail: ''
    },
    changes: {
      changesNeeded: false,
      changesDetail: '',
      updatedAdjustmentsDetail: '',
      occupationalHealthRereferral: false
    },
    meta: {
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

    reviewStatus: s.review.reviewStatus,
    responseReference: s.review.responseReference,
    reviewMethod: s.review.reviewMethod,
    reviewDate: s.review.reviewDate,
    nextReviewDate: s.review.nextReviewDate,

    effectivenessWorkingEnvironment: s.effectiveness.effectivenessWorkingEnvironment,
    effectivenessEquipmentTechnology: s.effectiveness.effectivenessEquipmentTechnology,
    effectivenessWorkingArrangements: s.effectiveness.effectivenessWorkingArrangements,
    effectivenessCommunication: s.effectiveness.effectivenessCommunication,
    effectivenessSupportMentoring: s.effectiveness.effectivenessSupportMentoring,
    effectivenessRecruitmentProcess: s.effectiveness.effectivenessRecruitmentProcess,
    effectivenessPolicyDress: s.effectiveness.effectivenessPolicyDress,
    effectivenessOther: s.effectiveness.effectivenessOther,

    workerFeedback: s.experience.workerFeedback,
    workerSatisfied: s.experience.workerSatisfied,
    wellbeingChange: s.experience.wellbeingChange,
    barriersDetail: s.experience.barriersDetail,

    changesNeeded: s.changes.changesNeeded,
    changesDetail: s.changes.changesDetail,
    updatedAdjustmentsDetail: s.changes.updatedAdjustmentsDetail,
    occupationalHealthRereferral: s.changes.occupationalHealthRereferral,

    escalated: s.meta.escalated,
    escalationDetail: s.meta.escalationDetail,
    notes: s.meta.notes
  };
}

// ----------------------------------------------------------------------
// Engine predicates (mirror engine/utils.ts)
// ----------------------------------------------------------------------

/** The eight per-category effectiveness field values, in order. */
function effValues(r) {
  return [
    r.effectivenessWorkingEnvironment,
    r.effectivenessEquipmentTechnology,
    r.effectivenessWorkingArrangements,
    r.effectivenessCommunication,
    r.effectivenessSupportMentoring,
    r.effectivenessRecruitmentProcess,
    r.effectivenessPolicyDress,
    r.effectivenessOther
  ];
}

/**
 * Effectiveness values for adjustments actually in place — 'working-well',
 * 'partial', or 'not-working'. Excludes '' (unanswered) and 'not-in-place'.
 */
function ratedValues(r) {
  return effValues(r).filter(
    (v) => v === 'working-well' || v === 'partial' || v === 'not-working'
  );
}

/** Count of rated (in-place) adjustments. */
function ratedCount(r) {
  return ratedValues(r).length;
}

/** Count of rated adjustments that are working well. */
function workingWellCount(r) {
  return ratedValues(r).filter((v) => v === 'working-well').length;
}

/** Whether any rated adjustment is 'not-working'. */
function anyNotWorking(r) {
  return ratedValues(r).indexOf('not-working') >= 0;
}

/** Whether any of the eight effectiveness fields has been answered. */
function anyEffectivenessAnswered(r) {
  return effValues(r).some((v) => String(v || '').trim() !== '');
}

// ----------------------------------------------------------------------
// Display labels (mirror engine/utils.ts)
// ----------------------------------------------------------------------

/** Axis A effectiveness-band display label. */
function effectivenessBandLabel(value) {
  switch (value) {
    case 'effective': return 'Effective';
    case 'partially-effective': return 'Partially effective';
    case 'ineffective': return 'Ineffective';
    case 'not-yet-assessed': return 'Not yet assessed';
    default: return 'Not graded';
  }
}

/** Axis B wellbeing-risk-band display label. */
function wellbeingRiskBandLabel(value) {
  switch (value) {
    case 'ok': return 'OK';
    case 'caution': return 'Caution';
    case 'high-risk': return 'High risk';
    default: return 'Not graded';
  }
}

/** Axis D next-step-urgency display label. */
function nextStepUrgencyLabel(value) {
  switch (value) {
    case 'none': return 'None';
    case 'review-scheduled': return 'Review scheduled';
    case 'adjust-now': return 'Adjust now';
    case 'escalate': return 'Escalate';
    default: return 'Not graded';
  }
}

/** Human-readable review-status label. */
function reviewStatusLabel(value) {
  switch (value) {
    case 'draft': return 'Draft';
    case 'completed': return 'Completed';
    case 'changes-agreed': return 'Changes agreed';
    case 'escalated': return 'Escalated';
    case 'cancelled': return 'Cancelled';
    default: return 'Unspecified';
  }
}

/** Human-readable review-method label. */
function reviewMethodLabel(value) {
  switch (value) {
    case 'meeting': return 'Meeting';
    case 'occupational-health-review': return 'Occupational-health review';
    case 'email': return 'Email';
    case 'hr-review': return 'HR review';
    case 'other': return 'Other';
    default: return 'Unspecified';
  }
}

/** Human-readable worker-satisfaction label. */
function workerSatisfiedLabel(value) {
  switch (value) {
    case 'yes': return 'Yes';
    case 'partially': return 'Partially';
    case 'no': return 'No';
    default: return 'Unspecified';
  }
}

/** Human-readable wellbeing-change label. */
function wellbeingChangeLabel(value) {
  switch (value) {
    case 'improved': return 'Improved';
    case 'unchanged': return 'Unchanged';
    case 'worse': return 'Worse';
    default: return 'Unspecified';
  }
}

/** Human-readable per-category effectiveness value label. */
function effectivenessValueLabel(value) {
  switch (value) {
    case 'working-well': return 'Working well';
    case 'partial': return 'Partial';
    case 'not-working': return 'Not working';
    case 'not-in-place': return 'Not in place';
    default: return 'Unspecified';
  }
}

/** Overall-recommendation display label. */
function recommendationLabel(value) {
  switch (value) {
    case 'maintain': return 'Maintain the current adjustments';
    case 'adjust-adjustments': return 'Adjust the adjustments';
    case 'seek-occupational-health': return 'Seek an occupational-health assessment';
    case 'schedule-next-review': return 'Schedule the next review';
    case 'escalate-to-hr': return 'Escalate to HR';
    default: return 'Not graded';
  }
}

export { emptyReview, flatten, effValues, ratedValues, ratedCount, workingWellCount, anyNotWorking, anyEffectivenessAnswered, effectivenessBandLabel, wellbeingRiskBandLabel, nextStepUrgencyLabel, reviewStatusLabel, reviewMethodLabel, workerSatisfiedLabel, wellbeingChangeLabel, effectivenessValueLabel, recommendationLabel };
