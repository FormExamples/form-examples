// The eight optimization domains: thresholds, interventions, and lead times.
//
// This module is the single source of truth for what triggers each domain and
// how many weeks before surgery the intervention needs. The clinical
// justification for every number lives in ../../doc/optimization-domains.md;
// the two must not diverge.
//
// Every function here is pure.

/** Coerce a possibly-empty numeric field to a number or null. */
function num(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Round to one decimal place. */
function round1(n) {
  return Math.round(n * 10) / 10;
}

/** Build a fired-rule record. */
function rule(ruleId, domain, description) {
  return { ruleId, domain, description };
}

/** The domain keys, in the order they are reported. */
const DOMAIN_ORDER = [
  'anaemia',
  'glycaemic-control',
  'smoking',
  'alcohol',
  'nutrition',
  'physical-fitness',
  'medication',
  'cardiorespiratory'
];

/** Display labels for the domains. */
const DOMAIN_LABELS = {
  'anaemia': 'Anaemia and iron deficiency',
  'glycaemic-control': 'Glycaemic control',
  'smoking': 'Smoking',
  'alcohol': 'Alcohol',
  'nutrition': 'Nutrition',
  'physical-fitness': 'Physical fitness',
  'medication': 'Medication',
  'cardiorespiratory': 'Cardiorespiratory'
};

// ----------------------------------------------------------------------
// Derived instrument scores
// ----------------------------------------------------------------------

/** Body mass index from height and weight, or null. */
function computeBmi(data) {
  const h = num(data.nutrition.heightAsCm);
  const w = num(data.nutrition.weightAsKg);
  if (h === null || w === null || h <= 0) return null;
  const m = h / 100;
  return round1(w / (m * m));
}

/** Percentage unintentional weight loss against the usual weight, or null. */
function computeWeightLossPercent(data) {
  const current = num(data.nutrition.weightAsKg);
  const usual = num(data.nutrition.usualWeightAsKg);
  if (current === null || usual === null || usual <= 0) return null;
  return round1(((usual - current) / usual) * 100);
}

/**
 * MUST total, 0 to 6, exactly as in the sibling nutrition forms:
 * BMI score + unplanned weight-loss score + acute disease effect.
 */
function computeMustScore(data) {
  const bmi = computeBmi(data);
  const pct = computeWeightLossPercent(data);

  let bmiScore = null;
  if (bmi !== null) bmiScore = bmi < 18.5 ? 2 : bmi <= 20.0 ? 1 : 0;

  let lossScore = null;
  if (pct !== null) {
    lossScore = data.nutrition.weightLossIsIntentional === 'yes'
      ? 0
      : pct > 10 ? 2 : pct >= 5 ? 1 : 0;
  }

  const acuteScore =
    data.nutrition.acutelyIll === 'yes' &&
    data.nutrition.noNutritionalIntakeOver5Days === 'yes'
      ? 2
      : 0;

  if (bmiScore === null && lossScore === null && acuteScore === 0) return null;
  return (bmiScore ?? 0) + (lossScore ?? 0) + acuteScore;
}

/** MUST risk category from the total. */
function mustRisk(total) {
  if (total === null) return '';
  if (total === 0) return 'low';
  if (total === 1) return 'medium';
  return 'high';
}

/** AUDIT-C total, 0 to 12, or null when no component is answered. */
function computeAuditCScore(data) {
  const parts = [
    num(data.alcohol.auditCFrequency),
    num(data.alcohol.auditCTypicalQuantity),
    num(data.alcohol.auditCBingeFrequency)
  ];
  if (parts.every((p) => p === null)) return null;
  return parts.reduce((sum, p) => sum + (p ?? 0), 0);
}

/**
 * Fried Frailty Phenotype (Fried et al. 2001). Five yes/no criteria; score =
 * count met. 0 = robust, 1-2 = pre-frail, 3-5 = frail. Returns
 * { score: null, category: '' } when no criterion has been answered.
 */
function computeFriedPhenotypeScore(data) {
  const f = data.frailty;
  const criteria = [
    f.friedWeakness,
    f.friedSlowness,
    f.friedLowPhysicalActivity,
    f.friedExhaustion,
    f.friedUnintentionalWeightLoss
  ];
  if (criteria.every((c) => c === '')) return { score: null, category: '' };

  const score = criteria.filter((c) => c === 'yes').length;
  const category = score === 0 ? 'robust' : score <= 2 ? 'pre-frail' : 'frail';
  return { score, category };
}

// ----------------------------------------------------------------------
// Domain evaluators
//
// Each returns { triggered, leadTimeWeeks, started, ruleId, finding,
// intervention, applicable }.
// ----------------------------------------------------------------------

function evaluateAnaemia(data) {
  const hb = num(data.anaemia.haemoglobinGPerL);
  const ferritin = num(data.anaemia.ferritinUgPerL);
  const tsat = num(data.anaemia.transferrinSaturationPercent);
  const sex = data.patient.sex;

  // Intravenous iron works in 4 weeks; oral needs 8.
  const leadTimeWeeks = data.anaemia.anaemiaTreatmentRoute === 'intravenous' ? 4 : 8;
  const started = data.anaemia.anaemiaTreatmentStarted === 'yes';

  if (hb !== null && hb < 80) {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-ANAEMIA-5',
      finding: `Haemoglobin ${hb} g/L is below 80 — severe anaemia.`,
      intervention: 'Urgent haematology review and iron replacement; consider transfusion. Surgery is normally deferred.'
    };
  }
  if (sex === 'male' && hb !== null && hb < 130) {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-ANAEMIA-1',
      finding: `Haemoglobin ${hb} g/L is below the WHO threshold of 130 g/L for men.`,
      intervention: 'Investigate the cause and start iron replacement.'
    };
  }
  if (sex === 'female' && hb !== null && hb < 120) {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-ANAEMIA-2',
      finding: `Haemoglobin ${hb} g/L is below the WHO threshold of 120 g/L for women.`,
      intervention: 'Investigate the cause and start iron replacement.'
    };
  }
  if (ferritin !== null && ferritin < 30) {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-ANAEMIA-3',
      finding: `Ferritin ${ferritin} µg/L is below 30 — absolute iron deficiency.`,
      intervention: 'Start iron replacement and investigate the cause; iron deficiency in an adult may indicate gastrointestinal blood loss.'
    };
  }
  if (ferritin !== null && ferritin >= 30 && ferritin <= 100 && tsat !== null && tsat < 20) {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-ANAEMIA-4',
      finding: `Ferritin ${ferritin} µg/L with transferrin saturation ${tsat}% — functional iron deficiency.`,
      intervention: 'Start iron replacement; consider the intravenous route where absorption is impaired.'
    };
  }
  return { triggered: false, applicable: true, leadTimeWeeks, started, ruleId: '', finding: '', intervention: '' };
}

