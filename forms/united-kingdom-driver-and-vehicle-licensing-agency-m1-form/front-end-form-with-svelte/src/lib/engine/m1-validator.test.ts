import { describe, expect, it } from 'vitest';
import { countConditions, validateM1 } from './m1-validator';
import { detectAdditionalFlags } from './flagged-issues';
import { m1Rules } from './m1-rules';
import type { AssessmentData } from './types';

function emptyForm(): AssessmentData {
	return {
		personalDetails: {
			title: '',
			fullName: '',
			dateOfBirth: '',
			address: '',
			postcode: '',
			email: '',
			contactNumber: '',
			changeOfDetails: ''
		},
		healthcareProfessionals: {
			gp: {
				gpName: '',
				surgeryName: '',
				address: '',
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
				address: '',
				town: '',
				postcode: '',
				contactNumber: '',
				email: '',
				dateLastSeen: ''
			}
		},
		diagnosisConfirmation: { hasMentalHealthDiagnosis: '' },
		mentalHealthConditions: {
			anxietyDepressionWithoutImpairment: '',
			anxietyDepressionWithImpairment: '',
			bipolarAffectiveDisorder: '',
			eatingDisorder: '',
			ocdOrPtsd: '',
			personalityDisorder: '',
			schizophreniaOrPsychosis: '',
			other: '',
			otherDetails: ''
		},
		recentContact: {
			hadRecentContact: '',
			doctorLastDate: '',
			consultantLastDate: '',
			communityPsychiatricNurseLastDate: ''
		},
		authorisation: {
			declarationConfirmed: '',
			signatoryName: '',
			signatureText: '',
			signatureDate: '',
			electronicCorrespondenceConsent: '',
			dvlaContactPreference: '',
			healthcareProfessionalContactPreference: ''
		}
	};
}

function fullyAnsweredYesBranch(): AssessmentData {
	const d = emptyForm();
	d.personalDetails = {
		title: 'Mr',
		fullName: 'Alex Driver',
		dateOfBirth: '1985-04-12',
		address: '10 Example Road\nLondon',
		postcode: 'SW1A 1AA',
		email: 'alex@example.com',
		contactNumber: '07700 900000',
		changeOfDetails: ''
	};
	d.healthcareProfessionals.gp = {
		gpName: 'Dr Smith',
		surgeryName: 'Riverside Surgery',
		address: '1 Surgery Lane',
		town: 'London',
		postcode: 'SW1A 2AA',
		contactNumber: '020 1234 5678',
		email: 'gp@example.com',
		dateLastSeen: '2025-09-01'
	};
	d.diagnosisConfirmation.hasMentalHealthDiagnosis = 'yes';
	d.mentalHealthConditions.anxietyDepressionWithoutImpairment = 'yes';
	d.recentContact.hadRecentContact = 'yes';
	d.recentContact.doctorLastDate = '2025-09-01';
	d.authorisation.declarationConfirmed = 'yes';
	d.authorisation.signatoryName = 'Alex Driver';
	d.authorisation.signatureDate = '2026-01-01';
	return d;
}

