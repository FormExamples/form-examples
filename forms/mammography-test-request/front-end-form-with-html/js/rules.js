// Four-axis rule catalogue for the Mammography Test Request engine.
//
// Derived from index.md and the SQL grade tables: (A) appropriateness 1-9 +
// band by exam type x indication (ACR Appropriateness Criteria / NHSBSP);
// (B) cancer-pathway urgency (triage tier routine / urgent / two-week-wait /
// emergency) with NICE NG12 two-week-wait auto-escalation; (C) request
// completeness over mandatory fields, indication + clinical question weighted
// highest; (D) clinical priority (low / moderate / high) from symptom + risk
// escalation rules. Rule IDs are stable and identical across every front-end
// and the back-end (R-APPROP-*, R-URGENCY-*, R-COMPLETE-*, R-PRIORITY-*).
//
// Wrapped in an IIFE; published via `window.MammographyTestRequest`.

(function () {
'use strict';
window.MammographyTestRequest =
  window.MammographyTestRequest || {};
const NS = window.MammographyTestRequest;

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACR Appropriateness Criteria 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each clinical indication has an ideal exam type (or set of types). When the
// requested exam type matches the indication well, the request scores high
// (7-9, usually-appropriate). Plausible-but-suboptimal pairings score in the
// 4-6 may-be-appropriate band; clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[examType], plausible:[examType] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_EXAM_MAP = {
  'routine-screening':          { ideal: ['screening'], plausible: [] },
  'family-history':             { ideal: ['screening', 'surveillance'], plausible: ['diagnostic'] },
  'breast-lump':                { ideal: ['diagnostic', 'symptomatic'], plausible: ['surveillance'] },
  'breast-pain':                { ideal: ['symptomatic', 'diagnostic'], plausible: [] },
  'nipple-discharge':           { ideal: ['symptomatic', 'diagnostic'], plausible: [] },
  'skin-change':                { ideal: ['symptomatic', 'diagnostic'], plausible: [] },
  'recall-from-screening':      { ideal: ['diagnostic'], plausible: ['symptomatic', 'surveillance'] },
  'follow-up-known-cancer':     { ideal: ['surveillance', 'diagnostic'], plausible: [] },
  'post-treatment-surveillance': { ideal: ['surveillance'], plausible: ['diagnostic', 'screening'] },
  'other':                      { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x examType pairing and return
 * the fired rule. Defaults to a neutral may-be-appropriate when the indication
 * or exam type has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, examType) {
  if (!indication || !examType) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or exam type not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_EXAM_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  if (map.ideal.includes(examType)) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${examType} mammography is the recommended examination for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(examType)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${examType} mammography may be appropriate for "${indication}" but is not the first-line examination.`
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
      description: `Requested ${examType} mammography is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Cancer-pathway urgency (NICE NG12 suspected-cancer criteria)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then NICE NG12
// suspected-cancer triggers auto-escalate it to two-week-wait. The most-severe
// escalation wins. Two-week-wait eligibility + rationale are emitted alongside.

const TRIAGE_ORDER = ['routine', 'urgent', 'two-week-wait', 'emergency'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 6 weeks (routine)',
  'urgent': 'Within 1-2 weeks (urgent)',
  'two-week-wait': 'Seen within 14 days (NICE NG12 two-week-wait)',
  'emergency': 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a, b) {
  const ia = TRIAGE_ORDER.indexOf(a);
  const ib = TRIAGE_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Compute patient age in whole years from a date-of-birth string.
function ageInYears(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

// NICE NG12 two-week-wait escalation rules. Each, when it fires, forces at
// least the two-week-wait tier and records a rationale.
const URGENCY_RULES = [
  {
    ruleId: 'R-URGENCY-NG12-LUMP-30',
    tier: 'two-week-wait',
    fires: (d) => d.symptoms.symptomLump === true && ageGte(d, 30),
    rationale: 'NICE NG12: unexplained breast lump aged 30 or over.'
  },
  {
    ruleId: 'R-URGENCY-NG12-SKIN-CHANGE-50',
    tier: 'two-week-wait',
    fires: (d) => d.symptoms.symptomSkinChange === true && ageGte(d, 50),
    rationale: 'NICE NG12: suspicious skin change aged 50 or over.'
  },
  {
    ruleId: 'R-URGENCY-NG12-NIPPLE-CHANGE-50',
    tier: 'two-week-wait',
    fires: (d) =>
      (d.symptoms.symptomNippleInversion === true ||
        d.symptoms.symptomNippleDischarge === true) && ageGte(d, 50),
    rationale: 'NICE NG12: nipple change (inversion / discharge) aged 50 or over.'
  }
];

function ageGte(d, threshold) {
  const age = ageInYears(d.patient.dateOfBirth);
  return age !== null && age >= threshold;
}

/**
 * Compute the cancer-pathway triage tier, target timeframe, two-week-wait
 * eligibility + rationale, and fired urgency rules.
 *
 * @returns {{ tier:string, targetTimeframe:string, twoWeekWaitEligible:boolean,
 *   twoWeekWaitRationale:string, firedRules:object[] }}
 */
function scoreUrgency(data) {
  const requested = data.triage.urgency || 'routine';
  let tier = TRIAGE_ORDER.includes(requested) ? requested : 'routine';
  const firedRules = [];
  let twoWeekWaitEligible = false;
  const rationales = [];

  for (const rule of URGENCY_RULES) {
    if (rule.fires(data)) {
      tier = maxTier(tier, rule.tier);
      twoWeekWaitEligible = true;
      rationales.push(rule.rationale);
      firedRules.push({
        ruleId: rule.ruleId,
        axis: 'urgency',
        category: 'suspected-cancer-2ww',
        description: rule.rationale
      });
    }
  }

  // Honour an explicitly-requested two-week-wait / urgent / emergency tier.
  if (requested === 'two-week-wait' && !twoWeekWaitEligible) {
    twoWeekWaitEligible = true;
    rationales.push('Requested on the two-week-wait pathway by the referrer.');
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-URGENCY-REQUESTED',
      axis: 'urgency',
      category: 'requested',
      description: `No NICE NG12 trigger fired; triage follows the requested urgency (${tier}).`
    });
  }

  return {
    tier,
    targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
    twoWeekWaitEligible,
    twoWeekWaitRationale: rationales.join(' '),
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
  { weight: 2, present: (d) => !!d.request.examType, ruleId: 'R-COMPLETE-EXAM-TYPE', label: 'exam type' },
  { weight: 2, present: (d) => !!d.request.laterality, ruleId: 'R-COMPLETE-LATERALITY', label: 'laterality' },
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
// Axis D — Clinical priority (symptom + risk escalation)
// ----------------------------------------------------------------------
//
// A base "low" priority is escalated by symptom and risk-factor rules. The
// most-severe escalation wins (low < moderate < high).

const PRIORITY_ORDER = ['low', 'moderate', 'high'];

function maxPriority(a, b) {
  const ia = PRIORITY_ORDER.indexOf(a);
  const ib = PRIORITY_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Priority escalation rules, each forcing at least the given band.
const PRIORITY_RULES = [
  {
    ruleId: 'R-PRIORITY-LUMP',
    band: 'high',
    fires: (d) => d.symptoms.symptomLump === true,
    description: 'Breast lump reported — high clinical priority.'
  },
  {
    ruleId: 'R-PRIORITY-BLOODY-DISCHARGE',
    band: 'high',
    fires: (d) => d.symptoms.symptomNippleDischarge === true,
    description: 'Nipple discharge reported — high clinical priority.'
  },
  {
    ruleId: 'R-PRIORITY-SKIN-CHANGE',
    band: 'high',
    fires: (d) => d.symptoms.symptomSkinChange === true,
    description: 'Skin change reported — high clinical priority.'
  },
  {
    ruleId: 'R-PRIORITY-NIPPLE-INVERSION',
    band: 'high',
    fires: (d) => d.symptoms.symptomNippleInversion === true,
    description: 'New nipple inversion / retraction reported — high clinical priority.'
  },
  {
    ruleId: 'R-PRIORITY-FAMILY-HISTORY',
    band: 'moderate',
    fires: (d) => d.history.familyHistoryBreastCancer === true,
    description: 'Family history of breast cancer — moderate clinical priority.'
  },
  {
    ruleId: 'R-PRIORITY-PAIN',
    band: 'moderate',
    fires: (d) => d.symptoms.symptomPain === true,
    description: 'Breast pain reported — moderate clinical priority.'
  },
  {
    ruleId: 'R-PRIORITY-ABNORMAL-PRIOR',
    band: 'moderate',
    fires: (d) => d.history.previousMammogram === 'abnormal',
    description: 'Previous abnormal mammogram — moderate clinical priority.'
  }
];

/**
 * Compute the clinical-priority band and fired priority rules.
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
        category: 'escalation',
        description: rule.description
      });
    }
  }
  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-PRIORITY-BASELINE',
      axis: 'priority',
      category: 'baseline',
      description: 'No symptom or risk escalation; baseline low clinical priority.'
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
  ageInYears,
  TRIAGE_ORDER,
  PRIORITY_ORDER,
  TARGET_TIMEFRAMES,
  INDICATION_EXAM_MAP
});
})();
