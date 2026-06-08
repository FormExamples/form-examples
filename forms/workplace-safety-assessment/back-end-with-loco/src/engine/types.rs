//! Serde data types for the assessment payload and grading result.

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
    /// Auditor name.
    pub auditor_name: String,
    /// Auditor role.
    pub auditor_role: String,
    /// Audit date.
    pub audit_date: String,
    /// Site name.
    pub site_name: String,
    /// Site address.
    pub site_address: String,
    /// Department area.
    pub department_area: String,
    /// Site manager.
    pub site_manager: String,
    /// Previous audit date.
    pub previous_audit_date: String,
    /// Previous findings closed.
    pub previous_findings_closed: YesNoNA,
}

/// Section 2 — PPE & Hazard Controls.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PPEHazardControls {
    /// Ppe available.
    pub ppe_available: YesNoNA,
    /// Ppe correctly used.
    pub ppe_correctly_used: YesNoNA,
    /// Ppe stock maintained.
    pub ppe_stock_maintained: YesNoNA,
    /// Hazard signage visible.
    pub hazard_signage_visible: YesNoNA,
    /// Signage legible.
    pub signage_legible: YesNoNA,
    /// Housekeeping satisfactory.
    pub housekeeping_satisfactory: YesNoNA,
    /// Slip trip hazards controlled.
    pub slip_trip_hazards_controlled: YesNoNA,
    /// Observations.
    pub observations: String,
}

/// Section 3 — Chemical & Biological Hazards.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChemicalBiologicalHazards {
    /// Coshh register present.
    pub coshh_register_present: YesNoNA,
    /// Sds available.
    pub sds_available: YesNoNA,
    /// Chemicals labelled correctly.
    pub chemicals_labelled_correctly: YesNoNA,
    /// Chemicals stored securely.
    pub chemicals_stored_securely: YesNoNA,
    /// Spill kits available.
    pub spill_kits_available: YesNoNA,
    /// Untreated spills observed.
    pub untreated_spills_observed: YesNoNA,
    /// Sharps containers in date.
    pub sharps_containers_in_date: YesNoNA,
    /// Clinical waste segregated.
    pub clinical_waste_segregated: YesNoNA,
    /// Biological risk assessment current.
    pub biological_risk_assessment_current: YesNoNA,
    /// Observations.
    pub observations: String,
}

/// Section 4 — Electrical Safety.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ElectricalSafety {
    /// Pat testing in date.
    pub pat_testing_in_date: YesNoNA,
    /// Fixed wiring test in date.
    pub fixed_wiring_test_in_date: YesNoNA,
    /// Damaged equipment observed.
    pub damaged_equipment_observed: YesNoNA,
    /// Overloaded sockets observed.
    pub overloaded_sockets_observed: YesNoNA,
    /// Extension leads managed safely.
    pub extension_leads_managed_safely: YesNoNA,
    /// Consumer unit accessible.
    pub consumer_unit_accessible: YesNoNA,
    /// Observations.
    pub observations: String,
}

/// Section 5 — Fire Safety & Emergency Egress.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FireSafety {
    /// Fire risk assessment current.
    pub fire_risk_assessment_current: YesNoNA,
    /// Fire extinguishers serviced.
    pub fire_extinguishers_serviced: YesNoNA,
    /// Fire extinguishers accessible.
    pub fire_extinguishers_accessible: YesNoNA,
    /// Fire alarm tested weekly.
    pub fire_alarm_tested_weekly: YesNoNA,
    /// Emergency egress clear.
    pub emergency_egress_clear: YesNoNA,
    /// Emergency lighting functional.
    pub emergency_lighting_functional: YesNoNA,
    /// Fire doors held open illegally.
    pub fire_doors_held_open_illegally: YesNoNA,
    /// Assembly point signposted.
    pub assembly_point_signposted: YesNoNA,
    /// Observations.
    pub observations: String,
}

/// Section 6 — Ergonomics & Manual Handling.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ErgonomicsManualHandling {
    /// Manual handling assessment current.
    pub manual_handling_assessment_current: YesNoNA,
    /// Lifting aids available.
    pub lifting_aids_available: YesNoNA,
    /// Dse assessments completed.
    pub dse_assessments_completed: YesNoNA,
    /// Workstations adjustable.
    pub workstations_adjustable: YesNoNA,
    /// Repetitive strain concerns.
    pub repetitive_strain_concerns: YesNoNA,
    /// Patient handling plans in place.
    pub patient_handling_plans_in_place: YesNoNA,
    /// Observations.
    pub observations: String,
}

