import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { EchocardiogramResult } from './types';

/** A fully-completed, normal echo report fixture. */
function createNormalResult(): EchocardiogramResult {
	return {
		reportingClinician: 'Dr A Cardiologist',
		originatingRequestReference: 'REQ-2001',
		echoType: 'transthoracic-tte',
		reportStatus: 'final',
		studyQuality: 'good',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		clinicalHistory: 'Murmur on examination; assess valves and LV function.',
		lvEjectionFractionPercent: 60,
		lvFunction: 'normal',
		lvInternalDiameterDiastoleMm: 48,
		lvHypertrophy: false,
		regionalWallMotionAbnormality: false,
		aorticStenosis: 'none',
		aorticRegurgitation: 'none',
		mitralStenosis: 'none',
		mitralRegurgitation: 'none',
		pulmonaryArterySystolicPressureMmhg: 25,
		pericardialEffusion: false,
		vegetation: false,
		intracardiacThrombus: false,
		normalStudy: true,
		findingsNarrative: 'Normal LV size and function. Valves structurally normal. No effusion.',
		comparisonWithPrevious: 'No prior echo available for comparison.',
		impression: 'Normal transthoracic echocardiogram.',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal echo report fixture: mild mitral regurgitation, no critical finding. */
function createAbnormalResult(): EchocardiogramResult {
	return {
		...createNormalResult(),
		normalStudy: false,
		mitralRegurgitation: 'mild',
		findingsNarrative: 'Mild mitral regurgitation. Otherwise normal study.',
		impression: 'Mild mitral regurgitation; no other abnormality.',
		recommendedFollowUp: 'Surveillance echo in 3 years.'
	};
}

/** A critical echo report fixture: severe aortic stenosis. */
function createCriticalResult(): EchocardiogramResult {
	return {
		...createNormalResult(),
		normalStudy: false,
		studyQuality: 'good',
		aorticStenosis: 'severe',
		findingsNarrative: 'Severe calcific aortic stenosis with restricted leaflet motion.',
		impression: 'Severe aortic stenosis.',
		recommendedFollowUp: 'Urgent valve-team referral.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Echocardiogram four-axis grading engine', () => {
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

	it('grades an abnormal report with mild valve disease', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('minor');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('routine-follow-up');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MINOR-01')).toBe(true);
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

	it('escalates a low ejection fraction to severe LV impairment and critical-alert', () => {
		const r = createNormalResult();
		r.normalStudy = false;
		r.lvFunction = 'severely-impaired';
		r.lvEjectionFractionPercent = 25;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-01')).toBe(true);
	});

	it('grades moderate valve disease as moderate with a recommended follow-up', () => {
		const r = createNormalResult();
		r.normalStudy = false;
		r.aorticRegurgitation = 'moderate';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('classifies a poor-quality study as inconclusive', () => {
		const r = createNormalResult();
		r.studyQuality = 'poor';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNormalResult();
		r.clinicalHistory = '';
		r.pulmonaryArterySystolicPressureMmhg = null;
		const g = calculateGrade(r);
		// 4 of 6 sections present.
		expect(g.reportCompletenessPercent).toBe(67);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-HISTORY-01')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createCriticalResult());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Echocardiogram flag detection', () => {
	it('flags a critical result not yet communicated', () => {
		const flags = detectFlags(createCriticalResult());
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-001')).toBe(true);
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-002')).toBe(true);
	});

	it('flags suspected endocarditis when a vegetation is present', () => {
		const r = createNormalResult();
		r.normalStudy = false;
		r.vegetation = true;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'suspected-endocarditis')).toBe(true);
	});

	it('flags a missing impression', () => {
		const r = createNormalResult();
		r.impression = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-impression')).toBe(true);
	});

	it('flags impaired LV function with no recorded ejection fraction', () => {
		const r = createNormalResult();
		r.normalStudy = false;
		r.lvFunction = 'moderately-impaired';
		r.lvEjectionFractionPercent = null;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-measurement')).toBe(true);
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
