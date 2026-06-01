use serde::{Deserialize, Serialize};

/// The Waiting Time Status band. Empty string means "not yet computed".
pub type WaitingTimeBand = String;

/// The Clinical Priority (P1a, P1b, P2, P3, P4, P5, P6). Empty string
/// means "not yet recorded".
pub type ClinicalPriority = String;

/// Yes/No enum. Empty string means "not yet answered".
pub type YesNo = String;

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Practitioner {
    pub name: String,
    pub role: String,
    pub registration_body: String,
    pub registration_number: String,
    pub organisation_name: String,
    pub organisation_ods_code: String,
    pub site_name: String,
    pub email: String,
    pub phone: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Patient {
    pub name: String,
    /// ISO 8601 date string (YYYY-MM-DD). Empty string means unanswered.
    pub birth_date: String,
    pub sex: String,
    pub united_kingdom_nhs_number: String,
    pub email: String,
    pub phone: String,
    pub postal_address_as_full_text: String,
    pub postcode: String,
    pub preferred_language_as_iso6391: String,
    pub interpreter_required: YesNo,
    pub accessibility_needs: String,
    pub preferred_contact_channel: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Referral {
    pub referral_source: String,
    /// ISO 8601 date string (YYYY-MM-DD).
    pub referral_date: String,
    pub referral_letter_reference: String,
    pub reason_for_referral: String,
    pub presenting_condition: String,
    pub icd10_code: String,
    pub snomed_ct_code: String,
    pub suspected_cancer: YesNo,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WaitingList {
    pub list_name: String,
    pub specialty: String,
    pub sub_specialty: String,
    pub procedure_description: String,
    pub opcs4_code: String,
    /// One of "P1a", "P1b", "P2", "P3", "P4", "P5", "P6", or empty.
    pub clinical_priority: ClinicalPriority,
    /// ISO 8601 date string for the RTT clock start.
    pub rtt_clock_start_date: String,
    pub expected_procedure_type: String,
    pub expected_wait_weeks: Option<i32>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Appointment {
    pub appointment_date: String,
    pub appointment_time: String,
    pub duration_minutes: Option<i32>,
    pub appointment_type: String,
    pub site_name: String,
    pub site_address: String,
    pub clinic_name: String,
    pub room: String,
    pub clinician_name: String,
    pub clinician_team: String,
    pub status: String,
    pub travel_notes: String,
    pub access_notes: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Communication {
    pub consent_to_reminders: YesNo,
    pub communication_notes: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Signoff {
    pub additional_notes: String,
    /// ISO 8601 datetime string. Empty string means unsigned.
    pub signed_at: String,
}

/// The complete Medical Waiting List Card payload.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Card {
    /// One of "draft", "submitted". Empty means unset.
    pub status: String,
    pub entry_date: String,
    pub entry_time: String,
    pub practitioner: Practitioner,
    pub patient: Patient,
    pub referral: Referral,
    pub waiting_list: WaitingList,
    pub appointment: Appointment,
    pub communication: Communication,
    pub signoff: Signoff,
}

/// A rule that fired during waiting-time classification.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub rule_id: String,
    pub instrument: String,
    pub band: String,
    pub category: String,
    pub description: String,
}

/// An operational / safety flag computed independently of the WTS band.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub flag_id: String,
    pub category: String,
    /// "high" / "medium" / "low".
    pub priority: String,
    pub description: String,
    pub suggested_action: String,
}

/// Pure output of the grading engine.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub waiting_time_status: WaitingTimeBand,
    pub clinical_priority: ClinicalPriority,
    pub target_wait_weeks: Option<f64>,
    pub days_waited: Option<i64>,
    pub weeks_waited: Option<f64>,
    pub days_to_target: Option<i64>,
    pub days_to_breach: Option<i64>,
    pub days_to_appointment: Option<i64>,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub grader_notes: String,
    pub timestamp: String,
}
