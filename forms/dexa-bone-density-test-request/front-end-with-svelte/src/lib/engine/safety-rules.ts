import type { DexaRequest, RadiationDoseBand, FiredRule } from './types';

// ──────────────────────────────────────────────
// Axis B — Radiation safety (DEXA effective-dose banding)
//
// DEXA is a very low dose examination (~1–5 microsievert). Hip and spine are
// low; whole-body is slightly higher (still low overall). The dominant safety
// consideration is pregnancy, which raises the band and adds a deferral note.
// ──────────────────────────────────────────────

const DOSE_BY_REGION: Record<string, RadiationDoseBand> = {
	hip: 'low',
	spine: 'low',
	'hip-and-spine': 'low',
	forearm: 'low',
	'whole-body': 'moderate',
	other: 'low'
};

/**
 * Axis B — evaluate the radiation dose band and produce a safety note.
 */
export function gradeSafety(r: DexaRequest): {
	radiationDoseBand: RadiationDoseBand;
	safetyNote: string;
	firedRules: FiredRule[];
} {
	const scanRegion = r.request.scanRegion;
	const pregnancyStatus = r.patient.pregnancyStatus;
	const firedRules: FiredRule[] = [];

	if (!scanRegion) {
		firedRules.push({
			ruleId: 'R-SAFETY-UNKNOWN',
			axis: 'safety',
			category: 'unspecified',
			description: 'Scan region not yet specified — radiation dose not assessed.'
		});
		return { radiationDoseBand: '', safetyNote: '', firedRules };
	}

	const pregnant = pregnancyStatus === 'pregnant' || pregnancyStatus === 'possible';
	if (pregnant) {
		firedRules.push({
			ruleId: 'R-SAFETY-PREGNANCY',
			axis: 'safety',
			category: 'pregnancy',
			description:
				'Known or suspected pregnancy raises the radiation-safety band and the scan should be deferred.'
		});
		return {
			radiationDoseBand: 'high',
			safetyNote:
				'Known or suspected pregnancy — defer DEXA. Although the dose is very low (~1–5 microsievert), avoid unnecessary exposure.',
			firedRules
		};
	}

	const band = DOSE_BY_REGION[scanRegion] || 'low';
	const regionKey = scanRegion.toUpperCase().replace(/[^A-Z]+/g, '-');
	if (band === 'moderate') {
		firedRules.push({
			ruleId: `R-SAFETY-${regionKey}-MODERATE`,
			axis: 'safety',
			category: 'dose',
			description: 'Whole-body DEXA: low-moderate effective dose.'
		});
		return {
			radiationDoseBand: 'moderate',
			safetyNote:
				'Whole-body DEXA carries a slightly higher (still low) effective dose than hip/spine. No additional precautions beyond standard justification.',
			firedRules
		};
	}

	firedRules.push({
		ruleId: `R-SAFETY-${regionKey}-LOW`,
		axis: 'safety',
		category: 'dose',
		description: 'Standard DEXA site: very low effective dose.'
	});
	return {
		radiationDoseBand: 'low',
		safetyNote:
			'DEXA delivers a very low effective dose (~1–5 microsievert). No additional radiation precautions required.',
		firedRules
	};
}
