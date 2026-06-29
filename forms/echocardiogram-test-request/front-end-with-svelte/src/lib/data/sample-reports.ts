import type { EchoRequest, EchoRequestRow } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefaultRequest } from '$lib/engine/defaults';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: EchoRequest;
}

/**
 * A routine, appropriate, complete request: surveillance TTE for known disease,
 * NYHA I, normal natriuretic peptide. Grades to appropriate / routine / low.
 */
function routineSurveillanceRequest(): EchoRequest {
	const d = createDefaultRequest();
	d.clinician = {
		clinicianName: 'Dr Sarah Owen',
		clinicianRole: 'GP',
		registrationBody: 'GMC',
		registrationNumber: '7012345',
		requesterContact: 'sarah.owen@nhs.net · 01865 000000',
		supervisingConsultant: '',
		siteName: 'Headington Medical Practice',
		referralDate: '2026-06-10'
	};
	d.patient = {
		firstName: 'Margaret',
		lastName: 'Hughes',
		dateOfBirth: '1958-03-14',
		nhsNumber: '485 777 3456',
		heightAsCm: 163,
		weightAsKg: 68,
		bodyMassIndex: 25.6
	};
	d.request = {
		echoType: 'transthoracic-tte',
		primaryIndication: 'surveillance-known-disease',
		clinicalQuestion: 'Interval surveillance of known mild mitral regurgitation — reassess severity and LV function.',
		relevantHistory: 'Known mild mitral regurgitation on prior echo; stable and asymptomatic.',
		relevantMedications: 'Amlodipine 5 mg OD.',
		previousEcho: 'yes',
		previousEchoDate: '2025-01-08',
		ejectionFractionKnown: 60
	};
	d.symptoms = {
		breathlessness: false,
		chestPain: false,
		palpitations: false,
		syncope: false,
		oedema: false,
		nyhaClass: 'i'
	};
	d.investigations = {
		ecgFindings: 'Sinus rhythm, no acute changes.',
		bnpOrNtProbnp: 120,
		knownMurmur: true,
		onCardiotoxicChemotherapy: false
	};
	d.triage = { urgency: 'routine', requestedByDate: '', setting: 'community', notes: '' };
	return d;
}

/**
 * An urgent request: suspected heart failure with NT-proBNP > 2000 ng/L and
 * NYHA III breathlessness. NICE NG106 escalates triage to urgent and priority
 * to high; raised-BNP safety flag.
 */
function urgentHeartFailureRequest(): EchoRequest {
	const d = createDefaultRequest();
	d.clinician = {
		clinicianName: 'Dr James Carter',
		clinicianRole: 'GP',
		registrationBody: 'GMC',
		registrationNumber: '7099887',
		requesterContact: 'james.carter@nhs.net · 0121 000000',
		supervisingConsultant: '',
		siteName: 'Selly Oak Surgery',
		referralDate: '2026-06-12'
	};
	d.patient = {
		firstName: 'Derek',
		lastName: 'Mensah',
		dateOfBirth: '1949-11-02',
		nhsNumber: '402 118 9921',
		heightAsCm: 175,
		weightAsKg: 92,
		bodyMassIndex: 30.0
	};
	d.request = {
		echoType: 'transthoracic-tte',
		primaryIndication: 'heart-failure',
		clinicalQuestion:
			'New breathlessness and oedema with NT-proBNP > 2000 ng/L — please assess LV function for heart failure.',
		relevantHistory: 'Two-week history of orthopnoea, ankle oedema, and reduced exercise tolerance.',
		relevantMedications: 'Metformin, ramipril, furosemide started this week.',
		previousEcho: 'none',
		previousEchoDate: '',
		ejectionFractionKnown: null
	};
	d.symptoms = {
		breathlessness: true,
		chestPain: false,
		palpitations: false,
		syncope: false,
		oedema: true,
		nyhaClass: 'iii'
	};
	d.investigations = {
		ecgFindings: 'Sinus tachycardia, left bundle branch block.',
		bnpOrNtProbnp: 3400,
		knownMurmur: false,
		onCardiotoxicChemotherapy: false
	};
	d.triage = { urgency: 'urgent', requestedByDate: '2026-06-26', setting: 'community', notes: '' };
	return d;
}

/**
 * An emergency request: suspected infective endocarditis requiring urgent TTE
 * then TOE. Red flag auto-escalates triage to emergency and priority to high.
 */
