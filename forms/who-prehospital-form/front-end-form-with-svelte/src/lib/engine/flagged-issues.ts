import type { AssessmentData, FlaggedIssue } from './types';
import {
	gcsTotal,
	hasAirwayIntervention,
	hasBreathingIntervention,
	hasIvAccessOrFluids,
	hasNumber,
	hasText
} from './utils';

/**
 * Detects clinically significant patterns in a WHO Prehospital Form
 * submission. Independent of completeness — every required field may be
 * filled, yet the patient may still present with high-risk vitals,
 * abnormal AVPU/GCS, hypoglycaemia, uncontrolled bleeding, or other
 * findings that warrant the receiving clinician's immediate attention.
 *
 * Priorities (urgent → high → medium → low) drive sort order in the
 * report.
 */
export function detectFlaggedIssues(data: AssessmentData): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];
	const v = data.chiefComplaintAndVitals.initialVitals;
	const r = data.highRiskSigns;

	// ─── Mass casualty (urgent) ───────────────────────────────
	if (data.callerAndScene.massCasualty) {
		flags.push({
			id: 'FLAG-MASS-CASUALTY',
			category: 'Scene',
			message: 'Mass casualty incident — alert receiving facility and incident command.',
			priority: 'urgent'
		});
	}

	// ─── AVPU = U / P (urgent) ────────────────────────────────
	const avpu = data.disability.avpu;
	if (avpu === 'U') {
		flags.push({
			id: 'FLAG-AVPU-U',
			category: 'Neurological',
			message: 'Patient is unresponsive (AVPU = U) — secure airway, escalate care.',
			priority: 'urgent'
		});
	} else if (avpu === 'P') {
		flags.push({
			id: 'FLAG-AVPU-P',
			category: 'Neurological',
			message:
				'Patient responds only to pain (AVPU = P) — depressed level of consciousness.',
			priority: 'urgent'
		});
	}

	// ─── GCS < 8 without airway intervention (urgent) ─────────
	const gcs = gcsTotal(data);
	if (gcs !== null && gcs < 8 && !hasAirwayIntervention(data)) {
		flags.push({
			id: 'FLAG-GCS-AIRWAY',
			category: 'Airway',
			message: `GCS ${gcs} (< 8) with no airway intervention recorded — manage airway immediately.`,
			priority: 'urgent'
		});
	} else if (gcs !== null && gcs < 8) {
		flags.push({
			id: 'FLAG-GCS-LOW',
			category: 'Neurological',
			message: `GCS ${gcs} indicates severely depressed consciousness (< 8).`,
			priority: 'urgent'
		});
	}

	// ─── Stridor or voice change (urgent) ─────────────────────
	if (r.stridor || data.airway.stridor || data.airway.voiceChanges) {
		flags.push({
			id: 'FLAG-STRIDOR',
			category: 'Airway',
			message:
				'Stridor or voice change — impending airway obstruction, prepare definitive airway.',
			priority: 'urgent'
		});
	}

	// ─── Cyanosis (urgent) ────────────────────────────────────
	if (r.cyanosis || data.circulation.skinCyanotic) {
		flags.push({
			id: 'FLAG-CYANOSIS',
			category: 'Breathing',
			message: 'Cyanosis observed — confirm SpO2 and initiate oxygen / ventilation.',
			priority: 'urgent'
		});
	}

	// ─── SpO2 critically low < 90 (urgent) ────────────────────
	if (hasNumber(v.spo2) && (v.spo2 as number) < 90) {
		flags.push({
			id: 'FLAG-SPO2-CRIT',
			category: 'Breathing',
			message: `SpO2 ${v.spo2}% is critically low (< 90%).`,
			priority: 'urgent'
		});
	} else if (
		hasNumber(v.spo2) &&
		(v.spo2 as number) < 92 &&
		!hasBreathingIntervention(data)
	) {
		flags.push({
			id: 'FLAG-SPO2-NOINTV',
			category: 'Breathing',
			message: `SpO2 ${v.spo2}% (< 92%) with no oxygen / ventilation intervention recorded — initiate supplemental oxygen.`,
			priority: 'high'
		});
	}

	// ─── Respiratory distress flagged (high) ─────────────────
	if (r.respiratoryDistress) {
		flags.push({
			id: 'FLAG-RESP-DISTRESS',
			category: 'Breathing',
			message: 'Respiratory distress flagged — ensure airway support and supplemental oxygen.',
			priority: 'high'
		});
	}

	// ─── Hypotension without IV access / fluids (high) ───────
	const sbp = parseSystolic(v.bp);
	if (sbp !== null && sbp < 90 && !hasIvAccessOrFluids(data)) {
		flags.push({
			id: 'FLAG-HYPO-NOIV',
			category: 'Circulation',
			message: `Systolic BP ${sbp} mmHg (hypotension) with no IV access or fluids recorded — initiate fluid resuscitation.`,
			priority: 'high'
		});
	} else if (sbp !== null && sbp < 90) {
		flags.push({
			id: 'FLAG-VIT-SBP-LOW',
			category: 'Vital signs',
			message: `Systolic blood pressure ${sbp} mmHg suggests hypotension / shock (< 90).`,
			priority: 'high'
		});
	} else if (sbp !== null && sbp > 180) {
		flags.push({
			id: 'FLAG-VIT-SBP-HIGH',
			category: 'Vital signs',
			message: `Systolic blood pressure ${sbp} mmHg is severely elevated (> 180).`,
			priority: 'high'
		});
	}

	// ─── Heart rate abnormal (high) ──────────────────────────
	if (hasNumber(v.hr)) {
		const hr = v.hr as number;
		if (hr < 50 || hr > 150) {
			flags.push({
				id: 'FLAG-VIT-HR',
				category: 'Vital signs',
				message: `Heart rate ${hr} bpm is outside the safe range (50–150).`,
				priority: 'high'
			});
		}
	}

	// ─── Respiratory rate abnormal (urgent) ──────────────────
	if (hasNumber(v.rr)) {
		const rr = v.rr as number;
		if (rr < 8 || rr > 30) {
			flags.push({
				id: 'FLAG-VIT-RR',
				category: 'Vital signs',
				message: `Respiratory rate ${rr}/min is outside the safe range (8–30).`,
				priority: 'urgent'
			});
		}
	}

	// ─── Temperature abnormal (high) ─────────────────────────
	if (hasNumber(v.tempC)) {
		const t = v.tempC as number;
		if (t < 36 || t > 39) {
			flags.push({
				id: 'FLAG-VIT-TEMP',
				category: 'Vital signs',
				message: `Temperature ${t}°C is outside the safe range (36–39°C).`,
				priority: 'high'
			});
		}
	}

	// ─── Hypoglycaemia (urgent) ──────────────────────────────
	if (hasNumber(data.disability.bloodGlucose) && (data.disability.bloodGlucose as number) < 3.5) {
		flags.push({
			id: 'FLAG-GLUC-LOW',
			category: 'Metabolic',
			message: `Blood glucose ${data.disability.bloodGlucose} mmol/L indicates hypoglycaemia (< 3.5).`,
			priority: 'urgent'
		});
	} else if (r.hypoglycaemia) {
		flags.push({
			id: 'FLAG-HYPO-FLAG',
			category: 'Metabolic',
			message: 'Hypoglycaemia flagged on high-risk-signs review.',
			priority: 'urgent'
		});
	}

	// ─── Heavy bleeding without bleeding control (urgent) ────
	if (
		(r.heavyBleeding || hasText(data.circulation.activeBleedingSite)) &&
		!data.circulation.bleedingControlledBandage &&
		!data.circulation.bleedingControlledTourniquet &&
		!data.circulation.bleedingControlledDirectPressure
	) {
		flags.push({
			id: 'FLAG-BLEEDING-NOCTL',
			category: 'Circulation',
			message:
				'Heavy / active bleeding with no haemorrhage control recorded — apply pressure / tourniquet immediately.',
			priority: 'urgent'
		});
	}

	// ─── Acute convulsions (high) ────────────────────────────
	if (r.acuteConvulsions) {
		flags.push({
			id: 'FLAG-CONVULSIONS',
			category: 'Neurological',
			message:
				'Acute convulsions — protect airway, check glucose, consider seizure medication.',
			priority: 'high'
		});
	}

	// ─── High risk trauma (high) ─────────────────────────────
	if (r.highRiskTrauma) {
		flags.push({
			id: 'FLAG-HIGH-RISK-TRAUMA',
			category: 'Trauma',
			message: 'High-risk trauma — alert receiving trauma team early.',
			priority: 'high'
		});
	}

	// ─── Threatened limb (high) ──────────────────────────────
	if (r.threatenedLimb) {
		flags.push({
			id: 'FLAG-THREATENED-LIMB',
			category: 'Trauma',
			message: 'Threatened limb — splint, protect, and expedite transport.',
			priority: 'high'
		});
	}

	// ─── Snake bite (high) ───────────────────────────────────
	if (r.snakeBite) {
		flags.push({
			id: 'FLAG-SNAKE-BITE',
			category: 'Toxicology',
			message: 'Snake bite — immobilise limb, do not apply tourniquet, anticipate antivenom.',
			priority: 'high'
		});
	}

	// ─── Poisoning / chemical exposure (high) ────────────────
	if (r.poisoningIngestionChemicalExposure) {
		flags.push({
			id: 'FLAG-POISONING',
			category: 'Toxicology',
			message:
				'Poisoning, ingestion or chemical exposure — collect substance details, contact poisons centre.',
			priority: 'high'
		});
	}

	// ─── Pregnancy (medium) ──────────────────────────────────
	if (data.chiefComplaintAndVitals.pregnant === 'yes') {
		flags.push({
			id: 'FLAG-PREG',
			category: 'Obstetric',
			message: 'Patient is pregnant — alert receiving obstetric / emergency team.',
			priority: 'medium'
		});
	}

	// ─── Pregnant with high risk findings (urgent) ───────────
	if (r.pregnantWithHighRiskFindings) {
		flags.push({
			id: 'FLAG-PREG-HIGH-RISK',
			category: 'Obstetric',
			message:
				'Pregnant with high-risk findings — alert obstetric and emergency teams immediately.',
			priority: 'urgent'
		});
	}

	// ─── Severe pain (medium) ────────────────────────────────
	if (hasNumber(data.chiefComplaintAndVitals.painScore)) {
		const pain = data.chiefComplaintAndVitals.painScore as number;
		if (pain >= 7) {
			flags.push({
				id: 'FLAG-PAIN-SEVERE',
				category: 'Pain',
				message: `Severe pain reported (${pain}/10) — administer analgesia per protocol.`,
				priority: 'medium'
			});
		}
	}

	// ─── Violent / aggressive (medium) ───────────────────────
	if (r.violentOrAggressive) {
		flags.push({
			id: 'FLAG-VIOLENT',
			category: 'Safety',
			message:
				'Patient flagged as violent or aggressive — request scene safety / police support.',
			priority: 'medium'
		});
	}

	// ─── Plan not discussed with patient (low) ───────────────
	if (data.disposition.planDiscussedWithPatient === 'no') {
		flags.push({
			id: 'FLAG-PLAN-NOT-DISCUSSED',
			category: 'Disposition',
			message: 'Plan was not discussed with patient — document reason at handover.',
			priority: 'low'
		});
	}

	// Sort: urgent > high > medium > low
	const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}

/**
 * Best-effort parse of the systolic component of a free-text BP string
 * (e.g. "120/80", "120 / 80"). Returns the leading integer or null when
 * the string does not start with a number.
 */
function parseSystolic(bp: string): number | null {
	if (!hasText(bp)) return null;
	const match = bp.trim().match(/^(\d{1,3})/);
	if (!match) return null;
	const n = Number(match[1]);
	return isNaN(n) ? null : n;
}
