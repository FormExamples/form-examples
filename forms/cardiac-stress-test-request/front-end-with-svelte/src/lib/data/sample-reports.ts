import type { StressTestRequest, RequestRow } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefaultRequest } from '$lib/engine/defaults';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: StressTestRequest;
}

/**
 * A routine, appropriate request: suspected angina, exercise treadmill ECG (the
 * first-line test), able to exercise, no contraindications, complete. Grades to
 * accept / routine.
 */
function routineRequest(): StressTestRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Sarah Owen',
		clinicianRole: 'gp',
		registrationBody: 'GMC',
		registrationNumber: '7012345',
		requesterContact: 'sarah.owen@nhs.net · 01865 000000',
		supervisingConsultant: '',
		siteName: 'Headington Medical Practice',
		referralDate: '2026-06-10'
	};
	r.patient = {
		firstName: 'Margaret',
		lastName: 'Hughes',
		dateOfBirth: '1958-03-14',
		nhsNumber: '485 777 3456',
		bodyMassIndex: 26.4
	};
	r.request = {
		testType: 'exercise-treadmill-ecg',
		primaryIndication: 'exercise-tolerance',
		clinicalQuestion: 'Assess exercise tolerance and ischaemic burden before cardiac rehab.',
		relevantHistory: 'Stable, no recent events; on optimal medical therapy.'
	};
	r.symptoms = {
		symptomChestPain: false,
		symptomBreathlessness: false,
		symptomPalpitations: false,
		ableToExercise: true,
		restingEcgFindings: 'Sinus rhythm, no acute ST changes.'
	};
	r.safety = {
		knownCoronaryArteryDisease: true,
		recentAcuteCoronarySyndrome: false,
		aorticStenosis: 'none',
		uncontrolledHypertension: false,
		betaBlocker: true
	};
	r.triage = {
		urgency: 'routine',
		requestedByDate: '2026-07-20',
		setting: 'community',
		notes: ''
	};
	return r;
}

/**
 * An urgent, may-be-appropriate request: suspected angina with chest pain
 * (auto-escalates triage to urgent) requested as perfusion SPECT (plausible,
 * not first-line). Grades to accept / urgent.
 */
function urgentChestPainRequest(): StressTestRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr James Carter',
		clinicianRole: 'cardiologist',
		registrationBody: 'GMC',
		registrationNumber: '7099887',
		requesterContact: 'james.carter@nhs.net · 0121 000000',
		supervisingConsultant: '',
		siteName: 'City Cardiology Clinic',
		referralDate: '2026-06-12'
	};
	r.patient = {
		firstName: 'Derek',
		lastName: 'Mensah',
		dateOfBirth: '1961-11-02',
		nhsNumber: '402 118 9921',
		bodyMassIndex: 31.2
	};
	r.request = {
		testType: 'myocardial-perfusion-spect',
		primaryIndication: 'suspected-angina',
		clinicalQuestion: 'Exertional chest tightness — assess for inducible ischaemia.',
		relevantHistory: 'Two-month history of exertional chest tightness, eased by rest.'
	};
	r.symptoms = {
		symptomChestPain: true,
		symptomBreathlessness: true,
		symptomPalpitations: false,
		ableToExercise: true,
		restingEcgFindings: 'Sinus rhythm, minor non-specific T-wave changes.'
	};
	r.safety = {
		knownCoronaryArteryDisease: false,
		recentAcuteCoronarySyndrome: false,
		aorticStenosis: 'none',
		uncontrolledHypertension: false,
		betaBlocker: false
	};
	r.triage = {
		urgency: 'routine',
		requestedByDate: '2026-06-26',
		setting: 'outpatient',
		notes: 'Rapid-access chest-pain pathway.'
	};
	return r;
}

/**
 * A caution → redirect request: an exercise treadmill ECG requested for a
 * patient who cannot exercise — redirect to a pharmacological modality. Grades
 * to redirect / routine with an unable-to-exercise flag.
 */
