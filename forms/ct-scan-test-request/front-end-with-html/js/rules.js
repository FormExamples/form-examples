import { usesIvContrast } from './types.js';

// Four-axis rule catalogue for the CT Scan Test Request engine.
//
// Derived from index.md and the SQL migrations: (A) appropriateness 1-9 + band
// by body region x indication; (B) radiation & contrast safety — contrast
// band (safe / caution / contraindicated), estimated-dose band (low / moderate
// / high), and renal-risk flag; (C) request completeness over mandatory
// fields; (D) triage tier (routine / urgent / emergency). Rule IDs are stable
// and identical across every front-end and the back-end (R-APPROP-*,
// R-SAFETY-*, R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers; the grader
// composes them.
//
// Wrapped in an IIFE; published via `window.CtScanTestRequest`.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACR Appropriateness Criteria 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal body region (or set). When the requested
// region matches the indication well, the request scores high (7-9,
// usually-appropriate). Plausible-but-suboptimal pairings score 4-6
// (may-be-appropriate); clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[bodyRegion], plausible:[bodyRegion] }.
const INDICATION_REGION_MAP = {
  'trauma':                 { ideal: ['head', 'spine', 'chest', 'abdomen-pelvis', 'whole-body', 'extremity'], plausible: ['neck', 'abdomen', 'pelvis', 'ct-angiogram'] },
  'suspected-stroke':       { ideal: ['head'], plausible: ['ct-angiogram', 'neck'] },
  'suspected-malignancy':   { ideal: ['chest', 'abdomen-pelvis', 'neck', 'ct-colonography'], plausible: ['abdomen', 'pelvis', 'whole-body', 'head'] },
  'cancer-staging':         { ideal: ['chest', 'abdomen-pelvis', 'whole-body'], plausible: ['neck', 'abdomen', 'pelvis', 'head'] },
  'pulmonary-embolism':     { ideal: ['ct-angiogram', 'chest'], plausible: [] },
  'abdominal-pain':         { ideal: ['abdomen-pelvis', 'abdomen'], plausible: ['pelvis', 'whole-body'] },
  'renal-colic':            { ideal: ['abdomen-pelvis', 'abdomen'], plausible: ['pelvis'] },
  'infection-abscess':      { ideal: ['abdomen-pelvis', 'chest', 'neck'], plausible: ['abdomen', 'pelvis', 'head'] },
  'pre-surgical-planning':  { ideal: ['abdomen-pelvis', 'spine', 'chest', 'extremity', 'ct-angiogram'], plausible: ['head', 'neck', 'abdomen', 'pelvis', 'whole-body'] },
  'follow-up-surveillance': { ideal: ['chest', 'abdomen-pelvis', 'ct-colonography'], plausible: ['abdomen', 'pelvis', 'neck', 'whole-body', 'head'] },
  'headache':               { ideal: ['head'], plausible: ['ct-angiogram', 'neck'] },
  'other':                  { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x bodyRegion pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or region has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, bodyRegion) {
  if (!indication || !bodyRegion) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or body region not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_REGION_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  if (map.ideal.includes(bodyRegion)) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `CT ${bodyRegion} is the recommended examination for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(bodyRegion)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `CT ${bodyRegion} may be appropriate for "${indication}" but is not the first-line examination.`
      }
    };
  }
  if (indication === 'other') {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-OTHER',
        axis: 'appropriateness',
        category: 'other',
        description: 'Indication recorded as "other"; appropriateness requires clinician vetting.'
      }
    };
  }
  return {
    score: 2,
    band: 'usually-not-appropriate',
    firedRule: {
      ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
      axis: 'appropriateness',
      category: indication,
      description: `CT ${bodyRegion} is not usually appropriate for "${indication}"; query the referrer.`
    }
  };
}

/** Map a 1-9 appropriateness score to its band. */
function appropriatenessBand(score) {
  if (score >= 7) return 'usually-appropriate';
  if (score >= 4) return 'may-be-appropriate';
  return 'usually-not-appropriate';
}

// ----------------------------------------------------------------------
// Axis B — Radiation & contrast safety (RCR iRefer / ESUR + IR(ME)R)
// ----------------------------------------------------------------------
//
// Two derived bands plus a renal-risk flag:
//   - contrastSafetyBand: safe / caution / contraindicated
//   - estimatedDoseBand:  low / moderate / high (by body region)
//   - renalRisk:          eGFR-driven CIN risk for IV iodinated contrast

// ESUR thresholds for IV iodinated contrast nephropathy risk.
const EGFR_CONTRAINDICATED = 30; // eGFR < 30 -> high CIN risk
const EGFR_CAUTION = 45;         // eGFR 30-44 -> caution

// Estimated effective-dose band per body region (illustrative, from index.md).
const DOSE_BY_REGION = {
  'head': 'low',
  'neck': 'low',
  'spine': 'moderate',
  'chest': 'moderate',
  'ct-angiogram': 'moderate',
  'extremity': 'low',
  'abdomen': 'moderate',
  'pelvis': 'moderate',
  'abdomen-pelvis': 'high',
  'ct-colonography': 'high',
  'whole-body': 'high'
};

/**
 * Estimate the radiation-dose band for the requested body region.
 *
 * @returns {{ band:string, firedRule:object|null }}
 */
function evaluateDose(bodyRegion) {
  if (!bodyRegion) {
    return {
      band: '',
      firedRule: {
        ruleId: 'R-SAFETY-DOSE-UNKNOWN',
        axis: 'safety',
        category: 'radiation-dose',
        description: 'Body region not yet specified — radiation dose not estimated.'
      }
    };
  }
  const band = DOSE_BY_REGION[bodyRegion] || 'moderate';
  const regionKey = bodyRegion.toUpperCase().replace(/[^A-Z]+/g, '-');
  return {
    band,
    firedRule: {
      ruleId: `R-SAFETY-DOSE-${regionKey}`,
      axis: 'safety',
      category: 'radiation-dose',
      description: `Estimated radiation dose for CT ${bodyRegion} is ${band}.`
    }
  };
}

/**
 * Evaluate contrast safety and renal risk for the requested study.
 *
 * @returns {{ band:string, renalRisk:boolean, firedRules:object[] }}
 */
function evaluateContrastSafety(contrastData) {
  const firedRules = [];
  const iv = usesIvContrast(contrastData.contrastRequired);
  const egfr = contrastData.egfr;
  let band = 'safe';
  let renalRisk = false;

  // Severe iodinated-contrast allergy / prior severe reaction.
  if (
    iv &&
    (contrastData.iodineContrastAllergy === true ||
      contrastData.previousContrastReaction === 'severe')
  ) {
    band = 'contraindicated';
    firedRules.push({
      ruleId: 'R-SAFETY-CONTRAST-ALLERGY',
      axis: 'safety',
      category: 'contrast-allergy',
      description: 'Known iodinated-contrast allergy or previous severe reaction with IV contrast requested.'
    });
  }

  // Renal function for IV iodinated contrast (ESUR thresholds).
  if (iv && egfr !== null && egfr !== undefined && egfr !== '') {
    const e = Number(egfr);
    if (!Number.isNaN(e)) {
      if (e < EGFR_CONTRAINDICATED) {
        renalRisk = true;
        if (band !== 'contraindicated') band = 'contraindicated';
        firedRules.push({
          ruleId: 'R-SAFETY-EGFR-LOW',
          axis: 'safety',
          category: 'renal-impairment',
          description: `eGFR ${e} mL/min/1.73m2 is below 30 — high contrast-induced nephropathy risk.`
        });
      } else if (e < EGFR_CAUTION) {
        renalRisk = true;
        if (band === 'safe') band = 'caution';
        firedRules.push({
          ruleId: 'R-SAFETY-EGFR-BORDERLINE',
          axis: 'safety',
          category: 'renal-impairment',
          description: `eGFR ${e} mL/min/1.73m2 is 30-44 — caution; consider hydration / nephrology advice.`
        });
      }
    }
  }

  // IV contrast requested but no eGFR recorded -> caution.
  if (
    iv &&
    (egfr === null || egfr === undefined || egfr === '') &&
    band === 'safe'
  ) {
    band = 'caution';
    firedRules.push({
      ruleId: 'R-SAFETY-EGFR-MISSING',
      axis: 'safety',
      category: 'renal-impairment',
      description: 'IV iodinated contrast requested but no eGFR recorded — obtain renal function first.'
    });
  }

  // Moderate prior reaction -> caution.
  if (
    iv &&
    contrastData.previousContrastReaction === 'moderate' &&
    band === 'safe'
  ) {
    band = 'caution';
    firedRules.push({
      ruleId: 'R-SAFETY-PRIOR-REACTION',
      axis: 'safety',
      category: 'contrast-allergy',
      description: 'Previous moderate contrast reaction — premedication / specialist review advised.'
    });
  }

  // Metformin interaction at reduced eGFR.
  if (iv && contrastData.metformin === true) {
    const e = egfr === null || egfr === undefined || egfr === '' ? null : Number(egfr);
    if (e !== null && !Number.isNaN(e) && e < EGFR_CAUTION) {
      firedRules.push({
        ruleId: 'R-SAFETY-METFORMIN',
        axis: 'safety',
        category: 'metformin-contrast',
        description: 'Patient on metformin with eGFR < 45 — withhold metformin around IV contrast.'
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-SAFETY-CONTRAST-OK',
      axis: 'safety',
      category: 'contrast-safety',
      description: iv
        ? 'No contrast-safety concerns identified for the requested IV contrast study.'
        : 'No intravascular iodinated contrast requested.'
    });
  }

  return { band, renalRisk, firedRules };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------
//
// Each tracked field carries a weight. Indication, clinical question, and the
// IR(ME)R justification are weighted highest because they drive every other
// axis and the radiation justification. Completeness is the percentage of
// weighted points present.

const COMPLETENESS_FIELDS = [
  { weight: 3, present: (d) => !!d.request.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
  { weight: 3, present: (d) => !!d.request.clinicalQuestion && d.request.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
  { weight: 2, present: (d) => !!d.request.bodyRegion, ruleId: 'R-COMPLETE-BODY-REGION', label: 'body region' },
  { weight: 2, present: (d) => !!d.radiation.irMeRJustification && d.radiation.irMeRJustification.trim() !== '', ruleId: 'R-COMPLETE-JUSTIFICATION', label: 'IR(ME)R justification' },
  { weight: 1, present: (d) => !!d.contrast.contrastRequired, ruleId: 'R-COMPLETE-CONTRAST', label: 'contrast requirement' },
  { weight: 1, present: (d) => !!d.radiation.pregnancyStatus, ruleId: 'R-COMPLETE-PREGNANCY', label: 'pregnancy status' },
  { weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
  { weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
  { weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
  { weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
  { weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
  { weight: 1, present: (d) => !!d.triage.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

/**
 * Compute weighted completeness 0-100 and the missing-field rules.
 *
 * @returns {{ percent:number, missing:object[] }}
 */
function scoreCompleteness(data) {
  let totalWeight = 0;
  let presentWeight = 0;
  const missing = [];
  for (const f of COMPLETENESS_FIELDS) {
    totalWeight += f.weight;
    if (f.present(data)) {
      presentWeight += f.weight;
    } else {
      missing.push({
        ruleId: f.ruleId,
        axis: 'completeness',
        category: 'missing-field',
        description: `Missing ${f.label}.`
      });
    }
  }
  const percent = totalWeight === 0 ? 0 : Math.round((presentWeight / totalWeight) * 100);
  return { percent, missing };
}

// ----------------------------------------------------------------------
// Axis D — Triage priority (acuity escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then acuity
// rules auto-escalate it. The most-severe escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent', 'emergency'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 4-6 weeks',
  'urgent': 'Within 24-72 hours',
  'emergency': 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a, b) {
  const ia = TRIAGE_ORDER.indexOf(a);
  const ib = TRIAGE_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Acuity escalation rules, each forcing at least the given tier.
const TRIAGE_RULES = [
  {
    ruleId: 'R-TRIAGE-STROKE',
    tier: 'emergency',
    fires: (d) => d.request.primaryIndication === 'suspected-stroke',
    description: 'Suspected acute stroke — emergency CT head within the thrombolysis window.'
  },
  {
    ruleId: 'R-TRIAGE-PE',
    tier: 'emergency',
    fires: (d) => d.request.primaryIndication === 'pulmonary-embolism',
    description: 'Suspected pulmonary embolism — emergency CT pulmonary angiogram.'
  },
  {
    ruleId: 'R-TRIAGE-TRAUMA',
    tier: 'emergency',
    fires: (d) => d.request.primaryIndication === 'trauma',
    description: 'Major trauma — emergency CT for rapid assessment.'
  },
  {
    ruleId: 'R-TRIAGE-RENAL-COLIC',
    tier: 'urgent',
    fires: (d) => d.request.primaryIndication === 'renal-colic',
    description: 'Acute renal colic — urgent CT to confirm and assess obstruction.'
  },
  {
    ruleId: 'R-TRIAGE-ABDO-PAIN',
    tier: 'urgent',
    fires: (d) => d.request.primaryIndication === 'abdominal-pain',
    description: 'Acute abdominal pain — urgent CT to exclude a surgical emergency.'
  },
  {
    ruleId: 'R-TRIAGE-INFECTION',
    tier: 'urgent',
    fires: (d) => d.request.primaryIndication === 'infection-abscess',
    description: 'Suspected infection / abscess — urgent CT to locate a collection.'
  }
];

/**
 * Compute the triage tier, target timeframe, and fired triage rules.
 *
 * @returns {{ tier:string, targetTimeframe:string, firedRules:object[] }}
 */
function scoreTriage(data) {
  const requested = data.triage.urgency || 'routine';
  let tier = TRIAGE_ORDER.includes(requested) ? requested : 'routine';
  const firedRules = [];

  for (const rule of TRIAGE_RULES) {
    if (rule.fires(data)) {
      tier = maxTier(tier, rule.tier);
      firedRules.push({
        ruleId: rule.ruleId,
        axis: 'triage',
        category: 'acuity',
        description: rule.description
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-TRIAGE-REQUESTED',
      axis: 'triage',
      category: 'requested',
      description: `No acuity escalation; triage follows the requested urgency (${tier}).`
    });
  }

  return {
    tier,
    targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
    firedRules
  };
}

export { scoreAppropriateness, appropriatenessBand, evaluateDose, evaluateContrastSafety, scoreCompleteness, scoreTriage, maxTier, TRIAGE_ORDER, TARGET_TIMEFRAMES, DOSE_BY_REGION, INDICATION_REGION_MAP, EGFR_CAUTION, EGFR_CONTRAINDICATED };
