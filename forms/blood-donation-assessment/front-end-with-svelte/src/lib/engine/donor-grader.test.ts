import { describe, it, expect } from 'vitest';
import { calculateDonorGrade, gradeDonor } from './donor-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { dsgRules } from './donor-rules';
import type { AssessmentData } from './types';

/**
 * A fully-eligible donor: all answers safe, vitals in range. Built inline (not
 * via the store factory) so the test has no `$app/*` dependency under Vitest.
 */
function eligibleDonor(): AssessmentData {
	return {
		donorDemographics: { firstName: 'John', lastName: 'Smith', dateOfBirth: '1985-04-12', sex: 'male', weight: 80, height: 180, donorType: 'regular', lastDonationDate: '' },
		generalHealth: { feelingWellToday: 'yes', adequateSleep: 'yes', adequateMealAndFluids: 'yes', feelingFaintOrUnwell: 'no' },
		medicalHistory: {
			heartOrCirculatoryDisease: 'no', cancer: 'no', bleedingOrClottingDisorder: 'no', diabetesOnInsulin: 'no', epilepsyOrSeizures: 'no',
			hivPositive: 'no', hepatitisBOrC: 'no', htlv: 'no', cjdFamilyHistory: 'no', receivedPituitaryHormone: 'no', receivedDuraMaterGraft: 'no',
			currentMedications: []
		},
		recentIllness: { feverPastTwoWeeks: 'no', infectionPastTwoWeeks: 'no', antibioticsPastSevenDays: 'no', dentalWorkPastWeek: 'no', surgeryPastSixMonths: 'no', covidPositivePastTwentyEightDays: 'no', vaccinationPastFourWeeks: 'no', vaccinationDetails: '' },
		travelHistory: { recentTravel: [], malariaAreaPastTwelveMonths: 'no', westNileVirusAreaPastTwentyEightDays: 'no', ukResidence1980To1996Over12Months: 'no', bloodTransfusionInUk: 'no' },
		lifestyleRisk: { ivDrugUseEver: 'no', sexWithIvDrugUser: 'no', sexInExchangePastTwelveMonths: 'no', sexWithNewPartnerPastThreeMonths: 'no', multipleSexualPartnersPastThreeMonths: 'no', tattooOrPiercingPastFourMonths: 'no', acupuncturePastFourMonths: 'no', bodyOrEarPiercingPastFourMonths: 'no', incarceratedPastTwelveMonths: 'no' },
		pregnancyTransfusion: { currentlyPregnant: 'no', pregnancyPastSixMonths: 'no', breastfeeding: 'no', receivedTransfusionEver: 'no', lastTransfusionDate: '', receivedTransplantEver: 'no' },
		vitalSigns: { hemoglobin: 15.0, systolicBp: 120, diastolicBp: 75, pulseBpm: 65, temperatureCelsius: 36.6 },
		informedConsent: { understoodInformation: 'yes', consentToDonate: 'yes', consentToTesting: 'yes', consentToContact: 'yes' },
		donationPlan: { plannedDonationType: 'whole-blood', preferredDonationDate: '', session: '', notes: '' }
	};
}

describe('Blood Donation Grading Engine', () => {
	it('returns eligible for a fully-clear donor', () => {
		const result = calculateDonorGrade(eligibleDonor());
		expect(result.eligibilityStatus).toBe('eligible');
		expect(result.firedRules).toHaveLength(0);
		expect(result.deferralWindow).toBe('');
	});

	it('temporarily defers for low haemoglobin', () => {
		const d = eligibleDonor();
		d.vitalSigns.hemoglobin = 12.0; // below 13.5 male minimum
		const result = calculateDonorGrade(d);
		expect(result.eligibilityStatus).toBe('temporarily-deferred');
		expect(result.deferralWindow).not.toBe('');
		expect(result.firedRules.some((r) => r.id === 'DSG-VITAL-001')).toBe(true);
	});

	it('permanently defers for a transfusion-transmissible infection', () => {
		const d = eligibleDonor();
		d.medicalHistory.hivPositive = 'yes';
		const result = calculateDonorGrade(d);
		expect(result.eligibilityStatus).toBe('permanently-deferred');
		expect(result.firedRules.some((r) => r.id === 'DSG-MED-001')).toBe(true);
	});

	it('permanent deferral wins over a temporary deferral', () => {
		const d = eligibleDonor();
		d.vitalSigns.hemoglobin = 12.0; // temporary
		d.lifestyleRisk.ivDrugUseEver = 'yes'; // permanent
		const { eligibilityStatus } = gradeDonor(d);
		expect(eligibilityStatus).toBe('permanently-deferred');
	});

	it('all rule IDs are unique', () => {
		const ids = dsgRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Blood Donation Flagged Issues Detection', () => {
	it('returns no flags for a fully-clear donor', () => {
		expect(detectAdditionalFlags(eligibleDonor())).toHaveLength(0);
	});

	it('flags an under-weight donor', () => {
		const d = eligibleDonor();
		d.donorDemographics.weight = 45;
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-WEIGHT-001')).toBe(true);
	});

	it('flags a transfusion-transmissible infection as urgent', () => {
		const d = eligibleDonor();
		d.medicalHistory.hepatitisBOrC = 'yes';
		const flags = detectAdditionalFlags(d);
		const f = flags.find((x) => x.id === 'FLAG-MED-INF-001');
		expect(f).toBeDefined();
		expect(f?.priority).toBe('urgent');
	});

	it('sorts flags by priority (urgent first)', () => {
		const d = eligibleDonor();
		d.medicalHistory.diabetesOnInsulin = 'yes'; // medium
		d.generalHealth.feelingFaintOrUnwell = 'yes'; // urgent
		const priorities = detectAdditionalFlags(d).map((f) => f.priority);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 };
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
