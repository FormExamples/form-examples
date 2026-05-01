import { describe, expect, it } from 'vitest';
import { cfarRules } from './cfar-rules';
import { validateCfar } from './cfar-validator';
import { detectFlaggedIssues } from './flagged-issues';
import type { AssessmentData } from './types';

function emptyAssessment(): AssessmentData {
	return {
		patientIdentification: {
			patientName: '',
			dateOfBirth: '',
			age: null,
			sex: '',
			patientContactInformation: '',
			contactPerson: { name: '', contactInformation: '' }
		},
		referralTransport: {
			referralFacility: { name: '', focalPoint: '', phoneNumber: '' },
			ambulance: { name: '', focalPoint: '', phoneNumber: '' },
			eventDateTime: '',
			departureDateTime: ''
		},
		situation: {
			medical: false,
			trauma: false,
			pregnant: '',
			whatHappened: ''
		},
		background: {
			pastMedicalAndSurgicalHistory: '',
			currentMedicationsOrAllergies: ''
		},
		majorBleeding: {
			assessmentNormal: false,
			assessmentFindings: '',
			interventions: {
				directPressure: false,
				deepWoundPacking: false,
				tourniquet: false,
				tourniquetApplicationTime: '',
				uterineMassage: false,
				none: false
			}
		},
		airway: {
			assessmentNormal: false,
			assessmentFindings: '',
			interventions: {
				neckImmobilization: false,
				headTiltChinLift: false,
				jawThrust: false,
				chokingCare: false,
				none: false
			}
		},
		breathing: {
			assessmentNormal: false,
			assessmentFindings: '',
			interventions: {
				maintainedPositionOfComfort: false,
				none: false
			}
		},
		circulation: {
			assessmentNormal: false,
			assessmentFindings: '',
			interventions: {
				pelvicBinder: false,
				controlMinorBleeding: false,
				fractureCare: false,
				oralHydration: false,
				leftLateralPosition: false,
				none: false
			}
		},
		disability: {
			assessmentNormal: false,
			assessmentFindings: '',
			interventions: {
				spinalImmobilisation: false,
				glucoseGiven: false,
				seizureCare: false,
				highTemperatureCare: false,
				lowTemperatureCare: false,
				none: false
			}
		},
		exposure: {
			assessmentNormal: false,
			assessmentFindings: '',
			interventions: {
				recoveryPosition: false,
				burnCare: false,
				woundCare: false,
				drowningCare: false,
				snakebiteCare: false,
				none: false
			},
			medicationTakenNone: false,
			medicationTakenDetails: ''
		},
		recommendations: {
			transportPlan: '',
			problemsAnticipated: '',
			otherConcerns: '',
			precautions: {
				highlyInfectiousDisease: false,
				spinalImmobilization: false,
				possibleFracture: false,
				fallRisk: false,
				alteredMentalStatus: false,
				other: false,
				otherDetails: ''
			}
		},
		responderDetails: {
			name: '',
			signature: '',
			contactInformation: '',
			cfarOrganization: ''
		}
	};
}

/**
 * Build a minimal-but-complete encounter for a low-acuity patient: all
 * CABCDE assessments marked Normal, all interventions ticked None, no
 * precautions, mandatory text fields filled with the simplest content.
 */
function minimalCompleteAssessment(): AssessmentData {
	const d = emptyAssessment();

	d.patientIdentification.patientName = 'DOE, Jane';
	d.patientIdentification.sex = 'female';

	d.referralTransport.referralFacility.name = 'District Hospital';
	d.referralTransport.eventDateTime = '2026-04-30T10:00';
	d.referralTransport.departureDateTime = '2026-04-30T10:15';

	d.situation.medical = true;
	d.situation.pregnant = 'no';
	d.situation.whatHappened = 'Patient reported chest discomfort at home around 09:50.';

	d.background.pastMedicalAndSurgicalHistory = 'None';
	d.background.currentMedicationsOrAllergies = 'None';

	d.majorBleeding.assessmentNormal = true;
	d.majorBleeding.interventions.none = true;

	d.airway.assessmentNormal = true;
	d.airway.interventions.none = true;

	d.breathing.assessmentNormal = true;
	d.breathing.interventions.none = true;

	d.circulation.assessmentNormal = true;
	d.circulation.interventions.none = true;

	d.disability.assessmentNormal = true;
	d.disability.interventions.none = true;

	d.exposure.assessmentNormal = true;
	d.exposure.interventions.none = true;
	d.exposure.medicationTakenNone = true;

	d.recommendations.transportPlan = 'Transport to District Hospital ED by ambulance.';

	d.responderDetails.name = 'Alex Responder';
	d.responderDetails.signature = 'A. Responder';
	d.responderDetails.contactInformation = '+44 7700 900000';
	d.responderDetails.cfarOrganization = 'Community First Aid Network';

	return d;
}

