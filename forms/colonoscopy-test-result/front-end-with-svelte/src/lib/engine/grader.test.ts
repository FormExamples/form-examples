import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { ColonoscopyResult } from './types';

/** A fully-completed, normal colonoscopy report fixture. */
function createNormalResult(): ColonoscopyResult {
	return {
		reportingClinician: 'Dr A Endoscopist',
		originatingRequestReference: 'REQ-1001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		procedure: 'colonoscopy',
		extentReached: 'caecum',
		bowelPreparationQuality: 'good',
		sedationUsed: true,
		clinicalHistory: 'Change in bowel habit; exclude malignancy.',
		findingsNarrative: 'Normal colonic mucosa to the caecum. No polyps or masses.',
		polypsFound: false,
		massLesion: false,
		diverticulosis: false,
		inflammationIbd: false,
		angiodysplasia: false,
		bleedingSourceIdentified: false,
		normalExamination: true,
		polypCount: null,
		largestPolypMm: null,
		biopsyTaken: false,
		polypectomyPerformed: false,
		complication: 'none',
		impression: 'Normal colonoscopy to the caecum. No evidence of malignancy.',
		reportingCategory: '',
		recommendedFollowUp: 'No surveillance required; return to screening as appropriate.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal report fixture: small polyps, no critical finding. */
function createAbnormalResult(): ColonoscopyResult {
	return {
		...createNormalResult(),
		findingsNarrative: 'Two diminutive polyps in the sigmoid colon, removed by snare polypectomy.',
		normalExamination: false,
		polypsFound: true,
		polypCount: 2,
		largestPolypMm: 8,
		biopsyTaken: true,
		polypectomyPerformed: true,
		impression: 'Two small polyps removed; awaiting histology.',
		recommendedFollowUp: 'Surveillance per polyp histology and BSG guidance.'
	};
}

/** A critical report fixture: suspicious mass lesion. */
function createCriticalResult(): ColonoscopyResult {
	return {
		...createNormalResult(),
		findingsNarrative: 'A large, irregular, partially obstructing mass in the sigmoid colon.',
		normalExamination: false,
		massLesion: true,
		biopsyTaken: true,
		impression: 'Suspicious mass lesion; likely malignancy. Biopsies taken.',
		recommendedFollowUp: 'Urgent MDT and colorectal-surgical referral.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Colonoscopy four-axis grading engine', () => {
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

	it('grades an abnormal report with small polyps', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('auto-escalates a critical mass to critical-alert regardless of other axes', () => {
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

	it('auto-escalates a perforation complication to critical-alert', () => {
		const r = createAbnormalResult();
		r.complication = 'perforation';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
	});

	it('escalates a large polyp (>= 20 mm) to major severity and urgent follow-up', () => {
		const r = createAbnormalResult();
		r.largestPolypMm = 25;
		const g = calculateGrade(r);
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('urgent');
		expect(g.recommendation).toBe('specialist-referral');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-02')).toBe(true);
	});

	it('classifies an incomplete examination as inconclusive', () => {
		const r = createNormalResult();
		r.extentReached = 'incomplete';
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

	it('grades incidental-only diverticulosis as minor with a recommended follow-up', () => {
		const r = createNormalResult();
		r.normalExamination = false;
		r.diverticulosis = true;
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

describe('Colonoscopy flag detection', () => {
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

	it('flags polyps with no recorded measurement', () => {
		const r = createAbnormalResult();
		r.largestPolypMm = null;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-measurement')).toBe(true);
	});

	it('flags inadequate technique for poor prep or incomplete extent', () => {
		const r = createNormalResult();
		r.bowelPreparationQuality = 'poor';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'inadequate-technique')).toBe(true);
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
