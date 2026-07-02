import type { BloodspotScreening, OverallOutcome, ReferralStatus, Sex } from '$lib/engine/types';
import { gradeBloodspot } from '$lib/engine/bloodspot-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample screening: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	babyName: string;
	recordDate: string;
	data: BloodspotScreening;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	nhsNumber: string;
	babyName: string;
	sex: Sex;
	overallOutcome: OverallOutcome;
	referralStatus: ReferralStatus;
	ageAtSampleDays: number | null;
	referralCount: number;
	flagCount: number;
	recordDate: string;
}

/** All-not-suspected — an adequate day-5 sample; every condition negative. */
function allNotSuspected(): BloodspotScreening {
	const d = createDefaultAssessment();
	d.sampleTaker = {
		sampleTakerName: 'J. Okonkwo',
		sampleTakerRole: 'midwife',
		careSetting: 'community',
		recordDate: '2026-06-06'
	};
	d.babyId = {
		nhsNumber: '943 476 5919',
		babyName: 'Baby Ahmed',
		dateOfBirth: '2026-06-01',
		timeOfBirth: '03:20',
		sex: 'male',
		gestationWeeks: 39
	};
	d.eligibility = { previouslyScreened: 'no', consentGiven: 'yes', declineReason: '' };
	d.sampleEvent = {
		sampleDate: '2026-06-06',
		sampleTime: '10:15',
		ageAtSampleDays: 5,
		samplingSite: 'heel',
		sampleNotes: 'Well baby; four good spots on the card.'
	};
	d.sampleQuality = {
		sampleAdequacy: 'adequate',
		spotQualityIssue: 'none',
		isRepeat: 'no',
		repeatReason: 'not-applicable'
	};
	d.conditions = {
		scdResult: 'not-suspected',
		cfResult: 'not-suspected',
		chtResult: 'not-suspected',
		pkuResult: 'not-suspected',
		mcaddResult: 'not-suspected',
		msudResult: 'not-suspected',
		ivaResult: 'not-suspected',
		ga1Result: 'not-suspected',
		hcuResult: 'not-suspected'
	};
	d.summary.clinicalContext = 'Routine day-5 heel-prick; results negative; parents informed.';
	return d;
}

/** Referral required — CF suspected; urgent referral to the CF centre. */
function referralRequired(): BloodspotScreening {
	const d = createDefaultAssessment();
	d.sampleTaker = {
		sampleTakerName: 'A. Rahman',
		sampleTakerRole: 'health-visitor',
		careSetting: 'home',
		recordDate: '2026-06-07'
	};
	d.babyId = {
		nhsNumber: '721 938 4102',
		babyName: 'Baby Okafor',
		dateOfBirth: '2026-06-01',
		timeOfBirth: '18:05',
		sex: 'female',
		gestationWeeks: 38
	};
	d.eligibility = { previouslyScreened: 'no', consentGiven: 'yes', declineReason: '' };
	d.sampleEvent = {
		sampleDate: '2026-06-07',
		sampleTime: '09:40',
		ageAtSampleDays: 6,
		samplingSite: 'heel',
		sampleNotes: ''
	};
	d.sampleQuality = {
		sampleAdequacy: 'adequate',
		spotQualityIssue: 'none',
		isRepeat: 'no',
		repeatReason: 'not-applicable'
	};
	d.conditions = {
		scdResult: 'not-suspected',
		cfResult: 'suspected',
		chtResult: 'not-suspected',
		pkuResult: 'not-suspected',
		mcaddResult: 'not-suspected',
		msudResult: 'not-suspected',
		ivaResult: 'not-suspected',
		ga1Result: 'not-suspected',
		hcuResult: 'not-suspected'
	};
	d.summary.clinicalContext = 'CF screen positive; urgent referral to the regional CF centre made.';
	return d;
}

