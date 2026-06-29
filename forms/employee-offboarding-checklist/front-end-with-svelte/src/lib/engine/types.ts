// ──────────────────────────────────────────────
// Core checklist data types
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type YesNoNa = 'yes' | 'no' | 'na' | '';
export type Outcome = 'complete' | 'partial' | 'incomplete';
export type Priority = 'high' | 'medium' | 'low';
export type ReasonForLeaving =
	| 'resignation'
	| 'retirement'
	| 'redundancy'
	| 'dismissal'
	| 'end-of-fixed-term'
	| 'transfer'
	| 'other'
	| '';

export interface EmployeeDetails {
	firstName: string;
	lastName: string;
	employeeId: string;
	email: string;
	jobTitle: string;
	department: string;
	lineManager: string;
	startDate: string;
	lastWorkingDay: string;
	reasonForLeaving: ReasonForLeaving;
	reasonForLeavingOther: string;
	employeeDetailsNotes: string;
}

export interface ExitInterview {
	interviewOffered: YesNo;
	interviewCompleted: YesNo;
	interviewDate: string;
	interviewerName: string;
	feedbackProvided: YesNo;
	feedbackDocumented: YesNo;
	concernsRaised: YesNo;
	concernsDetails: string;
	exitInterviewNotes: string;
}

export interface KnowledgeTransfer {
	successorIdentified: YesNo;
	successorName: string;
	handoverDocumentCreated: YesNo;
	handoverMeetingsHeld: YesNo;
	workInProgressDocumented: YesNo;
	keyContactsShared: YesNo;
	sopFilesTransferred: YesNo;
	clinicalCaseloadReassigned: YesNo;
	knowledgeTransferNotes: string;
}

export interface EquipmentReturn {
	laptopReturned: YesNoNa;
	laptopAssetTag: string;
	mobilePhoneReturned: YesNoNa;
	idBadgeReturned: YesNoNa;
	keysReturned: YesNoNa;
	uniformReturned: YesNoNa;
	parkingPassReturned: YesNoNa;
	otherEquipmentReturned: YesNoNa;
	otherEquipmentDescription: string;
	equipmentReturnNotes: string;
}

export interface AccessRevocation {
	emailRevoked: YesNo;
	ehrEprRevoked: YesNo;
	vpnRevoked: YesNo;
	activeDirectoryDisabled: YesNo;
	buildingAccessRevoked: YesNo;
	cloudAppsRevoked: YesNo;
	smartcardDeactivated: YesNo;
	dataDownloadAuditPerformed: YesNo;
	unauthorisedDownloadDetected: YesNo;
	accessRevocationNotes: string;
}

export interface FinalPayrollBenefits {
	finalSalaryCalculated: YesNo;
	accruedHolidayPaid: YesNo;
	expensesReimbursed: YesNo;
	pensionInformationProvided: YesNo;
	p45Issued: YesNo;
	benefitsTerminated: YesNo;
	payrollDetailsConfirmed: YesNo;
	finalPaymentDate: string;
	finalPayrollNotes: string;
}

export interface ReferencesRecommendations {
	referenceConsentGiven: YesNo;
	referenceContactDetailsRecorded: YesNo;
	recommendationLetterRequested: YesNo;
	recommendationLetterProvided: YesNo;
	referencePolicyExplained: YesNo;
	referencesNotes: string;
}

export interface NonDisclosurePostEmployment {
	confidentialityReaffirmed: YesNo;
	ndaSigned: YesNo;
	restrictiveCovenantsExplained: YesNo;
	restrictiveCovenantsAcknowledged: YesNo;
	intellectualPropertyAssigned: YesNo;
	dataReturnedOrDestroyed: YesNo;
	postEmploymentObligationsExplained: YesNo;
	ndaNotes: string;
}

export interface ForwardingDetails {
	forwardingAddressLine1: string;
	forwardingAddressLine2: string;
	forwardingCity: string;
	forwardingPostcode: string;
	forwardingCountry: string;
	personalEmail: string;
	personalPhone: string;
	forwardingDetailsConfirmed: YesNo;
	forwardingNotes: string;
}

export interface Signoff {
	hrSignedOff: YesNo;
	hrSignOffName: string;
	hrSignOffDate: string;
	lineManagerSignedOff: YesNo;
	lineManagerSignOffName: string;
	lineManagerSignOffDate: string;
	itSignedOff: YesNo;
	itSignOffName: string;
	itSignOffDate: string;
	employeeAcknowledged: YesNo;
	employeeSignOffDate: string;
	signoffNotes: string;
}

// ──────────────────────────────────────────────
// Full checklist data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	employeeDetails: EmployeeDetails;
	exitInterview: ExitInterview;
	knowledgeTransfer: KnowledgeTransfer;
	equipmentReturn: EquipmentReturn;
	accessRevocation: AccessRevocation;
	finalPayrollBenefits: FinalPayrollBenefits;
	referencesRecommendations: ReferencesRecommendations;
	nonDisclosurePostEmployment: NonDisclosurePostEmployment;
	forwardingDetails: ForwardingDetails;
	signoff: Signoff;
}

// ──────────────────────────────────────────────
// Validation / grading types
// ──────────────────────────────────────────────

export interface ValidationRule {
	id: string;
	category: string;
	description: string;
	mandatory: boolean;
	blocker: boolean;
	evaluate: (data: AssessmentData) => boolean;
}

export interface FiredRule {
	id: string;
	category: string;
	description: string;
	mandatory: boolean;
	blocker: boolean;
}

export interface Blocker {
	id: string;
	category: string;
	description: string;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: Priority;
}

/** Full result of running the offboarding completeness validation engine. */
export interface GradingResult {
	outcome: Outcome;
	completionPercent: number;
	blockers: Blocker[];
	firedRules: FiredRule[];
	additionalFlags: AdditionalFlag[];
	mandatoryTotal: number;
	mandatorySatisfied: number;
	timestamp: string;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
	section: keyof AssessmentData;
}
