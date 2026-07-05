// Four-axis rule catalogue for the Neurodiversity Adjustment Response engine.
//
// Ported verbatim from the canonical engine spec: (A) outcome classification
// (fully-agreed / partially-agreed / alternative-offered / declined / deferred);
// (B) legal / discrimination risk (ok → caution → high-risk, reasonableness /
// Equality Act failure-to-adjust rules, max-band-wins); (C) response
// completeness over the weighted mandatory-section checklist; (D) follow-up /
// review urgency (none → review-scheduled → urgent-review → escalation-needed)
// with a discrimination-risk auto-escalation invariant, plus a target
// timeframe. Rule IDs are stable and identical across every front-end and the
// back-end (R-OUTCOME-*, R-LEGAL-*, R-COMPLETE-*, R-FOLLOWUP-*). Pure data +
// helpers; the grader composes them.
//
// Wrapped in an IIFE; published via `window.NeurodiversityAdjustmentResponse`.

(function () {
'use strict';
window.NeurodiversityAdjustmentResponse =
  window.NeurodiversityAdjustmentResponse || {};
const NS = window.NeurodiversityAdjustmentResponse;
const { anyAgreed, hasAlternative, declineJustified } = NS;

// ----------------------------------------------------------------------
// Axis A — outcome classification (first match wins)
// ----------------------------------------------------------------------

/** @returns {{ outcomeClassification:string, firedRules:object[] }} */
function classifyOutcome(r) {
  const firedRules = [];

  if (r.overallDecision === 'agreed') {
    firedRules.push({
      ruleId: 'R-OUTCOME-AGREED',
      axis: 'outcome',
      category: 'fully-agreed',
      description: 'All requested adjustments agreed.'
    });
    return { outcomeClassification: 'fully-agreed', firedRules };
  }

  if (r.overallDecision === 'partially-agreed') {
    firedRules.push({
      ruleId: 'R-OUTCOME-PARTIAL',
      axis: 'outcome',
      category: 'partially-agreed',
      description: 'Some requested adjustments agreed.'
    });
    return { outcomeClassification: 'partially-agreed', firedRules };
  }

  if (r.overallDecision === 'alternative-offered') {
    firedRules.push({
      ruleId: 'R-OUTCOME-ALTERNATIVE',
      axis: 'outcome',
      category: 'alternative-offered',
      description: 'Alternative adjustments offered in place of those requested.'
    });
    return { outcomeClassification: 'alternative-offered', firedRules };
  }

  if (r.overallDecision === 'declined') {
    firedRules.push({
      ruleId: 'R-OUTCOME-DECLINED',
      axis: 'outcome',
      category: 'declined',
      description: 'Requested adjustments declined.'
    });
    return { outcomeClassification: 'declined', firedRules };
  }

  if (r.overallDecision === 'deferred') {
    firedRules.push({
      ruleId: 'R-OUTCOME-DEFERRED',
      axis: 'outcome',
      category: 'deferred',
      description: 'Decision deferred pending further information or assessment.'
    });
    return { outcomeClassification: 'deferred', firedRules };
  }

  firedRules.push({
    ruleId: 'R-OUTCOME-UNSPECIFIED',
    axis: 'outcome',
    category: 'unspecified',
    description: 'No overall decision recorded yet.'
  });
  return { outcomeClassification: '', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — legal / discrimination risk (max band wins; collect all fired)
// ----------------------------------------------------------------------
//
// Declining adjustments for a worker likely covered by the Equality Act 2010
// without an adequate reasonableness justification or alternatives drives the
// band to high-risk. If no rule fires, the band is ok (R-LEGAL-OK).

const LEGAL_ORDER = ['ok', 'caution', 'high-risk'];

/** @returns {{ legalRiskBand:string, firedRules:object[] }} */
function gradeLegalRisk(r) {
  const firedRules = [];
  const rationaleEmpty = String(r.decisionRationale || '').trim() === '';
  const declined = r.overallDecision === 'declined';

  if (declined && rationaleEmpty) {
    firedRules.push({
      ruleId: 'R-LEGAL-DECLINE-NO-RATIONALE',
      axis: 'legal-risk',
      category: 'high-risk',
      description: 'Adjustments declined with no rationale recorded — high failure-to-make-reasonable-adjustments risk.'
    });
  }

  if (declined && !declineJustified(r) && !hasAlternative(r) && !anyAgreed(r)) {
    firedRules.push({
      ruleId: 'R-LEGAL-DECLINE-NO-ALTERNATIVE',
      axis: 'legal-risk',
      category: 'high-risk',
      description: 'Adjustments declined without a reasonableness justification or any alternative offered.'
    });
  }

  if (r.escalated === true && declined) {
    firedRules.push({
      ruleId: 'R-LEGAL-ESCALATED-DECLINE',
      axis: 'legal-risk',
      category: 'high-risk',
      description: 'Declined adjustment has been escalated — treat as a live discrimination-risk dispute.'
    });
  }

  if (declined && declineJustified(r)) {
    firedRules.push({
      ruleId: 'R-LEGAL-DECLINE-JUSTIFIED',
      axis: 'legal-risk',
      category: 'caution',
      description: 'Adjustments declined but a reasonableness justification is recorded — retain evidence.'
    });
  }

  if (r.overallDecision === 'partially-agreed' && !hasAlternative(r) && r.declineReasonCategory === '') {
    firedRules.push({
      ruleId: 'R-LEGAL-PARTIAL-UNEXPLAINED',
      axis: 'legal-risk',
      category: 'caution',
      description: 'Only part of the request agreed with no explanation for the remainder.'
    });
  }

  if (r.escalated === true) {
    firedRules.push({
      ruleId: 'R-LEGAL-ESCALATED',
      axis: 'legal-risk',
      category: 'caution',
      description: 'Matter escalated (dispute / grievance / appeal).'
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-LEGAL-OK',
      axis: 'legal-risk',
      category: 'ok',
      description: 'No elevated discrimination risk detected.'
    });
    return { legalRiskBand: 'ok', firedRules };
  }

  // Max band across all fired rules.
  let legalRiskBand = 'ok';
  for (const rule of firedRules) {
    if (LEGAL_ORDER.indexOf(rule.category) > LEGAL_ORDER.indexOf(legalRiskBand)) {
      legalRiskBand = rule.category;
    }
  }
  return { legalRiskBand, firedRules };
}

// ----------------------------------------------------------------------
// Axis C — response completeness (weighted mandatory-section checklist)
// ----------------------------------------------------------------------

const COMPLETENESS_SECTIONS = [
  {
    weight: 3,
    ruleId: 'R-COMPLETE-DECISION',
    label: 'overall decision',
    present: (r) => String(r.overallDecision || '').trim() !== ''
  },
  {
    weight: 3,
    ruleId: 'R-COMPLETE-RATIONALE',
    label: 'decision rationale',
    present: (r) => String(r.decisionRationale || '').trim() !== ''
  },
  {
    weight: 2,
    ruleId: 'R-COMPLETE-AGREED-DETAIL',
    label: 'agreed-adjustments detail',
    present: (r) =>
      String(r.agreedAdjustmentsDetail || '').trim() !== '' ||
      r.overallDecision === 'declined'
  },
  {
    weight: 2,
    ruleId: 'R-COMPLETE-REVIEW',
    label: 'review arrangements',
    present: (r) => r.reviewScheduled === true && String(r.reviewDate || '').trim() !== ''
  },
  {
    weight: 1,
    ruleId: 'R-COMPLETE-CONTACT',
    label: 'point of contact',
    present: (r) => String(r.pointOfContact || '').trim() !== ''
  },
  {
    weight: 1,
    ruleId: 'R-COMPLETE-EFFECTIVE-DATE',
    label: 'effective date',
    present: (r) => String(r.effectiveDate || '').trim() !== ''
  },
  {
    weight: 1,
    ruleId: 'R-COMPLETE-RESPONDED-DATE',
    label: 'responded date',
    present: (r) => String(r.respondedDate || '').trim() !== ''
  },
  {
    weight: 1,
    ruleId: 'R-COMPLETE-RESPONSIBILITIES',
    label: 'responsibilities',
    present: (r) => String(r.responsibilitiesDetail || '').trim() !== ''
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
        description: `Mandatory response section missing: ${section.label}.`
      });
    }
  }

  const completenessPercent = Math.round((present / total) * 100);
  return { completenessPercent, firedRules };
}

// ----------------------------------------------------------------------
// Axis D — follow-up / review urgency (first match wins)
// ----------------------------------------------------------------------
//
// A high legal / discrimination risk auto-escalates the urgency; escalation
// takes precedence over everything. The least-urgent band ('none') is chosen
// only when no rule fires.

const TARGET_TIMEFRAME = {
  'escalation-needed': 'Escalate now',
  'urgent-review': 'Within 2 weeks',
  'review-scheduled': 'At the scheduled review',
  'none': 'No follow-up scheduled'
};

/** @returns {{ followUpUrgency:string, targetTimeframe:string, firedRules:object[] }} */
function gradeFollowUp(r, legalRiskBand) {
  const firedRules = [];

  function done(followUpUrgency) {
    let targetTimeframe = TARGET_TIMEFRAME[followUpUrgency] || '';
    if (followUpUrgency === 'review-scheduled') {
      targetTimeframe = String(r.reviewDate || '').trim() !== ''
        ? r.reviewDate
        : 'At the scheduled review';
    }
    return { followUpUrgency, targetTimeframe, firedRules };
  }

  if (r.escalated === true) {
    firedRules.push({
      ruleId: 'R-FOLLOWUP-ESCALATED',
      axis: 'follow-up',
      category: 'escalation-needed',
      description: 'Escalation in progress — engage HR / grievance procedure.'
    });
    return done('escalation-needed');
  }

  if (legalRiskBand === 'high-risk') {
    firedRules.push({
      ruleId: 'R-FOLLOWUP-LEGAL-RISK',
      axis: 'follow-up',
      category: 'urgent-review',
      description: 'High discrimination risk — reconsider the decision urgently.'
    });
    return done('urgent-review');
  }

  if (r.reviewScheduled === true) {
    firedRules.push({
      ruleId: 'R-FOLLOWUP-REVIEW',
      axis: 'follow-up',
      category: 'review-scheduled',
      description: 'Review scheduled for the agreed adjustments.'
    });
    return done('review-scheduled');
  }

  if (anyAgreed(r) && r.reviewScheduled === false) {
    firedRules.push({
      ruleId: 'R-FOLLOWUP-NO-REVIEW',
      axis: 'follow-up',
      category: 'urgent-review',
      description: 'Adjustments agreed but no review scheduled — schedule one.'
    });
    return done('urgent-review');
  }

  firedRules.push({
    ruleId: 'R-FOLLOWUP-NONE',
    axis: 'follow-up',
    category: 'none',
    description: 'No follow-up scheduled.'
  });
  return done('none');
}

Object.assign(NS, {
  classifyOutcome,
  gradeLegalRisk,
  gradeCompleteness,
  gradeFollowUp,
  COMPLETENESS_SECTIONS,
  LEGAL_ORDER
});
})();
