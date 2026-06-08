//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the front-end union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Fitness band.
pub type FitnessBand = String;

/// Step 1 — Submitting agent identification.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Submitter {
    /// Submitter name.
    pub submitter_name: String,
    /// Submitter role.
    pub submitter_role: String,
    /// Submitter email.
    pub submitter_email: String,
    /// Submitter phone.
    pub submitter_phone: String,
    /// Submitter organisation.
    pub submitter_organisation: String,
    /// Airline booking reference.
    pub airline_booking_reference: String,
}

/// Step 2 — Passenger identification.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Passenger {
    /// Passenger name.
    pub passenger_name: String,
    /// Passenger date of birth.
    pub passenger_date_of_birth: String,
    /// Passenger sex.
    pub passenger_sex: String,
    /// Passenger nationality.
    pub passenger_nationality: String,
    /// Passenger passport number.
    pub passenger_passport_number: String,
    /// Passenger national health ID.
    pub passenger_national_health_id: String,
    /// Passenger address.
    pub passenger_address: String,
    /// Emergency contact.
    pub emergency_contact: String,
}

/// Step 3 — Trip details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Trip {
    /// Airline iata code.
    pub airline_iata_code: String,
    /// Airline name.
    pub airline_name: String,
    /// Outbound flight number.
    pub outbound_flight_number: String,
    /// Outbound date.
    pub outbound_date: String,
    /// Outbound origin iata.
    pub outbound_origin_iata: String,
    /// Outbound destination iata.
    pub outbound_destination_iata: String,
    /// Return flight number.
    pub return_flight_number: String,
    /// Return date.
    pub return_date: String,
    /// Cabin class.
    pub cabin_class: String,
    /// Sector duration minutes.
    pub sector_duration_minutes: Option<i32>,
    /// Transit airports iata.
    pub transit_airports_iata: String,
    /// Special assistance codes.
    pub special_assistance_codes: String,
}

/// Step 4 — Reason MEDIF is required (multi-select).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Reason {
    /// Reason equipment.
    pub reason_equipment: YesNo,
    /// Reason recent acute event.
    pub reason_recent_acute_event: YesNo,
    /// Reason unstable condition.
    pub reason_unstable_condition: YesNo,
    /// Reason communicable disease.
    pub reason_communicable_disease: YesNo,
    /// Reason pregnancy.
    pub reason_pregnancy: YesNo,
    /// Reason mobility escort.
    pub reason_mobility_escort: YesNo,
    /// Reason psychiatric.
    pub reason_psychiatric: YesNo,
}

/// Step 5 — Attending physician identification.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Physician {
    /// Physician name.
    pub physician_name: String,
    /// Physician specialty.
    pub physician_specialty: String,
    /// Physician registration number.
    pub physician_registration_number: String,
    /// Physician clinic.
    pub physician_clinic: String,
    /// Physician email.
    pub physician_email: String,
    /// Physician phone.
    pub physician_phone: String,
    /// Physician address.
    pub physician_address: String,
}

/// Step 6 — Diagnosis and clinical history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Diagnosis {
    /// Primary diagnosis.
    pub primary_diagnosis: String,
    /// Icd10 codes.
    pub icd10_codes: String,
    /// Diagnosis date.
    pub diagnosis_date: String,
    /// Current treatment.
    pub current_treatment: String,
    /// Last admission date.
    pub last_admission_date: String,
    /// Last discharge date.
    pub last_discharge_date: String,
    /// Last specialist review date.
    pub last_specialist_review_date: String,
}

/// Step 7 — Cardiovascular fitness.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Cardiovascular {
    /// Resting systolic BP.
    pub resting_systolic_bp: Option<i32>,
    /// Resting diastolic BP.
    pub resting_diastolic_bp: Option<i32>,
    /// Resting heart rate.
    pub resting_heart_rate: Option<i32>,
    /// Nyha class.
    pub nyha_class: String,
    /// Recent mi date.
    pub recent_mi_date: String,
    /// Recent stent date.
    pub recent_stent_date: String,
    /// On anticoagulant.
    pub on_anticoagulant: YesNo,
    /// Pacemaker or ICD.
    pub pacemaker_or_icd: YesNo,
    /// Unstable angina.
    pub unstable_angina: YesNo,
    /// Exercise tolerance metres.
    pub exercise_tolerance_metres: Option<i32>,
}

/// Step 8 — Respiratory fitness.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Respiratory {
    /// Resting SpO2 percent.
    pub resting_spo2_percent: Option<f64>,
    /// Predicted inflight SpO2 percent.
    pub predicted_inflight_spo2_percent: Option<f64>,
    /// Hypoxic challenge result.
    pub hypoxic_challenge_result: String,
    /// Recent pneumothorax date.
    pub recent_pneumothorax_date: String,
    /// Asthma severity.
    pub asthma_severity: String,
    /// Copd severity.
    pub copd_severity: String,
    /// Cpap or bipap use.
    pub cpap_or_bipap_use: String,
    /// Recent pulmonary embolism date.
    pub recent_pulmonary_embolism_date: String,
}

