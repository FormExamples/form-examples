// Four-axis rule catalogue for the Pulmonary Function Test Request engine.
//
// Derived from index.md: (A) appropriateness 1-9 + band by indication x test
// type (NICE NG80 / NG115, ARTP indication match); (B) safety /
// contraindication band (ok / caution / contraindicated) from the
// forced-expiration & infection-control screen; (C) request completeness over
// mandatory fields; (D) triage tier (routine / urgent) with urgency
// escalation. Rule IDs are stable and identical across every front-end and the
// back-end (R-APPROP-*, R-SAFETY-*, R-COMPLETE-*, R-TRIAGE-*). Pure data +
// helpers; the grader composes them.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (NICE NG80 / NG115, ARTP indication match; 1-9)
// ----------------------------------------------------------------------
//
// Each indication has an ideal test type (or set of types). When the requested
// test type matches the indication well, the request scores high (7-9,
// usually-appropriate). Plausible-but-suboptimal pairings score in the 4-6
// may-be-appropriate band; clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[testType], plausible:[testType] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_TEST_MAP = {
  'suspected-asthma':          { ideal: ['spirometry-with-reversibility', 'feno'], plausible: ['spirometry', 'peak-flow'] },
  'suspected-copd':            { ideal: ['spirometry', 'spirometry-with-reversibility'], plausible: ['full-lung-function', 'gas-transfer-dlco'] },
  'breathlessness':            { ideal: ['spirometry', 'full-lung-function'], plausible: ['gas-transfer-dlco', 'spirometry-with-reversibility'] },
  'chronic-cough':             { ideal: ['spirometry', 'feno'], plausible: ['spirometry-with-reversibility', 'peak-flow'] },
  'pre-operative':             { ideal: ['spirometry', 'full-lung-function'], plausible: ['gas-transfer-dlco'] },
  'occupational-lung-disease': { ideal: ['peak-flow', 'spirometry'], plausible: ['full-lung-function', 'gas-transfer-dlco'] },
  'monitoring':                { ideal: ['spirometry', 'peak-flow'], plausible: ['spirometry-with-reversibility', 'full-lung-function'] },
  'restrictive-disease':       { ideal: ['full-lung-function', 'gas-transfer-dlco'], plausible: ['spirometry'] },
  'other':                     { ideal: [], plausible: [] }
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
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${testType} test is the recommended first-line investigation for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(testType)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${testType} test may be appropriate for "${indication}" but is not the first-line investigation.`
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
      description: `Requested ${testType} test is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Safety / contraindication (ARTP / ERS-ATS)
// ----------------------------------------------------------------------
//
// Forced-expiration and infection-control contraindications downgrade the
// safety band. Recent MI / recent eye / thoracic / abdominal surgery and
// haemoptysis are forced-expiration contraindications (contraindicated).
// Active respiratory infection and suspected active tuberculosis are
// infection-control concerns for shared equipment (contraindicated). The
// band starts at `ok` and is downgraded by the most-severe rule that fires.

const SAFETY_ORDER = ['ok', 'caution', 'contraindicated'];

/** Return whichever of two safety bands is more severe (further from ok). */
function maxBand(a, b) {
  const ia = SAFETY_ORDER.indexOf(a);
  const ib = SAFETY_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Safety rules, each forcing at least the given band.
const SAFETY_RULES = [
  {
    ruleId: 'R-SAFETY-RECENT-MI-SURGERY',
    band: 'contraindicated',
    fires: (d) => d.safety.recentMiOrEyeAbdominalSurgery === true,
    description: 'Recent myocardial infarction or recent eye / thoracic / abdominal surgery — forced expiration contraindicated.'
  },
  {
    ruleId: 'R-SAFETY-HAEMOPTYSIS',
    band: 'contraindicated',
    fires: (d) => d.safety.haemoptysis === true,
    description: 'Haemoptysis of unknown origin — forced expiration contraindicated until investigated.'
  },
  {
    ruleId: 'R-SAFETY-SUSPECTED-TB',
    band: 'contraindicated',
    fires: (d) => d.safety.suspectedActiveTuberculosis === true,
    description: 'Suspected active tuberculosis — infection-control contraindication for shared lung-function equipment.'
  },
  {
    ruleId: 'R-SAFETY-RESPIRATORY-INFECTION',
    band: 'caution',
    fires: (d) => d.safety.recentRespiratoryInfection === true,
    description: 'Recent respiratory infection — defer for infection control and result validity (caution).'
  }
];

/**
 * Compute the safety / contraindication band and the fired safety rules.
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
        category: 'contraindication',
        description: rule.description
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-SAFETY-CLEAR',
      axis: 'safety',
      category: 'contraindication',
      description: 'No forced-expiration or infection-control contraindication identified.'
    });
  }

  return { band, firedRules };
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
  { weight: 2, present: (d) => !!d.request.testType, ruleId: 'R-COMPLETE-TEST-TYPE', label: 'requested test type' },
  { weight: 2, present: (d) => !!d.background.smokingStatus, ruleId: 'R-COMPLETE-SMOKING-STATUS', label: 'smoking status' },
  { weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
  { weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
  { weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
  { weight: 1, present: (d) => heightPresent(d) && weightPresent(d), ruleId: 'R-COMPLETE-ANTHROPOMETRY', label: 'height and weight' },
  { weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
  { weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
  { weight: 1, present: (d) => !!d.triage.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

function heightPresent(d) {
  return d.patient.heightCm !== null && d.patient.heightCm !== undefined && d.patient.heightCm !== '';
}

function weightPresent(d) {
  return d.patient.weightKg !== null && d.patient.weightKg !== undefined && d.patient.weightKg !== '';
}

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
// Axis D — Triage priority (routine / urgent)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency. A small set of
// escalation conditions can force the urgent tier. The most-severe escalation
// wins.

const TRIAGE_ORDER = ['routine', 'urgent'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 4-6 weeks',
  'urgent': 'Within 1-2 weeks'
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
    ruleId: 'R-TRIAGE-HAEMOPTYSIS',
    tier: 'urgent',
    fires: (d) => d.safety.haemoptysis === true,
    description: 'Haemoptysis — expedite investigation; urgent assessment.'
  },
  {
    ruleId: 'R-TRIAGE-PRE-OPERATIVE',
    tier: 'urgent',
    fires: (d) => d.request.primaryIndication === 'pre-operative',
    description: 'Pre-operative indication — expedite to avoid delaying surgery.'
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

export { scoreAppropriateness, appropriatenessBand, scoreSafety, maxBand, SAFETY_ORDER, scoreCompleteness, scoreTriage, maxTier, TRIAGE_ORDER, TARGET_TIMEFRAMES, INDICATION_TEST_MAP };
