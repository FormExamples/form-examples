#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_135723_patients;
mod m20260702_135753_clinicians;
mod m20260702_135825_apgar_scores;
mod m20260702_135847_apgar_score_timepoints;
mod m20260702_135916_apgar_score_grades;
mod m20260702_135942_apgar_score_grade_rules;
mod m20260702_140007_apgar_score_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_135723_patients::Migration),
            Box::new(m20260702_135753_clinicians::Migration),
            Box::new(m20260702_135825_apgar_scores::Migration),
            Box::new(m20260702_135847_apgar_score_timepoints::Migration),
            Box::new(m20260702_135916_apgar_score_grades::Migration),
            Box::new(m20260702_135942_apgar_score_grade_rules::Migration),
            Box::new(m20260702_140007_apgar_score_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
