import type { StressTestRequest, Flag, FlagPriority } from './types';
import { isExerciseTest } from './utils';

/**
 * Detect safety-critical flags independently of the four axes. Flag categories
 * mirror the form's grade_flag table: recent-acs-contraindication,
 * severe-aortic-stenosis, uncontrolled-hypertension, unable-to-exercise,
 * missing-indication, missing-clinical-question, other. Flag IDs are stable and
 * identical across every front-end and the back-end. Returned sorted
 * high → medium → low priority.
 */
export function detectFlags(data: StressTestRequest): Flag[] {
	const flags: Flag[] = [];

	// --- Absolute / safety-critical contraindications -------------------
	if (data.safety.recentAcuteCoronarySyndrome === true) {
		flags.push({
			flagId: 'F-RECENT-ACS-CONTRAINDICATION-001',
			category: 'recent-acs-contraindication',
			priority: 'high',
			description: 'Recent acute coronary syndrome reported.',
			suggestedAction:
				'Do not stress test until clinically stabilised; arrange emergency cardiology review.'
		});
	}
	if (data.safety.aorticStenosis === 'severe') {
		flags.push({
			flagId: 'F-SEVERE-AORTIC-STENOSIS-001',
			category: 'severe-aortic-stenosis',
			priority: 'high',
			description: 'Severe (symptomatic) aortic stenosis reported.',
			suggestedAction:
				'Exercise testing contraindicated; refer for coronary angiography / valve assessment instead.'
		});
	}

	// --- Relative contraindications -------------------------------------
	if (data.safety.uncontrolledHypertension === true) {
		flags.push({
			flagId: 'F-UNCONTROLLED-HYPERTENSION-001',
			category: 'uncontrolled-hypertension',
			priority: 'medium',
			description: 'Uncontrolled hypertension reported.',
			suggestedAction: 'Relative contraindication; control blood pressure before stress testing.'
		});
	}
	if (isExerciseTest(data.request.testType) && data.symptoms.ableToExercise !== true) {
		flags.push({
			flagId: 'F-UNABLE-TO-EXERCISE-001',
			category: 'unable-to-exercise',
			priority: 'medium',
			description: 'Exercise test requested but patient is unable to exercise.',
			suggestedAction:
				'Redirect to a pharmacological / imaging modality (e.g. dobutamine stress echo or perfusion imaging).'
		});
	}

	// --- Completeness / data-quality flags ------------------------------
	if (!data.request.primaryIndication) {
		flags.push({
			flagId: 'F-MISSING-INDICATION-001',
			category: 'missing-indication',
			priority: 'medium',
			description: 'No primary clinical indication recorded.',
			suggestedAction: 'Query the referrer for the clinical indication before vetting.'
		});
	}
	if (!data.request.clinicalQuestion || data.request.clinicalQuestion.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-CLINICAL-QUESTION-001',
			category: 'missing-clinical-question',
			priority: 'medium',
			description: 'No specific clinical question recorded.',
			suggestedAction: 'Query the referrer for the specific question the test should answer.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
