import type { AssessmentData, CareSetting, PlanStatus } from '$lib/engine/types';
import { calculateParkland } from '$lib/engine/parkland-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

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
	patientIdentifier: string;
	patientName: string;
	assessedDate: string;
	careSetting: CareSetting;
	total24hVolumeMl: number | null;
	first8hRateMlPerHour: number | null;
	status: PlanStatus;
	flagCount: number;
}

/** Moderate adult burn — assessed within the first-8-h window. 80kg × 25% = 8000 mL. */
function moderateAdultCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr G. Osei',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-24T10:00',
		careSetting: 'emergency-department'
	};
	d.identification = { patientIdentifier: 'ED-100482', ageBand: 'adult', sex: 'female' };
	d.weight.weightKg = 80;
	d.burn.tbsaPercent = 25;
	d.burn.tbsaMethod = 'rule-of-nines';
	// Injured 1 h before assessment → 7 h of the first window remain.
	d.injury = { injuryAt: '2026-06-24T09:00', injuryTimeKnown: 'known' };
	d.features = { inhalationSuspected: 'no', circumferentialOrDeep: 'no', mechanism: 'thermal' };
	d.note.clinicalNote = 'Scald to trunk and arms; Parkland resuscitation commenced.';
	return d;
}

/** Large burn with inhalation risk. 90kg × 45% = 16200 mL. */
function largeBurnCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr Z. Nowak',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-25T14:30',
		careSetting: 'burns-unit'
	};
	d.identification = { patientIdentifier: 'BU-573110', ageBand: 'adult', sex: 'male' };
	d.weight.weightKg = 90;
	d.burn.tbsaPercent = 45;
	d.burn.tbsaMethod = 'lund-browder';
	// Injured 2 h before assessment → 6 h remain.
	d.injury = { injuryAt: '2026-06-25T12:30', injuryTimeKnown: 'known' };
	d.features = { inhalationSuspected: 'yes', circumferentialOrDeep: 'yes', mechanism: 'thermal' };
	d.note.clinicalNote = 'House fire; suspected inhalation injury and circumferential chest burn.';
	return d;
}

/** Overdue resuscitation — injured more than 8 h before assessment. 70kg × 30% = 8400 mL. */
function overdueCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Paramedic I. Mackenzie',
		clinicianRole: 'paramedic',
		assessedAt: '2026-06-26T18:00',
		careSetting: 'retrieval'
	};
	d.identification = { patientIdentifier: 'RT-100517', ageBand: 'adult', sex: 'male' };
	d.weight.weightKg = 70;
	d.burn.tbsaPercent = 30;
	d.burn.tbsaMethod = 'rule-of-nines';
	// Injured 11 h before assessment → first-8-h window has passed.
	d.injury = { injuryAt: '2026-06-26T07:00', injuryTimeKnown: 'estimated' };
	d.features = { inhalationSuspected: 'no', circumferentialOrDeep: 'no', mechanism: 'electrical' };
	d.note.clinicalNote = 'Delayed presentation from remote site; first-phase window elapsed.';
	return d;
}

/** Child burn — referral at the lower 10% child threshold. 20kg × 18% = 1440 mL. */
function childCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr B. Ahmed',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-26T20:15',
		careSetting: 'intensive-care'
	};
	d.identification = { patientIdentifier: 'PICU-100628', ageBand: 'child', sex: 'female' };
	d.weight.weightKg = 20;
	d.burn.tbsaPercent = 18;
	d.burn.tbsaMethod = 'lund-browder';
	// Injured 3 h before assessment → 5 h remain.
	d.injury = { injuryAt: '2026-06-26T17:15', injuryTimeKnown: 'known' };
	d.features = { inhalationSuspected: 'no', circumferentialOrDeep: 'no', mechanism: 'chemical' };
	d.note.clinicalNote = 'Paediatric chemical burn; above the 10% child referral threshold.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'PFB-2026-0001',
		patientName: 'Osei, Grace',
		assessedDate: '2026-06-24',
		data: moderateAdultCase()
	},
	{
		id: 'PFB-2026-0002',
		patientName: 'Nowak, Zofia',
		assessedDate: '2026-06-25',
		data: largeBurnCase()
	},
	{
		id: 'PFB-2026-0003',
		patientName: 'Mackenzie, Ian',
		assessedDate: '2026-06-26',
		data: overdueCase()
	},
	{
		id: 'PFB-2026-0004',
		patientName: 'Ahmed, Bilal',
		assessedDate: '2026-06-26',
		data: childCase()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateParkland(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		total24hVolumeMl: g.total24hVolumeMl,
		first8hRateMlPerHour: g.first8hRateMlPerHour,
		status: g.status,
		flagCount: g.flaggedIssues.length
	};
});
