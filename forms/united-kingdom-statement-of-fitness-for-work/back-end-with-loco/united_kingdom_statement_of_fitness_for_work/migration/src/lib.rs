#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_055443_patients;
mod m20260701_055502_clinicians;
mod m20260701_055523_medical_practices;
mod m20260701_055553_united_kingdom_statement_of_fitness_for_works;
mod m20260701_055613_united_kingdom_statement_of_fitness_for_work_grades;
mod m20260701_055635_united_kingdom_statement_of_fitness_for_work_grade_rules;
mod m20260701_055655_united_kingdom_statement_of_fitness_for_work_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_055443_patients::Migration),
            Box::new(m20260701_055502_clinicians::Migration),
            Box::new(m20260701_055523_medical_practices::Migration),
            Box::new(m20260701_055553_united_kingdom_statement_of_fitness_for_works::Migration),
            Box::new(m20260701_055613_united_kingdom_statement_of_fitness_for_work_grades::Migration),
            Box::new(m20260701_055635_united_kingdom_statement_of_fitness_for_work_grade_rules::Migration),
            Box::new(m20260701_055655_united_kingdom_statement_of_fitness_for_work_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}