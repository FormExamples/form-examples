import type {
	AssessmentData,
	Change,
	Control,
	Demands,
	DomainKey,
	ManagerSupport,
	PeerSupport,
	Relationships,
	RiskLevel,
	Role
} from '#lib/engine/types.js';
import { gradeStress, DOMAIN_KEYS } from '#lib/engine/stress-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';
import { departmentLabel, tenureBandLabel, domainTitle, riskLevelRank } from '#lib/engine/utils.js';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	/** Anonymised response label shown on the dashboard. */
	responseLabel: string;
	submittedDate: string;
	data: AssessmentData;
}

/** A row in the occupational-health dashboard, derived by running the engine. */
export interface DashboardRow {
	id: string;
	responseLabel: string;
	department: string;
	tenureBand: string;
	submittedDate: string;
	overallRisk: RiskLevel;
	worstDomain: string;
	answeredCount: number;
	flagCount: number;
}

/** Fill a whole domain section with one raw Likert value. */
function fill<T>(keys: readonly (keyof T)[], value: number): T {
	const out = {} as T;
	for (const k of keys) out[k] = value as T[keyof T];
	return out;
}

const demandKeys = ['dem1', 'dem2', 'dem3', 'dem4', 'dem5', 'dem6', 'dem7', 'dem8'] as const;
const controlKeys = ['ctrl1', 'ctrl2', 'ctrl3', 'ctrl4', 'ctrl5', 'ctrl6'] as const;
const msKeys = ['ms1', 'ms2', 'ms3', 'ms4', 'ms5'] as const;
const psKeys = ['ps1', 'ps2', 'ps3', 'ps4'] as const;
const relKeys = ['rel1', 'rel2', 'rel3', 'rel4'] as const;
const roleKeys = ['role1', 'role2', 'role3', 'role4', 'role5'] as const;
const chgKeys = ['chg1', 'chg2', 'chg3'] as const;

/** Low concern: positive scores throughout, negatively-worded items rated "never". */
function lowConcern(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { department: 'finance', tenureBand: '5-to-10-years', hoursBand: 'full-time-35-to-44' };
	d.demands = fill<Demands>([...demandKeys], 1); // "Never" → reverse-coded to 5.0
	d.control = fill<Control>([...controlKeys], 5);
	d.managerSupport = fill<ManagerSupport>([...msKeys], 5);
	d.peerSupport = fill<PeerSupport>([...psKeys], 5);
	d.relationships = fill<Relationships>([...relKeys], 1); // "Never" → reverse-coded to 5.0
	d.role = fill<Role>([...roleKeys], 5);
	d.change = fill<Change>([...chgKeys], 4);
	d.additionalComments.otherComments = 'Generally a supportive team to work in.';
	return d;
}

/** Moderate concern: middling responses across most domains. */
function moderateConcern(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { department: 'customer-service', tenureBand: '1-to-3-years', hoursBand: 'full-time-35-to-44' };
	d.demands = fill<Demands>([...demandKeys], 3); // reverse-coded to 3.0
	d.control = fill<Control>([...controlKeys], 4);
	d.managerSupport = fill<ManagerSupport>([...msKeys], 4);
	d.peerSupport = fill<PeerSupport>([...psKeys], 4);
	d.relationships = fill<Relationships>([...relKeys], 2); // reverse-coded to 4.0
	d.role = fill<Role>([...roleKeys], 4);
	d.change = fill<Change>([...chgKeys], 3);
	d.additionalComments.mostStressfulAspect = 'Busy phone queues during peak periods.';
	return d;
}

/** High concern: heavy demands and weak support / change management. */
function highConcern(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { department: 'operations', tenureBand: '3-to-5-years', hoursBand: 'long-hours-45-plus' };
	d.demands = fill<Demands>([...demandKeys], 4); // "Often" → reverse-coded to 2.0
	d.control = fill<Control>([...controlKeys], 3);
	d.managerSupport = fill<ManagerSupport>([...msKeys], 3); // cascading domain at high concern
	d.peerSupport = fill<PeerSupport>([...psKeys], 3);
	d.relationships = fill<Relationships>([...relKeys], 2);
	d.role = fill<Role>([...roleKeys], 3); // cascading domain at high concern
	d.change = fill<Change>([...chgKeys], 2);
	d.additionalComments.mostStressfulAspect = 'Constant deadline pressure and no spare capacity.';
	d.additionalComments.suggestionsForImprovement = 'More staff and clearer priorities.';
	return d;
}

/** Very high concern: extreme demands, reported bullying, distress wording. */
function veryHighConcern(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { department: 'clinical', tenureBand: 'less-than-1-year', hoursBand: 'long-hours-45-plus' };
	d.demands = fill<Demands>([...demandKeys], 5); // "Always" → reverse-coded to 1.0
	d.control = fill<Control>([...controlKeys], 2);
	d.managerSupport = fill<ManagerSupport>([...msKeys], 2);
	d.peerSupport = fill<PeerSupport>([...psKeys], 2);
	d.relationships = { rel1: 5, rel2: 4, rel3: 5, rel4: 4 }; // harassment + bullying reported
	d.role = fill<Role>([...roleKeys], 2);
	d.change = fill<Change>([...chgKeys], 1);
	d.additionalComments.mostStressfulAspect = 'I feel hopeless and cannot cope with the workload.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'WSA-2026-0001', responseLabel: 'Response 0001', submittedDate: '2026-06-10', data: lowConcern() },
	{ id: 'WSA-2026-0002', responseLabel: 'Response 0002', submittedDate: '2026-06-12', data: moderateConcern() },
	{ id: 'WSA-2026-0003', responseLabel: 'Response 0003', submittedDate: '2026-06-15', data: highConcern() },
	{ id: 'WSA-2026-0004', responseLabel: 'Response 0004', submittedDate: '2026-06-18', data: veryHighConcern() }
];

/** The worst-scoring (highest-concern) domain title for a graded assessment. */
function worstDomainTitle(
	domains: Record<DomainKey, { category: RiskLevel; mean: number | null }>
): string {
	let worstKey: DomainKey | null = null;
	let worstRank = -1;
	let worstMean = Infinity;
	for (const key of DOMAIN_KEYS) {
		const r = domains[key];
		if (!r || !r.category) continue;
		const rank = riskLevelRank(r.category);
		const mean = r.mean ?? Infinity;
		if (rank > worstRank || (rank === worstRank && mean < worstMean)) {
			worstRank = rank;
			worstMean = mean;
			worstKey = key;
		}
	}
	return worstKey ? domainTitle(worstKey) : '—';
}

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeStress(s.data);
	return {
		id: s.id,
		responseLabel: s.responseLabel,
		department: departmentLabel(s.data.demographics.department),
		tenureBand: tenureBandLabel(s.data.demographics.tenureBand),
		submittedDate: s.submittedDate,
		overallRisk: g.overallRisk,
		worstDomain: worstDomainTitle(g.domains),
		answeredCount: g.answeredCount,
		flagCount: g.additionalFlags.length
	};
});
