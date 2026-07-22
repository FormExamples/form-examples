import type { PatientReportedOutcomeMeasures } from '$lib/engine/types';
import { computeAllScores } from '$lib/engine/composite';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample visit: an identifier and the full battery the engine scores. */
export interface SampleVisit {
	id: string;
	subjectName: string;
	data: PatientReportedOutcomeMeasures;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	subjectId: string;
	subjectName: string;
	visit: string;
	assessmentDate: string;
	sf36Pcs: number | null;
	sf36Mcs: number | null;
	ndiPercentage: number | null;
	ndiBand: string;
	mjoaTotal: number | null;
	mjoaBand: string;
	eq5dIndex: number | null;
}

/** A fully-answered baseline visit, all four instruments complete. */
function baselineComplete(): PatientReportedOutcomeMeasures {
	const d = createDefaultAssessment();
	d.visitDetails = { subjectId: 'SUBJ-1001', visit: 'Baseline', assessmentDate: '2026-04-02' };
	d.sf36 = {
		generalHealth: 4,
		healthChangeVsYearAgo: 4,
		vigorousActivities: 1,
		moderateActivities: 2,
		liftingCarryingGroceries: 2,
		climbingSeveralFlights: 1,
		climbingOneFlight: 2,
		bendingKneelingStooping: 1,
		walkingMoreThanMile: 1,
		walkingSeveralHundredYards: 2,
		walkingOneHundredYards: 2,
		bathingDressing: 2,
		cutDownTimePhysical: 2,
		accomplishedLessPhysical: 2,
		limitedInKindPhysical: 2,
		difficultyPerformingPhysical: 2,
		cutDownTimeEmotional: 3,
		accomplishedLessEmotional: 3,
		lessCarefulThanUsual: 3,
		socialActivitiesInterference: 4,
		bodilyPain: 5,
		painInterferenceWithWork: 4,
		feltFullOfLife: 3,
		veryNervous: 3,
		soDownInDumps: 3,
		feltCalmPeaceful: 3,
		lotOfEnergy: 3,
		downheartedDepressed: 3,
		feltWornOut: 4,
		beenHappy: 3,
		feltTired: 4,
		socialActivitiesInterferenceTime: 3,
		getSickEasier: 3,
		asHealthyAsAnybody: 3,
		expectHealthWorse: 3,
		healthExcellent: 3
	};
	d.ndi = {
		painIntensity: 3,
		personalCare: 2,
		lifting: 3,
		reading: 2,
		headache: 2,
		concentration: 2,
		work: 3,
		driving: 2,
		sleeping: 3,
		recreation: 2
	};
	d.mjoa = {
		motorArms: 3,
		motorLegs: 3,
		sensationArms: 1,
		sensationLegs: 1,
		sensationTrunk: 2,
		bladderFunction: 2
	};
	d.eq5d = {
		mobility: 2,
		selfCare: 1,
		usualActivities: 2,
		painDiscomfort: 3,
		anxietyDepression: 2,
		vasScore: 55
	};
	return d;
}

/** A 6-week follow-up visit, showing improvement over baseline. */
function sixWeekImproved(): PatientReportedOutcomeMeasures {
	const d = createDefaultAssessment();
	d.visitDetails = { subjectId: 'SUBJ-1001', visit: '6-week', assessmentDate: '2026-05-14' };
	d.sf36 = {
		generalHealth: 2,
		healthChangeVsYearAgo: 2,
		vigorousActivities: 2,
		moderateActivities: 3,
		liftingCarryingGroceries: 3,
		climbingSeveralFlights: 2,
		climbingOneFlight: 3,
		bendingKneelingStooping: 2,
		walkingMoreThanMile: 2,
		walkingSeveralHundredYards: 3,
		walkingOneHundredYards: 3,
		bathingDressing: 3,
		cutDownTimePhysical: 4,
		accomplishedLessPhysical: 4,
		limitedInKindPhysical: 4,
		difficultyPerformingPhysical: 4,
		cutDownTimeEmotional: 4,
		accomplishedLessEmotional: 4,
		lessCarefulThanUsual: 4,
		socialActivitiesInterference: 2,
		bodilyPain: 3,
		painInterferenceWithWork: 2,
		feltFullOfLife: 2,
		veryNervous: 4,
		soDownInDumps: 4,
		feltCalmPeaceful: 2,
		lotOfEnergy: 2,
		downheartedDepressed: 4,
		feltWornOut: 2,
		beenHappy: 2,
		feltTired: 2,
		socialActivitiesInterferenceTime: 4,
		getSickEasier: 4,
		asHealthyAsAnybody: 2,
		expectHealthWorse: 4,
		healthExcellent: 2
	};
	d.ndi = {
		painIntensity: 1,
		personalCare: 1,
		lifting: 2,
		reading: 1,
		headache: 1,
		concentration: 1,
		work: 2,
		driving: 1,
		sleeping: 1,
		recreation: 1
	};
	d.mjoa = {
		motorArms: 4,
		motorLegs: 4,
		sensationArms: 2,
		sensationLegs: 2,
		sensationTrunk: 2,
		bladderFunction: 3
	};
	d.eq5d = {
		mobility: 1,
		selfCare: 1,
		usualActivities: 1,
		painDiscomfort: 2,
		anxietyDepression: 1,
		vasScore: 78
	};
	return d;
}

/** A partially-answered in-progress visit (SF-36 + NDI only). */
function partiallyAnswered(): PatientReportedOutcomeMeasures {
	const d = createDefaultAssessment();
	d.visitDetails = { subjectId: 'SUBJ-2077', visit: 'Baseline', assessmentDate: '2026-06-01' };
	d.sf36.generalHealth = 3;
	d.sf36.vigorousActivities = 1;
	d.sf36.moderateActivities = 2;
	d.sf36.bodilyPain = 4;
	d.ndi = {
		painIntensity: 4,
		personalCare: 3,
		lifting: 4,
		reading: null,
		headache: null,
		concentration: null,
		work: null,
		driving: null,
		sleeping: null,
		recreation: null
	};
	return d;
}

/** A brand-new, fully-blank visit (nothing answered yet). */
function blank(): PatientReportedOutcomeMeasures {
	const d = createDefaultAssessment();
	d.visitDetails = { subjectId: 'SUBJ-3090', visit: '3-month', assessmentDate: '' };
	return d;
}

/** The sample visits, keyed by stable id (used to seed the wizard). */
export const sampleVisits: SampleVisit[] = [
	{ id: 'PROM-2026-0001', subjectName: 'Adeyemi, Grace', data: baselineComplete() },
	{ id: 'PROM-2026-0002', subjectName: 'Adeyemi, Grace', data: sixWeekImproved() },
	{ id: 'PROM-2026-0003', subjectName: 'Novak, Peter', data: partiallyAnswered() },
	{ id: 'PROM-2026-0004', subjectName: 'Ferreira, Ana', data: blank() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleVisitRows: DashboardRow[] = sampleVisits.map((s) => {
	const result = computeAllScores(s.data);
	return {
		id: s.id,
		subjectId: s.data.visitDetails.subjectId,
		subjectName: s.subjectName,
		visit: s.data.visitDetails.visit,
		assessmentDate: s.data.visitDetails.assessmentDate,
		sf36Pcs: result.sf36.pcsApprox,
		sf36Mcs: result.sf36.mcsApprox,
		ndiPercentage: result.ndi.percentageScore,
		ndiBand: result.ndi.band,
		mjoaTotal: result.mjoa.totalScore,
		mjoaBand: result.mjoa.band,
		eq5dIndex: result.eq5d.ukIndexValue
	};
});
