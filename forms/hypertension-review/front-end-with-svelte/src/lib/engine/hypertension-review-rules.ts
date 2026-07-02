import type {
	AssessmentData,
	BpTarget,
	ComponentRule,
	ControlClass,
	HypertensionStage,
	PrimarySource
} from './types';
import { present } from './utils';

// Hypertension-review classification rules (NICE NG136). Pure helper functions,
// no I/O. This module owns the domain logic the grader orchestrates:
//
//   selectTarget(data)      -> the tightest applicable clinic + home BP target
//   classifyControl(...)    -> controlled | uncontrolled | severe-uncontrolled
//   computeStage(data)      -> none | stage-1 | stage-2 | stage-3-severe
//   COMPONENTS              -> review-completeness components
//
// The engine is a control-classification and documentation-completeness tool,
// NOT a numeric score. See spec §4.

/**
 * Select the tightest applicable blood-pressure target (spec §4.1).
 *
 * Base clinic target is 140/90 (age under 80). Age 80 and over relaxes it to
 * 150/90. Type 2 diabetes holds it at 140/90 (tighter than the 80-and-over
 * relaxation). CKD with diabetes or ACR 70 mg/mmol and over tightens it to
 * 130/80. The tightest (lowest systolic) target wins. The home/ambulatory
 * target is 5 mmHg lower on each of systolic and diastolic.
 */
export function selectTarget(data: AssessmentData): BpTarget {
	const d = data.diagnosis;
	const acr = data.urine.urineAcr;

	let clinic = { systolic: 140, diastolic: 90 };
	let group = 'Age under 80, no qualifying comorbidity';

	if (data.identification.ageBand === '>=80') {
		clinic = { systolic: 150, diastolic: 90 };
		group = 'Age 80 and over';
	}

	// Type 2 diabetes holds the clinic target at 140/90 (tighter than 150/90).
	if (d.type2Diabetes === 'yes' && clinic.systolic > 140) {
		clinic = { systolic: 140, diastolic: 90 };
		group = 'Type 2 diabetes';
	}

	// CKD with diabetes, or CKD with ACR 70 and over, tightens the target to 130/80.
	const acrHigh = present(acr) && acr >= 70;
	if (d.chronicKidneyDisease === 'yes' && (d.type2Diabetes === 'yes' || acrHigh)) {
		clinic = { systolic: 130, diastolic: 80 };
		group = acrHigh ? 'CKD with ACR 70 mg/mmol and over' : 'CKD with type 2 diabetes';
	}

	const home = { systolic: clinic.systolic - 5, diastolic: clinic.diastolic - 5 };
	return { clinic, home, group };
}

/**
 * Classify blood-pressure control against the selected target (spec §4.2).
 *
 * The clinic reading always drives the severe classification (180/120 and
 * over). The primary reading for the controlled/uncontrolled decision is the
 * home/ambulatory reading if present, else the clinic reading.
 */
export function classifyControl(
	data: AssessmentData,
	target: BpTarget
): { controlClass: ControlClass; primarySource: PrimarySource } {
	const c = data.clinicBp;
	const h = data.homeBp;

	const hasClinic = present(c.clinicSystolic) && present(c.clinicDiastolic);
	const hasHome = present(h.homeSystolic) && present(h.homeDiastolic);

	const severe =
		hasClinic && (c.clinicSystolic! >= 180 || c.clinicDiastolic! >= 120);

	const primarySource: PrimarySource = hasHome ? 'home' : hasClinic ? 'clinic' : 'none';

	let aboveTarget = false;
	if (primarySource === 'home') {
		aboveTarget =
			h.homeSystolic! > target.home.systolic || h.homeDiastolic! > target.home.diastolic;
	} else if (primarySource === 'clinic') {
		aboveTarget =
			c.clinicSystolic! > target.clinic.systolic || c.clinicDiastolic! > target.clinic.diastolic;
	}

	const controlClass: ControlClass = severe
		? 'severe-uncontrolled'
		: aboveTarget
			? 'uncontrolled'
			: 'controlled';

	return { controlClass, primarySource };
}