function emergencyEndocarditisRequest(): EchoRequest {
	const d = createDefaultRequest();
	d.clinician = {
		clinicianName: 'Dr Priya Nair',
		clinicianRole: 'Acute medicine registrar',
		registrationBody: 'GMC',
		registrationNumber: '7456120',
		requesterContact: 'AMU bleep 1234',
		supervisingConsultant: 'Dr H Patel',
		siteName: 'City General AMU',
		referralDate: '2026-06-13'
	};
	d.patient = {
		firstName: 'Anthony',
		lastName: 'Brooks',
		dateOfBirth: '1965-07-21',
		nhsNumber: '309 552 0148',
		heightAsCm: 180,
		weightAsKg: 78,
		bodyMassIndex: 24.1
	};
	d.request = {
		echoType: 'transoesophageal-toe',
		primaryIndication: 'endocarditis',
		clinicalQuestion: 'Fever, new murmur and positive blood cultures — assess for vegetations / infective endocarditis.',
		relevantHistory: 'Five-day history of fevers and rigors; new pansystolic murmur; two sets of positive blood cultures.',
		relevantMedications: 'Empirical IV antibiotics commenced.',
		previousEcho: 'none',
		previousEchoDate: '',
		ejectionFractionKnown: null
	};
	d.symptoms = {
		breathlessness: true,
		chestPain: false,
		palpitations: false,
		syncope: false,
		oedema: false,
		nyhaClass: 'ii'
	};
	d.investigations = {
		ecgFindings: 'Sinus tachycardia.',
		bnpOrNtProbnp: 450,
		knownMurmur: true,
		onCardiotoxicChemotherapy: false
	};
	d.redFlags = {
		suspectedEndocarditis: true,
		severeSymptomaticValve: false,
		acuteHeartFailure: false
	};
	d.triage = { urgency: 'urgent', requestedByDate: '2026-06-13', setting: 'inpatient', notes: 'Discussed with on-call cardiology.' };
	return d;
}

/**
 * A rarely-appropriate, incomplete request: a stress echo requested for
 * palpitations (mismatched study) with no clinical question. Grades to
 * rarely-appropriate and recommends querying the referrer.
 */
function rarelyAppropriateRequest(): EchoRequest {
	const d = createDefaultRequest();
	d.clinician = {
		clinicianName: 'Dr Leah Foster',
		clinicianRole: 'GP',
		registrationBody: 'GMC',
		registrationNumber: '7211004',
		requesterContact: 'leah.foster@nhs.net',
		supervisingConsultant: '',
		siteName: 'Riverside Practice',
		referralDate: '2026-06-14'
	};
	d.patient = {
		firstName: 'Owen',
		lastName: 'Davies',
		dateOfBirth: '1981-09-30',
		nhsNumber: '610 224 7788',
		heightAsCm: 178,
		weightAsKg: 84,
		bodyMassIndex: 26.5
	};
	d.request = {
		echoType: 'stress-echo',
		primaryIndication: 'palpitations',
		clinicalQuestion: '',
		relevantHistory: 'Occasional palpitations, otherwise well.',
		relevantMedications: '',
		previousEcho: 'none',
		previousEchoDate: '',
		ejectionFractionKnown: null
	};
	d.symptoms = {
		breathlessness: false,
		chestPain: false,
		palpitations: true,
		syncope: false,
		oedema: false,
		nyhaClass: ''
	};
	d.investigations = {
		ecgFindings: '',
		bnpOrNtProbnp: null,
		knownMurmur: false,
		onCardiotoxicChemotherapy: false
	};
	d.triage = { urgency: 'routine', requestedByDate: '', setting: 'community', notes: '' };
	return d;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'ECG-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineSurveillanceRequest()
	},
	{
		id: 'ECG-2026-0002',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-12',
		request: urgentHeartFailureRequest()
	},
	{
		id: 'ECG-2026-0003',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-13',
		request: emergencyEndocarditisRequest()
	},
	{
		id: 'ECG-2026-0004',
		patientName: 'Owen Davies',
		referralDate: '2026-06-14',
		request: rarelyAppropriateRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: EchoRequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		echoType: s.request.request.echoType,
		primaryIndication: s.request.request.primaryIndication,
		referralDate: s.referralDate,
		appropriatenessBand: g.appropriatenessBand,
		triageTier: g.triageTier,
		completenessPercent: g.completenessPercent,
		priorityBand: g.priorityBand,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
