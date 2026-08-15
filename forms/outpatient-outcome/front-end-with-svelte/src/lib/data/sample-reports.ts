import type { AssessmentData, DomainGrade } from '#lib/engine/types.js';
import { gradeOOCG } from '#lib/engine/oocg-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample outcome report: an identifier and the full data the engine grades. */
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
	specialty: string;
	modality: string;
	waitTimeDays: number | null;
	overallGrade: DomainGrade;
	clinicalGrade: DomainGrade;
	promGrade: DomainGrade;
	premGrade: DomainGrade;
	operationalGrade: DomainGrade;
	flagCount: number;
}

/** Grade A outcome: resolved, all PROMs improved, FFT very good, attended in target. */
function gradeA(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDetails = { ...d.patientDetails, givenName: 'John', familyName: 'Smith', dateOfBirth: '1968-04-12', nhsNumber: '943 476 5919', sex: 'male' };
	d.encounterDetails = { ...d.encounterDetails, clinicDate: '2026-06-10', specialty: 'Cardiology', clinicianName: 'Dr A Okafor', modality: 'in_person', appointmentType: 'follow_up' };
	d.operationalEfficiency = { ...d.operationalEfficiency, referralDate: '2026-05-01', appointmentDate: '2026-06-10', waitTimeDays: 40, serviceTargetDays: 42, nhsAttendanceOutcome: 'attended_discharged' };
	d.clinicalOutcome = { ...d.clinicalOutcome, presentingComplaint: 'Stable angina', diagnosis: 'Resolved chest pain', treatmentDelivered: 'Medication optimisation', outcomeClassification: 'resolved' };
	d.promEq5d5l = { ...d.promEq5d5l, beforeMobility: 3, beforeSelfCare: 2, beforeUsualActivities: 3, beforePainDiscomfort: 3, beforeAnxietyDepression: 2, beforeVas: 60, afterMobility: 1, afterSelfCare: 1, afterUsualActivities: 1, afterPainDiscomfort: 1, afterAnxietyDepression: 1, afterVas: 90 };
	d.promGrc = { ...d.promGrc, globalRatingOfChange: 3, selfRatedHealth: 'very_good' };
	d.promPromis = { ...d.promPromis, item1GeneralHealth: 5, item2QualityOfLife: 5, item3PhysicalHealth: 5, item4MentalHealth: 5, item5Satisfaction: 5, item6FatigueFrequency: 1, item7EmotionalProblems: 1, item8SocialActivities: 5, item9Pain: 1, item10EverydayActivities: 5, globalPhysicalHealthTScore: null, globalMentalHealthTScore: null };
	d.premFft = { ...d.premFft, fftResponse: 'extremely_likely', fftComment: 'Excellent care, very attentive team.' };
	d.followupPlan = { ...d.followupPlan, disposition: 'discharge' };
	d.signOff = { ...d.signOff, reportingClinicianName: 'Dr A Okafor', reportingClinicianRole: 'Consultant Cardiologist', signedOffAt: '2026-06-10T11:30' };
	return d;
}

/** Grade B outcome: improved, two PROMs improved, FFT good, attended within 1.5x target. */
function gradeB(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDetails = { ...d.patientDetails, givenName: 'Priya', familyName: 'Patel', dateOfBirth: '1959-09-30', nhsNumber: '721 938 4102', sex: 'female' };
	d.encounterDetails = { ...d.encounterDetails, clinicDate: '2026-06-12', specialty: 'Neurology', clinicianName: 'Dr R Mehta', modality: 'telephone', appointmentType: 'new' };
	d.operationalEfficiency = { ...d.operationalEfficiency, referralDate: '2026-04-10', appointmentDate: '2026-06-12', waitTimeDays: 63, serviceTargetDays: 42, nhsAttendanceOutcome: 'attended_follow_up' };
	d.clinicalOutcome = { ...d.clinicalOutcome, presentingComplaint: 'Migraine', diagnosis: 'Chronic migraine', treatmentDelivered: 'Prophylaxis started', outcomeClassification: 'improved' };
	d.promEq5d5l = { ...d.promEq5d5l, beforeMobility: 2, beforeSelfCare: 1, beforeUsualActivities: 3, beforePainDiscomfort: 4, beforeAnxietyDepression: 3, beforeVas: 55, afterMobility: 1, afterSelfCare: 1, afterUsualActivities: 2, afterPainDiscomfort: 2, afterAnxietyDepression: 2, afterVas: 75 };
	d.promGrc = { ...d.promGrc, globalRatingOfChange: 2, selfRatedHealth: 'good' };
	d.promPromis = { ...d.promPromis, item1GeneralHealth: 3, item2QualityOfLife: 4, item3PhysicalHealth: 3, item4MentalHealth: 3, item5Satisfaction: 4, item6FatigueFrequency: 3, item7EmotionalProblems: 3, item8SocialActivities: 4, item9Pain: 4, item10EverydayActivities: 4, globalPhysicalHealthTScore: null, globalMentalHealthTScore: null };
	d.premFft = { ...d.premFft, fftResponse: 'likely', fftComment: 'Helpful appointment.' };
	d.followupPlan = { ...d.followupPlan, disposition: 'follow_up_booked', nextAppointmentDate: '2026-09-12' };
	d.signOff = { ...d.signOff, reportingClinicianName: 'Dr R Mehta', reportingClinicianRole: 'Neurology Registrar', signedOffAt: '2026-06-12T14:05' };
	return d;
}

