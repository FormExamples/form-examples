#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260630_202120_patients;
mod m20260630_202144_clinicians;
mod m20260630_202207_ambulatory_blood_pressure_test_requests;
mod m20260630_202233_ambulatory_blood_pressure_test_request_grades;
mod m20260630_202310_ambulatory_blood_pressure_test_request_grade_rules;
mod m20260630_202334_ambulatory_blood_pressure_test_request_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260630_202120_patients::Migration),
            Box::new(m20260630_202144_clinicians::Migration),
            Box::new(m20260630_202207_ambulatory_blood_pressure_test_requests::Migration),
            Box::new(m20260630_202233_ambulatory_blood_pressure_test_request_grades::Migration),
            Box::new(m20260630_202310_ambulatory_blood_pressure_test_request_grade_rules::Migration),
            Box::new(m20260630_202334_ambulatory_blood_pressure_test_request_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}