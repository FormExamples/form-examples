//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Vaccination level.
pub type VaccinationLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

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
    /// Patient age.
    pub patient_age: String,
    /// NHS number.
    pub nhs_number: String,
    /// GP practice.
    pub gp_practice: String,
    /// Contact phone.
    pub contact_phone: String,
    /// Contact email.
    pub contact_email: String,
}

// ─── Immunization History (Step 2) ──────────────────────────

/// Immunization history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ImmunizationHistory {
    /// Has vaccination record.
    pub has_vaccination_record: String,
    /// Record source.
    pub record_source: String,
    /// Last review date.
    pub last_review_date: String,
    /// Previous adverse reactions.
    pub previous_adverse_reactions: String,
    /// Adverse reaction details.
    pub adverse_reaction_details: String,
    /// Immunocompromised.
    pub immunocompromised: String,
    /// Immunocompromised details.
    pub immunocompromised_details: String,
}

// ─── Childhood Vaccinations (Step 3) ────────────────────────

/// Childhood vaccinations.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ChildhoodVaccinations {
    /// Dtap ipv hib hepb.
    pub dtap_ipv_hib_hepb: Option<u8>,
    /// Pneumococcal.
    pub pneumococcal: Option<u8>,
    /// Rotavirus.
    pub rotavirus: Option<u8>,
    /// Meningitis b.
    pub meningitis_b: Option<u8>,
    /// Mmr.
    pub mmr: Option<u8>,
    /// Hib menc.
    pub hib_menc: Option<u8>,
    /// Preschool booster.
    pub preschool_booster: Option<u8>,
}

// ─── Adult Vaccinations (Step 4) ────────────────────────────

/// Adult vaccinations.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AdultVaccinations {
    /// Td ipv booster.
    pub td_ipv_booster: Option<u8>,
    /// Hpv.
    pub hpv: Option<u8>,
    /// Meningitis acwy.
    pub meningitis_acwy: Option<u8>,
    /// Influenza annual.
    pub influenza_annual: Option<u8>,
    /// Covid19.
    pub covid19: Option<u8>,
    /// Shingles.
    pub shingles: Option<u8>,
    /// Pneumococcal ppv.
    pub pneumococcal_ppv: Option<u8>,
}

// ─── Travel Vaccinations (Step 5) ───────────────────────────

/// Travel vaccinations.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct TravelVaccinations {
    /// Travel planned.
    pub travel_planned: String,
    /// Travel destination.
    pub travel_destination: String,
    /// Hepatitis a.
    pub hepatitis_a: Option<u8>,
    /// Hepatitis b.
    pub hepatitis_b: Option<u8>,
    /// Typhoid.
    pub typhoid: Option<u8>,
    /// Yellow fever.
    pub yellow_fever: Option<u8>,
    /// Rabies.
    pub rabies: Option<u8>,
    /// Japanese encephalitis.
    pub japanese_encephalitis: Option<u8>,
}

// ─── Occupational Vaccinations (Step 6) ─────────────────────

/// Occupational vaccinations.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct OccupationalVaccinations {
    /// Occupation.
    pub occupation: String,
    /// Healthcare worker.
    pub healthcare_worker: String,
    /// Hepatitis b occupational.
    pub hepatitis_b_occupational: Option<u8>,
    /// Influenza occupational.
    pub influenza_occupational: Option<u8>,
    /// Varicella.
    pub varicella: Option<u8>,
    /// Bcg tuberculosis.
    pub bcg_tuberculosis: Option<u8>,
}

// ─── Contraindications & Allergies (Step 7) ─────────────────

/// Contraindications allergies.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ContraindicationsAllergies {
    /// Egg allergy.
    pub egg_allergy: String,
    /// Gelatin allergy.
    pub gelatin_allergy: String,
    /// Latex allergy.
    pub latex_allergy: String,
    /// Neomycin allergy.
    pub neomycin_allergy: String,
    /// Pregnant.
    pub pregnant: String,
    /// Pregnancy weeks.
    pub pregnancy_weeks: String,
    /// Severe illness.
    pub severe_illness: String,
    /// Previous anaphylaxis.
    pub previous_anaphylaxis: String,
    /// Anaphylaxis details.
    pub anaphylaxis_details: String,
}

// ─── Consent & Information (Step 8) ─────────────────────────

/// Consent information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ConsentInformation {
    /// Information provided.
    pub information_provided: Option<u8>,
    /// Risks explained.
    pub risks_explained: Option<u8>,
    /// Benefits explained.
    pub benefits_explained: Option<u8>,
    /// Questions answered.
    pub questions_answered: Option<u8>,
    /// Consent given.
    pub consent_given: String,
    /// Consent date.
    pub consent_date: String,
    /// Guardian consent.
    pub guardian_consent: String,
}

// ─── Administration Record (Step 9) ─────────────────────────

/// Administration record.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AdministrationRecord {
    /// Vaccine name.
    pub vaccine_name: String,
    /// Batch number.
    pub batch_number: String,
    /// Expiry date.
    pub expiry_date: String,
    /// Administration site.
    pub administration_site: String,
    /// Administration route.
    pub administration_route: String,
    /// Dose number.
    pub dose_number: String,
    /// Administered by.
    pub administered_by: String,
    /// Administration date.
    pub administration_date: String,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Post vaccination observation.
    pub post_vaccination_observation: Option<u8>,
    /// Immediate reaction.
    pub immediate_reaction: String,
    /// Reaction details.
    pub reaction_details: String,
    /// Next dose due.
    pub next_dose_due: String,
    /// Catch up schedule needed.
    pub catch_up_schedule_needed: String,
    /// Referral needed.
    pub referral_needed: String,
    /// Clinician notes.
    pub clinician_notes: String,
    /// Reviewing clinician.
    pub reviewing_clinician: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Immunization history.
    pub immunization_history: ImmunizationHistory,
    /// Childhood vaccinations.
    pub childhood_vaccinations: ChildhoodVaccinations,
    /// Adult vaccinations.
    pub adult_vaccinations: AdultVaccinations,
    /// Travel vaccinations.
    pub travel_vaccinations: TravelVaccinations,
    /// Occupational vaccinations.
    pub occupational_vaccinations: OccupationalVaccinations,
    /// Contraindications allergies.
    pub contraindications_allergies: ContraindicationsAllergies,
    /// Consent information.
    pub consent_information: ConsentInformation,
    /// Administration record.
    pub administration_record: AdministrationRecord,
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
    /// Vaccination level.
    pub vaccination_level: VaccinationLevel,
    /// Vaccination score.
    pub vaccination_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
