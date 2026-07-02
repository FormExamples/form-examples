import { describe, it, expect } from 'vitest';
import { calculateCentorGrade, ageModifierFor } from './centor-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { centorRules } from './centor-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: { clinicianName: '', clinicianRole: '', assessedAt: '', careSetting: '' },
		identification: { patientIdentifier: '', ageYears: null, sex: '' },
		exudate: { tonsillarExudate: '' },
		nodes: { tenderAnteriorCervicalNodes: '' },
		fever: { feverOver38: '', measuredTemperatureCelsius: null },
		cough: { absenceOfCough: '' },
		redFlags: {
			stridorOrBreathingDifficulty: '',
			droolingOrCannotSwallow: '',
			trismus: '',
			muffledVoice: '',
			unilateralNeckSwelling: ''
		},
		note: { clinicalNote: '' }
	};
}

/** A fully-answered, all-negative (Centor 0) adult (age 15–44, modifier 0). */
function createNegativeAdult(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'gp',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'general-practice'
	};
	d.identification = { patientIdentifier: 'GP-1001', ageYears: 30, sex: 'male' };
	d.exudate.tonsillarExudate = 'no';
	d.nodes.tenderAnteriorCervicalNodes = 'no';
	d.fever.feverOver38 = 'no';
	d.cough.absenceOfCough = 'no';
	return d;
}

