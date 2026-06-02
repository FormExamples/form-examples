// DVLA V1 — branch-aware completeness validation rules.
//
// Each rule asserts that a required field on the *active* branch has been
// answered. Rules whose branch is inactive (because of a "No" answer earlier
// in the conditional flow) trivially pass. This is a direct port of
// `front-end-form-with-html/js/v1-rules.js`.

use super::types::AssessmentData;
use super::utils::{
    is_blepharospasm_branch_active, is_double_vision_branch_active,
    is_glaucoma_branch_active, is_laser_treatment_branch_active,
    is_monocular_branch_active, is_night_blindness_branch_active,
    is_other_vision_branch_active, is_recent_contact_branch_active,
    is_retinitis_pigmentosa_branch_active, is_visual_field_branch_active,
    is_visual_field_cause_branch_active,
};

/// A declarative completeness rule. `evaluate(d)` returns `true` when the
/// rule is satisfied (i.e. the required field on the active branch is
/// answered). It returns `false` when the rule fires (unsatisfied).
pub struct ValidationRule {
    pub id: &'static str,
    pub section: &'static str,
    pub severity: &'static str,
    pub description: &'static str,
    pub message: &'static str,
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// All DVLA V1 rules, in declaration order. Rule IDs are preserved
/// verbatim from the JavaScript implementation.
pub fn all_rules() -> Vec<ValidationRule> {
    vec![
        // ── Step 1 — Personal Details ─────────────────────
        ValidationRule {
            id: "V1-PD-001",
            section: "personalDetails",
            severity: "error",
            description: "Full name required.",
            message: "Full name is required.",
            evaluate: |d| !d.personal_details.full_name.trim().is_empty(),
        },
        ValidationRule {
            id: "V1-PD-002",
            section: "personalDetails",
            severity: "error",
            description: "Date of birth required.",
            message: "Date of birth is required.",
            evaluate: |d| !d.personal_details.date_of_birth.is_empty(),
        },
        ValidationRule {
            id: "V1-PD-003",
            section: "personalDetails",
            severity: "error",
            description: "Address required.",
            message: "Address is required.",
            evaluate: |d| !d.personal_details.address.trim().is_empty(),
        },
        ValidationRule {
            id: "V1-PD-004",
            section: "personalDetails",
            severity: "error",
            description: "Postcode required.",
            message: "Postcode is required.",
            evaluate: |d| !d.personal_details.postcode.trim().is_empty(),
        },
        // ── Step 2 — Healthcare Professionals ─────────────
        ValidationRule {
            id: "V1-HCP-001",
            section: "healthcareProfessionals",
            severity: "error",
            description: "GP name required.",
            message: "GP name is required.",
            evaluate: |d| !d.healthcare_professionals.gp.name.trim().is_empty(),
        },
        ValidationRule {
            id: "V1-HCP-002",
            section: "healthcareProfessionals",
            severity: "error",
            description: "GP surgery name required.",
            message: "GP surgery name is required.",
            evaluate: |d| !d.healthcare_professionals.gp.surgery_name.trim().is_empty(),
        },
        // ── Step 3 — Q1 Eyesight Standards ────────────────
        ValidationRule {
            id: "V1-Q1-001",
            section: "eyesightStandards",
            severity: "error",
            description: "Eyesight standard answer required.",
            message: "Please answer whether you meet the eyesight standard for driving.",
            evaluate: |d| !d.eyesight_standards.meets_standard.is_empty(),
        },
        // ── Step 4 — Q2 Vision in Both Eyes ───────────────
        ValidationRule {
            id: "V1-Q2-001",
            section: "visionInBothEyes",
            severity: "error",
            description: "Vision-in-both-eyes Yes/No required.",
            message: "Please answer whether you have vision in both eyes.",
            evaluate: |d| !d.vision_in_both_eyes.has_vision_in_both_eyes.is_empty(),
        },
        ValidationRule {
            id: "V1-Q2-002",
            section: "visionInBothEyes",
            severity: "error",
            description: "Monocular: which eye required.",
            message: "Please indicate which eye you can see with.",
            evaluate: |d| {
                !is_monocular_branch_active(d) || !d.vision_in_both_eyes.which_eye.is_empty()
            },
        },
        ValidationRule {
            id: "V1-Q2-003",
            section: "visionInBothEyes",
            severity: "error",
            description: "Monocular: duration required.",
            message: "Please indicate how long you have had vision in only one eye.",
            evaluate: |d| {
                !is_monocular_branch_active(d) || !d.vision_in_both_eyes.duration.is_empty()
            },
        },
        ValidationRule {
            id: "V1-Q2-004",
            section: "visionInBothEyes",
            severity: "error",
            description: "Monocular: adaptation required.",
            message: "Please indicate whether you have adapted to vision in one eye.",
            evaluate: |d| {
                !is_monocular_branch_active(d) || !d.vision_in_both_eyes.adaptation.is_empty()
            },
        },
        ValidationRule {
            id: "V1-Q2-005",
            section: "visionInBothEyes",
            severity: "error",
            description: "Monocular declaration confirmation required.",
            message: "Please confirm the monocular vision declaration.",
            evaluate: |d| {
                !is_monocular_branch_active(d)
                    || d.vision_in_both_eyes.monocular_declaration_confirmed
            },
        },
        // ── Step 5 — Q3 Field of Vision ───────────────────
        ValidationRule {
            id: "V1-Q3-001",
            section: "fieldOfVision",
            severity: "error",
            description: "Visual field problem Yes/No required.",
            message: "Please answer whether you have a problem with your field of vision.",
            evaluate: |d| !d.field_of_vision.has_problem.is_empty(),
        },
        ValidationRule {
            id: "V1-Q3-002",
            section: "fieldOfVision",
            severity: "error",
            description: "Visual field: caused-by-eye-condition Yes/No required.",
            message:
                "Please answer whether the visual-field problem is caused solely by an eye condition.",
            evaluate: |d| {
                !is_visual_field_branch_active(d)
                    || !d.field_of_vision.caused_solely_by_eye_condition.is_empty()
            },
        },
        ValidationRule {
            id: "V1-Q3-003",
            section: "fieldOfVision",
            severity: "error",
            description: "Visual field: cause selection required.",
            message: "Please indicate the cause of the visual-field problem.",
            evaluate: |d| {
                !is_visual_field_cause_branch_active(d) || !d.field_of_vision.cause.is_empty()
            },
        },
        ValidationRule {
            id: "V1-Q3-004",
            section: "fieldOfVision",
            severity: "error",
            description: "Visual field: other-cause details required.",
            message: "Please describe the other cause of the visual-field problem.",
            evaluate: |d| {
                !is_visual_field_cause_branch_active(d)
                    || d.field_of_vision.cause != "other"
                    || !d.field_of_vision.cause_other_details.trim().is_empty()
            },
        },
        // ── Step 6 — Q4 Glaucoma ──────────────────────────
        ValidationRule {
            id: "V1-Q4-001",
            section: "glaucoma",
            severity: "error",
            description: "Glaucoma Yes/No required.",
            message: "Please answer whether you have glaucoma.",
            evaluate: |d| !d.glaucoma.has_condition.is_empty(),
        },
        ValidationRule {
            id: "V1-Q4-002",
            section: "glaucoma",
            severity: "error",
            description: "Glaucoma: which eye(s) required.",
            message: "Please indicate which eye(s) are affected by glaucoma.",
            evaluate: |d| !is_glaucoma_branch_active(d) || !d.glaucoma.which_eyes.is_empty(),
        },
        // ── Step 7 — Q5 Retinitis Pigmentosa ──────────────
        ValidationRule {
            id: "V1-Q5-001",
            section: "retinitisPigmentosa",
            severity: "error",
            description: "Retinitis pigmentosa Yes/No required.",
            message: "Please answer whether you have retinitis pigmentosa.",
            evaluate: |d| !d.retinitis_pigmentosa.has_condition.is_empty(),
        },
        ValidationRule {
            id: "V1-Q5-002",
            section: "retinitisPigmentosa",
            severity: "error",
            description: "Retinitis pigmentosa: which eye(s) required.",
            message: "Please indicate which eye(s) are affected by retinitis pigmentosa.",
            evaluate: |d| {
                !is_retinitis_pigmentosa_branch_active(d)
                    || !d.retinitis_pigmentosa.which_eyes.is_empty()
            },
        },
        // ── Step 8 — Q6 Laser Treatment ───────────────────
        ValidationRule {
            id: "V1-Q6-001",
            section: "laserTreatment",
            severity: "error",
            description: "Laser treatment Yes/No required.",
            message: "Please answer whether you have had laser treatment.",
            evaluate: |d| !d.laser_treatment.has_had_treatment.is_empty(),
        },
        ValidationRule {
            id: "V1-Q6-002",
            section: "laserTreatment",
            severity: "error",
            description: "Laser treatment: at least one date required.",
            message: "Please supply at least one laser-treatment date.",
            evaluate: |d| {
                !is_laser_treatment_branch_active(d)
                    || !d.laser_treatment.left_eye_first_date.is_empty()
                    || !d.laser_treatment.right_eye_first_date.is_empty()
                    || !d.laser_treatment.left_eye_last_date.is_empty()
                    || !d.laser_treatment.right_eye_last_date.is_empty()
            },
        },
        // ── Step 9 — Q7 Blepharospasm ─────────────────────
        ValidationRule {
            id: "V1-Q7-001",
            section: "blepharospasm",
            severity: "error",
            description: "Blepharospasm Yes/No required.",
            message: "Please answer whether you have blepharospasm.",
            evaluate: |d| !d.blepharospasm.has_condition.is_empty(),
        },
        ValidationRule {
            id: "V1-Q7-002",
            section: "blepharospasm",
            severity: "error",
            description: "Blepharospasm: which eye(s) required.",
            message: "Please indicate which eye(s) are affected by blepharospasm.",
            evaluate: |d| {
                !is_blepharospasm_branch_active(d) || !d.blepharospasm.which_eyes.is_empty()
            },
        },
        ValidationRule {
            id: "V1-Q7-003",
            section: "blepharospasm",
            severity: "error",
            description: "Blepharospasm: treatment Yes/No required.",
            message: "Please answer whether you have had treatment for blepharospasm.",
            evaluate: |d| {
                !is_blepharospasm_branch_active(d) || !d.blepharospasm.has_had_treatment.is_empty()
            },
        },
        ValidationRule {
            id: "V1-Q7-004",
            section: "blepharospasm",
            severity: "error",
            description: "Blepharospasm: controlled Yes/No required.",
            message:
                "Please answer whether your healthcare professional is satisfied that blepharospasm is adequately controlled.",
            evaluate: |d| {
                !is_blepharospasm_branch_active(d)
                    || !d.blepharospasm.adequately_controlled.is_empty()
            },
        },
        // ── Step 10 — Q8 Night Blindness ──────────────────
        ValidationRule {
            id: "V1-Q8-001",
            section: "nightBlindness",
            severity: "error",
            description: "Night blindness Yes/No required.",
            message: "Please answer whether you have night blindness.",
            evaluate: |d| !d.night_blindness.has_condition.is_empty(),
        },
        ValidationRule {
            id: "V1-Q8-002",
            section: "nightBlindness",
            severity: "error",
            description: "Night blindness: which eye(s) required.",
            message: "Please indicate which eye(s) are affected by night blindness.",
            evaluate: |d| {
                !is_night_blindness_branch_active(d) || !d.night_blindness.which_eyes.is_empty()
            },
        },
        // ── Step 11 — Q9 Double Vision ────────────────────
        ValidationRule {
            id: "V1-Q9-001",
            section: "doubleVision",
            severity: "error",
            description: "Double vision Yes/No required.",
            message: "Please answer whether you have double vision.",
            evaluate: |d| !d.double_vision.has_condition.is_empty(),
        },
        ValidationRule {
            id: "V1-Q9-002",
            section: "doubleVision",
            severity: "error",
            description: "Double vision: controlled Yes/No required.",
            message: "Please answer whether your double vision is controlled.",
            evaluate: |d| {
                !is_double_vision_branch_active(d) || !d.double_vision.controlled.is_empty()
            },
        },
        ValidationRule {
            id: "V1-Q9-003",
            section: "doubleVision",
            severity: "error",
            description: "Double vision: 6-month Yes/No required when uncontrolled.",
            message: "Please answer whether the double vision has been the same for 6 months or more.",
            evaluate: |d| {
                !is_double_vision_branch_active(d)
                    || d.double_vision.controlled != "no"
                    || !d.double_vision.same_for_six_months_or_more.is_empty()
            },
        },
        ValidationRule {
            id: "V1-Q9-004",
            section: "doubleVision",
            severity: "error",
            description: "Double vision declaration confirmation required.",
            message: "Please confirm the double-vision adaptation declaration.",
            evaluate: |d| {
                !is_double_vision_branch_active(d)
                    || d.double_vision.double_vision_declaration_confirmed
            },
        },
        ValidationRule {
            id: "V1-Q9-005",
            section: "doubleVision",
            severity: "error",
            description: "Double vision: declaration signature required.",
            message: "Please sign the double-vision declaration.",
            evaluate: |d| {
                !is_double_vision_branch_active(d)
                    || !d.double_vision.declaration_signature_name.trim().is_empty()
            },
        },
        ValidationRule {
            id: "V1-Q9-006",
            section: "doubleVision",
            severity: "error",
            description: "Double vision: declaration date required.",
            message: "Please supply the double-vision declaration date.",
            evaluate: |d| {
                !is_double_vision_branch_active(d) || !d.double_vision.declaration_date.is_empty()
            },
        },
        // ── Step 12 — Q10 Other Vision Conditions ─────────
        ValidationRule {
            id: "V1-Q10-001",
            section: "otherVisionConditions",
            severity: "error",
            description: "Other vision conditions Yes/No required.",
            message: "Please answer whether you have any other vision condition.",
            evaluate: |d| !d.other_vision_conditions.has_other.is_empty(),
        },
        ValidationRule {
            id: "V1-Q10-002",
            section: "otherVisionConditions",
            severity: "error",
            description: "Other vision conditions: details required.",
            message: "Please describe the other vision condition(s) and which eye(s) are affected.",
            evaluate: |d| {
                !is_other_vision_branch_active(d)
                    || !d.other_vision_conditions.details.trim().is_empty()
            },
        },
        // ── Step 13 — Q11 Recent Contact ──────────────────
        ValidationRule {
            id: "V1-Q11-001",
            section: "recentContact",
            severity: "error",
            description: "Recent contact Yes/No required.",
            message:
                "Please answer whether you have had recent contact with your healthcare professional or optician about your vision.",
            evaluate: |d| !d.recent_contact.had_contact.is_empty(),
        },
        ValidationRule {
            id: "V1-Q11-002",
            section: "recentContact",
            severity: "error",
            description: "Recent contact: date required.",
            message: "Please supply the date of your most recent contact.",
            evaluate: |d| {
                !is_recent_contact_branch_active(d) || !d.recent_contact.date_of_contact.is_empty()
            },
        },
        // ── Step 14 — Authorisation ───────────────────────
        ValidationRule {
            id: "V1-AUTH-001",
            section: "authorisation",
            severity: "error",
            description: "Declaration confirmation required.",
            message: "Please confirm the applicant authorisation declaration.",
            evaluate: |d| d.authorisation.declaration_confirmed,
        },
        ValidationRule {
            id: "V1-AUTH-002",
            section: "authorisation",
            severity: "error",
            description: "Authorisation: name required.",
            message: "Please supply your full name on the authorisation.",
            evaluate: |d| !d.authorisation.name.trim().is_empty(),
        },
        ValidationRule {
            id: "V1-AUTH-003",
            section: "authorisation",
            severity: "error",
            description: "Authorisation: signature required.",
            message: "Please sign the authorisation.",
            evaluate: |d| !d.authorisation.signature.trim().is_empty(),
        },
        ValidationRule {
            id: "V1-AUTH-004",
            section: "authorisation",
            severity: "error",
            description: "Authorisation: date required.",
            message: "Please supply the authorisation date.",
            evaluate: |d| !d.authorisation.date.is_empty(),
        },
        ValidationRule {
            id: "V1-AUTH-005",
            section: "authorisation",
            severity: "error",
            description: "Authorisation: electronic-correspondence consent required.",
            message: "Please indicate whether you authorise electronic correspondence.",
            evaluate: |d| !d.authorisation.authorise_electronic_correspondence.is_empty(),
        },
    ]
}
