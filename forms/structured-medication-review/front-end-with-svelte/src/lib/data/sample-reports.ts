import type { BurdenBand, CareSetting, ReviewData, ReviewStatus } from '#lib/engine/types.js';
import { calculateReview } from '#lib/engine/structured-medication-review-grader.js';
import { detectFlaggedIssues } from '#lib/engine/flagged-issues.js';
import { createDefaultReview } from '#lib/stores/assessment.svelte.js';

/** A sample review: an identifier and the full data the engine grades. */
export interface SampleReview {
	id: string;
	patientName: string;
	reviewedDate: string;
	data: ReviewData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	reviewedDate: string;
	careSetting: CareSetting;
	medicineCount: number;
	regularMedicineCount: number;
	anticholinergicBurdenScore: number;
	burdenBand: BurdenBand;
	reviewStatus: ReviewStatus;
	flagCount: number;
}

/** Complete — a low-burden review, all sections finished. */
function completeLow(): ReviewData {
	const d = createDefaultReview();
	d.context = {
		clinicianName: 'Priya Nair',
		clinicianRole: 'clinical-pharmacist',
		reviewedAt: '2026-06-22T10:15',
		careSetting: 'gp-practice',
		consultationMode: 'face-to-face'
	};
	d.identification = {
		patientIdentifier: 'GP-204817',
		ageBand: '65-74',
		sex: 'female',
		frailtyStatus: 'mild',
		livesInCareHome: 'no',
		longTermConditions: 'Hypertension, hypothyroidism'
	};
	d.problems = {
		presentingProblems: 'Annual medicines review; recent dizziness on standing.',
		patientReportedIssues: 'Occasional light-headedness in the morning.',
		whatMattersToPatient: 'Wants to keep gardening and avoid falls.'
	};
	d.medicines = [
		{
			drugName: 'Amlodipine',
			formStrength: 'Tablet 5 mg',
			doseRegimen: 'One in the morning',
			indication: 'Hypertension',
			indicationRecorded: 'yes',
			isRegular: 'yes',
			isHighRisk: 'no',
			highRiskClass: '',
			adherence: 'good',
			anticholinergicBurdenPoints: 0,
			monitoringRequired: 'no',
			monitoringUpToDate: 'na',
			deprescribingCandidate: 'no',
			stoppCriterion: '',
			startCriterion: ''
		},
		{
			drugName: 'Levothyroxine',
			formStrength: 'Tablet 75 mcg',
			doseRegimen: 'One in the morning',
			indication: 'Hypothyroidism',
			indicationRecorded: 'yes',
			isRegular: 'yes',
			isHighRisk: 'no',
			highRiskClass: '',
			adherence: 'good',
			anticholinergicBurdenPoints: 0,
			monitoringRequired: 'yes',
			monitoringUpToDate: 'yes',
			deprescribingCandidate: 'no',
			stoppCriterion: '',
			startCriterion: ''
		}
	];
	d.monitoring = { monitoringDue: 'TFTs checked, in range.', overdueMonitoringCount: 0 };
	d.goals = { sharedDecisions: 'Continue current medicines; review blood pressure in 3 months.' };
	d.plan = {
		followUpPlan: 'Recheck postural BP; routine review in 12 months.',
		followUpDate: '2027-06-22',
		reviewCompleted: 'yes'
	};
	d.note.clinicalNote = 'Straightforward review; low burden, no changes required.';
	return d;
}

