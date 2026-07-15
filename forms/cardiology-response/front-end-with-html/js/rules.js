import { hasAnyCardiacFinding, hasCriticalFinding, hasReducedEjectionFraction } from './types.js';

// Four-axis rule catalogue for the Cardiology Response interpretation engine.
//
// Ported verbatim from the svelte engine: (A) response classification
// (no-abnormality / cardiac-condition / critical / inconclusive); (B) condition
// severity (none → minor → moderate → major) with a structured-finding
// category; (C) response completeness over the five mandatory NHS e-Referral
// advice-and-guidance / counter-referral sections; (D) follow-up urgency
// (routine → recommended → urgent → critical-alert) with a critical-result
// auto-escalation invariant, plus target timeframe and recommended action.
// Rule IDs are stable and identical across every front-end and the back-end
// (R-CLASS-*, R-SEVERITY-*, R-COMP-*, R-FOLLOWUP-*). Pure data + helpers; the
// grader composes them.

// ----------------------------------------------------------------------
// Axis A — response classification
// ----------------------------------------------------------------------
//
// - critical: a critical result is present (auto-escalation invariant).
// - inconclusive: no clinical summary recorded, or no diagnosis category and no
//   structured finding (the assessment did not reach a conclusion).
// - cardiac-condition: any structured cardiac finding is present, or the
//   diagnosis category is a cardiac one.
// - no-abnormality: no cardiac finding and a non-cardiac / no-abnormality
//   conclusion on a completed assessment.

