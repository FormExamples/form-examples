// Four-axis rule catalogue for the Echocardiogram Test Request engine.
//
// Derived from index.md: (A) appropriateness 1-9 + band by indication x echo
// type (ACC/AHA/ASE & BSE Appropriate Use Criteria); (B) urgency triage tier
// with red-flag auto-escalation; (C) request completeness over mandatory
// fields; (D) clinical priority (low/moderate/high) driven by NYHA class,
// natriuretic peptide (NICE NG106), and suspected severe pathology. Rule IDs
// are stable and identical across every front-end and the back-end
// (R-APPROP-*, R-URGENCY-*, R-COMPLETE-*, R-PRIORITY-*). Pure data + helpers;
// the grader composes them.
//
// Wrapped in an IIFE; published via `window.EchocardiogramTestRequest`.

(function () {
'use strict';
window.EchocardiogramTestRequest =
  window.EchocardiogramTestRequest || {};
const NS = window.EchocardiogramTestRequest;

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACC/AHA/ASE & BSE Appropriate Use Criteria 1-9)
// ----------------------------------------------------------------------
//
// Each indication has an ideal echo type (or set of types). When the requested
// echo type matches the indication well, the request scores high (7-9,
// appropriate). Plausible-but-suboptimal pairings score 4-6 may-be-appropriate;
// clearly mismatched pairings score 1-3 rarely-appropriate.

// Map of indication -> { ideal:[echoType], plausible:[echoType] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_ECHO_MAP = {
  'heart-failure':              { ideal: ['transthoracic-tte'], plausible: ['contrast-echo', 'stress-echo'] },
  'murmur':                     { ideal: ['transthoracic-tte'], plausible: ['transoesophageal-toe', 'stress-echo'] },
  'suspected-valve-disease':    { ideal: ['transthoracic-tte', 'transoesophageal-toe'], plausible: ['stress-echo'] },
  'breathlessness':             { ideal: ['transthoracic-tte'], plausible: ['stress-echo', 'contrast-echo'] },
  'palpitations':               { ideal: ['transthoracic-tte'], plausible: ['transoesophageal-toe'] },
  'chest-pain':                 { ideal: ['transthoracic-tte', 'stress-echo'], plausible: ['contrast-echo'] },
  'hypertension':               { ideal: ['transthoracic-tte'], plausible: ['contrast-echo'] },
  'cardiomyopathy':             { ideal: ['transthoracic-tte'], plausible: ['contrast-echo', 'stress-echo'] },
  'endocarditis':               { ideal: ['transthoracic-tte', 'transoesophageal-toe'], plausible: [] },
  'post-mi':                    { ideal: ['transthoracic-tte'], plausible: ['stress-echo', 'contrast-echo'] },
  'pulmonary-hypertension':     { ideal: ['transthoracic-tte'], plausible: ['contrast-echo'] },
  'pre-chemotherapy':           { ideal: ['transthoracic-tte'], plausible: ['contrast-echo'] },
  'stroke-tia-source':          { ideal: ['transoesophageal-toe', 'transthoracic-tte'], plausible: ['contrast-echo'] },
  'congenital':                 { ideal: ['transthoracic-tte', 'transoesophageal-toe'], plausible: [] },
  'surveillance-known-disease': { ideal: ['transthoracic-tte'], plausible: ['transoesophageal-toe', 'stress-echo', 'contrast-echo'] },
  'other':                      { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x echoType pairing and return
 * the fired rule. Defaults to a neutral may-be-appropriate when the indication
 * or echo type has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, echoType) {
  if (!indication || !echoType) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or echo type not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_ECHO_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  if (map.ideal.includes(echoType)) {
    return {
      score: 8,
      band: 'appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${echoType} study is the recommended examination for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(echoType)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${echoType} study may be appropriate for "${indication}" but is not the first-line examination.`
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
    band: 'rarely-appropriate',
    firedRule: {
      ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
      axis: 'appropriateness',
      category: indication,
      description: `Requested ${echoType} study is rarely appropriate for "${indication}"; query the referrer.`
    }
  };
}

/** Map a 1-9 appropriateness score to its band. */
function appropriatenessBand(score) {
  if (score >= 7) return 'appropriate';
  if (score >= 4) return 'may-be-appropriate';
  return 'rarely-appropriate';
}

// ----------------------------------------------------------------------
// Axis B — Urgency triage (BSE referral acuity / red-flag escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then red flags
// and NT-proBNP thresholds (NICE NG106) auto-escalate it. The most-severe
// escalation wins.

const URGENCY_ORDER = ['routine', 'urgent', 'emergency'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 6 weeks',
  'urgent': 'Within 2 weeks',
  'emergency': 'Same day / inpatient'
};

// NICE NG106 NT-proBNP thresholds for suspected heart failure.
const NT_PROBNP_URGENT = 2000; // > 2000 ng/L: echo within 2 weeks (urgent)
const NT_PROBNP_ROUTINE = 400; // 400-2000 ng/L: echo within 6 weeks (routine)

/** Return whichever of two urgency tiers is more severe. */
function maxTier(a, b) {
  const ia = URGENCY_ORDER.indexOf(a);
  const ib = URGENCY_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Red-flag escalation rules, each forcing at least the given tier.
const URGENCY_RULES = [
  {
    ruleId: 'R-URGENCY-SUSPECTED-ENDOCARDITIS',
    tier: 'emergency',
    fires: (d) => d.redFlags.suspectedEndocarditis === true,
    description: 'Suspected infective endocarditis — emergency / inpatient echo.'
  },
  {
    ruleId: 'R-URGENCY-ACUTE-HEART-FAILURE',
    tier: 'emergency',
    fires: (d) => d.redFlags.acuteHeartFailure === true,
    description: 'Acute heart failure — emergency / inpatient echo.'
  },
  {
    ruleId: 'R-URGENCY-SEVERE-SYMPTOMATIC-VALVE',
    tier: 'urgent',
    fires: (d) => d.redFlags.severeSymptomaticValve === true,
    description: 'Severe symptomatic valve disease — urgent echo.'
  },
  {
    ruleId: 'R-URGENCY-SYNCOPE',
    tier: 'urgent',
    fires: (d) => d.symptoms.syncope === true,
    description: 'Syncope — urgent echo to exclude structural cause.'
  },
  {
    ruleId: 'R-URGENCY-NYHA-IV',
    tier: 'urgent',
    fires: (d) => d.symptoms.nyhaClass === 'iv',
    description: 'NYHA class IV symptoms — urgent echo.'
  },
  {
    ruleId: 'R-URGENCY-NT-PROBNP-HIGH',
    tier: 'urgent',
    fires: (d) =>
      d.investigations.bnpOrNtProbnp !== null &&
      d.investigations.bnpOrNtProbnp !== undefined &&
      Number(d.investigations.bnpOrNtProbnp) > NT_PROBNP_URGENT,
    description: 'NT-proBNP > 2000 ng/L (NICE NG106) — echo within 2 weeks.'
  }
];

/**
 * Compute the urgency tier, target timeframe, and fired urgency rules.
 *
 * @returns {{ tier:string, targetTimeframe:string, firedRules:object[] }}
 */
function scoreUrgency(data) {
  const requested = data.triage.urgency || 'routine';
  let tier = URGENCY_ORDER.includes(requested) ? requested : 'routine';
  const firedRules = [];

  for (const rule of URGENCY_RULES) {
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
      description: `No red flags; urgency follows the requested tier (${tier}).`
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
  { weight: 2, present: (d) => !!d.request.echoType, ruleId: 'R-COMPLETE-ECHO-TYPE', label: 'requested echo type' },
  { weight: 1, present: (d) => !!d.symptoms.nyhaClass, ruleId: 'R-COMPLETE-NYHA', label: 'NYHA class' },
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
// Axis D — Clinical priority (NYHA class, NT-proBNP, suspected severe disease)
// ----------------------------------------------------------------------
//
// Priority is the most-severe band any rule forces. NYHA III/IV, raised
// natriuretic peptide, and the red flags push the band toward high.

const PRIORITY_ORDER = ['low', 'moderate', 'high'];

/** Return whichever of two priority bands is more severe. */
function maxPriority(a, b) {
  const ia = PRIORITY_ORDER.indexOf(a);
  const ib = PRIORITY_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

const PRIORITY_RULES = [
  {
    ruleId: 'R-PRIORITY-RED-FLAG',
    band: 'high',
    fires: (d) =>
      d.redFlags.suspectedEndocarditis === true ||
      d.redFlags.severeSymptomaticValve === true ||
      d.redFlags.acuteHeartFailure === true,
    description: 'A red flag (endocarditis / severe symptomatic valve / acute heart failure) is present — high clinical priority.'
  },
  {
    ruleId: 'R-PRIORITY-NYHA-III-IV',
    band: 'high',
    fires: (d) => d.symptoms.nyhaClass === 'iii' || d.symptoms.nyhaClass === 'iv',
    description: 'NYHA class III or IV — high clinical priority.'
  },
  {
    ruleId: 'R-PRIORITY-NT-PROBNP-HIGH',
    band: 'high',
    fires: (d) =>
      d.investigations.bnpOrNtProbnp !== null &&
      d.investigations.bnpOrNtProbnp !== undefined &&
      Number(d.investigations.bnpOrNtProbnp) > NT_PROBNP_URGENT,
    description: 'NT-proBNP > 2000 ng/L (NICE NG106) — high clinical priority.'
  },
  {
    ruleId: 'R-PRIORITY-NT-PROBNP-MODERATE',
    band: 'moderate',
    fires: (d) =>
      d.investigations.bnpOrNtProbnp !== null &&
      d.investigations.bnpOrNtProbnp !== undefined &&
      Number(d.investigations.bnpOrNtProbnp) >= NT_PROBNP_ROUTINE &&
      Number(d.investigations.bnpOrNtProbnp) <= NT_PROBNP_URGENT,
    description: 'NT-proBNP 400-2000 ng/L (NICE NG106) — moderate clinical priority.'
  },
  {
    ruleId: 'R-PRIORITY-NYHA-II',
    band: 'moderate',
    fires: (d) => d.symptoms.nyhaClass === 'ii',
    description: 'NYHA class II — moderate clinical priority.'
  },
  {
    ruleId: 'R-PRIORITY-SYNCOPE',
    band: 'moderate',
    fires: (d) => d.symptoms.syncope === true,
    description: 'Syncope reported — moderate clinical priority.'
  }
];

/**
 * Compute the clinical-priority band and the fired priority rules.
 *
 * @returns {{ band:string, firedRules:object[] }}
 */
function scorePriority(data) {
  let band = 'low';
  const firedRules = [];

  for (const rule of PRIORITY_RULES) {
    if (rule.fires(data)) {
      band = maxPriority(band, rule.band);
      firedRules.push({
        ruleId: rule.ruleId,
        axis: 'priority',
        category: 'clinical-priority',
        description: rule.description
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-PRIORITY-BASELINE',
      axis: 'priority',
      category: 'baseline',
      description: 'No high-priority features; baseline low clinical priority.'
    });
  }

  return { band, firedRules };
}

Object.assign(NS, {
  scoreAppropriateness,
  appropriatenessBand,
  scoreUrgency,
  scoreCompleteness,
  scorePriority,
  maxTier,
  maxPriority,
  URGENCY_ORDER,
  PRIORITY_ORDER,
  TARGET_TIMEFRAMES,
  INDICATION_ECHO_MAP,
  NT_PROBNP_URGENT,
  NT_PROBNP_ROUTINE
});
})();
