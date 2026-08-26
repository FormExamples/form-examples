#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_051123_patients;
mod m20260701_051155_clinicians;
mod m20260701_051220_medications;
mod m20260701_051256_patient_medications;
mod m20260701_051317_allergies;
mod m20260701_051341_patient_allergies;
mod m20260701_051403_pre_operative_assessment_by_clinicians;
mod m20260701_051440_pre_operative_assessment_by_clinician_grades;
mod m20260701_051508_pre_operative_assessment_by_clinician_grade_rules;
mod m20260723_120000_add_fields_to_pre_operative_assessment_by_clinicians;
mod m20260814_090000_add_glp1_and_frailty_fields_to_pre_operative_assessment_by_clinicians;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_051123_patients::Migration),
            Box::new(m20260701_051155_clinicians::Migration),
            Box::new(m20260701_051220_medications::Migration),
            Box::new(m20260701_051256_patient_medications::Migration),
            Box::new(m20260701_051317_allergies::Migration),
            Box::new(m20260701_051341_patient_allergies::Migration),
            Box::new(m20260701_051403_pre_operative_assessment_by_clinicians::Migration),
            Box::new(m20260701_051440_pre_operative_assessment_by_clinician_grades::Migration),
            Box::new(m20260701_051508_pre_operative_assessment_by_clinician_grade_rules::Migration),
            Box::new(m20260723_120000_add_fields_to_pre_operative_assessment_by_clinicians::Migration),
            Box::new(m20260814_090000_add_glp1_and_frailty_fields_to_pre_operative_assessment_by_clinicians::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
