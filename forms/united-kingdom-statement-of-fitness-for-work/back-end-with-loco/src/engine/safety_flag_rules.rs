//! Safety-critical flags fired independently of the fitness category.
//! Mirrors `front-end-form-with-html/js/grader.js` 1:1.

use regex::Regex;

use crate::engine::types::{AssessmentData, FiredRule, SafetyFlag};

fn auto_disability_regex() -> Regex {
    Regex::new(r"(?i)\b(hiv|human immunodeficiency virus|cancer|carcinoma|malignan|neoplasm|multiple sclerosis|\bms\b)\b").unwrap()
}

fn driving_regex() -> Regex {
    Regex::new(r"(?i)\b(should not drive|must not drive|do not drive|no driving)\b").unwrap()
}

/// Evaluate.
pub fn evaluate(fit_note: &AssessmentData, fired: &mut Vec<FiredRule>, flags: &mut Vec<SafetyFlag>) {
    let auto = auto_disability_regex();
    let driving = driving_regex();

    // Automatic disability (HIV / cancer / MS) — Equality Act 2010 s.6.
    let diagnosis_matches = !fit_note.diagnosis_text.is_empty()
        && auto.is_match(&fit_note.diagnosis_text);
    if fit_note.is_automatic_disability == "yes" || diagnosis_matches {
        fired.push(FiredRule {
            rule_id: "R-SAFE-DISABILITY-001".into(),
            rule_set: "safety".into(),
            severity: "medium".into(),
            description: "Diagnosis matches automatic disability (Equality Act 2010 s.6).".into(),
        });
        flags.push(SafetyFlag {
            flag_id: "F-AUTO-DISABILITY".into(),
            category: "automatic_disability".into(),
            priority: "medium".into(),
            description:
                "Condition is automatically classed as a disability (HIV / cancer / MS).".into(),
            suggested_action:
                "Signpost to Access to Work, the Health Adjustment Passport, and condition-specific charities."
                    .into(),
        });
    }

    // Mental-health diagnosis.
    if fit_note.diagnosis_category == "mental_health" {
        fired.push(FiredRule {
            rule_id: "R-SAFE-MH-001".into(),
            rule_set: "safety".into(),
            severity: "medium".into(),
            description: "Mental-health diagnosis selected.".into(),
        });
        flags.push(SafetyFlag {
            flag_id: "F-MENTAL-HEALTH".into(),
            category: "mental_health_condition".into(),
            priority: "medium".into(),
            description:
                "Mental-health diagnosis — additional support pathways available.".into(),
            suggested_action:
                "Signpost to NHS Talking Therapies, MIND, or workplace mental-health resources."
                    .into(),
        });
    }

    // Driving restriction in comments.
    if !fit_note.comments.is_empty() && driving.is_match(&fit_note.comments) {
        fired.push(FiredRule {
            rule_id: "R-SAFE-DRIVE-001".into(),
            rule_set: "safety".into(),
            severity: "medium".into(),
            description: "Comments include a driving restriction.".into(),
        });
        flags.push(SafetyFlag {
            flag_id: "F-DRIVING".into(),
            category: "driving_restriction_recommended".into(),
            priority: "medium".into(),
            description: "Driving restriction recommended in comments.".into(),
            suggested_action: "Confirm DVLA notification obligations with the patient.".into(),
        });
    }

    // Safeguarding concern.
    if fit_note.safeguarding_concern == "yes" {
        fired.push(FiredRule {
            rule_id: "R-SAFE-SAFEGUARDING-001".into(),
            rule_set: "safety".into(),
            severity: "high".into(),
            description: "Safeguarding concern flagged.".into(),
        });
        flags.push(SafetyFlag {
            flag_id: "F-SAFEGUARDING".into(),
            category: "safeguarding_concern".into(),
            priority: "high".into(),
            description: "Safeguarding concern raised by the clinician.".into(),
            suggested_action:
                "Follow local safeguarding policy; do not print details on the fit note.".into(),
        });
    }

    // Private practice — non-NHS issuer.
    if fit_note.clinician.is_private_practice == "yes" {
        fired.push(FiredRule {
            rule_id: "R-SAFE-PRIVATE-001".into(),
            rule_set: "safety".into(),
            severity: "low".into(),
            description: "Issuer is in private practice (non-NHS).".into(),
        });
        flags.push(SafetyFlag {
            flag_id: "F-PRIVATE".into(),
            category: "private_practice".into(),
            priority: "low".into(),
            description:
                "Fit note issued in private practice; acceptance is at employer discretion (DWP policy 3.4)."
                    .into(),
            suggested_action:
                "Inform the patient that the employer may request additional evidence.".into(),
        });
    }

    // Secondary-care discharge.
    if fit_note.issue_setting == "secondary_care_discharge" {
        fired.push(FiredRule {
            rule_id: "R-SAFE-DISCHARGE-001".into(),
            rule_set: "safety".into(),
            severity: "medium".into(),
            description: "Fit note issued on hospital discharge (DWP policy 3.5).".into(),
        });
        flags.push(SafetyFlag {
            flag_id: "F-DISCHARGE".into(),
            category: "secondary_care_discharge".into(),
            priority: "medium".into(),
            description:
                "Issued on hospital discharge; ensure GP is informed.".into(),
            suggested_action: "Send a copy of the fit note to the patient's GP.".into(),
        });
    }

    // 2022-authorised profession (non-doctor).
    let new_auth = matches!(
        fit_note.clinician.profession.as_str(),
        "nurse" | "occupational_therapist" | "pharmacist" | "physiotherapist"
    );
    if new_auth {
        fired.push(FiredRule {
            rule_id: "R-SAFE-NEW-AUTH-001".into(),
            rule_set: "safety".into(),
            severity: "low".into(),
            description: "2022-authorised issuer profession.".into(),
        });
        flags.push(SafetyFlag {
            flag_id: "F-NEW-AUTH".into(),
            category: "new_authority_hcp".into(),
            priority: "low".into(),
            description: format!(
                "Issued by a 2022-authorised profession ({}).",
                fit_note.clinician.profession
            ),
            suggested_action: "No action required — informational.".into(),
        });
    }

    // Will-assess-again — informational.
    if fit_note.will_assess_again == "yes" {
        fired.push(FiredRule {
            rule_id: "R-SAFE-REVIEW-001".into(),
            rule_set: "safety".into(),
            severity: "low".into(),
            description: "Review at end of period requested.".into(),
        });
        let review_date = if fit_note.planned_review_date.is_empty() {
            "the end of the period".to_string()
        } else {
            fit_note.planned_review_date.clone()
        };
        flags.push(SafetyFlag {
            flag_id: "F-REVIEW".into(),
            category: "ongoing_review_required".into(),
            priority: "low".into(),
            description: "Clinician will reassess at end of period.".into(),
            suggested_action: format!("Book a follow-up review around {review_date}."),
        });
    }
}
