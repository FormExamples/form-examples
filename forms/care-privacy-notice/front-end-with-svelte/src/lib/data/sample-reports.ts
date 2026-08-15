import type { AssessmentData } from '#lib/engine/types.js';
import { gradeForm } from '#lib/engine/grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample acknowledgment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	acknowledgedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	practiceName: string;
	acknowledgedDate: string;
	status: 'Complete' | 'Incomplete';
	completenessPercent: number;
	acknowledged: boolean;
	flagCount: number;
}

/** A complete acknowledgment: all required fields present, patient agreed. */
function complete(): AssessmentData {
	const d = createDefaultAssessment();
	d.practiceConfiguration = {
		practiceName: 'Riverside Medical Practice',
		practiceAddress: '123 High Street, London, SW1A 1AA',
		dpoName: 'Jane Smith',
		dpoContactDetails: 'jane.smith@riverside.nhs.uk, 020 7123 4567',
		researchOrganisations: 'Clinical Practice Research Datalink',
		dataSharingPartners: 'NHS England'
	};
	d.acknowledgmentSignature = {
		agreed: true,
		patientTypedFullName: 'John Smith',
		patientTypedDate: '2026-06-10'
	};
	return d;
}

/** A second complete acknowledgment at a different practice. */
function completeOther(): AssessmentData {
	const d = createDefaultAssessment();
	d.practiceConfiguration = {
		practiceName: 'Hillside Surgery',
		practiceAddress: '8 Hill Road, Leeds, LS1 4DY',
		dpoName: 'Robert Allen',
		dpoContactDetails: 'dpo@hillside.nhs.uk, 0113 555 0192',
		researchOrganisations: 'NIHR Clinical Research Network',
		dataSharingPartners: 'NHS England, Leeds Teaching Hospitals'
	};
	d.acknowledgmentSignature = {
		agreed: true,
		patientTypedFullName: 'Priya Patel',
		patientTypedDate: '2026-06-12'
	};
	return d;
}

/** An incomplete acknowledgment: patient has not agreed and name missing. */
function incompleteNoAck(): AssessmentData {
	const d = createDefaultAssessment();
	d.practiceConfiguration = {
		practiceName: 'The Green Practice',
		practiceAddress: '2 Park Lane, Bristol, BS1 5TR',
		dpoName: 'Helen Carter',
		dpoContactDetails: 'dpo@greenpractice.nhs.uk',
		researchOrganisations: '',
		dataSharingPartners: ''
	};
	d.acknowledgmentSignature = {
		agreed: false,
		patientTypedFullName: '',
		patientTypedDate: ''
	};
	return d;
}

/** An incomplete acknowledgment: practice configuration partly missing. */
function incompleteConfig(): AssessmentData {
	const d = createDefaultAssessment();
	d.practiceConfiguration = {
		practiceName: 'Lakeside Health Centre',
		practiceAddress: '',
		dpoName: '',
		dpoContactDetails: '',
		researchOrganisations: '',
		dataSharingPartners: ''
	};
	d.acknowledgmentSignature = {
		agreed: true,
		patientTypedFullName: 'David Williams',
		patientTypedDate: '2026-06-15'
	};
	return d;
}

/** The sample acknowledgments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'CPN-2026-0001', patientName: 'Smith, John', acknowledgedDate: '2026-06-10', data: complete() },
	{ id: 'CPN-2026-0002', patientName: 'Patel, Priya', acknowledgedDate: '2026-06-12', data: completeOther() },
	{ id: 'CPN-2026-0003', patientName: 'Jones, Margaret', acknowledgedDate: '2026-06-13', data: incompleteNoAck() },
	{ id: 'CPN-2026-0004', patientName: 'Williams, David', acknowledgedDate: '2026-06-15', data: incompleteConfig() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeForm(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		practiceName: s.data.practiceConfiguration.practiceName || '—',
		acknowledgedDate: s.acknowledgedDate,
		status: g.status,
		completenessPercent: g.completenessPercent,
		acknowledged: s.data.acknowledgmentSignature.agreed,
		flagCount: g.additionalFlags.length
	};
});
