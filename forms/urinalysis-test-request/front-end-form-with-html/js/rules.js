// Four-axis rule catalogue for the Urinalysis Test Request engine.
//
// Derived from index.md and the SQL grade tables: (A) appropriateness 1-9 +
// band by indication x requested-test match (NICE NG109, NICE NG12, UK SMI
// B41); (B) preanalytical specimen suitability ok/caution/reject-risk;
// (C) request completeness over mandatory fields; (D) triage tier
// routine/urgent/stat with red-flag auto-escalation. Rule IDs are stable and
// identical across every front-end and the back-end (R-APPROP-*, R-PREANALYTICAL-*,
// R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers; the grader composes them.
//
// Wrapped in an IIFE; published via `window.UrinalysisTestRequest`.

(function () {
'use strict';
window.UrinalysisTestRequest = window.UrinalysisTestRequest || {};
const NS = window.UrinalysisTestRequest;

// ----------------------------------------------------------------------
// Axis A — Appropriateness (1-9 ordinal, indication-to-test match)
// ----------------------------------------------------------------------
//
// Each indication has a set of ideal tests (first-line, guideline-aligned)
// and plausible tests (defensible but not first-line). A request is scored on
// the best-matching selected test. Anything not listed for an indication is a
// mismatch.

const INDICATION_TEST_MAP = {
  'suspected-uti':        { ideal: ['dipstick', 'microscopyCultureSensitivity'], plausible: ['pregnancyTest'] },
  'haematuria':           { ideal: ['dipstick', 'microscopyCultureSensitivity', 'cytology'], plausible: [] },
  'proteinuria':          { ideal: ['proteinCreatinineRatio', 'albuminCreatinineRatio'], plausible: ['dipstick', 'twentyFourHourCollection'] },
  'diabetes-monitoring':  { ideal: ['albuminCreatinineRatio'], plausible: ['dipstick', 'proteinCreatinineRatio'] },
  'renal-monitoring':     { ideal: ['albuminCreatinineRatio', 'proteinCreatinineRatio'], plausible: ['dipstick', 'twentyFourHourCollection', 'microscopyCultureSensitivity'] },
  'pregnancy-screen':     { ideal: ['pregnancyTest'], plausible: ['dipstick', 'microscopyCultureSensitivity'] },
  'pre-operative':        { ideal: ['dipstick', 'pregnancyTest'], plausible: ['microscopyCultureSensitivity'] },
  'catheter-related':     { ideal: ['microscopyCultureSensitivity'], plausible: ['dipstick'] },
  'suspected-malignancy': { ideal: ['cytology', 'microscopyCultureSensitivity'], plausible: ['dipstick'] },
  'drug-monitoring':      { ideal: ['drugScreen'], plausible: [] },
  'other':                { ideal: [], plausible: [] }
};

/** List the camelCase keys of the currently-selected tests. */
function selectedTestFields(data) {
  const t = data.tests || {};
  return Object.keys(t).filter((k) => t[k] === true);
}

/**
 * Score appropriateness (1-9) for the indication x selected-tests pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or test panel has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(data) {
  const indication = data.context.primaryIndication;
  const selected = selectedTestFields(data);

  if (!indication || selected.length === 0) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or requested tests not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_TEST_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  const matchesIdeal = selected.some((f) => map.ideal.includes(f));
  const matchesPlausible = selected.some((f) => map.plausible.includes(f));

  if (matchesIdeal) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `A first-line test was requested for "${indication}".`
      }
    };
  }
  if (matchesPlausible) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `A requested test may be appropriate for "${indication}" but is not the first-line investigation.`
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
      description: `The requested tests are not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Preanalytical specimen suitability (UK SMI B41)
// ----------------------------------------------------------------------
//
// Bands: ok / caution / reject-risk. Driven by whether a specimen has been
// collected, the specimen type, contamination / asymptomatic-bacteriuria
// risk (catheter), and antibiotic suppression of culture growth.

/**
 * Evaluate the preanalytical specimen-suitability band, an advisory note, and
 * the fired rules.
 *
 * @returns {{ band:string, note:string, firedRules:object[] }}
 */
function scorePreanalytical(data) {
  const firedRules = [];
  const sp = data.specimen;
  const cultureRequested = data.tests.microscopyCultureSensitivity === true ||
    data.tests.cytology === true;

  let band = 'ok';
  let note = 'Specimen handling appears acceptable.';

  const push = (band2, note2, rule) => {
    band = worseBand(band, band2);
    if (note2) note = note2;
    if (rule) firedRules.push(rule);
  };

  if (sp.specimenCollected === 'no') {
    push('reject-risk', 'Specimen not yet collected; the request cannot proceed until a sample is provided.', {
      ruleId: 'R-PREANALYTICAL-NOT-COLLECTED',
      axis: 'preanalytical',
      category: 'specimen-not-collected',
      description: 'Specimen has not been collected; cannot be processed.'
    });
  }

  if (cultureRequested && sp.specimenType === 'random') {
    push('caution', 'A random specimen is sub-optimal for culture; prefer a midstream (MSU) or clean-catch sample.', {
      ruleId: 'R-PREANALYTICAL-RANDOM-FOR-CULTURE',
      axis: 'preanalytical',
      category: 'contamination-risk',
      description: 'Random specimen requested for culture; contamination / contamination-risk per UK SMI B41.'
    });
  }

  if (data.context.catheterised === true && data.tests.microscopyCultureSensitivity === true) {
    push('caution', 'Catheter specimen (CSU): interpret culture with caution; asymptomatic bacteriuria is common and not usually treated.', {
      ruleId: 'R-PREANALYTICAL-CATHETER',
      axis: 'preanalytical',
      category: 'catheter',
      description: 'Catheterised patient with culture requested; asymptomatic bacteriuria caveat.'
    });
  }

  if (data.context.currentAntibiotics === true && data.tests.microscopyCultureSensitivity === true) {
    push('caution', 'Current antibiotics may suppress culture growth; note antibiotic on the request and consider timing.', {
      ruleId: 'R-PREANALYTICAL-ON-ANTIBIOTICS',
      axis: 'preanalytical',
      category: 'antibiotics',
      description: 'Culture requested while on antibiotics; growth may be suppressed.'
    });
  }

  if (data.tests.twentyFourHourCollection === true) {
    push('caution', '24-hour collection: ensure correct container, complete collection, and prompt delivery — preanalytical handling is critical.', {
      ruleId: 'R-PREANALYTICAL-24H',
      axis: 'preanalytical',
      category: 'handling',
      description: '24-hour collection requested; handling and completeness are critical.'
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-PREANALYTICAL-OK',
      axis: 'preanalytical',
      category: 'specimen',
      description: 'No preanalytical concerns detected for the requested tests.'
    });
  }

  return { band, note, firedRules };
}

const PREANALYTICAL_ORDER = ['ok', 'caution', 'reject-risk'];

/** Return whichever of two preanalytical bands is worse (more severe). */
function worseBand(a, b) {
  const ia = PREANALYTICAL_ORDER.indexOf(a);
  const ib = PREANALYTICAL_ORDER.indexOf(b);
  return ib > ia ? b : a;
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------
//
// Each tracked field carries a weight. Indication and clinical details are
// weighted highest because they drive every other axis. Completeness is the
// percentage of weighted points present.

const COMPLETENESS_FIELDS = [
  { weight: 3, present: (d) => !!d.context.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
  { weight: 3, present: (d) => !!d.context.clinicalDetails && d.context.clinicalDetails.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-DETAILS', label: 'clinical details' },
  { weight: 2, present: (d) => selectedTestFields(d).length > 0, ruleId: 'R-COMPLETE-TESTS', label: 'requested tests' },
  { weight: 2, present: (d) => !!d.specimen.specimenType, ruleId: 'R-COMPLETE-SPECIMEN-TYPE', label: 'specimen type' },
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

const TRIAGE_ORDER = ['routine', 'urgent', 'stat'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 5-7 working days',
  'urgent': 'Within 24-48 hours',
  'stat': 'Same day / immediate'
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
    ruleId: 'R-TRIAGE-PYELONEPHRITIS',
    tier: 'stat',
    fires: (d) => d.symptoms.symptomFever === true && d.symptoms.symptomLoinPain === true,
    description: 'Fever with loin pain — possible pyelonephritis / urosepsis; immediate assessment.'
  },
  {
    ruleId: 'R-TRIAGE-VISIBLE-HAEMATURIA',
    tier: 'urgent',
    fires: (d) => d.symptoms.symptomVisibleHaematuria === true,
    description: 'Visible haematuria — expedite culture / cytology and assessment.'
  },
  {
    ruleId: 'R-TRIAGE-FEVER',
    tier: 'urgent',
    fires: (d) => d.symptoms.symptomFever === true,
    description: 'Fever / systemic symptoms — expedited assessment.'
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
  scorePreanalytical,
  scoreCompleteness,
  scoreTriage,
  selectedTestFields,
  maxTier,
  worseBand,
  TRIAGE_ORDER,
  TARGET_TIMEFRAMES,
  PREANALYTICAL_ORDER,
  INDICATION_TEST_MAP
});
})();
