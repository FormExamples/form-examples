use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
pub type YesNo = String;
pub type CompletenessLevel = String;

/// Patient identification and contact information.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientDetails {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub nhs_number: String,
    pub hospital_number: String,
    pub address: String,
    pub postcode: String,
    pub phone: String,
    pub gp_name: String,
    pub gp_practice: String,
    pub next_of_kin_name: String,
    pub next_of_kin_phone: String,
}

/// Admission summary fields.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdmissionSummary {
    pub admission_date: String,
    pub discharge_date: String,
    pub ward: String,
    pub consultant: String,
    pub specialty: String,
    pub reason_for_admission: String,
    pub presenting_complaint: String,
    pub clinical_narrative: String,
}

/// One diagnosis line.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Diagnosis {
    pub description: String,
    pub icd10: String,
    /// `primary` / `secondary` / `''`
    #[serde(rename = "type")]
    pub kind: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Diagnoses {
    pub diagnoses: Vec<Diagnosis>,
}

/// One procedure performed.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Procedure {
    pub description: String,
    pub opcs4: String,
    pub date: String,
    pub performed_by: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProceduresPerformed {
    pub procedures: Vec<Procedure>,
    pub no_procedures_performed: YesNo,
}

/// One discharge medication.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    pub name: String,
    pub dose: String,
    pub route: String,
    pub frequency: String,
    pub duration: String,
    /// `new` / `changed` / `unchanged` / `stopped` / `''`
    pub status: String,
    pub indication: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DischargeMedications {
    pub medications: Vec<Medication>,
    pub reconciliation_completed: YesNo,
    pub reconciliation_notes: String,
    pub allergies_reviewed: YesNo,
    pub allergy_notes: String,
}

/// One follow-up appointment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FollowupAppointment {
    pub provider: String,
    pub date: String,
    pub location: String,
    pub purpose: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FollowupArrangements {
    pub appointments: Vec<FollowupAppointment>,
    pub gp_followup_required: YesNo,
    pub gp_followup_timeframe: String,
    pub outpatient_followup_required: YesNo,
    pub investigations_pending: YesNo,
    pub pending_investigation_details: String,
    pub results_to_be_chased_by_gp: YesNo,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommunityCareInstructions {
    pub discharge_destination: String,
    pub other_destination_details: String,
    pub care_responsibility: String,
    pub transport_mode: String,
    pub district_nurse_referral: YesNo,
    pub social_services_referral: YesNo,
    pub physiotherapy_referral: YesNo,
    pub occupational_therapy_referral: YesNo,
    pub package_of_care_in_place: YesNo,
    pub mobility_status: String,
    pub dietary_requirements: String,
    pub wound_care_instructions: String,
    pub equipment_provided: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WarningSigns {
    pub red_flag_symptoms: Vec<String>,
    pub when_to_seek_help: String,
    pub emergency_contact_number: String,
    pub safety_neting_provided: YesNo,
    pub written_info_given: YesNo,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicianSignoff {
    pub clinician_name: String,
    pub clinician_role: String,
    pub gmc_number: String,
    pub signoff_date: String,
    pub bleep_or_contact: String,
    pub responsible_consultant_informed: YesNo,
    pub additional_notes: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientAcknowledgement {
    pub patient_understands_plan: YesNo,
    pub carer_informed: YesNo,
    pub carer_name: String,
    pub medications_explained: YesNo,
    pub written_summary_provided: YesNo,
    pub questions_answered: YesNo,
    pub acknowledgement_date: String,
    pub signed_by: String,
}

/// Full Hospital Discharge assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub patient_details: PatientDetails,
    pub admission_summary: AdmissionSummary,
    pub diagnoses: Diagnoses,
    pub procedures_performed: ProceduresPerformed,
    pub discharge_medications: DischargeMedications,
    pub followup_arrangements: FollowupArrangements,
    pub community_care_instructions: CommunityCareInstructions,
    pub warning_signs: WarningSigns,
    pub clinician_signoff: ClinicianSignoff,
    pub patient_acknowledgement: PatientAcknowledgement,
}

/// A NICE NG27 rule evaluated against the data.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub satisfied: bool,
    pub mandatory: bool,
}

/// A safety flag computed independently of completeness (real-time alert).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    /// `urgent` / `high` / `medium` / `low`
    pub priority: String,
}

/// Grading output for a discharge summary.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub completeness_level: CompletenessLevel,
    pub mandatory_satisfied: u32,
    pub mandatory_total: u32,
    pub optional_satisfied: u32,
    pub optional_total: u32,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
