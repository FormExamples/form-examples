//! Checklist rules module.

use super::types::AssessmentData;

/// A declarative checklist rule. Each rule fires when its corresponding
/// item is unanswered (or fails the WHO completion requirement).
pub struct ChecklistRule {
    /// ID.
    pub id: &'static str,
    /// Phase.
    pub phase: &'static str,
    /// Category.
    pub category: &'static str,
    /// Description.
    pub description: &'static str,
    /// Severity.
    pub severity: &'static str,
    /// Evaluate.
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// All WHO Surgical Safety Checklist rules. A rule fires when the item is
/// **unanswered** — i.e. the operating-team has not yet confirmed it.
///
/// Severity:
/// - `critical` — Sign In items 1, 3, 4 (identity, anaesthesia, oximeter)
///   and Sign Out item 2 (counts). Skipping these is a safety-critical
///   omission per the WHO standard.
/// - `required` — every other checklist item.
pub fn all_rules() -> Vec<ChecklistRule> {
    vec![
        // ───────── Phase 1 — Sign In ─────────
        ChecklistRule {
            id: "SI-01",
            phase: "Sign In",
            category: "Identity",
            description: "Patient has confirmed identity, site, procedure, and consent",
            severity: "critical",
            evaluate: |d| d.sign_in.identity_site_procedure_consent != "yes",
        },
        ChecklistRule {
            id: "SI-02",
            phase: "Sign In",
            category: "Site Marking",
            description: "Surgical site is marked (or marked as not-applicable)",
            severity: "required",
            evaluate: |d| {
                let v = &d.sign_in.site_marked;
                v != "yes" && v != "not-applicable"
            },
        },
        ChecklistRule {
            id: "SI-03",
            phase: "Sign In",
            category: "Anaesthesia",
            description: "Anaesthesia machine and medication check complete",
            severity: "critical",
            evaluate: |d| d.sign_in.anaesthesia_check_complete != "yes",
        },
        ChecklistRule {
            id: "SI-04",
            phase: "Sign In",
            category: "Monitoring",
            description: "Pulse oximeter on patient and functioning",
            severity: "critical",
            evaluate: |d| d.sign_in.pulse_oximeter_on_patient != "yes",
        },
        ChecklistRule {
            id: "SI-05",
            phase: "Sign In",
            category: "Allergy",
            description: "Known allergy status confirmed",
            severity: "required",
            evaluate: |d| {
                let v = &d.sign_in.known_allergy;
                v != "yes" && v != "no"
            },
        },
        ChecklistRule {
            id: "SI-05b",
            phase: "Sign In",
            category: "Allergy",
            description: "Allergy details recorded when allergy = yes",
            severity: "required",
            evaluate: |d| {
                d.sign_in.known_allergy == "yes"
                    && d.sign_in.known_allergy_detail.trim().is_empty()
            },
        },
        ChecklistRule {
            id: "SI-06",
            phase: "Sign In",
            category: "Airway",
            description: "Difficult airway or aspiration risk assessed",
            severity: "required",
            evaluate: |d| {
                let v = &d.sign_in.difficult_airway_aspiration_risk;
                v != "no" && v != "yes-equipment-available"
            },
        },
        ChecklistRule {
            id: "SI-07",
            phase: "Sign In",
            category: "Blood Loss",
            description: "Risk of >500 ml (7 ml/kg in children) blood loss assessed",
            severity: "required",
            evaluate: |d| {
                let v = &d.sign_in.blood_loss_risk;
                v != "no" && v != "yes-two-ivs-and-fluids-planned"
            },
        },
        ChecklistRule {
            id: "SI-SO",
            phase: "Sign In",
            category: "Sign-Off",
            description: "Sign In phase signed off by a coordinator",
            severity: "required",
            evaluate: |d| {
                d.sign_in.coordinator_name.trim().is_empty()
                    || d.sign_in.completed_at.trim().is_empty()
            },
        },
        // ───────── Phase 2 — Time Out ─────────
        ChecklistRule {
            id: "TO-01",
            phase: "Time Out",
            category: "Team",
            description: "All team members introduced themselves by name and role",
            severity: "required",
            evaluate: |d| d.time_out.team_introductions_confirmed != "yes",
        },
        ChecklistRule {
            id: "TO-02",
            phase: "Time Out",
            category: "Identity",
            description: "Patient name, procedure, and incision site confirmed aloud",
            severity: "critical",
            evaluate: |d| d.time_out.patient_procedure_incision_confirmed != "yes",
        },
        ChecklistRule {
            id: "TO-03",
            phase: "Time Out",
            category: "Antibiotic Prophylaxis",
            description: "Antibiotic prophylaxis given within the last 60 minutes (or not-applicable)",
            severity: "critical",
            evaluate: |d| {
                let v = &d.time_out.antibiotic_prophylaxis_within_60min;
                v != "yes" && v != "not-applicable"
            },
        },
        ChecklistRule {
            id: "TO-08",
            phase: "Time Out",
            category: "Sterility",
            description: "Nursing team confirms sterility (including indicator results)",
            severity: "critical",
            evaluate: |d| d.time_out.nursing_sterility_confirmed != "yes",
        },
        ChecklistRule {
            id: "TO-10",
            phase: "Time Out",
            category: "Imaging",
            description: "Essential imaging displayed (or not-applicable)",
            severity: "required",
            evaluate: |d| {
                let v = &d.time_out.essential_imaging_displayed;
                v != "yes" && v != "not-applicable"
            },
        },
        ChecklistRule {
            id: "TO-SO",
            phase: "Time Out",
            category: "Sign-Off",
            description: "Time Out phase signed off by a coordinator",
            severity: "required",
            evaluate: |d| {
                d.time_out.coordinator_name.trim().is_empty()
                    || d.time_out.completed_at.trim().is_empty()
            },
        },
        // ───────── Phase 3 — Sign Out ─────────
        ChecklistRule {
            id: "SO-01",
            phase: "Sign Out",
            category: "Procedure",
            description: "Nurse verbally confirms name of the procedure recorded",
            severity: "required",
            evaluate: |d| d.sign_out.procedure_name_confirmed != "yes",
        },
        ChecklistRule {
            id: "SO-02",
            phase: "Sign Out",
            category: "Counts",
            description: "Instrument, sponge, and needle counts confirmed (yes/no)",
            severity: "critical",
            evaluate: |d| {
                let v = &d.sign_out.counts_confirmed;
                v != "yes" && v != "no"
            },
        },
        ChecklistRule {
            id: "SO-03",
            phase: "Sign Out",
            category: "Specimens",
            description: "Specimen labelling read aloud (or not-applicable)",
            severity: "critical",
            evaluate: |d| {
                let v = &d.sign_out.specimens_labelled;
                v != "yes" && v != "not-applicable"
            },
        },
        ChecklistRule {
            id: "SO-SO",
            phase: "Sign Out",
            category: "Sign-Off",
            description: "Sign Out phase signed off by a coordinator",
            severity: "required",
            evaluate: |d| {
                d.sign_out.coordinator_name.trim().is_empty()
                    || d.sign_out.completed_at.trim().is_empty()
            },
        },
    ]
}
