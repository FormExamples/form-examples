#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_050933_patients;
mod m20260701_050955_clinicians;
mod m20260701_051020_assessments;
mod m20260701_051045_grades;
mod m20260701_051118_grading_fired_rules;
mod m20260701_051138_grading_additional_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_050933_patients::Migration),
            Box::new(m20260701_050955_clinicians::Migration),
            Box::new(m20260701_051020_assessments::Migration),
            Box::new(m20260701_051045_grades::Migration),
            Box::new(m20260701_051118_grading_fired_rules::Migration),
            Box::new(m20260701_051138_grading_additional_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}