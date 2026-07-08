#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_034302_patients;
mod m20260701_034323_clinicians;
mod m20260701_034344_assessments;
mod m20260701_034410_grades;
mod m20260701_034436_grading_fired_rules;
mod m20260701_034507_grading_additional_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_034302_patients::Migration),
            Box::new(m20260701_034323_clinicians::Migration),
            Box::new(m20260701_034344_assessments::Migration),
            Box::new(m20260701_034410_grades::Migration),
            Box::new(m20260701_034436_grading_fired_rules::Migration),
            Box::new(m20260701_034507_grading_additional_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}