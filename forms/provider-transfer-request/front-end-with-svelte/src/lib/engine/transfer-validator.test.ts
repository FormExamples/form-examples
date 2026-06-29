import { describe, it, expect } from 'vitest';
import { validateTransfer, gradeTransfer } from './transfer-validator';
import { detectFlaggedIssues } from './flagged-issues';
import { validationRules, acknowledgementStarted } from './validation-rules';
import { createDefaultAssessment } from './defaults';
import type { AssessmentData } from './types';

/** A fully-completed transfer with all mandatory fields supplied. */
function completeTransfer(): AssessmentData {
	const d = createDefaultAssessment();
	d.requestingProvider = {
		...d.requestingProvider,
		clinicianName: 'Dr A Requester',
		clinicianRole: 'Registrar',
		organisation: 'St Mary General',
		ward: 'AMU',
		phone: '01000 000001',
		email: 'a.req@example.org'
	};
	d.receivingProvider = {
		...d.receivingProvider,
		clinicianName: 'Dr B Receiver',
		clinicianRole: 'Consultant',
		organisation: 'County Cardiac Centre',
		ward: 'CCU',
		phone: '01000 000002'
	};
	d.patientDemographics = {
		...d.patientDemographics,
		firstName: 'Pat',
		lastName: 'Patient',
		dateOfBirth: '1960-01-01',
		sex: 'female',
		nhsNumber: '123 456 7890',
		nextOfKinName: 'Kin Person'
	};
	d.situation = {
		...d.situation,
		reasonForTransfer: 'Specialist cardiac input required.',
		primaryDiagnosis: 'NSTEMI',
		urgency: 'routine',
		transferType: 'inter-hospital',
		requestedDateTime: '2026-07-01T09:00'
	};
	d.background = {
		...d.background,
		presentingComplaint: 'Chest pain',
		relevantHistory: 'Admitted overnight, troponin positive.',
		pastMedicalHistory: 'Hypertension',
		currentMedications: 'Aspirin 75mg OD',
		allergies: 'NKDA',
		recentInvestigations: 'ECG, troponin',
		infectionStatus: 'None known'
	};
	d.assessment = {
		...d.assessment,
		currentClinicalStatus: 'Stable, pain-free.',
		consciousLevel: 'awake',
		clinicallyStable: 'yes',
		vitalSigns: {
			...d.assessment.vitalSigns,
			heartRate: 78,
			respiratoryRate: 16,
			systolicBloodPressure: 128,
			oxygenSaturation: 98
		}
	};
	d.recommendation = {
		...d.recommendation,
		requestedAction: 'Accept for angiography.',
		expectedOutcomes: 'Revascularisation.',
		ongoingCarePlan: 'Continue dual antiplatelet therapy.',
		pendingResults: 'None'
	};
	d.transferLogistics = {
		...d.transferLogistics,
		transportMode: 'ambulance',
		departureDateTime: '2026-07-01T10:00',
		estimatedArrivalDateTime: '2026-07-01T10:45'
	};
	d.signoffAcknowledgement = {
		...d.signoffAcknowledgement,
		requestingProviderSignature: 'A Requester',
		requestingProviderSignatureDate: '2026-07-01',
		receivingProviderName: 'Dr B Receiver',
		receivingProviderSignature: 'B Receiver',
		receivingProviderSignatureDate: '2026-07-01',
		acknowledgementReceived: true
	};
	return d;
}

describe('Provider Transfer completeness validator', () => {
	it('reports incomplete for a blank transfer (mandatory fields missing)', () => {
		const result = validateTransfer(createDefaultAssessment());
		expect(result.completeness).toBe('incomplete');
		expect(result.mandatorySatisfied).toBeLessThan(result.mandatoryRequired);
		expect(result.missing.length).toBeGreaterThan(0);
	});

	it('reports complete when every applicable field is supplied', () => {
		const result = validateTransfer(completeTransfer());
		expect(result.completeness).toBe('complete');
		expect(result.totalSatisfied).toBe(result.totalRequired);
		expect(result.missing).toHaveLength(0);
	});

	it('reports partial when only optional fields are outstanding', () => {
		const d = completeTransfer();
		d.requestingProvider.email = '';
		d.requestingProvider.ward = '';
		const result = validateTransfer(d);
		expect(result.completeness).toBe('partial');
		expect(result.mandatorySatisfied).toBe(result.mandatoryRequired);
		expect(result.missing.every((m) => !m.mandatory)).toBe(true);
	});

	it('requires stability notes only when not clinically stable', () => {
		const d = completeTransfer();
		d.assessment.clinicallyStable = 'no';
		d.assessment.stabilityNotes = '';
		const result = validateTransfer(d);
		expect(result.completeness).toBe('incomplete');
		expect(result.missing.some((m) => m.id === 'ASS-04')).toBe(true);
	});

	it('gates receiving-provider rules until acknowledgement is started', () => {
		const blank = createDefaultAssessment();
		expect(acknowledgementStarted(blank)).toBe(false);
		const ackRules = validationRules.filter((r) => r.id.startsWith('SGN-0') && r.id !== 'SGN-01' && r.id !== 'SGN-02');
		expect(ackRules.every((r) => !r.applies(blank))).toBe(true);

		const started = completeTransfer();
		started.signoffAcknowledgement.receivingProviderName = 'Dr B Receiver';
		expect(acknowledgementStarted(started)).toBe(true);
		expect(ackRules.every((r) => r.applies(started))).toBe(true);
	});

	it('has unique rule ids', () => {
		const ids = validationRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Provider Transfer flagged issues', () => {
	it('raises no flags for a stable, routine transfer', () => {
		expect(detectFlaggedIssues(completeTransfer())).toHaveLength(0);
	});

	it('flags emergent urgency as urgent priority', () => {
		const d = completeTransfer();
		d.situation.urgency = 'emergent';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-URG-EMERG' && f.priority === 'urgent')).toBe(true);
	});

	it('flags a clinically unstable patient', () => {
		const d = completeTransfer();
		d.assessment.clinicallyStable = 'no';
		d.assessment.stabilityNotes = 'Hypotensive.';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-STAB-NO')).toBe(true);
	});

	it('flags critically low oxygen saturation', () => {
		const d = completeTransfer();
		d.assessment.vitalSigns.oxygenSaturation = 85;
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-VIT-SPO2')).toBe(true);
	});

	it('sorts flags by priority (urgent first)', () => {
		const d = completeTransfer();
		d.situation.urgency = 'emergent';
		d.transferLogistics.fallsRisk = true;
		const flags = detectFlaggedIssues(d);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 };
		const priorities = flags.map((f) => order[f.priority]);
		expect(priorities).toEqual([...priorities].sort((a, b) => a - b));
	});
});

describe('gradeTransfer', () => {
	it('bundles validation, flags, and a timestamp', () => {
		const g = gradeTransfer(completeTransfer());
		expect(g.validation.completeness).toBe('complete');
		expect(Array.isArray(g.flags)).toBe(true);
		expect(typeof g.timestamp).toBe('string');
	});
});
