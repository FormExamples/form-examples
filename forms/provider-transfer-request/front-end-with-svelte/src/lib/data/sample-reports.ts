import type { AssessmentData, CompletenessLevel, TransferUrgency } from '#lib/engine/types.js';
import { validateTransfer } from '#lib/engine/transfer-validator.js';
import { detectFlaggedIssues } from '#lib/engine/flagged-issues.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample transfer: an identifier and the full data the engine grades. */
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
	assessedDate: string;
	completeness: CompletenessLevel;
	urgency: TransferUrgency;
	mandatory: string;
	stable: string;
	flagCount: number;
}

function provider(over: Partial<AssessmentData['requestingProvider']>) {
	return {
		clinicianName: '',
		clinicianRole: '',
		organisation: '',
		ward: '',
		phone: '',
		email: '',
		registrationBody: '',
		registrationNumber: '',
		...over
	};
}

/** Complete, routine, stable transfer: every applicable field supplied. */
function completeRoutine(): AssessmentData {
	const d = createDefaultAssessment();
	d.requestingProvider = provider({
		clinicianName: 'Dr Helen Carter',
		clinicianRole: 'Registrar',
		organisation: 'St Mary General Hospital',
		ward: 'AMU',
		phone: '0161 000 0001',
		email: 'h.carter@stmary.example.nhs.uk',
		registrationBody: 'GMC',
		registrationNumber: 'GMC 7001234'
	});
	d.receivingProvider = provider({
		clinicianName: 'Dr Omar Aziz',
		clinicianRole: 'Consultant Gastroenterologist',
		organisation: 'County Specialist Centre',
		ward: 'Gastro Ward 3',
		phone: '0161 000 0002'
	});
	d.patientDemographics = {
		...d.patientDemographics,
		firstName: 'Alan',
		lastName: 'Brookes',
		dateOfBirth: '1959-03-12',
		sex: 'male',
		nhsNumber: '485 777 3456',
		hospitalNumber: 'SMG-220184',
		nextOfKinName: 'Susan Brookes',
		nextOfKinPhone: '0770 000 0001'
	};
	d.situation = {
		reasonForTransfer: 'Specialist input required for acute pancreatitis with rising amylase.',
		primaryDiagnosis: 'Acute pancreatitis',
		urgency: 'routine',
		transferType: 'inter-hospital',
		requestedDateTime: '2026-07-02T09:00'
	};
	d.background = {
		presentingComplaint: 'Severe epigastric pain radiating to the back.',
		relevantHistory: '48h admission, amylase 1200, managed with IV fluids and analgesia.',
		pastMedicalHistory: 'Gallstones, hypertension.',
		currentMedications: 'Amlodipine 5mg OD, paracetamol PRN.',
		allergies: 'NKDA',
		recentInvestigations: 'CT abdomen, LFTs, amylase trend.',
		infectionStatus: 'MRSA negative on screening.'
	};
	d.assessment = {
		currentClinicalStatus: 'Comfortable on current analgesia, observations stable.',
		consciousLevel: 'awake',
		vitalSigns: {
			heartRate: 82,
			respiratoryRate: 16,
			systolicBloodPressure: 132,
			diastolicBloodPressure: 78,
			temperatureCelsius: 37.1,
			oxygenSaturation: 97,
			newsScore: 1
		},
		clinicallyStable: 'yes',
		stabilityNotes: ''
	};
	d.recommendation = {
		requestedAction: 'Accept for specialist pancreatitis management.',
		expectedOutcomes: 'Resolution of pancreatitis, dietary advice.',
		ongoingCarePlan: 'Continue IV fluids; gastro review on arrival.',
		pendingResults: 'Repeat amylase pending.'
	};
	d.transferLogistics = {
		...d.transferLogistics,
		transportMode: 'ambulance',
		departureDateTime: '2026-07-02T10:00',
		estimatedArrivalDateTime: '2026-07-02T10:45'
	};
	d.signoffAcknowledgement = {
		...d.signoffAcknowledgement,
		requestingProviderSignature: 'Helen Carter',
		requestingProviderSignatureDate: '2026-07-02',
		receivingProviderName: 'Omar Aziz',
		receivingProviderSignature: 'Omar Aziz',
		receivingProviderSignatureDate: '2026-07-02',
		acknowledgementReceived: true
	};
	return d;
}

