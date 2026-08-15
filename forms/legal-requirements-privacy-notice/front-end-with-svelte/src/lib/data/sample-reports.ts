import type { AssessmentData } from '#lib/engine/types.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';
import { gradeForm } from '#lib/engine/grader.js';

/** A full sample acknowledgment record keyed by its dashboard id. */
export interface SampleAssessment {
	id: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the engine over a record. */
export interface DashboardRow {
	id: string;
	patientName: string;
	acknowledgedDate: string;
	agreed: boolean;
	status: 'Complete' | 'Incomplete';
	completeness: number;
	flagCount: number;
}

/** Build a sample record from the blank default plus the given overrides. */
function make(id: string, ack: Partial<AssessmentData['acknowledgment']>): SampleAssessment {
	const data = createDefaultAssessment();
	data.acknowledgment = { ...data.acknowledgment, ...ack };
	return { id, data };
}

/**
 * Roughly four full sample records spanning the Complete / Incomplete range,
 * including an unacknowledged record and a suspiciously short name (both of
 * which raise governance flags).
 */
export const sampleAssessments: SampleAssessment[] = [
	make('LRPN-2026-0001', {
		agreed: true,
		patientTypedFullName: 'Sarah Thompson',
		patientTypedDate: '2026-04-15'
	}),
	make('LRPN-2026-0002', {
		agreed: true,
		patientTypedFullName: 'James Wilson',
		patientTypedDate: '2026-04-14'
	}),
	make('LRPN-2026-0003', {
		agreed: false,
		patientTypedFullName: 'Catherine Davies',
		patientTypedDate: ''
	}),
	make('LRPN-2026-0004', {
		agreed: true,
		patientTypedFullName: 'J',
		patientTypedDate: '2026-04-12'
	})
];

/** Dashboard rows derived from the sample records via the shared engine. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const result = gradeForm(s.data);
	return {
		id: s.id,
		patientName: s.data.acknowledgment.patientTypedFullName || '(not given)',
		acknowledgedDate: s.data.acknowledgment.patientTypedDate || '',
		agreed: s.data.acknowledgment.agreed,
		status: result.status,
		completeness: result.completenessPercent,
		flagCount: result.additionalFlags.length
	};
});
