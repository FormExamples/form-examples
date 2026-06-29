import { describe, it, expect } from 'vitest';
import { validateDischarge, gradeDischarge } from './discharge-validator';
import { detectAdditionalFlags } from './flagged-issues';
import { validationRules } from './validation-rules';
import type { AssessmentData } from './types';

/**
 * A fresh, fully-blank assessment. Defined locally (rather than imported from
 * the runes-based store) so the engine tests run under plain Vitest without the
 * Svelte compiler or `$app` aliases.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		patientDetails: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			nhsNumber: '',
			hospitalNumber: '',
			address: '',
			postcode: '',
			phone: '',
			gpName: '',
			gpPractice: '',
			nextOfKinName: '',
			nextOfKinPhone: ''
		},
		admissionSummary: {
			admissionDate: '',
			dischargeDate: '',
			ward: '',
			consultant: '',
			specialty: '',
			reasonForAdmission: '',
			presentingComplaint: '',
			clinicalNarrative: ''
		},
		diagnoses: { diagnoses: [] },
		proceduresPerformed: { procedures: [], noProceduresPerformed: '' },
		dischargeMedications: {
			medications: [],
			reconciliationCompleted: '',
			reconciliationNotes: '',
			allergiesReviewed: '',
			allergyNotes: ''
		},
		followupArrangements: {
			appointments: [],
			gpFollowupRequired: '',
			gpFollowupTimeframe: '',
			outpatientFollowupRequired: '',
			investigationsPending: '',
			pendingInvestigationDetails: '',
			resultsToBeChasedByGp: ''
		},
		communityCareInstructions: {
			dischargeDestination: '',
			otherDestinationDetails: '',
			careResponsibility: '',
			transportMode: '',
			districtNurseReferral: '',
			socialServicesReferral: '',
			physiotherapyReferral: '',
			occupationalTherapyReferral: '',
			packageOfCareInPlace: '',
			mobilityStatus: '',
			dietaryRequirements: '',
			woundCareInstructions: '',
			equipmentProvided: ''
		},
		warningSigns: {
			redFlagSymptoms: [],
			whenToSeekHelp: '',
			emergencyContactNumber: '',
			safetyNetingProvided: '',
			writtenInfoGiven: ''
		},
		clinicianSignoff: {
			clinicianName: '',
			clinicianRole: '',
			gmcNumber: '',
			signoffDate: '',
			bleepOrContact: '',
			responsibleConsultantInformed: '',
			additionalNotes: ''
		},
		patientAcknowledgement: {
			patientUnderstandsPlan: '',
			carerInformed: '',
			carerName: '',
			medicationsExplained: '',
			writtenSummaryProvided: '',
			questionsAnswered: '',
			acknowledgementDate: '',
			signedBy: ''
		}
	};
}

/** A fully-complete NICE NG27 discharge summary (every rule satisfied). */
function createCompleteDischarge(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDetails = {
		...d.patientDetails,
		firstName: 'Jane',
		lastName: 'Smith',
		dateOfBirth: '1950-04-12',
		sex: 'female',
		nhsNumber: '943 476 5919',
		address: '1 High Street, Anytown',
		postcode: 'AB1 2CD',
		gpName: 'Dr Patel',
		gpPractice: 'Riverside Surgery',
		nextOfKinName: 'John Smith',
		nextOfKinPhone: '07700 900000'
	};
	d.admissionSummary = {
		...d.admissionSummary,
		admissionDate: '2026-06-01',
		dischargeDate: '2026-06-05',
		consultant: 'Dr Okoro',
		reasonForAdmission: 'Community-acquired pneumonia',
		clinicalNarrative: 'Treated with IV antibiotics, good response.'
	};
	d.diagnoses.diagnoses = [
		{ description: 'Community-acquired pneumonia', icd10: 'J18.9', type: 'primary' }
	];
	d.proceduresPerformed.noProceduresPerformed = 'yes';
	d.dischargeMedications = {
		...d.dischargeMedications,
		medications: [
			{
				name: 'Amoxicillin',
				dose: '500 mg',
				route: 'PO',
				frequency: 'TDS',
				duration: '5 days',
				status: 'new',
				indication: 'Pneumonia'
			}
		],
		reconciliationCompleted: 'yes',
		allergiesReviewed: 'yes'
	};
	d.followupArrangements = {
		...d.followupArrangements,
		appointments: [
			{ provider: 'Respiratory clinic', date: '2026-07-01', location: 'Outpatients', purpose: 'Review' }
		],
		gpFollowupRequired: 'yes',
		gpFollowupTimeframe: 'Within 7 days',
		outpatientFollowupRequired: 'yes'
	};
	d.communityCareInstructions = {
		...d.communityCareInstructions,
		dischargeDestination: 'home',
		careResponsibility: 'self'
	};
	d.warningSigns = {
		...d.warningSigns,
		whenToSeekHelp: 'If breathing worsens, call 111.',
		safetyNetingProvided: 'yes',
		writtenInfoGiven: 'yes'
	};
	d.clinicianSignoff = {
		...d.clinicianSignoff,
		clinicianName: 'Dr Okoro',
		clinicianRole: 'Consultant',
		signoffDate: '2026-06-05',
		responsibleConsultantInformed: 'yes'
	};
	d.patientAcknowledgement = {
		...d.patientAcknowledgement,
		patientUnderstandsPlan: 'yes',
		medicationsExplained: 'yes',
		writtenSummaryProvided: 'yes',
		questionsAnswered: 'yes'
	};
	return d;
}

