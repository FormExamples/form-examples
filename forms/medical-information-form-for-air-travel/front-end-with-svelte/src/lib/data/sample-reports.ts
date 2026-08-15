import type { FitnessBand, MedifAssessment } from '#lib/engine/types.js';
import { evaluateFitnessToFly } from '#lib/engine/composite-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample MEDIF: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	passengerName: string;
	airline: string;
	flight: string;
	outboundDate: string;
	data: MedifAssessment;
}

/** A row in the medical-desk dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	passengerName: string;
	airline: string;
	flight: string;
	outboundDate: string;
	band: FitnessBand;
	flagCount: number;
	highFlagCount: number;
	oxygenFlag: boolean;
	pregnancyFlag: boolean;
}

/** Fit: stable, routine wheelchair assistance only. */
function fitCase(): MedifAssessment {
	const d = createDefaultAssessment();
	d.submitter = { ...d.submitter, submitterName: 'Alice Smith', submitterRole: 'passenger', airlineBookingReference: 'BA-7K2Q9X' };
	d.passenger = { ...d.passenger, firstName: 'Alice', lastName: 'Smith', dateOfBirth: '1965-04-12', sex: 'female', nationality: 'British' };
	d.trip = { ...d.trip, airlineIataCode: 'BA', airlineName: 'British Airways', outboundFlightNumber: 'BA117', outboundDate: '2026-07-04', outboundOriginIata: 'LHR', outboundDestinationIata: 'JFK', cabinClass: 'economy', sectorDurationMinutes: 420 };
	d.physician = { ...d.physician, physicianName: 'Dr R Okafor', specialty: 'General practice', registrationBody: 'GMC', registrationNumber: '7654321', signatureDate: '2026-06-20' };
	d.diagnosis = { ...d.diagnosis, primaryDiagnosis: 'Stable osteoarthritis', diagnosisDate: '2024-01-10' };
	d.inflightNeeds = { ...d.inflightNeeds, wheelchairType: 'WCHR', requiresMedicalEscort: 'no' };
	d.reasons = { ...d.reasons, reasonMobilityEscort: 'yes' };
	return d;
}

/** Fit with conditions: supplemental oxygen at a moderate flow rate. */
function fitWithConditionsCase(): MedifAssessment {
	const d = createDefaultAssessment();
	d.submitter = { ...d.submitter, submitterName: 'Bob Jones', submitterRole: 'agent', submitterOrganisation: 'AccessAir Travel', airlineBookingReference: 'EK-44LMN2' };
	d.passenger = { ...d.passenger, firstName: 'Bob', lastName: 'Jones', dateOfBirth: '1952-09-30', sex: 'male', nationality: 'British' };
	d.trip = { ...d.trip, airlineIataCode: 'EK', airlineName: 'Emirates', outboundFlightNumber: 'EK002', outboundDate: '2026-07-05', outboundOriginIata: 'LGW', outboundDestinationIata: 'DXB', cabinClass: 'business', sectorDurationMinutes: 420 };
	d.physician = { ...d.physician, physicianName: 'Dr H Mensah', specialty: 'Respiratory medicine', registrationBody: 'GMC', registrationNumber: '6543210', signatureDate: '2026-06-21' };
	d.diagnosis = { ...d.diagnosis, primaryDiagnosis: 'COPD, moderate', diagnosisDate: '2022-05-03' };
	d.respiratory = { ...d.respiratory, restingSpo2Percent: 92, copdSeverity: 'moderate', hypoxicChallengeResult: 'borderline' };
	d.inflightNeeds = { ...d.inflightNeeds, requiresSupplementalOxygen: 'yes', oxygenFlowRateLpm: 2, oxygenDuration: 'continuous', requiresPoc: 'yes', pocMakeModel: 'Inogen One G5', pocBatteryHours: 9 };
	d.reasons = { ...d.reasons, reasonEquipment: 'yes' };
	d.cabinMeds = { ...d.cabinMeds, dangerousGoodsBatteryDeclaration: 'yes' };
	return d;
}

