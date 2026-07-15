// Four-axis rule catalogue for the Biopsy Test Request engine.
//
// Derived from index.md and SQL migration 05/06: (A) appropriateness 1-9 + band
// by indication x biopsy site; (B) periprocedural bleeding-risk band
// (low/moderate/high) from anticoagulant / antiplatelet use, INR, platelet
// count, and bleeding disorder, plus a recommended anticoagulant action;
// (C) request completeness over mandatory fields; (D) urgency / cancer-pathway
// triage with two-week-wait eligibility. Rule IDs are stable and identical
// across every front-end and the back-end (R-APPROP-*, R-BLEED-*,
// R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers; the grader composes them.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACR Appropriateness Criteria 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal biopsy site (or set of sites). When the
// requested site matches the indication well, the request scores high
// (7-9, usually-appropriate). Plausible-but-suboptimal pairings score in the
// 4-6 may-be-appropriate band; clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[biopsySite], plausible:[biopsySite] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_SITE_MAP = {
  'suspected-malignancy':  { ideal: ['skin', 'breast', 'prostate', 'lung', 'gi-tract', 'lymph-node', 'soft-tissue', 'thyroid', 'bone-marrow'], plausible: ['liver', 'kidney'] },
  'cancer-staging':        { ideal: ['lymph-node', 'breast', 'liver', 'bone-marrow'], plausible: ['lung', 'soft-tissue', 'skin'] },
  'suspected-infection':   { ideal: ['lung', 'liver'], plausible: ['lymph-node', 'kidney', 'skin', 'bone-marrow'] },
  'inflammatory-disease':  { ideal: ['kidney', 'gi-tract', 'liver'], plausible: ['skin', 'soft-tissue'] },
  'transplant-monitoring': { ideal: ['kidney', 'liver'], plausible: ['bone-marrow'] },
  'lymphadenopathy':       { ideal: ['lymph-node'], plausible: ['bone-marrow', 'soft-tissue'] },
  'characterise-lesion':   { ideal: ['skin', 'liver', 'thyroid', 'soft-tissue', 'bone-marrow'], plausible: ['breast', 'kidney', 'lung', 'lymph-node'] },
  'other':                 { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x biopsySite pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or site has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, biopsySite) {
  if (!indication || !biopsySite) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or biopsy site not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_SITE_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  if (map.ideal.includes(biopsySite)) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `A ${biopsySite} biopsy is a recommended target for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(biopsySite)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `A ${biopsySite} biopsy may be appropriate for "${indication}" but is not first-line.`
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
      description: `A ${biopsySite} biopsy is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Periprocedural bleeding risk (BSG / ESGE & BSIR stratification)
// ----------------------------------------------------------------------
//
// A diagnostic biopsy is a low-bleeding-risk procedure at baseline. Active
// anticoagulation, antiplatelet therapy, a raised INR, thrombocytopenia, or a
// known bleeding disorder escalate the band. The most-severe escalation wins,
// and a periprocedural anticoagulant action is recommended.

const BLEEDING_ORDER = ['low', 'moderate', 'high'];

/** Return whichever of two bleeding-risk bands is more severe. */
function maxBand(a, b) {
  const ia = BLEEDING_ORDER.indexOf(a);
  const ib = BLEEDING_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Each rule forces at least the given band when it fires.
const BLEEDING_RULES = [
  {
    ruleId: 'R-BLEED-DISORDER',
    band: 'high',
    fires: (d) => d.bleeding.bleedingDisorder === true,
    category: 'coagulopathy',
    description: 'Known bleeding disorder / coagulopathy — high periprocedural bleeding risk.'
  },
  {
    ruleId: 'R-BLEED-INR-HIGH',
    band: 'high',
    fires: (d) => d.bleeding.inr !== null && d.bleeding.inr !== undefined && d.bleeding.inr !== '' && Number(d.bleeding.inr) >= 1.5,
    category: 'coagulopathy',
    description: 'INR ≥ 1.5 — correction usually required before biopsy (high risk).'
  },
  {
    ruleId: 'R-BLEED-PLATELETS-LOW',
    band: 'high',
    fires: (d) => d.bleeding.plateletCount !== null && d.bleeding.plateletCount !== undefined && d.bleeding.plateletCount !== '' && Number(d.bleeding.plateletCount) < 50,
    category: 'thrombocytopenia',
    description: 'Platelet count < 50 ×10⁹/L — severe thrombocytopenia (high risk).'
  },
  {
    ruleId: 'R-BLEED-ANTICOAG',
    band: 'high',
    fires: (d) => d.bleeding.takingAnticoagulant === true,
    category: 'anticoagulant',
    description: 'Patient on an anticoagulant — high periprocedural bleeding risk.'
  },
  {
    ruleId: 'R-BLEED-PLATELETS-BORDERLINE',
    band: 'moderate',
    fires: (d) => d.bleeding.plateletCount !== null && d.bleeding.plateletCount !== undefined && d.bleeding.plateletCount !== '' && Number(d.bleeding.plateletCount) >= 50 && Number(d.bleeding.plateletCount) < 100,
    category: 'thrombocytopenia',
    description: 'Platelet count 50–99 ×10⁹/L — borderline thrombocytopenia (moderate risk).'
  },
  {
    ruleId: 'R-BLEED-INR-BORDERLINE',
    band: 'moderate',
    fires: (d) => d.bleeding.inr !== null && d.bleeding.inr !== undefined && d.bleeding.inr !== '' && Number(d.bleeding.inr) >= 1.3 && Number(d.bleeding.inr) < 1.5,
    category: 'coagulopathy',
    description: 'INR 1.3–1.49 — mildly deranged clotting (moderate risk).'
  },
  {
    ruleId: 'R-BLEED-ANTIPLATELET',
    band: 'moderate',
    fires: (d) => d.bleeding.takingAntiplatelet === true,
    category: 'antiplatelet',
    description: 'Patient on an antiplatelet agent — moderate periprocedural bleeding risk.'
  }
];

/**
 * Compute the bleeding-risk band, recommended anticoagulant action, and fired
 * bleeding rules.
 *
 * @returns {{ band:string, anticoagulantAction:string, firedRules:object[] }}
 */
function scoreBleedingRisk(data) {
  let band = 'low';
  const firedRules = [];

  for (const rule of BLEEDING_RULES) {
    if (rule.fires(data)) {
      band = maxBand(band, rule.band);
      firedRules.push({
        ruleId: rule.ruleId,
        axis: 'bleeding-risk',
        category: rule.category,
        description: rule.description
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-BLEED-BASELINE',
      axis: 'bleeding-risk',
      category: 'baseline',
      description: 'No anticoagulant / antiplatelet, normal coagulation — baseline low bleeding risk.'
    });
  }

  return {
    band,
    anticoagulantAction: anticoagulantAction(band, data),
    firedRules
  };
}

/** Recommend a periprocedural anticoagulant / antiplatelet action for the band. */
function anticoagulantAction(band, data) {
  if (band === 'high') {
    const parts = [];
    if (data.bleeding.takingAnticoagulant) {
      parts.push(`withhold the anticoagulant${data.bleeding.anticoagulantAgent ? ` (${data.bleeding.anticoagulantAgent})` : ''} per BSG / ESGE timing and consider bridging`);
    }
    if (data.bleeding.bleedingDisorder) parts.push('liaise with haematology and arrange factor / product cover');
    if (data.bleeding.inr !== null && data.bleeding.inr !== undefined && data.bleeding.inr !== '' && Number(data.bleeding.inr) >= 1.5) parts.push('correct the INR to < 1.5');
    if (data.bleeding.plateletCount !== null && data.bleeding.plateletCount !== undefined && data.bleeding.plateletCount !== '' && Number(data.bleeding.plateletCount) < 50) parts.push('transfuse platelets to ≥ 50 ×10⁹/L');
    if (parts.length === 0) parts.push('optimise coagulation before the procedure');
    return `High bleeding risk: ${parts.join('; ')}.`;
  }
  if (band === 'moderate') {
    const parts = [];
    if (data.bleeding.takingAntiplatelet) parts.push(`review the antiplatelet${data.bleeding.antiplateletAgent ? ` (${data.bleeding.antiplateletAgent})` : ''}; continue aspirin but consider withholding a P2Y12 inhibitor`);
    parts.push('confirm a recent platelet count and clotting screen');
    return `Moderate bleeding risk: ${parts.join('; ')}.`;
  }
  return 'Low bleeding risk: proceed without specific anticoagulant action; standard haemostasis precautions.';
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
  { weight: 2, present: (d) => !!d.procedure.biopsySite, ruleId: 'R-COMPLETE-BIOPSY-SITE', label: 'biopsy site' },
  { weight: 2, present: (d) => !!d.procedure.biopsyMethod, ruleId: 'R-COMPLETE-BIOPSY-METHOD', label: 'biopsy method' },
  { weight: 1, present: (d) => !!d.lesion.lesionDescription && d.lesion.lesionDescription.trim() !== '', ruleId: 'R-COMPLETE-LESION', label: 'lesion description' },
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
// Axis D — Urgency / cancer-pathway triage (NICE NG12)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency. A suspected-
// malignancy or cancer-staging indication makes the request two-week-wait
// eligible and escalates at least to the two-week-wait tier. The most-severe
// escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent', 'two-week-wait', 'emergency'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 6 weeks',
  'urgent': 'Within 1-2 weeks',
  'two-week-wait': 'Within 14 days (suspected-cancer pathway)',
  'emergency': 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a, b) {
  const ia = TRIAGE_ORDER.indexOf(a);
  const ib = TRIAGE_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Indications that meet NICE NG12 suspected-cancer two-week-wait eligibility.
const TWO_WEEK_WAIT_INDICATIONS = ['suspected-malignancy', 'cancer-staging'];

/**
 * Compute the triage tier, target timeframe, two-week-wait eligibility, and
 * fired triage rules.
 *
 * @returns {{ tier:string, targetTimeframe:string, twoWeekWaitEligible:boolean, firedRules:object[] }}
 */
function scoreTriage(data) {
  const requested = data.triage.urgency || 'routine';
  let tier = TRIAGE_ORDER.includes(requested) ? requested : 'routine';
  const firedRules = [];
  let twoWeekWaitEligible = false;

  if (TWO_WEEK_WAIT_INDICATIONS.includes(data.indication.primaryIndication)) {
    twoWeekWaitEligible = true;
    tier = maxTier(tier, 'two-week-wait');
    firedRules.push({
      ruleId: 'R-TRIAGE-SUSPECTED-CANCER',
      axis: 'urgency',
      category: 'suspected-cancer',
      description: `A "${data.indication.primaryIndication}" indication meets NICE NG12 two-week-wait eligibility.`
    });
  }

  if (data.triage.urgency === 'emergency') {
    tier = maxTier(tier, 'emergency');
    firedRules.push({
      ruleId: 'R-TRIAGE-EMERGENCY',
      axis: 'urgency',
      category: 'requested',
      description: 'Emergency urgency requested — same-day assessment.'
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-TRIAGE-REQUESTED',
      axis: 'urgency',
      category: 'requested',
      description: `No cancer-pathway escalation; triage follows the requested urgency (${tier}).`
    });
  }

  return {
    tier,
    targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
    twoWeekWaitEligible,
    firedRules
  };
}

export { scoreAppropriateness, appropriatenessBand, scoreBleedingRisk, anticoagulantAction, scoreCompleteness, scoreTriage, maxBand, maxTier, BLEEDING_ORDER, TRIAGE_ORDER, TARGET_TIMEFRAMES, INDICATION_SITE_MAP, TWO_WEEK_WAIT_INDICATIONS };
