//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Risk level.
pub type RiskLevel = String;

// ─── Patient Information (Step 1) ────────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: String,
    /// NHS number.
    pub nhs_number: String,
}

// ─── Referral Reason (Step 2) ────────────────────────────────

/// Referral reason.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ReferralReason {
    /// Referral indication.
    pub referral_indication: String,
    /// Referring clinician.
    pub referring_clinician: String,
    /// Urgency.
    pub urgency: String,
    /// Referral date.
    pub referral_date: String,
}

// ─── Family Pedigree (Step 3) ────────────────────────────────

/// Family pedigree.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct FamilyPedigree {
    /// Maternal grandmother conditions.
    pub maternal_grandmother_conditions: String,
    /// Maternal grandmother cancers.
    pub maternal_grandmother_cancers: String,
    /// Maternal grandmother age at diagnosis.
    pub maternal_grandmother_age_at_diagnosis: String,
    /// Maternal grandmother deceased.
    pub maternal_grandmother_deceased: String,
    /// Maternal grandfather conditions.
    pub maternal_grandfather_conditions: String,
    /// Maternal grandfather cancers.
    pub maternal_grandfather_cancers: String,
    /// Maternal grandfather age at diagnosis.
    pub maternal_grandfather_age_at_diagnosis: String,
    /// Maternal grandfather deceased.
    pub maternal_grandfather_deceased: String,
    /// Paternal grandmother conditions.
    pub paternal_grandmother_conditions: String,
    /// Paternal grandmother cancers.
    pub paternal_grandmother_cancers: String,
    /// Paternal grandmother age at diagnosis.
    pub paternal_grandmother_age_at_diagnosis: String,
    /// Paternal grandmother deceased.
    pub paternal_grandmother_deceased: String,
    /// Paternal grandfather conditions.
    pub paternal_grandfather_conditions: String,
    /// Paternal grandfather cancers.
    pub paternal_grandfather_cancers: String,
    /// Paternal grandfather age at diagnosis.
    pub paternal_grandfather_age_at_diagnosis: String,
    /// Paternal grandfather deceased.
    pub paternal_grandfather_deceased: String,
    /// Mother conditions.
    pub mother_conditions: String,
    /// Mother cancers.
    pub mother_cancers: String,
    /// Mother age at diagnosis.
    pub mother_age_at_diagnosis: String,
    /// Mother deceased.
    pub mother_deceased: String,
    /// Father conditions.
    pub father_conditions: String,
    /// Father cancers.
    pub father_cancers: String,
    /// Father age at diagnosis.
    pub father_age_at_diagnosis: String,
    /// Father deceased.
    pub father_deceased: String,
    /// Siblings details.
    pub siblings_details: String,
    /// Children details.
    pub children_details: String,
}

// ─── Personal Medical History (Step 4) ───────────────────────

/// Personal medical history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PersonalMedicalHistory {
    /// Personal cancer history.
    pub personal_cancer_history: String,
    /// Cancer type.
    pub cancer_type: String,
    /// Age at diagnosis.
    pub age_at_diagnosis: Option<u8>,
    /// Bilateral cancer.
    pub bilateral_cancer: String,
    /// Multiple primary cancers.
    pub multiple_primary_cancers: String,
}

// ─── Cancer Risk Assessment (Step 5) ─────────────────────────

/// Cancer risk assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CancerRiskAssessment {
    /// Cancer gene panel.
    pub cancer_gene_panel: String,
    /// Brca result.
    pub brca_result: String,
    /// Lynch result.
    pub lynch_result: String,
    /// Manchester score.
    pub manchester_score: Option<u8>,
    /// Affected relatives under50.
    pub affected_relatives_under50: Option<u8>,
}

// ─── Cardiac Genetic Risk (Step 6) ───────────────────────────

/// Cardiac genetic risk.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CardiacGeneticRisk {
    /// Familial hypercholesterolemia.
    pub familial_hypercholesterolemia: String,
    /// Cardiomyopathy.
    pub cardiomyopathy: String,
    /// Aortic aneurysm.
    pub aortic_aneurysm: String,
    /// Sudden cardiac death.
    pub sudden_cardiac_death: String,
    /// Early onset cvd.
    pub early_onset_cvd: String,
    /// Cardiac gene result.
    pub cardiac_gene_result: String,
    /// Cardiovascular details.
    pub cardiovascular_details: String,
}

// ─── Reproductive Genetics (Step 7) ──────────────────────────

/// Reproductive genetics.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ReproductiveGenetics {
    /// Consanguinity.
    pub consanguinity: String,
    /// Carrier status.
    pub carrier_status: String,
    /// Carrier status details.
    pub carrier_status_details: String,
    /// Recurrent miscarriages.
    pub recurrent_miscarriages: String,
    /// Previous affected child.
    pub previous_affected_child: String,
    /// Previous affected child details.
    pub previous_affected_child_details: String,
    /// Prenatal testing wishes.
    pub prenatal_testing_wishes: String,
}

// ─── Genetic Testing Status (Step 8) ─────────────────────────

/// Genetic testing status.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GeneticTestingStatus {
    /// Previous genetic tests.
    pub previous_genetic_tests: String,
    /// Previous genetic tests details.
    pub previous_genetic_tests_details: String,
    /// Test results.
    pub test_results: String,
    /// Variants of uncertain significance.
    pub variants_of_uncertain_significance: String,
    /// Vus details.
    pub vus_details: String,
    /// Known familial variant.
    pub known_familial_variant: String,
    /// Familial variant details.
    pub familial_variant_details: String,
}

// ─── Psychological Impact (Step 9) ───────────────────────────

/// Psychological impact.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PsychologicalImpact {
    /// Psychological readiness.
    pub psychological_readiness: String,
    /// Genetic counselling.
    pub genetic_counselling: String,
    /// Family communication.
    pub family_communication: String,
    /// Insurance implications.
    pub insurance_implications: String,
    /// Insurance implications details.
    pub insurance_implications_details: String,
    /// Support needs.
    pub support_needs: String,
}

// ─── Clinical Review (Step 10) ───────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Clinician notes.
    pub clinician_notes: String,
    /// Recommended actions.
    pub recommended_actions: String,
    /// Follow up plan.
    pub follow_up_plan: String,
    /// Urgent referral needed.
    pub urgent_referral_needed: String,
    /// Cascade testing needed.
    pub cascade_testing_needed: String,
}

// ─── Assessment Data (all sections) ──────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Referral reason.
    pub referral_reason: ReferralReason,
    /// Family pedigree.
    pub family_pedigree: FamilyPedigree,
    /// Personal medical history.
    pub personal_medical_history: PersonalMedicalHistory,
    /// Cancer risk assessment.
    pub cancer_risk_assessment: CancerRiskAssessment,
    /// Cardiac genetic risk.
    pub cardiac_genetic_risk: CardiacGeneticRisk,
    /// Reproductive genetics.
    pub reproductive_genetics: ReproductiveGenetics,
    /// Genetic testing status.
    pub genetic_testing_status: GeneticTestingStatus,
    /// Psychological impact.
    pub psychological_impact: PsychologicalImpact,
    /// Clinical review.
    pub clinical_review: ClinicalReview,
}

// ─── Grading types ───────────────────────────────────────────

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
    /// Risk level.
    pub risk_level: RiskLevel,
    /// Risk score.
    pub risk_score: u32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
