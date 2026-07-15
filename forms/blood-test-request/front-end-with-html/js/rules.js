import { PANELS, countSelectedPanels, selectedPanels } from './types.js';

// Four-axis rule catalogue for the Blood Test Request engine.
//
// Derived from index.md + SQL migrations 05/06/07: (A) appropriateness 1-9 +
// band anchored on RCPath National Minimum Retesting Intervals + indication
// match (with explicit no-test-selected handling); (B) pre-analytical /
// specimen-safety band ok / caution / reject-risk (fasting met? specimen
// collected? labelled?); (C) request completeness over mandatory fields
// (clinical details + indication weighted highest); (D) triage tier routine /
// urgent / stat with critical-test escalation. Rule IDs are stable and
// identical across every front-end and the back-end (R-APPROP-*,
// R-PREANALYTICAL-*, R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers; the grader
// composes them.
//
// Wrapped in an IIFE; published via `window.BloodTestRequest`.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (1-9 ordinal)
// ----------------------------------------------------------------------
//
// Anchored on RCPath National Minimum Retesting Intervals appropriateness and
// indication match. When the requested panels match the indication well the
// request scores high (7-9, usually-appropriate); plausible-but-broad ordering
// scores 4-6 (may-be-appropriate); a clear mismatch or no indication scores
// 1-3 (usually-not-appropriate). A request with no panels selected cannot be
// appropriate and is forced to the bottom band.

