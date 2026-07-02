import { describe, it, expect } from 'vitest';
import { calculatePacuGrade } from './pacu-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { aldreteRules } from './pacu-rules';
import type { AssessmentData } from './types';

/**
 * A blank record (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			nurseName: '',
			nurseRole: '',
			anaesthetistName: '',
			admittedAt: '',
			anaestheticTechnique: '',
			procedure: ''
		},
		identification: {
			patientIdentifier: '',
			ageBand: '',
			sex: '',
			asaStatus: '',
			baselineSystolicBp: null,
			ambulatoryCase: ''
		},
		activity: { activity: '' },
		respiration: { respiration: '' },
		circulation: { circulation: '' },
		consciousness: { consciousness: '' },
		oxygenSaturation: { oxygenSaturation: '' },
		observations: {
			airwayStatus: '',
			painScore: null,
			ponvSeverity: '',
			analgesiaGiven: '',
			antiemeticsGiven: ''
		},
		padss: {
			padssVitalSigns: '',
			padssAmbulation: '',
			padssNauseaVomiting: '',
			padssPain: '',
			padssSurgicalBleeding: ''
		},
		note: { recoveryNote: '' }
	};
}

/** A fully-recovered patient scoring the maximum 10/10, discharge-ready. */
function createReadyPatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		nurseName: 'Sister J. Okafor',
		nurseRole: 'recovery-nurse',
		anaesthetistName: 'Dr A. Khan',
		admittedAt: '2026-06-24T10:15',
		anaestheticTechnique: 'general',
		procedure: 'Laparoscopic cholecystectomy'
	};
	d.identification = {
		patientIdentifier: 'PACU-100482',
		ageBand: '40-59',
		sex: 'female',
		asaStatus: 'II',
		baselineSystolicBp: 128,
		ambulatoryCase: 'no'
	};
	d.activity.activity = 'all-four';
	d.respiration.respiration = 'deep-cough';
	d.circulation.circulation = 'within-20';
	d.consciousness.consciousness = 'awake';
	d.oxygenSaturation.oxygenSaturation = 'room-air';
	d.observations.airwayStatus = 'patent';
	d.observations.painScore = 1;
	d.observations.ponvSeverity = 'none';
	return d;
}

