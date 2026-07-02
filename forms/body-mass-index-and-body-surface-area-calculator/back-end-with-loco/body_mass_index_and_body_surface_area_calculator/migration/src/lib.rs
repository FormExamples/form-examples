#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_220457_patients;
mod m20260702_220521_clinicians;
mod m20260702_220546_body_mass_index_and_body_surface_area_calculators;
mod m20260702_220610_body_mass_index_and_body_surface_area_calculator_grades;
mod m20260702_220634_body_mass_index_and_body_surface_area_calculator_grade_rules;
mod m20260702_220654_body_mass_index_and_body_surface_area_calculator_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_220457_patients::Migration),
            Box::new(m20260702_220521_clinicians::Migration),
            Box::new(m20260702_220546_body_mass_index_and_body_surface_area_calculators::Migration),
            Box::new(m20260702_220610_body_mass_index_and_body_surface_area_calculator_grades::Migration),
            Box::new(m20260702_220634_body_mass_index_and_body_surface_area_calculator_grade_rules::Migration),
            Box::new(m20260702_220654_body_mass_index_and_body_surface_area_calculator_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}