#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_045251_patients;
mod m20260701_045312_clinicians;
mod m20260701_045333_assessments;
mod m20260701_045352_assessment_current_medications;
mod m20260701_045420_assessment_medication_items;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_045251_patients::Migration),
            Box::new(m20260701_045312_clinicians::Migration),
            Box::new(m20260701_045333_assessments::Migration),
            Box::new(m20260701_045352_assessment_current_medications::Migration),
            Box::new(m20260701_045420_assessment_medication_items::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