/** @returns {{ responseClassification:string, firedRules:object[] }} */
function classifyResponse(r) {
  const firedRules = [];

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-CRITICAL-01',
      axis: 'classification',
      category: 'critical-finding',
      description: 'A critical or unexpected significant cardiac result is present; classified as critical.'
    });
    return { responseClassification: 'critical', firedRules };
  }

  if (r.clinicalSummary.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'no-summary',
      description: 'No clinical summary recorded; classified as inconclusive.'
    });
    return { responseClassification: 'inconclusive', firedRules };
  }

  const cardiacDiagnosis =
    r.primaryDiagnosisCategory === 'coronary-artery-disease' ||
    r.primaryDiagnosisCategory === 'heart-failure' ||
    r.primaryDiagnosisCategory === 'arrhythmia' ||
    r.primaryDiagnosisCategory === 'valve-disease' ||
    r.primaryDiagnosisCategory === 'hypertension' ||
    r.primaryDiagnosisCategory === 'cardiomyopathy';

  if (hasAnyCardiacFinding(r) || cardiacDiagnosis) {
    firedRules.push({
      ruleId: 'R-CLASS-CARDIAC-01',
      axis: 'classification',
      category: 'cardiac-condition',
      description: 'One or more structured cardiac findings or a cardiac diagnosis are present; classified as a cardiac condition.'
    });
    return { responseClassification: 'cardiac-condition', firedRules };
  }

  if (
    r.primaryDiagnosisCategory === 'non-cardiac' ||
    r.primaryDiagnosisCategory === 'no-abnormality' ||
    r.nonCardiacCause
  ) {
    firedRules.push({
      ruleId: 'R-CLASS-NONE-01',
      axis: 'classification',
      category: 'no-abnormality',
      description: 'No structured cardiac finding and a non-cardiac / no-abnormality conclusion; classified as no abnormality.'
    });
    return { responseClassification: 'no-abnormality', firedRules };
  }

  // A summary exists but no diagnosis and no structured finding: not concluded.
  firedRules.push({
    ruleId: 'R-CLASS-INCONCLUSIVE-02',
    axis: 'classification',
    category: 'no-diagnosis',
    description: 'A clinical summary exists but no diagnosis category and no structured finding were recorded; classified as inconclusive.'
  });
  return { responseClassification: 'inconclusive', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — condition severity & structured-finding category
// ----------------------------------------------------------------------
//
// - major: critical result, severe valve disease, reduced ejection fraction
//   (HFrEF; LVEF < 40 %), or significant arrhythmia.
// - moderate: any other structured cardiac finding (ischaemia/CAD, structural
//   abnormality, uncontrolled hypertension).
// - minor: mildly reduced ejection fraction (40–49 %, HFmrEF) with no other
//   finding.
// - none: no structured cardiac finding.

/** @returns {{ severity:string, severityCategory:string, firedRules:object[] }} */
function gradeSeverity(r, classification) {
  const firedRules = [];

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEVERITY-MAJOR-01',
      axis: 'severity',
      category: 'critical-finding',
      description: 'Critical result present; condition severity graded major.'
    });
    return { severity: 'major', severityCategory: 'critical-cardiac', firedRules };
  }

  if (r.significantValveDisease) {
    firedRules.push({
      ruleId: 'R-SEVERITY-MAJOR-02',
      axis: 'severity',
      category: 'severe-valve-disease',
      description: 'Significant valve disease present; condition severity graded major.'
    });
    return { severity: 'major', severityCategory: 'valve-disease', firedRules };
  }

  if (hasReducedEjectionFraction(r)) {
    firedRules.push({
      ruleId: 'R-SEVERITY-MAJOR-03',
      axis: 'severity',
      category: 'reduced-ejection-fraction',
      description: 'Reduced left-ventricular ejection fraction (HFrEF); condition severity graded major.'
    });
    return { severity: 'major', severityCategory: 'reduced-ejection-fraction', firedRules };
  }

  if (r.significantArrhythmia) {
    firedRules.push({
      ruleId: 'R-SEVERITY-MAJOR-04',
      axis: 'severity',
      category: 'significant-arrhythmia',
      description: 'Significant arrhythmia present; condition severity graded major.'
    });
    return { severity: 'major', severityCategory: 'arrhythmia', firedRules };
  }

  // Mildly reduced ejection fraction (HFmrEF; 40–49 %) with no other finding.
  const mildlyReducedEf =
    r.lvEjectionFractionPercent !== null &&
    r.lvEjectionFractionPercent >= 40 &&
    r.lvEjectionFractionPercent < 50;

  if (r.ischaemiaOrCad || r.structuralAbnormality || r.uncontrolledHypertension) {
    const category = r.ischaemiaOrCad
      ? 'ischaemia-cad'
      : r.structuralAbnormality
        ? 'structural-abnormality'
        : 'uncontrolled-hypertension';
    firedRules.push({
      ruleId: 'R-SEVERITY-MODERATE-01',
      axis: 'severity',
      category,
      description: 'A structured cardiac finding (ischaemia/CAD, structural abnormality, or uncontrolled hypertension) is present; severity graded moderate.'
    });
    return { severity: 'moderate', severityCategory: category, firedRules };
  }

  if (mildlyReducedEf) {
    firedRules.push({
      ruleId: 'R-SEVERITY-MINOR-01',
      axis: 'severity',
      category: 'mildly-reduced-ejection-fraction',
      description: 'Mildly reduced left-ventricular ejection fraction (HFmrEF, 40–49 %); severity graded minor.'
    });
    return { severity: 'minor', severityCategory: 'mildly-reduced-ejection-fraction', firedRules };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-SEVERITY-NONE-02',
      axis: 'severity',
      category: 'inconclusive',
      description: 'Inconclusive response; condition severity not established.'
    });
    return { severity: 'none', severityCategory: 'indeterminate', firedRules };
  }

  // Defensive: no finding but somehow flagged as a cardiac condition.
  if (hasAnyCardiacFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEVERITY-MODERATE-02',
      axis: 'severity',
      category: 'cardiac-finding',
      description: 'A structured cardiac finding is present; severity graded moderate.'
    });
    return { severity: 'moderate', severityCategory: 'cardiac-finding', firedRules };
  }

  firedRules.push({
    ruleId: 'R-SEVERITY-NONE-01',
    axis: 'severity',
    category: 'no-finding',
    description: 'No structured cardiac finding; condition severity graded none.'
  });
  return { severity: 'none', severityCategory: 'no-abnormality', firedRules };
}

// ----------------------------------------------------------------------
// Axis C — response completeness (mandatory-section checklist)
// ----------------------------------------------------------------------
//
// The five mandatory response sections per the NHS e-Referral advice-and-
// guidance / counter-referral model: clinical summary, examination, diagnosis,
// management plan, and recommended follow-up.

