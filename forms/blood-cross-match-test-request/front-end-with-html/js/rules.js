// Four-axis rule catalogue for the Blood Cross-Match Test Request engine.
//
// Derived from index.md / SQL migration 05-07: (A) appropriateness 1-9 + band
// anchored on NICE NG24 restrictive thresholds and indication appropriateness;
// (B) identity / sample safety band ok / caution / reject-risk driven by the
// BSH / SHOT two-sample (group-check) rule, positive patient ID, and
// labelling; (C) request completeness over mandatory fields, with indication,
// blood group, and sample status weighted highest; (D) triage tier
// routine / urgent / emergency / stat with massive-haemorrhage auto-escalation
// to stat. Rule IDs are stable and identical across every front-end and the
// back-end (R-APPROP-*, R-IDENTITY-*, R-COMPLETE-*, R-TRIAGE-*). Pure data +
// helpers; the grader composes them.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (1-9 ordinal, anchored on NICE NG24)
// ----------------------------------------------------------------------
//
// There is no single published transfusion-ordering score comparable to the
// ACR Appropriateness Criteria for imaging. This axis is anchored on NICE NG24
// restrictive thresholds (red-cell threshold 70 g/L, target 70-90 g/L; 80 g/L
// in acute coronary syndrome) and on indication appropriateness. A request
// whose indication matches the requested test/component well, and whose
// haemoglobin context (where given) supports transfusion, scores high.

// Map of indication -> { ideal:[requestType], plausible:[requestType] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_REQUEST_MAP = {
  'surgery':                { ideal: ['group-and-save', 'crossmatch'], plausible: ['antibody-screen'] },
  'acute-bleeding':         { ideal: ['crossmatch', 'emergency-o-negative'], plausible: ['group-and-save'] },
  'anaemia':                { ideal: ['crossmatch', 'group-and-save'], plausible: ['antibody-screen'] },
  'obstetric-haemorrhage':  { ideal: ['crossmatch', 'emergency-o-negative'], plausible: ['group-and-save'] },
  'chemotherapy-support':   { ideal: ['crossmatch', 'group-and-save'], plausible: ['antibody-screen'] },
  'transfusion-dependent':  { ideal: ['crossmatch', 'group-and-save'], plausible: ['antibody-screen'] },
  'other':                  { ideal: [], plausible: [] }
};

// NICE NG24 restrictive red-cell thresholds, expressed in g/L.
const HB_THRESHOLD_DEFAULT = 70;
const HB_THRESHOLD_ACS = 80;

