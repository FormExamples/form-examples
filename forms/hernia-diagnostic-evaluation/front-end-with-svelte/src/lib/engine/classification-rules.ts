// Hernia classification, red-flag screening, and urgency-band rules.
//
// The urgency band is computed red-flag-first: any positive red flag from
// step 8 forces `emergency` and is evaluated before the reducibility and
// symptom branches, so it can never be diluted or short-circuited by an
// otherwise reassuring examination. See doc/urgency-rules.md.
//
// Every function here is pure.

import type {
	EhsSizeGrade,
	FiredRule,
	HerniaDiagnosticEvaluation,
	HerniaType,
	InguinalSubtype,
	ReducibilityStatus,
	UrgencyBand
} from './types';
import { num, rule, titleCase } from './utils';

export interface ClassificationResult {
	herniaType: HerniaType;
	herniaSubtype: InguinalSubtype | 'not-applicable' | '';
	ehsClassification: string;
	ehsSizeGrade: EhsSizeGrade;
	firedRules: FiredRule[];
}

const EHS_SIZE_LABEL: Record<string, string> = {
	'1': 'grade 1 (< 2cm)',
	'2': 'grade 2 (2-4cm)',
	'3': 'grade 3 (> 4cm)'
};

/** Classify the hernia from step 9 (clinical classification). */
export function classifyHernia(data: HerniaDiagnosticEvaluation): ClassificationResult {
	const firedRules: FiredRule[] = [];
	const { herniaType, herniaTypeOther, inguinalSubtype, laterality, ehsSizeGrade } =
		data.classification;

	const herniaSubtype: InguinalSubtype | 'not-applicable' | '' =
		herniaType === 'inguinal' ? inguinalSubtype : herniaType ? 'not-applicable' : '';

	const typeLabel =
		herniaType === 'other' && herniaTypeOther ? herniaTypeOther : titleCase(herniaType);

	const parts: string[] = [];
	if (typeLabel) parts.push(typeLabel);
	if (herniaType === 'inguinal' && inguinalSubtype) parts.push(titleCase(inguinalSubtype));
	if (laterality) parts.push(titleCase(laterality));
	if (ehsSizeGrade) parts.push(`EHS ${EHS_SIZE_LABEL[ehsSizeGrade] ?? ehsSizeGrade}`);
	const ehsClassification = parts.join(', ');

	if (herniaType) {
		firedRules.push(
			rule(
				'R-CLASSIFICATION-TYPE',
				'classification',
				'hernia-type',
				null,
				'',
				'clinical classification',
				`Classified as ${ehsClassification || typeLabel}.`
			)
		);
	}
	if (ehsSizeGrade === '3') {
		firedRules.push(
			rule(
				'R-CLASSIFICATION-EHS-GRADE-3',
				'classification',
				'ehs-size-grade',
				null,
				'soon',
				'clinical classification',
				'European Hernia Society size grade 3 (> 4cm) contributes to the soon urgency band.'
			)
		);
	}

	return { herniaType, herniaSubtype, ehsClassification, ehsSizeGrade, firedRules };
}

export interface ReducibilityResult {
	status: ReducibilityStatus;
	firedRules: FiredRule[];
}

/** Carry through the clinician's step-7 reducibility judgement. */
export function assessReducibility(data: HerniaDiagnosticEvaluation): ReducibilityResult {
	const firedRules: FiredRule[] = [];
	const status = data.reducibility.reducibilityStatus;
	if (status === 'incarcerated') {
		firedRules.push(
			rule(
				'R-REDUCIBILITY-INCARCERATED',
				'reducibility',
				'status',
				null,
				'urgent',
				'reducibility',
				'The hernia is incarcerated.'
			)
		);
	} else if (status === 'irreducible') {
		firedRules.push(
			rule(
				'R-REDUCIBILITY-IRREDUCIBLE',
				'reducibility',
				'status',
				null,
				'urgent',
				'reducibility',
				'The hernia is irreducible.'
			)
		);
	}
	return { status, firedRules };
}

