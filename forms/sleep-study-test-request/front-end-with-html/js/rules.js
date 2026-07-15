// Four-axis rule catalogue for the Sleep Study Test Request engine.
//
// Derived from index.md: (A) appropriateness 1-9 + band by indication x study
// type, boosted by Epworth / STOP-BANG; (B) clinical priority low/moderate/high
// driven by occupational driving, severe daytime sleepiness, and comorbidity;
// (C) request completeness over mandatory fields (indication, clinical
// question, and Epworth weighted highest); (D) triage routine/urgent with
// DVLA auto-escalation. Rule IDs are stable and identical across every
// front-end and the back-end (R-APPROP-*, R-PRIORITY-*, R-COMPLETE-*,
// R-TRIAGE-*). Pure data + helpers; the grader composes them.

// Epworth above this threshold indicates abnormal / severe daytime sleepiness.
const EPWORTH_ABNORMAL = 11;     // >10 indicates abnormal daytime sleepiness
const EPWORTH_SEVERE = 16;       // >=16 severe excessive sleepiness
// STOP-BANG >= 5 indicates high OSA risk.
const STOP_BANG_HIGH_RISK = 5;
const STOP_BANG_INTERMEDIATE = 3;

// ----------------------------------------------------------------------
// Axis A — Appropriateness (NICE NG202 / SIGN 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal study type (or set of types). When the
// requested study type matches the indication well, the request scores high
// (7-9, usually-appropriate). Plausible-but-suboptimal pairings score in the
// 4-6 may-be-appropriate band; clearly mismatched pairings score 1-3. A high
// Epworth or STOP-BANG nudges an OSA-pathway request upward; their absence on
// an OSA pathway nudges it down.

// Map of indication -> { ideal:[studyType], plausible:[studyType] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_STUDY_MAP = {
  'suspected-osa':        { ideal: ['home-sleep-apnoea-test', 'polysomnography'], plausible: ['overnight-oximetry'] },
  'snoring':              { ideal: ['home-sleep-apnoea-test'], plausible: ['overnight-oximetry', 'polysomnography'] },
  'daytime-sleepiness':   { ideal: ['home-sleep-apnoea-test', 'polysomnography'], plausible: ['multiple-sleep-latency-test', 'overnight-oximetry'] },
  'suspected-narcolepsy': { ideal: ['multiple-sleep-latency-test', 'polysomnography'], plausible: ['actigraphy'] },
  'insomnia':             { ideal: ['actigraphy'], plausible: ['polysomnography'] },
  'restless-legs':        { ideal: ['polysomnography'], plausible: ['actigraphy'] },
  'copd-overlap':         { ideal: ['polysomnography', 'overnight-oximetry'], plausible: ['home-sleep-apnoea-test'] },
  'pre-bariatric':        { ideal: ['home-sleep-apnoea-test', 'polysomnography'], plausible: ['overnight-oximetry'] },
  'driver-assessment':    { ideal: ['home-sleep-apnoea-test', 'polysomnography'], plausible: ['overnight-oximetry'] },
  'other':                { ideal: [], plausible: [] }
};

// Indications whose pathway is OSA-centric and therefore expects Epworth /
// STOP-BANG evidence.
const OSA_PATHWAY_INDICATIONS = [
  'suspected-osa', 'snoring', 'daytime-sleepiness',
  'copd-overlap', 'pre-bariatric', 'driver-assessment'
];

function clampScore(n) {
  return Math.max(1, Math.min(9, n));
}

/**
 * Score appropriateness (1-9) for an indication x studyType pairing, adjusted
 * by Epworth / STOP-BANG, and return the fired rules. Defaults to a neutral
 * may-be-appropriate when the indication or study type has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRules:object[] }}
 */
