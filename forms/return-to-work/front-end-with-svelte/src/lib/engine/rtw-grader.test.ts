import { describe, it, expect } from 'vitest';
import { calculateReturnToWork } from './rtw-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { restrictionRules } from './restriction-rules';
import type { AssessmentData } from './types';

/** A fully-recovered employee with no restrictions. */
function createFitRecord(): AssessmentData {
	return {
		clinician: {
			name: 'Dr A Patel',
			role: 'gp',
			registrationNumber: 'GMC1234567',
			site: 'Riverside Surgery',
			signature: 'A Patel',
			date: '2026-06-20'
		},
		patient: {
			nhsNumber: '485 777 3456',
			firstName: 'John',
			lastName: 'Smith',
			dateOfBirth: '1985-03-14',
			sex: 'male',
			phone: '07700 900000',
			email: 'john@example.com',
			employerName: 'Acme Ltd',
			employerOhContact: 'oh@acme.example'
		},
		job: {
			jobTitle: 'Accountant',
			roleDescription: 'Office-based finance role',
			contractedHours: 37.5,
			shiftPattern: 'Days',
			safetyCritical: 'no',
			dvlaNotifiableRole: 'no',
			industrySector: 'Finance'
		},
		absence: {
			firstDayOfAbsence: '2026-06-02',
			totalDaysAbsent: 10,
			priorMed3Ref: '',
			previousSelfCertification: 'yes'
		},
		diagnosis: {
			primaryDiagnosis: 'Acute gastroenteritis',
			diagnosisCode: '',
			comorbidConditions: '',
			mechanism: 'illness',
			workplaceCause: 'no',
			riddorReference: ''
		},
		treatment: {
			currentMedications: '',
			ongoingTherapy: '',
			lastConsultationDate: '2026-06-19',
			recoveryTrajectory: 'improving'
		},
		functional: {
			mobility: 'full',
			manualHandling: 'full',
			cognition: 'full',
			mood: 'full',
			sleep: 'full',
			pain: 0,
			drivingCapacity: 'yes',
			standingTolerance: 'full',
			sittingTolerance: 'full',
			screenTolerance: 'full',
			adlIndependence: 'yes'
		},
		fitness: {
			outcome: 'fit',
			clinicianConfidence: 'high',
			validFrom: '2026-06-20',
			validTo: '2026-06-20',
			validWeeks: null,
			reassessmentRequired: 'no'
		},
		phasedReturn: {
			applicable: 'no',
			startHoursPerWeek: null,
			targetFullHoursDate: '',
			daysPerWeek: null,
			supportContact: ''
		},
		adjustments: {
			alteredHours: false,
			amendedDuties: false,
			workplaceAdaptations: false,
			noHeavyLifting: false,
			liftingKgLimit: null,
			noDriving: false,
			noOperatingMachinery: false,
			noWorkingAtHeight: false,
			noLoneWorking: false,
			noNightShifts: false,
			noPatientContact: false,
			sedentaryOnly: false,
			noExposure: '',
			screenBreakFrequency: '',
			workstationReviewRequired: '',
			additionalAdjustments: ''
		},
		followUp: {
			reviewClinic: 'none',
			reviewDate: '',
			ohReferralMade: 'no',
			dvlaNotificationRequired: 'no',
			employerOhNotified: 'no'
		},
		signOff: {
			clinicianOverride: '',
			overrideOutcome: '',
			overrideReason: '',
			finalNotes: '',
			signature: 'A Patel'
		}
	};
}

