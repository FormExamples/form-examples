// Four-axis rule catalogue for the Neurodiversity Adjustment Request engine.
//
// Derived from spec/index.md, the canonical engine spec, and the SQL grade
// tables: (A) Equality Act 2010 eligibility band from the neurodivergent
// profile and its impact; (B) impact / wellbeing band ok / caution / high-risk
// from absence risk, current impact, and burnout; (C) request completeness over
// mandatory fields (profile, difficulties, and requested adjustments weighted
// highest); (D) handling priority with absence-risk / severe-impact
// auto-escalation. Rule IDs are stable and identical across every front-end and
// the back-end (R-ELIG-*, R-IMPACT-*, R-COMPLETE-*, R-PRIORITY-*). Pure data +
// helpers; the grader composes them.
//
// Wrapped in an IIFE; published via `window.NeurodiversityAdjustmentRequest`.

(function () {
'use strict';
window.NeurodiversityAdjustmentRequest =
  window.NeurodiversityAdjustmentRequest || {};
const NS = window.NeurodiversityAdjustmentRequest;

// ----------------------------------------------------------------------
// Shared helpers
// ----------------------------------------------------------------------

/** True when any of the 7 condition flags is set or an "other" condition is described. */
function anyCondition(d) {
  const p = d.profile;
  return (
    p.conditionAdhd === true ||
    p.conditionAutism === true ||
    p.conditionDyslexia === true ||
    p.conditionDyspraxia === true ||
    p.conditionDyscalculia === true ||
    p.conditionTourettes === true ||
    p.conditionOther === true ||
    (typeof p.conditionOtherDetail === 'string' && p.conditionOtherDetail.trim() !== '')
  );
}

/** True when any of the 8 functional-difficulty flags is set. */
function anyDifficulty(d) {
  const f = d.difficulties;
  return (
    f.difficultyConcentration === true ||
    f.difficultyWrittenCommunication === true ||
    f.difficultyOrganisationTime === true ||
    f.difficultySensoryOverload === true ||
    f.difficultyBalanceCoordination === true ||
    f.difficultySocialCommunication === true ||
    f.difficultyMemory === true ||
    f.difficultyBurnoutWellbeing === true
  );
}

/** True when any of the 8 requested-adjustment flags is set. */
function anyAdjustment(d) {
  const a = d.adjustments;
  return (
    a.adjustmentWorkingEnvironment === true ||
    a.adjustmentEquipmentTechnology === true ||
    a.adjustmentWorkingArrangements === true ||
    a.adjustmentCommunication === true ||
    a.adjustmentSupportMentoring === true ||
    a.adjustmentRecruitmentProcess === true ||
    a.adjustmentPolicyDress === true ||
    a.adjustmentOther === true
  );
}

// ----------------------------------------------------------------------
// Axis A — Equality Act 2010 eligibility (top-to-bottom, first match wins)
// ----------------------------------------------------------------------

/**
 * Determine the eligibility band and the single fired Axis-A rule.
 *
 * @returns {{ band:string, firedRule:object }}
 */
function scoreEligibility(data) {
  const p = data.profile;
  const impact = data.impact.currentImpact;
  const materialImpact = impact === 'moderate' || impact === 'high' || impact === 'severe';
  const highImpact = impact === 'high' || impact === 'severe';

  if (p.substantialLongTermImpact === true) {
    return {
      band: 'likely-covered',
      firedRule: {
        ruleId: 'R-ELIG-SUBSTANTIAL-LONG-TERM',
        axis: 'eligibility',
        category: 'eligibility',
        description: 'Substantial and long-term adverse effect reported — meets the Equality Act 2010 disability test; the duty to make reasonable adjustments is likely engaged.'
      }
    };
  }
  if (p.diagnosisStatus === 'diagnosed' && materialImpact) {
    return {
      band: 'likely-covered',
      firedRule: {
        ruleId: 'R-ELIG-DIAGNOSED-IMPACT',
        axis: 'eligibility',
        category: 'eligibility',
        description: 'Diagnosed neurodivergence with material impact on work — likely a disability under the Equality Act 2010.'
      }
    };
  }
  if (anyCondition(data) && (p.considersDisability === 'yes' || highImpact)) {
    return {
      band: 'possibly-covered',
      firedRule: {
        ruleId: 'R-ELIG-POSSIBLE',
        axis: 'eligibility',
        category: 'eligibility',
        description: 'Neurodivergence with disability self-assessment or high impact — may amount to a disability; assess the substantial + long-term test.'
      }
    };
  }
  if (anyCondition(data)) {
    return {
      band: 'possibly-covered',
      firedRule: {
        ruleId: 'R-ELIG-NEURODIVERGENCE-PRESENT',
        axis: 'eligibility',
        category: 'eligibility',
        description: 'Neurodivergence recorded; being neurodivergent will often amount to a disability under the Equality Act 2010 (ACAS).'
      }
    };
  }
  return {
    band: 'unclear',
    firedRule: {
      ruleId: 'R-ELIG-UNCLEAR',
      axis: 'eligibility',
      category: 'eligibility',
      description: 'Insufficient information to judge Equality Act eligibility; clarify the neurodivergent profile and its impact.'
    }
  };
}

// ----------------------------------------------------------------------
// Axis B — Impact / wellbeing (ok / caution / high-risk; max wins)
// ----------------------------------------------------------------------

const IMPACT_ORDER = ['ok', 'caution', 'high-risk'];

/** Return whichever of two impact bands is more severe. */
function maxImpactBand(a, b) {
  const ia = IMPACT_ORDER.indexOf(a);
  const ib = IMPACT_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Each rule raises the band to at least the given level when it fires.
const IMPACT_RULES = [
  {
    ruleId: 'R-IMPACT-ABSENCE-RISK',
    band: 'high-risk',
    fires: (d) => d.impact.atRiskOfAbsence === true,
    description: 'Worker at risk of sickness absence or burnout without adjustments — act promptly.'
  },
  {
    ruleId: 'R-IMPACT-SEVERE',
    band: 'high-risk',
    fires: (d) => d.impact.currentImpact === 'severe',
    description: 'Severe current impact on work and wellbeing.'
  },
  {
    ruleId: 'R-IMPACT-HIGH',
    band: 'caution',
    fires: (d) => d.impact.currentImpact === 'high',
    description: 'High current impact on work and wellbeing.'
  },
  {
    ruleId: 'R-IMPACT-BURNOUT',
    band: 'caution',
    fires: (d) => d.difficulties.difficultyBurnoutWellbeing === true,
    description: 'Fatigue / burnout difficulty reported.'
  },
  {
    ruleId: 'R-IMPACT-MODERATE',
    band: 'caution',
    fires: (d) => d.impact.currentImpact === 'moderate',
    description: 'Moderate current impact on work and wellbeing.'
  }
];

/**
 * Evaluate the impact / wellbeing band; collect every rule that fires.
 *
 * @returns {{ band:string, firedRules:object[] }}
 */
function scoreImpact(data) {
  let band = 'ok';
  const firedRules = [];
  for (const rule of IMPACT_RULES) {
    if (rule.fires(data)) {
      band = maxImpactBand(band, rule.band);
      firedRules.push({
        ruleId: rule.ruleId,
        axis: 'impact',
        category: 'impact',
        description: rule.description
      });
    }
  }
  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-IMPACT-OK',
      axis: 'impact',
      category: 'impact',
      description: 'No wellbeing risk detected from the impact screen.'
    });
  }
  return { band, firedRules };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (weighted mandatory-field checklist)
// ----------------------------------------------------------------------
//
// Each tracked field carries a weight. The neurodivergent profile, functional
// difficulties, and requested adjustments are weighted highest because they
// drive every other axis. Completeness is the percentage of weighted points
// present; each absent field is emitted as a missing-field rule.

const COMPLETENESS_FIELDS = [
  { weight: 3, present: (d) => anyCondition(d), ruleId: 'R-COMPLETE-CONDITIONS', label: 'neurodivergent profile' },
  { weight: 3, present: (d) => anyDifficulty(d), ruleId: 'R-COMPLETE-DIFFICULTIES', label: 'functional difficulties' },
  { weight: 3, present: (d) => anyAdjustment(d), ruleId: 'R-COMPLETE-ADJUSTMENTS', label: 'requested adjustments' },
  { weight: 2, present: (d) => !!d.difficulties.tasksSituationsAffected && d.difficulties.tasksSituationsAffected.trim() !== '', ruleId: 'R-COMPLETE-TASKS', label: 'tasks and situations affected' },
  { weight: 2, present: (d) => d.profile.disclosureConsent === true, ruleId: 'R-COMPLETE-CONSENT', label: 'disclosure consent' },
  { weight: 1, present: (d) => !!d.worker.name && d.worker.name.trim() !== '', ruleId: 'R-COMPLETE-WORKER-NAME', label: 'worker name' },
  { weight: 1, present: (d) => !!d.worker.jobTitle && d.worker.jobTitle.trim() !== '', ruleId: 'R-COMPLETE-JOB-TITLE', label: 'job title' },
  { weight: 1, present: (d) => !!d.manager.name && d.manager.name.trim() !== '', ruleId: 'R-COMPLETE-MANAGER', label: 'manager / HR contact' },
  { weight: 1, present: (d) => !!d.request.requestDate, ruleId: 'R-COMPLETE-REQUEST-DATE', label: 'request date' },
  { weight: 1, present: (d) => !!d.adjustments.adjustmentsRequestedDetail && d.adjustments.adjustmentsRequestedDetail.trim() !== '', ruleId: 'R-COMPLETE-ADJUSTMENTS-DETAIL', label: 'requested-adjustments detail' }
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
// Axis D — Handling priority (absence-risk / severe-impact escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the worker's requested urgency, then wellbeing
// escalation rules raise it. The most-severe escalation wins.

const PRIORITY_ORDER = ['routine', 'soon', 'urgent'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 20 working days',
  'soon': 'Within 10 working days',
  'urgent': 'Within 5 working days (act without unreasonable delay)'
};

/** Return whichever of two priority tiers is more severe. */
function maxTier(a, b) {
  const ia = PRIORITY_ORDER.indexOf(a);
  const ib = PRIORITY_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Escalation rules, each forcing at least the given tier.
const PRIORITY_RULES = [
  {
    ruleId: 'R-PRIORITY-ABSENCE-RISK',
    tier: 'urgent',
    fires: (d) => d.impact.atRiskOfAbsence === true,
    description: 'Absence / burnout risk — respond urgently and without unreasonable delay.'
  },
  {
    ruleId: 'R-PRIORITY-SEVERE',
    tier: 'urgent',
    fires: (d) => d.impact.currentImpact === 'severe',
    description: 'Severe impact — respond urgently.'
  },
  {
    ruleId: 'R-PRIORITY-HIGH',
    tier: 'soon',
    fires: (d) => d.impact.currentImpact === 'high',
    description: 'High impact — respond soon.'
  },
  {
    ruleId: 'R-PRIORITY-BURNOUT',
    tier: 'soon',
    fires: (d) => d.difficulties.difficultyBurnoutWellbeing === true,
    description: 'Burnout difficulty — respond soon.'
  }
];

/**
 * Compute the priority tier, target timeframe, and fired priority rules.
 *
 * @returns {{ tier:string, targetTimeframe:string, firedRules:object[] }}
 */
function scorePriority(data) {
  const requested = data.impact.urgency || 'routine';
  let tier = PRIORITY_ORDER.includes(requested) ? requested : 'routine';
  const firedRules = [];

  for (const rule of PRIORITY_RULES) {
    if (rule.fires(data)) {
      tier = maxTier(tier, rule.tier);
      firedRules.push({
        ruleId: rule.ruleId,
        axis: 'priority',
        category: 'escalation',
        description: rule.description
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-PRIORITY-REQUESTED',
      axis: 'priority',
      category: 'requested',
      description: `Priority follows the requested urgency (${tier}).`
    });
  }

  return {
    tier,
    targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
    firedRules
  };
}

Object.assign(NS, {
  anyCondition,
  anyDifficulty,
  anyAdjustment,
  scoreEligibility,
  scoreImpact,
  scoreCompleteness,
  scorePriority,
  maxTier,
  maxImpactBand,
  PRIORITY_ORDER,
  IMPACT_ORDER,
  TARGET_TIMEFRAMES
});
})();
