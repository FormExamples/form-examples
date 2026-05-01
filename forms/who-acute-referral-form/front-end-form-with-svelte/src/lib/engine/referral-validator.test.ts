import { describe, expect, it } from 'vitest';
import { referralRules } from './referral-rules';
import { detectFlaggedIssues } from './flagged-issues';
import { validateReferral } from './referral-validator';
import type { AssessmentData } from './types';

function emptyAssessment(): AssessmentData {
	return {
		patientIdentification: {
			patientLastName: '',
			patientFirstName: '',
			dateOfBirth: '',
			sex: '',
			patientContactInformation: '',
			emergencyContact: { name: '', contactInformation: '' }
		},
		facilityAndTransport: {
			initiatingFacility: { name: '', focalPoint: '', phoneNumber: '' },
			reasonForReferral: '',
			referralFacilityContacted: false,
			referralFacility: { name: '', focalPoint: '', phoneNumber: '' },
			ambulance: { name: '', focalPoint: '', phoneNumber: '' },
			transferDecisionDateTime: '',
			departureDateTime: '',
			modeOfTransfer: ''
		},
		situation: {
			chiefComplaint: '',
			primaryDiagnosis: '',
			pregnant: '',
			otherAcuteDiagnoses: '',
			treatmentsInitiated: ''
		},
		background: {
			historyOfPresentIllness: '',
			pastMedicalAndSurgicalHistory: '',
			airway: {
				findingNormal: false,
				findingDetails: '',
				interventionNone: false,
				interventionDetails: ''
			},
			breathing: {
				findingNormal: false,
				findingDetails: '',
				interventionNone: false,
				interventionDetails: ''
			},
			circulation: {
				findingNormal: false,
				findingDetails: '',
				interventionNone: false,
				interventionDetails: ''
			},
			disability: {
				findingNormal: false,
				findingDetails: '',
				interventionNone: false,
				interventionDetails: ''
			},
			exposure: {
				findingNormal: false,
				findingDetails: '',
				interventionNone: false,
				interventionDetails: ''
			},
			otherSignificantTreatments: ''
		},
		assessment: {
			clinicalAssessment: '',
			vitalSigns: {
				heartRate: null,
				respiratoryRate: null,
				systolicBloodPressure: null,
				diastolicBloodPressure: null,
				temperatureCelsius: null,
				oxygenSaturation: null,
				glasgowComaScale: null
			}
		},
		recommendations: {
			treatmentPlanDuringTransport: '',
			potentialWorseningOfCondition: '',
			cautionsRegardingPriorTherapies: '',
			precautions: {
				highlyInfectiousDisease: false,
				spinalPrecautions: false,
				weightBearingRestrictions: false,
				fallRisk: false,
				aspirationRisk: false,
				other: false,
				otherDetails: ''
			}
		},
		initiatingProviderSignoff: {
			providerName: '',
			signature: '',
			signatureDate: ''
		},
		referralFacilityReceipt: {
			patientArrivalDateTime: '',
			receivingProviderName: '',
			receivingProviderSignature: '',
			feedbackProvidedToInitiatingFacility: false
		}
	};
}

/**
 * Build a minimal-but-complete referral for an unremarkable transfer:
 * every required field for the initiating-facility branch is satisfied with
 * the simplest possible answer. The receiving-facility branch is left empty
 * (its rules only fire after arrival is recorded).
 */
