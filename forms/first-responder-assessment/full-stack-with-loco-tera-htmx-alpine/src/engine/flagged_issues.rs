use super::types::{AdditionalFlag, AssessmentData};

/// Detect First Responder safety flags. Computed independently of competency
/// grading: these raise clinician-facing alerts regardless of overall score.
/// Priority: high > medium > low. IDs are preserved verbatim from
/// `flagged-issues.js`.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── HIGH PRIORITY ─────────────────────────────────────────
    if data.clinical_skills.basic_life_support == "not-competent" {
        flags.push(AdditionalFlag {
            id: "FLAG-BLS-001".to_string(),
            category: "Clinical Skills".to_string(),
            message: "Basic life support not competent - IMMEDIATE REMEDIATION REQUIRED"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    if data.clinical_skills.patient_assessment == "not-competent" {
        flags.push(AdditionalFlag {
            id: "FLAG-PA-001".to_string(),
            category: "Clinical Skills".to_string(),
            message: "Patient assessment (ABCDE) not competent - CANNOT OPERATE INDEPENDENTLY"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    if data.equipment_vehicle.defibrillator_competency == "not-competent" {
        flags.push(AdditionalFlag {
            id: "FLAG-DEFIB-001".to_string(),
            category: "Equipment".to_string(),
            message: "Defibrillator competency not met - URGENT TRAINING REQUIRED".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.psychological_readiness.ptsd_screening == "yes"
        && data.psychological_readiness.ptsd_screening_result == "positive"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-PTSD-001".to_string(),
            category: "Psychological".to_string(),
            message: "Positive PTSD screening - OCCUPATIONAL HEALTH REFERRAL REQUIRED"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    if data.occupational_health.substance_misuse_screen == "positive" {
        flags.push(AdditionalFlag {
            id: "FLAG-SUBSTANCE-001".to_string(),
            category: "Occupational Health".to_string(),
            message: "Positive substance misuse screening - IMMEDIATE MANAGEMENT REFERRAL"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    if data.physical_fitness.patient_carry_ability == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-CARRY-001".to_string(),
            category: "Physical Fitness".to_string(),
            message: "Unable to carry patient on stretcher - RESTRICTED DUTIES REQUIRED"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    if data.occupational_health.vision_test == "fail" {
        flags.push(AdditionalFlag {
            id: "FLAG-VISION-001".to_string(),
            category: "Occupational Health".to_string(),
            message: "Failed vision test - DRIVING AND CLINICAL DUTIES MAY BE AFFECTED"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── MEDIUM PRIORITY ───────────────────────────────────────
    if data.psychological_readiness.critical_incident_exposure == "yes"
        && data.psychological_readiness.critical_incident_debriefed == "no"
    {
        let detail = if data
            .psychological_readiness
            .critical_incident_details
            .trim()
            .is_empty()
        {
            "details not specified".to_string()
        } else {
            data.psychological_readiness
                .critical_incident_details
                .trim()
                .to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-DEBRIEF-001".to_string(),
            category: "Psychological".to_string(),
            message: format!("Critical incident exposure without debriefing: {detail}"),
            priority: "medium".to_string(),
        });
    }

    if data.psychological_readiness.burnout_risk == "high" {
        flags.push(AdditionalFlag {
            id: "FLAG-BURNOUT-001".to_string(),
            category: "Psychological".to_string(),
            message: "High burnout risk - consider workload review and wellbeing support"
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.cpd_training.mandatory_training_complete == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-TRAINING-001".to_string(),
            category: "Training".to_string(),
            message: "Mandatory training incomplete - schedule completion urgently".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.occupational_health.immunisation_status == "incomplete" {
        flags.push(AdditionalFlag {
            id: "FLAG-IMMUN-001".to_string(),
            category: "Occupational Health".to_string(),
            message: "Immunisations incomplete - occupational health review required".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.occupational_health.musculoskeletal_issues == "yes" {
        let detail = if data
            .occupational_health
            .musculoskeletal_details
            .trim()
            .is_empty()
        {
            "details not specified".to_string()
        } else {
            data.occupational_health
                .musculoskeletal_details
                .trim()
                .to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-MSK-001".to_string(),
            category: "Occupational Health".to_string(),
            message: format!("Musculoskeletal issues: {detail}"),
            priority: "medium".to_string(),
        });
    }

    if data.communication_skills.safeguarding_awareness == "not-competent" {
        flags.push(AdditionalFlag {
            id: "FLAG-SAFEGUARD-001".to_string(),
            category: "Communication".to_string(),
            message:
                "Safeguarding awareness not competent - training required before patient contact"
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── LOW PRIORITY ──────────────────────────────────────────
    if let (Some(have), Some(need)) = (
        data.cpd_training.cpd_hours_last_year,
        data.cpd_training.cpd_hours_required,
    ) {
        if have < need {
            flags.push(AdditionalFlag {
                id: "FLAG-CPD-001".to_string(),
                category: "Training".to_string(),
                message: format!(
                    "CPD shortfall: {} of {} required hours completed",
                    format_hours(have),
                    format_hours(need)
                ),
                priority: "low".to_string(),
            });
        }
    }

    // Sort: high > medium > low.
    flags.sort_by_key(|f| match f.priority.as_str() {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });

    flags
}

fn format_hours(v: f64) -> String {
    if (v - v.round()).abs() < f64::EPSILON {
        format!("{}", v as i64)
    } else {
        format!("{v}")
    }
}
