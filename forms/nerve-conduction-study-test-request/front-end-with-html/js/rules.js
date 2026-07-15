import { involvesNeedleEmg } from './types.js';

// Four-axis rule catalogue for the Nerve Conduction Study Test Request engine.
//
// Derived from index.md and SQL migration 05/06: (A) appropriateness 1-9 + band
// by indication x study type (AANEM / AAN practice parameters); (B) procedural
// risk band low/moderate/high from needle EMG against anticoagulation /
// cardiac device; (C) request completeness over mandatory fields; (D) triage
// tier routine/urgent with suspected motor neurone disease auto-escalating to
// urgent. Rule IDs are stable and identical across every front-end and the
// back-end (R-APPROP-*, R-RISK-*, R-COMPLETE-*, R-TRIAGE-*). Pure data +
// helpers; the grader composes them.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (AANEM / AAN electrodiagnostic, 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal study type (or set of types). When the
// requested study type matches the indication well, the request scores high
// (7-9, usually-appropriate). Plausible-but-suboptimal pairings score in the
// 4-6 may-be-appropriate band; clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[studyType], plausible:[studyType] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_STUDY_MAP = {
  'carpal-tunnel':                   { ideal: ['nerve-conduction', 'nerve-conduction-and-emg'], plausible: ['emg'] },
  'peripheral-neuropathy':           { ideal: ['nerve-conduction-and-emg', 'nerve-conduction'], plausible: ['emg'] },
  'radiculopathy':                   { ideal: ['emg', 'nerve-conduction-and-emg'], plausible: ['nerve-conduction'] },
  'suspected-motor-neurone-disease': { ideal: ['nerve-conduction-and-emg', 'emg'], plausible: ['nerve-conduction'] },
  'myopathy':                        { ideal: ['emg'], plausible: ['nerve-conduction-and-emg'] },
  'plexopathy':                      { ideal: ['nerve-conduction-and-emg', 'emg'], plausible: ['nerve-conduction'] },
  'suspected-myasthenia':            { ideal: ['repetitive-stimulation'], plausible: ['nerve-conduction', 'nerve-conduction-and-emg'] },
  'nerve-injury':                    { ideal: ['nerve-conduction-and-emg', 'nerve-conduction'], plausible: ['emg'] },
  'other':                           { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x studyType pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or study type has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, studyType) {
  if (!indication || !studyType) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or study type not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_STUDY_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  if (map.ideal.includes(studyType)) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${studyType} study is the recommended examination for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(studyType)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${studyType} study may be appropriate for "${indication}" but is not the first-line examination.`
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
      description: `Requested ${studyType} study is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Procedural risk (needle EMG vs anticoagulation / cardiac device)
// ----------------------------------------------------------------------
//
// Needle EMG carries a bleeding risk in anticoagulated patients; electrical
// stimulation warrants caution near a pacemaker / ICD. The band is the most
// severe of the contributing factors. When no needle-EMG component is
// requested and no device is present, the band is low.

const RISK_ORDER = ['low', 'moderate', 'high'];

/** Return whichever of two risk bands is more severe. */
function maxRisk(a, b) {
  const ia = RISK_ORDER.indexOf(a);
  const ib = RISK_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

/**
 * Compute the procedural-risk band and the fired risk rules.
 *
 * @returns {{ band:string, firedRules:object[] }}
 */
function scoreProceduralRisk(data) {
  const studyType = data.study.studyType;
  const needleEmg = involvesNeedleEmg(studyType);
  const anticoagulated = data.safety.takingAnticoagulant === true;
  const device = data.safety.pacemakerOrIcd === true;

  let band = 'low';
  const firedRules = [];

  if (needleEmg && anticoagulated) {
    band = maxRisk(band, 'high');
    firedRules.push({
      ruleId: 'R-RISK-NEEDLE-ANTICOAG',
      axis: 'risk',
      category: 'anticoagulation',
      description: 'Needle EMG requested in an anticoagulated patient — high bleeding risk.'
    });
  } else if (anticoagulated) {
    band = maxRisk(band, 'moderate');
    firedRules.push({
      ruleId: 'R-RISK-ANTICOAG',
      axis: 'risk',
      category: 'anticoagulation',
      description: 'Patient is anticoagulated; confirm whether a needle-EMG component is required.'
    });
  } else if (needleEmg) {
    band = maxRisk(band, 'moderate');
    firedRules.push({
      ruleId: 'R-RISK-NEEDLE-EMG',
      axis: 'risk',
      category: 'needle-emg',
      description: 'Needle EMG requested — standard sterile-needle precautions apply.'
    });
  }

  if (device) {
    band = maxRisk(band, 'moderate');
    firedRules.push({
      ruleId: 'R-RISK-CARDIAC-DEVICE',
      axis: 'risk',
      category: 'cardiac-device',
      description: 'Pacemaker / ICD present — apply stimulation-technique caution.'
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-RISK-LOW',
      axis: 'risk',
      category: 'baseline',
      description: 'No needle-EMG bleeding risk or cardiac-device caution identified.'
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
  { weight: 2, present: (d) => !!d.study.studyType, ruleId: 'R-COMPLETE-STUDY-TYPE', label: 'requested study type' },
  { weight: 2, present: (d) => !!d.study.region, ruleId: 'R-COMPLETE-REGION', label: 'anatomical region' },
  { weight: 1, present: (d) => !!d.study.laterality, ruleId: 'R-COMPLETE-LATERALITY', label: 'laterality' },
  { weight: 1, present: (d) => !!d.symptoms.symptomDuration, ruleId: 'R-COMPLETE-SYMPTOM-DURATION', label: 'symptom duration' },
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
// auto-escalate it. Suspected motor neurone disease forces urgent because
// early electrodiagnostic confirmation changes management. The most-severe
// escalation wins.

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

// Red-flag escalation rules, each forcing at least the given tier.
const TRIAGE_RULES = [
  {
    ruleId: 'R-TRIAGE-SUSPECTED-MND',
    tier: 'urgent',
    fires: (d) => d.request.primaryIndication === 'suspected-motor-neurone-disease',
    description: 'Suspected motor neurone disease — expedite for early electrodiagnostic confirmation.'
  },
  {
    ruleId: 'R-TRIAGE-RAPID-WEAKNESS',
    tier: 'urgent',
    fires: (d) =>
      d.symptoms.symptomWeakness === true &&
      d.symptoms.symptomDuration === 'less-than-6-weeks',
    description: 'Rapidly progressive weakness (under 6 weeks) — expedite assessment.'
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

export { scoreAppropriateness, appropriatenessBand, scoreProceduralRisk, scoreCompleteness, scoreTriage, maxTier, maxRisk, TRIAGE_ORDER, TARGET_TIMEFRAMES, RISK_ORDER, INDICATION_STUDY_MAP };
