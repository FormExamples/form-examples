use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

/// Yes/No/N/A enum stored as a string. Empty string `''` indicates an
/// unanswered field.
pub type YesNoNA = String;

/// Audit outcome: compliant / minor / major / critical.
pub type Outcome = String;

/// Severity grade 1..=4 (1 = compliant, 4 = critical).
pub type SeverityGrade = u8;

/// Flag priority: urgent / high / medium / low.
pub type FlagPriority = String;

/// Section 1 — Demographics & Site Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SiteDetails {
    pub auditor_name: String,
    pub auditor_role: String,
    pub audit_date: String,
    pub site_name: String,
    pub site_address: String,
    pub department_area: String,
    pub site_manager: String,
    pub previous_audit_date: String,
    pub previous_findings_closed: YesNoNA,
}

/// Section 2 — PPE & Hazard Controls.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PPEHazardControls {
    pub ppe_available: YesNoNA,
    pub ppe_correctly_used: YesNoNA,
    pub ppe_stock_maintained: YesNoNA,
    pub hazard_signage_visible: YesNoNA,
    pub signage_legible: YesNoNA,
    pub housekeeping_satisfactory: YesNoNA,
    pub slip_trip_hazards_controlled: YesNoNA,
    pub observations: String,
}

/// Section 3 — Chemical & Biological Hazards.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChemicalBiologicalHazards {
    pub coshh_register_present: YesNoNA,
    pub sds_available: YesNoNA,
    pub chemicals_labelled_correctly: YesNoNA,
    pub chemicals_stored_securely: YesNoNA,
    pub spill_kits_available: YesNoNA,
    pub untreated_spills_observed: YesNoNA,
    pub sharps_containers_in_date: YesNoNA,
    pub clinical_waste_segregated: YesNoNA,
    pub biological_risk_assessment_current: YesNoNA,
    pub observations: String,
}

/// Section 4 — Electrical Safety.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ElectricalSafety {
    pub pat_testing_in_date: YesNoNA,
    pub fixed_wiring_test_in_date: YesNoNA,
    pub damaged_equipment_observed: YesNoNA,
    pub overloaded_sockets_observed: YesNoNA,
    pub extension_leads_managed_safely: YesNoNA,
    pub consumer_unit_accessible: YesNoNA,
    pub observations: String,
}

/// Section 5 — Fire Safety & Emergency Egress.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FireSafety {
    pub fire_risk_assessment_current: YesNoNA,
    pub fire_extinguishers_serviced: YesNoNA,
    pub fire_extinguishers_accessible: YesNoNA,
    pub fire_alarm_tested_weekly: YesNoNA,
    pub emergency_egress_clear: YesNoNA,
    pub emergency_lighting_functional: YesNoNA,
    pub fire_doors_held_open_illegally: YesNoNA,
    pub assembly_point_signposted: YesNoNA,
    pub observations: String,
}

/// Section 6 — Ergonomics & Manual Handling.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ErgonomicsManualHandling {
    pub manual_handling_assessment_current: YesNoNA,
    pub lifting_aids_available: YesNoNA,
    pub dse_assessments_completed: YesNoNA,
    pub workstations_adjustable: YesNoNA,
    pub repetitive_strain_concerns: YesNoNA,
    pub patient_handling_plans_in_place: YesNoNA,
    pub observations: String,
}

/// Section 7 — Emergency Procedures.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmergencyProcedures {
    pub evacuation_procedure_posted: YesNoNA,
    pub first_aid_kits_stocked: YesNoNA,
    pub first_aider_roster_current: YesNoNA,
    pub aed_available: YesNoNA,
    pub aed_service_in_date: YesNoNA,
    pub emergency_contacts_displayed: YesNoNA,
    pub drill_conducted_last12_months: YesNoNA,
    pub observations: String,
}

/// Section 8 — Training & Competence.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TrainingCompetence {
    pub mandatory_training_up_to_date: YesNoNA,
    pub fire_marshals_trained: YesNoNA,
    pub manual_handling_training_current: YesNoNA,
    pub infection_control_training_current: YesNoNA,
    pub training_records_accessible: YesNoNA,
    pub induction_for_new_starters_completed: YesNoNA,
    pub observations: String,
}

/// Section 9 — Incident Reporting & Near Misses.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IncidentReporting {
    pub incident_reporting_system_used: YesNoNA,
    pub riddor_reportable_incidents_reported: YesNoNA,
    pub near_miss_reporting_active: YesNoNA,
    pub incidents_last12_months: Option<i32>,
    pub near_misses_last12_months: Option<i32>,
    pub lessons_learned_shared: YesNoNA,
    pub actions_from_incidents_tracked: YesNoNA,
    pub observations: String,
}

/// Action item under Section 10.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActionPlanItem {
    pub description: String,
    pub owner: String,
    pub due_date: String,
    pub priority: String,
}

/// Section 10 — Sign-off & Action Plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SignoffActionPlan {
    pub action_items: Vec<ActionPlanItem>,
    pub overall_summary: String,
    pub auditor_signature: String,
    pub signoff_date: String,
    pub debrief_delivered: YesNoNA,
}

/// Full Workplace Safety Assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub site_details: SiteDetails,
    pub ppe_hazard_controls: PPEHazardControls,
    pub chemical_biological_hazards: ChemicalBiologicalHazards,
    pub electrical_safety: ElectricalSafety,
    pub fire_safety: FireSafety,
    pub ergonomics_manual_handling: ErgonomicsManualHandling,
    pub emergency_procedures: EmergencyProcedures,
    pub training_competence: TrainingCompetence,
    pub incident_reporting: IncidentReporting,
    pub signoff_action_plan: SignoffActionPlan,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub grade: SeverityGrade,
}

/// Findings tally per category.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CategoryFindings {
    pub category: String,
    pub compliant: u32,
    pub minor: u32,
    pub major: u32,
    pub critical: u32,
    pub total: u32,
}

/// Auditor-facing flag.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: FlagPriority,
}

/// Grading output for a workplace safety audit.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub outcome: Outcome,
    pub findings_by_category: BTreeMap<String, CategoryFindings>,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub answered_count: u32,
    pub timestamp: String,
}
