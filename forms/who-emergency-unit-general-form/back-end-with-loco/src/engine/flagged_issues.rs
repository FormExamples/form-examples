//! Detects clinically significant issues in a WHO Emergency Unit (General)
//! submission. Independent of completeness — every required field may be
//! filled, yet the patient may still present with high-risk vitals,
//! abnormal AVPU, hypoglycaemia, or other findings that warrant the
//! clinician's immediate attention.
//!
//! Priorities (urgent → high → medium → low) drive sort order in the
//! report.

use crate::engine::types::{AssessmentData, FlagPriority, FlaggedIssue};

/// True if a string is non-empty after trimming.
fn has_text(s: &str) -> bool {
    !s.trim().is_empty()
}

/// True if any airway intervention has been recorded.
fn has_airway_intervention(data: &AssessmentData) -> bool {
    let a = &data.airway;
    a.intervention_repositioning
        || a.intervention_suction
        || a.intervention_opa
        || a.intervention_npa
        || a.intervention_lma
        || a.intervention_bvm
        || a.intervention_ett
}

/// True if any breathing/oxygen intervention has been recorded.
fn has_breathing_intervention(data: &AssessmentData) -> bool {
    let b = &data.breathing;
    b.oxygen_nasal_cannula
        || b.oxygen_mask
        || b.oxygen_non_rebreather
        || b.oxygen_bvm
        || b.oxygen_cpap_bipap
        || b.oxygen_ventilator
        || b.bronchodilator
}

/// True if any circulation intervention (access or fluids or blood/epi) is recorded.
fn has_circulation_intervention(data: &AssessmentData) -> bool {
    let c = &data.circulation;
    has_text(&c.access_iv_location)
        || has_text(&c.access_cvl_location)
        || has_text(&c.access_io_location)
        || c.ivf_mls.is_some()
        || c.blood_ordered
        || c.epinephrine_given
}

