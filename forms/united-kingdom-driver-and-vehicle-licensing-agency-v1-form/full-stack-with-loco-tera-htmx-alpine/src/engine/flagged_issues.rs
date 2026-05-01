//! Detects clinically concerning patterns in the DVLA V1 self-declaration
//! that warrant DVLA medical-adviser review. The V1 form is primarily a data
//! collection instrument; these flags do not determine fitness to drive but
//! highlight combinations the reviewer should examine.
//!
//! Priority ladder:
//!   urgent — patient asserts they do not meet the eyesight standard, or
//!            uncontrolled diplopia not yet 6 months stable
//!   high   — uncontrolled vision condition likely to bar driving until
//!            resolved
//!   medium — condition present that requires individual review
//!   low    — supportive context flag

use crate::engine::types::{AssessmentData, FlagPriority, FlaggedIssue};

pub fn detect_flagged_issues(data: &AssessmentData) -> Vec<FlaggedIssue> {
    let mut flags: Vec<FlaggedIssue> = Vec::new();

    // ─── Q1 — Eyesight standard failure (urgent) ──────────────
    if data.eyesight_standards.meets_standard == "no" {
        flags.push(FlaggedIssue {
            id: "V1-FLAG-EYE-001".into(),
            category: "Eyesight Standard".into(),
            message:
                "Patient declares they do not meet the Snellen 6/12 eyesight standard for driving."
                    .into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── Q2 — Monocular vision ────────────────────────────────
    if data.vision_in_both_eyes.has_vision_in_both_eyes == "no" {
        match data.vision_in_both_eyes.adaptation.as_str() {
            "not-adapted" => flags.push(FlaggedIssue {
                id: "V1-FLAG-MONO-001".into(),
                category: "Monocular Vision".into(),
                message:
                    "Monocular vision without adaptation period - patient must not drive until adapted (typically 3+ months)."
                        .into(),
                priority: FlagPriority::High,
            }),
            "adapted-self" => flags.push(FlaggedIssue {
                id: "V1-FLAG-MONO-002".into(),
                category: "Monocular Vision".into(),
                message:
                    "Monocular vision adaptation has not been reviewed by a healthcare professional."
                        .into(),
                priority: FlagPriority::Medium,
            }),
            "adapted-advised" => flags.push(FlaggedIssue {
                id: "V1-FLAG-MONO-003".into(),
                category: "Monocular Vision".into(),
                message:
                    "Monocular vision with confirmed healthcare-professional-supervised adaptation."
                        .into(),
                priority: FlagPriority::Low,
            }),
            _ => {}
        }
    }

    // ─── Q3 — Visual field problem ────────────────────────────
    if data.field_of_vision.has_problem == "yes" {
        if data.field_of_vision.caused_solely_by_eye_condition == "no" {
            let cause = if data.field_of_vision.cause.is_empty() {
                "unspecified"
            } else {
                data.field_of_vision.cause.as_str()
            };
            flags.push(FlaggedIssue {
                id: "V1-FLAG-VF-001".into(),
                category: "Visual Field".into(),
                message: format!(
                    "Visual-field defect with non-ocular cause ({cause}) - DVLA visual-field testing recommended."
                ),
                priority: FlagPriority::High,
            });
        } else {
            flags.push(FlaggedIssue {
                id: "V1-FLAG-VF-002".into(),
                category: "Visual Field".into(),
                message:
                    "Visual-field defect of ocular origin - DVLA visual-field testing recommended."
                        .into(),
                priority: FlagPriority::Medium,
            });
        }
    }

    // ─── Q4 — Glaucoma ────────────────────────────────────────
    if data.glaucoma.has_condition == "yes" {
        let eyes = if data.glaucoma.which_eyes.is_empty() {
            "unspecified"
        } else {
            data.glaucoma.which_eyes.as_str()
        };
        flags.push(FlaggedIssue {
            id: "V1-FLAG-GLA-001".into(),
            category: "Glaucoma".into(),
            message: format!(
                "Glaucoma reported ({eyes}) - visual-field assessment indicated."
            ),
            priority: if data.glaucoma.which_eyes == "both" {
                FlagPriority::High
            } else {
                FlagPriority::Medium
            },
        });
    }

    // ─── Q5 — Retinitis Pigmentosa ────────────────────────────
    if data.retinitis_pigmentosa.has_condition == "yes" {
        let eyes = if data.retinitis_pigmentosa.which_eyes.is_empty() {
            "unspecified"
        } else {
            data.retinitis_pigmentosa.which_eyes.as_str()
        };
        flags.push(FlaggedIssue {
            id: "V1-FLAG-RP-001".into(),
            category: "Retinitis Pigmentosa".into(),
            message: format!(
                "Retinitis pigmentosa reported ({eyes}) - progressive condition; ongoing visual-field review required."
            ),
            priority: FlagPriority::High,
        });
    }

    // ─── Q7 — Blepharospasm ───────────────────────────────────
    if data.blepharospasm.has_condition == "yes" {
        if data.blepharospasm.adequately_controlled == "no" {
            flags.push(FlaggedIssue {
                id: "V1-FLAG-BLEPH-001".into(),
                category: "Blepharospasm".into(),
                message:
                    "Blepharospasm not adequately controlled - patient must not drive until controlled."
                        .into(),
                priority: FlagPriority::High,
            });
        } else if data.blepharospasm.has_had_treatment == "no" {
            flags.push(FlaggedIssue {
                id: "V1-FLAG-BLEPH-002".into(),
                category: "Blepharospasm".into(),
                message:
                    "Blepharospasm reported with no treatment history - review required.".into(),
                priority: FlagPriority::Medium,
            });
        } else {
            flags.push(FlaggedIssue {
                id: "V1-FLAG-BLEPH-003".into(),
                category: "Blepharospasm".into(),
                message:
                    "Blepharospasm reported as adequately controlled with treatment.".into(),
                priority: FlagPriority::Low,
            });
        }
    }

    // ─── Q8 — Night Blindness ─────────────────────────────────
    if data.night_blindness.has_condition == "yes" {
        let eyes = if data.night_blindness.which_eyes.is_empty() {
            "unspecified"
        } else {
            data.night_blindness.which_eyes.as_str()
        };
        flags.push(FlaggedIssue {
            id: "V1-FLAG-NB-001".into(),
            category: "Night Blindness".into(),
            message: format!(
                "Night blindness reported ({eyes}) - patient should not drive in low light."
            ),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Q9 — Double Vision ───────────────────────────────────
    if data.double_vision.has_condition == "yes" {
        if data.double_vision.controlled == "no" {
            if data.double_vision.same_for_six_months_or_more == "yes" {
                flags.push(FlaggedIssue {
                    id: "V1-FLAG-DV-001".into(),
                    category: "Double Vision".into(),
                    message:
                        "Uncontrolled diplopia stable for 6+ months - eligibility hinges on adaptation declaration and DVLA review."
                            .into(),
                    priority: FlagPriority::High,
                });
            } else {
                flags.push(FlaggedIssue {
                    id: "V1-FLAG-DV-002".into(),
                    category: "Double Vision".into(),
                    message:
                        "Uncontrolled diplopia not yet stable for 6 months - patient must not drive until controlled or stable adaptation achieved."
                            .into(),
                    priority: FlagPriority::Urgent,
                });
            }
        } else {
            flags.push(FlaggedIssue {
                id: "V1-FLAG-DV-003".into(),
                category: "Double Vision".into(),
                message:
                    "Diplopia reported as controlled - review treatment device (patch/prism)."
                        .into(),
                priority: FlagPriority::Medium,
            });
        }
    }

    // ─── Q10 — Other Vision Condition ─────────────────────────
    if data.other_vision_conditions.has_other == "yes" {
        flags.push(FlaggedIssue {
            id: "V1-FLAG-OTH-001".into(),
            category: "Other Vision Conditions".into(),
            message: "Additional vision condition reported - manual clinical review required."
                .into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Q11 — No recent contact ──────────────────────────────
    if data.recent_contact.had_contact == "no" {
        flags.push(FlaggedIssue {
            id: "V1-FLAG-CONTACT-001".into(),
            category: "Recent Contact".into(),
            message:
                "No healthcare-professional contact in the last 12 months - DVLA may need to seek up-to-date medical evidence."
                    .into(),
            priority: FlagPriority::Low,
        });
    }

    fn order(p: FlagPriority) -> u8 {
        match p {
            FlagPriority::Urgent => 0,
            FlagPriority::High => 1,
            FlagPriority::Medium => 2,
            FlagPriority::Low => 3,
        }
    }
    flags.sort_by_key(|f| order(f.priority));
    flags
}
