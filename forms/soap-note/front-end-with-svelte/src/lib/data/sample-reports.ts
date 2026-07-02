import type { AssessmentData, CareSetting, CompletenessStatus } from '$lib/engine/types';
import { calculateSoapGrade } from '$lib/engine/soap-note-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample note: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	encounteredDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	careSetting: CareSetting;
	status: CompletenessStatus;
	completenessPercent: number;
	highFlagCount: number;
	flagCount: number;
	encounteredDate: string;
}

/** Complete — a fully-documented general-practice chest-pain note. */
function completeNote(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Okafor',
		clinicianRole: 'doctor',
		encounteredAt: '2026-06-22T09:20',
		careSetting: 'general-practice',
		encounterType: 'new-problem'
	};
	d.identification = { patientIdentifier: 'GP-204815', ageBand: '60-74', sex: 'male' };
	d.subjective = {
		presentingComplaint: 'Central chest pain for two hours.',
		historyOfPresentingComplaint:
			'Sudden onset at rest, heavy pressure radiating to the left arm, associated sweating and nausea, partially eased by rest.',
		patientReportedSymptoms: 'Mild breathlessness.',
		relevantHistory: 'Hypertension, ex-smoker. On amlodipine. No known drug allergies.',
		redFlagSymptoms: 'yes'
	};
	d.objective = {
		examinationFindings: 'Comfortable at rest, chest clear, heart sounds normal, no peripheral oedema.',
		vitalSigns: 'HR 92, BP 152/94, RR 18, SpO2 97% on air, Temp 36.8°C.',
		abnormalVitalsPresent: 'yes',
		investigationResults: 'ECG: no acute ST changes. Troponin requested.'
	};
	d.assessment = {
		primaryDiagnosis: 'Suspected acute coronary syndrome.',
		problemList: 'Chest pain; hypertension.',
		differential: 'Musculoskeletal pain, reflux, anxiety.',
		clinicalImpression: 'Cardiac cause cannot be excluded — treat as ACS pending troponin.'
	};
	d.plan = {
		investigationsPlan: 'Serial troponin, repeat ECG.',
		treatmentPlan: 'Aspirin 300 mg given, GTN spray as needed.',
		referrals: 'Blue-light transfer to emergency department.',
		followUp: 'Handover to ED cardiology team; GP review after discharge.',
		safetyNetting: 'Call 999 if pain returns, worsens, or breathlessness develops.',
		managedAtHome: 'no'
	};
	d.summary = {
		clinicalNote: 'Treated as suspected ACS; escalated for urgent assessment.'
	};
	return d;
}

/** Partial — both critical sections present, but follow-up not recorded. */
function partialNote(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'RN P. Nowak',
		clinicianRole: 'nurse',
		encounteredAt: '2026-06-24T14:05',
		careSetting: 'ward',
		encounterType: 'review'
	};
	d.identification = { patientIdentifier: 'WD-330149', ageBand: '75-plus', sex: 'male' };
	d.subjective = {
		presentingComplaint: 'Post-operative wound review.',
		historyOfPresentingComplaint: 'Day 3 after hemiarthroplasty; mild wound discomfort, no fever.',
		patientReportedSymptoms: '',
		relevantHistory: 'Type 2 diabetes; anticoagulated.',
		redFlagSymptoms: 'no'
	};
	d.objective = {
		examinationFindings: 'Wound clean and dry, no surrounding erythema, dressing intact.',
		vitalSigns: 'HR 78, BP 132/80, Temp 36.9°C.',
		abnormalVitalsPresent: 'no',
		investigationResults: ''
	};
	d.assessment = {
		primaryDiagnosis: 'Satisfactory post-operative wound.',
		problemList: 'Post-op day 3; diabetes.',
		differential: '',
		clinicalImpression: ''
	};
	d.plan = {
		investigationsPlan: '',
		treatmentPlan: 'Continue analgesia; redress wound.',
		referrals: '',
		followUp: '', // follow-up not recorded → conditional component unmet → partial
		safetyNetting: '',
		managedAtHome: 'no'
	};
	d.summary = { clinicalNote: 'Routine post-operative review; progressing well.' };
	return d;
}

