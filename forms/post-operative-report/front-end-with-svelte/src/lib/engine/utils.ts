import type { ClavienDindoGradeKey, DispositionLocation, AdditionalFlag } from './types';
import { clavienDindoRuleByGrade } from './clavien-dindo-rules';

/** Friendly label for a Clavien-Dindo grade key (e.g. "Grade IIIb"). */
export function gradeLabel(grade: ClavienDindoGradeKey): string {
	const rule = clavienDindoRuleByGrade[grade];
	return rule ? rule.label : '';
}

/** Short label (Roman numeral) for a Clavien-Dindo grade key (e.g. "IIIb"). */
export function gradeShortLabel(grade: ClavienDindoGradeKey): string {
	const rule = clavienDindoRuleByGrade[grade];
	return rule ? rule.shortLabel : '';
}

/** Full description for a Clavien-Dindo grade key. */
export function gradeDescription(grade: ClavienDindoGradeKey): string {
	const rule = clavienDindoRuleByGrade[grade];
	return rule ? rule.description : '';
}

/** Numeric ordering: grade-0 = 0, grade-i = 1, … grade-v = 7; -1 if unknown. */
export function gradeOrder(grade: ClavienDindoGradeKey): number {
	const rule = clavienDindoRuleByGrade[grade];
	return rule ? rule.order : -1;
}

/** Lily token colour triple for a Clavien-Dindo grade badge. */
export function gradeBadgeColor(grade: ClavienDindoGradeKey): string {
	switch (grade) {
		case 'grade-0':
			return 'bg-success text-success-content border-success';
		case 'grade-i':
		case 'grade-ii':
			return 'bg-warning text-warning-content border-warning';
		case 'grade-iiia':
		case 'grade-iiib':
			return 'bg-warning text-warning-content border-warning';
		case 'grade-iva':
		case 'grade-ivb':
		case 'grade-v':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily token colour triple for a flag priority. */
export function priorityColor(priority: AdditionalFlag['priority']): string {
	switch (priority) {
		case 'urgent':
			return 'bg-error text-error-content border-error';
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Human-readable label for a disposition-from-theatre location. */
export function dispositionLabel(disposition: DispositionLocation): string {
	switch (disposition) {
		case 'recovery':
			return 'Recovery / PACU';
		case 'ward':
			return 'Surgical ward';
		case 'hdu':
			return 'High dependency unit';
		case 'icu':
			return 'Intensive care unit';
		case 'theatre':
			return 'Returned to theatre';
		case 'home':
			return 'Discharged home';
		default:
			return 'Not recorded';
	}
}

/** Calculate procedure duration in minutes from HH:MM start and end times. */
export function calculateDurationMinutes(
	startTime: string,
	endTime: string
): number | null {
	if (!startTime || !endTime) return null;
	const parse = (t: string): number | null => {
		const [h, m] = String(t).split(':').map(Number);
		if (Number.isNaN(h) || Number.isNaN(m)) return null;
		return h * 60 + m;
	};
	const s = parse(startTime);
	const e = parse(endTime);
	if (s === null || e === null) return null;
	let diff = e - s;
	if (diff < 0) diff += 24 * 60;
	return diff;
}

/** Format a duration in minutes as e.g. "135 min (2h 15m)". */
export function formatDuration(minutes: number | null): string {
	if (minutes == null) return '—';
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return `${minutes} min (${h}h ${m}m)`;
}

/** Calculate age in whole years from a date-of-birth string. */
export function calculateAge(dob: string): number | null {
	if (!dob) return null;
	const birth = new Date(dob);
	if (isNaN(birth.getTime())) return null;
	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const mo = today.getMonth() - birth.getMonth();
	if (mo < 0 || (mo === 0 && today.getDate() < birth.getDate())) age--;
	return age;
}
