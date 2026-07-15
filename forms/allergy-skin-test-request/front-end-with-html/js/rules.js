import { countSelectedPanels } from './types.js';

// Four-axis rule catalogue for the Allergy Skin Test Request engine.
//
// Derived from index.md and the SQL grade tables (05): (A) appropriateness 1-9
// + band by indication x test type; (B) validity-and-safety band
// ok/caution/contraindicated driven by antihistamines, beta-blocker +
// anaphylaxis, and active skin disease; (C) request completeness over
// mandatory fields including allergen-panel selection; (D) triage tier
// (routine / urgent) with red-flag auto-escalation. Rule IDs are stable and
// identical across every front-end and the back-end (R-APPROP-*, R-VALIDITY-*,
// R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers; the grader composes them.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (BSACI / EAACI indication match, 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal test type (or set of types). When the requested
// test type matches the indication well, the request scores high
// (7-9, usually-appropriate). Plausible-but-suboptimal pairings score in the
// 4-6 may-be-appropriate band; clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[testType], plausible:[testType] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_TEST_MAP = {
  'suspected-food-allergy':    { ideal: ['skin-prick-test', 'specific-ige-blood'], plausible: ['intradermal-test'] },
  'suspected-drug-allergy':    { ideal: ['intradermal-test', 'drug-provocation-challenge'], plausible: ['skin-prick-test', 'specific-ige-blood'] },
  'rhinitis-asthma':           { ideal: ['skin-prick-test', 'specific-ige-blood'], plausible: ['intradermal-test'] },
  'anaphylaxis-investigation': { ideal: ['skin-prick-test', 'specific-ige-blood'], plausible: ['intradermal-test', 'drug-provocation-challenge'] },
  'venom-allergy':             { ideal: ['skin-prick-test', 'intradermal-test'], plausible: ['specific-ige-blood'] },
  'contact-dermatitis':        { ideal: ['patch-test'], plausible: [] },
  'urticaria':                 { ideal: ['skin-prick-test', 'specific-ige-blood'], plausible: ['intradermal-test'] },
  'other':                     { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x testType pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or test type has not yet been chosen.
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
        description: `Requested ${testType} is the recommended test for "${indication}".`
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

/**
 * A request with no allergen panel selected for a skin / specific-IgE test
 * cannot be actioned — drop appropriateness to the lowest band.
 *
 * @returns {object|null} the fired rule, or null when at least one panel is set
 */
function noAllergenAppropriatenessRule(testSection) {
  if (countSelectedPanels(testSection) === 0) {
    return {
      ruleId: 'R-APPROP-NO-ALLERGEN-SELECTED',
      axis: 'appropriateness',
      category: 'no-allergen-selected',
      description: 'No allergen panel selected — the test cannot be performed as requested.'
    };
  }
  return null;
}

/** Map a 1-9 appropriateness score to its band. */
function appropriatenessBand(score) {
  if (score >= 7) return 'usually-appropriate';
  if (score >= 4) return 'may-be-appropriate';
  return 'usually-not-appropriate';
}

// ----------------------------------------------------------------------
// Axis B — Validity and safety (BSACI / EAACI / WAO)
// ----------------------------------------------------------------------
//
// The most important pre-analytic rule in allergy diagnostics:
// antihistamines suppress the weal-and-flare response and INVALIDATE
// skin-prick / intradermal tests. A beta-blocker with a history of anaphylaxis
// raises a caution (adrenaline may be less effective). Active skin disease at
// the test site can invalidate or distort the result. Bands escalate
// ok -> caution -> contraindicated; the most-severe rule wins.

const VALIDITY_ORDER = ['ok', 'caution', 'contraindicated'];

/** Return whichever of two validity bands is more severe. */
function maxValidityBand(a, b) {
  const ia = VALIDITY_ORDER.indexOf(a);
  const ib = VALIDITY_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Test types whose validity is suppressed by antihistamines / skin disease.
const SKIN_TEST_TYPES = ['skin-prick-test', 'intradermal-test'];

/**
 * Evaluate the validity-and-safety axis.
 *
 * @returns {{ band:string, firedRules:object[] }}
 */
function scoreValiditySafety(data) {
  const test = data.test;
  const safety = data.safety;
  let band = 'ok';
  const firedRules = [];
  const isSkinTest = SKIN_TEST_TYPES.includes(test.testType);

  // Antihistamines invalidate skin-prick / intradermal tests.
  if (safety.onAntihistamines === true && isSkinTest) {
    band = maxValidityBand(band, 'contraindicated');
    firedRules.push({
      ruleId: 'R-VALIDITY-ANTIHISTAMINES-INVALIDATE',
      axis: 'validity',
      category: 'antihistamines-invalidate-test',
      description: 'Patient is on antihistamines — skin-prick / intradermal testing is invalidated until an appropriate washout (typically five half-lives).'
    });
  } else if (safety.onAntihistamines === true) {
    // On antihistamines but a non-skin test (e.g. specific-IgE) — only a caution.
    band = maxValidityBand(band, 'caution');
    firedRules.push({
      ruleId: 'R-VALIDITY-ANTIHISTAMINES-NOTE',
      axis: 'validity',
      category: 'antihistamines-invalidate-test',
      description: 'Patient is on antihistamines; this does not affect specific-IgE blood testing but would invalidate a skin test.'
    });
  }

  // Active skin disease at the test site invalidates / distorts skin testing.
  if (safety.currentSkinDisease === true && isSkinTest) {
    band = maxValidityBand(band, 'caution');
    firedRules.push({
      ruleId: 'R-VALIDITY-ACTIVE-SKIN-DISEASE',
      axis: 'validity',
      category: 'active-skin-disease',
      description: 'Active skin disease (eczema / dermographism) at the test site can invalidate or distort skin-test results.'
    });
  }

  // Beta-blocker with a history of anaphylaxis — safety caution.
  if (safety.onBetaBlocker === true && safety.previousAnaphylaxis === true) {
    band = maxValidityBand(band, 'caution');
    firedRules.push({
      ruleId: 'R-VALIDITY-BETA-BLOCKER-ANAPHYLAXIS',
      axis: 'validity',
      category: 'beta-blocker-caution',
      description: 'Beta-blocker with a history of anaphylaxis — adrenaline may be less effective if a systemic reaction occurs during testing.'
    });
  } else if (safety.onBetaBlocker === true) {
    band = maxValidityBand(band, 'caution');
    firedRules.push({
      ruleId: 'R-VALIDITY-BETA-BLOCKER',
      axis: 'validity',
      category: 'beta-blocker-caution',
      description: 'Patient is on a beta-blocker — relative caution for procedures carrying anaphylaxis risk; ensure resuscitation readiness.'
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-VALIDITY-OK',
      axis: 'validity',
      category: 'ok',
      description: 'No validity or safety concerns recorded.'
    });
  }

  return { band, firedRules };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------
//
// Each tracked field carries a weight. Indication, clinical question, and the
// allergen-panel selection are weighted highest because they drive every other
// axis. Completeness is the percentage of weighted points present.

const COMPLETENESS_FIELDS = [
  { weight: 3, present: (d) => !!d.indication.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
  { weight: 3, present: (d) => !!d.indication.clinicalQuestion && d.indication.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
  { weight: 3, present: (d) => countSelectedPanels(d.test) > 0, ruleId: 'R-COMPLETE-ALLERGEN-PANEL', label: 'allergen panel' },
  { weight: 2, present: (d) => !!d.test.testType, ruleId: 'R-COMPLETE-TEST-TYPE', label: 'requested test type' },
  { weight: 1, present: (d) => !!d.indication.clinicalDetails && d.indication.clinicalDetails.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-DETAILS', label: 'clinical details' },
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
// Axis D — Triage priority (routine / urgent, red-flag escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then red flags
// auto-escalate it. The most-severe escalation wins.

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
    ruleId: 'R-TRIAGE-ANAPHYLAXIS-INVESTIGATION',
    tier: 'urgent',
    fires: (d) => d.indication.primaryIndication === 'anaphylaxis-investigation',
    description: 'Anaphylaxis investigation — expedite to identify the trigger.'
  },
  {
    ruleId: 'R-TRIAGE-PREVIOUS-ANAPHYLAXIS',
    tier: 'urgent',
    fires: (d) => d.safety.previousAnaphylaxis === true,
    description: 'History of anaphylaxis — expedite assessment in a resuscitation-ready setting.'
  },
  {
    ruleId: 'R-TRIAGE-VENOM-ALLERGY',
    tier: 'urgent',
    fires: (d) => d.indication.primaryIndication === 'venom-allergy',
    description: 'Venom allergy with systemic-reaction risk — expedite testing and immunotherapy assessment.'
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
      description: `No escalation rules fired; triage follows the requested urgency (${tier}).`
    });
  }

  return {
    tier,
    targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
    firedRules
  };
}

export { scoreAppropriateness, noAllergenAppropriatenessRule, appropriatenessBand, scoreValiditySafety, maxValidityBand, scoreCompleteness, scoreTriage, maxTier, TRIAGE_ORDER, TARGET_TIMEFRAMES, VALIDITY_ORDER, INDICATION_TEST_MAP };
