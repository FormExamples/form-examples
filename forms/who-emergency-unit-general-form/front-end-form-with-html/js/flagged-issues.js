// WHO Emergency Unit Form: General flagged-issue detection.
// Independent of the completeness check (which is handled by the
// validator), this module raises clinically significant flags for
// dead-on-arrival, abnormal AVPU (alone or with no airway intervention),
// hypoxia (SpO2 < 90 / < 92 with no breathing intervention),
// respiratory distress, stridor, poor perfusion, abnormal vital signs,
// hypoglycaemia, pregnancy, IV drug use, severe vomiting, and
// disposition-related concerns (death, left without being seen,
// discharge with no plan).
//
// Priorities (urgent > high > medium > low) drive sort order in the
// report.

(function () {
'use strict';
window.WhoEmergencyUnitGeneralForm = window.WhoEmergencyUnitGeneralForm || {};
const {
  hasNumber,
  hasText,
  hasAirwayIntervention,
  hasBreathingIntervention,
  hasCirculationIntervention
} = window.WhoEmergencyUnitGeneralForm;

function detectFlaggedIssues(data) {
  const flags = [];
  const v = data.chiefComplaintAndVitals.initialVitals;
  const r = data.highRiskSigns;

  // ─── Dead on arrival (urgent) ─────────────────────────────
  if (data.chiefComplaintAndVitals.deadOnArrival) {
    flags.push({
      id: 'FLAG-DOA',
      category: 'Mortality',
      message: 'Patient marked as dead on arrival — confirm and complete certification.',
      priority: 'urgent'
    });
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

  // ─── SpO2 < 92 with no breathing intervention (high) ──────
  if (hasNumber(v.spo2) && v.spo2 < 92 && !hasBreathingIntervention(data)) {
    flags.push({
      id: 'FLAG-SPO2-NOINTV',
      category: 'Breathing',
      message: `SpO2 ${v.spo2}% is below 92% with no oxygen / ventilation intervention recorded — initiate supplemental oxygen.`,
      priority: 'high'
    });
  }

  // ─── SpO2 critically low (urgent) ─────────────────────────
  if (hasNumber(v.spo2) && v.spo2 < 90) {
    flags.push({
      id: 'FLAG-SPO2-CRIT',
      category: 'Breathing',
      message: `SpO2 ${v.spo2}% is critically low (< 90%).`,
      priority: 'urgent'
    });
  }

  // ─── Respiratory distress flagged (high) ──────────────────
  if (r.respiratoryDistress) {
    flags.push({
      id: 'FLAG-RESP-DISTRESS',
      category: 'Breathing',
      message:
        'Respiratory distress flagged (grunting / retractions / cyanosis) — ensure airway support and supplemental oxygen.',
      priority: 'high'
    });
  }

  // ─── Stridor / voice change / cannot swallow (urgent) ─────
  if (r.stridorOrVoiceChange) {
    flags.push({
      id: 'FLAG-STRIDOR',
      category: 'Airway',
      message:
        'Stridor, voice change, or inability to swallow — impending airway obstruction, prepare definitive airway.',
      priority: 'urgent'
    });
  }

  // ─── Poor perfusion (high) ────────────────────────────────
  if (r.poorPerfusion && !hasCirculationIntervention(data)) {
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
    const sbp = v.bpSystolic;
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
    const hr = v.pulse;
    if (hr < 50 || hr > 130) {
      flags.push({
        id: 'FLAG-VIT-HR',
        category: 'Vital signs',
        message: `Heart rate ${hr} bpm is outside the safe range (50–130).`,
        priority: 'high'
      });
    }
  }

  // ─── Respiratory rate abnormal (urgent) ──────────────────
  if (hasNumber(v.respiratoryRate)) {
    const rr = v.respiratoryRate;
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
    const t = v.tempC;
    if (t < 35 || t >= 39) {
      flags.push({
        id: 'FLAG-VIT-TEMP',
        category: 'Vital signs',
        message: `Temperature ${t}°C is outside the safe range (hypothermia < 35°C, fever ≥ 39°C).`,
        priority: 'high'
      });
    }
  }

  // ─── Hypoglycaemia (urgent) ──────────────────────────────
  if (
    hasNumber(data.disability.bloodGlucoseMmol) &&
    data.disability.bloodGlucoseMmol < 3.5
  ) {
    flags.push({
      id: 'FLAG-GLUC-LOW',
      category: 'Metabolic',
      message: `Blood glucose ${data.disability.bloodGlucoseMmol} mmol/L indicates hypoglycaemia (< 3.5).`,
      priority: 'urgent'
    });
  }

  // ─── Pregnancy reported (medium) ─────────────────────────
  if (data.pastMedicalHistory.pregnant === 'yes') {
    flags.push({
      id: 'FLAG-PREG',
      category: 'Obstetric',
      message: 'Patient is pregnant — involve obstetric team and consider relevant differentials.',
      priority: 'medium'
    });
  }

  // ─── IV drug use (medium) ────────────────────────────────
  if (data.pastMedicalHistory.ivDrugUse) {
    flags.push({
      id: 'FLAG-IVDU',
      category: 'Past medical history',
      message:
        'IV drug use — consider infectious differentials (endocarditis, abscess) and adapt analgesia plan.',
      priority: 'medium'
    });
  }

  // ─── Vomits everything / cannot feed (high) ──────────────
  if (r.vomitsEverythingOrCannotFeed) {
    flags.push({
      id: 'FLAG-DEHYDRATION',
      category: 'Hydration',
      message:
        'Patient vomits everything or cannot drink / feed — assess for dehydration, secure IV access.',
      priority: 'high'
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

window.WhoEmergencyUnitGeneralForm.detectFlaggedIssues = detectFlaggedIssues;
})();
