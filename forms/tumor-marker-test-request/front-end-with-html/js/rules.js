// Four-axis rule catalogue for the Tumor Marker Test Request engine.
//
// Derived from index.md and SQL migrations 05 / 06: (A) appropriateness 1-9 +
// band by marker-to-indication fit (NICE / ACB / RCPath); (B) interpretation
// safety (ok / caution / misuse-risk) covering screening misuse, on-treatment
// timing, and no-marker selection; (C) request completeness over mandatory
// fields, indication + clinical details weighted highest; (D) triage tier
// (routine / urgent / two-week-wait) with suspected-cancer escalation. Rule IDs
// are stable and identical across every front-end and the back-end
// (R-APPROP-*, R-INTERP-*, R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers; the
// grader composes them.
//
// Wrapped in an IIFE; published via `window.TumorMarkerTestRequest`.

(function () {
'use strict';
window.TumorMarkerTestRequest =
  window.TumorMarkerTestRequest || {};
const NS = window.TumorMarkerTestRequest;
const { MARKERS, selectedMarkerFields, markerLabel } = NS;

// ----------------------------------------------------------------------
// Axis A — Appropriateness (marker-to-indication fit, 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each marker has a set of indications for which it is established (NICE / ACB
// / RCPath). When every selected marker matches the recorded indication well,
// the request scores high (7-9, usually-appropriate). When at least one marker
// does not match the indication it drops into may-be-appropriate (4-6) or, for
// clear screening misuse, usually-not-appropriate (1-3).
//
// Indications considered "broad screening" for misuse purposes are
// screening-high-risk and (where no cancer site/details are given) other.

// Map of marker field -> indications for which the marker is appropriate.
const MARKER_INDICATION_MAP = {
  psa:                        ['suspected-malignancy', 'cancer-monitoring', 'treatment-response', 'recurrence-surveillance', 'screening-high-risk'],
  ca125:                      ['suspected-malignancy', 'cancer-monitoring', 'treatment-response', 'recurrence-surveillance', 'characterise-mass'],
  ca19_9:                     ['suspected-malignancy', 'cancer-monitoring', 'treatment-response', 'recurrence-surveillance', 'characterise-mass'],
  carcinoembryonicAntigenCea: ['cancer-monitoring', 'treatment-response', 'recurrence-surveillance'],
  alphaFetoproteinAfp:        ['suspected-malignancy', 'cancer-monitoring', 'treatment-response', 'recurrence-surveillance', 'characterise-mass', 'screening-high-risk'],
  betaHcg:                    ['suspected-malignancy', 'cancer-monitoring', 'treatment-response', 'recurrence-surveillance'],
  ca15_3:                     ['cancer-monitoring', 'treatment-response', 'recurrence-surveillance'],
  lactateDehydrogenaseLdh:    ['suspected-malignancy', 'cancer-monitoring', 'treatment-response', 'recurrence-surveillance'],
  calcitonin:                 ['suspected-malignancy', 'cancer-monitoring', 'recurrence-surveillance', 'screening-high-risk'],
  chromograninA:              ['suspected-malignancy', 'cancer-monitoring', 'treatment-response', 'recurrence-surveillance', 'characterise-mass']
};

// Indications that represent broad / non-evidence-based screening when applied
// to markers with poor screening performance.
const SCREENING_MISUSE_INDICATIONS = ['screening-high-risk'];

/**
 * Score appropriateness (1-9) for the selected markers against the recorded
 * indication and return all fired rules. Returns a neutral provisional band
 * when nothing has been selected yet.
 *
 * @returns {{ score:number, band:string, firedRules:object[],
 *   mismatchedMarkers:string[], screeningMisuse:boolean }}
 */
function scoreAppropriateness(markers, indication) {
  const selected = selectedMarkerFields(markers);
  const firedRules = [];

  if (selected.length === 0) {
    return {
      score: 1,
      band: 'usually-not-appropriate',
      firedRules: [{
        ruleId: 'R-APPROP-NO-MARKER-SELECTED',
        axis: 'appropriateness',
        category: 'no-marker-selected',
        description: 'No tumour marker has been selected; the request cannot be actioned.'
      }],
      mismatchedMarkers: [],
      screeningMisuse: false
    };
  }

  if (!indication) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRules: [{
        ruleId: 'R-APPROP-INDICATION-UNSPECIFIED',
        axis: 'appropriateness',
        category: 'unspecified',
        description: 'Primary indication not yet specified — provisional appropriateness.'
      }],
      mismatchedMarkers: [],
      screeningMisuse: false
    };
  }

  const isScreeningMisuse = SCREENING_MISUSE_INDICATIONS.includes(indication);
  const mismatchedMarkers = [];

  for (const field of selected) {
    const allowed = MARKER_INDICATION_MAP[field] || [];
    const markerKey = field.toUpperCase().replace(/[^A-Z0-9]+/g, '-');
    if (indication === 'other') {
      // "Other" cannot be matched mechanically; flag for vetting.
      firedRules.push({
        ruleId: `R-APPROP-${markerKey}-OTHER`,
        axis: 'appropriateness',
        category: field,
        description: `Indication "other" recorded for ${markerLabel(field)}; appropriateness requires clinician vetting.`
      });
    } else if (!allowed.includes(indication)) {
      mismatchedMarkers.push(field);
      firedRules.push({
        ruleId: `R-APPROP-${markerKey}-MISMATCH`,
        axis: 'appropriateness',
        category: field,
        description: `${markerLabel(field)} is not an established marker for "${indication}".`
      });
    } else {
      firedRules.push({
        ruleId: `R-APPROP-${markerKey}-MATCH`,
        axis: 'appropriateness',
        category: field,
        description: `${markerLabel(field)} matches the recorded indication "${indication}".`
      });
    }
  }

  let score;
  let band;
  if (isScreeningMisuse) {
    score = 3;
    band = 'usually-not-appropriate';
    firedRules.push({
      ruleId: 'R-APPROP-SCREENING-MISUSE',
      axis: 'appropriateness',
      category: 'inappropriate-screening-use',
      description: 'Tumour markers requested as broad screening; markers are poor screening tests in unselected populations.'
    });
  } else if (mismatchedMarkers.length === 0) {
    score = indication === 'other' ? 5 : 8;
    band = appropriatenessBand(score);
  } else if (mismatchedMarkers.length < selected.length) {
    score = 5;
    band = 'may-be-appropriate';
  } else {
    score = 2;
    band = 'usually-not-appropriate';
  }

  return {
    score,
    band,
    firedRules,
    mismatchedMarkers,
    screeningMisuse: isScreeningMisuse
  };
}

