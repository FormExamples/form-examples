import type { AssessmentData, CompletenessLevel } from '$lib/engine/types';
import { gradeDischarge } from '$lib/engine/discharge-validator';
import { destinationLabel, followUpLabel } from '$lib/engine/utils';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample discharge summary: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	dischargeDate: string;
	completenessLevel: CompletenessLevel;
	mandatoryMissing: number;
	destination: string;
	followUp: string;
	reconciliationFlag: boolean;
	flagCount: number;
}

/** A fully-complete discharge summary: every NICE NG27 rule satisfied. */
function complete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDetails = {
		...d.patientDetails,
		firstName: 'Jane',
		lastName: 'Smith',
		dateOfBirth: '1950-04-12',
		sex: 'female',
		nhsNumber: '943 476 5919',
		address: '1 High Street, Anytown',
		postcode: 'AB1 2CD',
		phone: '01234 567890',
		gpName: 'Dr Patel',
		gpPractice: 'Riverside Surgery',
		nextOfKinName: 'John Smith',
		nextOfKinPhone: '07700 900000'
	};
	d.admissionSummary = {
		...d.admissionSummary,
		admissionDate: '2026-06-01',
		dischargeDate: '2026-06-05',
		ward: 'Ward 7',
		consultant: 'Dr Okoro',
		specialty: 'General medicine',
		reasonForAdmission: 'Community-acquired pneumonia',
		clinicalNarrative: 'Treated with IV antibiotics with good clinical response.'
	};
	d.diagnoses.diagnoses = [
		{ description: 'Community-acquired pneumonia', icd10: 'J18.9', type: 'primary' }
	];
	d.proceduresPerformed.noProceduresPerformed = 'yes';
	d.dischargeMedications = {
		...d.dischargeMedications,
		medications: [
			{
				name: 'Amoxicillin',
				dose: '500 mg',
				route: 'PO',
				frequency: 'TDS',
				duration: '5 days',
				status: 'new',
				indication: 'Pneumonia'
			}
		],
		reconciliationCompleted: 'yes',
		allergiesReviewed: 'yes',
		allergyNotes: 'NKDA'
	};
	d.followupArrangements = {
		...d.followupArrangements,
		appointments: [
			{ provider: 'Respiratory clinic', date: '2026-07-01', location: 'Outpatients', purpose: 'Review CXR' }
		],
		gpFollowupRequired: 'yes',
		gpFollowupTimeframe: 'Within 7 days',
		outpatientFollowupRequired: 'yes'
	};
	d.communityCareInstructions = {
		...d.communityCareInstructions,
		dischargeDestination: 'home',
		careResponsibility: 'self',
		transportMode: 'walking'
	};
	d.warningSigns = {
		...d.warningSigns,
		redFlagSymptoms: ['Worsening breathlessness', 'New fever'],
		whenToSeekHelp: 'If breathing worsens or fever returns, call 111.',
		emergencyContactNumber: '111',
		safetyNetingProvided: 'yes',
		writtenInfoGiven: 'yes'
	};
	d.clinicianSignoff = {
		...d.clinicianSignoff,
		clinicianName: 'Dr Okoro',
		clinicianRole: 'Consultant',
		gmcNumber: '1234567',
		signoffDate: '2026-06-05',
		responsibleConsultantInformed: 'yes'
	};
	d.patientAcknowledgement = {
		...d.patientAcknowledgement,
		patientUnderstandsPlan: 'yes',
		medicationsExplained: 'yes',
		writtenSummaryProvided: 'yes',
		questionsAnswered: 'yes',
		acknowledgementDate: '2026-06-05',
		signedBy: 'Jane Smith'
	};
	return d;
}

