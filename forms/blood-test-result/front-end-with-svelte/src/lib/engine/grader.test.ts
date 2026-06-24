import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { BloodTestResult } from './types';

/** A fully-completed, normal blood report fixture. */
function createNormalResult(): BloodTestResult {
	return {
		reportingClinician: 'Dr A Pathologist',
		originatingRequestReference: 'REQ-2001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		specimenType: 'serum',
		specimenCondition: 'satisfactory',
		clinicalHistory: 'Routine health check; no symptoms.',
		haemoglobinGL: 145,
		whiteCellCount: 6.5,
		platelets: 250,
		neutrophils: 4.0,
		sodiumMmolL: 140,
		potassiumMmolL: 4.2,
		ureaMmolL: 5.0,
		creatinineUmolL: 80,
		egfr: 95,
		altUL: 25,
		alkalinePhosphatase: 80,
		bilirubinUmolL: 12,
		albuminGL: 42,
		cReactiveProtein: 2,
		hba1cMmolMol: 35,
		glucoseMmolL: 4.8,
		tsh: 1.8,
		ferritin: 120,
		inr: 1.0,
		overallResultStatus: 'normal',
		abnormalResultsPresent: false,
		criticalValuePresent: false,
		criticalValueDetail: '',
		findingsNarrative: 'All measured analytes within reference ranges.',
		comparisonWithPrevious: 'Stable compared with prior results 12 months ago.',
		impression: 'Normal full blood count and biochemistry.',
		reportingCategory: '',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal blood report fixture: abnormal results present, not critical. */
function createAbnormalResult(): BloodTestResult {
	return {
		...createNormalResult(),
		haemoglobinGL: 98,
		ferritin: 8,
		overallResultStatus: 'abnormal',
		abnormalResultsPresent: true,
		findingsNarrative: 'Low haemoglobin with low ferritin, consistent with iron deficiency.',
		impression: 'Iron-deficiency anaemia.',
		recommendedFollowUp: 'Commence oral iron; recheck FBC in 3 months.'
	};
}

/** A critical (panic) value blood report fixture: severe hyperkalaemia. */
function createCriticalResult(): BloodTestResult {
	return {
		...createNormalResult(),
		potassiumMmolL: 7.1,
		overallResultStatus: 'critical',
		abnormalResultsPresent: true,
		criticalValuePresent: true,
		criticalValueDetail: 'Potassium 7.1 mmol/L (critical / panic value >= 6.5).',
		findingsNarrative: 'Severe hyperkalaemia.',
		impression: 'Critical hyperkalaemia requiring urgent action.',
		recommendedFollowUp: 'Immediate clinical review; treat hyperkalaemia.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Blood test four-axis grading engine', () => {
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

	it('grades an abnormal report with abnormal results present', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('repeat-test');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('auto-escalates a critical (panic) value to critical-alert regardless of other axes', () => {
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

	it('classifies a critical overall status even without the explicit panic flag', () => {
		const r = createNormalResult();
		r.overallResultStatus = 'critical';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
	});

	it('derives a structured eGFR CKD band as the reporting category', () => {
		const r = createNormalResult();
		r.egfr = 40;
		const g = calculateGrade(r);
		expect(g.abnormalitySeverity).toBe('minor');
		expect(g.reportingCategory).toContain('CKD');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MINOR-01')).toBe(true);
	});

	it('classifies a report with no measured values and no impression as inconclusive', () => {
		const r = createNormalResult();
		for (const key of [
			'haemoglobinGL', 'whiteCellCount', 'platelets', 'neutrophils', 'sodiumMmolL',
			'potassiumMmolL', 'ureaMmolL', 'creatinineUmolL', 'egfr', 'altUL',
			'alkalinePhosphatase', 'bilirubinUmolL', 'albuminGL', 'cReactiveProtein',
			'hba1cMmolMol', 'glucoseMmolL', 'tsh', 'ferritin', 'inr'
		] as const) {
			r[key] = null;
		}
		r.impression = '';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('repeat-test');
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

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createCriticalResult());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Blood test flag detection', () => {
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

	it('flags an inadequate specimen', () => {
		const r = createNormalResult();
		r.specimenCondition = 'haemolysed';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'inadequate-specimen')).toBe(true);
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