/**
 * Score appropriateness (1-9) for an indication x requestType pairing,
 * adjusted by NICE NG24 haemoglobin thresholds where a current haemoglobin
 * has been supplied. Defaults to a neutral may-be-appropriate when the
 * indication or request type has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(data) {
  const indication = data.indication.primaryIndication;
  const requestType = data.request.requestType;

  if (!indication || !requestType) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or request type not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_REQUEST_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');
  let score;
  let firedRule;

  if (map.ideal.includes(requestType)) {
    score = 8;
    firedRule = {
      ruleId: `R-APPROP-${indicationKey}-IDEAL`,
      axis: 'appropriateness',
      category: indication,
      description: `Requested ${requestType} is the recommended test for "${indication}".`
    };
  } else if (map.plausible.includes(requestType)) {
    score = 5;
    firedRule = {
      ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
      axis: 'appropriateness',
      category: indication,
      description: `Requested ${requestType} may be appropriate for "${indication}" but is not the first-line test.`
    };
  } else if (indication === 'other') {
    score = 5;
    firedRule = {
      ruleId: 'R-APPROP-OTHER',
      axis: 'appropriateness',
      category: 'other',
      description: 'Indication recorded as "other"; appropriateness requires clinician vetting.'
    };
  } else {
    score = 2;
    firedRule = {
      ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
      axis: 'appropriateness',
      category: indication,
      description: `Requested ${requestType} is not usually appropriate for "${indication}"; query the referrer.`
    };
  }

  // NICE NG24 restrictive-threshold adjustment for red-cell transfusion when a
  // non-bleeding indication and a current haemoglobin are supplied.
  const hb = data.indication.currentHaemoglobin;
  const isRedCell = data.request.component === 'red-cells' ||
    requestType === 'crossmatch' || requestType === 'emergency-o-negative';
  const isNonBleeding = indication === 'anaemia' ||
    indication === 'chemotherapy-support' || indication === 'transfusion-dependent';
  if (hb !== null && hb !== undefined && hb !== '' && isRedCell && isNonBleeding) {
    const threshold = data.indication.acuteCoronarySyndrome
      ? HB_THRESHOLD_ACS : HB_THRESHOLD_DEFAULT;
    const hbNum = Number(hb);
    if (!Number.isNaN(hbNum)) {
      if (hbNum > threshold + 20) {
        score = Math.min(score, 2);
        firedRule = {
          ruleId: 'R-APPROP-NG24-ABOVE-THRESHOLD',
          axis: 'appropriateness',
          category: indication,
          description: `Current haemoglobin ${hbNum} g/L is well above the NICE NG24 restrictive threshold (${threshold} g/L); red-cell transfusion is usually not appropriate.`
        };
      } else if (hbNum > threshold) {
        score = Math.min(score, 5);
        firedRule = {
          ruleId: 'R-APPROP-NG24-NEAR-THRESHOLD',
          axis: 'appropriateness',
          category: indication,
          description: `Current haemoglobin ${hbNum} g/L is above the NICE NG24 restrictive threshold (${threshold} g/L); consider alternatives before transfusing.`
        };
      } else {
        firedRule = {
          ruleId: 'R-APPROP-NG24-BELOW-THRESHOLD',
          axis: 'appropriateness',
          category: indication,
          description: `Current haemoglobin ${hbNum} g/L is at or below the NICE NG24 restrictive threshold (${threshold} g/L); transfusion is appropriate.`
        };
      }
    }
  }

  return { score, band: appropriatenessBand(score), firedRule };
}

/** Map a 1-9 appropriateness score to its band. */
function appropriatenessBand(score) {
  if (score >= 7) return 'usually-appropriate';
  if (score >= 4) return 'may-be-appropriate';
  return 'usually-not-appropriate';
}

// ----------------------------------------------------------------------
// Axis B — Identity / sample safety (BSH / SHOT)
// ----------------------------------------------------------------------
//
// Driven by positive patient identification, the BSH / SHOT two-sample
// (group-check) rule, and the labelling check. Band: ok / caution /
// reject-risk. A request that needs compatibility testing (anything other
// than a sample-only test or emergency O-negative) but has not satisfied the
// two-sample rule is at reject-risk; missing labelling or patient-ID checks
// are caution at least.

/**
 * Evaluate identity / sample safety and return the band plus fired rules.
 *
 * @returns {{ band:string, firedRules:object[] }}
 */
function scoreIdentitySafety(data) {
  const firedRules = [];
  let band = 'ok';

  const needsCompatibility =
    data.request.requestType === 'crossmatch' ||
    data.request.requestType === 'group-and-save' ||
    data.request.requestType === 'antibody-screen';
  const sampleCollected = data.sample.sampleCollected === 'yes';

  // Emergency O-negative bypasses pre-transfusion compatibility safety gating.
  if (data.request.requestType === 'emergency-o-negative') {
    firedRules.push({
      ruleId: 'R-IDENTITY-EMERGENCY-BYPASS',
      axis: 'identity',
      category: 'emergency',
      description: 'Emergency O-negative request — issued without full compatibility testing in a life-threatening situation.'
    });
    return { band: 'ok', firedRules };
  }

  if (needsCompatibility && sampleCollected && !data.sample.twoSampleRuleMet) {
    band = worstBand(band, 'reject-risk');
    firedRules.push({
      ruleId: 'R-IDENTITY-TWO-SAMPLE-NOT-MET',
      axis: 'identity',
      category: 'two-sample-rule',
      description: 'BSH / SHOT two-sample (group-check) rule not satisfied; a second independent group sample is required before non-emergency red cells are issued.'
    });
  }

  if (sampleCollected && !data.sample.labellingCheckComplete) {
    band = worstBand(band, 'caution');
    firedRules.push({
      ruleId: 'R-IDENTITY-LABELLING-UNCHECKED',
      axis: 'identity',
      category: 'labelling',
      description: 'Sample labelling check not confirmed; Wrong Blood in Tube (WBIT) risk — verify hand-written, fully-labelled sample against the patient.'
    });
  }

  if (!data.patient.positivePatientIdConfirmed) {
    band = worstBand(band, 'caution');
    firedRules.push({
      ruleId: 'R-IDENTITY-PATIENT-ID-UNCONFIRMED',
      axis: 'identity',
      category: 'patient-id',
      description: 'Positive patient identification not confirmed at the bedside; confirm core identifiers before sampling.'
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-IDENTITY-OK',
      axis: 'identity',
      category: 'ok',
      description: 'Positive patient ID, labelling, and two-sample rule satisfied (where applicable).'
    });
  }

  return { band, firedRules };
}