/** Requires review: late-term singleton pregnancy and high-flow oxygen. */
function requiresReviewCase(): MedifAssessment {
	const d = createDefaultAssessment();
	d.submitter = { ...d.submitter, submitterName: 'Carol Lee', submitterRole: 'clinician', airlineBookingReference: 'QR-9XQ7TT' };
	d.passenger = { ...d.passenger, firstName: 'Carol', lastName: 'Lee', dateOfBirth: '1994-02-18', sex: 'female', nationality: 'Irish' };
	d.trip = { ...d.trip, airlineIataCode: 'QR', airlineName: 'Qatar Airways', outboundFlightNumber: 'QR010', outboundDate: '2026-07-06', outboundOriginIata: 'DUB', outboundDestinationIata: 'DOH', cabinClass: 'economy', sectorDurationMinutes: 430 };
	d.physician = { ...d.physician, physicianName: 'Dr P Sharma', specialty: 'Obstetrics', registrationBody: 'GMC', registrationNumber: '5432109', signatureDate: '2026-06-22' };
	d.diagnosis = { ...d.diagnosis, primaryDiagnosis: 'Uncomplicated singleton pregnancy', diagnosisDate: '2025-12-01' };
	d.pregnancy = { ...d.pregnancy, isPregnant: 'yes', gestationWeeks: 31, pregnancyType: 'singleton', expectedDeliveryDate: '2026-09-10' };
	d.reasons = { ...d.reasons, reasonPregnancy: 'yes' };
	return d;
}

/** Unfit to fly: recent MI and active infectious communicable disease. */
function unfitCase(): MedifAssessment {
	const d = createDefaultAssessment();
	d.submitter = { ...d.submitter, submitterName: 'David Brown', submitterRole: 'family-member', airlineBookingReference: 'LO-22ABCD' };
	d.passenger = { ...d.passenger, firstName: 'David', lastName: 'Brown', dateOfBirth: '1948-11-03', sex: 'male', nationality: 'Polish' };
	d.trip = { ...d.trip, airlineIataCode: 'LO', airlineName: 'LOT Polish Airlines', outboundFlightNumber: 'LO281', outboundDate: '2026-07-08', outboundOriginIata: 'WAW', outboundDestinationIata: 'ORD', cabinClass: 'economy', sectorDurationMinutes: 600 };
	d.physician = { ...d.physician, physicianName: 'Dr K Nowak', specialty: 'Cardiology', registrationBody: 'other', registrationNumber: 'PL-99221', signatureDate: '2026-06-23' };
	d.diagnosis = { ...d.diagnosis, primaryDiagnosis: 'Acute myocardial infarction', diagnosisDate: '2026-06-19', lastAdmissionDate: '2026-06-19' };
	d.cardiovascular = { ...d.cardiovascular, recentMiDate: '2026-06-19', nyhaClass: 'IV', unstableAngina: 'yes' };
	d.respiratory = { ...d.respiratory, restingSpo2Percent: 84 };
	d.communicable = { ...d.communicable, communicableDiseaseStatus: 'infectious', isolationRequired: 'yes', lastSymptomDate: '2026-06-22' };
	d.cabinMeds = { ...d.cabinMeds, haemoglobinGPerL: 70 };
	d.reasons = { ...d.reasons, reasonRecentAcuteEvent: 'yes', reasonCommunicableDisease: 'yes', reasonUnstableCondition: 'yes' };
	return d;
}

/** The sample MEDIFs, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'MD-2026-0001', passengerName: 'Smith, Alice', airline: 'British Airways', flight: 'BA117', outboundDate: '2026-07-04', data: fitCase() },
	{ id: 'MD-2026-0002', passengerName: 'Jones, Bob', airline: 'Emirates', flight: 'EK002', outboundDate: '2026-07-05', data: fitWithConditionsCase() },
	{ id: 'MD-2026-0003', passengerName: 'Lee, Carol', airline: 'Qatar Airways', flight: 'QR010', outboundDate: '2026-07-06', data: requiresReviewCase() },
	{ id: 'MD-2026-0004', passengerName: 'Brown, David', airline: 'LOT Polish Airlines', flight: 'LO281', outboundDate: '2026-07-08', data: unfitCase() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = evaluateFitnessToFly(s.data);
	return {
		id: s.id,
		passengerName: s.passengerName,
		airline: s.airline,
		flight: s.flight,
		outboundDate: s.outboundDate,
		band: g.fitnessBand,
		flagCount: g.safetyFlags.length,
		highFlagCount: g.safetyFlags.filter((f) => f.priority === 'high').length,
		oxygenFlag: s.data.inflightNeeds.requiresSupplementalOxygen === 'yes',
		pregnancyFlag: s.data.pregnancy.isPregnant === 'yes'
	};
});
