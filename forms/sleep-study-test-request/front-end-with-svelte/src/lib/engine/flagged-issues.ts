import type { SleepStudyRequest, Flag, FlagPriority } from './types';
import { EPWORTH_ABNORMAL, EPWORTH_SEVERE } from './constants';

function epworthValue(r: SleepStudyRequest): number | null {
	const v = r.scores.epworthScore;
	if (v === null || v === undefined) return null;
	return Number(v);
}

/**
 * Detects safety-critical flags independently of the four axes. Flag categories
 * mirror the SQL grade_flag CHECK constraint. Flags are returned sorted
 * high → medium → low priority. Flag IDs are stable and identical across every
 * front-end and the back-end.
 */
export function detectFlags(r: SleepStudyRequest): Flag[] {
	const flags: Flag[] = [];
	const epworth = epworthValue(r);

	// ─── occupational-driver-osa ───
	if (
		r.symptoms.occupationalDriver === true &&
		((epworth !== null && epworth >= EPWORTH_ABNORMAL) ||
			r.request.primaryIndication === 'suspected-osa' ||
			r.request.primaryIndication === 'driver-assessment')
	) {
		flags.push({
			flagId: 'F-OCCUPATIONAL-DRIVER-OSA-001',
			category: 'occupational-driver-osa',
			priority: 'high',
			description:
				'Occupational / vocational driver with suspected or confirmed OSA-related sleepiness.',
			suggestedAction:
				'Fast-track vocational-driver assessment; advise on DVLA notification and fitness to drive.'
		});
	}

	// ─── severe-daytime-sleepiness ───
	if (epworth !== null && epworth >= EPWORTH_SEVERE) {
		flags.push({
			flagId: 'F-SEVERE-DAYTIME-SLEEPINESS-001',
			category: 'severe-daytime-sleepiness',
			priority: 'high',
			description: `Severe excessive daytime sleepiness (Epworth ${epworth} ≥ ${EPWORTH_SEVERE}).`,
			suggestedAction:
				'Prioritise the study; counsel on driving and operating machinery pending assessment.'
		});
	}

	// ─── suspected-narcolepsy ───
	if (r.request.primaryIndication === 'suspected-narcolepsy') {
		flags.push({
			flagId: 'F-SUSPECTED-NARCOLEPSY-001',
			category: 'suspected-narcolepsy',
			priority: 'medium',
			description: 'Suspected narcolepsy / central hypersomnolence.',
			suggestedAction:
				'Route to the MSLT pathway with preceding polysomnography; consider sleep-medicine referral.'
		});
	}

	// ─── missing-epworth ───
	if (epworth === null) {
		flags.push({
			flagId: 'F-MISSING-EPWORTH-001',
			category: 'missing-epworth',
			priority: 'medium',
			description: 'No Epworth Sleepiness Scale score recorded.',
			suggestedAction: 'Record the Epworth score; it drives priority, triage, and DVLA decisions.'
		});
	}

	// ─── missing-indication ───
	if (!r.request.primaryIndication) {
		flags.push({
			flagId: 'F-MISSING-INDICATION-001',
			category: 'missing-indication',
			priority: 'medium',
			description: 'No primary clinical indication recorded.',
			suggestedAction: 'Query the referrer for the clinical indication before vetting.'
		});
	}

	// ─── missing-clinical-question ───
	if (r.request.clinicalQuestion.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-CLINICAL-QUESTION-001',
			category: 'missing-clinical-question',
			priority: 'low',
			description: 'No specific clinical question recorded.',
			suggestedAction: 'Query the referrer for the specific question the study should answer.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
