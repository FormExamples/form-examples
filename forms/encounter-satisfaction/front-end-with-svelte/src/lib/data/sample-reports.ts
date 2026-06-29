import type { AssessmentData } from '$lib/engine/types';
import { calculateSatisfaction } from '$lib/engine/satisfaction-grader';
import { detectAdditionalFlags } from '$lib/engine/flagged-issues';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample survey: an identifier and the full data the engine grades. */
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
	compositeScore: number;
	category: string;
	answeredCount: number;
	firstVisit: boolean;
	flagCount: number;
}

/** An excellent survey: every domain rated highly. */
function excellent(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'John', lastName: 'Smith', dateOfBirth: '1968-04-12', sex: 'male' };
	d.visitInformation = { visitDate: '2026-06-08', department: 'Primary Care', providerName: 'Dr. Allen', visitType: 'routine-checkup', reasonForVisit: 'Annual review', firstVisit: 'no' };
	d.accessScheduling = { easeOfScheduling: 5, waitForAppointment: 5, waitInWaitingRoom: 4 };
	d.communication = { listening: 5, explainingCondition: 5, answeringQuestions: 5, timeSpent: 5 };
	d.staffProfessionalism = { receptionCourtesy: 5, nursingCourtesy: 5, respectShown: 5 };
	d.careQuality = { involvementInDecisions: 5, treatmentPlanExplanation: 4, confidenceInCare: 5 };
	d.environment = { cleanliness: 5, waitingAreaComfort: 5, privacy: 5 };
	d.overallSatisfaction = { overallRating: 5, likelyToRecommend: 5, likelyToReturn: 5, comments: 'Excellent visit, very attentive team.' };
	return d;
}

/** A good survey: mostly positive with a few neutral ratings. */
function good(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1979-09-30', sex: 'female' };
	d.visitInformation = { visitDate: '2026-06-11', department: 'Cardiology', providerName: 'Dr. Okafor', visitType: 'follow-up', reasonForVisit: 'Blood pressure follow-up', firstVisit: 'no' };
	d.accessScheduling = { easeOfScheduling: 4, waitForAppointment: 3, waitInWaitingRoom: 4 };
	d.communication = { listening: 4, explainingCondition: 4, answeringQuestions: 4, timeSpent: 3 };
	d.staffProfessionalism = { receptionCourtesy: 4, nursingCourtesy: 4, respectShown: 5 };
	d.careQuality = { involvementInDecisions: 4, treatmentPlanExplanation: 4, confidenceInCare: 4 };
	d.environment = { cleanliness: 4, waitingAreaComfort: 3, privacy: 4 };
	d.overallSatisfaction = { overallRating: 4, likelyToRecommend: 4, likelyToReturn: 4, comments: '' };
	return d;
}

/** A fair survey: a first-time patient with mixed feedback. */
function fair(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1955-01-22', sex: 'female' };
	d.visitInformation = { visitDate: '2026-06-14', department: 'Dermatology', providerName: 'Dr. Reyes', visitType: 'specialist-referral', reasonForVisit: 'Skin lesion review', firstVisit: 'yes' };
	d.accessScheduling = { easeOfScheduling: 3, waitForAppointment: 2, waitInWaitingRoom: 3 };
	d.communication = { listening: 3, explainingCondition: 3, answeringQuestions: 3, timeSpent: 3 };
	d.staffProfessionalism = { receptionCourtesy: 3, nursingCourtesy: 4, respectShown: 3 };
	d.careQuality = { involvementInDecisions: 3, treatmentPlanExplanation: 3, confidenceInCare: 3 };
	d.environment = { cleanliness: 4, waitingAreaComfort: 3, privacy: 3 };
	d.overallSatisfaction = { overallRating: 3, likelyToRecommend: 3, likelyToReturn: 3, comments: 'Long wait but the doctor was thorough.' };
	return d;
}

/** A poor survey: dissatisfied across communication and care. */
function poor(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'David', lastName: 'Williams', dateOfBirth: '1962-11-03', sex: 'male' };
	d.visitInformation = { visitDate: '2026-06-17', department: 'Urgent Care', providerName: 'Dr. Nair', visitType: 'urgent-care', reasonForVisit: 'Acute back pain', firstVisit: 'yes' };
	d.accessScheduling = { easeOfScheduling: 2, waitForAppointment: 1, waitInWaitingRoom: 2 };
	d.communication = { listening: 2, explainingCondition: 1, answeringQuestions: 2, timeSpent: 1 };
	d.staffProfessionalism = { receptionCourtesy: 2, nursingCourtesy: 3, respectShown: 2 };
	d.careQuality = { involvementInDecisions: 1, treatmentPlanExplanation: 2, confidenceInCare: 2 };
	d.environment = { cleanliness: 3, waitingAreaComfort: 2, privacy: 2 };
	d.overallSatisfaction = { overallRating: 2, likelyToRecommend: 1, likelyToReturn: 1, comments: 'Felt rushed and not listened to.' };
	return d;
}

/** The sample surveys, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'ES-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-08', data: excellent() },
	{ id: 'ES-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-11', data: good() },
	{ id: 'ES-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-14', data: fair() },
	{ id: 'ES-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-17', data: poor() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateSatisfaction(s.data);
	const flags = detectAdditionalFlags(s.data, g.compositeScore);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		compositeScore: g.compositeScore,
		category: g.category,
		answeredCount: g.answeredCount,
		firstVisit: s.data.visitInformation.firstVisit === 'yes',
		flagCount: flags.length
	};
});
