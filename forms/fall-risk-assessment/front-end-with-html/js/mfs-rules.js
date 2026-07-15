// Morse Fall Scale (MFS) item registry and ancillary rule registry.
//
// The MFS is a six-item bedside instrument that produces a total score in
// the range 0-125. Each item has a fixed set of mutually-exclusive options
// with a pre-defined integer score. See:
//   Morse JM, Morse RM, Tylko SJ. Development of a scale to identify the
//   fall-prone patient. Can J Aging 1989;8(4):366-77.
//
// MFS-001: History of falling (immediate or within last 3 months)
// MFS-002: Secondary diagnosis
// MFS-003: Ambulatory aid
// MFS-004: IV / heparin lock
// MFS-005: Gait / transferring
// MFS-006: Mental status
//
// Total range: 0-125
//   0-24   : Low Risk
//   25-44  : Moderate Risk
//   >=45   : High Risk
//   Critical: recurrent falls with injury, anticoagulated, or MFS >= 75.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} MfsOption
 * @property {number} score
 * @property {string} label
 *
 * @typedef {Object} MfsItem
 * @property {string} id
 * @property {keyof import('./types.js').MorseFallScale} field
 * @property {string} label
 * @property {string} description
 * @property {MfsOption[]} options
 */

/** @type {MfsItem[]} */
const mfsItems = [
  {
    id: 'MFS-001',
    field: 'historyOfFalling',
    label: 'History of falling',
    description:
      'Has the patient fallen within the last 3 months, or on the current admission?',
    options: [
      { score: 0,  label: 'No' },
      { score: 25, label: 'Yes' }
    ]
  },
  {
    id: 'MFS-002',
    field: 'secondaryDiagnosis',
    label: 'Secondary diagnosis',
    description:
      'Does the patient have more than one medical diagnosis listed on the chart?',
    options: [
      { score: 0,  label: 'No' },
      { score: 15, label: 'Yes' }
    ]
  },
  {
    id: 'MFS-003',
    field: 'ambulatoryAid',
    label: 'Ambulatory aid',
    description:
      'What ambulatory aid does the patient use to walk?',
    options: [
      { score: 0,  label: 'None / bed rest / wheelchair / nurse' },
      { score: 15, label: 'Crutches / cane / walker' },
      { score: 30, label: 'Furniture (uses furniture for support)' }
    ]
  },
  {
    id: 'MFS-004',
    field: 'ivOrHeparinLock',
    label: 'IV / heparin lock',
    description:
      'Does the patient have an intravenous line or heparin/saline lock in place?',
    options: [
      { score: 0,  label: 'No' },
      { score: 20, label: 'Yes' }
    ]
  },
  {
    id: 'MFS-005',
    field: 'gaitTransferring',
    label: 'Gait / transferring',
    description:
      'How does the patient walk and transfer?',
    options: [
      { score: 0,  label: 'Normal / bed rest / immobile' },
      { score: 10, label: 'Weak (slow, stooped, but able)' },
      { score: 20, label: 'Impaired (clutches, unsteady, jerky)' }
    ]
  },
  {
    id: 'MFS-006',
    field: 'mentalStatus',
    label: 'Mental status',
    description:
      'How does the patient assess their own ability to ambulate?',
    options: [
      { score: 0,  label: 'Oriented to own ability' },
      { score: 15, label: 'Forgets / overestimates own ability' }
    ]
  }
];

// ----------------------------------------------------------------------
// Ancillary rule registry.
//
// These are clinical heuristics that fire on top of the raw MFS score and
// drive both the Critical-override and the flag detection. They are kept
// here so the rule catalogue is in one place; the grader and the
// flagged-issues module call them via the predicates exported on the
// `window.FallRiskAssessment` namespace.
// ----------------------------------------------------------------------

/** @param {AssessmentData} d */
function isAnticoagulated(d) {
  return d.medicationReview.anticoagulants === 'yes';
}

/** @param {AssessmentData} d */
function hasRecurrentFallsWithInjury(d) {
  return d.fallHistory.recurrentFallsWithInjury === 'yes';
}

/** @param {AssessmentData} d */
function hasRecentInjuriousFall(d) {
  return (
    d.fallHistory.hasFallenInPastYear === 'yes' &&
    d.fallHistory.mostRecentFallInjurious === 'yes'
  );
}

/** @param {AssessmentData} d */
function hasSevereOrthostaticHypotension(d) {
  return d.mobilityGait.orthostaticHypotensionSevere === 'yes';
}

/** @param {AssessmentData} d */
function hasDementia(d) {
  return d.cognitive.dementiaDiagnosis === 'yes';
}

/** @param {AssessmentData} d */
function hipProtectorsAbsent(d) {
  return d.environmental.hipProtectorsUsed === 'no';
}

/** @param {AssessmentData} d */
function hasPolypharmacy(d) {
  // explicit "yes" or auto-detect: 4 or more medications listed
  if (d.medicationReview.polypharmacy === 'yes') return true;
  return (d.medicationReview.medications || []).length >= 4;
}

const ancillaryRules = {
  isAnticoagulated,
  hasRecurrentFallsWithInjury,
  hasRecentInjuriousFall,
  hasSevereOrthostaticHypotension,
  hasDementia,
  hipProtectorsAbsent,
  hasPolypharmacy
};

export { mfsItems, ancillaryRules };
