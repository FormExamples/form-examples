import type { NerveConductionStudyRequest, ProceduralRiskBand, FiredRule } from './types';
import { involvesNeedleEmg } from './utils';

/**
 * Axis B — Procedural risk (needle EMG vs anticoagulation / cardiac device).
 *
 * Needle EMG carries a bleeding risk in anticoagulated patients; electrical
 * stimulation warrants caution near a pacemaker / ICD. The band is the most
 * severe of the contributing factors. When no needle-EMG component is requested
 * and no device is present, the band is low. Rule IDs are stable across every
 * front-end and the back-end.
 */

const RISK_ORDER: ProceduralRiskBand[] = ['low', 'moderate', 'high'];

/** Return whichever of two risk bands is more severe. */
function maxRisk(a: ProceduralRiskBand, b: ProceduralRiskBand): ProceduralRiskBand {
	return RISK_ORDER.indexOf(a) >= RISK_ORDER.indexOf(b) ? a : b;
}

/** Compute the procedural-risk band and the fired risk rules. */
export function gradeProceduralRisk(r: NerveConductionStudyRequest): {
	proceduralRiskBand: ProceduralRiskBand;
	firedRules: FiredRule[];
} {
	const needleEmg = involvesNeedleEmg(r.study.studyType);
	const anticoagulated = r.safety.takingAnticoagulant === true;
	const device = r.safety.pacemakerOrIcd === true;

	let band: ProceduralRiskBand = 'low';
	const firedRules: FiredRule[] = [];

	if (needleEmg && anticoagulated) {
		band = maxRisk(band, 'high');
		firedRules.push({
			ruleId: 'R-RISK-NEEDLE-ANTICOAG',
			axis: 'risk',
			category: 'anticoagulation',
			description: 'Needle EMG requested in an anticoagulated patient — high bleeding risk.'
		});
	} else if (anticoagulated) {
		band = maxRisk(band, 'moderate');
		firedRules.push({
			ruleId: 'R-RISK-ANTICOAG',
			axis: 'risk',
			category: 'anticoagulation',
			description:
				'Patient is anticoagulated; confirm whether a needle-EMG component is required.'
		});
	} else if (needleEmg) {
		band = maxRisk(band, 'moderate');
		firedRules.push({
			ruleId: 'R-RISK-NEEDLE-EMG',
			axis: 'risk',
			category: 'needle-emg',
			description: 'Needle EMG requested — standard sterile-needle precautions apply.'
		});
	}

	if (device) {
		band = maxRisk(band, 'moderate');
		firedRules.push({
			ruleId: 'R-RISK-CARDIAC-DEVICE',
			axis: 'risk',
			category: 'cardiac-device',
			description: 'Pacemaker / ICD present — apply stimulation-technique caution.'
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-RISK-LOW',
			axis: 'risk',
			category: 'baseline',
			description: 'No needle-EMG bleeding risk or cardiac-device caution identified.'
		});
	}

	return { proceduralRiskBand: band, firedRules };
}
