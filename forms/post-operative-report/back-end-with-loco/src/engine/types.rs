//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Empty string `''` indicates an unanswered enum / text field.
// `Option<f64>` / `Option<i32>` with `None` indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Clavien dindo grade key.
pub type ClavienDindoGradeKey = String;

/// Step 1 — Patient Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientDetails {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Mrn.
    pub mrn: String,
    /// Sex.
    pub sex: String,
    /// Weight.
    pub weight: Option<f64>,
    /// Height.
    pub height: Option<f64>,
    /// Asa grade.
    pub asa_grade: String,
    /// Allergies.
    pub allergies: String,
}

/// Step 2 — Procedure Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProcedureDetails {
    /// Procedure name.
    pub procedure_name: String,
    /// Procedure code.
    pub procedure_code: String,
    /// Indication.
    pub indication: String,
    /// Priority.
    pub priority: String,
    /// Surgical approach.
    pub surgical_approach: String,
    /// Laterality.
    pub laterality: String,
    /// Date of surgery.
    pub date_of_surgery: String,
    /// Start time.
    pub start_time: String,
    /// End time.
    pub end_time: String,
    /// Duration minutes.
    pub duration_minutes: Option<i32>,
    /// Operating room.
    pub operating_room: String,
}

/// Team member.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TeamMember {
    /// Name.
    pub name: String,
    /// Role.
    pub role: String,
    /// Grade.
    pub grade: String,
}

/// Step 3 — Surgical Team.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SurgicalTeam {
    /// Primary surgeon.
    pub primary_surgeon: String,
    /// Primary surgeon grade.
    pub primary_surgeon_grade: String,
    /// Primary anaesthetist.
    pub primary_anaesthetist: String,
    /// Primary anaesthetist grade.
    pub primary_anaesthetist_grade: String,
    /// Additional members.
    pub additional_members: Vec<TeamMember>,
    /// Scrub nurse.
    pub scrub_nurse: String,
    /// Circulator.
    pub circulator: String,
}

/// Step 4 — Intra-operative Findings.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IntraoperativeFindings {
    /// Findings.
    pub findings: String,
    /// Procedure performed.
    pub procedure_performed: String,
    /// Unexpected findings.
    pub unexpected_findings: String,
    /// Conversion to open.
    pub conversion_to_open: YesNo,
    /// Conversion reason.
    pub conversion_reason: String,
}

/// Step 5 — Anaesthesia Summary.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AnaesthesiaSummary {
    /// Anaesthesia type.
    pub anaesthesia_type: String,
    /// Airway management.
    pub airway_management: String,
    /// Difficult intubation.
    pub difficult_intubation: YesNo,
    /// Airway notes.
    pub airway_notes: String,
    /// Medications administered.
    pub medications_administered: String,
    /// Reversal agents.
    pub reversal_agents: String,
    /// Anaesthesia notes.
    pub anaesthesia_notes: String,
}

/// Step 6 — Estimated Blood Loss & Fluid Balance.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BloodLossFluidBalance {
    /// Estimated blood loss ml.
    pub estimated_blood_loss_ml: Option<i32>,
    /// Crystalloids ml.
    pub crystalloids_ml: Option<i32>,
    /// Colloids ml.
    pub colloids_ml: Option<i32>,
    /// Blood products ml.
    pub blood_products_ml: Option<i32>,
    /// Blood product details.
    pub blood_product_details: String,
    /// Urine output ml.
    pub urine_output_ml: Option<i32>,
    /// Other drains ml.
    pub other_drains_ml: Option<i32>,
    /// Fluid notes.
    pub fluid_notes: String,
}

/// Specimen.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Specimen {
    /// Description.
    pub description: String,
    /// Site.
    pub site: String,
    /// Disposition.
    pub disposition: String,
}

