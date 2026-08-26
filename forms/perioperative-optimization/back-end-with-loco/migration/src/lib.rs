#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260813_222523_patients;
mod m20260813_222540_clinicians;
mod m20260813_222557_medications;
mod m20260813_222615_patient_medications;
mod m20260813_222633_allergies;
mod m20260813_222652_patient_allergies;
mod m20260813_222711_perioperative_optimizations;
mod m20260813_222733_perioperative_optimization_grades;
mod m20260813_222754_perioperative_optimization_grade_domains;
mod m20260813_222815_perioperative_optimization_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260813_222523_patients::Migration),
            Box::new(m20260813_222540_clinicians::Migration),
            Box::new(m20260813_222557_medications::Migration),
            Box::new(m20260813_222615_patient_medications::Migration),
            Box::new(m20260813_222633_allergies::Migration),
            Box::new(m20260813_222652_patient_allergies::Migration),
            Box::new(m20260813_222711_perioperative_optimizations::Migration),
            Box::new(m20260813_222733_perioperative_optimization_grades::Migration),
            Box::new(m20260813_222754_perioperative_optimization_grade_domains::Migration),
            Box::new(m20260813_222815_perioperative_optimization_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
