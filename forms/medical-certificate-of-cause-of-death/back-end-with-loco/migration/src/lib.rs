#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_213457_patients;
mod m20260702_213522_clinicians;
mod m20260702_213545_medical_certificate_of_cause_of_deaths;
mod m20260702_213608_medical_certificate_of_cause_of_death_grades;
mod m20260702_213630_medical_certificate_of_cause_of_death_grade_rules;
mod m20260702_213655_medical_certificate_of_cause_of_death_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_213457_patients::Migration),
            Box::new(m20260702_213522_clinicians::Migration),
            Box::new(m20260702_213545_medical_certificate_of_cause_of_deaths::Migration),
            Box::new(m20260702_213608_medical_certificate_of_cause_of_death_grades::Migration),
            Box::new(m20260702_213630_medical_certificate_of_cause_of_death_grade_rules::Migration),
            Box::new(m20260702_213655_medical_certificate_of_cause_of_death_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