describe('M1 Rule Set', () => {
	it('all rule IDs are unique', () => {
		const ids = m1Rules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('every rule has a non-empty message and description', () => {
		for (const r of m1Rules) {
			expect(r.message.length).toBeGreaterThan(0);
			expect(r.description.length).toBeGreaterThan(0);
		}
	});
});

describe('countConditions', () => {
	it('returns 0 for an empty form', () => {
		expect(countConditions(emptyForm())).toBe(0);
	});

	it('counts each yes flag exactly once', () => {
		const d = emptyForm();
		d.mentalHealthConditions.anxietyDepressionWithoutImpairment = 'yes';
		d.mentalHealthConditions.bipolarAffectiveDisorder = 'yes';
		d.mentalHealthConditions.other = 'yes';
		expect(countConditions(d)).toBe(3);
	});

	it('returns 8 when every condition is yes', () => {
		const d = emptyForm();
		d.mentalHealthConditions = {
			anxietyDepressionWithoutImpairment: 'yes',
			anxietyDepressionWithImpairment: 'yes',
			bipolarAffectiveDisorder: 'yes',
			eatingDisorder: 'yes',
			ocdOrPtsd: 'yes',
			personalityDisorder: 'yes',
			schizophreniaOrPsychosis: 'yes',
			other: 'yes',
			otherDetails: 'foo'
		};
		expect(countConditions(d)).toBe(8);
	});
});

describe('validateM1 — completeness', () => {
	it('flags missing personal details on an empty form', () => {
		const r = validateM1(emptyForm());
		expect(r.complete).toBe(false);
		const ids = r.firedRules.map((f) => f.id);
		expect(ids).toContain('M1-PD-001');
		expect(ids).toContain('M1-PD-002');
		expect(ids).toContain('M1-PD-003');
		expect(ids).toContain('M1-PD-004');
	});

	it('flags Q1 unanswered', () => {
		const r = validateM1(emptyForm());
		expect(r.firedRules.map((f) => f.id)).toContain('M1-Q1-001');
	});

	it('passes completeness for a fully answered Yes-branch form', () => {
		const r = validateM1(fullyAnsweredYesBranch());
		expect(r.complete).toBe(true);
		const completenessFires = r.firedRules.filter((f) => f.category === 'completeness');
		expect(completenessFires).toHaveLength(0);
	});
});

describe('validateM1 — Q1 = No branch', () => {
	it('marks stoppedAtQ1 = true when Q1 = No', () => {
		const d = emptyForm();
		d.personalDetails = {
			title: 'Ms',
			fullName: 'No Diagnosis',
			dateOfBirth: '1990-01-01',
			address: '1 Road',
			postcode: 'AB1 2CD',
			email: '',
			contactNumber: '07700 900000',
			changeOfDetails: ''
		};
		d.diagnosisConfirmation.hasMentalHealthDiagnosis = 'no';
		d.authorisation.declarationConfirmed = 'yes';
		d.authorisation.signatoryName = 'No Diagnosis';
		d.authorisation.signatureDate = '2026-01-01';
		const r = validateM1(d);
		expect(r.stoppedAtQ1).toBe(true);
		// Q2 + Q3 rules must be skipped entirely.
		expect(r.firedRules.some((f) => f.id.startsWith('M1-Q2'))).toBe(false);
		expect(r.firedRules.some((f) => f.id.startsWith('M1-Q3'))).toBe(false);
		expect(r.complete).toBe(true);
	});
});

describe('validateM1 — Q2 consistency', () => {
	it('flags Q2 with no condition selected when Q1 = Yes', () => {
		const d = fullyAnsweredYesBranch();
		d.mentalHealthConditions.anxietyDepressionWithoutImpairment = '';
		const r = validateM1(d);
		expect(r.firedRules.map((f) => f.id)).toContain('M1-Q2-001');
	});

	it('flags Q2 "Other" without otherDetails', () => {
		const d = fullyAnsweredYesBranch();
		d.mentalHealthConditions.other = 'yes';
		d.mentalHealthConditions.otherDetails = '';
		const r = validateM1(d);
		expect(r.firedRules.map((f) => f.id)).toContain('M1-Q2-002');
	});

	it('does not flag Q2 "Other" when details are supplied', () => {
		const d = fullyAnsweredYesBranch();
		d.mentalHealthConditions.other = 'yes';
		d.mentalHealthConditions.otherDetails = 'Adjustment disorder';
		const r = validateM1(d);
		expect(r.firedRules.map((f) => f.id)).not.toContain('M1-Q2-002');
	});
});

describe('validateM1 — Q3 consistency', () => {
	it('flags Q3 = Yes with no contact dates', () => {
		const d = fullyAnsweredYesBranch();
		d.recentContact.hadRecentContact = 'yes';
		d.recentContact.doctorLastDate = '';
		d.recentContact.consultantLastDate = '';
		d.recentContact.communityPsychiatricNurseLastDate = '';
		const r = validateM1(d);
		expect(r.firedRules.map((f) => f.id)).toContain('M1-Q3-002');
	});

	it('does not flag Q3 = Yes when at least one date is supplied', () => {
		const d = fullyAnsweredYesBranch();
		d.recentContact.hadRecentContact = 'yes';
		d.recentContact.doctorLastDate = '';
		d.recentContact.consultantLastDate = '2025-08-01';
		const r = validateM1(d);
		expect(r.firedRules.map((f) => f.id)).not.toContain('M1-Q3-002');
	});
});

describe('Flag Detection', () => {
	it('returns no urgent flag for a low-risk Yes-branch form', () => {
		const d = fullyAnsweredYesBranch();
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.priority === 'urgent')).toBe(false);
	});

	it('escalates suicidal-thoughts variant to URGENT', () => {
		const d = fullyAnsweredYesBranch();
		d.mentalHealthConditions.anxietyDepressionWithImpairment = 'yes';
		const flags = detectAdditionalFlags(d);
		const urgent = flags.find((f) => f.id === 'FLAG-MH-URGENT-001');
		expect(urgent).toBeDefined();
		expect(urgent?.priority).toBe('urgent');
		expect(flags[0].priority).toBe('urgent');
	});

	it('flags schizophrenia/psychosis as HIGH', () => {
		const d = fullyAnsweredYesBranch();
		d.mentalHealthConditions.schizophreniaOrPsychosis = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-MH-HIGH-001')).toBe(true);
	});

	it('flags bipolar + personality combination as HIGH', () => {
		const d = fullyAnsweredYesBranch();
		d.mentalHealthConditions.bipolarAffectiveDisorder = 'yes';
		d.mentalHealthConditions.personalityDisorder = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-MH-HIGH-002')).toBe(true);
	});

	it('flags 3+ co-occurring conditions', () => {
		const d = fullyAnsweredYesBranch();
		d.mentalHealthConditions.anxietyDepressionWithoutImpairment = 'yes';
		d.mentalHealthConditions.bipolarAffectiveDisorder = 'yes';
		d.mentalHealthConditions.ocdOrPtsd = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-MULTI-MED-001')).toBe(true);
	});

	it('emits a low-priority informational flag when Q1 = No', () => {
		const d = emptyForm();
		d.diagnosisConfirmation.hasMentalHealthDiagnosis = 'no';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-NO-DIAGNOSIS-LOW-001')).toBe(true);
	});

	it('sorts flags by priority (urgent < high < medium < low)', () => {
		const d = fullyAnsweredYesBranch();
		d.mentalHealthConditions.anxietyDepressionWithImpairment = 'yes';
		d.mentalHealthConditions.schizophreniaOrPsychosis = 'yes';
		d.mentalHealthConditions.bipolarAffectiveDisorder = 'yes';
		d.recentContact.hadRecentContact = 'no';
		const flags = detectAdditionalFlags(d);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
