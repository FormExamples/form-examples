import { createDefaultAssessment } from './fit-note-grader.js';

// Medical Fit Note -- state shape and option lists (JSDoc-typed, no build).
//
// The scoring engine (js/fit-note-grader.js) owns the graded fields. The
// wizard adds the employee and clinician identification fields from the SQL
// `employee` and `clinician` tables; the engine ignores them.

/**
 * @typedef {Object} FitNoteRow
 * @property {string} id
 * @property {string} date          ISO assessment date, '' when absent
 * @property {string} employee      Employee display name
 * @property {string} employer      Employer name
 * @property {string} advice        '' | 'not-fit-for-work' | 'may-be-fit-for-work'
 * @property {number | null} durationDays
 * @property {number} adjustments   0..4
 * @property {'approved' | 'needs-completion' | 'blocked'} approval
 * @property {string[]} flags       Flag categories
 * @property {string} clinician     Clinician display name
 */

/**
 * @typedef {FitNoteRow[] | { items: FitNoteRow[], total?: number }} DashboardFitNotesResponse
 */

/** A fresh wizard state: engine defaults plus identification fields. */
export function emptyAssessment() {
  return {
    ...createDefaultAssessment(),
    employeeName: '',
    employeeBirthDate: null,
    employeeNhsNumber: '',
    employerName: '',
    jobTitle: '',
    clinicianName: '',
    clinicianRole: ''
  };
}

export const METHOD_OPTIONS = [
  { value: 'face-to-face', label: 'Face to face' },
  { value: 'video', label: 'Video' },
  { value: 'telephone', label: 'Telephone' },
  { value: 'records-review', label: 'Records review' }
];

export const ADVICE_OPTIONS = [
  { value: 'not-fit-for-work', label: 'Not fit for work' },
  { value: 'may-be-fit-for-work', label: 'May be fit for work' }
];

export const YES_NO_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

export const ROLE_OPTIONS = [
  { value: 'gp', label: 'GP' },
  { value: 'hospital-doctor', label: 'Hospital doctor' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'occupational-therapist', label: 'Occupational therapist' },
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'physiotherapist', label: 'Physiotherapist' },
  { value: 'other', label: 'Other' }
];

export const REGISTRATION_BODY_OPTIONS = [
  { value: 'GMC', label: 'GMC' },
  { value: 'NMC', label: 'NMC' },
  { value: 'HCPC', label: 'HCPC' },
  { value: 'GPhC', label: 'GPhC' },
  { value: 'other', label: 'Other' }
];

export const APPROVAL_LABELS = {
  approved: 'Approved',
  'needs-completion': 'Needs completion',
  blocked: 'Blocked'
};

export function approvalLabel(status) {
  return APPROVAL_LABELS[status] || status || '';
}

export function adviceLabel(value) {
  const o = ADVICE_OPTIONS.find((x) => x.value === value);
  return o ? o.label : '';
}
