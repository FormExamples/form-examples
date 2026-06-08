//! Validation rules module.

use super::types::AssessmentData;

/// A declarative IPS section-population rule. Fires per rule on every
/// grading run with `ok` if the section is populated, `empty` otherwise.
pub struct IPSRule {
    /// ID.
    pub id: &'static str,
    /// Category.
    pub category: &'static str,
    /// Description.
    pub description: &'static str,
    /// Mandatory.
    pub mandatory: bool,
    /// Evaluate.
    pub evaluate: fn(&AssessmentData) -> &'static str,
}

/// Patient demographics is "populated" only when name, DOB, and sex are present.
pub fn demographics_populated(d: &AssessmentData) -> bool {
    let p = &d.patient_demographics;
    let has_name = !p.given_name.trim().is_empty() && !p.family_name.trim().is_empty();
    has_name && !p.date_of_birth.trim().is_empty() && !p.sex.trim().is_empty()
}

/// Problem list: at least one row with a non-empty description.
pub fn problem_list_populated(d: &AssessmentData) -> bool {
    d.problem_list.iter().any(|p| !p.description.trim().is_empty())
}

/// Medications: at least one row with a non-empty name.
pub fn medications_populated(d: &AssessmentData) -> bool {
    d.medication_summary.iter().any(|m| !m.name.trim().is_empty())
}

/// Allergies: at least one row with a non-empty substance.
pub fn allergies_populated(d: &AssessmentData) -> bool {
    d.allergies_intolerances.iter().any(|a| !a.substance.trim().is_empty())
}

/// Immunisations: at least one row with a non-empty vaccine.
pub fn immunisations_populated(d: &AssessmentData) -> bool {
    d.immunisations.iter().any(|i| !i.vaccine.trim().is_empty())
}

/// Procedures: at least one row with a non-empty description.
pub fn procedures_populated(d: &AssessmentData) -> bool {
    d.procedures.iter().any(|p| !p.description.trim().is_empty())
}

/// Results & investigations: at least one row with a test name.
pub fn results_populated(d: &AssessmentData) -> bool {
    d.results_investigations.iter().any(|r| !r.test_name.trim().is_empty())
}

/// Medical devices (optional): at least one row with a description.
pub fn devices_populated(d: &AssessmentData) -> bool {
    d.medical_devices.iter().any(|dv| !dv.description.trim().is_empty())
}

/// Advance directives (optional): any of the three yes/no answered, or notes present.
pub fn advance_directives_populated(d: &AssessmentData) -> bool {
    let a = &d.advance_directives;
    !a.dnr_in_place.is_empty()
        || !a.living_will_in_place.is_empty()
        || !a.consent_to_share_eu.is_empty()
        || !a.directive_notes.trim().is_empty()
}

/// Authoring clinician: name, role, organisation, and signoff status set.
pub fn authoring_clinician_populated(d: &AssessmentData) -> bool {
    let c = &d.authoring_clinician;
    !c.clinician_name.trim().is_empty()
        && !c.clinician_role.trim().is_empty()
        && !c.organisation.trim().is_empty()
        && !c.authoring_status.trim().is_empty()
}

fn ok_empty(b: bool) -> &'static str {
    if b { "ok" } else { "empty" }
}

/// All IPS section-population rules. IDs are preserved verbatim from the
/// front-end JS engine (`IPS-001` .. `IPS-010`).
pub fn all_rules() -> Vec<IPSRule> {
    vec![
        IPSRule {
            id: "IPS-001",
            category: "Patient Demographics",
            description: "Identifying patient details (name, DOB, sex) populated.",
            mandatory: true,
            evaluate: |d| ok_empty(demographics_populated(d)),
        },
        IPSRule {
            id: "IPS-002",
            category: "Problem List",
            description: "At least one problem (active or past) recorded.",
            mandatory: true,
            evaluate: |d| ok_empty(problem_list_populated(d)),
        },
        IPSRule {
            id: "IPS-003",
            category: "Medication Summary",
            description: "At least one current or recent medication recorded.",
            mandatory: true,
            evaluate: |d| ok_empty(medications_populated(d)),
        },
        IPSRule {
            id: "IPS-004",
            category: "Allergies & Intolerances",
            description: "Allergies recorded, including \"no known allergies\" marker if applicable.",
            mandatory: true,
            evaluate: |d| ok_empty(allergies_populated(d)),
        },
        IPSRule {
            id: "IPS-005",
            category: "Immunisations",
            description: "At least one immunisation recorded.",
            mandatory: true,
            evaluate: |d| ok_empty(immunisations_populated(d)),
        },
        IPSRule {
            id: "IPS-006",
            category: "Procedures",
            description: "At least one procedure recorded.",
            mandatory: true,
            evaluate: |d| ok_empty(procedures_populated(d)),
        },
        IPSRule {
            id: "IPS-007",
            category: "Results & Investigations",
            description: "At least one diagnostic result or investigation recorded.",
            mandatory: true,
            evaluate: |d| ok_empty(results_populated(d)),
        },
        IPSRule {
            id: "IPS-008",
            category: "Authoring Clinician",
            description: "Authoring clinician identified and signoff status set.",
            mandatory: true,
            evaluate: |d| ok_empty(authoring_clinician_populated(d)),
        },
        IPSRule {
            id: "IPS-009",
            category: "Medical Devices / Implants",
            description: "Medical devices recorded (optional).",
            mandatory: false,
            evaluate: |d| ok_empty(devices_populated(d)),
        },
        IPSRule {
            id: "IPS-010",
            category: "Advance Directives & Consent",
            description: "Advance directives or cross-border consent recorded (optional).",
            mandatory: false,
            evaluate: |d| ok_empty(advance_directives_populated(d)),
        },
    ]
}
