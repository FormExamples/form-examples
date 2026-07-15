// Four-axis rule catalogue for the Cytology Test Request engine.
//
// Derived from index.md and SQL migration 05: (A) appropriateness 1-9 + band
// by indication x specimen type (NHS Cervical Screening / indication match);
// (B) pre-analytical specimen adequacy (ok / caution / reject-risk) from
// collection, timing, and fixation; (C) request completeness over mandatory
// fields; (D) triage tier (routine / urgent / two-week-wait) with
// suspected-cancer and previous-high-grade auto-escalation. Rule IDs are
// stable and identical across every front-end and the back-end (R-APPROP-*,
// R-PREANALYTICAL-*, R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers; the
// grader composes them.
//
// Wrapped in an IIFE; published via `window.CytologyTestRequest`.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (NHS Cervical Screening / indication match, 1-9)
// ----------------------------------------------------------------------
//
// Each indication has an ideal specimen type (or set of types). When the
// requested specimen type matches the indication well, the request scores
// high (7-9, usually-appropriate). Plausible-but-suboptimal pairings score in
// the 4-6 may-be-appropriate band; clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[specimenType], plausible:[specimenType] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_SPECIMEN_MAP = {
  'cervical-screening':     { ideal: ['cervical-smear'], plausible: [] },
  'suspected-malignancy':   { ideal: ['urine-cytology', 'sputum-cytology', 'fluid-pleural-ascitic', 'fine-needle-aspiration-thyroid', 'fine-needle-aspiration-breast', 'csf-cytology'], plausible: ['cervical-smear', 'other'] },
  'haematuria':             { ideal: ['urine-cytology'], plausible: ['other'] },
  'effusion-investigation': { ideal: ['fluid-pleural-ascitic'], plausible: ['other'] },
  'thyroid-nodule':         { ideal: ['fine-needle-aspiration-thyroid'], plausible: ['other'] },
  'breast-lump':            { ideal: ['fine-needle-aspiration-breast'], plausible: ['other'] },
  'follow-up':              { ideal: ['cervical-smear', 'urine-cytology', 'sputum-cytology', 'fluid-pleural-ascitic', 'fine-needle-aspiration-thyroid', 'fine-needle-aspiration-breast', 'csf-cytology'], plausible: ['other'] },
  'other':                  { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x specimenType pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or specimen type has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, specimenType) {
  if (!indication || !specimenType) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or specimen type not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_SPECIMEN_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  if (map.ideal.includes(specimenType)) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${specimenType} specimen is the recommended examination for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(specimenType)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${specimenType} specimen may be appropriate for "${indication}" but is not the first-line examination.`
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
      description: `Requested ${specimenType} specimen is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Pre-analytical specimen adequacy (RCPath cytopathology)
// ----------------------------------------------------------------------
//
// Based on whether the specimen has been collected, the time elapsed since
// collection (degradation risk), and indication-specific timing such as
// cervical-smear menstrual timing. Three bands: ok, caution, reject-risk.

const STALE_HOURS = 48;       // beyond this elapsed time -> reject-risk
const CAUTION_HOURS = 24;     // beyond this elapsed time -> caution

/** Hours elapsed between a collection ISO date-time and now; null if unknown. */
function hoursSinceCollection(collectionDatetime) {
  if (!collectionDatetime) return null;
  const t = Date.parse(collectionDatetime);
  if (Number.isNaN(t)) return null;
  return (Date.now() - t) / (1000 * 60 * 60);
}

/**
 * Evaluate pre-analytical specimen adequacy.
 *
 * @returns {{ band:string, firedRule:object|null }}
 */
function evaluatePreanalytical(data) {
  const collected = data.collection.specimenCollected;

  if (collected !== 'yes') {
    // Specimen not yet collected: no degradation risk, but flagged elsewhere.
    return {
      band: 'ok',
      firedRule: {
        ruleId: 'R-PREANALYTICAL-NOT-COLLECTED',
        axis: 'preanalytical',
        category: 'collection',
        description: 'Specimen not yet collected — pre-analytical adequacy assessed at collection.'
      }
    };
  }

  const elapsed = hoursSinceCollection(data.collection.collectionDatetime);

  if (elapsed === null) {
    return {
      band: 'caution',
      firedRule: {
        ruleId: 'R-PREANALYTICAL-NO-TIMING',
        axis: 'preanalytical',
        category: 'timing',
        description: 'Specimen collected but collection date-time is missing — confirm timing and fixation.'
      }
    };
  }

  if (elapsed > STALE_HOURS) {
    return {
      band: 'reject-risk',
      firedRule: {
        ruleId: 'R-PREANALYTICAL-STALE',
        axis: 'preanalytical',
        category: 'timing',
        description: `Specimen collected more than ${STALE_HOURS}h ago — degradation risk; confirm fixation or recollect.`
      }
    };
  }

  if (elapsed > CAUTION_HOURS) {
    return {
      band: 'caution',
      firedRule: {
        ruleId: 'R-PREANALYTICAL-AGEING',
        axis: 'preanalytical',
        category: 'timing',
        description: `Specimen collected more than ${CAUTION_HOURS}h ago — process promptly; confirm fixation.`
      }
    };
  }

  return {
    band: 'ok',
    firedRule: {
      ruleId: 'R-PREANALYTICAL-FRESH',
      axis: 'preanalytical',
      category: 'timing',
      description: 'Specimen collected recently and within acceptable pre-analytical window.'
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
  { weight: 2, present: (d) => !!d.request.specimenType, ruleId: 'R-COMPLETE-SPECIMEN-TYPE', label: 'specimen type' },
  { weight: 2, present: (d) => !!d.request.clinicalDetails && d.request.clinicalDetails.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-DETAILS', label: 'clinical details' },
  { weight: 1, present: (d) => !!d.request.specimenSite, ruleId: 'R-COMPLETE-SPECIMEN-SITE', label: 'specimen site' },
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
// Axis D — Triage priority (NICE NG12 suspected-cancer escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then
// suspected-cancer indications and previous high-grade cytology auto-escalate
// it toward the two-week-wait pathway. The most-severe escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent', 'two-week-wait'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 2-6 weeks',
  'urgent': 'Within 1 week',
  'two-week-wait': 'Within 14 days (2-week-wait pathway)'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a, b) {
  const ia = TRIAGE_ORDER.indexOf(a);
  const ib = TRIAGE_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Escalation rules, each forcing at least the given tier.
const TRIAGE_RULES = [
  {
    ruleId: 'R-TRIAGE-SUSPECTED-CANCER',
    tier: 'two-week-wait',
    fires: (d) => d.request.primaryIndication === 'suspected-malignancy',
    description: 'Suspected malignancy — NICE NG12 two-week-wait pathway.'
  },
  {
    ruleId: 'R-TRIAGE-PREVIOUS-HIGH-GRADE',
    tier: 'two-week-wait',
    fires: (d) => d.context.previousAbnormalCytology === 'high-grade',
    description: 'Previous high-grade cytology — expedite to two-week-wait pathway.'
  },
  {
    ruleId: 'R-TRIAGE-BREAST-LUMP',
    tier: 'two-week-wait',
    fires: (d) => d.request.primaryIndication === 'breast-lump',
    description: 'Breast lump — NICE NG12 suspected-cancer two-week-wait pathway.'
  },
  {
    ruleId: 'R-TRIAGE-HAEMATURIA',
    tier: 'urgent',
    fires: (d) => d.request.primaryIndication === 'haematuria',
    description: 'Haematuria — expedite urothelial-malignancy investigation.'
  },
  {
    ruleId: 'R-TRIAGE-PREVIOUS-LOW-GRADE',
    tier: 'urgent',
    fires: (d) => d.context.previousAbnormalCytology === 'low-grade',
    description: 'Previous low-grade cytology — expedited follow-up.'
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
        category: 'escalation',
        description: rule.description
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-TRIAGE-REQUESTED',
      axis: 'urgency',
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

export { scoreAppropriateness, appropriatenessBand, evaluatePreanalytical, hoursSinceCollection, scoreCompleteness, scoreTriage, maxTier, TRIAGE_ORDER, TARGET_TIMEFRAMES, INDICATION_SPECIMEN_MAP };
