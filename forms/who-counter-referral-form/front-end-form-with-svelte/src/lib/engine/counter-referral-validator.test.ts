import { describe, expect, it } from 'vitest';
import { counterReferralRules } from './counter-referral-rules';
import { detectFlaggedIssues } from './flagged-issues';
import { validateCounterReferral } from './counter-referral-validator';
import type { AssessmentData } from './types';

function emptyAssessment(): AssessmentData {
	return {
		patientIdentification: {
			patientName: '',
			dateOfBirth: '',
			sex: '',
			patientContact: '',
			emergencyContact: { name: '', contactInformation: '' }
		},
		facilityDetails: {
			initiatingFacility: { name: '', focalPoint: '', phoneNumber: '' },
			referralDate: '',
			referralReason: '',
			acuity: '',
			referralFacility: { name: '', focalPoint: '', phoneNumber: '' },
			communication: {
				discussedWithPrimaryCareProvider: false,
				discussedWithInitiatingFacility: false
			},
			primaryCareFacility: { name: '', focalPoint: '', phoneNumber: '' },
			followUpTimeframe: ''
		},
		situation: {
			chiefComplaint: '',
			primaryDiagnosis: '',
			pregnant: '',
			treatmentsInitiated: '',
			icuStay: false,
			surgery: false,
			hospitalized: false
		},
		background: {
			historyOfPresentIllness: '',
			pastMedicalHistory: '',
			significantEvents: ''
		},
		assessment: {
			finalDiagnoses: '',
			prognosisAndGoalsOfCare: '',
			patientFamilyInformed: '',
			informedExplanation: ''
		},
		recommendations: {
			followUpPlan: '',
			pendingInvestigations: '',
			followUpArrangements: '',
			deteriorationInstructions: '',
			contactName: '',
			contactInformation: '',
			statusFlags: {
				cognitiveImpairment: false,
				carerDependent: false,
				spinalPrecautions: false,
				weightBearingRestrictions: false,
				palliativeCare: false
			}
		},
		providerSignOff: {
			providerName: '',
			signature: '',
			signatureDate: ''
		}
	};
}

/**
 * Build a minimal-but-complete counter-referral with every required field
 * answered with a sensible benign default. The Yes-branch of "patient/family
 * informed" is intentionally avoided so the conditional explanation rule does
 * not fire.
 */
function minimalCompleteAssessment(): AssessmentData {
	const d = emptyAssessment();

	d.patientIdentification.patientName = 'DOE, Jane';
	d.patientIdentification.dateOfBirth = '1985-06-15';
	d.patientIdentification.sex = 'female';
	d.patientIdentification.patientContact = '+1-555-1000';
	d.patientIdentification.emergencyContact.name = 'John Doe';
	d.patientIdentification.emergencyContact.contactInformation = '+1-555-1001 (spouse)';

	d.facilityDetails.initiatingFacility.name = 'District Hospital A';
	d.facilityDetails.initiatingFacility.focalPoint = 'Dr. Smith';
	d.facilityDetails.initiatingFacility.phoneNumber = '+1-555-0100';
	d.facilityDetails.referralDate = '2025-01-10';
	d.facilityDetails.referralReason = 'Higher level of care for suspected appendicitis';
	d.facilityDetails.acuity = 'acute';
	d.facilityDetails.referralFacility.name = 'Regional Hospital B';
	d.facilityDetails.referralFacility.focalPoint = 'Dr. Jones';
	d.facilityDetails.referralFacility.phoneNumber = '+1-555-0200';
	d.facilityDetails.communication.discussedWithPrimaryCareProvider = true;
	d.facilityDetails.followUpTimeframe = '2-to-6-days';

	d.situation.chiefComplaint = 'Severe right lower quadrant abdominal pain.';
	d.situation.primaryDiagnosis = 'Acute appendicitis (post-appendectomy).';
	d.situation.pregnant = 'no';
	d.situation.treatmentsInitiated =
		'IV antibiotics, IV fluids, laparoscopic appendectomy.';

	d.background.historyOfPresentIllness =
		'12-hour history of right lower quadrant pain with low-grade fever; admitted for surgery.';
	d.background.pastMedicalHistory = 'No significant past medical history.';

	d.assessment.finalDiagnoses = 'Acute uncomplicated appendicitis, treated surgically.';
	d.assessment.prognosisAndGoalsOfCare =
		'Excellent prognosis. Goal: routine post-operative recovery in primary care.';
	d.assessment.patientFamilyInformed = 'yes';
	d.assessment.informedExplanation =
		'Discussed with patient and spouse during ward round on 2025-01-14.';

	d.recommendations.followUpPlan =
		'Wound check at 7 days; remove sutures at 10–14 days; review pathology.';
	d.recommendations.followUpArrangements =
		'Appointment booked at primary care facility on 2025-01-17 with Dr. Patel.';
	d.recommendations.deteriorationInstructions =
		'Return immediately to emergency department if fever > 38.5°C, worsening pain, vomiting, or wound discharge.';
	d.recommendations.contactName = 'Dr. Jones';
	d.recommendations.contactInformation = '+1-555-0200 ext. 4123';

	d.providerSignOff.providerName = 'Dr. Jones';
	d.providerSignOff.signature = 'A. Jones';
	d.providerSignOff.signatureDate = '2025-01-15';

	return d;
}

