#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_041352_patients;
mod m20260701_041411_clinicians;
mod m20260701_041432_centers;
mod m20260701_041504_international_certificate_of_vaccination_or_prophylaxes;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_041352_patients::Migration),
            Box::new(m20260701_041411_clinicians::Migration),
            Box::new(m20260701_041432_centers::Migration),
            Box::new(m20260701_041504_international_certificate_of_vaccination_or_prophylaxes::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
