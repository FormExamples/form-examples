import { describe, it, expect } from 'vitest';
import { calculateWaterlowGrade, bandForScore } from './waterlow-grader';
import { POINT_MAPS, pointsFor, categoryDefs } from './waterlow-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			nurseName: '',
			nurseRole: '',
			assessedAt: '',
			careSetting: '',
			assessmentReason: ''
		},
		identification: { patientIdentifier: '', ageBand: '', sex: '' },
		core: { buildWeightForHeight: '', skinType: '', continence: '', mobility: '' },
		special: {
			tissueMalnutrition: '',
			neurologicalDeficit: '',
			majorSurgeryTrauma: '',
			medication: '',
			existingPressureDamage: ''
		},
		note: { clinicalNote: '' }
	};
}

/**
 * A fully-answered, lowest-scoring assessment: male 14-49 (age 1 + sex 1 = 2),
 * every core category and special-risk group at its 0-point option. Total = 2.
 */
function createBaselinePatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		nurseName: 'RN A. Okafor',
		nurseRole: 'registered-nurse',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'acute-ward',
		assessmentReason: 'admission'
	};
	d.identification = { patientIdentifier: 'WAT-1001', ageBand: '14-49', sex: 'male' };
	d.core = {
		buildWeightForHeight: 'average',
		skinType: 'healthy',
		continence: 'complete-catheterised',
		mobility: 'fully-mobile'
	};
	d.special = {
		tissueMalnutrition: 'none',
		neurologicalDeficit: 'none',
		majorSurgeryTrauma: 'none',
		medication: 'none',
		existingPressureDamage: 'no'
	};
	return d;
}

