import { describe, expect, it } from 'vitest';
import { validateMatB1 } from './mat-b1-validator';
import { matB1Rules } from './mat-b1-rules';
import { detectAdditionalFlags } from './flagged-issues';
import type { AssessmentData } from './types';

function emptyAssessment(): AssessmentData {
	return {
		patientIdentification: {
			patientName: '',
			dateOfBirth: '',
			nhsNumber: ''
		},
		certificateType: '',
		preConfinement: {
			expectedDateOfConfinement: '',
			examinationDate: ''
		},
		postConfinement: {
			actualDateOfBirth: '',
			expectedDateOfConfinement: ''
		},
		issuer: {
			issuerType: '',
			doctor: {
				doctorName: '',
				practiceName: '',
				practiceAddress: '',
				stampApplied: ''
			},
			midwife: {
				midwifeName: '',
				nmcPin: '',
				nmcExpiryDate: ''
			},
			certificateNumber: '',
			issueDate: '',
			isDuplicate: '',
			duplicateMarkerApplied: '',
			completedInInk: ''
		}
	};
}

function validPreConfinementDoctor(): AssessmentData {
	const d = emptyAssessment();
	d.patientIdentification.patientName = 'Jane Doe';
	d.certificateType = 'pre';
	// Examination 10 weeks before EWC (within 20-week window)
	d.preConfinement.examinationDate = '2026-03-01';
	d.preConfinement.expectedDateOfConfinement = '2026-05-10';
	d.issuer.issuerType = 'doctor';
	d.issuer.doctor.doctorName = 'Dr Smith';
	d.issuer.doctor.practiceName = 'High Street Surgery';
	d.issuer.doctor.practiceAddress = '1 High Street, London';
	d.issuer.doctor.stampApplied = 'yes';
	d.issuer.certificateNumber = 'MATB1-000123';
	d.issuer.issueDate = '2026-03-01';
	d.issuer.isDuplicate = 'no';
	d.issuer.duplicateMarkerApplied = 'no';
	d.issuer.completedInInk = 'yes';
	return d;
}

function validPostConfinementMidwife(): AssessmentData {
	const d = emptyAssessment();
	d.patientIdentification.patientName = 'Jane Doe';
	d.certificateType = 'post';
	d.postConfinement.actualDateOfBirth = '2026-05-08';
	d.postConfinement.expectedDateOfConfinement = '2026-05-10';
	d.issuer.issuerType = 'midwife';
	d.issuer.midwife.midwifeName = 'M. Brown';
	d.issuer.midwife.nmcPin = '12A3456E';
	d.issuer.midwife.nmcExpiryDate = '2027-12-31';
	d.issuer.certificateNumber = 'MATB1-000456';
	d.issuer.issueDate = '2026-05-09';
	d.issuer.isDuplicate = 'no';
	d.issuer.duplicateMarkerApplied = 'no';
	d.issuer.completedInInk = 'yes';
	return d;
}

