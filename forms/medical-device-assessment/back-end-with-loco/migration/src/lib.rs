#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20261028_183008_manufacturers;
mod m20261028_183024_assessors;
mod m20261028_183040_medical_device_assessments;
mod m20261028_183057_medical_device_assessment_grades;
mod m20261028_183114_medical_device_assessment_grade_rules;
mod m20261028_183133_medical_device_assessment_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20261028_183008_manufacturers::Migration),
            Box::new(m20261028_183024_assessors::Migration),
            Box::new(m20261028_183040_medical_device_assessments::Migration),
            Box::new(m20261028_183057_medical_device_assessment_grades::Migration),
            Box::new(m20261028_183114_medical_device_assessment_grade_rules::Migration),
            Box::new(m20261028_183133_medical_device_assessment_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
