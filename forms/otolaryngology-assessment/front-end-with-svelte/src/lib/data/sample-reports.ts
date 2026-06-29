import type { AssessmentData, SeverityLevel } from '$lib/engine/types';
import { calculateSnot22 } from '$lib/engine/snot22-grader';
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
	totalScore: number;
	severity: SeverityLevel;
	answeredCount: number;
	redFlag: boolean;
	flagCount: number;
}

/** A mild assessment: low SNOT-22 burden, unremarkable examination. */
function mild(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'John', lastName: 'Smith', dateOfBirth: '1986-04-12', sex: 'male', occupation: 'Teacher' };
	d.presentingComplaint = { earSymptoms: 'no', noseSymptoms: 'yes', throatSymptoms: 'no', neckSymptoms: 'no', chiefComplaint: 'Occasional nasal stuffiness in spring.' };
	d.historyOfPresentIllness = { ...d.historyOfPresentIllness, onsetType: 'gradual', progression: 'stable', laterality: 'both', previousEpisodes: 'yes' };
	d.pastEntHistory = { ...d.pastEntHistory, allergicRhinitis: 'yes' };
	d.snot22 = { ...d.snot22, needToBlowNose: 1, sneezing: 1, runnyNose: 1, nasalBlockage: 1, lossOfSmellTaste: 0, coughing: 0, postNasalDischarge: 1 };
	d.anteriorRhinoscopy.right = { septum: 'midline', mucosa: 'pale', polyps: 'none', discharge: 'clear', turbinateHypertrophy: 'mild' };
	d.anteriorRhinoscopy.left = { septum: 'midline', mucosa: 'pale', polyps: 'none', discharge: 'clear', turbinateHypertrophy: 'mild' };
	d.clinicalImpressionPlan = { ...d.clinicalImpressionPlan, workingDiagnosis: 'Allergic rhinitis', medicationPrescribed: 'yes', medicationDetails: 'Intranasal corticosteroid spray.' };
	return d;
}

/** A moderate assessment: middling SNOT-22 burden, effusion. */
function moderate(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1972-09-30', sex: 'female', occupation: 'Accountant' };
	d.presentingComplaint = { earSymptoms: 'yes', noseSymptoms: 'yes', throatSymptoms: 'no', neckSymptoms: 'no', chiefComplaint: 'Blocked nose and right-ear fullness for two months.' };
	d.historyOfPresentIllness = { ...d.historyOfPresentIllness, onsetType: 'gradual', progression: 'worsening', laterality: 'right', previousEpisodes: 'no' };
	d.pastEntHistory = { ...d.pastEntHistory, chronicSinusitis: 'yes', allergicRhinitis: 'yes' };
	d.snot22 = { ...d.snot22, needToBlowNose: 3, sneezing: 2, runnyNose: 2, nasalBlockage: 3, lossOfSmellTaste: 1, postNasalDischarge: 2, earFullness: 2, facialPainPressure: 1 };
	d.otoscopy.right = { tympanicMembrane: 'effusion', canal: 'normal', mobility: 'no' };
	d.anteriorRhinoscopy.right = { septum: 'deviated-right', mucosa: 'congested', polyps: 'small', discharge: 'mucoid', turbinateHypertrophy: 'moderate' };
	d.clinicalImpressionPlan = { ...d.clinicalImpressionPlan, workingDiagnosis: 'Chronic rhinosinusitis with otitis media with effusion', investigationsRequired: 'yes', investigationsDetails: 'Tympanometry; consider CT sinuses.' };
	return d;
}

