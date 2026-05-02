// DVLA V1 — branch-aware completeness validation rules.
//
// Each rule asserts that a required field on the *active* branch has been
// answered. Rules whose branch is inactive (because of a "No" answer earlier
// in the conditional flow) trivially pass — they do not produce a fired
// validation. This is a direct port of `src/lib/engine/v1-rules.ts`.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} ValidationRule
 * @property {string} id
 * @property {string} section
 * @property {'error' | 'warning' | 'info'} severity
 * @property {string} description
 * @property {string} message
 * @property {(d: AssessmentData) => boolean} evaluate
 */

(function () {
'use strict';
window.DvlaV1Form = window.DvlaV1Form || {};
const {
  isMonocularBranchActive,
  isVisualFieldBranchActive,
  isVisualFieldCauseBranchActive,
  isGlaucomaBranchActive,
  isRetinitisPigmentosaBranchActive,
  isLaserTreatmentBranchActive,
  isBlepharospasmBranchActive,
  isNightBlindnessBranchActive,
  isDoubleVisionBranchActive,
  isOtherVisionBranchActive,
  isRecentContactBranchActive
} = window.DvlaV1Form;

/** @type {ValidationRule[]} */
const v1Rules = [
  // ── Step 1 — Personal Details ─────────────────────
  {
    id: 'V1-PD-001',
    section: 'personalDetails',
    severity: 'error',
    description: 'Full name required.',
    evaluate: (d) => d.personalDetails.fullName.trim() !== '',
    message: 'Full name is required.'
  },
  {
    id: 'V1-PD-002',
    section: 'personalDetails',
    severity: 'error',
    description: 'Date of birth required.',
    evaluate: (d) => d.personalDetails.dateOfBirth !== '',
    message: 'Date of birth is required.'
  },
  {
    id: 'V1-PD-003',
    section: 'personalDetails',
    severity: 'error',
    description: 'Address required.',
    evaluate: (d) => d.personalDetails.address.trim() !== '',
    message: 'Address is required.'
  },
  {
    id: 'V1-PD-004',
    section: 'personalDetails',
    severity: 'error',
    description: 'Postcode required.',
    evaluate: (d) => d.personalDetails.postcode.trim() !== '',
    message: 'Postcode is required.'
  },

  // ── Step 2 — Healthcare Professionals ─────────────
  {
    id: 'V1-HCP-001',
    section: 'healthcareProfessionals',
    severity: 'error',
    description: 'GP name required.',
    evaluate: (d) => d.healthcareProfessionals.gp.name.trim() !== '',
    message: 'GP name is required.'
  },
  {
    id: 'V1-HCP-002',
    section: 'healthcareProfessionals',
    severity: 'error',
    description: 'GP surgery name required.',
    evaluate: (d) => d.healthcareProfessionals.gp.surgeryName.trim() !== '',
    message: 'GP surgery name is required.'
  },

  // ── Step 3 — Q1 Eyesight Standards ────────────────
  {
    id: 'V1-Q1-001',
    section: 'eyesightStandards',
    severity: 'error',
    description: 'Eyesight standard answer required.',
    evaluate: (d) => d.eyesightStandards.meetsStandard !== '',
    message: 'Please answer whether you meet the eyesight standard for driving.'
  },

  // ── Step 4 — Q2 Vision in Both Eyes ───────────────
  {
    id: 'V1-Q2-001',
    section: 'visionInBothEyes',
    severity: 'error',
    description: 'Vision-in-both-eyes Yes/No required.',
    evaluate: (d) => d.visionInBothEyes.hasVisionInBothEyes !== '',
    message: 'Please answer whether you have vision in both eyes.'
  },
  {
    id: 'V1-Q2-002',
    section: 'visionInBothEyes',
    severity: 'error',
    description: 'Monocular: which eye required.',
    evaluate: (d) => !isMonocularBranchActive(d) || d.visionInBothEyes.whichEye !== '',
    message: 'Please indicate which eye you can see with.'
  },
  {
    id: 'V1-Q2-003',
    section: 'visionInBothEyes',
    severity: 'error',
    description: 'Monocular: duration required.',
    evaluate: (d) => !isMonocularBranchActive(d) || d.visionInBothEyes.duration !== '',
    message: 'Please indicate how long you have had vision in only one eye.'
  },
  {
    id: 'V1-Q2-004',
    section: 'visionInBothEyes',
    severity: 'error',
    description: 'Monocular: adaptation required.',
    evaluate: (d) => !isMonocularBranchActive(d) || d.visionInBothEyes.adaptation !== '',
    message: 'Please indicate whether you have adapted to vision in one eye.'
  },
  {
    id: 'V1-Q2-005',
    section: 'visionInBothEyes',
    severity: 'error',
    description: 'Monocular declaration confirmation required.',
    evaluate: (d) => !isMonocularBranchActive(d) || d.visionInBothEyes.monocularDeclarationConfirmed,
    message: 'Please confirm the monocular vision declaration.'
  },

  // ── Step 5 — Q3 Field of Vision ───────────────────
  {
    id: 'V1-Q3-001',
    section: 'fieldOfVision',
    severity: 'error',
    description: 'Visual field problem Yes/No required.',
    evaluate: (d) => d.fieldOfVision.hasProblem !== '',
    message: 'Please answer whether you have a problem with your field of vision.'
  },
  {
    id: 'V1-Q3-002',
    section: 'fieldOfVision',
    severity: 'error',
    description: 'Visual field: caused-by-eye-condition Yes/No required.',
    evaluate: (d) =>
      !isVisualFieldBranchActive(d) || d.fieldOfVision.causedSolelyByEyeCondition !== '',
    message: 'Please answer whether the visual-field problem is caused solely by an eye condition.'
  },
  {
    id: 'V1-Q3-003',
    section: 'fieldOfVision',
    severity: 'error',
    description: 'Visual field: cause selection required.',
    evaluate: (d) => !isVisualFieldCauseBranchActive(d) || d.fieldOfVision.cause !== '',
    message: 'Please indicate the cause of the visual-field problem.'
  },
  {
    id: 'V1-Q3-004',
    section: 'fieldOfVision',
    severity: 'error',
    description: 'Visual field: other-cause details required.',
    evaluate: (d) =>
      !isVisualFieldCauseBranchActive(d) ||
      d.fieldOfVision.cause !== 'other' ||
      d.fieldOfVision.causeOtherDetails.trim() !== '',
    message: 'Please describe the other cause of the visual-field problem.'
  },

  // ── Step 6 — Q4 Glaucoma ──────────────────────────
  {
    id: 'V1-Q4-001',
    section: 'glaucoma',
    severity: 'error',
    description: 'Glaucoma Yes/No required.',
    evaluate: (d) => d.glaucoma.hasCondition !== '',
    message: 'Please answer whether you have glaucoma.'
  },
  {
    id: 'V1-Q4-002',
    section: 'glaucoma',
    severity: 'error',
    description: 'Glaucoma: which eye(s) required.',
    evaluate: (d) => !isGlaucomaBranchActive(d) || d.glaucoma.whichEyes !== '',
    message: 'Please indicate which eye(s) are affected by glaucoma.'
  },

  // ── Step 7 — Q5 Retinitis Pigmentosa ──────────────
  {
    id: 'V1-Q5-001',
    section: 'retinitisPigmentosa',
    severity: 'error',
    description: 'Retinitis pigmentosa Yes/No required.',
    evaluate: (d) => d.retinitisPigmentosa.hasCondition !== '',
    message: 'Please answer whether you have retinitis pigmentosa.'
  },
  {
    id: 'V1-Q5-002',
    section: 'retinitisPigmentosa',
    severity: 'error',
    description: 'Retinitis pigmentosa: which eye(s) required.',
    evaluate: (d) =>
      !isRetinitisPigmentosaBranchActive(d) || d.retinitisPigmentosa.whichEyes !== '',
    message: 'Please indicate which eye(s) are affected by retinitis pigmentosa.'
  },

  // ── Step 8 — Q6 Laser Treatment ───────────────────
  {
    id: 'V1-Q6-001',
    section: 'laserTreatment',
    severity: 'error',
    description: 'Laser treatment Yes/No required.',
    evaluate: (d) => d.laserTreatment.hasHadTreatment !== '',
    message: 'Please answer whether you have had laser treatment.'
  },
  {
    id: 'V1-Q6-002',
    section: 'laserTreatment',
    severity: 'error',
    description: 'Laser treatment: at least one date required.',
    evaluate: (d) =>
      !isLaserTreatmentBranchActive(d) ||
      d.laserTreatment.leftEyeFirstDate !== '' ||
      d.laserTreatment.rightEyeFirstDate !== '' ||
      d.laserTreatment.leftEyeLastDate !== '' ||
      d.laserTreatment.rightEyeLastDate !== '',
    message: 'Please supply at least one laser-treatment date.'
  },

  // ── Step 9 — Q7 Blepharospasm ─────────────────────
  {
    id: 'V1-Q7-001',
    section: 'blepharospasm',
    severity: 'error',
    description: 'Blepharospasm Yes/No required.',
    evaluate: (d) => d.blepharospasm.hasCondition !== '',
    message: 'Please answer whether you have blepharospasm.'
  },
  {
    id: 'V1-Q7-002',
    section: 'blepharospasm',
    severity: 'error',
    description: 'Blepharospasm: which eye(s) required.',
    evaluate: (d) => !isBlepharospasmBranchActive(d) || d.blepharospasm.whichEyes !== '',
    message: 'Please indicate which eye(s) are affected by blepharospasm.'
  },
  {
    id: 'V1-Q7-003',
    section: 'blepharospasm',
    severity: 'error',
    description: 'Blepharospasm: treatment Yes/No required.',
    evaluate: (d) => !isBlepharospasmBranchActive(d) || d.blepharospasm.hasHadTreatment !== '',
    message: 'Please answer whether you have had treatment for blepharospasm.'
  },
  {
    id: 'V1-Q7-004',
    section: 'blepharospasm',
    severity: 'error',
    description: 'Blepharospasm: controlled Yes/No required.',
    evaluate: (d) =>
      !isBlepharospasmBranchActive(d) || d.blepharospasm.adequatelyControlled !== '',
    message: 'Please answer whether your healthcare professional is satisfied that blepharospasm is adequately controlled.'
  },

  // ── Step 10 — Q8 Night Blindness ──────────────────
  {
    id: 'V1-Q8-001',
    section: 'nightBlindness',
    severity: 'error',
    description: 'Night blindness Yes/No required.',
    evaluate: (d) => d.nightBlindness.hasCondition !== '',
    message: 'Please answer whether you have night blindness.'
  },
  {
    id: 'V1-Q8-002',
    section: 'nightBlindness',
    severity: 'error',
    description: 'Night blindness: which eye(s) required.',
    evaluate: (d) =>
      !isNightBlindnessBranchActive(d) || d.nightBlindness.whichEyes !== '',
    message: 'Please indicate which eye(s) are affected by night blindness.'
  },

  // ── Step 11 — Q9 Double Vision ────────────────────
  {
    id: 'V1-Q9-001',
    section: 'doubleVision',
    severity: 'error',
    description: 'Double vision Yes/No required.',
    evaluate: (d) => d.doubleVision.hasCondition !== '',
    message: 'Please answer whether you have double vision.'
  },
  {
    id: 'V1-Q9-002',
    section: 'doubleVision',
    severity: 'error',
    description: 'Double vision: controlled Yes/No required.',
    evaluate: (d) => !isDoubleVisionBranchActive(d) || d.doubleVision.controlled !== '',
    message: 'Please answer whether your double vision is controlled.'
  },
  {
    id: 'V1-Q9-003',
    section: 'doubleVision',
    severity: 'error',
    description: 'Double vision: 6-month Yes/No required when uncontrolled.',
    evaluate: (d) =>
      !isDoubleVisionBranchActive(d) ||
      d.doubleVision.controlled !== 'no' ||
      d.doubleVision.sameForSixMonthsOrMore !== '',
    message: 'Please answer whether the double vision has been the same for 6 months or more.'
  },
  {
    id: 'V1-Q9-004',
    section: 'doubleVision',
    severity: 'error',
    description: 'Double vision declaration confirmation required.',
    evaluate: (d) =>
      !isDoubleVisionBranchActive(d) || d.doubleVision.doubleVisionDeclarationConfirmed,
    message: 'Please confirm the double-vision adaptation declaration.'
  },
  {
    id: 'V1-Q9-005',
    section: 'doubleVision',
    severity: 'error',
    description: 'Double vision: declaration signature required.',
    evaluate: (d) =>
      !isDoubleVisionBranchActive(d) ||
      d.doubleVision.declarationSignatureName.trim() !== '',
    message: 'Please sign the double-vision declaration.'
  },
  {
    id: 'V1-Q9-006',
    section: 'doubleVision',
    severity: 'error',
    description: 'Double vision: declaration date required.',
    evaluate: (d) => !isDoubleVisionBranchActive(d) || d.doubleVision.declarationDate !== '',
    message: 'Please supply the double-vision declaration date.'
  },

  // ── Step 12 — Q10 Other Vision Conditions ─────────
  {
    id: 'V1-Q10-001',
    section: 'otherVisionConditions',
    severity: 'error',
    description: 'Other vision conditions Yes/No required.',
    evaluate: (d) => d.otherVisionConditions.hasOther !== '',
    message: 'Please answer whether you have any other vision condition.'
  },
  {
    id: 'V1-Q10-002',
    section: 'otherVisionConditions',
    severity: 'error',
    description: 'Other vision conditions: details required.',
    evaluate: (d) =>
      !isOtherVisionBranchActive(d) || d.otherVisionConditions.details.trim() !== '',
    message: 'Please describe the other vision condition(s) and which eye(s) are affected.'
  },

  // ── Step 13 — Q11 Recent Contact ──────────────────
  {
    id: 'V1-Q11-001',
    section: 'recentContact',
    severity: 'error',
    description: 'Recent contact Yes/No required.',
    evaluate: (d) => d.recentContact.hadContact !== '',
    message: 'Please answer whether you have had recent contact with your healthcare professional or optician about your vision.'
  },
  {
    id: 'V1-Q11-002',
    section: 'recentContact',
    severity: 'error',
    description: 'Recent contact: date required.',
    evaluate: (d) => !isRecentContactBranchActive(d) || d.recentContact.dateOfContact !== '',
    message: 'Please supply the date of your most recent contact.'
  },

  // ── Step 14 — Authorisation ───────────────────────
  {
    id: 'V1-AUTH-001',
    section: 'authorisation',
    severity: 'error',
    description: 'Declaration confirmation required.',
    evaluate: (d) => d.authorisation.declarationConfirmed,
    message: 'Please confirm the applicant authorisation declaration.'
  },
  {
    id: 'V1-AUTH-002',
    section: 'authorisation',
    severity: 'error',
    description: 'Authorisation: name required.',
    evaluate: (d) => d.authorisation.name.trim() !== '',
    message: 'Please supply your full name on the authorisation.'
  },
  {
    id: 'V1-AUTH-003',
    section: 'authorisation',
    severity: 'error',
    description: 'Authorisation: signature required.',
    evaluate: (d) => d.authorisation.signature.trim() !== '',
    message: 'Please sign the authorisation.'
  },
  {
    id: 'V1-AUTH-004',
    section: 'authorisation',
    severity: 'error',
    description: 'Authorisation: date required.',
    evaluate: (d) => d.authorisation.date !== '',
    message: 'Please supply the authorisation date.'
  },
  {
    id: 'V1-AUTH-005',
    section: 'authorisation',
    severity: 'error',
    description: 'Authorisation: electronic-correspondence consent required.',
    evaluate: (d) => d.authorisation.authoriseElectronicCorrespondence !== '',
    message: 'Please indicate whether you authorise electronic correspondence.'
  }
];

window.DvlaV1Form.v1Rules = v1Rules;
})();
