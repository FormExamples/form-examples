import { describe, it, expect } from 'vitest';
import { calculateIPSGrade } from './ips-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { ipsRules } from './ips-rules';
import type { AssessmentData } from './types';

/** A blank IPS with all fields at their unanswered defaults. Mirrors
 *  `createDefaultAssessment()` in the store, but defined locally so the test
 *  does not import the runes store (which is not transformed under vitest). */
function createBlank(): AssessmentData {
	return {
		patientDemographics: {
			givenName: '',
			familyName: '',
			dateOfBirth: '',
			sex: '',
			nationalIdentifier: '',
			addressLine: '',
			city: '',
			postalCode: '',
			country: '',
			preferredLanguage: '',
			contactPhone: ''
		},
		problemList: [],
		medicationSummary: [],
		allergiesIntolerances: [],
		immunisations: [],
		procedures: [],
		resultsInvestigations: [],
		medicalDevices: [],
		advanceDirectives: { dnrInPlace: '', livingWillInPlace: '', consentToShareEu: '', directiveNotes: '' },
		authoringClinician: {
			clinicianName: '',
			clinicianRole: '',
			organisation: '',
			country: '',
			email: '',
			phone: '',
			signoffDate: '',
			authoringStatus: ''
		}
	};
}

/** A fully-populated IPS: all 8 mandatory + both optional sections present. */
function createCompleteIPS(): AssessmentData {
	const d = createBlank();
	d.patientDemographics = {
		...d.patientDemographics,
		givenName: 'Jane',
		familyName: 'Smith',
		dateOfBirth: '1970-03-02',
		sex: 'female',
		nationalIdentifier: 'NHS-123',
		country: 'GB',
		preferredLanguage: 'en-GB'
	};
	d.problemList = [{ description: 'Type 2 diabetes', icd10Code: 'E11.9', onsetDate: '2015-01-01', status: 'active' }];
	d.medicationSummary = [{ name: 'Metformin', atcCode: 'A10BA02', dose: '500 mg', frequency: 'BD', route: 'PO' }];
	d.allergiesIntolerances = [{ substance: 'Penicillin', reaction: 'Rash', severity: 'mild', criticality: 'low' }];
	d.immunisations = [{ vaccine: 'Influenza', date: '2025-10-01', lotNumber: 'ABC123' }];
	d.procedures = [{ description: 'Appendectomy', date: '2001-05-05', performer: 'City Hospital' }];
	d.resultsInvestigations = [{ testName: 'HbA1c', value: '58', unit: 'mmol/mol', interpretation: 'high', date: '2026-01-01' }];
	d.medicalDevices = [{ description: 'Cardiac pacemaker', udi: 'UDI-001', implantDate: '2020-02-02' }];
	d.advanceDirectives = { dnrInPlace: 'no', livingWillInPlace: 'no', consentToShareEu: 'yes', directiveNotes: '' };
	d.authoringClinician = {
		clinicianName: 'Dr Walker',
		clinicianRole: 'General Practitioner',
		organisation: 'City Practice',
		country: 'GB',
		email: 'walker@example.com',
		phone: '',
		signoffDate: '2026-06-01',
		authoringStatus: 'final'
	};
	return d;
}

describe('IPS Completeness Grading Engine', () => {
	it('grades a fully populated IPS as complete', () => {
		const result = calculateIPSGrade(createCompleteIPS());
		expect(result.completenessLevel).toBe('complete');
		expect(result.mandatoryPopulated).toBe(8);
		expect(result.mandatoryTotal).toBe(8);
		expect(result.optionalPopulated).toBe(2);
		expect(result.optionalTotal).toBe(2);
	});

	it('grades mandatory-only (no optional) as partial', () => {
		const d = createCompleteIPS();
		d.medicalDevices = [];
		d.advanceDirectives = { dnrInPlace: '', livingWillInPlace: '', consentToShareEu: '', directiveNotes: '' };
		const result = calculateIPSGrade(d);
		expect(result.completenessLevel).toBe('partial');
		expect(result.mandatoryPopulated).toBe(8);
		expect(result.optionalPopulated).toBe(0);
	});

	it('grades a missing mandatory section as incomplete', () => {
		const d = createCompleteIPS();
		d.problemList = [];
		const result = calculateIPSGrade(d);
		expect(result.completenessLevel).toBe('incomplete');
		expect(result.mandatoryPopulated).toBe(7);
	});

	it('grades a blank IPS as incomplete', () => {
		const result = calculateIPSGrade(createBlank());
		expect(result.completenessLevel).toBe('incomplete');
		expect(result.mandatoryPopulated).toBe(0);
	});

	it('records one fired rule per IPS section', () => {
		const result = calculateIPSGrade(createCompleteIPS());
		expect(result.firedRules).toHaveLength(ipsRules.length);
		expect(result.firedRules.every((r) => r.status === 'ok')).toBe(true);
	});

	it('marks empty optional sections as optional, empty mandatory as empty', () => {
		const result = calculateIPSGrade(createBlank());
		const optional = result.firedRules.filter((r) => !r.mandatory);
		const mandatory = result.firedRules.filter((r) => r.mandatory);
		expect(optional.every((r) => r.status === 'optional')).toBe(true);
		expect(mandatory.every((r) => r.status === 'empty')).toBe(true);
	});

	it('has unique rule ids', () => {
		const ids = ipsRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('IPS Flagged Issues Detection', () => {
	it('raises a device flag but no consent flag for a complete, consented IPS', () => {
		const flags = detectAdditionalFlags(createCompleteIPS());
		expect(flags.some((f) => f.id === 'FLAG-CONSENT-001')).toBe(false);
		expect(flags.some((f) => f.id === 'FLAG-DEVICE-001')).toBe(true);
	});

	it('flags a high-criticality allergy as urgent', () => {
		const d = createCompleteIPS();
		d.allergiesIntolerances = [{ substance: 'Peanut', reaction: 'Anaphylaxis', severity: 'severe', criticality: 'high' }];
		const flags = detectAdditionalFlags(d);
		const flag = flags.find((f) => f.id.startsWith('FLAG-ALLERGY-HIGH-'));
		expect(flag?.priority).toBe('urgent');
	});

	it('flags refused cross-border consent as urgent', () => {
		const d = createCompleteIPS();
		d.advanceDirectives.consentToShareEu = 'no';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-CONSENT-001' && f.priority === 'urgent')).toBe(true);
	});

	it('flags missing patient identification', () => {
		const flags = detectAdditionalFlags(createBlank());
		expect(flags.some((f) => f.id === 'FLAG-PT-001')).toBe(true);
		expect(flags.some((f) => f.id === 'FLAG-PT-002')).toBe(true);
	});

	it('sorts flags by priority (urgent first)', () => {
		const d = createBlank();
		d.advanceDirectives.consentToShareEu = 'no';
		const flags = detectAdditionalFlags(d);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
