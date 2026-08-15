import { browser } from '$app/env';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';

/** localStorage draft key for a given checklist id (defaults to `new`). */
function storageKey(id: string): string {
	return `employee-onboarding-checklist.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank onboarding checklist with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		demographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			email: '',
			phone: '',
			jobTitle: '',
			department: '',
			startDate: '',
			emergencyContactName: '',
			emergencyContactPhone: '',
			emergencyContactRelationship: ''
		},
		preEmploymentChecks: {
			dbsCheckStatus: '',
			dbsCertificateNumber: '',
			dbsCheckDate: '',
			dbsUpdateServiceRegistered: '',
			rightToWorkVerified: '',
			rightToWorkDocumentType: '',
			rightToWorkExpiryDate: '',
			referencesReceived: null,
			referencesRequired: null,
			referencesSatisfactory: '',
			identityVerified: '',
			preEmploymentNotes: ''
		},
		occupationalHealth: {
			ohQuestionnaireSubmitted: '',
			ohClearanceReceived: '',
			ohClearanceDate: '',
			ohRestrictions: '',
			ohRestrictionDetails: '',
			hepatitisBStatus: '',
			tbScreeningStatus: '',
			immunisationStatus: '',
			fitToWork: '',
			occupationalHealthNotes: ''
		},
		mandatoryTraining: {
			fireSafetyCompleted: '',
			fireSafetyDate: '',
			manualHandlingCompleted: '',
			manualHandlingDate: '',
			infectionControlCompleted: '',
			infectionControlDate: '',
			safeguardingAdultsCompleted: '',
			safeguardingAdultsLevel: '',
			safeguardingChildrenCompleted: '',
			safeguardingChildrenLevel: '',
			informationGovernanceCompleted: '',
			informationGovernanceDate: '',
			basicLifeSupportCompleted: '',
			basicLifeSupportDate: '',
			equalityDiversityCompleted: '',
			healthSafetyCompleted: '',
			conflictResolutionCompleted: '',
			mandatoryTrainingNotes: ''
		},
		professionalRegistration: {
			registrationRequired: '',
			regulatoryBody: '',
			regulatoryBodyOther: '',
			registrationNumber: '',
			registrationVerified: '',
			registrationExpiryDate: '',
			registrationConditions: '',
			registrationConditionDetails: '',
			revalidationDate: '',
			indemnityInsurance: '',
			professionalRegistrationNotes: ''
		},
		itSystemsAccess: {
			nhsSmartcardIssued: '',
			nhsSmartcardNumber: '',
			emailAccountCreated: '',
			networkLoginCreated: '',
			clinicalSystemAccess: '',
			clinicalSystemName: '',
			clinicalSystemTrainingCompleted: '',
			rosteringSystemAccess: '',
			phoneExtension: '',
			bleepNumber: '',
			itAccessNotes: ''
		},
		uniformIDBadge: {
			uniformRequired: '',
			uniformOrdered: '',
			uniformReceived: '',
			uniformSize: '',
			idBadgePhotoTaken: '',
			idBadgeIssued: '',
			idBadgeNumber: '',
			accessCardIssued: '',
			accessCardAreas: '',
			lockerAllocated: '',
			lockerNumber: '',
			uniformIdNotes: ''
		},
		inductionProgramme: {
			corporateInductionCompleted: '',
			corporateInductionDate: '',
			localInductionCompleted: '',
			localInductionDate: '',
			departmentTourCompleted: '',
			introducedToTeam: '',
			emergencyProceduresBriefed: '',
			policiesHandbookReceived: '',
			buddyAssigned: '',
			buddyName: '',
			inductionProgrammeNotes: ''
		},
		probationSupervision: {
			probationPeriodMonths: null,
			probationStartDate: '',
			probationEndDate: '',
			lineManagerName: '',
			lineManagerEmail: '',
			supervisorName: '',
			supervisionFrequency: '',
			firstSupervisionDate: '',
			objectivesSet: '',
			appraisalDateAgreed: '',
			appraisalDate: '',
			probationSupervisionNotes: ''
		},
		signOffCompliance: {
			confidentialityAgreementSigned: '',
			codeOfConductSigned: '',
			socialMediaPolicyAcknowledged: '',
			itAcceptableUseSigned: '',
			gdprTrainingCompleted: '',
			dutyOfCandourBriefed: '',
			whistleblowingPolicyBriefed: '',
			employeeSignedOff: '',
			employeeSignOffDate: '',
			managerSignedOff: '',
			managerSignOffDate: '',
			managerSignOffName: '',
			signOffComplianceNotes: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the onboarding checklist, with localStorage
 * persistence so an in-progress checklist survives a page reload. Drafts are
 * keyed by checklist id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the checklist currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the checklist for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` checklist is used
	 * (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = assessment.data.demographics`) stay bound to live state.
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
 * them — reactive when a new checklist is loaded.
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
