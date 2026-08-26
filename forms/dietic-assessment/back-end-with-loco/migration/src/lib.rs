#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260813_201218_patients;
mod m20260813_201236_dietitians;
mod m20260813_201254_medications;
mod m20260813_201313_patient_medications;
mod m20260813_201333_allergies;
mod m20260813_201353_patient_allergies;
mod m20260813_201414_dietic_assessments;
mod m20260813_201436_dietic_assessment_grades;
mod m20260813_201459_dietic_assessment_grade_rules;
mod m20260813_201523_dietic_assessment_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260813_201218_patients::Migration),
            Box::new(m20260813_201236_dietitians::Migration),
            Box::new(m20260813_201254_medications::Migration),
            Box::new(m20260813_201313_patient_medications::Migration),
            Box::new(m20260813_201333_allergies::Migration),
            Box::new(m20260813_201353_patient_allergies::Migration),
            Box::new(m20260813_201414_dietic_assessments::Migration),
            Box::new(m20260813_201436_dietic_assessment_grades::Migration),
            Box::new(m20260813_201459_dietic_assessment_grade_rules::Migration),
            Box::new(m20260813_201523_dietic_assessment_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
