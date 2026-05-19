//! DWP policy 3.6 / 3.7 validity rules. A fit note without the issuer's
//! name, profession, or practice address is invalid; a fit note for a
//! non-medical problem cannot be issued.

use crate::grading::types::{FiredRule, FitNote, SafetyFlag};

pub fn evaluate(fit_note: &FitNote, fired: &mut Vec<FiredRule>, flags: &mut Vec<SafetyFlag>) {
    if fit_note.clinician.name.is_empty() {
        fired.push(FiredRule {
            rule_id: "R-VALID-NAME-001".into(),
            rule_set: "validity".into(),
            severity: "high".into(),
            description: "Issuer name missing (DWP policy 3.7).".into(),
        });
        flags.push(SafetyFlag {
            flag_id: "F-VALID-NAME".into(),
            category: "invalid_no_name".into(),
            priority: "high".into(),
            description: "Fit note is invalid: no issuer name.".into(),
            suggested_action: "Issue a corrected fit note with the clinician name printed.".into(),
        });
    }
    if fit_note.clinician.profession.is_empty() {
        fired.push(FiredRule {
            rule_id: "R-VALID-PROFESSION-001".into(),
            rule_set: "validity".into(),
            severity: "high".into(),
            description: "Issuer profession missing (DWP policy 3.7).".into(),
        });
        flags.push(SafetyFlag {
            flag_id: "F-VALID-PROFESSION".into(),
            category: "invalid_no_profession".into(),
            priority: "high".into(),
            description: "Fit note is invalid: no issuer profession.".into(),
            suggested_action:
                "Re-issue with the profession (doctor / nurse / OT / pharmacist / physio).".into(),
        });
    }
    if fit_note.medical_practice.postal_address_as_full_text.is_empty() {
        fired.push(FiredRule {
            rule_id: "R-VALID-PRACTICE-001".into(),
            rule_set: "validity".into(),
            severity: "high".into(),
            description: "Practice address missing (DWP policy 3.7).".into(),
        });
        flags.push(SafetyFlag {
            flag_id: "F-VALID-PRACTICE".into(),
            category: "invalid_no_practice_address".into(),
            priority: "high".into(),
            description: "Fit note is invalid: no practice address.".into(),
            suggested_action: "Re-issue with the practice address printed.".into(),
        });
    }
    if fit_note.is_non_medical == "yes" {
        fired.push(FiredRule {
            rule_id: "R-VALID-REASON-001".into(),
            rule_set: "validity".into(),
            severity: "medium".into(),
            description:
                "Reason appears non-medical; fit notes cannot be issued for non-medical problems (DWP policy 3.6)."
                    .into(),
        });
        flags.push(SafetyFlag {
            flag_id: "F-NON-MEDICAL".into(),
            category: "non_medical_reason_detected".into(),
            priority: "medium".into(),
            description: "Reason for the fit note appears to be non-medical.".into(),
            suggested_action:
                "Discuss alternative support (ACAS, careers advice, debt advice).".into(),
        });
    }
}

/// True if no high-severity validity rule has fired.
pub fn is_valid(fired: &[FiredRule]) -> bool {
    !fired
        .iter()
        .any(|r| r.rule_set == "validity" && r.severity == "high")
}
