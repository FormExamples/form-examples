import { describe, it, expect } from 'vitest';
import { calculatePalliativeGrade, gradeESAS } from './esas-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { rules } from './rules';
import { classifyESASTotal, classifyIndividualSymptom } from './utils';
import type { AssessmentData } from './types';

// A fully-blank assessment, built inline so the pure-engine test stays
// independent of the Svelte runes store (which cannot run under plain Vitest).
function blankAssessment(): AssessmentData {
	return {
		demographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			nhsOrMrnNumber: '',
			preferredLanguage: '',
			ethnicity: '',
			reporterRole: '',
			reporterName: '',
			assessmentDate: '',
			assessmentSetting: ''
		},
		primaryDiagnosisPrognosis: {
			primaryDiagnosis: '',
			secondaryDiagnoses: '',
			dateOfDiagnosis: '',
			stageOrSeverity: '',
			diseaseProgressing: '',
			prognosisHorizon: '',
			surpriseQuestion: '',
			prognosticIndicators: '',
			relevantTreatmentHistory: ''
		},
		esasrSymptoms: {
			pain: null,
			tiredness: null,
			drowsiness: null,
			nausea: null,
			lackOfAppetite: null,
			shortnessOfBreath: null,
			depression: null,
			anxiety: null,
			wellbeing: null,
			other: null,
			otherLabel: '',
			symptomNotes: ''
		},
		performanceStatus: {
			ppsScore: null,
			akpsScore: null,
			ecogScore: null,
			mobilityNotes: '',
			activityLevel: '',
			bedBound: '',
			requiresAssistanceWithAdls: '',
			adlNotes: ''
		},
		goalsOfCareACP: {
			patientPrioritiesAndWishes: '',
			preferredPlaceOfCare: '',
			preferredPlaceOfDeath: '',
			respectFormCompleted: '',
			respectFormDate: '',
			adrtCompleted: '',
			adrtDate: '',
			lpaHealthAndWelfare: '',
			lpaName: '',
			dnacprDocumented: '',
			dnacprDate: '',
			ceilingOfTreatmentDiscussed: '',
			ceilingOfTreatmentNotes: ''
		},
		medicationsSymptomControl: {
			regularMedications: [],
			asNeededMedications: [],
			syringeDriverInUse: '',
			syringeDriverDetails: '',
			anticipatoryMedsPrescribed: '',
			anticipatoryMedsNotes: '',
			symptomControlOverall: '',
			barriersToControl: '',
			planNotes: ''
		},
		psychosocialSpiritualConcerns: {
			moodConcerns: '',
			moodNotes: '',
			anxietyConcerns: '',
			anxietyNotes: '',
			existentialDistress: '',
			existentialNotes: '',
			spiritualSupportRequested: '',
			faithOrBelief: '',
			chaplaincyNotes: '',
			unresolvedConcerns: '',
			unresolvedNotes: ''
		},
		carerFamilySupport: {
			primaryCarerName: '',
			primaryCarerRelationship: '',
			carerLivesWithPatient: '',
			carerStrainReported: '',
			carerStrainLevel: '',
			carerStrainNotes: '',
			respiteRequired: '',
			respiteNotes: '',
			childrenInHousehold: '',
			childrenSupportNotes: '',
			bereavementRiskIdentified: '',
			bereavementNotes: ''
		},
		multidisciplinaryPlan: {
			specialistPalliativeCareInvolved: '',
			communityNursingInvolved: '',
			hospiceReferralMade: '',
			socialWorkReferralMade: '',
			occupationalTherapyReferralMade: '',
			physiotherapyReferralMade: '',
			dieticianReferralMade: '',
			chaplaincyReferralMade: '',
			psychologyReferralMade: '',
			otherReferrals: '',
			reviewInterval: '',
			keyWorkerName: '',
			planSummary: ''
		}
	};
}

function withSymptoms(scores: Partial<AssessmentData['esasrSymptoms']>): AssessmentData {
	const d = blankAssessment();
	d.esasrSymptoms = { ...d.esasrSymptoms, ...scores };
	return d;
}

