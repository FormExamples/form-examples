//! Domain types for the LP1H validity engine. Mirrors the SvelteKit
//! `src/lib/engine/types.ts` and the static HTML `js/types.js`.
//!
//! `serde(rename_all = "camelCase")` is applied to every struct that crosses
//! the wire to the front-end so the Rust shape is interchange-compatible
//! with the TypeScript and JavaScript engines.

use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};

pub const ENGINE_VERSION: &str = "0.1.0";

#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Donor {
    #[serde(default)] pub title: String,
    #[serde(default)] pub given_names: String,
    #[serde(default)] pub family_name: String,
    #[serde(default)] pub other_names_used: String,
    #[serde(default)] pub birth_date: String,
    #[serde(default)] pub email: String,
    #[serde(default)] pub phone: String,
    #[serde(default)] pub postal_address_as_full_text: String,
    #[serde(default)] pub country_as_iso_3166_1_alpha_2: String,
    #[serde(default)] pub postcode: String,
    #[serde(default)] pub united_kingdom_nhs_number: String,
    #[serde(default)] pub jurisdiction: String,
    #[serde(default)] pub preferred_language: String,
    #[serde(default)] pub capacity_declared: String,
    #[serde(default)] pub capacity_declared_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Attorney {
    #[serde(default)] pub title: String,
    #[serde(default)] pub given_names: String,
    #[serde(default)] pub family_name: String,
    #[serde(default)] pub birth_date: String,
    #[serde(default)] pub email: String,
    #[serde(default)] pub phone: String,
    #[serde(default)] pub postal_address_as_full_text: String,
    #[serde(default)] pub country_as_iso_3166_1_alpha_2: String,
    #[serde(default)] pub postcode: String,
    #[serde(default)] pub relationship_to_donor: String,
    #[serde(default)] pub is_bankrupt: String,
    #[serde(default)] pub capacity_declared: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ReplacementAttorney {
    #[serde(flatten)] pub attorney: Attorney,
    #[serde(default)] pub replacement_trigger: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct CertificateProvider {
    #[serde(default)] pub title: String,
    #[serde(default)] pub given_names: String,
    #[serde(default)] pub family_name: String,
    #[serde(default)] pub email: String,
    #[serde(default)] pub phone: String,
    #[serde(default)] pub postal_address_as_full_text: String,
    #[serde(default)] pub country_as_iso_3166_1_alpha_2: String,
    #[serde(default)] pub postcode: String,
    #[serde(default)] pub route: String,
    #[serde(default)] pub profession: String,
    #[serde(default)] pub profession_registration_number: String,
    #[serde(default)] pub years_known_donor: Option<f64>,
    #[serde(default)] pub relationship_to_donor: String,
    #[serde(default)] pub declared_not_family: String,
    #[serde(default)] pub declared_not_employee: String,
    #[serde(default)] pub declared_not_attorney: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct PersonToNotify {
    #[serde(default)] pub title: String,
    #[serde(default)] pub given_names: String,
    #[serde(default)] pub family_name: String,
    #[serde(default)] pub email: String,
    #[serde(default)] pub phone: String,
    #[serde(default)] pub postal_address_as_full_text: String,
    #[serde(default)] pub country_as_iso_3166_1_alpha_2: String,
    #[serde(default)] pub postcode: String,
    #[serde(default)] pub relationship_to_donor: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Preference {
    #[serde(default)] pub category: String,
    #[serde(default)] pub statement: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Instruction {
    #[serde(default)] pub category: String,
    #[serde(default)] pub statement: String,
    #[serde(default)] pub lawfulness_assessed: String,
    #[serde(default)] pub contradicts_adrt: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Signature {
    #[serde(default)] pub signer_role: String,
    #[serde(default)] pub signer_index: u32,
    #[serde(default)] pub signed_at: String,
    #[serde(default)] pub signature_method: String,
    #[serde(default)] pub witness_name: String,
    #[serde(default)] pub witness_address: String,
    #[serde(default)] pub witness_signed_at: String,
    #[serde(default)] pub witness_is_attorney: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct RegistrationApplication {
    #[serde(default)] pub applicant_role: String,
    #[serde(default)] pub applicant_signed_at: String,
    #[serde(default)] pub fee_amount_pounds: f64,
    #[serde(default)] pub fee_remission: String,
    #[serde(default)] pub fee_remission_reason: String,
    #[serde(default)] pub submitted_at: String,
    #[serde(default)] pub submission_channel: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct LpaApplication {
    #[serde(default = "default_form_version")] pub form_version: String,
    #[serde(default)] pub jurisdiction: String,
    #[serde(default)] pub donor: Donor,
    #[serde(default)] pub attorneys: Vec<Attorney>,
    #[serde(default)] pub replacement_attorneys: Vec<ReplacementAttorney>,
    #[serde(default)] pub certificate_provider: Option<CertificateProvider>,
    #[serde(default)] pub people_to_notify: Vec<PersonToNotify>,
    #[serde(default)] pub decision_rule: String,
    #[serde(default)] pub joint_decision_set: String,
    #[serde(default)] pub lst_choice: String,
    #[serde(default)] pub lst_donor_initialled: String,
    #[serde(default)] pub preferences: Vec<Preference>,
    #[serde(default)] pub instructions: Vec<Instruction>,
    #[serde(default)] pub signatures: Vec<Signature>,
    #[serde(default)] pub registration: RegistrationApplication,
}

fn default_form_version() -> String { "LP1H-2024".to_string() }

impl Default for LpaApplication {
    fn default() -> Self {
        Self {
            form_version: default_form_version(),
            jurisdiction: String::new(),
            donor: Donor::default(),
            attorneys: Vec::new(),
            replacement_attorneys: Vec::new(),
            certificate_provider: None,
            people_to_notify: Vec::new(),
            decision_rule: String::new(),
            joint_decision_set: String::new(),
            lst_choice: String::new(),
            lst_donor_initialled: String::new(),
            preferences: Vec::new(),
            instructions: Vec::new(),
            signatures: Vec::new(),
            registration: RegistrationApplication::default(),
        }
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "kebab-case")]
pub enum RuleSeverity {
    Fatal,
    High,
    Medium,
    Informational,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub rule_id: String,
    pub severity: RuleSeverity,
    pub rule_family: String,
    pub source_citation: String,
    pub description: String,
    pub suggested_correction: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub flag_id: String,
    pub category: String,
    pub priority: String,
    pub description: String,
    pub suggested_action: String,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "kebab-case")]
pub enum ValidityStatus {
    ReadyToRegister,
    NeedsCorrection,
    Invalid,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct LpaValidityResult {
    pub validity_status: ValidityStatus,
    pub completeness_score: u32,
    pub effective_date: Option<NaiveDate>,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub engine_version: String,
    pub computed_at: DateTime<Utc>,
}
