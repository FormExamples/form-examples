import { describe, it, expect } from 'vitest';
import { calculateIntegumentaryGrade, classifyBradenScore } from './integumentary-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { bradenRules } from './braden-rules';
import type { AssessmentData } from './types';

/** A fully-blank assessment (mirrors the store's default factory). */
function baseData(): AssessmentData {
	return {
		demographics: { firstName: '', lastName: '', dateOfBirth: '', sex: '', weight: null, height: null, bmi: null },
		presentingSkinConcern: { chiefComplaint: '', onset: '', duration: '', location: '', pain: '', painScore: null, itching: '', bleeding: '', discharge: '', aggravatingFactors: '', relievingFactors: '', priorTreatment: '' },
		skinInspection: { colour: '', moisture: '', integrity: '', turgor: '', temperature: '', lesionTypes: [], lesions: [], additionalNotes: '' },
		hairScalpExamination: { hairDistribution: '', hairTexture: '', alopecia: '', alopeciaPattern: '', scalpLesions: '', scalpFindings: [], scalpNotes: '' },
		nailExamination: { nailColour: '', nailShape: '', nailCapillaryRefill: '', nailFindings: [], nailNotes: '' },
		woundAssessment: { woundPresent: '', woundLocation: '', woundStage: '', woundLength: null, woundWidth: null, woundDepth: null, tissueType: '', infectionSigns: '', moistureBalance: '', edgeCondition: '', exudateAmount: '', exudateType: '', woundOdour: '', woundNotes: '' },
		bradenScale: { sensoryPerception: null, moisture: null, activity: null, mobility: null, nutrition: null, frictionShear: null },
		photographyDocumentation: { consentObtained: '', photosTaken: '', photos: [], documentationNotes: '' },
		clinicalImpressionCarePlan: { clinicalImpression: '', differentialDiagnoses: '', carePlan: '', dressingRequired: '', dressingType: '', pressureReliefRequired: '', referralRequired: '', referralDetails: '', followUpDate: '', clinicianName: '' }
	};
}

describe('Braden score classification', () => {
	it('classifies the documented cutoffs', () => {
		expect(classifyBradenScore(8)).toBe('very-high-risk');
		expect(classifyBradenScore(9)).toBe('very-high-risk');
		expect(classifyBradenScore(11)).toBe('high-risk');
		expect(classifyBradenScore(13)).toBe('moderate-risk');
		expect(classifyBradenScore(17)).toBe('mild-risk');
		expect(classifyBradenScore(20)).toBe('no-risk');
		expect(classifyBradenScore(23)).toBe('no-risk');
	});
});

describe('Integumentary grading engine', () => {
	it('reports No Risk (23) when no Braden subscale is answered', () => {
		const data = baseData();
		const result = calculateIntegumentaryGrade(data);
		expect(result.answeredCount).toBe(0);
		expect(result.bradenScore).toBe(23);
		expect(result.riskLevel).toBe('no-risk');
		expect(result.firedRules).toHaveLength(0);
	});

	it('sums answered subscales and classifies a low total as very high risk', () => {
		const data = baseData();
		data.bradenScale = {
			sensoryPerception: 1,
			moisture: 1,
			activity: 1,
			mobility: 2,
			nutrition: 2,
			frictionShear: 1
		};
		const result = calculateIntegumentaryGrade(data);
		expect(result.answeredCount).toBe(6);
		expect(result.bradenScore).toBe(8);
		expect(result.riskLevel).toBe('very-high-risk');
		expect(result.firedRules).toHaveLength(6);
	});

	it('classifies a high total as no risk', () => {
		const data = baseData();
		data.bradenScale = {
			sensoryPerception: 4,
			moisture: 4,
			activity: 4,
			mobility: 4,
			nutrition: 4,
			frictionShear: 3
		};
		const result = calculateIntegumentaryGrade(data);
		expect(result.bradenScore).toBe(23);
		expect(result.riskLevel).toBe('no-risk');
	});

	it('has unique Braden rule IDs', () => {
		const ids = bradenRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Flagged-issue detection', () => {
	it('returns no flags for a blank assessment', () => {
		expect(detectAdditionalFlags(baseData())).toHaveLength(0);
	});

	it('raises an urgent flag for a stage IV wound', () => {
		const data = baseData();
		data.woundAssessment.woundPresent = 'yes';
		data.woundAssessment.woundStage = 'stage-iv';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-WOUND-001')).toBe(true);
		expect(flags[0].priority).toBe('urgent');
	});

	it('raises an urgent flag for wound infection signs', () => {
		const data = baseData();
		data.woundAssessment.woundPresent = 'yes';
		data.woundAssessment.infectionSigns = 'yes';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-WOUND-005')).toBe(true);
	});

	it('flags a large wound area', () => {
		const data = baseData();
		data.woundAssessment.woundPresent = 'yes';
		data.woundAssessment.woundLength = 6;
		data.woundAssessment.woundWidth = 5;
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-WOUND-008')).toBe(true);
	});

	it('flags photographs taken without consent', () => {
		const data = baseData();
		data.photographyDocumentation.photosTaken = 'yes';
		data.photographyDocumentation.consentObtained = 'no';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-DOC-001')).toBe(true);
	});

	it('flags cyanosis as urgent', () => {
		const data = baseData();
		data.skinInspection.colour = 'cyanotic';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-SKIN-004')).toBe(true);
	});

	it('sorts flags by priority (urgent first)', () => {
		const data = baseData();
		data.hairScalpExamination.alopecia = 'yes'; // low
		data.skinInspection.colour = 'cyanotic'; // urgent
		data.bradenScale.nutrition = 2; // medium
		const flags = detectAdditionalFlags(data);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
