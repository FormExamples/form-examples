use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type RiskLevel = String;

/// Step 1 — Demographics.
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

/// Step 2 — Reason for Referral.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReasonForReferral {
    pub referral_type: String,
    pub referral_type_other: String,
    pub urgency: String,
    pub primary_complaint: String,
    pub affected_body_area: String,
    pub affected_body_area_other: String,
    pub laterality: String,
    pub duration_of_condition: String,
    pub previous_consultations: YesNo,
    pub previous_consultations_details: String,
}

/// Step 3 — Medical & Surgical History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalSurgicalHistory {
    pub previous_plastic_surgery: YesNo,
    pub previous_plastic_surgery_details: String,
    pub previous_general_surgery: YesNo,
    pub previous_general_surgery_details: String,
    pub wound_healing_problems: YesNo,
    pub wound_healing_details: String,
    pub keloid_scarring: YesNo,
    pub scarring_details: String,
    pub diabetes: String,
    pub diabetes_controlled: YesNo,
    pub hypertension: YesNo,
    pub cardiac_disease: YesNo,
    pub cardiac_disease_details: String,
    pub respiratory_disease: YesNo,
    pub respiratory_disease_details: String,
    pub autoimmune_disease: YesNo,
    pub autoimmune_disease_details: String,
    pub bleeding_disorder: YesNo,
    pub bleeding_disorder_details: String,
    pub immunosuppressed: YesNo,
    pub immunosuppressed_details: String,
    pub cancer_history: YesNo,
    pub cancer_history_details: String,
}

/// Step 4 — Current Condition Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CurrentCondition {
    pub condition_category: String,
    pub condition_description: String,
    pub lesion_length_mm: Option<f64>,
    pub lesion_width_mm: Option<f64>,
    pub lesion_depth_mm: Option<f64>,
    pub tissue_loss: YesNo,
    pub tissue_loss_percentage: Option<f64>,
    pub functional_impairment: String,
    pub functional_impairment_details: String,
    pub pain_level: Option<i32>,
    pub cosmetic_concern: String,
    pub impact_on_daily_activities: String,
}

/// Step 5 — Wound & Tissue Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WoundTissueAssessment {
    pub has_open_wound: YesNo,
    pub wound_classification: String,
    pub wound_age: String,
    pub wound_aetiology: String,
    pub wound_bed_tissue: String,
    pub wound_exudate: String,
    pub wound_infection_signs: YesNo,
    pub wound_infection_details: String,
    pub tissue_viability: String,
    pub surrounding_skin: String,
    pub vascular_supply: String,
    pub sensory_status: String,
    pub previous_wound_treatments: String,
}

/// Step 6 — Psychological Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PsychologicalAssessment {
    pub body_dysmorphic_concern: YesNo,
    pub body_dysmorphic_details: String,
    pub realistic_expectations: String,
    pub expectations_details: String,
    pub motivation: String,
    pub motivation_other: String,
    pub previous_mental_health: YesNo,
    pub mental_health_details: String,
    pub anxiety_level: String,
    pub depression_screen: YesNo,
    pub social_impact: String,
    pub social_impact_details: String,
    pub psychological_referral_needed: YesNo,
}

/// Step 7 — Anaesthetic Risk Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AnaestheticRisk {
    pub asa_class: String,
    pub previous_anaesthetic: YesNo,
    pub anaesthetic_complications: YesNo,
    pub anaesthetic_complications_details: String,
    pub difficult_airway: YesNo,
    pub difficult_airway_details: String,
    pub malignant_hyperthermia_risk: YesNo,
    pub family_anaesthetic_problems: YesNo,
    pub family_anaesthetic_details: String,
    pub smoking_status: String,
    pub pack_years: Option<f64>,
    pub alcohol_consumption: String,
    pub recreational_drugs: YesNo,
    pub recreational_drugs_details: String,
    pub obstructive_sleep_apnoea: YesNo,
    pub anaesthetic_preference: String,
}

/// Step 8 — Photography & Documentation.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhotographyDocumentation {
    pub clinical_photos_taken: YesNo,
    pub photo_consent_obtained: YesNo,
    pub number_of_photos: Option<i32>,
    pub photo_views_taken: String,
    pub standardised_views: YesNo,
    pub measurements_recorded: YesNo,
    pub measurement_details: String,
    pub diagrams_drawn: YesNo,
    pub diagram_notes: String,
    pub previous_imaging: YesNo,
    pub previous_imaging_type: String,
    pub previous_imaging_findings: String,
}

/// A single drug-allergy entry within Step 9.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Allergy {
    pub allergen: String,
    pub reaction: String,
    pub severity: String,
}

/// Step 9 — Current Medications & Allergies.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationsAllergies {
    pub on_anticoagulants: YesNo,
    pub anticoagulant_details: String,
    pub on_antiplatelets: YesNo,
    pub antiplatelet_details: String,
    pub on_steroids: YesNo,
    pub steroid_details: String,
    pub on_immunosuppressants: YesNo,
    pub immunosuppressant_details: String,
    pub on_chemotherapy: YesNo,
    pub chemotherapy_details: String,
    pub on_hormone_therapy: YesNo,
    pub hormone_therapy_details: String,
    pub other_medications: String,
    pub has_drug_allergies: YesNo,
    pub allergies: Vec<Allergy>,
    pub latex_allergy: YesNo,
    pub adhesive_allergy: YesNo,
    pub other_allergies: String,
}

/// Step 10 — Procedure Planning & Consent.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProcedurePlanningConsent {
    pub proposed_procedure: String,
    pub procedure_complexity: String,
    pub surgical_approach: String,
    pub expected_duration_minutes: Option<i32>,
    pub expected_hospital_stay: String,
    pub flap_type: String,
    pub implant_required: YesNo,
    pub implant_details: String,
    pub vte_risk: String,
    pub antibiotic_prophylaxis: YesNo,
    pub anticipated_risks: String,
    pub alternative_treatments: String,
    pub consent_discussion: YesNo,
    pub consent_form_signed: YesNo,
    pub cooling_off_period_offered: String,
    pub follow_up_plan: String,
}

/// Full Plastic Surgery Assessment record (matches front-end AssessmentData).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub reason_for_referral: ReasonForReferral,
    pub medical_surgical_history: MedicalSurgicalHistory,
    pub current_condition: CurrentCondition,
    pub wound_tissue_assessment: WoundTissueAssessment,
    pub psychological_assessment: PsychologicalAssessment,
    pub anaesthetic_risk: AnaestheticRisk,
    pub photography_documentation: PhotographyDocumentation,
    pub medications_allergies: MedicationsAllergies,
    pub procedure_planning_consent: ProcedurePlanningConsent,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub grade: i32,
}

/// A safety flag computed independently of grade classification.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for an assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub asa_class: Option<i32>,
    pub wound_class: Option<i32>,
    pub complexity_score: Option<i32>,
    pub overall_risk: RiskLevel,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
