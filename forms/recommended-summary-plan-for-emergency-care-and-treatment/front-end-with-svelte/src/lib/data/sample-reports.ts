import type { AssessmentData, CprRecommendation, Status } from '$lib/engine/types';
import { calculateRespectGrade } from '$lib/engine/respect-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample plan: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	updatedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	updatedDate: string;
	status: Status;
	completenessPercent: number;
	cprRecommendation: CprRecommendation;
	clinicianName: string;
	reviewDate: string;
	flagCount: number;
}

/** Complete plan, person with capacity, DNACPR discussed — no flags. */
function completeDnacpr(): AssessmentData {
	const p = createDefaultAssessment();
	p.personal = {
		personName: 'Ellis, Margaret',
		dateOfBirth: '1940-03-12',
		identifier: '943 476 5919',
		address: '12 Elm Road, Leeds',
		keyContact: 'Daughter — Jane Ellis, 07700 900123'
	};
	p.health.healthSummary = 'Advanced heart failure (NYHA IV), recurrent admissions, frailty.';
	p.health.diagnoses = 'Heart failure; chronic kidney disease stage 4.';
	p.preferences.whatMatters = 'Wishes to remain at home; fears breathlessness and hospital.';
	p.preferences.carePreferences = 'Comfort-focused care; avoid hospital where possible.';
	p.recommendations.priorityBalance = 'comfort';
	p.recommendations.recommendedInterventions = 'Symptom control at home; community palliative input.';
	p.recommendations.notRecommendedInterventions = 'Intubation; renal replacement therapy.';
	p.cpr.cprRecommendation = 'do-not-attempt';
	p.cpr.cprRationale = 'Advanced frailty and heart failure; CPR would not be successful.';
	p.cpr.cprDiscussed = 'yes';
	p.ceilings.hospitalTransfer = 'not-appropriate';
	p.ceilings.criticalCareAdmission = 'not-appropriate';
	p.ceilings.treatmentCeilings = 'Ward-based care only if admitted for symptom control.';
	p.capacity.hasCapacity = 'yes';
	p.signOff = {
		clinicianName: 'Dr A. Okafor',
		clinicianRole: 'doctor',
		clinicianRegistration: 'GMC 7654321',
		signature: 'Dr A. Okafor',
		signedAt: '2026-06-20T10:00',
		seniorEndorsement: 'Consultant endorsed.',
		emergencyContacts: 'GP practice; community palliative team.',
		reviewDate: '2026-12-01'
	};
	p.note = 'Plan agreed with patient and daughter.';
	return p;
}

/** Complete plan, person with capacity, CPR should be attempted. */
function completeAttempt(): AssessmentData {
	const p = createDefaultAssessment();
	p.personal = {
		personName: 'Nowak, Piotr',
		dateOfBirth: '1958-09-04',
		identifier: '611 209 3344',
		address: '4 Canal Street, Manchester',
		keyContact: 'Wife — Anna Nowak'
	};
	p.health.healthSummary = 'Type 2 diabetes, stable ischaemic heart disease; independent.';
	p.preferences.whatMatters = 'Values active recovery; wants full treatment attempted.';
	p.recommendations.priorityBalance = 'sustain-life';
	p.recommendations.recommendedInterventions = 'Full active treatment including CPR.';
	p.cpr.cprRecommendation = 'attempt';
	p.cpr.cprRationale = 'Good baseline function; reversible causes likely.';
	p.cpr.cprDiscussed = 'yes';
	p.ceilings.hospitalTransfer = 'appropriate';
	p.ceilings.criticalCareAdmission = 'appropriate';
	p.capacity.hasCapacity = 'yes';
	p.signOff = {
		clinicianName: 'Dr L. Mensah',
		clinicianRole: 'doctor',
		clinicianRegistration: 'GMC 7112233',
		signature: 'Dr L. Mensah',
		signedAt: '2026-06-22T14:30',
		seniorEndorsement: '',
		emergencyContacts: 'Wife; GP practice.',
		reviewDate: '2027-01-15'
	};
	p.note = 'For escalation; ceiling reviewed with patient.';
	return p;
}

