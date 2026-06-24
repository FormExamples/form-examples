import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { FluoroscopyResult } from './types';

/** A fully-completed, normal fluoroscopy report fixture. */
function createNormalResult(): FluoroscopyResult {
	return {
		reportingClinician: 'Dr A Radiologist',
		originatingRequestReference: 'REQ-1001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		studyType: 'barium-swallow',
		contrastUsed: 'barium',
		examinationAdequacy: 'adequate',
		screeningTimeMinutes: 2.4,
		clinicalHistory: 'Dysphagia; assess oesophageal transit.',
		comparisonWithPrevious: 'No prior contrast study available for comparison.',
		findingsNarrative: 'Normal oesophageal transit. No stricture, reflux, or filling defect.',
		stricture: false,
		reflux: false,
		obstruction: false,
		perforationOrLeak: false,
		fistula: false,
		fillingDefect: false,
		dysmotility: false,
		normalStudy: true,
		incidentalFinding: false,
		impression: 'Normal barium swallow. No significant abnormality.',
		reportingCategory: '',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal fluoroscopy report fixture: stricture, no critical finding. */
function createAbnormalResult(): FluoroscopyResult {
	return {
		...createNormalResult(),
		findingsNarrative: 'Smooth tapered stricture in the distal oesophagus.',
		normalStudy: false,
		stricture: true,
		impression: 'Distal oesophageal stricture; endoscopic correlation advised.',
		recommendedFollowUp: 'Upper GI endoscopy.'
	};
}

/** A critical fluoroscopy report fixture: contrast leak / perforation. */
function createCriticalResult(): FluoroscopyResult {
	return {
		...createNormalResult(),
		studyType: 'water-soluble-contrast-swallow',
		contrastUsed: 'water-soluble-iodinated',
		clinicalHistory: 'Post-operative; exclude anastomotic leak.',
		findingsNarrative: 'Contrast extravasation from the distal oesophagus into the mediastinum.',
		normalStudy: false,
		perforationOrLeak: true,
		impression: 'Oesophageal perforation with contrast leak.',
		recommendedFollowUp: 'Immediate surgical referral.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Fluoroscopy four-axis grading engine', () => {
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

	it('grades an abnormal report with a stricture', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
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

	it('escalates a high-grade obstruction to critical-alert (safety invariant)', () => {
		const r = createNormalResult();
		r.normalStudy = false;
		r.obstruction = true;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
	});

	it('grades a fistula as major severity and urgent follow-up', () => {
		const r = createAbnormalResult();
		r.stricture = false;
		r.fistula = true;
		const g = calculateGrade(r);
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('urgent');
		expect(g.recommendation).toBe('specialist-referral');
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
		r.normalStudy = false;
		r.incidentalFinding = true;
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

describe('Fluoroscopy flag detection', () => {
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

	it('flags a missing screening-time measurement', () => {
		const r = createAbnormalResult();
		r.screeningTimeMinutes = null;
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