/**
 * Assign a hypertension stage from the raw readings (spec §4.3).
 *
 * Stage 3 (severe) fires on the clinic reading alone (systolic 180 and over, or
 * diastolic 120 and over). Stage 1/2 require the clinic AND home readings both
 * to cross their thresholds where both are present; where a home reading is
 * absent, staging falls back to the clinic reading only (and vice versa).
 */
export function computeStage(data: AssessmentData): HypertensionStage {
	const c = data.clinicBp;
	const h = data.homeBp;

	const cs = c.clinicSystolic;
	const cd = c.clinicDiastolic;
	const hs = h.homeSystolic;
	const hd = h.homeDiastolic;

	const hasClinic = present(cs) || present(cd);
	const hasHome = present(hs) || present(hd);
	if (!hasClinic && !hasHome) return 'none';

	const clinicMeets = (st: number, dt: number) =>
		(present(cs) && cs >= st) || (present(cd) && cd >= dt);
	const homeMeets = (st: number, dt: number) =>
		(present(hs) && hs >= st) || (present(hd) && hd >= dt);

	if (clinicMeets(180, 120)) return 'stage-3-severe';

	// Combine clinic + home when both present; otherwise use whichever is present.
	const check = (cSys: number, cDia: number, hSys: number, hDia: number) => {
		if (hasClinic && hasHome) {
			return clinicMeets(cSys, cDia) && homeMeets(hSys, hDia);
		}
		if (hasClinic) return clinicMeets(cSys, cDia);
		return homeMeets(hSys, hDia);
	};

	if (check(160, 100, 150, 95)) return 'stage-2';
	if (check(140, 90, 135, 85)) return 'stage-1';
	return 'none';
}

/**
 * The core review components graded for completeness (spec §4.4). Blood pressure
 * is the gate (its absence makes the review incomplete); the remaining secondary
 * components each contribute to complete vs partial.
 */
export const COMPONENTS: ComponentRule[] = [
	{
		component: 'blood-pressure',
		label: 'Blood pressure (clinic or home/ambulatory)',
		gate: true,
		satisfied: (d) =>
			(present(d.clinicBp.clinicSystolic) && present(d.clinicBp.clinicDiastolic)) ||
			(present(d.homeBp.homeSystolic) && present(d.homeBp.homeDiastolic))
	},
	{
		component: 'medication-adherence',
		label: 'Medication and adherence',
		satisfied: (d) => d.medication.adherence !== ''
	},
	{
		component: 'cardiovascular-risk',
		label: 'Cardiovascular risk (QRISK)',
		satisfied: (d) => present(d.cardiovascularRisk.qriskPercent)
	},
	{
		component: 'renal-bloods',
		label: 'U&E (creatinine / eGFR / potassium)',
		satisfied: (d) =>
			present(d.bloods.serumCreatinine) ||
			present(d.bloods.egfr) ||
			present(d.bloods.serumPotassium)
	},
	{
		component: 'hba1c',
		label: 'HbA1c',
		satisfied: (d) => present(d.bloods.hba1c)
	},
	{
		component: 'lipids',
		label: 'Lipids (total / HDL cholesterol)',
		satisfied: (d) => present(d.bloods.totalCholesterol) || present(d.bloods.hdlCholesterol)
	},
	{
		component: 'urine-acr',
		label: 'Urine albumin:creatinine ratio (ACR)',
		satisfied: (d) => present(d.urine.urineAcr)
	},
	{
		component: 'lifestyle',
		label: 'Lifestyle (smoking / BMI / advice)',
		satisfied: (d) =>
			d.cardiovascularRisk.smokingStatus !== '' ||
			present(d.lifestyle.bmi) ||
			d.lifestyle.lifestyleAdvice.trim() !== ''
	}
];
