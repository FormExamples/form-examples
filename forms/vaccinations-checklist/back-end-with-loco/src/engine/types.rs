//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Yes no unknown.
pub type YesNoUnknown = String;
/// Sex.
pub type Sex = String;
/// Compliance status.
pub type ComplianceStatus = String;
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
    pub sex: Sex,
    /// Weight.
    pub weight: Option<f64>,
    /// Height.
    pub height: Option<f64>,
    /// BMI.
    pub bmi: Option<f64>,
    /// Occupation.
    pub occupation: String,
    /// Occupation category.
    pub occupation_category: String,
    /// Employer.
    pub employer: String,
}

/// Step 2 — Vaccination History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VaccinationHistory {
    /// Has vaccination record.
    pub has_vaccination_record: YesNo,
    /// Record source.
    pub record_source: String,
    /// Record source other.
    pub record_source_other: String,
    /// Previous adverse reaction.
    pub previous_adverse_reaction: YesNo,
    /// Adverse reaction details.
    pub adverse_reaction_details: String,
    /// Adverse reaction vaccine.
    pub adverse_reaction_vaccine: String,
    /// Adverse reaction severity.
    pub adverse_reaction_severity: String,
    /// Immunocompromised.
    pub immunocompromised: YesNo,
    /// Immunocompromised details.
    pub immunocompromised_details: String,
    /// Pregnant or planning.
    pub pregnant_or_planning: String,
}

/// Step 3 — Childhood Immunisations.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChildhoodImmunisations {
    /// Mmr dose1.
    pub mmr_dose1: YesNoUnknown,
    /// Mmr dose1 date.
    pub mmr_dose1_date: String,
    /// Mmr dose2.
    pub mmr_dose2: YesNoUnknown,
    /// Mmr dose2 date.
    pub mmr_dose2_date: String,
    /// Dtp primary course.
    pub dtp_primary_course: YesNoUnknown,
    /// Dtp primary date.
    pub dtp_primary_date: String,
    /// Dtp booster.
    pub dtp_booster: YesNoUnknown,
    /// Dtp booster date.
    pub dtp_booster_date: String,
    /// Polio primary course.
    pub polio_primary_course: YesNoUnknown,
    /// Polio primary date.
    pub polio_primary_date: String,
    /// Polio booster.
    pub polio_booster: YesNoUnknown,
    /// Polio booster date.
    pub polio_booster_date: String,
    /// Hib vaccine.
    pub hib_vaccine: YesNoUnknown,
    /// Hib vaccine date.
    pub hib_vaccine_date: String,
    /// Men c vaccine.
    #[serde(rename = "menCVaccine")]
    pub men_c_vaccine: YesNoUnknown,
    /// Men c vaccine date.
    #[serde(rename = "menCVaccineDate")]
    pub men_c_vaccine_date: String,
    /// Men acwy vaccine.
    #[serde(rename = "menACWYVaccine")]
    pub men_acwy_vaccine: YesNoUnknown,
    /// Men acwy vaccine date.
    #[serde(rename = "menACWYVaccineDate")]
    pub men_acwy_vaccine_date: String,
    /// Pcv vaccine.
    pub pcv_vaccine: YesNoUnknown,
    /// Pcv vaccine date.
    pub pcv_vaccine_date: String,
    /// Notes.
    pub notes: String,
}

/// Step 4 — Occupational Vaccines.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OccupationalVaccines {
    /// Hepatitis b course.
    pub hepatitis_b_course: YesNoUnknown,
    /// Hepatitis b course date.
    pub hepatitis_b_course_date: String,
    /// Hepatitis b doses received.
    pub hepatitis_b_doses_received: Option<i32>,
    /// Hepatitis b anti body level.
    pub hepatitis_b_anti_body_level: String,
    /// Bcg vaccine.
    pub bcg_vaccine: YesNoUnknown,
    /// Bcg vaccine date.
    pub bcg_vaccine_date: String,
    /// Bcg scar present.
    pub bcg_scar_present: YesNo,
    /// Varicella vaccine.
    pub varicella_vaccine: YesNoUnknown,
    /// Varicella vaccine date.
    pub varicella_vaccine_date: String,
    /// Varicella history.
    pub varicella_history: YesNoUnknown,
    /// Hepatitis a vaccine.
    pub hepatitis_a_vaccine: YesNoUnknown,
    /// Hepatitis a vaccine date.
    pub hepatitis_a_vaccine_date: String,
    /// Typhoid vaccine.
    pub typhoid_vaccine: YesNoUnknown,
    /// Typhoid vaccine date.
    pub typhoid_vaccine_date: String,
    /// Rabies vaccine.
    pub rabies_vaccine: YesNoUnknown,
    /// Rabies vaccine date.
    pub rabies_vaccine_date: String,
    /// Notes.
    pub notes: String,
}

