// Four-axis rule catalogue for the X-Ray Test Request engine.
//
// Derived from index.md and the SQL migrations:
//   (A) appropriateness 1-9 + band by body region x indication (ACR / RCR
//       iRefer);
//   (B) radiation safety band (safe / caution / contraindicated) using the
//       IR(ME)R 2017 justification + a relative effective-dose band
//       (low / moderate / high) keyed off the body region;
//   (C) request completeness over mandatory fields, indication + clinical
//       question weighted highest;
//   (D) triage tier (routine / urgent / emergency) from the requested urgency
//       with red-flag auto-escalation.
//
// Rule IDs are stable and identical across every front-end and the back-end
// (R-APPROP-*, R-SAFETY-*, R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers; the
// grader composes them.
//
// Wrapped in an IIFE; published via `window.XRayTestRequest`.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACR Appropriateness Criteria / RCR iRefer 1-9)
// ----------------------------------------------------------------------
//
// Each body region has a set of ideal indications (the requests a plain film
// is first-line for) and plausible-but-suboptimal indications. A good pairing
// scores high (7-9, usually-appropriate); a plausible one scores 4-6
// (may-be-appropriate); a clear mismatch scores 1-3 (usually-not-appropriate).

const REGION_INDICATION_MAP = {
  'chest':          { ideal: ['chest-infection', 'suspected-pneumothorax', 'line-position-check', 'pre-operative'], plausible: ['foreign-body', 'follow-up'] },
  'abdomen':        { ideal: ['abdominal-obstruction', 'swallowed-object', 'foreign-body'], plausible: ['follow-up'] },
  'spine-cervical': { ideal: ['trauma-fracture', 'arthritis'], plausible: ['joint-pain', 'follow-up'] },
  'spine-thoracic': { ideal: ['trauma-fracture', 'arthritis'], plausible: ['joint-pain', 'follow-up'] },
  'spine-lumbar':   { ideal: ['trauma-fracture', 'arthritis'], plausible: ['joint-pain', 'follow-up'] },
  'pelvis':         { ideal: ['trauma-fracture', 'joint-pain', 'arthritis'], plausible: ['pre-operative', 'follow-up'] },
  'hip':            { ideal: ['trauma-fracture', 'joint-pain', 'arthritis'], plausible: ['pre-operative', 'follow-up'] },
  'knee':           { ideal: ['trauma-fracture', 'joint-pain'], plausible: ['arthritis', 'foreign-body', 'follow-up'] },
  'ankle-foot':     { ideal: ['trauma-fracture', 'joint-pain', 'foreign-body'], plausible: ['arthritis', 'follow-up'] },
  'shoulder':       { ideal: ['trauma-fracture', 'joint-pain'], plausible: ['arthritis', 'follow-up'] },
  'wrist-hand':     { ideal: ['trauma-fracture', 'joint-pain', 'foreign-body'], plausible: ['arthritis', 'follow-up'] },
  'skull':          { ideal: ['trauma-fracture', 'foreign-body'], plausible: ['follow-up'] },
  'dental':         { ideal: ['arthritis', 'foreign-body', 'follow-up'], plausible: ['trauma-fracture'] },
  'other':          { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for a region x indication pairing and return the
 * fired rule. Defaults to a neutral may-be-appropriate when the region or
 * indication has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(bodyRegion, indication) {
  if (!bodyRegion || !indication) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: bodyRegion || 'unspecified',
        description: 'Body region or indication not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = REGION_INDICATION_MAP[bodyRegion] || { ideal: [], plausible: [] };
  const regionKey = bodyRegion.toUpperCase().replace(/[^A-Z]+/g, '-');

  if (map.ideal.includes(indication)) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${regionKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Plain ${bodyRegion} radiograph is first-line for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(indication)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${regionKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Plain ${bodyRegion} radiograph may be appropriate for "${indication}" but is not first-line.`
      }
    };
  }
  if (bodyRegion === 'other' || indication === 'other') {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-OTHER',
        axis: 'appropriateness',
        category: 'other',
        description: 'Region or indication recorded as "other"; appropriateness requires clinician vetting.'
      }
    };
  }
  return {
    score: 2,
    band: 'usually-not-appropriate',
    firedRule: {
      ruleId: `R-APPROP-${regionKey}-MISMATCH`,
      axis: 'appropriateness',
      category: indication,
      description: `Plain ${bodyRegion} radiograph is not usually appropriate for "${indication}"; query the referrer or consider another modality.`
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
// Axis B — Radiation safety (IR(ME)R 2017) + relative effective-dose band
// ----------------------------------------------------------------------
//
// Each body region carries a relative effective-dose band (low / moderate /
// high). The safety band starts at "safe" and is forced to "caution" or
// "contraindicated" when a radiation-safety concern fires: a possible / known
// pregnancy, a missing IR(ME)R justification (unjustified exposure), or a
// recent duplicate of the same region (repeat exposure). Least-alarming band
// only when no concern fires.

const REGION_DOSE_BAND = {
  'chest': 'low',
  'abdomen': 'moderate',
  'spine-cervical': 'moderate',
  'spine-thoracic': 'moderate',
  'spine-lumbar': 'high',
  'pelvis': 'moderate',
  'hip': 'moderate',
  'knee': 'low',
  'ankle-foot': 'low',
  'shoulder': 'low',
  'wrist-hand': 'low',
  'skull': 'low',
  'dental': 'low',
  'other': 'moderate'
};

const SAFETY_ORDER = ['safe', 'caution', 'contraindicated'];

/** Return whichever of two safety bands is more severe. */
function maxSafetyBand(a, b) {
  const ia = SAFETY_ORDER.indexOf(a);
  const ib = SAFETY_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

/** Relative effective-dose band for a body region. */
function doseBand(bodyRegion) {
  return REGION_DOSE_BAND[bodyRegion] || '';
}

/**
 * Evaluate radiation safety: a band plus the fired safety rules. Higher-dose
 * regions raise the threshold for concern.
 *
 * @returns {{ band:string, doseBand:string, firedRules:object[] }}
 */
function scoreRadiationSafety(data) {
  const region = data.request.bodyRegion;
  const dose = doseBand(region);
  const firedRules = [];
  let band = 'safe';

  const preg = data.safety.pregnancyStatus;
  const highOrModerate = dose === 'high' || dose === 'moderate';

  if (preg === 'pregnant') {
    band = maxSafetyBand(band, highOrModerate ? 'contraindicated' : 'caution');
    firedRules.push({
      ruleId: 'R-SAFETY-PREGNANT',
      axis: 'safety',
      category: 'pregnancy',
      description: highOrModerate
        ? `Confirmed pregnancy with a ${dose}-dose ${region || 'examination'} — exposure to the conceptus must be justified or avoided.`
        : 'Confirmed pregnancy — apply the 28-day / 10-day rule and justify the exposure.'
    });
  } else if (preg === 'possible' || preg === 'unknown') {
    band = maxSafetyBand(band, 'caution');
    firedRules.push({
      ruleId: 'R-SAFETY-POSSIBLE-PREGNANCY',
      axis: 'safety',
      category: 'pregnancy',
      description: 'Pregnancy is possible or unknown — confirm pregnancy status before exposure.'
    });
  }

  if (!data.safety.irMeRJustification || data.safety.irMeRJustification.trim() === '') {
    band = maxSafetyBand(band, 'caution');
    firedRules.push({
      ruleId: 'R-SAFETY-UNJUSTIFIED',
      axis: 'safety',
      category: 'unjustified-exposure',
      description: 'No IR(ME)R justification recorded — the referrer must justify the exposure before it can proceed.'
    });
  }

  if (data.safety.recentSimilarXray === true) {
    band = maxSafetyBand(band, 'caution');
    firedRules.push({
      ruleId: 'R-SAFETY-REPEAT',
      axis: 'safety',
      category: 'repeat-recent-imaging',
      description: 'A similar X-ray of the same region was recently performed — review prior imaging before repeating.'
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-SAFETY-OK',
      axis: 'safety',
      category: 'justified',
      description: dose
        ? `Exposure justified; ${region} carries a ${dose} relative effective dose.`
        : 'No radiation-safety concern fired.'
    });
  }

  return { band, doseBand: dose, firedRules };
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
  { weight: 3, present: (d) => !!d.detail.clinicalQuestion && d.detail.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
  { weight: 2, present: (d) => !!d.request.bodyRegion, ruleId: 'R-COMPLETE-BODY-REGION', label: 'body region' },
  { weight: 2, present: (d) => !!d.request.laterality, ruleId: 'R-COMPLETE-LATERALITY', label: 'laterality' },
  { weight: 2, present: (d) => !!d.safety.irMeRJustification && d.safety.irMeRJustification.trim() !== '', ruleId: 'R-COMPLETE-JUSTIFICATION', label: 'IR(ME)R justification' },
  { weight: 1, present: (d) => !!d.safety.pregnancyStatus, ruleId: 'R-COMPLETE-PREGNANCY-STATUS', label: 'pregnancy status' },
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
// auto-escalate it. The most-severe escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent', 'emergency'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 4-6 weeks',
  'urgent': 'Within 24-72 hours',
  'emergency': 'Same day / immediate'
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
    ruleId: 'R-TRIAGE-PNEUMOTHORAX',
    tier: 'emergency',
    fires: (d) => d.request.primaryIndication === 'suspected-pneumothorax',
    description: 'Suspected pneumothorax — emergency chest radiograph.'
  },
  {
    ruleId: 'R-TRIAGE-LINE-CHECK',
    tier: 'urgent',
    fires: (d) => d.request.primaryIndication === 'line-position-check',
    description: 'Line-position check — expedite before the line is used.'
  },
  {
    ruleId: 'R-TRIAGE-OBSTRUCTION',
    tier: 'urgent',
    fires: (d) => d.request.primaryIndication === 'abdominal-obstruction',
    description: 'Suspected abdominal obstruction — urgent assessment.'
  },
  {
    ruleId: 'R-TRIAGE-SWALLOWED-OBJECT',
    tier: 'urgent',
    fires: (d) => d.request.primaryIndication === 'swallowed-object',
    description: 'Swallowed object — urgent localisation.'
  },
  {
    ruleId: 'R-TRIAGE-TRAUMA',
    tier: 'urgent',
    fires: (d) => d.request.primaryIndication === 'trauma-fracture' && d.practical.setting === 'emergency',
    description: 'Acute trauma in the emergency setting — urgent assessment.'
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

export { scoreAppropriateness, appropriatenessBand, scoreRadiationSafety, doseBand, maxSafetyBand, scoreCompleteness, scoreTriage, maxTier, TRIAGE_ORDER, TARGET_TIMEFRAMES, REGION_INDICATION_MAP, REGION_DOSE_BAND };
