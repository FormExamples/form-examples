import type { AssessmentData, CompletionStatus, RiskLevel } from '#lib/engine/types.js';
import { calculateOnboardingGrade } from '#lib/engine/onboarding-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample checklist: an identifier and the full data the engine grades. */
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
	jobTitle: string;
	assessedDate: string;
	completionPercentage: number;
	completionStatus: CompletionStatus;
	riskLevel: RiskLevel;
	dbsCleared: boolean;
	flagCount: number;
}

/** A fully onboarded employee: complete, low risk. */
function complete(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Jane',
		lastName: 'Smith',
		dateOfBirth: '1990-03-15',
		email: 'jane.smith@nhs.net',
		phone: '07700 900123',
		jobTitle: 'Staff Nurse',
		department: 'Cardiology Ward',
		startDate: '2026-05-01',
		emergencyContactName: 'John Smith',
		emergencyContactPhone: '07700 900456',
		emergencyContactRelationship: 'Spouse'
	};
	d.preEmploymentChecks = {
		...d.preEmploymentChecks,
		dbsCheckStatus: 'cleared',
		dbsCertificateNumber: 'DBS-001234567',
		dbsCheckDate: '2026-03-01',
		dbsUpdateServiceRegistered: 'yes',
		rightToWorkVerified: 'yes',
		rightToWorkDocumentType: 'British Passport',
		referencesReceived: 2,
		referencesRequired: 2,
		referencesSatisfactory: 'yes',
		identityVerified: 'yes'
	};
	d.occupationalHealth = {
		...d.occupationalHealth,
		ohQuestionnaireSubmitted: 'yes',
		ohClearanceReceived: 'yes',
		ohClearanceDate: '2026-03-15',
		ohRestrictions: 'no',
		hepatitisBStatus: 'immune',
		tbScreeningStatus: 'not-required',
		immunisationStatus: 'complete',
		fitToWork: 'yes'
	};
	d.mandatoryTraining = {
		...d.mandatoryTraining,
		fireSafetyCompleted: 'yes',
		manualHandlingCompleted: 'yes',
		infectionControlCompleted: 'yes',
		safeguardingAdultsCompleted: 'yes',
		safeguardingAdultsLevel: 'level-2',
		safeguardingChildrenCompleted: 'yes',
		safeguardingChildrenLevel: 'level-2',
		informationGovernanceCompleted: 'yes',
		basicLifeSupportCompleted: 'yes',
		equalityDiversityCompleted: 'yes',
		healthSafetyCompleted: 'yes',
		conflictResolutionCompleted: 'yes'
	};
	d.professionalRegistration = {
		...d.professionalRegistration,
		registrationRequired: 'yes',
		regulatoryBody: 'nmc',
		registrationNumber: '12A3456B',
		registrationVerified: 'yes',
		registrationExpiryDate: '2027-03-31',
		registrationConditions: 'no',
		indemnityInsurance: 'yes'
	};
	d.itSystemsAccess = {
		...d.itSystemsAccess,
		nhsSmartcardIssued: 'yes',
		emailAccountCreated: 'yes',
		networkLoginCreated: 'yes',
		clinicalSystemAccess: 'yes',
		clinicalSystemName: 'EMIS Web',
		clinicalSystemTrainingCompleted: 'yes',
		rosteringSystemAccess: 'yes'
	};
	d.uniformIDBadge = {
		...d.uniformIDBadge,
		uniformRequired: 'yes',
		uniformOrdered: 'yes',
		uniformReceived: 'yes',
		idBadgePhotoTaken: 'yes',
		idBadgeIssued: 'yes',
		accessCardIssued: 'yes',
		lockerAllocated: 'yes'
	};
	d.inductionProgramme = {
		...d.inductionProgramme,
		corporateInductionCompleted: 'yes',
		localInductionCompleted: 'yes',
		departmentTourCompleted: 'yes',
		introducedToTeam: 'yes',
		emergencyProceduresBriefed: 'yes',
		policiesHandbookReceived: 'yes',
		buddyAssigned: 'yes',
		buddyName: 'Sarah Jones'
	};
	d.probationSupervision = {
		...d.probationSupervision,
		probationPeriodMonths: 6,
		lineManagerName: 'Dr Claire Wilson',
		supervisionFrequency: 'monthly',
		objectivesSet: 'yes',
		appraisalDateAgreed: 'yes'
	};
	d.signOffCompliance = {
		...d.signOffCompliance,
		confidentialityAgreementSigned: 'yes',
		codeOfConductSigned: 'yes',
		socialMediaPolicyAcknowledged: 'yes',
		itAcceptableUseSigned: 'yes',
		gdprTrainingCompleted: 'yes',
		dutyOfCandourBriefed: 'yes',
		whistleblowingPolicyBriefed: 'yes',
		employeeSignedOff: 'yes',
		managerSignedOff: 'yes',
		managerSignOffName: 'Dr Claire Wilson'
	};
	return d;
}

