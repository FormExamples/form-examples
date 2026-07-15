import { calculateAgeYears } from './types.js';

// JPAC Donor Selection Guidelines (DSG) deferral rules.
//
// Each rule inspects an `AssessmentData` and, if a deferral criterion is
// met, returns a fired `FiredRule` describing the status and (for
// time-limited deferrals) the deferral window in days. Rules whose
// criterion does not match return `null`.
//
// Rule IDs:
//   DSG-AGE-* / DSG-WEIGHT-*  donor demographics
//   DSG-HEALTH-*              same-day general wellbeing
//   DSG-MED-*                 medical history (some permanent)
//   DSG-ILL-*                 recent illness / infections
//   DSG-TRAVEL-*              travel
//   DSG-LIFE-*                lifestyle risk
//   DSG-PREG-*                pregnancy / transfusion
//   DSG-VITAL-*               vital signs
//   DSG-CONS-*                informed consent

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 *
 * @typedef {Object} DSGRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => FiredRule | null} evaluate
 */

/** @param {string} id @param {string} category @param {string} description @param {string} window */
function temp(id, category, description, window) {
  return { id, category, description, status: 'temporarily-deferred', deferralWindow: window };
}
/** @param {string} id @param {string} category @param {string} description */
function perm(id, category, description) {
  return { id, category, description, status: 'permanently-deferred' };
}

