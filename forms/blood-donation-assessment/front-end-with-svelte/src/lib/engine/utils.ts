import type { AssessmentData, EligibilityStatus } from './types';

/** Calculate age in years from an ISO date string. Returns null if invalid. */
export function calculateAgeYears(dateOfBirth: string): number | null {
	if (!dateOfBirth) return null;
	const dob = new Date(dateOfBirth);
	if (isNaN(dob.getTime())) return null;
	const now = new Date();
	let years = now.getFullYear() - dob.getFullYear();
	const m = now.getMonth() - dob.getMonth();
	if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
		years--;
	}
	return years;
}

/** Friendly label for an eligibility status. */
export function eligibilityLabel(status: EligibilityStatus): string {
	switch (status) {
		case 'eligible':
			return 'Eligible to Donate';
		case 'temporarily-deferred':
			return 'Temporarily Deferred';
		case 'permanently-deferred':
			return 'Permanently Deferred';
		default:
			return '';
	}
}

/** Short label for an eligibility status (dashboard / tables). */
export function eligibilityShortLabel(status: EligibilityStatus): string {
	switch (status) {
		case 'eligible':
			return 'Eligible';
		case 'temporarily-deferred':
			return 'Temp. Deferred';
		case 'permanently-deferred':
			return 'Perm. Deferred';
		default:
			return '';
	}
}

