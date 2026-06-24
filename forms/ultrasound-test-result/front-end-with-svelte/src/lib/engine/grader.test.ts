import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { UltrasoundResult } from './types';

/** A fully-completed, normal ultrasound report fixture. */
function createNormalResult(): UltrasoundResult {
	return {
		reportingClinician: 'Dr A Sonographer',
		originatingRequestReference: 'REQ-1001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		bodyRegion: 'abdomen',
		laterality: 'not-applicable',
		examinationAdequacy: 'adequate',
		clinicalHistory: 'Right upper quadrant pain; exclude gallstones.',
		comparisonWithPrevious: 'No prior imaging available for comparison.',
		findingsNarrative: 'Liver, gallbladder, pancreas, spleen and kidneys are unremarkable.',
		massOrLesion: false,
		cyst: false,
		gallstones: false,
		hydronephrosis: false,
		freeFluid: false,
		dvtPresent: false,
		aneurysm: false,
		organEnlargement: false,
		incidentalFinding: false,
		largestLesionSizeMm: null,
		impression: 'Normal abdominal ultrasound. No gallstones.',
		reportingCategory: '',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal report fixture: measurable thyroid nodule, no critical finding. */
function createAbnormalResult(): UltrasoundResult {
	return {
		...createNormalResult(),
		bodyRegion: 'thyroid-neck',
		findingsNarrative: 'A 18 mm hypoechoic solid nodule in the right thyroid lobe.',
		massOrLesion: true,
		largestLesionSizeMm: 18,
		reportingCategory: 'TR4',
		impression: 'Moderately suspicious thyroid nodule (ACR TI-RADS TR4).',
		recommendedFollowUp: 'Ultrasound-guided FNA recommended.'
	};
}

/** A critical report fixture: DVT present on venous Doppler. */
function createCriticalResult(): UltrasoundResult {
	return {
		...createNormalResult(),
		bodyRegion: 'dvt-leg',
		laterality: 'left',
		clinicalHistory: 'Swollen, painful left calf; exclude DVT.',
		findingsNarrative: 'Non-compressible left popliteal vein with echogenic thrombus.',
		dvtPresent: true,
		impression: 'Acute left popliteal DVT.',
		recommendedFollowUp: 'Commence anticoagulation per pathway.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Ultrasound four-axis grading engine', () => {
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

	it('grades an abnormal report with a measurable mass', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
		// Operator-entered structured-reporting label is preserved.
		expect(g.reportingCategory).toBe('TR4');
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

	it('auto-escalates a ruptured / large AAA (aneurysm) to critical-alert', () => {
		const r = createNormalResult();
		r.bodyRegion = 'vascular-doppler';
		r.aneurysm = true;
		r.findingsNarrative = 'Fusiform infrarenal aortic aneurysm with surrounding free fluid.';
		r.impression = 'Large abdominal aortic aneurysm, concern for rupture.';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.flags.some((f) => f.category === 'critical-result-alert')).toBe(true);
	});

	it('escalates a large lesion (>= 30 mm) to major severity and urgent follow-up', () => {
		const r = createAbnormalResult();
		r.largestLesionSizeMm = 45;
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

	it('grades a simple cyst as minor with a recommended follow-up', () => {
		const r = createNormalResult();
		r.bodyRegion = 'renal-tract';
		r.cyst = true;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('minor');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('routine-follow-up');
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

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createCriticalResult());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Ultrasound flag detection', () => {
	it('flags a critical result not yet communicated', () => {
		const flags = detectFlags(createCriticalResult());
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-001')).toBe(true);
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-002')).toBe(true);
	});

	it('flags hydronephrosis as abnormal-requiring-action', () => {
		const r = createNormalResult();
		r.bodyRegion = 'renal-tract';
		r.hydronephrosis = true;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'abnormal-requiring-action')).toBe(true);
	});

	it('flags a missing impression', () => {
		const r = createNormalResult();
		r.impression = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-impression')).toBe(true);
	});

	it('flags a mass with no recorded measurement', () => {
		const r = createAbnormalResult();
		r.largestLesionSizeMm = null;
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
