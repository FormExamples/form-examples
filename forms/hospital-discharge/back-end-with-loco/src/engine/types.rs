//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
/// Yes no.
pub type YesNo = String;
/// Completeness level.
pub type CompletenessLevel = String;

/// Patient identification and contact information.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientDetails {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: String,
    /// NHS number.
    pub nhs_number: String,
    /// Hospital number.
    pub hospital_number: String,
    /// Address.
    pub address: String,
    /// Postcode.
    pub postcode: String,
    /// Phone.
    pub phone: String,
    /// GP name.
    pub gp_name: String,
    /// GP practice.
    pub gp_practice: String,
    /// Next of kin name.
    pub next_of_kin_name: String,
    /// Next of kin phone.
    pub next_of_kin_phone: String,
}

/// Admission summary fields.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdmissionSummary {
    /// Admission date.
    pub admission_date: String,
    /// Discharge date.
    pub discharge_date: String,
    /// Ward.
    pub ward: String,
    /// Consultant.
    pub consultant: String,
    /// Specialty.
    pub specialty: String,
    /// Reason for admission.
    pub reason_for_admission: String,
    /// Presenting complaint.
    pub presenting_complaint: String,
    /// Clinical narrative.
    pub clinical_narrative: String,
}

/// One diagnosis line.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Diagnosis {
    /// Description.
    pub description: String,
    /// Icd10.
    pub icd10: String,
    /// `primary` / `secondary` / `''`
    #[serde(rename = "type")]
    pub kind: String,
}

/// Diagnoses.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Diagnoses {
    /// Diagnoses.
    pub diagnoses: Vec<Diagnosis>,
}

/// One procedure performed.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Procedure {
    /// Description.
    pub description: String,
    /// Opcs4.
    pub opcs4: String,
    /// Date.
    pub date: String,
    /// Performed by.
    pub performed_by: String,
}

/// Procedures performed.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProceduresPerformed {
    /// Procedures.
    pub procedures: Vec<Procedure>,
    /// No procedures performed.
    pub no_procedures_performed: YesNo,
}

/// One discharge medication.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    /// Name.
    pub name: String,
    /// Dose.
    pub dose: String,
    /// Route.
    pub route: String,
    /// Frequency.
    pub frequency: String,
    /// Duration.
    pub duration: String,
    /// `new` / `changed` / `unchanged` / `stopped` / `''`
    pub status: String,
    /// Indication.
    pub indication: String,
}

/// Discharge medications.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DischargeMedications {
    /// Medications.
    pub medications: Vec<Medication>,
    /// Reconciliation completed.
    pub reconciliation_completed: YesNo,
    /// Reconciliation notes.
    pub reconciliation_notes: String,
    /// Allergies reviewed.
    pub allergies_reviewed: YesNo,
    /// Allergy notes.
    pub allergy_notes: String,
}

/// One follow-up appointment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FollowupAppointment {
    /// Provider.
    pub provider: String,
    /// Date.
    pub date: String,
    /// Location.
    pub location: String,
    /// Purpose.
    pub purpose: String,
}

/// Followup arrangements.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FollowupArrangements {
    /// Appointments.
    pub appointments: Vec<FollowupAppointment>,
    /// GP followup required.
    pub gp_followup_required: YesNo,
    /// GP followup timeframe.
    pub gp_followup_timeframe: String,
    /// Outpatient followup required.
    pub outpatient_followup_required: YesNo,
    /// Investigations pending.
    pub investigations_pending: YesNo,
    /// Pending investigation details.
    pub pending_investigation_details: String,
    /// Results to be chased by GP.
    pub results_to_be_chased_by_gp: YesNo,
}

/// Community care instructions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommunityCareInstructions {
    /// Discharge destination.
    pub discharge_destination: String,
    /// Other destination details.
    pub other_destination_details: String,
    /// Care responsibility.
    pub care_responsibility: String,
    /// Transport mode.
    pub transport_mode: String,
    /// District nurse referral.
    pub district_nurse_referral: YesNo,
    /// Social services referral.
    pub social_services_referral: YesNo,
    /// Physiotherapy referral.
    pub physiotherapy_referral: YesNo,
    /// Occupational therapy referral.
    pub occupational_therapy_referral: YesNo,
    /// Package of care in place.
    pub package_of_care_in_place: YesNo,
    /// Mobility status.
    pub mobility_status: String,
    /// Dietary requirements.
    pub dietary_requirements: String,
    /// Wound care instructions.
    pub wound_care_instructions: String,
    /// Equipment provided.
    pub equipment_provided: String,
}

/// Warning signs.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WarningSigns {
    /// Red flag symptoms.
    pub red_flag_symptoms: Vec<String>,
    /// When to seek help.
    pub when_to_seek_help: String,
    /// Emergency contact number.
    pub emergency_contact_number: String,
    /// Safety neting provided.
    pub safety_neting_provided: YesNo,
    /// Written info given.
    pub written_info_given: YesNo,
}

/// Clinician signoff.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicianSignoff {
    /// Clinician name.
    pub clinician_name: String,
    /// Clinician role.
    pub clinician_role: String,
    /// Gmc number.
    pub gmc_number: String,
    /// Signoff date.
    pub signoff_date: String,
    /// Bleep or contact.
    pub bleep_or_contact: String,
    /// Responsible consultant informed.
    pub responsible_consultant_informed: YesNo,
    /// Additional notes.
    pub additional_notes: String,
}

/// Patient acknowledgement.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientAcknowledgement {
    /// Patient understands plan.
    pub patient_understands_plan: YesNo,
    /// Carer informed.
    pub carer_informed: YesNo,
    /// Carer name.
    pub carer_name: String,
    /// Medications explained.
    pub medications_explained: YesNo,
    /// Written summary provided.
    pub written_summary_provided: YesNo,
    /// Questions answered.
    pub questions_answered: YesNo,
    /// Acknowledgement date.
    pub acknowledgement_date: String,
    /// Signed by.
    pub signed_by: String,
}

/// Full Hospital Discharge assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient details.
    pub patient_details: PatientDetails,
    /// Admission summary.
    pub admission_summary: AdmissionSummary,
    /// Diagnoses.
    pub diagnoses: Diagnoses,
    /// Procedures performed.
    pub procedures_performed: ProceduresPerformed,
    /// Discharge medications.
    pub discharge_medications: DischargeMedications,
    /// Followup arrangements.
    pub followup_arrangements: FollowupArrangements,
    /// Community care instructions.
    pub community_care_instructions: CommunityCareInstructions,
    /// Warning signs.
    pub warning_signs: WarningSigns,
    /// Clinician signoff.
    pub clinician_signoff: ClinicianSignoff,
    /// Patient acknowledgement.
    pub patient_acknowledgement: PatientAcknowledgement,
}

/// A NICE NG27 rule evaluated against the data.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Satisfied.
    pub satisfied: bool,
    /// Mandatory.
    pub mandatory: bool,
}

/// A safety flag computed independently of completeness (real-time alert).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// `urgent` / `high` / `medium` / `low`
    pub priority: String,
}

/// Grading output for a discharge summary.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Completeness level.
    pub completeness_level: CompletenessLevel,
    /// Mandatory satisfied.
    pub mandatory_satisfied: u32,
    /// Mandatory total.
    pub mandatory_total: u32,
    /// Optional satisfied.
    pub optional_satisfied: u32,
    /// Optional total.
    pub optional_total: u32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