/** High burden — hyperpolypharmacy with high ACB, STOPP trigger; complete review. */
function highBurden(): ReviewData {
	const d = createDefaultReview();
	d.context = {
		clinicianName: 'Tom Blake',
		clinicianRole: 'gp',
		reviewedAt: '2026-06-23T14:40',
		careSetting: 'care-home',
		consultationMode: 'home-visit'
	};
	d.identification = {
		patientIdentifier: 'GP-551903',
		ageBand: '85-plus',
		sex: 'female',
		frailtyStatus: 'severe',
		livesInCareHome: 'yes',
		longTermConditions: 'Dementia, depression, osteoarthritis, insomnia, type 2 diabetes'
	};
	d.problems = {
		presentingProblems: 'Problematic polypharmacy; two falls in six months.',
		patientReportedIssues: 'Very drowsy, dry mouth, constipation.',
		whatMattersToPatient: 'Family wants to reduce sedating tablets and falls.'
	};
	d.medicines = [
		{
			drugName: 'Amitriptyline',
			formStrength: 'Tablet 25 mg',
			doseRegimen: 'One at night',
			indication: 'Insomnia',
			indicationRecorded: 'yes',
			isRegular: 'yes',
			isHighRisk: 'no',
			highRiskClass: '',
			adherence: 'good',
			anticholinergicBurdenPoints: 3,
			monitoringRequired: 'no',
			monitoringUpToDate: 'na',
			deprescribingCandidate: 'yes',
			stoppCriterion: 'STOPP D5 — TCA in dementia (worsens cognition)',
			startCriterion: ''
		},
		{
			drugName: 'Oxybutynin',
			formStrength: 'Tablet 5 mg',
			doseRegimen: 'Twice daily',
			indication: 'Urinary urgency',
			indicationRecorded: 'yes',
			isRegular: 'yes',
			isHighRisk: 'no',
			highRiskClass: '',
			adherence: 'good',
			anticholinergicBurdenPoints: 3,
			monitoringRequired: 'no',
			monitoringUpToDate: 'na',
			deprescribingCandidate: 'yes',
			stoppCriterion: '',
			startCriterion: ''
		},
		{
			drugName: 'Sertraline',
			formStrength: 'Tablet 50 mg',
			doseRegimen: 'One in the morning',
			indication: 'Depression',
			indicationRecorded: 'yes',
			isRegular: 'yes',
			isHighRisk: 'no',
			highRiskClass: '',
			adherence: 'partial',
			anticholinergicBurdenPoints: 0,
			monitoringRequired: 'no',
			monitoringUpToDate: 'na',
			deprescribingCandidate: 'no',
			stoppCriterion: '',
			startCriterion: ''
		},
		{
			drugName: 'Metformin',
			formStrength: 'Tablet 500 mg',
			doseRegimen: 'Twice daily',
			indication: 'Type 2 diabetes',
			indicationRecorded: 'yes',
			isRegular: 'yes',
			isHighRisk: 'no',
			highRiskClass: '',
			adherence: 'good',
			anticholinergicBurdenPoints: 0,
			monitoringRequired: 'yes',
			monitoringUpToDate: 'yes',
			deprescribingCandidate: 'no',
			stoppCriterion: '',
			startCriterion: ''
		},
		{
			drugName: 'Atorvastatin',
			formStrength: 'Tablet 20 mg',
			doseRegimen: 'One at night',
			indication: 'Secondary prevention',
			indicationRecorded: 'yes',
			isRegular: 'yes',
			isHighRisk: 'no',
			highRiskClass: '',
			adherence: 'good',
			anticholinergicBurdenPoints: 0,
			monitoringRequired: 'yes',
			monitoringUpToDate: 'yes',
			deprescribingCandidate: 'no',
			stoppCriterion: '',
			startCriterion: ''
		},
		{
			drugName: 'Ramipril',
			formStrength: 'Capsule 5 mg',
			doseRegimen: 'One in the morning',
			indication: 'Hypertension',
			indicationRecorded: 'yes',
			isRegular: 'yes',
			isHighRisk: 'no',
			highRiskClass: '',
			adherence: 'good',
			anticholinergicBurdenPoints: 0,
			monitoringRequired: 'yes',
			monitoringUpToDate: 'yes',
			deprescribingCandidate: 'no',
			stoppCriterion: '',
			startCriterion: ''
		},
		{
			drugName: 'Furosemide',
			formStrength: 'Tablet 40 mg',
			doseRegimen: 'One in the morning',
			indication: 'Ankle oedema',
			indicationRecorded: 'yes',
			isRegular: 'yes',
			isHighRisk: 'no',
			highRiskClass: '',
			adherence: 'good',
			anticholinergicBurdenPoints: 0,
			monitoringRequired: 'yes',
			monitoringUpToDate: 'yes',
			deprescribingCandidate: 'yes',
			stoppCriterion: '',
			startCriterion: ''
		},
		{
			drugName: 'Codeine',
			formStrength: 'Tablet 30 mg',
			doseRegimen: 'As needed',
			indication: 'Osteoarthritis pain',
			indicationRecorded: 'yes',
			isRegular: 'yes',
			isHighRisk: 'no',
			highRiskClass: '',
			adherence: 'good',
			anticholinergicBurdenPoints: 0,
			monitoringRequired: 'no',
			monitoringUpToDate: 'na',
			deprescribingCandidate: 'no',
			stoppCriterion: '',
			startCriterion: ''
		},
		{
			drugName: 'Calcium and vitamin D',
			formStrength: 'Tablet',
			doseRegimen: 'Twice daily',
			indication: 'Bone protection',
			indicationRecorded: 'yes',
			isRegular: 'yes',
			isHighRisk: 'no',
			highRiskClass: '',
			adherence: 'good',
			anticholinergicBurdenPoints: 0,
			monitoringRequired: 'no',
			monitoringUpToDate: 'na',
			deprescribingCandidate: 'no',
			stoppCriterion: '',
			startCriterion: ''
		},
		{
			drugName: 'Lansoprazole',
			formStrength: 'Capsule 30 mg',
			doseRegimen: 'One in the morning',
			indication: 'Gastro-protection',
			indicationRecorded: 'yes',
			isRegular: 'yes',
			isHighRisk: 'no',
			highRiskClass: '',
			adherence: 'good',
			anticholinergicBurdenPoints: 0,
			monitoringRequired: 'no',
			monitoringUpToDate: 'na',
			deprescribingCandidate: 'yes',
			stoppCriterion: '',
			startCriterion: 'START A6 — bone-protection review'
		}
	];
	d.monitoring = { monitoringDue: 'U&Es and HbA1c checked, all in range.', overdueMonitoringCount: 0 };
	d.goals = {
		sharedDecisions: 'Agreed to trial stopping amitriptyline and oxybutynin over 4 weeks.'
	};
	d.plan = {
		followUpPlan: 'Pharmacist to lead deprescribing; review falls and cognition in 6 weeks.',
		followUpDate: '2026-08-04',
		reviewCompleted: 'yes'
	};
	d.note.clinicalNote =
		'High anticholinergic burden and hyperpolypharmacy; deprescribing plan agreed with family.';
	return d;
}