/** Repeat required — inadequate day-4 sample; repeat needed. */
function repeatRequired(): BloodspotScreening {
	const d = createDefaultAssessment();
	d.sampleTaker = {
		sampleTakerName: 'B. Ahmed',
		sampleTakerRole: 'neonatal-nurse',
		careSetting: 'neonatal-unit',
		recordDate: '2026-06-05'
	};
	d.babyId = {
		nhsNumber: '384 615 7230',
		babyName: 'Baby Nguyen',
		dateOfBirth: '2026-06-01',
		timeOfBirth: '11:50',
		sex: 'male',
		gestationWeeks: 35
	};
	d.eligibility = { previouslyScreened: 'no', consentGiven: 'yes', declineReason: '' };
	d.sampleEvent = {
		sampleDate: '2026-06-05',
		sampleTime: '14:00',
		ageAtSampleDays: 4,
		samplingSite: 'heel',
		sampleNotes: 'Spots too small; card only partly filled.'
	};
	d.sampleQuality = {
		sampleAdequacy: 'inadequate',
		spotQualityIssue: 'insufficient',
		isRepeat: 'yes',
		repeatReason: 'too-early'
	};
	d.conditions = {
		scdResult: 'repeat-required',
		cfResult: 'repeat-required',
		chtResult: 'repeat-required',
		pkuResult: 'repeat-required',
		mcaddResult: 'repeat-required',
		msudResult: 'repeat-required',
		ivaResult: 'repeat-required',
		ga1Result: 'repeat-required',
		hcuResult: 'repeat-required'
	};
	d.summary.clinicalContext = 'Sample taken early and insufficient; repeat arranged for day 5–8.';
	return d;
}

/** Incomplete — most results still pending in the laboratory. */
function incompleteScreen(): BloodspotScreening {
	const d = createDefaultAssessment();
	d.sampleTaker = {
		sampleTakerName: 'C. Silva',
		sampleTakerRole: 'midwife',
		careSetting: 'hospital',
		recordDate: '2026-06-06'
	};
	d.babyId = {
		nhsNumber: '835 162 4097',
		babyName: 'Baby Thompson',
		dateOfBirth: '2026-06-01',
		timeOfBirth: '07:10',
		sex: 'female',
		gestationWeeks: 40
	};
	d.eligibility = { previouslyScreened: 'no', consentGiven: 'yes', declineReason: '' };
	d.sampleEvent = {
		sampleDate: '2026-06-06',
		sampleTime: '08:30',
		ageAtSampleDays: 5,
		samplingSite: 'heel',
		sampleNotes: 'Sample sent to laboratory; results awaited.'
	};
	d.sampleQuality = {
		sampleAdequacy: 'adequate',
		spotQualityIssue: 'none',
		isRepeat: 'no',
		repeatReason: 'not-applicable'
	};
	d.conditions = {
		scdResult: 'not-suspected',
		cfResult: 'pending',
		chtResult: 'pending',
		pkuResult: 'pending',
		mcaddResult: 'pending',
		msudResult: 'pending',
		ivaResult: 'pending',
		ga1Result: 'pending',
		hcuResult: 'pending'
	};
	d.summary.clinicalContext = 'Sample in the laboratory; most results outstanding — follow up.';
	return d;
}

/** The sample screenings, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'NBS-2026-0001', babyName: 'Ahmed', recordDate: '2026-06-06', data: allNotSuspected() },
	{ id: 'NBS-2026-0002', babyName: 'Okafor', recordDate: '2026-06-07', data: referralRequired() },
	{ id: 'NBS-2026-0003', babyName: 'Nguyen', recordDate: '2026-06-05', data: repeatRequired() },
	{ id: 'NBS-2026-0004', babyName: 'Thompson', recordDate: '2026-06-06', data: incompleteScreen() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeBloodspot(s.data);
	return {
		id: s.id,
		nhsNumber: s.data.babyId.nhsNumber,
		babyName: s.babyName,
		sex: s.data.babyId.sex,
		overallOutcome: g.overallOutcome,
		referralStatus: g.referralStatus,
		ageAtSampleDays: g.ageAtSampleDays,
		referralCount: g.referrals.length,
		flagCount: g.flaggedIssues.length,
		recordDate: s.recordDate
	};
});
