// Four-axis rule catalogue for the PET Scan Test Request engine.
//
// Derived from index.md and sql-migrations/05-07: (A) appropriateness 1-9 +
// band by indication x scan type (ACR / RCR iRefer); (B) preparation safety
// band (ok / caution / contraindicated) + radiation-dose band (low / moderate
// / high), driven by glucose control, pregnancy, and breastfeeding;
// (C) request completeness over mandatory fields; (D) triage tier with
// acuity escalation. Rule IDs are stable and identical across every
// front-end and the back-end (R-APPROP-*, R-SAFETY-*, R-COMPLETE-*,
// R-TRIAGE-*). Pure data + helpers; the grader composes them.
//
// Wrapped in an IIFE; published via `window.PetScanTestRequest`.

(function () {
'use strict';
window.PetScanTestRequest = window.PetScanTestRequest || {};
const NS = window.PetScanTestRequest;
const { isFdgStudy } = NS;

// Glucose threshold (mmol/L) above which FDG uptake is degraded and a study
// should be rechecked / rescheduled (SNMMI ~11; EANM prefers below ~7).
const GLUCOSE_RESCHEDULE_THRESHOLD = 11;
const GLUCOSE_CAUTION_THRESHOLD = 7;

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACR Appropriateness Criteria 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal scan type (or set of types). When the
// requested scan type matches the indication well, the request scores high
// (7-9, usually-appropriate). Plausible-but-suboptimal pairings score in the
// 4-6 may-be-appropriate band; clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[scanType], plausible:[scanType] }.
const INDICATION_SCAN_MAP = {
  'cancer-staging':             { ideal: ['fdg-pet-ct', 'psma-pet', 'dotatate-pet'], plausible: [] },
  'cancer-restaging':           { ideal: ['fdg-pet-ct', 'psma-pet', 'dotatate-pet'], plausible: [] },
  'treatment-response':         { ideal: ['fdg-pet-ct'], plausible: ['psma-pet', 'dotatate-pet'] },
  'suspected-recurrence':       { ideal: ['fdg-pet-ct', 'psma-pet'], plausible: ['dotatate-pet'] },
  'solitary-pulmonary-nodule':  { ideal: ['fdg-pet-ct'], plausible: [] },
  'lymphoma':                   { ideal: ['fdg-pet-ct'], plausible: [] },
  'cardiac-viability':          { ideal: ['cardiac-pet'], plausible: ['fdg-pet-ct'] },
  'infection-inflammation':     { ideal: ['fdg-pet-ct'], plausible: [] },
  'neurology-dementia':         { ideal: ['amyloid-pet'], plausible: ['fdg-pet-ct'] },
  'other':                      { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x scanType pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or scan type has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, scanType) {
  if (!indication || !scanType) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or scan type not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_SCAN_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  if (map.ideal.includes(scanType)) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${scanType} study is the recommended examination for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(scanType)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${scanType} study may be appropriate for "${indication}" but is not the first-line examination.`
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
      description: `Requested ${scanType} study is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Preparation safety & radiation dose (EANM / SNMMI + IR(ME)R)
// ----------------------------------------------------------------------
//
// prepSafetyBand: ok / caution / contraindicated. Driven by glucose control
// (FDG studies), pregnancy status, and breastfeeding. Pregnancy forces the
// contraindicated band; uncontrolled glucose (>11 mmol/L for an FDG study)
// forces caution; breastfeeding or borderline glucose raises caution.
//
// radiationDoseBand: low / moderate / high. PET-CT is a moderate-to-high
// dose modality; higher when pregnancy is present (fetal-dose concern).

const PREP_ORDER = ['ok', 'caution', 'contraindicated'];

/** Return whichever of two prep-safety bands is more severe. */
function maxPrepBand(a, b) {
  return PREP_ORDER.indexOf(a) >= PREP_ORDER.indexOf(b) ? a : b;
}

/**
 * Evaluate preparation safety and radiation dose for the request.
 *
 * @returns {{ prepSafetyBand:string, radiationDoseBand:string, firedRules:object[] }}
 */
function scoreSafety(data) {
  const firedRules = [];
  let prepBand = 'ok';
  let doseBand = 'moderate'; // PET-CT baseline

  const fdg = isFdgStudy(data.request.scanType);
  const glucose = data.prep.bloodGlucoseMmolL;
  const pregnancy = data.prep.pregnancyStatus;

  // Pregnancy — contraindicated band, high dose concern.
  if (pregnancy === 'pregnant') {
    prepBand = maxPrepBand(prepBand, 'contraindicated');
    doseBand = 'high';
    firedRules.push({
      ruleId: 'R-SAFETY-PREGNANT',
      axis: 'safety',
      category: 'pregnancy',
      description: 'Patient is pregnant — PET-CT radiation exposure is contraindicated unless overriding justification.'
    });
  } else if (pregnancy === 'possible' || pregnancy === 'unknown') {
    prepBand = maxPrepBand(prepBand, 'caution');
    firedRules.push({
      ruleId: 'R-SAFETY-PREGNANCY-UNCONFIRMED',
      axis: 'safety',
      category: 'pregnancy',
      description: 'Pregnancy is possible or not confirmed — confirm status before exposure.'
    });
  }

  // Glucose control for FDG studies.
  if (fdg) {
    if (glucose === null || glucose === undefined || glucose === '') {
      prepBand = maxPrepBand(prepBand, 'caution');
      firedRules.push({
        ruleId: 'R-SAFETY-GLUCOSE-MISSING',
        axis: 'safety',
        category: 'glucose',
        description: 'No blood glucose recorded for an FDG study — measure and document before tracer.'
      });
    } else if (Number(glucose) > GLUCOSE_RESCHEDULE_THRESHOLD) {
      prepBand = maxPrepBand(prepBand, 'caution');
      firedRules.push({
        ruleId: 'R-SAFETY-GLUCOSE-HIGH',
        axis: 'safety',
        category: 'glucose',
        description: `Blood glucose ${Number(glucose)} mmol/L exceeds ~11 mmol/L — recheck and reschedule; FDG uptake is degraded.`
      });
    } else if (Number(glucose) > GLUCOSE_CAUTION_THRESHOLD) {
      firedRules.push({
        ruleId: 'R-SAFETY-GLUCOSE-BORDERLINE',
        axis: 'safety',
        category: 'glucose',
        description: `Blood glucose ${Number(glucose)} mmol/L is in the 7-11 mmol/L range — acceptable but optimise control where possible.`
      });
    }
  }

  // Breastfeeding precaution.
  if (data.prep.breastfeeding === true) {
    prepBand = maxPrepBand(prepBand, 'caution');
    firedRules.push({
      ruleId: 'R-SAFETY-BREASTFEEDING',
      axis: 'safety',
      category: 'breastfeeding',
      description: 'Patient is breastfeeding — advise interruption of breastfeeding and close contact per local radiopharmaceutical guidance.'
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-SAFETY-OK',
      axis: 'safety',
      category: 'preparation',
      description: 'No preparation or safety concerns identified.'
    });
  }

  return { prepSafetyBand: prepBand, radiationDoseBand: doseBand, firedRules };
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
  { weight: 2, present: (d) => !!d.request.scanType, ruleId: 'R-COMPLETE-SCAN-TYPE', label: 'requested scan type' },
  { weight: 2, present: (d) => !!d.justification.irMeRJustification && d.justification.irMeRJustification.trim() !== '', ruleId: 'R-COMPLETE-JUSTIFICATION', label: 'IR(ME)R justification' },
  { weight: 1, present: (d) => glucosePresentIfNeeded(d), ruleId: 'R-COMPLETE-GLUCOSE', label: 'blood glucose (FDG study)' },
  { weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
  { weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
  { weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
  { weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
  { weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
  { weight: 1, present: (d) => !!d.justification.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

function glucosePresentIfNeeded(d) {
  if (!isFdgStudy(d.request.scanType)) return true;
  const g = d.prep.bloodGlucoseMmolL;
  return g !== null && g !== undefined && g !== '';
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
// Axis D — Triage priority (acuity escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then acuity
// rules can escalate it. The most-severe escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent', 'emergency'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 2-4 weeks',
  'urgent': 'Within 1 week',
  'emergency': 'Within 24-48 hours'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a, b) {
  const ia = TRIAGE_ORDER.indexOf(a);
  const ib = TRIAGE_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Acuity escalation rules, each forcing at least the given tier.
const TRIAGE_RULES = [
  {
    ruleId: 'R-TRIAGE-EMERGENCY-SETTING',
    tier: 'emergency',
    fires: (d) => d.patient.setting === 'emergency',
    description: 'Request originates from the emergency setting — emergency triage.'
  },
  {
    ruleId: 'R-TRIAGE-SUSPECTED-RECURRENCE',
    tier: 'urgent',
    fires: (d) => d.request.primaryIndication === 'suspected-recurrence',
    description: 'Suspected recurrence — expedited assessment.'
  },
  {
    ruleId: 'R-TRIAGE-INPATIENT',
    tier: 'urgent',
    fires: (d) => d.patient.setting === 'inpatient',
    description: 'Inpatient request — expedited assessment to support discharge.'
  }
];

/**
 * Compute the triage tier, target timeframe, and fired triage rules.
 *
 * @returns {{ tier:string, targetTimeframe:string, firedRules:object[] }}
 */
function scoreTriage(data) {
  const requested = data.justification.urgency || 'routine';
  let tier = TRIAGE_ORDER.includes(requested) ? requested : 'routine';
  const firedRules = [];

  for (const rule of TRIAGE_RULES) {
    if (rule.fires(data)) {
      tier = maxTier(tier, rule.tier);
      firedRules.push({
        ruleId: rule.ruleId,
        axis: 'triage',
        category: 'acuity',
        description: rule.description
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-TRIAGE-REQUESTED',
      axis: 'triage',
      category: 'requested',
      description: `No escalating factors; triage follows the requested urgency (${tier}).`
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
  maxPrepBand,
  TRIAGE_ORDER,
  TARGET_TIMEFRAMES,
  PREP_ORDER,
  INDICATION_SCAN_MAP,
  GLUCOSE_RESCHEDULE_THRESHOLD,
  GLUCOSE_CAUTION_THRESHOLD
});
})();
