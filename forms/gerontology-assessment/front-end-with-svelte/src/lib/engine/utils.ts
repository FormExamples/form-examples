/** Calculate BMI from weight (kg) and height (cm). Returns null if inputs are invalid. */
export function calculateBMI(weightKg: number | null, heightCm: number | null): number | null {
	if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
	const heightM = heightCm / 100;
	return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/** Get BMI category label. */
export function bmiCategory(bmi: number | null): string {
	if (bmi === null) return '';
	if (bmi < 18.5) return 'Underweight';
	if (bmi < 25) return 'Normal';
	if (bmi < 30) return 'Overweight';
	if (bmi < 35) return 'Obese Class I';
	if (bmi < 40) return 'Obese Class II';
	return 'Obese Class III (Morbid)';
}

/** Calculate age from date of birth string. */
export function calculateAge(dob: string): number | null {
	if (!dob) return null;
	const birth = new Date(dob);
	if (isNaN(birth.getTime())) return null;
	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const m = today.getMonth() - birth.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
		age--;
	}
	return age;
}

/** Clinical Frailty Scale score label. */
export function cfsScoreLabel(score: number): string {
	switch (score) {
		case 1:
			return 'CFS 1 - Very Fit';
		case 2:
			return 'CFS 2 - Well';
		case 3:
			return 'CFS 3 - Managing Well';
		case 4:
			return 'CFS 4 - Vulnerable';
		case 5:
			return 'CFS 5 - Mildly Frail';
		case 6:
			return 'CFS 6 - Moderately Frail';
		case 7:
			return 'CFS 7 - Severely Frail';
		case 8:
			return 'CFS 8 - Very Severely Frail';
		case 9:
			return 'CFS 9 - Terminally Ill';
		default:
			return `CFS ${score}`;
	}
}

/** CFS score colour class (Lily token utilities). */
export function cfsScoreColor(score: number): string {
	switch (score) {
		case 1:
		case 2:
		case 3:
			return 'bg-success text-success-content border-success';
		case 4:
		case 5:
		case 6:
			return 'bg-warning text-warning-content border-warning';
		case 7:
		case 8:
		case 9:
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Frailty severity band for a CFS score (used for dashboard filtering). */
export function cfsSeverityBand(score: number): 'fit' | 'vulnerable' | 'frail' | 'severe' {
	if (score <= 3) return 'fit';
	if (score === 4) return 'vulnerable';
	if (score <= 6) return 'frail';
	return 'severe';
}

/** Human-readable label for a frailty severity band. */
export function cfsSeverityBandLabel(band: string): string {
	switch (band) {
		case 'fit':
			return 'Fit (CFS 1–3)';
		case 'vulnerable':
			return 'Vulnerable (CFS 4)';
		case 'frail':
			return 'Frail (CFS 5–6)';
		case 'severe':
			return 'Severely frail (CFS 7–9)';
		default:
			return band;
	}
}

/** Human-readable label for a cognitive status value. */
export function cognitiveStatusLabel(status: string): string {
	switch (status) {
		case 'normal':
			return 'Normal';
		case 'mild-impairment':
			return 'Mild impairment';
		case 'moderate-impairment':
			return 'Moderate impairment';
		case 'severe-impairment':
			return 'Severe impairment';
		default:
			return status || '—';
	}
}

/** Count dependent ADLs (returns count of fields marked 'dependent'). */
export function countDependentADLs(data: {
	bathingADL: string;
	dressingADL: string;
	toiletingADL: string;
	transferringADL: string;
	feedingADL: string;
}): number {
	const fields = [
		data.bathingADL,
		data.dressingADL,
		data.toiletingADL,
		data.transferringADL,
		data.feedingADL
	];
	return fields.filter((f) => f === 'dependent').length;
}

/** Count ADLs needing assistance (returns count of 'needs-assistance' or 'dependent'). */
export function countADLsNeedingHelp(data: {
	bathingADL: string;
	dressingADL: string;
	toiletingADL: string;
	transferringADL: string;
	feedingADL: string;
}): number {
	const fields = [
		data.bathingADL,
		data.dressingADL,
		data.toiletingADL,
		data.transferringADL,
		data.feedingADL
	];
	return fields.filter((f) => f === 'needs-assistance' || f === 'dependent').length;
}

/** Count IADLs needing help. */
export function countIADLsNeedingHelp(data: {
	cookingIADL: string;
	cleaningIADL: string;
	shoppingIADL: string;
	financesIADL: string;
	medicationManagementIADL: string;
}): number {
	const fields = [
		data.cookingIADL,
		data.cleaningIADL,
		data.shoppingIADL,
		data.financesIADL,
		data.medicationManagementIADL
	];
	return fields.filter((f) => f === 'needs-assistance' || f === 'dependent').length;
}
