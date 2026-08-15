import type { AssessmentData, SeverityCategory, SupportLevel } from '#lib/engine/types.js';
import { calculateLD } from '#lib/engine/ld-grader.js';
import { severityIqBand } from '#lib/engine/utils.js';
import { createDefaultAssessment } from '#lib/engine/defaults.js';

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
	severity: SeverityCategory;
	iqBand: string;
	communicationNeed: string;
	capacityStatus: string;
	reasonableAdjustmentsRequired: boolean;
	flagCount: number;
}

/** Set every adaptive-functioning item to the same support level. */
function adaptive(d: AssessmentData, level: SupportLevel): void {
	for (const key of Object.keys(d.adaptiveFunctioning) as (keyof AssessmentData['adaptiveFunctioning'])[]) {
		d.adaptiveFunctioning[key] = level;
	}
}

/** Mild: largely independent, standard communication, has capacity. */
function mild(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Jane', lastName: 'Smith', preferredName: 'Janey', dateOfBirth: '1992-03-14', sex: 'female', nhsNumber: '943 476 5919', gpPractice: 'Riverside Surgery', ethnicity: 'White British' };
	adaptive(d, 'independent');
	d.adaptiveFunctioning.conceptualReadingWriting = 'some-support';
	d.carerSupport = { ...d.carerSupport, primaryCarerName: 'Susan Smith', primaryCarerRelationship: 'mother', livesWithCarer: 'no', hasSupportPlan: 'yes', hasSocialWorker: 'no' };
	d.communicationNeeds = { ...d.communicationNeeds, verbalAbility: 'verbal' };
	d.physicalExamination = { ...d.physicalExamination, weight: 68, height: 165, bmi: 25, bloodPressureSystolic: 122, bloodPressureDiastolic: 78, pulse: 72, visionChecked: 'yes', hearingChecked: 'yes', dentalChecked: 'yes', vaccinationsUpToDate: 'yes' };
	d.mentalCapacityConsent = { ...d.mentalCapacityConsent, canConsentToHealthCheck: 'yes', canConsentToMedication: 'yes', canConsentToFinances: 'yes' };
	d.reasonableAdjustments = { ...d.reasonableAdjustments, needsLongerAppointments: 'yes', flagOnRecord: 'yes' };
	return d;
}

/** Moderate: some support across domains, easy-read, has capacity. */
function moderate(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1980-07-22', sex: 'female', nhsNumber: '384 615 7230', gpPractice: 'Oakwood Medical', ethnicity: 'White British' };
	adaptive(d, 'some-support');
	d.adaptiveFunctioning.practicalSelfCare = 'significant-support';
	d.carerSupport = { ...d.carerSupport, primaryCarerName: 'Paid carer', primaryCarerRelationship: 'paid carer', livesWithCarer: 'yes', livingArrangement: 'supported living', hasSupportPlan: 'yes', hasSocialWorker: 'yes', socialWorkerName: 'A. Khan' };
	d.communicationNeeds = { ...d.communicationNeeds, verbalAbility: 'verbal', usesEasyRead: 'yes' };
	d.medicalReview = { ...d.medicalReview, hasMentalHealthDiagnosis: 'yes', mentalHealthDetails: 'Anxiety', takesPsychotropic: 'yes', stompReviewDone: 'no' };
	d.physicalExamination = { ...d.physicalExamination, weight: 88, height: 160, bmi: 34.4, bloodPressureSystolic: 138, bloodPressureDiastolic: 84, pulse: 80, visionChecked: 'yes', hearingChecked: 'no', dentalChecked: 'yes', vaccinationsUpToDate: 'yes' };
	d.mentalCapacityConsent = { ...d.mentalCapacityConsent, canConsentToHealthCheck: 'yes', canConsentToMedication: 'unknown', canConsentToFinances: 'no' };
	d.reasonableAdjustments = { ...d.reasonableAdjustments, needsLongerAppointments: 'yes', needsEasyReadLetters: 'yes', flagOnRecord: 'yes' };
	return d;
}

/** Severe: significant support, Makaton, lacks capacity, epilepsy. */
function severe(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Sarah', lastName: 'Brown', dateOfBirth: '1975-11-03', sex: 'female', nhsNumber: '167 293 8451', gpPractice: 'Hilltop Practice', ethnicity: 'White British' };
	adaptive(d, 'significant-support');
	d.carerSupport = { ...d.carerSupport, primaryCarerName: 'Residential staff', primaryCarerRelationship: 'paid carer', livesWithCarer: 'yes', livingArrangement: 'residential care', hasSupportPlan: 'yes', hasSocialWorker: 'yes' };
	d.communicationNeeds = { ...d.communicationNeeds, verbalAbility: 'limited-verbal', usesMakaton: 'yes', usesPictures: 'yes' };
	d.medicalReview = { ...d.medicalReview, hasEpilepsy: 'yes', seizuresPerMonth: 6, takesPsychotropic: 'yes', stompReviewDone: 'no', hasDysphagia: 'yes' };
	d.physicalExamination = { ...d.physicalExamination, weight: 60, height: 168, bmi: 21.3, bloodPressureSystolic: 132, bloodPressureDiastolic: 80, pulse: 76, visionChecked: 'no', hearingChecked: 'unknown', dentalChecked: 'no', vaccinationsUpToDate: 'yes' };
	d.behaviouralConcerns = { ...d.behaviouralConcerns, selfInjurious: 'yes', hasBehaviourSupportPlan: 'yes' };
	d.mentalCapacityConsent = { ...d.mentalCapacityConsent, canConsentToHealthCheck: 'no', canConsentToMedication: 'no', canConsentToFinances: 'no', bestInterestsRequired: 'yes' };
	d.reasonableAdjustments = { ...d.reasonableAdjustments, needsLongerAppointments: 'yes', needsQuietRoom: 'yes', needsFamiliarStaff: 'yes', needsHomeVisits: 'yes', flagOnRecord: 'yes' };
	return d;
}

