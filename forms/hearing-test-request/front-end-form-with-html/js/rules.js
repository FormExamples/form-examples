// Four-axis rule catalogue for the Hearing Test Request engine.
//
// Derived from index.md and the SQL grade tables: (A) appropriateness 1-9 +
// band by indication x test type, anchored on British Society of Audiology /
// NICE NG98 indication appropriateness; (B) urgency triage tier
// routine / urgent / emergency with red-flag auto-escalation (sudden
// sensorineural hearing loss -> urgent, within days); (C) request completeness
// over mandatory fields; (D) clinical priority low / moderate / high composite
// of acuity and appropriateness. Rule IDs are stable and identical across every
// front-end and the back-end (R-APPROP-*, R-URGENCY-*, R-COMPLETE-*,
// R-PRIORITY-*). Pure data + helpers; the grader composes them.
//
// Wrapped in an IIFE; published via `window.HearingTestRequest`.

(function () {
'use strict';
window.HearingTestRequest = window.HearingTestRequest || {};
const NS = window.HearingTestRequest;

// ----------------------------------------------------------------------
// Axis A — Appropriateness (1-9 ordinal; BSA recommended procedures / NICE
// NG98 indication match). There is no single published 1-9 audiology score;
// this axis adapts the ordinal-rating convention to indication match.
// ----------------------------------------------------------------------
//
// Each indication has an ideal test type (or set of types). When the requested
// test type matches the indication well, the request scores high (7-9,
// usually-appropriate). Plausible-but-suboptimal pairings score in the 4-6
// may-be-appropriate band; clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[testType], plausible:[testType] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_TEST_MAP = {
  'hearing-loss':            { ideal: ['pure-tone-audiometry'], plausible: ['speech-audiometry', 'tympanometry', 'otoacoustic-emissions'] },
  'tinnitus':                { ideal: ['pure-tone-audiometry'], plausible: ['tympanometry', 'speech-audiometry'] },
  'vertigo':                 { ideal: ['pure-tone-audiometry', 'auditory-brainstem-response'], plausible: ['tympanometry'] },
  'ear-discharge':           { ideal: ['tympanometry'], plausible: ['pure-tone-audiometry'] },
  'suspected-otosclerosis':  { ideal: ['tympanometry', 'pure-tone-audiometry'], plausible: ['speech-audiometry'] },
  'occupational-noise':      { ideal: ['pure-tone-audiometry'], plausible: ['otoacoustic-emissions'] },
  'ototoxic-monitoring':     { ideal: ['otoacoustic-emissions', 'pure-tone-audiometry'], plausible: ['auditory-brainstem-response'] },
  'developmental-delay-child': { ideal: ['auditory-brainstem-response', 'otoacoustic-emissions'], plausible: ['newborn-hearing-screen', 'tympanometry'] },
  'hearing-aid-review':      { ideal: ['hearing-aid-assessment'], plausible: ['pure-tone-audiometry', 'speech-audiometry'] },
  'sudden-hearing-loss':     { ideal: ['pure-tone-audiometry'], plausible: ['auditory-brainstem-response', 'otoacoustic-emissions'] },
  'other':                   { ideal: [], plausible: [] }
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
        description: `Requested ${testType} test is the recommended examination for "${indication}".`
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
        description: `Requested ${testType} test may be appropriate for "${indication}" but is not the first-line examination.`
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
// Axis B — Urgency triage tier (ENT-UK / BAO-HNS + NICE QS185)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then red flags
// auto-escalate it. The most-severe escalation wins. Per NICE QS185 / ENT-UK,
// sudden sensorineural hearing loss developing over <= 3 days within the past
// 30 days is an otological emergency (be seen within 24 hours); if more than
// 30 days ago, refer urgently (be seen within 2 weeks).

const TRIAGE_ORDER = ['routine', 'urgent', 'emergency'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 6 weeks (routine audiology booking)',
  'urgent': 'Within 2 weeks (urgent ENT / audiovestibular referral)',
  'emergency': 'Within 24 hours (otological emergency)'
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
    ruleId: 'R-URGENCY-SUDDEN-SNHL-EMERGENCY',
    tier: 'emergency',
    fires: (d) => d.symptoms.suddenOnset === true && d.symptoms.onsetWithinDays === 'within-30-days',
    description: 'Sudden sensorineural hearing loss within the past 30 days — otological emergency; be seen within 24 hours.'
  },
  {
    ruleId: 'R-URGENCY-SUDDEN-SNHL-URGENT',
    tier: 'urgent',
    fires: (d) => d.symptoms.suddenOnset === true && d.symptoms.onsetWithinDays !== 'within-30-days',
    description: 'Sudden onset of hearing loss — refer urgently (within days / 2 weeks) per NICE QS185.'
  },
  {
    ruleId: 'R-URGENCY-EAR-DISCHARGE',
    tier: 'urgent',
    fires: (d) => d.symptoms.earDischarge === true,
    description: 'Ear discharge (otorrhoea) — expedite ENT review.'
  },
  {
    ruleId: 'R-URGENCY-UNILATERAL',
    tier: 'urgent',
    fires: (d) => isUnilateral(d) && (d.symptoms.hearingLoss === true || d.symptoms.tinnitus === true || d.symptoms.vertigo === true),
    description: 'Unilateral / asymmetric audiovestibular symptoms — urgent diagnostic referral.'
  }
];

/** True when the request describes a one-sided (left/right) examination. */
function isUnilateral(d) {
  return d.request.laterality === 'left' || d.request.laterality === 'right';
}

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
  { weight: 2, present: (d) => !!d.request.testType, ruleId: 'R-COMPLETE-TEST-TYPE', label: 'requested test type' },
  { weight: 1, present: (d) => !!d.request.laterality, ruleId: 'R-COMPLETE-LATERALITY', label: 'laterality' },
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
// Axis D — Clinical priority (composite of acuity and appropriateness)
// ----------------------------------------------------------------------
//
// Priority is a composite band: emergency/urgent acuity or an inappropriate
// request that needs human review raises priority. Low only when nothing
// escalates.

/**
 * Compute the clinical priority band and the fired priority rule.
 *
 * @param {string} triageTier - axis B triage tier
 * @param {string} apprBand - axis A appropriateness band
 * @returns {{ band:string, firedRule:object }}
 */
function scorePriority(triageTier, apprBand) {
  if (triageTier === 'emergency') {
    return {
      band: 'high',
      firedRule: {
        ruleId: 'R-PRIORITY-EMERGENCY',
        axis: 'priority',
        category: 'acuity',
        description: 'Emergency triage tier sets clinical priority high.'
      }
    };
  }
  if (triageTier === 'urgent' || apprBand === 'usually-not-appropriate') {
    return {
      band: 'moderate',
      firedRule: {
        ruleId: 'R-PRIORITY-URGENT-OR-INAPPROPRIATE',
        axis: 'priority',
        category: 'composite',
        description: triageTier === 'urgent'
          ? 'Urgent triage tier sets clinical priority moderate.'
          : 'Inappropriate request needs human review — clinical priority moderate.'
      }
    };
  }
  return {
    band: 'low',
    firedRule: {
      ruleId: 'R-PRIORITY-ROUTINE',
      axis: 'priority',
      category: 'composite',
      description: 'Routine acuity and an acceptable indication — clinical priority low.'
    }
  };
}

Object.assign(NS, {
  scoreAppropriateness,
  appropriatenessBand,
  scoreTriage,
  scoreCompleteness,
  scorePriority,
  maxTier,
  isUnilateral,
  TRIAGE_ORDER,
  TARGET_TIMEFRAMES,
  INDICATION_TEST_MAP
});
})();
