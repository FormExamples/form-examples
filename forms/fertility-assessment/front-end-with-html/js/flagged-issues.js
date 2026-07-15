import { ageInYears } from './types.js';

// Flagged-issue detection for the Fertility Assessment.
//
// Independent of the concern-level score (which the grader computes), this
// module raises clinician-facing flags for urgent referral indications,
// abnormal hormone results, severe semen abnormalities, modifiable
// lifestyle factors, and prior pelvic disease.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // ─── Urgent referral indications ──────────────────────────
  const femaleAge = ageInYears(data.demographics.patientDateOfBirth);
  if (femaleAge !== null && femaleAge >= 40) {
    flags.push({
      id: 'FLAG-AGE-001',
      category: 'Age',
      message: `Female partner age ${femaleAge} — significant age-related fertility decline; urgent specialist referral.`,
      priority: 'urgent'
    });
  } else if (femaleAge !== null && femaleAge >= 36) {
    flags.push({
      id: 'FLAG-AGE-002',
      category: 'Age',
      message: `Female partner age ${femaleAge} — earlier referral threshold (NICE CG156: refer after 6 months).`,
      priority: 'high'
    });
  }

  if (data.menstrualCycle.cycleRegularity === 'absent') {
    flags.push({
      id: 'FLAG-CYC-001',
      category: 'Menstrual Cycle',
      message: 'Amenorrhoea — investigate hypothalamic, pituitary, ovarian or uterine cause.',
      priority: 'high'
    });
  }

  if (
    data.reproductiveHistory.priorMiscarriages !== null &&
    data.reproductiveHistory.priorMiscarriages >= 3
  ) {
    flags.push({
      id: 'FLAG-RH-001',
      category: 'Reproductive History',
      message: `Recurrent pregnancy loss (${data.reproductiveHistory.priorMiscarriages} miscarriages) — recurrent miscarriage clinic referral.`,
      priority: 'high'
    });
  }

  // ─── Ovarian reserve ──────────────────────────────────────
  if (data.hormoneProfile.amh !== null && data.hormoneProfile.amh < 5.4) {
    flags.push({
      id: 'FLAG-OR-001',
      category: 'Ovarian Reserve',
      message: `AMH ${data.hormoneProfile.amh} pmol/L — low ovarian reserve; consider expedited ART.`,
      priority: 'high'
    });
  }

  if (data.hormoneProfile.fsh !== null && data.hormoneProfile.fsh > 8.9) {
    flags.push({
      id: 'FLAG-OR-002',
      category: 'Ovarian Reserve',
      message: `Day-2/3 FSH ${data.hormoneProfile.fsh} IU/L — reduced ovarian reserve.`,
      priority: 'high'
    });
  }

  if (
    data.investigations.antralFollicleCount !== null &&
    data.investigations.antralFollicleCount < 7
  ) {
    flags.push({
      id: 'FLAG-OR-003',
      category: 'Ovarian Reserve',
      message: `Antral follicle count ${data.investigations.antralFollicleCount} — low ovarian reserve.`,
      priority: 'high'
    });
  }

  // ─── Endocrine ────────────────────────────────────────────
  if (data.hormoneProfile.prolactin !== null && data.hormoneProfile.prolactin > 500) {
    flags.push({
      id: 'FLAG-HOR-001',
      category: 'Endocrine',
      message: `Prolactin ${data.hormoneProfile.prolactin} mIU/L — hyperprolactinaemia; consider pituitary imaging.`,
      priority: 'high'
    });
  }

  if (
    data.hormoneProfile.tsh !== null &&
    (data.hormoneProfile.tsh < 0.4 || data.hormoneProfile.tsh > 2.5)
  ) {
    flags.push({
      id: 'FLAG-HOR-002',
      category: 'Endocrine',
      message: `TSH ${data.hormoneProfile.tsh} mIU/L outside fertility-optimal 0.4-2.5; treat thyroid dysfunction.`,
      priority: 'medium'
    });
  }

  if (
    data.hormoneProfile.progesteroneDay21 !== null &&
    data.hormoneProfile.progesteroneDay21 < 30
  ) {
    flags.push({
      id: 'FLAG-HOR-003',
      category: 'Endocrine',
      message: `Day-21 progesterone ${data.hormoneProfile.progesteroneDay21} nmol/L — likely anovulation.`,
      priority: 'high'
    });
  }

  // ─── Semen analysis (WHO 2021 LRLs) ───────────────────────
  if (data.partnerSemen.semenAnalysisDone === 'yes') {
    const v = data.partnerSemen.semenVolumeMl;
    const c = data.partnerSemen.semenConcentrationMillionPerMl;
    const tm = data.partnerSemen.semenTotalMotilityPercent;
    const pm = data.partnerSemen.semenProgressiveMotilityPercent;
    const morph = data.partnerSemen.semenNormalMorphologyPercent;

    if (c !== null && c < 5) {
      flags.push({
        id: 'FLAG-SEM-001',
        category: 'Semen Analysis',
        message: `Severe oligozoospermia (${c} million/mL) — likely ICSI indicated.`,
        priority: 'urgent'
      });
    } else if (c !== null && c < 16) {
      flags.push({
        id: 'FLAG-SEM-002',
        category: 'Semen Analysis',
        message: `Oligozoospermia: concentration ${c} million/mL below WHO 2021 LRL (16).`,
        priority: 'high'
      });
    }

    if (tm !== null && tm < 42) {
      flags.push({
        id: 'FLAG-SEM-003',
        category: 'Semen Analysis',
        message: `Asthenozoospermia: total motility ${tm}% below WHO 2021 LRL (42).`,
        priority: 'high'
      });
    }

    if (pm !== null && pm < 30) {
      flags.push({
        id: 'FLAG-SEM-004',
        category: 'Semen Analysis',
        message: `Progressive motility ${pm}% below WHO 2021 LRL (30).`,
        priority: 'medium'
      });
    }

    if (morph !== null && morph < 4) {
      flags.push({
        id: 'FLAG-SEM-005',
        category: 'Semen Analysis',
        message: `Teratozoospermia: normal morphology ${morph}% below WHO 2021 LRL (4).`,
        priority: 'high'
      });
    }

    if (v !== null && v < 1.4) {
      flags.push({
        id: 'FLAG-SEM-006',
        category: 'Semen Analysis',
        message: `Semen volume ${v} mL below WHO 2021 LRL (1.4).`,
        priority: 'medium'
      });
    }
  } else {
    flags.push({
      id: 'FLAG-SEM-000',
      category: 'Semen Analysis',
      message: 'Semen analysis not yet completed — arrange WHO 2021 standardised analysis.',
      priority: 'medium'
    });
  }

  // ─── Pelvic / surgical history ────────────────────────────
  if (data.medicalSurgicalHistory.pelvicInflammatoryDisease === 'yes') {
    flags.push({
      id: 'FLAG-PEL-001',
      category: 'Pelvic History',
      message: 'Prior pelvic inflammatory disease — assess tubal patency.',
      priority: 'high'
    });
  }

  if (data.medicalSurgicalHistory.endometriosis === 'yes') {
    flags.push({
      id: 'FLAG-PEL-002',
      category: 'Pelvic History',
      message: 'Endometriosis — may impair fertility; consider laparoscopy.',
      priority: 'medium'
    });
  }

  if (data.medicalSurgicalHistory.polycysticOvarySyndrome === 'yes') {
    flags.push({
      id: 'FLAG-PEL-003',
      category: 'Pelvic History',
      message: 'PCOS — manage weight, consider ovulation induction (clomifene/letrozole).',
      priority: 'medium'
    });
  }

  if (data.reproductiveHistory.priorEctopic !== null && data.reproductiveHistory.priorEctopic >= 1) {
    flags.push({
      id: 'FLAG-RH-002',
      category: 'Reproductive History',
      message: `Prior ectopic pregnancy (${data.reproductiveHistory.priorEctopic}) — assess tubal patency.`,
      priority: 'high'
    });
  }

  // ─── Tubal investigations ─────────────────────────────────
  if (
    data.investigations.hysterosalpingogramDone === 'yes' &&
    data.investigations.hysterosalpingogramResult === 'abnormal'
  ) {
    flags.push({
      id: 'FLAG-TUB-001',
      category: 'Tubal',
      message: 'Abnormal hysterosalpingogram — tubal factor; consider IVF.',
      priority: 'high'
    });
  }

  // ─── BMI ──────────────────────────────────────────────────
  if (data.lifestyleFactors.bmi !== null && data.lifestyleFactors.bmi >= 35) {
    flags.push({
      id: 'FLAG-BMI-001',
      category: 'Lifestyle',
      message: `BMI ${data.lifestyleFactors.bmi} — NICE recommends weight loss before NHS-funded ART.`,
      priority: 'high'
    });
  } else if (data.lifestyleFactors.bmi !== null && data.lifestyleFactors.bmi >= 30) {
    flags.push({
      id: 'FLAG-BMI-002',
      category: 'Lifestyle',
      message: `BMI ${data.lifestyleFactors.bmi} — obesity reduces fertility; weight management advised.`,
      priority: 'medium'
    });
  } else if (data.lifestyleFactors.bmi !== null && data.lifestyleFactors.bmi < 19) {
    flags.push({
      id: 'FLAG-BMI-003',
      category: 'Lifestyle',
      message: `BMI ${data.lifestyleFactors.bmi} — underweight may impair ovulation.`,
      priority: 'medium'
    });
  }

  // ─── Modifiable lifestyle ─────────────────────────────────
  if (data.lifestyleFactors.tobaccoStatus === 'current') {
    flags.push({
      id: 'FLAG-LIFE-001',
      category: 'Lifestyle',
      message: 'Patient currently smokes — strongly advise cessation prior to conception or ART.',
      priority: 'high'
    });
  }

  if (data.partnerSemen.partnerSmoking === 'current') {
    flags.push({
      id: 'FLAG-LIFE-002',
      category: 'Partner Lifestyle',
      message: 'Male partner currently smokes — advise cessation; impairs sperm quality.',
      priority: 'medium'
    });
  }

  if (data.lifestyleFactors.alcoholLevel === 'heavy') {
    flags.push({
      id: 'FLAG-LIFE-003',
      category: 'Lifestyle',
      message: 'Heavy alcohol intake — advise reduction to within UK low-risk limits.',
      priority: 'medium'
    });
  }

  if (data.lifestyleFactors.recreationalDrugs === 'yes') {
    flags.push({
      id: 'FLAG-LIFE-004',
      category: 'Lifestyle',
      message: 'Recreational drug use — advise cessation.',
      priority: 'high'
    });
  }

  // ─── Folic acid ───────────────────────────────────────────
  if (data.medicationsSupplements.folicAcid !== 'yes') {
    flags.push({
      id: 'FLAG-SUPP-001',
      category: 'Supplements',
      message: 'Pre-conception folic acid not confirmed — advise 400 mcg daily (5 mg if higher risk).',
      priority: 'low'
    });
  }

  // ─── Cancer history ───────────────────────────────────────
  if (data.medicalSurgicalHistory.cancerHistory === 'yes') {
    flags.push({
      id: 'FLAG-CAN-001',
      category: 'Medical History',
      message: 'Cancer treatment history — review fertility-preservation options and gonadotoxic exposure.',
      priority: 'high'
    });
  }

  // Sort: urgent > high > medium > low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
