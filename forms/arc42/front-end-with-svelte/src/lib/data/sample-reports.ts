import type { Arc42Documentation, Maturity } from '$lib/grading/types.js';
import { calculateMaturity } from '$lib/grading/maturity-grader.js';
import { createDefaultDocumentation } from '$lib/stores/documentation.svelte';
import { completeSectionCount } from '$lib/grading/utils.js';

/** A sample arc42 document: an identifier and the full data the engine grades. */
export interface SampleDocument {
	id: string;
	name: string;
	updatedDate: string;
	data: Arc42Documentation;
}

/** A row in the architecture dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	name: string;
	owner: string;
	updatedDate: string;
	maturity: Maturity;
	sectionsComplete: number;
	flagCount: number;
	recommendation: string;
}

/** A draft document: only the title block and an introduction begun. */
function draft(): Arc42Documentation {
	const d = createDefaultDocumentation();
	d.architecture = {
		name: 'Inventory Service',
		version: '0.1',
		owner: 'Platform Team',
		status: 'draft',
		description: 'New microservice for stock levels; documentation just started.'
	};
	d.authorName = 'A. Architect';
	d.authorRole = 'Tech Lead';
	d.documentDate = '2026-06-02';
	d.introduction = 'Early notes on the inventory service.';
	d.businessGoals = [{ ordinal: 1, name: 'Reduce stockouts', description: 'Real-time stock visibility.' }];
	return d;
}

/** A reviewable document: every section started, but several still partial. */
function reviewable(): Arc42Documentation {
	const d = createDefaultDocumentation();
	d.architecture = {
		name: 'Payments Gateway',
		version: '0.6',
		owner: 'Payments Team',
		status: 'active',
		description: 'Card and wallet payment orchestration service.'
	};
	d.authorName = 'B. Builder';
	d.authorRole = 'Principal Engineer';
	d.documentDate = '2026-06-10';
	d.introduction = 'Documents the payments gateway architecture and its integration surface.';
	d.businessGoals = [{ ordinal: 1, name: 'PCI compliance', description: 'Maintain PCI-DSS scope minimisation.' }];
	d.qualityGoals = [{ ordinal: 1, name: 'Security', priority: 'high', scenario: 'No card data persisted in clear.' }];
	d.stakeholders = [{ ordinal: 1, name: 'Finance', role: 'Sponsor', concerns: 'Settlement accuracy.' }];
	d.constraintItems = [{ ordinal: 1, kind: 'technical', name: 'TLS 1.2+', description: 'All traffic encrypted.' }];
	d.businessContextDescription = 'Merchants initiate payments; acquirers settle funds.';
	d.technicalContextDescription = 'REST API to merchants; ISO 8583 to acquirer.';
	d.contextPartners = [{ ordinal: 1, kind: 'business', name: 'Merchant', interfaceDescription: 'Checkout', protocol: 'HTTPS', direction: 'inbound' }];
	d.solutionStrategySummary = 'Stateless services behind an API gateway with a tokenisation vault.';
	d.technologyDecisions = [{ ordinal: 1, category: 'language', choice: 'Rust', rationale: 'Memory safety and throughput.' }];
	d.buildingBlockOverview = 'Gateway, tokeniser, ledger.';
	d.buildingBlocks = [{ ordinal: 1, parentOrdinal: null, name: 'Gateway', responsibility: 'Routing', interfaces: 'HTTP' }];
	d.runtimeOverview = 'Authorise-then-capture flow.';
	d.deploymentOverview = 'Kubernetes across two regions.';
	d.crosscuttingOverview = 'Logging, tracing, secrets management.';
	d.architecturalDecisions = [{ ordinal: 1, title: 'Use tokenisation', status: 'accepted', context: 'PCI scope', decision: 'Tokenise PANs', consequences: 'Reduced scope' }];
	d.qualityTreeSummary = 'Security and availability dominate.';
	d.riskItems = [{ ordinal: 1, kind: 'risk', name: 'Acquirer outage', probability: 'medium', impact: 'high', mitigation: 'Fail over to secondary acquirer.' }];
	d.glossaryTerms = [{ ordinal: 1, term: 'PAN', definition: 'Primary Account Number.' }];
	return d;
}

