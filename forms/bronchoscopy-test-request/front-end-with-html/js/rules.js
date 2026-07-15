// Four-axis rule catalogue for the Bronchoscopy Test Request engine.
//
// Derived from index.md and the SQL grade tables: (A) appropriateness 1-9 +
// band by indication x procedure (BTS bronchoscopy guidance); (B)
// cancer-pathway urgency tier (NICE NG12 two-week-wait) with massive-
// haemoptysis auto-escalation to emergency and a two_week_wait_eligible flag;
// (C) request completeness over mandatory fields; (D) pre-procedure risk band
// (low/moderate/high) from anticoagulant / antiplatelet, platelet count,
// hypoxia, and ASA grade, with a recommended anticoagulant action. Rule IDs
// are stable and identical across every front-end and the back-end
// (R-APPROP-*, R-URGENCY-*, R-COMPLETE-*, R-RISK-*). Pure data + helpers; the
// grader composes them.
//
// Wrapped in an IIFE; published via `window.BronchoscopyTestRequest`.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (BTS bronchoscopy + indication match, 1-9)
// ----------------------------------------------------------------------
//
// Each indication has an ideal procedure (or set of procedures). When the
// requested procedure matches the indication well, the request scores high
// (7-9, usually-appropriate). Plausible-but-suboptimal pairings score in the
// 4-6 may-be-appropriate band; clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[procedure], plausible:[procedure] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_PROCEDURE_MAP = {
  'suspected-lung-cancer':       { ideal: ['flexible-bronchoscopy', 'ebus'], plausible: ['rigid-bronchoscopy'] },
  'lung-mass-on-imaging':        { ideal: ['flexible-bronchoscopy', 'ebus'], plausible: ['rigid-bronchoscopy', 'bronchoalveolar-lavage'] },
  'mediastinal-lymphadenopathy': { ideal: ['ebus'], plausible: ['flexible-bronchoscopy'] },
  'haemoptysis':                 { ideal: ['flexible-bronchoscopy'], plausible: ['rigid-bronchoscopy', 'ebus'] },
  'persistent-cough':            { ideal: ['flexible-bronchoscopy'], plausible: ['bronchoalveolar-lavage'] },
  'infection-sampling':          { ideal: ['bronchoalveolar-lavage', 'flexible-bronchoscopy'], plausible: ['ebus'] },
  'foreign-body':                { ideal: ['rigid-bronchoscopy'], plausible: ['flexible-bronchoscopy'] },
  'stridor':                     { ideal: ['flexible-bronchoscopy', 'rigid-bronchoscopy'], plausible: ['ebus'] },
  'other':                       { ideal: [], plausible: [] }
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
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  if (map.ideal.includes(procedure)) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${procedure} is the recommended procedure for "${indication}".`
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
        description: `Requested ${procedure} may be appropriate for "${indication}" but is not the first-line procedure.`
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
      description: `Requested ${procedure} is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Cancer-pathway urgency (NICE NG12 two-week-wait)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then NICE NG12
// suspected-cancer rules and emergency red flags escalate it. The most-severe
// escalation wins. Massive haemoptysis or haemodynamic instability auto-
// escalates to emergency regardless of the other axes.

