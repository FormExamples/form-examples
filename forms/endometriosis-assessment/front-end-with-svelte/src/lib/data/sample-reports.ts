import type { AssessmentData, ASRMStage, SeverityLevel } from '$lib/engine/types';
import { calculateEndoGrade } from '$lib/engine/endo-grader';
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
	asrmStage: ASRMStage | null;
	asrmPoints: number;
	ehp30Score: number | null;
	overallSeverity: SeverityLevel;
	infertilityFlag: boolean;
	highPriorityFlag: boolean;
	flagCount: number;
}

/** A mild assessment: minimal symptoms, regular cycles, no fertility concern. */
function mild(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Aisha', lastName: 'Khan', dateOfBirth: '1996-05-14', sex: 'female', weight: 62, height: 165, bmi: 22.8 };
	d.menstrualHistory = { ...d.menstrualHistory, ageAtMenarche: 13, cycleRegularity: 'regular', cycleLengthDays: 28, periodDurationDays: 5, flowHeaviness: 'moderate', dysmenorrhoeaSeverity: 'mild', daysOffWorkPerCycle: 0, currentContraception: 'combined-pill' };
	d.painAssessment = { ...d.painAssessment, hasPelvicPain: 'yes', pelvicPainSeverity: 3, pelvicPainCharacter: 'cramping', pelvicPainTiming: 'menstrual', dyspareunia: 'none' };
	d.qualityOfLife = { ...d.qualityOfLife, painDomainScore: 20, controlPowerlessnessScore: 15, emotionalWellbeingScore: 20, workImpact: 'mild' };
	return d;
}

/** A moderate assessment: moderate dysmenorrhoea, several days off work. */
function moderate(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Rosa', lastName: 'Martinez', dateOfBirth: '1990-11-02', sex: 'female', weight: 70, height: 160, bmi: 27.3 };
	d.menstrualHistory = { ...d.menstrualHistory, ageAtMenarche: 12, cycleRegularity: 'irregular', cycleLengthDays: 26, periodDurationDays: 7, flowHeaviness: 'heavy', clotsPresent: 'yes', dysmenorrhoeaSeverity: 'moderate', daysOffWorkPerCycle: 2, currentContraception: 'progesterone-only-pill' };
	d.painAssessment = { ...d.painAssessment, hasPelvicPain: 'yes', pelvicPainSeverity: 6, pelvicPainCharacter: 'aching', pelvicPainTiming: 'premenstrual', dyspareunia: 'superficial', dyspareuniaSeverity: 4 };
	d.gastrointestinalSymptoms = { ...d.gastrointestinalSymptoms, hasGiSymptoms: 'yes', bloating: 'yes', bloatingCyclical: 'yes' };
	d.previousTreatments = { ...d.previousTreatments, nsaidsTried: 'yes', nsaidsEffective: 'partially', combinedPillTried: 'yes', combinedPillEffective: 'ineffective', progesteroneTried: 'yes' };
	d.qualityOfLife = { ...d.qualityOfLife, painDomainScore: 55, controlPowerlessnessScore: 45, emotionalWellbeingScore: 50, sleepImpact: 'moderate', workImpact: 'moderate' };
	return d;
}

/** A severe assessment: severe dysmenorrhoea, deep dyspareunia, infertility, Stage III. */
function severe(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Hannah', lastName: 'Oduya', dateOfBirth: '1988-03-21', sex: 'female', weight: 66, height: 168, bmi: 23.4 };
	d.menstrualHistory = { ...d.menstrualHistory, ageAtMenarche: 11, cycleRegularity: 'regular', cycleLengthDays: 27, periodDurationDays: 7, flowHeaviness: 'very-heavy', clotsPresent: 'yes', dysmenorrhoeaSeverity: 'severe', daysOffWorkPerCycle: 4, currentContraception: 'mirena-ius' };
	d.painAssessment = { ...d.painAssessment, hasPelvicPain: 'yes', pelvicPainSeverity: 7, pelvicPainCharacter: 'stabbing', pelvicPainLocation: 'bilateral', pelvicPainTiming: 'menstrual', dyspareunia: 'deep', dyspareuniaSeverity: 7, dyschezia: 'yes', dyscheziaCyclical: 'yes' };
	d.gastrointestinalSymptoms = { ...d.gastrointestinalSymptoms, hasGiSymptoms: 'yes', bloating: 'yes', bloatingCyclical: 'yes', rectalBleeding: 'yes', rectalBleedingCyclical: 'yes' };
	d.fertilityAssessment = { ...d.fertilityAssessment, tryingToConceive: 'yes', durationTryingMonths: 18, previousPregnancies: 0, amhLevel: 8.2, futureFertilityConcerns: 'yes' };
	d.previousTreatments = { ...d.previousTreatments, nsaidsTried: 'yes', nsaidsEffective: 'ineffective', combinedPillTried: 'yes', combinedPillEffective: 'ineffective', progesteroneTried: 'yes', gnrhAgonistTried: 'yes', gnrhAgonistDurationMonths: 6 };
	d.surgicalHistory = { ...d.surgicalHistory, previousLaparoscopy: 'yes', numberOfLaparoscopies: 1, endometriosisConfirmedSurgically: 'yes', histologicalConfirmation: 'yes', asrmStageAtSurgery: 'III', sitesFound: 'Pouch of Douglas, uterosacral ligaments', excisionPerformed: 'yes', endometriomaDrained: 'yes' };
	d.qualityOfLife = { ...d.qualityOfLife, painDomainScore: 78, controlPowerlessnessScore: 70, emotionalWellbeingScore: 72, socialSupportScore: 60, sleepImpact: 'severe', mentalHealthImpact: 'severe', workImpact: 'severe' };
	return d;
}

