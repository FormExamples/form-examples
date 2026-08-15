import type { AssessmentData, ModeOfTransfer } from '#lib/engine/types.js';
import { validateReferral } from '#lib/engine/referral-validator.js';
import { detectFlaggedIssues } from '#lib/engine/flagged-issues.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample referral: an identifier and the full data the engine validates. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	referralDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	referralDate: string;
	initiatingFacility: string;
	referralFacility: string;
	modeOfTransfer: ModeOfTransfer;
	primaryDiagnosis: string;
	completeness: 'complete' | 'incomplete';
	completionPercent: number;
	urgentFlagCount: number;
	flagCount: number;
}

/** Mark every ABCDE category normal with no intervention (a complete background). */
function abcdeAllNormal(d: AssessmentData) {
	for (const k of ['airway', 'breathing', 'circulation', 'disability', 'exposure'] as const) {
		d.background[k] = {
			findingNormal: true,
			findingDetails: '',
			interventionNone: true,
			interventionDetails: ''
		};
	}
}

/** A complete referral with no clinical flags (stable transfer). */
function completeStable(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientIdentification = {
		patientLastName: 'TAYLOR',
		patientFirstName: 'James',
		dateOfBirth: '1980-07-19',
		sex: 'male',
		patientContactInformation: '+44 20 7946 0010',
		emergencyContact: { name: 'Anne Taylor', contactInformation: '+44 20 7946 0011 (spouse)' }
	};
	d.facilityAndTransport = {
		initiatingFacility: { name: 'Lakeside Community Hospital', focalPoint: 'Dr O. Reed', phoneNumber: '+44 20 7946 1000' },
		reasonForReferral: 'Specialist cardiology review for unstable angina.',
		referralFacilityContacted: true,
		referralFacility: { name: 'Cardiac Specialist Centre', focalPoint: 'Dr S. Khan', phoneNumber: '+44 20 7946 2000' },
		ambulance: { name: 'County Ambulance Service', focalPoint: 'Crew 12', phoneNumber: '+44 20 7946 3000' },
		transferDecisionDateTime: '2026-04-17T09:30',
		departureDateTime: '2026-04-17T10:10',
		modeOfTransfer: 'ground'
	};
	d.situation = {
		chiefComplaint: 'Intermittent central chest pain on exertion.',
		primaryDiagnosis: 'Unstable angina',
		pregnant: 'no',
		otherAcuteDiagnoses: '',
		treatmentsInitiated: 'Aspirin 300 mg, GTN spray, oxygen as needed.'
	};
	d.background.historyOfPresentIllness = 'Three days of increasing exertional chest pain, now at rest.';
	d.background.pastMedicalAndSurgicalHistory = 'Hypertension, hyperlipidaemia.';
	abcdeAllNormal(d);
	d.assessment = {
		clinicalAssessment: 'Haemodynamically stable, comfortable at rest; requires inpatient cardiology workup.',
		vitalSigns: {
			heartRate: 78,
			respiratoryRate: 16,
			systolicBloodPressure: 132,
			diastolicBloodPressure: 84,
			temperatureCelsius: 36.7,
			oxygenSaturation: 98,
			glasgowComaScale: 15
		}
	};
	d.recommendations = {
		treatmentPlanDuringTransport: 'Continue oxygen and cardiac monitoring; GTN for breakthrough pain.',
		potentialWorseningOfCondition: '',
		cautionsRegardingPriorTherapies: '',
		precautions: {
			highlyInfectiousDisease: false,
			spinalPrecautions: false,
			weightBearingRestrictions: false,
			fallRisk: false,
			aspirationRisk: false,
			other: false,
			otherDetails: ''
		}
	};
	d.initiatingProviderSignoff = {
		providerName: 'Dr O. Reed',
		signature: 'Olivia Reed',
		signatureDate: '2026-04-17'
	};
	return d;
}