/** Lily token colour triple for an eligibility status (used by Badge/banner). */
export function eligibilityColor(status: EligibilityStatus): string {
	switch (status) {
		case 'eligible':
			return 'bg-success text-success-content border-success';
		case 'temporarily-deferred':
			return 'bg-warning text-warning-content border-warning';
		case 'permanently-deferred':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily token colour triple for a flag priority. */
export function priorityColor(priority: 'urgent' | 'high' | 'medium' | 'low'): string {
	switch (priority) {
		case 'urgent':
			return 'bg-error text-error-content border-error';
		case 'high':
			return 'bg-warning text-warning-content border-warning';
		case 'medium':
			return 'bg-info text-info-content border-info';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Minimum acceptable haemoglobin (g/dL) for a donor of the given sex. */
export function hemoglobinMinimum(sex: AssessmentData['donorDemographics']['sex']): number {
	return sex === 'female' ? 12.5 : 13.5;
}

/** Categorise a haemoglobin reading relative to the sex-specific minimum. */
export function vitalsStatus(data: AssessmentData): 'Normal' | 'Borderline' | 'Out of Range' | 'Not Recorded' {
	const v = data.vitalSigns;
	if (v.hemoglobin == null && v.systolicBp == null && v.diastolicBp == null && v.pulseBpm == null && v.temperatureCelsius == null) {
		return 'Not Recorded';
	}
	const min = hemoglobinMinimum(data.donorDemographics.sex);
	const outOfRange =
		(v.hemoglobin != null && v.hemoglobin < min) ||
		(v.systolicBp != null && (v.systolicBp < 100 || v.systolicBp > 180)) ||
		(v.diastolicBp != null && (v.diastolicBp < 60 || v.diastolicBp > 100)) ||
		(v.pulseBpm != null && (v.pulseBpm < 50 || v.pulseBpm > 100)) ||
		(v.temperatureCelsius != null && v.temperatureCelsius > 37.5);
	if (outOfRange) return 'Out of Range';
	if (v.hemoglobin != null && v.hemoglobin < min + 0.5) return 'Borderline';
	return 'Normal';
}

/** Friendly label for a donor type. */
export function donorTypeLabel(donorType: AssessmentData['donorDemographics']['donorType']): string {
	switch (donorType) {
		case 'first-time':
			return 'First-time';
		case 'regular':
			return 'Regular';
		case 'lapsed':
			return 'Lapsed';
		default:
			return '—';
	}
}

/** Friendly label for a planned donation type. */
export function donationTypeLabel(type: AssessmentData['donationPlan']['plannedDonationType']): string {
	switch (type) {
		case 'whole-blood':
			return 'Whole blood';
		case 'plasma':
			return 'Plasma';
		case 'platelets':
			return 'Platelets';
		case 'red-cells':
			return 'Red cells';
		default:
			return '—';
	}
}

/** The progress-tracked fields, used for the answered-count readout. */
const TRACKED_FIELDS: [keyof AssessmentData, string][] = [
	['donorDemographics', 'firstName'],
	['donorDemographics', 'lastName'],
	['donorDemographics', 'dateOfBirth'],
	['donorDemographics', 'sex'],
	['donorDemographics', 'weight'],
	['donorDemographics', 'height'],
	['donorDemographics', 'donorType'],
	['generalHealth', 'feelingWellToday'],
	['generalHealth', 'adequateSleep'],
	['generalHealth', 'adequateMealAndFluids'],
	['generalHealth', 'feelingFaintOrUnwell'],
	['medicalHistory', 'heartOrCirculatoryDisease'],
	['medicalHistory', 'cancer'],
	['medicalHistory', 'bleedingOrClottingDisorder'],
	['medicalHistory', 'diabetesOnInsulin'],
	['medicalHistory', 'epilepsyOrSeizures'],
	['medicalHistory', 'hivPositive'],
	['medicalHistory', 'hepatitisBOrC'],
	['medicalHistory', 'htlv'],
	['medicalHistory', 'cjdFamilyHistory'],
	['medicalHistory', 'receivedPituitaryHormone'],
	['medicalHistory', 'receivedDuraMaterGraft'],
	['recentIllness', 'feverPastTwoWeeks'],
	['recentIllness', 'infectionPastTwoWeeks'],
	['recentIllness', 'antibioticsPastSevenDays'],
	['recentIllness', 'dentalWorkPastWeek'],
	['recentIllness', 'surgeryPastSixMonths'],
	['recentIllness', 'covidPositivePastTwentyEightDays'],
	['recentIllness', 'vaccinationPastFourWeeks'],
	['travelHistory', 'malariaAreaPastTwelveMonths'],
	['travelHistory', 'westNileVirusAreaPastTwentyEightDays'],
	['travelHistory', 'ukResidence1980To1996Over12Months'],
	['travelHistory', 'bloodTransfusionInUk'],
	['lifestyleRisk', 'ivDrugUseEver'],
	['lifestyleRisk', 'sexWithIvDrugUser'],
	['lifestyleRisk', 'sexInExchangePastTwelveMonths'],
	['lifestyleRisk', 'sexWithNewPartnerPastThreeMonths'],
	['lifestyleRisk', 'multipleSexualPartnersPastThreeMonths'],
	['lifestyleRisk', 'tattooOrPiercingPastFourMonths'],
	['lifestyleRisk', 'acupuncturePastFourMonths'],
	['lifestyleRisk', 'bodyOrEarPiercingPastFourMonths'],
	['lifestyleRisk', 'incarceratedPastTwelveMonths'],
	['pregnancyTransfusion', 'currentlyPregnant'],
	['pregnancyTransfusion', 'pregnancyPastSixMonths'],
	['pregnancyTransfusion', 'breastfeeding'],
	['pregnancyTransfusion', 'receivedTransfusionEver'],
	['pregnancyTransfusion', 'receivedTransplantEver'],
	['vitalSigns', 'hemoglobin'],
	['vitalSigns', 'systolicBp'],
	['vitalSigns', 'diastolicBp'],
	['vitalSigns', 'pulseBpm'],
	['vitalSigns', 'temperatureCelsius'],
	['informedConsent', 'understoodInformation'],
	['informedConsent', 'consentToDonate'],
	['informedConsent', 'consentToTesting'],
	['informedConsent', 'consentToContact'],
	['donationPlan', 'plannedDonationType']
];

/** Total number of progress-tracked fields. */
export const TRACKED_FIELD_COUNT = TRACKED_FIELDS.length;

/** Count how many tracked fields have a non-empty answer. */
export function countAnswered(data: AssessmentData): number {
	let answered = 0;
	for (const [section, field] of TRACKED_FIELDS) {
		const v = (data[section] as unknown as Record<string, unknown>)[field];
		if (v !== null && v !== undefined && v !== '') answered++;
	}
	return answered;
}
