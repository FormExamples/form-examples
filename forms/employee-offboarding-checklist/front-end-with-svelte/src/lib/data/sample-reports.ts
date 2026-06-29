import type { AssessmentData, Outcome } from '$lib/engine/types';
import { validateChecklist } from '$lib/engine/checklist-validator';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample checklist: an identifier and the full data the engine validates. */
export interface SampleAssessment {
	id: string;
	employeeName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the HR dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	employeeName: string;
	department: string;
	lastWorkingDay: string;
	outcome: Outcome;
	completionPercent: number;
	blockerCount: number;
	flagCount: number;
}

/** A fully-completed checklist: every mandatory item confirmed and signed off. */
function complete(): AssessmentData {
	const d = createDefaultAssessment();
	d.employeeDetails = {
		...d.employeeDetails,
		firstName: 'Sarah',
		lastName: 'Okafor',
		employeeId: 'EMP-4821',
		jobTitle: 'Staff Nurse',
		department: 'Cardiology',
		lineManager: 'J. Hughes',
		startDate: '2018-03-05',
		lastWorkingDay: '2026-07-15',
		reasonForLeaving: 'resignation'
	};
	d.exitInterview = {
		...d.exitInterview,
		interviewOffered: 'yes',
		interviewCompleted: 'yes',
		interviewDate: '2026-07-10',
		interviewerName: 'J. Hughes',
		feedbackProvided: 'yes',
		feedbackDocumented: 'yes',
		concernsRaised: 'no'
	};
	d.knowledgeTransfer = {
		...d.knowledgeTransfer,
		successorIdentified: 'yes',
		successorName: 'A. Bello',
		handoverDocumentCreated: 'yes',
		handoverMeetingsHeld: 'yes',
		workInProgressDocumented: 'yes',
		keyContactsShared: 'yes',
		sopFilesTransferred: 'yes',
		clinicalCaseloadReassigned: 'yes'
	};
	d.equipmentReturn = {
		...d.equipmentReturn,
		laptopReturned: 'yes',
		laptopAssetTag: 'LAP-2231',
		mobilePhoneReturned: 'yes',
		idBadgeReturned: 'yes',
		keysReturned: 'yes',
		uniformReturned: 'yes',
		parkingPassReturned: 'na',
		otherEquipmentReturned: 'na'
	};
	d.accessRevocation = {
		...d.accessRevocation,
		emailRevoked: 'yes',
		ehrEprRevoked: 'yes',
		vpnRevoked: 'yes',
		activeDirectoryDisabled: 'yes',
		buildingAccessRevoked: 'yes',
		cloudAppsRevoked: 'yes',
		smartcardDeactivated: 'yes',
		dataDownloadAuditPerformed: 'yes',
		unauthorisedDownloadDetected: 'no'
	};
	d.finalPayrollBenefits = {
		...d.finalPayrollBenefits,
		finalSalaryCalculated: 'yes',
		accruedHolidayPaid: 'yes',
		expensesReimbursed: 'yes',
		pensionInformationProvided: 'yes',
		p45Issued: 'yes',
		benefitsTerminated: 'yes',
		payrollDetailsConfirmed: 'yes',
		finalPaymentDate: '2026-07-31'
	};
	d.referencesRecommendations = {
		...d.referencesRecommendations,
		referenceConsentGiven: 'yes',
		referenceContactDetailsRecorded: 'yes',
		recommendationLetterRequested: 'no',
		referencePolicyExplained: 'yes'
	};
	d.nonDisclosurePostEmployment = {
		...d.nonDisclosurePostEmployment,
		confidentialityReaffirmed: 'yes',
		ndaSigned: 'yes',
		restrictiveCovenantsExplained: 'yes',
		restrictiveCovenantsAcknowledged: 'yes',
		intellectualPropertyAssigned: 'yes',
		dataReturnedOrDestroyed: 'yes',
		postEmploymentObligationsExplained: 'yes'
	};
	d.forwardingDetails = {
		...d.forwardingDetails,
		forwardingAddressLine1: '14 Elm Avenue',
		forwardingCity: 'Leeds',
		forwardingPostcode: 'LS1 4AB',
		forwardingCountry: 'United Kingdom',
		personalEmail: 'sarah.okafor@example.com',
		personalPhone: '07700 900123',
		forwardingDetailsConfirmed: 'yes'
	};
	d.signoff = {
		...d.signoff,
		hrSignedOff: 'yes',
		hrSignOffName: 'P. Adeyemi',
		hrSignOffDate: '2026-07-15',
		lineManagerSignedOff: 'yes',
		lineManagerSignOffName: 'J. Hughes',
		lineManagerSignOffDate: '2026-07-15',
		itSignedOff: 'yes',
		itSignOffName: 'R. Singh',
		itSignOffDate: '2026-07-15',
		employeeAcknowledged: 'yes',
		employeeSignOffDate: '2026-07-15'
	};
	return d;
}