/** A complete referral with urgent flags (critical air transfer). */
function completeCritical(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientIdentification = {
		patientLastName: 'PATEL',
		patientFirstName: 'Priya',
		dateOfBirth: '1989-11-02',
		sex: 'female',
		patientContactInformation: '+44 20 7946 0020',
		emergencyContact: { name: 'Raj Patel', contactInformation: '+44 20 7946 0021 (brother)' }
	};
	d.facilityAndTransport = {
		initiatingFacility: { name: 'Greenfield District Hospital', focalPoint: 'Dr M. Lowe', phoneNumber: '+44 20 7946 1100' },
		reasonForReferral: 'Neurosurgical management of severe traumatic brain injury.',
		referralFacilityContacted: true,
		referralFacility: { name: 'University Teaching Hospital', focalPoint: 'Dr P. Adeyemi', phoneNumber: '+44 20 7946 2100' },
		ambulance: { name: 'Air Ambulance', focalPoint: 'HEMS 4', phoneNumber: '+44 20 7946 3100' },
		transferDecisionDateTime: '2026-04-13T12:45',
		departureDateTime: '2026-04-13T13:05',
		modeOfTransfer: 'air'
	};
	d.situation = {
		chiefComplaint: 'Unresponsive after fall from height.',
		primaryDiagnosis: 'Severe traumatic brain injury',
		pregnant: 'no',
		otherAcuteDiagnoses: 'Right-sided rib fractures.',
		treatmentsInitiated: 'Intubated and ventilated, sedation, cervical collar applied.'
	};
	d.background.historyOfPresentIllness = 'Fall from ladder approx. 3 metres, immediate loss of consciousness.';
	d.background.pastMedicalAndSurgicalHistory = 'Nil significant.';
	d.background.airway = { findingNormal: false, findingDetails: 'Intubated for airway protection.', interventionNone: false, interventionDetails: 'ETT 7.5, secured.' };
	d.background.breathing = { findingNormal: false, findingDetails: 'Ventilated.', interventionNone: false, interventionDetails: 'Mechanical ventilation.' };
	d.background.circulation = { findingNormal: true, findingDetails: '', interventionNone: false, interventionDetails: 'IV access x2, fluids running.' };
	d.background.disability = { findingNormal: false, findingDetails: 'GCS 6 pre-intubation.', interventionNone: true, interventionDetails: '' };
	d.background.exposure = { findingNormal: true, findingDetails: '', interventionNone: true, interventionDetails: '' };
	d.assessment = {
		clinicalAssessment: 'Critically unwell, requires urgent neurosurgical intervention; depressed consciousness.',
		vitalSigns: {
			heartRate: 110,
			respiratoryRate: 14,
			systolicBloodPressure: 100,
			diastolicBloodPressure: 70,
			temperatureCelsius: 36.2,
			oxygenSaturation: 96,
			glasgowComaScale: 6
		}
	};
	d.recommendations = {
		treatmentPlanDuringTransport: 'Maintain sedation and ventilation; head-up 30°; monitor for raised ICP.',
		potentialWorseningOfCondition: 'Risk of cerebral herniation; prepare for emergency intervention on arrival.',
		cautionsRegardingPriorTherapies: 'Sedation may mask neurological deterioration.',
		precautions: {
			highlyInfectiousDisease: false,
			spinalPrecautions: true,
			weightBearingRestrictions: false,
			fallRisk: false,
			aspirationRisk: true,
			other: false,
			otherDetails: ''
		}
	};
	d.initiatingProviderSignoff = {
		providerName: 'Dr M. Lowe',
		signature: 'Martin Lowe',
		signatureDate: '2026-04-13'
	};
	d.referralFacilityReceipt = {
		patientArrivalDateTime: '2026-04-13T14:40',
		receivingProviderName: 'Dr P. Adeyemi',
		receivingProviderSignature: 'Paul Adeyemi',
		feedbackProvidedToInitiatingFacility: true
	};
	return d;
}

/** An incomplete referral still being drafted (initiating facility part started). */
function incompleteDraft(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientIdentification = {
		patientLastName: 'JONES',
		patientFirstName: 'Margaret',
		dateOfBirth: '1955-06-21',
		sex: 'female',
		patientContactInformation: '',
		emergencyContact: { name: '', contactInformation: '' }
	};
	d.facilityAndTransport = {
		initiatingFacility: { name: 'Coastal Rural Clinic', focalPoint: 'Nurse K. Obi', phoneNumber: '+44 20 7946 1200' },
		reasonForReferral: 'Suspected septic shock requiring critical care.',
		referralFacilityContacted: false,
		referralFacility: { name: 'Regional Referral Hospital', focalPoint: '', phoneNumber: '' },
		ambulance: { name: 'Sea Ambulance', focalPoint: '', phoneNumber: '' },
		transferDecisionDateTime: '2026-04-14T09:20',
		departureDateTime: '',
		modeOfTransfer: 'sea'
	};
	d.situation = {
		chiefComplaint: 'Fever, confusion, low blood pressure.',
		primaryDiagnosis: 'Septic shock',
		pregnant: 'unknown',
		otherAcuteDiagnoses: '',
		treatmentsInitiated: 'IV fluids, broad-spectrum antibiotics started.'
	};
	d.background.historyOfPresentIllness = 'Two-day history of fever and worsening confusion.';
	d.assessment = {
		clinicalAssessment: 'Hypotensive and tachycardic despite fluids; needs vasopressor support.',
		vitalSigns: {
			heartRate: 134,
			respiratoryRate: 28,
			systolicBloodPressure: 82,
			diastolicBloodPressure: 50,
			temperatureCelsius: 39.4,
			oxygenSaturation: 92,
			glasgowComaScale: 13
		}
	};
	// Recommendations and sign-off left blank → incomplete.
	return d;
}