/** Incomplete plan, CPR not yet documented, unsigned — multiple high flags. */
function incompleteNoCpr(): AssessmentData {
	const p = createDefaultAssessment();
	p.personal = {
		personName: 'Byrne, Aoife',
		dateOfBirth: '1935-11-27',
		identifier: '502 771 8820',
		address: '9 Harbour View, Belfast',
		keyContact: 'Son — Sean Byrne'
	};
	p.health.healthSummary = 'Advanced dementia; recurrent aspiration pneumonia.';
	p.preferences.whatMatters = 'Familiar surroundings; calm environment.';
	p.recommendations.priorityBalance = 'balanced';
	p.recommendations.recommendedInterventions = 'Antibiotics for reversible infection.';
	// cprRecommendation deliberately left blank.
	p.ceilings.hospitalTransfer = 'appropriate';
	p.capacity.hasCapacity = 'no';
	p.capacity.capacityAssessment = 'Lacks capacity for this decision (advanced dementia).';
	// involvement / proxyDetails deliberately incomplete → capacity flag.
	p.signOff.clinicianName = 'Dr S. Patel';
	p.signOff.clinicianRole = 'doctor';
	// signature / signedAt deliberately blank → no-signature flag.
	p.note = 'Draft — awaiting best-interests meeting.';
	return p;
}

/** Incomplete plan, DNACPR with a past review date and no discussion recorded. */
function incompletePastReview(): AssessmentData {
	const p = createDefaultAssessment();
	p.personal = {
		personName: 'Okafor, Chidi',
		dateOfBirth: '1949-01-19',
		identifier: '778 334 1090',
		address: '21 Maple Grove, Cardiff',
		keyContact: 'Daughter — Ada Okafor'
	};
	p.health.healthSummary = 'Metastatic malignancy; declining performance status.';
	p.preferences.whatMatters = 'Comfort and dignity; time with family.';
	p.recommendations.priorityBalance = 'comfort';
	p.recommendations.notRecommendedInterventions = 'CPR; invasive ventilation.';
	p.cpr.cprRecommendation = 'do-not-attempt';
	p.cpr.cprRationale = 'Terminal illness; CPR not clinically appropriate.';
	p.cpr.cprDiscussed = 'no'; // → DNACPR-without-discussion flag.
	p.ceilings.hospitalTransfer = 'not-appropriate';
	p.capacity.hasCapacity = 'yes';
	p.signOff = {
		clinicianName: 'Sr J. Hughes',
		clinicianRole: 'nurse',
		clinicianRegistration: 'NMC 99AB123',
		signature: 'Sr J. Hughes',
		signedAt: '2025-12-10T09:00',
		seniorEndorsement: '',
		emergencyContacts: 'Daughter; district nurses.',
		reviewDate: '2026-03-10' // past → review-date-passed flag.
	};
	return p;
}

/** The sample plans, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'RSP-2026-0001', patientName: 'Ellis, Margaret', updatedDate: '2026-06-20', data: completeDnacpr() },
	{ id: 'RSP-2026-0002', patientName: 'Nowak, Piotr', updatedDate: '2026-06-22', data: completeAttempt() },
	{ id: 'RSP-2026-0003', patientName: 'Byrne, Aoife', updatedDate: '2026-06-25', data: incompleteNoCpr() },
	{ id: 'RSP-2026-0004', patientName: 'Okafor, Chidi', updatedDate: '2026-06-26', data: incompletePastReview() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateRespectGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.personal.identifier,
		patientName: s.patientName,
		updatedDate: s.updatedDate,
		status: g.status,
		completenessPercent: g.completenessPercent,
		cprRecommendation: s.data.cpr.cprRecommendation,
		clinicianName: s.data.signOff.clinicianName,
		reviewDate: s.data.signOff.reviewDate,
		flagCount: g.flaggedIssues.length
	};
});