function evaluateGlycaemicControl(data) {
  const hba1c = num(data.glycaemic.hba1cMmolPerMol);
  const leadTimeWeeks = 12;
  const started = data.glycaemic.diabetesTeamReview === 'yes';

  // The domain applies when the patient has diabetes or a raised HbA1c.
  const hasDiabetes = data.glycaemic.diabetesType !== '' && data.glycaemic.diabetesType !== 'none';
  const applicable = hasDiabetes || hba1c !== null;

  if (hba1c !== null && hba1c >= 69) {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-GLYC-2',
      finding: `HbA1c ${hba1c} mmol/mol is at or above the CPOC deferral threshold of 69 mmol/mol (8.5%).`,
      intervention: 'Diabetes-team review and medication adjustment. Surgery is normally deferred until glycaemia improves.'
    };
  }
  if (hba1c !== null && hba1c >= 48) {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-GLYC-1',
      finding: `HbA1c ${hba1c} mmol/mol is at or above the optimization threshold of 48 mmol/mol.`,
      intervention: 'Diabetes-team review, medication adjustment, and structured education.'
    };
  }
  return { triggered: false, applicable, leadTimeWeeks, started, ruleId: '', finding: '', intervention: '' };
}

function evaluateSmoking(data) {
  const leadTimeWeeks = 4;
  const started = data.smoking.smokingCessationAccepted === 'yes';
  const applicable = data.smoking.smokingStatus !== '' && data.smoking.smokingStatus !== 'never';

  if (data.smoking.smokingStatus === 'current') {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-SMOKE-1',
      finding: 'The patient currently smokes.',
      intervention: 'Very brief advice, referral to a stop-smoking service, and nicotine replacement therapy. Four weeks of abstinence measurably reduces respiratory complications.'
    };
  }
  return { triggered: false, applicable, leadTimeWeeks, started, ruleId: '', finding: '', intervention: '' };
}

