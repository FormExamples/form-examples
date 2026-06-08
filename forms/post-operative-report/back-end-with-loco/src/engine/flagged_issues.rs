//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};

/// Detect post-operative safety flags. Independent of the overall Clavien-Dindo
/// grade. Priority ordering: urgent > high > medium > low. Flag IDs match
/// the front-end engine verbatim.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    let proc = &data.procedure_details;
    let patient = &data.patient_details;
    let fluids = &data.blood_loss_fluid_balance;
    let status = &data.immediate_postop_status;
    let anaes = &data.anaesthesia_summary;
    let intra = &data.intraoperative_findings;
    let comps = &data.complications_assessment;
    let plan = &data.postop_plan_instructions;

    // ─── Mortality (Grade V) ─────────────────────────────────
    if comps.complications.iter().any(|c| c.grade == "grade-v") {
        flags.push(AdditionalFlag {
            id: "FLAG-CD-V".to_string(),
            category: "Complications".to_string(),
            message: "Grade V complication (death) recorded — escalate to mortality review and ensure family notification, coroner referral, and clinical governance reporting.".to_string(),
            priority: "urgent".to_string(),
        });
    }

    // ─── Life-threatening complications (Grade IV) ───────────
    let iv_count = comps
        .complications
        .iter()
        .filter(|c| c.grade == "grade-iva" || c.grade == "grade-ivb")
        .count();
    if iv_count > 0 {
        let plural = if iv_count > 1 { "s" } else { "" };
        flags.push(AdditionalFlag {
            id: "FLAG-CD-IV".to_string(),
            category: "Complications".to_string(),
            message: format!(
                "{iv_count} life-threatening (Grade IV) complication{plural} — ensure ICU/HDU level of care and continuous monitoring."
            ),
            priority: "urgent".to_string(),
        });
    }

    // ─── Reoperation under GA (Grade IIIb) ───────────────────
    let iiib_count = comps
        .complications
        .iter()
        .filter(|c| c.grade == "grade-iiib")
        .count();
    if iiib_count > 0 {
        let plural = if iiib_count > 1 { "s" } else { "" };
        flags.push(AdditionalFlag {
            id: "FLAG-CD-IIIB".to_string(),
            category: "Complications".to_string(),
            message: format!(
                "{iiib_count} complication{plural} requiring intervention under general anaesthesia (Grade IIIb)."
            ),
            priority: "high".to_string(),
        });
    }

    // ─── ASA class ───────────────────────────────────────────
    if patient.asa_grade == "IV" || patient.asa_grade == "V" {
        flags.push(AdditionalFlag {
            id: "FLAG-ASA-HIGH".to_string(),
            category: "Patient Risk".to_string(),
            message: format!(
                "ASA class {} — patient at high peri-operative risk; ensure HDU/ICU disposition and senior review.",
                patient.asa_grade
            ),
            priority: "high".to_string(),
        });
    } else if patient.asa_grade == "III" {
        flags.push(AdditionalFlag {
            id: "FLAG-ASA-III".to_string(),
            category: "Patient Risk".to_string(),
            message: "ASA class III — severe systemic disease; consider enhanced post-op monitoring.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Emergency procedure ─────────────────────────────────
    if proc.priority == "emergency" {
        flags.push(AdditionalFlag {
            id: "FLAG-PROC-EMERGENCY".to_string(),
            category: "Procedure".to_string(),
            message: "Emergency procedure — heightened risk of post-operative deterioration; ensure close observation.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Conversion to open ──────────────────────────────────
    if intra.conversion_to_open == "yes" {
        let reason_suffix = if intra.conversion_reason.is_empty() {
            String::new()
        } else {
            format!(" — reason: {}", intra.conversion_reason)
        };
        flags.push(AdditionalFlag {
            id: "FLAG-CONVERSION".to_string(),
            category: "Intra-operative".to_string(),
            message: format!("Conversion to open procedure{reason_suffix}."),
            priority: "high".to_string(),
        });
    }

    // ─── Prolonged surgery ───────────────────────────────────
    if let Some(d) = proc.duration_minutes {
        if d >= 240 {
            flags.push(AdditionalFlag {
                id: "FLAG-DURATION-LONG".to_string(),
                category: "Procedure".to_string(),
                message: format!(
                    "Prolonged procedure ({d} minutes) — increased risk of VTE, pressure injury, and hypothermia."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Difficult airway ────────────────────────────────────
    if anaes.difficult_intubation == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-AIRWAY".to_string(),
            category: "Anaesthesia".to_string(),
            message: "Difficult airway encountered — document in patient record and alert future anaesthetists.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Massive blood loss ──────────────────────────────────
    if let Some(ml) = fluids.estimated_blood_loss_ml {
        if ml >= 1500 {
            flags.push(AdditionalFlag {
                id: "FLAG-BLOOD-MASSIVE".to_string(),
                category: "Blood Loss".to_string(),
                message: format!(
                    "Massive blood loss ({ml} mL) — review haemoglobin, coagulation, and transfusion adequacy."
                ),
                priority: "urgent".to_string(),
            });
        } else if ml >= 500 {
            flags.push(AdditionalFlag {
                id: "FLAG-BLOOD-SIGNIFICANT".to_string(),
                category: "Blood Loss".to_string(),
                message: format!(
                    "Significant blood loss ({ml} mL) — recheck haemoglobin in recovery."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Hypotension ─────────────────────────────────────────
    if let Some(sbp) = status.systolic_bp {
        if sbp < 90 {
            flags.push(AdditionalFlag {
                id: "FLAG-VITAL-HYPOTENSION".to_string(),
                category: "Vital Signs".to_string(),
                message: format!(
                    "Hypotension (SBP {sbp} mmHg) on arrival in recovery — assess volume status and bleeding."
                ),
                priority: "urgent".to_string(),
            });
        }
    }

    // ─── Hypertension ────────────────────────────────────────
    if let Some(sbp) = status.systolic_bp {
        if sbp >= 180 {
            flags.push(AdditionalFlag {
                id: "FLAG-VITAL-HYPERTENSION".to_string(),
                category: "Vital Signs".to_string(),
                message: format!(
                    "Hypertension (SBP {sbp} mmHg) — review pain control and consider antihypertensive."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Tachycardia ─────────────────────────────────────────
    if let Some(hr) = status.heart_rate {
        if hr >= 120 {
            flags.push(AdditionalFlag {
                id: "FLAG-VITAL-TACHY".to_string(),
                category: "Vital Signs".to_string(),
                message: format!(
                    "Tachycardia (HR {hr} bpm) — assess for pain, hypovolaemia, or sepsis."
                ),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Bradycardia ─────────────────────────────────────────
    if let Some(hr) = status.heart_rate {
        if hr < 50 {
            flags.push(AdditionalFlag {
                id: "FLAG-VITAL-BRADY".to_string(),
                category: "Vital Signs".to_string(),
                message: format!(
                    "Bradycardia (HR {hr} bpm) — review medications and monitor closely."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Hypoxia ─────────────────────────────────────────────
    if let Some(spo2) = status.oxygen_saturation {
        if spo2 < 92 {
            flags.push(AdditionalFlag {
                id: "FLAG-VITAL-HYPOXIA".to_string(),
                category: "Vital Signs".to_string(),
                message: format!(
                    "Oxygen desaturation (SpO2 {spo2}%) — escalate, supplement oxygen and review airway."
                ),
                priority: "urgent".to_string(),
            });
        }
    }

    // ─── Hypothermia ─────────────────────────────────────────
    if let Some(temp) = status.temperature {
        if temp < 36.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-VITAL-HYPOTHERMIA".to_string(),
                category: "Vital Signs".to_string(),
                message: format!("Hypothermia ({temp} °C) — initiate active warming."),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Pyrexia ─────────────────────────────────────────────
    if let Some(temp) = status.temperature {
        if temp >= 38.5 {
            flags.push(AdditionalFlag {
                id: "FLAG-VITAL-PYREXIA".to_string(),
                category: "Vital Signs".to_string(),
                message: format!(
                    "Pyrexia ({temp} °C) — assess for infection and consider sepsis screen."
                ),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Tachypnoea ──────────────────────────────────────────
    if let Some(rr) = status.respiratory_rate {
        if rr >= 25 {
            flags.push(AdditionalFlag {
                id: "FLAG-VITAL-TACHYPNOEA".to_string(),
                category: "Vital Signs".to_string(),
                message: format!(
                    "Tachypnoea (RR {rr}) — assess respiratory function and pain."
                ),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Severe pain ─────────────────────────────────────────
    if let Some(p) = status.pain_score {
        if p >= 7 {
            flags.push(AdditionalFlag {
                id: "FLAG-PAIN-SEVERE".to_string(),
                category: "Pain".to_string(),
                message: format!("Severe pain (score {p}/10) — escalate analgesia plan."),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Reduced consciousness ───────────────────────────────
    if status.conscious_level == "unresponsive" {
        flags.push(AdditionalFlag {
            id: "FLAG-CONSC-UNRESP".to_string(),
            category: "Status".to_string(),
            message: "Patient unresponsive on arrival — urgent senior review required.".to_string(),
            priority: "urgent".to_string(),
        });
    }

    // ─── ICU disposition ─────────────────────────────────────
    if status.disposition == "icu" {
        flags.push(AdditionalFlag {
            id: "FLAG-DISP-ICU".to_string(),
            category: "Disposition".to_string(),
            message: "Patient transferred to ICU — ensure handover with ICU team.".to_string(),
            priority: "high".to_string(),
        });
    } else if status.disposition == "hdu" {
        flags.push(AdditionalFlag {
            id: "FLAG-DISP-HDU".to_string(),
            category: "Disposition".to_string(),
            message: "Patient transferred to HDU — ensure handover with HDU team.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Missing critical post-op instructions ──────────────
    if plan.thromboprophylaxis.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-PLAN-VTE".to_string(),
            category: "Post-op Plan".to_string(),
            message: "Thromboprophylaxis plan not documented — VTE risk assessment required.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if plan.analgesia_plan.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-PLAN-ANALGESIA".to_string(),
            category: "Post-op Plan".to_string(),
            message: "Analgesia plan not documented.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if plan.follow_up_plan.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-PLAN-FOLLOWUP".to_string(),
            category: "Post-op Plan".to_string(),
            message: "Follow-up plan not documented.".to_string(),
            priority: "low".to_string(),
        });
    }

    // Sort: urgent > high > medium > low.
    flags.sort_by_key(|f| match f.priority.as_str() {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    });

    flags
}
