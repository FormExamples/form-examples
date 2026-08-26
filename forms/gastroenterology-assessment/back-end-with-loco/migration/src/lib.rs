#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_064726_patients;
mod m20260701_064742_clinicians;
mod m20260701_064757_assessments;
mod m20260701_064813_grades;
mod m20260701_064830_grading_fired_rules;
mod m20260701_064847_grading_additional_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_064726_patients::Migration),
            Box::new(m20260701_064742_clinicians::Migration),
            Box::new(m20260701_064757_assessments::Migration),
            Box::new(m20260701_064813_grades::Migration),
            Box::new(m20260701_064830_grading_fired_rules::Migration),
            Box::new(m20260701_064847_grading_additional_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