function evaluateAlcohol(data) {
  const units = num(data.alcohol.alcoholUnitsPerWeek);
  const auditC = computeAuditCScore(data);
  const sex = data.patient.sex;
  const leadTimeWeeks = 4;
  const started = data.alcohol.alcoholReductionPlanAgreed === 'yes';

  if (auditC !== null && auditC >= 8) {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-ALCOHOL-4',
      finding: `AUDIT-C score ${auditC} indicates a high level of drinking, with a risk of withdrawal in hospital.`,
      intervention: 'Referral to alcohol services and a withdrawal-prevention plan for the admission.'
    };
  }
  if (units !== null && units > 14) {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-ALCOHOL-1',
      finding: `Alcohol intake of ${units} units per week is above the United Kingdom low-risk guideline of 14.`,
      intervention: 'Brief intervention and a reduction plan. Four weeks of abstinence improves immune and haemostatic function.'
    };
  }
  if (sex === 'male' && auditC !== null && auditC >= 5) {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-ALCOHOL-2',
      finding: `AUDIT-C score ${auditC} is at or above the threshold of 5 for men.`,
      intervention: 'Brief intervention and a reduction plan.'
    };
  }
  if (sex === 'female' && auditC !== null && auditC >= 4) {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-ALCOHOL-3',
      finding: `AUDIT-C score ${auditC} is at or above the threshold of 4 for women.`,
      intervention: 'Brief intervention and a reduction plan.'
    };
  }
  return { triggered: false, applicable: true, leadTimeWeeks, started, ruleId: '', finding: '', intervention: '' };
}

function evaluateNutrition(data) {
  const must = computeMustScore(data);
  const pct = computeWeightLossPercent(data);
  const leadTimeWeeks = 3;
  const started =
    data.nutrition.oralNutritionalSupplements === 'yes' ||
    data.nutrition.dietitianReferral === 'yes';

  if (must !== null && must >= 2) {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-NUTRITION-1',
      finding: `MUST score ${must} indicates high malnutrition risk.`,
      intervention: 'Dietitian referral, food fortification, and oral nutritional supplements; immunonutrition where indicated.'
    };
  }
  if (pct !== null && pct > 10 && data.nutrition.weightLossIsIntentional !== 'yes') {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-NUTRITION-2',
      finding: `Unintentional weight loss of ${pct}% exceeds 10%.`,
      intervention: 'Dietitian referral and nutritional support; investigate the cause of the weight loss.'
    };
  }
  return { triggered: false, applicable: true, leadTimeWeeks, started, ruleId: '', finding: '', intervention: '' };
}

function evaluatePhysicalFitness(data) {
  const mets = num(data.fitness.metabolicEquivalents);
  const dasi = num(data.fitness.dukeActivityStatusIndex);
  const walk = num(data.fitness.sixMinuteWalkMetres);
  const at = num(data.fitness.cpetAnaerobicThreshold);
  const leadTimeWeeks = 6;
  const started = data.fitness.prehabilitationEnrolled === 'yes';

  const intervention =
    'A tailored prehabilitation programme combining aerobic and resistance exercise, ideally multimodal alongside the nutrition and psychological domains.';

  if (at !== null && at < 11) {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-FITNESS-4',
      finding: `CPET anaerobic threshold ${at} ml/kg/min is below 11.`,
      intervention
    };
  }
  if (mets !== null && mets < 4) {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-FITNESS-1',
      finding: `Estimated ${mets} metabolic equivalents is below the threshold of 4.`,
      intervention
    };
  }
  if (dasi !== null && dasi < 34) {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-FITNESS-2',
      finding: `Duke Activity Status Index ${dasi} is below 34.`,
      intervention
    };
  }
  if (walk !== null && walk < 400) {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-FITNESS-3',
      finding: `Six-minute walk distance ${walk} m is below 400 m.`,
      intervention
    };
  }
  return { triggered: false, applicable: true, leadTimeWeeks, started, ruleId: '', finding: '', intervention: '' };
}

/** The medicine classes that need a perioperative hold-and-restart plan. */
const HOLD_REQUIRING = [
  ['takesAnticoagulant', 'an anticoagulant'],
  ['takesAntiplatelet', 'an antiplatelet'],
  ['takesAceInhibitorOrArb', 'an ACE inhibitor or ARB'],
  ['takesSglt2Inhibitor', 'an SGLT2 inhibitor'],
  ['takesGlp1Agonist', 'a GLP-1 receptor agonist'],
  ['takesCorticosteroid', 'a systemic corticosteroid'],
  ['takesImmunosuppressant', 'an immunosuppressant'],
  ['takesHormoneTherapy', 'hormone therapy']
];