const IDENTITY_ORDER = ['ok', 'caution', 'reject-risk'];

/** Return whichever of two identity-safety bands is more severe. */
function worstBand(a, b) {
  const ia = IDENTITY_ORDER.indexOf(a);
  const ib = IDENTITY_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------
//
// Each tracked field carries a weight. Indication, blood group, and sample
// status are weighted highest because they drive every other axis.
// Completeness is the percentage of weighted points present.

const COMPLETENESS_FIELDS = [
  { weight: 3, present: (d) => !!d.indication.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
  { weight: 3, present: (d) => !!d.history.patientBloodGroup && d.history.patientBloodGroup !== 'unknown', ruleId: 'R-COMPLETE-BLOOD-GROUP', label: 'patient blood group' },
  { weight: 3, present: (d) => d.sample.sampleCollected === 'yes', ruleId: 'R-COMPLETE-SAMPLE', label: 'sample collected' },
  { weight: 2, present: (d) => !!d.request.requestType, ruleId: 'R-COMPLETE-REQUEST-TYPE', label: 'requested test type' },
  { weight: 2, present: (d) => !!d.request.component, ruleId: 'R-COMPLETE-COMPONENT', label: 'requested component' },
  { weight: 2, present: (d) => !!d.indication.clinicalDetails && d.indication.clinicalDetails.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-DETAILS', label: 'clinical details' },
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
// auto-escalate it. Declared massive / major haemorrhage escalates to stat.
// The most-severe escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent', 'emergency', 'stat'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 24-48 hours',
  'urgent': 'Within 2-4 hours',
  'emergency': 'Within 1 hour',
  'stat': 'Immediate — issue emergency / O-negative blood now'
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
    ruleId: 'R-TRIAGE-MASSIVE-HAEMORRHAGE',
    tier: 'stat',
    fires: (d) => d.triage.massiveHaemorrhage === true,
    description: 'Declared major / massive haemorrhage — activate the major haemorrhage protocol (stat).'
  },
  {
    ruleId: 'R-TRIAGE-EMERGENCY-O-NEGATIVE',
    tier: 'stat',
    fires: (d) => d.request.requestType === 'emergency-o-negative',
    description: 'Emergency O-negative requested before the group is known — issue immediately (stat).'
  },
  {
    ruleId: 'R-TRIAGE-ACTIVE-BLEEDING',
    tier: 'emergency',
    fires: (d) => d.triage.activeUncontrolledBleeding === true,
    description: 'Active uncontrolled bleeding — emergency provision of compatible blood.'
  },
  {
    ruleId: 'R-TRIAGE-INSTABILITY',
    tier: 'emergency',
    fires: (d) => d.triage.haemodynamicallyUnstable === true,
    description: 'Haemodynamic instability — emergency provision of compatible blood.'
  },
  {
    ruleId: 'R-TRIAGE-OBSTETRIC-HAEMORRHAGE',
    tier: 'emergency',
    fires: (d) => d.indication.primaryIndication === 'obstetric-haemorrhage',
    description: 'Obstetric haemorrhage indication — emergency provision.'
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

export { scoreAppropriateness, appropriatenessBand, scoreIdentitySafety, worstBand, scoreCompleteness, scoreTriage, maxTier, TRIAGE_ORDER, IDENTITY_ORDER, TARGET_TIMEFRAMES, INDICATION_REQUEST_MAP, HB_THRESHOLD_DEFAULT, HB_THRESHOLD_ACS };