/** A critical assessment: bowel obstruction, Stage IV, unable to work, current opioids. */
function critical(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Linda', lastName: 'Petrova', dateOfBirth: '1983-07-09', sex: 'female', weight: 58, height: 162, bmi: 22.1 };
	d.menstrualHistory = { ...d.menstrualHistory, ageAtMenarche: 12, cycleRegularity: 'irregular', cycleLengthDays: 24, periodDurationDays: 8, flowHeaviness: 'very-heavy', clotsPresent: 'yes', dysmenorrhoeaSeverity: 'severe', daysOffWorkPerCycle: 6, currentContraception: 'none' };
	d.painAssessment = { ...d.painAssessment, hasPelvicPain: 'yes', pelvicPainSeverity: 9, pelvicPainCharacter: 'shooting', pelvicPainLocation: 'diffuse', pelvicPainTiming: 'constant', dyspareunia: 'both', dyspareuniaSeverity: 8, dyschezia: 'yes', dyscheziaCyclical: 'yes', backPain: 'yes' };
	d.gastrointestinalSymptoms = { ...d.gastrointestinalSymptoms, hasGiSymptoms: 'yes', bloating: 'yes', bloatingCyclical: 'yes', constipation: 'yes', alternatingBowelHabit: 'yes', rectalBleeding: 'yes', rectalBleedingCyclical: 'yes', bowelObstructionSymptoms: 'yes' };
	d.urinarySymptoms = { ...d.urinarySymptoms, hasUrinarySymptoms: 'yes', frequency: 'yes', haematuria: 'yes', haematuriaCyclical: 'yes' };
	d.fertilityAssessment = { ...d.fertilityAssessment, tryingToConceive: 'yes', durationTryingMonths: 36, previousPregnancies: 1, ectopicPregnancies: 1, amhLevel: 3.1, futureFertilityConcerns: 'yes' };
	d.previousTreatments = { ...d.previousTreatments, nsaidsTried: 'yes', nsaidsEffective: 'ineffective', opioidsTried: 'yes', opioidsCurrent: 'yes', combinedPillTried: 'yes', combinedPillEffective: 'ineffective', progesteroneTried: 'yes', gnrhAgonistTried: 'yes', gnrhAgonistDurationMonths: 12, mirenaIusTried: 'yes' };
	d.surgicalHistory = { ...d.surgicalHistory, previousLaparoscopy: 'yes', numberOfLaparoscopies: 3, endometriosisConfirmedSurgically: 'yes', histologicalConfirmation: 'yes', asrmStageAtSurgery: 'IV', sitesFound: 'Rectovaginal septum, bowel, bladder', excisionPerformed: 'yes', bowelSurgery: 'yes', endometriomaDrained: 'yes' };
	d.qualityOfLife = { ...d.qualityOfLife, painDomainScore: 92, controlPowerlessnessScore: 88, emotionalWellbeingScore: 85, socialSupportScore: 75, selfImageScore: 80, sleepImpact: 'severe', mentalHealthImpact: 'severe', workImpact: 'unable-to-work' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'EA-2026-0001', patientName: 'Khan, Aisha', assessedDate: '2026-06-10', data: mild() },
	{ id: 'EA-2026-0002', patientName: 'Martinez, Rosa', assessedDate: '2026-06-12', data: moderate() },
	{ id: 'EA-2026-0003', patientName: 'Oduya, Hannah', assessedDate: '2026-06-15', data: severe() },
	{ id: 'EA-2026-0004', patientName: 'Petrova, Linda', assessedDate: '2026-06-18', data: critical() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateEndoGrade(s.data);
	const infertilityFlag =
		s.data.fertilityAssessment.tryingToConceive === 'yes' &&
		s.data.fertilityAssessment.durationTryingMonths !== null &&
		s.data.fertilityAssessment.durationTryingMonths > 12;
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		asrmStage: g.asrmStage,
		asrmPoints: g.asrmPoints,
		ehp30Score: g.ehp30Score,
		overallSeverity: g.overallSeverity,
		infertilityFlag,
		highPriorityFlag: g.additionalFlags.some((f) => f.priority === 'high'),
		flagCount: g.additionalFlags.length
	};
});
