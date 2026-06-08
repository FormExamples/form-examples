//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Severity level.
pub type SeverityLevel = String;

// ─── Patient Information (Step 1) ─────────────────────────

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

// ─── Allergy History (Step 2) ─────────────────────────────

/// Allergy history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AllergyHistory {
    /// Age of onset.
    pub age_of_onset: Option<u8>,
    /// Family allergy history.
    pub family_allergy_history: String,
    /// Atopic history.
    pub atopic_history: String,
    /// Previous anaphylaxis.
    pub previous_anaphylaxis: String,
    /// Epi pen prescribed.
    pub epi_pen_prescribed: String,
    /// Number of known allergies.
    pub number_of_known_allergies: Option<u8>,
}

// ─── Current Allergies (Step 3) ───────────────────────────

/// Current allergies.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentAllergies {
    /// Primary allergen.
    pub primary_allergen: String,
    /// Allergen category.
    pub allergen_category: String,
    /// Reaction type.
    pub reaction_type: String,
    /// Severity rating.
    pub severity_rating: Option<u8>,
    /// Onset timing.
    pub onset_timing: String,
    /// Last reaction.
    pub last_reaction: String,
}

// ─── Symptoms & Reactions (Step 4) ────────────────────────

/// Symptoms reactions.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SymptomsReactions {
    /// Skin symptoms.
    pub skin_symptoms: Option<u8>,
    /// Respiratory symptoms.
    pub respiratory_symptoms: Option<u8>,
    /// Gastrointestinal symptoms.
    pub gastrointestinal_symptoms: Option<u8>,
    /// Cardiovascular symptoms.
    pub cardiovascular_symptoms: Option<u8>,
    /// Anaphylaxis risk.
    pub anaphylaxis_risk: Option<u8>,
    /// Symptom frequency.
    pub symptom_frequency: String,
}

// ─── Environmental Triggers (Step 5) ──────────────────────

/// Environmental triggers.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct EnvironmentalTriggers {
    /// Pollen sensitivity.
    pub pollen_sensitivity: Option<u8>,
    /// Dust mite sensitivity.
    pub dust_mite_sensitivity: Option<u8>,
    /// Pet dander sensitivity.
    pub pet_dander_sensitivity: Option<u8>,
    /// Mold sensitivity.
    pub mold_sensitivity: Option<u8>,
    /// Seasonal pattern.
    pub seasonal_pattern: String,
    /// Indoor outdoor triggers.
    pub indoor_outdoor_triggers: String,
}

// ─── Food & Drug Allergies (Step 6) ───────────────────────

/// Food drug allergies.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct FoodDrugAllergies {
    /// Food allergies.
    pub food_allergies: String,
    /// Drug allergies.
    pub drug_allergies: String,
    /// Cross reactivity.
    pub cross_reactivity: String,
    /// Drug allergy type.
    pub drug_allergy_type: String,
    /// Food allergy type.
    pub food_allergy_type: String,
    /// Allergy verified.
    pub allergy_verified: String,
}

// ─── Testing Results (Step 7) ─────────────────────────────

/// Testing results.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct TestingResults {
    /// Skin prick test done.
    pub skin_prick_test_done: String,
    /// Skin prick test result.
    pub skin_prick_test_result: String,
    /// Specific ige level.
    pub specific_ige_level: Option<f64>,
    /// Total ige level.
    pub total_ige_level: Option<f64>,
    /// Challenge test done.
    pub challenge_test_done: String,
    /// Component resolved diagnostics.
    pub component_resolved_diagnostics: String,
}

// ─── Current Treatment (Step 8) ───────────────────────────

/// Current treatment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentTreatment {
    /// Antihistamine use.
    pub antihistamine_use: String,
    /// Nasal corticosteroid.
    pub nasal_corticosteroid: String,
    /// Immunotherapy.
    pub immunotherapy: String,
    /// Immunotherapy duration.
    pub immunotherapy_duration: String,
    /// Epi pen carried.
    pub epi_pen_carried: String,
    /// Other medications.
    pub other_medications: String,
}

// ─── Emergency Plan (Step 9) ──────────────────────────────

/// Emergency plan.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct EmergencyPlan {
    /// Has emergency plan.
    pub has_emergency_plan: String,
    /// Plan review date.
    pub plan_review_date: String,
    /// Anaphylaxis action plan.
    pub anaphylaxis_action_plan: String,
    /// Emergency contact name.
    pub emergency_contact_name: String,
    /// Emergency contact phone.
    pub emergency_contact_phone: String,
    /// School work notified.
    pub school_work_notified: String,
}

// ─── Review & Assessment (Step 10) ────────────────────────

/// Review assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ReviewAssessment {
    /// Clinician name.
    pub clinician_name: String,
    /// Review date.
    pub review_date: String,
    /// Overall severity.
    pub overall_severity: Option<u8>,
    /// Clinical notes.
    pub clinical_notes: String,
    /// Follow up interval.
    pub follow_up_interval: String,
    /// Referral needed.
    pub referral_needed: String,
}

// ─── Assessment Data (all sections) ──────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Allergy history.
    pub allergy_history: AllergyHistory,
    /// Current allergies.
    pub current_allergies: CurrentAllergies,
    /// Symptoms reactions.
    pub symptoms_reactions: SymptomsReactions,
    /// Environmental triggers.
    pub environmental_triggers: EnvironmentalTriggers,
    /// Food drug allergies.
    pub food_drug_allergies: FoodDrugAllergies,
    /// Testing results.
    pub testing_results: TestingResults,
    /// Current treatment.
    pub current_treatment: CurrentTreatment,
    /// Emergency plan.
    pub emergency_plan: EmergencyPlan,
    /// Review assessment.
    pub review_assessment: ReviewAssessment,
}

// ─── Grading types ───────────────────────────────────────

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
    /// Severity score.
    pub severity_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
