import type { AssessmentData, FlaggedIssue } from './types';
import {
	hasAnyAirwayIntervention,
	hasAnyMajorBleedingIntervention,
	hasNonTourniquetBleedingIntervention,
	hasText,
	isAssessmentAnswered
} from './utils';

/**
 * Detect clinically significant flags for the WHO Emergency First Aid form.
 *
 * These are independent of pure completeness — for example, the patient may
 * have a major bleeding finding without an intervention, or a tourniquet may
 * have been applied without recording the time. Flags are sorted urgent →
 * high → medium → low for display in the report.
 */
export function detectFlaggedIssues(data: AssessmentData): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	// ─── Major bleeding without any intervention (urgent) ─────
	if (
		!data.majorBleeding.assessmentNormal &&
		hasText(data.majorBleeding.assessmentFindings) &&
		!hasAnyMajorBleedingIntervention(data.majorBleeding)
	) {
		flags.push({
			id: 'FLAG-MB-001',
			category: 'Major Bleeding',
			message:
				'Major bleeding findings recorded with no intervention applied — escalate immediately.',
			priority: 'urgent'
		});
	}

	// ─── Tourniquet applied without time (urgent) ─────────────
	if (
		data.majorBleeding.interventions.tourniquet &&
		!hasText(data.majorBleeding.interventions.tourniquetApplicationTime)
	) {
		flags.push({
			id: 'FLAG-MB-002',
			category: 'Major Bleeding',
			message:
				'Tourniquet applied but time of application not recorded — required for safe handover.',
			priority: 'urgent'
		});
	}

	// ─── Tourniquet applied without other bleeding control (high)
	if (
		data.majorBleeding.interventions.tourniquet &&
		!hasNonTourniquetBleedingIntervention(data.majorBleeding)
	) {
		flags.push({
			id: 'FLAG-MB-003',
			category: 'Major Bleeding',
			message:
				'Tourniquet applied without prior direct pressure or wound packing documented — confirm clinical justification.',
			priority: 'high'
		});
	}

	// ─── Airway abnormal but no airway intervention (urgent) ──
	if (
		!data.airway.assessmentNormal &&
		hasText(data.airway.assessmentFindings) &&
		!hasAnyAirwayIntervention(data.airway)
	) {
		flags.push({
			id: 'FLAG-AW-001',
			category: 'Airway',
			message:
				'Abnormal airway findings recorded with no intervention applied — escalate immediately.',
			priority: 'urgent'
		});
	}

	// ─── Airway intervention without confirmation (high) ──────
	if (
		(data.airway.interventions.headTiltChinLift ||
			data.airway.interventions.jawThrust ||
			data.airway.interventions.chokingCare) &&
		data.airway.assessmentNormal &&
		!hasText(data.airway.assessmentFindings)
	) {
		flags.push({
			id: 'FLAG-AW-002',
			category: 'Airway',
			message:
				'Airway intervention recorded but assessment marked Normal with no findings — confirm clinical reasoning.',
			priority: 'high'
		});
	}

	// ─── Pregnancy declared (high) ────────────────────────────
	if (data.situation.pregnant === 'yes') {
		flags.push({
			id: 'FLAG-PR-001',
			category: 'Pregnancy',
			message: 'Patient is pregnant — alert receiving facility and prioritise transport.',
			priority: 'high'
		});
	}

	// ─── Highly infectious disease precaution (high) ──────────
	if (data.recommendations.precautions.highlyInfectiousDisease) {
		flags.push({
			id: 'FLAG-PC-001',
			category: 'Precautions',
			message:
				'Highly infectious disease precaution flagged — apply isolation procedures and warn receiving team.',
			priority: 'high'
		});
	}

	// ─── Spinal immobilization precaution (high) ──────────────
	if (data.recommendations.precautions.spinalImmobilization) {
		flags.push({
			id: 'FLAG-PC-002',
			category: 'Precautions',
			message:
				'Spinal immobilization required — maintain alignment throughout transport.',
			priority: 'high'
		});
	}

	// ─── Possible fracture precaution (medium) ────────────────
	if (data.recommendations.precautions.possibleFracture) {
		flags.push({
			id: 'FLAG-PC-003',
			category: 'Precautions',
			message: 'Possible fracture flagged — splint and minimise movement.',
			priority: 'medium'
		});
	}

	// ─── Altered mental status precaution (high) ──────────────
	if (data.recommendations.precautions.alteredMentalStatus) {
		flags.push({
			id: 'FLAG-PC-004',
			category: 'Precautions',
			message:
				'Altered mental status flagged — monitor airway and neurological status closely.',
			priority: 'high'
		});
	}

	// ─── Fall risk precaution (medium) ────────────────────────
	if (data.recommendations.precautions.fallRisk) {
		flags.push({
			id: 'FLAG-PC-005',
			category: 'Precautions',
			message: 'Fall risk flagged — ensure assisted transfers.',
			priority: 'medium'
		});
	}

	// ─── Breathing abnormal documented (medium) ───────────────
	if (
		!data.breathing.assessmentNormal &&
		hasText(data.breathing.assessmentFindings) &&
		isAssessmentAnswered(data.breathing)
	) {
		flags.push({
			id: 'FLAG-BR-001',
			category: 'Breathing',
			message: 'Abnormal breathing findings recorded — clinician review on handover.',
			priority: 'medium'
		});
	}

	// ─── Disability abnormal documented (medium) ──────────────
	if (
		!data.disability.assessmentNormal &&
		hasText(data.disability.assessmentFindings)
	) {
		flags.push({
			id: 'FLAG-DS-001',
			category: 'Disability',
			message: 'Abnormal neurological findings recorded — clinician review on handover.',
			priority: 'medium'
		});
	}

	// ─── Glucose given (low) ──────────────────────────────────
	if (data.disability.interventions.glucoseGiven) {
		flags.push({
			id: 'FLAG-DS-002',
			category: 'Disability',
			message: 'Glucose administered — record blood glucose and monitor for response.',
			priority: 'low'
		});
	}

	// ─── Drowning care (medium) ───────────────────────────────
	if (data.exposure.interventions.drowningCare) {
		flags.push({
			id: 'FLAG-EX-001',
			category: 'Exposure',
			message:
				'Drowning care administered — risk of secondary drowning, monitor for respiratory deterioration.',
			priority: 'medium'
		});
	}

	// ─── Snakebite care (medium) ──────────────────────────────
	if (data.exposure.interventions.snakebiteCare) {
		flags.push({
			id: 'FLAG-EX-002',
			category: 'Exposure',
			message: 'Snakebite care administered — antivenom may be required at facility.',
			priority: 'medium'
		});
	}

	// Sort: urgent > high > medium > low (stable for ties)
	const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
