import { anyEffectivenessAnswered, anyNotWorking, ratedCount, ratedValues, workingWellCount } from './types.js';

// Four-axis rule catalogue for the Neurodiversity Adjustment Review engine.
//
// Ported verbatim from the canonical engine spec: (A) effectiveness
// (effective / partially-effective / ineffective / not-yet-assessed); (B)
// wellbeing risk (ok → caution → high-risk, satisfaction / wellbeing / barriers
// / escalation rules, max-band-wins); (C) review completeness over the weighted
// mandatory-field checklist; (D) next-step urgency (none → review-scheduled →
// adjust-now → escalate) with a wellbeing-risk auto-escalation, plus a target
// timeframe. Rule IDs are stable and identical across every front-end and the
// back-end (R-EFFECT-*, R-WELL-*, R-COMPLETE-*, R-NEXT-*). Pure data + helpers;
// the grader composes them.

// ----------------------------------------------------------------------
// Axis A — effectiveness (first match wins)
// ----------------------------------------------------------------------

/** @returns {{ effectivenessBand:string, firedRules:object[] }} */
function classifyEffectiveness(r) {
  const firedRules = [];
  const rated = ratedValues(r);
  const count = rated.length;

  if (count === 0) {
    firedRules.push({
      ruleId: 'R-EFFECT-NOT-ASSESSED',
      axis: 'effectiveness',
      category: 'not-yet-assessed',
      description: 'No adjustments in place have been rated yet.'
    });
    return { effectivenessBand: 'not-yet-assessed', firedRules };
  }

  if (rated.every((v) => v === 'working-well')) {
    firedRules.push({
      ruleId: 'R-EFFECT-EFFECTIVE',
      axis: 'effectiveness',
      category: 'effective',
      description: 'All rated adjustments are working well.'
    });
    return { effectivenessBand: 'effective', firedRules };
  }

  if (workingWellCount(r) === 0 && anyNotWorking(r)) {
    firedRules.push({
      ruleId: 'R-EFFECT-INEFFECTIVE',
      axis: 'effectiveness',
      category: 'ineffective',
      description: 'No adjustment is working well and at least one is not working.'
    });
    return { effectivenessBand: 'ineffective', firedRules };
  }

  firedRules.push({
    ruleId: 'R-EFFECT-PARTIAL',
    axis: 'effectiveness',
    category: 'partially-effective',
    description: 'A mix of working and not-fully-working adjustments.'
  });
  return { effectivenessBand: 'partially-effective', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — wellbeing risk (max band wins; collect all fired)
// ----------------------------------------------------------------------

const WELLBEING_ORDER = ['ok', 'caution', 'high-risk'];

/** @returns {{ wellbeingRiskBand:string, firedRules:object[] }} */
function gradeWellbeingRisk(r) {
  const firedRules = [];

  if (r.escalated === true) {
    firedRules.push({
      ruleId: 'R-WELL-ESCALATED',
      axis: 'wellbeing',
      category: 'high-risk',
      description: 'Matter escalated.'
    });
  }

  if (r.wellbeingChange === 'worse') {
    firedRules.push({
      ruleId: 'R-WELL-DECLINED',
      axis: 'wellbeing',
      category: 'high-risk',
      description: "Worker's wellbeing has worsened since the adjustments."
    });
  }

  if (r.workerSatisfied === 'no') {
    firedRules.push({
      ruleId: 'R-WELL-DISSATISFIED',
      axis: 'wellbeing',
      category: 'high-risk',
      description: 'Worker is not satisfied the adjustments meet their needs.'
    });
  }

  if (anyNotWorking(r)) {
    firedRules.push({
      ruleId: 'R-WELL-NOT-WORKING',
      axis: 'wellbeing',
      category: 'caution',
      description: 'At least one adjustment is not working.'
    });
  }

  if (r.workerSatisfied === 'partially') {
    firedRules.push({
      ruleId: 'R-WELL-PARTIAL-SATISFACTION',
      axis: 'wellbeing',
      category: 'caution',
      description: 'Worker is only partially satisfied.'
    });
  }

  if (String(r.barriersDetail || '').trim() !== '') {
    firedRules.push({
      ruleId: 'R-WELL-BARRIERS',
      axis: 'wellbeing',
      category: 'caution',
      description: 'Remaining barriers reported.'
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-WELL-OK',
      axis: 'wellbeing',
      category: 'ok',
      description: 'No wellbeing risk detected from the review.'
    });
    return { wellbeingRiskBand: 'ok', firedRules };
  }

  // Max band across all fired rules.
  let wellbeingRiskBand = 'ok';
  for (const rule of firedRules) {
    if (WELLBEING_ORDER.indexOf(rule.category) > WELLBEING_ORDER.indexOf(wellbeingRiskBand)) {
      wellbeingRiskBand = rule.category;
    }
  }
  return { wellbeingRiskBand, firedRules };
}

// ----------------------------------------------------------------------
// Axis C — review completeness (weighted mandatory-field checklist)
// ----------------------------------------------------------------------

const COMPLETENESS_SECTIONS = [
  {
    weight: 3,
    ruleId: 'R-COMPLETE-EFFECTIVENESS',
    label: 'effectiveness ratings',
    present: (r) => anyEffectivenessAnswered(r)
  },
  {
    weight: 3,
    ruleId: 'R-COMPLETE-WORKER-FEEDBACK',
    label: 'worker feedback',
    present: (r) => String(r.workerFeedback || '').trim() !== ''
  },
  {
    weight: 2,
    ruleId: 'R-COMPLETE-SATISFACTION',
    label: 'worker satisfaction',
    present: (r) => String(r.workerSatisfied || '').trim() !== ''
  },
  {
    weight: 2,
    ruleId: 'R-COMPLETE-WELLBEING',
    label: 'wellbeing change',
    present: (r) => String(r.wellbeingChange || '').trim() !== ''
  },
  {
    weight: 2,
    ruleId: 'R-COMPLETE-NEXT-REVIEW',
    label: 'next review date',
    present: (r) => String(r.nextReviewDate || '').trim() !== ''
  },
  {
    weight: 1,
    ruleId: 'R-COMPLETE-REVIEW-DATE',
    label: 'review date',
    present: (r) => String(r.reviewDate || '').trim() !== ''
  },
  {
    weight: 1,
    ruleId: 'R-COMPLETE-METHOD',
    label: 'review method',
    present: (r) => String(r.reviewMethod || '').trim() !== ''
  },
  {
    weight: 1,
    ruleId: 'R-COMPLETE-WORKER-NAME',
    label: 'worker name',
    present: (r) => String((r.worker && r.worker.name) || '').trim() !== ''
  },
  {
    weight: 1,
    ruleId: 'R-COMPLETE-MANAGER',
    label: 'manager / HR contact',
    present: (r) => String((r.manager && r.manager.name) || '').trim() !== ''
  },
  {
    weight: 1,
    ruleId: 'R-COMPLETE-STATUS',
    label: 'review status',
    present: (r) => String(r.reviewStatus || '').trim() !== ''
  }
];

/** @returns {{ completenessPercent:number, firedRules:object[] }} */
function gradeCompleteness(r) {
  const firedRules = [];
  let present = 0;
  let total = 0;

  for (const section of COMPLETENESS_SECTIONS) {
    total += section.weight;
    if (section.present(r)) {
      present += section.weight;
    } else {
      firedRules.push({
        ruleId: section.ruleId,
        axis: 'completeness',
        category: 'missing-field',
        description: `Mandatory review field missing: ${section.label}.`
      });
    }
  }

  const completenessPercent = Math.round((present / total) * 100);
  return { completenessPercent, firedRules };
}

// ----------------------------------------------------------------------
// Axis D — next-step urgency (first match wins)
// ----------------------------------------------------------------------
//
// A high wellbeing risk auto-escalates the urgency; escalation takes precedence
// over everything. The least-urgent band ('none') is chosen only when no rule
// fires.

const TARGET_TIMEFRAME = {
  'escalate': 'Escalate now',
  'adjust-now': 'Within 2 weeks',
  'review-scheduled': 'At the scheduled review',
  'none': 'No follow-up scheduled'
};

/** @returns {{ nextStepUrgency:string, targetTimeframe:string, firedRules:object[] }} */
function gradeNextStep(r, wellbeingRiskBand) {
  const firedRules = [];

  function done(nextStepUrgency) {
    let targetTimeframe = TARGET_TIMEFRAME[nextStepUrgency] || '';
    if (nextStepUrgency === 'review-scheduled') {
      targetTimeframe = String(r.nextReviewDate || '').trim() !== ''
        ? r.nextReviewDate
        : 'At the scheduled review';
    }
    return { nextStepUrgency, targetTimeframe, firedRules };
  }

  if (r.escalated === true) {
    firedRules.push({
      ruleId: 'R-NEXT-ESCALATED',
      axis: 'next-step',
      category: 'escalate',
      description: 'Escalation in progress — follow the escalation procedure.'
    });
    return done('escalate');
  }

  if (wellbeingRiskBand === 'high-risk') {
    firedRules.push({
      ruleId: 'R-NEXT-HIGH-RISK',
      axis: 'next-step',
      category: 'adjust-now',
      description: 'High wellbeing risk — act now.'
    });
    return done('adjust-now');
  }

  if (anyNotWorking(r) || r.changesNeeded === true) {
    firedRules.push({
      ruleId: 'R-NEXT-CHANGES',
      axis: 'next-step',
      category: 'adjust-now',
      description: 'A failing adjustment or an agreed change needs action.'
    });
    return done('adjust-now');
  }

  if (String(r.nextReviewDate || '').trim() !== '') {
    firedRules.push({
      ruleId: 'R-NEXT-REVIEW-SCHEDULED',
      axis: 'next-step',
      category: 'review-scheduled',
      description: 'Next review is scheduled.'
    });
    return done('review-scheduled');
  }

  firedRules.push({
    ruleId: 'R-NEXT-NONE',
    axis: 'next-step',
    category: 'none',
    description: 'No further action scheduled.'
  });
  return done('none');
}

export { classifyEffectiveness, gradeWellbeingRisk, gradeCompleteness, gradeNextStep, COMPLETENESS_SECTIONS, WELLBEING_ORDER };
