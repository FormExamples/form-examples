import type { FitNoteAssessment, FitNoteGrade } from '#lib/engine/types.js';
import { adviceLabel, approvalLabel } from '#lib/engine/utils.js';

/** Build a pdfmake document definition for a graded fit note. */
export function buildPdfDoc(data: FitNoteAssessment, result: FitNoteGrade) {
  const section = (title: string, lines: string[]) => [
    { text: title, bold: true, fontSize: 13, margin: [0, 10, 0, 4] },
    ...lines.filter(Boolean).map((l) => ({ text: l, margin: [0, 0, 0, 2] }))
  ];

  return {
    content: [
      { text: 'Medical Fit Note', fontSize: 18, bold: true, margin: [0, 0, 0, 8] },
      ...section('Employee', [
        `Name: ${data.employeeName || '—'}`,
        `Date of birth: ${data.employeeBirthDate || '—'} · NHS number: ${data.employeeNhsNumber || '—'}`,
        `Employer: ${data.employerName || '—'} · Job title: ${data.jobTitle || '—'}`
      ]),
      ...section('Assessment and condition', [
        `Assessed: ${data.assessmentDate || '—'} (${data.assessmentMethod || 'method not recorded'})`,
        `Primary diagnosis: ${data.diagnosisPrimary || '—'}`,
        data.diagnosisAdditional ? `Additional: ${data.diagnosisAdditional}` : '',
        data.functionalEffects ? `Functional effects: ${data.functionalEffects}` : ''
      ]),
      ...section('Advice and period', [
        `Advice: ${adviceLabel(result.outcome) || 'not chosen'}`,
        `Period: ${data.periodFrom || '—'} to ${data.periodTo || '—'} (${result.durationDays ?? '—'} days)`,
        `Adjustments selected: ${result.adjustmentCount}`
      ]),
      ...section('Clinician', [
        `${data.clinicianName || '—'} (${data.clinicianRole || '—'})`,
        `${data.clinicianRegistrationBody || '—'} ${data.clinicianRegistrationNumber || ''}`
      ]),
      ...section('Approval', [`Status: ${approvalLabel(result.approvalStatus)}`]),
      ...section(
        'Fired rules',
        result.firedRules.length === 0
          ? ['No rules fired.']
          : result.firedRules.map((r) => `${r.ruleId} (${r.category}): ${r.description}`)
      ),
      ...section(
        'Flags',
        result.additionalFlags.length === 0
          ? ['No flags raised.']
          : result.additionalFlags.map(
              (f) => `[${f.priority.toUpperCase()}] ${f.description} — ${f.suggestedAction}`
            )
      )
    ],
    defaultStyle: { fontSize: 10 }
  };
}