describe('classifyESASTotal', () => {
	it('bands the total 0-100 correctly', () => {
		expect(classifyESASTotal(0)).toBe('none');
		expect(classifyESASTotal(10)).toBe('none');
		expect(classifyESASTotal(11)).toBe('mild');
		expect(classifyESASTotal(30)).toBe('mild');
		expect(classifyESASTotal(31)).toBe('moderate');
		expect(classifyESASTotal(60)).toBe('moderate');
		expect(classifyESASTotal(61)).toBe('severe');
		expect(classifyESASTotal(100)).toBe('severe');
	});
});

describe('classifyIndividualSymptom', () => {
	it('bands a single symptom 0-10', () => {
		expect(classifyIndividualSymptom(null)).toBe('');
		expect(classifyIndividualSymptom(0)).toBe('none');
		expect(classifyIndividualSymptom(3)).toBe('mild');
		expect(classifyIndividualSymptom(6)).toBe('moderate');
		expect(classifyIndividualSymptom(7)).toBe('severe');
		expect(classifyIndividualSymptom(10)).toBe('severe');
	});
});

describe('ESAS-r grading engine', () => {
	it('returns a blank/none grade for an unanswered assessment', () => {
		const result = calculatePalliativeGrade(blankAssessment());
		expect(result.esasTotal).toBe(0);
		expect(result.answeredCount).toBe(0);
		expect(result.severityBand).toBe('none');
		expect(result.individualFlags).toHaveLength(0);
		expect(result.firedRules).toHaveLength(0);
	});

	it('sums only answered symptoms and excludes nulls from the count', () => {
		const result = gradeESAS(withSymptoms({ pain: 5, tiredness: 3, nausea: null }));
		expect(result.esasTotal).toBe(8);
		expect(result.answeredCount).toBe(2);
	});

	it('classifies a severe total (61-100)', () => {
		const result = calculatePalliativeGrade(
			withSymptoms({
				pain: 8,
				tiredness: 8,
				drowsiness: 7,
				nausea: 7,
				lackOfAppetite: 8,
				shortnessOfBreath: 7,
				depression: 7,
				anxiety: 7,
				wellbeing: 8,
				other: 7
			})
		);
		expect(result.esasTotal).toBe(74);
		expect(result.severityBand).toBe('severe');
	});

	it('raises an individual flag for any symptom >= 7', () => {
		const result = gradeESAS(withSymptoms({ pain: 8, tiredness: 2 }));
		expect(result.individualFlags.some((f) => f.symptomKey === 'pain')).toBe(true);
		expect(result.individualFlags.some((f) => f.symptomKey === 'tiredness')).toBe(false);
	});

	it('fires the uncontrolled-severe-symptom ancillary rule', () => {
		const result = gradeESAS(withSymptoms({ shortnessOfBreath: 9 }));
		expect(result.firedRules.some((r) => r.id === 'PALL-ANC-001')).toBe(true);
	});

	it('has unique rule IDs', () => {
		const ids = rules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Palliative flagged-issue detection', () => {
	it('returns no flags for an unanswered assessment', () => {
		expect(detectAdditionalFlags(blankAssessment())).toHaveLength(0);
	});

	it('flags uncontrolled severe pain (high priority)', () => {
		const flags = detectAdditionalFlags(withSymptoms({ pain: 9 }));
		expect(flags.some((f) => f.id === 'FLAG-PALL-PAIN' && f.priority === 'high')).toBe(true);
	});

	it('flags no DNACPR for an end-of-life patient', () => {
		const data = blankAssessment();
		data.performanceStatus.ppsScore = 20;
		data.goalsOfCareACP.dnacprDocumented = 'no';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-PALL-DNACPR')).toBe(true);
	});

	it('flags carer overwhelm', () => {
		const data = blankAssessment();
		data.carerFamilySupport.carerStrainLevel = 'overwhelmed';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-PALL-CARER-OVERWHELM')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const flags = detectAdditionalFlags(withSymptoms({ pain: 9, tiredness: 5, drowsiness: 2 }));
		const order = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
