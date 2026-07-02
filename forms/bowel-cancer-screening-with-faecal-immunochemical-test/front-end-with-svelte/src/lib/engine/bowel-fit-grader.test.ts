import { describe, it, expect } from 'vitest';
import { gradeFit } from './bowel-fit-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { classificationRules, DEFAULT_THRESHOLD } from './bowel-fit-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: { clinicianName: '', clinicianRole: '', reviewedAt: '', screeningHub: '' },
		identification: { participantIdentifier: '', nhsNumber: '', participantAge: null, sex: '' },
		eligibility: {
			withinAgeRange: '',
			recallInterval: '',
			invitationDate: '',
			previousOutcome: ''
		},
		kit: { kitReturned: '', returnDate: '', sampleAdequacy: '', spoiltReason: '' },
		result: { faecalHaemoglobinUgG: null, assay: '', thresholdApplied: DEFAULT_THRESHOLD },
		symptoms: { redFlagSymptoms: '' },
		note: { clinicalNote: '' }
	};
}

/** A returned, adequate kit ready for a numeric result. */
function createReturnedKit(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'screening-practitioner',
		reviewedAt: '2026-06-20T09:30',
		screeningHub: 'Northern Hub'
	};
	d.identification = {
		participantIdentifier: 'BCSP-1001',
		nhsNumber: '943 476 5919',
		participantAge: 62,
		sex: 'male'
	};
	d.eligibility = {
		withinAgeRange: 'eligible',
		recallInterval: 'two-yearly',
		invitationDate: '2026-06-01',
		previousOutcome: 'prior-negative'
	};
	d.kit = { kitReturned: 'yes', returnDate: '2026-06-14', sampleAdequacy: 'adequate', spoiltReason: '' };
	d.symptoms.redFlagSymptoms = 'no';
	return d;
}

describe('bowel-cancer-screening FIT grader', () => {
	it('classifies at the threshold (120) as positive → colonoscopy', () => {
		const d = createReturnedKit();
		d.result.faecalHaemoglobinUgG = 120;
		const r = gradeFit(d);
		expect(r.resultClass).toBe('positive');
		expect(r.managementAction).toBe('refer-colonoscopy');
		expect(r.status).toBe('complete');
	});

	it('classifies just below the threshold (119) as negative → routine recall', () => {
		const d = createReturnedKit();
		d.result.faecalHaemoglobinUgG = 119;
		const r = gradeFit(d);
		expect(r.resultClass).toBe('negative');
		expect(r.managementAction).toBe('routine-recall');
	});

	it('classifies just above the threshold (121) as positive', () => {
		const d = createReturnedKit();
		d.result.faecalHaemoglobinUgG = 121;
		expect(gradeFit(d).resultClass).toBe('positive');
	});

	it('honours a custom (symptomatic DG56) threshold of 10', () => {
		const d = createReturnedKit();
		d.result.thresholdApplied = 10;
		d.result.faecalHaemoglobinUgG = 15;
		expect(gradeFit(d).resultClass).toBe('positive');
		d.result.faecalHaemoglobinUgG = 9;
		expect(gradeFit(d).resultClass).toBe('negative');
	});

	it('treats a kit that was not returned as repeat-kit, not classified', () => {
		const d = createReturnedKit();
		d.kit.kitReturned = 'no';
		d.result.faecalHaemoglobinUgG = 200; // ignored — no sample
		const r = gradeFit(d);
		expect(r.resultClass).toBe('');
		expect(r.managementAction).toBe('repeat-kit');
	});

	it('treats a spoilt / inadequate sample as spoilt → repeat-kit', () => {
		for (const adequacy of ['spoilt', 'insufficient', 'expired'] as const) {
			const d = createReturnedKit();
			d.kit.sampleAdequacy = adequacy;
			const r = gradeFit(d);
			expect(r.resultClass).toBe('spoilt');
			expect(r.managementAction).toBe('repeat-kit');
		}
	});

	it('treats a returned, adequate kit with no Hb value as incomplete', () => {
		const d = createReturnedKit();
		d.result.faecalHaemoglobinUgG = null;
		const r = gradeFit(d);
		expect(r.resultClass).toBe('');
		expect(r.status).toBe('incomplete');
		expect(r.managementAction).toBe('repeat-kit');
	});

	it('sets the symptomatic pathway independently of a negative result', () => {
		const d = createReturnedKit();
		d.result.faecalHaemoglobinUgG = 30; // negative
		d.symptoms.redFlagSymptoms = 'yes';
		const r = gradeFit(d);
		expect(r.resultClass).toBe('negative');
		expect(r.symptomaticPathway).toBe(true);
		expect(r.flaggedIssues.some((f) => f.id === 'F-SYMPTOMATIC-SUSPECTED-CANCER-001')).toBe(true);
	});

	it('all classification rule IDs are unique', () => {
		const ids = Object.values(classificationRules).map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('bowel-cancer-screening FIT flagged-issue detection', () => {
	it('raises no red flags for a complete negative screen', () => {
		const d = createReturnedKit();
		d.result.faecalHaemoglobinUgG = 30;
		expect(gradeFit(d).flaggedIssues).toHaveLength(0);
	});

	it('raises the positive-screen flag on a positive result', () => {
		const d = createReturnedKit();
		d.result.faecalHaemoglobinUgG = 250;
		const r = gradeFit(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-POSITIVE-COLONOSCOPY-001')).toBe(true);
	});

	it('raises the non-return flag when the kit was not returned', () => {
		const d = createReturnedKit();
		d.kit.kitReturned = 'no';
		const flags = detectFlaggedIssues(d, { resultClass: '', symptomaticPathway: false, status: 'complete' });
		expect(flags.some((f) => f.id === 'F-NON-RETURN-001')).toBe(true);
	});

	it('raises the spoilt-kit flag for an inadequate sample', () => {
		const d = createReturnedKit();
		d.kit.sampleAdequacy = 'spoilt';
		d.kit.spoiltReason = 'leaked';
		const flags = detectFlaggedIssues(d, { resultClass: 'spoilt', symptomaticPathway: false, status: 'complete' });
		expect(flags.some((f) => f.id === 'F-SPOILT-KIT-001')).toBe(true);
	});

	it('raises the incomplete-result flag when Hb is missing on an adequate kit', () => {
		const d = createReturnedKit();
		d.result.faecalHaemoglobinUgG = null;
		expect(gradeFit(d).flaggedIssues.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createReturnedKit();
		d.result.faecalHaemoglobinUgG = 300; // positive (high)
		d.symptoms.redFlagSymptoms = 'yes'; // symptomatic (high)
		const flags = gradeFit(d).flaggedIssues;
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
