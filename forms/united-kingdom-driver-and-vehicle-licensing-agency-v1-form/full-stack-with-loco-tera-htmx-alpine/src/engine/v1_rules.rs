//! DVLA V1 — Vision self-declaration.
//!
//! The V1 form is a structured data-collection form, not a scoring instrument.
//! Each rule below identifies a single field that must be completed for the
//! self-declaration to be acceptable to the DVLA. Heavy conditional logic
//! (Q2 No → monocular branch; Q3 Yes → field-of-vision sub-branch; Q4–Q10
//! Yes → details; etc.) is gated by the `applies` predicate so the validator
//! only counts a rule when its branch is active.
//!
//! Rule IDs follow the pattern V1-<SECTION>-<NN>.

use crate::engine::types::AssessmentData;

/// True if a string is non-empty after trimming.
pub fn has_text(s: &str) -> bool {
    !s.trim().is_empty()
}

// ──────────────────────────────────────────────
// Branch-active helpers
// ──────────────────────────────────────────────

/// Q2 No path → ask which eye, duration, monocular declaration.
pub fn is_monocular_branch_active(d: &AssessmentData) -> bool {
    d.vision_in_both_eyes.has_vision_in_both_eyes == "no"
}

/// Q3 Yes path → ask whether caused solely by an eye condition.
pub fn is_visual_field_branch_active(d: &AssessmentData) -> bool {
    d.field_of_vision.has_problem == "yes"
}

/// Q3b No path → ask specific cause.
pub fn is_visual_field_cause_branch_active(d: &AssessmentData) -> bool {
    d.field_of_vision.has_problem == "yes"
        && d.field_of_vision.caused_solely_by_eye_condition == "no"
}

/// Q4 Yes path → ask which eye(s).
pub fn is_glaucoma_branch_active(d: &AssessmentData) -> bool {
    d.glaucoma.has_condition == "yes"
}

/// Q5 Yes path → ask which eye(s).
pub fn is_retinitis_pigmentosa_branch_active(d: &AssessmentData) -> bool {
    d.retinitis_pigmentosa.has_condition == "yes"
}

/// Q6 Yes path → ask treatment dates.
pub fn is_laser_treatment_branch_active(d: &AssessmentData) -> bool {
    d.laser_treatment.has_had_treatment == "yes"
}

/// Q7 Yes path → ask which eye(s), treatment status, controlled status.
pub fn is_blepharospasm_branch_active(d: &AssessmentData) -> bool {
    d.blepharospasm.has_condition == "yes"
}

/// Q8 Yes path → ask which eye(s).
pub fn is_night_blindness_branch_active(d: &AssessmentData) -> bool {
    d.night_blindness.has_condition == "yes"
}

/// Q9 Yes path → ask controlled, 6-month, declaration.
pub fn is_double_vision_branch_active(d: &AssessmentData) -> bool {
    d.double_vision.has_condition == "yes"
}

/// Q10 Yes path → ask details.
pub fn is_other_vision_branch_active(d: &AssessmentData) -> bool {
    d.other_vision_conditions.has_other == "yes"
}

/// Q11 Yes path → ask date of contact.
pub fn is_recent_contact_branch_active(d: &AssessmentData) -> bool {
    d.recent_contact.had_contact == "yes"
}

/// Human-readable label for a section key.
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

pub struct ValidationRule {
    pub id: &'static str,
    pub section: &'static str,
    pub description: &'static str,
    pub message: &'static str,
    pub applies: fn(&AssessmentData) -> bool,
    pub is_satisfied: fn(&AssessmentData) -> bool,
}

