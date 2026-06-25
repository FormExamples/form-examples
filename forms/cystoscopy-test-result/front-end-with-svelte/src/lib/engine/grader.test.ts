import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { CystoscopyResult } from './types';

/** A fully-completed, normal cystoscopy report fixture. */
function createNormalResult(): CystoscopyResult {
	return {
		reportingClinician: 'Dr A Urologist',
		originatingRequestReference: 'REQ-1001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		procedure: 'flexible-cystoscopy',
		anaesthesia: 'local',
		clinicalHistory: 'Visible haematuria; exclude bladder malignancy.',
		findingsNarrative:
			'Normal urethra and bladder urothelium. Both ureteric orifices seen. No lesion.',
		bladderTumour: false,
		inflammationCystitis: false,
		bladderStones: false,
		urethralStricture: false,
		trabeculation: false,
		prostaticEnlargement: false,
		normalExamination: true,
		tumourSizeMm: null,
		tumourAppearance: '',
		biopsyTaken: false,
		complication: 'none',
		impression: 'Normal flexible cystoscopy. No evidence of bladder tumour.',
		reportingCategory: '',
		recommendedFollowUp: 'No follow-up required; discharge.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal cystoscopy report fixture: inflammation / cystitis, no critical finding. */
function createAbnormalResult(): CystoscopyResult {
	return {
		...createNormalResult(),
		findingsNarrative: 'Diffuse erythema and mucosal oedema consistent with cystitis.',
		normalExamination: false,
		inflammationCystitis: true,
		impression: 'Inflammatory changes consistent with cystitis.',
		recommendedFollowUp: 'Treat infection and re-image if symptoms persist.'
	};
}

/** A critical cystoscopy report fixture: bladder tumour. */
function createCriticalResult(): CystoscopyResult {
	return {
		...createNormalResult(),
		findingsNarrative: 'A 22 mm papillary lesion on the left lateral bladder wall.',
		normalExamination: false,
		bladderTumour: true,
		tumourSizeMm: 22,
		tumourAppearance: 'papillary',
		biopsyTaken: true,
		impression: 'Suspected bladder tumour.',
		recommendedFollowUp: 'Urgent TURBT and MDT referral.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Cystoscopy four-axis grading engine', () => {
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

	it('grades an abnormal report with an actionable finding', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('auto-escalates a bladder tumour to critical-alert regardless of other axes', () => {
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

	it('escalates a large lesion (>= 30 mm) to major severity and critical-alert follow-up', () => {
		const r = createCriticalResult();
		r.tumourSizeMm = 45;
		const g = calculateGrade(r);
		expect(g.abnormalitySeverity).toBe('major');
		// A bladder tumour is still present, so the safety invariant holds.
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-01')).toBe(true);
	});

	it('classifies an empty study with no impression as inconclusive', () => {
		const r = createNormalResult();
		r.normalExamination = false;
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

	it('grades benign structural findings as minor with a recommended follow-up', () => {
		const r = createNormalResult();
		r.normalExamination = false;
		r.trabeculation = true;
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

describe('Cystoscopy flag detection', () => {
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

	it('flags a tumour with no recorded measurement', () => {
		const r = createCriticalResult();
		r.tumourSizeMm = null;
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
