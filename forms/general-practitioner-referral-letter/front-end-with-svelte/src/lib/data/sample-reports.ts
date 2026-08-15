import type { AssessmentData, Status, Urgency } from '#lib/engine/types.js';
import { gradeReferral } from '#lib/engine/gp-referral-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample referral: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	updatedDate: string;
	data: AssessmentData;
}

/** A row in the referrals dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	updatedDate: string;
	status: Status;
	urgency: Urgency;
	completenessPercent: number;
	referralSpecialty: string;
	referrerName: string;
	flagCount: number;
}

/** Two-week-wait suspected cancer, fully populated → Complete. */
function twoWeekWaitComplete(): AssessmentData {
	const r = createDefaultAssessment();
	r.referrer = {
		referrerName: 'Dr Priya Nair',
		referrerRole: 'gp',
		referrerRegistrationNumber: '7654321',
		referringPractice: 'Elm Park Surgery',
		practiceAddress: '12 Elm Park Road, London',
		referrerContact: '020 7946 0100 / elmpark@nhs.net',
		referralDate: '2026-06-30'
	};
	r.patient = {
		patientIdentifier: '943 476 5919',
		patientName: 'James Okoro',
		patientDateOfBirth: '1958-03-12',
		patientSex: 'male',
		patientAddress: '4 Beech Close, London',
		patientContact: '07700 900123',
		accessNeeds: ''
	};
	r.destination = {
		referralSpecialty: 'Gastroenterology',
		namedClinician: 'Dr Osei, Lower GI team',
		receivingOrganisation: 'St Mary’s NHS Foundation Trust'
	};
	r.urgencyInfo = {
		urgency: 'two-week-wait',
		urgencyReason: 'Iron-deficiency anaemia with change in bowel habit in a patient aged over 60.',
		suspectedCancerCriterion: 'Iron-deficiency anaemia in a patient aged ≥ 60',
		suspectedCancerPathway: 'Lower gastrointestinal'
	};
	r.clinical = {
		reasonForReferral: 'Change in bowel habit and weight loss over three months.',
		relevantHistory: 'Type 2 diabetes; hypertension; ex-smoker.',
		presentingProblem: 'Looser stools and unintentional 4 kg weight loss.',
		symptomDuration: '3 months',
		redFlagSymptoms: 'Unintentional weight loss.'
	};
	r.examination = {
		examinationFindings: 'Pale; soft abdomen; no palpable mass.',
		investigationResults: 'FBC: Hb 98 g/L; ferritin 8 µg/L. FIT positive.'
	};
	r.medications = {
		currentMedications: 'Metformin 1 g BD; ramipril 5 mg OD.',
		allergies: 'Penicillin — rash.'
	};
	r.expectations = {
		patientExpectations: 'Wants to understand the cause of the symptoms.',
		consentToShare: 'yes',
		safetyNetting: 'Advised to attend A&E if significant rectal bleeding.'
	};
	r.review.clinicalNote = 'FIT and bloods attached.';
	return r;
}

/** Emergency referral with red-flag symptoms; several fields blank → Incomplete. */
function emergencyIncomplete(): AssessmentData {
	const r = createDefaultAssessment();
	r.referrer = {
		referrerName: 'Dr Sam Reilly',
		referrerRole: 'gp',
		referrerRegistrationNumber: '',
		referringPractice: 'Canal Street Practice',
		practiceAddress: '',
		referrerContact: '0161 496 0000',
		referralDate: '2026-06-29'
	};
	r.patient.patientIdentifier = '611 209 3344';
	r.patient.patientName = 'Aisha Bello';
	// patientDateOfBirth left blank → incomplete.
	r.patient.patientSex = 'female';
	r.destination.referralSpecialty = 'Acute medicine';
	r.urgencyInfo.urgency = 'emergency';
	r.clinical.reasonForReferral = 'Sudden severe chest pain radiating to the left arm.';
	r.clinical.relevantHistory = 'Hypertension.';
	r.clinical.redFlagSymptoms = 'Crushing chest pain; sweating; breathlessness.';
	// consentToShare / safetyNetting blank.
	return r;
}

