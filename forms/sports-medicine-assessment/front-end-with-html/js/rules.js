// PPE (Pre-Participation Physical Evaluation, 5th ed.) clearance rules.
//
// Each rule is a pure predicate over the assessment data. When the rule
// fires, the grader records it with a 1-4 grade:
//
//   4 - Not Cleared      (absolute disqualifier pending evaluation)
//   3 - Pending          (must complete further evaluation before clearance)
//   2 - Conditional      (cleared with conditions / monitoring)
//   1 - Informational    (does not affect clearance, audit-trail only)
//
// The grader (`gradePPE`) then aggregates the highest-grade rule that
// fired into a single clearance level.
//
// Rule IDs follow PPE-NNN ordering by section.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} PPERule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {1 | 2 | 3 | 4} grade
 * @property {(d: AssessmentData) => boolean} fires
 */

// Wrapped in an IIFE; published via window.SportsMedicineAssessment.

const isYes = (v) => v === 'yes';
const isHighContact = (d) => d.sportPositionDetails.contactLevel === 'high';
const isContactSport = (d) =>
  d.sportPositionDetails.contactLevel === 'high' ||
  d.sportPositionDetails.contactLevel === 'moderate';

/** @type {PPERule[]} */
const ppeRules = [
  // ─── Medical history ───────────────────────────────────────
  {
    id: 'PPE-001',
    category: 'Medical History',
    description: 'Chronic illness reported — confirm management is optimised before sport.',
    grade: 2,
    fires: (d) => isYes(d.medicalHistory.chronicIllness)
  },
  {
    id: 'PPE-002',
    category: 'Medical History',
    description: 'Sickle cell trait or disease — exertional sickling risk; counsel and individualise.',
    grade: 2,
    fires: (d) => isYes(d.medicalHistory.sickleCellTraitOrDisease)
  },
  {
    id: 'PPE-003',
    category: 'Medical History',
    description: 'Prior heat illness — heat-acclimatisation plan required.',
    grade: 2,
    fires: (d) => isYes(d.medicalHistory.heatIllnessHistory)
  },
  {
    id: 'PPE-004',
    category: 'Medical History',
    description: 'Eating-disorder history — nutrition / mental-health follow-up before clearance.',
    grade: 3,
    fires: (d) => isYes(d.medicalHistory.eatingDisorderHistory)
  },
  {
    id: 'PPE-005',
    category: 'Medical History',
    description: 'Asthma / exercise-induced bronchospasm — confirm action plan and inhaler.',
    grade: 2,
    fires: (d) => isYes(d.medicalHistory.asthmaOrExerciseInducedBronchospasm)
  },
  {
    id: 'PPE-006',
    category: 'Medical History',
    description: 'Diabetes — glycaemic-management plan required for training and competition.',
    grade: 2,
    fires: (d) => isYes(d.medicalHistory.diabetes)
  },
  {
    id: 'PPE-007',
    category: 'Medical History',
    description: 'Hospitalised in the last 12 months — review discharge summary before clearance.',
    grade: 2,
    fires: (d) => isYes(d.medicalHistory.hospitalisedLastYear)
  },

  // ─── Family history ────────────────────────────────────────
  {
    id: 'PPE-010',
    category: 'Family History',
    description:
      'Family sudden cardiac death under 50 — cardiology evaluation (ECG ± echo) required.',
    grade: 4,
    fires: (d) => isYes(d.familyHistory.suddenCardiacDeathUnder50)
  },
  {
    id: 'PPE-011',
    category: 'Family History',
    description: 'Family hypertrophic cardiomyopathy — cardiology screening required.',
    grade: 4,
    fires: (d) => isYes(d.familyHistory.hypertrophicCardiomyopathy)
  },
  {
    id: 'PPE-012',
    category: 'Family History',
    description: 'Family Marfan syndrome — Marfan screen and aortic-root imaging required.',
    grade: 3,
    fires: (d) => isYes(d.familyHistory.marfanSyndrome)
  },
  {
    id: 'PPE-013',
    category: 'Family History',
    description: 'Family long-QT syndrome — 12-lead ECG and cardiology review.',
    grade: 3,
    fires: (d) => isYes(d.familyHistory.longQTSyndrome)
  },
  {
    id: 'PPE-014',
    category: 'Family History',
    description: 'Family arrhythmia / pacemaker — cardiology evaluation recommended.',
    grade: 2,
    fires: (d) => isYes(d.familyHistory.arrhythmiaOrPacemaker)
  },
  {
    id: 'PPE-015',
    category: 'Family History',
    description: 'Family unexplained seizure or fainting — neurology / cardiology review.',
    grade: 3,
    fires: (d) => isYes(d.familyHistory.unexplainedSeizureOrFainting)
  },

  // ─── RED-S / menstrual ────────────────────────────────────
  {
    id: 'PPE-020',
    category: 'RED-S',
    description:
      'Amenorrhoea > 6 months in a female athlete — RED-S workup before clearance.',
    grade: 3,
    fires: (d) =>
      d.menstrualHistoryREDS.applicable &&
      isYes(d.menstrualHistoryREDS.amenorrhoeaSixMonths)
  },
  {
    id: 'PPE-021',
    category: 'RED-S',
    description: 'Restrictive eating pattern reported — nutrition referral.',
    grade: 3,
    fires: (d) =>
      d.menstrualHistoryREDS.applicable &&
      isYes(d.menstrualHistoryREDS.restrictiveEatingPattern)
  },
  {
    id: 'PPE-022',
    category: 'RED-S',
    description: 'Stress fracture history — bone-health and energy-availability review.',
    grade: 2,
    fires: (d) =>
      d.menstrualHistoryREDS.applicable &&
      isYes(d.menstrualHistoryREDS.stressFractureHistory)
  },
  {
    id: 'PPE-023',
    category: 'RED-S',
    description:
      'Probable RED-S triad: amenorrhoea + restrictive eating + stress fracture — full triad workup.',
    grade: 4,
    fires: (d) =>
      d.menstrualHistoryREDS.applicable &&
      isYes(d.menstrualHistoryREDS.amenorrhoeaSixMonths) &&
      isYes(d.menstrualHistoryREDS.restrictiveEatingPattern) &&
      isYes(d.menstrualHistoryREDS.stressFractureHistory)
  },

  // ─── Cardiovascular screening ──────────────────────────────
  {
    id: 'PPE-030',
    category: 'Cardiovascular',
    description: 'Chest pain with exertion — cardiology evaluation before clearance.',
    grade: 4,
    fires: (d) => isYes(d.cardiovascularScreening.chestPainWithExertion)
  },
  {
    id: 'PPE-031',
    category: 'Cardiovascular',
    description: 'Unexplained syncope (especially exertional) — cardiology evaluation.',
    grade: 4,
    fires: (d) => isYes(d.cardiovascularScreening.unexplainedSyncope)
  },
  {
    id: 'PPE-032',
    category: 'Cardiovascular',
    description: 'Excessive exertional breathlessness — cardio-pulmonary evaluation.',
    grade: 3,
    fires: (d) => isYes(d.cardiovascularScreening.excessiveBreathlessness)
  },
  {
    id: 'PPE-033',
    category: 'Cardiovascular',
    description: 'Palpitations or irregular heartbeat — ECG and cardiology review.',
    grade: 3,
    fires: (d) => isYes(d.cardiovascularScreening.palpitationsOrIrregularBeat)
  },
  {
    id: 'PPE-034',
    category: 'Cardiovascular',
    description: 'Heart murmur on examination — cardiology evaluation.',
    grade: 3,
    fires: (d) => isYes(d.cardiovascularScreening.heartMurmurDetected)
  },
  {
    id: 'PPE-035',
    category: 'Cardiovascular',
    description: 'Hypertension diagnosis — confirm control and review activity restrictions.',
    grade: 2,
    fires: (d) => isYes(d.cardiovascularScreening.highBloodPressureDiagnosis)
  },
  {
    id: 'PPE-036',
    category: 'Cardiovascular',
    description: 'Resting blood pressure ≥ 140/90 mmHg — confirm with serial readings.',
    grade: 2,
    fires: (d) =>
      (d.cardiovascularScreening.restingSystolic !== null &&
        d.cardiovascularScreening.restingSystolic >= 140) ||
      (d.cardiovascularScreening.restingDiastolic !== null &&
        d.cardiovascularScreening.restingDiastolic >= 90)
  },
  {
    id: 'PPE-037',
    category: 'Cardiovascular',
    description: 'Previously restricted from sport for cardiac reasons — re-evaluate.',
    grade: 3,
    fires: (d) => isYes(d.cardiovascularScreening.restrictedActivityForHeart)
  },

  // ─── Musculoskeletal ──────────────────────────────────────
  {
    id: 'PPE-040',
    category: 'Musculoskeletal',
    description: 'Uncorrected major injury — orthopaedic clearance before return to sport.',
    grade: 3,
    fires: (d) => isYes(d.musculoskeletalScreening.uncorrectedMajorInjury)
  },
  {
    id: 'PPE-041',
    category: 'Musculoskeletal',
    description: 'Joint instability — rehabilitation / brace / surgical opinion.',
    grade: 2,
    fires: (d) => isYes(d.musculoskeletalScreening.jointInstability)
  },
  {
    id: 'PPE-042',
    category: 'Musculoskeletal',
    description: 'Ongoing pain or swelling — defer clearance until resolved.',
    grade: 2,
    fires: (d) => isYes(d.musculoskeletalScreening.ongoingPainOrSwelling)
  },
  {
    id: 'PPE-043',
    category: 'Musculoskeletal',
    description: 'Restricted range of motion — physiotherapy review.',
    grade: 2,
    fires: (d) => d.musculoskeletalScreening.fullRangeOfMotion === 'no'
  },
  {
    id: 'PPE-044',
    category: 'Musculoskeletal',
    description: 'Asymmetric / reduced strength — rehabilitation before clearance.',
    grade: 2,
    fires: (d) => d.musculoskeletalScreening.normalStrengthBilateral === 'no'
  },

  // ─── Neurological / concussion ────────────────────────────
  {
    id: 'PPE-050',
    category: 'Neurological',
    description: 'Concussion in the last 6 months — symptom-free + graduated return required.',
    grade: 3,
    fires: (d) => isYes(d.neurologicalConcussionBaseline.concussionLastSixMonths)
  },
  {
    id: 'PPE-051',
    category: 'Neurological',
    description: 'Three or more lifetime concussions — neurology review for return-to-play.',
    grade: 3,
    fires: (d) =>
      d.neurologicalConcussionBaseline.totalConcussions !== null &&
      d.neurologicalConcussionBaseline.totalConcussions >= 3
  },
  {
    id: 'PPE-052',
    category: 'Neurological',
    description: 'Ongoing post-concussive symptoms — not cleared until resolved.',
    grade: 4,
    fires: (d) => isYes(d.neurologicalConcussionBaseline.ongoingPostConcussiveSymptoms)
  },
  {
    id: 'PPE-053',
    category: 'Neurological',
    description: 'History of seizures — neurology review and individual risk plan.',
    grade: 3,
    fires: (d) => isYes(d.neurologicalConcussionBaseline.historyOfSeizures)
  },
  {
    id: 'PPE-054',
    category: 'Neurological',
    description: 'Stinger / burner episode — confirm full neurological recovery.',
    grade: 2,
    fires: (d) => isYes(d.neurologicalConcussionBaseline.stinger)
  },

  // ─── Vision / skin ────────────────────────────────────────
  {
    id: 'PPE-060',
    category: 'Vision',
    description:
      'Monocular athlete in high-contact sport without protective eyewear — must wear ASTM-rated eyewear.',
    grade: 3,
    fires: (d) =>
      isYes(d.visionSkin.monocularAthlete) &&
      isHighContact(d) &&
      d.visionSkin.protectiveEyewearAvailable === 'no'
  },
  {
    id: 'PPE-061',
    category: 'Vision',
    description: 'Monocular athlete — counsel on protective eyewear regardless of sport.',
    grade: 2,
    fires: (d) =>
      isYes(d.visionSkin.monocularAthlete) && !isHighContact(d)
  },
  {
    id: 'PPE-070',
    category: 'Skin',
    description:
      'Active impetigo / MRSA skin lesion in contact sport — exclude until lesions have healed and cultures negative.',
    grade: 4,
    fires: (d) => isYes(d.visionSkin.impetigoOrMRSA) && isContactSport(d)
  },
  {
    id: 'PPE-071',
    category: 'Skin',
    description:
      'Active herpes gladiatorum in contact sport — exclude per NCAA / NFHS criteria until cleared.',
    grade: 4,
    fires: (d) => isYes(d.visionSkin.herpesGladiatorum) && isContactSport(d)
  },
  {
    id: 'PPE-072',
    category: 'Skin',
    description: 'Open wounds or weeping lesions — cover or defer participation.',
    grade: 2,
    fires: (d) => isYes(d.visionSkin.openWoundsOrLesions)
  }
];

export { ppeRules };