describe('Return-to-Work grading engine', () => {
	it('returns fit + routine for a fully recovered employee', () => {
		const data = createFitRecord();
		const result = calculateReturnToWork(data);
		expect(result.fitnessStatement).toBe('fit');
		expect(result.computedFitness).toBe('fit');
		expect(result.restrictionPriority).toBe('routine');
		expect(result.firedRules).toHaveLength(0);
		expect(result.overridden).toBe(false);
	});

	it('defaults to not-fit when no outcome is recorded', () => {
		const data = createFitRecord();
		data.fitness.outcome = '';
		const result = calculateReturnToWork(data);
		expect(result.computedFitness).toBe('not-fit');
	});

	it('grades a phased return as standard priority', () => {
		const data = createFitRecord();
		data.fitness.outcome = 'may-be-fit';
		data.phasedReturn.applicable = 'yes';
		data.phasedReturn.targetFullHoursDate = '2026-08-01';
		const result = calculateReturnToWork(data);
		expect(result.fitnessStatement).toBe('may-be-fit');
		expect(result.restrictionPriority).toBe('standard');
		expect(result.firedRules.some((r) => r.id === 'RST-001')).toBe(true);
	});

	it('grades a moderate adjustment as restricted priority', () => {
		const data = createFitRecord();
		data.fitness.outcome = 'may-be-fit';
		data.adjustments.noHeavyLifting = true;
		const result = calculateReturnToWork(data);
		expect(result.restrictionPriority).toBe('restricted');
	});

	it('escalates to high-risk when a formal-risk-assessment adjustment fires', () => {
		const data = createFitRecord();
		data.fitness.outcome = 'may-be-fit';
		data.adjustments.noWorkingAtHeight = true;
		const result = calculateReturnToWork(data);
		expect(result.restrictionPriority).toBe('high-risk');
		expect(result.firedRules.some((r) => r.id === 'RST-020')).toBe(true);
	});

	it('uses the max-grade rule across multiple adjustments', () => {
		const data = createFitRecord();
		data.adjustments.alteredHours = true; // grade 2
		data.adjustments.noHeavyLifting = true; // grade 3
		data.adjustments.noLoneWorking = true; // grade 4
		const result = calculateReturnToWork(data);
		expect(result.restrictionPriority).toBe('high-risk');
	});

	it('applies a clinician override to the final statement', () => {
		const data = createFitRecord();
		data.fitness.outcome = 'not-fit';
		data.signOff.clinicianOverride = 'yes';
		data.signOff.overrideOutcome = 'may-be-fit';
		data.signOff.overrideReason = 'Adjustments now feasible at employer';
		const result = calculateReturnToWork(data);
		expect(result.computedFitness).toBe('not-fit');
		expect(result.fitnessStatement).toBe('may-be-fit');
		expect(result.overridden).toBe(true);
	});

	it('has unique restriction-rule ids', () => {
		const ids = restrictionRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Return-to-Work flagged issues', () => {
	it('returns no flags for a clean fit record', () => {
		const flags = detectAdditionalFlags(createFitRecord());
		expect(flags).toHaveLength(0);
	});

	it('flags a safety-critical role with an active restriction', () => {
		const data = createFitRecord();
		data.job.safetyCritical = 'yes';
		data.adjustments.noDriving = true;
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-SAFETY-001')).toBe(true);
	});

	it('flags a DVLA-notifiable role', () => {
		const data = createFitRecord();
		data.job.dvlaNotifiableRole = 'yes';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-DVLA-001')).toBe(true);
	});

	it('flags a workplace cause without a RIDDOR reference', () => {
		const data = createFitRecord();
		data.diagnosis.workplaceCause = 'yes';
		data.diagnosis.riddorReference = '';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-RIDDOR-001')).toBe(true);
	});

	it('flags a mental-health diagnosis without a review date', () => {
		const data = createFitRecord();
		data.diagnosis.mechanism = 'mental-health';
		data.followUp.reviewDate = '';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-MH-001')).toBe(true);
	});

	it('flags an absence over 28 days without an OH referral', () => {
		const data = createFitRecord();
		data.absence.totalDaysAbsent = 42;
		data.followUp.ohReferralMade = 'no';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-OH-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const data = createFitRecord();
		data.job.dvlaNotifiableRole = 'yes'; // high
		data.fitness.clinicianConfidence = 'low'; // low
		data.followUp.reviewDate = '';
		const flags = detectAdditionalFlags(data);
		const order = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
