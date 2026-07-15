// Four-axis rule catalogue for the Endoscopy Test Request engine.
//
// Derived from index.md and the SQL migrations: (A) appropriateness 1-9 + band
// by indication x procedure; (B) cancer-pathway urgency / triage tier with
// NICE NG12 / DG56 two-week-wait escalation and acute-bleed emergency
// escalation; (C) request completeness over mandatory fields; (D)
// pre-procedure risk (Glasgow-Blatchford 0-23 + Rockall 0-11 + BSG/ESGE
// anticoagulant stratification). Rule IDs are stable and identical across
// every front-end and the back-end (R-APPROP-*, R-URGENCY-*, R-COMPLETE-*,
// R-RISK-*). The axis enum values match SQL migration 06:
// appropriateness | urgency | completeness | risk.
//
// Wrapped in an IIFE; published via `window.EndoscopyTestRequest`.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACR / ASGE-AUC / EPAGE 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal procedure (or set) and a set of
// plausible-but-suboptimal procedures. A good match scores 7-9
// (usually-appropriate); a plausible match scores 4-6 (may-be-appropriate);
// a clear mismatch scores 1-3 (usually-not-appropriate).

const INDICATION_PROCEDURE_MAP = {
  'dyspepsia':                { ideal: ['ogd', 'gastroscopy'], plausible: [] },
  'gord':                     { ideal: ['ogd', 'gastroscopy'], plausible: [] },
  'dysphagia':                { ideal: ['ogd', 'gastroscopy'], plausible: ['eus'] },
  'upper-gi-bleeding':        { ideal: ['ogd', 'gastroscopy'], plausible: ['capsule'] },
  'iron-deficiency-anaemia':  { ideal: ['ogd', 'gastroscopy', 'colonoscopy'], plausible: ['capsule'] },
  'weight-loss':              { ideal: ['ogd', 'gastroscopy', 'colonoscopy'], plausible: ['eus'] },
  'suspected-malignancy':     { ideal: ['ogd', 'gastroscopy', 'colonoscopy', 'eus'], plausible: ['flexible-sigmoidoscopy'] },
  'barretts-surveillance':    { ideal: ['ogd', 'gastroscopy'], plausible: [] },
  'h-pylori':                 { ideal: ['ogd', 'gastroscopy'], plausible: [] },
  'rectal-bleeding':          { ideal: ['colonoscopy', 'flexible-sigmoidoscopy'], plausible: [] },
  'change-in-bowel-habit':    { ideal: ['colonoscopy'], plausible: ['flexible-sigmoidoscopy'] },
  'positive-fit':             { ideal: ['colonoscopy'], plausible: ['flexible-sigmoidoscopy'] },
  'ibd-surveillance':         { ideal: ['colonoscopy'], plausible: ['flexible-sigmoidoscopy'] },
  'polyp-surveillance':       { ideal: ['colonoscopy'], plausible: ['flexible-sigmoidoscopy'] },
  'abnormal-imaging':         { ideal: ['colonoscopy', 'ogd', 'gastroscopy', 'ercp', 'eus'], plausible: ['flexible-sigmoidoscopy', 'capsule'] },
  'other':                    { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x procedure pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or procedure has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, procedure) {
  if (!indication || !procedure) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or procedure not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_PROCEDURE_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z0-9]+/g, '-');

  if (map.ideal.includes(procedure)) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${procedure} procedure is the recommended examination for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(procedure)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${procedure} procedure may be appropriate for "${indication}" but is not the first-line examination.`
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
      description: `Requested ${procedure} procedure is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Cancer-pathway urgency / triage tier (NICE NG12 / DG56)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then
// suspected-cancer (2WW) criteria and acute red-flags escalate it. The
// most-severe escalation wins. Two-week-wait eligibility and rationale are
// reported alongside the tier.

