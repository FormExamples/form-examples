// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Endometriosis Assessment form.
//
// Builds and exports the canonical empty AssessmentData shape used by the
// wizard so newly-added fields default correctly when older saved state is
// rehydrated from localStorage.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'none' | 'mild' | 'moderate' | 'severe' | ''} ImpactLevel
 * @typedef {1 | 2 | 3 | 4} ASRMStage
 * @typedef {'mild' | 'moderate' | 'severe' | 'critical'} SeverityLevel
 */

/**
 * @typedef {Object} AssessmentData
 * Full questionnaire data — see emptyAssessment() for shape.
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. Public symbols are attached to a single global namespace,
// `window.EndometriosisAssessment`.
(function () {
'use strict';
window.EndometriosisAssessment = window.EndometriosisAssessment || {};

/** Build a fresh, fully-blank assessment. */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      weight: null,
      height: null,
      bmi: null
    },
    menstrualHistory: {
      ageAtMenarche: null,
      cycleRegularity: '',
      cycleLengthDays: null,
      periodDurationDays: null,
      flowHeaviness: '',
      clotsPresent: '',
      intermenstrualBleeding: '',
      postcoitalBleeding: '',
      dysmenorrhoeaSeverity: '',
      daysOffWorkPerCycle: null,
      currentContraception: '',
      menstrualNotes: ''
    },
    painAssessment: {
      hasPelvicPain: '',
      pelvicPainSeverity: null,
      pelvicPainCharacter: '',
      pelvicPainLocation: '',
      pelvicPainTiming: '',
      dyspareunia: '',
      dyspareuniaSeverity: null,
      dyschezia: '',
      dyscheziaCyclical: '',
      backPain: '',
      legPain: '',
      painWorseWithActivity: '',
      painNotes: ''
    },
    gastrointestinalSymptoms: {
      hasGiSymptoms: '',
      bloating: '',
      bloatingCyclical: '',
      nausea: '',
      constipation: '',
      diarrhoea: '',
      alternatingBowelHabit: '',
      rectalBleeding: '',
      rectalBleedingCyclical: '',
      bowelObstructionSymptoms: '',
      giNotes: ''
    },
    urinarySymptoms: {
      hasUrinarySymptoms: '',
      frequency: '',
      urgency: '',
      dysuria: '',
      haematuria: '',
      haematuriaCyclical: '',
      flankPain: '',
      urinaryObstructionSymptoms: '',
      recurrentUtis: '',
      urinaryNotes: ''
    },
    fertilityAssessment: {
      tryingToConceive: '',
      durationTryingMonths: null,
      previousPregnancies: null,
      liveBirths: null,
      miscarriages: null,
      ectopicPregnancies: null,
      previousFertilityTreatment: '',
      fertilityTreatmentDetails: '',
      amhLevel: null,
      partnerSemenAnalysis: '',
      futureFertilityConcerns: '',
      fertilityNotes: ''
    },
    previousTreatments: {
      nsaidsTried: '',
      nsaidsEffective: '',
      paracetamolTried: '',
      opioidsTried: '',
      opioidsCurrent: '',
      combinedPillTried: '',
      combinedPillEffective: '',
      progesteroneTried: '',
      progesteroneType: '',
      gnrhAgonistTried: '',
      gnrhAgonistDurationMonths: null,
      mirenaIusTried: '',
      otherTreatments: '',
      treatmentNotes: ''
    },
    surgicalHistory: {
      previousLaparoscopy: '',
      numberOfLaparoscopies: null,
      mostRecentLaparoscopyDate: '',
      endometriosisConfirmedSurgically: '',
      histologicalConfirmation: '',
      asrmStageAtSurgery: '',
      sitesFound: '',
      excisionPerformed: '',
      ablationPerformed: '',
      adhesiolysisPerformed: '',
      endometriomaDrained: '',
      bowelSurgery: '',
      bladderSurgery: '',
      otherPelvicSurgery: '',
      surgicalComplications: '',
      surgicalNotes: ''
    },
    qualityOfLife: {
      painDomainScore: null,
      controlPowerlessnessScore: null,
      emotionalWellbeingScore: null,
      socialSupportScore: null,
      selfImageScore: null,
      workImpact: '',
      relationshipImpact: '',
      sleepImpact: '',
      mentalHealthImpact: '',
      exerciseImpact: '',
      qolNotes: ''
    },
    treatmentPlanning: {
      treatmentGoals: '',
      preferredApproach: '',
      surgeryConsidered: '',
      surgeryTypeConsidered: '',
      fertilityPreservationNeeded: '',
      mdtReferralNeeded: '',
      painManagementReferral: '',
      psychologyReferral: '',
      physiotherapyReferral: '',
      fertilityClinicReferral: '',
      imagingRequested: '',
      followUpInterval: '',
      planningNotes: ''
    }
  };
}

