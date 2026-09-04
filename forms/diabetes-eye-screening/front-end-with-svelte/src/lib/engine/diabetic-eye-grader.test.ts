import { describe, it, expect } from 'vitest';
import { calculateGrade } from './diabetes-eye-grader';
import { detectFlaggedIssues } from './flagged-issues';
import {
	classificationRules,
	deriveContext,
	worstRetinopathy,
	worstMaculopathy
} from './diabetes-eye-rules';
import type { AssessmentData } from './types';

/**
 * A blank screening record (mirrors the store's `createDefaultAssessment`).
 * Defined locally so the engine tests never import the store, which pulls in
 * the SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			graderName: '',
			graderRole: '',
			gradedAt: '',
			imageCapturedAt: '',
			imagingMedia: ''
		},
		identification: {
			patientIdentifier: '',
			ageBand: '',
			diabetesType: '',
			yearsSinceDiagnosis: null,
			previousScreenDate: '',
			previousScreenResult: ''
		},
		rightEye: { retinopathy: '', maculopathy: '', photocoagulation: '', ungradable: '', visualAcuity: '' },
		leftEye: { retinopathy: '', maculopathy: '', photocoagulation: '', ungradable: '', visualAcuity: '' },
		note: { clinicalContext: '' }
	};
}

/** A fully-graded record: both eyes carry an R and M grade (the common preamble). */
function createGraded(
	rightR: AssessmentData['rightEye']['retinopathy'],
	rightM: AssessmentData['rightEye']['maculopathy'],
	leftR: AssessmentData['leftEye']['retinopathy'],
	leftM: AssessmentData['leftEye']['maculopathy']
): AssessmentData {
	const d = createDefaultAssessment();
	d.rightEye.retinopathy = rightR;
	d.rightEye.maculopathy = rightM;
	d.leftEye.retinopathy = leftR;
	d.leftEye.maculopathy = leftM;
	return d;
}

describe('diabetes-eye-screening worst-eye derivation', () => {
	it('takes the worst retinopathy across mismatched eyes (R3A > R1)', () => {
		expect(worstRetinopathy(createGraded('R1', 'M0', 'R3A', 'M0'))).toBe('R3A');
	});

	it('ranks R3S below R3A but above R2 (severity R0<R1<R2<R3S<R3A)', () => {
		expect(worstRetinopathy(createGraded('R2', 'M0', 'R3S', 'M0'))).toBe('R3S');
		expect(worstRetinopathy(createGraded('R3S', 'M0', 'R3A', 'M0'))).toBe('R3A');
	});

	it('worst maculopathy is M1 when either eye is M1', () => {
		expect(worstMaculopathy(createGraded('R0', 'M0', 'R0', 'M1'))).toBe('M1');
		expect(worstMaculopathy(createGraded('R0', 'M0', 'R0', 'M0'))).toBe('M0');
	});

	it('ignores an ungradable eye when taking worst retinopathy', () => {
		const d = createGraded('R3A', 'M0', 'R0', 'M0');
		d.rightEye.ungradable = 'yes'; // R3A eye ungradable => not counted
		expect(worstRetinopathy(d)).toBe('R0');
		expect(deriveContext(d).anyUngradable).toBe(true);
	});
});

