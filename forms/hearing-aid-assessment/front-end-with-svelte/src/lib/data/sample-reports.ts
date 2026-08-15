import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { calculateHHIES } from '#lib/engine/hhies-grader.js';
import { detectAdditionalFlags } from '#lib/engine/flagged-issues.js';
import { hearingLossGrade } from '#lib/engine/utils.js';
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
	hhiesScore: number;
	hhiesCategory: string;
	hearingLossGrade: string;
	currentAids: boolean;
	flagCount: number;
}

/**
 * Run the shared engine over an assessment to produce the full grading result.
 * Composes the HHIE-S score with the additional safety flags, exactly as the
 * wizard does on submit, so the dashboard and the report stay aligned.
 */
export function gradeAssessment(data: AssessmentData): GradingResult {
	const { hhiesScore, hhiesCategoryLabel, firedRules } = calculateHHIES(data);
	return {
		hhiesScore,
		hhiesCategory: hhiesCategoryLabel,
		firedRules,
		additionalFlags: detectAdditionalFlags(data),
		timestamp: new Date().toISOString()
	};
}

/** Worse-ear pure-tone-average grade for dashboard display. */
function worstEarGrade(data: AssessmentData): string {
	const { leftPTA, rightPTA } = data.audiogramResults;
	if (leftPTA === null && rightPTA === null) return 'Not tested';
	const worst = Math.max(leftPTA ?? -Infinity, rightPTA ?? -Infinity);
	return hearingLossGrade(worst);
}

/** No handicap: minimal symptoms, normal-to-mild loss. */
function noHandicap(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'John', lastName: 'Smith', dateOfBirth: '1955-04-12', sex: 'male' };
	d.hearingHistory = { ...d.hearingHistory, onsetType: 'gradual', duration: '2 years', affectedEar: 'both', familyHistory: 'yes', noiseExposure: 'no', tinnitus: 'no', vertigo: 'no', earSurgery: 'no', ototoxicMedications: 'no' };
	d.hhiesQuestionnaire = { q1: 2, q2: 0, q3: 2, q4: 0, q5: 0, q6: 0, q7: 0, q8: 2, q9: 0, q10: 0 };
	d.communicationDifficulties = { ...d.communicationDifficulties, quietConversation: 'none', groupConversation: 'slight', telephone: 'none', television: 'slight', publicPlaces: 'slight', workDifficulty: 'none' };
	d.currentHearingAids = { ...d.currentHearingAids, hasHearingAids: 'no' };
	d.earExamination = { ...d.earExamination, leftExternalEar: 'Normal', rightExternalEar: 'Normal', leftTympanicMembrane: 'Normal', rightTympanicMembrane: 'Normal', cerumenLeft: 'no', cerumenRight: 'no' };
	d.audiogramResults = { ...d.audiogramResults, leftPTA: 24, rightPTA: 26, leftSRT: 25, rightSRT: 25, leftWordRecognition: 96, rightWordRecognition: 94, hearingLossType: 'sensorineural' };
	d.lifestyleNeeds = { ...d.lifestyleNeeds, technologyComfort: 'comfortable', dexterity: 'good', visionStatus: 'good' };
	d.expectationsGoals = { ...d.expectationsGoals, realisticExpectations: 'yes', willingnessToWear: 'willing', budgetConcerns: 'mild', cosmeticConcerns: 'none' };
	return d;
}

/** Mild to moderate handicap: moderate loss, current bilateral aids. */
function mildModerate(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1948-09-30', sex: 'female' };
	d.hearingHistory = { ...d.hearingHistory, onsetType: 'gradual', duration: '6 years', affectedEar: 'both', familyHistory: 'no', noiseExposure: 'yes', tinnitus: 'yes', vertigo: 'no', earSurgery: 'no', ototoxicMedications: 'no' };
	d.hhiesQuestionnaire = { q1: 4, q2: 2, q3: 4, q4: 2, q5: 2, q6: 0, q7: 0, q8: 4, q9: 0, q10: 0 };
	d.communicationDifficulties = { ...d.communicationDifficulties, quietConversation: 'slight', groupConversation: 'moderate', telephone: 'moderate', television: 'moderate', publicPlaces: 'severe', workDifficulty: 'moderate' };
	d.currentHearingAids = { ...d.currentHearingAids, hasHearingAids: 'yes', leftAidType: 'BTE', rightAidType: 'BTE', aidAge: '4 years', satisfaction: 'neutral', dailyUseHours: 8, difficulties: 'Whistling feedback in noisy rooms' };
	d.earExamination = { ...d.earExamination, leftExternalEar: 'Normal', rightExternalEar: 'Normal', leftTympanicMembrane: 'Normal', rightTympanicMembrane: 'Normal', cerumenLeft: 'no', cerumenRight: 'yes' };
	d.audiogramResults = { ...d.audiogramResults, leftPTA: 48, rightPTA: 52, leftSRT: 50, rightSRT: 50, leftWordRecognition: 84, rightWordRecognition: 80, hearingLossType: 'sensorineural' };
	d.lifestyleNeeds = { ...d.lifestyleNeeds, technologyComfort: 'somewhat-comfortable', dexterity: 'fair', visionStatus: 'fair' };
	d.expectationsGoals = { ...d.expectationsGoals, realisticExpectations: 'yes', willingnessToWear: 'very-willing', budgetConcerns: 'moderate', cosmeticConcerns: 'mild' };
	return d;
}

