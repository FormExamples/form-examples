import type { StressTestRequest, FiredRule, ContraindicationBand } from './types';
import { isExerciseTest } from './utils';

// ──────────────────────────────────────────────
// Axis B — Safety / contraindication (ACC/AHA + ESC valve guidance)
//
// Returns a band of ok / caution / contraindicated. Absolute contraindications
// (recent acute coronary syndrome; severe symptomatic aortic stenosis) force
// `contraindicated`. Relative contraindications (uncontrolled hypertension;
// inability to exercise for an exercise test; moderate aortic stenosis) force
// at least `caution`.
// ──────────────────────────────────────────────

export const CONTRAINDICATION_ORDER: ContraindicationBand[] = ['ok', 'caution', 'contraindicated'];

/** Return whichever of two safety bands is more severe. */
export function maxBand(a: ContraindicationBand, b: ContraindicationBand): ContraindicationBand {
	const ia = CONTRAINDICATION_ORDER.indexOf(a);
	const ib = CONTRAINDICATION_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

interface SafetyRuleDef {
	ruleId: string;
	band: ContraindicationBand;
	fires: (d: StressTestRequest) => boolean;
	description: string;
}

/** Each rule forces at least the given band when it fires. */
const SAFETY_RULES: SafetyRuleDef[] = [
	{
		ruleId: 'R-SAFETY-RECENT-ACS',
		band: 'contraindicated',
		fires: (d) => d.safety.recentAcuteCoronarySyndrome === true,
		description:
			'Recent acute coronary syndrome — exercise / stress testing contraindicated until stabilised.'
	},
	{
		ruleId: 'R-SAFETY-SEVERE-AORTIC-STENOSIS',
		band: 'contraindicated',
		fires: (d) => d.safety.aorticStenosis === 'severe',
		description:
			'Severe (symptomatic) aortic stenosis — exercise testing contraindicated; prefer coronary angiography.'
	},
	{
		ruleId: 'R-SAFETY-UNABLE-TO-EXERCISE',
		band: 'caution',
		fires: (d) => isExerciseTest(d.request.testType) && d.symptoms.ableToExercise !== true,
		description:
			'Exercise test requested but patient cannot exercise — redirect to a pharmacological / imaging modality.'
	},
	{
		ruleId: 'R-SAFETY-UNCONTROLLED-HYPERTENSION',
		band: 'caution',
		fires: (d) => d.safety.uncontrolledHypertension === true,
		description:
			'Uncontrolled hypertension — relative contraindication; control blood pressure first.'
	},
	{
		ruleId: 'R-SAFETY-MODERATE-AORTIC-STENOSIS',
		band: 'caution',
		fires: (d) => d.safety.aorticStenosis === 'moderate',
		description: 'Moderate aortic stenosis — proceed with caution under specialist supervision.'
	}
];

/** Evaluate the safety / contraindication band. */
export function scoreSafety(data: StressTestRequest): {
	band: ContraindicationBand;
	firedRules: FiredRule[];
} {
	let band: ContraindicationBand = 'ok';
	const firedRules: FiredRule[] = [];
	for (const rule of SAFETY_RULES) {
		if (rule.fires(data)) {
			band = maxBand(band, rule.band);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'safety',
				category: 'contraindication',
				description: rule.description
			});
		}
	}
	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-SAFETY-OK',
			axis: 'safety',
			category: 'contraindication',
			description: 'No absolute or relative contraindication detected from the safety screen.'
		});
	}
	return { band, firedRules };
}
