// The canonical blank questionnaire.
//
// Lives in the engine rather than the store so it can be imported by pure
// code and by the Vitest suite without pulling in SvelteKit's $app modules.

import type { HealthScreeningQuestionnaire } from './types';

/**
 * A blank health screening questionnaire with every field at its unanswered
 * default: '' for text and enum fields, null for numeric, date, and time
 * fields.
 */
export function createDefaultQuestionnaire(): HealthScreeningQuestionnaire {
	return {
		status: 'draft',
		context: {
			screeningPurpose: '',
			siteName: '',
			assessmentDate: '',
			assessmentMode: ''
		},
		assessor: {
			name: '',
			email: '',
			phone: '',
			role: '',
			registrationBody: '',
			registrationNumber: '',
			employer: ''
		},
		patient: {
			name: '',
			birthDate: '',
			sex: '',
			identifierType: '',
			identifierValue: '',
			email: '',
			phone: '',
			emergencyContactName: '',
			emergencyContactRelationship: '',
			emergencyContactPhone: ''
		},
		activityDiet: {
			usualActivityLevel: '',
			moderateExerciseDaysPerWeek: null,
			fruitAndVegetablePortionsPerDay: null,
			dietNotes: ''
		},
		smokingAlcohol: {
			smokingStatus: '',
			cigarettesPerDay: null,
			auditCFrequency: null,
			auditCTypicalQuantity: null,
			auditCBingeFrequency: null
		},
		medicalHistory: {
			conditionDiabetes: '',
			conditionHypertension: '',
			conditionAsthma: '',
			conditionCopd: '',
			conditionHeartDisease: '',
			conditionKidneyDisease: '',
			conditionThyroid: '',
			conditionOther: '',
			pastSurgeries: '',
			currentMedications: '',
			knownDrugAllergies: ''
		},
		familyHistory: {
			familyHistoryPrematureCardiacEvent: '',
			familyHistoryOther: ''
		},
		symptoms: {
			symptomUnexplainedChestPain: '',
			symptomDizzySpellsOrFainting: '',
			symptomPersistentCoughOver3Weeks: '',
			symptomUnexplainedWeightLoss: '',
			symptomJointPainRestrictingMovement: '',
			symptomShortnessOfBreathOnExertion: '',
			symptomPalpitations: ''
		},
		parq: {
			parqDiagnosedHeartCondition: '',
			parqChestPainAtRest: '',
			parqChestPainDuringActivity: '',
			parqDizzinessOrLossOfConsciousness: '',
			parqOtherChronicMedicalCondition: '',
			parqPrescribedMedicationForChronicCondition: '',
			parqBoneOrJointProblem: ''
		},
		vitals: {
			heightAsCm: null,
			weightAsKg: null,
			restingBloodPressureSystolic: null,
			restingBloodPressureDiastolic: null,
			restingHeartRate: null
		},
		occupational: {
			jobRole: '',
			physicalDemandsOfRole: '',
			exposureNoise: '',
			exposureChemicals: '',
			exposureManualHandling: '',
			exposureOther: '',
			exposureOtherDetail: ''
		},
		wellbeing: {
			stressLevel: null,
			sleepQuality: null,
			mentalHealthConcern: '',
			mentalHealthConcernNote: ''
		},
		vaccination: {
			vaccinationUpToDate: '',
			vaccinationGapsNote: ''
		},
		consent: {
			consentToScreening: '',
			informationAccurateConfirmed: '',
			interpreterRequired: ''
		},
		summary: {
			overrideRiskBand: '',
			overrideReason: '',
			notes: '',
			signedByName: ''
		}
	};
}
