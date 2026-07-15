import { hasNumber, hasText, isYesNoAnswered } from './types.js';

// WHO Emergency Unit Form: General — completeness validation rules.
//
// The form is a structured data-collection instrument for non-trauma
// emergency unit visits, not a scoring tool. Each rule below identifies
// a single field that must be completed for the encounter record to be
// acceptable. Conditional rules (e.g. ambulance level only when arrival
// mode = ambulance, admit ward only when disposition = admit) are gated
// with `applies()` so the validator only counts a rule when its branch
// is active for the patient's answers.
//
// Rule IDs follow the pattern <SECTION>-<NN>; the prefix lets the
// report group fired rules by section.

const euGeneralRules = [
  // ─── Step 1 — Patient Registration ────────────────────────
  {
    id: 'PR-01',
    section: 'patientRegistration',
    description: 'Patient surname (family name) is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.patientRegistration.surname)
  },
  {
    id: 'PR-02',
    section: 'patientRegistration',
    description: 'Patient first name (given name) is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.patientRegistration.firstName)
  },
  {
    id: 'PR-03',
    section: 'patientRegistration',
    description: 'Patient sex (Male / Female / Other) is required.',
    applies: () => true,
    isSatisfied: (d) =>
      d.patientRegistration.sex === 'male' ||
      d.patientRegistration.sex === 'female' ||
      d.patientRegistration.sex === 'other'
  },
  {
    id: 'PR-04',
    section: 'patientRegistration',
    description: 'Patient date of birth is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.patientRegistration.dateOfBirth)
  },
  {
    id: 'PR-05',
    section: 'patientRegistration',
    description: 'Date of arrival is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.patientRegistration.dateOfArrival)
  },
  {
    id: 'PR-06',
    section: 'patientRegistration',
    description: 'Time of arrival (24h) is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.patientRegistration.timeOfArrival)
  },
  {
    id: 'PR-07',
    section: 'patientRegistration',
    description: 'Arrival mode is required.',
    applies: () => true,
    isSatisfied: (d) => d.patientRegistration.arrivalMode !== ''
  },
  {
    id: 'PR-08',
    section: 'patientRegistration',
    description:
      'Ambulance level (Basic / Advanced) is required when arrival mode is ambulance.',
    applies: (d) => d.patientRegistration.arrivalMode === 'ambulance',
    isSatisfied: (d) =>
      d.patientRegistration.ambulanceLevel === 'basic' ||
      d.patientRegistration.ambulanceLevel === 'advanced'
  },

  // ─── Step 2 — Chief Complaint & Vitals ────────────────────
  {
    id: 'CV-01',
    section: 'chiefComplaintAndVitals',
    description: 'Chief complaint is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.chiefComplaintAndVitals.chiefComplaint)
  },
  {
    id: 'CV-02',
    section: 'chiefComplaintAndVitals',
    description: 'Triage category (red / orange / yellow / green) is required.',
    applies: () => true,
    isSatisfied: (d) => d.chiefComplaintAndVitals.triageCategory !== ''
  },
  {
    id: 'CV-03',
    section: 'chiefComplaintAndVitals',
    description: 'Initial vital signs time is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.chiefComplaintAndVitals.initialVitals.time)
  },
  {
    id: 'CV-04',
    section: 'chiefComplaintAndVitals',
    description: 'Initial pulse is required.',
    applies: () => true,
    isSatisfied: (d) => hasNumber(d.chiefComplaintAndVitals.initialVitals.pulse)
  },
  {
    id: 'CV-05',
    section: 'chiefComplaintAndVitals',
    description: 'Initial respiratory rate is required.',
    applies: () => true,
    isSatisfied: (d) =>
      hasNumber(d.chiefComplaintAndVitals.initialVitals.respiratoryRate)
  },
  {
    id: 'CV-06',
    section: 'chiefComplaintAndVitals',
    description: 'Initial SpO2 is required.',
    applies: () => true,
    isSatisfied: (d) => hasNumber(d.chiefComplaintAndVitals.initialVitals.spo2)
  },
  {
    id: 'CV-07',
    section: 'chiefComplaintAndVitals',
    description: 'Initial systolic blood pressure is required.',
    applies: () => true,
    isSatisfied: (d) =>
      hasNumber(d.chiefComplaintAndVitals.initialVitals.bpSystolic)
  },

  // ─── Step 4 — Airway ──────────────────────────────────────
  {
    id: 'A-01',
    section: 'airway',
    description: 'Airway: tick "Normal" or describe an abnormal finding.',
    applies: () => true,
    isSatisfied: (d) =>
      d.airway.normal ||
      d.airway.angioedema ||
      d.airway.stridor ||
      d.airway.voiceChanges ||
      d.airway.oralAirwayBurns ||
      d.airway.obstructedByTongue ||
      d.airway.obstructedByBlood ||
      d.airway.obstructedBySecretions ||
      d.airway.obstructedByVomit ||
      d.airway.obstructedByForeignBody ||
      hasText(d.airway.notes)
  },

  // ─── Step 5 — Breathing ───────────────────────────────────
  {
    id: 'B-01',
    section: 'breathing',
    description:
      'Breathing: tick "Normal" or record a respiratory rate / abnormal finding.',
    applies: () => true,
    isSatisfied: (d) =>
      d.breathing.normal ||
      hasNumber(d.breathing.spontaneousRespiratoryRate) ||
      d.breathing.chestRiseShallow ||
      d.breathing.chestRiseRetractions ||
      d.breathing.chestRiseParadoxical ||
      d.breathing.tracheaDeviatedLeft ||
      d.breathing.tracheaDeviatedRight ||
      hasText(d.breathing.breathSoundsLeft) ||
      hasText(d.breathing.breathSoundsRight) ||
      hasText(d.breathing.notes)
  },

  // ─── Step 6 — Circulation ─────────────────────────────────
  {
    id: 'C-01',
    section: 'circulation',
    description:
      'Circulation: tick "Normal" or record a skin / capillary-refill / pulse finding.',
    applies: () => true,
    isSatisfied: (d) =>
      d.circulation.normal ||
      d.circulation.skinWarm ||
      d.circulation.skinDry ||
      d.circulation.skinPale ||
      d.circulation.skinCyanotic ||
      d.circulation.skinMoist ||
      d.circulation.skinCool ||
      d.circulation.capillaryRefillUnder3 ||
      hasNumber(d.circulation.capillaryRefillSeconds) ||
      d.circulation.pulsesWeak ||
      d.circulation.pulsesAsymmetric ||
      isYesNoAnswered(d.circulation.jvd) ||
      hasText(d.circulation.notes)
  },

  // ─── Step 7 — Disability ──────────────────────────────────
  {
    id: 'D-01',
    section: 'disability',
    description: 'Disability: AVPU level (A / V / P / U) is required.',
    applies: () => true,
    isSatisfied: (d) =>
      d.disability.avpu === 'A' ||
      d.disability.avpu === 'V' ||
      d.disability.avpu === 'P' ||
      d.disability.avpu === 'U'
  },
  {
    id: 'D-02',
    section: 'disability',
    description:
      'Disability: deficit description is required when "Deficit" is checked.',
    applies: (d) => d.disability.deficit,
    isSatisfied: (d) => hasText(d.disability.deficitDescription)
  },

  // ─── Step 8 — History of Present Illness ──────────────────
  {
    id: 'HPI-01',
    section: 'historyOfPresentIllness',
    description: 'History of present illness narrative is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.historyOfPresentIllness.narrative)
  },

  // ─── Step 10 — Past Medical History ───────────────────────
  {
    id: 'PMH-01',
    section: 'pastMedicalHistory',
    description: 'History obtained from (source of history) is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.pastMedicalHistory.historyObtainedFrom)
  },
  {
    id: 'PMH-02',
    section: 'pastMedicalHistory',
    description: 'Medications: enter a list or tick "Unknown".',
    applies: () => true,
    isSatisfied: (d) =>
      d.pastMedicalHistory.medicationsUnknown ||
      hasText(d.pastMedicalHistory.medications)
  },
  {
    id: 'PMH-03',
    section: 'pastMedicalHistory',
    description: 'Allergies: enter a list or tick "Unknown".',
    applies: () => true,
    isSatisfied: (d) =>
      d.pastMedicalHistory.allergiesUnknown ||
      hasText(d.pastMedicalHistory.allergies)
  },

  // ─── Step 14 — Assessment & Plan ──────────────────────────
  {
    id: 'AP-01',
    section: 'assessmentAndPlan',
    description: 'Assessment & Plan narrative is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.assessmentAndPlan.narrative)
  },

  // ─── Step 16 — Disposition ────────────────────────────────
  {
    id: 'DISP-01',
    section: 'disposition',
    description: 'ED departure date is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.disposition.edDepartureDate)
  },
  {
    id: 'DISP-02',
    section: 'disposition',
    description: 'ED departure time (24h) is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.disposition.edDepartureTime)
  },
  {
    id: 'DISP-03',
    section: 'disposition',
    description: 'Disposition (Admit / Transfer / Discharge / Died) is required.',
    applies: () => true,
    isSatisfied: (d) =>
      d.disposition.disposition === 'admit' ||
      d.disposition.disposition === 'transfer' ||
      d.disposition.disposition === 'discharge' ||
      d.disposition.disposition === 'died'
  },
  {
    id: 'DISP-04',
    section: 'disposition',
    description: 'Diagnoses / Impressions are required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.disposition.diagnosesImpressions)
  },
  {
    id: 'DISP-05',
    section: 'disposition',
    description:
      'Admit ward (Ward / ICU / OT) is required when disposition is "Admit".',
    applies: (d) => d.disposition.disposition === 'admit',
    isSatisfied: (d) =>
      d.disposition.admitWard === 'ward' ||
      d.disposition.admitWard === 'icu' ||
      d.disposition.admitWard === 'ot'
  },
  {
    id: 'DISP-06',
    section: 'disposition',
    description:
      'Transfer destination is required when disposition is "Transfer".',
    applies: (d) => d.disposition.disposition === 'transfer',
    isSatisfied: (d) => hasText(d.disposition.transferTo)
  },
  {
    id: 'DISP-07',
    section: 'disposition',
    description:
      'Cause of death is required when disposition is "Died" (NOT cardiopulmonary arrest).',
    applies: (d) => d.disposition.disposition === 'died',
    isSatisfied: (d) => hasText(d.disposition.diedCause)
  },
  {
    id: 'DISP-08',
    section: 'disposition',
    description: 'Emergency unit provider name / title is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.disposition.emergencyUnitProvider)
  },
  {
    id: 'DISP-09',
    section: 'disposition',
    description: 'Provider signature is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.disposition.signature)
  },
  {
    id: 'DISP-10',
    section: 'disposition',
    description: 'Provider signature date is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.disposition.signatureDate)
  }
];

export { euGeneralRules };
