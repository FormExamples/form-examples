// Four-axis rule catalogue for the MRI Scan Test Request engine.
//
// Derived from index.md and sql-migrations/05: (A) appropriateness 1-9 + band
// by indication x body region (ACR Appropriateness Criteria); (B) MRI safety
// band (cleared / conditional / needs-mri-physics-review / contraindicated)
// from the implant screen, plus a gadolinium-vs-eGFR contrast-renal flag;
// (C) request completeness over mandatory fields; (D) triage tier with
// emergency auto-escalation. Rule IDs are stable and identical across every
// front-end and the back-end (R-APPROP-*, R-SAFETY-*, R-COMPLETE-*,
// R-TRIAGE-*). Pure data + helpers; the grader composes them.
//
// Wrapped in an IIFE; published via `window.MriScanTestRequest`.

(function () {
'use strict';
window.MriScanTestRequest = window.MriScanTestRequest || {};
const NS = window.MriScanTestRequest;

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACR Appropriateness Criteria 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal body region (or set of regions). When the
// requested region matches the indication well, the request scores high (7-9,
// usually-appropriate). Plausible-but-suboptimal pairings score 4-6
// (may-be-appropriate); clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[bodyRegion], plausible:[bodyRegion] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_REGION_MAP = {
  'suspected-malignancy':    { ideal: ['head-neck', 'chest', 'abdomen', 'pelvis', 'breast', 'whole-body'], plausible: ['brain', 'musculoskeletal-joint'] },
  'cancer-staging':          { ideal: ['chest', 'abdomen', 'pelvis', 'whole-body', 'breast', 'head-neck'], plausible: ['brain', 'spine-thoracic', 'spine-lumbar'] },
  'neurological-deficit':    { ideal: ['brain', 'spine-cervical', 'spine-thoracic', 'spine-lumbar'], plausible: ['head-neck'] },
  'suspected-ms':            { ideal: ['brain', 'spine-cervical'], plausible: ['spine-thoracic', 'spine-lumbar'] },
  'back-pain-radiculopathy': { ideal: ['spine-lumbar', 'spine-cervical', 'spine-thoracic'], plausible: ['pelvis'] },
  'joint-derangement':       { ideal: ['musculoskeletal-joint'], plausible: ['spine-lumbar', 'spine-cervical'] },
  'suspected-stroke':        { ideal: ['brain', 'mr-angiogram'], plausible: ['head-neck'] },
  'epilepsy':                { ideal: ['brain'], plausible: [] },
  'dementia':                { ideal: ['brain'], plausible: [] },
  'pituitary':               { ideal: ['brain'], plausible: ['head-neck'] },
  'cardiac-function':        { ideal: ['cardiac'], plausible: ['chest', 'mr-angiogram'] },
  'follow-up-surveillance':  { ideal: ['brain', 'chest', 'abdomen', 'pelvis', 'whole-body', 'breast', 'musculoskeletal-joint', 'spine-cervical', 'spine-thoracic', 'spine-lumbar', 'head-neck', 'cardiac', 'mr-angiogram'], plausible: [] },
  'other':                   { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x bodyRegion pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or body region has not yet been chosen.
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
        description: `MRI of the ${bodyRegion} is the recommended examination for "${indication}".`
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
        description: `MRI of the ${bodyRegion} may be appropriate for "${indication}" but is not the first-line examination.`
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
      description: `MRI of the ${bodyRegion} is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — MRI safety (ACR Manual on MR Safety / MHRA implant screening)
// ----------------------------------------------------------------------
//
// The implant screen drives the safety band. Absolute / high-risk items
// (pacemaker / ICD, aneurysm clip, orbital foreign body) push the band toward
// contraindicated; conditional items (cochlear implant, shunt, neurostimulator,
// metal implant, insulin pump, shrapnel) push it to needs-mri-physics-review.
// Bands are ordered so the most-severe fired rule wins.

const SAFETY_ORDER = ['cleared', 'conditional', 'needs-mri-physics-review', 'contraindicated'];

/** Return whichever of two safety bands is more severe. */
function maxSafetyBand(a, b) {
  const ia = SAFETY_ORDER.indexOf(a);
  const ib = SAFETY_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Each rule maps a positive screen item to the safety band it forces.
const SAFETY_RULES = [
  {
    ruleId: 'R-SAFETY-PACEMAKER-ICD',
    band: 'contraindicated',
    fires: (d) => d.safety.pacemakerOrIcd === true,
    description: 'Cardiac pacemaker or ICD present — contraindicated unless MR-conditional and programmed for MRI.'
  },
  {
    ruleId: 'R-SAFETY-ANEURYSM-CLIP',
    band: 'contraindicated',
    fires: (d) => d.safety.aneurysmClip === true,
    description: 'Intracranial aneurysm clip present — contraindicated unless documented MR-conditional / non-ferromagnetic.'
  },
  {
    ruleId: 'R-SAFETY-ORBITAL-FOREIGN-BODY',
    band: 'contraindicated',
    fires: (d) => d.safety.metallicForeignBodyEye === true,
    description: 'Metallic foreign body in the eye / orbit — contraindicated until excluded by orbital radiograph.'
  },
  {
    ruleId: 'R-SAFETY-SHRAPNEL',
    band: 'needs-mri-physics-review',
    fires: (d) => d.safety.shrapnelOrMetalFragments === true,
    description: 'Shrapnel or embedded metal fragments — MR physics review required before scanning.'
  },
  {
    ruleId: 'R-SAFETY-COCHLEAR-IMPLANT',
    band: 'needs-mri-physics-review',
    fires: (d) => d.safety.cochlearImplant === true,
    description: 'Cochlear implant present — confirm MR-conditional labelling and field strength.'
  },
  {
    ruleId: 'R-SAFETY-PROGRAMMABLE-SHUNT',
    band: 'needs-mri-physics-review',
    fires: (d) => d.safety.programmableShunt === true,
    description: 'Programmable CSF shunt present — confirm setting and re-programming after MRI.'
  },
  {
    ruleId: 'R-SAFETY-NEUROSTIMULATOR',
    band: 'needs-mri-physics-review',
    fires: (d) => d.safety.neurostimulator === true,
    description: 'Neurostimulator present — confirm MR-conditional labelling and protocol.'
  },
  {
    ruleId: 'R-SAFETY-INSULIN-PUMP',
    band: 'needs-mri-physics-review',
    fires: (d) => d.safety.insulinPump === true,
    description: 'Insulin pump or external infusion device — must be removed or confirmed MR-conditional.'
  },
  {
    ruleId: 'R-SAFETY-METAL-IMPLANT',
    band: 'conditional',
    fires: (d) => d.safety.metalImplantOrProsthesis === true,
    description: 'Metal implant or prosthesis present — confirm MR-conditional labelling and correct field strength.'
  }
];

/**
 * Evaluate the MRI safety band from the implant screen.
 *
 * @returns {{ band:string, firedRules:object[] }}
 */
function scoreSafety(data) {
  let band = 'cleared';
  const firedRules = [];

  for (const rule of SAFETY_RULES) {
    if (rule.fires(data)) {
      band = maxSafetyBand(band, rule.band);
      firedRules.push({
        ruleId: rule.ruleId,
        axis: 'safety',
        category: 'implant-screen',
        description: rule.description
      });
    }
  }

  // The referrer's preliminary "unsafe" view also escalates.
  if (data.safety.mriSafetyStatus === 'unsafe' && SAFETY_ORDER.indexOf(band) < SAFETY_ORDER.indexOf('needs-mri-physics-review')) {
    band = maxSafetyBand(band, 'needs-mri-physics-review');
    firedRules.push({
      ruleId: 'R-SAFETY-REFERRER-UNSAFE',
      axis: 'safety',
      category: 'implant-screen',
      description: 'Referrer flagged a preliminary unsafe status — MR physics review required.'
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-SAFETY-CLEARED',
      axis: 'safety',
      category: 'implant-screen',
      description: 'No positive MRI safety screen items recorded.'
    });
  }

  return { band, firedRules };
}

/**
 * Compare requested gadolinium contrast against eGFR (ESUR / RCR guidance).
 * eGFR < 30 -> contraindicated (NSF risk); 30-60 -> caution; else none.
 *
 * @returns {{ flag:string, firedRule:object|null }}
 */
function scoreContrastRenal(data) {
  const gad = data.contrast.contrastRequired === 'iv-gadolinium';
  if (!gad) {
    return { flag: 'none', firedRule: null };
  }
  const egfr = data.contrast.egfr;
  if (egfr === null || egfr === undefined || egfr === '') {
    return {
      flag: 'unknown',
      firedRule: {
        ruleId: 'R-SAFETY-CONTRAST-EGFR-UNKNOWN',
        axis: 'safety',
        category: 'contrast-renal',
        description: 'IV gadolinium requested but eGFR not recorded — obtain renal function before contrast.'
      }
    };
  }
  const n = Number(egfr);
  if (n < 30) {
    return {
      flag: 'contraindicated',
      firedRule: {
        ruleId: 'R-SAFETY-CONTRAST-EGFR-LT30',
        axis: 'safety',
        category: 'contrast-renal',
        description: 'IV gadolinium with eGFR < 30 — contraindicated (nephrogenic-systemic-fibrosis risk).'
      }
    };
  }
  if (n < 60) {
    return {
      flag: 'caution',
      firedRule: {
        ruleId: 'R-SAFETY-CONTRAST-EGFR-30-60',
        axis: 'safety',
        category: 'contrast-renal',
        description: 'IV gadolinium with eGFR 30-60 — use a group II / low-risk agent only when necessary.'
      }
    };
  }
  return { flag: 'none', firedRule: null };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------
//
// Each tracked field carries a weight. Indication, clinical question, and the
// MRI safety screen are weighted highest because they drive every other axis.
// Completeness is the percentage of weighted points present.

const COMPLETENESS_FIELDS = [
  { weight: 3, present: (d) => !!d.request.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
  { weight: 3, present: (d) => !!d.request.clinicalQuestion && d.request.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
  { weight: 3, present: (d) => !!d.safety.mriSafetyStatus, ruleId: 'R-COMPLETE-SAFETY-SCREEN', label: 'MRI safety screen status' },
  { weight: 2, present: (d) => !!d.request.bodyRegion, ruleId: 'R-COMPLETE-BODY-REGION', label: 'body region' },
  { weight: 2, present: (d) => !!d.contrast.contrastRequired, ruleId: 'R-COMPLETE-CONTRAST', label: 'contrast requirement' },
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
// Axis D — Triage priority (urgency / red-flag escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then an
// emergency indication (e.g. suspected stroke) auto-escalates it. The
// most-severe escalation wins.

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

// Indication-driven escalation rules, each forcing at least the given tier.
const TRIAGE_RULES = [
  {
    ruleId: 'R-TRIAGE-SUSPECTED-STROKE',
    tier: 'emergency',
    fires: (d) => d.request.primaryIndication === 'suspected-stroke',
    description: 'Suspected stroke — emergency imaging.'
  },
  {
    ruleId: 'R-TRIAGE-NEUROLOGICAL-DEFICIT',
    tier: 'urgent',
    fires: (d) => d.request.primaryIndication === 'neurological-deficit',
    description: 'Neurological deficit — urgent imaging.'
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
        category: 'escalation',
        description: rule.description
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-TRIAGE-REQUESTED',
      axis: 'triage',
      category: 'requested',
      description: `No escalation; triage follows the requested urgency (${tier}).`
    });
  }

  return {
    tier,
    targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
    firedRules
  };
}

Object.assign(NS, {
  scoreAppropriateness,
  appropriatenessBand,
  scoreSafety,
  scoreContrastRenal,
  maxSafetyBand,
  scoreCompleteness,
  scoreTriage,
  maxTier,
  TRIAGE_ORDER,
  TARGET_TIMEFRAMES,
  SAFETY_ORDER,
  INDICATION_REGION_MAP
});
})();
