// Plain-JavaScript / JSDoc type definitions for the Return to Work form.
//
// Builds the canonical empty `AssessmentData` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. Wrapped in an IIFE; published via `window.ReturnToWork`.
//
// Ported byte-for-byte from the Svelte engine (`src/lib/engine/types.ts`
// + `src/lib/stores/assessment.svelte.ts` `createDefaultAssessment()`).

(function () {
'use strict';
window.ReturnToWork =
  window.ReturnToWork || {};

/**
 * Build a fresh, fully-blank return-to-work record.
 * Strings default to ''; numeric / date fields default to null / '';
 * boolean adjustment fields default to false.
 */
function emptyAssessment() {
  return {
    clinician: {
      name: '',
      role: '',
      registrationNumber: '',
      site: '',
      signature: '',
      date: ''
    },
    patient: {
      nhsNumber: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      phone: '',
      email: '',
      employerName: '',
      employerOhContact: ''
    },
    job: {
      jobTitle: '',
      roleDescription: '',
      contractedHours: null,
      shiftPattern: '',
      safetyCritical: '',
      dvlaNotifiableRole: '',
      industrySector: ''
    },
    absence: {
      firstDayOfAbsence: '',
      totalDaysAbsent: null,
      priorMed3Ref: '',
      previousSelfCertification: ''
    },
    diagnosis: {
      primaryDiagnosis: '',
      diagnosisCode: '',
      comorbidConditions: '',
      mechanism: '',
      workplaceCause: '',
      riddorReference: ''
    },
    treatment: {
      currentMedications: '',
      ongoingTherapy: '',
      lastConsultationDate: '',
      recoveryTrajectory: ''
    },
    functional: {
      mobility: '',
      manualHandling: '',
      cognition: '',
      mood: '',
      sleep: '',
      pain: null,
      drivingCapacity: '',
      standingTolerance: '',
      sittingTolerance: '',
      screenTolerance: '',
      adlIndependence: ''
    },
    fitness: {
      outcome: '',
      clinicianConfidence: '',
      validFrom: '',
      validTo: '',
      validWeeks: null,
      reassessmentRequired: ''
    },
    phasedReturn: {
      applicable: '',
      startHoursPerWeek: null,
      targetFullHoursDate: '',
      daysPerWeek: null,
      supportContact: ''
    },
    adjustments: {
      alteredHours: false,
      amendedDuties: false,
      workplaceAdaptations: false,
      noHeavyLifting: false,
      liftingKgLimit: null,
      noDriving: false,
      noOperatingMachinery: false,
      noWorkingAtHeight: false,
      noLoneWorking: false,
      noNightShifts: false,
      noPatientContact: false,
      sedentaryOnly: false,
      noExposure: '',
      screenBreakFrequency: '',
      workstationReviewRequired: '',
      additionalAdjustments: ''
    },
    followUp: {
      reviewClinic: '',
      reviewDate: '',
      ohReferralMade: '',
      dvlaNotificationRequired: '',
      employerOhNotified: ''
    },
    signOff: {
      clinicianOverride: '',
      overrideOutcome: '',
      overrideReason: '',
      finalNotes: '',
      signature: ''
    }
  };
}

// ─── Label helpers (ported from engine/utils.ts) ──────────────────────

/** Human-readable fitness-statement label. Never blank. */
function fitnessStatementLabel(s) {
  switch (s) {
    case 'fit': return 'Fit for work';
    case 'may-be-fit': return 'May be fit for work — with adjustments';
    case 'not-fit': return 'Not fit for work';
    default: return s || '';
  }
}

/** Human-readable restriction-priority label. */
function restrictionPriorityLabel(p) {
  switch (p) {
    case 'routine': return 'Routine';
    case 'standard': return 'Standard';
    case 'restricted': return 'Restricted';
    case 'high-risk': return 'High-risk';
    default: return p || '';
  }
}

/** Restriction-grade label (used on the report per fired rule). */
function restrictionGradeLabel(grade) {
  switch (grade) {
    case 1: return 'Grade 1 — Routine';
    case 2: return 'Grade 2 — Standard';
    case 3: return 'Grade 3 — Restricted';
    case 4: return 'Grade 4 — High-risk';
    default: return `Grade ${grade}`;
  }
}

/** Human-readable clinician-role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'gp': return 'General Practitioner';
    case 'oh-physician': return 'Occupational-Health Physician';
    case 'hospital-consultant': return 'Hospital Consultant';
    case 'nurse': return 'Registered Nurse';
    case 'pharmacist': return 'Pharmacist';
    case 'physiotherapist': return 'Physiotherapist';
    case 'occupational-therapist': return 'Occupational Therapist';
    default: return 'Not stated';
  }
}

/** Human-readable absence-mechanism label. */
function mechanismLabel(m) {
  switch (m) {
    case 'illness': return 'Illness';
    case 'injury': return 'Injury';
    case 'surgery': return 'Surgery / procedure';
    case 'mental-health': return 'Mental health';
    case 'pregnancy-related': return 'Pregnancy-related';
    case 'other': return 'Other';
    default: return 'Not stated';
  }
}

/** Calculate age (whole years) from a date-of-birth string. Null if invalid. */
function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/** Map a restriction grade (1-4) to its priority key. */
function gradeToPriority(grade) {
  if (grade >= 4) return 'high-risk';
  if (grade >= 3) return 'restricted';
  if (grade >= 2) return 'standard';
  return 'routine';
}

Object.assign(window.ReturnToWork, {
  emptyAssessment,
  fitnessStatementLabel,
  restrictionPriorityLabel,
  restrictionGradeLabel,
  clinicianRoleLabel,
  mechanismLabel,
  calculateAge,
  gradeToPriority
});
})();
