// Medical fit note approval engine. Pure functions, no I/O, no wall clock.
// Rules R-01..R-09 are specified in index.md; the worst effect wins.

const DAY_MS = 86400000;
const RANK = { approved: 0, 'needs-completion': 1, blocked: 2 };

export function createDefaultAssessment() {
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
    clinicianRegistrationNumber: '',
  };
}

const days = (iso) => Math.floor(Date.parse(`${iso}T00:00:00Z`) / DAY_MS);

export function gradeFitNote(state) {
  const s = { ...createDefaultAssessment(), ...state };
  const firedRules = [];
  const flags = [];
  let approvalStatus = 'approved';
  const fire = (ruleId, effect, category, description, flagCategory, priority, action) => {
    firedRules.push({ ruleId, category, description });
    flags.push({ flagId: `F-${ruleId.slice(2)}`, category: flagCategory, priority, description, suggestedAction: action });
    if (RANK[effect] > RANK[approvalStatus]) approvalStatus = effect;
  };

  const adjustmentCount = [s.adjustmentPhasedReturn, s.adjustmentAlteredHours, s.adjustmentAmendedDuties, s.adjustmentWorkplaceAdaptations]
    .filter((v) => v === 'yes').length;

  let durationDays = null;
  const datesOk = s.periodFrom && s.periodTo && days(s.periodTo) >= days(s.periodFrom);
  if (datesOk) durationDays = days(s.periodTo) - days(s.periodFrom) + 1;
  else if (s.periodDurationDays != null && !(s.periodFrom && s.periodTo)) durationDays = s.periodDurationDays;

  if (!s.assessmentDate || s.assessmentMethod === '') {
    fire('R-01', 'needs-completion', 'assessment', 'Assessment date or method is missing', 'missing-assessment', 'medium', 'Record when and how the employee was assessed.');
  }
  if (s.diagnosisPrimary.trim() === '') {
    fire('R-02', 'needs-completion', 'condition', 'No primary diagnosis recorded', 'missing-diagnosis', 'medium', 'Record the condition the advice is based on.');
  }
  if (s.fitnessAdvice === '') {
    fire('R-03', 'blocked', 'advice', 'No fitness advice chosen', 'other', 'high', 'Choose not fit for work or may be fit for work.');
  }
  const hasPeriodStart = !!s.periodFrom;
  const hasPeriodEnd = !!s.periodTo || (s.periodDurationDays != null && s.periodDurationDays > 0);
  if (!hasPeriodStart || !hasPeriodEnd || (s.periodFrom && s.periodTo && !datesOk)) {
    fire('R-04', 'blocked', 'period', 'Period is missing or ends before it starts', 'invalid-period', 'high', 'Enter a start date and an end date or duration.');
  }
  if (s.fitnessAdvice === 'may-be-fit-for-work' && adjustmentCount === 0) {
    fire('R-05', 'needs-completion', 'adjustments', 'May be fit for work but no adjustment selected', 'missing-adjustments', 'medium', 'Select at least one adjustment.');
  }
  if (s.clinicianDeclaration !== 'yes') {
    fire('R-06', 'blocked', 'sign-off', 'Clinician declaration not given', 'missing-declaration', 'high', 'Tick the declaration to sign.');
  }
  if (s.clinicianRegistrationBody === '' || s.clinicianRegistrationNumber.trim() === '') {
    fire('R-07', 'blocked', 'sign-off', 'Clinician registration body or number is missing', 'unregistered-clinician', 'high', 'Add the clinician registration details.');
  }
  if (durationDays != null && durationDays > 90 && s.reassessmentRequired !== 'yes') {
    fire('R-08', 'needs-completion', 'period', 'Period over 90 days with no reassessment', 'long-period-without-review', 'medium', 'Set a reassessment or shorten the period.');
  }
  if (s.assessmentDate && s.periodFrom && days(s.assessmentDate) - days(s.periodFrom) > 14) {
    fire('R-09', 'needs-completion', 'period', 'Period starts more than 14 days before the assessment', 'backdated', 'medium', 'Confirm the backdating or correct the start date.');
  }
  if (s.employeeConsentToShare !== 'yes') {
    flags.push({ flagId: 'F-CONSENT', category: 'missing-consent', priority: 'low', description: 'Employee consent to share with the employer not recorded', suggestedAction: 'Record consent before the note is issued.' });
  }

  return { outcome: s.fitnessAdvice, approvalStatus, durationDays, adjustmentCount, firedRules, additionalFlags: flags };
}
