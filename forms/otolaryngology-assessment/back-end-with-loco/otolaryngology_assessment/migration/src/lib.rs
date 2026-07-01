#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_045834_patients;
mod m20260701_045859_clinicians;
mod m20260701_045919_assessments;
mod m20260701_045938_grades;
mod m20260701_045958_grading_fired_rules;
mod m20260701_050020_grading_additional_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_045834_patients::Migration),
            Box::new(m20260701_045859_clinicians::Migration),
            Box::new(m20260701_045919_assessments::Migration),
            Box::new(m20260701_045938_grades::Migration),
            Box::new(m20260701_045958_grading_fired_rules::Migration),
            Box::new(m20260701_050020_grading_additional_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}