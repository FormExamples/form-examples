import type {
	CareSetting,
	ReconciliationData,
	ReconciliationStatus,
	ReconciliationType
} from '$lib/engine/types';
import { calculateReconciliation } from '$lib/engine/medication-reconciliation-grader';
import { detectFlaggedIssues } from '$lib/engine/flagged-issues';
import { createDefaultReconciliation } from '$lib/stores/assessment.svelte';

/** A sample reconciliation: an identifier and the full data the engine grades. */
export interface SampleReconciliation {
	id: string;
	patientName: string;
	reconciledDate: string;
	data: ReconciliationData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	reconciledDate: string;
	reconciliationType: ReconciliationType;
	careSetting: CareSetting;
	sourceCount: number;
	discrepancyCount: number;
	unintentionalCount: number;
	status: ReconciliationStatus;
	flagCount: number;
}

/** Complete — a fully-documented admission reconciliation on the AMU. */
function complete(): ReconciliationData {
	const d = createDefaultReconciliation();
	d.encounter = {
		reconciliationType: 'admission',
		careSetting: 'acute-medical-unit',
		reconciledAt: '2026-06-22T10:15',
		clinicianName: 'Priya Nair',
		clinicianRole: 'pharmacist'
	};
	d.identification = { patientIdentifier: 'MRN-448210', ageBand: 'adult', sex: 'female', weightKg: 68 };
	d.allergyReview.allergyStatus = 'documented';
	d.informationSources = [
		{ sourceType: 'patient-interview', verified: 'yes' },
		{ sourceType: 'gp-record', verified: 'yes' },
		{ sourceType: 'dispensing-history', verified: 'no' }
	];
	d.allergies = [{ substance: 'Codeine', reactionType: 'intolerance', severity: 'mild' }];
	d.lineItems = [
		{
			listSource: 'bpmh',
			drugName: 'Amlodipine',
			form: 'Tablet',
			dose: '5 mg',
			route: 'oral',
			frequency: 'Once daily',
			indication: 'Hypertension',
			highRiskClass: 'none',
			adherence: 'taking',
			sourceType: 'gp-record',
			status: 'active'
		},
		{
			listSource: 'bpmh',
			drugName: 'Levothyroxine',
			form: 'Tablet',
			dose: '75 mcg',
			route: 'oral',
			frequency: 'Once daily',
			indication: 'Hypothyroidism',
			highRiskClass: 'none',
			adherence: 'taking',
			sourceType: 'patient-interview',
			status: 'active'
		},
		{
			listSource: 'inpatient',
			drugName: 'Amlodipine',
			form: 'Tablet',
			dose: '10 mg',
			route: 'oral',
			frequency: 'Once daily',
			indication: 'Hypertension',
			highRiskClass: 'none',
			adherence: 'taking',
			sourceType: 'gp-record',
			status: 'active'
		}
	];
	d.discrepancies = [
		{
			discrepancyType: 'dose',
			bpmhItemRef: 'Amlodipine 5 mg',
			inpatientItemRef: 'Amlodipine 10 mg',
			intendedAction: 'change',
			rationale: 'Uptitrated for blood-pressure control',
			intentional: 'yes'
		},
		{
			discrepancyType: 'omission',
			bpmhItemRef: 'Levothyroxine 75 mcg',
			inpatientItemRef: '',
			intendedAction: 'continue',
			rationale: 'Restarted on the inpatient chart',
			intentional: 'yes'
		}
	];
	d.note.clinicalNote = 'Reconciliation complete; all discrepancies documented at admission.';
	return d;
}

/** Discrepancies outstanding — a high-risk unintentional warfarin omission. */
function discrepanciesOutstanding(): ReconciliationData {
	const d = createDefaultReconciliation();
	d.encounter = {
		reconciliationType: 'admission',
		careSetting: 'emergency-department',
		reconciledAt: '2026-06-23T21:40',
		clinicianName: 'Tom Blake',
		clinicianRole: 'pharmacy-technician'
	};
	d.identification = { patientIdentifier: 'MRN-551903', ageBand: 'adult', sex: 'male', weightKg: 82 };
	d.allergyReview.allergyStatus = 'no-known-drug-allergies';
	d.informationSources = [
		{ sourceType: 'patient-interview', verified: 'yes' },
		{ sourceType: 'community-pharmacy', verified: 'yes' }
	];
	d.lineItems = [
		{
			listSource: 'bpmh',
			drugName: 'Warfarin',
			form: 'Tablet',
			dose: '3 mg',
			route: 'oral',
			frequency: 'Once daily (per INR)',
			indication: 'Atrial fibrillation',
			highRiskClass: 'anticoagulant',
			adherence: 'taking',
			sourceType: 'community-pharmacy',
			status: 'active'
		},
		{
			listSource: 'bpmh',
			drugName: 'Bisoprolol',
			form: 'Tablet',
			dose: '2.5 mg',
			route: 'oral',
			frequency: 'Once daily',
			indication: 'Rate control',
			highRiskClass: 'none',
			adherence: 'taking',
			sourceType: 'patient-interview',
			status: 'active'
		},
		{
			listSource: 'inpatient',
			drugName: 'Bisoprolol',
			form: 'Tablet',
			dose: '2.5 mg',
			route: 'oral',
			frequency: 'Once daily',
			indication: 'Rate control',
			highRiskClass: 'none',
			adherence: 'taking',
			sourceType: 'patient-interview',
			status: 'active'
		}
	];
	d.discrepancies = [
		{
			discrepancyType: 'omission',
			bpmhItemRef: 'Warfarin 3 mg',
			inpatientItemRef: '',
			intendedAction: '',
			rationale: '',
			intentional: 'no'
		}
	];
	d.note.clinicalNote = 'Warfarin missing from inpatient chart — escalated to prescriber.';
	return d;
}