/** Partial transfer: all mandatory fields supplied but several optional gaps. */
function partialUrgent(): AssessmentData {
	const d = createDefaultAssessment();
	d.requestingProvider = provider({
		clinicianName: 'Nurse Priya Shah',
		clinicianRole: 'Charge Nurse',
		organisation: 'Riverside Community Hospital',
		phone: '0151 000 0010'
	});
	d.receivingProvider = provider({
		clinicianName: 'Dr Laura Webb',
		clinicianRole: 'Acute Physician',
		organisation: 'Metro Acute Trust',
		phone: '0151 000 0020'
	});
	d.patientDemographics = {
		...d.patientDemographics,
		firstName: 'Margaret',
		lastName: 'Ellison',
		dateOfBirth: '1944-11-02',
		sex: 'female',
		hospitalNumber: 'RCH-99812'
	};
	d.situation = {
		reasonForTransfer: 'Acute kidney injury requiring acute medical review.',
		primaryDiagnosis: 'AKI stage 2',
		urgency: 'urgent',
		transferType: 'inter-organisation',
		requestedDateTime: ''
	};
	d.background = {
		presentingComplaint: 'Reduced urine output and confusion.',
		relevantHistory: 'Dehydration on a background of diuretic use.',
		pastMedicalHistory: '',
		currentMedications: 'Furosemide 40mg OD (held).',
		allergies: 'NKDA',
		recentInvestigations: '',
		infectionStatus: 'None known.'
	};
	d.assessment = {
		currentClinicalStatus: 'Mildly confused, otherwise stable.',
		consciousLevel: 'awake',
		vitalSigns: {
			heartRate: 96,
			respiratoryRate: 18,
			systolicBloodPressure: 108,
			diastolicBloodPressure: 64,
			temperatureCelsius: 36.6,
			oxygenSaturation: 95,
			newsScore: 3
		},
		clinicallyStable: 'yes',
		stabilityNotes: ''
	};
	d.recommendation = {
		requestedAction: 'Accept for AKI work-up and fluid management.',
		expectedOutcomes: '',
		ongoingCarePlan: 'IV fluids, monitor renal function and urine output.',
		pendingResults: ''
	};
	d.transferLogistics = {
		...d.transferLogistics,
		transportMode: 'stretcher',
		departureDateTime: '2026-07-03T13:30',
		estimatedArrivalDateTime: '',
		fallsRisk: true
	};
	d.signoffAcknowledgement = {
		...d.signoffAcknowledgement,
		requestingProviderSignature: 'Priya Shah',
		requestingProviderSignatureDate: '2026-07-03'
	};
	return d;
}

/** Incomplete transfer: mandatory fields missing; unstable, emergent patient. */
function incompleteEmergent(): AssessmentData {
	const d = createDefaultAssessment();
	d.requestingProvider = provider({
		clinicianName: 'Dr Tom Reilly',
		clinicianRole: 'ED Registrar',
		organisation: 'Northgate District Hospital',
		phone: '0191 000 0030'
	});
	d.receivingProvider = provider({
		clinicianName: 'Dr Sara Nawaz',
		clinicianRole: 'ICU Consultant',
		organisation: 'Regional Critical Care Unit',
		phone: ''
	});
	d.patientDemographics = {
		...d.patientDemographics,
		firstName: 'Daniel',
		lastName: 'Forsythe',
		dateOfBirth: '1971-06-25',
		sex: 'male',
		nhsNumber: '602 118 4477'
	};
	d.situation = {
		reasonForTransfer: 'Critical care bed required for refractory septic shock.',
		primaryDiagnosis: 'Septic shock',
		urgency: 'emergent',
		transferType: 'inter-hospital',
		requestedDateTime: '2026-07-04T02:00'
	};
	d.background = {
		presentingComplaint: 'Fever, hypotension, rising lactate.',
		relevantHistory: 'Community-acquired pneumonia, deteriorating despite antibiotics.',
		pastMedicalHistory: 'Type 2 diabetes.',
		currentMedications: '',
		allergies: '',
		recentInvestigations: 'Lactate 5.2, CXR consolidation.',
		infectionStatus: 'Suspected resistant organism — awaiting cultures.'
	};
	d.assessment = {
		currentClinicalStatus: 'Peri-arrest, on noradrenaline infusion.',
		consciousLevel: 'drowsy',
		vitalSigns: {
			heartRate: 134,
			respiratoryRate: 32,
			systolicBloodPressure: 82,
			diastolicBloodPressure: 48,
			temperatureCelsius: 39.4,
			oxygenSaturation: 88,
			newsScore: 12
		},
		clinicallyStable: 'no',
		stabilityNotes: 'Vasopressor-dependent; requires intensive monitoring in transit.'
	};
	d.recommendation = {
		requestedAction: 'Accept for level 3 critical care.',
		expectedOutcomes: '',
		ongoingCarePlan: '',
		pendingResults: 'Blood cultures, viral PCR.'
	};
	d.transferLogistics = {
		...d.transferLogistics,
		transportMode: 'critical-care-transport',
		departureDateTime: '',
		oxygenRequired: true,
		cardiacMonitoringRequired: true,
		infectiousPrecautions: true,
		infectiousPrecautionsDetails: ''
	};
	d.signoffAcknowledgement = {
		...d.signoffAcknowledgement,
		requestingProviderSignature: 'Tom Reilly',
		requestingProviderSignatureDate: '2026-07-04'
	};
	return d;
}