describe('Discharge Completeness Validator', () => {
	it('classifies a fully-filled summary as complete with no missing mandatory rules', () => {
		const data = createCompleteDischarge();
		const result = validateDischarge(data);
		expect(result.completenessLevel).toBe('complete');
		expect(result.mandatorySatisfied).toBe(result.mandatoryTotal);
		expect(result.optionalSatisfied).toBe(result.optionalTotal);
	});

	it('downgrades to partial when only optional fields are missing', () => {
		const data = createCompleteDischarge();
		data.patientDetails.address = '';
		data.patientDetails.postcode = '';
		data.admissionSummary.clinicalNarrative = '';
		const result = validateDischarge(data);
		expect(result.completenessLevel).toBe('partial');
		expect(result.mandatorySatisfied).toBe(result.mandatoryTotal);
		expect(result.optionalSatisfied).toBeLessThan(result.optionalTotal);
	});

	it('classifies an empty summary as incomplete', () => {
		const data = createDefaultAssessment();
		const result = validateDischarge(data);
		expect(result.completenessLevel).toBe('incomplete');
		expect(result.mandatorySatisfied).toBe(0);
	});

	it('classifies as incomplete when a single mandatory rule is unsatisfied', () => {
		const data = createCompleteDischarge();
		data.dischargeMedications.reconciliationCompleted = '';
		const result = validateDischarge(data);
		expect(result.completenessLevel).toBe('incomplete');
	});

	it('has unique rule ids', () => {
		const ids = validationRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('gradeDischarge returns flags and a timestamp', () => {
		const data = createCompleteDischarge();
		const result = gradeDischarge(data);
		expect(result.completenessLevel).toBe('complete');
		expect(Array.isArray(result.additionalFlags)).toBe(true);
		expect(typeof result.timestamp).toBe('string');
	});
});

describe('Discharge Flagged Issues Detection', () => {
	it('returns no flags for a complete, safe discharge', () => {
		const data = createCompleteDischarge();
		const flags = detectAdditionalFlags(data);
		expect(flags).toHaveLength(0);
	});

	it('flags missing medication reconciliation as urgent', () => {
		const data = createCompleteDischarge();
		data.dischargeMedications.reconciliationCompleted = 'no';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-MEDS-001' && f.priority === 'urgent')).toBe(true);
	});

	it('flags a discharge date before the admission date', () => {
		const data = createCompleteDischarge();
		data.admissionSummary.admissionDate = '2026-06-10';
		data.admissionSummary.dischargeDate = '2026-06-05';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-DATE-001')).toBe(true);
	});

	it('flags pending investigations without a chase plan', () => {
		const data = createCompleteDischarge();
		data.followupArrangements.investigationsPending = 'yes';
		data.followupArrangements.resultsToBeChasedByGp = 'no';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-FU-001')).toBe(true);
	});

	it('sorts flags by priority (urgent first)', () => {
		const data = createCompleteDischarge();
		data.dischargeMedications.reconciliationCompleted = 'no'; // urgent
		data.warningSigns.writtenInfoGiven = 'no'; // low
		const flags = detectAdditionalFlags(data);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 } as const;
		const priorities = flags.map((f) => order[f.priority]);
		const sorted = [...priorities].sort((a, b) => a - b);
		expect(priorities).toEqual(sorted);
	});
});
