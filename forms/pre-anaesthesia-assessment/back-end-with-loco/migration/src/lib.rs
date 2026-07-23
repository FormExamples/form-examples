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
mod m20260701_051403_pre_anaesthesia_assessments;
mod m20260701_051440_pre_anaesthesia_assessment_grades;
mod m20260701_051508_pre_anaesthesia_assessment_grade_rules;
mod m20260723_015542_pre_anaesthesia_assessment_add_proforma_fields;
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
            Box::new(m20260701_051403_pre_anaesthesia_assessments::Migration),
            Box::new(m20260701_051440_pre_anaesthesia_assessment_grades::Migration),
            Box::new(m20260701_051508_pre_anaesthesia_assessment_grade_rules::Migration),
            Box::new(m20260723_015542_pre_anaesthesia_assessment_add_proforma_fields::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}