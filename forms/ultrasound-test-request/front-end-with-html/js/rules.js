// Four-axis rule catalogue for the Ultrasound Test Request engine
// (general, non-obstetric diagnostic ultrasound).
//
// Derived from index.md: (A) appropriateness 1-9 + band by body region x
// indication (ACR Appropriateness Criteria); (B) preparation / technical
// suitability ok/caution/limited + prep requirements; (C) request
// completeness over mandatory fields; (D) triage tier routine/urgent/
// emergency with red-flag auto-escalation (suspected DVT, suspected
// testicular torsion, suspected AAA). Rule IDs are stable and identical
// across every front-end and the back-end (R-APPROP-*, R-SUIT-*,
// R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers; the grader composes them.
//
// Wrapped in an IIFE; published via `window.UltrasoundTestRequest`.

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
  'renal-impairment':     { ideal: ['renal-tract'], plausible: ['abdomen'] },
  'haematuria':           { ideal: ['renal-tract'], plausible: ['pelvis', 'abdomen'] },
  'palpable-mass':        { ideal: ['soft-tissue', 'thyroid-neck', 'breast', 'abdomen', 'pelvis'], plausible: ['scrotum-testes', 'msk-joint'] },
  'suspected-dvt':        { ideal: ['dvt-leg'], plausible: ['vascular-doppler'] },
  'suspected-aaa':        { ideal: ['abdomen', 'vascular-doppler'], plausible: [] },
  'thyroid-nodule':       { ideal: ['thyroid-neck'], plausible: ['soft-tissue'] },
  'testicular-pain':      { ideal: ['scrotum-testes'], plausible: [] },
  'follow-up':            { ideal: ['abdomen', 'liver-biliary', 'renal-tract', 'pelvis', 'thyroid-neck', 'scrotum-testes', 'breast', 'soft-tissue', 'vascular-doppler', 'carotid', 'msk-joint'], plausible: [] },
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
        description: `Requested ${bodyRegion} ultrasound is the recommended examination for "${indication}".`
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
        description: `Requested ${bodyRegion} ultrasound may be appropriate for "${indication}" but is not the first-line examination.`
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
      description: `Requested ${bodyRegion} ultrasound is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Preparation / technical suitability (BMUS / AIUM)
// ----------------------------------------------------------------------
//
// Each body region has expected preparation. The engine compares the
// preparation the clinician has flagged against what the region needs, and
// folds in a body-habitus caveat from BMI. The band is ok / caution /
// limited and a human-readable prep-requirements string is produced.

// Expected preparation per body region.
const REGION_PREP = {
  'abdomen':          { fasting: true,  fullBladder: false, note: 'Fasting 6 hours for upper-abdominal / biliary views.' },
  'liver-biliary':    { fasting: true,  fullBladder: false, note: 'Fasting 6 hours to distend the gallbladder.' },
  'renal-tract':      { fasting: false, fullBladder: true,  note: 'Full bladder for the lower urinary tract.' },
  'pelvis':           { fasting: false, fullBladder: true,  note: 'Full bladder for a transabdominal pelvic view.' },
  'thyroid-neck':     { fasting: false, fullBladder: false, note: 'No specific preparation.' },
  'scrotum-testes':   { fasting: false, fullBladder: false, note: 'No specific preparation.' },
  'breast':           { fasting: false, fullBladder: false, note: 'No specific preparation.' },
  'soft-tissue':      { fasting: false, fullBladder: false, note: 'No specific preparation.' },
  'vascular-doppler': { fasting: false, fullBladder: false, note: 'No specific preparation.' },
  'dvt-leg':          { fasting: false, fullBladder: false, note: 'No specific preparation.' },
  'carotid':          { fasting: false, fullBladder: false, note: 'No specific preparation.' },
  'msk-joint':        { fasting: false, fullBladder: false, note: 'No specific preparation.' },
  'other':            { fasting: false, fullBladder: false, note: 'Confirm preparation with the imaging department.' }
};

const HIGH_BMI_THRESHOLD = 35; // body-habitus caveat for technical quality

/**
 * Evaluate preparation / technical suitability for the requested region.
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
        ruleId: 'R-SUIT-UNKNOWN',
        axis: 'suitability',
        category: 'unspecified',
        description: 'Body region not yet specified — suitability not assessed.'
      }]
    };
  }

  const expected = REGION_PREP[region] || REGION_PREP['other'];
  const regionKey = region.toUpperCase().replace(/[^A-Z]+/g, '-');
  let band = 'ok';
  const prepParts = [expected.note];

  // Caution when required preparation has not been flagged on the request.
  if (expected.fasting && data.prep.fastingRequired !== true) {
    band = 'caution';
    firedRules.push({
      ruleId: `R-SUIT-${regionKey}-FASTING-NOT-FLAGGED`,
      axis: 'suitability',
      category: 'prep',
      description: `A ${region} scan usually needs fasting, but the request does not flag fasting required.`
    });
  }
  if (expected.fullBladder && data.prep.fullBladderRequired !== true) {
    band = 'caution';
    firedRules.push({
      ruleId: `R-SUIT-${regionKey}-BLADDER-NOT-FLAGGED`,
      axis: 'suitability',
      category: 'prep',
      description: `A ${region} scan usually needs a full bladder, but the request does not flag full bladder required.`
    });
  }

  // Body-habitus caveat — high BMI can limit deep abdominal / pelvic views.
  const bmi = data.patient.bodyMassIndex;
  const deepRegion = ['abdomen', 'liver-biliary', 'renal-tract', 'pelvis', 'vascular-doppler'].includes(region);
  if (bmi !== null && bmi !== undefined && bmi !== '' && Number(bmi) >= HIGH_BMI_THRESHOLD && deepRegion) {
    band = 'limited';
    firedRules.push({
      ruleId: 'R-SUIT-HIGH-BMI',
      axis: 'suitability',
      category: 'body-habitus',
      description: `Raised BMI (${Number(bmi)} kg/m²) may technically limit a deep ${region} ultrasound.`
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: `R-SUIT-${regionKey}-OK`,
      axis: 'suitability',
      category: 'prep',
      description: `Preparation requirements are met for a ${region} scan.`
    });
  }

  if (expected.fasting) prepParts.push('Fasting required.');
  if (expected.fullBladder) prepParts.push('Full bladder required.');

  return {
    band,
    prepRequirements: prepParts.join(' '),
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
// A base tier is taken from the clinician's requested urgency, then red
// flags auto-escalate it. The most-severe escalation wins.

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
    ruleId: 'R-TRIAGE-SUSPECTED-TORSION',
    tier: 'emergency',
    fires: (d) => d.redFlags.suspectedTesticularTorsion === true,
    description: 'Suspected testicular torsion — emergency Doppler; surgical window is short.'
  },
  {
    ruleId: 'R-TRIAGE-SUSPECTED-AAA',
    tier: 'emergency',
    fires: (d) => d.redFlags.suspectedAaa === true,
    description: 'Suspected abdominal aortic aneurysm — emergency assessment.'
  },
  {
    ruleId: 'R-TRIAGE-SUSPECTED-DVT',
    tier: 'urgent',
    fires: (d) => d.redFlags.suspectedDvt === true,
    description: 'Suspected DVT — urgent leg-vein Doppler.'
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

export { scoreAppropriateness, appropriatenessBand, evaluateSuitability, scoreCompleteness, scoreTriage, maxTier, TRIAGE_ORDER, TARGET_TIMEFRAMES, REGION_PREP, INDICATION_REGION_MAP };
