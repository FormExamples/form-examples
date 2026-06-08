//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases mirroring the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Yes no unknown.
pub type YesNoUnknown = String;
/// Sex.
pub type Sex = String;
/// Risk level.
pub type RiskLevel = String;
/// Referral urgency.
pub type ReferralUrgency = String;

/// Step 1 — Proband demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProbandDemographics {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: Sex,
    /// Mrn.
    pub mrn: String,
    /// Preferred contact.
    pub preferred_contact: String,
}

/// Step 2 — Presenting concern / referral.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PresentingConcern {
    /// Chief concern.
    pub chief_concern: String,
    /// Referral reason.
    pub referral_reason: String,
    /// Referring clinician.
    pub referring_clinician: String,
    /// Urgency.
    pub urgency: ReferralUrgency,
    /// Suspected syndrome.
    pub suspected_syndrome: String,
}

/// A cancer diagnosis on the proband.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProbandCancer {
    /// Kind.
    #[serde(rename = "type")]
    pub kind: String,
    /// Age at diagnosis.
    pub age_at_diagnosis: Option<i32>,
    /// Bilateral.
    pub bilateral: YesNo,
    /// Treatment.
    pub treatment: String,
}

/// Step 3 — Personal medical history of the proband.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PersonalMedicalHistory {
    /// Personal cancer history.
    pub personal_cancer_history: YesNo,
    /// Cancers.
    pub cancers: Vec<ProbandCancer>,
    /// Multiple primary cancers.
    pub multiple_primary_cancers: YesNo,
    /// Congenital anomalies.
    pub congenital_anomalies: YesNo,
    /// Congenital anomalies details.
    pub congenital_anomalies_details: String,
    /// Developmental delay.
    pub developmental_delay: YesNo,
    /// Prior radiation.
    pub prior_radiation: YesNo,
    /// Other significant history.
    pub other_significant_history: String,
}

/// A cancer record on a relative.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RelativeCancer {
    /// Kind.
    #[serde(rename = "type")]
    pub kind: String,
    /// Age at diagnosis.
    pub age_at_diagnosis: Option<i32>,
}

/// A relative on the three-generation pedigree.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Relative {
    /// ID.
    pub id: String,
    /// Relation.
    pub relation: String,
    /// Side.
    pub side: String,
    /// Generation.
    pub generation: u8,
    /// Sex.
    pub sex: Sex,
    /// Name.
    pub name: String,
    /// Affected with cancer.
    pub affected_with_cancer: YesNoUnknown,
    /// Cancers.
    pub cancers: Vec<RelativeCancer>,
    /// Deceased.
    pub deceased: YesNoUnknown,
    /// Age at death.
    pub age_at_death: Option<i32>,
    /// Cause of death.
    pub cause_of_death: String,
    /// Notes.
    pub notes: String,
}

/// Step 4 — Three-generation family pedigree.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FamilyPedigree {
    /// Maternal grandmother.
    pub maternal_grandmother: Relative,
    /// Maternal grandfather.
    pub maternal_grandfather: Relative,
    /// Paternal grandmother.
    pub paternal_grandmother: Relative,
    /// Paternal grandfather.
    pub paternal_grandfather: Relative,
    /// Mother.
    pub mother: Relative,
    /// Father.
    pub father: Relative,
    /// Maternal aunts uncles.
    pub maternal_aunts_uncles: Vec<Relative>,
    /// Paternal aunts uncles.
    pub paternal_aunts_uncles: Vec<Relative>,
    /// Siblings.
    pub siblings: Vec<Relative>,
    /// Children.
    pub children: Vec<Relative>,
    /// Maternal cousins.
    pub maternal_cousins: Vec<Relative>,
    /// Paternal cousins.
    pub paternal_cousins: Vec<Relative>,
}

/// Step 5 — Consanguinity and ancestry.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConsanguinityAncestry {
    /// Consanguinity.
    pub consanguinity: YesNo,
    /// Consanguinity details.
    pub consanguinity_details: String,
    /// Maternal ancestry.
    pub maternal_ancestry: String,
    /// Paternal ancestry.
    pub paternal_ancestry: String,
    /// Ashkenazi jewish.
    pub ashkenazi_jewish: YesNo,
    /// Sephardic jewish.
    pub sephardic_jewish: YesNo,
    /// Founding population.
    pub founding_population: YesNo,
    /// Founding population details.
    pub founding_population_details: String,
}

