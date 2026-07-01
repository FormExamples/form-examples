#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260630_203205_patients;
mod m20260630_203231_clinicians;
mod m20260630_203301_assessments;
mod m20260630_203323_grades;
mod m20260630_203348_grading_fired_rules;
mod m20260630_203418_grading_additional_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260630_203205_patients::Migration),
            Box::new(m20260630_203231_clinicians::Migration),
            Box::new(m20260630_203301_assessments::Migration),
            Box::new(m20260630_203323_grades::Migration),
            Box::new(m20260630_203348_grading_fired_rules::Migration),
            Box::new(m20260630_203418_grading_additional_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}