/** A fully-documented section helper used by the ready/mature samples. */
function fullyDocumented(): Arc42Documentation {
	const d = createDefaultDocumentation();
	d.introduction = 'Comprehensive architecture documentation for the service.';
	d.businessGoals = [
		{ ordinal: 1, name: 'Scale', description: 'Serve 10k req/s.' },
		{ ordinal: 2, name: 'Reliability', description: '99.95% availability.' }
	];
	d.qualityGoals = [
		{ ordinal: 1, name: 'Performance', priority: 'high', scenario: 'p99 under 200ms at peak load.' },
		{ ordinal: 2, name: 'Availability', priority: 'high', scenario: 'Survive single-AZ loss.' },
		{ ordinal: 3, name: 'Maintainability', priority: 'medium', scenario: 'New endpoint added in under a day.' }
	];
	d.stakeholders = [
		{ ordinal: 1, name: 'Product', role: 'Owner', concerns: 'Feature velocity.' },
		{ ordinal: 2, name: 'SRE', role: 'Operator', concerns: 'Observability and rollback.' }
	];
	d.constraintItems = [
		{ ordinal: 1, kind: 'technical', name: 'Cloud-only', description: 'Runs on managed Kubernetes.' },
		{ ordinal: 2, kind: 'convention', name: 'Trunk-based', description: 'Short-lived branches only.' }
	];
	d.businessContextDescription = 'Clients submit orders; partners fulfil them.';
	d.technicalContextDescription = 'gRPC internally, REST at the edge, Kafka for events.';
	d.contextPartners = [
		{ ordinal: 1, kind: 'business', name: 'Client', interfaceDescription: 'Order placement', protocol: 'HTTPS', direction: 'inbound' },
		{ ordinal: 2, kind: 'technical', name: 'Warehouse', interfaceDescription: 'Fulfilment events', protocol: 'Kafka', direction: 'outbound' }
	];
	d.solutionStrategySummary = 'Event-driven microservices with a CQRS read model.';
	d.technologyDecisions = [
		{ ordinal: 1, category: 'language', choice: 'Rust', rationale: 'Performance and safety.' },
		{ ordinal: 2, category: 'datastore', choice: 'PostgreSQL', rationale: 'Transactional integrity.' }
	];
	d.topLevelDecompositionSummary = 'API edge, domain services, projection workers.';
	d.qualityStrategies = ['Cache hot reads', 'Backpressure on ingestion'];
	d.buildingBlockOverview = 'Edge API, order service, projection worker, ledger.';
	d.buildingBlocks = [
		{ ordinal: 1, parentOrdinal: null, name: 'Edge API', responsibility: 'Auth + routing', interfaces: 'REST' },
		{ ordinal: 2, parentOrdinal: null, name: 'Order Service', responsibility: 'Order lifecycle', interfaces: 'gRPC' },
		{ ordinal: 3, parentOrdinal: null, name: 'Projection Worker', responsibility: 'Read models', interfaces: 'Kafka' }
	];
	d.runtimeOverview = 'Order placement and fulfilment flows.';
	d.runtimeScenarios = [
		{ ordinal: 1, name: 'Place order', triggerDescription: 'Client POST', stepsSummary: 'Validate, persist, emit event, ack.' }
	];
	d.deploymentOverview = 'Managed Kubernetes across two availability zones.';
	d.deploymentNodes = [
		{ ordinal: 1, environment: 'production', nodeName: 'eks-prod', responsibility: 'Runs all services.' }
	];
	d.crosscuttingOverview = 'Observability, security, resilience.';
	d.crosscuttingConcepts = [
		{ ordinal: 1, name: 'Observability', description: 'OpenTelemetry traces and metrics.' }
	];
	d.qualityTreeSummary = 'Performance and availability are the dominant drivers.';
	d.qualityScenarios = [
		{ ordinal: 1, source: 'User', stimulus: 'Peak load', artifact: 'Edge API', response: 'Serve within SLA', measure: 'p99 < 200ms' },
		{ ordinal: 2, source: 'Operator', stimulus: 'AZ failure', artifact: 'Cluster', response: 'Fail over', measure: 'RTO < 5 min' },
		{ ordinal: 3, source: 'Developer', stimulus: 'New endpoint', artifact: 'Order service', response: 'Add and deploy', measure: '< 1 day' }
	];
	d.glossaryTerms = [
		{ ordinal: 1, term: 'CQRS', definition: 'Command Query Responsibility Segregation.' },
		{ ordinal: 2, term: 'RTO', definition: 'Recovery Time Objective.' },
		{ ordinal: 3, term: 'AZ', definition: 'Availability Zone.' },
		{ ordinal: 4, term: 'SLA', definition: 'Service Level Agreement.' },
		{ ordinal: 5, term: 'p99', definition: '99th percentile latency.' }
	];
	return d;
}

