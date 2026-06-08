//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Risk level.
pub type RiskLevel = String;

/// Step 1 — Patient demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: String,
    /// Weight.
    pub weight: Option<f64>,
    /// Height.
    pub height: Option<f64>,
    /// BMI.
    pub bmi: Option<f64>,
}

/// Step 2 — Presenting skin concern.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PresentingSkinConcern {
    /// Chief complaint.
    pub chief_complaint: String,
    /// Onset.
    pub onset: String,
    /// Duration.
    pub duration: String,
    /// Location.
    pub location: String,
    /// Pain.
    pub pain: YesNo,
    /// Pain score.
    pub pain_score: Option<i32>,
    /// Itching.
    pub itching: YesNo,
    /// Bleeding.
    pub bleeding: YesNo,
    /// Discharge.
    pub discharge: YesNo,
    /// Aggravating factors.
    pub aggravating_factors: String,
    /// Relieving factors.
    pub relieving_factors: String,
    /// Prior treatment.
    pub prior_treatment: String,
}

/// A single skin lesion entry within `SkinInspection`.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Lesion {
    /// Site.
    pub site: String,
    /// Lesion type.
    #[serde(rename = "type")]
    pub lesion_type: String,
    /// Size.
    pub size: String,
    /// Description.
    pub description: String,
}

/// Step 3 — Skin inspection (colour, moisture, integrity, turgor, lesions).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SkinInspection {
    /// Colour.
    pub colour: String,
    /// Moisture.
    pub moisture: String,
    /// Integrity.
    pub integrity: String,
    /// Turgor.
    pub turgor: String,
    /// Temperature.
    pub temperature: String,
    /// Lesion types.
    pub lesion_types: Vec<String>,
    /// Lesions.
    pub lesions: Vec<Lesion>,
    /// Additional notes.
    pub additional_notes: String,
}

/// Step 4 — Hair & scalp examination.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HairScalpExamination {
    /// Hair distribution.
    pub hair_distribution: String,
    /// Hair texture.
    pub hair_texture: String,
    /// Alopecia.
    pub alopecia: YesNo,
    /// Alopecia pattern.
    pub alopecia_pattern: String,
    /// Scalp lesions.
    pub scalp_lesions: YesNo,
    /// Scalp findings.
    pub scalp_findings: Vec<String>,
    /// Scalp notes.
    pub scalp_notes: String,
}

/// Step 5 — Nail examination.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NailExamination {
    /// Nail colour.
    pub nail_colour: String,
    /// Nail shape.
    pub nail_shape: String,
    /// Nail capillary refill.
    pub nail_capillary_refill: String,
    /// Nail findings.
    pub nail_findings: Vec<String>,
    /// Nail notes.
    pub nail_notes: String,
}

/// Step 6 — Wound assessment (if applicable; stage + TIME).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WoundAssessment {
    /// Wound present.
    pub wound_present: YesNo,
    /// Wound location.
    pub wound_location: String,
    /// Wound stage.
    pub wound_stage: String,
    /// Wound length.
    pub wound_length: Option<f64>,
    /// Wound width.
    pub wound_width: Option<f64>,
    /// Wound depth.
    pub wound_depth: Option<f64>,
    /// Tissue type.
    pub tissue_type: String,
    /// Infection signs.
    pub infection_signs: YesNo,
    /// Moisture balance.
    pub moisture_balance: String,
    /// Edge condition.
    pub edge_condition: String,
    /// Exudate amount.
    pub exudate_amount: String,
    /// Exudate type.
    pub exudate_type: String,
    /// Wound odour.
    pub wound_odour: String,
    /// Wound notes.
    pub wound_notes: String,
}

/// Step 7 — Braden Scale subscale scores (sensory, moisture, activity,
/// mobility, nutrition each 1-4; friction/shear 1-3).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BradenScale {
    /// Sensory perception.
    pub sensory_perception: Option<i32>,
    /// Moisture.
    pub moisture: Option<i32>,
    /// Activity.
    pub activity: Option<i32>,
    /// Mobility.
    pub mobility: Option<i32>,
    /// Nutrition.
    pub nutrition: Option<i32>,
    /// Friction shear.
    pub friction_shear: Option<i32>,
}

/// A single photograph entry within `PhotographyDocumentation`.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Photo {
    /// Site.
    pub site: String,
    /// Date.
    pub date: String,
    /// Reference.
    pub reference: String,
}

/// Step 8 — Photography & documentation.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhotographyDocumentation {
    /// Consent obtained.
    pub consent_obtained: YesNo,
    /// Photos taken.
    pub photos_taken: YesNo,
    /// Photos.
    pub photos: Vec<Photo>,
    /// Documentation notes.
    pub documentation_notes: String,
}

/// Step 9 — Clinical impression & care plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalImpressionCarePlan {
    /// Clinical impression.
    pub clinical_impression: String,
    /// Differential diagnoses.
    pub differential_diagnoses: String,
    /// Care plan.
    pub care_plan: String,
    /// Dressing required.
    pub dressing_required: YesNo,
    /// Dressing type.
    pub dressing_type: String,
    /// Pressure relief required.
    pub pressure_relief_required: YesNo,
    /// Referral required.
    pub referral_required: YesNo,
    /// Referral details.
    pub referral_details: String,
    /// Follow up date.
    pub follow_up_date: String,
    /// Clinician name.
    pub clinician_name: String,
}

/// Full integumentary-assessment record (one row per `assessments` JSONB blob).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Presenting skin concern.
    pub presenting_skin_concern: PresentingSkinConcern,
    /// Skin inspection.
    pub skin_inspection: SkinInspection,
    /// Hair scalp examination.
    pub hair_scalp_examination: HairScalpExamination,
    /// Nail examination.
    pub nail_examination: NailExamination,
    /// Wound assessment.
    pub wound_assessment: WoundAssessment,
    /// Braden scale.
    pub braden_scale: BradenScale,
    /// Photography documentation.
    pub photography_documentation: PhotographyDocumentation,
    /// Clinical impression care plan.
    pub clinical_impression_care_plan: ClinicalImpressionCarePlan,
}

/// A Braden subscale rule that "fired" (contributed a non-zero score).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Score.
    pub score: i32,
    /// Max score.
    pub max_score: i32,
}

/// A clinical-priority flag computed independently of the Braden total.
/// Priority: urgent > high > medium > low.
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

/// Grading output for an integumentary assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Braden score.
    pub braden_score: i32,
    /// Risk level.
    pub risk_level: RiskLevel,
    /// Answered count.
    pub answered_count: i32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
