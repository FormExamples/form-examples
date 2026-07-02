#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_215419_patients;
mod m20260702_215443_clinicians;
mod m20260702_215507_corrected_calcium_calculators;
mod m20260702_215532_corrected_calcium_calculator_grades;
mod m20260702_215555_corrected_calcium_calculator_grade_rules;
mod m20260702_215620_corrected_calcium_calculator_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_215419_patients::Migration),
            Box::new(m20260702_215443_clinicians::Migration),
            Box::new(m20260702_215507_corrected_calcium_calculators::Migration),
            Box::new(m20260702_215532_corrected_calcium_calculator_grades::Migration),
            Box::new(m20260702_215555_corrected_calcium_calculator_grade_rules::Migration),
            Box::new(m20260702_215620_corrected_calcium_calculator_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}