/** Calculate BMI from weight (kg) and height (cm). Returns null if invalid. */
function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/** Get BMI category label. */
function bmiCategory(bmi) {
  if (bmi === null || bmi === undefined) return '';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese Class I';
  if (bmi < 40) return 'Obese Class II';
  return 'Obese Class III (Morbid)';
}

/** Calculate EHP-30 total score from domain scores. Null if <3 domains answered. */
function calculateEHP30Total(painDomain, controlDomain, emotionalDomain, socialDomain, selfImageDomain) {
  const scores = [painDomain, controlDomain, emotionalDomain, socialDomain, selfImageDomain]
    .filter((s) => s !== null && s !== undefined);
  if (scores.length < 3) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/** EHP-30 score label. */
function ehp30Label(score) {
  if (score === null || score === undefined) return 'Not assessed';
  if (score <= 25) return 'Minimal impact';
  if (score <= 50) return 'Moderate impact';
  if (score <= 75) return 'Significant impact';
  return 'Severe impact';
}

/** ASRM Stage long label. */
function asrmStageLabel(stage) {
  switch (stage) {
    case 1: return 'Stage I — Minimal (1-5 points)';
    case 2: return 'Stage II — Mild (6-15 points)';
    case 3: return 'Stage III — Moderate (16-40 points)';
    case 4: return 'Stage IV — Severe (>40 points)';
    default: return 'Not staged';
  }
}

/** ASRM Stage short label. */
function asrmStageShort(stage) {
  switch (stage) {
    case 1: return 'Stage I';
    case 2: return 'Stage II';
    case 3: return 'Stage III';
    case 4: return 'Stage IV';
    default: return 'N/A';
  }
}

/** Severity label. */
function severityLabel(severity) {
  switch (severity) {
    case 'mild': return 'Mild';
    case 'moderate': return 'Moderate';
    case 'severe': return 'Severe';
    case 'critical': return 'Critical';
    default: return '';
  }
}

/** Severity CSS modifier class. */
function severityClass(severity) {
  switch (severity) {
    case 'mild': return 'severity-mild';
    case 'moderate': return 'severity-moderate';
    case 'severe': return 'severity-severe';
    case 'critical': return 'severity-critical';
    default: return '';
  }
}

/** Endometriosis grade label. */
function endoGradeLabel(grade) {
  switch (grade) {
    case 1: return 'Grade 1 — Minimal';
    case 2: return 'Grade 2 — Mild';
    case 3: return 'Grade 3 — Moderate';
    case 4: return 'Grade 4 — Severe';
    default: return `Grade ${grade}`;
  }
}

Object.assign(window.EndometriosisAssessment, {
  emptyAssessment,
  calculateBMI,
  bmiCategory,
  calculateEHP30Total,
  ehp30Label,
  asrmStageLabel,
  asrmStageShort,
  severityLabel,
  severityClass,
  endoGradeLabel
});
})();