/** Incomplete — a high-risk medicine without a recorded indication, review not finished. */
function incompleteHighRisk(): ReviewData {
	const d = createDefaultReview();
	d.context = {
		clinicianName: 'Aoife Byrne',
		clinicianRole: 'pharmacy-technician',
		reviewedAt: '2026-06-24T09:05',
		careSetting: 'pcn',
		consultationMode: 'telephone'
	};
	d.identification = {
		patientIdentifier: 'GP-100442',
		ageBand: '75-84',
		sex: 'male',
		frailtyStatus: 'moderate',
		livesInCareHome: 'no',
		longTermConditions: 'Atrial fibrillation, chronic kidney disease'
	};
	d.problems = {
		presentingProblems: 'High-risk-medicine review requested by GP.',
		patientReportedIssues: '',
		whatMattersToPatient: ''
	};
	d.medicines = [
		{
			drugName: 'Warfarin',
			formStrength: 'Tablet 3 mg',
			doseRegimen: 'Per INR',
			indication: '',
			indicationRecorded: 'no',
			isRegular: 'yes',
			isHighRisk: 'yes',
			highRiskClass: 'anticoagulant',
			adherence: 'unknown',
			anticholinergicBurdenPoints: 0,
			monitoringRequired: 'yes',
			monitoringUpToDate: 'no',
			deprescribingCandidate: 'no',
			stoppCriterion: '',
			startCriterion: ''
		},
		{
			drugName: 'Bisoprolol',
			formStrength: 'Tablet 2.5 mg',
			doseRegimen: 'One in the morning',
			indication: 'Rate control',
			indicationRecorded: 'yes',
			isRegular: 'yes',
			isHighRisk: 'no',
			highRiskClass: '',
			adherence: 'good',
			anticholinergicBurdenPoints: 0,
			monitoringRequired: 'no',
			monitoringUpToDate: 'na',
			deprescribingCandidate: 'no',
			stoppCriterion: '',
			startCriterion: ''
		}
	];
	d.monitoring = { monitoringDue: '', overdueMonitoringCount: 1 };
	d.goals = { sharedDecisions: '' };
	d.plan = { followUpPlan: 'Awaiting INR result and patient callback.', followUpDate: '', reviewCompleted: 'no' };
	d.note.clinicalNote = 'Indication for warfarin not yet documented; INR overdue. Review not complete.';
	return d;
}