const TRIAGE_ORDER = ['routine', 'urgent', 'two-week-wait', 'emergency'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 6 weeks',
  'urgent': 'Within 2 weeks',
  'two-week-wait': '<= 14 days (2WW)',
  'emergency': 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a, b) {
  const ia = TRIAGE_ORDER.indexOf(a);
  const ib = TRIAGE_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Emergency escalation: acute GI bleeding is treated as an acute red-flag.
const EMERGENCY_RULES = [
  {
    ruleId: 'R-URGENCY-ACUTE-GI-BLEED',
    fires: (d) => d.redFlags.redFlagGiBleeding === true && d.request.primaryIndication === 'upper-gi-bleeding',
    description: 'Active upper-GI bleeding — emergency assessment and admission.'
  }
];

// NICE NG12 / DG56 two-week-wait suspected-cancer criteria.
const TWO_WEEK_WAIT_RULES = [
  {
    ruleId: 'R-URGENCY-2WW-DYSPHAGIA',
    fires: (d) => d.redFlags.redFlagDysphagia === true,
    rationale: 'Dysphagia at any age (NICE NG12) — offer urgent upper-GI endoscopy.'
  },
  {
    ruleId: 'R-URGENCY-2WW-AGE-WEIGHT-LOSS',
    fires: (d) => d.redFlags.redFlagAgeOver55 === true && d.redFlags.redFlagWeightLoss === true,
    rationale: 'Age >= 55 with weight loss plus upper-GI symptoms (NICE NG12) — urgent endoscopy.'
  },
  {
    ruleId: 'R-URGENCY-2WW-SUSPECTED-MALIGNANCY',
    fires: (d) => d.request.primaryIndication === 'suspected-malignancy',
    rationale: 'Suspected GI malignancy — suspected-cancer two-week-wait pathway.'
  },
  {
    ruleId: 'R-URGENCY-2WW-POSITIVE-FIT',
    fires: (d) =>
      d.request.primaryIndication === 'positive-fit' ||
      (typeof d.redFlags.fitResultUgG === 'number' && d.redFlags.fitResultUgG >= 10),
    rationale: 'FIT >= 10 ug Hb/g (NICE DG56) — colorectal-cancer two-week-wait pathway.'
  },
  {
    ruleId: 'R-URGENCY-2WW-ABDOMINAL-MASS',
    fires: (d) => d.redFlags.redFlagAbdominalMass === true,
    rationale: 'Palpable abdominal / epigastric mass (NICE NG12) — suspected-cancer pathway.'
  }
];

/**
 * Compute the triage tier, target timeframe, two-week-wait eligibility and
 * rationale, and the fired urgency rules.
 *
 * @returns {{
 *   tier:string, targetTimeframe:string,
 *   twoWeekWaitEligible:boolean, twoWeekWaitRationale:string,
 *   firedRules:object[]
 * }}
 */
function scoreUrgency(data) {
  const requested = data.triage.urgency || 'routine';
  let tier = TRIAGE_ORDER.includes(requested) && requested !== '' ? requested : 'routine';
  const firedRules = [];
  let twoWeekWaitEligible = false;
  const rationales = [];

  for (const rule of EMERGENCY_RULES) {
    if (rule.fires(data)) {
      tier = maxTier(tier, 'emergency');
      firedRules.push({
        ruleId: rule.ruleId,
        axis: 'urgency',
        category: 'acute-red-flag',
        description: rule.description
      });
    }
  }

  for (const rule of TWO_WEEK_WAIT_RULES) {
    if (rule.fires(data)) {
      twoWeekWaitEligible = true;
      tier = maxTier(tier, 'two-week-wait');
      rationales.push(rule.rationale);
      firedRules.push({
        ruleId: rule.ruleId,
        axis: 'urgency',
        category: 'two-week-wait',
        description: rule.rationale
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-URGENCY-REQUESTED',
      axis: 'urgency',
      category: 'requested',
      description: `No suspected-cancer or acute criteria; triage follows the requested urgency (${tier}).`
    });
  }

  return {
    tier,
    targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
    twoWeekWaitEligible,
    twoWeekWaitRationale: rationales.join(' '),
    firedRules
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
  { weight: 2, present: (d) => !!d.request.requestedProcedure, ruleId: 'R-COMPLETE-PROCEDURE', label: 'requested procedure' },
  { weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
  { weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
  { weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
  { weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
  { weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
  { weight: 1, present: (d) => !!d.triage.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' },
  { weight: 1, present: (d) => fitPresentForLowerGi(d), ruleId: 'R-COMPLETE-FIT', label: 'FIT result (for lower-GI indications)' }
];

// FIT is only "missing" for lower-GI indications where DG56 applies.
const LOWER_GI_INDICATIONS = [
  'rectal-bleeding', 'change-in-bowel-habit', 'positive-fit',
  'ibd-surveillance', 'polyp-surveillance'
];

function fitPresentForLowerGi(d) {
  if (!LOWER_GI_INDICATIONS.includes(d.request.primaryIndication)) return true;
  return d.redFlags.fitResultUgG !== null && d.redFlags.fitResultUgG !== undefined && d.redFlags.fitResultUgG !== '';
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
// Axis D — Pre-procedure risk (Glasgow-Blatchford + Rockall + anticoag)
// ----------------------------------------------------------------------
//
// A simplified Glasgow-Blatchford bleeding score (0-23) and pre-endoscopy
// Rockall score (0-11) are computed from the available fields, then combined
// with the BSG/ESGE anticoagulant / antiplatelet stratification into a low /
// moderate / high risk band plus a recommended anticoagulant action.

/**
 * Simplified Glasgow-Blatchford score from haemoglobin, GI bleeding flag, and
 * cardiac/renal comorbidity. Bounded 0-23.
 */
function glasgowBlatchford(data) {
  let score = 0;
  const hb = data.redFlags.haemoglobinGL;
  if (typeof hb === 'number') {
    if (hb < 100) score += 6;
    else if (hb < 120) score += 3;
    else if (hb < 130) score += 1;
  }
  if (data.redFlags.redFlagGiBleeding === true) score += 2;
  if (data.redFlags.redFlagAnaemia === true) score += 1;
  if (data.comorbidities.chronicKidneyDisease === true) score += 2;
  if (data.comorbidities.cardiacNyhaClass === 'III' || data.comorbidities.cardiacNyhaClass === 'IV') score += 2;
  return Math.min(score, 23);
}

/**
 * Simplified pre-endoscopy Rockall score from age flag, GI bleeding, and
 * comorbidity. Bounded 0-11.
 */
function rockall(data) {
  let score = 0;
  if (data.redFlags.redFlagAgeOver55 === true) score += 1;
  if (data.redFlags.redFlagGiBleeding === true) score += 1;
  if (data.comorbidities.cardiacNyhaClass === 'III' || data.comorbidities.cardiacNyhaClass === 'IV') score += 2;
  if (data.comorbidities.chronicKidneyDisease === true) score += 2;
  if (data.comorbidities.asaGrade === 'IV' || data.comorbidities.asaGrade === 'V') score += 3;
  else if (data.comorbidities.asaGrade === 'III') score += 1;
  return Math.min(score, 11);
}

// High-bleeding-risk procedures per BSG/ESGE.
const HIGH_RISK_PROCEDURES = ['ercp', 'eus'];

/**
 * Compute the risk band, the Glasgow-Blatchford and Rockall scores, the
 * anticoagulant action text, and the fired risk rules.
 *
 * @returns {{
 *   riskBand:string, glasgowBlatchfordScore:number, rockallScore:number,
 *   anticoagulantAction:string, firedRules:object[]
 * }}
 */
function scoreRisk(data) {
  const firedRules = [];
  const gbs = glasgowBlatchford(data);
  const rs = rockall(data);

  let band = 'low';
  const highProcedure = HIGH_RISK_PROCEDURES.includes(data.request.requestedProcedure);
  const onAnticoag = data.medication.takingAnticoagulant === true;
  const onDualAntiplatelet =
    data.medication.takingAntiplatelet === true &&
    (data.medication.antiplateletAgent === 'dual' ||
      data.medication.antiplateletAgent === 'clopidogrel' ||
      data.medication.antiplateletAgent === 'ticagrelor' ||
      data.medication.antiplateletAgent === 'prasugrel');

  // Band from scores.
  if (gbs >= 7 || rs >= 5) {
    band = 'high';
    firedRules.push({
      ruleId: 'R-RISK-SCORE-HIGH',
      axis: 'risk',
      category: 'bleeding-score',
      description: `Glasgow-Blatchford ${gbs} / Rockall ${rs} — high bleeding / mortality risk.`
    });
  } else if (gbs >= 3 || rs >= 2) {
    band = 'moderate';
    firedRules.push({
      ruleId: 'R-RISK-SCORE-MODERATE',
      axis: 'risk',
      category: 'bleeding-score',
      description: `Glasgow-Blatchford ${gbs} / Rockall ${rs} — moderate bleeding risk.`
    });
  } else {
    firedRules.push({
      ruleId: 'R-RISK-SCORE-LOW',
      axis: 'risk',
      category: 'bleeding-score',
      description: `Glasgow-Blatchford ${gbs} / Rockall ${rs} — low bleeding risk.`
    });
  }

  // Anticoagulant stratification escalates the band on high-risk procedures.
  let anticoagulantAction = 'No anticoagulant / antiplatelet management required.';
  if (onAnticoag) {
    const agent = data.medication.anticoagulantAgent || 'anticoagulant';
    if (highProcedure || gbs >= 7) {
      band = 'high';
      firedRules.push({
        ruleId: 'R-RISK-ANTICOAG-HIGH-PROCEDURE',
        axis: 'risk',
        category: 'anticoagulant',
        description: `On ${agent} for a high-bleeding-risk procedure — BSG/ESGE peri-procedure plan required.`
      });
      anticoagulantAction = agent === 'warfarin'
        ? 'Warfarin: stop 5 days pre-procedure, check INR, bridge if high thrombotic risk per BSG/ESGE.'
        : `DOAC (${agent}): omit on the day (and the day before for high-risk procedures) per BSG/ESGE; confirm renal function.`;
    } else {
      if (band === 'low') band = 'moderate';
      firedRules.push({
        ruleId: 'R-RISK-ANTICOAG-LOW-PROCEDURE',
        axis: 'risk',
        category: 'anticoagulant',
        description: `On ${agent} for a low-bleeding-risk procedure — may continue per BSG/ESGE.`
      });
      anticoagulantAction = `On ${agent}: low-bleeding-risk procedure — anticoagulation may usually continue (confirm per BSG/ESGE).`;
    }
  } else if (onDualAntiplatelet) {
    if (highProcedure && band === 'low') band = 'moderate';
    firedRules.push({
      ruleId: 'R-RISK-ANTIPLATELET',
      axis: 'risk',
      category: 'antiplatelet',
      description: `On ${data.medication.antiplateletAgent} antiplatelet therapy — review per BSG/ESGE for high-risk procedures.`
    });
    anticoagulantAction = `On ${data.medication.antiplateletAgent}: continue aspirin; review thienopyridine / dual therapy with cardiology for high-risk procedures.`;
  }

  if (data.comorbidities.asaGrade === 'IV' || data.comorbidities.asaGrade === 'V') {
    band = 'high';
    firedRules.push({
      ruleId: 'R-RISK-ASA-HIGH',
      axis: 'risk',
      category: 'asa',
      description: `ASA grade ${data.comorbidities.asaGrade} — high peri-procedure risk; consultant-led sedation planning.`
    });
  }

  return {
    riskBand: band,
    glasgowBlatchfordScore: gbs,
    rockallScore: rs,
    anticoagulantAction,
    firedRules
  };
}

export { scoreAppropriateness, appropriatenessBand, scoreUrgency, scoreCompleteness, scoreRisk, maxTier, glasgowBlatchford, rockall, TRIAGE_ORDER, TARGET_TIMEFRAMES, INDICATION_PROCEDURE_MAP, HIGH_RISK_PROCEDURES };