describe('diabetes-eye-screening classification engine', () => {
	it('routes worst-eye R3A to urgent HES referral (highest gate)', () => {
		const r = calculateGrade(createGraded('R1', 'M0', 'R3A', 'M0'));
		expect(r.worstRetinopathy).toBe('R3A');
		expect(r.recallPathway).toBe('refer-hes-urgent');
		expect(r.referral).toBe('hes-urgent');
		expect(r.recallIntervalMonths).toBeNull();
	});

	it('routes maculopathy M1 to routine HES referral', () => {
		const r = calculateGrade(createGraded('R0', 'M0', 'R1', 'M1'));
		expect(r.worstMaculopathy).toBe('M1');
		expect(r.recallPathway).toBe('refer-hes');
		expect(r.referral).toBe('hes-routine');
	});

	it('routes stable proliferative R3S to routine HES referral', () => {
		const r = calculateGrade(createGraded('R3S', 'M0', 'R0', 'M0'));
		expect(r.recallPathway).toBe('refer-hes');
		expect(r.referral).toBe('hes-routine');
	});

	it('routes an ungradable eye (no referable disease) to slit-lamp', () => {
		const d = createGraded('R0', 'M0', 'R1', 'M0');
		d.leftEye.ungradable = 'yes';
		const r = calculateGrade(d);
		expect(r.recallPathway).toBe('refer-slit-lamp');
		expect(r.referral).toBe('slit-lamp');
	});

	it('prefers HES referral over slit-lamp when the other eye is referable', () => {
		const d = createGraded('R3A', 'M0', 'R0', 'M0');
		d.leftEye.ungradable = 'yes';
		const r = calculateGrade(d);
		// R3A (right) still routes urgent even though the left eye is ungradable.
		expect(r.recallPathway).toBe('refer-hes-urgent');
	});

	it('routes pre-proliferative R2 to 6-month surveillance', () => {
		const r = calculateGrade(createGraded('R2', 'M0', 'R1', 'M0'));
		expect(r.recallPathway).toBe('surveillance-6-month');
		expect(r.recallIntervalMonths).toBe(6);
		expect(r.referral).toBe('none');
	});

	it('routes background R1 to routine 12-month recall', () => {
		const r = calculateGrade(createGraded('R1', 'M0', 'R0', 'M0'));
		expect(r.recallPathway).toBe('routine-12-month');
		expect(r.recallIntervalMonths).toBe(12);
	});

	it('routes R0/M0 both eyes with prior R0/M0 to extended 24-month recall', () => {
		const d = createGraded('R0', 'M0', 'R0', 'M0');
		d.identification.previousScreenResult = 'r0m0';
		const r = calculateGrade(d);
		expect(r.recallPathway).toBe('routine-24-month');
		expect(r.recallIntervalMonths).toBe(24);
	});

	it('routes R0/M0 without a low-risk prior to routine 12-month recall', () => {
		const d = createGraded('R0', 'M0', 'R0', 'M0');
		d.identification.previousScreenResult = 'background';
		const r = calculateGrade(d);
		expect(r.recallPathway).toBe('routine-12-month');
		expect(r.recallIntervalMonths).toBe(12);
	});

	it('is complete when both eyes carry an R and M grade', () => {
		expect(calculateGrade(createGraded('R0', 'M0', 'R0', 'M0')).status).toBe('complete');
	});

	it('is complete when an eye is marked ungradable without R/M', () => {
		const d = createGraded('R0', 'M0', '', '');
		d.leftEye.ungradable = 'yes';
		expect(calculateGrade(d).status).toBe('complete');
	});

	it('is incomplete when an eye is missing its R/M grade and not ungradable', () => {
		const d = createGraded('R0', 'M0', 'R0', '');
		expect(calculateGrade(d).status).toBe('incomplete');
	});

	it('all rule IDs are unique', () => {
		const ids = classificationRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('diabetes-eye-screening flagged-issue detection', () => {
	const okGrade = { status: 'complete' } as const;

	it('raises the active-proliferative flag for any R3A eye', () => {
		const flags = detectFlaggedIssues(createGraded('R3A', 'M0', 'R0', 'M0'), okGrade);
		expect(flags.some((f) => f.id === 'F-ACTIVE-PROLIFERATIVE-001')).toBe(true);
	});

	it('raises the maculopathy flag for any M1 eye', () => {
		const flags = detectFlaggedIssues(createGraded('R0', 'M0', 'R0', 'M1'), okGrade);
		expect(flags.some((f) => f.id === 'F-MACULOPATHY-001')).toBe(true);
	});

	it('raises the stable-proliferative flag for any R3S eye', () => {
		const flags = detectFlaggedIssues(createGraded('R3S', 'M0', 'R0', 'M0'), okGrade);
		expect(flags.some((f) => f.id === 'F-STABLE-PROLIFERATIVE-001')).toBe(true);
	});

	it('raises the pre-proliferative flag for any R2 eye', () => {
		const flags = detectFlaggedIssues(createGraded('R2', 'M0', 'R0', 'M0'), okGrade);
		expect(flags.some((f) => f.id === 'F-PRE-PROLIFERATIVE-001')).toBe(true);
	});

	it('raises the ungradable flag when an eye is ungradable', () => {
		const d = createGraded('R0', 'M0', 'R0', 'M0');
		d.rightEye.ungradable = 'yes';
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-UNGRADABLE-001')).toBe(true);
	});

	it('raises the patient-overdue flag when the prior screen is > 12 months before grading', () => {
		const d = createGraded('R0', 'M0', 'R0', 'M0');
		d.identification.previousScreenDate = '2024-01-10';
		d.context.gradedAt = '2026-06-10';
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-PATIENT-OVERDUE-001')).toBe(true);
	});

	it('raises the incomplete flag when the grade status is incomplete', () => {
		const flags = detectFlaggedIssues(createGraded('R0', 'M0', 'R0', 'M0'), { status: 'incomplete' });
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});

	it('raises the eligibility flag for an under-12 age band', () => {
		const d = createGraded('R0', 'M0', 'R0', 'M0');
		d.identification.ageBand = 'under-12';
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-ELIGIBILITY-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createGraded('R3A', 'M0', 'R2', 'M0'); // high + medium
		d.identification.ageBand = 'under-12'; // low
		const flags = detectFlaggedIssues(d, { status: 'incomplete' });
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
