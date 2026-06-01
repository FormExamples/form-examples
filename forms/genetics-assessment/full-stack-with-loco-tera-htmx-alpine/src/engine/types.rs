use serde::{Deserialize, Serialize};

// Type aliases mirroring the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type YesNoUnknown = String;
pub type Sex = String;
pub type RiskLevel = String;
pub type ReferralUrgency = String;

/// Step 1 — Proband demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProbandDemographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: Sex,
    pub mrn: String,
    pub preferred_contact: String,
}

/// Step 2 — Presenting concern / referral.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PresentingConcern {
    pub chief_concern: String,
    pub referral_reason: String,
    pub referring_clinician: String,
    pub urgency: ReferralUrgency,
    pub suspected_syndrome: String,
}

/// A cancer diagnosis on the proband.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProbandCancer {
    #[serde(rename = "type")]
    pub kind: String,
    pub age_at_diagnosis: Option<i32>,
    pub bilateral: YesNo,
    pub treatment: String,
}

/// Step 3 — Personal medical history of the proband.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PersonalMedicalHistory {
    pub personal_cancer_history: YesNo,
    pub cancers: Vec<ProbandCancer>,
    pub multiple_primary_cancers: YesNo,
    pub congenital_anomalies: YesNo,
    pub congenital_anomalies_details: String,
    pub developmental_delay: YesNo,
    pub prior_radiation: YesNo,
    pub other_significant_history: String,
}

/// A cancer record on a relative.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RelativeCancer {
    #[serde(rename = "type")]
    pub kind: String,
    pub age_at_diagnosis: Option<i32>,
}

/// A relative on the three-generation pedigree.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Relative {
    pub id: String,
    pub relation: String,
    pub side: String,
    pub generation: u8,
    pub sex: Sex,
    pub name: String,
    pub affected_with_cancer: YesNoUnknown,
    pub cancers: Vec<RelativeCancer>,
    pub deceased: YesNoUnknown,
    pub age_at_death: Option<i32>,
    pub cause_of_death: String,
    pub notes: String,
}

/// Step 4 — Three-generation family pedigree.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FamilyPedigree {
    pub maternal_grandmother: Relative,
    pub maternal_grandfather: Relative,
    pub paternal_grandmother: Relative,
    pub paternal_grandfather: Relative,
    pub mother: Relative,
    pub father: Relative,
    pub maternal_aunts_uncles: Vec<Relative>,
    pub paternal_aunts_uncles: Vec<Relative>,
    pub siblings: Vec<Relative>,
    pub children: Vec<Relative>,
    pub maternal_cousins: Vec<Relative>,
    pub paternal_cousins: Vec<Relative>,
}

/// Step 5 — Consanguinity and ancestry.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConsanguinityAncestry {
    pub consanguinity: YesNo,
    pub consanguinity_details: String,
    pub maternal_ancestry: String,
    pub paternal_ancestry: String,
    pub ashkenazi_jewish: YesNo,
    pub sephardic_jewish: YesNo,
    pub founding_population: YesNo,
    pub founding_population_details: String,
}

/// Manchester Score raw inputs (per-cancer counts).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ManchesterInputs {
    pub proband_female_breast_under30: Option<i32>,
    pub proband_female_breast30to39: Option<i32>,
    pub proband_female_breast40to49: Option<i32>,
    pub proband_ovarian_under60: Option<i32>,
    pub proband_male_breast: Option<i32>,
    pub relative_female_breast_under30: Option<i32>,
    pub relative_female_breast30to39: Option<i32>,
    pub relative_female_breast40to49: Option<i32>,
    pub relative_ovarian_under60: Option<i32>,
    pub relative_male_breast: Option<i32>,
    pub relative_pancreatic_under60: Option<i32>,
    pub relative_prostate_under60: Option<i32>,
}

/// Revised Bethesda criteria inputs (five binary items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BethesdaInputs {
    pub crc_under50: YesNo,
    pub synchronous_metachronous: YesNo,
    pub msi_histology: YesNo,
    pub first_degree_lynch_tumour: YesNo,
    pub multiple_relatives_lynch: YesNo,
}

/// Tyrer-Cuzick (IBIS) inputs — captured for record-keeping; external
/// risk percentages drive the grader rules.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TyrerCuzickInputs {
    pub age_years: Option<i32>,
    pub age_at_menarche: Option<i32>,
    pub parous: YesNo,
    pub age_at_first_live_birth: Option<i32>,
    pub menopausal: YesNo,
    pub age_at_menopause: Option<i32>,
    pub height_cm: Option<f64>,
    pub weight_kg: Option<f64>,
    pub hrt_current: YesNo,
    pub prior_benign_breast_disease: YesNo,
    pub atypical_hyperplasia: YesNo,
    pub lcis: YesNo,
    pub dense: YesNo,
    pub external_ten_year_risk: Option<f64>,
    pub external_lifetime_risk: Option<f64>,
}

