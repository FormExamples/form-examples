import { describe, expect, it } from 'vitest';
import { euGeneralRules } from './eu-general-rules';
import { detectFlaggedIssues } from './flagged-issues';
import { validateEuGeneral } from './eu-general-validator';
import { createDefaultAssessment } from '../stores/assessment.svelte';
import type { AssessmentData } from './types';

function emptyAssessment(): AssessmentData {
	return createDefaultAssessment();
}

/**
 * Build a minimal-but-complete encounter record. Every required field for
 * an unremarkable adult walk-in (arrival mode = walk → no ambulance level
 * required) discharged after evaluation is satisfied with the simplest
 * possible answer.
 */
function minimalCompleteAssessment(): AssessmentData {
	const d = emptyAssessment();

	// Step 1 — Patient Registration
	d.patientRegistration.surname = 'Doe';
	d.patientRegistration.firstName = 'Jane';
	d.patientRegistration.sex = 'female';
	d.patientRegistration.dateOfBirth = '1985-06-15';
	d.patientRegistration.dateOfArrival = '2025-04-20';
	d.patientRegistration.timeOfArrival = '14:30';
	d.patientRegistration.arrivalMode = 'walk';

	// Step 2 — Chief Complaint & Vitals
	d.chiefComplaintAndVitals.chiefComplaint = 'Headache';
	d.chiefComplaintAndVitals.triageCategory = 'green';
	d.chiefComplaintAndVitals.initialVitals.time = '14:35';
	d.chiefComplaintAndVitals.initialVitals.pulse = 78;
	d.chiefComplaintAndVitals.initialVitals.respiratoryRate = 16;
	d.chiefComplaintAndVitals.initialVitals.spo2 = 98;
	d.chiefComplaintAndVitals.initialVitals.bpSystolic = 120;
	d.chiefComplaintAndVitals.initialVitals.bpDiastolic = 80;

	// Step 4 — Airway: Normal tick is enough
	d.airway.normal = true;
	// Step 5 — Breathing: Normal tick is enough
	d.breathing.normal = true;
	// Step 6 — Circulation: Normal tick is enough
	d.circulation.normal = true;

	// Step 7 — Disability: AVPU = A
	d.disability.avpu = 'A';

	// Step 8 — HPI
	d.historyOfPresentIllness.narrative = 'Mild headache for 2 days, no associated symptoms.';

	// Step 10 — PMH
	d.pastMedicalHistory.historyObtainedFrom = 'Patient';
	d.pastMedicalHistory.medicationsUnknown = true;
	d.pastMedicalHistory.allergiesUnknown = true;

	// Step 14 — Assessment & Plan
	d.assessmentAndPlan.narrative = 'Tension headache. Discharge with paracetamol and follow-up.';

	// Step 16 — Disposition
	d.disposition.edDepartureDate = '2025-04-20';
	d.disposition.edDepartureTime = '16:00';
	d.disposition.diagnosesImpressions = 'Tension headache.';
	d.disposition.disposition = 'discharge';
	d.disposition.dischargePlanDiscussed = 'yes';
	d.disposition.emergencyUnitProvider = 'Dr. Smith, MD';
	d.disposition.signature = 'A. Smith';
	d.disposition.signatureDate = '2025-04-20';

	return d;
}