/** Incomplete — red-flag symptoms recorded but the Plan section is empty. */
function incompleteNoPlan(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr S. Abadi',
		clinicianRole: 'doctor',
		encounteredAt: '2026-06-27T22:40',
		careSetting: 'emergency-department',
		encounterType: 'new-problem'
	};
	d.identification = { patientIdentifier: 'ED-771488', ageBand: '40-59', sex: 'female' };
	d.subjective = {
		presentingComplaint: 'Sudden severe headache, worst ever.',
		historyOfPresentingComplaint:
			'Thunderclap onset one hour ago, peaked instantly, with neck stiffness and photophobia.',
		patientReportedSymptoms: 'Nausea, one episode of vomiting.',
		relevantHistory: 'No prior headaches of this type.',
		redFlagSymptoms: 'yes'
	};
	d.objective = {
		examinationFindings: 'Neck stiffness, photophobia, no focal neurological deficit.',
		vitalSigns: 'HR 88, BP 168/98.',
		abnormalVitalsPresent: 'yes',
		investigationResults: ''
	};
	d.assessment = {
		primaryDiagnosis: 'Suspected subarachnoid haemorrhage.',
		problemList: '',
		differential: 'Migraine, meningitis.',
		clinicalImpression: ''
	};
	// Plan deliberately left empty → note incomplete; red-flag-no-plan flag.
	d.summary = { clinicalNote: 'Awaiting senior review; plan not yet documented.' };
	return d;
}

/** Incomplete — no Assessment recorded despite abnormal vitals. */
function incompleteNoAssessment(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Paramedic G. Thompson',
		clinicianRole: 'paramedic',
		encounteredAt: '2026-06-26T08:15',
		careSetting: 'community',
		encounterType: 'new-problem'
	};
	d.identification = { patientIdentifier: 'CM-118427', ageBand: '18-39', sex: 'male' };
	d.subjective = {
		presentingComplaint: 'Shortness of breath and wheeze.',
		historyOfPresentingComplaint: 'Two days of worsening wheeze, using inhaler more often.',
		patientReportedSymptoms: 'Tight chest.',
		relevantHistory: 'Asthma.',
		redFlagSymptoms: 'no'
	};
	d.objective = {
		examinationFindings: 'Widespread expiratory wheeze, speaking in short sentences.',
		vitalSigns: 'HR 112, RR 26, SpO2 93% on air.',
		abnormalVitalsPresent: 'yes',
		investigationResults: 'Peak flow 60% of best.'
	};
	// Assessment deliberately left empty → note incomplete; missing-assessment flag.
	d.plan = {
		investigationsPlan: '',
		treatmentPlan: 'Salbutamol nebuliser started.',
		referrals: '',
		followUp: 'Conveyed to emergency department.',
		safetyNetting: '',
		managedAtHome: 'no'
	};
	d.summary = { clinicalNote: 'Acute asthma; assessment section not completed on scene.' };
	return d;
}

/** The sample notes, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'SOAP-2026-0001',
		patientName: 'Okafor, Chidi',
		encounteredDate: '2026-06-22',
		data: completeNote()
	},
	{
		id: 'SOAP-2026-0002',
		patientName: 'Nowak, Piotr',
		encounteredDate: '2026-06-24',
		data: partialNote()
	},
	{
		id: 'SOAP-2026-0003',
		patientName: 'Abadi, Layla',
		encounteredDate: '2026-06-27',
		data: incompleteNoPlan()
	},
	{
		id: 'SOAP-2026-0004',
		patientName: 'Thompson, Gary',
		encounteredDate: '2026-06-26',
		data: incompleteNoAssessment()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateSoapGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		careSetting: s.data.context.careSetting,
		status: g.status,
		completenessPercent: g.completenessPercent,
		highFlagCount: g.flags.filter((f) => f.priority === 'high').length,
		flagCount: g.flags.length,
		encounteredDate: s.encounteredDate
	};
});
