//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Satisfaction level.
pub type SatisfactionLevel = String;

// ─── Visit Information (Step 1) ─────────────────────────────

/// Visit information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct VisitInformation {
    /// Visit date.
    pub visit_date: String,
    /// Department name.
    pub department_name: String,
    /// Provider name.
    pub provider_name: String,
    /// Provider role.
    pub provider_role: String,
    /// Visit type.
    pub visit_type: String,
    /// Visit duration.
    pub visit_duration: String,
    /// Is first visit.
    pub is_first_visit: String,
    /// Referral source.
    pub referral_source: String,
}

// ─── Wait Time & Access (Step 2) ────────────────────────────

/// Wait time access.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct WaitTimeAccess {
    /// Ease of scheduling.
    pub ease_of_scheduling: Option<u8>,
    /// Appointment wait days.
    pub appointment_wait_days: String,
    /// Waiting room time.
    pub waiting_room_time: String,
    /// Wait time acceptability.
    pub wait_time_acceptability: Option<u8>,
    /// Location accessibility.
    pub location_accessibility: Option<u8>,
    /// Signage wayfinding.
    pub signage_wayfinding: Option<u8>,
}

// ─── Communication (Step 3) ─────────────────────────────────

/// Communication.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Communication {
    /// Provider listening.
    pub provider_listening: Option<u8>,
    /// Provider explaining.
    pub provider_explaining: Option<u8>,
    /// Provider respect.
    pub provider_respect: Option<u8>,
    /// Provider time adequacy.
    pub provider_time_adequacy: Option<u8>,
    /// Questions encouraged.
    pub questions_encouraged: Option<u8>,
    /// Information clarity.
    pub information_clarity: Option<u8>,
    /// Shared decision making.
    pub shared_decision_making: Option<u8>,
}

// ─── Care Quality (Step 4) ──────────────────────────────────

/// Care quality.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CareQuality {
    /// Thoroughness of examination.
    pub thoroughness_of_examination: Option<u8>,
    /// Diagnosis explanation.
    pub diagnosis_explanation: Option<u8>,
    /// Treatment plan clarity.
    pub treatment_plan_clarity: Option<u8>,
    /// Confidence in provider.
    pub confidence_in_provider: Option<u8>,
    /// Coordination of care.
    pub coordination_of_care: Option<u8>,
    /// Involvement in decisions.
    pub involvement_in_decisions: Option<u8>,
}

// ─── Staff Interaction (Step 5) ─────────────────────────────

/// Staff interaction.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct StaffInteraction {
    /// Reception courtesy.
    pub reception_courtesy: Option<u8>,
    /// Nursing responsiveness.
    pub nursing_responsiveness: Option<u8>,
    /// Staff professionalism.
    pub staff_professionalism: Option<u8>,
    /// Staff helpfulness.
    pub staff_helpfulness: Option<u8>,
    /// Privacy respected.
    pub privacy_respected: Option<u8>,
    /// Team coordination.
    pub team_coordination: Option<u8>,
}

// ─── Environment (Step 6) ───────────────────────────────────

/// Encounter environment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct EncounterEnvironment {
    /// Facility cleanliness.
    pub facility_cleanliness: Option<u8>,
    /// Facility comfort.
    pub facility_comfort: Option<u8>,
    /// Noise level.
    pub noise_level: Option<u8>,
    /// Privacy adequacy.
    pub privacy_adequacy: Option<u8>,
    /// Equipment condition.
    pub equipment_condition: Option<u8>,
    /// Overall ambience.
    pub overall_ambience: Option<u8>,
}

// ─── Medication & Treatment (Step 7) ────────────────────────

/// Medication treatment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MedicationTreatment {
    /// Medication explanation.
    pub medication_explanation: Option<u8>,
    /// Side effects explained.
    pub side_effects_explained: Option<u8>,
    /// Pain management.
    pub pain_management: Option<u8>,
    /// Treatment effectiveness.
    pub treatment_effectiveness: Option<u8>,
    /// Alternatives discussed.
    pub alternatives_discussed: Option<u8>,
    /// Medications provided.
    pub medications_provided: String,
}

// ─── Discharge & Follow-up (Step 8) ─────────────────────────

/// Discharge follow up.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DischargeFollowUp {
    /// Discharge instruction clarity.
    pub discharge_instruction_clarity: Option<u8>,
    /// Follow up plan explained.
    pub follow_up_plan_explained: Option<u8>,
    /// Self care instructions.
    pub self_care_instructions: Option<u8>,
    /// Warning signs explained.
    pub warning_signs_explained: Option<u8>,
    /// Contact information provided.
    pub contact_information_provided: Option<u8>,
    /// Follow up appointment scheduled.
    pub follow_up_appointment_scheduled: String,
}

// ─── Overall Experience (Step 9) ────────────────────────────

/// Overall experience.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct OverallExperience {
    /// Overall satisfaction.
    pub overall_satisfaction: Option<u8>,
    /// Likelihood to recommend.
    pub likelihood_to_recommend: Option<u8>,
    /// Met expectations.
    pub met_expectations: Option<u8>,
    /// Would return for care.
    pub would_return_for_care: Option<u8>,
    /// Emotional experience.
    pub emotional_experience: String,
    /// Best aspect.
    pub best_aspect: String,
    /// Worst aspect.
    pub worst_aspect: String,
}

// ─── Demographics & Comments (Step 10) ──────────────────────

/// Demographics comments.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DemographicsComments {
    /// Patient age.
    pub patient_age: String,
    /// Patient sex.
    pub patient_sex: String,
    /// Ethnicity.
    pub ethnicity: String,
    /// Has disability.
    pub has_disability: String,
    /// Is return patient.
    pub is_return_patient: String,
    /// Additional comments.
    pub additional_comments: String,
    /// Improvement suggestions.
    pub improvement_suggestions: String,
    /// Compliments.
    pub compliments: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Visit information.
    pub visit_information: VisitInformation,
    /// Wait time access.
    pub wait_time_access: WaitTimeAccess,
    /// Communication.
    pub communication: Communication,
    /// Care quality.
    pub care_quality: CareQuality,
    /// Staff interaction.
    pub staff_interaction: StaffInteraction,
    /// Environment.
    pub environment: EncounterEnvironment,
    /// Medication treatment.
    pub medication_treatment: MedicationTreatment,
    /// Discharge follow up.
    pub discharge_follow_up: DischargeFollowUp,
    /// Overall experience.
    pub overall_experience: OverallExperience,
    /// Demographics comments.
    pub demographics_comments: DemographicsComments,
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
    /// Satisfaction level.
    pub satisfaction_level: SatisfactionLevel,
    /// Satisfaction score.
    pub satisfaction_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
