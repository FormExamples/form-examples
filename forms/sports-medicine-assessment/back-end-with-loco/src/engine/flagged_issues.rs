//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};

fn is_yes(v: &str) -> bool {
    v == "yes"
}

/// Detect Sports Medicine PPE clinician-facing flags grouped by priority:
///
/// - high   - cardiovascular red flags, recent or multiple concussions,
///            RED-S triad indicators, infectious skin lesions in contact
///            sport, monocular athlete in high-risk sport without eyewear
/// - medium - uncorrected MSK injury, monocular athlete (general),
///            suspected eating disorder, hypertension diagnosis,
///            previous clearance issue
/// - low    - lifestyle / training-load concerns (very high training load,
///            BMI extremes, allergies known but uncharacterised)
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    let contact = data.sport_position_details.contact_level.as_str();
    let is_contact = contact == "high" || contact == "moderate";
    let is_high = contact == "high";

    // ─── HIGH PRIORITY ────────────────────────────────────────

    if is_yes(&data.cardiovascular_screening.chest_pain_with_exertion) {
        flags.push(AdditionalFlag {
            id: "FLAG-CV-001".to_string(),
            category: "Cardiovascular".to_string(),
            message: "Chest pain with exertion — urgent cardiology evaluation before any sport."
                .to_string(),
            priority: "high".to_string(),
        });
    }
    if is_yes(&data.cardiovascular_screening.unexplained_syncope) {
        flags.push(AdditionalFlag {
            id: "FLAG-CV-002".to_string(),
            category: "Cardiovascular".to_string(),
            message: "Unexplained syncope — exclude exertional cardiac cause.".to_string(),
            priority: "high".to_string(),
        });
    }
    if is_yes(&data.family_history.sudden_cardiac_death_under_50) {
        let relation = data.family_history.sudden_cardiac_death_relation.trim();
        let suffix = if relation.is_empty() {
            String::new()
        } else {
            format!(" ({relation})")
        };
        flags.push(AdditionalFlag {
            id: "FLAG-CV-003".to_string(),
            category: "Cardiovascular".to_string(),
            message: format!(
                "Family sudden cardiac death under 50{suffix} — cardiology screening required."
            ),
            priority: "high".to_string(),
        });
    }
    if is_yes(&data.family_history.hypertrophic_cardiomyopathy) {
        flags.push(AdditionalFlag {
            id: "FLAG-CV-004".to_string(),
            category: "Cardiovascular".to_string(),
            message: "Family hypertrophic cardiomyopathy — ECG ± echo screening.".to_string(),
            priority: "high".to_string(),
        });
    }

    // Recent / multiple concussions
    if is_yes(&data.neurological_concussion_baseline.concussion_last_six_months) {
        flags.push(AdditionalFlag {
            id: "FLAG-NEURO-001".to_string(),
            category: "Neurological".to_string(),
            message: "Concussion within the last 6 months — confirm symptom resolution and graduated return.".to_string(),
            priority: "high".to_string(),
        });
    }
    if let Some(n) = data.neurological_concussion_baseline.total_concussions {
        if n >= 3 {
            flags.push(AdditionalFlag {
                id: "FLAG-NEURO-002".to_string(),
                category: "Neurological".to_string(),
                message: format!("{n} lifetime concussions — neurology review for return-to-play."),
                priority: "high".to_string(),
            });
        }
    }
    if is_yes(&data.neurological_concussion_baseline.ongoing_post_concussive_symptoms) {
        flags.push(AdditionalFlag {
            id: "FLAG-NEURO-003".to_string(),
            category: "Neurological".to_string(),
            message: "Ongoing post-concussive symptoms — do not clear until fully resolved."
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // RED-S triad indicators (low BMI + amenorrhoea + bone fracture)
    let bmi = data.demographics.bmi;
    let low_bmi = bmi.map(|v| v < 18.5).unwrap_or(false);
    let reds = &data.menstrual_history_reds;
    if reds.applicable
        && low_bmi
        && is_yes(&reds.amenorrhoea_six_months)
        && is_yes(&reds.stress_fracture_history)
    {
        let bmi_str = bmi
            .map(|v| format!("{v}"))
            .unwrap_or_else(|| "unknown".to_string());
        flags.push(AdditionalFlag {
            id: "FLAG-REDS-001".to_string(),
            category: "RED-S".to_string(),
            message: format!(
                "Probable RED-S triad: BMI {bmi_str}, amenorrhoea > 6 months, prior stress fracture — urgent multidisciplinary review."
            ),
            priority: "high".to_string(),
        });
    } else if reds.applicable
        && is_yes(&reds.amenorrhoea_six_months)
        && (is_yes(&reds.restrictive_eating_pattern) || is_yes(&reds.stress_fracture_history))
    {
        flags.push(AdditionalFlag {
            id: "FLAG-REDS-002".to_string(),
            category: "RED-S".to_string(),
            message: "Two RED-S features present — refer for energy-availability assessment."
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // Infectious skin lesions in contact sport
    if is_yes(&data.vision_skin.impetigo_or_mrsa) && is_contact {
        flags.push(AdditionalFlag {
            id: "FLAG-SKIN-001".to_string(),
            category: "Skin".to_string(),
            message: "Impetigo / MRSA lesion in contact sport — exclude until cleared.".to_string(),
            priority: "high".to_string(),
        });
    }
    if is_yes(&data.vision_skin.herpes_gladiatorum) && is_contact {
        flags.push(AdditionalFlag {
            id: "FLAG-SKIN-002".to_string(),
            category: "Skin".to_string(),
            message: "Active herpes gladiatorum in contact sport — exclude until lesions resolved."
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // Monocular athlete in high-contact sport without eyewear
    if is_yes(&data.vision_skin.monocular_athlete)
        && is_high
        && data.vision_skin.protective_eyewear_available == "no"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-VIS-001".to_string(),
            category: "Vision".to_string(),
            message: "Monocular athlete in high-contact sport without protective eyewear."
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── MEDIUM PRIORITY ──────────────────────────────────────

    if is_yes(&data.musculoskeletal_screening.uncorrected_major_injury) {
        let details = data.musculoskeletal_screening.major_injury_details.trim();
        let suffix = if details.is_empty() {
            String::new()
        } else {
            format!(": {details}")
        };
        flags.push(AdditionalFlag {
            id: "FLAG-MSK-001".to_string(),
            category: "Musculoskeletal".to_string(),
            message: format!("Uncorrected major injury{suffix} — orthopaedic clearance required."),
            priority: "medium".to_string(),
        });
    }
    if is_yes(&data.vision_skin.monocular_athlete) && !is_high {
        flags.push(AdditionalFlag {
            id: "FLAG-VIS-002".to_string(),
            category: "Vision".to_string(),
            message: "Monocular athlete — counsel on protective eyewear.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if is_yes(&data.medical_history.eating_disorder_history)
        || (reds.applicable && is_yes(&reds.restrictive_eating_pattern))
    {
        flags.push(AdditionalFlag {
            id: "FLAG-EAT-001".to_string(),
            category: "Nutrition".to_string(),
            message: "Suspected eating disorder / restrictive eating — refer to sports nutrition / mental health.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if is_yes(&data.cardiovascular_screening.high_blood_pressure_diagnosis) {
        flags.push(AdditionalFlag {
            id: "FLAG-CV-005".to_string(),
            category: "Cardiovascular".to_string(),
            message: "Hypertension diagnosis — confirm control before clearance.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if is_yes(&data.sport_position_details.previous_clearance_issue) {
        let details = data
            .sport_position_details
            .previous_clearance_details
            .trim();
        let suffix = if details.is_empty() {
            String::new()
        } else {
            format!(": {details}")
        };
        flags.push(AdditionalFlag {
            id: "FLAG-HX-001".to_string(),
            category: "Clearance History".to_string(),
            message: format!("Previous clearance issue{suffix} — review prior decision."),
            priority: "medium".to_string(),
        });
    }
    if is_yes(&data.medical_history.heat_illness_history) {
        flags.push(AdditionalFlag {
            id: "FLAG-HEAT-001".to_string(),
            category: "Environmental".to_string(),
            message: "Prior heat illness — heat-acclimatisation plan required.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if is_yes(&data.medical_history.sickle_cell_trait_or_disease) {
        flags.push(AdditionalFlag {
            id: "FLAG-HEME-001".to_string(),
            category: "Haematology".to_string(),
            message: "Sickle cell trait or disease — counsel on exertional sickling.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── LOW PRIORITY ─────────────────────────────────────────

    if let Some(hours) = data.sport_position_details.hours_per_week {
        if hours >= 20.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-LOAD-001".to_string(),
                category: "Training Load".to_string(),
                message: format!("{hours} h / week training — monitor for overtraining."),
                priority: "low".to_string(),
            });
        }
    }
    if low_bmi {
        if let Some(v) = bmi {
            flags.push(AdditionalFlag {
                id: "FLAG-BMI-001".to_string(),
                category: "Anthropometry".to_string(),
                message: format!("BMI {v} — consider energy-availability assessment."),
                priority: "low".to_string(),
            });
        }
    }
    if let Some(v) = bmi {
        if v >= 30.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-BMI-002".to_string(),
                category: "Anthropometry".to_string(),
                message: format!(
                    "BMI {v} — discuss conditioning and weight-related sport recommendations."
                ),
                priority: "low".to_string(),
            });
        }
    }
    if is_yes(&data.medical_history.allergies_known)
        && data.medical_history.allergy_details.trim().is_empty()
    {
        flags.push(AdditionalFlag {
            id: "FLAG-ALG-001".to_string(),
            category: "Allergies".to_string(),
            message: "Allergies reported but no details captured — document allergens and reactions.".to_string(),
            priority: "low".to_string(),
        });
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
