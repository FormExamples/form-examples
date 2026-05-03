// NICE NG201 Antenatal Risk Assessment rules.
//
// Each rule inspects the assessment data and either fires (returning a
// RiskLevel of 'low', 'moderate', or 'high') or does not fire (returning
// null). The grader composes the per-rule outputs into an overall risk
// stratification using the highest fired risk.
//
// Categories and identifiers:
//   NG201-AGE-*       Maternal-age risk factors
//   NG201-BMI-*       BMI-related risk
//   NG201-OBS-*       Obstetric history
//   NG201-MED-*       Medical history (pre-existing conditions)
//   NG201-PREG-*      Current pregnancy factors
//   NG201-SOCIAL-*    Lifestyle and social risk factors
//   NG201-SCREEN-*    Screening test results
//   NG201-MH-*        Mental health screening
//   NG201-FETAL-*     Fetal assessment

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskLevel} RiskLevel
 *
 * @typedef {Object} NG201Rule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => (RiskLevel | null)} evaluate
 */

// Wrapped in an IIFE; published via window.ObstetricsAssessment.
(function () {
'use strict';
window.ObstetricsAssessment = window.ObstetricsAssessment || {};

/** @type {NG201Rule[]} */
const ng201Rules = [
  // ─── Maternal age ─────────────────────────────────────────
  {
    id: 'NG201-AGE-001',
    category: 'Maternal Age',
    description: 'Maternal age 40 or over at booking — high risk.',
    evaluate: (d) => {
      const age = d.maternalDemographics.ageAtBooking;
      return age != null && age >= 40 ? 'high' : null;
    }
  },
  {
    id: 'NG201-AGE-002',
    category: 'Maternal Age',
    description: 'Maternal age 35-39 at booking — moderate risk.',
    evaluate: (d) => {
      const age = d.maternalDemographics.ageAtBooking;
      return age != null && age >= 35 && age < 40 ? 'moderate' : null;
    }
  },
  {
    id: 'NG201-AGE-003',
    category: 'Maternal Age',
    description: 'Maternal age under 18 at booking — moderate risk.',
    evaluate: (d) => {
      const age = d.maternalDemographics.ageAtBooking;
      return age != null && age < 18 ? 'moderate' : null;
    }
  },

  // ─── BMI ──────────────────────────────────────────────────
  {
    id: 'NG201-BMI-001',
    category: 'Body Mass Index',
    description: 'BMI 35 or higher — high risk.',
    evaluate: (d) => {
      const bmi = d.maternalDemographics.bmi;
      return bmi != null && bmi >= 35 ? 'high' : null;
    }
  },
  {
    id: 'NG201-BMI-002',
    category: 'Body Mass Index',
    description: 'BMI 30-34.9 — moderate risk.',
    evaluate: (d) => {
      const bmi = d.maternalDemographics.bmi;
      return bmi != null && bmi >= 30 && bmi < 35 ? 'moderate' : null;
    }
  },
  {
    id: 'NG201-BMI-003',
    category: 'Body Mass Index',
    description: 'BMI under 18.5 — moderate risk.',
    evaluate: (d) => {
      const bmi = d.maternalDemographics.bmi;
      return bmi != null && bmi < 18.5 ? 'moderate' : null;
    }
  },

  // ─── Obstetric history ───────────────────────────────────
  {
    id: 'NG201-OBS-001',
    category: 'Obstetric History',
    description: 'Previous stillbirth or neonatal death — high risk.',
    evaluate: (d) => {
      const sb = d.obstetricHistory.previousStillbirths;
      const nd = d.obstetricHistory.previousNeonatalDeaths;
      return ((sb != null && sb > 0) || (nd != null && nd > 0)) ? 'high' : null;
    }
  },
  {
    id: 'NG201-OBS-002',
    category: 'Obstetric History',
    description: 'Previous pre-eclampsia — high risk.',
    evaluate: (d) =>
      d.obstetricHistory.previousPreEclampsia === 'yes' ? 'high' : null
  },
  {
    id: 'NG201-OBS-003',
    category: 'Obstetric History',
    description: 'Previous preterm birth — high risk.',
    evaluate: (d) =>
      d.obstetricHistory.previousPretermBirth === 'yes' ? 'high' : null
  },
  {
    id: 'NG201-OBS-004',
    category: 'Obstetric History',
    description: 'Previous gestational diabetes — moderate risk.',
    evaluate: (d) =>
      d.obstetricHistory.previousGestationalDiabetes === 'yes' ? 'moderate' : null
  },
  {
    id: 'NG201-OBS-005',
    category: 'Obstetric History',
    description: 'Previous caesarean section — moderate risk.',
    evaluate: (d) =>
      d.obstetricHistory.previousCaesarean === 'yes' ? 'moderate' : null
  },
  {
    id: 'NG201-OBS-006',
    category: 'Obstetric History',
    description: 'Previous postpartum haemorrhage — moderate risk.',
    evaluate: (d) =>
      d.obstetricHistory.previousPostpartumHaemorrhage === 'yes' ? 'moderate' : null
  },
  {
    id: 'NG201-OBS-007',
    category: 'Obstetric History',
    description: 'Previous shoulder dystocia — moderate risk.',
    evaluate: (d) =>
      d.obstetricHistory.previousShoulderDystocia === 'yes' ? 'moderate' : null
  },
  {
    id: 'NG201-OBS-008',
    category: 'Obstetric History',
    description: 'Three or more previous miscarriages — moderate risk.',
    evaluate: (d) => {
      const m = d.obstetricHistory.previousMiscarriages;
      return m != null && m >= 3 ? 'moderate' : null;
    }
  },
  {
    id: 'NG201-OBS-009',
    category: 'Obstetric History',
    description: 'Previous congenital anomaly — moderate risk.',
    evaluate: (d) =>
      d.obstetricHistory.previousCongenitalAnomaly === 'yes' ? 'moderate' : null
  },
  {
    id: 'NG201-OBS-010',
    category: 'Obstetric History',
    description: 'Grand multiparity (parity 4 or higher) — moderate risk.',
    evaluate: (d) => {
      const p = d.obstetricHistory.parity;
      return p != null && p >= 4 ? 'moderate' : null;
    }
  },

  // ─── Medical history ─────────────────────────────────────
  {
    id: 'NG201-MED-001',
    category: 'Medical History',
    description: 'Cardiac disease — high risk.',
    evaluate: (d) =>
      d.medicalHistory.cardiacDisease === 'yes' ? 'high' : null
  },
  {
    id: 'NG201-MED-002',
    category: 'Medical History',
    description: 'Pre-existing diabetes (Type 1 or Type 2) — high risk.',
    evaluate: (d) =>
      d.medicalHistory.preExistingDiabetes === 'yes' ? 'high' : null
  },
  {
    id: 'NG201-MED-003',
    category: 'Medical History',
    description: 'Chronic hypertension — high risk.',
    evaluate: (d) =>
      d.medicalHistory.chronicHypertension === 'yes' ? 'high' : null
  },
  {
    id: 'NG201-MED-004',
    category: 'Medical History',
    description: 'Renal disease — high risk.',
    evaluate: (d) =>
      d.medicalHistory.renalDisease === 'yes' ? 'high' : null
  },
  {
    id: 'NG201-MED-005',
    category: 'Medical History',
    description: 'Previous venous thromboembolism — high risk.',
    evaluate: (d) =>
      d.medicalHistory.previousVte === 'yes' ? 'high' : null
  },
  {
    id: 'NG201-MED-006',
    category: 'Medical History',
    description: 'Thrombophilia — high risk.',
    evaluate: (d) =>
      d.medicalHistory.thrombophilia === 'yes' ? 'high' : null
  },
  {
    id: 'NG201-MED-007',
    category: 'Medical History',
    description: 'HIV positive — high risk.',
    evaluate: (d) =>
      d.medicalHistory.hivPositive === 'yes' ? 'high' : null
  },
  {
    id: 'NG201-MED-008',
    category: 'Medical History',
    description: 'Autoimmune disease — moderate risk.',
    evaluate: (d) =>
      d.medicalHistory.autoimmuneDisease === 'yes' ? 'moderate' : null
  },
  {
    id: 'NG201-MED-009',
    category: 'Medical History',
    description: 'Epilepsy — moderate risk.',
    evaluate: (d) =>
      d.medicalHistory.epilepsy === 'yes' ? 'moderate' : null
  },
  {
    id: 'NG201-MED-010',
    category: 'Medical History',
    description: 'Thyroid disease — moderate risk.',
    evaluate: (d) =>
      d.medicalHistory.thyroidDisease === 'yes' ? 'moderate' : null
  },
  {
    id: 'NG201-MED-011',
    category: 'Medical History',
    description: 'Hepatitis B or C — moderate risk.',
    evaluate: (d) =>
      d.medicalHistory.hepatitis === 'yes' ? 'moderate' : null
  },
  {
    id: 'NG201-MED-012',
    category: 'Medical History',
    description: 'Bariatric surgery history — moderate risk.',
    evaluate: (d) =>
      d.medicalHistory.bariatricSurgery === 'yes' ? 'moderate' : null
  },

  // ─── Current pregnancy ────────────────────────────────────
  {
    id: 'NG201-PREG-001',
    category: 'Current Pregnancy',
    description: 'Multiple pregnancy — high risk.',
    evaluate: (d) =>
      d.currentPregnancy.multiplePregnancy === 'yes' ? 'high' : null
  },
  {
    id: 'NG201-PREG-002',
    category: 'Current Pregnancy',
    description: 'IVF / assisted conception — moderate risk.',
    evaluate: (d) =>
      d.currentPregnancy.ivfConception === 'yes' ? 'moderate' : null
  },

  // ─── Lifestyle / social ───────────────────────────────────
  {
    id: 'NG201-SOCIAL-001',
    category: 'Lifestyle & Social',
    description: 'Current smoker in pregnancy — moderate risk.',
    evaluate: (d) =>
      d.lifestyleSocialFactors.smokingStatus === 'current' ? 'moderate' : null
  },
  {
    id: 'NG201-SOCIAL-002',
    category: 'Lifestyle & Social',
    description: 'Alcohol use in pregnancy — moderate risk.',
    evaluate: (d) => {
      const a = d.lifestyleSocialFactors.alcoholUse;
      return (a === 'occasional' || a === 'regular') ? 'moderate' : null;
    }
  },
  {
    id: 'NG201-SOCIAL-003',
    category: 'Lifestyle & Social',
    description: 'Substance use in pregnancy — high risk.',
    evaluate: (d) => {
      const s = d.lifestyleSocialFactors.substanceUse;
      return (s === 'occasional' || s === 'regular') ? 'high' : null;
    }
  },
  {
    id: 'NG201-SOCIAL-004',
    category: 'Lifestyle & Social',
    description: 'Domestic abuse disclosed — high risk.',
    evaluate: (d) =>
      d.lifestyleSocialFactors.domesticAbuse === 'yes' ? 'high' : null
  },
  {
    id: 'NG201-SOCIAL-005',
    category: 'Lifestyle & Social',
    description: 'Safeguarding concerns — high risk.',
    evaluate: (d) =>
      d.lifestyleSocialFactors.safeguardingConcerns === 'yes' ? 'high' : null
  },
  {
    id: 'NG201-SOCIAL-006',
    category: 'Lifestyle & Social',
    description: 'Female genital mutilation — high risk.',
    evaluate: (d) =>
      d.lifestyleSocialFactors.femaleGenitalMutilation === 'yes' ? 'high' : null
  },
  {
    id: 'NG201-SOCIAL-007',
    category: 'Lifestyle & Social',
    description: 'Asylum seeker / refugee — moderate risk.',
    evaluate: (d) =>
      d.lifestyleSocialFactors.asylumOrRefugee === 'yes' ? 'moderate' : null
  },
  {
    id: 'NG201-SOCIAL-008',
    category: 'Lifestyle & Social',
    description: 'Housing insecurity — moderate risk.',
    evaluate: (d) =>
      d.lifestyleSocialFactors.housingInsecurity === 'yes' ? 'moderate' : null
  },

  // ─── Screening results ────────────────────────────────────
  {
    id: 'NG201-SCREEN-001',
    category: 'Screening',
    description: 'Combined test high-risk result — high risk.',
    evaluate: (d) =>
      d.screeningResults.combinedTestResult === 'higher-chance' ? 'high' : null
  },
  {
    id: 'NG201-SCREEN-002',
    category: 'Screening',
    description: 'Glucose tolerance test diagnostic of GDM — high risk.',
    evaluate: (d) =>
      d.screeningResults.gttResult === 'gdm-confirmed' ? 'high' : null
  },
  {
    id: 'NG201-SCREEN-003',
    category: 'Screening',
    description: 'Anomaly scan abnormal — high risk.',
    evaluate: (d) =>
      d.screeningResults.anomalyScanFindings === 'abnormal' ? 'high' : null
  },
  {
    id: 'NG201-SCREEN-004',
    category: 'Screening',
    description: 'Red-cell antibody screen positive — high risk.',
    evaluate: (d) =>
      d.screeningResults.antibodyScreenPositive === 'yes' ? 'high' : null
  },
  {
    id: 'NG201-SCREEN-005',
    category: 'Screening',
    description: 'Infection screen abnormal — moderate risk.',
    evaluate: (d) =>
      d.screeningResults.infectionScreenAbnormal === 'yes' ? 'moderate' : null
  },

  // ─── Mental health ────────────────────────────────────────
  {
    id: 'NG201-MH-001',
    category: 'Mental Health',
    description: 'Self-harm or suicidal ideation disclosed — high risk.',
    evaluate: (d) =>
      d.mentalHealthAssessment.selfHarmIdeation === 'yes' ? 'high' : null
  },
  {
    id: 'NG201-MH-002',
    category: 'Mental Health',
    description: 'Previous severe mental illness — high risk.',
    evaluate: (d) =>
      d.mentalHealthAssessment.previousSevereMentalIllness === 'yes' ? 'high' : null
  },
  {
    id: 'NG201-MH-003',
    category: 'Mental Health',
    description: 'Both Whooley questions positive — moderate risk.',
    evaluate: (d) =>
      (d.mentalHealthAssessment.whooley1 === 'yes' &&
       d.mentalHealthAssessment.whooley2 === 'yes') ? 'moderate' : null
  },
  {
    id: 'NG201-MH-004',
    category: 'Mental Health',
    description: 'Previous postnatal depression — moderate risk.',
    evaluate: (d) =>
      d.mentalHealthAssessment.previousPostnatalDepression === 'yes' ? 'moderate' : null
  },
  {
    id: 'NG201-MH-005',
    category: 'Mental Health',
    description: 'GAD-2 score positive (>= 3) — moderate risk.',
    evaluate: (d) => {
      const gad2Map = {
        'not-at-all': 0,
        'several-days': 1,
        'more-than-half': 2,
        'nearly-every-day': 3
      };
      const q1 = gad2Map[d.mentalHealthAssessment.gad2Q1] ?? 0;
      const q2 = gad2Map[d.mentalHealthAssessment.gad2Q2] ?? 0;
      return (q1 + q2) >= 3 ? 'moderate' : null;
    }
  },

  // ─── Fetal assessment ─────────────────────────────────────
  {
    id: 'NG201-FETAL-001',
    category: 'Fetal Assessment',
    description: 'Reduced fetal movements reported — high risk.',
    evaluate: (d) =>
      d.fetalAssessment.reducedFetalMovements === 'yes' ? 'high' : null
  },
  {
    id: 'NG201-FETAL-002',
    category: 'Fetal Assessment',
    description: 'Growth concern (SGA / LGA / IUGR) — high risk.',
    evaluate: (d) =>
      d.fetalAssessment.growthConcern === 'yes' ? 'high' : null
  }
];

window.ObstetricsAssessment.ng201Rules = ng201Rules;
})();
