import type { AssessmentData, RulePriority } from '$lib/engine/types';
import { validateM1, countConditions } from '$lib/engine/m1-validator';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample M1 submission: an identifier and the full data the engine validates. */
export interface SampleAssessment {
	id: string;
	applicantName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	applicantName: string;
	assessedDate: string;
	hasDiagnosis: string;
	conditionCount: number;
	highestPriority: RulePriority | 'none';
	flagCount: number;
	complete: boolean;
}

/** Q1 = No: applicant reports no mental health diagnosis; form stops at Q1. */
function noDiagnosis(): AssessmentData {
	const d = createDefaultAssessment();
	d.personalDetails = {
		...d.personalDetails,
		title: 'Mr',
		fullName: 'Robert Wilson',
		dateOfBirth: '1982-11-18',
		address: '12 Oak Lane\nCardiff',
		postcode: 'CF10 1AA',
		email: 'robert.wilson@example.com',
		contactNumber: '07700 900111'
	};
	d.diagnosisConfirmation.hasMentalHealthDiagnosis = 'no';
	d.authorisation = {
		...d.authorisation,
		declarationConfirmed: 'yes',
		signatoryName: 'Robert Wilson',
		signatureDate: '2026-04-22',
		electronicCorrespondenceConsent: 'yes',
		dvlaContactPreference: 'email'
	};
	return d;
}

/** Low-priority: single mild anxiety/depression, recent contact, complete. */
function mildAnxiety(): AssessmentData {
	const d = createDefaultAssessment();
	d.personalDetails = {
		...d.personalDetails,
		title: 'Ms',
		fullName: 'Jane Smith',
		dateOfBirth: '1985-04-12',
		address: '10 Example Road\nLondon',
		postcode: 'SW1A 1AA',
		email: 'jane.smith@example.com',
		contactNumber: '07700 900000'
	};
	d.healthcareProfessionals.gp = {
		...d.healthcareProfessionals.gp,
		gpName: 'Dr Patel',
		surgeryName: 'Riverside Surgery',
		dateLastSeen: '2026-01-15'
	};
	d.diagnosisConfirmation.hasMentalHealthDiagnosis = 'yes';
	d.mentalHealthConditions.anxietyDepressionWithoutImpairment = 'yes';
	d.recentContact = {
		...d.recentContact,
		hadRecentContact: 'yes',
		doctorLastDate: '2026-01-15'
	};
	d.authorisation = {
		...d.authorisation,
		declarationConfirmed: 'yes',
		signatoryName: 'Jane Smith',
		signatureDate: '2026-04-15',
		electronicCorrespondenceConsent: 'yes',
		dvlaContactPreference: 'email'
	};
	return d;
}

/** High-priority: bipolar + personality disorder, multiple flags. */
function bipolarComorbid(): AssessmentData {
	const d = createDefaultAssessment();
	d.personalDetails = {
		...d.personalDetails,
		title: 'Mr',
		fullName: 'George Clark',
		dateOfBirth: '1969-10-31',
		address: '5 High Street\nManchester',
		postcode: 'M1 2AB',
		email: 'george.clark@example.com',
		contactNumber: '07700 900222'
	};
	d.healthcareProfessionals.gp = {
		...d.healthcareProfessionals.gp,
		gpName: 'Dr Owen',
		surgeryName: 'City Medical Centre',
		dateLastSeen: '2025-12-02'
	};
	d.healthcareProfessionals.consultant = {
		...d.healthcareProfessionals.consultant,
		consultantName: 'Dr Hughes',
		speciality: 'Psychiatry',
		hospitalName: 'Manchester Royal',
		dateLastSeen: '2025-11-20'
	};
	d.diagnosisConfirmation.hasMentalHealthDiagnosis = 'yes';
	d.mentalHealthConditions.bipolarAffectiveDisorder = 'yes';
	d.mentalHealthConditions.personalityDisorder = 'yes';
	d.mentalHealthConditions.ocdOrPtsd = 'yes';
	d.recentContact = {
		...d.recentContact,
		hadRecentContact: 'yes',
		consultantLastDate: '2025-11-20',
		doctorLastDate: '2025-12-02'
	};
	d.authorisation = {
		...d.authorisation,
		declarationConfirmed: 'yes',
		signatoryName: 'George Clark',
		signatureDate: '2026-04-26',
		electronicCorrespondenceConsent: 'no',
		dvlaContactPreference: 'sms'
	};
	return d;
}

/** Urgent: anxiety/depression with suicidal-thoughts variant + psychosis. */
function urgentCrisis(): AssessmentData {
	const d = createDefaultAssessment();
	d.personalDetails = {
		...d.personalDetails,
		title: 'Mrs',
		fullName: 'Sarah Brown',
		dateOfBirth: '1979-12-15',
		address: '7 Park Avenue\nLeeds',
		postcode: 'LS1 3CD',
		email: 'sarah.brown@example.com',
		contactNumber: '07700 900333'
	};
	d.healthcareProfessionals.gp = {
		...d.healthcareProfessionals.gp,
		gpName: 'Dr Ahmed',
		surgeryName: 'Park View Practice',
		dateLastSeen: '2026-03-01'
	};
	d.diagnosisConfirmation.hasMentalHealthDiagnosis = 'yes';
	d.mentalHealthConditions.anxietyDepressionWithImpairment = 'yes';
	d.mentalHealthConditions.schizophreniaOrPsychosis = 'yes';
	d.recentContact = {
		...d.recentContact,
		hadRecentContact: 'no'
	};
	// Declaration intentionally not confirmed → incomplete, declaration flag.
	d.authorisation = {
		...d.authorisation,
		declarationConfirmed: '',
		signatoryName: 'Sarah Brown',
		signatureDate: ''
	};
	return d;
}

/** The sample submissions, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'M1-2026-0001', applicantName: 'Smith, Jane', assessedDate: '2026-04-15', data: mildAnxiety() },
	{ id: 'M1-2026-0002', applicantName: 'Wilson, Robert', assessedDate: '2026-04-22', data: noDiagnosis() },
	{ id: 'M1-2026-0003', applicantName: 'Clark, George', assessedDate: '2026-04-26', data: bipolarComorbid() },
	{ id: 'M1-2026-0004', applicantName: 'Brown, Sarah', assessedDate: '2026-04-19', data: urgentCrisis() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const r = validateM1(s.data);
	const highestPriority: RulePriority | 'none' =
		r.additionalFlags.length > 0 ? r.additionalFlags[0].priority : 'none';
	return {
		id: s.id,
		applicantName: s.applicantName,
		assessedDate: s.assessedDate,
		hasDiagnosis: s.data.diagnosisConfirmation.hasMentalHealthDiagnosis || '',
		conditionCount: countConditions(s.data),
		highestPriority,
		flagCount: r.additionalFlags.length,
		complete: r.complete
	};
});
