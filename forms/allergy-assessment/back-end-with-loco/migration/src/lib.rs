#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260630_201822_patients;
mod m20260630_201844_clinicians;
mod m20260630_201908_assessments;
mod m20260630_201943_assessment_drug_allergies;
mod m20260630_202005_assessment_drug_allergy_items;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260630_201822_patients::Migration),
            Box::new(m20260630_201844_clinicians::Migration),
            Box::new(m20260630_201908_assessments::Migration),
            Box::new(m20260630_201943_assessment_drug_allergies::Migration),
            Box::new(m20260630_202005_assessment_drug_allergy_items::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
