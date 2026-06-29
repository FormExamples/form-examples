import { describe, it, expect } from 'vitest';
import { gradeOET, gradeAssessment, classifyScaledScore } from './oet-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { criterionRegistry } from './rules';
import type { AssessmentData } from './types';

/** A blank assessment (mirrors the store's createDefaultAssessment, without the `$app` import). */
function createDefaultAssessment(): AssessmentData {
	return {
		candidate: {
			candidateId: '',
			candidateName: '',
			examinerName: '',
			testCentre: '',
			testDate: '',
			profession: 'medicine',
			firstLanguage: '',
			countryOfTraining: '',
			yearsOfExperience: ''
		},
		rolePlay1: {
			scenarioTitle: '',
			scenarioSummary: '',
			patientRole: '',
			setting: '',
			safetyCriticality: '',
			examinerNotes: ''
		},
		rolePlay2: {
			scenarioTitle: '',
			scenarioSummary: '',
			patientRole: '',
			setting: '',
			safetyCriticality: '',
			examinerNotes: ''
		},
		linguisticRolePlay1: { fluency: null, grammar: null, pronunciation: null, clinicalAppropriateness: null },
		linguisticRolePlay2: { fluency: null, grammar: null, pronunciation: null, clinicalAppropriateness: null },
		clinicalIndicators: {
			relationshipBuilding: null,
			understandingPatientPerspective: null,
			providingStructure: null,
			informationGathering: null,
			informationGiving: null,
			examinerNotes: ''
		}
	};
}

/** A top-band candidate: all linguistic 6, all clinical 3. */
function expertCandidate(): AssessmentData {
	const d = createDefaultAssessment();
	d.candidate.candidateName = 'Eleri Top';
	d.linguisticRolePlay1 = { fluency: 6, grammar: 6, pronunciation: 6, clinicalAppropriateness: 6 };
	d.linguisticRolePlay2 = { fluency: 6, grammar: 6, pronunciation: 6, clinicalAppropriateness: 6 };
	d.clinicalIndicators = {
		...d.clinicalIndicators,
		relationshipBuilding: 3,
		understandingPatientPerspective: 3,
		providingStructure: 3,
		informationGathering: 3,
		informationGiving: 3
	};
	return d;
}

/** A bottom-band candidate: linguistic 2, clinical 1. */
function limitedCandidate(): AssessmentData {
	const d = createDefaultAssessment();
	d.linguisticRolePlay1 = { fluency: 2, grammar: 2, pronunciation: 2, clinicalAppropriateness: 2 };
	d.linguisticRolePlay2 = { fluency: 2, grammar: 2, pronunciation: 2, clinicalAppropriateness: 2 };
	d.clinicalIndicators = {
		...d.clinicalIndicators,
		relationshipBuilding: 1,
		understandingPatientPerspective: 1,
		providingStructure: 1,
		informationGathering: 1,
		informationGiving: 1
	};
	return d;
}

describe('classifyScaledScore', () => {
	it('maps cut-points to grades', () => {
		expect(classifyScaledScore(500)).toBe('A');
		expect(classifyScaledScore(450)).toBe('A');
		expect(classifyScaledScore(440)).toBe('B');
		expect(classifyScaledScore(350)).toBe('B');
		expect(classifyScaledScore(340)).toBe('C+');
		expect(classifyScaledScore(300)).toBe('C+');
		expect(classifyScaledScore(290)).toBe('C');
		expect(classifyScaledScore(200)).toBe('C');
		expect(classifyScaledScore(190)).toBe('D');
		expect(classifyScaledScore(100)).toBe('D');
		expect(classifyScaledScore(90)).toBe('E');
		expect(classifyScaledScore(0)).toBe('E');
	});
});

describe('gradeOET', () => {
	it('grades an expert candidate as A with a perfect score', () => {
		const r = gradeOET(expertCandidate());
		expect(r.linguisticTotal).toBe(24);
		expect(r.clinicalTotal).toBe(15);
		expect(r.rawTotal).toBe(39);
		expect(r.scaledScore).toBe(500);
		expect(r.grade).toBe('A');
	});

	it('grades a limited candidate in the lower bands', () => {
		const r = gradeOET(limitedCandidate());
		expect(r.linguisticTotal).toBe(8);
		expect(r.clinicalTotal).toBe(5);
		expect(r.rawTotal).toBe(13);
		expect(r.scaledScore).toBe(167);
		expect(r.grade).toBe('D');
	});

	it('grades a fully blank assessment as E', () => {
		const r = gradeOET(createDefaultAssessment());
		expect(r.rawTotal).toBe(0);
		expect(r.scaledScore).toBe(0);
		expect(r.grade).toBe('E');
	});

	it('averages the two role-plays for linguistic criteria', () => {
		const d = createDefaultAssessment();
		d.linguisticRolePlay1 = { fluency: 6, grammar: 6, pronunciation: 6, clinicalAppropriateness: 6 };
		d.linguisticRolePlay2 = { fluency: 4, grammar: 4, pronunciation: 4, clinicalAppropriateness: 4 };
		const r = gradeOET(d);
		const flu = r.perCriterionScores.find((s) => s.id === 'LING-FLU');
		expect(flu?.meanScore).toBe(5);
		expect(r.linguisticTotal).toBe(20);
	});

	it('has a unique id per criterion', () => {
		const ids = criterionRegistry.map((c) => c.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('detectAdditionalFlags', () => {
	it('flags a high grade-band concern for limited candidates', () => {
		const data = limitedCandidate();
		const core = gradeOET(data);
		const flags = detectAdditionalFlags(data, core);
		expect(flags.some((f) => f.id === 'FLAG-GRADE-001')).toBe(true);
		expect(flags.some((f) => f.id === 'FLAG-LING-PRO-001')).toBe(true);
	});

	it('raises no grade-band flag for an expert candidate', () => {
		const data = expertCandidate();
		const core = gradeOET(data);
		const flags = detectAdditionalFlags(data, core);
		expect(flags.some((f) => f.category === 'Overall Grade')).toBe(false);
	});

	it('escalates a clinical failure to high in a safety-critical scenario', () => {
		const data = expertCandidate();
		data.rolePlay1.safetyCriticality = 'high';
		data.clinicalIndicators.informationGiving = 0;
		const core = gradeOET(data);
		const flags = detectAdditionalFlags(data, core);
		const f = flags.find((x) => x.id === 'FLAG-CLIN-informationGiving-0');
		expect(f?.priority).toBe('high');
	});

	it('sorts flags by priority (high first)', () => {
		const data = limitedCandidate();
		data.rolePlay1.examinerNotes = 'Some notes';
		const core = gradeOET(data);
		const flags = detectAdditionalFlags(data, core);
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => order[f.priority]);
		expect(priorities).toEqual([...priorities].sort((a, b) => a - b));
	});
});

describe('gradeAssessment', () => {
	it('attaches flags and a timestamp', () => {
		const r = gradeAssessment(limitedCandidate());
		expect(Array.isArray(r.additionalFlags)).toBe(true);
		expect(typeof r.timestamp).toBe('string');
		expect(r.grade).toBe('D');
	});
});
