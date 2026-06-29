import { describe, expect, it } from 'vitest';
import { b1Rules } from './b1-rules';
import { detectFlaggedIssues } from './flagged-issues';
import { validateB1 } from './b1-validator';
import type { AssessmentData } from './types';

function emptyAssessment(): AssessmentData {
	return {
		personalDetails: {
			title: '',
			fullName: '',
			dateOfBirth: '',
			addressLine1: '',
			addressLine2: '',
			addressLine3: '',
			postcode: '',
			email: '',
			contactNumber: '',
			changeOfDetails: ''
		},
		healthcareProfessionals: {
			gp: {
				gpName: '',
				surgeryName: '',
				addressLine1: '',
				addressLine2: '',
				town: '',
				postcode: '',
				contactNumber: '',
				email: '',
				dateLastSeen: ''
			},
			consultant: {
				consultantName: '',
				speciality: '',
				department: '',
				hospitalName: '',
				addressLine1: '',
				addressLine2: '',
				town: '',
				postcode: '',
				contactNumber: '',
				email: '',
				dateLastSeen: ''
			}
		},
		conditionHistory: {
			brainHaemorrhage: false,
			brainHaemorrhageDate: '',
			brainHaemorrhageDetails: '',
			severeHeadInjury: false,
			severeHeadInjuryDate: '',
			severeHeadInjuryDetails: '',
			otherCondition: false,
			otherConditionDate: '',
			otherConditionDetails: '',
			brainSurgeryDate: '',
			brainSurgeryNotApplicable: false
		},
		treatmentProvider: {
			lastSeen: '',
			gpLastContactDate: '',
			gpNextContactDate: '',
			consultantLastContactDate: '',
			consultantNextContactDate: ''
		},
		blackouts: {
			hadBlackouts: '',
			blackoutDate: ''
		},
		seizures: {
			hadSeizures: '',
			diagnosis: '',
			firstEver: { date: '', details: '' },
			multiple: {
				twoOrMoreWithinFiveYears: '',
				firstAwakeSeizureDate: '',
				firstAsleepSeizureDate: '',
				lastTwoAwakeSeizureDate1: '',
				lastTwoAwakeSeizureDate2: '',
				lastTwoAsleepSeizureDate1: '',
				lastTwoAsleepSeizureDate2: '',
				firstSleepAttackAfterLastAwakeAttackDate: '',
				affectedConsciousness: '',
				wouldHaveAffectedDriving: '',
				attackDescription: '',
				resultOfMedicationAdvice: '',
				dateMedicationStartedToReduce: '',
				previousMedicationRestarted: '',
				datePreviousMedicationRestarted: '',
				dateOfLastSeizurePriorToWithdrawal: '',
				provokedSeizureDetails: ''
			},
			epilepsyDeclaration: {
				declarationAccepted: false,
				signedName: '',
				signatureDate: ''
			}
		},
		medication: {
			noMedicationTaken: false,
			entries: [],
			makesDrowsyOrConfused: ''
		},
		vpShunt: {
			hadVpShuntOrDrain: '',
			procedureDate: ''
		},
		dailyLiving: {
			needsHelp: '',
			helpDetails: ''
		},
		doubleVision: {
			hasDoubleVision: '',
			suppressedOrControlled: '',
			correctionMethod: '',
			correctionMethodOther: ''
		},
		eyesight: {
			hasEyesightProblems: '',
			details: ''
		},
		vehicleAdaptations: {
			needsAdaptations: '',
			previouslyDeclared: '',
			additionalControlsFitted: ''
		},
		authorisation: {
			declarationAccepted: false,
			name: '',
			signatureDate: '',
			electronicCorrespondenceConsent: '',
			dvlaContactPreference: '',
			healthcareContactPreference: ''
		}
	};
}

/**
 * Build a minimal-but-complete declaration for a "no neurological issues"
 * driver: every required field is satisfied with the simplest possible answer.
 */
