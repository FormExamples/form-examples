// Four-axis rule catalogue for the Holter Monitor Test Request engine.
//
// Derived from index.md: (A) appropriateness 1-9 + band by indication x
// monitor-type fit AND symptom-frequency vs monitor-duration match;
// (B) urgency / triage with red-flag auto-escalation; (C) request completeness
// over mandatory fields, indication + clinical question weighted highest;
// (D) clinical priority banding across symptoms and cardiac context. Rule IDs
// are stable and identical across every front-end and the back-end
// (R-APPROP-*, R-MATCH-*, R-TRIAGE-*, R-COMPLETE-*, R-PRIORITY-*). Pure data +
// helpers; the grader composes them.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACC/AHA ambulatory ECG 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal monitor type (or set of types). When the
// requested monitor type matches the indication well, the request scores high
// (7-9, usually-appropriate). Plausible-but-suboptimal pairings score in the
// 4-6 may-be-appropriate band; clearly mismatched pairings score 1-3. The
// raw indication-fit score is then adjusted by the symptom-frequency /
// monitor-duration match (see Axis A.2 below).

// Map of indication -> { ideal:[monitorType], plausible:[monitorType] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_MONITOR_MAP = {
  'palpitations':                  { ideal: ['24-hour', '48-hour', '7-day'], plausible: ['14-day', 'event-recorder'] },
  'suspected-arrhythmia':          { ideal: ['24-hour', '48-hour', '7-day'], plausible: ['14-day', 'event-recorder', 'implantable-loop-recorder'] },
  'syncope':                       { ideal: ['7-day', '14-day', 'implantable-loop-recorder'], plausible: ['48-hour', 'event-recorder', '24-hour'] },
  'atrial-fibrillation-detection': { ideal: ['7-day', '14-day'], plausible: ['48-hour', '24-hour', 'event-recorder'] },
  'post-stroke-af-screen':         { ideal: ['7-day', '14-day', 'implantable-loop-recorder'], plausible: ['48-hour', '24-hour'] },
  'rate-control-assessment':       { ideal: ['24-hour', '48-hour'], plausible: ['7-day'] },
  'qt-monitoring':                 { ideal: ['24-hour', '48-hour'], plausible: ['7-day'] },
  'pacemaker-check':               { ideal: ['24-hour', '48-hour'], plausible: ['7-day'] },
  'other':                         { ideal: [], plausible: [] }
};

/**
 * Score the raw indication x monitorType appropriateness (1-9) and return the
 * fired rule. Defaults to a neutral may-be-appropriate when the indication or
 * monitor type has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, monitorType) {
  if (!indication || !monitorType) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or monitor type not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_MONITOR_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  if (map.ideal.includes(monitorType)) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${monitorType} monitor is a recommended choice for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(monitorType)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${monitorType} monitor may be appropriate for "${indication}" but is not the first-line choice.`
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
      description: `Requested ${monitorType} monitor is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis A.2 — Symptom-frequency / monitor-duration match
// ----------------------------------------------------------------------
//
// The diagnostic yield of a short Holter is high only for frequent symptoms;
// infrequent symptoms need longer or patient-activated recording. The match
// either reinforces or downgrades the raw appropriateness score and feeds the
// symptom-frequency / monitor-mismatch safety flag.
//
// | Symptom frequency | Recommended monitor                              |
// | ----------------- | ------------------------------------------------ |
// | daily             | 24-hour or 48-hour Holter                        |
// | weekly            | 7-day monitor                                    |
// | monthly           | 14-day monitor or event recorder                 |
// | rare (< monthly)  | event recorder or implantable loop recorder      |

const FREQUENCY_MONITOR_MAP = {
  'daily':   { matched: ['24-hour', '48-hour'], borderline: ['7-day'] },
  'weekly':  { matched: ['7-day'], borderline: ['48-hour', '14-day'] },
  'monthly': { matched: ['14-day', 'event-recorder'], borderline: ['7-day', 'implantable-loop-recorder'] },
  'rare':    { matched: ['event-recorder', 'implantable-loop-recorder'], borderline: ['14-day'] }
};

// Recommended monitor copy per frequency, for mismatch messaging.
const FREQUENCY_RECOMMENDED_LABEL = {
  'daily':   '24-hour or 48-hour Holter',
  'weekly':  '7-day monitor',
  'monthly': '14-day monitor or event recorder',
  'rare':    'event recorder or implantable loop recorder'
};

/**
 * Evaluate the symptom-frequency / monitor-duration match.
 *
 * @returns {{ fit:string, recommendedMonitor:string, firedRule:object|null }}
 *   fit is '' | 'matched' | 'borderline' | 'mismatched'.
 */