function redirectUnableToExerciseRequest(): StressTestRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Aisha Khan',
		clinicianRole: 'hospital-doctor',
		registrationBody: 'GMC',
		registrationNumber: '7456120',
		requesterContact: 'ward bleep 2210',
		supervisingConsultant: 'Dr H Patel',
		siteName: 'St Aidan’s General — Ward 12',
		referralDate: '2026-06-13'
	};
	r.patient = {
		firstName: 'Brian',
		lastName: 'Foster',
		dateOfBirth: '1948-07-21',
		nhsNumber: '309 552 0148',
		bodyMassIndex: 29.1
	};
	r.request = {
		testType: 'exercise-treadmill-ecg',
		primaryIndication: 'known-cad-assessment',
		clinicalQuestion: 'Functional assessment of known coronary disease.',
		relevantHistory: 'Severe osteoarthritis; mobilises with a frame, cannot use a treadmill.'
	};
	r.symptoms = {
		symptomChestPain: false,
		symptomBreathlessness: true,
		symptomPalpitations: false,
		ableToExercise: false,
		restingEcgFindings: 'Sinus rhythm, old inferior Q waves.'
	};
	r.safety = {
		knownCoronaryArteryDisease: true,
		recentAcuteCoronarySyndrome: false,
		aorticStenosis: 'mild',
		uncontrolledHypertension: false,
		betaBlocker: true
	};
	r.triage = {
		urgency: 'routine',
		requestedByDate: '2026-07-10',
		setting: 'inpatient',
		notes: ''
	};
	return r;
}

/**
 * A contraindicated → reject request: recent acute coronary syndrome makes
 * stress testing contraindicated and auto-escalates triage to emergency. Grades
 * to reject / emergency with a high-priority safety flag.
 */
function contraindicatedAcsRequest(): StressTestRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Priya Nair',
		clinicianRole: 'hospital-doctor',
		registrationBody: 'GMC',
		registrationNumber: '7561203',
		requesterContact: 'ED bleep 1234',
		supervisingConsultant: 'Dr M Reeves',
		siteName: 'City General — Emergency Department',
		referralDate: '2026-06-14'
	};
	r.patient = {
		firstName: 'Anthony',
		lastName: 'Brooks',
		dateOfBirth: '1965-04-09',
		nhsNumber: '511 903 2274',
		bodyMassIndex: 28.0
	};
	r.request = {
		testType: 'stress-echo',
		primaryIndication: 'known-cad-assessment',
		clinicalQuestion: 'Risk stratify known CAD after recent presentation.',
		relevantHistory: 'NSTEMI five days ago; awaiting inpatient angiography.'
	};
	r.symptoms = {
		symptomChestPain: true,
		symptomBreathlessness: true,
		symptomPalpitations: false,
		ableToExercise: false,
		restingEcgFindings: 'Resolving lateral ST depression.'
	};
	r.safety = {
		knownCoronaryArteryDisease: true,
		recentAcuteCoronarySyndrome: true,
		aorticStenosis: 'none',
		uncontrolledHypertension: true,
		betaBlocker: true
	};
	r.triage = {
		urgency: 'urgent',
		requestedByDate: '2026-06-16',
		setting: 'inpatient',
		notes: 'Inpatient; cardiology already involved.'
	};
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'CSTR-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineRequest()
	},
	{
		id: 'CSTR-2026-0002',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-12',
		request: urgentChestPainRequest()
	},
	{
		id: 'CSTR-2026-0003',
		patientName: 'Brian Foster',
		referralDate: '2026-06-13',
		request: redirectUnableToExerciseRequest()
	},
	{
		id: 'CSTR-2026-0004',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-14',
		request: contraindicatedAcsRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		testType: s.request.request.testType,
		primaryIndication: s.request.request.primaryIndication,
		appropriatenessScore: g.appropriatenessScore,
		appropriatenessBand: g.appropriatenessBand,
		contraindicationBand: g.contraindicationBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