/** Moderate burden — polypharmacy with a START omission; complete review. */
function moderateBurden(): ReviewData {
	const d = createDefaultReview();
	d.context = {
		clinicianName: 'Yusuf Ahmed',
		clinicianRole: 'clinical-pharmacist',
		reviewedAt: '2026-06-25T11:30',
		careSetting: 'community-pharmacy',
		consultationMode: 'video'
	};
	d.identification = {
		patientIdentifier: 'GP-204981',
		ageBand: '65-74',
		sex: 'male',
		frailtyStatus: 'mild',
		livesInCareHome: 'no',
		longTermConditions: 'Type 2 diabetes, ischaemic heart disease, gout'
	};
	d.problems = {
		presentingProblems: 'Routine polypharmacy review; wants tablets simplified.',
		patientReportedIssues: 'Finds midday dose easy to forget.',
		whatMattersToPatient: 'Prefers once-daily dosing where possible.'
	};
	d.medicines = [
		{
			drugName: 'Metformin',
			formStrength: 'Tablet 1 g',
			doseRegimen: 'Twice daily',
			indication: 'Type 2 diabetes',
			indicationRecorded: 'yes',
			isRegular: 'yes',
			isHighRisk: 'no',
			highRiskClass: '',
			adherence: 'partial',
			anticholinergicBurdenPoints: 0,
			monitoringRequired: 'yes',
			monitoringUpToDate: 'yes',
			deprescribingCandidate: 'no',
			stoppCriterion: '',
			startCriterion: ''
		},
		{
			drugName: 'Aspirin',
			formStrength: 'Tablet 75 mg',
			doseRegimen: 'One in the morning',
			indication: 'Secondary prevention',
			indicationRecorded: 'yes',
			isRegular: 'yes',
			isHighRisk: 'no',
			highRiskClass: '',
			adherence: 'good',
			anticholinergicBurdenPoints: 0,
			monitoringRequired: 'no',
			monitoringUpToDate: 'na',
			deprescribingCandidate: 'no',
			stoppCriterion: '',
			startCriterion: ''
		},
		{
			drugName: 'Allopurinol',
			formStrength: 'Tablet 300 mg',
			doseRegimen: 'One in the morning',
			indication: 'Gout prophylaxis',
			indicationRecorded: 'yes',
			isRegular: 'yes',
			isHighRisk: 'no',
			highRiskClass: '',
			adherence: 'good',
			anticholinergicBurdenPoints: 0,
			monitoringRequired: 'yes',
			monitoringUpToDate: 'yes',
			deprescribingCandidate: 'no',
			stoppCriterion: '',
			startCriterion: ''
		},
		{
			drugName: 'Bisoprolol',
			formStrength: 'Tablet 5 mg',
			doseRegimen: 'One in the morning',
			indication: 'Ischaemic heart disease',
			indicationRecorded: 'yes',
			isRegular: 'yes',
			isHighRisk: 'no',
			highRiskClass: '',
			adherence: 'good',
			anticholinergicBurdenPoints: 0,
			monitoringRequired: 'no',
			monitoringUpToDate: 'na',
			deprescribingCandidate: 'no',
			stoppCriterion: '',
			startCriterion: ''
		},
		{
			drugName: 'Ramipril',
			formStrength: 'Capsule 5 mg',
			doseRegimen: 'One in the morning',
			indication: 'Cardio-renal protection',
			indicationRecorded: 'yes',
			isRegular: 'yes',
			isHighRisk: 'no',
			highRiskClass: '',
			adherence: 'good',
			anticholinergicBurdenPoints: 0,
			monitoringRequired: 'yes',
			monitoringUpToDate: 'yes',
			deprescribingCandidate: 'no',
			stoppCriterion: '',
			startCriterion: 'START A5 — high-intensity statin in established IHD'
		}
	];
	d.monitoring = { monitoringDue: 'U&Es and HbA1c reviewed, in range.', overdueMonitoringCount: 0 };
	d.goals = {
		sharedDecisions: 'Agreed to switch metformin to modified-release once daily; start atorvastatin.'
	};
	d.plan = {
		followUpPlan: 'GP to add atorvastatin; recheck adherence in 8 weeks.',
		followUpDate: '2026-08-20',
		reviewCompleted: 'yes'
	};
	d.note.clinicalNote = 'Moderate burden; simplification and a statin start agreed.';
	return d;
}

/** The sample reviews, keyed by stable id (used to seed the wizard). */
export const sampleReviews: SampleReview[] = [
	{ id: 'SMR-2026-0001', patientName: 'Okafor, Beatrice', reviewedDate: '2026-06-22', data: completeLow() },
	{ id: 'SMR-2026-0002', patientName: 'Whitfield, Edith', reviewedDate: '2026-06-23', data: highBurden() },
	{ id: 'SMR-2026-0003', patientName: 'Nowak, Henryk', reviewedDate: '2026-06-24', data: incompleteHighRisk() },
	{ id: 'SMR-2026-0004', patientName: 'Ahmed, Yusuf', reviewedDate: '2026-06-25', data: moderateBurden() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleReviewRows: DashboardRow[] = sampleReviews.map((s) => {
	const g = calculateReview(s.data);
	const flags = detectFlaggedIssues(s.data, g).length;
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		reviewedDate: s.reviewedDate,
		careSetting: s.data.context.careSetting,
		medicineCount: g.medicineCount,
		regularMedicineCount: g.regularMedicineCount,
		anticholinergicBurdenScore: g.anticholinergicBurdenScore,
		burdenBand: g.burdenBand,
		reviewStatus: g.reviewStatus,
		flagCount: flags
	};
});