/** Grade D outcome: worsened clinical, one PROM worsened, FFT poor, patient cancelled. */
function gradeD(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDetails = { ...d.patientDetails, givenName: 'Margaret', familyName: 'Jones', dateOfBirth: '1948-01-22', nhsNumber: '511 204 7783', sex: 'female' };
	d.encounterDetails = { ...d.encounterDetails, clinicDate: '2026-06-15', specialty: 'Orthopaedics', clinicianName: 'Mr T Bell', modality: 'in_person', appointmentType: 'follow_up' };
	d.operationalEfficiency = { ...d.operationalEfficiency, referralDate: '2026-03-01', appointmentDate: '2026-06-15', waitTimeDays: 106, serviceTargetDays: 42, nhsAttendanceOutcome: 'patient_cancelled' };
	d.clinicalOutcome = { ...d.clinicalOutcome, presentingComplaint: 'Knee osteoarthritis', diagnosis: 'Progressive OA', treatmentDelivered: 'Injection', outcomeClassification: 'worsened' };
	d.promEq5d5l = { ...d.promEq5d5l, beforeMobility: 2, beforeSelfCare: 2, beforeUsualActivities: 2, beforePainDiscomfort: 2, beforeAnxietyDepression: 2, beforeVas: 70, afterMobility: 4, afterSelfCare: 3, afterUsualActivities: 4, afterPainDiscomfort: 4, afterAnxietyDepression: 3, afterVas: 45 };
	d.promGrc = { ...d.promGrc, globalRatingOfChange: -2, selfRatedHealth: 'fair' };
	d.premFft = { ...d.premFft, fftResponse: 'unlikely', fftComment: 'Long wait and limited improvement.' };
	d.followupPlan = { ...d.followupPlan, disposition: 'onward_referral', onwardReferralSpecialty: 'Orthopaedic surgery' };
	d.signOff = { ...d.signOff, reportingClinicianName: 'Mr T Bell', reportingClinicianRole: 'Orthopaedic Consultant', signedOffAt: '2026-06-15T09:50' };
	return d;
}

/** Grade E outcome: died, FFT very poor, DNA. */
function gradeE(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDetails = { ...d.patientDetails, givenName: 'David', familyName: 'Williams', dateOfBirth: '1955-11-03', nhsNumber: '388 902 1145', sex: 'male' };
	d.encounterDetails = { ...d.encounterDetails, clinicDate: '2026-06-18', specialty: 'Oncology', clinicianName: 'Dr S Verma', modality: 'video', appointmentType: 'follow_up' };
	d.operationalEfficiency = { ...d.operationalEfficiency, referralDate: '2026-05-20', appointmentDate: '2026-06-18', waitTimeDays: 29, serviceTargetDays: 14, nhsAttendanceOutcome: 'patient_dna' };
	d.clinicalOutcome = { ...d.clinicalOutcome, presentingComplaint: 'Advanced malignancy', diagnosis: 'Metastatic disease', treatmentDelivered: 'Palliative review', outcomeClassification: 'died' };
	d.promGrc = { ...d.promGrc, globalRatingOfChange: -3, selfRatedHealth: 'poor' };
	d.premFft = { ...d.premFft, fftResponse: 'extremely_unlikely', fftComment: '' };
	d.followupPlan = { ...d.followupPlan, disposition: 'discharge', followupNotes: 'Deceased; record closed.' };
	d.signOff = { ...d.signOff, reportingClinicianName: 'Dr S Verma', reportingClinicianRole: 'Oncology Consultant', signedOffAt: '2026-06-18T16:20' };
	return d;
}

/** The sample outcome reports, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'OO-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: gradeA() },
	{ id: 'OO-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: gradeB() },
	{ id: 'OO-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: gradeD() },
	{ id: 'OO-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: gradeE() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeOOCG(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		specialty: s.data.encounterDetails.specialty,
		modality: s.data.encounterDetails.modality,
		waitTimeDays: s.data.operationalEfficiency.waitTimeDays,
		overallGrade: g.overallGrade,
		clinicalGrade: g.clinicalGrade,
		promGrade: g.promGrade,
		premGrade: g.premGrade,
		operationalGrade: g.operationalGrade,
		flagCount: g.flaggedIssues.length
	};
});