/** A partial summary: all mandatory rules met, some optional fields missing. */
function partial(): AssessmentData {
	const d = complete();
	d.patientDetails = {
		...d.patientDetails,
		firstName: 'Priya',
		lastName: 'Patel',
		dateOfBirth: '1959-09-30',
		sex: 'female',
		nhsNumber: '721 938 4102',
		address: '',
		postcode: '',
		nextOfKinName: '',
		nextOfKinPhone: ''
	};
	d.admissionSummary = {
		...d.admissionSummary,
		admissionDate: '2026-06-04',
		dischargeDate: '2026-06-10',
		clinicalNarrative: '',
		reasonForAdmission: 'Decompensated heart failure'
	};
	d.diagnoses.diagnoses = [{ description: 'Congestive cardiac failure', icd10: '', type: 'primary' }];
	d.warningSigns = { ...d.warningSigns, writtenInfoGiven: 'no' };
	d.patientAcknowledgement = {
		...d.patientAcknowledgement,
		writtenSummaryProvided: 'no',
		questionsAnswered: 'no',
		signedBy: 'Priya Patel'
	};
	return d;
}

/** An incomplete summary: several mandatory fields outstanding. */
function incomplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDetails = {
		...d.patientDetails,
		firstName: 'Margaret',
		lastName: 'Jones',
		dateOfBirth: '1948-01-22',
		sex: 'female',
		nhsNumber: '384 615 7230',
		gpName: 'Dr Reed',
		gpPractice: 'Hilltop Practice'
	};
	d.admissionSummary = {
		...d.admissionSummary,
		admissionDate: '2026-06-02',
		dischargeDate: '2026-06-09',
		consultant: 'Dr Hassan',
		reasonForAdmission: 'Fall with fractured neck of femur'
	};
	d.diagnoses.diagnoses = [{ description: 'Fractured neck of femur', icd10: 'S72.0', type: 'primary' }];
	d.proceduresPerformed.procedures = [
		{ description: 'Hemiarthroplasty', opcs4: 'W37.1', date: '2026-06-03', performedBy: 'Mr Singh' }
	];
	// Reconciliation NOT completed -> incomplete + urgent flag
	d.dischargeMedications = {
		...d.dischargeMedications,
		medications: [
			{ name: 'Apixaban', dose: '2.5 mg', route: 'PO', frequency: 'BD', duration: 'ongoing', status: 'new', indication: 'VTE prophylaxis' }
		],
		reconciliationCompleted: 'no',
		allergiesReviewed: 'no'
	};
	d.communityCareInstructions = {
		...d.communityCareInstructions,
		dischargeDestination: 'care-home',
		careResponsibility: 'care-home-staff',
		districtNurseReferral: 'yes',
		physiotherapyReferral: 'yes'
	};
	d.warningSigns = { ...d.warningSigns, whenToSeekHelp: '', safetyNetingProvided: 'no' };
	d.followupArrangements = {
		...d.followupArrangements,
		gpFollowupRequired: 'no',
		outpatientFollowupRequired: 'no'
	};
	return d;
}

/** A severely incomplete summary: a near-empty draft. */
function severelyIncomplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDetails = {
		...d.patientDetails,
		firstName: 'David',
		lastName: 'Brown',
		dateOfBirth: '1972-03-18',
		nhsNumber: '167 293 8451'
	};
	d.admissionSummary = {
		...d.admissionSummary,
		admissionDate: '2026-06-06',
		reasonForAdmission: 'Chest pain — investigation'
	};
	d.communityCareInstructions = {
		...d.communityCareInstructions,
		dischargeDestination: 'other-hospital'
	};
	return d;
}

/** The sample discharge summaries, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'HD-2026-0001', patientName: 'Smith, Jane', assessedDate: '2026-06-05', data: complete() },
	{ id: 'HD-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-10', data: partial() },
	{ id: 'HD-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-09', data: incomplete() },
	{ id: 'HD-2026-0004', patientName: 'Brown, David', assessedDate: '2026-06-06', data: severelyIncomplete() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeDischarge(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		dischargeDate: s.data.admissionSummary.dischargeDate || s.assessedDate,
		completenessLevel: g.completenessLevel,
		mandatoryMissing: g.mandatoryTotal - g.mandatorySatisfied,
		destination: destinationLabel(s.data.communityCareInstructions.dischargeDestination),
		followUp: followUpLabel(s.data),
		reconciliationFlag: s.data.dischargeMedications.reconciliationCompleted !== 'yes',
		flagCount: g.additionalFlags.length
	};
});
