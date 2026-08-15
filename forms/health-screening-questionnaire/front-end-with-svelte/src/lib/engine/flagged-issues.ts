// Safety-flag detection.
//
// Flags fire independently of the composite risk band and are never
// suppressed by an assessor override of the final risk band — see
// doc/safety-case-notes.md hazard H-05. Flag IDs are stable and identical
// across every front-end and the back-end.

import type { AuditCBand, HealthScreeningQuestionnaire, AdditionalFlag, FlagCategory, FlagPriority, ParqPlusClearance } from './types';
import { num } from './utils';

export interface FlagContext {
	parqPlusClearance: ParqPlusClearance;
	auditCScore: number | null;
	auditCBand: AuditCBand;
	age: number | null;
}

/** Detect safety flags for a health screening questionnaire, most severe first. */
export function detectFlags(data: HealthScreeningQuestionnaire, context: FlagContext): AdditionalFlag[] {
	const flags: AdditionalFlag[] = [];
	const push = (
		flagId: string,
		category: FlagCategory,
		priority: FlagPriority,
		description: string,
		suggestedAction: string
	) => flags.push({ flagId, category, priority, description, suggestedAction });

	const { parqPlusClearance, auditCScore, auditCBand, age } = context;
	const s = data.symptoms;

	// --- Urgent cardiac symptoms --------------------------------------------
	if (s.symptomUnexplainedChestPain === 'yes' || s.symptomDizzySpellsOrFainting === 'yes') {
		const which = [
			s.symptomUnexplainedChestPain === 'yes' ? 'unexplained chest pain' : null,
			s.symptomDizzySpellsOrFainting === 'yes' ? 'dizzy spells or fainting' : null
		]
			.filter((v): v is string => v !== null)
			.join(' and ');
		push(
			'F-URGENT-CARDIAC-SYMPTOM-001',
			'urgent-cardiac-symptom',
			'high',
			`${which[0].toUpperCase()}${which.slice(1)} reported — this needs same-day medical attention, not a routine screening pathway.`,
			'Do not proceed with the activity or role. Seek same-day medical review (GP, urgent care, or emergency department as appropriate).'
		);
	}

	// --- PAR-Q+ ---------------------------------------------------------------
	if (parqPlusClearance === 'further-assessment-required') {
		push(
			'F-PARQ-POSITIVE-MEDICAL-CLEARANCE-NEEDED-001',
			'parq-positive-medical-clearance-needed',
			'medium',
			'At least one PAR-Q+ general health item is yes.',
			'Seek clearance from a qualified exercise professional or a GP before starting an exercise programme. This form does not reproduce the full PAR-Q+ condition-specific supplementary questionnaires — see spec/index.md.'
		);
	}

	// --- Alcohol ---------------------------------------------------------------
	if (auditCBand === 'higher-risk') {
		push(
			'F-ALCOHOL-HIGHER-RISK-001',
			'alcohol-higher-risk',
			'high',
			`AUDIT-C score ${auditCScore} of 12 indicates higher-risk drinking.`,
			'Offer a brief intervention and refer to alcohol services.'
		);
	}

	// --- Family history ----------------------------------------------------
	if (data.familyHistory.familyHistoryPrematureCardiacEvent === 'yes') {
		push(
			'F-FAMILY-HISTORY-PREMATURE-CARDIAC-EVENT-001',
			'family-history-premature-cardiac-event',
			'medium',
			'A first-degree relative had a premature (before age 60) heart attack or stroke.',
			'Consider cardiovascular risk assessment (for example QRISK3) alongside this screen.'
		);
	}

	// --- Unexplained weight loss ---------------------------------------------
	if (s.symptomUnexplainedWeightLoss === 'yes') {
		push(
			'F-UNEXPLAINED-WEIGHT-LOSS-001',
			'unexplained-weight-loss',
			'medium',
			'Unexplained weight loss is reported.',
			'This alone warrants GP review regardless of other findings — refer for further assessment.'
		);
	}

	// --- Occupational restriction ---------------------------------------------
	const o = data.occupational;
	const heavyRole = o.physicalDemandsOfRole === 'heavy' || o.physicalDemandsOfRole === 'moderate';
	const activityBelowRole =
		data.activityDiet.usualActivityLevel === 'sedentary' || data.activityDiet.usualActivityLevel === 'light';
	if (
		data.context.screeningPurpose === 'occupational-pre-placement' &&
		heavyRole &&
		(activityBelowRole || s.symptomJointPainRestrictingMovement === 'yes')
	) {
		push(
			'F-OCCUPATIONAL-RESTRICTION-INDICATED-001',
			'occupational-restriction-indicated',
			'low',
			`The physical demands of the role (${o.physicalDemandsOfRole}) exceed what the current activity level or joint findings suggest is safe.`,
			'Consider an occupational-health functional assessment or a phased return before full role placement.'
		);
	}

	// --- Vaccination ---------------------------------------------------------
	if (data.vaccination.vaccinationUpToDate === 'no' || data.vaccination.vaccinationUpToDate === 'unsure') {
		push(
			'F-VACCINATION-GAP-001',
			'vaccination-gap',
			'low',
			data.vaccination.vaccinationGapsNote || 'Vaccination status is not confirmed up to date.',
			'Signpost to the GP practice or occupational-health service to review and complete the vaccination schedule.'
		);
	}

	// --- Paediatric ---------------------------------------------------------
	if (age !== null && age < 16) {
		push(
			'F-PAEDIATRIC-001',
			'paediatric',
			'high',
			`The respondent is ${age} years old; PAR-Q+ and AUDIT-C are not validated below 16 years.`,
			'Redirect to a paediatric-specific health-screening pathway. Treat the scores on this report as invalid.'
		);
	}

	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	return flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
