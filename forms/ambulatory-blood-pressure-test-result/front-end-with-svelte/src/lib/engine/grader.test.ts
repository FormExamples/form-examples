import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { AmbulatoryBloodPressureResult } from './types';

/** A fully-completed, normal ABPM report fixture (normotensive, dipper). */
function createNormalResult(): AmbulatoryBloodPressureResult {
	return {
		reportingClinician: 'Dr A Clinician',
		originatingRequestReference: 'REQ-2001',
		monitoringType: '24-hour-abpm',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		validReadingsPercent: 92,
		recordingAdequate: true,
		clinicalHistory: 'Borderline clinic readings; confirm or exclude hypertension.',
		daytimeAverageSystolic: 122,
		daytimeAverageDiastolic: 76,
		nighttimeAverageSystolic: 104,
		nighttimeAverageDiastolic: 62,
		twentyFourHourAverageSystolic: 116,
		twentyFourHourAverageDiastolic: 71,
		nocturnalDipPercent: 15,
		dipperStatus: 'dipper',
		hypertensionConfirmed: false,
		whiteCoatEffect: false,
		maskedHypertension: false,
		severeHypertension: false,
		nocturnalHypertension: false,
		normalStudy: true,
		findingsNarrative: 'Normotensive ambulatory averages with a normal dipping pattern.',
		comparisonWithPrevious: 'No prior monitoring available for comparison.',
		impression: 'Normal ambulatory blood pressure study. Hypertension excluded.',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal stage-1 ABPM report fixture: raised daytime average, no critical finding. */
function createAbnormalResult(): AmbulatoryBloodPressureResult {
	return {
		...createNormalResult(),
		daytimeAverageSystolic: 140,
		daytimeAverageDiastolic: 88,
		twentyFourHourAverageSystolic: 134,
		twentyFourHourAverageDiastolic: 82,
		normalStudy: false,
		findingsNarrative: 'Daytime average 140/88 mmHg, above the 135/85 hypertension threshold.',
		impression: 'Stage 1 hypertension on ambulatory monitoring.',
		recommendedFollowUp: 'Lifestyle advice; treatment per cardiovascular risk.'
	};
}

/** A critical ABPM report fixture: severe hypertension. */
function createCriticalResult(): AmbulatoryBloodPressureResult {
	return {
		...createNormalResult(),
		daytimeAverageSystolic: 168,
		daytimeAverageDiastolic: 102,
		nighttimeAverageSystolic: 150,
		nighttimeAverageDiastolic: 94,
		twentyFourHourAverageSystolic: 162,
		twentyFourHourAverageDiastolic: 99,
		nocturnalDipPercent: 5,
		dipperStatus: 'non-dipper',
		hypertensionConfirmed: true,
		severeHypertension: true,
		nocturnalHypertension: true,
		normalStudy: false,
		findingsNarrative: 'Severe hypertension on ambulatory averages (>= 150/95).',
		impression: 'Severe hypertension; same-day specialist review advised.',
		recommendedFollowUp: 'Same-day specialist review.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('ABPM four-axis grading engine', () => {
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

	it('grades an abnormal stage-1 report with a raised daytime average', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('minor');
		expect(g.reportingCategory).toBe('stage-1');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('routine-follow-up');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MINOR-01')).toBe(true);
	});

	it('auto-escalates a severe-hypertension result to critical-alert regardless of other axes', () => {
		const g = calculateGrade(createCriticalResult());
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.reportingCategory).toBe('severe');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.targetTimeframe).toBe('same-day');
		expect(g.recommendation).toBe('urgent-review');
		// The auto-escalation invariant rule fired.
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
		// The critical-result-alert flag is raised.
		expect(g.flags.some((f) => f.category === 'critical-result-alert')).toBe(true);
	});

	it('escalates severe hypertension detected purely from averages (no boolean set)', () => {
		const r = createNormalResult();
		r.daytimeAverageSystolic = 152;
		r.daytimeAverageDiastolic = 96;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-01')).toBe(true);
	});

	it('grades confirmed hypertension as moderate with a recommended follow-up', () => {
		const r = createAbnormalResult();
		r.hypertensionConfirmed = true;
		const g = calculateGrade(r);
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.reportingCategory).toBe('stage-2');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('specialist-referral');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('classifies an inadequate recording with no impression as inconclusive', () => {
		const r = createNormalResult();
		r.recordingAdequate = false;
		r.validReadingsPercent = 55;
		r.impression = '';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNormalResult();
		r.clinicalHistory = '';
		r.findingsNarrative = '';
		const g = calculateGrade(r);
		// 3 of 5 sections present.
		expect(g.reportCompletenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-HISTORY-01')).toBe(true);
	});

	it('grades a white-coat effect as abnormal/minor with a recommended follow-up', () => {
		const r = createNormalResult();
		r.whiteCoatEffect = true;
		r.normalStudy = false;
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

describe('ABPM flag detection', () => {
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

	it('flags an inadequate recording', () => {
		const r = createNormalResult();
		r.recordingAdequate = false;
		r.validReadingsPercent = 50;
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