/// PREMM5 inputs.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PREMM5Inputs {
    pub proband_colorectal: YesNo,
    pub proband_endometrial: YesNo,
    pub proband_other_lynch_tumour: YesNo,
    pub youngest_proband_age_at_lynch_tumour: Option<i32>,
    pub first_degree_with_crc: Option<i32>,
    pub first_degree_with_endometrial: Option<i32>,
    pub first_degree_with_other_lynch: Option<i32>,
    pub second_degree_with_lynch: Option<i32>,
    pub youngest_relative_age_at_lynch_tumour: Option<i32>,
    #[serde(rename = "externalPREMM5Percent")]
    pub external_premm5_percent: Option<f64>,
}

/// Step 6 — Targeted risk scoring.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TargetedRiskScoring {
    pub manchester: ManchesterInputs,
    pub bethesda: BethesdaInputs,
    pub tyrer_cuzick: TyrerCuzickInputs,
    pub premm5: PREMM5Inputs,
}

/// A single prior genetic-test record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PriorTestRecord {
    pub test_name: String,
    pub laboratory: String,
    pub test_date: String,
    pub result_summary: String,
}

/// Step 7 — Prior genetic testing.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PriorGeneticTesting {
    pub prior_testing: YesNo,
    pub prior_tests: Vec<PriorTestRecord>,
    pub variants_of_uncertain_significance: YesNo,
    pub variants_of_uncertain_significance_details: String,
    pub familial_variant_known: YesNo,
    pub familial_variant_details: String,
    pub prior_genetic_counselling: YesNo,
    pub prior_counselling_notes: String,
}

/// Step 8 — Patient understanding and concerns.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientUnderstandingConcerns {
    pub understanding_of_referral: String,
    pub primary_concerns: String,
    pub expectations: String,
    pub insurance_concerns: YesNo,
    pub confidentiality_concerns: YesNo,
    pub reproductive_implications: YesNo,
    pub support_system: String,
    pub consent_to_testing: YesNo,
}

/// Step 9 — Recommendation and referral plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecommendationReferralPlan {
    pub clinician_assigned_risk: RiskLevel,
    #[serde(rename = "recommendBRCATesting")]
    pub recommend_brca_testing: YesNo,
    pub recommend_lynch_testing: YesNo,
    pub recommend_panel_testing: YesNo,
    #[serde(rename = "recommendMMRIHC")]
    pub recommend_mmr_ihc: YesNo,
    pub recommended_panel: String,
    pub refer_clinical_genetics: YesNo,
    pub refer_breast_surveillance: YesNo,
    pub refer_colonoscopy: YesNo,
    pub refer_psychological_support: YesNo,
    pub referral_urgency: ReferralUrgency,
    pub clinician_summary: String,
    pub clinician_name: String,
    pub clinician_role: String,
    pub signature_date: String,
}

/// Full Genetics Assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub proband_demographics: ProbandDemographics,
    pub presenting_concern: PresentingConcern,
    pub personal_medical_history: PersonalMedicalHistory,
    pub family_pedigree: FamilyPedigree,
    pub consanguinity_ancestry: ConsanguinityAncestry,
    pub targeted_risk_scoring: TargetedRiskScoring,
    pub prior_genetic_testing: PriorGeneticTesting,
    pub patient_understanding_concerns: PatientUnderstandingConcerns,
    pub recommendation_referral_plan: RecommendationReferralPlan,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub severity: RiskLevel,
}

/// A flagged issue surfaced for the clinician.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a genetics assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub risk_level: RiskLevel,
    pub manchester_score: i32,
    pub bethesda_met: i32,
    #[serde(rename = "premm5Score")]
    pub premm5_score: Option<f64>,
    pub tyrer_cuzick_lifetime: f64,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}

/// Derived context used by rule evaluators.
#[derive(Debug, Clone)]
pub struct GraderContext {
    pub manchester_score: i32,
    pub bethesda_met: i32,
    pub premm5_score: Option<f64>,
    pub tyrer_cuzick_lifetime: f64,
    pub affected_first_degree: i32,
    pub early_onset_under50: i32,
    pub paediatric_cancers: i32,
    pub has_male_breast: bool,
    pub has_ovarian: bool,
    pub has_pancreatic: bool,
    pub has_bilateral_breast: bool,
    pub has_multiple_primaries: bool,
}
