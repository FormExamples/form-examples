//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the front-end union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<f64>` / `Option<i32>` with None indicates an unanswered numeric.
/// Yes no.
pub type YesNo = String;
/// Eligibility status.
pub type EligibilityStatus = String;

/// Step 1 — Donor demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DonorDemographics {
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
    /// Donor type.
    pub donor_type: String,
    /// Last donation date.
    pub last_donation_date: String,
}

/// Step 2 — General health & wellbeing.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GeneralHealth {
    /// Feeling well today.
    pub feeling_well_today: YesNo,
    /// Adequate sleep.
    pub adequate_sleep: YesNo,
    /// Adequate meal and fluids.
    pub adequate_meal_and_fluids: YesNo,
    /// Feeling faint or unwell.
    pub feeling_faint_or_unwell: YesNo,
}

/// Single medication entry within `current_medications`.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    /// Name.
    pub name: String,
    /// Reason.
    pub reason: String,
}

/// Step 3 — Medical history (chronic conditions, medications).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    /// Heart or circulatory disease.
    pub heart_or_circulatory_disease: YesNo,
    /// Cancer.
    pub cancer: YesNo,
    /// Bleeding or clotting disorder.
    pub bleeding_or_clotting_disorder: YesNo,
    /// Diabetes on insulin.
    pub diabetes_on_insulin: YesNo,
    /// Epilepsy or seizures.
    pub epilepsy_or_seizures: YesNo,
    /// Hiv positive.
    pub hiv_positive: YesNo,
    /// Hepatitis b or c.
    pub hepatitis_b_or_c: YesNo,
    /// Htlv.
    pub htlv: YesNo,
    /// Cjd family history.
    pub cjd_family_history: YesNo,
    /// Received pituitary hormone.
    pub received_pituitary_hormone: YesNo,
    /// Received dura mater graft.
    pub received_dura_mater_graft: YesNo,
    /// Current medications.
    pub current_medications: Vec<Medication>,
}

/// Step 4 — Recent illness & infections.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecentIllness {
    /// Fever past two weeks.
    pub fever_past_two_weeks: YesNo,
    /// Infection past two weeks.
    pub infection_past_two_weeks: YesNo,
    /// Antibiotics past seven days.
    pub antibiotics_past_seven_days: YesNo,
    /// Dental work past week.
    pub dental_work_past_week: YesNo,
    /// Surgery past six months.
    pub surgery_past_six_months: YesNo,
    /// Covid positive past twenty eight days.
    pub covid_positive_past_twenty_eight_days: YesNo,
    /// Vaccination past four weeks.
    pub vaccination_past_four_weeks: YesNo,
    /// Vaccination details.
    pub vaccination_details: String,
}

/// Recent-travel itinerary row.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TravelEntry {
    /// Country.
    pub country: String,
    /// Return date.
    pub return_date: String,
    /// Duration.
    pub duration: String,
}

/// Step 5 — Travel history (malaria, WNV, vCJD risk areas).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TravelHistory {
    /// Recent travel.
    pub recent_travel: Vec<TravelEntry>,
    /// Malaria area past twelve months.
    pub malaria_area_past_twelve_months: YesNo,
    /// West nile virus area past twenty eight days.
    pub west_nile_virus_area_past_twenty_eight_days: YesNo,
    /// Uk residence 1980 to 1996 over 12 months.
    pub uk_residence_1980_to_1996_over_12_months: YesNo,
    /// Blood transfusion in uk.
    pub blood_transfusion_in_uk: YesNo,
}

/// Step 6 — Lifestyle & risk behaviours.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LifestyleRisk {
    /// IV drug use ever.
    pub iv_drug_use_ever: YesNo,
    /// Sex with IV drug user.
    pub sex_with_iv_drug_user: YesNo,
    /// Sex in exchange past twelve months.
    pub sex_in_exchange_past_twelve_months: YesNo,
    /// Sex with new partner past three months.
    pub sex_with_new_partner_past_three_months: YesNo,
    /// Multiple sexual partners past three months.
    pub multiple_sexual_partners_past_three_months: YesNo,
    /// Tattoo or piercing past four months.
    pub tattoo_or_piercing_past_four_months: YesNo,
    /// Acupuncture past four months.
    pub acupuncture_past_four_months: YesNo,
    /// Body or ear piercing past four months.
    pub body_or_ear_piercing_past_four_months: YesNo,
    /// Incarcerated past twelve months.
    pub incarcerated_past_twelve_months: YesNo,
}

/// Step 7 — Pregnancy & transfusion history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PregnancyTransfusion {
    /// Currently pregnant.
    pub currently_pregnant: YesNo,
    /// Pregnancy past six months.
    pub pregnancy_past_six_months: YesNo,
    /// Breastfeeding.
    pub breastfeeding: YesNo,
    /// Received transfusion ever.
    pub received_transfusion_ever: YesNo,
    /// Last transfusion date.
    pub last_transfusion_date: String,
    /// Received transplant ever.
    pub received_transplant_ever: YesNo,
}

/// Step 8 — Vital signs (Hb, blood pressure, pulse, temperature).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VitalSigns {
    /// Hemoglobin.
    pub hemoglobin: Option<f64>,
    /// Systolic BP.
    pub systolic_bp: Option<i32>,
    /// Diastolic BP.
    pub diastolic_bp: Option<i32>,
    /// Pulse bpm.
    pub pulse_bpm: Option<i32>,
    /// Temperature celsius.
    pub temperature_celsius: Option<f64>,
}

/// Step 9 — Informed consent.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InformedConsent {
    /// Understood information.
    pub understood_information: YesNo,
    /// Consent to donate.
    pub consent_to_donate: YesNo,
    /// Consent to testing.
    pub consent_to_testing: YesNo,
    /// Consent to contact.
    pub consent_to_contact: YesNo,
}

/// Step 10 — Donation plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DonationPlan {
    /// Planned donation type.
    pub planned_donation_type: String,
    /// Preferred donation date.
    pub preferred_donation_date: String,
    /// Session.
    pub session: String,
    /// Notes.
    pub notes: String,
}

/// Complete blood-donation assessment payload.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Donor demographics.
    pub donor_demographics: DonorDemographics,
    /// General health.
    pub general_health: GeneralHealth,
    /// Medical history.
    pub medical_history: MedicalHistory,
    /// Recent illness.
    pub recent_illness: RecentIllness,
    /// Travel history.
    pub travel_history: TravelHistory,
    /// Lifestyle risk.
    pub lifestyle_risk: LifestyleRisk,
    /// Pregnancy transfusion.
    pub pregnancy_transfusion: PregnancyTransfusion,
    /// Vital signs.
    pub vital_signs: VitalSigns,
    /// Informed consent.
    pub informed_consent: InformedConsent,
    /// Donation plan.
    pub donation_plan: DonationPlan,
}

/// A DSG rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Status.
    pub status: EligibilityStatus,
    /// Present only for temporary deferrals.
    pub deferral_window: String,
}

/// A clinician-facing safety flag computed independently of overall status.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// `urgent` > `high` > `medium` > `low`.
    pub priority: String,
}

/// Final grading output for a Blood Donation Assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Eligibility status.
    pub eligibility_status: EligibilityStatus,
    /// Deferral window.
    pub deferral_window: String,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Answered count.
    pub answered_count: u32,
    /// Timestamp.
    pub timestamp: String,
}
