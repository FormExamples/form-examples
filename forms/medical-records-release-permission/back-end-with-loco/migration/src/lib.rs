#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_043130_patients;
mod m20260701_043154_clinicians;
mod m20260701_043225_release_forms;
mod m20260701_043246_authorized_recipients;
mod m20260701_043311_records_to_releases;
mod m20260701_043333_purpose_of_releases;
mod m20260701_043403_authorization_periods;
mod m20260701_043427_restrictions_limitations;
mod m20260701_043449_patient_rights;
mod m20260701_043514_signature_consents;
mod m20260701_043537_validation_results;
mod m20260701_043616_validation_fired_rules;
mod m20260701_043639_validation_additional_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_043130_patients::Migration),
            Box::new(m20260701_043154_clinicians::Migration),
            Box::new(m20260701_043225_release_forms::Migration),
            Box::new(m20260701_043246_authorized_recipients::Migration),
            Box::new(m20260701_043311_records_to_releases::Migration),
            Box::new(m20260701_043333_purpose_of_releases::Migration),
            Box::new(m20260701_043403_authorization_periods::Migration),
            Box::new(m20260701_043427_restrictions_limitations::Migration),
            Box::new(m20260701_043449_patient_rights::Migration),
            Box::new(m20260701_043514_signature_consents::Migration),
            Box::new(m20260701_043537_validation_results::Migration),
            Box::new(m20260701_043616_validation_fired_rules::Migration),
            Box::new(m20260701_043639_validation_additional_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}