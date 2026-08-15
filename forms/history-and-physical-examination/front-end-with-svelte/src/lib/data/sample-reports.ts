import type { AssessmentData, CareSetting, CompletenessStatus } from '#lib/engine/types.js';
import { calculateHistoryAndPhysicalGrade } from '#lib/engine/history-and-physical-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample clerking: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	clerkedDate: string;
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
	blocking: boolean;
	highFlagCount: number;
	flagCount: number;
	clerkedDate: string;
}

/** Complete — all ten components documented, no blocking flag, normal vitals. */
function completeClerking(): AssessmentData {
	const d = createDefaultAssessment();
	d.encounter = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		registrationNumber: 'GMC 7654321',
		clerkedAt: '2026-06-24T09:30',
		careSetting: 'acute-medical-unit',
		admissionSource: 'gp'
	};
	d.identification = { patientIdentifier: 'AMU-100482', ageBand: '65-79', sex: 'female' };
	d.history = {
		presentingComplaint: 'Productive cough and fever for three days.',
		historyOfPresentingComplaint:
			'Gradual onset, green sputum, pleuritic right-sided chest pain, breathless on exertion.',
		pastMedicalSurgicalHistory: 'COPD; cholecystectomy 2012.',
		drugHistory: 'Salbutamol and tiotropium inhalers.',
		allergyStatus: 'none-known',
		allergyDetail: '',
		familyHistory: 'Nil relevant.',
		socialHistory: 'Ex-smoker 30 pack-years, lives alone, independent.',
		systemsReview: 'No urinary or GI symptoms; otherwise unremarkable.'
	};
	d.vitals = {
		temperature: 37.6,
		heartRate: 84,
		respiratoryRate: 18,
		systolicBloodPressure: 128,
		oxygenSaturation: 96,
		consciousnessLevel: 'alert'
	};
	d.examination = {
		examCardiovascular: 'HS I+II+0, no murmurs, no oedema.',
		examRespiratory: 'Right basal crackles, dull to percussion.',
		examAbdominal: 'Soft, non-tender, no organomegaly.',
		examNeurological: 'Grossly intact, GCS 15.',
		examOther: 'No rashes; calves soft.',
		investigations: 'CXR: right basal consolidation. CRP 112, WCC 14.'
	};
	d.assessment = {
		impression: 'Community-acquired pneumonia (right base), CURB-65 2.',
		redFlagFindings: '',
		managementPlan: 'IV co-amoxiclav, oxygen to target 88-92%, admit to AMU, senior review.',
		clinicalNote: 'Discussed with medical registrar; for repeat obs in 4 hours.'
	};
	return d;
}

/** Partial — nine of ten components; complete narrative but systems review blank. */
function partialClerking(): AssessmentData {
	const d = completeClerking();
	d.encounter = {
		clinicianName: 'ACP I. Mackenzie',
		clinicianRole: 'acp',
		registrationNumber: 'NMC 55A1122',
		clerkedAt: '2026-06-25T14:10',
		careSetting: 'emergency-department',
		admissionSource: 'self'
	};
	d.identification = { patientIdentifier: 'ED-573110', ageBand: '40-64', sex: 'male' };
	d.history.presentingComplaint = 'Right-sided abdominal pain for one day.';
	d.history.historyOfPresentingComplaint =
		'Colicky, migrated to the right iliac fossa, anorexia, one episode of vomiting.';
	d.history.pastMedicalSurgicalHistory = 'Nil of note.';
	d.history.drugHistory = 'None.';
	d.history.allergyStatus = 'none-known';
	d.history.socialHistory = 'Non-smoker, social alcohol, works as a teacher.';
	d.history.systemsReview = ''; // outstanding → partial (9 of 10)
	d.assessment.impression = 'Query acute appendicitis.';
	d.assessment.managementPlan = 'Bloods, urine dip, surgical referral, keep nil by mouth.';
	d.assessment.clinicalNote = 'Systems review to be completed on the ward.';
	return d;
}

/** Incomplete (blocking) — allergy status not documented forces incomplete. */
function incompleteBlockingClerking(): AssessmentData {
	const d = completeClerking();
	d.encounter = {
		clinicianName: 'Dr Z. Nowak',
		clinicianRole: 'doctor',
		registrationNumber: 'GMC 1122334',
		clerkedAt: '2026-06-26T21:15',
		careSetting: 'emergency-department',
		admissionSource: 'ambulance'
	};
	d.identification = { patientIdentifier: 'ED-100517', ageBand: '18-39', sex: 'female' };
	d.history.presentingComplaint = 'Sudden severe headache.';
	d.history.historyOfPresentingComplaint =
		'Thunderclap onset while exercising, photophobia, neck stiffness.';
	d.history.allergyStatus = 'not-documented'; // BLOCKING → incomplete
	d.history.allergyDetail = '';
	d.vitals.systolicBloodPressure = 176;
	d.assessment.impression = 'Query subarachnoid haemorrhage.';
	d.assessment.redFlagFindings = 'Thunderclap headache with meningism.';
	d.assessment.managementPlan = 'Urgent CT head, discuss with neurosurgery, analgesia.';
	return d;
}

/** Incomplete (blocking) — no impression and no plan; early triage clerking. */
function incompleteEarlyClerking(): AssessmentData {
	const d = createDefaultAssessment();
	d.encounter = {
		clinicianName: 'PA R. Fletcher',
		clinicianRole: 'physician-associate',
		registrationNumber: '',
		clerkedAt: '2026-06-27T08:00',
		careSetting: 'ward',
		admissionSource: 'transfer'
	};
	d.identification = { patientIdentifier: 'WD-880204', ageBand: '80-plus', sex: 'male' };
	d.history.presentingComplaint = 'Fall at home, found on the floor.';
	d.history.historyOfPresentingComplaint = 'Uncertain mechanism, no clear loss of consciousness.';
	d.history.allergyStatus = 'has-allergies';
	d.history.allergyDetail = 'Penicillin — rash.';
	d.vitals = {
		temperature: 35.4,
		heartRate: 48,
		respiratoryRate: 22,
		systolicBloodPressure: 98,
		oxygenSaturation: 93,
		consciousnessLevel: 'voice'
	};
	d.examination.examCardiovascular = 'HS I+II+0.';
	d.examination.examRespiratory = 'Deferred — patient unable to sit up.';
	// Abdominal and neurological left blank → incomplete systems exam flag.
	// Impression and plan both blank → BLOCKING no-impression-or-plan flag.
	d.assessment.clinicalNote = 'Awaiting collateral history and senior review.';
	return d;
}

/** The sample clerkings, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'HP-2026-0001',
		patientName: 'Osei, Grace',
		clerkedDate: '2026-06-24',
		data: completeClerking()
	},
	{
		id: 'HP-2026-0002',
		patientName: 'Mackenzie, Ian',
		clerkedDate: '2026-06-25',
		data: partialClerking()
	},
	{
		id: 'HP-2026-0003',
		patientName: 'Nowak, Zofia',
		clerkedDate: '2026-06-26',
		data: incompleteBlockingClerking()
	},
	{
		id: 'HP-2026-0004',
		patientName: 'Ahmed, Bilal',
		clerkedDate: '2026-06-27',
		data: incompleteEarlyClerking()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateHistoryAndPhysicalGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		careSetting: s.data.encounter.careSetting,
		status: g.status,
		completenessPercent: g.completenessPercent,
		blocking: g.blocking,
		highFlagCount: g.flags.filter((f) => f.priority === 'high').length,
		flagCount: g.flags.length,
		clerkedDate: s.clerkedDate
	};
});
