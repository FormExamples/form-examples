import type { AssessmentData, FlagPriority, FollowUpTimeframe } from '$lib/engine/types';
import { validateCounterReferral } from '$lib/engine/counter-referral-validator';
import { detectFlaggedIssues } from '$lib/engine/flagged-issues';
import { highestPriority } from '$lib/engine/utils';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample counter-referral: an identifier and the full data the engine checks. */
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
	referralDate: string;
	followUpTimeframe: FollowUpTimeframe;
	completeness: string;
	complete: boolean;
	missingCount: number;
	reviewPriority: FlagPriority | 'none';
	flagCount: number;
}

/** A fully-completed, low-risk counter-referral with a routine follow-up. */
function completeRoutine(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientIdentification = {
		patientName: 'Smith, Jane',
		dateOfBirth: '1972-03-14',
		sex: 'female',
		patientContact: '+44 7700 900111',
		emergencyContact: { name: 'Smith, Robert (husband)', contactInformation: '+44 7700 900112' }
	};
	d.facilityDetails = {
		initiatingFacility: {
			name: 'Riverside Family Practice',
			focalPoint: 'Dr A. Okafor',
			phoneNumber: '+44 20 7946 0001'
		},
		referralDate: '2026-04-02',
		referralReason: 'Chest pain for cardiology assessment',
		acuity: 'non-acute',
		referralFacility: {
			name: 'St Mary Tertiary Care Centre',
			focalPoint: 'Dr L. Chen',
			phoneNumber: '+44 20 7946 0100'
		},
		communication: {
			discussedWithPrimaryCareProvider: true,
			discussedWithInitiatingFacility: true
		},
		primaryCareFacility: {
			name: 'Riverside Family Practice',
			focalPoint: 'Dr A. Okafor',
			phoneNumber: '+44 20 7946 0001'
		},
		followUpTimeframe: '1-to-2-weeks'
	};
	d.situation = {
		chiefComplaint: 'Exertional chest pain',
		primaryDiagnosis: 'NSTEMI — post-PCI',
		pregnant: 'no',
		treatmentsInitiated: 'PCI with drug-eluting stent; dual antiplatelet therapy started',
		icuStay: false,
		surgery: false,
		hospitalized: true
	};
	d.background = {
		historyOfPresentIllness: 'Two-day history of exertional chest pain radiating to left arm.',
		pastMedicalHistory: 'Hypertension, hyperlipidaemia',
		significantEvents: 'Troponin positive; angiography showed single-vessel disease.'
	};
	d.assessment = {
		finalDiagnoses: 'NSTEMI, single-vessel coronary artery disease',
		prognosisAndGoalsOfCare: 'Good prognosis with secondary prevention and cardiac rehab.',
		patientFamilyInformed: 'yes',
		informedExplanation: 'Discussed diagnosis and medication plan with patient and husband.'
	};
	d.recommendations = {
		followUpPlan: 'Continue DAPT 12 months; statin; ACE inhibitor; cardiac rehabilitation.',
		pendingInvestigations: '',
		followUpArrangements: 'GP review in 1–2 weeks; cardiology clinic in 6 weeks.',
		deteriorationInstructions: 'Return to emergency unit if chest pain recurs or worsens.',
		contactName: 'Dr L. Chen',
		contactInformation: '+44 20 7946 0100',
		statusFlags: {
			cognitiveImpairment: false,
			carerDependent: false,
			spinalPrecautions: false,
			weightBearingRestrictions: false,
			palliativeCare: false
		}
	};
	d.providerSignOff = {
		providerName: 'Dr L. Chen',
		signature: 'L. Chen',
		signatureDate: '2026-04-12'
	};
	return d;
}

/** A complete counter-referral with an urgent follow-up and post-operative care. */
function completeUrgent(): AssessmentData {
	const d = completeRoutine();
	d.patientIdentification = {
		patientName: 'Williams, David',
		dateOfBirth: '1968-09-08',
		sex: 'male',
		patientContact: '+44 7700 900221',
		emergencyContact: { name: 'Williams, Sarah (daughter)', contactInformation: '+44 7700 900222' }
	};
	d.facilityDetails.referralDate = '2026-04-09';
	d.facilityDetails.referralReason = 'Polytrauma following road traffic collision';
	d.facilityDetails.acuity = 'acute';
	d.facilityDetails.referralFacility = {
		name: 'Central Trauma Centre',
		focalPoint: 'Mr P. Adebayo',
		phoneNumber: '+44 20 7946 0200'
	};
	d.facilityDetails.primaryCareFacility = {
		name: 'Northbridge GP Surgery',
		focalPoint: 'Dr K. Patel',
		phoneNumber: '+44 20 7946 0003'
	};
	d.facilityDetails.followUpTimeframe = 'urgent-within-24-hours';
	d.situation = {
		chiefComplaint: 'Multiple fractures',
		primaryDiagnosis: 'Polytrauma — fractures stabilised',
		pregnant: 'no',
		treatmentsInitiated: 'ORIF of femur and tibia; analgesia; VTE prophylaxis',
		icuStay: false,
		surgery: true,
		hospitalized: true
	};
	d.assessment.finalDiagnoses = 'Stabilised femoral and tibial fractures';
	d.recommendations.followUpArrangements =
		'GP review within 24 hours; orthopaedic clinic in 2 weeks.';
	d.recommendations.statusFlags.weightBearingRestrictions = true;
	d.providerSignOff = {
		providerName: 'Mr P. Adebayo',
		signature: 'P. Adebayo',
		signatureDate: '2026-04-20'
	};
	return d;
}