function minimalCompleteAssessment(): AssessmentData {
	const d = emptyAssessment();
	d.personalDetails.title = 'Mr';
	d.personalDetails.fullName = 'Alex Driver';
	d.personalDetails.dateOfBirth = '1990-04-01';
	d.personalDetails.addressLine1 = '1 Example Street';
	d.personalDetails.postcode = 'SW1A 1AA';
	d.personalDetails.contactNumber = '07700 900000';

	d.healthcareProfessionals.gp.gpName = 'Dr Smith';
	d.healthcareProfessionals.gp.surgeryName = 'High Street Surgery';
	d.healthcareProfessionals.gp.postcode = 'SW1A 1AA';
	d.healthcareProfessionals.gp.dateLastSeen = '2024-12-01';

	d.conditionHistory.brainSurgeryNotApplicable = true;

	d.treatmentProvider.lastSeen = 'gp';
	d.treatmentProvider.gpLastContactDate = '2024-12-01';

	d.blackouts.hadBlackouts = 'no';
	d.seizures.hadSeizures = 'no';

	d.medication.noMedicationTaken = true;

	d.vpShunt.hadVpShuntOrDrain = 'no';
	d.dailyLiving.needsHelp = 'no';
	d.doubleVision.hasDoubleVision = 'no';
	d.eyesight.hasEyesightProblems = 'no';
	d.vehicleAdaptations.needsAdaptations = 'no';

	d.authorisation.declarationAccepted = true;
	d.authorisation.name = 'Alex Driver';
	d.authorisation.signatureDate = '2025-01-15';
	d.authorisation.electronicCorrespondenceConsent = 'no';

	return d;
}

