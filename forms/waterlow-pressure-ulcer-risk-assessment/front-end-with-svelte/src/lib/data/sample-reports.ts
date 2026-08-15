import type { AssessmentData, CareSetting, RiskBand } from '#lib/engine/types.js';
import { calculateWaterlowGrade } from '#lib/engine/waterlow-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

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
	waterlowScore: number;
	riskBand: RiskBand;
	existingDamage: boolean;
	flagCount: number;
}

/** Low band — total 2 (young, fully mobile, all categories at their lowest). */
function low(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		nurseName: 'RN A. Okafor',
		nurseRole: 'registered-nurse',
		assessedAt: '2026-06-10T08:15',
		careSetting: 'acute-ward',
		assessmentReason: 'admission'
	};
	d.identification = { patientIdentifier: 'ACU-2041', ageBand: '14-49', sex: 'male' };
	d.core = {
		buildWeightForHeight: 'average',
		skinType: 'healthy',
		continence: 'complete-catheterised',
		mobility: 'fully-mobile'
	};
	d.special = {
		tissueMalnutrition: 'none',
		neurologicalDeficit: 'none',
		majorSurgeryTrauma: 'none',
		medication: 'none',
		existingPressureDamage: 'no'
	};
	d.note.clinicalNote = 'Independently mobile; routine skin inspection and reassess on change.';
	return d;
}

/** At-risk band — total 11 (age 3 + sex 2 + build 1 + skin 1 + continence 1 + mobility 3). */
function atRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		nurseName: 'HCA P. Reyes',
		nurseRole: 'healthcare-assistant',
		assessedAt: '2026-06-12T14:40',
		careSetting: 'care-home',
		assessmentReason: 'routine'
	};
	d.identification = { patientIdentifier: 'CH-100482', ageBand: '65-74', sex: 'female' };
	d.core = {
		buildWeightForHeight: 'above-average',
		skinType: 'dry',
		continence: 'incontinent-urine',
		mobility: 'restricted'
	};
	d.special = {
		tissueMalnutrition: 'none',
		neurologicalDeficit: 'none',
		majorSurgeryTrauma: 'none',
		medication: 'none',
		existingPressureDamage: 'no'
	};
	d.note.clinicalNote = 'Foam mattress and cushion in place; repositioning schedule documented.';
	return d;
}

/** High band — total 17 (age 4 + sex 2 + build 3 + skin discoloured 2 + continence 2 + mobility 4). */
function high(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		nurseName: 'RN L. Osei',
		nurseRole: 'registered-nurse',
		assessedAt: '2026-06-15T22:05',
		careSetting: 'acute-ward',
		assessmentReason: 'change-in-condition'
	};
	d.identification = { patientIdentifier: 'ACU-100517', ageBand: '75-80', sex: 'female' };
	d.core = {
		buildWeightForHeight: 'below-average',
		skinType: 'discoloured',
		continence: 'incontinent-faeces',
		mobility: 'bedbound'
	};
	d.special = {
		tissueMalnutrition: 'none',
		neurologicalDeficit: 'none',
		majorSurgeryTrauma: 'none',
		medication: 'none',
		existingPressureDamage: 'no'
	};
	d.note.clinicalNote = 'Alternating-pressure surface requested; tissue-viability referral made.';
	return d;
}

/** Very-high band — total 29, existing damage, multiple special-risk groups. */
function veryHigh(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		nurseName: 'TVN M. Farah',
		nurseRole: 'tissue-viability',
		assessedAt: '2026-06-18T03:20',
		careSetting: 'hospice',
		assessmentReason: 'change-in-condition'
	};
	d.identification = { patientIdentifier: 'HOS-77-2211', ageBand: '81-plus', sex: 'female' };
	d.core = {
		buildWeightForHeight: 'below-average', // 3
		skinType: 'broken', // 3
		continence: 'doubly-incontinent', // 3
		mobility: 'chairbound' // 5
	};
	d.special = {
		tissueMalnutrition: 'multiple-organ-failure', // 8
		neurologicalDeficit: 'none',
		majorSurgeryTrauma: 'none',
		medication: 'high-dose-steroids-cytotoxics-anti-inflammatory', // 4
		existingPressureDamage: 'yes'
	};
	d.note.clinicalNote =
		'High-specification dynamic mattress; urgent tissue-viability review; existing category-3 ulcer being treated.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'WAT-2026-0001', patientName: 'Adeyemi, Grace', assessedDate: '2026-06-10', data: low() },
	{ id: 'WAT-2026-0002', patientName: 'Novak, Peter', assessedDate: '2026-06-12', data: atRisk() },
	{ id: 'WAT-2026-0003', patientName: 'Ferreira, Ana', assessedDate: '2026-06-15', data: high() },
	{
		id: 'WAT-2026-0004',
		patientName: 'Okonkwo, Daniel',
		assessedDate: '2026-06-18',
		data: veryHigh()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateWaterlowGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		waterlowScore: g.waterlowScore,
		riskBand: g.riskBand,
		existingDamage: g.flaggedIssues.some((f) => f.id === 'F-EXISTING-PRESSURE-DAMAGE-001'),
		flagCount: g.flaggedIssues.length
	};
});
