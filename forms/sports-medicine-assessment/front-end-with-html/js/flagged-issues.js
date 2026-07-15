// Flagged-issue detection for the Sports Medicine PPE.
//
// Independent of the rule-driven clearance decision (which the grader
// computes), this module raises clinician-facing flags grouped by
// priority:
//
//   high   - cardiovascular red flags, recent or multiple concussions,
//            RED-S triad indicators, infectious skin lesions in contact
//            sport, monocular athlete in high-risk sport without eyewear
//   medium - uncorrected MSK injury, monocular athlete (general),
//            suspected eating disorder, hypertension diagnosis,
//            previous clearance issue
//   low    - lifestyle / training-load concerns (very high training load,
//            BMI extremes, allergies known but uncharacterised)

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

// Wrapped in an IIFE; published via window.SportsMedicineAssessment.

const isYes = (v) => v === 'yes';

/**
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  const contact = data.sportPositionDetails.contactLevel;
  const isContact = contact === 'high' || contact === 'moderate';
  const isHigh = contact === 'high';

  // ─── HIGH PRIORITY ────────────────────────────────────────

  // Cardiovascular red flags
  if (isYes(data.cardiovascularScreening.chestPainWithExertion)) {
    flags.push({
      id: 'FLAG-CV-001',
      category: 'Cardiovascular',
      message: 'Chest pain with exertion — urgent cardiology evaluation before any sport.',
      priority: 'high'
    });
  }
  if (isYes(data.cardiovascularScreening.unexplainedSyncope)) {
    flags.push({
      id: 'FLAG-CV-002',
      category: 'Cardiovascular',
      message: 'Unexplained syncope — exclude exertional cardiac cause.',
      priority: 'high'
    });
  }
  if (isYes(data.familyHistory.suddenCardiacDeathUnder50)) {
    flags.push({
      id: 'FLAG-CV-003',
      category: 'Cardiovascular',
      message:
        `Family sudden cardiac death under 50${
          data.familyHistory.suddenCardiacDeathRelation
            ? ` (${data.familyHistory.suddenCardiacDeathRelation})`
            : ''
        } — cardiology screening required.`,
      priority: 'high'
    });
  }
  if (isYes(data.familyHistory.hypertrophicCardiomyopathy)) {
    flags.push({
      id: 'FLAG-CV-004',
      category: 'Cardiovascular',
      message: 'Family hypertrophic cardiomyopathy — ECG ± echo screening.',
      priority: 'high'
    });
  }

  // Recent / multiple concussions
  if (isYes(data.neurologicalConcussionBaseline.concussionLastSixMonths)) {
    flags.push({
      id: 'FLAG-NEURO-001',
      category: 'Neurological',
      message: 'Concussion within the last 6 months — confirm symptom resolution and graduated return.',
      priority: 'high'
    });
  }
  if (
    data.neurologicalConcussionBaseline.totalConcussions !== null &&
    data.neurologicalConcussionBaseline.totalConcussions >= 3
  ) {
    flags.push({
      id: 'FLAG-NEURO-002',
      category: 'Neurological',
      message:
        `${data.neurologicalConcussionBaseline.totalConcussions} lifetime concussions — neurology review for return-to-play.`,
      priority: 'high'
    });
  }
  if (isYes(data.neurologicalConcussionBaseline.ongoingPostConcussiveSymptoms)) {
    flags.push({
      id: 'FLAG-NEURO-003',
      category: 'Neurological',
      message: 'Ongoing post-concussive symptoms — do not clear until fully resolved.',
      priority: 'high'
    });
  }

  // RED-S triad indicators (low BMI + amenorrhoea + bone fracture)
  const bmi = data.demographics.bmi;
  const lowBmi = bmi !== null && bmi < 18.5;
  const reds = data.menstrualHistoryREDS;
  if (
    reds.applicable &&
    lowBmi &&
    isYes(reds.amenorrhoeaSixMonths) &&
    isYes(reds.stressFractureHistory)
  ) {
    flags.push({
      id: 'FLAG-REDS-001',
      category: 'RED-S',
      message:
        `Probable RED-S triad: BMI ${bmi}, amenorrhoea > 6 months, prior stress fracture — urgent multidisciplinary review.`,
      priority: 'high'
    });
  } else if (
    reds.applicable &&
    isYes(reds.amenorrhoeaSixMonths) &&
    (isYes(reds.restrictiveEatingPattern) || isYes(reds.stressFractureHistory))
  ) {
    flags.push({
      id: 'FLAG-REDS-002',
      category: 'RED-S',
      message: 'Two RED-S features present — refer for energy-availability assessment.',
      priority: 'high'
    });
  }

  // Infectious skin lesions in contact sport
  if (isYes(data.visionSkin.impetigoOrMRSA) && isContact) {
    flags.push({
      id: 'FLAG-SKIN-001',
      category: 'Skin',
      message: 'Impetigo / MRSA lesion in contact sport — exclude until cleared.',
      priority: 'high'
    });
  }
  if (isYes(data.visionSkin.herpesGladiatorum) && isContact) {
    flags.push({
      id: 'FLAG-SKIN-002',
      category: 'Skin',
      message: 'Active herpes gladiatorum in contact sport — exclude until lesions resolved.',
      priority: 'high'
    });
  }

  // Monocular athlete in high-contact sport without eyewear
  if (
    isYes(data.visionSkin.monocularAthlete) &&
    isHigh &&
    data.visionSkin.protectiveEyewearAvailable === 'no'
  ) {
    flags.push({
      id: 'FLAG-VIS-001',
      category: 'Vision',
      message: 'Monocular athlete in high-contact sport without protective eyewear.',
      priority: 'high'
    });
  }

  // ─── MEDIUM PRIORITY ──────────────────────────────────────

  if (isYes(data.musculoskeletalScreening.uncorrectedMajorInjury)) {
    flags.push({
      id: 'FLAG-MSK-001',
      category: 'Musculoskeletal',
      message:
        `Uncorrected major injury${
          data.musculoskeletalScreening.majorInjuryDetails
            ? `: ${data.musculoskeletalScreening.majorInjuryDetails}`
            : ''
        } — orthopaedic clearance required.`,
      priority: 'medium'
    });
  }
  if (
    isYes(data.visionSkin.monocularAthlete) &&
    !isHigh
  ) {
    flags.push({
      id: 'FLAG-VIS-002',
      category: 'Vision',
      message: 'Monocular athlete — counsel on protective eyewear.',
      priority: 'medium'
    });
  }
  if (
    isYes(data.medicalHistory.eatingDisorderHistory) ||
    (reds.applicable && isYes(reds.restrictiveEatingPattern))
  ) {
    flags.push({
      id: 'FLAG-EAT-001',
      category: 'Nutrition',
      message: 'Suspected eating disorder / restrictive eating — refer to sports nutrition / mental health.',
      priority: 'medium'
    });
  }
  if (isYes(data.cardiovascularScreening.highBloodPressureDiagnosis)) {
    flags.push({
      id: 'FLAG-CV-005',
      category: 'Cardiovascular',
      message: 'Hypertension diagnosis — confirm control before clearance.',
      priority: 'medium'
    });
  }
  if (isYes(data.sportPositionDetails.previousClearanceIssue)) {
    flags.push({
      id: 'FLAG-HX-001',
      category: 'Clearance History',
      message:
        `Previous clearance issue${
          data.sportPositionDetails.previousClearanceDetails
            ? `: ${data.sportPositionDetails.previousClearanceDetails}`
            : ''
        } — review prior decision.`,
      priority: 'medium'
    });
  }
  if (isYes(data.medicalHistory.heatIllnessHistory)) {
    flags.push({
      id: 'FLAG-HEAT-001',
      category: 'Environmental',
      message: 'Prior heat illness — heat-acclimatisation plan required.',
      priority: 'medium'
    });
  }
  if (isYes(data.medicalHistory.sickleCellTraitOrDisease)) {
    flags.push({
      id: 'FLAG-HEME-001',
      category: 'Haematology',
      message: 'Sickle cell trait or disease — counsel on exertional sickling.',
      priority: 'medium'
    });
  }

  // ─── LOW PRIORITY ─────────────────────────────────────────

  if (
    data.sportPositionDetails.hoursPerWeek !== null &&
    data.sportPositionDetails.hoursPerWeek >= 20
  ) {
    flags.push({
      id: 'FLAG-LOAD-001',
      category: 'Training Load',
      message:
        `${data.sportPositionDetails.hoursPerWeek} h / week training — monitor for overtraining.`,
      priority: 'low'
    });
  }
  if (lowBmi) {
    flags.push({
      id: 'FLAG-BMI-001',
      category: 'Anthropometry',
      message: `BMI ${bmi} — consider energy-availability assessment.`,
      priority: 'low'
    });
  }
  if (bmi !== null && bmi >= 30) {
    flags.push({
      id: 'FLAG-BMI-002',
      category: 'Anthropometry',
      message: `BMI ${bmi} — discuss conditioning and weight-related sport recommendations.`,
      priority: 'low'
    });
  }
  if (
    isYes(data.medicalHistory.allergiesKnown) &&
    !data.medicalHistory.allergyDetails.trim()
  ) {
    flags.push({
      id: 'FLAG-ALG-001',
      category: 'Allergies',
      message: 'Allergies reported but no details captured — document allergens and reactions.',
      priority: 'low'
    });
  }

  // Sort: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
