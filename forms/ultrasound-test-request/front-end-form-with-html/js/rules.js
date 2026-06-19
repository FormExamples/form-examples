// Four-axis rule catalogue for the (general, non-obstetric) Ultrasound Test
// Request engine.
//
// Derived from index.md and SQL migration 05: (A) appropriateness 1-9 + band
// by body-region x indication; (B) preparation / technical suitability
// (ok / caution / limited) plus prep requirements; (C) request completeness
// over mandatory fields; (D) triage tier (routine / urgent / emergency) with
// red-flag auto-escalation (suspected DVT / testicular torsion / AAA). Rule
// IDs are stable and identical across every front-end and the back-end
// (R-APPROP-*, R-SUIT-*, R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers; the
// grader composes them.
//
// Wrapped in an IIFE; published via `window.UltrasoundTestRequest`.

(function () {
'use strict';
window.UltrasoundTestRequest =
  window.UltrasoundTestRequest || {};
const NS = window.UltrasoundTestRequest;

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACR Appropriateness Criteria 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal body region (or set of regions). When the
// requested region matches the indication well, the request scores high
// (7-9, usually-appropriate). Plausible-but-suboptimal pairings score in the
// 4-6 may-be-appropriate band; clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[bodyRegion], plausible:[bodyRegion] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_REGION_MAP = {
  'abdominal-pain':       { ideal: ['abdomen', 'liver-biliary', 'renal-tract'], plausible: ['pelvis'] },
  'suspected-gallstones': { ideal: ['liver-biliary', 'abdomen'], plausible: [] },
  'abnormal-lfts':        { ideal: ['liver-biliary', 'abdomen'], plausible: [] },
  'renal-impairment':     { ideal: ['renal-tract', 'abdomen'], plausible: ['pelvis'] },
  'haematuria':           { ideal: ['renal-tract'], plausible: ['abdomen', 'pelvis'] },
  'palpable-mass':        { ideal: ['soft-tissue', 'thyroid-neck', 'breast', 'abdomen', 'pelvis', 'scrotum-testes'], plausible: ['msk-joint'] },
  'suspected-dvt':        { ideal: ['dvt-leg'], plausible: ['vascular-doppler'] },
  'suspected-aaa':        { ideal: ['abdomen', 'vascular-doppler'], plausible: [] },
  'thyroid-nodule':       { ideal: ['thyroid-neck'], plausible: [] },
  'testicular-pain':      { ideal: ['scrotum-testes'], plausible: [] },
  'follow-up':            { ideal: ['abdomen', 'pelvis', 'renal-tract', 'liver-biliary', 'thyroid-neck', 'scrotum-testes', 'breast', 'soft-tissue', 'vascular-doppler', 'carotid', 'msk-joint'], plausible: [] },
  'other':                { ideal: [], plausible: [] }
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
        description: `Requested ${bodyRegion} scan is the recommended examination for "${indication}".`
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
        description: `Requested ${bodyRegion} scan may be appropriate for "${indication}" but is not the first-line examination.`
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
      description: `Requested ${bodyRegion} scan is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Preparation / technical suitability (BMUS / AIUM practice)
// ----------------------------------------------------------------------
//
// Each body region carries an expected preparation. The engine compares the
// expected preparation against what the requester recorded, and folds in a
// body-habitus caveat (high BMI degrades acoustic windows). Suitability band
// is ok / caution / limited and a human-readable prep-requirements string is
// emitted alongside.

// Expected preparation per body region.
//   fasting  -> fasting required for upper-abdominal / biliary windows
//   bladder  -> full bladder required for pelvic / lower-urinary-tract windows
const REGION_PREP = {
  'abdomen':          { fasting: true,  bladder: false, note: 'Fast 6 hours before an upper-abdominal scan.' },
  'liver-biliary':    { fasting: true,  bladder: false, note: 'Fast 6 hours before a hepatobiliary scan to distend the gallbladder.' },
  'renal-tract':      { fasting: false, bladder: true,  note: 'Attend with a comfortably full bladder for the lower urinary tract.' },
  'pelvis':           { fasting: false, bladder: true,  note: 'Attend with a full bladder for a transabdominal pelvic scan.' },
  'thyroid-neck':     { fasting: false, bladder: false, note: 'No specific preparation required.' },
  'scrotum-testes':   { fasting: false, bladder: false, note: 'No specific preparation required.' },
  'breast':           { fasting: false, bladder: false, note: 'No specific preparation required.' },
  'soft-tissue':      { fasting: false, bladder: false, note: 'No specific preparation required.' },
  'vascular-doppler': { fasting: false, bladder: false, note: 'No specific preparation required.' },
  'dvt-leg':          { fasting: false, bladder: false, note: 'No specific preparation required.' },
  'carotid':          { fasting: false, bladder: false, note: 'No specific preparation required.' },
  'msk-joint':        { fasting: false, bladder: false, note: 'No specific preparation required.' },
  'other':            { fasting: false, bladder: false, note: '' }
};

// BMI threshold above which acoustic windows are technically limited.
const HIGH_BMI = 35;
const MODERATE_BMI = 30;

/**
 * Evaluate preparation / technical suitability for the requested examination.
 *
 * @returns {{ band:string, prepRequirements:string, firedRules:object[] }}
 */
function evaluateSuitability(data) {
  const region = data.request.bodyRegion;
  const firedRules = [];

  if (!region) {
    return {
      band: '',
      prepRequirements: '',
      firedRules: [{
        ruleId: 'R-SUIT-UNSPECIFIED',
        axis: 'suitability',
        category: 'unspecified',
        description: 'Body region not yet specified — technical suitability not assessed.'
      }]
    };
  }

  const expected = REGION_PREP[region] || { fasting: false, bladder: false, note: '' };
  const regionKey = region.toUpperCase().replace(/[^A-Z]+/g, '-');
  const reqs = [];
  let band = 'ok';

  if (expected.note) reqs.push(expected.note);

  // Compare expected prep against what the requester recorded.
  if (expected.fasting && data.preparation.fastingRequired !== true) {
    band = maxBand(band, 'caution');
    firedRules.push({
      ruleId: `R-SUIT-${regionKey}-FASTING-MISSING`,
      axis: 'suitability',
      category: 'prep',
      description: `Fasting is expected for a ${region} scan but was not flagged on the request.`
    });
  } else if (expected.fasting) {
    firedRules.push({
      ruleId: `R-SUIT-${regionKey}-FASTING-OK`,
      axis: 'suitability',
      category: 'prep',
      description: `Fasting preparation correctly flagged for a ${region} scan.`
    });
  }

  if (expected.bladder && data.preparation.fullBladderRequired !== true) {
    band = maxBand(band, 'caution');
    firedRules.push({
      ruleId: `R-SUIT-${regionKey}-BLADDER-MISSING`,
      axis: 'suitability',
      category: 'prep',
      description: `A full bladder is expected for a ${region} scan but was not flagged on the request.`
    });
  } else if (expected.bladder) {
    firedRules.push({
      ruleId: `R-SUIT-${regionKey}-BLADDER-OK`,
      axis: 'suitability',
      category: 'prep',
      description: `Full-bladder preparation correctly flagged for a ${region} scan.`
    });
  }

  // Body-habitus caveat.
  const bmi = data.patient.bodyMassIndex;
  if (bmi !== null && bmi !== undefined && bmi !== '') {
    const n = Number(bmi);
    if (!Number.isNaN(n) && n >= HIGH_BMI) {
      band = maxBand(band, 'limited');
      reqs.push('High body mass index may technically limit acoustic windows.');
      firedRules.push({
        ruleId: 'R-SUIT-HIGH-BMI',
        axis: 'suitability',
        category: 'body-habitus',
        description: `Body mass index ${n} may significantly limit ultrasound image quality.`
      });
    } else if (!Number.isNaN(n) && n >= MODERATE_BMI) {
      band = maxBand(band, 'caution');
      reqs.push('Raised body mass index may reduce acoustic window quality.');
      firedRules.push({
        ruleId: 'R-SUIT-RAISED-BMI',
        axis: 'suitability',
        category: 'body-habitus',
        description: `Raised body mass index ${n} may reduce ultrasound image quality.`
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: `R-SUIT-${regionKey}-OK`,
      axis: 'suitability',
      category: 'prep',
      description: `No preparation or technical concerns for a ${region} scan.`
    });
  }

  return {
    band,
    prepRequirements: reqs.join(' '),
    firedRules
  };
}

const SUITABILITY_ORDER = ['ok', 'caution', 'limited'];

/** Return whichever of two suitability bands is more limiting. */
function maxBand(a, b) {
  const ia = SUITABILITY_ORDER.indexOf(a);
  const ib = SUITABILITY_ORDER.indexOf(b);
  return ia >= ib ? a : b;
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
  { weight: 2, present: (d) => !!d.request.bodyRegion, ruleId: 'R-COMPLETE-BODY-REGION', label: 'body region' },
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
// Axis D — Triage priority (red-flag escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then red flags
// auto-escalate it. The most-severe escalation wins.

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
    ruleId: 'R-TRIAGE-SUSPECTED-TESTICULAR-TORSION',
    tier: 'emergency',
    fires: (d) => d.symptoms.suspectedTesticularTorsion === true,
    description: 'Suspected testicular torsion — emergency assessment; torsion is a surgical emergency.'
  },
  {
    ruleId: 'R-TRIAGE-SUSPECTED-AAA',
    tier: 'emergency',
    fires: (d) => d.symptoms.suspectedAaa === true,
    description: 'Suspected abdominal aortic aneurysm — emergency assessment; exclude rupture / leak.'
  },
  {
    ruleId: 'R-TRIAGE-SUSPECTED-DVT',
    tier: 'urgent',
    fires: (d) => d.symptoms.suspectedDvt === true,
    description: 'Suspected deep-vein thrombosis — urgent Doppler within the local DVT pathway.'
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
        category: 'red-flag',
        description: rule.description
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-TRIAGE-REQUESTED',
      axis: 'triage',
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

Object.assign(NS, {
  scoreAppropriateness,
  appropriatenessBand,
  evaluateSuitability,
  scoreCompleteness,
  scoreTriage,
  maxTier,
  maxBand,
  TRIAGE_ORDER,
  TARGET_TIMEFRAMES,
  SUITABILITY_ORDER,
  REGION_PREP,
  INDICATION_REGION_MAP
});
})();
