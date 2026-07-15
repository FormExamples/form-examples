import { countSelectedAssays } from './types.js';

// Four-axis rule catalogue for the Toxicology Test Request engine.
//
// Derived from index.md and SQL migration 05/06: (A) appropriateness 1-9 +
// band from TOXBASE / NPIS indication-to-assay match (no assay selected ->
// usually-not-appropriate); (B) ingestion-timing validity ok / caution /
// invalid (paracetamol level requires >= 4 h post-ingestion); (C) request
// completeness over mandatory fields; (D) triage tier routine / urgent / stat
// with deliberate-overdose / symptomatic auto-escalation to stat. Rule IDs are
// stable and identical across every front-end and the back-end (R-APPROP-*,
// R-TIMING-*, R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers; the grader
// composes them.
//
// Wrapped in an IIFE; published via `window.ToxicologyTestRequest`.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (TOXBASE / NPIS indication-to-assay match, 1-9)
// ----------------------------------------------------------------------
//
// Each indication has ideal assays (the first-line assays for that context)
// and plausible assays (reasonable but not first-line). A request that selects
// at least one ideal assay scores high (7-9, usually-appropriate); a request
// that selects only plausible assays scores in the 4-6 may-be-appropriate
// band; a request with assays selected but none matching scores 1-3. A request
// with no assay at all scores the floor (1) and is usually-not-appropriate.

// Map of indication -> { ideal:[assayField], plausible:[assayField] }.
const INDICATION_ASSAY_MAP = {
  'suspected-overdose':          { ideal: ['paracetamolLevel', 'salicylateLevel'], plausible: ['drugsOfAbuseScreen', 'specificDrugLevel', 'alcoholLevel'] },
  'deliberate-self-harm':        { ideal: ['paracetamolLevel', 'salicylateLevel'], plausible: ['drugsOfAbuseScreen', 'specificDrugLevel', 'alcoholLevel'] },
  'therapeutic-drug-monitoring': { ideal: ['lithiumLevel', 'digoxinLevel', 'antiepilepticDrugLevel'], plausible: ['specificDrugLevel'] },
  'suspected-poisoning':         { ideal: ['carboxyhaemoglobin', 'heavyMetals', 'specificDrugLevel'], plausible: ['paracetamolLevel', 'salicylateLevel', 'drugsOfAbuseScreen'] },
  'substance-misuse-screen':     { ideal: ['drugsOfAbuseScreen'], plausible: ['alcoholLevel', 'specificDrugLevel'] },
  'occupational-screen':         { ideal: ['heavyMetals', 'drugsOfAbuseScreen'], plausible: ['carboxyhaemoglobin', 'specificDrugLevel'] },
  'forensic':                    { ideal: ['alcoholLevel', 'drugsOfAbuseScreen'], plausible: ['specificDrugLevel'] },
  'other':                       { ideal: [], plausible: [] }
};

/** List of selected assay fields on the request. */
function selectedAssayFields(data) {
  const a = data.assays || {};
  return Object.keys(a).filter((k) => a[k] === true);
}

/** Map a 1-9 appropriateness score to its band. */
function appropriatenessBand(score) {
  if (score >= 7) return 'usually-appropriate';
  if (score >= 4) return 'may-be-appropriate';
  return 'usually-not-appropriate';
}

/**
 * Score appropriateness (1-9) for an indication x selected-assays pairing and
 * return the fired rule. A request with no assay selected scores the floor.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(data) {
  const indication = data.clinical.primaryIndication;
  const selected = selectedAssayFields(data);

  if (selected.length === 0) {
    return {
      score: 1,
      band: 'usually-not-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-NO-TEST',
        axis: 'appropriateness',
        category: 'no-test-selected',
        description: 'No assay selected — request cannot be actioned until at least one assay is chosen.'
      }
    };
  }

  if (!indication) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: 'unspecified',
        description: 'Primary indication not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_ASSAY_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');
  const hasIdeal = selected.some((f) => map.ideal.includes(f));
  const hasPlausible = selected.some((f) => map.plausible.includes(f));

  if (hasIdeal) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Selected assays include a first-line assay for "${indication}".`
      }
    };
  }
  if (hasPlausible) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Selected assays may be appropriate for "${indication}" but are not the first-line assays.`
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
      description: `Selected assays are not usually appropriate for "${indication}"; query the referrer.`
    }
  };
}

// ----------------------------------------------------------------------
// Axis B — Ingestion-timing validity (paracetamol nomogram >= 4 h)
// ----------------------------------------------------------------------
//
// ok      — assay can be interpreted at the stated ingestion time.
// caution — borderline or serial sampling advisable (e.g. very early or
//           staggered ingestion).
// invalid — cannot be interpreted, e.g. a paracetamol level taken < 4 h
//           post-ingestion (the UK nomogram starts at 4 h / 100 mg/L).

const PARACETAMOL_NOMOGRAM_HOURS = 4;
const TIMING_CAUTION_HOURS = 2;

/**
 * Evaluate ingestion-timing validity for the requested assays.
 *
 * @returns {{ band:string, firedRule:object|null }}
 */
