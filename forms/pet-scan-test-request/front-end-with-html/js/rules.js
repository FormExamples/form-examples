import { isFdgStudy } from './types.js';

// Four-axis rule catalogue for the PET Scan Test Request engine.
//
// Derived from index.md and the SQL migrations: (A) appropriateness 1-9 + band
// by indication x scan type; (B) preparation-safety band + radiation-dose band
// driven by glucose control, pregnancy, and breastfeeding; (C) request
// completeness over mandatory fields; (D) triage tier with urgency + safety
// escalation. Rule IDs are stable and identical across every front-end and the
// back-end (R-APPROP-*, R-SAFETY-*, R-COMPLETE-*, R-TRIAGE-*). Pure data +
// helpers; the grader composes them.
//
// Wrapped in an IIFE; published via `window.PetScanTestRequest`.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACR Appropriateness Criteria / RCR iRefer 1-9)
// ----------------------------------------------------------------------
//
// Each indication has an ideal tracer / scan type (or set of types). When the
// requested scan type matches the indication well, the request scores high
// (7-9, usually-appropriate). Plausible-but-suboptimal pairings score in the
// 4-6 may-be-appropriate band; clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[scanType], plausible:[scanType] }.
const INDICATION_SCAN_MAP = {
  'cancer-staging':            { ideal: ['fdg-pet-ct', 'psma-pet', 'dotatate-pet'], plausible: [] },
  'cancer-restaging':          { ideal: ['fdg-pet-ct', 'psma-pet', 'dotatate-pet'], plausible: [] },
  'treatment-response':        { ideal: ['fdg-pet-ct'], plausible: ['psma-pet', 'dotatate-pet'] },
  'suspected-recurrence':      { ideal: ['fdg-pet-ct', 'psma-pet', 'dotatate-pet'], plausible: [] },
  'solitary-pulmonary-nodule': { ideal: ['fdg-pet-ct'], plausible: [] },
  'lymphoma':                  { ideal: ['fdg-pet-ct'], plausible: [] },
  'cardiac-viability':         { ideal: ['cardiac-pet'], plausible: ['fdg-pet-ct'] },
  'infection-inflammation':    { ideal: ['fdg-pet-ct'], plausible: [] },
  'neurology-dementia':        { ideal: ['amyloid-pet'], plausible: ['fdg-pet-ct'] },
  'other':                     { ideal: [], plausible: [] }
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
// FDG uptake needs blood glucose typically below ~11 mmol/L. Pregnancy or
// uncontrolled glucose force the caution / contraindicated band regardless of
// appropriateness. Breastfeeding raises a caution. Radiation dose reflects the
// study burden (PET-CT delivers a moderate-to-high effective dose).

const GLUCOSE_UNCONTROLLED_THRESHOLD = 11; // mmol/L (SNMMI)
const GLUCOSE_ELEVATED_THRESHOLD = 7;       // mmol/L (EANM preferred)

// Most-severe band wins.
const PREP_ORDER = ['ok', 'caution', 'contraindicated'];

function maxPrepBand(a, b) {
  const ia = PREP_ORDER.indexOf(a);
  const ib = PREP_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

/**
 * Evaluate the preparation-safety band and the fired safety rules.
 *
 * @returns {{ band:string, firedRules:object[] }}
 */
function scorePrepSafety(data) {
  const prep = data.preparation;
  const fdg = isFdgStudy(data.request.scanType);
  let band = 'ok';
  const firedRules = [];

  // Pregnancy forces contraindicated (relative) — radiation to the fetus.
  if (prep.pregnancyStatus === 'pregnant') {
    band = maxPrepBand(band, 'contraindicated');
    firedRules.push({
      ruleId: 'R-SAFETY-PREGNANT',
      axis: 'safety',
      category: 'pregnancy',
      description: 'Patient is pregnant — PET-CT radiation exposure is contraindicated unless justified by exception.'
    });
  } else if (prep.pregnancyStatus === 'possible') {
    band = maxPrepBand(band, 'caution');
    firedRules.push({
      ruleId: 'R-SAFETY-PREGNANCY-POSSIBLE',
      axis: 'safety',
      category: 'pregnancy',
      description: 'Pregnancy is possible — confirm pregnancy status before exposure.'
    });
  }

  // Glucose control (FDG studies only).
  if (fdg) {
    const g = prep.bloodGlucoseMmolL;
    if (g === null || g === undefined || g === '') {
      band = maxPrepBand(band, 'caution');
      firedRules.push({
        ruleId: 'R-SAFETY-GLUCOSE-MISSING',
        axis: 'safety',
        category: 'glucose',
        description: 'No blood glucose recorded for an FDG study — measure and document before tracer injection.'
      });
    } else if (Number(g) > GLUCOSE_UNCONTROLLED_THRESHOLD) {
      band = maxPrepBand(band, 'caution');
      firedRules.push({
        ruleId: 'R-SAFETY-GLUCOSE-UNCONTROLLED',
        axis: 'safety',
        category: 'glucose',
        description: `Blood glucose ${Number(g)} mmol/L is above ~11 mmol/L — recheck and reschedule; FDG uptake will be impaired.`
      });
    } else if (Number(g) > GLUCOSE_ELEVATED_THRESHOLD) {
      band = maxPrepBand(band, 'caution');
      firedRules.push({
        ruleId: 'R-SAFETY-GLUCOSE-ELEVATED',
        axis: 'safety',
        category: 'glucose',
        description: `Blood glucose ${Number(g)} mmol/L is above the EANM preferred ~7 mmol/L; acceptable but optimise where possible.`
      });
    }
  }

  // Breastfeeding precaution for the radiopharmaceutical.
  if (prep.breastfeeding === true) {
    band = maxPrepBand(band, 'caution');
    firedRules.push({
      ruleId: 'R-SAFETY-BREASTFEEDING',
      axis: 'safety',
      category: 'breastfeeding',
      description: 'Patient is breastfeeding — advise interruption / close-contact precautions per local protocol.'
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-SAFETY-OK',
      axis: 'safety',
      category: 'preparation',
      description: 'No preparation-safety concern detected for the recorded data.'
    });
  }

  return { band, firedRules };
}

// Relative radiation-dose band per scan type (PET-CT effective dose).
const RADIATION_DOSE_BY_SCAN = {
  'fdg-pet-ct': 'high',
  'psma-pet': 'moderate',
  'dotatate-pet': 'moderate',
  'amyloid-pet': 'moderate',
  'cardiac-pet': 'high',
  'other': 'moderate'
};

/**
 * Determine the radiation-dose band for the requested study.
 *
 * @returns {{ band:string, firedRule:object|null }}
 */
function scoreRadiationDose(scanType) {
  if (!scanType) {
    return {
      band: '',
      firedRule: {
        ruleId: 'R-SAFETY-DOSE-UNKNOWN',
        axis: 'safety',
        category: 'radiation-dose',
        description: 'Scan type not yet specified — radiation-dose band not assessed.'
      }
    };
  }
  const band = RADIATION_DOSE_BY_SCAN[scanType] || 'moderate';
  return {
    band,
    firedRule: {
      ruleId: `R-SAFETY-DOSE-${band.toUpperCase()}`,
      axis: 'safety',
      category: 'radiation-dose',
      description: `Requested ${scanType} study carries a ${band} relative radiation dose; ensure IR(ME)R justification.`
    }
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
  { weight: 2, present: (d) => !!d.request.scanType, ruleId: 'R-COMPLETE-SCAN-TYPE', label: 'requested scan type' },
  { weight: 2, present: (d) => glucosePresentIfRequired(d), ruleId: 'R-COMPLETE-GLUCOSE', label: 'blood glucose (FDG study)' },
  { weight: 1, present: (d) => !!d.justification.irMeRJustification && d.justification.irMeRJustification.trim() !== '', ruleId: 'R-COMPLETE-JUSTIFICATION', label: 'IR(ME)R justification' },
  { weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
  { weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
  { weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
  { weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
  { weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
  { weight: 1, present: (d) => !!d.justification.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

// Glucose only counts toward completeness for FDG studies.
function glucosePresentIfRequired(d) {
  if (!isFdgStudy(d.request.scanType)) return true;
  const g = d.preparation.bloodGlucoseMmolL;
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
// Axis D — Triage priority (urgency + safety escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then safety
// concerns auto-escalate it. The most-severe escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent', 'emergency'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 2-4 weeks',
  'urgent': 'Within 3-7 days',
  'emergency': 'Within 24-48 hours'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a, b) {
  const ia = TRIAGE_ORDER.indexOf(a);
  const ib = TRIAGE_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

/**
 * Compute the triage tier, target timeframe, and fired triage rules.
 *
 * @returns {{ tier:string, targetTimeframe:string, firedRules:object[] }}
 */
function scoreTriage(data) {
  const requested = data.justification.urgency || 'routine';
  let tier = TRIAGE_ORDER.includes(requested) ? requested : 'routine';
  const firedRules = [];

  firedRules.push({
    ruleId: 'R-TRIAGE-REQUESTED',
    axis: 'triage',
    category: 'requested',
    description: `Triage follows the requested urgency (${tier}).`
  });

  return {
    tier,
    targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
    firedRules
  };
}

export { scoreAppropriateness, appropriatenessBand, scorePrepSafety, scoreRadiationDose, scoreCompleteness, scoreTriage, maxTier, maxPrepBand, TRIAGE_ORDER, TARGET_TIMEFRAMES, INDICATION_SCAN_MAP, RADIATION_DOSE_BY_SCAN, GLUCOSE_UNCONTROLLED_THRESHOLD, GLUCOSE_ELEVATED_THRESHOLD };
