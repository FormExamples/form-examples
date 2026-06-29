import { describe, it, expect } from 'vitest';
import { calculateVaccinationGrade } from './vaccination-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { vaccinationRules } from './vaccination-rules';
import type { AssessmentData } from './types';

/**
 * A blank checklist literal. Kept local to the test so the engine suite has no
 * dependency on the Svelte store (which imports `$app/environment`).
 */
function blank(): AssessmentData {
	return {
		demographics: { firstName: '', lastName: '', dateOfBirth: '', sex: '', weight: null, height: null, bmi: null, occupation: '', occupationCategory: '', employer: '' },
		vaccinationHistory: { hasVaccinationRecord: '', recordSource: '', recordSourceOther: '', previousAdverseReaction: '', adverseReactionDetails: '', adverseReactionVaccine: '', adverseReactionSeverity: '', immunocompromised: '', immunocompromisedDetails: '', pregnantOrPlanning: '' },
		childhoodImmunisations: { mmrDose1: '', mmrDose1Date: '', mmrDose2: '', mmrDose2Date: '', dtpPrimaryCourse: '', dtpPrimaryDate: '', dtpBooster: '', dtpBoosterDate: '', polioPrimaryCourse: '', polioPrimaryDate: '', polioBooster: '', polioBoosterDate: '', hibVaccine: '', hibVaccineDate: '', menCVaccine: '', menCVaccineDate: '', menACWYVaccine: '', menACWYVaccineDate: '', pcvVaccine: '', pcvVaccineDate: '', notes: '' },
		occupationalVaccines: { hepatitisBCourse: '', hepatitisBCourseDate: '', hepatitisBDosesReceived: null, hepatitisBAntiBodyLevel: '', bcgVaccine: '', bcgVaccineDate: '', bcgScarPresent: '', varicellaVaccine: '', varicellaVaccineDate: '', varicellaHistory: '', hepatitisAVaccine: '', hepatitisAVaccineDate: '', typhoidVaccine: '', typhoidVaccineDate: '', rabiesVaccine: '', rabiesVaccineDate: '', notes: '' },
		travelVaccines: { travelPlanned: '', travelDestination: '', travelDepartureDate: '', travelReturnDate: '', yellowFeverVaccine: '', yellowFeverVaccineDate: '', yellowFeverCertificate: '', japaneseEncephalitisVaccine: '', japaneseEncephalitisDate: '', tickBorneEncephalitisVaccine: '', tickBorneEncephalitisDate: '', choleraVaccine: '', choleraVaccineDate: '', meningococcalACWYTravel: '', meningococcalACWYTravelDate: '', malariaProphylaxis: '', malariaProphylaxisDrug: '', notes: '' },
		covid19Vaccination: { covidPrimaryCourse: '', covidPrimaryVaccineType: '', covidDose1Date: '', covidDose2Date: '', covidBooster1: '', covidBooster1Date: '', covidBooster1Type: '', covidBooster2: '', covidBooster2Date: '', covidBooster2Type: '', covidAutumnBooster: '', covidAutumnBoosterDate: '', totalCovidDoses: null, covidAdverseReaction: '', covidAdverseReactionDetails: '', notes: '' },
		influenzaVaccination: { fluVaccineCurrentSeason: '', fluVaccineCurrentDate: '', fluVaccineType: '', fluVaccinePreviousSeason: '', fluVaccineAnnualRecipient: '', fluHighRiskGroup: '', fluHighRiskReason: '', fluAdverseReaction: '', fluAdverseReactionDetails: '', notes: '' },
		contraindicationsAllergies: { eggAllergy: '', eggAllergySeverity: '', gelatinAllergy: '', neomycinAllergy: '', latexAllergy: '', yeastAllergy: '', pegPolysorbateAllergy: '', otherVaccineAllergies: '', historyOfGBS: '', gbsDetails: '', onImmunosuppressants: '', immunosuppressantDetails: '', onBloodProductsRecent: '', bloodProductsDetails: '', liveVaccineContraindicated: '', liveVaccineContraindicationReason: '', notes: '' },
		serologyImmunityTesting: { hepBSurfaceAntibody: '', hepBSurfaceAntibodyLevel: null, hepBSurfaceAntibodyDate: '', varicellaIgG: '', varicellaIgGDate: '', measlesIgG: '', measlesIgGDate: '', rubellaIgG: '', rubellaIgGDate: '', mumpsIgG: '', mumpsIgGDate: '', hepAIgG: '', hepAIgGDate: '', tetanusAntibody: '', tetanusAntibodyDate: '', tbIGRAResult: '', tbIGRADate: '', mantouxResult: '', mantouxIndurationMm: null, notes: '' },
		scheduleCompliance: { complianceStatus: '', vaccinesDue: '', vaccinesOverdue: '', catchUpPlanRequired: '', catchUpPlanDetails: '', nextVaccinationDate: '', nextVaccinationType: '', occupationalHealthClearance: '', occupationalHealthClearanceDate: '', exposureRiskLevel: '', activeExposureIncident: '', activeExposureDetails: '', consentForVaccination: '', consentDate: '', notes: '' }
	};
}