/** Profound: full support across domains, AAC, lacks capacity, DoLS. */
function profound(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Helen', lastName: 'Davies', dateOfBirth: '1968-01-30', sex: 'female', nhsNumber: '294 708 5316', gpPractice: 'Greenfield Surgery', ethnicity: 'White British' };
	adaptive(d, 'full-support');
	d.carerSupport = { ...d.carerSupport, primaryCarerName: 'Nursing staff', primaryCarerRelationship: 'paid carer', livesWithCarer: 'yes', livingArrangement: 'nursing home', hasSupportPlan: 'yes', hasSocialWorker: 'yes' };
	d.communicationNeeds = { ...d.communicationNeeds, verbalAbility: 'non-verbal', usesAac: 'yes', aacDetails: 'Eye-gaze device', usesPictures: 'yes' };
	d.medicalReview = { ...d.medicalReview, hasEpilepsy: 'yes', seizuresPerMonth: 10, takesPsychotropic: 'yes', stompReviewDone: 'yes', hasDysphagia: 'yes', hasIncontinence: 'yes' };
	d.physicalExamination = { ...d.physicalExamination, weight: 48, height: 160, bmi: 18.8, bloodPressureSystolic: 118, bloodPressureDiastolic: 72, pulse: 70, visionChecked: 'no', hearingChecked: 'no', dentalChecked: 'no', vaccinationsUpToDate: 'no' };
	d.behaviouralConcerns = { ...d.behaviouralConcerns, selfInjurious: 'yes', hasBehaviourSupportPlan: 'no' };
	d.mentalCapacityConsent = { ...d.mentalCapacityConsent, canConsentToHealthCheck: 'no', canConsentToMedication: 'no', canConsentToFinances: 'no', hasDols: 'yes', bestInterestsRequired: 'yes' };
	d.reasonableAdjustments = { ...d.reasonableAdjustments, needsLongerAppointments: 'yes', needsQuietRoom: 'yes', needsFamiliarStaff: 'yes', needsHomeVisits: 'yes', needsDoubleAppointment: 'yes', flagOnRecord: 'no' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'LD-2026-0001', patientName: 'Smith, Jane', assessedDate: '2026-06-10', data: mild() },
	{ id: 'LD-2026-0002', patientName: 'Jones, Margaret', assessedDate: '2026-06-12', data: moderate() },
	{ id: 'LD-2026-0003', patientName: 'Brown, Sarah', assessedDate: '2026-06-15', data: severe() },
	{ id: 'LD-2026-0004', patientName: 'Davies, Helen', assessedDate: '2026-06-18', data: profound() }
];

/** Derive the accessible-information label captured during the assessment. */
function communicationNeed(data: AssessmentData): string {
	const c = data.communicationNeeds;
	if (c.usesAac === 'yes') return 'AAC';
	if (c.usesMakaton === 'yes') return 'Makaton';
	if (c.usesEasyRead === 'yes') return 'Easy-Read';
	return 'Standard';
}

/** Map the consent step's health-check capacity to a dashboard label. */
function capacityStatus(data: AssessmentData): string {
	return data.mentalCapacityConsent.canConsentToHealthCheck === 'no'
		? 'Lacks Capacity'
		: 'Has Capacity';
}

/** True when any reasonable adjustment is required by the care plan. */
function reasonableAdjustmentsRequired(data: AssessmentData): boolean {
	const r = data.reasonableAdjustments;
	return (
		r.needsLongerAppointments === 'yes' ||
		r.needsQuietRoom === 'yes' ||
		r.needsFamiliarStaff === 'yes' ||
		r.needsEasyReadLetters === 'yes' ||
		r.needsHomeVisits === 'yes' ||
		r.needsDoubleAppointment === 'yes'
	);
}

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateLD(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		severity: g.severityCategory,
		iqBand: severityIqBand(g.severityCategory),
		communicationNeed: communicationNeed(s.data),
		capacityStatus: capacityStatus(s.data),
		reasonableAdjustmentsRequired: reasonableAdjustmentsRequired(s.data),
		flagCount: g.additionalFlags.length
	};
});
