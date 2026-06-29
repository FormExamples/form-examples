// STOP-BANG OSA screening — 8 yes/no items, sum 0-8.
//
// SB-S  Snoring loudly            (Step 7 — social history)
// SB-T  Tired during day         (Step 7)
// SB-O  Observed apnea           (Step 7)
// SB-P  Pressure (hypertension)  (Step 3 — medical history)
// SB-B  BMI >35                  (Step 8 — vital signs)
// SB-A  Age >50                  (Step 1 — DOB)
// SB-N  Neck circumference >40cm (Step 8)
// SB-G  Sex = male               (Step 1)
//
// Score risk mapping: 0-2 = low, 3-4 = medium, 5-8 = high.

import type { AssessmentData, FiredRule, RiskLevel, StopbangResult } from './types';
import { calculateAge } from './utils';

export function stopbangRiskFromScore(score: number): RiskLevel {
	if (score >= 5) return 'high';
	if (score >= 3) return 'medium';
	return 'low';
}

export function evaluateStopbang(d: AssessmentData): StopbangResult {
	const sh = d.socialHistory;
	const mh = d.medicalHistory;
	const vs = d.vitalSigns;
	const dem = d.demographics;
	const firedRules: FiredRule[] = [];
	let score = 0;

	if (sh.snoresLoudly === 'yes') {
		score++;
		firedRules.push({ id: 'SB-S', category: 'OSA', description: 'Snoring loudly.', riskLevel: 'medium' });
	}
	if (sh.tiredDuringDay === 'yes') {
		score++;
		firedRules.push({
			id: 'SB-T',
			category: 'OSA',
			description: 'Tired or sleepy during the day.',
			riskLevel: 'medium'
		});
	}
	if (sh.observedApnea === 'yes') {
		score++;
		firedRules.push({
			id: 'SB-O',
			category: 'OSA',
			description: 'Observed apnea during sleep.',
			riskLevel: 'medium'
		});
	}
	if (mh.hypertension === 'yes') {
		score++;
		firedRules.push({
			id: 'SB-P',
			category: 'OSA',
			description: 'Hypertension (Pressure).',
			riskLevel: 'medium'
		});
	}
	if (vs.bmi !== null && vs.bmi > 35) {
		score++;
		firedRules.push({ id: 'SB-B', category: 'OSA', description: `BMI ${vs.bmi} (>35).`, riskLevel: 'medium' });
	}
	const age = calculateAge(dem.dateOfBirth);
	if (age !== null && age > 50) {
		score++;
		firedRules.push({
			id: 'SB-A',
			category: 'OSA',
			description: `Age ${age} years (>50).`,
			riskLevel: 'medium'
		});
	}
	if (vs.neckCircumference !== null && vs.neckCircumference > 40) {
		score++;
		firedRules.push({
			id: 'SB-N',
			category: 'OSA',
			description: `Neck circumference ${vs.neckCircumference} cm (>40cm).`,
			riskLevel: 'medium'
		});
	}
	if (dem.sex === 'male') {
		score++;
		firedRules.push({ id: 'SB-G', category: 'OSA', description: 'Male sex.', riskLevel: 'medium' });
	}

	return {
		score,
		riskLevel: stopbangRiskFromScore(score),
		firedRules
	};
}
