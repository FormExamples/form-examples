import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { BiopsyResult } from './types';

/** A fully-completed, benign / normal biopsy report fixture. */
function createNormalResult(): BiopsyResult {
	return {
		reportingClinician: 'Dr A Histopathologist',
		originatingRequestReference: 'REQ-1001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		biopsySite: 'skin',
		biopsyMethod: 'punch',
		specimenAdequacy: 'adequate',
		clinicalHistory: 'Changing pigmented skin lesion; exclude melanoma.',
		comparisonWithPrevious: 'No prior histopathology available for comparison.',
		macroscopicDescription: 'A 4 mm punch biopsy of skin.',
		microscopicDescription: 'Benign intradermal naevus. No atypia.',
		diagnosis: 'Benign intradermal melanocytic naevus.',
		malignancyPresent: false,
		tumourType: '',
		histologicalGrade: 'not-applicable',
		resectionMargins: 'not-applicable',
		lymphovascularInvasion: false,
		immunohistochemistry: '',
		molecularResults: '',
		snomedCode: '',
		impression: 'Benign naevus. No evidence of malignancy.',
		reportingCategory: '',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal biopsy report fixture: known malignancy, clear margins, moderate grade. */
function createAbnormalResult(): BiopsyResult {
	return {
		...createNormalResult(),
		biopsySite: 'prostate',
		biopsyMethod: 'core-needle',
		microscopicDescription: 'Acinar adenocarcinoma, Gleason 3+4.',
		diagnosis: 'Prostatic acinar adenocarcinoma.',
		malignancyPresent: true,
		tumourType: 'acinar adenocarcinoma',
		histologicalGrade: 'moderately-differentiated',
		resectionMargins: 'clear',
		impression: 'Prostatic adenocarcinoma; refer to urology MDT.',
		recommendedFollowUp: 'Urology MDT discussion.'
	};
}

/** A critical biopsy report fixture: involved resection margin. */
function createCriticalResult(): BiopsyResult {
	return {
		...createAbnormalResult(),
		biopsySite: 'breast',
		biopsyMethod: 'excision',
		microscopicDescription: 'Invasive ductal carcinoma at the inked margin.',
		diagnosis: 'Invasive ductal carcinoma.',
		tumourType: 'invasive ductal carcinoma',
		histologicalGrade: 'poorly-differentiated',
		resectionMargins: 'involved',
		impression: 'Invasive carcinoma with an involved margin.',
		recommendedFollowUp: 'Urgent breast MDT; consider re-excision.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Biopsy four-axis grading engine', () => {
	it('grades a benign, complete report', () => {
		const g = calculateGrade(createNormalResult());
		expect(g.resultClassification).toBe('normal');
		expect(g.abnormalitySeverity).toBe('none');
		expect(g.reportCompletenessPercent).toBe(100);
		expect(g.followUpUrgency).toBe('routine');
		expect(g.recommendation).toBe('no-action');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-NORMAL-01')).toBe(true);
	});

	it('grades an abnormal report with a moderately-differentiated malignancy', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-testing');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('auto-escalates an involved margin to critical-alert regardless of other axes', () => {
		const g = calculateGrade(createCriticalResult());
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.targetTimeframe).toBe('immediate');
		expect(g.recommendation).toBe('urgent-mdt');
		// The auto-escalation invariant rule fired.
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
		// The critical-result-alert flag is raised.
		expect(g.flags.some((f) => f.category === 'critical-result-alert')).toBe(true);
	});

	it('auto-escalates an unexpected malignancy (no request reference) to critical', () => {
		const r = createAbnormalResult();
		r.originatingRequestReference = '';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-mdt');
	});

	it('escalates a poorly-differentiated malignancy to major severity and urgent follow-up', () => {
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

	it('grades a well-differentiated malignancy as minor with a recommended follow-up', () => {
		const r = createAbnormalResult();
		r.histologicalGrade = 'well-differentiated';
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

describe('Biopsy flag detection', () => {
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

	it('flags a malignancy with no recorded grade', () => {
		const r = createAbnormalResult();
		r.histologicalGrade = 'not-applicable';
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

	it('returns no flags for a benign complete report', () => {
		const flags = detectFlags(createNormalResult());
		expect(flags).toHaveLength(0);
	});
});
