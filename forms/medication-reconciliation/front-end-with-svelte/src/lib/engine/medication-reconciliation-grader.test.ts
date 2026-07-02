import { describe, it, expect } from 'vitest';
import { calculateReconciliation, gradeReconciliation } from './medication-reconciliation-grader';
import { detectFlaggedIssues } from './flagged-issues';
import type { Allergy, Discrepancy, InformationSource, LineItem, ReconciliationData } from './types';

/**
 * A blank reconciliation (mirrors the store's `createDefaultReconciliation`).
 * Defined locally so the engine tests never import the store, which pulls in
 * the SvelteKit-only `$app/environment` module.
 */
function createDefaultReconciliation(): ReconciliationData {
	return {
		encounter: {
			reconciliationType: '',
			careSetting: '',
			reconciledAt: '',
			clinicianName: '',
			clinicianRole: ''
		},
		identification: { patientIdentifier: '', ageBand: '', sex: '', weightKg: null },
		allergyReview: { allergyStatus: '' },
		informationSources: [],
		allergies: [],
		lineItems: [],
		discrepancies: [],
		note: { clinicalNote: '' }
	};
}

function source(verified: 'yes' | 'no' = 'yes'): InformationSource {
	return { sourceType: 'gp-record', verified };
}

function lineItem(over: Partial<LineItem> = {}): LineItem {
	return {
		listSource: 'bpmh',
		drugName: 'Amlodipine',
		form: 'Tablet',
		dose: '5 mg',
		route: 'oral',
		frequency: 'Once daily',
		indication: 'Hypertension',
		highRiskClass: 'none',
		adherence: 'taking',
		sourceType: 'gp-record',
		status: 'active',
		...over
	};
}

function discrepancy(over: Partial<Discrepancy> = {}): Discrepancy {
	return {
		discrepancyType: 'dose',
		bpmhItemRef: 'Amlodipine 5 mg',
		inpatientItemRef: 'Amlodipine 10 mg',
		intendedAction: 'change',
		rationale: 'Blood-pressure control',
		intentional: 'yes',
		...over
	};
}

/** A fully-reconciled, complete record: 2 sources, documented allergies, reviewed items. */
function createCompleteReconciliation(): ReconciliationData {
	const d = createDefaultReconciliation();
	d.allergyReview.allergyStatus = 'no-known-drug-allergies';
	d.informationSources = [source(), source()];
	d.lineItems = [lineItem(), lineItem({ listSource: 'inpatient', drugName: 'Ramipril' })];
	d.discrepancies = [discrepancy()];
	return d;
}

describe('medication-reconciliation grading engine', () => {
	it('a blank reconciliation is incomplete (no sources)', () => {
		const r = calculateReconciliation(createDefaultReconciliation());
		expect(r.status).toBe('incomplete');
		expect(r.sourceCount).toBe(0);
	});

	it('fewer than two sources keeps the record incomplete', () => {
		const d = createCompleteReconciliation();
		d.informationSources = [source()];
		expect(calculateReconciliation(d).status).toBe('incomplete');
	});

	it('undocumented allergy status keeps the record incomplete', () => {
		const d = createCompleteReconciliation();
		d.allergyReview.allergyStatus = 'not-documented';
		expect(calculateReconciliation(d).status).toBe('incomplete');
	});

	it('an unreviewed (name-less) line item keeps the record incomplete', () => {
		const d = createCompleteReconciliation();
		d.lineItems.push(lineItem({ drugName: '' }));
		expect(calculateReconciliation(d).status).toBe('incomplete');
	});

	it('grades a fully-documented record complete', () => {
		const r = calculateReconciliation(createCompleteReconciliation());
		expect(r.status).toBe('complete');
		expect(r.sourceCount).toBe(2);
		expect(r.verifiedSourceCount).toBe(2);
		expect(r.bpmhCount).toBe(1);
		expect(r.inpatientCount).toBe(1);
		expect(r.intentionalCount).toBe(1);
		expect(r.unintentionalCount).toBe(0);
	});

	it('an unintentional discrepancy makes the status discrepancies-outstanding', () => {
		const d = createCompleteReconciliation();
		d.discrepancies = [discrepancy({ intentional: 'no' })];
		const r = calculateReconciliation(d);
		expect(r.status).toBe('discrepancies-outstanding');
		expect(r.unintentionalCount).toBe(1);
	});

	it('a discrepancy missing action or rationale is discrepancies-outstanding', () => {
		const d = createCompleteReconciliation();
		// intentional but rationale blank -> not fully documented -> unintentional
		d.discrepancies = [discrepancy({ rationale: '' })];
		expect(calculateReconciliation(d).status).toBe('discrepancies-outstanding');
	});

	it('classifies each discrepancy type via its count', () => {
		const types: Discrepancy['discrepancyType'][] = [
			'omission',
			'commission',
			'duplication',
			'dose',
			'frequency',
			'route',
			'formulation'
		];
		const d = createCompleteReconciliation();
		d.discrepancies = types.map((t) => discrepancy({ discrepancyType: t }));
		const r = calculateReconciliation(d);
		expect(r.discrepancyCount).toBe(types.length);
		expect(r.intentionalCount).toBe(types.length);
	});

	it('counts a high-risk unintentional discrepancy on an anticoagulant', () => {
		const d = createCompleteReconciliation();
		d.lineItems = [lineItem({ drugName: 'Warfarin', highRiskClass: 'anticoagulant' })];
		d.discrepancies = [
			discrepancy({ intentional: 'no', bpmhItemRef: 'Warfarin 3 mg', inpatientItemRef: '' })
		];
		const r = calculateReconciliation(d);
		expect(r.highRiskUnintentionalCount).toBe(1);
	});
});

