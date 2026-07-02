#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_220456_patients;
mod m20260702_220518_clinicians;
mod m20260702_220542_parkland_formula_for_burns;
mod m20260702_220607_parkland_formula_for_burns_grades;
mod m20260702_221013_parkland_formula_for_burns_grade_rules;
mod m20260702_221036_parkland_formula_for_burns_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_220456_patients::Migration),
            Box::new(m20260702_220518_clinicians::Migration),
            Box::new(m20260702_220542_parkland_formula_for_burns::Migration),
            Box::new(m20260702_220607_parkland_formula_for_burns_grades::Migration),
            Box::new(m20260702_221013_parkland_formula_for_burns_grade_rules::Migration),
            Box::new(m20260702_221036_parkland_formula_for_burns_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}