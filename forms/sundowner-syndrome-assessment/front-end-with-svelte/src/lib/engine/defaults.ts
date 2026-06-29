import type { AssessmentData } from './types';
import { CMAI_ITEM_IDS, NPI_DOMAIN_KEYS } from './cmai-rules';

/**
 * A blank sundowner assessment with all fields at their unanswered defaults.
 * Pure (no Svelte runes) so it is importable from both the reactive store and
 * the Vitest engine tests.
 */
export function createDefaultAssessment(): AssessmentData {
	const cmai: Record<string, number> = {};
	for (const id of CMAI_ITEM_IDS) cmai[id] = 0;
	const npi: Record<string, { frequency: number; severity: number }> = {};
	for (const key of NPI_DOMAIN_KEYS) npi[key] = { frequency: 0, severity: 0 };

	return {
		demographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			ageYears: null,
			primaryDiagnosis: '',
			careSetting: ''
		},
		cognitiveStatus: {
			dementiaStage: '',
			cognitiveImpairment: '',
			mmseScore: null,
			mmseDate: '',
			priorDeliriumHistory: '',
			cognitiveNotes: ''
		},
		behaviouralSymptoms: {
			cmai,
			npi,
			behaviouralNotes: ''
		},
		temporalPattern: {
			typicalOnsetTime: '',
			typicalOffsetTime: '',
			peakTime: '',
			episodeFrequency: '',
			averageDurationMinutes: null,
			worseAtDusk: '',
			worseSeasonally: '',
			temporalNotes: ''
		},
		triggerIdentification: {
			fatigue: '',
			hunger: '',
			pain: '',
			infection: '',
			dehydration: '',
			sensoryOverload: '',
			unfamiliarSurroundings: '',
			carerChange: '',
			lowLight: '',
			medicationTiming: '',
			otherTriggers: ''
		},
		sleepWakeCycle: {
			bedtimeHourClock: null,
			averageHoursOfSleep: null,
			difficultyFallingAsleep: '',
			nighttimeWandering: '',
			earlyMorningWaking: '',
			daytimeNapping: '',
			nightAwakeningCount: null,
			reversedSleepCycle: '',
			sleepNotes: ''
		},
		medicationReview: {
			currentMedications: [],
			anticholinergicBurden: '',
			sedativeUse: '',
			antipsychoticUse: '',
			recentMedicationChange: '',
			recentMedicationChangeDetails: '',
			medicationAdherence: '',
			medicationNotes: ''
		},
		environmentalAssessment: {
			adequateDaylight: '',
			excessiveNoise: '',
			unfamiliarEnvironment: '',
			cluttered: '',
			mirrorsOrShadows: '',
			consistentRoutine: '',
			adequateSocialContact: '',
			environmentalNotes: ''
		},
		carerImpact: {
			primaryCarer: '',
			carerRelationship: '',
			carerStrainLevel: '',
			carerSleepDisturbed: '',
			carerBurnoutSigns: '',
			respiteCareInPlace: '',
			formalSupportEngaged: '',
			carerNotes: ''
		},
		managementPlan: {
			nonPharmacologicalPlan: '',
			nonPharmacologicalDetails: '',
			environmentalModifications: '',
			environmentalModificationDetails: '',
			medicationReviewRequired: '',
			referralRequired: '',
			referralDetails: '',
			reviewDate: '',
			planSummary: ''
		}
	};
}
