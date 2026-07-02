#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_221607_patients;
mod m20260702_221626_clinicians;
mod m20260702_221644_glasgow_blatchford_bleeding_scores;
mod m20260702_221705_glasgow_blatchford_bleeding_score_grades;
mod m20260702_221725_glasgow_blatchford_bleeding_score_grade_rules;
mod m20260702_221745_glasgow_blatchford_bleeding_score_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_221607_patients::Migration),
            Box::new(m20260702_221626_clinicians::Migration),
            Box::new(m20260702_221644_glasgow_blatchford_bleeding_scores::Migration),
            Box::new(m20260702_221705_glasgow_blatchford_bleeding_score_grades::Migration),
            Box::new(m20260702_221725_glasgow_blatchford_bleeding_score_grade_rules::Migration),
            Box::new(m20260702_221745_glasgow_blatchford_bleeding_score_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}