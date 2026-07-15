// Four-axis rule catalogue for the Histopathology Test Request engine.
//
// Derived from index.md: (A) appropriateness 1-9 + band by indication x
// specimen type (RCPath cancer datasets / tissue pathways); (B) specimen
// quality band ok/caution/reject-risk from fixative + labelling + adequacy;
// (C) request completeness over mandatory fields; (D) urgency triage tier
// routine/urgent/two-week-wait with frozen-section + 2WW auto-escalation.
// Rule IDs are stable and identical across every front-end and the back-end
// (R-APPROP-*, R-SPECIMEN-*, R-COMPLETE-*, R-URGENCY-*). Pure data + helpers;
// the grader composes them.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (RCPath cancer datasets / tissue pathways, 1-9)
// ----------------------------------------------------------------------
//
// Each indication has an ideal specimen type (or set of types). When the
// requested specimen type matches the indication well, the request scores
// high (7-9, usually-appropriate). Plausible-but-suboptimal pairings score in
// the 4-6 may-be-appropriate band; clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[specimenType], plausible:[specimenType] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_SPECIMEN_MAP = {
  'suspected-malignancy':  { ideal: ['biopsy', 'excision', 'endoscopic-biopsy', 'skin-lesion'], plausible: ['resection', 'frozen-section'] },
  'cancer-staging':        { ideal: ['resection', 'excision'], plausible: ['biopsy', 'frozen-section'] },
  'inflammatory-disease':  { ideal: ['biopsy', 'endoscopic-biopsy'], plausible: ['excision', 'skin-lesion'] },
  'infection':             { ideal: ['biopsy', 'endoscopic-biopsy'], plausible: ['excision', 'skin-lesion'] },
  'characterise-lesion':   { ideal: ['biopsy', 'excision', 'skin-lesion'], plausible: ['endoscopic-biopsy', 'resection'] },
  'margin-assessment':     { ideal: ['excision', 'resection'], plausible: ['frozen-section', 'biopsy'] },
  'transplant-monitoring': { ideal: ['biopsy'], plausible: ['endoscopic-biopsy'] },
  'other':                 { ideal: [], plausible: [] }
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
        description: `Requested ${specimenType} specimen is the recommended sample for "${indication}".`
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
        description: `Requested ${specimenType} specimen may be appropriate for "${indication}" but is not the first-line sample.`
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
        description: 'Indication recorded as "other"; appropriateness requires pathologist vetting.'
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
// Axis B — Specimen quality (RCPath specimen-handling: fixative + labelling)
// ----------------------------------------------------------------------
//
// Band ok / caution / reject-risk. Reject-risk fires when the specimen is
// likely to be unfit for diagnosis: fresh (unfixed) specimen routed outside an
// urgent frozen-section pathway, or a missing fixative entirely. Caution fires
// for softer concerns: specimen not confirmed labelled, fixative recorded as
// "other", or no specimen count recorded.

/**
 * Evaluate the specimen-quality band and the fired rules.
 *
 * @returns {{ band:string, firedRules:object[] }}
 */
