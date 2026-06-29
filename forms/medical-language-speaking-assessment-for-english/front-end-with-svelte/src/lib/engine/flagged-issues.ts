import type { AssessmentData, AdditionalFlag } from './types';
import { linguisticTotal, communicationTotal, rawToScore, scoreToGrade } from './utils';

/**
 * Detects eligibility and quality flags the assessment lead should review,
 * independent of the criterion-by-criterion grading. These cover registration
 * eligibility, borderline results, patient-safety communication gaps, and
 * incomplete test administration.
 */
export function detectAdditionalFlags(data: AssessmentData): AdditionalFlag[] {
	const flags: AdditionalFlag[] = [];

	const ling = linguisticTotal(data.linguisticCriteria);
	const comm = communicationTotal(data.clinicalCommunication);
	const score = rawToScore(ling + comm);
	const grade = scoreToGrade(score);

	// ─── Below registration threshold (HIGH) ────────────────────
	if (grade === 'C+' || grade === 'C' || grade === 'D' || grade === 'E') {
		flags.push({
			id: 'FLAG-REG-001',
			category: 'Registration',
			message: `Grade ${grade} (${score}/500) is below the Grade B threshold required by most UK healthcare regulators`,
			priority: 'high'
		});
	}

	// ─── Borderline result (MEDIUM) ─────────────────────────────
	if (score >= 330 && score < 360) {
		flags.push({
			id: 'FLAG-BORDER-001',
			category: 'Result',
			message: `Borderline score (${score}/500) close to the Grade B boundary — consider re-marking or a re-sit`,
			priority: 'medium'
		});
	}

	// ─── Information-giving deficient (HIGH, patient safety) ─────
	if (data.clinicalCommunication.informationGiving === 0) {
		flags.push({
			id: 'FLAG-SAFETY-GIV-001',
			category: 'Patient safety',
			message: 'Information-giving deficient — patient may leave without understanding diagnosis or management',
			priority: 'high'
		});
	}

	// ─── Information-gathering deficient (HIGH, patient safety) ──
	if (data.clinicalCommunication.informationGathering === 0) {
		flags.push({
			id: 'FLAG-SAFETY-GAT-001',
			category: 'Patient safety',
			message: 'Information-gathering deficient — key clinical history may be missed',
			priority: 'high'
		});
	}

	// ─── Intelligibility severely impaired (HIGH) ───────────────
	if (
		data.linguisticCriteria.intelligibility !== null &&
		data.linguisticCriteria.intelligibility <= 2
	) {
		flags.push({
			id: 'FLAG-INT-001',
			category: 'Linguistic',
			message: 'Intelligibility severely impaired — pronunciation may compromise safe clinical communication',
			priority: 'high'
		});
	}

	// ─── Role-play 1 not completed (MEDIUM) ─────────────────────
	if (data.rolePlay1.completed === 'no') {
		flags.push({
			id: 'FLAG-RP1-001',
			category: 'Administration',
			message: 'Role-play 1 (patient interview) was not completed',
			priority: 'medium'
		});
	}

	// ─── Role-play 2 not completed (MEDIUM) ─────────────────────
	if (data.rolePlay2.completed === 'no') {
		flags.push({
			id: 'FLAG-RP2-001',
			category: 'Administration',
			message: 'Role-play 2 (clinical explanation) was not completed',
			priority: 'medium'
		});
	}

	// ─── Distinction (LOW, informational) ───────────────────────
	if (grade === 'A') {
		flags.push({
			id: 'FLAG-DIST-001',
			category: 'Result',
			message: `Grade A (${score}/500) — high-level professional proficiency`,
			priority: 'low'
		});
	}

	// Sort: high > medium > low
	const priorityOrder = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
