import { hasNumber, hasText, isYesNoAnswered } from './types.js';

// WHO Emergency Unit Form: Trauma — completeness rules.
//
// The form is a structured data-collection instrument for emergency
// unit trauma encounters, not a scoring tool. Each rule below
// identifies a single field that must be completed for the encounter
// record to be acceptable. Conditional rules (e.g. cause of death only
// when disposition = died, time of death only when dead-on-arrival,
// road-traffic mechanism, etc.) are gated with `applies()` so the
// validator only counts a rule when its branch is active for the
// patient's answers.
//
// Triage-driven required fields ratchet the bar up for RED triage
// patients: they must have spine stabilisation status recorded and
// either a numeric GCS total or a "Qualified GCS" tick.
//
// Rule IDs follow the pattern <SECTION>-<NN>; the prefix lets the
// report group fired rules by section.

const euTraumaRules = [
  // ─── Step 1 — Patient Registration ────────────────────────
  {
    id: 'PR-01',
    section: 'patientRegistration',
    description: 'Patient surname (family name) is required.',
    applies: function () { return true; },
    isSatisfied: function (d) { return hasText(d.patientRegistration.surname); }
  },
  {
    id: 'PR-02',
    section: 'patientRegistration',
    description: 'Patient first name (given name) is required.',
    applies: function () { return true; },
    isSatisfied: function (d) { return hasText(d.patientRegistration.firstName); }
  },
  {
    id: 'PR-03',
    section: 'patientRegistration',
    description: 'Patient sex (Male / Female / Other) is required.',
    applies: function () { return true; },
    isSatisfied: function (d) {
      const s = d.patientRegistration.sex;
      return s === 'male' || s === 'female' || s === 'other';
    }
  },
  {
    id: 'PR-04',
    section: 'patientRegistration',
    description: 'Patient date of birth is required.',
    applies: function () { return true; },
    isSatisfied: function (d) { return hasText(d.patientRegistration.dateOfBirth); }
  },
  {
    id: 'PR-05',
    section: 'patientRegistration',
    description: 'Date of arrival is required.',
    applies: function () { return true; },
    isSatisfied: function (d) { return hasText(d.patientRegistration.dateOfArrival); }
  },
  {
    id: 'PR-06',
    section: 'patientRegistration',
    description: 'Time of arrival (24h) is required.',
    applies: function () { return true; },
    isSatisfied: function (d) { return hasText(d.patientRegistration.timeOfArrival); }
  },
  {
    id: 'PR-07',
    section: 'patientRegistration',
    description: 'Arrival mode is required.',
    applies: function () { return true; },
    isSatisfied: function (d) { return d.patientRegistration.arrivalMode !== ''; }
  },
  {
    id: 'PR-08',
    section: 'patientRegistration',
    description: 'Injury location (or "Unknown") is required.',
    applies: function () { return true; },
    isSatisfied: function (d) {
      return d.patientRegistration.injuryLocationUnknown ||
        hasText(d.patientRegistration.injuryLocation);
    }
  },

  // ─── Step 2 — Chief Complaint & Vitals ────────────────────
  {
    id: 'CV-01',
    section: 'chiefComplaintAndVitals',
    description: 'Chief complaint is required.',
    applies: function () { return true; },
    isSatisfied: function (d) { return hasText(d.chiefComplaintAndVitals.chiefComplaint); }
  },
  {
    id: 'CV-02',
    section: 'chiefComplaintAndVitals',
    description: 'Allergies: enter a list or tick "Unknown".',
    applies: function () { return true; },
    isSatisfied: function (d) {
      return d.chiefComplaintAndVitals.allergiesUnknown ||
        hasText(d.chiefComplaintAndVitals.allergies);
    }
  },
  {
    id: 'CV-03',
    section: 'chiefComplaintAndVitals',
    description: 'Initial vital signs time is required.',
    applies: function () { return true; },
    isSatisfied: function (d) { return hasText(d.chiefComplaintAndVitals.initialVitals.time); }
  },
  {
    id: 'CV-04',
    section: 'chiefComplaintAndVitals',
    description: 'Initial pulse is required.',
    applies: function (d) { return !d.chiefComplaintAndVitals.deadOnArrival; },
    isSatisfied: function (d) { return hasNumber(d.chiefComplaintAndVitals.initialVitals.pulse); }
  },
  {
    id: 'CV-05',
    section: 'chiefComplaintAndVitals',
    description: 'Initial respiratory rate is required.',
    applies: function (d) { return !d.chiefComplaintAndVitals.deadOnArrival; },
    isSatisfied: function (d) { return hasNumber(d.chiefComplaintAndVitals.initialVitals.respiratoryRate); }
  },
  {
    id: 'CV-06',
    section: 'chiefComplaintAndVitals',
    description: 'Initial SpO2 is required.',
    applies: function (d) { return !d.chiefComplaintAndVitals.deadOnArrival; },
    isSatisfied: function (d) { return hasNumber(d.chiefComplaintAndVitals.initialVitals.spo2); }
  },
  {
    id: 'CV-07',
    section: 'chiefComplaintAndVitals',
    description: 'Initial systolic blood pressure is required.',
    applies: function (d) { return !d.chiefComplaintAndVitals.deadOnArrival; },
    isSatisfied: function (d) { return hasNumber(d.chiefComplaintAndVitals.initialVitals.bpSystolic); }
  },
  {
    id: 'CV-08',
    section: 'chiefComplaintAndVitals',
    description: 'Time of death is required when patient is marked Dead on arrival.',
    applies: function (d) { return d.chiefComplaintAndVitals.deadOnArrival; },
    isSatisfied: function (d) { return hasText(d.chiefComplaintAndVitals.timeOfDeath); }
  },

  // ─── Step 4 — Triage ──────────────────────────────────────
  {
    id: 'T-01',
    section: 'triage',
    description: 'Triage category (RED / YELLOW / GREEN) is required.',
    applies: function () { return true; },
    isSatisfied: function (d) {
      const c = d.triage.category;
      return c === 'red' || c === 'yellow' || c === 'green';
    }
  },

  // ─── Step 5 — Airway ──────────────────────────────────────
  {
    id: 'A-01',
    section: 'airway',
    description: 'Airway: tick "Normal" or describe an abnormal finding.',
    applies: function () { return true; },
    isSatisfied: function (d) {
      const a = d.airway;
      return (
        a.normal ||
        a.swelling ||
        a.stridor ||
        a.voiceChanges ||
        a.burns ||
        a.obstructedByTongue ||
        a.obstructedByBlood ||
        a.obstructedBySecretion ||
        a.obstructedByVomit ||
        a.obstructedByForeignBody ||
        hasText(a.notes)
      );
    }
  },
  {
    id: 'A-02',
    section: 'airway',
    description: 'Spine stabilization status is required for RED triage.',
    applies: function (d) { return d.triage.category === 'red'; },
    isSatisfied: function (d) {
      const s = d.airway.spineStabilized;
      return s === 'before-arrival' || s === 'in-eu' || s === 'not-needed';
    }
  },

  // ─── Step 6 — Breathing ───────────────────────────────────
  {
    id: 'B-01',
    section: 'breathing',
    description:
      'Breathing: tick "Normal" or record a respiratory rate / abnormal finding.',
    applies: function () { return true; },
    isSatisfied: function (d) {
      const b = d.breathing;
      return (
        b.normal ||
        hasNumber(b.spontaneousRespiratoryRate) ||
        b.chestRiseShallow ||
        b.chestRiseRetractions ||
        b.chestRiseParadoxical ||
        b.tracheaDeviatedLeft ||
        b.tracheaDeviatedRight ||
        b.cyanosis ||
        hasText(b.breathSoundsLeft) ||
        hasText(b.breathSoundsRight) ||
        hasText(b.notes)
      );
    }
  },

  // ─── Step 7 — Circulation ─────────────────────────────────
  {
    id: 'C-01',
    section: 'circulation',
    description:
      'Circulation: tick "Normal" or record a skin / capillary-refill / pulse / bleeding finding.',
    applies: function () { return true; },
    isSatisfied: function (d) {
      const c = d.circulation;
      return (
        c.normal ||
        c.skinWarm ||
        c.skinDry ||
        c.skinCool ||
        c.skinMoist ||
        c.skinPale ||
        c.capillaryRefillUnder3 ||
        hasNumber(c.capillaryRefillSeconds) ||
        c.pulsesWeak ||
        c.pulsesAsymmetric ||
        isYesNoAnswered(c.jvd) ||
        isYesNoAnswered(c.unstablePelvis) ||
        c.bleedingControlDirectPressure ||
        c.bleedingControlBandage ||
        c.bleedingControlTourniquet ||
        hasText(c.notes)
      );
    }
  },

  // ─── Step 8 — Disability ──────────────────────────────────
  {
    id: 'D-01',
    section: 'disability',
    description: 'Disability: AVPU level (A / V / P / U) is required.',
    applies: function () { return true; },
    isSatisfied: function (d) {
      const a = d.disability.avpu;
      return a === 'A' || a === 'V' || a === 'P' || a === 'U';
    }
  },
  {
    id: 'D-02',
    section: 'disability',
    description:
      'Disability: GCS total is required (or tick "Qualified" if patient is sedated/intubated).',
    applies: function (d) { return d.triage.category === 'red'; },
    isSatisfied: function (d) {
      return d.disability.gcsQualified || hasNumber(d.disability.gcsTotal);
    }
  },

  // ─── Step 10 — Injury History ─────────────────────────────
  {
    id: 'IH-01',
    section: 'injuryHistory',
    description: 'Date of injury is required.',
    applies: function () { return true; },
    isSatisfied: function (d) { return hasText(d.injuryHistory.dateOfInjury); }
  },
  {
    id: 'IH-02',
    section: 'injuryHistory',
    description: 'Time of injury (24h) is required.',
    applies: function () { return true; },
    isSatisfied: function (d) { return hasText(d.injuryHistory.timeOfInjury); }
  },
  {
    id: 'IH-03',
    section: 'injuryHistory',
    description: 'Intent of injury is required.',
    applies: function () { return true; },
    isSatisfied: function (d) { return d.injuryHistory.intent !== ''; }
  },
  {
    id: 'IH-04',
    section: 'injuryHistory',
    description: 'Prehospital care provider (None / Layperson / Healthcare professional) is required.',
    applies: function () { return true; },
    isSatisfied: function (d) {
      const p = d.injuryHistory.prehospitalCareProvider;
      return p === 'none' || p === 'layperson' || p === 'healthcare-professional';
    }
  },
  {
    id: 'IH-05',
    section: 'injuryHistory',
    description: 'Mechanism of injury must be recorded (tick at least one or "Unknown").',
    applies: function () { return true; },
    isSatisfied: function (d) {
      const i = d.injuryHistory;
      return (
        i.mechRoadTrafficIncident ||
        hasText(i.mechFallFrom) ||
        i.mechHitByFallingObject ||
        i.mechStabCut ||
        i.mechGunshot ||
        i.mechSexualAssault ||
        i.mechOtherBluntForce ||
        i.mechSuffocationChokingHanging ||
        i.mechDrowning ||
        hasText(i.mechBurnCausedBy) ||
        i.mechPoisoningToxicExposure ||
        i.mechUnknown
      );
    }
  },

  // ─── Step 11 — Past Histories ─────────────────────────────
  {
    id: 'PH-01',
    section: 'pastHistories',
    description: 'Past medical: tick None / Unknown or record a condition.',
    applies: function () { return true; },
    isSatisfied: function (d) {
      const h = d.pastHistories;
      return (
        h.pmhNone ||
        h.pmhUnknown ||
        h.pmhHtn ||
        h.pmhDm ||
        h.pmhCopd ||
        h.pmhPsych ||
        h.pmhRenalDisease ||
        hasText(h.pmhOther)
      );
    }
  },
  {
    id: 'PH-02',
    section: 'pastHistories',
    description: 'Medications: list or tick None / Unknown.',
    applies: function () { return true; },
    isSatisfied: function (d) {
      const h = d.pastHistories;
      return h.medicationsNone || h.medicationsUnknown || hasText(h.medications);
    }
  },

  // ─── Step 13 — Assessment & Plan ──────────────────────────
  {
    id: 'AP-01',
    section: 'assessmentAndPlan',
    description: 'Assessment & Plan narrative is required.',
    applies: function () { return true; },
    isSatisfied: function (d) { return hasText(d.assessmentAndPlan.narrative); }
  },

  // ─── Step 17 — Disposition ────────────────────────────────
  {
    id: 'DISP-01',
    section: 'disposition',
    description: 'ED departure date is required.',
    applies: function () { return true; },
    isSatisfied: function (d) { return hasText(d.disposition.edDepartureDate); }
  },
  {
    id: 'DISP-02',
    section: 'disposition',
    description: 'ED departure time (24h) is required.',
    applies: function () { return true; },
    isSatisfied: function (d) { return hasText(d.disposition.edDepartureTime); }
  },
  {
    id: 'DISP-03',
    section: 'disposition',
    description: 'Disposition (Admit / Transfer / Discharge / Died) is required.',
    applies: function () { return true; },
    isSatisfied: function (d) {
      const x = d.disposition.disposition;
      return x === 'admit' || x === 'transfer' || x === 'discharge' || x === 'died';
    }
  },
  {
    id: 'DISP-04',
    section: 'disposition',
    description: 'Diagnoses / Impressions are required.',
    applies: function () { return true; },
    isSatisfied: function (d) { return hasText(d.disposition.diagnosesImpressions); }
  },
  {
    id: 'DISP-05',
    section: 'disposition',
    description: 'Admit ward (Ward / ICU / OT) is required when disposition is "Admit".',
    applies: function (d) { return d.disposition.disposition === 'admit'; },
    isSatisfied: function (d) {
      const w = d.disposition.admitWard;
      return w === 'ward' || w === 'icu' || w === 'ot';
    }
  },
  {
    id: 'DISP-06',
    section: 'disposition',
    description: 'Transfer destination is required when disposition is "Transfer".',
    applies: function (d) { return d.disposition.disposition === 'transfer'; },
    isSatisfied: function (d) { return hasText(d.disposition.transferTo); }
  },
  {
    id: 'DISP-07',
    section: 'disposition',
    description:
      'Cause of death is required when disposition is "Died" (NOT cardiopulmonary arrest).',
    applies: function (d) { return d.disposition.disposition === 'died'; },
    isSatisfied: function (d) { return hasText(d.disposition.diedCause); }
  },
  {
    id: 'DISP-08',
    section: 'disposition',
    description: 'Emergency unit provider name / title is required.',
    applies: function () { return true; },
    isSatisfied: function (d) { return hasText(d.disposition.emergencyUnitProvider); }
  },
  {
    id: 'DISP-09',
    section: 'disposition',
    description: 'Provider signature is required.',
    applies: function () { return true; },
    isSatisfied: function (d) { return hasText(d.disposition.signature); }
  },
  {
    id: 'DISP-10',
    section: 'disposition',
    description: 'Provider signature date is required.',
    applies: function () { return true; },
    isSatisfied: function (d) { return hasText(d.disposition.signatureDate); }
  }
];

export { euTraumaRules };
