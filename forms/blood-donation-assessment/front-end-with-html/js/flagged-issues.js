import { calculateAgeYears } from './types.js';

// Flagged-issue detection. Independent of overall eligibility status,
// this module raises clinician-facing flags for under-weight donors,
// abnormal vital signs, multiple recent deferrable exposures, missing
// consent items and other conditions that warrant clinician attention.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

// Wrapped in an IIFE; published via window.BloodDonationAssessment.

/**
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // ─── Donor demographics ───────────────────────────────────
  const age = calculateAgeYears(data.donorDemographics.dateOfBirth);
  if (age != null && age < 17) {
    flags.push({
      id: 'FLAG-AGE-001',
      category: 'Donor Demographics',
      message: `Donor under 17 (${age} y) — minimum donation age not met.`,
      priority: 'urgent'
    });
  }
  if (age != null && age >= 65 && data.donorDemographics.donorType === 'first-time') {
    flags.push({
      id: 'FLAG-AGE-002',
      category: 'Donor Demographics',
      message: 'First-time donor over 65 — clinician approval required.',
      priority: 'high'
    });
  }
  if (data.donorDemographics.weight != null && data.donorDemographics.weight < 50) {
    flags.push({
      id: 'FLAG-WEIGHT-001',
      category: 'Donor Demographics',
      message: `Weight ${data.donorDemographics.weight} kg below 50 kg minimum.`,
      priority: 'high'
    });
  }

  // ─── General health ───────────────────────────────────────
  if (data.generalHealth.feelingFaintOrUnwell === 'yes') {
    flags.push({
      id: 'FLAG-HEALTH-001',
      category: 'General Health',
      message: 'Donor reports feeling faint or unwell — do not draw.',
      priority: 'urgent'
    });
  }
  if (data.generalHealth.feelingWellToday === 'no') {
    flags.push({
      id: 'FLAG-HEALTH-002',
      category: 'General Health',
      message: 'Donor reports not feeling well today.',
      priority: 'high'
    });
  }

  // ─── High-risk medical history ────────────────────────────
  if (data.medicalHistory.hivPositive === 'yes' ||
      data.medicalHistory.hepatitisBOrC === 'yes' ||
      data.medicalHistory.htlv === 'yes') {
    flags.push({
      id: 'FLAG-MED-INF-001',
      category: 'Medical History',
      message: 'Self-reported transfusion-transmissible infection — permanent deferral and counselling required.',
      priority: 'urgent'
    });
  }
  if (data.medicalHistory.cjdFamilyHistory === 'yes' ||
      data.medicalHistory.receivedPituitaryHormone === 'yes' ||
      data.medicalHistory.receivedDuraMaterGraft === 'yes') {
    flags.push({
      id: 'FLAG-MED-CJD-001',
      category: 'Medical History',
      message: 'vCJD risk factor disclosed — permanent deferral.',
      priority: 'high'
    });
  }
  if (data.medicalHistory.bleedingOrClottingDisorder === 'yes') {
    flags.push({
      id: 'FLAG-MED-BLEED-001',
      category: 'Medical History',
      message: 'Bleeding/clotting disorder — donation contraindicated.',
      priority: 'high'
    });
  }
  if (data.medicalHistory.cancer === 'yes') {
    flags.push({
      id: 'FLAG-MED-CA-001',
      category: 'Medical History',
      message: 'Cancer history — clinician review required.',
      priority: 'high'
    });
  }
  if (data.medicalHistory.heartOrCirculatoryDisease === 'yes') {
    flags.push({
      id: 'FLAG-MED-CV-001',
      category: 'Medical History',
      message: 'Heart or circulatory disease — clinician review required.',
      priority: 'high'
    });
  }
  if (data.medicalHistory.diabetesOnInsulin === 'yes') {
    flags.push({
      id: 'FLAG-MED-DM-001',
      category: 'Medical History',
      message: 'Insulin-treated diabetes — donation contraindicated.',
      priority: 'medium'
    });
  }
  if (data.medicalHistory.currentMedications.length > 0) {
    flags.push({
      id: 'FLAG-MED-RX-001',
      category: 'Medical History',
      message: `${data.medicalHistory.currentMedications.length} current medication(s) reported — review against JPAC medication index.`,
      priority: 'medium'
    });
  }

  // ─── Recent illness ───────────────────────────────────────
  if (data.recentIllness.feverPastTwoWeeks === 'yes' ||
      data.recentIllness.infectionPastTwoWeeks === 'yes') {
    flags.push({
      id: 'FLAG-ILL-001',
      category: 'Recent Illness',
      message: 'Recent febrile / infectious illness — defer.',
      priority: 'high'
    });
  }
  if (data.recentIllness.covidPositivePastTwentyEightDays === 'yes') {
    flags.push({
      id: 'FLAG-ILL-COVID-001',
      category: 'Recent Illness',
      message: 'COVID-19 positive within 28 days.',
      priority: 'high'
    });
  }
  if (data.recentIllness.surgeryPastSixMonths === 'yes') {
    flags.push({
      id: 'FLAG-ILL-SURG-001',
      category: 'Recent Illness',
      message: 'Surgery within past 6 months — defer until fully recovered.',
      priority: 'medium'
    });
  }

  // ─── Travel ───────────────────────────────────────────────
  if (data.travelHistory.malariaAreaPastTwelveMonths === 'yes') {
    flags.push({
      id: 'FLAG-TRAVEL-001',
      category: 'Travel History',
      message: 'Travel to malaria-risk area within 12 months — DSG deferral.',
      priority: 'high'
    });
  }
  if (data.travelHistory.westNileVirusAreaPastTwentyEightDays === 'yes') {
    flags.push({
      id: 'FLAG-TRAVEL-002',
      category: 'Travel History',
      message: 'Travel to West Nile virus area within 28 days — DSG deferral.',
      priority: 'high'
    });
  }
  if (data.travelHistory.ukResidence1980To1996Over12Months === 'yes') {
    flags.push({
      id: 'FLAG-TRAVEL-VCJD-001',
      category: 'Travel History',
      message: 'UK residence ≥ 12 months between 1980-1996 — vCJD risk.',
      priority: 'high'
    });
  }
  if (data.travelHistory.bloodTransfusionInUk === 'yes') {
    flags.push({
      id: 'FLAG-TRAVEL-TX-001',
      category: 'Travel History',
      message: 'Received UK blood transfusion since 1980 — permanent deferral.',
      priority: 'urgent'
    });
  }

  // ─── Lifestyle risk ───────────────────────────────────────
  if (data.lifestyleRisk.ivDrugUseEver === 'yes') {
    flags.push({
      id: 'FLAG-LIFE-IVDU-001',
      category: 'Lifestyle Risk',
      message: 'IV drug use ever — permanent deferral.',
      priority: 'urgent'
    });
  }
  const sexualRiskCount = [
    data.lifestyleRisk.sexWithIvDrugUser,
    data.lifestyleRisk.sexInExchangePastTwelveMonths,
    data.lifestyleRisk.sexWithNewPartnerPastThreeMonths,
    data.lifestyleRisk.multipleSexualPartnersPastThreeMonths
  ].filter((v) => v === 'yes').length;
  if (sexualRiskCount > 0) {
    flags.push({
      id: 'FLAG-LIFE-SEX-001',
      category: 'Lifestyle Risk',
      message: `${sexualRiskCount} recent sexual-risk exposure(s) — review individual donor risk assessment (IDRA).`,
      priority: 'high'
    });
  }
  if (data.lifestyleRisk.tattooOrPiercingPastFourMonths === 'yes' ||
      data.lifestyleRisk.bodyOrEarPiercingPastFourMonths === 'yes' ||
      data.lifestyleRisk.acupuncturePastFourMonths === 'yes') {
    flags.push({
      id: 'FLAG-LIFE-SKIN-001',
      category: 'Lifestyle Risk',
      message: 'Recent skin-piercing procedure — 4-month deferral.',
      priority: 'medium'
    });
  }
  if (data.lifestyleRisk.incarceratedPastTwelveMonths === 'yes') {
    flags.push({
      id: 'FLAG-LIFE-INC-001',
      category: 'Lifestyle Risk',
      message: 'Incarceration within past 12 months — 12-month deferral.',
      priority: 'medium'
    });
  }

  // ─── Pregnancy / transfusion ──────────────────────────────
  if (data.pregnancyTransfusion.currentlyPregnant === 'yes') {
    flags.push({
      id: 'FLAG-PREG-001',
      category: 'Pregnancy & Transfusion',
      message: 'Currently pregnant — donation contraindicated.',
      priority: 'urgent'
    });
  }
  if (data.pregnancyTransfusion.pregnancyPastSixMonths === 'yes') {
    flags.push({
      id: 'FLAG-PREG-002',
      category: 'Pregnancy & Transfusion',
      message: 'Pregnancy in past 6 months — defer until 6 months post-partum.',
      priority: 'high'
    });
  }
  if (data.pregnancyTransfusion.breastfeeding === 'yes') {
    flags.push({
      id: 'FLAG-PREG-003',
      category: 'Pregnancy & Transfusion',
      message: 'Currently breastfeeding — JPAC deferral.',
      priority: 'medium'
    });
  }
  if (data.pregnancyTransfusion.receivedTransfusionEver === 'yes') {
    flags.push({
      id: 'FLAG-PREG-TX-001',
      category: 'Pregnancy & Transfusion',
      message: 'Prior blood transfusion (UK) — permanent deferral.',
      priority: 'urgent'
    });
  }
  if (data.pregnancyTransfusion.receivedTransplantEver === 'yes') {
    flags.push({
      id: 'FLAG-PREG-TR-001',
      category: 'Pregnancy & Transfusion',
      message: 'Prior organ/tissue transplant — permanent deferral.',
      priority: 'urgent'
    });
  }

  // ─── Vital signs ──────────────────────────────────────────
  const sex = data.donorDemographics.sex;
  const hb = data.vitalSigns.hemoglobin;
  if (hb != null) {
    const min = sex === 'female' ? 12.5 : 13.5;
    if (hb < min) {
      flags.push({
        id: 'FLAG-VITAL-HB-001',
        category: 'Vital Signs',
        message: `Haemoglobin ${hb} g/dL below ${min} g/dL minimum.`,
        priority: 'high'
      });
    } else if (hb < min + 0.5) {
      flags.push({
        id: 'FLAG-VITAL-HB-002',
        category: 'Vital Signs',
        message: `Haemoglobin ${hb} g/dL is borderline.`,
        priority: 'low'
      });
    }
  }
  const sbp = data.vitalSigns.systolicBp;
  const dbp = data.vitalSigns.diastolicBp;
  if (sbp != null && (sbp < 100 || sbp > 180)) {
    flags.push({
      id: 'FLAG-VITAL-BP-001',
      category: 'Vital Signs',
      message: `Systolic BP ${sbp} mmHg outside 100–180 mmHg.`,
      priority: 'high'
    });
  }
  if (dbp != null && (dbp < 60 || dbp > 100)) {
    flags.push({
      id: 'FLAG-VITAL-BP-002',
      category: 'Vital Signs',
      message: `Diastolic BP ${dbp} mmHg outside 60–100 mmHg.`,
      priority: 'high'
    });
  }
  const pulse = data.vitalSigns.pulseBpm;
  if (pulse != null && (pulse < 50 || pulse > 100)) {
    flags.push({
      id: 'FLAG-VITAL-P-001',
      category: 'Vital Signs',
      message: `Pulse ${pulse} bpm outside 50–100 bpm.`,
      priority: 'high'
    });
  }
  const temp = data.vitalSigns.temperatureCelsius;
  if (temp != null && temp > 37.5) {
    flags.push({
      id: 'FLAG-VITAL-T-001',
      category: 'Vital Signs',
      message: `Temperature ${temp} °C above 37.5 °C — defer.`,
      priority: 'high'
    });
  }

  // ─── Informed consent ─────────────────────────────────────
  if (data.informedConsent.consentToTesting === 'no') {
    flags.push({
      id: 'FLAG-CONS-001',
      category: 'Informed Consent',
      message: 'Donor refuses mandatory infection testing — cannot donate.',
      priority: 'urgent'
    });
  }
  if (data.informedConsent.understoodInformation === 'no') {
    flags.push({
      id: 'FLAG-CONS-002',
      category: 'Informed Consent',
      message: 'Donor has not confirmed understanding — counselling required.',
      priority: 'medium'
    });
  }
  if (data.informedConsent.consentToDonate === 'no') {
    flags.push({
      id: 'FLAG-CONS-003',
      category: 'Informed Consent',
      message: 'Donor has not consented to donate.',
      priority: 'medium'
    });
  }

  // Sort: urgent > high > medium > low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
