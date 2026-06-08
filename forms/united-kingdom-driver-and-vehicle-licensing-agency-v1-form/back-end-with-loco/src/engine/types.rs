//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases. Empty string `''` indicates an unanswered enum / text field.
/// Yes no.
pub type YesNo = String;
/// Eyesight standard.
pub type EyesightStandard = String;
/// Which eye.
pub type WhichEye = String;
/// Which eyes.
pub type WhichEyes = String;
/// Monocular duration.
pub type MonocularDuration = String;
/// Monocular adaptation.
pub type MonocularAdaptation = String;
/// Visual field cause.
pub type VisualFieldCause = String;
/// Contact preference.
pub type ContactPreference = String;

/// Part A — Personal Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PersonalDetails {
    /// Title.
    pub title: String,
    /// Full name.
    pub full_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Address.
    pub address: String,
    /// Postcode.
    pub postcode: String,
    /// Email.
    pub email: String,
    /// Contact number.
    pub contact_number: String,
    /// Change of details.
    pub change_of_details: String,
}

/// Part B — GP details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GpDetails {
    /// Name.
    pub name: String,
    /// Surgery name.
    pub surgery_name: String,
    /// Address.
    pub address: String,
    /// Town.
    pub town: String,
    /// Postcode.
    pub postcode: String,
    /// Contact number.
    pub contact_number: String,
    /// Email.
    pub email: String,
    /// Date last seen.
    pub date_last_seen: String,
}

/// Part B — Consultant details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConsultantDetails {
    /// Name.
    pub name: String,
    /// Speciality.
    pub speciality: String,
    /// Department.
    pub department: String,
    /// Hospital name.
    pub hospital_name: String,
    /// Address.
    pub address: String,
    /// Town.
    pub town: String,
    /// Postcode.
    pub postcode: String,
    /// Contact number.
    pub contact_number: String,
    /// Email.
    pub email: String,
    /// Date last seen.
    pub date_last_seen: String,
}

/// Healthcare professionals.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthcareProfessionals {
    /// GP.
    pub gp: GpDetails,
    /// Consultant.
    pub consultant: ConsultantDetails,
}

/// Q1 — Eyesight standards.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EyesightStandards {
    /// Meets standard.
    pub meets_standard: EyesightStandard,
}

/// Q2 — Vision in both eyes (monocular branch).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VisionInBothEyes {
    /// Has vision in both eyes.
    pub has_vision_in_both_eyes: YesNo,
    /// Which eye.
    pub which_eye: WhichEye,
    /// Duration.
    pub duration: MonocularDuration,
    /// Adaptation.
    pub adaptation: MonocularAdaptation,
    /// Monocular declaration confirmed.
    pub monocular_declaration_confirmed: bool,
}

/// Q3 — Field of vision.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FieldOfVision {
    /// Has problem.
    pub has_problem: YesNo,
    /// Caused solely by eye condition.
    pub caused_solely_by_eye_condition: YesNo,
    /// Cause.
    pub cause: VisualFieldCause,
    /// Cause other details.
    pub cause_other_details: String,
}

/// Q4 — Glaucoma.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Glaucoma {
    /// Has condition.
    pub has_condition: YesNo,
    /// Which eyes.
    pub which_eyes: WhichEyes,
}

/// Q5 — Retinitis pigmentosa.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RetinitisPigmentosa {
    /// Has condition.
    pub has_condition: YesNo,
    /// Which eyes.
    pub which_eyes: WhichEyes,
}

/// Q6 — Laser treatment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LaserTreatment {
    /// Has had treatment.
    pub has_had_treatment: YesNo,
    /// Left eye first date.
    pub left_eye_first_date: String,
    /// Right eye first date.
    pub right_eye_first_date: String,
    /// Left eye last date.
    pub left_eye_last_date: String,
    /// Right eye last date.
    pub right_eye_last_date: String,
}