// Map of indication -> { ideal:[panelField], plausible:[panelField] }.
const INDICATION_PANEL_MAP = {
  'routine-monitoring':        { ideal: ['fullBloodCount', 'ureaElectrolytes', 'liverFunction'], plausible: ['thyroidFunction', 'boneProfile', 'lipidProfile'] },
  'anaemia':                   { ideal: ['fullBloodCount', 'ferritinIron'], plausible: ['vitaminB12Folate', 'ureaElectrolytes', 'liverFunction'] },
  'fatigue':                   { ideal: ['fullBloodCount', 'thyroidFunction', 'ferritinIron'], plausible: ['ureaElectrolytes', 'liverFunction', 'vitaminB12Folate', 'vitaminD', 'hba1c'] },
  'infection':                 { ideal: ['fullBloodCount', 'cReactiveProtein'], plausible: ['bloodCulture', 'ureaElectrolytes', 'liverFunction'] },
  'diabetes-monitoring':       { ideal: ['hba1cMonitoring', 'hba1c'], plausible: ['glucose', 'ureaElectrolytes', 'lipidProfile'] },
  'thyroid-symptoms':          { ideal: ['thyroidFunction'], plausible: ['fullBloodCount', 'ferritinIron'] },
  'cardiovascular-risk':       { ideal: ['lipidProfile'], plausible: ['hba1c', 'ureaElectrolytes', 'glucose'] },
  'liver-disease':             { ideal: ['liverFunction'], plausible: ['fullBloodCount', 'coagulationScreen', 'ureaElectrolytes'] },
  'renal-monitoring':          { ideal: ['ureaElectrolytes'], plausible: ['fullBloodCount', 'boneProfile', 'cReactiveProtein'] },
  'anticoagulation-monitoring': { ideal: ['inr', 'coagulationScreen'], plausible: ['fullBloodCount', 'liverFunction'] },
  'pre-operative':             { ideal: ['fullBloodCount', 'ureaElectrolytes', 'coagulationScreen', 'groupAndSave'], plausible: ['liverFunction', 'crossmatch', 'hba1c'] },
  'suspected-malignancy':      { ideal: ['fullBloodCount', 'liverFunction', 'ureaElectrolytes'], plausible: ['boneProfile', 'cReactiveProtein', 'ferritinIron'] },
  'other':                     { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for the indication x selected-panels pairing and
 * return the fired rule. A request with no panels selected is forced low.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, panels) {
  const selectedCount = countSelectedPanels(panels);

  if (selectedCount === 0) {
    return {
      score: 1,
      band: 'usually-not-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-NO-TEST',
        axis: 'appropriateness',
        category: 'no-test-selected',
        description: 'No test panel selected — the request cannot be actioned.'
      }
    };
  }

  if (!indication) {
    return {
      score: 4,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: 'unspecified',
        description: 'Primary indication not yet specified — provisional appropriateness.'
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

  const map = INDICATION_PANEL_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');
  const selected = selectedPanels(panels).map((p) => p.field);

  const matchesIdeal = map.ideal.some((f) => selected.includes(f));
  const matchesPlausible = map.plausible.some((f) => selected.includes(f));

  if (matchesIdeal) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Selected panels include the recommended tests for "${indication}".`
      }
    };
  }
  if (matchesPlausible) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Selected panels may be appropriate for "${indication}" but are not the first-line tests.`
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
      description: `Selected panels are not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Pre-analytical / specimen safety (ok / caution / reject-risk)
// ----------------------------------------------------------------------
//
// A fasting-required test collected non-fasting (or with unknown fasting
// status) forces a fasting violation and lowers the band. A specimen recorded
// as collected without a collection date/time, or known difficult access, adds
// caution. The most-severe band wins; ok only when nothing fires.

const PREANALYTICAL_ORDER = ['ok', 'caution', 'reject-risk'];

/** Return whichever of two pre-analytical bands is more severe. */
function worseBand(a, b) {
  const ia = PREANALYTICAL_ORDER.indexOf(a);
  const ib = PREANALYTICAL_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

/**
 * Evaluate pre-analytical / specimen safety.
 *
 * @returns {{ band:string, fastingViolation:boolean, firedRules:object[] }}
 */
function scorePreanalytical(data) {
  const firedRules = [];
  let band = 'ok';
  let fastingViolation = false;

  const pre = data.preanalytical;
  const panels = data.panels;

  // Does any selected panel benefit from fasting, or was fasting flagged?
  const fastingPanel = PANELS.some(
    (p) => p.fasting && panels[p.field] === true
  );
  const fastingNeeded = pre.fastingRequired === true || fastingPanel;

  if (fastingNeeded) {
    if (pre.fastingStatus === 'non-fasting') {
      fastingViolation = true;
      band = worseBand(band, 'reject-risk');
      firedRules.push({
        ruleId: 'R-PREANALYTICAL-FASTING-NOT-MET',
        axis: 'preanalytical',
        category: 'fasting',
        description: 'A fasting-required test was collected non-fasting — fasting violation.'
      });
    } else if (pre.fastingStatus === '' || pre.fastingStatus === 'unknown') {
      fastingViolation = true;
      band = worseBand(band, 'caution');
      firedRules.push({
        ruleId: 'R-PREANALYTICAL-FASTING-UNKNOWN',
        axis: 'preanalytical',
        category: 'fasting',
        description: 'A fasting-required test was ordered but fasting status is unknown.'
      });
    }
  }

  // Specimen recorded collected but with no collection timestamp.
  if (pre.specimenCollected === 'yes' && !pre.collectionDate) {
    band = worseBand(band, 'caution');
    firedRules.push({
      ruleId: 'R-PREANALYTICAL-NO-COLLECTION-TIME',
      axis: 'preanalytical',
      category: 'specimen',
      description: 'Specimen marked collected but no collection date/time recorded.'
    });
  }

  // Difficult venous access flagged — pre-analytical caution.
  if (data.safety.difficultVenousAccess === true) {
    band = worseBand(band, 'caution');
    firedRules.push({
      ruleId: 'R-PREANALYTICAL-DIFFICULT-ACCESS',
      axis: 'preanalytical',
      category: 'specimen',
      description: 'Difficult venous access — risk of a haemolysed or short sample.'
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-PREANALYTICAL-OK',
      axis: 'preanalytical',
      category: 'specimen',
      description: 'No pre-analytical / specimen-safety concerns detected.'
    });
  }

  return { band, fastingViolation, firedRules };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------
//
// Each tracked field carries a weight. Clinical details and indication are
// weighted highest because they drive every other axis. Completeness is the
// percentage of weighted points present.

const COMPLETENESS_FIELDS = [
  { weight: 3, present: (d) => !!d.clinical.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
  { weight: 3, present: (d) => !!d.clinical.clinicalDetails && d.clinical.clinicalDetails.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-DETAILS', label: 'clinical details' },
  { weight: 3, present: (d) => countSelectedPanels(d.panels) > 0, ruleId: 'R-COMPLETE-PANELS', label: 'at least one test panel' },
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
// Axis D — Triage priority (routine / urgent / stat)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then a critical
// test (troponin, d-dimer, blood culture, crossmatch) or stat urgency escalates
// it. The most-severe escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent', 'stat'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within standard laboratory turnaround',
  'urgent': 'Within a few hours',
  'stat': 'Immediate / within 1 hour'
};

const CRITICAL_PANELS = ['troponin', 'dDimer', 'bloodCulture', 'crossmatch'];

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
  const requested = data.triage.urgency || 'routine';
  let tier = TRIAGE_ORDER.includes(requested) ? requested : 'routine';
  const firedRules = [];

  if (requested === 'stat') {
    firedRules.push({
      ruleId: 'R-TRIAGE-STAT-REQUESTED',
      axis: 'triage',
      category: 'requested',
      description: 'Clinician requested a stat (immediate) turnaround.'
    });
  }

  const criticalSelected = CRITICAL_PANELS.filter(
    (f) => data.panels[f] === true
  );
  for (const f of criticalSelected) {
    tier = maxTier(tier, 'stat');
    const panel = PANELS.find((p) => p.field === f);
    firedRules.push({
      ruleId: `R-TRIAGE-CRITICAL-${f.toUpperCase()}`,
      axis: 'triage',
      category: 'critical-test',
      description: `${panel ? panel.label : f} is a critical test — escalate to stat.`
    });
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

export { scoreAppropriateness, appropriatenessBand, scorePreanalytical, scoreCompleteness, scoreTriage, maxTier, worseBand, TRIAGE_ORDER, TARGET_TIMEFRAMES, CRITICAL_PANELS, INDICATION_PANEL_MAP };
