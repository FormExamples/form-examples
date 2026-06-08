//! Domain types for the LP1H validity engine. Mirrors the SvelteKit
//! `src/lib/engine/types.ts` and the static HTML `js/types.js`.
//!
//! `serde(rename_all = "camelCase")` is applied to every struct that crosses
//! the wire to the front-end so the Rust shape is interchange-compatible
//! with the TypeScript and JavaScript engines.

use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};

/// ENGINE version.
pub const ENGINE_VERSION: &str = "0.1.0";

/// Donor.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Donor {
    /// Title.
    #[serde(default)] pub title: String,
    /// Given names.
    #[serde(default)] pub given_names: String,
    /// Family name.
    #[serde(default)] pub family_name: String,
    /// Other names used.
    #[serde(default)] pub other_names_used: String,
    /// Birth date.
    #[serde(default)] pub birth_date: String,
    /// Email.
    #[serde(default)] pub email: String,
    /// Phone.
    #[serde(default)] pub phone: String,
    /// Postal address as full text.
    #[serde(default)] pub postal_address_as_full_text: String,
    /// Country as iso 3166 1 alpha 2.
    #[serde(default)] pub country_as_iso_3166_1_alpha_2: String,
    /// Postcode.
    #[serde(default)] pub postcode: String,
    /// United kingdom NHS number.
    #[serde(default)] pub united_kingdom_nhs_number: String,
    /// Jurisdiction.
    #[serde(default)] pub jurisdiction: String,
    /// Preferred language.
    #[serde(default)] pub preferred_language: String,
    /// Capacity declared.
    #[serde(default)] pub capacity_declared: String,
    /// Capacity declared at.
    #[serde(default)] pub capacity_declared_at: String,
}

/// Attorney.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Attorney {
    /// Title.
    #[serde(default)] pub title: String,
    /// Given names.
    #[serde(default)] pub given_names: String,
    /// Family name.
    #[serde(default)] pub family_name: String,
    /// Birth date.
    #[serde(default)] pub birth_date: String,
    /// Email.
    #[serde(default)] pub email: String,
    /// Phone.
    #[serde(default)] pub phone: String,
    /// Postal address as full text.
    #[serde(default)] pub postal_address_as_full_text: String,
    /// Country as iso 3166 1 alpha 2.
    #[serde(default)] pub country_as_iso_3166_1_alpha_2: String,
    /// Postcode.
    #[serde(default)] pub postcode: String,
    /// Relationship to donor.
    #[serde(default)] pub relationship_to_donor: String,
    /// Is bankrupt.
    #[serde(default)] pub is_bankrupt: String,
    /// Capacity declared.
    #[serde(default)] pub capacity_declared: String,
}

/// Replacement attorney.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ReplacementAttorney {
    /// Attorney.
    #[serde(flatten)] pub attorney: Attorney,
    /// Replacement trigger.
    #[serde(default)] pub replacement_trigger: String,
}

/// Certificate provider.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct CertificateProvider {
    /// Title.
    #[serde(default)] pub title: String,
    /// Given names.
    #[serde(default)] pub given_names: String,
    /// Family name.
    #[serde(default)] pub family_name: String,
    /// Email.
    #[serde(default)] pub email: String,
    /// Phone.
    #[serde(default)] pub phone: String,
    /// Postal address as full text.
    #[serde(default)] pub postal_address_as_full_text: String,
    /// Country as iso 3166 1 alpha 2.
    #[serde(default)] pub country_as_iso_3166_1_alpha_2: String,
    /// Postcode.
    #[serde(default)] pub postcode: String,
    /// Route.
    #[serde(default)] pub route: String,
    /// Profession.
    #[serde(default)] pub profession: String,
    /// Profession registration number.
    #[serde(default)] pub profession_registration_number: String,
    /// Years known donor.
    #[serde(default)] pub years_known_donor: Option<f64>,
    /// Relationship to donor.
    #[serde(default)] pub relationship_to_donor: String,
    /// Declared not family.
    #[serde(default)] pub declared_not_family: String,
    /// Declared not employee.
    #[serde(default)] pub declared_not_employee: String,
    /// Declared not attorney.
    #[serde(default)] pub declared_not_attorney: String,
}

/// Person to notify.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct PersonToNotify {
    /// Title.
    #[serde(default)] pub title: String,
    /// Given names.
    #[serde(default)] pub given_names: String,
    /// Family name.
    #[serde(default)] pub family_name: String,
    /// Email.
    #[serde(default)] pub email: String,
    /// Phone.
    #[serde(default)] pub phone: String,
    /// Postal address as full text.
    #[serde(default)] pub postal_address_as_full_text: String,
    /// Country as iso 3166 1 alpha 2.
    #[serde(default)] pub country_as_iso_3166_1_alpha_2: String,
    /// Postcode.
    #[serde(default)] pub postcode: String,
    /// Relationship to donor.
    #[serde(default)] pub relationship_to_donor: String,
}

