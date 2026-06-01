use serde::{Deserialize, Serialize};

// Type aliases. Empty string `''` indicates an unanswered enum / text field.
pub type YesNo = String;
pub type EyesightStandard = String;
pub type WhichEye = String;
pub type WhichEyes = String;
pub type MonocularDuration = String;
pub type MonocularAdaptation = String;
pub type VisualFieldCause = String;
pub type ContactPreference = String;

/// Part A — Personal Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PersonalDetails {
    pub title: String,
    pub full_name: String,
    pub date_of_birth: String,
    pub address: String,
    pub postcode: String,
    pub email: String,
    pub contact_number: String,
    pub change_of_details: String,
}

/// Part B — GP details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GpDetails {
    pub name: String,
    pub surgery_name: String,
    pub address: String,
    pub town: String,
    pub postcode: String,
    pub contact_number: String,
    pub email: String,
    pub date_last_seen: String,
}

/// Part B — Consultant details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConsultantDetails {
    pub name: String,
    pub speciality: String,
    pub department: String,
    pub hospital_name: String,
    pub address: String,
    pub town: String,
    pub postcode: String,
    pub contact_number: String,
    pub email: String,
    pub date_last_seen: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthcareProfessionals {
    pub gp: GpDetails,
    pub consultant: ConsultantDetails,
}

/// Q1 — Eyesight standards.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EyesightStandards {
    pub meets_standard: EyesightStandard,
}

/// Q2 — Vision in both eyes (monocular branch).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VisionInBothEyes {
    pub has_vision_in_both_eyes: YesNo,
    pub which_eye: WhichEye,
    pub duration: MonocularDuration,
    pub adaptation: MonocularAdaptation,
    pub monocular_declaration_confirmed: bool,
}

/// Q3 — Field of vision.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FieldOfVision {
    pub has_problem: YesNo,
    pub caused_solely_by_eye_condition: YesNo,
    pub cause: VisualFieldCause,
    pub cause_other_details: String,
}

/// Q4 — Glaucoma.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Glaucoma {
    pub has_condition: YesNo,
    pub which_eyes: WhichEyes,
}

/// Q5 — Retinitis pigmentosa.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RetinitisPigmentosa {
    pub has_condition: YesNo,
    pub which_eyes: WhichEyes,
}

/// Q6 — Laser treatment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LaserTreatment {
    pub has_had_treatment: YesNo,
    pub left_eye_first_date: String,
    pub right_eye_first_date: String,
    pub left_eye_last_date: String,
    pub right_eye_last_date: String,
}

/// Q7 — Blepharospasm.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Blepharospasm {
    pub has_condition: YesNo,
    pub which_eyes: WhichEyes,
    pub has_had_treatment: YesNo,
    pub adequately_controlled: YesNo,
}

/// Q8 — Night blindness.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NightBlindness {
    pub has_condition: YesNo,
    pub which_eyes: WhichEyes,
}

/// Q9 — Double vision.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DoubleVision {
    pub has_condition: YesNo,
    pub controlled: YesNo,
    pub same_for_six_months_or_more: YesNo,
    pub double_vision_declaration_confirmed: bool,
    pub declaration_signature_name: String,
    pub declaration_date: String,
}

/// Q10 — Other vision conditions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OtherVisionConditions {
    pub has_other: YesNo,
    pub details: String,
}

/// Q11 — Recent contact.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecentContact {
    pub had_contact: YesNo,
    pub date_of_contact: String,
}

/// Applicant's Authorisation.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Authorisation {
    pub declaration_confirmed: bool,
    pub name: String,
    pub signature: String,
    pub date: String,
    pub authorise_electronic_correspondence: YesNo,
    pub contact_preference_from_healthcare_professional: ContactPreference,
    pub contact_preference_from_dvla: ContactPreference,
}

/// Full DVLA V1 assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub personal_details: PersonalDetails,
    pub healthcare_professionals: HealthcareProfessionals,
    pub eyesight_standards: EyesightStandards,
    pub vision_in_both_eyes: VisionInBothEyes,
    pub field_of_vision: FieldOfVision,
    pub glaucoma: Glaucoma,
    pub retinitis_pigmentosa: RetinitisPigmentosa,
    pub laser_treatment: LaserTreatment,
    pub blepharospasm: Blepharospasm,
    pub night_blindness: NightBlindness,
    pub double_vision: DoubleVision,
    pub other_vision_conditions: OtherVisionConditions,
    pub recent_contact: RecentContact,
    pub authorisation: Authorisation,
}

/// A rule that fired (i.e. an unsatisfied required field).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub section: String,
    pub description: String,
    pub message: String,
}

/// Per-section completeness breakdown.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SectionCompleteness {
    pub section: String,
    pub required: u32,
    pub satisfied: u32,
    pub missing: Vec<FiredRule>,
}

/// A flagged clinical / administrative issue. Priority ladder:
/// `urgent` > `high` > `medium` > `low`.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FlaggedIssue {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a DVLA V1 case.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub complete: bool,
    pub total_required: u32,
    pub total_satisfied: u32,
    pub overall_percent: u32,
    pub sections: Vec<SectionCompleteness>,
    pub missing: Vec<FiredRule>,
    pub flagged_issues: Vec<FlaggedIssue>,
    pub timestamp: String,
}
