import type { ClinicianAssessment, GradingResult } from '$lib/engine/types.js';
import { createEmptyAssessment } from '$lib/engine/factory.js';
import { calculateASA } from '$lib/engine/composite-grader.js';
import { STEPS, TOTAL_STEPS } from '$lib/config/steps.js';

export interface ValidationErrors {
  [fieldId: string]: string;
}

class AssessmentStore {
  data: ClinicianAssessment = $state(createEmptyAssessment());
  currentStep = $state(1);

  /** Map of field id (HTML id) -> error message. Empty when valid. */
  errors: ValidationErrors = $state({});

  /** Whether the page-level error summary should be hidden. */
  errorSummaryHidden = $state(true);

  /** Whether the user has submitted at least once (drives the report). */
  submitted = $state(false);

  result = $derived<GradingResult>(calculateASA(this.data));

  /** Crude completeness measure for the Lily Progress bar. */
  percentComplete = $derived(estimatePercentComplete(this.data));

  /**
   * Per-step status for the Lily StepList. The "current" step is whatever
   * the user last interacted with. A step counts as "finished" once every
   * required field for that step is populated; "in-progress" if some but
   * not all are; "waiting" if none.
   */
  steps = $derived(
    STEPS.map((s) => {
      const filled = countStepFilled(this.data, s.number);
      const total = countStepRequired(s.number);
      let status: 'waiting' | 'in-progress' | 'finished' | 'error' = 'waiting';
      if (total > 0 && filled >= total) status = 'finished';
      else if (filled > 0) status = 'in-progress';
      if (this.errors && Object.keys(this.errors).some((k) => k.startsWith(`step-${s.number}-`))) {
        status = 'error';
      }
      return { ...s, status, filled, total };
    }),
  );

  reset() {
    this.data = createEmptyAssessment();
    this.currentStep = 1;
    this.errors = {};
    this.errorSummaryHidden = true;
    this.submitted = false;
  }

  goto(n: number) {
    if (n >= 1 && n <= TOTAL_STEPS) this.currentStep = n;
  }

  /**
   * Run a small, conservative set of required-field checks across the
   * whole 16-step questionnaire. Returns the list of errors. Each entry
   * carries the HTML `id` of the offending control so the ErrorSummary
   * can anchor-link to it.
   */
  validate(): ValidationErrors {
    const e: ValidationErrors = {};
    if (!this.data.clinician.clinicianName)
      e['step-1-clinician-name'] = 'Enter the clinician name';
    if (!this.data.clinician.assessmentDate)
      e['step-1-assessment-date'] = 'Enter the assessment date';
    if (!this.data.patient.firstName)
      e['step-2-first-name'] = 'Enter the patient first name';
    if (!this.data.patient.lastName)
      e['step-2-last-name'] = 'Enter the patient last name';
    if (!this.data.surgery.plannedProcedure)
      e['step-2-planned-procedure'] = 'Enter the planned procedure';
    if (!this.data.surgery.surgicalSeverity)
      e['step-2-surgical-severity'] = 'Select the surgical severity';
    if (
      this.data.summary.finalAsaGrade &&
      this.data.summary.finalAsaGrade !== this.result.computedAsaGrade &&
      !this.data.summary.overrideReason.trim()
    ) {
      e['step-16-override-reason'] = 'Document the reason for overriding the computed ASA grade';
    }
    return e;
  }
}

function estimatePercentComplete(d: ClinicianAssessment): number {
  let filled = 0;
  let total = 0;
  for (const key of Object.keys(d) as Array<keyof ClinicianAssessment>) {
    const v = d[key];
    if (Array.isArray(v)) continue;
    if (v && typeof v === 'object') {
      for (const inner of Object.values(v)) {
        total += 1;
        if (inner !== null && inner !== '' && inner !== undefined) filled += 1;
      }
    }
  }
  if (total === 0) return 0;
  return Math.round((filled / total) * 100);
}

/**
 * Approximate count of "answered" fields for a given step. Used by the
 * StepList to flip a step from waiting → in-progress → finished.
 */
function countStepFilled(d: ClinicianAssessment, stepNumber: number): number {
  const section = sectionForStep(d, stepNumber);
  if (!section) return 0;
  if (Array.isArray(section)) return section.length;
  let n = 0;
  for (const v of Object.values(section)) {
    if (v !== null && v !== '' && v !== undefined) n += 1;
  }
  return n;
}

function countStepRequired(stepNumber: number): number {
  // We use a very small required-set per step (1 field) so the StepList
  // shows quick progress as the user answers anything in a section.
  // The real validation in `validate()` is what gates submission.
  const requiredPerStep: Record<number, number> = {};
  for (const s of STEPS) requiredPerStep[s.number] = 1;
  return requiredPerStep[stepNumber] ?? 1;
}

function sectionForStep(d: ClinicianAssessment, n: number): unknown {
  switch (n) {
    case 1: return d.clinician;
    case 2: return { ...d.patient, ...d.surgery };
    case 3: return d.vitals;
    case 4: return d.airway;
    case 5: return d.cardiovascular;
    case 6: return d.respiratory;
    case 7: return d.neurological;
    case 8: return d.renalHepatic;
    case 9: return d.haematology;
    case 10: return d.endocrine;
    case 11: return d.gastrointestinal;
    case 12: return d.musculoskeletal;
    case 13: return [...d.medications, ...d.allergies];
    case 14: return d.functionalCapacity;
    case 15: return d.anaesthesiaPlan;
    case 16: return d.summary;
    default: return null;
  }
}

export const store = new AssessmentStore();