function evaluateFrequencyMatch(symptomFrequency, monitorType) {
  if (!symptomFrequency || !monitorType) {
    return {
      fit: '',
      recommendedMonitor: '',
      firedRule: {
        ruleId: 'R-MATCH-UNKNOWN',
        axis: 'appropriateness',
        category: symptomFrequency || 'unspecified',
        description: 'Symptom frequency or monitor type not yet specified — match not assessed.'
      }
    };
  }

  const map = FREQUENCY_MONITOR_MAP[symptomFrequency];
  const recommendedMonitor = FREQUENCY_RECOMMENDED_LABEL[symptomFrequency] || '';
  const freqKey = symptomFrequency.toUpperCase().replace(/[^A-Z]+/g, '-');

  if (!map) {
    return {
      fit: '',
      recommendedMonitor: '',
      firedRule: null
    };
  }

  if (map.matched.includes(monitorType)) {
    return {
      fit: 'matched',
      recommendedMonitor: '',
      firedRule: {
        ruleId: `R-MATCH-${freqKey}-MATCHED`,
        axis: 'appropriateness',
        category: 'symptom-frequency',
        description: `${monitorType} monitor matches ${symptomFrequency} symptoms.`
      }
    };
  }
  if (map.borderline.includes(monitorType)) {
    return {
      fit: 'borderline',
      recommendedMonitor,
      firedRule: {
        ruleId: `R-MATCH-${freqKey}-BORDERLINE`,
        axis: 'appropriateness',
        category: 'symptom-frequency',
        description: `${monitorType} monitor is a borderline fit for ${symptomFrequency} symptoms; ${recommendedMonitor} preferred.`
      }
    };
  }
  return {
    fit: 'mismatched',
    recommendedMonitor,
    firedRule: {
      ruleId: `R-MATCH-${freqKey}-MISMATCH`,
      axis: 'appropriateness',
      category: 'symptom-frequency',
      description: `${monitorType} monitor is a poor fit for ${symptomFrequency} symptoms; ${recommendedMonitor} recommended.`
    }
  };
}

/**
 * Combine the raw appropriateness score with the frequency-match fit, clamped
 * to 1-9. A mismatch downgrades; a match nudges up.
 */
function adjustAppropriatenessForMatch(rawScore, matchFit) {
  let score = rawScore;
  if (matchFit === 'matched') score += 1;
  else if (matchFit === 'borderline') score -= 1;
  else if (matchFit === 'mismatched') score -= 3;
  return Math.max(1, Math.min(9, score));
}

