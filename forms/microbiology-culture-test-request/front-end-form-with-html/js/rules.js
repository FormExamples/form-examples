// Four-axis rule catalogue for the Microbiology Culture Test Request engine.
//
// Derived from index.md and SQL migration 05/06: (A) appropriateness 1-9 + band
// by specimen x indication match (UKHSA SMI anchor; analogous to ACR); (B)
// pre-analytical / specimen safety ok/caution/reject-risk (collected? sampled
// before antibiotics? transport-sensitive specimen?); (C) request completeness
// over mandatory fields, clinical details + indication weighted highest; (D)
// triage tier routine/urgent/stat with suspected-sepsis auto-escalation to stat
// (NICE NG51). Rule IDs are stable and identical across every front-end and the
// back-end (R-APPROP-*, R-PREANALYTICAL-*, R-COMPLETE-*, R-TRIAGE-*). Pure data
// + helpers; the grader composes them.
//
// Wrapped in an IIFE; published via `window.MicrobiologyCultureTestRequest`.

(function () {
'use strict';
window.MicrobiologyCultureTestRequest =
  window.MicrobiologyCultureTestRequest || {};
const NS = window.MicrobiologyCultureTestRequest;
const { anyTestSelected } = NS;

// ----------------------------------------------------------------------
// Axis A — Appropriateness (UKHSA SMI specimen / indication match, 1-9)
// ----------------------------------------------------------------------
//
// Each indication has an ideal specimen type (or set of types). When the
// specimen matches the indication well, the request scores high (7-9,
// usually-appropriate). Plausible-but-suboptimal pairings score 4-6
// may-be-appropriate; clearly mismatched pairings score 1-3. If no test is
// selected the request cannot be appropriate regardless of the pairing.

// Map of indication -> { ideal:[specimenType], plausible:[specimenType] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_SPECIMEN_MAP = {
  'suspected-sepsis':         { ideal: ['blood-culture'], plausible: ['urine', 'csf', 'wound-swab', 'sputum'] },
  'urinary-tract-infection':  { ideal: ['urine'], plausible: ['catheter-tip', 'blood-culture'] },
  'wound-infection':          { ideal: ['wound-swab', 'tissue'], plausible: ['blood-culture'] },
  'respiratory-infection':    { ideal: ['sputum', 'throat-swab'], plausible: ['blood-culture'] },
  'gastroenteritis':          { ideal: ['stool'], plausible: ['blood-culture'] },
  'meningitis':               { ideal: ['csf', 'blood-culture'], plausible: [] },
  'sti-screen':               { ideal: ['genital-swab'], plausible: ['urine'] },
  'pyrexia-unknown-origin':   { ideal: ['blood-culture'], plausible: ['urine', 'sputum', 'csf', 'wound-swab'] },
  'infection-screening':      { ideal: ['wound-swab', 'urine'], plausible: ['genital-swab', 'catheter-tip', 'sputum'] },
  'other':                    { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x specimenType pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or specimen type has not yet been chosen. When no test is selected
 * the score is forced low regardless of the pairing.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, specimenType, tests) {
  if (!anyTestSelected(tests)) {
    return {
      score: 2,
      band: 'usually-not-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-NO-TEST',
        axis: 'appropriateness',
        category: 'no-test-selected',
        description: 'No microbiology test selected — the request cannot be processed; query the referrer.'
      }
    };
  }

  if (!indication || !specimenType) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or specimen type not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_SPECIMEN_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  if (map.ideal.includes(specimenType)) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `A ${specimenType} specimen is the recommended sample for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(specimenType)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `A ${specimenType} specimen may be appropriate for "${indication}" but is not the first-line sample.`
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
        description: 'Indication recorded as "other"; appropriateness requires laboratory vetting.'
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
      description: `A ${specimenType} specimen is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Pre-analytical / specimen safety (UKHSA SMI; ok/caution/reject-risk)
// ----------------------------------------------------------------------
//
// reject-risk: a critical pre-analytical problem (e.g. blood culture taken
// while on antibiotics, or no specimen collected). caution: a recoverable
// concern (e.g. on antibiotics for a non-blood specimen, transport-sensitive
// specimen with no collection time). ok: no concern fired.

const PREANALYTICAL_ORDER = ['ok', 'caution', 'reject-risk'];

// Specimens whose yield / transport is time-critical (UKHSA SMI transport).
const TRANSPORT_SENSITIVE = ['blood-culture', 'csf', 'genital-swab'];

/** Return whichever of two pre-analytical bands is more severe. */
function worsePreanalytical(a, b) {
  const ia = PREANALYTICAL_ORDER.indexOf(a);
  const ib = PREANALYTICAL_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

/**
 * Evaluate pre-analytical / specimen safety.
 *
 * @returns {{ band:string, firedRules:object[] }}
 */
function scorePreanalytical(data) {
  let band = 'ok';
  const firedRules = [];

  const collected = data.specimen.specimenCollected;
  const specimenType = data.specimen.specimenType;
  const onAntibiotics = data.clinical.currentAntibiotics === true;
  const isBloodCulture = specimenType === 'blood-culture';

  // reject-risk: blood culture taken while on antibiotics (yield compromised).
  if (isBloodCulture && onAntibiotics) {
    band = worsePreanalytical(band, 'reject-risk');
    firedRules.push({
      ruleId: 'R-PREANALYTICAL-BLOOD-CULTURE-ON-ABX',
      axis: 'preanalytical',
      category: 'blood-culture-before-antibiotics',
      description: 'Blood culture requested while the patient is on antibiotics — cultures should be taken before the first dose.'
    });
  }

  // reject-risk: request submitted but specimen explicitly not collected.
  if (collected === 'no') {
    band = worsePreanalytical(band, 'reject-risk');
    firedRules.push({
      ruleId: 'R-PREANALYTICAL-NOT-COLLECTED',
      axis: 'preanalytical',
      category: 'specimen-not-collected',
      description: 'No specimen has been collected — the laboratory cannot process the request.'
    });
  }

  // caution: on antibiotics for a non-blood specimen (reduced yield).
  if (onAntibiotics && !isBloodCulture) {
    band = worsePreanalytical(band, 'caution');
    firedRules.push({
      ruleId: 'R-PREANALYTICAL-ON-ANTIBIOTICS',
      axis: 'preanalytical',
      category: 'current-antibiotics',
      description: 'Current antibiotics may reduce culture yield; interpret a negative result with caution.'
    });
  }

  // caution: transport-sensitive specimen collected but no collection time.
  if (
    collected === 'yes' &&
    TRANSPORT_SENSITIVE.includes(specimenType) &&
    !data.specimen.collectionDatetime
  ) {
    band = worsePreanalytical(band, 'caution');
    firedRules.push({
      ruleId: 'R-PREANALYTICAL-NO-COLLECTION-TIME',
      axis: 'preanalytical',
      category: 'transport-sensitive',
      description: `${specimenType} is transport-sensitive but no collection date/time was recorded; record it for the transport clock.`
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-PREANALYTICAL-OK',
      axis: 'preanalytical',
      category: 'ok',
      description: 'No pre-analytical concerns identified.'
    });
  }

  return { band, firedRules };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------
//
// Each tracked field carries a weight. Clinical details and indication are
// weighted highest because they drive appropriateness and triage. Completeness
// is the percentage of weighted points present.

const COMPLETENESS_FIELDS = [
  { weight: 3, present: (d) => !!d.clinical.clinicalDetails && d.clinical.clinicalDetails.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-DETAILS', label: 'clinical details' },
  { weight: 3, present: (d) => !!d.clinical.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
  { weight: 2, present: (d) => !!d.specimen.specimenType, ruleId: 'R-COMPLETE-SPECIMEN-TYPE', label: 'specimen type' },
  { weight: 2, present: (d) => anyTestSelected(d.tests), ruleId: 'R-COMPLETE-TEST', label: 'requested test' },
  { weight: 1, present: (d) => !!d.specimen.specimenCollected, ruleId: 'R-COMPLETE-COLLECTED', label: 'specimen-collected status' },
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
// Axis D — Triage priority (NICE NG51 sepsis escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then rules
// auto-escalate it. Suspected sepsis forces stat (NICE NG51). The most-severe
// escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent', 'stat'];

const TARGET_TIMEFRAMES = {
  'routine': 'Routine — standard laboratory turnaround',
  'urgent': 'Urgent — same-day processing',
  'stat': 'Stat — process immediately / within the hour'
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
    ruleId: 'R-TRIAGE-SUSPECTED-SEPSIS',
    tier: 'stat',
    fires: (d) => d.clinical.primaryIndication === 'suspected-sepsis',
    description: 'Suspected sepsis — process as stat (NICE NG51).'
  },
  {
    ruleId: 'R-TRIAGE-MENINGITIS',
    tier: 'stat',
    fires: (d) => d.clinical.primaryIndication === 'meningitis',
    description: 'Suspected meningitis — process as stat.'
  },
  {
    ruleId: 'R-TRIAGE-FEVER-IMMUNOCOMPROMISED',
    tier: 'urgent',
    fires: (d) => d.clinical.fever === true && d.clinical.immunocompromised === true,
    description: 'Fever in an immunocompromised patient — expedite processing.'
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
  scorePreanalytical,
  scoreCompleteness,
  scoreTriage,
  maxTier,
  worsePreanalytical,
  TRIAGE_ORDER,
  TARGET_TIMEFRAMES,
  PREANALYTICAL_ORDER,
  INDICATION_SPECIMEN_MAP
});
})();
