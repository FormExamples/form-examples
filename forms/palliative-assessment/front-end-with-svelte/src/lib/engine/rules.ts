import type { AssessmentData, ESASSymptomKey, PalliativeRule } from './types';

/**
 * Declarative rule set for the Palliative Assessment.
 *
 * The rules array contains:
 *   - 10 ESAS-r symptom rules (PALL-ESAS-001 … PALL-ESAS-010), each returning
 *     the patient's 0-10 intensity for that symptom (or 0 if unanswered, so the
 *     grader can exclude it from the total and the answered count).
 *   - Ancillary palliative-care rules (PALL-ANC-*) covering uncontrolled severe
 *     symptoms, low performance status, missing DNACPR for end-of-life patients,
 *     missing core ACP documents, and carer overwhelm.
 *
 * Each rule is a pure function of `AssessmentData`. Returning `0` means
 * "not fired"; positive values are item-specific intensities (ESAS) or flag
 * scores (ancillary).
 */

/** @returns 0-10 score, or 0 if unanswered/invalid. */
function esasValue(d: AssessmentData, key: ESASSymptomKey): number {
	const v = d.esasrSymptoms[key];
	if (v === null || v === undefined) return 0;
	if (typeof v !== 'number') return 0;
	if (Number.isNaN(v)) return 0;
	return Math.max(0, Math.min(10, v));
}

/** Lowest non-null performance-status value (PPS / AKPS), or Infinity. */
function lowestPerformanceStatus(d: AssessmentData): number {
	const candidates = [d.performanceStatus.ppsScore, d.performanceStatus.akpsScore].filter(
		(v): v is number => v !== null && v !== undefined
	);
	if (!candidates.length) return Infinity;
	return Math.min(...candidates);
}

const ESAS_KEYS: ESASSymptomKey[] = [
	'pain',
	'tiredness',
	'drowsiness',
	'nausea',
	'lackOfAppetite',
	'shortnessOfBreath',
	'depression',
	'anxiety',
	'wellbeing',
	'other'
];

export const rules: PalliativeRule[] = [
	{
		id: 'PALL-ESAS-001',
		category: 'Pain',
		description: 'Pain intensity (ESAS-r 0-10).',
		kind: 'esas',
		symptomKey: 'pain',
		evaluate: (d) => esasValue(d, 'pain')
	},
	{
		id: 'PALL-ESAS-002',
		category: 'Tiredness',
		description: 'Tiredness / lack of energy (ESAS-r 0-10).',
		kind: 'esas',
		symptomKey: 'tiredness',
		evaluate: (d) => esasValue(d, 'tiredness')
	},
	{
		id: 'PALL-ESAS-003',
		category: 'Drowsiness',
		description: 'Drowsiness / feeling sleepy (ESAS-r 0-10).',
		kind: 'esas',
		symptomKey: 'drowsiness',
		evaluate: (d) => esasValue(d, 'drowsiness')
	},
	{
		id: 'PALL-ESAS-004',
		category: 'Nausea',
		description: 'Nausea (ESAS-r 0-10).',
		kind: 'esas',
		symptomKey: 'nausea',
		evaluate: (d) => esasValue(d, 'nausea')
	},
	{
		id: 'PALL-ESAS-005',
		category: 'Lack of Appetite',
		description: 'Lack of appetite (ESAS-r 0-10).',
		kind: 'esas',
		symptomKey: 'lackOfAppetite',
		evaluate: (d) => esasValue(d, 'lackOfAppetite')
	},
	{
		id: 'PALL-ESAS-006',
		category: 'Shortness of Breath',
		description: 'Shortness of breath / dyspnoea (ESAS-r 0-10).',
		kind: 'esas',
		symptomKey: 'shortnessOfBreath',
		evaluate: (d) => esasValue(d, 'shortnessOfBreath')
	},
	{
		id: 'PALL-ESAS-007',
		category: 'Depression',
		description: 'Depression / feeling sad (ESAS-r 0-10).',
		kind: 'esas',
		symptomKey: 'depression',
		evaluate: (d) => esasValue(d, 'depression')
	},
	{
		id: 'PALL-ESAS-008',
		category: 'Anxiety',
		description: 'Anxiety / feeling nervous (ESAS-r 0-10).',
		kind: 'esas',
		symptomKey: 'anxiety',
		evaluate: (d) => esasValue(d, 'anxiety')
	},
	{
		id: 'PALL-ESAS-009',
		category: 'Wellbeing',
		description: 'Overall wellbeing (ESAS-r 0-10; higher = worse).',
		kind: 'esas',
		symptomKey: 'wellbeing',
		evaluate: (d) => esasValue(d, 'wellbeing')
	},
	{
		id: 'PALL-ESAS-010',
		category: 'Other Symptom',
		description: 'Other symptom (e.g. constipation, sleep, itch) (ESAS-r 0-10).',
		kind: 'esas',
		symptomKey: 'other',
		evaluate: (d) => esasValue(d, 'other')
	},

	// ─── Ancillary palliative-care rules ────────────────────────────────
	{
		id: 'PALL-ANC-001',
		category: 'Uncontrolled Severe Symptom',
		description: 'At least one ESAS-r symptom is severe (>= 7).',
		kind: 'ancillary',
		evaluate: (d) => {
			let max = 0;
			for (const k of ESAS_KEYS) {
				const v = esasValue(d, k);
				if (v >= 7 && v > max) max = v;
			}
			return max;
		}
	},
	{
		id: 'PALL-ANC-002',
		category: 'Performance Status',
		description: 'PPS or AKPS <= 30 — patient is largely bed-bound.',
		kind: 'ancillary',
		evaluate: (d) => {
			const lowest = lowestPerformanceStatus(d);
			if (lowest === Infinity) return 0;
			return lowest <= 30 ? 1 : 0;
		}
	},
	{
		id: 'PALL-ANC-003',
		category: 'DNACPR Status',
		description: 'No DNACPR documented despite low performance status (PPS/AKPS <= 30).',
		kind: 'ancillary',
		evaluate: (d) => {
			const lowest = lowestPerformanceStatus(d);
			if (lowest === Infinity || lowest > 30) return 0;
			return d.goalsOfCareACP.dnacprDocumented === 'no' ||
				d.goalsOfCareACP.dnacprDocumented === 'unknown'
				? 1
				: 0;
		}
	},
	{
		id: 'PALL-ANC-004',
		category: 'Advance Care Planning',
		description: 'Missing core ACP documents (no RESPECT form, ADRT, or LPA documented).',
		kind: 'ancillary',
		evaluate: (d) => {
			const acp = d.goalsOfCareACP;
			const hasAny =
				acp.respectFormCompleted === 'yes' ||
				acp.adrtCompleted === 'yes' ||
				acp.lpaHealthAndWelfare === 'yes';
			const anyAnswered =
				acp.respectFormCompleted !== '' ||
				acp.adrtCompleted !== '' ||
				acp.lpaHealthAndWelfare !== '';
			return anyAnswered && !hasAny ? 1 : 0;
		}
	},
	{
		id: 'PALL-ANC-005',
		category: 'Carer Burden',
		description: 'Primary carer reports overwhelm or high strain.',
		kind: 'ancillary',
		evaluate: (d) => {
			if (d.carerFamilySupport.carerStrainLevel === 'overwhelmed') return 2;
			if (d.carerFamilySupport.carerStrainLevel === 'high') return 1;
			return 0;
		}
	}
];
