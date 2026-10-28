import type { FitNoteAssessment, FitNoteEngineState } from './types.js';

/** Engine defaults: unanswered text/enum fields `''`, numeric/date fields `null`. */
export function createEngineDefaults(): FitNoteEngineState {
  return {
    status: 'draft',
    assessmentDate: null,
    assessmentMethod: '',
    diagnosisPrimary: '',
    diagnosisAdditional: '',
    fitnessAdvice: '',
    periodFrom: null,
    periodTo: null,
    periodDurationDays: null,
    reassessmentRequired: '',
    adjustmentPhasedReturn: '',
    adjustmentAlteredHours: '',
    adjustmentAmendedDuties: '',
    adjustmentWorkplaceAdaptations: '',
    functionalEffects: '',
    comments: '',
    employeeConsentToShare: '',
    clinicianDeclaration: '',
    clinicianRegistrationBody: '',
    clinicianRegistrationNumber: ''
  };
}

/** A fresh wizard state: engine defaults plus the identification fields. */
export function createDefaultAssessment(): FitNoteAssessment {
  return {
    ...createEngineDefaults(),
    employeeName: '',
    employeeBirthDate: null,
    employeeNhsNumber: '',
    employerName: '',
    jobTitle: '',
    clinicianName: '',
    clinicianRole: ''
  };
}
