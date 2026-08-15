import type { AssessmentData, VaccinationLevel } from '#lib/engine/types.js';
import { calculateVaccinationStatus } from '#lib/engine/vaccination-grader.js';
import { detectAdditionalFlags } from '#lib/engine/flagged-issues.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	assessedDate: string;
	vaccinationLevel: VaccinationLevel;
	vaccinationScore: number;
	immunocompromisedFlag: boolean;
	contraindicationFlag: boolean;
	flagCount: number;
}

/** An up-to-date patient: all childhood and adult vaccines complete, strong consent. */
function upToDate(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = { ...d.patientInformation, patientName: 'John Smith', dateOfBirth: '1968-04-12', patientSex: 'male', patientAge: '58', nhsNumber: '943 476 5919', gpPractice: 'Oak Tree Surgery' };
	d.immunizationHistory = { ...d.immunizationHistory, hasVaccinationRecord: 'yes', recordSource: 'gpRecords', lastReviewDate: '2026-05-01', previousAdverseReactions: 'no', immunocompromised: 'no' };
	d.childhoodVaccinations = { dtapIpvHibHepb: 2, pneumococcal: 2, rotavirus: 2, meningitisB: 2, mmr: 2, hibMenc: 2, preschoolBooster: 2 };
	d.adultVaccinations = { tdIpvBooster: 2, hpv: 2, meningitisAcwy: 2, influenzaAnnual: 2, covid19: 2, shingles: 2, pneumococcalPpv: 2 };
	d.consentInformation = { ...d.consentInformation, informationProvided: 5, risksExplained: 5, benefitsExplained: 5, questionsAnswered: 5, consentGiven: 'yes', consentDate: '2026-06-10' };
	d.clinicalReview = { ...d.clinicalReview, postVaccinationObservation: 5, immediateReaction: 'no', reviewingClinician: 'Nurse A. Okafor' };
	return d;
}

/** A partially-complete patient: a mix of complete and partial vaccines, fair consent. */
function partiallyComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = { ...d.patientInformation, patientName: 'Priya Patel', dateOfBirth: '1990-09-30', patientSex: 'female', patientAge: '35', nhsNumber: '721 938 4102', gpPractice: 'Riverside Practice' };
	d.immunizationHistory = { ...d.immunizationHistory, hasVaccinationRecord: 'yes', recordSource: 'redBook', lastReviewDate: '2025-11-20', previousAdverseReactions: 'no', immunocompromised: 'no' };
	d.childhoodVaccinations = { dtapIpvHibHepb: 2, pneumococcal: 1, rotavirus: 1, meningitisB: 1, mmr: 2, hibMenc: 1, preschoolBooster: 1 };
	d.adultVaccinations = { tdIpvBooster: 1, hpv: 2, meningitisAcwy: 1, influenzaAnnual: 1, covid19: 2, shingles: null, pneumococcalPpv: null };
	d.travelVaccinations = { ...d.travelVaccinations, travelPlanned: 'yes', travelDestination: 'Thailand', hepatitisA: 1, typhoid: 1, yellowFever: 0 };
	d.consentInformation = { ...d.consentInformation, informationProvided: 4, risksExplained: 4, benefitsExplained: 3, questionsAnswered: 4, consentGiven: 'yes', consentDate: '2026-06-12' };
	d.clinicalReview = { ...d.clinicalReview, postVaccinationObservation: 4, immediateReaction: 'no', catchUpScheduleNeeded: 'yes', reviewingClinician: 'Nurse B. Lewis' };
	return d;
}

/** An overdue patient: most vaccines not given, MMR missing, weak consent. */
function overdue(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = { ...d.patientInformation, patientName: 'Margaret Jones', dateOfBirth: '1948-01-22', patientSex: 'female', patientAge: '78', nhsNumber: '384 615 7230', gpPractice: 'Hillcrest Medical Centre' };
	d.immunizationHistory = { ...d.immunizationHistory, hasVaccinationRecord: 'no', recordSource: 'patientRecall', previousAdverseReactions: 'yes', adverseReactionDetails: 'Mild fever after flu jab', immunocompromised: 'no' };
	d.childhoodVaccinations = { dtapIpvHibHepb: 1, pneumococcal: 0, rotavirus: 0, meningitisB: 0, mmr: 0, hibMenc: 0, preschoolBooster: 0 };
	d.adultVaccinations = { tdIpvBooster: 1, hpv: 0, meningitisAcwy: 0, influenzaAnnual: 0, covid19: 0, shingles: 0, pneumococcalPpv: 0 };
	d.consentInformation = { ...d.consentInformation, informationProvided: 2, risksExplained: 2, benefitsExplained: 1, questionsAnswered: 2, consentGiven: 'yes', consentDate: '2026-06-15' };
	d.clinicalReview = { ...d.clinicalReview, postVaccinationObservation: 3, immediateReaction: 'no', catchUpScheduleNeeded: 'yes', referralNeeded: 'yes', reviewingClinician: 'Nurse C. Ahmed' };
	return d;
}

/** A contraindicated patient: previous anaphylaxis and immunocompromised. */
function contraindicated(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = { ...d.patientInformation, patientName: 'David Williams', dateOfBirth: '1955-11-03', patientSex: 'male', patientAge: '70', nhsNumber: '512 847 9063', gpPractice: 'Parkview Surgery' };
	d.immunizationHistory = { ...d.immunizationHistory, hasVaccinationRecord: 'yes', recordSource: 'nhsApp', lastReviewDate: '2026-02-01', previousAdverseReactions: 'yes', adverseReactionDetails: 'Anaphylaxis to influenza vaccine', immunocompromised: 'yes', immunocompromisedDetails: 'On immunosuppressive therapy' };
	d.childhoodVaccinations = { dtapIpvHibHepb: 2, pneumococcal: 2, rotavirus: null, meningitisB: null, mmr: 2, hibMenc: 2, preschoolBooster: 2 };
	d.adultVaccinations = { tdIpvBooster: 2, hpv: null, meningitisAcwy: null, influenzaAnnual: 0, covid19: 1, shingles: 0, pneumococcalPpv: 1 };
	d.contraindicationsAllergies = { ...d.contraindicationsAllergies, eggAllergy: 'yes', pregnant: 'notApplicable', severeIllness: 'no', previousAnaphylaxis: 'yes', anaphylaxisDetails: 'Anaphylaxis to egg-grown influenza vaccine' };
	d.consentInformation = { ...d.consentInformation, informationProvided: 4, risksExplained: 5, benefitsExplained: 4, questionsAnswered: 4, consentGiven: 'yes', consentDate: '2026-06-18' };
	d.clinicalReview = { ...d.clinicalReview, postVaccinationObservation: 4, immediateReaction: 'no', referralNeeded: 'yes', reviewingClinician: 'Nurse D. Roberts' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'VA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: upToDate() },
	{ id: 'VA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: partiallyComplete() },
	{ id: 'VA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: overdue() },
	{ id: 'VA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: contraindicated() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { level, score } = calculateVaccinationStatus(s.data);
	const flags = detectAdditionalFlags(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		vaccinationLevel: level,
		vaccinationScore: score,
		immunocompromisedFlag: s.data.immunizationHistory.immunocompromised === 'yes',
		contraindicationFlag:
			s.data.contraindicationsAllergies.previousAnaphylaxis === 'yes' ||
			s.data.contraindicationsAllergies.pregnant === 'yes' ||
			s.data.contraindicationsAllergies.severeIllness === 'yes',
		flagCount: flags.length
	};
});
