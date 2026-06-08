//! Helper predicates and counters used by the grader.

use super::types::AssessmentData;

/// Display label for the overall completion / flag status.
pub fn priority_label(priority: &str) -> &'static str {
    match priority {
        "urgent" => "Urgent",
        "high" => "High",
        "medium" => "Medium",
        "low" => "Low",
        _ => "",
    }
}

/// Human-friendly section label for the report and dashboard.
pub fn section_label(section: &str) -> &'static str {
    match section {
        "personalDetails" => "Personal Details",
        "healthcareProfessionals" => "Healthcare Professionals",
        "eyesightStandards" => "Eyesight Standards (Q1)",
        "visionInBothEyes" => "Vision in Both Eyes (Q2)",
        "fieldOfVision" => "Field of Vision (Q3)",
        "glaucoma" => "Glaucoma (Q4)",
        "retinitisPigmentosa" => "Retinitis Pigmentosa (Q5)",
        "laserTreatment" => "Laser Treatment (Q6)",
        "blepharospasm" => "Blepharospasm (Q7)",
        "nightBlindness" => "Night Blindness (Q8)",
        "doubleVision" => "Double Vision (Q9)",
        "otherVisionConditions" => "Other Vision Conditions (Q10)",
        "recentContact" => "Recent Contact (Q11)",
        "authorisation" => "Authorisation",
        _ => "",
    }
}

// ── Branch-active helpers (mirror Svelte / JS utils) ────────────────────

/// Is monocular branch active.
pub fn is_monocular_branch_active(d: &AssessmentData) -> bool {
    d.vision_in_both_eyes.has_vision_in_both_eyes == "no"
}

/// Is visual field branch active.
pub fn is_visual_field_branch_active(d: &AssessmentData) -> bool {
    d.field_of_vision.has_problem == "yes"
}

/// Is visual field cause branch active.
pub fn is_visual_field_cause_branch_active(d: &AssessmentData) -> bool {
    d.field_of_vision.has_problem == "yes"
        && d.field_of_vision.caused_solely_by_eye_condition == "no"
}

/// Is glaucoma branch active.
pub fn is_glaucoma_branch_active(d: &AssessmentData) -> bool {
    d.glaucoma.has_condition == "yes"
}

/// Is retinitis pigmentosa branch active.
pub fn is_retinitis_pigmentosa_branch_active(d: &AssessmentData) -> bool {
    d.retinitis_pigmentosa.has_condition == "yes"
}

/// Is laser treatment branch active.
pub fn is_laser_treatment_branch_active(d: &AssessmentData) -> bool {
    d.laser_treatment.has_had_treatment == "yes"
}

/// Is blepharospasm branch active.
pub fn is_blepharospasm_branch_active(d: &AssessmentData) -> bool {
    d.blepharospasm.has_condition == "yes"
}

/// Is night blindness branch active.
pub fn is_night_blindness_branch_active(d: &AssessmentData) -> bool {
    d.night_blindness.has_condition == "yes"
}

/// Is double vision branch active.
pub fn is_double_vision_branch_active(d: &AssessmentData) -> bool {
    d.double_vision.has_condition == "yes"
}

/// Is other vision branch active.
pub fn is_other_vision_branch_active(d: &AssessmentData) -> bool {
    d.other_vision_conditions.has_other == "yes"
}

/// Is recent contact branch active.
pub fn is_recent_contact_branch_active(d: &AssessmentData) -> bool {
    d.recent_contact.had_contact == "yes"
}
