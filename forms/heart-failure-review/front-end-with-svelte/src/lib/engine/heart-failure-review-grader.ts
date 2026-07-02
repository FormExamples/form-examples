import type {
	AssessmentData,
	DomainStatus,
	FiredRule,
	FunctionalStatus,
	GradingResult,
	MedicationOptimisation,
	Pillar,
	PillarStatus,
	ReviewStatus
} from './types';
import { PILLARS, indicatedPillarKeys, reviewDomainRules } from './heart-failure-review-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Derive the NYHA functional status from the recorded NYHA class (spec §4):
 * null → unknown, I–II → stable, III → symptomatic, IV → advanced.
 */
export function deriveFunctionalStatus(data: AssessmentData): FunctionalStatus {
	const nyha = data.functional.nyhaClass;
	if (nyha === null || nyha === undefined || (nyha as unknown) === '') return 'unknown';
	if (nyha <= 2) return 'stable';
	if (nyha === 3) return 'symptomatic';
	return 'advanced';
}

/**
 * Derive the four-pillar medication-optimisation status (spec §4). The indicated
 * pillar set is 4 for HFrEF, 1 (SGLT2i) for HFmrEF/HFpEF, 0 otherwise. A pillar
 * documented `contraindicated` / `not-tolerated` counts as addressed.
 */
export function deriveMedicationOptimisation(data: AssessmentData): MedicationOptimisation {
	const indicatedKeys = indicatedPillarKeys(data.diagnosis.heartFailureType);
	const indicatedSet = new Set<Pillar>(indicatedKeys);

	const pillarStatus = (key: Pillar): PillarStatus =>
		(data.medication[`${key}Status` as keyof AssessmentData['medication']] as PillarStatus) || '';

	const pillars = PILLARS.map((p) => ({
		key: p.key,
		label: p.short,
		status: pillarStatus(p.key),
		indicated: indicatedSet.has(p.key)
	}));

	const indicatedPillars = indicatedKeys.length;
	let prescribedPillars = 0;
	let counted = 0;
	const missingPillars: Pillar[] = [];

	for (const key of indicatedKeys) {
		const status = pillarStatus(key);
		if (status === 'prescribed') {
			prescribedPillars++;
			counted++;
		} else if (status === 'contraindicated' || status === 'not-tolerated') {
			counted++;
		} else if (status === 'not-prescribed') {
			missingPillars.push(key);
		}
		// '' (unrecorded) counts as neither addressed nor missing.
	}

	let status: MedicationOptimisation['status'];
	if (indicatedPillars === 0) {
		status = 'not-applicable';
	} else if (counted === indicatedPillars) {
		status = 'optimised';
	} else if (prescribedPillars === 0) {
		status = 'suboptimal';
	} else {
		status = 'partial';
	}

	return { indicatedPillars, prescribedPillars, missingPillars, status, pillars };
}

/**
 * Evaluate each review-domain rule and derive the completeness grade (spec §4).
 */
export function deriveReviewCompleteness(data: AssessmentData): {
	reviewStatus: ReviewStatus;
	completenessScore: number;
	domainStatuses: DomainStatus[];
	documentedCount: number;
} {
	const domainStatuses = reviewDomainRules.map((rule) => ({
		domain: rule.domain,
		label: rule.label,
		documented: rule.satisfied(data) === true
	}));

	const total = domainStatuses.length; // 6
	const documentedCount = domainStatuses.filter((d) => d.documented).length;
	const completenessScore = total > 0 ? Math.round((100 * documentedCount) / total) : 0;

	const reviewStatus: ReviewStatus =
		documentedCount === total ? 'complete' : documentedCount >= 4 ? 'partial' : 'incomplete';

	return { reviewStatus, completenessScore, domainStatuses, documentedCount };
}

/**
 * Pure function: compute the full review grade — functional status, medication
 * optimisation, review completeness, safety flags, and the audit trail. This is
 * a DOCUMENTATION / STATUS-CLASSIFICATION instrument, NOT a numeric severity
 * score. This is the canonical engine entry point (spec §6).
 */
export function gradeReview(data: AssessmentData): GradingResult {
	const functionalStatus = deriveFunctionalStatus(data);
	const medicationOptimisation = deriveMedicationOptimisation(data);
	const completeness = deriveReviewCompleteness(data);

	const flaggedIssues = detectFlaggedIssues(data, {
		medicationOptimisation,
		reviewStatus: completeness.reviewStatus
	});

	// Audit trail: one row per documented domain, plus classification /
	// completeness summary rows mirroring the grade_rule table.
	const firedRules: FiredRule[] = [];
	for (let i = 0; i < reviewDomainRules.length; i++) {
		const rule = reviewDomainRules[i];
		if (completeness.domainStatuses[i].documented) {
			firedRules.push({
				id: rule.id,
				domain: rule.domain,
				category: rule.category,
				description: rule.description
			});
		}
	}
	firedRules.push({
		id: 'R-FUNCTIONAL-STATUS-01',
		domain: 'functional-status',
		category: 'classification',
		description: `NYHA functional status derived: ${functionalStatus}`
	});
	firedRules.push({
		id: 'R-OPTIMISATION-01',
		domain: 'medication-optimisation',
		category: 'classification',
		description:
			`Medication-optimisation status: ${medicationOptimisation.status} ` +
			`(${medicationOptimisation.prescribedPillars} of ` +
			`${medicationOptimisation.indicatedPillars} indicated pillars prescribed)`
	});
	firedRules.push({
		id: 'R-COMPLETENESS-01',
		domain: 'completeness',
		category: 'completeness',
		description:
			`Review ${completeness.reviewStatus}: ` +
			`${completeness.documentedCount} of ${reviewDomainRules.length} domains ` +
			`documented (${completeness.completenessScore}%)`
	});

	return {
		functionalStatus,
		medicationOptimisation,
		reviewStatus: completeness.reviewStatus,
		completenessScore: completeness.completenessScore,
		domainStatuses: completeness.domainStatuses,
		firedRules,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