describe('Waterlow grading engine', () => {
	it('scores the fully-answered baseline patient at 2 (age 1 + sex 1), low band', () => {
		const r = calculateWaterlowGrade(createBaselinePatient());
		expect(r.agePoints).toBe(1);
		expect(r.sexPoints).toBe(1);
		expect(r.waterlowScore).toBe(2);
		expect(r.riskBand).toBe('low');
		expect(r.flaggedIssues).toHaveLength(0);
	});

	it('maps bandForScore across the band boundaries (9/10, 14/15, 19/20)', () => {
		expect(bandForScore(0)).toBe('low');
		expect(bandForScore(9)).toBe('low');
		expect(bandForScore(10)).toBe('at-risk');
		expect(bandForScore(14)).toBe('at-risk');
		expect(bandForScore(15)).toBe('high');
		expect(bandForScore(19)).toBe('high');
		expect(bandForScore(20)).toBe('very-high');
		expect(bandForScore(29)).toBe('very-high');
	});

	it('band boundary low/at-risk at total 9 vs 10', () => {
		// 9 = age 65-74 (3) + sex female (2) + build below-average (3) + skin dry (1)
		const d9 = createBaselinePatient();
		d9.identification = { ...d9.identification, ageBand: '65-74', sex: 'female' };
		d9.core.buildWeightForHeight = 'below-average';
		d9.core.skinType = 'dry';
		const r9 = calculateWaterlowGrade(d9);
		expect(r9.waterlowScore).toBe(9);
		expect(r9.riskBand).toBe('low');

		// +1 continence incontinent-urine → 10 → at-risk
		const d10 = createBaselinePatient();
		d10.identification = { ...d10.identification, ageBand: '65-74', sex: 'female' };
		d10.core.buildWeightForHeight = 'below-average';
		d10.core.skinType = 'dry';
		d10.core.continence = 'incontinent-urine';
		const r10 = calculateWaterlowGrade(d10);
		expect(r10.waterlowScore).toBe(10);
		expect(r10.riskBand).toBe('at-risk');
	});

	it('band boundary at-risk/high at total 14 vs 15', () => {
		// 14 = age 75-80 (4) + sex female (2) + build below-average (3) + mobility restricted (3) + continence incontinent-faeces (2)
		const d14 = createBaselinePatient();
		d14.identification = { ...d14.identification, ageBand: '75-80', sex: 'female' };
		d14.core.buildWeightForHeight = 'below-average';
		d14.core.mobility = 'restricted';
		d14.core.continence = 'incontinent-faeces';
		const r14 = calculateWaterlowGrade(d14);
		expect(r14.waterlowScore).toBe(14);
		expect(r14.riskBand).toBe('at-risk');

		// bump mobility restricted (3) → bedbound (4) => 15 → high
		d14.core.mobility = 'bedbound';
		const r15 = calculateWaterlowGrade(d14);
		expect(r15.waterlowScore).toBe(15);
		expect(r15.riskBand).toBe('high');
	});

	it('band boundary high/very-high at total 19 vs 20', () => {
		// 19 = age 81+ (5) + sex female (2) + build below-average (3) + skin broken (3) + mobility chairbound (5) + continence complete (0)
		const d19 = createBaselinePatient();
		d19.identification = { ...d19.identification, ageBand: '81-plus', sex: 'female' };
		d19.core.buildWeightForHeight = 'below-average';
		d19.core.skinType = 'broken';
		d19.core.mobility = 'chairbound';
		d19.core.continence = 'complete-catheterised';
		const r19 = calculateWaterlowGrade(d19);
		expect(r19.waterlowScore).toBe(18);
		expect(r19.riskBand).toBe('high');

		// add continence incontinent-urine (1) => 19 high; then doubly-incontinent (3) => 21 very-high
		d19.core.continence = 'incontinent-urine';
		expect(calculateWaterlowGrade(d19).waterlowScore).toBe(19);
		expect(calculateWaterlowGrade(d19).riskBand).toBe('high');

		d19.core.continence = 'incontinent-faeces'; // 2 → total 20
		const r20 = calculateWaterlowGrade(d19);
		expect(r20.waterlowScore).toBe(20);
		expect(r20.riskBand).toBe('very-high');
	});

	it('sums every category including all four special-risk groups', () => {
		const d = createBaselinePatient();
		d.identification = { ...d.identification, ageBand: '81-plus', sex: 'female' }; // 5 + 2
		d.core.buildWeightForHeight = 'obese'; // 2
		d.core.skinType = 'discoloured'; // 2
		d.core.continence = 'doubly-incontinent'; // 3
		d.core.mobility = 'chairbound'; // 5
		d.special.tissueMalnutrition = 'multiple-organ-failure'; // 8
		d.special.neurologicalDeficit = 'moderate'; // 5
		d.special.majorSurgeryTrauma = 'on-table-over-6h'; // 8
		d.special.medication = 'high-dose-steroids-cytotoxics-anti-inflammatory'; // 4
		const r = calculateWaterlowGrade(d);
		expect(r.buildPoints).toBe(2);
		expect(r.skinPoints).toBe(2);
		expect(r.sexPoints).toBe(2);
		expect(r.agePoints).toBe(5);
		expect(r.continencePoints).toBe(3);
		expect(r.mobilityPoints).toBe(5);
		expect(r.tissueMalnutritionPoints).toBe(8);
		expect(r.neurologicalDeficitPoints).toBe(5);
		expect(r.majorSurgeryTraumaPoints).toBe(8);
		expect(r.medicationPoints).toBe(4);
		expect(r.waterlowScore).toBe(2 + 2 + 2 + 5 + 3 + 5 + 8 + 5 + 8 + 4);
		expect(r.riskBand).toBe('very-high');
	});

	it('lists only categories that contributed points', () => {
		const d = createBaselinePatient();
		d.core.skinType = 'broken'; // 3
		const r = calculateWaterlowGrade(d);
		const keys = r.contributingCategories.map((c) => c.key);
		// age (1), sex (1), skin (3) contribute; build/continence/mobility/specials are 0.
		expect(keys).toContain('skin');
		expect(keys).toContain('age');
		expect(keys).toContain('sex');
		expect(keys).not.toContain('build');
		expect(keys).not.toContain('mobility');
	});

	it('a fully-blank assessment scores 0 (low) with all points zero', () => {
		const r = calculateWaterlowGrade(createDefaultAssessment());
		expect(r.waterlowScore).toBe(0);
		expect(r.riskBand).toBe('low');
	});

	it('every point map value round-trips through pointsFor', () => {
		for (const [map, table] of Object.entries(POINT_MAPS)) {
			for (const [value, pts] of Object.entries(table)) {
				expect(pointsFor(map, value)).toBe(pts);
			}
		}
		expect(pointsFor('skinType', '')).toBe(0);
		expect(pointsFor('nope', 'whatever')).toBe(0);
	});

	it('has ten scoring categories (six core + four special)', () => {
		expect(categoryDefs).toHaveLength(10);
		expect(categoryDefs.filter((c) => c.special).length).toBe(4);
	});
});