/// Step 5 — Travel Vaccines.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TravelVaccines {
    /// Travel planned.
    pub travel_planned: YesNo,
    /// Travel destination.
    pub travel_destination: String,
    /// Travel departure date.
    pub travel_departure_date: String,
    /// Travel return date.
    pub travel_return_date: String,
    /// Yellow fever vaccine.
    pub yellow_fever_vaccine: YesNoUnknown,
    /// Yellow fever vaccine date.
    pub yellow_fever_vaccine_date: String,
    /// Yellow fever certificate.
    pub yellow_fever_certificate: YesNo,
    /// Japanese encephalitis vaccine.
    pub japanese_encephalitis_vaccine: YesNoUnknown,
    /// Japanese encephalitis date.
    pub japanese_encephalitis_date: String,
    /// Tick borne encephalitis vaccine.
    pub tick_borne_encephalitis_vaccine: YesNoUnknown,
    /// Tick borne encephalitis date.
    pub tick_borne_encephalitis_date: String,
    /// Cholera vaccine.
    pub cholera_vaccine: YesNoUnknown,
    /// Cholera vaccine date.
    pub cholera_vaccine_date: String,
    /// Meningococcal acwy travel.
    #[serde(rename = "meningococcalACWYTravel")]
    pub meningococcal_acwy_travel: YesNoUnknown,
    /// Meningococcal acwy travel date.
    #[serde(rename = "meningococcalACWYTravelDate")]
    pub meningococcal_acwy_travel_date: String,
    /// Malaria prophylaxis.
    pub malaria_prophylaxis: String,
    /// Malaria prophylaxis drug.
    pub malaria_prophylaxis_drug: String,
    /// Notes.
    pub notes: String,
}

/// Step 6 — COVID-19 Vaccination.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Covid19Vaccination {
    /// Covid primary course.
    pub covid_primary_course: YesNoUnknown,
    /// Covid primary vaccine type.
    pub covid_primary_vaccine_type: String,
    /// Covid dose1 date.
    pub covid_dose1_date: String,
    /// Covid dose2 date.
    pub covid_dose2_date: String,
    /// Covid booster1.
    pub covid_booster1: YesNo,
    /// Covid booster1 date.
    pub covid_booster1_date: String,
    /// Covid booster1 type.
    pub covid_booster1_type: String,
    /// Covid booster2.
    pub covid_booster2: YesNo,
    /// Covid booster2 date.
    pub covid_booster2_date: String,
    /// Covid booster2 type.
    pub covid_booster2_type: String,
    /// Covid autumn booster.
    pub covid_autumn_booster: YesNo,
    /// Covid autumn booster date.
    pub covid_autumn_booster_date: String,
    /// Total covid doses.
    pub total_covid_doses: Option<i32>,
    /// Covid adverse reaction.
    pub covid_adverse_reaction: YesNo,
    /// Covid adverse reaction details.
    pub covid_adverse_reaction_details: String,
    /// Notes.
    pub notes: String,
}

/// Step 7 — Influenza Vaccination.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InfluenzaVaccination {
    /// Flu vaccine current season.
    pub flu_vaccine_current_season: YesNo,
    /// Flu vaccine current date.
    pub flu_vaccine_current_date: String,
    /// Flu vaccine type.
    pub flu_vaccine_type: String,
    /// Flu vaccine previous season.
    pub flu_vaccine_previous_season: YesNoUnknown,
    /// Flu vaccine annual recipient.
    pub flu_vaccine_annual_recipient: YesNo,
    /// Flu high risk group.
    pub flu_high_risk_group: YesNo,
    /// Flu high risk reason.
    pub flu_high_risk_reason: String,
    /// Flu adverse reaction.
    pub flu_adverse_reaction: YesNo,
    /// Flu adverse reaction details.
    pub flu_adverse_reaction_details: String,
    /// Notes.
    pub notes: String,
}

/// Step 8 — Contraindications & Allergies.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContraindicationsAllergies {
    /// Egg allergy.
    pub egg_allergy: YesNo,
    /// Egg allergy severity.
    pub egg_allergy_severity: String,
    /// Gelatin allergy.
    pub gelatin_allergy: YesNo,
    /// Neomycin allergy.
    pub neomycin_allergy: YesNo,
    /// Latex allergy.
    pub latex_allergy: YesNo,
    /// Yeast allergy.
    pub yeast_allergy: YesNo,
    /// Peg polysorbate allergy.
    pub peg_polysorbate_allergy: YesNo,
    /// Other vaccine allergies.
    pub other_vaccine_allergies: String,
    /// History of gbs.
    #[serde(rename = "historyOfGBS")]
    pub history_of_gbs: YesNo,
    /// Gbs details.
    pub gbs_details: String,
    /// On immunosuppressants.
    pub on_immunosuppressants: YesNo,
    /// Immunosuppressant details.
    pub immunosuppressant_details: String,
    /// On blood products recent.
    pub on_blood_products_recent: YesNo,
    /// Blood products details.
    pub blood_products_details: String,
    /// Live vaccine contraindicated.
    pub live_vaccine_contraindicated: YesNo,
    /// Live vaccine contraindication reason.
    pub live_vaccine_contraindication_reason: String,
    /// Notes.
    pub notes: String,
}