/// Implant.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Implant {
    /// Description.
    pub description: String,
    /// Manufacturer.
    pub manufacturer: String,
    /// Lot number.
    pub lot_number: String,
    /// Site.
    pub site: String,
}

/// Step 7 — Specimens & Implants.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpecimensImplants {
    /// Specimens.
    pub specimens: Vec<Specimen>,
    /// Implants.
    pub implants: Vec<Implant>,
    /// Prosthesis used.
    pub prosthesis_used: YesNo,
    /// Drains placed.
    pub drains_placed: String,
    /// Catheters placed.
    pub catheters_placed: String,
}

/// Step 8 — Immediate Post-op Status.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImmediatePostopStatus {
    /// Conscious level.
    pub conscious_level: String,
    /// Systolic BP.
    pub systolic_bp: Option<i32>,
    /// Diastolic BP.
    pub diastolic_bp: Option<i32>,
    /// Heart rate.
    pub heart_rate: Option<i32>,
    /// Respiratory rate.
    pub respiratory_rate: Option<i32>,
    /// Oxygen saturation.
    pub oxygen_saturation: Option<i32>,
    /// Temperature.
    pub temperature: Option<f64>,
    /// Pain score.
    pub pain_score: Option<i32>,
    /// Pain notes.
    pub pain_notes: String,
    /// Disposition.
    pub disposition: String,
}

/// Complication.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Complication {
    /// Description.
    pub description: String,
    /// Grade.
    pub grade: ClavienDindoGradeKey,
    /// Intervention required.
    pub intervention_required: String,
    /// Timing.
    pub timing: String,
}

/// Step 9 — Complications Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ComplicationsAssessment {
    /// Complications occurred.
    pub complications_occurred: YesNo,
    /// Complications.
    pub complications: Vec<Complication>,
    /// Narrative.
    pub narrative: String,
}

/// Step 10 — Post-op Plan & Instructions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PostopPlanInstructions {
    /// Medications prescribed.
    pub medications_prescribed: String,
    /// Antibiotic plan.
    pub antibiotic_plan: String,
    /// Thromboprophylaxis.
    pub thromboprophylaxis: String,
    /// Analgesia plan.
    pub analgesia_plan: String,
    /// Diet plan.
    pub diet_plan: String,
    /// Mobilisation plan.
    pub mobilisation_plan: String,
    /// Wound care instructions.
    pub wound_care_instructions: String,
    /// Follow up plan.
    pub follow_up_plan: String,
    /// Discharge criteria.
    pub discharge_criteria: String,
    /// Alerts and escalation.
    pub alerts_and_escalation: String,
}

/// Full post-operative report.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient details.
    pub patient_details: PatientDetails,
    /// Procedure details.
    pub procedure_details: ProcedureDetails,
    /// Surgical team.
    pub surgical_team: SurgicalTeam,
    /// Intraoperative findings.
    pub intraoperative_findings: IntraoperativeFindings,
    /// Anaesthesia summary.
    pub anaesthesia_summary: AnaesthesiaSummary,
    /// Blood loss fluid balance.
    pub blood_loss_fluid_balance: BloodLossFluidBalance,
    /// Specimens implants.
    pub specimens_implants: SpecimensImplants,
    /// Immediate postop status.
    pub immediate_postop_status: ImmediatePostopStatus,
    /// Complications assessment.
    pub complications_assessment: ComplicationsAssessment,
    /// Postop plan instructions.
    pub postop_plan_instructions: PostopPlanInstructions,
}

/// One entry in the per-rule audit trail. Mirrors the front-end engine's
/// `FiredRule` shape (id is `CD-<index>`).
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
    pub grade: ClavienDindoGradeKey,
}

/// Real-time clinician-facing safety alert. Priority: urgent > high > medium > low.
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
    pub priority: String,
}

/// Grading output for a post-operative report.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Overall grade.
    pub overall_grade: ClavienDindoGradeKey,
    /// Complication count.
    pub complication_count: u32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