describe('CFAR Rule Set', () => {
	it('has a non-empty rule set', () => {
		expect(cfarRules.length).toBeGreaterThan(0);
	});

	it('all rule IDs are unique', () => {
		const ids = cfarRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('every rule references a known section', () => {
		const validSections = new Set([
			'patientIdentification',
			'referralTransport',
			'situation',
			'background',
			'majorBleeding',
			'airway',
			'breathing',
			'circulation',
			'disability',
			'exposure',
			'recommendations',
			'responderDetails'
		]);
		for (const r of cfarRules) {
			expect(validSections.has(r.section)).toBe(true);
		}
	});
});

describe('CFAR Validator', () => {
	it('marks an empty assessment as incomplete', () => {
		const result = validateCfar(emptyAssessment());
		expect(result.complete).toBe(false);
		expect(result.totalSatisfied).toBe(0);
		expect(result.missing.length).toBe(result.totalRequired);
	});

	it('marks a minimal but complete encounter as complete', () => {
		const result = validateCfar(minimalCompleteAssessment());
		expect(result.complete).toBe(true);
		expect(result.missing).toHaveLength(0);
		expect(result.totalSatisfied).toBe(result.totalRequired);
	});

	it('CABCDE assessment can be answered by either Normal or findings', () => {
		const d = minimalCompleteAssessment();
		d.airway.assessmentNormal = false;
		d.airway.assessmentFindings = 'Slight stridor on inspiration.';
		const result = validateCfar(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('AW-01');
	});

	it('intervention block requires at least one selection or "None"', () => {
		const d = minimalCompleteAssessment();
		d.circulation.interventions.none = false;
		const result = validateCfar(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('CR-02');
	});

	it('tourniquet ticked: requires application time', () => {
		const d = minimalCompleteAssessment();
		d.majorBleeding.assessmentNormal = false;
		d.majorBleeding.assessmentFindings = 'Arterial bleeding to right thigh.';
		d.majorBleeding.interventions.none = false;
		d.majorBleeding.interventions.directPressure = true;
		d.majorBleeding.interventions.tourniquet = true;
		// time intentionally left blank
		const result = validateCfar(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('MB-03');
	});

	it('tourniquet not ticked: time field is not required', () => {
		const d = minimalCompleteAssessment();
		const result = validateCfar(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('MB-03');
	});

	it('"Other" precaution: requires details', () => {
		const d = minimalCompleteAssessment();
		d.recommendations.precautions.other = true;
		const result = validateCfar(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).toContain('RC-02');
	});

	it('"Other" precaution not ticked: details field not required', () => {
		const d = minimalCompleteAssessment();
		const result = validateCfar(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('RC-02');
	});

	it('exposure medication: either "None" or details satisfies the rule', () => {
		const d = minimalCompleteAssessment();
		d.exposure.medicationTakenNone = false;
		d.exposure.medicationTakenDetails = 'Paracetamol 500mg taken at 09:30';
		const result = validateCfar(d);
		const ids = result.missing.map((m) => m.id);
		expect(ids).not.toContain('EX-03');
	});

	it('groups missing items by section', () => {
		const result = validateCfar(emptyAssessment());
		const sectionKeys = new Set(result.sections.map((s) => s.section));
		expect(sectionKeys.has('patientIdentification')).toBe(true);
		expect(sectionKeys.has('responderDetails')).toBe(true);
		// Each section's "missing" array length must equal required - satisfied
		for (const s of result.sections) {
			expect(s.missing.length).toBe(s.required - s.satisfied);
		}
	});
});

describe('Flagged Issues', () => {
	it('returns no flags for a benign minimal-complete encounter', () => {
		const flags = detectFlaggedIssues(minimalCompleteAssessment());
		expect(flags).toHaveLength(0);
	});

	it('flags major bleeding without intervention as urgent', () => {
		const d = minimalCompleteAssessment();
		d.majorBleeding.assessmentNormal = false;
		d.majorBleeding.assessmentFindings = 'Heavy bleeding from leg laceration.';
		d.majorBleeding.interventions.none = false;
		const flags = detectFlaggedIssues(d);
		const fired = flags.find((f) => f.id === 'FLAG-MB-001');
		expect(fired).toBeDefined();
		expect(fired?.priority).toBe('urgent');
		expect(flags[0].priority).toBe('urgent');
	});

	it('flags tourniquet without time as urgent', () => {
		const d = minimalCompleteAssessment();
		d.majorBleeding.assessmentNormal = false;
		d.majorBleeding.assessmentFindings = 'Arterial bleed.';
		d.majorBleeding.interventions.none = false;
		d.majorBleeding.interventions.directPressure = true;
		d.majorBleeding.interventions.tourniquet = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-MB-002' && f.priority === 'urgent')).toBe(true);
	});

	it('flags abnormal airway without intervention as urgent', () => {
		const d = minimalCompleteAssessment();
		d.airway.assessmentNormal = false;
		d.airway.assessmentFindings = 'Patient gurgling.';
		d.airway.interventions.none = false;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-AW-001' && f.priority === 'urgent')).toBe(true);
	});

	it('flags pregnancy as high', () => {
		const d = minimalCompleteAssessment();
		d.situation.pregnant = 'yes';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-PR-001' && f.priority === 'high')).toBe(true);
	});

	it('flags highly infectious disease precaution as high', () => {
		const d = minimalCompleteAssessment();
		d.recommendations.precautions.highlyInfectiousDisease = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-PC-001' && f.priority === 'high')).toBe(true);
	});

	it('flags possible fracture as medium', () => {
		const d = minimalCompleteAssessment();
		d.recommendations.precautions.possibleFracture = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-PC-003' && f.priority === 'medium')).toBe(true);
	});

	it('flags glucose given as low', () => {
		const d = minimalCompleteAssessment();
		d.disability.interventions.none = false;
		d.disability.interventions.glucoseGiven = true;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-DS-002' && f.priority === 'low')).toBe(true);
	});

	it('sorts flags by priority (urgent > high > medium > low)', () => {
		const d = minimalCompleteAssessment();
		d.majorBleeding.assessmentNormal = false;
		d.majorBleeding.assessmentFindings = 'Heavy bleeding.';
		d.majorBleeding.interventions.none = false;
		d.situation.pregnant = 'yes';
		d.recommendations.precautions.possibleFracture = true;
		d.disability.interventions.none = false;
		d.disability.interventions.glucoseGiven = true;
		const flags = detectFlaggedIssues(d);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
