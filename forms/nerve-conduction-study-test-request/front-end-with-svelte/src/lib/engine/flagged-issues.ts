import type { NerveConductionStudyRequest, Flag, FlagPriority } from './types';
import { involvesNeedleEmg } from './utils';

/**
 * Detects safety-critical flags independently of the four axes. Flag categories
 * mirror the sql grade-flag CHECK constraint:
 * suspected-mnd-urgent, anticoag-emg-bleeding-risk, pacemaker-stimulation-caution,
 * missing-indication, missing-clinical-question, other. Flags are returned
 * sorted high → medium → low priority. Flag IDs are stable across every
 * front-end and the back-end.
 */
export function detectFlags(r: NerveConductionStudyRequest): Flag[] {
	const flags: Flag[] = [];

	// ─── Suspected motor neurone disease (expedite) ───
	if (r.request.primaryIndication === 'suspected-motor-neurone-disease') {
		flags.push({
			flagId: 'F-SUSPECTED-MND-URGENT-001',
			category: 'suspected-mnd-urgent',
			priority: 'high',
			description: 'Suspected motor neurone disease.',
			suggestedAction:
				'Expedite as an urgent neurophysiology slot; early electrodiagnostic confirmation changes management and access to disease-modifying therapy.'
		});
	}

	// ─── Needle EMG bleeding risk while anticoagulated ───
	if (involvesNeedleEmg(r.study.studyType) && r.safety.takingAnticoagulant === true) {
		flags.push({
			flagId: 'F-ANTICOAG-EMG-BLEEDING-RISK-001',
			category: 'anticoag-emg-bleeding-risk',
			priority: 'high',
			description: 'Needle EMG requested in an anticoagulated patient.',
			suggestedAction:
				'Review anticoagulation and INR before needle EMG; consider limiting needling, deferring, or a nerve-conduction-only study.'
		});
	}

	// ─── Pacemaker / ICD stimulation caution ───
	if (r.safety.pacemakerOrIcd === true) {
		flags.push({
			flagId: 'F-PACEMAKER-STIMULATION-CAUTION-001',
			category: 'pacemaker-stimulation-caution',
			priority: 'medium',
			description: 'Pacemaker or implantable cardioverter-defibrillator present.',
			suggestedAction:
				'Apply stimulation-technique caution; avoid stimulating near the device and over the chest; follow local cardiac-device protocol.'
		});
	}

	// ─── Completeness / data-quality flags ───
	if (!r.request.primaryIndication) {
		flags.push({
			flagId: 'F-MISSING-INDICATION-001',
			category: 'missing-indication',
			priority: 'medium',
			description: 'No primary clinical indication recorded.',
			suggestedAction: 'Query the referrer for the clinical indication before vetting.'
		});
	}
	if (r.request.clinicalQuestion.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-CLINICAL-QUESTION-001',
			category: 'missing-clinical-question',
			priority: 'medium',
			description: 'No specific clinical question recorded.',
			suggestedAction: 'Query the referrer for the specific question the study should answer.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
