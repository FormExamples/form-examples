import type { AssessmentData, CertificateType, IssuerType } from '#lib/engine/types.js';
import { validateMatB1 } from '#lib/engine/mat-b1-validator.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample certificate: an identifier and the full data the engine validates. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	issueDate: string;
	data: AssessmentData;
}

/** A row in the issuer dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	issueDate: string;
	certificateType: CertificateType;
	issuerType: IssuerType;
	status: 'complete' | 'incomplete';
	weeksBeforeEwc: number | null;
	flagCount: number;
}

/** A clean Part A (pre-confinement) certificate issued by a doctor. */
function preDoctorComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientIdentification = {
		patientName: 'Smith, Jane',
		dateOfBirth: '1992-03-14',
		nhsNumber: '943 476 5919'
	};
	d.certificateType = 'pre';
	d.preConfinement = {
		expectedDateOfConfinement: '2026-08-15',
		examinationDate: '2026-05-23'
	};
	d.issuer = {
		...d.issuer,
		issuerType: 'doctor',
		doctor: {
			doctorName: 'Dr. Aisha Khan',
			practiceName: 'Riverside Medical Practice',
			practiceAddress: '12 Riverside Road, Leeds LS1 4AB',
			stampApplied: 'yes'
		},
		certificateNumber: 'MATB1-2026-001234',
		issueDate: '2026-05-23',
		isDuplicate: 'no',
		duplicateMarkerApplied: '',
		completedInInk: 'yes'
	};
	return d;
}

/** A clean Part A (pre-confinement) certificate issued by a registered midwife. */
function preMidwifeComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientIdentification = {
		patientName: 'Patel, Priya',
		dateOfBirth: '1988-11-22',
		nhsNumber: '485 777 3456'
	};
	d.certificateType = 'pre';
	d.preConfinement = {
		expectedDateOfConfinement: '2026-09-02',
		examinationDate: '2026-06-10'
	};
	d.issuer = {
		...d.issuer,
		issuerType: 'midwife',
		midwife: {
			midwifeName: 'Sarah Edwards RM',
			nmcPin: '12A3456E',
			nmcExpiryDate: '2027-05-31'
		},
		certificateNumber: 'MATB1-2026-001235',
		issueDate: '2026-06-10',
		isDuplicate: 'no',
		duplicateMarkerApplied: '',
		completedInInk: 'yes'
	};
	return d;
}

/** A clean Part B (post-confinement) certificate issued by a doctor. */
function postDoctorComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientIdentification = {
		patientName: 'Jones, Margaret',
		dateOfBirth: '1995-06-08',
		nhsNumber: '624 112 8890'
	};
	d.certificateType = 'post';
	d.postConfinement = {
		actualDateOfBirth: '2026-03-18',
		expectedDateOfConfinement: '2026-03-20'
	};
	d.issuer = {
		...d.issuer,
		issuerType: 'doctor',
		doctor: {
			doctorName: 'Dr. Michael O’Connor',
			practiceName: 'Parkview Surgery',
			practiceAddress: '4 Park Lane, Manchester M3 2GH',
			stampApplied: 'yes'
		},
		certificateNumber: 'MATB1-2026-001236',
		issueDate: '2026-03-25',
		isDuplicate: 'no',
		duplicateMarkerApplied: '',
		completedInInk: 'yes'
	};
	return d;
}

/**
 * An incomplete, flagged duplicate: issued too early (more than 20 weeks before
 * the EWC), missing the certificate number, and the duplicate marker absent.
 */
function preMidwifeFlagged(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientIdentification = {
		patientName: 'Davies, Helen',
		dateOfBirth: '1985-04-19',
		nhsNumber: '771 553 2210'
	};
	d.certificateType = 'pre';
	d.preConfinement = {
		expectedDateOfConfinement: '2026-12-01',
		examinationDate: '2026-06-01'
	};
	d.issuer = {
		...d.issuer,
		issuerType: 'midwife',
		midwife: {
			midwifeName: 'Joanne Bryant RM',
			nmcPin: '23D6789B',
			nmcExpiryDate: '2026-04-30'
		},
		certificateNumber: '',
		issueDate: '2026-06-01',
		isDuplicate: 'yes',
		duplicateMarkerApplied: 'no',
		completedInInk: 'yes'
	};
	return d;
}

/** The sample certificates, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'MB-2026-0001', patientName: 'Smith, Jane', issueDate: '2026-05-23', data: preDoctorComplete() },
	{ id: 'MB-2026-0002', patientName: 'Patel, Priya', issueDate: '2026-06-10', data: preMidwifeComplete() },
	{ id: 'MB-2026-0003', patientName: 'Jones, Margaret', issueDate: '2026-03-25', data: postDoctorComplete() },
	{ id: 'MB-2026-0004', patientName: 'Davies, Helen', issueDate: '2026-06-01', data: preMidwifeFlagged() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const r = validateMatB1(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		issueDate: s.issueDate,
		certificateType: r.certificateType,
		issuerType: r.issuerType,
		status: r.complete ? 'complete' : 'incomplete',
		weeksBeforeEwc: r.weeksBeforeEwc,
		flagCount: r.additionalFlags.length
	};
});