/** Map a 1-9 appropriateness score to its band. */
function appropriatenessBand(score) {
  if (score >= 7) return 'usually-appropriate';
  if (score >= 4) return 'may-be-appropriate';
  return 'usually-not-appropriate';
}

// ----------------------------------------------------------------------
// Axis B — Interpretation safety (ok / caution / misuse-risk)
// ----------------------------------------------------------------------
//
// Timing, treatment effects, and screening-misuse checks. Screening misuse
// forces misuse-risk; on-treatment requests or a missing previous value /
// date for a monitoring indication raise caution. Choose ok only when no rule
// fires.

const INTERPRETATION_ORDER = ['ok', 'caution', 'misuse-risk'];

const MONITORING_INDICATIONS = ['cancer-monitoring', 'treatment-response', 'recurrence-surveillance'];

/** Return whichever of two interpretation bands is more severe. */
function maxInterpretation(a, b) {
  const ia = INTERPRETATION_ORDER.indexOf(a);
  const ib = INTERPRETATION_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

/**
 * Evaluate interpretation safety for the request.
 *
 * @returns {{ band:string, firedRules:object[] }}
 */
function scoreInterpretation(data, context) {
  const ctx = context || {};
  const indication = data.context.primaryIndication;
  const firedRules = [];
  let band = 'ok';

  if (ctx.screeningMisuse) {
    band = maxInterpretation(band, 'misuse-risk');
    firedRules.push({
      ruleId: 'R-INTERP-SCREENING-MISUSE',
      axis: 'interpretation',
      category: 'inappropriate-screening-use',
      description: 'Markers ordered for broad screening have low specificity and are frequently raised in benign conditions — misuse risk.'
    });
  }

  if (data.context.onTreatment === true) {
    band = maxInterpretation(band, 'caution');
    firedRules.push({
      ruleId: 'R-INTERP-ON-TREATMENT',
      axis: 'interpretation',
      category: 'treatment-effect',
      description: 'Patient is on treatment; marker levels may reflect treatment timing rather than disease activity.'
    });
  }

  if (
    MONITORING_INDICATIONS.includes(indication) &&
    (data.context.previousMarkerValue === null ||
      data.context.previousMarkerValue === undefined ||
      data.context.previousMarkerValue === '' ||
      !data.context.previousMarkerDate)
  ) {
    band = maxInterpretation(band, 'caution');
    firedRules.push({
      ruleId: 'R-INTERP-NO-BASELINE',
      axis: 'interpretation',
      category: 'missing-baseline',
      description: 'Monitoring / surveillance indication without a previous marker value and date — no baseline for trend interpretation.'
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-INTERP-OK',
      axis: 'interpretation',
      category: 'ok',
      description: 'No interpretation-safety concerns identified.'
    });
  }

  return { band, firedRules };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------
//
// Each tracked field carries a weight. Indication and clinical details are
// weighted highest because they drive every other axis. Completeness is the
// percentage of weighted points present.

const COMPLETENESS_FIELDS = [
  { weight: 3, present: (d) => NS.countSelectedMarkers(d.markers) > 0, ruleId: 'R-COMPLETE-MARKER', label: 'at least one marker' },
  { weight: 3, present: (d) => !!d.context.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
  { weight: 3, present: (d) => !!d.context.clinicalDetails && d.context.clinicalDetails.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-DETAILS', label: 'clinical details' },
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
// Axis D — Triage priority (suspected-cancer escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then
// suspected-cancer patterns auto-escalate it. The most-severe escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent', 'two-week-wait'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 4-6 weeks',
  'urgent': 'Within 1 week',
  'two-week-wait': 'Within 14 days (suspected-cancer pathway)'
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
    ruleId: 'R-TRIAGE-REQUESTED-2WW',
    tier: 'two-week-wait',
    fires: (d) => d.triage.urgency === 'two-week-wait',
    description: 'Requested on the two-week-wait suspected-cancer pathway.'
  },
  {
    ruleId: 'R-TRIAGE-CA125-SUSPECTED-OVARIAN',
    tier: 'two-week-wait',
    fires: (d) =>
      d.markers.ca125 === true &&
      d.context.primaryIndication === 'suspected-malignancy',
    description: 'CA125 for suspected malignancy (possible ovarian cancer) — escalate to two-week-wait per NICE NG12.'
  },
  {
    ruleId: 'R-TRIAGE-SUSPECTED-MALIGNANCY',
    tier: 'urgent',
    fires: (d) => d.context.primaryIndication === 'suspected-malignancy',
    description: 'Suspected-malignancy indication — expedite.'
  },
  {
    ruleId: 'R-TRIAGE-REQUESTED-URGENT',
    tier: 'urgent',
    fires: (d) => d.triage.urgency === 'urgent',
    description: 'Clinician requested urgent processing.'
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
        category: 'escalation',
        description: rule.description
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-TRIAGE-REQUESTED',
      axis: 'urgency',
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
  scoreInterpretation,
  maxInterpretation,
  scoreCompleteness,
  scoreTriage,
  maxTier,
  TRIAGE_ORDER,
  INTERPRETATION_ORDER,
  TARGET_TIMEFRAMES,
  MARKER_INDICATION_MAP,
  SCREENING_MISUSE_INDICATIONS,
  MONITORING_INDICATIONS
});
})();
