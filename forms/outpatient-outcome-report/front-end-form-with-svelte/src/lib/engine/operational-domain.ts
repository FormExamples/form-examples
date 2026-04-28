import type { AssessmentData, DomainGrade, FiredRule } from './types';

/**
 * Grade the Operational domain from NHS Attendance Outcome + wait-time vs target.
 *
 * Grade rules:
 * A = Attended AND wait ≤ service target
 * B = Attended AND wait ≤ 1.5 × service target
 * C = Attended AND wait > 1.5 × service target
 * D = Patient cancelled or rebooked (patient_cancelled)
 * E = DNA (patient_dna) OR provider-cancelled (provider_cancelled)
 * '' = Missing attendance outcome code
 *
 * "Attended" outcomes: attended_discharged, attended_follow_up, attended_pifu,
 * attended_onward_referral
 */
export function gradeOperational(data: AssessmentData): { grade: DomainGrade; rules: FiredRule[] } {
	const { nhsAttendanceOutcome, waitTimeDays, serviceTargetDays } = data.operationalEfficiency;
	const rules: FiredRule[] = [];

	if (!nhsAttendanceOutcome) {
		return { grade: '', rules };
	}

	const dnaOrProviderCancelled =
		nhsAttendanceOutcome === 'patient_dna' || nhsAttendanceOutcome === 'provider_cancelled';

	const patientCancelled = nhsAttendanceOutcome === 'patient_cancelled';

	const attended = [
		'attended_discharged',
		'attended_follow_up',
		'attended_pifu',
		'attended_onward_referral'
	].includes(nhsAttendanceOutcome);

	if (dnaOrProviderCancelled) {
		rules.push({
			id: 'OPS-004',
			domain: 'Operational',
			description: `Appointment outcome: ${nhsAttendanceOutcome === 'patient_dna' ? 'Did Not Attend' : 'Provider Cancelled'}`,
			grade: 'E'
		});
		return { grade: 'E', rules };
	}

	if (patientCancelled) {
		rules.push({
			id: 'OPS-003',
			domain: 'Operational',
			description: 'Appointment cancelled or rebooked by patient',
			grade: 'D'
		});
		return { grade: 'D', rules };
	}

	if (attended) {
		// Check wait time vs target
		if (waitTimeDays !== null && serviceTargetDays !== null && serviceTargetDays > 0) {
			const ratio = waitTimeDays / serviceTargetDays;
			if (ratio <= 1) {
				rules.push({
					id: 'OPS-001',
					domain: 'Operational',
					description: `Attended within target (${waitTimeDays}d ≤ ${serviceTargetDays}d target)`,
					grade: 'A'
				});
				return { grade: 'A', rules };
			} else if (ratio <= 1.5) {
				rules.push({
					id: 'OPS-002A',
					domain: 'Operational',
					description: `Attended within 1.5× target (${waitTimeDays}d vs ${serviceTargetDays}d target)`,
					grade: 'B'
				});
				return { grade: 'B', rules };
			} else {
				rules.push({
					id: 'OPS-002B',
					domain: 'Operational',
					description: `Attended but wait exceeded 1.5× target (${waitTimeDays}d vs ${serviceTargetDays}d target)`,
					grade: 'C'
				});
				return { grade: 'C', rules };
			}
		} else {
			// Attended but no wait-time data → default to B (attended, data quality flag)
			rules.push({
				id: 'OPS-001B',
				domain: 'Operational',
				description: 'Attended; wait-time or target not recorded (assumed within range)',
				grade: 'B'
			});
			return { grade: 'B', rules };
		}
	}

	return { grade: '', rules };
}