/** A partial checklist: all mandatory blockers cleared, some soft items pending. */
function partial(): AssessmentData {
	const d = complete();
	d.employeeDetails = {
		...d.employeeDetails,
		firstName: 'Tomasz',
		lastName: 'Nowak',
		employeeId: 'EMP-3390',
		jobTitle: 'Radiographer',
		department: 'Radiology',
		lineManager: 'M. Clarke',
		startDate: '2020-09-01',
		lastWorkingDay: '2026-07-20',
		reasonForLeaving: 'end-of-fixed-term'
	};
	// Non-blocking items left outstanding.
	d.exitInterview.interviewCompleted = 'no';
	d.exitInterview.feedbackDocumented = 'no';
	d.knowledgeTransfer.workInProgressDocumented = 'no';
	d.finalPayrollBenefits.payrollDetailsConfirmed = 'no';
	d.referencesRecommendations.referencePolicyExplained = 'no';
	d.forwardingDetails.forwardingDetailsConfirmed = 'no';
	d.signoff.employeeAcknowledged = 'no';
	return d;
}

/** An incomplete checklist: IT access not fully revoked, equipment outstanding. */
function incompleteAccess(): AssessmentData {
	const d = complete();
	d.employeeDetails = {
		...d.employeeDetails,
		firstName: 'Grace',
		lastName: 'Mwangi',
		employeeId: 'EMP-5102',
		jobTitle: 'IT Systems Analyst',
		department: 'Information Technology',
		lineManager: 'R. Singh',
		startDate: '2017-01-16',
		lastWorkingDay: '2026-07-05',
		reasonForLeaving: 'dismissal'
	};
	d.equipmentReturn.laptopReturned = 'no';
	d.equipmentReturn.mobilePhoneReturned = 'no';
	d.accessRevocation.vpnRevoked = 'no';
	d.accessRevocation.activeDirectoryDisabled = 'no';
	d.accessRevocation.cloudAppsRevoked = 'no';
	d.accessRevocation.dataDownloadAuditPerformed = 'no';
	d.accessRevocation.unauthorisedDownloadDetected = 'yes';
	d.signoff.itSignedOff = 'no';
	return d;
}

/** An incomplete checklist: NDA / sign-off blockers and payroll outstanding. */
function incompleteSignoff(): AssessmentData {
	const d = complete();
	d.employeeDetails = {
		...d.employeeDetails,
		firstName: 'Daniel',
		lastName: 'Reyes',
		employeeId: 'EMP-2768',
		jobTitle: 'Consultant Physician',
		department: 'General Medicine',
		lineManager: 'A. Patel',
		startDate: '2012-06-11',
		lastWorkingDay: '2026-08-01',
		reasonForLeaving: 'retirement'
	};
	d.nonDisclosurePostEmployment.confidentialityReaffirmed = 'no';
	d.nonDisclosurePostEmployment.dataReturnedOrDestroyed = 'no';
	d.finalPayrollBenefits.finalSalaryCalculated = 'no';
	d.finalPayrollBenefits.accruedHolidayPaid = 'no';
	d.finalPayrollBenefits.p45Issued = 'no';
	d.signoff.hrSignedOff = 'no';
	d.signoff.lineManagerSignedOff = 'no';
	d.signoff.employeeAcknowledged = 'no';
	return d;
}

/** The sample checklists, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'EOC-2026-0001', employeeName: 'Okafor, Sarah', assessedDate: '2026-07-15', data: complete() },
	{ id: 'EOC-2026-0002', employeeName: 'Nowak, Tomasz', assessedDate: '2026-07-18', data: partial() },
	{ id: 'EOC-2026-0003', employeeName: 'Mwangi, Grace', assessedDate: '2026-07-04', data: incompleteAccess() },
	{ id: 'EOC-2026-0004', employeeName: 'Reyes, Daniel', assessedDate: '2026-07-22', data: incompleteSignoff() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = validateChecklist(s.data);
	return {
		id: s.id,
		employeeName: s.employeeName,
		department: s.data.employeeDetails.department,
		lastWorkingDay: s.data.employeeDetails.lastWorkingDay,
		outcome: g.outcome,
		completionPercent: g.completionPercent,
		blockerCount: g.blockers.length,
		flagCount: g.additionalFlags.length
	};
});
