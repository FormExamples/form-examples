#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_062311_patients;
mod m20260701_062328_clinicians;
mod m20260701_062346_assessments;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_062311_patients::Migration),
            Box::new(m20260701_062328_clinicians::Migration),
            Box::new(m20260701_062346_assessments::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
