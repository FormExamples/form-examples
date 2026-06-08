//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Severity level.
pub type SeverityLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Patient age.
    pub patient_age: String,
    /// Patient sex.
    pub patient_sex: String,
    /// Referral source.
    pub referral_source: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Clinician name.
    pub clinician_name: String,
    /// Clinic location.
    pub clinic_location: String,
}

// ─── Injury/Condition History (Step 2) ──────────────────────

/// Injury history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct InjuryHistory {
    /// Primary complaint.
    pub primary_complaint: String,
    /// Onset type.
    pub onset_type: String,
    /// Onset date.
    pub onset_date: String,
    /// Mechanism of injury.
    pub mechanism_of_injury: String,
    /// Previous treatment.
    pub previous_treatment: String,
    /// Previous surgeries.
    pub previous_surgeries: String,
    /// Comorbidities.
    pub comorbidities: String,
    /// Medication list.
    pub medication_list: String,
}

// ─── Pain Assessment (Step 3) ───────────────────────────────

/// Pain assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PainAssessment {
    /// Pain severity.
    pub pain_severity: Option<u8>,
    /// Pain at rest.
    pub pain_at_rest: Option<u8>,
    /// Pain with activity.
    pub pain_with_activity: Option<u8>,
    /// Night pain.
    pub night_pain: Option<u8>,
    /// Pain location.
    pub pain_location: String,
    /// Pain character.
    pub pain_character: String,
    /// Pain radiating.
    pub pain_radiating: String,
    /// Pain duration weeks.
    pub pain_duration_weeks: String,
}

// ─── Joint Examination (Step 4) ─────────────────────────────

/// Joint examination.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct JointExamination {
    /// Affected joint.
    pub affected_joint: String,
    /// Range of motion.
    pub range_of_motion: Option<u8>,
    /// Joint stability.
    pub joint_stability: Option<u8>,
    /// Joint swelling.
    pub joint_swelling: Option<u8>,
    /// Joint crepitus.
    pub joint_crepitus: String,
    /// Joint deformity.
    pub joint_deformity: String,
    /// Ligament integrity.
    pub ligament_integrity: Option<u8>,
    /// Special tests result.
    pub special_tests_result: String,
}

// ─── Muscle Assessment (Step 5) ─────────────────────────────

/// Muscle assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MuscleAssessment {
    /// Muscle strength.
    pub muscle_strength: Option<u8>,
    /// Muscle atrophy.
    pub muscle_atrophy: Option<u8>,
    /// Muscle tone.
    pub muscle_tone: Option<u8>,
    /// Grip strength.
    pub grip_strength: Option<u8>,
    /// Muscle tenderness.
    pub muscle_tenderness: Option<u8>,
    /// Reflexes normal.
    pub reflexes_normal: String,
    /// Sensation intact.
    pub sensation_intact: String,
}

// ─── Spinal Assessment (Step 6) ─────────────────────────────

/// Spinal assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SpinalAssessment {
    /// Spinal alignment.
    pub spinal_alignment: Option<u8>,
    /// Spinal mobility.
    pub spinal_mobility: Option<u8>,
    /// Disc involvement.
    pub disc_involvement: String,
    /// Nerve root signs.
    pub nerve_root_signs: String,
    /// Straight leg raise.
    pub straight_leg_raise: Option<u8>,
    /// Neurological deficit.
    pub neurological_deficit: String,
    /// Spinal tenderness.
    pub spinal_tenderness: Option<u8>,
}

// ─── Imaging & Investigations (Step 7) ──────────────────────

/// Imaging investigations.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ImagingInvestigations {
    /// Xray findings.
    pub xray_findings: String,
    /// MRI findings.
    pub mri_findings: String,
    /// CT findings.
    pub ct_findings: String,
    /// Bone density result.
    pub bone_density_result: String,
    /// Blood tests result.
    pub blood_tests_result: String,
    /// Imaging urgency.
    pub imaging_urgency: Option<u8>,
    /// Further imaging needed.
    pub further_imaging_needed: String,
}

// ─── Functional Status (Step 8) ─────────────────────────────

/// Functional status.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct FunctionalStatus {
    /// Mobility level.
    pub mobility_level: Option<u8>,
    /// Daily activities.
    pub daily_activities: Option<u8>,
    /// Work capacity.
    pub work_capacity: Option<u8>,
    /// Sleep quality.
    pub sleep_quality: Option<u8>,
    /// Walking distance.
    pub walking_distance: String,
    /// Assistive devices.
    pub assistive_devices: String,
    /// Fall risk.
    pub fall_risk: Option<u8>,
}

// ─── Surgical Considerations (Step 9) ───────────────────────

/// Surgical considerations.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SurgicalConsiderations {
    /// Surgical candidate.
    pub surgical_candidate: String,
    /// Surgical urgency.
    pub surgical_urgency: Option<u8>,
    /// Anaesthetic risk.
    pub anaesthetic_risk: Option<u8>,
    /// Conservative options exhausted.
    pub conservative_options_exhausted: String,
    /// Patient consent discussion.
    pub patient_consent_discussion: String,
    /// Expected outcome.
    pub expected_outcome: Option<u8>,
    /// Rehabilitation plan.
    pub rehabilitation_plan: String,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Overall severity.
    pub overall_severity: Option<u8>,
    /// Treatment recommendation.
    pub treatment_recommendation: String,
    /// Follow up interval.
    pub follow_up_interval: String,
    /// Referral needed.
    pub referral_needed: String,
    /// Patient understanding.
    pub patient_understanding: Option<u8>,
    /// Clinical notes.
    pub clinical_notes: String,
    /// Red flag symptoms.
    pub red_flag_symptoms: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Injury history.
    pub injury_history: InjuryHistory,
    /// Pain assessment.
    pub pain_assessment: PainAssessment,
    /// Joint examination.
    pub joint_examination: JointExamination,
    /// Muscle assessment.
    pub muscle_assessment: MuscleAssessment,
    /// Spinal assessment.
    pub spinal_assessment: SpinalAssessment,
    /// Imaging investigations.
    pub imaging_investigations: ImagingInvestigations,
    /// Functional status.
    pub functional_status: FunctionalStatus,
    /// Surgical considerations.
    pub surgical_considerations: SurgicalConsiderations,
    /// Clinical review.
    pub clinical_review: ClinicalReview,
}

// ─── Grading types ──────────────────────────────────────────

/// Fired rule.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Concern level.
    pub concern_level: String,
}

/// Additional flag.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// Priority.
    pub priority: String,
}

/// Grading result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Severity level.
    pub severity_level: SeverityLevel,
    /// Severity score.
    pub severity_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
