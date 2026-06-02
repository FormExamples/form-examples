use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type RiskLevel = String;

/// Step 1 — Patient demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub weight: Option<f64>,
    pub height: Option<f64>,
    pub bmi: Option<f64>,
}

/// Step 2 — Presenting skin concern.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PresentingSkinConcern {
    pub chief_complaint: String,
    pub onset: String,
    pub duration: String,
    pub location: String,
    pub pain: YesNo,
    pub pain_score: Option<i32>,
    pub itching: YesNo,
    pub bleeding: YesNo,
    pub discharge: YesNo,
    pub aggravating_factors: String,
    pub relieving_factors: String,
    pub prior_treatment: String,
}

/// A single skin lesion entry within `SkinInspection`.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Lesion {
    pub site: String,
    #[serde(rename = "type")]
    pub lesion_type: String,
    pub size: String,
    pub description: String,
}

/// Step 3 — Skin inspection (colour, moisture, integrity, turgor, lesions).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SkinInspection {
    pub colour: String,
    pub moisture: String,
    pub integrity: String,
    pub turgor: String,
    pub temperature: String,
    pub lesion_types: Vec<String>,
    pub lesions: Vec<Lesion>,
    pub additional_notes: String,
}

/// Step 4 — Hair & scalp examination.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HairScalpExamination {
    pub hair_distribution: String,
    pub hair_texture: String,
    pub alopecia: YesNo,
    pub alopecia_pattern: String,
    pub scalp_lesions: YesNo,
    pub scalp_findings: Vec<String>,
    pub scalp_notes: String,
}

/// Step 5 — Nail examination.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NailExamination {
    pub nail_colour: String,
    pub nail_shape: String,
    pub nail_capillary_refill: String,
    pub nail_findings: Vec<String>,
    pub nail_notes: String,
}

/// Step 6 — Wound assessment (if applicable; stage + TIME).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WoundAssessment {
    pub wound_present: YesNo,
    pub wound_location: String,
    pub wound_stage: String,
    pub wound_length: Option<f64>,
    pub wound_width: Option<f64>,
    pub wound_depth: Option<f64>,
    pub tissue_type: String,
    pub infection_signs: YesNo,
    pub moisture_balance: String,
    pub edge_condition: String,
    pub exudate_amount: String,
    pub exudate_type: String,
    pub wound_odour: String,
    pub wound_notes: String,
}

/// Step 7 — Braden Scale subscale scores (sensory, moisture, activity,
/// mobility, nutrition each 1-4; friction/shear 1-3).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BradenScale {
    pub sensory_perception: Option<i32>,
    pub moisture: Option<i32>,
    pub activity: Option<i32>,
    pub mobility: Option<i32>,
    pub nutrition: Option<i32>,
    pub friction_shear: Option<i32>,
}

/// A single photograph entry within `PhotographyDocumentation`.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Photo {
    pub site: String,
    pub date: String,
    pub reference: String,
}

/// Step 8 — Photography & documentation.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhotographyDocumentation {
    pub consent_obtained: YesNo,
    pub photos_taken: YesNo,
    pub photos: Vec<Photo>,
    pub documentation_notes: String,
}

/// Step 9 — Clinical impression & care plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalImpressionCarePlan {
    pub clinical_impression: String,
    pub differential_diagnoses: String,
    pub care_plan: String,
    pub dressing_required: YesNo,
    pub dressing_type: String,
    pub pressure_relief_required: YesNo,
    pub referral_required: YesNo,
    pub referral_details: String,
    pub follow_up_date: String,
    pub clinician_name: String,
}

/// Full integumentary-assessment record (one row per `assessments` JSONB blob).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub presenting_skin_concern: PresentingSkinConcern,
    pub skin_inspection: SkinInspection,
    pub hair_scalp_examination: HairScalpExamination,
    pub nail_examination: NailExamination,
    pub wound_assessment: WoundAssessment,
    pub braden_scale: BradenScale,
    pub photography_documentation: PhotographyDocumentation,
    pub clinical_impression_care_plan: ClinicalImpressionCarePlan,
}

/// A Braden subscale rule that "fired" (contributed a non-zero score).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub score: i32,
    pub max_score: i32,
}

/// A clinical-priority flag computed independently of the Braden total.
/// Priority: urgent > high > medium > low.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for an integumentary assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub braden_score: i32,
    pub risk_level: RiskLevel,
    pub answered_count: i32,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
