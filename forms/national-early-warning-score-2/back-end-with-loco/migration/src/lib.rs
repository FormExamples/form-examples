#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_091654_patients;
mod m20260702_091717_clinicians;
mod m20260702_091742_national_early_warning_score_2s;
mod m20260702_091803_national_early_warning_score_2_grades;
mod m20260702_091828_national_early_warning_score_2_grade_rules;
mod m20260702_091853_national_early_warning_score_2_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_091654_patients::Migration),
            Box::new(m20260702_091717_clinicians::Migration),
            Box::new(m20260702_091742_national_early_warning_score_2s::Migration),
            Box::new(m20260702_091803_national_early_warning_score_2_grades::Migration),
            Box::new(m20260702_091828_national_early_warning_score_2_grade_rules::Migration),
            Box::new(m20260702_091853_national_early_warning_score_2_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
