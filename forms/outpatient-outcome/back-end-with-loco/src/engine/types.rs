use serde::{Deserialize, Serialize};

/// Domain grade: A (best) through E (worst). Empty string = insufficient data.
pub type DomainGrade = String;

// ──────────────────────────────────────────────
// Patient Details (Step 1)
// ──────────────────────────────────────────────

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientDetails {
    pub given_name: String,
    pub family_name: String,
    pub date_of_birth: String,
    pub nhs_number: String,
    /// '' | 'male' | 'female' | 'other' | 'prefer_not_to_say'
    pub sex: String,
}

// ──────────────────────────────────────────────
// Encounter Details (Step 2)
// ──────────────────────────────────────────────

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EncounterDetails {
    pub clinic_date: String,
    pub specialty: String,
    pub clinician_name: String,
    /// '' | 'in_person' | 'telephone' | 'video'
    pub modality: String,
    /// '' | 'new' | 'follow_up' | 'pifu'
    pub appointment_type: String,
}

// ──────────────────────────────────────────────
// Operational Efficiency (Step 3)
// ──────────────────────────────────────────────

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OperationalEfficiency {
    pub referral_date: String,
    pub appointment_date: String,
    pub wait_time_days: Option<i32>,
    pub service_target_days: Option<i32>,
    /// '' | 'attended_discharged' | 'attended_follow_up' | 'attended_pifu' |
    /// 'attended_onward_referral' | 'patient_cancelled' | 'patient_dna' | 'provider_cancelled'
    pub nhs_attendance_outcome: String,
}

// ──────────────────────────────────────────────
// Clinical Outcome (Step 4)
// ──────────────────────────────────────────────

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalOutcome {
    pub presenting_complaint: String,
    pub diagnosis: String,
    pub treatment_delivered: String,
    /// '' | 'resolved' | 'improved' | 'unchanged' | 'worsened' | 'died'
    pub outcome_classification: String,
}

// ──────────────────────────────────────────────
// PROM — EQ-5D-5L (Step 5)
// Levels 1–5 each; VAS 0–100; null = not answered
// ──────────────────────────────────────────────

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PromEq5d5l {
    pub before_mobility: Option<i32>,
    pub before_self_care: Option<i32>,
    pub before_usual_activities: Option<i32>,
    pub before_pain_discomfort: Option<i32>,
    pub before_anxiety_depression: Option<i32>,
    pub before_vas: Option<i32>,
    pub after_mobility: Option<i32>,
    pub after_self_care: Option<i32>,
    pub after_usual_activities: Option<i32>,
    pub after_pain_discomfort: Option<i32>,
    pub after_anxiety_depression: Option<i32>,
    pub after_vas: Option<i32>,
}

// ──────────────────────────────────────────────
// PROM — Global Rating of Change (Step 6)
// ──────────────────────────────────────────────

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

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PromPromis {
    pub item1_general_health: Option<i32>,
    pub item2_quality_of_life: Option<i32>,
    pub item3_physical_health: Option<i32>,
    pub item4_mental_health: Option<i32>,
    pub item5_satisfaction: Option<i32>,
    pub item6_fatigue_frequency: Option<i32>,
    pub item7_emotional_problems: Option<i32>,
    pub item8_social_activities: Option<i32>,
    pub item9_pain: Option<i32>,
    pub item10_everyday_activities: Option<i32>,
    pub global_physical_health_t_score: Option<f64>,
    pub global_mental_health_t_score: Option<f64>,
}

// ──────────────────────────────────────────────
// PREM — Friends and Family Test (Step 8)
// ──────────────────────────────────────────────

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PremFft {
    /// '' | 'extremely_likely' | 'likely' | 'neither' | 'unlikely' |
    /// 'extremely_unlikely' | 'dont_know'
    pub fft_response: String,
    pub fft_comment: String,
}

// ──────────────────────────────────────────────
// Follow-up Plan (Step 9)
// ──────────────────────────────────────────────

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FollowupPlan {
    /// '' | 'discharge' | 'pifu' | 'follow_up_booked' | 'onward_referral'
    pub disposition: String,
    pub next_appointment_date: String,
    pub onward_referral_specialty: String,
    pub followup_notes: String,
}

// ──────────────────────────────────────────────
// Sign-off (Step 10)
// ──────────────────────────────────────────────

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SignOff {
    pub reporting_clinician_name: String,
    pub reporting_clinician_role: String,
    pub signed_off_at: String,
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub patient_details: PatientDetails,
    pub encounter_details: EncounterDetails,
    pub operational_efficiency: OperationalEfficiency,
    pub clinical_outcome: ClinicalOutcome,
    pub prom_eq5d5l: PromEq5d5l,
    pub prom_grc: PromGrc,
    pub prom_promis: PromPromis,
    pub prem_fft: PremFft,
    pub followup_plan: FollowupPlan,
    pub sign_off: SignOff,
}

// ──────────────────────────────────────────────
// Grading result types
// ──────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub domain: String,
    pub description: String,
    pub grade: DomainGrade,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FlaggedIssue {
    pub id: String,
    pub category: String,
    pub message: String,
    /// 'critical' | 'high' | 'medium' | 'low'
    pub priority: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub overall_grade: DomainGrade,
    pub clinical_grade: DomainGrade,
    pub prom_grade: DomainGrade,
    pub prem_grade: DomainGrade,
    pub operational_grade: DomainGrade,
    pub fired_rules: Vec<FiredRule>,
    pub flagged_issues: Vec<FlaggedIssue>,
    pub timestamp: String,
}
