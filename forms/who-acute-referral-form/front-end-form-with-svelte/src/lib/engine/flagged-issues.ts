import type { AssessmentData, FlaggedIssue } from './types';
import { hasNumber } from './utils';

/**
 * Detects clinically significant issues in a WHO acute referral submission.
 * These are independent of completeness — for example, the patient may have
 * filled every field but disclose an aspiration risk, abnormal vital signs,
 * or a highly infectious condition that requires urgent attention from the
 * receiving facility.
 *
 * Priorities (urgent → high → medium → low) drive sort order in the report.
 */
export function detectFlaggedIssues(data: AssessmentData): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];
	const v = data.assessment.vitalSigns;
	const p = data.recommendations.precautions;

	// ─── Highly infectious disease (urgent) ───────────────────
	if (p.highlyInfectiousDisease) {
		flags.push({
			id: 'FLAG-INF-001',
			category: 'Infection control',
			message:
				'Highly infectious disease precaution flagged — receiving facility must prepare isolation and PPE.',
			priority: 'urgent'
		});
	}

	// ─── Vital signs: airway/breathing/oxygenation (urgent) ───
	if (hasNumber(v.oxygenSaturation) && (v.oxygenSaturation as number) < 90) {
		flags.push({
			id: 'FLAG-VIT-SPO2',
			category: 'Vital signs',
			message: `Oxygen saturation ${v.oxygenSaturation}% is critically low (< 90%).`,
			priority: 'urgent'
		});
	}

	if (hasNumber(v.respiratoryRate)) {
		const rr = v.respiratoryRate as number;
		if (rr < 8 || rr > 30) {
			flags.push({
				id: 'FLAG-VIT-RR',
				category: 'Vital signs',
				message: `Respiratory rate ${rr}/min is outside the safe range (8–30).`,
				priority: 'urgent'
			});
		}
	}

	if (hasNumber(v.glasgowComaScale) && (v.glasgowComaScale as number) <= 8) {
		flags.push({
			id: 'FLAG-VIT-GCS',
			category: 'Vital signs',
			message: `Glasgow Coma Scale ${v.glasgowComaScale} indicates severely depressed consciousness (≤ 8).`,
			priority: 'urgent'
		});
	}

	// ─── Vital signs: circulation / perfusion (high) ──────────
	if (hasNumber(v.systolicBloodPressure)) {
		const sbp = v.systolicBloodPressure as number;
		if (sbp < 90) {
			flags.push({
				id: 'FLAG-VIT-SBP-LOW',
				category: 'Vital signs',
				message: `Systolic blood pressure ${sbp} mmHg suggests hypotension/shock (< 90).`,
				priority: 'high'
			});
		} else if (sbp > 180) {
			flags.push({
				id: 'FLAG-VIT-SBP-HIGH',
				category: 'Vital signs',
				message: `Systolic blood pressure ${sbp} mmHg is severely elevated (> 180).`,
				priority: 'high'
			});
		}
	}

	if (hasNumber(v.heartRate)) {
		const hr = v.heartRate as number;
		if (hr < 50 || hr > 130) {
			flags.push({
				id: 'FLAG-VIT-HR',
				category: 'Vital signs',
				message: `Heart rate ${hr}/min is outside the safe range (50–130).`,
				priority: 'high'
			});
		}
	}

	if (hasNumber(v.temperatureCelsius)) {
		const t = v.temperatureCelsius as number;
		if (t < 35 || t >= 39) {
			flags.push({
				id: 'FLAG-VIT-TEMP',
				category: 'Vital signs',
				message: `Temperature ${t}°C is outside the safe range (hypothermia < 35°C, hyperpyrexia ≥ 39°C).`,
				priority: 'high'
			});
		}
	}

	// ─── Aspiration risk (high) ───────────────────────────────
	if (p.aspirationRisk) {
		flags.push({
			id: 'FLAG-PRC-ASP',
			category: 'Precaution',
			message:
				'Aspiration risk flagged — keep airway protected and head-up positioning during transport.',
			priority: 'high'
		});
	}

	// ─── Spinal precautions (high) ────────────────────────────
	if (p.spinalPrecautions) {
		flags.push({
			id: 'FLAG-PRC-SPN',
			category: 'Precaution',
			message:
				'Spinal precautions in place — maintain immobilisation throughout the transfer.',
			priority: 'high'
		});
	}

	// ─── Pregnancy with critical condition (high) ─────────────
	if (data.situation.pregnant === 'yes') {
		flags.push({
			id: 'FLAG-PREG',
			category: 'Obstetric',
			message:
				'Patient is pregnant — receiving facility should involve obstetric team on arrival.',
			priority: 'high'
		});
	}

	// ─── Provider has documented potential worsening (high) ───
	if (
		typeof data.recommendations.potentialWorseningOfCondition === 'string' &&
		data.recommendations.potentialWorseningOfCondition.trim() !== ''
	) {
		flags.push({
			id: 'FLAG-WORSEN',
			category: 'Trajectory',
			message:
				'Initiating provider has documented anticipated deterioration during transport — see recommendations.',
			priority: 'high'
		});
	}

	// ─── Fall risk (medium) ───────────────────────────────────
	if (p.fallRisk) {
		flags.push({
			id: 'FLAG-PRC-FALL',
			category: 'Precaution',
			message: 'Fall risk flagged — ensure stretcher straps and bed-rails on arrival.',
			priority: 'medium'
		});
	}

	// ─── Weight-bearing restrictions (medium) ────────────────
	if (p.weightBearingRestrictions) {
		flags.push({
			id: 'FLAG-PRC-WBR',
			category: 'Precaution',
			message:
				'Weight-bearing restrictions flagged — manual handling plan required for transfers.',
			priority: 'medium'
		});
	}

	// ─── Other documented precaution (medium) ────────────────
	if (p.other && typeof p.otherDetails === 'string' && p.otherDetails.trim() !== '') {
		flags.push({
			id: 'FLAG-PRC-OTHER',
			category: 'Precaution',
			message: `Other precaution flagged: ${p.otherDetails.trim()}`,
			priority: 'medium'
		});
	}

	// ─── Cautions regarding prior therapies (medium) ─────────
	if (
		typeof data.recommendations.cautionsRegardingPriorTherapies === 'string' &&
		data.recommendations.cautionsRegardingPriorTherapies.trim() !== ''
	) {
		flags.push({
			id: 'FLAG-CAUTION',
			category: 'Therapy caution',
			message:
				'Cautions regarding prior therapies or interventions documented — review before continuing care.',
			priority: 'medium'
		});
	}

	// ─── Air or sea transfer (low) ───────────────────────────
	if (
		data.facilityAndTransport.modeOfTransfer === 'air' ||
		data.facilityAndTransport.modeOfTransfer === 'sea'
	) {
		flags.push({
			id: 'FLAG-MODE',
			category: 'Transport',
			message: `Mode of transfer is ${data.facilityAndTransport.modeOfTransfer.toUpperCase()} — confirm equipment is rated for the environment.`,
			priority: 'low'
		});
	}

	// Sort: urgent > high > medium > low
	const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
