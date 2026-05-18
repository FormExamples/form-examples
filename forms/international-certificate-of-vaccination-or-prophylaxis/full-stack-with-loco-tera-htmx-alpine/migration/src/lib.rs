#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]

pub use sea_orm_migration::prelude::*;

mod m20260101_000001_create_patient;
mod m20260101_000002_create_clinician;
mod m20260101_000003_create_center;
mod m20260101_000004_create_international_certificate_of_vaccination_or_prophylaxis;
mod m20260101_000005_create_international_certificate_of_vaccination_or_prophylaxis_entry;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20260101_000001_create_patient::Migration),
            Box::new(m20260101_000002_create_clinician::Migration),
            Box::new(m20260101_000003_create_center::Migration),
            Box::new(
                m20260101_000004_create_international_certificate_of_vaccination_or_prophylaxis::Migration,
            ),
            Box::new(
                m20260101_000005_create_international_certificate_of_vaccination_or_prophylaxis_entry::Migration,
            ),
        ]
    }
}
