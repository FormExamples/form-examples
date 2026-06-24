import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { HistopathologyResult } from './types';

/** A fully-completed, benign / normal histopathology report fixture. */
function createNormalResult(): HistopathologyResult {
	return {
		reportingClinician: 'Dr A Pathologist',
		originatingRequestReference: 'REQ-2001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		specimenType: 'Punch biopsy',
		specimenSite: 'Left forearm skin',
		specimenAdequacy: 'adequate',
		clinicalHistory: 'Benign-looking naevus; confirm.',
		comparisonWithPrevious: 'No previous histology.',
		macroscopicDescription: 'A 4 mm skin ellipse.',
		microscopicDescription: 'Benign intradermal naevus. No atypia.',
		diagnosis: 'Benign intradermal melanocytic naevus.',
		malignancyPresent: false,
		tumourType: '',
		histologicalGrade: 'not-applicable',
		tnmPt: '',
		tnmPn: '',
		tnmPm: '',
		resectionMargins: 'not-applicable',
		lymphovascularInvasion: false,
		immunohistochemistry: '',
		snomedCode: '',
		impression: 'Benign naevus. No malignancy.',
		reportingCategory: '',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An expected malignancy (request linked): abnormal, not critical. */
function createAbnormalResult(): HistopathologyResult {
	return {
		...createNormalResult(),
		specimenType: 'Core biopsy',
		specimenSite: 'Right breast',
		clinicalHistory: 'Suspicious mass; 2WW referral.',
		macroscopicDescription: 'Three cores up to 18 mm.',
		microscopicDescription: 'Invasive ductal carcinoma, no special type.',
		diagnosis: 'Invasive ductal carcinoma.',
		malignancyPresent: true,
		tumourType: 'Invasive ductal carcinoma',
		histologicalGrade: 'moderately-differentiated',
		tnmPt: 'pT1c',
		tnmPn: 'pN0',
		tnmPm: '',
		resectionMargins: 'not-applicable',
		snomedCode: 'M-85003',
		impression: 'Invasive ductal carcinoma; refer to breast MDT.',
		recommendedFollowUp: 'Breast MDT.'
	};
}

/** A critical report fixture: unexpected malignancy (no request linked). */
function createCriticalResult(): HistopathologyResult {
	return {
		...createAbnormalResult(),
		originatingRequestReference: '',
		clinicalHistory: 'Incidental specimen.',
		impression: 'Unexpected invasive carcinoma.',
		recommendedFollowUp: 'Urgent MDT.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Histopathology four-axis grading engine', () => {
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

	it('grades an expected malignancy as abnormal with urgent MDT follow-up', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('urgent');
		expect(g.recommendation).toBe('specialist-referral');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-URGENT-01')).toBe(true);
	});

	it('auto-escalates an unexpected malignancy to critical-alert regardless of other axes', () => {
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

	it('auto-escalates an involved resection margin to critical-alert', () => {
		const r = createAbnormalResult();
		r.resectionMargins = 'involved';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-01')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-001')).toBe(true);
	});

	it('grades a high-grade malignancy as major severity', () => {
		const r = createAbnormalResult();
		r.histologicalGrade = 'poorly-differentiated';
		const g = calculateGrade(r);
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('urgent');
		expect(g.recommendation).toBe('specialist-referral');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-02')).toBe(true);
	});

	it('classifies an inadequate specimen as inconclusive', () => {
		const r = createNormalResult();
		r.specimenAdequacy = 'inadequate';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-testing');
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNormalResult();
		r.clinicalHistory = '';
		r.macroscopicDescription = '';
		const g = calculateGrade(r);
		// 3 of 5 sections present.
		expect(g.reportCompletenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-HISTORY-01')).toBe(true);
	});

	it('grades lymphovascular invasion without malignancy as minor with recommended follow-up', () => {
		const r = createNormalResult();
		r.lymphovascularInvasion = true;
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

describe('Histopathology flag detection', () => {
	it('flags a critical result not yet communicated', () => {
		const flags = detectFlags(createCriticalResult());
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-001')).toBe(true);
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-002')).toBe(true);
	});

	it('flags a confirmed malignancy as abnormal-requiring-action and urgent-referral', () => {
		const flags = detectFlags(createAbnormalResult());
		expect(flags.some((f) => f.category === 'abnormal-requiring-action')).toBe(true);
		expect(flags.some((f) => f.category === 'urgent-referral')).toBe(true);
	});

	it('flags a missing impression', () => {
		const r = createNormalResult();
		r.impression = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-impression')).toBe(true);
	});

	it('flags a malignancy with no recorded pT stage', () => {
		const r = createAbnormalResult();
		r.tnmPt = '';
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
