import type { AssessmentData, Band, CareSetting, InstrumentForm, Items } from '#lib/engine/types.js';
import { calculateZaritGrade } from '#lib/engine/zarit-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	carerName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	carerIdentifier: string;
	carerName: string;
	assessedDate: string;
	careSetting: CareSetting;
	instrumentForm: InstrumentForm;
	totalScore: number;
	maxScore: number;
	burdenBand: Band;
	flagCount: number;
}

/** Set every one of the twenty-two items to `value`. */
function fillItems(value: number | null): Items {
	const items = {} as Items;
	for (let i = 1; i <= 22; i++) {
		items[`item${i}` as keyof Items] = value;
	}
	return items;
}

/** Little-or-no-burden band (ZBI-22, total 12). */
function littleOrNone(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		practitionerName: 'Nurse J. Ahmed',
		practitionerRole: 'nurse',
		assessedAt: '2026-06-10T10:15',
		careSetting: 'community',
		instrumentForm: 'zbi22'
	};
	d.carer = {
		carerIdentifier: 'CAR-2041',
		carerRelationship: 'adult-child',
		carerCoResident: 'no',
		careHoursPerWeek: 6
	};
	d.recipient = { recipientIdentifier: 'REC-2041', recipientCondition: 'chronic-illness' };
	d.items = {
		item1: 1, item2: 1, item3: 1, item4: 0, item5: 0, item6: 0, item7: 1, item8: 2,
		item9: 0, item10: 0, item11: 0, item12: 0, item13: 0, item14: 1, item15: 0, item16: 0,
		item17: 0, item18: 0, item19: 1, item20: 1, item21: 1, item22: 1
	};
	d.note.clinicalNote = 'Coping well; light caring role. Reassure and review if circumstances change.';
	return d;
}

/** Moderate-to-severe-burden band (ZBI-22, total 47). */
function moderateToSevere(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		practitionerName: 'Dr L. Osei',
		practitionerRole: 'clinician',
		assessedAt: '2026-06-12T14:40',
		careSetting: 'memory-service',
		instrumentForm: 'zbi22'
	};
	d.carer = {
		carerIdentifier: 'CAR-100482',
		carerRelationship: 'spouse-partner',
		carerCoResident: 'yes',
		careHoursPerWeek: 40
	};
	d.recipient = { recipientIdentifier: 'REC-100482', recipientCondition: 'dementia' };
	// All items 2 (=44), then item9, item17, item22 raised to 3 (=47).
	d.items = { ...fillItems(2), item9: 3, item17: 3, item22: 3 };
	d.note.clinicalNote =
		'Moderate-to-severe burden; arrange carer-support assessment and respite; screen for depression and anxiety.';
	return d;
}

/** Severe-burden band (ZBI-22, total 67; global item maximal). */
function severe(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		practitionerName: 'Carer-support S. Doyle',
		practitionerRole: 'carer-support',
		assessedAt: '2026-06-15T09:05',
		careSetting: 'social-care',
		instrumentForm: 'zbi22'
	};
	d.carer = {
		carerIdentifier: 'CAR-100517',
		carerRelationship: 'spouse-partner',
		carerCoResident: 'yes',
		careHoursPerWeek: 80
	};
	d.recipient = { recipientIdentifier: 'REC-100517', recipientCondition: 'dementia' };
	// All items 3 (=66), item22 maximal 4 (=67).
	d.items = { ...fillItems(3), item22: 4 };
	d.note.clinicalNote =
		'Severe burden with maximal global item; urgent respite and carer mental-health referral actioned.';
	return d;
}

/** Short form (ZBI-12) high-burden case (total 25 over the 12-item subset). */
function shortFormHigh(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		practitionerName: 'GP P. Reyes',
		practitionerRole: 'clinician',
		assessedAt: '2026-06-18T16:20',
		careSetting: 'general-practice',
		instrumentForm: 'zbi12'
	};
	d.carer = {
		carerIdentifier: 'CAR-77-2211',
		carerRelationship: 'other-relative',
		carerCoResident: 'no',
		careHoursPerWeek: 20
	};
	d.recipient = { recipientIdentifier: 'REC-77-2211', recipientCondition: 'disability' };
	// Only the twelve short-form items are recorded (others left unanswered).
	// Subset 1,2,3,6,9,10,11,12,17,20,21 at 2 (=22) + item22 at 3 → total 25 (>= 17 high).
	d.items = {
		...fillItems(null),
		item1: 2, item2: 2, item3: 2, item6: 2, item9: 2, item10: 2,
		item11: 2, item12: 2, item17: 2, item20: 2, item21: 2, item22: 3
	};
	d.note.clinicalNote =
		'ZBI-12 short-form screen; high burden (>= 17). Offer support and mental-health screening.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'ZB-2026-0001', carerName: 'Adeyemi, Grace', assessedDate: '2026-06-10', data: littleOrNone() },
	{ id: 'ZB-2026-0002', carerName: 'Novak, Peter', assessedDate: '2026-06-12', data: moderateToSevere() },
	{ id: 'ZB-2026-0003', carerName: 'Ferreira, Ana', assessedDate: '2026-06-15', data: severe() },
	{ id: 'ZB-2026-0004', carerName: 'Okonkwo, Chidi', assessedDate: '2026-06-18', data: shortFormHigh() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateZaritGrade(s.data);
	return {
		id: s.id,
		carerIdentifier: s.data.carer.carerIdentifier,
		carerName: s.carerName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		instrumentForm: s.data.context.instrumentForm,
		totalScore: g.totalScore,
		maxScore: g.maxScore,
		burdenBand: g.burdenBand,
		flagCount: g.flaggedIssues.length
	};
});
