#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_045533_patients;
mod m20260701_045600_clinicians;
mod m20260701_045623_assessments;
mod m20260701_045647_grades;
mod m20260701_045711_grading_fired_rules;
mod m20260701_045735_grading_additional_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_045533_patients::Migration),
            Box::new(m20260701_045600_clinicians::Migration),
            Box::new(m20260701_045623_assessments::Migration),
            Box::new(m20260701_045647_grades::Migration),
            Box::new(m20260701_045711_grading_fired_rules::Migration),
            Box::new(m20260701_045735_grading_additional_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}