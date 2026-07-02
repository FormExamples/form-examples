import { describe, it, expect } from 'vitest';
import { calculateReview, gradeReview } from './structured-medication-review-grader';
import { detectFlaggedIssues } from './flagged-issues';
import type { Medicine, ReviewData } from './types';

/**
 * A blank review (mirrors the store's `createDefaultReview`). Defined locally so
 * the engine tests never import the store, which pulls in the SvelteKit-only
 * `$app/environment` module.
 */
function createDefaultReview(): ReviewData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			reviewedAt: '',
			careSetting: '',
			consultationMode: ''
		},
		identification: {
			patientIdentifier: '',
			ageBand: '',
			sex: '',
			frailtyStatus: '',
			livesInCareHome: '',
			longTermConditions: ''
		},
		problems: {
			presentingProblems: '',
			patientReportedIssues: '',
			whatMattersToPatient: ''
		},
		medicines: [],
		monitoring: { monitoringDue: '', overdueMonitoringCount: null },
		goals: { sharedDecisions: '' },
		plan: { followUpPlan: '', followUpDate: '', reviewCompleted: '' },
		note: { clinicalNote: '' }
	};
}

function medicine(over: Partial<Medicine> = {}): Medicine {
	return {
		drugName: 'Amlodipine',
		formStrength: 'Tablet 5 mg',
		doseRegimen: 'One in the morning',
		indication: 'Hypertension',
		indicationRecorded: 'yes',
		isRegular: 'yes',
		isHighRisk: 'no',
		highRiskClass: '',
		adherence: 'good',
		anticholinergicBurdenPoints: 0,
		monitoringRequired: 'no',
		monitoringUpToDate: 'na',
		deprescribingCandidate: 'no',
		stoppCriterion: '',
		startCriterion: '',
		...over
	};
}

/** A fully-documented, complete review. */
function createCompleteReview(): ReviewData {
	const d = createDefaultReview();
	d.problems.presentingProblems = 'Problematic polypharmacy';
	d.problems.whatMattersToPatient = 'Wants fewer tablets';
	d.monitoring.monitoringDue = 'U&Es reviewed, all up to date';
	d.goals.sharedDecisions = 'Agreed to trial stopping amitriptyline';
	d.plan.reviewCompleted = 'yes';
	d.medicines = [medicine(), medicine({ drugName: 'Ramipril', indication: 'Hypertension' })];
	return d;
}

describe('structured-medication-review grading engine', () => {
	it('a blank review is incomplete with zero counts', () => {
		const r = calculateReview(createDefaultReview());
		expect(r.reviewStatus).toBe('incomplete');
		expect(r.medicineCount).toBe(0);
		expect(r.regularMedicineCount).toBe(0);
		expect(r.anticholinergicBurdenScore).toBe(0);
		expect(r.polypharmacyBand).toBe('none');
	});

	it('grades a fully-documented review complete', () => {
		const r = calculateReview(createCompleteReview());
		expect(r.reviewStatus).toBe('complete');
		expect(r.medicineCount).toBe(2);
		expect(r.regularMedicineCount).toBe(2);
	});

	it('a medicine without an indication keeps the review incomplete', () => {
		const d = createCompleteReview();
		d.medicines[0].indication = '';
		expect(calculateReview(d).reviewStatus).toBe('incomplete');
	});

	it('an unknown adherence keeps the review incomplete', () => {
		const d = createCompleteReview();
		d.medicines[0].adherence = 'unknown';
		expect(calculateReview(d).reviewStatus).toBe('incomplete');
	});

	it('review left unmarked keeps the review incomplete', () => {
		const d = createCompleteReview();
		d.plan.reviewCompleted = 'no';
		expect(calculateReview(d).reviewStatus).toBe('incomplete');
	});

	// Polypharmacy boundaries (4/5 and 9/10 regular medicines).
	it('bands 4 regular medicines as none', () => {
		const d = createCompleteReview();
		d.medicines = Array.from({ length: 4 }, () => medicine());
		expect(calculateReview(d).polypharmacyBand).toBe('none');
	});

	it('bands 5 regular medicines as polypharmacy', () => {
		const d = createCompleteReview();
		d.medicines = Array.from({ length: 5 }, () => medicine());
		expect(calculateReview(d).polypharmacyBand).toBe('polypharmacy');
	});

	it('bands 9 regular medicines as polypharmacy', () => {
		const d = createCompleteReview();
		d.medicines = Array.from({ length: 9 }, () => medicine());
		expect(calculateReview(d).polypharmacyBand).toBe('polypharmacy');
	});

	it('bands 10 regular medicines as hyperpolypharmacy', () => {
		const d = createCompleteReview();
		d.medicines = Array.from({ length: 10 }, () => medicine());
		const r = calculateReview(d);
		expect(r.polypharmacyBand).toBe('hyperpolypharmacy');
		expect(r.burdenBand).toBe('high');
	});

	it('only regular medicines count toward polypharmacy', () => {
		const d = createCompleteReview();
		d.medicines = [
			...Array.from({ length: 4 }, () => medicine()),
			...Array.from({ length: 3 }, () => medicine({ isRegular: 'no' }))
		];
		const r = calculateReview(d);
		expect(r.medicineCount).toBe(7);
		expect(r.regularMedicineCount).toBe(4);
		expect(r.polypharmacyBand).toBe('none');
	});

	// Anticholinergic-burden boundary (2/3).
	it('bands ACB sum of 2 as low', () => {
		const d = createCompleteReview();
		d.medicines = [medicine({ anticholinergicBurdenPoints: 1 }), medicine({ anticholinergicBurdenPoints: 1 })];
		const r = calculateReview(d);
		expect(r.anticholinergicBurdenScore).toBe(2);
		expect(r.anticholinergicBand).toBe('low');
	});

	it('bands ACB sum of 3 as significant and burden high', () => {
		const d = createCompleteReview();
		d.medicines = [medicine({ anticholinergicBurdenPoints: 3 })];
		const r = calculateReview(d);
		expect(r.anticholinergicBurdenScore).toBe(3);
		expect(r.anticholinergicBand).toBe('significant');
		expect(r.burdenBand).toBe('high');
	});

	it('a null ACB contributes 0 to the sum', () => {
		const d = createCompleteReview();
		d.medicines = [medicine({ anticholinergicBurdenPoints: null }), medicine({ anticholinergicBurdenPoints: 2 })];
		expect(calculateReview(d).anticholinergicBurdenScore).toBe(2);
	});

	it('composite burden is moderate for 5 regular medicines with low ACB', () => {
		const d = createCompleteReview();
		d.medicines = Array.from({ length: 5 }, () => medicine({ anticholinergicBurdenPoints: 0 }));
		expect(calculateReview(d).burdenBand).toBe('moderate');
	});

	it('collects STOPP and START flags per medicine', () => {
		const d = createCompleteReview();
		d.medicines = [
			medicine({ stoppCriterion: 'STOPP D5 — TCA with dementia' }),
			medicine({ startCriterion: 'START A6 — statin in diabetes' })
		];
		const r = calculateReview(d);
		expect(r.stopFlags).toHaveLength(1);
		expect(r.startFlags).toHaveLength(1);
	});
});

