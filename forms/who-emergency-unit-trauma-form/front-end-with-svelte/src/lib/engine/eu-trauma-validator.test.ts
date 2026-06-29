import { describe, expect, it } from 'vitest';
import { euTraumaRules } from './eu-trauma-rules';
import { detectFlaggedIssues } from './flagged-issues';
import { validateEuTrauma } from './eu-trauma-validator';
import { createDefaultAssessment } from '../stores/assessment.svelte';
import type { AssessmentData } from './types';

function emptyAssessment(): AssessmentData {
	return createDefaultAssessment();
}

/**
 * Build a minimal-but-complete trauma encounter record. Every required
 * field for an unremarkable adult walk-in evaluated for a low-energy
 * trauma and discharged is satisfied with the simplest possible answer.
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
	d.patientRegistration.injuryLocationUnknown = true;

	// Step 2 — Chief Complaint & Vitals
	d.chiefComplaintAndVitals.chiefComplaint = 'Right ankle injury after slipping.';
	d.chiefComplaintAndVitals.allergiesUnknown = true;
	d.chiefComplaintAndVitals.initialVitals.time = '14:35';
	d.chiefComplaintAndVitals.initialVitals.pulse = 78;
	d.chiefComplaintAndVitals.initialVitals.respiratoryRate = 16;
	d.chiefComplaintAndVitals.initialVitals.spo2 = 98;
	d.chiefComplaintAndVitals.initialVitals.bpSystolic = 120;
	d.chiefComplaintAndVitals.initialVitals.bpDiastolic = 80;

	// Step 4 — Triage
	d.triage.category = 'green';

	// Step 5 — Airway: Normal tick is enough
	d.airway.normal = true;
	// Step 6 — Breathing: Normal tick is enough
	d.breathing.normal = true;
	// Step 7 — Circulation: Normal tick is enough
	d.circulation.normal = true;

	// Step 8 — Disability: AVPU = A
	d.disability.avpu = 'A';

	// Step 10 — Injury History
	d.injuryHistory.dateOfInjury = '2025-04-20';
	d.injuryHistory.timeOfInjury = '14:00';
	d.injuryHistory.intent = 'unintentional';
	d.injuryHistory.prehospitalCareProvider = 'none';
	d.injuryHistory.mechFallFrom = 'standing height';

	// Step 11 — Past Histories
	d.pastHistories.pmhNone = true;
	d.pastHistories.medicationsNone = true;

	// Step 13 — Assessment & Plan
	d.assessmentAndPlan.narrative =
		'Right ankle sprain, no neurovascular compromise. Discharge with NSAID and crutches.';

	// Step 17 — Disposition
	d.disposition.edDepartureDate = '2025-04-20';
	d.disposition.edDepartureTime = '16:00';
	d.disposition.diagnosesImpressions = 'Right ankle sprain.';
	d.disposition.disposition = 'discharge';
	d.disposition.dischargePlanDiscussed = 'yes';
	d.disposition.emergencyUnitProvider = 'Dr. Smith, MD';
	d.disposition.signature = 'A. Smith';
	d.disposition.signatureDate = '2025-04-20';

	return d;
}

describe('EU Trauma rule set', () => {
	it('has a non-empty rule set', () => {
		expect(euTraumaRules.length).toBeGreaterThan(0);
	});

	it('all rule IDs are unique', () => {
		const ids = euTraumaRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('every rule references a known section', () => {
		const validSections = new Set([
			'patientRegistration',
			'chiefComplaintAndVitals',
			'highRiskSigns',
			'triage',
			'airway',
			'breathing',
			'circulation',
			'disability',
			'exposureAndFast',
			'injuryHistory',
			'pastHistories',
			'physicalExam',
			'assessmentAndPlan',
			'diagnostics',
			'medicationsAndProcedures',
			'reassessment',
			'disposition'
		]);
		for (const r of euTraumaRules) {
			expect(validSections.has(r.section)).toBe(true);
		}
	});
});

describe('EU Trauma validator', () => {
	it('marks an empty assessment as incomplete', () => {
		const result = validateEuTrauma(emptyAssessment());
		expect(result.complete).toBe(false);
		expect(result.totalSatisfied).toBe(0);
		expect(result.missing.length).toBe(result.totalRequired);
	});

	it('marks a minimal-but-complete walk-in trauma submission as complete', () => {
		const result = validateEuTrauma(minimalCompleteAssessment());
		expect(result.complete).toBe(true);
		expect(result.missing).toHaveLength(0);
		expect(result.totalSatisfied).toBe(result.totalRequired);
	});

	it('time of death is required when patient is dead on arrival', () => {
		const d = minimalCompleteAssessment();
		d.chiefComplaintAndVitals.deadOnArrival = true;
		d.chiefComplaintAndVitals.timeOfDeath = '';
		const result = validateEuTrauma(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('CV-08');
	});

	it('vital signs (pulse/RR/SpO2/SBP) are not required when dead on arrival', () => {
		const d = minimalCompleteAssessment();
		d.chiefComplaintAndVitals.deadOnArrival = true;
		d.chiefComplaintAndVitals.timeOfDeath = '14:30';
		d.chiefComplaintAndVitals.initialVitals.pulse = null;
		d.chiefComplaintAndVitals.initialVitals.respiratoryRate = null;
		d.chiefComplaintAndVitals.initialVitals.spo2 = null;
		d.chiefComplaintAndVitals.initialVitals.bpSystolic = null;
		const result = validateEuTrauma(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('CV-04');
		expect(ids).not.toContain('CV-05');
		expect(ids).not.toContain('CV-06');
		expect(ids).not.toContain('CV-07');
	});

	it('spine stabilization is required for RED triage', () => {
		const d = minimalCompleteAssessment();
		d.triage.category = 'red';
		d.airway.spineStabilized = '';
		const result = validateEuTrauma(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('A-02');
	});

	it('GCS is required for RED triage (or qualified)', () => {
		const d = minimalCompleteAssessment();
		d.triage.category = 'red';
		d.airway.spineStabilized = 'in-eu';
		d.disability.gcsTotal = null;
		d.disability.gcsQualified = false;
		const result = validateEuTrauma(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('D-02');
	});

	it('GCS rule passes when "Qualified" is checked', () => {
		const d = minimalCompleteAssessment();
		d.triage.category = 'red';
		d.airway.spineStabilized = 'in-eu';
		d.disability.gcsTotal = null;
		d.disability.gcsQualified = true;
		const result = validateEuTrauma(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('D-02');
	});

	it('admit ward is required when disposition is admit', () => {
		const d = minimalCompleteAssessment();
		d.disposition.disposition = 'admit';
		d.disposition.admitWard = '';
		const result = validateEuTrauma(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('DISP-05');
	});

	it('transfer destination is required when disposition is transfer', () => {
		const d = minimalCompleteAssessment();
		d.disposition.disposition = 'transfer';
		d.disposition.transferTo = '';
		const result = validateEuTrauma(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('DISP-06');
	});

	it('cause of death is required when disposition is died', () => {
		const d = minimalCompleteAssessment();
		d.disposition.disposition = 'died';
		d.disposition.diedCause = '';
		const result = validateEuTrauma(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('DISP-07');
	});

	it('groups missing items by section and section sums match totals', () => {
		const result = validateEuTrauma(emptyAssessment());
		for (const s of result.sections) {
			expect(s.missing.length).toBe(s.required - s.satisfied);
		}
	});

	it('Airway: passes with notes alone (no Normal tick)', () => {
		const d = minimalCompleteAssessment();
		d.airway.normal = false;
		d.airway.notes = 'Patent, no obstruction.';
		const result = validateEuTrauma(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('A-01');
	});

	it('Airway: passes when an obstruction checkbox is ticked instead of Normal', () => {
		const d = minimalCompleteAssessment();
		d.airway.normal = false;
		d.airway.obstructedBySecretion = true;
		const result = validateEuTrauma(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('A-01');
	});

	it('Mechanism: passes when Stab/Cut is ticked', () => {
		const d = minimalCompleteAssessment();
		d.injuryHistory.mechFallFrom = '';
		d.injuryHistory.mechStabCut = true;
		const result = validateEuTrauma(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('IH-05');
	});

	it('Mechanism: fails when nothing is ticked', () => {
		const d = minimalCompleteAssessment();
		d.injuryHistory.mechFallFrom = '';
		const result = validateEuTrauma(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('IH-05');
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

	it('flags low GCS (<= 8) as urgent', () => {
		const d = minimalCompleteAssessment();
		d.disability.gcsTotal = 7;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-GCS-LOW' && f.priority === 'urgent')).toBe(true);
	});

	it('flags moderate GCS (9-12) as high', () => {
		const d = minimalCompleteAssessment();
		d.disability.gcsTotal = 11;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-GCS-MOD' && f.priority === 'high')).toBe(true);
	});

	it('flags SpO2 < 92 with no breathing intervention as high', () => {
		const d = minimalCompleteAssessment();
		d.chiefComplaintAndVitals.initialVitals.spo2 = 90;
		d.breathing.oxygenNasalCannula = false;
		d.breathing.oxygenMask = false;
		d.breathing.oxygenNonRebreather = false;
		d.breathing.oxygenBvm = false;
		d.breathing.oxygenCpapBipap = false;
		d.breathing.oxygenVentilator = false;
		const flags = detectFlaggedIssues(d);
		expect(
			flags.some((f) => f.id === 'FLAG-SPO2-NOINTV' && f.priority === 'high')
		).toBe(true);
	});

	it('flags critically low SpO2 (< 90) as urgent', () => {
		const d = minimalCompleteAssessment();
		d.chiefComplaintAndVitals.initialVitals.spo2 = 85;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-SPO2-CRIT' && f.priority === 'urgent')).toBe(true);
	});

	it('flags hypoglycaemia (< 65 mg/dL) as urgent', () => {
		const d = minimalCompleteAssessment();
		d.disability.bloodGlucose = 50;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-GLUC-LOW' && f.priority === 'urgent')).toBe(true);
	});

	it('flags hypotension as high', () => {
		const d = minimalCompleteAssessment();
		d.chiefComplaintAndVitals.initialVitals.bpSystolic = 80;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-VIT-SBP-LOW' && f.priority === 'high')).toBe(true);
	});

	it('flags abnormal respiratory rate as urgent', () => {
		const d = minimalCompleteAssessment();
		d.chiefComplaintAndVitals.initialVitals.respiratoryRate = 35;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-VIT-RR' && f.priority === 'urgent')).toBe(true);
	});

	it('flags stridor red sign as urgent', () => {
		const d = minimalCompleteAssessment();
		d.highRiskSigns.redStridor = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-STRIDOR' && f.priority === 'urgent')).toBe(true);
	});

	it('flags heavy bleeding without circulation intervention as urgent', () => {
		const d = minimalCompleteAssessment();
		d.highRiskSigns.redHeavyBleeding = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-HEAVY-BLEED' && f.priority === 'urgent')).toBe(
			true
		);
	});

	it('flags polytrauma as high', () => {
		const d = minimalCompleteAssessment();
		d.highRiskSigns.traumaPolytrauma = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-POLYTRAUMA' && f.priority === 'high')).toBe(true);
	});

	it('flags penetrating trauma as high', () => {
		const d = minimalCompleteAssessment();
		d.highRiskSigns.traumaAllPenetrating = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-PENETRATING' && f.priority === 'high')).toBe(true);
	});

	it('flags pregnancy as high', () => {
		const d = minimalCompleteAssessment();
		d.patientRegistration.pregnant = 'yes';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-PREG' && f.priority === 'high')).toBe(true);
	});

	it('flags unstable pelvis as urgent', () => {
		const d = minimalCompleteAssessment();
		d.circulation.unstablePelvis = 'yes';
		const flags = detectFlaggedIssues(d);
		expect(
			flags.some((f) => f.id === 'FLAG-UNSTABLE-PELVIS' && f.priority === 'urgent')
		).toBe(true);
	});

	it('flags FAST positive peritoneum as urgent', () => {
		const d = minimalCompleteAssessment();
		d.exposureAndFast.fastPeritoneum = 'free-fluid';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-FAST-PERIT' && f.priority === 'urgent')).toBe(true);
	});

	it('flags FAST chest pneumothorax as urgent', () => {
		const d = minimalCompleteAssessment();
		d.exposureAndFast.fastChest = 'pneumothorax';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-FAST-CHEST' && f.priority === 'urgent')).toBe(true);
	});

	it('flags RED triage with no airway intervention as urgent', () => {
		const d = minimalCompleteAssessment();
		d.triage.category = 'red';
		d.airway.spineStabilized = 'in-eu';
		d.disability.gcsTotal = 15;
		d.airway.normal = false;
		d.airway.interventionRepositioning = false;
		d.airway.interventionSuction = false;
		d.airway.interventionOpa = false;
		d.airway.interventionNpa = false;
		d.airway.interventionLma = false;
		d.airway.interventionBvm = false;
		d.airway.interventionEtt = false;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-RED-AIRWAY' && f.priority === 'urgent')).toBe(true);
	});

	it('flags dead on arrival without time as high (in addition to urgent DOA)', () => {
		const d = minimalCompleteAssessment();
		d.chiefComplaintAndVitals.deadOnArrival = true;
		d.chiefComplaintAndVitals.timeOfDeath = '';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-DOA-NO-TIME' && f.priority === 'high')).toBe(true);
		expect(flags.some((f) => f.id === 'FLAG-DOA' && f.priority === 'urgent')).toBe(true);
	});

	it('flags died disposition as urgent', () => {
		const d = minimalCompleteAssessment();
		d.disposition.disposition = 'died';
		d.disposition.diedCause = 'Massive haemorrhage from pelvic fracture';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-DISPO-DIED' && f.priority === 'urgent')).toBe(true);
	});

	it('flags loss of consciousness 30min-24hr as high', () => {
		const d = minimalCompleteAssessment();
		d.injuryHistory.lossOfConsciousnessDuration = '30min-24hr';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-LOC-LONG' && f.priority === 'high')).toBe(true);
	});

	it('sorts flags urgent → high → medium → low', () => {
		const d = minimalCompleteAssessment();
		d.disability.avpu = 'U';
		d.chiefComplaintAndVitals.initialVitals.bpSystolic = 80;
		d.patientRegistration.ivDrugUse = true;
		d.disposition.disposition = 'discharge';
		d.disposition.dischargePlanDiscussed = 'no';
		const flags = detectFlaggedIssues(d);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
