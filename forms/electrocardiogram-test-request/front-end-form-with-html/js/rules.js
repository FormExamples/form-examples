// Four-axis rule catalogue for the Electrocardiogram (ECG) Test Request engine.
//
// Derived from index.md and SQL migration 05: (A) appropriateness 1-9 + band by
// indication x ECG type (AHA/ACC ECG-use guidance); (B) urgency triage tier
// routine / urgent / emergency with red-flag auto-escalation (NICE CG95 / NG185
// ACS pathway) — suspected ACS or active chest pain implies an emergency
// same-hour 12-lead ECG; (C) request completeness over mandatory fields,
// indication + clinical question weighted highest; (D) clinical priority
// low / moderate / high composite band. Rule IDs are stable and identical
// across every front-end and the back-end (R-APPROP-*, R-URGENCY-*,
// R-COMPLETE-*, R-PRIORITY-*). Pure data + helpers; the grader composes them.
//
// Wrapped in an IIFE; published via `window.ElectrocardiogramTestRequest`.

(function () {
'use strict';
window.ElectrocardiogramTestRequest =
  window.ElectrocardiogramTestRequest || {};
const NS = window.ElectrocardiogramTestRequest;

// ----------------------------------------------------------------------
// Axis A — Appropriateness (AHA/ACC ECG-use guidance, 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal ECG type (or set of types). When the requested
// ECG type matches the indication well, the request scores high (7-9,
// usually-appropriate). Plausible-but-suboptimal pairings score in the 4-6
// may-be-appropriate band; clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[ecgType], plausible:[ecgType] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_ECG_MAP = {
  'chest-pain':              { ideal: ['resting-12-lead'], plausible: ['exercise-stress'] },
  'suspected-mi-acs':        { ideal: ['resting-12-lead'], plausible: [] },
  'palpitations':            { ideal: ['ambulatory-holter-24h', 'ambulatory-48h', 'event-recorder'], plausible: ['resting-12-lead'] },
  'syncope':                 { ideal: ['resting-12-lead', 'event-recorder'], plausible: ['ambulatory-holter-24h', 'ambulatory-48h'] },
  'suspected-arrhythmia':    { ideal: ['ambulatory-holter-24h', 'ambulatory-48h', 'event-recorder'], plausible: ['resting-12-lead'] },
  'pre-operative':           { ideal: ['resting-12-lead'], plausible: [] },
  'medication-monitoring-qt':{ ideal: ['resting-12-lead'], plausible: ['ambulatory-holter-24h'] },
  'hypertension':            { ideal: ['resting-12-lead'], plausible: [] },
  'heart-failure':           { ideal: ['resting-12-lead'], plausible: ['ambulatory-holter-24h'] },
  'screening':               { ideal: ['resting-12-lead'], plausible: [] },
  'follow-up':               { ideal: ['resting-12-lead'], plausible: ['ambulatory-holter-24h', 'ambulatory-48h', 'event-recorder', 'exercise-stress'] },
  'other':                   { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x ecgType pairing and return
 * the fired rule. Defaults to a neutral may-be-appropriate when the indication
 * or ECG type has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, ecgType) {
  if (!indication || !ecgType) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or ECG type not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_ECG_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  if (map.ideal.includes(ecgType)) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${ecgType} ECG is the recommended examination for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(ecgType)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${ecgType} ECG may be appropriate for "${indication}" but is not the first-line examination.`
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
      description: `Requested ${ecgType} ECG is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Urgency triage (red-flag escalation; NICE CG95 / NG185)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then red flags
// auto-escalate it. The most-severe escalation wins. Suspected ACS or active
// chest pain force the emergency, same-hour tier.

const TRIAGE_ORDER = ['routine', 'urgent', 'emergency'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 4-6 weeks',
  'urgent': 'Within 24-72 hours',
  'emergency': 'Same hour / immediate'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a, b) {
  const ia = TRIAGE_ORDER.indexOf(a);
  const ib = TRIAGE_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

/** Whether active chest pain is present (symptomatic + chest pain). */
function activeChestPain(d) {
  return d.symptoms.symptomChestPain === true && d.symptoms.currentlySymptomatic === true;
}

// Red-flag escalation rules, each forcing at least the given tier.
const TRIAGE_RULES = [
  {
    ruleId: 'R-URGENCY-SUSPECTED-ACS',
    tier: 'emergency',
    fires: (d) => d.symptoms.suspectedAcs === true,
    description: 'Suspected acute coronary syndrome — emergency same-hour 12-lead ECG.'
  },
  {
    ruleId: 'R-URGENCY-ACTIVE-CHEST-PAIN',
    tier: 'emergency',
    fires: (d) => activeChestPain(d),
    description: 'Active chest pain at the time of request — emergency same-hour 12-lead ECG.'
  },
  {
    ruleId: 'R-URGENCY-SUSPECTED-VT',
    tier: 'emergency',
    fires: (d) => d.symptoms.knownArrhythmia === 'vt',
    description: 'Known / suspected ventricular tachycardia — emergency assessment.'
  },
  {
    ruleId: 'R-URGENCY-SYNCOPE',
    tier: 'urgent',
    fires: (d) => d.symptoms.symptomSyncope === true || d.request.primaryIndication === 'syncope',
    description: 'Syncope or collapse — urgent assessment to exclude arrhythmic cause.'
  },
  {
    ruleId: 'R-URGENCY-HEART-BLOCK',
    tier: 'urgent',
    fires: (d) => d.symptoms.knownArrhythmia === 'heart-block',
    description: 'Known heart block — urgent assessment.'
  }
];

/**
 * Compute the triage tier, target timeframe, and fired urgency rules.
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
      ruleId: 'R-URGENCY-REQUESTED',
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
  { weight: 2, present: (d) => !!d.request.ecgType, ruleId: 'R-COMPLETE-ECG-TYPE', label: 'requested ECG type' },
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
// Axis D — Clinical priority (composite acuity band)
// ----------------------------------------------------------------------
//
// Priority is a composite low / moderate / high band. Any emergency triage
// tier forces high; urgent forces at least moderate; certain symptom patterns
// raise the band even when the requested urgency is routine.

const PRIORITY_ORDER = ['low', 'moderate', 'high'];

/** Return whichever of two priority bands is higher. */
function maxPriority(a, b) {
  const ia = PRIORITY_ORDER.indexOf(a);
  const ib = PRIORITY_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

/**
 * Compute the clinical-priority band and fired priority rules from the triage
 * tier plus symptom acuity.
 *
 * @returns {{ band:string, firedRules:object[] }}
 */
function scorePriority(data, triageTier) {
  let band = 'low';
  const firedRules = [];

  if (triageTier === 'emergency') {
    band = maxPriority(band, 'high');
    firedRules.push({
      ruleId: 'R-PRIORITY-EMERGENCY',
      axis: 'priority',
      category: 'triage-derived',
      description: 'Emergency triage tier — clinical priority is high.'
    });
  } else if (triageTier === 'urgent') {
    band = maxPriority(band, 'moderate');
    firedRules.push({
      ruleId: 'R-PRIORITY-URGENT',
      axis: 'priority',
      category: 'triage-derived',
      description: 'Urgent triage tier — clinical priority is at least moderate.'
    });
  }

  if (data.symptoms.symptomSyncope === true) {
    band = maxPriority(band, 'moderate');
    firedRules.push({
      ruleId: 'R-PRIORITY-SYNCOPE',
      axis: 'priority',
      category: 'symptom',
      description: 'Syncope reported — raises clinical priority to at least moderate.'
    });
  }
  if (data.symptoms.symptomBreathlessness === true && data.request.primaryIndication === 'heart-failure') {
    band = maxPriority(band, 'moderate');
    firedRules.push({
      ruleId: 'R-PRIORITY-HEART-FAILURE',
      axis: 'priority',
      category: 'symptom',
      description: 'Breathlessness with a heart-failure indication — raises clinical priority.'
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-PRIORITY-BASELINE',
      axis: 'priority',
      category: 'baseline',
      description: 'No acuity escalators; clinical priority is low.'
    });
  }

  return { band, firedRules };
}

Object.assign(NS, {
  scoreAppropriateness,
  appropriatenessBand,
  scoreTriage,
  scoreCompleteness,
  scorePriority,
  maxTier,
  maxPriority,
  activeChestPain,
  TRIAGE_ORDER,
  PRIORITY_ORDER,
  TARGET_TIMEFRAMES,
  INDICATION_ECG_MAP
});
})();