/** A fully immunised, low-risk patient. */
function fullyImmunised(): AssessmentData {
	const d = blank();
	d.demographics.lastName = 'Test';
	d.demographics.dateOfBirth = '1985-01-01';
	d.childhoodImmunisations.mmrDose1 = 'yes';
	d.childhoodImmunisations.mmrDose2 = 'yes';
	d.childhoodImmunisations.dtpPrimaryCourse = 'yes';
	d.childhoodImmunisations.dtpBooster = 'yes';
	d.childhoodImmunisations.polioPrimaryCourse = 'yes';
	d.childhoodImmunisations.polioBooster = 'yes';
	d.covid19Vaccination.covidPrimaryCourse = 'yes';
	d.covid19Vaccination.covidBooster1 = 'yes';
	d.influenzaVaccination.fluVaccineCurrentSeason = 'yes';
	return d;
}

describe('calculateVaccinationGrade', () => {
	it('classifies a complete schedule as fully immunised, low risk', () => {
		const r = calculateVaccinationGrade(fullyImmunised());
		expect(r.complianceStatus).toBe('fully-immunised');
		expect(r.overallRisk).toBe('low');
		expect(r.childhoodComplete).toBe(true);
		expect(r.covidComplete).toBe(true);
		expect(r.fluCurrent).toBe(true);
		expect(r.firedRules.length).toBe(0);
	});

	it('flags childhood gaps as partially immunised', () => {
		const d = fullyImmunised();
		d.childhoodImmunisations.mmrDose1 = 'no';
		const r = calculateVaccinationGrade(d);
		expect(r.childhoodComplete).toBe(false);
		expect(r.complianceStatus).toBe('partially-immunised');
		expect(r.firedRules.some((x) => x.id === 'CH-001')).toBe(true);
	});

	it('marks a healthcare worker with no COVID primary course as non-compliant, critical risk', () => {
		const d = fullyImmunised();
		d.demographics.occupationCategory = 'healthcare';
		d.occupationalVaccines.hepatitisBCourse = 'yes';
		d.occupationalVaccines.hepatitisBAntiBodyLevel = 'adequate';
		d.occupationalVaccines.varicellaHistory = 'yes';
		d.covid19Vaccination.covidPrimaryCourse = 'no';
		const r = calculateVaccinationGrade(d);
		expect(r.firedRules.some((x) => x.id === 'COV-002' && x.grade === 4)).toBe(true);
		expect(r.complianceStatus).toBe('non-compliant');
		// A grade-4 rule escalates the overall risk to critical.
		expect(r.overallRisk).toBe('critical');
	});

	it('classifies a non-healthcare flu gap as partially immunised, moderate risk', () => {
		const d = fullyImmunised();
		d.influenzaVaccination.fluVaccineCurrentSeason = 'no';
		const r = calculateVaccinationGrade(d);
		expect(r.firedRules.some((x) => x.id === 'FLU-001' && x.grade === 2)).toBe(true);
		expect(r.complianceStatus).toBe('partially-immunised');
		expect(r.overallRisk).toBe('moderate');
	});

	it('treats live-vaccine contraindication as contraindicated', () => {
		const d = fullyImmunised();
		d.contraindicationsAllergies.liveVaccineContraindicated = 'yes';
		const r = calculateVaccinationGrade(d);
		expect(r.complianceStatus).toBe('contraindicated');
	});

	it('escalates an active exposure incident to critical risk', () => {
		const d = fullyImmunised();
		d.scheduleCompliance.activeExposureIncident = 'yes';
		const r = calculateVaccinationGrade(d);
		expect(r.overallRisk).toBe('critical');
	});
});

describe('detectAdditionalFlags', () => {
	it('raises a high-priority flag for vaccine anaphylaxis history', () => {
		const d = fullyImmunised();
		d.vaccinationHistory.adverseReactionSeverity = 'anaphylaxis';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-ANAPH-001' && f.priority === 'high')).toBe(true);
	});

	it('returns no flags for a clean record', () => {
		expect(detectAdditionalFlags(fullyImmunised()).length).toBe(0);
	});
});

describe('vaccinationRules', () => {
	it('every rule has a 1-4 grade and an evaluator', () => {
		for (const rule of vaccinationRules) {
			expect(rule.grade).toBeGreaterThanOrEqual(1);
			expect(rule.grade).toBeLessThanOrEqual(4);
			expect(typeof rule.evaluate).toBe('function');
		}
	});
});
