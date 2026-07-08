#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_040725_patients;
mod m20260701_040745_clinicians;
mod m20260701_040807_holter_monitor_test_results;
mod m20260701_040831_holter_monitor_test_result_grades;
mod m20260701_040910_holter_monitor_test_result_grade_rules;
mod m20260701_041019_holter_monitor_test_result_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_040725_patients::Migration),
            Box::new(m20260701_040745_clinicians::Migration),
            Box::new(m20260701_040807_holter_monitor_test_results::Migration),
            Box::new(m20260701_040831_holter_monitor_test_result_grades::Migration),
            Box::new(m20260701_040910_holter_monitor_test_result_grade_rules::Migration),
            Box::new(m20260701_041019_holter_monitor_test_result_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}