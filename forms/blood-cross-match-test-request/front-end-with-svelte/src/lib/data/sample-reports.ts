import type {
	AppropriatenessBand,
	CrossMatchRequest,
	IdentitySafetyBand,
	Recommendation,
	RequestType,
	TriageTier
} from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample request: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	requestedDate: string;
	data: CrossMatchRequest;
}

/** A row in the vetting dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	requestedDate: string;
	requestType: RequestType;
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	identitySafetyBand: IdentitySafetyBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	knownAntibodies: boolean;
	flagCount: number;
}

/** Accept / routine: complete, safe, elective group-and-save for surgery. */
function acceptRoutine(): CrossMatchRequest {
	const d = createDefaultAssessment();
	d.clinician = { ...d.clinician, clinicianName: 'Dr A Okafor', clinicianRole: 'doctor', registrationBody: 'GMC', referralDate: '2026-06-10' };
	d.patient = { ...d.patient, firstName: 'John', lastName: 'Smith', dateOfBirth: '1968-04-12', nhsNumber: '943 476 5919', positivePatientIdConfirmed: true };
	d.request = { ...d.request, requestType: 'group-and-save', component: 'none', unitsRequired: 0, requestedByDate: '2026-06-12' };
	d.indication = { ...d.indication, primaryIndication: 'surgery', clinicalDetails: 'Elective laparoscopic cholecystectomy, low expected blood loss.' };
	d.history = { ...d.history, patientBloodGroup: 'o-pos' };
	d.sample = { ...d.sample, sampleCollected: 'yes', twoSampleRuleMet: true, labellingCheckComplete: true };
	d.triage = { ...d.triage, urgency: 'routine', setting: 'inpatient' };
	return d;
}

/** Query referrer: red-cell crossmatch for anaemia above the NG24 threshold; known antibodies. */
function queryReferrer(): CrossMatchRequest {
	const d = createDefaultAssessment();
	d.clinician = { ...d.clinician, clinicianName: 'Dr P Nair', clinicianRole: 'doctor', registrationBody: 'GMC', referralDate: '2026-06-12' };
	d.patient = { ...d.patient, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1959-09-30', nhsNumber: '865 209 4471', positivePatientIdConfirmed: true };
	d.request = { ...d.request, requestType: 'crossmatch', component: 'red-cells', unitsRequired: 2, requestedByDate: '2026-06-14' };
	d.indication = { ...d.indication, primaryIndication: 'anaemia', clinicalDetails: 'Chronic iron-deficiency anaemia, asymptomatic.', currentHaemoglobin: 105 };
	d.history = { ...d.history, patientBloodGroup: 'a-pos', knownAntibodies: true, antibodyDetail: 'Anti-K; antigen-negative units required.', previousTransfusion: true };
	d.sample = { ...d.sample, sampleCollected: 'yes', twoSampleRuleMet: true, labellingCheckComplete: true };
	d.triage = { ...d.triage, urgency: 'routine', setting: 'outpatient' };
	return d;
}

/** Reject risk: crossmatch with a collected sample but the two-sample rule not met. */
function rejectRisk(): CrossMatchRequest {
	const d = createDefaultAssessment();
	d.clinician = { ...d.clinician, clinicianName: 'Sister M Jones', clinicianRole: 'nurse', registrationBody: 'NMC', referralDate: '2026-06-15' };
	d.patient = { ...d.patient, firstName: 'Margaret', lastName: 'Doyle', dateOfBirth: '1948-01-22', nhsNumber: '401 023 2137', positivePatientIdConfirmed: false };
	d.request = { ...d.request, requestType: 'crossmatch', component: 'red-cells', unitsRequired: 2, requestedByDate: '2026-06-15' };
	d.indication = { ...d.indication, primaryIndication: 'surgery', clinicalDetails: 'Hemiarthroplasty for fractured neck of femur.', currentHaemoglobin: 92 };
	d.history = { ...d.history, patientBloodGroup: 'b-pos', previousTransfusion: true, previousTransfusionReaction: true };
	d.sample = { ...d.sample, sampleCollected: 'yes', twoSampleRuleMet: false, labellingCheckComplete: false };
	d.triage = { ...d.triage, urgency: 'urgent', setting: 'inpatient' };
	return d;
}

/** Stat / accept: emergency O-negative for major haemorrhage (identity bypass). */
function statEmergency(): CrossMatchRequest {
	const d = createDefaultAssessment();
	d.clinician = { ...d.clinician, clinicianName: 'Dr D Williams', clinicianRole: 'doctor', registrationBody: 'GMC', referralDate: '2026-06-18' };
	d.patient = { ...d.patient, firstName: 'David', lastName: 'Williams', dateOfBirth: '1990-11-03', nhsNumber: '712 558 8841', positivePatientIdConfirmed: true };
	d.request = { ...d.request, requestType: 'emergency-o-negative', component: 'red-cells', unitsRequired: 4 };
	d.indication = { ...d.indication, primaryIndication: 'acute-bleeding', clinicalDetails: 'Road traffic collision; class III haemorrhagic shock.' };
	d.history = { ...d.history, patientBloodGroup: 'unknown' };
	d.sample = { ...d.sample, sampleCollected: 'no' };
	d.triage = { ...d.triage, urgency: 'emergency', massiveHaemorrhage: true, activeUncontrolledBleeding: true, haemodynamicallyUnstable: true, setting: 'emergency' };
	return d;
}

/** The sample requests, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'XX-2026-0001', patientName: 'Smith, John', requestedDate: '2026-06-10', data: acceptRoutine() },
	{ id: 'XX-2026-0002', patientName: 'Patel, Priya', requestedDate: '2026-06-12', data: queryReferrer() },
	{ id: 'XX-2026-0003', patientName: 'Doyle, Margaret', requestedDate: '2026-06-15', data: rejectRisk() },
	{ id: 'XX-2026-0004', patientName: 'Williams, David', requestedDate: '2026-06-18', data: statEmergency() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		requestedDate: s.requestedDate,
		requestType: s.data.request.requestType,
		appropriatenessScore: g.appropriatenessScore,
		appropriatenessBand: g.appropriatenessBand,
		identitySafetyBand: g.identitySafetyBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		knownAntibodies: s.data.history.knownAntibodies,
		flagCount: g.flags.length
	};
});