describe('Centor / McIsaac grading engine', () => {
	it('scores 0 for a fully-negative adult (low risk)', () => {
		const r = calculateCentorGrade(createNegativeAdult());
		expect(r.centorScore).toBe(0);
		expect(r.tonsillarExudatePoint).toBe(0);
		expect(r.tenderNodesPoint).toBe(0);
		expect(r.feverPoint).toBe(0);
		expect(r.coughAbsentPoint).toBe(0);
		expect(r.ageModifier).toBe(0);
		expect(r.mcIsaacScore).toBe(0);
		expect(r.riskBand).toBe('low');
	});

	it('awards a point for each positive criterion', () => {
		const d = createNegativeAdult();
		d.exudate.tonsillarExudate = 'yes';
		expect(calculateCentorGrade(d).tonsillarExudatePoint).toBe(1);
		d.nodes.tenderAnteriorCervicalNodes = 'yes';
		expect(calculateCentorGrade(d).tenderNodesPoint).toBe(1);
		d.cough.absenceOfCough = 'yes';
		expect(calculateCentorGrade(d).coughAbsentPoint).toBe(1);
	});

	it('fever fires on the yes/no flag', () => {
		const d = createNegativeAdult();
		d.fever.feverOver38 = 'yes';
		expect(calculateCentorGrade(d).feverPoint).toBe(1);
	});

	it('fever measured-temperature boundary fires above 38.0, not at 38.0', () => {
		const d380 = createNegativeAdult();
		d380.fever.measuredTemperatureCelsius = 38.0;
		expect(calculateCentorGrade(d380).feverPoint).toBe(0);

		const d381 = createNegativeAdult();
		d381.fever.measuredTemperatureCelsius = 38.1;
		expect(calculateCentorGrade(d381).feverPoint).toBe(1);
	});

	it('applies the McIsaac age-modifier at each band boundary', () => {
		expect(ageModifierFor(2)).toBe(0);
		expect(ageModifierFor(3)).toBe(1);
		expect(ageModifierFor(14)).toBe(1);
		expect(ageModifierFor(15)).toBe(0);
		expect(ageModifierFor(44)).toBe(0);
		expect(ageModifierFor(45)).toBe(-1);
		expect(ageModifierFor(null)).toBe(0);
	});

	it('sums the Centor total 0–4 correctly', () => {
		const d = createNegativeAdult();
		expect(calculateCentorGrade(d).centorScore).toBe(0);
		d.exudate.tonsillarExudate = 'yes';
		expect(calculateCentorGrade(d).centorScore).toBe(1);
		d.nodes.tenderAnteriorCervicalNodes = 'yes';
		expect(calculateCentorGrade(d).centorScore).toBe(2);
		d.fever.feverOver38 = 'yes';
		expect(calculateCentorGrade(d).centorScore).toBe(3);
		d.cough.absenceOfCough = 'yes';
		expect(calculateCentorGrade(d).centorScore).toBe(4);
	});

	it('covers the full McIsaac range −1 to 5 and the risk bands', () => {
		// Centor 0, age >= 45 → mcIsaac -1 → low.
		const low = createNegativeAdult();
		low.identification.ageYears = 60;
		const rLow = calculateCentorGrade(low);
		expect(rLow.mcIsaacScore).toBe(-1);
		expect(rLow.riskBand).toBe('low');

		// Centor 3, age 3–14 → mcIsaac 4 → high (also caps the +1 child bump).
		const child = createNegativeAdult();
		child.identification.ageYears = 8;
		child.exudate.tonsillarExudate = 'yes';
		child.nodes.tenderAnteriorCervicalNodes = 'yes';
		child.fever.feverOver38 = 'yes';
		const rChild = calculateCentorGrade(child);
		expect(rChild.centorScore).toBe(3);
		expect(rChild.ageModifier).toBe(1);
		expect(rChild.mcIsaacScore).toBe(4);
		expect(rChild.riskBand).toBe('high');

		// Centor 4, age 3–14 → mcIsaac 5 → high.
		const max = createNegativeAdult();
		max.identification.ageYears = 10;
		max.exudate.tonsillarExudate = 'yes';
		max.nodes.tenderAnteriorCervicalNodes = 'yes';
		max.fever.feverOver38 = 'yes';
		max.cough.absenceOfCough = 'yes';
		const rMax = calculateCentorGrade(max);
		expect(rMax.mcIsaacScore).toBe(5);
		expect(rMax.riskBand).toBe('high');

		// Centor 2, adult → mcIsaac 2 → moderate.
		const mod = createNegativeAdult();
		mod.exudate.tonsillarExudate = 'yes';
		mod.nodes.tenderAnteriorCervicalNodes = 'yes';
		const rMod = calculateCentorGrade(mod);
		expect(rMod.mcIsaacScore).toBe(2);
		expect(rMod.riskBand).toBe('moderate');
	});

	it('all rule IDs are unique', () => {
		const ids = centorRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Centor flagged-issue detection', () => {
	it('raises antimicrobial stewardship at a low score, no red flags', () => {
		const flags = detectFlaggedIssues(createNegativeAdult(), 0);
		expect(flags.some((f) => f.id === 'F-ANTIMICROBIAL-STEWARDSHIP-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-AIRWAY-QUINSY-001')).toBe(false);
	});

	it('raises the antibiotic-consideration flag when McIsaac >= 4', () => {
		const flags = detectFlaggedIssues(createNegativeAdult(), 4);
		expect(flags.some((f) => f.id === 'F-ANTIBIOTIC-CONSIDERATION-001')).toBe(true);
	});

	it('raises the testing-consideration flag when McIsaac is 2 or 3', () => {
		expect(detectFlaggedIssues(createNegativeAdult(), 2).some((f) => f.id === 'F-TESTING-CONSIDERATION-001')).toBe(true);
		expect(detectFlaggedIssues(createNegativeAdult(), 3).some((f) => f.id === 'F-TESTING-CONSIDERATION-001')).toBe(true);
	});

	it('raises the airway/quinsy red flag when any red-flag input is yes', () => {
		const d = createNegativeAdult();
		d.redFlags.trismus = 'yes';
		const flags = detectFlaggedIssues(d, 2);
		const airway = flags.find((f) => f.id === 'F-AIRWAY-QUINSY-001');
		expect(airway).toBeDefined();
		expect(airway?.priority).toBe('high');
	});

	it('raises the incomplete-assessment flag when a criterion input or age is missing', () => {
		const flags = detectFlaggedIssues(createDefaultAssessment(), 0);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNegativeAdult();
		d.redFlags.muffledVoice = 'yes'; // high
		const flags = detectFlaggedIssues(d, 2); // + medium testing consideration
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
