#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_214546_patients;
mod m20260702_214609_clinicians;
mod m20260702_214633_estimated_glomerular_filtration_rate_calculators;
mod m20260702_214713_estimated_glomerular_filtration_rate_calculator_grades;
mod m20260702_214737_estimated_glomerular_filtration_rate_calculator_grade_rules;
mod m20260702_214800_estimated_glomerular_filtration_rate_calculator_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_214546_patients::Migration),
            Box::new(m20260702_214609_clinicians::Migration),
            Box::new(m20260702_214633_estimated_glomerular_filtration_rate_calculators::Migration),
            Box::new(m20260702_214713_estimated_glomerular_filtration_rate_calculator_grades::Migration),
            Box::new(m20260702_214737_estimated_glomerular_filtration_rate_calculator_grade_rules::Migration),
            Box::new(m20260702_214800_estimated_glomerular_filtration_rate_calculator_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
