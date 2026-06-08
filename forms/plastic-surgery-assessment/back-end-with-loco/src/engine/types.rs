//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Risk level.
pub type RiskLevel = String;

/// Step 1 — Demographics.
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

/// Step 2 — Reason for Referral.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReasonForReferral {
    /// Referral type.
    pub referral_type: String,
    /// Referral type other.
    pub referral_type_other: String,
    /// Urgency.
    pub urgency: String,
    /// Primary complaint.
    pub primary_complaint: String,
    /// Affected body area.
    pub affected_body_area: String,
    /// Affected body area other.
    pub affected_body_area_other: String,
    /// Laterality.
    pub laterality: String,
    /// Duration of condition.
    pub duration_of_condition: String,
    /// Previous consultations.
    pub previous_consultations: YesNo,
    /// Previous consultations details.
    pub previous_consultations_details: String,
}

/// Step 3 — Medical & Surgical History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalSurgicalHistory {
    /// Previous plastic surgery.
    pub previous_plastic_surgery: YesNo,
    /// Previous plastic surgery details.
    pub previous_plastic_surgery_details: String,
    /// Previous general surgery.
    pub previous_general_surgery: YesNo,
    /// Previous general surgery details.
    pub previous_general_surgery_details: String,
    /// Wound healing problems.
    pub wound_healing_problems: YesNo,
    /// Wound healing details.
    pub wound_healing_details: String,
    /// Keloid scarring.
    pub keloid_scarring: YesNo,
    /// Scarring details.
    pub scarring_details: String,
    /// Diabetes.
    pub diabetes: String,
    /// Diabetes controlled.
    pub diabetes_controlled: YesNo,
    /// Hypertension.
    pub hypertension: YesNo,
    /// Cardiac disease.
    pub cardiac_disease: YesNo,
    /// Cardiac disease details.
    pub cardiac_disease_details: String,
    /// Respiratory disease.
    pub respiratory_disease: YesNo,
    /// Respiratory disease details.
    pub respiratory_disease_details: String,
    /// Autoimmune disease.
    pub autoimmune_disease: YesNo,
    /// Autoimmune disease details.
    pub autoimmune_disease_details: String,
    /// Bleeding disorder.
    pub bleeding_disorder: YesNo,
    /// Bleeding disorder details.
    pub bleeding_disorder_details: String,
    /// Immunosuppressed.
    pub immunosuppressed: YesNo,
    /// Immunosuppressed details.
    pub immunosuppressed_details: String,
    /// Cancer history.
    pub cancer_history: YesNo,
    /// Cancer history details.
    pub cancer_history_details: String,
}

/// Step 4 — Current Condition Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CurrentCondition {
    /// Condition category.
    pub condition_category: String,
    /// Condition description.
    pub condition_description: String,
    /// Lesion length mm.
    pub lesion_length_mm: Option<f64>,
    /// Lesion width mm.
    pub lesion_width_mm: Option<f64>,
    /// Lesion depth mm.
    pub lesion_depth_mm: Option<f64>,
    /// Tissue loss.
    pub tissue_loss: YesNo,
    /// Tissue loss percentage.
    pub tissue_loss_percentage: Option<f64>,
    /// Functional impairment.
    pub functional_impairment: String,
    /// Functional impairment details.
    pub functional_impairment_details: String,
    /// Pain level.
    pub pain_level: Option<i32>,
    /// Cosmetic concern.
    pub cosmetic_concern: String,
    /// Impact on daily activities.
    pub impact_on_daily_activities: String,
}

/// Step 5 — Wound & Tissue Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WoundTissueAssessment {
    /// Has open wound.
    pub has_open_wound: YesNo,
    /// Wound classification.
    pub wound_classification: String,
    /// Wound age.
    pub wound_age: String,
    /// Wound aetiology.
    pub wound_aetiology: String,
    /// Wound bed tissue.
    pub wound_bed_tissue: String,
    /// Wound exudate.
    pub wound_exudate: String,
    /// Wound infection signs.
    pub wound_infection_signs: YesNo,
    /// Wound infection details.
    pub wound_infection_details: String,
    /// Tissue viability.
    pub tissue_viability: String,
    /// Surrounding skin.
    pub surrounding_skin: String,
    /// Vascular supply.
    pub vascular_supply: String,
    /// Sensory status.
    pub sensory_status: String,
    /// Previous wound treatments.
    pub previous_wound_treatments: String,
}

/// Step 6 — Psychological Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PsychologicalAssessment {
    /// Body dysmorphic concern.
    pub body_dysmorphic_concern: YesNo,
    /// Body dysmorphic details.
    pub body_dysmorphic_details: String,
    /// Realistic expectations.
    pub realistic_expectations: String,
    /// Expectations details.
    pub expectations_details: String,
    /// Motivation.
    pub motivation: String,
    /// Motivation other.
    pub motivation_other: String,
    /// Previous mental health.
    pub previous_mental_health: YesNo,
    /// Mental health details.
    pub mental_health_details: String,
    /// Anxiety level.
    pub anxiety_level: String,
    /// Depression screen.
    pub depression_screen: YesNo,
    /// Social impact.
    pub social_impact: String,
    /// Social impact details.
    pub social_impact_details: String,
    /// Psychological referral needed.
    pub psychological_referral_needed: YesNo,
}