/// Manchester Score raw inputs (per-cancer counts).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ManchesterInputs {
    /// Proband female breast under30.
    pub proband_female_breast_under30: Option<i32>,
    /// Proband female breast30to39.
    pub proband_female_breast30to39: Option<i32>,
    /// Proband female breast40to49.
    pub proband_female_breast40to49: Option<i32>,
    /// Proband ovarian under60.
    pub proband_ovarian_under60: Option<i32>,
    /// Proband male breast.
    pub proband_male_breast: Option<i32>,
    /// Relative female breast under30.
    pub relative_female_breast_under30: Option<i32>,
    /// Relative female breast30to39.
    pub relative_female_breast30to39: Option<i32>,
    /// Relative female breast40to49.
    pub relative_female_breast40to49: Option<i32>,
    /// Relative ovarian under60.
    pub relative_ovarian_under60: Option<i32>,
    /// Relative male breast.
    pub relative_male_breast: Option<i32>,
    /// Relative pancreatic under60.
    pub relative_pancreatic_under60: Option<i32>,
    /// Relative prostate under60.
    pub relative_prostate_under60: Option<i32>,
}

/// Revised Bethesda criteria inputs (five binary items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BethesdaInputs {
    /// Crc under50.
    pub crc_under50: YesNo,
    /// Synchronous metachronous.
    pub synchronous_metachronous: YesNo,
    /// Msi histology.
    pub msi_histology: YesNo,
    /// First degree lynch tumour.
    pub first_degree_lynch_tumour: YesNo,
    /// Multiple relatives lynch.
    pub multiple_relatives_lynch: YesNo,
}

/// Tyrer-Cuzick (IBIS) inputs — captured for record-keeping; external
/// risk percentages drive the grader rules.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TyrerCuzickInputs {
    /// Age years.
    pub age_years: Option<i32>,
    /// Age at menarche.
    pub age_at_menarche: Option<i32>,
    /// Parous.
    pub parous: YesNo,
    /// Age at first live birth.
    pub age_at_first_live_birth: Option<i32>,
    /// Menopausal.
    pub menopausal: YesNo,
    /// Age at menopause.
    pub age_at_menopause: Option<i32>,
    /// Height cm.
    pub height_cm: Option<f64>,
    /// Weight kg.
    pub weight_kg: Option<f64>,
    /// Hrt current.
    pub hrt_current: YesNo,
    /// Prior benign breast disease.
    pub prior_benign_breast_disease: YesNo,
    /// Atypical hyperplasia.
    pub atypical_hyperplasia: YesNo,
    /// Lcis.
    pub lcis: YesNo,
    /// Dense.
    pub dense: YesNo,
    /// External ten year risk.
    pub external_ten_year_risk: Option<f64>,
    /// External lifetime risk.
    pub external_lifetime_risk: Option<f64>,
}

/// PREMM5 inputs.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PREMM5Inputs {
    /// Proband colorectal.
    pub proband_colorectal: YesNo,
    /// Proband endometrial.
    pub proband_endometrial: YesNo,
    /// Proband other lynch tumour.
    pub proband_other_lynch_tumour: YesNo,
    /// Youngest proband age at lynch tumour.
    pub youngest_proband_age_at_lynch_tumour: Option<i32>,
    /// First degree with crc.
    pub first_degree_with_crc: Option<i32>,
    /// First degree with endometrial.
    pub first_degree_with_endometrial: Option<i32>,
    /// First degree with other lynch.
    pub first_degree_with_other_lynch: Option<i32>,
    /// Second degree with lynch.
    pub second_degree_with_lynch: Option<i32>,
    /// Youngest relative age at lynch tumour.
    pub youngest_relative_age_at_lynch_tumour: Option<i32>,
    /// External premm5 percent.
    #[serde(rename = "externalPREMM5Percent")]
    pub external_premm5_percent: Option<f64>,
}

/// Step 6 — Targeted risk scoring.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TargetedRiskScoring {
    /// Manchester.
    pub manchester: ManchesterInputs,
    /// Bethesda.
    pub bethesda: BethesdaInputs,
    /// Tyrer cuzick.
    pub tyrer_cuzick: TyrerCuzickInputs,
    /// Premm5.
    pub premm5: PREMM5Inputs,
}

/// A single prior genetic-test record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PriorTestRecord {
    /// Test name.
    pub test_name: String,
    /// Laboratory.
    pub laboratory: String,
    /// Test date.
    pub test_date: String,
    /// Result summary.
    pub result_summary: String,
}

