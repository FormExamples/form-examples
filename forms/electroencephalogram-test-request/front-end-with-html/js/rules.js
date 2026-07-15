// Four-axis rule catalogue for the Electroencephalogram (EEG) Test Request
// engine.
//
// Derived from index.md and the SQL grade axes: (A) appropriateness 1-9 + band
// by indication x EEG type (NICE NG217 / ILAE); (B) urgency triage tier with
// suspected-status-epilepticus auto-escalation to emergency; (C) request
// completeness over mandatory fields; (D) clinical priority (acuity weighting
// of indication + context). Rule IDs are stable and identical across every
// front-end and the back-end (R-APPROP-*, R-URGENCY-*, R-COMPLETE-*,
// R-PRIORITY-*). Pure data + helpers; the grader composes them.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (NICE NG217 / ILAE, 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal EEG type (or set of types). When the requested
// EEG type matches the indication well, the request scores high (7-9,
// usually-appropriate). Plausible-but-suboptimal pairings score in the 4-6
// may-be-appropriate band; clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[eegType], plausible:[eegType] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_EEG_MAP = {
  'suspected-epilepsy':      { ideal: ['routine-awake'], plausible: ['sleep-deprived'] },
  'seizure-classification':  { ideal: ['routine-awake', 'sleep-deprived'], plausible: ['video-telemetry', 'ambulatory-24h'] },
  'status-epilepticus':      { ideal: ['routine-awake'], plausible: ['video-telemetry'] },
  'encephalopathy':          { ideal: ['routine-awake'], plausible: ['video-telemetry'] },
  'first-seizure':           { ideal: ['routine-awake'], plausible: ['sleep-deprived'] },
  'funny-turns':             { ideal: ['ambulatory-24h', 'video-telemetry'], plausible: ['routine-awake', 'sleep-deprived'] },
  'dementia':                { ideal: ['routine-awake'], plausible: ['ambulatory-24h'] },
  'pre-surgical-evaluation': { ideal: ['video-telemetry'], plausible: ['ambulatory-24h'] },
  'medication-review':       { ideal: ['routine-awake', 'ambulatory-24h'], plausible: ['sleep-deprived'] },
  'other':                   { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x eegType pairing and return
 * the fired rule. Defaults to a neutral may-be-appropriate when the indication
 * or EEG type has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, eegType) {
  if (!indication || !eegType) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or EEG type not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_EEG_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  if (map.ideal.includes(eegType)) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${eegType} EEG is the recommended study for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(eegType)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${eegType} EEG may be appropriate for "${indication}" but is not the first-line study.`
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
      description: `Requested ${eegType} EEG is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Urgency (triage tier with red-flag escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then red flags
// auto-escalate it. Suspected status epilepticus forces emergency. The
// most-severe escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent', 'emergency'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 4-6 weeks',
  'urgent': 'Within 24-72 hours',
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
    ruleId: 'R-URGENCY-STATUS-EPILEPTICUS',
    tier: 'emergency',
    fires: (d) => d.redFlags.suspectedStatusEpilepticus === true ||
      d.request.primaryIndication === 'status-epilepticus',
    description: 'Suspected status epilepticus — emergency EEG.'
  },
  {
    ruleId: 'R-URGENCY-ENCEPHALOPATHY',
    tier: 'urgent',
    fires: (d) => d.request.primaryIndication === 'encephalopathy',
    description: 'Encephalopathy indication — urgent EEG to exclude non-convulsive status.'
  },
  {
    ruleId: 'R-URGENCY-RECENT-FIRST-SEIZURE',
    tier: 'urgent',
    fires: (d) => d.redFlags.recentSeizure === true &&
      (d.context.firstSeizure === true || d.request.primaryIndication === 'first-seizure'),
    description: 'Recent first seizure — expedited first-seizure-clinic EEG.'
  }
];

/**
 * Compute the triage tier, target timeframe, and fired urgency rules.
 *
 * @returns {{ tier:string, targetTimeframe:string, firedRules:object[] }}
 */
function scoreUrgency(data) {
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
  { weight: 2, present: (d) => !!d.request.eegType, ruleId: 'R-COMPLETE-EEG-TYPE', label: 'requested EEG type' },
  { weight: 1, present: (d) => !!d.request.relevantHistory && d.request.relevantHistory.trim() !== '', ruleId: 'R-COMPLETE-HISTORY', label: 'relevant history' },
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
// Axis D — Clinical priority (acuity weighting of indication + context)
// ----------------------------------------------------------------------
//
// Each priority rule contributes a band (low / moderate / high). The most
// severe contributing band wins. High-acuity indications (status epilepticus,
// encephalopathy) and red flags push priority high.

const PRIORITY_ORDER = ['low', 'moderate', 'high'];

/** Return whichever of two priority bands is more severe. */
function maxPriority(a, b) {
  const ia = PRIORITY_ORDER.indexOf(a);
  const ib = PRIORITY_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

const PRIORITY_RULES = [
  {
    ruleId: 'R-PRIORITY-STATUS-EPILEPTICUS',
    band: 'high',
    fires: (d) => d.redFlags.suspectedStatusEpilepticus === true ||
      d.request.primaryIndication === 'status-epilepticus',
    description: 'Suspected status epilepticus — highest clinical priority.'
  },
  {
    ruleId: 'R-PRIORITY-ENCEPHALOPATHY',
    band: 'high',
    fires: (d) => d.request.primaryIndication === 'encephalopathy',
    description: 'Encephalopathy — high priority to exclude non-convulsive status.'
  },
  {
    ruleId: 'R-PRIORITY-RECENT-FIRST-SEIZURE',
    band: 'moderate',
    fires: (d) => d.redFlags.recentSeizure === true &&
      (d.context.firstSeizure === true || d.request.primaryIndication === 'first-seizure'),
    description: 'Recent first seizure — moderate priority.'
  },
  {
    ruleId: 'R-PRIORITY-FIRST-SEIZURE',
    band: 'moderate',
    fires: (d) => d.context.firstSeizure === true ||
      d.request.primaryIndication === 'first-seizure',
    description: 'First-seizure work-up — moderate priority.'
  },
  {
    ruleId: 'R-PRIORITY-PRE-SURGICAL',
    band: 'moderate',
    fires: (d) => d.request.primaryIndication === 'pre-surgical-evaluation',
    description: 'Pre-surgical evaluation — moderate priority.'
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
        category: 'acuity',
        description: rule.description
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-PRIORITY-BASELINE',
      axis: 'priority',
      category: 'baseline',
      description: 'No high-acuity indication or red flag; routine clinical priority.'
    });
  }

  return { band, firedRules };
}

export { scoreAppropriateness, appropriatenessBand, scoreUrgency, scoreCompleteness, scorePriority, maxTier, maxPriority, TRIAGE_ORDER, TARGET_TIMEFRAMES, PRIORITY_ORDER, INDICATION_EEG_MAP };