/** A severe assessment: high SNOT-22 burden, smoking, large polyps. */
function severe(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1958-01-22', sex: 'female', occupation: 'Retired' };
	d.presentingComplaint = { earSymptoms: 'no', noseSymptoms: 'yes', throatSymptoms: 'yes', neckSymptoms: 'no', chiefComplaint: 'Severe nasal obstruction and complete loss of smell.' };
	d.historyOfPresentIllness = { ...d.historyOfPresentIllness, onsetType: 'gradual', progression: 'worsening', laterality: 'both', previousEpisodes: 'yes' };
	d.pastEntHistory = { ...d.pastEntHistory, chronicSinusitis: 'yes', allergicRhinitis: 'yes', smoking: 'yes' };
	d.snot22 = { needToBlowNose: 4, sneezing: 3, runnyNose: 4, nasalBlockage: 5, lossOfSmellTaste: 5, coughing: 2, postNasalDischarge: 4, thickNasalDischarge: 4, earFullness: 2, dizziness: 1, earPain: 0, facialPainPressure: 4, difficultyFallingAsleep: 3, wakingUpAtNight: 3, lackOfGoodNightsSleep: 3, wakingUpTired: 3, fatigue: 4, reducedProductivity: 3, reducedConcentration: 3, frustratedRestlessIrritable: 3, sad: 2, embarrassed: 2 };
	d.anteriorRhinoscopy.right = { septum: 'midline', mucosa: 'pale-boggy', polyps: 'large', discharge: 'purulent', turbinateHypertrophy: 'severe' };
	d.anteriorRhinoscopy.left = { septum: 'midline', mucosa: 'pale-boggy', polyps: 'medium', discharge: 'mucoid', turbinateHypertrophy: 'severe' };
	d.clinicalImpressionPlan = { ...d.clinicalImpressionPlan, workingDiagnosis: 'Chronic rhinosinusitis with nasal polyps', surgeryConsidered: 'yes', surgeryDetails: 'Functional endoscopic sinus surgery if medical therapy fails.', referralRequired: 'yes', referralDetails: 'Rhinology clinic.' };
	return d;
}

/** A severe assessment with an urgent red flag: neck mass + sudden hearing loss. */
function urgent(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'David', lastName: 'Williams', dateOfBirth: '1955-11-03', sex: 'male', occupation: 'Former welder' };
	d.presentingComplaint = { earSymptoms: 'yes', noseSymptoms: 'no', throatSymptoms: 'yes', neckSymptoms: 'yes', chiefComplaint: 'Left neck lump and sudden hearing loss with hoarse voice.' };
	d.historyOfPresentIllness = { ...d.historyOfPresentIllness, onsetType: 'sudden', progression: 'worsening', laterality: 'left', previousEpisodes: 'no' };
	d.pastEntHistory = { ...d.pastEntHistory, hearingLoss: 'yes', tinnitus: 'yes', headNeckRadiotherapy: 'no', smoking: 'yes', alcohol: 'yes' };
	d.snot22 = { ...d.snot22, nasalBlockage: 2, earFullness: 4, earPain: 3, fatigue: 4, reducedConcentration: 3, sad: 3, lossOfSmellTaste: 1, postNasalDischarge: 2, dizziness: 2 };
	d.externalExamination = { ...d.externalExamination, facialAsymmetry: 'no', skinLesions: 'no', examinationNotes: 'Hoarse voice noted.' };
	d.oropharyngealNeckExamination = { ...d.oropharyngealNeckExamination, oralMucosa: 'normal', tonsils: 'asymmetric', cervicalLymphadenopathy: 'yes', cervicalLymphadenopathyDetails: 'Left level II node, firm, 3 cm.', neckMass: 'yes', neckMassDetails: 'Left anterior triangle, fixed.' };
	d.clinicalImpressionPlan = { ...d.clinicalImpressionPlan, workingDiagnosis: 'Suspected head and neck malignancy', differentialDiagnosis: 'Reactive lymphadenopathy', referralRequired: 'yes', referralDetails: '2-week-wait head & neck cancer pathway.', investigationsRequired: 'yes', investigationsDetails: 'Urgent USS-guided FNA and cross-sectional imaging.' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'OA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: mild() },
	{ id: 'OA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: moderate() },
	{ id: 'OA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: severe() },
	{ id: 'OA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: urgent() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateSnot22(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		totalScore: g.totalScore,
		severity: g.severityLevel,
		answeredCount: g.answeredCount,
		redFlag: g.additionalFlags.some((f) => f.priority === 'urgent' || f.priority === 'high'),
		flagCount: g.additionalFlags.length
	};
});
