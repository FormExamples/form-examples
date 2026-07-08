#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_055608_patients;
mod m20260701_055626_hipaa_authorizations;
mod m20260701_055644_signers;
mod m20260701_055702_disclosing_sources;
mod m20260701_055726_authorized_recipients;
mod m20260701_055757_records_to_discloses;
mod m20260701_055818_purpose_of_disclosures;
mod m20260701_055838_expirations;
mod m20260701_055902_patient_rights_acknowledgements;
mod m20260701_055930_signature_witnesses;
mod m20260701_060000_validation_results;
mod m20260701_060022_validation_fired_rules;
mod m20260701_060052_validation_additional_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_055608_patients::Migration),
            Box::new(m20260701_055626_hipaa_authorizations::Migration),
            Box::new(m20260701_055644_signers::Migration),
            Box::new(m20260701_055702_disclosing_sources::Migration),
            Box::new(m20260701_055726_authorized_recipients::Migration),
            Box::new(m20260701_055757_records_to_discloses::Migration),
            Box::new(m20260701_055818_purpose_of_disclosures::Migration),
            Box::new(m20260701_055838_expirations::Migration),
            Box::new(m20260701_055902_patient_rights_acknowledgements::Migration),
            Box::new(m20260701_055930_signature_witnesses::Migration),
            Box::new(m20260701_060000_validation_results::Migration),
            Box::new(m20260701_060022_validation_fired_rules::Migration),
            Box::new(m20260701_060052_validation_additional_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}