describe('PACU / Modified Aldrete grading engine', () => {
	it('scores 10/10 and discharge-ready for a fully-recovered patient', () => {
		const r = calculatePacuGrade(createReadyPatient());
		expect(r.aldreteTotal).toBe(10);
		expect(r.activityScore).toBe(2);
		expect(r.respirationScore).toBe(2);
		expect(r.circulationScore).toBe(2);
		expect(r.consciousnessScore).toBe(2);
		expect(r.oxygenSaturationScore).toBe(2);
		expect(r.readinessBand).toBe('discharge-ready');
	});

	it('total 9 with SpO2 parameter met is discharge-ready', () => {
		const d = createReadyPatient();
		d.activity.activity = 'two'; // 1 point → total 9, SpO2 still 2
		const r = calculatePacuGrade(d);
		expect(r.aldreteTotal).toBe(9);
		expect(r.oxygenSaturationScore).toBe(2);
		expect(r.readinessBand).toBe('discharge-ready');
	});

	it('total 8 is below the discharge threshold and stays not-ready', () => {
		const d = createReadyPatient();
		d.activity.activity = 'none'; // 0 → total 8
		const r = calculatePacuGrade(d);
		expect(r.aldreteTotal).toBe(8);
		expect(r.readinessBand).toBe('not-ready');
	});

	it('SpO2-gated: total 9 with oxygen-saturation score < 2 stays not-ready', () => {
		const d = createReadyPatient();
		// Drop SpO2 to 1 (total becomes 9) — gate keeps it not-ready.
		d.oxygenSaturation.oxygenSaturation = 'needs-o2';
		const r = calculatePacuGrade(d);
		expect(r.aldreteTotal).toBe(9);
		expect(r.oxygenSaturationScore).toBe(1);
		expect(r.readinessBand).toBe('not-ready');
	});

	it('maps every Aldrete parameter level 0/1/2', () => {
		const d = createDefaultAssessment();
		d.activity.activity = 'two';
		d.respiration.respiration = 'apnoeic';
		d.circulation.circulation = 'within-20';
		d.consciousness.consciousness = 'arousable';
		d.oxygenSaturation.oxygenSaturation = 'low-on-o2';
		const r = calculatePacuGrade(d);
		expect(r.activityScore).toBe(1);
		expect(r.respirationScore).toBe(0);
		expect(r.circulationScore).toBe(2);
		expect(r.consciousnessScore).toBe(1);
		expect(r.oxygenSaturationScore).toBe(0);
		expect(r.aldreteTotal).toBe(4);
	});

	it('a missing parameter contributes 0 for a blank record', () => {
		const r = calculatePacuGrade(createDefaultAssessment());
		expect(r.aldreteTotal).toBe(0);
		expect(r.readinessBand).toBe('not-ready');
	});

	it('does not score PADSS unless ambulatory with all five criteria', () => {
		const d = createReadyPatient();
		expect(calculatePacuGrade(d).padssTotal).toBeNull();

		d.identification.ambulatoryCase = 'yes';
		expect(calculatePacuGrade(d).padssTotal).toBeNull(); // criteria still blank
	});

	it('PADSS >= 9 boundary is street-fit', () => {
		const d = createReadyPatient();
		d.identification.ambulatoryCase = 'yes';
		d.padss = {
			padssVitalSigns: 'within-20', // 2
			padssAmbulation: 'steady', // 2
			padssNauseaVomiting: 'minimal', // 2
			padssPain: 'minimal', // 2
			padssSurgicalBleeding: 'moderate' // 1 → total 9
		};
		const r = calculatePacuGrade(d);
		expect(r.padssTotal).toBe(9);
		expect(r.padssStreetFit).toBe(true);
	});

	it('PADSS total 8 is not street-fit', () => {
		const d = createReadyPatient();
		d.identification.ambulatoryCase = 'yes';
		d.padss = {
			padssVitalSigns: 'within-40', // 1
			padssAmbulation: 'steady', // 2
			padssNauseaVomiting: 'minimal', // 2
			padssPain: 'minimal', // 2
			padssSurgicalBleeding: 'moderate' // 1 → total 8
		};
		const r = calculatePacuGrade(d);
		expect(r.padssTotal).toBe(8);
		expect(r.padssStreetFit).toBe(false);
	});

	it('all rule IDs are unique', () => {
		const ids = aldreteRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('PACU flagged-issue detection', () => {
	const readyGrade = {
		activityScore: 2,
		respirationScore: 2,
		circulationScore: 2,
		consciousnessScore: 2,
		oxygenSaturationScore: 2,
		aldreteTotal: 10
	};

	it('raises no red flags for a complete, discharge-ready patient', () => {
		const flags = detectFlaggedIssues(createReadyPatient(), readyGrade);
		expect(flags).toHaveLength(0);
	});

	it('raises not-ready and hypoxia flags when SpO2 scores below 2', () => {
		const d = createReadyPatient();
		d.oxygenSaturation.oxygenSaturation = 'needs-o2';
		const flags = detectFlaggedIssues(d, { ...readyGrade, oxygenSaturationScore: 1, aldreteTotal: 9 });
		expect(flags.some((f) => f.id === 'F-NOT-READY-ALDRETE-UNDER-9-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-HYPOXIA-001')).toBe(true);
	});

	it('raises unstable-vitals when circulation or respiration below 2', () => {
		const d = createReadyPatient();
		const flags = detectFlaggedIssues(d, {
			...readyGrade,
			circulationScore: 1,
			respirationScore: 1,
			aldreteTotal: 8
		});
		expect(flags.some((f) => f.id === 'F-UNSTABLE-VITALS-001')).toBe(true);
	});

	it('raises uncontrolled-pain at 4/10 and uncontrolled-PONV when moderate', () => {
		const d = createReadyPatient();
		d.observations.painScore = 4;
		d.observations.ponvSeverity = 'moderate';
		const flags = detectFlaggedIssues(d, readyGrade);
		expect(flags.some((f) => f.id === 'F-UNCONTROLLED-PAIN-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-UNCONTROLLED-PONV-001')).toBe(true);
	});

	it('raises surgical-bleeding when the PADSS bleeding criterion is below 2', () => {
		const d = createReadyPatient();
		d.padss.padssSurgicalBleeding = 'moderate';
		const flags = detectFlaggedIssues(d, readyGrade);
		expect(flags.some((f) => f.id === 'F-BLEEDING-001')).toBe(true);
	});

	it('raises incomplete-assessment when an Aldrete parameter is missing', () => {
		const flags = detectFlaggedIssues(createDefaultAssessment(), {
			activityScore: 0,
			respirationScore: 0,
			circulationScore: 0,
			consciousnessScore: 0,
			oxygenSaturationScore: 0,
			aldreteTotal: 0
		});
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createReadyPatient();
		d.observations.painScore = 6; // medium
		const flags = detectFlaggedIssues(d, { ...readyGrade, oxygenSaturationScore: 1, aldreteTotal: 9 });
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