// ----------------------------------------------------------------------
// Axis B — Urgency / triage (red-flag escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then red flags
// auto-escalate it. The most-severe escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent', 'emergency'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 4-6 weeks',
  'urgent': 'Within 1-2 weeks',
  'emergency': 'Same day / 24-48 hours'
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
    ruleId: 'R-TRIAGE-SYNCOPE',
    tier: 'emergency',
    fires: (d) => d.symptoms.syncope === true,
    description: 'Syncope — emergency / expedited ambulatory monitoring; consider admission.'
  },
  {
    ruleId: 'R-TRIAGE-SUSPECTED-VT',
    tier: 'emergency',
    fires: (d) => d.cardiac.knownArrhythmia === 'vt',
    description: 'Known / suspected ventricular tachycardia — emergency assessment.'
  },
  {
    ruleId: 'R-TRIAGE-POST-STROKE-AF',
    tier: 'urgent',
    fires: (d) =>
      d.cardiac.recentStrokeTia === true ||
      d.request.primaryIndication === 'post-stroke-af-screen',
    description: 'Recent stroke / TIA AF detection — urgent prolonged monitoring.'
  },
  {
    ruleId: 'R-TRIAGE-PRESYNCOPE',
    tier: 'urgent',
    fires: (d) => d.symptoms.presyncope === true,
    description: 'Presyncope / near-syncope — expedited assessment.'
  },
  {
    ruleId: 'R-TRIAGE-HEART-BLOCK',
    tier: 'urgent',
    fires: (d) => d.cardiac.knownArrhythmia === 'heart-block',
    description: 'Known heart block — expedited assessment.'
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
        category: 'red-flag',
        description: rule.description
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-TRIAGE-REQUESTED',
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
  { weight: 2, present: (d) => !!d.request.monitorType, ruleId: 'R-COMPLETE-MONITOR-TYPE', label: 'monitor type' },
  { weight: 2, present: (d) => !!d.symptoms.symptomFrequency, ruleId: 'R-COMPLETE-SYMPTOM-FREQUENCY', label: 'symptom frequency' },
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
// Axis D — Clinical priority (acuity banding)
// ----------------------------------------------------------------------
//
// An acuity score is accumulated from symptoms and cardiac context, then
// banded low / moderate / high. Orthogonal to triage: a low-acuity request can
// still be urgent if the referrer requested it, and vice versa.

const PRIORITY_RULES = [
  { ruleId: 'R-PRIORITY-SYNCOPE',        points: 3, fires: (d) => d.symptoms.syncope === true, description: 'Syncope is a high-acuity presentation.' },
  { ruleId: 'R-PRIORITY-SUSPECTED-VT',   points: 3, fires: (d) => d.cardiac.knownArrhythmia === 'vt', description: 'Ventricular tachycardia is a high-acuity arrhythmia.' },
  { ruleId: 'R-PRIORITY-PRESYNCOPE',     points: 2, fires: (d) => d.symptoms.presyncope === true, description: 'Presyncope raises clinical acuity.' },
  { ruleId: 'R-PRIORITY-POST-STROKE',    points: 2, fires: (d) => d.cardiac.recentStrokeTia === true, description: 'Recent stroke / TIA raises clinical acuity.' },
  { ruleId: 'R-PRIORITY-HEART-BLOCK',    points: 2, fires: (d) => d.cardiac.knownArrhythmia === 'heart-block', description: 'Heart block raises clinical acuity.' },
  { ruleId: 'R-PRIORITY-KNOWN-AF',       points: 1, fires: (d) => d.cardiac.knownArrhythmia === 'atrial-fibrillation', description: 'Known atrial fibrillation.' },
  { ruleId: 'R-PRIORITY-KNOWN-SVT',      points: 1, fires: (d) => d.cardiac.knownArrhythmia === 'svt', description: 'Known supraventricular tachycardia.' },
  { ruleId: 'R-PRIORITY-BREATHLESSNESS', points: 1, fires: (d) => d.symptoms.breathlessness === true, description: 'Breathlessness raises clinical acuity.' },
  { ruleId: 'R-PRIORITY-PALPITATIONS',   points: 1, fires: (d) => d.symptoms.palpitations === true, description: 'Palpitations recorded.' }
];

/**
 * Compute the clinical-priority band and fired priority rules.
 *
 * @returns {{ band:string, score:number, firedRules:object[] }}
 */
function scorePriority(data) {
  let score = 0;
  const firedRules = [];
  for (const rule of PRIORITY_RULES) {
    if (rule.fires(data)) {
      score += rule.points;
      firedRules.push({
        ruleId: rule.ruleId,
        axis: 'priority',
        category: 'acuity',
        description: rule.description
      });
    }
  }
  let band = 'low';
  if (score >= 4) band = 'high';
  else if (score >= 2) band = 'moderate';

  firedRules.push({
    ruleId: `R-PRIORITY-BAND-${band.toUpperCase()}`,
    axis: 'priority',
    category: 'band',
    description: `Acuity score ${score} maps to ${band} clinical priority.`
  });

  return { band, score, firedRules };
}

export { scoreAppropriateness, appropriatenessBand, evaluateFrequencyMatch, adjustAppropriatenessForMatch, scoreTriage, scoreCompleteness, scorePriority, maxTier, TRIAGE_ORDER, TARGET_TIMEFRAMES, INDICATION_MONITOR_MAP, FREQUENCY_MONITOR_MAP, FREQUENCY_RECOMMENDED_LABEL };
