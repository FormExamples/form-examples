import type { AssessmentData } from '#lib/engine/types.js';
import { calculateNoticeGrade } from '#lib/engine/notice-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample notice: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	recipientName: string;
	acknowledgedDate: string;
	data: AssessmentData;
}

/** A row in the compliance dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	recipientName: string;
	organisationName: string;
	acknowledgedDate: string;
	status: 'Complete' | 'Incomplete';
	completenessPercent: number;
	agreed: boolean;
	flagCount: number;
}

/** A fully completed, acknowledged notice. */
function complete(): AssessmentData {
	const d = createDefaultAssessment();
	d.recipientDetails = {
		organisationName: 'Riverside Medical Practice',
		recipientName: 'Dr Jane Smith',
		recipientRole: 'General Practitioner',
		recipientEmployeeId: '4827'
	};
	d.acknowledgementSignature = {
		agreed: true,
		recipientTypedFullName: 'Jane Smith',
		recipientTypedDate: '2026-06-10'
	};
	return d;
}

/** A complete notice where the acknowledgement checkbox was left unticked. */
function notAcknowledged(): AssessmentData {
	const d = createDefaultAssessment();
	d.recipientDetails = {
		organisationName: 'Northgate Community Hospital',
		recipientName: 'Aaron Clarke',
		recipientRole: 'Healthcare Assistant',
		recipientEmployeeId: '1190'
	};
	d.acknowledgementSignature = {
		agreed: false,
		recipientTypedFullName: 'Aaron Clarke',
		recipientTypedDate: '2026-06-12'
	};
	return d;
}

/** A partially completed notice: missing role and a too-short typed name. */
function partial(): AssessmentData {
	const d = createDefaultAssessment();
	d.recipientDetails = {
		organisationName: 'Lakeside Clinic',
		recipientName: 'Priya Patel',
		recipientRole: '',
		recipientEmployeeId: ''
	};
	d.acknowledgementSignature = {
		agreed: true,
		recipientTypedFullName: 'P',
		recipientTypedDate: '2026-06-15'
	};
	return d;
}

/** A barely started notice: organisation only, nothing acknowledged. */
function empty(): AssessmentData {
	const d = createDefaultAssessment();
	d.recipientDetails = {
		organisationName: 'Meadow View Surgery',
		recipientName: '',
		recipientRole: '',
		recipientEmployeeId: ''
	};
	return d;
}

/** The sample notices, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'CC-2026-0001', recipientName: 'Smith, Jane', acknowledgedDate: '2026-06-10', data: complete() },
	{ id: 'CC-2026-0002', recipientName: 'Clarke, Aaron', acknowledgedDate: '2026-06-12', data: notAcknowledged() },
	{ id: 'CC-2026-0003', recipientName: 'Patel, Priya', acknowledgedDate: '2026-06-15', data: partial() },
	{ id: 'CC-2026-0004', recipientName: 'Meadow View Surgery', acknowledgedDate: '2026-06-18', data: empty() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateNoticeGrade(s.data);
	return {
		id: s.id,
		recipientName: s.recipientName,
		organisationName: s.data.recipientDetails.organisationName,
		acknowledgedDate: s.acknowledgedDate,
		status: g.status,
		completenessPercent: g.completenessPercent,
		agreed: s.data.acknowledgementSignature.agreed,
		flagCount: g.additionalFlags.length
	};
});
