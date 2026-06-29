import type { AssessmentData } from '$lib/engine/types';
import { gradeForm } from '$lib/engine/grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';
import { purposeOptions } from '$lib/engine/validation-rules';

/** A sample record: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	submittedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	nhsNumber: string;
	recipientOrg: string;
	purpose: string;
	submittedDate: string;
	completenessScore: number;
	completenessStatus: string;
	validationStatus: string;
	consentConfirmed: boolean;
	flagCount: number;
}

function purposeLabel(value: string): string {
	return purposeOptions.find((o) => o.value === value)?.label ?? value;
}

/** Fully complete, consent confirmed — a clean release authorization. */
function complete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = {
		...d.patientInformation,
		firstName: 'John',
		lastName: 'Smith',
		dateOfBirth: '1968-04-12',
		sex: 'male',
		address: '12 Elm Street, London, E1 6AN',
		phone: '020 7946 0958',
		email: 'john.smith@example.com',
		nhsNumber: '943 476 5919',
		gpName: 'Dr Sarah Thompson',
		gpPractice: 'Elm Street Surgery'
	};
	d.authorizedRecipient = {
		...d.authorizedRecipient,
		recipientName: 'Dr Alan Reed',
		recipientOrganization: 'Royal London Hospital',
		recipientAddress: 'Whitechapel Road, London, E1 1FR',
		recipientPhone: '020 7377 7000',
		recipientEmail: 'records@royallondon.nhs.uk',
		recipientRole: 'Consultant Cardiologist'
	};
	d.recordsToRelease = {
		...d.recordsToRelease,
		recordTypes: ['lab-results', 'imaging', 'discharge-summaries'],
		specificDateRange: 'no'
	};
	d.purposeOfRelease = { ...d.purposeOfRelease, purpose: 'continuing-care' };
	d.authorizationPeriod = {
		...d.authorizationPeriod,
		startDate: '2026-06-01',
		endDate: '2026-12-01',
		singleUse: 'no'
	};
	d.restrictionsLimitations = {
		...d.restrictionsLimitations,
		excludeHIV: 'yes',
		excludeSubstanceAbuse: 'yes',
		excludeMentalHealth: 'yes',
		excludeGeneticInfo: 'yes',
		excludeSTI: 'yes'
	};
	d.patientRights = {
		acknowledgedRightToRevoke: 'yes',
		acknowledgedNoChargeForAccess: 'yes',
		acknowledgedDataProtection: 'yes'
	};
	d.signatureConsent = {
		...d.signatureConsent,
		patientSignatureConfirmed: 'yes',
		signatureDate: '2026-06-01'
	};
	return d;
}

/** Nearly complete: a couple of optional acknowledgements/recipient gaps remain. */
function nearlyComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = {
		...d.patientInformation,
		firstName: 'Priya',
		lastName: 'Patel',
		dateOfBirth: '1959-09-30',
		sex: 'female',
		address: '4 Maple Court, Reading, RG1 2AB',
		email: 'priya.patel@example.com',
		nhsNumber: '721 938 4102',
		gpName: 'Dr Mark Lewis',
		gpPractice: 'Maple Court Practice'
	};
	d.authorizedRecipient = {
		...d.authorizedRecipient,
		recipientName: 'Claims Department',
		recipientOrganization: 'Bupa Health Centre',
		recipientAddress: 'Bupa House, London, WC1B 5LY',
		recipientEmail: 'claims@bupa.com',
		recipientRole: 'Insurer'
	};
	d.recordsToRelease = {
		...d.recordsToRelease,
		recordTypes: ['complete-medical-record'],
		specificDateRange: 'yes',
		dateFrom: '2020-01-01',
		dateTo: '2026-01-01'
	};
	d.purposeOfRelease = { ...d.purposeOfRelease, purpose: 'insurance' };
	d.authorizationPeriod = {
		...d.authorizationPeriod,
		startDate: '2026-06-05',
		endDate: '2026-09-05',
		singleUse: 'yes'
	};
	d.restrictionsLimitations = {
		...d.restrictionsLimitations,
		excludeHIV: 'yes',
		excludeSubstanceAbuse: 'yes',
		excludeMentalHealth: 'yes',
		excludeGeneticInfo: 'yes',
		excludeSTI: 'yes'
	};
	d.patientRights = {
		acknowledgedRightToRevoke: 'yes',
		acknowledgedNoChargeForAccess: '',
		acknowledgedDataProtection: 'yes'
	};
	d.signatureConsent = {
		...d.signatureConsent,
		patientSignatureConfirmed: 'yes',
		signatureDate: '2026-06-05'
	};
	return d;
}

/** Partially complete: several required fields and consent still missing. */
function partiallyComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = {
		...d.patientInformation,
		firstName: 'Margaret',
		lastName: 'Jones',
		dateOfBirth: '1948-01-22',
		sex: 'female',
		nhsNumber: '384 615 7230'
	};
	d.authorizedRecipient = {
		...d.authorizedRecipient,
		recipientName: 'Dr Helen Carter',
		recipientOrganization: 'Kings College Hospital'
	};
	d.recordsToRelease = {
		...d.recordsToRelease,
		recordTypes: ['mental-health'],
		specificDateRange: 'no'
	};
	d.purposeOfRelease = { ...d.purposeOfRelease, purpose: 'second-opinion' };
	d.authorizationPeriod = {
		...d.authorizationPeriod,
		startDate: '2026-06-15'
	};
	d.restrictionsLimitations = {
		...d.restrictionsLimitations,
		excludeMentalHealth: 'no'
	};
	d.patientRights = {
		acknowledgedRightToRevoke: 'yes',
		acknowledgedNoChargeForAccess: '',
		acknowledgedDataProtection: ''
	};
	return d;
}

/** Incomplete: minimal data entered, no consent — should not be acted upon. */
function incomplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = {
		...d.patientInformation,
		firstName: 'David',
		lastName: 'Williams',
		dateOfBirth: '1955-11-03',
		sex: 'male'
	};
	d.recordsToRelease = {
		...d.recordsToRelease,
		recordTypes: ['complete-medical-record', 'mental-health'],
		specificDateRange: 'no'
	};
	d.purposeOfRelease = { ...d.purposeOfRelease, purpose: 'legal' };
	d.restrictionsLimitations = {
		...d.restrictionsLimitations,
		excludeHIV: 'no',
		excludeSTI: 'no'
	};
	return d;
}

/** The sample records, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'MR-2026-0001', patientName: 'Smith, John', submittedDate: '2026-06-01', data: complete() },
	{
		id: 'MR-2026-0002',
		patientName: 'Patel, Priya',
		submittedDate: '2026-06-05',
		data: nearlyComplete()
	},
	{
		id: 'MR-2026-0003',
		patientName: 'Jones, Margaret',
		submittedDate: '2026-06-15',
		data: partiallyComplete()
	},
	{
		id: 'MR-2026-0004',
		patientName: 'Williams, David',
		submittedDate: '2026-06-18',
		data: incomplete()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeForm(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		nhsNumber: s.data.patientInformation.nhsNumber || '—',
		recipientOrg: s.data.authorizedRecipient.recipientOrganization || '—',
		purpose: s.data.purposeOfRelease.purpose ? purposeLabel(s.data.purposeOfRelease.purpose) : '—',
		submittedDate: s.submittedDate,
		completenessScore: g.completenessScore,
		completenessStatus: g.completenessStatus,
		validationStatus: g.validationStatus,
		consentConfirmed: s.data.signatureConsent.patientSignatureConfirmed === 'yes',
		flagCount: g.additionalFlags.length
	};
});