describe('MAT B1 validator — rule set', () => {
	it('all rule IDs are unique', () => {
		const ids = matB1Rules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('every rule has a non-empty message', () => {
		for (const r of matB1Rules) {
			expect(r.message.length).toBeGreaterThan(0);
		}
	});
});

describe('MAT B1 validator — empty assessment', () => {
	it('fires the high-priority completeness rules and is not complete', () => {
		const data = emptyAssessment();
		const r = validateMatB1(data);
		expect(r.complete).toBe(false);
		const ids = r.firedRules.map((f) => f.id);
		expect(ids).toContain('MATB1-PT-001'); // patient name missing
		expect(ids).toContain('MATB1-CERT-001'); // certificate type missing
		expect(ids).toContain('MATB1-ISS-001'); // issuer type missing
		expect(ids).toContain('MATB1-DOC-001'); // certificate number missing
		expect(ids).toContain('MATB1-DOC-002'); // issue date missing
		expect(ids).toContain('MATB1-DOC-003'); // ink confirmation missing
	});

	it('skips Part A / Part B / doctor / midwife detail rules when type is unset', () => {
		const data = emptyAssessment();
		const r = validateMatB1(data);
		const ids = r.firedRules.map((f) => f.id);
		expect(ids.some((id) => id.startsWith('MATB1-A-'))).toBe(false);
		expect(ids.some((id) => id.startsWith('MATB1-B-'))).toBe(false);
		expect(ids.some((id) => id.startsWith('MATB1-DR-'))).toBe(false);
		expect(ids.some((id) => id.startsWith('MATB1-MW-'))).toBe(false);
	});

	it('sorts fired rules by priority (urgent → low)', () => {
		const data = emptyAssessment();
		const r = validateMatB1(data);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 } as const;
		const priorities = r.firedRules.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});

describe('MAT B1 validator — Part A (pre-confinement, doctor)', () => {
	it('returns complete for a fully-populated valid pre-confinement record', () => {
		const data = validPreConfinementDoctor();
		const r = validateMatB1(data);
		expect(r.complete).toBe(true);
		expect(r.firedRules.filter((f) => f.category === 'completeness')).toHaveLength(0);
		expect(r.certificateType).toBe('pre');
		expect(r.issuerType).toBe('doctor');
	});

	it('computes weeksBeforeEwc for a Part A certificate', () => {
		const data = validPreConfinementDoctor();
		const r = validateMatB1(data);
		expect(r.weeksBeforeEwc).not.toBeNull();
		expect(r.weeksBeforeEwc).toBeGreaterThan(0);
	});

	it('fires the 20-week timing rule when issued too early', () => {
		const data = validPreConfinementDoctor();
		// Examination 25 weeks before EWC
		data.preConfinement.examinationDate = '2025-11-15';
		data.preConfinement.expectedDateOfConfinement = '2026-05-10';
		const r = validateMatB1(data);
		const ids = r.firedRules.map((f) => f.id);
		expect(ids).toContain('MATB1-A-003');
	});

	it('fires consistency rule when examination date is after EWC', () => {
		const data = validPreConfinementDoctor();
		data.preConfinement.examinationDate = '2026-06-01';
		data.preConfinement.expectedDateOfConfinement = '2026-05-10';
		const r = validateMatB1(data);
		const ids = r.firedRules.map((f) => f.id);
		expect(ids).toContain('MATB1-A-004');
	});

	it('fires when doctor stamp is not confirmed applied', () => {
		const data = validPreConfinementDoctor();
		data.issuer.doctor.stampApplied = '';
		const r = validateMatB1(data);
		const ids = r.firedRules.map((f) => f.id);
		expect(ids).toContain('MATB1-DR-004');
	});
});

describe('MAT B1 validator — Part B (post-confinement, midwife)', () => {
	it('returns complete for a fully-populated valid post-confinement record', () => {
		const data = validPostConfinementMidwife();
		const r = validateMatB1(data);
		expect(r.complete).toBe(true);
		expect(r.certificateType).toBe('post');
		expect(r.issuerType).toBe('midwife');
		// weeksBeforeEwc is only computed for Part A
		expect(r.weeksBeforeEwc).toBeNull();
	});

	it('fires when midwife NMC registration expired before issue date', () => {
		const data = validPostConfinementMidwife();
		data.issuer.midwife.nmcExpiryDate = '2026-01-01';
		data.issuer.issueDate = '2026-05-09';
		const r = validateMatB1(data);
		const ids = r.firedRules.map((f) => f.id);
		expect(ids).toContain('MATB1-MW-004');
	});

	it('fires when NMC PIN is missing', () => {
		const data = validPostConfinementMidwife();
		data.issuer.midwife.nmcPin = '';
		const r = validateMatB1(data);
		const ids = r.firedRules.map((f) => f.id);
		expect(ids).toContain('MATB1-MW-002');
	});
});

describe('MAT B1 validator — duplicate handling', () => {
	it('fires the duplicate marker rule when isDuplicate=yes but marker not applied', () => {
		const data = validPreConfinementDoctor();
		data.issuer.isDuplicate = 'yes';
		data.issuer.duplicateMarkerApplied = 'no';
		const r = validateMatB1(data);
		const ids = r.firedRules.map((f) => f.id);
		expect(ids).toContain('MATB1-DUP-001');
	});

	it('does not fire the duplicate marker rule when isDuplicate=no', () => {
		const data = validPreConfinementDoctor();
		data.issuer.isDuplicate = 'no';
		data.issuer.duplicateMarkerApplied = 'no';
		const r = validateMatB1(data);
		const ids = r.firedRules.map((f) => f.id);
		expect(ids).not.toContain('MATB1-DUP-001');
	});
});

describe('MAT B1 — flagged issues', () => {
	it('returns no flags for a fully-valid Part A record', () => {
		const data = validPreConfinementDoctor();
		const flags = detectAdditionalFlags(data);
		expect(flags).toHaveLength(0);
	});

	it('flags missing certificate number as urgent', () => {
		const data = validPreConfinementDoctor();
		data.issuer.certificateNumber = '';
		const flags = detectAdditionalFlags(data);
		const urgent = flags.find((f) => f.id === 'FLAG-CERT-NUMBER-URGENT-001');
		expect(urgent).toBeDefined();
		expect(urgent?.priority).toBe('urgent');
	});

	it('flags > 20 weeks before EWC as high', () => {
		const data = validPreConfinementDoctor();
		data.preConfinement.examinationDate = '2025-11-15';
		data.preConfinement.expectedDateOfConfinement = '2026-05-10';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-EWC-WINDOW-HIGH-001')).toBe(true);
	});

	it('flags expired NMC registration as high', () => {
		const data = validPostConfinementMidwife();
		data.issuer.midwife.nmcExpiryDate = '2026-01-01';
		data.issuer.issueDate = '2026-05-09';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-NMC-EXPIRY-HIGH-001')).toBe(true);
	});

	it('flags duplicate without marker as medium', () => {
		const data = validPreConfinementDoctor();
		data.issuer.isDuplicate = 'yes';
		data.issuer.duplicateMarkerApplied = 'no';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-DUPLICATE-MED-001')).toBe(true);
	});

	it('flags both Part A and Part B partially populated', () => {
		const data = validPreConfinementDoctor();
		data.postConfinement.actualDateOfBirth = '2026-05-09';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-PARTS-CONFLICT-MED-001')).toBe(true);
	});

	it('sorts flags by priority (urgent first)', () => {
		const data = validPreConfinementDoctor();
		data.issuer.certificateNumber = ''; // urgent
		data.preConfinement.examinationDate = '2025-11-15'; // high
		data.preConfinement.expectedDateOfConfinement = '2026-05-10';
		data.issuer.isDuplicate = 'yes';
		data.issuer.duplicateMarkerApplied = 'no'; // medium
		const flags = detectAdditionalFlags(data);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
