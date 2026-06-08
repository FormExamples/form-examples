//! Detection of additional flagged issues.

use super::types::{AssessmentData, FlaggedIssue};
use super::utils::has_text;

/// Detect clinically significant flags. Independent of the completeness
/// validator: raises flags for unstable patients, abnormal vital signs,
/// emergent urgency, infectious precautions, and several safety / safeguarding
/// concerns. Priorities (urgent > high > medium > low) drive sort order.
///
/// Flag IDs are preserved verbatim from the JavaScript reference engine.
pub fn detect_flagged_issues(data: &AssessmentData) -> Vec<FlaggedIssue> {
    let mut flags: Vec<FlaggedIssue> = Vec::new();
    let v = &data.assessment.vital_signs;
    let log = &data.transfer_logistics;

    // --- Emergent urgency (urgent) -------------------------------------
    if data.situation.urgency == "emergent" {
        flags.push(FlaggedIssue {
            id: "FLAG-URG-EMERG".to_string(),
            category: "Urgency".to_string(),
            message:
                "Emergent transfer urgency - receiving team must accept and prepare immediately."
                    .to_string(),
            priority: "urgent".to_string(),
        });
    }

    // --- Patient not clinically stable (urgent) ------------------------
    if data.assessment.clinically_stable == "no" {
        flags.push(FlaggedIssue {
            id: "FLAG-STAB-NO".to_string(),
            category: "Clinical stability".to_string(),
            message:
                "Patient flagged as not clinically stable for transfer - escalate before departure."
                    .to_string(),
            priority: "urgent".to_string(),
        });
    }

    // --- Conscious level depressed (urgent) ----------------------------
    if data.assessment.conscious_level == "unresponsive" {
        flags.push(FlaggedIssue {
            id: "FLAG-LOC-UNRESP".to_string(),
            category: "Conscious level".to_string(),
            message:
                "Patient unresponsive - airway protection and critical-care escort likely required."
                    .to_string(),
            priority: "urgent".to_string(),
        });
    }

    // --- Vital signs: airway/breathing/oxygenation (urgent) -----------
    if let Some(spo2) = v.oxygen_saturation {
        if spo2 < 90.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-SPO2".to_string(),
                category: "Vital signs".to_string(),
                message: format!(
                    "Oxygen saturation {}% is critically low (< 90%).",
                    format_number(spo2)
                ),
                priority: "urgent".to_string(),
            });
        }
    }

    if let Some(rr) = v.respiratory_rate {
        if rr < 8.0 || rr > 30.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-RR".to_string(),
                category: "Vital signs".to_string(),
                message: format!(
                    "Respiratory rate {}/min is outside the safe range (8-30).",
                    format_number(rr)
                ),
                priority: "urgent".to_string(),
            });
        }
    }

    // --- Vital signs: NEWS2 elevated (urgent / high) -------------------
    if let Some(news) = v.news_score {
        if news >= 7.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-NEWS-HIGH".to_string(),
                category: "Vital signs".to_string(),
                message: format!(
                    "NEWS2 {} indicates high clinical risk - urgent review required.",
                    format_number(news)
                ),
                priority: "urgent".to_string(),
            });
        } else if news >= 5.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-NEWS-MED".to_string(),
                category: "Vital signs".to_string(),
                message: format!(
                    "NEWS2 {} indicates medium clinical risk - increased monitoring.",
                    format_number(news)
                ),
                priority: "high".to_string(),
            });
        }
    }

    // --- Vital signs: circulation / perfusion (high) ------------------
    if let Some(sbp) = v.systolic_blood_pressure {
        if sbp < 90.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-SBP-LOW".to_string(),
                category: "Vital signs".to_string(),
                message: format!(
                    "Systolic blood pressure {} mmHg suggests hypotension/shock (< 90).",
                    format_number(sbp)
                ),
                priority: "high".to_string(),
            });
        } else if sbp > 180.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-SBP-HIGH".to_string(),
                category: "Vital signs".to_string(),
                message: format!(
                    "Systolic blood pressure {} mmHg is severely elevated (> 180).",
                    format_number(sbp)
                ),
                priority: "high".to_string(),
            });
        }
    }

    if let Some(hr) = v.heart_rate {
        if hr < 50.0 || hr > 130.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-HR".to_string(),
                category: "Vital signs".to_string(),
                message: format!(
                    "Heart rate {}/min is outside the safe range (50-130).",
                    format_number(hr)
                ),
                priority: "high".to_string(),
            });
        }
    }

    if let Some(t) = v.temperature_celsius {
        if t < 35.0 || t >= 39.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-TEMP".to_string(),
                category: "Vital signs".to_string(),
                message: format!(
                    "Temperature {} C is outside the safe range (hypothermia < 35 C, hyperpyrexia >= 39 C).",
                    format_number(t)
                ),
                priority: "high".to_string(),
            });
        }
    }

    // --- Conscious level drowsy (high) --------------------------------
    if data.assessment.conscious_level == "drowsy" {
        flags.push(FlaggedIssue {
            id: "FLAG-LOC-DROWSY".to_string(),
            category: "Conscious level".to_string(),
            message: "Patient drowsy - re-assess airway risk and confirm appropriate escort."
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // --- Infectious precautions (high) --------------------------------
    if log.infectious_precautions {
        let detail = if has_text(&log.infectious_precautions_details) {
            log.infectious_precautions_details.trim().to_string()
        } else {
            "details not specified".to_string()
        };
        flags.push(FlaggedIssue {
            id: "FLAG-INF-PRC".to_string(),
            category: "Infection control".to_string(),
            message: format!(
                "Infectious precautions flagged: {detail}. Receiving area must prepare isolation and PPE."
            ),
            priority: "high".to_string(),
        });
    }

    // --- Cardiac monitoring required (high) ---------------------------
    if log.cardiac_monitoring_required {
        flags.push(FlaggedIssue {
            id: "FLAG-LOG-CARDIAC".to_string(),
            category: "Transport requirement".to_string(),
            message:
                "Cardiac monitoring required during transfer - confirm telemetry-capable transport."
                    .to_string(),
            priority: "high".to_string(),
        });
    }

    // --- Mental capacity concerns (high) ------------------------------
    if log.mental_capacity_concerns {
        flags.push(FlaggedIssue {
            id: "FLAG-MCA".to_string(),
            category: "Safeguarding".to_string(),
            message:
                "Mental Capacity Act concerns flagged - ensure best-interests/DoLS documentation accompanies transfer."
                    .to_string(),
            priority: "high".to_string(),
        });
    }

    // --- Urgent transfer urgency (high) -------------------------------
    if data.situation.urgency == "urgent" {
        flags.push(FlaggedIssue {
            id: "FLAG-URG-URGENT".to_string(),
            category: "Urgency".to_string(),
            message: "Urgent transfer - receiving team should be expecting the patient promptly."
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // --- Oxygen required (medium) -------------------------------------
    if log.oxygen_required {
        flags.push(FlaggedIssue {
            id: "FLAG-LOG-O2".to_string(),
            category: "Transport requirement".to_string(),
            message:
                "Supplemental oxygen required during transfer - confirm cylinder volume covers journey."
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    // --- Escort required (medium) -------------------------------------
    if log.escort_required {
        let detail = if has_text(&log.escort_details) {
            log.escort_details.trim().to_string()
        } else {
            "details not specified".to_string()
        };
        flags.push(FlaggedIssue {
            id: "FLAG-LOG-ESCORT".to_string(),
            category: "Transport requirement".to_string(),
            message: format!("Clinical escort required: {detail}."),
            priority: "medium".to_string(),
        });
    }

    // --- Falls risk (medium) ------------------------------------------
    if log.falls_risk {
        flags.push(FlaggedIssue {
            id: "FLAG-LOG-FALLS".to_string(),
            category: "Transport requirement".to_string(),
            message: "Falls risk flagged - ensure stretcher straps and bed-rails on arrival."
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    // --- Acknowledgement still pending (low) --------------------------
    if !data.signoff_acknowledgement.acknowledgement_received
        && has_text(&data.signoff_acknowledgement.requesting_provider_signature)
    {
        flags.push(FlaggedIssue {
            id: "FLAG-ACK-PENDING".to_string(),
            category: "Acknowledgement".to_string(),
            message:
                "Receiving-provider acknowledgement not yet recorded - chase confirmation before departure."
                    .to_string(),
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

/// Render a number for display: drop the trailing `.0` for whole numbers,
/// matching the JS `${n}` behaviour for both integers and floats.
fn format_number(n: f64) -> String {
    if n.fract() == 0.0 && n.is_finite() {
        format!("{}", n as i64)
    } else {
        format!("{n}")
    }
}
