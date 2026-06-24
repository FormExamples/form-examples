import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { AngiographyResult } from './types';

/** A fully-completed, normal angiography report fixture. */
function createNormalResult(): AngiographyResult {
	return {
		reportingClinician: 'Dr A Radiologist',
		originatingRequestReference: 'REQ-1001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		angiographyType: 'ct-angiography',
		bodyRegion: 'aorta',
		contrastUsed: 'iodinated',
		examinationAdequacy: 'adequate',
		clinicalHistory: 'Surveillance of known small aortic calibre; assess for aneurysm.',
		comparisonWithPrevious: 'No prior imaging available for comparison.',
		findingsNarrative: 'Aorta and major branches are of normal calibre. No stenosis or aneurysm.',
		significantStenosis: false,
		occlusion: false,
		aneurysm: false,
		dissection: false,
		activeExtravasation: false,
		thrombus: false,
		normalVessels: true,
		incidentalFinding: false,
		maxStenosisPercent: null,
		interventionPerformed: false,
		impression: 'Normal CT angiogram. No significant vascular abnormality.',
		reportingCategory: '',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal angiography report fixture: moderate stenosis, no critical finding. */
function createAbnormalResult(): AngiographyResult {
	return {
		...createNormalResult(),
		findingsNarrative: 'Moderate stenosis of the proximal renal artery, approximately 55 %.',
		significantStenosis: true,
		normalVessels: false,
		maxStenosisPercent: 55,
		impression: 'Moderate renal artery stenosis; correlate clinically.',
		recommendedFollowUp: 'Interval imaging in 3 months.'
	};
}

/** A critical angiography report fixture: active contrast extravasation. */
function createCriticalResult(): AngiographyResult {
	return {
		...createNormalResult(),
		angiographyType: 'catheter-dsa',
		bodyRegion: 'mesenteric',
		clinicalHistory: 'GI bleed; identify source.',
		findingsNarrative: 'Active contrast extravasation from a branch of the SMA.',
		activeExtravasation: true,
		normalVessels: false,
		impression: 'Active mesenteric haemorrhage.',
		recommendedFollowUp: 'Immediate embolisation / surgical referral.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Angiography four-axis grading engine', () => {
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

	it('grades an abnormal report with a moderate stenosis', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
		expect(g.reportingCategory).toBe('50-69%');
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

	it('escalates a high-grade stenosis (>= 70 %) to major severity and urgent follow-up', () => {
		const r = createAbnormalResult();
		r.maxStenosisPercent = 80;
		const g = calculateGrade(r);
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('urgent');
		expect(g.recommendation).toBe('specialist-referral');
		expect(g.reportingCategory).toBe('70-99%');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-02')).toBe(true);
	});

	it('classifies a non-diagnostic study as inconclusive', () => {
		const r = createNormalResult();
		r.examinationAdequacy = 'non-diagnostic';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNormalResult();
		r.clinicalHistory = '';
		r.comparisonWithPrevious = '';
		const g = calculateGrade(r);
		// 3 of 5 sections present.
		expect(g.reportCompletenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-HISTORY-01')).toBe(true);
	});

	it('grades incidental-only findings as minor with a recommended follow-up', () => {
		const r = createNormalResult();
		r.incidentalFinding = true;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('minor');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('routine-follow-up');
	});

	it('treats an occlusion as a critical finding', () => {
		const r = createNormalResult();
		r.occlusion = true;
		r.normalVessels = false;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.reportingCategory).toBe('occluded');
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createCriticalResult());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Angiography flag detection', () => {
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

	it('flags a significant stenosis with no recorded measurement', () => {
		const r = createAbnormalResult();
		r.maxStenosisPercent = null;
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
