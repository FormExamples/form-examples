import { TESTS, countSelectedTests } from './types.js';

// Four-axis rule catalogue for the Coagulation Test Request engine.
//
// Derived from index.md and sql/05: (A) appropriateness 1-9 + band by
// indication x selected-tests match (BSH indication / retest-interval anchor);
// (B) pre-analytical / specimen safety ok / caution / reject-risk (sodium-citrate
// tube fill, 9:1 ratio, analysis timing); (C) request completeness over
// mandatory fields; (D) triage tier routine / urgent / stat with active-bleeding
// and suspected-DIC auto-escalation to stat. Rule IDs are stable and identical
// across every front-end and the back-end (R-APPROP-*, R-PREANALYTICAL-*,
// R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers; the grader composes them.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (BSH indication / retest-interval anchor, 1-9)
// ----------------------------------------------------------------------
//
// Each indication has an ideal set of coagulation tests and a plausible set.
// When the selected tests include an ideal test for the indication the request
// scores high (7-9, usually-appropriate). Plausible-only selections score in
// the 4-6 may-be-appropriate band; clearly mismatched selections score 1-3.
// A request with no test selected cannot be appropriate (score 1).

// Map of indication -> { ideal:[testField], plausible:[testField] }.
const INDICATION_TEST_MAP = {
  'anticoagulation-monitoring':              { ideal: ['prothrombinTimeInr', 'antiXaAssay', 'activatedPartialThromboplastinTime'], plausible: ['fibrinogen'] },
  'bleeding-disorder':                       { ideal: ['factorAssays', 'vonWillebrandScreen', 'mixingStudies'], plausible: ['prothrombinTimeInr', 'activatedPartialThromboplastinTime', 'fibrinogen'] },
  'suspected-dvt-pe':                        { ideal: ['dDimer'], plausible: ['fibrinogen'] },
  'pre-operative':                           { ideal: ['prothrombinTimeInr', 'activatedPartialThromboplastinTime'], plausible: ['fibrinogen', 'factorAssays'] },
  'thrombophilia-investigation':             { ideal: ['thrombophiliaScreen'], plausible: ['dDimer', 'antiXaAssay'] },
  'liver-disease':                           { ideal: ['prothrombinTimeInr', 'fibrinogen'], plausible: ['activatedPartialThromboplastinTime', 'factorAssays'] },
  'disseminated-intravascular-coagulation':  { ideal: ['prothrombinTimeInr', 'activatedPartialThromboplastinTime', 'fibrinogen', 'dDimer'], plausible: ['factorAssays'] },
  'abnormal-bleeding':                       { ideal: ['prothrombinTimeInr', 'activatedPartialThromboplastinTime', 'vonWillebrandScreen'], plausible: ['fibrinogen', 'factorAssays', 'mixingStudies'] },
  'other':                                   { ideal: [], plausible: [] }
};

function selectedFields(tests) {
  const out = [];
  for (const t of TESTS) if (tests[t.field] === true) out.push(t.field);
  return out;
}

/**
 * Score appropriateness (1-9) for an indication x selected-tests pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication has not yet been chosen but at least one test is selected.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, tests) {
  const selected = selectedFields(tests);

  if (selected.length === 0) {
    return {
      score: 1,
      band: 'usually-not-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-NO-TEST',
        axis: 'appropriateness',
        category: 'no-test-selected',
        description: 'No coagulation test has been selected; the request cannot be appropriate.'
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

  const map = INDICATION_TEST_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');
  const hasIdeal = selected.some((f) => map.ideal.includes(f));
  const hasPlausible = selected.some((f) => map.plausible.includes(f));

  if (hasIdeal) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Selected tests include the recommended investigation for "${indication}".`
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
        description: `Selected tests may be appropriate for "${indication}" but are not the first-line investigation.`
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
      description: `Selected tests are not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Pre-analytical / specimen safety (citrate fill / 9:1 ratio / timing)
// ----------------------------------------------------------------------
//
// Sodium-citrate coagulation specimens must be filled to the line (correct 9:1
// blood-to-anticoagulant ratio) and analysed within the recommended window. An
// under-filled tube or a wrong ratio is a reject-risk; an uncollected specimen
// or unknown fill is caution; a correctly-filled collected specimen is ok.

/**
 * Evaluate the pre-analytical / specimen-safety band.
 *
 * @returns {{ band:string, firedRule:object|null }}
 */
