//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Risk level.
pub type RiskLevel = String;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: String,
    /// Weight.
    pub weight: Option<f64>,
    /// Height.
    pub height: Option<f64>,
    /// BMI.
    pub bmi: Option<f64>,
}

/// Step 2 — Alcohol Use (AUDIT 10-item).
/// Each question scored 0-4 (Q9, Q10 scored 0, 2, 4).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlcoholUseAudit {
    /// Audit q1 frequency.
    pub audit_q1_frequency: i32,
    /// Audit q2 typical quantity.
    pub audit_q2_typical_quantity: i32,
    /// Audit q3 binge frequency.
    pub audit_q3_binge_frequency: i32,
    /// Audit q4 impaired control.
    pub audit_q4_impaired_control: i32,
    /// Audit q5 failed expectations.
    pub audit_q5_failed_expectations: i32,
    /// Audit q6 morning drinking.
    pub audit_q6_morning_drinking: i32,
    /// Audit q7 guilt.
    pub audit_q7_guilt: i32,
    /// Audit q8 blackout.
    pub audit_q8_blackout: i32,
    /// Audit q9 injury.
    pub audit_q9_injury: i32,
    /// Audit q10 concern.
    pub audit_q10_concern: i32,
}

/// Step 3 — Drug Use (DAST-10).
/// Yes/no answers, Q3 is inversely scored.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DrugUseDast {
    /// Dast q1 non medical use.
    pub dast_q1_non_medical_use: YesNo,
    /// Dast q2 poly drug.
    pub dast_q2_poly_drug: YesNo,
    /// Dast q3 able to stop.
    pub dast_q3_able_to_stop: YesNo,
    /// Dast q4 blackouts.
    pub dast_q4_blackouts: YesNo,
    /// Dast q5 guilt.
    pub dast_q5_guilt: YesNo,
    /// Dast q6 complaints.
    pub dast_q6_complaints: YesNo,
    /// Dast q7 neglect.
    pub dast_q7_neglect: YesNo,
    /// Dast q8 illegal activities.
    pub dast_q8_illegal_activities: YesNo,
    /// Dast q9 withdrawal.
    pub dast_q9_withdrawal: YesNo,
    /// Dast q10 medical problems.
    pub dast_q10_medical_problems: YesNo,
}

/// Step 4 — Substance Use History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubstanceUseHistory {
    /// Age first alcohol use.
    pub age_first_alcohol_use: Option<i32>,
    /// Age first drug use.
    pub age_first_drug_use: Option<i32>,
    /// Primary substance.
    pub primary_substance: String,
    /// Primary substance other.
    pub primary_substance_other: String,
    /// Secondary substances.
    pub secondary_substances: String,
    /// Route of administration.
    pub route_of_administration: String,
    /// Frequency of use.
    pub frequency_of_use: String,
    /// Duration of use.
    pub duration_of_use: String,
    /// Last use date.
    pub last_use_date: String,
    /// Current use status.
    pub current_use_status: String,
    /// IV drug use.
    pub iv_drug_use: YesNo,
    /// Needle sharing.
    pub needle_sharing: YesNo,
}

/// Step 5 — Withdrawal Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WithdrawalAssessment {
    /// Currently in withdrawal.
    pub currently_in_withdrawal: YesNo,
    /// Withdrawal substance.
    pub withdrawal_substance: String,
    /// Tremor.
    pub tremor: String,
    /// Sweating.
    pub sweating: String,
    /// Nausea vomiting.
    pub nausea_vomiting: String,
    /// Anxiety.
    pub anxiety: String,
    /// Agitation.
    pub agitation: String,
    /// Seizure history.
    pub seizure_history: YesNo,
    /// Delirium tremens history.
    pub delirium_tremens_history: YesNo,
    /// Hallucinations.
    pub hallucinations: YesNo,
    /// Last drink drug hours.
    pub last_drink_drug_hours: Option<i32>,
    /// Withdrawal severity.
    pub withdrawal_severity: String,
    /// Medically supervised detox needed.
    pub medically_supervised_detox_needed: YesNo,
}

/// Step 6 — Mental Health Comorbidities.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MentalHealthComorbidities {
    /// Depression.
    pub depression: YesNo,
    /// Depression severity.
    pub depression_severity: String,
    /// Anxiety disorder.
    pub anxiety_disorder: YesNo,
    /// Anxiety disorder type.
    pub anxiety_disorder_type: String,
    /// Ptsd.
    pub ptsd: YesNo,
    /// Ptsd details.
    pub ptsd_details: String,
    /// Bipolar disorder.
    pub bipolar_disorder: YesNo,
    /// Psychosis.
    pub psychosis: YesNo,
    /// Personality disorder.
    pub personality_disorder: YesNo,
    /// Eating disorder.
    pub eating_disorder: YesNo,
    /// Adhd.
    pub adhd: YesNo,
    /// Suicidal ideation.
    pub suicidal_ideation: YesNo,
    /// Suicidal ideation current.
    pub suicidal_ideation_current: YesNo,
    /// Self harm history.
    pub self_harm_history: YesNo,
    /// Previous suicide attempts.
    pub previous_suicide_attempts: YesNo,
    /// Psychiatric medication.
    pub psychiatric_medication: YesNo,
    /// Psychiatric medication details.
    pub psychiatric_medication_details: String,
}

