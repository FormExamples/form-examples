import type { ValidationRule } from './types';
import { hasNumber, hasText, isYesNoAnswered } from './utils';

/**
 * WHO Emergency Unit Form: Trauma — completeness rules.
 *
 * The form is a structured data-collection instrument for emergency unit
 * trauma encounters, not a scoring tool. Each rule below identifies a
 * single field that must be completed for the encounter record to be
 * acceptable. Conditional rules (e.g. cause of death only when disposition
 * = died, time of death only when dead-on-arrival, ambulance level when
 * arrival mode = ambulance, etc.) are gated with `applies()` so the
 * validator only counts a rule when its branch is active for the
 * patient's answers.
 *
 * Triage-driven required fields ratchet the bar up for RED triage
 * patients: they must have airway and breathing assessed (Normal tick or
 * abnormal finding) and a recorded GCS / AVPU.
 *
 * Rule IDs follow the pattern <SECTION>-<NN>; the prefix lets the report
 * group fired rules by section.
 */
export const euTraumaRules: ValidationRule[] = [
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
		description: 'Injury location (or "Unknown") is required.',
		applies: () => true,
		isSatisfied: (d) =>
			d.patientRegistration.injuryLocationUnknown ||
			hasText(d.patientRegistration.injuryLocation)
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
		description: 'Allergies: enter a list or tick "Unknown".',
		applies: () => true,
		isSatisfied: (d) =>
			d.chiefComplaintAndVitals.allergiesUnknown ||
			hasText(d.chiefComplaintAndVitals.allergies)
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
		applies: (d) => !d.chiefComplaintAndVitals.deadOnArrival,
		isSatisfied: (d) => hasNumber(d.chiefComplaintAndVitals.initialVitals.pulse)
	},
	{
		id: 'CV-05',
		section: 'chiefComplaintAndVitals',
		description: 'Initial respiratory rate is required.',
		applies: (d) => !d.chiefComplaintAndVitals.deadOnArrival,
		isSatisfied: (d) => hasNumber(d.chiefComplaintAndVitals.initialVitals.respiratoryRate)
	},
	{
		id: 'CV-06',
		section: 'chiefComplaintAndVitals',
		description: 'Initial SpO2 is required.',
		applies: (d) => !d.chiefComplaintAndVitals.deadOnArrival,
		isSatisfied: (d) => hasNumber(d.chiefComplaintAndVitals.initialVitals.spo2)
	},
	{
		id: 'CV-07',
		section: 'chiefComplaintAndVitals',
		description: 'Initial systolic blood pressure is required.',
		applies: (d) => !d.chiefComplaintAndVitals.deadOnArrival,
		isSatisfied: (d) => hasNumber(d.chiefComplaintAndVitals.initialVitals.bpSystolic)
	},
	{
		id: 'CV-08',
		section: 'chiefComplaintAndVitals',
		description: 'Time of death is required when patient is marked Dead on arrival.',
		applies: (d) => d.chiefComplaintAndVitals.deadOnArrival,
		isSatisfied: (d) => hasText(d.chiefComplaintAndVitals.timeOfDeath)
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
			d.airway.swelling ||
			d.airway.stridor ||
			d.airway.voiceChanges ||
			d.airway.burns ||
			d.airway.obstructedByTongue ||
			d.airway.obstructedByBlood ||
			d.airway.obstructedBySecretion ||
			d.airway.obstructedByVomit ||
			d.airway.obstructedByForeignBody ||
			hasText(d.airway.notes)
	},
	{
		id: 'A-02',
		section: 'airway',
		description: 'Spine stabilization status is required for RED triage.',
		applies: (d) => d.triage.category === 'red',
		isSatisfied: (d) =>
			d.airway.spineStabilized === 'before-arrival' ||
			d.airway.spineStabilized === 'in-eu' ||
			d.airway.spineStabilized === 'not-needed'
	},

	// ─── Step 6 — Breathing ───────────────────────────────────
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
			d.breathing.cyanosis ||
			hasText(d.breathing.breathSoundsLeft) ||
			hasText(d.breathing.breathSoundsRight) ||
			hasText(d.breathing.notes)
	},

	// ─── Step 7 — Circulation ─────────────────────────────────
	{
		id: 'C-01',
		section: 'circulation',
		description:
			'Circulation: tick "Normal" or record a skin / capillary-refill / pulse / bleeding finding.',
		applies: () => true,
		isSatisfied: (d) =>
			d.circulation.normal ||
			d.circulation.skinWarm ||
			d.circulation.skinDry ||
			d.circulation.skinCool ||
			d.circulation.skinMoist ||
			d.circulation.skinPale ||
			d.circulation.capillaryRefillUnder3 ||
			hasNumber(d.circulation.capillaryRefillSeconds) ||
			d.circulation.pulsesWeak ||
			d.circulation.pulsesAsymmetric ||
			isYesNoAnswered(d.circulation.jvd) ||
			isYesNoAnswered(d.circulation.unstablePelvis) ||
			d.circulation.bleedingControlDirectPressure ||
			d.circulation.bleedingControlBandage ||
			d.circulation.bleedingControlTourniquet ||
			hasText(d.circulation.notes)
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
			'Disability: GCS total is required (or tick "Qualified" if patient is sedated/intubated).',
		applies: (d) => d.triage.category === 'red',
		isSatisfied: (d) =>
			d.disability.gcsQualified || hasNumber(d.disability.gcsTotal)
	},

	// ─── Step 10 — Injury History ─────────────────────────────
	{
		id: 'IH-01',
		section: 'injuryHistory',
		description: 'Date of injury is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.injuryHistory.dateOfInjury)
	},
	{
		id: 'IH-02',
		section: 'injuryHistory',
		description: 'Time of injury (24h) is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.injuryHistory.timeOfInjury)
	},
	{
		id: 'IH-03',
		section: 'injuryHistory',
		description: 'Intent of injury is required.',
		applies: () => true,
		isSatisfied: (d) => d.injuryHistory.intent !== ''
	},
	{
		id: 'IH-04',
		section: 'injuryHistory',
		description: 'Prehospital care provider (None / Layperson / Healthcare professional) is required.',
		applies: () => true,
		isSatisfied: (d) =>
			d.injuryHistory.prehospitalCareProvider === 'none' ||
			d.injuryHistory.prehospitalCareProvider === 'layperson' ||
			d.injuryHistory.prehospitalCareProvider === 'healthcare-professional'
	},
	{
		id: 'IH-05',
		section: 'injuryHistory',
		description: 'Mechanism of injury must be recorded (tick at least one or "Unknown").',
		applies: () => true,
		isSatisfied: (d) =>
			d.injuryHistory.mechRoadTrafficIncident ||
			hasText(d.injuryHistory.mechFallFrom) ||
			d.injuryHistory.mechHitByFallingObject ||
			d.injuryHistory.mechStabCut ||
			d.injuryHistory.mechGunshot ||
			d.injuryHistory.mechSexualAssault ||
			d.injuryHistory.mechOtherBluntForce ||
			d.injuryHistory.mechSuffocationChokingHanging ||
			d.injuryHistory.mechDrowning ||
			hasText(d.injuryHistory.mechBurnCausedBy) ||
			d.injuryHistory.mechPoisoningToxicExposure ||
			d.injuryHistory.mechUnknown
	},

	// ─── Step 11 — Past Histories ─────────────────────────────
	{
		id: 'PH-01',
		section: 'pastHistories',
		description: 'Past medical: tick None / Unknown or record a condition.',
		applies: () => true,
		isSatisfied: (d) =>
			d.pastHistories.pmhNone ||
			d.pastHistories.pmhUnknown ||
			d.pastHistories.pmhHtn ||
			d.pastHistories.pmhDm ||
			d.pastHistories.pmhCopd ||
			d.pastHistories.pmhPsych ||
			d.pastHistories.pmhRenalDisease ||
			hasText(d.pastHistories.pmhOther)
	},
	{
		id: 'PH-02',
		section: 'pastHistories',
		description: 'Medications: list or tick None / Unknown.',
		applies: () => true,
		isSatisfied: (d) =>
			d.pastHistories.medicationsNone ||
			d.pastHistories.medicationsUnknown ||
			hasText(d.pastHistories.medications)
	},

	// ─── Step 13 — Assessment & Plan ──────────────────────────
	{
		id: 'AP-01',
		section: 'assessmentAndPlan',
		description: 'Assessment & Plan narrative is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.assessmentAndPlan.narrative)
	},

	// ─── Step 17 — Disposition ────────────────────────────────
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
		description: 'Admit ward (Ward / ICU / OT) is required when disposition is "Admit".',
		applies: (d) => d.disposition.disposition === 'admit',
		isSatisfied: (d) =>
			d.disposition.admitWard === 'ward' ||
			d.disposition.admitWard === 'icu' ||
			d.disposition.admitWard === 'ot'
	},
	{
		id: 'DISP-06',
		section: 'disposition',
		description: 'Transfer destination is required when disposition is "Transfer".',
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
