// Four-axis rule catalogue for the Genetic Test Request engine.
//
// Derived from index.md and sql/05_*_grade.sql: (A) appropriateness 1-9 + band
// anchored on NHS National Genomic Test Directory eligibility (test type x
// indication match); (B) consent & counselling band ok/caution/not-met
// (predictive / presymptomatic testing needs both counselling and consent);
// (C) request completeness over mandatory fields; (D) triage tier
// routine/urgent with prenatal -> time-critical. Rule IDs are stable and
// identical across every front-end and the back-end (R-APPROP-*, R-CONSENT-*,
// R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers; the grader composes them.
//
// Wrapped in an IIFE; published via `window.GeneticTestRequest`.

(function () {
'use strict';
window.GeneticTestRequest = window.GeneticTestRequest || {};
const NS = window.GeneticTestRequest;
const { isPredictiveTest, isPrenatalRequest } = NS;

// ----------------------------------------------------------------------
// Axis A — Appropriateness (NHS National Genomic Test Directory, 1-9 ordinal)
// ----------------------------------------------------------------------
//
// The Test Directory pairs each clinical indication with a set of eligible
// test types (the "ideal" technology). A request whose indication and test
// type clearly meet a Directory clinical indication scores 7-9 (eligible);
// a plausible-but-suboptimal technology scores 4-6 (partial / borderline);
// a clearly mismatched pairing scores 1-3 (not eligible).

// Map of indication -> { ideal:[testType], plausible:[testType] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_TEST_MAP = {
  'suspected-genetic-disorder': { ideal: ['whole-genome', 'whole-exome', 'gene-panel'], plausible: ['diagnostic-single-gene', 'chromosomal-microarray'] },
  'familial-cancer':            { ideal: ['gene-panel', 'diagnostic-single-gene'], plausible: ['predictive-presymptomatic', 'whole-exome'] },
  'developmental-delay':        { ideal: ['chromosomal-microarray', 'whole-genome'], plausible: ['whole-exome', 'karyotype'] },
  'congenital-anomaly':         { ideal: ['chromosomal-microarray', 'whole-genome'], plausible: ['karyotype', 'whole-exome'] },
  'cardiomyopathy-arrhythmia':  { ideal: ['gene-panel'], plausible: ['whole-exome', 'diagnostic-single-gene', 'predictive-presymptomatic'] },
  'neuromuscular':              { ideal: ['gene-panel', 'whole-exome'], plausible: ['diagnostic-single-gene', 'whole-genome'] },
  'predictive-family-history':  { ideal: ['predictive-presymptomatic', 'diagnostic-single-gene'], plausible: ['gene-panel'] },
  'carrier-screening':          { ideal: ['carrier-testing', 'diagnostic-single-gene'], plausible: ['gene-panel'] },
  'prenatal-diagnosis':         { ideal: ['prenatal', 'chromosomal-microarray', 'karyotype'], plausible: ['gene-panel', 'diagnostic-single-gene'] },
  'pharmacogenomics':           { ideal: ['pharmacogenomic'], plausible: ['gene-panel'] },
  'other':                      { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x testType pairing and return
 * the fired rule. Defaults to a neutral may-be-appropriate when the indication
 * or test type has not yet been chosen.
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
        ruleId: `R-APPROP-${indicationKey}-ELIGIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${testType} test meets the National Genomic Test Directory eligibility for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(testType)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PARTIAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${testType} test may be eligible for "${indication}" but is not the first-line Directory technology.`
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
        description: 'Indication recorded as "other"; eligibility requires clinician / laboratory vetting against the Test Directory.'
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
      description: `Requested ${testType} test does not match a Test Directory eligibility for "${indication}"; query the referrer.`
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
// Axis B — Consent & counselling (informed consent + pre-test counselling)
// ----------------------------------------------------------------------
//
// Consent and pre-test counselling are MANDATORY for predictive /
// presymptomatic testing: if either is absent the band is `not-met` and a
// blocking flag fires. For other tests, missing consent yields `caution`.

/**
 * Evaluate the consent & counselling band for a request.
 *
 * @returns {{ band:string, firedRules:object[] }}
 */
function scoreConsentCounselling(data) {
  const firedRules = [];
  const consent = data.consent.consentObtained === true;
  const counselling = data.consent.geneticCounsellingOffered === true;
  const predictive = isPredictiveTest(
    data.request.testType,
    data.request.primaryIndication
  );

  if (predictive && (!consent || !counselling)) {
    firedRules.push({
      ruleId: 'R-CONSENT-PREDICTIVE-NOT-MET',
      axis: 'consent',
      category: 'predictive',
      description: 'Predictive / presymptomatic testing requires both documented informed consent and pre-test counselling; one or both are absent.'
    });
    return { band: 'not-met', firedRules };
  }

  if (!consent) {
    firedRules.push({
      ruleId: 'R-CONSENT-NOT-OBTAINED',
      axis: 'consent',
      category: 'consent',
      description: 'Informed consent (Record of Discussion) has not been documented.'
    });
    return { band: 'caution', firedRules };
  }

  if (!counselling) {
    firedRules.push({
      ruleId: 'R-CONSENT-COUNSELLING-NOT-OFFERED',
      axis: 'consent',
      category: 'counselling',
      description: 'Pre-test genetic counselling has not been recorded as offered or provided.'
    });
    return { band: 'caution', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CONSENT-OK',
    axis: 'consent',
    category: 'consent',
    description: 'Informed consent and pre-test counselling are both documented.'
  });
  return { band: 'ok', firedRules };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------
//
// Each tracked field carries a weight. Indication, clinical details, and
// family history are weighted highest because they drive eligibility and
// test selection. Completeness is the percentage of weighted points present.

const COMPLETENESS_FIELDS = [
  { weight: 3, present: (d) => !!d.request.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
  { weight: 3, present: (d) => !!d.clinical.clinicalDetails && d.clinical.clinicalDetails.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-DETAILS', label: 'clinical details / phenotype' },
  { weight: 3, present: (d) => !!d.clinical.familyHistory && d.clinical.familyHistory.trim() !== '', ruleId: 'R-COMPLETE-FAMILY-HISTORY', label: 'family history' },
  { weight: 2, present: (d) => !!d.request.testType, ruleId: 'R-COMPLETE-TEST-TYPE', label: 'requested test type' },
  { weight: 2, present: (d) => !!d.request.clinicalQuestion && d.request.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
  { weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
  { weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
  { weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
  { weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
  { weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
  { weight: 1, present: (d) => !!d.triage.specimenType, ruleId: 'R-COMPLETE-SPECIMEN', label: 'specimen type' },
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
// Axis D — Triage priority (prenatal -> time-critical)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then prenatal
// requests auto-escalate to urgent and carry a time-critical timeframe. The
// most-severe escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent'];

const TARGET_TIMEFRAMES = {
  'routine': 'Standard laboratory turnaround',
  'urgent': 'Expedite — urgent turnaround'
};

const PRENATAL_TIMEFRAME = 'Time-critical — prenatal window';

/** Return whichever of two triage tiers is more severe. */
function maxTier(a, b) {
  const ia = TRIAGE_ORDER.indexOf(a);
  const ib = TRIAGE_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

/**
 * Compute the triage tier, target timeframe, and fired triage rules.
 *
 * @returns {{ tier:string, targetTimeframe:string, firedRules:object[] }}
 */
function scoreTriage(data) {
  const requested = data.triage.urgency || 'routine';
  let tier = TRIAGE_ORDER.includes(requested) ? requested : 'routine';
  const firedRules = [];
  let timeCritical = false;

  const prenatal = isPrenatalRequest(
    data.request.testType,
    data.request.primaryIndication,
    data.triage.specimenType
  );

  if (prenatal) {
    tier = maxTier(tier, 'urgent');
    timeCritical = true;
    firedRules.push({
      ruleId: 'R-TRIAGE-PRENATAL-TIME-CRITICAL',
      axis: 'triage',
      category: 'prenatal',
      description: 'Prenatal request — time-critical; the result is needed within the prenatal decision window.'
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-TRIAGE-REQUESTED',
      axis: 'triage',
      category: 'requested',
      description: `No escalation; triage follows the requested urgency (${tier}).`
    });
  }

  const targetTimeframe = timeCritical
    ? PRENATAL_TIMEFRAME
    : (TARGET_TIMEFRAMES[tier] || '');

  return { tier, targetTimeframe, firedRules };
}

Object.assign(NS, {
  scoreAppropriateness,
  appropriatenessBand,
  scoreConsentCounselling,
  scoreCompleteness,
  scoreTriage,
  maxTier,
  TRIAGE_ORDER,
  TARGET_TIMEFRAMES,
  PRENATAL_TIMEFRAME,
  INDICATION_TEST_MAP
});
})();
