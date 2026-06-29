import { describe, expect, it } from 'vitest';
import { prehospitalRules } from './prehospital-rules';
import { detectFlaggedIssues } from './flagged-issues';
import { validatePrehospital } from './prehospital-validator';
import {
	createDefaultAssessment,
	emptyReassessment
} from '../stores/assessment.svelte';
import type { AssessmentData } from './types';

function emptyAssessment(): AssessmentData {
	return createDefaultAssessment();
}

/**
 * Build a minimal-but-complete prehospital encounter. Every required field
 * for an unremarkable, non-injury, GREEN-triage adult patient handed over
 * to the receiving facility is satisfied with the simplest possible answer.
 */
function minimalCompleteAssessment(): AssessmentData {
	const d = emptyAssessment();

	// Step 1 — Caller & Scene
	d.callerAndScene.patientName = 'Jane Doe';
	d.callerAndScene.sex = 'female';
	d.callerAndScene.dateOfBirthOrAge = '1985-06-15';
	d.callerAndScene.date = '2025-04-20';
	d.callerAndScene.sceneCallType = 'scene';
	d.callerAndScene.sceneLocationType = 'residence';
	d.callerAndScene.timeCallReceived = '14:00';
	d.callerAndScene.timeArrivedAtScene = '14:10';

	// Step 2 — Chief Complaint & Vitals
	d.chiefComplaintAndVitals.chiefComplaint = 'Headache';
	d.chiefComplaintAndVitals.initialVitals.time = '14:15';
	d.chiefComplaintAndVitals.initialVitals.hr = 78;
	d.chiefComplaintAndVitals.initialVitals.rr = 16;
	d.chiefComplaintAndVitals.initialVitals.bp = '120/80';
	d.chiefComplaintAndVitals.initialVitals.spo2 = 98;

	// Step 4 — Triage
	d.triage.category = 'green';

	// Step 5 — Airway
	d.airway.normal = true;
	// Step 6 — Breathing
	d.breathing.normal = true;
	// Step 7 — Circulation
	d.circulation.normal = true;

	// Step 8 — Disability
	d.disability.avpu = 'A';

	// Step 10 — SAMPLE
	d.sampleHistory.allergiesUnknown = true;
	d.sampleHistory.medicationsUnknown = true;
	d.sampleHistory.pastMedicalUnknown = true;
	d.sampleHistory.eventsUnknown = true;

	// Step 14 — Assessment & Plan
	d.assessmentAndPlan.summary = 'Mild tension headache; transport for evaluation.';
	d.assessmentAndPlan.presumptiveDiagnoses = 'Tension headache.';

	// Step 16 — Disposition
	d.disposition.disposition = 'Handed over to ED triage.';
	d.disposition.handoverTime = '14:45';
	d.disposition.handoverToName = 'Dr. Smith';
	d.disposition.providerName = 'A. Medic';
	d.disposition.providerSignature = 'A. Medic';
	d.disposition.providerSignatureDate = '2025-04-20';

	return d;
}