/// Section 7 — Emergency Procedures.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmergencyProcedures {
    /// Evacuation procedure posted.
    pub evacuation_procedure_posted: YesNoNA,
    /// First aid kits stocked.
    pub first_aid_kits_stocked: YesNoNA,
    /// First aider roster current.
    pub first_aider_roster_current: YesNoNA,
    /// Aed available.
    pub aed_available: YesNoNA,
    /// Aed service in date.
    pub aed_service_in_date: YesNoNA,
    /// Emergency contacts displayed.
    pub emergency_contacts_displayed: YesNoNA,
    /// Drill conducted last12 months.
    pub drill_conducted_last12_months: YesNoNA,
    /// Observations.
    pub observations: String,
}

/// Section 8 — Training & Competence.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TrainingCompetence {
    /// Mandatory training up to date.
    pub mandatory_training_up_to_date: YesNoNA,
    /// Fire marshals trained.
    pub fire_marshals_trained: YesNoNA,
    /// Manual handling training current.
    pub manual_handling_training_current: YesNoNA,
    /// Infection control training current.
    pub infection_control_training_current: YesNoNA,
    /// Training records accessible.
    pub training_records_accessible: YesNoNA,
    /// Induction for new starters completed.
    pub induction_for_new_starters_completed: YesNoNA,
    /// Observations.
    pub observations: String,
}

/// Section 9 — Incident Reporting & Near Misses.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IncidentReporting {
    /// Incident reporting system used.
    pub incident_reporting_system_used: YesNoNA,
    /// Riddor reportable incidents reported.
    pub riddor_reportable_incidents_reported: YesNoNA,
    /// Near miss reporting active.
    pub near_miss_reporting_active: YesNoNA,
    /// Incidents last12 months.
    pub incidents_last12_months: Option<i32>,
    /// Near misses last12 months.
    pub near_misses_last12_months: Option<i32>,
    /// Lessons learned shared.
    pub lessons_learned_shared: YesNoNA,
    /// Actions from incidents tracked.
    pub actions_from_incidents_tracked: YesNoNA,
    /// Observations.
    pub observations: String,
}

/// Action item under Section 10.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActionPlanItem {
    /// Description.
    pub description: String,
    /// Owner.
    pub owner: String,
    /// Due date.
    pub due_date: String,
    /// Priority.
    pub priority: String,
}

/// Section 10 — Sign-off & Action Plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SignoffActionPlan {
    /// Action items.
    pub action_items: Vec<ActionPlanItem>,
    /// Overall summary.
    pub overall_summary: String,
    /// Auditor signature.
    pub auditor_signature: String,
    /// Signoff date.
    pub signoff_date: String,
    /// Debrief delivered.
    pub debrief_delivered: YesNoNA,
}

/// Full Workplace Safety Assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Site details.
    pub site_details: SiteDetails,
    /// Ppe hazard controls.
    pub ppe_hazard_controls: PPEHazardControls,
    /// Chemical biological hazards.
    pub chemical_biological_hazards: ChemicalBiologicalHazards,
    /// Electrical safety.
    pub electrical_safety: ElectricalSafety,
    /// Fire safety.
    pub fire_safety: FireSafety,
    /// Ergonomics manual handling.
    pub ergonomics_manual_handling: ErgonomicsManualHandling,
    /// Emergency procedures.
    pub emergency_procedures: EmergencyProcedures,
    /// Training competence.
    pub training_competence: TrainingCompetence,
    /// Incident reporting.
    pub incident_reporting: IncidentReporting,
    /// Signoff action plan.
    pub signoff_action_plan: SignoffActionPlan,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Grade.
    pub grade: SeverityGrade,
}

/// Findings tally per category.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CategoryFindings {
    /// Category.
    pub category: String,
    /// Compliant.
    pub compliant: u32,
    /// Minor.
    pub minor: u32,
    /// Major.
    pub major: u32,
    /// Critical.
    pub critical: u32,
    /// Total.
    pub total: u32,
}

/// Auditor-facing flag.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// Priority.
    pub priority: FlagPriority,
}

/// Grading output for a workplace safety audit.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Outcome.
    pub outcome: Outcome,
    /// Findings by category.
    pub findings_by_category: BTreeMap<String, CategoryFindings>,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Answered count.
    pub answered_count: u32,
    /// Timestamp.
    pub timestamp: String,
}