/// Step 9 — Recent events and surgery.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecentEvents {
    /// Last surgery date.
    pub last_surgery_date: String,
    /// Last surgery site.
    pub last_surgery_site: String,
    /// Cabin gas risk.
    pub cabin_gas_risk: String,
    /// Recent fracture cast.
    pub recent_fracture_cast: YesNo,
    /// Recent DVT date.
    pub recent_dvt_date: String,
    /// Scuba diving within24h.
    pub scuba_diving_within24h: YesNo,
    /// Recent stroke date.
    pub recent_stroke_date: String,
}

/// Step 10 — Pregnancy and obstetric history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Pregnancy {
    /// Is pregnant.
    pub is_pregnant: YesNo,
    /// Gestation weeks.
    pub gestation_weeks: Option<i32>,
    /// Pregnancy type.
    pub pregnancy_type: String,
    /// Pregnancy complications.
    pub pregnancy_complications: String,
    /// Expected delivery date.
    pub expected_delivery_date: String,
    /// Obstetrician contact.
    pub obstetrician_contact: String,
}

/// Step 11 — Communicable disease screening.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Communicable {
    /// Communicable disease status.
    pub communicable_disease_status: String,
    /// Last symptom date.
    pub last_symptom_date: String,
    /// Isolation required.
    pub isolation_required: YesNo,
    /// Vaccination status.
    pub vaccination_status: String,
    /// Current antimicrobials.
    pub current_antimicrobials: String,
}

/// Step 12 — In-flight medical requirements.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InflightNeeds {
    /// Requires supplemental oxygen.
    pub requires_supplemental_oxygen: YesNo,
    /// Oxygen flow rate lpm.
    pub oxygen_flow_rate_lpm: Option<f64>,
    /// Oxygen duration.
    pub oxygen_duration: String,
    /// Requires poc.
    pub requires_poc: YesNo,
    /// Poc make model.
    pub poc_make_model: String,
    /// Poc battery hours.
    pub poc_battery_hours: Option<f64>,
    /// Requires stretcher.
    pub requires_stretcher: YesNo,
    /// Requires incubator.
    pub requires_incubator: YesNo,
    /// Requires IV pump.
    pub requires_iv_pump: YesNo,
    /// Requires medical escort.
    pub requires_medical_escort: YesNo,
    /// Requires extra seat.
    pub requires_extra_seat: YesNo,
    /// Requires accessible lavatory.
    pub requires_accessible_lavatory: YesNo,
    /// Wheelchair type.
    pub wheelchair_type: String,
    /// Accompanying carer.
    pub accompanying_carer: YesNo,
}

/// Step 13 — Medications and equipment in cabin.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medications {
    /// Regular medications.
    pub regular_medications: String,
    /// Controlled drugs.
    pub controlled_drugs: String,
    /// Dangerous goods battery declaration.
    pub dangerous_goods_battery_declaration: YesNo,
    /// Sharps in cabin.
    pub sharps_in_cabin: YesNo,
    /// Refrigerated medication.
    pub refrigerated_medication: YesNo,
    /// Customs documentation available.
    pub customs_documentation_available: YesNo,
    /// Haemoglobin g per l.
    pub haemoglobin_g_per_l: Option<i32>,
}

/// Step 14 — Summary and physician sign-off.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SignOff {
    /// Physician declaration.
    pub physician_declaration: String,
    /// Physician signature name.
    pub physician_signature_name: String,
    /// Physician signature date.
    pub physician_signature_date: String,
    /// Valid until date.
    pub valid_until_date: String,
    /// Additional notes.
    pub additional_notes: String,
}

/// Full MEDIF assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Submitter.
    pub submitter: Submitter,
    /// Passenger.
    pub passenger: Passenger,
    /// Trip.
    pub trip: Trip,
    /// Reason.
    pub reason: Reason,
    /// Physician.
    pub physician: Physician,
    /// Diagnosis.
    pub diagnosis: Diagnosis,
    /// Cardiovascular.
    pub cardiovascular: Cardiovascular,
    /// Respiratory.
    pub respiratory: Respiratory,
    /// Recent events.
    pub recent_events: RecentEvents,
    /// Pregnancy.
    pub pregnancy: Pregnancy,
    /// Communicable.
    pub communicable: Communicable,
    /// Inflight needs.
    pub inflight_needs: InflightNeeds,
    /// Medications.
    pub medications: Medications,
    /// Sign off.
    pub sign_off: SignOff,
}

/// A rule that fired during fitness-band grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Band.
    pub band: FitnessBand,
    /// Description.
    pub description: String,
}

/// A safety flag computed independently of the fitness band.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SafetyFlag {
    /// ID.
    pub id: String,
    /// Priority.
    pub priority: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
}

/// Grading output for a MEDIF assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Fitness band.
    pub fitness_band: FitnessBand,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Safety flags.
    pub safety_flags: Vec<SafetyFlag>,
    /// Desk recommendation.
    pub desk_recommendation: String,
    /// Valid until.
    pub valid_until: String,
    /// Timestamp.
    pub timestamp: String,
}
