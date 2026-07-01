// Four-axis rule catalogue for the Cardiology Request vetting engine.
//
// Derived from spec/index.md and the SQL grade tables: (A) referral
// appropriateness band by reason x requested service (NICE referral criteria);
// (B) safety / red-flag band ok / caution / red-flag from suspected ACS,
// exertional syncope, new-onset heart failure, and supporting findings; (C)
// request completeness over mandatory fields (reason + clinical question
// weighted highest); (D) triage tier with red-flag auto-escalation. Rule IDs
// are stable and identical across every front-end and the back-end
// (R-APPROP-*, R-SAFETY-*, R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers; the
// grader composes them.
//
// Wrapped in an IIFE; published via `window.CardiologyRequest`.

(function () {
'use strict';
window.CardiologyRequest =
  window.CardiologyRequest || {};
const NS = window.CardiologyRequest;

// ----------------------------------------------------------------------
// Axis A — Referral appropriateness (right reason -> right service)
// ----------------------------------------------------------------------
//
// Each referral reason has an ideal cardiology service (or set of services).
// When the requested service matches the reason well, the referral is usually
// appropriate. Plausible-but-suboptimal pairings are may-be-appropriate;
// clearly mismatched pairings are usually-not-appropriate.

// Map of reason -> { ideal:[service], plausible:[service] }.
// Anything not listed for a reason is treated as a mismatch.
const REASON_SERVICE_MAP = {
  'chest-pain':               { ideal: ['rapid-access-chest-pain'], plausible: ['general-cardiology', 'pre-operative-cardiac'] },
  'breathlessness':           { ideal: ['heart-failure'], plausible: ['general-cardiology', 'valve-clinic'] },
  'palpitations':             { ideal: ['arrhythmia-ep'], plausible: ['general-cardiology'] },
  'syncope':                  { ideal: ['general-cardiology', 'arrhythmia-ep'], plausible: ['heart-failure'] },
  'heart-failure-symptoms':   { ideal: ['heart-failure'], plausible: ['general-cardiology'] },
  'murmur-or-valve':          { ideal: ['valve-clinic'], plausible: ['general-cardiology'] },
  'abnormal-ecg':             { ideal: ['general-cardiology'], plausible: ['arrhythmia-ep'] },
  'hypertension':             { ideal: ['general-cardiology'], plausible: [] },
  'arrhythmia':               { ideal: ['arrhythmia-ep'], plausible: ['general-cardiology'] },
  'pre-operative-assessment': { ideal: ['pre-operative-cardiac'], plausible: ['general-cardiology'] },
  'other':                    { ideal: [], plausible: [] }
};

/** Stable rule-id fragment from a kebab-case reason. */
function reasonKey(reason) {
  return reason.toUpperCase().replace(/[^A-Z]+/g, '-');
}

/**
 * Determine the appropriateness band for a reason x service pairing and return
 * the fired rule. Defaults to a neutral may-be-appropriate when the reason or
 * service has not yet been chosen.
 *
 * @returns {{ band:string, firedRule:object|null }}
 */
function scoreAppropriateness(reason, service) {
  if (!reason || !service) {
    return {
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: reason || 'unspecified',
        description: 'Referral reason or requested service not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = REASON_SERVICE_MAP[reason] || { ideal: [], plausible: [] };
  const key = reasonKey(reason);

  if (map.ideal.includes(service)) {
    return {
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${key}-IDEAL`,
        axis: 'appropriateness',
        category: reason,
        description: `Requested ${service} is the recommended service for "${reason}".`
      }
    };
  }
  if (map.plausible.includes(service)) {
    return {
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${key}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: reason,
        description: `Requested ${service} may be appropriate for "${reason}" but is not the first-line service.`
      }
    };
  }
  if (reason === 'other') {
    return {
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-OTHER',
        axis: 'appropriateness',
        category: 'other',
        description: 'Referral reason recorded as "other"; appropriateness requires clinician vetting.'
      }
    };
  }
  return {
    band: 'usually-not-appropriate',
    firedRule: {
      ruleId: `R-APPROP-${key}-MISMATCH`,
      axis: 'appropriateness',
      category: reason,
      description: `Requested ${service} is not usually appropriate for "${reason}"; query or redirect the referrer.`
    }
  };
}

// ----------------------------------------------------------------------
// Axis B — Safety / red-flag (acute escalation rules)
// ----------------------------------------------------------------------
//
// Returns a band of ok / caution / red-flag. Acute red flags (suspected acute
// coronary syndrome, exertional syncope, new-onset heart failure) force
// `red-flag`. Supporting acute findings (elevated troponin, NYHA III/IV
// breathlessness, typical-angina chest pain) force at least `caution`.

const SAFETY_ORDER = ['ok', 'caution', 'red-flag'];

/** Return whichever of two safety bands is more severe. */
function maxBand(a, b) {
  const ia = SAFETY_ORDER.indexOf(a);
  const ib = SAFETY_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Each rule forces at least the given band when it fires.
const SAFETY_RULES = [
  {
    ruleId: 'R-SAFETY-SUSPECTED-ACS',
    band: 'red-flag',
    fires: (d) => d.redFlags.suspectedAcs === true,
    description: 'Suspected acute coronary syndrome — divert to the emergency ACS pathway, not a routine cardiology referral.'
  },
  {
    ruleId: 'R-SAFETY-EXERTIONAL-SYNCOPE',
    band: 'red-flag',
    fires: (d) => d.redFlags.exertionalSyncope === true,
    description: 'Exertional syncope — possible structural / arrhythmic cause requiring urgent assessment.'
  },
  {
    ruleId: 'R-SAFETY-NEW-ONSET-HEART-FAILURE',
    band: 'red-flag',
    fires: (d) => d.redFlags.newOnsetHeartFailure === true,
    description: 'New-onset heart failure — warrants urgent assessment per NICE NG106.'
  },
  {
    ruleId: 'R-SAFETY-ELEVATED-TROPONIN',
    band: 'red-flag',
    fires: (d) => d.redFlags.troponinStatus === 'elevated',
    description: 'Elevated troponin — treat as possible acute coronary syndrome until excluded.'
  },
  {
    ruleId: 'R-SAFETY-TYPICAL-ANGINA',
    band: 'caution',
    fires: (d) => d.symptoms.symptomChestPain === true && d.symptoms.chestPainCharacter === 'typical-angina',
    description: 'Typical-angina chest pain — expedite rapid-access chest-pain assessment.'
  },
  {
    ruleId: 'R-SAFETY-NYHA-ADVANCED',
    band: 'caution',
    fires: (d) => d.symptoms.nyhaClass === 'iii' || d.symptoms.nyhaClass === 'iv',
    description: 'Advanced (NYHA III/IV) breathlessness — proceed with urgency and caution.'
  },
  {
    ruleId: 'R-SAFETY-ELEVATED-BNP',
    band: 'caution',
    fires: (d) => d.redFlags.bnpStatus === 'elevated',
    description: 'Elevated BNP / NT-proBNP — supports heart failure; expedite heart-failure pathway.'
  }
];

/**
 * Evaluate the safety / red-flag band.
 *
 * @returns {{ band:string, firedRules:object[] }}
 */
function scoreSafety(data) {
  let band = 'ok';
  const firedRules = [];
  for (const rule of SAFETY_RULES) {
    if (rule.fires(data)) {
      band = maxBand(band, rule.band);
      firedRules.push({
        ruleId: rule.ruleId,
        axis: 'safety',
        category: 'red-flag',
        description: rule.description
      });
    }
  }
  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-SAFETY-OK',
      axis: 'safety',
      category: 'red-flag',
      description: 'No acute red flag detected from the safety screen.'
    });
  }
  return { band, firedRules };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------
//
// Each tracked field carries a weight. Referral reason and clinical question
// are weighted highest because they drive every other axis. Completeness is the
// percentage of weighted points present.

const COMPLETENESS_FIELDS = [
  { weight: 3, present: (d) => !!d.request.referralReason, ruleId: 'R-COMPLETE-REASON', label: 'referral reason' },
  { weight: 3, present: (d) => !!d.request.clinicalQuestion && d.request.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
  { weight: 2, present: (d) => !!d.request.requestedService, ruleId: 'R-COMPLETE-SERVICE', label: 'requested service' },
  { weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
  { weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
  { weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
  { weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'referring clinician' },
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
// A base tier is taken from the referrer's requested urgency, then red flags
// auto-escalate it. The most-severe escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent', 'emergency'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 6 weeks',
  'urgent': 'Within 2 weeks',
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
    ruleId: 'R-TRIAGE-SUSPECTED-ACS',
    tier: 'emergency',
    fires: (d) => d.redFlags.suspectedAcs === true || d.redFlags.troponinStatus === 'elevated',
    description: 'Suspected acute coronary syndrome — emergency pathway, do not wait for routine clinic.'
  },
  {
    ruleId: 'R-TRIAGE-EXERTIONAL-SYNCOPE',
    tier: 'urgent',
    fires: (d) => d.redFlags.exertionalSyncope === true,
    description: 'Exertional syncope — urgent cardiology review.'
  },
  {
    ruleId: 'R-TRIAGE-NEW-ONSET-HEART-FAILURE',
    tier: 'urgent',
    fires: (d) => d.redFlags.newOnsetHeartFailure === true || d.redFlags.bnpStatus === 'elevated',
    description: 'New-onset heart failure / elevated BNP — urgent heart-failure assessment per NICE NG106.'
  },
  {
    ruleId: 'R-TRIAGE-TYPICAL-ANGINA',
    tier: 'urgent',
    fires: (d) => d.symptoms.symptomChestPain === true && d.symptoms.chestPainCharacter === 'typical-angina',
    description: 'Typical-angina chest pain — expedited rapid-access chest-pain assessment.'
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
  scoreSafety,
  scoreCompleteness,
  scoreTriage,
  maxTier,
  maxBand,
  TRIAGE_ORDER,
  SAFETY_ORDER,
  TARGET_TIMEFRAMES,
  REASON_SERVICE_MAP
});
})();
