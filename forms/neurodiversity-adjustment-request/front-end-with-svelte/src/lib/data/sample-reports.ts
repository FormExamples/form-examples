import type { NeurodiversityAdjustmentRequest, RequestRow } from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/stores/result.svelte.js';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	workerName: string;
	requestDate: string;
	request: NeurodiversityAdjustmentRequest;
}

/**
 * A routine request: an autistic developer needing noise-cancelling headphones
 * and a quiet desk. Diagnosed, substantial long-term impact, consent given,
 * moderate impact — grades to likely-covered / caution / high completeness /
 * soon, with the disability-duty and Access-to-Work flags.
 */
function autisticDeveloperRequest(): NeurodiversityAdjustmentRequest {
	return {
		...createDefaultRequest(),
		workerName: 'Sam Okafor',
		workerJobTitle: 'Software developer',
		workerDepartment: 'Engineering',
		employmentType: 'permanent',
		workPattern: 'full-time',
		workLocation: 'hybrid',
		employmentStartDate: '2022-09-05',
		employeeReference: 'EMP-10442',
		workerEmail: 'sam.okafor@example.com',
		managerName: 'Priya Shah',
		managerRole: 'line-manager',
		managerJobTitle: 'Engineering manager',
		managerDepartment: 'Engineering',
		status: 'submitted',
		requestedBy: 'worker',
		requestDate: '2026-06-09',
		conditionAutism: true,
		diagnosisStatus: 'diagnosed',
		considersDisability: 'yes',
		substantialLongTermImpact: true,
		disclosureConsent: true,
		difficultyConcentration: true,
		difficultySensoryOverload: true,
		tasksSituationsAffected:
			'The open-plan office is overwhelming; background noise and movement make focused coding and code review very difficult.',
		workerStrengths: 'Deep focus on complex problems, strong systems thinking, meticulous attention to detail.',
		adjustmentWorkingEnvironment: true,
		adjustmentEquipmentTechnology: true,
		adjustmentsRequestedDetail:
			'Noise-cancelling headphones and a quiet desk away from the main walkway; option to book a focus room for deep work.',
		supportingEvidenceType: 'diagnostic-report',
		currentImpact: 'moderate',
		urgency: 'soon'
	};
}

/**
 * A soon request: an ADHD employee needing written instructions and flexible
 * hours. Self-identified, high impact, burnout difficulty. Grades to
 * possibly-covered / caution / soon.
 */
function adhdFlexibleHoursRequest(): NeurodiversityAdjustmentRequest {
	return {
		...createDefaultRequest(),
		workerName: 'Chloe Bennett',
		workerJobTitle: 'Customer support lead',
		workerDepartment: 'Operations',
		employmentType: 'permanent',
		workPattern: 'full-time',
		workLocation: 'office',
		employmentStartDate: '2021-02-15',
		employeeReference: 'EMP-20871',
		workerEmail: 'chloe.bennett@example.com',
		managerName: 'David Osei',
		managerRole: 'hr-adviser',
		managerJobTitle: 'HR adviser',
		managerDepartment: 'People and Culture',
		status: 'submitted',
		requestedBy: 'worker',
		requestDate: '2026-06-11',
		conditionAdhd: true,
		diagnosisStatus: 'self-identified',
		considersDisability: 'unsure',
		disclosureConsent: true,
		difficultyOrganisationTime: true,
		difficultyWrittenCommunication: true,
		difficultyBurnoutWellbeing: true,
		tasksSituationsAffected:
			'Verbally-given, multi-step instructions are easy to lose track of; rigid start times clash with medication timing.',
		workerStrengths: 'High energy, creative problem solving, excellent in fast-moving customer situations.',
		adjustmentCommunication: true,
		adjustmentWorkingArrangements: true,
		adjustmentsRequestedDetail:
			'Instructions and actions confirmed in writing and broken into clear steps; flexible start time within a one-hour window.',
		supportingEvidenceType: 'none',
		currentImpact: 'high',
		urgency: 'soon'
	};
}

/**
 * An urgent request: a worker awaiting an autism assessment at risk of burnout.
 * Substantial long-term impact, at risk of absence, no occupational-health
 * input. Grades to likely-covered / high-risk / urgent with the burnout and
 * occupational-health flags.
 */
function awaitingAssessmentBurnoutRequest(): NeurodiversityAdjustmentRequest {
	return {
		...createDefaultRequest(),
		workerName: 'Jordan Blake',
		workerJobTitle: 'Data analyst',
		workerDepartment: 'Finance',
		employmentType: 'permanent',
		workPattern: 'full-time',
		workLocation: 'office',
		employmentStartDate: '2019-06-03',
		employeeReference: 'EMP-30219',
		workerEmail: 'jordan.blake@example.com',
		managerName: 'Elaine Foster',
		managerRole: 'line-manager',
		managerJobTitle: 'Finance manager',
		managerDepartment: 'Finance',
		status: 'submitted',
		requestedBy: 'worker',
		requestDate: '2026-06-13',
		conditionAutism: true,
		conditionOther: true,
		conditionOtherDetail: 'Possible ADHD, under assessment.',
		diagnosisStatus: 'awaiting-assessment',
		considersDisability: 'yes',
		substantialLongTermImpact: true,
		disclosureConsent: true,
		difficultyConcentration: true,
		difficultySensoryOverload: true,
		difficultyBurnoutWellbeing: true,
		difficultyOrganisationTime: true,
		tasksSituationsAffected:
			'Constant interruptions and a noisy environment leave no recovery time; workload and sensory load together are becoming unsustainable.',
		workerStrengths: 'Rigorous, thorough analysis and strong pattern recognition across large datasets.',
		adjustmentWorkingEnvironment: true,
		adjustmentWorkingArrangements: true,
		adjustmentPolicyDress: true,
		adjustmentsRequestedDetail:
			'Two remote days per week, planned quiet-focus blocks, protected recovery time, and a phased reduction in interruptions.',
		supportingEvidenceType: 'none',
		occupationalHealthInvolved: false,
		currentImpact: 'severe',
		atRiskOfAbsence: true,
		urgency: 'urgent'
	};
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'NAR-2026-0001',
		workerName: 'Sam Okafor',
		requestDate: '2026-06-09',
		request: autisticDeveloperRequest()
	},
	{
		id: 'NAR-2026-0002',
		workerName: 'Chloe Bennett',
		requestDate: '2026-06-11',
		request: adhdFlexibleHoursRequest()
	},
	{
		id: 'NAR-2026-0003',
		workerName: 'Jordan Blake',
		requestDate: '2026-06-13',
		request: awaitingAssessmentBurnoutRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		workerName: s.workerName,
		workerJobTitle: s.request.workerJobTitle,
		status: s.request.status,
		requestDate: s.requestDate,
		eligibilityBand: g.eligibilityBand,
		impactBand: g.impactBand,
		completenessPercent: g.completenessPercent,
		priorityTier: g.priorityTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
