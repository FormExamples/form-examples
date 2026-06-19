// Four-axis rule catalogue for the Urinalysis Test Request engine.
//
// Derived from sql-migrations 05/06: (A) appropriateness 1-9 + band by
// indication x requested-test match (NICE NG109 UTI, NICE NG12 haematuria,
// UK SMI B41); (B) pre-analytical specimen suitability ok/caution/reject-risk
// (UK SMI B41 specimen type / collected / timing / contamination); (C) request
// completeness over mandatory fields, clinical details + indication weighted
// highest; (D) triage tier routine/urgent/stat with red-flag auto-escalation
// (visible haematuria; fever + loin pain -> suspected pyelonephritis). Rule IDs
// are stable and identical across every front-end and the back-end
// (R-APPROP-*, R-PREANALYTICAL-*, R-COMPLETE-*, R-TRIAGE-*). Pure data +
// helpers; the grader composes them.
//
// Wrapped in an IIFE; published via `window.UrinalysisTestRequest`.

(function () {
'use strict';
window.UrinalysisTestRequest = window.UrinalysisTestRequest || {};
const NS = window.UrinalysisTestRequest;
const { countSelectedTests, selectedTestFields } = NS;

// ----------------------------------------------------------------------
// Axis A — Appropriateness (indication-to-test match, 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal test (or set of tests) and a set of plausible
// tests. When at least one requested test is the recommended test for the
// indication, the request scores high (7-9, usually-appropriate). When only
// plausible tests are requested it scores in the 4-6 may-be-appropriate band;
// a clearly mismatched panel scores 1-3. A request with no test selected has
// nothing to order and is treated as usually-not-appropriate.

// Map of indication -> { ideal:[testField], plausible:[testField] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_TEST_MAP = {
  'suspected-uti':        { ideal: ['dipstick', 'microscopyCultureSensitivity'], plausible: ['pregnancyTest'] },
  'haematuria':           { ideal: ['microscopyCultureSensitivity', 'cytology'], plausible: ['dipstick', 'proteinCreatinineRatio'] },
  'proteinuria':          { ideal: ['proteinCreatinineRatio', 'albuminCreatinineRatio'], plausible: ['dipstick', 'twentyFourHourCollection'] },
  'diabetes-monitoring':  { ideal: ['albuminCreatinineRatio'], plausible: ['dipstick', 'proteinCreatinineRatio'] },
  'renal-monitoring':     { ideal: ['albuminCreatinineRatio', 'proteinCreatinineRatio'], plausible: ['dipstick', 'twentyFourHourCollection'] },
  'pregnancy-screen':     { ideal: ['pregnancyTest'], plausible: ['dipstick'] },
  'pre-operative':        { ideal: ['dipstick', 'pregnancyTest'], plausible: ['microscopyCultureSensitivity'] },
  'catheter-related':     { ideal: ['microscopyCultureSensitivity'], plausible: ['dipstick'] },
  'suspected-malignancy': { ideal: ['cytology'], plausible: ['microscopyCultureSensitivity', 'twentyFourHourCollection'] },
  'drug-monitoring':      { ideal: ['drugScreen'], plausible: [] },
  'other':                { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x requested-tests pairing and
 * return the fired rule. A request with no test selected scores low. Defaults
 * to a neutral may-be-appropriate when the indication has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, tests) {
  const selected = selectedTestFields(tests);

  if (selected.length === 0) {
    return {
      score: 1,
      band: 'usually-not-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-NO-TEST',
        axis: 'appropriateness',
        category: 'no-test-selected',
        description: 'No test selected on the panel — there is nothing to order.'
      }
    };
  }

  if (!indication) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: 'unspecified',
        description: 'Primary indication not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_TEST_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  const hasIdeal = selected.some((t) => map.ideal.includes(t));
  const hasPlausible = selected.some((t) => map.plausible.includes(t));

  if (hasIdeal) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested panel includes the recommended test for "${indication}".`
      }
    };
  }
  if (hasPlausible) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested panel may be appropriate for "${indication}" but omits the first-line test.`
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
      description: `Requested panel is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Pre-analytical specimen suitability (UK SMI B41)
// ----------------------------------------------------------------------
//
// Specimen type / collected / timing / contamination risk drive the band:
//   ok          — specimen collected, suitable type, no contamination concern
//   caution     — collected but a handling / type caveat applies
//   reject-risk — specimen not collected, or a type / pathway mismatch that
//                 risks rejection at the bench
// The advisory note carries the specific UK SMI B41 handling guidance.

/**
 * Evaluate pre-analytical specimen suitability.
 *
 * @returns {{ band:string, note:string, firedRule:object }}
 */
function scorePreanalytical(data) {
  const sp = data.specimen;
  const ctx = data.context;
  const tests = data.tests;

  // Not collected yet -> reject-risk; request cannot proceed at the bench.
  if (sp.specimenCollected === 'no') {
    return {
      band: 'reject-risk',
      note: 'Specimen not yet collected. Collect an appropriate specimen; if >4 h to laboratory, refrigerate or use a boric-acid container (UK SMI B41).',
      firedRule: {
        ruleId: 'R-PREANALYTICAL-NOT-COLLECTED',
        axis: 'preanalytical',
        category: 'not-collected',
        description: 'Specimen not yet collected — pre-analytical suitability cannot be assured.'
      }
    };
  }

  if (sp.specimenCollected !== 'yes') {
    return {
      band: '',
      note: 'Specimen collection status not yet recorded.',
      firedRule: {
        ruleId: 'R-PREANALYTICAL-UNKNOWN',
        axis: 'preanalytical',
        category: 'unspecified',
        description: 'Specimen collection status not yet specified — pre-analytical band not assessed.'
      }
    };
  }

  // Collected, but catheter / culture pathway caveat (asymptomatic bacteriuria).
  if (
    sp.specimenType === 'catheter' &&
    tests.microscopyCultureSensitivity === true
  ) {
    return {
      band: 'caution',
      note: 'Catheter specimen (CSU) for culture — interpret with caution; do not culture asymptomatic catheterised patients (UK SMI B41).',
      firedRule: {
        ruleId: 'R-PREANALYTICAL-CSU-CULTURE',
        axis: 'preanalytical',
        category: 'specimen-type',
        description: 'Catheter specimen requested for culture; asymptomatic bacteriuria caveats apply.'
      }
    };
  }

  // Collected on antibiotics may suppress culture growth.
  if (ctx.currentAntibiotics === true && tests.microscopyCultureSensitivity === true) {
    return {
      band: 'caution',
      note: 'Patient on antibiotics; culture growth may be suppressed. Note antibiotic on the request (UK SMI B41).',
      firedRule: {
        ruleId: 'R-PREANALYTICAL-ON-ANTIBIOTICS',
        axis: 'preanalytical',
        category: 'modifier',
        description: 'Specimen for culture taken while on antibiotics; growth may be suppressed.'
      }
    };
  }

  // Random specimen for an ACR is sub-optimal (early-morning preferred).
  if (sp.specimenType === 'random' && tests.albuminCreatinineRatio === true) {
    return {
      band: 'caution',
      note: 'Random specimen for ACR; an early-morning specimen is preferred for albuminuria assessment (NICE NG203).',
      firedRule: {
        ruleId: 'R-PREANALYTICAL-ACR-TIMING',
        axis: 'preanalytical',
        category: 'timing',
        description: 'ACR requested on a random specimen; early-morning specimen preferred.'
      }
    };
  }

  return {
    band: 'ok',
    note: 'Specimen collected and suitable. Transport within 4 h or refrigerate / use boric acid up to 48 h (UK SMI B41).',
    firedRule: {
      ruleId: 'R-PREANALYTICAL-OK',
      axis: 'preanalytical',
      category: 'suitable',
      description: 'Specimen collected and pre-analytically suitable.'
    }
  };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------
//
// Each tracked field carries a weight. Clinical details and indication are
// weighted highest because they drive every other axis. Completeness is the
// percentage of weighted points present.

const COMPLETENESS_FIELDS = [
  { weight: 3, present: (d) => !!d.context.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
  { weight: 3, present: (d) => !!d.context.clinicalDetails && d.context.clinicalDetails.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-DETAILS', label: 'clinical details' },
  { weight: 2, present: (d) => countSelectedTests(d.tests) > 0, ruleId: 'R-COMPLETE-TESTS', label: 'requested tests' },
  { weight: 2, present: (d) => !!d.specimen.specimenType, ruleId: 'R-COMPLETE-SPECIMEN-TYPE', label: 'specimen type' },
  { weight: 1, present: (d) => !!d.specimen.specimenCollected, ruleId: 'R-COMPLETE-SPECIMEN-COLLECTED', label: 'specimen collected status' },
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
  'routine': 'Within standard laboratory turnaround',
  'urgent': 'Same day / within 24 hours',
  'stat': 'Immediate / on-call laboratory'
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
    fires: (d) => d.symptoms.fever === true && d.symptoms.loinPain === true,
    description: 'Fever with loin pain — possible pyelonephritis / urosepsis; expedite.'
  },
  {
    ruleId: 'R-TRIAGE-VISIBLE-HAEMATURIA',
    tier: 'urgent',
    fires: (d) => d.symptoms.visibleHaematuria === true,
    description: 'Visible haematuria — expedited assessment and NICE NG12 consideration.'
  },
  {
    ruleId: 'R-TRIAGE-FEVER',
    tier: 'urgent',
    fires: (d) => d.symptoms.fever === true,
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
  maxTier,
  TRIAGE_ORDER,
  TARGET_TIMEFRAMES,
  INDICATION_TEST_MAP
});
})();
