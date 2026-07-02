import type { AssessmentData, CareSetting, TwoLevelBand } from '$lib/engine/types';
import { calculateWellsGrade } from '$lib/engine/wells-pe-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	assessedDate: string;
	careSetting: CareSetting;
	wellsScore: number;
	twoLevelBand: TwoLevelBand;
	likelyFlag: boolean;
	flagCount: number;
}

/** Score 0 — all criteria negative, normal heart rate; PE unlikely (D-dimer). */
function scoreUnlikelyNegative(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-10T08:15',
		careSetting: 'ambulatory'
	};
	d.identification = { patientIdentifier: 'AMB-2041', ageBand: '40-64', sex: 'female' };
	d.haemodynamic = { haemodynamicStatus: 'stable' };
	d.criteria = {
		dvtSigns: 'no',
		peMostLikely: 'no',
		immobilisationSurgery: 'no',
		previousDvtPe: 'no',
		haemoptysis: 'no',
		malignancy: 'no'
	};
	d.observations = { heartRate: 78 };
	d.note.clinicalNotes = 'Pleuritic chest pain; PE unlikely on gestalt. D-dimer requested.';
	return d;
}

/** Score 4 — tachycardia, prior VTE and haemoptysis; boundary PE unlikely (<= 4). */
function scoreUnlikelyBoundary(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'NP P. Reyes',
		clinicianRole: 'nurse-practitioner',
		assessedAt: '2026-06-12T14:40',
		careSetting: 'emergency-department'
	};
	d.identification = { patientIdentifier: 'ED-100482', ageBand: '65-74', sex: 'male' };
	d.haemodynamic = { haemodynamicStatus: 'stable' };
	d.criteria = {
		dvtSigns: 'no',
		peMostLikely: 'no',
		immobilisationSurgery: 'no',
		previousDvtPe: 'yes', // +1.5
		haemoptysis: 'yes', // +1
		malignancy: 'no'
	};
	d.observations = { heartRate: 108 }; // +1.5 → total 4.0
	d.note.clinicalNotes = 'Wells 4.0 — PE unlikely; D-dimer pending, PERC not applicable.';
	return d;
}

/** Score 6 — DVT signs, tachycardia, immobilisation; PE likely (CTPA). */
function scoreLikely(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr L. Osei',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-15T22:05',
		careSetting: 'emergency-department'
	};
	d.identification = { patientIdentifier: 'ED-100517', ageBand: '75-84', sex: 'female' };
	d.haemodynamic = { haemodynamicStatus: 'stable' };
	d.criteria = {
		dvtSigns: 'yes', // +3
		peMostLikely: 'no',
		immobilisationSurgery: 'yes', // +1.5
		previousDvtPe: 'no',
		haemoptysis: 'no',
		malignancy: 'no'
	};
	d.observations = { heartRate: 112 }; // +1.5 → total 6.0
	d.note.clinicalNotes = 'Wells 6.0 — PE likely; immediate CTPA requested.';
	return d;
}

/** Score 10.5 — high probability, haemodynamically unstable; PE likely (CTPA). */
function scoreLikelyHighUnstable(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'PA S. Doyle',
		clinicianRole: 'physician-associate',
		assessedAt: '2026-06-18T03:20',
		careSetting: 'acute-medical-unit'
	};
	d.identification = { patientIdentifier: 'AMU-77-2211', ageBand: '85-plus', sex: 'male' };
	d.haemodynamic = { haemodynamicStatus: 'unstable' };
	d.criteria = {
		dvtSigns: 'yes', // +3
		peMostLikely: 'yes', // +3
		immobilisationSurgery: 'yes', // +1.5
		previousDvtPe: 'no',
		haemoptysis: 'yes', // +1
		malignancy: 'yes' // +1
	};
	d.observations = { heartRate: 128 }; // +1.5 → total 11.0
	d.note.clinicalNotes = 'Suspected massive PE; resuscitation and immediate imaging under way.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'WP-2026-0001',
		patientName: 'Adeyemi, Grace',
		assessedDate: '2026-06-10',
		data: scoreUnlikelyNegative()
	},
	{
		id: 'WP-2026-0002',
		patientName: 'Novak, Peter',
		assessedDate: '2026-06-12',
		data: scoreUnlikelyBoundary()
	},
	{
		id: 'WP-2026-0003',
		patientName: 'Ferreira, Ana',
		assessedDate: '2026-06-15',
		data: scoreLikely()
	},
	{
		id: 'WP-2026-0004',
		patientName: 'Okonkwo, Daniel',
		assessedDate: '2026-06-18',
		data: scoreLikelyHighUnstable()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateWellsGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		wellsScore: g.wellsScore,
		twoLevelBand: g.twoLevelBand,
		likelyFlag: g.twoLevelBand === 'likely',
		flagCount: g.flaggedIssues.length
	};
});
