import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flags';
import { createDefaultRequest } from './defaults';
import type { EchoRequest } from './types';

/** A fully-completed, routine, appropriate surveillance request fixture. */
function createRoutineRequest(): EchoRequest {
	const d = createDefaultRequest();
	d.clinician = {
		...d.clinician,
		clinicianName: 'Dr Sarah Owen',
		clinicianRole: 'GP',
		referralDate: '2026-06-10'
	};
	d.patient = {
		...d.patient,
		firstName: 'Margaret',
		lastName: 'Hughes',
		dateOfBirth: '1958-03-14',
		nhsNumber: '485 777 3456'
	};
	d.request = {
		...d.request,
		echoType: 'transthoracic-tte',
		primaryIndication: 'surveillance-known-disease',
		clinicalQuestion: 'Interval surveillance of known mild mitral regurgitation.'
	};
	d.symptoms = { ...d.symptoms, nyhaClass: 'i' };
	d.investigations = { ...d.investigations, bnpOrNtProbnp: 120 };
	d.triage = { ...d.triage, urgency: 'routine', setting: 'community' };
	return d;
}

describe('Echocardiogram test request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessBand).toBe('appropriate');
		expect(g.appropriatenessScore).toBe(8);
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.priorityBand).toBe('low');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-REQUESTED')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-PRIORITY-BASELINE')).toBe(true);
	});

	it('escalates raised NT-proBNP heart failure to urgent + high priority with a raised-bnp flag', () => {
		const d = createRoutineRequest();
		d.request.primaryIndication = 'heart-failure';
		d.symptoms = { ...d.symptoms, breathlessness: true, oedema: true, nyhaClass: 'iii' };
		d.investigations.bnpOrNtProbnp = 3400;
		d.triage.urgency = 'urgent';
		const g = calculateGrade(d);
		expect(g.appropriatenessBand).toBe('appropriate');
		expect(g.triageTier).toBe('urgent');
		expect(g.priorityBand).toBe('high');
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-NT-PROBNP-HIGH')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-PRIORITY-NYHA-III-IV')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-RAISED-BNP-001')).toBe(true);
	});

	it('auto-escalates suspected endocarditis to emergency + high priority', () => {
		const d = createRoutineRequest();
		d.request = { ...d.request, echoType: 'transoesophageal-toe', primaryIndication: 'endocarditis' };
		d.redFlags.suspectedEndocarditis = true;
		const g = calculateGrade(d);
		expect(g.triageTier).toBe('emergency');
		expect(g.priorityBand).toBe('high');
		expect(g.targetTimeframe).toBe('Same day / inpatient');
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-SUSPECTED-ENDOCARDITIS')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-endocarditis')).toBe(true);
	});

	it('marks a mismatched study (stress echo for palpitations) as rarely-appropriate → query-referrer', () => {
		const d = createRoutineRequest();
		d.request = {
			...d.request,
			echoType: 'stress-echo',
			primaryIndication: 'palpitations',
			clinicalQuestion: ''
		};
		d.symptoms = { ...d.symptoms, palpitations: true, nyhaClass: '' };
		const g = calculateGrade(d);
		expect(g.appropriatenessBand).toBe('rarely-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-PALPITATIONS-MISMATCH')).toBe(true);
		expect(g.flags.some((f) => f.category === 'rarely-appropriate-indication')).toBe(true);
		expect(g.flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const d = createRoutineRequest();
		d.request.clinicalQuestion = '';
		d.symptoms.nyhaClass = '';
		const g = calculateGrade(d);
		// clinical question (3) + NYHA class (1) of 15 total weight missing → 11/15 ≈ 73%.
		expect(g.completenessPercent).toBe(73);
		expect(g.firedRules.some((r) => r.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-COMPLETE-NYHA')).toBe(true);
	});

	it('produces stable, unique fired-rule IDs', () => {
		const g = calculateGrade(createRoutineRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('grades a blank default request without throwing and flags missing essentials', () => {
		const g = calculateGrade(createDefaultRequest());
		expect(g.appropriatenessBand).toBe('may-be-appropriate');
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-UNSPECIFIED')).toBe(true);
		expect(g.flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(g.flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});
});

describe('Echocardiogram test request flag detection', () => {
	it('returns no flags for a complete routine appropriate request', () => {
		const flags = detectFlags(createRoutineRequest(), { appropriatenessBand: 'appropriate' });
		expect(flags).toHaveLength(0);
	});

	it('raises the severe-symptomatic-valve flag', () => {
		const d = createRoutineRequest();
		d.redFlags.severeSymptomaticValve = true;
		const flags = detectFlags(d, { appropriatenessBand: 'appropriate' });
		expect(flags.some((f) => f.flagId === 'F-SEVERE-SYMPTOMATIC-VALVE-001')).toBe(true);
	});
});