const COMPLETENESS_SECTIONS = [
  {
    ruleId: 'R-COMP-SUMMARY-01',
    category: 'summary',
    label: 'clinical summary',
    present: (r) => r.clinicalSummary.trim() !== ''
  },
  {
    ruleId: 'R-COMP-EXAMINATION-01',
    category: 'examination',
    label: 'examination findings',
    present: (r) => r.examinationFindings.trim() !== ''
  },
  {
    ruleId: 'R-COMP-DIAGNOSIS-01',
    category: 'diagnosis',
    label: 'diagnosis',
    present: (r) => r.primaryDiagnosisCategory !== '' || r.diagnosisNarrative.trim() !== ''
  },
  {
    ruleId: 'R-COMP-MANAGEMENT-01',
    category: 'management',
    label: 'management plan',
    present: (r) => r.managementPlan.trim() !== ''
  },
  {
    ruleId: 'R-COMP-FOLLOWUP-01',
    category: 'follow-up',
    label: 'recommended follow-up',
    present: (r) => r.recommendedFollowUp.trim() !== ''
  }
];

/** @returns {{ completenessPercent:number, firedRules:object[] }} */
function gradeCompleteness(r) {
  const firedRules = [];
  let presentCount = 0;

  for (const section of COMPLETENESS_SECTIONS) {
    if (section.present(r)) {
      presentCount += 1;
    } else {
      firedRules.push({
        ruleId: section.ruleId,
        axis: 'completeness',
        category: section.category,
        description: `Mandatory response section missing: ${section.label}.`
      });
    }
  }

  const completenessPercent = Math.round((presentCount / COMPLETENESS_SECTIONS.length) * 100);
  return { completenessPercent, firedRules };
}

// ----------------------------------------------------------------------
// Axis D — follow-up urgency (critical-result auto-escalation)
// ----------------------------------------------------------------------
//
// Escalation ladder (routine → recommended → urgent → critical-alert). A
// critical result auto-escalates to critical-alert regardless of the other
// axes (the safety invariant). The least-urgent band is chosen only when no
// rule fires.

/**
 * @returns {{
 *   followUpUrgency:string,
 *   targetTimeframe:string,
 *   recommendedAction:string,
 *   firedRules:object[]
 * }}
 */
function gradeFollowUp(r, classification, severity) {
  const firedRules = [];

  // ─── critical-alert: auto-escalation invariant ───
  if (hasCriticalFinding(r) || classification === 'critical') {
    firedRules.push({
      ruleId: 'R-FOLLOWUP-CRITICAL-01',
      axis: 'follow-up',
      category: 'critical-result',
      description: 'Critical result auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'immediate',
      recommendedAction: 'Communicate the critical result directly to the referrer now and arrange urgent review; document the conversation.',
      firedRules
    };
  }

  // ─── urgent ───
  if (severity === 'major') {
    firedRules.push({
      ruleId: 'R-FOLLOWUP-URGENT-01',
      axis: 'follow-up',
      category: 'major-condition',
      description: 'Major cardiac condition present; follow-up urgency graded urgent.'
    });
    return {
      followUpUrgency: 'urgent',
      targetTimeframe: 'within 2 weeks',
      recommendedAction: 'Arrange urgent cardiology follow-up and expedite specialist management as clinically indicated.',
      firedRules
    };
  }

  // ─── recommended ───
  if (severity === 'moderate' || severity === 'minor') {
    firedRules.push({
      ruleId: 'R-FOLLOWUP-RECOMMENDED-01',
      axis: 'follow-up',
      category: 'cardiac-condition',
      description: 'A cardiac condition is present; structured follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 6 weeks',
      recommendedAction: 'Recommend routine cardiology follow-up or onward investigation as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FOLLOWUP-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive response; further assessment or investigation recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 6 weeks',
      recommendedAction: 'Recommend further assessment or investigation to resolve the inconclusive response.',
      firedRules
    };
  }

  // ─── routine: least-urgent band, no rule fired ───
  firedRules.push({
    ruleId: 'R-FOLLOWUP-ROUTINE-01',
    axis: 'follow-up',
    category: 'no-abnormality',
    description: 'No escalation rule fired; routine follow-up only.'
  });
  return {
    followUpUrgency: 'routine',
    targetTimeframe: 'no specific follow-up',
    recommendedAction: 'No specific cardiology follow-up required; discharge back to the referrer for usual care.',
    firedRules
  };
}

export { classifyResponse, gradeSeverity, gradeCompleteness, gradeFollowUp, COMPLETENESS_SECTIONS };
