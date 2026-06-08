//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};

/// Detect clinician-facing additional flags. Independent of the adaptive-
/// functioning score, this module raises flags for epilepsy / poorly-
/// controlled seizures, psychotropic prescribing, dysphagia, missed
/// national screening, mental-capacity concerns, behavioural risk, and
/// reasonable-adjustments hygiene.
///
/// Flag IDs preserved verbatim from the front-end JS engine.
///
/// Priority order (high → low): `urgent` > `high` > `medium` > `low`.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Epilepsy / seizure activity ─────────────────────────
    if data.medical_review.has_epilepsy == "yes" {
        if let Some(per_month) = data.medical_review.seizures_per_month
            && per_month >= 4
        {
            flags.push(AdditionalFlag {
                id: "FLAG-EPI-001".to_string(),
                category: "Medical Review".to_string(),
                message: format!(
                    "Frequent seizures ({per_month}/month) — review epilepsy management urgently."
                ),
                priority: "urgent".to_string(),
            });
        } else {
            flags.push(AdditionalFlag {
                id: "FLAG-EPI-002".to_string(),
                category: "Medical Review".to_string(),
                message:
                    "Active epilepsy — confirm seizure plan and rescue medication are in place."
                        .to_string(),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Psychotropic / STOMP review ─────────────────────────
    if data.medical_review.takes_psychotropic == "yes" {
        if data.medical_review.stomp_review_done != "yes" {
            flags.push(AdditionalFlag {
                id: "FLAG-STOMP-001".to_string(),
                category: "Medications".to_string(),
                message: "On psychotropic medication without a documented STOMP review."
                    .to_string(),
                priority: "high".to_string(),
            });
        } else {
            flags.push(AdditionalFlag {
                id: "FLAG-STOMP-002".to_string(),
                category: "Medications".to_string(),
                message: "On psychotropic medication — STOMP review recorded.".to_string(),
                priority: "low".to_string(),
            });
        }
    }

    // ─── Mental health diagnosis ─────────────────────────────
    if data.medical_review.has_mental_health_diagnosis == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-001".to_string(),
            category: "Medical Review".to_string(),
            message: "Co-occurring mental health diagnosis — coordinate with mental-health team."
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Dysphagia ───────────────────────────────────────────
    if data.medical_review.has_dysphagia == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-DYS-001".to_string(),
            category: "Medical Review".to_string(),
            message: "Dysphagia present — choking and aspiration risk; SLT review recommended."
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── BMI extremes ────────────────────────────────────────
    if let Some(bmi) = data.physical_examination.bmi {
        if bmi < 18.5 {
            flags.push(AdditionalFlag {
                id: "FLAG-BMI-001".to_string(),
                category: "Physical Examination".to_string(),
                message: format!("BMI {bmi} — underweight; nutritional review recommended."),
                priority: "medium".to_string(),
            });
        } else if bmi >= 30.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-BMI-002".to_string(),
                category: "Physical Examination".to_string(),
                message: format!("BMI {bmi} — obesity; weight management support recommended."),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Hypertension ────────────────────────────────────────
    if let Some(sys) = data.physical_examination.blood_pressure_systolic
        && sys >= 140
    {
        flags.push(AdditionalFlag {
            id: "FLAG-BP-001".to_string(),
            category: "Physical Examination".to_string(),
            message: format!("Systolic BP {sys} mmHg — hypertensive range."),
            priority: "medium".to_string(),
        });
    }

    // ─── Missed national screening checks ────────────────────
    if data.physical_examination.vision_checked == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-SCREEN-001".to_string(),
            category: "Screening".to_string(),
            message: "No recent vision check — refer to optician.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.physical_examination.hearing_checked == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-SCREEN-002".to_string(),
            category: "Screening".to_string(),
            message: "No recent hearing check — refer to audiology.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.physical_examination.dental_checked == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-SCREEN-003".to_string(),
            category: "Screening".to_string(),
            message: "No recent dental check — refer to dentist.".to_string(),
            priority: "low".to_string(),
        });
    }
    if data.physical_examination.vaccinations_up_to_date == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-SCREEN-004".to_string(),
            category: "Screening".to_string(),
            message: "Vaccinations not up to date — review immunisation history.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.physical_examination.cervical_screening == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-SCREEN-005".to_string(),
            category: "Screening".to_string(),
            message: "Cervical screening overdue — discuss with reasonable adjustments."
                .to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.physical_examination.breast_screening == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-SCREEN-006".to_string(),
            category: "Screening".to_string(),
            message: "Breast screening overdue — discuss with reasonable adjustments.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.physical_examination.bowel_screening == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-SCREEN-007".to_string(),
            category: "Screening".to_string(),
            message: "Bowel cancer screening overdue — discuss with reasonable adjustments."
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Behavioural risk ────────────────────────────────────
    if data.behavioural_concerns.self_injurious == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-BEH-001".to_string(),
            category: "Behavioural Concerns".to_string(),
            message: "Self-injurious behaviour reported — positive behaviour support required."
                .to_string(),
            priority: "high".to_string(),
        });
    }
    if data.behavioural_concerns.aggression == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-BEH-002".to_string(),
            category: "Behavioural Concerns".to_string(),
            message: "Aggression reported — review triggers and de-escalation plan.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.behavioural_concerns.absconding == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-BEH-003".to_string(),
            category: "Behavioural Concerns".to_string(),
            message: "Absconding history — safety plan required.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.behavioural_concerns.sexualised_behaviour == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-BEH-004".to_string(),
            category: "Behavioural Concerns".to_string(),
            message: "Inappropriate sexualised behaviour reported — safeguarding review."
                .to_string(),
            priority: "high".to_string(),
        });
    }
    if (data.behavioural_concerns.self_injurious == "yes"
        || data.behavioural_concerns.aggression == "yes"
        || data.behavioural_concerns.property_damage == "yes")
        && data.behavioural_concerns.has_behaviour_support_plan != "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-BEH-005".to_string(),
            category: "Behavioural Concerns".to_string(),
            message:
                "Significant behaviours of concern without a positive behaviour support plan."
                    .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Mental capacity ─────────────────────────────────────
    if data.mental_capacity_consent.can_consent_to_health_check == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-CAP-001".to_string(),
            category: "Mental Capacity".to_string(),
            message:
                "Lacks capacity to consent to health check — best-interests decision required."
                    .to_string(),
            priority: "high".to_string(),
        });
    }
    if data.mental_capacity_consent.can_consent_to_medication == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-CAP-002".to_string(),
            category: "Mental Capacity".to_string(),
            message:
                "Lacks capacity to consent to medication — best-interests / LPA process required."
                    .to_string(),
            priority: "high".to_string(),
        });
    }
    if data.mental_capacity_consent.best_interests_required == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-CAP-003".to_string(),
            category: "Mental Capacity".to_string(),
            message: "Best-interests decision flagged — document MCA assessment.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.mental_capacity_consent.has_dols == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-CAP-004".to_string(),
            category: "Mental Capacity".to_string(),
            message:
                "Deprivation of Liberty Safeguard in place — confirm authorisation is current."
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Communication accessibility ─────────────────────────
    if data.communication_needs.verbal_ability == "non-verbal" {
        flags.push(AdditionalFlag {
            id: "FLAG-COMM-001".to_string(),
            category: "Communication".to_string(),
            message: "Non-verbal communication — confirm AAC / easy-read materials available."
                .to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.communication_needs.needs_interpreter == "yes" {
        let lang = if data.communication_needs.interpreter_language.trim().is_empty() {
            "language not specified".to_string()
        } else {
            data.communication_needs.interpreter_language.trim().to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-COMM-002".to_string(),
            category: "Communication".to_string(),
            message: format!("Interpreter required ({lang})."),
            priority: "medium".to_string(),
        });
    }

    // ─── Reasonable adjustments hygiene ──────────────────────
    if data.reasonable_adjustments.flag_on_record != "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-ADJ-001".to_string(),
            category: "Reasonable Adjustments".to_string(),
            message: "Reasonable adjustments flag not yet set on the patient record.".to_string(),
            priority: "medium".to_string(),
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
