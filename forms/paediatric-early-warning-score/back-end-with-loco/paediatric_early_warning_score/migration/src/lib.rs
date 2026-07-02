#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_141216_patients;
mod m20260702_141240_clinicians;
mod m20260702_141311_paediatric_early_warning_scores;
mod m20260702_141333_paediatric_early_warning_score_grades;
mod m20260702_141404_paediatric_early_warning_score_grade_rules;
mod m20260702_141432_paediatric_early_warning_score_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_141216_patients::Migration),
            Box::new(m20260702_141240_clinicians::Migration),
            Box::new(m20260702_141311_paediatric_early_warning_scores::Migration),
            Box::new(m20260702_141333_paediatric_early_warning_score_grades::Migration),
            Box::new(m20260702_141404_paediatric_early_warning_score_grade_rules::Migration),
            Box::new(m20260702_141432_paediatric_early_warning_score_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}