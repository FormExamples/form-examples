import type { AssessmentData, RiskLevel, UrgencyLevel } from '#lib/engine/types.js';
import { calculateRiskLevel } from '#lib/engine/intake-grader.js';
import { detectAdditionalFlags } from '#lib/engine/flagged-issues.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample intake: an identifier and the full data the engine grades. */
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
	submittedDate: string;
	riskLevel: RiskLevel;
	urgency: UrgencyLevel;
	allergyFlag: boolean;
	flagCount: number;
}

/** A low-risk intake: routine visit, healthy, minimal complexity. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.personalInformation = {
		...d.personalInformation,
		fullName: 'Smith, John',
		dateOfBirth: '1985-04-12',
		sex: 'male',
		phone: '07700 900000',
		email: 'john.smith@example.com',
		emergencyContactName: 'Jane Smith',
		emergencyContactPhone: '07700 900001',
		emergencyContactRelationship: 'Spouse'
	};
	d.insuranceAndId = { ...d.insuranceAndId, nhsNumber: '943 476 5919', gpName: 'Dr Adeyemi' };
	d.reasonForVisit = { ...d.reasonForVisit, primaryReason: 'Annual check-up', urgencyLevel: 'routine' };
	d.socialHistory = { ...d.socialHistory, smokingStatus: 'never', alcoholFrequency: 'occasional', drugUse: 'none', exerciseFrequency: 'regular', dietQuality: 'good' };
	d.consentAndPreferences = { ...d.consentAndPreferences, consentToTreatment: 'yes', privacyAcknowledgement: 'yes', communicationPreference: 'email', advanceDirectives: 'no' };
	return d;
}

/** A medium-risk intake: one or two chronic conditions, current smoker. */
function mediumRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.personalInformation = {
		...d.personalInformation,
		fullName: 'Patel, Priya',
		dateOfBirth: '1971-09-30',
		sex: 'female',
		phone: '07700 900100',
		email: 'priya.patel@example.com',
		emergencyContactName: 'Raj Patel',
		emergencyContactPhone: '07700 900101',
		emergencyContactRelationship: 'Spouse'
	};
	d.insuranceAndId = { ...d.insuranceAndId, nhsNumber: '721 938 4102', gpName: 'Dr Okafor' };
	d.reasonForVisit = { ...d.reasonForVisit, primaryReason: 'Persistent cough for 3 weeks', urgencyLevel: 'urgent' };
	d.medicalHistory = { ...d.medicalHistory, chronicConditions: ['hypertension', 'type-2-diabetes'] };
	d.allergies = [{ allergen: 'Penicillin', allergyType: 'drug', reaction: 'Rash', severity: 'mild' }];
	d.socialHistory = { ...d.socialHistory, smokingStatus: 'current', alcoholFrequency: 'moderate', drugUse: 'none', exerciseFrequency: 'occasional', dietQuality: 'average' };
	d.consentAndPreferences = { ...d.consentAndPreferences, consentToTreatment: 'yes', privacyAcknowledgement: 'yes', communicationPreference: 'phone', advanceDirectives: 'no' };
	return d;
}

