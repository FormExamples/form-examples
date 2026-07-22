// Direct TypeScript port of ../../../front-end-with-html/js/types.js
// emptyAssessment() — builds the canonical empty state so newly-added
// fields default correctly. All instrument items are nullable numeric
// enums; only the visit header uses text fields.

import type { PatientReportedOutcomeMeasures } from './types';

/** Build a fresh, fully-blank PRO-measures battery. */
export function createEmptyAssessment(): PatientReportedOutcomeMeasures {
	return {
		visitDetails: {
			subjectId: '',
			visit: '',
			assessmentDate: ''
		},
		sf36: {
			generalHealth: null,
			healthChangeVsYearAgo: null,
			vigorousActivities: null,
			moderateActivities: null,
			liftingCarryingGroceries: null,
			climbingSeveralFlights: null,
			climbingOneFlight: null,
			bendingKneelingStooping: null,
			walkingMoreThanMile: null,
			walkingSeveralHundredYards: null,
			walkingOneHundredYards: null,
			bathingDressing: null,
			cutDownTimePhysical: null,
			accomplishedLessPhysical: null,
			limitedInKindPhysical: null,
			difficultyPerformingPhysical: null,
			cutDownTimeEmotional: null,
			accomplishedLessEmotional: null,
			lessCarefulThanUsual: null,
			socialActivitiesInterference: null,
			bodilyPain: null,
			painInterferenceWithWork: null,
			feltFullOfLife: null,
			veryNervous: null,
			soDownInDumps: null,
			feltCalmPeaceful: null,
			lotOfEnergy: null,
			downheartedDepressed: null,
			feltWornOut: null,
			beenHappy: null,
			feltTired: null,
			socialActivitiesInterferenceTime: null,
			getSickEasier: null,
			asHealthyAsAnybody: null,
			expectHealthWorse: null,
			healthExcellent: null
		},
		ndi: {
			painIntensity: null,
			personalCare: null,
			lifting: null,
			reading: null,
			headache: null,
			concentration: null,
			work: null,
			driving: null,
			sleeping: null,
			recreation: null
		},
		mjoa: {
			motorArms: null,
			motorLegs: null,
			sensationArms: null,
			sensationLegs: null,
			sensationTrunk: null,
			bladderFunction: null
		},
		eq5d: {
			mobility: null,
			selfCare: null,
			usualActivities: null,
			painDiscomfort: null,
			anxietyDepression: null,
			vasScore: null
		}
	};
}