/** Incomplete — a single source only, on a discharge reconciliation. */
function incomplete(): ReconciliationData {
	const d = createDefaultReconciliation();
	d.encounter = {
		reconciliationType: 'discharge',
		careSetting: 'ward',
		reconciledAt: '2026-06-24T09:05',
		clinicianName: 'Aoife Byrne',
		clinicianRole: 'nurse'
	};
	d.identification = { patientIdentifier: 'MRN-100442', ageBand: 'adult', sex: 'female', weightKg: 59 };
	d.allergyReview.allergyStatus = 'not-documented';
	d.informationSources = [{ sourceType: 'previous-discharge-summary', verified: 'no' }];
	d.lineItems = [
		{
			listSource: 'bpmh',
			drugName: 'Metformin',
			form: 'Tablet',
			dose: '500 mg',
			route: 'oral',
			frequency: 'Twice daily',
			indication: 'Type 2 diabetes',
			highRiskClass: 'none',
			adherence: 'taking',
			sourceType: 'previous-discharge-summary',
			status: 'active'
		}
	];
	d.discrepancies = [];
	d.note.clinicalNote = 'Awaiting GP record and patient interview before sign-off.';
	return d;
}

/** Complete — an intensive-care transfer with insulin, all reconciled. */
function completeTransfer(): ReconciliationData {
	const d = createDefaultReconciliation();
	d.encounter = {
		reconciliationType: 'transfer',
		careSetting: 'critical-care',
		reconciledAt: '2026-06-25T14:30',
		clinicianName: 'Yusuf Ahmed',
		clinicianRole: 'prescriber'
	};
	d.identification = { patientIdentifier: 'MRN-204981', ageBand: 'adult', sex: 'male', weightKg: 74 };
	d.allergyReview.allergyStatus = 'documented';
	d.informationSources = [
		{ sourceType: 'gp-record', verified: 'yes' },
		{ sourceType: 'own-drugs-bag', verified: 'yes' },
		{ sourceType: 'care-home-mar', verified: 'yes' }
	];
	d.allergies = [{ substance: 'Sulfonamides', reactionType: 'allergy', severity: 'moderate' }];
	d.lineItems = [
		{
			listSource: 'bpmh',
			drugName: 'Insulin glargine',
			form: 'Injection',
			dose: '18 units',
			route: 'subcutaneous',
			frequency: 'At night',
			indication: 'Type 1 diabetes',
			highRiskClass: 'insulin',
			adherence: 'taking',
			sourceType: 'care-home-mar',
			status: 'active'
		},
		{
			listSource: 'inpatient',
			drugName: 'Insulin glargine',
			form: 'Injection',
			dose: '18 units',
			route: 'subcutaneous',
			frequency: 'At night',
			indication: 'Type 1 diabetes',
			highRiskClass: 'insulin',
			adherence: 'taking',
			sourceType: 'care-home-mar',
			status: 'active'
		},
		{
			listSource: 'inpatient',
			drugName: 'Atorvastatin',
			form: 'Tablet',
			dose: '40 mg',
			route: 'oral',
			frequency: 'At night',
			indication: 'Secondary prevention',
			highRiskClass: 'none',
			adherence: 'taking',
			sourceType: 'gp-record',
			status: 'active'
		}
	];
	d.discrepancies = [
		{
			discrepancyType: 'commission',
			bpmhItemRef: '',
			inpatientItemRef: 'Atorvastatin 40 mg',
			intendedAction: 'start',
			rationale: 'Started after acute coronary syndrome',
			intentional: 'yes'
		}
	];
	d.note.clinicalNote = 'Transfer reconciliation complete; insulin dose confirmed with the unit.';
	return d;
}

/** The sample reconciliations, keyed by stable id (used to seed the wizard). */
export const sampleReconciliations: SampleReconciliation[] = [
	{ id: 'MR-2026-0001', patientName: 'Okafor, Beatrice', reconciledDate: '2026-06-22', data: complete() },
	{
		id: 'MR-2026-0002',
		patientName: 'Whitfield, Harold',
		reconciledDate: '2026-06-23',
		data: discrepanciesOutstanding()
	},
	{ id: 'MR-2026-0003', patientName: 'Nowak, Irena', reconciledDate: '2026-06-24', data: incomplete() },
	{ id: 'MR-2026-0004', patientName: 'Ahmed, Yusuf', reconciledDate: '2026-06-25', data: completeTransfer() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleReconciliationRows: DashboardRow[] = sampleReconciliations.map((s) => {
	const g = calculateReconciliation(s.data);
	const flags = detectFlaggedIssues(s.data, g).length;
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		reconciledDate: s.reconciledDate,
		reconciliationType: s.data.encounter.reconciliationType,
		careSetting: s.data.encounter.careSetting,
		sourceCount: g.sourceCount,
		discrepancyCount: g.discrepancyCount,
		unintentionalCount: g.unintentionalCount,
		status: g.status,
		flagCount: flags
	};
});