/// Q7 — Blepharospasm.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Blepharospasm {
    /// Has condition.
    pub has_condition: YesNo,
    /// Which eyes.
    pub which_eyes: WhichEyes,
    /// Has had treatment.
    pub has_had_treatment: YesNo,
    /// Adequately controlled.
    pub adequately_controlled: YesNo,
}

/// Q8 — Night blindness.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NightBlindness {
    /// Has condition.
    pub has_condition: YesNo,
    /// Which eyes.
    pub which_eyes: WhichEyes,
}

/// Q9 — Double vision.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DoubleVision {
    /// Has condition.
    pub has_condition: YesNo,
    /// Controlled.
    pub controlled: YesNo,
    /// Same for six months or more.
    pub same_for_six_months_or_more: YesNo,
    /// Double vision declaration confirmed.
    pub double_vision_declaration_confirmed: bool,
    /// Declaration signature name.
    pub declaration_signature_name: String,
    /// Declaration date.
    pub declaration_date: String,
}

/// Q10 — Other vision conditions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OtherVisionConditions {
    /// Has other.
    pub has_other: YesNo,
    /// Details.
    pub details: String,
}

/// Q11 — Recent contact.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecentContact {
    /// Had contact.
    pub had_contact: YesNo,
    /// Date of contact.
    pub date_of_contact: String,
}

/// Applicant's Authorisation.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Authorisation {
    /// Declaration confirmed.
    pub declaration_confirmed: bool,
    /// Name.
    pub name: String,
    /// Signature.
    pub signature: String,
    /// Date.
    pub date: String,
    /// Authorise electronic correspondence.
    pub authorise_electronic_correspondence: YesNo,
    /// Contact preference from healthcare professional.
    pub contact_preference_from_healthcare_professional: ContactPreference,
    /// Contact preference from dvla.
    pub contact_preference_from_dvla: ContactPreference,
}

/// Full DVLA V1 assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Personal details.
    pub personal_details: PersonalDetails,
    /// Healthcare professionals.
    pub healthcare_professionals: HealthcareProfessionals,
    /// Eyesight standards.
    pub eyesight_standards: EyesightStandards,
    /// Vision in both eyes.
    pub vision_in_both_eyes: VisionInBothEyes,
    /// Field of vision.
    pub field_of_vision: FieldOfVision,
    /// Glaucoma.
    pub glaucoma: Glaucoma,
    /// Retinitis pigmentosa.
    pub retinitis_pigmentosa: RetinitisPigmentosa,
    /// Laser treatment.
    pub laser_treatment: LaserTreatment,
    /// Blepharospasm.
    pub blepharospasm: Blepharospasm,
    /// Night blindness.
    pub night_blindness: NightBlindness,
    /// Double vision.
    pub double_vision: DoubleVision,
    /// Other vision conditions.
    pub other_vision_conditions: OtherVisionConditions,
    /// Recent contact.
    pub recent_contact: RecentContact,
    /// Authorisation.
    pub authorisation: Authorisation,
}

/// A rule that fired (i.e. an unsatisfied required field).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Section.
    pub section: String,
    /// Description.
    pub description: String,
    /// Message.
    pub message: String,
}

/// Per-section completeness breakdown.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SectionCompleteness {
    /// Section.
    pub section: String,
    /// Required.
    pub required: u32,
    /// Satisfied.
    pub satisfied: u32,
    /// Missing.
    pub missing: Vec<FiredRule>,
}

/// A flagged clinical / administrative issue. Priority ladder:
/// `urgent` > `high` > `medium` > `low`.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FlaggedIssue {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// Priority.
    pub priority: String,
}

/// Grading output for a DVLA V1 case.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Complete.
    pub complete: bool,
    /// Total required.
    pub total_required: u32,
    /// Total satisfied.
    pub total_satisfied: u32,
    /// Overall percent.
    pub overall_percent: u32,
    /// Sections.
    pub sections: Vec<SectionCompleteness>,
    /// Missing.
    pub missing: Vec<FiredRule>,
    /// Flagged issues.
    pub flagged_issues: Vec<FlaggedIssue>,
    /// Timestamp.
    pub timestamp: String,
}