const TRIAGE_ORDER = ['routine', 'urgent', 'two-week-wait', 'emergency'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 6 weeks',
  'urgent': 'Within 1-2 weeks',
  'two-week-wait': 'Within 14 days (NICE NG12)',
  'emergency': 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a, b) {
  const ia = TRIAGE_ORDER.indexOf(a);
  const ib = TRIAGE_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Urgency escalation rules, each forcing at least the given tier.
const URGENCY_RULES = [
  {
    ruleId: 'R-URGENCY-MASSIVE-HAEMOPTYSIS',
    tier: 'emergency',
    fires: (d) => d.symptoms.symptomHaemoptysis === true && d.symptoms.haemoptysisSeverity === 'massive',
    description: 'Massive haemoptysis — emergency airway assessment.'
  },
  {
    ruleId: 'R-URGENCY-INSTABILITY',
    tier: 'emergency',
    fires: (d) => d.procedural.haemodynamicallyUnstable === true,
    description: 'Haemodynamic instability — emergency assessment.'
  },
  {
    ruleId: 'R-URGENCY-STRIDOR',
    tier: 'emergency',
    fires: (d) => d.request.primaryIndication === 'stridor',
    description: 'Stridor — possible critical airway obstruction; emergency assessment.'
  },
  {
    ruleId: 'R-URGENCY-2WW-SUSPECTED-CANCER',
    tier: 'two-week-wait',
    fires: (d) =>
      d.request.primaryIndication === 'suspected-lung-cancer' ||
      d.request.primaryIndication === 'lung-mass-on-imaging',
    description: 'Suspected lung cancer / lung mass on imaging — NICE NG12 two-week-wait pathway.'
  },
  {
    ruleId: 'R-URGENCY-2WW-HAEMOPTYSIS',
    tier: 'two-week-wait',
    fires: (d) => d.request.primaryIndication === 'haemoptysis' || d.symptoms.symptomHaemoptysis === true,
    description: 'Unexplained haemoptysis — NICE NG12 two-week-wait pathway (people aged 40+).'
  },
  {
    ruleId: 'R-URGENCY-WEIGHT-LOSS',
    tier: 'urgent',
    fires: (d) => d.symptoms.symptomWeightLoss === true,
    description: 'Unexplained weight loss — expedite assessment.'
  }
];

// Indications / contexts that make a request two-week-wait eligible under
// NICE NG12 suspected-cancer rules.
function isTwoWeekWaitEligible(data) {
  return (
    data.request.primaryIndication === 'suspected-lung-cancer' ||
    data.request.primaryIndication === 'lung-mass-on-imaging' ||
    data.request.primaryIndication === 'haemoptysis' ||
    data.symptoms.symptomHaemoptysis === true
  );
}

/**
 * Compute the cancer-pathway urgency tier, target timeframe, two-week-wait
 * eligibility, and fired urgency rules.
 *
 * @returns {{ tier:string, targetTimeframe:string, twoWeekWaitEligible:boolean, firedRules:object[] }}
 */
function scoreUrgency(data) {
  const requested = data.triage.urgency || 'routine';
  let tier = TRIAGE_ORDER.includes(requested) ? requested : 'routine';
  const firedRules = [];

  for (const rule of URGENCY_RULES) {
    if (rule.fires(data)) {
      tier = maxTier(tier, rule.tier);
      firedRules.push({
        ruleId: rule.ruleId,
        axis: 'urgency',
        category: 'cancer-pathway',
        description: rule.description
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-URGENCY-REQUESTED',
      axis: 'urgency',
      category: 'requested',
      description: `No escalation rule fired; urgency follows the requested tier (${tier}).`
    });
  }

  return {
    tier,
    targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
    twoWeekWaitEligible: isTwoWeekWaitEligible(data),
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
  { weight: 2, present: (d) => !!d.request.procedure, ruleId: 'R-COMPLETE-PROCEDURE', label: 'requested procedure' },
  { weight: 2, present: (d) => !!d.symptoms.imagingFindings && d.symptoms.imagingFindings.trim() !== '', ruleId: 'R-COMPLETE-IMAGING', label: 'imaging findings' },
  { weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
  { weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
  { weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
  { weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
  { weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
  { weight: 1, present: (d) => !!d.procedural.asaGrade, ruleId: 'R-COMPLETE-ASA', label: 'ASA grade' },
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
// Axis D — Pre-procedure risk (anticoagulation, platelets, hypoxia, ASA)
// ----------------------------------------------------------------------
//
// A base low risk band is escalated by bleeding-risk and procedural-risk
// factors. The most-severe escalation wins. The fired rules also drive the
// recommended anticoagulant management action.

const RISK_ORDER = ['low', 'moderate', 'high'];

/** Return whichever of two risk bands is more severe. */
function maxBand(a, b) {
  const ia = RISK_ORDER.indexOf(a);
  const ib = RISK_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

const LOW_PLATELET_THRESHOLD = 50;       // x10^9/L — high bleeding risk for biopsy
const BORDERLINE_PLATELET_THRESHOLD = 100; // x10^9/L — moderate

const RISK_RULES = [
  {
    ruleId: 'R-RISK-ANTICOAGULANT',
    band: 'high',
    fires: (d) => d.bleeding.takingAnticoagulant === true,
    description: 'Patient on an anticoagulant — high bleeding risk for biopsy.'
  },
  {
    ruleId: 'R-RISK-LOW-PLATELETS',
    band: 'high',
    fires: (d) => d.bleeding.plateletCount !== null && d.bleeding.plateletCount !== undefined && d.bleeding.plateletCount < LOW_PLATELET_THRESHOLD,
    description: `Platelet count below ${LOW_PLATELET_THRESHOLD} x10^9/L — high bleeding risk.`
  },
  {
    ruleId: 'R-RISK-ASA-IV',
    band: 'high',
    fires: (d) => d.procedural.asaGrade === 'IV' || d.procedural.asaGrade === 'V',
    description: 'ASA grade IV or V — high procedural risk; consider anaesthetic support.'
  },
  {
    ruleId: 'R-RISK-HYPOXIA',
    band: 'high',
    fires: (d) => d.procedural.oxygenDependent === true,
    description: 'Oxygen-dependent (hypoxia) — high procedural risk; plan oxygenation strategy.'
  },
  {
    ruleId: 'R-RISK-ANTIPLATELET',
    band: 'moderate',
    fires: (d) => d.bleeding.takingAntiplatelet === true,
    description: 'Patient on an antiplatelet agent — moderate bleeding risk.'
  },
  {
    ruleId: 'R-RISK-BORDERLINE-PLATELETS',
    band: 'moderate',
    fires: (d) => d.bleeding.plateletCount !== null && d.bleeding.plateletCount !== undefined && d.bleeding.plateletCount >= LOW_PLATELET_THRESHOLD && d.bleeding.plateletCount < BORDERLINE_PLATELET_THRESHOLD,
    description: `Platelet count ${LOW_PLATELET_THRESHOLD}-${BORDERLINE_PLATELET_THRESHOLD - 1} x10^9/L — moderate bleeding risk.`
  },
  {
    ruleId: 'R-RISK-ASA-III',
    band: 'moderate',
    fires: (d) => d.procedural.asaGrade === 'III',
    description: 'ASA grade III — moderate procedural risk.'
  }
];

/**
 * Compute the recommended anticoagulant / antiplatelet management action.
 */
function deriveAnticoagulantAction(data) {
  if (data.bleeding.takingAnticoagulant === true) {
    const agent = data.bleeding.anticoagulantAgent
      ? ` (${data.bleeding.anticoagulantAgent})`
      : '';
    return `Withhold the anticoagulant${agent} before the procedure per BTS bleeding-risk guidance; confirm the omission interval and any bridging plan with the responsible team.`;
  }
  if (data.bleeding.takingAntiplatelet === true) {
    const agent = data.bleeding.antiplateletAgent
      ? ` (${data.bleeding.antiplateletAgent})`
      : '';
    return `Review the antiplatelet agent${agent}; aspirin may usually continue, but clopidogrel / dual therapy should be discussed before biopsy.`;
  }
  return 'No anticoagulant or antiplatelet recorded; standard bleeding precautions apply.';
}

/**
 * Compute the pre-procedure risk band, anticoagulant action, and fired rules.
 *
 * @returns {{ band:string, anticoagulantAction:string, firedRules:object[] }}
 */
function scoreRisk(data) {
  let band = 'low';
  const firedRules = [];

  for (const rule of RISK_RULES) {
    if (rule.fires(data)) {
      band = maxBand(band, rule.band);
      firedRules.push({
        ruleId: rule.ruleId,
        axis: 'risk',
        category: 'pre-procedure',
        description: rule.description
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-RISK-LOW',
      axis: 'risk',
      category: 'pre-procedure',
      description: 'No bleeding or procedural risk factors recorded; pre-procedure risk is low.'
    });
  }

  return {
    band,
    anticoagulantAction: deriveAnticoagulantAction(data),
    firedRules
  };
}

export { scoreAppropriateness, appropriatenessBand, scoreUrgency, scoreCompleteness, scoreRisk, isTwoWeekWaitEligible, deriveAnticoagulantAction, maxTier, maxBand, TRIAGE_ORDER, TARGET_TIMEFRAMES, RISK_ORDER, INDICATION_PROCEDURE_MAP };
