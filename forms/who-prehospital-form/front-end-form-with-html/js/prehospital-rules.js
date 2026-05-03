// WHO Prehospital Form (SCF Prehospital) — completeness validation rules.
//
// The form is a structured prehospital documentation instrument for
// emergency medical services, not a scoring tool. Each rule below
// identifies a single field that must be completed for the run sheet to
// be acceptable. Conditional rules are gated through `applies()` so the
// validator only counts a rule when the relevant clinical branch is
// active. Notable triage-driven gates:
//   - RED triage: stricter requirements on airway, breathing,
//     circulation, disability documentation and IV access.
//   - Injury flag: requires intent and at least one mechanism.
//   - Disposition: handover provider/signature/time always required.
//
// Rule IDs follow the pattern <SECTION>-<NN>; the prefix lets the report
// group fired rules by section.

(function () {
'use strict';
window.WhoPrehospitalForm = window.WhoPrehospitalForm || {};
const { hasText, hasNumber, isYesNoAnswered } = window.WhoPrehospitalForm;

const prehospitalRules = [
  // ─── Step 1 — Caller & Scene ──────────────────────────────
  {
    id: 'CS-01',
    section: 'callerAndScene',
    description: 'Patient name is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.callerAndScene.patientName)
  },
  {
    id: 'CS-02',
    section: 'callerAndScene',
    description: 'Patient sex (Male / Female) is required.',
    applies: () => true,
    isSatisfied: (d) =>
      d.callerAndScene.sex === 'male' || d.callerAndScene.sex === 'female'
  },
  {
    id: 'CS-03',
    section: 'callerAndScene',
    description: 'Date of birth or age is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.callerAndScene.dateOfBirthOrAge)
  },
  {
    id: 'CS-04',
    section: 'callerAndScene',
    description: 'Run date is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.callerAndScene.date)
  },
  {
    id: 'CS-05',
    section: 'callerAndScene',
    description: 'Scene call type (Scene call / Inter-Facility Transfer) is required.',
    applies: () => true,
    isSatisfied: (d) => d.callerAndScene.sceneCallType !== ''
  },
  {
    id: 'CS-06',
    section: 'callerAndScene',
    description: 'Scene location & type is required.',
    applies: () => true,
    isSatisfied: (d) => d.callerAndScene.sceneLocationType !== ''
  },
  {
    id: 'CS-07',
    section: 'callerAndScene',
    description: 'Time call received is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.callerAndScene.timeCallReceived)
  },
  {
    id: 'CS-08',
    section: 'callerAndScene',
    description: 'Time arrived at scene is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.callerAndScene.timeArrivedAtScene)
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
    description: 'Initial vital signs time is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.chiefComplaintAndVitals.initialVitals.time)
  },
  {
    id: 'CV-03',
    section: 'chiefComplaintAndVitals',
    description: 'Initial heart rate (HR) is required.',
    applies: () => true,
    isSatisfied: (d) => hasNumber(d.chiefComplaintAndVitals.initialVitals.hr)
  },
  {
    id: 'CV-04',
    section: 'chiefComplaintAndVitals',
    description: 'Initial respiratory rate (RR) is required.',
    applies: () => true,
    isSatisfied: (d) => hasNumber(d.chiefComplaintAndVitals.initialVitals.rr)
  },
  {
    id: 'CV-05',
    section: 'chiefComplaintAndVitals',
    description: 'Initial blood pressure (BP) is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.chiefComplaintAndVitals.initialVitals.bp)
  },
  {
    id: 'CV-06',
    section: 'chiefComplaintAndVitals',
    description: 'Initial SpO2 is required.',
    applies: () => true,
    isSatisfied: (d) => hasNumber(d.chiefComplaintAndVitals.initialVitals.spo2)
  },

  // ─── Step 4 — Triage ──────────────────────────────────────
  {
    id: 'T-01',
    section: 'triage',
    description: 'Triage category (RED / YELLOW / GREEN) is required.',
    applies: () => true,
    isSatisfied: (d) =>
      d.triage.category === 'red' ||
      d.triage.category === 'yellow' ||
      d.triage.category === 'green'
  },

  // ─── Step 5 — Airway ──────────────────────────────────────
  {
    id: 'A-01',
    section: 'airway',
    description: 'Airway: tick "Normal" or describe an abnormal finding.',
    applies: () => true,
    isSatisfied: (d) =>
      d.airway.normal ||
      d.airway.voiceChanges ||
      d.airway.stridor ||
      d.airway.oralAirwayBurns ||
      d.airway.angioedema ||
      d.airway.obstructedByTongue ||
      d.airway.obstructedByBlood ||
      d.airway.obstructedBySecretions ||
      d.airway.obstructedByVomit ||
      d.airway.obstructedByForeignBody ||
      hasText(d.airway.notes)
  },
  {
    id: 'A-02',
    section: 'airway',
    description:
      'Airway: an airway intervention is required when triage is RED and Airway is not Normal.',
    applies: (d) => d.triage.category === 'red' && !d.airway.normal,
    isSatisfied: (d) =>
      d.airway.interventionRepositioning ||
      d.airway.interventionSuction ||
      d.airway.interventionOpa ||
      d.airway.interventionNpa ||
      d.airway.interventionLma ||
      d.airway.interventionBvm ||
      d.airway.interventionEtt
  },

  // ─── Step 6 — Breathing ───────────────────────────────────
  {
    id: 'B-01',
    section: 'breathing',
    description:
      'Breathing: tick "Normal" or record spontaneous respiration / abnormal finding.',
    applies: () => true,
    isSatisfied: (d) =>
      d.breathing.normal ||
      isYesNoAnswered(d.breathing.spontaneousRespiration) ||
      d.breathing.chestRiseShallow ||
      d.breathing.chestRiseRetractions ||
      d.breathing.chestRiseParadoxical ||
      d.breathing.tracheaDeviatedLeft ||
      d.breathing.tracheaDeviatedRight ||
      d.breathing.breathSoundsNormal ||
      hasText(d.breathing.breathSoundsNotes) ||
      hasText(d.breathing.notes)
  },

  // ─── Step 7 — Circulation ─────────────────────────────────
  {
    id: 'C-01',
    section: 'circulation',
    description:
      'Circulation: tick "Normal" or record skin / capillary refill / pulses / bleeding finding.',
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
      d.circulation.capillaryRefill3OrMore ||
      d.circulation.pulsesWeak ||
      d.circulation.pulsesAsymmetric ||
      isYesNoAnswered(d.circulation.jvd) ||
      hasText(d.circulation.activeBleedingSite) ||
      hasText(d.circulation.notes)
  },
  {
    id: 'C-02',
    section: 'circulation',
    description:
      'Circulation: bleeding control method is required when an active bleeding site is recorded.',
    applies: (d) => hasText(d.circulation.activeBleedingSite),
    isSatisfied: (d) =>
      d.circulation.bleedingControlledBandage ||
      d.circulation.bleedingControlledTourniquet ||
      d.circulation.bleedingControlledDirectPressure
  },
  {
    id: 'C-03',
    section: 'circulation',
    description:
      'Circulation: IV / IO access or IV fluids are required when triage is RED.',
    applies: (d) => d.triage.category === 'red',
    isSatisfied: (d) =>
      hasText(d.circulation.accessIvSite) ||
      hasText(d.circulation.accessIoSite) ||
      hasNumber(d.circulation.ivfMls) ||
      d.circulation.ivfNs ||
      d.circulation.ivfLr ||
      hasText(d.circulation.ivfOther)
  },

  // ─── Step 8 — Disability ──────────────────────────────────
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
      'Disability: GCS components (Eye / Verbal / Motor) are required when triage is RED.',
    applies: (d) => d.triage.category === 'red',
    isSatisfied: (d) =>
      hasNumber(d.disability.gcsEye) &&
      hasNumber(d.disability.gcsVerbal) &&
      hasNumber(d.disability.gcsMotor)
  },

  // ─── Step 10 — SAMPLE History ─────────────────────────────
  {
    id: 'SH-01',
    section: 'sampleHistory',
    description: 'SAMPLE: Allergies — enter a value or tick "Unknown".',
    applies: () => true,
    isSatisfied: (d) =>
      d.sampleHistory.allergiesUnknown || hasText(d.sampleHistory.allergies)
  },
  {
    id: 'SH-02',
    section: 'sampleHistory',
    description: 'SAMPLE: Medications — enter a value or tick "Unknown".',
    applies: () => true,
    isSatisfied: (d) =>
      d.sampleHistory.medicationsUnknown || hasText(d.sampleHistory.medications)
  },
  {
    id: 'SH-03',
    section: 'sampleHistory',
    description: 'SAMPLE: Past medical — enter a value or tick "Unknown".',
    applies: () => true,
    isSatisfied: (d) =>
      d.sampleHistory.pastMedicalUnknown || hasText(d.sampleHistory.pastMedical)
  },
  {
    id: 'SH-04',
    section: 'sampleHistory',
    description: 'SAMPLE: Events — enter a value or tick "Unknown".',
    applies: () => true,
    isSatisfied: (d) =>
      d.sampleHistory.eventsUnknown || hasText(d.sampleHistory.events)
  },

  // ─── Step 11 — Injury Details ─────────────────────────────
  {
    id: 'INJ-01',
    section: 'injuryDetails',
    description:
      'Injury intent (Intentional / Unintentional / Self-inflicted) is required when "Injury" is checked.',
    applies: (d) => d.chiefComplaintAndVitals.injury,
    isSatisfied: (d) =>
      d.injuryDetails.intent === 'intentional' ||
      d.injuryDetails.intent === 'unintentional' ||
      d.injuryDetails.intent === 'self-inflicted'
  },
  {
    id: 'INJ-02',
    section: 'injuryDetails',
    description: 'Injury mechanism is required when "Injury" is checked.',
    applies: (d) => d.chiefComplaintAndVitals.injury,
    isSatisfied: (d) => {
      const m = d.injuryDetails;
      return (
        m.mechanismFall ||
        m.mechanismHitByFallingObject ||
        m.mechanismStabCut ||
        m.mechanismGunshot ||
        m.mechanismSexualAssault ||
        m.mechanismOtherBluntForce ||
        m.mechanismSuffocationChokingHanging ||
        m.mechanismDrowning ||
        hasText(m.mechanismBurnCausedBy) ||
        m.mechanismPoisoningToxicExposure ||
        m.mechanismUnknown ||
        hasText(m.mechanismOther)
      );
    }
  },

  // ─── Step 14 — Assessment & Plan ──────────────────────────
  {
    id: 'AP-01',
    section: 'assessmentAndPlan',
    description: 'Assessment & Plan summary is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.assessmentAndPlan.summary)
  },
  {
    id: 'AP-02',
    section: 'assessmentAndPlan',
    description: 'Presumptive diagnoses are required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.assessmentAndPlan.presumptiveDiagnoses)
  },

  // ─── Step 16 — Disposition ────────────────────────────────
  {
    id: 'DISP-01',
    section: 'disposition',
    description: 'Disposition is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.disposition.disposition)
  },
  {
    id: 'DISP-02',
    section: 'disposition',
    description: 'Handover time is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.disposition.handoverTime)
  },
  {
    id: 'DISP-03',
    section: 'disposition',
    description: 'Handover recipient name is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.disposition.handoverToName)
  },
  {
    id: 'DISP-04',
    section: 'disposition',
    description: 'Provider name is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.disposition.providerName)
  },
  {
    id: 'DISP-05',
    section: 'disposition',
    description: 'Provider signature is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.disposition.providerSignature)
  },
  {
    id: 'DISP-06',
    section: 'disposition',
    description: 'Provider signature date is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.disposition.providerSignatureDate)
  }
];

window.WhoPrehospitalForm.prehospitalRules = prehospitalRules;
})();