describe('structured-medication-review flag detection', () => {
	it('raises no flags for a complete, clean review', () => {
		const d = createCompleteReview();
		const grade = calculateReview(d);
		expect(detectFlaggedIssues(d, grade)).toHaveLength(0);
	});

	it('raises high-acb when the ACB sum is 3 or more', () => {
		const d = createCompleteReview();
		d.medicines = [medicine({ anticholinergicBurdenPoints: 3 })];
		const flags = detectFlaggedIssues(d, calculateReview(d));
		expect(flags.some((f) => f.id === 'F-HIGH-ACB-001')).toBe(true);
	});

	it('raises a STOPP-trigger flag', () => {
		const d = createCompleteReview();
		d.medicines = [medicine({ stoppCriterion: 'STOPP D5' })];
		const flags = detectFlaggedIssues(d, calculateReview(d));
		expect(flags.some((f) => f.id === 'F-STOPP-TRIGGER-001')).toBe(true);
	});

	it('raises a missing-monitoring flag when monitoring is not up to date', () => {
		const d = createCompleteReview();
		d.medicines = [medicine({ monitoringRequired: 'yes', monitoringUpToDate: 'no' })];
		const flags = detectFlaggedIssues(d, calculateReview(d));
		expect(flags.some((f) => f.id === 'F-MISSING-MONITORING-001')).toBe(true);
	});

	it('raises a missing-monitoring flag when there are overdue items', () => {
		const d = createCompleteReview();
		d.monitoring.overdueMonitoringCount = 2;
		const flags = detectFlaggedIssues(d, calculateReview(d));
		expect(flags.some((f) => f.id === 'F-MISSING-MONITORING-001')).toBe(true);
	});

	it('raises an adherence-concern flag for partial/poor adherence', () => {
		const d = createCompleteReview();
		d.medicines = [medicine({ adherence: 'poor' })];
		const flags = detectFlaggedIssues(d, calculateReview(d));
		expect(flags.some((f) => f.id === 'F-ADHERENCE-CONCERN-001')).toBe(true);
	});

	it('raises high-risk-no-indication for a high-risk medicine without indication', () => {
		const d = createCompleteReview();
		d.medicines = [
			medicine({
				drugName: 'Warfarin',
				isHighRisk: 'yes',
				highRiskClass: 'anticoagulant',
				indication: '',
				indicationRecorded: 'no'
			})
		];
		const flags = detectFlaggedIssues(d, calculateReview(d));
		expect(flags.some((f) => f.id === 'F-HIGH-RISK-NO-INDICATION-001')).toBe(true);
	});

	it('raises an incomplete flag for an incomplete review', () => {
		const d = createDefaultReview();
		const flags = detectFlaggedIssues(d, calculateReview(d));
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createDefaultReview();
		d.medicines = [medicine({ anticholinergicBurdenPoints: 3, adherence: 'poor' })];
		const flags = detectFlaggedIssues(d, calculateReview(d));
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});

	it('gradeReview attaches flags and a timestamp', () => {
		const r = gradeReview(createCompleteReview());
		expect(Array.isArray(r.flaggedIssues)).toBe(true);
		expect(typeof r.timestamp).toBe('string');
	});
});