/// Step 9 — Serology & Immunity Testing.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SerologyImmunityTesting {
    /// Hep b surface antibody.
    pub hep_b_surface_antibody: String,
    /// Hep b surface antibody level.
    pub hep_b_surface_antibody_level: Option<f64>,
    /// Hep b surface antibody date.
    pub hep_b_surface_antibody_date: String,
    /// Varicella ig g.
    #[serde(rename = "varicellaIgG")]
    pub varicella_ig_g: String,
    /// Varicella ig g date.
    #[serde(rename = "varicellaIgGDate")]
    pub varicella_ig_g_date: String,
    /// Measles ig g.
    #[serde(rename = "measlesIgG")]
    pub measles_ig_g: String,
    /// Measles ig g date.
    #[serde(rename = "measlesIgGDate")]
    pub measles_ig_g_date: String,
    /// Rubella ig g.
    #[serde(rename = "rubellaIgG")]
    pub rubella_ig_g: String,
    /// Rubella ig g date.
    #[serde(rename = "rubellaIgGDate")]
    pub rubella_ig_g_date: String,
    /// Mumps ig g.
    #[serde(rename = "mumpsIgG")]
    pub mumps_ig_g: String,
    /// Mumps ig g date.
    #[serde(rename = "mumpsIgGDate")]
    pub mumps_ig_g_date: String,
    /// Hep a ig g.
    #[serde(rename = "hepAIgG")]
    pub hep_a_ig_g: String,
    /// Hep a ig g date.
    #[serde(rename = "hepAIgGDate")]
    pub hep_a_ig_g_date: String,
    /// Tetanus antibody.
    pub tetanus_antibody: String,
    /// Tetanus antibody date.
    pub tetanus_antibody_date: String,
    /// Tb igra result.
    #[serde(rename = "tbIGRAResult")]
    pub tb_igra_result: String,
    /// Tb igra date.
    #[serde(rename = "tbIGRADate")]
    pub tb_igra_date: String,
    /// Mantoux result.
    pub mantoux_result: String,
    /// Mantoux induration mm.
    pub mantoux_induration_mm: Option<f64>,
    /// Notes.
    pub notes: String,
}

/// Step 10 — Schedule & Compliance.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScheduleCompliance {
    /// Compliance status.
    pub compliance_status: String,
    /// Vaccines due.
    pub vaccines_due: String,
    /// Vaccines overdue.
    pub vaccines_overdue: String,
    /// Catch up plan required.
    pub catch_up_plan_required: YesNo,
    /// Catch up plan details.
    pub catch_up_plan_details: String,
    /// Next vaccination date.
    pub next_vaccination_date: String,
    /// Next vaccination type.
    pub next_vaccination_type: String,
    /// Occupational health clearance.
    pub occupational_health_clearance: String,
    /// Occupational health clearance date.
    pub occupational_health_clearance_date: String,
    /// Exposure risk level.
    pub exposure_risk_level: String,
    /// Active exposure incident.
    pub active_exposure_incident: YesNo,
    /// Active exposure details.
    pub active_exposure_details: String,
    /// Consent for vaccination.
    pub consent_for_vaccination: YesNo,
    /// Consent date.
    pub consent_date: String,
    /// Notes.
    pub notes: String,
}

/// Full Vaccinations Checklist assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Vaccination history.
    pub vaccination_history: VaccinationHistory,
    /// Childhood immunisations.
    pub childhood_immunisations: ChildhoodImmunisations,
    /// Occupational vaccines.
    pub occupational_vaccines: OccupationalVaccines,
    /// Travel vaccines.
    pub travel_vaccines: TravelVaccines,
    /// Covid19 vaccination.
    pub covid19_vaccination: Covid19Vaccination,
    /// Influenza vaccination.
    pub influenza_vaccination: InfluenzaVaccination,
    /// Contraindications allergies.
    pub contraindications_allergies: ContraindicationsAllergies,
    /// Serology immunity testing.
    pub serology_immunity_testing: SerologyImmunityTesting,
    /// Schedule compliance.
    pub schedule_compliance: ScheduleCompliance,
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
    pub grade: u32,
}

/// A safety flag (real-time alert).
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

/// Grading output for a vaccinations checklist.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Compliance status.
    pub compliance_status: ComplianceStatus,
    /// Overall risk.
    pub overall_risk: RiskLevel,
    /// Childhood complete.
    pub childhood_complete: bool,
    /// Occupational complete.
    pub occupational_complete: bool,
    /// Covid complete.
    pub covid_complete: bool,
    /// Flu current.
    pub flu_current: bool,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Missing vaccinations.
    pub missing_vaccinations: Vec<String>,
    /// Timestamp.
    pub timestamp: String,
}
