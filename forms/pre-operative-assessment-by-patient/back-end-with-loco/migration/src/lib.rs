#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_051219_patients;
mod m20260701_051254_clinicians;
mod m20260701_051315_pre_operative_assessment_by_patients;
mod m20260723_090000_pre_operative_assessment_by_patients_add_fields;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_051219_patients::Migration),
            Box::new(m20260701_051254_clinicians::Migration),
            Box::new(m20260701_051315_pre_operative_assessment_by_patients::Migration),
            Box::new(m20260723_090000_pre_operative_assessment_by_patients_add_fields::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
