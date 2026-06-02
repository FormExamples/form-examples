use serde::{Deserialize, Serialize};

// Type aliases matching the front-end union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type FitnessBand = String;

/// Step 1 — Submitting agent identification.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Submitter {
    pub submitter_name: String,
    pub submitter_role: String,
    pub submitter_email: String,
    pub submitter_phone: String,
    pub submitter_organisation: String,
    pub airline_booking_reference: String,
}

/// Step 2 — Passenger identification.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Passenger {
    pub passenger_name: String,
    pub passenger_date_of_birth: String,
    pub passenger_sex: String,
    pub passenger_nationality: String,
    pub passenger_passport_number: String,
    pub passenger_national_health_id: String,
    pub passenger_address: String,
    pub emergency_contact: String,
}

/// Step 3 — Trip details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Trip {
    pub airline_iata_code: String,
    pub airline_name: String,
    pub outbound_flight_number: String,
    pub outbound_date: String,
    pub outbound_origin_iata: String,
    pub outbound_destination_iata: String,
    pub return_flight_number: String,
    pub return_date: String,
    pub cabin_class: String,
    pub sector_duration_minutes: Option<i32>,
    pub transit_airports_iata: String,
    pub special_assistance_codes: String,
}

/// Step 4 — Reason MEDIF is required (multi-select).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Reason {
    pub reason_equipment: YesNo,
    pub reason_recent_acute_event: YesNo,
    pub reason_unstable_condition: YesNo,
    pub reason_communicable_disease: YesNo,
    pub reason_pregnancy: YesNo,
    pub reason_mobility_escort: YesNo,
    pub reason_psychiatric: YesNo,
}

/// Step 5 — Attending physician identification.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Physician {
    pub physician_name: String,
    pub physician_specialty: String,
    pub physician_registration_number: String,
    pub physician_clinic: String,
    pub physician_email: String,
    pub physician_phone: String,
    pub physician_address: String,
}

/// Step 6 — Diagnosis and clinical history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Diagnosis {
    pub primary_diagnosis: String,
    pub icd10_codes: String,
    pub diagnosis_date: String,
    pub current_treatment: String,
    pub last_admission_date: String,
    pub last_discharge_date: String,
    pub last_specialist_review_date: String,
}

/// Step 7 — Cardiovascular fitness.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Cardiovascular {
    pub resting_systolic_bp: Option<i32>,
    pub resting_diastolic_bp: Option<i32>,
    pub resting_heart_rate: Option<i32>,
    pub nyha_class: String,
    pub recent_mi_date: String,
    pub recent_stent_date: String,
    pub on_anticoagulant: YesNo,
    pub pacemaker_or_icd: YesNo,
    pub unstable_angina: YesNo,
    pub exercise_tolerance_metres: Option<i32>,
}

/// Step 8 — Respiratory fitness.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Respiratory {
    pub resting_spo2_percent: Option<f64>,
    pub predicted_inflight_spo2_percent: Option<f64>,
    pub hypoxic_challenge_result: String,
    pub recent_pneumothorax_date: String,
    pub asthma_severity: String,
    pub copd_severity: String,
    pub cpap_or_bipap_use: String,
    pub recent_pulmonary_embolism_date: String,
}

/// Step 9 — Recent events and surgery.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecentEvents {
    pub last_surgery_date: String,
    pub last_surgery_site: String,
    pub cabin_gas_risk: String,
    pub recent_fracture_cast: YesNo,
    pub recent_dvt_date: String,
    pub scuba_diving_within24h: YesNo,
    pub recent_stroke_date: String,
}

/// Step 10 — Pregnancy and obstetric history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Pregnancy {
    pub is_pregnant: YesNo,
    pub gestation_weeks: Option<i32>,
    pub pregnancy_type: String,
    pub pregnancy_complications: String,
    pub expected_delivery_date: String,
    pub obstetrician_contact: String,
}

/// Step 11 — Communicable disease screening.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Communicable {
    pub communicable_disease_status: String,
    pub last_symptom_date: String,
    pub isolation_required: YesNo,
    pub vaccination_status: String,
    pub current_antimicrobials: String,
}

/// Step 12 — In-flight medical requirements.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InflightNeeds {
    pub requires_supplemental_oxygen: YesNo,
    pub oxygen_flow_rate_lpm: Option<f64>,
    pub oxygen_duration: String,
    pub requires_poc: YesNo,
    pub poc_make_model: String,
    pub poc_battery_hours: Option<f64>,
    pub requires_stretcher: YesNo,
    pub requires_incubator: YesNo,
    pub requires_iv_pump: YesNo,
    pub requires_medical_escort: YesNo,
    pub requires_extra_seat: YesNo,
    pub requires_accessible_lavatory: YesNo,
    pub wheelchair_type: String,
    pub accompanying_carer: YesNo,
}

/// Step 13 — Medications and equipment in cabin.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medications {
    pub regular_medications: String,
    pub controlled_drugs: String,
    pub dangerous_goods_battery_declaration: YesNo,
    pub sharps_in_cabin: YesNo,
    pub refrigerated_medication: YesNo,
    pub customs_documentation_available: YesNo,
    pub haemoglobin_g_per_l: Option<i32>,
}

/// Step 14 — Summary and physician sign-off.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SignOff {
    pub physician_declaration: String,
    pub physician_signature_name: String,
    pub physician_signature_date: String,
    pub valid_until_date: String,
    pub additional_notes: String,
}

/// Full MEDIF assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub submitter: Submitter,
    pub passenger: Passenger,
    pub trip: Trip,
    pub reason: Reason,
    pub physician: Physician,
    pub diagnosis: Diagnosis,
    pub cardiovascular: Cardiovascular,
    pub respiratory: Respiratory,
    pub recent_events: RecentEvents,
    pub pregnancy: Pregnancy,
    pub communicable: Communicable,
    pub inflight_needs: InflightNeeds,
    pub medications: Medications,
    pub sign_off: SignOff,
}

/// A rule that fired during fitness-band grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub band: FitnessBand,
    pub description: String,
}

/// A safety flag computed independently of the fitness band.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SafetyFlag {
    pub id: String,
    pub priority: String,
    pub category: String,
    pub message: String,
}

/// Grading output for a MEDIF assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub fitness_band: FitnessBand,
    pub fired_rules: Vec<FiredRule>,
    pub safety_flags: Vec<SafetyFlag>,
    pub desk_recommendation: String,
    pub valid_until: String,
    pub timestamp: String,
}
