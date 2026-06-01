// Workplace Safety Assessment — declarative scoring rules.
//
// Each rule maps a single audit checklist item to a severity grade if the
// answer indicates non-compliance. Severity grades:
//
//   1 = Compliant       (no finding raised)
//   2 = Minor           (low-risk gap; action within 90 days)
//   3 = Major           (moderate-risk gap; action within 30 days)
//   4 = Critical        (imminent risk; immediate corrective action)
//
// Each rule's `evaluate(data)` returns:
//   - 1 when the audited control is in place (yes / N/A meaning not applicable);
//   - 2-4 when a finding is raised;
//   - 0 when the auditor has not answered the item (excluded from scoring).
//
// The grader then aggregates fired rules by category and selects the highest
// severity to determine the overall outcome.

use super::types::{AssessmentData, SeverityGrade};

/// Severity for a "no" answer to a positively-phrased control question.
fn grade_no_is_bad(answer: &str, severity: SeverityGrade) -> SeverityGrade {
    if answer.is_empty() {
        return 0;
    }
    if answer == "yes" || answer == "na" {
        return 1;
    }
    severity
}

/// Severity for a "yes" answer to a negatively-phrased question
/// (presence of bad thing).
fn grade_yes_is_bad(answer: &str, severity: SeverityGrade) -> SeverityGrade {
    if answer.is_empty() {
        return 0;
    }
    if answer == "no" || answer == "na" {
        return 1;
    }
    severity
}

/// Declarative workplace-safety rule.
pub struct SafetyRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub severity: SeverityGrade,
    pub evaluate: fn(&AssessmentData) -> SeverityGrade,
}

