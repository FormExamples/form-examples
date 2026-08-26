#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_211716_patients;
mod m20260702_211737_clinicians;
mod m20260702_211812_learning_disability_annual_health_checks;
mod m20260702_211849_learning_disability_annual_health_check_grades;
mod m20260702_211909_learning_disability_annual_health_check_grade_rules;
mod m20260702_211932_learning_disability_annual_health_check_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_211716_patients::Migration),
            Box::new(m20260702_211737_clinicians::Migration),
            Box::new(m20260702_211812_learning_disability_annual_health_checks::Migration),
            Box::new(m20260702_211849_learning_disability_annual_health_check_grades::Migration),
            Box::new(m20260702_211909_learning_disability_annual_health_check_grade_rules::Migration),
            Box::new(m20260702_211932_learning_disability_annual_health_check_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
