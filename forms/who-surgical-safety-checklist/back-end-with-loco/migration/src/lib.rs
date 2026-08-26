#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_061130_patients;
mod m20260701_061151_clinicians;
mod m20260701_061210_who_surgical_safety_checklists;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_061130_patients::Migration),
            Box::new(m20260701_061151_clinicians::Migration),
            Box::new(m20260701_061210_who_surgical_safety_checklists::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
