#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260722_213355_patient_reported_outcome_measures;
mod m20260722_213427_patient_reported_outcome_measures_scores;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260722_213355_patient_reported_outcome_measures::Migration),
            Box::new(m20260722_213427_patient_reported_outcome_measures_scores::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}