describe('Waterlow flagged-issue detection', () => {
	it('raises no red flags for a complete low-band patient', () => {
		const r = calculateWaterlowGrade(createBaselinePatient());
		expect(r.flaggedIssues).toHaveLength(0);
	});

	it('raises the very-high-risk flag at score 20 or more', () => {
		const d = createBaselinePatient();
		d.special.tissueMalnutrition = 'multiple-organ-failure'; // 8
		d.core.mobility = 'chairbound'; // 5
		d.special.neurologicalDeficit = 'severe'; // 6 → total 2 + 8 + 5 + 6 = 21
		const r = calculateWaterlowGrade(d);
		expect(r.riskBand).toBe('very-high');
		expect(r.flaggedIssues.some((f) => f.id === 'F-VERY-HIGH-RISK-001')).toBe(true);
	});

	it('raises the high-risk flag between 15 and 19', () => {
		// 16 = age 75-80 (4) + sex female (2) + build below-average (3) + mobility bedbound (4) + continence incontinent-urine (1) + skin dry (1) + build... keep it 16
		const d = createBaselinePatient();
		d.identification = { ...d.identification, ageBand: '75-80', sex: 'female' };
		d.core.buildWeightForHeight = 'below-average';
		d.core.mobility = 'bedbound';
		d.core.continence = 'incontinent-urine';
		d.core.skinType = 'dry';
		const r = calculateWaterlowGrade(d);
		expect(r.waterlowScore).toBe(15);
		expect(r.riskBand).toBe('high');
		expect(r.flaggedIssues.some((f) => f.id === 'F-HIGH-RISK-001')).toBe(true);
	});

	it('raises the existing-pressure-damage flag on broken skin', () => {
		const d = createBaselinePatient();
		d.core.skinType = 'broken';
		const r = calculateWaterlowGrade(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-EXISTING-PRESSURE-DAMAGE-001')).toBe(true);
	});

	it('raises the existing-pressure-damage flag when recorded explicitly', () => {
		const d = createBaselinePatient();
		d.special.existingPressureDamage = 'yes';
		const r = calculateWaterlowGrade(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-EXISTING-PRESSURE-DAMAGE-001')).toBe(true);
	});

	it('raises the multiple-special-risks flag when two or more groups contribute', () => {
		const d = createBaselinePatient();
		d.special.neurologicalDeficit = 'mild'; // 4
		d.special.medication = 'high-dose-steroids-cytotoxics-anti-inflammatory'; // 4
		const r = calculateWaterlowGrade(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-MULTIPLE-SPECIAL-RISKS-001')).toBe(true);
	});

	it('raises the incomplete-assessment flag when core inputs are missing', () => {
		const r = calculateWaterlowGrade(createDefaultAssessment());
		expect(r.flaggedIssues.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createBaselinePatient();
		d.core.mobility = 'chairbound'; // 5
		d.special.tissueMalnutrition = 'multiple-organ-failure'; // 8
		d.special.neurologicalDeficit = 'severe'; // 6 → very-high + multiple specials
		d.special.existingPressureDamage = 'yes';
		const r = calculateWaterlowGrade(d);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = r.flaggedIssues.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