/** Urgent (non-cancer) referral, consent given; some recommended gaps → Complete. */
function urgentComplete(): AssessmentData {
	const r = createDefaultAssessment();
	r.referrer = {
		referrerName: 'Nurse Ada Okafor',
		referrerRole: 'nurse-practitioner',
		referrerRegistrationNumber: '99A1234',
		referringPractice: 'Cardiff Bay Health Centre',
		practiceAddress: '3 Bayside, Cardiff',
		referrerContact: '029 2087 0000',
		referralDate: '2026-06-27'
	};
	r.patient = {
		patientIdentifier: '778 334 1090',
		patientName: 'Ffion Davies',
		patientDateOfBirth: '1979-07-19',
		patientSex: 'female',
		patientAddress: '21 Maple Grove, Cardiff',
		patientContact: 'ffion.d@example.com',
		accessNeeds: 'Welsh-language correspondence preferred.'
	};
	r.destination = {
		referralSpecialty: 'Rheumatology',
		namedClinician: '',
		receivingOrganisation: 'Cardiff and Vale University Health Board'
	};
	r.urgencyInfo = {
		urgency: 'urgent',
		urgencyReason: 'Rapidly worsening inflammatory joint symptoms with functional decline.',
		suspectedCancerCriterion: '',
		suspectedCancerPathway: ''
	};
	r.clinical = {
		reasonForReferral: 'Suspected new inflammatory arthritis.',
		relevantHistory: 'Psoriasis.',
		presentingProblem: 'Symmetrical small-joint swelling and early-morning stiffness.',
		symptomDuration: '6 weeks',
		redFlagSymptoms: ''
	};
	r.medications.currentMedications = 'Ibuprofen PRN.';
	r.expectations = {
		patientExpectations: 'Wants a diagnosis and a treatment plan.',
		consentToShare: 'yes',
		safetyNetting: 'Advised to seek urgent care if any joint becomes hot and acutely painful.'
	};
	return r;
}

/** Routine referral, consent not yet documented → Incomplete (thin). */
function routineIncomplete(): AssessmentData {
	const r = createDefaultAssessment();
	r.referrer = {
		referrerName: 'Dr Tom Byrne',
		referrerRole: 'gp-registrar',
		referrerRegistrationNumber: '',
		referringPractice: 'Riverside Medical Centre',
		practiceAddress: '',
		referrerContact: 'riverside@nhs.net',
		referralDate: '2026-06-24'
	};
	r.patient.patientIdentifier = '500 112 8899';
	r.patient.patientName = 'Connor Hughes';
	r.patient.patientDateOfBirth = '1990-02-04';
	r.patient.patientSex = 'male';
	r.destination.referralSpecialty = 'Dermatology';
	r.urgencyInfo.urgency = 'routine';
	r.clinical.reasonForReferral = 'Chronic plaque psoriasis not controlled with topical treatment.';
	// relevantHistory left blank → incomplete.
	r.medications.currentMedications = 'Topical calcipotriol.';
	// consentToShare / safetyNetting blank.
	return r;
}

/** The sample referrals, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'GPR-2026-0001', patientName: 'Okoro, James', updatedDate: '2026-06-30', data: twoWeekWaitComplete() },
	{ id: 'GPR-2026-0002', patientName: 'Bello, Aisha', updatedDate: '2026-06-29', data: emergencyIncomplete() },
	{ id: 'GPR-2026-0003', patientName: 'Davies, Ffion', updatedDate: '2026-06-27', data: urgentComplete() },
	{ id: 'GPR-2026-0004', patientName: 'Hughes, Connor', updatedDate: '2026-06-24', data: routineIncomplete() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeReferral(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.patient.patientIdentifier || '—',
		patientName: s.patientName,
		updatedDate: s.updatedDate,
		status: g.status,
		urgency: g.urgency,
		completenessPercent: g.completenessPercent,
		referralSpecialty: s.data.destination.referralSpecialty,
		referrerName: s.data.referrer.referrerName,
		flagCount: g.flaggedIssues.length
	};
});
