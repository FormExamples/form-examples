// Four-axis rule catalogue for the Eye Vision Test Request engine.
//
// Derived from index.md: (A) appropriateness 1-9 + band by indication x test
// type (RCOphth / NICE indication match); (B) urgency / triage tier
// (routine / urgent / emergency) with red-flag auto-escalation; (C) request
// completeness over mandatory fields; (D) clinical priority band
// (low / moderate / high). Rule IDs are stable and identical across every
// front-end and the back-end (R-APPROP-*, R-TRIAGE-*, R-COMPLETE-*,
// R-PRIORITY-*). Pure data + helpers; the grader composes them.
//
// Wrapped in an IIFE; published via `window.EyeVisionTestRequest`.

(function () {
'use strict';
window.EyeVisionTestRequest =
  window.EyeVisionTestRequest || {};
const NS = window.EyeVisionTestRequest;

// ----------------------------------------------------------------------
// Axis A — Appropriateness (RCOphth / NICE indication match, 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal test type (or set of types). When the
// requested test type matches the indication well, the request scores high
// (7-9, usually-appropriate). Plausible-but-suboptimal pairings score in the
// 4-6 may-be-appropriate band; clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[testType], plausible:[testType] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_TEST_MAP = {
  'reduced-vision':                  { ideal: ['visual-acuity', 'refraction'], plausible: ['slit-lamp', 'fundus-examination', 'optical-coherence-tomography'] },
  'suspected-glaucoma':             { ideal: ['tonometry', 'visual-fields', 'optical-coherence-tomography'], plausible: ['fundus-examination'] },
  'diabetic-retinopathy-screening': { ideal: ['fundus-examination', 'optical-coherence-tomography'], plausible: ['fluorescein-angiography', 'visual-acuity'] },
  'sudden-visual-loss':             { ideal: ['fundus-examination', 'visual-acuity'], plausible: ['visual-fields', 'optical-coherence-tomography', 'slit-lamp'] },
  'flashes-floaters':               { ideal: ['fundus-examination'], plausible: ['slit-lamp', 'visual-fields'] },
  'red-eye':                        { ideal: ['slit-lamp'], plausible: ['visual-acuity', 'tonometry'] },
  'childhood-squint':               { ideal: ['orthoptic-assessment', 'refraction'], plausible: ['visual-acuity'] },
  'visual-field-defect':            { ideal: ['visual-fields'], plausible: ['optical-coherence-tomography', 'fundus-examination'] },
  'cataract-assessment':            { ideal: ['visual-acuity', 'slit-lamp'], plausible: ['refraction', 'fundus-examination'] },
  'headache-visual-symptoms':       { ideal: ['visual-fields', 'fundus-examination'], plausible: ['visual-acuity', 'optical-coherence-tomography'] },
  'other':                          { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x testType pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or test type has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, testType) {
  if (!indication || !testType) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or test type not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_TEST_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  if (map.ideal.includes(testType)) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${testType} test is the recommended examination for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(testType)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${testType} test may be appropriate for "${indication}" but is not the first-line examination.`
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
      description: `Requested ${testType} test is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Urgency / triage tier (RCOphth acute-eye escalation rules)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then red flags
// auto-escalate it. Sudden visual loss, retinal-detachment symptoms (flashes
// / floaters), acute painful red eye, and suspected giant cell arteritis all
// force an emergency tier. The most-severe escalation wins.

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

// Red-flag escalation rules, each forcing at least the given tier.
const TRIAGE_RULES = [
  {
    ruleId: 'R-TRIAGE-SUDDEN-VISUAL-LOSS',
    tier: 'emergency',
    fires: (d) =>
      d.symptoms.suddenLoss === true ||
      d.request.primaryIndication === 'sudden-visual-loss',
    description: 'Sudden visual loss — same-day emergency eye assessment.'
  },
  {
    ruleId: 'R-TRIAGE-RETINAL-DETACHMENT',
    tier: 'emergency',
    fires: (d) =>
      d.symptoms.flashesFloaters === true ||
      d.request.primaryIndication === 'flashes-floaters',
    description: 'Flashes / floaters — retinal-detachment symptoms require emergency assessment.'
  },
  {
    ruleId: 'R-TRIAGE-ACUTE-PAINFUL-RED-EYE',
    tier: 'emergency',
    fires: (d) => d.symptoms.eyePain === true && d.symptoms.redEye === true,
    description: 'Acute painful red eye — emergency assessment (exclude angle-closure / keratitis / uveitis).'
  },
  {
    ruleId: 'R-TRIAGE-SUSPECTED-GCA',
    tier: 'emergency',
    fires: (d) =>
      d.request.primaryIndication === 'headache-visual-symptoms' &&
      d.symptoms.suddenLoss === true,
    description: 'Suspected giant cell arteritis — emergency assessment and urgent bloods.'
  },
  {
    ruleId: 'R-TRIAGE-RED-EYE',
    tier: 'urgent',
    fires: (d) => d.symptoms.redEye === true && d.symptoms.eyePain !== true,
    description: 'Red eye without pain — urgent assessment.'
  },
  {
    ruleId: 'R-TRIAGE-REDUCED-VISION',
    tier: 'urgent',
    fires: (d) => d.symptoms.reducedVision === true,
    description: 'Reduced vision reported — urgent assessment.'
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
        axis: 'urgency',
        category: 'red-flag',
        description: rule.description
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-TRIAGE-REQUESTED',
      axis: 'urgency',
      category: 'requested',
      description: `No red flags; triage follows the requested urgency (${tier}).`
    });
  }

  return {
    tier,
    targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
    firedRules
  };
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
  { weight: 2, present: (d) => !!d.request.testType, ruleId: 'R-COMPLETE-TEST-TYPE', label: 'requested test type' },
  { weight: 2, present: (d) => !!d.request.laterality, ruleId: 'R-COMPLETE-LATERALITY', label: 'laterality' },
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
// Axis D — Clinical priority (combined acuity + risk-factor weighting)
// ----------------------------------------------------------------------
//
// A weighted points model: red flags and an emergency triage tier push the
// score high; risk factors (diabetes, known glaucoma) and reduced vision add
// moderate weight. The band is derived from the accumulated points.

const PRIORITY_RULES = [
  { ruleId: 'R-PRIORITY-SUDDEN-LOSS', points: 4, fires: (d) => d.symptoms.suddenLoss === true, description: 'Sudden visual loss raises clinical priority.' },
  { ruleId: 'R-PRIORITY-FLASHES-FLOATERS', points: 4, fires: (d) => d.symptoms.flashesFloaters === true, description: 'Flashes / floaters raise clinical priority.' },
  { ruleId: 'R-PRIORITY-PAINFUL-RED-EYE', points: 4, fires: (d) => d.symptoms.eyePain === true && d.symptoms.redEye === true, description: 'Acute painful red eye raises clinical priority.' },
  { ruleId: 'R-PRIORITY-REDUCED-VISION', points: 2, fires: (d) => d.symptoms.reducedVision === true, description: 'Reduced vision raises clinical priority.' },
  { ruleId: 'R-PRIORITY-RED-EYE', points: 1, fires: (d) => d.symptoms.redEye === true, description: 'Red eye adds to clinical priority.' },
  { ruleId: 'R-PRIORITY-DIABETES', points: 1, fires: (d) => d.riskFactors.diabetes === true, description: 'Diabetes (retinopathy risk) adds to clinical priority.' },
  { ruleId: 'R-PRIORITY-KNOWN-GLAUCOMA', points: 1, fires: (d) => d.riskFactors.knownGlaucoma === true, description: 'Known glaucoma adds to clinical priority.' }
];

/**
 * Compute the clinical-priority band (low / moderate / high) and the fired
 * priority rules.
 *
 * @returns {{ band:string, points:number, firedRules:object[] }}
 */
function scorePriority(data) {
  let points = 0;
  const firedRules = [];
  for (const rule of PRIORITY_RULES) {
    if (rule.fires(data)) {
      points += rule.points;
      firedRules.push({
        ruleId: rule.ruleId,
        axis: 'priority',
        category: 'risk',
        description: rule.description
      });
    }
  }
  let band;
  if (points >= 4) band = 'high';
  else if (points >= 2) band = 'moderate';
  else band = 'low';

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-PRIORITY-BASELINE',
      axis: 'priority',
      category: 'baseline',
      description: 'No additional risk factors; clinical priority is low.'
    });
  }
  return { band, points, firedRules };
}

Object.assign(NS, {
  scoreAppropriateness,
  appropriatenessBand,
  scoreTriage,
  scoreCompleteness,
  scorePriority,
  maxTier,
  TRIAGE_ORDER,
  TARGET_TIMEFRAMES,
  INDICATION_TEST_MAP
});
})();
