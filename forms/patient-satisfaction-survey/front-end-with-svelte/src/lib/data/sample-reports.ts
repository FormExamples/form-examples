import type { AssessmentData, SatisfactionCategory } from '$lib/engine/types';
import { calculateSatisfactionGrade } from '$lib/engine/grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample survey: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	surveyedDate: string;
	data: AssessmentData;
}

/** A row in the service dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	surveyedDate: string;
	visitType: string;
	score: number;
	category: SatisfactionCategory;
	complaintFlag: boolean;
	flagCount: number;
}

/** Set every Likert item in every rated care domain to a single value. */
function setAllLikert(data: AssessmentData, score: number): AssessmentData {
	data.accessWaitingTimes = {
		...data.accessWaitingTimes,
		easeOfBooking: score,
		waitingTimeForAppointment: score,
		waitingTimeOnDay: score,
		receptionService: score,
		signageWayfinding: score,
		parkingTransport: score
	};
	data.communicationInformation = {
		explanationOfCondition: score,
		explanationOfTreatment: score,
		opportunityToAskQuestions: score,
		listenedTo: score,
		informedAboutMedication: score,
		writtenInformationQuality: score
	};
	data.clinicalCareQuality = {
		confidenceInClinician: score,
		thoroughnessOfExamination: score,
		painManagement: score,
		involvementInDecisions: score,
		privacyDuringExamination: score,
		coordinationOfCare: score
	};
	data.staffAttitude = {
		doctorCourtesy: score,
		nurseCourtesy: score,
		receptionCourtesy: score,
		respectForDignity: score,
		culturalSensitivity: score,
		emotionalSupport: score
	};
	data.environmentFacilities = {
		cleanliness: score,
		comfort: score,
		noiseLevels: score,
		foodQuality: score,
		toiletFacilities: score,
		temperatureComfort: score
	};
	data.dischargeFollowUp = {
		dischargeInformation: score,
		medicationExplanation: score,
		followUpArrangements: score,
		knewWhoToContact: score,
		recoveryInformation: score,
		carePlanClarity: score
	};
	data.overallExperience = {
		...data.overallExperience,
		overallSatisfaction: score,
		wouldRecommend: score,
		metExpectations: score,
		feltSafe: score,
		wouldReturn: score
	};
	return data;
}

/** Excellent experience: top marks across every domain. */
function excellent(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1968-04-12', sex: 'male', ageRange: '55-64' };
	d.visitDetails = { ...d.visitDetails, visitDate: '2026-06-08', visitType: 'outpatient', department: 'Cardiology', hospitalSite: 'Royal Infirmary', referralSource: 'gp', isFirstVisit: 'no' };
	setAllLikert(d, 5);
	d.accessWaitingTimes.actualWaitMinutes = 10;
	d.overallExperience.nhsRating = 10;
	d.commentsSuggestions = { ...d.commentsSuggestions, whatWentWell: 'Friendly, efficient, well explained.', specificStaffPraise: 'Nurse Aisha was wonderful.', complaintRaised: 'no', consentToContact: 'no' };
	return d;
}

/** Good experience: above average with minor gaps. */
function good(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1959-09-30', sex: 'female', ageRange: '65-74' };
	d.visitDetails = { ...d.visitDetails, visitDate: '2026-06-10', visitType: 'day-case', department: 'Endoscopy', hospitalSite: 'St Mary’s', referralSource: 'specialist', isFirstVisit: 'yes', lengthOfStayDays: 1 };
	setAllLikert(d, 4);
	d.accessWaitingTimes.actualWaitMinutes = 35;
	d.overallExperience.nhsRating = 8;
	d.commentsSuggestions = { ...d.commentsSuggestions, whatCouldImprove: 'Parking was difficult.', complaintRaised: 'no', consentToContact: 'no' };
	return d;
}

/** Poor experience: several domains below par. */
function poor(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1948-01-22', sex: 'female', ageRange: '75-plus' };
	d.visitDetails = { ...d.visitDetails, visitDate: '2026-06-12', visitType: 'inpatient', department: 'General Medicine', hospitalSite: 'Royal Infirmary', referralSource: 'emergency', isFirstVisit: 'no', lengthOfStayDays: 5 };
	setAllLikert(d, 2);
	d.accessWaitingTimes.actualWaitMinutes = 90;
	d.overallExperience.nhsRating = 4;
	d.commentsSuggestions = { ...d.commentsSuggestions, whatCouldImprove: 'Long waits and limited communication.', complaintRaised: 'no', consentToContact: 'yes', contactEmail: 'm.jones@example.com' };
	return d;
}

/** Very poor experience: critical concerns and a formal complaint. */
function veryPoor(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1955-11-03', sex: 'male', ageRange: '65-74' };
	d.visitDetails = { ...d.visitDetails, visitDate: '2026-06-14', visitType: 'emergency', department: 'Emergency Department', hospitalSite: 'City Hospital', referralSource: 'emergency', isFirstVisit: 'yes' };
	setAllLikert(d, 1);
	d.clinicalCareQuality.privacyDuringExamination = 1;
	d.accessWaitingTimes.actualWaitMinutes = 240;
	d.overallExperience.nhsRating = 1;
	d.commentsSuggestions = { ...d.commentsSuggestions, whatCouldImprove: 'Felt unsafe and ignored.', complaintRaised: 'yes', complaintDetails: 'Left waiting without review for four hours.', consentToContact: 'yes', contactPhone: '07700 900123' };
	return d;
}

/** The sample surveys, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'PS-2026-0001', patientName: 'Smith, John', surveyedDate: '2026-06-09', data: excellent() },
	{ id: 'PS-2026-0002', patientName: 'Patel, Priya', surveyedDate: '2026-06-11', data: good() },
	{ id: 'PS-2026-0003', patientName: 'Jones, Margaret', surveyedDate: '2026-06-13', data: poor() },
	{ id: 'PS-2026-0004', patientName: 'Williams, David', surveyedDate: '2026-06-15', data: veryPoor() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateSatisfactionGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		surveyedDate: s.surveyedDate,
		visitType: s.data.visitDetails.visitType,
		score: g.normalizedScore,
		category: g.satisfactionCategory,
		complaintFlag: s.data.commentsSuggestions.complaintRaised === 'yes',
		flagCount: g.additionalFlags.length
	};
});
