import type { AssessmentData, SeverityLevel } from '#lib/engine/types.js';
import { calculateGISeverity } from '#lib/engine/gi-grader.js';
import { detectAdditionalFlags } from '#lib/engine/flagged-issues.js';
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
	patientName: string;
	assessedDate: string;
	primarySymptom: string;
	severityScore: number;
	severityLevel: SeverityLevel;
	redFlagCount: number;
	bleedingFlag: boolean;
	weightLossFlag: boolean;
}

/** A minimal assessment: occasional heartburn, no red flags. */
function minimal(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1979-04-12', sex: 'male', weight: 80, height: 180, bmi: 24.7 };
	d.chiefComplaint = { ...d.chiefComplaint, primarySymptom: 'Occasional heartburn', symptomLocation: 'epigastric', symptomDuration: '3 months', severityScore: 2 };
	d.upperGISymptoms = { ...d.upperGISymptoms, heartburn: 'yes', heartburnFrequency: 'occasional' };
	d.redFlagsSocial = { ...d.redFlagsSocial, unexplainedWeightLoss: 'no', familyGICancer: 'no', smoking: 'never', alcoholUse: 'occasional' };
	return d;
}

/** A mild assessment: chronic diarrhoea, change in bowel habit, NSAID use. */
function mild(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1968-09-30', sex: 'female', weight: 64, height: 162, bmi: 24.4 };
	d.chiefComplaint = { ...d.chiefComplaint, primarySymptom: 'Chronic diarrhoea', symptomLocation: 'periumbilical', symptomDuration: '6 weeks', severityScore: 4 };
	d.upperGISymptoms = { ...d.upperGISymptoms, nausea: 'yes', heartburn: 'yes' };
	d.lowerGISymptoms = { ...d.lowerGISymptoms, bowelHabitChange: 'yes', bowelHabitDetails: 'Looser, more frequent', diarrhoea: 'yes', diarrhoeaFrequency: '4-5 per day', bristolStoolType: '6' };
	d.abdominalPainAssessment = { ...d.abdominalPainAssessment, painLocation: 'periumbilical', painCharacter: 'cramping', painFrequency: 'intermittent' };
	d.currentMedications = { ...d.currentMedications, nsaids: 'yes', nsaidDetails: 'Ibuprofen PRN' };
	d.redFlagsSocial = { ...d.redFlagsSocial, smoking: 'ex', alcoholUse: 'moderate' };
	return d;
}

/** A severe assessment: rectal bleeding, weight loss, IBD, family GI cancer. */
function severe(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1955-01-22', sex: 'female', weight: 58, height: 160, bmi: 22.7 };
	d.chiefComplaint = { ...d.chiefComplaint, primarySymptom: 'Rectal bleeding with weight loss', symptomLocation: 'left-lower-quadrant', symptomDuration: '2 months', severityScore: 8 };
	d.upperGISymptoms = { ...d.upperGISymptoms, nausea: 'yes', earlySatiety: 'yes' };
	d.lowerGISymptoms = { ...d.lowerGISymptoms, bowelHabitChange: 'yes', diarrhoea: 'yes', diarrhoeaFrequency: '6+ per day', rectalBleeding: 'yes', rectalBleedingDetails: 'Fresh blood mixed with stool', tenesmus: 'yes', bristolStoolType: '7' };
	d.abdominalPainAssessment = { ...d.abdominalPainAssessment, painLocation: 'left-lower-quadrant', painCharacter: 'cramping', painFrequency: 'constant' };
	d.previousGIHistory = { ...d.previousGIHistory, ibd: 'yes', ibdType: 'ulcerative-colitis' };
	d.currentMedications = { ...d.currentMedications, biologics: 'yes', biologicDetails: 'Infliximab', steroids: 'yes', steroidDetails: 'Prednisolone 20 mg' };
	d.redFlagsSocial = { ...d.redFlagsSocial, unexplainedWeightLoss: 'yes', weightLossAmount: '6 kg over 2 months', appetiteChange: 'yes', familyGICancer: 'yes', familyCancerDetails: 'Mother — colorectal cancer', smoking: 'ex', alcoholUse: 'occasional' };
	return d;
}

/** A very-severe assessment: dysphagia, jaundice, obstructive pattern, GI cancer history. */
function verySevere(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1950-11-03', sex: 'male', weight: 66, height: 178, bmi: 20.8 };
	d.chiefComplaint = { ...d.chiefComplaint, primarySymptom: 'Dysphagia with jaundice', symptomLocation: 'epigastric', symptomDuration: '3 weeks', severityScore: 9 };
	d.upperGISymptoms = { ...d.upperGISymptoms, dysphagia: 'yes', dysphagiaDetails: 'Progressive, solids then liquids', odynophagia: 'yes', heartburn: 'yes', nausea: 'yes', vomiting: 'yes', vomitingDetails: 'After meals', earlySatiety: 'yes' };
	d.lowerGISymptoms = { ...d.lowerGISymptoms, bowelHabitChange: 'yes', rectalBleeding: 'yes', rectalBleedingDetails: 'Melaena', bristolStoolType: '1' };
	d.abdominalPainAssessment = { ...d.abdominalPainAssessment, painLocation: 'epigastric', painCharacter: 'burning', painFrequency: 'constant' };
	d.liverPancreas = { ...d.liverPancreas, jaundice: 'yes', darkUrine: 'yes', paleStools: 'yes', alcoholIntake: 'heavy', alcoholUnitsPerWeek: 40, hepatitisExposure: 'yes', hepatitisDetails: 'Hepatitis C, treated' };
	d.previousGIHistory = { ...d.previousGIHistory, previousEndoscopy: 'yes', giCancer: 'yes', giCancerDetails: 'Gastric cancer 2018' };
	d.currentMedications = { ...d.currentMedications, ppis: 'yes', ppiDetails: 'Omeprazole 40 mg', nsaids: 'yes', nsaidDetails: 'Naproxen' };
	d.allergiesDiet = { ...d.allergiesDiet, drugAllergies: [{ allergen: 'Penicillin', reaction: 'Anaphylaxis', severity: 'severe' }] };
	d.redFlagsSocial = { ...d.redFlagsSocial, unexplainedWeightLoss: 'yes', weightLossAmount: '12 kg over 3 months', appetiteChange: 'yes', familyGICancer: 'yes', familyCancerDetails: 'Father — oesophageal cancer', smoking: 'current', smokingPackYears: 45, alcoholUse: 'heavy' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'GA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: minimal() },
	{ id: 'GA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: mild() },
	{ id: 'GA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: severe() },
	{ id: 'GA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: verySevere() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateGISeverity(s.data);
	const flags = detectAdditionalFlags(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		primarySymptom: s.data.chiefComplaint.primarySymptom,
		severityScore: g.severityScore,
		severityLevel: g.severityLevel,
		redFlagCount: flags.length,
		bleedingFlag: s.data.lowerGISymptoms.rectalBleeding === 'yes',
		weightLossFlag: s.data.redFlagsSocial.unexplainedWeightLoss === 'yes'
	};
});