pub fn v1_rules() -> &'static [ValidationRule] {
    &[
        // ── Step 1 — Personal Details ─────────────────────
        ValidationRule {
            id: "V1-PD-001",
            section: "personalDetails",
            description: "Full name required.",
            message: "Full name is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.personal_details.full_name),
        },
        ValidationRule {
            id: "V1-PD-002",
            section: "personalDetails",
            description: "Date of birth required.",
            message: "Date of birth is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.personal_details.date_of_birth),
        },
        ValidationRule {
            id: "V1-PD-003",
            section: "personalDetails",
            description: "Address required.",
            message: "Address is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.personal_details.address),
        },
        ValidationRule {
            id: "V1-PD-004",
            section: "personalDetails",
            description: "Postcode required.",
            message: "Postcode is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.personal_details.postcode),
        },
        // ── Step 2 — Healthcare Professionals ─────────────
        ValidationRule {
            id: "V1-HCP-001",
            section: "healthcareProfessionals",
            description: "GP name required.",
            message: "GP name is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.healthcare_professionals.gp.name),
        },
        ValidationRule {
            id: "V1-HCP-002",
            section: "healthcareProfessionals",
            description: "GP surgery name required.",
            message: "GP surgery name is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.healthcare_professionals.gp.surgery_name),
        },
        // ── Step 3 — Q1 Eyesight Standards ────────────────
        ValidationRule {
            id: "V1-Q1-001",
            section: "eyesightStandards",
            description: "Eyesight standard answer required.",
            message: "Please answer whether you meet the eyesight standard for driving.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.eyesight_standards.meets_standard),
        },
        // ── Step 4 — Q2 Vision in Both Eyes ───────────────
        ValidationRule {
            id: "V1-Q2-001",
            section: "visionInBothEyes",
            description: "Vision-in-both-eyes Yes/No required.",
            message: "Please answer whether you have vision in both eyes.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.vision_in_both_eyes.has_vision_in_both_eyes),
        },
        ValidationRule {
            id: "V1-Q2-002",
            section: "visionInBothEyes",
            description: "Monocular: which eye required.",
            message: "Please indicate which eye you can see with.",
            applies: is_monocular_branch_active,
            is_satisfied: |d| has_text(&d.vision_in_both_eyes.which_eye),
        },
        ValidationRule {
            id: "V1-Q2-003",
            section: "visionInBothEyes",
            description: "Monocular: duration required.",
            message: "Please indicate how long you have had vision in only one eye.",
            applies: is_monocular_branch_active,
            is_satisfied: |d| has_text(&d.vision_in_both_eyes.duration),
        },
        ValidationRule {
            id: "V1-Q2-004",
            section: "visionInBothEyes",
            description: "Monocular: adaptation required.",
            message: "Please indicate whether you have adapted to vision in one eye.",
            applies: is_monocular_branch_active,
            is_satisfied: |d| has_text(&d.vision_in_both_eyes.adaptation),
        },
        ValidationRule {
            id: "V1-Q2-005",
            section: "visionInBothEyes",
            description: "Monocular declaration confirmation required.",
            message: "Please confirm the monocular vision declaration.",
            applies: is_monocular_branch_active,
            is_satisfied: |d| d.vision_in_both_eyes.monocular_declaration_confirmed,
        },
        // ── Step 5 — Q3 Field of Vision ───────────────────
        ValidationRule {
            id: "V1-Q3-001",
            section: "fieldOfVision",
            description: "Visual field problem Yes/No required.",
            message: "Please answer whether you have a problem with your field of vision.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.field_of_vision.has_problem),
        },
        ValidationRule {
            id: "V1-Q3-002",
            section: "fieldOfVision",
            description: "Visual field: caused-by-eye-condition Yes/No required.",
            message: "Please answer whether the visual-field problem is caused solely by an eye condition.",
            applies: is_visual_field_branch_active,
            is_satisfied: |d| has_text(&d.field_of_vision.caused_solely_by_eye_condition),
        },
        ValidationRule {
            id: "V1-Q3-003",
            section: "fieldOfVision",
            description: "Visual field: cause selection required.",
            message: "Please indicate the cause of the visual-field problem.",
            applies: is_visual_field_cause_branch_active,
            is_satisfied: |d| has_text(&d.field_of_vision.cause),
        },
        ValidationRule {
            id: "V1-Q3-004",
            section: "fieldOfVision",
            description: "Visual field: other-cause details required.",
            message: "Please describe the other cause of the visual-field problem.",
            applies: |d| {
                is_visual_field_cause_branch_active(d) && d.field_of_vision.cause == "other"
            },
            is_satisfied: |d| has_text(&d.field_of_vision.cause_other_details),
        },
        // ── Step 6 — Q4 Glaucoma ──────────────────────────
        ValidationRule {
            id: "V1-Q4-001",
            section: "glaucoma",
            description: "Glaucoma Yes/No required.",
            message: "Please answer whether you have glaucoma.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.glaucoma.has_condition),
        },
        ValidationRule {
            id: "V1-Q4-002",
            section: "glaucoma",
            description: "Glaucoma: which eye(s) required.",
            message: "Please indicate which eye(s) are affected by glaucoma.",
            applies: is_glaucoma_branch_active,
            is_satisfied: |d| has_text(&d.glaucoma.which_eyes),
        },
        // ── Step 7 — Q5 Retinitis Pigmentosa ──────────────
        ValidationRule {
            id: "V1-Q5-001",
            section: "retinitisPigmentosa",
            description: "Retinitis pigmentosa Yes/No required.",
            message: "Please answer whether you have retinitis pigmentosa.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.retinitis_pigmentosa.has_condition),
        },
        ValidationRule {
            id: "V1-Q5-002",
            section: "retinitisPigmentosa",
            description: "Retinitis pigmentosa: which eye(s) required.",
            message: "Please indicate which eye(s) are affected by retinitis pigmentosa.",
            applies: is_retinitis_pigmentosa_branch_active,
            is_satisfied: |d| has_text(&d.retinitis_pigmentosa.which_eyes),
        },
        // ── Step 8 — Q6 Laser Treatment ───────────────────
        ValidationRule {
            id: "V1-Q6-001",
            section: "laserTreatment",
            description: "Laser treatment Yes/No required.",
            message: "Please answer whether you have had laser treatment.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.laser_treatment.has_had_treatment),
        },
        ValidationRule {
            id: "V1-Q6-002",
            section: "laserTreatment",
            description: "Laser treatment: at least one date required.",
            message: "Please supply at least one laser-treatment date.",
            applies: is_laser_treatment_branch_active,
            is_satisfied: |d| {
                has_text(&d.laser_treatment.left_eye_first_date)
                    || has_text(&d.laser_treatment.right_eye_first_date)
                    || has_text(&d.laser_treatment.left_eye_last_date)
                    || has_text(&d.laser_treatment.right_eye_last_date)
            },
        },
        // ── Step 9 — Q7 Blepharospasm ─────────────────────
        ValidationRule {
            id: "V1-Q7-001",
            section: "blepharospasm",
            description: "Blepharospasm Yes/No required.",
            message: "Please answer whether you have blepharospasm.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.blepharospasm.has_condition),
        },
        ValidationRule {
            id: "V1-Q7-002",
            section: "blepharospasm",
            description: "Blepharospasm: which eye(s) required.",
            message: "Please indicate which eye(s) are affected by blepharospasm.",
            applies: is_blepharospasm_branch_active,
            is_satisfied: |d| has_text(&d.blepharospasm.which_eyes),
        },
        ValidationRule {
            id: "V1-Q7-003",
            section: "blepharospasm",
            description: "Blepharospasm: treatment Yes/No required.",
            message: "Please answer whether you have had treatment for blepharospasm.",
            applies: is_blepharospasm_branch_active,
            is_satisfied: |d| has_text(&d.blepharospasm.has_had_treatment),
        },
        ValidationRule {
            id: "V1-Q7-004",
            section: "blepharospasm",
            description: "Blepharospasm: controlled Yes/No required.",
            message: "Please answer whether your healthcare professional is satisfied that blepharospasm is adequately controlled.",
            applies: is_blepharospasm_branch_active,
            is_satisfied: |d| has_text(&d.blepharospasm.adequately_controlled),
        },
        // ── Step 10 — Q8 Night Blindness ──────────────────
        ValidationRule {
            id: "V1-Q8-001",
            section: "nightBlindness",
            description: "Night blindness Yes/No required.",
            message: "Please answer whether you have night blindness.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.night_blindness.has_condition),
        },
        ValidationRule {
            id: "V1-Q8-002",
            section: "nightBlindness",
            description: "Night blindness: which eye(s) required.",
            message: "Please indicate which eye(s) are affected by night blindness.",
            applies: is_night_blindness_branch_active,
            is_satisfied: |d| has_text(&d.night_blindness.which_eyes),
        },
        // ── Step 11 — Q9 Double Vision ────────────────────
        ValidationRule {
            id: "V1-Q9-001",
            section: "doubleVision",
            description: "Double vision Yes/No required.",
            message: "Please answer whether you have double vision.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.double_vision.has_condition),
        },
        ValidationRule {
            id: "V1-Q9-002",
            section: "doubleVision",
            description: "Double vision: controlled Yes/No required.",
            message: "Please answer whether your double vision is controlled.",
            applies: is_double_vision_branch_active,
            is_satisfied: |d| has_text(&d.double_vision.controlled),
        },
        ValidationRule {
            id: "V1-Q9-003",
            section: "doubleVision",
            description: "Double vision: 6-month Yes/No required when uncontrolled.",
            message: "Please answer whether the double vision has been the same for 6 months or more.",
            applies: |d| {
                is_double_vision_branch_active(d) && d.double_vision.controlled == "no"
            },
            is_satisfied: |d| has_text(&d.double_vision.same_for_six_months_or_more),
        },
        ValidationRule {
            id: "V1-Q9-004",
            section: "doubleVision",
            description: "Double vision declaration confirmation required.",
            message: "Please confirm the double-vision adaptation declaration.",
            applies: is_double_vision_branch_active,
            is_satisfied: |d| d.double_vision.double_vision_declaration_confirmed,
        },
        ValidationRule {
            id: "V1-Q9-005",
            section: "doubleVision",
            description: "Double vision: declaration signature required.",
            message: "Please sign the double-vision declaration.",
            applies: is_double_vision_branch_active,
            is_satisfied: |d| has_text(&d.double_vision.declaration_signature_name),
        },
        ValidationRule {
            id: "V1-Q9-006",
            section: "doubleVision",
            description: "Double vision: declaration date required.",
            message: "Please supply the double-vision declaration date.",
            applies: is_double_vision_branch_active,
            is_satisfied: |d| has_text(&d.double_vision.declaration_date),
        },
        // ── Step 12 — Q10 Other Vision Conditions ─────────
        ValidationRule {
            id: "V1-Q10-001",
            section: "otherVisionConditions",
            description: "Other vision conditions Yes/No required.",
            message: "Please answer whether you have any other vision condition.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.other_vision_conditions.has_other),
        },
        ValidationRule {
            id: "V1-Q10-002",
            section: "otherVisionConditions",
            description: "Other vision conditions: details required.",
            message: "Please describe the other vision condition(s) and which eye(s) are affected.",
            applies: is_other_vision_branch_active,
            is_satisfied: |d| has_text(&d.other_vision_conditions.details),
        },
        // ── Step 13 — Q11 Recent Contact ──────────────────
        ValidationRule {
            id: "V1-Q11-001",
            section: "recentContact",
            description: "Recent contact Yes/No required.",
            message: "Please answer whether you have had recent contact with your healthcare professional or optician about your vision.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.recent_contact.had_contact),
        },
        ValidationRule {
            id: "V1-Q11-002",
            section: "recentContact",
            description: "Recent contact: date required.",
            message: "Please supply the date of your most recent contact.",
            applies: is_recent_contact_branch_active,
            is_satisfied: |d| has_text(&d.recent_contact.date_of_contact),
        },
        // ── Step 14 — Authorisation ───────────────────────
        ValidationRule {
            id: "V1-AUTH-001",
            section: "authorisation",
            description: "Declaration confirmation required.",
            message: "Please confirm the applicant authorisation declaration.",
            applies: |_| true,
            is_satisfied: |d| d.authorisation.declaration_confirmed,
        },
        ValidationRule {
            id: "V1-AUTH-002",
            section: "authorisation",
            description: "Authorisation: name required.",
            message: "Please supply your full name on the authorisation.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.authorisation.name),
        },
        ValidationRule {
            id: "V1-AUTH-003",
            section: "authorisation",
            description: "Authorisation: signature required.",
            message: "Please sign the authorisation.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.authorisation.signature),
        },
        ValidationRule {
            id: "V1-AUTH-004",
            section: "authorisation",
            description: "Authorisation: date required.",
            message: "Please supply the authorisation date.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.authorisation.date),
        },
        ValidationRule {
            id: "V1-AUTH-005",
            section: "authorisation",
            description: "Authorisation: electronic-correspondence consent required.",
            message: "Please indicate whether you authorise electronic correspondence.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.authorisation.authorise_electronic_correspondence),
        },
    ]
}
