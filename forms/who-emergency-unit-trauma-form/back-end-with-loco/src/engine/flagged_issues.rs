//! Detects clinically significant issues in a WHO Emergency Unit (Trauma)
//! submission. Independent of completeness — every required field may be
//! filled, yet the patient may still present with high-risk vitals,
//! abnormal AVPU, low GCS, hypoglycaemia, RED triage with missing airway /
//! breathing interventions, dead-on-arrival without time of death, FAST
//! positives, or other findings that warrant the clinician's immediate
//! attention.
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

/// True if any breathing/oxygen intervention has been recorded.
fn has_breathing_intervention(data: &AssessmentData) -> bool {
    let b = &data.breathing;
    b.oxygen_nasal_cannula
        || b.oxygen_mask
        || b.oxygen_non_rebreather
        || b.oxygen_bvm
        || b.oxygen_cpap_bipap
        || b.oxygen_ventilator
        || has_text(&b.chest_tube_left_size)
        || has_text(&b.chest_tube_right_size)
}

/// True if any circulation intervention (access, fluids, blood, bleeding
/// control) has been recorded.
fn has_circulation_intervention(data: &AssessmentData) -> bool {
    let c = &data.circulation;
    has_text(&c.access_iv_location)
        || has_text(&c.access_central_location)
        || has_text(&c.access_io_location)
        || has_text(&c.access_line2_location)
        || has_number(c.ivf_mls)
        || c.blood_ordered
        || c.blood_given
        || c.bleeding_control_direct_pressure
        || c.bleeding_control_bandage
        || c.bleeding_control_tourniquet
}

