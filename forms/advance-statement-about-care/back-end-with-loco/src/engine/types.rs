//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Completeness status.
pub type CompletenessStatus = String;

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
    /// Postcode.
    pub postcode: String,
    /// Telephone.
    pub telephone: String,
    /// Email.
    pub email: String,
    /// GP name.
    pub gp_name: String,
    /// GP practice.
    pub gp_practice: String,
}

// ─── Personal Values & Beliefs (Step 2) ───────────────────

/// Personal values.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PersonalValues {
    /// Important to me.
    pub important_to_me: String,
    /// Quality of life factors.
    pub quality_of_life_factors: String,
    /// Unacceptable outcomes.
    pub unacceptable_outcomes: String,
    /// Religious belief.
    pub religious_belief: String,
    /// Cultural considerations.
    pub cultural_considerations: String,
    /// Personal philosophy.
    pub personal_philosophy: String,
}

// ─── Care Preferences (Step 3) ────────────────────────────

/// Care preferences.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CarePreferences {
    /// Preferred care location.
    pub preferred_care_location: String,
    /// Pain management preference.
    pub pain_management_preference: String,
    /// Treatment goals.
    pub treatment_goals: String,
    /// Resuscitation wishes.
    pub resuscitation_wishes: String,
    /// Artificial nutrition view.
    pub artificial_nutrition_view: String,
    /// Ventilation view.
    pub ventilation_view: String,
}

// ─── Communication Preferences (Step 4) ───────────────────

/// Communication preferences.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CommunicationPreferences {
    /// Preferred language.
    pub preferred_language: String,
    /// Interpreter needed.
    pub interpreter_needed: String,
    /// Communication aids.
    pub communication_aids: String,
    /// Information sharing wishes.
    pub information_sharing_wishes: String,
    /// Who to inform.
    pub who_to_inform: String,
    /// How to break bad news.
    pub how_to_break_bad_news: String,
}

// ─── Daily Living Preferences (Step 5) ────────────────────

/// Daily living preferences.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DailyLivingPreferences {
    /// Routine importance.
    pub routine_importance: Option<u8>,
    /// Food preferences.
    pub food_preferences: String,
    /// Personal care wishes.
    pub personal_care_wishes: String,
    /// Clothing preferences.
    pub clothing_preferences: String,
    /// Social activities.
    pub social_activities: String,
    /// Pet considerations.
    pub pet_considerations: String,
}

// ─── Spiritual & Cultural Wishes (Step 6) ─────────────────

/// Spiritual cultural.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SpiritualCultural {
    /// Religious practices.
    pub religious_practices: String,
    /// Spiritual support.
    pub spiritual_support: String,
    /// Specific rituals.
    pub specific_rituals: String,
    /// Dietary restrictions.
    pub dietary_restrictions: String,
    /// Cultural practices.
    pub cultural_practices: String,
    /// Chaplain visit.
    pub chaplain_visit: String,
}

// ─── Nominated Persons (Step 7) ───────────────────────────

/// Nominated persons.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct NominatedPersons {
    /// Primary contact name.
    pub primary_contact_name: String,
    /// Primary contact relationship.
    pub primary_contact_relationship: String,
    /// Primary contact phone.
    pub primary_contact_phone: String,
    /// Secondary contact name.
    pub secondary_contact_name: String,
    /// Secondary contact relationship.
    pub secondary_contact_relationship: String,
    /// Secondary contact phone.
    pub secondary_contact_phone: String,
    /// Has LPA.
    pub has_lpa: String,
    /// LPA details.
    pub lpa_details: String,
}

// ─── End of Life Preferences (Step 8) ─────────────────────

/// End of life preferences.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct EndOfLifePreferences {
    /// Preferred place of death.
    pub preferred_place_of_death: String,
    /// Organ donation.
    pub organ_donation: String,
    /// Funeral wishes.
    pub funeral_wishes: String,
    /// After death wishes.
    pub after_death_wishes: String,
    /// Music or comfort.
    pub music_or_comfort: String,
    /// Who should be present.
    pub who_should_be_present: String,
}

// ─── Healthcare Professional Review (Step 9) ──────────────

/// Healthcare professional review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct HealthcareProfessionalReview {
    /// Reviewer name.
    pub reviewer_name: String,
    /// Reviewer role.
    pub reviewer_role: String,
    /// Review date.
    pub review_date: String,
    /// Capacity confirmed.
    pub capacity_confirmed: String,
    /// Discussion notes.
    pub discussion_notes: String,
    /// Statement accurate.
    pub statement_accurate: String,
}

// ─── Signatures & Verification (Step 10) ──────────────────

/// Signatures verification.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SignaturesVerification {
    /// Patient signature.
    pub patient_signature: String,
    /// Patient signature date.
    pub patient_signature_date: String,
    /// Witness name.
    pub witness_name: String,
    /// Witness signature.
    pub witness_signature: String,
    /// Witness signature date.
    pub witness_signature_date: String,
    /// Reviewed with patient.
    pub reviewed_with_patient: String,
}

// ─── Assessment Data (all sections) ───────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Personal values.
    pub personal_values: PersonalValues,
    /// Care preferences.
    pub care_preferences: CarePreferences,
    /// Communication preferences.
    pub communication_preferences: CommunicationPreferences,
    /// Daily living preferences.
    pub daily_living_preferences: DailyLivingPreferences,
    /// Spiritual cultural.
    pub spiritual_cultural: SpiritualCultural,
    /// Nominated persons.
    pub nominated_persons: NominatedPersons,
    /// End of life preferences.
    pub end_of_life_preferences: EndOfLifePreferences,
    /// Healthcare professional review.
    pub healthcare_professional_review: HealthcareProfessionalReview,
    /// Signatures verification.
    pub signatures_verification: SignaturesVerification,
}

// ─── Grading types ────────────────────────────────────────

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
    /// Completeness status.
    pub completeness_status: CompletenessStatus,
    /// Sections completed.
    pub sections_completed: u32,
    /// Total sections.
    pub total_sections: u32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
