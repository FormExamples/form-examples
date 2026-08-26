#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_132647_patients;
mod m20260702_132708_clinicians;
mod m20260702_132734_caprini_venous_thromboembolism_risk_assessments;
mod m20260702_132802_caprini_venous_thromboembolism_risk_assessment_grades;
mod m20260702_132822_caprini_venous_thromboembolism_risk_assessment_grade_rules;
mod m20260702_132842_caprini_venous_thromboembolism_risk_assessment_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_132647_patients::Migration),
            Box::new(m20260702_132708_clinicians::Migration),
            Box::new(m20260702_132734_caprini_venous_thromboembolism_risk_assessments::Migration),
            Box::new(m20260702_132802_caprini_venous_thromboembolism_risk_assessment_grades::Migration),
            Box::new(m20260702_132822_caprini_venous_thromboembolism_risk_assessment_grade_rules::Migration),
            Box::new(m20260702_132842_caprini_venous_thromboembolism_risk_assessment_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
