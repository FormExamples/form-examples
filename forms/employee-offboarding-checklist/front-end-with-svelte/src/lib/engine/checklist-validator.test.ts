import { describe, it, expect } from 'vitest';
import { validateChecklist } from './checklist-validator';
import { detectAdditionalFlags } from './flagged-issues';
import { validationRules } from './validation-rules';
import type { AssessmentData } from './types';

/**
 * A blank checklist with every field at its unanswered default. Kept inline
 * (rather than importing the store factory) so the test does not pull in
 * SvelteKit's `$app/environment` module, which is unavailable under Vitest.
 */
function createBlankChecklist(): AssessmentData {
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

/** A fully-completed checklist where every rule is satisfied. */
function createCompleteChecklist(): AssessmentData {
	const d = createBlankChecklist();
	d.employeeDetails = {
		...d.employeeDetails,
		firstName: 'Alex',
		lastName: 'Taylor',
		lastWorkingDay: '2026-07-31',
		reasonForLeaving: 'resignation'
	};
	d.exitInterview = {
		...d.exitInterview,
		interviewOffered: 'yes',
		interviewCompleted: 'yes',
		feedbackDocumented: 'yes'
	};
	d.knowledgeTransfer = {
		...d.knowledgeTransfer,
		successorIdentified: 'yes',
		handoverDocumentCreated: 'yes',
		workInProgressDocumented: 'yes',
		clinicalCaseloadReassigned: 'yes'
	};
	d.equipmentReturn = {
		...d.equipmentReturn,
		laptopReturned: 'yes',
		mobilePhoneReturned: 'yes',
		idBadgeReturned: 'yes',
		keysReturned: 'yes',
		uniformReturned: 'na',
		parkingPassReturned: 'na'
	};
	d.accessRevocation = {
		...d.accessRevocation,
		emailRevoked: 'yes',
		ehrEprRevoked: 'yes',
		vpnRevoked: 'yes',
		activeDirectoryDisabled: 'yes',
		buildingAccessRevoked: 'yes',
		cloudAppsRevoked: 'yes',
		dataDownloadAuditPerformed: 'yes',
		unauthorisedDownloadDetected: 'no'
	};
	d.finalPayrollBenefits = {
		...d.finalPayrollBenefits,
		finalSalaryCalculated: 'yes',
		accruedHolidayPaid: 'yes',
		p45Issued: 'yes',
		payrollDetailsConfirmed: 'yes'
	};
	d.referencesRecommendations = {
		...d.referencesRecommendations,
		referenceConsentGiven: 'yes',
		referencePolicyExplained: 'yes'
	};
	d.nonDisclosurePostEmployment = {
		...d.nonDisclosurePostEmployment,
		confidentialityReaffirmed: 'yes',
		restrictiveCovenantsExplained: 'yes',
		intellectualPropertyAssigned: 'yes',
		dataReturnedOrDestroyed: 'yes'
	};
	d.forwardingDetails = {
		...d.forwardingDetails,
		forwardingAddressLine1: '1 High Street',
		forwardingPostcode: 'AB1 2CD',
		forwardingDetailsConfirmed: 'yes'
	};
	d.signoff = {
		...d.signoff,
		hrSignedOff: 'yes',
		lineManagerSignedOff: 'yes',
		itSignedOff: 'yes',
		employeeAcknowledged: 'yes'
	};
	return d;
}

describe('Offboarding Completeness Validation', () => {
	it('returns Complete with 100% for a fully-completed checklist', () => {
		const result = validateChecklist(createCompleteChecklist());
		expect(result.outcome).toBe('complete');
		expect(result.completionPercent).toBe(100);
		expect(result.firedRules).toHaveLength(0);
		expect(result.blockers).toHaveLength(0);
		expect(result.additionalFlags).toHaveLength(0);
	});

	it('returns Partial when only non-blocking items are outstanding', () => {
		const d = createCompleteChecklist();
		// Non-mandatory, non-blocking item outstanding.
		d.referencesRecommendations.referencePolicyExplained = 'no';
		d.exitInterview.interviewCompleted = 'no';
		const result = validateChecklist(d);
		expect(result.outcome).toBe('partial');
		expect(result.blockers).toHaveLength(0);
		expect(result.firedRules.length).toBeGreaterThan(0);
	});

	it('returns Incomplete when a mandatory blocker is outstanding', () => {
		const d = createCompleteChecklist();
		d.accessRevocation.emailRevoked = 'no';
		const result = validateChecklist(d);
		expect(result.outcome).toBe('incomplete');
		expect(result.blockers.some((b) => b.id === 'AC-001')).toBe(true);
	});

	it('returns Incomplete for a blank checklist with completion below 100%', () => {
		const result = validateChecklist(createBlankChecklist());
		expect(result.outcome).toBe('incomplete');
		expect(result.completionPercent).toBeLessThan(100);
		expect(result.mandatoryTotal).toBeGreaterThan(0);
		expect(result.mandatorySatisfied).toBe(0);
	});

	it('has unique rule IDs', () => {
		const ids = validationRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Offboarding Flagged Issues Detection', () => {
	it('returns no flags for a fully-completed checklist', () => {
		const flags = detectAdditionalFlags(createCompleteChecklist());
		expect(flags).toHaveLength(0);
	});

	it('flags unauthorised data download as high priority', () => {
		const d = createCompleteChecklist();
		d.accessRevocation.unauthorisedDownloadDetected = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-AC-001' && f.priority === 'high')).toBe(true);
	});

	it('flags outstanding access channels', () => {
		const d = createCompleteChecklist();
		d.accessRevocation.vpnRevoked = 'no';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-AC-002')).toBe(true);
	});

	it('flags equipment not returned', () => {
		const d = createCompleteChecklist();
		d.equipmentReturn.laptopReturned = 'no';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-EQ-001')).toBe(true);
	});

	it('flags missing forwarding address as low priority', () => {
		const d = createCompleteChecklist();
		d.forwardingDetails.forwardingAddressLine1 = '';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-FWD-001' && f.priority === 'low')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const flags = detectAdditionalFlags(createBlankChecklist());
		const order = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