describe('EU General rule set', () => {
	it('has a non-empty rule set', () => {
		expect(euGeneralRules.length).toBeGreaterThan(0);
	});

	it('all rule IDs are unique', () => {
		const ids = euGeneralRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('every rule references a known section', () => {
		const validSections = new Set([
			'patientRegistration',
			'chiefComplaintAndVitals',
			'highRiskSigns',
			'airway',
			'breathing',
			'circulation',
			'disability',
			'historyOfPresentIllness',
			'reviewOfSystems',
			'pastMedicalHistory',
			'physicalExam',
			'diagnostics',
			'additionalInterventions',
			'assessmentAndPlan',
			'reassessment',
			'disposition'
		]);
		for (const r of euGeneralRules) {
			expect(validSections.has(r.section)).toBe(true);
		}
	});
});

describe('EU General validator', () => {
	it('marks an empty assessment as incomplete', () => {
		const result = validateEuGeneral(emptyAssessment());
		expect(result.complete).toBe(false);
		expect(result.totalSatisfied).toBe(0);
		expect(result.missing.length).toBe(result.totalRequired);
	});

	it('marks a minimal-but-complete walk-in submission as complete', () => {
		const result = validateEuGeneral(minimalCompleteAssessment());
		expect(result.complete).toBe(true);
		expect(result.missing).toHaveLength(0);
		expect(result.totalSatisfied).toBe(result.totalRequired);
	});

	it('ambulance level is required when arrival mode is ambulance', () => {
		const d = minimalCompleteAssessment();
		d.patientRegistration.arrivalMode = 'ambulance';
		d.patientRegistration.ambulanceLevel = '';
		const result = validateEuGeneral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('PR-08');
	});

	it('ambulance level rule passes when an ambulance level is selected', () => {
		const d = minimalCompleteAssessment();
		d.patientRegistration.arrivalMode = 'ambulance';
		d.patientRegistration.ambulanceLevel = 'advanced';
		const result = validateEuGeneral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('PR-08');
	});

	it('disability deficit description is required when deficit is checked', () => {
		const d = minimalCompleteAssessment();
		d.disability.deficit = true;
		d.disability.deficitDescription = '';
		const result = validateEuGeneral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('D-02');
	});

	it('admit ward is required when disposition is admit', () => {
		const d = minimalCompleteAssessment();
		d.disposition.disposition = 'admit';
		d.disposition.admitWard = '';
		const result = validateEuGeneral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('DISP-05');
	});

	it('transfer destination is required when disposition is transfer', () => {
		const d = minimalCompleteAssessment();
		d.disposition.disposition = 'transfer';
		d.disposition.transferTo = '';
		const result = validateEuGeneral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('DISP-06');
	});

	it('cause of death is required when disposition is died', () => {
		const d = minimalCompleteAssessment();
		d.disposition.disposition = 'died';
		d.disposition.diedCause = '';
		const result = validateEuGeneral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('DISP-07');
	});

	it('groups missing items by section and section sums match totals', () => {
		const result = validateEuGeneral(emptyAssessment());
		for (const s of result.sections) {
			expect(s.missing.length).toBe(s.required - s.satisfied);
		}
	});

	it('Airway: passes with notes alone (no Normal tick)', () => {
		const d = minimalCompleteAssessment();
		d.airway.normal = false;
		d.airway.notes = 'Patent, no obstruction.';
		const result = validateEuGeneral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('A-01');
	});

	it('Airway: passes when an obstruction checkbox is ticked instead of Normal', () => {
		const d = minimalCompleteAssessment();
		d.airway.normal = false;
		d.airway.obstructedBySecretions = true;
		const result = validateEuGeneral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('A-01');
	});
});

describe('Flagged issues', () => {
	it('returns no flags for a benign minimal-complete encounter', () => {
		const flags = detectFlaggedIssues(minimalCompleteAssessment());
		expect(flags).toHaveLength(0);
	});

	it('flags AVPU = U as urgent', () => {
		const d = minimalCompleteAssessment();
		d.disability.avpu = 'U';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-AVPU-U' && f.priority === 'urgent')).toBe(true);
	});

	it('flags abnormal AVPU + no airway intervention as urgent', () => {
		const d = minimalCompleteAssessment();
		d.disability.avpu = 'P';
		// Ensure no airway intervention
		d.airway.interventionRepositioning = false;
		d.airway.interventionSuction = false;
		d.airway.interventionOpa = false;
		d.airway.interventionNpa = false;
		d.airway.interventionLma = false;
		d.airway.interventionBvm = false;
		d.airway.interventionEtt = false;
		const flags = detectFlaggedIssues(d);
		expect(
			flags.some((f) => f.id === 'FLAG-AVPU-AIRWAY' && f.priority === 'urgent')
		).toBe(true);
	});

	it('flags SpO2 < 92 with no breathing intervention as high', () => {
		const d = minimalCompleteAssessment();
		d.chiefComplaintAndVitals.initialVitals.spo2 = 90;
		// Ensure no breathing intervention
		d.breathing.oxygenNasalCannula = false;
		d.breathing.oxygenMask = false;
		d.breathing.oxygenNonRebreather = false;
		d.breathing.oxygenBvm = false;
		d.breathing.oxygenCpapBipap = false;
		d.breathing.oxygenVentilator = false;
		d.breathing.bronchodilator = false;
		const flags = detectFlaggedIssues(d);
		expect(
			flags.some((f) => f.id === 'FLAG-SPO2-NOINTV' && f.priority === 'high')
		).toBe(true);
	});

	it('flags critically low SpO2 (< 90) as urgent', () => {
		const d = minimalCompleteAssessment();
		d.chiefComplaintAndVitals.initialVitals.spo2 = 85;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-SPO2-CRIT' && f.priority === 'urgent')).toBe(
			true
		);
	});

	it('flags hypoglycaemia as urgent', () => {
		const d = minimalCompleteAssessment();
		d.disability.bloodGlucoseMmol = 2.5;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-GLUC-LOW' && f.priority === 'urgent')).toBe(
			true
		);
	});

	it('flags hypotension as high', () => {
		const d = minimalCompleteAssessment();
		d.chiefComplaintAndVitals.initialVitals.bpSystolic = 80;
		const flags = detectFlaggedIssues(d);
		expect(
			flags.some((f) => f.id === 'FLAG-VIT-SBP-LOW' && f.priority === 'high')
		).toBe(true);
	});

	it('flags abnormal respiratory rate as urgent', () => {
		const d = minimalCompleteAssessment();
		d.chiefComplaintAndVitals.initialVitals.respiratoryRate = 35;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-VIT-RR' && f.priority === 'urgent')).toBe(
			true
		);
	});

	it('flags stridor as urgent', () => {
		const d = minimalCompleteAssessment();
		d.highRiskSigns.stridorOrVoiceChange = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-STRIDOR' && f.priority === 'urgent')).toBe(
			true
		);
	});

	it('flags pregnancy as medium', () => {
		const d = minimalCompleteAssessment();
		d.pastMedicalHistory.pregnant = 'yes';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-PREG' && f.priority === 'medium')).toBe(true);
	});

	it('flags IV drug use as medium', () => {
		const d = minimalCompleteAssessment();
		d.pastMedicalHistory.ivDrugUse = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-IVDU' && f.priority === 'medium')).toBe(true);
	});

	it('flags died disposition as urgent', () => {
		const d = minimalCompleteAssessment();
		d.disposition.disposition = 'died';
		d.disposition.diedCause = 'Sepsis';
		const flags = detectFlaggedIssues(d);
		expect(
			flags.some((f) => f.id === 'FLAG-DISPO-DIED' && f.priority === 'urgent')
		).toBe(true);
	});

	it('sorts flags urgent → high → medium → low', () => {
		const d = minimalCompleteAssessment();
		d.disability.avpu = 'U';
		d.chiefComplaintAndVitals.initialVitals.bpSystolic = 80;
		d.pastMedicalHistory.pregnant = 'yes';
		d.disposition.disposition = 'discharge';
		d.disposition.dischargePlanDiscussed = 'no';
		const flags = detectFlaggedIssues(d);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