/** Mostly complete: a couple of training items and induction outstanding. */
function mostlyComplete(): AssessmentData {
	const d = complete();
	d.demographics = {
		...d.demographics,
		firstName: 'Tomasz',
		lastName: 'Kowalski',
		dateOfBirth: '1985-07-22',
		email: 'tomasz.kowalski@nhs.net',
		jobTitle: 'Physiotherapist',
		department: 'Rehabilitation',
		startDate: '2026-06-01'
	};
	d.professionalRegistration = {
		...d.professionalRegistration,
		regulatoryBody: 'hcpc',
		registrationNumber: 'PH123456'
	};
	d.mandatoryTraining.basicLifeSupportCompleted = 'no';
	d.mandatoryTraining.conflictResolutionCompleted = 'no';
	d.inductionProgramme.localInductionCompleted = 'no';
	d.uniformIDBadge.accessCardIssued = 'no';
	return d;
}

/** In-progress: many checks outstanding, OH clearance not yet received. */
function inProgress(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Aisha',
		lastName: 'Khan',
		dateOfBirth: '1996-11-04',
		email: 'aisha.khan@nhs.net',
		jobTitle: 'Healthcare Assistant',
		department: 'Emergency Department',
		startDate: '2026-07-15'
	};
	d.preEmploymentChecks = {
		...d.preEmploymentChecks,
		dbsCheckStatus: 'applied',
		rightToWorkVerified: 'yes',
		rightToWorkDocumentType: 'Share code',
		referencesReceived: 1,
		referencesRequired: 2,
		referencesSatisfactory: 'no',
		identityVerified: 'yes'
	};
	d.occupationalHealth = {
		...d.occupationalHealth,
		ohQuestionnaireSubmitted: 'yes',
		ohClearanceReceived: 'no',
		ohRestrictions: 'no',
		immunisationStatus: 'in-progress',
		fitToWork: 'yes'
	};
	d.mandatoryTraining = {
		...d.mandatoryTraining,
		fireSafetyCompleted: 'yes',
		manualHandlingCompleted: 'no',
		infectionControlCompleted: 'yes',
		safeguardingAdultsCompleted: 'no',
		safeguardingChildrenCompleted: 'no',
		informationGovernanceCompleted: 'no',
		basicLifeSupportCompleted: 'no',
		equalityDiversityCompleted: 'yes',
		healthSafetyCompleted: 'no'
	};
	d.professionalRegistration.registrationRequired = 'no';
	d.itSystemsAccess = {
		...d.itSystemsAccess,
		emailAccountCreated: 'yes',
		networkLoginCreated: 'no',
		clinicalSystemAccess: 'no'
	};
	d.uniformIDBadge = {
		...d.uniformIDBadge,
		uniformRequired: 'yes',
		uniformOrdered: 'yes',
		idBadgeIssued: 'no',
		accessCardIssued: 'no'
	};
	d.inductionProgramme.corporateInductionCompleted = 'no';
	d.inductionProgramme.localInductionCompleted = 'no';
	d.probationSupervision.objectivesSet = 'no';
	d.signOffCompliance.confidentialityAgreementSigned = 'no';
	d.signOffCompliance.gdprTrainingCompleted = 'no';
	d.signOffCompliance.managerSignedOff = 'no';
	return d;
}

/** Critical: DBS not started, right to work not verified, registration unverified. */
function critical(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'David',
		lastName: 'Owen',
		dateOfBirth: '1979-02-18',
		email: 'david.owen@nhs.net',
		jobTitle: 'Locum Doctor',
		department: 'Acute Medicine',
		startDate: '2026-07-28'
	};
	d.preEmploymentChecks = {
		...d.preEmploymentChecks,
		dbsCheckStatus: 'not-started',
		rightToWorkVerified: 'no',
		referencesReceived: 0,
		referencesRequired: 2,
		referencesSatisfactory: 'no',
		identityVerified: 'no'
	};
	d.occupationalHealth = {
		...d.occupationalHealth,
		ohClearanceReceived: 'no',
		fitToWork: 'no',
		immunisationStatus: 'incomplete'
	};
	d.professionalRegistration = {
		...d.professionalRegistration,
		registrationRequired: 'yes',
		regulatoryBody: 'gmc',
		registrationVerified: 'no',
		registrationConditions: 'yes',
		registrationConditionDetails: 'Supervised practice required'
	};
	return d;
}

/** The sample checklists, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'EO-2026-0001', employeeName: 'Smith, Jane', assessedDate: '2026-06-10', data: complete() },
	{ id: 'EO-2026-0002', employeeName: 'Kowalski, Tomasz', assessedDate: '2026-06-12', data: mostlyComplete() },
	{ id: 'EO-2026-0003', employeeName: 'Khan, Aisha', assessedDate: '2026-06-15', data: inProgress() },
	{ id: 'EO-2026-0004', employeeName: 'Owen, David', assessedDate: '2026-06-18', data: critical() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateOnboardingGrade(s.data);
	return {
		id: s.id,
		employeeName: s.employeeName,
		jobTitle: s.data.demographics.jobTitle,
		assessedDate: s.assessedDate,
		completionPercentage: g.completionPercentage,
		completionStatus: g.completionStatus,
		riskLevel: g.overallRisk,
		dbsCleared: s.data.preEmploymentChecks.dbsCheckStatus === 'cleared',
		flagCount: g.additionalFlags.length
	};
});
