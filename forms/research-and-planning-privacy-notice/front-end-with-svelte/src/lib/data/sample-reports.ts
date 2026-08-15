import type { AssessmentData } from '#lib/engine/types.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';
import { gradeForm } from '#lib/engine/grader.js';

/** A full sample acknowledgement record keyed by its dashboard id. */
export interface SampleAssessment {
	id: string;
	data: AssessmentData;
}

/** A row in the governance dashboard, derived by running the engine over a record. */
export interface DashboardRow {
	id: string;
	organisationName: string;
	recipientName: string;
	acknowledgedDate: string;
	agreed: boolean;
	type1OptOut: string;
	nationalDataOptOut: string;
	status: 'Complete' | 'Incomplete';
	completeness: number;
	flagCount: number;
}

/** Build a sample record from the blank default plus the given overrides. */
function make(
	id: string,
	rd: Partial<AssessmentData['recipientDetails']>,
	ack: Partial<AssessmentData['acknowledgementSignature']>
): SampleAssessment {
	const data = createDefaultAssessment();
	data.recipientDetails = { ...data.recipientDetails, ...rd };
	data.acknowledgementSignature = { ...data.acknowledgementSignature, ...ack };
	return { id, data };
}

/**
 * Roughly four full sample records spanning the Complete / Incomplete range,
 * including an unacknowledged record, an opt-out record, and a suspiciously
 * short name (all of which raise governance flags).
 */
export const sampleAssessments: SampleAssessment[] = [
	make(
		'RPPN-2026-0001',
		{ organisationName: 'Riverside Medical Practice', recipientName: 'Mrs Jane Smith' },
		{
			agreed: true,
			type1OptOut: 'opt-in',
			nationalDataOptOut: 'opt-in',
			recipientTypedFullName: 'Jane Smith',
			recipientTypedDate: '2026-04-15'
		}
	),
	make(
		'RPPN-2026-0002',
		{ organisationName: 'Oakwood Health Centre', recipientName: 'Mr David Okafor' },
		{
			agreed: true,
			type1OptOut: 'opt-out',
			nationalDataOptOut: 'opt-out',
			recipientTypedFullName: 'David Okafor',
			recipientTypedDate: '2026-04-14'
		}
	),
	make(
		'RPPN-2026-0003',
		{ organisationName: 'Meadow Lane Surgery', recipientName: 'Ms Catherine Davies' },
		{
			agreed: false,
			type1OptOut: '',
			nationalDataOptOut: '',
			recipientTypedFullName: 'Catherine Davies',
			recipientTypedDate: ''
		}
	),
	make(
		'RPPN-2026-0004',
		{ organisationName: 'Hillside Practice', recipientName: 'Mr John Brown' },
		{
			agreed: true,
			type1OptOut: 'opt-in',
			nationalDataOptOut: 'opt-out',
			recipientTypedFullName: 'J',
			recipientTypedDate: '2026-04-12'
		}
	)
];

/** Dashboard rows derived from the sample records via the shared engine. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const result = gradeForm(s.data);
	const ack = s.data.acknowledgementSignature;
	return {
		id: s.id,
		organisationName: s.data.recipientDetails.organisationName || '(not given)',
		recipientName: s.data.recipientDetails.recipientName || '(not given)',
		acknowledgedDate: ack.recipientTypedDate || '',
		agreed: ack.agreed,
		type1OptOut: ack.type1OptOut || '',
		nationalDataOptOut: ack.nationalDataOptOut || '',
		status: result.status,
		completeness: result.completenessPercent,
		flagCount: result.additionalFlags.length
	};
});