describe('Counter-Referral Rule Set', () => {
	it('has a non-empty rule set', () => {
		expect(counterReferralRules.length).toBeGreaterThan(0);
	});

	it('all rule IDs are unique', () => {
		const ids = counterReferralRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('every rule references a known section', () => {
		const validSections = new Set([
			'patientIdentification',
			'facilityDetails',
			'situation',
			'background',
			'assessment',
			'recommendations',
			'providerSignOff'
		]);
		for (const r of counterReferralRules) {
			expect(validSections.has(r.section)).toBe(true);
		}
	});
});

describe('Counter-Referral Validator', () => {
	it('marks an empty assessment as incomplete', () => {
		const result = validateCounterReferral(emptyAssessment());
		expect(result.complete).toBe(false);
		expect(result.totalSatisfied).toBe(0);
		expect(result.missing.length).toBe(result.totalRequired);
	});

	it('marks a minimal-but-complete submission as complete', () => {
		const result = validateCounterReferral(minimalCompleteAssessment());
		expect(result.complete).toBe(true);
		expect(result.missing).toHaveLength(0);
		expect(result.totalSatisfied).toBe(result.totalRequired);
	});

	it('Patient/family informed = Yes: requires explanation', () => {
		const d = minimalCompleteAssessment();
		d.assessment.patientFamilyInformed = 'yes';
		d.assessment.informedExplanation = '';
		const result = validateCounterReferral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('ASS-04');
	});

	it('Patient/family informed = Yes with explanation: passes', () => {
		const d = minimalCompleteAssessment();
		d.assessment.patientFamilyInformed = 'yes';
		d.assessment.informedExplanation =
			'Discussed with patient and spouse during ward round on 2025-01-14.';
		const result = validateCounterReferral(d);
		expect(result.complete).toBe(true);
	});

	it('Communication: requires at least one channel ticked', () => {
		const d = minimalCompleteAssessment();
		d.facilityDetails.communication.discussedWithPrimaryCareProvider = false;
		d.facilityDetails.communication.discussedWithInitiatingFacility = false;
		const result = validateCounterReferral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('FAC-10');
	});

	it('Communication: passes when initiating facility channel is ticked', () => {
		const d = minimalCompleteAssessment();
		d.facilityDetails.communication.discussedWithPrimaryCareProvider = false;
		d.facilityDetails.communication.discussedWithInitiatingFacility = true;
		const result = validateCounterReferral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('FAC-10');
	});

	it('Follow-up timeframe is required', () => {
		const d = minimalCompleteAssessment();
		d.facilityDetails.followUpTimeframe = '';
		const result = validateCounterReferral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('FAC-11');
	});

	it('groups missing items by section', () => {
		const result = validateCounterReferral(emptyAssessment());
		const sectionKeys = new Set(result.sections.map((s) => s.section));
		expect(sectionKeys.has('patientIdentification')).toBe(true);
		expect(sectionKeys.has('providerSignOff')).toBe(true);
		// Each section's "missing" array length must equal required - satisfied
		for (const s of result.sections) {
			expect(s.missing.length).toBe(s.required - s.satisfied);
		}
	});
});

describe('Flagged Issues', () => {
	it('returns no flags for a benign minimal-complete counter-referral', () => {
		const flags = detectFlaggedIssues(minimalCompleteAssessment());
		expect(flags).toHaveLength(0);
	});

	it('flags urgent follow-up timeframe as urgent', () => {
		const d = minimalCompleteAssessment();
		d.facilityDetails.followUpTimeframe = 'urgent-within-24-hours';
		const flags = detectFlaggedIssues(d);
		const fired = flags.find((f) => f.id === 'FLAG-FU-001');
		expect(fired).toBeDefined();
		expect(fired?.priority).toBe('urgent');
	});

	it('flags missing deterioration instructions as urgent', () => {
		const d = minimalCompleteAssessment();
		d.recommendations.deteriorationInstructions = '';
		const flags = detectFlaggedIssues(d);
		const fired = flags.find((f) => f.id === 'FLAG-DET-001');
		expect(fired).toBeDefined();
		expect(fired?.priority).toBe('urgent');
	});

	it('flags communication breakdown as high', () => {
		const d = minimalCompleteAssessment();
		d.facilityDetails.communication.discussedWithPrimaryCareProvider = false;
		d.facilityDetails.communication.discussedWithInitiatingFacility = false;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-COM-001' && f.priority === 'high')).toBe(
			true
		);
	});

	it('flags palliative care as high', () => {
		const d = minimalCompleteAssessment();
		d.recommendations.statusFlags.palliativeCare = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-PAL-001' && f.priority === 'high')).toBe(
			true
		);
	});

	it('flags patient/family not informed as high', () => {
		const d = minimalCompleteAssessment();
		d.assessment.patientFamilyInformed = 'no';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-INF-001' && f.priority === 'high')).toBe(
			true
		);
	});

	it('flags ICU stay as medium', () => {
		const d = minimalCompleteAssessment();
		d.situation.icuStay = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-ICU-001' && f.priority === 'medium')).toBe(
			true
		);
	});

	it('flags surgery as medium', () => {
		const d = minimalCompleteAssessment();
		d.situation.surgery = true;
		const flags = detectFlaggedIssues(d);
		expect(
			flags.some((f) => f.id === 'FLAG-SURG-001' && f.priority === 'medium')
		).toBe(true);
	});

	it('flags pregnancy as medium', () => {
		const d = minimalCompleteAssessment();
		d.situation.pregnant = 'yes';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-PREG-001' && f.priority === 'medium')).toBe(
			true
		);
	});

	it('flags cognitive impairment as medium', () => {
		const d = minimalCompleteAssessment();
		d.recommendations.statusFlags.cognitiveImpairment = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-COG-001' && f.priority === 'medium')).toBe(
			true
		);
	});

	it('flags carer-dependent as medium', () => {
		const d = minimalCompleteAssessment();
		d.recommendations.statusFlags.carerDependent = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-CAR-001' && f.priority === 'medium')).toBe(
			true
		);
	});

	it('flags spinal precautions as medium', () => {
		const d = minimalCompleteAssessment();
		d.recommendations.statusFlags.spinalPrecautions = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-SPN-001' && f.priority === 'medium')).toBe(
			true
		);
	});

	it('flags weight-bearing restrictions as medium', () => {
		const d = minimalCompleteAssessment();
		d.recommendations.statusFlags.weightBearingRestrictions = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-WB-001' && f.priority === 'medium')).toBe(
			true
		);
	});

	it('flags pending investigations as low', () => {
		const d = minimalCompleteAssessment();
		d.recommendations.pendingInvestigations = 'Histopathology of appendix specimen.';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-INV-001' && f.priority === 'low')).toBe(
			true
		);
	});

	it('flags hospitalisation alone as low', () => {
		const d = minimalCompleteAssessment();
		d.situation.hospitalized = true;
		d.situation.icuStay = false;
		d.situation.surgery = false;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-HOSP-001' && f.priority === 'low')).toBe(
			true
		);
	});

	it('does not flag hospitalisation when ICU stay also recorded', () => {
		const d = minimalCompleteAssessment();
		d.situation.hospitalized = true;
		d.situation.icuStay = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-HOSP-001')).toBe(false);
	});

	it('sorts flags by priority (urgent > high > medium > low)', () => {
		const d = minimalCompleteAssessment();
		d.facilityDetails.followUpTimeframe = 'urgent-within-24-hours';
		d.assessment.patientFamilyInformed = 'no';
		d.situation.icuStay = true;
		d.recommendations.pendingInvestigations = 'Lab pending';
		const flags = detectFlaggedIssues(d);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
