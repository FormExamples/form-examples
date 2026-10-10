#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20261010_115124_suppliers;
mod m20261010_115143_assessors;
mod m20261010_115203_products;
mod m20261010_115222_uk_nhs_digital_technology_assessment_criteria;
mod m20261010_115243_uk_nhs_digital_technology_assessment_criteria_grades;
mod m20261010_115407_uk_nhs_digital_technology_assessment_criteria_grade_rules;
mod m20261010_115429_uk_nhs_digital_technology_assessment_criteria_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20261010_115124_suppliers::Migration),
            Box::new(m20261010_115143_assessors::Migration),
            Box::new(m20261010_115203_products::Migration),
            Box::new(m20261010_115222_uk_nhs_digital_technology_assessment_criteria::Migration),
            Box::new(m20261010_115243_uk_nhs_digital_technology_assessment_criteria_grades::Migration),
            Box::new(m20261010_115407_uk_nhs_digital_technology_assessment_criteria_grade_rules::Migration),
            Box::new(m20261010_115429_uk_nhs_digital_technology_assessment_criteria_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
