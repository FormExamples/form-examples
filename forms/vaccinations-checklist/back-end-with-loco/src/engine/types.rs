use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type YesNoUnknown = String;
pub type Sex = String;
pub type ComplianceStatus = String;
pub type RiskLevel = String;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: Sex,
    pub weight: Option<f64>,
    pub height: Option<f64>,
    pub bmi: Option<f64>,
    pub occupation: String,
    pub occupation_category: String,
    pub employer: String,
}

/// Step 2 — Vaccination History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VaccinationHistory {
    pub has_vaccination_record: YesNo,
    pub record_source: String,
    pub record_source_other: String,
    pub previous_adverse_reaction: YesNo,
    pub adverse_reaction_details: String,
    pub adverse_reaction_vaccine: String,
    pub adverse_reaction_severity: String,
    pub immunocompromised: YesNo,
    pub immunocompromised_details: String,
    pub pregnant_or_planning: String,
}

/// Step 3 — Childhood Immunisations.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChildhoodImmunisations {
    pub mmr_dose1: YesNoUnknown,
    pub mmr_dose1_date: String,
    pub mmr_dose2: YesNoUnknown,
    pub mmr_dose2_date: String,
    pub dtp_primary_course: YesNoUnknown,
    pub dtp_primary_date: String,
    pub dtp_booster: YesNoUnknown,
    pub dtp_booster_date: String,
    pub polio_primary_course: YesNoUnknown,
    pub polio_primary_date: String,
    pub polio_booster: YesNoUnknown,
    pub polio_booster_date: String,
    pub hib_vaccine: YesNoUnknown,
    pub hib_vaccine_date: String,
    #[serde(rename = "menCVaccine")]
    pub men_c_vaccine: YesNoUnknown,
    #[serde(rename = "menCVaccineDate")]
    pub men_c_vaccine_date: String,
    #[serde(rename = "menACWYVaccine")]
    pub men_acwy_vaccine: YesNoUnknown,
    #[serde(rename = "menACWYVaccineDate")]
    pub men_acwy_vaccine_date: String,
    pub pcv_vaccine: YesNoUnknown,
    pub pcv_vaccine_date: String,
    pub notes: String,
}

/// Step 4 — Occupational Vaccines.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OccupationalVaccines {
    pub hepatitis_b_course: YesNoUnknown,
    pub hepatitis_b_course_date: String,
    pub hepatitis_b_doses_received: Option<i32>,
    pub hepatitis_b_anti_body_level: String,
    pub bcg_vaccine: YesNoUnknown,
    pub bcg_vaccine_date: String,
    pub bcg_scar_present: YesNo,
    pub varicella_vaccine: YesNoUnknown,
    pub varicella_vaccine_date: String,
    pub varicella_history: YesNoUnknown,
    pub hepatitis_a_vaccine: YesNoUnknown,
    pub hepatitis_a_vaccine_date: String,
    pub typhoid_vaccine: YesNoUnknown,
    pub typhoid_vaccine_date: String,
    pub rabies_vaccine: YesNoUnknown,
    pub rabies_vaccine_date: String,
    pub notes: String,
}

/// Step 5 — Travel Vaccines.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TravelVaccines {
    pub travel_planned: YesNo,
    pub travel_destination: String,
    pub travel_departure_date: String,
    pub travel_return_date: String,
    pub yellow_fever_vaccine: YesNoUnknown,
    pub yellow_fever_vaccine_date: String,
    pub yellow_fever_certificate: YesNo,
    pub japanese_encephalitis_vaccine: YesNoUnknown,
    pub japanese_encephalitis_date: String,
    pub tick_borne_encephalitis_vaccine: YesNoUnknown,
    pub tick_borne_encephalitis_date: String,
    pub cholera_vaccine: YesNoUnknown,
    pub cholera_vaccine_date: String,
    #[serde(rename = "meningococcalACWYTravel")]
    pub meningococcal_acwy_travel: YesNoUnknown,
    #[serde(rename = "meningococcalACWYTravelDate")]
    pub meningococcal_acwy_travel_date: String,
    pub malaria_prophylaxis: String,
    pub malaria_prophylaxis_drug: String,
    pub notes: String,
}

/// Step 6 — COVID-19 Vaccination.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Covid19Vaccination {
    pub covid_primary_course: YesNoUnknown,
    pub covid_primary_vaccine_type: String,
    pub covid_dose1_date: String,
    pub covid_dose2_date: String,
    pub covid_booster1: YesNo,
    pub covid_booster1_date: String,
    pub covid_booster1_type: String,
    pub covid_booster2: YesNo,
    pub covid_booster2_date: String,
    pub covid_booster2_type: String,
    pub covid_autumn_booster: YesNo,
    pub covid_autumn_booster_date: String,
    pub total_covid_doses: Option<i32>,
    pub covid_adverse_reaction: YesNo,
    pub covid_adverse_reaction_details: String,
    pub notes: String,
}

