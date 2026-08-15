import type { CardiologyRequest, ReferralRow } from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/stores/result.svelte.js';

/** A sample referral: an identifier and the full request the engine grades. */
export interface SampleReferral {
	id: string;
	patientName: string;
	referralDate: string;
	request: CardiologyRequest;
}

/**
 * A routine, appropriate referral: stable atypical chest pain, ECG done, normal
 * troponin, complete request. Grades to accept / routine.
 */
function routineReferral(): CardiologyRequest {
	return {
		...createDefaultRequest(),
		referringClinician: 'Dr Sarah Owen',
		referrerRole: 'GP',
		registrationBody: 'GMC',
		registrationNumber: '7012345',
		requesterContact: 'sarah.owen@nhs.net · 01865 000000',
		referralDate: '2026-06-10',
		nhsNumber: '485 777 3456',
		patientName: 'Margaret Hughes',
		dateOfBirth: '1958-03-14',
		status: 'submitted',
		siteName: 'Headington Medical Practice',
		setting: 'community',
		requestedService: 'rapid-access-chest-pain',
		referralReason: 'chest-pain',
		clinicalQuestion: 'Is this stable angina? Please risk-stratify and advise on investigation.',
		relevantHistory: 'Intermittent exertional chest tightness over 3 months, relieved by rest.',
		symptomChestPain: true,
		chestPainCharacter: 'atypical',
		ecgDone: true,
		ecgFindings: 'Sinus rhythm, no acute ST changes.',
		troponinStatus: 'normal',
		hypertension: true,
		currentMedications: 'Amlodipine 5 mg OD, atorvastatin 20 mg ON.',
		urgency: 'routine'
	};
}

/**
 * An urgent referral: new-onset heart failure with elevated BNP and NYHA III
 * breathlessness. Red flag drives safety + auto-escalates triage to urgent.
 */
function urgentHeartFailureReferral(): CardiologyRequest {
	return {
		...createDefaultRequest(),
		referringClinician: 'Dr James Carter',
		referrerRole: 'GP',
		registrationBody: 'GMC',
		registrationNumber: '7099887',
		requesterContact: 'james.carter@nhs.net · 0121 000000',
		referralDate: '2026-06-12',
		nhsNumber: '402 118 9921',
		patientName: 'Derek Mensah',
		dateOfBirth: '1949-11-02',
		status: 'submitted',
		siteName: 'Selly Oak Surgery',
		setting: 'community',
		requestedService: 'heart-failure',
		referralReason: 'heart-failure-symptoms',
		clinicalQuestion:
			'New breathlessness and oedema with raised BNP — please assess for heart failure and arrange echo.',
		relevantHistory: 'Two-week history of orthopnoea, ankle oedema, and reduced exercise tolerance.',
		symptomBreathlessness: true,
		nyhaClass: 'iii',
		symptomOedema: true,
		newOnsetHeartFailure: true,
		ecgDone: true,
		ecgFindings: 'Sinus tachycardia, left bundle branch block.',
		troponinStatus: 'normal',
		bnpStatus: 'elevated',
		hypertension: true,
		diabetes: true,
		currentMedications: 'Metformin, ramipril, furosemide started this week.',
		urgency: 'urgent'
	};
}

/**
 * An emergency referral: suspected acute coronary syndrome with elevated
 * troponin. Auto-escalates triage to emergency.
 */
function emergencyAcsReferral(): CardiologyRequest {
	return {
		...createDefaultRequest(),
		referringClinician: 'Dr Priya Nair',
		referrerRole: 'Emergency medicine registrar',
		registrationBody: 'GMC',
		registrationNumber: '7456120',
		supervisingConsultant: 'Dr H Patel',
		requesterContact: 'ED bleep 1234',
		referralDate: '2026-06-13',
		nhsNumber: '309 552 0148',
		patientName: 'Anthony Brooks',
		dateOfBirth: '1965-07-21',
		status: 'submitted',
		siteName: 'City General ED',
		setting: 'emergency',
		requestedService: 'general-cardiology',
		referralReason: 'chest-pain',
		clinicalQuestion: 'Central crushing chest pain with dynamic ECG and rising troponin — please review urgently.',
		relevantHistory: 'One hour of central crushing chest pain radiating to the left arm, diaphoretic.',
		symptomChestPain: true,
		chestPainCharacter: 'typical-angina',
		suspectedAcs: true,
		ecgDone: true,
		ecgFindings: 'ST depression in the lateral leads.',
		troponinStatus: 'elevated',
		knownCoronaryArteryDisease: true,
		previousMi: true,
		hypertension: true,
		currentMedications: 'Aspirin, bisoprolol, atorvastatin.',
		urgency: 'emergency'
	};
}

/** The sample referrals used by the dashboard. */
export const sampleReferrals: SampleReferral[] = [
	{
		id: 'CR-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineReferral()
	},
	{
		id: 'CR-2026-0002',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-12',
		request: urgentHeartFailureReferral()
	},
	{
		id: 'CR-2026-0003',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-13',
		request: emergencyAcsReferral()
	}
];

/** Grades each sample referral with the live engine for the dashboard table. */
export const sampleReferralRows: ReferralRow[] = sampleReferrals.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		requestedService: s.request.requestedService,
		referralReason: s.request.referralReason,
		status: s.request.status,
		referralDate: s.referralDate,
		appropriatenessBand: g.appropriatenessBand,
		safetyBand: g.safetyBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