/** Complete community discharge transfer, stable and low-acuity. */
function completeCommunity(): AssessmentData {
	const d = createDefaultAssessment();
	d.requestingProvider = provider({
		clinicianName: 'Dr Grace Okonkwo',
		clinicianRole: 'Discharge Coordinator',
		organisation: 'St Mary General Hospital',
		ward: 'Care of the Elderly',
		phone: '0161 000 0040',
		email: 'g.okonkwo@stmary.example.nhs.uk'
	});
	d.receivingProvider = provider({
		clinicianName: 'Sister Beth Lewis',
		clinicianRole: 'Community Matron',
		organisation: 'Hometown Community Nursing',
		ward: 'District team',
		phone: '0161 000 0050'
	});
	d.patientDemographics = {
		...d.patientDemographics,
		firstName: 'Joan',
		lastName: 'Pemberton',
		dateOfBirth: '1938-08-19',
		sex: 'female',
		nhsNumber: '311 226 9087',
		hospitalNumber: 'SMG-118822',
		nextOfKinName: 'Robert Pemberton',
		nextOfKinPhone: '0780 000 0002'
	};
	d.situation = {
		reasonForTransfer: 'Discharge home with district nursing support after rehabilitation.',
		primaryDiagnosis: 'Resolving lower respiratory tract infection',
		urgency: 'routine',
		transferType: 'community',
		requestedDateTime: '2026-07-05T11:00'
	};
	d.background = {
		presentingComplaint: 'Productive cough and reduced mobility, now improved.',
		relevantHistory: '7-day admission, completed antibiotics, mobilising with frame.',
		pastMedicalHistory: 'Osteoarthritis, mild cognitive impairment.',
		currentMedications: 'Amoxicillin (completed), paracetamol PRN, adcal D3 BD.',
		allergies: 'Penicillin — rash (historic).',
		recentInvestigations: 'CXR clear, bloods normalised.',
		infectionStatus: 'None known.'
	};
	d.assessment = {
		currentClinicalStatus: 'Well, independent with frame, eating and drinking.',
		consciousLevel: 'awake',
		vitalSigns: {
			heartRate: 74,
			respiratoryRate: 15,
			systolicBloodPressure: 128,
			diastolicBloodPressure: 76,
			temperatureCelsius: 36.7,
			oxygenSaturation: 98,
			newsScore: 0
		},
		clinicallyStable: 'yes',
		stabilityNotes: ''
	};
	d.recommendation = {
		requestedAction: 'Provide daily district nursing review for one week.',
		expectedOutcomes: 'Maintain independence at home.',
		ongoingCarePlan: 'Wound and medication review; physiotherapy follow-up booked.',
		pendingResults: 'None.'
	};
	d.transferLogistics = {
		...d.transferLogistics,
		transportMode: 'wheelchair',
		departureDateTime: '2026-07-05T12:00',
		estimatedArrivalDateTime: '2026-07-05T12:40',
		fallsRisk: true
	};
	d.signoffAcknowledgement = {
		...d.signoffAcknowledgement,
		requestingProviderSignature: 'Grace Okonkwo',
		requestingProviderSignatureDate: '2026-07-05',
		receivingProviderName: 'Beth Lewis',
		receivingProviderSignature: 'Beth Lewis',
		receivingProviderSignatureDate: '2026-07-05',
		acknowledgementReceived: true
	};
	return d;
}

/** The sample transfers, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'PT-2026-0001', patientName: 'Brookes, Alan', assessedDate: '2026-07-02', data: completeRoutine() },
	{ id: 'PT-2026-0002', patientName: 'Ellison, Margaret', assessedDate: '2026-07-03', data: partialUrgent() },
	{ id: 'PT-2026-0003', patientName: 'Forsythe, Daniel', assessedDate: '2026-07-04', data: incompleteEmergent() },
	{ id: 'PT-2026-0004', patientName: 'Pemberton, Joan', assessedDate: '2026-07-05', data: completeCommunity() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const v = validateTransfer(s.data);
	const flags = detectFlaggedIssues(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		completeness: v.completeness,
		urgency: s.data.situation.urgency,
		mandatory: `${v.mandatorySatisfied}/${v.mandatoryRequired}`,
		stable: s.data.assessment.clinicallyStable || 'unknown',
		flagCount: flags.length
	};
});
