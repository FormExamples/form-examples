import type { MammographyResult, ResultClassification, FiredRule } from './types';
import { hasAnyAbnormalFinding, hasOnlyIncidentalFinding } from './utils';

/**
 * Axis A — result classification.
 *
 * Driven primarily by the ACR BI-RADS final assessment category:
 * - inconclusive: BI-RADS 0 (incomplete — needs additional imaging), or a
 *   non-diagnostic / limited-without-impression examination.
 * - normal: BI-RADS 1 (negative) or 2 (benign).
 * - critical: BI-RADS 4c or 5 (≥ 50 % likelihood of malignancy).
 * - abnormal: BI-RADS 3, 4a, 4b, or 6 (known malignancy), or — when no
 *   BI-RADS category has been assigned — any abnormal structured finding.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: MammographyResult): {
	resultClassification: ResultClassification;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const cat = r.biRadsCategory;

	// ─── BI-RADS 0 — incomplete / inconclusive ───
	if (cat === '0') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'birads-0',
			description:
				'BI-RADS 0 (incomplete — additional imaging required); classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	// ─── BI-RADS 4c / 5 — critical band ───
	if (cat === '4c' || cat === '5') {
		firedRules.push({
			ruleId: 'R-CLASS-CRITICAL-01',
			axis: 'classification',
			category: 'birads-high',
			description: `BI-RADS ${cat} (≥ 50 % likelihood of malignancy); classified as critical.`
		});
		return { resultClassification: 'critical', firedRules };
	}

	// ─── BI-RADS 3 / 4a / 4b — abnormal band ───
	if (cat === '3' || cat === '4a' || cat === '4b') {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-01',
			axis: 'classification',
			category: 'birads-suspicious',
			description: `BI-RADS ${cat} (probably benign or suspicious); classified as abnormal.`
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	// ─── BI-RADS 6 — known biopsy-proven malignancy ───
	if (cat === '6') {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-02',
			axis: 'classification',
			category: 'birads-known-malignancy',
			description: 'BI-RADS 6 (known biopsy-proven malignancy); classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	// ─── BI-RADS 1 / 2 — normal band ───
	if (cat === '1' || cat === '2') {
		firedRules.push({
			ruleId: 'R-CLASS-NORMAL-01',
			axis: 'classification',
			category: 'birads-negative',
			description: `BI-RADS ${cat} (negative or benign); classified as normal.`
		});
		return { resultClassification: 'normal', firedRules };
	}

	// ─── No BI-RADS assigned: fall back to adequacy and structured findings ───
	if (r.examinationAdequacy === 'non-diagnostic') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-02',
			axis: 'classification',
			category: 'non-diagnostic',
			description: 'Examination was non-diagnostic; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (r.examinationAdequacy === 'limited' && r.impression.trim() === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-03',
			axis: 'classification',
			category: 'limited-no-impression',
			description:
				'Examination was limited and no impression was recorded; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (hasAnyAbnormalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-03',
			axis: 'classification',
			category: 'abnormal-finding',
			description: 'One or more abnormal structured findings are present; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	if (hasOnlyIncidentalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-04',
			axis: 'classification',
			category: 'incidental-finding',
			description: 'Only incidental finding(s) present; classified as abnormal (not a normal study).'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-02',
		axis: 'classification',
		category: 'no-abnormal-finding',
		description:
			'No BI-RADS category assigned and no abnormal structured findings on an interpretable examination; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