pub fn detect_flagged_issues(data: &AssessmentData) -> Vec<FlaggedIssue> {
    let mut flags: Vec<FlaggedIssue> = Vec::new();
    let v = &data.chief_complaint_and_vitals.initial_vitals;
    let r = &data.high_risk_signs;

    // ─── Dead on arrival (urgent) ─────────────────────────────
    if data.chief_complaint_and_vitals.dead_on_arrival {
        if !has_text(&data.chief_complaint_and_vitals.time_of_death) {
            flags.push(FlaggedIssue {
                id: "FLAG-DOA-NO-TIME".into(),
                category: "Mortality".into(),
                message:
                    "Patient marked as dead on arrival but time of death is not recorded - required for certification.".into(),
                priority: FlagPriority::High,
            });
        }
        flags.push(FlaggedIssue {
            id: "FLAG-DOA".into(),
            category: "Mortality".into(),
            message:
                "Patient marked as dead on arrival - confirm and complete certification.".into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── RED triage without airway / breathing intervention (urgent) ─
    if data.triage.category == "red" {
        if !data.airway.normal && !has_airway_intervention(data) {
            flags.push(FlaggedIssue {
                id: "FLAG-RED-AIRWAY".into(),
                category: "Triage".into(),
                message:
                    "RED triage patient has no airway intervention and airway is not marked Normal - reassess airway management urgently.".into(),
                priority: FlagPriority::Urgent,
            });
        }
        if !data.breathing.normal && !has_breathing_intervention(data) {
            flags.push(FlaggedIssue {
                id: "FLAG-RED-BREATHING".into(),
                category: "Triage".into(),
                message:
                    "RED triage patient has no breathing / oxygen intervention and breathing is not marked Normal - escalate ventilatory support.".into(),
                priority: FlagPriority::Urgent,
            });
        }
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

    // ─── Low GCS (urgent / high) ──────────────────────────────
    if let Some(gcs) = data.disability.gcs_total {
        if gcs <= 8.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-GCS-LOW".into(),
                category: "Neurological".into(),
                message: format!(
                    "GCS {gcs} - severe head injury / depressed consciousness, definitive airway likely required."
                ),
                priority: FlagPriority::Urgent,
            });
        } else if gcs <= 12.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-GCS-MOD".into(),
                category: "Neurological".into(),
                message: format!("GCS {gcs} - moderate head injury, monitor closely."),
                priority: FlagPriority::High,
            });
        }
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
        // ─── SpO2 critically low (urgent) ─────────────────────
        if spo2 < 90.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-SPO2-CRIT".into(),
                category: "Breathing".into(),
                message: format!("SpO2 {spo2}% is critically low (< 90%)."),
                priority: FlagPriority::Urgent,
            });
        }
    }

    // ─── Stridor / cyanosis / respiratory distress red signs ──
    if r.red_stridor {
        flags.push(FlaggedIssue {
            id: "FLAG-STRIDOR".into(),
            category: "Airway".into(),
            message:
                "Stridor flagged as red sign - impending airway obstruction, prepare definitive airway.".into(),
            priority: FlagPriority::Urgent,
        });
    }
    if r.red_cyanosis {
        flags.push(FlaggedIssue {
            id: "FLAG-CYANOSIS".into(),
            category: "Breathing".into(),
            message: "Cyanosis flagged - assess and treat hypoxia immediately.".into(),
            priority: FlagPriority::Urgent,
        });
    }
    if r.red_respiratory_distress {
        flags.push(FlaggedIssue {
            id: "FLAG-RESP-DISTRESS".into(),
            category: "Breathing".into(),
            message:
                "Respiratory distress flagged - ensure airway support and supplemental oxygen.".into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Heavy bleeding without circulation intervention (urgent) ───
    if r.red_heavy_bleeding && !has_circulation_intervention(data) {
        flags.push(FlaggedIssue {
            id: "FLAG-HEAVY-BLEED".into(),
            category: "Circulation".into(),
            message:
                "Heavy bleeding flagged with no circulation intervention recorded - apply pressure / tourniquet, secure IV access, give fluids.".into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── Poor perfusion (high) ────────────────────────────────
    if (r.red_poor_perfusion || r.red_weak_fast_pulse || r.red_cap_refill_over3)
        && !has_circulation_intervention(data)
    {
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
        if hr < 50.0 || hr > 150.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-HR".into(),
                category: "Vital signs".into(),
                message: format!("Heart rate {hr} bpm is outside the safe range (50-150)."),
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
                message: format!("Respiratory rate {rr}/min is outside the safe range (8-30)."),
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

    // ─── Hypoglycaemia (urgent; threshold < 65 mg/dL per WHO trauma) ──
    if let Some(g) = data.disability.blood_glucose {
        if g < 65.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-GLUC-LOW".into(),
                category: "Metabolic".into(),
                message: format!(
                    "Blood glucose {g} mg/dL indicates hypoglycaemia (< 65)."
                ),
                priority: FlagPriority::Urgent,
            });
        }
    }

    // ─── Polytrauma (high) ───────────────────────────────────
    if r.trauma_polytrauma {
        flags.push(FlaggedIssue {
            id: "FLAG-POLYTRAUMA".into(),
            category: "Trauma indicators".into(),
            message: "Polytrauma flagged - multi-system injury, mobilise trauma team.".into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Penetrating trauma (high) ───────────────────────────
    if r.trauma_all_penetrating || r.trauma_penetrating_distal_uncontrolled_bleeding {
        flags.push(FlaggedIssue {
            id: "FLAG-PENETRATING".into(),
            category: "Trauma indicators".into(),
            message: "Penetrating trauma flagged - assess for occult injury and surgical needs.".into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Crush injury (high) ─────────────────────────────────
    if r.trauma_crush_injury {
        flags.push(FlaggedIssue {
            id: "FLAG-CRUSH".into(),
            category: "Trauma indicators".into(),
            message:
                "Crush injury flagged - monitor for rhabdomyolysis, compartment syndrome, hyperkalaemia.".into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Bleeding disorder / anticoagulation (high) ──────────
    if r.trauma_bleeding_disorder_or_anticoag {
        flags.push(FlaggedIssue {
            id: "FLAG-ANTICOAG".into(),
            category: "Trauma indicators".into(),
            message:
                "Patient on anticoagulation / has bleeding disorder - reverse if needed and lower threshold for imaging.".into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Pregnancy (high) ────────────────────────────────────
    if data.patient_registration.pregnant == "yes" || r.trauma_pregnant {
        flags.push(FlaggedIssue {
            id: "FLAG-PREG".into(),
            category: "Obstetric".into(),
            message:
                "Patient is pregnant - involve obstetric team, assess fetal status and consider relevant differentials.".into(),
            priority: FlagPriority::High,
        });
    }

    // ─── IV drug use (medium) ────────────────────────────────
    if data.patient_registration.iv_drug_use {
        flags.push(FlaggedIssue {
            id: "FLAG-IVDU".into(),
            category: "Past medical history".into(),
            message:
                "IV drug use - consider infectious differentials and adapt analgesia plan.".into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Unstable pelvis (urgent) ────────────────────────────
    if data.circulation.unstable_pelvis == "yes" {
        flags.push(FlaggedIssue {
            id: "FLAG-UNSTABLE-PELVIS".into(),
            category: "Circulation".into(),
            message:
                "Unstable pelvis - apply pelvic binder, anticipate massive transfusion and surgical consult.".into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── FAST positive — peritoneum (urgent) ─────────────────
    if data.exposure_and_fast.fast_peritoneum == "free-fluid" {
        flags.push(FlaggedIssue {
            id: "FLAG-FAST-PERIT".into(),
            category: "FAST".into(),
            message: "FAST positive: free fluid in peritoneum - surgical consultation indicated.".into(),
            priority: FlagPriority::Urgent,
        });
    }
    // ─── FAST positive — chest (urgent) ──────────────────────
    {
        let fc = data.exposure_and_fast.fast_chest.as_str();
        if fc == "pneumothorax" || fc == "pleural-fluid" || fc == "pericardial-effusion" {
            flags.push(FlaggedIssue {
                id: "FLAG-FAST-CHEST".into(),
                category: "FAST".into(),
                message: format!("FAST chest finding ({fc}) - emergent intervention required."),
                priority: FlagPriority::Urgent,
            });
        }
    }

    // ─── High-energy mechanism (high) ────────────────────────
    if r.rt_high_speed_crash || r.rt_trapped_or_thrown || r.rt_other_in_vehicle_died {
        flags.push(FlaggedIssue {
            id: "FLAG-HIGH-ENERGY".into(),
            category: "Mechanism".into(),
            message:
                "High-energy mechanism (high-speed crash / trapped or thrown / fatality in same vehicle) - full trauma evaluation.".into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Pedestrian / cyclist (high) ─────────────────────────
    if r.rt_pedestrian_or_cyclist_hit {
        flags.push(FlaggedIssue {
            id: "FLAG-PED-CYCLIST".into(),
            category: "Mechanism".into(),
            message:
                "Pedestrian or cyclist hit by vehicle - high force injury, evaluate for occult trauma.".into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Loss of consciousness (medium / high) ───────────────
    match data.injury_history.loss_of_consciousness_duration.as_str() {
        "30min-24hr" => {
            flags.push(FlaggedIssue {
                id: "FLAG-LOC-LONG".into(),
                category: "Neurological".into(),
                message:
                    "Loss of consciousness 30 min - 24 hr - head CT and neurological observation indicated.".into(),
                priority: FlagPriority::High,
            });
        }
        "5-29min" => {
            flags.push(FlaggedIssue {
                id: "FLAG-LOC-MED".into(),
                category: "Neurological".into(),
                message:
                    "Loss of consciousness 5-29 min - consider head CT and neurological observation.".into(),
                priority: FlagPriority::Medium,
            });
        }
        _ => {}
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
