#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_054151_patients;
mod m20260701_054212_clinicians;
mod m20260701_054233_toxicology_test_results;
mod m20260701_054305_toxicology_test_result_grades;
mod m20260701_054328_toxicology_test_result_grade_rules;
mod m20260701_054358_toxicology_test_result_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_054151_patients::Migration),
            Box::new(m20260701_054212_clinicians::Migration),
            Box::new(m20260701_054233_toxicology_test_results::Migration),
            Box::new(m20260701_054305_toxicology_test_result_grades::Migration),
            Box::new(m20260701_054328_toxicology_test_result_grade_rules::Migration),
            Box::new(m20260701_054358_toxicology_test_result_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
