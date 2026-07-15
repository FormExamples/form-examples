// Four-axis rule catalogue for the DEXA Bone Density Test Request engine.
//
// Derived from index.md and the SQL grade axes: (A) appropriateness 1-9 +
// band by indication x scan region, with FRAX intervention-threshold
// adjustment (NICE CG146 / NOGG / FRAX); (B) radiation dose band (DEXA is
// very low dose); (C) request completeness over mandatory fields;
// (D) triage tier routine/urgent with high-acuity auto-escalation. Rule IDs
// are stable and identical across every front-end and the back-end
// (R-APPROP-*, R-SAFETY-*, R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers;
// the grader composes them.
//
// Wrapped in an IIFE; published via `window.DexaBoneDensityTestRequest`.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (NICE CG146 / NOGG / FRAX, 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal scan region (or set of regions). DEXA of the
// hip and/or spine is the standard diagnostic site, so most osteoporosis
// indications score high (7-9) with a hip-and-spine or hip request.
// Forearm and whole-body are plausible-but-suboptimal for most diagnostic
// indications and score in the 4-6 may-be-appropriate band. A FRAX 10-year
// major-fracture probability near or above the NOGG intervention threshold
// raises appropriateness; a clearly low FRAX with no other indication can
// lower it.

// Map of indication -> { ideal:[scanRegion], plausible:[scanRegion] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_REGION_MAP = {
  'osteoporosis-screening': { ideal: ['hip-and-spine', 'hip'], plausible: ['spine', 'forearm'] },
  'fragility-fracture':     { ideal: ['hip-and-spine', 'hip', 'spine'], plausible: ['forearm'] },
  'long-term-steroids':     { ideal: ['hip-and-spine', 'spine'], plausible: ['hip', 'forearm'] },
  'early-menopause':        { ideal: ['hip-and-spine', 'hip'], plausible: ['spine'] },
  'high-frax-risk':         { ideal: ['hip-and-spine', 'hip'], plausible: ['spine', 'forearm'] },
  'monitoring-treatment':   { ideal: ['hip-and-spine', 'spine'], plausible: ['hip'] },
  'secondary-osteoporosis': { ideal: ['hip-and-spine', 'forearm'], plausible: ['hip', 'spine'] },
  'other':                  { ideal: [], plausible: [] }
};

// NOGG / FRAX 10-year major osteoporotic fracture intervention guide.
// Near or above ~20% is a commonly-cited intervention-threshold zone in
// the UK; treated here as a strong appropriateness signal.
const FRAX_INTERVENTION_THRESHOLD = 20;
const FRAX_HIGH_THRESHOLD = 30;

/**
 * Score appropriateness (1-9) for an indication x scanRegion pairing, then
 * nudge by the FRAX major-fracture probability. Defaults to a neutral
 * may-be-appropriate when the indication or region has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null, fraxRule:object|null }}
 */
function scoreAppropriateness(indication, scanRegion, fraxPercent) {
  if (!indication || !scanRegion) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or scan region not yet specified — provisional appropriateness.'
      },
      fraxRule: null
    };
  }

  const map = INDICATION_REGION_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  let score;
  let band;
  let firedRule;

  if (map.ideal.includes(scanRegion)) {
    score = 8;
    band = 'usually-appropriate';
    firedRule = {
      ruleId: `R-APPROP-${indicationKey}-IDEAL`,
      axis: 'appropriateness',
      category: indication,
      description: `Requested ${scanRegion} DEXA is the recommended site for "${indication}".`
    };
  } else if (map.plausible.includes(scanRegion)) {
    score = 5;
    band = 'may-be-appropriate';
    firedRule = {
      ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
      axis: 'appropriateness',
      category: indication,
      description: `Requested ${scanRegion} DEXA may be appropriate for "${indication}" but is not the first-line site.`
    };
  } else if (indication === 'other') {
    score = 5;
    band = 'may-be-appropriate';
    firedRule = {
      ruleId: 'R-APPROP-OTHER',
      axis: 'appropriateness',
      category: 'other',
      description: 'Indication recorded as "other"; appropriateness requires clinician vetting.'
    };
  } else {
    score = 2;
    band = 'usually-not-appropriate';
    firedRule = {
      ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
      axis: 'appropriateness',
      category: indication,
      description: `Requested ${scanRegion} DEXA is not usually the appropriate site for "${indication}"; query the referrer.`
    };
  }

  // FRAX adjustment (NOGG / FRAX intervention thresholds).
  let fraxRule = null;
  if (fraxPercent !== null && fraxPercent !== undefined && fraxPercent !== '') {
    const frax = Number(fraxPercent);
    if (!Number.isNaN(frax)) {
      if (frax >= FRAX_INTERVENTION_THRESHOLD) {
        score = Math.min(9, score + 1);
        fraxRule = {
          ruleId: 'R-APPROP-FRAX-ABOVE-THRESHOLD',
          axis: 'appropriateness',
          category: 'frax',
          description: `FRAX major-fracture probability (${frax}%) is at or above the NOGG intervention threshold; DEXA strongly supported.`
        };
      } else if (frax < 5 && indication === 'osteoporosis-screening') {
        score = Math.max(1, score - 2);
        fraxRule = {
          ruleId: 'R-APPROP-FRAX-LOW',
          axis: 'appropriateness',
          category: 'frax',
          description: `Low FRAX major-fracture probability (${frax}%) for a screening request; reassess whether DEXA is required now.`
        };
      }
    }
  }

  return { score, band: appropriatenessBand(score), firedRule, fraxRule };
}

