import type { AssessmentData, SeverityLevel } from '$lib/engine/types';
import { calculateAllergySeverity, calculateAllergyBurden } from '$lib/engine/allergy-grader';
import { detectAdditionalFlags } from '$lib/engine/flagged-issues';
import { countAllergens } from '$lib/engine/utils';
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
	patientName: string;
	assessedDate: string;
	severityLevel: SeverityLevel;
	allergenCount: number;
	burdenScore: number;
	anaphylaxisFlag: boolean;
	flagCount: number;
}

/** A low-burden assessment: a single mild environmental allergy. */
function mild(): AssessmentData {
	const a = createDefaultAssessment();
	a.demographics = { ...a.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1990-04-12', sex: 'male' };
	a.environmentalAllergies = { ...a.environmentalAllergies, pollenAllergy: 'yes', seasonalPattern: 'spring' };
	return a;
}

/** A moderate assessment: food + environmental allergies, no anaphylaxis. */
function moderate(): AssessmentData {
	const a = createDefaultAssessment();
	a.demographics = { ...a.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1985-09-30', sex: 'female' };
	a.foodAllergies = { ...a.foodAllergies, hasFoodAllergies: 'yes', foodAllergies: [{ allergen: 'Peanut', reactionType: 'Urticaria', severity: 'moderate', timing: '', alternativesTolerated: '' }], igeType: 'IgE-mediated' };
	a.environmentalAllergies = { ...a.environmentalAllergies, dustMiteAllergy: 'yes', animalDanderAllergy: 'yes' };
	a.comorbidities = { ...a.comorbidities, rhinitis: 'yes', rhinitisSeverity: 'moderate' };
	return a;
}

/** A high-burden assessment: multiple categories + anaphylaxis history. */
function severe(): AssessmentData {
	const a = createDefaultAssessment();
	a.demographics = { ...a.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1972-01-22', sex: 'female' };
	a.drugAllergies = { ...a.drugAllergies, hasDrugAllergies: 'yes', drugAllergies: [{ allergen: 'Penicillin', reactionType: 'Anaphylaxis', severity: 'severe', timing: '', alternativesTolerated: '' }] };
	a.foodAllergies = { ...a.foodAllergies, hasFoodAllergies: 'yes', foodAllergies: [{ allergen: 'Tree nut', reactionType: 'Anaphylaxis', severity: 'severe', timing: '', alternativesTolerated: '' }] };
	a.anaphylaxisHistory = { ...a.anaphylaxisHistory, hasAnaphylaxisHistory: 'yes', numberOfEpisodes: 2, adrenalineAutoInjectorPrescribed: 'yes', actionPlanInPlace: 'yes' };
	a.comorbidities = { ...a.comorbidities, asthma: 'yes', asthmaSeverity: 'moderate' };
	return a;
}

/** A critical assessment: anaphylaxis history without an action plan in place. */
function critical(): AssessmentData {
	const a = createDefaultAssessment();
	a.demographics = { ...a.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1968-11-03', sex: 'male' };
	a.drugAllergies = { ...a.drugAllergies, hasDrugAllergies: 'yes', drugAllergies: [{ allergen: 'NSAIDs', reactionType: 'Angioedema', severity: 'severe', timing: '', alternativesTolerated: '' }] };
	a.environmentalAllergies = { ...a.environmentalAllergies, insectStingAllergy: 'yes', insectStingSeverity: 'severe' };
	a.anaphylaxisHistory = { ...a.anaphylaxisHistory, hasAnaphylaxisHistory: 'yes', numberOfEpisodes: 4, adrenalineAutoInjectorPrescribed: 'no', actionPlanInPlace: 'no' };
	a.comorbidities = { ...a.comorbidities, asthma: 'yes', asthmaSeverity: 'severe', mastCellDisorders: 'yes' };
	return a;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'AA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: mild() },
	{ id: 'AA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: moderate() },
	{ id: 'AA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: severe() },
	{ id: 'AA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: critical() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { severityLevel } = calculateAllergySeverity(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		severityLevel,
		allergenCount: countAllergens(s.data),
		burdenScore: calculateAllergyBurden(s.data),
		anaphylaxisFlag: s.data.anaphylaxisHistory.hasAnaphylaxisHistory === 'yes',
		flagCount: detectAdditionalFlags(s.data).length
	};
});
