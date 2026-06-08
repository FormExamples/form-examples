//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Oral health status.
pub type OralHealthStatus = String;

// ─── Patient Information (Step 1) ─────────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Full name.
    pub full_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// NHS number.
    pub nhs_number: String,
    /// Address.
    pub address: String,
    /// Telephone.
    pub telephone: String,
    /// Email.
    pub email: String,
    /// GP name.
    pub gp_name: String,
    /// Dental practice.
    pub dental_practice: String,
}

// ─── Dental History (Step 2) ──────────────────────────────────

/// Dental history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DentalHistory {
    /// Last dental visit.
    pub last_dental_visit: String,
    /// Visit frequency.
    pub visit_frequency: String,
    /// Dental anxiety.
    pub dental_anxiety: Option<u8>,
    /// Previous surgery.
    pub previous_surgery: String,
    /// Dental trauma.
    pub dental_trauma: String,
    /// Orthodontic history.
    pub orthodontic_history: String,
    /// Dental phobia.
    pub dental_phobia: String,
}

// ─── Oral Examination (Step 3) ────────────────────────────────

/// Oral examination.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct OralExamination {
    /// Soft tissue normal.
    pub soft_tissue_normal: String,
    /// Soft tissue findings.
    pub soft_tissue_findings: String,
    /// Tongue condition.
    pub tongue_condition: String,
    /// Mucosal lesions.
    pub mucosal_lesions: String,
    /// Oral cancer screening.
    pub oral_cancer_screening: String,
    /// Lymph nodes.
    pub lymph_nodes: String,
    /// Salivary flow.
    pub salivary_flow: String,
}

// ─── Periodontal Assessment (Step 4) ──────────────────────────

/// Periodontal assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PeriodontalAssessment {
    /// Bpe score.
    pub bpe_score: String,
    /// Gingival bleeding.
    pub gingival_bleeding: String,
    /// Pocket depth max.
    pub pocket_depth_max: Option<u8>,
    /// Clinical attachment loss.
    pub clinical_attachment_loss: String,
    /// Mobility present.
    pub mobility_present: String,
    /// Furcation involvement.
    pub furcation_involvement: String,
    /// Periodontal diagnosis.
    pub periodontal_diagnosis: String,
}

// ─── Caries Assessment (Step 5) ───────────────────────────────

/// Caries assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CariesAssessment {
    /// Decayed teeth.
    pub decayed_teeth: Option<u8>,
    /// Missing teeth.
    pub missing_teeth: Option<u8>,
    /// Filled teeth.
    pub filled_teeth: Option<u8>,
    /// Active caries.
    pub active_caries: String,
    /// Caries risk.
    pub caries_risk: String,
    /// Root caries.
    pub root_caries: String,
    /// Secondary caries.
    pub secondary_caries: String,
}

// ─── Occlusion & TMJ (Step 6) ────────────────────────────────

/// Occlusion tmj.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct OcclusionTmj {
    /// Occlusion class.
    pub occlusion_class: String,
    /// Tmj pain.
    pub tmj_pain: String,
    /// Tmj clicking.
    pub tmj_clicking: String,
    /// Limited opening.
    pub limited_opening: String,
    /// Bruxism.
    pub bruxism: String,
    /// Tooth wear.
    pub tooth_wear: Option<u8>,
    /// Prosthetic needs.
    pub prosthetic_needs: String,
}

// ─── Oral Hygiene (Step 7) ────────────────────────────────────

/// Oral hygiene.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct OralHygiene {
    /// Brushing frequency.
    pub brushing_frequency: String,
    /// Brush type.
    pub brush_type: String,
    /// Interdental cleaning.
    pub interdental_cleaning: String,
    /// Mouthwash use.
    pub mouthwash_use: String,
    /// Fluoride use.
    pub fluoride_use: String,
    /// Dietary sugar.
    pub dietary_sugar: String,
    /// Smoking status.
    pub smoking_status: String,
    /// Alcohol use.
    pub alcohol_use: String,
}

// ─── Radiographic Findings (Step 8) ───────────────────────────

/// Radiographic findings.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RadiographicFindings {
    /// Radiographs taken.
    pub radiographs_taken: String,
    /// Radiograph type.
    pub radiograph_type: String,
    /// Bone loss.
    pub bone_loss: String,
    /// Bone loss percentage.
    pub bone_loss_percentage: Option<u8>,
    /// Periapical lesions.
    pub periapical_lesions: String,
    /// Impacted teeth.
    pub impacted_teeth: String,
    /// Other findings.
    pub other_findings: String,
}

// ─── Treatment Needs (Step 9) ─────────────────────────────────

/// Treatment needs.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct TreatmentNeeds {
    /// Fillings.
    pub fillings: Option<u8>,
    /// Extractions.
    pub extractions: Option<u8>,
    /// Root canals.
    pub root_canals: Option<u8>,
    /// Crowns.
    pub crowns: Option<u8>,
    /// Periodontal treatment.
    pub periodontal_treatment: String,
    /// Urgent treatment.
    pub urgent_treatment: String,
    /// Prosthodontic needs.
    pub prosthodontic_needs: String,
    /// Orthodontic needs.
    pub orthodontic_needs: String,
}

// ─── Clinical Review (Step 10) ────────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Clinician name.
    pub clinician_name: String,
    /// Review date.
    pub review_date: String,
    /// Overall status.
    pub overall_status: String,
    /// Dmft score.
    pub dmft_score: Option<u8>,
    /// Clinical notes.
    pub clinical_notes: String,
    /// Treatment plan.
    pub treatment_plan: String,
    /// Next review date.
    pub next_review_date: String,
    /// Referral needed.
    pub referral_needed: String,
}

// ─── Assessment Data (all sections) ───────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Dental history.
    pub dental_history: DentalHistory,
    /// Oral examination.
    pub oral_examination: OralExamination,
    /// Periodontal assessment.
    pub periodontal_assessment: PeriodontalAssessment,
    /// Caries assessment.
    pub caries_assessment: CariesAssessment,
    /// Occlusion tmj.
    pub occlusion_tmj: OcclusionTmj,
    /// Oral hygiene.
    pub oral_hygiene: OralHygiene,
    /// Radiographic findings.
    pub radiographic_findings: RadiographicFindings,
    /// Treatment needs.
    pub treatment_needs: TreatmentNeeds,
    /// Clinical review.
    pub clinical_review: ClinicalReview,
}

// ─── Grading types ────────────────────────────────────────────

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
    /// Oral health status.
    pub oral_health_status: OralHealthStatus,
    /// Dmft score.
    pub dmft_score: Option<u8>,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
