#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_040656_patients;
mod m20260701_040721_clinicians;
mod m20260701_040742_holter_monitor_test_requests;
mod m20260701_040804_holter_monitor_test_request_grades;
mod m20260701_040833_holter_monitor_test_request_grade_rules;
mod m20260701_040911_holter_monitor_test_request_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_040656_patients::Migration),
            Box::new(m20260701_040721_clinicians::Migration),
            Box::new(m20260701_040742_holter_monitor_test_requests::Migration),
            Box::new(m20260701_040804_holter_monitor_test_request_grades::Migration),
            Box::new(m20260701_040833_holter_monitor_test_request_grade_rules::Migration),
            Box::new(m20260701_040911_holter_monitor_test_request_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