function minimalCompleteAssessment(): AssessmentData {
	const d = emptyAssessment();
	d.patientIdentification.patientLastName = 'Doe';
	d.patientIdentification.patientFirstName = 'Jane';
	d.patientIdentification.dateOfBirth = '1985-06-15';
	d.patientIdentification.sex = 'female';

	d.facilityAndTransport.initiatingFacility.name = 'District Hospital A';
	d.facilityAndTransport.initiatingFacility.focalPoint = 'Dr. Smith';
	d.facilityAndTransport.initiatingFacility.phoneNumber = '+1-555-0100';
	d.facilityAndTransport.reasonForReferral = 'Higher level of care required';
	d.facilityAndTransport.referralFacility.name = 'Regional Hospital B';
	d.facilityAndTransport.referralFacility.phoneNumber = '+1-555-0200';
	d.facilityAndTransport.transferDecisionDateTime = '2025-01-10T08:30';
	d.facilityAndTransport.departureDateTime = '2025-01-10T09:15';
	d.facilityAndTransport.modeOfTransfer = 'ground';

	d.situation.chiefComplaint = 'Severe abdominal pain';
	d.situation.primaryDiagnosis = 'Suspected appendicitis';
	d.situation.pregnant = 'no';

	d.background.historyOfPresentIllness =
		'12-hour history of right lower quadrant pain with low-grade fever.';
	d.background.airway.findingNormal = true;
	d.background.airway.interventionNone = true;
	d.background.breathing.findingNormal = true;
	d.background.breathing.interventionNone = true;
	d.background.circulation.findingNormal = true;
	d.background.circulation.interventionNone = true;
	d.background.disability.findingNormal = true;
	d.background.disability.interventionNone = true;
	d.background.exposure.findingNormal = true;
	d.background.exposure.interventionNone = true;

	d.assessment.clinicalAssessment =
		'Patient stable. Surgical evaluation required for definitive management.';

	d.recommendations.treatmentPlanDuringTransport =
		'Continue IV fluids, monitor vital signs every 15 minutes.';

	d.initiatingProviderSignoff.providerName = 'Dr. Smith';
	d.initiatingProviderSignoff.signature = 'A. Smith';
	d.initiatingProviderSignoff.signatureDate = '2025-01-10';

	return d;
}

