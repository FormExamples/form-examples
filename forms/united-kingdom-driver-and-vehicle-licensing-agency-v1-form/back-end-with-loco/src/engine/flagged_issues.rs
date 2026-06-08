//! Detection of additional flagged issues.

// DVLA V1 flagged-issue detection. Independent of the completeness check,
// this module raises clinician- or DVLA-significant flags for high-risk
// responses (eyesight failure, uncontrolled diplopia, monocular without
// adaptation, etc.). Direct port of
// `front-end-form-with-html/js/flagged-issues.js`.
//
// Priority ladder:
//   urgent — patient asserts they do not meet the eyesight standard, or
//            uncontrolled diplopia not yet 6 months stable.
//   high   — uncontrolled vision condition likely to bar driving.
//   medium — condition present that requires individual review.
//   low    — supportive context flag.

use super::types::{AssessmentData, FlaggedIssue};

/// Detect DVLA V1 flagged issues. Flag IDs preserved verbatim.
pub fn detect_flagged_issues(data: &AssessmentData) -> Vec<FlaggedIssue> {
    let mut flags: Vec<FlaggedIssue> = Vec::new();

    // ─── Q1 — Eyesight standard failure ──────────────────────
    if data.eyesight_standards.meets_standard == "no" {
        flags.push(FlaggedIssue {
            id: "V1-FLAG-EYE-001".to_string(),
            category: "Eyesight Standard".to_string(),
            message:
                "Patient declares they do not meet the Snellen 6/12 eyesight standard for driving."
                    .to_string(),
            priority: "urgent".to_string(),
        });
    }

    // ─── Q2 — Monocular vision ───────────────────────────────
    if data.vision_in_both_eyes.has_vision_in_both_eyes == "no" {
        if data.vision_in_both_eyes.adaptation == "not-adapted" {
            flags.push(FlaggedIssue {
                id: "V1-FLAG-MONO-001".to_string(),
                category: "Monocular Vision".to_string(),
                message:
                    "Monocular vision without adaptation period — patient must not drive until adapted (typically 3+ months)."
                        .to_string(),
                priority: "high".to_string(),
            });
        } else if data.vision_in_both_eyes.adaptation == "adapted-self" {
            flags.push(FlaggedIssue {
                id: "V1-FLAG-MONO-002".to_string(),
                category: "Monocular Vision".to_string(),
                message:
                    "Monocular vision adaptation has not been reviewed by a healthcare professional."
                        .to_string(),
                priority: "medium".to_string(),
            });
        } else if data.vision_in_both_eyes.adaptation == "adapted-advised" {
            flags.push(FlaggedIssue {
                id: "V1-FLAG-MONO-003".to_string(),
                category: "Monocular Vision".to_string(),
                message:
                    "Monocular vision with confirmed healthcare-professional-supervised adaptation."
                        .to_string(),
                priority: "low".to_string(),
            });
        }
    }

    // ─── Q3 — Visual field problem ───────────────────────────
    if data.field_of_vision.has_problem == "yes" {
        if data.field_of_vision.caused_solely_by_eye_condition == "no" {
            let cause = if data.field_of_vision.cause.is_empty() {
                "unspecified".to_string()
            } else {
                data.field_of_vision.cause.clone()
            };
            flags.push(FlaggedIssue {
                id: "V1-FLAG-VF-001".to_string(),
                category: "Visual Field".to_string(),
                message: format!(
                    "Visual-field defect with non-ocular cause ({cause}) — DVLA visual-field testing recommended."
                ),
                priority: "high".to_string(),
            });
        } else {
            flags.push(FlaggedIssue {
                id: "V1-FLAG-VF-002".to_string(),
                category: "Visual Field".to_string(),
                message: "Visual-field defect of ocular origin — DVLA visual-field testing recommended."
                    .to_string(),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Q4 — Glaucoma ───────────────────────────────────────
    if data.glaucoma.has_condition == "yes" {
        let which = if data.glaucoma.which_eyes.is_empty() {
            "unspecified".to_string()
        } else {
            data.glaucoma.which_eyes.clone()
        };
        let priority = if data.glaucoma.which_eyes == "both" {
            "high"
        } else {
            "medium"
        };
        flags.push(FlaggedIssue {
            id: "V1-FLAG-GLA-001".to_string(),
            category: "Glaucoma".to_string(),
            message: format!(
                "Glaucoma reported ({which}) — visual-field assessment indicated."
            ),
            priority: priority.to_string(),
        });
    }

    // ─── Q5 — Retinitis Pigmentosa ───────────────────────────
    if data.retinitis_pigmentosa.has_condition == "yes" {
        let which = if data.retinitis_pigmentosa.which_eyes.is_empty() {
            "unspecified".to_string()
        } else {
            data.retinitis_pigmentosa.which_eyes.clone()
        };
        flags.push(FlaggedIssue {
            id: "V1-FLAG-RP-001".to_string(),
            category: "Retinitis Pigmentosa".to_string(),
            message: format!(
                "Retinitis pigmentosa reported ({which}) — progressive condition; ongoing visual-field review required."
            ),
            priority: "high".to_string(),
        });
    }

    // ─── Q7 — Blepharospasm ──────────────────────────────────
    if data.blepharospasm.has_condition == "yes" {
        if data.blepharospasm.adequately_controlled == "no" {
            flags.push(FlaggedIssue {
                id: "V1-FLAG-BLEPH-001".to_string(),
                category: "Blepharospasm".to_string(),
                message:
                    "Blepharospasm not adequately controlled — patient must not drive until controlled."
                        .to_string(),
                priority: "high".to_string(),
            });
        } else if data.blepharospasm.has_had_treatment == "no" {
            flags.push(FlaggedIssue {
                id: "V1-FLAG-BLEPH-002".to_string(),
                category: "Blepharospasm".to_string(),
                message: "Blepharospasm reported with no treatment history — review required."
                    .to_string(),
                priority: "medium".to_string(),
            });
        } else {
            flags.push(FlaggedIssue {
                id: "V1-FLAG-BLEPH-003".to_string(),
                category: "Blepharospasm".to_string(),
                message: "Blepharospasm reported as adequately controlled with treatment."
                    .to_string(),
                priority: "low".to_string(),
            });
        }
    }

    // ─── Q8 — Night Blindness ────────────────────────────────
    if data.night_blindness.has_condition == "yes" {
        let which = if data.night_blindness.which_eyes.is_empty() {
            "unspecified".to_string()
        } else {
            data.night_blindness.which_eyes.clone()
        };
        flags.push(FlaggedIssue {
            id: "V1-FLAG-NB-001".to_string(),
            category: "Night Blindness".to_string(),
            message: format!(
                "Night blindness reported ({which}) — patient should not drive in low light."
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Q9 — Double vision ──────────────────────────────────
    if data.double_vision.has_condition == "yes" {
        if data.double_vision.controlled == "no" {
            if data.double_vision.same_for_six_months_or_more == "yes" {
                flags.push(FlaggedIssue {
                    id: "V1-FLAG-DV-001".to_string(),
                    category: "Double Vision".to_string(),
                    message:
                        "Uncontrolled diplopia stable for 6+ months — eligibility hinges on adaptation declaration and DVLA review."
                            .to_string(),
                    priority: "high".to_string(),
                });
            } else {
                flags.push(FlaggedIssue {
                    id: "V1-FLAG-DV-002".to_string(),
                    category: "Double Vision".to_string(),
                    message:
                        "Uncontrolled diplopia not yet stable for 6 months — patient must not drive until controlled or stable adaptation achieved."
                            .to_string(),
                    priority: "urgent".to_string(),
                });
            }
        } else {
            flags.push(FlaggedIssue {
                id: "V1-FLAG-DV-003".to_string(),
                category: "Double Vision".to_string(),
                message: "Diplopia reported as controlled — review treatment device (patch/prism)."
                    .to_string(),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Q10 — Other vision condition ────────────────────────
    if data.other_vision_conditions.has_other == "yes" {
        flags.push(FlaggedIssue {
            id: "V1-FLAG-OTH-001".to_string(),
            category: "Other Vision Conditions".to_string(),
            message: "Additional vision condition reported — manual clinical review required."
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Q11 — No recent contact ─────────────────────────────
    if data.recent_contact.had_contact == "no" {
        flags.push(FlaggedIssue {
            id: "V1-FLAG-CONTACT-001".to_string(),
            category: "Recent Contact".to_string(),
            message:
                "No healthcare-professional contact in the last 12 months — DVLA may need to seek up-to-date medical evidence."
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
