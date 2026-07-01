#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_042755_patients;
mod m20260701_042813_clinicians;
mod m20260701_042849_medical_information_form_for_air_travels;
mod m20260701_042912_medical_information_form_for_air_travel_grades;
mod m20260701_042936_medical_information_form_for_air_travel_grade_rules;
mod m20260701_043001_medical_information_form_for_air_travel_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_042755_patients::Migration),
            Box::new(m20260701_042813_clinicians::Migration),
            Box::new(m20260701_042849_medical_information_form_for_air_travels::Migration),
            Box::new(m20260701_042912_medical_information_form_for_air_travel_grades::Migration),
            Box::new(m20260701_042936_medical_information_form_for_air_travel_grade_rules::Migration),
            Box::new(m20260701_043001_medical_information_form_for_air_travel_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}