/** A complete referral with moderate precaution flags (postpartum haemorrhage). */
function completeObstetric(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientIdentification = {
		patientLastName: 'BROWN',
		patientFirstName: 'Sarah',
		dateOfBirth: '1991-01-30',
		sex: 'female',
		patientContactInformation: '+44 20 7946 0040',
		emergencyContact: { name: 'Tom Brown', contactInformation: '+44 20 7946 0041 (partner)' }
	};
	d.facilityAndTransport = {
		initiatingFacility: { name: 'Eastside Maternity Clinic', focalPoint: 'Midwife L. Carr', phoneNumber: '+44 20 7946 1300' },
		reasonForReferral: 'Severe postpartum haemorrhage requiring obstetric and transfusion support.',
		referralFacilityContacted: true,
		referralFacility: { name: 'University Teaching Hospital', focalPoint: 'Dr H. Sato', phoneNumber: '+44 20 7946 2300' },
		ambulance: { name: 'County Ambulance Service', focalPoint: 'Crew 7', phoneNumber: '+44 20 7946 3300' },
		transferDecisionDateTime: '2026-04-16T15:20',
		departureDateTime: '2026-04-16T15:45',
		modeOfTransfer: 'ground'
	};
	d.situation = {
		chiefComplaint: 'Heavy vaginal bleeding after delivery.',
		primaryDiagnosis: 'Severe postpartum haemorrhage',
		pregnant: 'yes',
		otherAcuteDiagnoses: 'Anaemia.',
		treatmentsInitiated: 'Uterotonics, IV fluids, tranexamic acid, bimanual compression.'
	};
	d.background.historyOfPresentIllness = 'Estimated blood loss 1.5 L following vaginal delivery 1 hour ago.';
	d.background.pastMedicalAndSurgicalHistory = 'Previous caesarean section.';
	abcdeAllNormal(d);
	d.background.circulation = { findingNormal: false, findingDetails: 'Tachycardic, ongoing bleeding.', interventionNone: false, interventionDetails: 'Two large-bore IVs, fluids, blood ordered.' };
	d.assessment = {
		clinicalAssessment: 'Haemodynamically borderline; requires obstetric team and blood products on arrival.',
		vitalSigns: {
			heartRate: 118,
			respiratoryRate: 22,
			systolicBloodPressure: 104,
			diastolicBloodPressure: 64,
			temperatureCelsius: 36.9,
			oxygenSaturation: 97,
			glasgowComaScale: 15
		}
	};
	d.recommendations = {
		treatmentPlanDuringTransport: 'Continue fluids and uterotonics; reassess blood loss; warm patient.',
		potentialWorseningOfCondition: '',
		cautionsRegardingPriorTherapies: 'Tranexamic acid already administered.',
		precautions: {
			highlyInfectiousDisease: false,
			spinalPrecautions: false,
			weightBearingRestrictions: false,
			fallRisk: true,
			aspirationRisk: false,
			other: false,
			otherDetails: ''
		}
	};
	d.initiatingProviderSignoff = {
		providerName: 'Midwife L. Carr',
		signature: 'Laura Carr',
		signatureDate: '2026-04-16'
	};
	d.referralFacilityReceipt = {
		patientArrivalDateTime: '2026-04-16T16:25',
		receivingProviderName: 'Dr H. Sato',
		receivingProviderSignature: 'Hana Sato',
		feedbackProvidedToInitiatingFacility: true
	};
	return d;
}

/** The sample referrals, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'AR-2026-0001', patientName: 'Taylor, James', referralDate: '2026-04-17', data: completeStable() },
	{ id: 'AR-2026-0002', patientName: 'Patel, Priya', referralDate: '2026-04-13', data: completeCritical() },
	{ id: 'AR-2026-0003', patientName: 'Jones, Margaret', referralDate: '2026-04-14', data: incompleteDraft() },
	{ id: 'AR-2026-0004', patientName: 'Brown, Sarah', referralDate: '2026-04-16', data: completeObstetric() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const v = validateReferral(s.data);
	const flags = detectFlaggedIssues(s.data);
	const pct = Math.round((v.totalSatisfied / Math.max(1, v.totalRequired)) * 100);
	return {
		id: s.id,
		patientName: s.patientName,
		referralDate: s.referralDate,
		initiatingFacility: s.data.facilityAndTransport.initiatingFacility.name,
		referralFacility: s.data.facilityAndTransport.referralFacility.name,
		modeOfTransfer: s.data.facilityAndTransport.modeOfTransfer,
		primaryDiagnosis: s.data.situation.primaryDiagnosis,
		completeness: v.complete ? 'complete' : 'incomplete',
		completionPercent: pct,
		urgentFlagCount: flags.filter((f) => f.priority === 'urgent').length,
		flagCount: flags.length
	};
});
