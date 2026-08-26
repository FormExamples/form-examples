#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_042108_patients;
mod m20260701_042128_clinicians;
mod m20260701_042155_lumbar_puncture_test_requests;
mod m20260701_042214_lumbar_puncture_test_request_grades;
mod m20260701_042238_lumbar_puncture_test_request_grade_rules;
mod m20260701_042301_lumbar_puncture_test_request_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_042108_patients::Migration),
            Box::new(m20260701_042128_clinicians::Migration),
            Box::new(m20260701_042155_lumbar_puncture_test_requests::Migration),
            Box::new(m20260701_042214_lumbar_puncture_test_request_grades::Migration),
            Box::new(m20260701_042238_lumbar_puncture_test_request_grade_rules::Migration),
            Box::new(m20260701_042301_lumbar_puncture_test_request_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