/// Step 7 — Prior genetic testing.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PriorGeneticTesting {
    /// Prior testing.
    pub prior_testing: YesNo,
    /// Prior tests.
    pub prior_tests: Vec<PriorTestRecord>,
    /// Variants of uncertain significance.
    pub variants_of_uncertain_significance: YesNo,
    /// Variants of uncertain significance details.
    pub variants_of_uncertain_significance_details: String,
    /// Familial variant known.
    pub familial_variant_known: YesNo,
    /// Familial variant details.
    pub familial_variant_details: String,
    /// Prior genetic counselling.
    pub prior_genetic_counselling: YesNo,
    /// Prior counselling notes.
    pub prior_counselling_notes: String,
}

/// Step 8 — Patient understanding and concerns.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientUnderstandingConcerns {
    /// Understanding of referral.
    pub understanding_of_referral: String,
    /// Primary concerns.
    pub primary_concerns: String,
    /// Expectations.
    pub expectations: String,
    /// Insurance concerns.
    pub insurance_concerns: YesNo,
    /// Confidentiality concerns.
    pub confidentiality_concerns: YesNo,
    /// Reproductive implications.
    pub reproductive_implications: YesNo,
    /// Support system.
    pub support_system: String,
    /// Consent to testing.
    pub consent_to_testing: YesNo,
}

/// Step 9 — Recommendation and referral plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecommendationReferralPlan {
    /// Clinician assigned risk.
    pub clinician_assigned_risk: RiskLevel,
    /// Recommend brca testing.
    #[serde(rename = "recommendBRCATesting")]
    pub recommend_brca_testing: YesNo,
    /// Recommend lynch testing.
    pub recommend_lynch_testing: YesNo,
    /// Recommend panel testing.
    pub recommend_panel_testing: YesNo,
    /// Recommend mmr ihc.
    #[serde(rename = "recommendMMRIHC")]
    pub recommend_mmr_ihc: YesNo,
    /// Recommended panel.
    pub recommended_panel: String,
    /// Refer clinical genetics.
    pub refer_clinical_genetics: YesNo,
    /// Refer breast surveillance.
    pub refer_breast_surveillance: YesNo,
    /// Refer colonoscopy.
    pub refer_colonoscopy: YesNo,
    /// Refer psychological support.
    pub refer_psychological_support: YesNo,
    /// Referral urgency.
    pub referral_urgency: ReferralUrgency,
    /// Clinician summary.
    pub clinician_summary: String,
    /// Clinician name.
    pub clinician_name: String,
    /// Clinician role.
    pub clinician_role: String,
    /// Signature date.
    pub signature_date: String,
}

/// Full Genetics Assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Proband demographics.
    pub proband_demographics: ProbandDemographics,
    /// Presenting concern.
    pub presenting_concern: PresentingConcern,
    /// Personal medical history.
    pub personal_medical_history: PersonalMedicalHistory,
    /// Family pedigree.
    pub family_pedigree: FamilyPedigree,
    /// Consanguinity ancestry.
    pub consanguinity_ancestry: ConsanguinityAncestry,
    /// Targeted risk scoring.
    pub targeted_risk_scoring: TargetedRiskScoring,
    /// Prior genetic testing.
    pub prior_genetic_testing: PriorGeneticTesting,
    /// Patient understanding concerns.
    pub patient_understanding_concerns: PatientUnderstandingConcerns,
    /// Recommendation referral plan.
    pub recommendation_referral_plan: RecommendationReferralPlan,
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
    /// Severity.
    pub severity: RiskLevel,
}

/// A flagged issue surfaced for the clinician.
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

/// Grading output for a genetics assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Risk level.
    pub risk_level: RiskLevel,
    /// Manchester score.
    pub manchester_score: i32,
    /// Bethesda met.
    pub bethesda_met: i32,
    /// Premm5 score.
    #[serde(rename = "premm5Score")]
    pub premm5_score: Option<f64>,
    /// Tyrer cuzick lifetime.
    pub tyrer_cuzick_lifetime: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}

/// Derived context used by rule evaluators.
#[derive(Debug, Clone)]
pub struct GraderContext {
    /// Manchester score.
    pub manchester_score: i32,
    /// Bethesda met.
    pub bethesda_met: i32,
    /// Premm5 score.
    pub premm5_score: Option<f64>,
    /// Tyrer cuzick lifetime.
    pub tyrer_cuzick_lifetime: f64,
    /// Affected first degree.
    pub affected_first_degree: i32,
    /// Early onset under50.
    pub early_onset_under50: i32,
    /// Paediatric cancers.
    pub paediatric_cancers: i32,
    /// Has male breast.
    pub has_male_breast: bool,
    /// Has ovarian.
    pub has_ovarian: bool,
    /// Has pancreatic.
    pub has_pancreatic: bool,
    /// Has bilateral breast.
    pub has_bilateral_breast: bool,
    /// Has multiple primaries.
    pub has_multiple_primaries: bool,
}
