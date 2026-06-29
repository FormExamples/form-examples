import { describe, it, expect } from 'vitest';
import { calculateOetGrade } from './oet-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { oetRules } from './rules';
import { scoreToGrade, rawToScore, RAW_MAX } from './utils';
import type { AssessmentData } from './types';

function createBlank(): AssessmentData {
	return {
		candidateDetails: {
			candidateNumber: '',
			firstName: '',
			lastName: '',
			dateOfTest: '',
			profession: '',
			firstLanguage: '',
			testVenue: '',
			assessorName: ''
		},
		rolePlay1: { setting: '', patientRole: '', candidateTask: '', notes: '', completed: 'yes' },
		rolePlay2: { setting: '', patientRole: '', candidateTask: '', notes: '', completed: 'yes' },
		linguisticCriteria: {
			intelligibility: null,
			fluency: null,
			appropriatenessOfLanguage: null,
			resourcesOfGrammarAndExpression: null
		},
		clinicalCommunication: {
			relationshipBuilding: null,
			understandingPatientPerspective: null,
			providingStructure: null,
			informationGathering: null,
			informationGiving: null,
			examinerComments: ''
		}
	};
}

/** A strong candidate (Grade A). */
function strong(): AssessmentData {
	const d = createBlank();
	d.candidateDetails.lastName = 'Strong';
	d.linguisticCriteria = {
		intelligibility: 6,
		fluency: 6,
		appropriatenessOfLanguage: 6,
		resourcesOfGrammarAndExpression: 6
	};
	d.clinicalCommunication = {
		relationshipBuilding: 3,
		understandingPatientPerspective: 3,
		providingStructure: 3,
		informationGathering: 3,
		informationGiving: 3,
		examinerComments: ''
	};
	return d;
}

describe('scoreToGrade boundaries', () => {
	it('maps scores to the published OET grade bands', () => {
		expect(scoreToGrade(500)).toBe('A');
		expect(scoreToGrade(450)).toBe('A');
		expect(scoreToGrade(440)).toBe('B');
		expect(scoreToGrade(350)).toBe('B');
		expect(scoreToGrade(340)).toBe('C+');
		expect(scoreToGrade(300)).toBe('C+');
		expect(scoreToGrade(290)).toBe('C');
		expect(scoreToGrade(200)).toBe('C');
		expect(scoreToGrade(190)).toBe('D');
		expect(scoreToGrade(100)).toBe('D');
		expect(scoreToGrade(90)).toBe('E');
		expect(scoreToGrade(0)).toBe('E');
	});
});

describe('OET Grading Engine', () => {
	it('scores a perfect candidate as Grade A (500/500)', () => {
		const result = calculateOetGrade(strong());
		expect(result.rawTotal).toBe(RAW_MAX);
		expect(result.score).toBe(500);
		expect(result.grade).toBe('A');
		expect(result.outcome).toBe('pass');
		expect(result.firedRules).toHaveLength(0);
	});

	it('scores a blank assessment as Grade E (0/500)', () => {
		const result = calculateOetGrade(createBlank());
		expect(result.score).toBe(0);
		expect(result.grade).toBe('E');
		expect(result.outcome).toBe('refer');
	});

	it('sums linguistic and communication totals correctly', () => {
		const d = strong();
		d.linguisticCriteria.fluency = 4;
		const result = calculateOetGrade(d);
		expect(result.linguisticTotal).toBe(22);
		expect(result.communicationTotal).toBe(15);
		expect(result.rawTotal).toBe(37);
		expect(result.score).toBe(rawToScore(37));
	});

	it('fires criterion-weakness rules for low bands', () => {
		const d = strong();
		d.linguisticCriteria.intelligibility = 2;
		d.clinicalCommunication.informationGiving = 0;
		const result = calculateOetGrade(d);
		expect(result.firedRules.some((r) => r.id === 'LING-INT-1')).toBe(true);
		expect(result.firedRules.some((r) => r.id === 'LING-INT-2')).toBe(true);
		expect(result.firedRules.some((r) => r.id === 'COMM-GIV-2')).toBe(true);
	});

	it('produces a Grade B pass in the mid-high range', () => {
		const d = createBlank();
		d.linguisticCriteria = {
			intelligibility: 5,
			fluency: 4,
			appropriatenessOfLanguage: 5,
			resourcesOfGrammarAndExpression: 4
		};
		d.clinicalCommunication = {
			relationshipBuilding: 3,
			understandingPatientPerspective: 2,
			providingStructure: 3,
			informationGathering: 3,
			informationGiving: 2,
			examinerComments: ''
		};
		const result = calculateOetGrade(d);
		expect(result.grade).toBe('B');
		expect(result.outcome).toBe('pass');
	});

	it('detects all rule IDs are unique', () => {
		const ids = oetRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('OET Flagged Issues Detection', () => {
	it('flags a distinction for Grade A', () => {
		const flags = detectAdditionalFlags(strong());
		expect(flags.some((f) => f.id === 'FLAG-DIST-001')).toBe(true);
	});

	it('flags below-registration-threshold for low grades', () => {
		const flags = detectAdditionalFlags(createBlank());
		expect(flags.some((f) => f.id === 'FLAG-REG-001')).toBe(true);
	});

	it('flags information-giving as a patient-safety risk when deficient', () => {
		const d = strong();
		d.clinicalCommunication.informationGiving = 0;
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-SAFETY-GIV-001')).toBe(true);
	});

	it('flags an incomplete role-play', () => {
		const d = strong();
		d.rolePlay2.completed = 'no';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-RP2-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createBlank();
		d.clinicalCommunication.informationGiving = 0;
		const flags = detectAdditionalFlags(d);
		const priorities = flags.map((f) => f.priority);
		const order = { high: 0, medium: 1, low: 2 };
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
