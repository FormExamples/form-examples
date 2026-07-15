// Plain-JavaScript / JSDoc type definitions for the Outpatient Outcome Report.
//
// Builds the canonical empty `AssessmentData` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. Wrapped in an IIFE; published via `window.OutpatientOutcome`.
//
// The form collects a full outpatient outcome report across ten data sections
// (patient details, encounter, operational efficiency, clinical outcome, three
// PROM instruments — EQ-5D-5L, GRC, PROMIS Global Health — a PREM instrument —
// Friends & Family Test — a follow-up plan, and clinician sign-off). The
// engine grades four domains (Clinical, PROM, PREM, Operational) A–E and takes
// the overall grade as the worst of the four ("highest severity wins").

/**
 * Build a fresh, fully-blank outpatient outcome report.
 * Strings default to ''; numeric / date / level fields default to null.
 */
function emptyAssessment() {
  return {
    patientDetails: {
      givenName: '',
      familyName: '',
      dateOfBirth: '',
      nhsNumber: '',
      sex: ''
    },
    encounterDetails: {
      clinicDate: '',
      specialty: '',
      clinicianName: '',
      modality: '',
      appointmentType: ''
    },
    operationalEfficiency: {
      referralDate: '',
      appointmentDate: '',
      waitTimeDays: null,
      serviceTargetDays: null,
      nhsAttendanceOutcome: ''
    },
    clinicalOutcome: {
      presentingComplaint: '',
      diagnosis: '',
      treatmentDelivered: '',
      outcomeClassification: ''
    },
    promEq5d5l: {
      beforeMobility: null,
      beforeSelfCare: null,
      beforeUsualActivities: null,
      beforePainDiscomfort: null,
      beforeAnxietyDepression: null,
      beforeVas: null,
      afterMobility: null,
      afterSelfCare: null,
      afterUsualActivities: null,
      afterPainDiscomfort: null,
      afterAnxietyDepression: null,
      afterVas: null
    },
    promGrc: {
      globalRatingOfChange: null,
      selfRatedHealth: ''
    },
    promPromis: {
      item1GeneralHealth: null,
      item2QualityOfLife: null,
      item3PhysicalHealth: null,
      item4MentalHealth: null,
      item5Satisfaction: null,
      item6FatigueFrequency: null,
      item7EmotionalProblems: null,
      item8SocialActivities: null,
      item9Pain: null,
      item10EverydayActivities: null,
      globalPhysicalHealthTScore: null,
      globalMentalHealthTScore: null
    },
    premFft: {
      fftResponse: '',
      fftComment: ''
    },
    followupPlan: {
      disposition: '',
      nextAppointmentDate: '',
      onwardReferralSpecialty: '',
      followupNotes: ''
    },
    signOff: {
      reportingClinicianName: '',
      reportingClinicianRole: '',
      signedOffAt: ''
    }
  };
}

// ----------------------------------------------------------------------
// Display-label lookups (report / dashboard rendering)
// ----------------------------------------------------------------------

/** Human-readable label for a domain grade A–E ('' = insufficient data). */
const GRADE_LABELS = {
  'A': 'A — Excellent outcome',
  'B': 'B — Good outcome',
  'C': 'C — Unchanged / Neutral outcome',
  'D': 'D — Poor outcome',
  'E': 'E — Very poor outcome',
  '': 'Unknown / Insufficient data'
};

/** Human-readable label for a domain grade, falling back to the unknown label. */
function gradeLabel(grade) {
  return GRADE_LABELS[grade] != null ? GRADE_LABELS[grade] : GRADE_LABELS[''];
}

const OUTCOME_LABELS = {
  'resolved': 'Resolved',
  'improved': 'Improved',
  'unchanged': 'Unchanged',
  'worsened': 'Worsened',
  'died': 'Died'
};

const FFT_LABELS = {
  'extremely_likely': 'Extremely likely',
  'likely': 'Likely',
  'neither': 'Neither likely nor unlikely',
  'unlikely': 'Unlikely',
  'extremely_unlikely': 'Extremely unlikely',
  'dont_know': "Don't know"
};

const ATTENDANCE_LABELS = {
  'attended_discharged': 'Attended — Discharged',
  'attended_follow_up': 'Attended — Follow-up booked',
  'attended_pifu': 'Attended — PIFU pathway',
  'attended_onward_referral': 'Attended — Onward referral',
  'patient_cancelled': 'Patient cancelled or rebooked',
  'patient_dna': 'Patient Did Not Attend (DNA)',
  'provider_cancelled': 'Provider cancelled'
};

const MODALITY_LABELS = {
  'in_person': 'In Person',
  'telephone': 'Telephone',
  'video': 'Video'
};

/** Generic label lookup, falling back to the raw value. */
function labelFrom(map, value) {
  return (map && map[value]) || value || '';
}

export { emptyAssessment, gradeLabel, labelFrom, GRADE_LABELS, OUTCOME_LABELS, FFT_LABELS, ATTENDANCE_LABELS, MODALITY_LABELS };
