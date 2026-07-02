import { describe, it, expect } from 'vitest';
import { calculateGrade, isComplete } from './breast-screening-grader';
import { deriveEligibility, outcomeRules } from './breast-screening-rules';
import { detectFlaggedIssues } from './flagged-issues';
import type { ScreeningData } from './types';

/**
 * A blank screening record (mirrors the store's `createDefaultAssessment`).
 * Defined locally so the engine tests never import the store, which pulls in
 * the SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): ScreeningData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			reportedAt: '',
			screeningUnit: '',
			episodeType: ''
		},
		identification: {
			patientIdentifier: '',
			ageYears: null,
			lastScreenedDate: '',
			higherRiskSurveillance: ''
		},
		eligibility: { symptomatic: '', consentGiven: '' },
		mammogram: { viewsTaken: '', imageAdequacy: '' },
		reading: {
			firstReadOpinion: '',
			secondReadOpinion: '',
			arbitrationOutcome: '',
			readingOutcome: ''
		},
		assessment: { assessmentPerformed: '', assessmentModalities: [], imagingClassification: null },
		note: { clinicalContext: '' }
	};
}

/** A complete normal routine-recall record for a 58-year-old. */
function createNormal(): ScreeningData {
	const d = createDefaultAssessment();
	d.context.episodeType = 'routine-recall';
	d.identification.ageYears = 58;
	d.eligibility = { symptomatic: 'no', consentGiven: 'yes' };
	d.mammogram = { viewsTaken: 'standard-four-view', imageAdequacy: 'adequate' };
	d.reading.readingOutcome = 'normal-routine-recall';
	return d;
}

describe('Breast-screening eligibility gate', () => {
	it('routes a symptomatic woman to the symptomatic pathway', () => {
		const d = createNormal();
		d.eligibility.symptomatic = 'yes';
		expect(deriveEligibility(d)).toBe('symptomatic-referral');
	});

	it('routes a higher-risk surveillance woman to the surveillance pathway', () => {
		const d = createNormal();
		d.identification.higherRiskSurveillance = 'yes';
		expect(deriveEligibility(d)).toBe('higher-risk-surveillance');
	});

	it('flags outside-age-range below 50 and above 70 for routine episodes', () => {
		const d = createNormal();
		d.identification.ageYears = 49;
		expect(deriveEligibility(d)).toBe('outside-age-range');
		d.identification.ageYears = 71;
		expect(deriveEligibility(d)).toBe('outside-age-range');
	});

	it('is eligible at the 50 and 70 age boundaries', () => {
		const d = createNormal();
		d.identification.ageYears = 50;
		expect(deriveEligibility(d)).toBe('eligible');
		d.identification.ageYears = 70;
		expect(deriveEligibility(d)).toBe('eligible');
	});
});

describe('Breast-screening classification engine', () => {
	it('classifies a normal reading as routine recall', () => {
		const r = calculateGrade(createNormal());
		expect(r.screeningOutcome).toBe('routine-recall');
		expect(r.outcomeBand).toBe('routine');
		expect(r.status).toBe('complete');
	});

	it('classifies a technical-repeat reading', () => {
		const d = createNormal();
		d.reading.readingOutcome = 'technical-repeat';
		const r = calculateGrade(d);
		expect(r.screeningOutcome).toBe('technical-repeat');
		expect(r.outcomeBand).toBe('repeat');
	});

	it('classifies a recall not yet assessed as recall-to-assessment-clinic', () => {
		const d = createNormal();
		d.reading.readingOutcome = 'recall-for-assessment';
		const r = calculateGrade(d);
		expect(r.screeningOutcome).toBe('recall-to-assessment-clinic');
		expect(r.outcomeBand).toBe('assessment');
	});

	it('refines an assessed class 1–2 recall to routine recall', () => {
		const d = createNormal();
		d.reading.readingOutcome = 'recall-for-assessment';
		d.assessment.assessmentPerformed = 'yes';
		d.assessment.imagingClassification = 2;
		const r = calculateGrade(d);
		expect(r.screeningOutcome).toBe('routine-recall');
		expect(r.outcomeBand).toBe('routine');
	});

	it('refines an assessed class 3 recall to short-interval follow-up', () => {
		const d = createNormal();
		d.reading.readingOutcome = 'recall-for-assessment';
		d.assessment.assessmentPerformed = 'yes';
		d.assessment.imagingClassification = 3;
		const r = calculateGrade(d);
		expect(r.screeningOutcome).toBe('short-interval-follow-up');
		expect(r.outcomeBand).toBe('assessment');
	});

	it('refines an assessed class 4–5 recall to urgent breast clinic', () => {
		for (const c of [4, 5] as const) {
			const d = createNormal();
			d.reading.readingOutcome = 'recall-for-assessment';
			d.assessment.assessmentPerformed = 'yes';
			d.assessment.imagingClassification = c;
			const r = calculateGrade(d);
			expect(r.screeningOutcome).toBe('urgent-breast-clinic');
			expect(r.outcomeBand).toBe('urgent');
		}
	});

	it('short-circuits a symptomatic record to the symptomatic pathway', () => {
		const d = createNormal();
		d.eligibility.symptomatic = 'yes';
		const r = calculateGrade(d);
		expect(r.screeningOutcome).toBe('symptomatic-pathway-referral');
		expect(r.outcomeBand).toBe('referral');
		expect(r.status).toBe('complete');
	});

	it('is incomplete when required inputs are missing', () => {
		const r = calculateGrade(createDefaultAssessment());
		expect(r.outcomeBand).toBe('incomplete');
		expect(r.status).toBe('incomplete');
	});

	it('is incomplete when recalled and assessed but classification is missing', () => {
		const d = createNormal();
		d.reading.readingOutcome = 'recall-for-assessment';
		d.assessment.assessmentPerformed = 'yes';
		d.assessment.imagingClassification = null;
		expect(isComplete(d)).toBe(false);
	});

	it('all rule IDs are unique', () => {
		const ids = outcomeRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Breast-screening flagged-issue detection', () => {
	it('raises the symptomatic wrong-pathway flag', () => {
		const d = createNormal();
		d.eligibility.symptomatic = 'yes';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'F-SYMPTOMATIC-WRONG-PATHWAY-001')).toBe(true);
	});

	it('raises the suspicious/malignant flag for class 4–5', () => {
		const d = createNormal();
		d.reading.readingOutcome = 'recall-for-assessment';
		d.assessment.assessmentPerformed = 'yes';
		d.assessment.imagingClassification = 5;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'F-SUSPICIOUS-MALIGNANT-001')).toBe(true);
	});

	it('raises the technical-repeat flag for an inadequate image', () => {
		const d = createNormal();
		d.mammogram.imageAdequacy = 'inadequate';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'F-TECHNICAL-REPEAT-001')).toBe(true);
	});

	it('raises the consent-not-given flag', () => {
		const d = createNormal();
		d.eligibility.consentGiven = 'declined';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'F-CONSENT-NOT-GIVEN-001')).toBe(true);
	});

	it('raises the outside-age-range flag for a routine episode', () => {
		const d = createNormal();
		d.identification.ageYears = 44;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'F-OUTSIDE-AGE-RANGE-001')).toBe(true);
	});

	it('raises the incomplete-record flag for a blank record', () => {
		const flags = detectFlaggedIssues(createDefaultAssessment());
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-RECORD-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNormal();
		d.eligibility.symptomatic = 'yes'; // high
		d.eligibility.consentGiven = 'declined'; // medium
		const flags = detectFlaggedIssues(d);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