/** Map a 1-9 appropriateness score to its band. */
function appropriatenessBand(score) {
  if (score >= 7) return 'usually-appropriate';
  if (score >= 4) return 'may-be-appropriate';
  return 'usually-not-appropriate';
}

// ----------------------------------------------------------------------
// Axis B — Radiation safety (DEXA effective-dose banding)
// ----------------------------------------------------------------------
//
// DEXA is a very low dose examination (~1-5 microsievert). Hip and spine
// are low; whole-body is slightly higher (still low overall). The dominant
// safety consideration is pregnancy, which raises the band and adds a
// deferral note.

const DOSE_BY_REGION = {
  'hip':           'low',
  'spine':         'low',
  'hip-and-spine': 'low',
  'forearm':       'low',
  'whole-body':    'moderate',
  'other':         'low'
};

/**
 * Evaluate the radiation dose band and produce a safety note.
 *
 * @returns {{ band:string, note:string, firedRule:object|null }}
 */
function evaluateRadiationSafety(scanRegion, pregnancyStatus) {
  if (!scanRegion) {
    return {
      band: '',
      note: '',
      firedRule: {
        ruleId: 'R-SAFETY-UNKNOWN',
        axis: 'safety',
        category: 'unspecified',
        description: 'Scan region not yet specified — radiation dose not assessed.'
      }
    };
  }

  const pregnant = pregnancyStatus === 'pregnant' || pregnancyStatus === 'possible';
  if (pregnant) {
    return {
      band: 'high',
      note: 'Known or suspected pregnancy — defer DEXA. Although the dose is very low (~1-5 microsievert), avoid unnecessary exposure.',
      firedRule: {
        ruleId: 'R-SAFETY-PREGNANCY',
        axis: 'safety',
        category: 'pregnancy',
        description: 'Known or suspected pregnancy raises the radiation-safety band and the scan should be deferred.'
      }
    };
  }

  const band = DOSE_BY_REGION[scanRegion] || 'low';
  const regionKey = scanRegion.toUpperCase().replace(/[^A-Z]+/g, '-');
  if (band === 'moderate') {
    return {
      band,
      note: 'Whole-body DEXA carries a slightly higher (still low) effective dose than hip/spine. No additional precautions beyond standard justification.',
      firedRule: {
        ruleId: `R-SAFETY-${regionKey}-MODERATE`,
        axis: 'safety',
        category: 'dose',
        description: 'Whole-body DEXA: low-moderate effective dose.'
      }
    };
  }
  return {
    band,
    note: 'DEXA delivers a very low effective dose (~1-5 microsievert). No additional radiation precautions required.',
    firedRule: {
      ruleId: `R-SAFETY-${regionKey}-LOW`,
      axis: 'safety',
      category: 'dose',
      description: 'Standard DEXA site: very low effective dose.'
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
  { weight: 2, present: (d) => !!d.request.scanRegion, ruleId: 'R-COMPLETE-SCAN-REGION', label: 'requested scan region' },
  { weight: 2, present: (d) => fraxPresent(d), ruleId: 'R-COMPLETE-FRAX', label: 'FRAX major-fracture probability' },
  { weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
  { weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
  { weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
  { weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
  { weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
  { weight: 1, present: (d) => !!d.triage.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

function fraxPresent(d) {
  return (
    d.riskFactors.fraxMajorFracturePercent !== null &&
    d.riskFactors.fraxMajorFracturePercent !== undefined &&
    d.riskFactors.fraxMajorFracturePercent !== ''
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
// Axis D — Triage priority (high-acuity escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then
// high-acuity factors auto-escalate it. The most-severe escalation wins.

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

// High-acuity escalation rules, each forcing at least the given tier.
const TRIAGE_RULES = [
  {
    ruleId: 'R-TRIAGE-RECENT-FRAGILITY-FRACTURE',
    tier: 'urgent',
    fires: (d) => d.riskFactors.previousFragilityFracture === true,
    description: 'Recent fragility fracture — expedite bone-density assessment.'
  },
  {
    ruleId: 'R-TRIAGE-HIGH-FRAX',
    tier: 'urgent',
    fires: (d) => fraxAtOrAbove(d, 30),
    description: 'Very high FRAX major-fracture probability — expedite assessment.'
  },
  {
    ruleId: 'R-TRIAGE-LONG-TERM-STEROIDS',
    tier: 'urgent',
    fires: (d) => d.riskFactors.longTermSteroids === true,
    description: 'Long-term high-dose glucocorticoids — expedite assessment.'
  }
];

function fraxAtOrAbove(d, threshold) {
  const v = d.riskFactors.fraxMajorFracturePercent;
  if (v === null || v === undefined || v === '') return false;
  const n = Number(v);
  return !Number.isNaN(n) && n >= threshold;
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
        axis: 'triage',
        category: 'high-acuity',
        description: rule.description
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-TRIAGE-REQUESTED',
      axis: 'triage',
      category: 'requested',
      description: `No high-acuity factors; triage follows the requested urgency (${tier}).`
    });
  }

  return {
    tier,
    targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
    firedRules
  };
}

export { scoreAppropriateness, appropriatenessBand, evaluateRadiationSafety, scoreCompleteness, scoreTriage, maxTier, TRIAGE_ORDER, TARGET_TIMEFRAMES, INDICATION_REGION_MAP, DOSE_BY_REGION, FRAX_INTERVENTION_THRESHOLD, FRAX_HIGH_THRESHOLD };
