import type { AssessmentData, CareSetting, TwoLevelBand } from '#lib/engine/types.js';
import { calculateWellsGrade } from '#lib/engine/wells-dvt-grader.js';
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
	wellsScore: number;
	twoLevelBand: TwoLevelBand;
	likelyFlag: boolean;
	flagCount: number;
}

/** Score −1 — one criterion offset by the alternative-diagnosis adjustment; DVT unlikely. */
function scoreUnlikelyNegative(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-10T08:15',
		careSetting: 'dvt-clinic'
	};
	d.identification = {
		patientIdentifier: 'DVT-2041',
		ageBand: '40-64',
		sex: 'female',
		symptomaticLeg: 'left'
	};
	d.predisposing = {
		activeCancer: 'no',
		paralysisOrImmobilisation: 'no',
		recentlyBedriddenOrSurgery: 'no',
		previouslyDocumentedDvt: 'no'
	};
	d.examination = {
		localisedTenderness: 'yes',
		entireLegSwollen: 'no',
		calfSwellingOver3cm: 'no',
		pittingOedema: 'no',
		collateralSuperficialVeins: 'no'
	};
	d.alternative = { alternativeDiagnosisAsLikely: 'yes' };
	d.note.clinicalNotes = 'Ruptured Baker cyst at least as likely; D-dimer requested.';
	return d;
}

/** Score 1 — single positive criterion; DVT unlikely (D-dimer pathway). */
function scoreUnlikelyBoundary(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'NP P. Reyes',
		clinicianRole: 'nurse-practitioner',
		assessedAt: '2026-06-12T14:40',
		careSetting: 'ambulatory'
	};
	d.identification = {
		patientIdentifier: 'AMB-100482',
		ageBand: '65-74',
		sex: 'male',
		symptomaticLeg: 'right'
	};
	d.predisposing = {
		activeCancer: 'no',
		paralysisOrImmobilisation: 'no',
		recentlyBedriddenOrSurgery: 'no',
		previouslyDocumentedDvt: 'no'
	};
	d.examination = {
		localisedTenderness: 'yes',
		entireLegSwollen: 'no',
		calfSwellingOver3cm: 'no',
		pittingOedema: 'no',
		collateralSuperficialVeins: 'no'
	};
	d.alternative = { alternativeDiagnosisAsLikely: 'no' };
	d.note.clinicalNotes = 'Localised tenderness only; D-dimer pending.';
	return d;
}

/** Score 3 — three positive criteria; DVT likely (ultrasound pathway). */
function scoreLikely(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr L. Osei',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-15T22:05',
		careSetting: 'emergency-department'
	};
	d.identification = {
		patientIdentifier: 'ED-100517',
		ageBand: '75-84',
		sex: 'female',
		symptomaticLeg: 'left'
	};
	d.predisposing = {
		activeCancer: 'no',
		paralysisOrImmobilisation: 'no',
		recentlyBedriddenOrSurgery: 'yes',
		previouslyDocumentedDvt: 'no'
	};
	d.examination = {
		localisedTenderness: 'yes',
		entireLegSwollen: 'yes',
		calfSwellingOver3cm: 'no',
		pittingOedema: 'no',
		collateralSuperficialVeins: 'no'
	};
	d.alternative = { alternativeDiagnosisAsLikely: 'no' };
	d.note.clinicalNotes = 'DVT likely; proximal leg vein ultrasound requested within 4 hours.';
	return d;
}

/** Score 6 — high probability with active cancer and prior DVT; DVT likely. */
function scoreLikelyHigh(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'PA S. Doyle',
		clinicianRole: 'physician-associate',
		assessedAt: '2026-06-18T03:20',
		careSetting: 'acute-medical-unit'
	};
	d.identification = {
		patientIdentifier: 'AMU-77-2211',
		ageBand: '85-plus',
		sex: 'male',
		symptomaticLeg: 'right'
	};
	d.predisposing = {
		activeCancer: 'yes',
		paralysisOrImmobilisation: 'no',
		recentlyBedriddenOrSurgery: 'yes',
		previouslyDocumentedDvt: 'yes'
	};
	d.examination = {
		localisedTenderness: 'yes',
		entireLegSwollen: 'yes',
		calfSwellingOver3cm: 'yes',
		pittingOedema: 'no',
		collateralSuperficialVeins: 'no'
	};
	d.alternative = { alternativeDiagnosisAsLikely: 'no' };
	d.note.clinicalNotes = 'High probability; scanned and anticoagulation started.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'WD-2026-0001',
		patientName: 'Adeyemi, Grace',
		assessedDate: '2026-06-10',
		data: scoreUnlikelyNegative()
	},
	{
		id: 'WD-2026-0002',
		patientName: 'Novak, Peter',
		assessedDate: '2026-06-12',
		data: scoreUnlikelyBoundary()
	},
	{
		id: 'WD-2026-0003',
		patientName: 'Ferreira, Ana',
		assessedDate: '2026-06-15',
		data: scoreLikely()
	},
	{
		id: 'WD-2026-0004',
		patientName: 'Okonkwo, Daniel',
		assessedDate: '2026-06-18',
		data: scoreLikelyHigh()
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
