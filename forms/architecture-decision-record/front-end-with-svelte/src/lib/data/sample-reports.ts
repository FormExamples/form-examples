import type { AdrFormData, Status, DecisionGroup } from '#lib/types.js';
import { evaluateAdr } from '#lib/engine/adr-engine.js';
import { createDefaultAdrFormData } from '#lib/stores/adr.svelte.js';

/** A sample ADR: an identifier plus the full data the engine evaluates. */
export interface SampleAdr {
	id: string;
	data: AdrFormData;
}

/** A row in the ADR register dashboard, derived by running the engine. */
export interface DashboardRow {
	id: string;
	number: number | null;
	title: string;
	status: Status;
	decisionGroup: DecisionGroup;
	completeness: number;
	chosenPosition: string;
	authorName: string;
	decisionDate: string;
	flagCount: number;
}

/** Approved, fully complete, signed off: a model ADR. */
function approvedComplete(): AdrFormData {
	const d = createDefaultAdrFormData();
	d.author = { ...d.author, name: 'Lin Chen', email: 'lin.chen@example.com', role: 'architect', organizationName: 'Platform', teamName: 'Data' };
	d.organization = { ...d.organization, name: 'Acme Corp', industry: 'fintech', domain: 'acme.example' };
	d.adr = {
		...d.adr,
		slug: 'use-postgres-for-primary-storage',
		number: '1',
		title: 'Use PostgreSQL for primary storage',
		decisionDate: '2026-01-15',
		status: 'approved',
		decisionGroup: 'data',
		issue: 'We need a primary transactional datastore that the whole team understands.',
		decision: 'Adopt PostgreSQL as the system of record for all transactional data.',
		assumptions: 'Relational modelling fits our domain.\nTeam has SQL experience.',
		constraints: 'Must be open source.\nMust run on our managed cloud.',
		argument: 'PostgreSQL is mature, well-supported, and offers JSONB for flexibility.',
		implications: 'Operations must run and back up a Postgres cluster.',
		relatedDecisions: 'ADR-0004 supersedes the MongoDB choice',
		relatedRequirements: 'REQ-12 durable storage',
		relatedArtifacts: 'docs/schema.sql',
		relatedPrinciples: 'Prefer boring, proven technology',
		signedOffBy: 'Lin Chen',
		signedOffAt: '2026-01-15T10:00:00Z'
	};
	d.positions = [
		{ name: 'PostgreSQL', description: 'Relational, JSONB available.', modelOrDiagramUrl: '', isChosen: true, pros: 'Mature\nGreat tooling', cons: 'Manual sharding' },
		{ name: 'MongoDB', description: 'Document store.', modelOrDiagramUrl: '', isChosen: false, pros: 'Flexible schema', cons: 'Weak multi-doc transactions' }
	];
	d.notes = [
		{ notedAt: '2026-01-10T09:00:00Z', notedBy: 'Lin Chen', body: 'Reviewed with the data guild.' }
	];
	return d;
}

/** Decided but awaiting formal sign-off: missing a couple of sections. */
function decidedPartial(): AdrFormData {
	const d = createDefaultAdrFormData();
	d.author = { ...d.author, name: 'Marisa Patel', email: 'marisa.patel@example.com', role: 'staff-engineer', organizationName: 'Platform', teamName: 'Audit' };
	d.organization = { ...d.organization, name: 'Acme Corp' };
	d.adr = {
		...d.adr,
		slug: 'adopt-event-sourcing-for-audit',
		number: '2',
		title: 'Adopt event sourcing for the audit log',
		decisionDate: '2026-02-03',
		status: 'decided',
		decisionGroup: 'data',
		issue: 'Regulators require an immutable, replayable audit trail.',
		decision: 'Model the audit log as an append-only event stream.',
		assumptions: 'Event volume is manageable.',
		argument: 'Event sourcing gives a natural immutable history and replay.',
		implications: 'Consumers must handle eventual consistency.',
		relatedRequirements: 'REQ-30 immutable audit'
	};
	d.positions = [
		{ name: 'Event sourcing', description: 'Append-only events.', modelOrDiagramUrl: '', isChosen: true, pros: 'Immutable history', cons: 'More moving parts' },
		{ name: 'Audit table with triggers', description: '', modelOrDiagramUrl: '', isChosen: false, pros: 'Simple', cons: 'Mutable' }
	];
	return d;
}

/** Pending draft: early, mostly empty — low completeness. */
function pendingDraft(): AdrFormData {
	const d = createDefaultAdrFormData();
	d.author = { ...d.author, name: 'Aiko Tanaka', email: 'aiko.tanaka@example.com', role: 'principal-engineer', organizationName: 'Platform', teamName: 'Web' };
	d.organization = { ...d.organization, name: 'Acme Corp' };
	d.adr = {
		...d.adr,
		slug: 'tera-templates-for-server-render',
		number: '5',
		title: 'Use Tera templates for server-rendered pages',
		status: 'pending',
		decisionGroup: 'presentation',
		issue: 'We need a server-side templating approach for the admin console.'
	};
	d.positions = [
		{ name: 'Tera', description: '', modelOrDiagramUrl: '', isChosen: false, pros: '', cons: '' }
	];
	return d;
}

/** Superseded ADR: complete but replaced; links to its successor. */
function supersededLinked(): AdrFormData {
	const d = createDefaultAdrFormData();
	d.author = { ...d.author, name: 'Lin Chen', email: 'lin.chen@example.com', role: 'architect', organizationName: 'Platform', teamName: 'Data' };
	d.organization = { ...d.organization, name: 'Acme Corp' };
	d.adr = {
		...d.adr,
		slug: 'mongodb-for-primary-storage',
		number: '4',
		title: 'Replace MongoDB with PostgreSQL JSONB',
		decisionDate: '2025-09-08',
		status: 'superseded',
		decisionGroup: 'data',
		issue: 'MongoDB was the original primary store.',
		decision: 'MongoDB is the primary store (later superseded by ADR-0001).',
		assumptions: 'Document modelling fit early needs.',
		constraints: 'Limited budget.',
		argument: 'Fast to start; flexible schema during prototyping.',
		implications: 'Migration to Postgres required later.',
		relatedDecisions: 'Superseded by ADR-0001 (Use PostgreSQL)',
		relatedArtifacts: 'docs/adr/0004-mongodb.md',
		signedOffBy: 'Lin Chen',
		signedOffAt: '2025-09-08T12:00:00Z'
	};
	d.positions = [
		{ name: 'MongoDB', description: 'Document store.', modelOrDiagramUrl: '', isChosen: true, pros: 'Quick start', cons: 'Weak transactions' }
	];
	return d;
}

/** Sample ADRs, keyed by stable id (used to seed the wizard). */
export const sampleAdrs: SampleAdr[] = [
	{ id: 'ADR-2026-0001', data: approvedComplete() },
	{ id: 'ADR-2026-0002', data: decidedPartial() },
	{ id: 'ADR-2026-0004', data: supersededLinked() },
	{ id: 'ADR-2026-0005', data: pendingDraft() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAdrRows: DashboardRow[] = sampleAdrs.map((s) => {
	const e = evaluateAdr(s.data);
	const a = s.data.adr;
	return {
		id: s.id,
		number: a.number ? parseInt(a.number, 10) : null,
		title: a.title,
		status: a.status,
		decisionGroup: a.decisionGroup,
		completeness: e.completeness,
		chosenPosition: e.chosenPosition,
		authorName: s.data.author.name,
		decisionDate: a.decisionDate,
		flagCount: e.flags.length
	};
});
