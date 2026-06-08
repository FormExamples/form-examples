//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Domain grade: A (best) through E (worst). Empty string = insufficient data.
pub type DomainGrade = String;

// ──────────────────────────────────────────────
// Patient Details (Step 1)
// ──────────────────────────────────────────────

/// Patient details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientDetails {
    /// Given name.
    pub given_name: String,
    /// Family name.
    pub family_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// NHS number.
    pub nhs_number: String,
    /// '' | 'male' | 'female' | 'other' | 'prefer_not_to_say'
    pub sex: String,
}

// ──────────────────────────────────────────────
// Encounter Details (Step 2)
// ──────────────────────────────────────────────

/// Encounter details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EncounterDetails {
    /// Clinic date.
    pub clinic_date: String,
    /// Specialty.
    pub specialty: String,
    /// Clinician name.
    pub clinician_name: String,
    /// '' | 'in_person' | 'telephone' | 'video'
    pub modality: String,
    /// '' | 'new' | 'follow_up' | 'pifu'
    pub appointment_type: String,
}

// ──────────────────────────────────────────────
// Operational Efficiency (Step 3)
// ──────────────────────────────────────────────

/// Operational efficiency.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OperationalEfficiency {
    /// Referral date.
    pub referral_date: String,
    /// Appointment date.
    pub appointment_date: String,
    /// Wait time days.
    pub wait_time_days: Option<i32>,
    /// Service target days.
    pub service_target_days: Option<i32>,
    /// '' | 'attended_discharged' | 'attended_follow_up' | 'attended_pifu' |
    /// 'attended_onward_referral' | 'patient_cancelled' | 'patient_dna' | 'provider_cancelled'
    pub nhs_attendance_outcome: String,
}

// ──────────────────────────────────────────────
// Clinical Outcome (Step 4)
// ──────────────────────────────────────────────

/// Clinical outcome.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalOutcome {
    /// Presenting complaint.
    pub presenting_complaint: String,
    /// Diagnosis.
    pub diagnosis: String,
    /// Treatment delivered.
    pub treatment_delivered: String,
    /// '' | 'resolved' | 'improved' | 'unchanged' | 'worsened' | 'died'
    pub outcome_classification: String,
}

// ──────────────────────────────────────────────
// PROM — EQ-5D-5L (Step 5)
// Levels 1–5 each; VAS 0–100; null = not answered
// ──────────────────────────────────────────────

/// Prom eq5d5l.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PromEq5d5l {
    /// Before mobility.
    pub before_mobility: Option<i32>,
    /// Before self care.
    pub before_self_care: Option<i32>,
    /// Before usual activities.
    pub before_usual_activities: Option<i32>,
    /// Before pain discomfort.
    pub before_pain_discomfort: Option<i32>,
    /// Before anxiety depression.
    pub before_anxiety_depression: Option<i32>,
    /// Before vas.
    pub before_vas: Option<i32>,
    /// After mobility.
    pub after_mobility: Option<i32>,
    /// After self care.
    pub after_self_care: Option<i32>,
    /// After usual activities.
    pub after_usual_activities: Option<i32>,
    /// After pain discomfort.
    pub after_pain_discomfort: Option<i32>,
    /// After anxiety depression.
    pub after_anxiety_depression: Option<i32>,
    /// After vas.
    pub after_vas: Option<i32>,
}

// ──────────────────────────────────────────────
// PROM — Global Rating of Change (Step 6)
// ──────────────────────────────────────────────

/// Prom grc.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PromGrc {
    /// -3..=3, or null when missing.
    pub global_rating_of_change: Option<i32>,
    /// '' | 'excellent' | 'very_good' | 'good' | 'fair' | 'poor'
    pub self_rated_health: String,
}

// ──────────────────────────────────────────────
// PROM — PROMIS Global Health v1.2 (Step 7)
// ──────────────────────────────────────────────

/// Prom promis.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PromPromis {
    /// Item1 general health.
    pub item1_general_health: Option<i32>,
    /// Item2 quality of life.
    pub item2_quality_of_life: Option<i32>,
    /// Item3 physical health.
    pub item3_physical_health: Option<i32>,
    /// Item4 mental health.
    pub item4_mental_health: Option<i32>,
    /// Item5 satisfaction.
    pub item5_satisfaction: Option<i32>,
    /// Item6 fatigue frequency.
    pub item6_fatigue_frequency: Option<i32>,
    /// Item7 emotional problems.
    pub item7_emotional_problems: Option<i32>,
    /// Item8 social activities.
    pub item8_social_activities: Option<i32>,
    /// Item9 pain.
    pub item9_pain: Option<i32>,
    /// Item10 everyday activities.
    pub item10_everyday_activities: Option<i32>,
    /// Global physical health t score.
    pub global_physical_health_t_score: Option<f64>,
    /// Global mental health t score.
    pub global_mental_health_t_score: Option<f64>,
}

// ──────────────────────────────────────────────
// PREM — Friends and Family Test (Step 8)
// ──────────────────────────────────────────────

/// Prem fft.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PremFft {
    /// '' | 'extremely_likely' | 'likely' | 'neither' | 'unlikely' |
    /// 'extremely_unlikely' | 'dont_know'
    pub fft_response: String,
    /// Fft comment.
    pub fft_comment: String,
}

// ──────────────────────────────────────────────
// Follow-up Plan (Step 9)
// ──────────────────────────────────────────────

/// Followup plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FollowupPlan {
    /// '' | 'discharge' | 'pifu' | 'follow_up_booked' | 'onward_referral'
    pub disposition: String,
    /// Next appointment date.
    pub next_appointment_date: String,
    /// Onward referral specialty.
    pub onward_referral_specialty: String,
    /// Followup notes.
    pub followup_notes: String,
}

// ──────────────────────────────────────────────
// Sign-off (Step 10)
// ──────────────────────────────────────────────

/// Sign off.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SignOff {
    /// Reporting clinician name.
    pub reporting_clinician_name: String,
    /// Reporting clinician role.
    pub reporting_clinician_role: String,
    /// Signed off at.
    pub signed_off_at: String,
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient details.
    pub patient_details: PatientDetails,
    /// Encounter details.
    pub encounter_details: EncounterDetails,
    /// Operational efficiency.
    pub operational_efficiency: OperationalEfficiency,
    /// Clinical outcome.
    pub clinical_outcome: ClinicalOutcome,
    /// Prom eq5d5l.
    pub prom_eq5d5l: PromEq5d5l,
    /// Prom grc.
    pub prom_grc: PromGrc,
    /// Prom promis.
    pub prom_promis: PromPromis,
    /// Prem fft.
    pub prem_fft: PremFft,
    /// Followup plan.
    pub followup_plan: FollowupPlan,
    /// Sign off.
    pub sign_off: SignOff,
}

// ──────────────────────────────────────────────
// Grading result types
// ──────────────────────────────────────────────

/// Fired rule.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Domain.
    pub domain: String,
    /// Description.
    pub description: String,
    /// Grade.
    pub grade: DomainGrade,
}

/// Flagged issue.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FlaggedIssue {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// 'critical' | 'high' | 'medium' | 'low'
    pub priority: String,
}

/// Grading result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Overall grade.
    pub overall_grade: DomainGrade,
    /// Clinical grade.
    pub clinical_grade: DomainGrade,
    /// Prom grade.
    pub prom_grade: DomainGrade,
    /// Prem grade.
    pub prem_grade: DomainGrade,
    /// Operational grade.
    pub operational_grade: DomainGrade,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Flagged issues.
    pub flagged_issues: Vec<FlaggedIssue>,
    /// Timestamp.
    pub timestamp: String,
}