describe('Prehospital rule set', () => {
	it('has a non-empty rule set', () => {
		expect(prehospitalRules.length).toBeGreaterThan(0);
	});

	it('all rule IDs are unique', () => {
		const ids = prehospitalRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('every rule references a known section', () => {
		const validSections = new Set([
			'callerAndScene',
			'chiefComplaintAndVitals',
			'highRiskSigns',
			'triage',
			'airway',
			'breathing',
			'circulation',
			'disability',
			'exposure',
			'sampleHistory',
			'injuryDetails',
			'physicalExam',
			'additionalInterventions',
			'assessmentAndPlan',
			'reassessments',
			'disposition'
		]);
		for (const r of prehospitalRules) {
			expect(validSections.has(r.section)).toBe(true);
		}
	});
});

describe('Prehospital validator', () => {
	it('marks an empty assessment as incomplete', () => {
		const result = validatePrehospital(emptyAssessment());
		expect(result.complete).toBe(false);
		expect(result.totalSatisfied).toBe(0);
		expect(result.missing.length).toBe(result.totalRequired);
	});

	it('marks a minimal-but-complete green-triage encounter as complete', () => {
		const result = validatePrehospital(minimalCompleteAssessment());
		expect(result.complete).toBe(true);
		expect(result.missing).toHaveLength(0);
		expect(result.totalSatisfied).toBe(result.totalRequired);
	});

	it('RED triage requires GCS components (E/V/M)', () => {
		const d = minimalCompleteAssessment();
		d.triage.category = 'red';
		// Force airway not-normal so A-02 also kicks in but include intervention
		d.airway.normal = true;
		// Provide IV access to satisfy C-03
		d.circulation.accessIvSite = 'L AC';
		// GCS components missing
		d.disability.gcsEye = null;
		d.disability.gcsVerbal = null;
		d.disability.gcsMotor = null;
		const result = validatePrehospital(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('D-02');
	});

	it('RED triage GCS rule passes when E/V/M are recorded', () => {
		const d = minimalCompleteAssessment();
		d.triage.category = 'red';
		d.circulation.accessIvSite = 'L AC';
		d.disability.gcsEye = 4;
		d.disability.gcsVerbal = 5;
		d.disability.gcsMotor = 6;
		const result = validatePrehospital(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('D-02');
	});

	it('RED triage requires IV/IO access or fluids', () => {
		const d = minimalCompleteAssessment();
		d.triage.category = 'red';
		d.disability.gcsEye = 4;
		d.disability.gcsVerbal = 5;
		d.disability.gcsMotor = 6;
		// No IV access
		d.circulation.accessIvSite = '';
		d.circulation.accessIoSite = '';
		d.circulation.ivfMls = null;
		d.circulation.ivfNs = false;
		d.circulation.ivfLr = false;
		d.circulation.ivfOther = '';
		const result = validatePrehospital(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('C-03');
	});

	it('RED triage with abnormal airway requires an airway intervention', () => {
		const d = minimalCompleteAssessment();
		d.triage.category = 'red';
		d.disability.gcsEye = 4;
		d.disability.gcsVerbal = 5;
		d.disability.gcsMotor = 6;
		d.circulation.accessIvSite = 'L AC';
		d.airway.normal = false;
		d.airway.stridor = true;
		// No interventions
		const result = validatePrehospital(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('A-02');
	});

	it('Injury flag requires intent and mechanism', () => {
		const d = minimalCompleteAssessment();
		d.chiefComplaintAndVitals.injury = true;
		d.injuryDetails.intent = '';
		// no mechanism set
		const result = validatePrehospital(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('INJ-01');
		expect(ids).toContain('INJ-02');
	});

	it('Injury flag rule passes when intent + mechanism are recorded', () => {
		const d = minimalCompleteAssessment();
		d.chiefComplaintAndVitals.injury = true;
		d.injuryDetails.intent = 'unintentional';
		d.injuryDetails.mechanismFall = true;
		const result = validatePrehospital(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('INJ-01');
		expect(ids).not.toContain('INJ-02');
	});

	it('Active bleeding site requires a bleeding control method', () => {
		const d = minimalCompleteAssessment();
		d.circulation.normal = false;
		d.circulation.activeBleedingSite = 'Left forearm';
		const result = validatePrehospital(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('C-02');
	});

	it('Bleeding control rule passes when a method is recorded', () => {
		const d = minimalCompleteAssessment();
		d.circulation.normal = false;
		d.circulation.activeBleedingSite = 'Left forearm';
		d.circulation.bleedingControlledDirectPressure = true;
		const result = validatePrehospital(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('C-02');
	});

	it('SAMPLE rule passes with text instead of Unknown', () => {
		const d = minimalCompleteAssessment();
		d.sampleHistory.allergiesUnknown = false;
		d.sampleHistory.allergies = 'NKDA';
		const result = validatePrehospital(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('SH-01');
	});

	it('groups missing items by section and section sums match totals', () => {
		const result = validatePrehospital(emptyAssessment());
		for (const s of result.sections) {
			expect(s.missing.length).toBe(s.required - s.satisfied);
		}
	});

	it('Airway: passes with notes alone (no Normal tick)', () => {
		const d = minimalCompleteAssessment();
		d.airway.normal = false;
		d.airway.notes = 'Patent, no obstruction.';
		const result = validatePrehospital(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('A-01');
	});

	it('reassessments are optional (length 0–3)', () => {
		const d = minimalCompleteAssessment();
		expect(d.reassessments.length).toBe(0);
		const result = validatePrehospital(d);
		expect(result.complete).toBe(true);
	});

	it('reassessments array can hold up to 3 entries', () => {
		const d = minimalCompleteAssessment();
		d.reassessments.push(emptyReassessment());
		d.reassessments.push(emptyReassessment());
		d.reassessments.push(emptyReassessment());
		expect(d.reassessments.length).toBe(3);
		const result = validatePrehospital(d);
		expect(result.complete).toBe(true);
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

	it('flags AVPU = P as urgent', () => {
		const d = minimalCompleteAssessment();
		d.disability.avpu = 'P';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-AVPU-P' && f.priority === 'urgent')).toBe(true);
	});

	it('flags GCS < 8 without airway intervention as urgent', () => {
		const d = minimalCompleteAssessment();
		d.disability.gcsEye = 1;
		d.disability.gcsVerbal = 2;
		d.disability.gcsMotor = 3;
		// No airway intervention
		d.airway.interventionRepositioning = false;
		d.airway.interventionSuction = false;
		d.airway.interventionOpa = false;
		d.airway.interventionNpa = false;
		d.airway.interventionLma = false;
		d.airway.interventionBvm = false;
		d.airway.interventionEtt = false;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-GCS-AIRWAY' && f.priority === 'urgent')).toBe(true);
	});

	it('flags critically low SpO2 (< 90) as urgent', () => {
		const d = minimalCompleteAssessment();
		d.chiefComplaintAndVitals.initialVitals.spo2 = 85;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-SPO2-CRIT' && f.priority === 'urgent')).toBe(true);
	});

	it('flags SpO2 < 92 with no breathing intervention as high', () => {
		const d = minimalCompleteAssessment();
		d.chiefComplaintAndVitals.initialVitals.spo2 = 91;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-SPO2-NOINTV' && f.priority === 'high')).toBe(true);
	});

	it('flags hypotension without IV access as high (FLAG-HYPO-NOIV)', () => {
		const d = minimalCompleteAssessment();
		d.chiefComplaintAndVitals.initialVitals.bp = '80/50';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-HYPO-NOIV' && f.priority === 'high')).toBe(true);
	});

	it('flags abnormal respiratory rate as urgent', () => {
		const d = minimalCompleteAssessment();
		d.chiefComplaintAndVitals.initialVitals.rr = 35;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-VIT-RR' && f.priority === 'urgent')).toBe(true);
	});

	it('flags stridor as urgent', () => {
		const d = minimalCompleteAssessment();
		d.highRiskSigns.stridor = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-STRIDOR' && f.priority === 'urgent')).toBe(true);
	});

	it('flags hypoglycaemia as urgent', () => {
		const d = minimalCompleteAssessment();
		d.disability.bloodGlucose = 2.5;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-GLUC-LOW' && f.priority === 'urgent')).toBe(true);
	});

	it('flags heavy bleeding without control as urgent', () => {
		const d = minimalCompleteAssessment();
		d.highRiskSigns.heavyBleeding = true;
		const flags = detectFlaggedIssues(d);
		expect(
			flags.some((f) => f.id === 'FLAG-BLEEDING-NOCTL' && f.priority === 'urgent')
		).toBe(true);
	});

	it('flags pregnancy as medium', () => {
		const d = minimalCompleteAssessment();
		d.chiefComplaintAndVitals.pregnant = 'yes';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-PREG' && f.priority === 'medium')).toBe(true);
	});

	it('flags mass casualty as urgent', () => {
		const d = minimalCompleteAssessment();
		d.callerAndScene.massCasualty = true;
		const flags = detectFlaggedIssues(d);
		expect(
			flags.some((f) => f.id === 'FLAG-MASS-CASUALTY' && f.priority === 'urgent')
		).toBe(true);
	});

	it('flags severe pain (≥ 7) as medium', () => {
		const d = minimalCompleteAssessment();
		d.chiefComplaintAndVitals.painScore = 8;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-PAIN-SEVERE' && f.priority === 'medium')).toBe(
			true
		);
	});

	it('sorts flags urgent → high → medium → low', () => {
		const d = minimalCompleteAssessment();
		d.disability.avpu = 'U';
		d.chiefComplaintAndVitals.initialVitals.bp = '80/50';
		d.chiefComplaintAndVitals.pregnant = 'yes';
		d.disposition.planDiscussedWithPatient = 'no';
		const flags = detectFlaggedIssues(d);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
