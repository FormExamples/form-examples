#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_131707_patients;
mod m20260702_131733_clinicians;
mod m20260702_131758_has_bled_score_for_major_bleeding_risks;
mod m20260702_131822_has_bled_score_for_major_bleeding_risk_grades;
mod m20260702_131848_has_bled_score_for_major_bleeding_risk_grade_rules;
mod m20260702_131910_has_bled_score_for_major_bleeding_risk_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_131707_patients::Migration),
            Box::new(m20260702_131733_clinicians::Migration),
            Box::new(m20260702_131758_has_bled_score_for_major_bleeding_risks::Migration),
            Box::new(m20260702_131822_has_bled_score_for_major_bleeding_risk_grades::Migration),
            Box::new(m20260702_131848_has_bled_score_for_major_bleeding_risk_grade_rules::Migration),
            Box::new(m20260702_131910_has_bled_score_for_major_bleeding_risk_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
