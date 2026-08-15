import type { AssessmentData, Clearance } from '#lib/engine/types.js';
import { gradePPE } from '#lib/engine/ppe-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	athleteName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	athleteName: string;
	assessedDate: string;
	sport: string;
	contactLevel: string;
	clearance: Clearance;
	concussionFlag: boolean;
	redSFlag: boolean;
	flagCount: number;
}

/** A cleared athlete: low-contact sport, no concerns. */
function cleared(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Jane', lastName: 'Smith', dateOfBirth: '2002-04-12', sex: 'female', weight: 60, height: 168, bmi: 21.3 };
	d.sportPositionDetails = { ...d.sportPositionDetails, primarySport: 'Athletics', primaryPosition: 'Sprinter (100m)', contactLevel: 'low', competitiveLevel: 'club', hoursPerWeek: 10, previousClearanceIssue: 'no' };
	d.menstrualHistoryREDS = { ...d.menstrualHistoryREDS, applicable: true, regularPeriods: 'yes', amenorrhoeaSixMonths: 'no', restrictiveEatingPattern: 'no', stressFractureHistory: 'no', lowEnergyAvailabilityConcern: 'no' };
	d.musculoskeletalScreening = { ...d.musculoskeletalScreening, fullRangeOfMotion: 'yes', normalStrengthBilateral: 'yes' };
	d.neurologicalConcussionBaseline = { ...d.neurologicalConcussionBaseline, totalConcussions: 0 };
	return d;
}

/** Cleared with conditions: grade-2 findings (asthma + RED-S stress fracture). */
function conditional(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '2010-06-30', sex: 'female', weight: 48, height: 158, bmi: 19.2 };
	d.sportPositionDetails = { ...d.sportPositionDetails, primarySport: 'Gymnastics', primaryPosition: 'All-Around', contactLevel: 'moderate', competitiveLevel: 'elite', hoursPerWeek: 22, previousClearanceIssue: 'no' };
	d.medicalHistory = { ...d.medicalHistory, asthmaOrExerciseInducedBronchospasm: 'yes' };
	d.menstrualHistoryREDS = { ...d.menstrualHistoryREDS, applicable: true, regularPeriods: 'yes', amenorrhoeaSixMonths: 'no', restrictiveEatingPattern: 'no', stressFractureHistory: 'yes' };
	return d;
}

/** Pending further evaluation: grade-3 finding (recent concussion). */
function pending(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '2007-01-22', sex: 'female', weight: 64, height: 170, bmi: 22.1 };
	d.sportPositionDetails = { ...d.sportPositionDetails, primarySport: 'Football', primaryPosition: 'Midfielder', contactLevel: 'high', competitiveLevel: 'school', hoursPerWeek: 12, previousClearanceIssue: 'no' };
	d.neurologicalConcussionBaseline = { ...d.neurologicalConcussionBaseline, totalConcussions: 2, concussionLastSixMonths: 'yes', mostRecentConcussionDate: '2026-04-02', ongoingPostConcussiveSymptoms: 'no' };
	return d;
}

/** Not cleared for sport: grade-4 findings (post-concussive + family SCD). */
function notCleared(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '2004-11-03', sex: 'male', weight: 92, height: 184, bmi: 27.2 };
	d.sportPositionDetails = { ...d.sportPositionDetails, primarySport: 'Rugby', primaryPosition: 'Flanker', contactLevel: 'high', competitiveLevel: 'club', hoursPerWeek: 14, previousClearanceIssue: 'yes', previousClearanceDetails: 'Restricted last season after concussion' };
	d.familyHistory = { ...d.familyHistory, suddenCardiacDeathUnder50: 'yes', suddenCardiacDeathRelation: 'Father' };
	d.neurologicalConcussionBaseline = { ...d.neurologicalConcussionBaseline, totalConcussions: 4, concussionLastSixMonths: 'yes', mostRecentConcussionDate: '2026-05-20', ongoingPostConcussiveSymptoms: 'yes' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'SMA-2026-0001', athleteName: 'Smith, Jane', assessedDate: '2026-06-10', data: cleared() },
	{ id: 'SMA-2026-0002', athleteName: 'Patel, Priya', assessedDate: '2026-06-12', data: conditional() },
	{ id: 'SMA-2026-0003', athleteName: 'Jones, Margaret', assessedDate: '2026-06-15', data: pending() },
	{ id: 'SMA-2026-0004', athleteName: 'Williams, David', assessedDate: '2026-06-18', data: notCleared() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradePPE(s.data);
	return {
		id: s.id,
		athleteName: s.athleteName,
		assessedDate: s.assessedDate,
		sport: s.data.sportPositionDetails.primarySport,
		contactLevel: s.data.sportPositionDetails.contactLevel,
		clearance: g.clearance,
		concussionFlag:
			s.data.neurologicalConcussionBaseline.concussionLastSixMonths === 'yes' ||
			(s.data.neurologicalConcussionBaseline.totalConcussions ?? 0) >= 3,
		redSFlag: g.additionalFlags.some((f) => f.category === 'RED-S'),
		flagCount: g.additionalFlags.length
	};
});
