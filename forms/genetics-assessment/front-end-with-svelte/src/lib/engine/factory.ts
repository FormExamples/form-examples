// Plain (runes-free) factory functions for building blank assessment data and
// pedigree relatives. Kept out of the `.svelte.ts` store so the pure engine and
// its Vitest tests can import them without pulling in Svelte runes or
// SvelteKit's `$app/*` modules.

import type { AssessmentData, Relative, Sex } from './types';

/** Build a fresh, empty fixed-slot Relative (grandparents, parents). */
export function emptyFixedRelative(opts: {
	relation: string;
	side: 'maternal' | 'paternal' | 'self' | '';
	generation: 1 | 2 | 3;
	sex: Sex;
}): Relative {
	return {
		id: opts.relation.toLowerCase().replace(/\s+/g, '-'),
		relation: opts.relation,
		side: opts.side,
		generation: opts.generation,
		sex: opts.sex,
		name: '',
		affectedWithCancer: '',
		cancers: [],
		deceased: '',
		ageAtDeath: null,
		causeOfDeath: '',
		notes: ''
	};
}

/** Build a fresh, empty repeating-list Relative (sibling, child, cousin, etc.). */
export function emptyRelative(opts: {
	relation: string;
	side: 'maternal' | 'paternal' | 'self' | '';
	generation: 1 | 2 | 3;
}): Relative {
	return {
		id: `${opts.relation.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		relation: opts.relation,
		side: opts.side,
		generation: opts.generation,
		sex: '',
		name: '',
		affectedWithCancer: '',
		cancers: [],
		deceased: '',
		ageAtDeath: null,
		causeOfDeath: '',
		notes: ''
	};
}

/** A blank genetics assessment with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		probandDemographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			mrn: '',
			preferredContact: ''
		},
		presentingConcern: {
			chiefConcern: '',
			referralReason: '',
			referringClinician: '',
			urgency: '',
			suspectedSyndrome: ''
		},
		personalMedicalHistory: {
			personalCancerHistory: '',
			cancers: [],
			multiplePrimaryCancers: '',
			congenitalAnomalies: '',
			congenitalAnomaliesDetails: '',
			developmentalDelay: '',
			priorRadiation: '',
			otherSignificantHistory: ''
		},
		familyPedigree: {
			maternalGrandmother: emptyFixedRelative({
				relation: 'Maternal grandmother',
				side: 'maternal',
				generation: 1,
				sex: 'female'
			}),
			maternalGrandfather: emptyFixedRelative({
				relation: 'Maternal grandfather',
				side: 'maternal',
				generation: 1,
				sex: 'male'
			}),
			paternalGrandmother: emptyFixedRelative({
				relation: 'Paternal grandmother',
				side: 'paternal',
				generation: 1,
				sex: 'female'
			}),
			paternalGrandfather: emptyFixedRelative({
				relation: 'Paternal grandfather',
				side: 'paternal',
				generation: 1,
				sex: 'male'
			}),
			mother: emptyFixedRelative({
				relation: 'Mother',
				side: 'maternal',
				generation: 2,
				sex: 'female'
			}),
			father: emptyFixedRelative({
				relation: 'Father',
				side: 'paternal',
				generation: 2,
				sex: 'male'
			}),
			maternalAuntsUncles: [],
			paternalAuntsUncles: [],
			siblings: [],
			children: [],
			maternalCousins: [],
			paternalCousins: []
		},
		consanguinityAncestry: {
			consanguinity: '',
			consanguinityDetails: '',
			maternalAncestry: '',
			paternalAncestry: '',
			ashkenaziJewish: '',
			sephardicJewish: '',
			foundingPopulation: '',
			foundingPopulationDetails: ''
		},
		targetedRiskScoring: {
			manchester: {
				probandFemaleBreastUnder30: null,
				probandFemaleBreast30to39: null,
				probandFemaleBreast40to49: null,
				probandOvarianUnder60: null,
				probandMaleBreast: null,
				relativeFemaleBreastUnder30: null,
				relativeFemaleBreast30to39: null,
				relativeFemaleBreast40to49: null,
				relativeOvarianUnder60: null,
				relativeMaleBreast: null,
				relativePancreaticUnder60: null,
				relativeProstateUnder60: null
			},
			bethesda: {
				crcUnder50: '',
				synchronousMetachronous: '',
				msiHistology: '',
				firstDegreeLynchTumour: '',
				multipleRelativesLynch: ''
			},
			tyrerCuzick: {
				ageYears: null,
				ageAtMenarche: null,
				parous: '',
				ageAtFirstLiveBirth: null,
				menopausal: '',
				ageAtMenopause: null,
				heightCm: null,
				weightKg: null,
				hrtCurrent: '',
				priorBenignBreastDisease: '',
				atypicalHyperplasia: '',
				lcis: '',
				dense: '',
				externalTenYearRisk: null,
				externalLifetimeRisk: null
			},
			premm5: {
				probandColorectal: '',
				probandEndometrial: '',
				probandOtherLynchTumour: '',
				youngestProbandAgeAtLynchTumour: null,
				firstDegreeWithCRC: null,
				firstDegreeWithEndometrial: null,
				firstDegreeWithOtherLynch: null,
				secondDegreeWithLynch: null,
				youngestRelativeAgeAtLynchTumour: null,
				externalPREMM5Percent: null
			}
		},
		priorGeneticTesting: {
			priorTesting: '',
			priorTests: [],
			variantsOfUncertainSignificance: '',
			variantsOfUncertainSignificanceDetails: '',
			familialVariantKnown: '',
			familialVariantDetails: '',
			priorGeneticCounselling: '',
			priorCounsellingNotes: ''
		},
		patientUnderstandingConcerns: {
			understandingOfReferral: '',
			primaryConcerns: '',
			expectations: '',
			insuranceConcerns: '',
			confidentialityConcerns: '',
			reproductiveImplications: '',
			supportSystem: '',
			consentToTesting: ''
		},
		recommendationReferralPlan: {
			clinicianAssignedRisk: '',
			recommendBRCATesting: '',
			recommendLynchTesting: '',
			recommendPanelTesting: '',
			recommendMMRIHC: '',
			recommendedPanel: '',
			referClinicalGenetics: '',
			referBreastSurveillance: '',
			referColonoscopy: '',
			referPsychologicalSupport: '',
			referralUrgency: '',
			clinicianSummary: '',
			clinicianName: '',
			clinicianRole: '',
			signatureDate: ''
		}
	};
}