describe('B1 Rule Set', () => {
	it('has a non-empty rule set', () => {
		expect(b1Rules.length).toBeGreaterThan(0);
	});

	it('all rule IDs are unique', () => {
		const ids = b1Rules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('every rule references a known section', () => {
		const validSections = new Set([
			'personalDetails',
			'healthcareProfessionals',
			'conditionHistory',
			'treatmentProvider',
			'blackouts',
			'seizures',
			'medication',
			'vpShunt',
			'dailyLiving',
			'doubleVision',
			'eyesight',
			'vehicleAdaptations',
			'authorisation'
		]);
		for (const r of b1Rules) {
			expect(validSections.has(r.section)).toBe(true);
		}
	});
});

describe('B1 Validator', () => {
	it('marks an empty assessment as incomplete', () => {
		const result = validateB1(emptyAssessment());
		expect(result.complete).toBe(false);
		expect(result.totalSatisfied).toBe(0);
		expect(result.missing.length).toBe(result.totalRequired);
	});

	it('marks a minimal but complete declaration as complete', () => {
		const result = validateB1(minimalCompleteAssessment());
		expect(result.complete).toBe(true);
		expect(result.missing).toHaveLength(0);
		expect(result.totalSatisfied).toBe(result.totalRequired);
	});

	it('Q4 No: skips Q5 and Q6 follow-ups (no missing seizure rules)', () => {
		const d = minimalCompleteAssessment();
		d.seizures.hadSeizures = 'no';
		const result = validateB1(d);
		const seizureMissing = result.missing.filter((m) => m.section === 'seizures');
		expect(seizureMissing).toHaveLength(0);
	});

	it('Q4 Yes (first-ever): requires Q5 date, not Q6 fields', () => {
		const d = minimalCompleteAssessment();
		d.seizures.hadSeizures = 'yes';
		d.seizures.diagnosis = 'first-ever';
		// firstEver.date is still empty → must fire Q5-01
		const result = validateB1(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('Q5-01');
		expect(ids).not.toContain('Q6a-01');
		expect(ids).not.toContain('Q6g-01');
	});

	it('Q4 Yes (more-than-one): requires Q6 fields and epilepsy declaration', () => {
		const d = minimalCompleteAssessment();
		d.seizures.hadSeizures = 'yes';
		d.seizures.diagnosis = 'more-than-one-or-epilepsy';
		const result = validateB1(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('Q6a-01');
		expect(ids).toContain('Q6g-01');
		expect(ids).toContain('Q6i-01');
		expect(ids).toContain('Q6-EPI-01');
		expect(ids).toContain('Q6-EPI-02');
		expect(ids).toContain('Q6-EPI-03');
	});

	it('Q10 No: skips Q10a/Q10b sub-questions', () => {
		const d = minimalCompleteAssessment();
		d.doubleVision.hasDoubleVision = 'no';
		const result = validateB1(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('Q10a-01');
		expect(ids).not.toContain('Q10b-01');
	});

	it('Q10 Yes: requires Q10a and conditional Q10b', () => {
		const d = minimalCompleteAssessment();
		d.doubleVision.hasDoubleVision = 'yes';
		d.doubleVision.suppressedOrControlled = 'yes';
		// no correction method chosen yet
		const result = validateB1(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('Q10b-01');
	});

	it('Q10b Other: requires textual description', () => {
		const d = minimalCompleteAssessment();
		d.doubleVision.hasDoubleVision = 'yes';
		d.doubleVision.suppressedOrControlled = 'yes';
		d.doubleVision.correctionMethod = 'other';
		const result = validateB1(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('Q10b-02');
	});

	it('Q12 No: skips Q12a and Q12b', () => {
		const d = minimalCompleteAssessment();
		d.vehicleAdaptations.needsAdaptations = 'no';
		const result = validateB1(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('Q12a-01');
		expect(ids).not.toContain('Q12b-01');
	});

	it('Q12 Yes then Q12a Yes: requires Q12b', () => {
		const d = minimalCompleteAssessment();
		d.vehicleAdaptations.needsAdaptations = 'yes';
		d.vehicleAdaptations.previouslyDeclared = 'yes';
		const result = validateB1(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('Q12b-01');
	});

	it('electronic correspondence Yes: requires DVLA and HCP contact preferences', () => {
		const d = minimalCompleteAssessment();
		d.authorisation.electronicCorrespondenceConsent = 'yes';
		const result = validateB1(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('AUTH-05');
		expect(ids).toContain('AUTH-06');
	});

	it('groups missing items by section', () => {
		const result = validateB1(emptyAssessment());
		const sectionKeys = new Set(result.sections.map((s) => s.section));
		expect(sectionKeys.has('personalDetails')).toBe(true);
		expect(sectionKeys.has('authorisation')).toBe(true);
		// Each section's "missing" array length must equal required - satisfied
		for (const s of result.sections) {
			expect(s.missing.length).toBe(s.required - s.satisfied);
		}
	});
});

describe('Flagged Issues', () => {
	it('returns no flags for a benign minimal-complete assessment', () => {
		const flags = detectFlaggedIssues(minimalCompleteAssessment());
		expect(flags).toHaveLength(0);
	});

	it('flags missing epilepsy declaration as urgent', () => {
		const d = minimalCompleteAssessment();
		d.seizures.hadSeizures = 'yes';
		d.seizures.diagnosis = 'more-than-one-or-epilepsy';
		// epilepsy declaration intentionally not signed
		const flags = detectFlaggedIssues(d);
		const fired = flags.find((f) => f.id === 'FLAG-EPI-001');
		expect(fired).toBeDefined();
		expect(fired?.priority).toBe('urgent');
		expect(flags[0].priority).toBe('urgent');
	});

	it('flags drowsy medication as high', () => {
		const d = minimalCompleteAssessment();
		d.medication.makesDrowsyOrConfused = 'yes';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-MED-001' && f.priority === 'high')).toBe(true);
	});

	it('flags uncontrolled double vision as high', () => {
		const d = minimalCompleteAssessment();
		d.doubleVision.hasDoubleVision = 'yes';
		d.doubleVision.suppressedOrControlled = 'no';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-DIPL-001' && f.priority === 'high')).toBe(true);
	});

	it('flags VP shunt as medium', () => {
		const d = minimalCompleteAssessment();
		d.vpShunt.hadVpShuntOrDrain = 'yes';
		d.vpShunt.procedureDate = '2024-01-01';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-VPS-001' && f.priority === 'medium')).toBe(true);
	});

	it('sorts flags by priority (urgent > high > medium > low)', () => {
		const d = minimalCompleteAssessment();
		d.seizures.hadSeizures = 'yes';
		d.seizures.diagnosis = 'more-than-one-or-epilepsy';
		d.medication.makesDrowsyOrConfused = 'yes';
		d.vpShunt.hadVpShuntOrDrain = 'yes';
		d.vehicleAdaptations.needsAdaptations = 'yes';
		const flags = detectFlaggedIssues(d);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