/// Preference.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Preference {
    /// Category.
    #[serde(default)] pub category: String,
    /// Statement.
    #[serde(default)] pub statement: String,
}

/// Instruction.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Instruction {
    /// Category.
    #[serde(default)] pub category: String,
    /// Statement.
    #[serde(default)] pub statement: String,
    /// Lawfulness assessed.
    #[serde(default)] pub lawfulness_assessed: String,
    /// Contradicts adrt.
    #[serde(default)] pub contradicts_adrt: String,
}

/// Signature.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Signature {
    /// Signer role.
    #[serde(default)] pub signer_role: String,
    /// Signer index.
    #[serde(default)] pub signer_index: u32,
    /// Signed at.
    #[serde(default)] pub signed_at: String,
    /// Signature method.
    #[serde(default)] pub signature_method: String,
    /// Witness name.
    #[serde(default)] pub witness_name: String,
    /// Witness address.
    #[serde(default)] pub witness_address: String,
    /// Witness signed at.
    #[serde(default)] pub witness_signed_at: String,
    /// Witness is attorney.
    #[serde(default)] pub witness_is_attorney: String,
}

/// Registration application.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct RegistrationApplication {
    /// Applicant role.
    #[serde(default)] pub applicant_role: String,
    /// Applicant signed at.
    #[serde(default)] pub applicant_signed_at: String,
    /// Fee amount pounds.
    #[serde(default)] pub fee_amount_pounds: f64,
    /// Fee remission.
    #[serde(default)] pub fee_remission: String,
    /// Fee remission reason.
    #[serde(default)] pub fee_remission_reason: String,
    /// Submitted at.
    #[serde(default)] pub submitted_at: String,
    /// Submission channel.
    #[serde(default)] pub submission_channel: String,
}

/// LPA application.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct LpaApplication {
    /// Form version.
    #[serde(default = "default_form_version")] pub form_version: String,
    /// Jurisdiction.
    #[serde(default)] pub jurisdiction: String,
    /// Donor.
    #[serde(default)] pub donor: Donor,
    /// Attorneys.
    #[serde(default)] pub attorneys: Vec<Attorney>,
    /// Replacement attorneys.
    #[serde(default)] pub replacement_attorneys: Vec<ReplacementAttorney>,
    /// Certificate provider.
    #[serde(default)] pub certificate_provider: Option<CertificateProvider>,
    /// People to notify.
    #[serde(default)] pub people_to_notify: Vec<PersonToNotify>,
    /// Decision rule.
    #[serde(default)] pub decision_rule: String,
    /// Joint decision set.
    #[serde(default)] pub joint_decision_set: String,
    /// Lst choice.
    #[serde(default)] pub lst_choice: String,
    /// Lst donor initialled.
    #[serde(default)] pub lst_donor_initialled: String,
    /// Preferences.
    #[serde(default)] pub preferences: Vec<Preference>,
    /// Instructions.
    #[serde(default)] pub instructions: Vec<Instruction>,
    /// Signatures.
    #[serde(default)] pub signatures: Vec<Signature>,
    /// Registration.
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

/// Rule severity.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "kebab-case")]
pub enum RuleSeverity {
    /// Fatal.
    Fatal,
    /// High.
    High,
    /// Medium.
    Medium,
    /// Informational.
    Informational,
}

/// Fired rule.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// Rule ID.
    pub rule_id: String,
    /// Severity.
    pub severity: RuleSeverity,
    /// Rule family.
    pub rule_family: String,
    /// Source citation.
    pub source_citation: String,
    /// Description.
    pub description: String,
    /// Suggested correction.
    pub suggested_correction: String,
}

/// Additional flag.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// Flag ID.
    pub flag_id: String,
    /// Category.
    pub category: String,
    /// Priority.
    pub priority: String,
    /// Description.
    pub description: String,
    /// Suggested action.
    pub suggested_action: String,
}

/// Validity status.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "kebab-case")]
pub enum ValidityStatus {
    /// Ready to register.
    ReadyToRegister,
    /// Needs correction.
    NeedsCorrection,
    /// Invalid.
    Invalid,
}

/// LPA validity result.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct LpaValidityResult {
    /// Validity status.
    pub validity_status: ValidityStatus,
    /// Completeness score.
    pub completeness_score: u32,
    /// Effective date.
    pub effective_date: Option<NaiveDate>,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Engine version.
    pub engine_version: String,
    /// Computed at.
    pub computed_at: DateTime<Utc>,
}
