import type {
	PetScanRequest,
	PrepSafetyBand,
	RadiationDoseBand,
	FiredRule,
	ScanType
} from './types';

// ──────────────────────────────────────────────
// Axis B — Preparation safety & radiation dose (EANM / SNMMI + IR(ME)R)
// ──────────────────────────────────────────────
//
// FDG uptake needs blood glucose typically below ~11 mmol/L. Pregnancy or
// uncontrolled glucose force the caution / contraindicated band regardless of
// appropriateness. Breastfeeding raises a caution. Radiation dose reflects the
// study burden (PET-CT delivers a moderate-to-high effective dose).

/** Blood glucose above which FDG uptake is materially impaired (SNMMI). */
export const GLUCOSE_UNCONTROLLED_THRESHOLD = 11; // mmol/L
/** EANM preferred blood-glucose ceiling for FDG studies. */
export const GLUCOSE_ELEVATED_THRESHOLD = 7; // mmol/L

// Most-severe band wins.
const PREP_ORDER: PrepSafetyBand[] = ['ok', 'caution', 'contraindicated'];

/** Whether the requested scan type is an FDG study (glucose-dependent). */
export function isFdgStudy(scanType: ScanType): boolean {
	return scanType === 'fdg-pet-ct' || scanType === 'cardiac-pet';
}

/** Return whichever of two preparation-safety bands is more severe. */
export function maxPrepBand(a: PrepSafetyBand, b: PrepSafetyBand): PrepSafetyBand {
	return PREP_ORDER.indexOf(a) >= PREP_ORDER.indexOf(b) ? a : b;
}

/**
 * Axis B — evaluate the preparation-safety band and the fired safety rules.
 * Pregnancy forces contraindicated; possible pregnancy, uncontrolled / missing
 * glucose (FDG studies), and breastfeeding each raise a caution.
 */
export function scorePrepSafety(data: PetScanRequest): {
	band: PrepSafetyBand;
	firedRules: FiredRule[];
} {
	const prep = data.preparation;
	const fdg = isFdgStudy(data.request.scanType);
	let band: PrepSafetyBand = 'ok';
	const firedRules: FiredRule[] = [];

	// Pregnancy forces contraindicated (relative) — radiation to the fetus.
	if (prep.pregnancyStatus === 'pregnant') {
		band = maxPrepBand(band, 'contraindicated');
		firedRules.push({
			ruleId: 'R-SAFETY-PREGNANT',
			axis: 'safety',
			category: 'pregnancy',
			description:
				'Patient is pregnant — PET-CT radiation exposure is contraindicated unless justified by exception.'
		});
	} else if (prep.pregnancyStatus === 'possible') {
		band = maxPrepBand(band, 'caution');
		firedRules.push({
			ruleId: 'R-SAFETY-PREGNANCY-POSSIBLE',
			axis: 'safety',
			category: 'pregnancy',
			description: 'Pregnancy is possible — confirm pregnancy status before exposure.'
		});
	}

	// Glucose control (FDG studies only).
	if (fdg) {
		const g = prep.bloodGlucoseMmolL;
		if (g === null || g === undefined) {
			band = maxPrepBand(band, 'caution');
			firedRules.push({
				ruleId: 'R-SAFETY-GLUCOSE-MISSING',
				axis: 'safety',
				category: 'glucose',
				description:
					'No blood glucose recorded for an FDG study — measure and document before tracer injection.'
			});
		} else if (Number(g) > GLUCOSE_UNCONTROLLED_THRESHOLD) {
			band = maxPrepBand(band, 'caution');
			firedRules.push({
				ruleId: 'R-SAFETY-GLUCOSE-UNCONTROLLED',
				axis: 'safety',
				category: 'glucose',
				description: `Blood glucose ${Number(g)} mmol/L is above ~11 mmol/L — recheck and reschedule; FDG uptake will be impaired.`
			});
		} else if (Number(g) > GLUCOSE_ELEVATED_THRESHOLD) {
			band = maxPrepBand(band, 'caution');
			firedRules.push({
				ruleId: 'R-SAFETY-GLUCOSE-ELEVATED',
				axis: 'safety',
				category: 'glucose',
				description: `Blood glucose ${Number(g)} mmol/L is above the EANM preferred ~7 mmol/L; acceptable but optimise where possible.`
			});
		}
	}

	// Breastfeeding precaution for the radiopharmaceutical.
	if (prep.breastfeeding === true) {
		band = maxPrepBand(band, 'caution');
		firedRules.push({
			ruleId: 'R-SAFETY-BREASTFEEDING',
			axis: 'safety',
			category: 'breastfeeding',
			description:
				'Patient is breastfeeding — advise interruption / close-contact precautions per local protocol.'
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-SAFETY-OK',
			axis: 'safety',
			category: 'preparation',
			description: 'No preparation-safety concern detected for the recorded data.'
		});
	}

	return { band, firedRules };
}

// Relative radiation-dose band per scan type (PET-CT effective dose).
export const RADIATION_DOSE_BY_SCAN: Record<string, RadiationDoseBand> = {
	'fdg-pet-ct': 'high',
	'psma-pet': 'moderate',
	'dotatate-pet': 'moderate',
	'amyloid-pet': 'moderate',
	'cardiac-pet': 'high',
	other: 'moderate'
};

/**
 * Axis B — determine the radiation-dose band for the requested study and the
 * fired rule. Returns an empty band when no scan type has been chosen.
 */
export function scoreRadiationDose(scanType: ScanType): {
	band: RadiationDoseBand;
	firedRules: FiredRule[];
} {
	if (!scanType) {
		return {
			band: '',
			firedRules: [
				{
					ruleId: 'R-SAFETY-DOSE-UNKNOWN',
					axis: 'safety',
					category: 'radiation-dose',
					description: 'Scan type not yet specified — radiation-dose band not assessed.'
				}
			]
		};
	}
	const band = RADIATION_DOSE_BY_SCAN[scanType] ?? 'moderate';
	return {
		band,
		firedRules: [
			{
				ruleId: `R-SAFETY-DOSE-${band.toUpperCase()}`,
				axis: 'safety',
				category: 'radiation-dose',
				description: `Requested ${scanType} study carries a ${band} relative radiation dose; ensure IR(ME)R justification.`
			}
		]
	};
}