/// Step 7 — Anaesthetic Risk Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AnaestheticRisk {
    /// Asa class.
    pub asa_class: String,
    /// Previous anaesthetic.
    pub previous_anaesthetic: YesNo,
    /// Anaesthetic complications.
    pub anaesthetic_complications: YesNo,
    /// Anaesthetic complications details.
    pub anaesthetic_complications_details: String,
    /// Difficult airway.
    pub difficult_airway: YesNo,
    /// Difficult airway details.
    pub difficult_airway_details: String,
    /// Malignant hyperthermia risk.
    pub malignant_hyperthermia_risk: YesNo,
    /// Family anaesthetic problems.
    pub family_anaesthetic_problems: YesNo,
    /// Family anaesthetic details.
    pub family_anaesthetic_details: String,
    /// Smoking status.
    pub smoking_status: String,
    /// Pack years.
    pub pack_years: Option<f64>,
    /// Alcohol consumption.
    pub alcohol_consumption: String,
    /// Recreational drugs.
    pub recreational_drugs: YesNo,
    /// Recreational drugs details.
    pub recreational_drugs_details: String,
    /// Obstructive sleep apnoea.
    pub obstructive_sleep_apnoea: YesNo,
    /// Anaesthetic preference.
    pub anaesthetic_preference: String,
}

/// Step 8 — Photography & Documentation.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhotographyDocumentation {
    /// Clinical photos taken.
    pub clinical_photos_taken: YesNo,
    /// Photo consent obtained.
    pub photo_consent_obtained: YesNo,
    /// Number of photos.
    pub number_of_photos: Option<i32>,
    /// Photo views taken.
    pub photo_views_taken: String,
    /// Standardised views.
    pub standardised_views: YesNo,
    /// Measurements recorded.
    pub measurements_recorded: YesNo,
    /// Measurement details.
    pub measurement_details: String,
    /// Diagrams drawn.
    pub diagrams_drawn: YesNo,
    /// Diagram notes.
    pub diagram_notes: String,
    /// Previous imaging.
    pub previous_imaging: YesNo,
    /// Previous imaging type.
    pub previous_imaging_type: String,
    /// Previous imaging findings.
    pub previous_imaging_findings: String,
}

/// A single drug-allergy entry within Step 9.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Allergy {
    /// Allergen.
    pub allergen: String,
    /// Reaction.
    pub reaction: String,
    /// Severity.
    pub severity: String,
}

/// Step 9 — Current Medications & Allergies.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationsAllergies {
    /// On anticoagulants.
    pub on_anticoagulants: YesNo,
    /// Anticoagulant details.
    pub anticoagulant_details: String,
    /// On antiplatelets.
    pub on_antiplatelets: YesNo,
    /// Antiplatelet details.
    pub antiplatelet_details: String,
    /// On steroids.
    pub on_steroids: YesNo,
    /// Steroid details.
    pub steroid_details: String,
    /// On immunosuppressants.
    pub on_immunosuppressants: YesNo,
    /// Immunosuppressant details.
    pub immunosuppressant_details: String,
    /// On chemotherapy.
    pub on_chemotherapy: YesNo,
    /// Chemotherapy details.
    pub chemotherapy_details: String,
    /// On hormone therapy.
    pub on_hormone_therapy: YesNo,
    /// Hormone therapy details.
    pub hormone_therapy_details: String,
    /// Other medications.
    pub other_medications: String,
    /// Has drug allergies.
    pub has_drug_allergies: YesNo,
    /// Allergies.
    pub allergies: Vec<Allergy>,
    /// Latex allergy.
    pub latex_allergy: YesNo,
    /// Adhesive allergy.
    pub adhesive_allergy: YesNo,
    /// Other allergies.
    pub other_allergies: String,
}

/// Step 10 — Procedure Planning & Consent.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProcedurePlanningConsent {
    /// Proposed procedure.
    pub proposed_procedure: String,
    /// Procedure complexity.
    pub procedure_complexity: String,
    /// Surgical approach.
    pub surgical_approach: String,
    /// Expected duration minutes.
    pub expected_duration_minutes: Option<i32>,
    /// Expected hospital stay.
    pub expected_hospital_stay: String,
    /// Flap type.
    pub flap_type: String,
    /// Implant required.
    pub implant_required: YesNo,
    /// Implant details.
    pub implant_details: String,
    /// Vte risk.
    pub vte_risk: String,
    /// Antibiotic prophylaxis.
    pub antibiotic_prophylaxis: YesNo,
    /// Anticipated risks.
    pub anticipated_risks: String,
    /// Alternative treatments.
    pub alternative_treatments: String,
    /// Consent discussion.
    pub consent_discussion: YesNo,
    /// Consent form signed.
    pub consent_form_signed: YesNo,
    /// Cooling off period offered.
    pub cooling_off_period_offered: String,
    /// Follow up plan.
    pub follow_up_plan: String,
}

/// Full Plastic Surgery Assessment record (matches front-end AssessmentData).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Reason for referral.
    pub reason_for_referral: ReasonForReferral,
    /// Medical surgical history.
    pub medical_surgical_history: MedicalSurgicalHistory,
    /// Current condition.
    pub current_condition: CurrentCondition,
    /// Wound tissue assessment.
    pub wound_tissue_assessment: WoundTissueAssessment,
    /// Psychological assessment.
    pub psychological_assessment: PsychologicalAssessment,
    /// Anaesthetic risk.
    pub anaesthetic_risk: AnaestheticRisk,
    /// Photography documentation.
    pub photography_documentation: PhotographyDocumentation,
    /// Medications allergies.
    pub medications_allergies: MedicationsAllergies,
    /// Procedure planning consent.
    pub procedure_planning_consent: ProcedurePlanningConsent,
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
    pub grade: i32,
}

/// A safety flag computed independently of grade classification.
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

/// Grading output for an assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Asa class.
    pub asa_class: Option<i32>,
    /// Wound class.
    pub wound_class: Option<i32>,
    /// Complexity score.
    pub complexity_score: Option<i32>,
    /// Overall risk.
    pub overall_risk: RiskLevel,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
