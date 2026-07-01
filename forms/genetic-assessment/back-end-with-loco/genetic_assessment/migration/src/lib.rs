#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_035435_patients;
mod m20260701_035457_clinicians;
mod m20260701_035520_assessments;
mod m20260701_035545_assessment_cancer_histories;
mod m20260701_035610_assessment_cancer_history_items;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_035435_patients::Migration),
            Box::new(m20260701_035457_clinicians::Migration),
            Box::new(m20260701_035520_assessments::Migration),
            Box::new(m20260701_035545_assessment_cancer_histories::Migration),
            Box::new(m20260701_035610_assessment_cancer_history_items::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}