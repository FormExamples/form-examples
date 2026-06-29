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

/** Calculate BMI from height in cm and weight in kg. */
export function calculateBMI(heightCm: number | null, weightKg: number | null): number | null {
	if (heightCm === null || weightKg === null || heightCm <= 0 || weightKg <= 0) return null;
	const heightM = heightCm / 100;
	return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/**
 * BMI category label.
 *   <18.5  = Underweight
 *   18.5-24.9 = Normal weight
 *   25-29.9   = Overweight
 *   30-34.9   = Obesity class I
 *   35-39.9   = Obesity class II
 *   >=40      = Obesity class III (severe)
 */
export function bmiCategory(bmi: number): string {
	if (bmi < 18.5) return 'Underweight';
	if (bmi < 25) return 'Normal weight';
	if (bmi < 30) return 'Overweight';
	if (bmi < 35) return 'Obesity class I';
	if (bmi < 40) return 'Obesity class II';
	return 'Obesity class III (severe)';
}

/** Eligibility status label for display. */
export function eligibilityLabel(status: string): string {
	switch (status) {
		case 'Eligible':
			return 'Eligible for Semaglutide';
		case 'Conditional':
			return 'Conditional - Requires Clinical Review';
		case 'Ineligible':
			return 'Ineligible for Semaglutide';
		default:
			return '';
	}
}

/** Eligibility status Lily token colour classes. */
export function eligibilityColor(status: string): string {
	switch (status) {
		case 'Eligible':
			return 'bg-success text-success-content border-success';
		case 'Conditional':
			return 'bg-warning text-warning-content border-warning';
		case 'Ineligible':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}