/** An incomplete counter-referral: several required fields are still blank. */
function incomplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientIdentification = {
		patientName: 'Patel, Priya',
		dateOfBirth: '1989-11-02',
		sex: 'female',
		patientContact: '+44 7700 900331',
		emergencyContact: { name: 'Patel, Anil (brother)', contactInformation: '+44 7700 900332' }
	};
	d.facilityDetails = {
		initiatingFacility: {
			name: 'Greenfield Community Clinic',
			focalPoint: 'Dr M. Idris',
			phoneNumber: '+44 20 7946 0004'
		},
		referralDate: '2026-04-13',
		referralReason: 'Head injury for neurosurgical assessment',
		acuity: 'acute',
		referralFacility: {
			name: 'University Teaching Hospital',
			focalPoint: 'Dr H. Mbeki',
			phoneNumber: '+44 20 7946 0300'
		},
		communication: {
			discussedWithPrimaryCareProvider: false,
			discussedWithInitiatingFacility: false
		},
		primaryCareFacility: {
			name: 'Greenfield Community Clinic',
			focalPoint: 'Dr M. Idris',
			phoneNumber: '+44 20 7946 0004'
		},
		followUpTimeframe: '2-to-6-days'
	};
	d.situation = {
		chiefComplaint: 'Severe headache after fall',
		primaryDiagnosis: 'Traumatic brain injury — recovering',
		pregnant: 'no',
		treatmentsInitiated: 'Neuro-observation; conservative management',
		icuStay: true,
		surgery: false,
		hospitalized: true
	};
	d.background = {
		historyOfPresentIllness: 'Fall from height with brief loss of consciousness.',
		pastMedicalHistory: '',
		significantEvents: ''
	};
	d.assessment = {
		finalDiagnoses: 'Severe traumatic brain injury',
		prognosisAndGoalsOfCare: '',
		patientFamilyInformed: 'no',
		informedExplanation: ''
	};
	// Recommendations left mostly blank — deterioration instructions missing.
	d.recommendations.followUpPlan = 'Neuro-rehabilitation referral.';
	d.providerSignOff = {
		providerName: 'Dr H. Mbeki',
		signature: '',
		signatureDate: ''
	};
	return d;
}

/** A complete counter-referral on a palliative pathway with several status flags. */
function palliative(): AssessmentData {
	const d = completeRoutine();
	d.patientIdentification = {
		patientName: 'Thomas, Michael',
		dateOfBirth: '1958-08-15',
		sex: 'male',
		patientContact: '+44 7700 900441',
		emergencyContact: { name: 'Thomas, Grace (wife)', contactInformation: '+44 7700 900442' }
	};
	d.facilityDetails.referralDate = '2026-04-16';
	d.facilityDetails.referralReason = 'Penetrating chest trauma';
	d.facilityDetails.acuity = 'acute';
	d.facilityDetails.referralFacility = {
		name: 'Central Trauma Centre',
		focalPoint: 'Mr P. Adebayo',
		phoneNumber: '+44 20 7946 0200'
	};
	d.facilityDetails.primaryCareFacility = {
		name: 'Island Coastal Clinic',
		focalPoint: 'Dr E. Nair',
		phoneNumber: '+44 20 7946 0005'
	};
	d.facilityDetails.followUpTimeframe = 'urgent-within-24-hours';
	d.situation = {
		chiefComplaint: 'Penetrating chest injury',
		primaryDiagnosis: 'Penetrating chest trauma — palliative care',
		pregnant: 'no',
		treatmentsInitiated: 'Symptom control; comfort measures',
		icuStay: true,
		surgery: true,
		hospitalized: true
	};
	d.assessment = {
		finalDiagnoses: 'Irreversible thoracic injury; transitioned to palliative care',
		prognosisAndGoalsOfCare: 'Comfort-focused care; family supported.',
		patientFamilyInformed: 'no',
		informedExplanation: ''
	};
	d.recommendations.followUpPlan = 'Community palliative care team to lead ongoing care.';
	d.recommendations.pendingInvestigations = 'Awaiting final histology of pleural sample.';
	d.recommendations.followUpArrangements = 'Palliative care nurse home visit within 24 hours.';
	d.recommendations.deteriorationInstructions =
		'Contact palliative care team; anticipatory medications in place.';
	d.recommendations.statusFlags = {
		cognitiveImpairment: true,
		carerDependent: true,
		spinalPrecautions: false,
		weightBearingRestrictions: false,
		palliativeCare: true
	};
	d.providerSignOff = {
		providerName: 'Mr P. Adebayo',
		signature: 'P. Adebayo',
		signatureDate: '2026-04-24'
	};
	return d;
}

/** The sample counter-referrals, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'CR-2026-0001',
		patientName: 'Smith, Jane',
		assessedDate: '2026-04-12',
		data: completeRoutine()
	},
	{
		id: 'CR-2026-0002',
		patientName: 'Williams, David',
		assessedDate: '2026-04-20',
		data: completeUrgent()
	},
	{
		id: 'CR-2026-0003',
		patientName: 'Patel, Priya',
		assessedDate: '2026-04-15',
		data: incomplete()
	},
	{
		id: 'CR-2026-0004',
		patientName: 'Thomas, Michael',
		assessedDate: '2026-04-24',
		data: palliative()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const v = validateCounterReferral(s.data);
	const flags = detectFlaggedIssues(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		referralDate: s.data.facilityDetails.referralDate,
		followUpTimeframe: s.data.facilityDetails.followUpTimeframe,
		completeness: v.complete ? 'Complete' : `${v.missing.length} missing`,
		complete: v.complete,
		missingCount: v.missing.length,
		reviewPriority: highestPriority(flags.map((f) => f.priority)),
		flagCount: flags.length
	};
});
