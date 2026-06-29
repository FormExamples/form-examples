import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { CtScanRequest } from './types';

/** A fully-completed, routine appropriate request (CT chest surveillance, no contrast). */
function createRoutineRequest(): CtScanRequest {
	return {
		clinician: {
			clinicianName: 'Dr Sarah Owen',
			clinicianRole: 'oncologist',
			registrationBody: 'GMC',
			registrationNumber: '7012345',
			requesterContact: 'sarah.owen@nhs.net',
			supervisingConsultant: '',
			siteName: 'Churchill Oncology Centre',
			referralDate: '2026-06-10'
		},
		patient: {
			firstName: 'Margaret',
			lastName: 'Hughes',
			dateOfBirth: '1958-03-14',
			nhsNumber: '485 777 3456',
			weightKg: 68,
			interpreterRequired: false
		},
		request: {
			bodyRegion: 'chest',
			primaryIndication: 'follow-up-surveillance',
			clinicalQuestion: 'Surveillance CT chest — assess for interval change.'
		},
		context: {
			relevantHistory: 'Treated NSCLC; routine surveillance.',
			relevantPreviousImaging: 'CT chest 6 months ago — no recurrence.'
		},
		contrast: {
			contrastRequired: 'none',
			egfr: 82,
			iodineContrastAllergy: false,
			previousContrastReaction: 'none',
			metformin: false,
			diabetes: false,
			renalImpairment: false
		},
		radiation: {
			pregnancyStatus: 'not-applicable',
			irMeRJustification: 'Scheduled surveillance imaging; benefit outweighs dose.'
		},
		triage: {
			urgency: 'routine',
			setting: 'outpatient',
			requestedByDate: '2026-07-15',
			notes: ''
		}
	};
}

describe('CT scan request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessScore).toBe(8);
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.contrastSafetyBand).toBe('safe');
		expect(g.estimatedDoseBand).toBe('moderate');
		expect(g.renalRisk).toBe(false);
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-FOLLOW-UP-SURVEILLANCE-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-REQUESTED')).toBe(true);
	});

	it('auto-escalates suspected stroke to emergency triage', () => {
		const r = createRoutineRequest();
		r.request.bodyRegion = 'head';
		r.request.primaryIndication = 'suspected-stroke';
		r.request.clinicalQuestion = 'Exclude haemorrhage before thrombolysis.';
		const g = calculateGrade(r);
		expect(g.appropriatenessScore).toBe(8);
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.triageTier).toBe('emergency');
		expect(g.targetTimeframe).toBe('Same day / immediate');
		expect(g.recommendation).toBe('accept');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-STROKE')).toBe(true);
	});

	it('forces the contrast band to contraindicated for low eGFR with IV contrast', () => {
		const r = createRoutineRequest();
		r.request.bodyRegion = 'ct-angiogram';
		r.request.primaryIndication = 'pulmonary-embolism';
		r.request.clinicalQuestion = 'Exclude pulmonary embolism.';
		r.contrast.contrastRequired = 'iv-iodinated';
		r.contrast.egfr = 24;
		r.contrast.metformin = true;
		r.contrast.diabetes = true;
		r.contrast.renalImpairment = true;
		const g = calculateGrade(r);
		expect(g.contrastSafetyBand).toBe('contraindicated');
		expect(g.renalRisk).toBe(true);
		expect(g.triageTier).toBe('emergency'); // PE auto-escalation
		expect(g.recommendation).toBe('redirect');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SAFETY-EGFR-LOW')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SAFETY-METFORMIN')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-RENAL-IMPAIRMENT-001')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-METFORMIN-CONTRAST-001')).toBe(true);
	});

	it('sets caution when IV contrast is requested with no eGFR recorded', () => {
		const r = createRoutineRequest();
		r.request.bodyRegion = 'chest';
		r.request.primaryIndication = 'cancer-staging';
		r.contrast.contrastRequired = 'iv-iodinated';
		r.contrast.egfr = null;
		const g = calculateGrade(r);
		expect(g.contrastSafetyBand).toBe('caution');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SAFETY-EGFR-MISSING')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-MISSING-EGFR-001')).toBe(true);
	});

	it('marks a mismatched region/indication as usually-not-appropriate → query-referrer', () => {
		const r = createRoutineRequest();
		r.request.bodyRegion = 'head';
		r.request.primaryIndication = 'abdominal-pain';
		const g = calculateGrade(r);
		expect(g.appropriatenessScore).toBe(2);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-ABDOMINAL-PAIN-MISMATCH')).toBe(true);
		// Abdominal pain also auto-escalates triage to urgent.
		expect(g.triageTier).toBe('urgent');
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const g = calculateGrade(r);
		// indication (3) + clinical question (3) of 18 total weight missing → 12/18 ≈ 67%.
		expect(g.completenessPercent).toBe(67);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('raises a high-priority pregnancy flag for a possible pregnancy', () => {
		const r = createRoutineRequest();
		r.radiation.pregnancyStatus = 'possible';
		const g = calculateGrade(r);
		const flag = g.flags.find((f) => f.flagId === 'F-PREGNANCY-001');
		expect(flag).toBeDefined();
		expect(flag?.priority).toBe('high');
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createRoutineRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('CT scan request flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('flags an unjustified exposure when no IR(ME)R justification is recorded', () => {
		const r = createRoutineRequest();
		r.radiation.irMeRJustification = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.flagId === 'F-UNJUSTIFIED-EXPOSURE-001')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const r = createRoutineRequest();
		r.radiation.pregnancyStatus = 'pregnant'; // high
		r.radiation.irMeRJustification = ''; // medium
		const flags = detectFlags(r);
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});

	it('returns no flags for a complete routine appropriate request', () => {
		const flags = detectFlags(createRoutineRequest());
		expect(flags).toHaveLength(0);
	});
});