/// Step 7 — Physical Health Impact.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhysicalHealthImpact {
    /// Liver disease.
    pub liver_disease: YesNo,
    /// Liver disease type.
    pub liver_disease_type: String,
    /// Hepatitis b.
    pub hepatitis_b: YesNo,
    /// Hepatitis c.
    pub hepatitis_c: YesNo,
    /// Hiv status.
    pub hiv_status: String,
    /// Cardiovascular issues.
    pub cardiovascular_issues: YesNo,
    /// Cardiovascular details.
    pub cardiovascular_details: String,
    /// Respiratory issues.
    pub respiratory_issues: YesNo,
    /// Respiratory details.
    pub respiratory_details: String,
    /// Gastrointestinal issues.
    pub gastrointestinal_issues: YesNo,
    /// Gastrointestinal details.
    pub gastrointestinal_details: String,
    /// Neurological issues.
    pub neurological_issues: YesNo,
    /// Neurological details.
    pub neurological_details: String,
    /// Nutritional deficiency.
    pub nutritional_deficiency: YesNo,
    /// Chronic pain.
    pub chronic_pain: YesNo,
    /// Chronic pain details.
    pub chronic_pain_details: String,
    /// Overdose history.
    pub overdose_history: YesNo,
    /// Overdose count.
    pub overdose_count: Option<i32>,
    /// Last overdose date.
    pub last_overdose_date: String,
}

/// Step 8 — Social & Legal Impact.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SocialLegalImpact {
    /// Employment status.
    pub employment_status: String,
    /// Occupation.
    pub occupation: String,
    /// Employment affected.
    pub employment_affected: YesNo,
    /// Housing status.
    pub housing_status: String,
    /// Relationship status.
    pub relationship_status: String,
    /// Relationship impact.
    pub relationship_impact: YesNo,
    /// Dependents.
    pub dependents: Option<i32>,
    /// Children safeguarding concerns.
    pub children_safeguarding_concerns: YesNo,
    /// Social support.
    pub social_support: String,
    /// Criminal record.
    pub criminal_record: YesNo,
    /// Criminal record details.
    pub criminal_record_details: String,
    /// Current legal issues.
    pub current_legal_issues: YesNo,
    /// Current legal details.
    pub current_legal_details: String,
    /// Dui dwi history.
    pub dui_dwi_history: YesNo,
    /// Financial difficulties.
    pub financial_difficulties: YesNo,
    /// Domestic violence.
    pub domestic_violence: YesNo,
    /// Domestic violence details.
    pub domestic_violence_details: String,
}

/// Step 9 — Previous Treatment History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreviousTreatmentHistory {
    /// Previous treatment.
    pub previous_treatment: YesNo,
    /// Number of treatment episodes.
    pub number_of_treatment_episodes: Option<i32>,
    /// Previous detox.
    pub previous_detox: YesNo,
    /// Detox setting.
    pub detox_setting: String,
    /// Previous rehab.
    pub previous_rehab: YesNo,
    /// Rehab type.
    pub rehab_type: String,
    /// Previous counselling.
    pub previous_counselling: YesNo,
    /// Counselling type.
    pub counselling_type: String,
    /// Previous medication assisted.
    pub previous_medication_assisted: YesNo,
    /// Mat medication.
    pub mat_medication: String,
    /// Self help groups.
    pub self_help_groups: YesNo,
    /// Self help group type.
    pub self_help_group_type: String,
    /// Longest period abstinent.
    pub longest_period_abstinent: String,
    /// Relapse triggers.
    pub relapse_triggers: String,
}

/// Step 10 — Treatment Planning & Goals.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TreatmentPlanningGoals {
    /// Treatment goal.
    pub treatment_goal: String,
    /// Readiness to change.
    pub readiness_to_change: String,
    /// Motivation level.
    pub motivation_level: String,
    /// Preferred treatment setting.
    pub preferred_treatment_setting: String,
    /// Interested in counselling.
    pub interested_in_counselling: YesNo,
    /// Interested in medication.
    pub interested_in_medication: YesNo,
    /// Interested in self help.
    pub interested_in_self_help: YesNo,
    /// Barriers to treatment.
    pub barriers_to_treatment: String,
    /// Support network available.
    pub support_network_available: YesNo,
    /// Support network details.
    pub support_network_details: String,
    /// Risk of relapse.
    pub risk_of_relapse: String,
    /// Safety plan needed.
    pub safety_plan_needed: YesNo,
    /// Naloxone provided.
    pub naloxone_provided: YesNo,
    /// Follow up plan.
    pub follow_up_plan: String,
}

/// Full Substance Abuse Assessment data record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Alcohol use audit.
    pub alcohol_use_audit: AlcoholUseAudit,
    /// Drug use dast.
    pub drug_use_dast: DrugUseDast,
    /// Substance use history.
    pub substance_use_history: SubstanceUseHistory,
    /// Withdrawal assessment.
    pub withdrawal_assessment: WithdrawalAssessment,
    /// Mental health comorbidities.
    pub mental_health_comorbidities: MentalHealthComorbidities,
    /// Physical health impact.
    pub physical_health_impact: PhysicalHealthImpact,
    /// Social legal impact.
    pub social_legal_impact: SocialLegalImpact,
    /// Previous treatment history.
    pub previous_treatment_history: PreviousTreatmentHistory,
    /// Treatment planning goals.
    pub treatment_planning_goals: TreatmentPlanningGoals,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Grade.
    pub grade: u32,
}

/// A safety flag computed independently of scoring.
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

/// Grading output for a substance abuse assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Audit score.
    pub audit_score: i32,
    /// Audit risk category.
    pub audit_risk_category: String,
    /// Dast score.
    pub dast_score: i32,
    /// Dast risk category.
    pub dast_risk_category: String,
    /// Overall risk.
    pub overall_risk: RiskLevel,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
