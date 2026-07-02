import type {
	AlbuminuriaCategory,
	AssessmentData,
	BpTarget,
	ComponentRule,
	GfrCategory,
	KdigoRiskZone
} from './types';
import { present } from './utils';

// Chronic-kidney-disease review classification rules (NICE NG203, KDIGO
// 2012/2024). Pure helper functions, no I/O. This module owns the domain logic
// the grader orchestrates:
//
//   gfrCategory(egfr)        -> G1 | G2 | G3a | G3b | G4 | G5 | null
//   albuminuriaCategory(acr) -> A1 | A2 | A3 | null
//   kdigoRiskZone(g, a)      -> low | moderate | high | very-high | null
//   selectBpTarget(data)     -> the applicable clinic BP target (mmHg)
//   bloodPressureAtTarget    -> whether the recorded BP is below target
//   isRapidDecline(data)     -> sustained eGFR decline check
//   COMPONENTS               -> review-completeness bundle items
//
// The engine is a KDIGO classification and documentation-completeness tool,
// NOT a numeric score. See spec §4.

/**
 * KDIGO G-stage from the current eGFR (mL/min/1.73 m²), spec §4.
 *   ≥ 90 → G1; 60–89 → G2; 45–59 → G3a; 30–44 → G3b; 15–29 → G4; < 15 → G5;
 *   null → null.
 */
export function gfrCategory(egfr: number | null): GfrCategory {
	if (!present(egfr)) return null;
	if (egfr >= 90) return 'G1';
	if (egfr >= 60) return 'G2';
	if (egfr >= 45) return 'G3a';
	if (egfr >= 30) return 'G3b';
	if (egfr >= 15) return 'G4';
	return 'G5';
}

/**
 * KDIGO albuminuria stage from the urine ACR (mg/mmol), spec §4.
 *   < 3 → A1; 3–30 → A2; > 30 → A3; null → null.
 */
export function albuminuriaCategory(acr: number | null): AlbuminuriaCategory {
	if (!present(acr)) return null;
	if (acr < 3) return 'A1';
	if (acr <= 30) return 'A2';
	return 'A3';
}

// KDIGO risk heat-map indexed by G-stage row and A-stage column (spec §4).
const HEAT_MAP: Record<Exclude<GfrCategory, null>, Record<Exclude<AlbuminuriaCategory, null>, Exclude<KdigoRiskZone, null>>> = {
	G1: { A1: 'low', A2: 'moderate', A3: 'high' },
	G2: { A1: 'low', A2: 'moderate', A3: 'high' },
	G3a: { A1: 'moderate', A2: 'high', A3: 'very-high' },
	G3b: { A1: 'high', A2: 'very-high', A3: 'very-high' },
	G4: { A1: 'very-high', A2: 'very-high', A3: 'very-high' },
	G5: { A1: 'very-high', A2: 'very-high', A3: 'very-high' }
};

/**
 * KDIGO risk zone from the G-stage × albuminuria-stage heat-map (spec §4).
 * Null when either stage is null.
 */
export function kdigoRiskZone(g: GfrCategory, a: AlbuminuriaCategory): KdigoRiskZone {
	if (!g || !a) return null;
	return HEAT_MAP[g][a];
}

/**
 * Select the applicable blood-pressure target (NICE NG203, spec §4).
 *
 * Target is 130/80 mmHg when ACR ≥ 70 mg/mmol or the patient has diabetes
 * (type 1 or type 2); otherwise 140/90 mmHg.
 */
export function selectBpTarget(data: AssessmentData): { target: BpTarget; group: string } {
	const acr = data.albuminuria.acr;
	const diabetes =
		data.patient.diabetesStatus === 'type1' || data.patient.diabetesStatus === 'type2';
	const acrHigh = present(acr) && acr >= 70;

	if (acrHigh || diabetes) {
		return {
			target: { systolic: 130, diastolic: 80 },
			group: acrHigh ? 'ACR ≥ 70 mg/mmol' : 'Diabetes with CKD'
		};
	}
	return {
		target: { systolic: 140, diastolic: 90 },
		group: 'No qualifying comorbidity'
	};
}

/**
 * Whether the recorded blood pressure is below the applicable target.
 * Null when either reading is missing.
 */
export function bloodPressureAtTarget(data: AssessmentData, target: BpTarget): boolean | null {
	const s = data.bloodPressure.systolicBloodPressure;
	const d = data.bloodPressure.diastolicBloodPressure;
	if (!present(s) || !present(d)) return null;
	return s < target.systolic && d < target.diastolic;
}

/** Years between two ISO date strings, or null when either is unparseable. */
function yearsBetween(fromIso: string, toIso: string): number | null {
	if (!fromIso || !toIso) return null;
	const from = new Date(fromIso);
	const to = new Date(toIso);
	if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;
	const ms = to.getTime() - from.getTime();
	return ms / (365.25 * 24 * 60 * 60 * 1000);
}

/**
 * Rapid eGFR decline (spec §4). True when current and previous eGFR are both
 * present and either:
 *   - a fall of ≥ 25 % from the previous value AND a change in G-stage, or
 *   - an annualised fall of ≥ 15 mL/min/1.73 m² between the two sample dates
 *     (when both dates are present and span > 0 years; otherwise the raw fall
 *     between the two values is used).
 */
export function isRapidDecline(data: AssessmentData): boolean {
	const cur = data.renal.egfr;
	const prev = data.renal.previousEgfr;
	if (!present(cur) || !present(prev) || prev <= 0) return false;

	const drop = prev - cur;
	if (drop <= 0) return false;

	const percentDrop = drop / prev;
	const stageChanged = gfrCategory(cur) !== gfrCategory(prev);
	if (percentDrop >= 0.25 && stageChanged) return true;

	const years = yearsBetween(data.renal.previousEgfrDate, data.renal.egfrSampleDate);
	const annualisedDrop = years && years > 0 ? drop / years : drop;
	return annualisedDrop >= 15;
}

/**
 * The core review bundle components graded for completeness (spec §4). eGFR is
 * the gate (its absence makes the review incomplete); the KDIGO bundle also
 * requires ACR, blood pressure, a documented medication review, and the core
 * CKD bloods (potassium and haemoglobin).
 */
export const COMPONENTS: ComponentRule[] = [
	{
		component: 'egfr',
		label: 'Renal function (eGFR)',
		gate: true,
		satisfied: (d) => present(d.renal.egfr)
	},
	{
		component: 'acr',
		label: 'Albuminuria (urine ACR)',
		satisfied: (d) => present(d.albuminuria.acr)
	},
	{
		component: 'blood-pressure',
		label: 'Blood pressure (systolic and diastolic)',
		satisfied: (d) =>
			present(d.bloodPressure.systolicBloodPressure) &&
			present(d.bloodPressure.diastolicBloodPressure)
	},
	{
		component: 'medication-review',
		label: 'Structured medication review',
		satisfied: (d) => d.medication.medicationReviewCompleted === 'yes'
	},
	{
		component: 'core-bloods',
		label: 'Core CKD bloods (potassium and haemoglobin)',
		satisfied: (d) => present(d.bloods.potassium) && present(d.bloods.haemoglobin)
	}
];