/// All HSE workplace-safety audit rules.
pub fn all_rules() -> Vec<SafetyRule> {
    vec![
        // ─── Section 1: Demographics & Site Details ─────────────────
        SafetyRule {
            id: "WS-001",
            category: "Site Details",
            description: "Findings from previous audit have been closed out.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.site_details.previous_findings_closed, 3),
        },

        // ─── Section 2: PPE & Hazard Controls ───────────────────────
        SafetyRule {
            id: "WS-002",
            category: "PPE & Hazard Controls",
            description: "Appropriate PPE is available for the task.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.ppe_hazard_controls.ppe_available, 3),
        },
        SafetyRule {
            id: "WS-003",
            category: "PPE & Hazard Controls",
            description: "PPE is being correctly used by staff.",
            severity: 2,
            evaluate: |d| grade_no_is_bad(&d.ppe_hazard_controls.ppe_correctly_used, 2),
        },
        SafetyRule {
            id: "WS-004",
            category: "PPE & Hazard Controls",
            description: "PPE stock is maintained at adequate levels.",
            severity: 2,
            evaluate: |d| grade_no_is_bad(&d.ppe_hazard_controls.ppe_stock_maintained, 2),
        },
        SafetyRule {
            id: "WS-005",
            category: "PPE & Hazard Controls",
            description: "Hazard signage is visible where required.",
            severity: 2,
            evaluate: |d| grade_no_is_bad(&d.ppe_hazard_controls.hazard_signage_visible, 2),
        },
        SafetyRule {
            id: "WS-006",
            category: "PPE & Hazard Controls",
            description: "Signage is legible and not faded.",
            severity: 2,
            evaluate: |d| grade_no_is_bad(&d.ppe_hazard_controls.signage_legible, 2),
        },
        SafetyRule {
            id: "WS-007",
            category: "PPE & Hazard Controls",
            description: "General housekeeping is satisfactory.",
            severity: 2,
            evaluate: |d| grade_no_is_bad(&d.ppe_hazard_controls.housekeeping_satisfactory, 2),
        },
        SafetyRule {
            id: "WS-008",
            category: "PPE & Hazard Controls",
            description: "Slip, trip and fall hazards are controlled.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.ppe_hazard_controls.slip_trip_hazards_controlled, 3),
        },

        // ─── Section 3: Chemical & Biological Hazards ───────────────
        SafetyRule {
            id: "WS-009",
            category: "Chemical & Biological",
            description: "COSHH register is present and up to date.",
            severity: 4,
            evaluate: |d| grade_no_is_bad(&d.chemical_biological_hazards.coshh_register_present, 4),
        },
        SafetyRule {
            id: "WS-010",
            category: "Chemical & Biological",
            description: "Safety Data Sheets (SDS) are available for hazardous substances.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.chemical_biological_hazards.sds_available, 3),
        },
        SafetyRule {
            id: "WS-011",
            category: "Chemical & Biological",
            description: "Chemicals are labelled correctly per CLP.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.chemical_biological_hazards.chemicals_labelled_correctly, 3),
        },
        SafetyRule {
            id: "WS-012",
            category: "Chemical & Biological",
            description: "Chemicals are stored securely (locked, segregated, ventilated).",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.chemical_biological_hazards.chemicals_stored_securely, 3),
        },
        SafetyRule {
            id: "WS-013",
            category: "Chemical & Biological",
            description: "Spill kits are available, accessible and stocked.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.chemical_biological_hazards.spill_kits_available, 3),
        },
        SafetyRule {
            id: "WS-014",
            category: "Chemical & Biological",
            description: "No untreated chemical or biological spills observed.",
            severity: 4,
            evaluate: |d| grade_yes_is_bad(&d.chemical_biological_hazards.untreated_spills_observed, 4),
        },
        SafetyRule {
            id: "WS-015",
            category: "Chemical & Biological",
            description: "Sharps containers are in date and not over-filled.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.chemical_biological_hazards.sharps_containers_in_date, 3),
        },
        SafetyRule {
            id: "WS-016",
            category: "Chemical & Biological",
            description: "Clinical waste is correctly segregated.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.chemical_biological_hazards.clinical_waste_segregated, 3),
        },
        SafetyRule {
            id: "WS-017",
            category: "Chemical & Biological",
            description: "Biological agent risk assessment is current.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.chemical_biological_hazards.biological_risk_assessment_current, 3),
        },

        // ─── Section 4: Electrical Safety ───────────────────────────
        SafetyRule {
            id: "WS-018",
            category: "Electrical Safety",
            description: "Portable Appliance Testing (PAT) is in date.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.electrical_safety.pat_testing_in_date, 3),
        },
        SafetyRule {
            id: "WS-019",
            category: "Electrical Safety",
            description: "Fixed wiring electrical installation test is in date.",
            severity: 4,
            evaluate: |d| grade_no_is_bad(&d.electrical_safety.fixed_wiring_test_in_date, 4),
        },
        SafetyRule {
            id: "WS-020",
            category: "Electrical Safety",
            description: "No damaged electrical equipment observed.",
            severity: 4,
            evaluate: |d| grade_yes_is_bad(&d.electrical_safety.damaged_equipment_observed, 4),
        },
        SafetyRule {
            id: "WS-021",
            category: "Electrical Safety",
            description: "No overloaded sockets or daisy-chained extension leads.",
            severity: 3,
            evaluate: |d| grade_yes_is_bad(&d.electrical_safety.overloaded_sockets_observed, 3),
        },
        SafetyRule {
            id: "WS-022",
            category: "Electrical Safety",
            description: "Extension leads are managed safely (not trip hazards).",
            severity: 2,
            evaluate: |d| grade_no_is_bad(&d.electrical_safety.extension_leads_managed_safely, 2),
        },
        SafetyRule {
            id: "WS-023",
            category: "Electrical Safety",
            description: "Consumer unit / distribution board is accessible and labelled.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.electrical_safety.consumer_unit_accessible, 3),
        },

        // ─── Section 5: Fire Safety & Emergency Egress ──────────────
        SafetyRule {
            id: "WS-024",
            category: "Fire Safety",
            description: "Fire risk assessment is current and on file.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.fire_safety.fire_risk_assessment_current, 3),
        },
        SafetyRule {
            id: "WS-025",
            category: "Fire Safety",
            description: "Fire extinguishers have a current annual service record.",
            severity: 4,
            evaluate: |d| grade_no_is_bad(&d.fire_safety.fire_extinguishers_serviced, 4),
        },
        SafetyRule {
            id: "WS-026",
            category: "Fire Safety",
            description: "Fire extinguishers are accessible and unobstructed.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.fire_safety.fire_extinguishers_accessible, 3),
        },
        SafetyRule {
            id: "WS-027",
            category: "Fire Safety",
            description: "Fire alarm is tested weekly with records.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.fire_safety.fire_alarm_tested_weekly, 3),
        },
        SafetyRule {
            id: "WS-028",
            category: "Fire Safety",
            description: "Emergency egress routes are clear and unobstructed.",
            severity: 4,
            evaluate: |d| grade_no_is_bad(&d.fire_safety.emergency_egress_clear, 4),
        },
        SafetyRule {
            id: "WS-029",
            category: "Fire Safety",
            description: "Emergency lighting is functional.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.fire_safety.emergency_lighting_functional, 3),
        },
        SafetyRule {
            id: "WS-030",
            category: "Fire Safety",
            description: "No fire doors held open illegally (e.g. by wedges).",
            severity: 3,
            evaluate: |d| grade_yes_is_bad(&d.fire_safety.fire_doors_held_open_illegally, 3),
        },
        SafetyRule {
            id: "WS-031",
            category: "Fire Safety",
            description: "Assembly point is signposted and accessible.",
            severity: 2,
            evaluate: |d| grade_no_is_bad(&d.fire_safety.assembly_point_signposted, 2),
        },

        // ─── Section 6: Ergonomics & Manual Handling ────────────────
        SafetyRule {
            id: "WS-032",
            category: "Ergonomics & Manual Handling",
            description: "Manual handling risk assessment is current.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.ergonomics_manual_handling.manual_handling_assessment_current, 3),
        },
        SafetyRule {
            id: "WS-033",
            category: "Ergonomics & Manual Handling",
            description: "Lifting aids and hoists are available and serviced.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.ergonomics_manual_handling.lifting_aids_available, 3),
        },
        SafetyRule {
            id: "WS-034",
            category: "Ergonomics & Manual Handling",
            description: "DSE (Display Screen Equipment) assessments completed for staff.",
            severity: 2,
            evaluate: |d| grade_no_is_bad(&d.ergonomics_manual_handling.dse_assessments_completed, 2),
        },
        SafetyRule {
            id: "WS-035",
            category: "Ergonomics & Manual Handling",
            description: "Workstations are appropriately adjustable.",
            severity: 2,
            evaluate: |d| grade_no_is_bad(&d.ergonomics_manual_handling.workstations_adjustable, 2),
        },
        SafetyRule {
            id: "WS-036",
            category: "Ergonomics & Manual Handling",
            description: "No repetitive strain or postural concerns reported.",
            severity: 2,
            evaluate: |d| grade_yes_is_bad(&d.ergonomics_manual_handling.repetitive_strain_concerns, 2),
        },
        SafetyRule {
            id: "WS-037",
            category: "Ergonomics & Manual Handling",
            description: "Patient handling plans are in place where applicable.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.ergonomics_manual_handling.patient_handling_plans_in_place, 3),
        },

        // ─── Section 7: Emergency Procedures ────────────────────────
        SafetyRule {
            id: "WS-038",
            category: "Emergency Procedures",
            description: "Evacuation procedure is posted prominently.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.emergency_procedures.evacuation_procedure_posted, 3),
        },
        SafetyRule {
            id: "WS-039",
            category: "Emergency Procedures",
            description: "First-aid kits are stocked and in date.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.emergency_procedures.first_aid_kits_stocked, 3),
        },
        SafetyRule {
            id: "WS-040",
            category: "Emergency Procedures",
            description: "First-aider roster is current.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.emergency_procedures.first_aider_roster_current, 3),
        },
        SafetyRule {
            id: "WS-041",
            category: "Emergency Procedures",
            description: "AED (defibrillator) available where required.",
            severity: 2,
            evaluate: |d| grade_no_is_bad(&d.emergency_procedures.aed_available, 2),
        },
        SafetyRule {
            id: "WS-042",
            category: "Emergency Procedures",
            description: "AED service / battery / pad checks are in date.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.emergency_procedures.aed_service_in_date, 3),
        },
        SafetyRule {
            id: "WS-043",
            category: "Emergency Procedures",
            description: "Emergency contact numbers are displayed.",
            severity: 2,
            evaluate: |d| grade_no_is_bad(&d.emergency_procedures.emergency_contacts_displayed, 2),
        },
        SafetyRule {
            id: "WS-044",
            category: "Emergency Procedures",
            description: "A drill or live exercise has been conducted in the last 12 months.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.emergency_procedures.drill_conducted_last12_months, 3),
        },

        // ─── Section 8: Training & Competence ───────────────────────
        SafetyRule {
            id: "WS-045",
            category: "Training & Competence",
            description: "Mandatory training is up to date for all staff.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.training_competence.mandatory_training_up_to_date, 3),
        },
        SafetyRule {
            id: "WS-046",
            category: "Training & Competence",
            description: "Trained fire marshals are appointed and on rota.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.training_competence.fire_marshals_trained, 3),
        },
        SafetyRule {
            id: "WS-047",
            category: "Training & Competence",
            description: "Manual handling training is current for relevant staff.",
            severity: 2,
            evaluate: |d| grade_no_is_bad(&d.training_competence.manual_handling_training_current, 2),
        },
        SafetyRule {
            id: "WS-048",
            category: "Training & Competence",
            description: "Infection control training is current.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.training_competence.infection_control_training_current, 3),
        },
        SafetyRule {
            id: "WS-049",
            category: "Training & Competence",
            description: "Training records are accessible for audit.",
            severity: 2,
            evaluate: |d| grade_no_is_bad(&d.training_competence.training_records_accessible, 2),
        },
        SafetyRule {
            id: "WS-050",
            category: "Training & Competence",
            description: "Induction is completed for new starters.",
            severity: 2,
            evaluate: |d| grade_no_is_bad(&d.training_competence.induction_for_new_starters_completed, 2),
        },

        // ─── Section 9: Incident Reporting & Near Misses ────────────
        SafetyRule {
            id: "WS-051",
            category: "Incident Reporting",
            description: "Incident reporting system is in active use.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.incident_reporting.incident_reporting_system_used, 3),
        },
        SafetyRule {
            id: "WS-052",
            category: "Incident Reporting",
            description: "RIDDOR-reportable incidents have been reported to HSE.",
            severity: 4,
            evaluate: |d| grade_no_is_bad(&d.incident_reporting.riddor_reportable_incidents_reported, 4),
        },
        SafetyRule {
            id: "WS-053",
            category: "Incident Reporting",
            description: "Near-miss reporting culture is active.",
            severity: 2,
            evaluate: |d| grade_no_is_bad(&d.incident_reporting.near_miss_reporting_active, 2),
        },
        SafetyRule {
            id: "WS-054",
            category: "Incident Reporting",
            description: "Lessons learned are shared across the team.",
            severity: 2,
            evaluate: |d| grade_no_is_bad(&d.incident_reporting.lessons_learned_shared, 2),
        },
        SafetyRule {
            id: "WS-055",
            category: "Incident Reporting",
            description: "Actions arising from incidents are tracked to completion.",
            severity: 3,
            evaluate: |d| grade_no_is_bad(&d.incident_reporting.actions_from_incidents_tracked, 3),
        },

        // ─── Section 10: Sign-off & Action Plan ─────────────────────
        SafetyRule {
            id: "WS-056",
            category: "Sign-off",
            description: "Findings have been debriefed with the site manager.",
            severity: 2,
            evaluate: |d| grade_no_is_bad(&d.signoff_action_plan.debrief_delivered, 2),
        },
    ]
}
