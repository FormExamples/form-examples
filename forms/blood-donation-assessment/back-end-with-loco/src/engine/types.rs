use serde::{Deserialize, Serialize};

// Type aliases matching the front-end union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<f64>` / `Option<i32>` with None indicates an unanswered numeric.
pub type YesNo = String;
pub type EligibilityStatus = String;

/// Step 1 — Donor demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DonorDemographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub weight: Option<f64>,
    pub height: Option<f64>,
    pub donor_type: String,
    pub last_donation_date: String,
}

/// Step 2 — General health & wellbeing.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GeneralHealth {
    pub feeling_well_today: YesNo,
    pub adequate_sleep: YesNo,
    pub adequate_meal_and_fluids: YesNo,
    pub feeling_faint_or_unwell: YesNo,
}

/// Single medication entry within `current_medications`.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    pub name: String,
    pub reason: String,
}

/// Step 3 — Medical history (chronic conditions, medications).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    pub heart_or_circulatory_disease: YesNo,
    pub cancer: YesNo,
    pub bleeding_or_clotting_disorder: YesNo,
    pub diabetes_on_insulin: YesNo,
    pub epilepsy_or_seizures: YesNo,
    pub hiv_positive: YesNo,
    pub hepatitis_b_or_c: YesNo,
    pub htlv: YesNo,
    pub cjd_family_history: YesNo,
    pub received_pituitary_hormone: YesNo,
    pub received_dura_mater_graft: YesNo,
    pub current_medications: Vec<Medication>,
}

/// Step 4 — Recent illness & infections.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecentIllness {
    pub fever_past_two_weeks: YesNo,
    pub infection_past_two_weeks: YesNo,
    pub antibiotics_past_seven_days: YesNo,
    pub dental_work_past_week: YesNo,
    pub surgery_past_six_months: YesNo,
    pub covid_positive_past_twenty_eight_days: YesNo,
    pub vaccination_past_four_weeks: YesNo,
    pub vaccination_details: String,
}

/// Recent-travel itinerary row.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TravelEntry {
    pub country: String,
    pub return_date: String,
    pub duration: String,
}

/// Step 5 — Travel history (malaria, WNV, vCJD risk areas).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TravelHistory {
    pub recent_travel: Vec<TravelEntry>,
    pub malaria_area_past_twelve_months: YesNo,
    pub west_nile_virus_area_past_twenty_eight_days: YesNo,
    pub uk_residence_1980_to_1996_over_12_months: YesNo,
    pub blood_transfusion_in_uk: YesNo,
}

/// Step 6 — Lifestyle & risk behaviours.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LifestyleRisk {
    pub iv_drug_use_ever: YesNo,
    pub sex_with_iv_drug_user: YesNo,
    pub sex_in_exchange_past_twelve_months: YesNo,
    pub sex_with_new_partner_past_three_months: YesNo,
    pub multiple_sexual_partners_past_three_months: YesNo,
    pub tattoo_or_piercing_past_four_months: YesNo,
    pub acupuncture_past_four_months: YesNo,
    pub body_or_ear_piercing_past_four_months: YesNo,
    pub incarcerated_past_twelve_months: YesNo,
}

/// Step 7 — Pregnancy & transfusion history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PregnancyTransfusion {
    pub currently_pregnant: YesNo,
    pub pregnancy_past_six_months: YesNo,
    pub breastfeeding: YesNo,
    pub received_transfusion_ever: YesNo,
    pub last_transfusion_date: String,
    pub received_transplant_ever: YesNo,
}

/// Step 8 — Vital signs (Hb, blood pressure, pulse, temperature).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VitalSigns {
    pub hemoglobin: Option<f64>,
    pub systolic_bp: Option<i32>,
    pub diastolic_bp: Option<i32>,
    pub pulse_bpm: Option<i32>,
    pub temperature_celsius: Option<f64>,
}

/// Step 9 — Informed consent.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InformedConsent {
    pub understood_information: YesNo,
    pub consent_to_donate: YesNo,
    pub consent_to_testing: YesNo,
    pub consent_to_contact: YesNo,
}

/// Step 10 — Donation plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DonationPlan {
    pub planned_donation_type: String,
    pub preferred_donation_date: String,
    pub session: String,
    pub notes: String,
}

/// Complete blood-donation assessment payload.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub donor_demographics: DonorDemographics,
    pub general_health: GeneralHealth,
    pub medical_history: MedicalHistory,
    pub recent_illness: RecentIllness,
    pub travel_history: TravelHistory,
    pub lifestyle_risk: LifestyleRisk,
    pub pregnancy_transfusion: PregnancyTransfusion,
    pub vital_signs: VitalSigns,
    pub informed_consent: InformedConsent,
    pub donation_plan: DonationPlan,
}

/// A DSG rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub status: EligibilityStatus,
    /// Present only for temporary deferrals.
    pub deferral_window: String,
}

/// A clinician-facing safety flag computed independently of overall status.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    /// `urgent` > `high` > `medium` > `low`.
    pub priority: String,
}

/// Final grading output for a Blood Donation Assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub eligibility_status: EligibilityStatus,
    pub deferral_window: String,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub answered_count: u32,
    pub timestamp: String,
}
