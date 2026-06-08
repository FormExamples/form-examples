//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// The Waiting Time Status band. Empty string means "not yet computed".
pub type WaitingTimeBand = String;

/// The Clinical Priority (P1a, P1b, P2, P3, P4, P5, P6). Empty string
/// means "not yet recorded".
pub type ClinicalPriority = String;

/// Yes/No enum. Empty string means "not yet answered".
pub type YesNo = String;

/// Practitioner.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Practitioner {
    /// Name.
    pub name: String,
    /// Role.
    pub role: String,
    /// Registration body.
    pub registration_body: String,
    /// Registration number.
    pub registration_number: String,
    /// Organisation name.
    pub organisation_name: String,
    /// Organisation ods code.
    pub organisation_ods_code: String,
    /// Site name.
    pub site_name: String,
    /// Email.
    pub email: String,
    /// Phone.
    pub phone: String,
}

/// Patient.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Patient {
    /// Name.
    pub name: String,
    /// ISO 8601 date string (YYYY-MM-DD). Empty string means unanswered.
    pub birth_date: String,
    /// Sex.
    pub sex: String,
    /// United kingdom NHS number.
    pub united_kingdom_nhs_number: String,
    /// Email.
    pub email: String,
    /// Phone.
    pub phone: String,
    /// Postal address as full text.
    pub postal_address_as_full_text: String,
    /// Postcode.
    pub postcode: String,
    /// Preferred language as iso6391.
    pub preferred_language_as_iso6391: String,
    /// Interpreter required.
    pub interpreter_required: YesNo,
    /// Accessibility needs.
    pub accessibility_needs: String,
    /// Preferred contact channel.
    pub preferred_contact_channel: String,
}

/// Referral.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Referral {
    /// Referral source.
    pub referral_source: String,
    /// ISO 8601 date string (YYYY-MM-DD).
    pub referral_date: String,
    /// Referral letter reference.
    pub referral_letter_reference: String,
    /// Reason for referral.
    pub reason_for_referral: String,
    /// Presenting condition.
    pub presenting_condition: String,
    /// Icd10 code.
    pub icd10_code: String,
    /// Snomed CT code.
    pub snomed_ct_code: String,
    /// Suspected cancer.
    pub suspected_cancer: YesNo,
}

/// Waiting list.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WaitingList {
    /// List name.
    pub list_name: String,
    /// Specialty.
    pub specialty: String,
    /// Sub specialty.
    pub sub_specialty: String,
    /// Procedure description.
    pub procedure_description: String,
    /// Opcs4 code.
    pub opcs4_code: String,
    /// One of "P1a", "P1b", "P2", "P3", "P4", "P5", "P6", or empty.
    pub clinical_priority: ClinicalPriority,
    /// ISO 8601 date string for the RTT clock start.
    pub rtt_clock_start_date: String,
    /// Expected procedure type.
    pub expected_procedure_type: String,
    /// Expected wait weeks.
    pub expected_wait_weeks: Option<i32>,
}

/// Appointment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Appointment {
    /// Appointment date.
    pub appointment_date: String,
    /// Appointment time.
    pub appointment_time: String,
    /// Duration minutes.
    pub duration_minutes: Option<i32>,
    /// Appointment type.
    pub appointment_type: String,
    /// Site name.
    pub site_name: String,
    /// Site address.
    pub site_address: String,
    /// Clinic name.
    pub clinic_name: String,
    /// Room.
    pub room: String,
    /// Clinician name.
    pub clinician_name: String,
    /// Clinician team.
    pub clinician_team: String,
    /// Status.
    pub status: String,
    /// Travel notes.
    pub travel_notes: String,
    /// Access notes.
    pub access_notes: String,
}

/// Communication.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Communication {
    /// Consent to reminders.
    pub consent_to_reminders: YesNo,
    /// Communication notes.
    pub communication_notes: String,
}

/// Signoff.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Signoff {
    /// Additional notes.
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
    /// Entry date.
    pub entry_date: String,
    /// Entry time.
    pub entry_time: String,
    /// Practitioner.
    pub practitioner: Practitioner,
    /// Patient.
    pub patient: Patient,
    /// Referral.
    pub referral: Referral,
    /// Waiting list.
    pub waiting_list: WaitingList,
    /// Appointment.
    pub appointment: Appointment,
    /// Communication.
    pub communication: Communication,
    /// Signoff.
    pub signoff: Signoff,
}

/// A rule that fired during waiting-time classification.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// Rule ID.
    pub rule_id: String,
    /// Instrument.
    pub instrument: String,
    /// Band.
    pub band: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
}

/// An operational / safety flag computed independently of the WTS band.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// Flag ID.
    pub flag_id: String,
    /// Category.
    pub category: String,
    /// "high" / "medium" / "low".
    pub priority: String,
    /// Description.
    pub description: String,
    /// Suggested action.
    pub suggested_action: String,
}

/// Pure output of the grading engine.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Waiting time status.
    pub waiting_time_status: WaitingTimeBand,
    /// Clinical priority.
    pub clinical_priority: ClinicalPriority,
    /// Target wait weeks.
    pub target_wait_weeks: Option<f64>,
    /// Days waited.
    pub days_waited: Option<i64>,
    /// Weeks waited.
    pub weeks_waited: Option<f64>,
    /// Days to target.
    pub days_to_target: Option<i64>,
    /// Days to breach.
    pub days_to_breach: Option<i64>,
    /// Days to appointment.
    pub days_to_appointment: Option<i64>,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Grader notes.
    pub grader_notes: String,
    /// Timestamp.
    pub timestamp: String,
}