/** Significant handicap: severe asymmetric loss, sudden onset, multiple flags. */
function significant(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1944-01-22', sex: 'female' };
	d.hearingHistory = { ...d.hearingHistory, onsetType: 'sudden', duration: '3 months', affectedEar: 'left', familyHistory: 'no', noiseExposure: 'no', tinnitus: 'yes', vertigo: 'yes', earSurgery: 'yes', ototoxicMedications: 'yes' };
	d.hhiesQuestionnaire = { q1: 4, q2: 4, q3: 4, q4: 4, q5: 4, q6: 2, q7: 4, q8: 4, q9: 2, q10: 0 };
	d.communicationDifficulties = { ...d.communicationDifficulties, quietConversation: 'moderate', groupConversation: 'severe', telephone: 'severe', television: 'severe', publicPlaces: 'severe', workDifficulty: 'severe' };
	d.currentHearingAids = { ...d.currentHearingAids, hasHearingAids: 'yes', leftAidType: 'BTE', rightAidType: '', aidAge: '7 years', satisfaction: 'dissatisfied', dailyUseHours: 3, difficulties: 'Poor benefit, rarely wears' };
	d.earExamination = { ...d.earExamination, leftExternalEar: 'Surgical cavity', rightExternalEar: 'Normal', leftTympanicMembrane: 'Perforation', rightTympanicMembrane: 'Normal', cerumenLeft: 'yes', cerumenRight: 'no', abnormalities: 'Left mastoid cavity post-surgery' };
	d.audiogramResults = { ...d.audiogramResults, leftPTA: 78, rightPTA: 42, leftSRT: 80, rightSRT: 45, leftWordRecognition: 44, rightWordRecognition: 76, hearingLossType: 'mixed' };
	d.lifestyleNeeds = { ...d.lifestyleNeeds, technologyComfort: 'uncomfortable', dexterity: 'poor', visionStatus: 'poor' };
	d.expectationsGoals = { ...d.expectationsGoals, realisticExpectations: 'no', willingnessToWear: 'uncertain', budgetConcerns: 'significant', cosmeticConcerns: 'significant' };
	return d;
}

/** Younger patient, profound bilateral loss, cochlear-implant candidacy flags. */
function profound(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'David', lastName: 'Williams', dateOfBirth: '1978-11-03', sex: 'male' };
	d.hearingHistory = { ...d.hearingHistory, onsetType: 'gradual', duration: '12 years', affectedEar: 'both', familyHistory: 'yes', noiseExposure: 'yes', tinnitus: 'yes', vertigo: 'no', earSurgery: 'no', ototoxicMedications: 'no' };
	d.hhiesQuestionnaire = { q1: 4, q2: 4, q3: 4, q4: 4, q5: 4, q6: 4, q7: 4, q8: 4, q9: 4, q10: 4 };
	d.communicationDifficulties = { ...d.communicationDifficulties, quietConversation: 'severe', groupConversation: 'severe', telephone: 'severe', television: 'severe', publicPlaces: 'severe', workDifficulty: 'severe' };
	d.currentHearingAids = { ...d.currentHearingAids, hasHearingAids: 'yes', leftAidType: 'BTE power', rightAidType: 'BTE power', aidAge: '2 years', satisfaction: 'very-dissatisfied', dailyUseHours: 10, difficulties: 'Limited benefit despite maximum gain' };
	d.earExamination = { ...d.earExamination, leftExternalEar: 'Normal', rightExternalEar: 'Normal', leftTympanicMembrane: 'Normal', rightTympanicMembrane: 'Normal', cerumenLeft: 'no', cerumenRight: 'no' };
	d.audiogramResults = { ...d.audiogramResults, leftPTA: 92, rightPTA: 88, leftSRT: 95, rightSRT: 90, leftWordRecognition: 32, rightWordRecognition: 36, hearingLossType: 'sensorineural' };
	d.lifestyleNeeds = { ...d.lifestyleNeeds, technologyComfort: 'very-comfortable', dexterity: 'good', visionStatus: 'good' };
	d.expectationsGoals = { ...d.expectationsGoals, realisticExpectations: 'yes', willingnessToWear: 'very-willing', budgetConcerns: 'mild', cosmeticConcerns: 'none' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'HA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: noHandicap() },
	{ id: 'HA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: mildModerate() },
	{ id: 'HA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: significant() },
	{ id: 'HA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: profound() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeAssessment(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		hhiesScore: g.hhiesScore,
		hhiesCategory: g.hhiesCategory,
		hearingLossGrade: worstEarGrade(s.data),
		currentAids: s.data.currentHearingAids.hasHearingAids === 'yes',
		flagCount: g.additionalFlags.length
	};
});
