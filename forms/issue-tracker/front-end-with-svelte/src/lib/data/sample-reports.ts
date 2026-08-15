import type {
	CompositePriority,
	IssueCategory,
	IssueTrackerAssessment
} from '#lib/engine/types.js';
import { gradeIssue } from '#lib/engine/composite-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample issue: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	summary: string;
	reportedDate: string;
	data: IssueTrackerAssessment;
}

/** A row in the triage dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	summary: string;
	reportedDate: string;
	category: IssueCategory;
	environment: string;
	compositePriority: CompositePriority;
	severity: number | null;
	harm: number | null;
	frequency: number | null;
	regulatoryFlag: boolean;
	flagCount: number;
}

/** A low-priority issue: a minor cosmetic defect with limited reach. */
function lowPriority(): IssueTrackerAssessment {
	const d = createDefaultAssessment();
	d.reporter = {
		...d.reporter,
		reporterName: 'Alex Turner',
		reporterEmail: 'alex.turner@example.com',
		reporterRole: 'Support engineer',
		reportedAt: '2026-06-10',
		discoveredAt: '2026-06-10',
		issueCategory: 'software-defect',
		environment: 'production',
		systemName: 'Patient Portal',
		component: 'Profile page'
	};
	d.cc = {
		...d.cc,
		ccSummary: 'Avatar image is slightly misaligned on the profile page',
		ccReportedVia: 'customer'
	};
	d.scores = {
		...d.scores,
		scoreByPriorityRank: 5,
		scoreBySeverityOfImpact: 1,
		scoreByMagnitudeOfDamage: 1,
		scoreByHarmGrade: 0,
		scoreByFailureCondition: 'E',
		scoreByMoscowRequirement: 3,
		scoreByFrequencyPercent: 2
	};
	return d;
}

/** A moderate-priority issue: degraded performance affecting some users. */
function moderatePriority(): IssueTrackerAssessment {
	const d = createDefaultAssessment();
	d.reporter = {
		...d.reporter,
		reporterName: 'Priya Patel',
		reporterEmail: 'priya.patel@example.com',
		reporterRole: 'SRE',
		reportedAt: '2026-06-12',
		discoveredAt: '2026-06-12',
		issueCategory: 'performance',
		environment: 'production',
		systemName: 'Booking API',
		component: 'Search endpoint'
	};
	d.cc = {
		...d.cc,
		ccSummary: 'Search latency elevated during peak hours',
		ccReportedVia: 'monitoring-alert'
	};
	d.pt = { ...d.pt, ptAffectedUsersCount: 1200, ptAssignees: 'Platform team' };
	d.scores = {
		...d.scores,
		scoreByPriorityRank: 3,
		scoreBySeverityOfImpact: 3,
		scoreByMagnitudeOfDamage: 4,
		scoreByHarmGrade: 0,
		scoreByFailureCondition: 'C',
		scoreByMoscowRequirement: 2,
		scoreByFrequencyPercent: 20
	};
	return d;
}

/** A high-priority issue: a partial outage with a mandatory requirement. */
function highPriority(): IssueTrackerAssessment {
	const d = createDefaultAssessment();
	d.reporter = {
		...d.reporter,
		reporterName: 'Margaret Jones',
		reporterEmail: 'margaret.jones@example.com',
		reporterRole: 'On-call lead',
		reportedAt: '2026-06-15',
		discoveredAt: '2026-06-15',
		issueCategory: 'service-outage',
		environment: 'production',
		systemName: 'Payments',
		component: 'Checkout service'
	};
	d.cc = {
		...d.cc,
		ccSummary: 'Checkout failing for a subset of regions',
		ccReportedVia: 'monitoring-alert'
	};
	d.pt = { ...d.pt, ptAffectedUsersCount: 8000, ptAssignees: 'Payments team' };
	d.fx = { ...d.fx, fxFailedServices: 'Checkout, Payment gateway adapter', fxDataCorruption: 'none' };
	d.scores = {
		...d.scores,
		scoreByPriorityRank: 2,
		scoreBySeverityOfImpact: 4,
		scoreByMagnitudeOfDamage: 6,
		scoreByHarmGrade: 1,
		scoreByFailureCondition: 'B',
		scoreByMoscowRequirement: 1,
		scoreByFrequencyPercent: 35
	};
	return d;
}

/** A critical issue: a clinical-safety event with confirmed data loss. */
function critical(): IssueTrackerAssessment {
	const d = createDefaultAssessment();
	d.reporter = {
		...d.reporter,
		reporterName: 'David Williams',
		reporterEmail: 'david.williams@example.com',
		reporterRole: 'Clinical safety officer',
		reportedAt: '2026-06-18',
		discoveredAt: '2026-06-18',
		issueCategory: 'clinical-safety',
		environment: 'production',
		systemName: 'EPR',
		component: 'Medication ordering'
	};
	d.cc = {
		...d.cc,
		ccSummary: 'Incorrect medication dose displayed for paediatric patients',
		ccReportedVia: 'in-person'
	};
	d.pt = { ...d.pt, ptAffectedUsersCount: 50000, ptAssignees: 'Clinical safety, EPR vendor' };
	d.fx = { ...d.fx, fxDataCorruption: 'confirmed', fxBrokenComponents: 'Dose calculator' };
	d.scores = {
		...d.scores,
		scoreByPriorityRank: 1,
		scoreBySeverityOfImpact: 5,
		scoreByMagnitudeOfDamage: 10,
		scoreByHarmGrade: 4,
		scoreByFailureCondition: 'A',
		scoreByMoscowRequirement: 1,
		scoreByFrequencyPercent: 96
	};
	return d;
}

/** The sample issues, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'IT-2026-0001', summary: 'Avatar misalignment on profile page', reportedDate: '2026-06-10', data: lowPriority() },
	{ id: 'IT-2026-0002', summary: 'Search latency elevated at peak', reportedDate: '2026-06-12', data: moderatePriority() },
	{ id: 'IT-2026-0003', summary: 'Checkout failing in some regions', reportedDate: '2026-06-15', data: highPriority() },
	{ id: 'IT-2026-0004', summary: 'Incorrect paediatric medication dose', reportedDate: '2026-06-18', data: critical() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeIssue(s.data);
	return {
		id: s.id,
		summary: s.summary,
		reportedDate: s.reportedDate,
		category: s.data.reporter.issueCategory,
		environment: s.data.reporter.environment,
		compositePriority: g.compositePriority,
		severity: g.scoreBySeverityOfImpact,
		harm: g.scoreByHarmGrade,
		frequency: g.scoreByFrequencyPercent,
		regulatoryFlag: g.additionalFlags.some((f) => f.category === 'regulatory'),
		flagCount: g.additionalFlags.length
	};
});
