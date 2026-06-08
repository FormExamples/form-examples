//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Activity level.
pub type ActivityLevel = String;

// ─── Patient Information (Step 1) ──────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Patient sex.
    pub patient_sex: String,
    /// Referral source.
    pub referral_source: String,
    /// Diagnosis.
    pub diagnosis: String,
    /// Disease duration years.
    pub disease_duration_years: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Rheumatologist name.
    pub rheumatologist_name: String,
}

// ─── Joint Assessment (Step 2) ─────────────────────────────

/// Joint assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct JointAssessment {
    /// Swollen joint count.
    pub swollen_joint_count: Option<u8>,
    /// Tender joint count.
    pub tender_joint_count: Option<u8>,
    /// Joint deformity present.
    pub joint_deformity_present: String,
    /// Joint erosion present.
    pub joint_erosion_present: String,
    /// Affected joint regions.
    pub affected_joint_regions: String,
    /// Joint range of motion.
    pub joint_range_of_motion: Option<u8>,
}

// ─── Morning Stiffness (Step 3) ────────────────────────────

/// Morning stiffness.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MorningStiffness {
    /// Stiffness duration minutes.
    pub stiffness_duration_minutes: Option<u16>,
    /// Stiffness severity.
    pub stiffness_severity: Option<u8>,
    /// Stiffness frequency.
    pub stiffness_frequency: String,
    /// Stiffness impact on function.
    pub stiffness_impact_on_function: Option<u8>,
    /// Stiffness improvement with activity.
    pub stiffness_improvement_with_activity: String,
}

// ─── Disease Activity (Step 4) ─────────────────────────────

/// Disease activity.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DiseaseActivity {
    /// Patient global assessment.
    pub patient_global_assessment: Option<u8>,
    /// Physician global assessment.
    pub physician_global_assessment: Option<u8>,
    /// Pain vas score.
    pub pain_vas_score: Option<u8>,
    /// Fatigue severity.
    pub fatigue_severity: Option<u8>,
    /// Flare frequency.
    pub flare_frequency: String,
    /// Das28 score.
    pub das28_score: Option<f64>,
}

// ─── Laboratory Markers (Step 5) ───────────────────────────

/// Laboratory markers.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct LaboratoryMarkers {
    /// Esr value.
    pub esr_value: Option<f64>,
    /// Crp value.
    pub crp_value: Option<f64>,
    /// Rheumatoid factor positive.
    pub rheumatoid_factor_positive: String,
    /// Anti ccp positive.
    pub anti_ccp_positive: String,
    /// Ana positive.
    pub ana_positive: String,
    /// Hemoglobin value.
    pub hemoglobin_value: Option<f64>,
}

// ─── Imaging Findings (Step 6) ─────────────────────────────

/// Imaging findings.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ImagingFindings {
    /// Xray erosions present.
    pub xray_erosions_present: String,
    /// Xray joint space narrowing.
    pub xray_joint_space_narrowing: String,
    /// Ultrasound synovitis present.
    pub ultrasound_synovitis_present: String,
    /// MRI bone edema present.
    pub mri_bone_edema_present: String,
    /// Imaging progression since last.
    pub imaging_progression_since_last: String,
    /// Overall radiographic stage.
    pub overall_radiographic_stage: String,
}

// ─── Functional Status (Step 7) ────────────────────────────

/// Functional status.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct FunctionalStatus {
    /// Haq score.
    pub haq_score: Option<f64>,
    /// Grip strength.
    pub grip_strength: Option<u8>,
    /// Walking ability.
    pub walking_ability: Option<u8>,
    /// Self care ability.
    pub self_care_ability: Option<u8>,
    /// Work disability.
    pub work_disability: String,
    /// Assistive devices needed.
    pub assistive_devices_needed: String,
}

// ─── Medication History (Step 8) ───────────────────────────

/// Medication history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MedicationHistory {
    /// Current dmard therapy.
    pub current_dmard_therapy: String,
    /// Biologic therapy.
    pub biologic_therapy: String,
    /// Corticosteroid use.
    pub corticosteroid_use: String,
    /// Nsaid use.
    pub nsaid_use: String,
    /// Medication adherence.
    pub medication_adherence: Option<u8>,
    /// Adverse effects reported.
    pub adverse_effects_reported: String,
}

// ─── Comorbidities (Step 9) ────────────────────────────────

/// Comorbidities.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Comorbidities {
    /// Cardiovascular disease.
    pub cardiovascular_disease: String,
    /// Osteoporosis.
    pub osteoporosis: String,
    /// Interstitial lung disease.
    pub interstitial_lung_disease: String,
    /// Infection history.
    pub infection_history: String,
    /// Mental health concerns.
    pub mental_health_concerns: String,
    /// Other comorbidities.
    pub other_comorbidities: String,
}

// ─── Clinical Review (Step 10) ─────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Treatment response.
    pub treatment_response: Option<u8>,
    /// Treatment goal met.
    pub treatment_goal_met: String,
    /// Referral needed.
    pub referral_needed: String,
    /// Patient education provided.
    pub patient_education_provided: String,
    /// Follow up interval.
    pub follow_up_interval: String,
    /// Clinician notes.
    pub clinician_notes: String,
}

// ─── Assessment Data (all sections) ────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Joint assessment.
    pub joint_assessment: JointAssessment,
    /// Morning stiffness.
    pub morning_stiffness: MorningStiffness,
    /// Disease activity.
    pub disease_activity: DiseaseActivity,
    /// Laboratory markers.
    pub laboratory_markers: LaboratoryMarkers,
    /// Imaging findings.
    pub imaging_findings: ImagingFindings,
    /// Functional status.
    pub functional_status: FunctionalStatus,
    /// Medication history.
    pub medication_history: MedicationHistory,
    /// Comorbidities.
    pub comorbidities: Comorbidities,
    /// Clinical review.
    pub clinical_review: ClinicalReview,
}

// ─── Grading types ─────────────────────────────────────────

/// Fired rule.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Concern level.
    pub concern_level: String,
}

/// Additional flag.
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

/// Grading result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Activity level.
    pub activity_level: ActivityLevel,
    /// Activity score.
    pub activity_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