describe('medication-reconciliation flag detection', () => {
	it('raises no flags for a complete, clean record', () => {
		const d = createCompleteReconciliation();
		const grade = calculateReconciliation(d);
		expect(detectFlaggedIssues(d, grade)).toHaveLength(0);
	});

	it('raises insufficient-sources when fewer than two sources', () => {
		const d = createCompleteReconciliation();
		d.informationSources = [source()];
		const flags = detectFlaggedIssues(d, calculateReconciliation(d));
		expect(flags.some((f) => f.id === 'F-INSUFFICIENT-SOURCES-001')).toBe(true);
	});

	it('raises the high-risk flag for an unintentional anticoagulant discrepancy', () => {
		const d = createCompleteReconciliation();
		d.lineItems = [lineItem({ drugName: 'Insulin glargine', highRiskClass: 'insulin' })];
		d.discrepancies = [discrepancy({ intentional: 'no', bpmhItemRef: 'Insulin glargine' })];
		const flags = detectFlaggedIssues(d, calculateReconciliation(d));
		expect(flags.some((f) => f.id === 'F-HIGH-RISK-UNINTENTIONAL-001')).toBe(true);
	});

	it('raises an allergy-conflict flag when a medicine matches an allergy', () => {
		const d = createCompleteReconciliation();
		const penicillin: Allergy = { substance: 'Penicillin', reactionType: 'allergy', severity: 'severe' };
		d.allergyReview.allergyStatus = 'documented';
		d.allergies = [penicillin];
		d.lineItems = [lineItem({ drugName: 'Penicillin V' })];
		const flags = detectFlaggedIssues(d, calculateReconciliation(d));
		expect(flags.some((f) => f.id === 'F-ALLERGY-CONFLICT-001')).toBe(true);
	});

	it('raises a drug-interaction flag for warfarin + aspirin', () => {
		const d = createCompleteReconciliation();
		d.lineItems = [
			lineItem({ drugName: 'Warfarin', highRiskClass: 'anticoagulant' }),
			lineItem({ drugName: 'Aspirin' })
		];
		const flags = detectFlaggedIssues(d, calculateReconciliation(d));
		expect(flags.some((f) => f.id === 'F-INTERACTION-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createDefaultReconciliation();
		d.informationSources = [source()]; // insufficient (high) + incomplete (low)
		const flags = detectFlaggedIssues(d, calculateReconciliation(d));
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});

	it('gradeReconciliation attaches flags and a timestamp', () => {
		const r = gradeReconciliation(createCompleteReconciliation());
		expect(Array.isArray(r.flaggedIssues)).toBe(true);
		expect(typeof r.timestamp).toBe('string');
	});
});