/** @type {DSGRule[]} */
const dsgRules = [
  // ─── Donor demographics ───────────────────────────────────────
  {
    id: 'DSG-AGE-001',
    category: 'Donor Demographics',
    description: 'Donor must be aged 17 to 65 (first-time) or up to 70 (regular).',
    evaluate: (d) => {
      const age = calculateAgeYears(d.donorDemographics.dateOfBirth);
      if (age == null) return null;
      if (age < 17) return temp('DSG-AGE-001', 'Donor Demographics',
        `Donor is ${age} y — minimum donation age is 17.`,
        'Until 17th birthday');
      if (d.donorDemographics.donorType === 'first-time' && age > 65) {
        return temp('DSG-AGE-002', 'Donor Demographics',
          `First-time donor over 65 (${age} y) — clinician approval required.`,
          'Pending clinician review');
      }
      if (age > 70) {
        return temp('DSG-AGE-003', 'Donor Demographics',
          `Donor over 70 (${age} y) — annual GP confirmation required.`,
          'Pending GP confirmation');
      }
      return null;
    }
  },
  {
    id: 'DSG-WEIGHT-001',
    category: 'Donor Demographics',
    description: 'Donor must weigh at least 50 kg.',
    evaluate: (d) => {
      const w = d.donorDemographics.weight;
      if (w == null) return null;
      if (w < 50) return temp('DSG-WEIGHT-001', 'Donor Demographics',
        `Weight ${w} kg is below the 50 kg minimum.`,
        'Until weight ≥ 50 kg');
      return null;
    }
  },
  {
    id: 'DSG-INTERVAL-001',
    category: 'Donor Demographics',
    description: 'Whole-blood donations must be at least 12 weeks apart (men) / 16 weeks (women).',
    evaluate: (d) => {
      const last = d.donorDemographics.lastDonationDate;
      if (!last) return null;
      const lastDate = new Date(last);
      if (isNaN(lastDate.getTime())) return null;
      const daysSince = Math.floor((Date.now() - lastDate.getTime()) / 86400000);
      const sex = d.donorDemographics.sex;
      const minDays = sex === 'female' ? 112 : 84;
      if (daysSince < minDays) {
        const remaining = minDays - daysSince;
        return temp('DSG-INTERVAL-001', 'Donor Demographics',
          `Only ${daysSince} days since last donation — minimum interval is ${minDays} days.`,
          `${remaining} more day${remaining === 1 ? '' : 's'}`);
      }
      return null;
    }
  },

  // ─── Same-day general health ─────────────────────────────────
  {
    id: 'DSG-HEALTH-001',
    category: 'General Health',
    description: 'Donor must feel well on the day of donation.',
    evaluate: (d) => d.generalHealth.feelingWellToday === 'no'
      ? temp('DSG-HEALTH-001', 'General Health',
          'Donor reports not feeling well today.',
          'Until donor feels well')
      : null
  },
  {
    id: 'DSG-HEALTH-002',
    category: 'General Health',
    description: 'Donor must report adequate sleep.',
    evaluate: (d) => d.generalHealth.adequateSleep === 'no'
      ? temp('DSG-HEALTH-002', 'General Health',
          'Inadequate sleep before donation.',
          'Until well rested')
      : null
  },
  {
    id: 'DSG-HEALTH-003',
    category: 'General Health',
    description: 'Donor must have eaten and drunk before donation.',
    evaluate: (d) => d.generalHealth.adequateMealAndFluids === 'no'
      ? temp('DSG-HEALTH-003', 'General Health',
          'Donor has not eaten or drunk adequately before donation.',
          'After meal and fluids')
      : null
  },
  {
    id: 'DSG-HEALTH-004',
    category: 'General Health',
    description: 'Donor must not feel faint or unwell.',
    evaluate: (d) => d.generalHealth.feelingFaintOrUnwell === 'yes'
      ? temp('DSG-HEALTH-004', 'General Health',
          'Donor feels faint or unwell at the session.',
          'Until well')
      : null
  },

  // ─── Medical history (permanent deferrals) ───────────────────
  {
    id: 'DSG-MED-001',
    category: 'Medical History',
    description: 'HIV positive — permanent deferral.',
    evaluate: (d) => d.medicalHistory.hivPositive === 'yes'
      ? perm('DSG-MED-001', 'Medical History', 'HIV positive — permanent deferral.')
      : null
  },
  {
    id: 'DSG-MED-002',
    category: 'Medical History',
    description: 'Hepatitis B or C — permanent deferral.',
    evaluate: (d) => d.medicalHistory.hepatitisBOrC === 'yes'
      ? perm('DSG-MED-002', 'Medical History', 'Hepatitis B or C history — permanent deferral.')
      : null
  },
  {
    id: 'DSG-MED-003',
    category: 'Medical History',
    description: 'HTLV positive — permanent deferral.',
    evaluate: (d) => d.medicalHistory.htlv === 'yes'
      ? perm('DSG-MED-003', 'Medical History', 'HTLV positive — permanent deferral.')
      : null
  },
  {
    id: 'DSG-MED-004',
    category: 'Medical History',
    description: 'Family history of CJD — permanent deferral.',
    evaluate: (d) => d.medicalHistory.cjdFamilyHistory === 'yes'
      ? perm('DSG-MED-004', 'Medical History', 'Family history of CJD — permanent deferral.')
      : null
  },
  {
    id: 'DSG-MED-005',
    category: 'Medical History',
    description: 'Recipient of human pituitary hormone — permanent deferral.',
    evaluate: (d) => d.medicalHistory.receivedPituitaryHormone === 'yes'
      ? perm('DSG-MED-005', 'Medical History', 'Received human pituitary hormone — vCJD risk, permanent deferral.')
      : null
  },
  {
    id: 'DSG-MED-006',
    category: 'Medical History',
    description: 'Dura mater graft recipient — permanent deferral.',
    evaluate: (d) => d.medicalHistory.receivedDuraMaterGraft === 'yes'
      ? perm('DSG-MED-006', 'Medical History', 'Dura mater graft recipient — vCJD risk, permanent deferral.')
      : null
  },
  {
    id: 'DSG-MED-007',
    category: 'Medical History',
    description: 'Bleeding or clotting disorder — permanent deferral.',
    evaluate: (d) => d.medicalHistory.bleedingOrClottingDisorder === 'yes'
      ? perm('DSG-MED-007', 'Medical History', 'Bleeding or clotting disorder — permanent deferral.')
      : null
  },
  {
    id: 'DSG-MED-008',
    category: 'Medical History',
    description: 'Insulin-treated diabetes — permanent deferral for whole blood.',
    evaluate: (d) => d.medicalHistory.diabetesOnInsulin === 'yes'
      ? perm('DSG-MED-008', 'Medical History', 'Insulin-treated diabetes — permanent deferral.')
      : null
  },
  {
    id: 'DSG-MED-009',
    category: 'Medical History',
    description: 'Heart or circulatory disease — clinician review.',
    evaluate: (d) => d.medicalHistory.heartOrCirculatoryDisease === 'yes'
      ? perm('DSG-MED-009', 'Medical History', 'Heart or circulatory disease — permanent deferral pending clinician review.')
      : null
  },
  {
    id: 'DSG-MED-010',
    category: 'Medical History',
    description: 'Active or recent malignancy — permanent deferral.',
    evaluate: (d) => d.medicalHistory.cancer === 'yes'
      ? perm('DSG-MED-010', 'Medical History', 'Cancer history — permanent deferral pending clinician review.')
      : null
  },
  {
    id: 'DSG-MED-011',
    category: 'Medical History',
    description: 'History of seizures or epilepsy — clinician review.',
    evaluate: (d) => d.medicalHistory.epilepsyOrSeizures === 'yes'
      ? temp('DSG-MED-011', 'Medical History',
          'History of seizures/epilepsy — deferred until 3 years seizure-free off treatment.',
          'Pending clinician review')
      : null
  },

  // ─── Recent illness & infections ─────────────────────────────
  {
    id: 'DSG-ILL-001',
    category: 'Recent Illness',
    description: 'Fever in the past 2 weeks.',
    evaluate: (d) => d.recentIllness.feverPastTwoWeeks === 'yes'
      ? temp('DSG-ILL-001', 'Recent Illness',
          'Fever in the past 2 weeks.',
          '14 days from resolution')
      : null
  },
  {
    id: 'DSG-ILL-002',
    category: 'Recent Illness',
    description: 'Active infection in the past 2 weeks.',
    evaluate: (d) => d.recentIllness.infectionPastTwoWeeks === 'yes'
      ? temp('DSG-ILL-002', 'Recent Illness',
          'Active infection in the past 2 weeks.',
          '14 days from resolution')
      : null
  },
  {
    id: 'DSG-ILL-003',
    category: 'Recent Illness',
    description: 'Antibiotics taken in the past 7 days.',
    evaluate: (d) => d.recentIllness.antibioticsPastSevenDays === 'yes'
      ? temp('DSG-ILL-003', 'Recent Illness',
          'Antibiotic course finished within the past 7 days.',
          '7 days post-course')
      : null
  },
  {
    id: 'DSG-ILL-004',
    category: 'Recent Illness',
    description: 'Dental work in the past week.',
    evaluate: (d) => d.recentIllness.dentalWorkPastWeek === 'yes'
      ? temp('DSG-ILL-004', 'Recent Illness',
          'Dental work in the past 7 days.',
          '24 h to 7 d depending on procedure')
      : null
  },
  {
    id: 'DSG-ILL-005',
    category: 'Recent Illness',
    description: 'Surgery in the past 6 months.',
    evaluate: (d) => d.recentIllness.surgeryPastSixMonths === 'yes'
      ? temp('DSG-ILL-005', 'Recent Illness',
          'Major surgery within the past 6 months.',
          'Until 6 months post-op and fully recovered')
      : null
  },
  {
    id: 'DSG-ILL-006',
    category: 'Recent Illness',
    description: 'COVID-19 positive in the past 28 days.',
    evaluate: (d) => d.recentIllness.covidPositivePastTwentyEightDays === 'yes'
      ? temp('DSG-ILL-006', 'Recent Illness',
          'COVID-19 positive within the past 28 days.',
          '28 days from positive test')
      : null
  },
  {
    id: 'DSG-ILL-007',
    category: 'Recent Illness',
    description: 'Vaccination in the past 4 weeks (live vaccine = 4 weeks; inactivated = none if well).',
    evaluate: (d) => d.recentIllness.vaccinationPastFourWeeks === 'yes'
      ? temp('DSG-ILL-007', 'Recent Illness',
          `Vaccination within the past 4 weeks${d.recentIllness.vaccinationDetails ? ' (' + d.recentIllness.vaccinationDetails + ')' : ''}.`,
          'Up to 28 days for live vaccines')
      : null
  },

  // ─── Travel history ──────────────────────────────────────────
  {
    id: 'DSG-TRAVEL-001',
    category: 'Travel History',
    description: 'Travel to malaria-risk area in past 12 months.',
    evaluate: (d) => d.travelHistory.malariaAreaPastTwelveMonths === 'yes'
      ? temp('DSG-TRAVEL-001', 'Travel History',
          'Travel to malaria-risk area in the past 12 months.',
          '6 to 12 months from return')
      : null
  },
  {
    id: 'DSG-TRAVEL-002',
    category: 'Travel History',
    description: 'Travel to West Nile virus area in past 28 days.',
    evaluate: (d) => d.travelHistory.westNileVirusAreaPastTwentyEightDays === 'yes'
      ? temp('DSG-TRAVEL-002', 'Travel History',
          'Travel to West Nile virus area in the past 28 days.',
          '28 days from return')
      : null
  },
  {
    id: 'DSG-TRAVEL-003',
    category: 'Travel History',
    description: 'Cumulative ≥ 12 months UK residence 1980-1996 — vCJD risk.',
    evaluate: (d) => d.travelHistory.ukResidence1980To1996Over12Months === 'yes'
      ? perm('DSG-TRAVEL-003', 'Travel History',
          'Cumulative ≥ 12 months UK residence between 1980 and 1996 — vCJD risk, permanent deferral in some jurisdictions.')
      : null
  },
  {
    id: 'DSG-TRAVEL-004',
    category: 'Travel History',
    description: 'Received a blood transfusion in the UK since 1980.',
    evaluate: (d) => d.travelHistory.bloodTransfusionInUk === 'yes'
      ? perm('DSG-TRAVEL-004', 'Travel History',
          'Received a blood transfusion in the UK since 1980 — permanent deferral.')
      : null
  },

  // ─── Lifestyle & risk behaviours ─────────────────────────────
  {
    id: 'DSG-LIFE-001',
    category: 'Lifestyle Risk',
    description: 'IV drug use ever — permanent deferral.',
    evaluate: (d) => d.lifestyleRisk.ivDrugUseEver === 'yes'
      ? perm('DSG-LIFE-001', 'Lifestyle Risk', 'IV drug use ever — permanent deferral.')
      : null
  },
  {
    id: 'DSG-LIFE-002',
    category: 'Lifestyle Risk',
    description: 'Sex with an IV drug user — 3 month deferral.',
    evaluate: (d) => d.lifestyleRisk.sexWithIvDrugUser === 'yes'
      ? temp('DSG-LIFE-002', 'Lifestyle Risk',
          'Sex with an IV drug user.',
          '3 months from last contact')
      : null
  },
  {
    id: 'DSG-LIFE-003',
    category: 'Lifestyle Risk',
    description: 'Sex in exchange for money or drugs in past 12 months.',
    evaluate: (d) => d.lifestyleRisk.sexInExchangePastTwelveMonths === 'yes'
      ? temp('DSG-LIFE-003', 'Lifestyle Risk',
          'Sex in exchange for money or drugs in past 12 months.',
          '12 months from last contact')
      : null
  },
  {
    id: 'DSG-LIFE-004',
    category: 'Lifestyle Risk',
    description: 'Sex with new partner in the past 3 months.',
    evaluate: (d) => d.lifestyleRisk.sexWithNewPartnerPastThreeMonths === 'yes'
      ? temp('DSG-LIFE-004', 'Lifestyle Risk',
          'Sex with new partner in the past 3 months.',
          '3 months from last contact')
      : null
  },
  {
    id: 'DSG-LIFE-005',
    category: 'Lifestyle Risk',
    description: 'Multiple sexual partners in the past 3 months.',
    evaluate: (d) => d.lifestyleRisk.multipleSexualPartnersPastThreeMonths === 'yes'
      ? temp('DSG-LIFE-005', 'Lifestyle Risk',
          'Multiple sexual partners in the past 3 months.',
          '3 months from last contact')
      : null
  },
  {
    id: 'DSG-LIFE-006',
    category: 'Lifestyle Risk',
    description: 'Tattoo or semi-permanent make-up in past 4 months.',
    evaluate: (d) => d.lifestyleRisk.tattooOrPiercingPastFourMonths === 'yes'
      ? temp('DSG-LIFE-006', 'Lifestyle Risk',
          'Tattoo or semi-permanent make-up in past 4 months.',
          '4 months from procedure')
      : null
  },
  {
    id: 'DSG-LIFE-007',
    category: 'Lifestyle Risk',
    description: 'Acupuncture in past 4 months (non-NHS).',
    evaluate: (d) => d.lifestyleRisk.acupuncturePastFourMonths === 'yes'
      ? temp('DSG-LIFE-007', 'Lifestyle Risk',
          'Non-NHS acupuncture in past 4 months.',
          '4 months from procedure')
      : null
  },
  {
    id: 'DSG-LIFE-008',
    category: 'Lifestyle Risk',
    description: 'Body or ear piercing in past 4 months.',
    evaluate: (d) => d.lifestyleRisk.bodyOrEarPiercingPastFourMonths === 'yes'
      ? temp('DSG-LIFE-008', 'Lifestyle Risk',
          'Body or ear piercing in past 4 months.',
          '4 months from procedure')
      : null
  },
  {
    id: 'DSG-LIFE-009',
    category: 'Lifestyle Risk',
    description: 'Incarcerated in past 12 months.',
    evaluate: (d) => d.lifestyleRisk.incarceratedPastTwelveMonths === 'yes'
      ? temp('DSG-LIFE-009', 'Lifestyle Risk',
          'Incarcerated in the past 12 months.',
          '12 months from release')
      : null
  },

  // ─── Pregnancy & transfusion ─────────────────────────────────
  {
    id: 'DSG-PREG-001',
    category: 'Pregnancy & Transfusion',
    description: 'Currently pregnant — defer until 6 months post-partum.',
    evaluate: (d) => d.pregnancyTransfusion.currentlyPregnant === 'yes'
      ? temp('DSG-PREG-001', 'Pregnancy & Transfusion',
          'Currently pregnant.',
          'Until 6 months post-partum')
      : null
  },
  {
    id: 'DSG-PREG-002',
    category: 'Pregnancy & Transfusion',
    description: 'Pregnancy in past 6 months.',
    evaluate: (d) => d.pregnancyTransfusion.pregnancyPastSixMonths === 'yes'
      ? temp('DSG-PREG-002', 'Pregnancy & Transfusion',
          'Pregnancy ended in past 6 months.',
          '6 months post-partum')
      : null
  },
  {
    id: 'DSG-PREG-003',
    category: 'Pregnancy & Transfusion',
    description: 'Currently breastfeeding.',
    evaluate: (d) => d.pregnancyTransfusion.breastfeeding === 'yes'
      ? temp('DSG-PREG-003', 'Pregnancy & Transfusion',
          'Currently breastfeeding — defer per JPAC guidance.',
          'Until breastfeeding has ceased')
      : null
  },
  {
    id: 'DSG-PREG-004',
    category: 'Pregnancy & Transfusion',
    description: 'Received a blood transfusion ever (in UK since 1980).',
    evaluate: (d) => d.pregnancyTransfusion.receivedTransfusionEver === 'yes'
      ? perm('DSG-PREG-004', 'Pregnancy & Transfusion',
          'Received a blood transfusion since 1980 — permanent deferral in UK.')
      : null
  },
  {
    id: 'DSG-PREG-005',
    category: 'Pregnancy & Transfusion',
    description: 'Received an organ transplant ever.',
    evaluate: (d) => d.pregnancyTransfusion.receivedTransplantEver === 'yes'
      ? perm('DSG-PREG-005', 'Pregnancy & Transfusion',
          'Received an organ or tissue transplant — permanent deferral.')
      : null
  },

  // ─── Vital signs ─────────────────────────────────────────────
  {
    id: 'DSG-VITAL-001',
    category: 'Vital Signs',
    description: 'Haemoglobin must be ≥ 13.5 g/dL (men) or ≥ 12.5 g/dL (women).',
    evaluate: (d) => {
      const hb = d.vitalSigns.hemoglobin;
      if (hb == null) return null;
      const sex = d.donorDemographics.sex;
      const min = sex === 'female' ? 12.5 : 13.5;
      if (hb < min) {
        return temp('DSG-VITAL-001', 'Vital Signs',
          `Haemoglobin ${hb} g/dL is below the ${min} g/dL minimum.`,
          'Until Hb meets minimum');
      }
      return null;
    }
  },
  {
    id: 'DSG-VITAL-002',
    category: 'Vital Signs',
    description: 'Systolic BP must be 100–180 mmHg.',
    evaluate: (d) => {
      const sbp = d.vitalSigns.systolicBp;
      if (sbp == null) return null;
      if (sbp < 100 || sbp > 180) {
        return temp('DSG-VITAL-002', 'Vital Signs',
          `Systolic BP ${sbp} mmHg is outside 100–180 mmHg.`,
          'Until BP within range');
      }
      return null;
    }
  },
  {
    id: 'DSG-VITAL-003',
    category: 'Vital Signs',
    description: 'Diastolic BP must be 60–100 mmHg.',
    evaluate: (d) => {
      const dbp = d.vitalSigns.diastolicBp;
      if (dbp == null) return null;
      if (dbp < 60 || dbp > 100) {
        return temp('DSG-VITAL-003', 'Vital Signs',
          `Diastolic BP ${dbp} mmHg is outside 60–100 mmHg.`,
          'Until BP within range');
      }
      return null;
    }
  },
  {
    id: 'DSG-VITAL-004',
    category: 'Vital Signs',
    description: 'Pulse must be 50–100 bpm and regular.',
    evaluate: (d) => {
      const p = d.vitalSigns.pulseBpm;
      if (p == null) return null;
      if (p < 50 || p > 100) {
        return temp('DSG-VITAL-004', 'Vital Signs',
          `Pulse ${p} bpm is outside 50–100 bpm.`,
          'Until pulse within range');
      }
      return null;
    }
  },
  {
    id: 'DSG-VITAL-005',
    category: 'Vital Signs',
    description: 'Temperature must be ≤ 37.5 °C.',
    evaluate: (d) => {
      const t = d.vitalSigns.temperatureCelsius;
      if (t == null) return null;
      if (t > 37.5) {
        return temp('DSG-VITAL-005', 'Vital Signs',
          `Temperature ${t} °C is above 37.5 °C — defer until afebrile.`,
          'Until afebrile + 14 days');
      }
      return null;
    }
  },

  // ─── Informed consent ────────────────────────────────────────
  {
    id: 'DSG-CONS-001',
    category: 'Informed Consent',
    description: 'Donor must understand the donation information.',
    evaluate: (d) => d.informedConsent.understoodInformation === 'no'
      ? temp('DSG-CONS-001', 'Informed Consent',
          'Donor has not confirmed understanding of donation information.',
          'Until counselled')
      : null
  },
  {
    id: 'DSG-CONS-002',
    category: 'Informed Consent',
    description: 'Donor must consent to donation.',
    evaluate: (d) => d.informedConsent.consentToDonate === 'no'
      ? temp('DSG-CONS-002', 'Informed Consent',
          'Donor has not consented to donate.',
          'Until consent given')
      : null
  },
  {
    id: 'DSG-CONS-003',
    category: 'Informed Consent',
    description: 'Donor must consent to mandatory infection testing.',
    evaluate: (d) => d.informedConsent.consentToTesting === 'no'
      ? perm('DSG-CONS-003', 'Informed Consent',
          'Donor refuses mandatory infection testing — cannot donate.')
      : null
  }
];

export { dsgRules };
