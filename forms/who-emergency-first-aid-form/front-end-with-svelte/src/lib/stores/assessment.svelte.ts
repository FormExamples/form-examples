import { browser } from '$app/environment';
import type { AssessmentData, CfarResult } from '$lib/engine/types';

/** localStorage draft key for a given encounter id (defaults to `new`). */
function storageKey(id: string): string {
	return `who-emergency-first-aid-form.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank WHO Emergency First Aid encounter with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		patientIdentification: {
			patientName: '',
			dateOfBirth: '',
			age: null,
			sex: '',
			patientContactInformation: '',
			contactPerson: { name: '', contactInformation: '' }
		},
		referralTransport: {
			referralFacility: { name: '', focalPoint: '', phoneNumber: '' },
			ambulance: { name: '', focalPoint: '', phoneNumber: '' },
			eventDateTime: '',
			departureDateTime: ''
		},
		situation: {
			medical: false,
			trauma: false,
			pregnant: '',
			whatHappened: ''
		},
		background: {
			pastMedicalAndSurgicalHistory: '',
			currentMedicationsOrAllergies: ''
		},
		majorBleeding: {
			assessmentNormal: false,
			assessmentFindings: '',
			interventions: {
				directPressure: false,
				deepWoundPacking: false,
				tourniquet: false,
				tourniquetApplicationTime: '',
				uterineMassage: false,
				none: false
			}
		},
		airway: {
			assessmentNormal: false,
			assessmentFindings: '',
			interventions: {
				neckImmobilization: false,
				headTiltChinLift: false,
				jawThrust: false,
				chokingCare: false,
				none: false
			}
		},
		breathing: {
			assessmentNormal: false,
			assessmentFindings: '',
			interventions: {
				maintainedPositionOfComfort: false,
				none: false
			}
		},
		circulation: {
			assessmentNormal: false,
			assessmentFindings: '',
			interventions: {
				pelvicBinder: false,
				controlMinorBleeding: false,
				fractureCare: false,
				oralHydration: false,
				leftLateralPosition: false,
				none: false
			}
		},
		disability: {
			assessmentNormal: false,
			assessmentFindings: '',
			interventions: {
				spinalImmobilisation: false,
				glucoseGiven: false,
				seizureCare: false,
				highTemperatureCare: false,
				lowTemperatureCare: false,
				none: false
			}
		},
		exposure: {
			assessmentNormal: false,
			assessmentFindings: '',
			interventions: {
				recoveryPosition: false,
				burnCare: false,
				woundCare: false,
				drowningCare: false,
				snakebiteCare: false,
				none: false
			},
			medicationTakenNone: false,
			medicationTakenDetails: ''
		},
		recommendations: {
			transportPlan: '',
			problemsAnticipated: '',
			otherConcerns: '',
			precautions: {
				highlyInfectiousDisease: false,
				spinalImmobilization: false,
				possibleFracture: false,
				fallRisk: false,
				alteredMentalStatus: false,
				other: false,
				otherDetails: ''
			}
		},
		responderDetails: {
			name: '',
			signature: '',
			contactInformation: '',
			cfarOrganization: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the WHO Emergency First Aid encounter, with
 * localStorage persistence so an in-progress record survives a page reload.
 * Drafts are keyed by encounter id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<CfarResult | null>(null);
	currentStep = $state(1);
	/** The id of the encounter currently loaded into the store (`new` for a fresh draft). */
	id = $state('new');

	constructor() {
		if (browser) {
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(storageKey(this.id), JSON.stringify(this.data));
				});
			});
		}
	}

	/**
	 * Load the encounter for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` record is used (e.g. a
	 * sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const p = assessment.data.patientIdentification`) stay bound to live
	 * state.
	 */
	loadForId(id: string, seed?: AssessmentData) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: AssessmentData | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as AssessmentData;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			(draft ?? seed ?? createDefaultAssessment()) as unknown as Record<string, unknown>
		);
	}

	reset() {
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			createDefaultAssessment() as unknown as Record<string, unknown>
		);
		this.result = null;
		this.currentStep = 1;
		if (browser) {
			localStorage.removeItem(storageKey(this.id));
		}
	}
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays are replaced). This
 * keeps Svelte's deep `$state` proxies — and any references captured from
 * them — reactive when a new encounter is loaded.
 */
function deepAssign(target: Record<string, unknown>, source: Record<string, unknown>) {
	for (const key of Object.keys(source)) {
		const sv = source[key];
		const tv = target[key];
		if (sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object') {
			deepAssign(tv as Record<string, unknown>, sv as Record<string, unknown>);
		} else {
			target[key] = sv;
		}
	}
}

export const assessment = new AssessmentStore();
