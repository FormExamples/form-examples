use serde::{Deserialize, Serialize};

// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type RiskLevel = String;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub weight: Option<f64>,
    pub height: Option<f64>,
    pub bmi: Option<f64>,
}

/// Step 2 — Alcohol Use (AUDIT 10-item).
/// Each question scored 0-4 (Q9, Q10 scored 0, 2, 4).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlcoholUseAudit {
    pub audit_q1_frequency: i32,
    pub audit_q2_typical_quantity: i32,
    pub audit_q3_binge_frequency: i32,
    pub audit_q4_impaired_control: i32,
    pub audit_q5_failed_expectations: i32,
    pub audit_q6_morning_drinking: i32,
    pub audit_q7_guilt: i32,
    pub audit_q8_blackout: i32,
    pub audit_q9_injury: i32,
    pub audit_q10_concern: i32,
}

/// Step 3 — Drug Use (DAST-10).
/// Yes/no answers, Q3 is inversely scored.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DrugUseDast {
    pub dast_q1_non_medical_use: YesNo,
    pub dast_q2_poly_drug: YesNo,
    pub dast_q3_able_to_stop: YesNo,
    pub dast_q4_blackouts: YesNo,
    pub dast_q5_guilt: YesNo,
    pub dast_q6_complaints: YesNo,
    pub dast_q7_neglect: YesNo,
    pub dast_q8_illegal_activities: YesNo,
    pub dast_q9_withdrawal: YesNo,
    pub dast_q10_medical_problems: YesNo,
}

/// Step 4 — Substance Use History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubstanceUseHistory {
    pub age_first_alcohol_use: Option<i32>,
    pub age_first_drug_use: Option<i32>,
    pub primary_substance: String,
    pub primary_substance_other: String,
    pub secondary_substances: String,
    pub route_of_administration: String,
    pub frequency_of_use: String,
    pub duration_of_use: String,
    pub last_use_date: String,
    pub current_use_status: String,
    pub iv_drug_use: YesNo,
    pub needle_sharing: YesNo,
}

/// Step 5 — Withdrawal Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WithdrawalAssessment {
    pub currently_in_withdrawal: YesNo,
    pub withdrawal_substance: String,
    pub tremor: String,
    pub sweating: String,
    pub nausea_vomiting: String,
    pub anxiety: String,
    pub agitation: String,
    pub seizure_history: YesNo,
    pub delirium_tremens_history: YesNo,
    pub hallucinations: YesNo,
    pub last_drink_drug_hours: Option<i32>,
    pub withdrawal_severity: String,
    pub medically_supervised_detox_needed: YesNo,
}

/// Step 6 — Mental Health Comorbidities.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MentalHealthComorbidities {
    pub depression: YesNo,
    pub depression_severity: String,
    pub anxiety_disorder: YesNo,
    pub anxiety_disorder_type: String,
    pub ptsd: YesNo,
    pub ptsd_details: String,
    pub bipolar_disorder: YesNo,
    pub psychosis: YesNo,
    pub personality_disorder: YesNo,
    pub eating_disorder: YesNo,
    pub adhd: YesNo,
    pub suicidal_ideation: YesNo,
    pub suicidal_ideation_current: YesNo,
    pub self_harm_history: YesNo,
    pub previous_suicide_attempts: YesNo,
    pub psychiatric_medication: YesNo,
    pub psychiatric_medication_details: String,
}

/// Step 7 — Physical Health Impact.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhysicalHealthImpact {
    pub liver_disease: YesNo,
    pub liver_disease_type: String,
    pub hepatitis_b: YesNo,
    pub hepatitis_c: YesNo,
    pub hiv_status: String,
    pub cardiovascular_issues: YesNo,
    pub cardiovascular_details: String,
    pub respiratory_issues: YesNo,
    pub respiratory_details: String,
    pub gastrointestinal_issues: YesNo,
    pub gastrointestinal_details: String,
    pub neurological_issues: YesNo,
    pub neurological_details: String,
    pub nutritional_deficiency: YesNo,
    pub chronic_pain: YesNo,
    pub chronic_pain_details: String,
    pub overdose_history: YesNo,
    pub overdose_count: Option<i32>,
    pub last_overdose_date: String,
}

/// Step 8 — Social & Legal Impact.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SocialLegalImpact {
    pub employment_status: String,
    pub occupation: String,
    pub employment_affected: YesNo,
    pub housing_status: String,
    pub relationship_status: String,
    pub relationship_impact: YesNo,
    pub dependents: Option<i32>,
    pub children_safeguarding_concerns: YesNo,
    pub social_support: String,
    pub criminal_record: YesNo,
    pub criminal_record_details: String,
    pub current_legal_issues: YesNo,
    pub current_legal_details: String,
    pub dui_dwi_history: YesNo,
    pub financial_difficulties: YesNo,
    pub domestic_violence: YesNo,
    pub domestic_violence_details: String,
}

/// Step 9 — Previous Treatment History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreviousTreatmentHistory {
    pub previous_treatment: YesNo,
    pub number_of_treatment_episodes: Option<i32>,
    pub previous_detox: YesNo,
    pub detox_setting: String,
    pub previous_rehab: YesNo,
    pub rehab_type: String,
    pub previous_counselling: YesNo,
    pub counselling_type: String,
    pub previous_medication_assisted: YesNo,
    pub mat_medication: String,
    pub self_help_groups: YesNo,
    pub self_help_group_type: String,
    pub longest_period_abstinent: String,
    pub relapse_triggers: String,
}

/// Step 10 — Treatment Planning & Goals.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TreatmentPlanningGoals {
    pub treatment_goal: String,
    pub readiness_to_change: String,
    pub motivation_level: String,
    pub preferred_treatment_setting: String,
    pub interested_in_counselling: YesNo,
    pub interested_in_medication: YesNo,
    pub interested_in_self_help: YesNo,
    pub barriers_to_treatment: String,
    pub support_network_available: YesNo,
    pub support_network_details: String,
    pub risk_of_relapse: String,
    pub safety_plan_needed: YesNo,
    pub naloxone_provided: YesNo,
    pub follow_up_plan: String,
}

/// Full Substance Abuse Assessment data record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub alcohol_use_audit: AlcoholUseAudit,
    pub drug_use_dast: DrugUseDast,
    pub substance_use_history: SubstanceUseHistory,
    pub withdrawal_assessment: WithdrawalAssessment,
    pub mental_health_comorbidities: MentalHealthComorbidities,
    pub physical_health_impact: PhysicalHealthImpact,
    pub social_legal_impact: SocialLegalImpact,
    pub previous_treatment_history: PreviousTreatmentHistory,
    pub treatment_planning_goals: TreatmentPlanningGoals,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub grade: u32,
}

/// A safety flag computed independently of scoring.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a substance abuse assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub audit_score: i32,
    pub audit_risk_category: String,
    pub dast_score: i32,
    pub dast_risk_category: String,
    pub overall_risk: RiskLevel,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