/** A high-risk intake: multiple comorbidities, polypharmacy, anaphylaxis. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.personalInformation = {
		...d.personalInformation,
		fullName: 'Jones, Margaret',
		dateOfBirth: '1948-01-22',
		sex: 'female',
		phone: '07700 900200',
		email: 'margaret.jones@example.com',
		emergencyContactName: 'Susan Jones',
		emergencyContactPhone: '07700 900201',
		emergencyContactRelationship: 'Daughter'
	};
	d.insuranceAndId = { ...d.insuranceAndId, nhsNumber: '384 615 7230', gpName: 'Dr Wallace' };
	d.reasonForVisit = { ...d.reasonForVisit, primaryReason: 'Multiple chronic conditions review', urgencyLevel: 'urgent' };
	d.medicalHistory = { ...d.medicalHistory, chronicConditions: ['hypertension', 'heart-failure', 'chronic-kidney-disease', 'type-2-diabetes'], previousSurgeries: 'CABG 2019' };
	d.medications = [
		{ name: 'Metformin', dose: '500mg', frequency: 'BD', prescriber: 'Dr Wallace' },
		{ name: 'Ramipril', dose: '10mg', frequency: 'OD', prescriber: 'Dr Wallace' },
		{ name: 'Bisoprolol', dose: '5mg', frequency: 'OD', prescriber: 'Dr Wallace' },
		{ name: 'Furosemide', dose: '40mg', frequency: 'OD', prescriber: 'Dr Wallace' },
		{ name: 'Atorvastatin', dose: '40mg', frequency: 'ON', prescriber: 'Dr Wallace' }
	];
	d.allergies = [
		{ allergen: 'Penicillin', allergyType: 'drug', reaction: 'Anaphylaxis', severity: 'anaphylaxis' },
		{ allergen: 'Latex', allergyType: 'latex', reaction: 'Contact dermatitis', severity: 'moderate' }
	];
	d.familyHistory = { ...d.familyHistory, heartDisease: 'yes', heartDiseaseDetails: 'Father MI age 60', diabetes: 'yes', diabetesDetails: 'Mother type 2' };
	d.socialHistory = { ...d.socialHistory, smokingStatus: 'ex', alcoholFrequency: 'occasional', drugUse: 'none', exerciseFrequency: 'none', dietQuality: 'poor' };
	d.consentAndPreferences = { ...d.consentAndPreferences, consentToTreatment: 'yes', privacyAcknowledgement: 'yes', communicationPreference: 'post', advanceDirectives: 'yes', advanceDirectiveDetails: 'DNACPR on file' };
	return d;
}

/** A high-risk intake driven by an emergency visit and consent issues. */
function emergency(): AssessmentData {
	const d = createDefaultAssessment();
	d.personalInformation = {
		...d.personalInformation,
		fullName: 'Williams, David',
		dateOfBirth: '1955-11-03',
		sex: 'male',
		phone: '07700 900300',
		email: ''
	};
	d.insuranceAndId = { ...d.insuranceAndId, nhsNumber: '512 847 9063' };
	d.reasonForVisit = { ...d.reasonForVisit, primaryReason: 'Chest pain and shortness of breath', urgencyLevel: 'emergency' };
	d.medicalHistory = { ...d.medicalHistory, chronicConditions: ['hypertension'] };
	d.reviewOfSystems = { ...d.reviewOfSystems, cardiovascular: 'Central chest pain radiating to left arm, breathless at rest' };
	d.socialHistory = { ...d.socialHistory, smokingStatus: 'current', alcoholFrequency: 'heavy', drugUse: 'none', exerciseFrequency: 'none', dietQuality: 'poor' };
	d.consentAndPreferences = { ...d.consentAndPreferences, consentToTreatment: 'yes', privacyAcknowledgement: 'no', communicationPreference: 'phone', advanceDirectives: 'no' };
	return d;
}

/** The sample intakes, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'PI-2026-0001', patientName: 'Smith, John', submittedDate: '2026-06-10', data: lowRisk() },
	{ id: 'PI-2026-0002', patientName: 'Patel, Priya', submittedDate: '2026-06-12', data: mediumRisk() },
	{ id: 'PI-2026-0003', patientName: 'Jones, Margaret', submittedDate: '2026-06-15', data: highRisk() },
	{ id: 'PI-2026-0004', patientName: 'Williams, David', submittedDate: '2026-06-18', data: emergency() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { riskLevel } = calculateRiskLevel(s.data);
	const flags = detectAdditionalFlags(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		submittedDate: s.submittedDate,
		riskLevel,
		urgency: s.data.reasonForVisit.urgencyLevel,
		allergyFlag: s.data.allergies.length > 0,
		flagCount: flags.length
	};
});