describe('Referral Rule Set', () => {
	it('has a non-empty rule set', () => {
		expect(referralRules.length).toBeGreaterThan(0);
	});

	it('all rule IDs are unique', () => {
		const ids = referralRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('every rule references a known section', () => {
		const validSections = new Set([
			'patientIdentification',
			'facilityAndTransport',
			'situation',
			'background',
			'assessment',
			'recommendations',
			'initiatingProviderSignoff',
			'referralFacilityReceipt'
		]);
		for (const r of referralRules) {
			expect(validSections.has(r.section)).toBe(true);
		}
	});
});

describe('Referral Validator', () => {
	it('marks an empty assessment as incomplete', () => {
		const result = validateReferral(emptyAssessment());
		expect(result.complete).toBe(false);
		expect(result.totalSatisfied).toBe(0);
		expect(result.missing.length).toBe(result.totalRequired);
	});

	it('marks a minimal-but-complete initiating-facility submission as complete', () => {
		const result = validateReferral(minimalCompleteAssessment());
		expect(result.complete).toBe(true);
		expect(result.missing).toHaveLength(0);
		expect(result.totalSatisfied).toBe(result.totalRequired);
	});

	it('ABCDE: requires either a "Normal" tick or finding text', () => {
		const d = minimalCompleteAssessment();
		d.background.airway.findingNormal = false;
		d.background.airway.findingDetails = '';
		const result = validateReferral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('BG-A');
	});

	it('ABCDE: passes when finding details are filled in instead of "Normal"', () => {
		const d = minimalCompleteAssessment();
		d.background.airway.findingNormal = false;
		d.background.airway.findingDetails = 'Patent, no obstruction noted.';
		// intervention still satisfied via interventionNone = true
		const result = validateReferral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('BG-A');
	});

	it('ABCDE: requires either a "None" tick or intervention text', () => {
		const d = minimalCompleteAssessment();
		d.background.breathing.interventionNone = false;
		d.background.breathing.interventionDetails = '';
		const result = validateReferral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('BG-B');
	});

	it('Other precaution ticked: requires the description', () => {
		const d = minimalCompleteAssessment();
		d.recommendations.precautions.other = true;
		d.recommendations.precautions.otherDetails = '';
		const result = validateReferral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('REC-02');
	});

	it('Other precaution ticked with description: passes', () => {
		const d = minimalCompleteAssessment();
		d.recommendations.precautions.other = true;
		d.recommendations.precautions.otherDetails = 'Latex allergy.';
		const result = validateReferral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('REC-02');
	});

	it('Receiving facility: receipt rules do not fire when no field touched', () => {
		const d = minimalCompleteAssessment();
		const result = validateReferral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('RFR-01');
		expect(ids).not.toContain('RFR-02');
		expect(ids).not.toContain('RFR-03');
	});

	it('Receiving facility: arrival time recorded triggers receiving provider rules', () => {
		const d = minimalCompleteAssessment();
		d.referralFacilityReceipt.patientArrivalDateTime = '2025-01-10T11:30';
		const result = validateReferral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('RFR-01');
		expect(ids).toContain('RFR-02');
	});

	it('Receiving facility: provider name recorded triggers arrival-time rule', () => {
		const d = minimalCompleteAssessment();
		d.referralFacilityReceipt.receivingProviderName = 'Dr. Jones';
		const result = validateReferral(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('RFR-03');
		expect(ids).toContain('RFR-02');
	});

	it('Receiving facility: a fully completed receipt section passes', () => {
		const d = minimalCompleteAssessment();
		d.referralFacilityReceipt.patientArrivalDateTime = '2025-01-10T11:30';
		d.referralFacilityReceipt.receivingProviderName = 'Dr. Jones';
		d.referralFacilityReceipt.receivingProviderSignature = 'B. Jones';
		const result = validateReferral(d);
		expect(result.complete).toBe(true);
	});

	it('groups missing items by section', () => {
		const result = validateReferral(emptyAssessment());
		const sectionKeys = new Set(result.sections.map((s) => s.section));
		expect(sectionKeys.has('patientIdentification')).toBe(true);
		expect(sectionKeys.has('initiatingProviderSignoff')).toBe(true);
		// Each section's "missing" array length must equal required - satisfied
		for (const s of result.sections) {
			expect(s.missing.length).toBe(s.required - s.satisfied);
		}
	});
});

describe('Flagged Issues', () => {
	it('returns no flags for a benign minimal-complete referral', () => {
		const flags = detectFlaggedIssues(minimalCompleteAssessment());
		expect(flags).toHaveLength(0);
	});

	it('flags highly infectious disease as urgent', () => {
		const d = minimalCompleteAssessment();
		d.recommendations.precautions.highlyInfectiousDisease = true;
		const flags = detectFlaggedIssues(d);
		const fired = flags.find((f) => f.id === 'FLAG-INF-001');
		expect(fired).toBeDefined();
		expect(fired?.priority).toBe('urgent');
	});

	it('flags critically low SpO2 as urgent', () => {
		const d = minimalCompleteAssessment();
		d.assessment.vitalSigns.oxygenSaturation = 85;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-VIT-SPO2' && f.priority === 'urgent')).toBe(
			true
		);
	});

	it('flags GCS <= 8 as urgent', () => {
		const d = minimalCompleteAssessment();
		d.assessment.vitalSigns.glasgowComaScale = 7;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-VIT-GCS' && f.priority === 'urgent')).toBe(
			true
		);
	});

	it('flags hypotension as high', () => {
		const d = minimalCompleteAssessment();
		d.assessment.vitalSigns.systolicBloodPressure = 80;
		const flags = detectFlaggedIssues(d);
		expect(
			flags.some((f) => f.id === 'FLAG-VIT-SBP-LOW' && f.priority === 'high')
		).toBe(true);
	});

	it('flags aspiration risk as high', () => {
		const d = minimalCompleteAssessment();
		d.recommendations.precautions.aspirationRisk = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-PRC-ASP' && f.priority === 'high')).toBe(true);
	});

	it('flags spinal precautions as high', () => {
		const d = minimalCompleteAssessment();
		d.recommendations.precautions.spinalPrecautions = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-PRC-SPN' && f.priority === 'high')).toBe(true);
	});

	it('flags pregnancy as high', () => {
		const d = minimalCompleteAssessment();
		d.situation.pregnant = 'yes';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-PREG' && f.priority === 'high')).toBe(true);
	});

	it('flags fall risk as medium', () => {
		const d = minimalCompleteAssessment();
		d.recommendations.precautions.fallRisk = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-PRC-FALL' && f.priority === 'medium')).toBe(
			true
		);
	});

	it('flags air transport as low', () => {
		const d = minimalCompleteAssessment();
		d.facilityAndTransport.modeOfTransfer = 'air';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-MODE' && f.priority === 'low')).toBe(true);
	});

	it('sorts flags by priority (urgent > high > medium > low)', () => {
		const d = minimalCompleteAssessment();
		d.recommendations.precautions.highlyInfectiousDisease = true;
		d.recommendations.precautions.aspirationRisk = true;
		d.recommendations.precautions.fallRisk = true;
		d.facilityAndTransport.modeOfTransfer = 'air';
		d.assessment.vitalSigns.systolicBloodPressure = 80;
		const flags = detectFlaggedIssues(d);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
