import type { AssessmentData, CompletenessStatus } from '#lib/engine/types.js';
import { calculateHealthCheckGrade } from '#lib/engine/ld-health-check-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample check: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	personName: string;
	checkedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	personIdentifier: string;
	personName: string;
	practiceName: string;
	status: CompletenessStatus;
	completenessPercent: number;
	healthActionPlanComplete: boolean;
	stompFlag: boolean;
	highFlagCount: number;
	flagCount: number;
	checkedDate: string;
}

/** Complete — every component done, no problem findings, plan produced and shared. */
function completeNoFlags(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Sister J. Okafor',
		clinicianRole: 'practice-nurse',
		checkedOn: '2026-06-22',
		practiceName: 'Meadow Lane Surgery',
		easyReadInvitationSent: 'yes',
		preCheckDone: 'yes'
	};
	d.identification = {
		personIdentifier: 'NHS 401 234 5678',
		ageBand: '25-44',
		sex: 'female',
		ldRegisterStatus: 'on-register',
		mainCarer: 'Sister (paid support alongside)'
	};
	d.adjustments = {
		communicationNeeds: 'Easy-read materials, longer appointment, quiet room.',
		reasonableAdjustmentsRecorded: 'yes',
		healthPassport: 'yes',
		consentCapacityNote: 'Consent obtained; capacity for the check confirmed.'
	};
	d.physical = {
		weightBmiStatus: 'recorded',
		bmi: 24.5,
		bloodPressureStatus: 'normal',
		epilepsyStatus: 'not-applicable',
		constipationStatus: 'none',
		dysphagiaStatus: 'none',
		continenceStatus: 'ok',
		mobilityFallsStatus: 'ok',
		dentalStatus: 'ok',
		visionStatus: 'ok',
		hearingStatus: 'ok',
		footHealthStatus: 'ok',
		skinStatus: 'ok',
		physicalHealthActions: 'No new physical-health problems found this year.'
	};
	d.screening = {
		cancerScreeningStatus: 'up-to-date',
		otherScreeningStatus: 'up-to-date',
		immunisationStatus: 'up-to-date'
	};
	d.medication = {
		medicationReconciled: 'yes',
		psychotropicPrescribed: 'no',
		psychotropicIndication: '',
		psychotropicLastReviewed: '',
		stompDiscussed: 'not-applicable',
		medicationSideEffects: 'No repeat medicines; nothing to review.'
	};
	d.mental = {
		mentalHealthStatus: 'ok',
		behaviourStatus: 'none',
		behaviourTriggers: ''
	};
	d.syndrome = { syndromeSpecificStatus: 'not-applicable' };
	d.carer = {
		carerNeedsStatus: 'assessed',
		socialCircumstances: 'Supported living; attends a day service four days a week.'
	};
	d.plan = {
		healthActionPlanProduced: 'yes',
		healthActionPlanShared: 'yes',
		healthActionPlanActions:
			'Stay active, keep dental check-ups, and return next year for the annual check.',
		clinicianNote: 'Well person; annual health check completed in full.'
	};
	return d;
}

/** Complete — full check with a psychotropic that IS reviewed (no STOMP flag). */
function completeManagedStomp(): AssessmentData {
	const d = completeNoFlags();
	d.context = {
		clinicianName: 'Dr I. Mackenzie',
		clinicianRole: 'gp',
		checkedOn: '2026-06-24',
		practiceName: 'Riverside Health Centre',
		easyReadInvitationSent: 'yes',
		preCheckDone: 'no'
	};
	d.identification = {
		personIdentifier: 'NHS 552 987 1234',
		ageBand: '45-64',
		sex: 'male',
		ldRegisterStatus: 'on-register',
		mainCarer: 'Paid supporter'
	};
	d.physical.bmi = 29.1;
	d.medication = {
		medicationReconciled: 'yes',
		psychotropicPrescribed: 'yes',
		psychotropicIndication: 'Long-standing anxiety; risperidone reviewed under STOMP.',
		psychotropicLastReviewed: '2026-05-30',
		stompDiscussed: 'yes',
		medicationSideEffects: 'No new side effects; weight and metabolic monitoring done.'
	};
	d.syndrome = { syndromeSpecificStatus: 'done' };
	d.plan.clinicianNote =
		'Psychotropic reviewed under STOMP with the person and carer; continue with monitoring.';
	return d;
}

