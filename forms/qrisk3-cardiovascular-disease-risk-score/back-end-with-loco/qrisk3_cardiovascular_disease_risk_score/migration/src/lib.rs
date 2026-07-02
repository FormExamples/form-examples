#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_132633_patients;
mod m20260702_132650_clinicians;
mod m20260702_132718_qrisk3_cardiovascular_disease_risk_scores;
mod m20260702_132744_qrisk3_cardiovascular_disease_risk_score_grades;
mod m20260702_132803_qrisk3_cardiovascular_disease_risk_score_grade_rules;
mod m20260702_132824_qrisk3_cardiovascular_disease_risk_score_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_132633_patients::Migration),
            Box::new(m20260702_132650_clinicians::Migration),
            Box::new(m20260702_132718_qrisk3_cardiovascular_disease_risk_scores::Migration),
            Box::new(m20260702_132744_qrisk3_cardiovascular_disease_risk_score_grades::Migration),
            Box::new(m20260702_132803_qrisk3_cardiovascular_disease_risk_score_grade_rules::Migration),
            Box::new(m20260702_132824_qrisk3_cardiovascular_disease_risk_score_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}