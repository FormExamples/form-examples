// Four-axis rule catalogue for the Cardiac Stress Test Request engine.
//
// Derived from index.md and the SQL grade tables: (A) appropriateness 1-9 +
// band by indication x test type (ACC/AHA AUC); (B) safety / contraindication
// band ok / caution / contraindicated from recent ACS, severe symptomatic
// aortic stenosis, uncontrolled hypertension, and inability to exercise for an
// exercise test; (C) request completeness over mandatory fields; (D) triage
// tier with red-flag auto-escalation. Rule IDs are stable and identical across
// every front-end and the back-end (R-APPROP-*, R-SAFETY-*, R-COMPLETE-*,
// R-TRIAGE-*). Pure data + helpers; the grader composes them.
//
// Wrapped in an IIFE; published via `window.CardiacStressTestRequest`.

(function () {
'use strict';
window.CardiacStressTestRequest =
  window.CardiacStressTestRequest || {};
const NS = window.CardiacStressTestRequest;
const { isExerciseTest } = NS;

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACC/AHA Appropriate Use Criteria 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal test type (or set of types). When the requested
// test type matches the indication well, the request scores high (7-9,
// usually-appropriate). Plausible-but-suboptimal pairings score in the 4-6
// may-be-appropriate band; clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[testType], plausible:[testType] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_TEST_MAP = {
  'suspected-angina':            { ideal: ['exercise-treadmill-ecg', 'stress-echo'], plausible: ['myocardial-perfusion-spect', 'stress-cardiac-mri', 'dobutamine-stress-echo'] },
  'known-cad-assessment':        { ideal: ['stress-echo', 'myocardial-perfusion-spect', 'stress-cardiac-mri'], plausible: ['dobutamine-stress-echo', 'exercise-treadmill-ecg'] },
  'risk-stratification-post-mi': { ideal: ['myocardial-perfusion-spect', 'stress-echo'], plausible: ['stress-cardiac-mri', 'exercise-treadmill-ecg'] },
  'pre-operative-cardiac':       { ideal: ['stress-echo', 'myocardial-perfusion-spect'], plausible: ['dobutamine-stress-echo', 'exercise-treadmill-ecg', 'stress-cardiac-mri'] },
  'exercise-tolerance':          { ideal: ['exercise-treadmill-ecg'], plausible: ['stress-echo'] },
  'arrhythmia-evaluation':       { ideal: ['exercise-treadmill-ecg'], plausible: ['stress-echo'] },
  'valve-disease':               { ideal: ['stress-echo'], plausible: ['dobutamine-stress-echo', 'exercise-treadmill-ecg'] },
  'other':                       { ideal: [], plausible: [] }
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
        description: `Requested ${testType} is a recommended test for "${indication}".`
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
        description: `Requested ${testType} may be appropriate for "${indication}" but is not the first-line test.`
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
      description: `Requested ${testType} is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Safety / contraindication (ACC/AHA + ESC valve guidance)
// ----------------------------------------------------------------------
//
// Returns a band of ok / caution / contraindicated. Absolute contraindications
// (recent acute coronary syndrome; severe symptomatic aortic stenosis) force
// `contraindicated`. Relative contraindications (uncontrolled hypertension;
// inability to exercise for an exercise test; moderate aortic stenosis) force
// at least `caution`.

const CONTRAINDICATION_ORDER = ['ok', 'caution', 'contraindicated'];

/** Return whichever of two safety bands is more severe. */
function maxBand(a, b) {
  const ia = CONTRAINDICATION_ORDER.indexOf(a);
  const ib = CONTRAINDICATION_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Each rule forces at least the given band when it fires.
const SAFETY_RULES = [
  {
    ruleId: 'R-SAFETY-RECENT-ACS',
    band: 'contraindicated',
    fires: (d) => d.safety.recentAcuteCoronarySyndrome === true,
    description: 'Recent acute coronary syndrome — exercise / stress testing contraindicated until stabilised.'
  },
  {
    ruleId: 'R-SAFETY-SEVERE-AORTIC-STENOSIS',
    band: 'contraindicated',
    fires: (d) => d.safety.aorticStenosis === 'severe',
    description: 'Severe (symptomatic) aortic stenosis — exercise testing contraindicated; prefer coronary angiography.'
  },
  {
    ruleId: 'R-SAFETY-UNABLE-TO-EXERCISE',
    band: 'caution',
    fires: (d) => isExerciseTest(d.request.testType) && d.symptoms.ableToExercise !== true,
    description: 'Exercise test requested but patient cannot exercise — redirect to a pharmacological / imaging modality.'
  },
  {
    ruleId: 'R-SAFETY-UNCONTROLLED-HYPERTENSION',
    band: 'caution',
    fires: (d) => d.safety.uncontrolledHypertension === true,
    description: 'Uncontrolled hypertension — relative contraindication; control blood pressure first.'
  },
  {
    ruleId: 'R-SAFETY-MODERATE-AORTIC-STENOSIS',
    band: 'caution',
    fires: (d) => d.safety.aorticStenosis === 'moderate',
    description: 'Moderate aortic stenosis — proceed with caution under specialist supervision.'
  }
];

/**
 * Evaluate the safety / contraindication band.
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
      ruleId: 'R-SAFETY-OK',
      axis: 'safety',
      category: 'contraindication',
      description: 'No absolute or relative contraindication detected from the safety screen.'
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
// Axis D — Triage priority (red-flag escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then red flags
// auto-escalate it. The most-severe escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent', 'emergency'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 4-6 weeks',
  'urgent': 'Within 1-2 weeks',
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
    ruleId: 'R-TRIAGE-RECENT-ACS',
    tier: 'emergency',
    fires: (d) => d.safety.recentAcuteCoronarySyndrome === true,
    description: 'Recent acute coronary syndrome — emergency cardiology review before any stress test.'
  },
  {
    ruleId: 'R-TRIAGE-SEVERE-AORTIC-STENOSIS',
    tier: 'urgent',
    fires: (d) => d.safety.aorticStenosis === 'severe',
    description: 'Severe aortic stenosis — urgent specialist cardiology review.'
  },
  {
    ruleId: 'R-TRIAGE-CHEST-PAIN',
    tier: 'urgent',
    fires: (d) => d.symptoms.symptomChestPain === true && d.request.primaryIndication === 'suspected-angina',
    description: 'Chest pain with suspected angina — expedited rapid-access chest-pain assessment.'
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
  appropriatenessBand,
  scoreSafety,
  scoreCompleteness,
  scoreTriage,
  maxTier,
  maxBand,
  TRIAGE_ORDER,
  CONTRAINDICATION_ORDER,
  TARGET_TIMEFRAMES,
  INDICATION_TEST_MAP
});
})();