export interface RedFlagResult {
	anyRedFlag: boolean;
	positiveFlags: string[];
	firedRules: FiredRule[];
}

const RED_FLAG_LABELS: Record<string, string> = {
	redFlagSeverePain: 'severe pain out of proportion to examination',
	redFlagVomiting: 'vomiting',
	redFlagFever: 'fever',
	redFlagAbsoluteConstipation: 'absolute constipation with no passage of flatus',
	redFlagErythemaOrDiscolouration: 'erythema or skin discolouration over the hernia',
	redFlagPreviouslyReducibleNowIrreducible: 'a previously reducible hernia now irreducible',
	redFlagTachycardia: 'tachycardia'
};

/**
 * Screen the seven step-8 red flags. Any single positive answer sets
 * `anyRedFlag = true`; this is the sole gate that forces `emergency` in
 * `computeUrgency` below, independent of every other step.
 */
export function screenRedFlags(data: HerniaDiagnosticEvaluation): RedFlagResult {
	const firedRules: FiredRule[] = [];
	const positiveFlags: string[] = [];

	for (const [key, label] of Object.entries(RED_FLAG_LABELS)) {
		const value = (data.redFlags as unknown as Record<string, string>)[key];
		if (value === 'yes') {
			positiveFlags.push(label);
			// `key` is always `redFlag<Name>`; strip that prefix before
			// templating so the ID reads `R-RED-FLAG-<NAME>`, not the doubled
			// `R-RED-FLAG-RED-FLAG-<NAME>`.
			const suffix = key
				.slice('redFlag'.length)
				.replace(/([A-Z])/g, (m, _letter, offset) => (offset === 0 ? m : `-${m}`))
				.toUpperCase();
			firedRules.push(
				rule(
					`R-RED-FLAG-${suffix}`,
					'red-flag',
					key,
					null,
					'emergency',
					'red-flag screen',
					`Red flag positive: ${label}.`
				)
			);
		}
	}

	return { anyRedFlag: positiveFlags.length > 0, positiveFlags, firedRules };
}

export interface UrgencyResult {
	urgency: UrgencyBand;
	firedRules: FiredRule[];
}

/**
 * Compute the urgency band. Red-flag-first: `anyRedFlag` is checked before
 * every other branch, so a positive red flag always wins regardless of
 * reducibility or symptom severity.
 */
export function computeUrgency(
	data: HerniaDiagnosticEvaluation,
	reducibility: ReducibilityResult,
	redFlag: RedFlagResult
): UrgencyResult {
	const firedRules: FiredRule[] = [];
	const painScore = num(data.history.painScore0To10);
	const ehsSizeGrade = data.classification.ehsSizeGrade;

	if (redFlag.anyRedFlag) {
		firedRules.push(
			rule(
				'R-URGENCY-EMERGENCY-RED-FLAG',
				'composite',
				'urgency',
				null,
				'emergency',
				'urgency',
				`Emergency urgency: ${redFlag.positiveFlags.join(', ')}.`
			)
		);
		return { urgency: 'emergency', firedRules };
	}

	if (reducibility.status === 'incarcerated' || reducibility.status === 'irreducible') {
		firedRules.push(
			rule(
				'R-URGENCY-URGENT-REDUCIBILITY',
				'composite',
				'urgency',
				null,
				'urgent',
				'urgency',
				`Urgent urgency: the hernia is ${reducibility.status} with no red flags.`
			)
		);
		return { urgency: 'urgent', firedRules };
	}

	if ((painScore !== null && painScore > 4) || ehsSizeGrade === '3') {
		firedRules.push(
			rule(
				'R-URGENCY-SOON',
				'composite',
				'urgency',
				painScore,
				'soon',
				'urgency',
				painScore !== null && painScore > 4
					? `Soon urgency: pain score ${painScore}/10 in a reducible hernia.`
					: 'Soon urgency: European Hernia Society size grade 3.'
			)
		);
		return { urgency: 'soon', firedRules };
	}

	return { urgency: 'routine', firedRules };
}
