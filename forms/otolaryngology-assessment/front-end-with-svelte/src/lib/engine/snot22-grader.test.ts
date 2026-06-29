import { describe, it, expect } from 'vitest';
import { calculateSnot22, classifySnot22Score } from './snot22-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { snot22Rules } from './snot22-rules';
import type { AssessmentData, Snot22Key } from './types';
import { SNOT22_ITEMS } from './types';

/**
 * A blank assessment for tests. Kept local (rather than importing the store's
 * `createDefaultAssessment`) so the engine tests do not pull in SvelteKit's
 * `$app/environment` module, which Vitest does not resolve.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		demographics: { firstName: '', lastName: '', dateOfBirth: '', sex: '', occupation: '' },
		presentingComplaint: {
			earSymptoms: '',
			noseSymptoms: '',
			throatSymptoms: '',
			neckSymptoms: '',
			chiefComplaint: ''
		},
		historyOfPresentIllness: {
			onsetDate: '',
			onsetType: '',
			progression: '',
			laterality: '',
			previousEpisodes: '',
			aggravatingFactors: '',
			relievingFactors: '',
			associatedSymptoms: ''
		},
		pastEntHistory: {
			priorEntSurgery: '',
			priorEntSurgeryDetails: '',
			chronicSinusitis: '',
			allergicRhinitis: '',
			hearingLoss: '',
			tinnitus: '',
			vertigo: '',
			hearingAids: '',
			headNeckCancer: '',
			headNeckRadiotherapy: '',
			smoking: '',
			alcohol: ''
		},
		snot22: {
			needToBlowNose: null,
			sneezing: null,
			runnyNose: null,
			nasalBlockage: null,
			lossOfSmellTaste: null,
			coughing: null,
			postNasalDischarge: null,
			thickNasalDischarge: null,
			earFullness: null,
			dizziness: null,
			earPain: null,
			facialPainPressure: null,
			difficultyFallingAsleep: null,
			wakingUpAtNight: null,
			lackOfGoodNightsSleep: null,
			wakingUpTired: null,
			fatigue: null,
			reducedProductivity: null,
			reducedConcentration: null,
			frustratedRestlessIrritable: null,
			sad: null,
			embarrassed: null
		},
		externalExamination: {
			facialAsymmetry: '',
			facialSwelling: '',
			skinLesions: '',
			externalEarFindings: '',
			externalNoseFindings: '',
			examinationNotes: ''
		},
		otoscopy: {
			right: { tympanicMembrane: '', canal: '', mobility: '' },
			left: { tympanicMembrane: '', canal: '', mobility: '' },
			otoscopyNotes: ''
		},
		anteriorRhinoscopy: {
			right: { septum: '', mucosa: '', polyps: '', discharge: '', turbinateHypertrophy: '' },
			left: { septum: '', mucosa: '', polyps: '', discharge: '', turbinateHypertrophy: '' },
			rhinoscopyNotes: ''
		},
		oropharyngealNeckExamination: {
			oralMucosa: '',
			tonsils: '',
			pharynx: '',
			palateMovement: '',
			cervicalLymphadenopathy: '',
			cervicalLymphadenopathyDetails: '',
			thyroidEnlarged: '',
			neckMass: '',
			neckMassDetails: '',
			examinationNotes: ''
		},
		clinicalImpressionPlan: {
			workingDiagnosis: '',
			differentialDiagnosis: '',
			investigationsRequired: '',
			investigationsDetails: '',
			medicationPrescribed: '',
			medicationDetails: '',
			referralRequired: '',
			referralDetails: '',
			surgeryConsidered: '',
			surgeryDetails: '',
			followUpPlan: '',
			patientEducation: ''
		}
	};
}

/** Set every SNOT-22 item to the same value. */
function fillSnot22(data: AssessmentData, value: number): void {
	for (const { key } of SNOT22_ITEMS) {
		data.snot22[key as Snot22Key] = value;
	}
}

describe('SNOT-22 classification bands', () => {
	it('classifies 0-7 as mild', () => {
		expect(classifySnot22Score(0)).toBe('mild');
		expect(classifySnot22Score(7)).toBe('mild');
	});
	it('classifies 8-19 as moderate', () => {
		expect(classifySnot22Score(8)).toBe('moderate');
		expect(classifySnot22Score(19)).toBe('moderate');
	});
	it('classifies >=20 as severe', () => {
		expect(classifySnot22Score(20)).toBe('severe');
		expect(classifySnot22Score(110)).toBe('severe');
	});
});

