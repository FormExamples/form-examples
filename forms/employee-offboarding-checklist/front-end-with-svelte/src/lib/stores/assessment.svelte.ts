import { browser } from '$app/env';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';

/** localStorage draft key for a given checklist id (defaults to `new`). */
function storageKey(id: string): string {
	return `employee-offboarding-checklist.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank offboarding checklist with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		employeeDetails: {
			firstName: '',
			lastName: '',
			employeeId: '',
			email: '',
			jobTitle: '',
			department: '',
			lineManager: '',
			startDate: '',
			lastWorkingDay: '',
			reasonForLeaving: '',
			reasonForLeavingOther: '',
			employeeDetailsNotes: ''
		},
		exitInterview: {
			interviewOffered: '',
			interviewCompleted: '',
			interviewDate: '',
			interviewerName: '',
			feedbackProvided: '',
			feedbackDocumented: '',
			concernsRaised: '',
			concernsDetails: '',
			exitInterviewNotes: ''
		},
		knowledgeTransfer: {
			successorIdentified: '',
			successorName: '',
			handoverDocumentCreated: '',
			handoverMeetingsHeld: '',
			workInProgressDocumented: '',
			keyContactsShared: '',
			sopFilesTransferred: '',
			clinicalCaseloadReassigned: '',
			knowledgeTransferNotes: ''
		},
		equipmentReturn: {
			laptopReturned: '',
			laptopAssetTag: '',
			mobilePhoneReturned: '',
			idBadgeReturned: '',
			keysReturned: '',
			uniformReturned: '',
			parkingPassReturned: '',
			otherEquipmentReturned: '',
			otherEquipmentDescription: '',
			equipmentReturnNotes: ''
		},
		accessRevocation: {
			emailRevoked: '',
			ehrEprRevoked: '',
			vpnRevoked: '',
			activeDirectoryDisabled: '',
			buildingAccessRevoked: '',
			cloudAppsRevoked: '',
			smartcardDeactivated: '',
			dataDownloadAuditPerformed: '',
			unauthorisedDownloadDetected: '',
			accessRevocationNotes: ''
		},
		finalPayrollBenefits: {
			finalSalaryCalculated: '',
			accruedHolidayPaid: '',
			expensesReimbursed: '',
			pensionInformationProvided: '',
			p45Issued: '',
			benefitsTerminated: '',
			payrollDetailsConfirmed: '',
			finalPaymentDate: '',
			finalPayrollNotes: ''
		},
		referencesRecommendations: {
			referenceConsentGiven: '',
			referenceContactDetailsRecorded: '',
			recommendationLetterRequested: '',
			recommendationLetterProvided: '',
			referencePolicyExplained: '',
			referencesNotes: ''
		},
		nonDisclosurePostEmployment: {
			confidentialityReaffirmed: '',
			ndaSigned: '',
			restrictiveCovenantsExplained: '',
			restrictiveCovenantsAcknowledged: '',
			intellectualPropertyAssigned: '',
			dataReturnedOrDestroyed: '',
			postEmploymentObligationsExplained: '',
			ndaNotes: ''
		},
		forwardingDetails: {
			forwardingAddressLine1: '',
			forwardingAddressLine2: '',
			forwardingCity: '',
			forwardingPostcode: '',
			forwardingCountry: '',
			personalEmail: '',
			personalPhone: '',
			forwardingDetailsConfirmed: '',
			forwardingNotes: ''
		},
		signoff: {
			hrSignedOff: '',
			hrSignOffName: '',
			hrSignOffDate: '',
			lineManagerSignedOff: '',
			lineManagerSignOffName: '',
			lineManagerSignOffDate: '',
			itSignedOff: '',
			itSignOffName: '',
			itSignOffDate: '',
			employeeAcknowledged: '',
			employeeSignOffDate: '',
			signoffNotes: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the offboarding checklist, with localStorage
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
	 * (e.g. `const d = assessment.data.employeeDetails`) stay bound to live state.
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