function scoreSpecimenQuality(data) {
  const firedRules = [];
  let band = 'ok';

  const fixative = data.specimen.fixative;
  const isFrozen =
    data.specimen.specimenType === 'frozen-section' ||
    data.urgency.urgentFrozenSection === true;

  // reject-risk conditions ------------------------------------------------
  if (fixative === 'fresh' && !isFrozen) {
    band = 'reject-risk';
    firedRules.push({
      ruleId: 'R-SPECIMEN-FRESH-NOT-FROZEN',
      axis: 'specimen',
      category: 'fixation',
      description: 'Fresh (unfixed) specimen submitted outside a frozen-section pathway — autolysis / drying risk.'
    });
  }
  if (data.specimen.specimenType && !fixative) {
    band = band === 'reject-risk' ? band : 'caution';
    firedRules.push({
      ruleId: 'R-SPECIMEN-NO-FIXATIVE',
      axis: 'specimen',
      category: 'fixation',
      description: 'No fixative recorded for the specimen.'
    });
  }

  // caution conditions ----------------------------------------------------
  if (data.specimen.specimenType && data.specimen.specimenLabelled !== true) {
    if (band !== 'reject-risk') band = 'caution';
    firedRules.push({
      ruleId: 'R-SPECIMEN-NOT-LABELLED',
      axis: 'specimen',
      category: 'labelling',
      description: 'Specimen container labelling not confirmed — mislabel risk.'
    });
  }
  if (fixative === 'other') {
    if (band === 'ok') band = 'caution';
    firedRules.push({
      ruleId: 'R-SPECIMEN-FIXATIVE-OTHER',
      axis: 'specimen',
      category: 'fixation',
      description: 'Fixative recorded as "other"; confirm suitability for histology.'
    });
  }
  if (
    data.specimen.specimenType &&
    (data.specimen.numberOfSpecimens === null ||
      data.specimen.numberOfSpecimens === undefined ||
      data.specimen.numberOfSpecimens === 0)
  ) {
    if (band === 'ok') band = 'caution';
    firedRules.push({
      ruleId: 'R-SPECIMEN-NO-COUNT',
      axis: 'specimen',
      category: 'adequacy',
      description: 'Number of specimen containers / pots not recorded.'
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-SPECIMEN-OK',
      axis: 'specimen',
      category: 'quality',
      description: 'Fixative, labelling, and specimen count are satisfactory.'
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
  { weight: 3, present: (d) => !!d.indication.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
  { weight: 3, present: (d) => !!d.indication.clinicalQuestion && d.indication.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
  { weight: 2, present: (d) => !!d.specimen.specimenType, ruleId: 'R-COMPLETE-SPECIMEN-TYPE', label: 'specimen type' },
  { weight: 2, present: (d) => !!d.specimen.specimenSite, ruleId: 'R-COMPLETE-SPECIMEN-SITE', label: 'anatomical site' },
  { weight: 1, present: (d) => !!d.specimen.fixative, ruleId: 'R-COMPLETE-FIXATIVE', label: 'fixative' },
  { weight: 1, present: (d) => !!d.indication.clinicalDetails && d.indication.clinicalDetails.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-DETAILS', label: 'clinical details' },
  { weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
  { weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
  { weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
  { weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
  { weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
  { weight: 1, present: (d) => !!d.urgency.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
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
// Axis D — Urgency triage (NICE NG12 / frozen-section escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then red flags
// auto-escalate it. The most-severe escalation wins. A 2WW (suspected-cancer)
// request escalates to two-week-wait; an urgent frozen section escalates to
// two-week-wait tier with an immediate target timeframe.

const TRIAGE_ORDER = ['routine', 'urgent', 'two-week-wait'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 7-10 working days',
  'urgent': 'Within 3-5 working days',
  'two-week-wait': 'Within the 2-week-wait cancer pathway'
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
    ruleId: 'R-URGENCY-FROZEN-SECTION',
    tier: 'two-week-wait',
    immediate: true,
    fires: (d) => d.urgency.urgentFrozenSection === true || d.specimen.specimenType === 'frozen-section',
    description: 'Intra-operative urgent frozen section — immediate diagnosis required.'
  },
  {
    ruleId: 'R-URGENCY-TWO-WEEK-WAIT',
    tier: 'two-week-wait',
    fires: (d) => d.urgency.twoWeekWait === true || d.indication.primaryIndication === 'suspected-malignancy',
    description: 'Suspected-cancer two-week-wait pathway — expedite reporting.'
  },
  {
    ruleId: 'R-URGENCY-CANCER-STAGING',
    tier: 'urgent',
    fires: (d) => d.indication.primaryIndication === 'cancer-staging',
    description: 'Cancer-staging resection — prioritise reporting for MDT.'
  }
];

/**
 * Compute the triage tier, target timeframe, and fired triage rules.
 *
 * @returns {{ tier:string, targetTimeframe:string, immediate:boolean, firedRules:object[] }}
 */
function scoreTriage(data) {
  const requested = data.urgency.urgency || 'routine';
  let tier = TRIAGE_ORDER.includes(requested) ? requested : 'routine';
  let immediate = false;
  const firedRules = [];

  for (const rule of TRIAGE_RULES) {
    if (rule.fires(data)) {
      tier = maxTier(tier, rule.tier);
      if (rule.immediate) immediate = true;
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
      description: `No escalation; triage follows the requested urgency (${tier}).`
    });
  }

  const targetTimeframe = immediate
    ? 'Immediate (intra-operative)'
    : TARGET_TIMEFRAMES[tier] || '';

  return { tier, targetTimeframe, immediate, firedRules };
}

export { scoreAppropriateness, appropriatenessBand, scoreSpecimenQuality, scoreCompleteness, scoreTriage, maxTier, TRIAGE_ORDER, TARGET_TIMEFRAMES, INDICATION_SPECIMEN_MAP };
