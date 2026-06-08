//! Detects clinically significant patterns in a WHO Prehospital Form
//! submission. Independent of completeness — every required field may be
//! filled, yet the patient may still present with high-risk vitals,
//! abnormal AVPU/GCS, hypoglycaemia, uncontrolled bleeding, or other
//! findings that warrant the receiving clinician's immediate attention.
//!
//! Priorities (urgent → high → medium → low) drive sort order in the
//! report.

use crate::engine::types::{AssessmentData, FlagPriority, FlaggedIssue};

/// True if a string is non-empty after trimming.
fn has_text(s: &str) -> bool {
    !s.trim().is_empty()
}

/// True if a numeric field has a usable value.
fn has_number(n: Option<f64>) -> bool {
    matches!(n, Some(v) if !v.is_nan())
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

/// True if any oxygen / ventilation intervention has been recorded.
fn has_breathing_intervention(data: &AssessmentData) -> bool {
    let b = &data.breathing;
    has_number(b.oxygen_litres)
        || b.oxygen_nasal_cannula
        || b.oxygen_face_mask
        || b.oxygen_non_rebreather
        || b.oxygen_bvm
        || b.oxygen_bipap_cpap
        || has_text(&b.oxygen_other)
}

/// True if any IV/IO access or fluid bolus has been recorded.
fn has_iv_access_or_fluids(data: &AssessmentData) -> bool {
    let c = &data.circulation;
    has_text(&c.access_iv_site)
        || has_text(&c.access_io_site)
        || has_number(c.ivf_mls)
        || c.ivf_ns
        || c.ivf_lr
        || has_text(&c.ivf_other)
}

/// GCS total or None when any component is missing.
fn gcs_total(data: &AssessmentData) -> Option<f64> {
    let d = &data.disability;
    match (d.gcs_eye, d.gcs_verbal, d.gcs_motor) {
        (Some(e), Some(v), Some(m)) => Some(e + v + m),
        _ => None,
    }
}

/// Best-effort parse of the systolic component of a free-text BP string.
fn parse_systolic(bp: &str) -> Option<f64> {
    let trimmed = bp.trim();
    if trimmed.is_empty() {
        return None;
    }
    // Read leading digits.
    let digits: String = trimmed.chars().take_while(|c| c.is_ascii_digit()).collect();
    if digits.is_empty() {
        return None;
    }
    digits.parse::<f64>().ok()
}

/// Detect flagged issues.
pub fn detect_flagged_issues(data: &AssessmentData) -> Vec<FlaggedIssue> {
    let mut flags: Vec<FlaggedIssue> = Vec::new();
    let v = &data.chief_complaint_and_vitals.initial_vitals;
    let r = &data.high_risk_signs;

    // ─── Mass casualty (urgent) ───────────────────────────────
    if data.caller_and_scene.mass_casualty {
        flags.push(FlaggedIssue {
            id: "FLAG-MASS-CASUALTY".into(),
            category: "Scene".into(),
            message: "Mass casualty incident — alert receiving facility and incident command."
                .into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── AVPU = U / P (urgent) ────────────────────────────────
    let avpu = data.disability.avpu.as_str();
    if avpu == "U" {
        flags.push(FlaggedIssue {
            id: "FLAG-AVPU-U".into(),
            category: "Neurological".into(),
            message: "Patient is unresponsive (AVPU = U) — secure airway, escalate care.".into(),
            priority: FlagPriority::Urgent,
        });
    } else if avpu == "P" {
        flags.push(FlaggedIssue {
            id: "FLAG-AVPU-P".into(),
            category: "Neurological".into(),
            message:
                "Patient responds only to pain (AVPU = P) — depressed level of consciousness."
                    .into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── GCS < 8 without airway intervention (urgent) ─────────
    if let Some(gcs) = gcs_total(data) {
        if gcs < 8.0 && !has_airway_intervention(data) {
            flags.push(FlaggedIssue {
                id: "FLAG-GCS-AIRWAY".into(),
                category: "Airway".into(),
                message: format!(
                    "GCS {gcs} (< 8) with no airway intervention recorded — manage airway immediately."
                ),
                priority: FlagPriority::Urgent,
            });
        } else if gcs < 8.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-GCS-LOW".into(),
                category: "Neurological".into(),
                message: format!(
                    "GCS {gcs} indicates severely depressed consciousness (< 8)."
                ),
                priority: FlagPriority::Urgent,
            });
        }
    }

    // ─── Stridor or voice change (urgent) ─────────────────────
    if r.stridor || data.airway.stridor || data.airway.voice_changes {
        flags.push(FlaggedIssue {
            id: "FLAG-STRIDOR".into(),
            category: "Airway".into(),
            message:
                "Stridor or voice change — impending airway obstruction, prepare definitive airway."
                    .into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── Cyanosis (urgent) ────────────────────────────────────
    if r.cyanosis || data.circulation.skin_cyanotic {
        flags.push(FlaggedIssue {
            id: "FLAG-CYANOSIS".into(),
            category: "Breathing".into(),
            message: "Cyanosis observed — confirm SpO2 and initiate oxygen / ventilation.".into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── SpO2 critically low / low (urgent or high) ──────────
    if let Some(spo2) = v.spo2 {
        if spo2 < 90.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-SPO2-CRIT".into(),
                category: "Breathing".into(),
                message: format!("SpO2 {spo2}% is critically low (< 90%)."),
                priority: FlagPriority::Urgent,
            });
        } else if spo2 < 92.0 && !has_breathing_intervention(data) {
            flags.push(FlaggedIssue {
                id: "FLAG-SPO2-NOINTV".into(),
                category: "Breathing".into(),
                message: format!(
                    "SpO2 {spo2}% (< 92%) with no oxygen / ventilation intervention recorded — initiate supplemental oxygen."
                ),
                priority: FlagPriority::High,
            });
        }
    }

    // ─── Respiratory distress (high) ─────────────────────────
    if r.respiratory_distress {
        flags.push(FlaggedIssue {
            id: "FLAG-RESP-DISTRESS".into(),
            category: "Breathing".into(),
            message:
                "Respiratory distress flagged — ensure airway support and supplemental oxygen."
                    .into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Hypotension / hypertension (high) ───────────────────
    if let Some(sbp) = parse_systolic(&v.bp) {
        if sbp < 90.0 && !has_iv_access_or_fluids(data) {
            flags.push(FlaggedIssue {
                id: "FLAG-HYPO-NOIV".into(),
                category: "Circulation".into(),
                message: format!(
                    "Systolic BP {sbp} mmHg (hypotension) with no IV access or fluids recorded — initiate fluid resuscitation."
                ),
                priority: FlagPriority::High,
            });
        } else if sbp < 90.0 {
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
    if let Some(hr) = v.hr {
        if hr < 50.0 || hr > 150.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-HR".into(),
                category: "Vital signs".into(),
                message: format!("Heart rate {hr} bpm is outside the safe range (50–150)."),
                priority: FlagPriority::High,
            });
        }
    }

    // ─── Respiratory rate abnormal (urgent) ──────────────────
    if let Some(rr) = v.rr {
        if rr < 8.0 || rr > 30.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-RR".into(),
                category: "Vital signs".into(),
                message: format!("Respiratory rate {rr}/min is outside the safe range (8–30)."),
                priority: FlagPriority::Urgent,
            });
        }
    }

    // ─── Temperature abnormal (high) ─────────────────────────
    if let Some(t) = v.temp_c {
        if t < 36.0 || t > 39.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-TEMP".into(),
                category: "Vital signs".into(),
                message: format!("Temperature {t}°C is outside the safe range (36–39°C)."),
                priority: FlagPriority::High,
            });
        }
    }

    // ─── Hypoglycaemia (urgent) ──────────────────────────────
    if let Some(g) = data.disability.blood_glucose {
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
    } else if r.hypoglycaemia {
        flags.push(FlaggedIssue {
            id: "FLAG-HYPO-FLAG".into(),
            category: "Metabolic".into(),
            message: "Hypoglycaemia flagged on high-risk-signs review.".into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── Heavy bleeding without bleeding control (urgent) ────
    if (r.heavy_bleeding || has_text(&data.circulation.active_bleeding_site))
        && !data.circulation.bleeding_controlled_bandage
        && !data.circulation.bleeding_controlled_tourniquet
        && !data.circulation.bleeding_controlled_direct_pressure
    {
        flags.push(FlaggedIssue {
            id: "FLAG-BLEEDING-NOCTL".into(),
            category: "Circulation".into(),
            message:
                "Heavy / active bleeding with no haemorrhage control recorded — apply pressure / tourniquet immediately."
                    .into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── Acute convulsions (high) ────────────────────────────
    if r.acute_convulsions {
        flags.push(FlaggedIssue {
            id: "FLAG-CONVULSIONS".into(),
            category: "Neurological".into(),
            message:
                "Acute convulsions — protect airway, check glucose, consider seizure medication."
                    .into(),
            priority: FlagPriority::High,
        });
    }

    // ─── High risk trauma (high) ─────────────────────────────
    if r.high_risk_trauma {
        flags.push(FlaggedIssue {
            id: "FLAG-HIGH-RISK-TRAUMA".into(),
            category: "Trauma".into(),
            message: "High-risk trauma — alert receiving trauma team early.".into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Threatened limb (high) ──────────────────────────────
    if r.threatened_limb {
        flags.push(FlaggedIssue {
            id: "FLAG-THREATENED-LIMB".into(),
            category: "Trauma".into(),
            message: "Threatened limb — splint, protect, and expedite transport.".into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Snake bite (high) ───────────────────────────────────
    if r.snake_bite {
        flags.push(FlaggedIssue {
            id: "FLAG-SNAKE-BITE".into(),
            category: "Toxicology".into(),
            message:
                "Snake bite — immobilise limb, do not apply tourniquet, anticipate antivenom."
                    .into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Poisoning / chemical exposure (high) ────────────────
    if r.poisoning_ingestion_chemical_exposure {
        flags.push(FlaggedIssue {
            id: "FLAG-POISONING".into(),
            category: "Toxicology".into(),
            message:
                "Poisoning, ingestion or chemical exposure — collect substance details, contact poisons centre."
                    .into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Pregnancy (medium) ──────────────────────────────────
    if data.chief_complaint_and_vitals.pregnant == "yes" {
        flags.push(FlaggedIssue {
            id: "FLAG-PREG".into(),
            category: "Obstetric".into(),
            message: "Patient is pregnant — alert receiving obstetric / emergency team.".into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Pregnant with high risk findings (urgent) ───────────
    if r.pregnant_with_high_risk_findings {
        flags.push(FlaggedIssue {
            id: "FLAG-PREG-HIGH-RISK".into(),
            category: "Obstetric".into(),
            message:
                "Pregnant with high-risk findings — alert obstetric and emergency teams immediately."
                    .into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── Severe pain (medium) ────────────────────────────────
    if let Some(pain) = data.chief_complaint_and_vitals.pain_score {
        if pain >= 7.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-PAIN-SEVERE".into(),
                category: "Pain".into(),
                message: format!(
                    "Severe pain reported ({pain}/10) — administer analgesia per protocol."
                ),
                priority: FlagPriority::Medium,
            });
        }
    }

    // ─── Violent / aggressive (medium) ───────────────────────
    if r.violent_or_aggressive {
        flags.push(FlaggedIssue {
            id: "FLAG-VIOLENT".into(),
            category: "Safety".into(),
            message:
                "Patient flagged as violent or aggressive — request scene safety / police support."
                    .into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Plan not discussed with patient (low) ───────────────
    if data.disposition.plan_discussed_with_patient == "no" {
        flags.push(FlaggedIssue {
            id: "FLAG-PLAN-NOT-DISCUSSED".into(),
            category: "Disposition".into(),
            message: "Plan was not discussed with patient — document reason at handover.".into(),
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
