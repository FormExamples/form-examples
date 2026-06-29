import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { EcgRequest } from './types';

/** A complete, routine, appropriate resting-12-lead request for chest pain. */
function createRoutineRequest(): EcgRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr Sarah Owen';
	d.clinician.registrationBody = 'GMC';
	d.clinician.registrationNumber = '7012345';
	d.clinician.referralDate = '2026-06-10';
	d.patient.firstName = 'Margaret';
	d.patient.lastName = 'Hughes';
	d.patient.dateOfBirth = '1958-03-14';
	d.patient.nhsNumber = '485 777 3456';
	d.request.ecgType = 'resting-12-lead';
	d.request.primaryIndication = 'chest-pain';
	d.request.clinicalQuestion = 'Is there evidence of ischaemia? Please risk-stratify.';
	d.request.relevantHistory = 'Intermittent exertional chest tightness over 3 months.';
	d.triage.urgency = 'routine';
	return d;
}

describe('ECG test request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.appropriatenessScore).toBe(8);
		expect(g.triageTier).toBe('routine');
		expect(g.completenessPercent).toBe(100);
		expect(g.priorityBand).toBe('low');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-CHEST-PAIN-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-PRIORITY-BASELINE')).toBe(true);
	});

	it('auto-escalates suspected ACS to emergency triage + high priority', () => {
		const d = createRoutineRequest();
		d.request.primaryIndication = 'suspected-mi-acs';
		d.symptoms.suspectedAcs = true;
		const g = calculateGrade(d);
		expect(g.triageTier).toBe('emergency');
		expect(g.targetTimeframe).toBe('Same hour / immediate');
		expect(g.priorityBand).toBe('high');
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-SUSPECTED-ACS')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-PRIORITY-EMERGENCY')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-acs')).toBe(true);
	});

	it('escalates active chest pain to emergency', () => {
		const d = createRoutineRequest();
		d.symptoms.symptomChestPain = true;
		d.symptoms.currentlySymptomatic = true;
		const g = calculateGrade(d);
		expect(g.triageTier).toBe('emergency');
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-ACTIVE-CHEST-PAIN')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-ACTIVE-CHEST-PAIN-001')).toBe(true);
	});

	it('escalates syncope to urgent and raises a high-priority flag', () => {
		const d = createRoutineRequest();
		d.symptoms.symptomSyncope = true;
		const g = calculateGrade(d);
		expect(g.triageTier).toBe('urgent');
		expect(g.priorityBand).toBe('moderate');
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-SYNCOPE')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-SYNCOPE-RED-FLAG-001')).toBe(true);
	});

	it('escalates suspected VT to urgent', () => {
		const d = createRoutineRequest();
		d.symptoms.knownArrhythmia = 'vt';
		const g = calculateGrade(d);
		expect(g.triageTier).toBe('urgent');
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-SUSPECTED-VT')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-vt')).toBe(true);
	});

	it('marks a clearly mismatched indication × ECG type as usually-not-appropriate', () => {
		const d = createRoutineRequest();
		d.request.primaryIndication = 'hypertension';
		d.request.ecgType = 'event-recorder';
		const g = calculateGrade(d);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.priorityBand).toBe('moderate');
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-HYPERTENSION-MISMATCH')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-PRIORITY-APPROPRIATENESS')).toBe(true);
	});

	it('scores a plausible-but-suboptimal pairing as may-be-appropriate', () => {
		const d = createRoutineRequest();
		d.request.primaryIndication = 'palpitations';
		d.request.ecgType = 'resting-12-lead';
		const g = calculateGrade(d);
		expect(g.appropriatenessBand).toBe('may-be-appropriate');
		expect(g.appropriatenessScore).toBe(5);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-PALPITATIONS-PLAUSIBLE')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const d = createRoutineRequest();
		d.request.primaryIndication = '';
		d.request.clinicalQuestion = '';
		const g = calculateGrade(d);
		// indication (3) + clinical question (3) of 15 total weight missing → 9/15 = 60%.
		expect(g.completenessPercent).toBe(60);
		expect(g.firedRules.some((r) => r.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const d = createRoutineRequest();
		d.symptoms.suspectedAcs = true;
		const g = calculateGrade(d);
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('ECG test request flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const d = createDefaultRequest();
		const flags = detectFlags(d);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('returns no flags for a complete routine appropriate request', () => {
		expect(detectFlags(createRoutineRequest())).toHaveLength(0);
	});

	it('sorts flags high → medium → low', () => {
		const d = createDefaultRequest();
		d.symptoms.suspectedAcs = true;
		const flags = detectFlags(d);
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});
});
