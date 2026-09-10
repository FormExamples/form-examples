#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260910_091140_patients;
mod m20260910_091203_clinicians;
mod m20260910_091232_diabetes_podiatry_assessments;
mod m20260910_091256_diabetes_podiatry_assessment_grades;
mod m20260910_091327_diabetes_podiatry_assessment_grade_rules;
mod m20260910_091348_diabetes_podiatry_assessment_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260910_091140_patients::Migration),
            Box::new(m20260910_091203_clinicians::Migration),
            Box::new(m20260910_091232_diabetes_podiatry_assessments::Migration),
            Box::new(m20260910_091256_diabetes_podiatry_assessment_grades::Migration),
            Box::new(m20260910_091327_diabetes_podiatry_assessment_grade_rules::Migration),
            Box::new(m20260910_091348_diabetes_podiatry_assessment_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