function evaluatePreanalytical(specimen) {
  const collected = specimen.specimenCollected;
  const fill = specimen.citrateTubeFill;     // '', 'adequate', 'underfilled', 'overfilled'
  const ratio = specimen.citrateRatioCorrect; // '', 'yes', 'no', 'unknown'

  if (collected !== 'yes') {
    return {
      band: 'caution',
      firedRule: {
        ruleId: 'R-PREANALYTICAL-NOT-COLLECTED',
        axis: 'preanalytical',
        category: 'specimen',
        description: 'No specimen collected yet — pre-analytical safety cannot be confirmed.'
      }
    };
  }

  if (fill === 'underfilled' || fill === 'overfilled' || ratio === 'no') {
    return {
      band: 'reject-risk',
      firedRule: {
        ruleId: 'R-PREANALYTICAL-CITRATE-FILL',
        axis: 'preanalytical',
        category: 'citrate-fill',
        description: 'Sodium-citrate tube under-filled / over-filled or 9:1 ratio incorrect — reject-risk specimen.'
      }
    };
  }

  if (!fill || fill === '' || ratio === 'unknown' || !ratio) {
    return {
      band: 'caution',
      firedRule: {
        ruleId: 'R-PREANALYTICAL-FILL-UNKNOWN',
        axis: 'preanalytical',
        category: 'citrate-fill',
        description: 'Citrate tube fill / ratio not confirmed — verify before analysis.'
      }
    };
  }

  return {
    band: 'ok',
    firedRule: {
      ruleId: 'R-PREANALYTICAL-OK',
      axis: 'preanalytical',
      category: 'specimen',
      description: 'Specimen collected with adequate citrate fill and correct 9:1 ratio.'
    }
  };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------
//
// Each tracked field carries a weight. Indication and clinical details are
// weighted highest because they drive every other axis. Completeness is the
// percentage of weighted points present.

const COMPLETENESS_FIELDS = [
  { weight: 3, present: (d) => !!d.clinical.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
  { weight: 3, present: (d) => !!d.clinical.clinicalDetails && d.clinical.clinicalDetails.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-DETAILS', label: 'clinical details' },
  { weight: 3, present: (d) => countSelectedTests(d.tests) > 0, ruleId: 'R-COMPLETE-TESTS', label: 'requested tests' },
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
// Axis D — Triage priority (active-bleeding / DIC escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then active
// major bleeding or suspected DIC auto-escalate it to stat. The most-severe
// escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent', 'stat'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within standard laboratory turnaround',
  'urgent': 'Within a few hours',
  'stat': 'Immediate — process on receipt'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a, b) {
  const ia = TRIAGE_ORDER.indexOf(a);
  const ib = TRIAGE_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Escalation rules, each forcing at least the given tier.
const TRIAGE_RULES = [
  {
    ruleId: 'R-TRIAGE-ACTIVE-BLEEDING',
    tier: 'stat',
    fires: (d) => d.clinical.activeBleeding === true,
    description: 'Active major bleeding — process as STAT.'
  },
  {
    ruleId: 'R-TRIAGE-SUSPECTED-DIC',
    tier: 'stat',
    fires: (d) => d.clinical.suspectedDic === true ||
      d.clinical.primaryIndication === 'disseminated-intravascular-coagulation',
    description: 'Suspected disseminated intravascular coagulation — process as STAT.'
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

export { scoreAppropriateness, appropriatenessBand, evaluatePreanalytical, scoreCompleteness, scoreTriage, maxTier, TRIAGE_ORDER, TARGET_TIMEFRAMES, INDICATION_TEST_MAP };
