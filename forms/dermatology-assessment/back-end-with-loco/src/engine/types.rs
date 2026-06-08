//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Severity level.
pub type SeverityLevel = String;

// ─── Patient Information (Step 1) ──────────────────────────

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
    /// GP practice.
    pub gp_practice: String,
}

// ─── Skin History (Step 2) ─────────────────────────────────

/// Skin history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SkinHistory {
    /// Primary diagnosis.
    pub primary_diagnosis: String,
    /// Age of onset.
    pub age_of_onset: Option<u8>,
    /// Duration years.
    pub duration_years: Option<u8>,
    /// Family history.
    pub family_history: String,
    /// Previous biopsies.
    pub previous_biopsies: String,
    /// Skin cancer history.
    pub skin_cancer_history: String,
}

// ─── Current Condition (Step 3) ────────────────────────────

/// Current condition.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentCondition {
    /// Condition status.
    pub condition_status: String,
    /// Lesion type.
    pub lesion_type: String,
    /// Lesion distribution.
    pub lesion_distribution: String,
    /// Body area affected.
    pub body_area_affected: Option<u8>,
    /// Infection signs.
    pub infection_signs: String,
    /// Scarring.
    pub scarring: String,
}

// ─── Affected Areas (Step 4) ───────────────────────────────

/// Affected areas.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AffectedAreas {
    /// Head.
    pub head: Option<u8>,
    /// Upper limbs.
    pub upper_limbs: Option<u8>,
    /// Trunk.
    pub trunk: Option<u8>,
    /// Lower limbs.
    pub lower_limbs: Option<u8>,
    /// Hands.
    pub hands: Option<u8>,
    /// Feet.
    pub feet: Option<u8>,
    /// Genital area.
    pub genital_area: Option<u8>,
    /// Nails.
    pub nails: Option<u8>,
}

// ─── Symptom Severity (Step 5) ─────────────────────────────

/// Symptom severity.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SymptomSeverity {
    /// Itching.
    pub itching: Option<u8>,
    /// Pain.
    pub pain: Option<u8>,
    /// Burning.
    pub burning: Option<u8>,
    /// Dryness.
    pub dryness: Option<u8>,
    /// Scaling.
    pub scaling: Option<u8>,
    /// Erythema.
    pub erythema: Option<u8>,
    /// Thickness.
    pub thickness: Option<u8>,
    /// Sleep disturbance.
    pub sleep_disturbance: Option<u8>,
}

// ─── Quality of Life - DLQI (Step 6) ──────────────────────

/// Quality of life.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct QualityOfLife {
    /// Dlqi1 symptoms.
    pub dlqi1_symptoms: Option<u8>,
    /// Dlqi2 embarrassment.
    pub dlqi2_embarrassment: Option<u8>,
    /// Dlqi3 shopping.
    pub dlqi3_shopping: Option<u8>,
    /// Dlqi4 clothing.
    pub dlqi4_clothing: Option<u8>,
    /// Dlqi5 social.
    pub dlqi5_social: Option<u8>,
    /// Dlqi6 sport.
    pub dlqi6_sport: Option<u8>,
    /// Dlqi7 work.
    pub dlqi7_work: Option<u8>,
    /// Dlqi8 relationships.
    pub dlqi8_relationships: Option<u8>,
    /// Dlqi9 sex.
    pub dlqi9_sex: Option<u8>,
    /// Dlqi10 treatment.
    pub dlqi10_treatment: Option<u8>,
}

// ─── Previous Treatments (Step 7) ──────────────────────────

/// Previous treatments.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PreviousTreatments {
    /// Topical steroids used.
    pub topical_steroids_used: String,
    /// Topical steroid response.
    pub topical_steroid_response: String,
    /// Emollients used.
    pub emollients_used: String,
    /// Phototherapy.
    pub phototherapy: String,
    /// Systemic therapy.
    pub systemic_therapy: String,
    /// Biologic therapy.
    pub biologic_therapy: String,
    /// Treatment failures.
    pub treatment_failures: Option<u8>,
}

// ─── Current Treatment (Step 8) ────────────────────────────

/// Current treatment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentTreatment {
    /// Current topical.
    pub current_topical: String,
    /// Current systemic.
    pub current_systemic: String,
    /// Current biologic.
    pub current_biologic: String,
    /// Treatment adherence.
    pub treatment_adherence: Option<u8>,
    /// Treatment response.
    pub treatment_response: Option<u8>,
    /// Side effects.
    pub side_effects: String,
    /// Emollient use.
    pub emollient_use: Option<u8>,
}

// ─── Triggers & Comorbidities (Step 9) ─────────────────────

/// Triggers comorbidities.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct TriggersComorbidities {
    /// Stress trigger.
    pub stress_trigger: String,
    /// Weather trigger.
    pub weather_trigger: String,
    /// Contact allergens.
    pub contact_allergens: String,
    /// Psoriasis arthritis.
    pub psoriasis_arthritis: String,
    /// Mental health impact.
    pub mental_health_impact: Option<u8>,
    /// Allergic rhinitis.
    pub allergic_rhinitis: String,
    /// Asthma.
    pub asthma: String,
    /// Metabolic syndrome.
    pub metabolic_syndrome: String,
}

// ─── Clinical Review (Step 10) ─────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Clinician name.
    pub clinician_name: String,
    /// Review date.
    pub review_date: String,
    /// Clinical severity.
    pub clinical_severity: Option<u8>,
    /// Dlqi total.
    pub dlqi_total: Option<u8>,
    /// Clinical notes.
    pub clinical_notes: String,
    /// Treatment plan.
    pub treatment_plan: String,
    /// Referral needed.
    pub referral_needed: String,
    /// Next review date.
    pub next_review_date: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Skin history.
    pub skin_history: SkinHistory,
    /// Current condition.
    pub current_condition: CurrentCondition,
    /// Affected areas.
    pub affected_areas: AffectedAreas,
    /// Symptom severity.
    pub symptom_severity: SymptomSeverity,
    /// Quality of life.
    pub quality_of_life: QualityOfLife,
    /// Previous treatments.
    pub previous_treatments: PreviousTreatments,
    /// Current treatment.
    pub current_treatment: CurrentTreatment,
    /// Triggers comorbidities.
    pub triggers_comorbidities: TriggersComorbidities,
    /// Clinical review.
    pub clinical_review: ClinicalReview,
}

// ─── Grading types ──────────────────────────────────────────

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
    /// Severity level.
    pub severity_level: SeverityLevel,
    /// Dlqi score.
    pub dlqi_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
