import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { EyeVisionResult } from './types';

/** A fully-completed, normal eye vision report fixture. */
function createNormalResult(): EyeVisionResult {
	return {
		reportingClinician: 'Dr A Ophthalmologist',
		originatingRequestReference: 'REQ-2001',
		reportStatus: 'final',
		testType: 'visual-acuity',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		clinicalHistory: 'Routine review; check vision.',
		visualAcuityRight: '6/6',
		visualAcuityLeft: '6/6',
		intraocularPressureRightMmhg: 14,
		intraocularPressureLeftMmhg: 15,
		visualFieldResult: 'full',
		reducedVisualAcuity: false,
		visualFieldDefect: false,
		raisedIntraocularPressure: false,
		diabeticRetinopathy: false,
		opticDiscAbnormality: false,
		macularAbnormality: false,
		normalExamination: true,
		retinopathyGrade: 'none',
		findingsNarrative: 'Anterior and posterior segments normal. Discs healthy.',
		impression: 'Normal eye examination. No abnormality detected.',
		reportingCategory: '',
		recommendedFollowUp: 'Routine recall in 2 years.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal glaucoma report fixture: elevated IOP + optic-disc cupping, no critical finding. */
function createAbnormalGlaucomaResult(): EyeVisionResult {
	return {
		...createNormalResult(),
		clinicalHistory: 'Raised IOP on community screening; glaucoma suspect.',
		intraocularPressureRightMmhg: 28,
		intraocularPressureLeftMmhg: 26,
		raisedIntraocularPressure: true,
		opticDiscAbnormality: true,
		normalExamination: false,
		findingsNarrative: 'Increased cup-to-disc ratio bilaterally; IOP elevated.',
		impression: 'Suspected primary open-angle glaucoma.',
		recommendedFollowUp: 'Refer to glaucoma clinic per NICE NG81.'
	};
}

/** A critical report fixture: sudden visual loss with optic-disc abnormality. */
function createCriticalResult(): EyeVisionResult {
	return {
		...createNormalResult(),
		clinicalHistory: 'Sudden painless visual loss in the right eye.',
		visualAcuityRight: 'HM',
		reducedVisualAcuity: true,
		opticDiscAbnormality: true,
		normalExamination: false,
		findingsNarrative: 'Pale swollen right optic disc; markedly reduced acuity.',
		impression: 'Sudden visual loss — query arteritic anterior ischaemic optic neuropathy.',
		recommendedFollowUp: 'Immediate ophthalmology and GCA work-up.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Eye vision four-axis grading engine', () => {
	it('grades a normal, complete report', () => {
		const g = calculateGrade(createNormalResult());
		expect(g.resultClassification).toBe('normal');
		expect(g.abnormalitySeverity).toBe('none');
		expect(g.reportCompletenessPercent).toBe(100);
		expect(g.followUpUrgency).toBe('routine');
		expect(g.recommendation).toBe('no-action');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-NORMAL-01')).toBe(true);
	});

	it('grades an abnormal glaucoma report (elevated IOP + disc cupping) as moderate', () => {
		const g = calculateGrade(createAbnormalGlaucomaResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('specialist-referral');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('auto-escalates a critical finding to critical-alert regardless of other axes', () => {
		const g = calculateGrade(createCriticalResult());
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.targetTimeframe).toBe('immediate');
		expect(g.recommendation).toBe('urgent-review');
		// The auto-escalation invariant rule fired.
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
		// The critical-result-alert flag is raised.
		expect(g.flags.some((f) => f.category === 'critical-result-alert')).toBe(true);
	});

	it('escalates acutely raised IOP (>= 40 mmHg) to critical-alert', () => {
		const r = createNormalResult();
		r.intraocularPressureRightMmhg = 46;
		r.raisedIntraocularPressure = true;
		r.normalExamination = false;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
	});

	it('escalates referable (proliferative) retinopathy to major severity and urgent follow-up', () => {
		const r = createNormalResult();
		r.diabeticRetinopathy = true;
		r.retinopathyGrade = 'pre-proliferative';
		r.normalExamination = false;
		const g = calculateGrade(r);
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('urgent');
		expect(g.recommendation).toBe('specialist-referral');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-02')).toBe(true);
	});

	it('classifies an empty study as inconclusive', () => {
		const r = createNormalResult();
		r.normalExamination = false;
		r.findingsNarrative = '';
		r.impression = '';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNormalResult();
		r.clinicalHistory = '';
		r.recommendedFollowUp = '';
		const g = calculateGrade(r);
		// 3 of 5 sections present.
		expect(g.reportCompletenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-HISTORY-01')).toBe(true);
	});

	it('grades a single minor finding as minor with a recommended follow-up', () => {
		const r = createNormalResult();
		r.normalExamination = false;
		r.reducedVisualAcuity = true;
		r.visualAcuityRight = '6/12';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('minor');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('routine-follow-up');
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createCriticalResult());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Eye vision flag detection', () => {
	it('flags a critical result not yet communicated', () => {
		const flags = detectFlags(createCriticalResult());
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-001')).toBe(true);
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-002')).toBe(true);
	});

	it('flags a missing impression', () => {
		const r = createNormalResult();
		r.impression = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-impression')).toBe(true);
	});

	it('flags elevated IOP as an urgent referral', () => {
		const flags = detectFlags(createAbnormalGlaucomaResult());
		expect(flags.some((f) => f.category === 'urgent-referral')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const flags = detectFlags(createCriticalResult());
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});

	it('returns no flags for a normal complete report', () => {
		const flags = detectFlags(createNormalResult());
		expect(flags).toHaveLength(0);
	});
});
