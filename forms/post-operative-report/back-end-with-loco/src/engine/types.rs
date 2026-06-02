use serde::{Deserialize, Serialize};

// Empty string `''` indicates an unanswered enum / text field.
// `Option<f64>` / `Option<i32>` with `None` indicates an unanswered numeric field.
pub type YesNo = String;
pub type ClavienDindoGradeKey = String;

/// Step 1 — Patient Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientDetails {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub mrn: String,
    pub sex: String,
    pub weight: Option<f64>,
    pub height: Option<f64>,
    pub asa_grade: String,
    pub allergies: String,
}

/// Step 2 — Procedure Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProcedureDetails {
    pub procedure_name: String,
    pub procedure_code: String,
    pub indication: String,
    pub priority: String,
    pub surgical_approach: String,
    pub laterality: String,
    pub date_of_surgery: String,
    pub start_time: String,
    pub end_time: String,
    pub duration_minutes: Option<i32>,
    pub operating_room: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TeamMember {
    pub name: String,
    pub role: String,
    pub grade: String,
}

/// Step 3 — Surgical Team.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SurgicalTeam {
    pub primary_surgeon: String,
    pub primary_surgeon_grade: String,
    pub primary_anaesthetist: String,
    pub primary_anaesthetist_grade: String,
    pub additional_members: Vec<TeamMember>,
    pub scrub_nurse: String,
    pub circulator: String,
}

/// Step 4 — Intra-operative Findings.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IntraoperativeFindings {
    pub findings: String,
    pub procedure_performed: String,
    pub unexpected_findings: String,
    pub conversion_to_open: YesNo,
    pub conversion_reason: String,
}

/// Step 5 — Anaesthesia Summary.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AnaesthesiaSummary {
    pub anaesthesia_type: String,
    pub airway_management: String,
    pub difficult_intubation: YesNo,
    pub airway_notes: String,
    pub medications_administered: String,
    pub reversal_agents: String,
    pub anaesthesia_notes: String,
}

/// Step 6 — Estimated Blood Loss & Fluid Balance.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BloodLossFluidBalance {
    pub estimated_blood_loss_ml: Option<i32>,
    pub crystalloids_ml: Option<i32>,
    pub colloids_ml: Option<i32>,
    pub blood_products_ml: Option<i32>,
    pub blood_product_details: String,
    pub urine_output_ml: Option<i32>,
    pub other_drains_ml: Option<i32>,
    pub fluid_notes: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Specimen {
    pub description: String,
    pub site: String,
    pub disposition: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Implant {
    pub description: String,
    pub manufacturer: String,
    pub lot_number: String,
    pub site: String,
}

/// Step 7 — Specimens & Implants.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpecimensImplants {
    pub specimens: Vec<Specimen>,
    pub implants: Vec<Implant>,
    pub prosthesis_used: YesNo,
    pub drains_placed: String,
    pub catheters_placed: String,
}

/// Step 8 — Immediate Post-op Status.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImmediatePostopStatus {
    pub conscious_level: String,
    pub systolic_bp: Option<i32>,
    pub diastolic_bp: Option<i32>,
    pub heart_rate: Option<i32>,
    pub respiratory_rate: Option<i32>,
    pub oxygen_saturation: Option<i32>,
    pub temperature: Option<f64>,
    pub pain_score: Option<i32>,
    pub pain_notes: String,
    pub disposition: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Complication {
    pub description: String,
    pub grade: ClavienDindoGradeKey,
    pub intervention_required: String,
    pub timing: String,
}

/// Step 9 — Complications Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ComplicationsAssessment {
    pub complications_occurred: YesNo,
    pub complications: Vec<Complication>,
    pub narrative: String,
}

/// Step 10 — Post-op Plan & Instructions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PostopPlanInstructions {
    pub medications_prescribed: String,
    pub antibiotic_plan: String,
    pub thromboprophylaxis: String,
    pub analgesia_plan: String,
    pub diet_plan: String,
    pub mobilisation_plan: String,
    pub wound_care_instructions: String,
    pub follow_up_plan: String,
    pub discharge_criteria: String,
    pub alerts_and_escalation: String,
}

/// Full post-operative report.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub patient_details: PatientDetails,
    pub procedure_details: ProcedureDetails,
    pub surgical_team: SurgicalTeam,
    pub intraoperative_findings: IntraoperativeFindings,
    pub anaesthesia_summary: AnaesthesiaSummary,
    pub blood_loss_fluid_balance: BloodLossFluidBalance,
    pub specimens_implants: SpecimensImplants,
    pub immediate_postop_status: ImmediatePostopStatus,
    pub complications_assessment: ComplicationsAssessment,
    pub postop_plan_instructions: PostopPlanInstructions,
}

/// One entry in the per-rule audit trail. Mirrors the front-end engine's
/// `FiredRule` shape (id is `CD-<index>`).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub grade: ClavienDindoGradeKey,
}

/// Real-time clinician-facing safety alert. Priority: urgent > high > medium > low.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a post-operative report.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub overall_grade: ClavienDindoGradeKey,
    pub complication_count: u32,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
