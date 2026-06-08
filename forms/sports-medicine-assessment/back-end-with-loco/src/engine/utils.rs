//! Helper predicates and counters used by the grader.

use super::types::AssessmentData;

/// Display label for a Clearance value.
pub fn clearance_label(c: &str) -> String {
    match c {
        "cleared" => "Cleared".to_string(),
        "conditional" => "Cleared with Conditions".to_string(),
        "pending" => "Not Cleared Pending Further Evaluation".to_string(),
        "not-cleared" => "Not Cleared for Sport".to_string(),
        _ => String::new(),
    }
}

/// CSS class hint for the clearance badge.
pub fn clearance_class(c: &str) -> String {
    match c {
        "cleared" => "clearance-cleared".to_string(),
        "conditional" => "clearance-conditional".to_string(),
        "pending" => "clearance-pending".to_string(),
        "not-cleared" => "clearance-not-cleared".to_string(),
        _ => String::new(),
    }
}

/// Display label for a rule grade.
pub fn grade_label(g: u8) -> String {
    match g {
        4 => "Not Cleared".to_string(),
        3 => "Pending".to_string(),
        2 => "Conditional".to_string(),
        1 => "Informational".to_string(),
        _ => String::new(),
    }
}

/// CSS class hint for the rule-grade badge.
pub fn grade_class(g: u8) -> String {
    match g {
        4 => "grade-4".to_string(),
        3 => "grade-3".to_string(),
        2 => "grade-2".to_string(),
        1 => "grade-1".to_string(),
        _ => String::new(),
    }
}

/// Calculate BMI from weight (kg) and height (cm). Returns None if invalid.
pub fn calculate_bmi(weight_kg: Option<f64>, height_cm: Option<f64>) -> Option<f64> {
    let w = weight_kg?;
    let h = height_cm?;
    if w <= 0.0 || h <= 0.0 {
        return None;
    }
    let height_m = h / 100.0;
    Some(((w / (height_m * height_m)) * 10.0).round() / 10.0)
}

/// BMI category label.
pub fn bmi_category(bmi: Option<f64>) -> String {
    let Some(v) = bmi else {
        return String::new();
    };
    if v < 17.5 {
        "Very low (RED-S risk)".to_string()
    } else if v < 18.5 {
        "Underweight".to_string()
    } else if v < 25.0 {
        "Normal".to_string()
    } else if v < 30.0 {
        "Overweight".to_string()
    } else {
        "Obese".to_string()
    }
}

/// Count non-empty answered fields across all sections (approximate total
/// for the progress bar).
pub fn answered_count(d: &AssessmentData) -> u32 {
    let mut n: u32 = 0;

    macro_rules! count_text {
        ($v:expr) => {
            if !$v.trim().is_empty() {
                n += 1;
            }
        };
    }
    macro_rules! count_num {
        ($v:expr) => {
            if $v.is_some() {
                n += 1;
            }
        };
    }

    // Demographics
    count_text!(d.demographics.first_name);
    count_text!(d.demographics.last_name);
    count_text!(d.demographics.date_of_birth);
    count_text!(d.demographics.sex);
    count_num!(d.demographics.weight);
    count_num!(d.demographics.height);
    count_text!(d.demographics.emergency_contact_name);
    count_text!(d.demographics.emergency_contact_phone);

    // Sport / Position
    count_text!(d.sport_position_details.primary_sport);
    count_text!(d.sport_position_details.primary_position);
    count_text!(d.sport_position_details.contact_level);
    count_text!(d.sport_position_details.competitive_level);
    count_num!(d.sport_position_details.hours_per_week);
    count_text!(d.sport_position_details.previous_clearance_issue);

    // Medical history
    count_text!(d.medical_history.chronic_illness);
    count_text!(d.medical_history.current_medications);
    count_text!(d.medical_history.allergies_known);
    count_text!(d.medical_history.prior_surgery);
    count_text!(d.medical_history.hospitalised_last_year);
    count_text!(d.medical_history.asthma_or_exercise_induced_bronchospasm);
    count_text!(d.medical_history.diabetes);
    count_text!(d.medical_history.sickle_cell_trait_or_disease);
    count_text!(d.medical_history.heat_illness_history);
    count_text!(d.medical_history.eating_disorder_history);

    // Family history
    count_text!(d.family_history.sudden_cardiac_death_under_50);
    count_text!(d.family_history.hypertrophic_cardiomyopathy);
    count_text!(d.family_history.marfan_syndrome);
    count_text!(d.family_history.long_qt_syndrome);
    count_text!(d.family_history.arrhythmia_or_pacemaker);
    count_text!(d.family_history.unexplained_seizure_or_fainting);

    // RED-S (only if applicable)
    if d.menstrual_history_reds.applicable {
        count_num!(d.menstrual_history_reds.age_at_menarche);
        count_text!(d.menstrual_history_reds.regular_periods);
        count_text!(d.menstrual_history_reds.amenorrhoea_six_months);
        count_text!(d.menstrual_history_reds.restrictive_eating_pattern);
        count_text!(d.menstrual_history_reds.stress_fracture_history);
        count_text!(d.menstrual_history_reds.low_energy_availability_concern);
    }

    // Cardiovascular
    count_text!(d.cardiovascular_screening.chest_pain_with_exertion);
    count_text!(d.cardiovascular_screening.unexplained_syncope);
    count_text!(d.cardiovascular_screening.excessive_breathlessness);
    count_text!(d.cardiovascular_screening.palpitations_or_irregular_beat);
    count_text!(d.cardiovascular_screening.high_blood_pressure_diagnosis);
    count_text!(d.cardiovascular_screening.heart_murmur_detected);
    count_text!(d.cardiovascular_screening.restricted_activity_for_heart);

    // Musculoskeletal
    count_text!(d.musculoskeletal_screening.uncorrected_major_injury);
    count_text!(d.musculoskeletal_screening.joint_instability);
    count_text!(d.musculoskeletal_screening.ongoing_pain_or_swelling);
    count_text!(d.musculoskeletal_screening.chronic_joint_disease);
    count_text!(d.musculoskeletal_screening.use_brace_or_assistive_device);
    count_text!(d.musculoskeletal_screening.full_range_of_motion);
    count_text!(d.musculoskeletal_screening.normal_strength_bilateral);

    // Neurological / concussion
    count_num!(d.neurological_concussion_baseline.total_concussions);
    count_text!(d.neurological_concussion_baseline.concussion_last_six_months);
    count_text!(d.neurological_concussion_baseline.ongoing_post_concussive_symptoms);
    count_text!(d.neurological_concussion_baseline.history_of_seizures);
    count_text!(d.neurological_concussion_baseline.stinger);
    count_text!(d.neurological_concussion_baseline.history_of_head_or_neck_surgery);
    count_text!(d.neurological_concussion_baseline.baseline_headaches_or_migraine);

    // Vision / skin
    count_text!(d.vision_skin.corrective_lenses_worn);
    count_text!(d.vision_skin.monocular_athlete);
    count_text!(d.vision_skin.protective_eyewear_available);
    count_text!(d.vision_skin.active_skin_infection);
    count_text!(d.vision_skin.herpes_gladiatorum);
    count_text!(d.vision_skin.impetigo_or_mrsa);
    count_text!(d.vision_skin.open_wounds_or_lesions);

    // Clearance decision
    count_text!(d.clearance_decision.preferred_clearance);
    count_text!(d.clearance_decision.clinician_name);
    count_text!(d.clearance_decision.clinician_signature_date);

    n
}
