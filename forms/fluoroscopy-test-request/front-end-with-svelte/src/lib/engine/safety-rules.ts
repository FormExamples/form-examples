import type { FluoroscopyRequest, SafetyBand, FiredRule } from './types';
import { isBariumStudy, isIonisingStudy } from './utils';

/**
 * Axis B (part 2) — safety band (IR(ME)R justification, pregnancy, contrast
 * allergy, aspiration risk, contrast-choice for suspected perforation).
 *
 * The safety band is the most-severe outcome across the safety rules:
 * contraindicated > caution > ok. Pregnancy with an ionising study, or barium
 * chosen when perforation is suspected, force `contraindicated`.
 */

const SAFETY_ORDER: SafetyBand[] = ['ok', 'caution', 'contraindicated'];

/** Return whichever of two safety bands is more severe. */
export function maxSafety(a: SafetyBand, b: SafetyBand): SafetyBand {
	return SAFETY_ORDER.indexOf(a) >= SAFETY_ORDER.indexOf(b) ? a : b;
}

/** Compute the safety band and the fired safety rules. */
export function scoreSafety(data: FluoroscopyRequest): {
	band: SafetyBand;
	firedRules: FiredRule[];
} {
	let band: SafetyBand = 'ok';
	const firedRules: FiredRule[] = [];
	const studyType = data.request.studyType;
	const indication = data.request.primaryIndication;

	// Pregnancy with an ionising study — contraindicated.
	const pregnant =
		data.safety.pregnancyStatus === 'pregnant' || data.safety.pregnancyStatus === 'possible';
	if (pregnant && isIonisingStudy(studyType)) {
		band = maxSafety(band, 'contraindicated');
		firedRules.push({
			ruleId: 'R-SAFETY-PREGNANCY-IONISING',
			axis: 'safety',
			category: 'pregnancy',
			description:
				'Pregnant or possibly pregnant with an ionising-radiation study — contraindicated; justify or defer per IR(ME)R.'
		});
	}

	// Suspected perforation with a barium study — contraindicated (use
	// water-soluble contrast).
	if (indication === 'suspected-perforation' && isBariumStudy(studyType)) {
		band = maxSafety(band, 'contraindicated');
		firedRules.push({
			ruleId: 'R-SAFETY-PERFORATION-BARIUM',
			axis: 'safety',
			category: 'suspected-perforation-contrast-choice',
			description:
				'Barium study requested when perforation is suspected — contraindicated; redirect to a water-soluble contrast study.'
		});
	}

	// Contrast allergy — caution.
	if (data.safety.contrastAllergy === true) {
		band = maxSafety(band, 'caution');
		firedRules.push({
			ruleId: 'R-SAFETY-CONTRAST-ALLERGY',
			axis: 'safety',
			category: 'contrast-allergy',
			description:
				'Known contrast-media allergy — caution; review premedication and contrast choice.'
		});
	}

	// Aspiration risk — caution (favours water-soluble contrast over barium).
	if (data.safety.aspirationRisk === true) {
		band = maxSafety(band, 'caution');
		firedRules.push({
			ruleId: 'R-SAFETY-ASPIRATION-RISK',
			axis: 'safety',
			category: 'aspiration-risk',
			description:
				'Aspiration risk — caution; favour water-soluble (non-ionic, low-osmolar) contrast over barium.'
		});
	}

	// Unknown pregnancy status with an ionising study — caution.
	if (data.safety.pregnancyStatus === 'unknown' && isIonisingStudy(studyType)) {
		band = maxSafety(band, 'caution');
		firedRules.push({
			ruleId: 'R-SAFETY-PREGNANCY-UNKNOWN',
			axis: 'safety',
			category: 'pregnancy',
			description:
				'Pregnancy status unknown with an ionising-radiation study — caution; confirm status before exposure.'
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-SAFETY-OK',
			axis: 'safety',
			category: 'safety',
			description: 'No safety contraindications or cautions identified.'
		});
	}

	return { band, firedRules };
}