/// Detect flagged issues.
pub fn detect_flagged_issues(data: &AssessmentData) -> Vec<FlaggedIssue> {
    let mut flags: Vec<FlaggedIssue> = Vec::new();
    let v = &data.chief_complaint_and_vitals.initial_vitals;
    let r = &data.high_risk_signs;

    // ─── Dead on arrival (urgent) ─────────────────────────────
    if data.chief_complaint_and_vitals.dead_on_arrival {
        flags.push(FlaggedIssue {
            id: "FLAG-DOA".into(),
            category: "Mortality".into(),
            message:
                "Patient marked as dead on arrival - confirm and complete certification.".into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── Abnormal AVPU + no airway intervention (urgent) ──────
    let avpu = data.disability.avpu.as_str();
    let avpu_abnormal = avpu == "V" || avpu == "P" || avpu == "U";
    if avpu_abnormal && !has_airway_intervention(data) {
        flags.push(FlaggedIssue {
            id: "FLAG-AVPU-AIRWAY".into(),
            category: "Airway".into(),
            message: format!(
                "AVPU = {avpu} (abnormal) without any airway intervention recorded - reassess airway management."
            ),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── AVPU = U / P alone (urgent) ──────────────────────────
    if avpu == "U" {
        flags.push(FlaggedIssue {
            id: "FLAG-AVPU-U".into(),
            category: "Neurological".into(),
            message:
                "Patient is unresponsive (AVPU = U) - manage airway, perform full neuro work-up.".into(),
            priority: FlagPriority::Urgent,
        });
    } else if avpu == "P" {
        flags.push(FlaggedIssue {
            id: "FLAG-AVPU-P".into(),
            category: "Neurological".into(),
            message:
                "Patient responds only to pain (AVPU = P) - depressed level of consciousness, escalate care.".into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── SpO2 < 92 with no breathing intervention (high) ──────
    if let Some(spo2) = v.spo2 {
        if spo2 < 92.0 && !has_breathing_intervention(data) {
            flags.push(FlaggedIssue {
                id: "FLAG-SPO2-NOINTV".into(),
                category: "Breathing".into(),
                message: format!(
                    "SpO2 {spo2}% is below 92% with no oxygen / ventilation intervention recorded - initiate supplemental oxygen."
                ),
                priority: FlagPriority::High,
            });
        }
    }

    // ─── SpO2 critically low (urgent) ─────────────────────────
    if let Some(spo2) = v.spo2 {
        if spo2 < 90.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-SPO2-CRIT".into(),
                category: "Breathing".into(),
                message: format!("SpO2 {spo2}% is critically low (< 90%)."),
                priority: FlagPriority::Urgent,
            });
        }
    }

    // ─── Respiratory distress flagged (high) ──────────────────
    if r.respiratory_distress {
        flags.push(FlaggedIssue {
            id: "FLAG-RESP-DISTRESS".into(),
            category: "Breathing".into(),
            message:
                "Respiratory distress flagged (grunting / retractions / cyanosis) - ensure airway support and supplemental oxygen.".into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Stridor / voice change / cannot swallow (urgent) ─────
    if r.stridor_or_voice_change {
        flags.push(FlaggedIssue {
            id: "FLAG-STRIDOR".into(),
            category: "Airway".into(),
            message:
                "Stridor, voice change, or inability to swallow - impending airway obstruction, prepare definitive airway.".into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── Poor perfusion (high) ────────────────────────────────
    if r.poor_perfusion && !has_circulation_intervention(data) {
        flags.push(FlaggedIssue {
            id: "FLAG-POOR-PERFUSION".into(),
            category: "Circulation".into(),
            message:
                "Poor perfusion / weak pulse / capillary refill > 3s with no circulation intervention recorded - initiate fluid resuscitation.".into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Hypotension / hypertension (high) ───────────────────
    if let Some(sbp) = v.bp_systolic {
        if sbp < 90.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-SBP-LOW".into(),
                category: "Vital signs".into(),
                message: format!(
                    "Systolic blood pressure {sbp} mmHg suggests hypotension / shock (< 90)."
                ),
                priority: FlagPriority::High,
            });
        } else if sbp > 180.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-SBP-HIGH".into(),
                category: "Vital signs".into(),
                message: format!(
                    "Systolic blood pressure {sbp} mmHg is severely elevated (> 180)."
                ),
                priority: FlagPriority::High,
            });
        }
    }

    // ─── Heart rate abnormal (high) ──────────────────────────
    if let Some(hr) = v.pulse {
        if hr < 50.0 || hr > 130.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-HR".into(),
                category: "Vital signs".into(),
                message: format!("Heart rate {hr} bpm is outside the safe range (50-130)."),
                priority: FlagPriority::High,
            });
        }
    }

    // ─── Respiratory rate abnormal (urgent) ──────────────────
    if let Some(rr) = v.respiratory_rate {
        if rr < 8.0 || rr > 30.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-RR".into(),
                category: "Vital signs".into(),
                message: format!(
                    "Respiratory rate {rr}/min is outside the safe range (8-30)."
                ),
                priority: FlagPriority::Urgent,
            });
        }
    }

    // ─── Temperature abnormal (high) ─────────────────────────
    if let Some(t) = v.temp_c {
        if t < 35.0 || t >= 39.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-TEMP".into(),
                category: "Vital signs".into(),
                message: format!(
                    "Temperature {t}C is outside the safe range (hypothermia < 35C, fever >= 39C)."
                ),
                priority: FlagPriority::High,
            });
        }
    }

    // ─── Hypoglycaemia (urgent) ──────────────────────────────
    if let Some(g) = data.disability.blood_glucose_mmol {
        if g < 3.5 {
            flags.push(FlaggedIssue {
                id: "FLAG-GLUC-LOW".into(),
                category: "Metabolic".into(),
                message: format!(
                    "Blood glucose {g} mmol/L indicates hypoglycaemia (< 3.5)."
                ),
                priority: FlagPriority::Urgent,
            });
        }
    }

    // ─── Pregnancy reported (medium) ─────────────────────────
    if data.past_medical_history.pregnant == "yes" {
        flags.push(FlaggedIssue {
            id: "FLAG-PREG".into(),
            category: "Obstetric".into(),
            message:
                "Patient is pregnant - involve obstetric team and consider relevant differentials.".into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── IV drug use (medium) ────────────────────────────────
    if data.past_medical_history.iv_drug_use {
        flags.push(FlaggedIssue {
            id: "FLAG-IVDU".into(),
            category: "Past medical history".into(),
            message:
                "IV drug use - consider infectious differentials (endocarditis, abscess) and adapt analgesia plan.".into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Vomits everything / cannot feed (high) ──────────────
    if r.vomits_everything_or_cannot_feed {
        flags.push(FlaggedIssue {
            id: "FLAG-DEHYDRATION".into(),
            category: "Hydration".into(),
            message:
                "Patient vomits everything or cannot drink / feed - assess for dehydration, secure IV access.".into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Patient died (urgent) ───────────────────────────────
    if data.disposition.disposition == "died" {
        let msg = if has_text(&data.disposition.died_cause) {
            format!(
                "Patient died - cause: {}.",
                data.disposition.died_cause.trim()
            )
        } else {
            "Patient died - record cause of death (NOT cardiopulmonary arrest).".to_string()
        };
        flags.push(FlaggedIssue {
            id: "FLAG-DISPO-DIED".into(),
            category: "Mortality".into(),
            message: msg,
            priority: FlagPriority::Urgent,
        });
    }

    // ─── Patient left without being seen (medium) ───────────
    if data.disposition.left_without_being_seen {
        flags.push(FlaggedIssue {
            id: "FLAG-LWBS".into(),
            category: "Disposition".into(),
            message:
                "Patient left without being seen or before treatment was complete - document follow-up plan.".into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Discharge plan not discussed (low) ─────────────────
    if data.disposition.disposition == "discharge"
        && data.disposition.discharge_plan_discussed == "no"
    {
        flags.push(FlaggedIssue {
            id: "FLAG-DISP-NOPLAN".into(),
            category: "Disposition".into(),
            message:
                "Patient discharged but discharge plan was not discussed - confirm follow-up before release.".into(),
            priority: FlagPriority::Low,
        });
    }

    fn order(p: FlagPriority) -> u8 {
        match p {
            FlagPriority::Urgent => 0,
            FlagPriority::High => 1,
            FlagPriority::Medium => 2,
            FlagPriority::Low => 3,
        }
    }
    flags.sort_by_key(|f| order(f.priority));
    flags
}