/** Incomplete — STOMP flag (psychotropic without indication or review) and plan not shared. */
function incompleteStomp(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'HCA T. Bianchi',
		clinicianRole: 'healthcare-assistant',
		checkedOn: '2026-06-25',
		practiceName: 'Meadow Lane Surgery',
		easyReadInvitationSent: 'no',
		preCheckDone: 'no'
	};
	d.identification = {
		personIdentifier: 'NHS 660 111 2233',
		ageBand: '18-24',
		sex: 'male',
		ldRegisterStatus: 'on-register',
		mainCarer: 'Parents'
	};
	d.adjustments = {
		communicationNeeds: 'Uses Makaton; short sentences.',
		reasonableAdjustmentsRecorded: 'yes',
		healthPassport: 'no',
		consentCapacityNote: 'Best-interests decision recorded for the check.'
	};
	d.physical = {
		weightBmiStatus: 'recorded',
		bmi: 31.4,
		bloodPressureStatus: 'normal',
		epilepsyStatus: 'reviewed',
		constipationStatus: 'none',
		dysphagiaStatus: 'none',
		continenceStatus: 'ok',
		mobilityFallsStatus: 'ok',
		dentalStatus: 'not-assessed',
		visionStatus: 'ok',
		hearingStatus: 'not-assessed',
		footHealthStatus: 'ok',
		skinStatus: 'ok',
		physicalHealthActions: 'Arrange dental and hearing checks after this visit.'
	};
	d.screening = {
		cancerScreeningStatus: 'not-eligible',
		otherScreeningStatus: 'not-recorded',
		immunisationStatus: 'up-to-date'
	};
	d.medication = {
		medicationReconciled: 'yes',
		psychotropicPrescribed: 'yes',
		psychotropicIndication: '', // missing — triggers STOMP
		psychotropicLastReviewed: '', // no review date — triggers STOMP
		stompDiscussed: 'no', // not discussed — triggers STOMP
		medicationSideEffects: ''
	};
	d.mental = {
		mentalHealthStatus: 'concern',
		behaviourStatus: 'challenging',
		behaviourTriggers: 'Change of routine; noisy environments.'
	};
	d.syndrome = { syndromeSpecificStatus: 'not-done' };
	d.carer = {
		carerNeedsStatus: 'not-assessed',
		socialCircumstances: 'Lives with parents.'
	};
	d.plan = {
		healthActionPlanProduced: 'yes',
		healthActionPlanShared: 'no', // produced but not shared — HAP gate fails
		healthActionPlanActions: 'Book STOMP medication review; complete dental and hearing checks.',
		clinicianNote: 'Several components outstanding; needs a follow-up appointment.'
	};
	return d;
}

/** Incomplete — early in the check with a dysphagia / choking risk and no plan yet. */
function incompleteDysphagia(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse P. Adeyemi',
		clinicianRole: 'ld-team',
		checkedOn: '2026-06-26',
		practiceName: 'Riverside Health Centre',
		easyReadInvitationSent: 'yes',
		preCheckDone: 'yes'
	};
	d.identification = {
		personIdentifier: 'NHS 771 555 8899',
		ageBand: '65+',
		sex: 'female',
		ldRegisterStatus: 'on-register',
		mainCarer: 'Care-home staff'
	};
	d.adjustments = {
		communicationNeeds: 'Non-verbal; responds to familiar staff and objects of reference.',
		reasonableAdjustmentsRecorded: 'yes',
		healthPassport: 'yes',
		consentCapacityNote: 'Best-interests process; care-home manager consulted.'
	};
	d.physical = {
		weightBmiStatus: 'recorded',
		bmi: 18.2,
		bloodPressureStatus: 'raised',
		epilepsyStatus: 'reviewed',
		constipationStatus: 'present',
		dysphagiaStatus: 'present',
		continenceStatus: 'issue',
		mobilityFallsStatus: 'issue',
		dentalStatus: 'not-assessed',
		visionStatus: 'not-assessed',
		hearingStatus: 'not-assessed',
		footHealthStatus: 'ok',
		skinStatus: 'ok',
		physicalHealthActions: '' // problems recorded without any action → unaddressed flag
	};
	d.screening = {
		cancerScreeningStatus: 'not-recorded',
		otherScreeningStatus: 'not-recorded',
		immunisationStatus: 'not-recorded'
	};
	d.medication = {
		medicationReconciled: 'yes',
		psychotropicPrescribed: 'no',
		psychotropicIndication: '',
		psychotropicLastReviewed: '',
		stompDiscussed: 'not-applicable',
		medicationSideEffects: ''
	};
	d.mental = {
		mentalHealthStatus: 'not-assessed',
		behaviourStatus: 'not-assessed',
		behaviourTriggers: ''
	};
	d.syndrome = { syndromeSpecificStatus: '' };
	d.carer = { carerNeedsStatus: '', socialCircumstances: '' };
	d.plan = {
		healthActionPlanProduced: 'no', // no plan yet → high flag + gate fails
		healthActionPlanShared: 'no',
		healthActionPlanActions: '',
		clinicianNote: 'Check paused; urgent swallowing and blood-pressure concerns to action first.'
	};
	return d;
}

/** The sample checks, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'LDAHC-2026-0001',
		personName: 'Adeyemi, Grace',
		checkedDate: '2026-06-22',
		data: completeNoFlags()
	},
	{
		id: 'LDAHC-2026-0002',
		personName: 'Mackenzie, Ian',
		checkedDate: '2026-06-24',
		data: completeManagedStomp()
	},
	{
		id: 'LDAHC-2026-0003',
		personName: 'Bianchi, Tomas',
		checkedDate: '2026-06-25',
		data: incompleteStomp()
	},
	{
		id: 'LDAHC-2026-0004',
		personName: 'Novak, Petra',
		checkedDate: '2026-06-26',
		data: incompleteDysphagia()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateHealthCheckGrade(s.data);
	return {
		id: s.id,
		personIdentifier: s.data.identification.personIdentifier,
		personName: s.personName,
		practiceName: s.data.context.practiceName,
		status: g.status,
		completenessPercent: g.completenessPercent,
		healthActionPlanComplete: g.healthActionPlanComplete,
		stompFlag: g.flags.some((f) => f.category === 'stomp'),
		highFlagCount: g.flags.filter((f) => f.priority === 'high').length,
		flagCount: g.flags.length,
		checkedDate: s.checkedDate
	};
});