function evaluateTiming(data) {
  const wantsParacetamol = data.assays.paracetamolLevel === true;
  const hours = data.clinical.timeSinceIngestionHours;
  const hasHours = hours !== null && hours !== undefined && hours !== '';

  // Paracetamol level requested with a known sub-4h ingestion time is invalid
  // for nomogram interpretation — the strongest timing signal.
  if (wantsParacetamol && hasHours && Number(hours) < PARACETAMOL_NOMOGRAM_HOURS) {
    return {
      band: 'invalid',
      firedRule: {
        ruleId: 'R-TIMING-PARACETAMOL-INVALID',
        axis: 'timing',
        category: 'paracetamol-nomogram',
        description: `Paracetamol level requested at ${Number(hours)} h post-ingestion; the treatment nomogram is not interpretable before ${PARACETAMOL_NOMOGRAM_HOURS} h. Repeat at >= ${PARACETAMOL_NOMOGRAM_HOURS} h.`
      }
    };
  }

  // Very early ingestion (any time-critical assay) — advise serial / repeat.
  if (hasHours && Number(hours) >= 0 && Number(hours) < TIMING_CAUTION_HOURS) {
    return {
      band: 'caution',
      firedRule: {
        ruleId: 'R-TIMING-EARLY',
        axis: 'timing',
        category: 'early-sampling',
        description: `Ingestion only ${Number(hours)} h ago — early levels may be unreliable; consider serial sampling.`
      }
    };
  }

  // Paracetamol requested but ingestion time unknown — cannot validate timing.
  if (wantsParacetamol && !hasHours) {
    return {
      band: 'caution',
      firedRule: {
        ruleId: 'R-TIMING-PARACETAMOL-UNKNOWN',
        axis: 'timing',
        category: 'paracetamol-nomogram',
        description: 'Paracetamol level requested but time since ingestion is unknown; confirm timing for nomogram interpretation.'
      }
    };
  }

  return {
    band: 'ok',
    firedRule: {
      ruleId: 'R-TIMING-OK',
      axis: 'timing',
      category: 'timing',
      description: 'Ingestion timing is compatible with interpretation of the requested assays.'
    }
  };
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
  { weight: 2, present: (d) => countSelectedAssays(d.assays) > 0, ruleId: 'R-COMPLETE-ASSAY', label: 'at least one assay' },
  { weight: 2, present: (d) => d.clinical.timeSinceIngestionHours !== null && d.clinical.timeSinceIngestionHours !== undefined && d.clinical.timeSinceIngestionHours !== '', ruleId: 'R-COMPLETE-TIMING', label: 'time since ingestion' },
  { weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
  { weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
  { weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
  { weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
  { weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
  { weight: 1, present: (d) => !!d.specimen.specimenCollected, ruleId: 'R-COMPLETE-SPECIMEN', label: 'specimen status' },
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
// Axis D — Triage priority (acuity escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then context
// rules auto-escalate it. A deliberate overdose or a symptomatic patient forces
// stat. The most-severe escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent', 'stat'];

const TARGET_TIMEFRAMES = {
  'routine': 'Routine laboratory turnaround',
  'urgent': 'Within a few hours',
  'stat': 'Immediate / stat — phone result'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a, b) {
  const ia = TRIAGE_ORDER.indexOf(a);
  const ib = TRIAGE_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Context escalation rules, each forcing at least the given tier.
const TRIAGE_RULES = [
  {
    ruleId: 'R-TRIAGE-DELIBERATE-OVERDOSE',
    tier: 'stat',
    fires: (d) => d.clinical.deliberateOverdose === true,
    description: 'Deliberate overdose — stat handling.'
  },
  {
    ruleId: 'R-TRIAGE-SYMPTOMATIC',
    tier: 'stat',
    fires: (d) => d.clinical.symptomatic === true,
    description: 'Patient is symptomatic from the exposure — stat handling.'
  },
  {
    ruleId: 'R-TRIAGE-SUSPECTED-OVERDOSE',
    tier: 'urgent',
    fires: (d) => d.clinical.primaryIndication === 'suspected-overdose' ||
      d.clinical.primaryIndication === 'suspected-poisoning',
    description: 'Suspected overdose / poisoning indication — urgent handling.'
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

export { scoreAppropriateness, appropriatenessBand, evaluateTiming, scoreCompleteness, scoreTriage, maxTier, selectedAssayFields, TRIAGE_ORDER, TARGET_TIMEFRAMES, INDICATION_ASSAY_MAP, PARACETAMOL_NOMOGRAM_HOURS };