function scoreAppropriateness(indication, studyType, epworth, stopBang) {
  const firedRules = [];

  if (!indication || !studyType) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRules: [{
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or study type not yet specified — provisional appropriateness.'
      }]
    };
  }

  const map = INDICATION_STUDY_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');
  let score;
  let band;

  if (map.ideal.includes(studyType)) {
    score = 8;
    firedRules.push({
      ruleId: `R-APPROP-${indicationKey}-IDEAL`,
      axis: 'appropriateness',
      category: indication,
      description: `Requested ${studyType} study is the recommended investigation for "${indication}".`
    });
  } else if (map.plausible.includes(studyType)) {
    score = 5;
    firedRules.push({
      ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
      axis: 'appropriateness',
      category: indication,
      description: `Requested ${studyType} study may be appropriate for "${indication}" but is not the first-line investigation.`
    });
  } else if (indication === 'other') {
    score = 5;
    firedRules.push({
      ruleId: 'R-APPROP-OTHER',
      axis: 'appropriateness',
      category: 'other',
      description: 'Indication recorded as "other"; appropriateness requires clinician vetting.'
    });
  } else {
    score = 2;
    firedRules.push({
      ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
      axis: 'appropriateness',
      category: indication,
      description: `Requested ${studyType} study is not usually appropriate for "${indication}"; query the referrer.`
    });
  }

  // Epworth / STOP-BANG adjustment on the OSA pathway.
  if (OSA_PATHWAY_INDICATIONS.includes(indication)) {
    const hasEpworth = epworth !== null && epworth !== undefined && epworth !== '';
    const hasStopBang = stopBang !== null && stopBang !== undefined && stopBang !== '';
    if ((hasEpworth && Number(epworth) >= EPWORTH_ABNORMAL) ||
        (hasStopBang && Number(stopBang) >= STOP_BANG_HIGH_RISK)) {
      score = clampScore(score + 1);
      firedRules.push({
        ruleId: 'R-APPROP-OSA-EVIDENCE',
        axis: 'appropriateness',
        category: indication,
        description: 'High Epworth and/or STOP-BANG supports the OSA-pathway request.'
      });
    } else if (!hasEpworth && !hasStopBang) {
      score = clampScore(score - 1);
      firedRules.push({
        ruleId: 'R-APPROP-OSA-NO-EVIDENCE',
        axis: 'appropriateness',
        category: indication,
        description: 'No Epworth or STOP-BANG recorded to support the OSA-pathway request.'
      });
    }
  }

  band = appropriatenessBand(score);
  return { score, band, firedRules };
}

/** Map a 1-9 appropriateness score to its band. */
function appropriatenessBand(score) {
  if (score >= 7) return 'usually-appropriate';
  if (score >= 4) return 'may-be-appropriate';
  return 'usually-not-appropriate';
}

// ----------------------------------------------------------------------
// Axis B — Clinical priority (low / moderate / high)
// ----------------------------------------------------------------------
//
// Clinical priority reflects how clinically pressing the study is, driven by
// occupational driving with sleepiness, severe daytime sleepiness, and
// cardiovascular comorbidity. The most-severe band wins.

const PRIORITY_ORDER = ['low', 'moderate', 'high'];

