#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260630_201439_patients;
mod m20260630_201504_clinicians;
mod m20260630_201530_assessments;
mod m20260630_201555_grades;
mod m20260630_201620_grading_fired_rules;
mod m20260630_201646_grading_additional_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260630_201439_patients::Migration),
            Box::new(m20260630_201504_clinicians::Migration),
            Box::new(m20260630_201530_assessments::Migration),
            Box::new(m20260630_201555_grades::Migration),
            Box::new(m20260630_201620_grading_fired_rules::Migration),
            Box::new(m20260630_201646_grading_additional_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
