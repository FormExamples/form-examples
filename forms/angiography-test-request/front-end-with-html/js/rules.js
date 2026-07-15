import { usesIonisingRadiation } from './types.js';

// Four-axis rule catalogue for the Angiography Test Request engine.
//
// Derived from index.md: (A) appropriateness 1-9 + band by indication x
// angiography type (ACR Appropriateness Criteria / RCR iRefer); (B) contrast /
// radiation safety band ok/caution/contraindicated driven by eGFR, contrast
// allergy, anticoagulation, pregnancy, and metformin (ESUR / IR(ME)R);
// (C) request completeness over mandatory fields; (D) triage tier
// routine/urgent/emergency with acuity escalation. Rule IDs are stable and
// identical across every front-end and the back-end (R-APPROP-*, R-SAFETY-*,
// R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers; the grader composes them.
//
// Wrapped in an IIFE; published via `window.AngiographyTestRequest`.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACR Appropriateness Criteria 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal modality (or set of modalities). When the
// requested angiography type matches the indication well, the request scores
// high (7-9, usually-appropriate). Plausible-but-suboptimal pairings score in
// the 4-6 may-be-appropriate band; clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[type], plausible:[type] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_TYPE_MAP = {
  'suspected-coronary-disease':   { ideal: ['ct-angiography', 'coronary-angiography'], plausible: ['catheter-dsa'] },
  'peripheral-arterial-disease':  { ideal: ['ct-angiography', 'mr-angiography', 'peripheral-angiography'], plausible: ['catheter-dsa'] },
  'aneurysm':                     { ideal: ['ct-angiography', 'mr-angiography'], plausible: ['catheter-dsa', 'cerebral-angiography'] },
  'stenosis':                     { ideal: ['ct-angiography', 'mr-angiography'], plausible: ['catheter-dsa', 'peripheral-angiography'] },
  'suspected-pulmonary-embolism': { ideal: ['ct-angiography'], plausible: ['catheter-dsa'] },
  'gi-bleeding':                  { ideal: ['ct-angiography', 'catheter-dsa'], plausible: ['mr-angiography'] },
  'pre-intervention-planning':    { ideal: ['ct-angiography', 'catheter-dsa'], plausible: ['mr-angiography', 'peripheral-angiography'] },
  'suspected-stroke':             { ideal: ['ct-angiography', 'cerebral-angiography'], plausible: ['mr-angiography', 'catheter-dsa'] },
  'other':                        { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x angiographyType pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or angiography type has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, angiographyType) {
  if (!indication || !angiographyType) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or angiography type not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_TYPE_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  if (map.ideal.includes(angiographyType)) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${angiographyType} is a recommended examination for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(angiographyType)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${angiographyType} may be appropriate for "${indication}" but is not the first-line examination.`
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
      description: `Requested ${angiographyType} is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Contrast / radiation safety (ESUR Contrast Media + IR(ME)R)
// ----------------------------------------------------------------------
//
// A base band of `ok` is escalated toward `caution` and `contraindicated` by
// the most-severe matching rule. Safety-critical conditions (eGFR < 30 with
// iodinated contrast, severe contrast allergy, active bleeding risk on
// anticoagulation, pregnancy with ionising radiation) force `contraindicated`.

const SAFETY_ORDER = ['ok', 'caution', 'contraindicated'];

/** Return whichever of two safety bands is more severe. */
function maxBand(a, b) {
  const ia = SAFETY_ORDER.indexOf(a);
  const ib = SAFETY_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Safety rules, each forcing at least the given band when it fires.
const SAFETY_RULES = [
  {
    ruleId: 'R-SAFETY-EGFR-SEVERE',
    band: 'contraindicated',
    fires: (d) => d.contrast.contrastRequired === 'iodinated' &&
      d.contrast.egfr !== null && d.contrast.egfr !== undefined && d.contrast.egfr < 30,
    description: 'eGFR < 30 with iodinated contrast — high post-contrast acute kidney injury risk.'
  },
  {
    ruleId: 'R-SAFETY-CONTRAST-ALLERGY',
    band: 'contraindicated',
    fires: (d) => d.contrast.contrastAllergy === true &&
      (d.contrast.contrastRequired === 'iodinated' || d.contrast.contrastRequired === 'gadolinium'),
    description: 'Previous contrast-media allergy with a contrast-requiring examination.'
  },
  {
    ruleId: 'R-SAFETY-PREGNANCY-RADIATION',
    band: 'contraindicated',
    fires: (d) => (d.pregnancy.pregnancyStatus === 'pregnant') &&
      usesIonisingRadiation(d.request.angiographyType),
    description: 'Pregnancy with an ionising-radiation examination — justify under IR(ME)R or use a non-ionising alternative.'
  },
  {
    ruleId: 'R-SAFETY-BLEEDING-ANTICOAG',
    band: 'contraindicated',
    fires: (d) => d.request.angiographyType === 'catheter-dsa' &&
      d.bleeding.takingAnticoagulant === true && d.bleeding.bleedingDisorder === true,
    description: 'Catheter / DSA with anticoagulation and a bleeding disorder — high arterial-access bleeding risk.'
  },
  {
    ruleId: 'R-SAFETY-EGFR-MODERATE',
    band: 'caution',
    fires: (d) => d.contrast.contrastRequired === 'iodinated' &&
      d.contrast.egfr !== null && d.contrast.egfr !== undefined &&
      d.contrast.egfr >= 30 && d.contrast.egfr < 45,
    description: 'eGFR 30-44 with iodinated contrast — use renal-protective hydration and minimise contrast volume.'
  },
  {
    ruleId: 'R-SAFETY-METFORMIN-CONTRAST',
    band: 'caution',
    fires: (d) => d.contrast.metformin === true &&
      d.contrast.contrastRequired === 'iodinated',
    description: 'Metformin with iodinated contrast — review per ESUR guidance based on eGFR.'
  },
  {
    ruleId: 'R-SAFETY-PREGNANCY-POSSIBLE',
    band: 'caution',
    fires: (d) => (d.pregnancy.pregnancyStatus === 'possible' || d.pregnancy.pregnancyStatus === 'unknown') &&
      usesIonisingRadiation(d.request.angiographyType),
    description: 'Possible / unknown pregnancy with an ionising-radiation examination — confirm pregnancy status.'
  },
  {
    ruleId: 'R-SAFETY-ANTICOAG-CATHETER',
    band: 'caution',
    fires: (d) => d.request.angiographyType === 'catheter-dsa' &&
      (d.bleeding.takingAnticoagulant === true || d.bleeding.takingAntiplatelet === true),
    description: 'Catheter / DSA on anticoagulant / antiplatelet — review peri-procedural bridging and access plan.'
  }
];

/**
 * Compute the contrast / radiation safety band and fired safety rules.
 *
 * @returns {{ band:string, firedRules:object[] }}
 */
function scoreSafety(data) {
  let band = 'ok';
  const firedRules = [];

  for (const rule of SAFETY_RULES) {
    if (rule.fires(data)) {
      band = maxBand(band, rule.band);
      firedRules.push({
        ruleId: rule.ruleId,
        axis: 'safety',
        category: 'safety',
        description: rule.description
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-SAFETY-OK',
      axis: 'safety',
      category: 'safety',
      description: 'No contrast or radiation safety concerns identified.'
    });
  }

  return { band, firedRules };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------
//
// Each tracked field carries a weight. Indication and clinical question are
// weighted highest because they drive every other axis. Completeness is the
// percentage of weighted points present.

const COMPLETENESS_FIELDS = [
  { weight: 3, present: (d) => !!d.request.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
  { weight: 3, present: (d) => !!d.request.clinicalQuestion && d.request.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
  { weight: 2, present: (d) => !!d.request.angiographyType, ruleId: 'R-COMPLETE-ANGIOGRAPHY-TYPE', label: 'angiography type' },
  { weight: 2, present: (d) => !!d.request.bodyRegion, ruleId: 'R-COMPLETE-BODY-REGION', label: 'body region' },
  { weight: 1, present: (d) => !!d.contrast.contrastRequired, ruleId: 'R-COMPLETE-CONTRAST', label: 'contrast requirement' },
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
    ruleId: 'R-TRIAGE-GI-BLEEDING',
    tier: 'emergency',
    fires: (d) => d.request.primaryIndication === 'gi-bleeding',
    description: 'Active GI bleeding indication — emergency angiography.'
  },
  {
    ruleId: 'R-TRIAGE-PULMONARY-EMBOLISM',
    tier: 'emergency',
    fires: (d) => d.request.primaryIndication === 'suspected-pulmonary-embolism',
    description: 'Suspected pulmonary embolism — emergency CT pulmonary angiography.'
  },
  {
    ruleId: 'R-TRIAGE-STROKE',
    tier: 'emergency',
    fires: (d) => d.request.primaryIndication === 'suspected-stroke',
    description: 'Suspected acute stroke — emergency assessment within the treatment window.'
  },
  {
    ruleId: 'R-TRIAGE-ANEURYSM',
    tier: 'urgent',
    fires: (d) => d.request.primaryIndication === 'aneurysm',
    description: 'Aneurysm indication — urgent assessment to exclude rupture / leak.'
  },
  {
    ruleId: 'R-TRIAGE-PRE-INTERVENTION',
    tier: 'urgent',
    fires: (d) => d.request.primaryIndication === 'pre-intervention-planning',
    description: 'Pre-intervention planning — expedite to support a planned procedure.'
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

export { scoreAppropriateness, appropriatenessBand, scoreSafety, scoreCompleteness, scoreTriage, maxTier, maxBand, TRIAGE_ORDER, SAFETY_ORDER, TARGET_TIMEFRAMES, INDICATION_TYPE_MAP, SAFETY_RULES, TRIAGE_RULES };
