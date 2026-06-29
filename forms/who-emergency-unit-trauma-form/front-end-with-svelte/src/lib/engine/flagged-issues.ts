import type { AssessmentData, FlaggedIssue } from './types';
import {
	hasAirwayIntervention,
	hasBreathingIntervention,
	hasCirculationIntervention,
	hasNumber,
	hasText
} from './utils';

/**
 * Detects clinically significant issues in a WHO Emergency Unit (Trauma)
 * submission. Independent of completeness — every required field may be
 * filled, yet the patient may still present with high-risk vitals,
 * abnormal AVPU, low GCS, hypoglycaemia, RED triage with missing airway /
 * breathing interventions, dead-on-arrival without time of death, or other
 * findings that warrant the clinician's immediate attention.
 *
 * Priorities (urgent → high → medium → low) drive sort order in the
 * report.
 */
export function detectFlaggedIssues(data: AssessmentData): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];
	const v = data.chiefComplaintAndVitals.initialVitals;
	const r = data.highRiskSigns;

	// ─── Dead on arrival (urgent) ─────────────────────────────
	if (data.chiefComplaintAndVitals.deadOnArrival) {
		if (!hasText(data.chiefComplaintAndVitals.timeOfDeath)) {
			flags.push({
				id: 'FLAG-DOA-NO-TIME',
				category: 'Mortality',
				message:
					'Patient marked as dead on arrival but time of death is not recorded — required for certification.',
				priority: 'high'
			});
		}
		flags.push({
			id: 'FLAG-DOA',
			category: 'Mortality',
			message: 'Patient marked as dead on arrival — confirm and complete certification.',
			priority: 'urgent'
		});
	}

	// ─── RED triage without airway intervention or assessment (urgent) ───
	if (data.triage.category === 'red') {
		if (!data.airway.normal && !hasAirwayIntervention(data)) {
			flags.push({
				id: 'FLAG-RED-AIRWAY',
				category: 'Triage',
				message:
					'RED triage patient has no airway intervention and airway is not marked Normal — reassess airway management urgently.',
				priority: 'urgent'
			});
		}
		if (!data.breathing.normal && !hasBreathingIntervention(data)) {
			flags.push({
				id: 'FLAG-RED-BREATHING',
				category: 'Triage',
				message:
					'RED triage patient has no breathing / oxygen intervention and breathing is not marked Normal — escalate ventilatory support.',
				priority: 'urgent'
			});
		}
	}

	// ─── Abnormal AVPU + no airway intervention (urgent) ──────
	const avpu = data.disability.avpu;
	const avpuAbnormal = avpu === 'V' || avpu === 'P' || avpu === 'U';
	if (avpuAbnormal && !hasAirwayIntervention(data)) {
		flags.push({
			id: 'FLAG-AVPU-AIRWAY',
			category: 'Airway',
			message: `AVPU = ${avpu} (abnormal) without any airway intervention recorded — reassess airway management.`,
			priority: 'urgent'
		});
	}

	// ─── AVPU = U / P alone (urgent) ──────────────────────────
	if (avpu === 'U') {
		flags.push({
			id: 'FLAG-AVPU-U',
			category: 'Neurological',
			message: 'Patient is unresponsive (AVPU = U) — manage airway, perform full neuro work-up.',
			priority: 'urgent'
		});
	} else if (avpu === 'P') {
		flags.push({
			id: 'FLAG-AVPU-P',
			category: 'Neurological',
			message:
				'Patient responds only to pain (AVPU = P) — depressed level of consciousness, escalate care.',
			priority: 'urgent'
		});
	}

	// ─── Low GCS (urgent) ─────────────────────────────────────
	if (hasNumber(data.disability.gcsTotal)) {
		const gcs = data.disability.gcsTotal as number;
		if (gcs <= 8) {
			flags.push({
				id: 'FLAG-GCS-LOW',
				category: 'Neurological',
				message: `GCS ${gcs} — severe head injury / depressed consciousness, definitive airway likely required.`,
				priority: 'urgent'
			});
		} else if (gcs <= 12) {
			flags.push({
				id: 'FLAG-GCS-MOD',
				category: 'Neurological',
				message: `GCS ${gcs} — moderate head injury, monitor closely.`,
				priority: 'high'
			});
		}
	}

	// ─── SpO2 < 92 with no breathing intervention (high) ──────
	if (hasNumber(v.spo2) && (v.spo2 as number) < 92 && !hasBreathingIntervention(data)) {
		flags.push({
			id: 'FLAG-SPO2-NOINTV',
			category: 'Breathing',
			message: `SpO2 ${v.spo2}% is below 92% with no oxygen / ventilation intervention recorded — initiate supplemental oxygen.`,
			priority: 'high'
		});
	}

	// ─── SpO2 critically low (urgent) ─────────────────────────
	if (hasNumber(v.spo2) && (v.spo2 as number) < 90) {
		flags.push({
			id: 'FLAG-SPO2-CRIT',
			category: 'Breathing',
			message: `SpO2 ${v.spo2}% is critically low (< 90%).`,
			priority: 'urgent'
		});
	}

	// ─── Stridor / voice change / cyanosis red sign (urgent) ──
	if (r.redStridor) {
		flags.push({
			id: 'FLAG-STRIDOR',
			category: 'Airway',
			message:
				'Stridor flagged as red sign — impending airway obstruction, prepare definitive airway.',
			priority: 'urgent'
		});
	}
	if (r.redCyanosis) {
		flags.push({
			id: 'FLAG-CYANOSIS',
			category: 'Breathing',
			message: 'Cyanosis flagged — assess and treat hypoxia immediately.',
			priority: 'urgent'
		});
	}
	if (r.redRespiratoryDistress) {
		flags.push({
			id: 'FLAG-RESP-DISTRESS',
			category: 'Breathing',
			message:
				'Respiratory distress flagged — ensure airway support and supplemental oxygen.',
			priority: 'high'
		});
	}

	// ─── Heavy bleeding without circulation intervention (urgent) ───
	if (r.redHeavyBleeding && !hasCirculationIntervention(data)) {
		flags.push({
			id: 'FLAG-HEAVY-BLEED',
			category: 'Circulation',
			message:
				'Heavy bleeding flagged with no circulation intervention recorded — apply pressure / tourniquet, secure IV access, give fluids.',
			priority: 'urgent'
		});
	}

	// ─── Poor perfusion (high) ────────────────────────────────
	if (
		(r.redPoorPerfusion || r.redWeakFastPulse || r.redCapRefillOver3) &&
		!hasCirculationIntervention(data)
	) {
		flags.push({
			id: 'FLAG-POOR-PERFUSION',
			category: 'Circulation',
			message:
				'Poor perfusion / weak pulse / capillary refill > 3s with no circulation intervention recorded — initiate fluid resuscitation.',
			priority: 'high'
		});
	}

	// ─── Hypotension / hypertension (high) ───────────────────
	if (hasNumber(v.bpSystolic)) {
		const sbp = v.bpSystolic as number;
		if (sbp < 90) {
			flags.push({
				id: 'FLAG-VIT-SBP-LOW',
				category: 'Vital signs',
				message: `Systolic blood pressure ${sbp} mmHg suggests hypotension / shock (< 90).`,
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

	// ─── Heart rate abnormal (high) ──────────────────────────
	if (hasNumber(v.pulse)) {
		const hr = v.pulse as number;
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

	// ─── Temperature abnormal (high) ─────────────────────────
	if (hasNumber(v.tempC)) {
		const t = v.tempC as number;
		if (t < 35 || t >= 39) {
			flags.push({
				id: 'FLAG-VIT-TEMP',
				category: 'Vital signs',
				message: `Temperature ${t}°C is outside the safe range (hypothermia < 35°C, fever ≥ 39°C).`,
				priority: 'high'
			});
		}
	}

	// ─── Hypoglycaemia (urgent; threshold ≤ 65 mg/dL per WHO trauma) ──
	if (
		hasNumber(data.disability.bloodGlucose) &&
		(data.disability.bloodGlucose as number) < 65
	) {
		flags.push({
			id: 'FLAG-GLUC-LOW',
			category: 'Metabolic',
			message: `Blood glucose ${data.disability.bloodGlucose} mg/dL indicates hypoglycaemia (< 65).`,
			priority: 'urgent'
		});
	}

	// ─── Polytrauma (high) ───────────────────────────────────
	if (r.traumaPolytrauma) {
		flags.push({
			id: 'FLAG-POLYTRAUMA',
			category: 'Trauma indicators',
			message: 'Polytrauma flagged — multi-system injury, mobilise trauma team.',
			priority: 'high'
		});
	}

	// ─── Penetrating trauma (high) ───────────────────────────
	if (r.traumaAllPenetrating || r.traumaPenetratingDistalUncontrolledBleeding) {
		flags.push({
			id: 'FLAG-PENETRATING',
			category: 'Trauma indicators',
			message: 'Penetrating trauma flagged — assess for occult injury and surgical needs.',
			priority: 'high'
		});
	}

	// ─── Crush injury (high) ─────────────────────────────────
	if (r.traumaCrushInjury) {
		flags.push({
			id: 'FLAG-CRUSH',
			category: 'Trauma indicators',
			message:
				'Crush injury flagged — monitor for rhabdomyolysis, compartment syndrome, hyperkalaemia.',
			priority: 'high'
		});
	}

	// ─── Bleeding disorder / anticoagulation (high) ──────────
	if (r.traumaBleedingDisorderOrAnticoag) {
		flags.push({
			id: 'FLAG-ANTICOAG',
			category: 'Trauma indicators',
			message:
				'Patient on anticoagulation / has bleeding disorder — reverse if needed and lower threshold for imaging.',
			priority: 'high'
		});
	}

	// ─── Pregnancy (medium / high) ───────────────────────────
	if (data.patientRegistration.pregnant === 'yes' || r.traumaPregnant) {
		flags.push({
			id: 'FLAG-PREG',
			category: 'Obstetric',
			message:
				'Patient is pregnant — involve obstetric team, assess fetal status and consider relevant differentials.',
			priority: 'high'
		});
	}

	// ─── IV drug use (medium) ────────────────────────────────
	if (data.patientRegistration.ivDrugUse) {
		flags.push({
			id: 'FLAG-IVDU',
			category: 'Past medical history',
			message:
				'IV drug use — consider infectious differentials and adapt analgesia plan.',
			priority: 'medium'
		});
	}

	// ─── Unstable pelvis (urgent) ────────────────────────────
	if (data.circulation.unstablePelvis === 'yes') {
		flags.push({
			id: 'FLAG-UNSTABLE-PELVIS',
			category: 'Circulation',
			message:
				'Unstable pelvis — apply pelvic binder, anticipate massive transfusion and surgical consult.',
			priority: 'urgent'
		});
	}

	// ─── FAST positive (urgent) ──────────────────────────────
	if (data.exposureAndFast.fastPeritoneum === 'free-fluid') {
		flags.push({
			id: 'FLAG-FAST-PERIT',
			category: 'FAST',
			message: 'FAST positive: free fluid in peritoneum — surgical consultation indicated.',
			priority: 'urgent'
		});
	}
	if (
		data.exposureAndFast.fastChest === 'pneumothorax' ||
		data.exposureAndFast.fastChest === 'pleural-fluid' ||
		data.exposureAndFast.fastChest === 'pericardial-effusion'
	) {
		flags.push({
			id: 'FLAG-FAST-CHEST',
			category: 'FAST',
			message: `FAST chest finding (${data.exposureAndFast.fastChest}) — emergent intervention required.`,
			priority: 'urgent'
		});
	}

	// ─── High-energy mechanism (high) ────────────────────────
	if (r.rtHighSpeedCrash || r.rtTrappedOrThrown || r.rtOtherInVehicleDied) {
		flags.push({
			id: 'FLAG-HIGH-ENERGY',
			category: 'Mechanism',
			message:
				'High-energy mechanism (high-speed crash / trapped or thrown / fatality in same vehicle) — full trauma evaluation.',
			priority: 'high'
		});
	}

	// ─── Pedestrian / cyclist (high) ─────────────────────────
	if (r.rtPedestrianOrCyclistHit) {
		flags.push({
			id: 'FLAG-PED-CYCLIST',
			category: 'Mechanism',
			message:
				'Pedestrian or cyclist hit by vehicle — high force injury, evaluate for occult trauma.',
			priority: 'high'
		});
	}

	// ─── Loss of consciousness (medium / high) ───────────────
	if (data.injuryHistory.lossOfConsciousnessDuration === '30min-24hr') {
		flags.push({
			id: 'FLAG-LOC-LONG',
			category: 'Neurological',
			message:
				'Loss of consciousness 30 min – 24 hr — head CT and neurological observation indicated.',
			priority: 'high'
		});
	} else if (data.injuryHistory.lossOfConsciousnessDuration === '5-29min') {
		flags.push({
			id: 'FLAG-LOC-MED',
			category: 'Neurological',
			message: 'Loss of consciousness 5–29 min — consider head CT and neurological observation.',
			priority: 'medium'
		});
	}

	// ─── Patient died (urgent) ───────────────────────────────
	if (data.disposition.disposition === 'died') {
		flags.push({
			id: 'FLAG-DISPO-DIED',
			category: 'Mortality',
			message: hasText(data.disposition.diedCause)
				? `Patient died — cause: ${data.disposition.diedCause.trim()}.`
				: 'Patient died — record cause of death (NOT cardiopulmonary arrest).',
			priority: 'urgent'
		});
	}

	// ─── Patient left without being seen (medium) ───────────
	if (data.disposition.leftWithoutBeingSeen) {
		flags.push({
			id: 'FLAG-LWBS',
			category: 'Disposition',
			message:
				'Patient left without being seen or before treatment was complete — document follow-up plan.',
			priority: 'medium'
		});
	}

	// ─── Discharge plan not discussed (low) ─────────────────
	if (
		data.disposition.disposition === 'discharge' &&
		data.disposition.dischargePlanDiscussed === 'no'
	) {
		flags.push({
			id: 'FLAG-DISP-NOPLAN',
			category: 'Disposition',
			message:
				'Patient discharged but discharge plan was not discussed — confirm follow-up before release.',
			priority: 'low'
		});
	}

	// Sort: urgent > high > medium > low
	const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
