import type { AssessmentData, DonorType, EligibilityStatus } from '$lib/engine/types';
import { calculateDonorGrade } from '$lib/engine/donor-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	donorName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	donorName: string;
	assessedDate: string;
	eligibilityStatus: EligibilityStatus;
	deferralWindow: string;
	donorType: DonorType;
	hemoglobin: number | null;
	flagCount: number;
	riskFlag: boolean;
}

/** Apply the common "clear" answers so a donor passes unless overridden. */
function baseDonor(): AssessmentData {
	const d = createDefaultAssessment();
	d.generalHealth = { feelingWellToday: 'yes', adequateSleep: 'yes', adequateMealAndFluids: 'yes', feelingFaintOrUnwell: 'no' };
	d.medicalHistory = { ...d.medicalHistory, heartOrCirculatoryDisease: 'no', cancer: 'no', bleedingOrClottingDisorder: 'no', diabetesOnInsulin: 'no', epilepsyOrSeizures: 'no', hivPositive: 'no', hepatitisBOrC: 'no', htlv: 'no', cjdFamilyHistory: 'no', receivedPituitaryHormone: 'no', receivedDuraMaterGraft: 'no' };
	d.recentIllness = { feverPastTwoWeeks: 'no', infectionPastTwoWeeks: 'no', antibioticsPastSevenDays: 'no', dentalWorkPastWeek: 'no', surgeryPastSixMonths: 'no', covidPositivePastTwentyEightDays: 'no', vaccinationPastFourWeeks: 'no', vaccinationDetails: '' };
	d.travelHistory = { ...d.travelHistory, malariaAreaPastTwelveMonths: 'no', westNileVirusAreaPastTwentyEightDays: 'no', ukResidence1980To1996Over12Months: 'no', bloodTransfusionInUk: 'no' };
	d.lifestyleRisk = { ivDrugUseEver: 'no', sexWithIvDrugUser: 'no', sexInExchangePastTwelveMonths: 'no', sexWithNewPartnerPastThreeMonths: 'no', multipleSexualPartnersPastThreeMonths: 'no', tattooOrPiercingPastFourMonths: 'no', acupuncturePastFourMonths: 'no', bodyOrEarPiercingPastFourMonths: 'no', incarceratedPastTwelveMonths: 'no' };
	d.pregnancyTransfusion = { ...d.pregnancyTransfusion, currentlyPregnant: 'no', pregnancyPastSixMonths: 'no', breastfeeding: 'no', receivedTransfusionEver: 'no', receivedTransplantEver: 'no' };
	d.informedConsent = { understoodInformation: 'yes', consentToDonate: 'yes', consentToTesting: 'yes', consentToContact: 'yes' };
	d.donationPlan = { ...d.donationPlan, plannedDonationType: 'whole-blood' };
	return d;
}

/** Fully eligible: all clear, vitals in range. */
function eligible(): AssessmentData {
	const d = baseDonor();
	d.donorDemographics = { ...d.donorDemographics, firstName: 'Jane', lastName: 'Smith', dateOfBirth: '1986-03-14', sex: 'female', weight: 68, height: 168, donorType: 'regular' };
	d.vitalSigns = { hemoglobin: 13.8, systolicBp: 118, diastolicBp: 74, pulseBpm: 66, temperatureCelsius: 36.6 };
	return d;
}

/** Temporarily deferred: low haemoglobin and recent malaria-area travel. */
function temporaryLowHb(): AssessmentData {
	const d = baseDonor();
	d.donorDemographics = { ...d.donorDemographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1992-07-22', sex: 'female', weight: 59, height: 162, donorType: 'first-time' };
	d.travelHistory.malariaAreaPastTwelveMonths = 'yes';
	d.travelHistory.recentTravel = [{ country: 'Kenya', returnDate: '2026-04-01', duration: '2 weeks' }];
	d.vitalSigns = { hemoglobin: 12.0, systolicBp: 110, diastolicBp: 70, pulseBpm: 72, temperatureCelsius: 36.8 };
	return d;
}

/** Permanently deferred: transfusion-transmissible infection. */
function permanentInfection(): AssessmentData {
	const d = baseDonor();
	d.donorDemographics = { ...d.donorDemographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1968-11-05', sex: 'female', weight: 72, height: 160, donorType: 'lapsed' };
	d.medicalHistory.hepatitisBOrC = 'yes';
	d.medicalHistory.currentMedications = [{ name: 'Tenofovir', reason: 'Hepatitis B' }];
	d.vitalSigns = { hemoglobin: 13.2, systolicBp: 128, diastolicBp: 80, pulseBpm: 70, temperatureCelsius: 36.7 };
	return d;
}

/** Temporarily deferred: pregnant and not feeling well today. */
function temporaryPregnancy(): AssessmentData {
	const d = baseDonor();
	d.donorDemographics = { ...d.donorDemographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1979-02-18', sex: 'male', weight: 88, height: 182, donorType: 'regular' };
	d.generalHealth.feelingWellToday = 'no';
	d.recentIllness.feverPastTwoWeeks = 'yes';
	d.vitalSigns = { hemoglobin: 15.1, systolicBp: 134, diastolicBp: 86, pulseBpm: 78, temperatureCelsius: 37.8 };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'BD-2026-0001', donorName: 'Smith, Jane', assessedDate: '2026-06-10', data: eligible() },
	{ id: 'BD-2026-0002', donorName: 'Patel, Priya', assessedDate: '2026-06-12', data: temporaryLowHb() },
	{ id: 'BD-2026-0003', donorName: 'Jones, Margaret', assessedDate: '2026-06-15', data: permanentInfection() },
	{ id: 'BD-2026-0004', donorName: 'Williams, David', assessedDate: '2026-06-18', data: temporaryPregnancy() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateDonorGrade(s.data);
	return {
		id: s.id,
		donorName: s.donorName,
		assessedDate: s.assessedDate,
		eligibilityStatus: g.eligibilityStatus,
		deferralWindow: g.deferralWindow,
		donorType: s.data.donorDemographics.donorType,
		hemoglobin: s.data.vitalSigns.hemoglobin,
		flagCount: g.additionalFlags.length,
		riskFlag: g.additionalFlags.some((f) => f.priority === 'urgent')
	};
});