/** A ready document: all 12 sections complete, but below the mature thresholds. */
function ready(): Arc42Documentation {
	const d = fullyDocumented();
	d.architecture = {
		name: 'Order Platform',
		version: '1.0',
		owner: 'Commerce Team',
		status: 'active',
		description: 'Event-driven order management platform.'
	};
	d.authorName = 'C. Curator';
	d.authorRole = 'Staff Engineer';
	d.documentDate = '2026-06-14';
	// Four accepted ADRs: clears §9 (≥3) but stays below mature (≥5).
	d.architecturalDecisions = [
		{ ordinal: 1, title: 'Event-driven core', status: 'accepted', context: 'Decoupling', decision: 'Use Kafka', consequences: 'Eventual consistency' },
		{ ordinal: 2, title: 'CQRS read model', status: 'accepted', context: 'Read scaling', decision: 'Separate projections', consequences: 'More moving parts' },
		{ ordinal: 3, title: 'Rust services', status: 'accepted', context: 'Performance', decision: 'Adopt Rust', consequences: 'Hiring constraint' },
		{ ordinal: 4, title: 'Postgres ledger', status: 'proposed', context: 'Integrity', decision: 'Use Postgres', consequences: 'Vertical scaling limit' }
	];
	// Only one risk with mitigation: below mature (≥3).
	d.riskItems = [
		{ ordinal: 1, kind: 'risk', name: 'Kafka lag', probability: 'medium', impact: 'medium', mitigation: 'Autoscale consumers.' },
		{ ordinal: 2, kind: 'technical-debt', name: 'Legacy adapter', probability: 'low', impact: 'medium', mitigation: '' }
	];
	d.recommendation = 'revise-first';
	return d;
}

/** A mature document: all 12 sections complete and above the mature thresholds. */
function mature(): Arc42Documentation {
	const d = fullyDocumented();
	d.architecture = {
		name: 'Identity Service',
		version: '2.3',
		owner: 'Security Team',
		status: 'active',
		description: 'Authentication and authorization platform.'
	};
	d.authorName = 'D. Director';
	d.authorRole = 'Chief Architect';
	d.documentDate = '2026-06-20';
	// Five non-draft ADRs clears the mature threshold (≥5).
	d.architecturalDecisions = [
		{ ordinal: 1, title: 'OIDC standard', status: 'accepted', context: 'Interop', decision: 'Adopt OIDC', consequences: 'Spec compliance work' },
		{ ordinal: 2, title: 'Token rotation', status: 'accepted', context: 'Security', decision: 'Rotate refresh tokens', consequences: 'Client changes' },
		{ ordinal: 3, title: 'mTLS internal', status: 'accepted', context: 'Zero trust', decision: 'Require mTLS', consequences: 'Cert management' },
		{ ordinal: 4, title: 'Argon2 hashing', status: 'accepted', context: 'Credential safety', decision: 'Use Argon2id', consequences: 'CPU cost' },
		{ ordinal: 5, title: 'Hardware-backed keys', status: 'proposed', context: 'Key safety', decision: 'Use HSM/KMS', consequences: 'Cloud lock-in' }
	];
	// Three risks with mitigation clears the mature threshold (≥3).
	d.riskItems = [
		{ ordinal: 1, kind: 'risk', name: 'Credential stuffing', probability: 'high', impact: 'high', mitigation: 'Rate limiting and MFA.' },
		{ ordinal: 2, kind: 'risk', name: 'Key compromise', probability: 'low', impact: 'high', mitigation: 'HSM and rotation.' },
		{ ordinal: 3, kind: 'technical-debt', name: 'Session store', probability: 'medium', impact: 'medium', mitigation: 'Migrate to Redis cluster.' }
	];
	d.recommendation = 'proceed';
	d.signedBy = 'D. Director';
	d.signedAt = '2026-06-20T10:00';
	return d;
}

/** The sample documents, keyed by stable id (used to seed the wizard). */
export const sampleDocuments: SampleDocument[] = [
	{ id: 'arc42-2026-0001', name: 'Inventory Service', updatedDate: '2026-06-02', data: draft() },
	{ id: 'arc42-2026-0002', name: 'Payments Gateway', updatedDate: '2026-06-10', data: reviewable() },
	{ id: 'arc42-2026-0003', name: 'Order Platform', updatedDate: '2026-06-14', data: ready() },
	{ id: 'arc42-2026-0004', name: 'Identity Service', updatedDate: '2026-06-20', data: mature() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleDocumentRows: DashboardRow[] = sampleDocuments.map((s) => {
	const g = calculateMaturity(s.data);
	return {
		id: s.id,
		name: s.data.architecture.name || s.name,
		owner: s.data.architecture.owner,
		updatedDate: s.updatedDate,
		maturity: g.finalMaturity,
		sectionsComplete: completeSectionCount(g.completenessBySection),
		flagCount: g.additionalFlags.length,
		recommendation: s.data.recommendation
	};
});
