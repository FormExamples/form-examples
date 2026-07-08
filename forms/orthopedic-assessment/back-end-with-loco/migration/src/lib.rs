#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_045556_patients;
mod m20260701_045620_clinicians;
mod m20260701_045644_assessments;
mod m20260701_045708_assessment_range_of_motions;
mod m20260701_045734_assessment_rom_measurements;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_045556_patients::Migration),
            Box::new(m20260701_045620_clinicians::Migration),
            Box::new(m20260701_045644_assessments::Migration),
            Box::new(m20260701_045708_assessment_range_of_motions::Migration),
            Box::new(m20260701_045734_assessment_rom_measurements::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}