/// Step 7 — Influenza Vaccination.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InfluenzaVaccination {
    pub flu_vaccine_current_season: YesNo,
    pub flu_vaccine_current_date: String,
    pub flu_vaccine_type: String,
    pub flu_vaccine_previous_season: YesNoUnknown,
    pub flu_vaccine_annual_recipient: YesNo,
    pub flu_high_risk_group: YesNo,
    pub flu_high_risk_reason: String,
    pub flu_adverse_reaction: YesNo,
    pub flu_adverse_reaction_details: String,
    pub notes: String,
}

/// Step 8 — Contraindications & Allergies.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContraindicationsAllergies {
    pub egg_allergy: YesNo,
    pub egg_allergy_severity: String,
    pub gelatin_allergy: YesNo,
    pub neomycin_allergy: YesNo,
    pub latex_allergy: YesNo,
    pub yeast_allergy: YesNo,
    pub peg_polysorbate_allergy: YesNo,
    pub other_vaccine_allergies: String,
    #[serde(rename = "historyOfGBS")]
    pub history_of_gbs: YesNo,
    pub gbs_details: String,
    pub on_immunosuppressants: YesNo,
    pub immunosuppressant_details: String,
    pub on_blood_products_recent: YesNo,
    pub blood_products_details: String,
    pub live_vaccine_contraindicated: YesNo,
    pub live_vaccine_contraindication_reason: String,
    pub notes: String,
}

/// Step 9 — Serology & Immunity Testing.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SerologyImmunityTesting {
    pub hep_b_surface_antibody: String,
    pub hep_b_surface_antibody_level: Option<f64>,
    pub hep_b_surface_antibody_date: String,
    #[serde(rename = "varicellaIgG")]
    pub varicella_ig_g: String,
    #[serde(rename = "varicellaIgGDate")]
    pub varicella_ig_g_date: String,
    #[serde(rename = "measlesIgG")]
    pub measles_ig_g: String,
    #[serde(rename = "measlesIgGDate")]
    pub measles_ig_g_date: String,
    #[serde(rename = "rubellaIgG")]
    pub rubella_ig_g: String,
    #[serde(rename = "rubellaIgGDate")]
    pub rubella_ig_g_date: String,
    #[serde(rename = "mumpsIgG")]
    pub mumps_ig_g: String,
    #[serde(rename = "mumpsIgGDate")]
    pub mumps_ig_g_date: String,
    #[serde(rename = "hepAIgG")]
    pub hep_a_ig_g: String,
    #[serde(rename = "hepAIgGDate")]
    pub hep_a_ig_g_date: String,
    pub tetanus_antibody: String,
    pub tetanus_antibody_date: String,
    #[serde(rename = "tbIGRAResult")]
    pub tb_igra_result: String,
    #[serde(rename = "tbIGRADate")]
    pub tb_igra_date: String,
    pub mantoux_result: String,
    pub mantoux_induration_mm: Option<f64>,
    pub notes: String,
}

/// Step 10 — Schedule & Compliance.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScheduleCompliance {
    pub compliance_status: String,
    pub vaccines_due: String,
    pub vaccines_overdue: String,
    pub catch_up_plan_required: YesNo,
    pub catch_up_plan_details: String,
    pub next_vaccination_date: String,
    pub next_vaccination_type: String,
    pub occupational_health_clearance: String,
    pub occupational_health_clearance_date: String,
    pub exposure_risk_level: String,
    pub active_exposure_incident: YesNo,
    pub active_exposure_details: String,
    pub consent_for_vaccination: YesNo,
    pub consent_date: String,
    pub notes: String,
}

/// Full Vaccinations Checklist assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub vaccination_history: VaccinationHistory,
    pub childhood_immunisations: ChildhoodImmunisations,
    pub occupational_vaccines: OccupationalVaccines,
    pub travel_vaccines: TravelVaccines,
    pub covid19_vaccination: Covid19Vaccination,
    pub influenza_vaccination: InfluenzaVaccination,
    pub contraindications_allergies: ContraindicationsAllergies,
    pub serology_immunity_testing: SerologyImmunityTesting,
    pub schedule_compliance: ScheduleCompliance,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub grade: u32,
}

/// A safety flag (real-time alert).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a vaccinations checklist.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub compliance_status: ComplianceStatus,
    pub overall_risk: RiskLevel,
    pub childhood_complete: bool,
    pub occupational_complete: bool,
    pub covid_complete: bool,
    pub flu_current: bool,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub missing_vaccinations: Vec<String>,
    pub timestamp: String,
}