function evaluateMedication(data) {
  const leadTimeWeeks = 1;
  const planAgreed = data.medication.medicationHoldPlanAgreed === 'yes';
  const inUse = HOLD_REQUIRING.filter(([field]) => data.medication[field] === 'yes');
  const applicable = inUse.length > 0;

  if (inUse.length > 0 && !planAgreed) {
    const names = inUse.map(([, label]) => label).join(', ');
    return {
      triggered: true, applicable: true, leadTimeWeeks, started: false,
      ruleId: 'R-MEDICATION-1',
      finding: `In use without an agreed hold-and-restart plan: ${names}.`,
      intervention: 'Agree a hold-and-restart plan with the prescriber and record it before admission.'
    };
  }
  return { triggered: false, applicable, leadTimeWeeks, started: planAgreed, ruleId: '', finding: '', intervention: '' };
}

function evaluateCardiorespiratory(data) {
  const sbp = num(data.cardioresp.systolicBp);
  const dbp = num(data.cardioresp.diastolicBp);
  const ef = num(data.cardioresp.ejectionFractionPercent);
  const stopBang = num(data.cardioresp.stopBangScore);
  const spo2 = num(data.cardioresp.oxygenSaturationPercent);
  const leadTimeWeeks = 4;
  const started =
    data.cardioresp.inhalerTechniqueChecked === 'yes' ||
    data.plan.referralCardiorespiratory === 'yes';

  if (ef !== null && ef < 40) {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-CARDIORESP-3',
      finding: `Ejection fraction ${ef}% is below 40% — impaired left ventricular function.`,
      intervention: 'Cardiology review before surgery; consider enhanced perioperative care.'
    };
  }
  if ((sbp !== null && sbp >= 180) || (dbp !== null && dbp >= 110)) {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-CARDIORESP-1',
      finding: `Blood pressure ${sbp ?? '—'}/${dbp ?? '—'} mmHg meets the deferral threshold of 180/110.`,
      intervention: 'Antihypertensive review and repeat measurement before surgery.'
    };
  }
  if (data.cardioresp.asthmaControl === 'uncontrolled' || data.cardioresp.copdControl === 'uncontrolled') {
    const which = data.cardioresp.asthmaControl === 'uncontrolled' ? 'Asthma' : 'COPD';
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-CARDIORESP-2',
      finding: `${which} is uncontrolled.`,
      intervention: 'Respiratory review, inhaler technique and adherence check, and a rescue plan.'
    };
  }
  if (spo2 !== null && spo2 < 92) {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-CARDIORESP-5',
      finding: `Oxygen saturation ${spo2}% on room air is below 92%.`,
      intervention: 'Respiratory review and investigation of the cause before surgery.'
    };
  }
  if (stopBang !== null && stopBang >= 5 && data.cardioresp.sleepApnoeaDiagnosis !== 'yes') {
    return {
      triggered: true, applicable: true, leadTimeWeeks, started,
      ruleId: 'R-CARDIORESP-4',
      finding: `STOP-BANG score ${stopBang} indicates a high probability of obstructive sleep apnoea, which has not been assessed.`,
      intervention: 'Refer for a sleep study; plan for postoperative monitoring and opioid caution.'
    };
  }
  return { triggered: false, applicable: true, leadTimeWeeks, started, ruleId: '', finding: '', intervention: '' };
}

/** The evaluator for each domain, keyed by domain. */
const DOMAIN_EVALUATORS = {
  'anaemia': evaluateAnaemia,
  'glycaemic-control': evaluateGlycaemicControl,
  'smoking': evaluateSmoking,
  'alcohol': evaluateAlcohol,
  'nutrition': evaluateNutrition,
  'physical-fitness': evaluatePhysicalFitness,
  'medication': evaluateMedication,
  'cardiorespiratory': evaluateCardiorespiratory
};

export {
  DOMAIN_ORDER,
  DOMAIN_LABELS,
  DOMAIN_EVALUATORS,
  HOLD_REQUIRING,
  computeBmi,
  computeWeightLossPercent,
  computeMustScore,
  computeAuditCScore,
  computeFriedPhenotypeScore,
  mustRisk,
  num,
  round1,
  rule
};
