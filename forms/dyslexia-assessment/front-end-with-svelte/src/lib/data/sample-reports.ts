import type { AssessmentData, Severity } from '#lib/engine/types.js';
import { gradeDyslexia } from '#lib/engine/dyslexia-grader.js';
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
	lowestScore: number | null;
	severity: Severity;
	familyHistoryFlag: boolean;
	flagCount: number;
}

/** No dyslexia: all standardised scores within normal limits. */
function noDyslexia(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Jane', lastName: 'Smith', dateOfBirth: '2013-04-12', sex: 'female', ageYears: 13, handedness: 'right', referralSource: 'School SENCO' };
	d.readingAssessment = { ...d.readingAssessment, readingFluencyScore: 108, readingComprehensionScore: 104 };
	d.writingSpelling = { ...d.writingSpelling, spellingAccuracyScore: 102, writtenExpressionScore: 99 };
	d.phonologicalProcessing = { ...d.phonologicalProcessing, phonologicalAwarenessScore: 106, phonologicalMemoryScore: 101, rapidNamingScore: 98 };
	d.workingMemoryProcessingSpeed = { ...d.workingMemoryProcessingSpeed, workingMemoryScore: 100, processingSpeedScore: 103 };
	d.educationalBackground = { ...d.educationalBackground, previousAssessments: 'no' };
	d.previousSupport = { ...d.previousSupport, previousIntervention: 'no' };
	return d;
}

/** Mild dyslexia: borderline below-average scores, some difficulties, family history. */
function mildDyslexia(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '2014-09-30', sex: 'female', ageYears: 11, handedness: 'left', referralSource: 'GP' };
	d.developmentalHistory = { ...d.developmentalHistory, speechDelay: 'yes', familyHistoryDyslexia: 'yes' };
	d.readingAssessment = { ...d.readingAssessment, readingFluencyScore: 82, readingComprehensionScore: 86, difficultyDecoding: 'yes', slowReadingSpeed: 'yes' };
	d.writingSpelling = { ...d.writingSpelling, spellingAccuracyScore: 80, writtenExpressionScore: 84, difficultySpelling: 'yes' };
	d.phonologicalProcessing = { ...d.phonologicalProcessing, phonologicalAwarenessScore: 83, phonologicalMemoryScore: 88, rapidNamingScore: 85 };
	d.workingMemoryProcessingSpeed = { ...d.workingMemoryProcessingSpeed, workingMemoryScore: 90, processingSpeedScore: 87 };
	return d;
}

/** Moderate dyslexia: well-below-average scores, consistent pattern of difficulty. */
function moderateDyslexia(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '2015-01-22', sex: 'female', ageYears: 10, handedness: 'right', referralSource: 'Parent' };
	d.developmentalHistory = { ...d.developmentalHistory, languageDelay: 'yes', familyHistoryDyslexia: 'yes' };
	d.readingAssessment = { ...d.readingAssessment, readingFluencyScore: 64, readingComprehensionScore: 68, difficultyDecoding: 'yes', avoidsReading: 'yes', slowReadingSpeed: 'yes', losesPlaceWhenReading: 'yes' };
	d.writingSpelling = { ...d.writingSpelling, spellingAccuracyScore: 62, writtenExpressionScore: 66, difficultySpelling: 'yes', omitsLettersOrWords: 'yes', reversesLettersOrNumbers: 'yes' };
	d.phonologicalProcessing = { ...d.phonologicalProcessing, phonologicalAwarenessScore: 60, phonologicalMemoryScore: 67, rapidNamingScore: 65, difficultyRhyming: 'yes', difficultyBlendingSounds: 'yes' };
	d.workingMemoryProcessingSpeed = { ...d.workingMemoryProcessingSpeed, workingMemoryScore: 72, processingSpeedScore: 70 };
	d.emotionalBehavioural = { ...d.emotionalBehavioural, lowSelfEsteem: 'yes', anxietyAboutSchool: 'yes' };
	return d;
}

/** Severe dyslexia: significantly below average, pervasive impact, hearing concern. */
function severeDyslexia(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '2016-11-03', sex: 'male', ageYears: 9, handedness: 'right', referralSource: 'Educational psychologist' };
	d.developmentalHistory = { ...d.developmentalHistory, speechDelay: 'yes', hearingProblems: 'yes', familyHistoryDyslexia: 'yes' };
	d.educationalBackground = { ...d.educationalBackground, eslLearner: 'yes', attendanceIssues: 'yes', schoolChanges: 'yes', schoolChangeCount: 4 };
	d.readingAssessment = { ...d.readingAssessment, readingFluencyScore: 48, readingComprehensionScore: 52, difficultyDecoding: 'yes', difficultyComprehension: 'yes', avoidsReading: 'yes', slowReadingSpeed: 'yes', losesPlaceWhenReading: 'yes' };
	d.writingSpelling = { ...d.writingSpelling, spellingAccuracyScore: 46, writtenExpressionScore: 50, difficultySpelling: 'yes', difficultyHandwriting: 'yes', difficultyOrganisingIdeas: 'yes', omitsLettersOrWords: 'yes', reversesLettersOrNumbers: 'yes' };
	d.phonologicalProcessing = { ...d.phonologicalProcessing, phonologicalAwarenessScore: 45, phonologicalMemoryScore: 53, rapidNamingScore: 49, difficultyRhyming: 'yes', difficultySegmentingSounds: 'yes', difficultyBlendingSounds: 'yes', difficultyLearningLetterSounds: 'yes' };
	d.workingMemoryProcessingSpeed = { ...d.workingMemoryProcessingSpeed, workingMemoryScore: 58, processingSpeedScore: 55 };
	d.emotionalBehavioural = { ...d.emotionalBehavioural, lowSelfEsteem: 'yes', anxietyAboutSchool: 'yes', avoidanceBehaviour: 'yes', mentalHealthConcerns: 'yes' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'DA-2026-0001', patientName: 'Smith, Jane', assessedDate: '2026-06-10', data: noDyslexia() },
	{ id: 'DA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: mildDyslexia() },
	{ id: 'DA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: moderateDyslexia() },
	{ id: 'DA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: severeDyslexia() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeDyslexia(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		lowestScore: g.lowestScore,
		severity: g.overallSeverity,
		familyHistoryFlag: s.data.developmentalHistory.familyHistoryDyslexia === 'yes',
		flagCount: g.additionalFlags.length
	};
});