/** Return whichever of two priority bands is more severe. */
function maxPriority(a, b) {
  const ia = PRIORITY_ORDER.indexOf(a);
  const ib = PRIORITY_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

const PRIORITY_RULES = [
  {
    ruleId: 'R-PRIORITY-DRIVER-SLEEPINESS',
    band: 'high',
    fires: (d) => d.symptoms.occupationalDriver === true &&
      epworthAtLeast(d, EPWORTH_ABNORMAL),
    description: 'Occupational driver with excessive daytime sleepiness — high priority (DVLA).'
  },
  {
    ruleId: 'R-PRIORITY-SEVERE-SLEEPINESS',
    band: 'high',
    fires: (d) => epworthAtLeast(d, EPWORTH_SEVERE),
    description: 'Severe excessive daytime sleepiness (Epworth ≥ 16) — high priority.'
  },
  {
    ruleId: 'R-PRIORITY-MODERATE-SLEEPINESS',
    band: 'moderate',
    fires: (d) => epworthAtLeast(d, EPWORTH_ABNORMAL),
    description: 'Abnormal daytime sleepiness (Epworth ≥ 11) — moderate priority.'
  },
  {
    ruleId: 'R-PRIORITY-OCCUPATIONAL-DRIVER',
    band: 'moderate',
    fires: (d) => d.symptoms.occupationalDriver === true,
    description: 'Occupational / vocational driver — moderate priority (DVLA relevance).'
  },
  {
    ruleId: 'R-PRIORITY-CARDIOVASCULAR',
    band: 'moderate',
    fires: (d) => d.symptoms.cardiovascularDisease === true,
    description: 'Established cardiovascular disease raises priority.'
  },
  {
    ruleId: 'R-PRIORITY-HIGH-OSA-RISK',
    band: 'moderate',
    fires: (d) => stopBangAtLeast(d, STOP_BANG_HIGH_RISK),
    description: 'High STOP-BANG (≥ 5) indicates high OSA risk — moderate priority.'
  }
];

function epworthAtLeast(d, threshold) {
  const v = d.scores.epworthScore;
  return v !== null && v !== undefined && v !== '' && Number(v) >= threshold;
}

function stopBangAtLeast(d, threshold) {
  const v = d.scores.stopBangScore;
  return v !== null && v !== undefined && v !== '' && Number(v) >= threshold;
}

/**
 * Compute the clinical priority band and fired priority rules.
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
      category: 'clinical-priority',
      description: 'No priority drivers present; baseline low priority.'
    });
  }

  return { band, firedRules };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------
//
// Each tracked field carries a weight. Indication, clinical question, and
// Epworth are weighted highest because they drive every other axis.
// Completeness is the percentage of weighted points present.

const COMPLETENESS_FIELDS = [
  { weight: 3, present: (d) => !!d.request.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
  { weight: 3, present: (d) => !!d.request.clinicalQuestion && d.request.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
  { weight: 3, present: (d) => epworthPresent(d), ruleId: 'R-COMPLETE-EPWORTH', label: 'Epworth score' },
  { weight: 2, present: (d) => !!d.request.studyType, ruleId: 'R-COMPLETE-STUDY-TYPE', label: 'requested study type' },
  { weight: 1, present: (d) => stopBangPresent(d), ruleId: 'R-COMPLETE-STOP-BANG', label: 'STOP-BANG score' },
  { weight: 1, present: (d) => d.patient.bodyMassIndex !== null && d.patient.bodyMassIndex !== undefined && d.patient.bodyMassIndex !== '', ruleId: 'R-COMPLETE-BMI', label: 'body mass index' },
  { weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
  { weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
  { weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
  { weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
  { weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
  { weight: 1, present: (d) => !!d.triage.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

function epworthPresent(d) {
  return (
    d.scores.epworthScore !== null &&
    d.scores.epworthScore !== undefined &&
    d.scores.epworthScore !== ''
  );
}

function stopBangPresent(d) {
  return (
    d.scores.stopBangScore !== null &&
    d.scores.stopBangScore !== undefined &&
    d.scores.stopBangScore !== ''
  );
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
// Axis D — Triage priority (routine / urgent, DVLA escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then DVLA-style
// escalation rules auto-escalate it. The most-severe escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 6-12 weeks',
  'urgent': 'Within 1-2 weeks'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a, b) {
  const ia = TRIAGE_ORDER.indexOf(a);
  const ib = TRIAGE_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

const TRIAGE_RULES = [
  {
    ruleId: 'R-TRIAGE-DRIVER-SLEEPINESS',
    tier: 'urgent',
    fires: (d) => d.symptoms.occupationalDriver === true &&
      epworthAtLeast(d, EPWORTH_ABNORMAL),
    description: 'Vocational driver with excessive sleepiness — fast-track urgent (DVLA).'
  },
  {
    ruleId: 'R-TRIAGE-SEVERE-SLEEPINESS',
    tier: 'urgent',
    fires: (d) => epworthAtLeast(d, EPWORTH_SEVERE),
    description: 'Severe excessive daytime sleepiness (Epworth ≥ 16) — urgent assessment.'
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
      description: `No escalation triggers; triage follows the requested urgency (${tier}).`
    });
  }

  return {
    tier,
    targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
    firedRules
  };
}

export { scoreAppropriateness, appropriatenessBand, scorePriority, scoreCompleteness, scoreTriage, maxTier, maxPriority, TRIAGE_ORDER, PRIORITY_ORDER, TARGET_TIMEFRAMES, INDICATION_STUDY_MAP, EPWORTH_ABNORMAL, EPWORTH_SEVERE, STOP_BANG_HIGH_RISK, STOP_BANG_INTERMEDIATE };