describe('SNOT-22 grader', () => {
	it('returns zero total and mild for a blank assessment', () => {
		const data = createDefaultAssessment();
		const result = calculateSnot22(data);
		expect(result.totalScore).toBe(0);
		expect(result.answeredCount).toBe(0);
		expect(result.severityLevel).toBe('mild');
		expect(result.firedRules).toHaveLength(0);
	});

	it('counts only answered items and sums them', () => {
		const data = createDefaultAssessment();
		data.snot22.needToBlowNose = 3;
		data.snot22.nasalBlockage = 2;
		const result = calculateSnot22(data);
		expect(result.answeredCount).toBe(2);
		expect(result.totalScore).toBe(5);
		expect(result.severityLevel).toBe('mild');
	});

	it('computes the maximum 110 total and severe band when all items are 5', () => {
		const data = createDefaultAssessment();
		fillSnot22(data, 5);
		const result = calculateSnot22(data);
		expect(result.totalScore).toBe(110);
		expect(result.answeredCount).toBe(22);
		expect(result.severityLevel).toBe('severe');
		expect(result.firedRules).toHaveLength(22);
	});

	it('treats 0 as an answered item (not blank)', () => {
		const data = createDefaultAssessment();
		data.snot22.sneezing = 0;
		const result = calculateSnot22(data);
		expect(result.answeredCount).toBe(1);
		expect(result.totalScore).toBe(0);
	});

	it('has 22 rules with unique ids', () => {
		expect(snot22Rules).toHaveLength(22);
		const ids = snot22Rules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('SNOT-22 flagged issues detection', () => {
	it('returns no flags for a blank assessment', () => {
		const data = createDefaultAssessment();
		expect(detectAdditionalFlags(data)).toHaveLength(0);
	});

	it('raises an urgent flag for a neck mass', () => {
		const data = createDefaultAssessment();
		data.oropharyngealNeckExamination.neckMass = 'yes';
		const flags = detectAdditionalFlags(data);
		const f = flags.find((x) => x.id === 'FLAG-NECK-001');
		expect(f).toBeDefined();
		expect(f?.priority).toBe('urgent');
	});

	it('raises an urgent flag for sudden-onset hearing loss', () => {
		const data = createDefaultAssessment();
		data.pastEntHistory.hearingLoss = 'yes';
		data.historyOfPresentIllness.onsetType = 'sudden';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-AUD-001' && f.priority === 'urgent')).toBe(true);
	});

	it('flags tympanic membrane perforation per side', () => {
		const data = createDefaultAssessment();
		data.otoscopy.left.tympanicMembrane = 'perforated';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-OTO-PERF-LEFT')).toBe(true);
	});

	it('flags large nasal polyps and asymmetric tonsils', () => {
		const data = createDefaultAssessment();
		data.anteriorRhinoscopy.right.polyps = 'large';
		data.oropharyngealNeckExamination.tonsils = 'asymmetric';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-RHINO-POLYP-RIGHT')).toBe(true);
		expect(flags.some((f) => f.id === 'FLAG-OROPHX-001')).toBe(true);
	});

	it('raises the sleep-domain SNOT-22 flag when the burden is high', () => {
		const data = createDefaultAssessment();
		data.snot22.difficultyFallingAsleep = 3;
		data.snot22.wakingUpAtNight = 3;
		data.snot22.lackOfGoodNightsSleep = 3;
		data.snot22.wakingUpTired = 3;
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-SNOT-SLEEP')).toBe(true);
	});

	it('sorts flags urgent > high > medium > low', () => {
		const data = createDefaultAssessment();
		data.oropharyngealNeckExamination.neckMass = 'yes'; // urgent
		data.externalExamination.skinLesions = 'yes'; // low
		data.pastEntHistory.smoking = 'yes'; // medium
		data.pastEntHistory.headNeckCancer = 'yes'; // high
		const flags = detectAdditionalFlags(data);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 };
		const priorities = flags.map((f) => order[f.priority]);
		const sorted = [...priorities].sort((a, b) => a - b);
		expect(priorities).toEqual(sorted);
	});
});
